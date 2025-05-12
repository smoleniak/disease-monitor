import { newSpecPage } from '@stencil/core/testing';
import { SsDiseaseMonitorApp } from '../ss-disease-monitor-app';

describe('ss-disease-monitor-app', () => {

  it('renders editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/entry/@new`,
      components: [SsDiseaseMonitorApp],
      html: `<ss-disease-monitor-app base-path="/"></ss-disease-monitor-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual("ss-disease-case-editor");

  });

  it('renders map', async () => {
    const page = await newSpecPage({
      url: `http://localhost/`,
      components: [SsDiseaseMonitorApp],
      html: `<ss-disease-monitor-app base-path="/"></ss-disease-monitor-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual("ss-disease-map");
  });

  it('renders list', async () => {
    const page = await newSpecPage({
      url: `http://localhost/disease-monitor/list`,
      components: [SsDiseaseMonitorApp],
      html: `<ss-disease-monitor-app base-path="/disease-monitor/"></ss-disease-monitor-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual("ss-disease-list");
  });
});
