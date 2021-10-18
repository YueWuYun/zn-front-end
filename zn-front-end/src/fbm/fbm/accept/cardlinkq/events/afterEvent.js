/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/

import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
import {CARD_PAGE_CODE,CARD_FORM_CODE,URL_LIST, CARD_FORM_CODE8} from './../../cons/const';

export function afterEvent(props, moduleId, key, value, changedrows, i, s, g,isinit){
    console.log(key);
    let data = props.createHeadAfterEventData(CARD_PAGE_CODE, moduleId, [], moduleId, key, value);
    switch (key){
        case 'pk_org':
            pkorgAfterEvent.call(this, props, data,isinit);
			break;
		//
		case 'pk_register':
		case 'holdunit':
		case 'holderacc':
		case 'pk_holderbank':
		case 'backsecmoney':
		case 'secaccpayamount':
		case 'money':
			doAfterEvent.call(this,data);
			break;
		case 'isagent':
			isAgentAfterEvent.call(this,isinit);
        default:
            break;
    }

}

function pkorgAfterEvent(props,data,isinit){
    let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;
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
				title: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000000'),/* 国际化处理： 确认修改*/
				content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000001'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
				beSureBtnClick: changeOrgConfirm.bind(this, data)
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
		setEditable.call(this,this,res.data.editableMap);
		//设置form的编辑属性
		if (res.data.card.head) {
			//页面渲染
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
		}
	}
	// 后台查询
	doAjax.call(this, data, URL_LIST.AFTEREVENT, successCallback)
}

// function holdunitAfterEvent(data){

// 	let successCallback = function (res) {

// 		//设置form的编辑属性
// 		if (res.data.card.head) {
// 			//页面渲染
// 			this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
// 		}
// 	}
// 	// 后台查询
// 	doAjax.call(this, data, URL_LIST.AFTEREVENT, successCallback)
// }

function doAjax(sendData,url,successCallback){
    ajax({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

/**
 * 根据后台返回的数据设置字段可编辑性
 * @param {*} that 
 * @param {*} editableMap 
 */
function setEditable (that,editableMap){
	if (editableMap){
		let obj = {};
		for(var attr in editableMap){
			obj[attr] = editableMap[attr]				
		}
		that.props.form.setFormItemsDisabled(CARD_FORM_CODE, obj);
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/