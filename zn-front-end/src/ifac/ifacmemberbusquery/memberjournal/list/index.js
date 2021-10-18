/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast, cardCache, getMultiLang/**, createPageIcon*/ } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
let { NCTabsControl, NCAffix ,NCDiv} = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick,tableModelConfirm,buttonUsability } from './events';
//引入常量定义
import { module_id, app_code, card_page_id, oid, list_page_id, list_search_id, list_table_id,fun_code,node_key,printTemplate_ID,dataSourceTam,search_key,pub_const } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl.js';
import { loadMultiLang } from "../../../../tmpub/pub/util/index";
import { queryCard } from '../busbutton/intcalQuery';
//引入附件组件
const { NCUploader,ApproveDetail, PrintOutput,ApprovalTrans } = high;
let { NCDatePicker } = base;
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
			pk_applybill:null,
			ts:null,
			index:null,
			numvalues: {},
			activeKey: 2,
			//是否显示附件框
			showUploader: false,
			target:null,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			billid: '',
			billtype: '',
			showAppr: false,
			//输出用   
			outputData: {
				//funcode: fun_code, //功能节点编码，即模板编码
				nodekey: '', //模板节点标识
				//printTemplateID: printTemplate_ID, //模板id
				oids: [],
				outputType: 'output'
			}
		};
		//initTemplate.call(this, props);
	}

	componentWillMount() {
		window.onbeforeunload = () => {
		};
		let callback = (json, status, inlt) => {
			if(status) {
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
			}
		}
		getMultiLang({ moduleId: '36341FNIB', domainName: 'ifac', callback });
	}

	componentDidMount() {
		this.toggleShow();
	}

	//切换页面状态
	toggleShow = () => {
		queryCard.call(this,this.props);
	};
	closeApprove = () => {
		this.setState({
			showAppr: false
		});
	};

	onHideUploader = () => {
        this.setState({
            showUploader: false
        })
	}
	

	render() {
		let { table, button, search, modal,BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let { showUploader, billNO, billID } = this.state;
		let isLinkQuery = this.props.getUrlParam('isLinkQuery');
		let scene = this.props.getUrlParam("scene");
		/* 按钮适配 第二步: 从 props.button中取到 createButtonApp 方法用来创建按钮组*/
		return (
			<div className="nc-bill-list">

				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >                
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
									title:this.state.json['36341FNIB-000007'],
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
					{(scene != 'linksce' && scene != 'fip') ? 
						NCCreateSearch(list_search_id, {
                        	clickSearchBtn: searchBtnClick.bind(this),
                        	defaultConditionsNum: 2 //默认显示几个查询条件
                    	}) : null
					}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource:dataSourceTam,
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
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
					<ApproveDetail
						billtype={this.state.billtype}
						billid={this.state.billid}
						show={this.state.showAppr}
						close={this.closeApprove}
					/>
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
	renderCompleteEvent = () => {
		let cachesearch = getDefData(search_key, dataSourceTam);
		if (cachesearch && cachesearch.conditions) {
			for (let item of cachesearch.conditions) {
				if (item.field == 'open_date') {
					// 时间类型特殊处理
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(list_search_id, item.field,
						{ display: item.display, value: time });
				} else {
					this.props.search.setSearchValByField(list_search_id, item.field,
						{ display: item.display, value: item.value.firstvalue });
				}
			}
		}
	}
}

List = createPage({
})(List);
export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/