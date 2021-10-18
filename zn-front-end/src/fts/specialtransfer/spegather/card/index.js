/*cI4u54VYZVPxnvGrX5EL6DhQLKLvsjv+xJQO0cjqQUunJngTbJoVbN8iY5o8EoG5*/
/**
 * 特转收款单卡片页面
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import { Radio } from 'tinper-bee';
import { buttonClick, initTemplate, afterEvent, pageInfoClick, buttonVisible, beforeEvent } from './events';
import axios from 'axios';
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
import ReasonModal from '../../../pub/utils/modalContentConfig.js';
import { versionControl, setCardShouderBtnUseful, getNewRow } from "../util/spegatherUtil";
import { cardOperator } from '../../../pub/utils/FTSButtonUtil';
import { cardReBack, modelDelLineProcess } from "../card/events/buttonClick";
//预算信息提示工具
import { showTbbInfo } from "../../../../tmpub/pub/util/tbb/index";
//退回框
import Modal from "../../../../tmpub/pub/util/modal/index";
import { SCENE } from "../../../../tmpub/pub/cons/constant";
//引入常量定义
import { module_name, module_tmpub_id, module_tmpub_name, funcode, list_page_id, module_id, base_url, 
	button_limit, card_page_id, card_from_id, card_table_id, viewmod_deal, billtype, card_page_url, 
	list_page_url, dataSource, pkName, linklist_page_id, islink, linkdata ,islinkone,saga_gtxid,cache} from '../cons/constant.js';
//引入附件组件
const { NCUploader, ApproveDetail, ApprovalTrans, Inspection } = high;
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCBackBtn ,NCDiv} = base;
import { setPropCache, saveMultiLangRes, loadMultiLang,showErrBtn } from "../../../../tmpub/pub/util/index";
let { addCache } = cardCache;
class Card extends Component {
	constructor(props) {
		super(props);
		this.refreshflag=false;
		this.state = {
			//附件框是否显示
			showUploader: false,
			//是否显示审批意见
			approveshow: false,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//是否行复制模式
			isRowCopy: false,
			//内部账户余额是否显示
			showAccModal: false,
			//内部账户pk
			pkInnAccount: '',
			//联查预算参数
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,
			//退回意见框
			showBackModal: false,
			//退回意见
			backReason: '',
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//展开收起
			isOpen: true,

			// 取个性化中心设置的组织
			curr_pk_org: null,
			curr_orgname: null,
			curr_pk_org_v: null,
			curr_orgname_v: null,
			json: {},
			inlt: null
		}
		// initTemplate.call(this, props);
	};

	componentDidMount() {
		//新增时不需要查询（复制是特殊的新增，需要查后台）
		if (this.props.getUrlParam('isCopy') || this.props.getUrlParam('status') != 'add') {
			this.qryData();
		}else
			//新增时 需要初始化正确的页面按钮
			this.toggleShow();
	}

	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				saveMultiLangRes(this.props, json);
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
			} else {
				//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}

		}
		getMultiLang({
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]: [module_tmpub_id],
				//sf模块多语资源
				[module_name]: [module_id, funcode]

			}, domainName: 'fts', callback
		});
		window.onbeforeunload = () => {
			let currentBillStatus = this.props.getUrlParam('status');
			if (currentBillStatus != 'browse') {
				return this.state.json['36300STG-000022']/* 国际化处理： 当前单据未保存，您确定离开此页面？*/
			}
		}
	}

	/**
	 * 查询页面数据
	 */
	qryData = () => {
		//页面状态
		let status = this.props.getUrlParam('status');
		//是否复制操作
		let isCopy = this.props.getUrlParam('isCopy');
		//单据pk
		let pk = this.props.getUrlParam('id');
		let ts=this.props.getUrlParam('ts');
		if(!ts) {
			ts=this.props.form.getFormItemsValue(card_from_id,'ts')&&this.props.form.getFormItemsValue(card_from_id,'ts').value;
		}
		let url = base_url;
		let data = null;
		const that = this;
		//复制
		if (isCopy) {
			url = url + 'spegathercopy.do';
			data = { pk: that.props.getUrlParam('id'), pageCode: card_page_id };
		}
		//经办
		else if (status == viewmod_deal) {
			url = url + 'spegatherdecide.do';
			let ts = that.props.getUrlParam('ts');
			let pkMapTs = {};
			pkMapTs[pk] = ts;
			data = { pkMapTs, pageCode: card_page_id, isRet: true ,ts};
		}
		else if (status == 'edit') {
			this.editData();
			return
		}


		else {
			if(!this.refreshflag) {
				//异常交互
			    cardCache.setDefData(cache.iserrtoast, dataSource, true);
			}
			url = url + 'spegathercardquery.do';
			data = { pk: that.props.getUrlParam('id'), pageCode: card_page_id };
		}
		//从列表新增然后取消时不必查询
		if (this.props.getUrlParam('isCancel') == 'cancel') {
			//页面有数据时清除表头的数据
			that.props.form.EmptyAllFormValue(card_from_id);
			//页面有数据取消时删除表体行
			that.props.cardTable.setTableData(card_table_id, { rows: [] });
			that.setState({
				billID: '',
				billNO: ''
			});
		} else {
			ajax({
				url,
				data,
				success: (res) => {
					if (res.data) {
						if (res.data.head[card_from_id]) {
							that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
						}
						if (res.data.body) {
							that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
						}
						let billID = res.data.head[card_from_id].rows[0].values.pk_spegather_h.value;
						let billNO = res.data.head[card_from_id].rows[0].values.vbillno.value;
						that.setState({
							billID,
							billNO
						});
						//预算联查单据单条的数据增加缓存
						let isNeedAddCache = this.props.getUrlParam('isNeedAddCache');

						if (isNeedAddCache) {
							addCache(billID, res.data, card_from_id, dataSource);
						}
						//更新缓存
						cardCache.updateCache(pkName, billID, res.data, card_from_id, dataSource);
						versionControl(that.props);
						that.toggleShow();
						//经办时设置字段的可编辑性
						if (status == viewmod_deal) {
							let editItemArr = {
								'pk_org': true,
								'pk_currtype': true,
								'isreversebustype': true,
							};
							that.props.form.setFormItemsDisabled(card_from_id, editItemArr);
							//经过确认 只有付款结算推过来的单子才有经办选项 经办时需要设定表体某些字段不可编辑 原来代码有此逻辑但不知为何注释掉了 现在放开 yangjn 2018/11/12 17:14
							//设置表体中某些列不可编辑,true为不可编辑，默认true
							that.props.cardTable.setColEditableByKey(card_table_id, ['pk_payfinanceorg', 'pk_accid', 'amount', 'olcrate']);
						}
						//复制时资金组织不可编辑，其余字段可编辑
						if (status == 'add' && isCopy) {
							that.props.resMetaAfterPkorgEdit();
							that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true ,'pk_currtype':false});
						}
					} else {
						this.props.form.EmptyAllFormValue(card_from_id);
						this.props.cardTable.setTableData(card_table_id, { rows: [] });
						this.setState({
							billID: '',
							billNO: ''
						});
						this.props.setUrlParam({
							status: 'browse',
							isCancel: 'cancel'
						});
						this.toggleShow();
					}
				},
				error: (res) => {
					this.props.form.EmptyAllFormValue(card_from_id);
					this.props.cardTable.setTableData(card_table_id, { rows: [] });
					this.setState({
						billID: '',
						billNO: ''
					});
					this.props.setUrlParam({
						status: 'browse',
						isCancel: 'cancel'
					});
					this.toggleShow();
				}
			});
		}
	}

	//打开审批意见弹框
	openApprove = () => {
		this.setState({
			approveshow: true
		})
	}

	//关闭审批意见弹框
	closeApprove = () => {
		this.setState({
			approveshow: false
		})
	}

	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam("status");
		let isBrowse = status === 'browse' ? 'browse' : 'edit';
		//设置页面组件的显示状态
		this.props.form.setFormStatus(card_from_id, isBrowse);
		this.props.cardTable.setStatus(card_table_id, isBrowse);
		setCardShouderBtnUseful(this.props);
		buttonVisible(this);
		let from = this.props.getUrlParam("from");
		if (status === 'browse') {
			if(from=='linkListOne'){
				//当为联查场景时 若被联查到单条数据 则不显示返回按钮
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					//控制显示返回按钮: true为显示,false为隐藏
					showBackBtn: false,
					//控制显示单据号：true为显示,false为隐藏
					showBillCode: true,
					billCode: this.state.billNO,
				});
			}else{
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					//控制显示返回按钮: true为显示,false为隐藏
					showBackBtn:  true,
					//控制显示单据号：true为显示,false为隐藏
					showBillCode: true,
					billCode: this.state.billNO,
				});
			}
		}
		else if (status === 'edit' || status === 'decide') {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				//控制显示返回按钮: true为显示,false为隐藏
				showBackBtn: false,
				//控制显示单据号：true为显示,false为隐藏
				showBillCode: true,
				billCode: this.state.billNO,
			});
		}
		else if (status === 'add' || status === 'copy') {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				//控制显示返回按钮: true为显示,false为隐藏
				showBackBtn: false,
				//控制显示单据号：true为显示,false为隐藏
				showBillCode: false,
			});
		}
		//异常交互
		//控制重试按钮显示情况
		showErrBtn(this.props, {
	        headBtnCode: 'card_head',
	        headAreaCode:card_from_id,
	        fieldPK:pkName,
	        datasource:dataSource
	    });
		//异常交互
		// if(this.props.form.getFormItemsValue(card_from_id,saga_gtxid)) {
		// 	this.props.socket.showToast({
		// 		gtxid:this.props.form.getFormItemsValue(card_from_id,saga_gtxid).value,
		// 		billpk:this.props.form.getFormItemsValue(card_from_id,pkName).value
		// 	});
		// }

	};

	//修改单据
	editData = (ts) => {
		let from = this.props.getUrlParam('from');
		let pk = '';
		if (from == 'list') {
			pk = this.props.getUrlParam('id');
			if(!ts) {
				ts = this.props.getUrlParam('ts');
			}
		} else {
			pk = this.props.form.getFormItemsValue(card_from_id, 'pk_spegather_h') && this.props.form.getFormItemsValue(card_from_id, 'pk_spegather_h').value;
			ts = this.props.form.getFormItemsValue(card_from_id, 'ts') && this.props.form.getFormItemsValue(card_from_id, 'ts').value;
		}
		let data = { pk: pk, pageCode: card_page_id ,ts:ts};
		ajax({
			url: base_url + 'spegatheredit.do',
			data: data,
			success: (res) => {
				let { billCard, isOrgCurrency } = res.data
				let { head, body } = billCard
				if (head) {
					this.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
					// let currentDate = new Date();
					// let dateValue = currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()+" "+currentDate.getHours()+":"+currentDate.getMinutes()+":"+currentDate.getSeconds();
					// this.props.form.setFormItemsValue(card_from_id,{'acceptdate':{value:dateValue}});
				}
				if (body) {
					this.props.cardTable.setTableData(card_table_id, body[card_table_id]);
				}
				let billID = head[card_from_id].rows[0].values.pk_spegather_h.value;
				let billNO = head[card_from_id].rows[0].values.vbillno.value;
				this.setState({
					billID,
					billNO
				});

				this.props.form.setFormStatus(card_from_id, 'edit')
				this.props.setUrlParam({
					status: 'edit',
					from: from,
					id: pk
				})
				//更新缓存
				cardCache.updateCache(pkName, billID, billCard, card_from_id, dataSource);
				versionControl(this.props);
				this.toggleShow();

				//当前币种为组织本币，则组织本币汇率不可编辑
				if (isOrgCurrency) {
					this.props.cardTable.setColEditableByKey(card_table_id, 'olcrate', true);
				}
			}
		});
	}

	//保存单据
	saveBill = () => {
		let status = this.props.getUrlParam('status');
		if (status != 'add' && status != 'edit' && status != viewmod_deal) {
			return;
		}
		//开启表单校验
		let flagForm = this.props.form.isCheckNow(card_from_id);
		//开启表体校验
		let flagTable = this.props.cardTable.checkTableRequired(card_table_id);
		if (!flagForm || !flagTable) {
			return;
		}
		let url = base_url;
		//修改时保存
		if (status == 'edit') {
			url = url + 'spegatherupdate.do';
		}
		//经办保存以及新增保存
		else {
			url = url + 'spegatherinsert.do';
		}
		//获取主子表单据数据
		let billdata = this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
		let pageCode = card_page_id;
		let data = { data: JSON.stringify(billdata), pageCode };
		const that = this;
		if (flagForm && flagTable) {
			ajax({
				url: url,
				data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						let { head, body } = data;
						let pk = head[card_from_id].rows[0].values.pk_spegather_h.value;
						if (head) {
							that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
						}
						if (body) {
							//that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
							//按照差异化来更新表体数据，api会返回完整的表体数据
							body = that.props.cardTable.updateDataByRowId(card_table_id, body[card_table_id]);
							if (body) {
								res.data.body = body;
							}
						}
						that.setState({
							billID: pk,
							billNO: head[card_from_id].rows[0].values.vbillno.value
						});
						that.props.pushTo("/card", {
							status: 'browse',
							id: pk
						});
						//增加缓存或更新缓存
						if (status == 'edit') {
							cardCache.updateCache(pkName, pk, card_from_id, dataSource);
						} else {
							cardCache.addCache(pk, res.data, card_from_id, dataSource);
						}
						versionControl(that.props);
						that.toggleShow();
					}
				}
			});
		}
	};

	//获取列表肩部信息
	getTableHeadButton = (buttons) => {
		let { createButton, createButtonApp } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(card_table_id, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-reva-revecontract-card'
					})}
					{
						createButtonApp(
							{
								onButtonClick: buttonClick.bind(this),
								buttonLimit: button_limit,
								area: 'card_body'
							}
						)
					}
				</div>
			</div>
		);
	};

	/**
	 * 渲染切换上下页组件
	 */
	renderCardChange = () => {
		let { createCardPagination } = this.props.cardPagination;
		let status = this.props.getUrlParam('status');
		if (status == 'browse') {
			return (createCardPagination({
				handlePageInfoChange: pageInfoClick.bind(this),
				//缓存标志
				dataSource: dataSource
			}));
		}
	}

	/**
	 * 返回按钮 返回到列表页面
	 */
	link2ListPage = () => {
		if (cardCache.getDefData(dataSource, islink)) {
			this.props.pushTo("/linklist", {
				status: 'browse',
				pagecode: linklist_page_id
			});
		} else {
			this.props.pushTo("/list", {
				status: 'browse',
				pagecode: list_page_id
			});
		}
	}

	render() {
		let { cardTable, form, button, ncmodal, cardPagination,socket } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(module_id);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp } = button;
		let { createModal } = ncmodal;
		let status = this.props.getUrlParam('status');
		let { assignData, assignShow, backReason, showBackModal, showUploader, billID, billNO, showAccModal, pkInnAccount, approveshow, showNtbDetail, ntbdata } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const that = this;
		let billCode = billNO;
		if (billCode && billCode != '') {
			billCode = ': ' + billCode;
		}
		let linkScene = this.props.getUrlParam('scene');
		//begin tm tangleic 20181116 从缓存中获取联查标志，不知道为何卡片无法从缓存中获取联查标志，故暂时结合url中的场景标志一起来判断
		linkScene = cardCache.getDefData(dataSource, islink) || linkScene == SCENE.LINK;
		//end tangleic
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/* {(status == 'browse') && <NCBackBtn onClick={that.link2ListPage.bind(that)} style={{ marginTop: "8px" }}></NCBackBtn>} */}
							{/*页面大图标*/}
							{/* {createPageIcon()} */}
							{/* <h2 className='title-search-detail'>{this.state.json['36300STG-000026']}&nbsp;{billCode}</h2>国际化处理： 特转收款 */}
							{
									createBillHeadInfo(
										{
											title: this.state.json['36300STG-000026'],  //标题/* 国际化处理： 特转收款*/
											billCode: this.state.billNO,     //单据号
											backBtnClick: () => {           //返回按钮的点击事件
												this.link2ListPage();
											}
										}
									)}
						</div>
						{socket.connectMesg({
							headBtnAreaCode: "card_head",
							formAreaCode: card_from_id,
							billpkname: pkName,
							billtype: billtype,
							dataSource:dataSource
							// serverLocation: '10.16.2.231:9991'
						})}
						<div className="header-button-area">
							{this.props.button.createErrorFlag({
                                    headBtnAreaCode: "card_head"
                            })}
							{
								createButtonApp(
									{
										onButtonClick: buttonClick.bind(that),
										buttonLimit: button_limit,
										area: 'card_head'
									}
								)
							}
						</div>
						{/** 非联查时渲染上下页切换组件 **/}
						{!linkScene && <div className='header-cardPagination-area'>
							{
								that.renderCardChange()
							}
						</div>}
					</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(card_from_id, {
							onAfterEvent: afterEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(card_table_id, {
							adaptionHeight: true,//表格固定10行大小
							tableHead: this.getTableHeadButton.bind(this, buttons),
							modelSave: () => {
								this.saveBill();
								this.props.cardTable.closeModel(card_table_id);
							},
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this),
							onSelected: setCardShouderBtnUseful.bind(this),
							onSelectedAll: setCardShouderBtnUseful.bind(this),
							showCheck: true,
							showIndex: true,
							//待经办时 侧拉增行删行 置灰
							hideAdd: this.props.getUrlParam("status") === viewmod_deal,
							// 是否隐藏删行按钮 默认显示，当值为true时候隐藏
							hideDel: this.props.getUrlParam("status") === viewmod_deal,
							modelAddRow: (props, moduleId, index) => {
								let newrow = getNewRow(props);
								index = Number(index) + Number(1);
								props.cardTable.setValByKeysAndIndex(moduleId, index, newrow);
							},
							modelDelRow: modelDelLineProcess.bind(this),
						})}
					</div>
				</div>
				{/** 改变资金组织 **/}
				{createModal('changeOrg', {
					size: 'lg',//模态框的大小
					content: ''
				})}
				{/** 退回 **/}
				{showBackModal && <Modal
					title={this.state.json['36300STG-000023']}/* 国际化处理： 退回原因*/
					label={this.state.json['36300STG-000023']}/* 国际化处理： 退回原因*/
					show={showBackModal}
					onOk={(value) => {
						//处理退回
						cardReBack.call(this, this.props, value);
					}}
					onClose={() => {
						this.setState({ showBackModal: false })
					}}
				/>}
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
				{/** 联查审批意见 **/}
				<div className="nc-faith-demo-div2">
					{approveshow &&
						<ApproveDetail
							show={this.state.approveshow}
							close={this.closeApprove}
							billtype={billtype}
							billid={billID}
						/>
					}
				</div>
				{/** 账户余额 **/}
				<div>
					{showAccModal &&
						<InnerAccoutDialog
							id="dialog"
							showModal={showAccModal}
							accpk={pkInnAccount}
							closeModal={() => {
								this.setState({ showAccModal: false });
							}}
						/>
					}
				</div>
				{/** 联查预算 **/}
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
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={this.state.json['36300STG-000024']}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = { 'btncode': 'Commit', 'pagecode': card_page_id };
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, card_page_id, card_from_id, [], pkName, base_url + 'spegathercommit.do', this.state.json['36300STG-000007'], dataSource, this.toggleShow.bind(), false, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
			</div>
		);
	}
}

Card = createPage({


	// initTemplate: initTemplate
	mutiLangCode: module_id,
	//编辑关联项适配
	billinfo: {
		billtype: 'card',
		pagecode: card_page_id,
		headcode: card_from_id,
		bodycode: card_table_id
	},
	orderOfHotKey: [card_from_id, card_table_id]
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6DhQLKLvsjv+xJQO0cjqQUunJngTbJoVbN8iY5o8EoG5*/