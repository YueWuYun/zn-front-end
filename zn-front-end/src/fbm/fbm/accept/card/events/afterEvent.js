/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/

import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
import {CARD_PAGE_CODE,CARD_FORM_CODE,URL_LIST, CARD_FORM_CODE8} from './../../cons/const';

export function afterEvent(props, moduleId, key, value, changedrows, i, s, g,isinit){
    console.log(key);
    let data = props.createHeadAfterEventData(CARD_PAGE_CODE, moduleId, [], moduleId, key, value);
    switch (key){
        case 'pk_org':
			pkorgAfterEvent.call(this, props, data,isinit);
			isAgentAfterEvent.call(this);
			break;
		
		case 'pk_register':
			pkRegisterAfterEvent.call(this,props,data,isinit);
			break;

		case 'holdunit':
		case 'holderacc':
		case 'pk_holderbank':
		case 'backsecmoney':
		case 'secaccpayamount':
		case 'money':
		case 'dacceptdate':
		case 'olcrate':
		case 'glcrate':
		case 'gllcrate':
		case 'inneractualpmtmnt':
		case 'returninsecmnt':
			doAfterEvent.call(this,data);
			break;
		case 'isagent':
			isAgentAfterEvent.call(this,isinit);
        default:
            break;
    }

}

function pkorgAfterEvent(props,data,isinit){
	let mutiInit= this.props.MutiInit.getIntl("36180BP");
	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;
	let olddisplay = data.oldvalue.display;
	let oldorg = data.oldvalue;
	//卡片自动带出组织触发编辑后
	if(isinit){
		changeOrgConfirm.call(this, data)
		return
	}
    //不变不触发编辑后
    if (newvalue == oldvalue) {
		return
    }else if (newvalue != oldvalue) {
		if (!oldvalue) {
			// 直接查询后台
			changeOrgConfirm.call(this, data)
		} else {
			// 弹窗交互
			promptBox({
				color: "warning",
				title: mutiInit && mutiInit.get('36180BP-000000'),/* 国际化处理： 确认修改*/
				content: mutiInit && mutiInit.get('36180BP-000001'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
				
				beSureBtnClick: () => {
					changeOrgConfirm.call(this, data);
				},
				cancelBtnClick: () => {
					this.props.form.setFormItemsValue(CARD_FORM_CODE,  { 'pk_org': { display: olddisplay, value: oldvalue } })
				}
			});
		}
	}
}

function changeOrgConfirm(data){
    let newvalue = data.newvalue.value;
	if (newvalue == null || newvalue == 'undefined') {
		this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
		this.props.initMetaByPkorg();
		return
    }
    
	// 成功回调
	let successCallback = function (res) {
		//选择主组织以后，恢复其他字段的编辑性
		this.props.resMetaAfterPkorgEdit();
		// 组织可编辑
		this.props.form.setFormItemsDisabled(CARD_FORM_CODE, { 'pk_org': false });
		//设置form的编辑属性
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
	}

	// 后台查询
	doAjax.call(this, data, URL_LIST.AFTEREVENT, successCallback)
}

function pkRegisterAfterEvent(props,data,isinit){
	let successCallback = function (res) {
		//设置字段可编辑性
		itemInfoChange.call(this,res.data);
		//修改初始化不赋值，只更新字段控制
		if (res.data.card.head && !isinit) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
		if (res.data.errMsg) {
			toast({
				color: "danger",
				content: res.data.errMsg
			});
		}
	}
	// 后台查询
	doAjax.call(this, data, URL_LIST.AFTEREVENT, successCallback)
}

/**
 * 代理付款编辑后事件
 */
function isAgentAfterEvent(isInit){
	let form = this.props.form;
	let status = this.props.getUrlParam("status");
	let isedit = (status === "add" || status === "edit" || status === "copy")?true:false;
	let isagent = form.getFormItemsValue(CARD_FORM_CODE,"isagent");
	if (isagent && isagent.value){
		form.openArea(CARD_FORM_CODE8);
		if (isedit){
			form.setFormItemsRequired(CARD_FORM_CODE,{'inneractualpmtmnt':true});

			form.setFormItemsDisabled(CARD_FORM_CODE,{'pk_inbalaacc':false
				,'inneractualpmtmnt':false,'pk_outreckonacc':false,'pk_outfundorg':false});
		}
	}else{
		form.closeArea(CARD_FORM_CODE8);
		if (isedit){
			form.setFormItemsRequired(CARD_FORM_CODE,{'inneractualpmtmnt':false});

			form.setFormItemsDisabled(CARD_FORM_CODE,{'pk_inbalaacc':true
				,'inneractualpmtmnt':true,'pk_outreckonacc':true,'pk_outfundorg':true});
		}
	}
	//非初始化编辑时需要清空票据号码字段，并触发其编辑后事件
	if (!isInit){
		form.setFormItemsValue(CARD_FORM_CODE,{'pk_register':null});
		form.getFormItemsValue
		afterEvent.call(this,this.props, CARD_FORM_CODE, "pk_register"
			, form.getFormItemsValue(CARD_FORM_CODE,"pk_register"), null, null, null, null, false);
	}
}

function doAfterEvent(data){

	let successCallback = function (res) {
		//设置字段可编辑性
		itemInfoChange.call(this,res.data);
		//设置form的编辑属性
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
		if (res.data.errMsg) {
			toast({
				color: "danger",
				content: res.data.errMsg
			});
		}
	}
	// 后台查询
	doAjax.call(this, data, URL_LIST.AFTEREVENT, successCallback)
}

function doAjax(sendData,url,successCallback){
    ajax({
		async: false,
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

/**
 * 根据后台返回的数据处理字段属性
 * @param {*} data 
 */
function itemInfoChange(data){
	let that = this;
	let editableMap = data.itemInfo.EditableMap;
	let requiredMap = data.itemInfo.RequiredMap;
	let focusKey = data.focusKey;
	if (editableMap){
		let obj = {};
		for(var attr in editableMap){
			obj[attr] = editableMap[attr]				
		}
		that.props.form.setFormItemsDisabled(CARD_FORM_CODE, obj);
	}
	if (requiredMap){
		let obj = {};
		for(var attr in requiredMap){
			obj[attr] = requiredMap[attr]				
		}
		that.props.form.setFormItemsRequired(CARD_FORM_CODE, obj);
	}
	if (focusKey){
		that.props.form.setFormItemFocus(CARD_FORM_CODE, focusKey);
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/