//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 物料 计价方式初始设置
 * @author	chaiyan3
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,getMultiLang,promptBox,createPageIcon,excelImportconfig } from 'nc-lightapp-front';
const {PrintOutput,ExcelImport}=high;
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal } = base;
let { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button,NCMessage } = base;
const {NCDiv} = base;
import './index.less';

const searchid = 'materialcostmode';
const tableid = 'costmode';
const pagecode = '10140MCMG_materialcostmode';
const appid = '0001Z010000000000O14';
const appcode = '10140MCMG';
const billType='costmode_org';
const urls = {
	print: '/nccloud/uapbd/materialcostmode/print.do',
	save : '/nccloud/uapbd/materialcostmode/save.do',
	query : '/nccloud/uapbd/materialcostmode/query.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do',
	updatecostmode :'/nccloud/uapbd/materialcostmode/updatecostmode.do',
	setofbookvalue:'/nccloud/uapbd/materialcostmode/setofbookvalue.do'//设置核算账簿值
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['costmode','batchcost'];  //过来空行时，忽略的字段
// const tableBtnAry = ["DelLine","UpdateMaterial"];		//表格列操作按钮
const pk_item = 'pk_costmode';     

let tableBtnAry =(props)=>{
	return props.editTable.getStatus(tableid) === 'edit'?['DelLine']:[ 'DelLine','UpdateMaterial'];
} 


let initTemplate = (props) => {
	props.createUIDom({
		pagecode : pagecode,
		//appcode : appcode
	},
	(data)=>{
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
		data.button && props.button.setButtons(data.button);
		data.button && props.button.setButtonDisabled({
			Delete:true,
		});
		props.button.setPopContent('DelLine',props.MutiInit.getIntl("10140MCMG") && props.MutiInit.getIntl("10140MCMG").get('10140MCMG-000000'));/* 国际化处理： 确认要删除该信息吗*/
		let excelimportconfig = excelImportconfig(props,'uapbd',billType,true,'',{appcode: appcode,pagecode:pagecode},()=>{
			getLoadData(props);
		  });
		//let excelimportconfig = excelImportconfig(props,'uapbd','costmode_org',true,'',{appcode: '10140MCMG',pagecode: '10140MCMG_materialcostmode'});
		props.button.setUploadConfig("import",excelimportconfig);
	});
}

//对表格模板进行加工操作
function modifierMeta(props,meta) {
	//添加表格操作列
	let event = {
		label:  props.MutiInit.getIntl("10140MCMG") && props.MutiInit.getIntl("10140MCMG").get('10140MCMG-000001'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		fixed:'right',
		width: 180,
		itemtype: 'customer',
		visible:true,
		render(text, record, index) {
			return props.button.createOprationButton(
				tableBtnAry(props),
				{
					area: "list_inner",
					buttonLimit: 3,
					onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
				}
			)
		}
		
	};
	meta[tableid].items.push(event);
	//props.renderItem('table',tableid,'creator',refer('creator'));
	let materialBaseClassItem = meta[tableid].items.find(item=>item.attrcode==='pk_marbasclass');
	materialBaseClassItem.isShowUnit = true;
	let pk_org = meta[tableid].items.find(item=>item.attrcode==='pk_org');
	pk_org.refName =  props.MutiInit.getIntl("10140MCMG") && props.MutiInit.getIntl("10140MCMG").get('10140MCMG-000002');/* 国际化处理： 财务组织集团*/
	pk_org.rootNode ={refname:props.MutiInit.getIntl("10140MCMG") && props.MutiInit.getIntl("10140MCMG").get('10140MCMG-000002'),refpk:'root'};/* 国际化处理： 财务组织集团*/
	return meta;
}

function tableButtonClick(props, id, text, record, index){
	let tableStatus = props.editTable.getStatus(tableid);
	switch(id){
		case "UpdateMaterial":
			let data = {
				pageid:pagecode,
				id: record.values.pk_costmode.value,
				model : {
					areaType: "table",
					pageinfo: null,
					rows: []
				}
			};
			if(props.editTable.getStatus(tableid) === 'browse' || tableStatus == undefined ){//编辑状态
				ajax({
					url: urls['updatecostmode'],
					data:data,
					success: (res) => {
						if(res.success){
							toast({color:"success",content:props.MutiInit.getIntl("10140MCMG") && props.MutiInit.getIntl("10140MCMG").get('10140MCMG-000003')});/* 国际化处理： 已经加入物料更新的任务中！*/
							//this.refreshAction(props);
							getLoadData(props);
						}
					}
					
				});
			}else{
				
				NCMessage.create({content: props.MutiInit.getIntl("10140MCMG") && props.MutiInit.getIntl("10140MCMG").get('10140MCMG-000004'), color: 'warning'});//默认top/* 国际化处理： 编辑态不允许更新*/
				return;
			}
			break;
		case 'DelLine':
			let tableStatus = props.editTable.getStatus(tableid);
			if(tableStatus=='browse'){
				//props.button.setPopContent({'DelLine':'确认要删除该信息吗'})
				let delObj = {
					rowId: index,
					status: '3',
					values: {
					}
				};
				delObj.values = record.values;
				let indexArr=[];
				indexArr.push(index);
				let data = {
					model: {
						areaType: 'table',
						pageinfo: null,
						rows: [ delObj ]
					}
				};
				ajax({
					url: urls['save'],
					data,
					success: function(res) {
						let { success, data } = res;
						if (success) {
							props.editTable.deleteTableRowsByIndex(tableid, indexArr);
							let allD = props.editTable.getAllData(tableid);
							Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
							props.editTable.setTableData(tableid,allD);
							toast({title:props.MutiInit.getIntl("10140MCMG") && props.MutiInit.getIntl("10140MCMG").get('10140MCMG-000005'),color:'success'});/* 国际化处理： 删除成功！*/
							setTimeout(() => {
								getLoadData(props);
							}, 100)
						}
					}.bind(this)
				});
				
				
			}else
			{
				props.editTable.deleteTableRowsByIndex(tableid, index);
			}
			break;
		default:
            console.log(id, index);
            break;

	}
}


//请求列表数据
function getLoadData(props){
	ajax({
		url: urls['query'],
		data:{
			pageid: pagecode,
		},
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if(data && data[tableid]){
					props.editTable.setTableData(tableid,data[tableid]);
					let flag = data[tableid].rows && data[tableid].rows.length > 0;
					props.button.setButtonDisabled({
						Edit:!flag,
						Print:!flag,
						Output:!flag,
					});	
				}else{
					props.editTable.setTableData(tableid, {rows: []});
					props.button.setButtonDisabled({
							Edit:true,
							Print:true,
							Output:true,
						});	
				}
			}
		}
	});
};


