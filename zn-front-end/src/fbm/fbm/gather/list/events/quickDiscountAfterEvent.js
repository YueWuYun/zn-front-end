/*UjOxWVsCuNkw+FglkPOSAsDXAh3DvqdVHYaJeZzAwG03xlTDx9L1a0neCn44nO/zD7FZ5AoIWX6y
P4PEN2lPYQ==*/
import { doAjax, formatDateTime } from "./../../utils/commonUtil";
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
import { LIST_QUICKDISCOUNT, URL_LIST } from "./../../cons/constant";

export default function (props, moduleId, key, value, changedrows, i, s, g, isInit) {
	let data = props.createHeadAfterEventData(LIST_QUICKDISCOUNT, moduleId, [], moduleId, key, value);
	switch (key) {
		case "ddiscountdate":
			doDdiscountdateEvent.call(this, props, data, isInit)
			break;
		case "discountyrate":
			doDiscountyrateEvent.call(this, props, data, isInit)
			break;
		default:
			break;
	}
}

function doDdiscountdateEvent(props, data) {

	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}else {
		// 成功回调
		let successCallback = res => {
			let { data } = res;
			props.form.setFormItemsValue(LIST_QUICKDISCOUNT, {
                //原币合计
                originaltotal: { value: data.returnMsg.originaltotal, scale: data.returnMsg.scale},
                //汇率
                olcrate: { value: data.returnMsg.olcrate, scale: data.returnMsg.ratescale}
			});
		}

		// 后台查询
		doAjax.call(this, data, URL_LIST.AFTERQUICKEVENT, successCallback)
	}

}

function doDiscountyrateEvent(props, data) {

	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}else {
		// 成功回调
		let successCallback = res => {
			let { data } = res;
			props.form.setFormItemsValue(LIST_QUICKDISCOUNT, {
                //贴现年利率
                discountyrate: { value: newvalue, scale: data.returnMsg.ratescale}
			});
		}

		// 后台查询
		doAjax.call(this, data, URL_LIST.AFTERQUICKEVENT, successCallback)
	}

}
/*UjOxWVsCuNkw+FglkPOSAsDXAh3DvqdVHYaJeZzAwG03xlTDx9L1a0neCn44nO/zD7FZ5AoIWX6y
P4PEN2lPYQ==*/