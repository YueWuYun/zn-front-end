/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache } = cardCache;
import { CacheKey, formId, tableId, searchId, pagecode, formId_org, formId_01, formId_02, formId_03, oid, table_orgs } from '../constants';

export default function pageInfoClick(props, pk) {
	let cardData = getCacheById(pk, CacheKey);
	if (cardData) {
		let { head, body } = cardData;
		if (head) {
			this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
			let billno = cardData.head[formId].rows[0].values.vbillno.value;
			this.setState({ vbillno: billno });
		}
		if (body) {
			this.props.cardTable.setTableData(this.tableId, cardData.body[tableId]);
		} else {
			this.props.table.setAllTableData(this.tableId, { rows: [] });
		}
	} else {
		let pks = [];
		pks.push(pk);
		let data = {
			pks: pks,
			pageid: pagecode
		};
		//得到数据渲染到页面
		ajax({
			url: '/nccloud/cmp/informer/informercardquery.do',
			data: data,
			success: (res) => {
				if (res.data) {
					if (res.data.head) {
						this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
						let billno = res.data.head.form_inform_01.rows[0].values.vbillno.value;
						this.setState({ vbillno: billno });
					}
					if (res.data.body) {
						this.props.table.setAllTableData(this.tableId, res.data.body[tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
					props.setUrlParam({
						status: 'browse',
						id: pk
					});
					//更新缓存
					updateCache('pk_informer', pk, res.data, formId, CacheKey);
				} else {
					this.props.form.setAllFormValue({ [formId]: { rows: [] } });
					this.props.table.setTableData(tableId, { rows: [] });
				}
			}
		});
	}
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/