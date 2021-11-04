//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, cacheTools, base, toast, high, promptBox, cardCache, getMultiLang } from 'nc-lightapp-front';
const { NCPopconfirm, NCCheckbox, NCIcon, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
import { print, getBusinessInfo } from 'nc-lightapp-front';
const { PrintOutput, ApproveDetail } = high;
import { searchBtnClick, buttonClicks, pageInfoClick, commonSearch, commit } from './buttonclick';
import AssignModal from '../excomponents/assign/AssignModal';
import { AREA, URL } from '../constance';
import { columnSortUtils } from '../../public/tools/columnSortUtils';

import BatchEditModal from '../excomponents/batchedit/BatchEditModal'

const { getDefData, setDefData } = cardCache;
const dataSource = 'mmbd.bom.bom0202.data';
const pageId = '10140BOMM_list'; //pagecode
const searchId = 'bomwh_query'; //查询区id
const tableId = 'bomwh_head'; //表头id
const pk_item = 'cbomid'; //列表主键
const queryListUrl = '/nccloud/mmbd/bom0202/queryList.do'; //通过查询区域查询url
const queryPageUrl = '/nccloud/mmbd/bom0202/queryPage.do'; //分页查询url
const queryrtUrl = '/nccloud/mmbd/bom0202/queryRt.do'; //通过查询区域查询url
const deleteUrl = '/nccloud/mmbd/psg/delete.do'; //删除url
const printUrl = '/nccloud/mmbd/psg/print.do';
const permUrl = '/nccloud/mmbd/pub/getpermorgs.do';

const listInnerBtnArea = 'list-inner'		//列表操作列按钮区域

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId; //查询区域id
		this.tableId = tableId; //表格id
		this.selectedRowRecord = null;
		this.searchVal = null;
		this.state = {
			json: {},
			inlt: null,
			pks: [],
			billid: '',
			approveDetailShow: false
		};
	}

	initTemplate = (props) => {
		let _this = this;
		let result = props.createUIDom(
			{
				pagecode: pageId //页面id,
				, appcode: '10140BOMM'
			},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						meta = this.modifierMeta(props, meta);
						props.meta.setMeta(meta);
						getDefData('searchParam', dataSource)
							? this.props.search.setSearchValue(searchId, getDefData('searchParam', dataSource))
							: {};
						//props.search.getQueryInfo('bomwh_query');
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
					}
					if (data.context) {
						setDefData('context', dataSource, data.context);
					}

					// let listRefreshDisable = this.props.getUrlParam('listRefreshDisable')
					// if(listRefreshDisable != null){
					// 	props.button.setButtonDisabled(['Refresh'], listRefreshDisable)
					// }
				}
			}
		);
		console.log(result);

		let crtids = props.getUrlParam('crtids');
		if(typeof(crtids) == 'string'){
			crtids=[crtids];
		}
		if(crtids&&crtids.length>0){
			ajax({
				url: queryrtUrl,
				data: {crtids},
				success: (res) => {
					if (res.data) {
						//构建一下分页组件需要的数组
						let allPks = [];
						res.data[tableId].allpks.forEach((row) => {
							allPks.push(row);
						});
						// props.button.setButtonDisabled({
						// 	Print: false,
						// 	Output: false
						// })
						res.data[tableId].allpks = allPks;
						cacheTools.set('allpks', allPks);
						this.props.table.setAllTableData(tableId, res.data[tableId]);
						let { inlt } = this.state;
						let listcount = allPks.length;
						if(res.data.userjson){
							let hidden = JSON.parse(res.data.userjson);
							if(hidden.hidden){
								toast({ title: '', content:'用户无BOM使用组织权限，部分结果未显示。'});

							}else{
								toast({ title: '', content: inlt.get('110140BOMM4001', { count: listcount }), color: 'success' });

							}
						}else {
							toast({ title: '', content: inlt.get('110140BOMM4001', { count: listcount }), color: 'success' });

						}
						
					} else {
						//同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
						let tableData = {
							allpks: [],
							rows: []
						};
						// props.button.setButtonDisabled({
						// 	Print: true,
						// 	Output: true
						// })
						this.props.table.setAllTableData(tableId, tableData);
						//this.props.button.setButtonDisabled({ Refresh: true });
						toast({
							content: this.state.json ? this.state.json['110140BOMM3007'] : '110140BOMM3007',
							color: 'warning'
						}); /* 国际化处理： 无数据*/
					}
					this.props.table.selectAllRows(AREA.bomlist, false)
					this.setBtnStatus()
				}
			});

			this.props.button.setButtonDisabled({ Refresh: false });
		}	

	};

	modifierMeta(props, meta) {
		meta[searchId].items.forEach((item) => {
			switch (item.attrcode) {
				case 'useorgs.pk_useorg':
					{
						item.queryCondition = () => {
							return {
								GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter'
							};
						};
					}
					break;
				// case 'pk_org':
				// 	{
				// 		item.queryCondition = () => {
				// 			return {
				// 				GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter'
				// 			};
				// 		};
				// 	}
				// 	break;
				case 'hcmaterialid':
					{
						item.isHasDisabledData = true;
						item.isShowDisabledData = true;
						item.queryCondition = () => {
							return {
								pk_org: props.search.getSearchValByField(searchId, 'useorgs.pk_useorg').value
									.firstvalue,
								GridRefActionExt: 'nccloud.web.mmbd.refer.query.MaterialQueryFilter'
							};
						};
					}
					break;
				case 'hcmaterialvid':
					{
						item.fieldDisplayed = 'refcode'		//为了显示参照编码
						item.queryCondition = () => {
							return {
								pk_org: props.search.getSearchValByField(searchId, 'useorgs.pk_useorg').value
									.firstvalue,
								materialoid: props.search.getSearchValByField(searchId, 'hcmaterialid').value
									.firstvalue,
								GridRefActionExt: 'nccloud.web.mmbd.refer.pub.MaterialvidRefFilter'
							};
						};
					}
					break;
				// case 'fbomtype':
				// 	{
				// 		if (item.options.length > 2) {
				// 			item.options.splice(2, 1);
				// 		}
				// 	}
				// 	break;
				case 'hfbomsource':
					{
						if (item.options.length > 2) {
							item.options.splice(2, 1);
						}
					}
					break;
				case 'bomitems.vitemversion':
					{
						item.queryCondition = () => {
							let param = {
								pk_group: window.parent.GETBUSINESSINFO().groupId,
								pk_org: props.search.getSearchValByField(searchId, 'useorgs.pk_useorg').value
									.firstvalue,
								fbomtype: 1
							};
							if (
								props.search.getSearchValByField(searchId, 'bomitems.cmaterialid').value &&
								props.search.getSearchValByField(searchId, 'bomitems.cmaterialid').value.firstvalue
							) {
								param.hcmaterialid = props.search.getSearchValByField(
									searchId,
									'bomitems.cmaterialid'
								).value.firstvalue;
							}
							if (
								props.search.getSearchValByField(searchId, 'bomitems.cmaterialvid').value &&
								props.search.getSearchValByField(searchId, 'bomitems.cmaterialvid').value.firstvalue
							) {
								param.hcmaterialvid = props.search.getSearchValByField(
									searchId,
									'bomitems.cmaterialvid'
								).value.firstvalue;
							}
							return param;
							// return {
							//   pk_group: '00019110000000004SHQ',
							//   pk_org: '000191100000000072WH',
							//   hcmaterialid: '1002911000000000Q2VV',
							//   //  hcmaterialvid:''
							// }
						};
					}
					break;
				case 'bomitems.vpackversion':
					{
						item.queryCondition = () => {
							let param = {
								pk_group: window.parent.GETBUSINESSINFO().groupId,
								pk_org: props.search.getSearchValByField(searchId, 'useorgs.pk_useorg').value
									.firstvalue,
								fbomtype: 2
							};
							if (
								props.search.getSearchValByField(searchId, 'bomitems.cmaterialid').value &&
								props.search.getSearchValByField(searchId, 'bomitems.cmaterialid').value.firstvalue
							) {
								param.hcmaterialid = props.search.getSearchValByField(
									searchId,
									'bomitems.cmaterialid'
								).value.firstvalue;
							}
							if (
								props.search.getSearchValByField(searchId, 'bomitems.cmaterialvid').value &&
								props.search.getSearchValByField(searchId, 'bomitems.cmaterialvid').value.firstvalue
							) {
								param.hcmaterialvid = props.search.getSearchValByField(
									searchId,
									'bomitems.cmaterialvid'
								).value.firstvalue;
							}
							return param;
						};
					}
					break;
				case 'bomitems.cvendorid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.search.getSearchValByField(searchId, 'useorgs.pk_useorg').value.firstvalue
							};
						};
					}
					break;
				case 'bomitems.cprojectid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.search.getSearchValByField(searchId, 'useorgs.pk_useorg').value.firstvalue
							};
						};
					}
					break;
				case 'bomitems.cproductorid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.search.getSearchValByField(searchId, 'useorgs.pk_useorg').value.firstvalue
							};
						};
					}
					break;
				case 'bomitems.ccustomerid':
					{
						item.queryCondition = () => {
							return {
								pk_org: props.search.getSearchValByField(searchId, 'useorgs.pk_useorg').value.firstvalue
							};
						};
					}
					break;
			}
		});

		//添加操作列
		meta[tableId].pagination = true;

		meta[tableId].items.push({
			attrcode: 'opr',
			label: this.state.json ? this.state.json['110140BOMM3002'] : '110140BOMM3002' /* 国际化处理： 操作*/,
			width: 220,
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			render: (text, record, index) => {
				let btnArray = []
				if(getDefData('permorgs', dataSource).includes(record.pk_org.value) && record.fbillstatus.value == 1){
					btnArray.push('Revise')
				}
				if(getDefData('permorgs', dataSource).includes(record.pk_org.value) && record.fbillstatus.value == -1){
					btnArray.push('EditLine')
					btnArray.push('DelLine')
				}
				if(getDefData('permorgs', dataSource).includes(record.pk_org.value)){
					btnArray.push('CopyLine')
				}
				return props.button.createOprationButton(
					btnArray,
					{
						area: listInnerBtnArea, 
						buttonLimit: 4, 
						onButtonClick: (props, id)=>{
							this.onTableButtonClick.bind(this)(props, id, text, record, index)
						}
					}
				)

			}
		});
		return meta;
	}

	onTableButtonClick = (props, id, text, record, index) => {
		if(id === 'Revise'){
			props.table.selectAllRows(AREA.bomlist, false)
			props.pushTo('/card', {
				status: 'edit',
				reviseEdit: true,
				id: record['cbomid'].value
			});
		}

		if(id === 'EditLine'){
			let cancontinue = false;
			ajax({
				url: URL.checkpermission,
				async: false,
				data: {
					id: record['cbomid'].value,
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
			this.props.table.selectAllRows(AREA.bomlist, false);
			props.pushTo('/card', {
				status: 'edit',
				id: record['cbomid'].value
			});
		}

		if(id === 'DelLine'){
			let cancontinue = false;
			ajax({
				url: URL.checkpermission,
				async: false,
				data: {
					id: record['cbomid'].value,
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
			let pkid = record['cbomid'].value;
			let candelete = false;
			if (record['hbdefault'].value == true) {
				candelete = true;
			}

			// if (!candelete) {
			// 	ajax({
			// 		url: '/nccloud/mmbd/bom0202/delete.do',
			// 		data: {
			// 			param: [{ id: pkid, ts: record.ts.value }]
			// 		},
			// 		success: (res) => {
			// 			if (res.success && res.data.sucessNum == '1') {
			// 				toast({
			// 					color: 'success',
			// 					content: this.state.json['110140BOMM3006']
			// 				}); /* 国际化处理： 删除成功*/
			// 				//单页缓存方案-删除
			// 				let { deleteCacheId } = props.table;
			// 				deleteCacheId(tableId, pkid);
			// 				props.table.deleteTableRowsByIndex(tableId, index);
			// 			} else {
			// 				toast({
			// 					color: 'danger',
			// 					content: res.data.errorMessages[0]
			// 				});
			// 			}
			// 		}
			// 	});
			// } else 
			{
				promptBox({
					color: 'warning',
					content: this.state.json['10140BOMM2-000006'],
					beSureBtnClick: () => {
						ajax({
							url: '/nccloud/mmbd/bom0202/delete.do',
							data: {
								param: [{ id:pkid, ts: record.ts.value }]
							},
							success: (res) => {
								if (res.success && res.data.sucessNum == '1') {
									toast({
										color: 'success',
										content: this.state.json['110140BOMM3006']
									}); /* 国际化处理： 删除成功*/
									//单页缓存方案-删除
									let { deleteCacheId } = props.table;
									deleteCacheId(tableId, pkid);
									props.table.deleteTableRowsByIndex(tableId, index);
								} else {
									toast({
										color: 'danger',
										content: res.data.errorMessages[0]
									});
								}
							}
						});
					}
				});
			}
		}

		if(id === 'CopyLine'){
			props.table.selectAllRows(AREA.bomlist, false);
			props.pushTo('/card', {
				status: 'add',
				id: record['cbomid'].value,
				copyadd: true
			});
		}
	}

	closeApprove = () => {
		this.setState({
			approveDetailShow: false
		})
	}
	componentDidMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({ json, inlt }, () => {
					this.initTemplate(this.props);
				}); // 保存json和inlt到页面state中并刷新页面
			}
		};

		this.props.MultiInit.getMultiLang({
			moduleId: '10140BOMM',
			domainName: 'uapbd',
			callback
		});

		let callbacknoinit = (json, status, inlt) => {
			if (status) {
				this.setState({ pubjson: { ...json } });
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140MMPUBMSG', domainName: 'uapbd', callback: callbacknoinit });
		getDefData('searchParam', dataSource)
			? this.props.search.setSearchValue(searchId, getDefData('searchParam', dataSource))
			: {};
		//this.props.button.setButtonDisabled({ Refresh: true });

		this.setBtnStatus();
		this.getPermissionOrgs();
	}
	getPermissionOrgs() {
		ajax({
			url: permUrl,
			data: {},
			success: (res) => {
				setDefData('permorgs', dataSource, res.data.orgs);
			}
		});
	}
	setBtnStatus() {
		let rows = this.props.table.getCheckedRows(AREA.bomlist);
		if (rows.length > 0) {
			this.props.button.setButtonDisabled(
				[
					'Delete',
					'Copy',
					'Enable',
					'Disable',
					'Assign',
					'Unassign',
					'Commit',
					'UnCommit',
					'Print',
					'Assistfunction',
					'gylxyzxjc',
					'Output',
					'BatchEdit'
				],
				false
			);
			if (rows.length == 1) {
				if (getDefData('permorgs', dataSource).includes(rows[0].data.values.pk_org.value)) {
					if (rows[0].data.values.fbillstatus.value == '1') {
						if (
							rows[0].data.values.hfversiontype.value == '1' &&
							rows[0].data.values.fbillstatus.value == '1' &&
							rows[0].data.values.hbdefault.value == false
						) {
							this.props.button.setButtonDisabled(['CancelDefault'], true);
							this.props.button.setButtonDisabled(['Default'], false);
						}
						if (
							rows[0].data.values.hfversiontype.value == '1' &&
							rows[0].data.values.fbillstatus.value == '1' &&
							rows[0].data.values.hbdefault.value == true
						) {
							this.props.button.setButtonDisabled(['CancelDefault'], false);
							this.props.button.setButtonDisabled(['Default'], true);
						}
					} else {
						this.props.button.setButtonDisabled(['Default', 'CancelDefault'], true);
					}
					if (rows[0].data.values.fbillstatus.value == '1') {
						this.props.button.setButtonDisabled(['Commit', 'UnCommit','BatchEdit'], true);
						this.props.button.setButtonDisabled(['Assign', 'Unassign'], false);
					} else if (rows[0].data.values.fbillstatus.value == '2') {
						this.props.button.setButtonDisabled({ Commit: true, UnCommit: false,BatchEdit: true });
						this.props.button.setButtonDisabled({ Assign: true, Unassign: true });
					} else {
						this.props.button.setButtonDisabled(['BatchEdit'], false);
						//this.props.button.setButtonDisabled(['Commit', 'Unassign'], false);
						this.props.button.setButtonDisabled(['UnCommit', 'Assign'], true);
					}
					if (rows[0].data.values.fbillstatus.value == '1') {

						if (rows[0].data.values.hfversiontype.value == 2) {
							this.props.button.setButtonDisabled({ Enable: false, Disable: true });
						} else {
							this.props.button.setButtonDisabled({ Enable: true, Disable: false });
						}
					} else {
						this.props.button.setButtonDisabled({ Enable: true, Disable: true });

					}
					if (rows[0].data.values.fbillstatus.value != '-1') {
						this.props.button.setButtonDisabled(['UnCommit'], false);

					}
					this.props.button.setButtonDisabled(['LinkTree'], false);
				}
			} else {
				this.props.button.setButtonDisabled(
					['Default', 'CancelDefault', 'Assistfunction', 'gylxyzxjc', 'LinkTree'],
					true
				);
			}
		} else {
			this.props.button.setButtonDisabled(
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
					'LinkTree',
					'BatchEdit'
				],
				true
			);
		}
	}

	// buttonClick(props, id) {
	//     switch (id) {
	//         case 'Add':
	//             let searchVal = props.search.getAllSearchData(searchId);
	//             cacheTools.set("searchParams", searchVal);
	//             props.pushTo('/card', {
	//                 status: 'add'
	//             })
	//             break;
	//         case 'Edit':
	//             searchVal = props.search.getAllSearchData(searchId);
	//             cacheTools.set("searchParams", searchVal);
	//             if (this.selectedRowRecord == null) {
	//                 toast({ content: this.state.json['10140TAXRE-000033'], color: 'warning' })/* 国际化处理： 请选择需要编辑的数据！*/
	//                 return
	//             }
	//             props.pushTo('/card', {
	//                 status: 'edit',
	//                 id: this.selectedRowRecord[pk_item].value
	//             })
	//             break;
	//         case 'Refresh':
	//             this.refreshAction(props, true);
	//             break;
	//         case 'Delete':
	//             deleteButton.deleteClick(props,this.state);
	//             break;
	//         case 'Print':
	//             this.output('print')
	//             break;
	//         case 'Output':
	//             let allData = this.props.table.getAllTableData(tableId);
	//             let pks = [];
	//             allData.rows.forEach((row) => {
	//                 pks.push(row.values[pk_item].value);
	//             });
	//             this.setState({
	//                 pks: pks
	//             }, () => {
	//                 this.refs.printOutput.open()
	//             })
	//             break;
	//         default:
	//             break;
	//     }
	// }

	output(type = '') {
		let allData = this.props.table.getAllTableData(tableId);
		let pks = [];
		allData.rows.forEach((row) => {
			pks.push(row.values[pk_item].value);
		});
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print('pdf', printUrl, {
				funcode: /*this.props.config.funcode*/ '10140PSG', //功能节点编码
				nodekey: '10140PSG', //模板节点标识
				oids: pks,
				outputType: type
			});
		}
	}
	doubleClick = (record, index, e, props) => {
		let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set('searchParams', searchVal);

		this.props.table.selectAllRows(AREA.bomlist, false);

		this.props.pushTo('/card', {
			status: 'browse',
			id: record['cbomid'].value,
			appcode: '10140BOMM'
		});
	};

	deleteAction = (props) => {
		let params = {
			id: this.selectedRowRecord[pk_item].value,
			ts: this.selectedRowRecord.ts.value
		};
		ajax({
			url: deleteUrl,
			data: params,
			success: (res) => {
				toast({
					color: 'success',
					title: this.state.json['10140TAXRE-000019']
				}); /* 国际化处理： 删除成功！*/
				this.refreshAction(props);
			}
		});
	};

	// onRowClick(props, moduleId, record, index) {
	// 	this.selectedRowRecord = record;
	// 	if (record.hfversiontype.value == 2) {
	// 		props.button.setButtonDisabled({ Enable: false, Disable: true });
	// 	} else {
	// 		props.button.setButtonDisabled({ Enable: true, Disable: false });
	// 	}
	// }

	refreshAction = (props, isClickRef = false) => {
		this.getData({}, this.state.isShowOff, false, () => {
			if (isClickRef) {
				toast({
					title: this.state.json['10140TAXRE-000013'],
					color: 'success'
				}); /* 国际化处理： 刷新成功！*/
			}
		});
	};

	pageInfoClick = (props, config, pks) => {
		let pageInfo = props.table.getTablePageInfo(AREA.bomlist);
		// let searchVal = props.search.getAllSearchData(searchId);
		// // 后台还没更新，暂不可用
		// let queryInfo = this.props.search.getQueryInfo('bomwh_query');

		// let OID = this.props.meta.getMeta()[searchId].oid;
		if (pks.length == 0) {
			let allpks = cacheTools.get('allpks');
			// 这里暂时解决问题，后续在进行优化

			let index = Number(pageInfo.pageIndex);
			let size = Number(pageInfo.pageSize);
			let start = (index - 1) * size;
			for (let i = start; i < start + size; i++) {
				if (allpks[i]) {
					pks.push(allpks[i]);
				} else {
					break;
				}
			}
		}
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
		ajax({
			url: queryPageUrl,
			data: data, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改,
			success: function (res) {
				let { success, data } = res;
				if (success) {
					if (data) {
						props.table.setAllTableData(tableId, data[tableId]);
					} else {
						props.table.setAllTableData(tableId, { rows: [] });
					}
				}
			}
		});
	};

	clickSearchBtn = (props, searchVal) => {
		console.log(searchVal);
		if (searchVal && searchVal.conditions) {
			searchVal.conditions.push({
				field: "hfbomcategory",
				value: { firstvalue: "1", secondvalue: "" },
				oprtype: "=",
				datatype: "203",
				isIncludeSub: false
			})
		}
		this.searchVal = searchVal;
		cacheTools.set('searchParams', searchVal);

		this.getData(searchVal, this.state.isShowOff, true, () => {
			this.props.button.setButtonDisabled({ Refresh: false });
		});
	};

	getData(searchVal, isShowOff, showToast = false, callback) {
		// if (!this.state.pk_org || !this.state.pk_org['refpk']) {
		//     toast({ color: 'warning', content: this.state.json['110140PST0029'] });
		//     return;
		// }
		//获取查询模板信息
		let queryInfo = this.props.search.getQueryInfo('bomwh_query');
		console.log(queryInfo, "qryinf")
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let OID = queryInfo.oid;
		if (queryInfo && queryInfo.querycondition && queryInfo.querycondition.conditions) {
			queryInfo.querycondition.conditions.push({
				field: "hfbomcategory",
				value: { firstvalue: "1", secondvalue: "" },
				oprtype: "=",
				datatype: "203",
				isIncludeSub: false
			})


			queryInfo.querycondition.conditions.push({
				field: "hbcustomized",
				value: { firstvalue: false, secondvalue: "" },
				oprtype: "=",
				datatype: "32",
				isIncludeSub: false
			})
		} else {
			return
		}
		let psgData = {
			...queryInfo,
			pageInfo,
			pagecode: pageId,
			queryAreaCode: searchId, //查询区编码
			oid: OID, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType: 'simple'
		};

		ajax({
			url: queryListUrl,
			data: psgData,
			success: (res) => {
				if (res.data) {
					//构建一下分页组件需要的数组
					let allPks = [];
					res.data[tableId].allpks.forEach((row) => {
						allPks.push(row);
					});
					// props.button.setButtonDisabled({
					// 	Print: false,
					// 	Output: false
					// })
					res.data[tableId].allpks = allPks;
					cacheTools.set('allpks', allPks);
					this.props.table.setAllTableData(tableId, res.data[tableId]);
					let { inlt } = this.state;
					let listcount = allPks.length;
					toast({ title: '', content: inlt.get('110140BOMM4001', { count: listcount }), color: 'success' });
					if (callback) {
						callback();
					}
				} else {
					//同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
					let tableData = {
						allpks: [],
						rows: []
					};
					// props.button.setButtonDisabled({
					// 	Print: true,
					// 	Output: true
					// })
					this.props.table.setAllTableData(tableId, tableData);
					//this.props.button.setButtonDisabled({ Refresh: true });
					toast({
						content: this.state.json ? this.state.json['110140BOMM3007'] : '110140BOMM3007',
						color: 'warning'
					}); /* 国际化处理： 无数据*/
				}
				this.props.table.selectAllRows(AREA.bomlist, false)
				this.setBtnStatus()
			}
		});
	}

	afterSearchEvent(key, val) {
		console.log(key, val);
		if (key === 'useorgs.pk_useorg') {
			let metaItems = this.props.meta.getMeta()[searchId].items;
			if (val.length > 1 || val.length == 0) {
				for (const iterator of metaItems) {
					if (iterator.attrcode == 'hcmaterialid' || iterator.attrcode == 'hcmaterialvid' || iterator.attrcode == 'bomitems.cvendorid' || iterator.attrcode == 'bomitems.ccustomerid' || iterator.attrcode == 'bomitems.cproductorid' || iterator.attrcode == 'bomitems.cprojectid') {
						iterator.isShowUnit = true;
					}

				}
			} else {
				for (const iterator of metaItems) {
					if (iterator.attrcode == 'hcmaterialid' || iterator.attrcode == 'hcmaterialvid' || iterator.attrcode == 'bomitems.cvendorid' || iterator.attrcode == 'bomitems.ccustomerid' || iterator.attrcode == 'bomitems.cproductorid' || iterator.attrcode == 'bomitems.cprojectid') {
						iterator.isShowUnit = false;
					}
				}
			}
		}
		if (key == 'hbcustomized') {
			this.props.search.setSearchValByField(searchId, 'hbcustomized', { value: 'false' });

		}
		if (key == 'hcmaterialid' && val.length > 0) {
			this.props.search.setSearchValByField(searchId, 'hcmaterialvid', { value: '', display: '' });
		}
		if (key == 'hcmaterialvid' && val.values) {
			//console.log(this.props.search.getOprtypeByField(searchId, 'hcmaterialvid'))
			console.log(this.props.search.getAllSearchData(searchId))
			this.props.search.setSearchValue(searchId, [{ 'field': 'hcmaterialvid', value: { firstvalue: val.refpk, secondvalue: "" }, display: val.refcode, oprtype: '=' }]);

		}
	}

	render() {
		let { table, button, search, base, modal } = this.props;
		let buttons = this.props.button.getButtons();
		buttons = buttons.sort((a, b) => {
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createModal } = modal;
		let { createButtonApp, getButtons } = button;
		return (
			<div className="nc-bill-list">
				<div className="nc-bill-header-area">
					<div className="header-title-search-area">
						<h2 className="title-search-detail">
							{this.state.json ? this.state.json['110140BOMM3001'] : '110140BOMM3001'}
						</h2>
					</div>

					<div className="header-button-area">
						{createButtonApp({
							area: 'header',
							buttonLimit: 3,
							onButtonClick: buttonClicks.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this),
						onAfterEvent: this.afterSearchEvent.bind(this)
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: dataSource,
						pkname: pk_item,
						tableModelConfirm: this.tableModelConfirm,
						showIndex: false,
						// onRowClick: this.onRowClick.bind(this),
						showCheck: true,
						handlePageInfoChange: this.pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.setBtnStatus.bind(this),
						onSelectedAll: this.setBtnStatus.bind(this)
					})}
				</div>
				<PrintOutput
					ref="printOutput"
					url={URL.print}
					data={{
						funcode: '10140BOMM',
						nodekey: 'bommprint',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
				<AssignModal ref={(assignModal) => (this.assignModal = assignModal)} {...this.props} />
				<BatchEditModal ref={(batcheditModal) => (this.batcheditModal = batcheditModal)} {...this.props} />
				<ApproveDetail
					show={this.state.approveDetailShow}
					close={this.closeApprove.bind(this)}
					billtype='19B1'
					billid={this.state.billid}
				/>
			</div>
		);
	}
}

List = createPage({
	initTemplate: []
})(List);

export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65