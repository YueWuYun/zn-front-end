//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 *  外币汇率
 *  @author	chaiyan3
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './main.less';							//该页面样式
import dateUtil from '../../../../uapbd/public/utils/dateUtil';;
import  {BaseUtils} from '../../../public/utils';
import OrgWithGlobalTreeRef from  '../../../../uapbd/refer/org/OrgWithGlobalTreeRef';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef/index';
import BankDocDefaultGridTreeRef from  '../../../../uapbd/refer/bankacc/BankDocDefaultGridTreeRef';//银行档案
import CurrtypeGridRef from '../../../../uapbd/refer/pubinfo/CurrtypeGridRef';
import AccPeriodDefaultTreeGridRef from '../../../../uapbd/refer/pubinfo/AccPeriodDefaultTreeGridRef';
import AccPeriodSchemeDefaultTreeRef from '../../../../uapbd/refer/pubinfo/AccPeriodSchemeDefaultTreeRef';


import { createPage, ajax, base, high, toast ,cardCache,print,getBusinessInfo,promptBox,getMultiLang,createPageIcon, excelImportconfig } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;//缓存update
import { isNullOrUndefined } from 'util';
const {PrintOutput, ExcelImport}=high;
const { NCTZDatePickClientHourTime,NCTabsControl, NCTabs, NCCollapse, NCMessage, NCCheckbox, NCTable, NCPagination, NCAnchor, NCScrollElement, NCScrollLink, NCModal, NCDiv, NCButton } = base;
const NCTabPane = NCTabs.NCTabPane;
import Utils from '../../../public/utils/index.js';
let {BDselect} = Utils;

const mainCode = '10140CURT_adjustrate';
const schemeeditor = '10140CURT_extratescheme';
const firstCode = "bd_adjustrate";
const showCode = "exratescheme";
let mainSheet;
let showSheet;
const modalId = 'showModal';
let leftTreeData;
const appcode = '10140CURT';
const keys = ['']; 
let rows;
const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse', //浏览
	add: 'add' //新增
}
const urls = {
	itemQuery: '/nccloud/uapbd/currinfo/currinfoschemequery.do',	//外币汇率方案  查询
	editQuery: '/nccloud/uapbd/currinfo/schemeeditquery.do',	//外币汇率方案编辑 查询
	save: '/nccloud/uapbd/currinfo/schemesave.do',			//外币汇率方案  保存
	savecurrinfo:'/nccloud/uapbd/currinfo/savecurrinfo.do',//外币汇率 保存
	savecurrrate:'/nccloud/uapbd/currinfo/savecurrrate.do',//日汇率保存
	saveavgrate:'/nccloud/uapbd/currinfo/saveavgrate.do',//平均汇率保存
	saveadjustrate:'/nccloud/uapbd/currinfo/saveadjustrate.do',//期间汇率保存
	query: '/nccloud/uapbd/currinfo/schemecardquery.do',		//外币汇率  查询
	deletescheme:'/nccloud/uapbd/currinfo/schemedelete.do',        //外币汇率方案 删除
	deletecurrinfo:'/nccloud/uapbd/currinfo/deletecurrinfo.do',//外币汇率 删除
	validateurl:'/nccloud/uapbd/currinfo/validatecurrinfo.do',//外币汇率 修改校验
	delvalidatecurrinf:'/nccloud/uapbd/currinfo/delvalidatecurrinfo.do',//外币汇率 删除校验
	setmaxdigit:'/nccloud/uapbd/currinfo/setmaxdigit.do',
	currinfoprint:'/nccloud/uapbd/currinfo/currinfoprint.do',//折算模式打印
	currrateprint:'/nccloud/uapbd/currinfo/currrateprint.do',//日汇率打印
	adjustrateprint:'/nccloud/uapbd/currinfo/adjustrateprint.do',//折算模式打印
	avgrateprint:'/nccloud/uapbd/currinfo/avgrateprint.do',//日汇率打印:
	validatedafault:'/nccloud/uapbd/currinfo/validatedafault.do',
	setscalebyrate:'/nccloud/uapbd/currinfo/setscalebyrate.do',//通过汇率小数位数设置其他业签小数精度
	addscheme: '/nccloud/uapbd/currinfo/addschemecard.do',		//外币汇率  查询
}

const tableid = ["currinfo","bd_currrate","bd_adjustrate","pk_avgrate"];
// 记住当前树节点
let nowNodeRefpk;
const EMPTY_FN = function(){};
let mdClassId = '3fbd6e6a-b879-4598-a234-f06f4d57271c';//外币汇率方案元数据id管控模式使用
let classId = '82e62fb2-204c-4497-994e-b6b3daf55748';//外币汇率元数据id管控模式使用
//const tableBtnAry = ["delline","insertline"];		//表格列操作按钮
let tableBtnAry =(props)=>{
    return props.cardTable.getStatus(tableid[0]) === 'browse'
        ? [ ]: ['delline','insertline'];
}


let initTemplate = (props) => {
	

}

class CurrinfoClass extends Component {
	constructor(props) {
        super(props);
		this.state = {
			editMode: false,//外币汇率业签是否可切换
			flag:true,//目的币种状态
			flagg:true,//根据会计期间方案是否有值控制会计月份状态
			canedit:true,//控制会计期间方案、汇率日期浏览态可编辑
			modalShow: false,
			tableNum: 0,
			json:{},
			//node:,
			searchDisable:false,
			disabledSearch:false,
			isCopy:false,
			isAdd:false,
			scale:'',//最大折算误差精度
			currpk:'',
			currinfodata:'',//折算模式业签数据 bd_currinfo
            current:dateUtil.getCurrentDate('YYYY-MM-DD hh:mm:ss'),//new Date().toLocaleDateString()
            selectedPKS: '',
            billType: this._judgetImportBillType('currrate')
		};
		this.tableId1 = tableid[0];
		this.root = {
			"isleaf": false,
			"key": "~",
			"title": '10140CURT-000004',/* 国际化处理： 外币汇率*///this.state.json['10140CURT-000004'],/* 国际化处理： 外币汇率*/
			"id": "~",
			"innercode": "~",
			"pid": "",
			"refname": '10140CURT-000004',/* 国际化处理： 外币汇率*///this.state.json['10140CURT-000004'],/* 国际化处理： 外币汇率*/
			"refpk": "~",
			'accPeriod':''
		};
		this.config =Object.assign({
            title: '10140CURT-000005',/* 国际化处理： 外币汇率-全局*/
            treeId: "cttermTree",
			nodeType:'GLOBE_NODE',
			pageCode:'10140CURT_adjustrate',
			appcode:'10140CURT',
			datasource : 'uapbd.pubinfo.currinfo.currinfoglb',
        }, props.config);
		
		this.dealTreeData = this.dealTreeData.bind(this);
		this.initLeftTree = this.initLeftTree.bind(this);
		this.onEditCttermtype = this.onEditCttermtype.bind(this);
	  	this.onDeleteCttermtype = this.onDeleteCttermtype.bind(this);
	  	this.closeModalEve = this.closeModalEve.bind(this);
		this.onChangeFun = this.onChangeFun.bind(this);
		this.onAddCttermtype = this.onAddCttermtype.bind(this);	
		//this.getNowFormatDate = this.getNowFormatDate().bind(this);
		props.createUIDom({
			pagecode : props.config.pageCode?props.config.pageCode:mainCode,//mainCode,
			//appcode :props.config.appcode?props.config.appcode:appcode// appcode//this.config.appcode
		},
		(data)=>{
			let meta = data.template;
			//meta['formrelation'].exratescheme=['auditinfo'];
			this.modifierMeta(props, meta);
			props.meta.setMeta(meta,()=>{
				this.initLeftTree();
			});
			showSheet = meta;
            data.button && props.button.setButtons(data.button);
            
            // 默认注册外币汇率的导入设置
            props.button.setUploadConfig("Import",excelImportconfig(this.props,"uapbd",this.state.billType,true,"",{'appcode':this.props.config.appcode, 'pagecode':this.props.config.pageCode},()=>{this.buttonClick(this.props, 'refresh')}));
	
		});
		
    }

    tableButtonClick(props, id, text, record, index){
        switch(id){
            case 'insertline':
                props.cardTable.addRow(tableid[0], index);
                break;
            case 'delline':
                let pkorg = props.cardTable.getValByKeyAndIndex(tableid[0], index, 'pk_org').value;//当前删除行的所属组织
                if(pkorg == '' || pkorg == undefined){
                    props.cardTable.delRowsByIndex(tableid[0], index);
                }else{
                    //删行时需要判断当前管控模式
                    if(props.config.nodeType === 'GLOBE_NODE' && pkorg != 'GLOBLE00000000000000')//全局 
                    {
                        toast({color:"danger",content:props.MutiInit.getIntl("10140CURT") && props.MutiInit.getIntl("10140CURT").get('10140CURT-000001')});/* 国际化处理： 全局节点只能维护全局的数据！*/
                        return;
                    }
                    let businessInfo = getBusinessInfo();
                    if(props.config.nodeType === 'GROUP_NODE' && pkorg != businessInfo.groupId){
                        toast({color:"danger",content:props.MutiInit.getIntl("10140CURT") && props.MutiInit.getIntl("10140CURT").get('10140CURT-000002')});/* 国际化处理： 集团节点只能维护集团的数据！*/
                        return;
                    }
                    if(props.config.nodeType === 'ORG_NODE' && pkorg !=this.state.pk_curOrg)
                    {
                        toast({color:"danger",content:props.MutiInit.getIntl("10140CURT") && props.MutiInit.getIntl("10140CURT").get('10140CURT-000003')});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                        return;
                    }
                    props.cardTable.delRowsByIndex(tableid[0], index);
                }
                
                break;
            default:
                break;
        }
    }

