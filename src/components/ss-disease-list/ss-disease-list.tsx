import { Component, Event, EventEmitter, Host, h } from '@stencil/core';

@Component({
  tag: 'ss-disease-list',
  styleUrl: 'ss-disease-list.css',
  shadow: true,
})
export class SsDiseaseList {

  diseaseCases: any[];
  
  @Event({ eventName: "entry-clicked"}) entryClicked: EventEmitter<string>;

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

  render() {
    return (
      <Host>
        <md-list>
          {this.diseaseCases.map((diseaseCase, index) =>
            <md-list-item onClick={ () => this.entryClicked.emit(index.toString()) }>
              <div slot="headline">{diseaseCase.disease} {diseaseCase.zipCode}</div>
              <div slot="supporting-text">Location: {diseaseCase.coords[0]}°N {diseaseCase.coords[1]}°E</div>
              <div slot="supporting-text">Reported on: {diseaseCase.diseaseStart?.toISOString().split('T')[0]}</div>
              <div slot="supporting-text">Patient ID: {diseaseCase.patientId}</div>
                <md-icon slot="start">pin_drop</md-icon>
            </md-list-item>
          )}
        </md-list>
      </Host>
    )
  }
}
