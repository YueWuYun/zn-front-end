/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//单表卡片
import React, { Component } from 'react';
import { createPage, base, high, cardCache, getMultiLang } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import { buttonVisable } from "./events/buttonVisable";//按钮显隐控制
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";//多版本显示
import NCCOriginalBalance from '../../../public/restmoney/list/index';
import { cancleNewPage } from "./indexUtil/cancleNewPage.js";
import { cancleSkyPage } from "./indexUtil/cancleSkyPage.js";
import { loadCacheData } from "./indexUtil/loadCacheData.js";
import { loadQueryDatas } from "./indexUtil/loadQueryDatas.js";
import { cardSubmitAssginBtn } from "./buttonClick/cardSubmitAssginBtn.js";
import { saveSubAssginBtn } from "./buttonClick/saveSubAssginBtn.js";
import { newformBeforeEvent } from "../util/formBeforeEvent.js";
import { saveMultiLangRes ,createCardWebSocket} from '../../../../tmpub/pub/util';
import { srcSourceLanguage } from '../../../pub/utils/srcSourceLanguage';
import { srcBillEdit } from "./indexUtil/srcBillEdit.js";
import './index.less';
let { NCFormControl, NCAffix } = base;
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans } = high;//附件打印审批意见相关
const { NCDiv } = base;
const saga_gtxid = Templatedata.saga_gtxid;
const pkname = Templatedata.pkname;

