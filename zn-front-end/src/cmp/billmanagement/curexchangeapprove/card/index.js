/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//单表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast, high, getMultiLang } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent } from './events';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import { buttonVisable } from "./events/buttonVisable";//按钮显隐控制
import NCCOriginalBalance from '../../../public/restmoney/list/index';
import { saveMultiLangRes ,createCardWebSocket} from '../../../../tmpub/pub/util';
import { srcSourceLanguage } from '../../../pub/utils/srcSourceLanguage';
import './index.less';
let { NCAffix } = base;
const { NCUploader, ApproveDetail, PrintOutput } = high;//附件打印审批意见相关
const { NCDiv } = base;
const saga_gtxid = Templatedata.saga_gtxid;
const pkname = Templatedata.pkname;

/**
 * 外币兑换-审批中心联查页面
 */
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.list_moduleid;
		this.tableId = Templatedata.card_tableid;
		this.pageId = Templatedata.card_pageid;
		this.state = {
			show: false,//审批意见是否显示
			billid: '',//审批意见单据pk
			billtype: '',//审批意见单据类型
			billno: '', // 单据编号
			billId: '',//单据pk
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			org_value: '',//切换组织取消使用
			org_display: '',//切换组织取消使用
			outputData: '',//输出使用
			showOriginal: false, //联查余额
			showOriginalData: '',//联查余额

		};
	}
	componentDidMount() {
		console.log('--------------------', '审批联查');
	}
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.list_moduleid, '36070']
			},
			callback
		});
	}
	//加载刷新数据
	refresh = () => {
		//查询单据详情[浏览卡片]
		if (this.props.getUrlParam('status') === 'browse') {
			if (this.props.getUrlParam('id') &&
				this.props.getUrlParam('id').length > 0) {
				//后台grid只接受pageid。
				let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
				ajax({
					url: '/nccloud/cmp/curexchange/curexchangecardquery.do',
					data: data,
					success: (res) => {
						//data要看返回的id，而不是后台设置的id
						if (res.data) {
							this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
							if (res.data[this.formId].rows) {
								//页签赋值
								let billno = res.data[this.formId].rows[0].values.vbillno.value;
								this.setState({
									billno: billno
								});
							}
							this.toggleShow();//切换页面状态
						} else {
							this.props.form.EmptyAllFormValue(this.formId);
						}

					}
				});
			} else {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000011') });/* 国际化处理： 操作失败，无数据!*/
				return;
			}

		}
	}
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
	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		if (!this.props.getUrlParam('id') || this.props.getUrlParam('id').length <= 0) {
			//不存在id就隐藏翻页工具
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性
		}
		if (status === 'browse') {
			this.props.form.setFormStatus(this.formId, status);
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.billno  //修改单据号---非必传
			});
		} else {
			this.props.form.setFormStatus(this.formId, 'edit');
		}	

		buttonVisable(this.props);//按钮的显隐性
		//来源系统多语赋值
		srcSourceLanguage.call(
			this,
			this.props.form.getFormItemsValue(this.formId, 'srcsystem') && this.props.form.getFormItemsValue(this.formId, 'srcsystem').value,
			'srcsystem'
		);
	};

	getButtonNames = (codeId) => {
		if (codeId === 'cancelBtn' || codeId === 'savesubmitBtn' || codeId === 'saveBtn' || codeId === 'cardCopyBtn' || codeId === 'cardAddBtn'
			|| codeId === 'cardSubmitBtn' || codeId === 'cardUnsubmitBtn' || codeId === 'cardEditBtn' || codeId === 'cardDeleteBtn'
			|| codeId === 'cardSettleBtn' || codeId === 'cardUnsettleBtn') {
			return 'main-button'
		} else {
			return 'secondary - button'
		}
	};
	//卡片返回按钮
	handleClick = () => {
		//先跳转列表
	}
	render() {
		let { form } = this.props;
		let { createForm } = form;
		let { createButtonApp , createErrorFlag } = this.props.button;
		let { showUploader, target, billno, billId } = this.state;//附件相关内容变量
		const { createBillHeadInfo } = this.props.BillHeadInfo;//卡片标题信息
		return (
			<div className="nc-bill-card">
			{/**创建websocket */}
			{createCardWebSocket(this.props, {
                    headBtnAreaCode: Templatedata.card_head,
                    formAreaCode: Templatedata.card_formid,
                    billpkname: Templatedata.pkname,
                    billtype: Templatedata.billtype,
					//serverLocation: '10.16.2.231:9991'
					dataSource:Templatedata.dataSource
                })}
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER}
						className="nc-bill-header-area">
						<div className="header-title-search-area">
							{
								createBillHeadInfo(
									{
										title: this.props.MutiInit.getIntl("36070FCEAPP") &&
											this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000042'),  //标题
										billCode: this.state.billno,     //单据号
									}
								)}
						</div>
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
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-top-area remove-block">
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [jsondata.form1, jsondata.form2,
							jsondata.form3, jsondata.form4, jsondata.form5
								, jsondata.form6],
							onAfterEvent: afterEvent.bind(this)
						})}
					</div>
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
						/>
					}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.state.billtype}
						billid={this.state.billid}
					/>
				</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/cmp/curexchange/curexchangeprint.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				{/* 联查余额 */}
				<div>
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

				</div>
			</div>

		);
	}
}
Card = createPage({
	mutiLangCode: '36070FCEAPP',
	billinfo: {
		billtype: 'form',
		pagecode: Templatedata.card_pageid,
		headcode: Templatedata.card_formid
	}
})(Card);
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/