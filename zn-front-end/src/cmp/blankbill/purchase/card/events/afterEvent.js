/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
import { checkNegative } from '../../../../public/cardEvent';
const {APPCODE, CARD__PAGECODE, CARD_TABLECODE, CARD_FORMCODE, } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG, PKNOTETYPE, GZ_BZ, PK_BANK, PK_BANKDOC} = BILL_FIELD
const { BBP_CACHEKEY } = BBP_CONST
const { DELETE, SAVE, ORGCHANGE} = REQUEST_URL;
export default function afterEvent(props, moduleId, key, value, changedrows, i) {

	switch (key) {
		case PK_ORG:
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
									this.setFildDisabled();
								}
								if (res.data.body) {
									props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
									// props.cardTable.setStatus(CARD_TABLECODE, 'edit');
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
				//this.props.modal.show('addNode');
				promptBox(
					{
						color: 'warning',
						hasCloseBtn: false,
						content: this.state.json['36070BBP-000007'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
						beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
						cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
						onEscapeKeyUp: this.cancelBtnClick, // esc关闭对话框
						//beSureBtnClickDelete.call(this, props, data);
					} // 确定按钮点击调用函数,非必
				);
			}
			break;
		case VBILLNO:
			let vbillno = props.form.getFormItemsValue(CARD_FORMCODE, VBILLNO);
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
					url: REQUEST_URL.BILLSERIESAFTER,
					data: eventdata,
					async: false,
					success: (res) => {
						console.log('res',res);
						if (res.success) {
							if (res.data) {
								let {head,body } = res.data;
								if (head) {
									props.form.setAllFormValue({ [CARD_FORMCODE]: head[CARD_FORMCODE] });
									props.form.setFormItemsDisabled(CARD_FORMCODE,{PK_ORG: false});
								}
								if (body) {
									props.cardTable.setTableData(CARD_TABLECODE, body[CARD_TABLECODE]);
								}else{
									props.cardTable.setTableData(CARD_TABLECODE, { rows: [] });
								}
								
							} else {
								props.form.setAllFormValue({ [CARD_FORMCODE]: { rows: [] } });
								props.cardTable.setTableData(CARD_TABLECODE, { rows: [] });
							}
						}else{
							props.form.setAllFormValue({ [CARD_FORMCODE]: { rows: [] } });
							props.cardTable.setTableData(CARD_TABLECODE, { rows: [] });
						}
					},
					error:(res)=>{
						console.log('res',res);
						toast({
							color: 'warning',
							content: res.message
						}); /* 国际化处理： 保存成功*/
						props.cardTable.setTableData(CARD_TABLECODE, { rows: [] });
					}
					

				});
			}else{
				props.cardTable.setTableData(CARD_TABLECODE, { rows: [] });
			}
			break;
		case GZ_BZ: // 币种
			props.form.setFormItemsValue(moduleId, {
				'pk_bank': {
				display: null,
				value: null
				},
				'pk_bankdoc': {
					display: null,
					value: null
				}
			});
			break;
		case PK_BANK: // 银行账号
			let pk_bank = props.form.getFormItemsValue(moduleId, PK_BANK);
			let bankdoc = props.form.getFormItemsValue(moduleId, PK_BANKDOC);
			let bankdocname, pk_bankdoc, accname, accpk
			accname = i.refcode;
			accpk = i.refpk;
			props.form.setFormItemsValue(moduleId, {
				'pk_bank': {
					display: accname,
					value: accpk
				}
			});

			if(pk_bank.value && !pk_bank.value == ''){
				if (bankdoc.value == '' || bankdoc.value == null) {
					if (i) {
						bankdocname = i.values['bd_bankdoc.name'].value;
						pk_bankdoc = i.values['bd_bankdoc.pk_bankdoc'].value;
						props.form.setFormItemsValue(moduleId, {
							'pk_bankdoc': {
								display: bankdocname,
								value: pk_bankdoc
							}
						});
					}
				}
			}else{
				props.form.setFormItemsValue(moduleId, {
					'pk_bankdoc': {
						display: null,
						value: null
					}
				});
			}
			break;
		case 'gz_gbf': // 工本费
		case 'gz_sxf': // 手续费
			if (!checkNegative.call(this, key, value)) {
				return;
			}
			break;
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/