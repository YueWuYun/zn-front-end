//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 贸易术语
 * @author	zouj
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,promptBox,getMultiLang,createPageIcon } from 'nc-lightapp-front';
const {PrintOutput}=high;
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal } = base;
const { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu, NCButton: Button } = base;
import './index.less';
const { NCDiv } = base;
const searchid = 'incoterm';
const tableid = 'incoterm';
const pagecode = '10140INCOT_list';
const appcode = '10140INCOT';
const appid = '0001Z010000000000O2D';
const urls = {
	save : '/nccloud/uapbd/incoterm/incotermsave.do',
	query : '/nccloud/uapbd/incoterm/incotermquery.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do',
	print: '/nccloud/uapbd/incoterm/incotermprint.do'
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let hasData = false; // 列表是否有数据
let allTableData = {};
const keys = ['isinclufare','isincluprem','factoryship'];  //过来空行时，忽略的字段

//获取并初始化模板
let initTemplate = (props) => {
	props.createUIDom({
		pagecode : pagecode
		// appid : appid
	},
	(data)=>{
		let meta = data.template;
		meta = modifierMeta(props, meta)
		props.meta.setMeta(meta);
		data.button && props.button.setButtons(data.button);
		// data.button && props.button.setButtons(data.button,()=>{
		// 		props.button.setPopContent('DelLine','确认要删除该信息吗？') /* 设置操作列上删除按钮的弹窗提示 */
		// });
			
		props.button.setPopContent('DelLine',props.MutiInit.getIntl("10140INCOT")&&props.MutiInit.getIntl("10140INCOT").get('10140INCOT-000000')) /* 设置操作列上删除按钮的弹窗提示 */
		props.button.setButtonsVisible({
			Add: true,
			Edit: true,
			Delete: true,
			Save: false,
			Cancel: false,
			Refresh: true,
			Print: true,
			Output: true
		});
		// 初始化时删除按钮不可用
		props.button.setDisabled({
			Delete: true
		});
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
		label: props.MutiInit.getIntl("10140INCOT")&&props.MutiInit.getIntl("10140INCOT").get('10140INCOT-000001'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		fixed:'right',
		itemtype: 'customer',
		visible:true,
		render(text, record, index) {
            return props.button.createOprationButton(
                ['DelLine'],
                {
                    area: "table-opr-area",
                    buttonLimit: 3,
                    onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                }
            )

			// let tableStatus = props.editTable.getStatus(tableid);
			// return tableStatus == 'browse' || tableStatus == undefined ? (
			// 	<div className="currency-opr-col">
			// 		<NCPopconfirm
			// 			trigger="click"
			// 			placement="top"
			// 			content="确认删除?"
			// 			onClose={() => {
			// 				if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			// 					props.editTable.deleteTableRowsByIndex(tableid, index);
			// 				}else{//浏览态
			// 					let delObj = {
			// 						rowId: index,
			// 						status: '3',
			// 						values: {
			// 							// ts: {
			// 							// 	display: '时间戳',
			// 							// 	value: record.values.ts.value
			// 							// },
			// 							// pk_incoterm: {
			// 							// 	display: '主键',
			// 							// 	value: record.values.pk_incoterm.value
			// 							// }
			// 						}
			// 					};
			// 					delObj.values = record.values;
			// 					let indexArr=[];
			// 					indexArr.push(index);
			// 					let data = {
			// 						model: {
			// 							areaType: 'table',
			// 							pageinfo: null,
			// 							rows: [ delObj ]
			// 						}
			// 					};
			// 					ajax({
			// 						url: urls['save'],
			// 						data,
			// 						success: function(res) {
			// 							let { success, data } = res;
			// 							if (success) {
			// 								props.editTable.deleteTableRowsByIndex(tableid, indexArr);
			// 								let allD = props.editTable.getAllData(tableid);
			// 								Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
			// 								props.editTable.setTableData(tableid,allD);
			// 								toast({content:'删除成功',color:'success'});
			// 							}
			// 						}.bind(this)
			// 					});
			// 				}
			// 			}}
			// 		>
			// 			<span className='operator'>删除</span>
			// 		</NCPopconfirm>
			// 	</div>
			// ):(
			// 	<div className="currency-opr-col">
			// 		<span className='operator' 
			// 			onClick={() => {
			// 				props.editTable.deleteTableRowsByIndex(tableid, index);
			// 			}}
			// 		>删除</span>
			// 	</div>
			// );
		}
	};
	meta[tableid].items.push(event);
	//props.renderItem('table',tableid,'creator',refer('creator'));
	return meta;
}
function tableButtonClick(props, id, text, record, index){
    switch(id){
        case 'DelLine':
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
						// pk_incoterm: {
						// 	display: '主键',
						// 	value: record.values.pk_incoterm.value
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
					success: function(res) {
						let { success, data } = res;
						if (success) {
							props.editTable.deleteTableRowsByIndex(tableid, indexArr);
							let allD = props.editTable.getAllData(tableid);
							Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
							props.editTable.setTableData(tableid,allD);
							allTableData = allD;
							toast({content:props.MutiInit.getIntl("10140INCOT")&&props.MutiInit.getIntl("10140INCOT").get('10140INCOT-000002'),color:'success'});/* 国际化处理： 删除成功*/
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
			searchDisable:false,				//简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable:false,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false,				//列表是否显示停用数据
			json:{}
		}
	}
	
	componentWillMount() {
		let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			this.setState({json})       // 保存json和inlt到页面state中并刷新页面
		}
		getMultiLang({moduleId: appcode,domainName: 'uapbd',callback})
  	}

	componentDidMount() {
		this.getData(false);
	}

	componentDidUpdate(){
		let tableStatus = this.props.editTable.getStatus(tableid);
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
						},
						notEmpty : (data)=>{	//数据不为空时执行回调方法
							//适配显示公式
							Utils.showFormular(this.props,res,{tableid:"editTable"});
							this.props.editTable.setTableData(tableid,data[tableid]);
						},
						after : (data)=> {	//数据处理完成后执行回调方法
							allTableData = data[tableid];
							this.updateButtonStatus();
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

	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		// let length = this.props.editTable.getNumberOfRows(moduleId);
		// if(((length-1)===index)&&data.status==='2'){
		// 	this.props.editTable.filterEmptyRows(tableid,keys);
		// 	this.onButtonClick('add');
		// }
		// if(key === 'isinclufare' || key === 'isincluprem' || key === 'factoryship'){
		// 	let allRows = props.editTable.getAllRows(moduleId);
		// 	data.status = '1';
		// 	let reqData= [];
		// 	reqData.push(data);
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
						
		// 				// Utils.convertGridEnablestate(data[tableid].rows);
		// 				Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
		// 				this.props.editTable.setTableData(tableid,allD);
		// 			}else{
		// 				this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,key,{value:!(data.values[key].value)});
		// 			}
		// 		},
		// 		error: (res)=> {
		// 			toast({ color: 'danger', content: res.message });
		// 			this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,key,{value:!(data.values[key].value)});
		// 		}
		// 	});
		// }
		//自动增行
		// setTimeout(() => {
		// 	let length = this.props.editTable.getNumberOfRows(moduleId);
		// 	if(((length-2)===index)&&data.status==='2'){
		// 		// this.props.editTable.filterEmptyRows(tableid,keys);
		// 		// this.addTableRow(false);
		// 	}
		// }, 2);
	}

	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态z
		let checkedRows = this.props.editTable.getCheckedRows(tableid);
		let allRows = this.props.editTable.getAllRows(tableid);

		let checkedLength = checkedRows.length;//获取列表页选择数据的行数
		let allLength = allRows.length;
		this.props.button.setDisabled({
			Delete: checkedLength==0,
			Print: allLength==0,
			Output: allLength==0
		});
		/*if(length === 0){//未选择数据
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
		}*/
		if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: false,
				Save: true,
				Cancel: true,
				Delete: true,
				Refresh: false,
				Print: false,
				Output: false
			});
			this.setState({
				// moreButton:false,
				searchDisable:true
				// showOffDisable:true
			});
			this.props.button.setMainButton({Save:true,Add:false});
			this.props.button.setPopContent('DelLine','');
		}else{//浏览态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Refresh: true,
				Print: true,
				Output: true
			});
			this.setState({
				// moreButton:true,
				searchDisable:false
				// showOffDisable:false
			});
			this.props.button.setMainButton({Save:false,Add:true});
			this.props.button.setPopContent('DelLine',this.state.json['10140INCOT-000000']);/* 国际化处理： 确认要删除该信息吗？*/
		}
	}

	//显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
		});
		this.getData(this.state.isShowOff);
	}

	cancelConfirmModal(props){
        this.props.editTable.cancelEdit(tableid);
        this.props.editTable.showColByKey(tableid,'opr');//显示操作列
        this.updateButtonStatus();
    }
	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Add':
				
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				this.props.editTable.addRow(tableid,num,true);
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'isinclufare', {value: false });//设置分级默认值
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'isincluprem', {value: false });//设置分级默认值
				this.props.editTable.setValByKeyAndIndex(tableid, num, 'factoryship', {value: false });
				this.updateButtonStatus();
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				this.updateButtonStatus();
				break;
			case 'Cancel':
				// this.props.editTable.cancelEdit(tableid);
				
				// this.props.modal.show('cancelConfirmModal');
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140INCOT-000003'],/* 国际化处理： 确认取消*/
					content:this.state.json['10140INCOT-000004'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick:()=>{this.cancelConfirmModal()}
					})
				return;
				this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid,keys);
					let tableData = this.props.editTable.getChangedRows(tableid, true);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					// console.log(tableData);
					if(!tableData || tableData.length === 0) {
						// toast({content: '没有要保存的数据', color:'info'})
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
						toast({title: this.state.json['10140INCOT-000005'], color:'success'});/* 国际化处理： 保存成功！*/
						return;
					}
					let tableAllData = this.props.editTable.getAllRows(tableid, true);
					tableData=tableAllData;
					if(!this.props.editTable.checkRequired(tableid,tableAllData)) return;
	
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
					// 验证公式
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
										},
										notEmpty : (data)=>{
											let allD = this.props.editTable.getAllData(tableid);
											Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
											Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
											this.props.editTable.setTableData(tableid, allD);	
										},
										after : (data)=> {	//数据处理完成后执行回调方法
											let allD = this.props.editTable.getAllData(tableid);
											allTableData = allD;
											this.updateButtonStatus();
										}
									});
		
								}
								toast({title: this.state.json['10140INCOT-000005'], color:'success'});		/* 国际化处理： 保存成功！*/
							}.bind(this),
							error: function(res){
								let message=res.message;
								toast({ color: 'danger', title: message });
								this.updateButtonStatus();
							}.bind(this)
						});
					},{[tableid]: "editTable"});
				}, 0);
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.state.json['10140INCOT-000006'],color:'warning'});/* 国际化处理： 请选择要删除的数据*/
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
						title:this.state.json['10140INCOT-000007'],/* 国际化处理： 删除提醒*/
						content:this.state.json['10140INCOT-000008'],/* 国际化处理： 确定要删除数据吗？*/
						beSureBtnClick:()=>{this.onDelForBrowse()}
						})
				}
				break;
			case "Refresh":
				this.setState({ searchValue:'' });
				this.getData(this.state.isShowOff);

				toast({title: this.state.json['10140INCOT-000009'], color:'success'});/* 国际化处理： 刷新成功！*/
				break;
				
			case 'Print':
                this.output('print');
                break;
            case 'Output':
                this.output('output')
				break;
		}
	
	}
	
    output(type=''){
        let allData = this.props.editTable.getAllData(tableid);
        let pks = [];
        allData.rows.forEach((item)=>{
            pks.push(item.values['pk_incoterm'].value);
        });
        if(type === "print"){
            //打印
			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				urls['print'], 
				{
					billtype:'',  //单据类型
					funcode: appcode,      //功能节点编码，即模板编码
					nodekey:'',     //模板节点标识
					oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
				}
				);
		}
		//输出
		if(type === "output"){
			this.setState({
				pks: pks
				},this.refs.printOutput.open());	
		}

		// if(type='output'){
		// 	//输出
		// 	print(
		// 		'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		// 		urls['print'], 
		// 		{
		// 			billtype:'',  //单据类型
		// 			funcode: appcode,      //功能节点编码，即模板编码
		// 			nodekey:'',     //模板节点标识
		// 			oids: pks,
		// 			outputType:'output'
		// 		}
		// 		);
        // }
	}
	
	onSelectMoreButton({ key }) {
		toast({content:this.state.json['10140INCOT-000010'],color:'warning'});/* 国际化处理： 努力开发中......*/
	 
	}
	
	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData = Utils.clone(allTableData);
		if(value.trim()===''){
			this.getData(this.state.isShowOff);
			return;
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

		this.updateButtonStatus();
		/*if (allData.rows.length === 0) {
			hasData = false;
		} else {
			hasData = true;
		}
		// 查询后设置打印等按钮状态
		this.props.button.setButtonDisabled({
			Print: !hasData,
			Output: !hasData
		});*/
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
					// pk_incoterm: {
					// 	display: '主键',
					// }
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values = val.data.values;
			// delObj.values.ts.value=val.data.values.ts.value;
			// delObj.values.pk_incoterm.value=val.data.values.pk_incoterm.value;
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
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
					this.props.editTable.setTableData(tableid,allD);
					allTableData = allD;
					this.updateButtonStatus();
					toast({title:this.state.json['10140INCOT-000011'],color:'success'});/* 国际化处理： 删除成功！*/
				}
			}.bind(this)
		});
	}
	// 自动增行后的回调
	addRowAutoCallback() {
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'isinclufare', {value: false });//设置分级默认值
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'isincluprem', {value: false });//设置分级默认值
		this.props.editTable.setValByKeyAndIndex(tableid, num-1, 'factoryship', {value: false });
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
		let moreButton = (
			<Menu
                  onSelect={this.onSelectMoreButton.bind(this)}>
                      {/* <Item key="1">自定义档案维护-全局</Item>
					  <Item key="2">自定义档案维护-集团</Item>
					  <Item key="3">this.state.json['10140INCOT-000018']-this.state.json['10140INCOT-000021']</Item> */}/* 国际化处理： 自定义档案维护,业务单元*/
                </Menu>
		);
		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={{borderBottom:'none'}}>
					{/* 标题 title */}
					<div className="header-title-search-area" >
						{createBillHeadInfo({
								title:(this.state.json['10140INCOT-000022']),
								initShowBackBtn:false
                        })}	
						{/* 简单查询 */}
						<div className="title-search-detail">
							<NCFormControl
					placeholder={this.state.json['10140INCOT-000012']/* 国际化处理： 请输入编码或名称筛选*/}
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
									>{this.state.json['10140INCOT-000023']/* 国际化处理： 显示停用*/}</NCCheckbox>
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
						// //onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
						// onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						// useFixedHeader:true,    
						// //onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
						// //onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
						// selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						// // statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
						// statusChange: function(){
						// 	setTimeout(() => {
						// 		this.updateButtonStatus();
						// 	}, 0)
						// }.bind(this),				//表格状态监听
						// showIndex:true,				//显示序号
						// isAddRow: true, 	// 失去焦点是否自动增行
						// //addRowCallback: this.addRowAutoCallback.bind(this),	// 自动增行后的回调
						// showCheck:true			//显示复选框
						// //params: 'test',                                  // 自定义传参
						
						isAddRow:true,
						useFixedHeader:true,    
						selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						showIndex:true,				//显示序号
						showCheck:true	,
						adaptionHeight: true
					})}
				</div>
				{/* 删除前确认模态框 */}
				{/* {createModal('modal',{
					title : '确认删除',										//标题
					content : '确认删除所选数据？',							//内容
					beSureBtnClick : this.onDelForBrowse.bind(this),		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					leftBtnName : '确认',   								//左侧按钮名称
    				rightBtnName : '关闭'   								//右侧按钮名称
				})} */}
				 {/* {createModal('cancelConfirmModal', {
							title: "注意",
							content: '是否确认要取消？',
							beSureBtnClick: this.cancelConfirmModal.bind(this)
				})} */}
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
    mutiLangCode: appcode
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65