/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, base, high, cardCache, getMultiLang } from 'nc-lightapp-front';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";
import { buttonVisable } from "./events/buttonVisable";//按钮显隐性
import { orgVersionUtil } from "../util/orgVersionUtil";//多版本显示
import { formBeforeEvent } from '../../../public/CMPFormRefFilter.js';//单据控制规则[form编辑前事件]
import { bodyBeforeEvent } from '../../../public/CMPTableRefFilter.js';//单据控制规则[table编辑前事件]
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { loadQueryData } from './indexUtil/loadQueryData.js';
import { cancleSkyPage } from './indexUtil/cancleSkyPage.js';
import { delConfirm } from './indexUtil/delConfirm.js';
import { addmodellineBtn } from './tableButtonClick/addlineBtn.js';
import { cancelConfirm } from './indexUtil/cancelConfirm.js';
import { saveBill } from './indexUtil/saveBill.js';
import { saveAddBill } from './indexUtil/saveAddBill.js';
import { saveSubBill } from './indexUtil/saveSubBill.js';
import { saveSubAssginBill } from './indexUtil/saveSubAssginBill.js';
import { buttonUsability } from './events/buttonUsability.js';
import { setPkRegister } from "./events/checkNoteno.js";//票据号相关
import { commonurl } from '../../../public/utils/constant';//附件改造使用
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
const { NCUploader, ApproveDetail, BillTrack, ApprovalTrans } = high;//附件相关联查审批意见
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
let { NCAffix, NCDiv } = base;
let {
	deleteCacheById,
} = cardCache;
/**
 * 收款结算单协同卡片
 */
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.list_moduleid;
		this.tableId = Templatedata.card_tableid;
		this.pageId = Templatedata.card_pageid;
		this.childform = Templatedata.card_edit_form;
		this.dataSource = Templatedata.dataSource;//缓存相关
		this.key = Templatedata.key;//缓存相关
		this.pkname = Templatedata.pkname;//缓存相关
		this.tradeType = 'trade_type';//单据控制规则交易类型字段名称（也可传递的单据类型）
		this.formVOClassName = 'RecBillVO';//form表单的vo类名
		this.tableVOClassName = 'RecBillDetailVO';//table表体的vo类名
		this.showbilltrackpk = '';//联查单据pk
		this.showbilltracktype = '';//联查单据类型
		this.deleteId = '',//缓存删除id
		this.billid = '',//审批意见单据pk
		this.billtype = '';//审批意见单据类型
		this.billId = '';//单据pk
		this.billno = ''; // 单据编号
		this.notestatus = 'add';//票据号相关内容
		this.pk_registers = null;//票据号表体pk集合
		this.compositedata = null,//提交指派页面
			this.getAssginUsedr = null,//提交指派的value
			this.state = {
				showbilltrack: false,//联查单据
				show: false,//审批意见是否显示
				showUploader: false,//控制附件弹出框
				target: null,//控制弹出位置
				pasteflag: false,//表体中按钮的显隐性状态
				compositedisplay: false,//是否显示指派页面
				tableindex: null,//是否浏览态表体展开状态true：展开按钮，false：收起按钮
				isSaveSub: false,//是否保存提交标识
				showbilltrackpk:'',
				showbilltracktype:'',
				approvebillid:'',
				billtype:''

			};
	}
	componentDidMount() {
		
	}
	//浏览器页签关闭提示
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			//console.log(status, 'onbeforeunload_status');
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
				['cmp']: [Templatedata.app_code, '36070']
			},
			callback
		})
	}
	//加载数据刷新数据
	refresh = () => {
		this.toggleShow();//切换页面状态,查询要根据状态动态改变按钮显隐性的pk
		loadQueryData.call(this);
	}
	//卡片删除
	delConfirm = () => {
		delConfirm.call(this);
	}
	//切换页面状态
	toggleShow = () => {
		//console.log("buttons", this.props.button.getButtons());
		let status = this.props.getUrlParam('status');
		//票据号相关赋值
		if (status && status == 'edit') {
			this.notestatus = status;//票据号状态
			this.pk_registers = null;//重置表体票据号pk
			setPkRegister.call(this);//汇总表体票据号pk
		}
		let billstatus = this.props.getUrlParam('billno');//获取单据状态
		this.props.cardTable.setStatus(this.tableId, 'edit');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		this.props.form.setFormStatus(this.formId, status);
		if (status == 'browse') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno  //修改单据号---非必传
			});
			this.props.cardTable.setStatus(this.tableId, 'browse');
		} else if (status == 'edit') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno  //修改单据号---非必传
			});
			this.props.cardTable.setStatus(this.tableId, 'edit');
		} else {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				// billCode: this.state.billno  //修改单据号---非必传
			});
			this.props.cardTable.setStatus(this.tableId, 'edit');
		}
		orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
		buttonVisable.call(this, this.props);//按钮显隐性
		buttonUsability.call(this, this.props);//卡片表体按钮空值是否可用
	};
	//卡片返回按钮
	handleClick = () => {
		window.onbeforeunload = null;
		this.props.pushTo('/list');
	}
	// 跳转空白card页面
	cancleSkyPage = () => {
		cancleSkyPage.call(this);
	}
	//删除缓存
	deleteCacheData = () => {
		deleteCacheById(this.pkname, this.deleteId, this.dataSource);
	}
	//审批指派返回action如果需求可以请求后台
	getAssginUsedrFunction = (value) => {
		this.getAssginUsedr = value;

		if (this.state.isSaveSub) {
			//指派提交[保存提交]
			// saveSubAssginBill.call(this);
			saveSubBill.call(this);
		} else {
			//指派提交[肩部按钮]
			buttonClick.call(this, this.props, 'submittAssginBtn');
		}
		
	}
	//取消确认按钮
	cancelConfirm = () => {
		cancelConfirm.call(this);
	}
	//取消---跳转浏览态页面
	//@param url:请求的连接
	//@param pk:跳转数据pk
	//@param pagecode:请求的pageid
	//@param billno:请求的单据状态
	cancleNewPage = (pk, bill_no) => {
		this.props.pushTo('/card', {
			status: 'browse',
			id: pk,
			billno: bill_no,
			pagecode: this.pageId
		})
		this.refresh();
	}
	//保存单据
	saveBill = () => {
		saveBill.call(this);
	};
	//保存新增
	saveAddBill = () => {
		saveAddBill.call(this);
	}
	//保存提交
	saveSubBill = () => {
		saveSubBill.call(this);
	}
	//获取列表肩部信息,肩部按钮
	getTableHead = (buttons, tableId) => {
		let { createButton } = this.props.button;
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
		let { cardTable, form, cardPagination,button } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createButtonApp ,createErrorFlag} = button;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
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
											title: this.props.MutiInit.getIntl("36070RBMCP") &&
												this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000041'),  //标题
											billCode: this.billno,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.handleClick();
											}
										}
									)}
							</div>
							<div className="header-button-area">
								{createErrorFlag({
                                    headBtnAreaCode: cons.card.btnHeadCode
                                })}
								{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
								{this.props.button.createButtonApp({
									area: Templatedata.card_head,
									buttonLimit: 10,
									onButtonClick: buttonClick.bind(this)
								})}

							</div>
							<div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									dataSource: this.dataSource,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							expandArr: [jsondata.form1],
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: formBeforeEvent.bind(this)//form编辑前事件
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{
							createCardTable(this.tableId, {
								adaptionHeight: true,//表格固定行
								tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								modelSave: () => {
									this.saveBill();
									this.props.cardTable.closeModel(this.tableId);//关闭侧拉
								},
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: bodyBeforeEvent.bind(this),//table编辑前事件
								onSelected: buttonUsability.bind(this, this.props),//列表控制列表按钮是否可用
								onSelectedAll: buttonUsability.bind(this, this.props),//列表控制列表按钮是否可用
								showCheck: true,
								showIndex: true,//显示序号
								modelAddRow: (props, moduleId, index) => {
									addmodellineBtn.call(this);//增行后赋值
								}
							})
						}
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
							onHide={
								() => {
									this.setState({
										showUploader: false
									})
								}
							}
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
						close={
							() => {
								this.setState({
									show: false
								})
							}
						}
						billtype={this.state.billtype}
						billid={this.state.approvebillid}
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
				<div>
					{/* 提交及指派 */}
					{this.state.compositedisplay ? <ApprovalTrans
						title={this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000071')} //指派
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
		billtype: 'card',
		pagecode: Templatedata.card_pageid,
		headcode: Templatedata.card_formid,
		bodycode: Templatedata.card_tableid,
	},
	orderOfHotKey: [Templatedata.card_formid, Templatedata.card_tableid]//快捷键
})(Card);
export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/