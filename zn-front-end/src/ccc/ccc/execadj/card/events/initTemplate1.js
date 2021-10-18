/*sQld1OaD34tZblwSuoZXp9tHCZwxEHwmeU5RYkAUbPT2ERuWN30tfqUxlsivNdTJ*/
export default function(props, callback) {
	let appCode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: '36610CCA_C01', //页面id
			appcode: appCode
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
				}
				callback && callback();
			}
		}
	);
}

/*sQld1OaD34tZblwSuoZXp9tHCZwxEHwmeU5RYkAUbPT2ERuWN30tfqUxlsivNdTJ*/