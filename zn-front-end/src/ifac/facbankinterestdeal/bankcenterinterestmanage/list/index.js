/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast, cardCache, getMultiLang/**, createPageIcon*/ } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
let { NCTabsControl, NCAffix ,NCDiv} = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,buttonUsability } from './events';
//引入常量定义
import { module_id, app_code, card_page_id, oid, list_page_id, list_search_id, list_table_id,fun_code,node_key,printTemplate_ID,dataSourceTam,search_key,pub_const,billtype,pk } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl.js';
import { loadMultiLang,createListWebSocket } from "../../../../tmpub/pub/util/index";
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
		getMultiLang({ moduleId: '36140FDIC', domainName: 'ifac', callback });
	}

	componentDidMount() {
		// this.getData();
	}
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
		/* 按钮适配 第二步: 从 props.button中取到 createButtonApp 方法用来创建按钮组*/
		return (
			<div className="nc-bill-list">

				{createListWebSocket(this.props, {
					tableAreaCode: list_table_id,
					tablePkName: pk,
					billtype: billtype
					// serverLocation: '10.16.2.231:9991'
				})}

				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >                
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
									title:this.state.json['36140FDIC-000024'],
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
					{NCCreateSearch('search', {
                        clickSearchBtn: searchBtnClick.bind(this),
                        defaultConditionsNum: 2 //默认显示几个查询条件
                    })}
				</div>
				{}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource:dataSourceTam,
						pkname:'pk_applybill',
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
				{/** 附件 **/}
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader 
						billId={billID} 
						billNo={billNO}
						target={null}
						placement={'bottom'}
						onHide={this.onHideUploader}
						/>
					}
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


				{createModal('withholding', {
					content: this.withholdingContent(),
					hasCloseBtn: false,
                    className:'senior'
				})}

				{createModal('tryinterest', {
					content: this.trycontent(),
					hasCloseBtn: false,
                    className:'senior'
				})}

			</div>
		);
	}	

	// 预提结束日期模态框
	withholdingContent() {
		return (
			<div className="addModal">
				<div style={{ height: '35px'}} />
				{<span className="modal-label">
				{this.state.json['36140FDIC-000025']/**国际化处理：预提结束日 */}
				</span>}
				<NCDatePicker
					format={dateFormat}
					placeholder={this.state.json['36140FDIC-000026']/**国际化处理：选择日期 */}
					value={this.state.withholdingdate}
					onChange={val => this.withholdingDate(val)}
				/>
			</div>
		)
	};
	
	withholdingDate = (value) => {
        if (value != this.state.withholdingdate) {
            this.setState({
                withholdingdate: value
            })
		}
	}

	trycontent () {
		// return (
		// 	<div className="addModal">
		// 		<div style={{ height: '20px' }} />
		// 		<span className="modal-label">{this.state.json['36340FDIC-000027']/**国际化处理：开始日期 */}</span>
		// 		<NCDatePicker
		// 			format={dateFormat}
		// 			placeholder={this.state.json['36340FDIC-000027']/**国际化处理：开始日期 */}
		// 			value={this.state.startdate}
		// 			onChange={val => this.changeStartDate(val)}
		// 		/>
		// 		<div style={{ height: '10px' }} />
		// 		<span className="modal-label">
		// 			{this.state.json['36340FDIC-000028']/**国际化处理：结束日期 */}
		// 		</span>	
		// 		<NCDatePicker
		// 			format={dateFormat}
		// 			placeholder={this.state.json['36340FDIC-000028']/**国际化处理：结束日期 */}
		// 			value={this.state.enddate}
		// 			onChange={val => this.changeEndDate(val)}
		// 		/>
		// 	</div>
		// )


		return (
			<div className="addModal">
				<div style={{ height: '35px'}} />
				{<span className="modal-label">
				{this.state.json['36140FDIC-000028']/**国际化处理：结束日期 */}
				</span>}
				<NCDatePicker
					format={dateFormat}
					placeholder={this.state.json['36140FDIC-000026']/**国际化处理：选择日期 */}
					value={this.state.enddate}
					onChange={val => this.changeEndDate(val)}
				/>
			</div>
		)
	};

	// changeStartDate = (value) => {
	// 	if (value != this.state.startdate) {
    //         this.setState({
    //             startdate: value
    //         })
	// 	}
	// }

	changeEndDate = (value) => {
		if (value != this.state.enddate) {
            this.setState({
                enddate: value
            })
        }
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