/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { constant } from "../../config/config";
import { cardCache,deepClone } from 'nc-lightapp-front';
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;

let { setDefData } = cardCache;
//点击查询，获取查询区数据
export default function clickSearchBtn(props,searchVal) {
	let that = this;
	if(searchVal){
		let pageInfo = props.table.getTablePageInfo(this.tableId);
		let searchClone = deepClone(searchVal); // 克隆
		setDefData(constant.searchKey, this.cacheDataSource, searchClone); // 将克隆的查询区条件存入缓存
		that.querydata(searchVal, pageInfo);
	}
}

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/