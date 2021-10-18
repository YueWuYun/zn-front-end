/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import  { constant }  from '../../config/config';
export default function(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: constant.advancesearch_list_pagecode, //页面id
			appid: constant.appregisterpk //注册按钮的id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
				}
			}
		}
	);
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/