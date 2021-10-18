/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax, toast} from 'nc-lightapp-front';
//引入配置常量定义
import {pageCodeCard, formId} from '../../cons/constant.js';
import {loadMultiLang} from "../../../../../tmpub/pub/util/index";
let OrgOldValue = {};
//表头字段属性值：props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
export default function afterEvent(props, moduleId, key, value, changedrows, index, record, type) {
	let status = props.getUrlParam('status');
	let olcrate,glcrate,gllcrate,amount,eventData, newvalue, oldvalue, extParam,withdrawdate1,currtype;
	let uiState = status;
	if (status == 'deal') {
		uiState = 'decide';
	}
	switch (key) {
		// 组织
		case 'pk_org':
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			OrgOldValue = JSON.stringify(oldvalue);
			if (oldvalue.value != null && newvalue.value != null && oldvalue.value != newvalue.value) {
				props.modal.show('MessageDlg', {
					title: loadMultiLang(this.props, '36340FDW-000000'), // 弹框表头信息/* 国际化处理： 提示*/
					content: loadMultiLang(this.props, '36340FDW-000001'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					leftBtnName: loadMultiLang(this.props, '36340FDW-000002'),/* 国际化处理： 确定*/
					rightBtnName: loadMultiLang(this.props, '36340FDW-000003'),/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						handleOrgChangeSure.call(this, props, moduleId, key, value, changedrows, index, eventData);//点击确定按钮
					},
					cancelBtnClick: () => {
						handleOrgChangeCancel.call(this, props, moduleId, key, value, oldvalue, eventData);
					}
				});
			} else if (newvalue && newvalue.value) {
				handleOrgChangeSure.call(this, props, moduleId, key, value, changedrows, index, eventData);
			} else if (!newvalue || !newvalue.value) {
				//清空数据
				props.modal.show('MessageDlg', {
					title: loadMultiLang(this.props, '36340FDW-000025'), // 弹框表头信息/* 国际化处理： 提示*/
					content: loadMultiLang(this.props, '36340FDW-000026'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改存单号，这样会清空您录入存单的信息?*/
					leftBtnName:loadMultiLang(this.props, '36340FDW-000027'),/* 国际化处理： 确定*/
					rightBtnName: loadMultiLang(this.props, '36340FDW-000028'),/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						props.form.EmptyAllFormValue(formId);
						props.initMetaByPkorg();
					},
					cancelBtnClick: () => {
						handleOrgChangeCancel.call(this, props, moduleId, key, value, oldvalue, eventData);
					}
				});
			}
			break;
		// 资金组织
		case 'pk_depositorg':
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			OrgOldValue = JSON.stringify(oldvalue);
			if (newvalue && newvalue.value) {
				props.form.setFormItemsValue(formId, { 'pk_depositreceipt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_varieties': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositinterval': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'intervalunit': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositdate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'enddate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'redeposittype': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depostbalmnt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'enddate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depostrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accidname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_currtype': { value: null, display: null } });
			} else {
				props.form.setFormItemsValue(formId, { 'pk_depositorg': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositreceipt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_varieties': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositinterval': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'intervalunit': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositdate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'enddate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'redeposittype': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depostbalmnt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'enddate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depostrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accidname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accidname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_currtype': { value: null, display: null } });
			}
			break;
		//存单号
		case 'pk_depositreceipt':
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			OrgOldValue = JSON.stringify(oldvalue);
			if (oldvalue.value != null && newvalue.value != null && oldvalue.value != newvalue.value||newvalue && newvalue.value) {
				handleDepositRecAfterEdit.call(this, props, formId, key, value, changedrows, index, eventData);//点击确定按钮
			} else if (!newvalue || !newvalue.value) {
				let pkorg = props.form.getFormItemsValue(formId, "pk_org");
				let pkdesorg = props.form.getFormItemsValue(formId, "pk_depositorg");
				let withdrawdate = props.form.getFormItemsValue(formId, "withdrawdate");
				let billstate = props.form.getFormItemsValue(formId, "billstate");
				let vbillstate = props.form.getFormItemsValue(formId, "vbillstate");
				let withdrawamount  = props.form.getFormItemsValue(formId, "withdrawamount");
				let remark = props.form.getFormItemsValue(formId, "remark");
				let pkgroup = props.form.getFormItemsValue(formId, "pk_group");
				props.form.EmptyAllFormValue(formId);
				props.form.setFormItemsValue(formId, { 'pk_org': { value: pkorg.value, display: pkorg.display } });
				props.form.setFormItemsValue(formId, { 'pk_depositorg': { value: pkdesorg.value, display: pkdesorg.display } });
				props.form.setFormItemsValue(formId, { 'withdrawdate': { value: withdrawdate.value, display: withdrawdate.display } });
				props.form.setFormItemsValue(formId, { 'billstate': { value: billstate.value, display: billstate.display } });
				props.form.setFormItemsValue(formId, { 'vbillstate': { value: vbillstate.value, display: vbillstate.display } });
				props.form.setFormItemsValue(formId, { 'withdrawamount': { value: withdrawamount.value, display: withdrawamount.display } });
				props.form.setFormItemsValue(formId, { 'remark': { value: remark.value, display: remark.display } });
				props.form.setFormItemsValue(formId, { 'pk_group': { value: pkgroup.value, display: pkgroup.display } });
			}
			break;
		//结算账户
		case 'pk_settleacc':
			//获取页面数据 
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			//旧值存在，新值存在,且旧值与新值不相等
			if (oldvalue.value && newvalue.value && newvalue.value != oldvalue.value) {
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accidname': { value: newvalue.value, display: newvalue.refname } });
			} 
			//旧值存在，新值不存在
			else if (oldvalue.value&&!newvalue.value){
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accidname': { value: null, display: null } });
			}
			// 新值存在，旧值不存在
			else{
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accidname': { value: newvalue.value, display: newvalue.refname } });
			}
			break;
		//定期账户
		case 'pk_depositacc':
			//获取页面数据 
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			//旧值存在，新值存在,且旧值与新值不相等
			if (oldvalue.value && newvalue.value && newvalue.value != oldvalue.value) {
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accidname': { value: newvalue.value, display: newvalue.refname } });
			} 
			//旧值存在，新值不存在
			else if (oldvalue.value&&!newvalue.value){
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accidname': { value: null, display: null } });
			}
			// 新值存在，旧值不存在
			else{
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accidname': { value: newvalue.value, display: newvalue.refname } });
			}
			break;
		//取款金额，
		case 'withdrawamount':
			olcrate = props.form.getFormItemsValue(formId, 'olcrate').value;
			amount = props.form.getFormItemsValue(formId, 'withdrawamount').value;
			if (olcrate && amount) {
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				ajax({
					url: '/nccloud/ifac/fixeddatewithdraw/FDWDWEditAfteraction.do',
					data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
					async:false, // 同步
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({  [formId]: res.data.form[formId]});
						}
					}
				});
			}
			break;
		//组织本币汇率
		case 'olcrate':
			olcrate = props.form.getFormItemsValue(formId, 'olcrate').value;
			amount = props.form.getFormItemsValue(formId, 'withdrawamount').value;
			if (olcrate && amount) {
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				ajax({
					url: '/nccloud/ifac/fixeddatewithdraw/FDWDWEditAfteraction.do',
					data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
					async: false,
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({ [formId]: res.data.form[formId] });
						}
					}
				});
			}
			break;
			//全局本币汇率
		case 'glcrate':
			glcrate = props.form.getFormItemsValue(formId, 'glcrate').value;
			amount = props.form.getFormItemsValue(formId, 'withdrawamount').value;
			if (glcrate && amount) {
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				ajax({
					url: '/nccloud/ifac/fixeddatewithdraw/FDWDWEditAfteraction.do',
					data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
					async: false,
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({ [formId]: res.data.form[formId] });
						}
					}
				});
			}
			break;
		//集团本币汇率
		case 'gllcrate':
			gllcrate = props.form.getFormItemsValue(formId, 'gllcrate').value;
			amount = props.form.getFormItemsValue(formId, 'withdrawamount').value;
			if (gllcrate && amount) {
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				ajax({
					url: '/nccloud/ifac/fixeddatewithdraw/FDWDWEditAfteraction.do',
					data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
					async: false,
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({ [formId]: res.data.form[formId] });
						}
					}
				});
			}
			break;
		//取款日期
		case 'withdrawdate':
			withdrawdate1 = props.form.getFormItemsValue(formId, 'withdrawdate').value;
			currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
			if (withdrawdate1&&currtype) {
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				ajax({
					url: '/nccloud/ifac/fixeddatewithdraw/FDWDWEditAfteraction.do',
					data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
					async: false,
					success: (res) => {
						if(res.data.form.userjson){
							let userjson = JSON.parse(res.data.form.userjson);
							let {retExtParam} =userjson;
							//设置组织本币列编辑性
							processHeadOlcRateEditable(props, retExtParam);
						}
						if(res.data){
							this.props.form.setAllFormValue({ [formId]: res.data.form[formId] });
						}
						disablemoney.call(this,props, formId,);
					}
				});
			}
			break;
		default:
			break;
	}
}

