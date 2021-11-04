//yroiyG7jE4/bSWsKzXRgBHMgEStsOTUevvjxBX/QCCDk59vjuGP8LYjMqdUSkHPT
import React,{Component} from 'react';
import { createPage, base, ajax ,toast,createButtonApp,cardTable,promptBox} from 'nc-lightapp-front';

import './sgmenuform.less'

const urls = {
    'queryMaterialDetailUrl':'/nccloud/uapbd/sgmenu/queryMaterialDetail.do',
    'queryDetailUrl':'/nccloud/uapbd/sgmenu/queryDetail.do'
};
let pageCode='10140SGMENU_form1',appid='0001Z01000000000HXU1';
class SgmenuForm extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            pageCode:'10140SGMENU_form1',
            formId:'material_vendor_form',
            orgFormId:'form',
            tableId:'material_vendor_table',
            tab:0,
            formTitle:'',
            appid:'0001Z01000000000HXU1'
        },this.props.config);

        pageCode = this.config.pageCode;
        appid = this.config.appid;

        this.state = {
            curOrg:'',
            pk_marbasclass:'',
            pk_material:'',
            pk_supplier:'',
            json:{}
        }
        this.onAfterFormEvent = this.onAfterFormEvent.bind(this);
        this.onOrgChange = this.onOrgChange.bind(this);
        this.modifierMeta = this.modifierMeta.bind(this);
        this.tableButtonClick = this.tableButtonClick.bind(this);
        this.initTemplate.call(this,this.props);
    }
    /**
     * 加载模板
     * @param props
     * @param callback
     */
    initTemplate = (props,callback)=>{
        let me = this;
        props.createUIDom(
            {
                pagecode: props.config.pageCode//页面id
                //appid: appid//注册按钮的id
            },
            function (data){
                if(data){
                    if(data.template){
                        let meta = data.template;
                        meta = me.modifierMeta(props,meta);
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        //props.button.setButtonVisible('AddLine',!props.config.showReturn);
                    }
                    callback && callback();
                }
            }
        )
    }
    /**
     * 给table增加操作列
     * @param props
     * @param meta
     * @returns {*}
     */
    modifierMeta(props, meta) {
        let status = 'browse';
        let me = this;

        meta[props.config.formId].status = status;
        meta[props.config.orgFormId || 'form'].status = 'edit';
        meta[props.config.orgFormId || 'form'].items.forEach((item)=>{
            if(item.attrcode == 'pk_org'){
                item.queryCondition = {
                    AppCode:'10140SGMENU',
                    GridRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
            }
        });
        //meta[props.config.tableId].status = me.state.status;
        meta[me.config.tableId].items.forEach(item=>{
            if(item.attrcode == 'pk_supplier' || item.attrcode == 'pk_material'){
                item.isMultiSelectedEnabled = true;
            }
        });
        meta[`${me.config.tableId}_form1`].items.forEach(item=>{
            if(item.attrcode == 'pk_supplier' || item.attrcode == 'pk_material'){
                item.isMultiSelectedEnabled = true;
            }
        });
        meta[`${me.config.tableId}_form2`].items.forEach(item=>{
            if(item.attrcode == 'pk_supplier' || item.attrcode == 'pk_material'){
                item.isMultiSelectedEnabled = true;
            }
        });

        let porCol = {
            attrcode: 'opr',
            label: me.state.json['10140SGMENU-000022'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            fixed:'right',
            render(text, record, index) {
                let btnArray = me.state.status == 'browse' ? [] : ['EditLine','PasteLine','InsertLine','DelLine','PasteLineToTail'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "opr",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => me.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        };
        meta[props.config.tableId].items.push(porCol);
        //手动设置等级体系参照
        meta = me.setGradeLevel(meta,[me.config.tableId]);
        return meta;
    }
    /**
     * 设置等级体系参照
     * @param meta
     * @param moudleIds
     * @returns {*}
     */
    setGradeLevel(meta,moudleIds){
        if(Array.isArray(moudleIds))
            moudleIds.forEach((id)=>{
                if(meta[id])
                    meta[id].items.find(item=>{return item.attrcode=='cqualitylevelid'}).refcode='uapbd/scmbase/refer/QualityLevelBDefaultTreeGridRefer/index';
                if(meta[`${id}_form1`])
                    meta[`${id}_form1`].items.find(item=>{return item.attrcode=='cqualitylevelid'}).refcode='uapbd/scmbase/refer/QualityLevelBDefaultTreeGridRefer/index';
                if(meta[`${id}_form2`])
                    meta[`${id}_form2`].items.find(item=>{return item.attrcode=='cqualitylevelid'}).refcode='uapbd/scmbase/refer/QualityLevelBDefaultTreeGridRefer/index';
            });
        else{
            if(meta[moudleIds])
                meta[moudleIds].items.find(item=>{return item.attrcode=='cqualitylevelid'}).refcode='uapbd/scmbase/refer/QualityLevelBDefaultTreeGridRefer/index';
            if(meta[`${moudleIds}_form1`])
                meta[`${moudleIds}_form1`].items.find(item=>{return item.attrcode=='cqualitylevelid'}).refcode='uapbd/scmbase/refer/QualityLevelBDefaultTreeGridRefer/index';
            if(meta[`${moudleIds}_form2`])
                meta[`${moudleIds}_form2`].items.find(item=>{return item.attrcode=='cqualitylevelid'}).refcode='uapbd/scmbase/refer/QualityLevelBDefaultTreeGridRefer/index';
        }
        return meta;
    }
    /**
     * 操作列按钮点击
     * @param props
     * @param id
     * @param text
     * @param record
     * @param index
     * @returns {boolean}
     */
    tableButtonClick(props, id, text, record, index){
        let status = props.form.getFormStatus(props.config.formId);
        let pk_org = props.form.getFormItemsValue(props.config.orgFormId||`form`,"pk_org");
        let pk='';
        if(props.config.tab == 0){
            pk = props.form.getFormItemsValue(props.config.formId,"pk_marbasclass") || props.form.getFormItemsValue(props.config.formId,"pk_material");
        }else{
            pk = props.form.getFormItemsValue(props.config.formId,"pk_supplier")
        }
        let isEdit = !pk && !pk_org ? true :false;
        if(status != 'add' && status != 'edit' && isEdit)
            return false;
        switch(id){

            case "DelLine"://删除行
                //props.button.setPopContent({'DelLine':this.state.json['10140SGMENU-000021']});/* 国际化处理： 确认要删除该信息吗？*/
                props.cardTable.delRowsByIndex(props.config.tableId, index);
                break;
            case "EditLine"://编辑
                props.cardTable.openModel(props.config.tableId,'edit',record,index);
                break;
            case "PasteLine"://粘贴
                props.cardTable.pasteRow(props.config.tableId,  index,["pk_vendorstock"]);
                //暂时手动处理，等平台更新后可取消
                //props.cardTable.setValByKeyAndIndex(props.config.tableId,index+1,'pk_vendorstock ',{value:""});
                break;
            case 'InsertLine':
                props.cardTable.addRow(props.config.tableId, index >0 ? index-1 : 0, {}, true);
                break;
            case 'PasteLineToTail':
                let allRows = props.cardTable.getNumberOfRows(props.config.tableId);
                props.cardTable.pasteRow(props.config.tableId,  index,["pk_vendorstock"]);
                break;
            default:
                console.log(id,index);
                break;
        }
    }
    componentWillReceiveProps(nextProps){
        this.props.setRelationItemBillinfo(
            [{
                billtype: 'card',
                pagecode: nextProps.config.pageCode,
                headcode: nextProps.config.formId ,
                bodycode: nextProps.config.tableId
            },{
                billtype: 'form',
                pagecode:  nextProps.config.pageCode,
                headcode:  nextProps.config.orgFormId
            }]
        );
        let newConfig = nextProps.config || {};
        this.state.json = newConfig.json;
        this.state.formTitle = newConfig.json['10140SGMENU-000023'];/* 国际化处理： 物料信息*/
        this.state.inlt = newConfig.inlt;
        if(nextProps.config.isSave)
            this.state.curOrg = '';
        //控制子表操作列按钮显隐
        let isStatusChange = nextProps.config && nextProps.config.status && nextProps.config.status != this.props.config.status;
        if(isStatusChange){
            switch(nextProps.config.status){
                case 'add':
                    this.state.status = 'add';
                    break;
                case 'update':
                case 'edit':
                    this.state.status = 'edit';
                    break;
                default:
                    this.state.status = 'browse';
            }
        }
        this.setState(this.state,()=>{
            this.props.cardTable && this.props.cardTable.setStatus(this.config.tableId,this.state.status);
        });
    }
    componentDidUpdate(){
        //this.props.button.setButtonVisible('AddLine',!this.props.config.showReturn);
        let formStatus = this.props.form.getFormStatus(this.config.formId);
        if(!formStatus || formStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }
    /*shouldComponentUpdate(nextProps, nextState){
        if(nextProps.config.pageCode === this.config.pageCode && nextProps.config.isSave === this.config.isSave)
            return false;
        else
            return true;
    }*/
    /**
     * 切换组织事件
     * @param value
     */
    onOrgChange(value){ //选择行政组织钩子
        var me = this;
        if(value){
            let meta = me.props.meta.getMeta();
            if(me.config.tab == 0){
                meta[me.config.formId].items.find((item) => item.attrcode == 'pk_material').isShowUnit=false;
                meta[me.config.formId].items.find((item) => item.attrcode == 'pk_marbasclass').isShowUnit=false;
            }else{
                meta[me.config.formId].items.find((item) => item.attrcode == 'pk_supplier').isShowUnit=false;
            }
            let oldOrg = me.state.curOrg;
            if(oldOrg && oldOrg.value !== value.value && oldOrg.value){
                promptBox({
                    color:'warning',
                    noFooter:false,
                    userControl:true,
                    title: me.state.json['10140SGMENU-000024'],/* 国际化处理： 确认修改*/
                    content: me.state.json['10140SGMENU-000025'],/* 国际化处理： 是否修改组织，这样会清空您录入的信息？*/
                    beSureBtnClick:me.clearPage.bind(this,value),
                    cancelBtnClick:()=>{
                        me.props.form.setFormItemsValue(me.props.config.orgFormId||`form`,{
                            'pk_org':me.state.curOrg
                        });
                        //me.props.modal.close('modal');
                    }
                });
            }else if(!oldOrg || !oldOrg.value){
                me.state.curOrg = value;
                me.setState(me.state);
            }
        }
    }

    /**
     * 切换组织清空页面数据
     */
    clearPage(value){
        var me = this;
        me.state.curOrg = value;
        me.setState(me.state,()=>{
            me.props.modal.close('modal');
            me.props.form.EmptyAllFormValue(me.config.formId);
            me.props.cardTable.setTableData(me.config.tableId,{rows:[]});
        });
/*
        me.props.form.setFormStatus(me.config.formId,'edit');
        me.props.cardTable.setStatus(me.config.tableId,'edit');*/
    }

    /**
     * 设置字段是否可编辑
     * @param obj 格式{meta:meta,moudleId:id,filedKeys:[],disable:true or false}
     */
    disabledFiles(obj){
        let {meta,moudleId,fieldKeys,disable} = obj;
        !Array.isArray(moudleId) &&
        meta[moudleId].items.forEach((item)=>{
            if(fieldKeys.includes(item.attrcode))
                item.disabled = disable;
        });
        Array.isArray(moudleId) && moudleId.forEach((id)=>{
            meta[id].items.forEach((item)=>{
                if(fieldKeys.includes(item.attrcode))
                    item.disabled = disable;
            });
        });
        return meta;
    }
    /**
     * 表单编辑后事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index,refValue){
        var me = this;
        if('form,form2'.includes(moduleId)){
            if(key == 'pk_org'){
                props.form.setFormStatus(props.config.formId,'edit');
                props.cardTable.setStatus(props.config.tableId,'edit');
                if(value.value){
                    props.button.setDisabled({
                        'AddLine':false
                    });
                    props.button.setButtonVisible('AddLine',true);
                }else{
                    props.button.setButtonVisible('AddLine',false);
                }
                me.onOrgChange(value);
                /**
                 * 供应商（BD604） 物料（BD602） 需要根据对应多级管控设置（业务参数设置）里参数过滤
                 */
                let meta = props.meta.getMeta();
                let  attrcode = props.config.tab == 0 ? 'pk_supplier' : 'pk_material';
                let formAtr = ['pk_marbasclass','pk_material','pk_supplier'];
                meta[me.config.formId].items.forEach((item)=>{
                    if(formAtr.includes(item.attrcode)){
                        item.queryCondition = {
                            pk_org:value.value
                        }
                    }
                });
                meta[me.config.tableId].items.find(item=>item.attrcode==attrcode).queryCondition={
                    pk_org:value.value
                };
                meta[`${me.config.tableId}_form1`].items.find(item=>item.attrcode==attrcode).queryCondition={
                    pk_org:value.value
                };
                meta[`${me.config.tableId}_form2`].items.find(item=>item.attrcode==attrcode).queryCondition={
                    pk_org:value.value
                };
            }
        }
        if(props.config.tab == 0){
            /*当选择物料分类，下述字段不可编辑*/
            let needChangeStatusFileds = ['bmainvendor','bnocheck','bfrozen','cqualitylevelid','npriority',
            'iconsignadvance','iloadadvance','iappcustomadvance','ioutcustomadvance','nminiordernum',
            'norderbatchnum','nquota','nbatchnum','vvendinventorycode','vvendinventoryname','nquotabase',
            'deligeffectday'];
            let meta = props.meta.getMeta();

            if(key == 'pk_marbasclass'){
                if(value.value){
                    props.form.setFormItemsValue(props.config.formId,{'pk_marbasclass.name':{value:refValue.refname}});
                    /*meta[me.config.formId].items.find((item) => item.attrcode == 'pk_material').queryCondition={
                            pk_marbasclass: value.value
                    };*/
                    //设置子表编辑性
                    meta = me.disabledFiles({
                        meta:meta,
                        moudleId:[me.config.tableId,`${me.config.tableId}_form1`,`${me.config.tableId}_form2`],
                        disable:true,
                        fieldKeys:needChangeStatusFileds
                    });

                    props.meta.setMeta(meta,()=>{
                        props.form.setFormItemsValue(props.config.formId,{
                            'pk_material':{value:'',display:''},
                            'pk_material.name':{value:'',display:''},
                            'pk_material.materialspec':{value:'',display:''},
                            'pk_material.materialtype':{value:'',display:''},
                            'pk_material.pk_measdoc':{value:'',display:''}
                        });
                        me.state.pk_marbasclass = value.value;
                    });

                }else{
                    //设置子表编辑性
                    meta = me.disabledFiles({
                        meta:meta,
                        moudleId:[me.config.tableId,`${me.config.tableId}_form1`,`${me.config.tableId}_form2`],
                        disable:false,
                        fieldKeys:needChangeStatusFileds
                    });
                    props.meta.setMeta(meta,()=>{
                        props.form.setFormItemsValue(props.config.formId,{'pk_marbasclass.name':{value:''}});
                        me.state.pk_marbasclass = '';
                    });

                }
                me.setState(me.state,()=>{loadDetailData(props, refValue);});
            }
            if(key == 'pk_material'){
                if(value.value) {
                    //设置子表编辑性
                    meta = me.disabledFiles({
                        meta:meta,
                        moudleId:[me.config.tableId,`${me.config.tableId}_form1`,`${me.config.tableId}_form2`],
                        disable:false,
                        fieldKeys:needChangeStatusFileds
                    });
                    props.meta.setMeta(meta,()=>{
                        me.state.pk_material = value.value;
                        props.form.setFormItemsValue(props.config.formId,{
                            'pk_marbasclass.name':{value:'',display:''},
                            'pk_marbasclass':{value:'',display:''}
                        });
                        loadMaterialDetail(props, refValue,me,()=>{
                            loadDetailData(props, refValue);
                        });
                    });

                }else{
                    props.form.setFormItemsValue(props.config.formId,{
                        'pk_material.name':{value:'',display:''},
                        'pk_material.materialspec':{value:'',display:''},
                        'pk_material.materialtype':{value:'',display:''},
                        'pk_material.pk_measdoc':{value:'',display:''}
                    });
                    props.cardTable.setTableData(props.config.tableId,{rows:[]});
                    me.state.pk_material = '';
                }
                me.setState(me.state);
            }
        }else{
            if(key == 'pk_supplier'){
                if(value){
                    props.form.setFormItemsValue(props.config.formId,{'pk_supplier.name':{value:refValue.refname}});
                    me.state.pk_supplier = value.value;
                    loadDetailData(props,refValue);
                }else{
                    props.form.setFormItemsValue(props.config.formId,{'pk_supplier.name':{value:''}});
                    me.state.pk_supplier = '';
                }
                me.setState(me.state);
            }
        }
    }

    /**
     * 表格编辑后事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param changedrows
     * @param index
     * @param record
     * @param type
     */
    onAfterEvent = (props, moduleId,key,value,changedrows,index,record,type)=>{
        var me = this;
        if(props.config.tab == 0){//按物料维护供应商
            switch(key){
                case 'pk_supplier':
                    if(Array.isArray(value)) {
                        value.forEach((item, ind) => {
                            if(ind == 0)
                                return;
                            setTimeout(() => {
                                me.props.cardTable.addRow(moduleId, index + ind, {
                                    pk_supplier: {value: item.refpk, display: item.refcode},
                                    'pk_supplier.name': {value: item.refname, display: item.refname}
                                });
                            }, 0);
                        });
                        if(value[0] && value[0].refpk)
                            me.props.cardTable.setValByKeysAndIndex(moduleId, index,{
                                pk_supplier: {value: value[0].refpk, display: value[0].refcode},
                                'pk_supplier.name': {value: value[0].refname, display: value[0].refname}
                            });
                        else
                            me.props.cardTable.setValByKeyAndIndex(moduleId,index,`pk_supplier.name`,{value:'',display:''});
                    }else{
                        if(value.refpk){
                            me.props.cardTable.setValByKeyAndIndex(moduleId,index,`pk_supplier.name`,{value:value.refname,display:value.refname});
                        }else{
                            me.props.cardTable.setValByKeyAndIndex(moduleId,index,`pk_supplier.name`,{value:'',display:''});
                        }
                    }

                    break;
                case 'pk_level':
                    if(value.refpk){
                        me.props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_level.supstatus':value.values ? value.values.supstatus : {value:'',display:''}
                        });
                    }else{
                        me.props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_level.supstatus':{value:'',display:''}
                        });
                    }
                    break;
                case 'pk_hierarchy':
                    let meta = me.props.meta.getMeta();
                    if(value.refpk){
                        meta[me.config.tableId].items.find((item)=>item.attrcode=='pk_level').queryCondition={
                            pk_suppliergrade:value.refpk
                        };
                        meta[`${me.config.tableId}_form1`].items.find((item)=>item.attrcode=='pk_level').queryCondition={
                            pk_suppliergrade:value.refpk
                        };
                        meta[`${me.config.tableId}_form2`].items.find((item)=>item.attrcode=='pk_level').queryCondition={
                            pk_suppliergrade:value.refpk
                        };
                    }else{
                        meta[me.config.tableId].items.find((item)=>item.attrcode=='pk_level').queryCondition={};
                        meta[`${me.config.tableId}_form1`].items.find((item)=>item.attrcode=='pk_level').queryCondition={};
                        meta[`${me.config.tableId}_form2`].items.find((item)=>item.attrcode=='pk_level').queryCondition={};
                    }
                    break;
            }
        }else{
            /*当选择物料分类时，将下述字段置灰，避免因修改这些字段导致保存时会写主供应商时报错*/
            let needChangeStatusFileds = ['bmainvendor','bnocheck','bfrozen','cqualitylevelid','npriority',
                'iconsignadvance','iloadadvance','iappcustomadvance','ioutcustomadvance','nminiordernum',
                'norderbatchnum','nquota','nbatchnum','vvendinventorycode','vvendinventoryname','nquotabase',
                'deligeffectday'];
            let temp = props.meta.getMeta();
            switch (key){
                case 'pk_marbasclass':
                    if(value.refpk){
                        //设置子表编辑性
                        temp = me.disabledFiles({
                            meta:temp,
                            moudleId:[me.config.tableId,`${me.config.tableId}_form1`,`${me.config.tableId}_form2`],
                            disable:true,
                            fieldKeys:needChangeStatusFileds
                        });
                        props.meta.setMeta(temp,()=>{
                            me.props.cardTable.setValByKeysAndIndex(moduleId,index,{
                                'pk_marbasclass.name':{value:value.refname,display:value.refname},
                                'pk_material':{value:'',display:''},
                                'pk_material.name':{value:'',display:''},
                                bmainvendor:{value:'',display:''},
                                bnocheck:{value:'',display:''},
                                bfrozen:{value:'',display:''},
                                'pk_material.materialspec':{value:'',display:''},
                                'pk_material.materialtype':{value:'',display:''},
                                'pk_material.pk_measdoc':{value:'',display:''}
                            });
                        });

                    }else{
                        me.props.cardTable.setValByKeyAndIndex(moduleId,index,`pk_marbasclass.name`,{value:'',display:''});
                    }
                    break;
                case 'pk_material':
                    if(Array.isArray(value)) {
                        //设置子表编辑性
                        temp = me.disabledFiles({
                            meta:temp,
                            moudleId:[me.config.tableId,`${me.config.tableId}_form1`,`${me.config.tableId}_form2`],
                            disable:false,
                            fieldKeys:needChangeStatusFileds
                        });
                        props.meta.setMeta(temp,()=>{
                            value.forEach((item, ind) => {
                                if(ind == 0)
                                    return;
                                setTimeout(() => {
                                    me.props.cardTable.addRow(moduleId, index + ind, {
                                        pk_material:{value:item.refpk,display:item.refcode},
                                        'pk_material.name':{value:item.refname,display:item.refname},
                                        'pk_marbasclass':{value:'',display:''},
                                        'pk_marbasclass.name':{value:'',display:''},
                                        pk_srcmaterial:item.values.pk_source,
                                        'pk_material.materialspec':item.values.materialspec,
                                        'pk_material.materialtype':item.values.materialtype,
                                        'pk_material.pk_measdoc':{value:item.values.pk_measdoc.value,display:item.values.measdoc_name.value}
                                    });
                                }, 0);
                            });
                            if(value[0] && value[0].refpk)
                                me.props.cardTable.setValByKeysAndIndex(moduleId, index,{
                                    pk_material:{value:value[0].refpk,display:value[0].refcode},
                                    'pk_material.name':{value:value[0].refname,display:value[0].refname},
                                    'pk_marbasclass':{value:'',display:''},
                                    'pk_marbasclass.name':{value:'',display:''},
                                    pk_srcmaterial:value[0].values.pk_source,
                                    'pk_material.materialspec':value[0].values.materialspec,
                                    'pk_material.materialtype':value[0].values.materialtype,
                                    'pk_material.pk_measdoc':{value:value[0].values.pk_measdoc.value,display:value[0].values.measdoc_name.value}
                                });
                            else
                                me.props.cardTable.setValByKeysAndIndex(moduleId,index,{
                                    'pk_material.name':{value:'',display:''},
                                    pk_srcmaterial:{value:'',display:''},
                                    'pk_material.materialspec':{value:'',display:''},
                                    'pk_material.materialtype':{value:'',display:''},
                                    'pk_material.pk_measdoc':{value:'',display:''}
                                });
                        });
                    }else{
                        if(value.refpk){
                            me.props.cardTable.setValByKeysAndIndex(moduleId,index,{
                                'pk_material.name':{value:value.refname,display:value.refname},
                                'pk_marbasclass':{value:'',display:''},
                                'pk_marbasclass.name':{value:'',display:''},
                                pk_srcmaterial:value.values.pk_source,
                                'pk_material.materialspec':value.values.materialspec,
                                'pk_material.materialtype':value.values.materialtype,
                                'pk_material.pk_measdoc':{value:value.values.pk_measdoc.value,display:value.values.measdoc_name.value}
                            });
                        }else{
                            me.props.cardTable.setValByKeysAndIndex(moduleId,index,{
                                'pk_material.name':{value:'',display:''},
                                pk_srcmaterial:{value:'',display:''},
                                'pk_material.materialspec':{value:'',display:''},
                                'pk_material.materialtype':{value:'',display:''},
                                'pk_material.pk_measdoc':{value:'',display:''}
                            });
                        }
                    }
                    break;
                case 'pk_level':
                    if(value.refpk){
                        me.props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_level.supstatus':value.values ? value.values.supstatus : {value:'',display:''}
                        });
                    }else{
                        me.props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_level.supstatus':{value:'',display:''}
                        });
                    }
                    break;
                case 'pk_hierarchy':
                    //let meta = me.props.meta.getMeta();
                    if(value.refpk){
                        temp[me.config.tableId].items.find((item)=>item.attrcode=='pk_level').queryCondition={
                            pk_suppliergrade:value.refpk
                        };
                        temp[`${me.config.tableId}_form1`].items.find((item)=>item.attrcode=='pk_level').queryCondition={
                            pk_suppliergrade:value.refpk
                        };
                        temp[`${me.config.tableId}_form2`].items.find((item)=>item.attrcode=='pk_level').queryCondition={
                            pk_suppliergrade:value.refpk
                        };
                    }else{
                        temp[me.config.tableId].items.find((item)=>item.attrcode=='pk_level').queryCondition={};
                        temp[`${me.config.tableId}_form1`].items.find((item)=>item.attrcode=='pk_level').queryCondition={};
                        temp[`${me.config.tableId}_form2`].items.find((item)=>item.attrcode=='pk_level').queryCondition={};
                    }
                    break;
            }
        }
    }
    /**
     * 按钮点击事件
     * @param id
     */
    onButtonClick(props,id) {
        var me = this;
        switch (id) {
            case "AddLine":
                let allRows = props.cardTable.getNumberOfRows(me.config.tableId);
                props.cardTable.addRow(me.config.tableId);
                //props.cardTable.openModel(tableId,'add');
                break;
            default:
                console.log(id);
                break;
        }
    }
    /**
     *获取列表肩部信息
     */
    getTableHead = () => {
        let {button} = this.props;
        let { createButtonApp } = button;
        return (
            <div>
                <div className="btn-group" style={{paddingTop:5}}>
                    {createButtonApp({
                        area: 'table',
                        buttonLimit: 3,
                        onButtonClick: this.onButtonClick.bind(this)
                    })}
                </div>
               {/* <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(this.config.tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>*/}
            </div>
        )
    }
    render(){
        var me = this;
        const {form,button,modal,DragWidthCom,search,cardTable} = me.props;
        const {createForm} = form;//创建表单，需要引入这个
        const {createCardTable } = cardTable;
        let { createModal } = modal;  //模态框

        return(
            <div>
                {createModal('modal',{
                    noFooter:false,
                    userControl:true
                })}
                <div className="nc-bill-extCard">
                    <div className="nc-bill-top-area">
                        <div className="nc-bill-form-area">
                            {createForm(me.config.orgFormId, {
                                onAfterEvent:me.onAfterFormEvent.bind(this)
                            })}
                            {createForm(me.config.formId, {
                                title:me.state.formTitle,
                                onAfterEvent:me.onAfterFormEvent.bind(this)
                            })}
                        </div>
                    </div>
                    <div className="nc-bill-bottom-area">
                        <div className="nc-bill-tableTab-area">
                            {createCardTable(me.config.tableId, {
                                isAddRow: true,
                                onAfterEvent:me.onAfterEvent.bind(this),//编辑后事件
                                showIndex:true,
                                showMax:true,
                                hideModelSave:true,
                                adaptionHeight:true,//自动铺满
                                tableHead:me.getTableHead.bind(this)
                                //modelClose:me.closeModel.bind(this)//关闭侧拉框事件
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}

/**
 * 加载table数据
 */
const loadDetailData = (props,value,callback)=>{
    let pk_org = props.form.getFormItemsValue(props.config.orgFormId||'form',"pk_org");
    let requestParam = {
        pk:value.refpk,
        pk_org:pk_org.value,
        pageCode:props.config.pageCode,
        tab:props.config.tab
    }
    ajax({
        url: urls["queryDetailUrl"],
        data:requestParam,
        success: (res) =>{
            let{data,success}=res;
            if(success){
                if(data)
                    props.cardTable.setTableData(props.config.tableId,data[props.config.tableId]);
                else
                    props.cardTable.setTableData(props.config.tableId,{rows:[]});
                if(callback)
                    callback();
            }
        }
    });
}
/**
 * 加载物料信息
 * @param props
 * @param value
 */
const loadMaterialDetail = (props,value,me,callback)=>{
    let requestParam = {
        pk:value.refpk
    }
    ajax({
        url: urls["queryMaterialDetailUrl"],
        data:requestParam,
        success: (res) =>{
            let{data,success}=res;
            if(success){
                if(data){
                    props.form.setFormItemsValue(props.config.formId,{
                        //'pk_marbasclass':{value:data[`pk_marbasclass`],display:data[`classcode`]},
                        //'pk_marbasclass.name':{value:data[`classname`]},
                        'pk_material.name':{value:data[`name`]},
                        'pk_material.materialspec':{value:data[`materialspec`]},
                        'pk_material.materialtype':{value:data[`materialtype`]},
                        'pk_material.pk_measdoc':{value:data[`pk_measdoc`],display:data[`measname`]}
                    });
                    me.state.pk_marbasclass = data[`pk_marbasclass`];
                    me.setState(me.state);
                }
                if(callback)
                    callback();
            }
        }
    });
}

/**
 * 创建页面
 */
export default SgmenuForm = createPage({})(SgmenuForm);
//yroiyG7jE4/bSWsKzXRgBHMgEStsOTUevvjxBX/QCCDk59vjuGP8LYjMqdUSkHPT