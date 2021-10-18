/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax,cardCache,toast } from 'nc-lightapp-front';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url,
	oid,
	comp_setServal
} from '../../cons/constant.js';
let {setDefData, getDefData } = cardCache;
import { PAYBILL_CONST } from '../../cons/constant.js';
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
	 let search_oid=oid;
	 if (props.meta.getMeta()[this.searchId].oid) {
        search_oid = props.meta.getMeta()[this.searchId].oid;//动态获取oid
  }	
	if (searchVal) {

		let pageInfo = props.table.getTablePageInfo(this.tableId);
		searchVal.conditions.push(...comp_setServal);
		 setDefData( PAYBILL_CONST.search_key,  PAYBILL_CONST.paybillCacheKey, searchVal);
		let groupCondition=null;
		if(this.navChange==0){
			groupCondition=PAYBILL_CONST.SAVED;
		}else if(this.navChange==9){
			groupCondition=PAYBILL_CONST.UNCONFIRM;
		}else{
			groupCondition=[];
		}
		let conditions=Array.isArray(groupCondition) ? groupCondition : [groupCondition];
		let data = {
			querycondition: searchVal,
			 custcondition: {
				 logic: "and",   //逻辑操作符，and、or
				 conditions
			 },
			pageInfo: pageInfo,
			pagecode: '36070PBR_D5_list',
			queryAreaCode: 'search_D5', //查询区编码
			//oid: '1001Z61000000000B6Z5', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			//oid: '1001Z61000000002IZNN',
			oid: search_oid,
			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/paybills/query.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						if (data.statusNum) {
							this.setState({ numvalues: data.statusNum });
							if( data.statusNum.ALL){
								toast({
									color: 'success'	
								});
							} else{
								toast({
									color: 'warning',
									content:
										this.props.MutiInit.getIntl('36070PBRCOMP') &&
										this.props.MutiInit.getIntl('36070PBRCOMP').get('36070PBRCOMP-000061')
								});
							}
						
						}
						if (data.grid) {
							this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
						} else {
							this.props.table.setAllTableData(this.tableId, { rows: [] });
						}
					} else {
						this.props.table.setAllTableData(this.tableId, {
							rows: [],
							pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 }
						});
					}
				}
			}
		});
	}
}

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/