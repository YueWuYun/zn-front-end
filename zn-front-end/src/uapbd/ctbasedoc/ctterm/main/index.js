//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {
	createPage,
	base,
	ajax,
	NCCreateSearch,
	toast,
	promptBox,
	cardCache,
	getMultiLang,
	print,
	high,
	cacheTools,
	createPageIcon
} from 'nc-lightapp-front';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
//import Wanglqh from '../../../refer/supplier/CustSupplierFlexGridTreeRef'
import './index.less';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';
let { setDefData, getDefData } = cardCache;
const { NCMenu, NCDropdown, NCCheckbox, NCPopconfirm, NCCol, NCRow, NCButton, NCTooltip } = base;
const { NCMenuGroup } = NCMenu;
const { Item } = NCMenu;
const { PrintOutput } = high;

/****************默认参数  开始***********************/
let formId = 'head'; //卡片组件Id
let cardfromId = 'card'; //卡片组件Id
let memberModalId = 'memberModal'; //成员--编辑模态窗id
const urls = {
	loadTreeDataUrl: '/nccloud/uapbd/ctterm/loadtreedata.do',
	queryTemplet: '/nccloud/platform/templet/querypage.do',
	addcttermUrl: '/nccloud/uapbd/ctterm/addctterm.do',
	queryCardUrl: '/nccloud/uapbd/ctterm/querycard.do',
	savetermUrl: '/nccloud/uapbd/ctterm/saveterm.do',
	savetermtypeUrl: '/nccloud/uapbd/ctterm/savetermtype.do',
	deleteTermUrl: '/nccloud/uapbd/ctterm/delterm.do',
	deleteTermtypeUrl: '/nccloud/uapbd/ctterm/deltermtype.do',
	printUrl: '/nccloud/uapbd/ctterm/printurl.do',
	sysQueryByPkUrl: '/nccloud/uapbd/ctterm/sysquerybypk.do'
};
let pageCode = '10140Z00_termset'; //默认集团
/***************默认参数  结束********************/
const { EmptyAreaTip } = base;
/**
 * 合同条款定义
 */
class CustsaleClass extends Component {
	constructor(props) {
		super(props);
		//显示停用复选框的状态标志
		this.state = {
			pks: [],
			disabledSearch: false,
			disabledOrgunit: false,
			checked: false, //判断 显示停用按钮是否选中
			curOrg: '', //合同条款定义-组织节点，选中的组织主键
			json: null,
			cardEmpty: true,
			curSelectedNode: null //直接点击树节点操作按钮时 用于记录selectedNode
		};

		this.config = Object.assign(
			{
				title: '', //this.state.json['10140Z00-000000'],/* 国际化处理： 合同条款定义*/
				treeId: 'cttermTree',
				formId: formId,
				cardfromId: cardfromId,
				pageCode: pageCode,
				nodeType: 'GROUP_NODE',
				urls: urls
			},
			props.config
		);

		//自定义根节点
		this.root = {
			isleaf: false,
			key: '~',
			title: '',
			id: '~',
			innercode: '~',
			pid: '',
			refname: '',
			refpk: '~'
		};

		//主动事件，绑定this指针
		this.initTemplate = this.initTemplate.bind(this);
		this.initButtonStatus = this.initButtonStatus.bind(this);
		this.changeButtonStatus = this.changeButtonStatus.bind(this);
		this.onStartEps = this.onStartEps.bind(this);
		this.onStopEps = this.onStopEps.bind(this);
		this.dealTreeData = this.dealTreeData.bind(this);
		this.onSaveCtterm = this.onSaveCtterm.bind(this);
		this.onDeleteCtterm = this.onDeleteCtterm.bind(this);

		this.initTemplate(props);
	}

	//初始化单据模板
	initTemplate = (props, callback) => {
		let that = this;
		createUIDom(props)(
			{
				pagecode: props.config.pageCode //页面id
				// appcode:props.config.appcode//注册按钮的id
			},
			{
				moduleId: '10140Z00',
				domainName: 'uapbd'
			},
			(data, langData) => {
				//(data, langData)
				if (langData) {
					this.state.json = langData;
					that.root.title = this.state.json['10140Z00-000000']; //this.state.json['10140CSCLG-000000'],/* 国际化处理： 合同条款定义*/
					that.root.refname = this.state.json['10140Z00-000000']; //this.state.json['10140CSCLG-000000'],/* 国际化处理： 合同条款定义*/
					if (props.config.nodeType == 'GROUP_NODE') {
						props.config.title = this.state.json['10140Z00-000032']; //this.state.json['10140Z00-000000'],/* 国际化处理： 合同条款定义*/
					} else {
						props.config.title = this.state.json['10140Z00-000033']; //this.state.json['10140Z00-000000'],/* 国际化处理： 合同条款定义*/
					}
				}
				if (data) {
					//默认业务单元赋值
					let ccontext = data.context || {};
					that.state.curOrg = {
						refpk: ccontext.pk_org,
						refname: ccontext.org_Name,
						display: ccontext.org_Name,
						values: { refpk: ccontext.pk_org, refname: ccontext.org_Name }
					};
					if (data.template) {
						let meta = data.template;
						props.meta.setMeta(meta);
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
					}
					that.onRefresh();
					callback && callback();
				}
			}
		);
	};

	/**
     * 处理树数据
     * @param data
     * @returns {*}
     */
	dealTreeData(data) {
		//为了打印左边所有树节点
		let allpks = [];
		let deleteDataChildrenProp = function(node) {
			if (!('~' == node.refpk || node.refpk == undefined) && node.nodeData.isTermType) {
				allpks.push(node.refpk);
			}
			node.iconBox = {
				delIcon: true,
				editIcon: true,
				addIcon: true
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
			e.iconBox = {
				delIcon: true,
				editIcon: true,
				addIcon: true
			};
			deleteDataChildrenProp(e);
		});
		setDefData('allpks', this.props.config.datasource, allpks);
		// cacheTools.set('allpks',allpks);
		return data;
	}

