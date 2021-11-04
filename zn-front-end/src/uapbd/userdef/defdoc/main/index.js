//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast ,print,getBusinessInfo,promptBox  } from 'nc-lightapp-front';
const {PrintOutput} = high;
import Utils from '../../../public/utils';
let { NCCheckbox:Checkbox } = base;
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';

const searchId='defdocqry';
const formid = 'head';
const treeid = 'defdoc_treeid'
const oid='1001Z0100000000012LS';

//节点传的参数暂时定义为此处的变量
const listpagecode = '10140DEFDOC_TABLE';//列表态页面编码
const formpagecode = '10140DEFDOC_TREECARD';//卡片态页面编码
const urls = {
	mergerequest : "/nccloud/platform/pub/mergerequest.do",
	queryTemp : "/platform/templet/querypage.do",
    querylist : "/nccloud/riamm/userdef/querylist.do",
	savelist : "/nccloud/riamm/userdef/savelist.do",
	enablelist : "/nccloud/riamm/userdef/enablelist.do",
	disablelist : "/nccloud/riamm/userdef/disablelist.do",
	querytree : "/nccloud/riamm/userdef/querytree.do",
	//querytree : "/nccloud/baseapp/defdoc/treeQuery.do",
	queryform : "/nccloud/riamm/userdef/queryform.do",
	deleteform : "/nccloud/riamm/userdef/deleteform.do",
	saveform : "/nccloud/riamm/userdef/saveform.do",
	disableform : "/nccloud/riamm/userdef/disableform.do",
	enableform : "/nccloud/riamm/userdef/enableform.do",
	print : "/nccloud/riamm/userdef/print.do",
	queryDefdocCode : "/nccloud/riamm/userdef/queryDefdocCode.do",
	rollBackDefdocCode : "/nccloud/riamm/userdef/rollBackDefdocCode.do"

	
}; 
const tableid = 'defdoclist';//列表态数据后面加载按钮事件时需要的标识
const pageConfig = {
	defaultOrg:{
		pk:'',
		name:''
	}
};
const keys = ['pk_defdoclist','pk_org','enablestate','datatype','dataoriginflag'];
//获取并初始化模板
let initTemplate = (props,callback) => {
	props.createUIDom({
		pagecode : listpagecode,
	},
	(data)=>{
		Object.keys(data.context.paramMap).forEach((keyname) => {
			pageConfig[keyname] = data.context.paramMap[keyname];
		});
		let meta = data.template;
		meta = modifierMeta(props, meta);
		meta['head'].items.forEach((item,index)=>{
			if(item.attrcode === 'pid'){
				meta['head'].items[index].queryCondition = {
					pk_defdoclist : pageConfig.pk_defdoclist
				}
			}
		});
		props.meta.setMeta(meta);
		data.button && props.button.setButtons(data.button);
		props.button.setPopContent('DeleteOpr',props.MutiInit.getIntl("10140DEFDOC") && props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000000'));//确定要删除吗？
		setTimeout(() => {
			var cb = callback || function(){};
			cb();
		}, 10);
	});
	
}

//对表格模板进行加工操作
function modifierMeta(props, meta) {
	//添加表格操作列
	let event = {
		label: props.MutiInit.getIntl("10140DEFDOC") && props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000001'),//'操作'
		attrcode: 'opr',
		key: 'opr',
		itemtype: 'customer',
		visible: true,
		render(text, record, index) {
			let tableStatus = props.editTable.getStatus(tableid);
			return record.values.pk_org.value === pageConfig.defaultOrg.pk&&props.button.createOprationButton(
                ['DeleteOpr'],
                {
                    area:'table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => onTableInnerButtonClick(props, id, text, record, index)
                }
            );
		}
	};
	meta[tableid].items.push(event);
	return meta;
}

function onTableInnerButtonClick(props, id, text, record, index) {
	if (props.editTable.getStatus(tableid) === 'edit') {//编辑状态
		props.editTable.deleteTableRowsByIndex(tableid, index);
	} else {//浏览态
		let delObj = {
			rowId: index,
			status: '3',
			values: {
				ts: {
					display: props.MutiInit.getIntl("10140DEFDOC") && props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000002'),//'时间戳'
					value: record.values.ts.value
				},
				pk_defdoc: {
					display: props.MutiInit.getIntl("10140DEFDOC") && props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000003'),//'主键',
					value: record.values.pk_defdoc.value
				},
				pk_defdoclist : {
					value : pageConfig.pk_defdoclist
				},
				pk_org : {
					value : record.values.pk_org.value
				}
			}
		};
		let indexArr = [];
		indexArr.push(index);
		let data = {
			pageid:listpagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: [delObj]
			}
		};
		ajax({
			url: urls['savelist'],
			data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					toast({ content: props.MutiInit.getIntl("10140DEFDOC") && props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000004'), color: 'success' });//'删除成功'
				}
			}
		});
	}
}

