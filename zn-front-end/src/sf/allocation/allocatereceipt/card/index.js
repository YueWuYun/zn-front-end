/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//单表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, getMultiLang, createPageIcon, toast} from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCBackBtn ,NCDiv} = base;
import { buttonClick, initTemplate, afterEvent, pageInfoClick, buttonVisible } from './events';
import { card_page_id, dataSource, pk_allocatereceipt, module_id, app_code,receiptBillType,receiptPk,card_from_id} from '../cons/constant.js';
//联查内部账户组件
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
//联查收款银行账户组件
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
import { setPropCache, saveMultiLangRes, loadMultiLang ,createCardWebSocket} from "../../../../tmpub/pub/util/index";
const { NCUploader, PrintOutput, Inspection } = high;
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = 'form_allocatereceipt_head';
		this.searchId = '36320FAR_list_search';
		this.moduleId = '3632';
		this.tableId = '36320FAR_list_table';
		this.pageId = '36320FAR_C01';
		this.state = {
			vbillno: '',//进入卡片时 显示的单据号
			billId: '',//单据id
			billno: '',// 单据编号
			showUploader: false,//控制附件弹出框
			target: null,//控制弹出位置
			showplan: false,//联查预算参数
			sourceDataplan: null,//联查预算参数
			outputData: '',//输出数据参数
			accModalShow: false,//内部账户余额参数
			currentpk: '',//内部账余额参数
			//联查 收款银行账户 指定参数 pk_bankacc_r
			showOriginal: false, // 是否展示期初余额联查框，true:展示，false:不展示
			showOriginalData: [],// 联查余额取数据，将需要联查的数据赋值给我
			//联查计划预算
			showNtbDetail: false,//是否显示预算计划
			ntbdata: null,//预算计划数据
		};
		//		initTemplate.call(this, props);
	}

	cancel() {
		this.setState({
			show: false
		})
	}
	affirm(info) {
		this.setState({
			show: false
		})
	}

	componentWillMount() {
		getMultiLang({
			//模块编码
			moduleId: [module_id, app_code],
			//领域编码
			domainName: 'sf',
			//回调
			callback: (lang) => {
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				initTemplate.call(this, this.props);
			}
		});
	}

	componentDidMount = () => {

		//查询单据详情[浏览卡片]
		if (this.props.getUrlParam('status') === 'browse') {
			//后台grid只接受pageid。
			let data = { pks: [this.props.getUrlParam('id')], pageid: '36320FAR_C01' };
			ajax({
				url: '/nccloud/sf/allocatereceipt/queryPageCard.do',
				data: data,
				success: (res) => {					
					//data要看返回的id，而不是后台设置的id
					if (res.data) {

						if(res.data.head.form_allocatereceipt_head.rows[0].values.saga_status){
	
							let saga_status = res.data.head.form_allocatereceipt_head.rows[0].values.saga_status;
	
							this.props.button.toggleErrorStatus('card_head',{
								isError: saga_status.value === "1"
							})
						}						
						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						//页签赋值
						this.setState({
							vbillno: res.data.head[this.formId].rows[0].values.vbillno.value
						});
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
					//此时卡片页面为联查场景
					if (this.props.getUrlParam('scence') == 'linksce') {
						//隐藏卡片翻页按钮
						this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
						//隐藏卡片返回按钮
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							showBackBtn: false  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						});
					}					
					this.toggleShow();
				}
			});
		}

	}
	//切换页面状态
	toggleShow = () => {
		buttonVisible.call(this, this.props);
		//设置卡片头部状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			// showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.state.vbillno  //修改单据号---非必传
		});
	};

	getButtonNames = (codeId) => {
		return 'secondary - button'
	};

	//获取列表肩部信息
	getTableHead = (buttons) => {
		let { createButton } = this.props.button;
		return (
			<div className="head">
				<div className="search">
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
	refresh = () => {
		let status = this.props.getUrlParam('status');
		let pk = this.props.getUrlParam('id');
		if (status === 'edit' || status === 'browse') {//查询单据详情
			let data = { pks: [this.props.getUrlParam('id')], pageid: card_page_id };
			const that = this;
			ajax({
				url: '/nccloud/sf/allocatereceipt/queryPageCard.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							// toast({ color: 'success' , content: loadMultiLang(props,'36320FAR-000038')});/* 国际化处理： 刷新成功*/
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
					}
					this.toggleShow();
				}
			});
		}
	};

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}
	//附件上传校验
	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		//console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			//            alert(this.props.MutiInit.getIntl("36320FAR") && this.props.MutiInit.getIntl("36320FAR").get('36320FDA--000053'))/* 国际化处理： 只支持jpg格式图片*/
			alert(this.state.json['36320FAR-000007']);/* 国际化处理： 只支持jpg格式图片.*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			//            alert(this.props.MutiInit.getIntl("36320FAR") && this.props.MutiInit.getIntl("36320FAR").get('36320FDA--000054'))/* 国际化处理： 上传大小小于2M*/
			alert(this.state.json['36320FAR-000008']);/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}

	// 返回箭头按钮
	link2ListPage = () => {
		this.props.pushTo("/list", {
		});
	};

	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardPagination } = cardPagination;
		let { createCardTable } = cardTable;
		let { createButton, createErrorFlag} = button;
		let { createModal } = modal;
		let { showUploader, target, billno, billId } = this.state;
		let { accModalShow, currentpk, showNtbDetail, ntbdata } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const that = this;
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
                    headBtnAreaCode: 'card_head',
                    formAreaCode: card_from_id,
                    billpkname: receiptPk,
					billtype: receiptBillType,
					dataSource: dataSource
                })}
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
							{/* {this.state.vbillno ? {loadMultiLang(this.props, '36320FAR-000009')}</B> + this.state.vbillno : <B>{loadMultiLang(this.props, '36320FAR-000010')}</B>}国际化处理： 单位下拨回单:,单位下拨回单 */}
							{
									createBillHeadInfo(
										{
											title: loadMultiLang(this.props, '36320FAR-000010'),  //标题/* 国际化处理： 单位下拨回单*/
											billCode: this.state.vbillno,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.link2ListPage();
											}
										}
									)}
					</div>
					<div className="header-button-area">
						{
							createErrorFlag({
								headBtnAreaCode: 'card_head'
							})
						}						
						{this.props.button.createButtonApp({
							area: 'card_head',
							buttonLimit: 20,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
					<div className='header-cardPagination-area' style={{ float: 'right' }}>
						{createCardPagination({
							handlePageInfoChange: pageInfoClick.bind(this),
							dataSource: dataSource
						})}
					</div>
				</NCDiv>
				</NCAffix>
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						onAfterEvent: afterEvent.bind(this)
					})}
				</div>
				{
					<div className="nc-bill-table-area">
						{this.getTableHead(buttons)}
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							showCheck: true,
							showIndex: true
						})}
					</div>
				}
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader
						billId={billId}
						billNo={billno}
						onHide={this.onHideUploader}
					// beforeUpload={this.beforeUpload}
					/>
					}
				</div>
				{/* 联查预算 */}
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
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/sf/allocatereceipt/print.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				<div>
					{/*内部账户余额 提示页面*/}
					{accModalShow && <InnerAccoutDialog
						id="dialog"
						showModal={accModalShow}
						accpk={currentpk}
						closeModal={() => {
							this.setState({
								accModalShow: false,
								currentpk: ''
							})
						}}
					/>}
				</div>
				<div>
					{/* 银行账户余额 */}
					<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
							////console.log(retOriginalMsg, 'retOriginalMsg')
							//关闭对话框
							this.setState({ showOriginal: false })
						}}
						onCloseClick={() => {
							//关闭对话框
							this.setState({ showOriginal: false })
						}}
					>
					</NCCOriginalBalance>
				</div>
			</div>
		);
	}
}

Card = createPage({
	initTemplate: initTemplate,
	mutiLangCode: '2052'
})(Card);

//ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/