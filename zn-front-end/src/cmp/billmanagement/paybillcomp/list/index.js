/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
﻿import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, cacheTools, print,toast,createPageIcon } from 'nc-lightapp-front';
import { commonurl } from '../../../public/utils/constant';
const { NCBreadcrumb, NCTabsControl, NCButton } = base;
const NCBreadcrumbItem = NCBreadcrumb.NCBreadcrumbItem;
import {cardCache, getMultiLang} from "nc-lightapp-front";
let {setDefData, getDefData } = cardCache;
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
import  {go2Card}  from '../util/goToCard.js';
//引入常量定义
import {
	oid,
	comp_setServal
} from '../cons/constant.js';
import { PAYBILL_CONST } from '../cons/constant.js';
import axios from 'axios';
import { high } from 'nc-lightapp-front';
const { Refer, NCUploader, BillTrack, ApproveDetail } = high;
import {
	buttonClick,
	initTemplate,
	searchBtnClick,
	pageInfoClick,
	tableModelConfirm,
	tableButtonClick,
	refresh
} from './events';
const { NCDiv } = base;


// import { Navbar } from 'tinper-bee';
// const NavItem = Navbar.NavItem;
// const Header = Navbar.Header;
// const Brand = Navbar.Brand;
// const Nav = Navbar.Nav;
//const { NCTabs } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"
const NCTabPane = NCTabs.NCTabPane;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class List extends Component {
	constructor(props) {
		super(props);

		this.moduleId = '2052';
		this.searchId = 'search_D5';
		this.tableId = 'table_D5';
		this.pageId = '36070PBR_L04';
		this.navChange = 3;
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
			tpflag: false,
			show: false,
			showAppr: false,
			shoWIns: false,
			sourceData: null
		};
		initTemplate.call(this, props);
	}

	componentDidMount() {
		let url = window.parent.location.href;
		let obj = this.GetQuery(url);
		this.restoreData(); 
		if (obj.src === 'recbills') {
			let searchData = cacheTools.get('recbillsData');
			if (searchData && searchData.length > 0) {
				this.linkQueryData(searchData);
			}
		} else  if(this.props.getUrlParam('pk_ntbparadimvo')){
			this.getLinkData();
		
		}else{
			//this.getData(serval);
		}

	};
	componentWillMount() {
		        let callback = (json) => {
			 this.setState({ json });
			 saveMultiLangRes(this.props,json);//缓存多语资源
		        };
		      	getMultiLang({ moduleId:{ 
			[ 'tmpub']:['3601'],
			['cmp']: [PAYBILL_CONST.appcode, '36070']
		   } , callback });
		   };


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
			data:  { pk: this.props.getUrlParam('pk_ntbparadimvo'), pageCode: this.pageId },
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
	getData = (groupCondition) => {
		let search_oid=oid;
		if (this.props.meta.getMeta()[this.searchId].oid) {
			search_oid =this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
	  }
		let searchVal = this.props.search.getAllSearchData(this.searchId); //新盘适配插叙条件
		if (!searchVal) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000047') });/* 国际化处理： 您有必输项未填写*/
			return;
		}
		//searchVal.conditions.push(...serval);
		searchVal.conditions.push(...comp_setServal);
		let conditions=Array.isArray(groupCondition) ? groupCondition : [groupCondition];
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		// let searchVal = this.props.search.getAllSearchData(this.searchId);
		let data = {
			querycondition: searchVal,
			custcondition: {
				logic: "or",   //逻辑操作符，and、or
				conditions
			},
			pageInfo: {
				pageIndex: 0,
				pageSize: 10
			},
			pagecode: this.pageId,
			queryAreaCode: this.searchId,
			//oid: '1001Z61000000000B6Z5',
			//oid: '1001Z61000000002IZNN',
			oid: search_oid,	
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

	DoubleClick=(record, index,props,e)=> {
		 this.setStateCache();
		go2Card(props,{status:"browse",id:record.pk_paybill.value,
		bill_status:record.bill_status.value,is_cf:record.is_cf.value} ,{} );
	
	}
	refresh = () => {
		let  search_oid=oid
		if (this.props.meta.getMeta()[this.searchId].oid) {
			search_oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
	  }	
		//查询condition
		let pageInfo = props.table.getTablePageInfo(this.tableId);
		let refreshsearchVal = props.search.getAllSearchData(this.searchId);
		refreshsearchVal.conditions.push(...comp_setServal);
		let data = {
			querycondition: refreshsearchVal,
			custcondition: {
				logic: "and",   //逻辑操作符，and、or
				conditions: [
				   {
					   field: 'source_flag',
					   value: {
						   firstvalue: 9,
						   secondvalue: null
					   },
					   oprtype: '='
				   }
					
				],
			},
			pageInfo: pageInfo,
			pagecode: '36070PBR_D5_list',
			queryAreaCode: 'search_D5', //查询区编码
			oid: search_oid,
			querytype: 'tree'
		};
		ajax({
			url: '/nccloud/cmp/paybills/query.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
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
	closeApprove = () => {
		this.setState({
			showAppr: false
		});
	};
	cancel= () => {
		this.setState({
			shoWIns: false
		});
	}
	affirm= (info) => {
		//console.log(info);
		this.setState({
			shoWIns: false
		});
	}
	click= () => {
		// alert('1');
		// this.setState({
		//  sourceData: text1,
		//  show: true
		// })
	}

	setStateCache = () =>{
		        let thisstate = this.state;
		        setDefData(PAYBILL_CONST.paybill_stateKey, PAYBILL_CONST.paybillCacheKey, thisstate);
		    }

			// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		let cachesearch = getDefData(PAYBILL_CONST.search_key, PAYBILL_CONST.paybillCacheKey);
		if (cachesearch && cachesearch.conditions) {
			// this.props.search.setSearchValue(this.searchId, cachesearch);
			for (let item of cachesearch.conditions) {
				if (item.field == 'bill_date') {
					// 时间类型特殊处理
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(this.searchId, item.field, {
						display: item.display,
						value: time
					});
				} else {
					this.props.search.setSearchValByField(this.searchId, item.field, {
						display: item.display,
						value: item.value.firstvalue
					});
				}
			}
		}
	};
  
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
		let groupCondition;
		switch (status) {
			case '0':
			this.navChange = 0;
			groupCondition =PAYBILL_CONST.SAVED;
				// serval = [
				// 	{
				// 		field: 'bill_status',
				// 		value: {
				// 			firstvalue: '-10',
				// 			secondvalue: null
				// 		},
				// 		oprtype: '='
				// 	}
				// ];
				this.getData(groupCondition);
				break;
				case '9':
				this.navChange = 9;
				groupCondition =PAYBILL_CONST.UNCONFIRM;
				this.getData(groupCondition);
				break;
			case '3':
			groupCondition = [];
				this.getData(groupCondition);
				break;
		}
	};

	buttonUsability= () => {
	let selectData = this.props.table.getCheckedRows(this.tableId);
	   if(selectData&&selectData.length>=1){
		 this.props.button.setButtonDisabled( ['delete','linkquerybill','billlinkquery','linkaprv','BillLQueryVoucher'],false)
	  } else{
		  this.props.button.setButtonDisabled( ['delete','linkquerybill','billlinkquery','linkaprv','BillLQueryVoucher'],true)
	  }
	 };
	 // 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	render = () => {
		let numvalues = this.state.numvalues;
		let { table, button, search ,BillHeadInfo} = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable, getTablePageInfo } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons, createButtonApp } = button;
		//const { modal } = this.props;
		const { ncmodal } = this.props;
		let { createModal } = ncmodal;
		let { showUploader, target, billno, billId, tradetype, tpflag, showAppr, shoWIns, sourceData } = this.state; //附件相关内容变量
		const { createBillHeadInfo } = BillHeadInfo;
		/* 按钮适配 第二步: 从 props.button中取到 createButtonApp 方法用来创建按钮组*/

		return (
			<div className="nc-bill-list">
			   <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					{/**创建websocket连接 */}
					{api.comm.createListWebSocket(this.props, {
						tableAreaCode: cons.list.tableCode,
						tablePkName: cons.field.pk,
						billtype: cons.comm.billType
						// serverLocation: '10.16.2.231:9991'
					})}
					<div className="header-title-search-area">
					{createBillHeadInfo(
                        {
                            title: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000050'),//标题
                            initShowBackBtn: false
                        }
                            )}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 9,
							onButtonClick: buttonClick.bind(this)
							//popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						// defaultConditionsNum: 2,
						showAdvBtn: true, //  显示高级按钮
						//onAfterEvent: onSearchAfterEvent.bind(this),  //编辑后事件
						//searchBtnName: multiLang && multiLang.get('3618-0029')
						//renderCompleteEvent: this.renderCompleteEvent //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom
						// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom
					})}
				</div>
				<div className="tab-definInfo-area">
					{/* <NCTabsControl defaultKey={0}>
					   <div key={9} clickFun={this.navChangeFun.bind(this, '9')}>
							{this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000051')}<span>{(numvalues && numvalues.UNCONFIRM) || 0}</span>
						</div>
						<div key={0} clickFun={this.navChangeFun.bind(this, '0')}>
							{this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000052')}<span>{(numvalues && numvalues.SAVED) || 0}</span>
						</div>

						<div key={3} clickFun={this.navChangeFun.bind(this, '3')}>
							{this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000053')}<span />
						</div>
					</NCTabsControl> */}
				</div>

				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick:this.DoubleClick.bind(this),
						showCheck: true,
						showIndex: true,
						dataSource: PAYBILL_CONST.paybillCacheKey,
						pkname:PAYBILL_CONST.paybill_pkname,
						onSelected:this.buttonUsability.bind(this),
						onSelectedAll: this.buttonUsability.bind(this)
					})}
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && (
						<NCUploader billId={billId} target={target} placement={'bottom'} billNo={billno}
						onHide={this.onHideUploader}
						customInterface={
							{
								queryLeftTree: commonurl.lefttreequery,
								queryAttachments: '/nccloud/cmp/paybills/enclosurequery.do'
							}
						}/>
					)}
				</div>
				<div>
					<BillTrack
						show={this.state.show}
						close={() => {
							this.setState({ show: false });
						}}
						pk={billId} //单据id
						type="F5" //单据类型
					/>
				</div>
				<div>
					<ApproveDetail
						billtype={this.state.billtype}
						billid={this.state.billid}
						show={this.state.showAppr}
						close={this.closeApprove}
					/>
				</div>
				{createModal('delmodal', {
					title: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000019'), // 弹框表头信息/* 国际化处理： 确认删除*/
					content: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000020'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
					beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000021'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000022') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				{createModal('delete', {
					title: multiLang && multiLang.get(this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000019')),/* 国际化处理： 确认删除*/
					content: multiLang && multiLang.get('20521030-0006')
				})}
				<div />
			</div>
		);
	};
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: '36070PBRCOMP'
})(List);
export default List;
//ReactDOM.render(<List />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/