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
	card_page_url,
	oid
} from '../../cons/constant.js';
import { PAYBILL_CONST } from '../../cons/constant.js';
import  {go2Card}  from '../../util/goToCard.js';
export default function tableButtonClick(props, key, text, record, index) {
	//const tableButtonClick = (props, key, text, record, index) => {
	switch (key) {
		case 'editline':
		ajax({
			url: '/nccloud/cmp/paybills/dataAuthority.do',
			data: { pk: record.pk_paybill.value, pageid: '36070PBR_C04' },
			success: (res) => {
				go2Card(props,{ status: 'edit',	id: record.pk_paybill.value,pagecode:'36070PBR_C04',ts:record.ts.value} ,{} );
			}
		});

		break;

		case 'comline':
			let comdata = {
				pks: [ record.pk_paybill.value ],
				pageid: '36070PBR_D5_list'
			};
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: comdata,
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

								if (
									result &&
									result.head &&
									result.head[PAYBILL_CONST.list_table_id] &&
									result.head[PAYBILL_CONST.list_table_id].rows &&
									result.head[PAYBILL_CONST.list_table_id].rows.length > 0
								) {
									let row = result.head[PAYBILL_CONST.list_table_id].rows[0];
									let updateData = { index: rowIndex, data: { values: row.values } };
									updateDataArr.push(updateData);
								}
							} else if (state == 1) {
								//失败
								errMsg = errMsg + msg + '\n';
							}
						}
						//更新行
						if (updateDataArr.length > 0) {
							props.table.updateDataByIndexs(PAYBILL_CONST.list_table_id, updateDataArr);
						}
					}
					let { status, msg } = res.data;
					//全部成功
					if (status == 1) {
						toast({ color: 'success', content: msg });
					} else if (status == 0) {
						//全部失败
						toast({ color: 'danger', content: errMsg });
					}
				}
			});
			break;
		case 'uncomline':
			let uncomdata = {
				pks: [ record.pk_paybill.value ],
				pageid: '36070PBR_D5_list'
			};
			ajax({
				url: '/nccloud//cmp/paybills/uncommit.do',
				data: uncomdata,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000005') });/* 国际化处理： 收回成功*/
						refresh.call(this, props);
					}
				}
			});
			break;
		case 'makebillline':
			let billdata = {
				pks: [ record.pk_paybill.value ],
				ts: record.ts.value
			};
			ajax({
				url: '/nccloud/cmp/paybills/makebill.do',
				data: billdata,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000012') });/* 国际化处理： 删除成功*/
						// NCMessage.create({ content: '删除成功', color: 'success', position: 'top' });
						//props.table.deleteTableRowsByIndex(tableid, indexArr); //直接删除table中的行列
						//refreshHtml(props);
					}
				}
			});
			break;
		case 'delline':
		let deldata = dataBuild(record, index, PAYBILL_CONST.list_page_id);
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
					props.table.deleteCacheId(PAYBILL_CONST.list_table_id, pk);
					//删除行
					props.table.deleteTableRowsByIndex(PAYBILL_CONST.list_table_id, rowIndex);
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
		case 'confirm':

		go2Card(props,{ status: 'edit',	id: record.pk_paybill.value,ts:record.ts.value,op: 'confirm',pagecode:'36070PBR_C04'} ,{} );
			break;

		case 'unconfirm':
			let unconfirmData = dataBuild(record, index, PAYBILL_CONST.list_page_id);
			// let unconfirmData = {
			// 		pks: [ record.pk_paybill.value ],
			// 		pageid: '36070PBR_L04'
			// 	};
			ajax({
				url: '/nccloud/cmp/paybills/unconfirm.do',
				data: unconfirmData,
				success: (res) => {
					let  data  = res.data;
					let updateDataArr = [];
					let errMsg = '';
					//let { state, msg, result, pk,  rowIndex } = data;
					let result=data.result;
					//成功
					if (data.state == 0) {
						//删除行
						//更新行

						if (
							result &&
							result.head &&
							result.head['table_D5'] &&
							result.head['table_D5'].rows &&
							result.head['table_D5'].rows.length > 0
						) {
							let row = result.head['table_D5'].rows[0];
							let updateData = { index: data.rowIndex, data: { values: row.values } };
							updateDataArr.push(updateData);
						}
					} else if (data.state== 1) {
						//失败
						errMsg = errMsg + msg + '\n';
					}
					//更新行
					if (updateDataArr.length > 0) {
						props.table.updateDataByIndexs(PAYBILL_CONST.list_table_id, updateDataArr);
					}
				}
			});
			break;

		default:
			console.log(key, index);
			break;
	}
}
//删除确认
function beSureBtnClickDelete(props, record, action) {
	let deldata = {
		pks: [ record.pk_paybill.value ],
		ts: record.ts.value
	};
	ajax({
		url: '/nccloud/cmp/billmanagement/delete.do',
		data: deldata,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000012') });/* 国际化处理： 删除成功*/
				// NCMessage.create({ content: '删除成功', color: 'success', position: 'top' });
				//props.table.deleteTableRowsByIndex(tableid, indexArr); //直接删除table中的行列
				refresh(props);
			}
		}
	});
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

//export default tableButtonClick;

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/