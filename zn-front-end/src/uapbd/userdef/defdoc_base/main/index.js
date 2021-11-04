//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast ,print ,getBusinessInfo,promptBox,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
const {PrintOutput, ExcelImport} = high;
import Utils from '../../../public/utils';
import filterTableData from '../tableutil';
let { NCPopconfirm, NCModal } = base;
let { NCDropdown:Dropdown, NCIcon:Icon, NCMenu:Menu,NCDiv, NCMessage,NCCheckbox:Checkbox } = base;
let { NCCol:Col, NCRow:Row } = base;

import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
//import DefdocListRef from '../ref';
import DefdocListRef from '../../../refer/userdef/DefdocListGridRef';
let pk_org='';//列表行删除按钮需要校验数据操作权限
let searchId='defdocqry';
let oid='1001Z0100000000012LS';
import './index.less'
//节点传的参数暂时定义为此处的变量
const listpagecode = '10140UDDB_glb';//列表态页面编码
const formpagecode = '10140UDDB_treecard';//卡片态页面编码
const urls = {
	coderollback:'/nccloud/baseapp/defdoc/coderollback.do',
	addvalidator:'/nccloud/baseapp/defdoc/addvalidate.do',//新增时处理编码规则
	dellist:'/nccloud/baseapp/defdoc/dellist.do',
	queryarea:'/nccloud/baseapp/defdoc/queryarea.do',
	print:'/nccloud/baseapp/defdoc/print.do',
	enableCard:'/nccloud/baseapp/defdoc/enableCard.do',
	disableCard:'/nccloud/baseapp/defdoc/disableCard.do',
	enableList:'/nccloud/baseapp/defdoc/enableList.do',
	disableList:'/nccloud/baseapp/defdoc/disableList.do',
	loadTreeDate:'/nccloud/baseapp/defdoc/treeQuery.do',//档案树查询URL
	querylist:'/nccloud/baseapp/defdoc/query.do',//列表数据查询URL
	savelist: '/nccloud/baseapp/defdoc/savelist.do',//保存列表态数据
	queryForm: '/nccloud/baseapp/defdoc/cardquery.do',//卡片数据查询URL
	queryTemplet: '/nccloud/platform/templet/querypage.do',//模板查询URL
	delCard:'/nccloud/baseapp/defdoc/delCard.do',
	saveCard:'/nccloud/baseapp/defdoc/saveCard.do'
}; 
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};//列表态所有数据
const tableid = 'defdoclist';//列表态数据后面加载按钮事件时需要的标识
let listmeta;//列表态单据模板json数据
let formmeta;//卡片态单据模板json数据
let isedit=false;//主界面（列表或卡片界面）是否为编辑态

//编辑公式适配变量
let fmgListPageCode='';
let fmgCardPageCode='';

//对表格模板进行加工操作
function modifierMeta(props, meta) {
	//添加表格操作列
	let event = {
		label: props.config.json['10140UDDBGO-000000'],/* 国际化处理： 操作*/
		attrcode: 'opr',
		key: 'opr',
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		render(text, record, index) {
			let tableStatus = props.editTable.getStatus(tableid);
			return tableStatus == 'browse' || tableStatus == undefined ? (
				<div className="currency-opr-col" fieldid='opr'>
					<NCPopconfirm
						trigger="click"
						placement="top"
						content={props.config.json['10140UDDBGO-000001']/* 国际化处理： 确认删除?*/}
						onClose={() => {
							//列表后面的删除按钮，删除前校验数据权限
							if(pk_org!=record.values.pk_org.value){
								toast({content:props.config.json['10140UDDBGO-000002'],color:'warning'});/* 国际化处理： 只能删除该业务节点数据！*/
								return;
							}
							if (props.editTable.getStatus(tableid) === 'edit') {//编辑状态
								props.editTable.deleteTableRowsByIndex(tableid, index);
							} else {//浏览态
								let delObj = {
									rowId: index,
									status: '3',
									values: {
										ts: {
											display: props.config.json['10140UDDBGO-000003'],/* 国际化处理： 时间戳*/
											value: record.values.ts.value
										},
										pk_defdoc: {
											display: props.config.json['10140UDDBGO-000004'],/* 国际化处理： 主键*/
											value: record.values.pk_defdoc.value
										},
										pk_defdoclist: {
											display: props.config.json['10140UDDBGO-000005'],/* 国际化处理： 档案列表主键*/
											value: record.values.pk_defdoclist.value
										},
										pk_org: {
											display: props.config.json['10140UDDBGO-000006'],/* 国际化处理： 组织主键*/
											value: record.values.pk_org.value
										}
									}
								};
								let indexArr = [];
								indexArr.push(index);
								let data = {
									pageid:props.config.listpagecode,
									model: {
										areaType: 'table',
										pageinfo: null,
										rows: [delObj]
									}
								};
								ajax({
									url: urls['dellist'],
									data,
									success: function (res) {
										let { success, data } = res;
										if (success) {
											//删除成功无需返回值，效率优化问题
											props.editTable.setRowStatus(tableid,indexArr,'3');
											allTableData=props.editTable.getAllData(tableid);
											Utils.filterDelRows(allTableData.rows);
											props.editTable.deleteTableRowsByIndex(tableid, indexArr);
											props.editTable.setTableData(tableid, Utils.clone(allTableData));
											//props.editTable.deleteTableRowsByIndex(tableid, indexArr);
											toast({ title: props.config.json['10140UDDBGO-000007'], color: 'success' });/* 国际化处理： 删除成功！*/
										}
									}.bind(this)
								});
							}
						}}
					>
						<span style={{cursor:'pointer'}} className='operator'>{props.config.json['10140UDDBGO-000034']/* 国际化处理： 删除*/}</span>
					</NCPopconfirm>
				</div>
			) : (
					<div className="currency-opr-col">
						<span style={{cursor:'pointer'}} className='operator'
							onClick={() => {
								//列表后面的删除按钮，删除前校验数据权限
								if(pk_org!=record.values.pk_org.value){
									toast({content:props.config.json['10140UDDBGO-000002'],color:'warning'});/* 国际化处理： 只能删除该业务节点数据！*/
									return;
								}
								props.editTable.deleteTableRowsByIndex(tableid, index);
							}}
						>{props.config.json['10140UDDBGO-000034']/* 国际化处理： 删除*/}</span>
					</div>
				);
		}
	};
	meta[tableid].items.push(event);
	meta['defdocqry'].items.forEach(item=>{
		if(item.attrcode =='pk_org'){
			item.isRunWithChildren=true
		}
	})
	//props.renderItem('table',tableid,'creator',refer('creator'));
	return meta;
}


class Defdocbase extends Component {

	constructor(props){
		super(props);

		//为编辑和显示公式变量赋值
		fmgListPageCode=props.config.listpagecode
		fmgCardPageCode=props.config.formpagecode

		this.config =Object.assign({
            title: props.config.title,
            treeId:"epsTree",
            formId:"head",
            pageCode:"",
            nodeType:props.config.nodeType,
            isGlbGrp:'1',
            urls:urls
		},props.config);
		
		//自定义根节点
		this.root = {
			"isleaf": false,
			"key":"~",
			"title":this.config.title,
			"id":"~",
			"innercode":"~",
			"pid": "",
			"refname": this.props.config.json['10140UDDBGO-000008'],/* 国际化处理： 档案*/
			"refpk": "root"
		};	

		this.state={
			checked:false,//停启用显示逻辑
			status:'browse',//标记页面状态，控制参照查询区 的显隐性
			orgInfo:{//新增时所属组织信息，需根据不同档案区分
			},	
			exportNodeKey:'',//适配打印模板标识
			ids:[],//打印专属（需要打印数据pk）
			treepks:[],//当前选择档案类型下所有档案pk(树结构)
			defdoclist:{refpk:(props.getUrlParam('pk')?props.getUrlParam('pk'):null),refname:(props.getUrlParam('name')?props.getUrlParam('name'):null),refcode:(props.getUrlParam('code')?props.getUrlParam('code'):null),values:props.getUrlParam('isgrade')?{isgrade:{value:props.getUrlParam('isgrade')},coderule:{value:props.getUrlParam('coderule')}}:{}},//当前选择档案类型参照数据
			//defdoclist:{},
			enablestate:'2',//启用状态标记
			curOrg:{},//业务单元参照数据
			isgrade:(props.getUrlParam('isgrade')?props.getUrlParam('isgrade'):'N'),//卡片、列表标记
			pk_defdoclist:(props.getUrlParam('pk')?props.getUrlParam('pk'):'')//档案列表参照主键
		}

		this.loadMeta(props,()=>{

		});
	}

