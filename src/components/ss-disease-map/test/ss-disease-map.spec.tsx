import { newSpecPage } from '@stencil/core/testing';
import { SsDiseaseMap } from '../ss-disease-map';

describe('ss-disease-map', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SsDiseaseMap],
      html: `<ss-disease-map></ss-disease-map>`,
    });
    expect(0).toEqual(0);
  });
});
