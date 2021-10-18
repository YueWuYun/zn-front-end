/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import refresh from './refresh.js';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../../cons/constant.js';
import { BBR_CONST } from '../../cons/constant.js';


export default function tableButtonClick(props, key, text, record, index) {
	switch (key) {
		case 'editline':
		 this.setStateCache();
			props.pushTo('/card', { status: 'edit', id: record.pk_paybill.value, pagecode: record.trade_type.value });

			// props.linkTo(card_page_url, {
			// 	status: 'edit',
			// 	id: record.pk_paybill.value,
			// 	pagecode:record.trade_type.value
			// });
			break;
		case 'comline':
		let comdata = dataBuild(record, index, BBR_CONST.list_page_id);
			// let comdata = {
			// 	pks: [ record.pk_paybill.value ],
			// 	pageid: '36070PBR_D5_list'
			// };
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: comdata,
				success: (res) => {
					let { data } = res.data;
					let updateDataArr = [];
					let errMsg = '';
					if (data && data.length > 0) {
						debugger;
						for (let operatorResult of data) {
							let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
								//删除行
								
								//更新行
								
									if (result && result.head && result.head['head'] && result.head['head'].rows && result.head['head'].rows.length > 0) {
										let row = result.head['head'].rows[0];
										let updateData = { index: rowIndex, data: { values: row.values } };
										updateDataArr.push(updateData);
									}
								
							}
							//失败
							else if (state == 1) {
								errMsg = errMsg + msg + '\n';
							}
						}
						//更新行
						if (updateDataArr.length > 0) {
							props.table.updateDataByIndexs(BBR_CONST.list_table_id, updateDataArr);
						}
					}
					let { status, msg } = res.data;
					//全部成功
					if (status == 1) {
						toast({ color: 'success', content: msg });
					}
					//全部失败
					else if (status == 0) {
						toast({ color: 'danger', content: errMsg });
					}
				}
			});
			break;
		case 'uncomline':
			// let uncomdata = {
			// 	pks: [ record.pk_paybill.value ],
			// 	pageid: '36070PBR_D5_list'
			// };
			let uncomdata = dataBuild(record, index, BBR_CONST.list_page_id);
			ajax({
				url: '/nccloud//cmp/paybills/uncommit.do',
				data: uncomdata,
				success: (res) => {
					let { data } = res.data;
					let updateDataArr = [];
					let errMsg = '';
					if (data && data.length > 0) {
						for (let operatorResult of data) {
							let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
								//删除行
								
								//更新行
								if (result && result.head && result.head['head'] && result.head['head'].rows && result.head['head'].rows.length > 0) {
									let row = result.head['head'].rows[0];
									let updateData = { index: rowIndex, data: { values: row.values } };
									updateDataArr.push(updateData);
								}
								
							}
							//失败
							else if (state == 1) {
								errMsg = errMsg + msg + '\n';
							}
						}
						//更新行
						if (updateDataArr.length > 0) {
							props.table.updateDataByIndexs(BBR_CONST.list_table_id, updateDataArr);
						}
					}
					let { status, msg } = res.data;
					//全部成功
					if (status == 1) {
						toast({ color: 'success', content: msg });
					}
					//全部失败
					else if (status == 0) {
						toast({ color: 'danger', content: errMsg });
					}
				}
			});
			break;
		case 'makebillline':
			let makebillArr = [];
			let arr = [];
			//处理选择数据
			let billId = record.pk_paybill.value;
			let trade_type = record.trade_type.value;
			
			makebillArr.push(trade_type);
			makebillArr.push(billId);

			arr.push(makebillArr);
			MakeBillApp(props, '0001Z61000000001PJBL', arr);

			// window.parent.openNew(
			// 	{
			// 		code: '10170410',
			// 		name: '单据生成',
			// 		pk_appregister: '0001Z31000000002QMYF'
			// 	},
			// 	null,
			// 	'&status=browse&src=0001Z61000000001PJBL_MadeBill'
			// );
			break;
		case 'delline':
			// let deldata = {
			// 	pks: [ record.pk_paybill.value ],
			// 	ts: record.ts.value
			// };
			let deldata = dataBuild(record, index, BBR_CONST.list_page_id);
			ajax({
				url: '/nccloud/cmp/billmanagement/delete.do',
				data: deldata,
				success: (res) => {
					let { data } = res.data;
			let errMsg = '';
			if (data && data.length > 0) {
				for (let operatorResult of data) {
					let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
					//成功
					if (state == 0) {
						//删除行

						//删除缓存数据
						props.table.deleteCacheId(BBR_CONST.list_table_id, pk);
						//删除行
						props.table.deleteTableRowsByIndex(BBR_CONST.list_table_id, rowIndex);
					} else if (state == 1) {
						//失败
						errMsg = errMsg + msg + '\n';
					}
				}
			}
					let { status, msg } = res.data;
					//全部成功
					if (status == 1) {
						toast({ color: 'success', content: msg });
					} else {
						toast({ color: 'danger', content:errMsg});
					}
				}
			});

			break;
		default:
			console.log(key, index);
			break;
	}
}

//构建请求数据
function dataBuild(record, index, pageid) {
	let pkMapTs = {};
	let pkMapRowIndex = {};
	let pks = [];
	let pkName = 'pk_paybill';
	let pk = record.pk_paybill.value;
	pks.push(pk);
	pkMapRowIndex[pk] = index;
	pkMapTs[pk] = record.ts.value;

	let data = {
		pkMapRowIndex,
		pkMapTs,
		pageid,
		pks
	};
	return data;
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/