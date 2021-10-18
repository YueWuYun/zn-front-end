/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache } = cardCache;
import { PAYBILL_CONST } from '../../cons/constant.js';

export default function(props, pks) {
	props.setUrlParam(pks);

	 if(this.getCacheDataById.call(this,pks)){
	} else {
		let data = {
			pk: pks ,
			pageid: '36070PBR_C04'
		};
		//得到数据渲染到页面
		//let that = this;
		ajax({
			url: '/nccloud/cmp/billmanagement/querybypk.do',
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
						billno = res.data.head[this.formId].rows[0].values.bill_no.value;
						billId= res.data.head[this.formId].rows[0].values.pk_paybill.value;
						bill_status = res.data.head[this.formId].rows[0].values.bill_status.value;
						pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
					}

						this.setState({
						billno: billno,
						billId:billId

					});
					this.billno=billno;
					if (res.data.body) {
						this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					}
					// 更新缓存
					updateCache(
						PAYBILL_CONST.paybill_pkname,
						pks,
						res.data,
						PAYBILL_CONST.card_from_id,
						PAYBILL_CONST.paybillCacheKey
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