//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, high,promptBox,cardCache,createPageIcon, getBusinessInfo } from 'nc-lightapp-front';
import { Table,Record } from '../../../public/excomponents';
import {component} from '../../../public/platwapper/index.js';
const { NCButton,NCSelect } = component;
const { NCAffix,NCPopconfirm,NCFormContro, NCCheckbox,NCFormControl,NCBackBtn,NCDiv} = base;
const {PrintOutput} = high;
import createUIDom from "../../../public/utils/BDCreateUIDom";
import './index.less';
import deepClone from "../../../public/utils/deepClone.js"
//参数参照
import ParamGridRef from  '../../../../uapbd/refer/param/ParamGridRef'
import Refer from '../../../public/platwapper/compwapper/Refer';
import MeasdocDefaultGridRef from '../../../../uapbd/refer/material/MeasdocDefaultGridRef';
const formId = 'head';                      //表头id
const tableId = 'paraminfo';            //子表id
const pageId = '10140CSSPD_configparam_card';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='0001Z0100000000012Q7';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/paramsys/pagequery.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/paramsys/save.do';             //新增保存
const updateUrl = '/nccloud/uapbd/paramsys/save.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/paramsys/del.do';         //删除
const printUrl = '/nccloud/uapbd/paramsys/print.do';  //分页查询url
const pk_item = 'pk_sysconfig_id';               //单据主键--用于卡片查询刷新
const titleCode = 'billparamno';            //单据编码--用于卡片表头显示
const queryTemplateUrl = '/nccloud/uapbd/paramsys/queryTemplate.do';
const submitBackConfirmUrl = '/nccloud/uapbd/paramsys/submit.do';
const codeRuleUrl = '/nccloud/uapbd/paramsys/coderule.do';

const {setDefData, getDefData,addCache,deleteCacheById } = cardCache;
const dataSource = "paramsys-list";
const key_list = "key_list";

// let initTemplate =(props)=>{
// 	props.createUIDom(
// 		{
// 			pagecode: pageId,//页面id
//             // appid: appId,//注册按钮的id
//             // appcode:'10140CSSPD'
// 		}, 
// 		function (data){
//             console.log("data");
//             console.log(data);
// 			if(data){
// 				if(data.template){
// 					let meta = data.template;
// 					modifierMeta(props, meta)
// 					props.meta.setMeta(meta);
// 					// let status = props.getUrlParam('status');
// 					// if(status && status == 'add'){
// 					// 	props.cardTable.addRow(tableId);
// 					// }
// 				}
// 				if(data.button){
// 					let button = data.button;
//                     props.button.setButtons(button);
//                     console.log('initTemplate');console.log(props);
//                     console.log(props.button.getButtons());
//                     toggleShow(props);
//                 }
// 			}   
// 		}
// 	)
// }

// //切换页面状态
// function toggleShow(props){
//     let status = props.getUrlParam('status');
//     let flag = status === 'browse' ? false : true;
//     props.button.setButtonVisible(['submit','subback','confirm'],false);
// 	//按钮的显示状态
// 	if(status == 'edit' || status == 'add'){
// 		props.button.setButtonVisible(['edit','add','back','delete','refresh','print','submit','subback','confirm'],false);
// 		props.button.setButtonVisible(['save','cancel','addline','delline'],true);
// 		//props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
// 	}else{
// 		props.button.setButtonVisible(['save','cancel','addline','delline'],false);
// 		props.button.setButtonVisible(['add','edit','delete','back','refresh','print'],true);
//         //props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
//         let l_approvestatus = props.form.getAllFormValue(formId).rows[0].values['approvestatus'].value;console.log(l_approvestatus);
//         if(l_approvestatus == -1){//自由
//             props.button.setButtonVisible(['submit'],true);
//         }else if(l_approvestatus == 3){//提交
//             props.button.setButtonVisible(['subback','confirm'],true);
//         }else if(l_approvestatus == 1){//审批通过
//             props.button.setButtonVisible(['submit','subback','confirm'],false);
//         }

//     }

// 	props.form.setFormStatus(formId, status);
// 	props.cardTable.setStatus(tableId, status);
// };

// function modifierMeta(props, meta) {
// 	let status = props.getUrlParam('status');
// 	meta[formId].status = status;
// 	meta[tableId].status = status;

//     //修改参照refcode
//     let formItems = meta[formId].items;
//     for(let i = 0; i < formItems.length; i++){
//         if(formItems[i].attrcode === 'pk_org'){console.log('修改参照pkorg');
//             // formItems[i].refcode = '../../../../uapbd/refer/org/AssignedOrgTreeRef/index';
//             //formItems[i].refcode = '../../../../uapbd/refer/org/OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData/index.js';
//             formItems[i].refcode = '../../../../uapbd/refer/org/OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef/index.js';
//             formItems[i].queryCondition = {
//                 isbusinessunit: 'Y',
//                 TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
//             };
//         }
//     }

//     let tableItems = meta[tableId].items;console.log(tableItems);
//     for(let i = 0; i < tableItems.length; i++){
//         if(tableItems[i].attrcode === 'paramcode'){console.log('修改参照');
//             tableItems[i].refcode = '../../../../uapbd/refer/param/ParamGridRef/index.js';
//             //参数组织过滤
//             tableItems[i].queryCondition = () => {
//                 let pk_org = props.form.getFormItemsValue(formId,'pk_org').value;
//                 console.log('modifierMeta pkorg = '+pk_org);
//                 // return {pk_org : pk_org};
//                 return{
//                     pk_org : pk_org,
//                     GridRefActionExt:'nccloud.web.uapbd.ref.param.ParamGridRefExt'
//                 }
//             };
//         }
//     }

// 	let porCol = {
// 		attrcode: 'opr',
// 		label: '操作',
//         visible: true,
//         itemtype: 'customer',
// 		className:'table-opr',
// 		width:200,
// 		fixed:'right',
// 		render(text, record, index) {
// 			let status = props.cardTable.getStatus(tableId);
// 			return status === 'browse' ? (
// 				<span
//     				onClick={() => {
//                         props.cardTable.toggleRowView(tableId, record)

//                     }}
//                     > 展开
//              	</span>
// 			):(<div className="currency-opr-col">
// 					<span
// 						className="currency-opr-del"
// 						onClick={(e) => {
// 							props.cardTable.openModel(tableId, 'edit', record, index);
// 							e.stopPropagation();
// 						}}
// 					>更多</span>
// 					&nbsp;&nbsp;
// 					<span
// 						className="currency-opr-del"
// 						onClick={(e) => {
// 							props.cardTable.delRowsByIndex(tableId, index);
// 							e.stopPropagation();
// 						}}
// 					><a>删除</a></span>
// 				</div>
// 	        );
// 		}
//     };
// 	meta[tableId].items.push(porCol);

// 	return meta;
// }
 

