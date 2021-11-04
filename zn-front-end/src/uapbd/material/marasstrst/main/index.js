//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,toast ,promptBox,getMultiLang,createPageIcon } from 'nc-lightapp-front';
let { NCCol:Col, NCRow:Row } =base;

const {NCDatePicker, NCButton ,NCPanel,NCCheckbox,NCPopconfirm,NCRadio } = base;
import './index.less';
import { debug } from 'util';
import {conf as unitConf} from '../../../../uapbd/refer/org/BusinessUnitTreeRef/index'
const NCTree = base.NCTree;
import createUIDom from '../../../public/utils/BDCreateUIDom';

let leftTree = 'leftTree';//结构--左树id
const  formId = 'head';
const tableId = 'marasstrstval';
let selvotype = 'root';
/**
 * pagecode 配置
 */
 let pageCode = {
    mainPageCode: "10140MASSR_card",
 }
let config = {
    // nodeName: this.state.json['10140MASSR-000000'],/* 国际化处理： 辅助属性约束关系*/
    nodeType: 'GROPE_NODE',
    appId:'0001Z0100000000034UT'
}

const tableBtnAry = ["DelLine"];		//表列操作按钮

/**
 * ajaxurl 配置
 */
let ajaxUrl={
    treeLoadUrl:"/nccloud/uapbd/material/MarAsstrstTreeQueryAction.do",
    cardLoadUrl:"/nccloud/uapbd/material/MarAsstrstQueryByPkAction.do",
    saveUrl:"/nccloud/uapbd/material/MarAsstrstSaveAction.do",
    deleteUrl:"/nccloud/uapbd/material/MarAsstrstDeleteAction.do",
    refQryUrl:"/nccloud/uapbd/material/MarAsstrstRefQueryAction.do",
}

/**
 * 约束关系
 * 
 * wangdca
 */
