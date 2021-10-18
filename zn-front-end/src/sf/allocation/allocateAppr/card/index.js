/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast ,cardCache,high,getMultiLang,createPageIcon} from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix ,NCBackBtn,NCDiv} = base;
import { Radio } from 'tinper-bee';
import { buttonClick, initTemplate, pageInfoClick, buttonVisible } from './events';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import axios from 'axios';
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index.js';
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
let {  PrintOutput,NCUploader,ApprovalTrans,ApproveDetail,Inspection} = high;
//引入退回弹框
import Modal from "../../../../tmpub/pub/util/modal/index";
import { backConfirm } from "./events/buttonClick";
//引入常量定义
import { module_id,module_name,module_tmpub_name,module_tmpub_id,funcode, base_url, button_limit, card_page_id, card_from_id, card_table_id, viewmod_deal,dataSource, list_page_id ,SHOWMODEL_BULU,sourceModel_SF
	   , allocatePk, allocateBillType } from '../cons/constant.js';
import Sign from '../../../../tmpub/pub/util/ca';
import { cardOperator } from "../../../pub/utils/SFButtonUtil";
import {repaintView,setEditDisable } from '../util/index';
import { InsertLine} from '../../../pub/utils/SFButtonUtil';
import { saveMultiLangRes } from "../../../../tmpub/pub/util/index";
import { loadMultiLang, createCardWebSocket} from "../../../../tmpub/pub/util/index";

const bodyCodeMapBodyPKName = {};
bodyCodeMapBodyPKName[card_table_id] = 'pk_allocate_b';

class Card extends Component {
	constructor(props) {
		super(props);
		this.billId='';
		this.billno='';
		this.status='';
		this.state = {
			copyflag: false,
			currentLocale: 'zh-CN', // 本地语言
			ApproveDetails: null, //审批历史数据
			suggestion: '', //审批意见
			returnnote:'',//退回原因
			approveType: 'approve', //审批三个状态
			approveList: [
				//审批内所有的操作
				{ display: loadMultiLang(this.props,'1880000025-000043'), value: 'approve' }, // 批准/* 国际化处理： 批准*/
				{ display: loadMultiLang(this.props,'1880000025-000044'), value: 'Noapprove' }, // 不批准/* 国际化处理： 不批准*/
				{ display: loadMultiLang(this.props,'1880000025-000045'), value: 'reject' } // 驳回/* 国际化处理： 驳回*/
			],
			//卡片切换主组织的旧的组织
			oldorg:'',
			oldorgdisplay:'',
			// //单据主键
			// billId: '',
			// //附件管理使用单据编号
			// billno:'',
			//控制附件弹出框
            showUploader: false,
			//是否行复制模式
			isRowCopy: false,
			// 网银补录 start
			showBuLu: false,
			isMergepay:false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//联查内部账户余额是否显示
			showAccModal: false,
			//联查内部账户pk
			pkInnAccount: '',
			// 银行账户余额 start
			// 是否展示期初余额联查框，true:展示，false:不展示
            showOriginal:false, 
            // 联查余额取数据，将需要联查的数据赋值给我
			showOriginalData:[],
			// 银行账户余额 end
			//默认财务组织
			curr_pk_org:'',
			curr_orgname:'',
			//审批意见 start
			//审批意见是否显示
			approveshow: false,
			//审批意见单据类型
            billtype: '',
			//审批意见 end
			//卡片页状态
			// status:'',
			//联查预算
			showInspection: false,
			//联查预算数据源
            sourceData: null,
			//展开收起
			showWord:false,
			//退回弹框
			showReBack:false,

		}
		// initTemplate.call(this, props);
	};

