import { newSpecPage } from '@stencil/core/testing';
import { SsDiseaseCaseEditor } from '../ss-disease-case-editor';

describe('ss-disease-case-editor', () => {
  it('buttons shall be of different type', async () => {
    const page = await newSpecPage({
      components: [SsDiseaseCaseEditor],
      html: `<ss-disease-case-editor entry-id="@new"></ss-disease-case-editor>`,
    });
    let items: any = await page.root.shadowRoot.querySelectorAll("md-filled-button");
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll("md-outlined-button");
    expect(items.length).toEqual(1);

    items = await page.root.shadowRoot.querySelectorAll("md-filled-tonal-button");
    expect(items.length).toEqual(1);
  });
});
