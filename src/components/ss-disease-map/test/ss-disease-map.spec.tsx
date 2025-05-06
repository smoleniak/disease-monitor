import { newSpecPage } from '@stencil/core/testing';
import { SsDiseaseMap } from '../ss-disease-map';

describe('ss-disease-map', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SsDiseaseMap],
      html: `<ss-disease-map></ss-disease-map>`,
    });
    expect(page.root).toEqualHtml(`
      <ss-disease-map>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ss-disease-map>
    `);
  });
});
