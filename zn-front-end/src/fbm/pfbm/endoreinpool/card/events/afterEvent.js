/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { ajax, toast,promptBox } from 'nc-lightapp-front';
import { cardEvent } from '../../../../public/container/index';
import { setHeadItemsDisabled } from '../../../../public/container/page';
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";
import { setHeadItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
export function afterEvent(props, moduleId, key, value, oldValue) {
	console.log(key, value, oldValue);
	let currentItem = { props, moduleId, key, value, oldValue };
	let eventDatas = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	let eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };
	//财务组织
	if(key === 'pk_org'){
		if (!oldValue.value) {
			// 老数据为空，直接请求
			changeOrg.call(this,value,eventData);
		}else if (value.value !== oldValue.value) {
			let multiLang = this.props.MutiInit.getIntl(this.moduleId); //this.moduleId
			promptBox({
				color: "warning",
				title: multiLang && multiLang.get('36200ET-000000'),/* 国际化处理： 确认*/
				content: multiLang && multiLang.get('36200ET-000001'),/* 国际化处理： 切换组织将会清空您录入的信息，请确认?*/
				beSureBtnClick: () => {
					changeOrg.call(this,value,eventData);
				},
				cancelBtnClick:() => {
					props.form.setFormItemsValue(this.formId,{'pk_org': oldValue});
				}
			});
		}
	}
	//票据
	else if (key === 'pk_register'){ 
		if(value.value !== oldValue.value){
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// props.form.setAllFormValue({
				// 	[this.formId]: res.data.head && res.data.head[this.formId]
				// });
				setAfterEditFormValue.call(this,props,res);
			});
		}
		if(!value.value){
			// 清空了票据信息
			EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
		}
	}
	// 背书日期，组织，集团，全局汇率
	else if (key === 'busdate' || key === 'olcrate' || key === 'glcrate' || key === 'gllcrate'){
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,props,res);
			});
		}
	}
	// 票据类别
	else if (key === 'opbilltype'){ 
		if(value.value !== oldValue.value){
			// 清空了票据信息
			EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
			this.props.form.setFormItemsValue(this.formId, { 
				'pk_register': { value: null, display: null },
				'fbmbillno': { value: null, display: null },
				'money': { value: null, display: null },
				'olcmoney': { value: null, display: null },
			});
		}
		if(!value.value){
			// 清空了票据信息
			EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
			this.props.form.setFormItemsValue(this.formId, { 
				'pk_register': { value: null, display: null },
				'fbmbillno': { value: null, display: null },
				'money': { value: null, display: null },
				'olcmoney': { value: null, display: null },
			});
		}
	}
	// 网银
	else if (key === 'onlinebankflag'){ 
		// banksubcompany 接口行  endorserbankacc 背书单位账户 
		// endorseebankacc  被背书单位账户  issamebank  同行标志
		if(value.value){
			// 可编辑
			this.props.form.setFormItemsDisabled(this.formId, {
				'banksubcompany': false,
				// 'endorserbankacc': false,
				// 'endorseebankacc': false,
				'issamebank': false,
			});

		}else{
			this.props.form.setFormItemsDisabled(this.formId, {
				'banksubcompany': true,
				// 'endorserbankacc': true,
				// 'endorseebankacc': true,
				'issamebank': true,
			});
			this.props.form.setFormItemsValue(this.formId, { 
				'banksubcompany': { value: null, display: null },
				// 'endorserbankacc': { value: null, display: null },
				// 'endorseebankacc': { value: null, display: null },
				'issamebank': { value: null, display: null },
			});
		}
	}

}
function changeOrg(value,eventData){
	cardEvent.changeOrg.call(this, value).then(() => {
		if (value.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,this.props,res);
			}).then(() => {
				 
			});
		}
	})
}
function setAfterEditFormValue(props,res){
	let { success, data } = res;
	let { card, retExtParam, headProp, bodyItemProps,headItemProps } = data;
	let { head, bodys } = card;
	props.form.setAllFormValue({ [this.formId]: res.data.card.head[this.formId] });
	setHeadItemProp(props,this.formId,headItemProps);
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/