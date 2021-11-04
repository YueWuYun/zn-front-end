//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 人行联行信息
 * @author	chaiyan3
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,cardCache,getMultiLang,promptBox,createPageIcon,output} from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
const {PrintOutput}=high;
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal } = base;
let { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button,NCForm,NCSelect,NCUpload,NCInput,NCLoading,NCDiv   } = base;
import './index.less';
import FileUploadForm from "../../asslinenum/component/fileuploadform";



const searchid = 'asslinenum_query';
const tableid = 'pk_asslinenum';
const pagecode = '10140CBCN_asslinenum';
const appid = '0001Z010000000000O0E';
const appcode = '10140CBCN';
const urls = {
	import: '/nccloud/uapbd/asslinenum/import.do',
	print: '/nccloud/uapbd/asslinenum/print.do',
	save : '/nccloud/uapbd/asslinenum/save.do',
	query : '/nccloud/uapbd/asslinenum/query.do',
	queryPage:'/nccloud/uapbd/asslinenum/queryPage.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do',
	closemodal:'/nccloud/uapbd/asslinenum/closeModal.do',
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['lqdationline'];  //过来空行时，忽略的字段
//解决IE11小应用打开报错的问题
document.documentElement.focus();

//获取并初始化模板
let initTemplate = (props) => {
	props.createUIDom({
		pagecode : pagecode,
		//appcode : appcode
	},
	(data)=>{
		let meta = data.template;
		meta = modifierMeta(props,meta);
		props.meta.setMeta(meta);
		data.button && props.button.setButtons(data.button);
		data.button && props.button.setButtonDisabled({
			//Edit: true,
			Delete:true,
		});
		props.button.setPopContent({'Delline':props.MutiInit.getIntl("10140CBCN") && props.MutiInit.getIntl("10140CBCN").get('10140CBCN-000011')})/* 国际化处理：确定要删除吗？*/
			
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
		label: props.MutiInit.getIntl("10140CBCN") && props.MutiInit.getIntl("10140CBCN").get('10140CBCN-000012'),/* 国际化处理： 操作*/
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
	// meta[tableid].items.find((item) => item.attrcode == 'code').datatype = '4';
	// meta[tableid].items.find((item) => item.attrcode == 'code').itemtype = 'number';
	// console.log('dd',meta[tableid].items.find((item) => item.attrcode == 'code'))
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
						// ts: {
						// 	display: '时间戳',
						// 	value: record.values.ts.value
						// },
						// pk_asslinenum: {
						// 	display: '主键',
						// 	value: record.values.pk_asslinenum.value
						// }
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
					success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
						let { success,data} = res;
						if (success) {
							props.editTable.deleteTableRowsByIndex(tableid, indexArr);
							let allD = props.editTable.getAllData(tableid);
							Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
							props.editTable.setTableData(tableid,allD);
							toast({title:props.MutiInit.getIntl("10140CBCN") && props.MutiInit.getIntl("10140CBCN").get('10140CBCN-000013'),color:'success'});/* 国际化处理： 删除成功！*/
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

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.config =Object.assign({
			datasource : 'uapbd.sminfo.asslinenum.datasource',
        }, props.config);
		this.state={
			searchValue:'',
			searchDisable:false,				//简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false,				//列表是否显示停用数据
			showModal:false,
			fileInputName:'',
			json:{},
			selectValue: '0',//导入方式，默认0覆盖式
			fileInput:'',
			toast:false,
			activePage:1,//分页器默认显示第一页
			pageNum:50,
			totalPage:1,//总页数
			totalnum:0//总条数
		}
		this.page={
			pagepks:[],
			numberSave:''
		}
	}
	componentDidMount() {
		//this.getData();
		this.props.button.setButtonsVisible({
			'Save':false,
			'Cancel':false
		});
		this.props.button.setButtonDisabled({
			Edit: true,
			Print:true,
			Output:true
		});
		// this.props.button.setDisabled({
		// 	Edit: true,
		// 	Print:true,
		// 	Output:true
		// });
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
	getData = (props,callback) => {
		let OID = this.props.meta.getMeta()[searchid].oid;
		//let searchVal =getDefData("searchParams",this.config.datasource);
		let searchVal = this.props.search.getAllSearchData(searchid);
		 //获取分页信息
		let pageInfo = this.props.editTable.getTablePageInfo(tableid);
			//queryInfo.oid;
		let paramdata = {
			querycondition: searchVal==null?{}:searchVal,
			pageInfo:pageInfo,
			pagecode: pagecode,
			queryAreaCode:searchid,  //查询区编码
			oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			// pagesize:this.state.pageNum,//每页行数
			// pageindex:this.state.activePage,//当前页
			querytype:'tree'
		}
		//let showOff = this.state.isShowOff;		
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:paramdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if(data){
						Utils.showFormular(this.props,res,{tableid:"editTable"});//适配显示公式
						this.props.editTable.setTableData(tableid,data[tableid]);
						this.props.button.setButtonDisabled({
							Edit:false,
							Print:false,
							Output:false,
						});	
						callback && callback(data);
					}else{
						this.props.editTable.setTableData(tableid, {rows: []});
							this.props.button.setButtonDisabled({
								Edit:true,
							    Print:true,
								Output:true,
							});	
					}
					this.toggleShow("browse");
				}
			}
		});
	};


	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		// if(key === 'code'){
		// 	console.log('value',value[0])
		// 	let code = Number(value[0].newvalue.value)
		// 	if(isNaN(code)){
		// 		props.editTable.setValByKeyAndRowId(moduleId, data.rowid, 'code', {value:''});
		// 	}
		// 	// }else{
		// 	// 	this.page.numberSave = value[0].newvalue.value;
		// 	// }
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

	//表格编辑前事件
	onBeforeEvent(props, moduleId,item,index,value,record){
		let key = item['attrcode'];
		// if(key == 'code'){
		// 	let meta = props.meta.getMeta();
		// 	meta[moduleId].items.find((item) => item.attrcode == 'code').datatype = 4;
		// 	meta[moduleId].items.find((item) => item.attrcode == 'code').disabled = true;
		// 	props.meta.setMeta(meta);
		// 	console.log('fd',meta[moduleId].items.find((item) => item.attrcode == 'code'))
		// 	//props.meta.setMeta(meta);
		// }
	}
	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(length === 0){//未选择数据
			this.props.button.setButtonDisabled({
				Delete: true
			});
		}else if(length === 1){//选择一行数据
			this.props.button.setButtonDisabled({
				Delete: false
			});
		}else {//选择多行数据
			this.props.button.setButtonDisabled({
				Delete: false
			});
		}
	}

	//切换页面状态
    toggleShow = (status) =>{
		let flag = status === 'browse' ? false : true;
		if(!flag){
			this.props.button.setPopContent('Delline',this.state.json['10140CBCN-000014']);/* 国际化处理： 确定要删除吗？*/
		}else{
			this.props.button.setPopContent('Delline','');
		}
		this.props.button.setButtonVisible(['Add','Delete'],true);
        this.props.button.setButtonVisible(['Save','Cancel'],flag);
        this.props.button.setButtonVisible(['Edit','Refresh','Print','Output','Import'],!flag);
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

	onCancelSureEvent() {
		// this.props.editTable.cancelEdit(tableid);
		// this.toggleShow("browse")
		this.props.editTable.cancelEdit(tableid,()=>{this.toggleShow("browse")});
	}
	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Add':
				
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				this.props.editTable.addRow(tableid,num,true);
				let meta = this.props.meta.getMeta();
				this.toggleShow("edit");
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				this.toggleShow("edit");
				break;
			case 'Cancel':
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140CBCN-000015'],/* 国际化处理： 确认取消*/
					content:this.state.json['10140CBCN-000016'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick:()=>{this.onCancelSureEvent()}
					})
				return;
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid,keys);
					let tableData = this.props.editTable.getAllRows(tableid,true);//.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					if(!tableData || tableData.length === 0) {
						//toast({content: '没有要保存的数据', color:'info'})
						toast({content: this.state.json['10140CBCN-000017'], color:'danger'})/* 国际化处理： 下列字段值不能为空:第1行：[人行联行行号]、[人行联行名称]*/
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
					let _that = this;
					data.model.rows = tableData;
					this.props.validateToSave(data,()=>{
						ajax({
							url: urls['save'],
							data,
							success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									_that.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
									Utils.handleTableReData({
										data : data,
										tableid : tableid,
										props : _that.props,
										empty : (data) => {	//数据为空时执行回调方法
											//this.props.editTable.setTableData(tableid, {rows: []});
											_that.getData(props);
											_that.props.button.setButtonDisabled({
												Edit:true,
												Print:true,
												Output:true,
											});	
										},
										notEmpty : (data)=>{
											let allD = _that.props.editTable.getAllData(tableid);
											Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
											// Utils.convertGridEnablestate(data[tableid].rows);
											Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
											_that.props.editTable.setTableData(tableid, allD);	
											_that.props.button.setButtonDisabled({
												Edit: false,
												Print:false,
												Output:false
											});	
										}
									});
								}
								_that.toggleShow("browse");
								toast({title: _that.state.json['10140CBCN-000018'], color:'success'});	/* 国际化处理： 保存成功！*/
							}.bind(this)
						});
					},{[tableid]: "editTable"});
				}, 0)
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.state.json['10140CBCN-000019'],color:'warning'});/* 国际化处理： 请选择要删除的数据*/
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
						title:this.state.json['10140CBCN-000020'],/* 国际化处理： 删除提醒*/
						content:this.state.json['10140CBCN-000021'],/* 国际化处理： 确定要删除数据吗？*/
						beSureBtnClick:()=>{this.onDelForBrowse()}
						})
					this.toggleShow("browse");
				}
				
				break;
			case "Refresh":
				this.getData(props,()=>{
					toast({title:this.state.json['10140CBCN-000022'],color:"success"})/* 国际化处理： 刷新成功！*/
				});
				break;
			case 'Print':
				this.output('print');
				break;
			case 'Output':
				this.output('output');
				break;
			case 'Import':
				//this.openModal();
				//导入方式
				let items ={
					itemType:'select',
					name:'level',
					label:this.state.json['10140CBCN-000008'],/* 国际化处理： 导入方式*/
					options:[
						{value:'0',display:this.state.json['10140CBCN-000009']},/* 国际化处理： 覆盖式*/
						{value:'1',display:this.state.json['10140CBCN-000010']},/* 国际化处理： 增加式*/
					],
					initialValue:'0'//{value:'0',key:this.state.json['10140CBCN-000009']}/* 国际化处理： 覆盖式*/
				}
				this.props.modal.show('importModal', {
					title: this.state.json['10140CBCN-000023'],/* 国际化处理： 导入*/
					content:<FileUploadForm fieldid="importFileUploadForm" config={{items:items,json:this.state.json}} ref={(FileUploadForm)=>{this.FileUploadForm = FileUploadForm}}/>,
					
					beSureBtnClick: ()=>{
						if(this.FileUploadForm.getFormData().paths.length == 0){
							toast({title:this.state.json['10140CBCN-000042'],color:"warning"})
						}else{
							let data = {
								importtype:this.FileUploadForm.getFormData().level.value,
								filepath:this.FileUploadForm.getFormData().paths,
							};
							let that =this;
							ajax({
								url: urls.import,
								data: data,
								success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
									let { success, data } = res;
									if (success) {
										props.modal.show('finalModal',{
											title: that.state.json['10140CBCN-000024'],/* 国际化处理： 提示*/
											content:res.data,
											leftBtnName : '', 								//左侧按钮名称
											rightBtnName : that.state.json['10140CBCN-000025']  /* 国际化处理： 确认*/
										});
										that.getData(props);
									}
								}
	
							})
						}
						
						//this.getData(props);
					},
					cancelBtnClick:()=>{
						let data = {
							filepath:this.FileUploadForm.getFormData().paths,
						};
						ajax({
							url: urls.closemodal,
							data: data,
							success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success, data } = res;
								
							}
						})
					}
				})
				break;
		}
	
	}


	//输出和打印功能函数
	output(type=''){
		let allData = this.props.editTable.getAllData(tableid);
		let pks = [];
		allData.rows.forEach((item)=>{
			pks.push(item.values['pk_asslinenum'].value);
		});
		if(type=='print'){
			var tableorder = this.props.editTable.getSortParam(tableid);
			//打印
			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				urls['print'], 
				{
					billtype:'',  //单据类型
					funcode: appcode,      //功能节点编码，即模板编码
					nodekey:'',     //模板节点标识
					userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`,
					oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
				}
				);
		}else if(type='output'){
			var outorder = this.props.editTable.getSortParam(tableid);
			let data = {
				funcode:appcode,  
				appcode:appcode,      //小应用编码
				nodekey:'',     //模板节点标识
				userjson:`{order:${outorder  && outorder.sortParam[0].order},field:${outorder  && outorder.sortParam[0].field}}`,
				oids:pks,    // 功能节点的数据主键  oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
				outputType: 'output'
			}
			this.setState(this.state,() => {
				output({data: data,url:urls['print']});
			});
			/*this.setState({
				pks: pks
				},this.refs.printOutput.open());	*/
		}
	}

	onSelectMoreButton({ key }) {
		toast({content:this.state.json['10140CBCN-000026'],color:'warning'});/* 国际化处理： 努力开发中......*/
	 
	}
	
	//查询区按钮点击事件
	onClickSearchBtn(props,data){
		this.setState({
			activePage:1,
		})

		let OID = this.props.meta.getMeta()[searchid].oid;
		//let searchVal =getDefData("searchParams",this.config.datasource);
		let searchVal = props.search.getAllSearchData(searchid);
		 //获取分页信息
		let pageInfo = this.props.editTable.getTablePageInfo(tableid);
		let paramdata = {
			querycondition: data==null?{}:data,
			pageInfo:pageInfo,
			queryAreaCode:searchid,  //查询区编码
			oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype:'tree'
		}
		ajax({
			url: urls['query'],
			data:paramdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if(data){
						Utils.showFormular(this.props,res,{tableid:"editTable"});//适配显示公式
						this.props.editTable.setTableData(tableid,data[tableid]);
						this.props.button.setButtonDisabled({
							Edit:false,
							Print:false,
							Output:false,
						});	
						console.log('ss',data[tableid])
						let count = data[tableid].allpks.length;
                   		toast({content:this.state.json['10140CBCN-000028']+count+this.state.json['10140CBCN-000029'],color:'success'})/* 国际化处理： 已成功！,查询成功，共,条。*/
					}else{
						this.props.editTable.setTableData(tableid, {rows: []});
						this.props.button.setButtonDisabled({
							Edit:true,
							Print:true,
							Output:true,
						});	
						toast({content:this.state.json['10140CBCN-000031'],color:"warning"});/* 国际化处理： 请注意！,未查询出符合条件的数据！*/
					}
					this.toggleShow("browse");
				}
			}
		});
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
					// pk_asslinenum: {
					// 	display: '主键',
					// }
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values = val.data.values;
			// delObj.values.ts.value=val.data.values.ts.value;
			// delObj.values.pk_asslinenum.value=val.data.values.pk_asslinenum.value;
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
					let allD = _that.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					_that.props.editTable.setTableData(tableid,allD);
					toast({title:_that.state.json['10140CBCN-000013'],color:'success'});/* 国际化处理： 删除成功！*/
					_that.getData();
				}
			}.bind(this)
		});
	}

	
	// }

	//分页信息点击事件
	onClickPageInfo(props,config, pks){
        
        let data = {
			"allpks": pks,
		}
		ajax({
			url: urls.queryPage,
			data: data,
			success: (res) => {
				let { success, data } = res;
                if (success) {
                    if (data) {
						Utils.showFormular(this.props,res,{tableid:"editTable"});//适配显示公式
						this.props.editTable.setTableData(tableid,data[tableid]);
					}else{
						this.props.editTable.setTableData(tableid, {rows: []});
					}
				}
			}
		})
       
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
		const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let {NCFormControl,NCCheckbox,NCPagination,NCSelect} = base;
		const NCOption = NCSelect.NCOption;
		const tableState = this.props.editTable.getStatus(tableid);
		let {createModal} = modal;
		const { Item } = Menu;
		let moreButton = (
			<Menu
                  onSelect={this.onSelectMoreButton.bind(this)}>
                      <Item key="1">{this.state.json['10140CBCN-000023']/* 国际化处理： 导入*/} </Item>
                      {/* <Item key="2">打印 </Item>
					  <Item key="3">预览</Item>
					  <Item key="4">this.state.json['10140CBCN-000039']</Item> */}{/* 国际化处理： 输出*/}
                </Menu>
		);

		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<NCDiv  areaCode={NCDiv.config.HEADER}  className="nc-singleTable-header-area" style={tableState == 'browse' ? {}: {border:'none'}} >
					{/* 标题 title */}
					<div className="header-title-search-area">
						{ /*createPageIcon()*/ }{/* 大图标 */}
						<div className="title-search-detail">
							{createBillHeadInfo({
								title : this.state.json['10140CBCN-000040'] ,/* 国际化处理： 人行联行信息*/
								initShowBackBtn:false
							})}
						</div>
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
						</div> */}
						{/* 显示停用数据 */}
						<div className="title-search-detail">
							{isShowOffEnable?(
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>{this.state.json['10140CBCN-000041']/* 国际化处理： 显示停用*/}</NCCheckbox>
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
				
				{/* 列表区 */}
				<div className="nc-singleTable-search-area" style={{display: tableState == 'browse' ? '': 'none'}}>
					{NCCreateSearch(searchid, {//查询区
					   // showAdvBtn: false,//不显示高级按钮  
                        clickSearchBtn: this.onClickSearchBtn.bind(this)
                    })}
                </div>
				<div className='nc-singleTable-table-area'>
						{createEditTable(tableid, {//列表区
							handlePageInfoChange: this.onClickPageInfo.bind(this),
							onSelected: this.onSelected.bind(this),                        // 左侧选择列单个选择框回调
							onSelectedAll:this.onSelected.bind(this),   
							//onBeforeEvent: this.onBeforeEvent.bind(this),
							//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
							onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
							useFixedHeader:true,                   // 左侧选择列全选回调
							adaptionHeight: true,
							selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
							statusChange: function(){
								setTimeout(() => {
									this.updateButtonStatus();
								}, 0)
							}.bind(this),				//表格状态监听
							isAddRow: true,   // 失去焦点是否自动增行
							showIndex:true,				//显示序号
							showCheck:true,			//显示复选框
							showPagination: true                                // 自定义传参

						})}
				</div>

				{createModal('importModal',{
					title : this.state.json['10140CBCN-000023'],										//标题/* 国际化处理： 导入*/
					size:'lg',		
					className:'senior',
				})}
				{createModal('finalModal',{
					title : this.state.json['10140CBCN-000024'],/* 国际化处理： 提示*/
					size:'lg',	
					leftBtnName : '', 								//左侧按钮名称
					rightBtnName : this.state.json['10140CBCN-000025'],  /* 国际化处理： 确认*/	
					className:'senior',
				})}
				{createModal('errorModal',{
					title : this.state.json['10140CBCN-000033'],										//标题/* 国际化处理： 导入文件错误*/
					size:'xlg',	
				})}
				{/* 删除前确认模态框 */}
				{createModal('modal',{
					title : this.state.json['10140CBCN-000034'],										//标题/* 国际化处理： 确认删除*/
					content : this.state.json['10140CBCN-000035'],							//内容/* 国际化处理： 确认删除所选数据？*/
					beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					leftBtnName : this.state.json['10140CBCN-000025'],   								//左侧按钮名称/* 国际化处理： 确认*/
    				rightBtnName : this.state.json['10140CBCN-000036']   								//右侧按钮名称/* 国际化处理： 关闭*/
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
				{/* <NCModal show = { this.state.toast }>
					<NCModal.Body>
						fsdflsjlf
					</NCModal.Body>
					<NCModal.Footer>
					<Button colors="primary" onClick={this.toast.bind(this)}>关闭</Button>
					</NCModal.Footer>
				</NCModal> */}
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
	mutiLangCode:'10140CBCN'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65