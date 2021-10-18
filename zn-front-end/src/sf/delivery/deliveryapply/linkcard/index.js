/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, getMultiLang } from 'nc-lightapp-front';
const { NCUploader, Inspection, ApprovalTrans, ApproveDetail, PrintOutput } = high;
let { NCFormControl, NCBackBtn, NCAnchor, NCScrollLink, NCScrollElement, NCAffix, NCDiv } = base;
import { buttonClick, initTemplate, afterEvent, pageInfoClick, beforeEvent } from './events';
import { jsoncode, requesturl } from '../util/const.js';
import { buttonVisible } from './events/buttonVisible';
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
import { cardCache } from "nc-lightapp-front";
import { orgVersionView } from "../../../../tmpub/pub/util/version/index.js";
import { bodyButtonClick } from './events/bodyButtonClick';
import { cardOperator } from '../../../pub/utils/SFButtonUtil';
import { setCardShouderBtnUseful } from "../util/index";
// ca
import Sign from '../../../../tmpub/pub/util/ca/index.js';
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list/index';
import { module_id, module_name } from "../../../pub/cons/constant";
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../tmpub/pub/util/index";
let { addCache, getCurrentLastId, getNextId, deleteCacheById, getCacheById, updateCache } = cardCache;
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = jsoncode.formcode;
		this.searchId = jsoncode.searchcode;
		this.moduleId = jsoncode.modulecode;
		this.tableId = jsoncode.ctablecode;
		this.state = {
			copyflag: false,
			billId: '',//单据id
			billno: '',// 单据编号
			showUploader: false,
			target: null,
			status: 'add',
			show: false,//联查预算参数
			sourceData: null,//联查预算参数
			accModalShow: false,//内部账户余额参数
			currentpk: null,
			//列表页面表体行号
			index: null,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			// 取个性化中心设置的组织
			curr_pk_org: null,
			curr_orgname: null,
			curr_pk_org_v: null,
			curr_orgname_v: null,
			showOriginal: false, // 是否展示期联查付款银行账户余额框，true:展示，false:不展示
			showOriginalData: [],// 联查联查付款银行账户余额取数据，将需要联查的数据赋值给我
			approveBilltype: '',//审批意见单据类型
			showApprove: false,//审批意见是否显示
			approveBillId: '',//审批意见单据pk
			addAndSave: false,
			outputData: '',//输出数据参数
		};
		//initTemplate.call(this, props);
	}
	componentWillMount() {
		getMultiLang({
			// //模块编码
			// moduleId: [module_id, jsoncode.appcode],
			// //领域编码
			// domainName: module_name,
			moduleId: {
				//tmpub模块多语资源
				'tmpub': ['3601'],
				//fts模块多语资源
				'sf': ['3632', '36320DA']
			},
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
				return loadMultiLang(this.props, '36320DA-000024');/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		}
	}
	cancel() {
		this.setState({
			show: false
		})
	}
	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			showApprove: false
		})
	}
	affirm(info) {
		//console.log(info);
		this.setState({
			show: false
		})
	}
	componentDidMount() {
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
			let data = {
				pk: this.props.getUrlParam('id'),
				pageid: jsoncode.linkcpageid
			};
			let that = this;
			ajax({
				url: requesturl.copy,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
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
					this.props.cardTable.addRow(this.tableId);
					let number = this.props.cardTable.getNumberOfRows(this.tableId);
					this.props.cardTable.delRowsByIndex(this.tableId, number - 1);
				}

			});
		}

	}
	//卡片信息查询
	getCardData = (istoast = false) => {
		let data = null
		if (this.props.getUrlParam('status') === 'edit') {
			//点击修改查询时，需要判断用户有没有特殊权限，status: 'edit'参数用来后端卡片查询时对用户权限进行校验
			//data = { pk: !this.props.getUrlParam('id') ? this.props.form.getFormItemsValue(this.formId, 'pk_deliveryapply_h').value : this.props.getUrlParam('id'), pageid: jsoncode.cpageid, status: 'edit' };
			data = { pk: !this.props.getUrlParam('id') ? this.state.billId : this.props.getUrlParam('id'), pageid: jsoncode.linkcpageid, status: 'edit' };
		} else {
			//data = { pk: !this.props.getUrlParam('id') ? this.props.form.getFormItemsValue(this.formId, 'pk_deliveryapply_h').value : this.props.getUrlParam('id'), pageid: jsoncode.cpageid };
			data = { pk: !this.props.getUrlParam('id') ? this.state.billId : this.props.getUrlParam('id'), pageid: jsoncode.linkcpageid };
		}
		if (data.pk) {
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res.data) {
						if (istoast) {
							toast({
								color: 'success', content: loadMultiLang(this.props, '3601-000013')/**多语 刷新成功 */
							});
						}
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						let billnoNo = res.data.head[this.formId].rows[0].values.vbillno && res.data.head[this.formId].rows[0].values.vbillno.value;
						let billIdByRes = res.data.head[this.formId].rows[0].values.pk_deliveryapply_h && res.data.head[this.formId].rows[0].values.pk_deliveryapply_h.value;
						this.setState({
							billId: billIdByRes,
							billno: billnoNo
						});
					}
					else {
						this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					//组织多版本
					orgVersionView(this.props, jsoncode.formcode);
					if (this.props.getUrlParam('status') === 'edit') {//防止浏览态也可以编辑，只有是编辑态才执行下面代码
						//解决表体 修改 时导致子表不可编辑，这里的解决思路是：子表新增一行再删除，编辑性就好用了
						this.props.cardTable.addRow(this.tableId);
						let number = this.props.cardTable.getNumberOfRows(this.tableId);
						this.props.cardTable.delRowsByIndex(this.tableId, number - 1);
					}
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
		setCardShouderBtnUseful(this.props);
		if (status == 'browse') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
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
					toast({ color: 'success', content: loadMultiLang(this.props, '36320DA-000025') });/* 国际化处理： 删除成功*/
					//缓存相关逻辑  20180809 begin
					//1.调用删除缓存数据方法
					deleteCacheById('pk_deliveryapply_h', pk, jsoncode.dataSource);
					//2.根据当前id,获取下个id,并设置到地址栏上
					let nextId = getNextId(pk, jsoncode.dataSource);
					this.props.setUrlParam(nextId);
					//3.查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求
					let cacheData = getCacheById(nextId, jsoncode.dataSource);
					if (cacheData) {
						this.props.form.setAllFormValue({ [jsoncode.formcode]: cacheData.head[jsoncode.formcode] });
						this.props.cardTable.setTableData(this.tableId, cacheData.body[this.tableId]);
					} else {
						this.getCardData();
					}
					//缓存相关逻辑  20180809 end
				}
			}
		});
	};

	//保存单据
	saveBill = async () => {
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
			let cardData = this.props.createMasterChildData(jsoncode.linkcpageid, this.formId, this.tableId);
			let url = requesturl.insert; //新增保存
			if (this.props.getUrlParam('status') === 'edit') {
				url = requesturl.update; //修改保存
			}
			//console.log(cardData, 'sign before cardData');
			let result = await Sign({
				isSign: true,
				isKey: true,
				data: cardData,
				isSave: true,
				encryptVOClassName: 'nccloud.web.sf.delivery.deliveryapply.vo.DeliveryApplyEncryptVO4NCC'
			});
			if (result.isStop) {
				return;
			}
			cardData = result.data;
			//console.log(cardData, 'sign after cardData');
			//若是新增保存
			if (this.state.addAndSave) {
				ajax({
					url: url,
					data: cardData,
					success: (res) => {
						let pk_deliveryapply_b = null;
						if (res.success) {
							if (res.data) {
								toast({ color: 'success', content: loadMultiLang(this.props, '36320DA-000026') });/* 国际化处理： 保存新增成功*/
								pk_deliveryapply_h = res.data.head[this.formId].rows[0].values.pk_deliveryapply_h.value;
							}
							this.setState({
								billId: pk_deliveryapply_h
							});
						}
						// 清空表单form所有数据
						this.props.form.EmptyAllFormValue(this.formId);
						//清空table所有数据
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						this.props.pushTo("/card", {
							pagecode: jsoncode.linkcpageid,
							status: 'add'
						})
						//增加除pk_org 设置所有字段都不可编辑相关逻辑
						this.props.initMetaByPkorg();
						this.toggleShow();
					}
				});
			} else {
				ajax({
					url: url,
					data: cardData,
					success: (res) => {
						let pk_deliveryapply_h = null;
						if (res.success) {
							if (res.data) {
								toast({ color: 'success', content: loadMultiLang(this.props, '36320DA-000027') });/* 国际化处理： 保存成功*/
								if (res.data.head && res.data.head[this.formId]) {
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									pk_deliveryapply_h = res.data.head[this.formId].rows[0].values.pk_deliveryapply_h.value;
								}
								if (res.data.body && res.data.body[this.tableId]) {
									//this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
									//差异化
									this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId]);
								}
								let billnoNo = res.data.head[this.formId].rows[0].values.vbillno && res.data.head[this.formId].rows[0].values.vbillno.value;
								this.setState({
									billno: billnoNo,
									billId: pk_deliveryapply_h
								});
							}
							if (pk_deliveryapply_h) {
								if (url === requesturl.insert) {
									//在列表点新增或在卡片上点新增按钮后，新增保存时，保存成功后，需要调用addCache方法，将数据存储到缓存中
									addCache(pk_deliveryapply_h, res.data, this.formId, jsoncode.dataSource);
								}
								if (url === requesturl.update) {
									//卡片修改保存时，保存成功后，需要调用updateCache方法，将数据更新到缓存中
									updateCache('pk_deliveryapply_h', pk_deliveryapply_h, res.data, this.formId, jsoncode.dataSource);
								}
							}
						}
						this.props.pushTo("/card", {
							pagecode: jsoncode.linkcpageid,
							status: 'browse',
							id: pk_deliveryapply_h
						});
						this.toggleShow();
					}
				});
			}

		}
	};

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
		//this.props.pushTo('/linklist');
		this.props.pushTo("/linklist", {
			pagecode: jsoncode.linkpageid
		});
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
		let { showUploader, target, billno, billId, assignData, assignShow } = this.state;
		let status = this.props.getUrlParam('status');
		const that = this;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						{/** 渲染标题栏 **/}
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{
									createBillHeadInfo(
										{
											title: loadMultiLang(this.props, '36320DA-000047'),  //标题/* 国际化处理： 上缴单被联查*/
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
							adaptionHeight: true,//表格固定10行的大小
							tableHead: this.getTableHeadButton.bind(this, buttons),
							modelSave: this.saveBill,
							onBeforeEvent: beforeEvent.bind(this),
							onAfterEvent: afterEvent.bind(this),
							showCheck: true,
							showIndex: true,
							pkname: 'pk_deliveryapply_h',
							dataSource: jsoncode.dataSource,
							onSelected: setCardShouderBtnUseful.bind(this),
							onSelectedAll: setCardShouderBtnUseful.bind(this)
						})}
					</div>
				</div>
				{createModal('delmodal', {
					title: loadMultiLang(this.props, '36320DA-000029'), // 弹框表头信息/* 国际化处理： 删除*/
					content: loadMultiLang(this.props, '36320DA-000030'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认要删除吗?*/
					beSureBtnClick: this.delConfirm.bind(this), //点击确定按钮事件
					//cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					noFooter: false, //是否需要底部按钮,默认true
					rightBtnName: loadMultiLang(this.props, '36320DA-000012'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
					leftBtnName: loadMultiLang(this.props, '36320DA-000031') //右侧按钮名称， 默认确认/* 国际化处理： 确认*/
				})}
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader
						billId={billId}
						target={target}
						placement={'bottom'}
						billNo={billno}
						onHide={() => {
							this.setState({ showUploader: false });
						}}
					/>
					}
				</div>
				<div>
					<Inspection
						show={this.state.show}
						sourceData={this.state.sourceData}
						cancel={this.cancel.bind(this)}
						affirm={this.affirm.bind(this)}
					/>
				</div>
				{/** 内部账户 **/}
				{this.state.accModalShow && <InnerAccoutDialog
					id="dialog"
					showModal={this.state.accModalShow}
					accpk={this.state.currentpk}
					closeModal={() => {
						this.setState({ accModalShow: false, currentpk: '' });
					}}
				/>
				}
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props, '36320DA-000032')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, jsoncode.linkcpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryapply_h', requesturl.batchcommit, loadMultiLang(this.props, '36320DA-000033'), jsoncode.dataSource, this.toggleShow.bind(this), false, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/** 改变资金组织 **/}
				{createModal('changeOrg', {
					size: 'lg',//模态框的大小
					content: ''
				})}
				{/*联查付款银行账户余额*/}
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
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.showApprove}
						close={this.closeApprove}
						billtype={this.state.approveBilltype}
						billid={this.state.approveBillId}
					/>
				</div>
				{/* 打印输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url='/nccloud/sf/deliveryapply/deliveryapplyprint.do'
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
			</div>
		);
	}
}

Card = createPage({
	// initTemplate: initTemplate,
	mutiLangCode: jsoncode.modulecode
})(Card);
//删除 改为下列方法
//ReactDOM.render(<Card />, document.querySelector('#app'));
//改为：
export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/