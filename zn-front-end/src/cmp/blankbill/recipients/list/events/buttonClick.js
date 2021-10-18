/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base, toast, cacheTools, print, output, promptBox } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import { BatchToast } from '../../../../public/CMPMessage.js';
import refresh from './refresh.js';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL,BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, SEARCH_CODE, LIST_TABLECODE, CARD__PAGECODE,PRINT_FUNCODE,PRINT_TEMPLATEID } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
const {
	ADD_BTN,
	DELETE_BTN,
	PRINT_BTN,
	OUTPUT_BTN,
	REFRESH_BTN
} = BTN
export default function buttonClick(props, id) {
	const selectDatas = props.table.getCheckedRows(this.tableId);
	// 校验是否选中数据
	function checkNoSelected() {
		//判断是否有选中行
		if (selectDatas == null || selectDatas.length == 0) {
			toast({ color: 'warning', content: this.state.json['36070BBR-000001']});/* 国际化处理： 未选中行！*/
			return false;
		}
		return true;
	}
	//构建请求数据
	function dataBuild() {
		let pageid = LIST_PAGECODE;
		let pks = [];
		let pkMapTs = {};
		let pkMapVbillno = {};
		let pkMapRowIndex = {};
		let index = 0;
		let pk, ts, vbillno;
		while (index < selectDatas.length) {
			//获取行主键值
			pk =
				selectDatas[index] &&
				selectDatas[index].data &&
				selectDatas[index].data.values &&
				selectDatas[index].data.values[PK_NAME] &&
				selectDatas[index].data.values[PK_NAME].value;
			pks.push(pk);
			//获取行ts时间戳
			ts =
				selectDatas[index] &&
				selectDatas[index].data &&
				selectDatas[index].data.values &&
				selectDatas[index].data.values.ts &&
				selectDatas[index].data.values.ts.value;
			//单据编号
			vbillno =
				selectDatas[index] &&
				selectDatas[index].data &&
				selectDatas[index].data.values &&
				selectDatas[index].data.values[VBILLNO] &&
				selectDatas[index].data.values[VBILLNO].value;
			pkMapRowIndex[pk] = selectDatas[index].index;
			//判空
			if (pk && ts) {
				pkMapTs[pk] = ts;
			}
			if (pk && vbillno) {
				pkMapVbillno[pk] = vbillno;
			}
			index++;
		}
		let data = {
			pkMapRowIndex,
			pkMapTs,
			pkMapVbillno,
			pageid,
			pks,
		};
		return data;
	}
	
	switch (id) {
		case ADD_BTN: //新增
			props.pushTo('/card', {
				status: 'add',
				pagecode: CARD__PAGECODE
			});
			break;
		//删除，可以支持批量
		case DELETE_BTN:
			if (!checkNoSelected()) {
				return;
			}
			promptBox({
				color: 'warning', 
				title: this.state.json['36070BBR-000002'], //删除/,
				hasCloseBtn:false,        
				content: this.state.json['36070BBR-000010'], //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
				beSureBtnClick: () => {
					beSureBtnClickDelete.call(this, props, dataBuild());
				}}  
			);
			break;
			//打印
		case PRINT_BTN:
			if (!checkNoSelected()) {
				return;
			}
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				PRINT,
				{
					appcode: APPCODE,
					nodekey: PRINT_FUNCODE , //模板节点标识
					oids: dataBuild().pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
		case 'printlist': //打印
			if (!checkNoSelected()) {
				return;
			}
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				PRINT,
				{
					appcode:APPCODE,
					nodekey: PRINT_FUNCODE, //模板节点标识
					oids: dataBuild().pks// 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
			// 输出
		case OUTPUT_BTN:
			if (!checkNoSelected()) {
				return;
			}
			output({
				url: PRINT,
				data: {
					nodekey: PRINT_FUNCODE,
					appcode: APPCODE,
					oids: dataBuild().pks,
					outputType: 'output'
				}
			});
			break;
			// 刷新
		case REFRESH_BTN:
			// let searchData = getDefData(SEARCH_KEY, BBR_CACHEKEY);
			// if (searchData && searchData.conditions) {
			// 	refresh.call(this, props);
			// }
			refresh.call(this, props);
			break;
	}
}
//删除
function beSureBtnClickDelete(props, data) {
	ajax({
		url: DELETE,
		data: data,
		success: (res) => {
			let { data } = res.data;
			let errMsg = [];
			let successIndexs=0;
			let  failIndexs=0;
			let  total=0;
			let deleteIndex=[];
			if (data && data.length > 0) {
				total=data.length;
				for (let operatorResult of data) {
					let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
					//成功
					if (state == 0) {
						//删除行
						successIndexs=successIndexs+1;
						//删除缓存数据
						props.table.deleteCacheId(LIST_TABLECODE, pk);
						//删除行
						deleteIndex.push(rowIndex);
					} else if (state == 1) {
						//失败
						errMsg.push(msg);
						failIndexs=failIndexs+1;
					}
				}
				if(deleteIndex&&deleteIndex.length>0){
					props.table.deleteTableRowsByIndex(LIST_TABLECODE, deleteIndex);
				}
				let { status, msg } = res.data;
				BatchToast.call(this,'DELETE',status,total, successIndexs,failIndexs,errMsg,null);
			}
		}
	});
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/