/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { ajax, toast,deepClone } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import setButtonUsability from './setButtonUsability';
import { constant, requesturl } from '../../config/config';
export default function refresh(props) {

	let search = getDefData(constant.searchKey, this.cacheDataSource);
	let refreshsearchVal = deepClone(search);
	let serval = this.gettabserval(this.state.tabInfo);
	if(!refreshsearchVal){
		toast({
			duration: 3,
			color: 'success',
			content: this.state.json['36070CPI-000028']
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
				let searchdata = {
					searchArea: this.getsearchdata(search,refreshpageInfo),
					tabAndSearchArea: this.getsearchdata(refreshsearchVal,refreshpageInfo)
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
									content: this.state.json['36070CPI-000028']
								});
								this.props.table.setAllTableData(constant.ltablecode, data.model);
								// 缓存页签数据
								setButtonUsability.call(this, this.props);
								let billid 
								if(data.model.rows[0]){
									billid = data.model.rows[0].values[this.pkname].value;
								}
								//页签赋值
								let savenum = data.tabnum.savenum;
								let tobesettlenum = data.tabnum.tobesettlenum;
								// 缓存页签数据
								setDefData(this.cacheDataSource, constant.savetab, savenum);
								setDefData(this.cacheDataSource, constant.tobesettletab, tobesettlenum);
								//页签赋值
								this.setState({
									savetab: savenum,
									tobesettletab: tobesettlenum
								});
							} else {
								this.props.table.setAllTableData(constant.ltablecode, {
									rows: []
								});
								//页签赋值
								this.setState({
									savetab: 0,
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