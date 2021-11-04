//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 物料税类
 * @author	yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,promptBox,createPageIcon } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
const {PrintOutput} = high;
const { NCDiv } = base;
import './index.less';

//const searchid = '10140UDDDBQ';
const tableid = 'mattaxes';
const pagecode = '10140MTAXC_mattaxes';
const appid = '0001Z0100000000012SD';
const urls = {
	save : '/nccloud/uapbd/mattaxes/save.do',
	query : '/nccloud/uapbd/mattaxes/query.do',
	print : '/nccloud/uapbd/mattaxes/print.do'
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
const keys = [];  //过来空行时，忽略的字段

//获取并初始化模板
let initTemplate = (props,callback) => {
	let count = 0;
	let result;
	let handleCallBack = () =>{
		if(count === 2){
			callback(result);
		}
	}
	props.createUIDom({
		pagecode : pagecode
	},
	(data)=>{
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta,()=>{
			count = count + 1;
			handleCallBack();
		});
		data.button && props.button.setButtons(data.button,()=>{
			data.button && props.button.setPopContent('DeleteOpr',props.MutiInit.getIntl("10140MTAXC") && props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000000'));/* 国际化处理： 确认删除？*/
			props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Print:true,
				Output:true,
				Save: false,
				Cancel: false,
				Refresh:true
			});
			props.button.setDisabled({
				Delete: true
			});
		});
	});

	ajax({
		url: urls['query'],
		data:{
			"pagecode": pagecode,
			"showOfff":false
		},
		success : (res) => {
			result = res;
			count = count + 1;
			handleCallBack();
		}
	})
}

