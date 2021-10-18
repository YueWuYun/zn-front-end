/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
//引入配置常量定义
import { moudleId, base_url, pageCodeCard, formId, save_formId, pay_formId } from '../../cons/constant.js';
//引入公共api
import { addLineProcess } from "./buttonClick";
import { getDefData, setDefData } from '../../../../../tmpub/pub/util/cache';

let OrgOldValue = {};
//表头字段属性值：props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
export default function afterEvent(props, moduleId, key, value, changedrows, index, record, type) {
	let status = props.getUrlParam('status');
	let olcrate,glcrate,gllcrate,amount,eventData, newvalue, oldvalue, extParam;
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
					title: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000000'), // 弹框表头信息/* 国际化处理： 提示*/
					content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000001'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					leftBtnName: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000002'),/* 国际化处理： 确定*/
					rightBtnName: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000003'),/* 国际化处理： 取消*/
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
					title: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000041'), // 弹框表头信息/* 国际化处理： 提示*/
					content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000042'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改存单号，这样会清空您录入存单的信息?*/
					leftBtnName: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000043'),/* 国际化处理： 确定*/
					rightBtnName: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000044'),/* 国际化处理： 取消*/
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
		//存单号
		case 'pk_depositreceipt':
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			OrgOldValue = JSON.stringify(oldvalue);
			if (oldvalue.value != null && newvalue.value != null && oldvalue.value != newvalue.value) {
				
					// title: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000041'), // 弹框表头信息/* 国际化处理： 提示*/
					// content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000042'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改存单号，这样会清空您录入存单的信息?*/
					// leftBtnName: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000043'),/* 国际化处理： 确定*/
					// rightBtnName: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000044'),/* 国际化处理： 取消*/
					
						handleDepositRecChangeSure.call(this, props, formId, key, value, changedrows, index, eventData);//点击确定按钮
				
					// cancelBtnClick: () => {
					// 	handleDepositRecChangeCancel.call(this, props, formId, key, value, oldvalue, eventData);
					// }
			
			} else if (newvalue && newvalue.value) {
				handleDepositRecChangeSure.call(this, props, moduleId, key, value, changedrows, index, eventData);
			} else if (!newvalue || !newvalue.value) {
				
					//title: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000041'), // 弹框表头信息/* 国际化处理： 提示*/
					//content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000042'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改存单号，这样会清空您录入存单的信息?*/
					//leftBtnName: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000043'),/* 国际化处理： 确定*/
					//rightBtnName: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000044'),/* 国际化处理： 取消*/
				
						let pkorg = props.form.getFormItemsValue(formId, "pk_org");
						let withdrawdate = props.form.getFormItemsValue(formId, "withdrawdate");
						let billstate = props.form.getFormItemsValue(formId, "billstate");
						let withdrawamount  = props.form.getFormItemsValue(formId, "withdrawamount");
						let remark = props.form.getFormItemsValue(formId, "remark");
						props.form.setFormItemsValue(formId, { 'pk_org': { value: pkorg.value, display: pkorg.display } });
						props.form.setFormItemsValue(formId, { 'withdrawdate': { value: withdrawdate.value, display: withdrawdate.display } });
						props.form.setFormItemsValue(formId, { 'billstate': { value: billstate.value, display: billstate.display } });
						props.form.setFormItemsValue(formId, { 'withdrawamount': { value: withdrawamount.value, display: withdrawamount.display } });
						props.form.setFormItemsValue(formId, { 'remark': { value: remark.value, display: remark.display } });
						props.form.setFormItemsValue(formId, { 'depostbalmnt': null });
						props.form.setFormItemsValue(formId, { 'pk_depositreceipt': null });
						props.form.setFormItemsValue(formId, { 'depositdate': null });
						props.form.setFormItemsValue(formId, { 'enddate': null });
						props.form.setFormItemsValue(formId, { 'redeposittype': null });
						props.form.setFormItemsValue(formId, { 'pk_depositbank': null });
						props.form.setFormItemsValue(formId, { 'pk_depositacc': null });
						props.form.setFormItemsValue(formId, { 'pk_depositacc.name': null });
						props.form.setFormItemsValue(formId, { 'pk_currtype': null });
						props.form.setFormItemsValue(formId, { 'pk_depostrate': null });
						props.form.setFormItemsValue(formId, { 'pk_aiacrate': null });
						props.form.setFormItemsValue(formId, { 'pk_settleacc': null });
						props.form.setFormItemsValue(formId, { 'pk_settleacc.name': null });
						props.form.setFormItemsValue(formId, { 'depositinterval': null });
						props.form.setFormItemsValue(formId, { 'intervalunit': null });
						props.form.setFormItemsValue(formId, { 'pk_varieties': null });
									
					// cancelBtnClick: () => {
					// 	handleDepositRecChangeCancel.call(this, props, formId, key, value, oldvalue, eventData);
						
					// }
				
				// let pkorg = props.form.getFormItemsValue(formId, "pk_org");
				// let pkdesorg = props.form.getFormItemsValue(formId, "pk_depositorg");
				//清空数据
				// props.form.EmptyAllFormValue(save_formId);
				// props.form.setFormItemsValue(formId, { 'pk_org': { value: pkorg.value, display: pkorg.display } });
				// props.form.setFormItemsValue(formId, { 'pk_depositorg': { value: pkdesorg.value, display: pkdesorg.display } });
				
			}
			break;
		//结算账户
		case 'pk_settleacc':
			//获取页面数据
			eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue;
			oldvalue = eventData.oldvalue;
			if (oldvalue.value && newvalue.value && newvalue.value != oldvalue.value || oldvalue.value && !newvalue || oldvalue.value && !newvalue.value) {
				handleSettleAccChange.call(this, props, formId, key, value, changedrows, index, eventData);
			} else if (!newvalue || !newvalue.value) {
				//清空结算账户说明
				props.form.setFormItemsValue(formId, { 'pk_settleacc.accidname': { value: null, display: null } });
			}
			break;

			// case 'pk_currtype':
			// 	//获取页面数据
			// 	eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
			// 	//获取编辑的值
		
			// 		handleCurrtypeAfterEdit.call(this, props, formId, key, value, changedrows, index, eventData);
		
			// 	break;
				//取款金额，
		case 'withdrawamount':
			olcrate = props.form.getFormItemsValue(formId, 'olcrate').value;
			amount = props.form.getFormItemsValue(formId, 'withdrawamount').value;
			if (olcrate && amount) {
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				ajax({
					url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
					data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
					async:false, // 同步
					success: (res) => {
						if(res.data.form.userjson){
							let userjson = JSON.parse(res.data.form.userjson);
							let {retExtParam} =userjson;
							//设置组织本币列编辑性
							processHeadOlcRateEditable(props, retExtParam);
						}
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
					url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
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
					url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
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
					url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
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
			case "interest":
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				ajax({
					url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
					data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
					async: false,
					success: (res) => {
						if(res.data){
							this.props.form.setAllFormValue({ [formId]: res.data.form[formId] });
						}
					}
				});
			break;
			case "pk_currtype": 
			gllcrate = props.form.getFormItemsValue(formId, 'gllcrate').value;
			amount = props.form.getFormItemsValue(formId, 'withdrawamount').value;
			if (gllcrate && amount) {
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				ajax({
					url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
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
			case "withdrawdate": 
				eventData = props.createFormAfterEventData(pageCodeCard, formId, formId, key, value);
				if(eventData.newvalue.value==null){
					return;
				}else{
				ajax({
					url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
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
//存单号改变确定
export const handleDepositRecChangeSure = function (props, formId, key, value, changedrows, index, eventData) {
	let newvalue = eventData.newvalue
	if (!newvalue || !newvalue.value) {
		props.form.setFormItemsValue(formId, { 'pk_settleacc.accidname': { value: null, display: null } });
	} else {
		handleDepositRecAfterEdit.call(this, props, formId, key, value, changedrows, index, eventData);
		//handleCurrtypeAfterEdit.call(this, props, formId, key, value, changedrows, index, eventData);
	}
}
//结算账户改变
export const handleSettleAccChange = function (props, formId, key, value, changedrows, index, eventData) {
	let newvalue = eventData.newvalue
	if (!newvalue || !newvalue.value) {
		//清空结算账户说明
		props.form.setFormItemsValue(formId, { 'pk_settleacc.accidname': { value: null, display: null } });
	} else {
		//handleSettleAccAfterEdit.call(this, props, formId, key, value, changedrows, index, eventData);
	}
}

// 组织改变取消
const handleOrgChangeCancel = function (props, formId, key, value, oldvalue, eventData) {
	//组织选中值则恢复其余字段的编辑性
	let oldorg = JSON.parse(OrgOldValue);
	props.resMetaAfterPkorgEdit();
	props.form.setFormItemsValue(formId, { 'pk_org': { value: oldorg.value, display: oldorg.display } });
	//清算
	//setHeadItemProp(card_from_id,['pk_clearinplan']);//清算传入计划项目
}
// 存单号改变取消
const handleDepositRecChangeCancel = function (props, formId, key, value, oldvalue, eventData) {
	//组织选中值则恢复其余字段的编辑性
	let oldorg = JSON.parse(OrgOldValue);
	props.resMetaAfterPkorgEdit();
	props.form.setFormItemsValue(formId, { 'pk_depositreceipt': { value: oldorg.value, display: oldorg.display } });

	//清算
	//setHeadItemProp(card_from_id,['pk_clearinplan']);//清算传入计划项目
}
// 结算账户改变取消
const handleSettleAccChangeCancel = function (props, formId, key, value, oldvalue, eventData) {

	props.form.setAllFormValue(formId, eventData.oldvalue);
	//清算
	//setHeadItemProp(card_from_id,['pk_clearinplan']);//清算传入计划项目
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
		url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
		data: { 'eventPosition': 'body', 'eventType': 'form', 'eventData': JSON.stringify(eventData), extParam },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let { form } = data;
				//更新表单数据
				props.form.setAllFormValue({ [formId]: form[formId] });
				props.form.setFormItemsDisabled(formId, { 'pk_depositacc': true });
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
		url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWEditAfteraction.do',
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
			}
		},
		error: (res) => {
			handleOrgChangeError(props, oldvalue);
			toast({ color: 'warning', content: res.message });
		}
	});
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