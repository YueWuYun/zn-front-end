/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/

//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,print,getMultiLang } from 'nc-lightapp-front';
import  Utils from '../../../../uapbd/public/utils';
const { NCTabs, NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,
	 afterEvent, searchAfterEvent, getData, setButtonVisible,onDelete,setButtonDisable} from './events';
	 
import { APP_INFO, LIST_PAGE_INFO, URL_INFO, TEMPLATE_INFO, ITEM_INFO, CACHE_KEY,CARD_PAGE_INFO ,SHOW_MODE, PROP_EXT_OBJ,LIST_BUTTON_USE } from '../cons/constant';
	
import './index.less';


let searchId = LIST_PAGE_INFO.SEARCH_CODE;
let tableId = LIST_PAGE_INFO.TABLE_CODE;
let pageId = LIST_PAGE_INFO.PAGE_CODE;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = APP_INFO.MODULE_ID;
		this.tableId = LIST_PAGE_INFO.TABLE_CODE;
		this.searchId = LIST_PAGE_INFO.SEARCH_CODE;
		this.treeId = 'tree';
		this.oid_pk_org;
		this.pk_org;
		this.pk_group;
		this.pk_bankaccbas;
		this.pk_bankaccrule;
		this.localcurrtype = '';  // 组织本币币种，选择组织的时候会给此赋值
		this.state = {
			showDeleteModal:false,
			tableButtonKey:-1,
			isEdit: false,
			json: {}
		};
		 //加载多语资源
		 Utils.initPage(
			props,
			pageId,
			'36070BACR',//多语资源编码
			()=>{
                //自定义根节点
                this.root = {
                    "isleaf": false,
                    "key":"~",
                    "id":"~",
                    "innercode":"~",
                    "pid": "",
                    "refname": this.state.json['36070BACR-000034'],/* 国际化处理：银行账户*/
                    "refpk": "~"
                };
                
				return this.modifierMeta(this.props.meta.getMeta(), props);
			}
		);
		// this.root = {
		// 		"isleaf": false,
		// 		"key":"~",
		// 		"id":"~",
		// 		"innercode":"~",
		// 		"pid": "",
		// 		"refname": this.state.json['36070BACR-000034'],/* 国际化处理：银行账户*/
		// 		"refpk": "~"
		// };
		//initTemplate.call(this,this.props, json);
	}
	componentDidMount() {
		this.initButton();
		//this.onInit();
	}
	//多语显示问题
	componentWillMount() {
		let callback = (json) => {
		  this.setState({json})
		  initTemplate.call(this,this.props,json);
		  this.onInit(json);//此json就是指引用的多语文件；哪些方法和文件想用到，都需要把此json传过去，然后用：json['xx-xx']调用；
		}
		getMultiLang({moduleId: '36070BACR',domainName: 'cmp',callback})
	}	
	// 业务组树的数据格式转成组件所需要的格式示例
	treedata = (json) => {
		let requestParam = {
			pk_org : null
		}
		ajax({
			
			url:'/nccloud/cmp/bankaccountbase/aftereventinfo.do',
			data:requestParam,
			success:(result)=>{

				if(result.success){

					let data = [Object.assign( {...this.deptRoot.call(this)} , {children : null} )];
					//同步树  加载全部数据
					this.props.syncTree.setSyncTreeData(this.treeId , this.dealTreeData(data));
					//展开节点  设置默认展开项
					// this.props.syncTree.openNodeByPk(this.treeId, this.root.refpk);
					// this.props.syncTree.setNodeSelected(this.treeId, result.data[0].refpk);
				}
			}
		});

		
	}

	/**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.beforeName=node.code?(node.code+'  '):'';
            //node.beforeName=node.code;
            if(!node.children || node.children.length == 0) {

                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
        });
        return data;
	}
	

	deptRoot = () => {

		// this.root = {
		// 	"isleaf": false,
		// 	"key":"~",
		// 	"id":"~",
		// 	"innercode":"~",
		// 	"pid": "",
		// 	"refname": this.state.json['10100GRP-000000'],/* 国际化处理： 集团*/
		// 	"refpk": "~"
		// };
		// //主动事件，绑定this指针
		// this.dealTreeData = this.dealTreeData.bind(this);
		// //初始化只显示刷新按钮
		// props.button.setDisabled({
		// 	edit:true,
		// 	refresh:false,
		// 	queryBusiInfo:true,
		// 	logo:true
		// });
		// return this.modifierMeta(this.props.meta.getMeta(), props);

		//为部门树创建一个根节点
		return {
			isleaf: false,
			key:"~",
			pid: "",
			id:"~",
			innercode:"~",
			refname: this.state.json['36070BACR-000034'],/* 国际化处理： 银行账户*/
			refpk: "~"
		}
	};
	onInit(json){ //初始化界面(在页面渲染后)
		//this.props.syncTree.setSyncTreeData(this.treeId, [this.deptRoot]);  //为部门树添加根节点数据
		let requestParam = {
			pk_org : null
		}

		ajax({

            url:'/nccloud/cmp/bankaccountbase/aftereventinfo.do',
            data:requestParam,
            success:(result)=>{
                if(result.success){
                   
					
					
					let data = [Object.assign( {...this.deptRoot.call(this)} , {children : null} )];
					if(!result.data){
						//同步树  加载全部数据
						this.props.syncTree.setSyncTreeData(this.treeId , this.dealTreeData(data));
					}else{
						this.props.syncTree.setSyncTreeData(this.treeId, [Object.assign( {...this.deptRoot.call(this)} , {children : null} )]);
					}
                   
                    //展开节点  设置默认展开项
                    // if(this.state.pk_group=='~'){
                    //     this.props.syncTree.openNodeByPk(this.treeId, this.root.refpk);
                    // }else{
                    //     this.props.syncTree.setNodeSelected(this.treeId, this.state.pk_group);
                    //     this.props.syncTree.openNodeByPk(this.treeId, this.state.pk_group);
                    // }

                    // //如果刷新成功，需要给出提示
					// if(prompt&&(prompt instanceof Function)){
					// 	prompt();
					// }
                    
                }
            }
        });
        // this.updateButtonStatus('browse');

		
	}
	initButton(){
		let buttonarr = LIST_BUTTON_USE.ALL;
		let buttonflag = false;
		this.props.button.setButtonVisible(buttonarr,buttonflag);
		
		// 将所有的按钮先设置成不可编辑
		setButtonDisable(this.props,true);
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
	onchangeGetDate = (value,id)=>{
		let serval = [{
			"value": value,
			"field":id
		}]
		this.getData(serval,this.state.json);
	}

	/**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk){
		let selectNode = this.props.syncTree.getSelectNode(this.treeId);

		// let refpk = selectNode.refpk;
		// let pk_org =  this.props.search.getSearchValByField(searchId,"pk_org").value;
     
       

        // if(refpk == this.root.refpk){
        //     //清空表单
        //     this.props.form.EmptyAllFormValue(this.config.formId);
        //     //设置只有刷新按钮可用
        //     this.props.button.setDisabled({
        //         edit:true,
        //         refresh:false,
        //         queryBusiInfo:true,
        //         logo:true
        //     });
        //     return;
        // }
        //
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        ajax({
			url:'/nccloud/cmp/bankaccountbase/queryorgcurrtyperate.do',
            data:{pk_org:pk_org,pk_id:refpk},
            success:(result)=>{

                if(result.success){
                    //表单数据
                    let headData = result.data.head.rows[0].values;
                    if(headData.hasOwnProperty('enablestate')){ 
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        if(enablestateValue == '2'){
                            //result.data.head.rows[0].values.enablestate.value = true;
                        }else{
                            //result.data.head.rows[0].values.enablestate.value = false;
                        }
                    }
                    
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                    //设置表单项enablestate可用
                    this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                    //设置所有按钮可用
                    this.props.button.setDisabled({
                        edit:false,
                        refresh:false,
                        queryBusiInfo:false,
                        logo:false
                    });

                }
            }
        });
	}
	
	//获取资金形态和财务组织
	getPkorgValue = () => {
		let pkorg = this.props.search.getAllSearchData(this.searchId);
		let freshpkorg = null;
		if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
			freshpkorg = pkorg.conditions[0].value;
			return freshpkorg;
		}else{
			return;
		}
	}
	getFundform = () => {
		let treeid = 'tree';
		let selectTree = this.props.syncTree.getSelectNode(treeid);
		let fundform = null;
		if(selectTree && selectTree.refcode){
			fundform = selectTree;
			return fundform;
		}
	}

	//刷新列表信息
    refreshHtml = () => {
		setButtonVisible(this.props,true);
		let searchId = LIST_PAGE_INFO.SEARCH_CODE;
		let pkorg = this.props.search.getAllSearchData(searchId);
		let freshpkorg = null;
		if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
			freshpkorg = pkorg.conditions[0].value;
		}else{
			return;
		}
		let treeid = 'tree';
		let selectTree = this.props.syncTree.getSelectNode(treeid);
		let pid = '';
		if(selectTree && !selectTree.pid){
			pid = selectTree.pid;
		}else{
			return;
		}
		pkorg.conditions[0].value.secondvalue = pid;

		let serval = [{
			"value": pkorg.conditions[0].value
		}]

		let queryInfo = this.props.search.getQueryInfo(searchId);
		let oid = queryInfo.oid;
		let data = {
			conditions: serval,
			//pageInfo: refreshpageInfo,
			pagecode: LIST_PAGE_INFO.PAGE_CODE,
			queryAreaCode: '',  //查询区编码
			oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType:'simple'
		};
		ajax({
			url: '/nccloud/cmp/bankaccountbook/aftereventinfo.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.editTable.setTableData(tableId, data[tableId], true)

						// 将部分先设置成不可编辑
	                    this.props.button.setButtonDisabled(['addLine','getin','print','refresh'],false);
	                    this.props.button.setButtonDisabled(['deleteLine','audit','antiaudit'],true);
					} else {
						setButtonDisable(this.props,false);
						this.props.editTable.setTableData(tableId, { rows: [] },false);
					}
				}
			}
		});
        
    }

	getData = (serval,json) => {
		// setButtonVisible(this.props,true);
		let queryInfo = this.props.search.getQueryInfo(LIST_PAGE_INFO.SEARCH_CODE);
		let oid = queryInfo.oid;
		let searchdata = {
			conditions: serval,
			//pageInfo: pageInfo,
			pagecode: "36070BACR_L01",
			queryAreaCode: "",  //查询区编码
			oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType: 'simple'
		};
		ajax({
			url: '/nccloud/cmp/bankaccount/bankaccountquery.do',
			data: searchdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						if(!data.head[this.tableId].rows[0].values.pk_bankaccrule){
							//设置查询区域
							let code = data.head[this.tableId].rows[0].values.code.value;
							let name = data.head[this.tableId].rows[0].values.name.value;
							let bankdoc = data.head[this.tableId].rows[0].values.pk_bankdoc.value;
							let pk_org = data.head[this.tableId].rows[0].values.pk_org.value;
							let pk_org_display = data.head[this.tableId].rows[0].values.pk_org.display;
							let pk_group = data.head[this.tableId].rows[0].values.pk_group.value;
							let pk_bankaccbas = data.head[this.tableId].rows[0].values.pk_bankaccbas.value;
							this.pk_org = pk_org;
							this.pk_group = pk_group;
							this.pk_bankaccbas = pk_bankaccbas;

							let pk_bankdoc_name = data.pk_bankdoc_name;
							



							// let pk_bankaccrule  = data.head[this.tableId].rows[0].values.pk_bankaccrule.value;
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.code',{ display: code, value: code });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.name',{ display: name, value: name });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.pk_bankdoc',{ display: pk_bankdoc_name,value: bankdoc });
							// this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.pk_bankdoc.name',{ display: bankdoc_name_value, value: bankdoc_name_value });
							// this.props.search.setSearchValByField(this.searchId, 'pk_org',{display:pk_org_display, value: pk_org });
							this.props.search.setSearchValByField(this.searchId, 'pk_group',{ value:pk_group });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas',{ value: pk_bankaccbas });
							// this.props.search.setSearchValByField(this.searchId, 'pk_bankaccrule',{ value: pk_bankaccrule });

							this.props.editTable.setTableData(this.tableId, data.body[this.tableId], true);
						}else{
							let code = data.bankaccbas[this.tableId].rows[0].values.code.value;
							let name = data.bankaccbas[this.tableId].rows[0].values.name.value;
							let bankdoc = data.bankaccbas[this.tableId].rows[0].values.pk_bankdoc.value;
							
							let pk_org = data.head[this.tableId].rows[0].values.pk_org.value;
							let pk_org_display = data.head[this.tableId].rows[0].values.pk_org.display;
							let pk_group = data.head[this.tableId].rows[0].values.pk_group.value;
							let pk_bankaccbas = data.head[this.tableId].rows[0].values.pk_bankaccbas.value;
							let pk_bankaccrule = data.head[this.tableId].rows[0].values.pk_bankaccrule.value;
							this.pk_org = pk_org;
							this.pk_group = pk_group;
							this.pk_bankaccbas = pk_bankaccbas;
							this.pk_bankaccrule = pk_bankaccrule;
							let pk_bankdoc_name = data.pk_bankdoc_name;
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.code',{ display: code, value: code });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.name',{ display: name, value: name });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.pk_bankdoc',{ display: pk_bankdoc_name, value: bankdoc });
							// this.props.search.setSearchValByField(this.searchId, 'pk_org',{display:pk_org_display, value: pk_org });
							this.props.search.setSearchValByField(this.searchId, 'pk_group',{ value:pk_group });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas',{ value: pk_bankaccbas });
							this.props.editTable.setTableData(this.tableId, data.body[this.tableId], true)
						}
						
						//设置表体区域
						// data.body[this.tableId].rows.forEach((val) => {
	
						// 	this.props.editTable.setValByKeyAndIndex(this.tableId,0,'pk_bankaccsub.code',{value: '111', display:'112', scale:0,isEdit:false });
						// });
						// 将部分先设置成不可编辑
//                     	this.props.button.setButtonDisabled(['addLine','getin','print','refresh'],false);
//                     	this.props.button.setButtonDisabled(['deleteLine','audit','antiaudit'],true);
					} else {
						setButtonDisable(this.props,false);
						this.props.editTable.setTableData(this.tableId, { rows: [] },false);
					}
				}
			}
		});
	};
	selected = (props, moduleId, record, index, status) =>{
		//props,react组件
		// console.log(props);

		// //moduleId:页面区域id，就是tablearea,json里的area下的第一个
		// console.log(moduleId);

		// //record:本条记录
		// console.log(record.key);

		// //index:本条记录的位置
		// console.log(index);

		// //status:选中的状态，选中为true,取消选中为false;
		// console.log(status);

		if(status){
			
		}

	}
	allSelected = (props,moduleId,status,length) =>{
		//props,react组件
		// console.log(props);

		// //moduleId:页面区域id，就是tablearea,json里的area下的第一个
		// console.log(moduleId);

		// //status:选中的状态，选中为true,取消选中为false;
		// console.log(status);

		// //length:选中的数量
		// console.log(length);

	}
	
	//选择数据时控制按钮显隐性
    selectedShowBtn = () =>{
        let selectedLength = this.props.editTable.getCheckedRows(this.tableId).length;//选择数据条数
        if(selectedLength > 0){
			this.props.button.setButtonDisabled(['addLine','deleteLine','getin','audit','antiaudit','print','refresh'],false);
        }else if(selectedLength == 0){
            this.props.button.setButtonDisabled(['deleteLine','audit','antiaudit'],true);
        }
    }
	
	//选择左树区域方法
	onDeptSelect = (props) =>{
		//let refcode = props.refcode;
		if(props && props.code){
			let pkorg1 = this.props.search.getSearchValByField(searchId,"pk_org").value;
			if(pkorg1.firstvalue==null||pkorg1.firstvalue==""){
                //不选组织时，切换左树不做反应
			}else{
				let pkorg = this.props.search.getAllSearchData(searchId);//此方法对必输项校验
			    let pkfirstvalue = null;
			    if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
				    pkfirstvalue = pkorg.conditions[0].value;
				    pkfirstvalue.secondvalue = props.id;
					this.onchangeGetDate(pkfirstvalue,props.id);	
					this.props.button.setButtonDisabled(['Edit','Exsign','Refresh'],false);
			    }
			}
		}
		//this.getData(serval);
	}
	//改变选择左树区域方法
	onSelectEve = (props) =>{
		// console.log("event");
		// console.log(props);
	}
	//编辑后事件
	afterEventFn = () =>{
		toast({ color: 'warning', content: this.state.json['36070BACR-000035'] });/* 国际化处理： 编辑后事件*/
	}
	

	render() {
		let {
            cardTable,
            button,
            search,
            DragWidthCom,
            syncTree,
            editTable,
            table,
            ncmodal,
            BillHeadInfo
        } = this.props;
		let buttons = this.props.button.getButtons();
		
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButton, getButtons } = button;
		let { createSyncTree } = syncTree;
		let createNCModal  = ncmodal.createModal;
		let json1 = this.state.json; 
