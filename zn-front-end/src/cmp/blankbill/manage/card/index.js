/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, getMultiLang, getBusinessInfo, cardCache, promptBox, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, pageInfoClick } from './events';
import { constant, requesturl, btn } from '../config/config';
import { buttonVisible } from './events/buttonVisible';
import { commondata } from '../../../public/utils/constant';
import { orgVersionUtil } from '../config/orgVersionUtil';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
import BXCard from '../bxcard/index';
import ZFCard from '../zfcard/index';
let { NCFormControl, NCBackBtn, NCAffix, NCDiv } = base;
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans } = high;
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../cons/constant';
const {  } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,PRINT_BTN,PRINT_GROUP,OUTPUT_BTN,REFRESH_BTN } = BTN;

import NCCOriginalBalance from'../../../public/restmoney/list/index';
class Card extends Component {
	constructor(props) {
		super(props);
		this.pageId = CARD__PAGECODE;
		this.formId = CARD_FORMCODE;
		this.moduleId = APPCODE;
		this.cacheDataSource = constant.cacheDataSource;
		this.pkname = PK_NAME;
		this.state = {
			billId:'',//单据id
			billno: '' ,// 单据编号
			showUploader: false, // 附件弹框显示
			target: null, //
			addid: '',
			outputData: '', // 输出数据
			showNCbackBtn: true, // 返回按钮是否显示
			json: {}, // 多语
			inlt: null,
			showBxCard: false, // 报销弹框显示
			showBxCardData:[], // 报销弹框数据
			showZfCard: false, // 报销弹框显示
			showZfCardData:[], // 报销弹框数据
		};
	}

