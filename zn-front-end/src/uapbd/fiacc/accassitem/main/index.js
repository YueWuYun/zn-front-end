//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 会计辅助核算项目
 * @author	xuewenc
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, promptBox, createPageIcon,excelImportconfig } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
import Util from '../../../../uapbd/taxinfo/taxcode/util';
let { NCPopconfirm,NCModal,NCFormControl } = base;
import './index.less';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import HeaderArea from '../../../public/pubComponent/HeaderArea';
const {ExcelImport} = high;
const tableid = 'accassitem';
const pagecode = '10140ACCAB_accassitem';
const appid = '0001Z010000000002XCO';
const appcode = '10140ACCAB';
const urls = {
	save : '/nccloud/uapbd/fiacc/AccItemSaveAction.do',
	query : '/nccloud/uapbd/fiacc/AccItemQueryAction.do',
	addline : '/nccloud/uapbd/fiacc/AccItemAddLineAction.do',
	editEve : '/nccloud/uapbd/fiacc/AccassEditTableAction.do'
};
let allTableData = {};
const keys = ['dataoriginflag','pk_group','pk_org'];  //过来空行时，忽略的字段
const optionsCache = {};//缓存{value:classid,value:参数名称options}，防止同一个数据对象反复查
const context = {};//环境信息
const requiredAttrcode = [];//必须项属性集合，编辑态显示必须标识，浏览态隐藏

class AccassitemSingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		let excelimportconfig = excelImportconfig(props,'uapbd','accassitem',true,'',{appcode:"10140ACCAB",pagecode:"10140ACCAB_accassitem"})
		this.state={
			searchValue:'',
			searchDisable:true,		 //简单搜索框是否禁用	true：禁用		false：可用
			json : {},               //多语json
			inlt : null
		}

		createUIDom(props)(
			{pagecode : pagecode},
			{moduleId: '10140ACCAB',domainName: 'uapbd'},
			(data,langData,inlt)=>{
				//多语
				if(langData){
                    this.state.json = langData;
                    if(inlt){
                        this.state.inlt = inlt;
                    }
                }
				if(data.template){
					let meta = data.template;
					meta = this.modifierMeta(props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					data.button && props.button.setButtons(data.button);
					props.button.setPopContent({'Deline':this.state.json['10140ACCAB-000000']});/* 国际化处理： 确定要删除吗？*/
					props.button.setButtonsVisible(['Add','Edit','Delete','Refresh'], true);
					props.button.setButtonsVisible(['Save','Cancel'], false);
					props.button.setDisabled(['Add', 'Edit', 'Delete', 'Save', 'Cancel', 'Refresh'], false);
				};

				this.getData();
				this.updateButtonStatus();
				props.button.setUploadConfig("import",excelimportconfig);
			}
		);
	}

	//对表格模板进行加工操作
	modifierMeta(props,meta) {
		//设置元数据
		meta[tableid].items.map((obj)=>{
			if(obj['required']){
				obj['required'] = false;
				requiredAttrcode.push(obj.attrcode);
			}
			if(obj['attrcode']==='classid'){
				obj['refcode'] = 'uap/refer/riart/bdmdMainentityAndEnumRef/index';
				obj['isMultiSelectedEnabled'] = false;
			}
			if(obj.itemtype === 'select' && obj.attrcode ==='refnamecbx'){ //参照名称
				obj.showClear = false; //去掉下拉框的清空图标 
			}
		});

		meta[tableid].items.push({
			attrcode: 'opr',
			itemtype:'customer',
			label: this.state.json['10140ACCAB-000001'],/* 国际化处理： 操作*/
			width: 200,
			className : 'table-opr',
			fixed: 'right',
			visible: true,
			render: (text, record, index) => {
				return props.button.createOprationButton(
					["Deline"],{
						area: "line-area",
						buttonLimit: 1,
						onButtonClick: (props, id) => {this.oprButtonClick(props, id, text, record, index)}
					}
				)
			}
		});

		return meta;
	}

	/**
     * 行操作
     * @param {*} props 
     * @param {*} id 
     * @param {*} text 
     * @param {*} record 
     * @param {*} index 
     */
    oprButtonClick(props, id, text, record, index){
		let tableStatus = props.editTable.getStatus(tableid);
		// 表格操作按钮
		if(id==='Deline'){
			if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
				props.editTable.deleteTableRowsByIndex(tableid, index);
			}else{//浏览态
				let delObj = {
					rowId: index,
					status: '3',
					values: record.values
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
							props.editTable.setTableData(tableid,allD);
							toast({title:this.state.json['10140ACCAB-000002'],color:'success'});/* 国际化处理： 删除成功！*/
						}
					}
				});
			}
		}
	}

	componentDidMount() {
		//
	}

	componentDidUpdate(){
        let l_formstatus = this.props.editTable.getStatus(tableid);
        if(l_formstatus != 'add' && l_formstatus != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Add':
				this.addTableRow();
				break;
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				break;
			case 'Cancel':
				promptBox({
					color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title : this.state.json['10140ACCAB-000003'],/* 国际化处理： 取消*/
					content : this.state.json['10140ACCAB-000004'],/* 国际化处理： 确定要取消吗？*/
					hasCloseBtn:false,
					beSureBtnClick: () => {
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
					}
				});
				break;
			case 'Save':
				this.onSave();
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.state.json['10140ACCAB-000005'],color:'warning'});/* 国际化处理： 请选择要删除的数据*/
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
						color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title : this.state.json['10140ACCAB-000006'],/* 国际化处理： 删除*/
						content : this.state.json['10140ACCAB-000007'],/* 国际化处理： 确定要删除所选数据吗？*/
						hasCloseBtn : false,
						beSureBtnClick : this.onDelForBrowse.bind(this)
					});
				}
				break;
			case "Refresh":
				this.getData(() => {
					toast({ color: 'success', title: this.state.json['10140ACCAB-000008'] });/* 国际化处理： 刷新成功！*/
				});
				break;
			case 'export':
					this.props.modal.show('exportFileModal');
		}
	
	}

	//请求列表数据
	getData = (callback) => {
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:{
				"pagecode": pagecode
			},
			success: (res) => {
				let success = res.success;
				if (success) {

					this.dealDisplayFm(res);

					context['pk_group'] = res.data['pk_group'];
					context['pk_org'] = res.data['pk_org'];
					let data = res.data['grid'];
					Utils.handleTableReData({
						data : data,
						tableid : tableid,
						props : this.props,
						empty : (data) => {	//数据为空时执行回调方法
						},
						notEmpty : (data)=>{//数据不为空时执行回调方法
							// data[tableid].rows.forEach((item) => {
							// 	let refnodename = item.values['refnodename'].value;
							// 	item.values['refnamecbx'] = {display : refnodename,value : refnodename};
							// });
							this.props.editTable.setTableData(tableid,data[tableid]);
						},
						after : (data)=> {	//数据处理完成后执行回调方法
							allTableData = data[tableid];
							//根据筛选条件快速筛选
							this.onSimpleSearch(this.state.searchValue);
						}
					});

					callback && callback();
				}
			}
		});
	};

	//保存
	onSave(){
		this.props.editTable.filterEmptyRows(tableid,keys);
		
		let changeTableData = this.props.editTable.getChangedRows(tableid,true);//保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
		if(!changeTableData || changeTableData.length === 0){
			toast({title:this.state.json['10140ACCAB-000009'],color:'success'});/* 国际化处理： 保存成功！*/
			this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
			return;
		}
		
		let alldata = this.props.editTable.getAllData(tableid).rows;
		if(this.editorValidate(alldata)) return;
		if(!this.props.editTable.checkRequired(tableid, alldata)) return;

		let paramData = {
			pageid:pagecode,
			model : {
				areaType: "table",
				areacode: tableid,
				pageinfo: null,
				rows: []
			}
		};
		paramData.model.rows = alldata;

		let saveajax = () => {
			ajax({
				url: urls['save'],
				data: paramData,
				success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success,data} = res;
					if (success) {
						toast({title:this.state.json['10140ACCAB-000009'],color:'success'});/* 国际化处理： 保存成功！*/
						this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
						//保存后刷新
						this.getData();
					}
				}
			});
		}

		this.props.validateToSave(paramData, saveajax, {[tableid]:'editTable'}, 'grid');
	}

	/**
	 * 校验 输入长度应该大于精度值！
	 * @param {*} allDat 
	 */
	editorValidate(allDat){
		if(allDat && allDat.length>0){
			for(let i=0;i<allDat.length;i++){
				let inputlength = allDat[i]['values']['inputlength']['value'] || 0;
				let digits = allDat[i]['values']['digits']['value'] || 0;
				if(inputlength-digits<0){
					toast({content: this.state.inlt&&this.state.inlt.get('10140ACCAB-000012', { count: (i+1)}),color:'danger'});/* 国际化处理： 第,行 ,输入长度应该大于精度值！*/
					return true;
				}
			}
		}
		return false;
	}

	//表头简单筛选
	onSimpleSearch(value){
		this.setState(
			{ searchValue:value },
			() => {
				let allData =   Utils.clone(allTableData);
				if(value.trim()!='' && allData.rows && allData.rows.length>0){
					//name,code,inputlength,digits  classid,refnodename
					let rows = Array.of();
					for(var row of allData.rows){
						if(row.values['name'].value.indexOf(value)>-1
						 || row.values['code'].value.indexOf(value)>-1
						//  || row.values['inputlength'].value.indexOf(value)>-1
						//  || row.values['digits'].value.indexOf(value)>-1
						//  || row.values['classid']['display'].indexOf(value)>-1
						//  || row.values['refnamecbx']['display'].indexOf(value)>-1
						){
							rows.push(row);
						}
					}
					allData.rows = rows;
				}
				this.props.editTable.setTableData(tableid,allData);
			}
		);
	}

	//表格编辑前事件  props 内部方法，moduleId(区域id), item(模版当前列的项), index（当前索引）,value（当前值）, record（行数据）
	onBeforeEvent(props,moduleId,item,index,value,record){
		let key = item['attrcode'];
		if(key==='refnamecbx'){
			//当数据对象为空时，相关属性不可编辑
			let classid = props.editTable.getValByKeyAndIndex(moduleId, index, 'classid').value;
			//如果optionsCache已经有下拉选项则证明已加载过，不需要再查后台
			if(optionsCache[classid]){
				let meta = props.meta.getMeta();
				meta[moduleId].items.find((item) => item.attrcode == 'refnamecbx').options = optionsCache[classid];
				props.meta.setMeta(meta);
			}
			/**加载参数名称options的值**/
			let paramData = {
				'baflag'  : 'before',
				'key'     : key,
				'classid' : classid
			};
			ajax({
				url : urls['editEve'],
				async : false,
				data : paramData,
				success : (res) => {//此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success, data } = res;
					if (success && data['refnamecbxflag'] && data['refnamecbxOptions'] && data['refnamecbxOptions'].length>0) {	
						
						let meta = props.meta.getMeta();
						
						meta[moduleId].items.find((item) => item.attrcode == 'refnamecbx').options = (() => {
							let options = [];
							data['refnamecbxOptions'].forEach((optionValue,index) => {
								options[index] = {
									'display' : optionValue,
									'value'   : optionValue
								};
							});
							if(options.length>0){
								optionsCache[classid] = options;
							}
							return options;
						})();
						props.meta.setMeta(meta);
					}else{
						//option需要给空值，不然报错
						let meta = props.meta.getMeta();
						meta[moduleId].items.find((item) => item.attrcode == 'refnamecbx').options = (() => {
							let options = [];
							options[0] = {'display' : "",'value'   : ""};
							optionsCache[classid] = options;
							return options;
						})();
						props.meta.setMeta(meta);

						return false;
					}
				}
			});
		}else{
			return true;
		}
		return true;
	}

	/**
	 * 通用ajax请求
	 * @param config
	 * @param callback
	 */
	ajaxRequest = async (props,moduleId,item,index,value,record)=>{
		return await new Promise(resolve=>{
			ajax({
				url:config.url,
				data:config.param,
				success:(res)=>{
					if(res.success && config.callback &&typeof config.callback === 'function'){
						return resolve(config.callback(res.data,this.state.curOrg));
					}
				}
			})
		})
	}
	
	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		let hdata = data;
		if(key === 'inputlength' && value){
			let val = value[0].newvalue.value;
			if(!val && !typeof(val) != 'string')return;
			let inputlength = Number(val);
			if(inputlength<=0 || inputlength>200){
				inputlength = null;
				//props.editTable.setValByKeyAndIndex(moduleId, index, key, {isEdit:false});
				toast({content: this.state.json['10140ACCAB-000013'],color:'danger'});/* 国际化处理： 输入值必须介于[1,200]*/
				props.editTable.setValByKeyAndRowId(tableid,data.rowid,key,{value:inputlength});
			}
		}else if(key === 'digits' && value){
			let val = value[0].newvalue.value;
			if(!val && !typeof(val) != 'string')return;
			let digits = Number(val);
			if(digits<0 || digits>8){
				digits = null;
				//props.editTable.setValByKeyAndIndex(moduleId, index, key, {isEdit:false});
				toast({content: this.state.json['10140ACCAB-000014'],color:'danger'});/* 国际化处理： 输入值必须介于[0,8]*/
				props.editTable.setValByKeyAndRowId(tableid,data.rowid,key,{value:digits});
			}
		}else if(key === 'classid' && value){
			let val = value[0].newvalue.value;
			let oldval = value[0].oldvalue.value;
			if(val){
				if(val === oldval){
					return;
				}
				let paramData = {
					'baflag'  : 'after',
					'key'     : key,
					'value' : val
				};
				ajax({
					url: urls['editEve'],
					data:paramData,
					success: (res) => {//此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
						let { success, data } = res;
						if (success) {
							//若name字段的值为空，则设置默认值
							if(!props.editTable.getValByKeyAndIndex(moduleId, index, 'name').value){
								props.editTable.setValByKeyAndIndex(moduleId, index, 'name', {value:data['nameDefVal']});
							}
							if(data['inputLenCanEdit']){
								props.editTable.setValByKeyAndIndex(moduleId, index, 'inputlength', {value:0});
							}if(data['digitsCanEdit']){
								props.editTable.setValByKeyAndRowId(moduleId, index, 'digits', {value:0});
							}
							if(!data['refnodenameDefVal']){
								data['refnodenameDefVal'] = '';
								data['refnamecbxDefVal'] = '';
							}
							props.editTable.setValByKeyAndIndex(moduleId, index, 'refnamecbx', {display:data['refnamecbxDefVal'],value:data['refnamecbxDefVal']});
							props.editTable.setValByKeyAndIndex(moduleId, index, 'refnodename', {value:data['refnodenameDefVal']});
							if(data['refnamecbxOptions']){
								optionsCache[val] = data['refnamecbxOptions'];
							}
						}
					}
				});
			}else{
				//如果置空则需清空相关字段的值
				props.editTable.setValByKeyAndRowId(moduleId, data.rowid, 'name', {value:''});
				props.editTable.setValByKeyAndRowId(moduleId, data.rowid, 'inputlength', {value:''});
				props.editTable.setValByKeyAndRowId(moduleId, data.rowid, 'digits', {value:''});
				props.editTable.setValByKeyAndRowId(moduleId, data.rowid, 'refnamecbx', {display:'',value:''});
				props.editTable.setValByKeyAndRowId(moduleId, data.rowid, 'refnodename', {value:''});
			}
		}else if(key === 'refnamecbx'){
			props.editTable.setValByKeyAndRowId(moduleId, data.rowid, 'refnodename', {value:value[0].newvalue.value});
		}
	}

	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(length === 0){//未选择数据
			this.props.button.setDisabled({Delete: true});
		}else {//选择多行数据
			this.props.button.setDisabled({Delete: false});
		}
		if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			this.props.button.setMainButton({'Add':false,'Save':true});
			this.props.button.setButtonsVisible(['Add','Save','Cancel','Delete'], true);
			this.props.button.setButtonsVisible(['Edit','Refresh','import'], false);
			this.props.button.setPopContent({'Deline':''});
			this.setState({
				searchDisable:true,
				showOffDisable:true
			});
			this.controlAttrRequiredIsShow(this.props, true);
		}else{//浏览态
			this.props.button.setMainButton({'Add':true,'Save':true});
			this.props.button.setButtonsVisible(['Add','Edit','Refresh','Delete','import'], true);
			this.props.button.setButtonsVisible(['Save','Cancel'], false);
			this.props.button.setPopContent({'Deline':this.state.json['10140ACCAB-000000']});/* 国际化处理： 确定要删除吗？*/
			this.setState({
				searchDisable:false,
				showOffDisable:false
			});
			this.controlAttrRequiredIsShow(this.props, false);
		} 
	}

	//控制必输标识是否显示
	controlAttrRequiredIsShow(props, flag){
		let meta = props.meta.getMeta();
		meta[tableid].items.map((obj)=>{
			if(Util.isInArray(requiredAttrcode, obj['attrcode'])){
				obj['required'] = flag;
			}
		});
		props.meta.setMeta(meta);
	}

	addTableRow(){
		// ajax({
		// 	url: urls['addline'],
		// 	async: false,
		// 	data: {},
		// 	success:(result)=>{
		// 		let {data,success} = result;
		// 		if(success){
		// 			let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数

		// 			let adddata = data[tableid].rows[0].values;
		// 			this.setState(this.state, () => {
		// 				this.props.editTable.addRow(tableid, num, true, adddata);
		// 				// this.props.editTable.addRow(tableid,num,true,
		// 				// 	{ 'dataoriginflag':{value: '0'},'pk_group':{value: context['pk_group']},'pk_org':{value: context['pk_group'] } }
		// 				// );
		// 			});
		// 		}
		// 	}
		// })
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		this.props.editTable.addRow(tableid,num,true,
			{ 'dataoriginflag':{value: '0'},'pk_group':{value: context['pk_group']},'pk_org':{value: context['pk_group'] } }
		);
	}

	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',//表示删除
				rowId: val.data.rowId,
				values: val.data.values
			};
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
					this.props.editTable.setTableData(tableid,allD);
					toast({title:this.state.json['10140ACCAB-000002'],color:'success'});/* 国际化处理： 删除成功！*/
				}
			}
		});
	}

	//处理显示公式
    dealDisplayFm = (result) => {
        if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
            this.props.dealFormulamsg(
                result.formulamsg,
                {
                    [tableid] : "editTable"
                }
            );
        }
	}

	render() {
		let { table, button, search,editTable,modal } = this.props;
		let { createEditTable } = editTable;
		let { createButtonApp } = button;
		let {createModal} = modal;

		return (
			<div className="nc-single-table nc-single-table-my-style">
		{/* 国际化处理： 会计辅助核算项目*/}
		<HeaderArea 
					searchContent = {
						<NCFormControl
							placeholder={this.state.json['10140ACCAB-000015']/* 国际化处理： 请输入编码或名称筛选*/}
							value={this.state.searchValue}
							onChange={this.onSimpleSearch.bind(this)}
							type="search"
							className="search-box"
							disabled={this.state.searchDisable}
						/>
					}
					btnContent = {createButtonApp({
						area: 'list-actions',
						buttonLimit: 3, 
						onButtonClick: this.onButtonClick.bind(this), 
						popContainer: document.querySelector('.header-button-area')

					})}
				/>
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
					{createEditTable(tableid, {//列表区
						onBeforeEvent: this.onBeforeEvent.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this),           // 控件的编辑后事件  
						useFixedHeader:true,
						isAddRow: false,
						adaptionHeight:true,
						selectedChange: this.updateButtonStatus.bind(this),   // 选择框有变动的钩子函数 //表格状态监听
						selectedChange:() => {
							this.updateButtonStatus();
						},              // 选择框有变动的钩子函数
						statusChange: () => {
							this.updateButtonStatus();
						},				//表格状态监听
						showIndex:true,			//显示序号
						showCheck:true			//显示复选框
					})}
				</div>
				<ExcelImport 
                    {...Object.assign(this.props)}
                    moduleName = 'uapbd'//模块名
                    billType = 'accassitem'//单据类型
                    selectedPKS = {this.state.selectedPKS}
                    //exportTreeUrl = {""}//自定义导出action接口(可不传)
                    appcode="10140ACCAB"          
					pagecode="10140ACCAB_accassitem"
					
                />
			</div>
		);
	}
}

AccassitemSingleTable = createPage({
	billinfo:{
        billtype: 'grid',
        pagecode: pagecode,
        bodycode: tableid
    }
})(AccassitemSingleTable);

ReactDOM.render(<AccassitemSingleTable />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65