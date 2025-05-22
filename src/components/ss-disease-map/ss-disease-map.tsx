import { Component, Element, Host, Event, EventEmitter, Prop, h, State } from '@stencil/core';
import L, { LatLng } from 'leaflet';
import { DiseaseCaseEntry, Configuration, DiseaseMonitorCasesApi } from '../../api/disease-monitor';

@Component({
  tag: 'ss-disease-map',
  styleUrl: 'ss-disease-map.css',
  shadow: true,
})
export class SsDiseaseMap {
  
  @Element() el: HTMLElement;
  private map!: L.Map;

  diseaseCases: DiseaseCaseEntry[];

  @State() errorMessage: string;
  @Event({ eventName: 'map-clicked'}) mapClicked: EventEmitter<string>;
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() imagePath: string="";
  @Prop() apiBase: string;
  @Prop() regionId: string;

  private async getDiseaseCasesAsync(): Promise<DiseaseCaseEntry[]>{
    // be prepared for connectivitiy issues
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const waitingListApi = new DiseaseMonitorCasesApi(configuration);
      const response = await waitingListApi.getDiseaseCaseEntriesRaw({regionId: this.regionId})
      if (response.raw.status < 299) {
        return await response.value();
      } else {
        this.errorMessage = `Cannot retrieve list of disease cases: ${response.raw.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of disease cases: ${err.message || "unknown"}`
    }
    return [];
  }
  
  async componentWillLoad() {
    this.diseaseCases = await this.getDiseaseCasesAsync();
  }

  async componentDidLoad() {
    // set up Leaflet interactive Map after component loads
    const mapContainer = this.el.shadowRoot.querySelector("#disease-map") as HTMLElement;
    this.map = L.map(mapContainer).setView([48.1486, 17.1077], 13);  // set initial coords to Bratislava
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // link to image folder - contains default marker images
    L.Icon.Default.imagePath = this.imagePath + 'leaflet/images/';
    
    // Add markers for disease cases after map is ready
    this.diseaseCases.forEach(diseaseCase => {
      const coords = new LatLng(diseaseCase.latitude, diseaseCase.longtitude);
      const marker = L.marker(coords).addTo(this.map);
      const popupDiv = document.createElement('div');

      popupDiv.innerHTML = `
        <b>${diseaseCase.disease.value}<b>
        <br>Reported on: ${diseaseCase.diseaseStart.toISOString().split('T')[0]}
        <br><a href="#">Edit</a>
      `

      popupDiv.querySelector('a')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.entryClicked.emit(diseaseCase.id);
      });

      marker.bindPopup(popupDiv);
    });
    
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = Math.round(e.latlng.lat * 100000) / 100000;
      const lng = Math.round(e.latlng.lng * 100000) / 100000;
      const coords = `${lat},${lng}`
      const popupDiv = document.createElement('div');
      
      popupDiv.innerHTML = `
        <b><a href="#">Report new disease case</a><b>
        <br>at ${lat}°, ${lng}°`
      
      popupDiv.querySelector('a')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.mapClicked.emit(coords);
      });

      var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(popupDiv)
        .openOn(this.map);

    });
  }

  render() {
    return (
      <Host>
        {this.errorMessage
        ? <div class="error">{this.errorMessage}</div>
        :
        <div id="disease-map"></div>
        }
      </Host>
    );
  }
}
