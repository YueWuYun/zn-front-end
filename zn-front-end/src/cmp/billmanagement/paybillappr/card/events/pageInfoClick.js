/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';

export default function(props, pks) {
	// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
	// let searchVal = this.props.search.getAllSearchData('search_D5');
	let data = {
		pks: pks,
		pageid: '36070PBR_D5_card'
	};
	//得到数据渲染到页面
	//let that = this;
	ajax({
		url: '/nccloud/cmp/billmanagement/querybypk.do',
		data: data,
		success: (res) => {
			if (res.data) {
				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
				}
				props.setUrlParam(pks); //动态修改地址栏中的id的值
			} else {
				this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
			}
		}
	});
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/