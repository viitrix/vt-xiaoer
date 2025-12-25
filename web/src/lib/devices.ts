import type { Locales } from '$i18n/i18n-types';

export interface Role {
    deviceId: string;
    apiKey: string;
    name: string;
}

export enum DeviceType {
	VTCamera = 'ZN04',
    VTSpeaker = 'ESP32' 
}

export interface Device {
	id: string;
    dType: DeviceType;
}

export function getDefaultDevice(deviceType: DeviceType): Device {
    return {
        id : 'XXX_设备ID_XXX',
        dType: deviceType
    }
}

