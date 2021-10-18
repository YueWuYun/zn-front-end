/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
/**
 * 背书办理卡片界面 编辑后事件
 * @author：gaokung
 */
import { ajax, promptBox, base, toast, cardCache } from 'nc-lightapp-front';
import { CARD_PAGE_INFO, URI, CARD } from '../../cons/constant.js';
import { doAjax, isEmptyObject } from './../../utils/commonUtil';
import { setHeadItemProp } from '../../../../pub/utils/FBMAfterEditUtil';
export default function afterEvent(props, moduleId, key, value, oldvalue) {
	console.log(moduleId, key, value, oldvalue);

	switch (key) {
		//组织变换编辑后事件
		case 'pk_org':
			pk_orgAfterEdit.call(this, moduleId, key, value, oldvalue, false);
			break;
		//票据号码变换编辑后事件
		case 'pk_register':
			pk_registerAfterEdit.call(this, moduleId, key, value, oldvalue);
			break;
		// 组织本币汇率
		case 'olcrate':
			olcrateAfterEdit.call(this, moduleId, key, value, oldvalue);
			break;
		// 网银标志
		case 'onlinebankflag':
			onlinebankflagAfterEdit.call(this, moduleId, key, value, oldvalue);
			break;
		default:
			break;
	}
}

export function pk_orgAfterEdit(moduleId, key, value, oldvalue, loadByDefOrg) {
	let eventdata = this.props.createHeadAfterEventData(CARD.pageCode, CARD.formHeadCode, '', moduleId, key, value);
	if (loadByDefOrg) {
		// 走后台编辑后事件
		getNewOrgInfo.call(this, eventdata);
		return;
	} else {
		//没有变化 直接退出
		if (value.value == oldvalue.value) {
			return;
		} else {
			/**
			 * 有变化，分为两种
			 * 1. 原来就没有值，不需要弹框,直接走后台编辑后事件
			 * 2. 原来有值：
			 *  2.1 弹窗交互，询问确认操作
			 *  2.2 走后确认后方法
			 */
			if (!oldvalue.value) {//原来就没有值
				// 走后台编辑后事件
				getNewOrgInfo.call(this, eventdata);
			} else {//原来有值
				// 弹窗交互
				promptBox({
					color: 'warning',
					title: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000000'),/* 国际化处理： 确认修改*/
					content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000001'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: changeOrgConfirm.bind(this, eventdata, value)
				});
			}
		}
	}
}

/**
 * 1.清空原来的值
 * 2.新值为空，结束；新值不空， 走后台编辑后事件
 * @param {*} eventdata 
 */
function changeOrgConfirm(eventdata, value) {
	this.props.form.EmptyAllFormValue(CARD.formHeadCode);
	if (isEmptyObject(value.value)) {
		this.props.initMetaByPkorg();
	} else {
		getNewOrgInfo.call(this,eventdata)
	}
}

function getNewOrgInfo(eventdata) {
	getDataAfterEvent.call(this, eventdata, (res) => {
		this.props.form.setAllFormValue({
			[CARD.formHeadCode]: res.data.card && res.data.card.head[CARD.formHeadCode]
		});
		//选择主组织以后，恢复其他字段的编辑性
		this.props.resMetaAfterPkorgEdit();
		// 先把网银标志设为不可编辑，票据为电票时才能编辑
		this.props.form.setFormItemsDisabled(CARD.formHeadCode, { onlinebankflag: true });
		// 先把同行标志设为不可编辑，勾选网银后才能编辑
		this.props.form.setFormItemsDisabled(CARD.formHeadCode, { issamebank: true });
		// 勾选网银后才显示
		this.props.form.setFormItemsVisible(CARD.formHeadCode, {
			banksubcompany: false
		});
	});
}

function pk_registerAfterEdit(moduleId, key, value, oldvalue) {
	let eventdata = this.props.createHeadAfterEventData(CARD.pageCode, CARD.formHeadCode, '', moduleId, key, value);
	// props.form.EmptyAllFormValue(CARD.formHeadCode);
	if (isEmptyObject(value.values)) {
		eventdata.card.head[CARD.formHeadCode].rows[0].values.pk_register.display = '';
		eventdata.card.head[CARD.formHeadCode].rows[0].values.pk_register.value = '';
	}
	if (value.value !== oldvalue.value) {
		getDataAfterEvent.call(this, eventdata, (res) => {
			this.props.form.setAllFormValue({
				[CARD.formHeadCode]: res.data.card && res.data.card.head[CARD.formHeadCode]
			});
			let isEbill = res.data.isEbill;
			// 票据类型为电票时，网银标识可编辑
			if (isEbill == true) {
				this.props.form.setFormItemsDisabled(CARD.formHeadCode, { onlinebankflag: false });
			}
			let fieldsEditable = res.data.fieldsEditable;
			if (fieldsEditable) {
				let items = [];
				Object.keys(fieldsEditable).forEach(function(key) {
					items.push({
						itemName: key,
						editable: fieldsEditable[key]
					});
				});
				setHeadItemProp.call(this, this.props, CARD.formHeadCode, items);
			}
		});
	}
}

function olcrateAfterEdit(moduleId, key, value, oldvalue) {
	let eventdata = this.props.createHeadAfterEventData(this.pageId, CARD.formHeadCode, '', moduleId, key, value);
	// 空值，直接退出
	if (isEmptyObject(value.value)) {
		return;
	}
	// 重算背书金额
	if (value.value !== oldvalue.value) {
		getDataAfterEvent.call(this, eventdata, (res) => {
			this.props.form.setAllFormValue({
				[CARD.formHeadCode]: res.data.card && res.data.card.head[CARD.formHeadCode]
			});
		});
	}
}

function onlinebankflagAfterEdit(moduleId, key, value, oldvalue) {
	// 勾选网银后的处理
	if (value.value) {
		// 同行标志，勾选网银后能编辑
		this.props.form.setFormItemsDisabled(CARD.formHeadCode, { issamebank: false });
		// 勾选网银后显示
		this.props.form.setFormItemsVisible(CARD.formHeadCode, {
			banksubcompany: true
		});
	} else {
		// 同行标志，取消勾选网银后不能编辑
		this.props.form.setFormItemsDisabled(CARD.formHeadCode, { issamebank: true });
		// 取消勾选网银后不显示
		this.props.form.setFormItemsVisible(CARD.formHeadCode, {
			banksubcompany: false
		});
	}
}

/**
 * 与后台进行数据交互的编辑后事件
 * @param {*} data
 * @param {*} callback
 */
function getDataAfterEvent(data, callback) {
	ajax({
		url: URI.afterEvent,
		data: data,
		success: (res) => {
			if (res.success) {
				callback && callback(res);
			}
		}
	});
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/