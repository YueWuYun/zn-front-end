//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 凭证类别
 * @author	xuewenc
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,print,cacheTools,promptBox,createPageIcon,excelImportconfig } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
import Util from '../../../../uapbd/taxinfo/taxcode/util';
import Org from  '../../../../uapbd/refer/org/AccountBookTreeRef';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import HeaderArea from '../../../public/pubComponent/HeaderArea';
let { NCPopconfirm,NCModal, NCDropdown, NCIcon, NCMenu, NCButton, NCFormControl,NCCheckbox }  = base;
const { PrintOutput, ExcelImport } = high;
let {BDselect} = Utils;

const isShowOffEnable = true;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['pk_org','pk_group','enablestate','dataoriginflag'];  //过来空行时，忽略的字段
/****************默认参数  开始***********************/
let tableid = 'vouchertype';//列表组件Id
let urls={
    query : '/nccloud/uapbd/vouchertype/VoucherTypeQueryAction.do',
	save : '/nccloud/uapbd/vouchertype/VoucherTypeSaveAction.do',
	add : '/nccloud/uapbd/vouchertype/VoucherTypeAddAction.do',
	enable : '/nccloud/uapbd/vouchertype/VoucherTypeEnableAction.do',
	disEnable : '/nccloud/uapbd/vouchertype/VoucherTypeDisEnableAction.do',
	print : '/nccloud/uapbd/vouchertype/PrintVoucherTypeAction.do'
};
let pageCode = "10140VTG_vouchertype";
let appcode = "10140VTG";//默认集团
let vttParam = {
	pk_group : null,
	pk_org : null   //当前登录集团
}
const requiredAttrcode = [];//必须项属性集合，编辑态显示必须标识，浏览态隐藏
/***************默认参数  结束********************/

class VouchertypeTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.config =Object.assign({
            //title: title,
			pageCode:'10140VTG_vouchertype',
			appcode : "10140VTG",
            nodeType:'grp',
            urls:urls
		},props.config);

		
		this.state={
			pk_org: null,
			searchValue:'',
			orgStatus: false,
			searchDisable:false,			//简单搜索框是否禁用	true：禁用		false：可用
			moreButton:false,				//更多按钮状态
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false,    			//列表是否显示停用数据
			pks : [],                       //打印pks
			json : {},                      //多语json
			inlt : null
		}
		
		this.initemplate(this.props);
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
	onButtonClick(props,id){
		switch (id) {
			case 'Add':
				this.dealEnable();
				this.onAddRow();
				break;
			case 'Edit':
				this.dealEnable();
				this.props.editTable.setStatus(tableid, 'edit');
				this.setState({status: true});
				break;
			case 'Cancel':
				promptBox({
					color:"warning",                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title : this.state.json['10140VTB-000000'],/* 国际化处理： 确认取消*/
					content : this.state.json['10140VTB-000001'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick: () => {
						this.props.editTable.cancelEdit(tableid);
						this.setState({status: false});
						this.updateButtonStatus();
						
						let allD = this.props.editTable.getAllData(tableid);
						Utils.convertGridEnablestate(allD.rows);
						this.props.editTable.setTableData(tableid, allD);
						Utils.filterDelRows(allD.rows);
						this.props.editTable.filterEmptyRows(tableid,keys);
					}
				});
				break;
			case 'Refresh':
				this.getData(() => {
					toast({ color: 'success', title: this.state.json['10140VTB-000002'] });/* 国际化处理： 刷新成功！*/
				});
				break;
			case 'Save':
				setTimeout(() => {
					this.props.editTable.filterEmptyRows(tableid,keys);
					let changetableData = this.props.editTable.getChangedRows(tableid,true);//保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
					if(!changetableData || changetableData.length === 0){
						this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
						this.dealEnable();
						toast({title:this.state.json['10140VTB-000003'],color:'success'});/* 国际化处理： 保存成功！*/
						return;
					}
					
					if(!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllData(tableid).rows)) return;

					let data = {
						pageid:this.config.pageCode,
						model : {
							areaType: "table",
							areacode: tableid,
							pageinfo: null,
							rows: []
						}
					};
					data.model.rows = changetableData;
					let saveajax = () => {
						ajax({
							url: urls['save'],
							data,
							success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									this.dealDisplayFm(res);
									this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
									this.setState({status: false});
									if(data){
										// let allD = this.props.editTable.getAllData(tableid);
										// Utils.filterDelRows(allD.rows);
										// Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
										// Utils.convertGridEnablestate(allD.rows);
										// this.props.editTable.setTableData(tableid,allD);
										toast({title:this.state.json['10140VTB-000003'],color:'success'});/* 国际化处理： 保存成功！*/
										this.getData();
									}
								}
							}
						});
					}
					this.props.validateToSave(data, saveajax, {[tableid]:'editTable'}, 'grid');
				}, 0);
				break;
			case "Delete":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.state.json['10140VTB-000004'],color:'warning'});/* 国际化处理： 请选择要删除的数据*/
					return;
				}else{
					let nodeType = this.config.nodeType;
					for(let i=0;i<selectedData.length;i++){
						let pk_org = selectedData[i].data.values.pk_org.value;
						let pk_group = selectedData[i].data.values.pk_group.value;
						if(this.isNoEdit(nodeType,pk_org,pk_group)){
							this.bdPop({nodeType});
							return;
						}
					}
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
						title : this.state.json['10140VTB-000005'],/* 国际化处理： 确认删除*/
						content : this.state.json['10140VTB-000006'],/* 国际化处理： 您确认删除所选数据？*/
						beSureBtnClick: () => {
							this.onDelForBrowse();
						}
					});
				}
				break;
			case 'Print':
				let printParam={
					funcode: this.config.nodeType==='grp'?'10140VTG':this.config.nodeType==='org'?'10140VTO':'10140VTB'
				};
				this.pintFunction(printParam);
                break;
			case 'Output':
				let allData=this.props.editTable.getAllData(tableid);
				let pks=[];
				allData.rows.forEach((item)=>{
					pks.push(item.values['pk_vouchertype'].value);
				});
				this.setState({
					pks:pks
				},() => {
					this.refs.printOutput.open();
				});
				break;
			case 'export':
				this.props.modal.show('exportFileModal');
				break;
            default:
                break;
		}
	
	}

	initemplate(props){
		createUIDom(props)(
			{
				pagecode : props.config.pageCode?props.config.pageCode:pageCode
			},
			{
                moduleId: '10140VTB',domainName: 'uapbd'
            },
			(data,langData,inlt)=>{
				//多语
				if(langData){
                    this.state.json = langData;
                    if(inlt){
                        this.state.inlt = inlt;
                    }
                }
				//设置元数据
				if(data.template){
					let meta = data.template;
					//设置元数据
					meta[tableid].items.map((obj)=>{
						if(obj['required']){
							obj['required'] = false;
							requiredAttrcode.push(obj.attrcode);
						}
					});

					meta = this.modifierMeta(props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					props.button.setButtonsVisible(['Save','Cancel'],false);

					props.button.setPopContent({'Deline':this.state.json['10140VTB-000007']});/* 国际化处理： 确认删除？*/
					
					let excelConfig = excelImportconfig(props, 'uapbd', 'vouchertype', true, '', 
						{appcode:this.config.appcode,pagecode:this.config.pageCode,nodeType:this.config.nodeType});
					props.button.setUploadConfig("import", excelConfig);
					props.button.setButtons(data.button);
				}

				let ccontext = data.context || {};
				if(ccontext.defaultAccbookPk){
					this.state.pk_org = {
						refpk : ccontext.defaultAccbookPk,
						refname : ccontext.defaultAccbookName,
						display : ccontext.defaultAccbookName,
						values : {refpk : ccontext.defaultAccbookPk, refname : ccontext.defaultAccbookName}
					};
					this.setState(this.state, () => {
						vttParam['pk_org'] = ccontext.defaultAccbookPk;
						this.getData();
					});
				}else{
					this.getData();
				}

			}
		);
	}

	//对表格模板进行加工操作
	modifierMeta = (props,meta) => {

		meta[tableid].items.map((item) => {
            if (item.attrcode == 'pk_org') {
                item['queryCondition'] = ()=>{
					return {
						"allOrgTypes" : "Y"
					}
				};
            }
        });

		//添加表格操作列
        meta[tableid].items.push({
            attrcode: 'opr',
            itemtype:'customer',
            label: this.state.json['10140VTB-000008'],/* 国际化处理： 操作*/
            width: 200,
            className : 'table-opr',
            fixed: 'right',
            visible: true,
            render: (text, record, index) => {
				let nodeType = props.config.nodeType;
				let pk_org = record.values.pk_org.value;
				let pk_group = record.values.pk_group.value;
				//本级只可操作本级数据
				if(this.isNoEdit(nodeType,pk_org,pk_group)){
					return '';
				}else{
					return props.button.createOprationButton(
						["Deline"],{
							area: "line-area",
							buttonLimit: 1,
							onButtonClick: (props, id) => {this.oprButtonClick(props, id, text, record, index)}
						}
					)
				}
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
			if(tableStatus == 'browse' || tableStatus == undefined){
				let delObj = {
					status: '3',
					rowId: index,
					values: record.values
				};
				let indexArr=[];
				indexArr.push(index);
				let data = {
					pageid:props.config.pageCode,
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
							toast({title:this.state.json['10140VTB-000009'],color:'success'});/* 国际化处理： 删除成功！*/
						}
					}
				});
			}else{
				props.editTable.deleteTableRowsByIndex(tableid, index);
			}
		}
	}

	/**
	 * 判断是否有权限操作  管控校验
	 **/
	isNoEdit = (nodeType,pk_org,pk_group) => {
		if( (nodeType==='glb' && pk_org != 'GLOBLE00000000000000')
		|| (nodeType==='grp' && !(pk_org === pk_group && pk_org === vttParam['pk_group']) )
		|| (nodeType==='org' && (pk_org!=vttParam['pk_org']))
	){
		return true;
		}else{
			return false;
		}
	}

	/**
	 * 无权限操作提示
	 **/
	bdPop = ({nodeType=''}={}) => {
		if(nodeType === 'org'){
			toast({content:this.state.json['10140VTB-000010'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
		}else if(nodeType === 'grp'){
			toast({content:this.state.json['10140VTB-000011'],color:'warning'});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
		}else{
			toast({content:this.state.json['10140VTB-000012'],color:'warning'});/* 国际化处理： 全局节点只能维护全局数据！*/
		}
	}
	
	/**
     * 页面初始设置button状态
     */
    initButtonStatus(){
        //设置按钮不显示
		if(this.config.nodeType==='org'){ 
			if(this.state.pk_org && this.state.pk_org.refpk){
				this.props.button.setButtonDisabled(['Edit'], false);
			}else{
				this.props.button.setButtonDisabled(['Edit'], true);
			}
		}
		this.props.button.setButtonsVisible(['Save','Cancel'],false);
		this.props.button.setButtonDisabled(['Delete'],true);
	}

	//请求列表数据
	getData = (callback) => {
		let paramData = {
			isShowOff: this.state.isShowOff ? "Y" : "N",
			nodeType: this.config.nodeType
		};
		if(this.state.pk_org && this.state.pk_org['refpk']  && this.state.pk_org.refpk.length>0){
			paramData['pk_org'] = this.state.pk_org.refpk;
		}
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理 
		ajax({
			url: this.config.urls.query,
			data: paramData,
			success: (res) => {
				let { success, data } = res;
				if (success) {

					this.dealDisplayFm(res);

					vttParam['pk_group'] = data['pk_group'];//当前登录集团赋值
					data = data['grid'];
					let nodeType = this.config.nodeType;
					Utils.handleTableReData({
						props: this.props,
						tableid: tableid,
						data: data,
						empty: ()=>{
							this.props.button.setButtonDisabled(['Print','Output','Edit'], true);
							this.props.editTable.setTableData(tableid, {rows: []});
						},
						notEmpty: (data)=>{
							Utils.convertGridEnablestate(data[tableid].rows);
							if(nodeType!='glb'){
								data[tableid].rows.forEach(function(item, index, array){
									if (item.values['pk_org'].value === 'GLOBLE00000000000000' //组织级、集团级不可编辑全局数据
										|| (nodeType==='org' && item.values['pk_org'].value === item.values['pk_group'].value) //组织级数据不可编辑集团级数据
									) {
										item.values['code'].disabled = 'on';
										item.values['name'].disabled = 'on';
										item.values['shortname'].disabled = 'on';
										item.values['description'].disabled = 'on';
										item.values['pk_currtype'].disabled = 'on';
										item.values['enablestate'].disabled = 'on';
									}
								});
							}
							allTableData = data[tableid];
							this.props.button.setButtonDisabled(['Print','Output','Edit'], false);
							this.props.editTable.setTableData(tableid, data[tableid]);
							this.initButtonStatus();
							//根据筛选条件快速筛选
							this.onSimpleSearch(this.state.searchValue);
						},
						after: (data)=>{
						}
					});

					callback && callback();
				}
			}
		});
	};

	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		let rowdata = data;
		switch (key) {
			case 'enablestate':
				let nodeType = this.config.nodeType;
				let pk_org = rowdata.values.pk_org.value;
				let pk_group = rowdata.values.pk_group.value;
				let enablestate = rowdata.values.enablestate.value;
				//判断是否有权限修改
				if(this.isNoEdit(nodeType,pk_org,pk_group)){
					this.bdPop({nodeType});
					props.editTable.setValByKeyAndIndex(tableid, index, 'enablestate', {value: !enablestate });
					return;
				}
				this.enableOrDisEnable(rowdata);
				break;
			default:
				break;
		}
	}

	//编辑前事件
	onBeforeEvent(props, moduleI, item, index, value, record){
		//props 内部方法，moduleId(区域id), item(模版当前列的项), index（当前索引）,value（当前值）, record（行数据）
		let nodeType = props.config.nodeType;
		let pk_org = record.values.pk_org.value;
		let pk_group = record.values.pk_group.value;
		let pk_vouchertype = record.values.pk_vouchertype['value'];
		//本级只可操作本级数据
		if(pk_vouchertype && this.isNoEdit(nodeType,pk_org,pk_group)){
			return false;
		}
		return true;
	}

	//控制停启用
	enableOrDisEnable(rowdata){
		let data = {
			pageid:this.config.pageCode,
			model : {
				areaType: "table",
				pageinfo: null,
				rows: []
			}
		};
		data.model.rows[0] = rowdata;
		let url = rowdata.values.enablestate.value?urls['enable']:urls['disEnable'];
		ajax({
			url: url,
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success,data} = res;
				if (success) {
					if(data){
						this.dealDisplayFm(res);
						let allD = this.props.editTable.getAllData(tableid);
						Utils.convertGridEnablestate(data[tableid].rows);
						Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
						this.props.editTable.setTableData(tableid,allD);
						toast({title:rowdata.values.enablestate.value?this.state.json['10140VTB-000013']:this.state.json['10140VTB-000014'],color:'success'});/* 国际化处理： 启用成功！,停用成功！*/
					}
				}
			}
		});
	}

	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(length === 0){//未选择数据
			this.props.button.setButtonDisabled(['Delete'],true);
		}else {
			this.props.button.setButtonDisabled(['Delete'],false);
		}
		if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			this.props.button.setMainButton({'Add':false,'Save':true});
			this.props.button.setButtonsVisible(['Add','Delete','Save','Cancel'],true);
			this.props.button.setButtonsVisible(['Edit','Refresh','Print','import'],false);
			this.props.button.setPopContent({'Deline':''});
			this.setState({
				moreButton:false,
				searchDisable:true,
				showOffDisable:true,
				orgStatus:true
			});
			this.controlAttrRequiredIsShow(this.props, true);
		}else{//浏览态
			this.props.button.setMainButton({'Add':true,'Save':false});
			this.props.button.setButtonsVisible(['Add','Edit','Delete','Refresh','Print', 'import'],true);
			this.props.button.setButtonsVisible(['Save','Cancel'],false);
			this.props.button.setPopContent({'Deline':this.state.json['10140VTB-000007']});/* 国际化处理： 确认删除？*/
			this.setState({
				moreButton:true,
				searchDisable:false,
				showOffDisable:false,
				orgStatus:false
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

	//显示停用数据
	showOffChange(){
		this.setState(
			{
				isShowOff : !this.state.isShowOff
			},
			() => {
				this.getData();
			}
		);
	}

	autoAddRow(){
		this.onAddRow(true);
	}

	onAddRow(isAddRow){
		let nodeType = this.config.nodeType;
		let requestParam = {nodeType: nodeType};
		if(nodeType === 'org'){
			if(!this.state.pk_org || !this.state.pk_org['refpk']){
				toast({content:this.state.json['10140VTB-000015'],color:'warning'});/* 国际化处理： 请先录入财务核算账簿！*/
				return;
			}
			let pk_org = this.state.pk_org.refpk;
			requestParam['pk_org'] = pk_org;
		}
		let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
		ajax({
			url:this.config.urls.add,
			async: false,
			data: requestParam,
			success:(result)=>{
				let {data,success} = result;
				if(success){
					this.dealDisplayFm(result);
					let adddata = data[tableid].rows[0].values;
					if(!isAddRow){
						this.props.editTable.addRow(tableid,num,true);
					}else{
						num--;
					}
					this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_org', adddata.pk_org);//设置组织
					this.props.editTable.setValByKeyAndIndex(tableid, num, 'pk_group', adddata.pk_group);//设置集团
					this.props.editTable.setValByKeyAndIndex(tableid, num, 'enablestate', {value: '2' });
				}
			}
		})
	}

	//输出和打印功能函数
	pintFunction(param){
		let allData=this.props.editTable.getAllData(tableid);
		let pks=[];
		allData.rows.forEach((item)=>{
			pks.push(item.values['pk_vouchertype'].value);
		});
		param.oids=pks;
		print(
			'pdf',
			urls['print'],
			param
		);
	}
	
	//表头简单筛选
	onSimpleSearch(value){
		this.setState(
			{ searchValue:value },
			() => {
				let allData =   Utils.clone(allTableData);
				if(value.trim()!='' && allData.rows && allData.rows.length>0){
					//name,code,shortname,description  pk_org,pk_currtype
					let rows = Array.of();
					for(let row of allData.rows){
						if(row.values['name'].value.indexOf(value)>-1
						 || row.values['code'].value.indexOf(value)>-1
						//  || row.values['shortname'].value.indexOf(value)>-1
						//  || row.values['description'].value.indexOf(value)>-1
						//  || row.values['pk_org']['display'].indexOf(value)>-1
						//  || row.values['pk_currtype']['display'].indexOf(value)>-1
						){
							rows.push(row);
						}
					}
					allData.rows = rows;
					if(rows && rows.length>0){
						this.props.button.setButtonDisabled(['Print','Output'], false);
					}else{
						this.props.button.setButtonDisabled(['Print','Output'], true);
					}
				}
				this.props.editTable.setTableData(tableid,allData);
			}
		);
	}

	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let deldata = Utils.convertDelData(selectedData,'enablestate');
		let data = {
			pageid:this.config.pageCode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: deldata['dataArr']
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					this.props.editTable.deleteTableRowsByIndex(tableid, deldata['indexArr']);
					let allD = this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allD.rows);
					this.props.editTable.setTableData(tableid,allD);
					toast({title:this.state.json['10140VTB-000009'],color:'success'});/* 国际化处理： 删除成功！*/
				}
			}
		});
	}

	//财务核算账簿变化事件
	onOrgChange(value){
		this.setState(
			{
				pk_org: value
			},
			() => {
				vttParam['pk_org'] = value ? value['refpk'] : null;
				this.getData();
			}
		);
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
	
	//处理enable
	dealEnable = () => {
		let allD = this.props.editTable.getAllData(tableid);
		Utils.filterDelRows(allD.rows);
		Utils.convertGridEnablestate(allD.rows);
		this.props.editTable.setTableData(tableid, allD);
	}
    renderSearchcontent = () =>{
		return(
			<div classname="header-search-def" style={{display: 'flex'}}>
				{'org'===this.config.nodeType ?
					(
						<div className="search-box" style={{width: 220,position:'relative'}}>
							{(this.state.pk_org && this.state.pk_org.refpk)
								? '' : <span style={{color: 'red',position:'absolute',left: 3,top: 8,zIndex: 1}}>*</span>}
							{Org({
								onChange:this.onOrgChange.bind(this),
								value:this.state.pk_org,
								disabled: this.state.orgStatus,
								isMultiSelectedEnabled: false,
								queryCondition: () =>{
									return {
										AppCode: this.config.appcode,
										TreeRefActionExt:'nccloud.web.uapbd.vouchertype.util.AccountBookTreeRefExt'
									};
								}
							})}
						</div>
					)
					:('')}
				{/* 简单查询 */}
				<div className="title-search-detail" style={{paddingLeft:length,display:'inline-block'}}>
					<NCFormControl
						placeholder={this.state.json['10140VTB-000019']}/* 国际化处理： 请输入编码或名称筛选*/
						value={this.state.searchValue}
						onChange={this.onSimpleSearch.bind(this)}
						type="search"
						className="search-box"
						disabled={this.state.searchDisable}
						/>
				</div>
				{/* 显示停用  showOff*/}
				<span className='showOff' style={{marginTop: 10}}>
					<NCCheckbox
						checked={this.state.isShowOff}
						onChange={this.showOffChange.bind(this)}
						disabled={this.state.showOffDisable}
						>
						{ this.state.json['10140VTB-000020'] /* 国际化处理： 显示停用*/ }
					</NCCheckbox>
				</span>
			</div>)
	}
	render() {
		let { table, button, search,editTable,modal,BillHeadInfo } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createModal} = modal;
		let { createButtonApp } = button;
		const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
		let length = ('org'===this.config.nodeType) ? 20 : 0;
		let {appcode, pageCode} = this.config;

		let title = this.props.config['appcode']==='10140VTB' ? this.state.json['10140VTB-000016']/* 国际化处理： 凭证类别-全局*/
		: this.props.config['appcode']==='10140VTO' ? this.state.json['10140VTB-000017']/* 国际化处理： 凭证类别-核算账簿*/
		: this.state.json['10140VTB-000018'];/* 国际化处理： 凭证类别-集团*/
		
		return (
			<div className="nc-single-table">
				<HeaderArea 
					searchContent = {
						this.renderSearchcontent()
					}
					btnContent = {createButtonApp({
						area: 'list-area',
						buttonLimit: 6, 
						onButtonClick: this.onButtonClick.bind(this), 
						popContainer: document.querySelector('.header-button-area')

					})}
				/>
				{/* 列表区 */}
				<div className="nc-singleTable-table-area">
					{createEditTable(tableid, {//列表区
						//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件
						onBeforeEvent:  this.onBeforeEvent.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this),        // 控件的编辑后事件  
						useFixedHeader:true,  
						adaptionHeight:true,  
						//onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
						//onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
						selectedChange:() => {
							this.updateButtonStatus();
						},              // 选择框有变动的钩子函数
						statusChange: () => {
							this.updateButtonStatus();
						},				//表格状态监听
						showIndex:true,				//显示序号
						showCheck:true,			    //显示复选框
						//params: 'test',           // 自定义传参
						isAddRow: true, 	// 失去焦点是否自动增行
						addRowCallback: this.autoAddRow.bind(this),	// 自动增行后的回调
					})}
				</div>
				<PrintOutput
					ref='printOutput'
					url= {urls['print']}
					data={{
						funcode : this.config.nodeType==='grp'?'10140VTG':this.config.nodeType==='org'?'10140VTO':'10140VTB',//功能节点编码（模板编码）
						nodekey : null,  //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
				>
				</PrintOutput>
				<ExcelImport 
					{...Object.assign(this.props)}
					moduleName='uapbd'
					billType='vouchertype'
					appcode={appcode}
					pagecode={pageCode}
				/>
			</div>
		);
	}

}

/** 创建页面 */
export default VouchertypeTable;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65