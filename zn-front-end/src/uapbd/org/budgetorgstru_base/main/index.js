//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,print ,high,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
let { NCCol:Col, NCRow:Row ,NCFormControl} = base;
const {PrintOutput}=high;
const {NCDatePicker, NCButton ,NCPanel,NCCheckbox,NCPopconfirm ,NCRadio} = base;
import './index.less';
import Utils from '../../../public/utils';
const { NCDiv } = base;

/**
 * 穿梭框--导入使用
 */
import Transfer from '../../../public/excomponents/Transfer';
//集团参照
import GroupDefaultTreeRef from '../../../../uap/refer/riart/groupTreeRef/index'
//组织类型参照
import OrgTypeGridRef from '../../../refer/org/OrgTypeGridRef/index'
//组织类型参照
import LiabilityCenterOrgAllTreeRef from '../../../refer/org/LiabilityCenterOrgAllTreeRef/index'

import createUIDom from '../../../public/utils/BDCreateUIDom';

import BudgetOrgStruVersionGridRef from '../../../refer/orgv/BudgetOrgStruVersionGridRef/index'

let leftTree = 'systemTree';//体系--左树id
let rightTreeTable = 'memberTreeTable'//成员--右树表id
let formId = 'sysForm';//体系--编辑formid
let sysModalId = 'sysModal';//体系编辑模态窗id
let sysModalDelId = 'sysDelete';//体系删除模态窗id
let deleteTreeNode = '';//左树删除选择
let memberFormId = 'memberForm';//成员--编辑id
let reportOrgFormId = 'orgForm';//成员组织信息模板id
let memberEditModalId = 'memberModal';//成员--编辑模态窗id
let sysSaveType = 'add';//add--新增  edit--修改  copy--复制
let sysVersionStatus = 'browse';//体系版本界面的状态
let memberSaveType = 'edit';
let sysVersionModalId = 'systemversion';//体系版本化模态框
let importModalId = 'importModalId';//引入对话框id
let memberSortModalId = 'memberSortModal';//结构调整模态框id
let memberSortTreeId = 'memberSortTree';//结构调整--树id

let pk_importGroup = '';//引入对话框的集团参照的主键
let groupname = '';
let pk_orgtypes = 'BUSINESSUNIT00000000';//引入的组织类型
let showDisableOrg = false;//引入对话框是否显示停用的组织
let orgTypeName = '';
//this.state.json['10100BOSB-000000'];//引入组织类型名称/* 国际化处理： 业务单元*/

let isShowDisable = false;
let l2rBefor = true;//引用对话框选中校验

let isSort = false;//结构不是被调整过，用来判断是不是需要刷新数据

// let statstruUrl = '/uapbd/org/budgetorgstru_glb/budgetstatstru/index.html';//统计成员管理URl

let sysVRefPk='';//体系版本参照选择的主键
let sysRefName='';//体系版本参照名称（初始化时使用）
let isRefChange=false;//用来判断刷新列表是不是因为选择体系版本导致的
let structurePk=''//引用利用中心结构&&成本中心结构使用
/**
 * AjaxUrl配置
 */
let ajaxUrl={
    initUrl:'/nccloud/platform/templet/querypage.do',
    sysLoadUrl:"/nccloud/uapbd/org/BudgetOrgStruQueryAction.do",
    sysDeleteUrl:"/nccloud/uapbd/org/BudgetOrgStruDeleteByPk.do",
    sysEnableUrl:"/nccloud/uapbd/org/BudgetOrgStruEnableAction.do",
    sysDisableUrl:"/nccloud/uapbd/org/BudgetOrgStruDisableAction.do",
    sysQueryByPkUrl:"/nccloud/uapbd/org/BudgetOrgStruQueryByPkAction.do",
    sysSaveUrl:"/nccloud/uapbd/org/BudgetOrgStruSaveAction.do",
    sysCopySaveUrl:'/nccloud/uapbd/org/BudgetOrgStruCopySaveAction.do',
    sysVersionQueryUrl:"/nccloud/uapbd/org/BudgetOSVersionQueryAction.do",
    sysVersionSaveUrl:"/nccloud/uapbd/org/BudgetOSVersinCreatSaveAction.do",
    sysVersionAddUrl:"/nccloud/uapbd/org/BudgetOSVersinAddAction.do",
    sysVersionDeleteUrl:"/nccloud/uapbd/org/BudgetOSVersinDeleteAction.do",
    sysVersionRefInitUrl:"/nccloud/uapbd/org/BudgetOSVersionRefInitAction.do",
    memberLoadUrl:"/nccloud/uapbd/org/BudgetOSMemberQueryAction.do",
    memberSaveUrl:"/nccloud/uapbd/org/BudgetOSMemberSaveAction.do",
    memberQueryByPkUrl:"/nccloud/uapbd/org/BudgetOSMemberQueryByPk.do",
    memberDeleteUrl:"/nccloud/uapbd/org/BudgetOSMemberDeleteAction.do",
    importDataQryUrl:"/nccloud/uapbd/org/BudgetOSMemberImportQueryAction.do",
    importSaveUrl:"/nccloud/uapbd/org/BudgetOSMemberImportSaveAction.do",
    memberSortQryUrl:"/nccloud/uapbd/org/BudgetOSMemberSortQueryAction.do",
    memberSetOrderUrl:"/nccloud/uapbd/org/BudgetOSMemberSetOrderAction.do",
    memberAddNewUrl:"/nccloud/uapbd/org/BudgetOSMemberAddAction.do",
    printUrl:"/nccloud/uapbd/org/BudgetOrsStruPrintAction.do"
}

/**
 * pageCode定义
 */
let pageCode={
    mainPageCode: "10100BudgetOrgStru_all",
    sysFormPageCode:'10100BOS_form',
    memberFomPageCode : '10100BOSmember_form',
}

const tableBtnAry = ["Editline","Delline"];		//树表列操作按钮

/**
 * 预算组织体系
 * wangdca
 */
