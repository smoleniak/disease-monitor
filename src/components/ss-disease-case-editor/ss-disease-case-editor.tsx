import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
import { DiseaseMonitorCasesApi, DiseaseCaseEntry, DiseaseTypesApi, Disease, Configuration, Patient } from '../../api/disease-monitor';

@Component({
  tag: 'ss-disease-case-editor',
  styleUrl: 'ss-disease-case-editor.css',
  shadow: true,
})
export class SsDiseaseCaseEditor {
  @Prop() entryId: string;
  @Prop() regionId: string;
  @Prop() apiBase: string;

  @Event({eventName: "editor-closed"}) editorClosed: EventEmitter<string>;

  @State() entry: DiseaseCaseEntry;
  @State() diseases: Disease[];
  @State() errorMessage: string;
  @State() isValid: boolean;

  private formElement: HTMLFormElement;

  componentWillLoad() {
    this.getDiseaseCaseEntryAsync();
    this.getDiseases();

    // parse and store coords param if present
    const url = new URL(window.location.href);
    const coordsParam = url.searchParams.get('coords');

    if (coordsParam) {
      const [latStr, lngStr] = coordsParam.split(',');
      this.entry.latitude = Math.round(parseFloat(latStr) * 100000) / 100000;
      this.entry.longtitude = Math.round(parseFloat(lngStr) * 100000) / 100000;
    }
  }

  private async getDiseaseCaseEntryAsync(): Promise<DiseaseCaseEntry> {
    if(this.entryId === "@new") {
      this.isValid = false;
      this.entry = {
        id: "@new",
        disease: {
          value: "",
          code: ""
        },
        patient: {
          id: "",
          name: ""
        },
        latitude: 0,
        longtitude: 0,
        diseaseStart: new Date(Date.now())
      };
      return this.entry;
    }

    if ( !this.entryId ) {
      this.isValid = false;
      return undefined
    }
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const diseaseCaseApi = new DiseaseMonitorCasesApi(configuration);

      const response = await diseaseCaseApi.getDiseaseCaseEntryRaw({regionId: this.regionId, entryId: this.entryId});

      if (response.raw.status < 299) {
          this.entry = await response.value();
          this.isValid = true;
      } else {
          this.errorMessage = `Cannot retrieve disease case: ${response.raw.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve disease case: ${err.message || "unknown"}`
    }
    return undefined;
  }

