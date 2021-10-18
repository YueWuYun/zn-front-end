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
	if(key === 'pk_org'){ //财务组织
		if (!oldValue.value) {
			// 老数据为空，直接请求
			changeOrg.call(this,value,eventData);
		}else if (value.value !== oldValue.value) {
			let multiLang = this.props.MutiInit.getIntl(this.moduleId); //this.moduleId
			promptBox({
				color: "warning",
				title: multiLang && multiLang.get('36200DT-000000'),/* 国际化处理： 确认*/
				content: multiLang && multiLang.get('36200DT-000001'),/* 国际化处理： 切换组织将会清空您录入的信息，请确认?*/
				beSureBtnClick: () => {
					changeOrg.call(this,value,eventData);
				},
				cancelBtnClick:() => {
					props.form.setFormItemsValue(this.formId,{'pk_org': oldValue});
				}
			});
		}
	} else if (key === 'pk_register'){ //票据
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
	}else if (key === 'pk_discount_app'){ //申请单编号
		if(value.value !== oldValue.value){
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,props,res);
			});
		}
		if(!value.value){
			// 清空了票据信息
			EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
		}
		//申请日期设置为不可编辑
		if(value.value != null){
			props.form.setFormItemsDisabled(this.formId, {
				'applydate': true
				// 'pk_register': true
			});
		}else{
			props.form.setFormItemsDisabled(this.formId, {
				'applydate': false
				// 'pk_register': false
			});
		}
	}else if (key === 'opbilltype'){ //票据类别
		if(value.value !== oldValue.value){
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,props,res);
			});
		}
		if(!value.value){
			// 清空了票据信息
			EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
		}
	}else if (key === 'discount_account') {
		// 贴现银行账户，需要给银行赋值
		if (!value || !value.refpk) {
			props.form.setFormItemsValue(this.formId,{'pk_discount_bank': {value:'',display:''}});
			return;
		}
		let accpk = value.refpk;
		let acccode=value.refcode;
		let bankpk = value.values['bd_bankdoc.pk_bankdoc'];
		let bankname = value.values['bd_bankdoc.name'].value;
		let currpk = value.values['bd_currtype.pk_currtype'];
		let currname = value.values['bd_currtype.name'].value;
		bankpk['display']=bankname;
		// record.values.globalrealtime_local = Object.assign(record.values.globalrealtime_local, defaultvalue);
		// 给银行赋值
		let discount_bank = props.form.getFormItemsValue(this.formId, 'pk_discount_bank') ;
		Object.assign(props.form.getFormItemsValue(this.formId, 'pk_discount_bank'), bankpk);
		let discount_bank2 = props.form.getFormItemsValue(this.formId, 'pk_discount_bank') ;
		//props.form.setFormItemsValue('form_deliveryapply_01', { busitype: { display: '', value: '' } });
		props.form.setFormItemsValue(this.formId,{'pk_discount_bank': bankpk});
	} else if (key==='buyerinterestsss') {
		// 买方付息，需要将所有贴现利息记为0，不可编辑，取消勾选为可编辑
		console.log(value);
		
		if (value) {
			this.props.form.setFormItemsDisabled(this.formId, {'discountinterest':false});
			let interest = this.props.form.getFormItemsValue(this.formId,'discountinterest');
			
			let scale = interest.scale ? interest.scale:2;
			let display = Number(0).toFixed(scale);
			let defaultvalue = {value:0,display:display};
			this.props.form.setFormItemsValue(
				this.formId,
				{'discountinterest':defaultvalue,'olcinterestmoney':defaultvalue,
				'glcinterestmoney':defaultvalue,'gllcinterestmoney':defaultvalue
				}
			);
		}else{
			this.props.form.setFormItemsDisabled(this.formId, {'discountinterest':true});
		}
	}else if (key === 'ddiscountdate' || key === 'discountdelaydaynum' || key === 'ratedaynum'
				|| key === 'discountyrate'||key === 'discountcharge'||key === 'buyerinterest'
				|| key === 'olcrate' || key === 'glcrate' || key === 'gllcrate'){ //
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// props.form.setAllFormValue({
				// 	[this.formId]: res.data.head && res.data.head[this.formId]
				// });
				setAfterEditFormValue.call(this,props,res);
			});
		}
	}
	// else if (key==='onlinebankflag'){
	// 	if (value.value) {
	// 		// false
	// 		this.props.form.setFormItemsValue(
	// 			this.formId,
	// 			{'pk_register':{value:null,display:null}}
	// 		);
	// 		EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
	// 	}
	// } 
	// cardEvent.creditAfterEvent.call(this, currentItem, {
		// creditBank: 'creditorg', //授信银行
		// creditCurrency: 'creditcurrency', //授信币种
		// creditOccupy: 'creditoccupy', //授信占用额度
		// creditOlcOccupy: 'oldcreditoccupy', //授信占用本币额度				
	// }); //授信信息编辑后事件
	
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