class OrgSysPage extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        let { form, button, table, search ,syncTree } = this.props;
        let { setSyncTreeData } = syncTree;
        this.setSyncTreeData = setSyncTreeData;   //设置树根节点数据方法
        this.state={
            oprType:'0',
            importLeftTreeData:[],
            importRightTreeData:[],
            refs: {},
            nextvno:'',
            // newVersionName:'',
            vstartdate:'',
            versionName:'',
            pks:[]	,
            json:{},
            expandKeys:[],
            vRefEnable:true,
            searchValue:''
        }
        this.initTemplate(props);
    }

    componentDidMount () {
        //加载左树 默认不加载停用数据
        // this.loadLeftTreeData(isShowDisable);
        this.initAllDatas(false,false);
    }

     /**
     * 浏览器或页签关闭时的提示信息--编辑态提示、浏览态不提示
     * @param {*} uiStatus 
     */
    windowCloseListener(uiStatus){
        if(uiStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }
    /**
     * 2019-01-16 add 效率优化  打开节点要一次性加载所有的数据
     * @param {*} showDisable 
     * @param {*} isRefreshAction 
     */
    initAllDatas(showDisable=false,isRefreshAction = false){
        ajax({
            url:ajaxUrl.sysLoadUrl,
            method:"post",
            data:{showDisable:showDisable,nodeType:this.props.nodeType,data:'all'},
            success:(res)=>{
                if(res.data){
                    if(res.data.tree){
                        //转换树的父子关系
                        let treeData = this.dealTreeData(res.data.tree);
                        this.setSyncTreeData(leftTree, treeData);
                        //设置默认中第一行
                        this.props.syncTree.setNodeSelected(leftTree, res.data.tree[0].refpk);
                    }else{
                        this.setSyncTreeData(leftTree, []);
                    }
                    //后台返回的是表格的数据  需要构造成树状表的数据
                    if(res.data.grid){
                        let datas =  this.props.treeTableManyCol.createNewData(res.data.grid.memberTreeTable.rows);
                        //根据树状表的数据构造树表
                        this.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
                    }else{
                        this.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    }
                    if(res.data.pk_rcsvid){
                        sysVRefPk=res.data.pk_rcsvid;//体系版本参照选择的主键
                        sysRefName=res.data.rcsvname;//体系版本参照名称（初始化时使用）
                    }
                }else{
                    this.setSyncTreeData(leftTree, []);
                    this.props.treeTableManyCol.emptyAllData(rightTreeTable);
                }
                if(isRefreshAction){
                    toast({ color: 'success', title: this.state.json['10100BOSB-000001'] });/* 国际化处理： 刷新成功！*/
                }
                this.toggleShow();
            }
        });
    }
    //加载左树数据
    loadLeftTreeData(showDisable,isRefreshAction=false){
        ajax({
            url:ajaxUrl.sysLoadUrl,
            method:"post",
            data:{showDisable:showDisable,nodeType:this.props.nodeType},
            success:(res)=>{
                if(res.success){
                    if(res.data){
                        //转换树的父子关系
                        let treeData = this.dealTreeData(res.data);
                        this.setSyncTreeData(leftTree, treeData);
                        //设置默认中第一行
                        this.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                        if(res.data[0].refpk!=='root'){
                            this.onSelectEve( res.data[0].refpk,null,true);
                        }
                    }else{
                        this.setSyncTreeData(leftTree, []);
                        this.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    }
                    if(isRefreshAction){
                        toast({ color: 'success', title: this.state.json['10100BOSB-000001'] });/* 国际化处理： 刷新成功！*/
                    }
                }else{
                    toast({content : res.message,color : 'warning'});
                }
                this.toggleShow();
                this.setState({ searchValue:'' });
            }
        });
    }
     
     /**
     * 删除提示
     */
    onDeleteSysEve(selectedTreeNode){
        deleteTreeNode = selectedTreeNode;
        // this.props.modal.show(sysModalDelId);
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title:  this.state.json['10100BOSB-000037'],
            content:this.state.json['10100BOSB-000031'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
            beSureBtnClick:()=>{this.onDeleteSys()}
        })
    }
    //删除操作
    onDeleteSys(){
        let pk = deleteTreeNode.id;
        let that = this;
        ajax({
            url:ajaxUrl.sysDeleteUrl,
            method:"post",
            data:{pk_system: pk,nodeType:that.props.nodeType,ts:deleteTreeNode.nodeData.ts},
            success:function(res){
                that.props.syncTree.delNodeSuceess(leftTree,pk);
                // that.props.modal.close(sysModalDelId);
                toast({ color: 'success', title: that.state.json['10100BOSB-000017'] });/* 国际化处理： 删除成功！*/
                that.loadLeftTreeData(isShowDisable,false);
            }
        });
    }
    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve (data, item, isChange) {
        // if(isChange){
            //加载成员树表
            // let that = this;
            // ajax({
            //     url:ajaxUrl.memberLoadUrl,
            //     method:"post",
            //     data:{pk_system: data,nodeType:this.props.nodeType},
            //     success:function(res){
            //         if(res.success){
            //             if(res.data){
            //                 //后台返回的是表格的数据  需要构造成树状表的数据
            //                 let datas =  that.props.treeTableManyCol.createNewData(res.data.memberTreeTable.rows);
            //                 //根据树状表的数据构造树表
            //                 console.log(datas);
            //                 that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
            //                 that.props.button.setButtonDisabled(['Print','Output'], false);
            //             }else{
            //                 // let datas =  that.props.treeTableManyCol.createNewData({rows: []});
            //                 // that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk')
            //                 that.props.treeTableManyCol.emptyAllData(rightTreeTable);
            //                 that.props.button.setButtonDisabled(['Print','Output'], true);
            //             }
            //         }else{
            //             toast({content : res.message,color : 'warning'});
            //         }
            //     }
            // });
        // }
        if(isChange){
            sysVRefPk = '';
            sysRefName = '';
        }
        this.onInitSysRefLoadMemberData(data);
        pk_importGroup = this.props.syncTree.getSelectNode(leftTree).nodeData.pk_group;
        groupname = this.props.syncTree.getSelectNode(leftTree).nodeData.groupname;
        this.toggleShow();
    }
    
    /**
     * pk_system  有值说明是切换体系导致的查询，此时要先加载版本信息，后加载成员数据
     * pk_svid 说明是切换体系的版本的参照导致的重新加载成员数据
     * @param {*} pk_system 
     * @param {*} pk_svid 
     */
    onInitSysRefLoadMemberData(pk_system,pk_svid){
        let that = this;
        ajax({
            url:ajaxUrl.memberLoadUrl,
            method:"post",
            data:{pk_system: pk_system,nodeType:this.props.nodeType,pk_svid:pk_svid},
            success:function(res){
                if(res.data){
                    if(pk_svid&&pk_svid!=''){//切换体系版本导致的刷新成员数据
    
                    }else{//若是切换体系，需要初始化版本参照为最新的
                        sysVRefPk=res.data.pk_svid;//体系版本参照选择的主键
                        sysRefName=res.data.sname;//体系版本参照名称（初始化时使用）
                    }
                    if(res.data.grid){
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        let datas =  that.props.treeTableManyCol.createNewData(res.data.grid.memberTreeTable.rows);
                        //根据树状表的数据构造树表
                        that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
                        // that.props.button.setButtonDisabled(['Print','Output'], false);

                        // 加载展开的节点
                        that.expandTreeNode();

                    }else{//没有成员数据
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                        // that.props.button.setButtonDisabled(['Print','Output'], true);
                    }
                }else{
                    // let datas =  that.props.treeTableManyCol.createNewData({rows: []});
                    // that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk')
                    that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    // that.props.button.setButtonDisabled(['Print','Output'], true);
                }
                that.setState({ searchValue:'' });
            }
        });
    }

    expandEve(item){
        !this.state.expandKeys.includes(item.key) && this.state.expandKeys.push(item.key);
        this.setState(this.state);
    }

    collapandEve(item){
        this.state.expandKeys = this.state.expandKeys.filter(t=>t!=item.key);
        this.setState(this.state);
    }

    // 展开树状表
    expandTreeNode = ()=>{
        if(this.state.expandKeys && this.state.expandKeys.length>0){
            this.state.expandKeys.forEach(key=>{
                setTimeout(this.props.treeTableManyCol.openRow(rightTreeTable, key));
            });
        }
    }

     //切换页面状态--设置按钮显示和业务状态
	toggleShow (){
        this.props.button.setMainButton('Add',true);
        //设置左树可操作
        this.props.syncTree.setNodeDisable(leftTree,false);
        let allData = this.props.syncTree.getSyncTreeValue(leftTree);
        if(!allData||allData.length === 0){
            this.setState({vRefEnable:false});
            this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','AddVirtual','SortManage','AddStatMemb','Print'],true);
            return;
        }else{
            this.setState({vRefEnable:true});
            this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','AddVirtual','SortManage','AddStatMemb','Print'],false);
        }
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        if(selectNode){//更新停用启用按钮
            if('root' === selectNode.id){
                this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','AddVirtual','SortManage'],true);
            }else{
                this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','AddVirtual','SortManage','AddStatMemb'],false);
            }
            let enablestate = selectNode.nodeData.enablestate;
            if(enablestate ==='2'){//启用状态
                this.props.button.setButtonDisabled(['Enable'],true);
                this.props.button.setButtonDisabled(['Disable'],false);
            }else{
                this.props.button.setButtonDisabled(['Enable'],false);
                this.props.button.setButtonDisabled(['Disable'],true);
            }
        }
    }
    onMouseEnterEve( key ) {
        if(key === this.state.json['10100BOSB-000032']){/* 国际化处理： 资金管理体系--全局*/
            let obj = {
                delIcon:false,
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon( leftTree, key, obj )
        }else{
            let obj = {
                addIcon:true,
                editIcon:true,
                delIcon:true
            };
            this.props.syncTree.hideIcon( leftTree, key, obj )
        }
    }
    //显示停用
    onCheckShowDisable(checked){
        isShowDisable = !isShowDisable;
        this.loadLeftTreeData(isShowDisable)
    }
    //新增 -- 体系
    onAdd(){
        sysSaveType = 'add';
        this.openSysModal('');
    }
    //复制
    onCopy(){
        sysSaveType = 'copy';
        this.openSysModal(this.props.syncTree.getSelectNode(leftTree).id);
    }
    //启用
    onEnable(){
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        let that = this;
        ajax({
            url:ajaxUrl.sysEnableUrl,
            method:"post",
            data:{pk_system:selectNode.id,nodeType:that.props.nodeType},
            success:function(res){
                if(res.success){
                    //更新树节点
                    let treeData = that.dealTreeData(res.data);
                    that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    // that.toggleShow();
                    that.props.button.setButtonDisabled(['Enable'],true);
                    that.props.button.setButtonDisabled(['Disable'],false);
                    toast({ color: 'success', title: that.state.json['10100BOSB-000055'] });/* 国际化处理： 启用成功！*/
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }
    //停用
    onDisable(){
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        let that = this;
        ajax({
            url:ajaxUrl.sysDisableUrl,
            method:"post",
            data:{pk_system:selectNode.id,nodeType:that.props.nodeType},
            success:function(res){
                if(res.success){
                    //更新树节点
                    let treeData = that.dealTreeData(res.data);
                    that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    // that.toggleShow();
                    that.props.button.setButtonDisabled(['Enable'],false);
                    that.props.button.setButtonDisabled(['Disable'],true);
                    toast({ color: 'success', title: that.state.json['10100BOSB-000056'] });/* 国际化处理： 停用成功！*/
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }
    /**
     * 编辑
     */
    onEditSys(selectedTreeNode){
        sysSaveType = 'edit';
        this.openSysModal(selectedTreeNode.id);
    }
    //体系编辑窗口
    openSysModal(pk){
        
        let that = this;
        ajax({
            url:ajaxUrl.sysQueryByPkUrl,
            method:"post",
            data:{pk_system:pk,nodeType:that.props.nodeType,queryType:sysSaveType},
            success:function(res){
                if(res.success){
                    that.props.form.EmptyAllFormValue(formId);
                    if(sysSaveType == 'add'){
                        that.props.form.setFormStatus(formId,'add');
                    }else{
                        that.props.form.setFormStatus(formId,'edit');
                    }
                    let cardData = {rows:res.data.sysForm.rows};
                    let cardvalue = {'sysForm':cardData}
                    Utils.filterEmptyData(cardvalue.sysForm.rows[0].values);
                    that.props.form.setAllFormValue(cardvalue);
                    //弹出体系编辑窗口
                    that.props.modal.show(sysModalId);
                    that.windowCloseListener('add');
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }
    //体系保存  
    onSaveSys(){
        let flag = this.props.form.isCheckNow(formId);
        if(!flag){
            return;
        }
        let formdata = this.props.form.getAllFormValue(formId);
        //下面的代码用来验证公式
        formdata.areacode = 'sysForm';
        this.props.validateToSave( {"model" :formdata,"pageid" :this.props.nodePageCode} ,()=>{
            this.systemSaveFun(formdata)
            }, { 'sysForm': 'form' },'form');
    }

     /**
     * 体系数据保存
     * @param {*} formdata 
     */
    systemSaveFun(formdata){
        let requestParam = {
            model: formdata,
            // pageid: pageCode.sysFormPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            pageid:this.props.nodePageCode
        };
        let that = this;
        let saveurl= ajaxUrl.sysSaveUrl;
        if(sysSaveType==='copy'){
            saveurl= ajaxUrl.sysCopySaveUrl; 
        }
        ajax({
            url:saveurl,
            method:"post",
            data:{form:requestParam,nodeType:this.props.nodeType,pk_svid:sysVRefPk},
            success:function(res){
                if(res.success){
                    let treeData = that.dealTreeData(res.data);
                    if(sysSaveType==='add'||sysSaveType==='copy'){//新增树节点
                        that.props.syncTree.addNodeSuccess(leftTree,treeData);
                    }else{//修改树节点
                        that.props.syncTree.editNodeSuccess(leftTree, treeData);

                    }
                    that.loadLeftTreeData(false,false);
                    toast({ color: 'success', title: that.state.json['10100BOSB-000002'] });/* 国际化处理： 保存成功！*/
                    that.props.modal.close(sysModalId);
                    that.windowCloseListener('browse');
                    that = null;
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
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
    /**
     * 预算组织体系版本弹框里的按钮控制方法
     * @param {*} status 
     */
    setVerButtonSat(status){
        sysVersionStatus = status;
        this.props.editTable.setStatus(sysVersionModalId,status);
        if(status === 'edit'){
            this.props.button.setButtonVisible(['AddVersion','EditVersion','RefreshVersion','DelVersion'],false);
            this.props.button.setButtonVisible(['SaveVersion','CancelVersion'],true);
        }else{
            this.props.button.setButtonVisible(['AddVersion','EditVersion','RefreshVersion','DelVersion'],true);
            this.props.button.setButtonVisible(['SaveVersion','CancelVersion'],false);
        }
        this.windowCloseListener(status);
    }
    //版本化
    onCreatVersion(act){
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.sysVersionQueryUrl,
            method:"post",
            data:{pk_system:pk},
            success:function(res){
                if(res.success){
                    // document.getElementById('nextvno').value=res.data.nextvno;
                    // document.getElementById('vstartdate').value = res.data.vstartdate;
                    //弹出版本化窗口
                    that.props.modal.show(sysVersionModalId);
                    that.setState({
                        nextvno :res.data.nextvno,
                        vstartdate:res.data.vstartdate,
                        versionName:''
                    });
                    let datas = res.data.grid[sysVersionModalId];
                    that.props.editTable.setTableData(sysVersionModalId,datas);
                    that.props.editTable.setStatus(sysVersionModalId,'browse');
                    that.setVerButtonSat('browse');
                    that.props.button.setButtonDisabled('DelVersion',true);
                    if(act === 'Refresh'){
                        toast({ color: 'success', title: that.state.json['10100BOSB-000001'] });/* 国际化处理： 刷新成功！*/
                    }
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }
    onAddVersion(){
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.sysVersionAddUrl,
            method:"post",
            data:{pk_system:pk,nodeType:this.props.nodeType},
            success:function(res){
                if(res.success){
                    that.props.editTable.setTableData(sysVersionModalId,res.data[sysVersionModalId]);
                }
                // that.onSysVersionStatusChange('edit');
                that.setVerButtonSat('edit');
                that = null;
            }
        });
    }
    onEditVersion(){
        this.setVerButtonSat('edit');
    }
    onDelVersion(){
        let rowNum = this.props.editTable.getNumberOfRows(sysVersionModalId);
        if(rowNum <= 1){
            toast({ color: 'warning', content: this.state.json['10100BOSB-000054'] });
            return;
        }
        let ind = this.props.editTable.getClickRowIndex(sysVersionModalId);
        let pk_vid = ind.record.values.pk_vid.value;
        let ts = ind.record.values.ts.value;
        // let checkData =  this.props.editTable.getCheckedRows(sysVersionModalId);
        // if(!checkData||checkData.length === 0){
        //     toast({ color: 'warning', content: this.state.json['10100BOSB-000053'] });/* 国际化处理： 请选择要删除的版本*/
        //     return;
        // }
        // //一次只能删除一个？？？？？？？？？？？？？？？？？？？？？
        // if(rowNum<2||rowNum<=checkData.length){
        //     toast({ color: 'warning', content: this.state.json['10100BOSB-000054'] });
        //     return;
        // }
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title:this.state.json['10100BOSB-000037'],/* 国际化处理： 删除确认*/
            content:this.state.json['10100BOSB-000038'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续删除？*/
            beSureBtnClick:()=>{
                this.onSuerDeleteSysVersion(pk_vid,ts)
            }
        })
    }
    onSuerDeleteSysVersion(pk_vid,ts){
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        //  let checkData =  this.props.editTable.getCheckedRows(sysVersionModalId);
        //  let newData = [];
        //  checkData.map((ele)=>{
        //      newData.push(ele.data);
        //  });
        //  let data = {
        //      pageid:this.props.nodePageCode,
        //      model : {
        //          areacode:sysVersionModalId,
        //          areaType: "table",
        //          pageinfo: null,
        //          rows: newData
        //      }
        //  };
        ajax({
            url:ajaxUrl.sysVersionDeleteUrl,
            method:"post",
            data:{pk_system:pk,pk_vid:pk_vid,ts:ts},
            success:function(res){
                that.props.editTable.setTableData(sysVersionModalId,res.data[sysVersionModalId]);
                that.props.button.setButtonDisabled('DelVersion',true)
                // that.initAllDatas(isShowDisable,false);
                that.onInitSysRefLoadMemberData(pk,'');
            }
        });
    }
    onRefreshVersion(){
        this.onCreatVersion('Refresh');
    }
     //版本化保存
    onVersionSave(btnName){
        let checkData =  this.props.editTable.getAllRows(sysVersionModalId);
        let that = this;
        let newData = [];
        checkData.map((ele)=>{
            newData.push(ele.data);
        });
        let data = {
            // pageid:'10100RCSVersion_list',
            pageid:this.props.nodePageCode,
            model : {
                areaType: "table",
                pageinfo: null,
                rows: checkData
            }
        };
        ajax({
            url:ajaxUrl.sysVersionSaveUrl,
            method:"post",
            data:data,
            success:function(res){
                if(res.success){
                    that.props.editTable.setTableData(sysVersionModalId,res.data[sysVersionModalId]);
                    // that.onSysVersionStatusChange('browse');
                    that.setVerButtonSat('browse');
                    if(btnName === 'SaveVersion'){
                        toast({ color: 'success', title: that.state.json['10100BOSB-000002'] });/* 国际化处理： 保存成功！*/
                    }else{
                        that.props.modal.close(sysVersionModalId);
                    }
                }
            }
        });
        //==================下面是NCCV1.0版本的，改成版本化后用上面的代码==========
        // let pk = this.props.syncTree.getSelectNode(leftTree).id;
        // let that = this;
        // let versionData = {
        //     nextvno:document.getElementById('nextvno').value,
        //     vstartdate:document.getElementById('vstartdate').value,
        //     newVersionName:document.getElementById('newVersionName').value,
        //     pk_system:pk,
        //     nodeType:this.props.nodeType
        // }
        // ajax({
        //     url:ajaxUrl.sysVersionSaveUrl,
        //     method:"post",
        //     data:versionData,
        //     success:function(res){
        //         if(res.success){
        //             that.props.modal.close(sysVersionModalId);
        //             that.windowCloseListener('browse')
        //         }else{
        //             toast({content : res.message,color : 'warning'});
        //         }
        //     }
        // });
    }
    onClickButton(props,id){
        switch (id) {
            case 'Add':
                this.onAdd();
                break;
            case 'Copy':
                this.onCopy();
                break;	
            case 'Refresh':
                this.loadLeftTreeData(isShowDisable,true);
                break;
            case 'Enable':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100BOSB-000033'],/* 国际化处理： 提示*/
                    content:this.state.json['10100BOSB-000034'],/* 国际化处理： 确定要启用该数据吗？*/
                    beSureBtnClick:()=>{this.onEnable()}
                })
                break;
            case 'Disable':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100BOSB-000033'],/* 国际化处理： 提示*/
                    content:this.state.json['10100BOSB-000035'],/* 国际化处理： 确定要停用该数据吗？*/
                    beSureBtnClick: ()=>{this.onDisable()}
                })
                break;
            case 'Import':
                this.onImportClick();
                break;
            case 'AddVirtual':
                this.onAddMember();
                break;
            case 'SortManage':
                this.onSortClick();
                break;
            case 'Version':
                this.onCreatVersion();
                break;
            case 'AddStatMemb':
                this.onAddStatMember();
                break;
            case 'Print':
                let allD = this.props.syncTree.getSyncTreeValue(leftTree);
                let pks = [];
                allD.forEach((item,index) => {
                    pks.push(item.id);
                });
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    ajaxUrl.printUrl, 
                    {
                        //billtype:'',  //单据类型
                        funcode: props.appCode,      //功能节点编码，即模板编码
                        nodekey:'budgetorgstruprint',     //模板节点标识
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                );
                break;
            case 'Output':
                let allD1 = this.props.syncTree.getSyncTreeValue(leftTree);
                let pks1 = [];
                allD1.forEach((item,index) => {
                    pks1.push(item.id);
                });
                this.setState({
                    pks: pks1
                 },this.refs.printOutput.open());
                // print(
                //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                //     ajaxUrl.printUrl, 
                //     {
                //         //billtype:'',  //单据类型
                //         funcode: props.appCode,      //功能节点编码，即模板编码
                //         //nodekey:'',     //模板节点标识
                //         // nodekey:'assprinttem',  
                //         outputType:'output',
                //         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                //     }
                // );
                break;
            case 'AddVersion':
                this.onAddVersion();
                break;
            case 'EditVersion':
                this.onEditVersion();
                break;
            case  'DelVersion':
                this.onDelVersion();
                break;
            case 'RefreshVersion':
                // this.onRefreshVersion();
                this.onCreatVersion('Refresh');
                // this.props.button.setButtonDisabled('DelVersion',true);
                break;
            case 'CancelVersion':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100BOSB-000010'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10100BOSB-000011'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick:()=>{
                        this.onRefreshVersion();
                        this.windowCloseListener('browse');
                    }
                })
                break;
            case 'SaveVersion':
                this.onVersionSave('SaveVersion');
                break;
            default:
                break;
        }
    }
    //体系编辑事件
    onEditMember(text, record, index){
    }
    //成员修改保存
    onSaveMember(){
        let memberFlag = this.props.form.isCheckNow(memberFormId);
        let orgFlae = this.props.form.isCheckNow(reportOrgFormId);
        if(!memberFlag||!orgFlae){
            return;
        }
        let orgdata = this.props.form.getAllFormValue(reportOrgFormId);
         //下面的代码用来验证公式
        orgdata.areacode = 'orgForm';
        let validateData = {"model" :orgdata,"pageid" :this.props.nodePageCode};
        this.props.validateToSave( validateData ,()=>{
             this.memberSaveFun(orgdata)
             }, { 'orgForm': 'form' },'form');
    }
    /**
     * 成员保存方法
     * @param {*} orgdata 
     */
    memberSaveFun(orgdata){
        let formdata = this.props.form.getAllFormValue(memberFormId);
        let requestParam = {
            model: formdata,
            pageid: pageCode.memberFomPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        let orgRequest = {
            model:orgdata,
            pageid:'10100BOS_orgForm'
        };
        let that = this;
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        let selectedNode = this.props.syncTree.getSelectNode(leftTree);
        let pk_bos = selectedNode.id;
        ajax({
            url:ajaxUrl.memberSaveUrl,
            method:"post",
            data:{'memberData':requestParam,'orgData':orgRequest,nodeType:this.props.nodeType},
            // data:requestParam,
            success:function(res){
                if(res.success){
                     //后台返回的是表格的数据  需要构造成树状表的数据
                    //  console.log(res.data.memberTreeTable.rows);
                    //  console.log(res.data);
                    //  let datas =  that.props.treeTableManyCol.createNewData(res.data.memberTreeTable.rows);
                     let datas =  res.data.memberTreeTable.rows[0];
                    //  console.log(datas);
                     //根据树状表的数据构造树表
                    //  if(memberSaveType ==='edit'){
                    //      that.props.treeTableManyCol.editRowEve(rightTreeTable,datas);
                    //  }else{//???????????????????????????
                    //     if(selectMember){
                    //         that.props.treeTableManyCol.addChildRowEve(rightTreeTable,datas,selectMember);
                    //     }else{
                    //         // that.onSelectEve(pk_bos,null,true);
                    //     }
                        
                    // }
                    //  that.loadLeftTreeData(isShowDisable);
                     let selectNode = that.props.syncTree.getSelectNode(leftTree);
                    //  that.onSelectEve(selectNode.id,null,true);
                    that.onInitSysRefLoadMemberData(selectNode.id,sysVRefPk);
                     toast({ color: 'success', title: that.state.json['10100BOSB-000002'] });/* 国际化处理： 保存成功！*/
                     that.props.modal.close(memberEditModalId);
                     that.windowCloseListener('browse')
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }
    onRefreshVersion(){
        this.onCreatVersion();
    }
    onSysVersionStatusChange(status){
        this.props.editTable.setStatus(sysVersionModalId,status);
        if(status === 'browse'){
            this.props.button.setButtonsVisible({
                btnAddVersion:true,
                btnEditVersion:true,
                btnDelVersion:true,
                btnRefreshVersion:true
            });
        }else{
            this.props.button.setButtonsVisible({
                btnAddVersion:false,
                btnEditVersion:false,
                btnDelVersion:false,
                btnRefreshVersion:false
            });
        }
    }
    //成员新增虚节点
    onAddMember(){
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            /* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
            toast({content : this.state.json['10100BOSB-000003'],color : 'warning'});
            return;
        }
        memberSaveType = 'add';
        let selectedNode = this.props.syncTree.getSelectNode(leftTree);
        let pk_bos = selectedNode.id;
        // let pk_svid = selectedNode.nodeData.vid;
         //获取选中的成员作为引入数据的根节点
         let pk_member = '';
         let pk_membeorg = '';
        if(selectMember&&selectMember.length>0){
             pk_member = selectMember[0].rowId;
             pk_membeorg = selectMember[0].values.pk_org.value;
         }
        ajax({
            url:ajaxUrl.memberAddNewUrl,
            data:{pk_bos:pk_bos,pk_member:pk_member,pk_membeorg:pk_membeorg,pk_svid:sysVRefPk,nodeType:this.props.nodeType},
            success: (res) => {
                if (res.success) {
                    let headData = res.data.memberForm.memberForm.rows[0].values;
                        let meta = this.props.meta.getMeta();
                        meta[memberFormId].items.map((obj)=>{
                            if(obj.attrcode == 'pk_fathermember'){
                                obj.queryCondition = function () {
                                    return {
                                        "pk_bos":pk_bos
                                    }
                                }
                            }
                        })
                    this.props.modal.show(memberEditModalId);
                    this.props.form.EmptyAllFormValue(memberFormId);
                    this.props.form.setFormStatus(memberFormId,'add');
                    this.props.form.EmptyAllFormValue(reportOrgFormId);
                    this.props.form.setFormStatus(reportOrgFormId,'add');

                    // this.props.form.setAllFormValue({memberForm:res.data.memberForm.memberForm});
                    // this.props.form.setAllFormValue({orgForm:res.data.orgForm.orgForm});

                    let cardData = {rows:res.data.memberForm.memberForm.rows};
                    let cardvalue = {'memberForm':cardData}
                    Utils.filterEmptyData(cardvalue.memberForm.rows[0].values);
                    this.props.form.setAllFormValue(cardvalue);

                    let orgData = {rows:res.data.orgForm.orgForm.rows};
                    let orgvalue = {'orgForm':orgData}
                    Utils.filterEmptyData(orgvalue.orgForm.rows[0].values);
                    this.props.form.setAllFormValue(orgvalue);
                    // if(res.data.ismanageorg){
                    //     props.form.setFormStatus(reportOrgFormId,'edit');
                    // }else{
                    //     props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                    //     props.form.setFormStatus(reportOrgFormId,'browse');
                    // }
                    this.windowCloseListener('add');
               }
            }
        });

    }
    onAddStatMember(){
        debugger;
        // this.props.linkTo('/uapbd/org/budgetorgstru_base/budgetstatstru/index.html',{
        //     status:'',
        //     data:'',
        //     enablestate:''
        // });
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        //新打开一个标签页
        if('GLOBE_NODE' === this.props.nodeType){
            // window.open('/uapbd/org/budgetorgstru_glb/budgetstatstru/index.html?pk_budgetorgstru='+this.props.syncTree.getSelectNode(leftTree).id);
            this.props.openTo('/uapbd/org/budgetorgstru_glb/budgetstatstru/index.html',{
                status: 'browse',
                pk_budgetorgstru:pk,
                pagecode:'10100BOSB_stat',
                pk_svid:sysVRefPk
            })
        }else{
            // window.open('/uapbd/org/budgetorgstru_grp/budgetstatstru/index.html?pk_budgetorgstru='+this.props.syncTree.getSelectNode(leftTree).id);
            this.props.openTo('/uapbd/org/budgetorgstru_grp/budgetstatstru/index.html',{
                status: 'browse',
                pk_budgetorgstru:pk,
                pagecode:'10100BOSG_stat',
                pk_svid:sysVRefPk
            })
        }
    }

    //========================= 体系成员引入=========================
    onImportClick(){
        //校验成员只能有一个根节点
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            toast({content : this.state.json['10100BOSB-000003'],color : 'warning'});/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
            return;
        }
        this.onImportDataLoad.call(this,false);
        //  //弹出引入窗口
        // this.props.modal.show(importModalId);
    }

    //引入时是否显示停用的组织
    onShowDisableOrg(checked){
        // showDisableOrg = checked;
        showDisableOrg = !showDisableOrg;
        this.onImportDataLoad.call(this,showDisableOrg);
    }

    onImportDataLoad(showDisableOrg){
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.importDataQryUrl,
            method:"post",
            data:{pk_group:pk_importGroup,showDisable:showDisableOrg,pk_system:pk,pk_orgtypes:pk_orgtypes,pk_svid:sysVRefPk,nodeType:that.props.nodeType,pk_structurePk:structurePk},//NCCLOUD-201032 liyfp 没有传nodeType后台分不清是全局还是集团，不清楚1909是怎么生效的            
            success:function(res){
                if(res.success){
                     //弹出引入窗口
                     that.props.modal.show(importModalId);
                     that.orgTransfer.setRootTitle( groupname+'-' + orgTypeName)
                     if(res.data){
                         that.orgTransfer.reset(res.data);
                     }else{
                         that.orgTransfer.reset([]);
                     }
                    //  that.orgTransfer.setMoveType('0');
                     that.orgTransfer.setMoveType(that.state.oprType);
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }
    //体系成员引入保存
    onImportSave(){
        var orgs = this.orgTransfer.getData();
        if(!(orgs&&orgs.length>0)){
            toast({content : this.state.json['10100BOSB-000004'],color : 'warning'});/* 国际化处理： 您没有选择任何数据！*/
            return;
        }

        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        // let pk_sysvid =this.props.syncTree.getSelectNode(leftTree).nodeData.pk_vid;
        let that = this;
         //获取选中的成员作为引入数据的根节点
         let pk_fmsmember = '';
         let pk_membeorg = '';
         let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
         if(selectMember&&selectMember.length>0){
             pk_fmsmember = selectMember[0].rowId;
             pk_membeorg = selectMember[0].values.pk_org.value;
         }
        ajax({
            url:ajaxUrl.importSaveUrl,
            method:"post",
            data:{orgs,pk_system:pk,pk_sysvid:sysVRefPk,pk_fmsmember:pk_fmsmember,pk_membeorg:pk_membeorg,nodeType:this.props.nodeType},
            success:function(res){
                if(res.success){
                    if(res.data){//返回全新的数据 刷新界面
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        let datas =  that.props.treeTableManyCol.createNewData(res.data.grid.memberTreeTable.rows);
                        //根据树状表的数据构造树表
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                        that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
                    }else{
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    }
                    that.props.modal.close(importModalId);
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }

     /**
	 * 将树数据转换为表数据，提供给第三步生成表格数据使用
	 */
	convertToTable=(orgTree,data)=>{
		orgTree.forEach((item,index)=>{
			data.push(item);
			if(item.children&&item.children.length > 0){
				this.convertToTable(item.children,data);
			}
		});
	}

    /**
	 * 切换树节点移动方式
	 */
	handleOprTypeChange(value){
		this.setState({
			oprType : value
        });
        this.orgTransfer.setMoveType(value);
    }
    
    createCfg(id,param){
        var obj;
        if(id==='BudgetOrgStruVersionGridRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    this.setState(Object.assign (this.state.refs,temp));
                    if(sysVRefPk!==temp.value.refpk){
                        sysVRefPk = temp.value.refpk;
                        sysRefName = temp.value.refname;
                        isRefChange = true;
                        // this.onSelectEve(this.props.syncTree.getSelectNode(leftTree).id,null,true);
                        this.onInitSysRefLoadMemberData(this.props.syncTree.getSelectNode(leftTree).id,sysVRefPk);
                    }
                }.bind(this)
            }
        }
        if(id==='GroupDefaultTreeRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    this.setState(Object.assign (this.state.refs,temp));
                    if(pk_importGroup!==temp.value.refpk){
                        pk_importGroup = temp.value.refpk;
                        groupname = temp.value.refname;
                        this.onImportClick();
                    }
                }.bind(this)
            }
        }
        if(id==='OrgTypeGridRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    this.setState(Object.assign (this.state.refs,temp));
                    if(pk_orgtypes!==temp.value.refpk){
                        pk_orgtypes = temp.value.refpk;
                        orgTypeName = temp.value.refname;
                        this.onImportClick();
                    }
                }.bind(this)
            }
        }
        if(id==='liabilityStructureGridRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    // this.setState(Object.assign (this.state.refs,temp));
                    if(pk_orgtypes!==temp.value.refpk){
                        structurePk = temp.value.refpk;
                        // orgTypeName = temp.value.refname;
                        this.onImportClick();
                    }
                }.bind(this)
            }
        }
        if(id==='resacostStructureGridRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    // this.setState(Object.assign (this.state.refs,temp));
                    if(pk_orgtypes!==temp.value.refpk){
                        structurePk = temp.value.refpk;
                        // orgTypeName = temp.value.refname;
                        this.onImportClick();
                    }
                }.bind(this)
            }
        }
        this.state.refs[id]=obj;
        var result_param= Object.assign(obj, param)
        return result_param;
    }

    //数据选择监听事件
    handelBeforeMove(nodes,value,type){
        if(type==='bl2r'){
            l2rBefor = true;
            this.checkBeforeMove(nodes)
            return l2rBefor;
        }
        return true;
    }

    checkBeforeMove(nodes){
        // let returnResult = true
        nodes.forEach((item,index)=>{
            if(item.nodeData.isMember){
                /* 国际化处理： 在体系中已经存在，请重新选择*/
                toast({content : item.refname + this.state.json['10100BOSB-000005'],color : 'warning'});
                l2rBefor = false;
                return
                // returnResult = false;
                // return false;
            }
			if(item.children&&item.children.length > 0){
				this.checkBeforeMove(item.children);
			}
        });
        // return returnResult;
    }

    onCheckboxChange(id,check){
        switch(id){
            case 'orgShowDisable':
                this.onShowDisableOrg.call(this,check);
                break;
            case 'sysShowDisable':
                this.onCheckShowDisable.call(this,check);
                break;
        }
    }
    getImportDialog(){
        let changeWidth = 4;
        if(pk_orgtypes == 'LIABILITYANDGROUP000' || pk_orgtypes == 'RESACOSTANDGROUP0000'){
            changeWidth=3;
        }
        return (
			<div id="org_transfer" className="steps-content" style={{height:'450px'}}>
                <Row style={{marginBottom:'5px'}}>
                    <Col md={changeWidth} xs={changeWidth} sm={changeWidth}>
                        {GroupDefaultTreeRef({}=this.createCfg("GroupDefaultTreeRef",{
                                value:{
                                    fieldid:'budgetorgstruversiongridref',
                                    refpk:pk_importGroup,
                                    refname:groupname
                                },
                                
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    // isShowDisabledData: true,
                                    // pk_reportcombinestru: this.props.syncTree.getSelectNode(leftTree).id
                                };
                            }.bind(this)
                        }))}
                    </Col>
                    <Col md={changeWidth} xs={changeWidth} sm={changeWidth}>
                        {OrgTypeGridRef({}=this.createCfg("OrgTypeGridRef",{
                                value:{
                                    fieldid:'orgtypegridref',
                                    refpk:pk_orgtypes,
                                    refname:orgTypeName
                                },
                                
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    GridRefActionExt:'nccloud.web.org.budgetorgstru.action.BudgetOSMemberImportSqlBuilder'
                                };
                            }.bind(this)
                        }))}
                    </Col>
                    {pk_orgtypes == 'LIABILITYANDGROUP000' ? 
                        <Col md={changeWidth} xs={changeWidth} sm={changeWidth}>
                            {LiabilityCenterOrgAllTreeRef({}=this.createCfg("liabilityStructureGridRef",{
                                value:{
                                    fieldid:'orgtypegridref',
                                    refpk:pk_orgtypes,
                                    refname:"利润中心结构"
                                },
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    // GridRefActionExt:'nccloud.web.org.budgetorgstru.action.BudgetOSMemberImportSqlBuilder'
                                };
                            }.bind(this)
                            }))}
                        </Col>:''
                    }
                    {pk_orgtypes == 'RESACOSTANDGROUP0000' ? 
                        <Col md={changeWidth} xs={changeWidth} sm={changeWidth}>
                            {LiabilityCenterOrgAllTreeRef({}=this.createCfg("resacostStructureGridRef",{
                                value:{
                                    fieldid:'orgtypegridref',
                                    refpk:pk_orgtypes,
                                    refname:"成本中心结构"
                                },
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    // GridRefActionExt:'nccloud.web.org.budgetorgstru.action.BudgetOSMemberImportSqlBuilder'
                                };
                            }.bind(this)
                            }))}
                        </Col>:''
                    }
                    <Col>
                         <NCCheckbox id = 'orgShowDisable' 
                            onChange = {this.onCheckboxChange.bind(this,'orgShowDisable')}
                            checked = {showDisableOrg}
                            >{this.state.json['10100BOSB-000019']}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                    </Col>
                </Row >  
                <div className = 'tree-modal'>           
                    <Transfer 
                        ref={(item)=>{this.orgTransfer = item}} showSearch={true}
                    />
                </div>
                    <NCRadio.NCRadioGroup
                        style={{width:'100%',textAlign:'center'}}
                        name="oprType"
                        selectedValue={this.state.oprType}
                        onChange={this.handleOprTypeChange.bind(this)}>
                        <NCRadio value="0" >{this.state.json['10100BOSB-000020']}</NCRadio>{/* 国际化处理： 包含所有下级*/}
                        <NCRadio value="1" >{this.state.json['10100BOSB-000021']}</NCRadio>{/* 国际化处理： 仅自己*/}
                        <NCRadio value="2" >{this.state.json['10100BOSB-000022']}</NCRadio>{/* 国际化处理： 仅直接下级*/}
                        <NCRadio value="3" >{this.state.json['10100BOSB-000023']}</NCRadio>{/* 国际化处理： 仅末级*/}
                    </NCRadio.NCRadioGroup>
              
			</div>
            
		);
    }

      /**
     * 结构调整
     */
    onSortClick(){
        let pk_system = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.memberSortQryUrl,
            method:"post",
            data:{pk_system:pk_system,pk_svid:sysVRefPk},
            success:(res)=>{
                if(res.success){
                    //转换树的父子关系
                    if(res.data){
                        let treeData = this.dealTreeData(res.data);
                        this.setSyncTreeData(memberSortTreeId, treeData);
                    }else{
                        this.setSyncTreeData(memberSortTreeId, []);
                    }
                    this.props.modal.show(memberSortModalId);
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }
    /**
     * 排序树不需要操作功能
     * @param {*} key 
     */
    onMouseEnterSortTreeEve( key ) {
        let obj = {
            delIcon:false,
            editIcon:false,
            addIcon:false
        };
        this.props.syncTree.hideIcon( memberSortTreeId, key, obj )
    }

    setOrder(orderType){
        let selected = this.props.syncTree.getSelectNode(memberSortTreeId)
        if(!selected){
            toast({content : this.state.json['10100BOSB-000006'],color : 'warning'});
            return;
        }
        let pk_member = selected.id;
        ajax({
            url:ajaxUrl.memberSetOrderUrl,
            method:"post",
            data:{pk_member:pk_member,orderType:orderType,pk_svid:sysVRefPk},
            success:(res)=>{
                if(res.success){
                    //转换树的父子关系
                    let treeData = this.dealTreeData(res.data);
                    this.setSyncTreeData(memberSortTreeId, treeData);
                    this.props.syncTree.setNodeSelected(memberSortTreeId,selected.id);
                    this.props.modal.show(memberSortModalId);
                    isSort = true;
                }else{
                    toast({content : res.message,color : 'warning'});
                }
            }
        });
    }

    /**
     * 体系版本编辑事件,修改版本的开始时间，要同时自动修改上个版本的结束时间
     * @param {*} props 
     * @param {*} moduleId 
     * @param {*} key 
     * @param {*} value 
     * @param {*} changedrows 
     * @param {*} index 
     * @param {*} record 
     */
    afterTableEvent(props, moduleId, key,value, changedrows, index, record){
        debugger
        if(key === 'vstartdate'&&changedrows[0].newvalue.value != changedrows[0].oldvalue.value&&index>0){
            var newvalue= record.values.vstartdate.value;
            var preEndDate = this.addDate(newvalue,-1)+' 23:59:59';
            let setObj = {};
            setObj.value = preEndDate;
            setObj.display = preEndDate;
            props.editTable.setValByKeyAndIndex(sysVersionModalId,index-1,'venddate',setObj)
        }
   }

   /**
    * 日期计算
    * @param {*} date 
    * @param {*} days 
    */
    addDate(date,days){ 
        var d=new Date(date); 
        d.setDate(d.getDate()+days); 
        var m=d.getMonth()+1; 
        return d.getFullYear()+'-'+m+'-'+d.getDate(); 
    } 
    onSelected(props,moduleId,record, index, status){
        // status? this.props.button.setButtonDisabled('DelVersion',false) : this.props.button.setButtonDisabled('DelVersion',true);;
        let checkData =  this.props.editTable.getCheckedRows(sysVersionModalId);
        if(!checkData||checkData.length ===0){
            props.button.setButtonDisabled(['DelVersion'],true);
        }else{
            props.button.setButtonDisabled(['DelVersion'],false);
        }
    }
    onSelectedAll(props,moduleId,status,length){
        status? this.props.button.setButtonDisabled('DelVersion',false) : this.props.button.setButtonDisabled('DelVersion',true);;
    }
    onClickVersion(props, moduleId, record, index,e){
        props.button.setButtonDisabled(['DelVersion'],false);
    }
    /**
     * 结构调整弹框关闭后的事件（比如要刷新成员数据）
     */
    closeSortModalEve(){
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        this.onInitSysRefLoadMemberData(pk,sysVRefPk);
    }

    onSearch(value){
        this.setState({ searchValue:value });
        this.props.treeTableManyCol.searchTreeTable({ moduleId: 'memberTreeTable', 
            searchValue: value, filters: ['code','name'], expanded: true, defaultExpandAllRows: false})
    }
    

    render() {
        const {BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {button, syncTree, modal,DragWidthCom,treeTable,treeTableManyCol,editTable } = this.props;
        const {createButton} = button;
        const { createButtonApp } = button;
        const { createTreeTable } = treeTable;
        const { createEditTable } = editTable;
        let { treeTableCol } = treeTableManyCol;
        let {createSyncTree} = syncTree;
        let { createModal } = modal;
        return (
            <div className="nc-bill-tree-table">
                {/*体系 编辑模态框*/}
                { this.state.json['10100BOSB-000036']&&createModal(sysModalId,{
                    title:this.state.json['10100BOSB-000036'],/* 国际化处理： 预算组织体系*/
                    content:this.props.form.createForm(formId),
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onSaveSys.bind(this),
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        // this.props.modal.show('warning',{
                        //     beSureBtnClick:()=>{
                        //         this.props.modal.close(sysModalId);
                        //         this.props.modal.close('warning');
                        //     }
                        // });
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title:this.state.json['10100BOSB-000010'],/* 国际化处理： 确认取消*/
                            content:this.state.json['10100BOSB-000011'],/* 国际化处理： 是否确认要取消？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(sysModalId);
                                this.props.form.setFormStatus(formId,'browse');
                                this.toggleShow();
                                this.windowCloseListener('browse')
                            }
                        })
                    }
                }) }
                 {/*体系 删除模态框*/}
                {this.state.json['10100BOSB-000037']&&createModal(sysModalDelId,{
                    title:this.state.json['10100BOSB-000037'],/* 国际化处理： 删除确认*/
                     content:this.state.json['10100BOSB-000038'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续删除？*/
                     userControl:true,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.onDeleteSys.bind(this),
                     cancelBtnClick: ()=>{this.props.modal.close(sysModalDelId)}
                })}
                 {/*预算组织体系成员- 编辑模态框*/}
                 { this.state.json['10100BOSB-000039']&&createModal(memberEditModalId,{
                    title:this.state.json['10100BOSB-000039'],/* 国际化处理： 预算组织体系成员管理*/
                    content:function(){
                        return(
                            <div>
                                <div>
                                     {this.props.form.createForm(memberFormId)}
                                     {/* <div> */}
                                        {/* <hr/> */}
                                        {this.state.json['10100BOSB-000024']}:{/* 国际化处理： 组织信息*/}
                                     {/* </div> */}
                                     {this.props.form.createForm(reportOrgFormId)}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onSaveMember.bind(this),
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        // this.props.modal.show('warning',{
                        //     beSureBtnClick:()=>{
                        //         this.props.modal.close(memberEditModalId);
                        //         this.props.modal.close('warning');
                        //     }
                        // });
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title:this.state.json['10100BOSB-000010'],/* 国际化处理： 确认取消*/
                            content:this.state.json['10100BOSB-000011'],/* 国际化处理： 是否确认要取消？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(memberEditModalId);
                                this.windowCloseListener('browse')
                                // this.props.form.setFormStatus(formId,'browse');
                                // this.toggleShow();
                            }
                        })
                    }
                }) }
                 {/*体系成员- 引入操作模态框*/}
                 { this.state.json['10100BOSB-000012']&&createModal(importModalId,{
                    title:this.state.json['10100BOSB-000012'],/* 国际化处理： 请选择要引入的组织*/
                    content:this.getImportDialog.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onImportSave.bind(this),
                    noFooter:false,
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{
                        this.props.modal.close(importModalId);
                        this.windowCloseListener('browse');
                    }
                }) }
                {/* 体系版本化模态框 */}
                { this.state.json['10100BOSB-000040']&&createModal(sysVersionModalId,{
                    title:this.state.json['10100BOSB-000040'],/* 国际化处理： 预算组织体系版本化*/
                    //content:this.props.editTable.createEditTable(sysVersionModalId),
                    content:function(){
                        return (
                            // <div>
                            //     <div className="version-head">
                            //         <Row style={{padding:'3px'}}>
                            //             <Col md={4} xs={4} sm={4}>
                            //                  {this.state.json['10100BOSB-000047']}：<NCFormControl type='text' id = 'nextvno' disabled value ={this.state.nextvno }  style={{width:'160px'}}/>{/* 国际化处理： 新版本号*/}
                            //             </Col>
                            //             <Col md={4} xs={4} sm={4}>
                            //                 {this.state.json['10100BOSB-000048']}：<NCFormControl type='text' id='newVersionName' name = 'newVersionName' value={this.state.versionName} required onChange={(value)=>{this.state.versionName = value;this.setState(this.state);}}  style={{width:'160px'}} />    {/* 国际化处理： 说明*/}
                            //             </Col>
                            //             <Col md={4} xs={4} sm={4}>
                            //                  {/* 生效日期<NCDatePicker  id = 'vstartdate' disabled  value ={this.state.vstartdate} style={{width:'120px'}}/>  */}
                            //                  {this.state.json['10100BOSB-000049']}：<NCFormControl type='text'  id = 'vstartdate' disabled  value ={this.state.vstartdate} style={{width:'160px'}}/> {/* 国际化处理： 生效日期*/}
                            //             </Col>
                            //         </Row>
                            //     </div>
                            //     <div>
                            //         {this.props.editTable.createEditTable(sysVersionModalId,{})}
                            //     </div>
                            // </div>
                            <div>
                                <div className="table-area">
                                    {/* 体系版本按钮区  btn-group */}
                                    <div className="btn-group" style={{padding:'5px',textAlign:'right'}}>
                                        {createButtonApp({
                                            area: 'vers_head',
                                            buttonLimit: 5,
                                            onButtonClick: this.onClickButton.bind(this),
                                            popContainer: document.querySelector('.vers_head')
                                        })}
                                    </div>
                                </div>
                                <div>
                                    {this.props.editTable.createEditTable(sysVersionModalId,{
                                        showCheck:false,
                                        showIndex:true,
                                        onAfterEvent: this.afterTableEvent.bind(this),
                                        onSelected:this.onSelected.bind(this),
                                        onSelectedAll:this.onSelectedAll.bind(this),
                                        onRowClick:this.onClickVersion.bind(this)
                                        })}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onVersionSave.bind(this),
                    noFooter : true,//不显示底部的确定、取消按钮
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{
                        this.props.modal.close(sysVersionModalId);
                        this.windowCloseListener('browse')
                    }
                }) }

                {/*体系成员- 结构调整模态框*/}
                { this.state.json['10100BOSB-000013']&&createModal(memberSortModalId,{
                    title:this.state.json['10100BOSB-000013'],/* 国际化处理： 结构调整*/
                    content:function(){
                        return(
                            <div class="ncc-hr-contain">
                                <div class="ncc-hr-left-tree nc-theme-gray-area-bgc">
                                    <div class="ncc-hr-padding">
                                        {createSyncTree({
                                            treeId:memberSortTreeId,
                                            showLine:true, 
                                            needSearch:false,
                                            defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                            onMouseEnterEve:this.onMouseEnterSortTreeEve.bind(this),//鼠标滑过节点事件
                                            showModal:false
                                        })}
                                    </div>
                                </div>
                            <div class="ncc-hr-right-operate nc-theme-gray-area-bgc">
                                <div class="ncc-hr-padding">
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton  fieldid={"budgetuptop"}  onClick= {this.setOrder.bind(this,'upTop')}>{this.state.json['10100BOSB-000025']}</NCButton>{/* 国际化处理： 置于顶层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid={"budgetupone"} onClick= {this.setOrder.bind(this,'upOne')}>{this.state.json['10100BOSB-000026']}</NCButton>{/* 国际化处理： 向上一层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid={"budgetdownone"} onClick= {this.setOrder.bind(this,'downOne')}>{this.state.json['10100BOSB-000027']}</NCButton>{/* 国际化处理： 向下一层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid={"budgetdownbottom"} onClick= {this.setOrder.bind(this,'downBottom')}>{this.state.json['10100BOSB-000028']}</NCButton>{/* 国际化处理： 置于底层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid={"budgetupgrade"} onClick= {this.setOrder.bind(this,'upgrade')}>{this.state.json['10100BOSB-000029']}</NCButton>{/* 国际化处理： 升级*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'10px'}}>
                                        <NCButton fieldid={"budgetdegrade"} onClick= {this.setOrder.bind(this,'degrade')}>{this.state.json['10100BOSB-000030']}</NCButton>{/* 国际化处理： 降级*/}
                                    </div>
                                                                    
                                    </div>
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl:true,//自己控制什么时候关闭窗口
                    // beSureBtnClick:this.onImportSave.bind(this)
                    noFooter:true,
                    hasCloseBtn:true,
                    closeModalEve: this.closeSortModalEve.bind(this), //关闭按钮事件回调
                    cancelBtnClick: ()=>{
                        this.props.modal.close(memberSortModalId);
                        if(isSort){
                            let pk = this.props.syncTree.getSelectNode(leftTree).id;
                            // this.onSelectEve(pk,null,true);
                            this.onInitSysRefLoadMemberData(pk);
                            this.windowCloseListener('browse');
                        }
                    }
                    // size:'sm'//模态框大小 sm/lg/xlg
                }) }


                {/* 标题 title */}
                <NCDiv  areaCode={NCDiv.config.HEADER}  className="header"  >
                    {/*页面大图标*/}
                    {/* {createPageIcon()} */}
                    {createBillHeadInfo({
                            title:this.props.appCode ==='10100BOSB'?this.state.json['10100BOSB-000050']:this.state.json['10100BOSB-000051'],
							initShowBackBtn:false
                        }	
	                    )}
                    {/* <h2 className="title">

                    {}
                    </h2> */}
                    <span className="showOff ">
                        <NCCheckbox 
                            onChange = {this.onCheckShowDisable.bind(this)}
                            checked = {isShowDisable}
                        >
                            {this.state.json['10100BOSB-000019']}{/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
			        </span>
                    {/* 按钮区  btn-group */}
                    <div className="btn-group">
                         {createButtonApp({
                            area: 'list_head',
                            buttonLimit: 5,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.list_head')
                        })}
                    </div>
                </NCDiv>
                {/* 标题 主界面区域  左树--右树表*/}
                <div className="tree-table">
                    <DragWidthCom
                         //资金管理体系树
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                     treeId:leftTree,
                                     showLine:true, 
                                     clickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调
                                     clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调
                                     clickAddIconEve: this.onAdd.bind(this), //新增点击 回调
                                     onSelectEve: this.onSelectEve.bind(this),   //选择节点回调方法
                                     defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                     searchType:'filtration',//树节点过滤方式修改
                                     onMouseEnterEve:this.onMouseEnterEve.bind(this),//鼠标滑过节点事件
                                     disabledSearch:false,
                                     showModal:false
                                })}
                            </div>
                        } 
                        //资金管理体系成员---树状表
                        rightDom = {
                            <div className="treeTableCol">
                                <div className="version-head" >
                                    <Row style={{marginBottom: 10,marginTop: 10}}>
                                            <Col md={1} xs={1} sm={1}>
                                                <div style={{marginRight: -21,marginLeft: 17,marginTop: 7,width: 200,color:'#BDBDBD'}}>{this.state.json['10100BOSB-000052']}：</div>{/* 国际化处理： 体系版本*/}
                                            </Col>
                                            <Col md={2} xs={2} sm={2}>
                                                {BudgetOrgStruVersionGridRef({}=this.createCfg("BudgetOrgStruVersionGridRef",{
                                                    fieldid:'budgetorgstruref',
                                                    disabled: !this.state.vRefEnable,
                                                    value:{refpk:sysVRefPk,
                                                        refname:sysRefName
                                                    },
                                                    queryCondition: function(){
                                                        return {
                                                            //此处可以添加参数
                                                            // isShowDisabledData: true,
                                                            pk_budgetorgstru: this.props.syncTree.getSelectNode(leftTree).id
                                                        };
                                                    }.bind(this)
                                                }))}
                                            </Col>
                                            <Col md={2} xs={2} sm={2}>
                                            <NCDiv areaCode={NCDiv.config.SEARCH}>
                                                <NCFormControl
                                                    fieldid = {"search"}
                                                    placeholder={this.state.json['10100BOSB-000057'] }
                                                    value={this.state.searchValue}
                                                    onChange={this.onSearch.bind(this)}
                                                    type="search"
                                                    // disabled={this.state.searchDisable}
                                                />
                                                </NCDiv>
                                            </Col>
                                            <Col md={9} xs={9} sm={9}></Col>
                                        </Row>
                                        { treeTableCol( rightTreeTable,{
                                            expandEve: this.expandEve.bind(this),//异步执行，点击加号展开子节点
                                            collapandEve:this.collapandEve.bind(this),//异步执行，点击加号收起子节点
                                            async:false,    //数据同步加载为false,异步加载为true
                                            defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                            showCheckBox:true,       // 是否显示复选框 ,默认false不显示
                                            checkedType:'radio'      // 勾选方式，单选radio,多选 checkbox； 默认多选
                                        } ) }
                                 </div>
                            </div>
                        }  
                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百 
                    />
                </div>
                <PrintOutput
					ref='printOutput'
					url={ajaxUrl.printUrl}
					data={{
						funcode:this.props.appCode,      //功能节点编码，即模板编码
						nodekey:'budgetorgstruprint',     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
                >
                </PrintOutput>
            </div>
        )
    }
    //初始化单据模板
    initTemplate = (props)=> {
        createUIDom(props)(
            {
                pagecode : props.nodePageCode
                // appid : props.appId
                // appcode:props.appCode
            },
            {
                moduleId: "10100BOSB",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData;
                    orgTypeName = this.state.json['10100BOSB-000000'];//引入组织类型名称/* 国际化处理： 业务单元*/
                }
                if(data){
                    let meta = data.template;
                    meta = this.modifierMeta(props, meta)
                    props.meta.setMeta(meta);
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delline',this.state.json['10100BOSB-000016']) /* '确认要删除该条吗？' 设置操作列上删除按钮的弹窗提示 */
                    }
                }
        });
    }

    tableButtonClick=(props, id, text, record, index)=>{
        let pk = record.values.pk_bosmember.value;
        let pk_vid = record.values.pk_vid.value;
        let pk_svid = record.values.pk_svid.value;
        switch(id){
            case 'Editline':
                memberSaveType = 'edit';
                // props.form.setFormStatus(reportOrgFormId,'edit');
                ajax({
                    url:ajaxUrl.memberQueryByPkUrl,  
                    data: {pk_member:pk,nodeType:props.nodeType,pk_vid:pk_vid,pk_svid:sysVRefPk},
                    success: (res) => {
                        if (res.success) {
                            let headData = res.data.memberForm.memberForm.rows[0].values;
                            let meta = props.meta.getMeta();
                            let pk_bos= headData.pk_bos.value;
                            meta[memberFormId].items.map((obj)=>{
                                if(obj.attrcode == 'pk_fathermember'){
                                    obj.queryCondition = function () {
                                        return {
                                            "pk_bos": pk_bos
                                        }
                                    }
                                }
                            })
    
                            props.form.setFormStatus(memberFormId,'edit');
                            
                            props.form.EmptyAllFormValue(memberFormId);
                            props.form.EmptyAllFormValue(reportOrgFormId);
                            // props.form.setAllFormValue({memberForm:res.data.memberForm.memberForm});
                            // props.form.setAllFormValue({orgForm:res.data.orgForm.orgForm});
                            let cardData = {rows:res.data.memberForm.memberForm.rows};
                            let cardvalue = {'memberForm':cardData}
                            props.form.setAllFormValue(cardvalue);
        
                            let orgData = {rows:res.data.orgForm.orgForm.rows};
                            let orgvalue = {'orgForm':orgData}
                            props.form.setAllFormValue(orgvalue);
                            if(res.data.ismanageorg){
                                props.form.setFormStatus(reportOrgFormId,'edit');
                            }else{
                                props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                                props.form.setFormStatus(reportOrgFormId,'browse');
                            }
                            props.modal.show(memberEditModalId);
                            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                                return '';
                            };
                        }
                    }
                });
                break;
            case 'Delline':
                ajax({
                    url:ajaxUrl.memberDeleteUrl,  
                    data: {pk_member:pk,ts:record.values.ts.value,pk_vid:pk_vid,pk_svid:pk_svid},
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', title: this.state.json['10100BOSB-000017'] });/* 国际化处理： 删除成功！*/
                            props.treeTableManyCol.delRowByPk(rightTreeTable,record);
                        }
                    }
                });
                break;
            default:
                break;
    
        }
    }
    modifierMeta=(props, meta)=> {
        meta[memberFormId].items.map((obj)=>{
            if(obj.attrcode == 'pk_fathermember'){
                obj.refcode = 'uapbd/refer/org/BudgetOrgStruMemberTreeRef/index.js';
            };
            if(obj.attrcode == 'pk_entityorg'){
                obj.refcode = 'uapbd/refer/org/PlanBudgetDefaultGridRef/index.js';
            };
        });
        meta[reportOrgFormId].items.map((obj)=>{
            if(obj.attrcode == 'datasource'){
                obj.refcode = 'uapbd/refer/org/DataSourceDefaultGridRef/index.js';
            }
        });
        //树表添加操作列
        meta[rightTreeTable].items.push({
            attrcode: 'opr',
            label: this.state.json['10100BOSB-000018'],/* 国际化处理： 操作*/
            width: 200,
            itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
            visible: true,
            fixed:'right',
            render: (text, record, index) => {
                return (
                    props.button.createOprationButton(
                        tableBtnAry,
                        {
                            area: "list_inner",
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


// let OrgSysPage =  createPage({
//     // initTemplate: initTemplate,
// })(OrgSysPanel);
export default OrgSysPage

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65