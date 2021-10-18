/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast ,cardCache,high,getMultiLang,createPageIcon,cacheTools} from 'nc-lightapp-front';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix ,NCBackBtn,NCDiv} = base;
import { Radio } from 'tinper-bee';
import { buttonClick, initTemplate, afterEvent, pageInfoClick, buttonVisible } from './events';
import { bodyButtonClick} from './events/bodyButtonClick';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import axios from 'axios';
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index.js';
import { InnerAccoutDialog } from '../../../../tmpub/pub/inneraccount/list/index.js';
import NCCOriginalBalance from '../../../../cmp/public/restmoney/list';
let {  PrintOutput,NCUploader,ApprovalTrans,ApproveDetail,Inspection} = high;
//引入退回弹框
import Modal from "../../../../tmpub/pub/util/modal/index";
import { backConfirm } from "./events/buttonClick";
//引入常量定义
import { module_id,module_name,module_tmpub_name,module_tmpub_id,funcode, base_url, button_limit, link_card_page_id, card_from_id, 
	card_table_id, viewmod_deal,dataSource, link_list_page_id ,SHOWMODEL_BULU,sourceModel_SF, list_page_id,allocatePk,allocateBillType,list_table_id,card_page_id} from '../cons/constant.js';
import Sign from '../../../../tmpub/pub/util/ca';
import { cardOperator } from "../../../pub/utils/SFButtonUtil";
import {repaintView } from '../util/index';
import { InsertLine} from '../../../pub/utils/SFButtonUtil';
const bodyCodeMapBodyPKName = {};
bodyCodeMapBodyPKName[card_table_id] = 'pk_allocate_b';
import { setPropCache, saveMultiLangRes, loadMultiLang,createCardWebSocket } from "../../../../tmpub/pub/util/index";

class Card extends Component {
	constructor(props) {
		super(props);
		this.billId='';
		this.billno='';
		this.status='';
		this.state = {
			copyflag: false,
			currentLocale: 'zh-CN', // 本地语言
			ApproveDetails: null, //审批历史数据
			suggestion: '', //审批意见
			returnnote:'',//退回原因
			approveType: 'approve', //审批三个状态
			approveList: [
				//审批内所有的操作
				{ display: loadMultiLang(this.props,'36320FA-000052'), value: 'approve' }, // 批准/* 国际化处理： 批准*/
				{ display: loadMultiLang(this.props,'36320FA-000053'), value: 'Noapprove' }, // 不批准/* 国际化处理： 不批准*/
				{ display: loadMultiLang(this.props,'36320FA-000054'), value: 'reject' } // 驳回/* 国际化处理： 驳回*/
			],
			//卡片切换主组织的旧的组织
			oldorg:'',
			oldorgdisplay:'',
			// //单据主键
			// billId: '',
			// //附件管理使用单据编号
			// billno:'',
			//控制附件弹出框
            showUploader: false,
			//是否行复制模式
			isRowCopy: false,
			// 网银补录 start
			showBuLu: false,
			isMergepay:false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,
			//联查内部账户余额是否显示
			showAccModal: false,
			//联查内部账户pk
			pkInnAccount: '',
			// 银行账户余额 start
			// 是否展示期初余额联查框，true:展示，false:不展示
            showOriginal:false, 
            // 联查余额取数据，将需要联查的数据赋值给我
			showOriginalData:[],
			// 银行账户余额 end
			//默认财务组织
			curr_pk_org:'',
			curr_orgname:'',
			//审批意见 start
			//审批意见是否显示
			approveshow: false,
			//审批意见单据类型
            billtype: '',
			//审批意见 end
			//卡片页状态
			// status:'',
			//联查预算
			showInspection: false,
			//联查预算数据源
            sourceData: null,
			//展开收起
			showWord:false,
			//退回弹框
			showReBack:false,

		}
		// initTemplate.call(this, props);
	};

