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

import { exists, mapValues } from '../runtime';
/**
 * Describes disease
 * @export
 * @interface Disease
 */
export interface Disease {
    /**
     * 
     * @type {string}
     * @memberof Disease
     */
    value: string;
    /**
     * 
     * @type {string}
     * @memberof Disease
     */
    code: string;
    /**
     * 
     * @type {number}
     * @memberof Disease
     */
    typicalDurationDays?: number;
}

/**
 * Check if a given object implements the Disease interface.
 */
export function instanceOfDisease(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "value" in value;
    isInstance = isInstance && "code" in value;

    return isInstance;
}

export function DiseaseFromJSON(json: any): Disease {
    return DiseaseFromJSONTyped(json, false);
}

export function DiseaseFromJSONTyped(json: any, ignoreDiscriminator: boolean): Disease {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'value': json['value'],
        'code': json['code'],
        'typicalDurationDays': !exists(json, 'typicalDurationDays') ? undefined : json['typicalDurationDays'],
    };
}

export function DiseaseToJSON(value?: Disease | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'value': value.value,
        'code': value.code,
        'typicalDurationDays': value.typicalDurationDays,
    };
}

