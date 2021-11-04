//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 计划委托关系
 * @author zhaopeih
 */
import React, { Component } from 'react';
import { ajax, base, createPage, toast, high, promptBox, cardCache } from 'nc-lightapp-front';
import PrTree from './prtree';
const { NCCheckbox, NCMessage: Message } = base;
const {
	addCache,
	getCacheById,
	updateCache,
	getCurrentLastId,
	getNextId,
	deleteCacheById,
	setDefData,
	getDefData
} = cardCache;

const dataSource = 'mmbd.pr.planrelation.data';
const prStockId = 'prStock';
const prMarBasClassId = 'prMarBasClass';
/****************默认参数  开始***********************/
let urls = {
	loadTreeDataUrl: '/nccloud/mmbd/pr/loadplantree.do',
	queryCardUrl: '/nccloud/mmbd/pr/loadcard.do',
	saveUrl: '/nccloud/mmbd/pr/save.do'
};
/***************默认参数  结束********************/

class PlanRelation extends Component {
	constructor(props) {
		super(props);
		this.config = {
			// title: '计划中心',
			pageCode: '10140PR',
			treeId: 'PrTree',
			urls: urls,
			actions: {
				Edit: 'Edit',
				Refresh: 'Refresh',
				Save: 'Save',
				Cancel: 'Cancel',
				AddLine1: 'AddLineSK',
				AddLine2: 'AddLineMC',
				InsertLine: 'insertLine',
				DelLine: 'DelLine'
			} //表单所有动作
		};
		this.state = {
			selectedTreeid: null,
			checked: false, //判断 显示停用按钮是否选中
			disabledShowOff: false, //复选框可选
			curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
			curOrg: {}, //当前组织
			tree: {
				needEdit: false,
				showLine: false,
				needSearch: false,
				showModal: false
			},
			oldParent: '', //原父节点
			isAdd: false, //新增标志  默认false
			disabledSearch: false, // 搜素框可用
			status: 'browse',
			json: {}
		};
	}
	componentDidMount() {
		let callback = (json, status, inlt) => {
			// this.state.json = json; //多语对象
			this.setState(
				{
					json
				},
				() => {
					//自定义根节点
					this.root = {
						isleaf: false,
						key: '~',
						title: this.state.json['10140pr-0000'],
						id: '~',
						innercode: '~',
						pid: '',
						refname: this.state.json['10140pr-0000'],
						refpk: '~'
					};
					this.initTemplate(this.props, () => {
						this.initData.call(this);
					});
				}
			);
		};
		//加载多语文件
		this.props.MultiInit.getMultiLang({ moduleId: '10140PR', domainName: 'uapbd', callback });
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
	/**
     * 初始化单据模板
     * @param props
     */
	initData() {
		if (!this.state.curOrg || this.state.curOrg == '' || !this.state.curOrg.hasOwnProperty('refpk')) {
			this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData([Object.assign(this.root)]));
			this.props.syncTree.setNodeDisable(this.config.treeId, true);
			this.setPrintButtonStatus(true);
			//禁用
			this.state.disabledShowOff = true;
			this.state.disabledSearch = true;
			this.setState(this.state);
		}
	}
	initTemplate = (props, callback) => {
		const initButtonStatus = (props) => {
			//设置保存、取消按钮不显示
			props.button.setButtonVisible('Save', false);
			props.button.setButtonVisible('Cancel', false);
			//设置按钮不可点击
			this.props.button.setButtonDisabled(
				['Edit', 'Refresh', 'AddLineSK', 'AddLineMC', 'insertLine', 'DelLine'],
				true
			);
		};
		props.createUIDom({ pagecode: this.config.pageCode }, (data) => {
			//页面模板
			if (data.template) {
				let meta = data.template;
				this.modifierMeta(props, meta);
				props.meta.setMeta(meta);
			}
			//按钮
			if (data.button) {
				props.button.setButtons(data.button);
				//初始按钮状态
				initButtonStatus(props);
			}
			//业务单元默认值
			if (data.context) {
				this.state.curOrg = {
					isleaf: false,
					refname: data.context.org_Name,
					refpk: data.context.pk_org
				};
				this.state.disabledShowOff =
					!data.context || data.context == '' || !data.context.hasOwnProperty('pk_org');
				this.setState(this.state, () => {
					this.loadTreeData();
					this.setPrintButtonStatus(true);
					return;
				});
			}
			callback && callback();
		});
	};
	modifierMeta = (props, meta) => {
		let status = props.getUrlParam('status');
		//置表头、表体状态
		meta[prStockId].status = status;
		meta[prMarBasClassId].status = status; //表体状态:浏览态or编辑态

		meta[prStockId].items.forEach(e => {
			if (e.attrcode == 'cstockorgid') {
				e.isMultiSelectedEnabled = true;
				e.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.mmpd.refer.pub.StockOrgRefFilter' };
				};
			}
		})
		meta[prMarBasClassId].items.map((item) => {
			if (item.attrcode == 'pk_marbasclass') {
				// item.isDataPowerEnable = false
				let pk_org = this.state.selectedTreeid;
				item.isMultiSelectedEnabled = true;
				item.queryCondition = () => {
					return { pk_org: pk_org, TreeRefActionExt: 'nccloud.web.mmpd.refer.pub.MarBasClassRefFilter' };
				};
			}
		});
		//添加行操作
		let porCol1 = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['10140pr-0001'] : '10140pr-0001' /* 国际化处理： 操作*/,
			visible: true,
			className: 'table-opr',
			width: 200,
			fixed: 'right',
			render: (text, record, index) => {
				let status = this.props.cardTable.getStatus(prStockId);
				return status === 'edit' ? (
					<div className="currency-opr-col">
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.addRow(prStockId, index);
								e.stopPropagation();
							}}
						>
							{this.state.json ? this.state.json['10140pr-0002'] : '10140pr-0002' /* 国际化处理： 插行*/}
						</span>
						&nbsp;&nbsp;
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.delRowsByIndex(prStockId, index);
								e.stopPropagation();
							}}
						>
							{this.state.json ? this.state.json['10140pr-0003'] : '10140pr-0003' /* 国际化处理： 删行*/}
						</span>
					</div>
				) : (
						<div className="currency-opr-col" />
					);
			}
		};
		let porCol2 = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['10140pr-0001'] : '10140pr-0001' /* 国际化处理： 操作*/,
			visible: true,
			className: 'table-opr',
			width: 200,
			fixed: 'right',
			render: (text, record, index) => {
				let status = this.props.cardTable.getStatus(prMarBasClassId);
				return status === 'edit' ? (
					<div className="currency-opr-col">
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.addRow(prMarBasClassId, index);
								e.stopPropagation();
							}}
						>
							{this.state.json ? this.state.json['10140pr-0002'] : '10140pr-0002' /* 国际化处理： 插行*/}
						</span>
						&nbsp;&nbsp;
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.delRowsByIndex(prMarBasClassId, index);
								e.stopPropagation();
							}}
						>
							{this.state.json ? this.state.json['10140pr-0003'] : '10140pr-0003' /* 国际化处理： 删行*/}
						</span>
					</div>
				) : (
						<div className="currency-opr-col" />
					);
			}
		};
		meta[prStockId].items.push(porCol1);
		meta[prMarBasClassId].items.push(porCol2);



		return meta;
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
	/**
     * 加载树节点数据
     */
	loadTreeData = (callback) => {
		/*****************************************************************
         * 构造请求参数
         * @type {{isShowOff: boolean, pk_curOrg: string}}
         *****************************************************************/
		let requestParam = {
			isShowOff: this.state.checked,
			pk_group: window.parent.GETBUSINESSINFO().groupId,
			usercode: window.parent.GETBUSINESSINFO().userCode
		};
		/*****************************************************************
         * ajax请求 加载树数据
         * @param url:请求树数据url,data: requestParam, success:回调
         *****************************************************************/
		ajax({
			url: this.config.urls.loadTreeDataUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					let data = [Object.assign(this.root, { children: result.data })];
					//同步树  加载全部数据
					this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
					//展开节点  设置默认展开项
					this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
					this.props.syncTree.setNodeDisable(this.config.treeId, false);
					this.setState({ disabledShowOff: false, disabledSearch: false }, () => {
						callback && callback();
					});
				}
			}
		});
	};
	/**
     * 点击树节点
     * @param refpk
     */
	onSelectTree = (refpk) => {
		if (this.checkTreeNodeIsDisabled(this.props.syncTree.getSyncTreeValue(this.config.treeId, refpk))) {
			this.state.selectedTreeid = null;
			return;
		}
		this.setState({ curSelectedNode: this.props.syncTree.getSelectNode(this.config.treeId) });
		/******************************************************
         * 是根节点，返回
         ******************************************************/
		if (refpk == this.root.refpk) {
			//设置按钮不可用
			this.state.selectedTreeid = null;
			this.props.button.setButtonDisabled(['Edit', 'Refresh'], true);
			return;
		}
		this.state.selectedTreeid = refpk;
		this.props.syncTree.setNodeSelected(this.config.treeId, refpk);
		/******************************************************
         * 请求参数
         * @type {{isShowOff: *,primaryKey: *, pk_curOrg: *}}
         ******************************************************/
		let requestParam = {
			isShowOff: this.state.checked,
			primaryKey: refpk,
			pk_curOrg: this.state.curOrg.refpk
		};
		/******************************************************
         * ajax 请求选择的树节点数据
         ******************************************************/
		ajax({
			url: this.config.urls.queryCardUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					let headitem = {
						pk_group: { value: null },
						pk_org: { value: null },
						pk_org_v: { value: null },
						pk_pr: { value: null },
						ts: { value: null },
						relationtype: { value: '1' }
					};
					if (result.data) {
						//设置表单为所选树节点数据
						if (result.data.head) {
							for (let item in result.data.head['prhead'].rows[0].values) {
								headitem[item] = result.data.head['prhead'].rows[0].values[item];
							}
							this.props.form.setFormItemsValue('prhead', headitem);
							//放入缓存
							let pk = result.data.head['prhead'].rows[0].values['pk_pr'].value;
							let cardData = getCacheById(pk, dataSource);
							if (cardData == null) {
								addCache(
									result.data.head['prhead'].rows[0].values['pk_pr'].value,
									result.data,
									'prhead',
									dataSource
								);
							} else {
								updateCache(
									'pk_pr',
									result.data.head['prhead'].rows[0].values['pk_pr'].result,
									result.data,
									'prhead',
									dataSource
								);
							}
						}

						if (result.data.bodys) {
							this.props.cardTable.setTableData(
								prStockId,
								result.data.bodys[prStockId] ? result.data.bodys[prStockId] : { rows: [] }
							);
							this.props.cardTable.setTableData(
								prMarBasClassId,
								result.data.bodys[prMarBasClassId] ? result.data.bodys[prMarBasClassId] : { rows: [] }
							);
							this.props.button.setButtonDisabled(['Refresh'], false);
						} else {
							this.props.cardTable.setTableData(prStockId, { rows: [] });
							this.props.cardTable.setTableData(prMarBasClassId, { rows: [] });
							this.props.button.setButtonDisabled(['Refresh'], true);
						}
					} else {
						headitem['pk_org'].value = this.state.selectedTreeid;
						headitem['pk_group'].value = window.parent.GETBUSINESSINFO().groupId;
						this.props.form.setFormItemsValue('prhead', headitem);
						this.props.cardTable.setTableData(prStockId, { rows: [] });
						this.props.cardTable.setTableData(prMarBasClassId, { rows: [] });
						this.props.button.setButtonDisabled(['Refresh'], true);
					}
					this.props.button.setButtonDisabled(['Edit'], false);
				}
			}
		});
	};
	// 设置按钮状态
	setPrintButtonStatus = (flag) => {
		this.props.button.setButtonDisabled(['start', 'stop'], flag);
	};
	/**
     * 按钮点击状态切换监听事件
     * @param id
     */
	changeButtonStatus = (selectedTreeNode, id) => {
		switch (id) {
			case this.config.actions.Save:
			case this.config.actions.Cancel:
				this.props.button.setButtonVisible('refresh', true);
				this.props.button.setButtonVisible('save', false);
				this.props.button.setButtonVisible('cancel', false);
			default:
				break;
		}
	};
	/**
	 * 按钮点击事件
	 */
	onButtonClick = (props, id) => {
		switch (id) {
			case this.config.actions.Save:
				this.onSaveClick();
				break;
			case this.config.actions.Cancel:
				this.onEditCancelClick(this.sureEditCancel);
				break;
			case this.config.actions.Edit:
				this.onEditClick();
				break;
			case this.config.actions.Refresh:
				this.onRefreshClick();
				break;
			default:
				break;
		}
	};

	onBodyButtonClick = (tableid, props, id) => {
		switch (id) {
			case this.config.actions.AddLine1:
			case this.config.actions.AddLine2:
				this.addLine(tableid);
				break;
			default:
				break;
		}
	};

	onEditClick = () => {
		let planCenterID = this.state.selectedTreeid;
		if (planCenterID == null) {
			return;
		}
		this.props.pushTo('/card', {
			status: 'edit',
			id: this.state.selectedTreeid
		});
		//编辑态计划中心树不可用
		this.props.syncTree.setNodeDisable(this.config.treeId, true);
		this.props.syncTree.setNodeSelected(this.config.treeId, planCenterID);
		this.props.cardTable.setStatus(prStockId, 'edit');
		this.props.cardTable.setStatus(prMarBasClassId, 'edit');
		//设置保存、取消按钮显示、可点击
		this.props.button.setButtonVisible(['Save', 'Cancel'], true);
		this.props.button.setButtonVisible(['Edit', 'Refresh'], false);
		this.props.button.setButtonDisabled(['Save', 'Cancel', 'AddLineSK', 'AddLineMC'], false);
	};

	onEditCancelClick = (callback) => {
		promptBox({
			color: 'warning',
			title: this.state.json['10140pr-0008'] /* 国际化处理： 确认取消*/,
			content: this.state.json['10140pr-0009'] /* 国际化处理： 是否确认要取消?*/,
			beSureBtnClick: () => {
				callback && callback();
			}
		});
	};

	sureEditCancel = () => {
		console.log('sureEditCancel');
		this.props.cardTable.resetTableData(prStockId);
		this.props.cardTable.resetTableData(prMarBasClassId);

		this.props.pushTo('/card', {
			status: 'browse',
			id: this.state.selectedTreeid
		});
		this.props.syncTree.setNodeDisable(this.config.treeId, false);
		this.props.cardTable.setStatus(prStockId, 'browse');
		this.props.cardTable.setStatus(prMarBasClassId, 'browse');
		//设置保存、取消按钮显示、可点击
		this.props.button.setButtonVisible(['Save', 'Cancel'], false);
		this.props.button.setButtonVisible(['Edit', 'Refresh'], true);
		this.props.button.setButtonDisabled(['Save', 'Cancel', 'AddLineSK', 'AddLineMC'], true);
	};

	onRefreshClick = () => {
		let refpk = this.state.selectedTreeid;
		/******************************************************
         * 请求参数
         * @type {{isShowOff: *,primaryKey: *, pk_curOrg: *}}
         ******************************************************/
		let requestParam = {
			isShowOff: this.state.checked,
			primaryKey: refpk,
			pk_curOrg: this.state.curOrg.refpk
		};
		/******************************************************
         * ajax 请求选择的树节点数据
         ******************************************************/
		ajax({
			url: this.config.urls.queryCardUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					if (result.data) {
						//设置表单为所选树节点数据
						if (result.data.head) {
							this.props.form.setAllFormValue({ ['prhead']: result.data.head['prhead'] });
							//放入缓存
							let pk = result.data.head['prhead'].rows[0].values['pk_pr'].value;
							let cardData = getCacheById(pk, dataSource);
							if (cardData == null) {
								addCache(
									result.data.head['prhead'].rows[0].values['pk_pr'].value,
									result.data,
									'prhead',
									dataSource
								);
							} else {
								updateCache(
									'pk_pr',
									result.data.head['prhead'].rows[0].values['pk_pr'].result,
									result.data,
									'prhead',
									dataSource
								);
							}
						}

						if (result.data.bodys) {
							this.props.cardTable.setTableData(
								prStockId,
								result.data.bodys[prStockId] ? result.data.bodys[prStockId] : { rows: [] }
							);
							this.props.cardTable.setTableData(
								prMarBasClassId,
								result.data.bodys[prMarBasClassId] ? result.data.bodys[prMarBasClassId] : { rows: [] }
							);
							this.props.button.setButtonDisabled(['Refresh'], false);
						} else {
							this.props.cardTable.setTableData(prStockId, { rows: [] });
							this.props.cardTable.setTableData(prMarBasClassId, { rows: [] });
							this.props.button.setButtonDisabled(['Refresh'], true);
						}
					} else {
						this.props.form.EmptyAllFormValue('prhead');
						this.props.form.setFormItemsValue('prhead', {
							pk_org: { value: this.state.selectedTreeid, display: '' }
						});
						this.props.cardTable.setTableData(prStockId, { rows: [] });
						this.props.cardTable.setTableData(prMarBasClassId, { rows: [] });
					}
					this.props.button.setButtonDisabled(['Edit'], false);
				}
			}
		});
	};

	addLine = (tableid) => {
		this.props.cardTable.addRow(tableid);
	};

	onStockCardBeforeEvent = (props, moduleId, key, value, changedrows, index, record, status) => {
		// if (key == 'cstockorgid') {
		// 	this.props.meta.getMeta()[prStockId].items.map((item) => {
		// 		if (item.attrcode == 'cstockorgid') {
		// 			// item.isDataPowerEnable = false
		// 			item.isMultiSelectedEnabled = true;
		// 			item.queryCondition = () => {
		// 				return { GridRefActionExt: 'nccloud.web.mmpd.refer.pub.StockOrgRefFilter' };
		// 			};
		// 		}
		// 	});
		// }
		return true;
	};

	onStockCardAfterEvent = (props, moduleId, key, value, changedrows, index, record, status) => {
		if (key == 'cstockorgid') {
			let rowitem = {};
			this.props.meta.getMeta()[prStockId].items.map((item) => {
				if (item.attrcode != 'pk_pr_stockorg') {
					rowitem[item.attrcode] = { value: '', display: '' };
				}
			});
			if (changedrows.length > 1) {
				for (let i = 0; i < changedrows.length - 1; i++) {
					this.props.cardTable.addRow(prStockId, index);
				}
			}
			let i = 0;
			changedrows.map((item) => {
				if (item.newvalue.value != item.oldvalue.value) {
					this.props.cardTable.setValByKeysAndIndex(prStockId, index + i, rowitem);
				}
				i++;
			});
			if (value.length > 0) {
				let k = 0;
				changedrows.map((item) => {
					this.props.cardTable.setValByKeyAndIndex(prStockId, index + k, 'cstockorgid', {
						value: value[k].refpk,
						display: value[k].refcode
					});
					this.props.cardTable.setValByKeyAndIndex(prStockId, index + k, 'cstockorgid.name', {
						value: value[k].refname,
						display: value[k].refname
					});
					k++;
				});
			}
		}
	};

	onMarBasClassCardBeforeEvent = (props, moduleId, key, value, changedrows, index, record, status) => {
		// if (key == 'pk_marbasclass') {
		// 	this.props.meta.getMeta()[prMarBasClassId].items.map((item) => {
		// 		if (item.attrcode == 'pk_marbasclass') {
		// 			// item.isDataPowerEnable = false
		// 			let pk_org = this.state.selectedTreeid;
		// 			item.isMultiSelectedEnabled = true;
		// 			item.queryCondition = () => {
		// 				return { pk_org: pk_org, TreeRefActionExt: 'nccloud.web.mmpd.refer.pub.MarBasClassRefFilter' };
		// 			};
		// 		}
		// 	});
		// }
		return true;
	};

	onMarBasClassCardAfterEvent = (props, moduleId, key, value, changedrows, index, record, status) => {
		if (key == 'pk_marbasclass') {
			let rowitem = {};
			this.props.meta.getMeta()[prMarBasClassId].items.map((item) => {
				if (item.attrcode != 'pk_pr_marbasclass') {
					rowitem[item.attrcode] = { value: '', display: '' };
				}
			});
			if (changedrows.length > 1) {
				for (let i = 0; i < changedrows.length - 1; i++) {
					this.props.cardTable.addRow(prMarBasClassId, index);
				}
			}
			let i = 0;
			changedrows.map((item) => {
				if (item.newvalue.value != item.oldvalue.value) {
					this.props.cardTable.setValByKeysAndIndex(prMarBasClassId, index + i, rowitem);
				}
				i++;
			});
			if (value.length > 0) {
				let k = 0;
				changedrows.map((item) => {
					this.props.cardTable.setValByKeyAndIndex(prMarBasClassId, index + k, 'pk_marbasclass', {
						value: value[k].refpk,
						display: value[k].refcode
					});
					this.props.cardTable.setValByKeyAndIndex(prMarBasClassId, index + k, 'pk_marbasclass.name', {
						value: value[k].refname,
						display: value[k].refname
					});
					k++;
				});
			}
		}
	};

	onSaveClick = () => {
		// 空行过滤
		this.props.cardTable.filterEmptyRows(prStockId, ['cstockorgid']);
		this.props.cardTable.filterEmptyRows(prMarBasClassId, ['pk_marbasclass']);
		let prStockrows = this.props.cardTable.getAllRows(prStockId);
		let stockrowcount = 0;
		prStockrows.map((row) => {
			if (row.status != 3) {
				stockrowcount = stockrowcount + 1;
			}
		});
		let prMarBasClassrows = this.props.cardTable.getAllRows(prMarBasClassId);
		let mcrowcount = 0;
		prMarBasClassrows.map((row) => {
			if (row.status != 3) {
				mcrowcount = mcrowcount + 1;
			}
		});

		if ((stockrowcount == 0 && mcrowcount > 0) || (mcrowcount == 0 && stockrowcount > 0)) {
			toast({ content: this.state.json['10140pr-0011'], color: 'warning' }); //validate 验证未通过
			return;
		}
		let CardData = this.props.createExtCardData('10140PR', 'prhead', [prStockId, prMarBasClassId]);
		ajax({
			url: urls.saveUrl,
			data: CardData,
			success: (res) => {
				let pk_value = null;
				if (res.success) {
					if (res.data) {
						pk_value = res.data.head['prhead'].rows[0].values['pk_pr'].value;
						let pk_org = res.data.head['prhead'].rows[0].values['pk_org'].value;
						this.props.pushTo('/card', {
							status: 'browse',
							id: this.state.selectedTreeid
						});
						this.props.syncTree.setNodeDisable(this.config.treeId, false);
						this.props.form.setFormStatus('prhead', 'browse');
						this.props.cardTable.setStatus(prStockId, 'browse');
						this.props.cardTable.setStatus(prMarBasClassId, 'browse');
						//设置保存、取消按钮显示、可点击
						this.props.button.setButtonVisible(['Save', 'Cancel'], false);
						this.props.button.setButtonVisible(['Edit', 'Refresh'], true);
						this.props.button.setButtonDisabled(['Save', 'Cancel', 'AddLineSK', 'AddLineMC'], true);
						this.onRefreshClick();
					}

					toast({ content: this.state.json['10140pr-0012'], color: 'success' }); /* 国际化处理： 保存成功*/
				}
			}
		});
	};

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
	checkTreeNodeIsDisabled(node) {
		return !!node.disabled;
	}
	outAfterEvent() { }
	//获取列表肩部信息
	getTableHead1 = (tableId) => {
		let { button } = this.props;
		let { createButtonApp } = button;
		let buttons = this.props.button.getButtons();
		let status = this.props.getUrlParam('status');
		return (
			<div className="shoulder-definition-area">
				<div
					className="definition-icons"
					style={{
						padding: '0px'
					}}
				>
					{createButtonApp({
						area: 'table-sk-action', //按钮注册中的按钮区域
						onButtonClick: this.onBodyButtonClick.bind(this, tableId)
					})}
				</div>
			</div>
		);
	};

	getTableHead2 = (tableId) => {
		let { button } = this.props;
		let { createButtonApp } = button;
		let buttons = this.props.button.getButtons();
		let status = this.props.getUrlParam('status');
		return (
			<div className="shoulder-definition-area">
				<div
					className="definition-icons"
					style={{
						padding: '0px'
					}}
				>
					{createButtonApp({
						area: 'table-mc-action', //按钮注册中的按钮区域
						onButtonClick: this.onBodyButtonClick.bind(this, tableId)
					})}
				</div>
			</div>
		);
	};

	render() {
		const { button, ncmodal, DragWidthCom, cardTable } = this.props;
		let { createCardTable } = cardTable;
		const { createButtonApp } = button;
		let { createModal } = ncmodal; //模态框
		/**
         * 树参数
         **/
		let treeConfig = {
			treeId: this.config.treeId,
			needEdit: this.state.tree.needEdit,
			showLine: this.state.tree.showLine, //显示连线
			needSearch: this.state.tree.needSearch, //是否需要搜索框
			onSelectTree: this.onSelectTree, //选择
			disabledSearch: this.state.disabledSearch
		};
		return (
			<div className="nc-bill-list">
				{createModal('modal', {
					noFooter: false,
					leftBtnName: this.state.json['10140pr-0010'] //右侧按钮名称， 默认确认/* 国际化处理： 确定*/
				})}
				{/* 头部 header*/}
				<div className="nc-bill-header-area">
					{/* 标题 title*/}
					<div className="header-title-search-area">
						<h2 className="title-search-detail">
							{this.state.json ? this.state.json['10140pr-0013'] : '10140pr-0013'}
						</h2>
					</div>
					{/* 按钮组 btn-group*/}
					<div className="header-button-area">
						{createButtonApp({
							area: 'main-action',
							buttonLimit: 3,
							onButtonClick: this.onButtonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				{/* 树卡区域 */}
				<div className="tree-table">
					<DragWidthCom
						// 左树区域
						leftDom={
							<PrTree
								treeConfig={treeConfig}
								syncTree={this.props.syncTree}
								ref={(NCCHRTree) => (this.NCCHRTree = NCCHRTree)}
							/>
						}
						// 右表区域 table-area
						rightDom={
							<div className="table-area">
								<div className="nc-bill-table-area">
									{createCardTable(prStockId, {
										tableHead: this.getTableHead1.bind(this, prStockId),
										onBeforeEvent: this.onStockCardBeforeEvent.bind(this),
										onAfterEvent: this.onStockCardAfterEvent.bind(this),
										showIndex: true,
										showCheck: true,
										hideSwitch: () => {
											return false;
										}
									})}
								</div>
								<div className="nc-bill-table-area">
									{createCardTable(prMarBasClassId, {
										tableHead: this.getTableHead2.bind(this, prMarBasClassId),
										onBeforeEvent: this.onMarBasClassCardBeforeEvent.bind(this),
										onAfterEvent: this.onMarBasClassCardAfterEvent.bind(this),
										showIndex: true,
										showCheck: true,
										hideSwitch: () => {
											return false;
										}
									})}
								</div>
							</div>
						}
						// 默认左侧区域宽度，px/百分百
						defLeftWid="20%"
					/>
				</div>
			</div>
		);
	}
}

PlanRelation = createPage({})(PlanRelation);
ReactDOM.render(<PlanRelation />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65