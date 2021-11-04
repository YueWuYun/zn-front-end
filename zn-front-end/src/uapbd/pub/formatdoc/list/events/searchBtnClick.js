//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g
// import { ajax, toast } from 'nc-lightapp-front';
// //let searchId = 'searchArea';
// let tableId = 'formatdocdata';
// //点击查询，获取查询区数据
// export default function searchBtnClick(props, value, type) {
	
// 	if (value) {
// 		let queryInfo = props.search.getQueryInfo(searchId);
// 		let _this = this;
// 		ajax({
// 			url: '/nccloud/pfxx/exsystem/query.do',
// 			data: queryInfo,
// 			success: (res) => {
				
// 				let { success, data } = res;
// 				if (success && data) {
// 					_this.props.table.setAllTableData('exsystem', data && data.exsystem ? data.exsystem['exsystem'] : { rows: [] });
// 					_this.props.table.setAllTableData("childtable",{rows:[]});
// 					if (data && data.exsystem) {
// 						// toast({ content: this.state.json['xi-exsystem-000016'] + data.exsystem.exsystem.rows.length + this.state.json['xi-exsystem-000017'], color: 'success' });/* 国际化处理： 查询成功，共 , 条。*/
// 						toast({content:_this.state.inlt&&_this.state.inlt.get('xi-exsystem-000019',{'total':data.exsystem['exsystem'].rows.length}),color:'success'});/* 国际化处理： 查询成功，共 , 条。*/
// 					} else {
// 						toast({ content: this.state.json['xi-exsystem-000018'], color: 'warning' });/* 国际化处理： 未查询出符合条件的数据！*/
// 					}
// 				}
// 			}
// 		});

// 	}



// }


//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g