	componentDidUpdate() {
		//form如果是编辑态，关闭浏览器需要给你提示
		let formstatus = this.props.form.getFormStatus(this.config.formId);

		let cardfromtatus = this.props.form.getFormStatus(this.config.cardfromId);

		if (
			(formstatus == undefined || formstatus == 'browse') &&
			(cardfromtatus == 'browse' || cardfromtatus == undefined)
		) {
			window.onbeforeunload = null;
		} else {
			window.onbeforeunload = () => {
				//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}

	// componentWillMount() {
	// 	let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
	//    		this.setState({json})       // 保存json和inlt到页面state中并刷新页面
	// 	}
	// 	getMultiLang({moduleId: '10140Z00',domainName: 'uapbd',callback})
	// }
	/**
     * react 生命周期函数 组件渲染完后触发事件
     */
	componentDidMount() {
		//组织节点，刚进去不加载数据
		// if(this.config.nodeType==='GROUP_NODE'){
		//     this.onRefresh();
		// }

		//修改按钮状态
		this.initButtonStatus();
	}

	onRefresh() {
		/**************
         * 构造请求参数
         * @type {{checked: boolean}}
         *************/
		let that = this;
		let requestParam = {
			checked: that.state.checked,
			pkorg: that.state.curOrg.refpk
		};
		let data = [];
		/*************
         * ajax请求 加载树数据
         *************/
		ajax({
			url: that.config.urls.loadTreeDataUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					that.root.title = this.state.json['10140Z00-000000']; //this.state.json['10140CSCLG-000000'],/* 国际化处理： 合同条款定义*/
					that.root.refname = this.state.json['10140Z00-000000']; //this.state.json['10140CSCLG-000000'],/* 国际化处理： 合同条款定义*/

					if (that.config.nodeType === 'ORG_NODE' && !that.state.curOrg) {
						data = [ { ...that.root } ];
					} else {
						data = [ Object.assign({ ...that.root }, { children: result.data }) ];
					}
					let defaultSelectNode = '';
					if (data[0].children) {
						defaultSelectNode = data[0].children[0].key;
					}

					//同步树  加载全部数据
					that.props.syncTree.setSyncTreeData(that.config.treeId, that.dealTreeData(data));
					//展开节点  设置默认展开项
					that.props.syncTree.openNodeByPk(that.config.treeId, that.root.refpk);
					if (defaultSelectNode) {
						this.setState({ cardEmpty: false });
						//this.onSelectTree(defaultSelectNode);
						this.changeButtonStatus('select');
						this.props.syncTree.setNodeSelected(this.config.treeId, defaultSelectNode);
					} else {
						this.setState({ cardEmpty: true });
					}
					if (getDefData('ctterm_btnopr', that.props.config.datasource) == 'refresh') {
						this.changeButtonStatus('select');
						toast({ title: this.state.json['10140Z00-000001'], color: 'success' }); /* 国际化处理： 刷新成功！*/
					}
				}
			}
		});
	}

	refreshForDel() {
		/**************
         * 构造请求参数
         * @type {{checked: boolean}}
         *************/
		let that = this;
		let requestParam = {
			checked: that.state.checked,
			pkorg: that.state.curOrg.refpk
		};
		let data = [];
		/*************
         * ajax请求 加载树数据
         *************/
		ajax({
			url: that.config.urls.loadTreeDataUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					that.root.title = this.state.json['10140Z00-000000']; //this.state.json['10140CSCLG-000000'],/* 国际化处理： 合同条款定义*/
					that.root.refname = this.state.json['10140Z00-000000']; //this.state.json['10140CSCLG-000000'],/* 国际化处理： 合同条款定义*/

					if (that.config.nodeType === 'ORG_NODE' && !that.state.curOrg) {
						data = [ { ...that.root } ];
					} else {
						data = [ Object.assign({ ...that.root }, { children: result.data }) ];
					}
					let defaultSelectNode = '';
					if (data[0].children) {
						defaultSelectNode = data[0].children[0].key;
					}

					//同步树  加载全部数据
					that.props.syncTree.setSyncTreeData(that.config.treeId, that.dealTreeData(data));
					//展开节点  设置默认展开项
					that.props.syncTree.openNodeByPk(that.config.treeId, that.root.refpk);
					if (defaultSelectNode) {
						this.setState({ cardEmpty: false });
						//this.onSelectTree(defaultSelectNode);
						this.props.syncTree.setNodeSelected(this.config.treeId, defaultSelectNode);
						this.changeButtonStatus('select');
					} else {
						this.setState({ cardEmpty: true });
					}
				}
			}
		});
	}

	/**
     * 页面初始设置button状态
     * @param props
     */
	initButtonStatus() {
		//设置保存按钮不显示
		this.props.button.setButtonVisible('add', false);
		this.props.button.setButtonVisible('edit', false);
		this.props.button.setButtonVisible('save', false);
		this.props.button.setButtonVisible('saveadd', false);
		this.props.button.setButtonVisible('cancel', false);
		this.props.button.setButtonVisible('delete', false);
		this.props.button.setButtonVisible('printpage', false);
	}

	/**
     * 点击树节点
     * @param refpk
     */
	onSelectTree(refpk) {
		let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);
		//编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
		let status = this.props.form.getFormStatus(this.config.formId);
		let istermType = this.props.syncTree.getSelectNode(this.config.treeId);
		if (refpk == this.root.refpk) {
			//清空表单
			this.props.form.EmptyAllFormValue(this.config.formId);
			this.changeButtonStatus('selectroot');
			return;
		}
		//选中树节点的时候如果是编辑态或者是选中的是合同条款类型，就不往卡片回写数据
		if (istermType != null && istermType.nodeData != null) {
			if (status == 'edit' || istermType.nodeData.isTermType) {
				//清空表单
				this.props.form.EmptyAllFormValue(this.config.formId);
				this.changeButtonStatus('select');
				return;
			}
		} else {
			//清空表单
			this.props.form.EmptyAllFormValue(this.config.formId);
			this.changeButtonStatus('select');
			return;
		}

		/********************************
         * ajax 请求选择的树节点数据
         ********************************/
		ajax({
			url: this.config.urls.queryCardUrl,
			data: { pk_ct_termset: refpk, isGlbGrp: this.config.isGlbGrp },
			success: (result) => {
				if (result.success) {
					//查询时执行显示公式前端适配
					if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
						props.dealFormulamsg(
							result.formulamsg, //参数一：返回的公式对象
							{
								//参数二：界面使用的表格类型
								[this.config.formId]: 'form',
								[this.config.cardfromId]: 'form'
							}
						);
					}

					//表单数据
					let headData = result.data.head.rows[0].values;
					if (headData.hasOwnProperty('enablestate')) {
						let enablestateValue = headData.enablestate.value;
						//根据表单项enablestate的值修改开关状态
						if (enablestateValue == '2') {
							result.data.head.rows[0].values.enablestate.value = true;
						} else {
							result.data.head.rows[0].values.enablestate.value = false;
						}
					}

					if (headData.pk_ct_termtype.display == this.root.refpk) {
						result.data.head.rows[0].values.pk_ct_termtype.display = '';
						result.data.head.rows[0].values.pk_ct_termtype.value = '';
					}
					//清空表单
					this.props.form.EmptyAllFormValue(this.config.formId);
					//设置表单为所选树节点数据
					this.props.form.setAllFormValue({ head: result.data.head });

					this.changeButtonStatus('cancel');
					//设置表单项enablestate可用
					// this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
				}
			}
		});
	}

	/**
     * 表单编辑事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
	onAfterFormEvent(props, moduleId, key, value, index) {
		switch (key) {
			case 'enablestate':
				//获得选中节点
				let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);

				if (!selectedTreeNode) {
					let content = value.value
						? this.state.json['10140Z00-000002']
						: this.state.json['10140Z00-000003']; /* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
					toast({ content: content, color: 'warning' }); //默认top
					return;
				}
				let requestParam = { pk_custsaleclass: selectedTreeNode.refpk, enablestate: value.value ? '2' : '1' };

				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140Z00-000004'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
					noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					hasCloseBtn: false,
					content: value.value
						? this.state.json['10140Z00-000005']
						: this.state.json['10140Z00-000006'] /* 国际化处理： 确认启用该数据？,确认停用该数据？*/,
					beSureBtnClick: () => {
						ajax({
							url: this.config.urls.enablestateUrl,
							data: requestParam,
							success: (result) => {
								/****
                                 * 启用停用，只是启用停用 与树节点的显示隐藏没有关系
                                 * 想根据启用状态显示或隐藏树节点，需要通过更改显示停用check框来实现
                                 */
								toast({
									title: value.value
										? this.state.json['10140Z00-000007']
										: this.state.json['10140Z00-000008'],
									color: 'success'
								}); /* 国际化处理： 启用成功！,停用成功！,提示*/
							}
						});
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(this.config.formId, { enablestate: true });
						return;
					}
				});
				break;
			default:
				break;
		}
		//some code
	}

	/**
     * 新增
     */
	onAddCttermtype(selectNode) {
		if (selectNode.refpk != '~' && !selectNode.nodeData) {
			toast({ content: this.state.json['10140Z00-000010'], color: 'warning' }); //默认top/* 国际化处理： 合同条款上不能新增合同条款类型！*/
			return;
		}
		if (this.config.nodeType === 'ORG_NODE' && !this.state.curOrg.refpk) {
			toast({ content: this.state.json['10140Z00-000011'], color: 'warning' }); //默认top/* 国际化处理： 请选择业务单元*/
			return;
		}
		this.openSysModal('add');
	}

	/**
     * 新增
     */
	onAddCtterm() {
		let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

		if (this.config.nodeType === 'ORG_NODE' && !this.state.curOrg.refpk) {
			toast({ content: this.state.json['10140Z00-000011'], color: 'warning' }); //默认top/* 国际化处理： 请选择业务单元*/
			return;
		}

		if (!selectNode) {
			toast({ content: this.state.json['10140Z00-000012'], color: 'warning' }); //默认top/* 国际化处理： 请选中需要编辑的节点*/
			return;
		}

		this.setState({ curSelectedNode: selectNode });
		let requestParam = {}; //请求参数对象
		requestParam['pkorg'] = this.state.curOrg.refpk;
		if (selectNode.nodeData.isTermType) {
			//存在选中节点，设置父节点pk为选中节点refpk
			requestParam['pk_ct_termtype'] = selectNode.refpk;
		} else {
			//不存在选中节点，设置父节点为根节点refpk
			requestParam['pk_ct_termtype'] = selectNode.pid;
		}

		ajax({
			url: this.config.urls.addcttermUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					//清空表单数据
					this.props.form.EmptyAllFormValue(this.config.formId);
					//设置表单为编辑态
					this.props.form.setFormStatus(this.config.formId, 'add');
					//设置新增默认值
					Utils.filterEmptyData(result.data.head.rows[0].values);
					this.props.form.setAllFormValue({ head: result.data.head });
					//设置表单项不可用
					this.props.syncTree.setNodeDisable(this.config.treeId, true); //编辑时设置整棵树不可用
					//设置左树上搜索按钮不可用
					this.setState({
						disabledSearch: true,
						disabledOrgunit: true
					});
					this.changeButtonStatus('add');
				}
			}
		});
	}

	/**
     * 编辑
     */
	onEditCttermtype(selectedTreeNode) {
		if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup) {
			toast({ content: this.state.json['10140Z00-000013'], color: 'warning' }); //默认top/* 国际化处理： 业务单元不能操作集团级数据*/
			return;
		}
		if (!selectedTreeNode.nodeData.isTermType) {
			toast({ content: this.state.json['10140Z00-000014'], color: 'warning' }); //默认top/* 国际化处理： 树上不能编辑合同条款！*/
			return;
		}
		this.openSysModal(selectedTreeNode.id);
	}

	/**
     * 编辑
     */
	onEditCtterm() {
		let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
		if (!selectedTreeNode) {
			toast({ content: this.state.json['10140Z00-000012'], color: 'warning' }); //默认top/* 国际化处理： 请选中需要编辑的节点*/
			return;
		}
		this.setState({ curSelectedNode: selectedTreeNode });
		/**************************************************
         *
         * 编辑：
         *      1、构造请求参数
         *      2、ajax请求，后台查询需要编辑的对象
         *      3、回调，设置表单数据为编辑的对象
         *
         * 编辑状态下：
         *      只有 保存  取消 按钮 显示
         *
         *
         **************************************************/
		/****选中的如果是条款类型节点，则提示不让修改***/

		if (selectedTreeNode.nodeData.isTermType) {
			toast({ content: this.state.json['10140Z00-000015'], color: 'warning' }); //默认top/* 国际化处理： 请选中合同条款节点(叶子节点)*/
			return;
		}

		if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup) {
			toast({ content: this.state.json['10140Z00-000013'], color: 'warning' }); //默认top/* 国际化处理： 业务单元不能操作集团级数据*/
			return;
		}

		/***ajax请求***/
		ajax({
			url: this.config.urls.queryCardUrl,
			data: { pk_ct_termset: selectedTreeNode.refpk },
			success: (result) => {
				if (result.success) {
					//查询时执行显示公式前端适配
					if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
						props.dealFormulamsg(
							result.formulamsg, //参数一：返回的公式对象
							{
								//参数二：界面使用的表格类型
								[this.config.formId]: 'form',
								[this.config.cardfromId]: 'form'
							}
						);
					}

					this.props.syncTree.setNodeDisable(this.config.treeId, true); //编辑时设置整棵树不可用
					//设置表单数据
					this.props.form.setAllFormValue({ head: result.data.head });
					//  this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});//设置表单项不可用
					//设置表单状态为编辑态
					this.props.form.setFormStatus(this.config.formId, 'edit');
					//设置左树上搜索按钮不可用
					this.setState({
						disabledSearch: true,
						disabledOrgunit: true
					});
					this.changeButtonStatus('edit');
				}
			}
		});
	}

	//体系编辑窗口
	openSysModal(pk) {
		// this.props.form.EmptyAllFormValue(cardfromId);
		//请求参数对象
		let requestParam = {
			pk_ct_termtype: pk,
			pkorg: this.state.curOrg.refpk
		};
		ajax({
			url: this.config.urls.sysQueryByPkUrl,
			method: 'post',
			data: requestParam,
			success: (res) => {
				if (res.success) {
					//弹出体系编辑窗口
					this.props.modal.show('treeedit', { title: this.state.json['10140Z00-000029'] });
					this.props.form.EmptyAllFormValue(cardfromId);
					if (pk == 'add') {
						this.props.form.setFormStatus(cardfromId, 'add');
					} else {
						this.props.form.setFormStatus(cardfromId, 'edit');
					}
					//this.props.form.setFormStatus(this.config.cardfromId, 'edit');
					//设置新增默认值
					Utils.filterEmptyData(res.data.card.rows[0].values);
					this.props.form.setAllFormValue({ card: res.data.card });
				}
			}
		});
	}

	/**
     * 保存
     */
	onSaveCtterm() {
		//必填项校验
		let memberFlag = this.props.form.isCheckNow(this.config.formId);
		if (!memberFlag) {
			return;
		}

		let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得选中节点
		if (!selectedTreeNode) {
			selectedTreeNode = this.state.curSelectedNode;
		}
		if (!selectedTreeNode) {
			alert(this.state.json['10140Z00-000016']); /* 国际化处理： 请选中节点*/
			return;
		}
		let requestParam = {};
		/**************************************************
         *
         * 保存：
         *     1、获取表单对象
         *     2、构造请求参数模型
         *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
         *     4、回调，刷新当前树节点的父节点
         *
         * 保存状态下：
         *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
         *
         **************************************************/
		let formData; //= this.props.form.getAllFormValue(this.config.formId);//获得表单信息
		let urlchanage;
		var pk = null;
		formData = this.props.form.getAllFormValue(this.config.formId); //获得表单信息
		if (formData.rows[0].values.hasOwnProperty('pk_ct_termset')) {
			pk = formData.rows[0].values.pk_ct_termset.value; //当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
			formData.areacode = this.config.formId; //添加表单的areacode编码
		}
		/***设置请求参数***/
		formData.rows['status'] = '2'; //设置状态
		requestParam = {
			model: formData,
			pageid: this.config.pageCode //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
			//pcode: selectedTreeNode.nodeData.pcode
		};

		/****判断刷新父节点，还是刷新选中节点****/
		/************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/

		let nonPk = false; //没有主键  false时就是有主键  即编辑 即刷新父节点
		if (pk == null || pk == '') {
			nonPk = true; // true时 就是无主键 即 新增  即刷新当前节点
		}

		//校验公式
		this.props.validateToSave(
			requestParam,
			() => {
				//ajax请求
				ajax({
					url: this.config.urls.savetermUrl,
					data: requestParam,
					success: (result) => {
						if (result.success) {
							//设置表单浏览态
							this.props.form.setFormStatus(this.config.formId, 'browse');
							//设置树可用
							this.props.syncTree.setNodeDisable(this.config.treeId, false);
							if (!result.data.treenode[0].children || result.data.treenode[0].children.length == 0) {
								delete result.data.treenode[0].children;
							}
							if (nonPk) {
								//新增回调后添加
								this.props.syncTree.addNodeSuccess(this.config.treeId, result.data.treenode);
							} else {
								//修改回调后修改
								this.props.syncTree.editNodeSuccess(this.config.treeId, result.data.treenode[0]);
							}
							//表单数据
							let headData = result.data.head.head.rows[0].values;
							if (headData.hasOwnProperty('enablestate')) {
								let enablestateValue = headData.enablestate.value;
								//根据表单项enablestate的值修改开关状态
								if (enablestateValue == '2') {
									headData.enablestate.value = true;
								} else {
									headData.enablestate.value = false;
								}
							}

							//清空表单
							this.props.form.EmptyAllFormValue(this.config.formId);
							//设置表单为所选树节点数据
							this.props.form.setAllFormValue({ head: result.data.head.head });

							//展开树节点
							this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treenode[0].pid);

							this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treenode[0].refpk);
							//设置表单项可用

							//清空自定已选中项
							this.setState({ curSelectedNode: null, disabledSearch: false, disabledOrgunit: false });
							toast({ title: this.state.json['10140Z00-000017'], color: 'success' }); /* 国际化处理： 保存成功！,提示*/
							this.changeButtonStatus('save');
						}
					}
				});
			},
			{ head: 'form' },
			'form'
		);
	}

	/**
     * 保存
     */
	onSaveCttermtype() {
		//必填项校验
		let memberFlag = this.props.form.isCheckNow(this.config.cardfromId);
		if (!memberFlag) {
			this.props.modal.show('treeedit', { title: this.state.json['10140Z00-000029'] });
			return;
		}

		let requestParam = {};
		/**************************************************
         *
         * 保存：
         *     1、获取表单对象
         *     2、构造请求参数模型
         *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
         *     4、回调，刷新当前树节点的父节点
         *
         * 保存状态下：
         *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
         *
         **************************************************/
		let formData; //= this.props.form.getAllFormValue(this.config.formId);//获得表单信息
		let urlchanage;
		var pk = null;
		formData = this.props.form.getAllFormValue(this.config.cardfromId); //获得表单信息
		if (formData.rows[0].values.hasOwnProperty('pk_ct_termtype')) {
			pk = formData.rows[0].values.pk_ct_termtype.value; //当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
			formData.areacode = this.config.cardfromId; //添加表单的areacode编码
		}
		if (this.state.curOrg.refpk) {
			formData.rows[0].values.pk_org = { value: this.state.curOrg.refpk, display: '' };
		}
		/***设置请求参数***/
		formData.rows['status'] = '2'; //设置状态
		requestParam = {
			model: formData,
			pageid: this.config.pageCode //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
			//pcode: selectedTreeNode.nodeData.pcode
		};

		/****判断刷新父节点，还是刷新选中节点****/
		/************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
		let nonPk = false; //没有主键  false时就是有主键  即编辑 即刷新父节点
		if (pk == null || pk == '') {
			nonPk = true; // true时 就是无主键 即 新增  即刷新当前节点
		}
		/**
         * 设置pk_org 和pk_group jira问题：NCCLOUD-154685

         */
		let ccontext = formData.context || {};
		if (this.config.nodeType === 'ORG_NODE') {
			formData.pk_org = ccontext.pk_org;
			formData.pk_group = ccontext.pk_group;
		} else if (this.config.nodeType === 'GROUP') {
			formData.pk_group = ccontext.pk_group;
			formData.pk_org = ccontext.pk_group;
		}

		//ajax请求
		ajax({
			url: this.config.urls.savetermtypeUrl,
			data: requestParam,
			success: (result) => {
				if (result.success && result.data) {
					//设置表单浏览态
					this.props.form.setFormStatus(this.config.formId, 'browse');
					//设置树可用
					this.props.syncTree.setNodeDisable(this.config.treeId, false);
					if (!result.data[0].children || result.data[0].children.length == 0) {
						delete result.data[0].children;
					}
					if (nonPk) {
						//新增回调后添加
						this.props.syncTree.addNodeSuccess(this.config.treeId, result.data);
					} else {
						//修改回调后修改
						this.props.syncTree.editNodeSuccess(this.config.treeId, result.data[0]);
					}
					//展开树节点
					this.props.syncTree.openNodeByPk(this.config.treeId, result.data[0].pid);

					this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].refpk);
					//设置表单项可用
					//  this.props.form.setFormItemsDisabled(this.config.formId);
					//清空自定已选中项
					this.setState({ curSelectedNode: null, cardEmpty: false });

					this.changeButtonStatus('save');

					this.props.form.setFormStatus(cardfromId, 'browse');

					toast({ title: this.state.json['10140Z00-000017'], color: 'success' }); /* 国际化处理： 保存成功！,提示*/

					this.props.modal.close('treeedit');
				}
			}
		});
	}

	/**
     * 保存新增
     */
	onSaveAddCtterm() {
		let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得选中节点
		let requestParam = {};
		/**************************************************
         *
         * 保存：
         *     1、获取表单对象
         *     2、构造请求参数模型
         *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
         *     4、回调，刷新当前树节点的父节点
         *
         * 保存状态下：
         *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
         *
         **************************************************/
		let formData = this.props.form.getAllFormValue(this.config.formId); //获得表单信息
		formData.areacode = this.config.formId; //添加表单的areacode编码
		formData.rows['status'] = '2'; //设置状态

		let urlchanage;
		var pk = null;
		urlchanage = this.config.urls.savetermUrl;
		if (formData.rows[0].values.hasOwnProperty('pk_ct_termset')) {
			pk = formData.rows[0].values.pk_ct_termset.value; //当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
		}
		/***设置请求参数***/
		requestParam = {
			model: formData,
			pageid: '10140EPSG' //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
		};

		/****判断刷新父节点，还是刷新选中节点****/
		/************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
		let nonPk = false; //没有主键  false时就是有主键  即编辑 即刷新父节点
		if (pk == null || pk == '') {
			nonPk = true; // true时 就是无主键 即 新增  即刷新当前节点
		}

		//校验公式
		this.props.validateToSave(
			requestParam,
			() => {
				/***ajax请求***/
				ajax({
					url: urlchanage,
					data: requestParam,
					success: (result) => {
						/**********
                     *
                     * 这里的代码可以精简，临时先这样，逻辑思路是一样的
                     *
                     *
                     *********/
						if (result.success) {
							//设置表单为浏览态
							this.props.form.setFormStatus(this.config.formId, 'browse');
							if (!result.data.treenode[0].children || result.data.treenode[0].children.length == 0) {
								delete result.data.treenode[0].children;
							}
							//新增回调后添加
							this.props.syncTree.addNodeSuccess(this.config.treeId, result.data.treenode);
							this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treenode[0].pid);

							//判断 选中节点如果消失，重新设置新增节点的父节点为选中节点，然后重新获取选中节点
							if (!selectedTreeNode) {
								this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treenode[0].pid);
								selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得选中节点
							}

							//重新设置整棵树不可用
							this.props.syncTree.setNodeDisable(this.config.treeId, true);

							//this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].refpk);
							//保存新增的时候，以当前节点合同类型作为下个新增的合同类型
							requestParam = {
								pk_ct_termtype: result.data.treenode[0].pid
							};
							this.onAddCtterm();
						}
					}
				});
			},
			{ [this.config.formId]: 'form' },
			'form'
		);
	}

	deleteCtterm() {
		let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得选中节点
		let requestParam = {};
		let urlchange;
		if (selectedTreeNode.nodeData.isTermType == true) {
			urlchange = this.config.urls.deleteTermtypeUrl;
			requestParam = {
				pk_ct_termtype: selectedTreeNode.refpk
			};
		} else {
			urlchange = this.config.urls.deleteTermUrl;
			requestParam = {
				pk_ct_termset: selectedTreeNode.refpk
			};
		}

		ajax({
			url: urlchange,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					this.props.form.EmptyAllFormValue(this.config.formId);
					//调用同步树的接口，删除该树节点
					this.props.syncTree.delNodeSuceess(this.config.treeId, selectedTreeNode.refpk);
					toast({ title: this.state.json['10140Z00-000018'], color: 'success' }); /* 国际化处理： 删除成功！,提示*/
					this.refreshForDel();
					//删除成功提示
					// Message.create({content: '删除成功！', color: 'success'});//默认top
				}
			}
		});
	}

	/**
     * 删除
     */
	onDeleteCtterm() {
		let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得选中节点
		/*******************************************
         *
         * 删除：
         *      1、根据选中的树节点做出相应的提示
         *      2、弹出删除确认提示
         *      3、构造请求参数
         *      4、ajax请求，后台执行删除
         *      5、回调，执行前台删除动作
         *
         * 删除状态下：
         *      清空表单对象数据，按钮全成Disabled状态
         *
         *******************************************/
		if (!selectedTreeNode) {
			toast({ content: this.state.json['10140Z00-000019'], color: 'warning' }); //默认top/* 国际化处理： 请选中需要删除的节点*/
			return;
		}
		if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup) {
			toast({ content: this.state.json['10140Z00-000013'], color: 'warning' }); //默认top/* 国际化处理： 业务单元不能操作集团级数据*/
			return;
		}
		if (selectedTreeNode.refpk == this.root.refpk) {
			toast({ content: this.state.json['10140Z00-000020'], color: 'warning' }); //默认top/* 国际化处理： 根节点不能删除*/
			return;
		}
		if (selectedTreeNode.nodeData.isTermType) {
			toast({ content: this.state.json['10140Z00-000021'], color: 'warning' }); //默认top/* 国际化处理： 不能删除合同条款类型,请到树上进行删除*/
			return;
		}
		let message = this.state.json['10140Z00-000022']; /* 国际化处理： 确认要删除所选数据吗？*/
		if (selectedTreeNode.children && selectedTreeNode.children.length > 0) {
			toast({ content: this.state.json['10140Z00-000023'], color: 'warning' }); //默认top/* 国际化处理： 删除失败！该合同条款类型下已有合同条款！*/
			return;
		}
		promptBox({
			color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: this.state.json['10140Z00-000004'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
			noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
			hasCloseBtn: false,
			content: message,
			beSureBtnClick: () => {
				this.deleteCtterm();
			}
		});
		// this.props.modal.show('modal', {
		//     title: '确认删除',
		//     content: message,
		//     beSureBtnClick:this.deleteCtterm.bind(this),
		// });
		this.changeButtonStatus('delete');
	}

	/**
     * 删除
     */
	onDeleteCttermtype() {
		let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得选中节点
		/*******************************************
         *
         * 删除：
         *      1、根据选中的树节点做出相应的提示
         *      2、弹出删除确认提示
         *      3、构造请求参数
         *      4、ajax请求，后台执行删除
         *      5、回调，执行前台删除动作
         *
         * 删除状态下：
         *      清空表单对象数据，按钮全成Disabled状态
         *
         *******************************************/
		if (!selectedTreeNode) {
			toast({ content: this.state.json['10140Z00-000019'], color: 'warning' }); //默认top/* 国际化处理： 请选中需要删除的节点*/
			return;
		}
		if (this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData.isGroup) {
			toast({ content: this.state.json['10140Z00-000013'], color: 'warning' }); //默认top/* 国际化处理： 业务单元不能操作集团级数据*/
			return;
		}
		if (selectedTreeNode.refpk == this.root.refpk) {
			toast({ content: this.state.json['10140Z00-000020'], color: 'warning' }); //默认top/* 国际化处理： 根节点不能删除*/
			return;
		}
		let message = this.state.json['10140Z00-000022']; /* 国际化处理： 确认要删除所选数据吗？*/
		if (selectedTreeNode.children != null) {
			if (
				selectedTreeNode.nodeData.isTermType &&
				selectedTreeNode.hasOwnProperty('children') &&
				selectedTreeNode.children.length > 0
			) {
				toast({ content: this.state.json['10140Z00-000023'], color: 'warning' }); //默认top/* 国际化处理： 删除失败！该合同条款类型下已有合同条款！*/
				return;
			}
		}

		if (!selectedTreeNode.nodeData.isTermType) {
			toast({ content: this.state.json['10140Z00-000024'], color: 'warning' }); //默认top/* 国际化处理： 删除失败！树上不能删除合同条款！*/
			return;
		}
		promptBox({
			color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: this.state.json['10140Z00-000004'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
			noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
			hasCloseBtn: false,
			content: message,
			beSureBtnClick: () => {
				this.deleteCtterm();
			}
		});
		// this.props.modal.show('modal', {
		//     title: '确认删除',
		//     content: message,
		//     beSureBtnClick:this.deleteCtterm.bind(this),
		// });
		this.changeButtonStatus('del');
	}

	/**
     * 取消
     */
	onCancelCtterm() {
		let istermType = this.props.syncTree.getSelectNode(this.config.treeId);

		promptBox({
			color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: this.state.json['10140Z00-000034'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
			noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
			hasCloseBtn: false,
			content: this.state.json['10140Z00-000025'] /* 国际化处理： 您确定要取消吗？*/,
			beSureBtnClick: () => {
				//同步树 取消的逻辑
				let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得选中节点
				/**********************************************************
                 *
                 * 取消：
                 *      1、重新根据选中的树节点查询表单对象
                 *      2、回调，设置表单对象
                 *      3、设置按钮状态
                 *
                 **********************************************************/
				this.props.form.EmptyAllFormValue(this.config.formId);
				this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true }); //设置表单项不可用
				if (selectedTreeNode) {
					//查询节点信息
					ajax({
						url: this.config.urls.queryCardUrl,
						data: { pk_ct_termset: selectedTreeNode.refpk },
						success: (result) => {
							if (result.success) {
								//查询时执行显示公式前端适配
								if (
									result.formulamsg &&
									result.formulamsg instanceof Array &&
									result.formulamsg.length > 0
								) {
									props.dealFormulamsg(
										result.formulamsg, //参数一：返回的公式对象
										{
											//参数二：界面使用的表格类型
											[this.config.formId]: 'form',
											[this.config.cardfromId]: 'form'
										}
									);
								}
								this.props.form.setAllFormValue({ head: result.data.head });
							}
						}
					});
				} else {
					//没有选中项  清空所有数据
					this.props.form.EmptyAllFormValue(this.config.formId);
				}
				this.props.form.setFormStatus(this.config.formId, 'browse');
				//设置树可用
				this.props.syncTree.setNodeDisable(this.config.treeId, false);
				//设置按钮状态
				//设置左树上搜索按钮可用
				this.setState({
					disabledSearch: false,
					disabledOrgunit: false
				});

				if (istermType.nodeData.isTermType) {
					this.changeButtonStatus('select');
				} else {
					this.changeButtonStatus('cancel');
				}
			}
		});
		// this.props.modal.show('confirm',{
		//     title:'提示',
		//     content: "您确定要取消吗？",
		//     noFooter : false, //是否需要底部按钮,默认true
		//     userControl:true,//自己控制什么时候关闭窗口
		//     beSureBtnClick:() =>{
		//         //同步树 取消的逻辑
		//         let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
		//         /**********************************************************
		//          *
		//          * 取消：
		//          *      1、重新根据选中的树节点查询表单对象
		//          *      2、回调，设置表单对象
		//          *      3、设置按钮状态
		//          *
		//          **********************************************************/
		//         this.props.form.EmptyAllFormValue(this.config.formId);
		//         this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
		//         if(selectedTreeNode){
		//             //查询节点信息
		//             ajax({
		//                 url:this.config.urls.queryCardUrl,
		//                 data:{pk_ct_termset:selectedTreeNode.refpk},
		//                 success:(result)=>{

		//                     if(result.success){
		//                         this.props.form.setAllFormValue({head:result.data.head});

		//                     }
		//                 }
		//             });
		//         }else{
		//             //没有选中项  清空所有数据
		//             this.props.form.EmptyAllFormValue(this.config.formId);
		//         }
		//         this.props.form.setFormStatus(this.config.formId, 'browse');
		//         //设置树可用
		//         this.props.syncTree.setNodeDisable(this.config.treeId,false);
		//         //设置按钮状态
		//         //设置左树上搜索按钮可用
		//         this.setState( {
		//             disabledSearch:false,
		//             disabledOrgunit:false
		//             });
		//         this.changeButtonStatus('cancel');
		//     }
		// });
	}

	/**
     * 启用
     */
	onStartEps() {
		let formData = this.props.form.getAllFormValue(this.config.formId); //获得表单信息
		let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId); //获得选中节点
		let requestParam = {};
		/**************************************************
         *
         * 启用/停用
         *      1、判断选中树节点的状态，做出相应的提示
         *      2、构造请求参数
         *      3、ajax请求，后台执行更新
         *
         * 启用/停用状态下：
         *      按钮的可见性和可操作性不变
         *
         *
         **************************************************/

		if (!selectedTreeNode) {
			toast({ content: this.state.json['10140Z00-000002'], color: 'warning' }); //默认top/* 国际化处理： 请选中需要启用的树节点*/
		} else if (formData.rows[0].values.enablestate.value == '2') {
			toast({ content: this.state.json['10140Z00-000026'], color: 'warning' }); //默认top/* 国际化处理： 该数据已启用，无需多次启用*/
			return;
		}
		requestParam = {
			pk_custsaleclass: formData.rows[0].values.pk_custsaleclass.value,
			enablestate: '2'
		};
		ajax({
			url: this.config.urls.enablestateUrl,
			data: requestParam,
			success: (result) => {
				//启用成功，设置表单数据
				if (res.success) {
					this.props.form.setAllFormValue({ head: result.data.head });
					//关闭 展开，可以做一个refreshTreeNode方法

					this.refreshTreeNode('epsTree', selectedTreeNode.pid);

					this.changeButtonStatus('start');
				}
				// this.props.asyncTree.closeNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
				// this.props.asyncTree.openNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
			}
		});
	}

	/**
     * 停用
     */
	onStopEps() {
		let formData = this.props.form.getAllFormValue(this.config.formId); //获得表单信息
		let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId); //获得选中节点
		let requestParam = {};

		if (!selectedTreeNode) {
			toast({ content: this.state.json['10140Z00-000003'], color: 'warning' }); //默认top/* 国际化处理： 请选中需要停用的树节点*/
		} else if (formData.rows[0].values.enablestate.value == '1') {
			toast({ content: this.state.json['10140Z00-000027'], color: 'warning' }); //默认top/* 国际化处理： 该数据已停用，无需多次停用*/
			return;
		}
		requestParam = {
			pk_custsaleclass: formData.rows[0].values.pk_custsaleclass.value,
			enablestate: '1'
		};

		ajax({
			url: this.config.urls.enablestateUrl,
			data: requestParam,
			success: (res) => {
				if (res.success) {
					this.props.form.EmptyAllFormValue(this.config.formId);

					this.refreshTreeNode('epsTree', selectedTreeNode.pid);

					this.changeButtonStatus('stop');
					// this.props.asyncTree.closeNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
					// this.props.asyncTree.openNodeByPkAsync(this.config.treeId, selectedTreeNode.pid);
				}
			}
		});
	}

	/*****button group end*****/

	/**
     * 查询按钮点击事件
     * @param props
     * @param val
     */
	onClickSearchBtn(props, val) {
		let url = '/uapbd/eps/main/list/index.html';
		//获得查询区域条件
		// let data = props.search.getAllSearchData("epsQryTemp");
		let param = {};
		if (val != null) {
			val.map((e) => {
				param[e.field] = e.value.firstvalue;
			});
		}

		props.linkTo(url, param);
	}

	/**
     * 更多按钮点击更多选项时触发事件
     * @param key
     */
	onMoreSelect({ key }) {
		if (key == 'start') {
			this.onStartEps();
		} else if (key == 'stop') {
			this.onStopEps();
		}
	}

	/**
     * 更多选项，切换选项时触发事件
     * @param visible
     */
	onVisibleChange(visible) {}

	/**
     * 更多按钮占位事件
     */
	onMore() {}

	/**
     * 按钮点击状态切换监听事件
     * @param id
     */
	changeButtonStatus(id) {
		switch (id) {
			case 'saveadd':
			case 'add':
				this.props.button.setButtonVisible('save', true);
				this.props.button.setButtonVisible('saveadd', true);
				this.props.button.setButtonVisible('cancel', true);
				this.props.button.setButtonVisible('print-1', false);
				this.props.button.setButtonVisible('print', false);
				this.props.button.setButtonVisible('export', false);
				this.props.button.setButtonVisible('refresh', false);
				this.props.button.setButtonVisible('edit', false);
				this.props.button.setButtonVisible('delete', false);
				this.props.button.setButtonVisible('add', false);
				break;
			case 'edit':
				this.props.button.setButtonVisible('add', false);
				this.props.button.setButtonVisible('edit', false);
				this.props.button.setButtonVisible('save', true);
				this.props.button.setButtonVisible('saveadd', false);
				this.props.button.setButtonVisible('cancel', true);
				this.props.button.setButtonVisible('print-1', false);
				this.props.button.setButtonVisible('print', false);
				this.props.button.setButtonVisible('export', false);
				this.props.button.setButtonVisible('refresh', false);
				this.props.button.setButtonVisible('delete', false);
				break;
			case 'save':
			case 'cancel':
			case 'delete':
				this.props.button.setButtonVisible('save', false);
				this.props.button.setButtonVisible('saveadd', false);
				this.props.button.setButtonVisible('delete', true);
				this.props.button.setButtonDisabled([ 'delete' ], false);
				this.props.button.setButtonVisible('add', true);
				this.props.button.setButtonDisabled([ 'add' ], false);
				this.props.button.setButtonVisible('edit', true); //新交互
				this.props.button.setButtonVisible('cancel', false);
				this.props.button.setButtonVisible('refresh', true);
				this.props.button.setButtonVisible('print-1', true);
				this.props.button.setButtonVisible('print', true);
				this.props.button.setButtonVisible('export', true);
				break;
			case 'select':
				this.props.button.setButtonVisible('add', true);
				this.props.button.setButtonDisabled([ 'add' ], false);
				this.props.button.setButtonVisible('edit', false);
				this.props.button.setButtonVisible('save', false);
				this.props.button.setButtonVisible('saveadd', false);
				this.props.button.setButtonVisible('cancel', false);
				this.props.button.setButtonVisible('delete', true);
				this.props.button.setButtonVisible('refresh', true);
				this.props.button.setButtonVisible('printpage', true);
				this.props.button.setButtonVisible('print', true);
				this.props.button.setButtonVisible('export', true);
				this.props.button.setButtonDisabled([ 'delete' ], true);
				break;
			case 'selectroot':
				this.props.button.setButtonVisible('add', true);
				this.props.button.setButtonVisible('edit', false);
				this.props.button.setButtonVisible('save', false);
				this.props.button.setButtonVisible('saveadd', false);
				this.props.button.setButtonVisible('cancel', false);
				this.props.button.setButtonVisible('delete', true);
				this.props.button.setButtonVisible('refresh', true);
				this.props.button.setButtonVisible('print-1', true);
				this.props.button.setButtonVisible('print', true);
				this.props.button.setButtonVisible('export', true);
				this.props.button.setButtonDisabled([ 'delete', 'add' ], true);
				break;
			default:
				break;
		}
	}

	/**
     * 鼠标进入树节点事件
     * @param key
     */
	onMouseEnterEve(key) {
		let selectedTreeNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, key);
		let obj = {};
		//设置
		if (
			key === this.root.refpk ||
			(this.config.nodeType === 'ORG_NODE' && selectedTreeNode.nodeData && selectedTreeNode.nodeData.isGroup)
		) {
			obj = {
				delIcon: false, //false:隐藏； true:显示; 默认都为true显示
				editIcon: false,
				addIcon: true
			};
			this.props.syncTree.hideIcon(this.config.treeId, key, obj);
		}

		if (this.config.nodeType === 'GROUP_NODE' && selectedTreeNode.nodeData && !selectedTreeNode.nodeData.isGroup) {
			obj = {
				delIcon: false, //false:隐藏； true:显示; 默认都为true显示
				editIcon: false,
				addIcon: true
			};
			this.props.syncTree.hideIcon(this.config.treeId, key, obj);
		}

		if (!selectedTreeNode.nodeData.isTermType) {
			obj = {
				delIcon: false, //false:隐藏； true:显示; 默认都为true显示
				editIcon: false,
				addIcon: false
			};
			this.props.syncTree.hideIcon(this.config.treeId, key, obj);
		}
	}

	/**
     * enablestate change 事件
     * @param checked
     */
	onChange(checked) {
		let selectNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得树节点选中项
		let requestParam = {};
		if (!selectNode) {
			toast({ content: this.state.json['10140Z00-000028'], color: 'warning' }); //默认top/* 国际化处理： 请选中树节点*/
		}
		requestParam['pk_custsaleclass'] = selectNode.refpk;
		requestParam['enablestate'] = checked ? '2' : '1';
		ajax({
			url: this.config.urls.enablestateUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					if (checked) {
						//如果是选中 那就把数据再加载到表单

						this.props.form.setAllFormValue({ head: result.data.head });
					} else {
						//如果不是选中那就清空表单
						this.props.form.EmptyAllFormValue(this.config.formId);
						this.props.syncTree.delNodeSuceess(this.config.treeId, selectNode.refpk);
					}
				}
			}
		});
	}

	/**
     * checkbox change 事件
     */
	onCheckBoxChange() {
		let checked = this.state.checked;
		let requestParam = {
			checked: this.state.checked
		};
		ajax({
			url: this.config.urls.loadTreeDataUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					var data = [ Object.assign({ ...this.root }, { children: result.data }) ],
						initLeaf = function(node) {
							if (!node.children || node.children.length == 0) {
								delete node.children;
							} else {
								node.isLeaf = false;
								node.children.forEach((e) => {
									initLeaf(e);
								});
							}
						};

					data.forEach((e) => {
						initLeaf(e);
					});

					//同步树 加载全部数据
					this.props.syncTree.setSyncTreeData(this.config.treeId, data);
					//展开节点  设置默认展开项
					this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
				}
			}
		});
	}

	/**
     * checkbox 选中事件
     */
	onCheckBoxClick() {
		this.setState({ checked: !this.state.checked });
		this.props.form.EmptyAllFormValue(this.config.formId); //清空表单数据
	}

	/**
     * 业务单元组织参照 选中事件
     */
	onOrgChange(value) {
		this.setState({
			curOrg: value
		});
		setTimeout(() => this.onRefresh(), 10); //选中后开始加载部门数据
	}

	// loadCustSaleClassTreeData(){
	//     ajax({
	//         loading: true,
	//         url: this.config.urls.loadTreeDataUrl,
	//         data: {
	//             checked:this.state.checked,
	//             pkorg:this.state.curOrg.refpk
	//         }, //参数带上选中的行政组织
	//         success:(result)=>{
	//             if(result.success && result.data){

	//                 let data = [Object.assign( {...this.root} , {children : result.data} )];
	//                 //同步树  加载全部数据
	//                 this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
	//                 //展开节点  设置默认展开项
	//                 this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
	//             }else{
	//                 this.props.syncTree.setSyncTreeData(this.config.treeId , []);
	//             }
	//         }
	//     });
	// }

	onButtonClick(props, id) {
		switch (id) {
			case 'add':
				//新增
				this.onAddCtterm();
				break;
			case 'edit':
				//编辑
				this.onEditCtterm();
				break;
			case 'save':
				//保存
				this.onSaveCtterm();
				break;
			case 'saveadd':
				//保存新增
				this.onSaveAddCtterm();
				break;
			case 'delete':
				//删除
				this.onDeleteCtterm();
				break;
			case 'cancel':
				//取消
				this.onCancelCtterm();
				break;
			case 'print':
				let pks = getDefData('allpks', props.config.datasource); //cacheTools.get('allpks');
				if (pks.length <= 0) {
					toast({ content: this.state.json['10140Z00-000035'], color: 'warning' }); /* 国际化处理： 没有要打印的数据！*/
					return;
				}
				print(
					'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
					this.config.urls.printUrl,
					{
						//billtype:'',  //单据类型
						funcode: '10140Z00', //props.config.appcode,      //功能节点编码，即模板编码
						nodekey: 'termset', //模板节点标识
						oids: pks //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
					},
					false
				);
				break;
			case 'export':
				let pks1 = getDefData('allpks', props.config.datasource); //cacheTools.get('allpks');
				if (pks1.length <= 0) {
					toast({ content: this.state.json['10140Z00-000036'], color: 'warning' }); /* 国际化处理： 没有要输出的数据！*/
					return;
				}
				this.setState(
					{
						pks: pks1
					},
					this.refs.printOutput.open()
				);
				// print(
				//     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				//     urls.printUrl,
				//     {
				//         //billtype:'',  //单据类型
				//         funcode: '10140CSCLG',      //功能节点编码，即模板编码
				//         //nodekey:'',     //模板节点标识
				//         // nodekey:'assprinttem',
				//         outputType:'output',
				//         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
				//     }
				// );
				break;
			case 'refresh':
				//刷新
				setDefData('ctterm_btnopr', props.config.datasource, 'refresh');
				this.onRefresh();
				break;

			default:
				break;
		}
	}

	/**
     * 渲染
     * @returns {*}
     */
	render() {
		/**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
		const { asyncTree, syncTree, form, button, modal, search, DragWidthCom, BillHeadInfo } = this.props;
		//DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
		const { createBillHeadInfo } = BillHeadInfo;
		const { createSyncTree } = syncTree; //创建同步树 需要引入这个
		const { createForm } = form; //创建表单，需要引入这个

		const { createButtonApp } = button;

		let { createModal } = modal; //模态框

		const { NCCreateSearch } = search;

		return (
			<div className="nc-bill-tree-card">
				{createModal('modal', { noFooter: false })}
				{createModal('confirm')}
				{this.state.json &&
					createModal('treeedit', {
						title: this.state.json['10140Z00-000029'] /* 国际化处理： 合同条款类型*/,
						content: this.props.form.createForm(cardfromId),
						userControl: true, //自己控制什么时候关闭窗口
						beSureBtnClick: this.onSaveCttermtype.bind(this),
						cancelBtnClick: () => {
							promptBox({
								color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
								title: this.state.json['10140Z00-000034'], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
								noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
								hasCloseBtn: false,
								content: this.state.json['10140Z00-000025'] /* 国际化处理： 您确定要取消吗？*/,
								beSureBtnClick: () => {
									this.props.form.setFormStatus(cardfromId, 'browse');
									this.props.modal.close('treeedit');
								}
							});
							// this.props.modal.close('treeedit');
						},
						noFooter: false //是否需要底部按钮,默认true
					})}
				{/* 头部 header*/}
				<div className="nc-bill-header-area" style={{ height: 'auto', padding: '0' }}>
					<div className="header header-title-search-area">
						{createBillHeadInfo({
							title: this.props.config.title,
							initShowBackBtn: false
						})}
						{/*Wanglqh({
                        isTreelazyLoad:true,
                    })*/}
						{/* 显示停用*/}
						{this.config.nodeType === 'ORG_NODE' ? (
							<div className="search-box" fieldid="org_select">
								{BusinessUnitTreeRef({
									onChange: this.onOrgChange.bind(this),
									value: this.state.curOrg,
									disabled: this.state.disabledOrgunit,
									queryCondition: () => {
										return {
											TreeRefActionExt:
												'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder,nccloud.web.uapbd.ctbasedoc.ctterm.action.OrgUnitForCorpFilter',
											orgtype2: 'Y',
											AppCode: this.config.appcode
										};
									}
								})}
							</div>
						) : (
							''
						)}
						{/* 按钮组 btn-group*/}
						<div className="btn-group">
							{createButtonApp({
								area: 'header-button-area',
								buttonLimit: 5,
								onButtonClick: this.onButtonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</div>
				</div>
				{/* 树卡区域 */}
				<div className="tree-card">
					<DragWidthCom
						// 左树区域
						leftDom={
							<div className="tree-area">
								{createSyncTree({
									disabledSearch: this.state.disabledSearch,
									treeId: this.config.treeId,
									searchType: 'filtration',
									needEdit: true, //不启用编辑
									showLine: false, //显示连线
									needSearch: true, //是否需要搜索框
									onSelectEve: this.onSelectTree.bind(this), //选择
									onMouseEnterEve: this.onMouseEnterEve.bind(this),
									clickEditIconEve: this.onEditCttermtype.bind(this), //编辑点击 回调
									clickAddIconEve: this.onAddCttermtype.bind(this), //新增点击 回调
									clickDelIconEve: this.onDeleteCttermtype.bind(this), // 删除点击 回调
									showModal: false
								})}
							</div>
						} //左侧区域dom
						// 右卡片区域
						rightDom={
							<div className="card-area">
								<EmptyAreaTip
									type="btn"
									// onClick={this.openSysModal.bind(this, 'add')}
									onClick={this.onAddCttermtype.bind(this, this.root)}
									show={this.state.cardEmpty}
								/>
								<span style={{ display: this.state.cardEmpty ? 'none' : 'block' }}>
									{createForm(this.config.formId, {
										cancelPSwitch: true,
										onAfterEvent: this.onAfterFormEvent.bind(this)
									})}
								</span>
							</div>
						} //右侧区域dom
						defLeftWid="20%" // 默认左侧区域宽度，px/百分百
					/>
				</div>

				<PrintOutput
					ref="printOutput"
					url={this.config.urls.printUrl}
					data={{
						funcode: '10140Z00', //功能节点编码，即模板编码
						nodekey: 'termset', //模板节点标识
						oids: this.state.pks, //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: 'output'
					}}
					//callback={this.onSubmit}
				/>
			</div>
		);
	}
}

