import type { Locales } from '$i18n/i18n-types';

import type { Role } from "./devices"

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
