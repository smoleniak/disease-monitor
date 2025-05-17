import { Component, Element, Host, Event, EventEmitter, Prop, h } from '@stencil/core';
import L from 'leaflet';

@Component({
  tag: 'ss-disease-map',
  styleUrl: 'ss-disease-map.css',
  shadow: true,
})
export class SsDiseaseMap {
  
  @Element() el: HTMLElement;

  private map!: L.Map;

  private diseaseCases: any[];

  @Prop() basePath: string="";

  @Event({ eventName: 'map-clicked'}) mapClicked: EventEmitter<string>;
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;

  private async getDiseaseCasesAsync(){
    return await Promise.resolve(
      [{
          diseaseCaseId: 'x234',
          disease: 'SARS-CoV-2',
          coords: [48.1486, 17.1079],
          diseaseStart: new Date(Date.now() - 3600 * 48 * 1000),
          patientName: 'Jožko Púčik',
          patientId: '10001',
      }, {
          diseaseCaseId: 'x235',  
          disease: 'SLAK',
          coords: [48.156, 17.098],
          diseaseStart: new Date(Date.now() - 3600 * 72 * 1000),
          patientName: 'Bc. August Cézar',
          patientId: '10096',
      }, {
          diseaseCaseId: 'x236',  
          disease: 'SARS-CoV-2',
          coords: [48.1485, 17.1071],
          diseaseStart: new Date(Date.now() - 3600 * 1 * 1000),
          patientName: 'Ing. Ferdinand Trety',
          patientId: '10028',
      }]
    );
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
    L.Icon.Default.imagePath = this.basePath + 'leaflet/images/';
    
    // Add markers for disease cases after map is ready
    this.diseaseCases.forEach(({ coords, disease, diseaseStart, diseaseCaseId }) => {
      const marker = L.marker(coords).addTo(this.map);
      const popupDiv = document.createElement('div');

      popupDiv.innerHTML = `
        <b>${disease}<b>
        <br>Reported on: ${diseaseStart.toISOString().split('T')[0]}
        <br><a href="#">Edit</a>
      `
      popupDiv.querySelector('a')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.entryClicked.emit(diseaseCaseId);
      });

      marker.bindPopup(popupDiv);
    });
    
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coords = `${e.latlng.lat},${e.latlng.lng}`;
      console.log('Emitting coords: ' + coords);
      this.mapClicked.emit(coords);
    });
  }

  render() {
    return (
      <Host>
        <div id="disease-map"></div>
      </Host>
    );
  }
}
