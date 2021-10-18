/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast, cardCache, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
let { NCTabsControl, NCAffix,NCDiv } = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick,tableModelConfirm,buttonUsability } from './events';
//引入常量定义
import { module_id, app_code, card_page_id, list_page_id, list_search_id, list_table_id,fun_code,node_key,printTemplate_ID,dataSourceTam,search_key,pk_name } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl.js';
import { setPropCache, saveMultiLangRes, loadMultiLang,go2CardCheck } from "../../../../tmpub/pub/util/index";
//引入附件组件
const { NCUploader,ApproveDetail, PrintOutput,ApprovalTrans } = high;

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
			//是否显示附件框
			showUploader: false,
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
				['ifac']:['36341FDLQ']
				
			},
			//领域编码
			domainName: 'ifac',
			callback
		});
		// getMultiLang({ moduleId: '36341FDLQ', domainName: 'ifac', callback });

		
	}

	componentDidMount() {
		
	}
	
	//列表行双击事件
	onRowDoubleClick = (record,index,props,e) =>{
		go2CardCheck({
			url: requesturl.check2card,
			pk: record.pk_depositreceipt.value,
			ts: record.ts.value,
			checkTS: false,
			checkSaga:false,
			fieldPK: 'pk_depositreceipt',
			go2CardFunc: () =>{
				props.pushTo('/card',{
					status:'browse',
					id:record.pk_depositreceipt.value,
					pagecode: card_page_id
				}
				)
		   }	
	   })  
		
	}

	onHideUploader = () => {
        this.setState({
            showUploader: false
        })
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
		let { billNO, billID,billid,billtype,showAppr,target,showUploader } = this.state;
		let scene = this.props.getUrlParam("scene");
		/* 按钮适配 第二步: 从 props.button中取到 createButtonApp 方法用来创建按钮组*/
		return (
			<div className="nc-bill-list">

				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                    
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
                                    title: loadMultiLang(this.props, '36341FDLQ-000034'),//标题
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
						pkname:'pk_depositreceipt',
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
				{/** 附件 **/}
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader 
						billId={billID} 
						billNo={billNO}
						target={null}
						placement={'bottom'}
						onHide={this.onHideUploader}
						// beforeUpload={this.beforeUpload} 
						/>
					}
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


}

List = createPage({
	
})(List);


export default List;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/