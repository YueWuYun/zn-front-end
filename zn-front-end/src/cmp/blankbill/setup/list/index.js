/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/

//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, getMultiLang ,createPageIcon} from 'nc-lightapp-front';
const { NCTabs, NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;
import {
	buttonClick, initTemplate, searchBtnClick, tableModelConfirm,
	afterEvent, searchAfterEvent, getData, setButtonVisible,
} from './events';
import './index.less';

import { SHOW_MODE } from '../../../pub/cons/constant';
import { BBC_CONST,APP_INFO,BILL_FIELD,REQUEST_URL,BTN,OTHER } from '../cons/constant';
const {  } = BBC_CONST;
const { APPCODE,LIST_PAGECODE,SEARCH_CODE,FORM_BBC_01,FORM_BBC_02,FORM_BBC_03,FORM_BBC_04,FORM_BBC_05,TREE } = APP_INFO;
const { PK_NAME,PK_ORG,TS,BILLPK } = BILL_FIELD;
const { QUERY,SAVE,QUERYNOTETYPE } = REQUEST_URL;
const { SAVE_BTN, EDIT_BTN, CANCEL_BTN } = BTN;
const { ADD,BROWSER,EDIT } = SHOW_MODE;
const { rootId } = OTHER
class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = APPCODE;
		this.formId = FORM_BBC_01;
		this.searchId = SEARCH_CODE;
		this.treeId = 'tree';
		this.localcurrtype = '';  // 组织本币币种，选择组织的时候会给此赋值
		this.state = {
			showDeleteModal: false,
			tableButtonKey: -1,
			isEdit: false,
			json: {}
		}
		this.root = {
			children: [],
			pid: rootId,
			isleaf: false,
			refcode: 'jyxm',
			refname: this.state.json['36070BBC-000009'],
			refpk: rootId
		}; // 初始根节点
	}
	componentDidMount() {
		// this.initButton();
		//this.onInit();
	}
	//多语显示问题
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json })
			initTemplate.call(this, this.props, json);
			this.onInit(json);//此json就是指引用的多语文件；哪些方法和文件想用到，都需要把此json传过去，然后用：json['xx-xx']调用；
		}
		// getMultiLang({ moduleId: APPCODE, domainName: 'cmp', callback })
		// let callback = (json) => {
		// 	this.setState({ json });
		// 	saveMultiLangRes(this.props,json);//缓存多语资源
		// 	initTemplate.call(this, this.props);
		// };
		getMultiLang({ moduleId:{ 
			 [ 'tmpub']:['3601'],
			 ['cmp']: [APPCODE, '36070']
			} , callback });
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}

	}

	onInit(json) { //初始化界面(在页面渲染后)
		//this.props.syncTree.setSyncTreeData(this.treeId, [this.deptRoot]);  //为部门树添加根节点数据
		// this.props.syncTree.setSyncTreeData(this.treeId, [Object.assign({ ...this.deptRoot.call(this) }, { children: this.treedata.call(this, json) })]);

		let data = {};
		ajax({
			url: QUERYNOTETYPE,
			data: data,
			method: 'post',
			success: (res) => {
				if (res.success) {
					// 单据模板用例添加，当查询完成之后，执行以下代码 add by yinl 20180822 begin
					// if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					// 	this.props.dealFormulamsg(
					// 		res.formulamsg //参数一：返回的公式对象
					// 	);
					// }
					/**
					 * 刷新操作
					 * 清空表单数据，原NC始清空的
					 * 给出提示
					 */
					// if (refresh) {
						// this.props.form.EmptyAllFormValue(FORM_BBC_01);
						// showSuccessInfo('刷新成功！');
					// }
					this.root.refname = json['36070BBC-000009'];
					this.root.children = res.data;
					// console.log("res.data",res.data);
					// const body = JSON.stringify(res.data);
					this.props.syncTree.setSyncTreeData(TREE, [ this.root ]);
					// 默认展开第一级节点
					this.props.syncTree.openNodeByPk(TREE, rootId);
					// 设置按钮状态及页面状态
					// buttonController.setButtonStatus.call(this, this.props, BROWSER);
				}
			}
		});

	}

	initButton() {
		let buttonarr = ['save', 'cancel'];
		let buttonflag = false;
		this.props.button.setButtonVisible(buttonarr, buttonflag);
		// 将所有的按钮先设置成不可编辑
		// setButtonDisable(this.props, true);
		this.props.button.setButtonDisabled(EDIT_BTN,true);
	}

	//获取资金形态和财务组织
	getPkorgValue = () => {
		let pkorg = this.props.search.getAllSearchData(this.SEARCH_CODE);
		let freshpkorg = null;
		if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
			freshpkorg = pkorg.conditions[0].value;
			return freshpkorg;
		} else {
			return;
		}
	}

	cancelModalCancel = () => {
		// console.log("修改之前的财务组织",this.state.oldorg);
		// this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		// this.props.form.setFormStatus(this.formId, 'edit');
	};

	//刷新列表信息
	refreshHtml = () => {
		setButtonVisible(this.props, true);

		let pkorg = this.props.search.getAllSearchData(SEARCH_CODE);
		let pkfirstvalue = null;
		if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
			pkfirstvalue = pkorg.conditions[0].value.firstvalue;
		} else {
			return;
		}
		let selectTree = this.props.syncTree.getSelectNode(TREE);
		if (selectTree && selectTree.key!=rootId) {
		} else {
			return;
		}

		let serval = {
			pkorg: pkfirstvalue,
			pk: selectTree.key,
			pageCode: LIST_PAGECODE
		}
		ajax({
			url: QUERY,
			data: serval,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					} else {
						// this.props.form.setAllFormValue({ [this.formId]: [] });
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.setUrlParam({
							status: 'browse'
						});
					}
				}
			}
		});

	}

	getData = (serval, json) => {
		ajax({
			url: QUERY,
			data: serval,
			success: (res) => {
				if (res) {
					if (res.data) {
						this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
					}else{
						// this.emptyData();
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.setUrlParam({
							status: 'browse'
						});
						// buttonVisible.call(this, this.props, null);
					}
				} else {
					// this.emptyData();
				}
				// orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
			}
		});

		// ajax({
		// 	url: QUERY,
		// 	data: serval,
		// 	success: (res) => {
		// 		let { success, data } = res;
		// 		if (success) {
		// 			if (data) {
		// 				// this.props.editTable.setTableData(FORM_BBC_01, data[FORM_BBC_01], true)
		// 				this.props.form.setAllFormValue({ [FORM_BBC_01]: data[FORM_BBC_01] });
		// 				// 将部分先设置成不可编辑
		// 				// this.props.button.setButtonDisabled(['addLine', 'getin', 'print', 'refresh'], false);
		// 				// this.props.button.setButtonDisabled(['deleteLine', 'audit', 'antiaudit'], true);
		// 			} else {
		// 				// setButtonDisable(this.props, false);
		// 				this.props.editTable.setTableData(FORM_BBC_01, { rows: [] }, false);
		// 			}
		// 		}
		// 	}
		// });
	};


	//选择左树区域方法
	onDeptSelect = (props) => {
		// getSelectNode(tree);
		//let refcode = props.refcode;
		if (props) {
			let pkorg1 = this.props.search.getSearchValByField(SEARCH_CODE, "pk_org").value;
			let selectTree = this.props.syncTree.getSelectNode(TREE);
			if (pkorg1.firstvalue == null || pkorg1.firstvalue == "") {
				//不选组织时，切换左树不做反应
				// if(selectTree.key != rootId){
				// toast({ color: 'warning', content: this.state.json['36070BBC-000001'] });/* 国际化处理： 请选择财务组织*/
				// }
			} else {
				let pkorg = this.props.search.getAllSearchData(SEARCH_CODE);//此方法对必输项校验
				// let nodedata = this.props.syncTree.getSelectNode(TREE);
				// let selectTree = this.props.syncTree.getSelectNode(TREE);
				console.log('selectTree:',selectTree);
				let pkfirstvalue = null;
				if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
					pkfirstvalue = pkorg.conditions[0].value.firstvalue;
					// pkfirstvalue.secondvalue = props.refcode;
					if(!selectTree){
						this.props.button.setDisabled([
							EDIT_BTN
						],true);
					}else{
						if(selectTree.key === rootId){
							this.props.button.setDisabled([
								EDIT_BTN
							],true);
						}else{
							this.props.button.setDisabled([
								EDIT_BTN
							],false);
						}
					}
					if(props.id){
						let serval = {
							pkorg: pkfirstvalue,
							pk: props.id,
							pageCode: LIST_PAGECODE
						}
						this.getData(serval, this.state.json);
					}
					
				}
			}
		}
	}

	// 是否空白票据为否字段不可编辑
	fildDisabled = () => {
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'isautoly': true}); // 领用方式
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lyctrltype': true}); // 领用控制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'islyctrlbydate': true}); // 是否按照未报销期限控制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'islyctrlbymoney': true}); // 是否按照未报销总金额控制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'islyctrlbynum': true}); // 是否按领用张数控制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'limitation': true}); // 超额限制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lydate': true}); // 最大未报销领用天数
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lymoney': true}); // 最大未报销总金额
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lynum': true}); // 最大领用张数
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'pk_orgbook': true}); // 报销账簿
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'bxdrivetype': true}); // 报销驱动来源
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'isautobx': true}); // 报销方式
	}

	// 是否空白票据为是字段不可编辑
	fildVisible = () => {
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'isautoly': false}); // 领用方式
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lyctrltype': false}); // 领用控制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'islyctrlbydate': false}); // 是否按照未报销期限控制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'islyctrlbymoney': false}); // 是否按照未报销总金额控制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'islyctrlbynum': false}); // 是否按领用张数控制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'limitation': false}); // 超额限制
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lydate': true}); // 最大未报销领用天数
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lymoney': true}); // 最大未报销总金额
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'lynum': true}); // 最大领用张数
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'pk_orgbook': false}); // 报销账簿
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'bxdrivetype': false}); // 报销驱动来源
		this.props.form.setFormItemsDisabled(FORM_BBC_01,{'isautobx': false}); // 报销方式
	}

	render() {
		const {  button, search, DragWidthCom, syncTree, form, BillHeadInfo,simpleSearch } = this.props;
		const { NCCreateSearch } = search;
		const { createSyncTree } = syncTree;
		const { createButtonApp } = button;
		const { createForm } = form;
		let { createSimpleSearch } = simpleSearch; 
		let json1 = this.state.json;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-tree-table">
				<div className="nc-bill-list bankaccountbook-list">
					{/** 渲染标题栏 **/}
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: this.state.json['36070BBC-000000'],
									// loadMultiLang(this.props, '36070BBC-000000'),//国际化处理： 设置
									initShowBackBtn: false
								}
							)}
						</div>
						 {/* 原查询区所在 
						<div className="title-search-detail-search">
							{createSimpleSearch(SEARCH_CODE, {
								// clickSearchBtn: searchBtnClick.bind(this),    //classname= nc-bill-search-area
								onAfterEvent: searchAfterEvent.bind(this),    // 编辑后事件
								defaultConditionsNum: 3, 				//默认显示几个查询条件
								showAdvBtn: false,
								hideBtnArea: true,                 // 隐藏查询按钮区域
								SHOW_MODE:false,
							})}
						</div> */}
						<div className="header-button-area">
							{createButtonApp({
								area: 'list_head',   // classname= header-button-area
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this, json1),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</NCDiv>
					{/* 修改后查询区所在 */}
					<div className="nc-bill-search-area">
							{NCCreateSearch(SEARCH_CODE, {
								// clickSearchBtn: searchBtnClick.bind(this),    //classname= nc-bill-search-area
								clickSearchBtn: searchAfterEvent.bind(this),    // 编辑后事件
								defaultConditionsNum: 3, 				//默认显示几个查询条件
								showAdvBtn: false,
								// hideBtnArea: true,                 // 隐藏查询按钮区域
								SHOW_MODE:false,
							})}
                        </div>
					<div className="tree-table">
						<DragWidthCom
							// 左树区域
							leftDom={
								<div className="tree-area" >
									{createSyncTree({
										treeId: 'tree',
										needEdit: false, //不启用编辑
										showLine: true, //显示连线
										needSearch: false, //是否需要搜索框,
										defaultExpandAll: true, //默认展开所有节点
										onSelectedChange: this.onDeptSelect.bind(this),
										onSelectEve: this.onDeptSelect.bind(this)
									})}
								</div>}     //左侧区域dom
							// 右卡片区域
							rightDom={
								<div className="nc-bill-form-area">
									{
										createForm(FORM_BBC_01, {
										expandArr: [ FORM_BBC_01, FORM_BBC_02,FORM_BBC_03,FORM_BBC_04 ],
										onAfterEvent: afterEvent.bind(this)
									})}
								</div>}     //右侧区域dom
							defLeftWid='180px'      // 默认左侧区域宽度，px/百分百
						/>
					</div>
				</div>
			</div>
		);
	}
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: APPCODE,
	billinfo: {
		billtype: 'form',
		pagecode: LIST_PAGECODE,
		bodycode: FORM_BBC_01
	},
})(List);

export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/