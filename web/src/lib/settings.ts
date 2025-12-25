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
	connectionType: DeviceType;
}

export interface Settings {
    roles: Role[];
    userTheme: 'light' | 'dark';
	userLanguage: Locales | null;
	sidebarExpanded: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	roles: [],
    userTheme: 'light',
	userLanguage: null,
	sidebarExpanded: true,
};
