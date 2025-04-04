import { newE2EPage } from '@stencil/core/testing';

describe('ss-disease-case-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ss-disease-case-editor></ss-disease-case-editor>');

    const element = await page.find('ss-disease-case-editor');
    expect(element).toHaveClass('hydrated');
  });
});
