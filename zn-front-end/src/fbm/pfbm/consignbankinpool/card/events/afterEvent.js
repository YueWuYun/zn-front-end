/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { ajax, base, toast, promptBox, cardCache } from 'nc-lightapp-front';
import { cardEvent } from '../../../../public/container/index';
import { setHeadItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";
import { CARD ,module_id} from '../../cons/constant';
//定义全局的pk_org的oldvalue
let oldOrgTotally = {};
export function afterEvent(props, moduleId, key, value, oldValue) {
	let multiLang = this.props.MutiInit.getIntl(module_id)
	let eventData, newvalue, oldvalue, extParam;
	let currentItem = { props, moduleId, key, value, oldValue };
	let eventDataOld = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) };
	if (key === 'pk_org') {
		if (!oldValue.value) {
			// 老数据为空，直接请求
			changeOrg.call(this, value, eventData);
		} else if (value.value !== oldValue.value) {
			promptBox({
				color: "warning",
				title: multiLang && multiLang.get('36200BC-000000'),/* 国际化处理： 确认*/
				content: multiLang && multiLang.get('36200BC-000001'),/* 国际化处理： 切换组织将会清空您录入的信息，请确认?*/
				beSureBtnClick: () => {
					changeOrg.call(this, value, eventData);
				},
				cancelBtnClick: () => {
					props.form.setFormItemsValue(this.formId, { 'pk_org': oldValue });
				}
			});
		}
	} else if (key === 'pk_register') { // 票据编号
		let newvalue = eventDataOld.newvalue.value;
		if (newvalue) {
			ajax({
				async: false,
				url: this.API_URL.afterEvent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) },
				success: (res) => {
					
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
					let { head, bodys } = card;
					props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
					setHeadItemProp(props, this.formId, headItemProps);
				},
			});
		}else{
			EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
			props.form.setFormItemsValue(this.formId, { 'money': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'olcmoney': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'glcmoney': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'gllcmoney': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'billmoney': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'pk_holderbank': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'holderacc': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'appointdate': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'reckonamount': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'olcreckonamount': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'glcreckonamount': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'gllcreckonamount': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'pk_outorg': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'pk_outorg_v': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'pk_outorg_inneracc': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'pk_outpayorg': { value: '', display: '' } });
			props.form.setFormItemsValue(this.formId, { 'pk_outpayorg_inneracc': { value: '', display: '' } });
			props.form.setFormItemsDisabled(this.formId, {
				pk_outorg: true,
				pk_outorg_inneracc: true,
				pk_outpayorg: true,
				pk_outpayorg_inneracc: true,
			});
	}

	} else if (key === 'holderacc') {
		// 贴现银行账户，需要给银行赋值
		if (!value || !value.refpk) {
			props.form.setFormItemsValue(this.formId, { 'pk_holderbank': { value: '', display: '' } });
			return;
		}
		let accpk = value.refpk;
		let acccode = value.refcode;
		let bankpk = value.values['bd_bankdoc.pk_bankdoc'];
		let bankname = value.values['bd_bankdoc.name'].value;
		bankpk['display'] = bankname;
		// 给银行赋值
		let discount_bank = props.form.getFormItemsValue(this.formId, 'pk_holderbank');
		props.form.setFormItemsValue(this.formId, { 'pk_holderbank': bankpk });
	}
	else if (key === 'money') { //委托金额
		let newvalue = eventDataOld.newvalue.value;
		if (newvalue) {
			ajax({
				async: false,
				url: this.API_URL.afterEvent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) },
				success: (res) => {
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
					let { head, bodys } = card;
					props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
					setHeadItemProp(props, this.formId, headItemProps);
				},
			});
		}
	} else if (key === 'olcrate') { //组织本币汇率
		let newvalue = eventDataOld.newvalue.value;
		if (newvalue) {
			ajax({
				async: false,
				url: this.API_URL.afterEvent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) },
				success: (res) => {
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
					let { head, bodys } = card;
					props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
					setHeadItemProp(props, this.formId, headItemProps);
				},
			});
		}
	} else if (key === 'glcrate') { //集团汇率
		let newvalue = eventDataOld.newvalue.value;
		if (newvalue) {
			ajax({
				async: false,
				url: this.API_URL.afterEvent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) },
				success: (res) => {
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
					let { head, bodys } = card;
					props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
					setHeadItemProp(props, this.formId, headItemProps);
				},
			});
		}
	}
	else if (key === 'gllcrate') { //全局汇率
		let newvalue = eventDataOld.newvalue.value;
		if (newvalue) {
			ajax({
				async: false,
				url: this.API_URL.afterEvent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) },
				success: (res) => {
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
					let { head, bodys } = card;
					props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
					setHeadItemProp(props, this.formId, headItemProps);
				},
			});
		}
	}
	else if (key === 'securitymoney') { //保证金额
		let newvalue = eventDataOld.newvalue.value;
		if (newvalue) {
			ajax({
				async: false,
				url: this.API_URL.afterEvent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) },
				success: (res) => {
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
					let { head, bodys } = card;
					props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
					setHeadItemProp(props, this.formId, headItemProps);
				},
			});
		}
	} else if (key === 'dcollectiondate') {//款项收妥日期应大于等于委托日期dconsigndate
		let dcollectiondate = eventDataOld.newvalue.value;
		let dconsigndate = props.form.getFormItemsValue(this.formId, 'dconsigndate') && props.form.getFormItemsValue(this.formId, 'dconsigndate').value
		if (dcollectiondate && dconsigndate) {
			if (dcollectiondate < dconsigndate) {
				props.form.setFormItemsValue(this.formId, { 'dcollectiondate': { value: '', display: null } });
				toast({ color: 'warning', content: multiLang && multiLang.get('36200BC-000002') });/* 国际化处理： 款项收妥日期应大于等于委托日期*/
			}
		}
	} else if (key === 'dconsigndate') {//款项收妥日期应大于等于委托日期dconsigndate
		let dconsigndate = eventDataOld.newvalue.value;
		let dcollectiondate = props.form.getFormItemsValue(this.formId, 'dcollectiondate') && props.form.getFormItemsValue(this.formId, 'dcollectiondate').value
		if (dconsigndate && dcollectiondate) {
			if (dconsigndate > dcollectiondate) {
				props.form.setFormItemsValue(this.formId, { 'dconsigndate': { value: '', display: null } });
				toast({ color: 'warning', content: multiLang && multiLang.get('36200BC-000002') });/* 国际化处理： 款项收妥日期应大于等于委托日期*/
			}
		}
		let newvalue = eventDataOld.newvalue.value;
		if (newvalue) {
			ajax({
				async: false,
				url: this.API_URL.afterEvent,
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDataOld) },
				success: (res) => {
					console.log(res);
					let { success, data } = res;
					let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
					let { head, bodys } = card;
					props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
					setHeadItemProp(props, this.formId, headItemProps);
				},
			});
		}
	}else if (key === 'securityaccount') {//保证金账户有值，保证金设为必输项
		let newvalue = eventDataOld.newvalue.value;
		if(newvalue){
			this.props.form.setFormItemsRequired(this.formId, {
				securitymoney: true,
				olcsecuritymoney: true,

			});
		}
	}// 票据类别
	else if(key === 'opbilltype'){
		if(value.value !== oldValue.value){
			// 票据类别不同参照不一样，清空票据信息
			this.props.form.setFormItemsValue(this.formId,
				{
					'pk_register':{ value : null, display: null },
					'fbmbillno':{ value : null, display: null },
					'money':{ value : null, display: null },
					'olcmoney':{ value : null, display: null },
					'glcmoney':{ value : null, display: null },
					'gllcmoney':{ value : null, display: null },
					'reckonamount':{ value : null, display: null },
					'olcreckonamount':{ value : null, display: null },
					'glcreckonamount':{ value : null, display: null },
					'gllcreckonamount':{ value : null, display: null },
					'pk_outorg':{ value : null, display: null },
					'pk_outorg_v':{ value : null, display: null },
					'pk_outorg_inneracc':{ value : null, display: null },
					'pk_outpayorg':{ value : null, display: null },
					'pk_outpayorg_inneracc':{ value : null, display: null },
					
				
				}
			);
			// 清空了票据信息
			EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
			this.props.form.setFormItemsDisabled(this.formId, {
				pk_outorg: true,
				pk_outorg_inneracc: true,
				pk_outpayorg: true,
				pk_outpayorg_inneracc: true,
			});
		}
	}



	cardEvent.creditAfterEvent.call(this, currentItem, {
		// creditBank: 'creditorg', //授信银行
		// creditCurrency: 'creditcurrency', //授信币种
		// creditOccupy: 'creditoccupy', //授信占用额度
		// creditOlcOccupy: 'oldcreditoccupy', //授信占用本币额度				
	}); //授信信息编辑后事件

}



function setAfterEditFormValue(props, res) {
	let { success, data } = res;
	let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
	let { head, bodys } = card;
	props.form.setAllFormValue({ [this.formId]: head[this.formId] });
	//props.cardTable.setAllTabsData(bodys, this.tabOrder);
	setHeadItemProp(props, this.formId, headItemProps);
}

function changeOrg(value, eventData) {
	cardEvent.changeOrg.call(this, value).then(() => {
		if (value.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			}).then(() => {

			});
		}
	})
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/