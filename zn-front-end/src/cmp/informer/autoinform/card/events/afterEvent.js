/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, promptBox } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';

let cpagecode = constant.cpagecode;
let formcode1 = constant.formcode1;


export default function afterEvent(props, moduleId, key, value, changedrows) {
	let newvalue;
	let oldvalue;
	let oldorgDis;
	let billtype;
	switch (key) {
		case 'pk_org':
			let pkorg = props.form.getFormItemsValue(moduleId, 'pk_org').value;
			newvalue = pkorg;
			//获取当前最新的oldvalue：
			oldvalue = changedrows.value;
			oldorgDis = changedrows.display;

			//newvalue为空 和不为空（有新值）两种情况，均和oldvalue不相等，oldvalue不为空
			if (newvalue != oldvalue && oldvalue) {
				if (newvalue) {//直接点击打开右边弹框选择一个新值
					this.setState({
						oldorg: oldvalue,
						oldorgDis: oldorgDis
					});
					promptBox({
						color: 'warning',	// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: this.state.json['36070AGR-000012'], // 弹框表头信息/* 国际化处理： 确认修改*/
						content: this.state.json['36070AGR-000013'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
						noFooter: false,	// 是否显示底部按钮(确定、取消),默认显示(false),非必输
						noCancelBtn: false,	// 是否显示取消按钮,，默认显示(false),非必输
						hasCloseBtn: false, //显示“X”按钮，默认不显示，不显示是false，显示是true
						beSureBtnClick: orgChangeAfterEvent.bind(this, props), // 确定按钮点击调用函数,非必输
						cancelBtnClick: this.cancelBtnClick.bind(this), // 取消按钮点击调用函数,非必输
					})
				} else if (!newvalue) {//仅清除当前框中的值
					this.setState({
						oldorg: oldvalue,
						oldorgDis: oldorgDis
					});
					promptBox({
						color: 'warning',	// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: this.state.json['36070AGR-000012'], // 弹框表头信息/* 国际化处理： 确认修改*/
						content: this.state.json['36070AGR-000013'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
						noFooter: false,	// 是否显示底部按钮(确定、取消),默认显示(false),非必输
						noCancelBtn: false,	// 是否显示取消按钮,，默认显示(false),非必输
						hasCloseBtn: false, //显示“X”按钮，默认不显示，不显示是false，显示是true
						beSureBtnClick: emptyOrgCleanData.bind(this), // 确定按钮点击调用函数,非必输
						cancelBtnClick: this.cancelBtnClick.bind(this), // 取消按钮点击调用函数,非必输
					})
				}
			}

			//已清除了pk_org字段值，再重设值进去
			else if (!oldvalue) {
				if (newvalue) {
					orgChangeAfterEvent.call(this, props);
				}
			}

			else if (pkorg) {
				props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
				props.form.setFormItemsDisabled(moduleId, { 'oppbankacc': true });//对方账号不可编辑
			}
			break;


		case 'department'://部门编辑后事件
			let department = props.form.getFormItemsValue(moduleId, 'department').value;
			newvalue = department;
			//获取当前最新的oldvalue：
			oldvalue = changedrows.value;
			if (newvalue != oldvalue) {//改变部门 清空人员字段
				props.form.setFormItemsValue(moduleId, { staff_s: { value: null, display: null } });
			}
			break;

		case 'billtype':// 单据类型编辑后事件
			billtype = props.form.getFormItemsValue(moduleId, 'billtype').value;
			newvalue = billtype;
			//获取当前最新的oldvalue：
			oldvalue = changedrows.value;
			if (newvalue != oldvalue) {//改变单据类型 清空单据交易类型字段
				props.form.setFormItemsValue(moduleId, { billtransactype: { value: null, display: null } });
			}
			break;

		case 'billtransactype'://单据交易类型 联动单据类型
			let billtransactype = props.form.getFormItemsValue(moduleId, 'billtransactype').value;
			billtype = props.form.getFormItemsValue(moduleId, 'billtype').value;
			let data = props.createFormAfterEventData(cpagecode, formcode1);
			if (billtransactype) {
				if (!billtype) {
					ajax({
						url: requesturl.aftertransac,//"/nccloud/cmp/autogenbillrule/aftertransac.do"
						data: data,
						async: false, // 同步
						success: (res) => {
							if (res.data) {
								this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
								//this.props.form.setFormItemsValue("form_autoinform_head", { 'billtype': { value: 'F2', display: '收款单' } });
								//this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
							}
						}
					});
				}
			}
			break;

		case 'oppunitname'://对方单位名称编辑后事件
			let oppunitname = props.form.getFormItemsValue(moduleId, 'oppunitname').value;
			newvalue = oppunitname;
			//获取当前最新的oldvalue：
			oldvalue = changedrows.value;
			oldorgDis = changedrows.display;
			//newvalue为空 和不为空（有新值）两种情况，均和oldvalue不相等，oldvalue不为空
			//仅清除当前框中的值 和 直接点击打开右边弹框选择一个新值
			if (!newvalue) {
				props.form.setFormItemsDisabled(moduleId, { 'oppbankacc': true });//对方账号不可编辑
			}
			if (newvalue != oldvalue) {
				if (!newvalue) {
					this.props.form.setFormItemsValue("form_autoinform_head", { 'oppbankacc': { display: null, value: null } });//清空对方账号
					props.form.setFormItemsDisabled(moduleId, { 'oppbankacc': true });//对方账号不可编辑
				}
				else {
					props.form.setFormItemsDisabled(moduleId, { 'oppbankacc': false });//对方账号可编辑
					this.props.form.setFormItemsValue("form_autoinform_head", { 'oppbankacc': { display: null, value: null } });//清空对方账号
				}
			}
			break;

		default:
			break;
	}
}


// 清空组织，清空其他数据
export function emptyOrgCleanData() {
	this.props.initMetaByPkorg();
	this.props.form.EmptyAllFormValue(this.formId);
}
// 组织更改确认后台事件
export function orgChangeAfterEvent(props) {

	let pk_org = props.form.getFormItemsValue(formcode1, 'pk_org').value;
	let pk_org_display = props.form.getFormItemsValue(formcode1, 'pk_org').display;
	//自定义请求数据
	let data = { appregisterpk: constant.appregisterpk, pageCode: cpagecode };
	ajax({
		url: requesturl.afterpkorg,
		data: data,
		async: false, // 同步
		success: (res) => {
			if (res) {
				if (res.data) {
					props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
					props.form.setFormItemsValue(formcode1, {
						'pk_org': {
							value: pk_org,
							display: pk_org_display
						}
					});
					props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
					props.form.setFormItemsDisabled(formcode1, { 'oppbankacc': true });//对方账号不可编辑
				}
			}
		}
	});
};


	// //部门编辑后事件
	// if (key === 'department') {
	// 	let department = props.form.getFormItemsValue(moduleId, 'department').value;
	// 	let newvalue = department;
	// 	//获取当前最新的oldvalue：
	// 	let oldvalue = changedrows.value;
	// 	if (newvalue != oldvalue) {//改变部门 清空人员字段
	// 		props.form.setFormItemsValue(moduleId, { staff_s: { value: null, display: null } });
	// 	}
	// }

	// // 单据类型编辑后事件
	// if (key === 'billtype') {
	// 	let billtype = props.form.getFormItemsValue(moduleId, 'billtype').value;
	// 	let newvalue = billtype;
	// 	//获取当前最新的oldvalue：
	// 	let oldvalue = changedrows.value;
	// 	if (newvalue != oldvalue) {//改变单据类型 清空单据交易类型字段
	// 		props.form.setFormItemsValue(moduleId, { billtransactype: { value: null, display: null } });
	// 	}
	// }

	// //单据交易类型 联动单据类型
	// if (key === 'billtransactype') {
	// 	let billtransactype = props.form.getFormItemsValue(moduleId, 'billtransactype').value;
	// 	let billtype = props.form.getFormItemsValue(moduleId, 'billtype').value;
	// 	let data = props.createFormAfterEventData(cpagecode, formcode1);
	// 	if (billtransactype) {
	// 		if (!billtype) {
	// 			ajax({
	// 				url: "/nccloud/cmp/autogenbillrule/aftertransac.do",
	// 				data: data,
	// 				//async: false, // 同步
	// 				success: (res) => {
	// 					if (res.data) {
	// 						this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
	// 						//this.props.form.setFormItemsValue("form_autoinform_head", { 'billtype': { value: 'F2', display: '收款单' } });
	// 						//this.props.form.setAllFormValue({ [formcode1]: res.data[formcode1] });
	// 					}
	// 				}
	// 			});
	// 		}
	// 	}
	// }

	// //对方单位名称编辑后事件
	// if (key === 'oppunitname') {
	// 	let oppunitname = props.form.getFormItemsValue(moduleId, 'oppunitname').value;
	// 	let newvalue = oppunitname;
	// 	//获取当前最新的oldvalue：
	// 	let oldvalue = changedrows.value;
	// 	let oldorgDis = changedrows.display;
	// 	//newvalue为空 和不为空（有新值）两种情况，均和oldvalue不相等，oldvalue不为空
	// 	//仅清除当前框中的值 和 直接点击打开右边弹框选择一个新值
	// 	if (!newvalue) {
	// 		props.form.setFormItemsDisabled(moduleId, { 'oppbankacc': true });//对方账号不可编辑
	// 	}
	// 	if (newvalue != oldvalue) {
	// 		if (!newvalue) {
	// 			this.props.form.setFormItemsValue("form_autoinform_head", { 'oppbankacc': { display: null, value: null } });//清空对方账号
	// 			props.form.setFormItemsDisabled(moduleId, { 'oppbankacc': true });//对方账号不可编辑
	// 		}
	// 		else {
	// 			props.form.setFormItemsDisabled(moduleId, { 'oppbankacc': false });//对方账号可编辑
	// 			this.props.form.setFormItemsValue("form_autoinform_head", { 'oppbankacc': { display: null, value: null } });//清空对方账号
	// 		}
	// 	}
	// }

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/