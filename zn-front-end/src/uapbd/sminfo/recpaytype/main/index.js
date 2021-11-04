//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,promptBox,getMultiLang,createPageIcon } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal } = base;
const { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button } = base;

import './index.less';
const { NCDiv } = base;
const searchid = 'recpaytype';
const tableid = 'recpaytype';
const pagecode = '10140RPTYPE_RPTYPE';
//const appid = '0001Z310000000000I1E';
const appcode = '10140RPTYPE';
const urls = {
	save : '/nccloud/uapbd/recpaytype/saverecpaytype.do',
	query : '/nccloud/uapbd/recpaytype/queryrecpaytype.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};
const isShowOffEnable = true;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['pk_org','pk_group','issystem','enablestate','issettle','isverification'];  //过来空行时，忽略的字段
let editTableBtn,indexArrList=[];

//获取并初始化模板
let initTemplate = (props,callback) => {
	props.createUIDom({
		pagecode : pagecode
		//appcode : appcode
	},
	(data)=>{
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
		data.button && props.button.setButtons(data.button);
		props.button.setButtonsVisible({
			Add: true,
			Edit: true,
			Delete: true,
			Save: false,
			Cancel: false,
			Refresh: true,
			Print: true
		});
		props.button.setPopContent('Delline',props.MutiInit.getIntl("10140RPTYPE") && props.MutiInit.getIntl("10140RPTYPE").get('10140RPTYPE-000000'))/* 国际化处理： 确认要删除该信息吗？*/
		setTimeout(() => {
			callback && callback();
		}, 0);
	});
}

//禁止选择
function disableSelect(){
	indexArrList.forEach((item,index)=>{
		editTableBtn.setCheckboxDisabled(tableid,item,false);
	})
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
		label: props.MutiInit.getIntl("10140RPTYPE") && props.MutiInit.getIntl("10140RPTYPE").get('10140RPTYPE-000001'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		className:'table-opr',
		itemtype: 'customer',
		visible:true,
		fixed: 'right',
		render(text, record, index) {
			let tableStatus = props.editTable.getStatus(tableid);
			let issystem = record.values.issystem.value; //全局节点，系统预置的不能删除
			/*let isSys = record.values.issystemp.value; //全局节点，系统预置的不能删除
			return 	(isSys ==='1')  ? (				
				<div className="currency-opr-col">
					<span></span>
				</div>)
				*/
	// 		return 	issystem? (				
	// 			<div className="currency-opr-col">
	// 				<span></span>
	// 			</div>):( tableStatus == 'browse' || tableStatus == undefined) ? (
	// 			<div className="currency-opr-col">
	// 				<NCPopconfirm
	// 					trigger="click"
	// 					placement="top"
	// 					content="确认删除?"
	// 					onClose={() => {
	// 						if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
	// 							props.editTable.deleteTableRowsByIndex(tableid, index);
	// 						}else{//浏览态
	// 							let delObj = {
	// 								rowId: index,
	// 								status: '3',
	// 								values: {
	// 									ts: {
	// 										display: '时间戳',
	// 										value: record.values.ts.value
	// 									},
	// 									pk_recpaytype: {
	// 										display: '主键',
	// 										value: record.values.pk_recpaytype.value
	// 									}
	// 								}
	// 							};
	// 							let indexArr=[];
	// 							indexArr.push(index);
	// 							let data = {
	// 								model: {
	// 									areaType: 'table',
	// 									pageinfo: null,
	// 									rows: [ delObj ]
	// 								}
	// 							};
	// 							ajax({
	// 								url: urls['save'],
	// 								data,
	// 								success: function(res) {
	// 									let { success, data } = res;
	// 									if (success) {
	// 										props.editTable.deleteTableRowsByIndex(tableid, indexArr);
	// 										let allD = props.editTable.getAllData(tableid);
	// 										Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
	// 										props.editTable.setTableData(tableid,allD);
	// 										//禁止选择
	// 										disableSelect()
	// 										toast({content:'删除成功',color:'success'});
	// 									}
	// 								}.bind(this)
	// 							});
	// 						}
	// 					}}
	// 				>
	// 					<span className='operator'>删除</span>
	// 				</NCPopconfirm>
	// 			</div>
	// 		):(
	// 			<div className="currency-opr-col">
	// 				<span className='operator' 
	// 					onClick={() => {
	// 						props.editTable.deleteTableRowsByIndex(tableid, index);
	// 					}}
	// 				>删除</span>
	// 			</div>
	// 		);
	// 	}
	// };
		if(issystem){
			return (				
			<div className="currency-opr-col">
				<span></span>
			</div>)
		}else{
			return props.button.createOprationButton(
			['Delline'],
			{
				area: "table-opr-button",
				buttonLimit: 3,
				onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
			}
		)
	}}
	};
	meta[tableid].items.push(event);
	//props.renderItem('table',tableid,'creator',refer('creator'));
	return meta;
}

function tableButtonClick(props, id, text, record, index){
    switch(id){
        case 'Delline':
			if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
				props.editTable.deleteTableRowsByIndex(tableid, index);
			}else{//浏览态
				let delObj = {
					rowId: index,
					status: '3',
					values: {
						// ts: {
						// 	display: '时间戳',
						// 	value: record.values.ts.value
						// },
						// pk_balatype: {
						// 	display: '主键',
						// 	value: record.values.pk_balatype.value
						// }
					}
				};
				
				if(record.values.enablestate.value ===true){
					record.values.enablestate.value = '2'
				}else {
					record.values.enablestate.value = '3'
				}
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
							toast({title:props.MutiInit.getIntl("10140RPTYPE") && props.MutiInit.getIntl("10140RPTYPE").get('10140RPTYPE-000002'),color:'success'});/* 国际化处理： 删除成功！*/
						}
					}.bind(this)
				});
			}
        default:
            break;

    }
}

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.props.button.setButtonsVisible({
			Add: false,
			Edit: false,
			Save: false,
			Cancel: false,
			Delete: false
		});
		this.state={
			searchValue:'',
			json:{},
			searchDisable:false,				//简单搜索框是否禁用	true：禁用		false：可用
			moreButton:false,				//更多按钮状态
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false				//列表是否显示停用数据
		}
		initTemplate(props,this.getData);
	}
	componentWillMount() {
		//this.getData(false);
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
	getData = (callback) => {
		let showOff = this.state.isShowOff;		
		//mazheng 重构代码, 设置查询参数
		var param = {
			pagecode: pagecode,
			showOff: this.state.isShowOff,
			// pk_org: this.state.curOrg.refpk
			// nodetype: this.config.nodetype
		};

		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:param,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					Utils.handleTableReData({
						data : data,
						tableid : tableid,
						props : this.props,
						empty : (data) => {	//数据为空时执行回调方法
							this.props.editTable.setTableData(tableid,data[tableid])
							//禁止选择
							disableSelect()
						},
						notEmpty : (data)=>{	//数据不为空时执行回调方法
							//适配显示公式
							Utils.showFormular(this.props,res,{tableid:"editTable"});
							//是否启用转换成开关
							Utils.convertGridEnablestateToShow(data[tableid].rows); 
							data[tableid].rows.forEach(function(item, index, array){
								if (item.values['issystem'].value) {
									item.values['code'].disabled = 'on';
									item.values['name'].disabled = 'on';
									item.values['isverification'].disabled = 'on';
									item.values['issettle'].disabled = 'on';
									if(!item.values['pretype']){
										item.values['pretype'] = {};
									}
									item.values['pretype'].disabled = 'on';
									indexArrList.push(index);
								}
							});
							editTableBtn = this.props.editTable;
							this.props.editTable.setTableData(tableid,data[tableid])
							//禁止选择
							disableSelect()
						},
						after : (data)=> {	//数据处理完成后执行回调方法
							allTableData = data[tableid];
							callback && callback();
						}
					});
				}
			}
		});
	};

	//点击查询按钮  单表页面去除查询区
	/* onSearchBtnClick(props) {
		let searchVal = this.props.search.getAllSearchData(searchid);
		let metaData = this.props.meta.getMeta();
		let data={
			"conditions":searchVal,
			//editTable不提供分页
			"pagecode": pagecode,
			"queryAreaCode":searchid,  //查询区编码
			"oid":"0001Z010000000004GIF",  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			"queryType":"simple"
		 }
	
		ajax({
			url: '/nccloud/riamm/defdoclist/query.do',
			data: data,
			success:  (res)=> {
				let { success, data } = res;
				if (success) {
					this.props.editTable.setTableData(tableid, data[tableid]);
				}
			}
		}); 
	} */

	// 自动增行后的回调
	addRowAutoCallback() {
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'pk_org', {value: 'GLOBLE00000000000000',display:this.state.json['10140RPTYPE-000003']});//设置组织默认值/* 国际化处理： 全局*/
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'pk_group', {value: 'GLOBLE00000000000000',display:this.state.json['10140RPTYPE-000003']});//设置组织默认值/* 国际化处理： 全局*/
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'issystem', {value: false,display: this.state.json['10140RPTYPE-000004'] });//设置属性默认值/* 国际化处理： 否*/
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'issettle', {value: 'Y',display: this.state.json['10140RPTYPE-000005'] });//设置现金结算默认值/* 国际化处理： 现金结算*/
		//this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'enablestate', {value: true,display: this.state.json['10140RPTYPE-000006'] });//设置启用状态默认值/* 国际化处理： 已启用*/
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'enablestate', {value: '2',display: this.state.json['10140RPTYPE-000006'] });//设置启用状态默认值/* 国际化处理： 已启用*/
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'isverification', {value: 'Y',display: this.state.json['10140RPTYPE-000007'] });//设置是否核销默认值/* 国际化处理： 是否核销*/
		
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
	
		if(key === 'enablestate'){  // || key === 'isdefault'

			let enableflag = value[0].newvalue.value;
			// this.props.modal.show('modalEnable',
			// {
			// 	title:'提示',
			// 	content: ( enableflag ? '您确定要启用所选数据吗？' : '您确定要停用所选数据吗？'),
			// 	closeModalEve:()=>{
			// 		props.editTable.setValByKeyAndIndex(moduleId,index,'enablestate',{value:!enableflag});
			// 	},
			// 	cancelBtnClick: ()=>{
			// 		// this.props.form.setFormItemsValue(moduleId, { 'enablestate': {value:!flag} });
			// 		props.editTable.setValByKeyAndIndex(moduleId,index,'enablestate',{value:!enableflag});
			// 	},
			// 	beSureBtnClick:()=>{
					
					// let allRows = props.editTable.getAllRows(moduleId);
					let oldPk = this.props.editTable.getValByKeyAndIndex(moduleId, index, 'pk_recpaytype');
					let rowData = Utils.clone(data);
					rowData.values['pk_recpaytype'].value = oldPk.value;
					rowData.status = '1'
					if (rowData.values['enablestate'].value){
						rowData.values['enablestate'].value = '2';
					}else{
						rowData.values['enablestate'].value = '3';
					}

					let reqData= [];
					reqData.push(rowData);
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
								let allD = this.props.editTable.getAllData(tableid);
								
								Utils.convertGridEnablestateToShow(data[tableid].rows);
								Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
								this.props.editTable.setTableData(tableid,allD);
							}else{
								if (key === 'enablestate') {
									this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,'enablestate',{value:!(data.values['enablestate'].value)});
								} 
							}
						}
					});
			return;
		}
		// 		//自动增行
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
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: false,
				Save: true,
				Cancel: true,
				Delete: true,
				Refresh: false,
				Print: false
			});
			this.setState({
				moreButton:false,
				searchDisable:true,
				showOffDisable:true
			});
			this.props.button.setMainButton({Save:true,Add:false});
		}else{//浏览态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Refresh: true,
				Print: true
			});
			this.setState({
				moreButton:true,
				searchDisable:false,
				showOffDisable:false
			});
			this.props.button.setDisabled({
				editButton: false
			});
			this.props.button.setMainButton({Save:false,Add:true});
		}
	}

	//显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
		});
		setTimeout(() => {
			this.getData(() => {this.onSearch(this.state.searchValue);});
		}, 10);			
	}

	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Add':
				
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				this.setStatus(this.props, tableid, 'add');
				this.props.editTable.addRow(tableid,num,true);
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', {value: 'GLOBLE00000000000000',display:this.state.json['10140RPTYPE-000003']});//设置组织默认值/* 国际化处理： 全局*/
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_group', {value: 'GLOBLE00000000000000',display:this.state.json['10140RPTYPE-000003']});//设置组织默认值/* 国际化处理： 全局*/
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'issystem', {value: false,display: this.state.json['10140RPTYPE-000004'] });//设置属性默认值/* 国际化处理： 否*/
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'issettle', {value: 'Y',display: this.state.json['10140RPTYPE-000005'] });//设置现金结算默认值/* 国际化处理： 现金结算*/
				//this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', {value: true,display: this.state.json['10140RPTYPE-000006'] });//设置启用状态默认值/* 国际化处理： 已启用*/
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', {value: '2',display: this.state.json['10140RPTYPE-000006'] });//设置启用状态默认值/* 国际化处理： 已启用*/
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'isverification', {value: 'Y',display: this.state.json['10140RPTYPE-000007'] });//设置是否核销默认值/* 国际化处理： 是否核销*/
				break;
			case 'Edit':
				//this.props.editTable.setStatus(tableid, 'edit');
				this.setStatus(this.props, tableid, 'edit');
				console.log(this.props.editTable.getAllData(tableid));
				break;
			case 'Cancel':
				//this.props.editTable.cancelEdit(tableid);
				// this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
				// break;
				//this.props.modal.show('cancelConfirmModal');
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140RPTYPE-000008'],/* 国际化处理： 确认取消*/
					content:this.state.json['10140RPTYPE-000009'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick:()=>{this.cancelConfirmModal()}
				})
                return;
				this.props.editTable.cancelEdit(tableid);
                this.props.editTable.showColByKey(tableid,'opr');//显示操作列
                this.updateButtonStatus();
                break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid,keys);
					let tableData = this.props.editTable.getChangedRows(tableid,true);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					if(!tableData || tableData.length === 0){
						// toast({content: '没有要保存的数据', color:'info'})
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
						toast({title: this.state.json['10140RPTYPE-000010'], color:'success'});/* 国际化处理： 保存成功！*/
						return
					}
					if(!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllRows(tableid,true))) {   
						return
					}
					let data = {
						pageid:pagecode,
						model : {
							areaType: "table",
							pageinfo: null,
							rows: [],
							areacode: tableid//添加表单的areacode编码
						}
					};

					//Utils.convertGridEnablestate(tableData); ////保存前，switch开关true和false转换成数值1,2,3

					data.model.rows = tableData;
					this.props.validateToSave(data,()=>{
						ajax({
							url: urls['save'],
							data,
							success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									//this.setStatus(this.props,tableid, 'browse');//设置表格状态为浏览态
									//this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
									Utils.handleTableReData({
										data : data,
										tableid : tableid,
										props : this.props,
										empty : (data) => {	//数据为空时执行回调方法
										},
										notEmpty : (data)=>{	//数据不为空时执行回调方法
											debugger;
											let allD = this.props.editTable.getAllData(tableid);
											Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
											Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
											Utils.convertGridEnablestateToShow(allD.rows);
											this.props.editTable.setTableData(tableid, allD);
											//禁止选择
											disableSelect()
											setTimeout(() => {
												this.setStatus(this.props,tableid, 'browse');
											}, 0);
										},
										after : (data)=> {	//数据处理完成后执行回调方法
											let allD = this.props.editTable.getAllData(tableid);
											allTableData = allD;
										}
									});
									toast({title: props.MutiInit.getIntl("10140RPTYPE") && props.MutiInit.getIntl("10140RPTYPE").get('10140RPTYPE-000010'), color:'success'});/* 国际化处理： 保存成功！*/
								}
							}.bind(this)
						});
					},{[tableid]: "editTable"});
				}, 0);
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.state.json['10140RPTYPE-000011'],color:'warning'});/* 国际化处理： 请选择要删除的数据*/
					return 
				}
				if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
					let indexArr=[];
					selectedData.forEach((val) => {
						indexArr.push(val.index);
					});
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
				}else{
					// this.props.modal.show('modal',{
					// 	title : '确认删除',
					// 	content : '您确认删除所选数据？',
					// 	beSureBtnClick : this.onDelForBrowse.bind(this)
					// });
					promptBox({
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title:this.state.json['10140RPTYPE-000012'],/* 国际化处理： 确认删除*/
						content:this.state.json['10140RPTYPE-000013'],/* 国际化处理： 您确定要删除所选数据吗?*/
						beSureBtnClick:()=>{this.onDelForBrowse()}
					})
				}
				break;
			case "Refresh":
				this.setState({ searchValue:'' });
				this.getData();
				toast({title:this.state.json['10140RPTYPE-000014'],color:'success'});/* 国际化处理： 刷新成功！*/
				break;
		}
		//禁止选择
		disableSelect()
	}

	onSelectMoreButton({ key }) {
		toast({content:this.state.json['10140RPTYPE-000015'],color:'warning'});/* 国际化处理： 努力开发中......*/
	 
	}
	
	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData = Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['code'].value.indexOf(value)>-1 || row.values['name'].value.indexOf(value)>-1){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.props.editTable.setTableData(tableid,allData);
		//禁止选择
		//disableSelect()
	}

	// 删除时当前行处理
	convertDelEnablestate(item) {
		if(item.values.enablestate.value ===true){
			item.values.enablestate.value = '2'
		}else {
			item.values.enablestate.value = '3'
		}
	}

	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			this.convertDelEnablestate(val.data);
			let delObj = {
				status: '3',
				values: {
					// ts: {
					// 	display: '时间戳',
					// },
					// pk_recpaytype: {
					// 	display: '主键',
					// }
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values = val.data.values;
			//delObj.values.ts.value=val.data.values.ts.value;
			//delObj.values.pk_recpaytype.value=val.data.values.pk_recpaytype.value;
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
			success: function(res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					this.props.editTable.setTableData(tableid,allD);
					//禁止选择
					disableSelect()
					allTableData = allD;
					toast({title:this.props.MutiInit.getIntl("10140RPTYPE") && this.props.MutiInit.getIntl("10140RPTYPE").get('10140RPTYPE-000002'),color:'success'});/* 国际化处理： 删除成功！*/
				}
			}.bind(this)
		});
	}

	cancelConfirmModal(props){
        this.props.editTable.cancelEdit(tableid);
        this.props.editTable.showColByKey(tableid,'opr');//显示操作列
        this.updateButtonStatus();
	}
	
	setStatus(props,tableid,status) {
        let all = this.props.editTable.getAllRows(tableid);
        let tableStatus = this.props.editTable.getStatus(tableid);

        //设置编辑态
        if (status == 'add' || status == 'edit') {
            //当前组件不是编辑态时才执行转换
            if (tableStatus != 'add' && tableStatus != 'edit') {
                props.editTable.setStatus(tableid,status);
                let convertAll = Utils.convertGridEnablestateToSave(all)
                props.editTable.setTableData(tableid, {rows:convertAll});
            }
        }else{
            let convertAll = Utils.convertGridEnablestateToShow(all)
            this.props.editTable.setTableData(tableid, {rows:convertAll});
            props.editTable.setStatus(tableid,status);
        }
    }

	render() {
		let { table, button, search,editTable,modal,BillHeadInfo } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let {NCFormControl,NCCheckbox} = base;
		let {createModal} = modal;
		const { Item } = Menu;
		const {createBillHeadInfo} = BillHeadInfo;
		let moreButton = (
			<Menu
                  onSelect={this.onSelectMoreButton.bind(this)}>
                      {/* <Item key="1">自定义档案维护-全局</Item>
					  <Item key="2">自定义档案维护-集团</Item>
					  <Item key="3">this.state.json['10140RPTYPE-000021']-this.state.json['10140RPTYPE-000023']</Item> */}
                </Menu>
		);
		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={{borderBottom:'none'}}>
					{/* 标题 title */}
					<div className="header-title-search-area">
						{createBillHeadInfo({
								title:(this.state.json['10140RPTYPE-000024']),
								initShowBackBtn:false
							}
						)}
						{/* 简单查询 */}
						<div className="title-search-detail">
							<NCFormControl
								placeholder={this.state.json['10140RPTYPE-000016']/* 国际化处理： 请输入编码或名称筛选*/}
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								disabled={this.state.searchDisable}
							/>
						</div>
						{/* 显示停用数据 */}
						<div className="title-search-detail" fieldid='title-searchId'>
							{isShowOffEnable?(
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>{this.state.json['10140RPTYPE-000025']/* 国际化处理： 显示停用*/}</NCCheckbox>
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
				<div className='nc-singleTable-table-area' fieldid='nc-singleTable-tableId'>
					{createEditTable(tableid, {//列表区
						//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
						onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						useFixedHeader:true,    
						//onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
						//onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
						selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						// statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
						statusChange: function(){
							setTimeout(() => {
								this.updateButtonStatus();
							}, 0)
						}.bind(this),				//表格状态监听
						showIndex:true,				//显示序号
						isAddRow: true, 	// 失去焦点是否自动增行
						addRowCallback: this.addRowAutoCallback.bind(this),	// 自动增行后的回调
						showCheck:true,			//显示复选框
						//params: 'test',                                  // 自定义传参
						adaptionHeight: true

					})}
				</div>
				{createModal('modalEnable',{noFooter:false})}
				{/* 删除前确认模态框 */}
				{/* {createModal('modal',{
					title : '确认删除',										//标题
					content : '确认删除所选数据？',							//内容
					beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					leftBtnName : '确认',   								//左侧按钮名称
    				rightBtnName : '关闭'   								//右侧按钮名称
				})}
				 {createModal('cancelConfirmModal', {
							title: "注意",
							content: '是否确认要取消？',
							beSureBtnClick: this.cancelConfirmModal.bind(this)
				})} */}
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
	initTemplate: ()=>{},
	mutiLangCode: '10140RPTYPE'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65