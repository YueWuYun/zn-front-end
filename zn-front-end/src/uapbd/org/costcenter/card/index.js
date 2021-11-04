//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast ,promptBox,high,excelImportconfig,createPageIcon} from 'nc-lightapp-front';
const { NCAffix,NCPopconfirm,NCFormControl,NCAnchor,NCScrollElement,NCScrollLink,NCCheckbox:Checkbox,NCMessage,NCDiv } = base;
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
import  Utils from '../../../public/utils';
import CCDept from '../ccdept';
import CCWork from '../ccwork';
import CCCostType from '../cccosttype';
import CostcenterGRP from '../../../org/costcentergrp/main';
import './index.less'
//导入导出功能适配
//import Utils from "../../../../uap/public/utils";
//初始化模板适配
import  Util from '../../../public/utils';
import {headButton, bodyButton, innerButton} from '../common/btnName';
import {pageId, appcode, formId, tableIds, head, urls, TableBtn} from './content';
import TitleBar from '../common/titleComponent'
import {headButtonEvent, initTemplate, tableButtonEvent,buttonVisible,buttonAbled} from './events';

const {ExcelImport}=high;

class CostcenterCard extends Component {

	constructor(props){

		super(props);

		this.config =Object.assign({
            treeId:"costCenterTree",
            formId:"pk_group",
			pageCode:"10100CC_costcenter",
			tableIds:['ccdepts','ccworkcenters','ccfeetype'],
			urls:{
				ccdeptrefqrycondition:"/nccloud/uapbd/costcenter/ccdeptrefqrycondition.do",
				loadtreeurl:"/nccloud/uapbd/costcenter/loadtreedata.do",
				queryCardUrl:'/nccloud/uapbd/costcenter/loadcarddata.do'
			}
        },props.config);
		
		this.state={
			json: [],//多语资源文件数据
			pk_factory:'',//关联工作中心根据所属工厂过滤数据
			status:'browse',//标记页面状态，控制参照查询区 的显隐性
			checked:false,//停启用复选框
			ccworksdata:[],
			ccdeptsdata:[],
			cccosttypedata:[],
			versionData:[],//版本化数据
			enablestate:'N',
			curOrg:{pk_org:'',name:''},
			showBaseInfo:false,
			title_code:'title_code',
			cacheRefPk:this.props.cacheRefPk//卡片跳转列表，再跳转到卡片的情况下，cacheRefPk维护第一次卡片页面左侧树选中节点pk
		}
		this.buttonVisible = buttonVisible.bind(this);
		this.buttonAbled = buttonAbled.bind(this);
		//加载多语资源
		initTemplate.call(this);
		
	}
	componentDidMount(){
		this.updateButtonStatus();
	}

