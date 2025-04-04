import { newE2EPage } from '@stencil/core/testing';

describe('ss-disease-monitor-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ss-disease-monitor-app></ss-disease-monitor-app>');

    const element = await page.find('ss-disease-monitor-app');
    expect(element).toHaveClass('hydrated');
  });
});
