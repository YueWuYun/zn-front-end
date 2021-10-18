/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast, high, getMultiLang } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent } from './events';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";
import { buttonVisable } from "./events/buttonVisable";//自定义按钮显示
import { setSourceFlag } from '../util/setSourceFlag.js';//设置来源
import { commonurl } from '../../../public/utils/constant';//附件改造使用
let { NCAffix, NCDiv } = base;
const { Inspection } = high;//联查计划预算
const { NCUploader, ApproveDetail } = high;//附件相关
const { BillTrack, PrintOutput } = high;//联查单据
let form_id = Templatedata.card_formid;
let search_id = Templatedata.list_searchid;
let table_id = Templatedata.card_tableid;
let module_id = Templatedata.card_tableid;
let page_id = Templatedata.card_pageid;
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
/**
 * 收款結算審批被聯查頁面
 */
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = form_id;
		this.searchId = search_id;
		this.moduleId = module_id;
		this.tableId = table_id;
		this.pageId = page_id;
		this.billno = '';//单据编号
		this.billId = '',//单据pk
		this.billtype= '',//审批意见单据类型
			this.state = {
				showInspection: false,//联查预算
				sourceData: null,//联查预算数据源
				showbilltrack: false,//联查单据
				showbilltrackpk: '',//联查单据pk
				showbilltracktype: '',//联查单据类型
				show: false,//审批意见是否显示
				showUploader: false,//控制附件弹出框
				target: null,//控制弹出位置
				tradebtnflag: true,
				pasteflag: false,//表体中按钮的显隐性状态
				tradetype: 'D4',
				tradename: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000018'),/* 国际化处理： 收款结算单*/
				tradepk: '0000Z6000000000000F4',
				org_value: '',//切换组织取消使用
				org_display: '',//切换组织取消使用
				outputData: '',//打印输出使用
				tableindex: null, 
				sscivmMessage:null,
			};
	}
	componentDidMount() {
	}
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			initTemplate.call(this, this.props);
		};
		getMultiLang({
			moduleId: ['36070RBMAPP', '36070'],
			domainName: 'cmp',
			callback
		});
	}
	//加载数据刷新数据
	refresh = () => {
		//查询单据详情
		if (this.props.getUrlParam('status') === 'browse') {
			if (this.props.getUrlParam('id') &&
				this.props.getUrlParam('id').length > 0) {
				let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
				let that = this;
				ajax({
					url: '/nccloud/cmp/recbill/recbillquerycard.do',
					data: data,
					success: (res) => {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								//页签赋值
								let billno = res.data.head[this.formId].rows[0].values.bill_no.value;
								let source_flag = res.data.head[this.formId].rows[0].values.source_flag.value;
								this.billno = billno;
								setSourceFlag.call(this, source_flag);
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
							}
						} else {
							this.props.form.EmptyAllFormValue(this.formId);
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
						this.toggleShow();

					}
				});
			} else {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002') });/* 国际化处理： 操作失败，无数据!*/
			}
		}
	
	}
	//切换页面状态
	toggleShow = () => {

		let status = this.props.getUrlParam('status');
		this.props.cardTable.setStatus(this.tableId, 'edit');
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		if (status == 'browse') {
			this.props.cardTable.setStatus(this.tableId, 'browse');
			this.props.form.setFormStatus(this.formId, 'browse');
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno  //修改单据号---非必传
			});

		} else {
			this.props.cardTable.setStatus(this.tableId, 'edit');
			this.props.form.setFormStatus(this.formId, 'edit');
		}
		if (status != 'browse') {
			this.setState({
				tradebtnflag: false
			});
		}
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.billno  //修改单据号---非必传
		});
		buttonVisable.call(this, this.props);//按钮的显隐性
	};
	//按钮显示
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			show: false
		})
	}
	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	//获取列表肩部信息,肩部按钮
	getTableHead = (buttons, tableId) => {
		return (
			<div className="shoulder-definition-area">

				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{/* 应用注册按钮 */}
					{this.props.button.createButtonApp({
						area: Templatedata.card_body,
						buttonLimit: 3,
						onButtonClick: buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}

				</div>
			</div>
		);
	};
	render() {
		let { cardTable, form,button } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp ,createErrorFlag} = button;
		let { showUploader, target } = this.state;//附件相关内容变量
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					{/**创建websocket */}
					{api.comm.createCardWebSocket(this.props, {
						headBtnAreaCode: cons.card.btnHeadCode,
						formAreaCode: cons.card.headCode,
						billpkname: cons.field.pk,
						billtype: cons.comm.billType
						// serverLocation: '10.16.2.231:9991'
					})}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER}
							className="nc-bill-header-area">
							<div className="header-title-search-area">
								{
									createBillHeadInfo(
										{
											title: this.props.MutiInit.getIntl("36070RBMAPP") &&
												this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000039'),  //标题{/* 国际化处理： 收款结算*/}
											billCode: this.billno   //单据号
											//showBackBtn: false,
											//showBillCode: true
										}
									)}
							</div>

							<div className="header-button-area">
								{createErrorFlag({
									headBtnAreaCode: cons.card.btnHeadCode
								})}
								{this.props.button.createButtonApp({
									area: Templatedata.card_head,
									buttonLimit: 14,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [jsondata.form1],
							onAfterEvent: afterEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							adaptionHeight: true,//表格固定行
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							showCheck: true
						})}
					</div>
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader &&
						<NCUploader
							billId={this.billId}
							target={target}
							placement={'bottom'}
							billNo={this.billno}
							onHide={this.onHideUploader}
							customInterface={
								{
									queryLeftTree: commonurl.lefttreequery,
									queryAttachments: Templatedata.annex_url
								}
							}//附件改造
						/>
					}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.billtype}
						billid={this.billId}
					/>
				</div>
				{/* 联查单据 */}
				<div>
					<BillTrack
						show={this.state.showbilltrack}
						close={() => {
							this.setState({ showbilltrack: false })
						}}
						pk={this.state.showbilltrackpk}  //单据id
						type={this.state.showbilltracktype}  //单据类型
					/>
				</div>
				{/* 联查计划预算 */}
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
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/cmp/recbill/recbillprintcard.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
			</div>
		);
	}
}

Card = createPage({
	mutiLangCode: "36070RBMAPP",
	billinfo: {
		billtype: 'card',//一主一子
		pagecode: Templatedata.card_pageid,
		headcode: Templatedata.card_formid,
		bodycode: Templatedata.card_tableid,
	},
	orderOfHotKey: [Templatedata.card_formid, Templatedata.card_tableid]//快捷键
})(Card);
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/