class Defdocbase extends Component {

	constructor(props){
		super(props);
		this.state={
			pageStatus:'browse',
			defaultOrg : {},
			enablestate : false,
			showType : '',
			NODE_TYPE : '',
			title : '',
			pk_org : {},
			selectNodePk : '',
			printConfig : {
				funcode : '',
				nodekey : '',
				oids : []
			}
		}
		this.root = {
			"isleaf": false,
			"key":"~",
			"title":'',
			"id":"~",
			"innercode":"~",
			"pid": "",
			"refname": "",
			"refpk": "root"
		}
		initTemplate(props,this.loadStatus);
	}

	loadStatus = () => {
		if(pageConfig.pk_defdoclist){
			let businessInfo = getBusinessInfo();
			if(pageConfig.NODE_TYPE === 'glb'){
				pageConfig.defaultOrg.pk = 'GLOBLE00000000000000';
				pageConfig.defaultOrg.name = this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000005');//'全局';
			}else if(pageConfig.NODE_TYPE === 'grp'){
				pageConfig.defaultOrg.pk = businessInfo.groupId;
				pageConfig.defaultOrg.name = businessInfo.groupName;
			}
			this.root.title = pageConfig.title;
			this.root.refname = pageConfig.title;
			this.setState({
				showType : pageConfig.showType,
				NODE_TYPE : pageConfig.NODE_TYPE,
				title : pageConfig.title,
				defaultOrg : {
					pk:pageConfig.defaultOrg.pk,
					name:pageConfig.defaultOrg.name
				}
			},this.loadData);
		}
		this.props.button.setDisabled({
			Edit :true,
			Delete : true,
			Enable : true,
			Disable : true
		});
	}

