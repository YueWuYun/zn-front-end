//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//BOM树状维护
import React, { Component } from 'react';
import { ajax, base, createPage, getBusinessInfo, cardCache, high, print } from 'nc-lightapp-front';
import BomTree from '../component/bomTree';
import './index.less';
const { NCDatePicker } = base;
const { PrintOutput } = high;
const pageCode = '10140BOMTM_main';
const treeId = 'bomtree';
const searchId = 'bomtm_query'; // 查询区id
const formId = 'bomcard_h'; //表单区id
const material = 'bomcard_b'; //材料表格id
const product = 'bomcard_outputs'; //联副产品id
const org = 'bomcard_useorg'; //分配组织id
import AssignModal from '../../bom0202/excomponents/assign/AssignModal';
import PowerTable from '../../bom0202/excomponents/power';

const urls = {
	detectUrl: '/nccloud/mmbd/datadetect/detect.do',
	getCodeUrl: '/nccloud/mmbd/datadetect/gencode.do',
	loadTreeDataUrl: '/nccloud/mmbd/bom0204/queryTree.do',
	treeselection: '/nccloud/mmbd/bom0204/treeselect.do',
	bomlinktree: '/nccloud/mmbd/bom0204/linktree.do'
};
import { URL, FIELD, PAGECODE, AREA } from '../../bom0202/constance';
const { getDefData, setDefData } = cardCache;

const dataSource = 'mmbd.bom.bom0204.data';
const permUrl = '/nccloud/mmbd/pub/getpermorgs.do';


