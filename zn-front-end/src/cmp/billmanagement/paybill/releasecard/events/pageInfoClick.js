/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache } = cardCache;
import { PAYBILL_CONST } from '../../cons/constant.js';

export default function(props, pks) {
	let cardData = getCacheById(pks, PAYBILL_CONST.paybillCacheKey);
	if (cardData) {
		this.props.form.setAllFormValue({ [this.formId]: cardData.head[PAYBILL_CONST.card_from_id] });
		this.props.cardTable.setTableData(this.tableId, cardData.body['paybilldetail_table']);
	} else {
		// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		// let searchVal = this.props.search.getAllSearchData('search_D5');
		let data = {
			pk: pks ,
			pageid: '36070PBR_D5_card'
		};
		//得到数据渲染到页面
		//let that = this;
		ajax({
			url: '/nccloud/cmp/billmanagement/querybypk.do',
			data: data,
			success: (res) => {
				if (res.data) {
					//更新缓存

					let billno = '';
					let bill_status = '';
					let pagecode = '';
					if (res.data.head) {
						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						billno = res.data.head[this.formId].rows[0].values.bill_no.value;
						bill_status = res.data.head[this.formId].rows[0].values.bill_status.value;
						pagecode = res.data.head[this.formId].rows[0].values.trade_type.value;
					}

					this.setState({
						billno: billno
					});
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
					props.pushTo('/card', { status: 'browse', id: pks, bill_status: bill_status, pagecode: pagecode });

					// props.linkTo('/cmp/billmanagement/paybill/card/index.html', {
					// 	status: 'browse',
					// 	id: pks,
					// 	bill_status: bill_status,
					// 	pagecode:pagecode
					// });

					this.pageShow();

					//props.setUrlParam(pks); //动态修改地址栏中的id的值
					//props.setUrlParam(pks)
				} else {
					this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				}
			}
		});
	}
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/