class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state={
			searchValue:'',
			json:{},
			searchDisable:true,				//简单搜索框是否禁用	true：禁用		false：可用
			moreButton:false,				//更多按钮状态
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false				//列表是否显示停用数据
		}
	}
	componentDidMount() {
		this.getData(false);
	}

	componentWillMount() {
		let callback = (json) => {
            this.setState({json})
        }
        getMultiLang({moduleId: appcode, domainName: 'uapbd',callback})
	}

	componentDidUpdate(){
		let tableStatus = this.props.editTable.getStatus(tableid) 
		if(tableStatus != 'add' && tableStatus != 'edit'){
			window.onbeforeunload = null;
		}else{
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}
	
	//请求列表数据
	getData = (showOff = false) => {
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:{
				pageid: pagecode,
				showOfff:showOff
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					Utils.handleTableReData({
						data : data,
						tableid : tableid,
						props : this.props,
						empty : (data) => {	//数据为空时执行回调方法
							this.props.editTable.setTableData(tableid, {rows: []});
							this.props.button.setDisabled({
								Edit: true,
								Print:true,
								Output:true,
							});	
						},
						notEmpty : (data)=>{	//数据不为空时执行回调方法
							//是否启用转换成开关
							// Utils.convertGridEnablestate(data[tableid].rows);
							console.log('vvv',data[tableid])
							Utils.showFormular(this.props,res,{tableid:"editTable"});//适配显示公式
							this.props.editTable.setTableData(tableid,data[tableid]); 
							this.props.button.setDisabled({
								Edit: false,
								Print:false,
								Output:false,
							});	
						},
					});
					this.toggleShow("browse");
				}
			}
		});
	};

	//切换页面状态
	toggleShow = (status) =>{
		let flag = status === 'browse' ? false : true;
		if(!flag){
			this.props.button.setPopContent('DelLine',this.state.json['10140MCMG-000006']);/* 国际化处理： 确认要删除该信息吗？*/
		}else{
			this.props.button.setPopContent('DelLine','');
		}
		//this.props.button.setButtonVisible(['Save','Cancel'],flag);
		//this.props.button.setButtonVisible(['Edit','Refresh','Print','Output'],!flag);
		this.props.button.setButtonVisible({
			Add: true,
			Delete:true,
			Save:flag,
			Edit:!flag,
			Cancel:flag,
			Refresh:!flag,
			Print:!flag,
			Output:!flag,
			import:!flag,
			export:!flag,
		});
		this.props.button.setMainButton('Add',!flag);
		if(!flag){//设置浏览态打印按钮是否可用
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
		}
		this.setState({
			searchDisable:flag,
			showOffDisable:flag
		});
		
		this.props.editTable.setStatus(tableid, status==='browse'?"browse" :"edit");
	}

	//表格编辑前事件
	onBeforeEvent(props,moduleId, item, index,value, record){
		let meta = props.meta.getMeta();
		if(item.attrcode === 'pk_cost'){
			let pk_cost = meta[tableid].items.find(key=>key.attrcode==='pk_cost');
			if(record.values.pk_org.value){
				pk_cost.queryCondition = function () {
				return {
					pk_org : record.values.pk_org.value,
					GridRefActionExt: 'nccloud.web.uapbd.material.materialcostmode.action.CostRegionSQLBuilder'
					}
				}
			}else{
				pk_cost.queryCondition = function () {
					return {
						GridRefActionExt: 'nccloud.web.uapbd.material.materialcostmode.action.CostRegionSQLBuilder'
					}
				}
			}
			
		    props.meta.setMeta(meta);
		}
		return true
	}
	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		if(key === 'batchcost' ){
			console.log('test00',data)
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
						//操作成功，更新页面当前行数据
						let allD = this.props.editTable.getAllData(tableid,false);
						
						// Utils.convertGridEnablestate(data[tableid].rows);
						Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
						this.props.editTable.setTableData(tableid,allD);

					}else{
						this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,key,{value:!(data.values[key].value)});
					}
				},
				error: (res)=> {
					toast({ color: 'danger', content: res.message });
					this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,key,{value:!(data.values[key].value)});

				}
			});
		}
		if(key === 'pk_cost'){
			let pk_costvalue = value[0].newvalue.value;
			console.log('test01',data)
			ajax({
				url: urls.setofbookvalue,
				data: {
					pk_costvalue:pk_costvalue,//当前选中成本域的pk
				},
				success: (res) => {
					if (res.success) {
						console.log('CYTEST',res)
						console.log('CY',data.values)
						if (res.data) {	
							this.props.editTable.setValByKeyAndIndex(tableid, index, 'pk_setofbook', {value: res.data.bookVO.pk_accountingbook,display:res.data.bookVO.name});//设置批次核算默认值
							if(data.values.pk_org.value == ""){
								this.props.editTable.setValByKeyAndIndex(tableid, index, 'pk_org', {value: res.data.costVO.pk_org,display:res.data.costVO.name});
							}
						}else{
							this.props.editTable.setValByKeyAndIndex(tableid, index, 'pk_setofbook', {value: '',display:''});
						}
					}
				},
				error:(res) =>{
					this.props.editTable.setValByKeyAndIndex(tableid, index, 'pk_setofbook', {value: '',display:''});
				}
			})
		}
		if(key === 'pk_org'){//切换所属组织后清除成本域和核算账簿字段值
			this.props.editTable.setValByKeyAndIndex(tableid, index, 'pk_cost', {value: '',display:''});
			this.props.editTable.setValByKeyAndIndex(tableid, index, 'pk_setofbook', {value: '',display:''});
		}
		// //自动增行
		// setTimeout(() => {
		// 	let length = this.props.editTable.getNumberOfRows(moduleId);
		// 	if(((length-2)===index)&&data.status==='2'){
		// 		this.props.editTable.filterEmptyRows(tableid,keys);
		// 		this.addTableRow(false);
		// 	}
		// }, 2);
		
	}

	// 自动增行后的回调
	addRowAutoCallback() {
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'costmode', {value:'3', display:this.state.json['10140MCMG-000007'] });//自动增行计价方式默认值/* 国际化处理： 移动平均*/
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'batchcost', {value: false });//设置批次核算默认值
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
	}

	//显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
		});
		this.getData(this.state.isShowOff);
	}

	onCancelSureEvent() {
		this.props.editTable.cancelEdit(tableid,()=>{this.toggleShow("browse")});
	}
	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Add':
				
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				this.props.editTable.addRow(tableid,num,true);
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'costmode', {value:'3', display:this.state.json['10140MCMG-000007'] });/* 国际化处理： 移动平均*/
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'batchcost', {value: false });//设置批次默认值
				this.toggleShow("edit");
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				this.toggleShow("edit");
				break;
			case 'Cancel':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140MCMG-000008'],/* 国际化处理： 确认取消*/
					content:this.state.json['10140MCMG-000009'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick:()=>{this.onCancelSureEvent()}
					})
				return;
				break;
			case 'Save':
				this.props.editTable.filterEmptyRows(tableid,keys);
				//let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
				let tableData = this.props.editTable.getAllRows(tableid,true);
				if(!tableData || tableData.length === 0) {
					toast({content: this.state.json['10140MCMG-000010'], color:'info'})/* 国际化处理： 没有要保存的数据*/
					return;
				}
				if(!this.props.editTable.checkRequired(tableid,tableData)) return;
				let data = {
					pageid:pagecode,
					model : {
						areaType: "table",
						pageinfo: null,
						rows: [],
						areacode: tableid//添加表单的areacode编码
					}
				};
				data.model.rows = tableData;
				this.props.validateToSave(data,()=>{
					ajax({
						url: urls['save'],
						data,
						success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
							let { success,data} = res;
							if (success) {
								this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
								Utils.handleTableReData({
									data : data,
									tableid : tableid,
									props : this.props,
									empty : (data) => {	//数据为空时执行回调方法
										//this.props.editTable.setTableData(tableid, {rows: []});
										this.getData();
										this.props.button.setDisabled({
											Edit:true,
											Print:true,
											Output:true,
										});	
									},
									notEmpty : (data)=>{
										let allD = this.props.editTable.getAllData(tableid);
										Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
										// Utils.convertGridEnablestate(data[tableid].rows);
										Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
										this.props.editTable.setTableData(tableid, allD);
										this.props.button.setDisabled({
											Edit: false,
											Print:false,
											Output:false
										});	
									}
								});
							}
							this.toggleShow("browse");
							toast({title: this.state.json['10140MCMG-000011'], color:'success'});	/* 国际化处理： 保存成功！*/
						}.bind(this)
					});
				},{[tableid]: "editTable"});	

				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.state.json['10140MCMG-000012'],color:'warning'});/* 国际化处理： 请选择要删除的数据*/
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
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title:this.state.json['10140MCMG-000013'],/* 国际化处理： 删除提醒*/
						content:this.state.json['10140MCMG-000014'],/* 国际化处理： 确定要删除数据吗？*/
						beSureBtnClick:()=>{this.onDelForBrowse()}
						})
					this.toggleShow("browse");
				}
				
				break;
			case "Refresh":
				//this.setState({ searchValue:'' });
				this.getData();
				toast({title:this.state.json['10140MCMG-000015'],color:'success'});/* 国际化处理： 刷新成功！*/
				break;
			case 'Print':
				this.output('print');
				break;
			case 'Output':
				this.output('output');
				break;
			case 'export':
			console.log('export');
			this.props.modal.show('exportFileModal');
			break;
		}
	
	}

	onEditDellineClick(tableid, indexArr){
		this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
	}
	//输出和打印功能函数
	output(type=''){
		let allData = this.props.editTable.getAllData(tableid);
		let pks = [];
		allData.rows.forEach((item)=>{
			pks.push(item.values['pk_costmode'].value);
		});
		if(type=='print'){
			//打印
			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				urls['print'], 
				{
					billtype:'',  //单据类型
					funcode: appcode,      //功能节点编码，即模板编码
					nodekey:'materialcostmode',     //模板节点标识
					oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
				}
				);
		}else if(type='output'){
			this.setState({
				pks: pks
				},this.refs.printOutput.open());	
		}
	}

	onSelectMoreButton({ key }) {
		toast({content:this.state.json['10140MCMG-000016'],color:'warning'});/* 国际化处理： 努力开发中......*/
	 
	}
	
	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData = Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['pk_org'].value.indexOf(value)>-1 ){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.props.editTable.setTableData(tableid,allData);
	}

	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		let _that = this;
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					// ts: {
					// 	display: '时间戳',
					// },
					// pk_costmode: {
					// 	display: '主键',
					// }
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values = val.data.values;
			// delObj.values.ts.value=val.data.values.ts.value;
			// delObj.values.pk_costmode.value=val.data.values.pk_costmode.value;
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
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					_that.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					_that.props.editTable.setTableData(tableid,allD);
					toast({title:this.state.json['10140MCMG-000005'],color:'success'});/* 国际化处理： 删除成功！*/
					_that.getData();
				}
			}.bind(this)
		});
		this.getData();
	}

	// 列表勾选事件
	onSelected=()=>{
		let rows = this.props.editTable.getCheckedRows(tableid);

        let isDisable = (rows && rows.length>0)?false:true;

        this.props.button.setButtonDisabled(['Delete'],isDisable);
		this.setState(this.state);
	 }
	render() {
		let { table, button, search,editTable,modal,BillHeadInfo } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let {NCFormControl,NCCheckbox} = base;
		let {createModal} = modal;
		const {createBillHeadInfo} = BillHeadInfo;
		const { Item } = Menu;
		let moreButton = (
			<Menu
                  onSelect={this.onSelectMoreButton.bind(this)}>
                      {/* <Item key="1">自定义档案维护-全局</Item>
					  <Item key="2">自定义档案维护-集团</Item>
					  <Item key="3">this.state.json['10140MCMG-000022']-this.state.json['10140MCMG-000025']</Item> */}/* 国际化处理： 自定义档案维护,业务单元*/
                </Menu>
		);
		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={{borderBottom:'none'}}>
					{/* 标题 title */}
					<div className="header-title-search-area">
						{/* { {createPageIcon()}大图标 */}
						{/* <h2 className="title-search-detail">{this.state.json['10140MCMG-000026'] 国际化处理： 物料计价方式初始设置}</h2> } */}
						{createBillHeadInfo({
							title : this.state.json['10140MCMG-000026'], //国际化处理： 物料计价方式初始设置}
							initShowBackBtn:false
                   		 })}
						{/* 简单查询 */}
						{/* <div className="title-search-detail">
							<NCFormControl
								placeholder="请输入编码或名称筛选"
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								//className="title-search-detail"
								disabled={this.state.searchDisable}
							/>
						</div> this.state.json['10140MCMG-000027']*/}
						{/* 显示停用数据 */}
						<div className="title-search-detail">
							{isShowOffEnable?(
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>this.state.json['10140MCMG-000028']</NCCheckbox>/* 国际化处理： 显示停用*/
								</span>
							):('')}
						</div>
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
					{/* 单表页面去除查询区 */}
					{/* <div className="search-area">
						{NCCreateSearch(searchid, {//查询区
							clickSearchBtn: this.onSearchBtnClick.bind(this),		//查询按钮点击事件绑定
							defaultConditionsNum:2		//默认显示查询添加个数，如果不传该参数则全部显示 
							//saveSearchPlan:true			//是否显示保存方案，默认false不显示
						})}
					</div> */}
				
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
						{createEditTable(tableid, {//列表区
							//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
							onAfterEvent: this.onAfterEvent.bind(this), 
							onBeforeEvent:this.onBeforeEvent.bind(this),                     // 控件的编辑后事件  
							useFixedHeader:true,    
							onSelected: this.onSelected.bind(this),                        // 左侧选择列单个选择框回调
							onSelectedAll:this.onSelected.bind(this),                 // 左侧选择列全选回调
							selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
							//statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
							statusChange: function(){
								setTimeout(() => {
									this.updateButtonStatus();
								}, 0)
							}.bind(this),			//表格状态监听
							isAddRow: true, 	// 失去焦点是否自动增行
							addRowCallback: this.addRowAutoCallback.bind(this),	// 自动增行后的回调
							showIndex:true,				//显示序号
							showCheck:true,			//显示复选框
							adaptionHeight:true
							//params: 'test',                                  // 自定义传参

						})}
					
				</div>
				{/* 删除前确认模态框 */}
				{createModal('modal',{
					title : this.state.json['10140MCMG-000018'],										//标题/* 国际化处理： 确认删除*/
					content : this.state.json['10140MCMG-000019'],							//内容/* 国际化处理： 确认删除所选数据？*/
					//beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					leftBtnName : this.state.json['10140MCMG-000020'],   								//左侧按钮名称/* 国际化处理： 确认*/
    				rightBtnName : this.state.json['10140MCMG-000021']   								//右侧按钮名称/* 国际化处理： 关闭*/
				})}
				<PrintOutput
					ref = 'printOutput'
					url = {urls['print']}
					data = {{
						funcode: appcode,      //功能节点编码，即模板编码
						nodekey: 'materialcostmode',     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
				>
				</PrintOutput>
				<ExcelImport
                {...Object.assign(this.props)}
                moduleName ='uapbd'//模块名
                billType = {billType}//单据类型
                selectedPKS = {[]}
                appcode={appcode}
                pagecode={pagecode}
            	/>
			</div>
		);
	}
}

SingleTable = createPage({
	billinfo:{
        billtype:'grid',
        pagecode:pagecode,
        bodycode:tableid
    },
	initTemplate: initTemplate,
	mutiLangCode:'10140MCMG'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65