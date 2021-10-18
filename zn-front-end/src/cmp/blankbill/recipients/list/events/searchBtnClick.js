/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax,cardCache ,toast} from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, SEARCH_CODE, LIST_TABLECODE, CARD__PAGECODE } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
	let oid
    if (props.meta.getMeta()[SEARCH_CODE].oid) {
        oid = props.meta.getMeta()[SEARCH_CODE].oid;//动态获取oid
	}	
	if (searchVal) {	
		let searchVal = this.props.search.getAllSearchData(SEARCH_CODE);
		setDefData( SEARCH_KEY,  BBR_CACHEKEY, searchVal);
		let groupCondition=null;
		let activeTab=this.state.activeKey;
	    if(activeTab=='0'){
			groupCondition = SAVED;
		}else if(activeTab=='2'){
			groupCondition = APPROVING;
		}else{
			groupCondition=[];
		}
		let conditions=Array.isArray(groupCondition) ? groupCondition : [groupCondition];
		let pageInfo = props.table.getTablePageInfo(LIST_TABLECODE);
		let data = {
			querycondition: searchVal,
			custcondition: {
				logic: 'or', //逻辑操作符，and、or
				conditions
			},
			pageInfo: pageInfo,
			pageCode: LIST_PAGECODE,
			queryAreaCode: SEARCH_CODE, //查询区编码
			oid : oid,
			//oid: '1001Z61000000000B6Z5', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: QUERY,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						if (data.grid) {
							let total = data.grid[LIST_TABLECODE].pageInfo.total;
							let content = this.state.json['36070BBR-000015'] + total + this.state.json['36070BBR-000016'];/* 国际化处理： 共,条，*/
							toast({
								duration: 3,
								color: 'success',
								content: content
								});
							this.props.table.setAllTableData(LIST_TABLECODE, data.grid[LIST_TABLECODE]);
							this.setState({ last_pk: data.grid[LIST_TABLECODE].allpks[0] });
						} else {
							toast({
								duration: 3,
								color: 'warning',
								content: this.state.json['36070BBR-000013'] // 未查询出符合条件的数据！
							});
							this.props.table.setAllTableData(LIST_TABLECODE, { rows: [] });
						}
					} else {
						this.props.table.setAllTableData(LIST_TABLECODE, {
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