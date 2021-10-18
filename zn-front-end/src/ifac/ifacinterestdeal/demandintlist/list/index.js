/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast, cardCache, getMultiLang/**, createPageIcon*/ } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
let { NCTabsControl, NCAffix,NCDiv } = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,buttonUsability } from './events';
//引入常量定义
import { module_id, app_code, card_page_id, oid, list_page_id, list_search_id, list_table_id,fun_code,node_key,printTemplate_ID,dataSourceTam,search_key,pkname,gotocardcheck } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl.js';
import { loadMultiLang ,createListWebSocket,go2CardCheck} from "../../../../tmpub/pub/util/index";
//引入打印
import { queryCard } from '../busbutton/intcalQuery';
import './index.less';
//引入附件组件
const { NCUploader,ApproveDetail, PrintOutput,ApprovalTrans } = high;
let { NCDatePicker } = base;
const dateFormat = "YYYY-MM-DD";
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
			pk_intlist:null,
			ts:null,
			index:null,
			numvalues: {},
			activeKey: 2,
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
				nodekey: '', //模板节点标识
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
		}
		getMultiLang({ moduleId: '36340CDIB', domainName: 'ifac', callback },{
			moduleId: '3601', domainName: 'tmpub', callback
		});
	}

	componentDidMount() {
		let type = this.props.getUrlParam('type');
		let back = this.props.getUrlParam('back');
		let isLinkQuery = this.props.getUrlParam('isLinkQuery');
		if(!back&&type&&(type==='interlist'||type==='tryinter')){
			this.toggleShow();
		}
		if(isLinkQuery){
			this.props.button.setButtonVisible(["print","printgroup","output"],false);
			//props.button.setButtonVisible(['SaveGroup','Save','SaveAdd', 'Cancel'], true);
		}
	}

	//切换页面状态
	toggleShow = () => {
		queryCard.call(this,this.props);
	};

	//列表行双击事件
	onRowDoubleClick = (record,index,props,e) =>{
		let pk = record.pk_intlist.value;
		let scene = props.getUrlParam('scene');
		let type = this.props.getUrlParam('type');
		if(pk){
			go2CardCheck({
				props,
				url: gotocardcheck,
				pk: record[pkname].value,
				ts: record["ts"].value,
				checkTS: false,
				fieldPK: pkname,
				go2CardFunc: () => {
					props.pushTo('/card',{
						status:'browse',
						id:pk,
						type:type,
						douclick:'douclick',
						scene,
						pagecode: card_page_id
					})
				}
			})
			}else{
				props.pushTo('/card',{
                    startdate:record.begdate.value,
                    enddate:record.enddate.value,
                    pks:record.vdef1.value,
                    type:'tryinter',
                    card:'card',
                    //douclick:'douclick',
                    pagecode: card_page_id,
					scene,
                    pk_intobj:record.vdef2.value
                })
			
		}
		
	}

	render() {
		let { table, button, search, modal,BillHeadInfo } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let { billNO, billID } = this.state;
		let isLinkQuery = this.props.getUrlParam('isLinkQuery');
		let scene = this.props.getUrlParam("scene");
		let type2 = this.props.getUrlParam('type');
		/* 按钮适配 第二步: 从 props.button中取到 createButtonApp 方法用来创建按钮组*/
		return (
			<div className="nc-bill-list">
                {/**创建websocket连接 */}
                {createListWebSocket(this.props, {
                    tableAreaCode: list_table_id,
                    tablePkName: 'pk_intlist',
					billtype: '36EH',
					dataSource: dataSourceTam
                })}
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area">

                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
									//title: loadMultiLang(this.props, '36340CDIB-000007'),//标题
									title:this.state.json['36340CDIB-000007'],
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
					{/* {NCCreateSearch('search', {
                        clickSearchBtn: searchBtnClick.bind(this),
                        defaultConditionsNum: 2 //默认显示几个查询条件
                    })} */}


				{(scene != 'linksce' && scene != 'fip'&&type2!='tryinter'&&type2!='interlist') ? //(scene != 'linksce' && scene != 'fip'&&type2!='tryinter'&&type2!='interlist') 
					NCCreateSearch(list_search_id, {
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
	// billinfo:{
    //     billtype: 'grid',
    //     pagecode: '36340CDIC_L01',
    //     bodycode: 'head'
    // },
	// initTemplate: initTemplate
})(List);
export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/