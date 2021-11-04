
//@Author: lijun
export function handleLoad(refcode, code) {
	let Item = window[refcode].default;
	let that = this;
	this.setState({
		[code]: Item
	});
}

/* refcode */
export default function createScript(src, code) {
	var that = this,
		scripts = Array.from(document.getElementsByTagName('script')),
		s = src.split('/'),
		flag,
		refKey;
	refKey = s.slice(s.length - 5).join('/');
	refKey = refKey.substring(0, refKey.length - 3);
	flag = scripts.find((e) => {
		return e.src.includes(refKey);
	});
	if (window[refKey]) {
		// 已经加载过script标签
		handleLoad.call(that, refKey, code);
	} else {
		let script;
		if (flag) {
			script = flag;
		} else {
			script = document.createElement('script');
			script.src = '../../../../' + src;
			script.type = 'text/javascript';
			document.body.appendChild(script);
		}
		// script.addEventListener('load', handleLoad.bind(that, refKey));//liuhuit
			script.onload = script.onload || handleLoad.bind(that, refKey);
	}
}