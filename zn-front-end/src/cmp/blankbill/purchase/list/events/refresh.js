/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { PK, VBILLNO } = BILL_FIELD;
const { SEARCH_KEY,LINK_KEY, BBP_CACHEKEY, SAVED, APPROVING } = BBP_CONST;
const { LIST_PAGECODE, LIST_TABLECODE, SEARCH_CODE } = APP_INFO;
const { QUERY, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
export default function refresh(props) {
	//查询condition
	let pageInfo = props.table.getTablePageInfo(LIST_TABLECODE);
    pageInfo.pageIndex = 0;
	let refreshsearchVal = getDefData(SEARCH_KEY, BBP_CACHEKEY);
	if(!refreshsearchVal){
		// refreshsearchVal=props.search.getAllSearchData(SEARCH_CODE);
		// refreshsearchVal = null;
		// refreshsearchVal.conditions.push(null);
		toast({
			duration: 3,
			color: 'success',
			content: this.state.json['36070BBP-000014']
		});
		return;
	}
	let oid
	let groupCondition = [];
	if (props.meta.getMeta()[SEARCH_CODE].oid) {
	  oid = props.meta.getMeta()[SEARCH_CODE].oid;//动态获取oid
	}	
	let conditions=Array.isArray(groupCondition) ? groupCondition : [groupCondition];
	let data = {
		querycondition: refreshsearchVal,
		custcondition: {
			logic: 'or', //逻辑操作符，and、or
			conditions
		},
		pageInfo: pageInfo,
		pagecode: LIST_PAGECODE,
		queryAreaCode: SEARCH_CODE, //查询区编码
		oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		querytype: 'tree'
	};
	ajax({
		url: QUERY,
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					toast({
						duration: 3,
						color: 'success',
						content: this.state.json['36070BBP-000014']
						});
					if (data.grid) {
						props.table.setAllTableData(LIST_TABLECODE, data.grid[LIST_TABLECODE]);
						this.props.table.setAllTableData(LIST_TABLECODE, data.grid[LIST_TABLECODE]);
						this.setState({ last_pk: data.grid[LIST_TABLECODE].allpks[0] });
					}
				} else {
					toast({
						duration: 3,
						color: 'warning',
						content: this.state.json['36070BBP-000010']
					});
					this.props.table.setAllTableData(LIST_TABLECODE, { rows: [] });
				}
			}
		}
	});
}

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/