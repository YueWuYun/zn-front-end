//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base, toast ,cardCache,getMultiLang,getBusinessInfo,high} from 'nc-lightapp-front';
import { buttonClick, initTemplate, headafterEvent,bodyafterEvent, pageInfoClick,tableButtonClick,headBeforeEvent,bodyBeforeEvent } from './events';
import { tableId,formId,dataSource,pkname,multiLangCode,module,cardPageId,tableId_Edit} from './constants';
import {buttonVisible,initCardBodyEditControl,onSelectedCardBodyEditControl} from '../common/buttonVisible';
import {dealCardData} from '../common/dealCardData';
import { headButton } from "./buttonName";
import MyModal from "../component/modal";
import {menue} from "../component/menue/menud";
const { NCDiv } = base;
let {setDefData, getDefData,addCache ,getNextId, deleteCacheById,getCacheById,updateCache,getCurrentLastId } = cardCache;

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.tableId = tableId;
		this.pageId = cardPageId;
		this.tableId_Edit =tableId_Edit;
		this.Info = {
			context:{},//上下文信息，主要保存个性化中心的值
			allButtonsKey: [],//保存所有按钮
			isModelSave: false,//是否是整单保存，默认为false
			cmaterialidVbfreeMap : new Map(),//key是物料id，value是物料对应的未启用的自由辅助属性--主要后续控制自由辅助属性的过滤
		}
		this.state = {
			showUploader:false,//附件管理模态框
			buttonfalg: null, //卡片态点击肩部按钮和表体行按钮改变该值控制按钮状态,三种状态，null,true,false
			json:{}
		}
	}

	componentWillReceiveProps(nextProps){
		
	}
	//关闭、刷新弹窗时
	componentWillMount() {
		let callback = (json) => {
			this.setState({json:json},() => {
				initTemplate.call(this, this.props,this.initShow);
			});
		}
		// 多语编码：moduleId,语种：currentLocale,domainName, 回调：callback
		getMultiLang({moduleId: [multiLangCode], currentLocale: 'simpchn',domainName:module,callback})
		// 拦截判断是否离开当前页面《开始》
        window.$this=this;
        window.addEventListener('beforeunload', this.beforeunload);
        // 拦截判断是否离开当前页面《结束》
	}

	componentWillUnmount () {
        // 离开页面时销毁拦截监听，否则返回到列表页时依然在监听浏览器是否关闭
        window.removeEventListener('beforeunload', this.beforeunload);
	}
	beforeunload (e) {
        let status = this.$this.props.getUrlParam('status');
        if (status && status != 'browse') {
            let confirmationMessage = '';
            (e || window.event).returnValue = confirmationMessage;
        }
    }


	

	componentDidMount() {
		
	}
	//页面初始化 -- 渲染完界面模板之后走该漏记
	initShow = () =>{
		let status = this.props.getUrlParam("status");
		if(status == 'browse' || status =='edit'){
			let pk_bill = this.props.getUrlParam('id');
			if (!pk_bill) {
				return;
			}
			ajax({
				url: '/nccloud/web/controlarea/ControlareaCardQueryAction.do',
				data: {
					pk_bill: pk_bill,
					pageId : this.pageId
				},
				success: (res) => {
					this.props.beforeUpdatePage(); //打开开关
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					if (this.props.getUrlParam('status') == 'edit') {
						// this.props.resMetaAfterPkorgEdit();
						// this.props.form.setFormItemsDisabled(this.formId, { pk_org: true });
						this.state.buttonfalg = true;
						// this.controlBillno();//控制单据号是否可以编辑
					} else {
						this.state.buttonfalg = null;
					}
					this.props.cardTable.setStatus(this.tableId, status);
					this.props.form.setFormStatus(this.formId, status);
					this.props.updatePage(this.formId, this.tableId); //关闭开关
					//更新缓存信息
					updateCache(pkname, this.props.getUrlParam('id'), res.data, this.formId, dataSource);
					this.toggleShow();
				}
			});
		}else if(status == 'add'){
			this.initAdd();
			// this.props.button.setButtonVisible([headButton.Add],false);
			// this.props.button.setButtonVisible([headButton.Edit],false);
			// this.props.button.setButtonVisible([headButton.Save],true);
			// this.props.button.setButtonVisible([headButton.Cancal],true);
			// this.props.button.setButtonVisible([headButton.Link],false);
		}else if(status == 'copy'){
			this.copy();
		}else{
			this.toggleShow();
		}
		
	}

	//复制单据
	copy =() =>{
		let pageId = this.pageId;
  		let pk_bill = this.props.getUrlParam('id');
		ajax({
			url: '/nccloud/cm/inprocomstuff/copy.do',
			data: {
				pk_bill: pk_bill,
				pageId : pageId
			},
			success: (res) => {
				if (res.data) {
					this.props.beforeUpdatePage(); //打开开关
					this.props.setUrlParam({status: 'add'});
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					this.props.cardTable.setStatus(this.tableId, 'edit');
					this.props.form.setFormStatus(this.formId, 'edit');
					// this.props.resMetaAfterPkorgEdit();
					// this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
					this.state.buttonfalg = true;
					this.props.updatePage(this.formId, this.tableId); //关闭开关
					this.toggleShow();//控制按钮逻辑
					// this.controlBillno();//控制单据号
				} 
			}
		});
	}


		//模态框取消按钮点击事件
	handleClose(){
		this.setState({modalOne: false})
		// this.props.syncTree.delNodeSuceess('treeId', 'root');
		this.selectRefer="";
	}

	initAdd = (flag) =>{



		// let pk_org = this.Info.context.pk_org;
		// let org_Name = this.Info.context.org_Name;
		this.props.setUrlParam({ status: 'add' })
		this.state.buttonfalg = true;
		// this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
		this.props.cardTable.setStatus(this.tableId, 'edit');
		this.props.form.setFormStatus(this.formId, 'edit');
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.cardTable.setTableData(this.tableId, { rows: [] });
		// this.props.initMetaByPkorg();
		// if(pk_org && org_Name){
		// 	if(flag){//如果是清空财务组织，就不需要附加默认值
		// 		return;
		// 	}
		// 	//如果个性化中心设置了财务组织，该处构造一次编辑后事件
		// 	let aftervalue = {}
		// 	aftervalue.refname = org_Name;
		// 	aftervalue.value = pk_org;
		// 	//附加默认值给框
		// 	this.props.form.setFormItemsValue(this.formId, { pk_org: {value:pk_org,display:org_Name} });
		// 	//调用一次财务组织编辑后事件
		// 	headafterEvent.call(this,this.props,this.formId,'pk_org',aftervalue);
		// }else{
		// 	this.toggleShow()  
		// }
		this.toggleShow()  		
	}



	
	/**
	 * 查询卡片页面
	 * btnName 表示按钮功能 包括刷新,翻页等按钮
	 */
	queryCard = (pk_bill,btnName) =>{
		ajax({
			url: '/nccloud/cm/inprocomstuff/querycard.do',
			data: {
				pk_bill: pk_bill,
				pageId : this.pageId
			},
			success: (res) => {
				if (res.data) {
					//根据不同的按钮，进行不同的刷新提示
					if(btnName == 'Refresh'){
						toast({ color: 'success', title: this.state.json['38200CA-000009']});/* 国际化处理： 刷新成功*/
					}
					if(btnName == 'pageInfoClick'){
						this.props.setUrlParam({id : pk_bill});
					}
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					//更新缓存
					updateCache(pkname,pk_bill,res.data,this.formId,dataSource);
					this.toggleShow();
				} 
			},
			error: (res) => {
				//如果后台抛错，例如并发，当前单据已经被删除了，就清空界面数据
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				//删除前端缓存
				deleteCacheById(pkname, pk_bill, dataSource);
				this.toggleShow();
				let str = String(res);
				let content = str.substring(6, str.length);
				toast({ color: 'danger', content: content });
			}
		});
	}

	// //控制单据号是否可以编辑--如果没有单据号，该方法不需要，可以删除
	// controlBillno =()=>{
	// 	let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
	// 	if(pk_org && pk_org.value){
	// 		ajax({
	// 			url: '/nccloud/cm/inprocomstuff/controlbillno.do',
	// 			async: false,
	// 			data: {
	// 				pk_org: pk_org.value
	// 			},
	// 			success: (res) => {
	// 				if (res.data) {
	// 					//可编辑
	// 					this.props.form.setFormItemsDisabled(formId, { vbillcode: false });
	// 				}else {
	// 					//不可编辑
	// 					this.props.form.setFormItemsDisabled(formId, { vbillcode: true });
	// 				}
	// 			}
	// 		});
	// 	}
	// }




	//切换页面状态-主要是控制按钮的状态逻辑
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let pageId = this.pageId;
		if (!status) {
			status = 'browse';
		}
		let cardhead = this.props.createMasterChildData(pageId, this.formId, this.tableId).head[this.formId].rows[0].values;
		// let pk_org = cardhead ? cardhead.pk_org : null;
		//控制分页按钮和返回按钮是否显示
		if (status != 'browse' ) {
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			this.props.BillHeadInfo.setBillHeadInfoVisible({ showBackBtn: false });
		}else{
			// if(!pk_org || !pk_org.value){
			// 	this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			// 	this.props.BillHeadInfo.setBillHeadInfoVisible({ showBackBtn: false });
			// }
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
			this.props.BillHeadInfo.setBillHeadInfoVisible({ showBackBtn: true });
		}
		let trueBtn = []; //可见的按钮
		let falseBtn = []; //不可见的按钮
		//根据主组织来判断页面是否是一个空界面
		for (let i = 0; i < this.Info.allButtonsKey.length; i++) {
			let flag = buttonVisible.call(this,this.props,cardhead,this.Info.allButtonsKey[i],'card');
			if (flag) {
				trueBtn.push(this.Info.allButtonsKey[i]);
			} else {
				falseBtn.push(this.Info.allButtonsKey[i]);
			}
		}
		//初始化肩部按钮信息增行等按钮的控制
		if (status != 'browse') {
			initCardBodyEditControl.call(this,this.props, cardhead.pk_org ? cardhead.pk_org.value : null);
		} 
		this.props.button.setButtonVisible(trueBtn, true);
		this.props.button.setButtonVisible(falseBtn, false);
		
	};


	
	saveBill = () =>{
			let checkCardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
			//过滤空白行，该单据是根据核算要素和物料进行判断空白行的
			this.props.cardTable.filterEmptyRows('controlarea_card_table_info', ['pk_setofbook'], 'include');
			console.log('aaaa',this.props.cardTable.getAllData(this.tableId))
			if(this.props.cardTable.getAllData(this.tableId).rows.length<1){
				toast({color: 'warning',	content: this.state.json['38200CA-000023']});//表体行数据不能为空!
				return;
			}
			if (!this.props.form.isCheckNow(this.formId)) {//表单验证
				this.onSelected();//控制肩部按钮
				return;
			}
			if (!this.props.cardTable.checkTableRequired(this.tableId)) {//表格验证
				this.onSelected();//控制肩部按钮
				return;
			}
			//去掉空值，减少压缩时间和上行流量，依赖mapub模块,如果不依赖，麻烦拷贝该方法到自己的模块中引入
			let newCardData = dealCardData(this, checkCardData); 
			//过滤了空白行，把数组中的null数据干掉
			newCardData.body[this.tableId].rows = newCardData.body[this.tableId].rows.filter((row) => { return !!row });
			
			let status = this.props.getUrlParam('status');
			let datas = {
				cardData: newCardData,
				uiState: status,
				pageId : '38200CA_card'
			};
			let callback = () =>{
				ajax({
					url: '/nccloud/web/controlarea/ControlareaCardSaveAction.do',
					data: checkCardData,
					success: (res) => {
						if(res.data){
							toast({color: 'success',	content: this.state.json['38200CA-000011']});//保存成功
							let newId = res.data.head['controlarea_card_table'].rows[0].values.pk_controlarea.value;
							//渲染数据和页面状态
							this.props.beforeUpdatePage(); //打开开关
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId],true,false);
							this.state.buttonfalg = null;
							this.props.cardTable.setStatus(this.tableId, 'browse');
							this.props.form.setFormStatus(this.formId, 'browse');
							this.props.updatePage(this.formId, this.tableId); //关闭开关

							//重新获取数据更新缓存
							let newCardData = this.props.createMasterChildData(this.pageId,this.formId,this.tableId);
							if (this.props.getUrlParam('status') == 'add') {
								addCache(newId, newCardData, this.formId, dataSource); //新增
							} else {
								updateCache(pkname, newId, newCardData, this.formId, dataSource); //修改之后更新缓存
							}
							this.props.setUrlParam({status: 'browse',id: newId});
							//整单保存之后，关闭侧拉的模态框
							if (this.Info.isModelSave) {
								this.Info.isModelSave = false;
								this.props.cardTable.closeModel(this.tableId);
							}
							this.toggleShow();
						}
					}
				});
			}
			//验证公式
			this.props.validateToSave(datas.cardData, callback, { table1: 'cardTable' }, 'card');

	}

	//获取列表肩部信息
	getTableHead = (buttons) => {
		return (
			<div>
				{this.props.button.createButtonApp({
					area: 'card_body_area',
					buttonLimit: 3,
					onButtonClick: tableButtonClick.bind(this),
					// popContainer: document.querySelector('.header-button-area')
				})}
			</div>
		);
	};

	//卡片表体点击行事件之后控制按钮逻辑
	onSelected = () => {
		onSelectedCardBodyEditControl.call(this,this.props);
	};
	

	//整单保存事件
	modelSaveClick = (a, modelIndex) => {
		this.Info.isModelSave = true;
		this.saveBill();
	};

	//侧拉删行事件
	modelDelRow = (props, moduleId) => {
		//删行之后如果界面没有数据需要关闭模态框
		let allVisibleRows = this.props.cardTable.getVisibleRows(this.tableId);
		if (!allVisibleRows || allVisibleRows.length == 0) {
			this.props.cardTable.closeModel(this.tableId);
		}
		//删的行如果是被选中的，重新控制肩部按钮
		this.onSelected();
	};
	//返回列表
	backList = () =>{
		this.props.pushTo('/list')
	}

	
	render() {
		let { cardTable, form, cardPagination } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		const {createCardPagination} = cardPagination;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCDiv areaCode={NCDiv.config.HEADER}>
						<div className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createBillHeadInfo({
									title: this.state.json['38200CA-000000'],//国际化处理： 期初在产共用材料
									backBtnClick: () => {
										this.backList();
									}
								})
								}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: 'card_head_area',
									buttonLimit: 3,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							{/* <div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: dataSource //分页按钮的单页缓存信息
								})}
							</div> */}
						</div>
					</NCDiv>
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							onBeforeEvent: headBeforeEvent.bind(this),//编辑前事件
							onAfterEvent: headafterEvent.bind(this)//编辑后事件
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons),//表头肩部按钮信息
							modelSave: this.modelSaveClick.bind(this),//侧拉整单保存函数
							onBeforeEvent: bodyBeforeEvent.bind(this),//表格编辑前事件
							onAfterEvent: bodyafterEvent.bind(this),//表格编辑后事件
							onSelected: this.onSelected.bind(this),//表格单选点击事件
							onSelectedAll: this.onSelected.bind(this),//表格全选事件
							modelDelRow: this.modelDelRow.bind(this),//侧拉删行操作事件
							adaptionHeight:true,//自适应高度
							isAddRow: false,//是否自增行
							showCheck: true,
							showIndex: true
						})}
					</div>
				</div>



				{/** 弹框区域 */}
				<MyModal
                        style={{
                            minHeight: '400px'
                        }}
                        fieldid='voucher_list_modal'
                        size= {this.modalSize}
                        title={this.referModalTitle} //'常用凭证'
                        showModal={this.state.modalOne}
                        showFooter={this.trueButton}
                        closeFn = {() => this.handleClose()}
                        sureFn = {() => this.handleSure()}
                        minHeight={400}
                    >
                        <div>
                            {
                                menue.call(this,this.selectBtn)
                            }
                        </div>
                       
                    </MyModal>


			</div>
		);
	}
}

Card = createPage({
	//编辑关联项的处理，其余页面表格配置不同，请查看文档
	billinfo: {
		billtype: 'card',
		pagecode: cardPageId,
		headcode: formId,
		bodycode: tableId
	}
})(Card);

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65