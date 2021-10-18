/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,cacheTools,createPageIcon } from 'nc-lightapp-front';
//import Refer from '../../../../uap/refer/riart/billtype/index.js';
const { NCBreadcrumb, NCTabsControl,NCDiv } = base;
const NCBreadcrumbItem = NCBreadcrumb.NCBreadcrumbItem;
//引入常量定义
import { module_id, base_url, button_limit, card_page_id, card_from_id, card_table_id,page_url} from '../cons/constant.js';
import axios from 'axios';
import { high } from 'nc-lightapp-front';
const { Refer } = high;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,tableButtonClick,refresh } from './events';
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
// import { Navbar } from 'tinper-bee';
// const NavItem = Navbar.NavItem;
// const Header = Navbar.Header;
// const Brand = Navbar.Brand;
// const Nav = Navbar.Nav;
 const {NCTabs}=base;
 const NCTabPane=NCTabs.NCTabPane;

class List extends Component {
	constructor(props) {
		super(props);
		
		this.moduleId = '2052';
		this.searchId = 'search_D5';
		this.tableId = 'table_D5';
		this.pageId= '36070PBR_D5_list';
		this.state = { currentLocale: 'zh-CN',
		 numvalues: {} };
	}

	componentDidMount() {

		 let url=window.parent.location.href;
		 let obj=this.GetQuery(url);
		 console.log(obj);
		 if (obj.src === 'recbills') {
			let searchData = cacheTools.get('recbillsData');
			if(searchData && searchData.length > 0){
			this.linkQueryData(searchData );
			}
		}else{
		   //this.getData(serval);
		}
		// let { currentLocale } = this.state;
		// axios
		// 	.get(`../../../../public/lang/standard/${this.moduleId}-${currentLocale}.json`)
		// 	.then((res) => {
		// 		intl.init({
		// 			currentLocale,
		// 			locales: {
		// 				[currentLocale]: res.data
		// 			}
		// 		});
		// 	})
		// 	.then(() => {
		// 		this.setState();
		// 	});
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
			return 'main-button'
		}else {
			return 'secondary - button'
		}
	};
	//联查函数

	//联查单据
	GetQuery  = (query) => {
		    let theRequest = {};
		    if (query.indexOf('?') != -1) {
		        let str = query.substr(1);
		        if (str.indexOf('&') != -1) {
		            let strs = str.split('&');
		            for (let i = 0; i < strs.length; i++) {
		                theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
		            }
		        } else {
		            theRequest[str.split('=')[0]] = str.split('=')[1];
		        }
		    }
		    return theRequest;
		};
	linkQueryData = (searchData) => {

		let sendArr = {
			'pks':searchData
		}
		ajax({
			url: '/nccloud/cmp/paybills/linkqueryrecbill.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {

						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
							
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}

				}
			}
		});
	}
	getData = (serval) => {

		let searchVal = this.props.search.getAllSearchData(this.searchId);//新盘适配插叙条件
		searchVal.conditions.push(...serval);
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    	// let searchVal = this.props.search.getAllSearchData(this.searchId);
		let data={
			querycondition: searchVal,
			// {
			// 	logic:"and" ,
			// 	conditions: [
			// 		 {
			// 		 	field: 'billdate',
			// 		 	oprtype: 'between',
			// 		 	value: {
			// 		 		firstvalue: '2015-04-10',
			// 		 		secondvalue: '2018-05-20'
			// 		 	}
			// 		 }, 
			// 		{
			// 			field: 'pk_org',
			// 			value: {
			// 				firstvalue: '0001A110000000003BSM',
			// 				secondvalue: null
			// 			},
			// 			oprtype: '=',
			// 			display: '股份公司'
			// 		}	
			// 	            ],
			// },
			 	custcondition: {
				logic: "and",   //逻辑操作符，and、or
				conditions: [
				],
			},
				pageInfo: {
				 pageIndex: 0,
				 pageSize: 10
				 },
			pagecode: this.pageId,
			queryAreaCode:this.searchId,
			oid:'1001Z61000000000B6Z5',
			querytype:'tree'
		};
		 ajax({
		 	url: '/nccloud/cmp/paybills/query.do',
		 	data: data,
		 	success: (res) => {
		 		let { success, data } = res;
		 		if (success) {
					 //this.props.table.setAllTableData(this.tableId, res.data[this.tableId]);
					 if (data) {
						this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
					} 
					else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
					if (data.statusNum) {
						this.setState({ numvalues: data.statusNum });
					}
					
					
		 		}
		 	}
		 });
	};
	refresh = () => {
		//查询condition 
		 let pageInfo = props.table.getTablePageInfo(this.tableId);
		 let refreshsearchVal = props.search.getAllSearchData(this.searchId); 
		 let data={
			 querycondition:refreshsearchVal,
			 custcondition: {
				 logic: "and",   //逻辑操作符，and、or
				 conditions: [
				 ],
			 },
			 pageInfo:pageInfo,
			 pagecode: '36070PBR_D5_list',
			 queryAreaCode: 'search_D5',  //查询区编码
			 oid:'1001Z61000000000B6Z5',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			 querytype:'tree'
		 };
		 ajax({
			 url: '/nccloud/cmp/paybills/query.do',
			 data: data,
			 success: (res) => {
				 let { success, data } = res;
				 if (success) {
					 if(data){
						 this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
					 }else{
						 this.props.table.setAllTableData(this.tableId, {rows:[]});
					 }
					 
				 }
			 }
		 });
	 };

	
		//页签筛选
		navChangeFun = (status, className, e) => {
			let serval;
			switch (status) {
				case '0':
					serval = [
						{
							 field: 'bill_status',
							value: {
								firstvalue: '-10',
								secondvalue: null
							},
							oprtype: '='
						}
					];
					this.getData(serval);
					break;
				case '1':
					serval = [
						{
							 field: 'bill_status',
							value: {
								firstvalue: '-1',
								secondvalue: null
							},
							oprtype: '='
						}
					];
					this.getData(serval);
					break;
				case '2':
					serval = [
						{
							 field: 'bill_status',
							value: {
								firstvalue: '2',
								secondvalue: null
							},
							oprtype: '='
						}
					];
					this.getData(serval);
					break;
					case '3':
					serval = [
					];
					this.getData(serval);
					break;
			}
		};

		modalContent () {
			return (
				<div className="addModal">
					{  this.props.form.createForm('form1') }
	
				</div>
			)
		};
	

		render() {
			let numvalues = this.state.numvalues;
			let { table, button, search,BillHeadInfo } = this.props;
			let buttons = this.props.button.getButtons();
			let multiLang = this.props.MutiInit.getIntl(this.moduleId);
			let { createSimpleTable, getTablePageInfo } = table;
			let { NCCreateSearch } = search;
			let { createButton, getButtons, createButtonApp } = button;
			const {modal } = this.props;
			const { createBillHeadInfo } = BillHeadInfo;
            let { createModal } = modal;

			/* 按钮适配 第二步: 从 props.button中取到 createButtonApp 方法用来创建按钮组*/
			console.log(buttons, 9999)
			console.log(this.props.button.createButtonApp, 8888)
			console.log(this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000042'),getTablePageInfo(this.tableId))/* 国际化处理： 数据信息*/
			return (
				<div className="nc-bill-list">
					{/**创建websocket连接 */}
					{api.comm.createListWebSocket(this.props, {
						tableAreaCode: cons.list.tableCode,
						tablePkName: cons.field.pk,
						billtype: cons.comm.billType
						// serverLocation: '10.16.2.231:9991'
					})}
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
						
							<div className="header-title-search-area">
							{createBillHeadInfo(
                                {
                                    title: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000043'),//标题
                                    initShowBackBtn: false
                                }
                            )}
							</div>
							<div className="header-button-area">
							{/* <Refer
							value={this.state.aaa}
							onChange={(value)=>{
								this.setState({
									aaa: value
								})
							}}
							clickContainer={<button>交易类型</button>}
				   /> */}
	        {this.props.button.createButtonApp({
                        area: 'list_head',
                        buttonLimit: 3, 
                        onButtonClick: buttonClick.bind(this), 
                        popContainer: document.querySelector('.header-button-area')
                    })}

							
						</div>
						</NCDiv>
						<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this,),
						// defaultConditionsNum: 2,
						showAdvBtn: true,                           //  显示高级按钮
						//onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
						searchBtnName: multiLang && multiLang.get('3618-0029'),                        //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
						// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
						oid:'1001Z61000000000B6Z5'        //查询模板的oid，用于查询查询方案

					})}
				</div>
					<div className="tab-definInfo-area">
						<NCTabsControl defaultKey={1}>
							<div key={0} clickFun={this.navChangeFun.bind(this, '0')}>
								this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000045')<span>{numvalues && numvalues.SAVED || 0}</span>/* 国际化处理： 保存*/
							</div>
							<div key={1} clickFun={this.navChangeFun.bind(this, '1')}>
								this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000046')<span>{numvalues && numvalues.FORCOMMIT || 0}</span>/* 国际化处理： 待审批*/
							</div>
							<div key={2} clickFun={this.navChangeFun.bind(this, '2')}>
								this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000047')<span>{numvalues && numvalues.APPRING || 0}</span>/* 国际化处理： 审批中*/
							</div>
							<div key={4} clickFun={this.navChangeFun.bind(this, '3')}>
								this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000048')<span>{numvalues && numvalues.ALL || 0}</span>/* 国际化处理： 全部*/
							</div>
						</NCTabsControl>
					</div>
                    <div>
                     {createModal('reverse', {
	                 title: multiLang && multiLang.get(this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000021')),/* 国际化处理： 确认删除*/
						content: multiLang && multiLang.get(this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000044')),/* 国际化处理： 确认删除？*/
						size:'lg' //  模态框大小 sm/lg/xlg
                      })}

					</div>

					<div style={{ height: '10px' }} />
					<div className="nc-bill-table-area">
						{createSimpleTable(this.tableId, {
							handlePageInfoChange: pageInfoClick.bind(this),
							tableModelConfirm: tableModelConfirm,
							showCheck: true,
							showIndex: true
						})}
					</div>
					<div>
              </div>

				</div>
			);
		}
	}  
		

List = createPage({
	initTemplate: initTemplate,
	mutiLangCode: '2052'
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/