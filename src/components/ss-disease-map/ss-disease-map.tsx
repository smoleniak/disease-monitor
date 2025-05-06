import { Component, Element, Host, h } from '@stencil/core';
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

  private async getDiseaseCasesAsync(){
    return await Promise.resolve(
      [{
          disease: 'SARS-CoV-2',
          coords: [48.1486, 17.1077],
          diseaseStart: new Date(Date.now() - 3600 * 48 * 1000),
          patientName: 'Jožko Púčik',
          patientId: '10001',
      }, {
          disease: 'SLAK',
          coords: [48.156, 17.098],
          diseaseStart: new Date(Date.now() - 3600 * 72 * 1000),
          patientName: 'Bc. August Cézar',
          patientId: '10096',
      }, {
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
    this.map = L.map(mapContainer).setView([48.1486, 17.1077], 10);  // set initial coords to Bratislava
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.Icon.Default.imagePath = '/leaflet/images/';
    
    // Add markers after map is ready
    this.diseaseCases.forEach(({ coords, disease, diseaseStart }) => {
      L.marker(coords).addTo(this.map).bindPopup(`<b>${disease}<b><br>Reported on: ${diseaseStart.toISOString().split('T')[0]}`);
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
