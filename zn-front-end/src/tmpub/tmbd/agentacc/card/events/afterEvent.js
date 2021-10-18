/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
import { ajax, promptBox } from 'nc-lightapp-front';
//引入配置常量定义
import { card_page_id, card_from_id, card_table_id } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl';
import { clearCardItemValue } from '../../util/util.js';
import { setHeadItemProp } from "../../util/util.js";
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	let status = props.getUrlParam('status');
	let eventData, newvalue, extParam, newdisplay, oldvalue, olddisplay;
	switch (key) {
		// 组织
		case 'pk_org':
			//获取页面数据
			eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue.value; //新值value
			newdisplay = eventData.newvalue.display; //新值display
			if(eventData.oldvalue){
				oldvalue = eventData.oldvalue.value; //旧值value
				olddisplay = eventData.oldvalue.display; //旧值display
			}else{
				oldvalue = null;
				olddisplay = null;
			}
			let isOldEmpty = (oldvalue == null || olddisplay == null || olddisplay == '') ? true : false;
			//如果新值不为空，旧值为空，则请求后端进行编辑后逻辑处理
			if (!oldvalue && newvalue) {
				props.form.setFormItemsDisabled(card_from_id,{'pk_bankaccount':false});
				extParam = { 'uiState': status };
				ajax({
		            url: requesturl.afteredit,
		            data: eventData,
		            success: function (res) {
		                let { success, data } = res;
		                if (success) {
							if (res.data.head) {
								props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
							}
							if (res.data.body) {
								props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
							}
		                }
					}
				})
				this.initBodyBtn(false);
				// this.props.form.setFormItemsDisabled(this.formId, {'pk_bankaccount':false});
				props.resMetaAfterPkorgEdit();
				// props.cardTable.addRow(this.tableId);
			}
			//旧的值不是空的
			else if (oldvalue){
				//新的值是空的（清空）
				this.setState({
					oldorg: oldvalue,
					oldorgDis:olddisplay
				});
				// this.props.modal.show('switchorg');	//给出提示
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000021'),
					content: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000022'),//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureOrgBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelOrgBtnClick //取消按钮事件回调
				});
				//新的值不是空的（修改）
				if (newvalue && oldvalue != newvalue){
					// props.resMetaAfterPkorgEdit();
				}
			}
			this.props.form.setFormItemsDisabled(this.formId,{'pk_org':false});

			break;
		// 转账类型
		case 'pk_bankaccount':
			//获取页面数据
			eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, key, value);
			//获取编辑的值
			newvalue = eventData.newvalue.value;
			//如果值不为空，则请求后端进行编辑后逻辑处理
			if (newvalue != null) {
				extParam = { 'uiState': status };
				ajax({
		            url: requesturl.afteredit,
		            data: eventData,
		            success: function (res) {
		                let { success, data } = res;
		                if (success) {
							if (res.data.head) {
								props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
							}
							if (res.data.body) {
								props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
							}
		                }
					}
				})
			}
			//如果值为空，则表明清空组织，直接在前端处理清空逻辑，不发起请求
			else {
				clearCardItemValue(props.form, card_from_id, ['pk_bankaccount.pk_bankaccbas.financeorg'
			,'pk_bankaccount.pk_bankaccbas.pk_banktype','pk_bankaccount.pk_bankaccbas.pk_bankdoc','pk_bankaccount.pk_bankaccbas.arapprop']);
			}
			break;
		default:
			break;
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/