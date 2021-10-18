/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache } = cardCache;
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const {APPCODE, CARD__PAGECODE, CARD_TABLECODE, CARD_FORMCODE, FORM_BBP_02} = APP_INFO;
const { PK_NAME, VBILLNO, PK_ORG, TS } = BILL_FIELD;
const { BBP_CACHEKEY, AGGVO_CLASSNAME, VO_CLASSNAME } = BBP_CONST;
const { DELETE, SAVE, ORGCHANGE, QUERYCARD } = REQUEST_URL;
export default function(props, pks) {
	props.setUrlParam(pks);
	if(this.getCacheDataById.call(this,pks)){
	} else {
		let data = {
			pk: pks ,
			pageid: CARD__PAGECODE
		};
		//得到数据渲染到页面
		//let that = this;
		ajax({
			url: QUERYCARD,
			data: data,
			success: (res) => {
				if (res.data) {
					//更新缓存
					let bill_status = '';
					let pagecode = '';
					let billno;
					let billId;
					if (res.data.head) {
						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					 	billno = res.data.head[this.formId].rows[0].values[VBILLNO].value;
						billId= res.data.head[this.formId].rows[0].values[PK_NAME].value;
						// bill_status = res.data.head[this.formId].rows[0].values.bill_status.value;
						// pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
					}
					this.billno = billno;
					this.billId = billId;
					if (res.data.body) {
						this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					}
					// 更新缓存
					updateCache(
						PK_NAME,
						pks,
						res.data,
						CARD_FORMCODE,
						BBP_CACHEKEY
					);
                	this.toggleShow();
				} else {
					this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				}
			}
		});
	}
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/