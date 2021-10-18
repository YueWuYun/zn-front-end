/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast, high, cardCache, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCBackBtn, NCDiv} = base;
import { buttonClick, initTemplate, afterEvent, pageInfoClick, beforeEvent } from './events';
import { buttonVisible } from './events/buttonVisible';
//引入附件组件
const { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans, Inspection } = high;
//引入常量定义
import { module_id, funcode, lang, base_url, button_limit, card_page_id, card_from_id, card_table_id, viewmod_agree, AllocateAgreeCache } from '../cons/constant.js';
import { deleteCacheData, getNextId, deleteCacheDataForList, addCacheData, updateCacheData, getDefData, setDefData } from '../../../../tmpub/pub/util/cache';
import Sign from '../../../../tmpub/pub/util/ca/index';
//内部账户
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
// import Sign from '../../../../tmpub/pub/util/ca/index';
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list/index';
let { addCache, getCacheById, updateCache } = cardCache;
import { backConfirm } from "./events/buttonClick";
//引入退回弹框
import Modal from "../../../../tmpub/pub/util/modal/index";
import { sourceModel_SF } from "../../../pub/cons/constant";
import { cardOperator, showTBBMsg } from "../../../pub/utils/SFButtonUtil";
import { orgVersionView } from '../../../../tmpub/pub/util/version/index.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";
import { resetBodysRowno } from '../util/index'

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = card_from_id;
		this.moduleId = module_id;
		this.tableId = card_table_id;
		this.pageId = card_page_id;
		this.state = {

			show: false,//联查预算参数	
			sourceData: null,//联查预算参数
			accModalShow: false,//内部账户余额参数
			currentpk: null,

			showInnerAccount: false,//控制内部账户联查弹框
			showOriginal: false, //控制银行账户联查
			showOriginalData: [], //银行账户数据
			currAccid: '', //内部账户id
			outputData: '',//输出数据参数
			//附件框是否显示
			showUploader: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			displayData: '',//设置卡片页返回按钮的显隐性

			// 提交即指派 start
			//compositedata: null,
			//compositedisplay: null,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			approveBilltype: '',//审批意见单据类型
			showApprove: false,//审批意见是否显示
			approveBillId: '',//审批意见单据pk
			json: {},
			inlt: null,
			//returnnote:''//退回原因
			//退回弹框
			showReBack: false,
			showReBackinner: false
		}
		// initTemplate.call(this, props);
	}
	componentDidMount() {
		let id = this.props.getUrlParam('id');

		let { getCacheById, updateCache } = cardCache;
		/*
		* id：数据主键的值
		* dataSource: 缓存数据命名空间
		*/
		let cardData = getCacheById(id, AllocateAgreeCache);
		if (cardData) {
			this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
			this.props.cardTable.setTableData([this.tableId], cardData.body[this.tableId]);
		} else {
			this.qryData();
		}
	}

	componentWillMount() {
		// let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		// 	if (status) {
		// 		saveMultiLangRes(this.props,json);
		// 		initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
		// 		this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
		// 	} else {
		// 		//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
		// 	}
		// }
		// getMultiLang({ moduleId: lang, domainName: 'sf', callback });	

		getMultiLang({
			//模块编码
			moduleId: [module_id, funcode],
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

		window.onbeforeunload = () => {
			let status = this.props.getUrlParam('status');
			if (status != "browser" && status != "browse") {
				return loadMultiLang(this.props, '36320FAA-000009');/* 国际化处理： 当前单据未保存，您确定离开此页面？*/
			}
		}
	}

	/**
	 * 查询页面数据
	 */
	qryData = (isRefresh) => {
		//查询单据详情
		let status = this.props.getUrlParam('status');
		//是否为联查场景(用于下游单据联查情况)
		let autolink = this.props.getUrlParam('autolink');
		if (autolink && autolink == "Y") {
			autolink = true;
		} else {
			autolink = false;
		}
		let url = '';
		//现在单据已无“核准状态” 非新增时 直接查询单据
		// if (status == viewmod_agree) {
		// 	url = base_url + 'alloagreequeryagree.do';
		// } 
		if (status != 'add') {
			url = base_url + 'alloagreecardquery.do';
		}
		//let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };
		let data = {
			pks: [this.props.getUrlParam('id')],
			pageid: '36320FAA_C01',
			status: status,
		};
		let that = this;
		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res.data) {
					if (res.data.head) {
						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						that.setState({
							billID: res.data.head[this.formId].rows[0].values.pk_allocateagree_h.value,
							billNO: res.data.head[this.formId].rows[0].values.vbillno.value
						});
					}
					if (res.data.body) {
						this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						if(isRefresh){
							toast({ color: 'success', content: loadMultiLang(this.props, '36320FAA-000065') });/**国际化处理：刷新成功 */
						}
					}
					//是否为联查场景(用于下游单据联查情况) 给列表添加缓存信息
					if (autolink) {
						addCacheData(
							this.props,
							'pk_allocateagree_h',
							this.billID,
							res.data,
							this.formId,
							AllocateAgreeCache
						);
					}
					orgVersionView(this.props, card_from_id);
					this.toggleShow();
				} else {
					orgVersionView(this.props, card_from_id);
					this.props.form.EmptyAllFormValue(this.formId);
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				}
			}
		});
	}

	//切换页面状态
	toggleShow = () => {
		//发起ajax请求查询数据
		let status = this.props.getUrlParam('status');
		let flag = status === 'browse' ? false : true;
		//let viewmode=status=='browse'? 'browse':'edit';
		// this.props.initMetaByPkorg();
		this.props.cardTable.setStatus(this.tableId, status);
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		this.props.form.setFormStatus(this.formId, status);

		let editItemArr = {
			'submituser': true, 'billmaker': true, 'agreeuser': true, 'submitdate': true,
			'dbilldate': true, 'agreedate': true, 'approver': true, 'vapprovenote': true,
			'dapprovedate': 'true', 'unitbillmaker': true, 'unitapprover': true,
		};
		this.props.form.setFormItemsDisabled(card_from_id, editItemArr);
		this.props.form.setFormItemsDisabled('head', editItemArr);

		buttonVisible(this.props);

		orgVersionView(this.props, card_from_id);

		if (status == 'browse') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.billNO  //修改单据号---非必传
			});
		}
		else if (status == 'edit') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.billNO  //修改单据号---非必传
			});

		} else {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			});
		}

	};
	//删除单据
	delConfirm = () => {
		const delId = this.props.getUrlParam('id');
		ajax({
			url: '/nccloud/sf/allocation/alloagreedelete.do',
			data: {
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			},
			success: (res) => {
				if (res) {
					this.props.pushTo('/list');
					let idObj = {};
					idObj.id = delId;
					idObj.status = 3;
					this.props.cardPagination.setCardPaginationId(idObj)//暴露出最新的id值
				}
			}
		});
	};

	//保存单据
	saveBill = async (Saveflag) => {
		//过滤表格空行
		//this.props.cardTable.filterEmptyRows(this.tableId);
		let flag = this.props.form.isCheckNow(this.formId);
		let CardData;
		if (flag) {
			//重设rowno
			//resetBodysRowno(this.props);
			CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		} else {
			return;
		}
		let result = await Sign({
			isSign: true,
			isKey: true,
			data: CardData,
			isSave: true,
			encryptVOClassName: 'nccloud.web.sf.allocation.allocateagree.vo.AllocateAgreeEncryptVO4NCC'
		});
		if (result.isStop) {
			return;
		}
		let savecommitBeforePk = this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h');
		CardData = result.data;
		if (CardData && CardData.body) {
			for (let i = 0; i < CardData.body.allocateagree_b.rows.length; i++) {
				let pk_bankacc = CardData.body.allocateagree_b.rows[i].values.pk_bankacc_p.value;
				//let pk_bankacc_display = CardData.body.allocateagree_b.rows[i].values.pk_bankacc_p.display;
				//this.props.cardTable.setValByKeyAndIndex(card_table_id,i,'pk_bankacc_p',{value :pk_bankacc_display,display :pk_bankacc});
				if (pk_bankacc == null || pk_bankacc == '') {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36320FAA-000047') });
					return;
				}
				let bankname_p = CardData.body.allocateagree_b.rows[0].values.bankname_p.value;
				if (bankname_p == null || bankname_p == '') {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36320FAA-000048') });
					return;
				}
				let isagree = CardData.body.allocateagree_b.rows[0].values.isagree.value;
				if (isagree == null || isagree == '') {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36320FAA-000049') });
					return;
				}
				let agreeamount = CardData.body.allocateagree_b.rows[0].values.agreeamount.value;
				if (agreeamount == null || agreeamount == '') {
					toast({ color: 'warning', content: loadMultiLang(this.props, '36320FAA-000050') });
					return;
				}
			}
		} else {
			toast({ color: 'warning', content: loadMultiLang(this.props, '36320FAA-000008') });/* 国际化处理： CA签名返回数据格式错误*/
			return;
		}
		let status = this.props.getUrlParam('status');
		let url = '/nccloud/sf/allocation/alloagreesavecommit.do'; //新增保存
		if ((status === 'edit' || status == viewmod_agree) && Saveflag === false) {
			url = '/nccloud/sf/allocation/alloagreeupdate.do'; //修改保存
		}
		CardData = {
			...CardData,
			pageid: card_page_id
		};
		//console.log("cardData", JSON.stringify(CardData));
		ajax({
			url: url,
			data: CardData,
			// majfd 后端保存格式改变，前端相应修改  majfd
			//data: { data: JSON.stringify(CardData), pageCode: card_page_id },
			success: (res) => {
				let pk_allocateagree_h = null;
				let { updateCache } = cardCache;
				let { data } = res;
				if (res.success) {
					if (res.data) {
						if (Saveflag === true && data.returnMsg && data.returnMsg.workflow &&
							(data.returnMsg.workflow == 'approveflow' || data.returnMsg.workflow == 'workflow')) {
							if (savecommitBeforePk && savecommitBeforePk.value) {

							} else {
								if (data.billCard && data.billCard.head) {
									props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
									//addCache(data.billCard.head[card_from_id].rows[0].values.pk_delivery_h.value, data.billCard,
									//	card_from_id, dataSource, data.billCard.head[card_from_id].rows[0].values);
									// this.setState({
									// 	compositedata: data.returnMsg,
									// 	compositedisplay: true,
									// });
									// this.setState({ assignData: data, assignShow: data });
								}
							}
						} else {
							//预算提示信息
							let hasTbbMsg = showTBBMsg(res.data.head, this.formId);
							if (!hasTbbMsg) {
								toast({ color: 'success', content: loadMultiLang(this.props, '36320FAA-000035') });/* 国际化处理： 保存成功*/
							}
							/*
						* idname: 数据主键的命名
						* id：数据主键的值
						* headAreacode: 卡片表头的区域编码
						* dataSource: 缓存数据命名空间
						*/
							updateCache('pk_allocateagree_b', this.tableId, res.data, this.formId, AllocateAgreeCache);

							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_allocateagree_h = res.data.head[this.formId].rows[0].values.pk_allocateagree_h.value;
								this.setState({
									billNO: res.data.head[card_from_id].rows[0].values.vbillno.value
								});
							}
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							if (pk_allocateagree_h) {
								let idObj = {};
								idObj.id = pk_allocateagree_h;
								if (url === '/nccloud/sf/allocation/alloagreesavecommit.do') {
									idObj.status = 2;
								}
								this.props.cardPagination.setCardPaginationId(idObj)//暴露出最新的id值
							}
						}
					}
				}
				this.props.setUrlParam({
					status: 'browse',
					id: pk_allocateagree_h
				});
				this.props.button.setMainButton(['Commit'], true);
				this.props.button.setMainButton(['Agree'], false);
				orgVersionView(this.props, card_from_id);
				this.toggleShow();
			}
		});
		//}
	};

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	//获取列表肩部信息
	getTableHead = (buttons, tableId) => {
		let { createButton, createButtonApp } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: ['close', 'open', 'max'],
						// maxDestAreaId: 'finance-sf-allocationpayment-card'
					})}
				</div>
			</div>
		);
	};

	cancel() {
		this.setState({
			show: false
		})
	}
	affirm(info) {
		//console.log(info);
		this.setState({
			show: false
		})
	}
	//返回按钮事件配置
	handleClick() {
		this.props.pushTo('/list', {});
	}

	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			showApprove: false
		})
	}

	/**
	 * 返回按钮 返回到列表页面
	 */
	link2ListPage = () => {
		this.props.pushTo("/list", {
		});
	}
	refresh = () => {
		let status = this.props.getUrlParam('status');
		let pk = this.props.getUrlParam('id');
		//查询单据详情
		if (status === 'browse') {
			if (pk) {
				//审批中心对单据操作时 不会更新缓存 所以弃用缓存更新方法 统一进行查询
				let data = {
					pks: [this.props.getUrlParam('id')],
					pageid: '36320FAA_C01',
					status: status,
				};
				const that = this;
				ajax({
					url: '/nccloud/sf/allocation/alloagreecardquery.do',
					data: data,
					success: (res) => {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
								updateCache('pk_allocateagree_h', res.data.head[this.formId].rows[0].values.pk_allocateagree_h.value,
									res.data, card_from_id, AllocateAgreeCache, res.data.head[this.formId].rows[0].values);
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							this.props.pushTo("/card", {
								id: pk,
								status: 'browse',
							});
							//页签赋值
							this.setState({
								billNO: res.data.head[card_from_id].rows[0].values.vbillno.value
							});
						} else {
							this.props.form.EmptyAllFormValue(this.formId);
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
						this.toggleShow();
					}
				});
			} else {
				//页签赋值
				this.setState({
					billNO: ''
				});
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				this.toggleShow();
			}
		}
	}
	//重绘卡片页面
	repaintCardView = function (props) {
		let viewmode = 'browse';
		//设置页面组件的显示状态
		props.form.setFormStatus(card_from_id, viewmode);
		this.refresh();
	}


	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(funcode);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp } = button;
		let { createModal } = modal;
		let { showUploader, billID, billNO, assignShow, assignData } = this.state;
		let { showInnerAccount, showOriginal, showOriginalData, currAccid } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				{/* 新增div */}
				<div className="nc-bill-top-area">
					<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{
									createBillHeadInfo(
										{
											title: loadMultiLang(this.props, '36320FAA-000042'),  //标题/* 国际化处理： 下拨申请*/
											billCode: billNO,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.link2ListPage();
											}
										}
								)}
							</div>
							<div className="header-button-area">
								{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
								{createButtonApp({ area: 'card_head', buttonLimit: 20, onButtonClick: buttonClick.bind(this) })}
							</div>
							<div style={{ marginLeft: 6 }}></div>
							<div className='header-cardPagination-area' style={{ float: 'right' }}>{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: AllocateAgreeCache
							})}</div>
					</NCDiv>
					</NCAffix>
					<NCScrollElement name='forminfo'>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</NCScrollElement>
				</div>
				<div className="nc-bill-bottom-area">
					<NCScrollElement name='businfo'>
						<div className="nc-bill-table-area">
							{this.getTableHead(buttons, this.tableId)}
							{createCardTable(this.tableId, {
								adaptionHeight: true,//表格固定10行大小
								tableHead: this.getTableHead.bind(this, buttons, this.tableId),
								modelSave: () => {
									this.saveBill(false);
									this.props.cardTable.closeModel(this.tableId);
								},
								// modelSave: this.saveBill.bind(false),
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: beforeEvent.bind(this),
								showCheck: true,
								showIndex: true,
								display: 'none',
								hideAdd: true,
								hideDel: true
							})}
						</div>
					</NCScrollElement>
				</div>
				{createModal('delete', {
					title: loadMultiLang(this.props, '36320FAA-000027'),
					content: loadMultiLang(this.props, '36320FAA-000028'),
					beSureBtnClick: this.delConfirm
				})}
				{/** 附件 **/}
				<div className="nc-faith-demo-div2">
					{showUploader &&
						<NCUploader
							billId={billID}
							target={null}
							placement={'bottom'}
							billNo={billNO}
							onHide={() => {
								this.setState({ showUploader: false });
							}}
						/>
					}
				</div>
				<div>
					{
						<Inspection
							show={this.state.show}
							sourceData={this.state.sourceData}
							cancel={this.cancel.bind(this)}
							affirm={this.affirm.bind(this)}
						/>
					}
				</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/sf/allocation/alloagreeprint.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				<div>
					{/*内部账户余额 提示页面*/}
					{
						this.state.accModalShow && <InnerAccoutDialog
							id="dialog"
							showModal={this.state.accModalShow}
							accpk={this.state.currentpk}>
						</InnerAccoutDialog>
					}
				</div>
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36320FAA-000010')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, card_page_id, card_from_id, [card_table_id], 'pk_allocateagree_h', base_url + 'alloagreecommit.do', loadMultiLang(this.props, '36320FAA-000002'), AllocateAgreeCache, this.repaintCardView.bind(this, this.props), false, extParam);/* 国际化处理： 提交*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>

				<div>
					{showInnerAccount && <InnerAccoutDialog
						id="dialog"
						showModal={showInnerAccount}
						accpk={currAccid}
						closeModal={() => {
							this.setState({ showInnerAccount: false, currAccid: '' });
						}}
					/>
					}
				</div>
				{showOriginal && <div>
					<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
							////console.log(retOriginalMsg, 'retOriginalMsg')
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
				</div>}

				{/* 退回模态框 */}
				<Modal
					title={loadMultiLang(this.props, '36320FAA-000012')}/* 国际化处理： 退回原因*/
					label={loadMultiLang(this.props, '36320FAA-000012')}/* 国际化处理： 退回原因*/
					show={this.state.showReBack || this.state.showReBackinner}
					onOk={(value) => {
						//处理退回
						//if(this.state.showReBack) {
						backConfirm.call(this, this.props, value);
						//}else {
						//	backConfirmInner.call(this,this.props,this.state.record,this.state.index,value);
						//}

					}}
					onClose={() => {
						this.setState({ showReBack: false, showReBackinner: false })
					}}
				/>

				<div>
					<ApproveDetail
						show={this.state.showApprove}
						close={this.closeApprove}
						billtype={this.state.approveBilltype}
						billid={this.state.approveBillId}
					/>
				</div>

			</div>
		);
	}
}



Card = createPage({
	// initTemplate: initTemplate.bind(this),
	billinfo: {
		billtype: 'card',
		pagecode: card_page_id,
		headcode: card_from_id,
		bodycode: card_table_id
	},
	mutiLangCode: funcode
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/