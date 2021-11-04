//bwCXkqKHLIo5V8heNQST6TaijHs36G8v6MpQ8CtdwYeGwPqUIdUB2qEy62YeYRfP
/*
 * @Author: ligangt 
 * @PageInfo: 到货单卡片态按钮点击事件处理  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: ligangt
 * @Last Modified time: 2018-07-09 15:32:45
 */
import { ajax, base, toast, cacheTools, print, output, promptBox } from 'nc-lightapp-front';

const { NCMessage, NCModal } = base;
import { showBatchOprMessage } from '../../../public/tools/messageUtil';
import { initLang, getLangByResId } from '../../../public/tools/multiLangUtil';
import { updateCacheDataForList } from '../../../public/tools/cacheTools';

import {
	URL,
	COMMON,
	AREA,
	PAGECODE,
	ALLBUTTONS,
	EDITBUTTONS,
	EXEBUTTONS,
	FREEBUTTONS,
	COMMITBUTTONS
} from '../../constance';

let hasPerm = (orgs) => {
	// for(let i=0;i<orgs.length;i++){
	// 	if(permOrg.indexOf(orgs[i]) === -1){
	// 		toast({content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
	// 		return false;
	// 	}
	// }
	return true;
};

//点击查询，获取查询区数据
export default function buttonClicks(props, id) {
	let rows, pk_orgs;
	let output = (type = '') => {
		let allData = this.props.table.getCheckedRows(AREA.bomlist);
		let pks = [];
		allData.map((row) => {
			pks.push(row.data.values['cbomid'].value);
		});
		console.log(pks, 'pks');
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print('pdf', URL.print, {
				funcode: /*this.props.config.funcode*/ '10140BOMM', //功能节点编码
				nodekey: 'bommprint', //模板节点标识
				oids: pks,
				outputType: type
			});
		}
	};
	let onDelForBrowse = () => {
		let delrows = this.props.table.getCheckedRows(AREA.bomlist);
		let params = [];
		let candelete = false;
		if (delrows.length > 0) {
			delrows.forEach((item) => {
				if (item.data.values['hbdefault'].value == true) {
					candelete = true;
				}
				params.push({
					id: item.data.values['cbomid'].value,
					ts: item.data.values.ts.value
				});
			});
		} else {
			if (this.selectedRowRecord) {
				if (selectedRowRecord['hbdefault'].value == true) {
					candelete = true;
				}
				params.push({
					id: this.selectedRowRecord['cbomid'].value,
					ts: this.selectedRowRecord.ts.value
				});
			}
		}
		if (!candelete) {
			ajax({
				url: URL.delete,
				data: { param: params },
				success: (res) => {
					showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
					let { deleteCacheId } = props.table;
					let delrows = this.props.table.getCheckedRows(AREA.bomlist);
					if (delrows.length > 0) {
						delrows.forEach((item) => {
							deleteCacheId(AREA.bomlist, item.data.values.cbomid.value);
							props.table.deleteTableRowsByRowId(AREA.bomlist, item.data.rowId);
						});
					}
				}
			});
		} else {
			promptBox({
				color: 'warning',
				content: this.state.json['10140BOMM2-000006'],
				beSureBtnClick: () => {
					ajax({
						url: URL.delete,
						data: { param: params },
						success: (res) => {
							showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
							let { deleteCacheId } = props.table;
							let delrows = this.props.table.getCheckedRows(AREA.bomlist);
							if (delrows.length > 0) {
								delrows.forEach((item) => {
									deleteCacheId(AREA.bomlist, item.data.values.cbomid.value);
									props.table.deleteTableRowsByRowId(AREA.bomlist, item.data.rowId);
								});
							}
						}
					});
				}
			});
		}
	};
	switch (id) {
		case 'Add':
			{
				let searchVal = props.search.getAllSearchData(AREA.bomquery);
				cacheTools.set('searchParams', searchVal);
				props.table.selectAllRows(AREA.bomlist, false);
				props.pushTo('/card', {
					status: 'add'
				});
			}
			break;
		case 'Edit':
			{
				let cancontinue = false;

				ajax({
					url: URL.checkpermission,
					async: false,
					data: {
						id: this.props.table.getCheckedRows(AREA.bomlist)[0].data.values.cbomid.value,
						actioncode: 'Edit'
					},
					success: (res) => {
						cancontinue = true
					}, error: (err) => {
						toast({ color: 'danger', content: err.message });
					}
				});
				if (!cancontinue) {
					return
				}

				let searchVal;
				searchVal = props.search.getAllSearchData(AREA.bomquery);
				cacheTools.set('searchParams', searchVal);
				if (this.props.table.getCheckedRows(AREA.bomlist).length != 1) {
					toast({ content: this.state.json['110140BOMM3010'], color: 'warning' }); /* 国际化处理： 请选择需要编辑的数据！*/
					return;
				}
				props.table.selectAllRows(AREA.bomlist, false);

				props.pushTo('/card', {
					status: 'edit',
					id: this.props.table.getCheckedRows(AREA.bomlist)[0].data.values.cbomid.value
				});
			}
			break;
		case 'ReviseEdit':
			{
				let searchVal;
				searchVal = props.search.getAllSearchData(AREA.bomquery);
				cacheTools.set('searchParams', searchVal);
				props.table.selectAllRows(AREA.bomlist, false);

				props.pushTo('/card', {
					status: 'edit',
					reviseEdit: true,
					id: this.props.table.getCheckedRows(AREA.bomlist)[0].data.values.cbomid.value
				});
			}
			break;
		case 'Delete':
			{
				let cancontinue = false;

				ajax({
					url: URL.checkpermission,
					async: false,
					data: {
						id: this.props.table.getCheckedRows(AREA.bomlist)[0].data.values.cbomid.value,
						actioncode: 'Edit'
					},
					success: (res) => {
						cancontinue = true
					}, error: (err) => {
						toast({ color: 'danger', content: err.message });
					}
				});
				if (!cancontinue) {
					return
				}

				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['110140BOMM3004'] /* 国际化处理： 删除提醒*/,
					content: this.state.json['110140BOMM3005'] /* 国际化处理： 确定要删除数据吗？*/,
					beSureBtnClick: () => {
						onDelForBrowse();
					}
				});
			}
			break;
		case 'Commit':
			{
				// 获取选中行
				// 执行提交操作
				let dataRows = [];
				let indexs = [];

				let rows = props.table.getCheckedRows(AREA.bomlist);
				// 如果没有选中行，则提示并返回，不进行任何操作
				if (rows.length <= 0) {
					toast({
						color: 'warning',
						content: getLangByResId(this, '10140PUBMESSAGE-000026') /* 国际化处理： 请选择需要提交的数据！*/
					});
					return;
				}

				rows.map((item) => {
					let info = {
						pk: item.data.values.cbomid.value,
						ts: item.data.values.ts.value
					};
					dataRows.push(info);
					indexs.push(item.index);
				});


				// 拼装json
				let data = {
					pkTsParams: dataRows,
					pageid: PAGECODE.bom_list
				};
				//指派
				//if (assign) {
				//	data['assign'] = JSON.stringify(assign);
				//}
				// 发送请求
				ajax({
					url: URL.commit,
					data: data,
					success: (res) => {
						if (
							res.data &&
							res.data.workflow &&
							(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
						) {
							this.commitInfo = {
								index: index,
								record: record
							};
							this.setState({
								compositedata: res.data,
								compositedisplay: true
							});
							return;
						}
						if (res.success) {

							showBatchOprMessage(null, res.data, getLangByResId(this, '10140PUBMESSAGE-000025'));
							let pageInfo = this.props.table.getTablePageInfo(AREA.bomlist);
							// let searchVal = props.search.getAllSearchData(searchId);
							// // 后台还没更新，暂不可用
							// let queryInfo = this.props.search.getQueryInfo('bomwh_query');

							// let OID = this.props.meta.getMeta()[searchId].oid;
							//console.log(pageinfo,'pginfo')
							let pks = [];
							this.props.table.getAllTableData(AREA.bomlist).rows.forEach(row => {
								pks.push(row.values.cbomid.value)
							})
							let data = {
								// ...queryInfo,
								// showDisableDataFlag: this.state.checkValue,
								// querycondition: searchVal,
								// pageCode: pageId,
								// queryAreaCode: searchId, //查询区编码
								// oid: OID, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
								// querytype: 'simple',
								pageInfo: pageInfo,
								pagepks: pks //翻页时pk集合
							};
							//得到数据渲染到页面
							let that = this;
							let queryPageUrl = '/nccloud/mmbd/bom0202/queryPage.do';
							ajax({
								url: queryPageUrl,
								data: data, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改,
								success: function (res) {
									let { success, data } = res;
									if (success) {
										if (data) {
											props.table.setAllTableData(AREA.bomlist, data[AREA.bomlist]);
										} else {
											props.table.setAllTableData(AREA.bomlist, { rows: [] });
										}
										props.button.setButtonDisabled(
											[
												'Delete',
												'Copy',
												'Enable',
												'Disable',
												'Default',
												'CancelDefault',
												'Assign',
												'Unassign',
												'Commit',
												'UnCommit',
												'Assistfunction',
												'gylxyzxjc',
												'Print',
												'Output',
												'LinkTree'
											],
											true
										);

									}
								}
							});
							//updateCacheDataForList(props, AREA.bomlist, 'cbomid', res.data);


							// initButtons.call(this, props);
						}
						//this.onSelect();
					}
				});
			}
			break;
		case 'Enable':
			{
				let delrows = this.props.table.getCheckedRows(AREA.bomlist);
				let params = [];
				if (delrows.length > 0) {
					delrows.forEach((item) => {
						params.push({
							id: item.data.values['cbomid'].value,
							ts: item.data.values.ts.value
						});
					});
				} else {
					if (this.selectedRowRecord) {
						params.push({
							id: this.selectedRowRecord['cbomid'].value,
							ts: this.selectedRowRecord.ts.value
						});
					}
				}

				ajax({
					url: URL.enable,
					data: { param: params },
					success: (res) => {
						showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
						this.getData({}, this.state.isShowOff, false);
					}
				});
			}

			break;
		case 'Disable':
			{
				let delrows = this.props.table.getCheckedRows(AREA.bomlist);
				let params = [];
				if (delrows.length > 0) {
					delrows.forEach((item) => {
						params.push({
							id: item.data.values['cbomid'].value,
							ts: item.data.values.ts.value
						});
					});
				} else {
					if (this.selectedRowRecord) {
						params.push({
							id: this.selectedRowRecord['cbomid'].value,
							ts: this.selectedRowRecord.ts.value
						});
					}
				}

				ajax({
					url: URL.disable,
					data: { param: params },
					success: (res) => {
						showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
						this.getData({}, this.state.isShowOff, false);
					}
				});
			}
			break;
		case 'UnCommit':
			{
				rows = props.table.getCheckedRows(AREA.bomlist);
				if (rows.length == 0) {
					toast({ content: getLangByResId(this, '110140BOMM3011'), color: 'warning' }); /* 国际化处理： 请先选择数据*/
					break;
				}
				let indexs = rows.map((row) => {
					return row.index;
				});
				let data = {};
				data.pageid = PAGECODE.head;
				data.pkTsParams = rows.map((row) => {
					return { pk: row.data.values.cbomid.value, ts: row.data.values.ts.value };
				});

				ajax({
					method: 'post',
					url: URL.uncommit,
					data: data,
					success: (res) => {
						showBatchOprMessage(null, res.data, getLangByResId(this, '10140PUBMESSAGE-000027'));
						let pageInfo = this.props.table.getTablePageInfo(AREA.bomlist);
						// let searchVal = props.search.getAllSearchData(searchId);
						// // 后台还没更新，暂不可用
						// let queryInfo = this.props.search.getQueryInfo('bomwh_query');

						// let OID = this.props.meta.getMeta()[searchId].oid;
						//console.log(pageinfo,'pginfo')
						let pks = [];
						this.props.table.getAllTableData(AREA.bomlist).rows.forEach(row => {
							pks.push(row.values.cbomid.value)
						})
						let data = {
							// ...queryInfo,
							// showDisableDataFlag: this.state.checkValue,
							// querycondition: searchVal,
							// pageCode: pageId,
							// queryAreaCode: searchId, //查询区编码
							// oid: OID, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
							// querytype: 'simple',
							pageInfo: pageInfo,
							pagepks: pks //翻页时pk集合
						};
						//得到数据渲染到页面
						let that = this;
						let queryPageUrl = '/nccloud/mmbd/bom0202/queryPage.do';
						ajax({
							url: queryPageUrl,
							data: data, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改,
							success: function (res) {
								let { success, data } = res;
								if (success) {
									if (data) {
										props.table.setAllTableData(AREA.bomlist, data[AREA.bomlist]);
									} else {
										props.table.setAllTableData(AREA.bomlist, { rows: [] });
									}
									props.button.setButtonDisabled(
										[
											'Delete',
											'Copy',
											'Enable',
											'Disable',
											'Default',
											'CancelDefault',
											'Assign',
											'Unassign',
											'Commit',
											'UnCommit',
											'Assistfunction',
											'gylxyzxjc',
											'Print',
											'Output',
											'LinkTree'
										],
										true
									);

								}
							}
						});
					}
				});
			}
			break;
		case 'Default':
			{
				let delrows = this.props.table.getCheckedRows(AREA.bomlist);
				let data = {};
				if (delrows.length > 0) {
					delrows.forEach((item) => {
						data = {
							id: item.data.values['cbomid'].value,
							ts: item.data.values.ts.value,
							rowId: item.data.rowId
						};
					});
				}

				ajax({
					url: '/nccloud/mmbd/bom0202/default.do',
					data,
					success: (res) => {
						if (res.data.oriid) {
							promptBox({
								color: 'warning',
								content: this.state.json['10140BOMM2-000009'],
								beSureBtnClick: () => {
									ajax({
										url: '/nccloud/mmbd/bom0202/suredefault.do',
										data: { curid: res.data.curid, oriid: res.data.oriid,curts:res.data.curts },
										success: (res) => {
											if (res.data[AREA.bomlist]) {
												// let rows = res.data[AREA.bomlist].rows;
												// rows.forEach((item) => {
												// 	let orirows = this.props.table.getAllTableData(AREA.bomcarditem)
												// 		.rows;
												// 	orirows.forEach((orirow) => {
												// 		if (item.values.cbomid.value == orirow.values.cbomid.value) {
												// 			item.rowId = orirow.values.cbomid.value;
												// 		}
												// 	});
												// });
												// this.props.table.updateTableData(AREA.bomlist, res.data[AREA.bomlist]);
												toast({ color: 'success', title: this.state.json['10140BOMM2-000010'] });
												this.getData({}, this.state.isShowOff, false);
											}
										}
									});
								}
							});
						} else if (res.data[AREA.bomlist]) {
							let rows = res.data[AREA.bomlist].rows;
							rows.forEach((item) => {
								if (item.values.cbomid.value == data.id) {
									item.rowId = data.rowId;
								}
							});
							this.props.table.updateTableData(AREA.bomlist, res.data[AREA.bomlist]);
							toast({ color: 'success', title: this.state.json['10140BOMM2-000010'] });
							this.getData({}, this.state.isShowOff, false);
						}

						//showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
						//this.refreshAction(props);
					}
				});
			}
			break;
		case 'CancelDefault':
			{
				let delrows = this.props.table.getCheckedRows(AREA.bomlist);
				let data = {};
				if (delrows.length > 0) {
					delrows.forEach((item) => {
						data = {
							id: item.data.values['cbomid'].value,
							ts: item.data.values.ts.value
						};
					});
				}

				ajax({
					url: '/nccloud/mmbd/bom0202/canceldefault.do',
					data,
					success: (res) => {
						if (res.data[AREA.bomlist]) {
							let rows = res.data[AREA.bomlist].rows;
							rows.forEach((item) => {
								if (item.values.cbomid.value == data.id) {
									item.rowId = data.rowId;
								}
							});
							this.props.table.updateTableData(AREA.bomlist, res.data[AREA.bomlist]);
							toast({ color: 'success', title: this.state.json['10140BOMM2-000010'] });
							this.getData({}, this.state.isShowOff, false);
						}
					}
				});
			}
			break;
		case 'gylxyzxjc':
			{
				let selrow = this.props.table.getCheckedRows(AREA.bomlist);
				ajax({
					url: URL.checkbefore,
					data: { cbomid: selrow[0].data.values.cbomid.value },

					success: (res) => {
						if (selrow.length == 1) {
							this.props.openTo('/uapbd/mmbase/datamanage01/main/index.html', {
								status: 'browse',

								pk_org: selrow[0].data.values.pk_org.value,
								pk_org_d: selrow[0].data.values.pk_org.display,
								cbomid: selrow[0].data.values.cbomid.value,

								appcode: '10140DAMA',
								pagecode: '10140DAMA_form'
							});
						}
					}
				});
			}
			break;
		case 'LinkTree':
			{
				let selrow = this.props.table.getCheckedRows(AREA.bomlist);
				if (selrow.length == 1) {
					this.props.openTo('/uapbd/mmbase/bom0204/main/index.html', {
						status: 'browse',

						pk_org: selrow[0].data.values.pk_org.value,
						pk_org_d: selrow[0].data.values.pk_org.display,
						hcmaterialid: selrow[0].data.values.hcmaterialid.value,
						hcmaterialid_d: selrow[0].data.values.hcmaterialid.display,
						hcmaterialname: selrow[0].data.values.hcmaterialname.value,
						hcmaterialvid_d: selrow[0].data.values['hcmaterialvid.version']
							? selrow[0].data.values['hcmaterialvid.version'].display
							: '',
						hcmaterialvid: selrow[0].data.values.hcmaterialvid.value,
						hversion: selrow[0].data.values.hversion.value,
						fbomtype: selrow[0].data.values.fbomtype.value,

						appcode: '10140BOMTM',
						pagecode: '10140BOMTM_main'
					});
				}
			}
			break;
		case 'BatchEdit':
			{
				//批量修改
				rows = props.table.getCheckedRows(AREA.bomlist)
				if(!rows || rows.length == 0){
					toast({
						content: this.state.json['110140BOMM3011'], 
						color: 'warning' 
					})
					return
				}
				let bflag = true
				let selectedrecords = []
				for(let i = 0; i < rows.length; i++){
					let temp = rows[i].data.values
					if(temp.fbillstatus.value != '0' && temp.fbillstatus.value != '-1'){
						bflag = false
						break						
					}else{
						selectedrecords.push(temp)
					}
				}

				if(bflag == false){
					toast({
							content: '仅自由态/审批不通过BOM可修改，选择BOM中存在审批中/审批通过BOM，请重新选择！',
							color: 'warning'
						})
						return
				}
				console.log(selectedrecords)
				this.batcheditModal.show(rows, ()=>{
					this.getData({}, this.state.isShowOff, false)
				})
			}
			break
		case 'Assign':
			{
				//快速分配{}
				rows = props.table.getCheckedRows(AREA.bomlist);
				if (!rows || rows.length === 0) {
					toast({ content: this.state.json['110140BOMM3011'], color: 'warning' }); /* 国际化处理： 请先选择数据*/
					return;
				}
				pk_orgs = [];
				rows.forEach((row) => {
					pk_orgs.push(row.data.values.pk_org.value);
				});
				if (!hasPerm(pk_orgs)) {
					break;
				}
				let ids = [];
				rows.forEach((val) => {
					ids.push(val.data.values.cbomid.value);
				});
				this.assignModal.show(ids, false);
			}
			break;

		case 'Unassign':
			{
				rows = props.table.getCheckedRows(AREA.bomlist);
				if (!rows || rows.length === 0) {
					toast({ content: this.state.json['110140BOMM3011'], color: 'warning' }); /* 国际化处理： 请先选择数据*/
					return;
				}
				pk_orgs = [];
				rows.forEach((row) => {
					pk_orgs.push(row.data.values.pk_org.value);
				});
				if (!hasPerm(pk_orgs)) {
					break;
				}
				let ids = [];
				rows.forEach((val) => {
					ids.push(val.data.values.cbomid.value);
				});
				this.assignModal.show(ids, true);
			}
			break;
		case 'Print':
			{
				let cancontinue = false;

				ajax({
					url: URL.checkpermission,
					async: false,
					data: {
						id: this.props.table.getCheckedRows(AREA.bomlist)[0].data.values.cbomid.value,
						actioncode: 'Edit'
					},
					success: (res) => {
						cancontinue = true
					}, error: (err) => {
						toast({ color: 'danger', content: err.message });
					}
				});
				if (!cancontinue) {
					return
				}

				output('print');
			}
			break;
		case 'Output':
			{
				let rows = this.props.table.getCheckedRows(AREA.bomlist);
				let pks = [];

				rows.forEach((item) => {
					pks.push(item.data.values['cbomid'].value);
				});
				this.setState(
					{
						pks: pks
					},
					() => {
						this.refs.printOutput.open();
					}
				);
				break;
			}
			break;
		case 'CopyLines':
			{
				let _this = this;
				let selectedRow = props.cardTable.getCheckedRows(AREA.body);
				if (selectedRow == null || selectedRow.length == 0) {
					toast({
						color: 'warning',
						content: getLangByResId(_this, '4004ARRIVAL-000007') /* 国际化处理： 请选择数据！*/
					});
					return;
				}
				// props.button.setButtonVisible([ 'CopyLines', 'DeleteLines', 'ResetRowno' ], false);
				// props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], true);
				rowCopyPasteUtils.copyRows.call(
					this,
					props,
					AREA.body,
					['CopyLines', 'DeleteLines', 'ResetRowno'],
					['PastToThis', 'PastToLast', 'CancelPast']
				);
				this.setState({ isCopyLine: true });
				props.button.setButtonDisabled(['PastToThis', 'PastToLast', 'CancelPast'], false);
			}
			break;
		case 'PastToLast': // 物料 粘贴至末行
			{
				rowCopyPasteUtils.pasteRowsToTail.call(
					this,
					props,
					AREA.body,
					['CopyLines', 'DeleteLines', 'ResetRowno'],
					['PastToThis', 'PastToLast', 'CancelPast'],
					['crowno', 'pk_arriveorder_b']
				);
				RownoUtils.setRowNo(props, AREA.body, 'crowno');
				// props.button.setButtonVisible([ 'CopyLines', 'DeleteLines', 'ResetRowno' ], true);
				// props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
				this.setState({ isCopyLine: false });
				let selectedRow = props.cardTable.getCheckedRows(AREA.body);
				if (selectedRow == null || selectedRow.length == 0) {
					props.button.setButtonVisible(['PastToThis', 'PastToLast', 'CancelPast'], false);
				}
			}
			break;
		case 'CancelPast': // 物料 复制取消
			{
				// props.button.setButtonVisible([ 'CopyLines', 'DeleteLines', 'ResetRowno' ], true);
				// props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
				rowCopyPasteUtils.cancel.call(
					this,
					props,
					AREA.body,
					['CopyLines', 'DeleteLines', 'ResetRowno'],
					['PastToThis', 'PastToLast', 'CancelPast']
				);
				this.setState({ isCopyLine: false });
				let checks = props.cardTable.getCheckedRows(AREA.body);
				if (checks == null || checks.length == 0) {
					props.button.setButtonVisible(['PastToThis', 'PastToLast', 'CancelPast'], false);
				}
			}
			break;
		case 'DeleteLines':
			{
				let delrows = this.props.table.getCheckedRows(AREA.bomlist);
				let params = [];
				let candelete = false;
				if (delrows.length > 0) {
					delrows.forEach((item) => {
						if (item.data.values['hbdefault'].value == true) {
							candelete = true;
						}
						params.push({
							id: item.data.values['cbomid'].value,
							ts: item.data.values.ts.value
						});
					});
				} else {
					if (this.selectedRowRecord) {
						if (selectedRowRecord['hbdefault'].value == true) {
							candelete = true;
						}
						params.push({
							id: this.selectedRowRecord['cbomid'].value,
							ts: this.selectedRowRecord.ts.value
						});
					}
				}
				if (!candelete) {
					ajax({
						url: URL.delete,
						data: { param: params },
						success: (res) => {
							showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
							let { deleteCacheId } = props.table;
							let delrows = this.props.table.getCheckedRows(AREA.bomlist);
							if (delrows.length > 0) {
								delrows.forEach((item) => {
									deleteCacheId(AREA.bomlist, item.data.values.cbomid.value);
									props.table.deleteTableRowsByRowId(AREA.bomlist, item.data.rowId);
								});
							}
						}
					});
				} else {
					promptBox({
						color: 'warning',
						content: this.state.json['10140BOMM2-000006'],
						beSureBtnClick: () => {
							ajax({
								url: URL.delete,
								data: { param: params },
								success: (res) => {
									showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
									let { deleteCacheId } = props.table;
									let delrows = this.props.table.getCheckedRows(AREA.bomlist);
									if (delrows.length > 0) {
										delrows.forEach((item) => {
											deleteCacheId(AREA.bomlist, item.data.values.cbomid.value);
											props.table.deleteTableRowsByRowId(AREA.bomlist, item.data.rowId);
										});
									}
								}
							});
						}
					});
				}
			}
			break;

		case 'Refresh':
			{
				this.getData({}, this.state.isShowOff, false, () => {
					if (true) {
						toast({
							title: this.state.pubjson['10140PUBMESSAGE-000017'],
							color: 'success'
						}); /* 国际化处理： 刷新成功！*/
					}
				});
			}
			break;
		default:
			break;
	}
}

//bwCXkqKHLIo5V8heNQST6TaijHs36G8v6MpQ8CtdwYeGwPqUIdUB2qEy62YeYRfP