class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = formId;
        this.searchId = searchId;
        this.tableId = tableId;
        this.id = null;
        this.codeRule = null;
        this.state = {
            pk_org : '',
            title_code : '',
            totalcount : 0,
            applycount : 0,
            paramTemplate : {},
            colsSettingParam :{//列表配置更新列宽
                appcode:'10140CSSPD',//应用编码
                pagecode:'10140CSSPD_configparam_card',//页面编码
                code:'10140CSSPD_configparam_card',//模板编码
                pageid:'0001Z010000000005JAN',//模板主键   
                areaCode:'paraminfo',//主表/拉平表 的区域编码
                areaId:'0001Z010000000005JAO',//区域主键
            }
        }
        this.initTemplate(props);

    }
    componentDidMount() {
        // this.getParamTemplate();
        // if(!this.lang) return;
        //this.toggleShow(this.props);
        let status = this.props.getUrlParam('status');

        if(status == 'add' || status == 'edit'){
            if(this.lang){
                this.table.editMode();
            }
        }
        if(status == 'edit'){
            setTimeout(()=>{this.props.form.setFormItemsDisabled(this.formId,{billparamno:true});},500);//单据号不可修改
        }
        if(status == 'add'){
            try{
                this.getCodeRule();
            }catch(e){
                console.error(e);
            }
        }
        this.pk = this.props.getUrlParam('id');
        if(status != "add"){
            this.pk = this.props.getUrlParam('id');
            if(this.pk && this.pk != 'undefined'){
                setTimeout(()=>{this.getdata(this.pk)},1000);
            }
        }
        else{
            setTimeout(()=>{this.setDefaultValue();},1000);
        }

        this.props.button.setDisabled({'delline':true});
        let businessInfo = getBusinessInfo()
        if(businessInfo) {
            this.currUserId = businessInfo.userId
        }
    }

    componentDidUpdate(){
        if(!this.lang) return;
        let formStatus = this.props.form.getFormStatus(this.formId);
        if(formStatus != 'add' && formStatus != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    initTemplate = (props)=>{
        createUIDom(props)({pagecode: pageId},{moduleId: "10140CSSPD",domainName: 'uapbd' }, (data, lang)=> {
            console.log(data);
            this.lang = lang;
            this.ComponentConfig = this.initConfig(data);
            if(data.template){
                let meta = data.template;
                this.modifierMeta(props, meta);
                let status = props.getUrlParam('status');
                let  columnConfig = this.state.colsSettingParam
                columnConfig.code=data.template.code?data.template.code:this.state.colsSettingParam.code
                columnConfig.pageid = data.template.pageid?data.template.pageid:this.state.colsSettingParam.pageid
                columnConfig.areaId=data.template.paraminfo?data.template.paraminfo.oid:this.state.colsSettingParam.areaId
                this.setState({
                    colsSettingParam:columnConfig
                })
                if(status == 'add'){
                    props.form.setFormStatus(formId, 'add');
                }
                props.meta.setMeta(meta);
                // let status = props.getUrlParam('status');
                // if(status && status == 'add'){
                // 	props.cardTable.addRow(tableId);
                // }
            }
            if(data.button){
                let button = data.button;
                props.button.setButtons(button);
                console.log('initTemplate');console.log(props);
                console.log(props.button.getButtons());
                this.toggleShow(props);
            }
        });
    }

    //切换页面状态
    toggleShow = (props) => {
        let status = props.getUrlParam('status');
        let flag = status === 'browse' ? false : true;
        props.button.setButtonVisible(['submit','subback','confirm'],false);
        //按钮的显示状态
        if(status == 'edit' || status == 'add'){
            props.button.setButtonVisible(['edit','add','back','delete','refresh','print','submit','subback','confirm'],false);
            props.button.setButtonVisible(['save','cancel','addline','delline'],true);
            //props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else{
            props.button.setButtonVisible(['save','cancel','addline','delline'],false);
            props.button.setButtonVisible(['add','edit','delete','back','refresh','print'],true);
            //props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            let l_approvestatus = props.form.getAllFormValue(formId).rows[0].values['approvestatus'].value;console.log(l_approvestatus);
            if(l_approvestatus == -1){//自由
                props.button.setButtonVisible(['submit'],true);
            }else if(l_approvestatus == 3){//提交
                props.button.setButtonVisible(['subback','confirm'],true);
            }else if(l_approvestatus == 1){//审批通过
                props.button.setButtonVisible(['submit','subback','confirm'],false);
            }

            let parampk = props.form.getFormItemsValue(formId,pk_item);
            if(parampk == null || parampk.value == null || parampk.value.length < 1){//空表单
                props.button.setButtonVisible(['edit','delete','back','refresh','print'],false);
            }
        }

        props.form.setFormStatus(formId, status);
        props.cardTable.setStatus(tableId, status);
    };

    modifierMeta = (props, meta) => {
        let status = props.getUrlParam('status');
        meta[formId].status = status;
        meta[tableId].status = status;

        //修改参照refcode
        let formItems = meta[formId].items;
        for(let i = 0; i < formItems.length; i++){
            if(formItems[i].attrcode === 'pk_org'){console.log(this.lang['10140CSSPD-000100']);/* 国际化处理： 修改参照pkorg*/
                // formItems[i].refcode = '../../../../uapbd/refer/org/AssignedOrgTreeRef/index';
                // formItems[i].refcode = '../../../../uapbd/refer/org/OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData/index.js';
                //formItems[i].refcode = '../../../../uapbd/refer/org/OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef/index.js';
                formItems[i].refcode = '../../../../uapbd/refer/org/OrgByParaUsedTreeRef/index.js';
                formItems[i].queryCondition = {
                    isbusinessunit: 'Y',
                    TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder",
                    isSetFilter:'Y'//组织权限过滤
                };
            }
        }

        let tableItems = meta[tableId].items;console.log(tableItems);
        for(let i = 0; i < tableItems.length; i++){
            if(tableItems[i].attrcode === 'paramcode'){console.log(this.lang['10140CSSPD-000101']);/* 国际化处理： 修改参照*/
                tableItems[i].refcode = '../../../../uapbd/refer/param/ParamGridRef/index.js';
                //参数组织过滤
                tableItems[i].queryCondition = () => {
                    let pk_org = props.form.getFormItemsValue(formId,'pk_org').value;
                    console.log('modifierMeta pkorg = '+pk_org);
                    // return {pk_org : pk_org};
                    return{
                        pk_org : pk_org,
                        GridRefActionExt:'nccloud.web.uapbd.ref.param.ParamGridRefExt'
                    }
                };
            }
        }

        let porCol = {
            attrcode: 'opr',
            key: 'opr',
            label: this.lang['10140CSSPD-000102'],/* 国际化处理： 操作*/
            visible: true,
            itemtype: 'customer',
            className:'table-opr',
            width:200,
            fixed:'right',
            render: (text, record, index) => {
                let status = props.cardTable.getStatus(tableId);
                return status === 'browse' ? (
                    <span
                        onClick={() => {
                            props.cardTable.toggleRowView(tableId, record)

                        }}
                    > {this.lang['10140CSSPD-000136']}
                     </span>
                ):(<div className="currency-opr-col">
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.openModel(tableId, 'edit', record, index);
                                e.stopPropagation();
                            }}
                        >{this.lang['10140CSSPD-000137']}</span>
                        &nbsp;&nbsp;
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.delRowsByIndex(tableId, index);
                                e.stopPropagation();
                            }}
                        ><a>{this.lang['10140CSSPD-000138']}</a></span>
                    </div>
                );
            }
        };
        meta[tableId].items.push(porCol);
        return meta;
    }

    //处理选择框下拉列表数据
    handerVauelist(valstrings = ''){
        var kvs = [];
        console.log(valstrings);
        if(valstrings.startsWith('C,')){ //“C,开头的需要按照json解析”
            var strs = valstrings.substr(2,valstrings.length);
            strs.split(',').forEach(valstr => {
                var kvstr = valstr.split('='),
                    kv = {
                        key : kvs[0],
                        val : kvs[1]
                    };
                if(kv.key&&kv.val){
                    kvs.push(kv);
                }
            });
            console.log(kvs);
            return kvs;
        }
        var valstrs = valstrings.startsWith('I,') ? valstrings.substr(2,valstrings.length) :  valstrings;
        valstrs.split(',').forEach(kv => {
            if(kv){
                kvs.push({
                    key : kv,
                    val :kv
                });
            }
        });
        console.log(kvs);
        return kvs;
    }
    //参照回写方法
    /*(id,param){
        console.log('createCfg');
        console.log(id);
        console.log(param);
        var obj={
            // value:this.state.configs[id]?this.state.configs[id].value:[],
            onChange:function (val) {
                console.log('createCfg.onChange--'+val);
                console.log(val);
                // this.state.curOrg = val.refpk;
                // this.loadTree();//重新加载树
                // var temp= Object.assign(this.state.configs[id],{value:val});
                // this.setState(Object.assign (this.state.configs,temp));
            }.bind(this)
        }
        // this.state.configs[id]=obj;
        var result_param= Object.assign(obj, param)
        return result_param;
    }*/
    onParamChange(val,record, index){
        console.log('onParamChange');
        console.log(this.props);
        console.log(val);console.log(record);console.log(index);
    }
    //编码规则
    getCodeRule(){
        ajax({
            url:codeRuleUrl,
            success:(res)=>{
                if(res.success){
                    this.codeRule = res.data;
                    try{
                        let meta = this.props.meta.getMeta();
                        this.props.form.setFormItemsValue(this.formId,{billparamno:{value:this.codeRule.newCode}});
                        this.props.form.setFormItemsDisabled(this.formId,{billparamno:!this.codeRule.isCodeEdit});
                    }catch(e){
                        console.error(e);
                    }
                }
            }
        });
    }
    initConfig(data){
        let paramcodeItem={},paramnameItem={},paramvalueItem={},oldparamvalueItem={},paramvaluelistItem={},controlflagItem={},oldcontrolflagItem={},paramnoteItem={}
         debugger
        if(data.template){
            let meta = data.template; 
            meta.paraminfo.items.forEach((item)=>{
                if(item.attrcode =='paramcode'){
                  paramcodeItem=Object.assign(item,{
                    title: this.lang['10140CSSPD-000104'],/* 国际化处理： 参数代码*/
                  //  require: true,
                    dataIndex: 'paramcode',
                    attrcode: 'paramcode',
                    key: 'paramcode',
                    editer: (record, index, table) => {
                        var rcd = table.getDirtyOperation().findRecordById(record.getId()),
                            data = rcd.getData();
                        return (
                            ParamGridRef({
                                onChange:(val)=>{console.log(val);
                                    var rcd = table.getDirtyOperation().findRecordById(record.getId()),
                                        data = rcd.getData();
                                    if(val == null || val.values == null || val.values.sysinit == null){
                                        data = {...data, ...{paramcode:null,realparamcode:null,paramname:null, refValue: null}};
                                        data = {...data,...{valuetype:null,stateflag:null,paramvalue:null,oldparamvalue:null,paramvaluelist:null}};//valuetype=数据类型，stateflag=渲染类型，paramvalue=参数值，valuelist=取值范围
                                        rcd.setData(data);
                                        table.getDirtyOperation().updateRecord(rcd);
                                        return;
                                    }
                                    // data = {...data, ...{initname:val.refname,initcode:val.refcode,paramcode:val.refpk,realparamcode:val.refcode,paramname:val.renname, refValue: val}};
                                    //多语
                                    data = {...data, ...{paramname:val.values['initname as initnameExt'].value,initname:val.values['initname as initnameExt'].value,paramcode:val.refpk,initcode:val.refpk,realparamcode:val.refcode, refValue: val}};
                                    console.log(this.state.paramTemplate);
                                    let ptemplate = this.state.paramTemplate[val.values.sysinit.value];
                                    data = {...data,...{valuetype:ptemplate.valuetype,stateflag:ptemplate.stateflag,paramvalue:ptemplate.defaultvalue,oldparamvalue:ptemplate.defaultvalue,paramvaluelist:ptemplate.valuelist}};//valuetype=数据类型，stateflag=渲染类型，paramvalue=参数值，valuelist=取值范围
                                    rcd.setData(data);
                                    table.getDirtyOperation().updateRecord(rcd);
                                },
                                queryCondition: ()=> {
                                    let pk_org = this.props.form.getFormItemsValue(this.formId,'pk_org').value;
                                    return {
                                        pk_org: pk_org,
                                        showflag:'Y',
                                        GridRefActionExt:'nccloud.web.uapbd.ref.param.ParamGridRefExt'
                                    }
                                },
                                value:record.getData().refValue != undefined?record.getData().refValue:{refcode:data.paramcode,refname:data.paramcode,refpk:data.initcode}
                            })
                        ) ;
                    }
                })
                }
                if(item.attrcode =='paramname'){
                    paramnameItem=Object.assign(item,{
                        title: this.lang['10140CSSPD-000105'], /* 国际化处理： 参数名称*/
                        dataIndex: 'paramname',
                        attrcode: 'paramname',
                        key: 'paramname',
                    })
                }
                if(item.attrcode =='paramvalue'){
                    debugger
                    paramvalueItem=Object.assign(item,{
                        title: this.lang['10140CSSPD-000106'],   /* 国际化处理： 参数值*/
                        dataIndex: 'paramvalue',
                        attrcode: 'paramvalue',
                        key: 'paramvalue',
                        render:(value,record, index, table) => {
                            var valtype   = record.getData().valuetype, //数据的值类型
                                stateflag = record.getData().stateflag;//渲染编辑框类型,
                            if(stateflag == 2)
                                return value == 'Y' ? this.lang['10140CSSPD-000025']:this.lang['10140CSSPD-000026'];/* 国际化处理： 是,否*/
                            if(stateflag == 3)
                                return value == 'Y' || value == true ? this.lang['10140CSSPD-000025']:this.lang['10140CSSPD-000026'];/* 国际化处理： 是,否*/
                            if(stateflag == 1){
                                if(value == 'Y' || value == true){
                                    return this.lang['SYSPARAM-000015']
                                }else if(value == 'N' || value == false){
                                    return  this.lang['SYSPARAM-000014']
                                }
                            }
                            if(stateflag == 5){
                                if(valtype != '0'){
                                    return record.getData().mappingName;
                                }
                            }
                            return value;
        
                        },
                        editer: (record, index, table) => {
       
                            var valtype   = record.getData().valuetype, //数据的值类型
                                stateflag = record.getData().stateflag, //渲染编辑框类型,
                                setSelectValue = () => { console.log('setSelectValue');
                                    return (value,comp) => {console.log(comp);
                                        var rcd = table.getDirtyOperation().findRecordById(record.getId()),
                                            data = rcd.getData();
                                        // var data = record.getData();console.log(data);
                                        // data.value = value;
                                        data = {...data, ...{paramvalue:value}};
                                        rcd.setData(data);
                                        table.getDirtyOperation().updateRecord(rcd);
                                    }
                                };
                            switch(stateflag){
                                case '0':   //文本框
                                    return (
                                        <NCFormControl  value={record.getData().paramvalue} onChange={setSelectValue()}/>
                                    )
                                    break;
                                case '1':   //选择框
                                    return (
                                        <NCSelect  value={record.getData().paramvalue} onSelect={setSelectValue()} >
                                            {this.handerVauelist(record.getData().paramvaluelist) .map(kv => (<Option key={kv.key}>{kv.val}</Option> ))}
                                        </NCSelect>
                                    );
                                    break;
                                case '2':   //布尔框
                                    return (
                                        <NCSelect  value={record.getData().paramvalue} onSelect={setSelectValue()}>
                                            {[{key:'Y',val:this.lang['10140CSSPD-000107']},{key:'N',val:this.lang['10140CSSPD-000108']}].map(kv => (<Option key={kv.key}>{kv.val}</Option> ))}
                                        </NCSelect>
                                    );
                                case '3':   //可能是浮点
                                    break;
                                case '4':   //可能是参照
                                    break;
                                case '5':
                                    //			BD303	货位存储单位			
//			BD304	标准体积单位			
//			BD305	标准重量单位
                                 // console.log(JSON.stringify(this.state.paramTemplate));
                               
                              
                                  let initcode=record.getData().realparamcode;
                                  let oppdimenvalue=null;
                                  if(initcode=='BD303'){
                                    oppdimenvalue='A';
                                  }
                                  if(initcode=='BD304'){
                                    oppdimenvalue='V';
                                  }
                                  if(initcode=='BD305'){
                                    oppdimenvalue='W';
                                  }
                            debugger
                            return (<MeasdocDefaultGridRef  fieldid="measdocDefaultGridRef" value='' placeholder=''/* 国际化处理： 组织单元*/
                                                               
                                      queryCondition={{oppdimen:oppdimenvalue}}
                                                               />);
                                debugger
                                    break;

                               debugger
                                break;
                                default:
                                    return '';
                                    break;
                            }
                        }
                    })
                }
                if(item.attrcode =='oldparamvalue'){
                    oldparamvalueItem=Object.assign(item,{
                        title: this.lang['10140CSSPD-000109'], /* 国际化处理： 参数值（修改前）*/
                        dataIndex: 'oldparamvalue',
                        attrcode: 'oldparamvalue',
                        key: 'oldparamvalue',
                        render:(value,record, index, table) => {
                            var valtype   = record.getData().valuetype, //数据的值类型
                                stateflag = record.getData().stateflag;//渲染编辑框类型,
                            if(stateflag == 2)
                                return value == 'Y' ? this.lang['10140CSSPD-000025']:this.lang['10140CSSPD-000026'];/* 国际化处理： 是,否*/
                            if(stateflag == 3)
                                return value == 'Y' || value == true ? this.lang['10140CSSPD-000025']:this.lang['10140CSSPD-000026'];/* 国际化处理： 是,否*/
                            if(stateflag == 1){
                                if(value == 'Y' || value == true){
                                    return this.lang['SYSPARAM-000015']
                                }else if(value == 'N' || value == false){
                                    return  this.lang['SYSPARAM-000014']
                                }
                            }
                            if(stateflag == 5){
                                if(valtype != '0'){
                                    return record.getData().mappingName;
                                }
                            }
                            return value;
        
                        }
                    })
                }
                if(item.attrcode =='paramvaluelist'){
                    paramvaluelistItem=Object.assign(item,{
                        title: this.lang['10140CSSPD-000110'], /* 国际化处理： 取值范围*/
                        dataIndex: 'paramvaluelist',
                        attrcode: 'paramvaluelist',
                        key: 'paramvaluelist',
                    })
                }
                if(item.attrcode =='controlflag'){
                    controlflagItem=Object.assign(item,{
                        title: this.lang['10140CSSPD-000111'], /* 国际化处理： 控制下级*/
                        dataIndex: 'controlflag',
                        attrcode: 'controlflag',
                        key: 'controlflag',
                        render: /*this.config.nodetype*/null == 'org' ? undefined : ( val,record) => {
                            return ( <NCCheckbox checked={record.getData().controlflag}  disabled={true} />);
                        },
                        editer: /*this.config.nodetype*/null == 'org' ? undefined : (record, index) =>{
                            var setCheckValue = () => { console.log('setCheckValue--00--00--00');
                                return (value,comp) => {
                                    var data = record.getData();
                                    data.controlflag = value;
                                    record.setData(data);
                                    this.table.getDirtyOperation().updateRecord(record);
                                }
                            };
                            return (
                                <NCCheckbox checked={record.getData().controlflag} onChange={setCheckValue()} />
                            )
                        }
                    })
                }
                if(item.attrcode =='oldcontrolflag'){
                    oldcontrolflagItem=Object.assign(item,{
                        title: this.lang['10140CSSPD-000112'], /* 国际化处理： 控制下级（修改前）*/
                        dataIndex: 'oldcontrolflag',
                        attrcode: 'oldcontrolflag',
                        key: 'oldcontrolflag',
                        render: ( val,record) => {
                            return ( <NCCheckbox checked={record.getData().oldcontrolflag}  disabled={true} />);
                        },
                        editer: (record, index) =>{
                            return (
                                <NCCheckbox checked={record.getData().oldcontrolflag} disabled={true} />
                            )
                        }
                    })
                }
                if(item.attrcode =='paramnote'){
                    paramnoteItem=Object.assign(item,{
                        title: this.lang['10140CSSPD-000113'],     /* 国际化处理： 备注*/
                        dataIndex: 'paramnote',
                        attrcode: 'paramnote',
                        key: 'paramnote',
                        render: ( val,record) => {
                            return record.getData().paramnote;
                            // return (
                            //     <NCFormControl value={record.getData().paramnote} disabled={true}/>
                            // )
                        },
                        editer: (record, index) =>{
                            var setTextValue = () => { console.log('setTextValue');
                                return (value,comp) => {console.log(comp);
                                    var data = record.getData();
                                    data.paramnote = value;
                                    record.setData(data);
                                    this.table.getDirtyOperation().updateRecord(record);
                                }
                            };
                            return (
                                <NCFormControl value={record.getData().paramnote} onChange={setTextValue()}/>
                            )
                        }
                    })
                }

            })
        }
        var tableConfig = {
            columns:[{
                title: this.lang['10140CSSPD-000103'], /* 国际化处理： 选择*/
                dataIndex: 'checked',
                attrcode: 'checked',
                key: 'checked',
                itemtype:'customer',
                fixed:'left',
                render: ( val,record) => {
                    return ( <NCCheckbox checked={false} disabled={false}/>);
                },
                editer: (record, index) =>{
                    var setCheckValue = () => { console.log('setCheckValue--00--00--0011');
                        return (value,comp) => {console.log(value);console.log(comp);
                            var data = record.getData();
                            data.checked = value;
                            record.setData(data);
                            this.table.getDirtyOperation().updateRecord(record);
                            this.updateDellineBtn();
                        }
                    };
                    return (
                        <NCCheckbox checked={record.getData().checked} onChange={setCheckValue()}/>
                    )
                }
            },paramcodeItem,paramnameItem,paramvalueItem,oldparamvalueItem,paramvaluelistItem,controlflagItem,oldcontrolflagItem,paramnoteItem,{
                title: this.lang['10140CSSPD-000102'],     /* 国际化处理： 操作*/
                dataIndex: 'operationCol',
                attrcode: 'opr',
                key: 'opr',
                itemtype:'customer',
                // render: ( val,record) => {
                //     return ( <NCCheckbox checked={record.getData().oldcontrolflag}  disabled={true} />);
                // },
                fixed:'right',
                editer: (record, index) =>{
                    // var removeLine = () => { 
                    //     return () => {console.log('removeLine');
                    //         this.table.getDirtyOperation().removeRecord(record);
                    //     }
                    // };
                    return (
                        <div onClick={() => {

                            this.table.getDirtyOperation().removeRecord(record);
                            this.updateDellineBtn();
                        }}><a>{this.lang['10140CSSPD-000138']}</a></div>/* 国际化处理： 删除*/
                        // <NCButton shape="border" colors="primary" onClick={ this.table.getDirtyOperation().removeRecord(record) }>删除</NCButton>
                    );
                }
            }],
            listeners:{
                modechange: (table, oldmode, newmode) => {
                    console.log('modechange');
                    //this.updateBtnStatus();
                },
                selectedchange: () => {
                    console.log('selectchange');
                    //this.updateBtnStatus();
                },
                load: () => {
                    console.log('load');
                    //this.updateBtnStatus();
                }
            }
            
        };

        return {
            /*treeConfig: treeConfig,*/
            tableConfig : tableConfig
        };
    }

    setDefaultValue = () =>{
        // if(this.lang){
        this.props.form.setFormItemsValue(this.formId,{'approvestatus':{display:'-1',value:'-1'}});/* 国际化处理： 自由态*/
        // }
    }

    updateDellineBtn = () =>{
        let l_rcd = this.table.getRecords();
        let length = 0;
        if(l_rcd != null && l_rcd.length > 0){
            for(let i = 0; i < l_rcd.length; i++){
                let l_status = l_rcd[i].getStatus();
                console.log(l_status);
                // if(l_status == 'add' || l_status == 'edit'){
                //     length++;
                //     break;
                // }
                let l_data = l_rcd[i].getData();
                if((l_status != 'del') && l_data != null && l_data.checked == true){
                    length++;
                    break;
                }
                console.log(l_data);
            }
        }
        let l_drcd = this.table.getDirtyOperation().getRecords();
        if(l_drcd != null && l_drcd.length > 0){
            for(let i = 0; i < l_drcd.length; i++){
                let l_status = l_drcd[i].getStatus();
                console.log(l_status);
                // if(l_status == 'add' || l_status == 'edit'){
                //     length++;
                //     break;
                // }
                let l_data = l_drcd[i].getData();
                if((l_status != 'del') && l_data != null && l_data.checked == true){
                    length++;
                    break;
                }
                console.log(l_data);
            }
        }
        if(length > 0){
            this.props.button.setDisabled({'delline':false});
        }else{
            this.props.button.setDisabled({'delline':true});
        }
    }

    buttonClick =(props, id)=>{console.log('buttonClick');console.log(props);console.log(id);

        let _this = this;
        switch (id) {
            case 'print':
                let	pk = this.props.getUrlParam('id');
                if(pk == null || pk == 'undefined'){
                    return;
                }
                let pks = [];
                pks.push(pk);
                print(
                    'pdf',
                    printUrl,
                    {
                        billtype:'',//单据类型
                        funcode:'10140CSSPD',//功能节点编码，即模板编码
                        nodekey:'printparam',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'print'
                    }
                );
                break;
            case 'output':
                pk = this.props.getUrlParam('id');
                if(pk == null || pk == 'undefined'){
                    return;
                }
                pks = [];
                pks.push(pk);
                this.setState({
                    pks: pks
                },() => {
                    this.refs.printOutput.open()
                });
                return;
                print(
                    'pdf',
                    printUrl,
                    {
                        billtype:'',//单据类型
                        funcode:'10140CSSPD',//功能节点编码，即模板编码
                        nodekey:'printparam',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'output'
                    }
                );
                break;
            case 'add':
                props.form.EmptyAllFormValue(this.formId);
                ///
                // props.cardTable.setTableData(this.tableId, { rows: [] });
                // this.table.loadData([]);
                this.table.editMode();
                let recs = this.table.getDirtyOperation().getRecords();
                if(recs != null && recs.length > 0){
                    for(let i = 0; i < recs.length; i++){
                        this.table.getDirtyOperation().removeRecord(recs[i]);
                    }
                }
                this.props.form.setFormItemsDisabled(this.formId,{billparamno:false});//单据号可修改
                this.setDefaultValue();
                this.getCodeRule();
                props.pushTo('/card', {
                    pagecode:pageId,
                    status: 'add'
                });
                this.setState(this.state);
                this.toggleShow(props);
                props.button.setDisabled({'delline':true});
                break
            case 'edit':
                let creator = this.props.form.getFormItemsValue(this.formId, 'creator')
                if(creator.value && creator.value != this.currUserId) {
                    toast({content:this.lang['10140CSSPD-000144'],color:'warning'});/* 国际化处理： 您无法对他人创建的申请单进行该操作*/
                    return
                }
                let approvestatus = props.form.getFormItemsValue(formId,'approvestatus').value;
                if(approvestatus != -1){
                    toast({content:this.lang['10140CSSPD-000115'],color:'warning'});/* 国际化处理： 非自由态单据不可修改*/
                    return;
                }
                props.pushTo('/card', {
                    status: 'edit',
                    pagecode:pageId,
                    id: props.getUrlParam('id')
                });
                this.props.form.setFormItemsDisabled(this.formId,{billparamno:true});//单据号不可修改
                this.setState(this.state);
                this.toggleShow(props);
                this.table.editMode();
                this.updateDellineBtn();
                break;
            case 'delete':
                approvestatus = props.form.getFormItemsValue(formId,'approvestatus').value;
                if(approvestatus != -1){
                    toast({content:this.lang['10140CSSPD-000116'],color:'warning'});/* 国际化处理： 非自由态单据不可删除*/
                    return;
                }
                // this.props.modal.show('delete');
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.lang['10140CSSPD-000117'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                    content: this.lang['10140CSSPD-000118'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    beSureBtnClick: this.delConfirm.bind(this),
                    // cancelBtnClick: () => {
                    //     console.log('cancelBtnClick');
                    //     this.props.modal.close('cancelConfirmModal');
                    // }
                })
                break
            case 'back':
                props.pushTo('/list', {
                    pagecode:'10140CSSPD_configparam_list',
                })
                break
            case 'save':
                this.execValidateFormular(()=>{this.saveClick()});
                //this.saveClick();
                break;
            case 'submit':
                this.submitBackConfirm('submit');
                break;
            case 'subback':
                this.submitBackConfirm('subback');
                break;
            case 'confirm':
                this.submitBackConfirm('confirm');
                break;
            case 'cancel':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.lang['10140CSSPD-000117'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                    content: this.lang['10140CSSPD-000119'],             // 提示内容,非必输/* 国际化处理： 确认取消操作？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    // beSureBtnClick: this.cancelConfirmModal.bind(this),
                    beSureBtnClick: () => {
                        if (props.getUrlParam('status') === 'add') {
                            this.table.cancelEditMode();
                            console.log(this.pk);
                            if(this.pk != null && this.pk.length > 0 && this.pk != 'undefined'){

                                props.form.cancel(this.formId);
                                props.editTable.cancelEdit(this.tableId);
                                props.pushTo('/card', {
                                    pagecode:pageId,
                                    status: 'browse',
                                    id: this.pk
                                });
                                this.getdata(this.pk);
                                // this.toggleShow(props);
                                // this.setState(this.state);
                            }
                            else{
                                props.pushTo('/card', {
                                    pagecode:pageId,
                                    status: 'browse'
                                });
                                props.form.cancel(this.formId);
                                props.editTable.cancelEdit(this.tableId);
                                props.form.EmptyAllFormValue();
                                this.toggleShow(props);
                                this.setState(this.state);
                            }
                        }
                        if ((props.getUrlParam('status') === 'edit')) {
                            props.form.cancel(this.formId);
                            this.table.cancelEditMode();
                            props.editTable.cancelEdit(this.tableId);
                            props.pushTo('/card', {
                                status: 'browse',
                                pagecode:pageId,
                                id: props.getUrlParam('id')
                            })
                        }
                        this.setState(this.state);
                        this.toggleShow(props);
                    }
                });
                // props.modal.show('confirmModal',{
                //     color:"warning",
                //     title:'提示',
                //     content:'确认取消操作？',
                //     cancelBtnClick:()=>{console.log('cancelBtnClick');
                //         this.props.modal.close('confirmModal');
                //     },
                //     beSureBtnClick:()=>{
                //         if (props.getUrlParam('status') === 'add') {
                //             this.table.cancelEditMode();
                //         if(this.pk != null && this.pk.length > 0 && this.pk != 'undefined'){

                //             props.form.cancel(this.formId);
                //             props.editTable.cancelEdit(this.tableId);
                //             props.pushTo('/card', {
                //             status: 'browse',
                //             id: this.pk
                //             })
                //             toggleShow(props);
                //         }
                //         else{
                //             props.pushTo('/list', {
                //             status: 'browse'
                //             })
                //         }
                //         }
                //         if ((props.getUrlParam('status') === 'edit')) {
                //         props.form.cancel(this.formId);
                //         this.table.cancelEditMode();
                //         props.editTable.cancelEdit(this.tableId);
                //         props.pushTo('/card', {
                //             status: 'browse',
                //             id: props.getUrlParam('id')
                //         })
                //         }
                //         toggleShow(props);
                //     }});
                break;
            case 'delline':
                // this.table.getDirtyOperation().removeRecord(record);
                let l_rcd = this.table.getRecords();
                console.log(l_rcd);
                if(l_rcd != null && l_rcd.length > 0){
                    for(let i = 0; i < l_rcd.length; i++){
                        let l_data = l_rcd[i].getData();
                        if(l_data.checked == true){
                            this.table.getDirtyOperation().removeRecord(l_rcd[i]);
                        }
                    }
                }
                let l_drcd = this.table.getDirtyOperation().getRecords();
                console.log(l_drcd);
                if(l_drcd != null && l_drcd.length > 0){
                    for(let i = 0; i < l_drcd.length; i++){
                        let l_data = l_drcd[i].getData();
                        if(l_data.checked == true){
                            this.table.getDirtyOperation().removeRecord(l_drcd[i]);
                        }
                    }
                }
                this.updateDellineBtn();
                break;
            case 'addline':
                // var rcd = this.table.getDirtyOperation().findRecordByIndex(0);
                // let data = rcd.getData();
                let l_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
                if(l_org == null || l_org.length < 1){
                    toast({content:this.lang['10140CSSPD-000120'],color:'warning'});/* 国际化处理： 组织列表不能为空*/
                    return;
                }
                let data = {
                    "paraminfo": "",
                    "pk_param_id": "",
                    "realparamcode":"",
                    "controlflag": false,
                    "dr": "0",
                    "ts": "2018-06-04 13:27:35",
                    "status": "0",
                    "m_isDirty": false,
                    "pk_sysinittemp": "",
                    "paramcode": "",
                    "paramname": "",
                    "remark": "",
                    "stateflag": "0",
                    "domainflag": "001",
                    "sysindex": "0",
                    "valuetype": "2",
                    "sysflag": false,
                    "mutexflag": "0",
                    "mainflag": false,
                    "showflag": true,
                    "pk_orgtype": "",
                    "orgtypeConvertMode": "",
                    "paraType": "",
                    "dataoriginflag": "0",
                    "key": "",
                    "data": {
                        "sysinittempvo": {
                            "pk_sysinittemp": "",
                            "paramcode": "",
                            "paramname": "",
                            "remark": "",
                            "stateflag": "0",
                            "domainflag": "001",
                            "sysindex": "0",
                            "valuetype": "2",
                            "sysflag": false,
                            "mutexflag": "0",
                            "mainflag": false,
                            "showflag": true,
                            "ts": "2018-06-04 13:27:35",
                            "pk_orgtype": "",
                            "orgtypeConvertMode": "",
                            "paraType": "system",
                            "dataoriginflag": "0",
                            "status": "0",
                            "m_isDirty": false
                        },
                        "paramInfo": {
                            "paraminfo": "",
                            "pk_param_id": "",
                            "paramcode": "",
                            "realparamcode":"",
                            "paramname": "",
                            "controlflag": false,
                            "dr": "0",
                            "ts": "2018-06-06 17:09:52",
                            "status": "0",
                            "m_isDirty": false
                        }
                    }
                }
                console.log(this.table);
                this.table.editMode();
                this.table.getDirtyOperation().addData(data);
                // props.button.setDisabled({'delline':false});
                this.updateDellineBtn();
                break
            case 'refresh':
                props.pushTo('/card', {
                    pagecode:pageId,
                    status:props.getUrlParam('status'),
                    id:props.getUrlParam('id')
                })
                this.getdata(props.getUrlParam('id'),'refresh');
                //toast({content:'刷新成功',color:'success'});
                break
            default:
                break
        }
    }

    pageInfoClick=(props, pk)=>{console.log(pk);
        if(this.props.form.getFormStatus(this.formId) =='add' || this.props.form.getFormStatus(this.formId) =='edit'){
            return;
        }
        let data = {
            "pk": pk,
            "pageid": pageId
        };
        ajax({
            url: queryCardUrl,
            data: data,
            success: (res) =>{console.log('pageInfoClick');console.log(res);
                if (res.data.head) {
                    props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                    props.setUrlParam(pk)//动态修改地址栏中的id的值
                }
                if (res.data.body) {
                    props.editTable.setTableData(tableId, res.data.body[tableId]);
                }
            }
        });
    }

    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{
        if(key == 'pk_org'){//参数所属组织变动，需要清空子表
            if(value&&value.refpk){
                this.getParamTemplate(value.refpk);
            }
            let l_rcd = this.table.getRecords();
            console.log(l_rcd);
            if(l_rcd != null && l_rcd.length > 0){
                for(let i = 0; i < l_rcd.length; i++){
                    let l_data = l_rcd[i].getData();
                    this.table.getDirtyOperation().removeRecord(l_rcd[i]);
                }
            }
            var l_drcd = null;
            if(this.table.getDirtyOperation() != null){
                l_drcd = this.table.getDirtyOperation().getRecords();
            }
            console.log(l_drcd);
            if(l_drcd != null && l_drcd.length > 0){
                for(let i = 0; i < l_drcd.length; i++){
                    let l_data = l_drcd[i].getData();
                    this.table.getDirtyOperation().removeRecord(l_drcd[i]);
                }
            }
            console.log(value);
            // this.props.form.setFormItemsValue(this.formId,{pk_org:{'value':value.refpk,'display':value.refname}});
        }
    }

    //获取参数模板
    getParamTemplate = (pk_org) => {
        ajax({
            url: queryTemplateUrl,
            data:{pk_org:pk_org},
            success: (res) => {
                this.state.paramTemplate = res.data.template;
            }
        });
    }
    //通过单据id查询单据信息
    getdata = (pk,flag) =>{
        this.pk = pk;
        let data = {pk};
        if(pk == null || pk == undefined || pk.length < 1 || pk == 'undefined'){
            return;
        }
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                this.genCardData(res);
                if(flag == 'refresh'){
                    toast({title:this.lang['10140CSSPD-000121'],color:"success"});/* 国际化处理： 刷新成功！*/
                }
            }
        });
    }

    genCardData = (res) => {console.log(res);
        // this.state.paramTemplate = res.data.template;
        if (res.data.head) {
            console.log("headdata");
            console.log(res.data);
            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
            let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
            this.setState({title_code});
            this.props.button.setButtonVisible(['submit','subback','confirm'],false);
            if(res.data.head[this.formId].rows[0].values.approvestatus.value == -1){//自由
                this.props.button.setButtonVisible(['submit'],true);
                this.props.button.setDisabled({'edit':false,'delete':false});
            }else if(res.data.head[this.formId].rows[0].values.approvestatus.value == 3){//提交
                this.props.button.setButtonVisible(['subback','confirm'],true);
                this.props.button.setDisabled({'edit':true,'delete':true});
            }else if(res.data.head[this.formId].rows[0].values.approvestatus.value == 1){//审批通过
                //props.button.setButtonVisible(['submit'],false);
                this.props.button.setDisabled({'edit':true,'delete':true});
            }
            let l_status = this.props.form.getFormStatus(this.formId);
            if(l_status == 'edit'){
                this.props.button.setButtonVisible(['submit','subback','confirm'],false);
            }
        }
        if (res.data.body) {
            let datas = res.data.body;
            datas = datas.map( (data)=> {
                return {...data.paramInfo, ...data.sysinittempvo,...{key:data.paramInfo.pk_param_id}, data:data};
            })
            // console.log(this.lang['10140CSSPD-000122']);/* 国际化处理： 自定义datas*/
            console.log(datas);
            this.table.loadData(datas);
            let status = this.props.getUrlParam('status');
            if(status == 'add' || status == 'edit'){
                setTimeout(()=>{this.table.editMode()},1000);
            }
            // this.props.editTable.setTableData(this.tableId, res.data.body[this.tableId]);
            // let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
            // let arr = this.props.cardTable.getAllRows(this.tableId);
            // let applycount = 0;
            // arr.map((item)=>{
            // 	applycount += parseInt(item.values.pk_project.value);
            // })
            // this.setState({applycount});
            // this.setState({totalcount});
        }
        let l_status = this.props.form.getFormStatus(this.formId);
        l_status = this.table.getMode();
        if(l_status == 'edit' || l_status == 'add'){
            let l_rcd = this.table.getRecords();
            let l_drcd = this.table.getDirtyOperation().getRecords();
            if((l_rcd != null && l_rcd.length > 0) || (l_drcd != null && l_drcd.length > 0)){
                this.props.button.setDisabled({'delline':false});
            }else{
                this.props.button.setDisabled({'delline':true});
            }
        }
        this.toggleShow(this.props);
        this.setState(this.state);
    }

    //提交收回确认
    submitBackConfirm = (type) =>{
        ajax({
            url: submitBackConfirmUrl,
            data:{pk: this.pk,type: type},
            success: (res) => {
                this.getdata(this.pk);
            }
        });
    }
    //校验公式
    execValidateFormular = (callback) =>{
        let formData = this.props.form.getAllFormValue(this.formId);
        console.log(formData);
        let validateData = {
            pageid: pageId,
            model: {
                areacode: 'head',
                areaType: "form",
                pageinfo: null,
                rows: formData.rows
            }
        };
        let tableTypeObj = {[this.formId]:'form'};
        let billType = 'form';
        this.props.validateToSave( validateData , ()=>{
            console.log('校验公式执行返回成功');
            setTimeout(()=>{callback();},100);
        } , tableTypeObj , billType );
    }
    //保存单据
    saveClick = () =>{
        // this.props.editTable.filterEmptyRows(tableId);console.log(this);return;
        // let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
        let CardData = this.props.form.getAllFormValue(this.formId);
        console.log(CardData)
        // CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
        let url = saveUrl;//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = updateUrl;//修改保存
        }

        //自定义子表数据
        let vbillParamVO = {
            approvedate:CardData.rows[0].values.approvedate.value,
            approvenote:CardData.rows[0].values.approvenote.value,
            approver:CardData.rows[0].values.approver.value,
            approvestatus:CardData.rows[0].values.approvestatus.value,
            billparamno:CardData.rows[0].values.billparamno.value,
            billtype:CardData.rows[0].values.billtype.value,
            creationtime:CardData.rows[0].values.creationtime.value,
            creator:CardData.rows[0].values.creator.value,
            //dr:CardData.rows[0].values.dr.value,
            modifiedtime:CardData.rows[0].values.modifiedtime.value,
            modifier:CardData.rows[0].values.modifier.value,
            pk_group:CardData.rows[0].values.pk_group.value,
            pk_org:CardData.rows[0].values.pk_org.value,
            pk_sysconfig_id:CardData.rows[0].values.pk_sysconfig_id.value,
            //status:CardData.rows[0].values.status.value,
            ts:CardData.rows[0].values.ts.value,
        };

        let verifyStr = "";
        if(vbillParamVO.billparamno == null || vbillParamVO.billparamno.length < 1){
            verifyStr += this.lang['10140CSSPD-000123'];/* 国际化处理： ,[单据号]*/
        }
        if(vbillParamVO.pk_org == null || vbillParamVO.pk_org.length < 1){
            verifyStr += this.lang['10140CSSPD-000124'];/* 国际化处理： ,[参数所属组织]*/
        }
        if(verifyStr.length > 0){
            verifyStr = verifyStr.substr(1);
            toast({content:this.lang['10140CSSPD-000125']+verifyStr,color:'warning'});/* 国际化处理： 下列字段值不能为空：*/
            return;
        }

        //自定义子表数
        // if(this.table == null){
        //     toast({content:this.lang['10140CSSPD-000126'],color:'warning'});/* 国际化处理： 此单据为空，不能保存*/
        //     return;
        // }
        var dirtyFns = this.table.getDirtyOperation();
        var dirtyRecords ; //获取脏数据
        var editRecords ; //过滤出实际的脏数据
        var needDatas = [];
        if(dirtyFns != null){
            dirtyRecords = dirtyFns.getRecords(); //获取脏数据
            editRecords  = Record.filterByStatus(dirtyRecords, 'add', 'edit', 'del','common'); //过滤出实际的脏数据
        }
        var records = this.table.getRecords();//原来record
        // if(this.table.getRecords() == null || this.table.getRecords().length < 1){
        //     toast({content:this.lang['10140CSSPD-000126']+'1',color:'warning'});/* 国际化处理： 此单据为空，不能保存*/
        //     return;
        // }
        // editRecords = this.table.getRecords();
        if(editRecords == null || editRecords.length < 1 && (records == null || records.length < 1)) {
            toast({content:this.lang['10140CSSPD-000126'],color:'warning'});/* 国际化处理： 此单据为空，不能保存*/
            return;
        }
        editRecords.forEach(record =>{//转换一下数据, 变成对应后台可接收的结构
            console.log('editRecords');
            let l_status = record.getStatus();console.log(l_status);
            var data = record.getData().data;console.log(data);console.log(record.getData());
            data.paramInfo.controlflag = record.getData().controlflag;
            data.paramInfo.oldcontrolflag = record.getData().oldcontrolflag;
            data.paramInfo.oldparamvalue = record.getData().oldparamvalue;
            data.paramInfo.paramcode = record.getData().initcode;
            data.paramInfo.realparamcode = record.getData().realparamcode;
            data.paramInfo.paraminfo = record.getData().paraminfo;
            data.paramInfo.paramname = record.getData().paramname;
            data.paramInfo.paramvalue = record.getData().paramvalue;
            data.paramInfo.pk_param_id = record.getData().pk_param_id;
            data.paramInfo.paramnote = record.getData().paramnote;
            data.paramInfo.realparamcode = record.getData().realparamcode;
            data.paramInfo.status = record.getData().status;
            data.paramInfo.ts = record.getData().ts;
            if(l_status == 'del'){
                data.paramInfo.status = 3;
            }
            needDatas.push(data.paramInfo);
        });console.log(needDatas);
        console.log(this.table.getRecords());
        // if(needDatas == null || needDatas.length < 1){
        //     toast({content:this.lang['10140CSSPD-000126'],color:'warning'});/* 国际化处理： 此单据为空，不能保存*/
        //     return;
        // }
        let hasChild = false;
        for(let i = 0; i < needDatas.length; i++){
            if(needDatas[i].status == '3' || needDatas[i].status == 3){//删除的，不校验
                continue;
            }
            hasChild = true;
            if(needDatas[i].paramcode == null || needDatas[i].paramcode.length < 1){
                toast({content:this.lang['10140CSSPD-000127']+(i+1)+this.lang['10140CSSPD-000128'],color:'warning'});/* 国际化处理： 下列字段值不能为空：第,行：[参数代码]*/
                return;
            }
        }
        if(hasChild == false){//列表中没有新增/修改的数据
            if(records != null && records.length > 0){
                for(var i = 0; i < records.length; i++){
                    var tempData = records[i].getData();
                    var tempPk = tempData.pk_param_id;
                    for(let i = 0; i < needDatas.length; i++){
                        if(needDatas[i].pk_param_id == tempPk){
                            if(needDatas[i].status != 3){//存在未删除的原数据
                                hasChild = true;
                                break;
                            }
                        }
                    }
                }
            }

        }
        if(hasChild == false && (records == null || records.length < 1)){//初识没有数据，且没有新增修改的数据
            toast({content:this.lang['10140CSSPD-000126'],color:'warning'});/* 国际化处理： 此单据为空，不能保存*/
            return;
        }
        if(hasChild == false){
            toast({content:this.lang['10140CSSPD-000126'],color:'warning'});/* 国际化处理： 此单据为空，不能保存*/
            return;
        }
        let ldata = {
            vbillParamVO:vbillParamVO,
            vparaminfoVOs:needDatas
        }

        ajax({
            url: url,
            data: ldata,
            success: (res) => {
                let pk_value = null
                if (res.success) {console.log(res);
                    if (res.data) {
                        pk_value = res.data.head.head.rows[0].values['pk_sysconfig_id'].value;
                        this.props.pushTo('/card', {
                            status: 'browse',
                            pagecode:pageId,
                            id: res.data.head.head.rows[0].values['pk_sysconfig_id'].value
                        });
                        this.pk = res.data.head.head.rows[0].values['pk_sysconfig_id'].value;
                        this.table.cancelEditMode();
                        this.genCardData(res);
                        this.toggleShow(this.props);
                        //addCache(pk_value,res.data.head,this.props.config.formId,dataSource);
                        this.setState(this.state);
                        toast({title:this.lang['10140CSSPD-000129'],color:"success"});/* 国际化处理： 保存成功！*/
                        return;
                        this.props.form.setFormItemsValue(this.formId,{ts:res.data.ts});
                        let title_code = res.data.billparamno;
                        this.setState({title_code});
                        if (res.data.head && res.data.head[this.formId]) {
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        }
                        if (res.data.body && res.data.body[this.tableId]) {
                            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
                        }
                    }
                    //toast({content : "保存成功",color : 'success'});
                    this.table.cancelEditMode();
                    pk_value = this.props.getUrlParam("id");
                    pk_value = res.data.pk_sysconfig_id;
                    //addCache(pk_value,res.data,this.props.config.formId,dataSource);-----------------------
                    this.getdata(pk_value);
                    this.props.pushTo('/card', {
                        pagecode:pageId,
                        status: 'browse',
                        id: pk_value
                    })
                    this.toggleShow(this.props);
                    this.setState(this.state);
                }
                // toast({title:"保存成功！",color:"success"});
            }
        })
    }

    //删除单据
    delConfirm = () => {
        let creator = this.props.form.getFormItemsValue(this.formId, 'creator')
        if(creator.value && creator.value != this.currUserId) {
            toast({content:this.lang['10140CSSPD-000144'],color:'warning'});/* 国际化处理： 您无法对他人创建的申请单进行该操作*/
            return
        }
        ajax({
            url: deleteUrl,
            data: {deleteinfo:[{
                    id: this.props.getUrlParam('id'),
                    ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
                }]},
            success: (res) => {
                if(res){
                    deleteCacheById(pk_item,this.props.getUrlParam('id'),dataSource);
                    this.props.pushTo('/list',{
                        pagecode:'10140CSSPD_configparam_list',
                    });
                    toast({title:this.lang['10140CSSPD-000130'],color:"success"});/* 国际化处理： 删除成功！*/
                }

            }
        });
    };

    modelSave = (props)=>{
        props.cardTable.closeModel(this.tableId);
        this.saveClick();
    }

    //子表编辑后事件
    cardTableAfterEventFn = (props,moduleId,key,value,changedrows,index,record,type,method)=>{
        console.log('cardTableAfterEventFn');
        console.log(moduleId);console.log(key);console.log(value),console.log(index);console.log(method);console.log('end');
        console.log(props);

        let meta = props.meta.getMeta(tableId);
        let tableItems = meta[tableId].items;console.log(tableItems);
        for(let i = 0; i < tableItems.length; i++){
            if(tableItems[i].attrcode === 'paramvalue'){console.log(this.lang['10140CSSPD-000131']);/* 国际化处理： 修改参照paramvalue*/
                tableItems[i].itemtype = 'select';
                tableItems[i].options = [
                    {
                        "display": this.lang['10140CSSPD-000132'],/* 国际化处理： 未启用*/
                        "value": "1"
                    }
                ];
                props.meta.setMeta(meta);
            };
        }

        if(/*method === 'change' &&*/ key === 'paramcode'){
            let meta = props.meta;
            console.log('paramcode chagne');
            console.log(meta);
            let cardTable = props.cardTable;console.log(cardTable);
            value.values.paramname={value:'dddwww'};
            cardTable.setColValue(moduleId, key, { value: value });
        }
    }
    getButtonNames = (codeId) => {
        if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
            return 'main-button'
        }else {
            return 'secondary - button'
        }
    };
    //获取列表肩部信息
    getTableHead = () => {
        let {button} = this.props;
        let { createButton } = button;
        let buttons  = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className='definition-search'>
                    {status == 'browse' ?<div><span className="definition-search-title">this.lang['10140CSSPD-000139'] | this.lang['10140CSSPD-000140']：</span>/* 国际化处理： 详细信息,总计*/
                        <span className = 'count'>{this.state.totalcount}</span><span>this.lang['10140CSSPD-000141']</span>/* 国际化处理： 条*/
                        <span>		this.lang['10140CSSPD-000142'] ：</span>/* 国际化处理： 申请数量*/
                        <span className='count'>{this.state.applycount}</span><span>this.lang['10140CSSPD-000143']</span></div>:<span className="definition-search-title">ddd</span>}/* 国际化处理： 个*/
                </div>
                <div className="definition-icons">
                    {/* {buttons.map( (v) =>{
							if(v.btncode === 'addline'){
								return (createButton(v.btncode, {
									name: v.btnname,
									onButtonClick: this.buttonClick.bind(this),
								}))
							}
						})}  */}
                    {/* {createButton("addline", {
						name: '增行',
						onButtonClick: this.buttonClick.bind(this)
					})} */}
                    {this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                    {/* {createButton("deleteline", {
						name: '删行',
						onButtonClick: buttonClick.bind(this)
					})} */}
                </div>
            </div>
        )
    }
    render() {
        if(!this.lang) return '';
        let { cardTable, form, button, modal, cardPagination ,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {createCardPagination} = cardPagination;
        let buttons = this.props.button.getButtons();
        let { createButtonApp } = button;
        // buttons = buttons.sort((a,b)=>{
        // 	return b.btnorder - a.btnorder;
        // });
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButton } = button;
        let { createModal } = modal;
        let status = this.props.getUrlParam('status');
        let defineColumnConf={
            colsSettingParam :this.state.colsSettingParam,
            updateColumnHandle : (newColumn, areaCode) => {
                let  meta  = this.props.meta.getMeta()
                if (newColumn.length && areaCode) {
                    meta[areaCode].items = newColumn;
                }
                //this.props.meta.setMeta(meta)
            
            }
        }
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            <div className='header-title-search-area' fieldid = {this.lang['10140CSSPD-000135']+"_title"}>
                                {
                                    createBillHeadInfo(
                                        {
                                            title :this.lang['10140CSSPD-000135']/* 国际化处理： 参数修改申请*/,             //标题
                                            backBtnClick:this.buttonClick.bind(this,this.props,'back'),
                                            initShowBackBtn:status=='browse'
                                        }
                                    )}
                            </div>
                            {/*分页 */}
                            {/* {status=='browse'?<div className='header-button-cardPagination'>
									{createCardPagination({	handlePageInfoChange: pageInfoClick.bind(this)})}
									</div>:''} */}
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    buttonLimit: 1,
                                    onButtonClick: this.buttonClick.bind(this)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
                                { this.props.form.getFormStatus(this.formId) !='add'
                                && this.props.form.getFormStatus(this.formId) !='edit'
                                && this.props.form.getFormItemsValue(formId,pk_item) != null
                                && this.props.form.getFormItemsValue(formId,pk_item).value != null
                                && this.props.form.getFormItemsValue(formId,pk_item).value.length > 0?
                                    createCardPagination({
                                        handlePageInfoChange: this.pageInfoClick.bind(this),
                                        urlPkname:'id',
                                        dataSource: dataSource,
                                    }):''}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.formId, {
                            onAfterEvent: this.afterEvent.bind(this)
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    {/* <div style={{height:'8px'}}></div> */}
                    <div className="nc-bill-table-area nc-bill-param-paramsys">
                        <div className='nc-bill-header-area'>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'card_body',//按钮注册中的按钮区域
                                    //buttonLimit: 5,
                                    onButtonClick: this.buttonClick.bind(this)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
                            </div>
                        </div>
                        <Table className={'selfClass'} {...this.ComponentConfig.tableConfig} defineColumnConf={defineColumnConf}  ref={(table) => this.table = table}/>
                        {/* {this.getTableHead()}
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this),
								modelSave: this.modelSave.bind(this),
                                showIndex:true,
                                onAfterEvent: this.cardTableAfterEventFn.bind(this), 
							})} */}
                    </div>
                    {createModal('delete', {
                        title: this.lang['10140CSSPD-000117'],/* 国际化处理： 注意*/
                        content: this.lang['10140CSSPD-000118'],/* 国际化处理： 确认删除？*/
                        beSureBtnClick: this.delConfirm
                    })}
                    {createModal('confirmModal', {
                        title: this.lang['10140CSSPD-000117'],/* 国际化处理： 注意*/
                        content: this.lang['10140CSSPD-000118']/* 国际化处理： 确认删除？*/
                    })}
                    <PrintOutput
                        ref='printOutput'
                        url={printUrl}
                        data={{
                            funcode: '10140CSSPD',
                            nodekey:'printparam',
                            oids: this.state.pks,
                            outputType: 'output'
                        }}
                    />
                </div>
            </div>
        );
    }
}

Card = createPage({
    billinfo:{
        billtype: 'card',
        pagecode: pageId,
        headcode: 'head',
        bodycode: 'paraminfo'
    },
    initTemplate: ()=>{},
    orderOfHotKey: ['head']
})(Card);


// ajav({

// 	success: function(temp){
// 		var temp0 = temp;
// 		Card = createPage({
// 			initTemplate: function(){
// 				return temp0;
// 			}
// 		})(Card);
// 	}
// })

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65