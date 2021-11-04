//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 交易代码
 * @author	chaiyan3
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,getMultiLang,promptBox,createPageIcon } from 'nc-lightapp-front';
const {PrintOutput}=high;
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal } = base;
let { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button } = base;
import './index.less';
const { NCDiv } = base;
//chaiyan3 导入国家地区
import Org from  '../../../../uapbd/refer/pubinfo/CountryDefaultGridRef'  

// const searchid = '10140UDDDBQ';
const tableid = 'transactioncode';
const pagecode = '10140TRANS_transactio';
//const nodetype = 'grp';
const appid = '0001Z010000000000O0Y';
const appcode = '10140TRANS';
const urls = {
	print: '/nccloud/uapbd/transactioncode/print.do',
	save : '/nccloud/uapbd/transactioncode/save.do',
	query : '/nccloud/uapbd/transactioncode/query.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['pk_country','dataoriginflag'];  //过来空行时，忽略的字段

//获取并初始化模板
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
		props.button.setPopContent({'Delline':props.MutiInit.getIntl("10140TRANS") && props.MutiInit.getIntl("10140TRANS").get('10140TRANS-000000')})/* 国际化处理： 确认要删除该信息吗*/
	});
}

//对表格模板进行加工操作
function modifierMeta(props,meta) {
	/* meta[tableid].items.map(function (item) {
		if (item.hasOwnProperty('visible') && item['visible'].value) {
			item['width'] = 200;
		}
	}); */
	//添加表格操作列
	let event = {
		label:  props.MutiInit.getIntl("10140TRANS") && props.MutiInit.getIntl("10140TRANS").get('10140TRANS-000001'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		fixed:'right',
		itemtype: 'customer',
		visible:true,
		render(text, record, index) {
			let tableStatus = props.editTable.getStatus(tableid);
            let btnArray = ['Delline'];

            return props.button.createOprationButton(
                btnArray,
                {
                    area: "table-opr-button",
                    buttonLimit: 3,
                    onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                }
            )
		}
	};
	meta[tableid].items.push(event);
	//props.renderItem('table',tableid,'creator',refer('creator'));
	return meta;
}

function tableButtonClick(props, id, text, record, index){

    switch(id){
        case 'Delline':
            let tableStatus = props.editTable.getStatus(tableid);
            if(tableStatus=='browse'){
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
							allTableData = allD;
							toast({title:props.MutiInit.getIntl("10140TRANS") && props.MutiInit.getIntl("10140TRANS").get('10140TRANS-000002'),color:'success'});/* 国际化处理： 删除成功！*/
							getLoadData(props);
						}
					}.bind(this)
				});
            }else
            {
                props.editTable.deleteTableRowsByIndex(tableid, index);
            }
            break;
        default:
            break;
    }
}

