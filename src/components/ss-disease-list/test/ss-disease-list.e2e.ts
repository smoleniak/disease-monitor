import { newE2EPage } from '@stencil/core/testing';

describe('ss-disease-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ss-disease-list></ss-disease-list>');

    const element = await page.find('ss-disease-list');
    expect(element).toHaveClass('hydrated');
  });
});