	loadMeta(props,initData){
		props.createUIDom({
			pagecode : props.config.listpagecode
		},
		(data)=>{
			listmeta = data.template;
			let pk_org = listmeta['defdocqry'].items.find(item => item.attrcode === 'pk_org');
			pk_org.isShowDisabledData=true;
			listmeta = modifierMeta(props, listmeta);

			if(data.button){
				let button = data.button;
				props.button.setButtons(button);

				let excelimportconfig = excelImportconfig(props,'riamm',props.config.billType,true,'',{appcode: props.config.appcode,pagecode: props.config.formpagecode},()=>{
					let defdoclist = this.state.defdoclist;
					let curOrg = this.state.curOrg;
					if(!defdoclist || !defdoclist.refpk || defdoclist.refpk.length==0) return;
					if(this.props.config.billType==='defdoc_org' && (!curOrg || !curOrg.refpk || curOrg.refpk.length==0) ) return;
                    this.state.isgrade=='N'?this.clickSearchBtn(this.props,{},'refresh'):this.onDocListSelect(this.state.defdoclist,'Y');
				});
				props.button.setUploadConfig("import",excelimportconfig);
				props.button.setButtons(button);
			}

			if(!props.getUrlParam('isgrade')||props.getUrlParam('isgrade')=='N'){
				props.meta.setMeta(listmeta);
			}
		},false);
	
		props.createUIDom({
			pagecode : props.config.formpagecode
		},
		(data)=>{
			formmeta = data.template;
			//设置上级档案不走缓存
			let pid = formmeta['head'].items.find(item => item.attrcode === 'pid');
			pid.isCacheable=false;
			if(props.getUrlParam('isgrade')&&props.getUrlParam('isgrade')=='Y'){
				props.meta.setMeta(formmeta);
			}
		});
	}

	componentDidMount(){
		let loginContext=getBusinessInfo();//当前登录用户信息
		if(this.props.config.nodeType=='GLOBE_NODE'){
			pk_org=this.props.config.globleorg.value;
			this.state.orgInfo=this.props.config.globleorg;
			this.setState(this.state);
		}
		if(this.props.config.nodeType=='GROUP_NODE'){
			//用户所属集团信息
			pk_org=loginContext.groupId;
			this.state.orgInfo={
				value:loginContext.groupId,
				display:loginContext.groupName
			};
			this.setState(this.state);
		}
		//加载组件时需要判断是否为自定义档案定义跳转页面，若是，需要加载数据
		if(this.state.defdoclist.refpk){
			this.onDocListSelect(this.state.defdoclist);
		}

		this.updateButtonStatus();
		this.setButtonDisable('init');//禁用所有按钮
	}