	componentDidMount() {
		//多语资源
		getMultiLang({
			//模块编码
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]:[module_tmpub_id],
				//sf模块多语资源
				[module_name]:[module_id,funcode]
				
			},
			//领域编码
			domainName: module_name,
			//回调
			callback: (lang) => {
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				initTemplate.call(this,this.props);
			}
		});

		this.billId = this.props.getUrlParam('id');
		this.status=this.props.getUrlParam('status');
		let src = this.props.getUrlParam('scene');//来源场景
		// this.setState({
		// 	status:status
		// });
		// this.toggleShow();
		if (this.billId) {
			// this.setState({
			// 	billid:id
			// });
			this.qryData();
		}
		//新增
		else if (status === 'add') {
			setTimeout(()=>{
				// 清空表单form所有数据
				this.props.form.EmptyAllFormValue(card_from_id);
				this.setState({
					vbillno: ''
				});
				//清空table所有数据
				this.props.cardTable.setTableData(card_table_id, { rows: [] });
				let that = this;
				
				//单据有主组织，新增时,将其他字段设置为不可编辑.
				// this.props.initMetaByPkorg();
				//把所有table中字段不可以编辑，直到选择org之后
				this.props.cardTable.setStatus(card_table_id, 'browse');
				let interfaceJump = this.props.getUrlParam('interfaceJump');
				if(interfaceJump === 'card'){
					//设置组织可以编辑
					this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
					this.props.form.setFormItemsDisabled(card_from_id,{'memo':true,'busitype':true,'pk_currtype':true,'isreversebustype':true});
				}
				this.props.form.setFormItemsValue(card_from_id,
					{
						'pk_org':{
							value: this.state.curr_pk_org,
							display: this.state.curr_orgname
						}
					}
				);
				
				if(this.state.curr_pk_org){
					let	pk_org = {
						value: this.state.curr_pk_org,
						display: this.state.curr_orgname
					};
					afterEvent.call(this,this.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
					this.props.resMetaAfterPkorgEdit();
					this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
				}
				
				this.props.form.setFormItemsVisible(card_from_id, {'pk_org_v':false});
				this.toggleShow();
				// this.props.cardTable.addRow(this.tableId);
			},0);
			
		}else {
			setTimeout(()=>{
				this.props.form.EmptyAllFormValue(card_from_id);
				this.props.cardTable.setTableData(card_table_id, { rows: [] });
				this.toggleShow();
			 },0);
			
		}
	}

	/**
	 * 查询页面数据
	 */
	qryData = () => {
		let status=this.status;
		if(!status) {
			status = this.props.getUrlParam('status');
		}
		let isCopy = this.props.getUrlParam('isCopy');
		let pk=this.props.getUrlParam('id');
		if(!pk) {
			pk=this.billId;
		}
		let data = { pk: pk, pageid: link_card_page_id,pageCode:link_card_page_id };
		const that = this;
		let url = base_url;
		if (status == 'decide') {
			url = url + 'decide.do';
			ajax({
				url,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
							this.billId=res.data.head[card_from_id].rows[0].values.pk_allocate_h.value;
							this.billno=res.data.head[card_from_id].rows[0].values.vbillno.value;
							// that.setState({
							// 	billID: res.data.head[card_from_id].rows[0].values.pk_allocate_h.value,
							// 	billno: res.data.head[card_from_id].rows[0].values.vbillno.value
							// });
							that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true ,'busitype':true,'pk_currtype':true,'isreversebustype':true,'pk_group':true});
						}
						if (res.data.body) {
							that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
							that.props.button.setButtonVisible(['addline','deleteline','copyline'], false);
						}
						that.toggleShow();
						
						//从列表点击复制操作
						if (isCopy) {
							//组织选中值则恢复其余字段的编辑性
							that.props.resMetaAfterPkorgEdit();
						}
					} else {
						that.props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
						that.props.cardTable.setTableData(card_table_id, { rows: [] });
					}
				}
			});
		} else if (isCopy) {
			url = url + 'copy.do';
			ajax({
				url,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
							this.billId=res.data.head[card_from_id].rows[0].values.pk_allocate_h.value;
							this.billno=res.data.head[card_from_id].rows[0].values.vbillno.value;
							// that.setState({
							// 	billID: res.data.head[card_from_id].rows[0].values.pk_allocate_h.value,
							// 	billno: res.data.head[card_from_id].rows[0].values.vbillno.value
							// });
						}
						if (res.data.body) {
							that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
						}
						that.toggleShow();
						
						//从列表点击复制操作
						if (isCopy) {
							//组织选中值则恢复其余字段的编辑性
							that.props.resMetaAfterPkorgEdit();
						}
					} else {
						that.props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
						that.props.cardTable.setTableData(card_table_id, { rows: [] });
					}
				}
			});
		} else {
			url = url + 'querycard.do';
			ajax({
				url,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
							this.billId=res.data.head[card_from_id].rows[0].values.pk_allocate_h.value;
							this.billno=res.data.head[card_from_id].rows[0].values.vbillno.value;
							// that.setState({
							// 	billID: res.data.head[card_from_id].rows[0].values.pk_allocate_h.value,
							// 	billno: res.data.head[card_from_id].rows[0].values.vbillno.value
							// });
						}
						if (res.data.body) {
							that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
						}
						that.toggleShow();
						
						//从列表点击复制操作
						if (isCopy) {
							//组织选中值则恢复其余字段的编辑性
							that.props.resMetaAfterPkorgEdit();
						}
					} else {
						that.props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
						that.props.cardTable.setTableData(card_table_id, { rows: [] });
					}
				}
			});
		}
		
	}

	//切换页面状态
	toggleShow = () => {
		let status=this.status;
		if(!status) {
			status = this.props.getUrlParam("status");
		}
		let viewmode = status === 'browse' ? 'browse' : 'edit';
		let flag = status === 'browse' ? false : true;
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			//控制显示返回按钮: true为显示,false为隐藏
			showBackBtn: true,
			//控制显示单据号：true为显示,false为隐藏
			showBillCode: true,
			billCode: this.billno,
		});
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);//设置看片翻页的显隐性
		//设置页面组件的显示状态
		
		this.props.form.setFormStatus(card_from_id, viewmode);
		this.props.cardTable.setStatus(card_table_id, viewmode);
		buttonVisible.call(this,this.props,status);
		orgVersionView(this.props, card_from_id);
	};

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		let cardpk = this.props.getUrlParam('id');
		let cardts = this.props.form.getFormItemsValue(card_from_id, 'ts').value;
	
		let buluData = {
			pk: cardpk,
			ts: cardts,
			results: retMsg,
			pageid: link_card_page_id,		
			isCardOpt:true
		}
		ajax({
			url: '/nccloud/sf/allocation/allocatebuluretmsg.do',
			data: buluData,
			success: (res) => {
				if (res.success) {
					if(res.data.billCard){
						if (res.data.billCard.head) {
							this.props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
						} 
						if(res.data.billCard.body){
							this.props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
						}
					}
					if(this.state.isMergepay){
						buttonClick.call(this,this.props,'pay_merge_check')
					}
				}
			}
		});
	}

	//删除单据确认处理逻辑
	delConfirm = () => {
		let pkMapTs = {};
		let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_allocate_h').value;
		let ts = this.props.form.getFormItemsValue(card_from_id, 'ts').value;
		pkMapTs[pk] = ts;
		let data = { pkMapTs, pageCode: link_card_page_id };
		ajax({
			url: base_url+'delete.do',
			data,
			success: () => {
				toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000055') });/* 国际化处理： 删除成功*/
				let currID = { id: this.props.getUrlParam('id'), status: 'browse' };
				let nextID = this.props.cardPagination.getNextCardPaginationId(currID);
				cardCache.deleteCacheById('pk_allocate_h',pk,dataSource);
				//如果有下一条数据则加载下一条数据，否则返回列表界面
				if (nextID) {
					this.props.cardPagination.setCardPaginationId(currID);
					pageInfoClick.call(this, this.props, nextID);
				} else {
					this.link2ListPage();
				}

			}
		});
	};

	changeOrgConfirm = (data) =>  {
		//组织
		if(this.props.form.getFormItemsValue(card_from_id,'pk_org').value){
				let eventdata = this.props.createHeadAfterEventData('36320FA_LINKC01', card_from_id, [card_table_id], card_from_id, 'pk_org', null);
				let oldvalue=eventdata.oldvalue.value;
				let olddisplay=eventdata.oldvalue.display;
				console.log(eventdata);
				let extParam = { 'uiState': status };
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data:{ 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventdata),extParam },
					success: (res) => {
						if(res.success) {
							let { success, data } = res;
							let { card,extParam, retExtParam, headItemProps, bodyItemProps } = data;
							let { head, body } = card;
							let t = { [card_from_id] : head[card_from_id]};
							
							this.setState({olddisplay:olddisplay});
							this.props.form.setAllFormValue(t);
							// if (extParam.hasOwnProperty('isClerBody')) {
								// let flag = extParam.isClerBody;
								// if (flag) {
									//清空表体
							this.props.cardTable.setTableData(card_table_id, { rows: [] });
							this.props.form.setFormItemsDisabled(card_from_id,{'memo':false,'busitype':false,'pk_currtype':false,'isreversebustype':false});
							//修改新增按钮点击状态
							this.props.button.setButtonDisabled(['addline'], false);
							//增行操作
							let busitype=this.props.form.getFormItemsValue(card_from_id,'busitype').value;
							let pk_org=this.props.form.getFormItemsValue(card_from_id,'pk_org').value;
							let pk_group=this.props.form.getFormItemsValue(card_from_id,'pk_group').value;
							let index=0;
							let rows=this.props.cardTable.getCheckedRows(card_table_id);
							if(rows.length>0) {
								index=rows[rows.length-1].index;
							}else {
								index=this.props.cardTable.getNumberOfRows(card_table_id)-1;
							}
							InsertLine(this.props,card_table_id,index);
							index=this.props.cardTable.getNumberOfRows(card_table_id)-1;
							this.props.cardTable.setValByKeyAndIndex(card_table_id,index+1,'pk_org',{value:pk_org,display:''});
							this.props.cardTable.setValByKeyAndIndex(card_table_id,index+1,'pk_group',{value:pk_group,display:''});
						
							if(busitype!=2) {
								this.props.cardTable.setEditableByIndex(card_table_id,
								[index],['pk_accid_r'],false);

							}
							afterEvent(this.props,card_from_id,'busitype',this.props.form.getFormItemsValue(card_from_id,'busitype').value);
								// }
							// }
						}
					},
					error: (res) => {
						// this.props.form.setAllFormValue({[card_from_id]:{ rows: [] }});
						let oldvalue=this.state.oldorg;
						let olddisplay=this.state.oldorgdisplay;
						this.props.form.setFormItemsValue(card_from_id,{'pk_org':{'value':oldvalue,'display':olddisplay}});
						this.props.cardTable.setTableData(card_table_id, { rows: [] });
						this.props.form.setFormItemsDisabled(card_from_id,{'memo':true,'busitype':true,'pk_currtype':true,'isreversebustype':true});
						// toast({ color: 'warning', content: res.Error });
						// console.error(res);
						toast({ color: 'warning', content: res.message });
					}
				});
			}else {
				this.props.form.EmptyAllFormValue(card_from_id);
				this.props.cardTable.setTableData(card_table_id, { rows: [] });
				this.props.form.setFormItemsDisabled(card_from_id,{'memo':true,'busitype':true,'pk_currtype':true,'isreversebustype':true});
			}
		

	}
	//组织取消和关闭
	cancelBtnClick=()=>{
		let oldvalue=this.state.oldorg;
		let olddisplay=this.state.oldorgdisplay;
		this.props.form.setFormItemsValue(card_from_id,{'pk_org':{'value':oldvalue,'display':olddisplay}});
	}
	closeModalEve=()=>{
		let oldvalue=this.state.oldorg;
		let olddisplay=this.state.oldorgdisplay;
		this.props.form.setFormItemsValue(card_from_id,{'pk_org':{'value':oldvalue,'display':olddisplay}});
	}

	componentWillMount(){
        window.onbeforeunload = () =>{
            let currentBillStatus = this.props.getUrlParam('status')
            if(currentBillStatus != 'browse'){
                return loadMultiLang(this.props,'36320FA-000056')/* 国际化处理： 当前单据未保存，您确定离开此页面？*/
            }
        }
    }

	//保存单据
	saveBill = () => {
		if (this.props.getUrlParam('copyFlag') === 'copy') {
			this.props.form.setFormItemsValue(card_from_id, { pk_allocate_h: null });
			this.props.form.setFormItemsValue(card_from_id, { ts: null });
		}
		//过滤表格空行.
		let CardData = this.props.createMasterChildData(link_card_page_id, card_from_id, card_table_id);
		console.log(CardData,"sign before CardData");
		let result = Sign({
			data: CardData,
			isSign: true, 
			isKey:true,
			encryptVOClassName:"nccloud.web.sf.allocation.allocate.vo.AllocateEncryptVO4NCC"
		});
		if (result.isStop) {
			return;
		}
		CardData= result.data;
		console.log(CardData,"sign after CardData");
		
		let url = base_url + 'save.do'; //新增保存
		if (this.props.getUrlParam('status') === 'edit') {
			url = base_url + 'update.do'; //修改保存
		}
		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let pk_allocate_h = null;
				if (res.success) {
					if (res.data) {
						toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000066') });/* 国际化处理： 保存成功*/
						if (res.data.head && res.data.head[card_from_id]) {
							this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
							pk_allocate_h = res.data.head[card_from_id].rows[0].values.pk_allocate_h.value;
						}
						if (res.data.body && res.data.body[card_table_id]) {
							this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
						}
					}
				}
				this.props.setUrlParam({
					status: 'browse',
					id: pk_allocate_h
				});
				this.toggleShow();
			}
		});
		// }
	};

	// 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        })
	}
	
	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			approveshow: false
		})
	}

	// 编辑保存是取消按钮确认框
	cancelConfirm = () => {
		
		if (this.props.getUrlParam('status') == 'edit') {
			// 表单返回上一次的值
			this.props.form.cancel(card_from_id);
			// 表格返回上一次的值
			this.props.setUrlParam({
			  status: 'browse',
			  id: this.props.getUrlParam('id'),
			  interfaceJump:'card'
			});
			this.componentDidMount();
		}
		//保存中的取消操作
		else if (this.props.getUrlParam('status') == 'add') {
			let id=this.props.getUrlParam('id');
			if(!id) {
			id=this.billId;
			}
			this.props.setUrlParam({
			id: id,
			status: 'browse',
			interfaceJump:'card'
			});
			this.componentDidMount();
		}
		//复制中的取消操作
		else if (this.props.getUrlParam('status') == 'copy') {
			let id=this.props.getUrlParam('id');
			if(!id) {
				id=this.billId;
			}
			this.props.setUrlParam({
				id: id,
				status: 'browse',
				interfaceJump:'card'
			});
			this.componentDidMount();
		}
		// 经办
		else if (this.props.getUrlParam('status') == 'decide') {
			this.props.setUrlParam({
				status: 'browse',
				id: this.props.getUrlParam('id'),
				interfaceJump:'card'
			});
			
			this.componentDidMount();
		}
		//浏览查询详情
		else if (!this.props.getUrlParam('status')||this.props.getUrlParam('status') == 'browse') {
			this.props.setUrlParam({
				status: 'browse',
				id: ''
			});
			this.componentDidMount();
		}
	};

	// 退回原因
	returnnoteModelContent() {
		return (
			<div className="addModal">
				<NCFormControl
					className="demo-input"
					value={this.state.returnnote}
					onChange={this.changeReturnnoteEvent}
					size="sm"
				/>
			</div>
		)
	};

	//审批按钮操作事件
	approveRadio = (val) => {
		this.setState(
			{
				approveType: val
			},
			() => console.log(this.state)
		);
	};
	//输入意见输入框
	suggestChange(val) {
		this.setState({
			suggestion: val
		});
	}

	createApprove = () => {
		//审批流程
		let { approveDetail } = this.props;
		let { ApproveDetails, approveType, approveList, suggestion, billID } = this.state;
		return approveDetail.create('demo1', {
			data: ApproveDetails,
			approveType,
			suggestion,
			approveList,
			needInput: true,
			approveRadio: this.approveRadio.bind(this),
			suggestChange: this.suggestChange.bind(this),
			billID
		});
	};
	//审批单据
	approve = (name) => {
		let { approveType, suggestion, ApproveDetails } = this.state;
		let approveResult =
			approveType == 'approve' ? 'Y' : approveType == 'Noapprove' ? 'N' : approveType == 'reject' ? 'R' : '';
		let jumpToActivity = approveType == 'approve' ? null : ApproveDetails[ApproveDetails.length - 2].activityID;
		let data = {
			approveResult,
			jumpToActivity,
			checknote: suggestion,
			billid: this.props.form.getFormItemsValue(card_from_id, 'crevecontid').value,
			ts: this.props.form.getFormItemsValue(card_from_id, 'ts').value,
			billOrTranstype: this.props.form.getFormItemsValue(card_from_id, 'vtrantypecode').value,
			userid: '1001A41000000000592P',
			actionname: name ? name : 'APPROVE'
		};
		ajax({
			url: base_url + 'approve.do',
			data,
			success: (res) => {
				if (res.data) {
					console.log(res);
				}
			}
		});
	};

	//获取列表肩部信息
	getTableHeadButton = (buttons) => {
		let { createButton, createButtonApp } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(card_table_id, {
						iconArr: ['close', 'open', 'max'],
						maxDestAreaId: 'finance-fts-commissionpayment-card'
					})}
					{/* 应用注册按钮 */}
					{this.props.button.createButtonApp({
						area: 'card_body',
						buttonLimit: 7,
						onButtonClick:bodyButtonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')
					})}
				</div>
			</div>
		);
	};

	//切换组织
	changeOrg = () => { }

	/**
	 * 渲染切换上下页组件
	 */
	// renderCardChange = () => {
	// 	let { createCardPagination } = this.props.cardPagination;
	// 	let status = this.props.getUrlParam('status');
	// 	if (status == 'browse') {
	// 		return (createCardPagination({
	// 			dataSource:dataSource,
	// 			handlePageInfoChange: pageInfoClick.bind(this)
	// 		}));
	// 	}
	// }

	/**
	 * 返回按钮 返回到列表页面
	 */
	link2ListPage = () => {
		this.props.pushTo("/linklist", {
			pagecode:list_page_id
		});
	};
	render() {
		let { cardTable, form, button, modal, cardPagination, ncmodal} = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(module_id);
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButton, createButtonApp,createErrorFlag } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		const { createBillHeadInfo } = this.props.BillHeadInfo;

		let createNCModal  = ncmodal.createModal;

		// 附件相关内容变量
		let { showUploader, target, showNCbackBtn,pkInnAccount,showAccModal,assignData, assignShow } = this.state;
		let { showInnerAccInfo, pk_inneracc } = this.state;
		const that = this;
		return (
			<div className="nc-bill-card">
				{/**创建websocket */}
				{createCardWebSocket(this.props, {
                    headBtnAreaCode: 'list_head',
                    formAreaCode: card_from_id,
                    billpkname: allocatePk,
					billtype: allocateBillType,
					dataSource: dataSource
                })}
				<div className="nc-bill-top-area">
				<NCAffix>
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					
							<div className="header-title-search-area">
								{/*页面大图标*/}
								{createBillHeadInfo({
									// {/* 国际化处理： 资金上收*/}
									title:loadMultiLang(this.props,'36320FA-000058'),
									//单据号
									billCode: this.billno,
									//返回按钮的点击事件 
									backBtnClick: () => {
										this.link2ListPage();
									}
								})}
							</div>
							<div className="header-button-area">
							{
									createErrorFlag({
										headBtnAreaCode: 'card_head'
									})
								}	
								{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
								{this.props.button.createButtonApp({
										area: 'list_head',
										buttonLimit: 10,
										onButtonClick: buttonClick.bind(this),
										popContainer: document.querySelector('.header-button-area')
									})}
							</div>
							<div className='header-cardPagination-area' style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource:dataSource
							})}</div>
						
						</NCDiv>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(card_from_id, {
								expandArr: [card_from_id],
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					{/* </NCScrollElement> */}
				</div>
				<div className="nc-bill-bottom-area">
					<NCScrollElement name='businfo'>
						<div className="nc-bill-table-area">
							{createCardTable(card_table_id, {
								tableHead: this.getTableHeadButton.bind(this, buttons),
								modelSave: buttonClick.bind(this,this.props,'save'),
								onAfterEvent: afterEvent.bind(this),
								hideAdd:this.status=='decide',
								hideDel:this.status=='decide',
								showCheck: true,
								showIndex: true,
								adaptionHeight:true
							})}
						</div>
					</NCScrollElement>
				</div>
				{/* {createModal('approve', {
					title: multiLang && multiLang.get('36300IT-0019'),
					content: this.createApprove(),
					beSureBtnClick: this.approve
				})} */}
				{/* 输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/sf/delivery/deliveryprint.do"
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>
				{createModal('saveCancelModel', {
					title: loadMultiLang(this.props,'36320FA-000011'),/* 国际化处理： 取消*//* 国际化处理： 取消确认*/
					content: loadMultiLang(this.props,'36320FA-000012'),/* 国际化处理： 确定要取消吗？*//* 国际化处理： 是否确任要取消?*/
					beSureBtnClick: this.cancelConfirm,
					//  模态框大小 sm/lg/xlg,
					size:'sm', 
					className:'junior'
				})}

				{createModal('delete', {
					title: loadMultiLang(this.props,'36320FA-000059'),/* 国际化处理： 删除*/
					content: loadMultiLang(this.props,'36320FA-000060'),/* 国际化处理： 确定要删除吗？*/
					beSureBtnClick: this.delConfirm,
					userControl: false,
					noFooter: false
				})}
				{createModal('changeorg', {
					title: loadMultiLang(this.props,'36320FA-000061'),/* 国际化处理： 修改*/
					content: loadMultiLang(this.props,'36320FA-000062'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					beSureBtnClick: this.changeOrgConfirm,
					cancelBtnClick: this.cancelBtnClick, //取消按钮事件回调
                	closeModalEve: this.closeModalEve, //关闭按钮事件回调
					userControl: false,
					noFooter: false,
					size:'sm', 
					className:'junior',
				})}
				{/* 模态框 */}
				{createNCModal('commonModel', {
					
				})}
				{/* 退回模态框 */}
				<Modal
					title={loadMultiLang(this.props,'36320FA-000063')}/* 国际化处理： 退回原因*/
					label={loadMultiLang(this.props,'36320FA-000063')}/* 国际化处理： 退回原因*/
					show={this.state.showReBack}
					onOk={(value) => {
						//处理退回
						backConfirm.call(this, this.props,value);
					}}
					onClose={() => {
						this.setState({ showReBack: false})
					}}
				/>
				
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={this.closeApprove}
						billtype={'36K2'}
						billid={this.billId}
					/>
				</div>
				{/** 联查预算 **/}
				<div>
					<Inspection
						show={this.state.showInspection}
						sourceData={this.state.sourceData}
						cancel={() => {
							this.setState({ showInspection: false })
						}}
						affirm={() => {
							this.setState({ showInspection: false })
						}}
					/>
				</div>
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props,'36320FA-000065')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							cardOperator(this.props, link_card_page_id, card_from_id, bodyCodeMapBodyPKName, 'pk_allocate_h', base_url+'commit.do', loadMultiLang(this.props,'36320FA-000006'), dataSource, repaintView.bind(this, this.props), false, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/** 网银补录组件 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}
					modal={modal}
					onLineData={this.state.onLineData}
					moduleType={sourceModel_SF}
					modelType={this.state.modelType}
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
				{/* 银行账户余额 */}
				<NCCOriginalBalance
						// 补录框显示
						showmodal={this.state.showOriginal}
						showOriginalData = {this.state.showOriginalData}
						// 点击确定按钮的回调函数
						onSureClick={(retOriginalMsg) => {
							//console.log(retOriginalMsg, 'retOriginalMsg')
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
				{/** 附件管理 **/}
				<div className="nc-faith-demo-div2">
                    {showUploader &&
                        <NCUploader
                            billId={this.billId}
                            billNo={this.billno}
							onHide={this.onHideUploader}
							// beforeUpload={this.beforeUpload}
							customInterface={
								{
									queryLeftTree: '/nccloud/tmpub/pub/lefttreequery.do',
									queryAttachments: '/nccloud/sf/allocation/allocateattachment.do'
								}
							}
                        />
                    }
                </div>
				{/** 联查内部账户余额 **/}
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

				{/* 支付模态框 */}
				{createNCModal('payModel', {
					title:loadMultiLang(this.props,'36320FA-000036'),/* 国际化处理： 支付*/
				})}
				
			</div>
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'card', 
        pagecode: link_card_page_id, 
        headcode: card_from_id,
        bodycode: card_table_id
    },
	mutiLangCode: module_id,
	orderOfHotKey:{card_from_id,card_table_id}
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/