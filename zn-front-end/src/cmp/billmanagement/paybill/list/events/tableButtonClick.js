/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import refresh from './refresh.js';
import { PAYBILL_CONST } from '../../cons/constant.js';
import appBase from '../../base'
const { api } = appBase;
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';
import  {go2Card}  from '../../util/goToCard.js';
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';



export default function tableButtonClick(props, key, text, record, index) {
	switch (key) {
		case 'editline':
			this.setStateCache();
			ajax({
				url: '/nccloud/cmp/paybills/dataAuthority.do',
				data: { pk: record.pk_paybill.value, pageid: '36070PBR_D5_card' },
				success: (res) => {
					go2Card(props,{ status: 'edit',	id: record.pk_paybill.value,pagecode: record.trade_type.value,ts:record.ts.value} ,{} );
				}
			});

			break;
		case 'comline':
			let comdata = dataBuild(record, index, PAYBILL_CONST.list_page_id);

			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: comdata,
				success: (res) => {
					let { data } = res;
					if (data.workflow && (data.workflow == 'approveflow' || data.workflow == 'workflow')) {
						this.setState({
							compositedata: res.data,
							compositedisplay: true,
							record: record,
							index: index
						});
					} else {
						let opdata=data.data;
						let updateDataArr = [];
						let errMsg = '';
						if (opdata && opdata.length > 0) {
							debugger;
							for (let operatorResult of opdata) {
								let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
								//成功
								if (state == 0) {
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
										//begin tm tangleic 20200219 提交支持预算交互异常信息输出
										api.comm.showTbbMsg({ props, row });
										//end tm tangleic
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
				}
			});
			break;
		case 'uncomline':
			// let uncomdata = {
			// 	pks: [ record.pk_paybill.value ],
			// 	pageid: '36070PBR_D5_list'
			// };
			let uncomdata = dataBuild(record, index, PAYBILL_CONST.list_page_id);
			ajax({
				url: '/nccloud/cmp/paybills/uncommit.do',
				data: uncomdata,
				success: (res) => {
					let { data } = res.data;
					let updateDataArr = [];
					let errMsg = '';
					if (data && data.length > 0) {
						for (let operatorResult of data) {
							let { state, result, pk, vbillno, rowIndex } = operatorResult;
							//成功
							if (state == 0) {
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
									let updateData = { index: rowIndex, data: { values: row.values } };
									updateDataArr.push(updateData);
								}
							} else if (state == 1) {
								//失败
								errMsg = errMsg + operatorResult.msg + '\n';
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
		case 'makebillline':
			MakeBillApp(props, '36070PBR', record.pk_paybill.value, record.trade_type.value);
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
						toast({ color: 'danger', content: errMsg });
					}
				}
			});

			break;

		//红冲
		case 'reverse':
			let reverse_pk = record.pk_paybill.value;
			let reqData = { pks: [reverse_pk], pageid: this.pageId };

			ajax({
				url: '/nccloud/cmp/paybills/reverse.do',
				data: reqData,
				success: (res) => {
					if (res.data) {
						if (res.data[this.tableId]) {
							props.pushTo('/card', {
								status: 'browse',
								op: 'reverse',
								id: res.data[this.tableId].rows[1].values.pk_paybill.value,
								pagecode: res.data[this.tableId].rows[1].values.trade_type.value
							});
						}
					}
				}
			});
			break;
		case 'protopay':
			let protopay_id = record.pk_paybill.value;
			let protopay_status = record.bill_status.value;
			//数据承付状态校验s
			if (record.is_cf && record.is_cf.value) {
				//数据审批状态校验
				if (protopay_status != -10 && protopay_status != -99) {
					toast({
						color: 'warning',
						content:loadMultiLang(this.props, '36070PBR-000076')
					}); /* 国际化处理： 单据状态不符合承付要求，不能进行承付*/
					// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
					return;
				}
				// props.pushTo('/card', {
				// 	status: 'edit',
				// 	id: protopay_id,
				// 	op: 'protopay'
				// 	//pagecode: record.trade_type.value
				// });
				go2Card(props,{ status: 'edit',	id: record.pk_paybill.value,op:'protopay'} ,{} );
			} else {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000075')
				}); /* 国际化处理： 非承付单据，不能进行承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}

			break;
		case 'unprotopay':
			let unprotopay_id = record.pk_paybill.value;

			let unprotopay_bill_status = record.bill_status.value;
			//数据审批状态校验
			if (record.is_cf && record.is_cf.value) {
				if (unprotopay_bill_status != -10) {
					toast({
						color: 'warning',
						content:loadMultiLang(this.props, '36070PBR-000077')
					}); /* 国际化处理： 单据状态不符合取消承付要求，不能取消承付*/
					// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
					return;
				}

				let unData = dataBuild(record, index, PAYBILL_CONST.list_page_id);
				ajax({
					url: '/nccloud//cmp/paybills/canlecompay.do',
					data: unData,
					success: (res) => {
						let { data } = res.data;
						let updateDataArr = [];
						let errMsg = '';
						if (data && data.length > 0) {
							for (let operatorResult of data) {
								let { state, msg, result, pk, vbillno, rowIndex } = operatorResult;
								//成功
								if (state == 0) {
									//更新行
									if (
										result &&
										result.head &&
										result.head['table_D5'] &&
										result.head['table_D5'].rows &&
										result.head['table_D5'].rows.length > 0
									) {
										let row = result.head['table_D5'].rows[0];
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

			} else {
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36070PBR-000075')
				}); /* 国际化处理： 非承付单据，不能进行承付*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			break;
		case 'tableCommitConfirm':
			let confirmData = dataBuild(record, index, PAYBILL_CONST.list_page_id);
			confirmData.content = this.state.getAssginUsedr;
			ajax({
				url: '/nccloud/cmp/paybills/commitConfirm.do',
				data: confirmData,
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
								if (
									result &&
									result.head &&
									result.head['table_D5'] &&
									result.head['table_D5'].rows &&
									result.head['table_D5'].rows.length > 0
								) {
									let row = result.head['table_D5'].rows[0];
									let updateData = { index: rowIndex, data: { values: row.values } };
									updateDataArr.push(updateData);
								}
								//关闭窗口

								this.setState({
									compositedisplay: false
								});
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