/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cardCache, high, getMultiLang, createPageIcon } from 'nc-lightapp-front';
let { getNextId, deleteCacheById, addCache, updateCache, getCacheById } = cardCache;
let { NCModal, NCScrollElement, NCAffix } = base;
const { NCBackBtn } = base;//返回button
const { NCDiv } = base;

//引入组件
const { PrintOutput  } = high;
import { buttonClick, initTemplate, afterEvent, initButton, pageInfoClick } from './events';
import {processFormulamsg, versionControl} from '../util/util.js';
import {buttonVisible} from './events/buttonVisible';
//引入常量定义
import { list_page_id,module_id, enable_modal, appcode, card_page_id, card_from_id, card_table_id, dataSourceName, agentacc_pk } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl';
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = card_from_id;
		this.moduleId = module_id;
		this.tableId = card_table_id;
		this.pageId = card_page_id;
		this.state ={
			//多语
			// json: {},
			//输出用   
			outputData: {
				funcode: '', //功能节点编码，即模板编码
				nodekey: '', //模板节点标识
				printTemplateID: '', //模板id
				oids: [],
				outputType: 'output'
			},
			vbillno: '',	//单据编号
			showNCbackBtn: false,	//返回箭头
			showModal_enable: false, //启用停用模态框
			content: '',
			action: '',
			pasteflag: false
		};
		this.closeEnableModal = this.closeEnableModal.bind(this);
		// initTemplate.call(this, props);
	}

	closeEnableModal() {
        this.setState({ showModal_enable: false });
    }

	componentWillMount() {
		let callback = (json) => {
			// this.setState({ json });
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId: appcode, domainName: 'tmpub', callback });
		// 关闭浏览器
		window.onbeforeunload = () => {
			if (this.props.getUrlParam('status') !== 'browse') {
				return '当前单据未保存，您确认离开此页面？';
			}
		};
	}

	componentDidMount() {
		if(this.props.getUrlParam('status') != 'add'){
			this.toggleShow();
		}
	}

	//切换页面状态
	toggleShow = () => {
		
		let status = this.props.getUrlParam('status');
		let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };
		let cardData = getCacheById(data.pk, dataSourceName);
		// versionControl(this.props);
		if(status == 'add'){
			let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
			let orgdisplay = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
			this.setState({
				showNCbackBtn: false
			})
			// /清空表单form所有数据
			this.props.form.EmptyAllFormValue(this.formId);
			this.props.form.setFormItemsValue(this.formId, {'pk_agentacccfg': {value:'',display:null}});
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			
			//新增时除了主组织可编辑 其他字段都不能编辑
			this.props.initMetaByPkorg();
			// 非个性化组织时，查询取默认赋值字段
			ajax({
				url: requesturl.querybyids,
				data: {},
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							// this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.props.form.setFormItemsValue(this.formId,{ 'pk_org': { value:pk_org,display:orgdisplay} });
						// 取到默认组织
						if (pk_org && orgdisplay) {
							this.props.resMetaAfterPkorgEdit();
							this.props.cardTable.setStatus(this.tableId, 'edit');
							this.initBodyBtn(false);
						}
						// 未取到默认组织
						else {
							this.props.form.setFormItemsValue(this.formId, {
								'pk_org': {
									value: null,
									display: null
								}
							});
							this.initBodyBtn(true);
							this.props.form.setFormItemsDisabled(this.formId, {
								'pk_bankaccount': true,
								'pk_bankaccount.pk_bankaccbas.financeorg': true,
								'pk_bankaccount.pk_bankaccbas.pk_banktype': true,
								'pk_bankaccount.pk_bankaccbas.pk_bankdoc': true,
								'pk_bankaccount.pk_bankaccbas.arapprop': true,
								'billstatus': true,
								'enablestate': true
							});
						}
						//暂时将操作信息强制置为不可修改
						this.props.form.setFormItemsDisabled(this.formId, {
							'creator': true,
							'creationtime': true,
							'confirmer': true,
							'confirmtime': true
						});
						//处理公式
						processFormulamsg(this.props, res);
						buttonVisible.call(this, this.props);//按钮显隐性
					}
				}
			});
		}
		else if (status == 'browse') {
			this.setState({
				showNCbackBtn: true
			})
			//如果pk为空则不做查询，不显示数据，只有新增和返回按钮
			if(cardData){
				if (cardData.head) {
					this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
				}
				else {
					this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
				}
				if (cardData.body) {
					this.props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
				}
				else {
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				}
				buttonVisible.call(this, this.props);//按钮显隐性
			}
			else if (!data.pk){
				this.props.form.EmptyAllFormValue(card_from_id);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				this.props.button.setButtonVisible([ 'Print', 'Enable', 'UnEnable', 'Delete', 'Modify', 'Confirm', 'Edit', 'UnConfirm', 'Reflesh', 'CancelPasteBtn','PastebodyLastBtn' , 'Save', 'Cancel', 'AddbodyBtn', 'DeletebodyBtn', 'CopybodyBtn' ], false);
				this.props.button.setButtonVisible([ 'Add' ], true);
				this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true)
                this.props.button.setMainButton(['Add'],true);
                this.props.BillHeadInfo.setBillHeadInfoVisible({
                    showBackBtn: true  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                });
			}
			else {
				ajax({
					url: requesturl.querybyids,
					data: data,
					success: (res) => {
						if (res.data) {
							//处理公式
							processFormulamsg(this.props, res);
							if (res.data.head) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							else {
								this.props.cardTable.setTableData(this.tableId, { rows: [] });
							}
							//更新缓存
							updateCache(agentacc_pk, data.pk, res.data, card_from_id, dataSourceName, res.data.head[card_from_id].rows[0].values);
						} else {
							this.props.form.EmptyAllFormValue(this.formId);
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
						buttonVisible.call(this, this.props);//按钮显隐性
					},
					error: (res) => {
						// toast({color: 'danger', content: res.message});
						this.cancleNewPage('', '', this.pageId);
					}
		
				});
			}
		}
		else if(status == 'edit'){
			this.setState({
				showNCbackBtn: false
			})
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };
			if(data.pk==null){
				return;
			}
			ajax({
				url: requesturl.querybyids,
				data: data,
				success: (res) => {
					let isModify = this.props.getUrlParam('modify')  === 'modify' ? true : false;
					//暂时将操作信息强制置为不可修改
					this.props.form.setFormItemsDisabled(this.formId, {
						'pk_org':true,
						'pk_bankaccount':isModify,
						'creator': true,
						'creationtime': true,
						'confirmer': true,
						'confirmtime': true
					});
					if (res.data) {
						// 公式处理
						processFormulamsg(this.props, res);
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						//无表体单位不允许变更
						else if(isModify) {
							let url_billno = this.props.getUrlParam('bill_no');//单据状态
							this.cancleNewPage(data.pk, url_billno, this.pageId);
							toast({ color: 'warning', content: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000016') });/* 国际化处理： 允许所有单位使用的账户不允许变更！*/
						}
					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					buttonVisible.call(this, this.props);//按钮显隐性
				}
			});
		}
	};
	//切换复制粘贴状态
	toggleCopy = () => {
		let status = this.props.getUrlParam('status');
		if (status != 'browse') {
			this.props.button.setButtonVisible(['AddbodyBtn', 'DeletebodyBtn', 'CopybodyBtn'], !this.state.pasteflag);
			this.props.button.setButtonVisible(['CancelPasteBtn', 'PastebodyLastBtn'], this.state.pasteflag);
		}
	};
	
	refresh = () => {
		this.toggleShow();
	}

	//刷新
	refreshPage = () => {
		let pk = this.props.getUrlParam('id');
		ajax({
			url: requesturl.querybyids,
			data: { pk: pk, pageCode: this.pageId },
			success: (res) => {
				if (res.data) {
					//处理公式
					processFormulamsg(this.props, res);
					if (res.data.head) {
						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					}
					if (res.data.body) {
						this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					}
					else {
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					//更新缓存
					updateCache(agentacc_pk, pk, res.data, card_from_id, dataSourceName, res.data.head[card_from_id].rows[0].values);
				} else {
					this.props.form.EmptyAllFormValue(this.formId);
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				}
				buttonVisible.call(this, this.props);//按钮显隐性
			},
			error: (res) => {
				this.cancleNewPage('', '', this.pageId);
			}
		});
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
						area: 'card_body',
                        buttonLimit: 5, 
                        onButtonClick: buttonClick.bind(this), 
                        popContainer: document.querySelector('.header-button-area')
                    })}
				</div>
			</div>
		);
	};

	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp } = button;
		let { createModal } = modal;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
							   
                        <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                            
                                <div className="header-title-search-area">
                                    {createBillHeadInfo({
                                        title:
                                            this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000008'),
                                        backBtnClick: () => {
                                            this.handleClick();
                                        }
                                    })}
                                </div>
                                <div className="header-button-area">
                                    {/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
                                    {createButtonApp({ area: 'card_head', onButtonClick: buttonClick.bind(this) })}
                                </div>
                                <div className='header-cardPagination-area' style={{ float: 'right' }}>{createCardPagination({
                                    handlePageInfoChange: pageInfoClick.bind(this),
                                    dataSource: dataSourceName
                                })}</div>
                            
                        </NCDiv>
                    
                    <NCScrollElement name='forminfo'>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId, {
                                onAfterEvent: afterEvent.bind(this)
                            })}
                        </div>
                    </NCScrollElement>
                </div>
				<NCScrollElement name='businfo'>
					<div className="nc-bill-table-area">
						{/* {this.getTableHead(buttons, this.tableId)} */}
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							modelSave: this.saveBill,
							onAfterEvent: afterEvent.bind(this),
							showCheck: true,
							showIndex: true
						})}
					</div>
				</NCScrollElement>
				{/* 启用停用模态框 */}
				<NCModal show={this.state.showModal_enable} onHide={this.closeEnableModal} style={{ height: '200px', width: '410px' }}>
					{/* <NCModal.Header closeButton={false}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000004')}</NCModal.Title>国际化处理： 提示
					</NCModal.Header> */}
					<NCModal.Body style={{ height: '150px'}}>
						<div style = {{ fontSize:13 + 'px', marginTop:30 + 'px', marginLeft:15 + 'px', marginBottom:30 + 'px', marginRight:15 + 'px' }} >
							{createForm('enable', {
								// onAfterEvent: afterEvent.bind(this)
							})}
							{this.state.content}
						</div>
					</NCModal.Body>
					<NCModal.Footer>
						{createButtonApp({
							area: enable_modal,
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>
				</NCModal>
				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				{createModal('delete', {
					content: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000018'),/* 国际化处理： 是否确认删除？*/
					beSureBtnClick: this.delConfirm,
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
					userControl:false,  // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					className:'senior',	//junior:宽410,高210;senior:宽520PX,高自适应，最小268，最大420;combine:宽680,高最小268，最大570
					noFooter : false, //是否需要底部按钮,默认true
				})}
				{createModal('switchorg', {
					content: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000022'),//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.beSureOrgBtnClick, //点击确定按钮事件
					cancelBtnClick: this.cancelOrgBtnClick, //取消按钮事件回调
					userControl:false,  // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
					className:'senior',	//junior:宽410,高210;senior:宽520PX,高自适应，最小268，最大420;combine:宽680,高最小268，最大570
					noFooter : false, //是否需要底部按钮,默认true
				})}
				{createModal('cancel', {
					content: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000023'),/* 国际化处理： 确定要取消吗?*/
					beSureBtnClick: this.cancelConfirm,
					className:'senior',	//junior:宽410,高210;senior:宽520PX,高自适应，最小268，最大420;combine:宽680,高最小268，最大570
				})}
				 {createModal('addNode', {
					className:'senior',	//junior:宽410,高210;senior:宽520PX,高自适应，最小268，最大420;combine:宽680,高最小268，最大570
				})}
			</div>
			
		);
	}

	//保存单据
	saveBill = () => {
		let url;
		let billstatus = this.props.form.getFormItemsValue(this.formId, 'billstatus');
		// 新增
		if (billstatus.value == null) {
			this.props.form.setFormItemsValue('head', {
				'billstatus': {
					value: '0', display: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000024')/* 国际化处理： 待确认*/
				},
				'enablestate': {
					value: '2', display: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000025')/* 国际化处理： 已启用*/
				}
			})
			url = requesturl.save;
		}
		// 变更
		else if (billstatus.value == 1 || billstatus.value == 2) {
			this.props.form.setFormItemsValue('head', {
				'billstatus': {
					value: '2', display: this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000026')/* 国际化处理： 变更待确认*/
				}
			})
			url = requesturl.change;
		}
		// 修改
		else if (billstatus.value == 0) {
			url = requesturl.save;
		}

		//删除空行
		let cardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		let rows = cardData.body.cfgdetail.rows;
		for (let i = 0; i < rows.length; i++) {
			let row = rows[i];
			let financeorgDis = row.values.pk_financeorg.display;
			let financeorgVal = row.values.pk_financeorg.display;
			if (row.status != 3 &&
				(typeof (financeorgDis) == 'undefined' || typeof (financeorgVal) == 'undefined' ||
					financeorgDis == null || financeorgVal == null ||
					financeorgDis == '' || financeorgVal == '')) {
				rows.splice(i--, 1);
			}
		}
		//验证公式
        let saveobj = {};
        saveobj[card_table_id] = 'cardTable';
		this.props.validateToSave( cardData , this.save.bind(this, this.props, cardData, url) , saveobj , '' );
	}

	save = (props, cardData, url) => {
		let that = this;
		let status = props.getUrlParam('status');
		ajax({
			url: url,
			data: cardData,
			success: (res) => {
				let pk_agentacccfg = '';
				if (res.success) {
					if (res.data) {
						// 公式处理
						processFormulamsg(props, res);
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							pk_agentacccfg = res.data.head[this.formId].rows[0].values.pk_agentacccfg.value;
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						//添加或更新缓存
						if (status === 'add') {
							addCache(pk_agentacccfg, res.data, this.formId, dataSourceName, res.data.head[this.formId].rows[0].values);
						}
						else if (status === 'edit') {
							updateCache(agentacc_pk, pk_agentacccfg, res.data, this.formId, dataSourceName, res.data.head[this.formId].rows[0].values)
						}
					} else {
						that.props.form.EmptyAllFormValue(this.formId);
						that.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
				}
				this.cancleNewPage(pk_agentacccfg, '', '');
				if (pk_agentacccfg) {
					toast({
						color: 'success',
						content: that.props.MutiInit.getIntl("36010SA") && that.props.MutiInit.getIntl("36010SA").get('36010SA-000027')/* 国际化处理： 保存成功*/
					});
				}
			}
		})
	};

	//卡片返回按钮
	handleClick = () => {
		//先跳转列表
		this.props.pushTo('/list', {
			pagecode: list_page_id
		});
	}

	//删除数据
	delConfirm = () => {
		let that = this;
		let delpk = this.props.getUrlParam('id');
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		let pkMapTs = {};
		let pkMapRowIndex = {};
		pkMapTs[delpk] = ts;
		pkMapRowIndex[delpk] = 1;
		ajax({
			url: requesturl.delete,
			data: {
				pks: [delpk],
				tss: [ts],
				pkMapTs: pkMapTs,
				pkMapRowIndex: pkMapRowIndex,
				pageid: this.pageId
			},
			success: (res) => {
				if (res) {
					toast({ color: 'success', content: that.props.MutiInit.getIntl("36010SA") && that.props.MutiInit.getIntl("36010SA").get('36010SA-000007') });/* 国际化处理： 删除成功*/
					let nextId = getNextId(delpk, dataSourceName);
					//从缓存中删除数据
					deleteCacheById(agentacc_pk , delpk, dataSourceName);
					//	有下一条数据
					if (nextId) {
						pageInfoClick.call(that, that.props, nextId);
					} else {
						//	无下一条数据
						this.cancleNewPage('', '', '');
					}
				}
			}
		});
	};

	//确认修改组织
	beSureOrgBtnClick = () => {
		let props = this.props;
		let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
		let pk_org_dis = props.form.getFormItemsValue(card_from_id, 'pk_org').display;
		props.form.cancel(card_from_id);
		props.form.setFormItemsValue(card_from_id, {
			'pk_org': {
				value: pk_org,
				display: pk_org_dis
			}
		});
		//清空表格
		props.form.EmptyAllFormValue(this.formId);
		props.cardTable.setTableData(this.tableId, { rows: [] });
		// props.cardTable.resetTableData(card_table_id);
		if (!pk_org) {
			props.initMetaByPkorg();
			// this.props.form.setFormItemsDisabled(this.formId, {'pk_bankaccount':true});
			this.initBodyBtn(true);
		} else {
			let eventData = props.createHeadAfterEventData(card_page_id, card_from_id, [card_table_id], card_from_id, 'pk_org', this.value);
			eventData.newvalue = {};
			eventData.oldvalue = {};
			ajax({
				url: requesturl.afteredit,
				data: eventData,
				success: function (res) {
					let { success, data } = res;
					if (success) {
						if (res.data.head) {
							props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
							props.form.setFormItemsValue(card_from_id,{ 'pk_org': { value:pk_org,display:pk_org_dis} });
						}
						if (res.data.body) {
							props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
						}
						else {
							// props.cardTable.addRow(card_table_id);
						}
					}
				}
			})
			this.initBodyBtn(false);
		}
		props.form.setFormStatus(this.formId, 'edit');
	};
	//取消修改组织
	cancelOrgBtnClick = () => {
		this.props.form.setFormItemsValue(card_from_id, {
			pk_org: { value: this.state.oldorg, display: this.state.oldorgDis }
		});
		this.props.form.setFormStatus(this.formId, 'edit');
	};

	//取消确认按钮
	cancelConfirm = () => {
		this.props.form.cancel(this.formId);  
		let id = this.props.getUrlParam('id');//单据pk
		let url_billno = this.props.getUrlParam('bill_no');//单据状态
		this.setState({ pasteflag: false });
		this.cancleNewPage(id, url_billno, this.pageId);
	}

	//取消---跳转浏览态页面
	//@param url:请求的连接
	//@param pk:跳转数据pk
	//@param pagecode:请求的pageid
	//@param billno:请求的单据状态
	cancleNewPage = (pk, bill_no, pagecode) => {
		this.props.form.setFormItemsDisabled(this.formId,{'pk_org':false});
		this.props.form.setFormItemsDisabled(this.formId,{'pk_bankaccount':false});
		this.props.pushTo('/card', {
			status: 'browse',
			id: pk,
			pagecode: card_page_id
		});
		this.refresh();
	}

	//设置子表肩部按钮状态
	//@param isdisabled:是否置灰
	initBodyBtn = (isdisabled) => {
		this.setState({ pasteflag: false }, () => {
			this.toggleCopy();
		});
		this.props.button.setButtonDisabled([ 
			'AddbodyBtn',       //增行
			'DeletebodyBtn',        //删行
			'CopybodyBtn'   //复制行
		], isdisabled);
	}
}

Card = createPage({
	// initTemplate: initTemplate,
	billinfo:{
        billtype: 'card', 
        pagecode: card_page_id, 
        headcode: card_from_id,
        bodycode: card_table_id
	},
	orderOfHotKey: [card_from_id, card_table_id],
	mutiLangCode: appcode
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/