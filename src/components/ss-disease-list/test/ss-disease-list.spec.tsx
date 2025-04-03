import { newSpecPage } from '@stencil/core/testing';
import { SsDiseaseList } from '../ss-disease-list';

describe('ss-disease-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SsDiseaseList],
      html: `<ss-disease-list></ss-disease-list>`,
    });
    
    const diseaseCaseList = page.rootInstance as SsDiseaseList;
    const expectedDiseaseCases = diseaseCaseList.diseaseCases.length;

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedDiseaseCases);
  });
});
