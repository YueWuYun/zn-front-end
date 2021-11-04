//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {createBankaccList,createBankaccForm} from './bankacc'
import { createPage, ajax, base, toast, high, promptBox, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import { print } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
import PsndocTreeGridRef from "../../../../uapbd/refer/psninfo/PsndocTreeGridRef/index.js"
// import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';
import {imageScan, imageView} from "sscrp/rppub/components/image";
import {cardCache} from "nc-lightapp-front";
const { NCAffix,NCAnchor,NCScrollElement,NCScrollLink,NCBackBtn,NCDiv } = base;
const { NCUploader, ApproveDetail, ApprovalTrans  } = high
const {PrintOutput} = high
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById, setDefData, getDefData } = cardCache;

const dataSource = 'uapbd.supplier.supplierapply.data'
const formId = 'supplierPf';                      //表头id
const tableId = 'bankaccsub';                  //子表id
const pageId = '10140SPF_card';            //pagecode
const searchId = 'search';                  //查询区id
const appCode = '10140SPF'
const appId ='0001Z010000000001VX1';        //按钮注册id
const queryGroupUrl = '/nccloud/uapbd/supplierapply/queryGroupAction.do';   //卡片查询url
const queryCardUrl = '/nccloud/uapbd/supplierapply/querySupplierApplyCard.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/supplierapply/saveSupplierApply.do';             //新增保存
const updateUrl = '/nccloud/uapbd/supplierapply/updateSupplierApply.do';         //修改保存
const commitUrl = '/nccloud/uapbd/supplierapply/commitSupplierApply.do' //提交
const callbackUrl = '/nccloud/uapbd/supplierapply/callbackSupplierApply.do' //收回
const queryLinkmanUrl = '/nccloud/uapbd/supplierapply/querySupLinkman.do' //联系人查询
const saveLinkmanUrl = '/nccloud/uapbd/supplierapply/saveSupLinkman.do'	//联系人保存
const deleteUrl = '/nccloud/uapbd/supplierapply/deleteSupplierApply.do'	//删除
const printUrl = '/nccloud/uapbd/supplierapply/printSupplierApplyCard.do'
const exFieldUrl = '/nccloud/uapbd/supplierapply/supExField.do'
const checkDataPermUrl = '/nccloud/uapbd/supplierapply/checkDataPerm.do' //编辑数据权限校验功能
const addUrl = '/nccloud/uapbd/supplierapply/addSupplierApply.do'
const pk_item = 'pk_supplier_pf';             //单据主键--用于卡片查询刷新
const tableIds = ['purchase','supbankacc','supcountrytaxes','suplinkman','finance']

const addEditable = ['supcountrytaxes','suplinkman']
const editEditable = ['purchase','supcountrytaxes','suplinkman','finance']

