/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cardCache, high, getMultiLang } from 'nc-lightapp-front';
let { NCFormControl, NCBackBtn, NCDiv, NCAffix } = base;
import { buttonClick, initTemplate, afterEvent, pageInfoClick, beforeEvent } from './events';
import { jsoncode, requesturl } from '../util/const.js';
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index.js';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../pub/cons/constant.js';
import { buttonVisible } from './events/buttonVisible';
import { orgVersionView } from "../../../../tmpub/pub/util/version/index.js";
import { bodyButtonClick } from './events/bodyButtonClick';
let { addCache, getCurrentLastId, getNextId, deleteCacheById, getCacheById, updateCache } = cardCache;
let { ApprovalTrans } = high;
import { setCardShouderBtnUseful } from "../util/index";
import { cardOperator } from '../../../pub/utils/SFButtonUtil';
// ca
import Sign from '../../../../tmpub/pub/util/ca/index.js';
import { module_id, module_name } from "../../../pub/cons/constant";
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = 'form_deliveryrule_01';
		this.searchId = 'search_deliveryrule_01';
		this.moduleId = '20521030';
		this.tableId = 'table_deliveryrule_C01';
		this.isCa = {};
		this.state = {
			copyflag: false,
			status: 'add',
			showBuLu: false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			//列表页面表体行号
			index: null,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			billno: '',// 单据编号
			// 取个性化中心设置的组织
			curr_pk_org: null,
			curr_orgname: null,
			curr_pk_org_v: null,
			curr_orgname_v: null,
			addAndSave: false,
			billId: '',
		}
		//initTemplate.call(this, props);
	}
	componentWillMount() {
		getMultiLang({
			//模块编码
			moduleId: [module_id, '36320ACC'],
			//领域编码
			domainName: module_name,
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
				return loadMultiLang(this.props, '36320ACC-000016');/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		}
	}
	componentDidMount() {
		debugger
		//设置卡片头部状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
		});
		//查询单据详情
		if (this.props.getUrlParam('status') != 'add' && this.props.getUrlParam('status') != 'copy') {
			this.getCardData();
		}
		//复制
		if (this.props.getUrlParam('status') === 'copy') {
			// /清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.setState({
				vbillno: ''
			});
			let data = {
				pk: this.props.getUrlParam('id'),
				pageid: jsoncode.cpageid
			};
			let that = this;
			ajax({
				url: requesturl.copy,
				data: data,
				success: (res) => {
					debugger
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//解决新增--取消--复制，编辑性错乱，这里统一再赋编辑性一下
							this.props.form.setFormItemsDisabled(this.formId, { 'rulecode': false, 'rulename': false, 'busitype': false, 'pk_bankacc_r': false, 'pk_currtype': false, 'memo': false });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
							//解决新增--取消--复制，编辑性错乱，这里统一再赋编辑性一下
							this.props.cardTable.setColEditableByKey(jsoncode.ctablecode, ['pk_financeorg', 'pk_bankacc_p', 'ruletype', 'paytype', 'issamebank', 'issamecity', 'pk_accid', 'balance', 'ration', 'deliveryrate', 'leastamount', 'pk_planitem_r', 'pk_planitem_p', 'isacceptinteger', 'acceptbase', 'isnetbankfull'], false);
						}
						//buttonVisible(this.props);
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
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
		this.toggleShow();
	}
	//卡片信息查询
	getCardData = () => {
		//let data = { pk: !this.props.getUrlParam('id') ? this.props.form.getFormItemsValue(this.formId, 'pk_deliveryrule_h').value : this.props.getUrlParam('id'), pageid: jsoncode.cpageid };
		let data = { pk: !this.props.getUrlParam('id') ? this.state.billId : this.props.getUrlParam('id'), pageid: jsoncode.cpageid };
		if (data.pk) {
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						debugger
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							//修改时保证子表字段编辑性正常

						}
						let billnoNo = res.data.head[this.formId].rows[0].values.vbillno && res.data.head[this.formId].rows[0].values.vbillno.value;
						let billIdByRes = res.data.head[this.formId].rows[0].values.pk_deliveryrule_h && res.data.head[this.formId].rows[0].values.pk_deliveryrule_h.value;

						this.setState({
							billno: billnoNo,
							billId: billIdByRes,
						});
					} else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					//组织多版本
					orgVersionView(this.props, jsoncode.formcode);
					this.toggleShow();


				}
			});
		}
		this.toggleShow();
	}

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		buttonVisible.call(this, this.props);
		//设置表体按钮：1.不选组织时，都不可用；2.选择组织，只有增行可用；3.选中行，按钮才均可用
		//		setCardShouderBtnUseful(this.props);
		if (status == 'browse') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.billno  //修改单据号---非必传
			});
		}
		else if (status == 'edit') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.state.billno  //修改单据号---非必传
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
		let pk = this.props.getUrlParam('id');
		ajax({
			url: requesturl.delete,
			data: {
				pk: pk,
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({ color: 'success', content: loadMultiLang(this.props, '36320ACC-000017') });/* 国际化处理： 删除成功*/
					//缓存相关逻辑  20180813 begin
					//1.调用删除缓存数据方法
					deleteCacheById('pk_deliveryrule_h', pk, jsoncode.dataSource);
					//2.根据当前id,获取下个id,并设置到地址栏上
					let nextId = getNextId(pk, jsoncode.dataSource);
					this.props.setUrlParam(nextId);
					//是否还有下一条，没有下一条就直接清空页面，只有新增按钮
					if (nextId) {
						//3.查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求
						let cacheData = getCacheById(nextId, jsoncode.dataSource);
						if (cacheData) {
							this.props.form.setAllFormValue({ [jsoncode.formcode]: cacheData.head[jsoncode.formcode] });
							this.props.cardTable.setTableData(this.tableId, cacheData.body[this.tableId]);
						} else {
							this.getCardData();
						}
						//缓存相关逻辑  20180809 end
					} else {
						// 清空表单form所有数据
						this.props.form.EmptyAllFormValue(this.formId);
						//清空table所有数据
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						//新增的时候将单据号制空
						this.setState({
							billno: '',
							billId: ''
						});
						this.props.pushTo("/card", {
							id: '',
							status: 'browse',
						});
						this.toggleShow();

					}
				}
			}
		});
	};

	getIsca = () => {
		return new Promise(resolve => ajax({
			type: 'post',
			url: '/nccloud/tmpub/pub/iscauser.do',
			loading: false,
			async: false,
			success: res => {
				if (res.success) {
					this.isCa = {
						signal: true,
						isCaUser: res.data
					};
					resolve(res.data);
				}
			},
			error: res => {
				this.isCa = {
					signal: true,
					isCaUser: false
				};
				resolve(false);
				toast({ color: 'warning', content: loadMultiLang(this.props, '36320ACC-000018') });/* 国际化处理： 获取CA用户出错*/
			},
		}));
	}
	//保存单据
	saveBill = async () => {
		let { signal, isCaUser } = this.isCa;
		if (!signal) {
			let isContinue = await this.getIsca();
			//第一次点保存的时候会走这
			if (!isContinue) {
				toast({ color: 'warning', content: loadMultiLang(this.props, '36320ACC-000019') });/* 国际化处理： 此次进行的操作，要求使用CA签名，请配置第三方认证的签名方式*/
				return;
			}
		} else if (signal && !isCaUser) {//再次点保存的时候会走这，优化性能
			toast({ color: 'warning', content: loadMultiLang(this.props, '36320ACC-000019') });/* 国际化处理： 此次进行的操作，要求使用CA签名，请配置第三方认证的签名方式*/
			return;
		}
		//保存时，将单据号、返回按钮设置为可见
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,
			showBillCode: true
		});
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
			this.props.form.setFormItemsValue(this.formId, { ts: null });
		}
		//过滤表格空行
		this.props.cardTable.filterEmptyRows(this.tableId);
		let flag = this.props.form.isCheckNow(this.formId)
		if (flag) {
			let cardData = this.props.createMasterChildData('36320ACC_C01', this.formId, this.tableId);
			let url = '/nccloud/sf/deliveryrule/deliveryruleinsert.do'; //新增保存
			if (this.props.getUrlParam('status') === 'edit') {
				url = '/nccloud/sf/deliveryrule/deliveryruleupdate.do'; //修改保存
			}
			//console.log(cardData, 'sign before cardData');
			let result = await Sign({
				isSign: true,
				isKey: true,
				data: cardData,
				isSave: false,
				encryptVOClassName: 'nccloud.web.sf.delivery.deliveryrule.vo.DeliveryRuleEncryptVO4NCC'
			});
			if (result.isStop) {
				return;
			}
			cardData = result.data;
			//console.log(cardData, 'sign after cardData');
			debugger
			//若是新增保存
			if (this.state.addAndSave) {
				ajax({
					url: url,
					data: cardData,
					success: (res) => {
						let pk_deliveryrule_h = null;
						if (res.success) {
							if (res.data) {
								toast({ color: 'success', content: loadMultiLang(this.props, '36320ACC-000020') });/* 国际化处理： 保存新增成功*/
								pk_deliveryrule_h = res.data.head[this.formId].rows[0].values.pk_deliveryrule_h.value;
								this.setState({
									billId: pk_deliveryrule_h
								});
							}
						}
						// 清空表单form所有数据
						this.props.form.EmptyAllFormValue(this.formId);
						//清空table所有数据
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						this.props.pushTo("/card", {
							pagecode: jsoncode.cpageid,
							status: 'add'
						})
						debugger
						//增加除pk_org 设置所有字段都不可编辑相关逻辑
						this.props.initMetaByPkorg();
						this.toggleShow();
					}
				});
			} else {//新增或者修改
				ajax({
					url: url,
					data: cardData,
					success: (res) => {
						let pk_deliveryrule_h = null;
						if (res.success) {
							if (res.data) {
								toast({ color: 'success', content: loadMultiLang(this.props, '36320ACC-000021') });/* 国际化处理： 保存成功*/
								if (res.data.head && res.data.head[this.formId]) {
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									pk_deliveryrule_h = res.data.head[this.formId].rows[0].values.pk_deliveryrule_h.value;
								}
								if (res.data.body && res.data.body[this.tableId]) {
									this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								}
								let billnoNo = res.data.head[this.formId].rows[0].values.vbillno && res.data.head[this.formId].rows[0].values.vbillno.value;
								this.setState({
									billId: pk_deliveryrule_h,
									billno: billnoNo
								});
							}
						}
						this.props.pushTo("/card", {
							pagecode: jsoncode.cpageid,
							status: 'browse',
							id: pk_deliveryrule_h
						});
						this.toggleShow();
					}
				});
			}

		}
	};

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		debugger
		let pkMapTs = {};
		pkMapTs[this.props.form.getFormItemsValue(this.formId, 'pk_deliveryrule_h').value] = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		let data = {
			pkMapTs,
			results: retMsg,
			isRet: true,
			pageCode: jsoncode.cpageid
		}
		ajax({
			url: '/nccloud/sf/deliveryrule/deliveryruleprocessretmsg.do',
			data: data,
			success: (res) => {
				if (res.success) {
					if (res && res.data) {
						//刷新当前单据
						if (res.data.head && res.data.head[this.formId]) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body && res.data.body[this.tableId]) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
					}
				}
			}
		});
		this.toggleShow();
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	getTableHeadButton = (buttons) => {
		let { createButton, createButtonApp } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{/* 应用注册按钮 */}
					{this.props.button.createButtonApp({
						area: 'card_body',
						buttonLimit: 7,
						onButtonClick: bodyButtonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}
				</div>
			</div>
		);
	};
	//卡片返回按钮
	handleClick = () => {
		//先跳转列表
		this.props.pushTo('/list');
	}
	render() {
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { cardTable, form, button, modal, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButton } = button;
		let { createModal } = modal;
		let { createCardPagination } = cardPagination;
		let status = this.props.getUrlParam('status');
		//提交即指派
		let { assignData, assignShow } = this.state;
		const that = this;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{
									createBillHeadInfo(
										{
											title: loadMultiLang(this.props, '36320ACC-000022'),  //标题/* 国际化处理： 标题*//* 国际化处理： 上收规则设置*/
											//title: '上收规则设置',
											billCode: this.state.billno,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.handleClick();
											}
										}
									)}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: 'card_head',
									buttonLimit: 7,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							<div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: jsoncode.dataSource
								})}</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHeadButton.bind(this, buttons),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this),
							showCheck: true,
							showIndex: true,
							pkname: 'pk_deliveryrule_h',
							dataSource: jsoncode.dataSource,
							onSelected: setCardShouderBtnUseful.bind(this),
							onSelectedAll: setCardShouderBtnUseful.bind(this)
						})}
					</div>
				</div>
				{createModal('delmodal', {
					title: loadMultiLang(this.props, '36320ACC-000023'), // 弹框表头信息/* 国际化处理： 弹框表头信息*//* 国际化处理： 删除*/
					content: loadMultiLang(this.props, '36320ACC-000024'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 弹框内容,可以是字符串或*//* 国际化处理： 确认要删除吗?*/
					beSureBtnClick: this.delConfirm.bind(this), //点击确定按钮事件
					//cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: loadMultiLang(this.props, '36320ACC-000008'), //左侧按钮名称,默认关闭/* 国际化处理： 左侧按钮名称,默认关闭*//* 国际化处理： 取消*/
					leftBtnName: loadMultiLang(this.props, '36320ACC-000025') //右侧按钮名称， 默认确认/* 国际化处理： 右侧按钮名称,默认确认*//* 国际化处理： 确认*/
				})}
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36320ACC-000026')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryrule_h', requesturl.batchcommit, loadMultiLang(this.props, '36320ACC-000027'), jsoncode.dataSource, this.toggleShow.bind(this), false, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/** 网银补录组件 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}  //补录框显示
					modal={modal}
					onLineData={this.state.onLineData}  //补录数据
					moduleType={sourceModel_SF}  //模块编码
					modelType={this.state.modelType} //补录框类型
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
				{/** 改变资金组织 **/}
				{createModal('changeOrg', {
					size: 'lg',//模态框的大小
					content: ''
				})}
			</div>
		);
	}
}

Card = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: '2052'
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/