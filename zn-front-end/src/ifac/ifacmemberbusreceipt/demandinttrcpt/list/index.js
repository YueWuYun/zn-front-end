/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast, cardCache, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
let { NCTabsControl, NCAffix,NCDiv } = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick,tableModelConfirm,onSearchAfterEvent,buttonUsability } from './events';
//引入常量定义
import { module_id, app_code, card_page_id, list_page_id, list_search_id, list_table_id,fun_code,node_key,printTemplate_ID,dataSourceTam,search_key,pk_name } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl.js';
import { setPropCache, saveMultiLangRes, loadMultiLang,go2CardCheck } from "../../../../tmpub/pub/util/index";
//引入附件组件
const { NCUploader,ApproveDetail, PrintOutput,ApprovalTrans } = high;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = module_id;
		this.searchId = list_search_id;
		this.tableId = list_table_id;
		this.pageId = list_page_id;
		this.state = {
			//多语
			json: {},
			inlt: null,
			ts:null,
			index:null,
			// activeKey: 2,
			target:null,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			billid: '',
			billtype: '',
			//输出用   
			outputData: {
				
				nodekey: null, //模板节点标识
				oids: [],
				outputType: 'output'
			}
		};
	}

	componentWillMount() {
		window.onbeforeunload = () => {
		};
		let callback = (json, status, inlt) => {
			if(status) {
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
			}
			//将多语资源数据存储到页面级缓存中
			saveMultiLangRes(this.props, json);
		}

		//多语资源
		getMultiLang({
			//模块编码
			moduleId: {
				//tmpub模块多语资源
				['tmpub']:['3601'],
				//fts模块多语资源
				['ifac']:['36340CDIR']
				
			},
			//领域编码
			domainName: 'ifac',
			callback
		});
		// getMultiLang({ moduleId: '36340CDIR', domainName: 'ifac', callback });

		
	}

	componentDidMount() {
		 
	}
	
	//列表行双击事件
	onRowDoubleClick = (record,index,props,e) =>{
		let scene = (props.getUrlParam("scene")==='fip'||props.getUrlParam("scene")==='linksce')?'linksce':null;
		let islinkquery=(props.getUrlParam("scene")==='fip'||props.getUrlParam("scene")==='linksce')?true:null;
		go2CardCheck({ 
			props,
			url: requesturl.list2cardcheckaction,
			pk:record[pk_name].value,
			ts:record["ts"].value,
			fieldPK: pk_name,
			//动作编码（权限检查 空则不检查）
			actionCode:null,
			//权限编码（权限检查 空则不检查）
			permissionCode:null,
			//是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
			checkSaga : false,
			//是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
			checkTS : false,
			go2CardFunc: () => {
				props.pushTo('/card',{
					status:'browse',
					id:record.pk_intlist.value,
					pagecode: card_page_id,
					scene,
					islinkquery,
				}
				)
			}
		});
	}

	render() {
		let { table, button, search, modal ,BillHeadInfo} = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable, getTablePageInfo } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons, createButtonApp } = button;
		let { createModal } = modal;
		let { billNO, billID,billid,billtype,showAppr,target } = this.state;
		let scene = this.props.getUrlParam("scene");
		/* 按钮适配 第二步: 从 props.button中取到 createButtonApp 方法用来创建按钮组*/
		return (
			<div className="nc-bill-list">
				{/**创建websocket连接 */}
                {api.comm.createListWebSocket(this.props, {
                    tableAreaCode: cons.list.tableCode,
                    tablePkName: cons.field.pk,
                    billtype: cons.comm.billType,
                    // serverLocation: '10.16.2.231:9991'
                })}

				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                    
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
                                    title: loadMultiLang(this.props, '36340CDIR-000034'),//标题
                                    initShowBackBtn: false
                                }
                            )}
                        </div>
                        {/** 渲染头部按钮 **/}
                        <div className="header-button-area">
							{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
							{createButtonApp({ area: "list_head", onButtonClick: buttonClick.bind(this) })}
						</div>
                    
                </NCDiv>

				<div className="nc-bill-search-area">
				{(scene != 'linksce' && scene != 'fip') ? NCCreateSearch(list_search_id, {
                        clickSearchBtn: searchBtnClick.bind(this),
                        defaultConditionsNum: 2 //默认显示几个查询条件
                    }) : null
				}
				</div>
				
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource:dataSourceTam,
						pkname:'pk_intlist',
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick:this.onRowDoubleClick.bind(this),
						showCheck: true,
						showIndex: true,
						onSelected: buttonUsability.bind(this, this.props,null),
                        onSelectedAll: buttonUsability.bind(this, this.props,null),
						componentInitFinished:()=>{
							buttonUsability.call(this, this.props, null);
						}
					})}
				</div>

				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
			</div>
		);
	}	
	// 将所有查询条件赋值进缓存
	addQueryCache = () => {
		let searchVal = this.props.search.getQueryInfo(list_search_id, false).querycondition;
		if (searchVal) {
			setDefData(search_key, dataSourceTam, searchVal);
		}
	}

	// 查询区渲染完成回调函数
	// renderCompleteEvent = () => {
	// 	let cachesearch = getDefData(search_key, dataSourceTam);
	// 	if (cachesearch && cachesearch.conditions) {
	// 		for (let item of cachesearch.conditions) {
	// 			if (item.field == 'open_date') {
	// 				// 时间类型特殊处理
	// 				let time = [];
	// 				time.push(item.value.firstvalue);
	// 				time.push(item.value.secondvalue);
	// 				this.props.search.setSearchValByField(list_search_id, item.field,
	// 					{ display: item.display, value: time });
	// 			} else {
	// 				this.props.search.setSearchValByField(list_search_id, item.field,
	// 					{ display: item.display, value: item.value.firstvalue });
	// 			}
	// 		}
	// 	}
	// }
}

List = createPage({
	
	//initTemplate: initTemplate,
	// mutiLangCode: '36340CDIR'
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/