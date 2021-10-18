/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax } from 'nc-lightapp-front';

export default function(props, config, pks) {
	let pageInfo = this.props.table.getTablePageInfo(this.tableId);
	let searchVal = this.props.search.getAllSearchData('search_D5');
	let that = this;
	// 后台还没更新，暂不可用
	let data = {
		pks: pks,
		pageid: '36070PBR_D5_list'
	};
	ajax({
		url: '/nccloud/cmp/paybills/querybypks.do',
		data: data,
		success: function(res) {
			that.props.table.setAllTableData('table_D5', res.data['table_D5']);
			that.setState({ numvalues: {} });
		}
	});
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/