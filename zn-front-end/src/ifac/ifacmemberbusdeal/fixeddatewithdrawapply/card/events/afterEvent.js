/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax, toast} from 'nc-lightapp-front';
//引入配置常量定义
import { pageCodeCard, formId } from '../../cons/constant.js';
//引入公共api
import  {loadMultiLang}  from "../../../../../tmpub/pub/util/index";
let OrgOldValue = {};
//表头字段属性值：props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
export default function afterEvent(props, moduleId, key, value, changedrows, index, record, type) {
	let eventData, newvalue, oldvalue;
	switch (key) {
		// 财务组织
		case 'pk_org':
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			OrgOldValue = JSON.stringify(oldvalue);
			if (oldvalue.value != null && newvalue.value != null && oldvalue.value != newvalue.value) {
				props.modal.show('MessageDlg', {
					title: loadMultiLang(this.props, '36340FDWA-000000'), // 弹框表头信息/* 国际化处理： 提示*/
					content: loadMultiLang(this.props, '36340FDWA-000001'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					leftBtnName: loadMultiLang(this.props, '36340FDWA-000002'),/* 国际化处理： 确定*/
					rightBtnName: loadMultiLang(this.props, '36340FDWA-000003'),/* 国际化处理： 取消*/
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
					title: loadMultiLang(this.props, '36340FDWA-000024'), // 弹框表头信息/* 国际化处理： 提示*/
					content: loadMultiLang(this.props, '36340FDWA-000025'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改存单号，这样会清空您录入存单的信息?*/
					leftBtnName:loadMultiLang(this.props, '36340FDWA-000026'),/* 国际化处理： 确定*/
					rightBtnName: loadMultiLang(this.props, '36340FDWA-000027'),/* 国际化处理： 取消*/
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
		case 'pk_fundorg':
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			OrgOldValue = JSON.stringify(oldvalue);
			if (!newvalue || !newvalue.value) {
				props.form.setFormItemsValue(formId, { 'pk_fundorg': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'vbillcode': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositreceipt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_varieties': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_currtype': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositinterval': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'intervalunit': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositdate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'enddate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depostbalmnt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depostrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'redeposittype': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'returnnote': { value: null, display: null } });
			} else {
				props.form.setFormItemsValue(formId, { 'vbillcode': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositreceipt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_varieties': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_currtype': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositinterval': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'intervalunit': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositdate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'enddate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depostbalmnt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depostrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'redeposittype': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'returnnote': { value: null, display: null } });
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
			if (oldvalue.value != null && newvalue.value != null && oldvalue.value != newvalue.value) {
				handleDepositRecAfterEdit.call(this, props, formId, key, value, changedrows, index, eventData);//点击确定按钮
			} else if (newvalue && newvalue.value) {
				handleDepositRecAfterEdit.call(this, props, moduleId, key, value, changedrows, index, eventData);
			} else if (!newvalue || !newvalue.value) {
				props.form.setFormItemsValue(formId, { 'pk_depositreceipt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_varieties': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_currtype': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositinterval': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'intervalunit': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depositdate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'enddate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'depostbalmnt': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depostrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_aiacrate': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'redeposittype': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accname': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc': { value: null, display: null } });
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accname': { value: null, display: null } });
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
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accname': { value: newvalue.value, display: newvalue.refname } });
			} 
			//旧值存在，新值不存在
			else if (oldvalue.value&&!newvalue.value){
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accname': { value: null, display: null } });
			}
			// 新值存在，旧值不存在
			else{
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accname': { value: newvalue.value, display: newvalue.refname } });
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
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accname': { value: newvalue.value, display: newvalue.refname } });
			} 
			//旧值存在，新值不存在
			else if (oldvalue.value&&!newvalue.value){
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accname': { value: null, display: null } });
			}
			// 新值存在，旧值不存在
			else{
				props.form.setFormItemsValue(formId, { 'pk_depositacc.accname': { value: newvalue.value, display: newvalue.refname } });
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
		url: '/nccloud/ifac/fixeddatewithdrawapply/FDWDWAEditAfteraction.do',
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
		url: '/nccloud/ifac/fixeddatewithdrawapply/FDWDWAEditAfteraction.do',
		data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { form } = data;
				//更新表单数据
				props.form.setAllFormValue({ [formId]: form[formId] });
			}
		},
		error: (res) => {
			handleOrgChangeError(props, oldvalue);
			toast({ color: 'warning', content: res.message });
		}
	});
}

/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/