    modifierMeta(props, meta) {
        let porCol = {
            attrcode: 'opr',
            label:props.MutiInit.getIntl("10140CURT") && props.MutiInit.getIntl("10140CURT").get('10140CURT-000000'),/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            fixed:'right',
            render: (text, record, index) => {
    
                let btnArray = tableBtnAry(props);
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        };
        meta["currinfo"].items.push(porCol);
        let pkcurrtype = meta["currinfo"].items.find(item=>item.attrcode==='pk_currtype');
        pkcurrtype.isMultiSelectedEnabled = true;//设置源币种参照为多选
        return meta;
    }
    
    _judgetImportBillType(prePart) {
        let billType = ''
        switch(this.props.config.nodeType) {
        case 'GLOBE_NODE':
            billType = prePart + '_glb'
            break
        case 'GROUP_NODE':
            billType = prePart + '_grp'
            break
        case 'ORG_NODE':
            billType = prePart + '_org'
            break
        }
        return billType
    }

	dealTreeData(data) {
    	let deleteDataChildrenProp = function(node) {
			node.iconBox = {
				editIcon: false,
				addIcon: true,
				delIcon: false
			}
	        if(!node.children || node.children.length == 0) {
	            delete node.children;
	        }
	        else {
	            node.isLeaf = false;
	            node.children.forEach( (e) => {
	                deleteDataChildrenProp(e);
	            });
	        }
    	};
	    data.forEach( (e) => {
			e.iconBox = {
				editIcon: true,
				addIcon: true,
				delIcon: true
			}
	        deleteDataChildrenProp(e);
	    });
	    return data;
	}
	initLeftTree(callback) {
	  	let requestParam = {
	      	checked: false,
	      	pkorg: '',
	      	nodetype:this.config.nodeType,
		};
	  	ajax({
	    	url: urls.itemQuery,
	    	data: requestParam,
	    	success:(result) => {
		        if(result.success) {
					//处理显示公式
                    this.dealDisplayFm(result); 
		        	let data = [Object.assign({...this.root},{title:this.state.json[this.root.title],refname:this.state.json[this.root.refname]} ,{children : result.data} )];
					//同步树  加载全部数据
					leftTreeData = data;
		        	this.props.syncTree.setSyncTreeData( this.config.treeId, this.dealTreeData(data));
					
					// 选中根节点
					this.props.syncTree.setNodeSelected(this.config.treeId, this.root.refpk);
					this.setState({
						node:this.props.syncTree.getSelectNode(this.config.treeId)
					})//第一次进入界面时默认选中节点
					//展开节点  设置默认展开项
					this.props.syncTree.openNodeByPk( this.config.treeId, this.root.refpk);
					this.updateButtonStatus(this.state.tableNum);
					//树生成后每个节点按钮控制
					this.setTreeBtn(leftTreeData[0].refpk,leftTreeData[0]);
					callback&&callback();
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
					[showCode] : "form"
				}
			);
		}
    }
	//根据 管控模式设置树按钮是否显示
	setTreeBtn(key,node){
		
		//设置
		var bdselect =  new BDselect([mdClassId]);
        bdselect.getModeByClassid(mdClassId, (mode) => {
            if(!mode){
                toast({content : this.state.json['10140CURT-000006']});/* 国际化处理： 未设置管控模式*/
			}else{
				var managemode = mode[0].managemode
				this.setState({
					managemode:managemode
				})
				this.setManagemode(managemode,key,node);
				
			}
		})
	}

	setManagemode(managemode,key,node){
		if(node.children){
			node.children.forEach(children =>{
				//this.setTreeBtn(children.refpk,children);
				this.setManagemode(managemode,children.refpk,children);
			})
		}
		let nodetype = this.config.nodeType
		if (managemode == BDselect.SCOPE_GLOBE ) {	
			if (nodetype === 'GLOBE_NODE') {//方案管控模式为全局时，只有全局节点有增删改权限
				if(key === this.root.refpk || (node.nodeData && !node.nodeData.isScheme )
			|| (node.nodeData && node.nodeData.isScheme && node.nodeData.pkorg != 'GLOBE')) {
					let obj = {
						delIcon:false, //false:隐藏； true:显示; 默认都为true显示
						editIcon:false,
						addIcon:true
					};
					this.props.syncTree.hideIcon(this.config.treeId, key, obj );
				}
				if(node.nodeData && node.nodeData.isScheme && node.nodeData.pkorg === 'GLOBE'){
					let obj = {
						delIcon:true, //false:隐藏； true:显示; 默认都为true显示
						editIcon:true,
						addIcon:true
					};
					this.props.syncTree.hideIcon(this.config.treeId, key, obj );
				}
			}else{//方案管控模式为全局，除全局以外，其余节点没有增删改权限
				let obj = {
					delIcon:false, //false:隐藏； true:显示; 默认都为true显示
					editIcon:false,
					addIcon:false
				};
				this.props.syncTree.hideIcon(this.config.treeId, key, obj );
			}
		}
		if (managemode == BDselect.SCOPE_GLOBE_GROUP ) {//全局+集团
			
			if (nodetype === 'GLOBE_NODE' || nodetype === 'GROUP_NODE') {//全局+集团节点有增删改权限
				if(node.nodeData && node.nodeData.isScheme &&
					((nodetype === 'GLOBE_NODE' && node.nodeData.pkorg == 'GLOBE') ||
					(nodetype === 'GROUP_NODE' && node.nodeData.pkorg == 'GROUP'))){
						let obj = {
							delIcon:true, //false:隐藏； true:显示; 默认都为true显示
							editIcon:true,
							addIcon:true
						};
						this.props.syncTree.hideIcon(this.config.treeId, key, obj );
				}else{
						let obj = {
							delIcon:false, //false:隐藏； true:显示; 默认都为true显示
							editIcon:false,
							addIcon:true
						};
						this.props.syncTree.hideIcon(this.config.treeId, key, obj );
				}	
			}else{
				let obj = {
					delIcon:false, //false:隐藏； true:显示; 默认都为true显示
					editIcon:false,
					addIcon:false
				};
				this.props.syncTree.hideIcon(this.config.treeId, key, obj );
			}
		}
		if (managemode == BDselect.SCOPE_GLOBE_ORG ) {//全局+组织
			if (nodetype === 'GLOBE_NODE' || (nodetype === 'ORG_NODE' && this.state.pk_curOrg) ) {//全局和组织节点有增删改权限
				if(node.nodeData && node.nodeData.isScheme &&
					((nodetype === 'GLOBE_NODE' && node.nodeData.pkorg == 'GLOBE') || 
					(nodetype === 'ORG_NODE' && node.nodeData.pkorg == 'ORG')))
					{
						let obj = {
							delIcon:true, //false:隐藏； true:显示; 默认都为true显示
							editIcon:true,
							addIcon:true
						};
						this.props.syncTree.hideIcon(this.config.treeId, key, obj );
				}else{
					let obj = {
						delIcon:false, //false:隐藏； true:显示; 默认都为true显示
						editIcon:false,
						addIcon:true
					};
					this.props.syncTree.hideIcon(this.config.treeId, key, obj );
					}	
			}else{
				let obj = {
					delIcon:false, //false:隐藏； true:显示; 默认都为true显示
					editIcon:false,
					addIcon:false
				};
				this.props.syncTree.hideIcon(this.config.treeId, key, obj );
			}
		}
		if (managemode == BDselect.SCOPE_GLOBE_GROUP_ORG ) {//全局+集团+组织
			//全部节点有增加权限
			if(this.config.nodeType === 'ORG_NODE' && !this.state.pk_curOrg){
				console.log('ss',this.state.pk_curOrg)
				let obj = {
					delIcon:false, //false:隐藏； true:显示; 默认都为true显示
					editIcon:false,
					addIcon:false
				};
				this.props.syncTree.hideIcon(this.config.treeId, key, obj );
			}else if(key === this.root.refpk || (node.nodeData && !node.nodeData.isScheme )) {
					let obj = {
						delIcon:false, //false:隐藏； true:显示; 默认都为true显示
						editIcon:false,
						addIcon:true
					};
					this.props.syncTree.hideIcon(this.config.treeId, key, obj );
			}else if(node.nodeData && node.nodeData.isScheme ){
					if((this.config.nodeType === 'GLOBE_NODE' && node.nodeData.pkorg === 'GLOBE')
					|| (this.config.nodeType === 'GROUP_NODE' && node.nodeData.pkorg === 'GROUP')
					||(this.config.nodeType === 'ORG_NODE' && node.nodeData.pkorg === 'ORG')
					){
						let obj = {
							delIcon:true, //false:隐藏； true:显示; 默认都为true显示
							editIcon:true,
							addIcon:true
						};
						this.props.syncTree.hideIcon(this.config.treeId, key, obj );
					}else{
						let obj = {
							delIcon:false, //false:隐藏； true:显示; 默认都为true显示
							editIcon:false,
							addIcon:true
						};
						this.props.syncTree.hideIcon(this.config.treeId, key, obj );
					}
				}
				//pk_org为glob00
		}
	}

	setEditTreeBtn(key,node){
		if(node.children){
			node.children.forEach(children =>{
				this.setEditTreeBtn(children.refpk,children);
			})
		}
		let obj = {
			delIcon:false, //false:隐藏； true:显示; 默认都为true显示
			editIcon:false,
			addIcon:false
		};
		this.props.syncTree.hideIcon(this.config.treeId, key, obj );
	}
	onMouseEnterEve(key,node){

	}
	
  	// 树一级节点编辑（外币汇率方案）
  	onEditCttermtype(selectedTreeNode){

		this.props.meta.setMeta(showSheet);
		this.props.modal.show(modalId);
		this.props.form.setFormStatus(showCode,'edit');
		ajax({
			url: urls.editQuery,
			data:{pk_scheme: selectedTreeNode.refpk,pageid:this.config.pageCode},
			success:(result)=>{
				if(result.success){
					// this.props.form.EmptyAllFormValue(formId);
					//处理显示公式
					this.dealDisplayFm(result);
					let cardData = {rows:result.data.exratescheme.rows};
					let value = {'exratescheme':cardData}
					this.props.form.setAllFormValue(value);
					// this.props.form.setAllFormValue(result.data.areaclassForm);
					// this.toggleShow(pageStatus);
				}else{
					alert(result.message);
				}
			}
		});
    }
    // 树一级节点新增（外币汇率方案）
  	onAddCttermtype(selectNode) {

			this.props.meta.setMeta(showSheet);
			this.props.modal.show(modalId);
			this.props.form.setFormStatus(showCode,'edit');
			// setTimeout(()=>{
			// 	this.props.form.setFormStatus(showCode,'edit');
			// },1000)
			this.props.form.EmptyAllFormValue(showCode);
			let me = this;
			ajax({
				url:urls.addscheme,
				data: {
					pagecode: me.config.pageCode,   	 //pagecode,在生成的json模板获取
				},
				success: function (res) {
					if(res.success) {
						//处理显示公式
						me.dealDisplayFm(res);
						let formata = {rows:res.data.exratescheme.rows};
						let value = {'exratescheme':formata}
						me.props.form.setAllFormValue(value);
						//console.log('ok ok');
					}
				},
				error:function(err){
					console.log(err)
				}	
			});
			
		
		//}
	}
	// 树一级节点保存（外币汇率方案）
	onSaveCttermtype(selectNode) {
		let defaultCode;
		ajax({
			url: urls.validatedafault,//默认汇率方案
			method: "post",
			success: (res) => {
				if (res.success) {
					if (res.data) {
						defaultCode = res.data;
						this.onSavescheme(defaultCode);
					}
				}
			}	
		});
		
	}

	//外币汇率方案保存校验
	onSavescheme(defaultCode){
		let data = this.props.form.getAllFormValue(showCode);
		data.areacode = showCode;//添加表单的areacode编码
		let requestParam = {
			nodeType:this.config.nodeType,
			pk_curOrg:this.state.pk_curOrg || "",
            model: data,
            pageid: this.config.pageCode,	//这里错了pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
		};
		let validaData = Utils.clone(requestParam);
		delete validaData.nodeType;
		delete validaData.pk_curOrg;
		//设置当前编辑方案为默认方案时给出提示（先查询原默认方案）
		if(data.rows[0].values.code.value != defaultCode && data.rows[0].values.defaultflag.value){
			
			this.props.modal.show('modal', {
				title: this.state.json['10140CURT-000007'],/* 国际化处理： 询问*/
				content: `${this.state.json['10140CURT-000035']}${defaultCode}，${this.state.json['10140CURT-000036']}？`,/* 国际化处理： 原默认汇率方案为,是否将当前汇率方案设置为默认汇率方案*/
				beSureBtnClick: ()=>{
					this.props.validateToSave(validaData,()=>{
						ajax({
							url: urls.save,
							method: "post",
							data: requestParam,
							success:  (res) => {
								//this.props.meta.setMeta(mainSheet);
								setTimeout(()=>{
									this.props.modal.close(modalId);
									this.initLeftTree();
								})
							}
						});
					},{[showCode]: "form"});
				}
			})
		}else if(data.rows[0].values.code.value == defaultCode && !data.rows[0].values.defaultflag.value){
			//编辑取消默认外币方案时，给出提示：必须设置一个默认的外币汇率方案
			
			toast({content:this.state.json['10140CURT-000008'],color:'warning'});/* 国际化处理： 必须设置一个默认的外币汇率方案*/
			//return;
		}
		else{
			this.props.validateToSave(validaData,()=>{
				ajax({
					url: urls.save,
					method: "post",
					data: requestParam,
					success:  (res) => {
						//this.props.meta.setMeta(mainSheet);
						setTimeout(()=>{
							this.props.modal.close(modalId);
							this.initLeftTree();
						})
					}
				});
			},{[showCode]: "form"},'form');
		}

	}

	//树一级节点删除（外币汇率方案）
  	onDeleteCttermtype(selectNode) {
	
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);	//获得选中节点
        /*******************************************
         *	删除：
         *      1、根据选中的树节点做出相应的提示
         *      2、弹出删除确认提示
         *      3、构造请求参数
         *      4、ajax请求，后台执行删除
         *      5、回调，执行前台删除动作
         *	删除状态下：
         *      清空表单对象数据
         *******************************************/
      
		let requestParam = {
            primaryKey:selectNode.refpk
		};
		promptBox({
			color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title:this.state.json['10140CURT-000009'],/* 国际化处理： 确认删除*/
			content:this.state.json['10140CURT-000010'],/* 国际化处理： 您确定要删除所选数据吗?*/
			beSureBtnClick: ()=>{
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140CURT-000009'],/* 国际化处理： 确认删除*/
					content:this.state.json['10140CURT-000011'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
					beSureBtnClick:()=>{
						ajax({
							url:urls.deletescheme,
							data:requestParam,
							success:(result)=>{
								if(result.success){
									//调用同步树的接口，删除该树节点
									this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
									toast({title:this.state.json['10140CURT-000012'],color:'success'});/* 国际化处理： 删除成功！*/
									setTimeout(()=>{
										this.initLeftTree();
										})
									}
								}
							})
						}
					})
			}
			})

	//	this.initLeftTree();
	}

	//选中树事件
    onSelectTree(refpk, node, selected,nodepra) {
		nowNodeRefpk = node.refpk;
		this.setState({
			node:node,
		})
		//切换树时更新按钮状态
		let tableNum = this.state.tableNum;
		if (node.refpk == '~' || node.nodeData.isScheme) {
			//this.loadButtonStatus(0);
			this.setState({
				currtype:{},
				curr:'',
				canedit:true
			},()=>{
				this.props.cardTable.setTableData(tableid[0],{rows: []});
			})
			switch(tableNum){
				case 0:
					this.props.cardTable.setTableData(tableid[0],{rows: []});
					break;
				case 1:
					this.state.current ='';
					this.props.editTable.setTableData(tableid[1],{rows: []});;
					break;
				case 2:
					this.setState({
						accPeriod:'',
						selAccperiodmonth:'',
						accPeriodscheme:{},
						accperiodmonth:{},
						flagg:true,
						//canedit:true
					},()=>{
						this.props.editTable.setTableData(tableid[2],{rows: []});
					})
					break;
				case 3:
					this.props.editTable.setTableData(tableid[3],{rows: []});;
					break;
			}
            //return;
		}else{
			this.setState({
				canedit:false,
			})
		}
		setTimeout(()=>this.updateButtonStatus(this.state.tableNum),10);
		let currentnum = this.state.tableNum;
    	if(selected) {
			this.state.selectNode = node;
            if(node.refpk == 'root') {
                this.props.form.EmptyAllFormValue('currinfo');
                return;
			}
			if (node.nodeData && !node.nodeData.isScheme) {
				if(this.state.current == ""){
					this.state.current =dateUtil.getCurrentDate('YYYY-MM-DD hh:mm:ss')
				}
				let aa = {};

				tableid.forEach(element => {
					this.loadFormData(node,this.props,element);
					
				});
				//this.loadFormData(node,this.props,tableid[currentnum]);
			}
		}
		
	}

	//保存第一个业签时调用（折算模式currinfo）
	onSelectTreeAfterSave(refpk, node, selected){
		this.setState({
			node:node,
			canedit:false,
		})
		setTimeout(()=>this.updateButtonStatus(this.state.tableNum),10);
	}

	//切换树时加载外币汇率卡片界面
    loadFormData(node,props,key){	
		//this.state.curr = '';	
		if(this.state.current == ""){
			this.state.current =dateUtil.getCurrentDate('YYYY-MM-DD hh:mm:ss')
		}
		this.state.currtype = '';
		let moduleid = key;
		let id = this.state.tableNum;
		ajax({
			url: urls.query,
			data: {
				pk_scheme: node.pid,
				pk_currinfo: node.refpk,
				oppcurrtype:node.nodeData.oppcutype,
				date:this.state.current,
				yearmonthpk:this.state.selAccperiodmonthpk,
				pk_accperiodscheme:this.state.accPeriodpk,
				moduleid:moduleid,
				pageid:this.config.pageCode,
			},
			success: (res) => {
				let {success,data} = res;
				if(data===null || data===undefined || data===''){
					this.props.editTable.setTableData(moduleid,{rows: []});
				}else{
					let currinfodat = data['currinfo']['currinfo'];
					data = data['grid'];
					this.setState({
						currinfodata:currinfodat,
						datamod:data
					})
					if(moduleid == "currinfo"){
						Utils.showFormular(this.props,res,{tableid:"cardTable"});//适配显示公式
						//设置目的币种display
						//this.state.curr = data[moduleid].rows[0].values.oppcurrtype.display;
						this.state.curr = node.refname;
						//加载右卡数据时根据目的币种设置最大折算误差精度	
						this.onSetMaxconverrScale(data[moduleid].rows[0].values.oppcurrtype.value,()=>this.onsetMetaScale(moduleid));//查找该目的币种下的最大误差精度 	
						this.props.cardTable.setTableData(moduleid,data[moduleid]);
						//this.props.cardTable.setTableData(moduleid,data[moduleid],'',false);
					}else{
						Utils.showFormular(this.props,res,{tableid:"editTable"});//适配显示公式
						this.props.editTable.setTableData(moduleid,data[moduleid]);
						setTimeout(() => {
							if(moduleid == "bd_currrate" || moduleid == "bd_adjustrate"){
								this.onSetRefreshScale(currinfodat,data,moduleid);//刷新时加载日汇率和期间汇率业签精度
							}
						},100)
					}
					//.setTableData(data.areaid,"currinfo");
				}
				
				
			}
		})
		
		
	}