const { createBillHeadInfo } = BillHeadInfo;
		return (
            <div className="nc-bill-list bankaccountbook-list">
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-bill-header-area"
                >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:
                                json1[
                                    "36070BACR-000038"
                                ] /* 国际化处理： 银行账户控制规则*/,
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: "list_head", // classname= header-button-area
                            buttonLimit: 3,
                            onButtonClick: buttonClick.bind(
                                this,
                                json1
                            ),
                            popContainer: document.querySelector(
                                ".header-button-area"
                            )
                        })}
                    </div>
                </NCDiv>
                <div className="title-search-detail-search">
                    {NCCreateSearch(searchId, {
                        // clickSearchBtn: searchBtnClick.bind(this),    //classname= nc-bill-search-area
                        onAfterEvent: searchAfterEvent.bind(this), // 编辑后事件
                        defaultConditionsNum: 4, //默认显示几个查询条件
                        showAdvBtn: false,
                        hideBtnArea: true // 隐藏查询按钮区域
                    })}
                </div>
                <div className="tree-table">
                    <DragWidthCom
                        // 左树区域
                        leftDom={
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId: "tree",
                                    needEdit: false, //不启用编辑
                                    showLine: true, //显示连线
                                    needSearch: false, //是否需要搜索框,
                                    defaultExpandAll: false, //默认展开所有节点
                                    // onSelectEve: this.onSelectTree.bind(this),//选择
                                    onSelectedChange: this.onDeptSelect.bind(
                                        this
                                    )
                                    // onSelectEve: this.onDeptSelect.bind(this)
                                })}
                            </div>
                        } //左侧区域dom
                        // 右卡片区域
                        rightDom={
                            <div className="table-area">
                                {/* {createSimpleTable(this.tableId, {//列表区
                                    handlePageInfoChange: pageInfoClick,
									tableModelConfirm: tableModelConfirm,
									showCheck: true,
									onSelected:this.selected.bind(this),
									onSelectedAll:this.allSelected.bind(this)
								})}, */}
                                {createEditTable(this.tableId, {
                                    //表格id
                                    //onCloseModel: onCloseModelFn,       // 弹窗控件点击关闭事件
                                    onAfterEvent: afterEvent.bind(this), // 控件的编辑后事件
                                    handlePageInfoChange: pageInfoClick,
                                    tableModelConfirm: tableModelConfirm,
                                    //onSelected: this.selected.bind(this),   // 左侧选择列单个选择框回调
                                    onSelected: this.selectedShowBtn.bind(
                                        this
                                    ), // 单选时控制按钮显隐性
                                    onSelectedAll: this.selectedShowBtn.bind(
                                        this
                                    ), // 多选时控制按钮显隐性
                                    showCheck: true,
                                    showIndex: true,
                                    //onSelectedAll: this.selected.bind(this),        // 左侧选择列全选回调
                                    //selectedChange: this.allSelected.bind(this),  // 选择框有变动的钩子函数
                                    params: "test"
                                })}
                            </div>
                        } //右侧区域dom
                        defLeftWid="180px" // 默认左侧区域宽度，px/百分百
                    />
                </div>
                <div className="table-detail-info">
                    {createNCModal("onDelete", {
                        title:
                            json1[
                                "36070BACR-000036"
                            ] /* 国际化处理： 确认信息*/,
                        content:
                            json1[
                                "36070BACR-000037"
                            ] /* 国际化处理： 删除操作不可逆,确定是否继续?*/,
                        beSureBtnClick: onDelete.bind(this)
                    })}
                </div>
            </div>
        );
	}
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: '36070BACR',
	billinfo: {
        billtype: 'card',
        pagecode: '360701BACR_L01',
        bodycode: 'pk_bankaccount_table'
    },
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/