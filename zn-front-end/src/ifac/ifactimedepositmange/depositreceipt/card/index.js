/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,high,cardCache ,getMultiLang, createPageIcon} from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix,NCBackBtn,NCModal,NCDiv } = base;
import { buttonClick, initTemplate, pageInfoClick } from './events';
import {buttonVisible} from './events/buttonVisible';
import {processFormulamsg} from '../util/util.js';
import { versionsControl } from "../../../pub/util/util.js";
import List from "../list/index.js";
//引入常量定义
import { card_version_id,module_id, app_code, button_limit, card_page_id, card_from_id, card_table_id,fun_code,node_key,printTemplate_ID,setNull,dataSourceTam,list_table_id,bill_type, list_page_id, setDisabled } from '../cons/constant.js';
import { requesturl } from '../cons/requesturl';
let { getCacheById, updateCache,addCache,deleteCacheById,getNextId,setDefData,getDefData } = cardCache;
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
			vbillcode:'',
			
			showModal_version: false,
			//输出用   
			outputData: {
				
				nodekey: '', //模板节点标识
				
				oids: [],
				outputType: 'output'
			}
		};
	}

	componentDidMount() {
		let source = this.props.getUrlParam('source');
		if (source != 'list' && (this.props.getUrlParam('status') != 'add' || this.props.getUrlParam('status') != 'edit')) {
			this.toggleShow();
		}
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
		//多语资源
		getMultiLang({
			//模块编码
			moduleId: {
				//tmpub模块多语资源
				['tmpub']:['3601'],
				//fts模块多语资源
				['ifac']:['36340FDLB']
				
			},
			//领域编码
			domainName: 'ifac',
			callback
		});
		// getMultiLang({ moduleId: '36340FDLB', domainName: 'ifac', callback });

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
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res.data) {
						//处理公式
                      	processFormulamsg(this.props, res);
						if (res.data.head) {
							
							this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
							
							let vbillcode =res.data.head[card_from_id].rows[0].values.vbillcode.value;
							this.setState({
								billno:vbillcode,
								vbillcode:vbillcode
							});
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
							content: this.state.json['36340FDLB-000053'],/* 国际化处理： 刷新成功！*/
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



	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam('status');
		let copyFlag = this.props.getUrlParam('copyFlag');
		let flag = status === 'browse' ? false : true;
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		
			this.props.form.setFormStatus(this.formId, status);
			this.props.cardTable.setStatus(this.tableId, status);
		
		
		
		let id = this.props.getUrlParam('id');
		//查询缓存数据
		let cardData = getCacheById(id, dataSourceTam);
		//判断返回箭头是否显示
		if (status == 'browse') {
			if (this.props.getUrlParam('saveres')) {
				toast({ color: 'success', content: this.state.json['36340FDLB-000009']});/* 国际化处理： 保存成功*/
				this.props.setUrlParam({ saveres: false });
			}
			
			
		} 

		//查询单据详情
		if (this.props.getUrlParam('status') == 'browse') {
			let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };
			let that = this;
			// let filedsNull = { 'account_no.accnum': { value: null, display: null } };
			if (cardData) {
				// this.props.form.setFormItemsValue(this.formId, filedsNull);
				this.props.form.setAllFormValue({ [card_from_id]: cardData.head[this.formId] });
				// let vbillcode = cardData[this.formId][this.formId].rows[0].values.vbillcode.value;
				// this.setState({ billno: vbillcode });
				if (cardData.body == null) {
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
				} else {
					this.props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
				}
				buttonVisible(this.props);
			} else {
				// if (!id) {
				// 	this.props.form.EmptyAllFormValue(this.formId);
				// 	this.props.cardTable.setTableData(this.tableId, { rows: [] });
				// 	this.setState({ billno: "" });
				// 	buttonVisible(this.props);
				// 	// this.props.button.setButtonVisible(['File', 'link', 'Print', 'Refresh'], false);
				// } else {
					ajax({
						url: requesturl.querycard,
						data: data,
						success: (res) => {
							if (res.data) {
								let pk_depositreceipt = null;
								if (res.data.head) {
									pk_depositreceipt = res.data.head[this.formId].rows[0].values.pk_depositreceipt.value;
									// this.props.form.setFormItemsValue(this.formId, filedsNull);
									this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
									let vbillcode = res.data.head[this.formId].rows[0].values.vbillcode.value;
									this.setState({
										billno: vbillcode,
										vbillcode: vbillcode
									});
								}
								if (res.data.body) {
									this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								}
							
								this.props.form.setFormStatus(this.formId, 'browse');
								this.props.cardTable.setStatus(this.tableId, 'browse');
								//处理公式
								processFormulamsg(this.props, res);
								// addCache(pk_depositreceipt,res.data,this.formId,dataSourceTam);
								if(this.props.getUrlParam('scene') == 'linksce') {
									// addCache(pk_depositreceipt,res.data,card_from_id,dataSourceTam,res.data.head[card_from_id].rows[0].values);
									if(getDefData(pk_depositreceipt, dataSourceTam)){
										updateCache(card_table_id, id, card_from_id, dataSourceTam, res.data.head[card_from_id].rows[0].values);
									}else{
										addCache(pk_depositreceipt,res.data,card_from_id,dataSourceTam);
										setDefData(pk_depositreceipt, dataSourceTam, res.data);
									}
									
									
								}else{
									updateCache(card_table_id, id, card_from_id, dataSourceTam, res.data.head[card_from_id].rows[0].values);
								}
								
								buttonVisible(this.props);
							} else {
								this.props.form.EmptyAllFormValue(this.formId);
								this.props.cardTable.setTableData(this.tableId, { rows: [] });
							}
						}
					});
				// }
			}
		}

		

		
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
			// this.props.form.setFormItemsValue(card_from_id,{ 'apply_type': { value:'1',display:this.state.json['36340FDLB-000021']} }); /* 国际化处理： 销户*/
			// this.props.form.setFormItemsValue(card_from_id,{ 'vbillstatus': { value:'-1',display:this.state.json['36340FDLB-000022']} });/* 国际化处理： 自由*/
			this.props.button.setButtonDisabled(['SaveRow', 'DeleteRow'], true);
		} else {
			this.props.resMetaAfterPkorgEdit();
			this.props.form.setFormItemsValue(card_from_id,{ 'pk_org': { value:pk_org,display:pk_org_dis} }); 
			// this.props.form.setFormItemsValue(card_from_id,{ 'apply_type': { value:'1',display:this.state.json['36340FDLB-000021']} }); /* 国际化处理： 销户*/
			// this.props.form.setFormItemsValue(card_from_id,{ 'vbillstatus': { value:'-1',display:this.state.json['36340FDLB-000022']} });	/* 国际化处理： 自由*/
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
		let scene = this.props.getUrlParam("scene");
		this.props.pushTo("/list", {
			pagecode: list_page_id,
			scene: scene
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
		if (currRows && currRows.length > 1) {
			toast({
				color: 'warning',
				content: this.state.json['36340FDLB-000039']/* 国际化处理： 请选择1条数据*/
			});
			this.props.button.setButtonDisabled( ['Linkrate'], true);
		}else if(currRows && currRows.length == 1){
			this.props.button.setButtonDisabled( ['Linkrate'], false);
		}else{
			this.props.button.setButtonDisabled( ['Linkrate'], true);
		}
    }

	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	

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
		let { createBillHeadInfo } = BillHeadInfo;
		let status = this.props.getUrlParam('status');
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: status == 'browse',  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.state.vbillcode
		});
		return (
			<div className="nc-bill-card">
				
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: this.state.json['36340FDLB-000034'], //标题/* 国际化处理： 内部账户计息设置*/
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
							// onAfterEvent: afterEvent.bind(this)
						})}
					</div>
				</NCScrollElement>
				
				{/** 附件 **/}
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader 
						billId={billID} 
						billNo={billNO}
						target={null}
						placement={'bottom'}
						onHide={this.onHideUploader}
						// beforeUpload={this.beforeUpload} 
						/>
					}
				</div>

				
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
        headcode: card_from_id
	},
	orderOfHotKey: [card_from_id]

})(Card);


export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/