	//刷新界面时，加载日汇率和期间汇率界面小数位
	onSetRefreshScale(currinfodat,data,moduleid){
		if(currinfodat){
			data[moduleid].rows.forEach((val,index) => {
				let pk_currinfo = val.values.pk_currinfo.value;//源币种
				currinfodat.rows.forEach(val1 => {
					if(pk_currinfo === val1.values.pk_currinfo.value){
						let ratedigit = val1.values.ratedigit.value;
						if(moduleid === tableid[1]){
							let buyrate = val.values.buyrate.value;
							let rate = val.values.rate.value;
							let sellrate = val.values.sellrate.value;
							buyrate && this.props.editTable.setValByKeyAndIndex(moduleid, index, 'buyrate',  {value:this.getNum(buyrate, ratedigit), display:this.getNum(buyrate,ratedigit),scale:ratedigit});
							rate && this.props.editTable.setValByKeyAndIndex(moduleid, index, 'rate',  {value:this.getNum(rate, ratedigit), display:this.getNum(rate,ratedigit),scale:ratedigit});
							sellrate && this.props.editTable.setValByKeyAndIndex(moduleid, index, 'sellrate',  {value:this.getNum(sellrate, ratedigit), display:this.getNum(sellrate,ratedigit),scale:ratedigit});
						}
						if(moduleid === tableid[2]){
							let adjustrate = val.values.adjustrate.value;
							adjustrate && this.props.editTable.setValByKeyAndIndex(moduleid, index, 'adjustrate',  {value:this.getNum(adjustrate, ratedigit), display:this.getNum(adjustrate,ratedigit),scale:ratedigit});
						}
						
					}
				})
			})
		}
	}
		//点击取消时，加载日汇率和期间汇率界面小数位
	onCancelSetRefreshScale(currinfodat,rows,moduleid){
		if(currinfodat){
			this.oldValue
			rows.forEach((val,index) => {
				let pk_currinfo = val.values.pk_currinfo.value;//源币种
				currinfodat.rows.forEach(val1 => {
					if(pk_currinfo === val1.values.pk_currinfo.value){
						let ratedigit = val1.values.ratedigit.value;

						if(moduleid === tableid[1]){
							let buyrate = val.values.buyrate.value;
							let rate = val.values.rate.value;
							let sellrate = val.values.sellrate.value;
							buyrate && this.props.editTable.setValByKeyAndIndex(moduleid, index, 'buyrate',  {value:this.getNum(buyrate, ratedigit), display:this.getNum(buyrate,ratedigit),scale:ratedigit});
							rate && this.props.editTable.setValByKeyAndIndex(moduleid, index, 'rate',  {value:this.getNum(rate, ratedigit), display:this.getNum(rate,ratedigit),scale:ratedigit});
							sellrate && this.props.editTable.setValByKeyAndIndex(moduleid, index, 'sellrate',  {value:this.getNum(sellrate, ratedigit), display:this.getNum(sellrate,ratedigit),scale:ratedigit});
						}
						if(moduleid === tableid[2]){
							let adjustrate = val.values.adjustrate.value;
							adjustrate && this.props.editTable.setValByKeyAndIndex(moduleid, index, 'adjustrate',  {value:this.getNum(adjustrate, ratedigit), display:this.getNum(adjustrate,ratedigit),scale:ratedigit});
						}
						
					}
				})
			})
		}
	}
	
	
	//选中树或者切换业签时更新按钮状态
	updateButtonStatus(val){
		if(this.state.node && this.state.node.refpk == '~'){
			if(val == 0){
				this.props.button.setDisabled({
					add: true,
					edit:true,
					copy:true,
					delete:true,
					print:true,
					output:true,
					refresh:false
				})
				this.props.button.setButtonsVisible({
					add: true,
					edit:true,
					copy:true,
					delete:true,
					print:true,
					output:true,
					cancel: false, 
					save: false,
					refresh: true,
					addline:false
				});
			}else{
				this.props.button.setDisabled({
					edit:true,
					print:true,
					output:true,
					add:true,
				})
				this.props.button.setButtonsVisible({
					edit:true,
					print:true,
					output:true,
					add: false,
					cancel: false,
					save: false,
					refresh: false,
					copy:false,
					delete:false,
					addline:false,
					
				});
			}
		}else if(this.state.node.nodeData && !this.state.node.nodeData.isScheme ){
			if(val == 0 && this.config.nodeType != 'ORG_NODE'){
				this.props.button.setDisabled({
					add: false,
					edit:false,
					copy:false,
					delete:false,
					print:false,
					output:false,
					refresh: false,
				})
				this.props.button.setButtonsVisible({
					add: true,
					edit:true,
					// cancel: false,
					// save: false,
					refresh: true,
					copy:true,
					delete:true,
					addline:false,
					output:true,
					print:true
				});
			}else if(val == 0 && this.config.nodeType == 'ORG_NODE' ){
				if(!this.state.pk_curOrg){
					this.props.button.setDisabled({
						edit:true,
						copy:true,
						delete:true,
						add:true,
						refresh:false,
						output:false,
						print:false
					});
					this.props.button.setButtonsVisible({
						add: true,
						edit:true,
						cancel: false,
						save: false,
						refresh: true,
						copy:true,
						delete:true,
						addline:false,
						output:true,
						print:true
					});
				}else{
					this.props.button.setDisabled({
						add: false,
						edit:false,
						copy:false,
						delete:false,
						print:false,
						output:false,
						refresh: false,
					})
					this.props.button.setButtonsVisible({
						add: true,
						edit:true,
						refresh: true,
						copy:true,
						delete:true,
						addline:false,
						print:true,
						output:true,
					});
				}
			}else if(val == 2 ){
				if(this.state.accPeriod && this.state.selAccperiodmonth){
					//期间汇率业签时会计期间方案和月份为空时按钮不可用
					this.props.button.setDisabled({
						edit:false,
						print:false,
						output:false,
					})
					this.props.button.setButtonsVisible({
						edit:true,
						print:true,
						output:true,
						add: false,
						cancel: false,
						save: false,
						refresh: false,
						copy:false,
						delete:false,
						addline:false
					});
				}else{
					this.props.button.setDisabled({
						edit:true,
						print:true,
						output:true,
					})
					this.props.button.setButtonsVisible({
						edit:true,
						print:true,
						output:true,
						add: false,
						cancel: false,
						save: false,
						refresh: false,
						copy:false,
						delete:false,
						addline:false
					});
				}
				
			}else{
				if(this.config.nodeType == 'ORG_NODE' && !this.state.pk_curOrg){
					this.props.button.setDisabled({
						edit:true,
						print:true,
						output:true,
					})
					this.props.button.setButtonsVisible({
						edit:true,
						print:true,
						output:true,
						add: false,
						cancel: false,
						save: false,
						refresh: false,
						copy:false,
						delete:false,
						addline:false
					});
				}else{
					this.props.button.setDisabled({
						edit:false,
						print:false,
						output:false,
					})
					this.props.button.setButtonsVisible({
						edit:true,
						print:true,
						output:true,
						add: false,
						cancel: false,
						save: false,
						refresh: false,
						copy:false,
						delete:false,
						addline:false
					});
				}
			}
		}else{
			if(val == 0){
				this.props.button.setDisabled({
					edit:true,
					copy:true,
					delete:true,
					add:false,
					refresh:false,
					print:false,
					output:false,
				})
				this.props.button.setButtonsVisible({
					add: true,
					edit:true,
					copy:true,
					delete:true,
					cancel: false,
					save: false,
					refresh: true,
					print:true,
					output:true,
					addline:false,
				});
				
			}else{
				this.props.button.setDisabled({
					edit:true,
					print:true,
					output:true,
					copy:false,
					delete:false,
					add: false,
					refresh: false,
				})
				this.props.button.setButtonsVisible({
					edit:true,
					print:true,
					output:true,
					add: false,
					cancel: false,
					save: false,
					copy:false,
					delete:false,
					refresh: false,
					addline:false,
				});
			}
        }
        
        // 添加一段，专门负责导入导出按钮的显隐控制
        if(val == 0 || val == 1) {
            this.props.button.setButtonVisible(['Import', 'Export'], true)
        }
        else {
            this.props.button.setButtonVisible(['Import', 'Export'], false)
        }
	}
	componentDidUpdate(){
		let tablenum = this.state.tableNum;
		let tableStatus = 'browse';
		if(tablenum === 0){
			tableStatus = this.props.cardTable.getStatus(tableid[tablenum]);
		}else{
			tableStatus = this.props.editTable.getStatus(tableid[tablenum]);
		}
		
		let schemestatus = this.props.form.getFormStatus(showCode);;
		if((tableStatus != 'add' && tableStatus != 'edit')
		&& (schemestatus != 'add' && schemestatus != 'edit')){
			window.onbeforeunload = null;
		}else{
			window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}
	componentDidMount() {
		//setTimeout(()=>this.updateButtonStatus(this.state.tableNum),10);
		if(this.state.tableNum == 0){
			this.props.button.setDisabled({
				add: true,
				edit:true,
				copy:true,
				delete:true,
				print:true,
				output:true,
			})
			this.props.button.setButtonsVisible({
				cancel: false, 
				save: false,
				refresh: true,
				addline:false
			});
		}
	}

	componentWillMount() {
		let callback = (json) => {
            this.setState({json})
		}
		//let currappcode = this.props.config.appcode?this.props.config.appcode:appcode
        getMultiLang({moduleId: "10140CURT", domainName: 'uapbd',callback})
	}

	//保存单据信息（卡片保存时调用）
	saveData= (tableNum,result=()=>{}) =>  {
		let data,url,tableData;
		let that  = this;
		switch (tableNum){
			case 0:
				this.props.cardTable.filterEmptyRows(tableid[tableNum],keys);
				let cardData,treeData ;
				if(this.state.isCopy){
					cardData= this.props.cardTable.getAllRows(tableid[tableNum]);
					if(cardData && cardData.length>0){
						//因为是复制还未保存到数据库，所以删除的行数据不用管，去掉即可
						let cardData1 = [];
						cardData.forEach( (indexdata,index) => {
							if(indexdata.status!=3){
								cardData1[cardData1.length] = indexdata;
							}
						});
						cardData = cardData1;
						if(cardData && cardData.length>0){
							//复制时清空主键值，目的币种重新赋值
							cardData.forEach( (indexdata,index) => {
								indexdata['values']['pk_currinfo'].value = '';
								indexdata['values']['oppcurrtype'].value = this.state.currpk;
							});
						}
					}
				}else{
					//cardData = this.props.cardTable.getChangedRows(tableid[tableNum]);
					cardData = this.props.cardTable.getAllRows(tableid[tableNum]);
					//let allData =  this.props.cardTable.getAllData(tableid[tableNum]);
					if(cardData && cardData.length>0){
						cardData.forEach( (indexdata,index) => {
							indexdata['values']['oppcurrtype'].value = this.state.currpk;
							if(this.state.node.nodeData && this.state.node.nodeData.isScheme){
								indexdata['values']['pk_exratescheme'].value = this.state.node.refpk;
							}else{
							indexdata['values']['pk_exratescheme'].value = this.state.node.pid;
							}
						});
					}//目的币种赋值
				}
				let saveData= this.props.cardTable.getNumberOfRows(tableid[tableNum],false);
				if(!this.state.currpk ) {
					if(saveData && saveData.length > 0){
						toast({content: this.state.json['10140CURT-000013'], color:'warning'})/* 国际化处理： 下列字段值不能为空[目的币种]*/
						result('err')
						return;
					}	
				}
				if(!this.state.currpk ||!saveData || saveData.length === 0) {
					toast({content: this.state.json['10140CURT-000014'], color:'warning'})/* 国际化处理： 设置源币种或目的币种为空请重新设置*/
					result('err')
					return;
				}
				if(this.state.node.nodeData && this.state.node.nodeData.isScheme){
					//新增保存后父节点pk
					setDefData('pid', this.config.datasource, this.state.node.refpk);//新增保存后父节点pk
				}else{
					//新增保存后父节点pk
					setDefData('pid', this.config.datasource, this.state.node.pid);//新增保存后父节点pk
				}
				setDefData('node', this.config.datasource, this.state.node);
				setDefData('currtyeid', this.config.datasource, this.state['currpk']);//新增保存后节点pk
				if(cardData && cardData.length>0){
					cardData.forEach( (indexdata,index) => {
						indexdata['values']['oppcurrtype'].value = this.state.currpk;
						if(this.state.node.nodeData && this.state.node.nodeData.isScheme){
							indexdata['values']['pk_exratescheme'].value = this.state.node.refpk;
						}else{
							indexdata['values']['pk_exratescheme'].value = this.state.node.pid;
						}
						//indexdata['values']['pk_org'].value = this.config.pk_org;
					});
				}//目的币种赋值
				let cudata = {
					pageid:this.config.pageCode,
					nodeType:this.config.nodeType,
					pk_curOrg:this.state.pk_curOrg || "",
					oppcurrtype:this.state.node.nodeData.oppcutype,
					oppcurredit:this.state.currpk,
					pk_scheme: this.state.node.refpk,
					model : {
						areaType: "table",
						pageinfo: null,
						rows: cardData,//获取页面的rows
						areacode: tableid[0]//添加表单的areacode编码
					}
				};
				let validData ={
					pageid:this.config.pageCode,
					model : {
						areaType: "table",
						pageinfo: null,
						rows: cardData,//获取页面的rows
						areacode: tableid[0]//添加表单的areacode编码
					}
				}
				this.props.validateToSave(validData,()=>{
					ajax({
						url: urls.savecurrinfo,
						data: cudata,
						success: (res) => {
							if (res.success) {
								if (res.data) {
									this.props.cardTable.setTableData(tableid[tableNum],res.data);
									//this.initLeftTree();
									treeData = this.dealTreeData(res.data);
									tableid.forEach(element => {
										this.loadFormData(treeData[0],this.props,element);
										
									});
									this.props.syncTree.addNodeSuccess(this.config.treeId,treeData[0]);
									this.props.syncTree.openNodeByPk(this.config.treeId, treeData[0].pid);//此处应该先展开父节点
									this.props.syncTree.setNodeSelected(this.config.treeId,treeData[0].refpk);
									this.onSelectTreeAfterSave(treeData[0].refpk,treeData[0],true);
									this.setManagemode(this.state.managemode,treeData[0].refpk,treeData[0]);
								}else{						
									let allD = this.props.cardTable.getAllData(tableid[tableNum]);
									this.props.cardTable.setTableData(tableid[tableNum],allD);
									this.props.syncTree.editNodeSuccess(this.config.treeId,getDefData('node', this.config.datasource));
									this.props.syncTree.openNodeByPk(this.config.treeId, getDefData('pid', this.config.datasource));//此处应该先展开父节点
									//选中树节点pk是bd_currinfo主键不是目的币种参照pk
									if(getDefData('node',that.config.datasource).nodeData.isScheme){
										let nodedata = that.state.node.children.find((obj) =>{
											if(obj.nodeData.oppcutype == that.state.currpk){
												return true
											}
										})
										this.props.syncTree.setNodeSelected(that.config.treeId,nodedata.refpk);
										this.onSelectTreeAfterSave(nodedata.refpk,nodedata,true);
										tableid.forEach(key => {
											this.loadFormData(nodedata,this.props,key);
											
										});
									}else if(getDefData('node',this.config.datasource).nodeData.oppcutype != that.state.currpk){
											let parentdata =  this.props.syncTree.getSyncTreeValue(that.config.treeId,getDefData('node',this.config.datasource).pid);
											let childdata = parentdata.children.find((obj) =>{
												if(obj.nodeData.oppcutype == that.state.currpk){
													return true
												}
											})
											this.props.syncTree.setNodeSelected(that.config.treeId,childdata.refpk);
											this.onSelectTreeAfterSave(childdata.refpk,childdata,true);
											tableid.forEach(key => {
												this.loadFormData(childdata,this.props,key);
												
											});
									}else{
										this.props.syncTree.setNodeSelected(this.config.treeId,getDefData('node',this.config.datasource).refpk);
										this.onSelectTreeAfterSave(getDefData('node',this.config.datasource).refpk,getDefData('node',this.config.datasource),true);
										tableid.forEach(element => {
											this.loadFormData(getDefData('node',this.config.datasource),this.props,element);
											
										});
									}
									
									
									
								}
								this.setState({
									flag:true,
									xing:false,//浏览态目的币种必输标识不显示
									isCopy:false,//保存完毕后把状态变回非复制
									isAdd:false,
								});//控制目的币种编辑态
								this.toggleShow("browse");
								//this.props.editTable.setStatus(tableid[tableNum],'browse');
								toast({ color: 'success', title: this.state.json['10140CURT-000015'] });	/* 国际化处理： 保存成功*/
								result('success')
							}
						}
					})
				},{[tableid]: "cardTable"},'grid');
				break;
			case 1:
				url = urls.savecurrrate;
				tableData = this.props.editTable.getChangedRows(tableid[tableNum],true);
				// if(!tableData || tableData.length === 0) {
				// 	toast({content: '没有要保存的数据', color:'info'})
				// 	return;
				// }
				data = {
					pageid:this.config.pageCode,
					currdate:this.state.current,
					model : {
						areaType: "table",
						pageinfo: null,
						rows: tableData,//获取页面的rows
						areacode: tableid[1]//添加表单的areacode编码
					}
				};
				
				break;
			case 2:
				url = urls.saveadjustrate;
				tableData = this.props.editTable.getChangedRows(tableid[tableNum],true);
				// if(!tableData || tableData.length === 0) {
				// 	toast({content: '没有要保存的数据', color:'info'})
				// 	return;
				// }
				data = {
					pageid:this.config.pageCode,
					pk_accperiodscheme:this.state.accPeriodpk,
					yearmonthpk:this.state.selAccperiodmonthpk,
					model : {
						areaType: "table",
						pageinfo: null,
						rows: tableData,//获取页面的rows
						areacode: tableid[2]//添加表单的areacode编码
					}
				};
				
				break;
			case 3:
				url = urls.saveavgrate;
				tableData = this.props.editTable.getChangedRows(tableid[tableNum],true);
				// if(!tableData || tableData.length === 0) {
				// 	toast({content: '没有要保存的数据', color:'info'})
				// 	return;
				// }
				data = {
					pageid:this.config.pageCode,
					model : {
						areaType: "table",
						pageinfo: null,
						rows: tableData,//获取页面的rows
						areacode: tableid[3]//添加表单的areacode编码
					}
				};
				break;
			default:
				break;
		}
		//调用ajax
		//除了折算模式，其他页面都需要上传
		if(tableNum != 0){
			//if(!tableData || tableData.length === 0) return
			//调用ajax
			setTimeout(()=>this.saveDataAjax({url,data,type:tableid[tableNum],result,tableNum}),100);
		}

		
	}
	saveDataAjax({url,data,type,result,tableNum}){
		let that = this;
		console.log('cucuc',JSON.stringify(data));

		let validData = Utils.clone(data);
		delete validData.currdate;
		delete validData.pk_accperiodscheme;
		delete validData.yearmonthpk;
		that.props.validateToSave(validData,()=>{
			ajax({
				url: url,
				data: data,
				success: (res) => {
					if (res.success) {
						if (res.data) {
						//	Utils.filterResult(res.data,res.data.model.rows);//将保存后返回的数据重新放置到页面
							this.props.editTable.setTableData(type,res.data);
							if(type === "bd_adjustrate"){
								this.setState({
									flagg:false
								})
							}
						}else{
							let allD = this.props.editTable.getAllData(type);
							this.props.editTable.setTableData(type,allD);
						}
					//页面进入浏览态，不可编辑
					toast({ color: 'success', title: this.state.json['10140CURT-000015'] });/* 国际化处理： 保存成功*/
					this.toggleShow("browse");
					this.state.canedit = false;//修改保存后日期变为可编辑
					this.props.editTable.setStatus(type,'browse');
					//加载
					tableid.forEach(element => {
						this.loadFormData(that.state.node,this.props,element);
						
					});
					result('success')
					}
					
				}
			})
		},{[tableid[tableNum]]: "editTable"},'grid');
	}
    closeModalEve() {
    	
    }
    onChangeFun() {
    	console.log('onChangeFun');
    }
	
	//切换业签
    choseTab(val){
		let moduleid = "currinfo";
		let currentnum = this.state.tableNum;
		let status;
		if(currentnum == 0){
			status = this.props.cardTable.getStatus(tableid[currentnum])
		}else{
			status = this.props.editTable.getStatus(tableid[currentnum])
		}
		if(status != 'browse'){
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title:this.state.json['10140CURT-000007'],/* 国际化处理： 询问*/
				content:this.state.json['10140CURT-000016'],/* 国际化处理： 是否保存已修改的数据？*/
				beSureBtnClick: ()=>{
					this.saveData(currentnum,(result)=>{
						if(result == 'success'){
							this.setState({
								editMode:false
							},()=>{
								this.onAfterChoseTab({val,moduleid});
							})
						}
						
					});//点击确定保存当前数据，允许切换
				},
				cancelBtnClick:()=>{
					//点击否，不保存数据，切换
					this.onCancel(currentnum);
					this.setState({
						editMode:false
					},()=>{
						this.onAfterChoseTab({val,moduleid});
					})
				},
				beSureBtnName : this.state.json['10140CURT-000017'],//左侧按钮名称/* 国际化处理： 是*/
				cancelBtnName : this.state.json['10140CURT-000018'] /* 国际化处理： 否*/
				})
	
		}else{
			this.onAfterChoseTab({val,moduleid});
		}

