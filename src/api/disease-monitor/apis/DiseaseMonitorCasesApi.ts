/* tslint:disable */
/* eslint-disable */
/**
 * Disease Monitor Api
 * Disease Monitor management for Web-In-Cloud system
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: xsmoleniak@stuba.sk
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  DiseaseCaseEntry,
} from '../models';
import {
    DiseaseCaseEntryFromJSON,
    DiseaseCaseEntryToJSON,
} from '../models';

export interface CreateDiseaseCaseListEntryRequest {
    regionId: string;
    diseaseCaseEntry: DiseaseCaseEntry;
}

export interface DeleteDiseaseCaseEntryRequest {
    regionId: string;
    entryId: string;
}

export interface GetDiseaseCaseEntriesRequest {
    regionId: string;
    diseaseType?: string;
    activeCasesOnly?: boolean;
}

export interface GetDiseaseCaseEntryRequest {
    regionId: string;
    entryId: string;
}

export interface UpdateDiseaseCaseEntryRequest {
    regionId: string;
    entryId: string;
    diseaseCaseEntry: DiseaseCaseEntry;
}

/**
 * DiseaseMonitorCasesApi - interface
 * 
 * @export
 * @interface DiseaseMonitorCasesApiInterface
 */
export interface DiseaseMonitorCasesApiInterface {
    /**
     * Use this method to store new entry into the disease case list.
     * @summary Saves new entry into disease case list
     * @param {string} regionId pass the id of the particular geographic region
     * @param {DiseaseCaseEntry} diseaseCaseEntry Disease case entry to store
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiseaseMonitorCasesApiInterface
     */
    createDiseaseCaseListEntryRaw(requestParameters: CreateDiseaseCaseListEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DiseaseCaseEntry>>;

    /**
     * Use this method to store new entry into the disease case list.
     * Saves new entry into disease case list
     */
    createDiseaseCaseListEntry(requestParameters: CreateDiseaseCaseListEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DiseaseCaseEntry>;

    /**
     * Use this method to delete the specific entry from the disease case list.
     * @summary Deletes specific entry
     * @param {string} regionId pass the id of the particular region
     * @param {string} entryId pass the id of the particular entry in the disease cas
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiseaseMonitorCasesApiInterface
     */
    deleteDiseaseCaseEntryRaw(requestParameters: DeleteDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Use this method to delete the specific entry from the disease case list.
     * Deletes specific entry
     */
    deleteDiseaseCaseEntry(requestParameters: DeleteDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * You get list of existing disease cases
     * @summary Provides the disease case entries
     * @param {string} regionId pass the id of the geographic region
     * @param {string} [diseaseType] Optional filter for disease type
     * @param {boolean} [activeCasesOnly] Optional filter to return only active (true) cases
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiseaseMonitorCasesApiInterface
     */
    getDiseaseCaseEntriesRaw(requestParameters: GetDiseaseCaseEntriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<DiseaseCaseEntry>>>;

    /**
     * You get list of existing disease cases
     * Provides the disease case entries
     */
    getDiseaseCaseEntries(requestParameters: GetDiseaseCaseEntriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<DiseaseCaseEntry>>;

    /**
     * By using regionId and entryId you can details of particular entry.
     * @summary Provides details about disase case entry
     * @param {string} regionId pass the id of the particular geographic region
     * @param {string} entryId pass the id of the particular entry
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiseaseMonitorCasesApiInterface
     */
    getDiseaseCaseEntryRaw(requestParameters: GetDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DiseaseCaseEntry>>;

    /**
     * By using regionId and entryId you can details of particular entry.
     * Provides details about disase case entry
     */
    getDiseaseCaseEntry(requestParameters: GetDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DiseaseCaseEntry>;

    /**
     * Use this method to update content of the disease case entry.
     * @summary Updates specific entry
     * @param {string} regionId pass the id of the particular region
     * @param {string} entryId pass the id of the particular entry
     * @param {DiseaseCaseEntry} diseaseCaseEntry disease case entry to update
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiseaseMonitorCasesApiInterface
     */
    updateDiseaseCaseEntryRaw(requestParameters: UpdateDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DiseaseCaseEntry>>;

    /**
     * Use this method to update content of the disease case entry.
     * Updates specific entry
     */
    updateDiseaseCaseEntry(requestParameters: UpdateDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DiseaseCaseEntry>;

}

/**
 * 
 */
export class DiseaseMonitorCasesApi extends runtime.BaseAPI implements DiseaseMonitorCasesApiInterface {

    /**
     * Use this method to store new entry into the disease case list.
     * Saves new entry into disease case list
     */
    async createDiseaseCaseListEntryRaw(requestParameters: CreateDiseaseCaseListEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DiseaseCaseEntry>> {
        if (requestParameters.regionId === null || requestParameters.regionId === undefined) {
            throw new runtime.RequiredError('regionId','Required parameter requestParameters.regionId was null or undefined when calling createDiseaseCaseListEntry.');
        }

        if (requestParameters.diseaseCaseEntry === null || requestParameters.diseaseCaseEntry === undefined) {
            throw new runtime.RequiredError('diseaseCaseEntry','Required parameter requestParameters.diseaseCaseEntry was null or undefined when calling createDiseaseCaseListEntry.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/disease-monitor/{regionId}/entries`.replace(`{${"regionId"}}`, encodeURIComponent(String(requestParameters.regionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DiseaseCaseEntryToJSON(requestParameters.diseaseCaseEntry),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DiseaseCaseEntryFromJSON(jsonValue));
    }

    /**
     * Use this method to store new entry into the disease case list.
     * Saves new entry into disease case list
     */
    async createDiseaseCaseListEntry(requestParameters: CreateDiseaseCaseListEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DiseaseCaseEntry> {
        const response = await this.createDiseaseCaseListEntryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Use this method to delete the specific entry from the disease case list.
     * Deletes specific entry
     */
    async deleteDiseaseCaseEntryRaw(requestParameters: DeleteDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.regionId === null || requestParameters.regionId === undefined) {
            throw new runtime.RequiredError('regionId','Required parameter requestParameters.regionId was null or undefined when calling deleteDiseaseCaseEntry.');
        }

        if (requestParameters.entryId === null || requestParameters.entryId === undefined) {
            throw new runtime.RequiredError('entryId','Required parameter requestParameters.entryId was null or undefined when calling deleteDiseaseCaseEntry.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/disease-monitor/{regionId}/entries/{entryId}`.replace(`{${"regionId"}}`, encodeURIComponent(String(requestParameters.regionId))).replace(`{${"entryId"}}`, encodeURIComponent(String(requestParameters.entryId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Use this method to delete the specific entry from the disease case list.
     * Deletes specific entry
     */
    async deleteDiseaseCaseEntry(requestParameters: DeleteDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDiseaseCaseEntryRaw(requestParameters, initOverrides);
    }

    /**
     * You get list of existing disease cases
     * Provides the disease case entries
     */
    async getDiseaseCaseEntriesRaw(requestParameters: GetDiseaseCaseEntriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<DiseaseCaseEntry>>> {
        if (requestParameters.regionId === null || requestParameters.regionId === undefined) {
            throw new runtime.RequiredError('regionId','Required parameter requestParameters.regionId was null or undefined when calling getDiseaseCaseEntries.');
        }

        const queryParameters: any = {};

        if (requestParameters.diseaseType !== undefined) {
            queryParameters['diseaseType'] = requestParameters.diseaseType;
        }

        if (requestParameters.activeCasesOnly !== undefined) {
            queryParameters['activeCasesOnly'] = requestParameters.activeCasesOnly;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/disease-monitor/{regionId}/entries`.replace(`{${"regionId"}}`, encodeURIComponent(String(requestParameters.regionId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DiseaseCaseEntryFromJSON));
    }

    /**
     * You get list of existing disease cases
     * Provides the disease case entries
     */
    async getDiseaseCaseEntries(requestParameters: GetDiseaseCaseEntriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<DiseaseCaseEntry>> {
        const response = await this.getDiseaseCaseEntriesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * By using regionId and entryId you can details of particular entry.
     * Provides details about disase case entry
     */
    async getDiseaseCaseEntryRaw(requestParameters: GetDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DiseaseCaseEntry>> {
        if (requestParameters.regionId === null || requestParameters.regionId === undefined) {
            throw new runtime.RequiredError('regionId','Required parameter requestParameters.regionId was null or undefined when calling getDiseaseCaseEntry.');
        }

        if (requestParameters.entryId === null || requestParameters.entryId === undefined) {
            throw new runtime.RequiredError('entryId','Required parameter requestParameters.entryId was null or undefined when calling getDiseaseCaseEntry.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/disease-monitor/{regionId}/entries/{entryId}`.replace(`{${"regionId"}}`, encodeURIComponent(String(requestParameters.regionId))).replace(`{${"entryId"}}`, encodeURIComponent(String(requestParameters.entryId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DiseaseCaseEntryFromJSON(jsonValue));
    }

    /**
     * By using regionId and entryId you can details of particular entry.
     * Provides details about disase case entry
     */
    async getDiseaseCaseEntry(requestParameters: GetDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DiseaseCaseEntry> {
        const response = await this.getDiseaseCaseEntryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Use this method to update content of the disease case entry.
     * Updates specific entry
     */
    async updateDiseaseCaseEntryRaw(requestParameters: UpdateDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DiseaseCaseEntry>> {
        if (requestParameters.regionId === null || requestParameters.regionId === undefined) {
            throw new runtime.RequiredError('regionId','Required parameter requestParameters.regionId was null or undefined when calling updateDiseaseCaseEntry.');
        }

        if (requestParameters.entryId === null || requestParameters.entryId === undefined) {
            throw new runtime.RequiredError('entryId','Required parameter requestParameters.entryId was null or undefined when calling updateDiseaseCaseEntry.');
        }

        if (requestParameters.diseaseCaseEntry === null || requestParameters.diseaseCaseEntry === undefined) {
            throw new runtime.RequiredError('diseaseCaseEntry','Required parameter requestParameters.diseaseCaseEntry was null or undefined when calling updateDiseaseCaseEntry.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/disease-monitor/{regionId}/entries/{entryId}`.replace(`{${"regionId"}}`, encodeURIComponent(String(requestParameters.regionId))).replace(`{${"entryId"}}`, encodeURIComponent(String(requestParameters.entryId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: DiseaseCaseEntryToJSON(requestParameters.diseaseCaseEntry),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DiseaseCaseEntryFromJSON(jsonValue));
    }

    /**
     * Use this method to update content of the disease case entry.
     * Updates specific entry
     */
    async updateDiseaseCaseEntry(requestParameters: UpdateDiseaseCaseEntryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DiseaseCaseEntry> {
        const response = await this.updateDiseaseCaseEntryRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