	componentDidMount() {
		//多语资源
		getMultiLang({
			//模块编码
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]:[module_tmpub_id],
				//sf模块多语资源
				[module_name]:[module_id,funcode,'36320FA']
				
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

		this.billId = this.props.getUrlParam('id');
		this.status=this.props.getUrlParam('status');
		// this.setState({
		// 	status:status
		// });
		// this.toggleShow();
		if (this.billId) {
			// this.setState({
			// 	billid:id
			// });
			this.qryData();
		}//新增
		else {
			setTimeout(()=>{
				this.props.form.EmptyAllFormValue(card_from_id);
				this.props.cardTable.setTableData(card_table_id, { rows: [] });
				this.toggleShow();
			 },0);
			
		}
	}

	/**
	 * 查询页面数据
	 */
	qryData = () => {
		let status=this.status;
		if(!status) {
			status = this.props.getUrlParam('status');
		}
		let isCopy = this.props.getUrlParam('isCopy');
		let pk=this.props.getUrlParam('id');
		if(!pk) {
			pk=this.billId;
		}
		let data = { pk: pk, pageid: card_page_id,pageCode:card_page_id };
		const that = this;
		let url = base_url;
		
		
		url = url + 'querycard.do';
		ajax({
			url,
			data: data,
			success: (res) => {
				if (res.data) {
					if(res.data.head.form_allocate_01.rows[0].values.saga_status){
	
						let saga_status = res.data.head.form_allocate_01.rows[0].values.saga_status;

						this.props.button.toggleErrorStatus('card_head',{
							isError: saga_status.value === "1"
						})
					}	
					if (res.data.head) {
						that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
						this.billId=res.data.head[card_from_id].rows[0].values.pk_allocate_h.value;
						this.billno=res.data.head[card_from_id].rows[0].values.vbillno.value;
						// that.setState({
						// 	billID: res.data.head[card_from_id].rows[0].values.pk_allocate_h.value,
						// 	billno: res.data.head[card_from_id].rows[0].values.vbillno.value
						// });
					}
					if (res.data.body) {
						that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
					}
					that.toggleShow();
					
				} else {
					that.props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
					that.props.cardTable.setTableData(card_table_id, { rows: [] });
				}
			}
		});
		
		
	}

	//切换页面状态
	toggleShow = () => {
		let status=this.status;
		if(!status) {
			status = this.props.getUrlParam("status");
		}
		let viewmode = status === 'browse' ? 'browse' : 'edit';
		let flag = status === 'browse' ? false : true;
		//设置页面组件的显示状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			//控制显示返回按钮: true为显示,false为隐藏
			showBackBtn: false,
			//控制显示单据号：true为显示,false为隐藏
			showBillCode: true,
			billCode: this.billno
		});
		this.props.form.setFormStatus(card_from_id, viewmode);
		this.props.cardTable.setStatus(card_table_id, viewmode);
		buttonVisible.call(this,this.props,status);
		orgVersionView(this.props, card_from_id);
	};

	componentWillMount(){
        window.onbeforeunload = () =>{
            let currentBillStatus = this.props.getUrlParam('status')
            if(currentBillStatus != 'browse'){
                return loadMultiLang(this.props,'1880000025-000046')/* 国际化处理： 当前单据未保存，您确定离开此页面？*/
            }
        }
    }



	// 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        })
	}
	
	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			approveshow: false
		})
	}

	// 编辑保存是取消按钮确认框
	cancelConfirm = () => {
		
		if (this.props.getUrlParam('status') == 'edit') {
			// 表单返回上一次的值
			this.props.form.cancel(card_from_id);
			// 表格返回上一次的值
			this.props.setUrlParam({
			  status: 'browse',
			  id: this.props.getUrlParam('id'),
			  interfaceJump:'card'
			});
			this.componentDidMount();
		}
		//保存中的取消操作
		else if (this.props.getUrlParam('status') == 'add') {
			let id=this.props.getUrlParam('id');
			if(!id) {
			id=this.billId;
			}
			this.props.setUrlParam({
			id: id,
			status: 'browse',
			interfaceJump:'card'
			});
			this.componentDidMount();
		}
		//复制中的取消操作
		else if (this.props.getUrlParam('status') == 'copy') {
			let id=this.props.getUrlParam('id');
			if(!id) {
				id=this.billId;
			}
			this.props.setUrlParam({
				id: id,
				status: 'browse',
				interfaceJump:'card'
			});
			this.componntDidMount();
		}
		// 经办
		else if (this.props.getUrlParam('status') == 'decide') {
			this.props.setUrlParam({
				status: 'browse',
				id: this.props.getUrlParam('id'),
				interfaceJump:'card'
			});
			
			this.componentDidMount();
		}
		//浏览查询详情
		else if (!this.props.getUrlParam('status')||this.props.getUrlParam('status') == 'browse') {
			this.props.setUrlParam({
				status: 'browse',
				id: ''
			});
			this.componentDidMount();
		}
	};

	// 退回原因
	returnnoteModelContent() {
		return (
			<div className="addModal">
				<NCFormControl
					className="demo-input"
					value={this.state.returnnote}
					onChange={this.changeReturnnoteEvent}
					size="sm"
				/>
			</div>
		)
	};

	//审批按钮操作事件
	approveRadio = (val) => {
		this.setState(
			{
				approveType: val
			},
			() => console.log(this.state)
		);
	};
	//输入意见输入框
	suggestChange(val) {
		this.setState({
			suggestion: val
		});
	}

	createApprove = () => {
		//审批流程
		let { approveDetail } = this.props;
		let { ApproveDetails, approveType, approveList, suggestion, billID } = this.state;
		return approveDetail.create('demo1', {
			data: ApproveDetails,
			approveType,
			suggestion,
			approveList,
			needInput: true,
			approveRadio: this.approveRadio.bind(this),
			suggestChange: this.suggestChange.bind(this),
			billID
		});
	};
	//审批单据
	approve = (name) => {
		let { approveType, suggestion, ApproveDetails } = this.state;
		let approveResult =
			approveType == 'approve' ? 'Y' : approveType == 'Noapprove' ? 'N' : approveType == 'reject' ? 'R' : '';
		let jumpToActivity = approveType == 'approve' ? null : ApproveDetails[ApproveDetails.length - 2].activityID;
		let data = {
			approveResult,
			jumpToActivity,
			checknote: suggestion,
			billid: this.props.form.getFormItemsValue(card_from_id, 'crevecontid').value,
			ts: this.props.form.getFormItemsValue(card_from_id, 'ts').value,
			billOrTranstype: this.props.form.getFormItemsValue(card_from_id, 'vtrantypecode').value,
			userid: '1001A41000000000592P',
			actionname: name ? name : 'APPROVE'
		};
		ajax({
			url: base_url + 'approve.do',
			data,
			success: (res) => {
				if (res.data) {
					console.log(res);
				}
			}
		});
	};

	//获取列表肩部信息
	getTableHeadButton = (buttons) => {
		let { createButton, createButtonApp } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(card_table_id, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{/* 应用注册按钮 */}
					{this.props.button.createButtonApp({
						area: 'card_body',
						buttonLimit: 7,
						popContainer: document.querySelector('.header-button-area')
					})}
				</div>
			</div>
		);
	};

	//切换组织
	changeOrg = () => { }

	
	/**
	 * 返回按钮 返回到列表页面
	 */
	link2ListPage = () => {
		this.props.pushTo("/list", {
			pagecode:list_page_id
		});
	};
	render() {
		let { cardTable, form, button, modal, ncmodal} = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(module_id);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButton, createButtonApp, createErrorFlag } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let createNCModal  = ncmodal.createModal;

		// 附件相关内容变量
		let { showUploader, target, showNCbackBtn,pkInnAccount,showAccModal,assignData, assignShow } = this.state;
		let { showInnerAccInfo, pk_inneracc } = this.state;
		const that = this;
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
                    headBtnAreaCode: 'list_head',
                    formAreaCode: card_from_id,
                    billpkname: allocatePk,
					billtype: allocateBillType,
					dataSource: dataSource
                })}					
				<div className="nc-bill-top-area">
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					
							<div className="header-title-search-area">
								<h2 className='title-search-detail'>

									{createBillHeadInfo({
										// {/* 国际化处理： 资金上收*/}
										title:loadMultiLang(that.props,'1880000025-000048'),
										//单据号
										billCode: this.billno,
									})}
									
								</h2>
							</div>
							<div className="header-button-area">
								{
									createErrorFlag({
										headBtnAreaCode: 'list_head'
									})
								}
								{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
								{this.props.button.createButtonApp({
										area: 'list_head',
										buttonLimit: 10,
										onButtonClick: buttonClick.bind(this),
										popContainer: document.querySelector('.header-button-area')
									})}
							</div>
							
					
						</NCDiv>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(card_from_id, {
								expandArr: [card_from_id]
							})}
						</div>
					{/* </NCScrollElement> */}
				</div>
				<div className="nc-bill-bottom-area">
					<NCScrollElement name='businfo'>
						<div className="nc-bill-table-area">
							{createCardTable(card_table_id, {
								tableHead: this.getTableHeadButton.bind(this, buttons),
								modelSave: buttonClick.bind(this,this.props,'save'),
								hideAdd:this.status=='decide',
								hideDel:this.status=='decide',
								showCheck: true,
								showIndex: true,
								adaptionHeight:true
							})}
						</div>
					</NCScrollElement>
				</div>
				{/* {createModal('approve', {
					title: multiLang && multiLang.get('36300IT-0019'),
					content: this.createApprove(),
					beSureBtnClick: this.approve
				})} */}
				{/* 输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/sf/delivery/deliveryprint.do"
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				{createModal('saveCancelModel', {
					title: loadMultiLang(this.props,'1880000025-000006'),/* 国际化处理： 取消*//* 国际化处理： 取消确认*/
					content: loadMultiLang(this.props,'1880000025-000007'),/* 国际化处理： 确定要取消吗？*//* 国际化处理： 是否确任要取消?*/
					beSureBtnClick: this.cancelConfirm,
					//  模态框大小 sm/lg/xlg,
					size:'sm', 
					className:'junior'
				})}

				{createModal('delete', {
					title: loadMultiLang(this.props,'1880000025-000049'),/* 国际化处理： 删除*/
					content: loadMultiLang(this.props,'1880000025-000050'),/* 国际化处理： 确定要删除吗？*/
					beSureBtnClick: this.delConfirm,
					userControl: false,
					noFooter: false
				})}
				
				{/* 模态框 */}
				{createNCModal('commonModel', {
					
				})}
				{/* 退回模态框 */}
				<Modal
					title={loadMultiLang(this.props,'1880000025-000051')}/* 国际化处理： 退回原因*/
					label={loadMultiLang(this.props,'1880000025-000051')}/* 国际化处理： 退回原因*/
					show={this.state.showReBack}
					onOk={(value) => {
						//处理退回
						backConfirm.call(this, this.props,value);
					}}
					onClose={() => {
						this.setState({ showReBack: false})
					}}
				/>
				
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={this.closeApprove}
						billtype={'36K2'}
						billid={this.billId}
					/>
				</div>
				{/** 联查预算 **/}
				<div>
					<Inspection
						show={this.state.showInspection}
						sourceData={this.state.sourceData}
						cancel={() => {
							this.setState({ showInspection: false })
						}}
						affirm={() => {
							this.setState({ showInspection: false })
						}}
					/>
				</div>
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props,'1880000025-000053')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, card_page_id, card_from_id, bodyCodeMapBodyPKName, 'pk_allocate_h', base_url+'commit.do', loadMultiLang(this.props,'1880000025-000001'), dataSource, repaintView.bind(this, this.props), false, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
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
				{/* 银行账户余额 */}
				<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData = {this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
							//console.log(retOriginalMsg, 'retOriginalMsg')
							//关闭对话框
							this.setState({
								showOriginal: false
							})
						}}
						onCloseClick={() => {
							//关闭对话框
							this.setState({
								showOriginal: false
							})
						}}
					>
				</NCCOriginalBalance>
				{/** 附件管理 **/}
				<div className="nc-faith-demo-div2">
                    {showUploader &&
                        <NCUploader
                            billId={this.billId}
                            billNo={this.billno}
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
				{/** 联查内部账户余额 **/}
				<div>
					{showAccModal &&
						<InnerAccoutDialog
							id="dialog"
							showModal={showAccModal}
							accpk={pkInnAccount}
							closeModal={() => {
								this.setState({ showAccModal: false });
							}}
						/>
					}
				</div>

				{/* 支付模态框 */}
				{createNCModal('payModel', {
					title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
				})}
				
			</div>
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'card', 
        pagecode: card_page_id, 
        headcode: card_from_id,
        bodycode: card_table_id
    },
	mutiLangCode: module_id,
	orderOfHotKey:{card_from_id,card_table_id}
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/