import { Component, Element, Host, Event, EventEmitter, Prop, h, State } from '@stencil/core';
import L, { LatLng } from 'leaflet';
import { DiseaseCaseEntry, Configuration, Disease, DiseaseTypesApi, DiseaseMonitorCasesApi } from '../../api/disease-monitor';

@Component({
  tag: 'ss-disease-map',
  styleUrl: 'ss-disease-map.css',
  shadow: true,
})
export class SsDiseaseMap {
  
  @Element() el: HTMLElement;
  private map!: L.Map;

  diseaseCases: DiseaseCaseEntry[];
  diseaseTypes: Disease[];
  @State() selectedDisease: Disease;
  @State() activeCasesOnly: boolean;
  @State() errorMessage: string;

  @Event({ eventName: 'map-clicked'}) mapClicked: EventEmitter<string>;
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() imagePath: string="";
  @Prop() apiBase: string;
  @Prop() regionId: string;

  private async getDiseaseCasesAsync(): Promise<DiseaseCaseEntry[]>{
    let fetchOptions: any = {
      regionId: this.regionId 
    }
    
    // add optional query params if present
    if (this.selectedDisease) {
      fetchOptions.diseaseType = this.selectedDisease.code;
    }

    if (this.activeCasesOnly !== undefined) {
      fetchOptions.activeCasesOnly = this.activeCasesOnly;
    }
    
    // be prepared for connectivitiy issues
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });
      const waitingListApi = new DiseaseMonitorCasesApi(configuration);
      const response = await waitingListApi.getDiseaseCaseEntriesRaw(fetchOptions);
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

  private async getDiseaseTypes(): Promise<Disease[]> {
      try {
        const configuration = new Configuration({
          basePath: this.apiBase,
        });
  
        const conditionsApi = new DiseaseTypesApi(configuration);
  
        const response = await conditionsApi.getDiseasesRaw({regionId: this.regionId})
        if (response.raw.status < 299) {
          this.diseaseTypes = await response.value();
        }
      } catch (err: any) {
        this.errorMessage = `Cannot retrieve disease types: ${err.message || "unknown"}`
      }
      // always have some fallback condition
      return this.diseaseTypes || [{
        code: "fallback",
        value: "Neurčená choroba"
      }];
    }
  
  async componentWillLoad() {
    this.diseaseCases = await this.getDiseaseCasesAsync();
    this.diseaseTypes = await this.getDiseaseTypes();
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
      this.addDiseaseCaseMarker(diseaseCase);
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

  private addDiseaseCaseMarker(diseaseCase: DiseaseCaseEntry) {
    const coords = new LatLng(diseaseCase.latitude, diseaseCase.longtitude);
    const marker = L.marker(coords).addTo(this.map);
    const popupDiv = document.createElement('div');
  
    popupDiv.innerHTML = `
      <b>${diseaseCase.disease.value}</b>
      <br>Reported on: ${diseaseCase.diseaseStart.toISOString().split('T')[0]}
      <br><a href="#">Edit</a>
    `;
  
    popupDiv.querySelector('a')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.entryClicked.emit(diseaseCase.id);
    });
  
    marker.bindPopup(popupDiv);
  }

  private repaintDiseaseCaseMarkers() {
    this.map.eachLayer(layer => {
      // Remove only markers, not the tile layer
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
    
    // Re-add filtered markers
    this.diseaseCases.forEach(diseaseCase => {
      this.addDiseaseCaseMarker(diseaseCase);
    });
  }

  /**
   * Handle disease filter input event, fetch disease cases, repaint map.
   * @param ev 
   */
  private async handleDiseaseTypeChange(ev: InputEvent) {
      const target = ev.target as HTMLInputElement;
      const value = target.value;
    
      if (value === "") {
        this.selectedDisease = undefined;
      } else {
        this.selectedDisease = this.diseaseTypes.find(d => d.code === value);
      }
    
      this.diseaseCases = await this.getDiseaseCasesAsync();
      this.repaintDiseaseCaseMarkers();
  }

  /**
   * Handle checkbox filter input event, fetch disease cases, repaint map.
   * @param ev 
   */
  private async handleCheckboxInputChange(ev: InputEvent) {
    const target = ev.target as HTMLInputElement;
    this.activeCasesOnly = target.checked;
    this.diseaseCases = await this.getDiseaseCasesAsync();
    this.repaintDiseaseCaseMarkers();
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>  
      )
    }

    return (
      <Host>
        <div id="main">
          <div class="top-bar">Vizualizácia prípadov ochorenia - región {this.regionId}</div>
          <div id="content">
            
            <div id="disease-map"></div>
            
            <div id="side-panel">
              
              <div id="filters">
                <div>
                  {/* <md-icon>filter_alt</md-icon> */}
                  <span>Filtrovanie ochorení</span>
                </div>

                <md-filled-select label="Filtrovať ochorenia" class="filter-field"
                  oninput={(ev: InputEvent) => this.handleDiseaseTypeChange(ev)} >
                  <md-icon slot="leading-icon">sick</md-icon>
                  
                  <md-select-option value="" Selected>
                    <div slot="headline">Všetky</div>
                  </md-select-option>
                  
                  {this.diseaseTypes.map(d => {
                    return (
                      <md-select-option value={d.code}>
                        <div slot="headline">{d.value}</div>
                      </md-select-option>
                      )
                    })}
                </md-filled-select>

                <label class="checkbox-label">
                  <md-checkbox touch-target="wrapper" 
                    oninput={ (ev: InputEvent) => this.handleCheckboxInputChange(ev)}></md-checkbox>
                  Iba aktívne prípady
                </label>
              </div>

              <div id="tooltips">
                <div class="tooltip">
                  <md-icon>add</md-icon>
                  <span>Kliknite na miesto na mape pre zadanie nového prípadu ochorenia</span>
                </div>
                <div class="tooltip">
                  <md-icon>edit</md-icon>
                  <span>Kliknite na konkrétny marker na mape pre detaily a úpravu prípadu ochorenia</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Host>
    );
  }
}
