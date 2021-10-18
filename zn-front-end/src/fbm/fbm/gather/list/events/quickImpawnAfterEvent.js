/*pkQQXiIjbrtFISPtwmYwam/te5fzzA72wgQ88VgOCkNEz5hzZuV6ZyJfuOJ2Ncltd1keiEN4YYvm
la4rlIMkEg==*/
import { doAjax, formatDateTime } from "./../../utils/commonUtil";
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
import { URL_LIST, LIST_QUICKIMPAWN } from "./../../cons/constant";

export default function (props, moduleId, key, value, changedrows, i, s, g, isInit) {
	let data = props.createHeadAfterEventData(LIST_QUICKIMPAWN, moduleId, [], moduleId, key, value);
	switch (key) {
		case "impawndate"://质押日期
			doImpawndateEvent.call(this, props, data, isInit)
			break;
		case "impawnrate"://质押率
			doImpawnrateEvent.call(this, props, data, isInit)
			break;
		case "onlinebankflag"://网银办理
			doOnlinebankflagEvent.call(this, props, data, isInit)
			break;
		default:
			break;
	}
}

//网银办理
function doOnlinebankflagEvent(props, data) {
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	} else if (newvalue !== oldvalue && newvalue !== null) {
		props.form.setFormItemsRequired(LIST_QUICKIMPAWN, {
			holderaccount: true
		});
		return
	}

}
//质押率
function doImpawnrateEvent(props, data) {

	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	} else {
		// 成功回调
		let successCallback = res => {
			let { data } = res;
			if (data.returnMsg.errorMsg != null) {
				props.form.setFormItemsValue(LIST_QUICKIMPAWN, {
					//质押率
					impawnrate: null
				});
				toast({
					color: "warning",
					content: data.returnMsg.errorMsg
				});
				return;
			}
		}

		// 后台查询
		doAjax.call(this, data, URL_LIST.AFTERQUICKEVENT, successCallback)
	}

}
//质押日期
function doImpawndateEvent(props, data) {

	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	} else {
		// 成功回调
		let successCallback = res => {
			let { data } = res;
			props.form.setFormItemsValue(LIST_QUICKIMPAWN, {
				//原币合计
				originaltotal: { value: data.returnMsg.originaltotal, scale: data.returnMsg.scale },
				//汇率
				olcbrate: { value: data.returnMsg.olcrate, scale: data.returnMsg.ratescale }
			});
		}

		// 后台查询
		doAjax.call(this, data, URL_LIST.AFTERQUICKEVENT, successCallback)
	}

}
/*pkQQXiIjbrtFISPtwmYwam/te5fzzA72wgQ88VgOCkNEz5hzZuV6ZyJfuOJ2Ncltd1keiEN4YYvm
la4rlIMkEg==*/