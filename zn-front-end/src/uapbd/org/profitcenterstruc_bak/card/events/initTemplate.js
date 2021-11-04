//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
//初始化模板适配
import { ajax, toast } from 'nc-lightapp-front';
export default function (props) {
	debugger
	let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		if (status) {
			props.createUIDom(
				{
					pagecode: '10100PFCS_CARD',//页面id
				},
				function (data) {
                    debugger 
					if (data) {
						if (data.button) {
							let button = data.button;
							props.button.setButtons(button);
						}
						if (data.template) {
							let meta = data.template;
							modifierMeta(props, meta, json);
							props.meta.setMeta(meta);
						}
					}
				}
			);
		} else {
			console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
		}
	}
	props.MultiInit.getMultiLang({ moduleId: "resa-profitcenters", domainName: 'uapbd', callback })
}

function modifierMeta(props, meta, json) {
	debugger
	return meta;
}


//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX