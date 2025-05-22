import { Component, Event, EventEmitter, Host, h, Prop, State } from '@stencil/core';
import { DiseaseCaseEntry, Configuration, DiseaseMonitorCasesApi } from '../../api/disease-monitor';

@Component({
  tag: 'ss-disease-list',
  styleUrl: 'ss-disease-list.css',
  shadow: true,
})
export class SsDiseaseList {
  
  @State() errorMessage: string;
  @Event({ eventName: "entry-clicked"}) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @Prop() regionId: string;
  
  diseaseCases: DiseaseCaseEntry[];

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

  render() {
    return (
      <Host>
        {this.errorMessage
        ? <div class="error">{this.errorMessage}</div>
        :
        <md-list>
          {this.diseaseCases.map( (diseaseCase)  =>
            <md-list-item onClick={ () => this.entryClicked.emit(diseaseCase.id) }>
              <div slot="headline">{diseaseCase.disease.value}</div>
              <div slot="supporting-text">Location: {diseaseCase.latitude}°N {diseaseCase.longtitude}°E</div>
              <div slot="supporting-text">Reported on: {diseaseCase.diseaseStart?.toISOString().split('T')[0]}</div>
              <div slot="supporting-text">Patient ID: {diseaseCase.patient.id}</div>
                <md-icon slot="start">pin_drop</md-icon>
            </md-list-item>
          )}
        </md-list>
        }
        <md-filled-icon-button class="add-button"
          onclick={() => this.entryClicked.emit("@new")}>
          <md-icon>add</md-icon>
        </md-filled-icon-button>
      </Host>
    )
  }
}
