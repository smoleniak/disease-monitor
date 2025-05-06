import { newE2EPage } from '@stencil/core/testing';

describe('ss-disease-map', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ss-disease-map></ss-disease-map>');

    const element = await page.find('ss-disease-map');
    expect(element).toHaveClass('hydrated');
  });
});
