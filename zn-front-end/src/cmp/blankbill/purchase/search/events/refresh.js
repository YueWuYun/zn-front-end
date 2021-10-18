/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../../cons/constant.js';

export default function refresh(props) {
	let search_Id = 'search_D5';
	let table_Id = 'table_D5';
	let page_Id = '36070PBR_D5_list';
	//查询condition
	let pageInfo = props.table.getTablePageInfo(table_Id);
	let refreshsearchVal = props.search.getAllSearchData(search_Id);
	let data = {
		querycondition: refreshsearchVal,
		custcondition: {
			logic: 'and', //逻辑操作符，and、or
			conditions: []
		},
		pageInfo: pageInfo,
		pagecode: '36070PBR_D5_list',
		queryAreaCode: 'search_D5', //查询区编码
		oid: '1001Z61000000002IZNN', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		querytype: 'tree'
	};
	ajax({
		url: '/nccloud/cmp/paybills/query.do',
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					if (data.grid) {
						props.table.setAllTableData(table_Id, data.grid[table_Id]);
						if (data.statusNum) {
							this.setState({ numvalues: data.statusNum });
						}
					}
				} else {
					props.table.setAllTableData(table_Id, { rows: [] });
				}
			}
		}
	});
}

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/