//请求列表数据
function getLoadData(props){
	if(props.editTable.getNumberOfRows(tableid)>0){
		props.button.setDisabled({
			Edit:false,
			Print: false,
			Output : false,
		});
	}else{
		props.button.setDisabled({
			Edit:true,
			Print: true,
			Output : true,
		});
	}

};

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state={
			searchValue:'',
			countryDisable:false,//国家地区是否禁用
			json:{},
			searchDisable:false,				//简单搜索框是否禁用	true：禁用		false：可用
			//moreButton:false,				//更多按钮状态
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false				//列表是否显示停用数据
		}
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
	componentDidMount() {
		// this.getData();
		//mazheng 重构此处代码, 组织节点不能直接查询数据,  this.getData()参数放到代码内部获取,以便查询复用,
		if(typeof(this.state.curOrg) == 'undefined' || this.state.curOrg === ''){
			this.toggleShow("browse");
			this.props.button.setDisabled({
				Delete:true,
				Edit: true,
				Print:true,
				Output:true
			});			
			return;
		}else{
			setTimeout(() => { this.getData(); });
		}
	}

	componentWillMount() {
		let callback = (json) => {
            this.setState({json})
        }
        getMultiLang({moduleId: appcode, domainName: 'uapbd',callback})
	}
   //mazheng添加组织选中事件
   onOrgChange(val){			
	this.state.curOrg = val; 
	this.setState(this.state.curOrg);
	setTimeout(() => { this.getData(); });
}
	//请求列表数据
	getData = () => {
		let showOff = this.state.isShowOff;		
		//mazheng 重构代码, 设置查询参数
		var param = {
			pagecode: pagecode,
			showOff: this.state.isShowOff,
			pk_country: this.state.curOrg.refpk
			// nodetype: this.config.nodetype
		};

		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:param,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if(data){	
						Utils.showFormular(this.props,res,{tableid:"editTable"});//适配显示公式
						this.props.editTable.setTableData(tableid,data[tableid]);
						allTableData = data[tableid];
						this.onSearch(this.state.searchValue);//根据筛选条件过滤
						this.props.button.setDisabled({
							Edit:false,
							Print:false,
							Output:false,
						});	
					}else{
						this.props.editTable.setTableData(tableid, {rows: []});
							this.props.button.setDisabled({
								Edit:true,
							    Print:true,
								Output:true,
							});	
					}
					// Utils.handleTableReData({
					// 	data : data,
					// 	tableid : tableid,
					// 	props : this.props,
					// 	empty : (data) => {	//数据为空时执行回调方法
					// 		this.props.editTable.setTableData(tableid, {rows: []});
					// 		this.props.button.setDisabled({
					// 			Edit: true,
					// 			Print:true,
					// 			Output:true,
					// 		});	
					// 	},
					// 	notEmpty : (data)=>{	//数据不为空时执行回调方法
					// 		//是否启用转换成开关
					// 		//Utils.convertGridEnablestate(data[tableid].rows);
					// 		this.props.editTable.setTableData(tableid,data[tableid]); 
					// 		this.onSearch(this.state.searchValue);//根据筛选条件过滤
					// 		this.props.button.setDisabled({
					// 			Edit: false,
					// 			Print:false,
					// 			Output:false,
					// 		});	
					// 	},
					// 	after : (data)=> {	//数据处理完成后执行回调方法
					// 		allTableData = data[tableid];
					// 	}
					// });
					this.toggleShow("browse");
				}
			}
		});
	};

	//切换页面状态
	toggleShow = (status) =>{
		let flag = status === 'browse' ? false : true;
		if(!flag){
			this.props.button.setPopContent('Delline',this.state.json['10140TRANS-000003']);/* 国际化处理： 确认要删除该信息吗？*/
		}else{
			this.props.button.setPopContent('Delline','');
		}
		// this.props.button.setButtonVisible(['Save','Cancel'],flag);
		// this.props.button.setButtonVisible(['Edit','Refresh','Print','Output'],!flag);
		this.props.button.setButtonVisible({
			Add: true,
			Delete:true,
			Save:flag,
			Edit:!flag,
			Cancel:flag,
			Refresh:!flag,
			Print:!flag,
			Output:!flag
		});
		if(!flag){
			//未选择国家地区时，新增刷新按钮置灰
			if (this.state.curOrg && this.state.curOrg.refpk) {
				this.props.button.setDisabled({
					Refresh:false,
					Add:false
				})
			}else{
				this.props.button.setDisabled({
					Refresh:true,
					Add:true
				})
			}
			//设置浏览态打印按钮是否可用
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
		this.props.button.setMainButton('Add',!flag);
		this.setState({
			searchDisable:flag,
			countryDisable:flag,
			showOffDisable:flag
		});
		this.props.editTable.setStatus(tableid, status==='browse'?"browse" :"edit");
	}
	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		// let length = this.props.editTable.getNumberOfRows(moduleId);
		// if(((length-1)===index)&&data.status==='2'){
		// 	this.props.editTable.filterEmptyRows(tableid,keys);
		// 	this.onButtonClick('add');
		// }
	
		// if(key === 'enablestate' || key === 'isdefault'){  // && data.values['doclevel'] === '0'){
		// 	let allRows = props.editTable.getAllRows(moduleId);
			
		// 	let rowData = Utils.clone(data);
		// 	rowData.status = '1'
		// 	if (rowData.values['enablestate'].value){
		// 		rowData.values['enablestate'].value = '2';
		// 	}else{
		// 		rowData.values['enablestate'].value = '3';
		// 	}

		// 	let reqData= [];
		// 	reqData.push(rowData);
		// 	let changDdata = {
		// 		pageid:pagecode,
		// 		model: {
		// 			areaType: 'table',
		// 			pageinfo: null,
		// 			rows: reqData
		// 		}
		// 	};
		// 	ajax({
		// 		url: urls['save'],
		// 		data:changDdata,
		// 		success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
		// 			let { success, data } = res;
		// 			if (success) {
		// 				//操作成功，更新页面当前行数据
		// 				let allD = this.props.editTable.getAllData(tableid);
						
		// 				Utils.convertGridEnablestate(data[tableid].rows);
		// 				Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
		// 				this.props.editTable.setTableData(tableid,allD);
		// 			}else{
		// 				if (key === 'enablestate') {
		// 					this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,'enablestate',{value:!(data.values['enablestate'].value)});
		// 				} 
		// 				if (key === 'isdefault') {
		// 					this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,'isdefault',{value:!(data.values['isdefault'].value)});
		// 				}
		// 			}
		// 		}
		// 	});
		// }
		//自动增行
		// setTimeout(() => {
		// 	let length = this.props.editTable.getNumberOfRows(moduleId);
		// 	if(((length-2)===index)&&data.status==='2'){
		// 		this.props.editTable.filterEmptyRows(tableid,keys);
		// 		this.addTableRow(false);
		// 	}
		// }, 2);
	}

	//更新按钮状态
	updateButtonStatus(){
		
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(length === 0){//未选择数据
			this.props.button.setDisabled({
				Delete: true,
			});
		}else if(length === 1){//选择一行数据
			this.props.button.setDisabled({
				Delete: false,
			});
		}else {//选择多行数据
			this.props.button.setDisabled({
				Delete: false,
			});
		}
	}

	//显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
		});
		setTimeout(() => {
			this.getData();
		}, 10);			
	}

	onCancelSureEvent() {
		this.props.editTable.cancelEdit(tableid,()=>{this.toggleShow("browse")});
	}

	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Add':
				if(typeof(this.state.curOrg) == 'undefined' || this.state.curOrg === ''){
					toast({content:this.state.json['10140TRANS-000004'],color:'warning'});/* 国际化处理： 国家地区不能为空！*/
					return;
				}
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				this.props.editTable.addRow(tableid,num,true);
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_country', {value: this.state.curOrg.refpk, display:this.state.curOrg.refname});//设置国家地区默认值
				this.toggleShow("edit");
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				this.toggleShow("edit");
				break;
			case 'Cancel':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140TRANS-000005'],/* 国际化处理： 确认取消*/
					content:this.state.json['10140TRANS-000006'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick:()=>{this.onCancelSureEvent()}
					})
				return;
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid,keys);
					//let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					let tableData = this.props.editTable.getAllRows(tableid,true);
					if(!tableData || tableData.length === 0) {
						this.props.editTable.cancelEdit(tableid,()=>{this.toggleShow("browse")});
						toast({content: this.state.json['10140TRANS-000008'], color:'info'})/* 国际化处理： 保存成功*/
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
					let that = this;
					data.model.rows = tableData;
					this.props.validateToSave(data,()=>{
						ajax({
							url: urls['save'],
							data,
							success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									that.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
									Utils.handleTableReData({
										data : data,
										tableid : tableid,
										props : that.props,
										empty : (data) => {	//数据为空时执行回调方法
											//this.props.editTable.setTableData(tableid, {rows: []});
											that.getData();	
										},
										notEmpty : (data)=>{	//数据不为空时执行回调方法
											let allD = this.props.editTable.getAllData(tableid);
											Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
											//Utils.convertGridEnablestate(data[tableid].rows);
											Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
											that.props.editTable.setTableData(tableid, allD);
											allTableData = allD;
											//this.onSearch(this.state.searchValue);//根据筛选条件过滤
											that.props.button.setDisabled({
												Edit: false,
												Print:false,
												Output:false
											});		
										}
									});
									that.toggleShow("browse");
									toast({title: this.state.json['10140TRANS-000008'], color:'success'});							/* 国际化处理： 保存成功！*/
								}
							}.bind(this)
						});
					},{[tableid]: "editTable"});	
				}, 0);
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.state.json['10140TRANS-000009'],color:'warning'});/* 国际化处理： 请选择要删除的数据*/
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
						title:this.state.json['10140TRANS-000010'],/* 国际化处理： 删除提醒*/
						content:this.state.json['10140TRANS-000011'],/* 国际化处理： 确定要删除数据吗？*/
						beSureBtnClick:()=>{this.onDelForBrowse()}
						})
					this.toggleShow("browse");
				}
				break;
			case "Refresh":
				//this.setState({ searchValue:'' });
				this.getData();
				toast({title:this.state.json['10140TRANS-000012'],color:'success'});/* 国际化处理： 刷新成功！*/
				break;
			case 'Print':
				this.output('');
				break;
			case 'Output':
				this.output('output');
				break;
		}
	
	}

	//输出和打印功能函数
	output(type=''){
		let allData = this.props.editTable.getAllData(tableid);
		
        let pks = [];
        allData.rows.forEach((item)=>{
            pks.push(item.values['pk_transactioncode'].value);
        });
        if(type==''){
            //打印
			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				urls['print'], 
				{
					//billtype:'',  //单据类型
					funcode: appcode,      //功能节点编码，即模板编码
					nodekey:'',     //模板节点标识
					oids: pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
					//outputType:'print'
				}
				);
        }else if(type='output'){
			// //输出
			// print(
			// 	'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			// 	urls['print'], 
			// 	{
			// 		billtype:'',  //单据类型
			// 		funcode: appcode,      //功能节点编码，即模板编码
			// 		nodekey:'',     //模板节点标识
			// 		oids: pks,
			// 		outputType:'output'
			// 	}
			// 	);
			this.setState({
				pks: pks
				},this.refs.printOutput.open());	
        }
	}

	onSelectMoreButton({ key }) {
		toast({content:this.state.json['10140TRANS-000013'],color:'warning'});/* 国际化处理： 努力开发中......*/
	 
	}
	
	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		console.log('vvv',allTableData)
		let allData = Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['code'].value.indexOf(value)>-1 ){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.onSetButton(allData);
		this.props.editTable.setTableData(tableid,allData);
	}

	//按钮状态
	onSetButton(allTableData){
		console.log('new',allTableData)
		if(allTableData.rows.length > 0){
			this.props.button.setButtonDisabled({
				Edit:false,
				Print:false,
				Output:false,
			});	
		}else{
			this.props.button.setButtonDisabled({
				Edit:true,
				Print:true,
				Output:true,
			});	
		}
	}
	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					// ts: {
					// 	display: '时间戳',
					// },
					// pk_transactioncode: {
					// 	display: '主键',
					// }
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values = val.data.values;
			//delObj.values.ts.value=val.data.values.ts.value;
			//delObj.values.pk_transactioncode.value=val.data.values.pk_transactioncode.value;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let _that = this;
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
			success: function(res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					_that.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					_that.props.editTable.setTableData(tableid,allD);
					allTableData = allD;
					_that.onSetButton(allTableData);
					toast({title:this.state.json['10140TRANS-000002'],color:'success'});/* 国际化处理： 删除成功！*/
				}
			}.bind(this)
		});
	}

	 // 列表勾选事件
	 onSelected=()=>{
		let rows = this.props.editTable.getCheckedRows(tableid);

        let isDisable = (rows && rows.length>0)?false:true;

        this.props.button.setButtonDisabled(['Delete'],isDisable);
		this.setState(this.state);
	 }

	 // 自动增行后的回调
	addRowAutoCallback() {
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'pk_country', {value: this.state.curOrg.refpk, display:this.state.curOrg.refname});//设置国家地区默认值
		
	}

	render() {
		let { table, button, search,editTable,modal ,BillHeadInfo} = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let {NCFormControl,NCCheckbox} = base;
		let {createModal} = modal;
		const { Item } = Menu;
		const {createBillHeadInfo} = BillHeadInfo;
		var createOrgRender = () => {
			return   (
				<div className="title-search-detail">
				{Org({
					fieldid:'country',
					onChange:this.onOrgChange.bind(this),
					value:this.state.curOrg,
					disabled:this.state.countryDisable,
					//placeholder: '重写这个参照的名字',
					//如果需要对参照过滤 可以加queryCondition参数
					//queryCondition:{
					//}
				})}
				</div>
		    ) ;
		};
		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={{borderBottom:'none'}}>
					{/* 标题 title */}
					<div className="header-title-search-area">
						{createBillHeadInfo({
								title:(this.state.json['10140TRANS-000019']),
								initShowBackBtn:false
                        })}	
						{/* 添加渲染函数创建组织 */}
						<div className="title-search-detail">
							<span style={{marginTop: 9, zIndex: 1000, float: 'left', position: 'relative', color: 'red'}}>
								<span style={{position: 'absolute', left: 3,top: -10}}>*</span>
							</span>
							{createOrgRender()}
						</div>
						<div className="title-search-detail" fieldid='title-searchId'>
					
							<NCFormControl
								placeholder={this.state.json['10140TRANS-000014']/* 国际化处理： 请输入交易代码筛选*/}
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								disabled={this.state.searchDisable}
							/>
						</div>
						{/* 显示停用数据 */}
						<div className="title-search-detail">
							{isShowOffEnable?(
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>this.state.json['10140TRANS-000020']</NCCheckbox>/* 国际化处理： 显示停用*/
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
				<div className='nc-singleTable-table-area' fieldid='tableId'>
					
					{createEditTable(tableid, {//列表区
						//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
						onAfterEvent:this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						useFixedHeader:true,    
						onSelected: this.onSelected.bind(this),                        // 左侧选择列单个选择框回调
						onSelectedAll:this.onSelected.bind(this),               // 左侧选择列全选回调
						selectedChange:this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						// statusChange: this.updateButtonStatus.bind(this),
						statusChange: function(){
							setTimeout(() => {
								this.updateButtonStatus();
							}, 0)
						}.bind(this),				//表格状态监听
						showIndex:true,				//显示序号
						isAddRow: true,   // 失去焦点是否自动增行
						addRowCallback:this.addRowAutoCallback.bind(this),	// 自动增行后的回调
						adaptionHeight:true,//行扩平
						showCheck:true			//显示复选框
						//params: 'test',                                  // 自定义传参

					})}
					
				</div>
				{/* 删除前确认模态框 */}
				{createModal('modal',{
					title : this.state.json['10140TRANS-000015'],										//标题/* 国际化处理： 确认删除*/
					content : this.state.json['10140TRANS-000016'],							//内容/* 国际化处理： 确认删除所选数据？*/
					beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					leftBtnName : this.state.json['10140TRANS-000017'],   								//左侧按钮名称/* 国际化处理： 确认*/
    				rightBtnName : this.state.json['10140TRANS-000018']   								//右侧按钮名称/* 国际化处理： 关闭*/
				})}
				<PrintOutput
					ref = 'printOutput'
					url = {urls['print']}
					data = {{
						funcode: appcode,      //功能节点编码，即模板编码
						nodekey: '',     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
				>
				</PrintOutput>
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
	mutiLangCode:'10140TRANS'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65