// import { Dexie, type EntityTable } from 'dexie';
import localForage from "localforage";

const WINDOW: Window = globalThis.window;
const DOCUMENT: Document = globalThis.document;

export default class Storage {
	platform;

	constructor() {
		this.platform = process.env.DEVICE;
	}

	get(key: string) {
		if (typeof localStorage !== 'undefined') {
			return localStorage.getItem(key);
		} else {
			return '';
		}
	}

	set(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	remove(key: string) {
		localStorage.removeItem(key);
	}

	getLocalStorageItemsByKeyPrefix(prefix: string): Storage.LocalStorage[] {
		const items: Storage.LocalStorage[] = [];
		for (let i = 0; i < localStorage.length; i++) {
		  const key: string = localStorage.key(i) as string;
		  if (key && key.startsWith(prefix)) {
			const value = localStorage.getItem(key);
			items.push({ key: key, value: value });
		  }
		}
		return items;
	  }

	setCookie(name: string, value: string | boolean, expireSECONDS = 60) {
		if (!DOCUMENT) return;
		const date = new Date();
		// Set it expire // default 1 day
		date.setTime(date.getTime() + expireSECONDS * 1000);
		if (this.platform === 'desktop') {
			DOCUMENT.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
		} else {
			localStorage.setItem('__cookie__' + name, JSON.stringify({ value, expire: date.getTime() }));
		}
	}

	getCookie(name: string) {
		if (!DOCUMENT) return;
		if (this.platform === 'desktop') {
			const value = '; ' + DOCUMENT.cookie;
			const parts = value.split('; ' + name + '=');

			if (parts.length == 2) {
				return parts.pop()?.split(';').shift();
			}
			return null;
		} else {
			let value: any = localStorage.getItem('__cookie__' + name);
			try {
				value = JSON.parse(value);
				if (value && value.expire >= Date.now()) {
					return value.value;
				}
			} catch (error) {
				console.log(error);
			}

			localStorage.removeItem('__cookie__' + name);
			return null;
		}
	}

	deleteCookie(name: string) {
		if (!DOCUMENT) return;
		if (this.platform === 'desktop') {
			const date = new Date();
			// Set it expire in -1 days
			date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
			// Set it
			DOCUMENT.cookie = name + '=; expires=' + date.toUTCString() + '; path=/';
		} else {
			localStorage.removeItem(name);
		}
	}

	getCookiesByNamePrefix(prefix: string) {
		if (!DOCUMENT) return;
		const cookies = DOCUMENT.cookie.split(';');
		const filteredCookies = cookies.filter((cookie) => cookie.trim().startsWith(prefix));
		return filteredCookies.map((cookie) => {
			const parts = cookie.split('=');
			return { name: parts[0].trim(), value: parts[1] ? parts[1].trim() : '' };
		});
	}

	setLocalForage = async (key: string, value: any, duration?: number): Promise<any> => {
		const data = {
			value,
			timestamp: Date.now(),
			expiry: duration ? Date.now() + duration : null
		};

		await localForage.setItem(key, JSON.stringify(data)).catch(function (err) {
			throw new Error(err);
		});
	}

	getLocalForage = async (key: string): Promise<any> => {
		const data = await localForage.getItem(key);
		if (!data) return null;

		const parsed = JSON.parse(data as string);
		
		// Check if data has expired
		if (parsed.expiry && Date.now() > parsed.expiry) {
			await this.removeLocalForage(key);
			return null;
		}

		return parsed.value;
	}

	removeLocalForage = async (key: string) => {
		await localForage.removeItem(key, function (err) {
			if (err) {
				throw new Error(err);
			}
			return key;
		});
	}

	getLocalForageItemsByKeyPrefix = async (prefexKey: string): Promise<Storage.LocalStorage[]> => {
		const items: Storage.LocalStorage[] = [];
		await localForage.iterate((value, key) => {
			if (key && key.startsWith(prefexKey)) {
				items.push({ key: key, value: value });
			}
		});
		return items;
	}


	// setIndexedDB = async (dbName: string, store:{key:string, value:string}) => {
	// 	// const db = new Dexie(dbName);
	// 	// db.version(1).stores({
	// 	// 	[store.key]: store.value
	// 	// });
	// }
}
