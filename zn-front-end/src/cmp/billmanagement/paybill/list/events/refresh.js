/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import { PAYBILL_CONST } from '../../cons/constant.js';
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';
export default function refresh(props) {
	let search_Id = 'search_D5';
	let table_Id = 'table_D5';
	let page_Id = '36070PBR_D5_list';
	//查询condition
	let oid = PAYBILL_CONST.oid;
	if (this.props.meta.getMeta()[this.searchId].oid) {
		oid = this.props.meta.getMeta()[this.searchId].oid; //动态获取oid
	}
	let pageInfo = props.table.getTablePageInfo(this.tableId);
    pageInfo.pageIndex = 0;
	let refreshsearchVal =getDefData(PAYBILL_CONST.search_key, PAYBILL_CONST.paybillCacheKey);
	if(!refreshsearchVal){
		refreshsearchVal=props.search.getAllSearchData(search_Id);
		
	}

	let activeTab=this.state.activeKey;
	let groupCondition;
	if(activeTab=='0'){
		groupCondition=PAYBILL_CONST.SAVED;
	}else if(this.navChange=='2'){
		groupCondition=PAYBILL_CONST.APPROVING;
	}else{
		groupCondition=[];
	}
	let conditions=Array.isArray(groupCondition) ? groupCondition : [groupCondition];
	let data = {
		querycondition: refreshsearchVal,
		custcondition: {
			logic: 'or', //逻辑操作符，and、or
			conditions
		},
		pageInfo: pageInfo,
		pagecode: '36070PBR_D5_list',
		queryAreaCode: 'search_D5', //查询区编码
		oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
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
							toast({
								color: 'success',
								content:loadMultiLang(this.props, '36070PBR-000118')
						
							});
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