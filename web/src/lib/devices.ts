import { generateRandomId } from './utils';

export interface Role {
    name: string;
    roleId: string;
    deviceId: string;
}

export enum DeviceType {
	VTCamera = 'ZN04',
    VTSpeaker = 'ESP32' 
}

export interface Device {
	id: string;
    deviceId: string; 
    apiKey: string;
    isVerified: boolean;
    deviceType: DeviceType;
}

export function getDefaultDevice(deviceType: DeviceType): Device {
    return {
        id: generateRandomId(),
        deviceId : 'VT_XXXX_XXXX',
        apiKey: "SkXXXXXXXXXXXXXXX",
        isVerified: false,
        deviceType: deviceType
    }
}

