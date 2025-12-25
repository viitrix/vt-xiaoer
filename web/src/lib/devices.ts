import { generateRandomId } from './utils';

export interface Role {
    apiKey: string;
    name: string;
}

export enum DeviceType {
	VTCamera = 'ZN04',
    VTSpeaker = 'ESP32' 
}

export interface Device {
	id: string;
    deviceId: string; 
    label: string;
    isVerified: boolean;
    dType: DeviceType;
}

export function getDefaultDevice(deviceType: DeviceType): Device {
    return {
        id: generateRandomId(),
        deviceId : 'XXX_设备ID_XXX',
        lable: '__标记__',
        isVerified: false,
        dType: deviceType
    }
}