//组织改变确定
export const handleOrgChangeSure = function (props, moduleId, key, value, changedrows, index, eventData) {
	//组织选中值则恢复其余字段的编辑性
	props.resMetaAfterPkorgEdit();
	let newvalue = eventData.newvalue
	if (!newvalue || !newvalue.value) {
		props.form.EmptyAllFormValue(formId);
		props.initMetaByPkorg();
	} else {
		let pkorg = props.form.getFormItemsValue(formId, "pk_org");
		props.form.EmptyAllFormValue(formId);
		props.form.setFormItemsValue(formId, { 'pk_org': { value: pkorg.value, display: pkorg.display } });
		eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
		handleOrgAfterEdit.call(this, props, moduleId, key, value, changedrows, index, eventData);
	}
}


 
// 组织改变取消
const handleOrgChangeCancel = function (props, formId, key, value, oldvalue, eventData) {
	//组织选中值则恢复其余字段的编辑性
	let oldorg = JSON.parse(OrgOldValue);
	props.resMetaAfterPkorgEdit();
	props.form.setFormItemsValue(formId, { 'pk_org': { value: oldorg.value, display: oldorg.display } });
}
// 存单号改变取消
const handleDepositRecChangeCancel = function (props, formId, key, value, oldvalue, eventData) {
	//组织选中值则恢复其余字段的编辑性
	let oldorg = JSON.parse(OrgOldValue);
	props.resMetaAfterPkorgEdit();
	props.form.setFormItemsValue(formId, { 'pk_depositreceipt': { value: oldorg.value, display: oldorg.display } });
}

