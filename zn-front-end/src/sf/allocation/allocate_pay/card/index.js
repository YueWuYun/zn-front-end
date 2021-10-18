/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,high,getMultiLang,createPageIcon} from 'nc-lightapp-front';
let { NCFormControl,NCBackBtn,NCAffix,NCScrollElement ,NCDiv} = base;
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import {buttonVisible} from './events/buttonVisible';
import {cardCache} from "nc-lightapp-front";
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index.js';
let { NCUploader,PrintOutput,ApproveDetail ,Inspection} = high;
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import { setPropCache, saveMultiLangRes, loadMultiLang, createCardWebSocket } from "../../../../tmpub/pub/util/index";

//引入常量定义
import { SHOWMODEL_BULU,SHOWMODEL_LIULAN,dataSource,card_table_id,sourceModel_SF,module_id,module_name,module_tmpub_id,module_tmpub_name, base_url, button_limit, card_page_id, card_from_id, card_table1_id, card_table2_id 
		,allocatePk,allocateBillType} from '../cons/constant.js';

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = 'form_allocate_01';
		this.searchId = 'search_allocate_01';
		this.moduleId = '36320FA_C01';
		this.tableId = 'table_allocate_01';
		this.ismergepay=false;
		this.state = {
			// 网银补录 start
			showBuLu: false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			isMergepay:false,
			// 网银补录 end

			// 附件相关 start
			//单据pk
			billId:'',
			//附件管理使用单据编号
            billno:'',
			//控制附件弹出框
            showUploader: false,
			//控制弹出位置
            target: null,
			// 附件相关 end

			//联查预算参数
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,	

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

			//审批意见 start
			//审批意见是否显示
			show: false,
			//审批意见单据pk
            billid: '',
			//审批意见单据类型
            billtype: '',
			//审批意见 end
		};

		initTemplate.call(this, props);

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
		//查询单据详情
		this.qryCard();
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



	//卡片查询
	qryCard = () => {
		if (this.props.getUrlParam('status') != 'add') {
			let data = { pk: this.props.getUrlParam('id'), pageid: card_page_id ,pageCode:card_page_id};
			ajax({
				url: '/nccloud/sf/allocation/querycard.do',
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
							this.props.form.setAllFormValue({[this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}

						let billId = res.data.head[card_from_id].rows[0].values.pk_allocate_h.value;
						let billno = res.data.head[card_from_id].rows[0].values.vbillno.value;
						this.setState({
							billId,
							billno
						});
						//更新缓存
						cardCache.updateCache('pk_allocate_h', billId, res.data, card_from_id, dataSource);
						this.toggleShow();
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
				}
			});
		} else {
			//this.props.cardTable.addRow(this.tableId);
		}
	}

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		let isLiulan = this.state.modelType
		if(isLiulan == SHOWMODEL_LIULAN){
			return
		}
		let cardpk = this.props.getUrlParam('id');
		let cardts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
	
		let buluData = {
			pk: cardpk,
			ts: cardts,
			results: retMsg,
			pageid: card_page_id,			
			isCardOpt:true,
			ismergepay:this.ismergepay
		}
		ajax({
			url: '/nccloud/sf/allocation/allocatebuluretmsg.do',
			data: buluData,
			success: (res) => {
				if (res.success) {
					if(res.data.billCard){
						if (res.data.billCard.head) {
							this.props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
						} 
						if(res.data.billCard.body){
							this.props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
						}
					}
					if(this.state.isMergepay){
						buttonClick.call(this,this.props,'pay_merge_check')
					}
				}
			}
		});
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


	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			//控制显示返回按钮: true为显示,false为隐藏
			showBackBtn: true,
			//控制显示单据号：true为显示,false为隐藏
			showBillCode: true,
			billCode: this.state.billno,
		});
		this.props.form.setFormStatus(this.formId, status);
		this.props.cardTable.setStatus(this.tableId, status);
		buttonVisible(this.props);		
		orgVersionView(this.props, card_from_id);
	};

	//返回按钮事件配置
	handleClick() {
		let allRows = this.props.cardTable.getAllRows(card_table_id)
		allRows.forEach((val) => {
			let isnetbankfull = val.values.isnetbankfull.value;    
			if(isnetbankfull){
				cardCache.setDefData('ismendinfofull', dataSource, true);
			}
		  });
		this.props.pushTo('/list',{});
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	//获取列表肩部信息
	getTableHead = (buttons) => {
		let { createButton, createButtonApp } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(this.tableId, {
							iconArr: ['close', 'open', 'max']
					})}
					{createButtonApp({area: 'card_body', onButtonClick: buttonClick.bind(this) })}
				</div>
			</div>
		);
	};
	render() {
		let { cardTable, form, button, modal, cardPagination,ncmodal } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		const {createCardPagination} = cardPagination;
		let { createButton, createErrorFlag } = button;
		let { createModal } = modal;	
		let createNCModal  = ncmodal.createModal;
		const { createBillHeadInfo } = this.props.BillHeadInfo;	

		// 附件相关内容变量
		let { showUploader, target,billno,billId,show ,showNtbDetail,ntbdata,pkInnAccount,showAccModal} = this.state;
		console.log(11111);
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
								{/*页面大图标*/}
								{createBillHeadInfo({
									// {/* 国际化处理： 资金上收*/}
									title:loadMultiLang(this.props,'36320FA_PAY-000049'),
									//单据号
									billCode: billno,
									//返回按钮的点击事件 
									backBtnClick: () => {
										this.handleClick();
									}
								})}
														
							</div>	
					
							<div className="header-button-area">
								{
									createErrorFlag({
										headBtnAreaCode: 'list_head'
									})
								}
								{this.props.button.createButtonApp({
										area: 'list_head',
										buttonLimit: 7, 
										onButtonClick: buttonClick.bind(this), 
										popContainer: document.querySelector('.header-button-area')
								})}
							</div>
					
							<div className='header-cardPagination-area' >{createCardPagination({
								handlePageInfoChange:pageInfoClick.bind(this),
								dataSource:dataSource
								})}
							</div>
						
						</NCDiv>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								expandArr: [this.formId],
								onAfterEvent: afterEvent.bind(this),
							})}
						</div>
					{/* </NCScrollElement> */}
				</div>				

				
				<div className="nc-bill-bottom-area">
					<NCScrollElement name='businfo'>
						<div className="nc-bill-table-area">
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this, buttons),
								modelSave: this.saveBill,
								onAfterEvent: afterEvent.bind(this),
								showCheck: true,
								showIndex: true,
								adaptionHeight:true
							})}
						</div>
					</NCScrollElement>
				</div>

				{createNCModal('delete', {
					title: multiLang && multiLang.get('20521030-0020'),
					content: multiLang && multiLang.get('20521030-0006'),
					beSureBtnClick: this.delConfirm
				})}

				{/* 这里是打印输出
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/sf/allocation/allocateprint.do"
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div> */}

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
				
				{/* 模态框 */}
				{createNCModal('commonModel', {
					
				})}


				{/* 支付模态框 */}
				{createNCModal('payModel', {
					title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
				})}

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

			</div>
		);
	}
}

Card = createPage({
	// initTemplate: initTemplate,
	// mutiLangCode: '36320FA_C01',
	mutiLangCode: "36320FA_PAY",
	orderOfHotKey:[card_from_id,card_table_id]
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/