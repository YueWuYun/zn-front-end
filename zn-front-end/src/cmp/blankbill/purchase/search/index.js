/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cacheTools, print ,toast} from 'nc-lightapp-front';
//import Refer from '../../../../uap/refer/riart/billtype/index.js';
const { NCBreadcrumb, NCTabsControl, NCButton } = base;
const NCBreadcrumbItem = NCBreadcrumb.NCBreadcrumbItem;
import {cardCache} from "nc-lightapp-front";
let {setDefData, getDefData } = cardCache;

//引入常量定义
import {
	module_id,
	base_url,
	button_limit,
	list_page_id,
	list_from_id,
	list_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../cons/constant.js';
import { PAYBILL_CONST } from '../cons/constant.js';
import axios from 'axios';
import { high } from 'nc-lightapp-front';
const { Refer, NCUploader, BillTrack, ApproveDetail, PrintOutput } = high;
import {
	buttonClick,
	initTemplate,
	searchBtnClick,
	pageInfoClick,
	tableModelConfirm,
	tableButtonClick,
	refresh
} from './events';

const { NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;

class List extends Component {
	constructor(props) {
		super(props);

		this.moduleId = '2052';
		this.searchId = 'search_D5';
		this.tableId = 'table_D5';
		this.pageId = '36070PBR_L04';
		this.navChange=0;
		this.state = {
			currentLocale: 'zh-CN',
			numvalues: {},
			billno: null, // 单据编号
			showUploader: false,
			target: null,
			billId: '',
			billid: '',
			billtype: '',
			tradetype: '',
			tpflag: true,
			show: false,
			showAppr: false,
			shoWIns: false,
			sourceData: null,
			last_pk:null,
			outputData: {
				funcode: '36070PBM', //功能节点编码，即模板编码
				nodekey: 'NCCLOUD', //模板节点标识
				printTemplateID: '1001Z610000000004R6L', //模板id
				oids: [],
				outputType: 'output'
			}
		};
		initTemplate.call(this, props);
	}

	componentDidMount() {
		let url = window.parent.location.href;
		let obj = this.GetQuery(url);
		console.log(obj);
		this.restoreData(); 

		if (obj.src === 'recbills') {
			let searchData = cacheTools.get('recbillsData');
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		} else if (this.props.getUrlParam('pk_ntbparadimvo')) {
			this.getLinkData();
		} else {
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
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	//联查函数

	//联查单据
	GetQuery = (query) => {
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
			pks: searchData
		};
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
	};
	getLinkData = (serval) => {
		ajax({
			url: '/nccloud/cmp/paybills/linkplanquery.do',
			data: { pk: this.props.getUrlParam('pk_ntbparadimvo'), pageCode: this.pageId },
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						if (data.grid) {
							this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
						} else {
							this.props.table.setAllTableData(this.tableId, { rows: [] });
						}
						if (data.statusNum) {
							this.setState({ numvalues: data.statusNum });
						}
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
				}
			}
		});
	};
	getData = (serval) => {
		let searchVal = this.props.search.getAllSearchData(this.searchId); //新盘适配插叙条件
		if (!searchVal) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000085') });/* 国际化处理： 您有必输项未填写*/
			return;
		}
		searchVal.conditions.push(...serval);
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		// let searchVal = this.props.search.getAllSearchData(this.searchId);
		let data = {
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
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: {
				pageIndex: 0,
				pageSize: 10
			},
			pagecode: this.pageId,
			queryAreaCode: this.searchId,
			//oid: '1001Z61000000000B6Z5',
			oid: '1001Z61000000002IZNN',

			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/paybills/query.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					//this.props.table.setAllTableData(this.tableId, res.data[this.tableId]);
					if (data.grid) {
						this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
						console.log(this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000086')+data.grid[this.tableId].allpks[0]);/* 国际化处理： 我是ID*/
						this.setState({last_pk:data.grid[this.tableId].allpks[0]});
					} else {
						//this.props.table.setAllTableData(this.tableId, { rows: [] });
						this.props.table.setAllTableData(this.tableId, {
							rows: [],
							pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 }
						});
					}
					if (data.statusNum) {
						this.setState({ numvalues: data.statusNum });
						
					}
				}
			}
		});
	};

	refresh = () => {
		let search_Id = 'search_D5';
		let table_Id = 'table_D5';
		let page_Id = '36070PBR_D5_list';
		//查询condition
		let pageInfo = props.table.getTablePageInfo(table_Id);
		let refreshsearchVal = props.search.getAllSearchData(search_Id);
		let data = {
			querycondition: refreshsearchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: pageInfo,
			pagecode: '36070PBR_D5_list',
			queryAreaCode: 'search_D5', //查询区编码
		oid: '1001Z61000000002IZNN', //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/paybills/query.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						props.table.setAllTableData(table_Id, data.grid[table_Id]);
						this.setState({last_pk:data.grid[this.tableId].allpks[0]});
						if (data.statusNum) {
							this.setState({ numvalues: data.statusNum });
						}
					} else {
						props.table.setAllTableData(table_Id, { rows: [] });
					}
				}
			}
		});
	};
	closeApprove = () => {
		this.setState({
			showAppr: false
		});
	};
	cancel = () => {
		this.setState({
			shoWIns: false
		});
	}
	affirm = (info) => {
		console.log(info);
		this.setState({
			shoWIns: false
		});
	}
	click = () => {
		// alert('1');
		// this.setState({
		//  sourceData: text1,
		//  show: true
		// })
	};
	 // 附件的关闭点击
	 onHideUploader = () => {
        this.setState({
            showUploader: false
        })
	}
	
	setStateCache = () =>{
		        let thisstate = this.state;
		        setDefData(PAYBILL_CONST.paybill_stateKey, PAYBILL_CONST.paybillCacheKey, thisstate);
		    }
  
	// 还原列表页数据
	    restoreData = () =>{
		                //获取页签数据
		        let cachestate = getDefData(PAYBILL_CONST.paybill_stateKey, PAYBILL_CONST.paybillCacheKey);
		        if (cachestate) {
		            let keys = Object.keys(cachestate);
		            for(let i = 0,l = keys.length; i<l;i++){
		                let key = keys[i];
		                this.state[key] = cachestate[key];
		
		            }
		           
		        }
		    }

	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
		switch (status) {
			case '0':
			this.navChange=0;
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
			this.navChange=1;
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
			this.navChange=2;
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
			this.navChange=3;
				serval = [];
				this.getData(serval);
				break;
		}
	};

	render = () => {
		let numvalues = this.state.numvalues;
		let { table, button, search } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable, getTablePageInfo } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons, createButtonApp } = button;
		const { ncmodal } = this.props;
		//const { modal } = this.props;
		let { createModal } = ncmodal;
		let { showUploader, target, billno, billId, tradetype, tpflag, showAppr, shoWIns, sourceData } = this.state; //附件相关内容变量


		return (
			<div className="nc-bill-list">		
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						// defaultConditionsNum: 2,
						showAdvBtn: true, //  显示高级按钮
						//onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
						searchBtnName: multiLang && multiLang.get('3618-0029'),
						onlyShowAdvArea:true
						 //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom
						// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom
						//oid: '1001Z61000000000B6Z5' //查询模板的oid，用于查询查询方案
						//oid: '1001Z61000000002IZNN' //查询模板的oid，用于查询查询方案
					})}
				</div>
			</div>
		);
	};
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: '2052'
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));
//export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/