	//浏览器页签关闭提示
	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log(this.state.json['36070BBM-000018'])   // 未请求到多语资源的后续操作
			}
		}
		getMultiLang({ 
			moduleId: {
			[constant.module_tmpub_name]: [constant.module_tmpub_id],
			[constant.module_name]: [constant.module_id,constant.mutiLangCode]
			}, 
		callback });
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
	}

	componentDidMount() {
		this.renderHtmlByStatus();
	}

	// 根据不同的状态渲染不同的页面数据
	renderHtmlByStatus = () => {
		let flag=false;
		let pk = this.props.getUrlParam('id');
		let data = { pk: pk, pageCode: this.pageId };
		let urlstatus = this.props.getUrlParam('status');
		//查询单据详情
		if (urlstatus === 'browse') {
			if(pk){
				this.browseRender(pk);
			}
		}
	}
	refreshdata = () => {
		let pk_ebm = this.props.form.getFormItemsValue(this.formId, PK_NAME).value;
			let data = {
				pk: pk_ebm,
				pageCode: this.pageId
			};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.buttonAfter(res.data);
						}
					} else {
						this.props.form.setAllFormValue({
							[this.formId]: {
								rows: []
							}
						});
					}
				}
			});

	}
	// 按钮点击后渲染数据
	buttonAfter(billdata){
		let billno = billdata[this.formId].rows[0].values[VBILLNO].value;
		let id = billdata[this.formId].rows[0].values[PK_NAME].value;
		let billstatus = billdata[this.formId].rows[0].values[BILL_STATUS].value;
		// 更新缓存
		updateCache(this.pkname, id, billdata, this.formId, this.cacheDataSource, billdata[this.formId].rows[0].values);
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: billno  //修改单据号---非必传
		});
		//动态修改地址栏中的id的值
		this.props.setUrlParam({
			status: 'browse',
			id: id
		});
		this.props.form.setAllFormValue({
			[this.formId]: billdata[this.formId]
		});
		this.props.form.setFormStatus(this.formId, 'browse');
		buttonVisible.call(this,this.props, billstatus);
	}

	// 浏览态数据渲染
	browseRender = (billid) =>{
		let cardData,billstatus,billno,pk_ebm
		if(billid){
			cardData = getCacheById(billid, this.cacheDataSource);
			let queryData =  { pk: billid, pageCode: this.pageId };
			if(cardData){
				this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });
				billno = cardData[this.formId].rows[0].values.billno.value;
				pk_ebm = cardData[this.formId].rows[0].values[this.pkname].value;
				billstatus = cardData[this.formId].rows[0].values.billstatus.value;
				buttonVisible.call(this,this.props, billstatus);
				this.props.form.setFormStatus(this.formId, 'browse');
				this.setState({ 
					addid: pk_ebm,
					});
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: billno  //修改单据号---非必传
				});
			}else{
				ajax({
					url: QUERYCARD,
					data: queryData,
					success: (res) => {
						if (res) {
							if (res.data) {
								this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
								billno = res.data[this.formId].rows[0].values[VBILLNO].value;
								pk_ebm = res.data[this.formId].rows[0].values[this.pkname].value;
								billstatus = res.data[this.formId].rows[0].values[BILL_STATUS].value;
								this.setState({ 
									addid: pk_ebm,
								});
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
									showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
									billCode: billno  //修改单据号---非必传
								});
								buttonVisible.call(this, this.props, billstatus);
								this.props.form.setFormStatus(this.formId, 'browse');
							}else{
								this.emptyData();
							}
						} else {
							this.emptyData();
						}
						orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
					}
				});
			}
		}else{
			this.emptyData();
		}
	}

	// 刷新渲染
	refreshrender = () =>{
		let pk_ebm = this.props.form.getFormItemsValue(this.formId, PK_NAME).value;
		let data = {
			pk: pk_ebm,
			pageCode: this.pageId
		};
		ajax({
			url: requesturl.querycard,
			data: data,
			success: (res) => {
				if (res) {
					if (res.data) {
						this.buttonAfter(res.data);
					}
				} else {
					this.props.form.setAllFormValue({
						[this.formId]: {
							rows: []
						}
					});
				}
			}
		});
	}

	// 清空数据
	emptyData = () =>{
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.setUrlParam({
			status: 'browse',
			id: null
		});
		buttonVisible.call(this, this.props, null);
		this.setState({ 
			addid: null,
		});
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			// billCode: this.billno  //修改单据号---非必传
		});
		//设置卡片翻页的显隐性
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}

	// 返回方法
	backClick = () =>{
		window.onbeforeunload = null;
		this.props.pushTo(constant.listpath,{pagecode: constant.lpagecode,});
	}
	close() {
        this.setState({ showModal: false });
	}
	
	savecallback(){
		this.refreshrender();
	}

	render() {
		let { form, cardPagination } = this.props;
		let { createForm } = form;
		const { createCardPagination } = cardPagination;
		let { showUploader, target,billno,billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				{/* <div className="nc-bill-top-area"> */}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							<div className="header-title-search-area">
								{createBillHeadInfo({
										title:this.state.json['36070BBM-000000'],
										billCode: this.state.billno,
										backBtnClick: () => {
											this.backClick();
										}
								})}
							</div>
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: 'card_head',
								buttonLimit: 7,
								onButtonClick: buttonClick.bind(this),
								// popContainer: document.querySelector('.header-button-area')
							})}
						</div>
						{/* 附件 */}
						<div className="nc-faith-demo-div2">
							{/* 这里是附件上传组件的使用，需要传入三个参数 */}
							{showUploader && <NCUploader
								billId={billId}
								target={target}
								placement={'bottom'}
								billNo={billno}
								onHide={() => {
									this.setState({
										showUploader: false
									})
								}} // 关闭功能
								/>
							}
						</div>
						{/* 左右切换数据 */}
						<div className="header-cardPagination-area" style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: this.cacheDataSource
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* 设置卡片展开于隐藏 默认隐藏  */}
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						expandArr: [ this.formId, CARD_FORMCODE2 ]
						// onAfterEvent: afterEvent.bind(this)
					})}
				</div>
				{/* </div> */}
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url= {PRINT}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				<BXCard
                    // 报销框显示
                    showmodal={this.state.showBxCard}
                    showBxCardData = {this.state.showBxCardData}
                    // 点击确定按钮的回调函数
                    onSureClick={this.close.bind(this)}
                    onCloseClick={() => {
                        //关闭对话框
                        this.setState({
                            showBxCard: false
                        })
					}}
					savecallback={this.savecallback.bind(this)}
                >
                </BXCard>

				<ZFCard
                    // 作废框显示
                    showmodal={this.state.showZfCard}
                    showZfCardData = {this.state.showZfCardData}
                    // 点击确定按钮的回调函数
                    onSureClick={(retOriginalMsg) => {
                        //关闭对话框
                        this.setState({
                            showZfCard: false
                        })
                    }}
                    onCloseClick={() => {
                        //关闭对话框
                        this.setState({
                            showZfCard: false
                        })
					}}
					savecallback={this.savecallback.bind(this)}
                >
                </ZFCard>

			</div>
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'form',
        pagecode: CARD__PAGECODE,
        headcode: CARD_FORMCODE
    },
	// mutiLangCode: constant.mutiLangCode
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/