//对表格模板进行加工操作
function modifierMeta(props,meta) {

	//添加表格操作列
	let event = {
		label: props.MutiInit.getIntl("10140MTAXC") && props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000001'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		itemtype: 'customer',
		visible:true,
		fixed: 'right',
		render(text, record, index) {
			return props.button.createOprationButton(
                ['DeleteOpr'],
                {
                    area:'table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
	meta[tableid].items.push(event);
	//props.renderItem('table',tableid,'creator',refer('creator'));
	return meta;
}

function tableButtonClick(props, id, text, record, index){
	let tableStatus = props.editTable.getStatus(tableid);
	if(tableStatus == 'browse' || tableStatus == undefined){
		let delObj = {
			rowId: index,
			status: '3',
			values: {
				ts: {
					display: props.MutiInit.getIntl("10140MTAXC") && props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000002'),/* 国际化处理： 时间戳*/
					value: record.values.ts.value
				},
				pk_mattaxes: {
					display: props.MutiInit.getIntl("10140MTAXC") && props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000003'),/* 国际化处理： 主键*/
					value: record.values.pk_mattaxes.value
				},
				mattaxescode : {
					display : props.MutiInit.getIntl("10140MTAXC") && props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000004'),/* 国际化处理： 税类编码*/
					value : record.values.mattaxescode.value
				},
				mattaxesname : {
					display : props.MutiInit.getIntl("10140MTAXC") && props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000005'),/* 国际化处理： 税类名称*/
					value : record.values.mattaxesname.value
				}
			}
		};
		let indexArr=[];
		indexArr.push(index);
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: [ delObj ]
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					allTableData = allD;
					props.editTable.setTableData(tableid,allD);
					toast({content:props.MutiInit.getIntl("10140MTAXC") && props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000006'),color:'success'});/* 国际化处理： 删除成功*/
				}
			}
		});
	}else{
		props.editTable.deleteTableRowsByIndex(tableid, index);
	}
}

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state={
			searchValue:'',
			searchDisable:false,				//简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false,				//列表是否显示停用数据
			ids : []
		}
		initTemplate(props,(res)=>{this.getData(0)});
	}

	componentWillUpdate() {
        if(this.props.editTable.getStatus(tableid) === 'edit'){
            window.onbeforeunload = () =>{
                return this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000007')/* 国际化处理： 页面还没有保存，确定离开页面？*/
            }
        }else{
			window.onbeforeunload = null;
		}
    }

	handleData = (res,query_from) => {
		if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
			this.props.dealFormulamsg(
				res.formulamsg,  //参数一：返回的公式对象
				{                //参数二：界面使用的表格类型
					"tableid":"editTable"
				}
			);
		}
		let { success, data } = res;
		let sum = 0;
		if (success) {
			allTableData = data[tableid];
			this.props.editTable.setTableData(tableid, data[tableid]);
			if(query_from > 0){
				let sum = data[tableid].rows ? data[tableid].rows.length : 0;
				if(sum === 0){
					toast({content:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000008'),color:'warning',title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000009')});/* 国际化处理： 未查询到符合条件的数据！,请注意！*/
				}else{
					if(query_from == 1){
						toast({content:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000010',{sum:sum}) ,color:'success',title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000012')});/* 国际化处理： 查询成功，共,条数据。,已成功！*/
					}else{
						toast({color:'success',title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000011')});/* 国际化处理： 查询成功，共,条数据。,已成功！*/
					}
					
				}
			}
		}else{
			query_from > 0 && toast({content:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000008'),color:'warning',title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000009')});/* 国际化处理： 未查询到符合条件的数据！,请注意！*/
		}
	}

	//请求列表数据
	//0:不提示查询  1：查询数据  2：刷新页面
	getData = (query_from) => {
		let showOff = this.state.isShowOff;
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:{
				"pagecode": pagecode,
				"showOfff":showOff
			},
			success: (res) => {
				this.handleData(res,query_from);
			}
		});
	};

	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//自动增行
		/* setTimeout(() => {
			let length = this.props.editTable.getNumberOfRows(moduleId);
			if(((length-2)===index)&&data.status==='2'){
				this.props.editTable.filterEmptyRows(tableid,keys);
				this.addTableRow(false);
			}
		}, 2); */
	}

	addRowCallback = () => {
		
	}

	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(length === 0){//未选择数据
			this.props.button.setDisabled({
				Delete: true
			});
		}else if(length === 1){//选择一行数据
			this.props.button.setDisabled({
				Delete: false
			});
		}else {//选择多行数据
			this.props.button.setDisabled({
				Delete: false
			});
		}
		if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			this.props.button.setPopContent('DeleteOpr','');
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: false,
				Print:false,
				Output:false,
				Save: true,
				Cancel: true,
				Delete: true,
				Refresh:false
			});
			this.props.button.setMainButton('Add',false);//编辑态设置新增按钮颜色
			this.setState({
				searchDisable:true,
				showOffDisable:true
			});
		}else{//浏览态
			this.props.button.setPopContent('DeleteOpr',this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000000'));/* 国际化处理： 确认删除？*/
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Print:true,
				Output:true,
				Delete: true,
				Save: false,
				Cancel: false,
				Refresh:true
			});
			if(this.props.editTable.getNumberOfRows(tableid)>0){
				this.props.button.setDisabled({
					Print: false,
					Output : false,
				});
			}else{
				this.props.button.setDisabled({
					Print: true,
					Output : true,
				});
			}
			this.props.button.setMainButton('Add',true);//设置新增按钮颜色
			this.setState({
				searchDisable:false,
				showOffDisable:false
			});
		} 
	}

	//显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
		},()=>{this.getData(1)});
		
	}

	addTableRow(isFocus){
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.addRow(tableid,num,isFocus);
	}

	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
            case 'Add':
                this.props.editTable.setStatus(tableid, 'edit');
				this.addTableRow(true);
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				break;
			case 'Cancel':
				promptBox({
					color:"warning",               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000013'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000014'),             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000015'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000016'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
					}
				});
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid,keys);
					let allTableRows = this.props.editTable.getAllRows(tableid,true);
					if(!this.props.editTable.checkRequired(tableid,allTableRows)){
						return;
					}		
					let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					if(!tableData || tableData.length === 0) {
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
						toast({title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000017'),color:'success'});/* 国际化处理： 保存成功！*/
						return;
					}
					tableData = this.props.editTable.getAllRows(tableid);   //此处改成getAllRows获取表格所有数据传递给后台，为了返回正常的提示行号，垃圾的处理方式···················
					let data = {
						pageid:pagecode,
						model : {
							areaType: "table",
							areacode:tableid,
							pageinfo: null,
							rows: []
						}
					};
					data.model.rows = tableData;
					let saveFunction = () => {
						ajax({
							url: urls['save'],
							data,
							success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									toast({title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000017'),color:'success'});/* 国际化处理： 保存成功！*/
									this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
									if(data){
										let allD = this.props.editTable.getAllData(tableid);
										Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
										Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
										allTableData = allD;
										this.props.editTable.setTableData(tableid,allD);
									}
								}
							}
						});
					}
					this.props.validateToSave(data,saveFunction,{[tableid] : 'table'},'grid');
				}, 0);
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000018'),color:'warning',title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000009')});/* 国际化处理： 请选择要删除的数据！,请注意！*/
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
						color:'warning',              // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000019'),                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
						content: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000020'),             // 提示内容,非必输/* 国际化处理： 您确认删除所选数据？*/
						noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
						noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
						beSureBtnName: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000015'),          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
						cancelBtnName: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000016'),           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
						beSureBtnClick: this.onDelForBrowse
					});
				}
				break;
			case 'Print':
				let printData = this.props.editTable.getAllRows(tableid);
				if(printData.length === 0){
					toast({content:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000021'),color:'warning',title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000009')});/* 国际化处理： 无可打印数据！,请注意！*/
					return;
				}
				let printIds = [];
				printData.forEach(item => {printIds.push(item.values['pk_mattaxes'].value)});
				print('pdf',
				urls['print'],
				{
					funcode : '10140MTAXC',
					nodekey : 'materialtaxes_print_ncc',
					oids : printIds
				});
				break;
			case 'Output':
				let outputData = this.props.editTable.getAllRows(tableid);
				if(outputData.length === 0){
					toast({content:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000022'),color:'warning',title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000009')});/* 国际化处理： 无可输出的数据！,请注意！*/
					return;
				}
				let outputIds = [];
				outputData.forEach(item => {outputIds.push(item.values['pk_mattaxes'].value)});
				this.setState({
					ids : outputIds
				},this.refs.printOutput.open());
				break;
			case "Refresh":
				this.getData(2);
				break;
		}
	
	}

	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData =   Utils.clone(allTableData);
		if(value.trim()===''){
			this.getData(0);
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['mattaxescode'].value.indexOf(value)>-1 || row.values['mattaxesname'].value.indexOf(value)>-1){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.props.editTable.setTableData(tableid,allData);
	}

	//浏览态确认删除事件
	onDelForBrowse=()=>{
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000002'),/* 国际化处理： 时间戳*/
					},
					pk_mattaxes: {
						display: this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000003'),/* 国际化处理： 主键*/
					},
					mattaxesname : {
						display : this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000005')/* 国际化处理： 税类名称*/
					},
					mattaxescode : {
						display : this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000004')/* 国际化处理： 税类编码*/
					}
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values.ts.value=val.data.values.ts.value;
			delObj.values.pk_mattaxes.value=val.data.values.pk_mattaxes.value;
			delObj.values.mattaxesname.value=val.data.values.mattaxesname.value;
			delObj.values.mattaxescode.value=val.data.values.mattaxescode.value;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					allTableData = allD;
					this.props.editTable.setTableData(tableid,allD);
					toast({title:this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000023'),color:'success'});/* 国际化处理： 删除成功！*/
				}
			}
		});
	}

	render() {
		let {  button, editTable,BillHeadInfo } = this.props;
		let { createEditTable } = editTable;
		//let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let {NCFormControl,NCCheckbox} = base;
		const {createBillHeadInfo} = BillHeadInfo;
		//let {createModal} = modal;

		return (
			<div className="nc-single-table">
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">

				{/* 标题 title */}
				<div className="header-title-search-area"> 
					{/* {createPageIcon()} */}
					{/* <h2 className="title-search-detail">{this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000028')}</h2> */}
					{createBillHeadInfo({
						title : this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000028'),/* 国际化处理： 物料税类*/
						initShowBackBtn:false
                    })}
					{/* 简单查询 */}
					<div className="title-search-detail">
						<NCFormControl
							placeholder={this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000024')/* 国际化处理： 请输入编码或名称筛选*/}
							value={this.state.searchValue}
							onChange={this.onSearch.bind(this)}
							type="search"
							disabled={this.state.searchDisable}
						/>
					</div>
					{/* 显示停用数据 */}
					{isShowOffEnable?(
						<div className="title-search-detail">
							<span className="showOff">
								<NCCheckbox
									checked={this.state.isShowOff}
									onChange={this.showOffChange.bind(this)}
									disabled={this.state.showOffDisable}
								>{this.props.MutiInit.getIntl("10140MTAXC") && this.props.MutiInit.getIntl("10140MTAXC").get('10140MTAXC-000029')/* 国际化处理： 显示停用*/}</NCCheckbox>
							</span>
						</div>
					):('')}
				</div>
					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</NCDiv>
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
						{createEditTable(tableid, {//列表区
							//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
							onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
							useFixedHeader:true,    
							//onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
							//onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
							selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
							//statusChange:this.updateButtonStatus.bind(this), 
							statusChange: function(){
								setTimeout(() => {
									this.updateButtonStatus();
								}, 0)
							}.bind(this),				//表格状态监听
							showIndex:true,				//显示序号
							showCheck:true,			//显示复选框
							isAddRow:true,
							addRowCallback:this.addRowCallback,
							adaptionHeight:true
							//params: 'test',                                  // 自定义传参

						})}
				</div>
				
				<PrintOutput
                        ref='printOutput'
                        url={urls['print']}
                        data={{
							funcode : '10140MTAXC',
							nodekey : 'materialtaxes_print_ncc',
							oids : this.state.ids,
							outputType : 'output'
						}}
                    />

			</div>
		);
	}
}

SingleTable = createPage({
	billinfo:{
		billtype: 'grid',
		pagecode: pagecode,
		bodycode: tableid
	},
	initTemplate: ()=>{},
	mutiLangCode: '10140MTAXC'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65