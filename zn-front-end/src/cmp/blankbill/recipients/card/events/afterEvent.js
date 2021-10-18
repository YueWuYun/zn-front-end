/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, CARD__PAGECODE, CARD_FORMCODE, CARD_TABLECODE, BODY_EDIT_CODE} = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING  } = BBR_CONST
const { ORGCHANGE,BILLNUMBEREVENT } = REQUEST_URL
export default function afterEvent(props, moduleId, key, value, changedrows, i) {

		// 财务组织
	if (key === 'pk_org') {
		if (value.value) {
			props.resMetaAfterPkorgEdit();
		}
		if (props.cardTable.getNumberOfRows(CARD_TABLECODE) <= 0) {
			props.cardTable.addRow(this.tableId);
		}
		let eventdata = props.createHeadAfterEventData(
			CARD__PAGECODE,
			CARD_FORMCODE,
			CARD_TABLECODE,
			moduleId,
			key,
			value
		);
		let newvalue = eventdata.newvalue.value;
		let oldvalue = eventdata.oldvalue.value;
		let oldorgDis = eventdata.oldvalue.display;
		if (oldvalue == null || oldvalue == '') {
			ajax({
				url: ORGCHANGE,
				data: eventdata,
				async: false,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							if (res.data.head) {
								props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							}
							if (res.data.body) {
								props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						} else {
							props.form.setAllFormValue({ [this.formId]: { rows: [] } });
							props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					}
				}
			});
		}
		if (oldvalue != newvalue && (oldvalue != '' && oldvalue != null)) {
			this.setState({
				oldorg: oldvalue,
				oldorgDis: oldorgDis
			});
			promptBox(
				{
					color: 'warning',
					hasCloseBtn: false,
					content: this.state.json['36070BBR-000008'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					onEscapeKeyUp: this.cancelBtnClick, // esc关闭对话框
					//beSureBtnClickDelete.call(this, props, data);
				} // 确定按钮点击调用函数,非必
			);
		}
	} 
		// 票据编号
	if(key === VBILLNO){
		let vbillno = props.form.getFormItemsValue(moduleId, VBILLNO);
		if(vbillno.value){
			let eventdata = props.createHeadAfterEventData(
				CARD__PAGECODE,
				CARD_FORMCODE,
				CARD_TABLECODE,
				moduleId,
				key,
				value
			);
			ajax({
				url: BILLNUMBEREVENT,
				data: eventdata,
				async:false,
				success: (res) => {
					if (res.success) {
						if (res.data) {
							let {head,body } = res.data;
							if (head) {
								props.form.setAllFormValue({ [CARD_FORMCODE]: head[CARD_FORMCODE] });
								props.form.setFormItemsDisabled(CARD_FORMCODE,{PK_ORG: false});
							}
							if (body) {
								props.cardTable.setTableData(CARD_TABLECODE, body[CARD_TABLECODE]);
							}
						} else {
							props.form.setAllFormValue({ [CARD_FORMCODE]: { rows: [] } });
							props.cardTable.setTableData({ [CARD_TABLECODE]: { rows: [] } });
						}
					}
				}
			});
		}
	}
		// 领用限额
	if (key == 'ly_max') {
		if (moduleId === CARD_FORMCODE) {
			let ly_max = props.form.getFormItemsValue(moduleId, 'ly_max');
			if(ly_max){
				props.cardTable.setColValue(CARD_TABLECODE, 'ly_max', { value: ly_max.value, display: ly_max.value });
			}
		}
	}
		// 领用用途
	if (key == 'ly_use') {
		if (moduleId === CARD_FORMCODE) {
			let ly_use = props.form.getFormItemsValue(moduleId, 'ly_use');
			if(ly_use){
				props.cardTable.setColValue(CARD_TABLECODE, 'ly_use', { value: ly_use.value, display: ly_use.value });
			}
		}
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/