	/**
	 * 加载页面数据
	 */
	loadData = () =>{
		if(!pageConfig.pk_defdoclist) return;
		if(pageConfig.showType === 'table'){//加载表格数据
			ajax({
				url: urls['querylist'],
				data:{
					"pk_defdoclist":pageConfig.pk_defdoclist,
					"enablestate":this.state.enablestate,
					"pagecode": listpagecode,
					"nodeType":pageConfig.NODE_TYPE,
					"pk_org":this.state.pk_org.refpk
				},
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if(data && data[tableid]){
							Utils.convertGridEnablestate(data[tableid].rows);
							this.props.editTable.setTableData(tableid, data[tableid]);
						}
					}
				}
			});
		}else if(pageConfig.showType === 'tree'){//加载树形数据
			this.props.form.EmptyAllFormValue(formid);
			ajax({
				url:urls['querytree'],
				data:{
					"pk_defdoclist":pageConfig.pk_defdoclist,
					"enablestate":this.state.enablestate,
					"pagecode": listpagecode,
					"nodeType":pageConfig.NODE_TYPE,
					"pk_org":this.state.pk_org.refpk
				},
				success:(res)=>{
					let {success,data} = res;
					if(success){
						let treedata = [Object.assign( {...this.root} , {children : data} )];
						//同步树  加载全部数据
						this.props.syncTree.setSyncTreeData(treeid , this.dealTreeData(treedata));
						//展开节点  设置默认展开项
						this.props.syncTree.openNodeByPk(treeid, this.root.refpk);
						this.props.syncTree.setNodeDisable(treeid, true, this.root.refpk);
					}
				}
			});
		}
		this.updateButtonStatus();
	}

	//更新按钮状态
	updateButtonStatus = () => {
		this.props.button.setButtonsVisible({
			Add:this.state.showType == 'table' || this.state.pageStatus == 'browse',
			Edit:this.state.pageStatus == 'browse',
			Delete:this.state.pageStatus == 'browse',
			Cancel:!(this.state.pageStatus == 'browse'),
			Save:!(this.state.pageStatus == 'browse'),
			Print:this.state.pageStatus == 'browse',
			Output:this.state.pageStatus == 'browse',
			Refresh:this.state.pageStatus == 'browse',
			Enable:this.state.pageStatus == 'browse',
			Disable:this.state.pageStatus == 'browse'
		});
		this.props.button.setDisabled({
			Delete : true,
			Edit : true
		});
		this.state.showType == 'table' && this.props.button.setPopContent('DeleteOpr', this.state.pageStatus == 'browse'?(this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000000')):"");//确定要删除吗？
		this.props.button.setMainButton({
			'Add' : this.state.pageStatus == 'browse'
		});
	}

	/**
	 * 更新表格内字段的可编辑性
	 */
	updateTable = (status = 'browse') => {
		this.setState({pageStatus:status},this.updateButtonStatus);
		if(this.props.editTable.getStatus(tableid)&&this.props.editTable.getStatus(tableid) != 'browse'){//编辑状态
			let tableData = this.props.editTable.getAllRows(tableid,true);
			if(tableData){
				tableData.forEach((item,index)=>{
					if(item.values['pk_org'].value !== this.state.defaultOrg.pk){
						//this.props.editTable.setEditableByKey(tableid,item.rowid,'code',false);
						this.props.editTable.setEditableByKey(tableid,item.rowid,'name',false);
						this.props.editTable.setEditableByKey(tableid,item.rowid,'shortname',false);
						this.props.editTable.setEditableByKey(tableid,item.rowid,'mnecode',false);
						this.props.editTable.setEditableByKey(tableid,item.rowid,'memo',false);
					}
				});
			}
		}
	}

	/**
	 * 表格数据选中改变事件
	 */
tablSselectedChange = (props, moduleId, newVal, oldVal) => {
		//props, moduleId(区域id), newVal(当前值), oldVal(旧值)
		let selectData = this.props.editTable.getCheckedRows(tableid);
		let length = selectData.length;
		let del = true,disable = true, enable = true, edit = true;
		if(length === 0){
		}else if(length === 1){
			del = false;
			edit= false;
			for(let i = 0;i<length;i++){
				if(selectData[i].data.values['pk_org'].value !== pageConfig.defaultOrg.pk){
					del = true;
					edit = true;
				}else if(selectData[i].data.values['enablestate'].value){
					disable = false;
				}else if(!(selectData[i].data.values['enablestate'].value)){
					enable = false;
				}
			}
		}else if(length > 1){
			del = false;
			edit = false;
			for(let i = 0;i<length;i++){
				if(selectData[i].data.values['pk_org'].value !== pageConfig.defaultOrg.pk){
					del = true;
					edit = true;
					break;
				}else if(selectData[i].data.values['enablestate'].value){
					disable = false;
				}else if(!(selectData[i].data.values['enablestate'].value)){
					enable = false;
				}

			}
		}
		this.props.button.setDisabled({
			Delete : del,
			Enable : enable,
			Disable : disable,
			Edit : edit
		});
	}

	tablOnBeforeEvent = (props,moduleId, item, index,value, record) => {
		//props 内部方法，moduleId(区域id), item(模版当前列的项), index（当前索引）,value（当前值）, record（行数据）
		return true;
	}

	onAfterEvent = (props, moduleId , key, changerows, value, index, data) => {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		if(key === 'enablestate'){
			if(data.values.pk_org.value !== pageConfig.defaultOrg.pk){
				this.props.editTable.cancelEdit(tableid);
				return;
			}
			let stateUrl = '';
			if(value[0].newvalue.value){//启用
				stateUrl = urls['enablelist'];
			}else{//停用
				stateUrl = urls['disablelist'];
			}
			let reqData= [];
			reqData.push(data);
			Utils.convertGridEnablestate(reqData);
			let changDdata = {
				pageid:listpagecode,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: reqData
				}
			};
			ajax({
				url: stateUrl,
				data:changDdata,
				success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success, data } = res;
					if (success) {
						//操作成功，更新页面当前行数据
						let allD = this.props.editTable.getAllData(tableid);
						Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
						Utils.convertGridEnablestate(data[tableid].rows);
						Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
						this.props.editTable.setTableData(tableid,allD);
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000006'),color:'success'});//'操作成功'
					}
				}
			});
		}
	}

	/**
	 * 组织参照变更事件
	 */
	onOrgChange = (value) => {
		pageConfig.defaultOrg.pk = value.refpk;
		pageConfig.defaultOrg.name = value.refname;
		this.setState({
			pk_org : value,
			defaultOrg:{
				pk : value.refpk,
				name : value.refname
			}
		},this.loadData);
	}

	disableOrEnable = (enable = true)=>{
		let reqData = [];
		let selectData = this.props.editTable.getCheckedRows(tableid);
		selectData.forEach(item=>{
			reqData.push(item.data);
		});
		Utils.convertGridEnablestate(reqData);
		let changDdata = {
			pageid:listpagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: reqData
			}
		};
		ajax({
			url: enable?urls['enablelist']:urls['disablelist'],
			data:changDdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					//操作成功，更新页面当前行数据
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					Utils.convertGridEnablestate(data[tableid].rows);
					Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
					this.props.editTable.setTableData(tableid,allD);
					toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000006'),color:'success'});//'操作成功'
				}
			}
		});	
			
			
	}

	onButtonClick = (props,id) => {
		if(this.state.showType === 'table'){//表格
			switch(id){
				case 'Add':
					if(this.state.NODE_TYPE === 'org' && !this.state.pk_org.refpk){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000007'),color:'warning'});//'请先选中业务单元'
						return
					}
					ajax({
						url:urls['queryDefdocCode'],
						data:{defdoclist:pageConfig.pk_defdoclist,pk_org:this.state.defaultOrg.pk},
						success:res=>{
							let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
							this.props.editTable.addRow(tableid,num,true);//setValByKeyAnd
							this.props.editTable.setValByKeyAndIndex(tableid, num, "pk_defdoclist", { value:pageConfig.pk_defdoclist});
							this.props.editTable.setValByKeyAndIndex(tableid, num, "pk_org", { value:this.state.defaultOrg.pk,display:this.state.defaultOrg.name});
							this.props.editTable.setValByKeyAndIndex(tableid, num, "enablestate", { value:2,display:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000008')});//'已启用'
							this.props.editTable.setValByKeyAndIndex(tableid, num, "datatype", { value:1});
							this.props.editTable.setValByKeyAndIndex(tableid, num, "dataoriginflag", { value:0});
							if(this.state.NODE_TYPE !== 'glb'){
								let businessInfo = getBusinessInfo();
								this.props.editTable.setValByKeyAndIndex(tableid, num, "pk_group", { value:businessInfo.groupId});
							}
							this.updateTable('edit');
							let {data} = res;
							if(data && data.isPrecode){
								this.props.editTable.setValByKeyAndIndex(tableid, num, "code", { value:data.code});
							}
							if(data){
								this.props.editTable.setEditableRowKeyByIndex(tableid,num,'code',!!(data.canEdit));
							}
						}
					});
					break;
				case 'Edit':
					this.props.editTable.setStatus(tableid, 'edit');
					this.updateTable('edit');
					break;
				case 'Cancel':
					promptBox({
						color: 'info',
						title: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000009'),//'确认取消',
						content: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000010'),//'是否确认要取消？',
						noFooter: false,
						noCancelBtn: false,
						beSureBtnName: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000011'),//'确定',
						cancelBtnName: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-0000112'),//'取消',
						beSureBtnClick: () => {
							this.props.editTable.cancelEdit(tableid, ()=>{this.updateTable('browse');});
							this.setState({pageStatus:'browse'},this.updateButtonStatus);
						}
					});
					break;
				case 'Delete':
					let selectedData=this.props.editTable.getCheckedRows(tableid);
					if(selectedData.length==0){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-0000113'),color:'warning'});//'请选择要删除的数据'
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
							color: 'info',
							title: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000014'),//'确认删除',
							content: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000015'),//'您确认删除所选数据？',
							noFooter: false,
							noCancelBtn: false,
							beSureBtnName: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000011'),//'确定',
							cancelBtnName: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-0000112'),//'取消',
							beSureBtnClick: () => {
								this.onDelForBrowse()
							}
						});
					}
					break;
				case 'Enable':
					let enableData = this.props.editTable.getCheckedRows(tableid);
					if(enableData.length==0){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000016'),color:'warning'});//'请选择要启用的数据'
						return 
					}
					this.disableOrEnable(true);
					break;
				case 'Disable':
					let disableData = this.props.editTable.getCheckedRows(tableid);
					if(disableData.length==0){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000017'),color:'warning'});//'请选择要停用的数据'
						return 
					}
					this.disableOrEnable(false);
					break;
				case 'Save':
					setTimeout(() => {
						this.props.editTable.filterEmptyRows(tableid,keys);
						let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
						if(!tableData || tableData.length === 0) {
							this.props.editTable.setStatus(tableid, 'browse');
							setTimeout(() => {
								this.updateTable('browse');
							}, 0);
							return;
						}
						if (!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllRows(tableid, true))) {
                            return
                        }
						let data = {
							pageid:listpagecode,
							model : {
								areaType: "table",
								pageinfo: null,
								rows: []
							}
						};
						data.model.rows = tableData;
						Utils.convertGridEnablestate(data.model.rows);
						ajax({
							url: urls['savelist'],
							data,
							success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
									this.updateTable('browse');
									Utils.handleTableReData({
										tableid : tableid,
										props : this.props,
										data : data,
										notEmpty : (data) => {
											let allD = this.props.editTable.getAllData(tableid);
											Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
											Utils.convertGridEnablestate(data[tableid].rows);
											Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
											this.props.editTable.setTableData(tableid,allD);
										}
									});
								}
							}.bind(this)
						});
					}, 0);
					break;
				case 'Refresh':
					if(this.state.NODE_TYPE === 'org' && !this.state.pk_org.refpk){
						return;
					}
					this.loadData();
					break;
				case 'Print':
					let printData = this.props.editTable.getAllRows(tableid);
					if(printData.length === 0){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000018'),color:'warning'});//'无可打印数据'
						return;
					}
					let printIds = [];
					printData.forEach(item => {printIds.push(item.values['pk_defdoc'].value)});
					print('pdf',
					urls['print'],
					{
						funcode : '10140UDDB',
						nodekey : 'defdoc_list',
						oids : printIds
					});
					break;
				case 'Output':
					let outputData = this.props.editTable.getAllRows(tableid);
					if(outputData.length === 0){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000019'),color:'warning'});//'无可输出的数据'
						return;
					}
					let outputIds = [];
					outputData.forEach(item => {outputIds.push(item.values['pk_defdoclist'].value)});
					this.setState({
						printConfig : {
							funcode : '10140UDDB',
							nodekey : 'defdoc_list',
							oids : outputIds
						}
					},this.refs.printOutput.open());
					break;
			}
		}else if(this.state.showType === 'tree'){//树卡
			switch(id){
				case 'Add':
					this.props.syncTree.setNodeDisable(treeid,true);//设置树不可编辑
					this.props.form.EmptyAllFormValue(formid);
					this.props.form.setFormStatus(formid,'add');
					ajax({
						url:urls['queryDefdocCode'],
						data:{defdoclist:pageConfig.pk_defdoclist,pk_org:this.state.defaultOrg.pk},
						success:res=>{
						//设置默认值
						if(this.state.NODE_TYPE !== 'glb'){
							let businessInfo = getBusinessInfo();
							this.props.form.setFormItemsValue(formid,{
								pk_group : {value:businessInfo.groupId}
							});
						}
						this.props.form.setFormItemsValue(formid,{
							pk_org : {value:pageConfig.defaultOrg.pk,display:pageConfig.defaultOrg.name},
							pk_defdoclist : {value:pageConfig.pk_defdoclist},
							enablestate : {value:2,display:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000008')},//'已启用'
							datatype : { value:1},
							dataoriginflag : {value:0}
						});
						this.setState({pageStatus:'add'},this.updateButtonStatus);
							console.log(res);
							let {data} = res;
							if(data && data.isPrecode){
								this.props.form.setFormItemsValue(formid,{
									code : {value:data.code}
								});
							}
							if(data){
								this.props.form.setFormItemsDisabled(formid,{code:!(data.canEdit)});
								this.props.form.setFormItemsRequired(formid,{code:!!(data.canEdit)});
							}
							
						}
					});
					break;
				case 'Edit':
					let treeSelectNode4Delete = this.props.syncTree.getSelectNode(treeid);
					if(!treeSelectNode4Delete){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000020'),color:'warning'});//'请选择要修改的数据'
						return;
					}
					let treeSelectNode = this.props.syncTree.getSelectNode(treeid);
					if(treeSelectNode){
						this.props.syncTree.setNodeDisable(treeid,true);
						this.props.form.setFormStatus(formid,'edit');
						this.setState({pageStatus:'edit'},this.updateButtonStatus);
					}
					break;
				case 'Cancel':
					promptBox({
						color: 'info',
						title: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000009'),//'确认取消',
						content: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000010'),//'是否确认要取消？',
						noFooter: false,
						noCancelBtn: false,
						beSureBtnName: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000011'),//'确定',
						cancelBtnName: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000012'),//'取消',
						beSureBtnClick: () => {
							this.props.syncTree.setNodeDisable(treeid,false);
							this.props.form.cancel(formid);
							this.setState({pageStatus:'browse'},this.updateButtonStatus);
						}
					});
					break;
				case 'Save':
					let formData = this.props.form.getAllFormValue(formid);//获得表单信息
					if(!this.props.form.isCheckNow(formid)){
						return;
					}
					let requestParam = {
						model: formData,
						pageid: listpagecode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
					};
					//ajax请求
					ajax({
						url: urls['saveform'],
						data: requestParam,
						success: (result) => {
							if(result.success){
								//设置表单浏览态
								this.props.form.setFormStatus(formid, 'browse');
								//设置树可用
								this.props.syncTree.setNodeDisable(treeid,false);
								this.props.form.EmptyAllFormValue(formid);
								//保存成功且卡片上放上保存后的值后需要更新按钮状态
								this.setState({pageStatus:'browse'},()=>{
									this.updateButtonStatus();
									this.loadData();
								});
							}

						}
					});
					break;
				case 'Delete':
					treeSelectNode4Delete = this.props.syncTree.getSelectNode(treeid);
					if(!treeSelectNode4Delete){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000013'),color:'warning'});//'请选择要删除的数据'
						return;
					}
					promptBox({
						color: 'info',
						title: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000014'),//'确认删除',
						content: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000015'),//'您确认删除所选数据？',
						noFooter: false,
						noCancelBtn: false,
						beSureBtnName: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000011'),//'确定',
						cancelBtnName: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000012'),//'取消',
						beSureBtnClick: () => {
							let formData=this.props.form.getAllFormValue(formid);
							formData.rows['status'] = '3';//设置状态
							let requestParam = {
								model: formData,
								pageid: listpagecode,
							};
							ajax({
								url:urls['deleteform'],
								data:{requestParam:requestParam,pk_org:this.state.pk_org.refpk},
								success:(result)=>{
									if(result.success){
										this.props.form.EmptyAllFormValue(formid);
										this.loadData();
										toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000004'),title:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000021')});//"删除成功！"  //"提示"
									}
								}
							});
						}
					});
					break;
				case 'Refresh':
					if(this.state.NODE_TYPE === 'org' && !this.state.pk_org.refpk){
						return;
					}
					this.loadData();
					break;
				case 'Enable':
					treeSelectNode4Delete = this.props.syncTree.getSelectNode(treeid);
					if(!treeSelectNode4Delete){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000022'),color:'warning'});//'请选择要操作的数据'
						return;
					}
					ajax({
						url:urls['enableform'],
						data:{
							model: this.props.form.getAllFormValue(formid),
							pageid: listpagecode
						},
						success:(res)=>{
							if(res.success){
								this.props.form.setAllFormValue({[formid]:res.data[formid]});
							if(res.data[formid].rows[0].values.enablestate.value==2){
								this.props.button.setDisabled({
									Edit :false,
									Delete : false,
									Enable : true,
									Disable : false
								});
							}

								toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000006'),color:'success'});//"操作成功！"
							}
						}
					});
					break;
				case 'Disable':
					treeSelectNode4Delete = this.props.syncTree.getSelectNode(treeid);
					if(!treeSelectNode4Delete){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000022'),color:'warning'});//'请选择要操作的数据'
						return;
					}
					ajax({
						url:urls['disableform'],
						data:{
							model: this.props.form.getAllFormValue(formid),
							pageid: listpagecode
						},
						success:(res)=>{
							if(res.success){
								this.props.form.setAllFormValue({[formid]:res.data[formid]});
								if(res.data[formid].rows[0].values.enablestate.value==3){
									this.props.button.setDisabled({
										Edit :false,
										Delete : false,
										Enable : false,
										Disable : true
									});
								}
								toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000006'),color:'success'});//"操作成功！"
							}
						}
					});
					break;
				case 'Print':
					let printOids = this.getTreeOids();
					if(printOids.length === 0){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000018'),color:'warning'});//'无可打印数据'
						return;
					}
					print('pdf',
					urls['print'],
					{
						funcode : '10140UDDB',
						nodekey : 'defdoc_tree',
						oids : printOids
					});
					break;
				case 'Output':
					let outputOids = this.getTreeOids();
					if(outputOids.length === 0){
						toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000019'),color:'warning'});//'无可输出的数据'
						return;
					}
					this.setState({
						printConfig : {
							funcode : '10140UDDB',
							nodekey : 'defdoc_list',
							oids : outputOids
						}
					},this.refs.printOutput.open());
					break;
				
			}
		}
	}

	/**
	 * 获取树的oid集合
	 */
	getTreeOids = () => {
		let treedatapks=[];
		let rootrefpk=this.root.refpk;
		let getAllTreePk=function(item){
			if(item.refpk!=rootrefpk){
				treedatapks.push(item.refpk);
			}
			if(!item.children || item.children.length == 0) {
				return;
			}else{
				item.children.forEach((child)=>{
					getAllTreePk(child);
				})
			}
		}
		data.forEach( (item) => {
            getAllTreePk(item);
		});
		return treedatapks;
	}

	/**
	 * 确认删除
	 */
	onDelForBrowse= () => {
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000002'),//'时间戳',
					},
					pk_defdoc: {
						display: this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000003'),//'主键',
					},
					name : {
						display :this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000023'),//'档案名称'
					},
					code : {
						display : this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000024'),//'档案编码'
					},
					pk_defdoclist : {
						display : this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000025'),//'自定义档案列表主键'
					},
					pk_org : {
						display : this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000026'),//'所属组织'
					}
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values.ts.value=val.data.values.ts.value;
			delObj.values.pk_defdoc.value=val.data.values.pk_defdoc.value;
			delObj.values.name.value=val.data.values.name.value;
			delObj.values.code.value=val.data.values.code.value;
			delObj.values.pk_org.value=val.data.values.pk_org.value;
			delObj.values.pk_defdoclist.value=pageConfig.pk_defdoclist;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid:listpagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['savelist'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					this.props.editTable.setTableData(tableid,allD);
					toast({content:this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000004'),color:'success'});//'删除成功'
				}
			}
		});
	}

	onCheckBoxChange = (value) => {
		this.setState({
			enablestate : value
		},this.loadData);
	}

	/**
	 * 处理树
	 */
	dealTreeData = (data) => {
		let a=null;
		if(data[0].children.length==0){
			a=' ';
			
		}else if(data[0].children[data[0].children.length-1].length==0){
			a=' ';
			data[0].children.splice(data[0].children.length-1,1);
		}else{
			a = "(编码级次："+data[0].children[data[0].children.length-1]+")";
			data[0].children.splice(data[0].children.length-1,1);
		}
		let deleteDataChildrenProp = function(node){
			
			
            if(!node.children || node.children.length == 0) {
				if(node.refpk!='root'){
					node.refname=node.code+' '+node.refname;
					node.title=node.code+' '+node.title;
				}
                delete node.children;
            }
            else{
				node.isLeaf = false;
				if(node.refpk=='root'){
					node.title=node.title+' '+a;
					node.refname=node.refname+' '+a;
					node.children.forEach( (e) => {
						deleteDataChildrenProp(e);
					} );
				}else{
					node.refname=node.code+' '+node.refname;
					node.title=node.code+' '+node.title;
					node.children.forEach( (e) => {
						deleteDataChildrenProp(e);
					} );
				}
				
            }
		};
		if(!data[0].children || data[0].children.length == 0){
				
			data[0].title=data[0].title+' '+a;
			data[0].refname=data[0].refname+' '+a;
			delete data[0].children;
		    return data;
	    }else{
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
        });}
        return data;
	}


	/**
	 * 
	 * 树选中事件
	 */
	onSelectTree = (refpk) => {
        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
		let status = this.props.form.getFormStatus(formid);
		
		let pk_org=this.state.pk_org.refpk;
        if(status == 'edit'){
            return;
		}
        if(refpk == this.root.refpk){
            //清空表单
            this.props.form.EmptyAllFormValue(formid);
            return;
        }
        ajax({
            url:urls['queryform'],
            data:{
				pk_defdoc:refpk,
				pagecode : listpagecode
			},
            success:(res)=>{
				console.log(res);
                if(res.success){
					//清空表单
					
					let pk_org= this.state.pk_org.refpk;
                    this.props.form.EmptyAllFormValue(formid);
                    //设置表单为所选树节点数据
					this.props.form.setAllFormValue({[formid]:res.data[formid]});
				
					if(res.data){
						this.props.button.setDisabled({
							Delete : false,
							Edit :false,
							Enable : res.data[formid].rows[0].values.enablestate.value == '2',
							Disable : res.data[formid].rows[0].values.enablestate.value != '2'
						});
					}else{
						this.props.button.setDisabled({
							Delete : true,
							Enable : true,
							Disable : true
						});
					}
					if(this.state.NODE_TYPE=='grp'){
						if(res.data.head.rows[0].values.pk_org.value=='GLOBLE00000000000000'){
							this.props.button.setDisabled({
								Edit :true,
								Delete : true,
								Enable : true,
								Disable : true
							});
						}
					}else if(this.state.NODE_TYPE=='org'){
						if(pk_org!=res.data.head.rows[0].values.pk_org.value){
							this.props.button.setDisabled({
								Edit :true,
								Delete : true,
								Enable : true,
								Disable : true
							});
						}
					}	
                }
            }
        });
    }


	render() {
		const {syncTree,button,modal,editTable,DragWidthCom,form,search,BillHeadInfo} = this.props;
		const {createForm}=form;
		const {createBillHeadInfo} = BillHeadInfo;
		const {createSyncTree}=syncTree;
		let { createButtonApp } = button;
		let { createModal } = modal;  //模态框
		let { createEditTable } = editTable;  //模态框
		let { NCCreateSearch } = search;
		return(
			<div className="nc-bill-list">
				{createModal('modal', { noFooter: false })}
				{/* 头部 header*/}
				<div className="nc-bill-header-area">
					{/* 标题 title*/}
					<div className="header-title-search-area">
					{createBillHeadInfo({
                        title:this.state.title,
                        initShowBackBtn:false
                    })}
                    </div>
					{this.state.NODE_TYPE=='org'?
						<div className="search-box">
                        {BusinessUnitTreeRef({
                            onChange:this.onOrgChange,
                            value:this.state.pk_org
                        })}
                    </div>
						:
						''}
					{<span className="showOff">
						<Checkbox
							defaultChecked={false}
							onChange={this.onCheckBoxChange}
						>
							{this.props.MutiInit.getIntl("10140DEFDOC") && this.props.MutiInit.getIntl("10140DEFDOC").get('10140DEFDOC-000027')/***显示停用 */}
						</Checkbox>
					</span>}
					{/* 按钮组 btn-group*/}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list-actions',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick, 
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				{/* 单表区/树卡区域 */}
				{this.state.showType === 'table'&&
				(<div>
					<div className="nc-bill-table-area">
						{createEditTable(tableid, {//列表区
							selectedChange : this.tablSselectedChange,
							onBeforeEvent : this.tablOnBeforeEvent,
							onAfterEvent : this.onAfterEvent,
							useFixedHeader:true,    
							showIndex:true,				//显示序号
							showCheck:true,			//显示复选框
							adaptionHeight:true
						})}
					</div>
				</div>)}
				
				{this.state.showType ==='tree'&&
                (<div className="tree-card">
                    <DragWidthCom
                         // 左树区域
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId :treeid,
                                    needEdit: false, //不启用编辑
                                    showLine: false, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    showModal:false
                                })}
                            </div>}     //左侧区域dom
                         // 右卡片区域
                        rightDom = {
                            <div className="card-area">
                                {createForm(formid, {
                                    //onAfterEvent: this.onAfterFormEvent.bind(this)
                                },true)
                                }
                            </div> }     //右侧区域dom
                        defLeftWid = '20%'      // 默认左侧区域宽度，px/百分百
                    />
				</div>)}
				<PrintOutput
					ref='printOutput'
					url={urls['print']}
					data={{
						funcode : this.state.printConfig.funcode,
						nodekey : this.state.printConfig.nodekey,
						oids : this.state.printConfig.oids,
						outputType : 'output'
					}}
				/>
			</div>
		)

	}

}

Defdocbase = createPage({
	initTemplate: ()=>{},
	mutiLangCode: '10140DEFDOC'
})(Defdocbase);
ReactDOM.render(<Defdocbase />, document.querySelector('#app'));



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65