// 组织启用报错时，清空值
const handleOrgChangeError = function (props, oldvalue) {
	let oldorg = JSON.parse(OrgOldValue);
	props.resMetaAfterPkorgEdit();
	if (!oldorg || !oldorg.value) {
		props.form.EmptyAllFormValue(formId);
		props.form.setFormItemsValue(formId, { pk_org: { value: null, display: null } });
		props.initMetaByPkorg();
	} else {
		props.form.setFormItemsValue(formId, { pk_org: { value: oldorg.value, display: oldorg.display } });
	}
}

/**
 * 处理组织编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 * @param {*} eventData 
 */
const handleOrgAfterEdit = function (props, formId, key, value, changedrows, i, eventData) {
	let status = props.getUrlParam('status');
	let extParam = { 'uiState': status };
	let oldvalue = eventData.oldvalue;
	ajax({
		url: '/nccloud/ifac/fixeddatewithdraw/FDWDWEditAfteraction.do',
		data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res; 
			if (success) {
				let { form } = data;
				//更新表单数据
				props.form.setAllFormValue({ [formId]: form[formId] });
				if (extParam.hasOwnProperty('warning')) {
					toast({ color: 'warning', content: extParam.warning });
					handleOrgChangeCancel.call(this, props, formId, key, value, oldvalue, eventData)
				}
			}
		},
		error: (res) => {
			handleOrgChangeError(props, oldvalue);
			toast({ color: 'warning', content: res.message });
		}
	});
}
/**
 * 处理存单号编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 * @param {*} eventData 
 */
const handleDepositRecAfterEdit = function (props, formId, key, value, changedrows, i, eventData) {
	let status = props.getUrlParam('status');
	let extParam = { 'uiState': status };
	let oldvalue = eventData.oldvalue;
	ajax({
		url: '/nccloud/ifac/fixeddatewithdraw/FDWDWEditAfteraction.do',
		data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { form } = data;
				if(res.data.form.userjson){
					let userjson = JSON.parse(res.data.form.userjson);
					let {retExtParam} =userjson;
					//设置组织本币列编辑性
					processHeadOlcRateEditable(props, retExtParam);
				}
				//更新表单数据
				props.form.setAllFormValue({ [formId]: form[formId] });
				if (extParam.hasOwnProperty('warning')) {
					toast({ color: 'warning', content: extParam.warning });
					handleDepositRecChangeCancel.call(this, props, moduleId, key, value, oldvalue, eventData)
				}
				disablemoney.call(this,props, formId,);
			}
		},
		error: (res) => {
			handleOrgChangeError(props, oldvalue);
			toast({ color: 'warning', content: res.message });
		}
	});
}

//禁用金额
const disablemoney= function (props, formId) {
	props.form.setFormItemsDisabled(formId, { olcwithdrawmnt: true });
	props.form.setFormItemsDisabled(formId, { glcwithdrawmnt: true });
	props.form.setFormItemsDisabled(formId, { gllcwithdrawmnt: true });
}
/**
 * 设置表头组织本币汇率得编辑性
 * @param {*} props 
 */
const processHeadOlcRateEditable = function (props, extParam) {
    if (extParam.hasOwnProperty('bodyOlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyOlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(formId, {   olcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGlcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGlcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(formId, {   glcrate: flag });
   }
   if (extParam.hasOwnProperty('bodyGllcRateEditable')) {
       //设置列得编辑性，flag=true是不可编辑，false是可编辑
       let flag = extParam['bodyGllcRateEditable'] == 'Y' ? false : true;
       props.form.setFormItemsDisabled(formId, {   gllcrate: flag });
   }
}
/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/