import en from './en.json'
import zh from './zh.json'
import ja from './ja.json'

export default {
	en: {
		name: 'English',
		messages: en,
		// load: () => { return import('./en.json'); },
	},
	zh: {
		name: '中文',
		messages: zh,
		// load: () => { return import('./zh.json'); },
	},
	ja: {
		name: '日本語',
		messages: ja,
		// load: () => { return import('./zh.json'); },
	},
};
