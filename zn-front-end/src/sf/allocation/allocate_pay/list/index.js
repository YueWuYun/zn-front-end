/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high,toast,getMultiLang,cardCache,createPageIcon} from 'nc-lightapp-front';
let { NCFormControl,NCDiv } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm,setButtonUsability } from './events';
import {dataSource,sourceModel_SF, module_id,module_name,module_tmpub_name,module_tmpub_id,SHOWMODEL_LIULAN,SHOWMODEL_BULU ,list_page_id,list_search_id,
		allocatePk, allocateBillType, list_table_id} from '../cons/constant'
let { NCUploader, ApproveDetail, PrintOutput ,Inspection} = high;
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form';
import {getCahceValue, } from "../util"
import bodyButtonClick from './events/bodyButtonClick';
import { saveMultiLangRes,loadMultiLang, createListWebSocket} from "../../../../tmpub/pub/util/index";
const { NCTabPane } = NCTabs;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = module_id;
		this.searchId = list_search_id;
		this.tableId = list_table_id;
		this.state = {
			
			//当前选中的分组
			selectedGroup: '0',
			//页签分组单据总数
			numvalues: {
				
				//待支付 总数
				DZF: 0,
				//支付中 总数
				ZFZ:0,
				//全部
				QB:0
			},			
		
			// 网银补录 start
			showBuLu: false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,	
			  //表体合并支付强制补录变量
			isMergepayBulubody:false,
			record:'',
			index:0,
			// 网银补录 end

			// 附件相关 start
			//单据pk
			billId:'',
			billts:'',
			//附件管理使用单据编号
            billno:'',
			//控制附件弹出框
            showUploader: false,
			//控制弹出位置
            target: null,
			// 附件相关 end

			// 联查预算 start
			//联查预算
			//联查预算参数
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,	
			// 联查预算 end

			//审批意见 start
			//审批意见是否显示
            show: false,
			//审批意见单据pk
            billid: '',
			//审批意见单据类型
            billtype: '',
			//审批意见 end

			
		
		};
		// initTemplate.call(this, props);
	}

	componentDidMount() {
		//多语资源
		getMultiLang({
			//模块编码
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]:[module_tmpub_id],
				//sf模块多语资源
				[module_name]:[module_id,"36320FA_PAY"]
				
			},
			//领域编码
			domainName: module_name,
			//回调
			callback: (lang) => {
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				initTemplate.call(this,this.props);
			}
		});
		setButtonUsability.call(this,this.props);
		let { hasCacheData } = this.props.table;
		if(hasCacheData(dataSource)){
			//从缓存中加载数据
			getCahceValue(this.props, this.updateState.bind(this));
		}
	}


	/**
	 * 更新state
	 */
	updateState(obj) {
		if (!obj || Object.keys(obj).length == 0) {
			return;
		}
		this.setState(obj);
	}

	/**
	 * 获取state中的数据
	 * @param {*} key 
	 */
	getState(key) {
		return this.state[key];
	}

	
	//打开审批意见弹框
	openApprove = () => {
		this.setState({
			show: true
		})
	}

	//关闭审批意见弹框
	closeApprove = () => {
		this.setState({
			show: false
		})
	}


	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	

	//页签筛选
	navChangeFun = (status, className, e) => {		
		cardCache.setDefData('selectedGroup', dataSource, status);
		searchBtnClick.call(this, this.props, null, status);
	};


	 //刷新列表信息
	refresh = ()=>{
		//查询condition
		let refreshsearchVal = this.props.search.getAllSearchData(list_search_id);
		searchBtnClick.call(this,this.props,refreshsearchVal)
		setButtonUsability.call(this,this.props);
	}

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {	
		let isLiulan = this.state.modelType
		if(isLiulan == SHOWMODEL_LIULAN){
			return
		}
		//补录来源
		let checkMergepayBulubody = this.state.isMergepayBulubody
		let bodyRecord = this.state.record
		let BLpk = bodyRecord.pk_allocate_h.value
		let BLts = bodyRecord.ts.value			
		
		let buluData = {
			pk: BLpk,
			ts: BLts,
			results: retMsg,
			pageid: list_page_id,
			isCardOpt:false,
			ismergepay:this.ismergepay
		}
		ajax({
			url: '/nccloud/sf/allocation/allocatebuluretmsg.do',
			data: buluData,
			success: (res) => {
				if (res.success) {
					if (res.data.grid) {						
						this.handleReturnData.call(this, bodyRecord, res.data.grid);
					} else {
						this.props.table.setAllTableData(list_table_id, { rows: [] });
					}					
					//列表表体的合并支付,这里的数据必须是后台传回来的新数据，因为支付的时候会进行ts校验
					if(checkMergepayBulubody){
						bodyButtonClick.call(this,this.props,'mergepay_inner_check',null,res.data.grid[list_table_id].rows[0].values,this.state.index)
					}
				}
			}
		});
	}

	//列表行双击事件
	onRowDoubleClick = (record,index,props,e) =>{
		props.pushTo('/card',{
			status:'browse',
			id:record.pk_allocate_h.value,
		}
		)
	}


	// 处理按钮操作返回数据，刷新选中记录数据
	handleReturnData = (record, data) =>{
		let returnData = data[list_table_id].rows;
		//处理选择数据		
		let pk_allocate_h_check = record.pk_allocate_h.value;
		if(pk_allocate_h_check === returnData[0].values.pk_allocate_h.value){
			let updateDataArr = [{
				index: this.state.index,
				data: { values: returnData[0].values }
			}];
			this.props.table.updateDataByIndexs(list_table_id, updateDataArr);
		}	
	}



	// 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        })
    }

	//附件上传前的检验
	beforeUpload(billId, fullPath, file, fileList) {  
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        console.log(billId, fullPath, file, fileList);

        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            alert(this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000026'))/* 国际化处理： 只支持jpg格式图片*/
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            alert(this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000027'))/* 国际化处理： 上传大小小于2M*/
        }
        return isJPG && isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }


	render() {
		let numvalues = this.state.numvalues;
		let { table, button, search ,modal, ncmodal,BillHeadInfo} = this.props;
		let buttons = this.props.button.getButtons();		
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createButton, getButtons, createButtonApp } = button;
		let { createModal } = modal;
		// 附件相关内容变量
		let { showUploader, target,billno,billId,show,showNtbDetail,ntbdata } = this.state;

		return (
			<div className="nc-bill-list">
                {/**创建websocket连接 */}
                {createListWebSocket(this.props, {
                    tableAreaCode: list_table_id,
                    tablePkName: allocatePk,
					billtype: allocateBillType,
					dataSource: dataSource
                })}				
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{/** 渲染图标**/}
						{createBillHeadInfo(
                                {
                                    title:loadMultiLang(this.props,'36320FA_PAY-000049'),//标题
                                    initShowBackBtn: false
                                }
                        )}
					</div>
					<div className="header-button-area">
						{createButtonApp({ area: "list_head", onButtonClick: buttonClick.bind(this) })}
					</div>
				
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2 //默认显示几个查询条件
					})}
				</div>
				{/* <div style={{borderTop: '1px solid #CCC' }}></div> */}
				{/* <div className="tab-definInfo-area"> */}
					{<NCTabs activeKey={this.state.selectedGroup}
						onChange={(v) => {
							this.navChangeFun.call(this, v);
						}}>
						<NCTabPane key={'0'} tab={
							<span>
								{this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000066')+ '('}
								<span>{(numvalues && numvalues.DZF || 0)}</span>  
								{')'}
							</span>
						}
						/>
						<NCTabPane key={'1'} tab={
							<span>
								{this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000067')+ '('}
								<span>{(numvalues && numvalues.ZFZ || 0)}</span>  
								{')'}
							</span>
						}
						/>
						<NCTabPane key={'2'} tab={
							this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000068')/*  全部 */
							}
						/>
						
					</NCTabs>}
				{/* </div> */}
				{/* <div style={{ height: '10px' }} /> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						dataSource:dataSource,
						showCheck: true,
						showIndex: true,
						onRowDoubleClick:this.onRowDoubleClick.bind(this),
						onSelected:setButtonUsability.bind(this, this.props),
						onSelectedAll:setButtonUsability.bind(this, this.props),


						//给表格加pkname: 表格数据的主键名字(key)
						pkname: 'pk_allocate_h',
						componentInitFinished:()=>{
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
							setButtonUsability(this.props);
						}

					})}
				</div>

				<div className="nc-faith-demo-div2">
                {/* 这里是附件上传组件的使用，需要传入三个参数 */}
                    {showUploader &&
                        <NCUploader
                            billId={billId}
                            target={target}
                            placement={'bottom'}
                            billNo={billno}
							onHide={this.onHideUploader}
							// beforeUpload={this.beforeUpload}
							customInterface={
								{
									queryLeftTree: '/nccloud/tmpub/pub/lefttreequery.do',
									queryAttachments: '/nccloud/sf/allocation/allocateattachment.do'
								}
							}
                        />
                    }
                </div>

				{/* 支付模态框 */}
				{createModal('payModel', {
					title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
				})}

				{/** 网银补录组件 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}
					modal={modal}
					onLineData={this.state.onLineData}
					moduleType={sourceModel_SF}
					modelType={this.state.modelType}
					//点击确定按钮的回调函数
					onSureClick={(retPayMsg) => {
						//处理补录信息(输出参数：PaymentRetMsg[])
						this.processRetMsg(retPayMsg);
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}
					//点击关闭按钮的回调函数
					onCloseClick={() => {
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}>
				</PayBuluForm>


				{/* 审批意见 */}
				<div className="nc-faith-demo-div2">
					{show &&
						<ApproveDetail
							show={this.state.show}
						    close={this.closeApprove}
						    billtype={this.state.billtype}
						    billid={this.state.billid}
						 />
					}
                </div>

				{/** 联查预算 **/}
				<div>
					<Inspection
						show={showNtbDetail}
						sourceData={ntbdata}
						cancel={() => {
							this.setState({ showNtbDetail: false })
						}}
						affirm={() => {
							this.setState({ showNtbDetail: false })
						}}
					/>
				</div>


			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	mutiLangCode: '36320FA_PAY'
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/