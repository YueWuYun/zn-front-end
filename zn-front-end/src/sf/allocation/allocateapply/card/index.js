/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick, buttonVisible, beforeEvent } from './events';
import { card_page_id, card_from_id, card_table_id, pk_allocateapply_h, base_url, dataSource, module_id, app_code } from './../cons/constant.js';
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list/index';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
// ca
import Sign from '../../../../tmpub/pub/util/ca/index.js';
//预算控制提示信息
import { showTbbInfo } from "../../../../tmpub/pub/util/tbb/index";
import { cardOperator } from "../../../pub/utils/SFButtonUtil";
import { setPropCache, saveMultiLangRes, loadMultiLang, createSimpleBillData } from "../../../../tmpub/pub/util/index";
import { repaintView, setCardShouderBtnUseful, resetBodysRowno } from '../util/index';
import { modelAddLineProcess } from './events/buttonClick';
const { NCUploader, PrintOutput, ApprovalTrans, ApproveDetail, Inspection } = high;
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCBackBtn ,NCDiv} = base;
let { addCache, getCacheById, updateCache } = cardCache;

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = 'form_allocateapply_03';
		this.searchId = 'search_allocateapply_01';
		this.moduleId = '3632';
		this.tableId = 'table_allocateapply_01';
		this.state = {
			vbillno: '',
			billId: '',//单据id
			billno: '',// 单据编号
			showUploader: false,
			target: null,
			//			show: false,//联查预算参数
			accModalShow: false,//内部账户余额参数
			currentpk: null,//内部账余额参数
			outputData: '',//输出数据参数
			showOriginal: false, // 是否展示期联查收款银行账户余额框，true:展示，false:不展示
			showOriginalData: [],// 联查联查收款银行账户余额取数据，将需要联查的数据赋值给我
			pasteflag: false,//表体中按钮的显隐性状态
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			approveBilltype: '',//审批意见单据类型
			showApprove: false,//审批意见是否显示
			approveBillId: '',//审批意见单据pk
			//卡片切换主组织的旧的组织
			oldorg: '',
			oldorgdisplay: '',
			// 取个性化中心设置的组织
			curr_pk_org: null,
			curr_orgname: null,
			curr_pk_org_v: null,
			curr_orgname_v: null,
			//联查计划预算
			showNtbDetail: false,//是否显示预算计划
			ntbdata: null,//预算计划数据
		};
		//		initTemplate.call(this, props);
	}

	componentDidMount() {
		//		orgVersionView(this.props, card_from_id);
				//设置卡片头部状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
		});
		this.refresh();
	}

	//页面关闭时的提示
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

		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return loadMultiLang(this.props, '36320AA-000074');/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		}
	}

	refresh = () => {
		let status = this.props.getUrlParam('status');
		let pk = this.props.getUrlParam('id');
		//查询单据详情
		if (status === 'browse') {
			let refreshcardData = getCacheById(pk, dataSource);
			if (pk) {
				// if (refreshcardData) {
				// 	this.props.form.setAllFormValue({ [card_from_id]: refreshcardData.head[card_from_id] });
				// 	this.props.cardTable.setTableData(card_table_id, refreshcardData.body[card_table_id]);
				// 	this.setState({
				// 		vbillno: refreshcardData.head[card_from_id].rows[0].values.vbillno.value,
				// 	});
				// 	this.toggleShow();
				// 	this.props.pushTo("/card", {
				// 		id: pk,
				// 		status: 'browse',
				// 	});
				// } else {
				//
				//审批中心对单据操作时 不会更新缓存 所以弃用缓存更新方法 统一进行查询
				let data = {
					pks: [this.props.getUrlParam('id')],
					pageid: '36320AA_C01',
					status: status,
				};
				const that = this;
				ajax({
					url: '/nccloud/sf/allocateapply/queryPageCard.do',
					data: data,
					success: (res) => {
						if (res.data) {
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								updateCache('pk_allocateapply_h', res.data.head[this.formId].rows[0].values.pk_allocateapply_h.value,
									res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
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
								vbillno: res.data.head[card_from_id].rows[0].values.vbillno.value
							});
						} else {
							this.setState({
								vbillno: ''
							});
							this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
						orgVersionView(this.props, card_from_id);
						this.toggleShow();
						this.setState({
							showNCbackBtn: true
						});
					}
				});
				//				}
			} else {
				//清空数据
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				this.toggleShow();
			}
		}
		//修改
		if (status === 'edit') {
			let data = {
				pks: [this.props.getUrlParam('id')],
				pageid: '36320AA_C01',
				status: status,
			};
			let that = this;
			ajax({
				url: '/nccloud/sf/allocateapply/queryPageCard.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//页签赋值
							let vbillno = res.data.head[this.formId].rows[0].values.vbillno;
							this.setState({
								vbillno: vbillno.value
							});
							updateCache('pk_allocateapply_h', res.data.head[this.formId].rows[0].values.pk_allocateapply_h.value,
								res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
						}

					} else {

					}
					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
					//设定操作信息中字段不可编辑 (一疑似原因为修改状态影响 现平台未修复需要手动设定)
					let editItemArr = {
						'billmaker': true,
						'approver': true,
						'submituser': true,
						'returnuser': true,
						'applydate': true,
						'dapprovedate': true,
						'submitdate': true,
						'returndate': true,
					};
					this.props.form.setFormItemsDisabled(this.formId, editItemArr);
					orgVersionView(this.props, card_from_id);
					this.toggleShow();
				}
			});
		}
		//复制
		if (status === 'copy') {
			// /清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.setState({
				vbillno: ''
			});
			let data = {
				pk: pk,
				pageid: card_page_id,
				status: 'copy',
			};
			let that = this;
			ajax({
				url: '/nccloud/sf/allocateapply/allocateapplycopy.do',
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
						}

					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					orgVersionView(this.props, card_from_id);
					//组织选中值则恢复其余字段的编辑性
					this.props.resMetaAfterPkorgEdit();
					//设置组织不可以编辑
					this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
					this.toggleShow();
					//解决表体 复制 时导致子表不可编辑，这里的解决思路是：子表新增一行再删除，编辑性就好用了
					// this.props.cardTable.addRow(this.tableId);
					// let number = this.props.cardTable.getNumberOfRows(this.tableId);
					// this.props.cardTable.delRowsByIndex(this.tableId, number - 1);
				}
			});
		}
		//新增
		if (status === 'add') {
			// orgVersionView(this.props, card_from_id);
			//清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.setState({
				vbillno: ''
			});
			//清空table所有数据
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			//单据有主组织，新增时,将其他字段设置为不可编辑.
			this.props.initMetaByPkorg();
			//把所有table中字段不可以编辑，直到选择org之后
			this.props.cardTable.setStatus(card_table_id, 'browse');
			//设置主组织可编辑（若之前进行了修改操作 会设置主组织不可编辑 这里要放开）
			let interfaceJump = this.props.getUrlParam('interfaceJump');
			if (interfaceJump === 'card') {
				//设置组织可以编辑
				this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
			}
			//如果有默认的业务单元 则
			if (this.state.curr_pk_org) {
				let pk_org = {
					value: this.state.curr_pk_org,
					display: this.state.curr_orgname
				};
				this.props.form.setFormItemsValue(card_from_id,
					{
						'pk_org': {
							value: this.state.curr_pk_org,
							display: this.state.curr_orgname
						},
						'pk_org_v': {
							value: this.state.curr_pk_org_v,
							display: this.state.curr_orgname_v
						}
					}
				);
				afterEvent.call(this, this.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
				this.props.resMetaAfterPkorgEdit();
				this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
			}
			this.toggleShow();
		}
	}

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam("status");
		let isBrowse = status === 'browse' ? 'browse' : 'edit';
		//设置页面组件的显示状态
		this.props.form.setFormStatus(card_from_id, isBrowse);
		this.props.cardTable.setStatus(card_table_id, isBrowse);
		setCardShouderBtnUseful(this.props);
		buttonVisible.call(this, this.props);
		orgVersionView(this.props, card_from_id);
		
		if (status == 'browse') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.vbillno  //修改单据号---非必传
			});
		}
		else if (status == 'edit') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.vbillno  //修改单据号---非必传
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
		let { getNextId, deleteCacheById } = cardCache;
		let pkMapTs = {};
		let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_allocateapply_h').value;
		let ts = this.props.form.getFormItemsValue(card_from_id, 'ts').value;
		let backid = this.props.getUrlParam("id");
		pkMapTs[pk] = ts;
		ajax({
			url: base_url + 'batchdelete.do',
			data: {
				pkMapTs
			},
			success: () => {
				//删除成功
				let backnextId = getNextId(backid, dataSource);
				deleteCacheById('pk_allocateapply_h', backid, dataSource);
				if (backnextId) {
					this.props.setUrlParam({
						status: 'browse',
						id: backnextId
					});
					this.refresh();
				} else {
					this.props.pushTo("/card", {
						id: '',
						status: 'browse',
					});
					this.setState({ showNCbackBtn: true ,vbillno: null});
					this.toggleShow();
					this.refresh();
				}
				toast({ color: 'success', content: loadMultiLang(this.props, '36320AA-000028') });/* 国际化处理： 删除成功*/
			}
		});
	};

	//保存单据
	saveBill = async () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		//过滤表格空行
		this.props.cardTable.filterEmptyRows(this.tableId);
		let saveflag = this.saveBillBeforeCheck();
		if (saveflag) {
			let url = '/nccloud/sf/allocateapply/save.do'; //新增保存
			if (this.props.getUrlParam('status') === 'edit') {
				url = '/nccloud/sf/allocateapply/update.do'; //修改保存
			}
			//let CardData = this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
			let CardData = createSimpleBillData(this.props, card_page_id, card_from_id, card_table_id);
			console.log(CardData, "sign before CardData");
			let result = await Sign({
				isSign: true, isKey: true, data: CardData, isSave: true,
				encryptVOClassName: 'nccloud.web.sf.allocate.allocateapply.vo.AllocateApplyEncryptVO4NCC'
			});
			if (result.isStop) {
				return;
			}
			CardData = result.data;
			console.log(CardData, "sign after CardData");
			ajax({
				url: url,
				data: CardData,
				success: (res) => {
					let crevecontid = null;
					if (res.success) {
						if (res.data) {
							if (res.data.head && res.data.head[this.formId]) {
								//showTbbInfo(res.data.head);
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								crevecontid = res.data.head[this.formId].rows[0].values.pk_allocateapply_h.value;
							}
							this.props.beforeUpdatePage();
							if (res.data.body && res.data.body[this.tableId]) {
								// this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								//差异化
								this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId]);
							}
							if (crevecontid) {
								if (url == '/nccloud/sf/allocateapply/save.do') {
									//在列表点新增或在卡片上点新增按钮后，新增保存时，保存成功后，需要调用addCache方法，将数据存储到缓存中
									addCache(crevecontid, res.data, this.formId, dataSource);
								}
								if (this.props.getUrlParam('status') === 'edit') {
									//卡片修改保存时，保存成功后，需要调用updateCache方法，将数据更新到缓存中
									updateCache('pk_allocateapply_h', crevecontid, res.data, this.formId, dataSource);
								}
							}
							this.props.setUrlParam({
								status: 'browse',
								id: crevecontid,
								// vbillno: vbillno && vbillno.value,
							})
							//页签赋值
							this.setState({
								vbillno: res.data.head[this.formId].rows[0].values.vbillno.value
							});
							// this.props.pushTo('/card', {
							// 	status: 'browse',
							// 	id: crevecontid
							// });

							//预算提示信息
							let row = res.data.head[this.formId].rows[0];
							let ntbinfo = (row && row.values && row.values['ntbinfo'] || {}).value;
							if (ntbinfo) {
								toast({ color: 'warning', content: ntbinfo });
								//清空预算提示字段
								row.values['ntbinfo'] = { value: null, display: null };
							} else {
								toast({ color: 'success', content: loadMultiLang(this.props, '36320AA-000023') });/* 国际化处理： 保存成功*/
							}
							this.toggleShow();
							this.props.updatePage(null, this.tableId, null);
							this.setState({
								showNCbackBtn: true
							});
						}
					}
				}
			});
		}
	};

	// 保存前校验
	saveBillBeforeCheck = () => {
		let rowCount = this.props.cardTable.getNumberOfRows(card_table_id);
		if (rowCount <= 0) {
			toast({ color: 'warning', content: loadMultiLang(this.props, '36320AA-000029') })/* 国际化处理： 请录入表体数据!*/
			return false;
		}
		// form必输项校验
		let flag = this.props.form.isCheckNow(this.formId);
		if (!flag) {
			return flag;
		}
		//table必输项校验
		let tableflag = this.props.cardTable.checkTableRequired(this.tableId);
		return flag && tableflag;
	};

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
					{createButtonApp({
						area: 'table_head',
						onButtonClick: (props, key) => buttonClick.call(this, props, key, 'table_allocateapply_01')
					})}
				</div>
			</div>
		);
	};

	/**
	 * 返回按钮 返回到列表页面
	 */
	link2ListPage = () => {
		// this.props.pushTo("/list", {
		// 	status: 'browse'
		// 	,pagecode: card_page_id
		// });
		this.props.pushTo("/list", {
		});
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
			showApprove: false
		})
	}

	//组织取消和关闭
	// cancelBtnClick = () => {
	// 	let oldvalue = this.state.oldorg;
	// 	let olddisplay = this.state.oldorgdisplay;
	// 	this.props.form.setFormItemsValue(card_from_id, { 'pk_org': { 'value': oldvalue, 'display': olddisplay } });
	// }
	// closeModalEve = () => {
	// 	let oldvalue = this.state.oldorg;
	// 	let olddisplay = this.state.oldorgdisplay;
	// 	this.props.form.setFormItemsValue(card_from_id, { 'pk_org': { 'value': oldvalue, 'display': olddisplay } });
	// }
	//组织切换事件
	// changeOrgConfirm = (data) => {
	// 	//组织
	// 	if (this.props.form.getFormItemsValue(card_from_id, 'pk_org').value != undefined) {
	// 		let eventData = this.props.createHeadAfterEventData('36320AA_C01', card_from_id, [card_table_id], card_from_id, 'pk_org', null);
	// 		let oldvalue = eventData.oldvalue.value;
	// 		let olddisplay = eventData.oldvalue.display;
	// 		let extParam = { 'uiState': status };
	// 		ajax({
	// 			url: '/nccloud/sf/allocateapply/headafterevent.do',
	// 			data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
	// 			success: (res) => {
	// 				if (res.success) {
	// 					let { success, data } = res;
	// 					let { card, retExtParam, headProp, bodyProps } = data;
	// 					let { head, bodys } = card;
	// 					//props.form.setAllFormValue(head);
	// 					this.props.form.setAllFormValue({ [this.formId]: head[this.formId] });
	// 					this.props.cardTable.setTableData('table_allocateapply_01', bodys.table_allocateapply_01);
	// 				}
	// 			}
	// 		});
	// 	} else {
	// 		this.props.form.EmptyAllFormValue(this.formId)
	// 		this.props.cardTable.setTableData(this.tableId, { rows: [] });
	// 	}
	// 	//主组织处理
	// 	this.props.resMetaAfterPkorgEdit();

	// }
	//重绘卡片页面
	repaintCardView = function (props) {
		let viewmode = 'browse';
		//设置页面组件的显示状态
		props.form.setFormStatus(card_from_id, viewmode);
		this.refresh();
	}

	render() {
		let { cardTable, form, button, modal, cardPagination, ncmodal } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		const { createCardPagination } = cardPagination;
		let { createButton } = button;
		let { createModal } = modal;
		let { showUploader, target, billno, billId, accModalShow, currentpk, assignShow, assignData, showNtbDetail, ntbdata } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const that = this;
		let createNCModal = ncmodal.createModal;
		let fromPK = "";
		//新增、复制时 不显示单据号
		if (this.props.getUrlParam('status') == 'add' || this.props.getUrlParam('status') == 'copy') {
			fromPK = "";
		} else
			fromPK = this.props.getUrlParam('id');
		return (
			<div className="nc-bill-card">
				{/* 新增div */}
				<div className="nc-bill-top-area">
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{/* {this.props.getUrlParam('status') == 'browse' && <NCBackBtn onClick={that.link2ListPage.bind(that)} />} */}
							<div className="header-title-search-area">
									{
									createBillHeadInfo(
										{
											title: loadMultiLang(this.props, '36320AA-000031'),  //标题/* 国际化处理： 下拨申请*/
											billCode: this.state.vbillno,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.link2ListPage();
											}
										}
									)}
							</div>
							<div className="header-button-area">
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
								})}</div>
					</NCDiv>
					</NCAffix>
					<NCScrollElement name='forminfo'>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								onAfterEvent: afterEvent.bind(this)
								, onBeforeEvent: beforeEvent.bind(this)
							})}
						</div>
					</NCScrollElement>
				</div>
				{/* 新增div */}
				<div className="nc-bill-bottom-area">
					<NCScrollElement name='businfo'>
						<div className="nc-bill-table-area">
							{createCardTable(this.tableId, {
								adaptionHeight: true,//表格固定10行大小
								tableHead: this.getTableHead.bind(this, buttons),
								//							modelSave: this.saveBill,
								modelSave: () => {
									this.saveBill();
									//侧拉整单保存时 自动收起侧拉
									this.props.cardTable.closeModel(card_table_id);
								},
								onBeforeEvent: beforeEvent.bind(this),
								onAfterEvent: afterEvent.bind(this),
								onSelected: setCardShouderBtnUseful.bind(this),
								onSelectedAll: setCardShouderBtnUseful.bind(this),
								modelAddRow: modelAddLineProcess.bind(this),//处理侧拉新增的编辑事件
								showCheck: true,
								showIndex: true
							})}
						</div>
					</NCScrollElement>
				</div>
				{/* {createModal('delete', {
					title: loadMultiLang(this.props, '36320AA-000032'),//* 国际化处理： 删除
					content: loadMultiLang(this.props, '36320AA-000033'),//* 国际化处理： 确定要删除吗？
					beSureBtnClick: this.delConfirm,
					//  模态框大小 sm/lg/xlg,
					size: 'sm',
					className: 'junior'
				})} */}
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
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/sf/allocateapply/allocateapplyprint.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				{/*联查收款银行账户余额*/}
				<div>
					<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData={this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
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
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36320AA-000034')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, card_page_id, card_from_id, [card_table_id], 'pk_allocateapply_h', base_url + 'commit.do', loadMultiLang(this.props, '36320AA-000010'), dataSource, this.repaintCardView.bind(this, this.props), false, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.showApprove}
						close={this.closeApprove}
						billtype={this.state.approveBilltype}
						billid={this.state.approveBillId}
					/>
				</div>
				{/*修改主组织时 提示窗口*/}
				{createNCModal('changeOrg', {
					//size: 'lg',//模态框的大小
					content: ''
				})}
			</div>
		);
	}
}

Card = createPage({
	// initTemplate: initTemplate,
	billinfo: {
		billtype: 'card',
		pagecode: card_page_id,
		headcode: card_from_id,
		bodycode: card_table_id
	},
	mutiLangCode: module_id
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/