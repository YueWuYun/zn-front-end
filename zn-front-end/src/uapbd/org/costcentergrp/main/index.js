//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,promptBox } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
import CCList from '../cclist';
let { NCPopconfirm,NCModal,NCBackBtn} = base;
import './index.less'
const { NCDropdown:Dropdown, NCIcon:Icon, NCMenu:Menu, NCButton:Button }=base;

//const searchid = '10140UDDDBQ';
const tableid = 'costcentergroup';
const listpagecode = '10100CCG_costcentergrouphead';
const formpagecode = '10100CCG_costcentergroupbody';
const appId='0001Z0100000000081E1';

const urls = {
	querylist:'/nccloud/uapbd/costcentergrp/querylist.do',
	enablelist:'/nccloud/uapbd/costcentergrp/enablelist.do',
	disablelist:'/nccloud/uapbd/costcentergrp/disablelist.do',
	dellist:'/nccloud/uapbd/costcentergrp/dellist.do',
	querycard:'/nccloud/uapbd/costcentergrp/querycard.do',
	enablecard:'/nccloud/uapbd/costcentergrp/enablecard.do',
	disablecard:'/nccloud/uapbd/costcentergrp/disablecard.do',
	savecard:'/nccloud/uapbd/costcentergrp/savecard.do',
	delcard:'/nccloud/uapbd/costcentergrp/delcard.do'
};
let formId='costcentergroup';
let tableId='cclist';
let formmeta;
let listmeta;
let allTableData = {};

class CostcenterGRP extends Component {
	constructor(props){
		super(props);
		this.config =Object.assign({
            formId:"head",
            pageCode:"",
            urls:urls
		},props.config);
		
		//自定义根节点
		this.root = {
			"isleaf": false,
			"key":"~",
			"id":"~",
			"innercode":"~",
			"pid": "",
			"refname": this.props.json['10100CCG-000001'],/* 国际化处理： 档案*/
			"refpk": "root"
		};	

		this.state={
			formstate:'',//标识卡片态编辑状态，用于显示返回箭头
			curOrg:{pk_org:this.props.config},//主组织信息
			cclistdata:[],//子表关联成本中心数据维护
			pk_ccgroup:'',//选中的列表数据（若选中了多条则取第一条）
			pk_ccgroups:[],
			isgrade:'N',
			defdoclist:{},
			enablestate:'2',
			pk_defdoclist:''//档案列表参照主键
		}

		this.loadMeta(()=>{
			this.modifierMeta(props,listmeta,this,()=>{
				this.loadListData();
			});//添加行操作按钮
			this.loadListData();
			this.updateButtonStatus();
			this.props.button.setDisabled({
				//update:true,
				delete:true,
				enable:true,
				disable:true
			});
		});//加载模板信息
	}

