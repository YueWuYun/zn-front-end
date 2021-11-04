//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g
import { ajax,toast } from 'nc-lightapp-front';
let searchid = 'accbook_search';
let tableid = 'accbooklist';
//点击查询，获取查询区数据
export default function searchBtnClick(props,value,type) {
	if(value){
		let that = this;
		let queryInfo = props.search.getQueryInfo('accbook_search');
		queryInfo.pageInfo = props.table.getTablePageInfo("accbooklist");
		queryInfo.pagecode='101001CB_accbook';
		if(type != false){
			queryInfo.pageInfo.pageIndex = 0;
		}else{
			queryInfo.pageInfo.pagepks = value;
		}
		ajax({
			url: '/nccloud/uapbd/accbook/listquery.do',
			data: {acc:queryInfo},
			success: function (res) {
                let { success, data } = res;
                if (success) {
					if("undefined" != typeof data){
						if(data.accbooklist!=null){
							for(var index in data.accbooklist.rows ){
								if(data.accbooklist.rows[index].values){
									data.accbooklist.rows[index].values.showflag = {value:data.isShow};
								}
							}
							if(type=="simple" && res.data.accbooklist.pageInfo && res.data.accbooklist.pageInfo.pageIndex && res.data.accbooklist.pageInfo.pageIndex==0){
								toast({ content: that.state.json['1880000025-000032'] + res.data.accbooklist.allpks.length + that.state.json['1880000025-000033'] });/* 国际化处理： 查询成功,共 , 条。*/
							}
							props.table.setAllTableData('accbooklist', data&&data.accbooklist?data.accbooklist:{rows:[]});
						}else{
							props.table.setAllTableData('accbooklist',{rows:[]})
							toast({content:that.state.json['1880000025-000034'],color:'warning'});/* 国际化处理： 未查询出符合条件的数据*/
						}
					}
				
				}
            },
		});
	}
	// else{
	// 	ajax({
	// 		url: '/nccloud/riaam/user/queryUserList.do',
	// 		success: function (res) {
	// 			let { success, data } = res;
	// 			if (success) {
	// 				if(data.user!=null){
	// 					for(var index in data.user.user.rows ){
	// 						if(data.user.user.rows[index].values){
	// 							data.user.user.rows[index].values.showflag = {value:data.isShow};
	// 						}
	// 					}
	// 					props.table.setAllTableData('user', data&&data.user&&data.user.user?data.user.user:{rows:[]});
	// 				}
	// 			}else{
	// 				props.table.setAllTableData('user',{rows:[]})
	// 			}
	// 		}
	// 	});
	// }
	
}


//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g