const buttonVisibleObj = {
    allButtons: ['Add','Edit','Delete','Commit','Callback','Attach','ApprDetail','Bankacc','Save','Cancel','Print','Output','Refresh','AddLinesuplinkman','AddLinesupcountrytaxes', 'ImgView', 'ImgScan'],
    editVisibleButtons: []
}

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.searchId = searchId;
		this.tableId = tableId;
		this.billId = this.props.getUrlParam('id')
		this.state = {
			pk_org : '',
			title_code : '',
			totalcount : 0,
			applycount : 0,
			showBaseInfo : true,
			isList: true,
			showApprove: false,
			showUploader: false,
			target: null,
			pks: [],
			backVisible: true,
			compositedata: null,
			compositedisplay: false,
			showApprInfo: false,
            billId: '',
            vbillno: '',
			json: {},
			showFAndS: true,
			bankCanEdit: true
		}
		this.bankaccConfig = {
			tableId: 'supbank',
			formId1: 'accbasinfo',
			formId2: 'netbankinfo',
			cardTableId: 'bankaccsub',
			mainPk : this.props.getUrlParam('id'),
			bankaccModalChange: this.bankaccModalChange.bind(this),
			bankaccModalClose: this.bankaccModalClose.bind(this)
		}
		
	}

	initTemplate =(props, callback)=>{
		props.createUIDom(
			{
				pagecode: pageId//页面id
				// appid: appId,//注册按钮的id
				// appcode: appCode
			}, 
			(data) => {
				if(data){
					if(data.template){
						let meta = data.template;
						this.modifierMeta(props, meta)
						props.meta.setMeta(meta, () => {
							if(data.context){
								if(data.context.pk_org&&data.context.org_Name){
									this.pfOrg = data.context.pk_org
									this.pfOrgName = data.context.org_Name
                                }
                                
                                if(callback && typeof callback == 'function') {
                                    callback()
                                }
							}
						});
					}
					if(data.button){
						let button = data.button;
						props.button.setButtons(button);
						this.toggleShow();
					}
				}   
			}
		)
	}
	
	modifierMeta(props, meta) {
		let status = props.getUrlParam('status');
		meta[formId].status = status;

		//账户基本信息的账号字段只能录入数字
		meta['accbasinfo'].items.find(item => item.attrcode == 'accnum').reg = new RegExp('^\\d*$');
		
		// 修正，供应商申请单申请类型字段去掉停用和启用选项
        let applyTypeItem = meta[formId].items.find(item => item.attrcode == 'apply_type')
        // 避免界面上删除了该字段
        if(applyTypeItem) {
            let originOptions = applyTypeItem.options
            if(originOptions && originOptions.length > 2) {
                let newOptions = [originOptions[0], originOptions[1]]
                applyTypeItem.options = newOptions
            }
        }

	
		//申请组织进行参照主组织过滤
		meta[formId].items.find(item => item.attrcode=='pk_org').queryCondition = () => {
			return {
				//AppCode: this.props.appcode,
				TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
			}
		}
	
		//供应商基本信息参照修正
		let supplierBaseInfo = meta.supplier_baseInfo.items
		supplierBaseInfo.forEach(item => {
			//所属行业
			if(item.attrcode == 'trade') {
				item.queryCondition = function() {
					return {
						pk_defdoclist: '1009ZZ100000000034NN'
					}
				}
			}
			//经济类型
			if(item.attrcode == 'ecotypesincevfive') {
				item.queryCondition = function() {
					return {
						pk_defdoclist: '1009ZZ100000000034NZ'
					}
				}
			}
		})
	
		//增加财务信息专管业务员的参照过滤条件
		let financeTable = meta.finance.items
		financeTable.forEach(item => {
			if(item.attrcode == 'pk_resppsn') {
				item.render = function(text,record,index) {
					return (PsndocTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: record.values.pk_org.value,
								pk_dept: record.values.pk_respdept.value
							}
						}
					}))
				}
			}
		})
	
		//增加财务信息编辑态卡片专管业务员的参照过滤条件
		financeTable = meta.finance_edit.items
		financeTable.forEach(item => {
			if(item.attrcode == 'pk_resppsn') {
				item.render = function(text,record,index) {
					return (PsndocTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: record.values.pk_org.value,
								pk_dept: record.values.pk_respdept.value
							}
						}
					}))
				}
			}
		})
	
		//增加采购信息专管业务员的参照过滤条件
		let purchaseTable = meta.purchase.items
		purchaseTable.forEach(item => {
			if(item.attrcode == 'respperson') {
				item.render = function(text,record,index) {
					return (PsndocTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: record.values.pk_org.value,
								pk_dept: record.values.respdept.value
							}
						}
					}))
				}
			}
		})
	
		//增加采购信息编辑态卡片专管业务员的参照过滤条件
		purchaseTable = meta.purchase_editform.items
		purchaseTable.forEach(item => {
			if(item.attrcode == 'respperson') {
				item.render = function(text,record,index) {
					return (PsndocTreeGridRef({
						queryCondition: () => {
							return {
								pk_org: record.values.pk_org.value,
								pk_dept: record.values.respdept.value
							}
						}
					}))
				}
			}
		})
	
		//供应商联系人参照处理
		meta['suplinkman'].items.find(item => item.attrcode == 'pk_linkman.name').form = props.form
		meta['suplinkman'].items.forEach(item => {
			if(item.attrcode.indexOf('pk_linkman.') >= 0 && item.attrcode != 'pk_linkman.sex') {
				item.refcode = 'uapbd/refer/linkman/LinkmanFormRefer/index'
			}
        })
        if(meta['suplinkman_edit_form']) {
            meta['suplinkman_edit_form'].items.find(item => item.attrcode == 'pk_linkman.name').form = props.form
            meta['suplinkman_edit_form'].items.forEach(item => {
                if(item.attrcode.indexOf('pk_linkman.') >= 0 && item.attrcode != 'pk_linkman.sex') {
                    item.refcode = 'uapbd/refer/linkman/LinkmanFormRefer/index'
                }
            })
        }
	
		//银行账户卡片-地区代码自定义档案参照修正                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
		let bankacc = meta.netbankinfo.items
		bankacc.forEach(item => {
			if(item.attrcode == 'areacode') {
				item.queryCondition = function() {
					return {
						pk_defdoclist: '1001ZZ10000000009031'
					}
				}
			}
		})
	
		//三个子表应该没有删除的行操作列--财务信息、采购信息、供应商银行账户
		let noDelCardTables = ['purchase','finance','supbankacc']
		tableIds.forEach(item => {
			let porCol = {
				itemtype: 'customer',
				attrcode: 'opr',
				label: this.state.json['10140SPF-000019'],/* 国际化处理： 操作*/
				visible: true,
				className:'table-opr',
				width:200,
				fixed:'right',
				render: (text, record, index) => {
					let mainFormStatus = props.form.getFormStatus(this.formId)
					let status = props.cardTable.getStatus(item);
					let areaCode = item == 'finance' ? 'fi-row-action' : 'pur-row-action'
					return status === 'browse' ? (
						<span
							onClick={() => {
								props.cardTable.toggleRowView(item, record)
				
							}}
							> {this.state.json['10140SPF-000038']/* 国际化处理： 展开*/}
						 </span>
					):(<div className="currency-opr-col">
							<span
								className="currency-opr-del"
								onClick={(e) => {
									props.cardTable.openModel(item, 'edit', record, index);
									e.stopPropagation();
								}}
							>{this.state.json['10140SPF-000039']/* 国际化处理： 更多*/}</span>
							&nbsp;&nbsp;
							{noDelCardTables.indexOf(item) >= 0 ? '' : <span
								className="currency-opr-del"
								onClick={(e) => {
									props.cardTable.delRowsByIndex(item, index);
									e.stopPropagation();
								}}
							>{this.state.json['10140SPF-000040']/* 国际化处理： 删除*/}</span>}
						</div>
						);
				}
			};
			meta[item].items.push(porCol);
		})
		return meta;
    }
    
    //切换页面状态
    toggleShow(billStatus = -1,fiStatus = 'browse',purStatus = 'browse', applyType=1, onlyAdd=false){
        let status = this.props.getUrlParam('status');
        let isPortal = this.props.getUrlParam('portal')
        status = status == 'add' || status == 'edit' ? 'edit' : 'browse'

        //为了供应商联查供应商申请单,此处取约定参数决定是否显示所有按钮
        let hideAllButtons= this.props.getUrlParam('hideButton')
        if(hideAllButtons) {
            this.props.button.setButtonVisible(['Add','Edit','Delete','Commit','Callback','Attach','ApprDetail','Bankacc','Save','Cancel','Print','Output','Refresh','AddLinesuplinkman','AddLinesupcountrytaxes', 'ImgView', 'ImgScan'],false)
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }
        // else if(isPortal) {
        //     this.props.button.setButtonVisible(['ImgView', 'ImgScan', 'Refresh','Attach'], true)
        //     this.props.button.setButtonVisible(['Add','Edit','Delete','Commit','Callback','ApprDetail','Bankacc','Save','Cancel','Print','Output','AddLinesuplinkman','AddLinesupcountrytaxes'],false)
        //     this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        //     this.setState({
        //         backVisible: false
        //     })
        // }
        else {
            let visibleAction = []
            let unVisibleAction = []
            if(onlyAdd) {
                visibleAction = ['Add']
                unVisibleAction = ['Edit','Delete','Commit','Callback','Attach','ApprDetail','Bankacc','Save','Cancel','Print','Output','Refresh','AddLinesuplinkman','AddLinesupcountrytaxes', 'ImgView', 'ImgScan']
            }
            else if(status == 'edit' || status == 'add'){
                visibleAction = ['Save','Cancel']
                unVisibleAction = ['Edit','Add','back','Delete','Refresh','Commit','Callback','Bankacc','Attach','ApprDetail','Print','Output', 'ImgView', 'ImgScan']
                if(applyType == 3 || applyType == 4) {
                    unVisibleAction.push('AddLinesuplinkman','AddLinesupcountrytaxes')
                }
                else {
                    visibleAction.push('AddLinesuplinkman','AddLinesupcountrytaxes')
                }
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            }else{
                let disableActionSet = []
                let totalValue = this._constructVisibleButton(billStatus)
                visibleAction = totalValue[0]
                unVisibleAction = totalValue[1]
                disableActionSet = totalValue[2]
                
                this.props.button.setButtonDisabled(disableActionSet)
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            }
            this.props.button.setButtonVisible(visibleAction,true);
            this.props.button.setButtonVisible(unVisibleAction,false);
        }

        //控制form以及子表的可编辑性
        this._controlEditalbe()

        //控制返回按钮的可见性
        this.setState({
            backVisible: status == 'browse' && !hideAllButtons && !isPortal
        })

        //添加浏览器窗口关闭监听事件
        if(status != 'add' && status != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    };

    _constructVisibleButton(billStatus=-1) {
        //根据单据状态设置一下按钮状态
        let visibleAction = []
        let unVisibleAction = []
        let disableActionSet = {}

        if(billStatus == -1) {	//自由态
            visibleAction = ['Add','Edit','Delete','back','Refresh','Commit','Callback','Bankacc','ApprDetail','Attach','Print','Output', 'ImgView', 'ImgScan']
            unVisibleAction = ['Callback', 'ApprDetail', 'Save','Cancel','AddLinesuplinkman','AddLinesupcountrytaxes']
            disableActionSet = {
                Commit: false,
                Edit: false,
                Delete: false,
                Bankacc: false,
                Callback: true,
                ApprDetail: true
            }
        }
        else if(billStatus == 3) {	//提交态
            visibleAction = ['Add','Delete','back','Refresh','Commit','Callback','Attach','Print','Output', 'ImgView', 'ImgScan','ApprDetail']
            unVisibleAction = ['Save','Edit','Cancel','Bankacc','AddLinesuplinkman','AddLinesupcountrytaxes']
            disableActionSet = {
                Commit: true,
                Edit: false,
                Delete: false,
                Bankacc: false,
                Callback: false,
                ApprDetail: false
            }
        }
        else {
            visibleAction = ['Add','back','Refresh','Commit','Callback','ApprDetail','Attach','Print','Output', 'ImgView', 'ImgScan']
            unVisibleAction = ['Edit', 'Delete', 'Bankacc', 'Save','Cancel','AddLinesupcountrytaxes','AddLinesupcountrytaxes']
            disableActionSet = {
                Commit: true,
                Edit: true,
                Delete: true,
                Bankacc: true,
                Callback: true,
                ApprDetail: false
            }
        }

        //特殊处理一下审批通过——收回按钮可用
        if(billStatus == 1 || billStatus == 3) {
            visibleAction.push('Callback')
        }
        else {
            unVisibleAction.push('Callback')
        }
        if(billStatus == 1) {
            disableActionSet.Callback = false
        }

        return [visibleAction, unVisibleAction, disableActionSet]
    }

    _controlEditalbe() {
        let status = this.props.getUrlParam('status');
        //status = status == 'add' || status == 'edit' ? 'edit' : 'browse'
        setTimeout(() => this.props.form.setFormStatus(formId, status),1);
        setTimeout(() => this.props.form.setFormStatus('supplier_baseInfo',status),1)
        tableIds.forEach(item => {
            //财务和采购信息两个子表需要特殊控制--新增态不可编辑
            if(item !== 'finance' && item != 'purchase') {
                this.props.cardTable.setStatus(item, status);
            }
            else {
                if(status == 'add') {
                    this.props.cardTable.toggleCardTable(['purchase','finance'], false)
                }
            }
        })
	}
	
	handleGtxidBillpx = (errParam) => {
		let gtxid = "", billpx="", params={}, billtype="",billpkname="";
		if(errParam) {
			params = JSON.parse(errParam);
			console.log({params, params})
			gtxid = params.saga_gtxid.value || "";
			billpx = params.pk_supplier_pf.value || "";
			billtype = params.pk_billtype.value || "10GY";
			billpkname = "pk_supplier_pf";
		}
		
		this.setState({gtxid,billpx, billtype, billpkname})
	}

	componentDidMount() {
		const errParam = this.props.getUrlParam('errParam') || "";
		this.handleGtxidBillpx(errParam);
		let callback = (json) => {
            this.setState({json}, () => {
				this.initTemplate(this.props, () => {
                    let status = this.props.getUrlParam('status');
                    let vBillStatus = -1
                    if(status != "add"){
                        let pk = this.props.getUrlParam('id')
                        this.getdata(pk, (billStatus) => {
                            this.toggleShow(billStatus)
                            this.updateSpeTableBtnStatus(billStatus,status) 	//更新财务采购两个子表的按钮状态
            
                            //设置一下是否可编辑两个编码
                            let codeedit = this.props.getUrlParam("codeedit")
                            let vbillnumedit = this.props.getUrlParam("vbillnumedit")
                            if(status == 'edit') {
                                this.preShowFAndS = this.state.showFAndS
                                this.setState({
                                    showFAndS: false
                                })
                                this.props.form.setFormItemsDisabled(this.formId,{vbillno: !vbillnumedit})
                                this.props.form.setFormItemsDisabled("supplier_baseInfo",{code: !codeedit})
							}
							
						
                        });
                    }
                    else{
                        ajax({
                            url: addUrl,
                            data:{},
                            success: res => {
                                Utils.filterEmptyData(res.data.supplier_baseInfo.rows[0].values);
                                this.props.form.setAllFormValue({supplier_baseInfo: res.data.supplier_baseInfo})
                                this.updateSpeTableBtnStatus(-1,'edit') 	//更新财务采购两个子表的按钮状态
                                this.props.form.setFormItemsValue(formId, {vbillstatus: {value: '-1', display: this.state.json['10140SPF-000021']}})
                                //this.props.form.setFormItemsValue(this.formId,{'vgoalorg':{value:'0',display: this.state.json['10140SPF-000022']}});/* 国际化处理： 本组织*/
                                this.setState({
                                    showFAndS: false
                                })

                                ajax({
                                    url: queryGroupUrl,
                                    data: {},
                                    success: res => {
                                        this.groupInfo = res.data
                                        if(this.props.getUrlParam('status') == 'add') {
                                            this.props.form.setFormItemsValue(this.formId,{pk_org: {value: this.pfOrg, display: this.pfOrgName}})
                                            this.afterEvent(this.props,this.formId,'pk_org',{value: 'value'})
										}
                                    }
                                })
                            }
                        })
            
                        this.toggleShow(vBillStatus)
                    }
                })
			})
        }
		getMultiLang({moduleId: '10140SPF', domainName: 'uapbd',callback})
	}

	updateSpeTableBtnStatus(vbillstatus = -1,mainFormStatus = 'browse',speTableStatus = {finance: 'browse',purchase: 'browse'}) {
		let speTableIds = ['finance','purchase']
		let speTableBtnPre = ['Finan','Pur']	//财务信息和采购信息按钮前缀
		let speBtnObj = {}

		speTableIds.forEach((item, index) => {
			let tableStatus = speTableStatus[item]
			if(mainFormStatus == 'edit' || mainFormStatus == 'add' || vbillstatus != -1) {
				speBtnObj[`${speTableBtnPre[index]}Edit`] = false
				speBtnObj[`${speTableBtnPre[index]}Save`] = false
				speBtnObj[`${speTableBtnPre[index]}Cancel`] = false
				speBtnObj[`${speTableBtnPre[index]}Refresh`] = false
			}
			else if(tableStatus == 'edit' || tableStatus == 'add') {
				speBtnObj[`${speTableBtnPre[index]}Edit`] = false
				speBtnObj[`${speTableBtnPre[index]}Save`] = true
				speBtnObj[`${speTableBtnPre[index]}Cancel`] = true
				speBtnObj[`${speTableBtnPre[index]}Refresh`] = false
			}
			else {
				speBtnObj[`${speTableBtnPre[index]}Edit`] = true
				speBtnObj[`${speTableBtnPre[index]}Save`] = false
				speBtnObj[`${speTableBtnPre[index]}Cancel`] = false
				speBtnObj[`${speTableBtnPre[index]}Refresh`] = true
			}
		})
		this.props.button.setButtonVisible(speBtnObj);
	}

	setDefaultValue = (orgInfo) => {
		this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display: this.state.json['10140SPF-000021']}});/* 国际化处理： 自由态*/
		//this.props.form.setFormItemsValue(this.formId,{'vgoalorg':{value:'0',display: this.state.json['10140SPF-000022']}});/* 国际化处理： 本组织*/
		if(orgInfo) {
			this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:orgInfo.pk_org,display:orgInfo.orgName}});
			this.afterEvent(this.props,this.formId,'pk_org',{value: orgInfo.pk_org, display: orgInfo.orgName})
		}
	}

	pfProcess(url) {
		let data = null
		let finalData = []
		finalData.push(this.props.getUrlParam('id'))
		if(url == commitUrl) {
			data = {
				pks: finalData,
				content: null
			}
		}
		else {
			data = finalData
		}
		ajax({
			url,
			data: data,
			success: res => {
				if(res && res.data) {
					toast({color: 'danger',content: res.data})
				}
				else {
					let billStatus = this.getdata(this.props.getUrlParam('id'))
					this.toggleShow(billStatus)
					this.updateSpeTableBtnStatus(billStatus,'browse') 	//更新财务采购两个子表的按钮状态
				}
			}
		})
	}

    buttonClick =(props, id)=>{

        let _this = this;
        switch (id) {
		case 'Add':
			let canEdit = true;
			let rejTableIds = ['purchase','finance']
			rejTableIds.forEach(item => {
				if(props.cardTable.getStatus(item) == 'edit') {
					if(canEdit) {
						toast({color:"warning",content: this.state.json['10140SPF-000058']});
					}
					canEdit = false;
				}
			})
			if(!canEdit) {
				return;
            }
            props.form.EmptyAllFormValue(this.formId)
            props.form.EmptyAllFormValue('supplier_baseInfo')
            props.form.setFormStatus(this.formId, 'add')
            props.form.setFormStatus('supplier_baseInfo', 'add')
			setTimeout(() => props.cardTable.setTableData('suplinkman',{rows:[]}),1)
			setTimeout(() => props.cardTable.setTableData('purchase',{rows:[]}),1)
			setTimeout(() => props.cardTable.setTableData('supbankacc',{rows:[]}),1)
			setTimeout(() => props.cardTable.setTableData('supcountrytaxes',{rows:[]}),1)
			setTimeout(() => props.cardTable.setTableData('finance',{rows:[]}),1)
			let pk_org = getDefData('lastPkOrg',dataSource)
            let data= {}
            this.setState({
				showFAndS: false
			}, () => {
                ajax({
                    url: addUrl,
                    data: data,
                    success: res => {
                        Utils.filterEmptyData(res.data.supplier_baseInfo.rows[0].values);
                        this.props.form.setAllFormValue({supplier_baseInfo: res.data.supplier_baseInfo})
                        this.props.form.setItemsVisible(formId, {applyType: false})
                        this.props.form.setFormItemsValue(formId, {vbillstatus: {value: '-1', display: this.state.json['10140SPF-000021']}})
                        this.props.form.setFormItemsValue(this.formId,{pk_org: {value: this.pfOrg, display: this.pfOrgName}})
                        this.afterEvent(this.props,this.formId,'pk_org',{value: 'value'})
                    }
                })
            })
			
			props.pushTo('/card', {
				pagecode:pageId,
				status: 'add'
			})
			this.toggleShow()
			this.updateSpeTableBtnStatus(-1,'edit') 	//更新财务采购两个子表的按钮状态

			this.preShowFAndS = this.state.showFAndS

			//设置下使申请类型字段可编辑
			this.props.form.setFormItemsDisabled(formId, {apply_type: false})
			break;
		case 'Edit':
			let primaryKey = props.getUrlParam('id')
			canEdit = true;
			rejTableIds = ['purchase','finance']
			rejTableIds.forEach(item => {
				if(props.cardTable.getStatus(item) == 'edit') {
					toast({color:"warning",content: this.state.json['10140SPF-000058"']});
					canEdit = false;
				}
			})
			if(!canEdit) {
				return;
			}

			this.props.form.setFormItemsDisabled(formId, {apply_type: true})
			ajax({
				url: checkDataPermUrl,
				data: {pks: [primaryKey]},
				success: (res) => {
					props.pushTo('/card', {
						pagecode:pageId,
						status: 'edit',
						id: props.getUrlParam('id')
					})
					this.toggleShow()
					this.updateSpeTableBtnStatus(-1,'edit') 	//更新财务采购两个子表的按钮状态
		
					//根据返回的数据设置一下两个编码是否可编辑
					if(res.data) {
						this.props.form.setFormItemsDisabled(this.formId,{vbillno: !res.data.vbillnumedit})
						this.props.form.setFormItemsDisabled("supplier_baseInfo",{code: !res.data.codeedit})
					}
					//特殊设置一下返回按钮的可见性
					this.preShowFAndS = this.state.showFAndS
					this.setState({
						showFAndS: false
					})
					this.props.form.setFormItemsDisabled(formId, {update_sup: false})
					//同时设置一下修改供应商字段的参照过滤条件
					let meta = this.props.meta.getMeta()
					let orgValue = this.props.form.getFormItemsValue(formId, 'pk_org')
					meta[formId].items.find(item => item.attrcode == 'update_sup').queryCondition = () => {
						return {
							pk_org: orgValue.value
						}
					}
				}
			})
			break;
		case 'Save':
			this.saveClick(props)
			break;
		case 'Delete':
			//props.modal.show('delete')
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140SPF-000023'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
				content: this.state.json['10140SPF-000024'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140SPF-000010'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140SPF-000011'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.delConfirm.bind(this)   // 确定按钮点击调用函数,非必输
			})
			break
        case 'Back':
            props.pushTo('/list', {
				pagecode:'10140SPF_list',
			})
            break
        case 'Refresh':
            this.getdata(this.props.getUrlParam('id'),(billStatus) => {
				toast({content:this.state.json['10140SPF-000025'],color:'success'});/* 国际化处理： 刷新成功*/
				this.toggleShow(billStatus);
			})
			break
		case 'Commit':
			let tsValue = this.props.form.getFormItemsValue(formId, 'ts')
			let tempPk = this.props.getUrlParam('id')
			let tss = {}
			tss[tempPk] = tsValue.value
			ajax({
				url: commitUrl,
				data: {content: null, pks: [this.props.getUrlParam('id')], tss},
				success: res => {
					if(res.data && res.data.workflow && (res.data.workflow == 'approveflow'|| res.data.workflow == 'workflow')) {
						this.setState({
							compositedata: res.data,
							compositedisplay: true
						});
					}else if(res.data) {
						//提交即通过的时候，如果异常信息不为空，那么提示该异常信息
						toast({color: 'warning',content: res.data})
						return
					}
					else {
						toast({ color: 'success', content: this.state.json['10140SPF-000026'] });/* 国际化处理： 提交成功*/
						this.getdata(this.props.getUrlParam("id"),(billStatus) => {
							this.toggleShow(billStatus)
							this.updateSpeTableBtnStatus(billStatus) 	//更新财务采购两个子表的按钮状态
						})
					}
				}
			})
			break
		case 'Callback':
		  	this.pfProcess(callbackUrl)
			break;
		case 'Cancel':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140SPF-000027'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
				content: this.state.json['10140SPF-000028'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140SPF-000010'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140SPF-000011'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.onCancelSureClick.bind(this)   // 确定按钮点击调用函数,非必输
			})
			break;
		case 'Bankacc':
		    props.modal.show('bankaccList');
			break;
		case 'ApprDetail':
			this.setState({
				showApprInfo: true
			})
			break
		case 'AddLinesuplinkman':
			props.cardTable.addRow('suplinkman')
			break;
		case 'AddLinesupcountrytaxes':
			props.cardTable.addRow('supcountrytaxes')
			break;
		case 'Print':
			this.output('print')
			break;
		case 'Output':
			let pks = [];
			pks.push(this.props.getUrlParam('id'))
			this.setState({
				pks
			},() => {
				this.refs.printOutput.open()
			})
			break;
		case 'Attach':
			this.setState({
				showUploader: true
			})
			break
		case 'FinanEdit':
			if(this.props.cardTable.getStatus('purchase') == 'edit') {
				toast({color: 'warning', content: this.state.json['10140SPF-000059']})
				return;
			}
			this.props.cardTable.setStatus('finance','edit');
			this.updateSpeTableBtnStatus(-1,'browse',{finance: 'edit',purchase: 'browse'}) 	//更新财务采购两个子表的按钮状态
			break
		case 'PurEdit':
			if(this.props.cardTable.getStatus('finance') == 'edit') {
				toast({color: 'warning', content: this.state.json['10140SPF-000060']})
				return;
			}
			this.props.cardTable.setStatus('purchase','edit');
			this.updateSpeTableBtnStatus(-1,'browse',{finance: 'browse',purchase: 'edit'}) 	//更新财务采购两个子表的按钮状态
			break
		case 'FinanSave':
			this.financeSave()
			break
		case 'PurSave':
			this.purSave()
			break
		case 'FinanCancel':
			this.props.cardTable.resetTableData('finance');
			this.props.cardTable.setStatus('finance','browse')
			this.updateSpeTableBtnStatus() 	//更新财务采购两个子表的按钮状态
			break
		case 'PurCancel':
			this.props.cardTable.resetTableData('purchase');
			this.props.cardTable.setStatus('purchase','browse')
			this.updateSpeTableBtnStatus() 	//更新财务采购两个子表的按钮状态
			break
		case 'FinanRefresh':
			this.getdata(this.props.getUrlParam("pk"), null, 'finance');
			break;
		case 'PurRefresh':
			this.getdata(this.props.getUrlParam("pk"), null, 'purchase');
			break;
		case 'ImgView':
			let billdata = this.props.createMasterChildData(pageId, formId, tableIds);
			let openShowbillid = this.props.getUrlParam('id');
			let billInfoMap = {}
			billInfoMap.pk_billid = openShowbillid;
			billInfoMap.pk_billtype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_tradetype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_org = billdata.head.supplierPf.rows[0].values.pk_org.value;
			imageView(billInfoMap, 'iweb');		
			break
		case 'ImgScan':
			billdata = this.props.createMasterChildData(pageId, formId, tableIds);
			openShowbillid = this.props.getUrlParam('id');
			billInfoMap = {}
			billInfoMap.pk_billid = openShowbillid;
			billInfoMap.pk_billtype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_tradetype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.pk_org = billdata.head.supplierPf.rows[0].values.pk_org.value;

			billInfoMap.BillType = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.BillDate = billdata.head.supplierPf.rows[0].values.creationtime.value;
			billInfoMap.Busi_Serial_No = billdata.head.supplierPf.rows[0].values.pk_supplier_pf.value;
			billInfoMap.pk_billtype = billdata.head.supplierPf.rows[0].values.pk_billtype.value;
			billInfoMap.OrgNo = billdata.head.supplierPf.rows[0].values.pk_org.value;
			billInfoMap.BillCode = billdata.head.supplierPf.rows[0].values.vbillno.value;
			billInfoMap.OrgName = billdata.head.supplierPf.rows[0].values.pk_org.display;
			billInfoMap.Cash = '0';
			imageScan(billInfoMap, 'iweb');
			break
        default:
            break
        }
    }
    
    financeSave() {
        let finalData = {}
        let mainFormData = this.props.form.getAllFormValue(this.formId)
        let baseInfoData = this.props.form.getAllFormValue('supplier_baseInfo')
        if(baseInfoData.rows[0].values.hasOwnProperty('status'))
            delete baseInfoData.rows[0].values.status
        finalData.supplierPfVO = mainFormData
        finalData.supplierVO = baseInfoData
        tableIds.forEach(item => {
            finalData[item] = this.props.cardTable.getAllRows(item)
        })
        
        ajax({
            url: updateUrl,
            data: finalData,
            success: (res) => {
                this.props.pushTo('/card', {
					pagecode:pageId,
                    status: 'browse',
                    id: res.data
                })
                this.bankaccConfig.mainPk = res.data
                let vBillStatus = this.getdata(res.data)
                this.updateSpeTableBtnStatus() 	//更新财务采购两个子表的按钮状态
                //特殊设置一下返回按钮的可见性
                this.setState({
                    backVisible: true
                })	
                
                this.props.cardTable.setStatus('finance','browse');
            }
        })
    }

    purSave() {
        let finalData = {}
        let mainFormData = this.props.form.getAllFormValue(this.formId)
        let baseInfoData = this.props.form.getAllFormValue('supplier_baseInfo')
        if(baseInfoData.rows[0].values.hasOwnProperty('status'))
            delete baseInfoData.rows[0].values.status
        finalData.supplierPfVO = mainFormData
        finalData.supplierVO = baseInfoData
        tableIds.forEach(item => {
            finalData[item] = this.props.cardTable.getAllRows(item)
        })
        
        ajax({
            url: updateUrl,
            data: finalData,
            success: (res) => {
                this.props.pushTo('/card', {
					pagecode:pageId,
                    status: 'browse',
                    id: res.data
                })
                this.bankaccConfig.mainPk = res.data
                let vBillStatus = this.getdata(res.data)
                this.updateSpeTableBtnStatus() 	//更新财务采购两个子表的按钮状态
                //特殊设置一下返回按钮的可见性
                this.setState({
                    backVisible: true
                })	
                
                this.props.cardTable.setStatus('purchase','browse');
            }
        })
    }

	onHideUploader = () => {
        this.setState({
            showUploader: false
        })
    }

    beforeUpload(billId, fullPath, file, fileList) {  
		let billStatus = this.props.form.getFormItemsValue(formId,'vbillstatus')
		//停用和启用类型不允许上传附件
		if(this.applyType != '' && this.applyType != 1 && this.applyType != 2) {
			toast({color: 'warning',content: this.state.json['10140SPF-000066']})
			return false
        }
        // if(billStatus.value != -1) {
        //     toast({color: 'warning', content: this.state.json['10140SPF-000067']})
        //     return false
        // }
        return true
        // 备注： return false 不执行上传  return true 执行上传
	}
	
	beforeDelete() {
		if(this.state.applyType != '' && this.state.applyType != 1 && this.state.applyType != 2) {
			return false
		}
		return true
	}

	
	output(type=''){
        let pks = [];
		pks.push(this.props.getUrlParam('id'))
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if(type!=''){
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode:/*this.props.config.funcode*/'10140SPF',     //功能节点编码
                    nodekey:'suppfcard',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
        }
    }
	
    pageInfoClick=(props, pk)=>{
		this.getDataForCache(pk)
    }

	afterEvent(props, moduleId, key,value, oldValue) {
		//新增一段业务逻辑：修改，停启用也走申请单，加了两个字段，申请类型以及修改申请单
		//当修改类型不是新增的时候，显示修改供应商字段，并且加载相应的供应商信息到界面上来
		if(key == 'apply_type') {

			//如果是申请类型有新增改为其他类型，那么需要将原有的供应商基本信息当中的编码退掉
			if((oldValue.value == 1 || oldValue.value == '') && value.value != '' && value.value != 1 && this.supCode) {
				let orgValue = this.props.form.getFormItemsValue('supplier_baseInfo', 'pk_org')
				ajax({
					url: exFieldUrl,
					data: {operation: 'rollbackSupCode', supCode: this.supCode, pk_org: orgValue.value}
				})
			}
			else if((value.value == 1) && oldValue.value  && oldValue.value != 1) {
				//重新切换回新增的时候，重新构建一下新增的数据
				this.props.form.setFormItemsValue(formId, {"vgoalorg": {value: null, display: null}})
				
				let orgValue = this.props.form.getFormItemsValue(formId, 'pk_org')
				//let pk_supplierclass = this.props.form.getAllFormValue('supplier_baseInfo').rows[0].values.pk_supplierclass;
				ajax({
					url: exFieldUrl,
					data: {operation: 'applyTypeAdd', pk_org: orgValue.value},
					success: res => {
						if(res.success && res.data) {
							this.supCode = res.data.supCode
							this.hasSupCode = res.data.hasSupCode
							this.props.form.setAllFormValue({supplier_baseInfo: res.data.baseInfo.supplier_baseInfo})
							this.props.form.setFormItemsValue('supplier_baseInfo', {code: {value:res.data.supCode,display: res.data.supCode}})
							//this.props.form.setFormItemsValue('supplier_baseInfo', {'pk_supplierclass': {value:pk_supplierclass.value,display: pk_supplierclass.display}})
						} 
					}
				})
			}
			if((value.value == 2 || value.value == '') && oldValue.value != '' && oldValue.value != 2){
				this.props.form.setFormItemsValue(formId, {"update_sup": {value: null, display: null}})
			}

			//设置修改供应商字段可见性
			this.props.form.setItemsVisible(formId, 
				{
					"update_sup" : value.value && value.value != 1, 
					"vgoalorg": !value.value || value.value == 1
				}
			)
			this.props.form.setFormItemsDisabled(formId, {
				"update_sup": value.value && value.value == 1
			})
			//设置一下修改供应商以及目的组织两个字段是否必输
			let isUpdateSupEditable = value.value && value.value != 1
			let isVGoalOrgEditable = value.value && value.value == 1
			this.props.form.setFormItemsRequired(formId, {
				"update_sup" : isUpdateSupEditable, 
				"vgoalorg": isVGoalOrgEditable
			})
			if(value.value == 3 || value.value == 4) {
				this.props.form.setFormStatus('supplier_baseInfo', 'browse')
				tableIds.forEach(item => {
					this.props.cardTable.setStatus(item, 'browse')
				})

				//设置一下供应商国家税类和供应商联系人不能新增
				this.props.button.setButtonVisible(['AddLinesuplinkman','AddLinesupcountrytaxes'], false)
			}
			else if(value.value == 1 || value.value == 2){
				this.props.form.setFormStatus('supplier_baseInfo', 'edit')
				let nApplTypeEditTableIds = ['supbankacc','supcountrytaxes','suplinkman']
				nApplTypeEditTableIds.forEach(item => {
					this.props.cardTable.setStatus(item, 'edit')
				})
				this.props.button.setButtonVisible(['AddLinesuplinkman','AddLinesupcountrytaxes'], true)
			}

			//非新增时财务和采购信息子表不能够编辑
			let showFAndS = !value.value || value.value == 1
			this.preShowFAndS = showFAndS
			this.setState({showFAndS, bankCanEdit: value.value != 3 && value.value != 4})
		}
		else if(key == 'update_sup') {
			//加个判定，修改供应商如果为空的话，那么就不请求后台了
			if(value.value == null || value.value == '' || value.value.trim() == '') {
				return
			}
			//获取相关供应商的数据并且展示到界面上
			let requestData = {
				operation: 'updateSupplier',
				pk_supplier: value.value
			}
			ajax({
				url: exFieldUrl,
				data: requestData,
				success: res => {
					if (res.data && res.data.head) {
						let formData = {
							//这儿就不设置SupplierPfVO的数据了，因为从供应商来的数据没有这些数据，这部分应该由客户填写
							"supplier_baseInfo": res.data['supplierBaseInfo']['supplier_baseInfo']
						}
						this.props.form.setAllFormValue(formData)
					}
					if (res.data && res.data.bodys) {
						tableIds.forEach(tableId => {
							let isSet = false
							res.data.bodys.forEach((item, index) => {
								if(item.hasOwnProperty(tableId)) {
									isSet = true
									this.props.cardTable.setTableData(tableId,res.data.bodys[index][tableId])
								}
							})
							if(!isSet) {
								this.props.cardTable.setTableData(tableId,{rows: []})
							}
						})
					}
					else {
						tableIds.forEach((tableId) => {
							this.props.cardTable.setTableData(tableId,{rows: null})
						})
					}
				},
				error: (res) => {
					toast({color: 'dange', content: res.message})
					this.props.form.setFormItemsValue(formId, {update_sup: {value: '', display: ''}})
				}
			})
		}
        let goalOrg = props.form.getFormItemsValue(this.formId,'vgoalorg')
		//所属组织
        let belongedOrg = props.form.getFormItemsValue(this.formId,'pk_org')
		if((key == 'vgoalorg' || key == 'pk_org') && moduleId == 'supplierPf' && value.value && goalOrg.value) {
			if(goalOrg.value == 1) {
				//集团
				belongedOrg = this.groupInfo
			}
			else if(goalOrg.value == 2) {
				belongedOrg = {
					value: 'GLOBLE00000000000000',
					display: this.state.json['10140SPF-000031']/* 国际化处理： 全局*/
				}
			}
			props.form.setFormItemsValue('supplier_baseInfo',{"pk_org": belongedOrg})

			//记录一下上次选择的组织，下次自动带出
			this.lastOrg = value.value
			this.lastOrgName = value.display

			//四个字段需要根据供应商基本信息的pk_org字段进行参照
			let meta = this.props.meta.getMeta()
			let needOrgItems = ['pk_areacl','pk_supplierclass','pk_supplier_main','corcustomer'];
			needOrgItems.forEach(key => {
				let tempItem = meta["supplier_baseInfo"].items.find(item => item.attrcode == key)
				tempItem.queryCondition = () => {
					return {
						pk_org: belongedOrg.value
					}
				}
			})

			//供应商的修改，停启用走申请单 -- 修改供应商字段需要根据组织进行过滤
			if(key == 'pk_org') {
				meta[formId].items.find(item => item.attrcode == 'update_sup').queryCondition = () => {
					return {
						pk_org: belongedOrg.value
					}
				}
			}
			this.props.meta.setMeta(meta)
        }
		if(key == 'pk_org' && moduleId == 'supplierPf') {
            let pk_org = belongedOrg
			setDefData('lastPkOrg',dataSource,pk_org)
			ajax({
				url: exFieldUrl,
				data: {
					pk_org: pk_org.value,
					operation: 'getCode',
					preCode: this.vbillcode
				},
				success: res => {
					//将获取到的单据编码以及相关组织记录到this当中
                    //避免用户将组织或者单据编码删掉之后回退单据编码时出问题
                    let tempMeta = this.props.meta.getMeta()
                    let tempItem = tempMeta["supplierPf"].items.find(item => item.attrcode == 'vbillno')
                    let disabled = tempItem.disabled;

					this.vbillcode = res.data.code
					this.pk_org = pk_org.value
                    this.hasPreCode = res.data.hasPreCode
                    let tempCode = res.data.code ? res.data.code : ''
                    tempCode = res.data.hasAfCode ? '1' : tempCode
                    let billCodeEditable = res.data.editable && !res.data.hasAfCode
                    this.props.form.setFormItemsValue('supplierPf',{vbillno:{value:tempCode,display: res.data.hasAfCode ? ' ' : tempCode}})
					this.props.form.setFormItemsDisabled('supplierPf',{vbillno: !billCodeEditable || disabled})

                    //同时设置一下供应商编码，如果存在供应商编码
                    tempItem = tempMeta["supplier_baseInfo"].items.find(item => item.attrcode == 'code')
                    disabled = tempItem.disabled;
					if(res.data.supCode) {
						this.props.form.setFormItemsValue("supplier_baseInfo",{code: {value:res.data.supCode,display: res.data.supCode}})
						this.props.form.setFormItemsDisabled("supplier_baseInfo",{code: !res.data.codeEditable || disabled})
						if(res.data.hasSupCode) {
							this.supCode = res.data.supCode
							this.hasSupCode = res.data.hasSupCode
						}
					}
				}
					// this.pfOrg = value.value
					// this.pfOrgName = value.refname || value.display
			})
		}
		//根据供应商类型来判定是否能够编辑对应业务单元字段
		else if(key == 'supprop' && moduleId == 'supplier_baseInfo') {
			if(value.value != oldValue.value) {
				if(value.value == 0) {
					this.props.form.setFormItemsDisabled('supplier_baseInfo',{pk_financeorg: true})
					this.props.form.setFormItemsValue('supplier_baseInfo',{pk_financeorg: {value: null, display: null}})
				}
				else {
					this.props.form.setFormItemsDisabled('supplier_baseInfo',{pk_financeorg: false})
				}
			}
		}
	}
	
	getTableHead(tableId) {
		let {createButtonApp} = this.props.button
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons" style={{padding: '0px'}}>
					{createButtonApp({
						area: `${tableId}-action`,//按钮注册中的按钮区域
						onButtonClick: this.buttonClick.bind(this)
					})}
				</div>	
			</div>
		)
	}

	//通过单据id查询单据信息
	getdata = (pk,callback, speTableIds = []) =>{
		let data = {pk};//{pk: "1001A11000000007O0QX"};//
		let retBillStatus = null
		const {gtxid, billpx} = this.state;
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				//特殊子表的刷新操作
				if(res.data && res.data.bodys && speTableIds.length > 0) {
					res.data.bodys.forEach((item, index) => {
						speTableIds.forEach((tableId) => {
							if(item.hasOwnProperty(tableId)) {
								this.props.cardTable.setTableData(tableId,res.data.bodys[index][tableId])
							}
							else {
								this.props.cardTable.setTableData(tableId,{rows: []})
							}
						})
					})

					return
				}

				if(res.data && res.data.head && res.data.head.supplierPf && res.data.head.supplierPf.rows && res.data.head.supplierPf.rows[0].values.saga_status.value){
					// 进入页面就出现提示  可以不写   billpx gtxid 必填參數不然不能顯示追溯
					this.props.socket.showToast({gtxid, billpx});
					const saga_status = res.data.head.supplierPf.rows[0].values.saga_status.value;
					this.props.button.toggleErrorStatus('header-action',{
						isError: saga_status === "1"
					})
				}

				if (res.data && res.data.head) {
					let formData = {
						[this.formId]: res.data.head[this.formId],
						"supplier_baseInfo": res.data['supplierBaseInfo']['supplier_baseInfo']
					}
					this.props.form.setAllFormValue(formData)

					//放入缓存
					updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);

					retBillStatus = res.data.head[formId].rows[0].values.vbillstatus.value

					//特使控制一下是否显示财务信息以及采购信息两个子表的数据
					let applyType = res.data.head[formId].rows[0].values.apply_type.value
                    let showFAndS = applyType != 2 && applyType != 3 && applyType != 4
                    let showOrgOrSup = showFAndS
					if(this.props.getUrlParam('status') == 'edit') {
						showFAndS = false
					}
					//设置一下审批详情组件所需的组件
					//设置是否显示财务和采购两个字表，以及银行账户字表是否显示
					this.preShowFAndS = showFAndS
					this.setState({
                        vbillno: res.data.head[formId].rows[0].values['vbillno'].value,
						billId: res.data.head[formId].rows[0].values[pk_item].value,
						showFAndS: showFAndS,
						applyType: applyType	//在银行账户两个界面当中根据这个字段判定是否允许修改
					})
					//特殊控制一下， 根据申请类型决定显示那些字段
					this.props.form.setItemsVisible(formId, {'vgoalorg': showOrgOrSup, 'update_sup': !showOrgOrSup})

					//特殊设置一下，将申请类型保存下来，方便上传附件的时候做判定
					this.applyType = applyType

					//特殊控制一下，申请类型字段只有在新增的时候能够编辑
					this.props.form.setFormItemsDisabled(formId, {apply_type: true})
				}
				if (res.data && res.data.bodys) {
					res.data.bodys.forEach((item, index) => {
						tableIds.forEach((tableId) => {
							if(item.hasOwnProperty(tableId)) {
								this.props.cardTable.setTableData(tableId,res.data.bodys[index][tableId])
							}
							else {
								this.props.cardTable.setTableData(tableId,{rows: []})
							}
						})
					})

					tableIds.forEach(tableId => {
						let isSet = false
						res.data.bodys.forEach((item, index) => {
							if(item.hasOwnProperty(tableId)) {
								isSet = true
								this.props.cardTable.setTableData(tableId,res.data.bodys[index][tableId])
							}
						})
						if(!isSet) {
							this.props.cardTable.setTableData(tableId,{rows: []})
						}
					})
				}
				else {
					tableIds.forEach((tableId) => {
						this.props.cardTable.setTableData(tableId,{rows: null})
					})
				}

				let dealObj = {
					[formId]: 'form',
					"supplier_baseInfo": 'form'
				}
				tableIds.forEach(id => {
					dealObj.id = 'cardTable'
				})
				if(res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg,dealObj
					)
				}
				if(callback && typeof callback == 'function') {
					callback.call(this, retBillStatus)
				}
			}
		});
	}

	onCardTableAfterEvent(props, moduleId, key,value, changedrows, index, record) {
		if(changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			//重新设置一下专管部门
            if(key == 'pk_resppsn' && moduleId == 'finance') {
                this.props.cardTable.setValByKeyAndIndex(moduleId,index,'pk_respdept',{value: value.values.pk_dept.value,display: value.values.deptname.values});
            }
            else if(key == 'respperson' && moduleId == 'purchase') {
                this.props.cardTable.setValByKeyAndIndex(moduleId,index,'respdept',{value: value.values.pk_dept.value,display: value.values.deptname.values})
            }						
		}
	}

	onCardBeforeEdit(props, moduleId, key, value, index, record, status) {
		//修正一下专管部门和专管业务员的参照的查询条件
        let meta = this.props.meta.getMeta();
        let realModuleId = ''
        if(moduleId == 'finance') {
			realModuleId = status == 'model' ? 'finance_edit' : 'finance'
            meta[realModuleId].items.find(item => item.attrcode == 'pk_respdept').queryCondition = () => {
                return {
                    pk_org: record.values.pk_org.value
                }
            }

            meta['finance'].items.find(item => item.attrcode == 'pk_resppsn').queryCondition = () => {
                let paramObj = {
                    pk_org: record.values.pk_org.value
                }
                if(record && record.values && record.values.pk_respdept && record.values.pk_respdept.value && record.values.pk_respdept.value != '') {
                    paramObj.pk_dept = record.values.pk_respdept.value
                }
                return paramObj;
            }

            meta['finance_edit'].items.find(item => item.attrcode == 'pk_resppsn').queryCondition = () => {
                let paramObj = {
                    pk_org: record.values.pk_org.value
                }
                if(record && record.values && record.values.pk_respdept && record.values.pk_respdept.value && record.values.pk_respdept.value != '') {
                    paramObj.pk_dept = record.values.pk_respdept.value
                }
                return paramObj;
            }
        }

        if(moduleId == 'purchase') {
			realModuleId = status == 'model' ? 'purchase_editform' : 'purchase'
            meta[realModuleId].items.find(item => item.attrcode == 'respdept').queryCondition = () => {
                return {
                    pk_org: record.values.pk_org.value
                }
            }

            meta['purchase'].items.find(item => item.attrcode == 'respperson').queryCondition = () => {
                let paramObj = {
                    pk_org: record.values.pk_org.value
                }
                if(record && record.values && record.values.respdept && record.values.respdept.value && record.values.respdept.value != '') {
                    paramObj.pk_dept = record.values.respdept.value
                }
                return paramObj;
            }

            meta['purchase_editform'].items.find(item => item.attrcode == 'respperson').queryCondition = () => {
                let paramObj = {
                    pk_org: record.values.pk_org.value
                }
                if(record && record.values && record.values.respdept && record.values.respdept.value && record.values.respdept.value != '') {
                    paramObj.pk_dept = record.values.respdept.value
                }
                return paramObj;
            }
        }
        this.props.meta.setMeta(meta)

        return true;
	}
	
	getDataForCache(pk, callback) {
		if(!pk) {
			this.props.form.EmptyAllFormValue(this.formId)
			tableIds.forEach((tableId) => {
				this.props.cardTable.setTableData(tableId, {rows: []})
			})
			return
		}
		
		let cardData = getCacheById(pk, dataSource);
		let vBillStatus = -1
		if(cardData) {
			let formData = {
				[this.formId]: cardData.head[this.formId],
				"supplier_baseInfo": cardData['supplierBaseInfo']['supplier_baseInfo']
			}
			this.props.form.setAllFormValue(formData)
			if (cardData.bodys) {
				tableIds.forEach(tableId => {
					let isSet = false
					cardData.bodys.forEach((item, index) => {
						if(item.hasOwnProperty(tableId)) {
							isSet = true
							setTimeout(() => this.props.cardTable.setTableData(tableId,cardData.bodys[index][tableId]),1)
						}
					})

					if(!isSet) {
						setTimeout(() =>this.props.cardTable.setTableData(tableId,{rows: []}),1)
					}
				})
			}
			else {
				tableIds.forEach((tableId) => {
					this.props.cardTable.setTableData(tableId, {rows: []})
				})
			}
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
			//纠正一下附件管理
			this.setState({
				billId: pk
			})

			//更正一下按钮状态
			vBillStatus = cardData.head[this.formId].rows[0].values.vbillstatus.value
			this.toggleShow(vBillStatus)
			this.updateSpeTableBtnStatus(vBillStatus) 	//更新财务采购两个子表的按钮状态
			this.props.form.setFormItemsDisabled(formId, {apply_type: true})
			//更新一下财务信息和采购信息两个子表的显示问题
			let applyType = cardData.head[this.formId].rows[0].values.apply_type.value
			if(applyType == 2 || applyType == 3 || applyType == 4) {
				this.setState({
					showFAndS: false,
					applyType: applyType
				})
			}
			else {
				this.setState({
					showFAndS: true
				})
			}
		}
		else {
			this.getdata(pk, (billStatus) => {
				//更正一下按钮状态
				this.toggleShow(billStatus)
				this.updateSpeTableBtnStatus(billStatus) 	//更新财务采购两个子表的按钮状态
			})
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
		}

		if(callback && typeof callback == 'function') {
			callback.call(this)
		}
	}

	//保存单据
	saveClick = (props) =>{
		let url = saveUrl;//新增保存
		if (this.props.getUrlParam('status') === 'edit') {
		  url = updateUrl;//修改保存
		}
		let finalData = {}
		let mainFormData = props.form.getAllFormValue(this.formId)
		let baseInfoData = props.form.getAllFormValue('supplier_baseInfo')
		if(baseInfoData.rows[0].values.hasOwnProperty('status'))
			delete baseInfoData.rows[0].values.status
		finalData.supplierPfVO = mainFormData
		finalData.supplierVO = baseInfoData
		tableIds.forEach(item => {
			finalData[item] = props.cardTable.getAllRows(item)
		})

		//加个判定，校验一下供应商表头信息
		if(!this.props.form.isCheckNow(this.formId)) {
			return
		}

		//加个判定修改供应商字段不能为空
		let appType = this.props.form.getFormItemsValue(formId, 'apply_type')
		let updSup = this.props.form.getFormItemsValue(formId, 'update_sup')
		if(appType.value != '' && appType.value != 1 && updSup.value == '') {
			toast({color: 'danger',content: this.state.json['10140SPF-000018'] + ": " + this.state.json['10140SPF-000065']})
			return
		}

		//供应商基本信息校验
		let baseInfoMeta = this.props.meta.getMeta()
		baseInfoMeta = baseInfoMeta.supplier_baseInfo.items
		let emtpyNesItems = []
		baseInfoMeta.forEach(item => {
			if(item.required == true) {
				if(baseInfoData.rows[0].values[item.attrcode].value == null || baseInfoData.rows[0].values[item.attrcode].value == '') {
					emtpyNesItems.push(item.label)
				}
			}
		})

		let afterInsertToastInfo = null
		if(emtpyNesItems.length > 0) {
			afterInsertToastInfo = `${this.state.json['10140SPF-000041']}，${this.state.json['10140SPF-000042']}:\n${this.state.json['10140SPF-000018']}:\n[${emtpyNesItems.join('],[')}]`/* 国际化处理： 供应商基本信息校验失败,详细信息如下,下列字段值不能为空*/
			mainFormData.rows[0].values.meno.value = afterInsertToastInfo
		}
		else {
			// 所有信息都已经录入，清除异常信息字段
			mainFormData.rows[0].values.meno.value = null
		}

		finalData.hasPreSupCode = this.hasSupCode

        if(baseInfoData.rows[0].values.ismobilecoopertive.value) {
			let suplinkmans = finalData.suplinkman;
			let index = true;
            if(suplinkmans && suplinkmans.length > 0){
                for(let suplinkman of suplinkmans){
					if(suplinkman.status != 3){
						index = false;
					}
                    let cell = suplinkman.values['pk_linkman.cell'];
					//当不填手机的值时，cell.value = pk_linkman.value,如果不填display为undefined
                    if(!cell.display){
                       toast({title:this.state.json['10140SPF-000069'],color:'warning'})
                        return; 
                    }
                }
				if(index){
					toast({title:this.state.json['10140SPF-000068'],color:'warning'})
                        return; 
				}
            } else{
                toast({title:this.state.json['10140SPF-000068'],color:'warning'})
                return;
            }
		}

		let tableTypeMap = {}
		tableIds.forEach(id => {
			tableTypeMap.id = 'cardTable'
		})
		let CardData = this.props.createMasterChildData(pageId, this.formId, tableIds);
		let supplierBaseInfo = this.props.form.getAllFormValue("supplier_baseInfo")
		supplierBaseInfo["areacode"] = 'supplier_baseInfo'
		this.props.validateToSave( {
			model : supplierBaseInfo,
			pageid : pageId,
		}, () => {
			this.props.validateToSave(CardData, () => {
				ajax({
					url: url,
					data: finalData,
					success: (res) => {
						props.pushTo('/card', {
							pagecode:pageId,
							status: 'browse',
							id: res.data
						})
						if(url == saveUrl) {
							addCache(res.data,res.data,this.formId,dataSource,res.data)
						}
						this.bankaccConfig.mainPk = res.data
						let vBillStatus = this.getdata(res.data)
						this.toggleShow(vBillStatus,'browse','browse')
						this.updateSpeTableBtnStatus(vBillStatus) 	//更新财务采购两个子表的按钮状态
						this.setState({
							showFAndS: this.preShowFAndS
						})	
						
						//业务参数设置当中允许违反规则校验并且必输项未填的话，成功保存之后需要在界面上展示一下提示信息
						if(afterInsertToastInfo) {
							toast({color: 'warning',content: afterInsertToastInfo})
						}
						else {
							toast({color: 'success',title: this.state.json['10140SPF-000032']})/* 国际化处理： 保存成功！*/
						}
	
						//清除有关于供应商基本信息编码的信息
						this.supCode = null
						this.hasSupCode = false
					}
				})
			}, tableTypeMap, 'extcard')
		}, {"supplier_baseInfo":'form'}, 'form')
		

	  }

	onCancelSureClick() {
		let status = this.props.getUrlParam('status');
		if(status == 'add') {
			if(this.vbillcode != null && this.hasPreCode) {
				ajax({
					url: exFieldUrl,
					data: {
						operation: "cancelCode",
						pk_org: this.pk_org,
						billCode: this.vbillcode,
						supCode: this.supCode
					},
					success: res => {
						this.billCode = null
						this.supCode = null	
					}
				})
			}
		}
		if (this.props.getUrlParam('status') === 'add') {
			let pk = getCurrentLastId(dataSource);
			if(pk) {
				this.props.pushTo("/card",{
					pagecode:pageId,
					status: 'browse',
					id: pk
				})
				this.getDataForCache(pk)
			}
			else {
                window.onbeforeunload = null;	//特殊修正一下：列表无数据新增，取消返回列表，然后点击关闭会有关闭提示
                //清空所有数据
                this.props.form.EmptyAllFormValue(formId)
                this.props.form.EmptyAllFormValue("suplier_baseInfo")
                tableIds.forEach(id => {
                    this.props.cardTable.setTableData(id, {rows: []})
                })
                this.props.setUrlParam({'status': 'browse'})
                setTimeout(() => this.props.form.setFormStatus(formId, 'browse'),1)
                setTimeout(() => this.props.form.setFormStatus("suplier_baseInfo", 'browse'),1)
                setTimeout(() => {
                    tableIds.forEach(id => {
                        this.props.cardTable.setStatus(id, 'browse')
                    })
                },1)
                this.toggleShow(-1, true ,true, 1, true) //只显示新增按钮
			}
			this.supCode = null
			this.hasSupCode = false
		}
		else if ((this.props.getUrlParam('status') === 'edit')) {
			this.props.form.cancel([this.formId,'supplier_baseInfo'])
			tableIds.forEach(item => {
				this.props.cardTable.resetTableData(item)
			})
			this.props.pushTo('/card', {
				pagecode:pageId,
				status: 'browse',
				id: this.props.getUrlParam('id')
			})
			this.toggleShow(-1,true,true);
			this.updateSpeTableBtnStatus(-1) 	//更新财务采购两个子表的按钮状态
		}

		this.props.form.setFormItemsDisabled(formId, {update_sup: true})
	}

	//删除单据
	delConfirm = () => {
		let primaryKeys = []
		primaryKeys.push(this.props.getUrlParam('id'))
		ajax({
			url: deleteUrl,
			data: {primaryKeys: primaryKeys},
			success: res => {
				let id = this.props.getUrlParam("id");
				let nextId = getNextId(id, dataSource);
				deleteCacheById(pk_item,id,dataSource);
				this.getDataForCache(nextId,() => {
					toast({color: 'success',title:this.state.json['10140SPF-000033']})/* 国际化处理： 删除成功！*/
				})
			}
		})
	};

	modelSave = (props)=>{
		props.cardTable.closeModel(this.tableId);
		this.saveClick(props);
	}

	showApprove() {
		this.setState({
			showApprove: true
		})
	}

	closeApprove() {
		this.setState({
			showApprove: false
		})
	}

	bankaccClick(props,id) {
		switch(id) {
			case 'BankAdd':
				this.setState({
					isList: false
				})
				break;
		}
	}

	bankaccModalChange(info) {
		let isList = info.isList
		delete info.isList
		if(isList) {
			this.bankaccConfig = {
				tableId: 'supbank',
				formId1: 'accbasinfo',
				formId2: 'netbankinfo',
				cardTableId: 'bankaccsub',
				mainPk : this.props.getUrlParam('id'),
				bankaccModalChange: this.bankaccModalChange.bind(this),
				bankaccModalClose: this.bankaccModalClose.bind(this),
				...info
			}
			this.props.modal.close('bankaccList')
			this.props.modal.show('bankaccForm')
		}
		else {
			this.bankaccConfig = {
				tableId: 'supbank',
				formId1: 'accbasinfo',
				formId2: 'netbankinfo',
				cardTableId: 'bankaccsub',
				mainPk : this.props.getUrlParam('id'),
				bankaccModalClose: this.bankaccModalClose.bind(this),
				bankaccModalChange: this.bankaccModalChange.bind(this)
			}
			this.props.modal.close('bankaccForm')
			this.props.modal.show('bankaccList')
		}
		
	}

	bankaccModalClose() {
		this.getdata(this.props.getUrlParam('id'))
	}

	suplinkmanClose(props) {
		let allRows = props.cardTable.getAllRows('suplinkman')
		allRows.forEach(item => {
			if(item.status == 2) {
				item.values.forEach(value => {
					value.display = value.value
				})
			}
		})
	}

	onLinkmanBeforeEvent(props, moduleId, key, value, index, record, status) {
		let meta = props.meta.getMeta()
		if(status == 'model') {
			moduleId = 'suplinkman_edit_form'
		}
		if(record.values.pk_linkman.value) {
			this.editLinkmanPk = record.values.pk_linkman.value
			meta[moduleId].items.find(item => item.attrcode == 'pk_linkman.name').queryCondition = () => {
				return {
					pk_linkman: record.values.pk_linkman.value
				}
			}
		}
		else {
			meta[moduleId].items.find(item => item.attrcode == 'pk_linkman.name').queryCondition = () => {
				return {}
			}
			this.editLinkmanPk = null
		}
		this.linkmanIndex = index
		meta[moduleId].items.find(item => item.attrcode == 'pk_linkman.name').onAfterEdit = this.onLinkmanAfterEdit.bind(this)
		return true
	}

	/**
	 * 根据联系人参照返回的数据构建供应商了联系人表格的行数据，并更新到表格上
	 * 
	 * @param {*} savedData 
	 */
	onLinkmanAfterEdit(savedData) {
		let allShowKeys = ['name','sex','vjob','phone','cell']
		let allRows = this.props.cardTable.getAllRows('suplinkman')
		let pk_linkman = savedData.linkmanRefer.rows[0].values.pk_linkman.value
		allRows.forEach((item, index) => {
			let itemPkLinkman = item.values.pk_linkman.value
			if(itemPkLinkman == pk_linkman || ((itemPkLinkman == null || itemPkLinkman == '') && index == this.linkmanIndex)) {
				allShowKeys.forEach((key) => {
					//性别需要进行一下特殊处理
					if(key == 'sex') {
						item.values[`pk_linkman.${key}`].value = savedData.linkmanRefer.rows[0].values[key].value
						if(savedData.linkmanRefer.rows[0].values[key].value) {
							item.values[`pk_linkman.${key}`].display = savedData.linkmanRefer.rows[0].values[key].value == 1 ? this.state.json['10140SPF-000034'] : this.state.json['10140SPF-000035']/* 国际化处理： 男,女*/
						}
					}
					else {
						item.values[`pk_linkman.${key}`].value = pk_linkman
						item.values[`pk_linkman.${key}`].display = savedData.linkmanRefer.rows[0].values[key].value
						//下面这段代码是为了修正一个奇怪的问题：如果不把isEdit删掉的话，那么列表界面上联系人字段出不来
						if(key == 'name') {
							delete item.values[`pk_linkman.${key}`].isEdit
						}
					}
				})
				item.values.pk_linkman.value = pk_linkman
			}
		})
		
		this.props.cardTable.setTableData('suplinkman',{rows: allRows})
	}

	cardTableDoubleClick(props, record, index) {
		let currStatus = props.form.getFormStatus(this.formId)
		if(currStatus == 'edit') {
			let pk = record.values.pk_linkman.value
			ajax({
				url: queryLinkmanUrl,
				data: {pk},
				success: res => {
					props.modal.show('linkman')
					props.form.setAllFormValue({SPFLinkman: res.data.SPFLinkman})
					props.form.setFormStatus('SPFLinkman','edit')
				}
			})
		}
	}

	linkmanSaveClick() {
		let linkmanData = this.props.form.getAllFormValue('SPFLinkman')
		let finalData = {
			model: linkmanData
		}
		let allOtherKeys = ['pk_suplinkman','pk_linkman','opr','isdefault','ts','def1','def2','def3','def4','def5','def6','def7','def8','def9','def10']
		let allShowKeys = ['name','sex','vjob','phone','cell']
		let allRows = this.props.cardTable.getAllRows('suplinkman')
		ajax({
			url: saveLinkmanUrl,
			data: finalData,
			success: res => {
				let addResult = false
				let pk_linkman = res.data
				allRows.forEach(item => {
					if(item.values.pk_linkman.value == pk_linkman) {
						allShowKeys.forEach(key => {
							item.values[`pk_linkman.${key}`].display = linkmanData.rows[0].values[key].value
						})
						item.values.pk_linkman.value = pk_linkman
						addResult = true
					}
				})
				if(!addResult) {
					let value = {}
					allShowKeys.forEach(key => {
						value[`pk_linkman.${key}`] = {
							value: linkmanData.rows[0].values[key].value,
							display: linkmanData.rows[0].values[key].value
						}
						if(key == 'sex') {
							let sexValue = linkmanData.rows[0].values[key].value
							value[`pk_linkman.${key}`].display = sexValue && sexValue == '1' ? this.state.json['10140SPF-000034'] : this.state.json['10140SPF-000035']/* 国际化处理： 男,女*/
						}
					})
					value.pk_linkman = {
						value: pk_linkman,
						display: pk_linkman
					}
 					let newRow = {
						rowid:pk_linkman,
						status: 2,
						values: value
					}
					allRows.push(newRow)
				}
				this.props.cardTable.setTableData('suplinkman',{rows: allRows})
			}
		})
		
	}

	getAssginUsedr = (value) => {
		ajax({
			url: commitUrl,
			data: {content: value,pks:[this.props.getUrlParam('id')]},
			success: res => {
				if(res.data && res.data.workflow && (res.data.workflow == 'approveflow'|| res.data.workflow == 'workflow')) {
					this.setState({
                        compositedata: res.data,
                        compositedisplay: true
                    });
				}
				else {
					this.setState({
						compositedata: null,
						compositedisplay: false
					});
					toast({ color: 'success', content: this.state.json['10140SPF-000026'] });/* 国际化处理： 提交成功*/
					this.getdata(this.props.getUrlParam('id'),(billStatus) => {
						this.toggleShow(billStatus)
					})
				}
			}
		})
    }

	onApprTransClose() {
        this.setState({
            compositedata:null,
            compositedisplay: false
        });
	}
	
	closeApprDetail = () =>{
        this.setState({
            showApprInfo: false
        })
	}

	socketMesg = (props, mesg) => {
		this.props.button.toggleErrorStatus('header-action',{
			isError: mesg.error === "1"
		})
		// if(mesg.error){
		// 	//出错时，控制业务按钮显示
	
		// }else{
		// 	//成功时，显示原来的浏览态按钮
	
		// }	
	}

	render() {
		let { cardTable, form, button, modal, cardPagination,BillHeadInfo, socket } = this.props;
		const {createCardPagination} = cardPagination;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		const {createBillHeadInfo} = BillHeadInfo;
		const {gtxid,billpx, billtype, billpkname} = this.state;
		let status = this.props.getUrlParam('status');
		console.log(gtxid,billpx,  billtype, billpkname)
		let iconItem = this.state.showBaseInfo ? 'icon-jiantouxia1' : 'icon-jiantouyou'

		let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"

		let FAndSElement = []
		if(this.state.showFAndS) {
			FAndSElement.push(
				<NCScrollLink
					to={'finance'}
					spy={true}
					smooth={true}
					duration={300}
					offset={-100}
					style = {{display: this.state.showFAndS ? 'block' : 'none'}}
				>
					<p style = {{display: this.state.showFAndS ? 'block' : 'none'}}>{this.state.json ? this.state.json['10140SPF-000003'] : '10140SPF-000003'/* 国际化处理： 财务信息*/}</p>
				</NCScrollLink>
			)
			FAndSElement.push(
				<NCScrollLink
					to={'purchase'}
					spy={true}
					smooth={true}
					duration={300}
					offset={-100}
					style = {{display: this.state.showFAndS ? 'block' : 'none'}}
				>
					<p style = {{display: this.state.showFAndS ? 'block' : 'none'}}>{this.state.json ? this.state.json['10140SPF-000004'] : '10140SPF-000004'/* 国际化处理： 采购信息*/}</p>
				</NCScrollLink>
			)
		}

		//联系人form
		return (
				<div className="nc-bill-extCard">
					{socket.connectMesg({
						headBtnAreaCode: "header-action",//"按钮区域编码", // 用于平台内部更新按钮状态
						formAreaCode: "supplierPf",//this.formId,//'supplier_baseInfo',//"表单区域编码", //用于平台内部更新表头数据
						onMessage: this.socketMesg, //监听消息
						// isShowView: true, // 显示立即查看按钮
						billtype: "10GY", //用于查询追溯
						billpkname: "pk_supplier_pf", //用于查询追溯
						dataSource: dataSource,//'缓存cardCache使用的pk', 
						// 本地前端调试，请传ip和端口
						// 打包到测试环境之前 去掉
						// serverLocation: "http://10.11.115.10:80"
					})}

					<div className="nc-bill-top-area">
						<NCAffix>
							<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
								

								<NCBackBtn className='title-search-detail' style={{'line-height':'32px',display: this.state.backVisible ? 'inline' : 'none'}}
											onClick={ this.buttonClick.bind(this,this.props,'Back') }></NCBackBtn>
								<div className='header-title-search-area'>
                                    {/* {createPageIcon()}
									<h2 className='title-search-detail'>{this.state.json ? this.state.json['10140SPF-000043'] : '10140SPF-000043' 国际化处理： 供应商申请单}{status=='browse'?`：${this.state.title_code}`:''}</h2> */}
									{createBillHeadInfo({
										title :this.state.json ? this.state.json['10140SPF-000043'] : '10140SPF-000043',
										initShowBackBtn:false
                   					})}
								</div>
								<div className="header-button-area">
									{button.createErrorFlag( {
										headBtnAreaCode: "header-action"//"按钮区域编码"
									})}
									{createButtonApp({
										area: 'header-action',//按钮注册中的按钮区域
										//buttonLimit: 5, 
										onButtonClick: this.buttonClick.bind(this) 
										//popContainer: document.querySelector('.header-button-area')
									})}
									{createCardPagination({
										handlePageInfoChange: this.pageInfoClick.bind(this),
										dataSource: dataSource
									})}
								</div>
							</NCDiv>
						</NCAffix>

						<NCAnchor>
							<NCScrollLink
								to={this.formId}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json ? this.state.json['10140SPF-000002'] : '10140SPF-000002'/* 国际化处理： 供应商信息*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'supbankacc'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json ? this.state.json['10140SPF-000005'] : '10140SPF-000005'/* 国际化处理： 供应商银行账户*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'suplinkman'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json ? this.state.json['10140SPF-000006'] : '10140SPF-000006'/* 国际化处理： 供应商联系人*/}</p>
							</NCScrollLink>
							<NCScrollLink
								to={'supcountrytaxes'}
								spy={true}
								smooth={true}
								duration={300}
								offset={-100}
							>
								<p>{this.state.json ? this.state.json['10140SPF-000007'] : '10140SPF-000007'/* 国际化处理： 供应商国家税类*/}</p>
							</NCScrollLink>
							{FAndSElement}
						</NCAnchor>
						<NCScrollElement name={this.formId}>
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									onAfterEvent: this.afterEvent.bind(this),
									setVisibleByForm:true
								})}
							</div>
						</NCScrollElement>

						<NCScrollElement name={this.state.json ? this.state.json['10140SPF-000000'] : '10140SPF-000000'/* 国际化处理： 供应商基本信息*/}>
							<div className="nc-bill-form-area">
								<div className='group-form-wrapper'>
									<NCDiv fieldid="supplierbaseinfo" areaCode={NCDiv.config.Group} className="group-form-name">
										<span
											className={`toggle-form-icon iconfont ${iconItem}`}
											onClick={() => {
												let show = !this.state.showBaseInfo
												this.setState({
													showBaseInfo: show
												});
											}}
										/>
										<span className="name">{this.state.json ? this.state.json['10140SPF-000000'] : '10140SPF-000000'/* 国际化处理： 供应商基本信息*/}</span>
									</NCDiv>
									<div className={`group-form-item ${groupItem} `}>
										{createForm('supplier_baseInfo', {
											onAfterEvent: this.afterEvent.bind(this)
										})}
									</div>
								</div>
							</div>
						</NCScrollElement>
					</div>
					<div className="nc-bill-bottom-area">
						<NCScrollElement name={'supbankacc'}>
							<div className="nc-bill-tableTab-area">
								{createCardTable("supbankacc", {
									
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name={'suplinkman'}>
							<div className="nc-bill-tableTab-area">
								{createCardTable("suplinkman", {
									tableHead: this.getTableHead.bind(this,'suplinkman'),
									onBeforeEvent: this.onLinkmanBeforeEvent.bind(this),
									//onRowDoubleClick: this.cardTableDoubleClick.bind(this),
									modelClose: this.suplinkmanClose.bind(this),
									modelSave: () => {
										this.props.cardTable.closeModel('suplinkman')
										this.saveClick(this.props)
									}
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name={'supcountrytaxes'}>
							<div className="nc-bill-tableTab-area">
								{createCardTable("supcountrytaxes", {
                                    tableHead: this.getTableHead.bind(this,'supcountrytaxes'),
                                    modelSave: () => {
										this.props.cardTable.closeModel('supcountrytaxes')
										this.saveClick(this.props)
									}
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name={'finance'} style = {{display: this.state.showFAndS ? 'block' : 'none'}}>
							<div className="nc-bill-tableTab-area">
								{createCardTable("finance", {
									tableHead: this.getTableHead.bind(this,'finance'),
									onBeforeEvent: this.onCardBeforeEdit.bind(this),
									onAfterEvent: this.onCardTableAfterEvent.bind(this),
									hideAdd: true,
                                    hideDel: true,
                                    modelSave: () => {
										this.props.cardTable.closeModel('finance')
										this.financeSave()
									}
								})}
							</div>
						</NCScrollElement>
						<NCScrollElement name={'purchase'} style = {{display: this.state.showFAndS ? 'block' : 'none'}}>
							<div className="nc-bill-tableTab-area">
								{createCardTable("purchase", {
									tableHead: this.getTableHead.bind(this,'purchase'),
									onBeforeEvent: this.onCardBeforeEdit.bind(this),
									onAfterEvent: this.onCardTableAfterEvent.bind(this),
									hideAdd: true,
                                    hideDel: true,
                                    modelSave: () => {
										this.props.cardTable.closeModel('purchase')
										this.purSave(this.props)
									}
								})}
							</div>
						</NCScrollElement>
					</div>

					{
						//一个奇怪的bug导致了需要写下面一行代码：银行账户弹出的form当中用到了一个地区代码的自定义档案参照
						//但是这个自定义档案的参照会导致模态框报错，必须首先创建一遍问题form,然后模态框才能正常工作。
					}
					<div style={{display: "none"}}>
						{createForm('netbankinfo',{})}
					</div>

					{createModal('delete', {
						title: this.state.json ? this.state.json['10140SPF-000023'] : '10140SPF-000023',/* 国际化处理： 注意*/
						content: this.state.json ? this.state.json['10140SPF-000024'] : '10140SPF-000024',/* 国际化处理： 确认删除？*/
						beSureBtnClick: this.delConfirm
					})}
					{createBankaccList(Object.assign({json: this.state.json, applyType: this.state.applyType}, this.props),this.bankaccConfig)}
					{createBankaccForm(Object.assign({json: this.state.json, applyType: this.state.applyType}, this.props),this.bankaccConfig)}
					{createModal('linkman',{
						title: this.state.json ? this.state.json['10140SPF-000036'] : '10140SPF-000036',/* 国际化处理： 联系人*/
						content: (createForm('SPFLinkman',{

						})),
						beSureBtnClick: this.linkmanSaveClick.bind(this)
					})}

					{this.state.showUploader && <NCUploader 
						billId={"uapbd/d6be4596-55a6-4476-9b1d-cb770c03bfdd/" + this.state.billId}
						billNo={this.state.vbillno}
						placement={'bottom'}
						onHide={this.onHideUploader}
						beforeUpload={this.beforeUpload.bind(this)}
						beforeDelete={this.beforeDelete.bind(this)} 
						/>
					}
					
					<PrintOutput
						ref='printOutput'c
						url={printUrl}
						data={{
							funcode: '10140SPF',
							oids: this.state.pks,
							nodekey: 'suppfcard',
							outputType: 'output'
						}}
					/>

					{createModal('cancel',{
						title: this.state.json ? this.state.json['10140SPF-000027'] : '10140SPF-000027',/* 国际化处理： 确认取消*/
						content: this.state.json ? this.state.json['10140SPF-000028'] : '10140SPF-000028',/* 国际化处理： 是否确认要取消？*/
						beSureBtnClick: this.onCancelSureClick.bind(this)
					})}

					{/* 指派组件 */}
					{this.state.compositedisplay ? <ApprovalTrans
						title={this.state.json ? this.state.json['10140SPF-000037'] : '10140SPF-000037'/* 国际化处理： 指派*/}
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr.bind(this)}
						cancel={this.onApprTransClose.bind(this)}
					/> : ""}

					{/* 审批详情组件 */}
					<ApproveDetail
						show={this.state.showApprInfo}
						close={this.closeApprDetail.bind(this)}
						billtype='10GY'
						billid={this.state.billId}
					/>

				</div>
			
		);
	}
}

Card = createPage({
	billinfo:[
		{
			billtype: 'form',
        	pagecode: '10140SPF_card',
        	headcode: "supplier_baseInfo"
		}, {
			billtype: "extcard",
			pagecode: '10140SPF_card',
			headcode: formId,
			bodycode: tableIds
		}
	],
	initTemplate: []
})(Card);

export default Card

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65