// //初始化单据模板
// var initTemplate = function(props) {
//     props.createUIDom(
//         {
//             pagecode:props.config.pageCode//页面id
//            // appcode:props.config.appcode//注册按钮的id
//         },
//         function (data){
//             debugger
//             if(data){
//                 //默认业务单元赋值
//                 let ccontext = data.context || {};
//                 this.state.curOrg = {
//                     refpk : ccontext.pk_org,
//                     refname : ccontext.org_Name,
//                     display : ccontext.org_Name,
//                     values : {refpk : ccontext.pk_org, refname : ccontext.org_Name}
//                 };
//                 if(data.template){
//                     let meta = data.template;
//                     props.meta.setMeta(meta);
//                 }
//                 if(data.button){
//                     let button = data.button;
//                     props.button.setButtons(button);
//                 }
//                 setFormEnableStateProp(props);
//             }
//         }
//     )
// }

/**
 * 设置表单启用状态属性可以编辑
 * @param props
 */
const setFormEnableStateProp = (props) => {
	//获得元数据
	let meta = props.meta.getMeta();
	formId = props.config.formId ? props.config.formId : formId;
	//判断元数据中有我的表单元数据
	if (Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(formId)) {
		//获得表单元数据
		let formMeta = props.meta.getMeta()[formId];
		//判断表单元数据有属性
		if (formMeta.hasOwnProperty('items')) {
			//获得属性
			let items = formMeta.items;
			if (Object.prototype.toString.call(items).slice(8, -1) === 'Array') {
				items.map((item) => {
					//查找enablestate属性
					if (item.hasOwnProperty('attrcode') && item.attrcode == 'enablestate') {
						//设置enablestate属性不可用
						props.form.setFormItemsDisabled(formId, { enablestate: true });
					}
				});
			}
		}
	}
};

/**
 * 创建页面
 */
export default (CustsaleClass = createPage({
	billinfo: [
		{
			billtype: 'form',
			pagecode: pageCode,
			headcode: formId
		},
		{
			billtype: 'form',
			pagecode: pageCode,
			headcode: cardfromId
		}
	],
	mutiLangCode: '10140Z00'
})(CustsaleClass));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65