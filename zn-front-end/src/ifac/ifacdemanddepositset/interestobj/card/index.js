/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,high,cardCache ,getMultiLang, createPageIcon} from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix,NCBackBtn,NCModal,NCDiv } = base;
import { buttonClick, initTemplate, afterEvent, pageInfoClick,tableModelConfirm } from './events';
import {buttonVisible} from './events/buttonVisible';
import {processFormulamsg} from '../util/util.js';
import { versionsControl } from "../../../pub/util/util.js";
import List from "../list/index.js";
//引入常量定义
import { pk_name,card_version_id,module_id, app_code, button_limit, card_page_id, card_from_id, card_table_id,fun_code,node_key,printTemplate_ID,setNull,dataSourceTam,list_table_id,bill_type, list_page_id, setDisabled,setEditDisabled,setAddDisabled } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl';
let { getCacheById, updateCache,addCache,deleteCacheById,getNextId } = cardCache;
//引入附件组件
const { NCUploader, ApproveDetail,PrintOutput,ApprovalTrans } = high;
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = card_from_id;
		this.moduleId = module_id;
		this.tableId = card_table_id;
		this.pageId = card_page_id;
		this.state = {
			hideModelSave: false,
            hideAdd: false,
            hideDel: false,
			//多语
			json: {},
			inlt: null,
			//附件框是否显示
			showUploader: false,
			target:null,
			//单据主键
			billID: '',
			//单据编码
			billNO: '',
			//是否行复制模式
			isRowCopy: false,
			oldorg:'',
			oldorgDis:'',
			
			showModal_version: false,
			outputData: {
				
				nodekey: null, //模板节点标识
				
				oids: [],
				outputType: 'output'
			}
		};
	}

	componentDidMount() {
		let source = this.props.getUrlParam('source');
		// if (source != 'list' && this.props.getUrlParam('status') != 'add') {
		// 	this.toggleShow();
		// }
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			if (this.props.getUrlParam('status') !== 'browse') {
				return '当前单据未保存，您确认离开此页面？';
			}
		};
		let callback = (json, status, inlt) => {
			if(status) {
				this.setState({ json, inlt });
				initTemplate.call(this, this.props);
			}
		}
		getMultiLang({ moduleId: '36340AIAC', domainName: 'ifac', callback });

    }

	

	//刷新
	refreshcard = () => {
		let pk = this.props.getUrlParam('id');
		let status = this.props.getUrlParam('status');
		// let copyFlag = this.props.getUrlParam('copyFlag');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		this.props.form.setFormStatus(card_from_id, status);
		this.props.cardTable.setStatus(card_table_id, status);
		// buttonVisible(this.props);

		versionsControl(this.props,card_from_id);

		if (status == 'browse') {
			
			this.props.cardTable.setStatus(this.tableId, 'browse');
		} else {
			
			this.props.cardTable.setStatus(this.tableId, 'edit');
		}
		
		if (this.props.getUrlParam('status') == 'browse') {
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };
			let that = this;
			if(!pk){
				this.props.form.EmptyAllFormValue(card_from_id);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				buttonVisible(this.props);
				this.props.button.setMainButton(['Add'],true);
				toast({	
					content: this.state.json['36340AIAC-000053'],/* 国际化处理： 刷新成功！*/
					color: 'success'
				})
			}else{
				this.props.button.setMainButton(['Add'],false);
				ajax({
					url: requesturl.querycard,
					data: data,
					success: (res) => {
						if (res.data) {
							//处理公式
	                      	processFormulamsg(this.props, res);
							if (res.data.head) {
								this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
								// let vbillno =res.data.head[card_from_id].rows[0].values.vbillno.value;
								// this.setState({
								// 	vbillno:vbillno
								// });
							}
							if (res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							else {
								this.props.cardTable.setTableData(this.tableId, { rows: [] });
							}

							updateCache(card_table_id,pk,card_from_id,dataSourceTam,res.data.head[card_from_id].rows[0].values);
							// setCacheDataByPk("id", this.props.getUrlParam('id'), res.data, "head");
							buttonVisible(this.props);
							toast({	
								content: this.state.json['36340AIAC-000053'],/* 国际化处理： 刷新成功！*/
								color: 'success'
							})
						} else {
							this.props.form.EmptyAllFormValue(card_from_id);
							this.props.cardTable.setTableData(this.tableId, { rows: [] });
						}
					}
				});
			}
		}

	}



	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let copyFlag = this.props.getUrlParam('copyFlag');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		if(status==='copy'){
			this.props.form.setFormStatus(this.formId, 'add');
			this.props.cardTable.setStatus(this.tableId, 'add');
		}else{
			this.props.form.setFormStatus(this.formId, status);
			this.props.cardTable.setStatus(this.tableId, status);
		}
		
		
		let id = this.props.getUrlParam('id');
		//查询缓存数据
		let cardData = getCacheById(id, dataSourceTam);
		//判断返回箭头是否显示
		if (status == 'browse') {
			if (this.props.getUrlParam('saveres')) {
				toast({ color: 'success', content: this.state.json['36340AIAC-000009']});/* 国际化处理： 保存成功*/
				this.props.setUrlParam({ saveres: false });
			}
			
			this.props.cardTable.setStatus(this.tableId, 'browse');
		} else {
			if (this.props.getUrlParam('saveres')) {
				toast({ color: 'success', content: this.state.json['36340AIAC-000009']});/* 国际化处理： 保存成功*/
				this.props.setUrlParam({ saveres: false });
			}
			this.props.cardTable.setStatus(this.tableId, 'edit');
		}

		
		if(this.props.getUrlParam('status') == 'add'){
			let pk_org;
			let orgdisplay;
			let extParam={status:"add"};
			ajax({
				url: requesturl.querycard,
				data: {extParam},
				success: (res) => {
					if (res.data) {
						pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
						orgdisplay = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						}

						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						this.props.form.setFormItemsValue(this.formId,{ 'pk_org': { value:pk_org,display:orgdisplay} });
						
						
						//处理公式
                      	processFormulamsg(this.props, res);
					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					buttonVisible(this.props);
					if(pk_org&&orgdisplay){
						if(!res.data.body || res.data.body[this.tableId].rows.length < 1) {
							this.props.cardTable.addRow(this.tableId);
						}
						this.props.resMetaAfterPkorgEdit();
						this.props.button.setButtonDisabled(['SaveRow', 'DeleteRow'], false);
						this.props.form.setFormItemsDisabled(this.formId, setAddDisabled);
					}else{
						this.props.initMetaByPkorg();
					
						this.props.button.setButtonDisabled(['SaveRow', 'DeleteRow'], true);
						let tableRows = this.props.cardTable.getVisibleRows(card_table_id);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						let rowindexlist = [];
						for(let rindex = 0; rindex < tableRows.length; rindex++){
							rowindexlist[rindex] = rindex;
						}
						this.props.cardTable.delRowsByIndex(this.tableId, rowindexlist);
					}
				}
			});
		}

		if (this.props.getUrlParam('status') == 'copy') {
			 
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId,extParam:{status:"copy"}};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.form.setFormItemsValue(this.formId,{'effectivedate':{value:res.data.head[this.formId].rows[0].values.begdate.value}});
							this.props.form.setFormItemsValue(this.formId,{'useflag':{value:false}});
							// this.props.resMetaAfterPkorgEdit();
							this.setState({
								billno:null
							});
						}
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
						this.props.cardTable.addRow(this.tableId);
						// this.props.form.setFormItemsDisabled(card_from_id,{'pk_org':true});
						this.props.cardTable.setColEditableByKey(this.tableId,'pk_accid',false)
						this.props.form.setFormItemsValue(this.formId,setNull);
						this.props.form.setFormItemsDisabled(this.formId, setEditDisabled);
						this.props.form.setFormItemsValue(this.formId,{'version':{value:'0',display:'0'}});
						//处理公式
                      	processFormulamsg(this.props, res);
					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					buttonVisible(this.props);
				}
			});
		}

		//查询单据详情
		if (this.props.getUrlParam('status') == 'browse') {
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId,extParam:{status:"browse"}};
			let that = this;
			// let filedsNull = { 'account_no.accnum': { value: null, display: null } };
			if (cardData) {
				// this.props.form.setFormItemsValue(this.formId, filedsNull);
				this.props.form.setAllFormValue({ [card_from_id]: cardData.head[this.formId] });
				// let vbillno = cardData[this.formId][this.formId].rows[0].values.vbillno.value;
				// this.setState({ billno: vbillno });
				if (cardData.bodys == null) {
					// this.props.cardTable.setTableData(this.tableId, { rows: [] });
				} else {
					this.props.cardTable.setTableData(this.tableId, cardData.bodys[this.tableId]);
				}
				if (cardData.body == null) {
					// this.props.cardTable.setTableData(this.tableId, { rows: [] });
				} else {
					this.props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
				}
				buttonVisible(this.props);
			} else {
				if (!id) {
					this.props.form.EmptyAllFormValue(this.formId);
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
					this.setState({ billno: "" });
					buttonVisible(this.props);
					// this.props.button.setButtonVisible(['File', 'link', 'Print', 'Refresh'], false);
				} else {
					ajax({
						url: requesturl.querycard,
						data: data,
						success: (res) => {
							if (res.data) {
								let pk_accintobj = null;
								if (res.data.head) {
									pk_accintobj = res.data.head[this.formId].rows[0].values.pk_accintobj.value;
									// this.props.form.setFormItemsValue(this.formId, filedsNull);
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									// let vbillno = res.data.head[this.formId].rows[0].values.vbillno.value;
									// this.setState({
									// 	billno: vbillno
									// });
								}
								if (res.data.body) {
									this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								}
								//处理公式
								processFormulamsg(this.props, res);
								// addCache(pk_accintobj,res.data,this.formId,dataSourceTam);
								updateCache(card_table_id, id, card_from_id, dataSourceTam, res.data.head[card_from_id].rows[0].values);
								buttonVisible(this.props);
							} else {
								this.props.form.EmptyAllFormValue(this.formId);
								this.props.cardTable.setTableData(this.tableId, { rows: [] });
							}
						}
					});
				}
			}
		}

		if (this.props.getUrlParam('status') == 'edit') {
			let extParam;
			extParam = { 'uiState': 'edit',status:"edit" };
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId,extParam };
			let isBankAcc = true;
			
			ajax({
				url: requesturl.edit,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.resMetaAfterPkorgEdit();
						}
						this.props.form.setFormItemsDisabled(this.formId, setEditDisabled);

						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}		
						let version = res.data.head[this.formId].rows[0].values.version.value;
						if(version > 0){
							this.props.cardTable.setColEditableByKey(this.tableId,'pk_accid',true);
						}else{
							this.props.cardTable.setColEditableByKey(this.tableId,'pk_accid',false);
						}
						//处理公式
                      	processFormulamsg(this.props, res);				
					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					buttonVisible(this.props);
					
				}
				
			});
	
		}	

		if (this.props.getUrlParam('status') == 'version') {
			let extParam;
			let oidversion = this.props.getUrlParam('version');
			let newversion = parseInt(oidversion) + 1;
			extParam = { 'uiState': 'edit',status:"edit" };
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId,extParam };
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							this.props.form.setFormItemsValue(card_from_id, {
								'version': {
									value: newversion,
									display: newversion
								}
							});
							this.props.initMetaByPkorg();
							this.props.form.setFormItemsDisabled(this.formId, setDisabled);
						}

						if (res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}		
						//处理公式
                      	processFormulamsg(this.props, res);				
					} else {
						this.props.form.EmptyAllFormValue(this.formId);
						this.props.cardTable.setTableData(this.tableId, { rows: [] });
					}
					buttonVisible(this.props);
					
				}
			});
	
		}	
	};
	//删除单据
	delConfirm = () => {
		const delId=this.props.getUrlParam('id');
		let pkMapTs = {};
		let pk = delId;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		pkMapTs[pk] = ts;
		ajax({
			url: requesturl.delete,
			data: {
				pkMapTs,
				pageCode: card_page_id
			},
			success: (res) => {
				if (res) {
					toast({ color: 'success', content: this.state.json['36340AIAC-000017'] });/* 国际化处理： 删除成功*/
					
					let nextId = getNextId(delId, dataSourceTam);
					deleteCacheById("pk_accintobj",delId,dataSourceTam);
					this.props.setUrlParam({
						status: 'browse',
						id: nextId ? nextId:'',
					});
					this.toggleShow();
				}
				
			}
		});
	};


	//删除版本
	delVersionConfirm = () => {
		const delId=this.props.getUrlParam('id');
		let pkMapTs = {};
		let pk = delId;
		let ts = this.props.form.getFormItemsValue(this.formId, 'ts').value;
		pkMapTs[pk] = ts;
		ajax({
			url: requesturl.deleteversion,
			data: {
				pkMapTs,
				pageCode: card_page_id
			},
			success: (res) => {
				if (res) {
					toast({ color: 'success', content: this.state.json['36340AIAC-000017'] });/* 国际化处理： 删除成功*/
					
					// let nextId = getNextId(delId, dataSourceTam);
					let nextId = res.data.head[card_from_id].rows[0].values.pk_accintobj.value
					deleteCacheById("pk_accintobj",nextId,dataSourceTam);
					this.props.setUrlParam({
						status: 'browse',
						id: nextId,
					});
					this.toggleShow();
				}
				
			}
		});
	};

	beSureBtnClick = () => {
		let pk_org = this.props.form.getFormItemsValue('head', 'pk_org').value;
	    let  eventdata={};
		if (!pk_org) {
			this.props.initMetaByPkorg();
		} else {
			this.props.form.EmptyAllFormValue('head');
		}
	};

	cancelBtnClick = () => {
		this.props.form.setFormItemsValue('head', { 'pk_org': { value:this.state.oldorg, display: this.state.oldorgDis } });
		this.props.form.setFormStatus(this.formId, 'edit');
	};
	


	beSureOrgBtnClick = () => {
		let pk_org = this.props.form.getFormItemsValue(card_from_id, 'pk_org').value;
		let pk_org_dis = this.props.form.getFormItemsValue(card_from_id, 'pk_org').display;
		this.props.form.cancel(card_from_id);
		this.props.form.setFormItemsValue(card_from_id, {
			'pk_org': {
				value: pk_org,
				display: pk_org_dis
			}
		});
		this.props.form.setFormStatus(this.formId, 'edit');
		let eventdata = {};
		let tableRows = this.props.cardTable.getVisibleRows(card_table_id);
		let rowindexlist = []
		this.props.form.EmptyAllFormValue(this.formId);
		this.props.cardTable.setTableData(card_table_id, { rows: [] });
		for(var rindex = 0;rindex<tableRows.length;rindex++){
			rowindexlist[rindex] = rindex
		}
		this.props.cardTable.delRowsByIndex(card_table_id,rowindexlist);
		if (!pk_org) {
			this.props.initMetaByPkorg();
			this.props.form.setFormItemsValue(card_from_id,{ 'memo': { value:'',display:'' }}); /* 国际化处理： 销户*/
			// this.props.form.setFormItemsValue(card_from_id,{ 'apply_type': { value:'1',display:this.state.json['36340AIAC-000021']} }); /* 国际化处理： 销户*/
			// this.props.form.setFormItemsValue(card_from_id,{ 'vbillstatus': { value:'-1',display:this.state.json['36340AIAC-000022']} });/* 国际化处理： 自由*/
			this.props.button.setButtonDisabled(['SaveRow', 'DeleteRow'], true);
		} else {
			this.props.resMetaAfterPkorgEdit();
			this.props.form.setFormItemsValue(card_from_id,{ 'pk_org': { value:pk_org,display:pk_org_dis} }); 
			// this.props.form.setFormItemsValue(card_from_id,{ 'apply_type': { value:'1',display:this.state.json['36340AIAC-000021']} }); /* 国际化处理： 销户*/
			// this.props.form.setFormItemsValue(card_from_id,{ 'vbillstatus': { value:'-1',display:this.state.json['36340AIAC-000022']} });	/* 国际化处理： 自由*/
		}
	};

	cancelOrgBtnClick = () => {
		this.props.form.setFormItemsValue(card_from_id, {
			pk_org: { value: this.state.oldorg, display: this.state.oldorgDis }
		});
		this.props.form.setFormStatus(this.formId, 'edit');
	};


	//获取列表肩部信息
	getTableHead = (buttons, tableId) => {
		let { createButton } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					
					{this.props.button.createButtonApp({
                        area: 'card_body',
                        buttonLimit: 2, 
                        onButtonClick:  buttonClick.bind(this), 
                        popContainer: document.querySelector('.header-button-area')
					})}
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					
				</div>
			</div>
		);
	};

	//卡片返回按钮
	handleClick = () => {
		this.props.pushTo("/list", {
			pagecode: list_page_id
		});
	}

	//选择数据时控制按钮显隐性
    selectedShowBtn = () =>{
		let currRows = [];
		currRows = this.props.cardTable.getCheckedRows(this.tableId);
		let selectedLength = currRows.length;
		let flag;
		let j = 0;
		let z = 0;
		let k = 0; //选择的数据有销户的
		if (currRows && currRows.length > 0) {
			for (let i = 0; i < currRows.length; ++i) {
				if(currRows[i].data.values.useflag.value){ //停用标志
					j++;
				}else {
					z++;
				}
				if(currRows[i].data.values.distroyaccdate.value != null){
					k++;
				}
			}
		}
		if(j == selectedLength){
			this.props.button.setButtonDisabled( ['Disable'], true);
			this.props.button.setButtonDisabled( ['Enable'], false);
		}else if(z == selectedLength){
			
			this.props.button.setButtonDisabled( ['Disable'], false);
			this.props.button.setButtonDisabled( ['Enable'], true);
		}else{
			this.props.button.setButtonDisabled( ['Disable','Enable'], true);
		}

		if(selectedLength == 0 || k > 0){
			this.props.button.setButtonDisabled( ['Disable','Enable'], true);
		}
    }


	beSureEditBtnClick = () => {
		let id = this.props.form.getFormItemsValue(card_from_id, pk_name).value
		this.props.pushTo("/card", {
			status:'edit',
			id:id,
			pagecode: card_page_id
		});
		versionsControl(this.props,card_from_id);
      	this.toggleShow()
	};
	cancelEditBtnClick = () => {
		let id = this.props.form.getFormItemsValue(card_from_id, pk_name).value
		this.props.pushTo("/card", {
			status:'browse',
			id:id,
			pagecode: card_page_id
		});
		versionsControl(this.props,card_from_id);
      	this.toggleShow()
		
	};

	

	render() {
		let { cardTable,table, form, button, modal, cardPagination,BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createSimpleTable} = table;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp } = button;
		let { createModal } = modal;
		let { showUploader, billID, billNO,target } = this.state;
		let billnoTitle = '';
		if(this.state.billno){
			billnoTitle = ' : ' + this.state.billno;
		}
		let { createBillHeadInfo } = BillHeadInfo;
		let status = this.props.getUrlParam('status');
		this.props.BillHeadInfo.setBillHeadInfoVisible({ 
			showBackBtn: status == 'browse',  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			// billCode: this.state.vbillno
		});
		return (
			<div className="nc-bill-card"> 
				<div className="nc-bill-top-area">
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: this.state.json['36340AIAC-000034'], //标题/* 国际化处理： 内部账户计息设置*/
								backBtnClick: this.handleClick.bind(this)
							})}
						</div>
						<div className="header-button-area">
							{createButtonApp({area: 'card_head', onButtonClick: buttonClick.bind(this) })}
						</div>
						<div className='header-cardPagination-area' style={{ float: 'right' }}>{createCardPagination({
							handlePageInfoChange: pageInfoClick.bind(this),
							dataSource: dataSourceTam
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
				<NCScrollElement name='businfo'>
					<div className="nc-bill-table-area">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead.bind(this, buttons, this.tableId),
							modelSave: () => {
								//保存动作
								buttonClick.call(this, this.props, 'Save');
								//关闭侧拉弹框
								this.props.cardTable.closeModel(this.tableId);
							}, 
							onAfterEvent: afterEvent.bind(this),
							showCheck: true,
							showIndex: true,
							hideModelSave: this.state.hideModelSave,
            				hideAdd: this.state.hideAdd,
            				hideDel: this.state.hideDel,
							selectedChange: this.selectedShowBtn.bind(this)               // 选择框有变动的钩子函数
						})}
					</div>
				</NCScrollElement>

				{/* 查看版本 */}
				<NCModal
					show={this.state.showModal_version}
					className="showModal-version"
					onHide = {() => this.setState({showModal_version:false})}
					size = "max"
					className = "nc-modal-max high_meter_wrap"
				>
					<NCModal.Header closeButton >
						<NCModal.Title>{this.state.json['36340AIAC-000034']}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							{createSimpleTable(card_version_id, {
								showIndex: true,
								// handlePageInfoChange: pageInfoClick.bind(this),
								tableModelConfirm: tableModelConfirm,
								showCheck: true,								
							})}
						</div>
						{/* <List/> */}
					</NCModal.Body>

					{/* <NCModal.Footer>
						{createButtonApp({
							area: 'publish',
							buttonLimit: 3,
							onButtonClick: () => this.setState({showModal_version:false})
							
						})}
					</NCModal.Footer> */}

				</NCModal>

				<div>
					<PrintOutput
						ref="printOutput"
						url={requesturl.print}
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
			</div>
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'card', 
        pagecode: card_page_id, 
        headcode: card_from_id,
        bodycode: card_table_id
	},
	orderOfHotKey: [card_from_id, card_table_id]
	//initTemplate: initTemplate.bind(this),
	// mutiLangCode: '36340AIAC'
})(Card);

//ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/