	componentDidUpdate(){
		if(this.props.form.getFormStatus(this.config.formId) === 'edit'||this.props.form.getFormStatus(this.config.formId) === 'add'){
			window.onbeforeunload=()=>{
				return '';
			}
		}else{
			window.onbeforeunload= null;
		}

		// NCCLOUD-137953_无数据时不可点击‘启用状态’按钮
		let selectNode=this.props.syncTree.getSelectNode(this.config.treeId);
		if(!selectNode || selectNode.id==='~' || selectNode.key==='~'){
			this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});
		}else{
			this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
		}
	}

	setDefaultValue = () =>{
		//this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:'自由态'}});
	}


	//处理按钮的可见不可见、操作及不可操作
	setButtonStatus(){
		this.buttonVisible();
		this.buttonAbled();
	}
	setButtonDisable(){
		this.buttonAbled();
    }
	//卡片区状态监听，用于调整按钮状态
    updateButtonStatus(){
        if(this.props.form.getFormStatus(this.config.formId) == 'edit'||this.props.form.getFormStatus(this.config.formId)=='add'){//编辑状态
			this.props.button.setButtonsVisible({
				query:true,
                costcentergrp:true,
                import:true,
                refresh:true,
                cancel:false,
                [headButton.Save]: true,// save:false,
                [headButton.Save_add]: true,//saveAdd:false,
                [shoulderButton.AddCcdepts]: true,//addccdept:false,
                [shoulderButton.DelCcdepts]: true,//delccdept:false,
                [shoulderButton.AddCcwork]: true,//addccwork:false,
                [shoulderButton.DelCcwork]: true,//delccwork:false
                [shoulderButton.AddFeetype]: true,//addccwork:false,
                [shoulderButton.DelFeetype]: true,//delccwork:false

				// query:false,
				// costcentergrp:false,
				// import:false,
				// refresh:false,
				// cancel:true,
				// save:true,
				// saveAdd:true,
				// addccdept:true,
				// delccdept:true,
				// addccwork:true,
				// delccwork:true
			});
		}else{//浏览态
			let broswerUnVisibleBtn = [//浏览态按钮状态不可见
				//表头按钮
				headButton.Save,
				headButton.Save_add,
				headButton.Cancel
			];
			this.props.button.setButtonsVisible(broswerUnVisibleBtn,false);
				
		}
    }

	

	isDelBtnEnable(){
		//判断子表数据，控制子表增删行按钮可用性
		if(this.props.cardTable.getCheckedRows(tableIds[0]).length>0/*获取列表总行数*/){
			this.props.button.setDisabled(TableBtn.delccdept,false);
		}else{
			this.props.button.setDisabled(TableBtn.delccdept,true);
		}; 
		//判断子表数据，控制子表增删行按钮可用性
		if(this.props.cardTable.getCheckedRows(tableIds[1]).length>0/*获取列表总行数*/){
			this.props.button.setDisabled(TableBtn.delccwork,false );
		}else{
			this.props.button.setDisabled(TableBtn.delccwork,true);
		}; 
		//判断子表数据，控制子表增删行按钮可用性
		if(this.props.cardTable.getCheckedRows(tableIds[2]).length>0/*获取列表总行数*/){
			this.props.button.setDisabled(TableBtn.delfeetype,false );
		}else{
			this.props.button.setDisabled(TableBtn.delfeetype,true);
		}; 
	}


	//关联版本化界面数据回调方法
	onVersionData(versionData){
		console.log("versionData",versionData);
		this.state.versionData=versionData;
		this.setState(this.state);
	}
	//版本化弹框确定事件
	confirmVerionModal(){
		let enablestate = this.props.form.getFormItemsValue("pk_group","enablestate");
		if(enablestate.value){//值为true
			enablestate.value = 2 ;
			enablestate.display = "启用"
		}
		this.props.form.setFormItemsValue("pk_group",{'enablestate':enablestate});
		let cardData = this.props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1],this.config.tableIds[2]]);
		//let pk_costcenter = this.props.form.getFormItemsValue("pk_group","pk_costcenter");
		let querydata={
			cardData:cardData,
			versionData:this.state.versionData //版本化确定数据与版本化弹框界面关联方法this.onVersionData
		}
		ajax({
            url:"/nccloud/uapbd/costcenter/costcenterversionconfirm.do",
            data:querydata,
            success:(result)=>{
				if(result.success){
					 //数据处理
					 let headData = result.data.head[this.config.formId];
					 let deptData = result.data.bodys[this.config.tableIds[0]];
					 let workData = result.data.bodys[this.config.tableIds[1]];
					 let costTypeData = result.data.bodys[this.config.tableIds[2]];
					 this.props.form.setAllFormValue({[this.config.formId]:headData});
					 this.props.cardTable.setTableData(this.config.tableIds[0], deptData, false);
					 this.props.cardTable.setTableData(this.config.tableIds[1], workData, false);
					 this.props.cardTable.setTableData(this.config.tableIds[2], costTypeData, false);
				}
            }
        });
	}

	//关联部门增行时回调函数
	onAddCCDept(selectDeptData){
		this.state.ccdeptsdata=selectDeptData;
		this.setState(this.state);
	}

	addCCDeptRows(){
		if(this.state.ccdeptsdata.length!=0){
			let num = this.props.cardTable.getNumberOfRows(tableIds[0]); //获取列表总行数
			this.props.cardTable.insertRowsAfterIndex(tableIds[0],this.state.ccdeptsdata,num);
		}
		this.isDelBtnEnable();
	}

	//关联工作中心增行时回调函数
	onAddCCWork(selectWorkData){
		this.state.ccworksdata=selectWorkData;
		this.setState(this.state);
	}

	addCCWorkRows(){
		if(this.state.ccworksdata.length!=0){
			let num = this.props.cardTable.getNumberOfRows(tableIds[1]); //获取列表总行数
			this.props.cardTable.insertRowsAfterIndex(tableIds[1],this.state.ccworksdata,num);
		}
		this.isDelBtnEnable();
	}


	//关联费用类型增行时回调函数
	onAddCCostType(selectWorkData){
		this.state.cccosttypedata=selectWorkData;
		this.setState(this.state);
	}
	addCCCostTypeRows(){
		if(this.state.cccosttypedata.length!=0){
			let num = this.props.cardTable.getNumberOfRows(tableIds[2]); //获取列表总行数
			this.props.cardTable.insertRowsAfterIndex(tableIds[2],this.state.cccosttypedata,num);
		}
		this.isDelBtnEnable();
	}


	//子表按钮点击事件
	onCCButtonClick(props,id){
		switch(id){
			case TableBtn.addccdept:
				let checkDeptPK=[];
				props.cardTable.getVisibleRows(tableIds[0]).forEach((row)=>{
					checkDeptPK.push(row.values['pk_dept']);
				})
				//关联部门新增时弹出类似参照选择的模态框
				let param1={json:this.state.json,pk_org:this.state.curOrg.pk_org,name:this.state.curOrg.name,checkDeptPK:checkDeptPK,loadDept:this.onAddCCDept.bind(this)}
				props.modal.show('modal',{
                    title : this.state.json['10100CC-000021'],/* 国际化处理： 部门所有*/
                    content :<CCDept config={param1}/>,
					beSureBtnClick : this.addCCDeptRows.bind(this)
				})
				break;
			case TableBtn.delccdept:
				let selectedData1=props.cardTable.getCheckedRows(tableIds[0]);
				let indexArr1=[];
				selectedData1.forEach((val) => {
					indexArr1.push(val.index);
				});
				props.cardTable.delRowsByIndex(tableIds[0], indexArr1);
				this.isDelBtnEnable();
				//this.props.button.setDisabled(TableBtn.delccdept,true);//删除按钮禁用
				break;
			case TableBtn.addccwork:
				let checkWorkPK=[];
				props.cardTable.getVisibleRows(tableIds[1]).forEach((row)=>{
					checkWorkPK.push(row.values['pk_workcenter']);
				})
				//关联部门新增时弹出类似参照选择的模态框
				let param2={json:this.state.json,pk_org:this.state.pk_factory,checkWorkPK:checkWorkPK,loadWork:this.onAddCCWork.bind(this)}
				props.modal.show('modal',{
                    title : this.state.json['10100CC-000022'],/* 国际化处理： 工作中心*/
                    content :<CCWork config={param2}/>,
					beSureBtnClick : this.addCCWorkRows.bind(this)
				})
				break;
			case TableBtn.delccwork:
				let selectedData2=props.cardTable.getCheckedRows(tableIds[1]);
				let indexArr2=[];
				selectedData2.forEach((val) => {
					indexArr2.push(val.index);
				});
				props.cardTable.delRowsByIndex(tableIds[1], indexArr2);
				this.isDelBtnEnable();
				//this.props.button.setDisabled(TableBtn.delccwork,true);//删除按钮禁用
				break;
			case TableBtn.addfeetype://要素类型
				let checkCostTypePk=[];
				props.cardTable.getVisibleRows(tableIds[2]).forEach((row)=>{
					checkCostTypePk.push(row.values['pk_costtype']);
				})
				//关联部门新增时弹出类似参照选择的模态框
				let param3={json:this.state.json,pk_org:this.state.pk_factory,checkCostTypePk:checkCostTypePk,loadWork:this.onAddCCostType.bind(this)}
				props.modal.show('modal',{
					title :'费用类型',/* 国际化处理： 工作中心this.state.json['10100CC-000022']*/
					content :<CCCostType config={param3}/>,
					beSureBtnClick : this.addCCCostTypeRows.bind(this)
				})
				break;
			case TableBtn.delfeetype:
				let selectedData3=props.cardTable.getCheckedRows(tableIds[2]);
				let indexArr3=[];
				selectedData3.forEach((val) => {
					indexArr3.push(val.index);
				});
				props.cardTable.delRowsByIndex(tableIds[2], indexArr3);
				this.props.button.setDisabled(TableBtn.delfeetype,true);//删除按钮禁用
				break;

		}
	}

	//启用
	onEnableCost(){
		//按钮传值操作需要做一次数据转换
		let enablestate=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
		this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:(enablestate.value?2:3)}});
		let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        if(formData.rows[0].values['pk_father']!=null&&formData.rows[0].values['pk_father'].value=='~'){
            formData.rows[0].values['pk_father'].value=null;
        }
        let cardData = this.props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1]]);
        //处理树节点数据选中状态及form表单数据
        let selectNode=this.props.syncTree.getSelectNode(this.config.treeId);
        //ajax请求
        ajax({
            url: urls['enableCostUrl'],
            data: cardData,
            success: (result) => {
                if(result.success){
					toast({color:'success',title:this.state.json['10100CC-000023']});/* 国际化处理： 启用成功！*/

					//表单数据
					let headData = result.data.head[this.config.formId];
					let deptData = result.data.bodys[this.config.tableIds[0]];
					let workData = result.data.bodys[this.config.tableIds[1]];
					let costTyprData = result.data.bodys[this.config.tableIds[2]];

					//清空表单
					this.props.form.EmptyAllFormValue(this.config.formId);
					//设置表单为所选树节点数据
					this.props.form.setAllFormValue({[this.config.formId]:headData});
					
					this.props.cardTable.setTableData(this.config.tableIds[0], deptData, false);

					this.props.cardTable.setTableData(this.config.tableIds[1], workData, false);
					this.props.cardTable.setTableData(this.config.tableIds[2], costTyprData, false);
                    
                    //刷新树节点、并选择当前操作数据为选择状态
                    let requestParam={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
					this.loadTree(requestParam,selectNode);//选中后开始加载部门数据
					this.onSelectTree(selectNode.refpk);
                }

            }
        });
	}

	//停用
	onDisableCost(){
		//按钮传值操作需要做一次数据转换
		let enablestate=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
		this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:(enablestate.value?2:3)}});
		let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        if(formData.rows[0].values['pk_father']!=null&&formData.rows[0].values['pk_father'].value=='~'){
            formData.rows[0].values['pk_father'].value=null;
        }
        let cardData = this.props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1],this.config.tableIds[2]]);
        //处理树节点数据选中状态及form表单数据
        let selectNode=this.props.syncTree.getSelectNode(this.config.treeId);
        //ajax请求
        ajax({
            url: urls['disableCostUrl'],
            data: cardData,
            success: (result) => {
                if(result.success){
					toast({color:'success',title:this.state.json['10100CC-000024']});/* 国际化处理： 停用成功！*/
					//刷新树节点、并选择当前操作数据为选择状态
                    let requestParam={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
					this.loadTree(requestParam,selectNode);//选中后开始加载部门数据
					//判断该数据是否需要显示，不显示则清空
					if(this.state.enablestate=='N'){
						//清空表单
						this.props.form.EmptyAllFormValue(formId);
						this.props.cardTable.setTableData(tableIds[2], {
							areacode:tableIds[2],
							rows:[]
						}, false);
						this.props.cardTable.setTableData(tableIds[1], {
							areacode:tableIds[1],
							rows:[]
						}, false);
						this.props.cardTable.setTableData(tableIds[0], {
							areacode:tableIds[0],
							rows:[]
						}, false);
					}else{
						this.onSelectTree(selectNode.refpk);
					}
                }

            }
        });
	}

	onPageInfoClick(){
		alert('PageInfoClick');
	}

	//关联部门编辑后事件
	ccdeptAfterEvent(props,moduleId,key,value,changedrows,index,record){
		if(key=='pk_dept'&&value){
			//校验重复数据
			let pk_depts=props.cardTable.getColValue(moduleId,key);
			let isDepeat=false;
			pk_depts.forEach((dept)=>{
				if((!dept.isEdit)&&dept.value==value.refpk){
					isDepeat=true;
				}
				
			})
			if(isDepeat){
				toast({content:this.state.json['10100CC-000025'],color:'warning'});/* 国际化处理： 请勿选择重复数据！*/
				props.cardTable.setValByKeysAndIndex(moduleId,index,{
					'pk_dept':{
						value:null,
						display:null,
					}
				})
				return ;
			}

			props.cardTable.setValByKeysAndIndex(moduleId,index,{
				'pk_dept.code':{
					value:value.refcode?value.refcode:null,
					display:value.refcode?value.refcode:null,
				}
			})
		}
	}

	//关联部门列表复选框选中事件（单选）
	ccdeptOnSelectedEvent(props,moduleId,record,index,status){
		if(moduleId=='ccworkcenters'){//关联工作中心
			let selectedRows = this.props.cardTable.getCheckedRows('ccworkcenters');//获取所有选中行数据
			if(selectedRows && selectedRows.length > 0){
				this.props.button.setDisabled({delccwork:false});//删除按钮可用	
			}
			else{
				this.props.button.setDisabled({delccwork:true});//删除按钮禁用	
			}
		}
		else if(moduleId=='ccdepts'){//关联部门
			let selectedRows = this.props.cardTable.getCheckedRows('ccdepts');//获取所有选中行数据
			if(selectedRows && selectedRows.length > 0){
				this.props.button.setDisabled({delccdept:false});//删除按钮可用	
			}
			else{
				this.props.button.setDisabled({delccdept:true});//删除按钮禁用	
			}
		}
		else{}
	}

	//关联部门列表复选框选中事件（全选）
	ccdeptOnSelectedAllEvent(props,moduleId,key){
		if(moduleId=='ccworkcenters'){//关联工作中心
			let selectedRows = this.props.cardTable.getCheckedRows('ccworkcenters');//获取所有选中行数据
			if(selectedRows && selectedRows.length > 0){
				this.props.button.setDisabled({delccwork:false});//删除按钮可用	
			}
			else{
				this.props.button.setDisabled({delccwork:true});//删除按钮禁用	
			}
		}
		else if(moduleId=='ccdepts'){//关联部门
			let selectedRows = this.props.cardTable.getCheckedRows('ccdepts');//获取所有选中行数据
			if(selectedRows && selectedRows.length > 0){
				this.props.button.setDisabled({delccdept:false});//删除按钮可用	
			}
			else{
				this.props.button.setDisabled({delccdept:true});//删除按钮禁用	
			}
		}
		else{}
	}

	//关联部门编辑前事件
	ccdeptBeforeEvent(props,moduleId,key,value,index,record){
		if(key=='pk_dept'){
			if(!(value.value&&value.value.length!=0)){
				return true;
			}
			let meta=props.meta.getMeta();
			let pk_dept = meta['ccdepts'].items.find(item => item.attrcode === 'pk_dept');
			ajax({
				url:this.config.urls['ccdeptrefqrycondition'],
				data:{pk_dept:value.value},
				success:(result)=>{
	
					if(result.success){
						pk_dept.queryCondition=()=>{
							return {
								pk_org:result.data
							}
						};
						props.meta.setMeta(meta);
						return true;
					}
				}
			});	
			return true;
		}else{
			let meta=props.meta.getMeta();
			let field = meta['ccdepts'].items.find(item => item.attrcode === key);
			return !field.disabled;
		}
	}

	//主表编辑后事件
	afterEvent(props,moduleId,key,value,oldValue){
		//编辑后时间目前主要处理停启用开关编辑事件
		if(key=='pk_factory'){
			this.state.pk_factory=value.value;
		}

		let selectNode=this.props.syncTree.getSelectNode(this.config.treeId);
		let status=this.props.form.getFormStatus('pk_group');
		if((!status||status=='browse')&&key=='enablestate'&&selectNode&&selectNode.refpk!=this.root.refpk){
			//
			let enablestate=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
			this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:!enablestate.value}});
			if(value.value){
				if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
                    toast({content:this.state.json['10100CC-000006'],color:'warning'});/* 国际化处理： 请选择要启用的数据！*/
                    return 
				}
				promptBox({
					color:'warning',
					title : this.state.json['10100CC-000007'],/* 国际化处理： 确认启用*/
                    content : this.state.json['10100CC-000008'],/* 国际化处理： 您确认启用所选数据？*/
					beSureBtnClick : this.onEnableCost.bind(this),
					cancelBtnClick:()=>{
						this.props.form.setFormItemsValue(this.config.formId,{
							enablestate:{
								display:null,
								value:!(value.value)
							}
						})
					}
				})
			}else{
				if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
                    toast({content:this.state.json['10100CC-000009'],color:'warning'});/* 国际化处理： 请选择要停用的数据！*/
                    return 
				}
				promptBox({
					color:'warning',
					title : this.state.json['10100CC-000010'],/* 国际化处理： 确认停用*/
                    content : this.state.json['10100CC-000011'],/* 国际化处理： 您确认停用所选数据？*/
					beSureBtnClick : this.onDisableCost.bind(this),
					cancelBtnClick:()=>{
						this.props.form.setFormItemsValue(this.config.formId,{
							enablestate:{
								display:null,
								value:!(value.value)
							}
						})
					}
				})
			}
		}
	}

	getTableHead(){
		alert('getTableHead');
	}

	//当业务单元参照值改变时，加载树结构数据
	onOrgChanged = (value) =>{
		let meta=this.props.meta.getMeta();
		meta[formId].items.map((item)=>{
			if(item.attrcode=="pk_principal"){
				item.queryCondition=function(){
					return {pk_org:value.refpk}//所属行业自定义档案参照
				};
			}
			//当业务单元参照值改变时，上级成本中心querycondition
			if(item.attrcode=='pk_father'){
				item.queryCondition=()=>{
					return {
						pk_org:value.refpk,
						isCurrentOrgCreated:true
					}
				}
			}
		});
		this.props.meta.setMeta(meta);

		let requestParam={ pk_org:value.refpk,enablestate:this.state.enablestate };
		this.state.curOrg.pk_org = value.refpk;
		this.state.curOrg.name = value.refname;
		//设置业务单元类型：是否工厂orgtype33；利润中心orgtype15
		//判断空组织的情况
		if(value.values){
			this.state.curOrg.isFactory=value.values['orgtype33'].value;
			this.state.curOrg.isBenifity=value.values['orgtype15'].value;
			//此处做了一个兼容，应该是业务参照数据里包含orgtype5的，但前期版本没加
			this.state.curOrg.isFinanceorg=value.values['orgtype5'] ? value.values['orgtype5'].value : 'Y';
		}
        this.setState(this.state);

		//卡片页面点查询，再返回卡片页面时：左侧树选中点查询之前选中的节点
        let selectNode=this.state.cacheRefPk==''?null:{refpk:this.props.cacheRefPk};
        setTimeout(() => {
            this.setState({cacheRefPk:''});
        }, 10);

		this.loadTree(requestParam,selectNode);//选中后开始加载部门数据
		
		this.props.syncTree.cancelSelectedNode(this.config.treeId);

		//卡片页面点查询，再返回卡片页面时：根据左侧数据选中的节点，加载右侧表单数据
        // if(this.props.cacheOrg != '' && this.state.cacheRefPk != ''){       
        //     this.onSelectTree(this.state.cacheRefPk);
        // }

		//处理模板上关联部门和关联工作重心参照的过滤条件
		meta[tableIds[0]].items.map((item)=>{
			if(item.attrcode=="pk_dept"){
				item.queryCondition=()=>{
					return {
						pk_org:value.refpk
					}
				}
			}
		});
	}

	//加载树结构数据
	loadTree(requestParam,selectTreeNode){
        ajax({
            url:urls['loadtreeurl'],
            data:requestParam,//{pkorg:this.state.curOrg.pk_org},
            success:(result)=>{
                    if(result.success){
                        let data = [Object.assign( {...this.root} , {children : result.data} )];
                        //同步树  加载全部数据
                        this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                        //展开节点  设置默认展开项
						this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
						this.props.syncTree.setNodeSelected(this.config.treeId,this.root.refpk)
						//设置选中节点数据(以下处理逻辑为满足启用停用数据切换)
                        if(!selectTreeNode||selectTreeNode.refpk=='~'){
							this.props.form.EmptyAllFormValue(this.config.formId);
								this.props.cardTable.setTableData(tableIds[2], {
									areacode:tableIds[2],
									rows:[]
								});
								this.props.cardTable.setTableData(tableIds[1], {
									areacode:tableIds[1],
									rows:[]
								});
								this.props.cardTable.setTableData(tableIds[0], {
									areacode:tableIds[0],
									rows:[]
								});
							this.setButtonDisable();
                            return;
                        }else{
                            selectTreeNode = this.props.syncTree.getSyncTreeValue(this.config.treeId,selectTreeNode.refpk);
                            //如果选中的节点数据不显示，则清空form表单，否则设置该节点为选中状态
                            if(selectTreeNode){
                                this.props.syncTree.openNodeByPk(this.config.treeId, selectTreeNode.refpk);
                                this.props.syncTree.setNodeSelected(this.config.treeId,selectTreeNode.refpk);
                            }else{
                                this.props.syncTree.cancelSelectedNode(this.config.treeId);
								this.props.form.EmptyAllFormValue(this.config.formId);
								this.props.cardTable.setTableData(tableIds[2], {
									areacode:tableIds[2],
									rows:[]
								});
								this.props.cardTable.setTableData(tableIds[1], {
									areacode:tableIds[1],
									rows:[]
								});
								this.props.cardTable.setTableData(tableIds[0], {
									areacode:tableIds[0],
									rows:[]
								});
                            }
                        }
                    }
                }
            });
	}
	
	//处理树结构数据
	dealTreeData(data){
        let deleteDataChildrenProp = function(node){
			node.beforeName=node.code?(node.code+'  '):'';
            if(!node.children || node.children.length == 0) {

                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

	//树节点单击选中事件
	onSelectTree(refpk,prompt){
		//编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(formId);
		this.setButtonDisable();
        if(refpk == this.root.refpk){
			//清空表单
			this.props.form.EmptyAllFormValue(formId);
			this.props.cardTable.setTableData(tableIds[2], {
				areacode:tableIds[2],
				rows:[]
			}, false);
			this.props.cardTable.setTableData(tableIds[1], {
				areacode:tableIds[1],
				rows:[]
			}, false);
			this.props.cardTable.setTableData(tableIds[0], {
				areacode:tableIds[0],
				rows:[]
			}, false);
			//根节点维护pk_factory字段
			this.state.pk_factory='';
			//如果刷新成功，需要给出提示
			if(prompt&&(prompt instanceof Function)){
				prompt();
			}
            return;
        }
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        ajax({
            url:this.config.urls['queryCardUrl'],
            data:{
				headAreaCode:formId,
				pk_costcenter: refpk,
				pk_org: this.state.curOrg.pk_org
			},
            success:(result)=>{

                if(result.success){
					//适配显示公式
                    if(result.formulamsg&&result.formulamsg instanceof Array&&result.formulamsg.length>0){
                        this.props.dealFormulamsg(
                            result.formulamsg,
                            {
                                formId:"form"
                            }
                        );
                    }

					//表单数据
					let headData = result.data.head[formId];
					let deptData = result.data.bodys[tableIds[0]]?result.data.bodys[tableIds[0]]:{
						areacode:tableIds[0],
						rows:[]
					};
					let workData = result.data.bodys[tableIds[1]]?result.data.bodys[tableIds[1]]:{
						areacode:tableIds[1],
						rows:[]
					};
					let costTypeData = result.data.bodys[tableIds[2]]?result.data.bodys[tableIds[2]]:{
						areacode:tableIds[2],
						rows:[]
					};

                    //清空表单
                    this.props.form.EmptyAllFormValue(formId);
                    //设置表单为所选树节点数据
					this.props.form.setAllFormValue({[formId]:headData});
					
					this.props.cardTable.setTableData(tableIds[0], deptData);

					this.props.cardTable.setTableData(tableIds[1], workData);

					this.props.cardTable.setTableData(tableIds[2], costTypeData);
					//查询时转换启用状态
					let enablestate=this.props.form.getFormItemsValue(formId,'enablestate');
					this.props.form.setFormItemsValue(formId,{'enablestate':{value:(enablestate.value==2?true:false)}});

					//维护pk_factory
					this.state.pk_factory=this.props.form.getFormItemsValue(formId,'pk_factory').value;
					//如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}
                }
            }
        });
	}

	/**
     * checkbox change 事件
     */
    onCheckBoxChange(checked){
		this.state.checked=!this.state.checked;
		this.setState(this.state);
        if(!this.state.checked){
			this.setState({enablestate:'N'});
		}else{
			this.setState({enablestate:'Y'});//-1标识显示所有，2标识显示启用
		}
		
		if(!this.state.curOrg.pk_org){
			return;
        }
        
        let selectNode=this.props.syncTree.getSelectNode(this.config.treeId);

		setTimeout(() => {
            let requestParam={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
			this.loadTree(requestParam,selectNode);

        }, 10);

    }

	onMouseEnterEve(key){
        //设置
        if(key === this.root.refpk){
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj );
        }

    }

	/**
     * 新增
     */
    onAddEps(selectNode){
        this.onButtonClick(this.props,'add');
    }

    /**
     * 编辑
     */
    onEditEps(selectedTreeNode){
		this.props.syncTree.setNodeSelected(this.config.treeId,selectedTreeNode.refpk);
		this.onSelectTree(selectedTreeNode.refpk,()=>{
			this.onButtonClick(this.props,'update');
		});
    }

    /**
     * 删除
     */
    onDeleteEps(selectedTreeNode){
		this.props.syncTree.setNodeSelected(this.config.treeId,selectedTreeNode.refpk);
		this.onSelectTree(selectedTreeNode.refpk);
        this.onButtonClick(this.props,'delete');
    }

	render() {
		let { cardTable, form, button, modal, cardPagination, DragWidthCom, syncTree,BillHeadInfo } = this.props;
		const {createSyncTree}=syncTree;
		const {createCardPagination} = cardPagination;
		const {createBillHeadInfo} = BillHeadInfo;
		let buttons = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		
		//卡片页面点查询，再返回到卡片页面时，设置业务单元为查询前选中的业务单元
        // if(this.props.cacheOrg != ''){
        //     setTimeout(() => {
        //         this.setState({curOrg:this.props.cacheOrg})
        //     }, 10);
        // }
		console.log('status::', this.props.getUrlParam(status), this.props.form.getFormStatus('pk_group'))
		return (
			<div  id='nc-bill-card' className='cost-bill-card'>
				<div className="nc-bill-card cost-bill-card">
						<NCAffix>
							{createModal('modal',{noFooter:false})}
							{createModal('costcentergrp',{noFooter:true})}
							<TitleBar
								initShowBackBtn= {false}
								ttile= {this.state.json['10100CC-000000']}//this.props.configParams.title
								area= {head}
								referCom={(referLoader) => {
										console.log('this::', this)
										return BusinessUnitTreeRef({
										fieldid : 'BusinessUnitTreeRef',
										disabled: this.state.status=='browse'?false:true,//是否禁用
										isTreelazyLoad:false,
										queryCondition:{
											AppCode:appcode,
											TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder,nccloud.web.uapbd.costcenter.action.CostCenterSqlBuilder'
										},
										onChange: (value) => {
											console.log('avleu::', value)
											referLoader.handleLoader(value)
										},
										value: {refpk:referLoader.pk_org.pk_org, refname: referLoader.pk_org.name}
									})}
								}
								referLoader = {{
									showStar: true,
									pk_org: this.state.curOrg,
									handleLoader: this.onOrgChanged
								}}
								handleButtonClick={ headButtonEvent.bind(this) }
								Fprops={this.props}
							>
								{<span className="showOff" style={{marginLeft:20}}>                     
									<Checkbox
											disabled={this.state.status=='browse'?false:true}//是否禁用
											defaultChecked={false}
											checked={this.state.checked}
											onChange={this.onCheckBoxChange.bind(this)}
											size="lg"
										>
											{this.state.json['10100CC-000028']/* 国际化处理： 显示停用*/}
									</Checkbox>
								</span>}
							</TitleBar>
						</NCAffix>

						<div className="tree-card">
							<DragWidthCom
								// 左树区域
								leftDom = {
									<div className="tree-area" fieldid = 'costCenterTree_tree'>
										{createSyncTree({
											treeId :this.config.treeId,
											needEdit: (this.state.curOrg.pk_org&&this.state.curOrg.pk_org.length>0)?true:false, //根据是否选择了主组织判断是否启用编辑
											showLine: false, //显示连线
											disabledSearch:this.state.status=='browse'?false:true, //是否禁用搜索框
											onSelectEve: this.onSelectTree.bind(this),//选择
											clickEditIconEve: this.onEditEps.bind(this), //编辑点击 回调
											clickAddIconEve: this.onAddEps.bind(this), //新增点击 回调
											clickDelIconEve: this.onDeleteEps.bind(this), // 删除点击 回调
											onMouseEnterEve:this.onMouseEnterEve.bind(this),
											showModal:false
										})}
									</div>}     //左侧区域dom
								// 右卡片区域
								rightDom = {
									<div className="card-area card-right">
										<div className="nc-bill-form-area">
											{createForm('pk_group', {
													onAfterEvent: this.afterEvent.bind(this),
													cancelPSwitch:true
											})}
										</div>
										
										<div className="nc-bill-table-area">
											{createCardTable("ccdepts", {
												onBeforeEvent:this.ccdeptBeforeEvent.bind(this),
												onAfterEvent:this.ccdeptAfterEvent.bind(this),
												onSelected:this.ccdeptOnSelectedEvent.bind(this),//关联部门列表复选框选中事件（单选）
												onSelectedAll:this.ccdeptOnSelectedAllEvent.bind(this),//关联部门列表复选框选中事件（全选）
												showIndex:true,
												showCheck:true,
												tableHead:()=>{
													return <div className="shoulder-definition-area">																
																{createButtonApp({
																	area: 'ccdepts_area',
																	buttonLimit: 3, 
																	onButtonClick: this.onCCButtonClick.bind(this), 
																	popContainer: document.querySelector('.header-button-area')													
																})}																
															</div>
												}
											})}
										</div>

										<div className="nc-bill-table-area">
											{createCardTable("ccworkcenters", {
												showIndex:true,
												showCheck:true,
												onSelected:this.ccdeptOnSelectedEvent.bind(this),//关联工作中心列表复选框选中事件（单选）
												onSelectedAll:this.ccdeptOnSelectedAllEvent.bind(this),//关联工作中心列表复选框选中事件（全选）
												tableHead:()=>{
													return <div className="shoulder-definition-area" /*style={{position:'absolute',top:'5px',right:'96px'}}*/>																
																{createButtonApp({
																	area: 'ccwork_area',
																	buttonLimit: 3, 
																	onButtonClick: this.onCCButtonClick.bind(this), 
																	popContainer: document.querySelector('.header-button-area')													
																})}																
															</div>
												}	
											})}
										</div>
										<div className="nc-bill-table-area">
											{createCardTable("ccfeetype", {
												showIndex:true,
												showCheck:true,
												onSelected:this.ccdeptOnSelectedEvent.bind(this),//关联费用类型列表复选框选中事件（单选）
												onSelectedAll:this.ccdeptOnSelectedAllEvent.bind(this),//关联费用类型列表复选框选中事件（全选）
												tableHead:()=>{
													return <div className="shoulder-definition-area" /*style={{position:'absolute',top:'5px',right:'96px'}}*/>																
																{createButtonApp({
																	area: 'ccfeetype_area',
																	buttonLimit: 3, 
																	onButtonClick: this.onCCButtonClick.bind(this), 
																	popContainer: document.querySelector('.header-button-area')													
																})}																
															</div>
												}	
											})}
										</div>
															
										{createModal('delete', {
											title: this.state.json['10100CC-000026'],/* 国际化处理： 注意*/
											content: this.state.json['10100CC-000027'],/* 国际化处理： 确认删除？*/
											beSureBtnClick: this.delConfirm
										})}
									</div> }     //右侧区域dom

								defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百
							/>
						</div>				
				</div>
				<ExcelImport
                    {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = 'costcenter'//单据类型
                    selectedPKS = {[this.props.syncTree.getSelectNode(this.config.treeId)?this.props.syncTree.getSelectNode(this.config.treeId).refpk:null]}
					appcode='10100CC'
					pagecode='10100CC_costcenter'
					referVO={{ignoreTemplate:false}}
				/>
			</div>
			
		);
	}
}

export default CostcenterCard = createPage({
	billinfo:{
        billtype:'extcard',
        pagecode:pageId,
		headcode:formId,
		bodycode:tableIds
    },
	initTemplate: ()=>{}
})(CostcenterCard);














// <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'  >
// <div className='header-title-search-area'>
// 	{createBillHeadInfo({
// 		title:this.state.json['10100CC-000000']/* 国际化处理： 成本中心*/,
// 		initShowBackBtn:false
// 	})}
// </div>
 {/*业务单元参照*/}
{/* <div className="search-box">
	{BusinessUnitTreeRef({
		fieldid : 'BusinessUnitTreeRef',
		disabled:this.state.status=='browse'?false:true,//是否禁用
		isTreelazyLoad:false,
		queryCondition:orgPermCondition,
		onChange:this.onOrgChanged.bind(this),
		value:{refpk:this.state.curOrg.pk_org,refname:this.state.curOrg.name}
	})}
</div>

{<span className="showOff" style={{marginLeft:20}}>                     
	<Checkbox
		disabled={this.state.status=='browse'?false:true}//是否禁用
		defaultChecked={false}
		checked={this.state.checked}
		onChange={this.onCheckBoxChange.bind(this)}
		size="lg"
	>
		{this.state.json['10100CC-000028']/* 国际化处理： 显示停用*/}
// 	</Checkbox>
// </span>} */}

	{/* 按钮组 btn-group*/}

{/* <div className="header-button-area header-btns">
	{createButtonApp({
		area: head,
		buttonLimit: 3, 
		onButtonClick: this.onButtonClick.bind(this), 
		popContainer: document.querySelector('.header-button-area')

	})}
</div>
                </NCDiv> */}



// Util.initPage(
		// 	props,
		// 	pageId,
		// 	'10100CC',//多语资源编码
		// 	(data)=>{
		// 		if(data.button){
		// 			let button = data.button;
		// 			//适配导入导出功能
		// 			let arr = [];
		// 			//uapbd 模块名  uapbd_sgmenu 单据类型名 回调函数直接进行复制
		// 			let excelimportconfig = excelImportconfig(props,'uapbd','costcenter');
		// 			props.button.setUploadConfig("import",excelimportconfig);
		// 			props.button.setButtons(button);
		// 		};
		// 		if(data.template){
		// 			let meta = data.template;
		// 			//所属利润中心加主组织权限
		// 			let pk_profitcenter = meta['pk_group'].items.find(item => item.attrcode === 'pk_profitcenter');
		// 			pk_profitcenter.queryCondition=()=>{
		// 				return {
		// 					AppCode:appcode,
		// 					TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
		// 				}
		// 			}
		// 			//所属工厂加主组织权限
		// 			let pk_factory = meta['pk_group'].items.find(item => item.attrcode === 'pk_factory');
		// 			pk_factory.queryCondition=()=>{
		// 				return {
		// 					AppCode:appcode,
		// 					GridRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
		// 				}
		// 			}
		// 			//所属财务组织加主组织权限
		// 			let pk_financeorg = meta['pk_group'].items.find(item => item.attrcode === 'pk_financeorg');
		// 			pk_financeorg.queryCondition=()=>{
		// 				return {
		// 					AppCode:appcode,
		// 					TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
		// 				}
		// 			}
		// 			props.meta.setMeta(meta);
		// 		}
		// 		//如果个性化设置了默认业务单元，则自动带出主组织参照
		// 		if(data.context&&data.context.pk_org){
		// 			this.state.curOrg.pk_org=data.context.pk_org;
		// 			this.state.curOrg.name=data.context.org_Name;
		// 		};
		// 		//维护root数据
		// 		//自定义根节点
		// 		this.root = {
		// 			"isleaf": false,
		// 			"key":"~",
		// 			"title":this.state.json['10100CC-000000'],/* 国际化处理： 成本中心*/
		// 			"id":"~",
		// 			"innercode":"~",
		// 			"pid": "",
		// 			"refname": this.state.json['10100CC-000000'],/* 国际化处理： 成本中心*/
		// 			"refpk": "~"
		// 		};
		// 	},
		// 	()=>{
		// 		let data = [Object.assign( {...this.root} , {children : null} )];
		// 		this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
		// 		this.props.button.setButtonsVisible({
		// 			query:true,
		// 			costcentergrp:true,
		// 			import:true,
		// 			refresh:true,
		// 			cancel:false,
		// 			save:false,
		// 			saveAdd:false,
		// 			addccdept:false,
		// 			delccdept:false,
		// 			addccwork:false,
		// 			delccwork:false
		// 		});

		// 		this.setButtonDisable();

		// 		//如果个性化设置了默认业务单元，需要预加载所有数据
		// 		ajax({
		// 			url: urls['orgtypeqry'],
		// 			data: {pk_org:this.state.curOrg.pk_org},
		// 			success: (result) => {
		// 				if(result.success&&result.data){
		// 					this.onOrgChanged({
		// 						refpk:this.state.curOrg.pk_org,
		// 						refname:this.state.curOrg.name,
		// 						values:{
		// 							orgtype33:{
		// 								value:(result.data['orgtype33']==true?'Y':'N')
		// 							},
		// 							orgtype15:{
		// 								value:(result.data['orgtype15']==true?'Y':'N')
		// 							}
		// 						}
		// 					})
		// 				}
		// 			}
		// 		});
		// 	},
		// 	this
		// );


		// onButtonClick = (props,id)=>{
		// 	console.log('onButtonClick:', props, id)
		// 	if(id=='query'){
		// 		let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获取左侧树选中节点
		// 		let cacheRefPk = '';//记录左侧树-选中节点pk
		// 		if(selectNode != null){
		// 			cacheRefPk = selectNode.refpk;
		// 		}
		// 		//卡片页面点查询时，把业务单元pk和左侧树选中节点的pk传给父组件，在父组件的状态中维护（返回卡片页面时还原数据）
		// 		this.props.config('Y',{json:this.state.json,cacheOrg:this.state.curOrg,cacheRefPk:cacheRefPk});
		// 		return;
		// 	}
		// 	if(this.state.curOrg.pk_org.length==0){
		// 		return;
		// 	}
		// 	switch (id) {
		// 		case 'saveAdd':
		// 			//form表单必输项校验
		// 			if(!this.props.form.isCheckNow(this.config.formId)){
		// 				toast({color:'danger',content:this.state.json['10100CC-000001']});/* 国际化处理： 请输入必输项！*/
		// 				return;
		// 			}
					
		// 			this.state.ccworksdata=[];
		// 			this.state.ccdeptsdata=[];
		// 			this.setState(this.state);
		// 			//按钮传值操作需要做一次数据转换
		// 			let enablestate1=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
		// 			this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:(enablestate1.value=='2'?2:3)}});
		// 			let formData1= this.props.form.getAllFormValue(this.config.formId);//获得表单信息
		// 			if(formData1.rows[0].values['pk_father']!=null&&formData1.rows[0].values['pk_father'].value=='~'){
		// 				formData1.rows[0].values['pk_father'].value=null;
		// 			}
					
		// 			let cardData1 = props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1]]);
	
		// 			//处理树节点数据选中状态及form表单数据
		// 			//ajax请求
		// 			let saveAddCallBack=()=>ajax({
		// 				url: urls['saveCostUrl'],
		// 				data: cardData1,
		// 				success: (result) => {
		// 					if(result.success){
		// 						toast({color:'success',title:this.state.json['10100CC-000002']});/* 国际化处理： 保存成功！*/
		// 						//设置表单浏览态
		// 						this.props.form.setFormStatus(this.config.formId, 'browse');
		// 						//设置树可用
		// 						this.props.syncTree.setNodeDisable(this.config.treeId,false);
	
		// 						//表单数据
		// 						let headData1 = result.data.head[this.config.formId];
		// 						let deptData1 = result.data.bodys[this.config.tableIds[0]];
		// 						let workData1 = result.data.bodys[this.config.tableIds[1]];
	
		// 						//清空表单
		// 						this.props.form.EmptyAllFormValue(this.config.formId);
		// 						//设置表单为所选树节点数据
		// 						this.props.form.setAllFormValue({[this.config.formId]:headData1});
								
		// 						this.props.cardTable.setTableData(this.config.tableIds[0], deptData1, false);
	
		// 						this.props.cardTable.setTableData(this.config.tableIds[1], workData1, false);
								
		// 						//刷新树节点、并选择当前操作数据为选择状态
		// 						let selectNode1={refpk:''};
		// 						selectNode1.refpk=headData1.rows[0].values['pk_costcenter'].value;
		// 						let requestParam1={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
		// 						this.loadTree(requestParam1,selectNode1);//选中后开始加载部门数据
		// 						this.updateButtonStatus();
		// 						this.state.status='browse';
		// 						this.setState(this.state);
		// 						this.onButtonClick(props,'add');
		// 					}
	
		// 				}
		// 			});
		// 			this.props.validateToSave(cardData1,saveAddCallBack,{'pk_group':'form','audit':'form','ccdepts':'cardTable','ccworkcenters':'cardTable'},'extcard');
		// 			break;
		// 		case 'import':
		// 			break;
		// 		case 'export'://NC导出功能必须要选择数据（即只能单条导出）
		// 			if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
		// 				toast({content:this.state.json['10100CC-000003'],color:'warning'});/* 国际化处理： 请先选择要导出的数据！*/
		// 				return ;
		// 			}
		// 			this.setState({
	
		// 			},()=>{
		// 				this.props.modal.show('exportFileModal');
		// 			});
		// 			break;
		// 		case 'refresh':
		// 			let selectTreeNode=this.props.syncTree.getSelectNode(this.config.treeId);
		// 			let requestParam={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
		// 			this.loadTree(requestParam,selectTreeNode);
		// 			//需要刷新卡片数据
		// 			if(selectTreeNode){
		// 				this.onSelectTree(selectTreeNode.refpk,()=>{
		// 					toast({color:'success',title:this.state.json['10100CC-000004']});/* 国际化处理： 刷新成功！*/
		// 				});
		// 			}else{
		// 				toast({color:'success',title:this.state.json['10100CC-000004']});/* 国际化处理： 刷新成功！*/
		// 			}
		// 			break;
		// 		case 'costcentergrp':
		// 			this.props.modal.show('costcentergrp',{
		// 				title : this.state.json['10100CC-000005'],/* 国际化处理： 成本中心组*/
		// 				content : <CostcenterGRP json={this.state.json} config={this.state.curOrg.pk_org}/>
		// 			});
		// 			break;
		// 		case 'enable':
		// 			if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
		// 				toast({content:this.state.json['10100CC-000006'],color:'warning'});/* 国际化处理： 请选择要启用的数据！*/
		// 				return 
		// 			}
		// 			promptBox({
		// 				color:'warning',
		// 				title : this.state.json['10100CC-000007'],/* 国际化处理： 确认启用*/
		// 				content : this.state.json['10100CC-000008'],/* 国际化处理： 您确认启用所选数据？*/
		// 				beSureBtnClick : this.onEnableCost.bind(this)
		// 			})
		// 			break;
		// 		case 'disable':
		// 			if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
		// 				toast({content:this.state.json['10100CC-000009'],color:'warning'});/* 国际化处理： 请选择要停用的数据！*/
		// 				return 
		// 			}
		// 			promptBox({
		// 				color:'warning',
		// 				title : this.state.json['10100CC-000010'],/* 国际化处理： 确认停用*/
		// 				content : this.state.json['10100CC-000011'],/* 国际化处理： 您确认停用所选数据？*/
		// 				beSureBtnClick : this.onDisableCost.bind(this)
		// 			})
						
		// 			break;
		// 		case 'add':
		// 			//设置停启用开关不可编辑
		// 			this.props.form.setFormItemsDisabled(formId,{'enablestate':true});
		// 			//设置子表编辑状态
		// 			this.props.cardTable.setStatus(tableIds[0],'edit',()=>{});
		// 			this.props.cardTable.setStatus(tableIds[1],'edit',()=>{});
	
		// 			//新增时清空子表数据
		// 			this.props.cardTable.setTableData(tableIds[1], {
		// 				areacode:tableIds[1],
		// 				rows:[]
		// 			}, false);
		// 			this.props.cardTable.setTableData(tableIds[0], {
		// 				areacode:tableIds[0],
		// 				rows:[]
		// 			}, false);
		// 			//更改按钮状态变量
		// 			//填充默认值
		// 			this.props.syncTree.setNodeDisable(this.config.treeId,true);//设置树不可编辑
		// 			this.props.form.EmptyAllFormValue(this.config.formId);
		// 			this.props.form.setFormStatus(this.config.formId,'add');
		// 			let formVal=this.props.form.getAllFormValue(this.config.formId);
		// 			//适配编辑公式
		// 			formVal.rows[0].values['enablestate'].value='2';
		// 			formVal.rows[0].values['enablestate'].display='启用';
		// 			//新增时需要填充默认值
		// 			formVal.rows[0].values['pk_org'].value=this.state.curOrg.pk_org;
		// 			formVal.rows[0].values['pk_org'].display=this.state.curOrg.name;
					
		// 			if(this.props.syncTree.getSelectNode(this.config.treeId)&&this.props.syncTree.getSelectNode(this.config.treeId).refpk!=this.root.refpk){
		// 				formVal.rows[0].values['pk_father'].value=this.props.syncTree.getSelectNode(this.config.treeId).refpk;
		// 				formVal.rows[0].values['pk_father'].display=this.props.syncTree.getSelectNode(this.config.treeId).refname;
		// 			}
	
		// 			if(this.state.curOrg.isFinanceorg=='Y'){
		// 				formVal.rows[0].values['pk_financeorg'].value=this.state.curOrg.pk_org;
		// 				formVal.rows[0].values['pk_financeorg'].display=this.state.curOrg.name;
		// 			}
					
		// 			if(this.state.curOrg.isBenifity=='Y'){
		// 				formVal.rows[0].values['pk_profitcenter'].value=this.state.curOrg.pk_org;
		// 				formVal.rows[0].values['pk_profitcenter'].display=this.state.curOrg.name;
		// 			}
	
		// 			if(this.state.curOrg.isFactory=='Y'){
		// 				formVal.rows[0].values['pk_factory'].value=this.state.curOrg.pk_org;
		// 				formVal.rows[0].values['pk_factory'].display=this.state.curOrg.name;
		// 				//维护所属工厂字段
		// 				this.state.pk_factory=this.state.curOrg.pk_org;
		// 			}else{
		// 				this.state.pk_factory='';
		// 			}
		// 			this.props.form.setFormItemsDisabled(this.config.formId,{'pk_financeorg':this.state.curOrg.isFinanceorg=='Y','pk_profitcenter':this.state.curOrg.isBenifity=='Y','pk_factory':this.state.curOrg.isFactory=='Y'});
	
		// 			formVal.rows[0].values['cctype'].display=this.state.json['10100CC-000012'];/* 国际化处理： 基本生产*/
		// 			formVal.rows[0].values['cctype'].value='2';
	
		// 			this.props.form.setAllFormValue({[this.config.formId]:formVal});
		// 			this.updateButtonStatus();
		// 			this.state.status='add';
		// 			this.setState(this.state);
		// 			this.props.button.setDisabled({
		// 				//saveAdd:false,
		// 				delccdept:true,
		// 				delccwork:true
		// 			});
		// 			this.props.button.setButtonVisible({
		// 				saveAdd:true
		// 			});
		// 			break;
		// 		case 'update':
		// 			//设置停启用开关不可编辑
		// 			this.props.form.setFormItemsDisabled(formId,{'enablestate':true});
		// 			//适配编辑公式
		// 			let enablestate11=this.props.form.getFormItemsValue(formId,'enablestate');
		// 			this.props.form.setFormItemsValue(formId,{'enablestate':{value:(enablestate11.value==true?'2':'3')}});
		// 			//设置子表编辑状态
		// 			this.props.cardTable.setStatus(tableIds[0],'edit',()=>{});
		// 			this.props.cardTable.setStatus(tableIds[1],'edit',()=>{});
		// 			this.props.syncTree.setNodeDisable(this.config.treeId,true);//设置树不可编辑
		// 			this.props.form.setFormStatus(this.config.formId,'edit');
		// 			this.updateButtonStatus();
		// 			this.state.status='edit';
		// 			this.setState(this.state);
		// 			this.props.button.setButtonVisible({
		// 				saveAdd:false
		// 			});
	
		// 			//this.isDelBtnEnable();
		// 			//修改时关联部门和工作中心表体删除按钮默认禁用
		// 			this.props.button.setDisabled({delccdept:true,delccwork:true});
	
		// 			break;
		// 		case 'cancel':
		// 			promptBox({
		// 				color:'warning',
		// 				title : this.state.json['10100CC-000013'],/* 国际化处理： 确认取消*/
		// 				content : this.state.json['10100CC-000014'],/* 国际化处理： 是否确认取消？*/
		// 				beSureBtnClick : (()=>{
		// 					//设置停启用开关可编辑
		// 					this.props.form.setFormItemsDisabled(formId,{'enablestate':false});
		// 					//取消时维护子表数据
		// 					this.state.ccworksdata=[];
		// 					this.state.ccdeptsdata=[];
		// 					this.setState(this.state);
						
		// 					//同步树 取消的逻辑
					
		// 					if(this.props.syncTree.getSelectNode(this.config.treeId)&&this.props.syncTree.getSelectNode(this.config.treeId).refpk!='~'){
		// 						this.onSelectTree(this.props.syncTree.getSelectNode(this.config.treeId).refpk);
		// 					}else{
		// 						//没有选中项  清空所有数据
		// 						this.props.form.EmptyAllFormValue(this.config.formId);
		// 						this.props.cardTable.setTableData(tableIds[1], {
		// 							areacode:tableIds[1],
		// 							rows:[]
		// 						}, false);
		// 						this.props.cardTable.setTableData(tableIds[0], {
		// 							areacode:tableIds[0],
		// 							rows:[]
		// 						}, false);
		// 						this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
		// 					}
		// 					this.props.form.setFormStatus(this.config.formId, 'browse');
		// 					//设置树可用
		// 					this.props.syncTree.setNodeDisable(this.config.treeId,false);
		// 					this.updateButtonStatus();
		// 					this.state.status='browse';
		// 					this.setState(this.state);
		// 					//设置子表编辑状态
		// 					this.props.cardTable.setStatus(tableIds[0],'browse',()=>{});
		// 					this.props.cardTable.setStatus(tableIds[1],'browse',()=>{});
		// 				})
		// 			});
		// 			break;
		// 		case 'save':
		// 			//form表单必输项校验
		// 			if(!this.props.form.isCheckNow(this.config.formId)){
		// 				toast({color:'danger',content:this.state.json['10100CC-000001']});/* 国际化处理： 请输入必输项！*/
		// 				return;
		// 			}
	
		// 			//保存时维护子表数据
		// 			this.state.ccworksdata=[];
		// 			this.state.ccdeptsdata=[];
		// 			this.setState(this.state);
		// 			//按钮传值操作需要做一次数据转换
		// 			let enablestate=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
		// 			this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:(enablestate.value=='2'?2:3)}});
		// 			let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
		// 			if(formData.rows[0].values['pk_father']!=null&&formData.rows[0].values['pk_father'].value=='~'){
		// 				formData.rows[0].values['pk_father'].value=null;
		// 			}
					
		// 			if(!formData.rows[0].values['pk_financeorg'] && formData.rows[0].values['pk_profitcenter'] && !formData.rows[0].values['pk_factor']){
		// 				toast({color:'danger',content:'成本中心上“所属财务组织”、“所属利润中心”、“所属工厂”不可以同时为空!'});
		// 				return;
		// 			}
	
		// 			let cardData = props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1]]);
	
		// 			//ajax请求
		// 			let saveCallBack=()=>ajax({
		// 				url: urls['saveCostUrl'],
		// 				data: cardData,
		// 				success: (result) => {
		// 					if(result.success){
		// 						//设置子表编辑状态
		// 						this.props.cardTable.setStatus(tableIds[0],'browse',()=>{});
		// 						this.props.cardTable.setStatus(tableIds[1],'browse',()=>{});
		// 						toast({color:'success',title:this.state.json['10100CC-000002']});/* 国际化处理： 保存成功！*/
		// 						//设置表单浏览态
		// 						this.props.form.setFormStatus(this.config.formId, 'browse');
		// 						//设置树可用
		// 						this.props.syncTree.setNodeDisable(this.config.treeId,false);
	
		// 						//表单数据
		// 						let headData = result.data.head[this.config.formId];
		// 						let deptData = result.data.bodys[this.config.tableIds[0]];
		// 						let workData = result.data.bodys[this.config.tableIds[1]];
	
		// 						//清空表单
		// 						this.props.form.EmptyAllFormValue(this.config.formId);
		// 						//设置表单为所选树节点数据
		// 						this.props.form.setAllFormValue({[this.config.formId]:headData});
								
		// 						this.props.cardTable.setTableData(this.config.tableIds[0], deptData, false);
	
		// 						this.props.cardTable.setTableData(this.config.tableIds[1], workData, false);
								
		// 						//刷新树节点、并选择当前操作数据为选择状态
		// 						let selectNode={refpk:''};
		// 						selectNode.refpk=headData.rows[0].values['pk_costcenter'].value;
		// 						let requestParam={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
		// 						this.loadTree(requestParam,selectNode);//选中后开始加载部门数据
		// 						this.onSelectTree(selectNode.refpk);
		// 						this.updateButtonStatus();
		// 						this.state.status='browse';
		// 						this.setState(this.state);
		// 						//设置停启用开关可编辑
		// 						this.props.form.setFormItemsDisabled(formId,{'enablestate':false});
		// 					}
	
		// 				}
		// 			});
		// 			this.props.validateToSave(cardData,saveCallBack,{'pk_group':'form','audit':'form','ccdepts':'cardTable','ccworkcenters':'cardTable'},'extcard');
		// 			break;
		// 		case "delete":
	
		// 			if (!this.props.syncTree.getSelectNode(this.config.treeId)) {
			
		// 				NCMessage.create({content: this.state.json['10100CC-000015'], color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
		// 				return;
			
		// 			}
		// 			if(this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk){
		// 				NCMessage.create({content: this.state.json['10100CC-000016'], color: 'warning'});//默认top/* 国际化处理： 根节点不能删除*/
		// 				return;
			
		// 			}
		// 			let message = this.state.json['10100CC-000017']/* 国际化处理： 确认要删除所选数据吗？*/
		// 			if(this.props.syncTree.getSelectNode(this.config.treeId).hasOwnProperty('children') && this.props.syncTree.getSelectNode(this.config.treeId).children.length>0){
		// 				NCMessage.create({content: this.state.json['10100CC-000018'], color: 'warning'});//默认top/* 国际化处理： 该节点包含子节点，不允许删除！*/
		// 				return;
		// 			}
			
		// 			promptBox({
		// 				color:'warning',
		// 				title: this.state.json['10100CC-000019'],/* 国际化处理： 确认删除*/
		// 				content: message,
		// 				beSureBtnClick: () => {
		// 					let enablestate=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
		// 					this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:(enablestate.value?2:3)}});
		// 					let cardData = props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1]]);
		// 					ajax({
		// 						url:urls['delCostUrl'],
		// 						data:cardData,
		// 						success:(result)=>{
		// 							if(result.success){
		// 								this.props.form.EmptyAllFormValue(formId);
		// 								this.props.cardTable.setTableData(tableIds[1], {
		// 									areacode:tableIds[1],
		// 									rows:[]
		// 								}, false);
		// 								this.props.cardTable.setTableData(tableIds[0], {
		// 									areacode:tableIds[0],
		// 									rows:[]
		// 								}, false);
		// 								//调用异步树的接口，删除该树节点
		// 								this.props.syncTree.delNodeSuceess(this.config.treeId,this.props.syncTree.getSelectNode(this.config.treeId).refpk);
			
		// 								toast({title:this.state.json['10100CC-000020'],color:"success"});/* 国际化处理： 删除成功！*/
	
		// 								this.props.syncTree.cancelSelectedNode(this.config.treeId);                               
		// 							}
			
		// 						}
		// 					})
		// 				}
		// 			});
		// 	}
		// }

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65