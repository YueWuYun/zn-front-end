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
import { repaintView, setCardShouderBtnUseful } from '../util/index';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";
const { NCUploader, PrintOutput, ApprovalTrans, ApproveDetail, Inspection } = high;
let { NCFormControl, NCBackBtn ,NCDiv, NCAffix} = base;
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
		initTemplate.call(this, props);
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

	componentDidMount() {
		orgVersionView(this.props, card_from_id);
		this.refresh();
	}

	//页面关闭时的提示
	// componentWillMount() {
	// 	window.onbeforeunloanload = () => {
	// 		let currentBillStatus = this.props.getUrlParam('status');
	// 		if (currentBillStatus != 'browse') {
	// 			return "当前单据未保存，您确定离开此页面？"
	// 		}
	// 	}
	// }

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
			}
		}
		//修改
		if (status === 'edit') {
			//			console.log(this.state.json['36320AAA-000027']);/* 国际化处理： 页面修改启动*/
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
				pageid: card_page_id
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
					this.toggleShow();
					//解决表体 复制 时导致子表不可编辑，这里的解决思路是：子表新增一行再删除，编辑性就好用了
					this.props.cardTable.addRow(this.tableId);
					let number = this.props.cardTable.getNumberOfRows(this.tableId);
					this.props.cardTable.delRowsByIndex(this.tableId, number - 1);
				}
			});
		}
		//新增
		if (status === 'add') {
			orgVersionView(this.props, card_from_id);
			//清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.setState({
				vbillno: ''
			});
			//清空table所有数据
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			let that = this;
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
				afterEvent.call(this.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
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
		if (status == 'browse') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.vbillno //修改单据号---非必传
			});
		}
	};
	//删除单据
	delConfirm = () => {
		let { getNextId, deleteCacheById } = cardCache;
		let pkMapTs = {};
		let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_allocateapply_h').value;
		let ts = this.props.form.getFormItemsValue(card_from_id, 'ts').value;
		pkMapTs[pk] = ts;
		ajax({
			url: base_url + 'batchdelete.do',
			data: {
				pkMapTs
			},
			success: () => {
				//删除成功！
				let id = this.props.getUrlParam("id");
				//根据当前id,获取下个id
				/*
				* id：数据主键的值
				* dataSource: 缓存数据命名空间
				*/
				let nextId = getNextId(id, dataSource);
				//调用删除缓存数据方法
				/*
				* idname: 数据主键的命名
				* id：数据主键的值
				* dataSource: 缓存数据命名空间
				*/
				deleteCacheById(pk_allocateapply_h, id, dataSource);
				toast({ color: 'success', content: loadMultiLang(this.props, '36320AAA-000028') });/* 国际化处理： 删除成功*/
				this.props.pushTo('/card', {
					status: 'browse',
					id: nextId ? nextId : '',
				});
				this.refresh();
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
			let CardData = this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
			console.log(CardData, "sign before CardData");
			let result = await Sign({
				isSign: true, isKey: true, data: CardData,
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
							toast({ color: 'success', content: loadMultiLang(this.props, '36320AAA-000023') });/* 国际化处理： 保存成功*/
							if (res.data.head && res.data.head[this.formId]) {
								showTbbInfo(res.data.head);
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								crevecontid = res.data.head[this.formId].rows[0].values.pk_allocateapply_h.value;
							}
							if (res.data.body && res.data.body[this.tableId]) {
								// this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								//差异化
								this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId]);
							}
							if (crevecontid) {
								if (this.props.getUrlParam('status') === 'add') {
									//在列表点新增或在卡片上点新增按钮后，新增保存时，保存成功后，需要调用addCache方法，将数据存储到缓存中
									addCache(crevecontid, res.data, this.formId, dataSource);
								}
								if (this.props.getUrlParam('status') === 'edit') {
									//卡片修改保存时，保存成功后，需要调用updateCache方法，将数据更新到缓存中
									updateCache('pk_allocateapply_h', crevecontid, res.data, this.formId, dataSource);
								}
							}
							this.props.pushTo('/card', {
								status: 'browse',
								id: crevecontid
							});
							this.refresh();
							// addCache(crevecontid, res.data, headAreacode, dataSource);
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
			toast({ color: 'warning', content: loadMultiLang(this.props, '36320AAA-000029') })/* 国际化处理： 请录入表体数据!*/
			return false;
		}
		// form必输项校验
		let flag = this.props.form.isCheckNow(this.formId);
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

	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000053'))/* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000054'))/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
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
		const that = this;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let createNCModal = ncmodal.createModal;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{
							createBillHeadInfo(
								{
									title: loadMultiLang(this.props, '36320AAA-000030'),  //标题/* 国际化处理： 下拨申请*/
									billCode: this.state.vbillno,     //单据号
									initShowBackBtn: false
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
				<div className="nc-bill-form-area">
					{createForm(this.formId, {
						onAfterEvent: afterEvent.bind(this)
						, onBeforeEvent: beforeEvent.bind(this)
					})}
				</div>
				</div>
				{
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							adaptionHeight: true,//表格固定10行大小
							tableHead: this.getTableHead.bind(this, buttons),
							modelSave: this.saveBill,
							onBeforeEvent: beforeEvent.bind(this),
							onAfterEvent: afterEvent.bind(this),
							onSelected: setCardShouderBtnUseful.bind(this),
							onSelectedAll: setCardShouderBtnUseful.bind(this),
							showCheck: true,
							showIndex: true
						})}
					</div>
				}
				{createModal('delete', {
					title: loadMultiLang(this.props, '36320AAA-000032'),/* 国际化处理： 删除提示*/
					content: loadMultiLang(this.props, '36320AAA-000033'),/* 国际化处理： 确认要删除吗?*/
					beSureBtnClick: this.delConfirm
				})}
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
						title={loadMultiLang(this.props, '36320AAA-000034')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, card_page_id, card_from_id, [card_table_id], 'pk_allocateapply_h', base_url + 'commit.do', loadMultiLang(this.props, '36320AAA-000010'), dataSource, this.repaintCardView.bind(this, this.props), false, extParam);/* 国际化处理： 提交成功！*/
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