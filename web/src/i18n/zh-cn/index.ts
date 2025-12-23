import en from '../en';
import type { BaseTranslation, Translation } from '../i18n-types';

const zh_cn = {
	...(en as Translation),
} satisfies BaseTranslation;

export default zh_cn;
