/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax,cardCache ,toast} from 'nc-lightapp-front';

let {setDefData, getDefData } = cardCache;
import { PAYBILL_CONST } from '../../cons/constant.js';
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';

//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
	let oid = PAYBILL_CONST.oid;
    if (props.meta.getMeta()[this.searchId].oid) {
        oid = props.meta.getMeta()[this.searchId].oid;//动态获取oid
  }	
	if (searchVal) {	
		 let searchVal = this.props.search.getAllSearchData(this.searchId);
	
         setDefData( PAYBILL_CONST.search_key,  PAYBILL_CONST.paybillCacheKey, searchVal);
	   let groupCondition=null;
	   let activeTab=this.state.activeKey;
	    if(activeTab=='0'){
			groupCondition=PAYBILL_CONST.SAVED;
		}else if(activeTab=='2'){
			groupCondition=PAYBILL_CONST.APPROVING;
		}else{
			groupCondition=[];
		}
		let conditions=Array.isArray(groupCondition) ? groupCondition : [groupCondition];
		let pageInfo = props.table.getTablePageInfo(this.tableId);
		
		 pageInfo.pageIndex=0;

		let data = {
			querycondition: searchVal,
			custcondition: {
				logic: 'or', //逻辑操作符，and、or
				conditions
			},
			pageInfo: pageInfo,
			pageCode: '36070PBR_D5_list',
			queryAreaCode: 'search_D5', //查询区编码
			oid : oid,
			//oid: '1001Z61000000000B6Z5', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
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
									color: 'success',
									content:loadMultiLang(this.props, '36070PBR-000117')
							
								});
							} else{
								toast({
									color: 'warning',
									content:loadMultiLang(this.props, '36070PBR-000102')
								});
							}
						
						}

						if (data.grid) {	
							this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
							this.setState({ last_pk: data.grid[this.tableId].allpks[0] });
						} else {
							this.props.table.setAllTableData(this.tableId, { rows: [] });
						}
					} else {
						//this.props.table.setAllTableData(this.tableId, {rows:[]});
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