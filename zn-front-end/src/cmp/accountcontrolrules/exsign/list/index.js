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
import { requesturl } from '../cons/requesturl.js';


// let searchId = LIST_PAGE_INFO.SEARCH_CODE;
let tableId = LIST_PAGE_INFO.TABLE_CODE;
let pageId = LIST_PAGE_INFO.PAGE_CODE;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = APP_INFO.MODULE_ID;
		this.tableId = LIST_PAGE_INFO.TABLE_CODE;
		this.srcFuncode = '';
		this.pk_org = '';
		// this.searchId = LIST_PAGE_INFO.SEARCH_CODE;
		// this.treeId = 'tree';
	
		this.state = {
			showDeleteModal:false,
			tableButtonKey:-1,
			isEdit: false,
			json: {}
		};
		
	}
	componentDidMount() {
		this.initButton();
		//查询单据详情	
		this.toggleShow();
		
	}
	//多语显示问题
	componentWillMount() {
		let callback = (json) => {
		  this.setState({json})
		  initTemplate.call(this,this.props,json);
		//   this.onInit(json);//此json就是指引用的多语文件；哪些方法和文件想用到，都需要把此json传过去，然后用：json['xx-xx']调用；
		}
		getMultiLang({moduleId: '36070BAES',domainName: 'cmp',callback})
	}	

	
	initButton(){
		let buttonarr = LIST_BUTTON_USE.ALL;
		let buttonflag = false;
		this.props.button.setButtonVisible(buttonarr,buttonflag);
		// 将所有的按钮先设置成不可编辑
		setButtonDisable(this.props,true);
	}

	//切换页面状态f
	toggleShow = () => {
		let pk_org = this.props.getUrlParam('pk_org');
		let srcFuncode = this.props.getUrlParam('srcFunCode');
		this.srcFuncode = srcFuncode;
		this.pk_org = pk_org;
		let data = { pk_org: pk_org, srcFunCode: srcFuncode };
		
		ajax({
			url: requesturl.query,
			data: data,
			success: (res) => {
				if (res.data) {
					//处理公式
//                     processFormulamsg(this.props, res);
					
					this.props.editTable.setTableData('exsign_table', res.data[tableId]);

				} else {
					this.props.editTable.setTableData('exsign_table', {rows: []});
				}
			}
		});
		
	};




	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button'
		} else {
			return 'secondary - button'
		}
	};

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
		this.toggleShow();
        
    }

	getData = (serval,json) => {
		// setButtonVisible(this.props,true);
		// let queryInfo = this.props.search.getQueryInfo(LIST_PAGE_INFO.SEARCH_CODE);
		// let oid = queryInfo.oid;
		let searchdata = {
			conditions: serval,
			//pageInfo: pageInfo,
			pagecode: "36070BAES_L01",
			queryAreaCode: "",  //查询区编码
			// oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
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
							let pk_group = data.head[this.tableId].rows[0].values.pk_group.value;
							let pk_bankaccbas = data.head[this.tableId].rows[0].values.pk_bankaccbas.value;
							this.pk_org = pk_org;
							this.pk_group = pk_group;
							this.pk_bankaccbas = pk_bankaccbas;

							// let pk_bankaccrule  = data.head[this.tableId].rows[0].values.pk_bankaccrule.value;
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.code',{ display: code, value: code });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.name',{ display: name, value: name });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.pk_bankdoc',{ display: bankdoc, value: bankdoc });
							this.props.search.setSearchValByField(this.searchId, 'pk_org',{ value: pk_org });
							this.props.search.setSearchValByField(this.searchId, 'pk_group',{ value:pk_group });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas',{ value: pk_bankaccbas });
							// this.props.search.setSearchValByField(this.searchId, 'pk_bankaccrule',{ value: pk_bankaccrule });

							this.props.editTable.setTableData(this.tableId, data.body[this.tableId], true);
						}else{
							let code = data.bankaccbas[this.tableId].rows[0].values.code.value;
							let name = data.bankaccbas[this.tableId].rows[0].values.name.value;
							let bankdoc = data.bankaccbas[this.tableId].rows[0].values.pk_bankdoc.value;
							
							let pk_org = data.head[this.tableId].rows[0].values.pk_org.value;
							let pk_group = data.head[this.tableId].rows[0].values.pk_group.value;
							let pk_bankaccbas = data.head[this.tableId].rows[0].values.pk_bankaccbas.value;
							let pk_bankaccrule = data.head[this.tableId].rows[0].values.pk_bankaccrule.value;
							this.pk_org = pk_org;
							this.pk_group = pk_group;
							this.pk_bankaccbas = pk_bankaccbas;
							this.pk_bankaccrule = pk_bankaccrule;
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.code',{ display: code, value: code });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.name',{ display: name, value: name });
							this.props.search.setSearchValByField(this.searchId, 'pk_bankaccbas.pk_bankdoc',{ display: bankdoc, value: bankdoc });
							this.props.search.setSearchValByField(this.searchId, 'pk_org',{ value: pk_org });
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
		// //console.log(props);

		// //moduleId:页面区域id，就是tablearea,json里的area下的第一个
		// //console.log(moduleId);

		// //record:本条记录
		// //console.log(record.key);

		// //index:本条记录的位置
		// //console.log(index);

		// //status:选中的状态，选中为true,取消选中为false;
		// //console.log(status);

		if(status){
			
		}

	}
	allSelected = (props,moduleId,status,length) =>{
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
			    }
			}
		}
		//this.getData(serval);
	}
	//改变选择左树区域方法
	onSelectEve = (props) =>{
		// //console.log("event");
		// //console.log(props);
	}
	//编辑后事件
	afterEventFn = () =>{
		toast({ color: 'warning', content: this.state.json['36070BAES-000035'] });/* 国际化处理： 编辑后事件*/
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
                                    "36070BAES-000038"
                                ] /* 国际化处理： 超额签核*/,
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
                <div className="nc-bill-table-area">
                    {createEditTable(LIST_PAGE_INFO.TABLE_CODE, {
                        dataSource: APP_INFO.DATA_SOURCE,
                        pkname: ITEM_INFO.PK,
                        handlePageInfoChange: pageInfoClick.bind(this),
                        tableModelConfirm: tableModelConfirm,
                        onAfterEvent: afterEvent.bind(this),
                        showCheck: true,
                        showIndex: true
                        // onSelected: buttonVisible.bind(this, this.props),
                        // onSelectedAll: buttonVisible.bind(this, this.props),
                        //双击进入卡片
                    })}
                </div>
                <div className="table-detail-info">
                    {createNCModal("onDelete", {
                        title:
                            json1[
                                "36070BAES-000036"
                            ] /* 国际化处理： 确认信息*/,
                        content:
                            json1[
                                "36070BAES-000037"
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
	mutiLangCode: '36070BAES',
	billinfo: {
        billtype: 'card',
        pagecode: '360701BACR_L01',
        bodycode: 'exsign_table'
    },
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/