/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import { ajax, toast,promptBox } from 'nc-lightapp-front';
import { cardEvent } from '../../../../public/container/index';
import { setHeadItemsDisabled } from '../../../../public/container/page';
import { setHeadItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";

export function afterEvent(props, moduleId, key, value, oldValue) {
	// console.log(key, value, oldValue);
	let currentItem = { props, moduleId, key, value, oldValue };
	let eventDatas = this.props.createHeadAfterEventData(this.pageId, this.formId, '', moduleId, key, value);
	let eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };
	if(key === 'pk_org'){ //财务组织
		if (!oldValue.value) {
			// 老数据为空，直接请求
			changeOrg.call(this,value,eventData);
		}else if (value.value !== oldValue.value) {
			let lang = this.props.MutiInit.getIntl(this.moduleId);
			promptBox({
				color: "warning",
				title: lang && lang.get('36180DT-000000'),/* 国际化处理： 确认*/
				content: lang && lang.get('36180DT-000001'),/* 国际化处理： 切换组织将会清空您录入的信息，请确认?*/
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
	} else if (key === 'pk_discount_app'){ //申请单编号
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
	} else if (key === 'opbilltype'){ //票据类别
		if(value.value !== oldValue.value){
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this,props,res);
			});
		}
		if(!value.value){
			// 清空了票据信息
			EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
		}
		if(value.value=="bill_privacy"){
			props.form.setFormItemsValue("form_browser", {
				transactorgpay: { value: null, display: null },
				pk_outorg: { value: null, display: null },
				pk_outorg_inneracc: { value: null, display: null },
				pk_outorg_fbacc: { value: null, display: null },
				pk_outpayorg: { value: null, display: null },
				pk_outpayorg_inneracc: { value: null, display: null },
				reckonamount: { value: null, display: null },
				olcreckonamount: { value: null, display: null },
				glcreckonamount: { value: null, display: null },
				gllcreckonamount: { value: null, display: null },
				reckoninterest: { value: null, display: null },
				olcreckoninterest: { value: null, display: null },
				glcreckoninterest: { value: null, display: null },
				gllcreckoninterest: { value: null, display: null }
		  });
		  	props.form.setFormItemsDisabled("form_browser", {
				  'transactorgpay':true,
				  'pk_outorg':true,
				  'pk_outorg_inneracc':true,
				  'pk_outorg_fbacc':true,
				  'pk_outpayorg':true,
				  'pk_outpayorg_inneracc':true,		
    	  });
			props.form.closeArea('reckoninfo');
		}else {
			props.form.setFormItemsDisabled("form_browser", {
				'transactorgpay':false,
				'pk_outorg':false,
				'pk_outorg_inneracc':false,
				'pk_outorg_fbacc':false,
				'pk_outpayorg':false,
				'pk_outpayorg_inneracc':false,
		});
			props.form.openArea('reckoninfo');
		}
	} else if (key === 'discount_account') {
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
				|| key === 'olcrate' || key === 'discountinterest' || key === 'glcrate' || key === 'gllcrate'){ //
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// props.form.setAllFormValue({
				// 	[this.formId]: res.data.head && res.data.head[this.formId]
				// });
				setAfterEditFormValue.call(this,props,res);
				
			});
		}
	}else if(key === 'transactresult'){
		if (value.value !== oldValue.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				if(value.value === 'disable'){
					this.props.form.setFormItemsDisabled("form_browser", {
						//贴现银行账户
						discount_account: true,
						//贴现延迟天数
						discountdelaydaynum: true,
						//利率天数
						ratedaynum: true,
						//贴现年利率
						discountyrate:true,
						//贴现手续费
						discountcharge:true,
						//贴现利息
						discountinterest:true,
						//贴现余额
						discountmoney:true,
						//贴现余额计划项目
						balanceplanitem:true,
						//贴现利息计划项目
						interestplanitem:true,
						//收票计划项目
						fbmplanitem:true,
						//手续费计划项目
						chargeplanitem:true,
						//线上清算
						isonlinesettle:true,
						//买方付息
						buyerinterest:true
					});
					this.props.form.setFormItemsRequired("form_browser", {
						//贴现银行账户
						discount_account: false,
						//利率天数
						ratedaynum: false,
						//贴现年利率
						discountyrate: false,
						//贴现余额
						discountmoney:false
					});
					this.props.form.setFormItemsValue("form_browser", {
						//贴现银行账户
						discount_account: { value: null, display: null },
						//贴现延迟天数
						discountdelaydaynum: { value: null, display: null },
						//利率天数
						ratedaynum: { value: null, display: null },
						//贴现年利率
						discountyrate: { value: null, display: null },
						//贴现手续费
						discountcharge: { value: null, display: null },
						//贴现利息
						discountinterest: { value: null, display: null },
						//贴现余额
						discountmoney: { value: null, display: null },
						//贴现余额计划项目
						balanceplanitem: { value: null, display: null },
						//收票计划项目
						fbmplanitem: { value: null, display: null },
						//手续费计划项目
						chargeplanitem: { value: null, display: null },
						//线上清算
						isonlinesettle: { value: null, display: null },
						//买方付息
						buyerinterest: { value: null, display: null },
						//组织贴现本币余额
						olcdiscountmoney: { value: null, display: null },
						//贴现利息本币余额
						olcinterestmoney: { value: null, display: null },
						//手续费本币金额
						olcchargemoney: { value: null, display: null },
						//贴现利息计划项目
						interestplanitem: { value: null, display: null }
				  });
				}else{
					this.props.form.setFormItemsDisabled("form_browser", {
						//贴现银行账户
						discount_account: false,
						//贴现延迟天数
						discountdelaydaynum: false,
						//利率天数
						ratedaynum: false,
						//贴现年利率
						discountyrate:false,
						//贴现手续费
						discountcharge:false,
						//贴现利息
						discountinterest:false,
						//贴现余额
						discountmoney:false,
						//贴现余额计划项目
						balanceplanitem:false,
						//贴现利息计划项目
						interestplanitem:false,
						//收票计划项目
						fbmplanitem:false,
						//手续费计划项目
						chargeplanitem:false,
						//线上清算
						isonlinesettle:false,
						//买方付息
						buyerinterest:false
					});
					this.props.form.setFormItemsRequired("form_browser", {
						//贴现银行账户
						discount_account: true,
						//利率天数
						ratedaynum: true,
						//贴现年利率
						discountyrate: true,
						//贴现余额
						discountmoney:true
					});
				}
				
			});
		}
	}
	// else if (key==='onlinebankflag'){
	// 	if (value.value=='N') {
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
				let opbilltype=this.props.form.getFormItemsValue(this.formId, 'opbilltype').value
				if(opbilltype=="bill_privacy"){
					this.props.form.setFormItemsValue("form_browser", {
						transactorgpay: { value: null, display: null },
						pk_outorg: { value: null, display: null },
						pk_outorg_inneracc: { value: null, display: null },
						pk_outorg_fbacc: { value: null, display: null },
						pk_outpayorg: { value: null, display: null },
						pk_outpayorg_inneracc: { value: null, display: null },
						reckonamount: { value: null, display: null },
						olcreckonamount: { value: null, display: null },
						glcreckonamount: { value: null, display: null },
						gllcreckonamount: { value: null, display: null },
						reckoninterest: { value: null, display: null },
						olcreckoninterest: { value: null, display: null },
						glcreckoninterest: { value: null, display: null },
						gllcreckoninterest: { value: null, display: null }
				  });
					  this.props.form.setFormItemsDisabled("form_browser", {
						  'transactorgpay':true,
						  'pk_outorg':true,
						  'pk_outorg_inneracc':true,
						  'pk_outorg_fbacc':true,
						  'pk_outpayorg':true,
						  'pk_outpayorg_inneracc':true,		
				  });
					this.props.form.closeArea('reckoninfo');
				}else {
					this.props.form.setFormItemsDisabled("form_browser", {
						'transactorgpay':false,
						'pk_outorg':false,
						'pk_outorg_inneracc':false,
						'pk_outorg_fbacc':false,
						'pk_outpayorg':false,
						'pk_outpayorg_inneracc':false,
				});
					this.props.form.openArea('reckoninfo');
				}
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