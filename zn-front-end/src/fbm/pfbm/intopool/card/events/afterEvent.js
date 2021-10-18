/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
//表头编辑后事件
import {
	ajax,
	toast,
	promptBox
} from 'nc-lightapp-front';
import {
	cardEvent
} from '../../../../public/container/index';
import {
	setHeadItemsDisabled
} from '../../../../public/container/page';
import { setHeadItemProp, setBodyItemProp } from '../../../../pub/utils/FBMAfterEditUtil.js';
import { clsRowno } from '../../../../public/container/common';

export function afterEvent(props, moduleId, key, value, oldValue) {
	const eventDatas = this.props.createTabsAfterEventData(this.pageId, this.formId, this.tabOrder, moduleId, key, value); //编辑后事件整单数据
	let eventData = { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };
	const commonAfterEventArr = ['repprcact', 'olcrate', 'creditamount', 'glcrate', 'gllcrate']; //还本金额/本币汇率/释放授信额度
	if (key === 'pk_org') {
		//	this.props.resMetaAfterPkorgEdit();
		this.props.button.setButtonDisabled(['addRow', 'delRow'], false);//恢复增行编辑

		//财务组织
		if (!oldValue.value) {
			// 老数据为空，直接请求
			changeOrg.call(this, value, eventData);
		} else if (value.value !== oldValue.value) {
			promptBox({
				color: "warning",
				title: this.props.MutiInit.getIntl("36200BT") && this.props.MutiInit.getIntl("36200BT").get('36200BT-000000'),/* 国际化处理： 确认*/
				content: this.props.MutiInit.getIntl("36200BT") && this.props.MutiInit.getIntl("36200BT").get('36200BT-000001'),/* 国际化处理： 切换组织将会清空您录入的信息，请确认?*/
				beSureBtnClick: () => {
					changeOrg.call(this, value, eventData);
				},
				cancelBtnClick: () => {
					props.form.setFormItemsValue(this.formId, { 'pk_org': oldValue });
				}
			});
		}

	} else if (key === 'pk_curr') {
		//币种
		if (value.value !== oldValue.value && value.value) {
			//setHeadItemsDisabled.call(this, 'olcrate');//币种为人民币时禁用组织本币汇率
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// this.props.form.setAllFormValue({
				// 	[this.formId]: res.data.head && res.data.head[this.formId]
				// });
				setAfterEditFormValue.call(this, this.props, res);

				//this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
			});
		}
	} else if (key === 'inputdate') {//入池日期
		if (value.value !== oldValue.value && value.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			});
		}
	} else if (key === 'olcrate' || key === 'glcrate' || key === 'gllcrate' || key === 'poundagemoney' || key === 'usedccamount' || key === 'money' || key === 'securitymoney'
		|| key === 'occucommoney' || key === 'occusharemoney' || key === 'invoicedate' || key === 'hidereceivebankacc' || key === 'pk_payacc') {

		if (value.value !== oldValue.value && value.value) {
			if (key === 'money' || key === 'poundagemoney' || key === 'occucommoney' || key === 'occusharemoney' || key === 'securitymoney') {
				if (value.value <= 0) {
					toast({ color: 'warning', content: this.props.MutiInit.getIntl("36200BT") && this.props.MutiInit.getIntl("36200BT").get('36200BT-000002') });/* 国际化处理： 金额不能等于零*/
					return;
				}
			}
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				// this.props.form.setAllFormValue({
				// 	[this.formId]: res.data.head && res.data.head[this.formId]
				// });
				// this.props.cardTable.setAllTabsData(res.data.bodys, this.tabOrder);
				setAfterEditFormValue.call(this, this.props, res);

			});
		}

	}

}
export function afterEventEdit(props, moduleId, key, value, async = false) {
	if (value.value) {
		if (key === 'pk_org') {
			props.initMetaByPkorg();
			props.form.EmptyAllFormValue(this.formId);
			props.cardTable.setAllTabsData(null, this.tabOrder, null, []);
			//	props.button.setButtonDisabled(["addRow", "deleteRow"], true);
			props.form.setFormItemsValue(moduleId, {
				pk_org: value,
				pk_org_v: value
			})
			this.props.resMetaAfterPkorgEdit();
		}
	}



}
function changeOrg(value, eventData) {
	cardEvent.changeOrg.call(this, value).then(() => {
		if (value.value) {
			cardEvent.getAfterEventData.call(this, eventData).then(res => {
				setAfterEditFormValue.call(this, this.props, res);
			}).then(() => {
				this.props.cardTable.addRow(this.tabCode, undefined, {}, true);
				clsRowno.call(this, this.tabCode);
			});
		}
	})
}

function setAfterEditFormValue(props, res) {
	let { success, data } = res;
	let { card, retExtParam, headProp, bodyItemProps, headItemProps } = data;
	let { head, bodys } = card;
	props.form.setAllFormValue({ [this.formId]: head[this.formId] });
	props.cardTable.setAllTabsData(bodys, this.tabOrder);
	setHeadItemProp(props, this.formId, headItemProps);
	setBodyItemProp(props, this.tabCode, bodyItemProps, bodys);
}

/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/