class OrgSysPanel extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        let { form, button, table, search ,syncTree } = this.props;
        let { setSyncTreeData } = syncTree;
        this.setSyncTreeData = setSyncTreeData;   //设置树根节点数据方法
        this.state={
            disabledSearch:false,//左树搜索框是否可用
            json:{}	
        }
        this.initTemplate(props);
    }

    componentDidMount () {
        //加载左树 默认不加载停用数据
        this.loadLeftTreeData();
    }

    //加载左树数据
    loadLeftTreeData(isRefreshAction = false){
        ajax({
            url:ajaxUrl.treeLoadUrl,
            method:"post",
            data:{isrst:'true'},
            success:(res)=>{
                if(res.success){
                    //转换树的父子关系
                    let treeData = this.dealTreeData(res.data);
                    this.setSyncTreeData(leftTree, treeData);
                    if(res.data.length>0){
                        //设置默认中第一行
                        this.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                        this.onSelectEve( res.data[0].refpk,null,true);
                    }
                    if(isRefreshAction){
                        toast({ color: 'success', title: this.state.json['10140MASSR-000001'] });/* 国际化处理： 刷新成功！*/
                    }
                }else{
                    alert(res.message);
                }
            },
        });
    }
    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve (data, item, isChange) {
        if(item){
            selvotype = item.nodeData.votype;
        }else{
            selvotype = 'root' 
        }
        if(data === 'root'||selvotype === 'frame'){
            //清除上个界面的所有的值
            this.props.form.EmptyAllFormValue(formId);
            this.props.cardTable.setTableData(tableId,{rows: []});
            this.toggleShow('browse');
            return; 
        }
        this.loadCardData(data,null);
        this.toggleShow('browse');
    }

    /**
     * 设置属性的参照的查询条件
     */
    resetformRef(){
        debugger
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        if(!selectNode||selectNode.nodeData.votype==='root'){
            return;
        }
        let pk_marasstframe = selectNode.nodeData.pk_marasstframe;
        let meta = this.props.meta.getMeta();
        let that = this;
        meta[formId].items.map((obj)=>{
            if(obj.attrcode === 'pk_marassistant'||obj.attrcode === 'pk_marassistant_ctrl'){
                obj.queryCondition = function () {
                    that.props.renderItem('table',tableId, obj.attrcode, null);
                    return {
                        pk_marasstframe:pk_marasstframe
                    }
                }
            }
        });
        this.props.meta.setMeta(meta);
    }
    /**
     * 重设子表控制属性参照
     */
    resetBodyItemRef(itemcode, callback){
        let cell = this.props.form.getFormItemsValue(formId,itemcode);
        let that = this;
        if(cell&&cell.value){
            ajax({
                url:ajaxUrl.refQryUrl,
                method:"post",
                data:{pk_marassistant: cell.value},
                success:function(res){
                    let code = res.data.code;
                    that.resetBodyRef(itemcode,code,res.data.refpath, res.data.refname, res.data.defdoclist);
                    if(callback && typeof callback == 'function') {
                        callback()
                    }
                },
            });
        }
    }

    /**
     * 重设子表参照
     * @param {} key  字段
     * @param {*} value  参照编码
     */
    resetBodyRef(formkey,value,refpath, refname,defdoclist){
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        let pk_marassframe = '';
        if(selectNode.nodeData.votype==='frame'){
            pk_marassframe = selectNode.id;
        }else{
            pk_marassframe = selectNode.pid;
        }
        let key = ''
        if(formkey === 'pk_marassistant'){
            key = 'value';
            // 重要！下面那行一定要写
            this.props.renderItem('table', tableId, 'value', null); // 前三个参数，根据模板json填对应值，moduleId是区域id
        }
        if(formkey === 'pk_marassistant_ctrl'){
            key = 'value_ctrl';
             // 重要！下面那行一定要写
             this.props.renderItem('table', tableId, 'value_ctrl', null); // 前三个参数，根据模板json填对应值，moduleId是区域id
        }
        let meta = this.props.meta.getMeta();
        meta[tableId].items.map((obj)=>{
            if(obj.attrcode === key){
                if(refpath) {
                    let refParams = {
                        "pk_marassframe":pk_marassframe,
                        GridRefActionExt:'nccloud.web.uapbd.marasstrst.action.MarAsstrstRefSqlBuilder'
                    }
                    if(defdoclist) {
                        refParams.pk_defdoclist = defdoclist
                    }
                    obj.refcode = refpath;
                    obj.refName= refname,
                    obj.queryCondition = function () {
                        return {...refParams}
                    } 
                    return
                }
                // obj.refcode = null;
                // if(value === '1'){//库存状态 1
                //     obj.refcode = 'uapbd/refer/material/StoreStateGridRef/index.js';
                //     obj.refName=this.state.json['10140MASSR-000002'];/* 国际化处理： 库存状态*/
                //     obj.queryCondition = function () {
                //         return {
                //             "pk_marassframe":pk_marassframe,
                //             GridRefActionExt:'nccloud.web.uapbd.marasstrst.action.MarAsstrstRefSqlBuilder'
                //         }
                //     }
                // }
                // if(value === '2'){//项目 2
                //     obj.refcode = 'uapbd/refer/pm/ProjectDefaultTreeGridRef/index.js';
                //     obj.refName = this.state.json['10140MASSR-000003'];/* 国际化处理： 项目*/
                //     obj.isShowUnit = true;
                //     unitConf.placeholder = this.state.json['10140MASSR-000004'];/* 国际化处理： 业务单元*/
                //     obj.unitProps=unitConf;
                //     obj.queryCondition = function () {
                //         return {
                //             "pk_marassframe":pk_marassframe,
                //             GridRefActionExt:'nccloud.web.uapbd.marasstrst.action.MarAsstrstRefSqlBuilder'
                //         }
                //     }
                // }
                // if(value === '3'){//供应商档案 3 
                //     obj.refcode = 'uapbd/refer/supplier/SupplierRefTreeGridRef/index.js';
                //     obj.refName = this.state.json['10140MASSR-000005'];/* 国际化处理： 供应商档案*/
                //     obj.isShowUnit = true;
                //     unitConf.placeholder = this.state.json['10140MASSR-000004'];/* 国际化处理： 业务单元*/
                //     obj.unitProps=unitConf;
                //     obj.queryCondition = function () {
                //         return {
                //             "pk_marassframe":pk_marassframe,
                //             GridRefActionExt:'nccloud.web.uapbd.marasstrst.action.MarAsstrstRefSqlBuilder'
                //         }
                //     }
                // }
                // if(value === '4'){//生产厂商 4
                //     obj.refcode = 'uapbd/refer/userdef/DefdocGridRef/index.js';
                //     obj.refName = this.state.json['10140MASSR-000006'];/* 国际化处理： 生产厂商*/
                //     obj.queryCondition = function () {
                //         return {
                //             "pk_defdoclist":'1002ZZ1000000000066Q',
                //             "pk_marassframe":pk_marassframe,
                //             GridRefActionExt:'nccloud.web.uapbd.marasstrst.action.MarAsstrstRefSqlBuilder'
                //         }
                //     }
                // }
                // if(value === '5'){//客户 5
                //     obj.refcode = 'uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
                //     obj.refName = this.state.json['10140MASSR-000007'];/* 国际化处理： 客户*/
                //     obj.queryCondition = function () {
                //         return {
                //             "pk_marassframe":pk_marassframe,
                //             GridRefActionExt:'nccloud.web.uapbd.marasstrst.action.MarAsstrstRefSqlBuilder'
                //         }
                //     }
                // }
                // if(value === '100'){//特征码 100
                //     obj.refcode = 'uapbd/refer/material/FFileSkuCodeGridRef/index.js';
                //     obj.refName = this.state.json['10140MASSR-000008'];/* 国际化处理： 特征码*/
                //     obj.queryCondition = function () {
                //         return {
                //             "pk_marassframe":pk_marassframe,
                //             GridRefActionExt:'nccloud.web.uapbd.marasstrst.action.MarAsstrstRefSqlBuilder'
                //         }
                //     }
                // }
            }
        });
        this.props.meta.setMeta(meta);
    }

    loadCardData(pk_marasstrst,pk_marassframe){
        let that = this;
        ajax({
            url:ajaxUrl.cardLoadUrl,
            method:"post",
            data:{pk_marasstrst: pk_marasstrst,pk_marassframe:pk_marassframe},
            success:function(res){
                let cardData = {rows:res.data.form.head.rows};
                let value = {'head':cardData}
                that.props.form.setAllFormValue(value);

                that.resetformRef();
                that.resetBodyItemRef('pk_marassistant', () => {
                    that.resetBodyItemRef('pk_marassistant_ctrl', () => {
                        if( res.data.grid){//有子表数据
                            that.props.cardTable.setTableData(tableId, res.data.grid.marasstrstval);
                        }else{
                            that.props.table.setAllTableData(tableId, {rows:[]});
                        }
                    });
                });
            },
        });
    }

     //切换页面状态--设置按钮显示和业务状态
	toggleShow (status='browse') {
        //浏览态
        if('browse'===status){
            if(selvotype === 'root'){
                this.props.button.setButtonsVisible({
                    Add:false,
                    Edit:false,
                    Delete:false,
                    Refresh:true,
                    Save:false,
                    Cancel:false,
                    AddLine:false,
                    DelLine:false
                }); 
            }else if(selvotype === 'frame'){
                this.props.button.setButtonsVisible({
                    Add:true,
                    Edit:false,
                    Delete:false,
                    Refresh:true,
                    Save:false,
                    Cancel:false,
                    AddLine:false,
                    DelLine:false
                }); 
            }else{
                this.props.button.setButtonsVisible({
                    Add:true,
                    Edit:true,
                    Delete:true,
                    Refresh:true,
                    Save:false,
                    Cancel:false,
                    AddLine:false,
                    DelLine:false
                });
            }
            this.props.cardTable.setStatus(tableId, "browse");
            this.props.form.setFormStatus(formId, 'browse');
             //设置左树可操作
             this.props.syncTree.setNodeDisable(leftTree,false);
             this.setState({
                disabledSearch:false
            });
        }else{//编辑状态
            this.props.button.setButtonsVisible({
                Add:false,
                Edit:false,
                Delete:false,
                Refresh:false,
                Return:false,
                Save:true,
                Cancel:true,
                AddLine:true,
                DelLine:true
            });
            this.props.cardTable.setStatus(tableId, 'edit');
            this.props.form.setFormStatus(formId, 'edit');
             //设置左树可操作
             this.props.syncTree.setNodeDisable(leftTree,true);
             this.setState({
                disabledSearch:true
            });
        }

        if(status === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
	};
    onMouseEnterEve( key ) {
        let obj = {
            delIcon:false,
            editIcon:false,
            addIcon:false
        };
        this.props.syncTree.hideIcon( leftTree, key, obj )
        // if(key === "root"){
        // }else{
        //     let obj = {
        //         delIcon:false,
        //         editIcon:false,
        //         addIcon:false
        //     };
        //     this.props.syncTree.hideIcon( leftTree, key, obj )
        // }
    }
    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.iconBox = {
                editIcon: true,
                addIcon: true,
                delIcon: true
            }
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
            e.iconBox = {
                editIcon: true,
                addIcon: true,
                delIcon: true
            }
            deleteDataChildrenProp(e);
        });
        return data;
    }

    onClickButton(props, id){
        let selectNode= props.syncTree.getSelectNode(leftTree);
        let pk_marasstframe =selectNode.id;
        let pid = selectNode.pid;
        let that = this;
        switch (id) {
            case 'Add':
                if(pk_marasstframe === 'root'){
                    toast({content:this.state.json['10140MASSR-000009'],color:"warning"});/* 国际化处理： 请选择结构*/
                    return;
                }
                this.onAddNew();
            break;
            case 'Edit':
                this.toggleShow('edit');
            break;
            case 'Delete':
                let pkCell = props.form.getFormItemsValue(formId,'pk_marasstrst');
                let pk_marasstrst=pkCell.value;
                let tsCell = props.form.getFormItemsValue(formId,'ts');
                let ts=tsCell.value;
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10140MASSR-000015'],
                    content:this.state.json['10140MASSR-000010'],/* 国际化处理： 您确定要删除所选数据吗？*/
                    beSureBtnClick:()=>{
                        ajax({
                            url:ajaxUrl.deleteUrl,
                            data:{pk_marasstrst:pk_marasstrst,ts:ts},
                            success:function(res){
                                //清除上个界面的所有的值
                                props.form.EmptyAllFormValue(formId);
                                props.cardTable.setTableData(tableId,{rows: []});
                                //删除左树上的节点
                                props.syncTree.delNodeSuceess(leftTree, pk_marasstframe);
                                //重新设置选中的树节点
                                props.syncTree.setNodeSelected(leftTree,pid);
                                toast({ color: 'success', title: that.state.json['10140MASSR-000011'] });/* 国际化处理： 删除成功！*/
                                selvotype = 'frame';
                                that.toggleShow('browse');
                            }
                        });
                    }
                })
                // props.modal.show('modal', {
                //     title: '确认删除',
                //     content: '您确定要删除所选数据吗？',
                //     beSureBtnClick: () => {
                //         ajax({
                //             url:ajaxUrl.deleteUrl,
                //             data:{pk_marasstrst:pk_marasstrst,ts:ts},
                //             success:function(res){
                //                 //清除上个界面的所有的值
                //                 props.form.EmptyAllFormValue(formId);
                //                 props.cardTable.setTableData(tableId,{rows: []});
                //                 //删除左树上的节点
                //                 props.syncTree.delNodeSuceess(leftTree, pk_marasstrst);
                //                 //重新设置选中的树节点
                //                 props.syncTree.setNodeSelected(leftTree,pid);
                //                 toast({ color: 'success', title: '删除成功！' });
                //                 that.toggleShow('browse');
                //             }
                //         });
                //     }
                // });
            break;
            case 'Refresh':
                this.loadLeftTreeData(true);
            break;
            case 'Save':
                debugger
                let flag = props.form.isCheckNow(formId);
                if(!flag){
                    break;
                }
