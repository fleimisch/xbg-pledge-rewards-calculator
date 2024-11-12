// // import _ from '$lib/services/utilities/languages'

// let fplTmr;
// const loaders = 0;
// export default function fullPageLoader(open = true) {
// 	let loaderElement = document.querySelector('.loadingAnimation');
// 	if (!loaderElement) {
// 		const dictHelp: any = window['dictHelp'];
// 		const le = document.createElement('div');
// 		le.className = 'loadingAnimation';
// 		le.setAttribute('data-text', dictHelp && dictHelp.hdontworryminute ? dictHelp.hdontworryminute : "Don't worry, this may take a minute.");
// 		document.body.appendChild(le);
// 		loaderElement = le;
// 	}

// 	if (loaderElement) {
// 		if (open) {
// 			// loaders += 1;
// 			loaderElement.classList.add('db-i');
// 		} else {
// 			// loaders -= 1;
// 			// if (loaders < 0) loaders = 0;
// 			loaderElement.classList.remove('db-i');
// 			// if (loaders <= 0) {
// 			// }
// 		}
// 	}
// }