  private async getDiseases(): Promise<Disease[]> {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const conditionsApi = new DiseaseTypesApi(configuration);

      const response = await conditionsApi.getDiseasesRaw({regionId: this.regionId})
      if (response.raw.status < 299) {
        this.diseases = await response.value();
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve disease types: ${err.message || "unknown"}`
    }
    // always have some fallback condition
    return this.diseases || [{
      code: "fallback",
      value: "Neurčená choroba"
    }];
  }

  render() {
    if(this.errorMessage) {
      return (
      <Host>
        <div class="error">{this.errorMessage}</div>
      </Host>
      )
    }
    return (
      <Host>
        <form ref={el => this.formElement = el}>
          {this.renderDiseaseTypes()}

          <md-filled-text-field label="Meno a priezvisko nakazeného" required
            value={this.entry?.patient?.name}
            oninput={(ev: InputEvent) => this.handlePatientNameInputEvent(ev)}>
            <md-icon slot="leading-icon">person</md-icon>
          </md-filled-text-field>
          
          <div class="column-wrapper">
            <md-filled-text-field class="column-field" label="Latitude" required value={this.entry?.latitude}
              oninput={ (ev: InputEvent) => {
                if(this.entry) {this.entry.latitude = parseFloat(this.handleInputEvent(ev))}
              } }>
              <md-icon slot="leading-icon">pin_drop</md-icon>
            </md-filled-text-field>

            <md-filled-text-field class="column-field" label="Longitude" required value={this.entry?.longtitude}
              oninput={ (ev: InputEvent) => {
                if(this.entry) {this.entry.longtitude = parseFloat(this.handleInputEvent(ev))}
              } }>
              <md-icon slot="leading-icon">pin_drop</md-icon>
            </md-filled-text-field>
          </div>
    
          <div class="column-wrapper">
            {/* Material Design does not support date pickers for web - using default HTML date picker */}
            <div class="material-like-date-field">
              <label>Dátum začiatku choroby</label>
              <input type="date" id="diseaseStart"
                      value={this.entry?.diseaseStart?.toISOString().substring(0, 10) ?? ''}
                      onInput={(ev: Event) => {
                        const target = ev.target as HTMLInputElement;
                        if (this.entry) {
                          this.entry.diseaseStart = new Date(target.value);
                          console.debug(JSON.stringify(this.entry));
                        }
                      }} />
            </div>

            <div class="material-like-date-field">
              <label>Dátum konca choroby</label>
              <input type="date" id="diseaseEnd"
                      value={this.entry?.diseaseEnd?.toISOString().substring(0, 10) ?? ''}
                      onInput={(ev: Event) => {
                        const target = ev.target as HTMLInputElement;
                        if (this.entry) {
                          this.entry.diseaseEnd = new Date(target.value);
                        }
                      }} />
            </div>
          </div>

          <md-divider></md-divider>

          <div class="actions">
            <md-filled-tonal-button id="delete" disabled={ !this.entry || this.entry?.id === "@new"}
              onClick={() => this.deleteEntry()}>
              <md-icon slot="icon">delete</md-icon>
              Zmazať
            </md-filled-tonal-button>
            <span class="stretch-fill"></span>
            <md-outlined-button id="cancel"
              onClick={() => this.editorClosed.emit("cancel")}>
              Zrušiť
            </md-outlined-button>
            <md-filled-button id="confirm" disabled={ !this.isValid }
              onClick={(ev: InputEvent) => { ev.preventDefault(); this.updateEntry(); } }>
              <md-icon slot="icon">save</md-icon>
              Uložiť
            </md-filled-button>
          </div>
        </form>
      </Host>
    );
  }

  private renderDiseaseTypes() {
    let diseases = this.diseases || [];
    // we want to have this.entry`s disease in the selection list
    if (this.entry?.disease) {
      const index = diseases.findIndex(d => d.code === this.entry.disease.code)
      if (index < 0) {
        diseases = [this.entry.disease, ...diseases]
      }
    }
    return (
      <md-filled-select id="chor" label="Choroba" required
        display-text={this.entry?.disease?.value}
        value={this.entry?.disease?.code}
        oninput={(ev: InputEvent) => this.handleDisease(ev)} >
      <md-icon slot="leading-icon">sick</md-icon>
      {diseases.map(d => {
          return (
            <md-select-option value={d.code}>
                <div slot="headline">{d.value}</div>
            </md-select-option>
          )
      })}
      </md-filled-select>
    );
  }

  private handleInputEvent( ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    // check validity of elements
    this.isValid = true;
    for (let i = 0; i < this.formElement.children.length; i++) {
        const element = this.formElement.children[i]
        if ("reportValidity" in element) {
        const valid = (element as HTMLInputElement).reportValidity();
        this.isValid &&= valid;
        }
    }
    return target.value
  }

  private handlePatientNameInputEvent( ev: InputEvent) {
    if (this.entry) {
      const name = this.handleInputEvent(ev);
      // Temporary hack to create patient object.
      // TODO: select patients from a list instead of writing patient name (same as disease)
      const patient: Patient = {
        id: 'random-1',
        name: name
      }
      this.entry.patient = Object.assign({}, patient);
    }
  }

  private handleDisease(ev: InputEvent) {
    if (this.entry) {
      const code = this.handleInputEvent(ev)
      console.debug("Selected disease code changed to: " + code);
      const disease = this.diseases.find(d => d.code === code);
      this.entry.disease = Object.assign({}, disease);
    }
  }

  private async updateEntry() {
    console.debug("Sending payload:", JSON.stringify(this.entry, null, 2));

    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const waitingListApi = new DiseaseMonitorCasesApi(configuration);

      const response = this.entryId == "@new" ?
        await waitingListApi.createDiseaseCaseListEntryRaw({regionId: this.regionId, diseaseCaseEntry: this.entry}) :
        await waitingListApi.updateDiseaseCaseEntryRaw({regionId: this.regionId, entryId: this.entryId, diseaseCaseEntry: this.entry});
      
        if (response.raw.status < 299) {
        this.editorClosed.emit("store")
      } else {
        this.errorMessage = `Cannot store entry: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot store entry: ${err.message || "unknown"}`;
    }
  }

  private async deleteEntry() {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });
  
      const waitingListApi = new DiseaseMonitorCasesApi(configuration);
  
      const response = await waitingListApi.deleteDiseaseCaseEntryRaw({regionId: this.regionId, entryId: this.entryId});
        if (response.raw.status < 299) {
        this.editorClosed.emit("delete")
        } else {
        this.errorMessage = `Cannot delete entry: ${response.raw.statusText}`
        }
    } catch (err: any) {
        this.errorMessage = `Cannot delete entry: ${err.message || "unknown"}`
    }
  }
}
