import { newSpecPage } from '@stencil/core/testing';
import { SsDiseaseCaseEditor } from '../ss-disease-case-editor';
import fetchMock from 'jest-fetch-mock';
import { Disease, DiseaseCaseEntry } from '../../../api/disease-monitor';

describe('ss-disease-case-editor', () => {
  const sampleEntry: DiseaseCaseEntry = {
    id: "entry-1",
    patient: {
      id: "p-12",
      name: "Michael Test"
    },
    disease: {
      value: "SLAK",
      code: "slintacka-krivacka"
    },
    diseaseStart: new Date("20240203T12:00"),
    latitude: 48.14,
    longtitude: 17.56 
  };

  const sampleDiseases: Disease[] = [
    {
      value: "SARS-CoV-19",
      code: "covid",
      typicalDurationDays: 14
    },
    {
      value: "SLAK",
      code: "slintacka-krivacka",
      typicalDurationDays: 7
    },
  ];

  let delay = async (milliseconds: number) => await new Promise<void>(resolve => {
    setTimeout(() => resolve(), milliseconds);
  });

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('buttons shall be of different type', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleDiseases), { status: 200 }]
    );

    const page = await newSpecPage({
      components: [SsDiseaseCaseEditor],
      html: `<ss-disease-case-editor entry-id="test-entry" region-id="svk" api-base="http://sample.test/api"></ss-disease-case-editor>`,
    });

    await delay(300);
    await page.waitForChanges();

    const items: any = await page.root.shadowRoot.querySelectorAll("md-filled-button");
    expect(items.length).toEqual(1);
  });

  it('first text field is patient name', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(sampleEntry), { status: 200 }],
      [JSON.stringify(sampleDiseases), { status: 200 }]
    );

    const page = await newSpecPage({
      components: [SsDiseaseCaseEditor],
      html: `<ss-disease-case-editor entry-id="test-entry" region-id="svk" api-base="http://sample.test/api"></ss-disease-case-editor>`,
    });

    await delay(300);
    await page.waitForChanges();

    const items: any = await page.root.shadowRoot.querySelectorAll("md-filled-text-field");
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].getAttribute("value")).toEqual(sampleEntry.patient.name);
  });
});