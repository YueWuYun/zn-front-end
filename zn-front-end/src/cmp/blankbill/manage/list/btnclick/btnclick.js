/*EeeqCGbSktzsaDQsl+/ZdpNF25uB3/sPaV2N7BW5t9XXrCRkHV5BKT/ghZAomIXQ*/
import { ajax } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { BatchToast } from '../../../../public/CMPMessage';
const { BLANKBILL_LYCANCEL,BLANKBILL_BXCANCEL,BLANKBILL_ZFCANCEL } = commondata;
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE } = APP_INFO;

const ltablecode = constant.ltablecode
	// 更新列数据
	// function updateData(props, updata, operation){
	// 	let { status, totalNum, successNum, failNum, failMsg, listmap } = updata;
	// 	BatchToast.call(this, operation, status, totalNum, successNum, failNum, failMsg, null);
	// 	//加载更新缓存数据
	// 	if (listmap != null && listmap.length > 0) {
	// 		listmap.forEach((val) => {
	// 			let updatedataArr = [{
	// 				index: val.index,
	// 				data: {
	// 					values: val.rows.values
	// 				} //自定义封装数据
	// 			}];
	// 			props.table.updateDataByIndexs(ltablecode, updatedataArr);
	// 		});
	// 	}
	// }

function btnupdateData(props, res, operation){
		let data = res.data;
		let updateDataArr = [];
		let errMsg = [];
		let successIndexs=0;
		let failIndexs=0;
		let total= data.length;
		if (data && data.length > 0) {
			for (let operatorResult of data) {
				let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
				//成功
				if (state == 0) {
					//删除行
					successIndexs=successIndexs+1;
					//更新行
					if (result && result.head && result.head[LIST_TABLECODE] && result.head[LIST_TABLECODE].rows && result.head[LIST_TABLECODE].rows.length > 0) {
						let row = result.head[LIST_TABLECODE].rows[0];
						let updateData = { index: rowIndex, data: { values: row.values } };
						updateDataArr.push(updateData);
					}
					
				}
				//失败
				else if (state == 1) {
					errMsg.push(msg);
					failIndexs=failIndexs+1;
				}
			}
			//更新行
			if (updateDataArr.length > 0) {
				props.table.updateDataByIndexs(LIST_TABLECODE, updateDataArr);
			}
		}
		let { status, msg } = data;
		BatchToast.call(this,operation,status,total, successIndexs,failIndexs,errMsg,null);
	
}

	// 领用
export const BBM_LY = function (props, requestdata){
	ajax({
		url: BBMLY,
		data: requestdata,
		success: (res) => {
			if(res.success){
				props.linkTo('/cmp/blankbill/recipients/main/index.html#/card', {
					appcode: '36070BBR',
					pagecode: '36070RBM_C01',
					status: 'edit',
					pks: requestdata.pks,
					busitype: '',
					billtype: '',
					src: "36070BBM"
				})
			}
		}
	});
	
}

	// 取消领用
export const BBM_LYCANCEL = function (props, requestdata){
	ajax({
		url: BBMLYCANCEL,
		data: requestdata,
		success: (res) => {
			btnupdateData.call(this,props, res.data, BLANKBILL_LYCANCEL);
		}
	});
	
}

	// 报销
export const BBM_BX = function (props, bxpks){
	this.setState({
		showBxCardData: bxpks,
		showBxCard: true,
	});
}

	// 取消报销
export const BBM_BXCANCEL = function (props, requestdata){
	ajax({
		url: BBMBXCANCEL,
		data: requestdata,
		success: (res) => {
			btnupdateData.call(this,props, res.data, BLANKBILL_BXCANCEL);
		}
	});
}

	// 作废
export const BBM_ZF = function (props, zfpks){
	this.setState({
		showZfCardData: zfpks,
		showZfCard: true,
	});
}
	
	// 取消作废
export const BBM_ZFCANCEL = function (props, requestdata){
	ajax({
		url: BBMZFCANCEL,
		data: requestdata,
		success: (res) => {
			btnupdateData.call(this,props, res.data, BLANKBILL_ZFCANCEL);
		}
	});
}

/*EeeqCGbSktzsaDQsl+/ZdpNF25uB3/sPaV2N7BW5t9XXrCRkHV5BKT/ghZAomIXQ*/