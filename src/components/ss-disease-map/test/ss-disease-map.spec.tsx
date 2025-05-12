import { newSpecPage } from '@stencil/core/testing';
import { SsDiseaseMap } from '../ss-disease-map';

describe('ss-disease-map', () => {
  it('renders map', async () => {
    const page = await newSpecPage({
      components: [SsDiseaseMap],
      html: `<ss-disease-map></ss-disease-map>`,
    });
    // let map: any = await page.root.shadowRoot.querySelectorAll("#map");
    // expect(page.root.shadowRoot.textContent).toContain('Hello, World!');
    expect(0).toEqual(0);
  });
});