	modifierMeta(props, meta,_this,refreshList) {
	
		props.button.setPopContent('lineDel',this.props.json['10100CCG-000002']);/* 国际化处理： 确定删除？*/
		//添加表格操作列
		let event = {
			label: this.props.json['10100CCG-000003'],/* 国际化处理： 操作*/
			attrcode: 'opr',
			key: 'opr',
			itemtype: 'customer',
			visible: true,
			render(text, record, index) {
				//let tableStatus = props.editTable.getStatus(tableid);
				return (
					props.button.createOprationButton(
						['lineEdit','lineDel'],
						{
							area:'line_opr_btn',
							onButtonClick:(props,id)=>{
								switch(id){
									case 'lineDel':
										//行删除事件
										let data = {
											pageid:listpagecode,
											model: {
												areaType: 'table',
												pageinfo: null,
												rows: []
											}
										};
	
										data.model.rows.push(record);
	
										ajax({
											url: urls['dellist'],
											data,
											success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
												if (res.success) {
													toast({title:_this.props.json['10100CCG-000004'],color:'success'});/* 国际化处理： 删除成功！*/
													refreshList();
													props.button.setDisabled({
														update:true,
														delete:true,
														enable:true,
														disable:true
													});
												}
											}
										});
										break;
									case 'lineEdit':
										//行修改操作（先调用行双击事件，再调用卡片修改事件）
										_this.onRowDoubleClick(record,index,()=>{
											_this.onButtonClick(props,'update');
										});
										break;
								}
							}
						}
					)
				);
			}
		};
		meta[tableid].items.push(event);
		return meta;
	}

	//加载模板信息
	loadMeta(initData){
		let prop=this.props;
		prop.createUIDom({
			pagecode : listpagecode
		},
		(data)=>{
			data.button && prop.button.setButtons(data.button);
			listmeta = data.template;
			prop.meta.setMeta(listmeta);
			prop.button.setButtonsVisible({
				add: true,
				update: true,
				delete: true,
				enable:true,
				disable:true,
				save: false,
				cancel: false
			});
			initData();//初始化按钮状态和数据
		});
	
		prop.createUIDom({
			pagecode : formpagecode
		},
		(data)=>{
			formmeta = data.template;
		});
	}

	loadListData(prompt){

		ajax({
			url: urls['querylist'],
			data:{
				pk_org:this.props.config
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if(!data){
						//若无数据，则清空列表,并禁用除新增以外的所有按钮,且清空所选数据
						this.state.pk_ccgroup='';
						this.state.pk_ccgroups=[];
						this.props.editTable.setTableData(tableid, {rows:[]});
						//如果刷新成功，需要给出提示
						if(prompt&&(prompt instanceof Function)){
							prompt();
						}
						return ;
					}
					//适配显示公式
					if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
						this.props.dealFormulamsg(
							res.formulamsg,
							{
								tableid:"editTable"
							}
						);
					}

					let pk_ccgroups=[];
					allTableData = data[tableid];
					this.props.editTable.setTableData(tableid, data[tableid]);
					allTableData.rows.forEach((val) => {
						pk_ccgroups.push(val.values['pk_ccgroup'].value);
					});
					this.setState({pk_ccgroups:pk_ccgroups,pk_ccgroup:pk_ccgroups[0]});
					//如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}
				}
			}
		});
	}

	updateButtonStatus(formStatus){
		//let isedit=this.state.isedit;
		if(!formStatus){
			this.props.button.setButtonsVisible({
				add: true,
				update: false,
				delete: true,
				enable:true,
				disable:true,
				refresh:true,
				saveAdd:false,
				save: false,
				cancel: false,
				addline:false,
				delline:false
			});		
		}else{
			if(formStatus!='browse'){//编辑状态
				this.props.button.setButtonsVisible({
					add: false,
					update: false,
					delete: false,
					enable:false,
					disable:false,
					refresh:false,
					save: true,
					saveAdd:true,
					cancel: true,
					addline:true,
					delline:true
				});
			}else{//浏览态
				this.props.button.setButtonsVisible({
					add: true,
					update: true,
					delete: true,
					enable:true,
					disable:true,
					refresh:true,
					save: false,
					saveAdd:false,
					cancel: false,
					addline:false,
					delline:false
				});
			}
		}
		
	}

	/**
     * 更多按钮点击更多选项时触发事件
     * @param key
     */
    onMoreSelect({ key }) {
        if(key == 'start'){
            this.onStartEps();
        }else if(key == 'stop'){
            this.onStopEps();
        }

    }

	//关联部门增行时回调函数
	onAddCCList(selectListData){
		this.state.cclistdata=selectListData;
		this.setState(this.state);
	}

	addCCListRows(){
		if(this.state.cclistdata.length!=0){
			//查一次数据
			ajax({
				url:"/nccloud/uapbd/costcentergrp/listTranslate.do",
				data:{ pk_costcenters:this.state.cclistdata},
				success:(result)=>{
						if(result.success&&result.data){
							//成功且有数据，则填充数据
							let cclistdata=[];
							result.data['resacostcenter'].rows.forEach((row)=>{
								cclistdata.push({
									rowid:null,
									status:'2',
									values:{
										pk_costcenter:{
											display:row.values['cccode'].value,
											value:row.values['pk_costcenter'].value
										},
										"pk_costcenter.cccode":row.values['cccode'],
										"pk_costcenter.ccname":row.values['ccname'],
										"pk_costcenter.pk_father":row.values['pk_father'],
										"pk_costcenter.cctype":{
											value:row.values['cctype'].value==2?this.props.json['10100CCG-000005']:(row.values['cctype'].value==1?this.props.json['10100CCG-000006']:this.props.json['10100CCG-000007']),/* 国际化处理： 基本生产,费用,非基本生产*/
											scale:"-1",
											display:row.values['cctype'].value==2?this.props.json['10100CCG-000005']:(row.values['cctype'].value==1?this.props.json['10100CCG-000006']:this.props.json['10100CCG-000007'])/* 国际化处理： 基本生产,费用,非基本生产*/
										},
										//pk_org:{//组织信息保存当前主组织（和NC端一致）
											//display:node.props.refname,
											//value:node.props.refpk
										//},
										status:{
											display:this.props.json['10100CCG-000008'],/* 国际化处理： 新增*/
											value:2
										}
									}
								});
							});
							let num = this.props.cardTable.getNumberOfRows(tableId); //获取列表总行数
							this.props.cardTable.insertRowsAfterIndex(tableId,cclistdata,num);
							//this.isDelBtnEnable();
						}
					}
				});
		}
		//编辑增删行数据时，需要将原来选择的数据清空
		this.state.cclistdata=[];
		this.setState(this.state);
	}

	//成本中心组成本中心子表按钮点击事件
	onCCListButtonClick(props,id){
		switch(id){
			case 'addline':
				//根据pk_dept去除重复行
				let checkListPK=[];
				props.cardTable.getVisibleRows(tableId).forEach((row)=>{
					checkListPK.push(row.values['pk_costcenter']);
				})
				//新增时弹出类似参照选择的模态框,且过虑条件为已启用
				let param1={json:this.props.json,pk_org:this.state.curOrg.pk_org,checkListPK:checkListPK,loadCCList:this.onAddCCList.bind(this)}
				props.modal.show('modal',{
                    title : this.props.json['10100CCG-000000'],/* 国际化处理： 成本中心*/
                    content :<CCList config={param1}/>,
					beSureBtnClick : this.addCCListRows.bind(this)
				})
				break;
			case 'delline':
				let selectedData1=props.cardTable.getCheckedRows(tableId);
				let indexArr1=[];
				selectedData1.forEach((val) => {
					indexArr1.push(val.index);
				});
				props.cardTable.delRowsByIndex(tableId, indexArr1);
				//this.isDelBtnEnable();
				this.props.button.setDisabled({delline:true});//删除按钮禁用
				break;
		}
	}

	//包含成本中心列表复选框选中事件（单选）
	cclistOnSelectedEvent(props,moduleId,record,index,status){
		let selectedRows = this.props.cardTable.getCheckedRows('cclist');//获取所有选中行数据
			if(selectedRows && selectedRows.length > 0){
				this.props.button.setDisabled({delline:false});//删除按钮可用	
			}
			else{
				this.props.button.setDisabled({delline:true});//删除按钮禁用	
			}
	}

	//包含成本中心列表复选框选中事件（全选）
	cclistOnSelectedAllEvent(props,moduleId,key){
			let selectedRows = this.props.cardTable.getCheckedRows('cclist');//获取所有选中行数据
			if(selectedRows && selectedRows.length > 0){
				this.props.button.setDisabled({delline:false});//删除按钮可用	
			}
			else{
				this.props.button.setDisabled({delline:true});//删除按钮禁用	
			}
	}

	//按钮点击事件
	onButtonClick(props,id) {
		if(this.state.isgrade=='N'){
			//列表态按钮处理逻辑
			switch (id) {
			//switch (id) {
				case 'refresh':
					this.loadListData(()=>{
						this.props.button.setDisabled({
							update:true,
							delete:true,
							enable:true,
							disable:true
						});
						toast({title:this.props.json['10100CCG-000009'],color:'success'});/* 国际化处理： 刷新成功！*/
					});
					break;
				case 'enable':
					if(this.props.editTable.getCheckedRows(tableid).length==0){
						toast({content:this.props.json['10100CCG-000010'],color:'warning'});/* 国际化处理： 请选择要启用的数据！*/
						return 
					}
					promptBox({
						color:'warning',
						title : this.props.json['10100CCG-000011'],/* 国际化处理： 确认启用*/
						content : this.props.json['10100CCG-000012'],/* 国际化处理： 您确认启用所选数据？*/
						beSureBtnClick : this.onEnableForList.bind(this)
					})
					/*this.props.modal.show('modal',{
						title : '确认启用',
						content : '您确认启用所选数据？',
						beSureBtnClick : this.onEnableForList.bind(this)
					});*/
						
					break;
				case 'disable':
					if(this.props.editTable.getCheckedRows(tableid).length==0){
						toast({content:this.props.json['10100CCG-000013'],color:'warning'});/* 国际化处理： 请选择要停用的数据！*/
						return 
					}
					promptBox({
						color:'warning',
						title : this.props.json['10100CCG-000014'],/* 国际化处理： 确认停用*/
						content : this.props.json['10100CCG-000015'],/* 国际化处理： 您确认停用所选数据？*/
						beSureBtnClick : this.onDisableForList.bind(this)
					});
						
					break;

				case 'add':
					
					setTimeout(() => {
						this.props.meta.setMeta(formmeta);
						let isgrade={isgrade:'Y',formstate:'add'};
						this.setState(isgrade);	
						//需要填充默认值
						this.props.form.setFormStatus(formId,'add');
						this.props.form.EmptyAllFormValue(formId);
						this.props.cardTable.setTableData(tableId, {rows:[]}, false);
						let formVal=this.props.form.getAllFormValue(formId);
						formVal.rows[0].values['pk_org'].value=this.props.config;
						this.props.form.setAllFormValue({[formId]:formVal});
					}, 10);
					this.updateButtonStatus('add');
					this.props.button.setDisabled({
						saveAdd:false,
						delline:true
					});
					break;
				case "delete":
					let selectedData=this.props.editTable.getCheckedRows(tableid);
					if(selectedData.length==0){
						toast({content:this.props.json['10100CCG-000016'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
						return 
					}
					if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
						let indexArr=[];
						selectedData.forEach((val) => {
							indexArr.push(val.index);
						});
						this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					}else{
						promptBox({
							color:'warning',
							title : this.props.json['10100CCG-000017'],/* 国际化处理： 确认删除*/
							content : this.props.json['10100CCG-000018'],/* 国际化处理： 您确认删除所选数据？*/
							beSureBtnClick : this.onDelForBrowse.bind(this)
						})
						
					}
					break;
			}
		}else{
			//卡片态按钮处理逻辑
			switch (id) {
				case 'refresh':
					this.loadCardData(()=>{
						toast({title:this.props.json['10100CCG-000009'],color:"success"});/* 国际化处理： 刷新成功！*/
					});
					break;
				case 'return':
					this.props.meta.setMeta(listmeta);
					this.updateButtonStatus('browse');
					break;
				case 'enable':
					promptBox({
						color:'warning',
						title : this.props.json['10100CCG-000011'],/* 国际化处理： 确认启用*/
						content : this.props.json['10100CCG-000012'],/* 国际化处理： 您确认启用所选数据？*/
						beSureBtnClick : this.onEnableForCard.bind(this)
					})
						
					break;
				case 'disable':
					promptBox({
						color:'warning',
						title : this.props.json['10100CCG-000014'],/* 国际化处理： 确认停用*/
						content : this.props.json['10100CCG-000015'],/* 国际化处理： 您确认停用所选数据？*/
						beSureBtnClick : this.onDisableForCard.bind(this)
					});
						
					break;

				case 'add':
					this.setState({formstate:'add'});	

					this.props.form.EmptyAllFormValue(formId);
					this.props.cardTable.setTableData(tableId, {rows:[]}, false);
					this.props.form.setFormStatus(formId,'add');
					let formVal=this.props.form.getAllFormValue(formId);
					formVal.rows[0].values['pk_org'].value=this.props.config;
					if(formVal.rows[0].values['status']!=null){
						formVal.rows[0].values['status'].value=2;
					}
					this.props.form.setAllFormValue({[formId]:formVal});
					this.updateButtonStatus('add');
					this.props.button.setDisabled({
						saveAdd:false,
						delline:true
					});
					break;
				case 'update':
					this.setState({formstate:'edit'});	

					this.props.form.setFormStatus(formId,'edit');
					this.updateButtonStatus('edit');
					this.props.button.setButtonsVisible({
						saveAdd:false
					});
					//this.isDelBtnEnable();
					//修改时表体删除按钮默认禁用
					this.props.button.setDisabled({delline:true});
					break;
				case 'cancel':
					promptBox({
						color:'warning',
						title : this.props.json['10100CCG-000019'],/* 国际化处理： 确认取消*/
						content : this.props.json['10100CCG-000020'],/* 国际化处理： 是否确认取消？*/
						beSureBtnClick : (()=>{
							this.props.form.setFormStatus(formId,'browse');
							this.state.cclistdata=[];

							this.state.formstate='browse';

							this.setState(this.state);
							this.updateButtonStatus('browse');
							this.loadCardData();
						})
					});
					break;
				case 'save':
					//form表单必输项校验
					if(!this.props.form.isCheckNow(formId)){
						toast({color:'danger',content:this.props.json['10100CCG-000021']});/* 国际化处理： 请输入必输项！*/
						return;
					}
					//ajax请求
					let saveCallBack=()=>ajax({
						url: urls['savecard'],
						data: props.createExtCardData(formpagecode, formId, [tableId]),
						success: (result) => {
							if(result.success){
								toast({title:this.props.json['10100CCG-000022'],color:"success"});/* 国际化处理： 保存成功！*/

								this.setState({formstate:'browse'});	
								//设置表单浏览态
								this.props.form.setFormStatus(formId, 'browse');
								//表单数据
								let headData = result.data.head[formId];
								let cclistData = result.data.bodys[tableId];
	
								//清空表单
								this.props.form.EmptyAllFormValue(formId);
								//设置表单为所选树节点数据
								this.props.form.setAllFormValue({[formId]:headData});
								
								this.props.cardTable.setTableData(tableId, cclistData, false);
								//选中数据为当前
								this.state.pk_ccgroup=headData.rows[0].values['pk_ccgroup'].value;
								this.state.pk_ccgroups.push(headData.rows[0].values['pk_ccgroup'].value);
								this.updateButtonStatus('browse');
								//双击进入卡片态，修改删除按钮和停启用按钮控制可用性
								this.props.button.setDisabled({
									update:false,
									delete:false
								});
								if(headData.rows[0].values['enablestate'].value==2){
									this.props.button.setDisabled({
										enable:true,
										disable:false
									});
								}else{
									this.props.button.setDisabled({
										enable:false,
										disable:true
									});
								}
							}
	
						}
					});
					this.props.validateToSave(props.createExtCardData(formpagecode, formId, [tableId]),saveCallBack,{'costcentergroup':'form','cclist':'cardTable'},'extcard');
					break;
				case 'saveAdd':
					//form表单必输项校验
					if(!this.props.form.isCheckNow(formId)){
						toast({color:'danger',content:this.props.json['10100CCG-000021']});/* 国际化处理： 请输入必输项！*/
						return;
					}

					//ajax请求
					let saveAddCallBack=()=>ajax({
						url: urls['savecard'],
						data: props.createExtCardData(formpagecode, formId, [tableId]),
						success: (result) => {
							if(result.success){
								toast({title:this.props.json['10100CCG-000022'],color:"success"});/* 国际化处理： 保存成功！*/
								//表单数据
								let headData = result.data.head[formId];
								//选中数据为当前
								this.state.pk_ccgroup=headData.rows[0].values['pk_ccgroup'].value;
								this.state.pk_ccgroups.push(headData.rows[0].values['pk_ccgroup'].value);
								this.onButtonClick(props,'add');
							}
						}
					});
					this.props.validateToSave(props.createExtCardData(formpagecode, formId, [tableId]),saveAddCallBack,{'costcentergroup':'form','cclist':'cardTable'},'extcard');
					break;
				case "delete":
					promptBox({
						color:'warning',
						title : this.props.json['10100CCG-000017'],/* 国际化处理： 确认删除*/
						content : this.props.json['10100CCG-000018'],/* 国际化处理： 您确认删除所选数据？*/
						beSureBtnClick : (()=>{
							ajax({
								url: urls['delcard'],
								data: props.createExtCardData(formpagecode, formId, [tableId]),
								success: (result) => {
									if(result.success){
										toast({title:this.props.json['10100CCG-000004'],color:"success"});/* 国际化处理： 删除成功！*/
										//删除成功，则需要返回列表也继续操作
										this.state.pk_ccgroup='';
										this.state.pk_ccgroups=[];
										this.props.form.EmptyAllFormValue(formId);
										this.props.cardTable.setTableData(tableId, {rows:[]}, false);
										//删除成功，选择下一条选中的数据
										//this.loadCardData();
										this.props.button.setDisabled({
											update:true,
											delete:true,
											enable:true,
											disable:true
										});
									}
								}
							});
						})
					});
					break;
			}
		}
	}

	//
	isDelBtnEnable(){
		//判断子表数据，控制子表增删行按钮可用性
		if(this.props.cardTable.getNumberOfRows(tableId)>0/*获取列表总行数*/){
			this.props.button.setDisabled({
				delline:false
			});
		}else{
			this.props.button.setDisabled({
				delline:true
			});
		}; 
	}

	//卡片态启用事件
	onEnableForCard(){
		ajax({
			url: urls['enablecard'],
			data: this.props.createExtCardData(formpagecode, formId, [tableId]),
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				//更新列表数据（效率问题以后再优化）
				if(res.success){
					toast({title:this.props.json['10100CCG-000023'],color:"success"});/* 国际化处理： 启用成功！*/
					this.loadCardData();
				}
			}.bind(this)
		});
	}

	//卡片态停用事件
	onDisableForCard(){
		ajax({
			url: urls['disablecard'],
			data: this.props.createExtCardData(formpagecode, formId, [tableId]),
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				//更新列表数据（效率问题以后再优化）
				if(res.success){
					toast({title:this.props.json['10100CCG-000024'],color:"success"});/* 国际化处理： 停用成功！*/
					this.loadCardData();
				}
			}.bind(this)
		});
	}

	//列表启用事件
	onEnableForList(){
		let selectedTableData=this.props.editTable.getCheckedRows(tableid);
		let data = {
			pageid:listpagecode,
			model : {
				areaType: 'table',
				pageinfo: null,
				rows: []
			}
		};

		selectedTableData.forEach((val) => {
			data.model.rows.push(val.data);
		});

		ajax({
			url: urls['enablelist'],
			data,
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				toast({title:this.props.json['10100CCG-000023'],color:"success"});/* 国际化处理： 启用成功！*/
				//更新列表数据（效率问题以后再优化）
				this.loadListData();
				this.props.button.setDisabled({
					update:true,
					delete:true,
					enable:true,
					disable:true
				});
			}.bind(this)
		});
	}

	//列表停用确定事件
	onDisableForList(){
		let selectedTableData=this.props.editTable.getCheckedRows(tableid);
		let data = {
			pageid:listpagecode,
			model : {
				areaType: 'table',
				pageinfo: null,
				rows: []
			}
		};

		selectedTableData.forEach((val) => {
			data.model.rows.push(val.data);
		});

		ajax({
			url: urls['disablelist'],
			data,
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				toast({title:this.props.json['10100CCG-000024'],color:"success"});/* 国际化处理： 停用成功！*/
				//更新列表数据（效率问题以后再优化）
				this.loadListData();
				this.props.button.setDisabled({
					update:true,
					delete:true,
					enable:true,
					disable:true
				});
			}.bind(this)
		});
	}

	loadCardData(prompt){
		if(!this.state.pk_ccgroup){
			toast({content:this.props.json['10100CCG-000025'],color:'warning'});/* 国际化处理： 请先选择数据！*/
			return 
		}
		let param={pk_ccgroup:this.state.pk_ccgroup};
		
		ajax({
			url: urls['querycard'],
			data:param,
			success: function (result)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				//加载卡片态数据
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
					
					let headData = result.data.head[formId];
					let cclist = result.data.bodys[tableId]?result.data.bodys[tableId]:{rows:[]};
					this.props.form.setAllFormValue({[formId]:headData});
					this.props.cardTable.setTableData(tableId, cclist, false);
					//卡片数据加载则启用相应的按钮
					//双击进入卡片态，修改删除按钮和停启用按钮控制可用性
					this.props.button.setDisabled({
						update:false,
						delete:false
					});
					if(headData.rows[0].values['enablestate'].value==2){
						this.props.button.setDisabled({
							enable:true,
							disable:false
						});
					}else{
						this.props.button.setDisabled({
							enable:false,
							disable:true
						});
					}
					//如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}
				}
			}.bind(this)
		});
	}

	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let data = {
			pageid:listpagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: []
			}
		};

		selectedData.forEach((val) => {
			data.model.rows.push(val.data);
		});

		ajax({
			url: urls['dellist'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				if (res.success) {
					
					toast({title:this.props.json['10100CCG-000004'],color:'success'});/* 国际化处理： 删除成功！*/

					this.loadListData();

				}
			}
		});
	}

	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		let length = this.props.editTable.getNumberOfRows(moduleId);
		if(((length-1)===index)&&data.status==='2'){
			//this.props.editTable.filterEmptyRows(tableid,keys);
			this.props.editTable.filterEmptyRows(tableid);
			this.onButtonClick('add');
		}
		if(key === 'isgrade' && data.values['doclevel'].value === '0'){
			let allRows = props.editTable.getAllRows(moduleId);
			data.status = '1';
			let reqData= [];
			reqData.push(data);
			let changDdata = {
				pageid:pagecode,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: reqData
				}
			};
			ajax({
				url: urls['save'],
				data:changDdata,
				success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success, data } = res;
					if (success) {
						()=>{
							//操作成功，更新页面当前行数据
							let retData = data[moduleId];
							allRows[index] = retData.rows[0];
							let allData = props.editTable.getAllData(moduleId);
							allData.rows = allRows;
							props.editTable.setTableData(moduleId, allData);
						}
					}else{
						this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,'isgrade',{value:!(data.values['isgrade'].value)});
					}
				}
			});
		}
	}

	//列表数据双击事件
	onRowDoubleClick(record,index,prompt){
		setTimeout(() => {
			this.state.pk_ccgroup
			this.setState({
				formstate:'browse',
				isgrade:'Y',
				pk_ccgroup:record.values['pk_ccgroup'].value
			});//设置当前选中行
			this.updateButtonStatus();
			this.props.button.setButtonsVisible({
				update:true
			});
			this.props.meta.setMeta(formmeta);
		}, 10);
		this.loadCardData(()=>{
			if(prompt&&(prompt instanceof Function)){
				prompt();
			}
		});
	}

	//列表数据单击事件
	onRowClick(props,moduleId,record,index){
		setTimeout(() => {
			this.state.pk_ccgroup
			this.setState({
				pk_ccgroup:record.values['pk_ccgroup'].value
			});//设置当前选中行
		}, 10);
	}

	//返回列表态按钮
	returnList(){
		setTimeout(() => {
			this.setState({
				isgrade:'N',
			});//设置当前选中行
			this.updateButtonStatus();
			this.props.meta.setMeta(listmeta);
		}, 10);
		this.loadListData();
		this.props.button.setDisabled({
			update:true,
			delete:true,
			enable:true,
			disable:true
		});
	}

	//行选择事件，主要用于判断启用停用按钮是否可用
	onRowDataSelect(props,moduleId,record,index,status){
		//列表态有选中的数据，则启用删除按钮，否则禁掉
		if(this.props.editTable.getCheckedRows(tableid).length>0){
			this.props.button.setDisabled({
				delete:false
			});

			let containEnable=false;
			let containDisable=false;
			this.props.editTable.getCheckedRows(tableid).forEach((row)=>{
				if(row.data.values['enablestate'].value == 2){
					containEnable=true;
				}else{
					containDisable=true;
				}
			});
			if(containEnable&&containDisable){
				this.props.button.setDisabled({
					enable:false,
					disable:false
				});
			}else if(containEnable&&!containDisable){
				this.props.button.setDisabled({
					enable:true,
					disable:false
				});
			}else if(!containEnable&&containDisable){
				this.props.button.setDisabled({
					enable:false,
					disable:true
				});
			}

			//单选，则需判断修改和停启用按钮是否可用
			if(this.props.editTable.getCheckedRows(tableid).length==1){
				//单选，修改可用
				this.props.button.setDisabled({
					update:false
				});
				//单选，判断数据停启用状态
				if(this.props.editTable.getCheckedRows(tableid)[0].data.values['enablestate'].value == 2){
					this.props.button.setDisabled({
						enable:true,
						disable:false
					});
				}else{
					this.props.button.setDisabled({
						enable:false,
						disable:true
					});
				}
			}else{
				this.props.button.setDisabled({
					update:true
				});
			}
		}else{
			this.props.button.setDisabled({
				update:true,
				delete:true,
				enable:true,
				disable:true
			});
		}
	}

	render() {

		const {cardTable,syncTree,button,modal,editTable,DragWidthCom,form} = this.props;

		const {createForm}=form;

		const {createSyncTree}=syncTree;

		const {createButton}=button;

		let { createCardTable } = cardTable;
		
		let { createButtonApp } = button;

		let { createModal } = modal;  //模态框
		
		let { createEditTable } = editTable;  //模态框

		let groupItem = this.state.showBaseInfo ? "show-form" : "hide-form"

		return(
			<div className={this.state.isgrade!='Y'?"nc-bill-list":"nc-bill-card"}>
				{createModal('modal', { noFooter: false })}
				{/* 头部 header*/}
				<div className="nc-bill-header-area">
					{(this.state.isgrade!='Y'||(this.state.isgrade=='Y'&&this.state.formstate!='browse'))? null : <NCBackBtn style={{marginRight:'20px'}} className='title-search-detail'
							onClick={this.returnList.bind(this) }></NCBackBtn>}
					{/*<h2 className="title" style={{fontSize:'19px'}}>{this.props.json['10100CCG-000028']}</h2>*/}
					<div className="header-button-area headerBtn">
						{createButtonApp({
							area: 'list_btn',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</div>
				{/* 单表区/卡区域 */} 
				{this.state.isgrade!='Y'?
				<div className="nc-bill-table-area">
					{createEditTable(tableid, {//列表区
						onSelected:this.onRowDataSelect.bind(this),
						onSelectedAll:this.onRowDataSelect.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						useFixedHeader:true,    
						onRowDoubleClick:this.onRowDoubleClick.bind(this),            // 选择框有变动的钩子函数
						onRowClick:this.onRowClick.bind(this),
						//statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
						showIndex:true,				//显示序号
						showCheck:true	,		//显示复选框
						adaptionHeight:true
						//params: 'test',                                  // 自定义传参

					})}
				</div>
				:
				<div className="card-area">
					<div className="nc-bill-form-area">
						<div className={`group-form-item ${groupItem} `}>
							{createForm(formId, {
								onAfterEvent: this.onAfterEvent.bind(this)
							})}
						</div>
					</div>
											
					<div className="nc-bill-table-area">
						{/*this.getTableHead('finance')*/}
						{createCardTable(tableId, {
							showIndex:true,
							showCheck:true,
							onSelected:this.cclistOnSelectedEvent.bind(this),//包含成本中心列表复选框选中事件（单选）
							onSelectedAll:this.cclistOnSelectedAllEvent.bind(this),//包含成本中心列表复选框选中事件（全选）
							tableHead:()=>{
								return <div className="shoulder-definition-area" style={{position:'static'}}>																
											{createButtonApp({
												area: 'cclist_btn',
												buttonLimit: 3, 
												onButtonClick: this.onCCListButtonClick.bind(this), 
												popContainer: document.querySelector('.header-button-area')													
											})}																
										</div>
							}							
						})}
					</div>
																
					{createModal('delete', {
						title: this.props.json['10100CCG-000026'],/* 国际化处理： 注意*/
						content: this.props.json['10100CCG-000027'],/* 国际化处理： 确认删除？*/
							beSureBtnClick: this.delConfirm
					})}
				</div>				
				}

			</div>
		)

	}
}

export default CostcenterGRP = createPage({
	billinfo:{
        billtype:'extcard',
        pagecode:formpagecode,
        headcode:formId,
		bodycode:tableId
    },
    initTemplate: ()=>{},
})(CostcenterGRP)



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65