class BomTreeList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cbomid: '',
			pks: [],
			status: 'browse',
			json: {},
			dataHead: '',
			dataBody: '',
			hcmaterialid: '',
			hcmateiralvid: '',
			showGrand: false,
			headitems: [],
			pk_org:''
		};
	}
	componentDidMount() {
		let callback = (json) => {
			this.setState({ json: { ...this.state.json, ...json } }, () => {
				this.initTemplate(this.props, loadtree);
			});
		};
		let loadtree = (props) => {
			let pk_org = props.getUrlParam('pk_org');
			
			let pk_org_d = props.getUrlParam('pk_org_d');
			let pk_group = getBusinessInfo().groupId;
			let hcmaterialid = props.getUrlParam('hcmaterialid');
			let hcmaterialid_d = props.getUrlParam('hcmaterialid_d');
			let hcmaterialname = props.getUrlParam('hcmaterialname');
			let hcmaterialvid = props.getUrlParam('hcmaterialvid');
			let hcmaterialvid_d = props.getUrlParam('hcmaterialvid_d');
			let hversion = props.getUrlParam('hversion');
			let fbomtype = props.getUrlParam('fbomtype');
			if (pk_org && hcmaterialid) {
				this.setState({pk_org})
				let requestParam = {
					pk_org, pk_group, hcmaterialid, hcmaterialvid, fbomtype, hversion
				};
				props.search.setSearchValByField(searchId, 'pk_org', { value: pk_org, display: pk_org_d })
				props.search.setSearchValByField(searchId, 'hcmaterialid', { value: hcmaterialid, display: hcmaterialid_d })
				props.search.setSearchValByField(searchId, 'hcmaterialname', { value: hcmaterialname, display: hcmaterialname })
				props.search.setSearchValByField(searchId, 'hcmaterialvid', { value: hcmaterialvid, display: hcmaterialvid_d })
				if (requestParam.hcmaterialid && requestParam.hcmaterialid.length < 20) {
					return;
				}
				console.log(requestParam, 'requestParam');
				
					ajax({
						url: urls.bomlinktree,
						data: requestParam,
						success: (result) => {
							console.log(result, 'result');
							if (result.success) {
								//同步树  加载全部数据
								this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData(result.data));
								//展开节点  设置默认展开项
								// this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
								this.props.syncTree.setNodeDisable(treeId, false);
								this.setState({ disabledShowOff: false, disabledSearch: false });
							}
						}
					});
			}
		}
		//加载多语文件
		this.props.MultiInit.getMultiLang({ moduleId: '10140BOMTM', domainName: 'uapbd', callback });
		let callback2 = (json) => {
			this.setState({ json: { ...this.state.json, ...json } })
		};
		//加载多语文件
		this.props.MultiInit.getMultiLang({ moduleId: '10140BOMM', domainName: 'uapbd', callback2 });
		let callbacknoinit = (json, status, inlt) => {
			if (status) {
				this.setState({ pubjson: { ...json } });
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10140MMPUBMSG', domainName: 'uapbd', callback: callbacknoinit });

		this.getPermissionOrgs();



	}
	componentDidUpdate() {
		if (this.state.status != 'browse') {
			window.onbeforeunload = () => {
				//编辑态关闭页签或浏览器的提示
				return '';
			};
		} else {
			window.onbeforeunload = null;
		}
	}
	initTemplate = (props, callback) => {
		props.createUIDom({ pagecode: pageCode }, (data) => {
			//页面模板
			if (data.template) {
				let meta = data.template;
				meta = this.modifierMeta(props, meta);
				props.meta.setMeta(meta);
				props.search.setDisabledByField(searchId, 'hbdefault', true);
				props.search.setDisabledByField(searchId, 'hcmaterialid', true);
				props.search.setDisabledByField(searchId, 'hcmaterialvid', true);
			}
			//按钮
			if (data.button) {
				props.button.setButtons(data.button);
				props.button.setButtonVisible(
					[
						'Add',
						'Edit',
						'ReviseEdit',
						'Delete',
						'Copy',
						'Commit',
						'Commitlist',
						'UnCommit',
						'wlzyl',
						'lcgylx',
						'pzbomm',
						'Enable',
						'Disable',
						'Default',
						'Canceldefault',
						'ShowGrand',
						'AddLine',
						'InsertLine',
						'DelLine',
						'CopyLine',
						'PasteLine',
						'PasteLineEnd',
						'ResetRow',
						'OutputsAddLine',
						'OutputsInsertLine',
						'OutputsDelLine',
						'OutputsCopyLine',
						'OutputsPasteLine',
						'OutputsPasteLineEnd',
						'OutputsResetRow'
					],
					false
				);
				props.button.setButtonDisabled(
					[
						'gylxyzxjc',
						'BomAssign',
						'Unassign',
						'Assign',
						'Print',
						'printlist',
						'Output',
						'PrintWips',
						'PrintPos',
						'PrintOutputs',
						'PrintRepls',
						'PrintLoss'
					],
					true
				);
				props.button.setButtonVisible(['Save', 'Saveadd', 'Savecommit', 'Cancel', 'Materialworkload'], false);
			}
			if (data.context.pk_org) {
				this.setState({pk_org:data.context.pk_org})
				this.props.search.setDisabledByField(searchId, 'hbdefault', false);
				this.props.search.setDisabledByField(searchId, 'hcmaterialid', false);
			}
			callback && callback(this.props);
		});
	};
	modifierMeta(props, meta) {
		// 设置参照过滤
		meta[searchId].items.forEach((item) => {
			if (item.attrcode == 'pk_org') {
				item.queryCondition = () => {
					return {
						pk_group: getBusinessInfo().groupId,
						GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter'
					};
				};
			}
			if (item.attrcode == 'hcmaterialid') {
				item.queryCondition = () => {
					return {
						pk_org: this.state.pk_org,
						GridRefActionExt: 'nccloud.web.mmbd.refer.query.MaterialQueryFilter'
					};
				};
			}
			if (item.attrcode == 'hcmaterialvid') {
				item.queryCondition = () => {
					return {
						pk_org: this.state.pk_org,
						materialoid: props.search.getSearchValByField(searchId, 'hcmaterialid').value.firstvalue,
						GridRefActionExt: 'nccloud.web.mmbd.refer.pub.MaterialvidRefFilter'
					};
				};
			}
		});
		let porCol = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.pubjson ? this.state.pubjson['10140PUBMESSAGE-000034'] : '10140PUBMESSAGE-000034',
			visible: true,
			className: 'table-opr',
			width: 200,
			fixed: 'right',
			render: (text, record, index) => {
				let btnArray = ['More', 'InsertLine', 'DelRow', 'ShowRowGrand', 'PasteHere'];

				return props.button.createOprationButton(btnArray, {
					area: 'itembody-action',
					buttonLimit: 3,
					onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
				});
			}
		};
		meta[AREA.bomcarditem].items.push(porCol);
		return meta;
	}
	tableButtonClick = (props, id, text, record, index) => {
		//'More', 'InsertLine', 'DelRow','ShowRowGrand'];
		switch (id) {
			case 'More':
				{
					//if (props.getUrlParam('status') == 'browse') {
					props.cardTable.toggleRowView(AREA.bomcarditem, record);
					//} else props.cardTable.openModel(AREA.bomcarditem, 'edit', record, index);
				}
				break;

			case 'ShowRowGrand':
				{
					// props.cardTable.filterEmptyRows(AREA.bomcarditem, ["cmaterialvid"], 'include')

					//if (props.cardTable.getAllRows(AREA.bomcarditem).length > 0) {
					this.setState({
						showGrand: true,
						grandStatus: 'browse',
						items: props.cardTable.getRowsByIndexs(AREA.bomcarditem, index),
						headitems: props.form.getAllFormValue(AREA.bomcardh)
					});

					//}
				}
				break;

			default:
				break;
		}
	};
	//查询区编辑后事件
	afterSearchEvent = (key, val) => {
		if (key == 'pk_org') {
			this.props.search.clearSearchArea(searchId);
			this.props.form.EmptyAllFormValue('bomcard_h')
			this.props.cardTable.setTableData(AREA.bomcarditem, { rows: [] })
			this.props.cardTable.setTableData(AREA.bomcardoutputs, { rows: [] })
			this.props.cardTable.setTableData(AREA.bomcarduseorg, { rows: [] })
			this.props.button.setButtonDisabled(
				[
					'gylxyzxjc',
					'BomAssign',
					'Assign',
					'Unassign',
					'Print',
					'printlist',
					'Output',
					'PrintWips',
					'PrintPos',
					'PrintOutputs',
					'PrintRepls',
					'PrintLoss'
				],
				true
			);
			this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData([]));
			if (val.refpk) {
				this.props.search.setSearchValByField(searchId, 'pk_org', {
					display: val.refname,
					value: val.refpk
				});
				this.setState({pk_org:val.refpk})
				this.props.search.setSearchValByField(searchId, 'hbdefault', {
					value: true
				});
				this.props.search.setDisabledByField(searchId, 'hbdefault', false);
				this.props.search.setDisabledByField(searchId, 'hcmaterialid', false);
				this.props.search.setDisabledByField(searchId, 'hcmaterialvid', true);
			} else {
				this.props.search.setSearchValByField(searchId, 'hbdefault', {
					value: false
				});
				this.props.search.setDisabled(searchId, true);
				this.props.search.setDisabledByField(searchId, 'pk_org', false);
				this.setState({pk_org:''})
			}
		}
		if (key == 'hcmaterialid') {
			this.setState({ hcmaterialid: val.refpk }, () => {
				if (val.refpk) {
					this.props.search.setDisabledByField(searchId, 'hcmaterialvid', false);
					this.props.search.setSearchValByField(searchId, 'hcmaterialname', {
						display: val.refname,
						value: val.refname
					});
					this.loadTreeData();
				} else {
					this.props.form.EmptyAllFormValue('bomcard_h')
					this.props.cardTable.setTableData(AREA.bomcarditem, { rows: [] })
					this.props.cardTable.setTableData(AREA.bomcardoutputs, { rows: [] })
					this.props.cardTable.setTableData(AREA.bomcarduseorg, { rows: [] })
					let data = [
						{
							field: 'hcmaterialname',
							display: '',
							value: ''
						},
						{
							field: 'hcmaterialvid',
							display: '',
							value: ''
						}
					];
					this.props.search.setSearchValue(searchId, data);
					this.props.search.setDisabledByField(searchId, 'hcmaterialvid', true);
					this.props.button.setButtonDisabled(
						[
							'gylxyzxjc',
							'BomAssign',
							'Assign',
							'Unassign',
							'Print',
							'printlist',
							'Output',
							'PrintWips',
							'PrintPos',
							'PrintOutputs',
							'PrintRepls',
							'PrintLoss'
						],
						true
					);
					this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData([]));
				}
			});

		}
		if (key == 'hcmaterialvid') {
			this.setState({ hcmaterialvid: val.refpk });

			if (val.refpk) {
				this.props.search.setSearchValByField(searchId, 'hcmaterialvid', {
					display: val.values.version.value,
					value: val.values.version.value
				});

			}
			this.loadTreeData()
		}
		if (key == 'hbdefault') {
			if (this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue && this.state.hcmaterialid)
				this.loadTreeData()
		}
	};
	/**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
	dealTreeData = (data) => {
		let deleteDataChildrenProp = function (node) {
			node.iconBox = {
				addIcon: false,
				editIcon: false,
				delIcon: false
			};
			if (!node.children || node.children.length == 0) {
				delete node.children;
			} else {
				node.isLeaf = false;
				node.children.forEach((e) => {
					deleteDataChildrenProp(e);
				});
			}
		};
		data.forEach((e) => {
			deleteDataChildrenProp(e);
		});
		return data;
	};
	OnHideSun() {
		return () => {
			this.setState({
				showGrand: false
			});
			//console.log(this.refs.itemcontent.cardTable.getAllRows(AREA.bomcarditem));
		};
	}
	onConfirmSun() {
		return () => {
			this.setState({
				showGrand: false
			});

		};
	}

	/**
     * 加载树节点数据
     */
	loadTreeData = (callback) => {
		let requestParam = {
			pk_org: this.state.pk_org, //当前选择的组织pk
			hcmaterialid: this.state.hcmaterialid,
			hcmaterialvid: this.state.hcmaterialvid
		};
		if (requestParam.hcmaterialid.length < 20) {
			return;
		}
		console.log(requestParam, 'requestParam');
		ajax({
			url: urls.loadTreeDataUrl,
			data: requestParam,
			success: (result) => {
				console.log(result, 'result');
				if (result.success) {
					//同步树  加载全部数据
					this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData(result.data));
					//展开节点  设置默认展开项
					// this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
					this.props.syncTree.setNodeDisable(treeId, false);



					this.setState({ disabledShowOff: false, disabledSearch: false }, () => {
						callback && callback();
					});
				}
			}
		});
	};
	getPermissionOrgs = () => {
		ajax({
			url: permUrl,
			data: {},
			success: (res) => {
				setDefData('permorgs', dataSource, res.data.orgs);
			}
		});
	}
	selectedForInit = (refpk, curNode) => {
		//清空表单数据
		this.props.form.EmptyAllFormValue(formId);
		this.props.button.setButtonVisible(['ShowGrand'], true);
		this.props.button.setButtonDisabled(
			[
				'gylxyzxjc',
				'BomAssign',
				'Assign',
				'Unassign',
				'Print',
				'printlist',
				'Output',
				'PrintWips',
				'PrintPos',
				'PrintOutputs',
				'PrintRepls',
				'PrintLoss'
			],
			false
		);
		this.setState({ cbomid: refpk });
		let data = { ...curNode.nodeData.userobj, hbdefault: this.props.search.getSearchValByField(searchId, 'hbdefault').value.firstvalue }
		if (data.cbomid) {
			delete data.aggvo;
			ajax({
				url: urls.treeselection,
				data,
				success: (res) => {
					if (res.data) {
						curNode.nodeData.userobj.cbomid = res.data.cbomid
						this.props.syncTree.addNodeSuccess(treeId, res.data.trees);
					}
				}
			})
			let tdata = {
				pk: data.cbomid
			};
			ajax({
				url: URL.queryCard,
				data: tdata,
				success: (res) => {
					setTimeout(() => {
						if (res.data.head) {
							this.props.form.setAllFormValue({
								[formId]: res.data.head[formId]
							});
							if (getDefData('permorgs', dataSource).includes(res.data.head[formId].rows[0].values.pk_org.value)) {
								if (res.data.head[formId].rows[0].values.fbillstatus.value == 1) {
									this.props.button.setButtonDisabled(['Assign'], false)
								} else {
									this.props.button.setButtonDisabled(['Assign'], true)
								}
								this.props.button.setButtonDisabled(['Unassign', 'gylxyzxjc', 'Print', 'Output'], false)
							} else {
								this.props.button.setButtonDisabled(['Assign', 'Unassign', 'gylxyzxjc', 'Print', 'Output'], true);
							}
							// if (
							// 	!getDefData('permorgs', dataSource).includes(
							// 		res.data.head[AREA.bomcardh].rows[0].values.pk_org.value
							// 	)
							// ) {
							// 	this.props.button.setButtonDisabled(
							// 		[
							// 			'Default',
							// 			'CancelDefault',
							// 			'Assign',
							// 			'Unassign',
							// 			'Commit',
							// 			'UnCommit',
							// 			'Enable',
							// 			'Disable',
							// 			'Copy',
							// 			'Edit',
							// 			'ReviseEdit',
							// 			'Delete',
							// 			'gylxyzx'
							// 		],
							// 		true
							// 	);
							// } else {
							// 	if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
							// 		this.props.button.setButtonDisabled([ 'ReviseEdit', 'Assign', 'Unassign' ], false);
							// 		this.props.button.setButtonDisabled([ 'Edit', 'Commit', 'UnCommit' ], true);
							// 	} else if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 2) {
							// 		this.props.button.setButtonDisabled('Commit', true);
							// 		this.props.button.setButtonDisabled('UnCommit', false);
							// 	} else {
							// 		this.props.button.setButtonDisabled(
							// 			[ 'ReviseEdit', 'UnCommit', 'Assign', 'Unassign' ],
							// 			true
							// 		);
							// 		this.props.button.setButtonDisabled('Edit', false);
							// 	}
							// 	if (res.data.head[AREA.bomcardh].rows[0].values.hfversiontype.value == 2) {
							// 		this.props.button.setButtonDisabled({ Enable: false, Disable: true });
							// 	} else {
							// 		this.props.button.setButtonDisabled({ Enable: true, Disable: false });
							// 	}
							// 	if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == '1') {
							// 		if (res.data.head[AREA.bomcardh].rows[0].values.hfversiontype.value == '1') {
							// 			if (res.data.head[AREA.bomcardh].rows[0].values.hbdefault.value == true) {
							// 				this.props.button.setButtonDisabled({ CancelDefault: false, Default: true });
							// 			} else {
							// 				this.props.button.setButtonDisabled({ CancelDefault: true, Default: false });
							// 			}
							// 		} else {
							// 			this.props.button.setButtonDisabled([ 'Default', 'CancelDefault' ], true);
							// 		}
							// 	} else {
							// 		this.props.button.setButtonDisabled([ 'Default', 'CancelDefault' ], true);
							// 	}
							// }
						}

						//let tabs = [AREA.bomcarditem, AREA.bomcardoutputs, AREA.bomcarduseorg];

						if (res.data.bodys) {
							this.props.cardTable.setTableData(material, res.data.bodys[material]);
							this.props.cardTable.setTableData(product, res.data.bodys[product]);
							this.props.cardTable.setTableData(org, res.data.bodys[org]);



							let data = {
								cbomid: this.props.form.getFormItemsValue(formId, 'cbomid').value,
								pcode: '10140BOMTM_grand'
							};
							ajax({
								url: URL.queryGrand,
								data: data,
								loading: false,
								success: (res) => {
									console.log(res);
									if (res && res.data && Object.keys(res.data).length !== 0) {
										this.props.cardTable.getAllRows(material).forEach((row) => {
											if (res.data[row.values.cbom_bid.value] && res.data[row.values.cbom_bid.value].bodys) {
												row.bomwips = res.data[row.values.cbom_bid.value].bodys.bomwips;
												row.bomrepls = res.data[row.values.cbom_bid.value].bodys.bomrepls;
												row.bompos = res.data[row.values.cbom_bid.value].bodys.bompos;
												row.bomloss = res.data[row.values.cbom_bid.value].bodys.bomloss;
											}
										});
									}
								}
							});
						} else {
							this.props.cardTable.setAllTabsData([], tabs);
							this.setState({
								tableData: []
							});
						}
					}, 0);


				}
			});
		} else {
			// this.props.form.clear
		}
	}
	//获取树所有节点pk
	getTreeAllPks = (treeData) => {
		let result = new Array();
		const loop = (treeData) => {
			treeData.forEach((data) => {
				if (data.refpk != '~') {
					result.push(data.refpk);
				}
				if (data.hasOwnProperty('children') && data.children.length > 0) {
					loop(data.children);
				}
			});
		};
		loop(treeData);
		return result;
	};

	//点击树节点
	onSelectTree = (refpk, curNode, isCheck, node) => {
		//console.log(this.props.syncTree.getSyncTreeValue('bomtree', "1001Z810000000008BGO"))
		//清空表单数据
		this.props.form.EmptyAllFormValue(formId);
		this.props.button.setButtonVisible(['ShowGrand'], true);
		this.props.button.setButtonDisabled(
			[
				'gylxyzxjc',
				'BomAssign',
				'Assign',
				'Unassign',
				'Print',
				'printlist',
				'Output',

			],
			true
		);
		this.setState({ cbomid: refpk });
		let data = { ...curNode.nodeData.userobj, hbdefault: this.props.search.getSearchValByField(searchId, 'hbdefault').value.firstvalue }
		if (data.bomversion) {
			if ((!curNode.children || curNode.children.length == 0)) {
				delete data.aggvo;
				ajax({
					url: urls.treeselection,
					data,
					success: (res) => {
						if (res.data) {
							curNode.nodeData.userobj.cbomid = res.data.cbomid
							this.props.syncTree.addNodeSuccess(treeId, res.data.trees);
							let tdata = {
								pk: res.data.cbomid
							};
							ajax({
								url: URL.queryCard,
								data: tdata,
								success: (res) => {
									setTimeout(() => {
										if (res.data.head) {
											this.props.form.setAllFormValue({
												[formId]: res.data.head[formId]
											});
											if (getDefData('permorgs', dataSource).includes(res.data.head[formId].rows[0].values.pk_org.value)) {
												if (res.data.head[formId].rows[0].values.fbillstatus.value == 1) {
													this.props.button.setButtonDisabled(['Assign'], false)
												} else {
													this.props.button.setButtonDisabled(['Assign'], true)
												}
												this.props.button.setButtonDisabled(['Unassign', 'gylxyzxjc', 'Print', 'Output'], false)
											} else {
												this.props.button.setButtonDisabled(['Assign', 'Unassign', 'gylxyzxjc', 'Print', 'Output'], true);
											}

											if (res.data.bodys) {
												this.props.cardTable.setTableData(material, res.data.bodys[material]);
												this.props.cardTable.setTableData(product, res.data.bodys[product]);
												this.props.cardTable.setTableData(org, res.data.bodys[org]);



												let data = {
													cbomid: this.props.form.getFormItemsValue(formId, 'cbomid').value,
													pcode: '10140BOMTM_grand'
												};
												ajax({
													url: URL.queryGrand,
													data: data,
													loading: false,
													success: (res) => {
														console.log(res);
														if (res && res.data && Object.keys(res.data).length !== 0) {
															this.props.cardTable.getAllRows(material).forEach((row) => {
																if (res.data[row.values.cbom_bid.value] && res.data[row.values.cbom_bid.value].bodys) {
																	row.bomwips = res.data[row.values.cbom_bid.value].bodys.bomwips;
																	row.bomrepls = res.data[row.values.cbom_bid.value].bodys.bomrepls;
																	row.bompos = res.data[row.values.cbom_bid.value].bodys.bompos;
																	row.bomloss = res.data[row.values.cbom_bid.value].bodys.bomloss;
																}
															});
														}
													}
												});
											} else {
												this.props.cardTable.setAllTabsData([], tabs);
												this.setState({
													tableData: []
												});
											}
										}
									}, 0);


								}
							});
						}
					}
				})
			} else {
				let tdata = {
					pk: data.cbomid,
					isTree: true
				};
				ajax({
					url: URL.queryCard,
					data: tdata,
					success: (res) => {
						setTimeout(() => {
							if (res.data.head) {
								this.props.form.setAllFormValue({
									[formId]: res.data.head[formId]
								});
								if (getDefData('permorgs', dataSource).includes(res.data.head[formId].rows[0].values.pk_org.value)) {
									if (res.data.head[formId].rows[0].values.fbillstatus.value == 1) {
										this.props.button.setButtonDisabled(['Assign'], false)
									} else {
										this.props.button.setButtonDisabled(['Assign'], true)
									}
									this.props.button.setButtonDisabled(['Unassign', 'gylxyzxjc', 'Print', 'Output'], false)

									if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 1) {
										this.props.button.setButtonDisabled(['Unassign'], false);
									} else if (res.data.head[AREA.bomcardh].rows[0].values.fbillstatus.value == 2) {
										this.props.button.setButtonDisabled(['Assign', 'Unassign'], true);
									} else {
										this.props.button.setButtonDisabled(['Assign'], true);
										this.props.button.setButtonDisabled(['Unassign'], false);
									}
								} else {
									this.props.button.setButtonDisabled(['Assign', 'Unassign', 'gylxyzxjc', 'Print', 'Output'], true);
								}

								if (res.data.bodys) {
									this.props.cardTable.setTableData(material, res.data.bodys[material]);
									this.props.cardTable.setTableData(product, res.data.bodys[product]);
									this.props.cardTable.setTableData(org, res.data.bodys[org]);



									let data = {
										cbomid: this.props.form.getFormItemsValue(formId, 'cbomid').value,
										pcode: '10140BOMTM_grand'
									};
									ajax({
										url: URL.queryGrand,
										data: data,
										loading: false,
										success: (res) => {
											console.log(res);
											if (res && res.data && Object.keys(res.data).length !== 0) {
												this.props.cardTable.getAllRows(material).forEach((row) => {
													if (res.data[row.values.cbom_bid.value] && res.data[row.values.cbom_bid.value].bodys) {
														row.bomwips = res.data[row.values.cbom_bid.value].bodys.bomwips;
														row.bomrepls = res.data[row.values.cbom_bid.value].bodys.bomrepls;
														row.bompos = res.data[row.values.cbom_bid.value].bodys.bompos;
														row.bomloss = res.data[row.values.cbom_bid.value].bodys.bomloss;
													}
												});
											}
										}
									});
								} else {
									this.props.cardTable.setAllTabsData([], tabs);
									this.setState({
										tableData: []
									});
								}
							}
						}, 0);


					}
				});
			}
		} else {
			this.props.form.EmptyAllFormValue('bomcard_h')
			this.props.cardTable.setTableData(AREA.bomcarditem, { rows: [] })
			this.props.cardTable.setTableData(AREA.bomcardoutputs, { rows: [] })
			this.props.cardTable.setTableData(AREA.bomcarduseorg, { rows: [] })
		}
	};
	output = (type = "") => {
		let pks = [];
		pks.push(this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value)

		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != "") {
			//打印
			print("pdf", URL.print, {
				funcode: /*this.props.config.funcode*/ "10140BOMM", //功能节点编码
				nodekey: "bommprint", //模板节点标识
				oids: pks,
				outputType: type
			});
		}
	}
	//按钮点击事件
	onButtonClick(props, id) {
		switch (id) {
			case 'gylxyzxjc': {
				ajax({
					url: URL.checkbefore,
					data: { cbomid: this.props.form.getFormItemsValue(formId, 'cbomid').value },

					success: (res) => {
						this.props.openTo('/uapbd/mmbase/datamanage01/main/index.html', {
							status: 'browse',

							pk_org: this.props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue,
							pk_org_d: this.props.search.getSearchValByField(searchId, 'pk_org').display,
							cbomid: this.props.form.getFormItemsValue(formId, 'cbomid').value,

							appcode: '10140DAMA',
							pagecode: '10140DAMA_form'
						});

					}
				});


			}
				break;

			case 'Refresh': {
				this.loadTreeData();
			}
				break;
			case 'Assign': {
				let ids = [this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value];
				this.assignModal.show(ids, false);
			} break;
			case 'Unassign': {
				let ids = [this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value];
				this.assignModal.show(ids, true);
			} break;
			case 'Print': {
				this.output('print');
			} break;
			case 'Output': {
				let pks = [];
				pks.push(this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value);

				this.setState(
					{
						pks: pks
					},
					() => {
						this.refs.printOutput.open();
					}
				);
			} break;
			case 'ShowGrand': {
				if (this.props.cardTable.getAllRows(material).length <= 0) {
					toast({ color: 'warning', title: this.state.json['10140BOMTM0002'] });
				}
				this.setState({
					showGrand: true,
					grandStatus: this.props.cardTable.getStatus(material),
					items: this.props.cardTable.getAllRows(material),
					headitems: this.props.form.getAllFormValue(formId)
				});

				this.refs.itemcontent.cardTable.setTableData(
					material,
					this.props.cardTable.getAllRows(material)
				);

			}
			default:
				break;
		}
	}
	onBodyButtonClick = (props, id) => {
		switch (id) {
			case 'ShowGrand':
				if (this.props.cardTable.getAllRows(material).length <= 0) {
					toast({ color: 'warning', title: this.state.json['10140BOMTM0002'] });
				}
				this.setState({
					showGrand: true,
					grandStatus: this.props.cardTable.getStatus(material),
					items: this.props.cardTable.getAllRows(material),
					headitems: this.props.form.getAllFormValue(formId)
				});

				this.refs.itemcontent.cardTable.setTableData(
					material,
					this.props.cardTable.getAllRows(material)
				);
				break;
			case '':
				break;
			default:
				break;
		}
	};
	//获取材料肩部信息
	getMaterialTableHead = () => {
		let { button } = this.props;
		let { createButtonApp } = button;
		return (
			<div className="shoulder-definition-area">
				<div
					className="definition-icons"
					style={{
						padding: '0px'
					}}
				>
					{createButtonApp({
						area: 'body-action', //按钮注册中的按钮区域
						onButtonClick: this.onBodyButtonClick.bind(this)
					})}
				</div>
			</div>
		);
	};
	//获取联副产品肩部信息
	getProductTableHead = () => {
		let { button } = this.props;
		let { createButtonApp } = button;
		return (
			<div className="shoulder-definition-area">
				<div
					className="definition-icons"
					style={{
						padding: '0px'
					}}
				>
					{createButtonApp({
						area: 'outputs-action' //按钮注册中的按钮区域
						// onButtonClick: this.onBodyButtonClick.bind(this)
					})}
				</div>
			</div>
		);
	};

	render() {
		const { form, button, DragWidthCom, cardTable, search, base, modal } = this.props;
		const { createButtonApp } = button;
		const { createForm } = form;
		let { createCardTable } = cardTable;
		let { NCCreateSearch } = search;
		let { createModal } = modal;
		/**
         * 树参数
         **/
		let treeConfig = {
			treeId: treeId,
			needEdit: false, //不可编辑
			showLine: true, //显示连线
			needSearch: false, //是否需要搜索框
			onSelectTree: this.onSelectTree, //点击
			selectedForInit: this.selectedForInit
		};
		return (
			<div className="nc-bill-list">
				<div className="nc-bill-header-area">
					<div className="header-title-search-area">
						<h2 className="title-search-detail">
							{this.state.json['10140BOMTM0001']}
						</h2>
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'main-action',
							buttonLimit: 3,
							onButtonClick: this.onButtonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(searchId, {
						showSearchBtn: false,
						showClearBtn: false,
						showAdvBtn: false,
						onAfterEvent: this.afterSearchEvent.bind(this)
					})}
				</div>
				<div className="tree-table">
					<DragWidthCom
						// 左树区域
						leftDom={<BomTree treeConfig={treeConfig} syncTree={this.props.syncTree} />}
						// 右卡片区域
						rightDom={
							<div className="table-area">
								<div className="card-area">
									{createForm(formId, {
										// onBeforeEvent: this.onBeforeEvent.bind(this),
										cancelPSwitch: true
									})}
								</div>
								<div className="nc-bill-table-area">
									{createCardTable(material, {
										tableHead: this.getMaterialTableHead.bind(this),
										// modelSave: this.modelSave.bind(this),
										// onBeforeEvent: this.onStockCardBeforeEvent.bind(this),
										// onAfterEvent: this.onStockCardAfterEvent.bind(this),
										showIndex: true,
										showCheck: false,
										// hideSwitch: () => {
										// 	return false;
										// }
										// onSelected: this.updateCardTableBtnStatus.bind(this),
										// onSelectedAll: this.updateCardTableBtnStatus.bind(this)
									})}
								</div>
								<div className="nc-bill-table-area">
									{createCardTable(product, {
										// tableHead: this.getProductTableHead.bind(this),
										// modelSave: this.modelSave.bind(this),
										// onBeforeEvent: this.onStockCardBeforeEvent.bind(this),
										// onAfterEvent: this.onStockCardAfterEvent.bind(this),
										showIndex: true,
										showCheck: false,
										hideSwitch: () => {
											return false;
										}
										// onSelected: this.updateCardTableBtnStatus.bind(this),
										// onSelectedAll: this.updateCardTableBtnStatus.bind(this)
									})}
								</div>
								<div className="nc-bill-table-area">
									{createCardTable(org, {
										// modelSave: this.modelSave.bind(this),
										// onBeforeEvent: this.onStockCardBeforeEvent.bind(this),
										// onAfterEvent: this.onStockCardAfterEvent.bind(this),
										showIndex: true,
										showCheck: false,
										hideSwitch: () => {
											return false;
										}
										// onSelected: this.updateCardTableBtnStatus.bind(this),
										// onSelectedAll: this.updateCardTableBtnStatus.bind(this)
									})}
								</div>
							</div>
						}
						defLeftWid="20%"
					/>
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
				{
					<PowerTable
						ref="itemcontent"
						show={this.state.showGrand}
						parent={this.state.headitems}
						rows={this.state.items}
						onHide={this.OnHideSun()}
						onConfirm={this.onConfirmSun()}
						grandStatus={this.state.grandStatus}
					/>
				}
				<AssignModal ref={(assignModal) => (this.assignModal = assignModal)} {...this.props} />
			</div>
		);
	}
}
BomTreeList = createPage({})(BomTreeList);
ReactDOM.render(<BomTreeList />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65