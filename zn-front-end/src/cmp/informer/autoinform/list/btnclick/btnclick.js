/*EeeqCGbSktzsaDQsl+/ZdpNF25uB3/sPaV2N7BW5t9XXrCRkHV5BKT/ghZAomIXQ*/
import { ajax,toast } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { BatchToast } from '../../../../public/CMPMessage';

const ltablecode = constant.ltablecode
	// 更新列数据
	function updateData(props, updata, operation){
		let { status, totalNum, successNum, failNum, failMsg, listmap } = updata;
		BatchToast.call(this, operation, status, totalNum, successNum, failNum, failMsg, null);
		//加载更新缓存数据
		if (listmap != null && listmap.length > 0) {
			listmap.forEach((val) => {
				let updatedataArr = [{
					index: val.index,
					data: {
						values: val.rows.values
					} //自定义封装数据
				}];
				props.table.updateDataByIndexs(ltablecode, updatedataArr);
			});
		}
	}


// //启用
// export const startConfirm = function(props,requestdata){
// 		ajax({
// 			url: requesturl.enable,
// 			data: requestdata,
// 			success: (res) => {
// 				let { success, data } = res;
// 				if (success) {
// 					if(res.data){
// 						toast({
// 							color: 'success',
// 							content:this.state.json['36070AGR-000053']/* 国际化处理： 启用成功*/
// 						  });
// 						  //this.props.table.updateData(this,props,res.data,autoinformdata.enable);
// 						  updateData.call(this, props, res.data, commondata.enable);
// 					}
// 				}
// 			}
// 		});		
// }

// //停用
// export const stopConfirm = function(props,requestdata){
// 	ajax({
// 		url: requesturl.unenable,
// 		data: requestdata,
// 		success: (res) => {
// 			let { success, data } = res;
// 			if (success) {
// 				if(res.data){
// 					toast({
// 						color: 'success',
// 						content:this.state.json['36070AGR-000053']/* 国际化处理： 启用成功*/
// 					  });
// 					  //this.props.table.updateData(this,props,res.data,autoinformdata.enable);
// 					  updateData.call(this, props, res.data, commondata.unenable);
// 				}
// 			}
// 		}
// 	});		
// }
/*EeeqCGbSktzsaDQsl+/ZdpNF25uB3/sPaV2N7BW5t9XXrCRkHV5BKT/ghZAomIXQ*/