//                 if(!props.editTable.checkRequired(tableId,this.props.editTable.getAllRows(tableId,true))) {//edittable的必输项校验   
//                     break;
//                 }
                // this.props.cardTable.filterEmptyRows(tableId);
                this.props.cardTable.filterEmptyRows(tableId,['value','value_ctrl'],'include');
                if(!props.cardTable.checkTableRequired(tableId)) {//edittable的必输项校验   
                    break;
                }
                let CardData = props.createMasterChildData(pageCode.mainPageCode, formId, tableId);
                //公式校验
                this.props.validateToSave( CardData ,()=>{
                    
                    let saveData = CardData;
                    ajax({
                        url:ajaxUrl.saveUrl,
                        data:saveData,
                        success:function(res){
                            let { success, data } = res;
                            if(success){
                                let cardData = {rows:res.data.form.head.rows};
                                let value = {'head':cardData}
                                props.form.setAllFormValue(value);
                                if( res.data.grid){//有子表数据
                                    props.cardTable.setTableData(tableId, data.grid.marasstrstval);
                                }
                                // that.loadLeftTreeData();
                                // //重新设置选中的树节点
                                // props.syncTree.setNodeSelected(leftTree,pid);
                                that.toggleShow('browse');
                            }else{
                                alert(res.message);
                            }
                        }
                    });
                    
                }, {
                    formId: 'form',
                    [tableId]: 'cardTable'
                },'card');
            break;	
            case 'Cancel':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10140MASSR-000012'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10140MASSR-000013'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick:()=>{
                        props.form.cancel(formId);
                        props.cardTable.resetTableData(tableId);
                        this.toggleShow('browse');
                        if(selectNode.nodeData.votype==='rst'){
                            this.loadCardData(selectNode.id,null);
                        }
                    }
                })
            break;
            case 'AddLine':
                let count = props.cardTable.getNumberOfRows(tableId);
                // props.cardTable.setStatus(tableId,'edit');
                props.cardTable.addRow(tableId);
                // props.cardTable.addRow(tableId, count, {}, false);
            break;
            default:
                break;
        }
    }

    onAddNew(){
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        if(selectNode.id === 'root'){
            return;
        }
        let pk_marassframe = '';
        if(selectNode.nodeData.votype==='frame'){
            pk_marassframe = selectNode.id;
        }else{
            pk_marassframe = selectNode.pid;
        }
        this.loadCardData(null,pk_marassframe);
        this.toggleShow('edit');
    }

    //表单编辑后事件
    onAferEdit(props, moduleId, key, value, oldValue,record){
        if(key === 'pk_marassistant'&&value.value!=oldValue.value){
            this.resetBodyItemRef('pk_marassistant');
            //变更后清空子表
            props.table.setAllTableData(tableId, {rows:[]});
        }
        if(key === 'pk_marassistant_ctrl'&&value.value!=oldValue.value){
            this.resetBodyItemRef('pk_marassistant_ctrl');
             //变更后清空子表
             props.table.setAllTableData(tableId, {rows:[]});
        }
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
        if(key === 'value'&&changedrows[0].newvalue.value != changedrows[0].oldvalue.value){
            let setObj = {}
            setObj.value = record.values.value.value
            setObj.display = record.values.value.display
            props.cardTable.setValByKeyAndIndex(tableId,index,'value',setObj)
            record.values.value.display = value.refcode     

            let nameObj = {}
            nameObj.value =value.refname;
            nameObj.display = value.refname;
            props.cardTable.setValByKeyAndIndex(tableId,index,'value_name',nameObj)
        }

        if(key === 'value_ctrl'&&changedrows[0].newvalue.value != changedrows[0].oldvalue.value){
            debugger
            let setObj = {}
            setObj.value = record.values.value_ctrl.value
            setObj.display = record.values.value_ctrl.display
            props.cardTable.setValByKeyAndIndex(tableId,index,'value_ctrl',setObj)
            record.values.value_ctrl.display = value.refcode     

            let nameObj = {}
            nameObj.value =value.refname;
            nameObj.display = value.refname;
            props.cardTable.setValByKeyAndIndex(tableId,index,'value_ctrl_name',nameObj)
        }
   }

    render() {
        const {button, syncTree, modal,DragWidthCom,treeTable,treeTableManyCol,form,cardTable} = this.props;
        const {createForm} = form;
        const {createButton} = button;
        const { createButtonApp } = button;
        const { createTreeTable } = treeTable;
        let { treeTableCol } = treeTableManyCol;
        let {createSyncTree} = syncTree;
        let { createModal } = modal;
        let { createCardTable } = cardTable;
        return (
            <div className="nc-bill-tree-card">
                {createModal('modal', {
                    
                })}
                {/* 标题 title */}
                <div className="header">
                    {/*页面大图标*/}
                    {createPageIcon()}
                    <h2 className="title">{this.state.json['10140MASSR-000000']}</h2>
                    {/* 按钮区  btn-group */}
                    <div className="btn-group">
                        {createButtonApp({
                            area: 'card_head',
                            buttonLimit: 5,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.card_head')
                        })}
                    </div>
                </div>
                {/* 标题 主界面区域  左树--右表*/}
                <div className="tree-table">
                    <DragWidthCom
                         //树
                        defLeftWid = '280px'
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                     treeId:leftTree,
                                     showLine:true, 
                                     searchType:"filtration",
                                    //  clickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调
                                    //  clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调
                                    //  clickAddIconEve: this.onAddFrame.bind(this), //新增点击 回调
                                     onSelectEve: this.onSelectEve.bind(this),   //选择节点回调方法
                                     defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                     onMouseEnterEve:this.onMouseEnterEve.bind(this),//鼠标滑过节点事件
                                     showModal:false,
                                     disabledSearch:this.state.disabledSearch
                                })}
                            </div>
                        } 
                        rightDom = {
                            <div className="nc-bill-card">
                                <div className="nc-bill-form-area">
                                    {createForm(formId, {
                                        onAfterEvent: this.onAferEdit.bind(this)
                                    })}
                                </div> 
                                <div className="nc-bill-table-area">
                                    {/* <div className='nc-bill-header-area'>
                                        <div className="header-button-area">
                                            {createButtonApp({
                                                area: 'card_body',//按钮注册中的按钮区域
                                                //buttonLimit: 5, 
                                                onButtonClick: this.onClickButton.bind(this) 
                                                //popContainer: document.querySelector('.header-button-area')
                                            })}
                                        </div>
                                    </div> */}
                                    {createCardTable(tableId, {
                                        tableHead:()=>{
                                            return (
                                                <div className="shoulder-definition-area">
                                                    <div className="definition-icons">
                                                        {createButtonApp({
                                                            area: 'card_body',//按钮注册中的按钮区域
                                                            onButtonClick: this.onClickButton.bind(this) 
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        },
                                        onAfterEvent: this.afterSubEvent.bind(this),
                                        hideColSet: () => {//隐藏子表卡片界面，只有两个字段没有必要显示卡片界面信息
                                            return false;
                                        },
                                        hideSwitch: () => {//隐藏子表卡片界面，只有两个字段没有必要显示卡片界面信息
                                            return false;
                                        }
                                    })}
                                </div>
                            </div>
                        }  
                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百 
                    />
                </div>
            </div>
        )
    }
    
    //初始化单据模板
    initTemplate = (props)=> {
        createUIDom(props)(
            {
                pagecode : pageCode.mainPageCode
                // appid : config.appId
            },
            {
                moduleId: "10140MASSR",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData;
                }
                if(data){
                    let meta = data.template;
                    meta = this.modifierMeta(props, meta)
                    props.meta.setMeta(meta);
                    if(data.button){
                        props.button.setButtons(data.button);
                        //   props.button.setPopContent('De','确认要删除该条吗？') /* 设置操作列上删除按钮的弹窗提示 */
                    }
                }
            }
        );
    }
    tableButtonClick=(props, id, text, record, index)=>{
        switch(id){
            case 'DelLine':
                props.cardTable.delRowsByIndex(tableId, index);
            break;
            default:
            break;
    
        }
    }
    modifierMeta=(props, meta)=> {
        //添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10140MASSR-000014'],/* 国际化处理： 操作*/
            itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
            className: 'table-opr' ,
            width: 200,
            fixed:'right',
            visible: true,
            render: (text, record, index) => {
                return (
                    props.button.createOprationButton(
                        tableBtnAry,
                        {
                            area: "card_body_inner",
                            buttonLimit: 3,
                            onButtonClick: (props, id) => this.tableButtonClick.call(this,props, id, text, record, index)
                        }
                    )
                )
            }
        });
        return meta;
    }
}


let OrgSysPage =  createPage({
    initTemplate:function(){},
    billinfo:{
        billtype: 'card', 
        pagecode: pageCode.mainPageCode, 
        headcode: formId,
        bodycode: tableId
    }
})(OrgSysPanel);

ReactDOM.render(<OrgSysPage {...config}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65