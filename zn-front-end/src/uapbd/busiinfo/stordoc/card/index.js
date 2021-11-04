//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools, print, high, cardCache,promptBox ,createPageIcon } from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import utils from '../../../public/utils';
const {showFormular } = utils;
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;
const {PrintOutput} = high;
const { NCDiv } = base;
const { setDefData,getDefData,addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;

/****************默认参数  开始***********************/
let urls={
	queryCardUrl:'/nccloud/uapbd/stordoc/StordocCardQuery.do',
	addUrl:'',
	cardEnableUrl:'/nccloud/uapbd/stordoc/StordocCardEnable.do',
	cardDisableUrl:'/nccloud/uapbd/stordoc/StordocCardDisable.do',
	saveUrl:'/nccloud/uapbd/stordoc/StordocCardSave.do',
	listDelUrl:'/nccloud/uapbd/stordoc/StordocListDelete.do',
	updateUrl:'/nccloud/uapbd/stordoc/StordocCardUpdate.do',
	printUrl: '/nccloud/uapbd/stordoc/printStordoc.do',
	extendFieldUrl: '/nccloud/uapbd/stordoc/extfieldAction.do',
	checkModelUrl:'/nccloud/uapbd/stordoc/StordocCheckDataModel.do',//这个用来检查数据权限
	checkOrgUrl:'/nccloud/uapbd/stordoc/OrgCheckAction.do'//检查是否是库存组织
};

let templateElements={
	pageId:'10140WARH_card',
	tableId:'agentstores',
	formId:'stordoc',
	searchId :'search',
	appid:'0001Z010000000000LN4',//按钮注册中的关联appid
	linkItem:'code',//仓库编码
	pk_item:'pk_stordoc',
	pk_org:'pk_org',
	title_code:'code',
};

let dataSource = 'upabd.busiinfo.stordoc.data'

/***************默认参数  结束********************/

//为了应对createUIDom和getdata两个异步调用以及设置表单组件可用性的问题，特此设置这个同步变量
let metaAndDataCount = 0
let disabledValueSetGlb = null
let requeiredItemsSetGlb = null
let mainOrg = undefined;

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = templateElements.formId;
		this.searchId = templateElements.searchId;
        this.tableId = templateElements.tableId;
		this.state = {
			pk_org : '',
			title_code : '',
			totalcount : 0,
			applycount : 0,
			pks: [],
			backVisible: true,
			json:{},
			inlt:null,
		}
		this.initTemplate(this.props);
	}

	 initTemplate(props){
		createUIDom(props)(
			{
				pagecode: templateElements.pageId//页面id
				//appid: templateElements.appid,//注册按钮的id
			},
			{
				moduleId: "10140WARH",domainName: 'uapbd'
			},
			(data,langData,inlt)=>{
				if(langData){
					this.state.json = langData
					if(inlt){
						this.state.inlt = inlt
					}
				}				
				if(data){
					if(data.template){
						console.log(`refresh data : ${metaAndDataCount}`)
						let meta = data.template;
						this.modifierMeta(props, meta)
						props.meta.setMeta(meta,() => {
							metaAndDataCount++;
							if(metaAndDataCount == 2) {
								console.log(`createUIDom finished ${metaAndDataCount}`)
								
								props.form.setFormItemsDisabled(templateElements.formId, disabledValueSetGlb)
								props.form.setFormItemsRequired(templateElements.formId, requeiredItemsSetGlb)
							}
							this.toggleShow()
						});
	
					}
					if(data.button){
						let button = data.button;
						props.button.setButtons(button);
						this.toggleShow();
					}
					let ccontext = data.context || {};
					if(ccontext.pk_org){

						ajax({
							url:urls.checkOrgUrl,
							data:{"mainorg":ccontext.pk_org},
							success:(res)=>{
								console.log(res);
								if(res.success && "Y" ==res.data){
									mainOrg = {
										pk_org:ccontext.pk_org,
										org_name: ccontext.org_Name,
									}
									let status = this.props.getUrlParam('status');
									if(status == 'add'){
										let seteddata = { pk_org: {value: mainOrg.pk_org,display: mainOrg.org_name}};
										props.form.setFormItemsValue(this.formId,seteddata)
									}
								}
							}
						});



					}
				}   
			}
		)
	}
	
	modifierMeta(props, meta) {
		let cthis = this;
		let status = props.getUrlParam('status');
		meta[templateElements.formId].status = status;
		meta[templateElements.tableId].status = status;
		/*
		let pkOrgField = meta[templateElements.formId].items.find(item => item.attrcode == 'pk_org')
		pkOrgField.isMultiSelectedEnabled = false
		pkOrgField.queryCondition = () => {
			return {
				GridRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
			}
		}
		*/
	
		
		let porCol = {
			attrcode: 'opr',
			label: cthis.state.json['10140WARH-000000'],/* 国际化处理： 操作*/
			visible: true,
			className:'table-opr',
			width:200,
			fixed:'right',
			itemtype: 'customer',
			render(text, record, index) {
				let status = props.cardTable.getStatus(templateElements.tableId);
				return status === 'browse' ? (
					// <span
					// 	onClick={() => {
					//         props.cardTable.toggleRowView(templateElements.tableId, record)
			
					//     }}
					//     > {languageRes.expand}
					 // </span>
					 ''
				):(<div className="currency-opr-col">
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.openModel(templateElements.tableId, 'edit', record, index);
								e.stopPropagation();
							}}
						>{cthis.state.json['10140WARH-000001']}</span>{/* 国际化处理： 展开*/}
						&nbsp;&nbsp;
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.delRowsByIndex(templateElements.tableId, index);
								e.stopPropagation();
							}}
						>{cthis.state.json['10140WARH-000002']}</span>{/* 国际化处理： 删除*/}
					</div>
		);
			}
		};
		meta[templateElements.tableId].items.push(porCol);
	
		return meta;
	}
	
	componentDidUpdate(){//fix--增加编辑态离开按钮提醒20180925 added  by liusenc 
		//form如果是编辑态，关闭浏览器需要给你提示
		let formstatus = this.props.form.getFormStatus(this.formId);
	
		
		if((formstatus == undefined || formstatus == 'browse')){
			window.onbeforeunload = null;
		}else{
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
				};
		}
	}
	
	componentDidMount() {
		let status = this.props.getUrlParam('status');
		if(status != 'add') {
			this.toggleShow();
		}
		if(status == "browse" || status == 'edit'){
			let	pk = this.props.getUrlParam('id');
			let org = this.props.getUrlParam('org');
			if(pk && pk != 'undefined'){
				this.getdata(pk,org);
			}
			if(status == 'edit') {
				this.setState({backVisible: false})
			}
		}
		else if(status == 'copy') {
			let	pk = this.props.getUrlParam('id');
			let org = this.props.getUrlParam('org');
			if(pk && pk != 'undefined'){
				this.getdata(pk, org, () => {
					this.props.pushTo('/card', {
						pagecode:'10140WARH_card',
						status: 'add'
					  })
					this.setState({backVisible: false})
				}, true);
			}
		} else {
			setTimeout(()=>{
				this.setDefaultValue()
				this.setState({backVisible: false})
			},1000);//因为单据模板中改的数据可能还没有返回，因此setDefaultValue中的函数拿不到默认设置的库存组织；

		}	
	}

	componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(templateElements.formId);
        if(formStatus != 'add' && formStatus != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }


	componentWillUnmount() {
		//单页应用方案之后，需要每次返回列表界面时重置一下metaAndDataCount，否则下次打开节点disabledValueSetGlb为空
		//会导致报错
		metaAndDataCount = 0
    }
    
    toggleShow(enableState = 2){
        let status = this.props.getUrlParam('status');
        status = status == 'copy' ? 'add' : status
        let id = this.props.getUrlParam('id')
        //按钮的显示状态
        if(status == 'browse' && id == 'null') {
            let visibleButtons = ['addAction']
            let unVisibleButtons = ['editAction','deleteAction','backAction','SaveAdd','refreshAction','Copy','Print','Output','Refresh','enableAction','disableAction', 'saveAction','cancelAction','addline','delline','addLineAction','insertLineAction']
            this.props.button.setButtonVisible(unVisibleButtons,false);
            this.props.button.setButtonVisible(visibleButtons,true);
        }
        else if(status == 'edit' || status == 'add'){
            this.props.button.setButtonVisible(['addAction','editAction','deleteAction','backAction','refreshAction','Copy','Print','Output','Refresh','enableAction','disableAction'],false);
            this.props.button.setButtonVisible(['saveAction','cancelAction','addline','delline','addLineAction','insertLineAction'],true);
            let isAddNotEdit = (status == 'add');
            this.props.button.setButtonVisible(['SaveAdd'],isAddNotEdit);
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            if(status == 'add') {
                this.props.button.setButtonDisabled({SaveAdd: false})
            }
            else {
                this.props.button.setButtonDisabled({SaveAdd: true})
            }
        }else{
            let unvisibleButtons = ['saveAction','cancelAction','addline','delline','SaveAdd','addLineAction','insertLineAction']
            let visibleButtons = ['addAction','editAction','deleteAction','backAction','refreshAction','Copy','Print','Output','Refresh']
            if(enableState == 2) {
                visibleButtons.push('disableAction')
                unvisibleButtons.push('enableAction')
            }
            else {
                visibleButtons.push('enableAction')
                unvisibleButtons.push('disableAction')
            }
            this.props.button.setButtonVisible(unvisibleButtons,false);
            this.props.button.setButtonVisible(visibleButtons,true);
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
    
        status = status == 'add' || status == 'edit' || status == 'copy' ? 'edit' : 'browse'
        this.props.form.setFormStatus(templateElements.formId, status);
        this.props.cardTable.setStatus(templateElements.tableId, status);
    };

	setDefaultValue = () =>{
		this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:this.state.json['10140WARH-000003']}});/* 国际化处理： 自由态*/
		let seteddata = undefined;
		if(mainOrg){
			seteddata = {enablestate: {value: '2',display: this.state.json['10140WARH-000004']} , pk_org: {value: mainOrg.pk_org,display: mainOrg.org_name}}
	   }else{
		   seteddata = {enablestate: {value: '2',display: this.state.json['10140WARH-000004']}}
	   }
		this.props.form.setFormItemsValue(this.formId,seteddata)/* 国际化处理： 已启用*/
	}

    buttonClick =(props, id)=>{

        let _this = this;
        switch (id) {
			case 'addAction':
				setDefData('cpk_stordoc',dataSource,'add');
				this.props.form.EmptyAllFormValue(this.formId)
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				let seteddata = undefined;
				if(mainOrg){
					seteddata = {enablestate: {value: '2',display: this.state.json['10140WARH-000004']} , pk_org: {value: mainOrg.pk_org,display: mainOrg.org_name}}
			   }else{
				   seteddata = {enablestate: {value: '2',display: this.state.json['10140WARH-000004']}}
			   }
                this.props.form.setFormItemsValue(this.formId,seteddata)/* 国际化处理： 已启用*/
                // 特殊处理一下加工商字段的必须性
				this.props.form.setFormItemsRequired(this.formId, {"operatesupplier": false})
				this.props.pushTo('/card', {
					pagecode:'10140WARH_card',
					status: 'add'
				})
				this.toggleShow();
				//特殊设置一下返回按钮的可见性
				let value = this.props.form.getFormItemsValue(this.formId,"iscommissionout").value;
				value===true ? this.props.form.setFormItemsDisabled(this.formId,{"operatesupplier": false}) : this.props.form.setFormItemsDisabled(this.formId,{"operatesupplier": true});
				this.setState({
					backVisible: false
				})
				break
			case 'editAction':
				//在这里加一下数据权限的校验；
				//在这里加载一下数据权限的校验类；
				let cpk_org = this.props.getUrlParam('org');
				let pk_stordocs =[];
				pk_stordocs.push(this.props.getUrlParam('id'));
				ajax({
					loading: true,
					url: urls.checkModelUrl,
					data:{
						"pk_org":cpk_org,
						"pk_stordocs":pk_stordocs,
						mdOperateCode:'edit',//增加一个修改参数，用来标志数据权限；
					},
					success: (res) => {
						if(res.success && res.data){//如果有修改权限才跳转到卡片页面
							this.props.pushTo('/card', {
								status: 'edit',
								pagecode:'10140WARH_card',
								id: this.props.getUrlParam('id'),
								org:this.props.getUrlParam('org'),
							})
							this.toggleShow();
							//特殊设置一下返回按钮的可见性
							this.setState({
								backVisible: false
							})
						}

					}
				});		
				break;
			case 'deleteAction':
				//this.props.modal.show('delete');
				promptBox({
					title: this.state.json['10140WARH-000005'],/* 国际化处理： 注意*/
					color:'warning',                    
					content: this.state.json['10140WARH-000006'],/* 国际化处理： 确定删除？*/
					beSureBtnClick:()=>{
						this.delConfirm();
					}
				});
				break
			case 'backAction':
				this.props.pushTo('/list', {
					pagecode:'10140WARH_list'
				})
				break
			case 'saveAction':
				this.saveClick();
				break
			case 'cancelAction':
			promptBox({
				title: this.state.json['10140WARH-000007'],/* 国际化处理： 确认取消*/
				color:'warning',                    
				content: this.state.json['10140WARH-000008'],/* 国际化处理： 是否确认要取消?*/
				beSureBtnClick:()=>{
					if (this.props.getUrlParam('status') === 'add') {
						let pk = getDefData('cpk_stordoc',dataSource)


						if(!pk || pk === 'add')
							pk = getCurrentLastId(dataSource);
						this.props.form.cancel(this.formId);//added by liusenc 20180911 fix 新增态时候，点击取消，取消表头和标题编辑态
						this.props.cardTable.resetTableData(this.tableId);//added by liusenc 20180911 fix 新增态时候，点击取消，取消表头和标题编辑态
						
						this.getDataForCache(pk, () => {
							//编辑态取消时，修正一下页面状态
							this.props.pushTo('/card', {
								status: 'browse',
								pagecode:'10140WARH_card',
								id: pk
							})
							this.props.form.setFormStatus(this.formId, 'browse')
							this.props.cardTable.setStatus(this.tableId, 'browse')
							this.toggleShow()//added by liusenc 20180911 fix 新增态时候，点击取消，取消表头和标题编辑态
						})

					}
					if ((this.props.getUrlParam('status') === 'edit')) {
						this.props.form.cancel(this.formId);
						this.props.cardTable.resetTableData(this.tableId);
						this.props.pushTo('/card', {
							status: 'browse',
							pagecode:'10140WARH_card',
							id: this.props.getUrlParam('id')
						})
						this.toggleShow()
					}
					//特殊设置一下返回按钮的可见性
					this.setState({
						backVisible: true
					})					

				}});
				//this.onCancelSureClick()
			// 	if (this.props.getUrlParam('status') === 'add') {
		
			// 	if(cacheTools.get("preid")){
					
			// 		this.props.form.cancel(this.formId);
			// 		this.props.editTable.cancelEdit(this.tableId);
			// 		this.props.pushTo('/card', {
			// 		status: 'browse',
			// 		id: cacheTools.get("preid")
			// 		})
			// 		toggleShow(this.props);
			// 		//特殊设置一下返回按钮的可见性
			// 		this.setState({
			// 			backVisible: true
			// 		})
			// 	}
			// 	else{
			// 		this.props.pushTo('/list', {
			// 		status: 'browse'
			// 		})
			// 	}
			// 	}
			// 	if ((this.props.getUrlParam('status') === 'edit')) {
			// 	this.props.form.cancel(this.formId);
			// 	this.props.editTable.cancelEdit(this.tableId);
			// 	this.props.pushTo('/card', {
			// 		status: 'browse',
			// 		id: this.props.getUrlParam('id'),
			// 		org: this.props.getUrlParam('org')
			// 	})
				
			// 	//特殊设置一下返回按钮的可见性
			// 	this.setState({
			// 		backVisible: true
			// 	})
			//   //重新判定下是启用还是停用，已决定显示停用还是启用按钮
			//   let enableState = this.props.form.getFormItemsValue(this.formId,'enablestate')
			//   enableState = enableState.value == 2 ? true : false
			//   this.props.button.setButtonVisible(['enableAction'], !enableState)
			//   this.props.button.setButtonVisible(['disableAction'], enableState)
            // }
			// toggleShow(this.props);
            break
          case 'addLineAction':
            this.addlineClick();
			break;
		  case 'insertLineAction':
		  	this.insertLineClick(); 
		  	break; 			
		  case 'copyline':
		  break;
		  case 'delline':
		  this.dellineClick();
		  break;	
          case 'Refresh':
            // this.props.pushTo('/card', {
            //   status:this.props.getUrlParam('status'),
            //   id:this.props.getUrlParam('id')
			// })
			let tempId = this.props.getUrlParam('id')
			let pk_org = this.props.getUrlParam('org')
			this.getdata(tempId,pk_org, () => {
				toast({title:this.state.json['10140WARH-000009'],color:'success'});/* 国际化处理： 刷新成功！*/
			})
			break
			
			case 'enableAction':
			//this.props.modal.show('enable');
			promptBox({
				color:"warning",
				title:this.state.json['10140WARH-000010'],/* 国际化处理： 提示*/
				size:'lg',
				content:  this.state.json['10140WARH-000011'],/* 国际化处理： 确认是否启用数据*/
				beSureBtnClick: this.enableClick.bind(this)
			});
			break
			case 'disableAction':
			//this.props.modal.show('disable');
			promptBox({
				color:"warning",
				title:this.state.json['10140WARH-000010'],/* 国际化处理： 提示*/
				size:'lg',
				content:  this.state.json['10140WARH-000012'],/* 国际化处理： 确认是否停用数据*/
				beSureBtnClick: this.disableClick.bind(this)
			});			
			break
			case 'copyAction':
			break
		case 'Print':
			let pk_value = this.props.getUrlParam('id')
			let pks = [pk_value]
			print(
                'pdf',
                urls.printUrl,
                {
                    funcode:/*this.props.config.funcode*/'10140WARH',     //功能节点编码
                    nodekey:'card',     //模板节点标识
                    oids:pks,
                    //outputType:'print'
                }
            )
			break
		case 'Output':
			pk_value = this.props.getUrlParam('id')
			pks = [pk_value]
			this.setState({
				pks
			},() => {
				this.refs.printOutput.open()
			})
			break
		case 'Copy':
			setDefData('cpk_stordoc',dataSource,props.form.getFormItemsValue(templateElements.formId,'pk_stordoc').value);
			props.pushTo('/card', {
				pagecode:'10140WARH_card',
				status: 'add',
			})
			this.props.form.setFormItemsValue(this.formId,{[templateElements.pk_item]: {value: '', display: ''}})
			let allRows = this.props.cardTable.getAllRows()
			if(allRows) {
				allRows.forEach(row => {
					row.values.pk_agentstore = {value: '', display: ''}
				})
				this.props.cardTable.setTableData(this.tableId,allRows)
			}
			// let	pk = this.props.getUrlParam('id');
			// let org = this.props.getUrlParam('org');
			// if(pk && pk != 'undefined'){
			// 	this.getdata(pk, org, null, true);
			// }
			this.toggleShow();
				//特殊设置一下返回按钮的可见性
				this.setState({
					backVisible: false
				})			
			break
		case 'SaveAdd':
			this.props.form.setFormItemsDisabled(this.formId,{"operatesupplier": true})
			this.saveClick(true)
			break
          default:
            break
        }
	}

	onCancelSureClick() {
		if (this.props.getUrlParam('status') === 'add') {
			let pk = getCurrentLastId(dataSource);
			this.props.form.cancel(this.formId);//added by liusenc 20180911 fix 新增态时候，点击取消，取消表头和标题编辑态
			//this.props.cardTable.cancelEdit(this.tableId);//added by liusenc 20180911 fix 新增态时候，点击取消，取消表头和标题编辑态

			this.getDataForCache(pk, () => {
				//编辑态取消时，修正一下页面状态
				this.props.pushTo('/card', {
					status: 'browse',
					pagecode:'10140WARH_card',
					id: pk
				})
				this.props.form.setFormStatus(this.formId, 'browse')
				this.props.cardTable.setStatus(this.tableId, 'browse')
				this.toggleShow()//added by liusenc 20180911 fix 新增态时候，点击取消，取消表头和标题编辑态
			})
		}
		if ((this.props.getUrlParam('status') === 'edit')) {
			this.props.form.cancel(this.formId);
			//this.props.cardTable.cancelEdit(this.tableId);
			this.props.pushTo('/card', {
				status: 'browse',
				pagecode:'10140WARH_card',
				id: this.props.getUrlParam('id')
			})
			this.toggleShow()
		}
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: true
		})
	}

	dellineClick = ()=>{
		let curSelDatas = this.props.cardTable.getCheckedRows(templateElements.tableId);
		let selIndexs = [];
		curSelDatas.forEach(element =>{
			selIndexs.push(element.index);
		});
		this.props.cardTable.delRowsByIndex(templateElements.tableId,selIndexs);
	}
	
	addlineClick = ()=>{
		let currows = this.props.cardTable.getNumberOfRows(templateElements.tableId) ;
		let cpk_stordoc = this.props.form.getFormItemsValue(templateElements.formId,'pk_stordoc').value;
		let isagentstore = this.props.form.getFormItemsValue(templateElements.formId,'isagentstore').value;
		if(!isagentstore){
			toast({content:this.state.json['10140WARH-000013'],color:'warning'});/* 国际化处理： 只有代储仓可设置代储关系*/
			//this.props.cardTable.delRowsByIndex(this.tableId, currows -1 );
			return;
		}
		else {
			this.props.cardTable.addRow(this.tableId,currows,{'pk_stordoc':{value:cpk_stordoc}});
		}
		
	}
	insertLineClick = ()=>{
		let currows = this.props.cardTable.getNumberOfRows(templateElements.tableId) ;
		let cpk_stordoc = this.props.form.getFormItemsValue(templateElements.formId,'pk_stordoc').value;
		let isagentstore = this.props.form.getFormItemsValue(templateElements.formId,'isagentstore').value;
		if(!isagentstore){
			toast({content:this.state.json['10140WARH-000013'],color:'warning'});/* 国际化处理： 只有代储仓可设置代储关系*/
			//this.props.cardTable.delRowsByIndex(this.tableId, currows -1 );
			return;
		}
		else {
			let curSelRow = this.props.cardTable.getClickRowIndex(templateElements.tableId);
			if(curSelRow && (curSelRow.index>= 0)){
				this.props.cardTable.addRow(templateElements.tableId,curSelRow.index,{'pk_stordoc':{value:cpk_stordoc}});
			}
		}
		
	}	
    enableClick = ()=>{
		let pk_stordocs = [];
		let cpk_org =this.props.form.getFormItemsValue(templateElements.formId,'pk_org').value;
		pk_stordocs.push(this.props.form.getFormItemsValue(templateElements.formId,'pk_stordoc').value);
		ajax({
            loading: true,
            url:urls.cardEnableUrl, 
            data:{
				"pk_org":cpk_org,
				"pk_stordocs":pk_stordocs,
				mdOperateCode:'enable',//增加一个参数，用来标志数据权限；
			},
            success: (res) => {
				showFormular(this.props,res,{
					"stordoc" : "form",
					"agentstores":"cardTable",
					//'agentstores_childform1': "cardTable",
					//'agentstores_childform2': "cardTable"
				});				
				if(res.success){
					this.props.form.setAllFormValue({[templateElements.formId]:res.data.head[templateElements.formId]});//置一下头
					if(res.data.body) {
						this.props.cardTable.setTableData(templateElements.tableId, res.data.body[templateElements.tableId]);//置一下表数据；
					}

					//如果是启用成功，那么按钮换成停用
					this.props.button.setButtonVisible(['enableAction'],false)
					this.props.button.setButtonVisible(['disableAction'],true)
					toast({title : this.state.json['10140WARH-000014'],color : 'success'});/* 国际化处理： 启用成功！*/
				}
            }
        }); 

	}
	disableClick = ()=>{
		let pk_stordocs = [];
		let cpk_org =this.props.form.getFormItemsValue(templateElements.formId,'pk_org').value;
		pk_stordocs.push(this.props.form.getFormItemsValue(templateElements.formId,'pk_stordoc').value);
		ajax({
            loading: true,
            url:urls.cardDisableUrl, 
            data:{
				"pk_org":cpk_org,
				"pk_stordocs":pk_stordocs,
				mdOperateCode:'disable',//增加一个参数，用来标志数据权限；
			},
            success: (res) => {
				showFormular(this.props,res,{
					"stordoc" : "form",
					"agentstores":"cardTable",
					//'agentstores_childform1': "cardTable",
					//'agentstores_childform2': "cardTable"
				});				
				if(res.success){
					this.props.form.setAllFormValue({[templateElements.formId]:res.data.head[templateElements.formId]});//置一下头
					if(res.data.body) {
						this.props.cardTable.setTableData(templateElements.tableId, res.data.body[templateElements.tableId]);//置一下表数据；
					}

					//如果是启用成功，那么按钮换成停用
					this.props.button.setButtonVisible(['enableAction'],true)
					this.props.button.setButtonVisible(['disableAction'],false)
					toast({title : this.state.json['10140WARH-000015'],color : 'success'});/* 国际化处理： 停用成功！*/
				}
            }
        }); 

	}
	copyAction = ()=>{

	}

	onBeforeForm(props,moduleid,key,value,data){//added by liusenc 增加一个编辑前事件处理利润中心的主组织权限过滤
		let meta = props.meta.getMeta();
		if(key === 'profitcentre' || key === 'pk_org' || key === 'operatesupplier'){//如果是利润中心参照，
			
			meta.stordoc.items.map((ele)=>{
				if(ele.attrcode === "profitcentre" && key === 'profitcentre'){
					ele.queryCondition=function(){
						return{
							AppCode:'10140WARH',
							TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',							
						}
					}
				}
				else if(ele.attrcode === 'pk_org' && key === 'pk_org'){
					ele.queryCondition = function(){
						return{
							AppCode:'10140WARH',
							GridRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
						}
					}
				}
				else if(ele.attrcode === 'operatesupplier' && key === 'operatesupplier'){
					let ccpk_org = props.form.getFormItemsValue(templateElements.formId,'pk_org').value;
					if(ccpk_org && ccpk_org != "" ){
						ele.queryCondition = function(){
							return{
								pk_org: ccpk_org
							}
						}
					}
				}
				
			})
			
		}

		props.meta.setMeta(meta);
		return true;
	}
   
	onAfterEvent(props, moduleId, key, value, oldValue) {
		let fields = ['csflag','isatpaffected','isobligate','isagentstore','mrpflag','isdirectstore']
		if(value != oldValue) {
			//委外仓和加工商字段控制
			if(key == 'iscommissionout') {
				//控制显示
				if(value.value) {
					this.props.modal.show('iscommissionout')
				}
				else {
					this.props.form.setFormItemsValue(this.formId, {operatesupplier: {value: '', display: ''}})
					this.props.form.setFormItemsRequired(this.formId,{"operatesupplier": false})
					this.props.form.setFormItemsDisabled(this.formId,{"operatesupplier": true})
				}
			}
			//废品库字段控制
			else if(key == 'gubflag') {
				//废品库互斥字段
				let gubflagField = ['isatpaffected','iscalculatedinvcost']
				let setObject = {}
				gubflagField.forEach(item => {
					setObject[item] = {value: false,display:null}
				})
				this.props.form.setFormItemsValue(this.formId, setObject)
				this.props.form.setFormItemsDisabled(this.formId, {"isatpaffected": value.value,"iscalculatedinvcost": value.value})
			}
			//选中了库存组织之后，根据所属库存组织的适用零售字段来设置仓库的适用零售以及门店仓库是否可编辑及字段值
			else if(key == 'pk_org') {
				if(value.value != null) {
					ajax({
						url: urls.extendFieldUrl,
						data: {
							key: 'pk_org',
							value: value.value
						},
						success: res => {
							let setObject = {}
							setObject.isretail = {value: false,display: null}
							setObject.isshopstore = {value: false,display: null}
							this.props.form.setFormItemsValue(this.formId, setObject)
							this.props.form.setFormItemsDisabled(this.formId, {"isretail": !res.data,"isshopstore": !res.data})
						}
					})
				}
				else {
					let setObject = {}
					setObject.isretail = {value: false,display: null}
					setObject.isshopstore = {value: false,display: null}
					this.props.form.setFormItemsValue(this.formId, setObject)
					this.props.form.setFormItemsDisabled(this.formId, {"isretail": true,"isshopstore": true})
				}
			 }
			else if(key == 'isshopstore'){
				console.log(value);
				if(value.value){
					this.props.form.setFormItemsValue(this.formId,{isretail:{value:true,display:null}});
				}

			}else if(key === 'isretail'){
				console.log(value);
				if(!value.value){
					this.props.form.setFormItemsValue(this.formId,{isshopstore:{value:false,display:null}});
				}
			}
			//委外仓互斥字段控制
			else if(fields.indexOf(key) > -1) {
				this.props.form.setFormItemsValue(this.formId,{"iscommissionout": {value:false, display: null}})
				this.props.form.setFormItemsRequired(this.formId,{"operatesupplier": false})
				this.props.form.setFormItemsDisabled(this.formId,{"operatesupplier": true})
				//代储仓字段控制，如果是选择了false的话，那么清空子表数据
				if(key == 'isagentstore') {
					this.props.cardTable.setTableData(this.tableId,{rows: []})
					//设置加工商字段不可用，同时清空该字段值
					this.props.form.setFormItemsValue(this.formId,{"operatesupplier": {value:false, display: null}})
				}
			}

		}
	}


	pageInfoClick = (props, pk) => {
		// 后台还没更新，暂不可用
		this.getDataForCache(pk)
	}
	//通过单据id查询单据信息
	getdata = (pk, org, callback = null, isCopy = false) =>{
		console.log(`refresh data : ${metaAndDataCount}`)
		let data = {
			pk_stordocs:[pk],
			pk_org:org,
		};
		ajax({
			url: urls.queryCardUrl,
			data,
			success: (res) => {
				showFormular(this.props,res,{
					"stordoc" : "form",
					"agentstores":"cardTable",
					//'agentstores_childform1': "cardTable",
					//'agentstores_childform2': "cardTable"
				});
				if (res.data.head) {
					let disabledValueSet = {}
					//1. 废品仓同对(影响可用量、存货成本计算)字段的编辑性的控制
					let gubflagValue = res.data.head[this.formId].rows[0].values.gubflag
					if(gubflagValue.value) {
						disabledValueSet = {"isatpaffected": gubflagValue.value,"iscalculatedinvcost": gubflagValue.value}
					}

					//2. 根据库存组织的是否零售字段来判定
					let canEditRetail = JSON.parse(res.data.userjson)
					if(!canEditRetail.retailEdit) {
						disabledValueSet.isretail = !canEditRetail.retailEdit
						disabledValueSet.isshopstore = !canEditRetail.retailEdit
					}

					//3. 根据加工商是否有值来判定是否可以编辑加工商
					//let operatesupplierVal = this.props.form.getFormItemsValue(this.formId,'operatesupplier')
					let operatesupplierVal = res.data.head[this.formId].rows[0].values.operatesupplier
					if(operatesupplierVal.value != null) {
						disabledValueSet.operatesupplier = false
					}
					else {
						disabledValueSet.operatesupplier = true
					}

					let requeiredItemsSet = {operatesupplier: operatesupplierVal.value != null ? true : false}
					if(metaAndDataCount >= 1) {
						//发现似乎有点小问题，不得已，timeout了
						this.props.form.setFormItemsDisabled(this.formId, disabledValueSet)
						this.props.form.setFormItemsRequired(this.formId, requeiredItemsSet)
					}
					else {
						disabledValueSetGlb = disabledValueSet
						requeiredItemsSetGlb = requeiredItemsSet
						metaAndDataCount++
					}

					//设置一下停用以及启用按钮的状态
					if(this.props.getUrlParam('status') == 'browse') {
						let enableState = res.data.head[this.formId].rows[0].values.enablestate.value == 2 ? true : false
						this.props.button.setButtonVisible(['enableAction'], !enableState)
						this.props.button.setButtonVisible(['disableAction'], enableState)
					}
					else {
						this.props.button.setButtonVisible(['enableActionk','disableAction'], false)
					}

					//是否是复制，如果是复制的话，需要清空主键并且将VOStatus设置为新增
					if(isCopy) {
						let headData = res.data.head[this.formId].rows[0]
						headData.values[templateElements.pk_item] = {value: '', display: ''}
						if(res.data.body) {
							let bodyData = res.data.body[this.tableId].rows
							bodyData.forEach(item => {
								item.values.pk_agentstore = {value: '', display: ''}
							})
						}
					}
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					let title_code = res.data.head[this.formId].rows[0].values[templateElements.title_code].value;
					this.setState({title_code});

					//更新缓存
					updateCache(templateElements.pk_item,res.data.head[templateElements.formId].rows[0].values[templateElements.pk_item].value,res.data,templateElements.formId,dataSource)
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
					let arr = this.props.cardTable.getAllRows(this.tableId);
					let applycount = 0;
					this.setState({applycount});
					this.setState({totalcount});
				}else if(!res.data.body){
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
					let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
					let arr = this.props.cardTable.getAllRows(this.tableId);
					let applycount = 0;
					this.setState({applycount});
					this.setState({totalcount});
				}

				//console.log(`can edit ??? stock org ? ${canEditRetail.retailEdit}`)

				//回调函数
				if(callback && typeof callback == 'function') {
					callback.call(this)
				}
			}
		});
	}

	//保存单据
	saveClick = (isSaveAdd = false) =>{
		this.props.cardTable.filterEmptyRows(templateElements.tableId,['pk_stordoc']);
		let CardData = this.props.createMasterChildData(templateElements.pageId, templateElements.formId, templateElements.tableId);
		let url = urls.saveUrl;//新增保存
		//必输项校验
		if(this.props.form.isCheckNow(templateElements.formId)){
			if (this.props.getUrlParam('status') === 'edit') {
				url = urls.updateUrl;//修改保存
			}

			//委外仓勾选是，加工上字段不可为空判定逻辑
			// let formItemsValue = this.props.form.getFormItemsValue(this.formId,['iscommissionout','operatesupplier'])
			// if(formItemsValue[0].value && formItemsValue[1].value == null) {
			// 	toast({color: 'warning',content: ''})
			// 	return
			// }
			this.props.validateToSave(CardData,()=>{
			ajax({
				url: url,
				data: CardData,
				success: (res) => {
					showFormular(this.props,res,{
						"stordoc" : "form",
						"agentstores":"cardTable",
						//'agentstores_childform1': "cardTable",
						//'agentstores_childform2': "cardTable"
					});				
					if(isSaveAdd) {
						//保存新增时自动带出上一次指定的库存组织
						let pk_org = this.props.form.getFormItemsValue(this.formId,'pk_org')
						//上面的pk_org是个引用，下面的EmptyAllFormValue会将其清空，所以下面重新拷贝一份出来,避免下面setFormItemsValue的时候设置的是空值
						let finalOrg = {
							display: pk_org.display,
							value: pk_org.value
						}
						this.props.form.EmptyAllFormValue(this.formId)
						this.props.cardTable.setTableData(this.tableId, { rows: [] })
						this.props.form.setFormItemsValue(this.formId,{enablestate: {value: '2',display: this.state.json['10140WARH-000004']},pk_org: finalOrg})/* 国际化处理： 已启用*/
						this.props.pushTo('/card', {
							pagecode:'10140WARH_card',
							status: 'add'
						})
						this.toggleShow();
					}
					else {
						let cpk_stordoc = "";
						let cpk_org = "";
						if (res.success) {
							if (res.data) {
								if(res.data.head){
									this.props.form.setAllFormValue({[templateElements.formId]:res.data.head[templateElements.formId]});//置一下头
									cpk_stordoc = res.data.head[templateElements.formId].rows[0].values.pk_stordoc.value;
									cpk_org = res.data.head[templateElements.formId].rows[0].values.pk_org.value;
								}
								if(res.data.body){
									this.props.cardTable.setTableData(templateElements.tableId, res.data.body[templateElements.tableId]);//置一下表数据；
								}


							}
							
							this.props.pushTo('/card', {
								status: 'browse',
								pagecode:'10140WARH_card',
								id: cpk_stordoc,
								org:cpk_org,
							})
							this.props.form.setFormStatus(templateElements.formId,'browse')
							this.props.cardTable.setStatus(templateElements.tableId,'browse')
							this.toggleShow();
							toast({title : this.state.json['10140WARH-000016'],color : 'success'});/* 国际化处理： 保存成功！*/
							this.setState({
								backVisible: true
							})
						}
					}

					if(res.success && res.data && res.data.head) {
						let pk_value = res.data.head[templateElements.formId].rows[0].values.pk_stordoc.value;
						//更正缓存
						if(url == urls.saveUrl) {
							//新增保存
							addCache(pk_value,res.data,this.formId,dataSource);
						}
						else {
							//修改保存
							updateCache(templateElements.pk_item,res.data.head[this.formId].rows[0].values[templateElements.pk_item].value,res.data,templateElements.formId,dataSource);
						}
					}
				},
				error: (res) => {
					debugger;
					toast({ color: 'danger', content: res.message});
					let value = this.props.form.getFormItemsValue(this.formId,"iscommissionout").value;
					if(value===true) this.props.form.setFormItemsDisabled(this.formId,{"operatesupplier": false})
				}
			});
		},{"stordoc":'form',"agentstores":"cardTable"},'card');
	}
	  }

	//删除单据
	delConfirm = () => {
		ajax({
			url: urls.listDelUrl,
			data: {

				pk_org: this.props.form.getFormItemsValue(templateElements.formId,'pk_org').value,
				pk_stordocs: [this.props.getUrlParam('id')],
				ts: this.props.form.getFormItemsValue(templateElements.formId, 'ts').value,
				mdOperateCode:'delete',//增加一个参数，用来标志数据权限；
			},
			success: (res) => {
				// if(res){
				// 	this.props.pushTo('/list',{});
				// }

				if(res){
					let id = this.props.getUrlParam("id");

					//根据当前id,获取下个id
					/*
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					let nextId = getNextId(id, dataSource);

					//调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					deleteCacheById(templateElements.pk_item,id,dataSource);

					this.getDataForCache(nextId,() => {
						//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
					})
				}
				
			}
		});
	};

	modelSave = (props)=>{
		this.props.cardTable.closeModel(this.tableId);
		this.saveClick();
	}

	//获取列表肩部信息
	getTableHead = (buttons,tableId) => {
		let {button} = this.props;
		let { createButtonApp } = button;
		//let buttons  = this.props.button.getButtons();
		let status = this.props.getUrlParam("status");
        return (
			<div className="shoulder-definition-area">
				<div className='definition-search' fieldid='definition-searchId'>
					{status == 'browse' ?<div><span className="definition-search-title">{this.state.json['10140WARH-000017']}</span>{/* 国际化处理： 详细信息 | 总计:*/}
						<span className = 'count'>{this.state.totalcount}</span><span>{this.state.json['10140WARH-000018']}</span>{/* 国际化处理： 条*/}
					<span>	{this.state.json['10140WARH-000019']}	</span>{/* 国际化处理： 申请数量 ：*/}
						<span className='count'>{this.state.applycount}</span><span>{this.state.json['10140WARH-000020']}</span></div>:<span className="definition-search-title"></span>}{/* 国际化处理： 个*/}
				</div>
				<div className="definition-icons" /* style={{padding: "0px"}} */>
					{createButtonApp({
						area: 'card-button-area',
						//buttonLimit: 3, 
						onButtonClick: this.buttonClick.bind(this), 
						//popContainer: document.querySelector('.header-button-area')

					})}														
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max','setCol'],
						maxDestAreaId: 'nc-bill-card'
					})}
				</div>	
			</div>
        )
	}

	onCardTableBeforeEvent(props,moduleid,key,value,index,record,status){
		//如果选中的为PK_STOCKORG ，且当前选中的表头上的pk_org有值，那么将这个pk_org过滤掉，如果没有值，那么使用原来的参照；
		
		if("pk_stockorg" == key){
			let meta = props.meta.getMeta();
			let formOrg = props.form.getFormItemsValue(templateElements.formId,'pk_org');
			let cpk_org = "";
			if(formOrg && formOrg.value){
				cpk_org = formOrg.value;
			}
			meta.agentstores.items.map((ele)=>{
				if( "pk_stockorg" ==  ele.attrcode){
					ele.queryCondition=function(){
						return{
							AppCode:'10140WARH',
							pk_org : cpk_org,
							GridRefActionExt:'nccloud.web.uapbd.stordoc.action.RefCondStordocOrg',
						}
					}
				}
			})
			props.meta.setMeta(meta);
		}
		
		return true;
		
	}
	
	onCardTableAfterEvent(props, moduleId, key,value, changedrows, index, record) {
		if(changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			let setObj = {}
			let stockOrgValue = record.values.pk_stockorg.value
			//说明是选择了值
			if(stockOrgValue) {
				ajax({
					url: urls.extendFieldUrl,
					data: {
						key: "pk_stockorg",
						value: stockOrgValue
					},
					success: res => {
						setObj.value = res.data.financeOrgName.value
						setObj.display = res.data.financeOrgName.display
						props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_stockorg.pk_financeorg',setObj)
	
						setObj.value = res.data.areaclName.value
						setObj.display = res.data.areaclName.display
						props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_stockorg.pk_areacl',setObj)
	
						setObj.value = res.data.addressdocName.value
						setObj.display = res.data.addressdocName.display
						props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_stockorg.pk_address',setObj)
	
						setObj.value = res.data.addressInfo.value
						setObj.display = res.data.addressInfo.display
						props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_stockorg.addressbook',setObj)
					}
				})
			}
			//说明删除了代储关系的库存组织字段
			else {
				setObj.value = null
				setObj.display = null
				props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_stockorg.pk_financeorg',setObj)
	
				setObj.value = null
				setObj.display = null
				props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_stockorg.pk_areacl',setObj)

				setObj.value = null
				setObj.display = null
				props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_stockorg.pk_address',setObj)

				setObj.value = null
				setObj.display = null
				props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_stockorg.addressbook',setObj)
			}						
		}
	}

	iscommissionoutSureClick() {
		let fields = ['csflag','isatpaffected','isobligate','isagentstore','mrpflag','isdirectstore']

		let value = this.props.form.getFormItemsValue(this.formId,"iscommissionout")
		//加工商字段编辑性控制
		this.props.form.setFormItemsRequired(this.formId,{"operatesupplier": value.value ? true : false})
		this.props.form.setFormItemsDisabled(this.formId,{"operatesupplier": !value.value})

		//互斥字段控制
		let setObject = {}
		fields.forEach(item => {
			setObject[item] = {value: false,display: null}
		})
		this.props.form.setFormItemsValue(this.formId, setObject)
	}

	iscommissionoutUnSureClick() {
		this.props.form.setFormItemsValue(this.formId,{"iscommissionout": {value: false, display: null}})
	}

	getDataForCache(pk, callback) {
		if(!pk) {
			this.props.setUrlParam({id: 'null', status: 'browse'})
            this.toggleShow()
			return
		}
		
		let cardData = getCacheById(pk, dataSource);
		if(cardData) {
			this.props.form.setAllFormValue({ [this.formId]:cardData.head[this.formId] });
			if(cardData.body && cardData.body[this.tableId]) {
				this.props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
			}
			else {
				this.props.cardTable.setTableData(this.tableId, {rows: []})
			}
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
		}
		else {
			this.getdata(pk)
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
		}

		if(callback && typeof callback == 'function') {
			callback.call(this)
		}

		if(cardData) {
			let enableState = cardData.head[this.formId].rows[0].values.enablestate.value
			this.toggleShow(enableState)
		}
	}

	render() {
		let { cardTable, form, button, modal, cardPagination ,BillHeadInfo} = this.props;
		const {createCardPagination} = cardPagination;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButton,createButtonApp , } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		const {createBillHeadInfo} = BillHeadInfo;
		return (
			<div  id='nc-bill-card'>
					<div className="nc-bill-card">
					<div className="nc-bill-top-area">
						<NCAffix>
							<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>	
								<div className='header-title-search-area'>
									{createBillHeadInfo({
											title:( this.state.json['10140WARH-000021']),
                                            backBtnClick: this.buttonClick.bind(this,this.props,'backAction'),
                                            initShowBackBtn: this.state.backVisible
                                        }
                                    )}
								</div> 
								<span className="bill-info-code" style={{fontSize: '16px',marginLeft: '8px',lineHeight: '32px',verticalAlign: 'baseline'}}>
									{status=='browse' && ": "+this.state.title_code}
								</span>
							
								<div className="header-button-area">
									{createButtonApp({
										area: 'header-button-area',
										//buttonLimit: 3, 
										onButtonClick: this.buttonClick.bind(this), 
										//popContainer: document.querySelector('.header-button-area')
	
									})}
									{/* 20180719 卡片分页组件报错 */}
									<div className='header-cardPagination-area' style={{float:'right'}}>
									 {createCardPagination({
										dataSource: dataSource,
										handlePageInfoChange: this.pageInfoClick.bind(this)
									})}
									</div>
								</div>
							</NCDiv>
						</NCAffix>
						
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								onBeforeEvent:this.onBeforeForm.bind(this),//增加一个表单编辑前事件，处理利润中心参照的主组织权限过滤；
								onAfterEvent: this.onAfterEvent.bind(this)
							})}

						</div>

						</div>
						<div className="nc-bill-bottom-area">
							<div className="nc-bill-table-area" fieldid='nc-bill-tableId'>
								{createCardTable(this.tableId, {
									tableHead: this.getTableHead.bind(this),
									modelSave: this.modelSave.bind(this),
									onAfterEvent: this.onCardTableAfterEvent.bind(this),
									onBeforeEvent: this.onCardTableBeforeEvent.bind(this),
									showIndex:true,
									showCheck:true,
								})}
							</div>
						</div>
						{/*
						{createModal('delete', {
							title: languageRes.attention,
							content: languageRes.sureDelete,
							beSureBtnClick: this.delConfirm
						})}
						*/}
						</div>
					<PrintOutput
						ref='printOutput'
						url={urls.printUrl}
						data={{
							funcode: '10140WARH',
							oids: this.state.pks,
							nodekey:'card',     //模板节点标识
							outputType: 'output'
						}}
					/>

					{createModal('iscommissionout', {
						title: this.state.json['10140WARH-000022'],/* 国际化处理： 询问*/
						content: this.state.json['10140WARH-000023'],/* 国际化处理： 选中“委外仓”时，货位管理、影响可用量、可预留、代储仓、计划可用、直运仓等选择将被清空，是否继续？*/
						beSureBtnClick: this.iscommissionoutSureClick.bind(this),
						cancelBtnClick: this.iscommissionoutUnSureClick.bind(this)
					})}

					{createModal('enable', {
						title: this.state.json['10140WARH-000022'],/* 国际化处理： 询问*/
						content: this.state.json['10140WARH-000024'],/* 国际化处理： 您确定要启用所选数据吗？*/
						beSureBtnClick: this.enableClick.bind(this)
					})}

					{createModal('disable', {
						title: this.state.json['10140WARH-000022'],/* 国际化处理： 询问*/
						content: this.state.json['10140WARH-000025'],/* 国际化处理： 您确定要停用所选数据吗？*/
						beSureBtnClick: this.disableClick.bind(this)
					})}

			</div>
			
		);
	}
}

Card = createPage({
	//initTemplate: initTemplate
	billinfo:{
		billtype:'card',
		pagecode:'10140WARH_card',
		headcode:'stordoc',
		bodycode:'agentstores',//['agentstores','agentstores_childform1','agentstores_childform2']
	},
})(Card);

//eactDOM.render(<Card />, document.querySelector('#app'));

export default Card

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65