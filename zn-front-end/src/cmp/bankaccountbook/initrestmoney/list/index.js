/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/

//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, getMultiLang, createPageIcon } from 'nc-lightapp-front';
const { NCTabs, NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;
import {
	buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,
	afterEvent, searchAfterEvent, getData, setButtonVisible, onDelete, setButtonDisable
} from './events';
import './index.less';

let searchId = 'search_area';
let tableId = 'table_area';
let pageId = '360701OB_L01';

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = '360701OB';
		this.tableId = 'table_area';
		this.searchId = 'search_area';
		this.treeId = 'tree';
		this.localcurrtype = '';  // 组织本币币种，选择组织的时候会给此赋值
		this.state = {
			showDeleteModal: false,
			tableButtonKey: -1,
			isEdit: false,
			json: {}
		}
		//initTemplate.call(this,this.props, json);
	}
	componentDidMount() {
		this.initButton();
		//this.onInit();
	}
	//多语显示问题
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json })
			initTemplate.call(this, this.props, json);
			this.onInit(json);//此json就是指引用的多语文件；哪些方法和文件想用到，都需要把此json传过去，然后用：json['xx-xx']调用；
		}
		getMultiLang({ moduleId: '360701OB', domainName: 'cmp', callback })
	}
	// 业务组树的数据格式转成组件所需要的格式示例
	treedata = (json) => {
		return [
			{
				"pid": "-1", //父元素pk
				"refcode": "0",
				"refname": json['360701OB-000032'],/* 国际化处理： 库存现金*/
				//"refname": '库存现金',
				"refpk": "0",
				"values": {},
			},
			{
				"pid": "-1", //父元素pk
				"refcode": "1",// 编码
				"refname": json['360701OB-000033'],//名称/* 国际化处理： 银行存款*/
				//"refname": '银行存款',
				"refpk": "1",//主键
				"values": {}//自定义属性
			},
		];
	}
	deptRoot = () => {
		//为部门树创建一个根节点
		return {
			isleaf: false,
			pid: "",
			refname: this.state.json['360701OB-000034'],/* 国际化处理： 全部*/
			//refname: '全部',
			refpk: "-1"
		}
	};
	onInit(json) { //初始化界面(在页面渲染后)
		//this.props.syncTree.setSyncTreeData(this.treeId, [this.deptRoot]);  //为部门树添加根节点数据
		this.props.syncTree.setSyncTreeData(this.treeId, [Object.assign({ ...this.deptRoot.call(this) }, { children: this.treedata.call(this, json) })]);
	}
	initButton() {
		let buttonarr = ['save', 'cancel'];
		let buttonflag = false;
		this.props.button.setButtonVisible(buttonarr, buttonflag);
		// 将所有的按钮先设置成不可编辑
		setButtonDisable(this.props, true);
	}
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button'
		} else {
			return 'secondary - button'
		}
	};
	/**
	 * firstvalue:是选择的左树区域refcode
	 * secondvalue:是组织id
	 */
	onchangeGetDate = (value) => {
		let serval = [{
			"field": "dbilldate",
			"value": value,
			"oprtype": "between"
		}]
		this.getData(serval, this.state.json);
	}
	//获取资金形态和财务组织
	getPkorgValue = () => {
		let pkorg = this.props.search.getAllSearchData(this.searchId);
		let freshpkorg = null;
		if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
			freshpkorg = pkorg.conditions[0].value;
			return freshpkorg;
		} else {
			return;
		}
	}
	getFundform = () => {
		let treeid = 'tree';
		let selectTree = this.props.syncTree.getSelectNode(treeid);
		let fundform = null;
		if (selectTree && selectTree.refcode) {
			fundform = selectTree;
			return fundform;
		}
	}

	//刷新列表信息
	refreshHtml = () => {
		setButtonVisible(this.props, true);
		let searchId = 'search_area';
		let pkorg = this.props.search.getAllSearchData(searchId);
		let freshpkorg = null;
		if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
			freshpkorg = pkorg.conditions[0].value;
		} else {
			return;
		}
		let treeid = 'tree';
		let selectTree = this.props.syncTree.getSelectNode(treeid);
		let fundform = null;
		if (selectTree && selectTree.refcode) {
			fundform = selectTree.refcode;
		} else {
			return;
		}
		pkorg.conditions[0].value.secondvalue = fundform;
		let data = {
			conditions: pkorg.conditions || pkorg,
			//pageInfo: refreshpageInfo,
			pagecode: '360701OB_L01',
			queryAreaCode: 'search_area',  //查询区编码
			oid: '1001A81000000001RROD',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType: 'simple'
		};
		ajax({
			url: '/nccloud/cmp/bankaccountbook/initrestmoneyquery.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.editTable.setTableData(tableId, data[tableId], true)

						// 将部分先设置成不可编辑
						this.props.button.setButtonDisabled(['addLine', 'getin', 'print', 'refresh'], false);
						this.props.button.setButtonDisabled(['deleteLine', 'audit', 'antiaudit', 'auditGroup'], true);
						toast({
							content: this.state.json['360701OB-000064'],/* 国际化处理： 刷新成功！*/
							color: 'success'
						})
					} else {
						setButtonDisable(this.props, false);
						//begin tm tangleic 20200326 查询后的数据注入到表格都需要存入缓存，修改之后便于从缓存中恢复数据
						// this.props.editTable.setTableData(tableId, { rows: [] }, false);
						this.props.editTable.setTableData(tableId, { rows: [] }, true);
						//end tm tangleic
					}
				}
			}
		});

	}

	getData = (serval, json) => {
		setButtonVisible(this.props, true);
		let data = {
			conditions: serval,
			//pageInfo: pageInfo,
			pagecode: "360701OB_L01",
			queryAreaCode: "",  //查询区编码
			oid: '1001A81000000001RROD',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType: 'simple'
		};
		ajax({
			url: '/nccloud/cmp/bankaccountbook/initrestmoneyquery.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.editTable.setTableData(this.tableId, data[this.tableId], true)
						// 将部分先设置成不可编辑
						this.props.button.setButtonDisabled(['addLine', 'getin', 'print', 'refresh'], false);
						this.props.button.setButtonDisabled(['deleteLine', 'audit', 'antiaudit', 'auditGroup'], true);
						let message = this.state.json['360701OB-000063'] + data[this.tableId].rows.length + this.state.json['360701OB-000065'];
						toast({
							content: message,/* 国际化处理： 查询成功！*/
							color: 'success'
						})
					} else {
						setButtonDisable(this.props, false);
						//begin tm tangleic 20200326 查询后的数据注入到表格都需要存入缓存，修改之后便于从缓存中恢复数据
						// this.props.editTable.setTableData(this.tableId, { rows: [] }, false);
						this.props.editTable.setTableData(this.tableId, { rows: [] }, true);
						//end tm tangleic
					}
				}
			}
		});
	};
	selected = (props, moduleId, record, index, status) => {
		//props,react组件
		// //console.log(props);

		// //moduleId:页面区域id，就是tablearea,json里的area下的第一个
		// //console.log(moduleId);

		// //record:本条记录
		// //console.log(record.key);

		// //index:本条记录的位置
		// //console.log(index);

		// //status:选中的状态，选中为true,取消选中为false;
		// //console.log(status);

		if (status) {

		}

	}
	allSelected = (props, moduleId, status, length) => {
		//props,react组件
		// //console.log(props);

		// //moduleId:页面区域id，就是tablearea,json里的area下的第一个
		// //console.log(moduleId);

		// //status:选中的状态，选中为true,取消选中为false;
		// //console.log(status);

		// //length:选中的数量
		// //console.log(length);

	}

	//选择数据时控制按钮显隐性
	selectedShowBtn = () => {
		let selectedLength = this.props.editTable.getCheckedRows(this.tableId).length;//选择数据条数
		if (selectedLength > 0) {
			this.props.button.setButtonDisabled(['addLine', 'deleteLine', 'getin', 'audit', 'antiaudit', 'auditGroup', 'print', 'refresh'], false);
		} else if (selectedLength == 0) {
			this.props.button.setButtonDisabled(['deleteLine', 'audit', 'antiaudit', 'auditGroup'], true);
		}
	}

	//选择左树区域方法
	onDeptSelect = (props) => {
		//let refcode = props.refcode;
		if (props && props.refcode) {
			let pkorg1 = this.props.search.getSearchValByField(searchId, "pk_org").value;
			if (pkorg1.firstvalue == null || pkorg1.firstvalue == "") {
				//不选组织时，切换左树不做反应
			} else {
				let pkorg = this.props.search.getAllSearchData(searchId);//此方法对必输项校验
				let pkfirstvalue = null;
				if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
					pkfirstvalue = pkorg.conditions[0].value;
					pkfirstvalue.secondvalue = props.refcode;
					this.onchangeGetDate(pkfirstvalue);
				}
			}
		}
		//this.getData(serval);
	}
	//改变选择左树区域方法
	onSelectEve = (props) => {
		// //console.log("event");
		// //console.log(props);
	}
	//编辑后事件
	afterEventFn = () => {
		toast({ color: 'warning', content: this.state.json['360701OB-000035'] });/* 国际化处理： 编辑后事件*/
	}


	render() {
		let { cardTable, button, search, DragWidthCom, syncTree, editTable, table, ncmodal, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let { createCardTable } = cardTable;
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { createEditTable } = editTable
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		let { createSyncTree } = syncTree;
		let createNCModal = ncmodal.createModal;
		const { createBillHeadInfo } = BillHeadInfo;
		let json1 = this.state.json;
		return (
			<div className="nc-bill-tree-table">

				<div className="nc-bill-list bankaccountbook-list">
					{/** 渲染标题栏:自动化测试标识 **/}
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
						<div className="header-title-search-area">
							{createBillHeadInfo(
								{
									title: json1['360701OB-000038'],//标题{/* 国际化处理： 账户期初余额*/}
									initShowBackBtn: false
								}
							)}
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: 'list_head',   // classname= header-button-area
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this, json1),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</NCDiv>
					<div className="nc-bill-search-area">
						{NCCreateSearch('search_area', {
							clickSearchBtn: searchBtnClick.bind(this),    //classname= nc-bill-search-area
							onAfterEvent: searchAfterEvent.bind(this),    // 编辑后事件
							defaultConditionsNum: 2, 				//默认显示几个查询条件
							showAdvBtn: false,
							hideBtnArea: true                 // 隐藏查询按钮区域
						})}
					</div>
					<div className="tree-table">
						<DragWidthCom
							// 左树区域
							leftDom={
								<div className="tree-area">
									{createSyncTree({

										treeId: 'tree',
										needEdit: false, //不启用编辑
										showLine: true, //显示连线
										needSearch: false, //是否需要搜索框,
										defaultExpandAll: true, //默认展开所有节点
										onSelectedChange: this.onDeptSelect.bind(this),
										//onSelectEve: this.onDeptSelect.bind(this)
									})}
								</div>}     //左侧区域dom
							// 右卡片区域
							rightDom={
								<div className="nc-bill-table-area">
									{/* {createSimpleTable(this.tableId, {//列表区
                                    handlePageInfoChange: pageInfoClick,
									tableModelConfirm: tableModelConfirm,
									showCheck: true,
									onSelected:this.selected.bind(this),
									onSelectedAll:this.allSelected.bind(this)
								})}, */}
									{createEditTable(this.tableId, {		 //表格id
										//onCloseModel: onCloseModelFn,       // 弹窗控件点击关闭事件 
										onAfterEvent: afterEvent.bind(this),  // 控件的编辑后事件
										handlePageInfoChange: pageInfoClick,
										tableModelConfirm: tableModelConfirm,
										//onSelected: this.selected.bind(this),   // 左侧选择列单个选择框回调
										onSelected: this.selectedShowBtn.bind(this), // 单选时控制按钮显隐性
										onSelectedAll: this.selectedShowBtn.bind(this), // 多选时控制按钮显隐性        
										showCheck: true,
										showIndex: true,
										adaptionHeight: true,
										//onSelectedAll: this.selected.bind(this),        // 左侧选择列全选回调
										//selectedChange: this.allSelected.bind(this),  // 选择框有变动的钩子函数
										params: 'test',
									}
									)}

								</div>}     //右侧区域dom
							defLeftWid='180px'      // 默认左侧区域宽度，px/百分百
						/>
					</div>
					{/* 如下弹框暂时没有用add by zhanghjr */}
					<div className="table-detail-info">
						{createNCModal('onDelete', {
							title: json1['360701OB-000036'],/* 国际化处理： 确认信息*/
							content: json1['360701OB-000037'],/* 国际化处理： 删除操作不可逆,确定是否继续?*/
							beSureBtnClick: onDelete.bind(this)
						})}
					</div>
				</div>
			</div>
		);
	}
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: '360701OB',
	billinfo: {
		billtype: 'grid',
		pagecode: '360701OB_L01',
		bodycode: 'table_area'
	},
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/