//缓存
let {
	updateCache,
	deleteCacheById } = cardCache;
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.list_moduleid;
		this.tableId = Templatedata.card_tableid;
		this.pageId = Templatedata.card_pageid;
		this.dataSource = Templatedata.dataSource;//缓存相关
		this.key = Templatedata.key;//缓存相关
		this.pkname = Templatedata.pkname;//缓存相关
		this.billno = '';//单据编号
		this.compositedata = null,//提交指派页面
			this.getAssginUsedr = null,//提交指派的value
			this.state = {
				show: false,//审批意见是否显示
				billid: '',//审批意见单据pk
				billtype: '',//审批意见单据类型
				billId: '',//单据pk
				showUploader: false,//控制附件弹出框
				target: null,//控制弹出位置
				org_value: '',//切换组织取消使用
				org_display: '',//切换组织取消使用
				outputData: '',//输出使用
				deleteId: '',//删除单据pk
				showOriginal: false, //联查余额
				showOriginalData: '',//联查余额
				compositedisplay: false,//是否显示指派页面
				isSaveSub: false,//是否是保存提交
				// 取个性化中心设置的组织,用户预设财务组织
				curr_pk_org: null,
				curr_orgname: null,
				curr_pk_org_v: null,
				curr_orgname_v: null

			};
	}
	componentDidMount() {
	}
	//浏览器页签关闭提示
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.list_moduleid, '36070', '36070WC', '36070APM']
			},
			callback
		});
	}
	//取消---跳转浏览态页面
	cancleNewPage = (pk, bill_no) => {
		cancleNewPage.call(this, pk, bill_no);
	}
	//跳转空白card页面
	cancleSkyPage = () => {
		cancleSkyPage.call(this);
	}
	//加载缓存数据
	loadCacheData = () => {
		loadCacheData.call(this);
	}
	//删除缓存
	deleteCacheData = () => {
		deleteCacheById(this.pkname, this.state.deleteId, this.dataSource);
	}
	//更新缓存
	updateCacheData = () => {
		updateCache(
			this.pkname, saveSubpk, res.data,
			this.formId, this.dataSource,
			res.data[this.formId].rows[0].values
		);
	}
	//加载刷新数据
	refresh = () => {
		this.toggleShow();//切换页面状态
		loadQueryDatas.call(this);//加载卡片页面数据
	}
	// 按钮点击后渲染数据
	buttonAfter(billdata) {
		let aa = billdata.head[this.formId].rows[0].values.pk_cruexchange.value;
		let bb = billdata.head[this.formId].rows[0].values.busistatus.value;
		//浏览态页面
		this.props.form.setAllFormValue({ [this.formId]: billdata.head[this.formId] });
		//页面跳转按钮显示
		let settlepk = billdata.head[this.formId].rows[0].values.pk_cruexchange.value;
		let settlebillno = billdata.head[this.formId].rows[0].values.vbillno.value;
		let settlestatus = billdata.head[this.formId].rows[0].values.busistatus.value;
		this.billno = settlebillno;
		this.props.setUrlParam({
			status: 'browse',
			id: settlepk,
			pk: settlestatus
		});
		this.toggleShow();//切换页面状态
		//更新缓存
		updateCache(this.pkname, settlepk, billdata.head, this.formId, this.dataSource, billdata.head[this.formId].rows[0].values);
	}
	//根据业务类型控制字段编辑性
	setOtherEditAble = (busitype) => {
		if (!busitype) {
			return;
		}
		if (busitype === 'BUY') {//买入外币
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_sellcurrtype': true });//卖出币种
			this.props.form.setFormItemsDisabled(this.formId, { 'sellolcrate': true });//卖出本币汇率
			this.props.form.setFormItemsDisabled(this.formId, { 'sellolcamount': true });//卖出本币金额
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_buycurrtype': false });//买入币种
			this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': false });//买入本币汇率
		} else if (busitype === 'SELL') {//卖出外币
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_buycurrtype': true });
			this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': true });
			this.props.form.setFormItemsDisabled(this.formId, { 'buyolcamount': true });
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_sellcurrtype': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'sellolcrate': true });
			this.props.form.setFormItemsDisabled(this.formId, { 'sellolcamount': true });
		} else if (busitype === 'EXCHANGE') {//外币兑换
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_buycurrtype': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'buyolcrate': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_buyacct': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'buyamount': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'tradeprice': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_sellcurrtype': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'sellolcrate': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_sellacct': false });
			this.props.form.setFormItemsDisabled(this.formId, { 'sellamount': false });
		}
	}
	//切换页面状态,刷新页面
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let scene_link = this.props.getUrlParam('scene');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		if (!this.props.getUrlParam('id') || this.props.getUrlParam('id').length <= 0) {
			//不存在id就隐藏翻页工具
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性
		}
		if (status === 'browse') {
			//浏览态
			if (this.billno != null) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.billno  //修改单据号---非必传
				});
			} else {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
					// billCode: this.state.billno  //修改单据号---非必传
				});
			}
			//被联查控制返回按钮显示
			if (scene_link) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					//tm lidyu 20200327 被检查到卡片态 要有返回按钮 false改为true
					showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					//end lidyu 
				});
				this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性
			}
			this.props.form.setFormStatus(this.formId, status);
		} else if (status === 'edit'||status === 'copy') {
			//修改状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno  //修改单据号---非必传
			});
			this.props.form.setFormStatus(this.formId, 'edit');
		} else {
			//复制+新增状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false  //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
			this.props.form.setFormStatus(this.formId, 'edit');
		}

		orgVersionView(this.props, this.formId)//多版本视图显隐性
		buttonVisable.call(this, this.props);//按钮的显隐性
		srcBillEdit.call(this);//修改推单生成的单据字段编辑状态
		//来源系统多语赋值
		srcSourceLanguage.call(
			this,
			this.props.form.getFormItemsValue(this.formId, 'srcsystem') && this.props.form.getFormItemsValue(this.formId, 'srcsystem').value,
			'srcsystem'
		);
	};
	//初始化财务组织[新增其他字段不可编辑，有值其他可以编辑]
	initMetaByPKorg = () => {
		let status = this.props.getUrlParam('status');
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.resMetaAfterPkorgEdit();
			this.props.initMetaByPkorg();//此方法不可以调用2次，不然rest失败
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//财务组织
		} else {
			this.props.resMetaAfterPkorgEdit();
		}

	}
	//获取按钮的名称
	getButtonNames = (codeId) => {
		if (codeId === 'cancelBtn' || codeId === 'savesubmitBtn' || codeId === 'saveBtn' || codeId === 'cardCopyBtn' || codeId === 'cardAddBtn'
			|| codeId === 'cardSubmitBtn' || codeId === 'cardUnsubmitBtn' || codeId === 'cardEditBtn' || codeId === 'cardDeleteBtn'
			|| codeId === 'cardSettleBtn' || codeId === 'cardUnsettleBtn') {
			return 'main-button'
		} else {
			return 'secondary - button'
		}
	};
	//获取列表表体肩部信息
	getTableHead = (buttons) => {
		let { createButton } = this.props.button;
		return (
			<div className="head">
				<div className="search">
					<span>{this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000035')/* 国际化处理： 调入资产信息*/}
						<NCFormControl
							className='search-handel'
							type={'search'}
							placeholder={''}
							onChange={this.handelChange}
						/>
					</span>
					<span>{this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000036')}</span>{/* 国际化处理： 列设置*/}
				</div>
				<div className="icons">
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-reva-revecontract-card'
					})}
					{buttons.map((v) => {
						if (v.btncode == 'add') {
							return (createButton(v.btncode, {
								name: v.btnname,
								onButtonClick: buttonClick.bind(this),
								buttonColor: this.getButtonNames(v.btncode)
							}))
						}
					})}
				</div>
			</div>
		)
	}
	//审批指派返回action如果需求可以请求后台
	getAssginUsedrFunction = (value) => {
		this.getAssginUsedr = value;
		if (this.state.isSaveSub) {
			saveSubAssginBtn.call(this);//保存提交
		} else {
			cardSubmitAssginBtn.call(this);//普通提交[肩部按钮]
		}

	}
	//卡片返回按钮
	handleClick = () => {
		window.onbeforeunload = null;
		this.props.pushTo('/list');
	}
	render() {
		let { form, cardPagination } = this.props;
		let { createForm } = form;
		let { createCardPagination } = cardPagination;
		let { createButtonApp,createErrorFlag } = this.props.button;
		let { showUploader, target, billId } = this.state;//附件相关内容变量
		// let isLink = this.props.getUrlParam("scene") == "linksce" || this.props.getUrlParam("scene") == "approvesce";
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
 				{/**创建websocket */}
				 {createCardWebSocket(this.props, {
                    headBtnAreaCode: Templatedata.card_head,
                    formAreaCode: Templatedata.card_formid,
                    billpkname: Templatedata.pkname,
                    billtype: Templatedata.billtype,
					dataSource:Templatedata.dataSource
					// serverLocation: '10.16.2.231:9991'
					
                })}

				{/* 吸頂變成藍色 */}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER}
						className="nc-bill-header-area">
						<div className="header-title-search-area">
							{
								createBillHeadInfo(
									{
										title: this.props.MutiInit.getIntl("36070FCE") &&
											this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000039'),  //标题
										billCode: this.billno,     //单据号
										backBtnClick: () => {           //返回按钮的点击事件
											this.handleClick();
										}
									}
								)}
						</div>
							{/** 渲染按钮 **/}
						<div className="header-button-area">
						{createErrorFlag({
                                    headBtnAreaCode: Templatedata.card_head
                                })}
							{createButtonApp({
								area: Templatedata.card_head,
								buttonLimit: 6,
								onButtonClick: buttonClick.bind(this)
							})}
						</div>
						<div className='header-cardPagination-area' style={{ float: 'right' }}>{
							createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: this.dataSource
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-top-area remove-block">
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [jsondata.form1, jsondata.form2, jsondata.form3, jsondata.form4, jsondata.form5
								, jsondata.form6],
							onAfterEvent: afterEvent.bind(this)
							// onBeforeEvent: newformBeforeEvent.bind(this)
						})}
					</div>
				</div>
				{/* 这里是附件上传组件的使用，需要传入三个参数 */}
				<div className="nc-faith-demo-div2">
					{showUploader &&
						<NCUploader
							billId={billId}
							target={target}
							placement={'bottom'}
							billNo={this.billno}
							onHide={
								() => {
									this.setState({
										showUploader: false
									})
								}
							}
						/>
					}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={
							() => {
								this.setState({
									show: false
								})
							}
						}
						billtype={this.state.billtype}
						billid={this.state.billid}
					/>
				</div>
				{/* 打印输出 */}
				<PrintOutput
					ref="printOutput"
					url='/nccloud/cmp/curexchange/curexchangeprint.do'
					data={this.state.outputData}
					callback={this.onSubmit}
				/>
				{/* 联查余额 */}
				<NCCOriginalBalance
					showmodal={this.state.showOriginal}
					showOriginalData={this.state.showOriginalData}
					// 点击确定按钮的回调函数
					onSureClick={() => {
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

				<div>
					{/* 提交及指派 */}
					{this.state.compositedisplay ? <ApprovalTrans
						title={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000082')}
						data={this.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedrFunction}
						cancel={
							() => {
								this.setState({
									compositedisplay: false
								})
							}
						}
					/> : ""}
				</div>
			</div>

		);
	}
}
Card = createPage({
	mutiLangCode: Templatedata.list_moduleid,
	billinfo: {
		billtype: 'form',
		pagecode: Templatedata.card_pageid,
		headcode: Templatedata.card_formid
	}
})(Card);
// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/