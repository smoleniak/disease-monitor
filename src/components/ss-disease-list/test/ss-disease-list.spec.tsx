import { newSpecPage } from '@stencil/core/testing';
import { SsDiseaseList } from '../ss-disease-list';
import { DiseaseCaseEntry, Disease, Patient } from '../../../api/disease-monitor/models';
import fetchMock from 'jest-fetch-mock';

describe('ss-disease-list', () => {
  const sampleEntries: DiseaseCaseEntry[] = [
    {
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
    },
    {
      id: "entry-2",
      patient: {
        id: "p-13",
        name: "Joe Test"
      },
      disease: {
        value: "SARS-CoV-19",
        code: "covid"
      },
      diseaseStart: new Date("20240204T12:00"),
      latitude: 48.21,
      longtitude: 17.43 
    }
  ];
    
  beforeAll(() => {
    fetchMock.enableMocks();
  });
  
  afterEach(() => {
    fetchMock.resetMocks();
  });
    
  it('renders', async () => {
    // Mock the API response using sampleEntries
    fetchMock.mockResponseOnce(JSON.stringify(sampleEntries));

    // Set up the page with your component
    const page = await newSpecPage({
      components: [SsDiseaseList],
      html: `<ss-disease-list region-id="svk" api-base="http://test/api"></ss-disease-list>`,
    });
    
    const caseList = page.rootInstance as SsDiseaseList;
    const expectedCases = caseList?.diseaseCases?.length;

    // Wait for the DOM to update
    await page.waitForChanges();

    // Query the rendered list items
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    // Assert that the expected number of patients and rendered items match the sample entries
    expect(expectedCases).toEqual(sampleEntries.length);
    expect(items.length).toEqual(expectedCases);
  });

  it('renders error message on network issues', async () => {
    // Mock the network error
    fetchMock.mockRejectOnce(new Error('Network Error'));

    const page = await newSpecPage({
      components: [SsDiseaseList],
      html: `<ss-disease-list region-id="svk" api-base="http://test/api"></ss-disease-list>`,
    });

    const caseList = page.rootInstance as SsDiseaseList;
    const expectedCases = caseList?.diseaseCases?.length;

    // Wait for the DOM to update
    await page.waitForChanges();

    // Query the DOM for error message and list items
    const errorMessage = page.root.shadowRoot.querySelectorAll(".error");
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    // Assert that the error message is displayed and no patients are listed
    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(expectedCases).toEqual(0);
    expect(items.length).toEqual(expectedCases);
  });
});
