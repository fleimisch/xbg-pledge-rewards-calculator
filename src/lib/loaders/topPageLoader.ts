// import _ from '$lib/services/utilities/languages'

interface tplOptions {
	open?: boolean;
	lock?: boolean;
}

let fplTmr: NodeJS.Timeout;
export default function topPageLoader(options: tplOptions = { open: true, lock: false }) {
	let loaderElement: any = document.querySelector('.topPageLoader');
	if (!loaderElement) {
		const le = document.createElement('div');
		le.className = 'topPageLoader';
		document.body.appendChild(le);
		loaderElement = le;
	}

	if (options.lock) {
		document.body.classList.add('tpl_lock');
	}

	clearTimeout(fplTmr);
	fplTmr = setTimeout(function () {
		if (loaderElement) {
			if (options.open) {
				loaderElement.style.display = '';
			} else {
				loaderElement.style.display = 'none';
				document.body.classList.remove('tpl_lock');
			}
		}
	}, 10);
}