		//this.updateButtonStatus(moduleid);
	}

	//切换业签点击事件
	onAfterChoseTab= ({val,moduleid}) => {
        // 切换页签时重新设置一下导入导出的设置
        if(val == 0) {
            this.setState({
                billType: this._judgetImportBillType('currrate')
            }, () => {
                this.props.button.setUploadConfig("Import",excelImportconfig(this.props,"uapbd",this.state.billType,true,"",
                    {'appcode':this.props.config.appcode, 'pagecode':this.props.config.pageCode},()=>{this.buttonClick(this.props, 'refresh')}));
            })
        }
        else if(val == 1) {
            this.setState({
                billType: this._judgetImportBillType('daycurrrate')
            }, () => {
                this.props.button.setUploadConfig("Import",excelImportconfig(this.props,"uapbd",this.state.billType,true,"",
                    {'appcode':this.props.config.appcode, 'pagecode':this.props.config.pageCode},()=>{this.buttonClick(this.props, 'refresh')}));
            })
        }

		if(this.state.editMode == true){
			return;
		}else{
			this.setState({
				tableNum: val,
				//"visibilyBtn":true
			})
		}
		if(val == 2 ){
			moduleid = "bd_adjustrate";
		}
		if(val ==3){
			moduleid = "pk_avgrate";
		}
		if( val ==1){//"bd_currrate","bd_adjustrate","pk_avgrate"
			moduleid = "bd_currrate";
		}
		setTimeout(()=>this.updateButtonStatus(val),10);
		if (this.state.node.refpk == '~' || this.state.node.nodeData.isScheme) {
		
			switch(val){
				case 0:
					setTimeout(() => {
						this.props.cardTable.setTableData(tableid[0],{rows: []});
					})
					break;
				case 1:
					this.state.current = '';
					this.props.editTable.setTableData(tableid[1],{rows: []});;
					break;
				case 2:
					this.setState({
						accPeriod:'',
						selAccperiodmonth:'',
						accPeriodscheme:{},
						accperiodmonth:{},
						flagg:true,
						canedit:true
					})
					this.props.editTable.setTableData(tableid[2],{rows: []});;
					break;
				case 3:
					this.props.editTable.setTableData(tableid[3],{rows: []});;
					break;
			}
			// this.props.editTable.setTableData(tableid[1],{rows: []});
			// this.props.editTable.setTableData(tableid[2],{rows: []});
			// this.props.editTable.setTableData(tableid[3],{rows: []});
            return;
		}else{
			this.setState({
				canedit:false
			})
			this.loadFormData(this.state.node,this.props,moduleid);
			
		}
	}
	//目的币种
	onCurrtypeChange(value){
		this.setState({
			currtype:value,
			curr:value.refname,
			currpk:value.refpk,
		})
		this.onSetMaxconverrScale(value.refpk);

	}
	//根据目的币种设置最大折算误差精度 module函数，currpk当前目的币种pk
	onSetMaxconverrScale(currpk,module = ()=>{}){
		let data = {
			//oppcurrtype:this.state.node.nodeData.oppcutype,
			oppcutype:currpk,//目的币种pk
			//pk_scheme: this.state.node.nodeData.isScheme ? this.state.node.refpk : this.state.node.pid,
		};
		//设置精度
		ajax({
			url: urls.setmaxdigit,
			data: data,
			success: (res) => {
				if (res.success) {
					if (res.data) {
						// let meta = this.props.meta.getMeta();
						// meta["currinfo"].items.find((item) => item.attrcode == 'maxconverr').scale = res.data;
						// this.props.meta.setMeta(meta);
						this.setState({
							scale: res.data
						},()=>module())
					}
				}
			}
		})
	
	}

	//根据目的币种设置当前元数据中最大折算误差精度 加载右卡数据时调用
	onsetMetaScale(moduleid){
		let meta = this.props.meta.getMeta();
		meta["currinfo"].items.find((item) => item.attrcode == 'maxconverr').scale = this.state.scale;
		this.props.meta.setMeta(meta);
	}
	//汇率日期
	onDate(value){
		this.setState({	
			current:value
		},function(){
			//let pk=this.state.selAccperiodmonthpk;
			this.loadFormData(this.state.node,this.props,tableid[1]);
		})

	}
   //会计期间方案
	onAccPeriodChange(value){
			this.setState({
				accPeriodscheme:value,
				accPeriod:value.refname,
				accPeriodpk:value.refpk,
				flagg:false
			})

		
	}
   //会计月份
	onPeriodChange(value){
		let that = this;
		this.setState({
			accperiodmonth:value,
			selAccperiodmonth:value.refname,
			selAccperiodmonthpk:value.refpk
		},function(){
			//let pk=this.state.selAccperiodmonthpk;
			that.loadFormData(this.state.node,this.props,tableid[2]);
			setTimeout(()=>that.updateButtonStatus(2),10);
		})
		
	}

   //外币汇率-业务单元 
	onOrgChange(value){
		this.setState({
			pkorg:value,
			pk_curOrg:value.refpk,
			pk_curOrgName:value.refname
		})
		setTimeout(()=>this.initLeftTree(),10);
		setTimeout(()=>this.updateButtonStatus(this.state.tableNum),10);
	}

	//外币汇率卡删除
	onDeleteCurrinfo(){
		let requestParam = {
            pk_scheme: this.state.node.pid,
			pk_currinfo:this.state.node.refpk,//外币汇率主键
			oppcurrtype:this.state.node.nodeData.oppcutype,//目的币种主键
            pk_curOrg:this.state.pk_curOrg || "",
            nodeType:this.config.nodeType
		};
		ajax({
            url:urls.delvalidatecurrinf,
            data:requestParam,
            success:(result)=>{
                /**************************************************************
                 * 先校验有无删除权限，能删除再做下一步操作
                 **************************************************************/
                if(result.success && result.data){
					if(result.success && result.data){
						promptBox({
							color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
							title:this.state.json['10140CURT-000009'],/* 国际化处理： 确认删除*/
							content:this.state.json['10140CURT-000010'],/* 国际化处理： 您确定要删除所选数据吗?*/
							beSureBtnClick: ()=>{
								promptBox({
									color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
									title:this.state.json['10140CURT-000009'],/* 国际化处理： 确认删除*/
									content:this.state.json['10140CURT-000011'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/
									beSureBtnClick:()=>{
										ajax({
											url:urls.deletecurrinfo,
											data:requestParam,
											success:(result)=>{
												if(result.success){
													this.state.curr = '';
													this.props.cardTable.setTableData(tableid[0],{rows: []});
													this.props.form.EmptyAllFormValue(this.config.formId);
													/**************************************************************
													 * 删除树节点
													 **************************************************************/
													//this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
													/**************************************************************
													 * 删除成功提示，刷新界面
													 **************************************************************/
													this.initLeftTree();
													toast({title:this.state.json['10140CURT-000012'],color:'success'});/* 国际化处理： 删除成功！*/
												}
	
											}
										})
									}
									})
								
							}
							})
						// this.props.modal.show('modal',{
						// 	title: "确认删除",
						// 	content: "您确定要删除所选数据吗?",
						// 	beSureBtnClick: ()=>{
						// 		this.props.modal.show('secondModal', {
						// 			title: "确认删除",
						// 			content: "删除时要做业务引用校验，可能等待时间较长，是否确认删除?",
						// 			beSureBtnClick:()=>{
						// 				ajax({
						// 					url:urls.deletecurrinfo,
						// 					data:requestParam,
						// 					success:(result)=>{
						// 						if(result.success){
						// 							this.state.curr = '';
						// 							this.props.cardTable.setTableData(tableid[0],{rows: []});
						// 							this.props.form.EmptyAllFormValue(this.config.formId);
						// 							/**************************************************************
						// 							 * 删除树节点
						// 							 **************************************************************/
						// 							//this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
						// 							/**************************************************************
						// 							 * 删除成功提示，刷新界面
						// 							 **************************************************************/
						// 							this.initLeftTree();
						// 							toast({content:"删除成功！",title:"提示"});
						// 						}
	
						// 					}
						// 				})
						// 			}
						// 		})
						// 	}
						// })
						
                	}

				}
			}
        });
	}
	//获取列表肩部信息
	getTableHead = () => {
		let {button} = this.props;
		let {createButtonApp} = this.props.button
		//let status = this.props.getUrlParam("status");
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{createButtonApp({
							area: 'card_body',//按钮注册中的按钮区域
							//buttonLimit: 5,
							onButtonClick: this.buttonClick.bind(this)
							//popContainer: document.querySelector('.header-button-area')
					})}	
				</div>	
			</div>
		)
	}

	//外币汇率卡修改
    onEdit = ({tableNum}) => {
		rows= this.props.editTable.getAllRows(tableid[tableNum]);
		let requestParam = {
            pk_scheme: this.state.node.pid,
			pk_currinfo:this.state.node.refpk,//外币汇率主键
			pk_curOrg:this.state.pk_curOrg || "",
			oppcurrtype:this.state.node.nodeData.oppcutype,//目的币种主键
            nodeType:this.config.nodeType
		};
		ajax({
            url:urls.validateurl,
            data:requestParam,
            success:(result)=>{
				if( result.success && result.data){
					this.state.editMode = true;
					this.props.editTable.setStatus(tableid[tableNum],'edit');
					this.setState(this.state, ()=>{
						switch (tableNum) {
							case 0://修改保存折算模式
								this.props.cardTable.setStatus(tableid[tableNum],'edit');
								this.toggleShow("edit");
								this.setState({
									xing:true
								});
								this.state.currpk = this.state.node.nodeData.oppcutype;
								setDefData("curr", this.config.datasource, this.state.curr);
								let cardData= this.props.cardTable.getAllRows(tableid[tableNum]);
								//this.props.cardTable.setColEditableByKey(tableid[tableNum], 'pk_currtype', true)
								this.onEditValidate(cardData,tableNum);
								break;
							case 1://修改保存日汇率
								this.props.editTable.setStatus('bd_currrate', 'edit');
								this.toggleShow("edit");
								this.setState({
									canedit:true
								});
								let  editData= this.props.editTable.getAllRows(tableid[tableNum]);
								this.onEditValidate(editData,tableNum);
								break;
							case 2://修改保存期间汇率
								
								if(this.state.accPeriod&&this.state.selAccperiodmonth){
									this.props.editTable.setStatus('bd_adjustrate', 'edit');
									this.toggleShow("edit");
									this.setState({
										canedit:true,
										flagg:true,
									});
									let  adjustData= this.props.editTable.getAllRows(tableid[tableNum]);
									this.onEditValidate(adjustData,tableNum);
								}else{
									toast({content:this.state.json['10140CURT-000019'],title:"warning"});/* 国际化处理： 会计月份和会计期间方案都不能为空*/
									return;
								}
								break;
							case 3://修改保存平均汇率
								this.props.editTable.setStatus('pk_avgrate', 'edit');
								this.toggleShow("edit");
								let  avgData= this.props.editTable.getAllRows(tableid[tableNum]);
								this.onEditValidate(avgData,tableNum);
								break;
						}
					});
				}
			}
		})
		
		
	}
	//修改时判断是否有当前选中行的维护权
	onEditValidate(cardData,tableNum){
		if( cardData && cardData.length>0){
			cardData.forEach( (indexdata,index) => {
				let pkorg =indexdata['values']['pk_org'].value;
				if(tableNum === 0 && pkorg){
					//点击修改按钮时源币种字段不可编辑
					this.props.cardTable.setEditableByIndex(tableid[tableNum], index, 'pk_currtype', false);
					//this.props.cardTable.setTdEditByIndex(tableid[tableNum], index - 1, 'pk_currtype', false);
				}
				let businessInfo = getBusinessInfo();//编辑行时需要判断是否有权限，无权限的不可编辑
				if(tableNum != 0 && pkorg &&((this.config.nodeType === 'GLOBE_NODE' && pkorg != 'GLOBLE00000000000000')
				||(this.config.nodeType === 'GROUP_NODE' && pkorg != businessInfo.groupId)
				||(this.config.nodeType === 'ORG_NODE' && pkorg != this.state.pk_curOrg)))
				{
					this.props.editTable.setEditableRowByIndex(tableid[tableNum], index, false);
				}
			});
		}
	}
	//按钮取消
	onCancel  = (tableNum) => {
		this.setState({
			flag:true,
			editMode: false,
			canedit:false,
			isCopy:false,
			xing:false//目的币种必输项标识
		});//控制目的币种编辑态
		if(this.state.accPeriod){
			this.setState({
				flagg:false,
			})
		}else{
			this.setState({
				flagg:true
			})
		}
		
		this.toggleShow("browse");
		if(tableNum == 0){
			this.props.cardTable.setStatus(tableid[tableNum],'browse');
			if(this.state.node.nodeData && this.state.node.nodeData.isScheme){
				this.setState({
					currtype:{},
					curr:'',
					currpk:'',
					isAdd:false,
				})
				this.props.cardTable.setTableData(tableid[0],{rows: []});
			}else{
				this.state.curr = getDefData('curr',this.config.datasource);
				let alldata = getDefData('currinfodata',this.config.datasource);
				if(this.state.isAdd){
					this.props.cardTable.setTableData(tableid[tableNum],alldata);
				}else{
					this.props.cardTable.resetTableData(tableid[tableNum]);
				}
				//this.props.editTable.cancelEdit(tableid[tableNum]);
				this.setState({
					currtype:{},
					currpk:'',
					curr: getDefData('curr',this.config.datasource),
					isAdd:false,
				})
			}
		}else{
			this.props.editTable.setStatus(tableid[tableNum],'browse');
			this.props.editTable.cancelEdit(tableid[tableNum]);
			if(tableNum == 1 || tableNum == 2){
				this.onCancelSetRefreshScale(this.state.currinfodata,rows,tableid[tableNum]);
			}
			
		}
	}
	 //切换页面状态
	toggleShow = (status) => {
		let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);	
		let flag = status === 'browse' ? false : true;
		if(status == 'edit' || status == 'add'){
			this.props.button.setButtonVisible(['edit','add','copy','delete','refresh','print','output', 'Import', 'Export'],false);
			this.props.button.setButtonVisible(['save','cancel'],true);
			this.props.button.setButtonVisible(['addline','insertline','delline'],true);
			this.setState({
				disabledSearch:true,
				searchDisable:true
			})
			this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
		}else{
			if(this.state.tableNum===0){
				this.props.button.setButtonVisible(['edit','add','copy','delete','refresh','print','output'],true);
			}else{
				this.props.button.setButtonVisible(['edit','print','output'],true);
            }

            // 特殊控制一下导入导出按钮的显隐性
            if(this.state.tableNum == 0 || this.state.tableNum == 1) {
                this.props.button.setButtonVisible(['Import', 'Export'], true)
            }
            else {
                this.props.button.setButtonVisible(['Import', 'Export'], false)
            }
			this.props.button.setButtonVisible(['save','cancel'],false);
			this.props.button.setButtonVisible(['addline','insertline','delline'],false);
			this.setState({
				disabledSearch:false,
				searchDisable:false
			})
			this.props.syncTree.setNodeDisable(this.config.treeId,false);//编辑时设置整棵树不可用
			//设置当前选中树按钮状态
			//this.setManagemode(this.state.managemode,selectedTreeNode.refpk,selectedTreeNode)
		}
        this.props.cardTable.setStatus(this.tableId1, status);
	};
	//按钮点击事件
	buttonClick=(props, id)=> {	
		let tableNum = this.state.tableNum;//表格的下标
		switch (id) {
			case 'add'://新增
				if(this.config.nodeType == "ORG_NODE" && !this.state.pk_curOrg){
					NCMessage.create({content: this.state.json['10140CURT-000020'], color: 'warning'});//默认top/* 国际化处理： 请选择业务单元*/
					return;
				}
				this.setState({
					flag:false,
					xing:true,
					isAdd:true
				});
				this.state.editMode = true;//设置当前不可切换业签
				this.props.cardTable.setStatus(tableid[0],'edit')
				this.props.cardTable.setColEditableByKey(tableid[0], 'pk_currtype', false)
				setDefData("curr", this.config.datasource, this.state.curr);
				//在子节点上点击新增后将新增前的目的币种值放到缓存
				this.toggleShow("edit");
				let alldata = this.props.cardTable.getAllData(tableid[tableNum]);
				setDefData("currinfodata", this.config.datasource, alldata);
				this.props.cardTable.setTableData(tableid[tableNum],{rows: []});
				this.state.curr = '';
				this.state.currpk = '';
				this.state.currtype = '';
				break;
			case 'edit'://修改
				this.onEdit({tableNum});	
				break;
			case 'copy'://复制
				setDefData("curr", this.config.datasource, this.state.curr);
				this.setState({
					flag:false,
					xing:true,
					curr:'',
					currpk:'',
					currtype:'',
					isCopy:true
				});
				this.props.cardTable.setStatus(tableid[0],'edit');
				//this.props.editTable.setStatus(tableid[0],'edit');//只有折算模式业签可看到复制按钮
				this.props.cardTable.setColEditableByKey(tableid[0], 'pk_currtype', false)
				this.toggleShow("edit");		
				break;
			case 'delete'://删除
				this.onDeleteCurrinfo();	
				break;
			case 'refresh'://刷新左树
				this.refreshAction(tableNum);
				break;
			case 'cancel'://取消 点击复制按钮取消后目的币种值需要在
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140CURT-000021'],/* 国际化处理： 确认取消*/
					content:this.state.json['10140CURT-000022'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick:()=>{this.onCancel(tableNum)}
					})
				//this.onCancel(tableNum);
				break;
			case 'save'://保存
				this.state.editMode = false;
				this.setState(this.state,() =>{
					this.saveData(tableNum);
				});
				break;
			case 'addline':
                this.props.cardTable.addRow(tableid[tableNum]);;
				break;
			case 'print':
				this.output('print');
				break;
			case 'output':
				this.output('output');
                break;
            case 'Export':
                this.setState({
                    selectedPKS:''
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break
            default:
                break;
		}
	}

	//刷新功能
	refreshAction(tableNum){
        if(tableNum != 1) {
            this.props.cardTable.setTableData(tableid[tableNum],{rows: []});
        }
        else {
            this.props.editTable.setTableData(tableid[tableNum],{rows: []})
        }
		this.state.curr = '';
		this.initLeftTree(()=>{
			toast({ color: 'success', title: this.state.json['10140CURT-000023'] });//刷新左树/* 国际化处理： 刷新成功！*/
		});
	}
	//输出和打印功能函数
	output(type=''){
		let tablenum =  this.state.tableNum;
		let url,pk,key;
		const nodekey = ["curlist","currratelist","adjlist","avgrate"];
		let allData ;
		let pks = [];
		switch (tablenum) {
			case 0:
				pk = "pk_currinfo";
				url = urls.currinfoprint;
				key = nodekey[0];
				allData = this.props.cardTable.getAllData(tableid[0]);
				allData.rows.forEach((item)=>{
					pks.push(item.values[pk].value);
				});
				break;
			case 1:
				url = urls.currrateprint;
				key = nodekey[1];
				allData = this.props.editTable.getAllData(tableid[1]);
				allData.rows.forEach((item)=>{
					//pks.push(item.values.pk_currrate.value);
					pks.push(item.values.pk_currinfo.value);
					pks.push(item.values.pk_org.value);
					pks.push(item.values.pk_currtype.value);
					pks.push(this.state.current);
				});
				break;
			case 2:
				pk = "pk_adjustrate";
				url = urls.adjustrateprint;
				key = nodekey[2];
				allData = this.props.editTable.getAllData(tableid[2]);
				allData.rows.forEach((item)=>{
					//pks.push(item.values.pk_adjustrate.value);
					pks.push(item.values.pk_currinfo.value);
					pks.push(item.values.pk_org.value);
					pks.push(item.values.pk_currtype.value);
					pks.push(this.state.accPeriodpk);
					pks.push(this.state.selAccperiodmonthpk);
				});
				break;
			case 3:
				//pk = "pk_avgrate";
				url = urls.avgrateprint;
				key = nodekey[3];
				allData = this.props.editTable.getAllData(tableid[3]);
				allData.rows.forEach((item)=>{
					pks.push(item.values.pk_avgrate.value);
					pks.push(item.values.pk_org.value);
					pks.push(item.values.pk_currtype.value);
				});
				break;
		}

		
	
		if(type=='print'){
			if(pks.length==0){
				toast({color: 'warning', content: this.state.json['10140CURT-000024']});/* 国际化处理： 没有需要打印的数据*/
				return
			}
			//打印
			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				url, 
				{
					billtype:'',  //单据类型
					funcode:appcode,      //功能节点编码，即模板编码
					appcode:appcode,
					nodekey:key,     //模板节点标识
					oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
				}
				);
		}else if(type='output'){
			if(pks.length==0){
				toast({color: 'warning', content: this.state.json['10140CURT-000025']});/* 国际化处理： 没有需要输出的数据*/
				return
			}
			new Promise((resolve)=>{
				this.setState({
					pks: pks,
					key:key,
					url:url
				},()=>{
					resolve('ok')
				});
			}).then((res)=>{
				this.refs.printOutput.open()
			})
			
		}
	}

	//根据pk_currinfo查询当前行汇率小数位数
	queryScale = (pk) =>{
		let ress;
		ajax({
			url: urls.setscalebyrate,
			async:false,
			data: {
				pk_currinfo:pk,//当前操作行的外币汇率主键
				
			},
			success: (res) => {
				if (res.success) {
					if (res.data) {
						ress = res.data;
					}
				}
			}
		})
		return ress;
	}

	//编辑后事件
	onAfterEvent(props, moduleId, key, value, changedrows, index,record,type, method){
		
		if(moduleId === tableid[0] && key === "pk_currtype"){
			//为源币种赋值，根据多选自动增行
            if(JSON.stringify(changedrows) == "[]"||JSON.stringify(changedrows) =='{}'){

                record.values['pk_currtype.name'].display = '';
                record.values['pk_currtype.name'].value = '';
            }else{
				
				if(value.length > 1){
					
					value.forEach((e)=>{
						//支持源币种档案多选 
						props.cardTable.addRow(moduleId,index,{pk_currtype:{value:e.refpk,display:e.refname}});
						this.setDefaultValue(index,props,moduleId);
						index = index + 1;
					})
					let rownum = props.cardTable.getNumberOfRows(moduleId);
					props.cardTable.delRowsByIndex(moduleId, rownum-1);
					
				}else{
					this.setDefaultValue(index,props,moduleId);
				}

			}

		}

		if(moduleId === tableid[0] && key === "ratedigit"){
			console.log('change',changedrows[0])
		}
		let currinfoda = this.state.currinfodata;
		console.log('currinfoda',currinfoda)//折算模式业签数据
		if(moduleId === tableid[1] && (key === "buyrate" || key === "rate" || key === "sellrate") && value){//日汇率页签
			if(value==null)return;
			//改成直接从前台折算模式currinfoda提取小数位数
			//let digit = this.queryScale(record.values.pk_currinfo.value);
			let pk = record.values.pk_currinfo.value;
			this.onAfterSetScale(currinfoda,pk,moduleId,index,key,value,props);
			//校验长度 
			if(value<=-9999999.99999999 || value>9999999.99999999){
				toast({content: this.state.json['10140CURT-000028'],color:'warning'});/* 国际化处理： 输入值必须介于[-9999999.99999999,9999999.99999999]*/
				value = null;
				props.editTable.setValByKeyAndIndex(moduleId, index, key, {value:value, display:value});
				return;
			}
		}
		if(moduleId === tableid[2] && key === "adjustrate" && value){
			if(value==null)return;
			//let digit = this.queryScale(record.values.pk_currinfo.value);
			let pk = record.values.pk_currinfo.value;
			this.onAfterSetScale(currinfoda,pk,moduleId,index,key,value,props);
			if(value<=-9999999.99999999 || value>9999999.99999999){
				toast({content: this.state.json['10140CURT-000028'],color:'warning'});/* 国际化处理： 输入值必须介于[-9999999.99999999,9999999.99999999]*/
				value = null;
				props.editTable.setValByKeyAndIndex(moduleId, index, key, {value:value, display:value});
				return;
			}
		}
		
	}
	//编辑后事件调用，设置精度（日汇率和期间汇率）
	onAfterSetScale(currinfoda,pk,moduleId,index,key,value,props){
		currinfoda.rows.forEach(val => {
			let pk_currinfo = val.values.pk_currinfo.value;
			if(pk_currinfo === pk){
				let digit = val.values.ratedigit.value;
				props.editTable.setValByKeyAndIndex(moduleId, index, key, {value:this.getNum(value, digit), display:this.getNum(value,digit),scale:digit});
			}
		})
	}
	//编辑前事件调用，根据折算模式业签汇率小数ratedigit位数设置日汇率和期间汇率小数attrcode精度
	onSetCurrScale(currinfoda,attrcode,pk,moduleId){
		let meta = this.props.meta.getMeta();
		currinfoda.rows.forEach(val => {
			let pk_currinfo = val.values.pk_currinfo.value;
			if(pk_currinfo === pk){
				meta[moduleId].items.find((item) => item.attrcode == attrcode).scale = val.values.ratedigit.value;
			}
		})
	}
	//日汇率和期间汇率编辑前事件，设置买入价中间件卖出价和期间汇率精度
	onBeforeEvent(props,moduleId, item, index,value, record){
		let currinfoda = this.state.currinfodata;
		console.log('currinfoda',currinfoda)//折算模式业签数据
		if(moduleId === tableid[1] && (item.attrcode === "buyrate" || item.attrcode === "rate" || item.attrcode === "sellrate")){//日汇率页签

			if(value.value && value.value!=null)return true;
			this.onSetCurrScale(currinfoda,item.attrcode,record.values.pk_currinfo.value,moduleId);
		}
		if(moduleId === tableid[2] && item.attrcode === "adjustrate"){
			if(value.value && value.value!=null)return true;
			this.onSetCurrScale(currinfoda,item.attrcode,record.values.pk_currinfo.value,moduleId);
		}
		return true
	}
	setDefaultValue(index,props,moduleId){
		props.cardTable.setValByKeyAndIndex(moduleId, index, 'maxconverr', {value:this.getNum('0',this.state.scale), display:this.getNum('0',this.state.scale),scale:this.state.scale });
		props.cardTable.setValByKeyAndIndex(moduleId, index, 'ratedigit', {value:'5', display:'5' });
		props.cardTable.setValByKeyAndIndex(moduleId, index, 'convmode', {value:'0', display:this.state.json['10140CURT-000026']});/* 国际化处理： 源币种×汇率＝目的币种*/
		//props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_org', {value:'0', display:'0' });
		if(this.config.nodeType === "GLOBE_NODE"){
			props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_org', {value:'GLOBLE00000000000000', display:this.state.json['10140CURT-000027'] });/* 国际化处理： 全局*/
		}
		else if(this.config.nodeType === "GROUP_NODE"){
			let businessInfo = getBusinessInfo();
			props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_org', {value:businessInfo.groupId, display:businessInfo.groupName});
		}
		else{
			props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_org', {value:this.state.pk_curOrg,display:this.state.pk_curOrgName});
		}
	}

	//处理精度
	// getNum(num,n){
    //     let arr = num.toString().split('.'),
    //         str = '';
    //     if(arr.length === 1){
    //         str = arr[0] + '.' + '0'.repeat(n);
    //     }else if(arr[1].length < n){
    //         str = arr[0] + `.${arr[1]}` + '0'.repeat(n - arr[1].length);
    //     }else{
    //         str = arr[0] + `.`+ arr[1].substring(0,n);
	// 	}
    //     return str;
	// }
	
	getNum(numString , n){
		var floatToInteger = function(num){
			var result = { num: 0, digit : 0};
			if(Math.floor(num) == num){//整数直接返回
				result.num = Math.floor(num);
				return result;
			}
			var numstr = num + '';
			var digit  = numString.length - numString.indexOf('.')-1; //位数
			var floorstr = numstr.substring(numString.indexOf('.') + 1, numstr.length);
			var headstr  = numstr.substring(0, numString.indexOf('.'));
			result.num =  (headstr * Math.pow(10,digit) + parseInt(floorstr) );
			result.digit = digit;
			return result;
		};
		var result =  floatToInteger(numString);
		var digit = result.digit;
		var newNumber = result.num;
		if(digit < n){ //补位
			//恢复小数形态 补0 
			var newNumber = newNumber/ (Math.pow(10 ,digit));
			var bwstr =  ( 1 *  Math.pow(10 , n - digit) + '') ;
			var bw = bwstr.substring(1, bwstr.length);
			return (newNumber+ '') .indexOf('.') != -1 ?  newNumber  +  bw : newNumber + '.' + bw;
		}else if(digit > n){ //四舍五入 去掉多余
			//四舍五入前,必须吧最后一位变成小鼠
			var newNumber  = Math.round(newNumber/10) ; //四舍五入
			newNumber = newNumber/ (Math.pow(10 ,digit - 1)); //恢复小数形态
			//缺少部位,多余截掉
			newNumber = newNumber+ '';
			if(newNumber.indexOf('.') == -1){ //缺位部位
				var bwstr =  ( 1 *  Math.pow(10 , n) + '') ;
				var bw = bwstr.substring(1, bwstr.length);
				return newNumber + '.' + bw;
			}
			var weicha = newNumber.length - newNumber.indexOf('.') - 1;
			if( weicha > n ){ //消位
			   return newNumber.substring(newNumber.indexOf('.') - 1, newNumber.indexOf('.')  + n)
			}
			if( weicha  < n ){ //补0
				var bwstr =  ( 1 *  Math.pow(10 , n - weicha) + '') ;
				var bw = bwstr.substring(1, bwstr.length);
				return newNumber + bw;
			}
			else{
				return   newNumber;
			}
		   
		}
		return numString;
   }
	onSelectedFn(){

	}
	closeModalEve() {
    	this.props.modal.close(modalId);
	}
	render() {
		const { table, button, search, form, editTable, syncTree, modal, DragWidthCom, cardTable, BillHeadInfo } = this.props;
        const { createSyncTree } = syncTree;
        const {createBillHeadInfo} = BillHeadInfo;
		//let { createButton } = button;
		let { createButtonApp } = button;
    	let { createForm } = form;
    	const { createCardTable } = cardTable;
    	const { createEditTable } = editTable;
    	let { NCCreateSearch } = search;
		let { createModal } = modal;
		let orgPermCondition=function(){
            return {
                AppCode:appcode,
                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
            }
        }
        console.log("billType is ^")
        console.log(this.state.billType)
		return (
			<div>
				{createModal(modalId, {
					title:this.state.json['10140CURT-000029'],/* 国际化处理： 外币汇率方案*/
					size:'xlg',			//模态框大小 sm/lg/xlg
					beSureBtnClick: this.onSaveCttermtype.bind(this), //点击确定按钮事件
					cancelBtnClick: ()=>{
						promptBox({
							color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
							title:this.state.json['10140CURT-000030'],/* 国际化处理： 确认关闭*/
							content:this.state.json['10140CURT-000031'],/* 国际化处理： 是否确认要关闭？*/
							beSureBtnClick:()=>{
								this.props.modal.close(modalId);
								this.props.form.setFormStatus(showCode,'browse');}
							})
					},
					closeModalEve: this.closeModalEve, 			//关闭按钮事件回调
					userControl:true,//自己控制什么时候关闭窗口
					content: function() {
						return (
							<div>
								{createForm(showCode, {

								})}
							</div>
						)
					}.bind(this)(),
				})}
				{createModal('modal', {
					title:this.state.json['10140CURT-000032'],/* 国际化处理： 外币汇率方案删除*/
					size:'xlg',
				})}
				{createModal('secondModal', {
					title:this.state.json['10140CURT-000033'],/* 国际化处理： 外币汇率方案删除弹框*/
					size:'xlg',	
				})}
				{createModal('SaveModal', {
					title:this.state.json['10140CURT-000034'],/* 国际化处理： 外币汇率业签切换模态框*/
					size:'xlg',	
				})}
				<div className="nc-bill-tree-card">
					<NCDiv className="header" areaCode={NCDiv.config.HEADER}>
                        {createBillHeadInfo(
                            {
                                title: this.state.json[this.config.title],
                                backBtnClick:()=>{},
                                initShowBackBtn: false
                            }
                        )}
						{this.config.nodeType == 'ORG_NODE' &&
						<div className="search-box">
						{BusinessUnitTreeRef({
                                fieldid: 'businessunittree',
								isTreelazyLoad:false,
								queryCondition:orgPermCondition,
								placeholder: this.state.pk_curOrgName,
								onChange:this.onOrgChange.bind(this),
								value:this.state.pkorg,
								disabled:this.state.searchDisable,
								queryCondition: function(){
									return {
										"AppCode": '10140CURTO',//外币汇率-业务单元 
										 TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
									}
								}.bind(this)
							})}
						</div>
						}
						<div className="header-button-area">
							{createButtonApp({
								area: 'card_head',//按钮注册中的按钮区域
								onButtonClick: this.buttonClick.bind(this)
							})}
						</div>
					</NCDiv>
				</div>
				<div className="tree-card">
					<DragWidthCom
						defLeftWid = '280px'
						leftDom = {
							<div className = "tree-area">
								{createSyncTree({
					                treeId : this.config.treeId,
					                needEdit: true,   //不启用编辑
					                showLine: false,  //显示连线
					                needSearch: true, //是否需要搜索框
					                onSelectEve: this.onSelectTree.bind(this),			 //选择
					                onMouseEnterEve: this.onMouseEnterEve.bind(this),
					                clickEditIconEve: this.onEditCttermtype.bind(this),  //编辑点击 回调
					                clickAddIconEve: this.onAddCttermtype.bind(this),    //新增点击 回调
					                clickDelIconEve: this.onDeleteCttermtype.bind(this), // 删除点击 回调
									showModal: false,
									disabledSearch:this.state.disabledSearch,
				                })}
							</div>
						}
						rightDom = {
							<div>
								<div className="container">
				                    <NCTabsControl defaultKey={0}>
				                        <div key={0} clickFun={this.choseTab.bind(this, 0)}>
				                            {this.state.json['10140CURT-000037']/* 国际化处理： 折算模式*/}
				                        </div>
				                        <div key={1} clickFun={this.choseTab.bind(this, 1)}>
				                            {this.state.json['10140CURT-000038']/* 国际化处理： 日汇率*/}
				                        </div>
				                        <div key={2} clickFun={this.choseTab.bind(this, 2)}>
				                            {this.state.json['10140CURT-000039']/* 国际化处理： 期间汇率*/}
				                        </div>
				                        <div key={3} clickFun={this.choseTab.bind(this, 3)}>
				                            {this.state.json['10140CURT-000040']/* 国际化处理： 平均汇率*/}
				                        </div>
				                    </NCTabsControl>
				                </div>
				            	{/*
				            		期间汇率
				            	*/}
				            	{this.state.tableNum == 2 
									? <div className="header-button-area nc-bill-tableTab-area">
		      							<ul className='header-buttonlist'>
											<li>
												<span className='header-button nc-theme-common-font-c'>{this.state.json['10140CURT-000041']/* 国际化处理： 目的币种*/}</span>
												<span className='header-button-input' fieldid='currtypegridspan'>
													{CurrtypeGridRef({
                                                        fieldid: 'currtypegrid',
														placeholder: this.state.curr,
														value:this.state.currpk,
														disabled:this.state.flag,
														queryCondition: function(){
															return {
																//"pk_accperiodscheme":  this.state.selAccperiodscheme.refpk || '0001Z000000000000001'
															}
														}.bind(this)
													})}
												</span>	
											</li>
											<li>
												<span className='header-button nc-theme-common-font-c'>{this.state.json['10140CURT-000042']/* 国际化处理： 会计期间方案*/}</span>
												<span className='header-button-input' fieldid='accperiodspan'>
													{AccPeriodSchemeDefaultTreeRef({
                                                        fieldid: 'accperiod',
														placeholder:this.state.accPeriod,
														onChange:this.onAccPeriodChange.bind(this),
														value:this.state.accPeriodscheme,
														disabled:this.state.canedit,
													})}
												</span>	
											</li>
											<li>
												<span className='header-button nc-theme-common-font-c'>{this.state.json['10140CURT-000043']/* 国际化处理： 会计月份*/}</span>
												<span className='header-button-input' fieldid='accperiodtreespan'>
													{AccPeriodDefaultTreeGridRef({
                                                        fieldid: 'accperiodtree',
														placeholder: this.state.selAccperiodmonth,
														onChange:this.onPeriodChange.bind(this),
														value:this.state.accperiodmonth,
														disabled:this.state.flagg,
														queryCondition: function(){
															return {
																"pk_accperiodscheme":  this.state.accPeriodpk 
															}
														}.bind(this)
													})}
												</span>	
											</li>
										</ul>

		      							{createEditTable(firstCode, {
											  onAfterEvent : this.onAfterEvent.bind(this),
                                              onBeforeEvent: this.onBeforeEvent.bind(this),  
                                              adaptionHeight: true     
										  })}
									</div>
									: <div></div>
				            	}
				            	{/*
				            		折算模式
				            	*/}
				            	{this.state.tableNum == 0
									? <div className="header-button-area nc-bill-tableTab-area">
	      								<ul className='header-buttonlist'>
											<li>	
												<span className={this.state.xing? 'xing':'xingHidden'}>*</span>
												<span className='header-button nc-theme-common-font-c'>{this.state.json['10140CURT-000041']/* 国际化处理： 目的币种*/}</span>
												<span className='header-button-input' fieldid='currtypegrid2span'>
													{CurrtypeGridRef({
                                                        fieldid: 'currtypegrid2',
														placeholder: this.state.curr,
														onChange:this.onCurrtypeChange.bind(this),
														value:this.state.currtype,//this.state.curr,
														disabled:this.state.flag,
														queryCondition: function(){
															return {
																//"pk_accperiodscheme":  this.state.selAccperiodscheme.refpk || '0001Z000000000000001'
															}
														}.bind(this)
													})}
												</span>	
											</li>
										</ul>

	      								<div className = "nc-bill-table-area">
											{createCardTable("currinfo", {
												onAfterEvent : this.onAfterEvent.bind(this), 
												onSelected: this.onSelectedFn,
												tableHead: this.getTableHead.bind(this),
											})}
	      								</div>
									</div>
									: <div></div>
				            	}
								{/*
				            		日汇率
				            	*/}
				            	{this.state.tableNum == 1
									? <div  className="header-button-area nc-bill-tableTab-area">
										<ul className='header-buttonlist'>
											<li>
												<span className='header-button nc-theme-common-font-c'>{this.state.json['10140CURT-000041']/* 国际化处理： 目的币种*/}</span>
												<span className='header-button-input' fieldid='currtypegrid3span' >
													{CurrtypeGridRef({
                                                        fieldid: 'currtypegrid3',
														placeholder: this.state.curr,
														value:this.state.curr,
														disabled:this.state.flag,
														queryCondition: function(){
															return {
																//"pk_accperiodscheme":  this.state.selAccperiodscheme.refpk || '0001Z000000000000001'
															}
														}.bind(this)
													})}
												</span>	
											</li>
											<li>
												<span className='header-button nc-theme-common-font-c'>{this.state.json['10140CURT-000044']/* 国际化处理： 汇率日期*/}</span>
												<span className='header-button-input' fieldid='currdatespan'>
												<NCTZDatePickClientHourTime
												fieldid="currdate"
												format={ 'YYYY-MM-DD'}
												placeholder={this.state.current}
												value={this.state.current}
												disabled={this.state.canedit}
												onChange={this.onDate.bind(this)}
												/>
												</span>	
											</li>
										</ul>
  
										  {createEditTable("bd_currrate", {
											  onAfterEvent : this.onAfterEvent.bind(this),
                                              onBeforeEvent: this.onBeforeEvent.bind(this),  
                                              adaptionHeight: true     
										  })}
									</div>
									: <div></div>
				            	}
								{/*
				            		平均汇率
				            	*/}
				            	{this.state.tableNum == 3
									? <div className="header-button-area nc-bill-tableTab-area">
	      								{createEditTable("pk_avgrate", {
                                              adaptionHeight: true
                                          })}
									</div>
									: <div></div>
				            	}
							</div>

						}
					/>
				</div>
				<PrintOutput
					ref = 'printOutput'
					url = {this.state.url}
					data = {{
						funcode: appcode,      //功能节点编码，即模板编码
						appcode:appcode,
						nodekey: this.state.key,     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
				>
				</PrintOutput>
                <ExcelImport
                    {...this.props}
                    moduleName = 'uapbd'//模块名
                    pagecode={this.props.config.pageCode}
                    appcode={this.props.config.appcode}
                    billType = {this.state.billType}//单据类型
                    selectedPKS = {this.state.selectedPKS}
                />
			</div>
		)
	}
}

export default CurrinfoClass = createPage({
	billinfo:[{
        billtype: 'grid',
        pagecode: "10140CURT_adjustrate",
        bodycode: [tableid[0],tableid[1],tableid[2],tableid[3]]
    },{
		billtype: 'form',
        pagecode: "10140CURT_adjustrate",
        headcode:'exratescheme'
	}],
	initTemplate: initTemplate,
	mutiLangCode:'10140CURT'
})(CurrinfoClass);

//ReactDOM.render(<CurrinfoClass/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65