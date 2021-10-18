/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, getMultiLang, cardCache } from 'nc-lightapp-front';
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { jsondata } from "./jsondata";
import { Templatedata } from "../config/Templatedata";
import { buttonVisable, releaseButtonVisable } from "./events/buttonVisable";//收款结算按钮显示
import { orgVersionUtil } from "../util/orgVersionUtil";//多版本显示
import { formBeforeEvent } from '../util/CMPFormRefFilter.js';//单据控制规则[form编辑前事件]
import { bodyBeforeEvent } from '../util/CMPTableRefFilter.js';//单据控制规则[table编辑前事件]
import { saveReleaseBtn } from './buttonClick/saveReleaseBtn.js';
import { setSourceFlag } from '../util/setSourceFlag.js';//设置来源系统翻译
//加载小应用基础部件
import appBase from "../base/index";
const { comp, api, cons } = appBase;
let { NCScrollElement, NCDiv } = base;
let { getCurrentLastId,
	getCacheById, getNextId,
	deleteCacheById } = cardCache;
/**
 * 到賬通知認領為收款結算頁面
 */
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = Templatedata.card_formid;
		this.searchId = Templatedata.list_searchid;
		this.moduleId = Templatedata.card_tableid;
		this.tableId = Templatedata.card_tableid;
		this.pageId = Templatedata.release_card_pageid;
		this.dataSource = Templatedata.dataSource;//缓存相关
		this.key = Templatedata.key;//缓存相关
		this.pkname = Templatedata.pkname;//缓存相关
		this.tradeType = 'trade_type';//单据控制规则交易类型字段名称（也可传递的单据类型）
		this.formVOClassName = 'RecBillVO';//form表单的vo类名
		this.tableVOClassName = 'RecBillDetailVO';//table表体的vo类名
		this.childform = 'childform1_recbill_01';//侧拉框
		this.billno = '';// 单据编号
		this.state = {
			pasteflag: false,//表体中按钮的显隐性状态
			tradetype: 'D4',
			tradename: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000019'),/* 国际化处理： 收款结算单*/
			tradepk: '0000Z6000000000000F4',
			org_value: '',//切换组织取消使用
			org_display: '',//切换组织取消使用
			outputData: '',//打印输出使用
			deleteId: '',
			tranferstatus: ''//转单页面状态
		};
	}
	//组件初始加载
	componentDidMount() {

	}
	//浏览器页签关闭提示
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(this.formId);
			if (status != 'browse') {
				return '';
			}
		}
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId: [Templatedata.app_code, '36070'], domainName: 'cmp', callback });
	}
	//初始加载数据
	init = () => {
		let orgin_src = this.props.getUrlParam('src');
		//console.log(orgin_src, 'link_src');
		//被联查处理信息
		if (orgin_src && orgin_src == 'settlement') {
			this.getLinkquery();//关联结算信息回调
		} else if (orgin_src && orgin_src == '36S3') {
			this.releaseConfirm();//到账认领回调
		}
	}
	//到账认领
	releaseConfirm = () => {
		let release_billtype = this.props.getUrlParam('billtype');//回传交易类型
		if (release_billtype) {
			let pkArr = this.props.getUrlParam("pks");//多个
			//请求数据
			let pkdata = {
				'pk': pkArr,
				'pageid': this.pageId,
				'billtype': release_billtype
			};
			ajax({
				url: '/nccloud/cmp/recbill/releasecard.do',
				data: pkdata,
				success: (res) => {
					if (res.data) {
						this.props.transferTable.setTransferListValue('leftarea', res.data);
					}
				}
			});
		} else {
			//清空数据
			this.props.transferTable.setTransferListValue('leftarea', []);
		}
	}
	//关联结算信息--->被联查入口
	getLinkquery = () => {
		let src = this.props.getUrlParam('src');
		let callback = this.props.getUrlParam('callback');
		let Status = this.props.getUrlParam('status');
		let pk_settle = this.props.getUrlParam('pk_settle');//结算单据pk
		if (Status == 'browse') {
			//设置卡片显影性
			this.props.cardTable.setStatus(this.tableId, 'edit');
		}
		//联查1：关联计算信息
		if (src && src == 'settlement') {
			//联查处理[不用缓存处理]
			let pks = [];
			if (pk_settle && pk_settle.length > 0) {
				pks.push(pk_settle);
				this.getLinkQueryData(pks);
			}
		}
	}
	//查询联查
	GetQuery = (query) => {
		let theRequest = {};
		if (query.indexOf('?') != -1) {
			let str = query.substr(1);
			if (str.indexOf('&') != -1) {
				let strs = str.split('&');
				for (let i = 0; i < strs.length; i++) {
					theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
				}
			} else {
				theRequest[str.split('=')[0]] = str.split('=')[1];
			}
		}
		return theRequest;
	};
	//联查单据
	getLinkQueryData = (searchData) => {
		let sendArr = {
			'pks': searchData,
			'pageid': this.pageId
		}
		ajax({
			url: '/nccloud/cmp/recbill/recbillquerysettleinfo.do',
			data: sendArr,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (res.data) {
						if (res.data.head) {
							this.toggleShow();
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							//页签赋值
							let billNo = res.data.head[this.formId].rows[0].values.bill_no.value;
							let sourceFlag = res.data.head[this.formId].rows[0].values.source_flag.value;
							this.billno = billNo;// 单据编号
							setSourceFlag.call(this, sourceFlag);
						}
						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}

					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}

				}
			}
		});
	}
	//切换页面状态
	toggleShow = () => {
		//console.log("buttons", this.props.button.getButtons());
		let status = this.props.getUrlParam('status');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		if (!this.props.getUrlParam('id') || this.props.getUrlParam('id').length <= 0) {
			//不存在id就隐藏翻页工具
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		}
		this.props.form.setFormStatus(this.formId, status);
		this.props.cardTable.setStatus(this.tableId, status);
		if (status == 'browse') {
			this.props.cardTable.setStatus(this.tableId, 'browse');
		} else {
			this.props.cardTable.setStatus(this.tableId, 'edit');
		}
		//组织之外的字段不可以编辑
		if (status === 'add') {
			this.props.initMetaByPkorg();
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });//财务组织
		}
		if (status === 'edit') {
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });//财务组织
			this.props.resMetaAfterPkorgEdit();
		}
		if (status === 'copy') {
			this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });//财务组织
			this.props.resMetaAfterPkorgEdit();
		}
		orgVersionUtil.call(this, this.props, this.formId);//多版本视图显隐性
		buttonVisable.call(this, this.props);//按钮的显隐性
	};
	/**
	 * @description 转单认领刷新重新定义按钮页面加载方式
	 * @param isEdit 页面状态
	 */
	releasetoggleShow = (isEdit) => {

		let status = isEdit;
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		this.props.form.setFormStatus(this.formId, status);
		 this.props.cardTable.setStatus(this.tableId, status);

		if (status == 'browse') {
			this.setState({
				tranferstatus: status//转单页面状态
			});
			this.props.cardTable.setStatus(this.tableId, 'browse');
		} else {
			this.setState({
				tranferstatus: status////转单页面状态
			})
			this.props.cardTable.setStatus(this.tableId, 'edit');
		}
		if (status === 'edit') {
			 this.props.resMetaAfterPkorgEdit();
		}
		if (status == 'browse') {
			//设置卡片头部状态
			if (this.billno != null) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: this.billno  //修改单据号---非必传
				});
			} else {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				});
			}
		} else if (status == 'edit') {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				billCode: this.billno  //修改单据号---非必传
			});

		} else {
			//设置卡片头部状态
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
				showBillCode: false,  //控制显示单据号：true为显示,false为隐藏 ---非必传
				// billCode: '123231232111'  //修改单据号---非必传
			});

		}
		releaseButtonVisable.call(this, this.props, status);//认领转单按钮的显隐性
	};
	//卡片返回按钮
	handleClick = () => {
		window.onbeforeunload = null;
		this.props.pushTo('/list');
	}
	//删除单据
	delConfirm = () => {
		let data = {
			'pk': this.props.getUrlParam('id'),
			'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
		};
		//删除后直接进入下一行
		let delpk = this.props.getUrlParam('id');
		if (delpk) {
			this.setState({
				deleteId: delpk
			});//删除单据pk
		}
		/**
		 * id：数据主键的值
		 * dataSource: 缓存数据命名空间
		 */
		let nextId = getNextId(delpk, this.dataSource);
		ajax({
			url: '/nccloud/cmp/recbill/carddelete.do',
			data: data,
			success: (res) => {
				if (res.success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000034') });/* 国际化处理： 删除成功*/
					this.deleteCacheData();//删除缓存
					if (nextId != null) {
						pageInfoClick.call(this, this.props, nextId);
					} else {
						this.cancleSkyPage();//跳转空白页面
					}
				}
			}
		});
	};
	//保存单据
	saveBill = () => {
		saveReleaseBtn.call(this);
	};
	//按钮显示
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	//取消确认按钮
	cancelConfirm = () => {
		//关联结算信息取消直接跳列表了
		let settlement_src_cancel = this.props.getUrlParam('src');
		//console.log(settlement_src_cancel, 'from_settle_to_cancel');
		if (settlement_src_cancel) {
			this.props.pushTo('/list');
		}
		//编辑态
		if (this.props.getUrlParam('status') === 'edit') {
			let edit_pk = this.props.getUrlParam('id');
			let edit_billstatus = this.props.form.getFormItemsValue(this.formId, 'bill_status').value;
			let edit_pagecode = this.pageId;
			this.cancleNewPage(edit_pk, edit_billstatus, edit_pagecode);
		}
		//新增
		if (this.props.getUrlParam('status') === 'add') {
			if (this.props.getUrlParam('formlist')) {
				//列表请求新增
				let url_id = this.props.getUrlParam('id');//单据pk
				let url_billno = this.props.getUrlParam('bill_no');//单据状态
				if (url_id && url_id.length > 0 && url_billno && url_billno.length > 0) {
					//1,查询后跳转新增页面
					this.cancleNewPage(this.props.getUrlParam('id'), this.props.getUrlParam('bill_no'), this.pageId);
				} else {
					//2,未查询后跳转新增页面
					//清空表单form所有数据
					this.cancleSkyPage();
				}
			} else {
				//清空表单form所有数据
				this.props.form.EmptyAllFormValue(this.formId);
				//清空table所有数据
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				/**
				 * 卡片新增--取消
				 */
				if (this.props.getUrlParam('bill_no') && this.props.getUrlParam('id')) {
					this.cancleNewPage(this.props.getUrlParam('id'), this.props.getUrlParam('bill_no'), this.pageId);
				} else {
					this.loadCacheData();//加载缓存
				}
			}
		}
		//复制
		if (this.props.getUrlParam('status') === 'copy') {
			//复制pagecode变化
			let copy_tradetype = this.pageId;
			let copy_pk = this.props.getUrlParam('id');
			let copy_billstatus = this.props.getUrlParam('bill_no');
			if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
				copy_tradetype = this.props.form.getFormItemsValue(this.formId, 'trade_type').value
			}
			this.cancleNewPage(copy_pk, copy_billstatus, copy_tradetype);
		}
	}
	//退出认领
	cancelReleaseConfirm = () => {
		this.props.linkTo('/cmp/informerrelease/SscRelease/list/index.html', {
			appcode: '36070AIPSSC',
			pagecode: '36070AIPSSC_L01',
		});
	}
	//删除表体确认
	delBodyConfirm = () => {
		//财务组织
		let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
		let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
		if (org_val && org_display) {
			let currRows = this.props.cardTable.getCheckedRows(this.tableId);
			let currSelect = [];
			if (currRows && currRows.length > 0) {
				for (let item of currRows) {
					currSelect.push(item.index);
				}
			}
			if (currSelect.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000005') });/* 国际化处理： 请选择数据，进行删除!*/
				return;
			}
			this.props.cardTable.delRowsByIndex(this.tableId, currSelect);
		} else {
			toast({
				'color': 'warning',
				'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
			});
			return;
		}
	}
	//加载缓存数据
	loadCacheData = () => {
		let data_id = getCurrentLastId(this.dataSource);
		let cardData;
		if (data_id) {
			cardData = getCacheById(data_id, this.dataSource);
		}
		if (cardData) {
			//加载缓存
			this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
			let billno_1 = cardData.head[this.formId].rows[0].values.bill_no.value;
			let urlbillno_1 = cardData.head[this.formId].rows[0].values.bill_status.value;
			this.billno = billno_1;//单据编号
			props.setUrlParam({
				status: 'browse',
				id: pks,
				billno: urlbillno_1,
				pagecode: this.pageId
			});

			this.toggleShow();//切换页面状态
		}
		//如果没有缓存数据？
	}
	deleteCacheData = () => {
		/**
		 * 调用删除缓存数据方法
		 * idname: 数据主键的命名
		 * id：数据主键的值
		 * dataSource: 缓存数据命名空间
		 */
		deleteCacheById(this.pkname, this.state.deleteId, this.dataSource);

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
		let { cardTable, form, button, transferTable } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp ,createErrorFlag} = button;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const { createTransferList } = transferTable;
		return (
			<div id="transferCard" className="nc-bill-transferList">
				{/**创建websocket */}
				{api.comm.createCardWebSocket(this.props, {
					headBtnAreaCode: cons.card.btnHeadCode,
					formAreaCode: cons.card.headCode,
					billpkname: cons.field.pk,
					billtype: cons.comm.billType
					// serverLocation: '10.16.2.231:9991'
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{
							createBillHeadInfo(
								{
									title: this.props.MutiInit.getIntl("36070RBM") &&
										this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000121'),  //标题
									billCode: this.billno,     //单据号
									backBtnClick: () => {           //返回按钮的点击事件
										this.handleClick();
									}
								}
							)}
					</div>{/* 国际化处理： 到账通知生成收款结算*/}
					<div className="header-button-area">
						{createErrorFlag({
							headBtnAreaCode: cons.card.btnHeadCode
						})}
						{createButtonApp({
							area: Templatedata.card_head,
							buttonLimit: 10,
							onButtonClick: buttonClick.bind(this)
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-transferList-content">
					{createTransferList({
						//表格组件id
						headcode: this.formId,
						transferListId: 'leftarea', //转单列表id
						onTransferItemSelected: (record, status) => {

							//初次加载第一个默认页面
							let isEdit = status ? 'browse' : 'edit';
							if (isEdit === 'browse') {
								this.props.setUrlParam({ status: 'browse' })
							}

							this.props.form.setAllFormValue({
								[this.formId]: record.head[this.formId]
							});
							if (record.head[this.formId].rows[0].values.bill_no && record.head[this.formId].rows[0].values.bill_no.value) {
								this.billno = record.head[this.formId].rows[0].values.bill_no.value;//单据编号
							}
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true }); //财务组织、
							let tanfer_source_flag = record.head[this.formId].rows[0].values.source_flag.value;
							setSourceFlag.call(this, tanfer_source_flag);
							this.props.cardTable.setTableData(this.tableId, record.body[this.tableId]);
							this.releasetoggleShow(isEdit);

						},
						onTransferItemClick: (record, index, status) => {
							//切换缩略图
							let isEdit = status ? 'browse' : 'edit';
							if (isEdit === 'browse') {
								this.props.setUrlParam({ status: 'browse' })
							}
							if (record.head[this.formId].rows[0].values.bill_no && record.head[this.formId].rows[0].values.bill_no.value) {
								this.billno = record.head[this.formId].rows[0].values.bill_no.value
							}
							this.props.form.setFormItemsDisabled(this.formId, { pk_org: true }); //财务组织
							this.props.form.setAllFormValue({ [this.formId]: record.head[this.formId] });
							this.props.cardTable.setTableData(this.tableId, record.body[this.tableId]);
							let tanfer_source_flag = record.head[this.formId].rows[0].values.source_flag.value;
							setSourceFlag.call(this, tanfer_source_flag);
							this.releasetoggleShow(isEdit);

						}
					})}
					<div className="transferList-content-right nc-bill-card" id="paybill-card">
						<NCScrollElement name='forminfo'>
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									expandArr: [jsondata.form1],
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: formBeforeEvent.bind(this)//form编辑前事件
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name='businfo'>
							<div className="nc-bill-table-area">
								{createCardTable(this.tableId, {
									adaptionHeight: true,//表格固定行
									tableHead: this.getTableHead.bind(this, buttons, this.tableId),
									modelSave: () => {
										this.saveBill();
										this.props.cardTable.closeModel(this.tableId);//关闭侧拉
									},
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: bodyBeforeEvent.bind(this),//table编辑前事件
									// onSelected: buttonUsability.bind(this, this.props),//列表控制列表按钮是否可用
									// onSelectedAll: buttonUsability.bind(this, this.props),//列表控制列表按钮是否可用
									showCheck: true
								})}
							</div>
						</NCScrollElement>
					</div>
				</div>
			</div>
		)
	}
}

Card = createPage({
	mutiLangCode: Templatedata.list_moduleid
})(Card);
ReactDOM.render(<Card />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/