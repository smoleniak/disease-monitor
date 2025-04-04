import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';

@Component({
  tag: 'ss-disease-case-editor',
  styleUrl: 'ss-disease-case-editor.css',
  shadow: true,
})
export class SsDiseaseCaseEditor {
  @Prop() entryId: string;

  @Event({eventName: "editor-closed"}) editorClosed: EventEmitter<string>;

  render() {
    return (
      <Host>
        <md-filled-select label="Choroba">
          <md-icon slot="leading-icon">sick</md-icon>
          <md-select-option value="covid">
            <div slot="headline">SARS-CoV-2</div>
          </md-select-option>
          <md-select-option value="slak">
            <div slot="headline">SLAK</div>
          </md-select-option>
          <md-select-option value="malaria">
            <div slot="headline">Malaria</div>
          </md-select-option>
        </md-filled-select>

        <md-filled-text-field label="Lokalita">
          <md-icon slot="leading-icon">pin_drop</md-icon>
        </md-filled-text-field>
  
        <md-filled-text-field label="Meno a Priezvisko" >
          <md-icon slot="leading-icon">person</md-icon>
        </md-filled-text-field>
  
        <md-filled-text-field label="Registračné číslo pacienta" >
          <md-icon slot="leading-icon">fingerprint</md-icon>
        </md-filled-text-field>
        
        <md-filled-text-field label="Nakazený od">
          <md-icon slot="leading-icon">watch_later</md-icon>
        </md-filled-text-field>

        <md-divider></md-divider>
        <div class="actions">
          <md-filled-tonal-button id="delete"
            onClick={() => this.editorClosed.emit("delete")}>
            <md-icon slot="icon">delete</md-icon>
            Zmazať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel"
            onClick={() => this.editorClosed.emit("cancel")}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm"
            onClick={() => this.editorClosed.emit("store")}>
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }
}
