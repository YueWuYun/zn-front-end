//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,promptBox ,cacheTools,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal,NCBackBtn,NCAffix } = base;
const { NCDropdown:Dropdown, NCIcon:Icon, NCMenu:Menu, NCButton:Button }=base;
const { ExcelImport } = high;
const { NCDiv } = base;
import '../../../refer/pubinfo/AccPeriodSchemeDefaultTreeRef/index.js';
import '../../../refer/fiacc/AccSystemGridRef/index.js';
import '../../../refer/fiacc/FactorRefModelWithSystemGridRef/index.js';
import '../../../refer/pubinfo/CurrtypeGridRef/index.js';
import UnitOrg from '../unitorg';
import SOBCard from '../card';
import './index.less'
let formId = 'setofbook';//卡片组件Id
let formPageCode="10100SOB_sobcard";
const searchId = 'sobquery';
const appid='0001Z010000000000IEL';
const tableid = 'setofbook';
const pagecode = '10100SOB_setofbook';
const billType = 'setofbook';
const urls = {
	datapermission:'/nccloud/uapbd/setofbook/datapermission.do',
	deleteList:'/nccloud/uapbd/setofbook/deletelist.do',
	deleteCard:'/nccloud/uapbd/setofbook/deletecard.do',
	queryCard:'/nccloud/uapbd/setofbook/querycard.do',
	sobquery:'/nccloud/uapbd/setofbook/sobquery.do',
	save : '/nccloud/uapbd/setofbook/save.do',
	query : '/nccloud/uapbd/setofbook/query.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['doclevel','isgrade','isrelease','mngctlmode'];  //过来空行时，忽略的字段

class SingleTable extends Component {
	constructor(props) {
		super(props);
		//this.config =Object.assign({},props.config);
		this.props = props;
		this.props.button.setButtonsVisible({
			addButton: false,
			editButton: false,
			saveButton: false,
			cancelButton: false,
			delButton: false
		});
		this.state={
			json:{},//多语资源文件数据
			formstate:'',//标识卡片态编辑状态，用于显示返回箭头
			formCurrState:'browse',//标识卡片当前数据状态,用于控制浏览器关闭时的提示
			formData:{
				toFormStatus:'browse',//跳转到卡片态的状态
				selectData:{}//列表态选中行数据
			},
			isList:'Y',//是否列表
			searchValue:'',
			searchDisable:false,				//简单搜索框是否禁用	true：禁用		false：可用
			moreButton:true,				//更多按钮状态
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false,				//列表是否显示停用数据
			langCode:''
		}

		//加载多语资源
		this.initPage(
			props,
			pagecode,
			'10100SOB',//多语资源编码
			()=>{
				props.button.setPopContent('delOpr',this.state.json['10100SOB-000001'],/* 国际化处理： 操作*/) /* 设置操作列上删除按钮的弹窗提示 */
				return this.modifierMeta(props, this.props.meta.getMeta(),this)
			},
			()=>{
				// this.getData();
				// this.updateButtonStatus();
				//适配组织机构图跳转数据
				//从URL中偶去参数
				var pk_setofbook = this.props.getUrlParam("pk_setofbook");
				if(pk_setofbook){
					this.setState({
						isLinkFromUrl:true,
						formstate:'browse',//设置卡片为浏览态
						isList:'N',
						formData:{
							toFormStatus:'browse',
							selectData:{}
						}
					},()=>{
						this.props.button.setButtonsVisible({
							add: false,
							edit: false,
							save: false,
							saveAdd:false,
							cancel: false,
							unitorg:false,
							del: false,
							more:false,
							refresh:false,
							export:false,
							import:false
						});

						this.SOBCard.form.EmptyAllFormValue(formId);
						ajax({
							url: urls['queryCard'],//urls['queryCard'],
							data:{pk_setofbook:pk_setofbook},
							success:  (res)  =>{     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									//适配显示公式
									if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
										this.props.dealFormulamsg(
											res.formulamsg,
											{
												"setofbook":"form"
											}
										);
									}
									if(data){
										this.SOBCard.form.setAllFormValue({[formId]:data[formId]});
									}
								}
							}
						});
					});
				}else{
					this.getData();
					this.updateButtonStatus();
				}



			},
			this
		);
	}

	//初始化应用页面（加载多语，初始化模板，加工模板数据，初始化节点数据）
	initPage(props,pageCode,nodeResourceCode,modifierMeta,initData,_this){
		let callback=(json,status,inlt)=>{
			_this.setState({json:json});
			props.createUIDom(
				{
					pagecode: pageCode
				}, 
				function (data){
					if(data){
						//获取多语语种
						_this.state.langCode = data.context.currentLangSeq;
						if(data.button){
							let button = data.button;
							props.button.setButtons(button);
							debugger;
							let excelimportconfig = excelImportconfig(props,'riaorg','setofbook',true,'',{appcode: '10100SOB',pagecode: "10100SOB_sobcard"},()=>{_this.getData();});
							props.button.setUploadConfig("import",excelimportconfig);
							props.button.setButtons(data.button);
						}
						if(data.template){
							let meta = data.template;
							props.meta.setMeta(meta);//设置两次，用于回调使用
							if(modifierMeta instanceof Function){
								meta=modifierMeta(data);
								if(meta){
									props.meta.setMeta(meta);
								}
							}                       
						}
						if(initData instanceof Function){
							initData();
						}
					}   
				}
			)
		}
		props.MultiInit.getMultiLang({moduleId:nodeResourceCode,/*currentLocale:'zh-CN',*/domainName:'uapbd',callback});
	}

	//对表格模板进行加工操作
	modifierMeta(props,meta,_this) {
		let event = {
			label: this.state.json['10100SOB-000002'],/* 国际化处理： 操作*/
			attrcode: 'opr',
			key: 'opr',
			fixed: 'right',
			itemtype: 'customer',
			visible:true,
			render(text, record, index ,key) {
				let buttonAry = [];
					buttonAry =['editOpr','delOpr'];
					return props.button.createOprationButton(buttonAry, {
						area: 'table-opr-button',
						buttonLimit: 2,
						onButtonClick: ((props,id)=>{
							switch (id) {
								//行修改事件
								case 'editOpr':
									setTimeout(() => {
										_this.onRowClick(props,tableid,record,index);
									},10);
									_this.onButtonClick(props,'edit');
									break;
								//行删除事件
								case 'delOpr':
									setTimeout(() => {
										_this.onRowClick(props,tableid,record,index);
									},10);
									_this.onButtonClick(props,'delOpr');
									break;
							}
						})
					});
			}
		};
		meta[tableid].items.push(event);
		//props.meta.setMeta(meta);
		return meta;
	}
	
	//请求列表数据
	getData = (prompt) => {
		let showOff = this.state.isShowOff;
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:{
				"pagecode": pagecode,
				"showOfff":showOff
			},
			success: (res) => {
				let { success, data } = res;
				let pks=[];
				if (success&&res.data) {
					//适配显示公式
					if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
						this.props.dealFormulamsg(
							res.formulamsg,
							{
								tableid:"editTable"
							}
						);
					}

					res.data[tableid].rows.forEach((item)=>{
						pks.push(item.values['pk_setofbook'].value);
					});
					allTableData = data[tableid];
					this.props.editTable.setTableData(tableid, data[tableid]);
					this.setState({
						formData:{
							toFormStatus:'browse',//跳转到卡片态的状态
							selectData:data[tableid].rows[0].values
						}
					});//每次加在数据默认选中第一行
					this.props.editTable.focusRowByIndex(tableid,0);
					//如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}
				}else{
					this.setState({
						formData:{
							toFormStatus:'browse',//跳转到卡片态的状态
							selectData:{}//data[tableid].rows[data[tableid].rows.length - 1].values//列表态选中行数据
						}
					});//没有数据，则初始化选中值
					allTableData={rows:[]};
					props.editTable.setTableData(tableid, {rows:[]});
					//如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}
				}
				cacheTools.set('allpks',pks);
			}
		});
	};

	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		let length = this.props.editTable.getNumberOfRows(moduleId);
		if(((length-1)===index)&&data.status==='2'){
			this.props.editTable.filterEmptyRows(tableid,keys);
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
							props.editTable.setTableData(moduleId, allData);
						}
					}else{
						this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,'isgrade',{value:!(data.values['isgrade'].value)});
					}
				}
			});
		}
	}

	//更新按钮状态
	updateButtonStatus(formStatus){
		if(!formStatus){
			this.props.button.setButtonsVisible({
				add: true,
				edit: true,
				del: true,
				save: false,
				saveAdd:false,
				cancel: false,
				unitorg:true,
				more:true,
				refresh:true,
				export:true,
				import:true
			});		
		}else{
			if(formStatus!='browse'){//编辑状态
				this.props.button.setButtonsVisible({
					add: false,
					edit: false,
					save: true,
					saveAdd:true,
					cancel: true,
					unitorg:false,
					del: false,
					more:false,
					refresh:false,
					export:false,
					import:false
				});
			}else{//浏览态
				this.props.button.setButtonsVisible({
					add: true,
					edit: true,
					del: true,
					save: false,
					saveAdd:false,
					cancel: false,
					unitorg:true,
					more:true,
					refresh:true,
					export:false,
					import:false
				});
			}
		}
		//列表态不再显示修改和删除按钮
		if(this.state.isList=='Y'){
			this.props.button.setButtonsVisible({
				edit: false,
				del: false
			})
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

	//处理卡片态数据联动情况
	modifierFormMeta(meta,formData,formStatus){
		//下面的逻辑为根据是否选择测无核算账簿来判断科目体系是否必输
		let isaccountbook=formData['isaccountbook'];
		let isliabilitybook=formData['isliabilitybook'];
		let pk_accperiodscheme=formData['pk_accperiodscheme'];
		if(formStatus=='add'){
			meta[formId].items.map((item)=>{
				if(item.attrcode=="pk_accsystem"){
					item.required=false;
					item.disabled=true;
					this.props.form.setFormItemsDisabled(formId,{'pk_accsystem':true});
				}
			});
			meta[formId].items.map((item)=>{
				if (item.attrcode == 'pk_checkelemsystem') {
					item.required = false;
					this.props.form.setFormItemsValue(formId,item);
				}
			});
		}
		if(formStatus=='edit'){
			if(!isaccountbook||!isaccountbook.value||!pk_accperiodscheme||!pk_accperiodscheme.value){
				meta[formId].items.map((item)=>{
					if(item.attrcode=="pk_accsystem"){
						item.required=false;
						item.disabled=true;
						this.props.form.setFormItemsDisabled(formId,{'pk_accsystem':true});
					}
				});
			}else{
				meta[formId].items.map((item)=>{
					if(item.attrcode=="pk_accsystem"){
						item.required=true;
						item.disabled=true;
						this.props.form.setFormItemsDisabled(formId,{'pk_accsystem':false});
					}
				});
			}

			if(isliabilitybook && isliabilitybook.value==true){
                meta[formId].items.map((item)=>{
                    if (item.attrcode == 'pk_checkelemsystem') {
                        item.required = true;
                        this.props.form.setFormItemsValue(formId,item);
                    }
                });
            }else{
                meta[formId].items.map((item)=>{
                    if (item.attrcode == 'pk_checkelemsystem') {
                        item.required = false;
                        this.props.form.setFormItemsValue(formId,item);
                    }
                });
            }
		}
		return meta;
	}

	//按钮点击事件
	onButtonClick(props,id) {
		let formId='setofbook';
		switch (id) {
			case 'saveAdd':
				//form表单必输项校验
				if(!this.SOBCard.form.isCheckNow(formId)){
					//toast({color:'danger',content:'请输入必输项！'});
					return;
				}
				let formData1 = this.SOBCard.form.getAllFormValue(formId);//获得表单信息
				//适配校验公式
				formData1.areacode=formId;
				//校验财务核算账簿和责任核算账簿是否有勾选
				if((!formData1.rows[0].values['isaccountbook'].value)&&(!formData1.rows[0].values['isliabilitybook'].value)){
					toast({color:'danger',content:this.state.json['10100SOB-000003']});/* 国际化处理： 请勾选财务核算账簿！*/
					return;
				}
				let requestParam1 = {
					model: formData1,
					pageid: "10100SOB_sobcard"//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
				};
				//只有卡片态可保存
				let saveAddCallBack=()=>ajax({
					url: urls['save'],//urls['queryCard'],
					data:requestParam1,
					success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
						let { success,data} = res;
						if (success) {
							if(data){
								//若是新增保存成功，需要维护缓存PK和当前选中pk
								if(this.state.formstate=='add'){
									this.props.cardPagination.setCardPaginationId({id:data[formId].rows[0].values['pk_setofbook'].value,status:2});
									if(cacheTools.get('allpks')&&cacheTools.get('allpks').length>0){
										let newpks=[];
										cacheTools.get('allpks').forEach((singlePk)=>{
											newpks.push(singlePk);
											if(singlePk==this.state.formData.selectData['pk_setofbook'].value){
												newpks.push(data[formId].rows[0].values['pk_setofbook'].value);
											}
										});
										cacheTools.set('allpks',newpks)
									}
								}

								this.SOBCard.form.setFormStatus(formId, 'browse');
								this.SOBCard.form.setAllFormValue({[formId]:data[formId]});
								this.setState({
									formstate:'browse',
									formData:{
										toFormStatus:'browse',
										selectData:data[formId].rows[0].values
									}
								});
								this.updateButtonStatus("browse");
							}
							toast({title:this.state.json['10100SOB-000004'],color:'success'});/* 国际化处理： 保存成功！*/
							//成功后再做新增操作
							this.setState({
								formstate:'add',
								formCurrState:'add'//用于标识卡片当前状态，控制浏览器关闭时提示
							});
							this.SOBCard.form.EmptyAllFormValue(formId);
							this.SOBCard.form.setFormStatus(formId,'add');
							this.modifierFormMeta(this.SOBCard.meta.getMeta(),this.state.formData.selectData,'add')
							//新增时科目体系不允许编辑
							this.SOBCard.form.setFormItemsDisabled(formId,{'pk_accsystem':true});
							this.updateButtonStatus('add');
							//新增需要启用保存新增按钮
							this.props.button.setDisabled({
								saveAdd:false
							});
						}
					}.bind(this)
				});
				this.SOBCard.validateToSave(requestParam1,saveAddCallBack,{formId:'form'},'form');
				break;
			case 'refresh':
				if(this.state.isList=='Y'){
					this.getData(()=>{
						toast({title:this.state.json['10100SOB-000005'],color:'success'});/* 国际化处理： 刷新成功！*/
					});
				}else{
					//this.SOBCard.form.getFormItemsValue(formId,'pk_setofbook');//获取当前表单的主键值
					this.SOBCard.form.EmptyAllFormValue(formId);
					ajax({
						url: urls['queryCard'],//urls['queryCard'],
						data:{pk_setofbook:this.state.formData.selectData['pk_setofbook'].value},
						success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
							let { success,data} = res;
							if (success) {
								//适配显示公式
								if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
									this.props.dealFormulamsg(
										res.formulamsg,
										{
											"setofbook":"form"
										}
									);
								}

								if(data){
									this.SOBCard.form.setAllFormValue({[formId]:data[formId]});
								}
								toast({title:this.state.json['10100SOB-000005'],color:'success'});/* 国际化处理： 刷新成功！*/
								//this.updateButtonStatus();
							}
						}.bind(this)
					});
				}
				break;
			case 'unitorg':
				let langName = 'name' + (this.state.langCode=='1'?'':this.state.langCode);
				let refSOBData={//帐簿类型参照数据处理
					refpk:this.state.formData.selectData['pk_setofbook'].value,
					refname:this.state.formData.selectData[langName].value,
					refcode:this.state.formData.selectData['code'].value
				}
					this.state.formData.selectData;
				this.props.modal.show('unitorg',{
					title : this.state.json['10100SOB-000006'],/* 国际化处理： 关联组织查询*/
					content : <UnitOrg config={refSOBData} json={this.state.json}/>
				});
				break;
			case 'createFin':
				//创建财务核算账簿
				this.props.openTo('/uapbd/org/accountingbook_glb/main/index.html',{appcode:'10100ACB',pagecode:'10100ACB_accountingbook'});
				break;
			case 'createBusi':
				alert(this.state.json['10100SOB-000007'])/* 国际化处理： 责任核算账簿节点目前不知晓谁人在做，敬请期待*/
				break;
			case 'add':
				if(this.state.isList=='Y'){
					setTimeout(() => {
						this.setState({
							formCurrState:'add',//用于标识卡片当前状态，控制浏览器关闭时提示
							formstate:'add',
							isList:'N',
							formData:{
								toFormStatus:'add',
								selectData:this.state.formData.selectData
							}
						});//设置当前选中行
					}, 10);
				}else{
					this.setState({
						formstate:'add',
						formCurrState:'add'//用于标识卡片当前状态，控制浏览器关闭时提示
					});
					this.SOBCard.form.EmptyAllFormValue(formId);
					this.SOBCard.form.setFormStatus(formId,'add');
					this.modifierFormMeta(this.SOBCard.meta.getMeta(),this.state.formData.selectData,'add');
					//新增时科目体系不允许编辑
					this.SOBCard.form.setFormItemsDisabled(formId,{'pk_accsystem':true});
				}
				this.updateButtonStatus('add');
				//新增需要启用保存新增按钮
				/*this.props.button.setDisabled({
					saveAdd:false
				});*/
				this.props.button.setButtonVisible({
					saveAdd:true
				});
				break;
			case 'edit':
				//查询数据权限
				if(!this.state.formData.selectData){
					NCMessage.create({content: this.state.json['10100SOB-000008'], color: 'warning'});//默认top/* 国际化处理： 请先选择数据*/
					return;
				}

				ajax({
					url: urls['datapermission'],
					data: {resourceCode:'setofbook',mdOperateCode:'edit',pk_setofbook:this.state.formData.selectData['pk_setofbook'].value},
					success: (result) => {
						if(result.success){
							if(this.state.isList=='Y'){
								setTimeout(() => {
									this.setState({
										formCurrState:'edit',//用于标识卡片当前状态，控制浏览器关闭时提示
										formstate:'edit',
										isList:'N',
										formData:{
											toFormStatus:'edit',
											selectData:this.state.formData.selectData
										}
									});//设置当前选中行
								}, 10);
							}else{
								this.setState({
									formCurrState:'edit',//用于标识卡片当前状态，控制浏览器关闭时提示
									formstate:'edit'
								});
								this.SOBCard.form.setFormStatus(formId,'edit');
								//修改时科目体系允许编辑
								this.SOBCard.form.setFormItemsDisabled(formId,{'pk_accsystem':false});
							}
							this.updateButtonStatus('edit');
							//修改需要禁用保存新增按钮
							/*this.props.button.setDisabled({
								saveAdd:true
							});*/
							this.props.button.setButtonVisible({
								saveAdd:false
							});
						}
					}
				});
				break;
			case 'cancel':
				promptBox({
					color:'warning',
                    title : this.state.json['10100SOB-000009'],/* 国际化处理： 确认取消*/
                    content : this.state.json['10100SOB-000010'],/* 国际化处理： 是否确认取消？*/
                    beSureBtnClick : (()=>{
						if(this.SOBCard.form.getFormStatus(formId)=='edit'){
							this.SOBCard.form.cancel(formId);
						}else{
							//取消完成后，需要刷新页面数据
							this.SOBCard.form.setFormStatus(formId,'browse');
							//this.onButtonClick(props,'refresh');
							if(this.state.isList=='Y'){
								this.getData();
							}else{
								//this.SOBCard.form.getFormItemsValue(formId,'pk_setofbook');//获取当前表单的主键值
								this.SOBCard.form.EmptyAllFormValue(formId);
								ajax({
									url: urls['queryCard'],//urls['queryCard'],
									data:{pk_setofbook:this.state.formData.selectData['pk_setofbook'].value},
									success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
										let { success,data} = res;
										if (success) {
											if(data){												
												this.SOBCard.form.setAllFormValue({[formId]:data[formId]});
											}
										}
									}.bind(this)
								});
							}
						}
						this.setState({
							formCurrState:'browse',//用于标识卡片当前状态，控制浏览器关闭时提示
							formstate:'browse',
							formData:{
								toFormStatus:'browse',
								selectData:this.state.formData.selectData
							}
						});
						this.updateButtonStatus('browse');
                    })
				})
				
				break;
			case 'save':
				//form表单必输项校验
				if(!this.SOBCard.form.isCheckNow(formId)){
					//toast({color:'danger',content:'请输入必输项！'});
					return;
				}

				let formPageCode="10100SOB_sobcard";
				let formData = this.SOBCard.form.getAllFormValue(formId);//获得表单信息
				//适配校验公式
				formData.areacode=formId;

				//校验财务核算账簿和责任核算账簿是否有勾选
				if((!formData.rows[0].values['isaccountbook'].value)&&(!formData.rows[0].values['isliabilitybook'].value)){
					toast({color:'danger',content:this.state.json['10100SOB-000003']});/* 国际化处理： 请勾选财务核算账簿！*/
					return;
				}

				let requestParam = {
					model: formData,
					pageid: formPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
				};
				//只有卡片态可保存
				let saveCallBack=()=>ajax({
					url: urls['save'],//urls['queryCard'],
					data:requestParam,
					success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
						let { success,data} = res;
						if (success) {
							if(data){
								//若是新增保存成功，需要维护缓存PK和当前选中pk
								if(this.state.formstate=='add'){
									this.props.cardPagination.setCardPaginationId({id:data[formId].rows[0].values['pk_setofbook'].value,status:2});
									if(cacheTools.get('allpks')&&cacheTools.get('allpks').length>0){
										let newpks=[];
										cacheTools.get('allpks').forEach((singlePk)=>{
											newpks.push(singlePk);
											if(singlePk==this.state.formData.selectData['pk_setofbook'].value){
												newpks.push(data[formId].rows[0].values['pk_setofbook'].value);
											}
										});
										cacheTools.set('allpks',newpks)
									}
								}
								//适配显示公式
								if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
									this.props.dealFormulamsg(
										res.formulamsg,
										{
											"setofbook":"form"
										}
									);
								}

								this.SOBCard.form.setFormStatus(formId, 'browse');
								this.SOBCard.form.setAllFormValue({[formId]:data[formId]});
								this.setState({
									formCurrState:'browse',//用于标识卡片当前状态，控制浏览器关闭时提示
									formstate:'browse',
									formData:{
										toFormStatus:'browse',
										selectData:data[formId].rows[0].values
									}
								});
								toast({title:this.state.json['10100SOB-000004'],color:'success'});/* 国际化处理： 保存成功！*/
								this.updateButtonStatus("browse");
							}
							
						}
					}.bind(this)
				});
				this.SOBCard.validateToSave(requestParam,saveCallBack,{formId:'form'},'form');
				break;

			case 'delOpr':
				ajax({
					url: urls['datapermission'],
					data: {resourceCode:'setofbook',mdOperateCode:'edit',pk_setofbook:this.state.formData.selectData['pk_setofbook'].value},
					success: (result) => {
						if(result.success){
							this.onDelForBrowse();
						}
					}
				});
				break;
			case "del":

				//查询数据权限
				if(!this.state.formData.selectData){
					NCMessage.create({content: this.state.json['10100SOB-000008'], color: 'warning'});//默认top/* 国际化处理： 请先选择数据*/
					return;
				}
				ajax({
					url: urls['datapermission'],
					data: {resourceCode:'setofbook',mdOperateCode:'edit',pk_setofbook:this.state.formData.selectData['pk_setofbook'].value},
					success: (result) => {
						if(result.success){
							promptBox({
								color:'warning',
								title : this.state.json['10100SOB-000011'],/* 国际化处理： 确认删除*/
								content : this.state.json['10100SOB-000012'],/* 国际化处理： 您确认删除所选数据？*/
								beSureBtnClick : this.onDelForBrowse.bind(this)
							});
						}
					}
				});
				break;
			case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break; 
		}
	
	}

	onSelectMoreButton({ key }) {
		this.getData();
	}

	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.state.formData.selectData;
		let pk_setofbook=this.state.formData.selectData['pk_setofbook'].value;
		let data;
		let url;
		if(this.state.isList=='Y'){
			data = {
				pageid:pagecode,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows:[
						{values:selectedData}
					]
				}
			};
			url=urls['deleteList'];
		}else{
			data = {
				pageid:formPageCode,
				model: {
					areaType: 'form',
					pageinfo: null,
					rows: [
						{values:selectedData}
					]
				}
			};
			url=urls['deleteCard'];
		}
		
		ajax({
			url: url,
			data:data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					if(this.state.isList=='Y'){
						this.getData();
						toast({title:this.state.json['10100SOB-000013'],color:'success'});/* 国际化处理： 删除成功！*/
					}else{
						toast({title:this.state.json['10100SOB-000013'],color:'success'});/* 国际化处理： 删除成功！*/
						let nextPk=this.props.cardPagination.getNextCardPaginationId({id:pk_setofbook,status:1});
						this.props.cardPagination.setCardPaginationId({id:pk_setofbook,status:3});
						this.props.cardPagination.setCardPaginationId({id:nextPk,status:1});
						if(cacheTools.get('allpks')&&cacheTools.get('allpks').length>0){
							let newpks=[];
							cacheTools.get('allpks').forEach((singlePk)=>{
								if(singlePk!=pk_setofbook){
									newpks.push(singlePk);
								}
							});
							cacheTools.set('allpks',newpks)
						}
						//获取下一个PK后，查询下一条数据
						if(!nextPk){
							return;
						}
						//this.props.cardPagination.setCardPaginationId({id:pk_setofbook,status:3});
						ajax({
							url: urls['queryCard'],//urls['queryCard'],
							data:{pk_setofbook:nextPk},
							success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
								let { success,data} = res;
								if (success) {
									if(data){
										//适配显示公式
										if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
											this.props.dealFormulamsg(
												res.formulamsg,
												{
													"setofbook":"form"
												}
											);
										}
										
										this.setState({
											formstate:'browse',
											formData:{
												toFormStatus:'browse',
												selectData:data[formId].rows[0].values
											}
										});
										this.SOBCard.form.setAllFormValue({[formId]:data[formId]});
										this.props.cardPagination.setCardPaginationId({id:nextPk,status:1});
									}
								}
							}.bind(this)
						});
					}
				}
			}
		});
	}

	//查询区事件处理
	clickSearchBtn = (props,searchVal)=>{
		searchVal=this.props.search.getQueryInfo(searchId);
		searchVal.custcondition={
			conditions:[],
			logic:'and'
		};
        /*let data = {
            querycondition: searchVal==null?null:searchVal,
            queryAreaCode:searchId,  //查询区编码
            oid:'1001Z01000000001ADR5',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype:'tree',
			custcondition:{
				conditions:[],
				logic:'and'
			}
        };*/

        ajax({
            url:urls['sobquery'],
            data:searchVal,
            success: (res) => {
				//维护allpks
				let pks=[];
                if(res.success&&res.data){
					allTableData = res.data[tableid];
					props.editTable.setTableData(tableid, res.data[tableid]);
					res.data[tableid].rows.forEach((item)=>{
						pks.push(item.values['pk_setofbook'].value);
					});
					this.setState({
						formData:{
							toFormStatus:'browse',//跳转到卡片态的状态
							selectData:res.data[tableid].rows[0].values
						}
					});//每次加在数据默认选中第一行
					this.props.editTable.focusRowByIndex(tableid,0);
					toast({content:this.state.json['10100SOB-000014']+res.data[tableid].rows.length+this.state.json['10100SOB-000015'],color:"success"});/* 国际化处理： 查询成功，共,条。*/
                }else{
					allTableData={rows:[]};
					props.editTable.setTableData(tableid, {rows:[]});
					this.setState({
						formData:{
							toFormStatus:'browse',//跳转到卡片态的状态
							selectData:{}
						}
					});//维护选中的数据状态
                    toast({content:this.state.json['10100SOB-000016'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
				}
				cacheTools.set('allpks',pks);
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
	}
	
	onRowClick(props,moduleId,record,index){
		this.props.editTable.focusRowByIndex(tableid,index);
		this.setState(
			{
				formData:{
					toFormStatus:'browse',
					selectData:record.values
				}
			}
		);
	}

	//列表行双击事件
	onRowDoubleClick(record,index){
		setTimeout(() => {
			this.setState({
				formstate:'browse',//设置卡片为浏览态
				isList:'N',
				formData:{
					toFormStatus:'browse',
					selectData:record.values
				}
			});//设置当前选中行
			//卡片翻页模型需要传入一个pk
			this.props.cardPagination.setCardPaginationId({id:record.values['pk_setofbook'].value,status:1});

			this.updateButtonStatus();
		}, 10);
	}

	//卡片返回按钮
	returnList(){
		setTimeout(() => {
			this.setState({
				isList:'Y',
			});//设置当前选中行
			this.updateButtonStatus();
		}, 10);
		this.getData();
	}

	//卡片翻页模型事件
	pageQryClick(props,pk){
		this.SOBCard.form.EmptyAllFormValue(formId);
		ajax({
			url: urls['queryCard'],//urls['queryCard'],
			data:{pk_setofbook:pk},
			success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success,data} = res;
				if (success) {
					if(data){
						this.setState({
							formstate:'browse',
							formData:{
								toFormStatus:'browse',
								selectData:data[formId].rows[0].values
							}
						});
						this.SOBCard.form.setAllFormValue({[formId]:data[formId]});
					}else{
						//如果没有查到数据，则跳转下一页
						let nextPk=this.props.cardPagination.getNextCardPaginationId({id:pk_setofbook,status:1});
						this.props.cardPagination.setCardPaginationId({id:pk_setofbook,status:3});
						if(!nextPk){
							this.setState({
								formstate:'browse',
								formData:{
									toFormStatus:'browse',
									selectData:{}
								}
							});
							this.SOBCard.form.EmptyAllFormValue(formId);
						}
					}
				}
			}.bind(this)
		});
	}

	render() {
		const {BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
		let { table, button, search,editTable,modal ,cardPagination} = this.props;
		const {createCardPagination}=cardPagination;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButton } = button;
		let {NCFormControl,NCCheckbox} = base;
		let {createModal} = modal;
		let { createButtonApp } = button;
		const { Item } = Menu;
		let moreButton = (
			<Menu
                  onSelect={this.onSelectMoreButton.bind(this)}>
                      <Item key="1">{this.state.json['10100SOB-000018']/* 国际化处理： 刷新*/}</Item>
					  <Item key="2">{this.state.json['10100SOB-000019']/* 国际化处理： 打印*/}</Item>
                </Menu>
		);
		let paginationEnable=(this.state.isList=='Y'||this.state.formstate!='browse')?'none':'';
		var renderCard = () =>{
			return (
				<div style = {{height:'100%'}}>
					<div className="nc-bill-top-area nc-bill-top-area-self">
						<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" >
							<div className="header-title-search-area">
								{createBillHeadInfo({
									title:this.state.json['10100SOB-000020'],
									backBtnClick:this.returnList.bind(this),
									showBackBtn:this.state.isList=='N'&& this.state.formstate==='browse',
									initShowBackBtn:this.state.isList=='N'&&this.state.formstate=='browse'&&this.state.isLinkFromUrl!=true
																}	
																)}
							</div>
							{/* 按钮组 btn-group*/}
							<div className="header-button-area">
								{createButtonApp({
									area: 'list_btn',
									buttonLimit: 3, 
									onButtonClick: this.onButtonClick.bind(this), 
									popContainer: document.querySelector('.header-button-area')
			
								})}
							</div>
							
							{/*卡片态添加翻页组建*/}
							<div className='header-cardPagination-area' style={{float:'right',display:paginationEnable}} >
								{ //如果是通过其他页面链接过来的，则不显示右上角的按钮。
									this.state.isLinkFromUrl!=true && createCardPagination({
									handlePageInfoChange:this.pageQryClick.bind(this),
									//urlPkname:'id'
								})}
							</div>
						</NCDiv>
					<SOBCard formCurrState={this.state.formCurrState} return={this.returnList.bind(this)} modifierFormMeta={this.modifierFormMeta.bind(this)} config={this.state.formData} ref={(SOBCard => this.SOBCard = SOBCard)}/>
					</div>
				</div>
			)
		}
		var renderList = () =>{
			return (
				<div style = {{height:'100%'}}>
					<NCAffix>
						<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area" >
								{createBillHeadInfo({
										title:this.state.json['10100SOB-000020'],
										backBtnClick:this.returnList.bind(this),
										showBackBtn:this.state.isList=='N'&& this.state.formstate==='browse',
										initShowBackBtn:this.state.isList=='N'&&this.state.formstate=='browse'
									}	
									)}
							</div>
							{isShowOffEnable?(
								<div className="title-search-detail">
									<span className="showOff">
										<NCCheckbox
											checked={this.state.isShowOff}
											onChange={this.showOffChange.bind(this)}
											disabled={this.state.showOffDisable}
										>{this.state.json['10100SOB-000021']/* 国际化处理： 显示停用*/}</NCCheckbox>
									</span>
								</div>
							):('')}
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
					</NCAffix>
					<div className="nc-bill-search-area">
								{NCCreateSearch(searchId, {
									clickSearchBtn: this.clickSearchBtn.bind(this)
								})}
					</div>
					<div className='nc-bill-table-area'>
									{createEditTable(tableid, {//列表区
										onRowClick:this.onRowClick.bind(this),
										onRowDoubleClick:this.onRowDoubleClick.bind(this),
										onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
										useFixedHeader:true,    
										showIndex:true,				//显示序号
										showCheck:false,			//显示复选框  
										adaptionHeight: true                            // 自定义传参
									})}
					</div>
				</div>
			)
		}
		return (
			<div className = {this.state.isList=='Y' ? "nc-bill-list" : "nc-bill-card nc-bill-extCard"}>
				{createModal('unitorg',{noFooter:true})}
				{this.state.isList == 'Y' && renderList()}
				{this.state.isList == 'N'  && renderCard()}
				{/* 删除前确认模态框 */}
				{createModal('modal',{
					title : this.state.json['10100SOB-000011'],										//标题/* 国际化处理： 确认删除*/
					content : this.state.json['10100SOB-000017'],							//内容/* 国际化处理： 确认删除所选数据？*/
					beSureBtnClick : this.onDelForBrowse.bind(this)		//确定按钮事件回调
					//cancelBtnClick : this.closeDelModal.bind(this),			//取消按钮事件回调
					//leftBtnName : '关闭',   								//左侧按钮名称
    				//rightBtnName : '确认'   								//右侧按钮名称
				})}
				<ExcelImport
                {...this.props}
                moduleName ='riaorg'//模块名
                billType = 'setofbook'//单据类型
                selectedPKS = {[]}
                appcode='10100SOB'
                pagecode="10100SOB_sobcard"
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
	initTemplate: ()=>{}
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65