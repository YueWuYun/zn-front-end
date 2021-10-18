/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { createPage, ajax, base, toast,deepClone } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import setButtonUsability from './setButtonUsability';
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
			content: this.state.json['36070WC-000052']
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
									content: this.state.json['36070WC-000052']
								});
								this.props.table.setAllTableData(constant.ltablecode, data.model);
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
								// 缓存分页数据
								setDefData(this.cacheDataSource, constant.tobesubmittab, tobesubmitnum);
								setDefData(this.cacheDataSource, constant.approvingtab, approvingnum);
								setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);
								//页签赋值
								this.setState({
									tobesubmittab: tobesubmitnum,
									approvingtab: approvingnum,
									tobesettletab: tobesettlenum
								});
							} else {
								this.props.table.setAllTableData(constant.ltablecode, {
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