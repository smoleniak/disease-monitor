import { Component, Host, Prop, State, h } from '@stencil/core';

declare global {
  interface Window { navigation: any; }
}

@Component({
  tag: 'ss-disease-monitor-app',
  styleUrl: 'ss-disease-monitor-app.css',
  shadow: true,
})
export class SsDiseaseMonitorApp {

  @State() private relativePath = "";

  @Prop() basePath: string="";

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || "/").pathname;

    const toRelative = (path: string) => {
      if (path.startsWith( baseUri)) {
        this.relativePath = path.slice(baseUri.length)
      } else {
        this.relativePath = ""
      }
    }

    window.navigation?.addEventListener("navigate", (ev: Event) => {
      if ((ev as any).canIntercept) { (ev as any).intercept(); }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname)
  }

  render() {
    let element = "map"; // default view
    let entryId = "@new";
  
    if (this.relativePath.startsWith("entry/")) {
      element = "editor";
      entryId = this.relativePath.split("/")[1];
    } else if (this.relativePath === "list") {
      element = "list";
    } else if (this.relativePath === "map") {
      element = "map";
    }
  
    const navigate = (path: string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).href;
      window.navigation.navigate(absolute);
    };
  
    return (
      <Host>
        {element === "editor" ? (
          <ss-disease-case-editor entry-id={entryId} oneditor-closed={() => navigate("./map")}></ss-disease-case-editor>
        ) : element === "list" ? (
          <ss-disease-list
            onentry-clicked={(ev: CustomEvent<string>) => navigate("./entry/" + ev.detail)}
          ></ss-disease-list>
        ) : (
          <ss-disease-map 
            base-path={this.basePath}
            onMap-clicked={(ev: CustomEvent<string>) => navigate("./entry/@new?coords=" + ev.detail)}
          ></ss-disease-map>
        )}
      </Host>
    );
  }
  
}
