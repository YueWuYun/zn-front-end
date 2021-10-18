/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { promptBox, toast } from 'nc-lightapp-front';
import { EmptyAreaValue } from '../../../../pub/utils/EmptyAreaValueUtil';
import { setHeadItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
import { cardEvent } from '../../../../public/container/index';
import { CARD } from "./../../cons/constant";
export function afterEvent(props, moduleId, key, value, oldValue) {
	console.log(key, moduleId, value, oldValue);
	let eventDatas = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	let eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };
	if (key === 'pk_org') { //财务组织
		if (oldValue.value == null) {
			//原来的值为空，不提示，如果新值不为空直接设置与财务组织相关的
			cardEvent.changeOrg.call(this, value).then(() => {
				props.form.EmptyAllFormValue(this.formId);
				if (value.value != null) {
					cardEvent.getAfterEventData.call(this, eventData).then(res => {
						setAfterEditFormValue.call(this, props, res);
					});
				}
			});
		} else {
			if (value.value !== oldValue.value) {
				promptBox({
					color: "warning",
					title: this.props.MutiInit.getIntl("36180BI") && this.props.MutiInit.getIntl("36180BI").get('36180BI-000000'),/* 国际化处理： 修改财务组织*/
					content: this.props.MutiInit.getIntl("36180BI") && this.props.MutiInit.getIntl("36180BI").get('36180BI-000001'),/* 国际化处理： 确认修改财务组织, 这样会清空您录入的信息?*/
					beSureBtnClick: () => {
						cardEvent.changeOrg.call(this, value).then(() => {
							props.form.EmptyAllFormValue(this.formId);
							if (value.value != null) {
								cardEvent.getAfterEventData.call(this, eventData).then(res => {
									//      props.form.setAllFormValue({
									//      	[this.formId]: res.data.card.head && res.data.card.head[this.formId]
									//      });
									setAfterEditFormValue.call(this, props, res);
								});
							}
						})
					},
					cancelBtnClick: () => {
						if (oldValue.value != null) {
							props.form.setFormItemsValue(this.formId, { 'pk_org': { value: oldValue.value, display: oldValue.display } });
						}
					}
				});
			}
		}
	} else if (key === 'evaluatevalue') { //评估价值
		if (parseInt(value.value) <= 0) {
			return toast({
				color: "danger",
				content:
					this.props.MutiInit.getIntl("36180BI") &&
					this.props.MutiInit.getIntl("36180BI").get(
						"36180BI-000011"
					) /* 国际化处理： 评估价值应大于0*/
			});
		}
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// props.form.setAllFormValue({
				// 	// [this.formId]: res.data.card.head && res.data.card.head[this.formId]
				// });
				setAfterEditFormValue.call(this, props, res);
			});
		}
	} else if (key === 'impawndate') { //质押日期
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.card.head && res.data.card.head[this.formId]
				});
			});
		}
	} else if (key === 'impawnrate') { //质押率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// props.form.setAllFormValue({
				// 	// [this.formId]: res.data.card.head && res.data.card.head[this.formId]
				// });
				setAfterEditFormValue.call(this, props, res);
			});
		}
	} else if (key === 'pk_register') { //票据编号
		if (!value.value) {
			EmptyAreaValue.call(this, CARD.baseinfo, this.formId);
		} else if (value.value && (value.value !== oldValue.value)) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// props.form.setAllFormValue({
				// 	[this.formId]: res.data.card.head && res.data.card.head[this.formId]
				// });
				setAfterEditFormValue.call(this, props, res);
				let setEditable = res.data.card.userjson;
				if (setEditable.indexOf("olcbrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { olcbrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { olcbrate: true });
				}
				if (setEditable.indexOf("glcbrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { glcbrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { glcbrate: true });
				}
				if (setEditable.indexOf("gllcbrate") > -1) {
					props.form.setFormItemsDisabled(moduleId, { gllcbrate: false });
				} else {
					props.form.setFormItemsDisabled(moduleId, { gllcbrate: true });
				}
			});
			let onlinebankflag = this.props.form.getFormItemsDisabled(this.formId, "onlinebankflag").value;
			if (onlinebankflag == true) {
				props.form.setFormItemsRequired(this.formId, { 'holderaccount': true });
				props.form.setFormItemsDisabled(this.formId, { 'holderaccount': false });
			} else {
				props.form.setFormItemsDisabled(this.formId, { 'holderaccount': true });
				props.form.setFormItemsRequired(this.formId, { 'holderaccount': false });
			}
		}
	} else if (key === 'olcbrate' || key === 'glcbrate' || key === 'gllcbrate') { //组织本币汇率
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				props.form.setAllFormValue({
					[this.formId]: res.data.card.head && res.data.card.head[this.formId]
				});
			});
		}
	} else if (key === 'onlinebankflag') {//网银
		if (value.value == true) {
			props.form.setFormItemsRequired(this.formId, { 'holderaccount': true });
			props.form.setFormItemsDisabled(this.formId, { 'holderaccount': false });
		} else {
			props.form.setFormItemsDisabled(this.formId, { 'holderaccount': true });
			props.form.setFormItemsRequired(this.formId, { 'holderaccount': false });
		}
	}
}


function setAfterEditFormValue(props, res) {
	let { success, data } = res;
	let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
	let { head, bodys } = card;
	props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
	setHeadItemProp(props, this.formId, headItemProps);
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/