	componentDidUpdate(){

		if(this.state.isgrade=='Y'){
			//卡片处理
			if(this.props.form.getFormStatus(this.config.formId) === 'edit'||this.props.form.getFormStatus(this.config.formId) === 'add'){
				window.onbeforeunload=()=>{
					return '';
				}
			}else{
				window.onbeforeunload=null;
			}
		}else{
			//列表处理
			if(this.props.editTable.getStatus(tableid) === 'edit'||this.props.editTable.getStatus(tableid) === 'add'){
				window.onbeforeunload=()=>{
					return '';
				}
			}else{
				window.onbeforeunload=null;
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
	
	//设置列表态打印按钮可用性
	setPrintBtnDisable(){
		if(this.props.editTable.getAllData(tableid)&&this.props.editTable.getAllData(tableid).rows.length==0){
			this.props.button.setDisabled({
				print:true,
				export:true
			});
		}else{
			this.props.button.setDisabled({
				print:false,
				export:false
			});
		}
	}

	//处理按钮的可用性
	setButtonDisable(status,isgrade){
		//刚进入界面或者档案类型参照无数据时，禁用所有按钮
		if(status&&status=='init'){
			this.props.button.setDisabled({
				add:true,
				update:true,
				delete:true,
				enable:true,
				disable:true,
				print:true,
				export:true,
				refresh:true
			});
		}
		//刚切换档案类型，且为列表态时，启用所有按钮
		if(status&&status=='listselect'&&isgrade=='N'){
			this.props.button.setDisabled({
				add:false,
				update:false,
				delete:true,
				enable:true,
				disable:true,
				print:false,
				export:false,
				refresh:false
			});
		}
		//刚切换档案类型，且为卡片态时，仅启用新增、刷新按钮
		if(status&&status=='listselect'&&isgrade=='Y'){
			this.props.button.setDisabled({
				add:false,
				update:true,
				delete:true,
				enable:true,
				disable:true,
				print:true,
				export:true,
				refresh:false
			});
		}
	}
	//更新按钮状态
	updateButtonStatus(){
		if(this.state.isgrade=='Y'){
			//树卡态新增按钮始终为主要按钮
			this.props.button.setMainButton('add',true);
			if(this.props.form.getFormStatus(this.config.formId)&&this.props.form.getFormStatus(this.config.formId) != 'browse'){//编辑状态
				this.props.button.setButtonsVisible({
					add:false,
					update:false,
					delete:false,
					enable:false,
					//disable:false,
					print:false,
					//export:false,
					refresh:false,
					cancel:true,
					save:true,
                    saveadd:true,
					exporti:false,
					import:false															
				});
			}else{
				this.props.button.setButtonsVisible({
					add:true,
					update:true,
					delete:true,
					enable:true,
					//disable:false,
					print:true,
					//export:false,
					refresh:true,
					cancel:false,
					save:false,
                    saveadd:false,
					exporti:true,
					import:true
				});
			}
		}else{
			if(this.props.editTable.getStatus(tableid)&&this.props.editTable.getStatus(tableid) != 'browse'){//编辑状态
				this.props.button.setButtonsVisible({
					add:true,
					update:false,
					delete:false,
					enable:false,
					//disable:false,
					print:false,
					//export:false,
					refresh:false,
					cancel:true,
					save:true,
                    saveadd:false,
					exporti:false,
					import:false
				});
				//列表编辑态新增按钮设置为非主要按钮
				this.props.button.setMainButton('add',false);
			}else{//浏览态
				this.props.button.setButtonsVisible({
					add:true,
					update:true,
					delete:true,
					enable:true,
					//disable:false,
					print:true,
					//export:false,
					refresh:true,
					cancel:false,
					save:false,
                    saveadd:false,
					exporti:true,
					import:true
				});
				this.props.button.setMainButton('add',true);
			}
		}
	}

	//控制编辑态列表行数据的编辑性
	checkIsEdit(){
		let rowIds=[];//获取不可编辑数据的下标
		this.props.editTable.getAllData(tableid).rows.forEach((row)=>{
			if(this.state.orgInfo.value!=row.values['pk_org'].value){
				rowIds.push(row.rowid);
			}
		});
		this.props.editTable.setEditableRowByRowId(tableid,rowIds,false);
	}

	//按钮点击事件
	onButtonClick(props,id) {
		
		if(this.state.isgrade=='N'){
			//列表态按钮处理逻辑
			switch (id) {
				case 'refresh':
					//this.onDocListSelect(this.state.defdoclist,'Y',()=>{
						//toast({title:this.props.config.json['10140UDDBGO-000009'],color:'success'});/* 国际化处理： 刷新成功！*/
					//});
					this.clickSearchBtn(props,{},'refresh');//刷新相当于再点一次查询
					break;
				case 'enable':
					if(this.props.editTable.getCheckedRows(tableid).length==0){
						toast({content:this.props.config.json['10140UDDBGO-000010'],color:'warning'});/* 国际化处理： 请选择要启用的数据！*/
						return 
					}
					promptBox({
						color:'warning',
						title : this.props.config.json['10140UDDBGO-000011'],/* 国际化处理： 启用*/
						content : this.props.config.json['10140UDDBGO-000012'],/* 国际化处理： 您确认启用所选数据？*/
						beSureBtnClick : this.onEnableForList.bind(this)
					});
					break;
				case 'disable':
					if(this.props.editTable.getCheckedRows(tableid).length==0){
						toast({content:this.props.config.json['10140UDDBGO-000013'],color:'warning'});/* 国际化处理： 请选择要停用的数据！*/
						return 
					}
					promptBox({
						color:'warning',
						title : this.props.config.json['10140UDDBGO-000014'],/* 国际化处理： 停用*/
						content : this.props.config.json['10140UDDBGO-000015'],/* 国际化处理： 您确认停用所选数据？*/
						beSureBtnClick : this.onDisableForList.bind(this)
					})
					break;

				case 'add':
					//新增校验编码规则
					ajax({
						url: urls['addvalidator'],
						data: { pk_org: pk_org,defdoclistcode:this.state.defdoclist.refcode},
						success: (result) => {
							if (result.success) {
								isedit=true;
								let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
								this.props.editTable.addRow(tableid,num,true);//setValByKeyAnd
								let index=this.props.editTable.getNumberOfRows(tableid)-1;
								//加上编码规则处理
								if(result.data){
									this.props.editTable.setValByKeyAndIndex(tableid, index, "code", { value:result.data['code']});//根据编码规则生成编码
									this.props.editTable.setEditableRowKeyByIndex(tableid,index,"code",result.data['canEdit']);//根据编码规则设置编码的可编辑性
								}
								this.props.editTable.setValByKeyAndIndex(tableid, index, "pk_defdoclist", { value:this.state.pk_defdoclist});
								this.props.editTable.setValByKeyAndIndex(tableid, index, "pk_org", this.state.orgInfo);
								this.props.editTable.setValByKeyAndIndex(tableid, index, "enablestate", { value:'2',display:this.props.config.json['10140UDDBGO-000016']});/* 国际化处理： 已启用*/
								this.props.editTable.setValByKeyAndIndex(tableid, index, "datatype", { value:'1'});
								this.props.editTable.setValByKeyAndIndex(tableid, index, "pk_group", { value:this.state.pk_group});
								this.props.editTable.setValByKeyAndIndex(tableid, index, "dataoriginflag", { value:'0'});
								this.updateButtonStatus();
								this.state.status='add';
								this.setState(this.state);
								this.checkIsEdit();
							}
						}
					});
					break;
				case 'update':
					isedit=true;
					this.props.editTable.setStatus(tableid, 'edit');
					this.updateButtonStatus();
					this.state.status='edit';
					this.setState(this.state);
					this.checkIsEdit();
					break;
				case 'cancel':
					promptBox({
						color:'warning',
						title : this.props.config.json['10140UDDBGO-000017'],/* 国际化处理： 确认取消*/
						content : this.props.config.json['10140UDDBGO-000018'],/* 国际化处理： 是否确认取消？*/
						beSureBtnClick : (()=>{
							//列表态需要批量回滚编码
							this.props.editTable.filterEmptyRows(tableid,['pk_defdoclist','pk_org','enablestate','datatype','pk_group','dataoriginflag']);
							//加上前台校验逻辑
							let rollBackCodes=[];
							this.props.editTable.getChangedRows(tableid,true).forEach((row)=>{
								if(row.status=='2'&&row.values['code'].value){
									rollBackCodes.push(row.values['code'].value);
								}
							}); 
							if(rollBackCodes.length>0){
								ajax({
									url: urls['coderollback'],
									data: {'codes':rollBackCodes,'status':'add',pk_org:pk_org,defdoclistcode:this.state.defdoclist.refcode},
									success: (result) => {
									}
								});//回滚编码
							}

							isedit=false;
							this.state.status='browse';
							this.setState(this.state);
							this.props.editTable.setStatus(tableid, 'browse');
							setTimeout(() => {
								this.props.editTable.setTableData(tableid, Utils.clone(allTableData));
								let indexArr=[];//获取不可编辑数据的下标
								for(let index=0;index<this.props.editTable.getAllData(tableid).rows.length;index++){
									if(this.state.orgInfo.value!=this.props.editTable.getAllData(tableid).rows[index].values['pk_org'].value){
										indexArr.push(index);
									}
								}
								this.props.editTable.setCheckboxDisabled(tableid,indexArr,false);
								this.setPrintBtnDisable();
							},10);

							this.updateButtonStatus();
							//没选中数据，将部分按钮置灰
							this.props.button.setButtonDisabled({
								"delete":true,
								"enable":true,
								"disable":true
							});
						})
					})
					break;
				case 'save':
					this.props.editTable.filterEmptyRows(tableid,['pk_defdoclist','pk_org','enablestate','datatype','pk_group','dataoriginflag']);
					//加上前台校验逻辑
					let tableData = this.props.editTable.getChangedRows(tableid,true);
			        let rowcheced = [];
					this.props.editTable.getAllData(tableid).rows.forEach((row)=>{
						if(this.state.orgInfo.value != row.values['pk_org'].value){
							row.status = '3';
						}
						rowcheced.push(row);
					}); 					
					if(!this.props.editTable.checkRequired(tableid,rowcheced)){
						return;
					}

					//若数据没有改动，则直接返回
					if(!tableData || tableData.length === 0){
						toast({title:this.props.config.json['10140UDDBGO-000019'],color:'success'});/* 国际化处理： 保存成功！*/
						this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
						this.state.status='browse';
						this.setState(this.state);
						this.updateButtonStatus();
						break;
					} 
					let data = {
						pageid:this.props.config.listpagecode,
						model : {
							areacode:tableid,
							areaType: 'table',
							pageinfo: null,
							rows: []
						}
					};
					data.model.rows = tableData;
					let listSaveCallBack=()=>ajax({
						url: urls['savelist'],
						data,
						success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
							let { success,data} = res;
							this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
							if(data){
								//保存成功将返回数据更新到界面上即可
								allTableData=filterTableData(allTableData,data[tableid],'pk_defdoc');

								setTimeout(() => {
									this.props.editTable.setTableData(tableid, Utils.clone(allTableData));
									let indexArr=[];//获取不可编辑数据的下标
									for(let index=0;index<this.props.editTable.getAllData(tableid).rows.length;index++){
										if(this.state.orgInfo.value!=this.props.editTable.getAllData(tableid).rows[index].values['pk_org'].value){
											indexArr.push(index);
										}
									}
									this.props.editTable.setCheckboxDisabled(tableid,indexArr,false);
								},10);
								toast({title:this.props.config.json['10140UDDBGO-000019'],color:'success'});/* 国际化处理： 保存成功！*/
								this.setPrintBtnDisable();
							}
							//异步请求可能会滞后，导致按钮状态显示不正确
							this.updateButtonStatus();
							this.state.status='browse';
							this.setState(this.state);
						}.bind(this)
					});
					this.props.validateToSave(data,listSaveCallBack,{'defdoclist':'editTable'},'grid');
					break;
				case "delete":
					let selectedData=this.props.editTable.getCheckedRows(tableid);
					if(selectedData.length==0){
						toast({content:this.props.config.json['10140UDDBGO-000020'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
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
							title : this.props.config.json['10140UDDBGO-000021'],/* 国际化处理： 确认删除*/
							content : this.props.config.json['10140UDDBGO-000022'],/* 国际化处理： 您确认删除所选数据？*/
							beSureBtnClick : this.onDelForBrowse.bind(this)
						});
					}
					break;
				case 'print':
					let printParam={
						funcode:this.props.config.funcode,
						nodekey:'defdoc_list'
					};
					this.pintListFunction(printParam);
					break;
				case 'export':
					let pks=[];
					this.props.editTable.getAllData(tableid).rows.forEach((item)=>{
						pks.push(item.values['pk_defdoc'].value);
					});
					this.setState({
						exportNodeKey:'defdoc_list',
						ids : pks
					},this.refs.printOutput.open());
					break;
				case 'exporti':
					this.setState(this.state,()=>{
						this.props.modal.show('exportFileModal');
					});
					break;
				default:
					break;
			}
		}else{
			//卡片态按钮处理逻辑
			switch (id) {
				case 'enable':
					if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk){
						toast({content:this.props.config.json['10140UDDBGO-000010'],color:'warning'});/* 国际化处理： 请选择要启用的数据！*/
						return 
					}
					promptBox({
						color:'warning',
						title : this.props.config.json['10140UDDBGO-000011'],/* 国际化处理： 确认启用*/
						content : this.props.config.json['10140UDDBGO-000012'],/* 国际化处理： 您确认启用所选数据？*/
						beSureBtnClick : this.onEnableForCard.bind(this)
					})
						
					break;
				case 'disable':
					if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk){
						toast({content:this.props.config.json['10140UDDBGO-000013'],color:'warning'});/* 国际化处理： 请选择要停用的数据！*/
						return 
					}
					promptBox({
						color:'warning',
						title : this.props.config.json['10140UDDBGO-000014'],/* 国际化处理： 确认停用*/
						content : this.props.config.json['10140UDDBGO-000015'],/* 国际化处理： 您确认停用所选数据？*/
						beSureBtnClick : this.onDisableForCard.bind(this)
					});
						
					break;
				case 'refresh':
					this.onDocListSelect(this.state.defdoclist,'Y',()=>{
						toast({title:this.props.config.json['10140UDDBGO-000009'],color:'success'});/* 国际化处理： 刷新成功！*/
					});
					break;
				case 'add':
					ajax({
						url: urls['addvalidator'],
						data: { pk_org: pk_org,defdoclistcode:this.state.defdoclist.refcode},
						success: (result) => {
							if (result.success) {
								//更改按钮状态变量
								isedit=true;
								//填充默认值
								this.props.syncTree.setNodeDisable(this.config.treeId,true);//设置树不可编辑
                                this.props.form.setFormStatus(this.config.formId,'add');
								this.props.form.EmptyAllFormValue(this.config.formId);
								this.props.form.setFormStatus(this.config.formId,'edit');

								let formVal=this.props.form.getAllFormValue(this.config.formId);

								formVal.rows[0].values['pk_defdoclist'].value=this.state.pk_defdoclist;

								formVal.rows[0].values['enablestate'].value='2';

								formVal.rows[0].values['pk_org']=this.state.orgInfo;

								formVal.rows[0].values['enablestate'].display=this.props.config.json['10140UDDBGO-000016'];/* 国际化处理： 已启用*/

								formVal.rows[0].values['datatype'].value=1;

								formVal.rows[0].values['pk_group'].value=this.state.pk_group;

								formVal.rows[0].values['dataoriginflag'].value=0;

								if(formVal.rows[0].values['status']!=null){
									formVal.rows[0].values['status'].value=2;
								}

								if(this.props.syncTree.getSelectNode(this.config.treeId)&&this.props.syncTree.getSelectNode(this.config.treeId).refpk!=this.root.refpk){
									formVal.rows[0].values['pid'].value=this.props.syncTree.getSelectNode(this.config.treeId).refpk;
									formVal.rows[0].values['pid'].display=this.props.syncTree.getSelectNode(this.config.treeId).refname;
								}
								//编码规则设置
								if(result.data){
									formVal.rows[0].values['code'].value = result.data['code'];
									formVal.rows[0].values['code'].display = result.data['code'];
									this.props.form.setFormItemsDisabled(this.config.formId,{'code':!result.data['canEdit']});
								}else{
									this.props.form.setFormItemsDisabled(this.config.formId,{'code':false});
								}

								this.props.form.setAllFormValue({[this.config.formId]:formVal});
								
								this.updateButtonStatus();
								this.state.status='add';
								this.setState(this.state);
							}
						}
					});
					break;
				case 'update':
					isedit=true;
					this.props.syncTree.setNodeDisable(this.config.treeId,true);//设置树不可编辑
					this.props.form.setFormStatus(this.config.formId,'edit');
					this.updateButtonStatus();
					this.state.status='edit';
					this.setState(this.state);
					break;
				case 'cancel':
				
					promptBox({
						color:'warning',
						title : this.props.config.json['10140UDDBGO-000017'],/* 国际化处理： 确认取消*/
						content : this.props.config.json['10140UDDBGO-000018'],/* 国际化处理： 是否确认取消？*/
						beSureBtnClick : (()=>{
							let code=this.props.form.getFormItemsValue(this.config.formId,"code").value;
							if(this.state.status=='add'&&code){
								ajax({
									url: urls['coderollback'],
									data: {'codes':[code],'status':this.state.status,pk_org:pk_org,defdoclistcode:this.state.defdoclist.refcode},
									success: (result) => {
									}
								});//回滚编码
							}
							
							this.props.form.EmptyAllFormValue(this.config.formId);
			
							if(this.props.syncTree.getSelectNode(this.config.treeId)&&this.props.syncTree.getSelectNode(this.config.treeId).refpk!='root'){
								//查询节点信息
								ajax({
									url:urls['queryForm'],
									data:{pk_defdoc:this.props.syncTree.getSelectNode(this.config.treeId).refpk,enablestate:this.state.enablestate,nodeType:this.config.nodeType},
									success:(result)=>{
					
										if(result.success){
											this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
											this.props.form.setFormStatus(this.config.formId,'browse');
											this.updateButtonStatus();
										}
									}
								});
							}else{
								//没有选中项  清空所有数据
								this.props.form.EmptyAllFormValue(this.config.formId);
								this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
								this.props.form.setFormStatus(this.config.formId, 'browse');
								this.updateButtonStatus();
							}
							this.props.form.setFormStatus(this.config.formId, 'browse');
							//设置树可用
							this.props.syncTree.setNodeDisable(this.config.treeId,false);
							this.state.status='browse';
							this.setState(this.state);
						})
					});
					break;
				case 'save':
					let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
					if(!this.props.form.isCheckNow(this.config.formId)){
						return;
					}
					//适配校验公式
					formData.areacode=this.config.formId;
					if(formData.rows[0].values['pid']!=null&&formData.rows[0].values['pid'].value=='root'){
						formData.rows[0].values['pid'].value=null;
					}
					let requestParam = {
						model: formData,
						pageid: this.props.config.formpagecode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
					};
					//ajax请求
					let cardSaveCallBack=()=>ajax({
						url: urls['saveCard'],
						data: requestParam,
						success: (result) => {
							if(result.success){
								//设置表单浏览态
								this.props.form.setFormStatus(this.config.formId, 'browse');
								//设置树可用
								this.props.syncTree.setNodeDisable(this.config.treeId,false);

								this.props.form.EmptyAllFormValue(this.config.formId);
								//新增成功，设置表单默认值
								this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
								//保存成功且卡片上放上保存后的值后需要更新按钮状态
								this.updateButtonStatus();

								toast({title:this.props.config.json['10140UDDBGO-000019'],color:'success'});/* 国际化处理： 保存成功！*/

								//刷新树节点、并选择当前操作数据为选择状态
								let openTreeRef;
								if(!(result.data.head.rows[0].values['pid']&&result.data.head.rows[0].values['pid'].value)){
									openTreeRef=this.root.refpk;
								}else{
									openTreeRef=result.data.head.rows[0].values['pid'].value;
								}
								let selectTreeRef=result.data.head.rows[0].values['pk_defdoc'].value;//保存后需要被选中的树节点Pk
								let requestParam = { 
									pk_defdoclist:this.state.pk_defdoclist,
									enablestate:this.state.enablestate,
									pk_org: this.state.orgInfo.value
								};
								ajax({

									url:urls['loadTreeDate'],
									data:requestParam,
									success:(result)=>{
										if(result.success){

											let data = [Object.assign( {...this.root} , {children : result.data} )];
											//同步树  加载全部数据
											this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
											//展开节点  设置默认展开项
											this.props.syncTree.openNodeByPk(this.config.treeId, openTreeRef);
											this.props.syncTree.setNodeSelected(this.config.treeId, selectTreeRef);
                                            this.onSelectTree(selectTreeRef);
										}
									}
								});
								this.state.status='browse';
								this.setState(this.state);
							}

						}
					});
					this.props.validateToSave(requestParam,cardSaveCallBack,{'head':'form'},'form');
					break;
				case 'saveadd':
                    let formDatad = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
                    //适配校验公式
                    formDatad.areacode=this.config.formId;
                    if(formDatad.rows[0].values['pid']!=null&&formDatad.rows[0].values['pid'].value=='root'){
                        formDatad.rows[0].values['pid'].value=null;
                    }
                    let requestParamd = {
                        model: formDatad,
                        pageid: this.props.config.formpagecode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                    };
                    //ajax请求
                    let cardSaveCallBackd=()=>ajax({
                        url: urls['saveCard'],
                        data: requestParamd,
                        success: (result) => {
                            if(result.success){
                                //设置表单浏览态
                                this.props.form.setFormStatus(this.config.formId, 'browse');
                                //设置树可用
                                this.props.syncTree.setNodeDisable(this.config.treeId,false);

                                this.props.form.EmptyAllFormValue(this.config.formId);
                                //新增成功，设置表单默认值
                                this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});


                                toast({title:this.props.config.json['10140UDDBGO-000019'],color:'success'});/* 国际化处理： 保存成功！*/
                                let openTreeRefd;
                                if(!(result.data.head.rows[0].values['pid']&&result.data.head.rows[0].values['pid'].value)){
                                    openTreeRefd=this.root.refpk;
                                }else{
                                    openTreeRefd=result.data.head.rows[0].values['pid'].value;
                                }
                                let selectTreeRefd=result.data.head.rows[0].values['pk_defdoc'].value;//保存后需要被选中的树节点Pk
                                let requestParamd = {
                                    pk_defdoclist:this.state.pk_defdoclist,
                                    enablestate:this.state.enablestate,
                                    pk_org: this.state.orgInfo.value
                                };
                                ajax({

                                    url:urls['loadTreeDate'],
                                    data:requestParamd,
                                    success:(result)=>{
                                        if(result.success){

                                            let data = [Object.assign( {...this.root} , {children : result.data} )];
                                            //同步树  加载全部数据
                                            this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                                            //展开节点  设置默认展开项
                                            this.props.syncTree.openNodeByPk(this.config.treeId, openTreeRefd);
                                        }
                                    }
                                });
								this.onButtonClick(this.props,'add');
							}
							error: (result) => {
								toast({ color: "danger", content:   result.message });
							}
                        }
                    });
                    this.props.validateToSave(requestParam,cardSaveCallBackd,{'head':'form'},'form');
                    break;
				case "delete":

					if (!this.props.syncTree.getSelectNode(this.config.treeId)) {
			
						NCMessage.create({content: this.props.config.json['10140UDDBGO-000023'], color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
						return;
			
					}
					if(this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk){
						NCMessage.create({content: this.props.config.json['10140UDDBGO-000024'], color: 'warning'});//默认top/* 国际化处理： 根节点不能删除*/
						return;
			
					}
					let message = this.props.config.json['10140UDDBGO-000025']/* 国际化处理： 确认要删除所选数据吗？*/
					if(this.props.syncTree.getSelectNode(this.config.treeId).hasOwnProperty('children') && this.props.syncTree.getSelectNode(this.config.treeId).children.length>0){
						NCMessage.create({content: this.props.config.json['10140UDDBGO-000026'], color: 'warning'});//默认top/* 国际化处理： 该节点包含子节点，不允许删除！*/
						return;
					}

					promptBox({
						color:'warning',
						title: this.props.config.json['10140UDDBGO-000021'],/* 国际化处理： 确认删除*/
						content: message,
						beSureBtnClick: () => {
							let formData=this.props.form.getAllFormValue(this.config.formId);
			
							formData.rows['status'] = '3';//设置状态
							let requestParam = {
								model: formData,
								pageid: this.props.config.formpagecode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
							};

							ajax({
								url:urls['delCard'],
								data:requestParam,
								success:(result)=>{
									if(result.success){
										
										this.props.form.EmptyAllFormValue(this.config.formId);
										//调用异步树的接口，删除该树节点
										this.props.syncTree.delNodeSuceess(this.config.treeId,this.props.syncTree.getSelectNode(this.config.treeId).refpk);
			
										toast({title:this.props.config.json['10140UDDBGO-000007'],color:"success"});/* 国际化处理： 删除成功！*/
                                        
										this.onSelectTree(this.root.refpk);
										this.props.syncTree.cancelSelectedNode(this.config.treeId);

									}
			
								}
							})
						}
					});
					break;
				case 'print':
					let printParam={
						funcode:this.props.config.funcode,
						nodekey:'defdoc_tree'
					};
					this.pintTreeFunction(printParam);
					break;
				case 'export':
					this.setState({
						exportNodeKey:'defdoc_tree',
						ids : this.state.treepks
					},this.refs.printOutput.open());
					break;
				case 'exporti':
					this.setState(this.state,()=>{
						this.props.modal.show('exportFileModal');
					});
					break;
				default:
					break;
			}
		}
	}

	//输出和打印列表数据功能函数
	pintListFunction(param){
		let allData=this.props.editTable.getAllData(tableid);
		let pks=[];
		allData.rows.forEach((item)=>{
			pks.push(item.values['pk_defdoc'].value);
		});
		param.oids=pks;
		print(
			'pdf',
			urls['print'],
			param
		);
	}

	//输出和打印左树数据功能函数
	pintTreeFunction(param){
		param.oids=this.state.treepks;
		print(
			'pdf',
			urls['print'],
			param
		);
	}

	//卡片启用事件
	onEnableForCard(){
		let formData = this.props.form.getAllFormValue(this.config.formId);
		let requestParam = {
			model: formData,
			pageid: this.props.config.formpagecode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
		};
		ajax({
			url: urls['enableCard'],
			data:requestParam,
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success,data} = res;
				if(success){
					toast({title:this.props.config.json['10140UDDBGO-000027'],color:'success'});/* 国际化处理： 启用成功！*/
					this.onDocListSelect(this.state.defdoclist,'Y');
				}
			}.bind(this)
		});
	}

	//卡片停用事件
	onDisableForCard(){
		let formData = this.props.form.getAllFormValue(this.config.formId);
		let requestParam = {
			model: formData,
			pageid: this.props.config.formpagecode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
		};
		ajax({
			url: urls['disableCard'],
			data:requestParam,
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success,data} = res;
				if(success){
					toast({title:this.props.config.json['10140UDDBGO-000028'],color:'success'});/* 国际化处理： 停用成功！*/
					this.onDocListSelect(this.state.defdoclist,'Y');
				}
			}.bind(this)
		});
	}

	//列表启用事件
	onEnableForList(){
		let selectedTableData=this.props.editTable.getCheckedRows(tableid);
		let data = {
			pageid:this.props.config.listpagecode,
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
			url: urls['enableList'],
			data,
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success,data} = res;
				if(success){
					toast({title:this.props.config.json['10140UDDBGO-000027'],color:'success'});/* 国际化处理： 启用成功！*/
					this.onDocListSelect(this.state.defdoclist,'Y');
				}
			}.bind(this)
		});
	}

	//列表停用确定事件
	onDisableForList(){
		let selectedTableData=this.props.editTable.getCheckedRows(tableid);
		let data = {
			pageid:this.props.config.listpagecode,
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
			url: urls['disableList'],
			data,
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success,data} = res;
				if(success){
					toast({title:this.props.config.json['10140UDDBGO-000028'],color:'success'});/* 国际化处理： 停用成功！*/
					this.onDocListSelect(this.state.defdoclist,'Y');
				}
			}.bind(this)
		});
	}

	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: val.data.values
			};
			delObj.rowId=val.data.rowId;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid:this.props.config.listpagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['dellist'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					//删除成功无需返回值，效率优化问题
					this.props.editTable.setRowStatus(tableid,indexArr,'3');
					allTableData=this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allTableData.rows);
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
					this.props.editTable.setTableData(tableid, Utils.clone(allTableData));
					toast({title:this.props.config.json['10140UDDBGO-000007'],color:'success'});/* 国际化处理： 删除成功！*/
					this.setPrintBtnDisable();
				}
			}
		});
	}

	onDocListSelect(listvalue,isrefresh,prompt){
		if(this.props.config.nodeType=='ORG_NODE'){
			if(!this.state.orgInfo['value']){
				//清除界面数据(根据isgrade字段判断即可)
				if(this.state.isgrade=='Y'){
					this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
					//清空树
					let data = [Object.assign( {...this.root} , {children : []} )];
					//同步树  加载全部数据
					this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
					//展开节点  设置默认展开项
					this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
				}else{
					allTableData={rows:[]};
					this.props.editTable.setTableData(tableid, {rows:[]});
				}
				this.setState({isgrade:isgrade,pk_defdoclist:listvalue.refpk,defdoclist:listvalue});
				this.setButtonDisable('init');//更改按钮状态
				return ;
			}
		}
		let isnull=true;
		for(let isgrade in listvalue){
			isnull=false;
		}
		if(isnull){
			this.setState({pk_defdoclist:'',defdoclist:{}});//参照没有选择数据，需要清掉参照默认值
			//清除界面数据(根据isgrade字段判断即可)
			if(this.state.isgrade=='Y'){
				//this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
				//清空树
				let data = [Object.assign( {...this.root} , {children : []} )];
				//同步树  加载全部数据
				this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
				//展开节点  设置默认展开项
				this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
			}else{
				allTableData={rows:[]};
				this.props.editTable.setTableData(tableid, {rows:[]});
			}
			this.setButtonDisable('init');//更改按钮状态
			return;
		}
		let isgrade=listvalue.values['isgrade'].value;
		let meta=isgrade=='Y'?formmeta:listmeta;
		//当页面为自定义 档案定义打开时，此时元数据尚未加载
		// if(meta){
		// 	this.props.meta.setMeta(meta);
		// }
		this.root.refname=listvalue.refname;
		this.setState({isgrade:isgrade,pk_defdoclist:listvalue.refpk,defdoclist:listvalue});
		//如果需要加载树，在此处加载
		if(isgrade=='Y'){
			//设置上级档案的查询条件
			// if(meta){
			// 	meta[this.config.formId].items.map((item)=>{
			// 		if(item.attrcode=="pid"){
			// 			item.queryCondition=()=>{
			// 				return {pk_defdoclist:this.state.pk_defdoclist}
			// 			}
			// 		}
			// 	});
			// 	this.props.meta.setMeta(meta);
			// }
			let requestParam = { 
				pagecode:this.props.config.formpagecode,
				pk_defdoclist:listvalue.refpk,
				enablestate:this.state.enablestate,
				pk_org: this.state.orgInfo.value
			};

			ajax({
				url:urls['loadTreeDate'],
				data:requestParam,
				success:(result)=>{
					this.dealDocListSelectModal(result,(result)=>{
						let { success, data } = result;
						
						if(success){
							//编码规则级次
							if(listvalue.values['coderule'].value&&listvalue.values['coderule'].value.length>0){
								this.root.refname=listvalue.refname+'（'+this.props.config.json['10140UDDBGO-000043']+listvalue.values['coderule'].value+'）';
							}else{
								this.root.refname=listvalue.refname;
							}
							this.root.children = data;
							
							let data1 = this.dealTreeData([this.root]);
							//同步树  加载全部数据
							this.props.syncTree.setSyncTreeData(this.config.treeId , data1);
							//展开节点  设置默认展开项
							this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
							if(!isrefresh||isrefresh!='Y'){
								//若是类别切换，需清除卡片数据,避免切换上出现业务逻辑问题
								this.props.form.EmptyAllFormValue(this.config.formId);
								this.props.syncTree.cancelSelectedNode(this.config.treeId);
							}
							if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
								this.props.form.EmptyAllFormValue(this.config.formId);
							}else{
								this.props.syncTree.openNodeByPk(this.config.treeId, this.props.syncTree.getSelectNode(this.config.treeId).pid);
								this.onSelectTree(this.props.syncTree.getSelectNode(this.config.treeId).refpk);
								this.props.syncTree.setNodeSelected(this.config.treeId, this.props.syncTree.getSelectNode(this.config.treeId).refpk);
							}
							//如果刷新成功，需要给出提示
							if(prompt&&(prompt instanceof Function)){
								prompt();
							}
						}
						this.updateButtonStatus();//更改按钮状态
						this.setButtonDisable('listselect',isgrade);
					});
				}
			});
		}else{
			let pk_defdoclist=listvalue.refpk;
			//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
			ajax({
				url: urls['querylist'],
				data:{
					"pk_defdoclist":pk_defdoclist,
					"enablestate":this.state.enablestate,
					"pk_org":this.state.orgInfo.value//主组织信息
				},
				success: (res) => {
					this.dealDocListSelectModal(res,(res)=>{
						let { success, data } = res;
						if (success) {
							if(!data){
								//没有查出数据。则清空界面数据
								allTableData={rows:[]};
								this.props.editTable.setTableData(tableid, {rows:[]});
								
								//如果刷新成功，需要给出提示
								if(prompt&&(prompt instanceof Function)){
									prompt();
								}
							}else{
								//适配显示公式
								if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
									this.props.dealFormulamsg(
										res.formulamsg,
										{
											tableid:"editTable"
										}
									);
								}
								allTableData = data[tableid];
								this.props.editTable.setTableData(tableid, Utils.clone(allTableData));
								//复选框需要禁用非该业务节点数据
								let indexArr=[];//获取不可编辑数据的下标
								for(let index=0;index<this.props.editTable.getAllData(tableid).rows.length;index++){
									if(this.state.orgInfo.value!=this.props.editTable.getAllData(tableid).rows[index].values['pk_org'].value){
										indexArr.push(index);
									}
								}
								this.props.editTable.setCheckboxDisabled(tableid,indexArr,false);
								//如果刷新成功，需要给出提示
								if(prompt&&(prompt instanceof Function)){
									prompt();
								}
							}
						}
						this.updateButtonStatus();//更改按钮状态
						this.setButtonDisable('listselect',isgrade);
						this.setPrintBtnDisable();
					});
				}
			});
		}
	}

	//选择档案定义参照后触发加载列表模板数据或树卡模板数据事件
	dealDocListSelectModal(result,callback){
			//请求加载树形参照数据和模板数据，因为每个自定义档案的自定义项不一样，需要重新加载界面
		let pagecodes = this.props.config.formpagecode;
		if(this.state.isgrade!='Y'){
			 pagecodes = this.props.config.listpagecode;

		}
		this.props.createUIDom({
			pagecode : pagecodes
		},
		(data)=>{
			if(this.state.isgrade!='Y'){
				listmeta = data.template;
				this.props.meta.setMeta(listmeta,()=>{
					callback&&callback(result);
				});
			}else{
				var formnew = formmeta['head'].items.slice(0,19);
				//formmeta['head'].items = formnew.concat(data.template['defdoclist'].items.slice(19));
				formmeta[this.config.formId].items.map((item)=>{
					if(item.attrcode=="pid"){
						item.queryCondition=()=>{
							return {pk_defdoclist:this.state.pk_defdoclist}
						}
					}
				});
				this.props.meta.setMeta(formmeta,()=>{
					callback&&callback(result);
				});
			}
			
		},false);
	}

	/**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
		//为卡片态打印功能支持
		let treedatapks=[];
		let rootrefpk=this.root.refpk;
		let getAllTreePk=function(item){
			//处理树结构数据，需要添加afterName字段属性
			item.beforeName=item.code?(item.code+'  '):'';

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
		this.state.treepks=treedatapks;

        let deleteDataChildrenProp = function(node){
            if(!node.children || node.children.length == 0) {

                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		let length = this.props.editTable.getNumberOfRows(moduleId);
		if(((length-1)===index)&&data.status==='2'){
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
							props.editTable.setTableData(moduleId, Utils.clone(allTableData));
						}
					}else{
						this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,'isgrade',{value:!(data.values['isgrade'].value)});
					}
				}
			});
		}
	}

	/**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk){

        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(this.config.formId);
        if(status == 'edit'){
            return;
        }

        if(refpk == this.root.refpk){
            //清空表单
			this.props.form.EmptyAllFormValue(this.config.formId);
			//选中的如果是根节点，则仅启用新增和刷新按钮
			this.setButtonDisable('listselect','Y');
            return;
		}
		//选中的不是根节点，则启用所有按钮
		this.props.button.setDisabled({
			add:false,
			update:false,
			delete:false,
			enable:false,
			disable:false,
			print:false,
			export:false,
			refresh:false
		});
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        ajax({
            url:urls['queryForm'],
            data:{pk_defdoc:refpk},
            success:(result)=>{
                if(result.success){
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
					this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});

					//控制卡片数据的按钮启用状态
					let canEdit=true;

					if (result.data && result.data[this.config.formId]) {
						//适配显示公式
						if(result.formulamsg&&result.formulamsg instanceof Array&&result.formulamsg.length>0){
							this.props.dealFormulamsg(
								result.formulamsg,
								{
									"head":"form"
								}
							);
						}
						
                        result.data[this.config.formId].rows.forEach((row) => {
							//判断数据维护权限
							if (this.state.orgInfo.value!=row.values['pk_org'].value) {
								canEdit=false;//如果选择的数据为该节点无更改权限的数据，需要修改canEdit标记，用于控制按钮的可用性
							}

                            //判断启用状态，设置停启用按钮的可用性
                            if (row.values['enablestate'].value == 2) {
                                this.props.button.setDisabled({
                                    enable: true,
                                    disable: false
                                });
                            } else {
                                this.props.button.setDisabled({
                                    enable: false,
                                    disable: true
                                });
                            }
						});
					}

					if(canEdit){
						this.props.button.setDisabled({
							update:false,
							delete:false
						});
					}else{
						this.props.button.setDisabled({
							update:true,
							delete:true
						});
					}

                }
            }
        });
    }

	/**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key){
        //设置
        if(key === this.root.refpk){
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj );
        }

	}

	//停用启用checkbox值变化事件
	onCheckBoxChange(checked){
		this.state.checked=!this.state.checked;
		this.setState(this.state);
		if(!this.state.checked){
			this.setState({enablestate:'2'});
		}else{
			this.setState({enablestate:'-1'});//-1标识显示所有，2标识显示启用
		}
		
		if(!this.state.defdoclist.refpk){
			return;
		}
		setTimeout(() => {
			let isgrade = this.state.isgrade;//树卡页面时值为'Y'，列表页面时值为'N'
			if(isgrade=='N'){//列表页面
				//停启用和查询去查询条件作并集
				let queryCondition=this.props.search.getAllSearchData(searchId)
				this.clickSearchBtn(this.props,queryCondition);
			}
			else{//树卡页面
				this.onDocListSelect(this.state.defdoclist);
			}
		}, 10);
		
	}

	//查询区事件处理
	clickSearchBtn = (props,searchVal,type)=>{
		searchVal=this.props.search.getQueryInfo(searchId);
		//处理没有选择档案类型或业务单元的提示信息
		if((!this.state.pk_defdoclist)||this.state.pk_defdoclist.length==0){
			toast({content:this.props.config.json['10140UDDBGO-000030'],color:"warning"});/* 国际化处理： 请先选择档案类型！*/
			return;
		}
		if(this.props.config.nodeType=='ORG_NODE'&&((!this.state.curOrg.refpk)||this.state.curOrg.refpk.length==0)){
			toast({content:this.props.config.json['10140UDDBGO-000031'],color:"warning"});/* 国际化处理： 请选择业务单元！*/
			return;
		}

		searchVal.custcondition={
			conditions:[
				{field:'pk_defdoclist',oprtype:'=',value:{firstvalue:this.state.pk_defdoclist}},
				{field:'enablestate',oprtype:'=',value:{firstvalue:this.state.enablestate}},
				{field:'pk_org',oprtype:'=',value:{firstvalue:this.state.orgInfo.value}},
				{field:'pk_defdoclist',oprtype:'=',value:{firstvalue:this.state.pk_defdoclist}}
			],
			logic:'and'
		};
		searchVal.pagecode=props.config.listpagecode;
        /*let data = {
			//加上全局查询条件
			pagecode:props.config.listpagecode,
            querycondition: searchVal==null?null:searchVal,
            queryAreaCode:searchId,  //查询区编码
            //oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype:'tree',
			custcondition:{
				conditions:[
					{field:'pk_defdoclist',oprtype:'=',value:{firstvalue:this.state.pk_defdoclist}},
					{field:'enablestate',oprtype:'=',value:{firstvalue:this.state.enablestate}},
					{field:'pk_org',oprtype:'=',value:{firstvalue:this.state.orgInfo.value}},
					{field:'pk_defdoclist',oprtype:'=',value:{firstvalue:this.state.pk_defdoclist}}
				],
				logic:'and'
			}
        };*/

        ajax({
            url:urls['queryarea'],
            data:searchVal,
            success: (res) => {
                if(res.success&&res.data){
					allTableData = res.data[tableid];
					props.editTable.setTableData(tableid, Utils.clone(allTableData));
					if(type&&type=='refresh'){
						toast({title:this.props.config.json['10140UDDBGO-000009'],color:'success'});/* 国际化处理： 刷新成功！*/
					}else{
						toast({content:this.props.config.json['10140UDDBGO-000032']+res.data[tableid].rows.length+this.props.config.json['10140UDDBGO-000033'],color:"success"});/* 国际化处理： 查询成功，共,条。*/
					}
                }else{
					allTableData = {rows:[]};
                    props.editTable.setTableData(tableid, {rows:[]});
					if(type&&type=='refresh'){
						toast({title:this.props.config.json['10140UDDBGO-000009'],color:'success'});/* 国际化处理： 刷新成功！*/
					}else{
						toast({content:this.props.config.json['10140UDDBGO-000029'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
					}
				}
				this.setPrintBtnDisable();
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }

	onOrgChange(value){
		pk_org=value.refpk;
		//业务单元节点需要加载一次数据
		this.setState({
			curOrg:value,
			orgInfo:{
				value:value.refpk,
				display:value.refname
			}
		})
		setTimeout(() => {
			this.onDocListSelect(this.state.defdoclist);
		}, 10);
	}

	//行数据选中事件（用于判断删除按钮是否可用）
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
		}else{
			this.props.button.setDisabled({
				delete:true,
				enable:true,
				disable:true
			});
		}
	}

	//自动增行填充默认值
	addRowCallback(){
		let index=this.props.editTable.getNumberOfRows(tableid)-1;
		this.props.editTable.setValByKeyAndIndex(tableid, index, "pk_defdoclist", { value:this.state.pk_defdoclist});
		this.props.editTable.setValByKeyAndIndex(tableid, index, "pk_org", this.state.orgInfo);
		this.props.editTable.setValByKeyAndIndex(tableid, index, "enablestate", { value:'2',display:this.props.config.json['10140UDDBGO-000016']});/* 国际化处理： 已启用*/
		this.props.editTable.setValByKeyAndIndex(tableid, index, "datatype", { value:'1'});
		this.props.editTable.setValByKeyAndIndex(tableid, index, "pk_group", { value:this.state.pk_group});
		this.props.editTable.setValByKeyAndIndex(tableid, index, "dataoriginflag", { value:'0'});
	}

	render() {

		const {syncTree,button,modal,editTable,DragWidthCom,form,search,BillHeadInfo} = this.props;
		const {createBillHeadInfo} = BillHeadInfo;
		const {createForm}=form;

		const {createSyncTree}=syncTree;

		const {createButton}=button;
		
		let { createButtonApp } = button;

		let { createModal } = modal;  //模态框
		
		let { createEditTable } = editTable;  //模态框

		let { NCCreateSearch } = search;

		let nodeType=this.config.nodeType;

		let queryDocListCondition=function(){
			
			return {'nodeType':nodeType}
		}
		let appcode=this.props.config.appcode;
		let orgPermCondition=function(){
            return {
                AppCode:appcode,
                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
            }
        }
		return(
			<div className="nc-bill-list" >
				{createModal('modal', { noFooter: false })}
				{/* 头部 header*/}
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
					{/* 标题 title*/}
                    <div className="header-title-search-area">
                        {/*<h2 className="title-search-detail" style={{ fontSize: '16px' }}>{this.props.config.title}</h2>*/}
						{createBillHeadInfo({
							title:this.props.config.title,
							initShowBackBtn:false
						})}
				    </div>
					
					{/*档案列表参照*/}
					<div className="search-box">

						{/*手动添加必输标识-红色星号*/}
						<span style={{marginTop: 9,zIndex: 1000,float: 'left',position: 'relative',color: 'red'}}>
							<span style={{position:'absolute',left:17}}>*</span>
						</span>

						<Col md={8} xs={8} sm={8}>
							{DefdocListRef({
								fieldid:"defdoclist",
								disabled:this.state.status=='browse'?false:true,//是否禁用
								onChange:this.onDocListSelect.bind(this),
								value:this.state.defdoclist,
								queryCondition:queryDocListCondition})}
						</Col>
					</div>
					{this.props.config.nodeType=='ORG_NODE'?
						<div className="search-box">
                        {BusinessUnitTreeRef({
							fieldid:"BusinessUnitTree",
							disabled:this.state.status=='browse'?false:true,//是否禁用
							isTreelazyLoad:false,
							queryCondition:orgPermCondition,
                            onChange:this.onOrgChange.bind(this),
                            value:this.state.curOrg
                        })}
                    </div>
						:
						''}

					{<span className="showOff">
						<Checkbox
							disabled={this.state.status=='browse'?false:true}
							defaultChecked={false}
							checked={this.state.checked}
							onChange={this.onCheckBoxChange.bind(this)}
							size="lg"
						>
							{this.props.config.json['10140UDDBGO-000035']/* 国际化处理： 显示停用*/}
							</Checkbox>
					</span>}

					
					{/* 按钮组 btn-group*/}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_btn',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</NCDiv>
				{/* 单表区/树卡区域 */}
				<div className="nc-bill-search-area" style={{display:this.state.isgrade!='Y'&&this.state.status=='browse'&&this.state.pk_defdoclist?'':'none'}}>
					{NCCreateSearch(searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this)
					})}
				</div>
				{this.state.isgrade!='Y'?
					<div className="nc-bill-table-area ">
						{createEditTable(tableid, {//列表区
							isAddRow:false,//由于档案存在编码规则，不再自动增行
							addRowCallback:this.addRowCallback.bind(this),
							onAfterEvent: this.onAfterEvent.bind(this),                  // 控件的编辑后事件  
							useFixedHeader:true,
							onSelected:this.onRowDataSelect.bind(this),
							onSelectedAll:this.onRowDataSelect.bind(this),//全选中仅存在删除按钮的禁用启用逻辑，如果其他逻辑，再定函数
							showIndex:true,				//显示序号
							showCheck:true,			//显示复选框
							adaptionHeight:true
						})}
					</div>
				:
                <div className="tree-card">
                    <DragWidthCom
                         // 左树区域
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId :this.config.treeId,
                                    needEdit: false, //不启用编辑
                                    showLine: false, //显示连线
									disabledSearch:this.state.status=='browse'?false:true,
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                    showModal:false
                                })}
                            </div>}     //左侧区域dom
                         // 右卡片区域
                        rightDom = {
                            <div className="card-area">
                                {createForm(this.config.formId, {
                                    //onAfterEvent: this.onAfterFormEvent.bind(this)//编辑后事件，主要处理上级档案字段
                                },true)
                                }
                            </div> }     //右侧区域dom

                        defLeftWid = '20%'      // 默认左侧区域宽度，px/百分百
                    />
                </div>}
				<PrintOutput
					ref='printOutput'
					url={urls['print']}
					data={{
						funcode : this.props.config.funcode,
						nodekey : this.state.exportNodeKey,
						oids : this.state.ids,
						outputType : 'output'
					}}
				/>
				<ExcelImport
					{...this.props}
					moduleName ='riamm'//模块名
					billType = {this.props.config.billType}//单据类型
					selectedPKS = {[]}
					appcode={this.props.config.appcode}
					pagecode={this.props.config.formpagecode}
				/>
			</div>
		)

	}

}

Defdocbase = createPage({
	billinfo:[{
        billtype:'grid',
        pagecode:fmgListPageCode,
        bodycode:tableid
    },{
        billtype:'form',
        pagecode:fmgCardPageCode,
        headcode:"head"
    }],
	initTemplate: ()=>{}
})(Defdocbase);
export default Defdocbase;



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65