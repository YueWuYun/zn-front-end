/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { createPage, ajax, base, toast,deepClone } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
// import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,setButtonUsability, onrowDoubleclick } from '../events';
import setButtonUsability from './setButtonUsability';
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const { BBM_CACHEKEY,SEARCH_KEY} = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;

const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN;
import { constant, requesturl } from '../../config/config';

export default function refresh(props) {

	let search = getDefData(constant.searchKey, this.cacheDataSource);
	let refreshsearchVal = deepClone(search);
	let serval = this.gettabserval(this.state.tabInfo);
	if(!refreshsearchVal){
		// refreshsearchVal = props.search.getAllSearchData(this.searchId);
		toast({
			duration: 3,
			color: 'success',
			content: this.state.json['36070BBM-000021']
		});
		return;
	}
	if(refreshsearchVal){
		if(refreshsearchVal.conditions.length != 0){
			refreshsearchVal.conditions.push(...serval);
			let refreshpageInfo = props.table.getTablePageInfo(this.tableId); //分页
			refreshpageInfo.pageIndex = 0;
			if(refreshsearchVal){
				let search = getDefData(constant.searchKey, this.cacheDataSource);
				// if(!search){
					// search = props.search.getAllSearchData(constant.searchcode);
				// }
				let searchdata = {
					searchArea: this.getsearchdata(search,refreshpageInfo),
					tabAndSearchArea: this.getsearchdata(refreshsearchVal,refreshpageInfo),
					billStatus: this.billStatus
				}
				ajax({
					url: requesturl.query,
					data: searchdata,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data) {
								toast({
									duration: 3,
									color: 'success',
									content: this.state.json['36070BBM-000021']
								});
								this.props.table.setAllTableData(this.tableId, data.model);
								let billid 
								if(data.model.rows[0]){
									billid = data.model.rows[0].values[this.pkname].value;
								}
								setButtonUsability.call(this, this.props);
								//页签赋值
								this.setState({
									addid: billid
								});
								let tobesubmitnum = data.tabnum.tobesubmitnum;
								let approvingnum = data.tabnum.approvingnum;
								let tobesettlenum = data.tabnum.tobesettlenum;
								setDefData(this.cacheDataSource, constant.tobesubmittab, tobesubmitnum);
								setDefData(this.cacheDataSource, constant.approvingtab, approvingnum);
								setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);
								this.setState({
									tobesubmittab: tobesubmitnum,
									approvingtab: approvingnum,
									tobesettletab: tobesettlenum
								});
							} else {
								this.props.table.setAllTableData(this.tableId, {
									rows: []
								});
								//页签赋值
								this.setState({
									tobesubmittab: 0,
									approvingtab: 0,
									tobesettletab: 0,
									alltab: 0
								});
							}
						}
					}
				});
			}
		}
	}
}

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/