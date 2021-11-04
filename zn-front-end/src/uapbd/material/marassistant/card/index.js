//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,NCDatePicker,promptBox,toast,getMultiLang,cardCache} from 'nc-lightapp-front';
let { NCCol:Col, NCRow:Row,NCAffix } =base;
const {NCBackBtn}=base;
const { NCDiv } = base;
let { getCacheById, updateCache ,addCache,getCurrentLastId ,getNextId, deleteCacheById } = cardCache;
import './index.less';
const  formId = 'head';
const tableId = 'marasstrange';
let uiStatus = 'browse';

import {conf as unitConf} from '../../../../uapbd/refer/org/BusinessUnitTreeRef/index';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';

const appId = '0001Z010000000002YMX';
const appCode = '10140MASST';
const pageCode = '10140MASST_card';
const tableBtnAry = ["DelLine"];		//表列操作按钮
const toListURl = '/list';
// const toListURl = '/uapbd/material/marassistant/main/index.html';
let cachKey = '10140MASST_list';//缓存的标识

let ajaxUrl = {
    queryByPkUrl : "/nccloud/uapbd/material/MarAssistantQueryByPkAction.do",
    saveUrl:"/nccloud/uapbd/material/MarAssistantSaveAction.do",
    deleteUrl:"/nccloud/uapbd/material/MarAssistantDeleteAction.do",
    itemQryUrl:"/nccloud/uapbd/material/MarAssitantOrgNameQuryAction.do",
    userDefRefUrl:"/nccloud/uapbd/material/UserDefRefQueryAction.do"
}

/**
 * 辅助属性编辑界面
 * wangdca
 */
class CRECREditForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            json:{}	
        }
        this.initTemplate(props);
    }
    //处理新增
    onAddNew(){
        let pk_marasstframe = this.props.getUrlParam('pk_marasstframe');
        ajax({
            url:ajaxUrl.queryByPkUrl,
            data:{pk_marasstframe:pk_marasstframe},
            success:(res)=>{
                if(res.success){
                    //清除上个界面的所有的值
                    this.props.form.EmptyAllFormValue(formId);
                    this.props.form.setFormStatus(formId,'add');
                    // this.props.form.setAllFormValue(res.data.form);
                    let cardData = {rows:res.data.form.head.rows};
                    let value = {'head':cardData};
                    Utils.filterEmptyData(value.head.rows[0].values);
                    this.props.form.setAllFormValue(value);
                    this.props.cardTable.setTableData(tableId,{rows: []});
                    this.toggleShow ("add");
                }else{
                    alert(res.message);
                }
            }
        });
    }



    //获取url的status
    getStatus(){
        if(window.location.hash.indexOf('#')!=-1){
            return window.location.hash.split('#')[1].split("&")[0].split("=")[1];
        }else{
            return 'browse';
        }
    }

    //切换页面状态--设置按钮显示和业务状态
	toggleShow (status) {
        uiStatus = status;
        //浏览态
        if('browse'===status){
            let pk_marassistant = this.props.getUrlParam('id');
            if(pk_marassistant){
                this.props.button.setButtonsVisible({
                    Add:true,
                    Copy:true,
                    Edit:true,
                    Delete:true,
                    Refresh:false,
                    Return:true,
                    Save:false,
                    SaveAdd:false,
                    Cancel:false,
                    AddLine:false,
                    DelLine:false
                });
            }else{
                this.props.button.setButtonsVisible({
                    Add:true,
                    Copy:false,
                    Edit:false,
                    Delete:false,
                    Refresh:false,
                    Return:true,
                    Save:false,
                    SaveAdd:false,
                    Cancel:false,
                    AddLine:false,
                    DelLine:false
                });
            }
            this.props.cardTable.setStatus(tableId, "browse");
            this.props.form.setFormStatus(formId, 'browse');
            //控制返回按钮是否显示
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: true
            });
            //是否显示翻页
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }else{//编辑状态
            this.props.button.setButtonsVisible({
                Add:false,
                Edit:false,
                Copy:false,
                Delete:false,
                Refresh:false,
                Return:false,
                Save:true,
                SaveAdd:true,
                Cancel:true,
                AddLine:true,
                DelLine:true
            });
            this.props.cardTable.setStatus(tableId, 'edit');
            this.props.form.setFormStatus(formId, 'edit');
            //控制返回按钮是否显示
            this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false
            });
            //是否显示翻页
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            if(status ==='add'){
                this.props.button.setButtonDisabled(['SaveAdd'],false);
            }else{
                this.props.button.setButtonDisabled(['SaveAdd'],true);
            }
        }
        if(uiStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
	};

    //获取url的pkjob
    getPk_ccregion(){
        if(window.location.hash.indexOf('#')!=-1){
            return window.location.hash.split('#')[1].split("&")[1].split("=")[1];
        }else{
            return '';
        }

    }
    //根据卡片状态控制按钮显示
    componentDidMount() {
        let pk_marassistant = this.props.getUrlParam('id');
        // let pk_marasstframe = this.props.getUrlParam('pk_marasstframe');
        let status = this.props.getUrlParam('status');
        this.loadCardData(pk_marassistant,status);
    }
    /**
     * 加载数据
     * @param {主键} pk_marassistant 
     * @param {辅助数据结构主键} pk_marasstframe 
     * @param {界面状态} status 
     */
    loadCardData(pk_marassistant,status='browse'){
        let pk_marasstframe = this.props.getUrlParam('pk_marasstframe');
        let that = this;
        ajax({
            url:ajaxUrl.queryByPkUrl,
            data:{pk_marassistant:pk_marassistant,pk_marasstframe:pk_marasstframe},
            success:(res)=>{
                if(res){
                    that.props.table.setAllTableData(tableId, {rows:[]});
                    let cardData = {rows:res.data.form.head.rows};
                    let value = {'head':cardData}
                    that.props.form.setAllFormValue(value);
                    if( res.data.grid){//有子表数据
                        this.props.cardTable.setTableData(tableId, res.data.grid.marasstrange);
                    }
                    //更新URL中的主键的值，上下翻页要以此为依据查找上下的主键
                    this.props.setUrlParam(pk_marassistant);
                    setTimeout(() => {
                        let codeCell = that.props.form.getFormItemsValue(formId,'code');
                        if(codeCell&&codeCell.value){
                            this.resetBodyRef(that.props,codeCell.value,status === 'browse'?false:true,that.props.form.getFormItemsValue(formId,'pk_userdefitem').value);
                        }
                    }, 10);
                    this.toggleShow(status);
                }else{
                    alert(res.message)
                }
            }
        });
    }

    //取消
    onCancled(){
        let pk_marassistant = this.props.getUrlParam('id');
        if(!pk_marassistant){
            pk_marassistant = getCurrentLastId(cachKey);
        }
        this.loadCardData(pk_marassistant,'browse');

        // let pk_marassistant = this.props.getUrlParam('id');
        // let status = this.props.getUrlParam('status');
        // // if(status == "edit"){//修改状态撤销修改  
        // //     this.props.form.cancel(formId);
        // //     this.props.editTable.cancelEdit(tableId);
        // //     this.toggleShow('browse');
        // // }else{
        //     if(pk_marassistant){//若以前界面有值则要恢复
        //         ajax({
        //             url:ajaxUrl.queryByPkUrl,
        //             data:{pk_marassistant:pk_marassistant},
        //             success:(res)=>{
        //                 if(res){
        //                     // this.props.form.setAllFormValue(res.data.form);
        //                     let cardData = {rows:res.data.form.head.rows};
        //                     let value = {'head':cardData}
        //                     this.props.form.setAllFormValue(value);
        //                     if( res.data.grid){//有子表数据
        //                         // this.props.editTable.setTableData(tableId, res.data.grid.financeorgs);
        //                         this.props.cardTable.setTableData(tableId, res.data.grid.marasstrange);
        //                     }
        //                     this.toggleShow('browse')
        //                     let codeCell = this.props.form.getFormItemsValue(formId,'code');
        //                     if(codeCell&&codeCell.value){
        //                         this.resetBodyRef(this.props,codeCell.value);
        //                     }
        //                 }else{
        //                     alert(res.message)
        //                 }
        //             }
        //         });
        //     }else{
        //         this.props.form.cancel(formId)
        //         this.props.cardTable.resetTableData(tableId)
        //         this.toggleShow('browse')
        //     }
        // // }
    }

    /**
     * 
     * @param {*} saveType  保存类别--保存、保存新增
     */
    onSaveAction(saveType){
        let flag = this.props.form.isCheckNow(formId);
        if(!flag){
            return;
        }
        // this.props.cardTable.filterEmptyRows(tableId);
        this.props.cardTable.filterEmptyRows(tableId,['value'],'include');
        if(!this.props.cardTable.checkTableRequired(tableId)) {//edittable的必输项校验   
            return;
        }
        let CardData = this.props.createMasterChildData(pageCode, formId, tableId);
        //公式校验
        this.props.validateToSave( CardData ,()=>{
            this.saveCardData(saveType,CardData)
        }, {
            formId: 'head',
            [tableId]: 'marasstrange'
        },'card');
    }

    saveCardData(saveType,saveData){
        let that = this;
        let pk =  this.props.form.getFormItemsValue(formId,'pk_marassistant').value;
        ajax({
            url:ajaxUrl.saveUrl,
            data:saveData,
            success:function(res){
                let { success, data } = res;
                if(success){
                    // props.form.setAllFormValue(data.form);
                    that.props.table.setAllTableData(tableId, {rows:[]});//清空子表，再赋值，否则有可能有垃圾数据
                    let cardData = {rows:res.data.form.head.rows};
                    let pk_value = res.data.form.head.rows[0].values.pk_marassistant.value;
                    let value = {'head':cardData}
                    that.props.form.setAllFormValue(value);
                    if( res.data.grid){//有子表数据
                        that.props.cardTable.setTableData(tableId, res.data.grid.marasstrange);
                    }
                    toast({ color: 'success', title: that.state.json['10140MASST-000000'] });/* 国际化处理： 保存成功！*/
                    if('SaveAdd' === saveType){
                        // toast({ color: 'success', title: '保存成功,开始新增' });
                        that.onAddNew();
                    }else{
                        that.toggleShow('browse');
                    }

                    var cachdata = {head:{head:{rows:res.data.form.head.rows}}}//更新缓存的数据
                    //新增的数据要加入缓存
                    if(pk){
                        // updateCache('pk_marassistant',pk_value, cachdata,formId,cachKey);
                    }else{
                        addCache(pk_value, cachdata,formId,cachKey);
                    }

                     //更新URL中的主键的值，上下翻页要以此为依据查找上下的主键
                     that.props.setUrlParam(pk_value);
                }
            }
        });
    }
    //按钮点击事件
    onClickHeaderBtn(props,id){
        //获取表单状态
        let headstatus = props.form.getFormStatus('head');
        let that = this;

        switch (id) {
            case'Add':
                this.onAddNew();
            break;
            case 'Save':
                this.onSaveAction('Save'); 
                break;
            case 'SaveAdd' :
                 this.onSaveAction('SaveAdd');
            break;
            case 'Edit':
                this.toggleShow('edit');
                break;
            break;
            case 'Delete':
                let pkCell = props.form.getFormItemsValue(formId,'pk_marassistant');
                let pk_marassistant=pkCell.value;
                let tsCell = props.form.getFormItemsValue(formId,'ts');
                let ts=tsCell.value;

                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10140MASST-000001'],/* 国际化处理： 删除*/
                    content:this.state.json['10140MASST-000002'],/* 国际化处理： 确定要删除所选数据吗？*/
                    beSureBtnClick:()=>{
                        ajax({
                            url:ajaxUrl.deleteUrl,
                            data:{pk_marassistant:pk_marassistant,ts:ts},
                            success:function(res){
                                if(res.success){
                                    //清除表单数据
                                    // props.form.EmptyAllFormValue('head').bind(_this);
                                    // props.linkTo('/uapbd/org/creditctlregion/main/index.html')
                                    // props.pushTo(toListURl,{
                                    //     status: 'browse',
                                    //     pagecode:'10140MASST_list'
                                    // });

                                    //删除后显示下一条数据
                                    let nextId = getNextId(pk_marassistant, cachKey);//根据当前id,获取下个id
                                    //调用删除缓存数据方法
                                    deleteCacheById("pk_marassistant",pk_marassistant,cachKey);
                                    //根据nextId查询下条数据
                                    that.loadCardData(nextId,'browse');
                                }else{
                                    alert(res.message);
                                }
                            }
                        });
                    }
                })
                break;
            case'Return':
                // props.linkTo('/uapbd/org/creditctlregion/main/index.html');
                // props.linkTo(toListURl);
                props.pushTo(toListURl,{
                    status: 'browse',
                    pagecode:'10140MASST_list'
                });
                break;
            case 'Cancel':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10140MASST-000003'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10140MASST-000004'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick:()=>{
                        this.onCancled();
                    }
                })
                // this.onCancled();
                // props.form.cancel(formId);
                // props.cardTable.resetTableData(tableId);
                // this.toggleShow('browse');
            break;
            default:
            break;
        }

    }
    //表单编辑后事件
    onAferEdit(props, moduleId, key, value, oldValue,record){
        if(key === 'code'&&value.value!=oldValue.value){
            let codeCell = props.form.getFormItemsValue(formId,'code');
            codeCell.value = record.refcode;
            codeCell.display = record.refcode;
            props.form.setFormItemsValue(formId,{'code':codeCell});
            
            let nameCell = props.form.getFormItemsValue(formId,'pk_userdefitem.showname');
            nameCell.value = record.refname;
            nameCell.display = record.refname;
            props.form.setFormItemsValue(formId,{'pk_userdefitem.showname':nameCell});

            let pkCell = props.form.getFormItemsValue(formId,'pk_userdefitem');
            pkCell.value = record.refpk;
            pkCell.display = record.refpk;
            props.form.setFormItemsValue(formId,{'pk_userdefitem':pkCell});

            let classCell = props.form.getFormItemsValue(formId,'pk_userdefitem.classid');
            classCell.value = record.values?record.values.classid.value:null;
            classCell.display = record.values?record.values.displayname.value:null;
            props.form.setFormItemsValue(formId,{'pk_userdefitem.classid':classCell});

            //清空子表，重置子表参照
            this.resetBodyRef(props,record.refcode,true,record.refpk);
            this.props.cardTable.setTableData(tableId, { rows: [] });
        }
    }

    /**
     * 根据主表的辅助属性编码 动态设置子表 属性的参照
     * @param {*} props 
     * @param {*} value 
     */
    resetBodyRef(props,value,isEdit = false,pk_userdefitem){
        if(isEdit){
            this.props.cardTable.setStatus(tableId, 'edit');
            this.props.button.setButtonDisabled(['AddLine'],false);
        }
          // 重要！下面那行一定要写
        this.props.renderItem('table', tableId, 'value', null) // 前三个参数，根据模板json填对应值，moduleId是区域id
        let meta = props.meta.getMeta();
        meta[tableId].items.map((obj)=>{
            if(obj.attrcode === 'value'){
                obj.isMultiSelectedEnabled = true;
                obj.refcode = null;
                switch (value) {
                    case '1'://库存状态 1
                        obj.refcode = 'uapbd/refer/material/StoreStateGridRef/index.js';
                        obj.refName=this.state.json['10140MASST-000005'];/* 国际化处理： 库存状态*/
                        obj.isShowUnit = false;
                    break
                    case '2'://项目 2
                        obj.refcode = 'uapbd/refer/pm/ProjectDefaultTreeGridRef/index.js';
                        obj.refName = this.state.json['10140MASST-000006'];/* 国际化处理： 项目*/
                        obj.isShowUnit = true;
                        unitConf.placeholder = this.state.json['10140MASST-000007'];/* 国际化处理： 业务单元*/
                        obj.unitProps=unitConf;
                    break
                    case '3' ://供应商档案 3 
                        obj.refcode = 'uapbd/refer/supplier/SupplierRefTreeGridRef/index.js';
                        obj.refName = this.state.json['10140MASST-000008'];/* 国际化处理： 供应商档案*/
                        obj.isShowUnit = true;
                        unitConf.placeholder = this.state.json['10140MASST-000007'];/* 国际化处理： 业务单元*/
                        obj.unitProps=unitConf;
                    break
                    case '4' ://生产厂商 4
                        obj.refcode = 'uapbd/refer/userdef/DefdocGridRef/index.js';
                        obj.refName = this.state.json['10140MASST-000009'];/* 国际化处理： 生产厂商*/
                        obj.isShowUnit = false;
                        obj.queryCondition = function () {
                            return {
                                "pk_defdoclist":'1002ZZ1000000000066Q'
                            }
                        }
                    break
                    case '5' ://客户 5
                        obj.refcode = 'uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
                        obj.refName = this.state.json['10140MASST-000010'];/* 国际化处理： 客户*/
                    break
                    case '100' ://特征码 100
                        obj.refcode = 'uapbd/refer/material/FFileSkuCodeGridRef/index.js';
                        obj.refName = this.state.json['10140MASST-000011'];/* 国际化处理： 特征码*/
                    break
                    default://其他情况设置子表不可编辑,保留不要删除
                        // ajax({
                        //     url:ajaxUrl.userDefRefUrl,
                        //     data:{pk_userdefitem:pk_userdefitem},
                        //     success:(res)=>{
                        //         if(res.data){
                        //             obj.refcode = res.data;//自定义参照如何添加条件呢pk_defdoclist
                        //         }else{
                        //             this.props.cardTable.setStatus(tableId, 'browse');
                        //             this.props.button.setButtonDisabled(['AddLine'],true);
                        //         }
                        //     }
                        // });
                        this.props.cardTable.setStatus(tableId, 'browse');
                        this.props.button.setButtonDisabled(['AddLine'],true);
                    break
                }
                // if(va lue = == '1'){//库存状态 1
                //     obj.refcode = 'uapbd/refer/material/StoreStateGridRef/index.js';
                //     obj.refName=this.state.json['10140MASST-000005'];/* 国际化处理： 库存状态*/
                // }
                // if(value === '2'){//项目 2
                //     obj.refcode = 'uapbd/refer/pm/ProjectDefaultTreeGridRef/index.js';
                //     obj.refName = this.state.json['10140MASST-000006'];/* 国际化处理： 项目*/
                //     obj.isShowUnit = true;
                //     unitConf.placeholder = this.state.json['10140MASST-000007'];/* 国际化处理： 业务单元*/
                //     obj.unitProps=unitConf;
                // }
                // if(value === '3'){//供应商档案 3 
                //     obj.refcode = 'uapbd/refer/supplier/SupplierRefTreeGridRef/index.js';
                //     obj.refName = this.state.json['10140MASST-000008'];/* 国际化处理： 供应商档案*/
                //     obj.isShowUnit = true;
                //     unitConf.placeholder = this.state.json['10140MASST-000007'];/* 国际化处理： 业务单元*/
                //     obj.unitProps=unitConf;
                // }
                // if(value === '4'){//生产厂商 4
                //     obj.refcode = 'uapbd/refer/userdef/DefdocGridRef/index.js';
                //     obj.refName = this.state.json['10140MASST-000009'];/* 国际化处理： 生产厂商*/
                //     obj.queryCondition = function () {
                //         return {
                //             "pk_defdoclist":'1002ZZ1000000000066Q'
                //         }
                //     }
                // }
                // if(value === '5'){//客户 5
                //     obj.refcode = 'uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
                //     obj.refName = this.state.json['10140MASST-000010'];/* 国际化处理： 客户*/
                // }
                // if(value === '100'){//特征码 100
                //     obj.refcode = 'uapbd/refer/material/FFileSkuCodeGridRef/index.js';
                //     obj.refName = this.state.json['10140MASST-000011'];/* 国际化处理： 特征码*/
                // }
            }
        });

        props.meta.setMeta(meta);

    }

    //子表新增事件
    onAddSubClick(props, id){
        let count = props.cardTable.getNumberOfRows(tableId);
        props.cardTable.addRow(tableId, count, {}, false);
    }

   /**
    * 标体参照处理事件，更改参照显示编码，设置名称的显示值
    * @param {*} props 
    * @param {*} moduleId 
    * @param {*} key 
    * @param {*} value 
    * @param {*} changedrows 
    * @param {*} i 
    */
   afterSubEvent(props, moduleId, key,value, changedrows, index, record){
        if(key === 'value'){
            if(value.length === 0){
                props.cardTable.setValByKeyAndIndex(tableId,index,'value',{display:null,value:null});
                props.cardTable.setValByKeyAndIndex(tableId,index,'value_name',{display:null,value:null});
                props.cardTable.setValByKeyAndIndex(tableId,index,'code',{display:null,value:null});
                props.cardTable.setValByKeyAndIndex(tableId,index,'value_org',{display:null,value:null});
                return;
            }
            // var rowNum = props.cardTable.getNumberOfRows(tableId)-1;
            // props.cardTable.delRowsByIndex(moduleId, index);//删除报错，使用清空数据吧
            props.cardTable.setValByKeyAndIndex(tableId,index,'value',{display:null,value:null});
            props.cardTable.setValByKeyAndIndex(tableId,index,'value_name',{display:null,value:null});
            props.cardTable.setValByKeyAndIndex(tableId,index,'code',{display:null,value:null});
            props.cardTable.setValByKeyAndIndex(tableId,index,'value_org',{display:null,value:null});
            var rowNum = index;
            let codeCell = props.form.getFormItemsValue(formId,'code');
            let code =  codeCell.value ;
            let addrows = 0;
            value.forEach(element => {	
                let pkvalue =element.refpk;
                ajax({
                    url:ajaxUrl.itemQryUrl,
                    data:{code:code,pk:pkvalue},
                    success:(res)=>{
                        if(res){
                            let setObj = {}
                            setObj.value = element.refpk
                            setObj.display = element.refcode
                            props.cardTable.setValByKeyAndIndex(tableId,rowNum,'value',setObj)
            
                            let nameObj = {}
                            nameObj.value =element.refname;
                            nameObj.display = element.refname;
                            props.cardTable.setValByKeyAndIndex(tableId,rowNum,'value_name',nameObj)

                            let orgObj = {}
                            orgObj.value =res.data.orgname;
                            orgObj.display = res.data.orgname;
                            props.cardTable.setValByKeyAndIndex(tableId,rowNum,'value_org',orgObj)
                            
                            
                            addrows = addrows+1;
                            if(addrows<value.length){
                                props.cardTable.addRow(tableId);
                                rowNum = props.cardTable.getNumberOfRows(tableId)-1;
                            }
                            // props.cardTable.focusRowByIndex(moduleId, rowNum);
                        }
                    }
                });

            });
            // setTimeout(()=>{
            //     props.cardTable.delRowsByIndex(moduleId, index);
            // },400)

//             let setObj = {}
//             setObj.value = record.values.value.value
//             setObj.display = record.values.value.display
//             props.cardTable.setValByKeyAndIndex(tableId,index,'value',setObj)
//             record.values.value.display = value.refcode     

//             let nameObj = {}
//             nameObj.value =value.refname;
//             nameObj.display = value.refname;
//             props.cardTable.setValByKeyAndIndex(tableId,index,'value_name',nameObj)

//             let codeCell = props.form.getFormItemsValue(formId,'code');
//             let code =  codeCell.value ;
//             let pkvalue = record.values.value.value;

//             ajax({
//                 url:ajaxUrl.itemQryUrl,
//                 data:{code:code,pk:pkvalue},
//                 success:(res)=>{
//                     if(res){
//                         let orgObj = {}
//                         orgObj.value =res.data.orgname;
//                         orgObj.display = res.data.orgname;
//                         props.cardTable.setValByKeyAndIndex(tableId,index,'value_org',orgObj)
//                     }else{
//                         alert(res.message)
//                     }
//                 }
//             });
        }
   }

     //返回列表界面
    onReturnClick(){
        this.props.pushTo(toListURl,{ status:'browse',pagecode:'10140MASST_list'});
    }

    buttonClick =(props, id)=>{
        let _this = this;
        switch (id) {
            case 'AddLine':
                this.onAddSubClick(props, id);
            break;
        default:
            break
        }
    }

     /**
     * 卡片翻页,因为非标准的主子表数据，缓存中数据不全，无法直接使用，只能重新查询数据了
     * @param {} props 
     * @param {*} pk 
     */
    pageInfoClick=(props, pk)=>{
        this.loadCardData(pk,'browse');
    }

    render() {
        const {cardTable,button, form ,modal,cardPagination,BillHeadInfo} = this.props;
        const {createForm} = form;
        const {createButtonApp} = button;
        const {createModal} = modal;
        let { createCardTable } = cardTable;
        let status = uiStatus;
        const { createBillHeadInfo } = BillHeadInfo;
        let { createCardPagination } = cardPagination;
        return (
            <div className="nc-bill-card" fieldid={this.state.json['10140MASST-000012']+"_title"}>
                <NCAffix>
                    <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                        <div className='header-title-search-area'>
                             <span>
                                    {
                                        createBillHeadInfo(
                                            {
                                                title :this.state.json['10140MASST-000012'],             //标题/* 国际化处理： 辅助属性设置*/
                                                backBtnClick:this.onReturnClick.bind(this)             //返回按钮的点击事件
                                            }
                                    )}
                                </span>
                        </div>
                         <div className="header-button-area">
                            {createButtonApp({
                                area: 'card_head',//按钮注册中的按钮区域
                                buttonLimit: 5, 
                                onButtonClick: this.onClickHeaderBtn.bind(this) 
                                //popContainer: document.querySelector('.header-button-area')
                            })}
                             {createCardPagination({
                                handlePageInfoChange: this.pageInfoClick.bind(this),
                                // urlPkname:'pk_marassistant',
                                dataSource: cachKey
                            })}
                        </div>
                    </NCDiv>
                </NCAffix>  
                <div className="nc-bill-form-area">
                    {createForm(formId, {
                        onAfterEvent: this.onAferEdit.bind(this)
                    })}
                </div> 
                <div className="nc-bill-table-area">
                    {createCardTable(tableId, {
                        tableHead: () =>{
                            return (
                                <div className="shoulder-definition-area">
                                    <div className="definition-icons">
                                        {createButtonApp({
                                            area: 'card_body',//按钮注册中的按钮区域
                                            onButtonClick: this.buttonClick.bind(this) 
                                        })}
                                    </div>
                                </div>
                            )
                        },
                        // modelSave: this.modelSave.bind(this),
                        // showIndex:true
                        onAfterEvent: this.afterSubEvent.bind(this),
                        hideColSet: () => {//隐藏子表卡片界面，只有两个字段没有必要显示卡片界面信息
                            return false;
                        },
                        hideSwitch: () => {//隐藏子表卡片界面，只有两个字段没有必要显示卡片界面信息
                            return false;
                        }
                    })}
                </div>
                {createModal('modal', {
                   
                })}
            </div>
        )
    }
    initTemplate = (props)=> {
    
        createUIDom(props)(
            {
                pagecode : pageCode,
                appid : appId,
                appcode:appCode
            },
            {
                moduleId: "10140MASST",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    let meta = data.template;
                    console.log(meta);
                    meta = this.modifierMeta(props, meta)
                    props.meta.setMeta(meta);
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delete',this.state.json['10140MASST-000022']) /* 设置操作列上删除按钮的弹窗提示 */
                    }
                }
            }
        );
    
    }
    tableButtonClick=(props, id, text, record, index)=>{
        switch (id) {
            case 'DelLine':
                props.cardTable.delRowsByIndex(tableId, index);
            break;
            default:
            break;
        }
    }
    
    modifierMeta=(props, meta,status)=> {
        meta[tableId].showindex = true;
        meta[formId].status = status;
        meta[tableId].status = status;
        
        let that = this;
        let porCol = {
            attrcode: 'opr',
            label: this.state.json['10140MASST-000014'],/* 国际化处理： 操作*/
            itemtype:'customer',
            width: '200px',
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render(text, record, index) {
                return (
                    props.button.createOprationButton(
                        tableBtnAry,
                        {
                            area: "card_body_inner",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => that.tableButtonClick(props, id, text, record, index)
                        }
                    )
                )
            }
        };
        meta[tableId].items.push(porCol);
    
        return meta;
    }
}


CRECREditForm =  createPage({
    initTemplate:function(){},
    billinfo:{
        billtype: 'card', 
        pagecode: pageCode, 
        headcode: formId,
        bodycode: tableId
    }
})(CRECREditForm);
// ReactDOM.render(<CRECREditForm />,
//     document.querySelector("#app"));
export default CRECREditForm;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65