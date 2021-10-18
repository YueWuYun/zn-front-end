/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base, toast, cacheTools, print,promptBox,output } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
const { NCMessage } = base;
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
import { BatchToast } from '../../../../public/CMPMessage.js';
import refresh from './refresh.js';
const {APPCODE, LIST_PAGECODE, LIST_TABLECODE , SEARCH_CODE,CARD__PAGECODE, PRINT_FUNCODE} = APP_INFO;
const { PK_NAME, TS, VBILLNO, PK_ORG } = BILL_FIELD;
const { DELETE, PRINT } = REQUEST_URL;
const {BBP_CACHEKEY, BBP_PKNAMEKEY, BBP_STATEKEY, LINK_KEY, SEARCH_KEY } = BBP_CONST;
import  {go2Card}  from '../../util/goToCard.js';
export default function buttonClick(props, id) {
	const selectDatas = props.table.getCheckedRows(this.tableId);
	function checkNoSelected() {
		//判断是否有选中行
		if (selectDatas == null || selectDatas.length == 0) {
			toast({ color: 'warning', content: this.state.json['36070BBP-000001'] });/* 国际化处理： 未选中行！*/
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
		case BTN.ADD_BTN: //新增
			// this.setStateCache();
			
			props.pushTo('/card', {
				status: 'add',
				pagecode: CARD__PAGECODE
			});
			break;
		//删除，可以支持批量
		case BTN.DELETE_BTN:
			if (!checkNoSelected()) {
				return;
			}
			promptBox({
				color: 'warning', 
				title:this.state.json['36070BBP-000002'], //删除/,
				hasCloseBtn:false,        
				content: this.state.json['36070BBP-000011'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要删除所选数据吗?*/
				beSureBtnClick: () => {
					beSureBtnClickDelete.call(this, props, dataBuild());
				}}  
			);
			break;
		case BTN.PRINT_BTN: //打印
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
				'/nccloud/cmp/paybills/paybillsprintlist.do',
				{
					appcode: APPCODE,
					nodekey: 'NCCLOUDLIST', //模板节点标识
					oids: dataBuild().pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
		case BTN.OUTPUT_BTN:
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
			// 刷新按钮
		case BTN.REFRESH_BTN:
			// let searchData = getDefData(SEARCH_KEY, BBP_CACHEKEY);
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
						//props.table.deleteTableRowsByIndex(LIST_TABLECODE, rowIndex);
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