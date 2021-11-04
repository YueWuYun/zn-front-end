//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,print ,high,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const {PrintOutput}=high;
const {NCCol:Col, NCRow:Row ,NCFormControl,NCDatePicker, NCButton ,NCPanel,NCCheckbox,NCPopconfirm,NCRadio ,NCDiv} = base;
import './index.less';
/* 报表组织体系多版本：*/
import ReportManaStruMultiVersionGridRef from '../../../refer/orgv/ReportManaStruMultiVersionGridRef/index'
//组织类型参照
import OrgTypeGridRef from '../../../refer/org/OrgTypeGridRef/index'
//组织类型参照
import LiabilityCenterOrgAllTreeRef from '../../../refer/org/LiabilityCenterOrgAllTreeRef/index'
/**
 * 穿梭框--导入使用
 */
import Transfer from '../../../public/excomponents/Transfer';

//集团(所有）参照
// import GroupDefaultTreeRef from '../../../refer/org/GroupDefaultTreeRef/index'
//集团参照
import GroupDefaultTreeRef from '../../../../uap/refer/riart/groupTreeRef/index'
import createUIDom from '../../../public/utils/BDCreateUIDom';
import { debug } from 'util';
import  Utils from '../../../public/utils';

let leftTree = 'systemTree';//体系--左树id
let rightTreeTable = 'memberTreeTable'//成员--右树表id
let formId = 'sysForm';//体系--编辑formid
let sysModalId = 'sysModal';//体系编辑模态窗id
let sysModalDelId = 'sysDelete';//体系删除模态窗id
let deleteTreeNode = '';//左树删除选择
let memberFormId = 'memberForm';//成员--编辑id
let reportOrgFormId = 'reportorg_form';//成员组织信息模板id
let memberEditModalId = 'memberModal';//成员--编辑模态窗id
let sysSaveType = 'add';//add--新增  edit--修改  copy--复制
let sysVersionStatus = 'browse';//体系版本界面的状态
let memberSaveType = 'edit';
let sysVersionModalId = 'systemversion';//体系版本化模态框
let importModalId = 'importModalId';//引入对话框id
let sysVersionDeleteModalId = 'sysVDelModalId';//版本删除提示框

let sysVRefPk='';//体系版本参照选择的主键
let sysRefName='';//体系版本参照名称（初始化时使用）
let isRefChange=false;//用来判断刷新列表是不是因为选择体系版本导致的
let pk_importGroup = '';//引入对话框的集团参照的主键
let groupname = '';
let pk_orgtypes = 'BUSINESSUNIT00000000';//引入的组织类型
let orgTypeName = '';
// this.state.json['10100RSSB-000000'];//引入组织类型名称/* 国际化处理： 业务单元*/
let showDisableOrg = false;//引入对话框是否显示停用的组织

let memberSortModalId = 'memberSortModal';//结构调整模态框id
let memberSortTreeId = 'memberSortTree';//结构调整--树id

let isShowDisable = false;

let l2rBefor = true;//引用对话框选中校验

let isSort = false;//结构不是被调整过，用来判断是不是需要刷新数据

let templateCode = '10100RSSB_list';//动态加载模板，及显示公式
let structurePk=''//引用利用中心结构&&成本中心结构使用

/**
 * URL定义
 */
let ajaxUrl={
    initUrl:'/nccloud/platform/templet/querypage.do',
    sysLoadUrl:"/nccloud/uapbd/org/ReportManaStruTreeNodeWapper.do",
    sysDeleteUrl:"/nccloud/uapbd/org/ReportManaStruDeleteAction.do",
    sysEnableUrl:"/nccloud/uapbd/org/ReportManaStruEnableAction.do",
    sysDisableUrl:"/nccloud/uapbd/org/ReportManaStruDisableAction.do",
    sysQueryByPkUrl:"/nccloud/uapbd/org/ReportManaStruQueryByPkAction.do",
    sysSaveUrl:"/nccloud/uapbd/org/ReportManaStruSaveAction.do",
    sysCopySaveUrl:'/nccloud/uapbd/org/ReportManaStruCopySaveAction.do',
    sysVersionQueryUrl:"/nccloud/uapbd/org/ReportManaStruVersionQueryAction.do",
    sysVersionAddUrl:"/nccloud/uapbd/org/ReportManaStruVersionAddAction.do",
    sysVersionRefInitUrl:"/nccloud/uapbd/org/ReportManaStruVersionRefInitAction.do",
    sysVersionSaveUrl:"/nccloud/uapbd/org/ReportManaStruVersionSaveAction.do",
    sysVersionDeleteUrl:"/nccloud/uapbd/org/ReportManaStruVersionDeleteAction.do",
    memberLoadUrl:"/nccloud/uapbd/org/ReportManaStruMemberQueryAction.do",
    memberSaveUrl:"/nccloud/uapbd/org/ReportManaStruMemberSaveAction.do",
    memberQueryByPkUrl:"/nccloud/uapbd/org/ReportManaStruMemberQueryByPk.do",
    memberDeleteUrl:"/nccloud/uapbd/org/ReportManaStruMemberDeleteAction.do",
    memberAddUrl:"/nccloud/uapbd/org/ReportManaStruMemberAddAction.do",
    importDataQryUrl:"/nccloud/uapbd/org/ReportManaStruMemberImportQueryAction.do",
    importSaveUrl:"/nccloud/uapbd/org/ReportManaStruMemberImportSaveAction.do",
    memberSortQryUrl:"/nccloud/uapbd/org/ReportManaStruMemberSortQueryAction.do",
    memberSetOrderUrl:"/nccloud/uapbd/org/ReportManaStruMemberSetOrderAction.do",
    printUrl:"/nccloud/uapbd/org/ReportManaStruPrintAction.do",
    statMemberSetOrderUrl:"/nccloud/uapbd/org/ReportStatMemberSetOrderAction.do",
    statmemberSortQryUrl:"/nccloud/uapbd/org/ReportStatQueryIdByCodeAction.do",
}
/**
 * pagcode定义
 */

let pageCode = {
    sysFormPageCode:'10100RSSB_card_sys',
    memberFomPageCode : '10100RSSB_card_memb',
    sysVersionPageCode:'10100RSSB_list_vers',
    orgFormPageCode:'10100RSSB_card_org'
 }
 
 const tableBtnAry = ['Editline','Delline'];		//树表列操作按钮

 const pk_defdoclist = '1010ZZ10000000006BN3';

/**
 * 预算报表组织体系
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
            // importDataValue:{},
            importLeftTreeData:[],
            importRightTreeData:[],
            refs: {},
            vRefEnable:true,
            pks:[],
            json:{},
            expandKeys:[],
            searchValue:''
        }
        this.initTemplate(props);
    }

    componentDidMount () {
        //加载左树 默认不加载停用数据
        // this.loadLeftTreeData(isShowDisable);
        this.initAllDatas(false,false);
        this.props.button.setButtonDisabled('DelVersion',true);
    }

    componentDidUpdate(){
        let formstatus = this.props.form.getFormStatus(formId);
        let sysVersionModalStatus = this.props.editTable.getStatus(sysVersionModalId);
        let memberFormStatus = this.props.form.getFormStatus(memberFormId);
        let reportOrgFormStatus = this.props.form.getFormStatus(reportOrgFormId);
        if(formstatus != 'add' && formstatus != 'edit' 
            && sysVersionModalStatus != 'add' && sysVersionModalStatus != 'edit'
            && memberFormStatus != 'add' && memberFormStatus != 'edit'
            && reportOrgFormStatus != 'add' && reportOrgFormStatus != 'edit'){
            window.onbeforeunload = null;
        }
        else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    /**
     * 2019-01-16 添加，效率优化，打开节点一次性加载界面所有数据
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
                    if(res.data.groupname){
                        pk_importGroup = res.data.pk_group;
                        groupname = res.data.groupname;
                    }
                }else{
                    this.setSyncTreeData(leftTree, []);
                    this.props.treeTableManyCol.emptyAllData(rightTreeTable);
                }
                if(isRefreshAction){
                    toast({ color: 'success', title: this.state.json['10100RSSB-000001'] });/* 国际化处理： 刷新成功！*/
                }
                this.toggleShow();
                this.props.button.setButtonDisabled('DelVersion', true);
            }
        });
    }

    //加载左树数据
    loadLeftTreeData(showDisable,isRefreshAction = false){
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
                        toast({ color: 'success', title: this.state.json['10100RSSB-000001'] });/* 国际化处理： 刷新成功！*/
                    }
                    this.toggleShow();
                    this.props.button.setButtonDisabled('DelVersion', true);
                }
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
            title:  this.state.json['10100RSSB-000030'],
            content:this.state.json['10100RSSB-000002'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
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
                toast({ color: 'success', title: that.state.json['10100RSSB-000003'] });/* 国际化处理： 删除成功！*/
            }
        });
    }
    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve (data, item, isChange) {
        if(!isRefChange){
            let that = this;
            //体系选择后需要初始化版本参照的数据
            ajax({
                url:ajaxUrl.sysVersionRefInitUrl,
                method:"post",
                data:{pk_system: data},
                success:function(res){
                    if(res.success){
                        if(res.data){
                            sysVRefPk=res.data.pk_rcsvid;//体系版本参照选择的主键
                            sysRefName=res.data.rcsvname;//体系版本参照名称（初始化时使用）
                        }else{
                            sysVRefPk='';//体系版本参照选择的主键
                            sysRefName='';//体系版本参照名称（初始化时使用）
                        }
                    }
                    that.onLoadMemberDatas(data);
                }
            });
        }else{
            this.onLoadMemberDatas(data);
        }

        isRefChange = false;   
        // pk_importGroup = this.props.syncTree.getSelectNode(leftTree).nodeData.pk_group;
        // groupname = this.props.syncTree.getSelectNode(leftTree).nodeData.groupname;
        this.toggleShow();
    }
    //刷新成员树表的数据
    onLoadMemberDatas(pk_system){
         //加载成员树表
         let that = this;
         ajax({
             url:ajaxUrl.memberLoadUrl,
             method:"post",
             data:{pk_system: pk_system,pk_sysvid:sysVRefPk},
             success:function(res){
                 if(res.success){
                     if(res.data){
                         //后台返回的是表格的数据  需要构造成树状表的数据
                         let datas =  that.props.treeTableManyCol.createNewData(res.data.memberTreeTable.rows);
                         //根据树状表的数据构造树表
                         that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');

                         // 加载展开的节点
                         that.expandTreeNode();
                     }else{
                         that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                     }
                     that.setState({ searchValue:'' });

                 }
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
        let allData = this.props.syncTree.getSyncTreeValue(leftTree);
        if(!allData||allData.length === 0){
            this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','AddVirtual','SortManage','AddStatMemb','Print'],true);
            // this.ReportManaStruMultiVersionGridRef.Enable = false
            this.setState({
                vRefEnable:false
            });
            // this.sysRefName = '';
            return;
        }else{
            this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','AddVirtual','SortManage','AddStatMemb','Print'],false);
            // this.ReportManaStruMultiVersionGridRef.Enable = true
            this.setState({
                vRefEnable:true
            });
        }
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        if(selectNode){//更新停用启用按钮
            let enablestate = selectNode.nodeData.enablestate;
            if(enablestate ==='2'){//启用状态
                this.props.button.setButtonDisabled({
                    Enable:true,
                    Disable:false
                });
            }else{
                this.props.button.setButtonDisabled({
                    Enable:false,
                    Disable:true
                });
            }
        }
    }
     /**
     * 浏览器或页签关闭时的提示信息--编辑态提示、浏览态不提示
     * @param {*} uiStatus 
     */
    windowCloseListener(uiStatus){
        if(uiStatus == 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }
    onMouseEnterEve( key ) {
        if(key === this.state.json['10100RSSB-000004']){/* 国际化处理： 资金管理体系--全局*/
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
                    that.props.button.setButtonDisabled(['Enable'],true);
                    that.props.button.setButtonDisabled(['Disable'],false);
                    //更新树节点
                    let treeData = that.dealTreeData(res.data);
                    that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    toast({ color: 'success', title: that.state.json['10100RSSB-000005'] });/* 国际化处理： 启用成功！*/
                    // that.toggleShow();
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
                    that.props.button.setButtonDisabled(['Enable'],false);
                    that.props.button.setButtonDisabled(['Disable'],true);
                    //更新树节点
                    let treeData = that.dealTreeData(res.data);
                    that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    toast({ color: 'success', title: that.state.json['10100RSSB-000006'] });/* 国际化处理： 停用成功！*/
                    // that.toggleShow();
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
            data:{pk_system:pk,nodeType:that.props.nodeType,queryType:sysSaveType,templateCode:templateCode},
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
                    that.props.modal.show(sysModalId);
                    that.windowCloseListener('edit');
                }
            }
        });
        //弹出体系编辑窗口
    }
    //体系保存 
    onSaveSys(){
        let flag = this.props.form.isCheckNow(formId);
        if(!flag){
            return false;
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
            // nodeType:this.props.nodeType,  //参数报错，？？？
            // pageid:pageCode.sysFormPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
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
            data:requestParam,
            success:function(res){
                if(res.success){
                    let treeData = that.dealTreeData(res.data);
                    if(sysSaveType==='add'||sysSaveType==='copy'){//新增树节点
                        that.props.syncTree.addNodeSuccess(leftTree,treeData);
                    }else{//修改树节点
                        that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    }
                    toast({ color: 'success', title: that.state.json['10100RSSB-000007'] });/* 国际化处理： 保存成功！*/
                    that.props.modal.close(sysModalId);
                    that.windowCloseListener('browse');
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
    //版本化
    onCreatVersion(){
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.sysVersionQueryUrl,
            method:"post",
            data:{pk_system:pk},
            success:function(res){
                if(res.success){
                    //弹出版本化窗口
                   that.props.modal.show(sysVersionModalId);
                   that.props.editTable.setTableData(sysVersionModalId,{rows:[]});
                    that.props.editTable.setTableData(sysVersionModalId,res.data[sysVersionModalId]);
                    that.onSysVersionStatusChange('browse');
                    // that.props.editTable.setTableData(sysVersionModalId,res.data.grid[sysVersionModalId]);
                    // that.props.editTable.setStatus(sysVersionModalId,'browse');
                    // document.getElementById('nextvno').value=res.data.nextvno;
                    // document.getElementById('vstartdate').value = res.data.vstartdate;

                }
            }
        });
    }
     //版本化保存
    onVersionSave(){
        // this.props.editTable.filterEmptyRows(sysVersionModalId);
        let checkData =  this.props.editTable.getAllRows(sysVersionModalId);
        if(!this.props.editTable.checkRequired(sysVersionModalId,checkData)) {//edittable的必输项校验   
            return;
        }
        let that = this;
        let newData = [];
        checkData.map((ele)=>{
            newData.push(ele.data);
        });
        let data = {
            // pageid:pageCode.sysVersionPageCode,
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
                    that.onSysVersionStatusChange('browse');
                    that.props.modal.close(sysVersionModalId);
                    that.windowCloseListener('browse');
                    toast({ color: 'success', title: that.state.json['10100RSSB-000007'] });/* 国际化处理： 保存成功！*/
                }
            }
        });
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
                    title:this.state.json['10100RSSB-000008'],/* 国际化处理： 提示*/
                    content:this.state.json['10100RSSB-000009'],/* 国际化处理： 确定要启用该数据吗？*/
                    beSureBtnClick:()=>{this.onEnable()}
                })
                break;
            case 'Disable':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100RSSB-000008'],/* 国际化处理： 提示*/
                    content:this.state.json['10100RSSB-000010'],/* 国际化处理： 确定要停用该数据吗？*/
                    beSureBtnClick: ()=>{this.onDisable()}
                })
                break;
            case 'Import':
                this.onImportClick();
                break;
            case 'Version':
                this.onCreatVersion();
                break;
            case 'AddVirtual':
                this.onAddMember();
                break;
            case 'SortManage':
                this.onSortClick();
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
            case 'RefreshV':
                this.props.button.setButtonDisabled('DelVersion',true);
                this.onRefreshVersion();
                break;
            case 'CancelVersion':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100RSSB-000021'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10100RSSB-000022'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick:()=>{
                        this.onRefreshVersion();
                        this.windowCloseListener('browse');
                    }
                })
                //  this.props.editTable.cancelEdit(sysVersionModalId);
                //  this.setVerButtonSat('browse');
                break;
            case 'SaveVersion':
                this.onVersionSave('SaveVersion');
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
                        nodekey:'reportmanastruprint',     //模板节点标识(NC段默认模板配置)
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                    // false,不显示选择模块框
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
                //         // nodekey:'assprinttem',     //模板节点标识(NC段默认模板配置)
                //         outputType:'output',
                //         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                //     }
                // );
                break;
            default:
                break;
            }
    }

    /**
     * 跳转到统计成员界面
     */
    onAddStatMember(){
        //新打开一个标签页
        if('GLOBE_NODE' === this.props.nodeType){
            this.props.openTo('/uapbd/org/reportms_glb/stat/index.html',{
                status: 'browse',
                pk_rms:this.props.syncTree.getSelectNode(leftTree).id,
                pagecode:'10100RSSB_stat',
                pk_svid:sysVRefPk
            })
        }else{
            this.props.openTo('/uapbd/org/reportms_grp/stat/index.html',{
                status: 'browse',
                pk_rms:this.props.syncTree.getSelectNode(leftTree).id,
                pagecode:'10100RSSG_stat',
                pk_svid:sysVRefPk
            })
        }
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
        orgdata.areacode = 'reportorg_form';
        let validateData = {"model" :orgdata,"pageid" :this.props.nodePageCode};
        this.props.validateToSave( validateData ,()=>{
            this.memberSaveFun(orgdata)
            }, { 'reportorg_form': 'form' },'form');
    }

    memberSaveFun(orgdata){
        let formdata = this.props.form.getAllFormValue(memberFormId);
        let requestParam = {
            model: formdata,
            // pageid: pageCode.memberFomPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
            pageid:this.props.nodePageCode
        };
        let orgRequest = {
            model:orgdata,
            // pageid:pageCode.orgFormPageCode
            pageid:this.props.nodePageCode
        };
        let that = this;
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        ajax({
            url:ajaxUrl.memberSaveUrl,
            method:"post",
            data:{'memberData':requestParam,'orgData':orgRequest},
            // data:requestParam,
            success:function(res){
                if(res.success){
                     //后台返回的是表格的数据  需要构造成树状表的数据
                    //  let datas =  that.props.treeTableManyCol.createNewData(res.data.memberTreeTable.rows);
                    // let datas = res.data.memberTreeTable.rows[0]
                     //根据树状表的数据构造树表
                    //  if(memberSaveType ==='edit'){
                    //      that.props.treeTableManyCol.editRowEve(rightTreeTable,datas);
                    //  }else{//???????????????????????????
                    //     that.props.treeTableManyCol.addChildRowEve(rightTreeTable,datas,selectMember);
                    //  }
                    //  that.loadLeftTreeData(isShowDisable);//不要刷新所有数据，只刷新右表数据即可
                    let selectNode = that.props.syncTree.getSelectNode(leftTree);
                    toast({ color: 'success', title: that.state.json['10100RSSB-000007'] });/* 国际化处理： 保存成功！*/
                    that.onLoadMemberDatas(selectNode.id);
                    that.props.modal.close(memberEditModalId);
                    that.windowCloseListener('browse');
                }
            }
        });
    }

    createCfg(id,param){
        var obj;
        if(id==='ReportManaStruMultiVersionGridRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    this.setState(Object.assign (this.state.refs,temp));
                    if(sysVRefPk!==temp.value.refpk){
                        sysVRefPk = temp.value.refpk;
                        sysRefName = temp.value.refname;
                        isRefChange = true;
                        this.onSelectEve(this.props.syncTree.getSelectNode(leftTree).id,null,true);
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
    onAddVersion(){
        // this.props.editTable.addRow(sysVersionModalId);
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
                that.onSysVersionStatusChange('edit');
            }
        });
    }
    onEditVersion(){
        this.onSysVersionStatusChange('edit');
    }
    onDelVersion(){
        let rowNum = this.props.editTable.getNumberOfRows(sysVersionModalId);
        if(rowNum === 1){
            toast({color:"danger",content:this.state.json['10100RSSB-000011']})
            return;
        }
        let ind = this.props.editTable.getClickRowIndex(sysVersionModalId);
        let pk_vid = ind.record.values.pk_vid.value;
        let ts = ind.record.values.ts.value;
        // let checkData =  this.props.editTable.getCheckedRows(sysVersionModalId);
        // //一次只能删除一个？？？？？？？？？？？？？？？？？？？？？
        // if(rowNum<2||rowNum<=checkData.length){
        //     toast({color:"danger",content:this.state.json['10100RSSB-000011']})
        //     return;
        // }
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title:this.state.json['10100RSSB-000012'],/* 国际化处理： 删除确认*/
            content:this.state.json['10100RSSB-000013'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续删除？*/
            beSureBtnClick:()=>{
                this.onSuerDeleteSysVersion(pk_vid,ts);
            }
        })
        // this.props.modal.show(sysVersionDeleteModalId);

    }
    onSuerDeleteSysVersion(pk_vid,ts){
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        let that = this;
        // let checkData =  this.props.editTable.getCheckedRows(sysVersionModalId);
        // let newData = [];
        // checkData.map((ele)=>{
        //     newData.push(ele.data);
        // });
        // let data = {
        //     // pageid:pageCode.sysVersionPageCode,
        //     pageid:this.props.nodePageCode,
        //     model : {
        //         areaType: "table",
        //         pageinfo: null,
        //         rows: newData
        //     }
        // };
        ajax({
            url:ajaxUrl.sysVersionDeleteUrl,
            method:"post",
            data:{pk_system:pk,pk_vid:pk_vid,ts:ts},
            success:function(res){
                if(res.success){
                    that.props.editTable.setTableData(sysVersionModalId,res.data[sysVersionModalId]);
                    that.onSysVersionStatusChange('browse');
                    // that.props.modal.close(sysVersionDeleteModalId);
                    that.props.button.setButtonDisabled('DelVersion',true)
                }
            }
        });

    }
    onRefreshVersion(){
        this.onCreatVersion();
    }
    onSysVersionStatusChange(status){
        this.props.editTable.setStatus(sysVersionModalId,status);
        sysVersionStatus = status;
        if(status === 'browse'){
            this.props.button.setButtonVisible(['AddVersion','EditVersion','RefreshV','DelVersion'],true);
            this.props.button.setButtonVisible(['SaveVersion','CancelVersion'],false);
        }else{
            this.props.button.setButtonVisible(['AddVersion','EditVersion','RefreshV','DelVersion'],false);
            this.props.button.setButtonVisible(['SaveVersion','CancelVersion'],true);
        }
        this.windowCloseListener(status);
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

    //成员新增虚节点
    onAddMember(){
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            toast({content : this.state.json['10100RSSB-000014'],color : 'warning'});/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
            return;
        }
        memberSaveType = 'add';
       
        let pk_rcs = this.props.syncTree.getSelectNode(leftTree).id;
        let pk_svid = sysVRefPk;
        if(pk_svid===''){
            pk_svid = this.props.syncTree.getSelectNode(leftTree).nodeData.pk_vid;
        }
          //获取选中的成员作为引入数据的根节点
        let pk_member = '';
        let pk_membeorg = '';
        if(selectMember&&selectMember.length>0){
            pk_member = selectMember[0].rowId;
            pk_membeorg = selectMember[0].values.pk_org.value;
        }

        ajax({
            url:ajaxUrl.memberAddUrl,
            data:{pk_rcs:pk_rcs,pk_svid:pk_svid,pk_member:pk_member,pk_membeorg:pk_membeorg,nodeType:this.props.nodeType},
            success: (res) => {
               if (res.success) {
                    let headData = res.data.memberForm.memberForm.rows[0].values;
                    let pk_svid = headData.pk_svid.value;
                    let meta = this.props.meta.getMeta();
                    meta[memberFormId].items.map((obj)=>{
                        if(obj.attrcode == 'pk_fathermember'){
                            obj.queryCondition = function () {
                                return {
                                    "pk_svid": sysVRefPk
                                }
                            }
                        };
                    })

                    this.props.modal.show(memberEditModalId);
                    this.props.form.EmptyAllFormValue(memberFormId);
                    this.props.form.setFormStatus(memberFormId,'add');
                    this.props.form.EmptyAllFormValue(reportOrgFormId);
                    this.props.form.setFormStatus(reportOrgFormId,'add');

                    // this.props.form.setAllFormValue(res.data.memberForm);
                    // this.props.form.setAllFormValue(res.data.orgForm);
                    let cardData = {rows:res.data.memberForm.memberForm.rows};
                    let cardvalue = {'memberForm':cardData}
                    Utils.filterEmptyData(cardvalue.memberForm.rows[0].values);
                    this.props.form.setAllFormValue(cardvalue);

                    let orgData = {rows:res.data.orgForm.reportorg_form.rows};
                    let orgvalue = {'reportorg_form':orgData}
                    Utils.filterEmptyData(orgvalue.reportorg_form.rows[0].values);
                    this.props.form.setAllFormValue(orgvalue);
                    if(res.data.ismanageorg){
                        this.props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':false})
                    }else{
                        this.props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                        this.props.form.setFormStatus(reportOrgFormId,'browse');
                    }
                    this.windowCloseListener('edit');
               }
            }
        });

    }


    onImportClick(){
        //校验成员只能有一个根节点
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            toast({content : this.state.json['10100RSSB-000014'],color : 'warning'});/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
            return;
        }
        this.onImportDataLoad.call(this,false);
        //  //弹出引入窗口
        // this.props.modal.show(importModalId);
    }
    //引入时是否显示停用的组织
    onShowDisableOrg(checked){
        showDisableOrg = !showDisableOrg;
        this.onImportDataLoad.call(this,showDisableOrg);
    }

     //体系成员引入保存
     onImportSave(){
        var orgs = this.orgTransfer.getData();
        if(!(orgs&&orgs.length>0)){
            toast({content : this.state.json['10100RSSB-000015'],color : 'warning'});/* 国际化处理： 您没有选择任何数据！*/
            return;
        }

        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        let pk_sysvid =this.props.syncTree.getSelectNode(leftTree).nodeData.pk_vid;
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
                        let datas =  that.props.treeTableManyCol.createNewData(res.data.memberTreeTable.rows);
                        //根据树状表的数据构造树表
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                        that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
                    }else{
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    }
                    that.props.modal.close(importModalId);
                    toast({ color: 'success', title: that.state.json['10100RSSB-000056'] });/* 国际化处理： 引入成功！*/
                    that.windowCloseListener('browse');
                }
            }
        });
    }

     /**
	 * 将树数据转换为表数据，提供给第三步生成表格数据使用
	 */
	convertToTable=(orgTree,data)=>{
        debugger
		orgTree.forEach((item,index)=>{
			data.push(item);
			if(item.children&&item.children.length > 0){
				this.convertToTable(item.children,data);
			}
		});
	}


    onImportDataLoad(showDisableOrg){
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.importDataQryUrl,
            method:"post",
            data:{pk_group:pk_importGroup,showDisable:showDisableOrg,pk_system:pk,pk_orgtypes:pk_orgtypes,pk_sysvid:sysVRefPk,nodeType:this.props.nodeType,pk_structurePk:structurePk},
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
                    that.orgTransfer.setMoveType(that.state.oprType);
                }
            }
        });
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

    //数据选择监听事件
    handelBeforeMove(nodes,value,type){
        if(type==='bl2r'){
            l2rBefor = true;
            this.checkBeforeMove(nodes);
            return l2rBefor;
        }
        return true;
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

    checkBeforeMove(nodes){
        // let returnResult = true
        nodes.forEach((item,index)=>{
            if(item.nodeData.isMember){
                /* 国际化处理： 在体系中已经存在，请重新选择*/
                toast({content : item.refname + this.state.json['10100RSSB-000016'],color : 'warning'});
                l2rBefor = false;
                return;
                // returnResult = false;
                // return false;
            }
			if(item.children&&item.children.length > 0){
				this.checkBeforeMove(item.children);
			}
        });
        // return returnResult;
    }

    getImportDialog(){
        let changeWidth = 4;
        if(pk_orgtypes == 'LIABILITYANDGROUP000' || pk_orgtypes == 'RESACOSTANDGROUP0000'){
            changeWidth=3;
        }
        return (
			<div id="org_transfer" className="steps-content" style={{height:'450px'}}>
                <Row  style={{marginBottom:'5px'}}>
                    <Col md={changeWidth} xs={changeWidth} sm={changeWidth}>
                        {GroupDefaultTreeRef({}=this.createCfg("GroupDefaultTreeRef",{
                                value:{refpk:pk_importGroup,
                                    refname:groupname
                                },
                                fieldid :'GroupDefaultTreeRef',
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
                                value:{refpk:pk_orgtypes,
                                    refname:orgTypeName
                                },
                                fieldid :'OrgTypeGridRef',
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    GridRefActionExt:'nccloud.web.org.reportmanastru.action.RMSMemberImportSqlBuilder'
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
                            
                            >{this.state.json['10100RSSB-000041']}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                    </Col>
                </Row>             
                <Transfer 
                    ref={(item)=>{this.orgTransfer = item}} showSearch={true}
                />
                <NCRadio.NCRadioGroup
                    name="oprType"
                    selectedValue={this.state.oprType}
                    onChange={this.handleOprTypeChange.bind(this)}>
                    <NCRadio value="0" >{this.state.json['10100RSSB-000042']}</NCRadio>{/* 国际化处理： 包含所有下级*/}
                    <NCRadio value="1" >{this.state.json['10100RSSB-000043']}</NCRadio>{/* 国际化处理： 仅自己*/}
                    <NCRadio value="2" >{this.state.json['10100RSSB-000044']}</NCRadio>{/* 国际化处理： 仅直接下级*/}
                    <NCRadio value="3" >{this.state.json['10100RSSB-000045']}</NCRadio>{/* 国际化处理： 仅末级*/}
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
            data:{pk_system:pk_system,pk_sysvid:sysVRefPk},
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
        const that =this;
        let selected = this.props.syncTree.getSelectNode(memberSortTreeId);
        let code = selected.innercode;
        let pk_system = this.props.syncTree.getSelectNode('systemTree').id;
        let pk_member = selected.id;
        let statpk;
        if(!selected){
            /* 国际化处理： 请选择要操作的数据！*/
            toast({content : this.state.json['10100RSSB-000017'],color : 'warning'});
            return;
        }
        ajax({
            url:ajaxUrl.statmemberSortQryUrl,
            method:"post",
            data:{pk_rms:pk_system,pk_svid:sysVRefPk,code:code},
            success:(res)=>{
                if(res.success){
                    let statpk = res.data;
                    ajax({//组织结构_报表组织体系成员
                        url:ajaxUrl.statMemberSetOrderUrl,
                        method:"post",
                        data:{pk_member:statpk,orderType:orderType,pk_svid:sysVRefPk,pk_sysvid:sysVRefPk,code:code},
                        success:(res)=>{
                            if(res.success){
                                ajax({//组织结构_报表组织统计成员
                                    url:ajaxUrl.memberSetOrderUrl,
                                    method:"post",
                                    data:{pk_member:pk_member,orderType:orderType,pk_sysvid:sysVRefPk},
                                    success:(res)=>{
                                        if(res.success){
                                            //转换树的父子关系
                                            let treeData = this.dealTreeData(res.data);
                                            // this.setSyncTreeData(memberSortTreeId, []);
                                            this.props.syncTree.setSyncTreeData(memberSortTreeId, treeData);
                                            this.props.syncTree.setNodeSelected(memberSortTreeId,selected.id);
                                            isSort = true;
                                            //重现查一下右树
                                            that.onLoadMemberDatas(pk_system);
                                            // setTimeout(() =>  this.props.modal.show(memberSortModalId) ,100);
                                            // //设置默认中第一行
                                            // this.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                                            // if(res.data[0].refpk!=='root'){
                                            //     this.onSelectEve( res.data[0].refpk,null,true);
                                            // }
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
        // let pk_member = selected.id;
        // ajax({//组织结构_报表组织统计成员
        //     url:ajaxUrl.memberSetOrderUrl,
        //     method:"post",
        //     data:{pk_member:pk_member,orderType:orderType,pk_sysvid:sysVRefPk},
        //     success:(res)=>{
        //         if(res.success){
        //             //转换树的父子关系
        //             let treeData = this.dealTreeData(res.data);
        //             // this.setSyncTreeData(memberSortTreeId, []);
        //             this.props.syncTree.setSyncTreeData(memberSortTreeId, treeData);
        //             this.props.syncTree.setNodeSelected(memberSortTreeId,selected.id);
        //             isSort = true;
        //             //重现查一下右树
        //             that.onLoadMemberDatas(pk_system);
        //             // setTimeout(() =>  this.props.modal.show(memberSortModalId) ,100);
        //             // //设置默认中第一行
        //             // this.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
        //             // if(res.data[0].refpk!=='root'){
        //             //     this.onSelectEve( res.data[0].refpk,null,true);
        //             // }
        //         }
        //     }
        // });

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
     * 体系成员搜索框
     * @param {*} value 
     */
    onSearch(value){
        this.setState({ searchValue:value });
        this.props.treeTableManyCol.searchTreeTable({ moduleId: 'memberTreeTable', 
            searchValue: value, filters: ['code','name'], expanded: true, defaultExpandAllRows: false})
    }
    render() {
        const {button, syncTree, modal,DragWidthCom,treeTable,treeTableManyCol,editTable,BillHeadInfo } = this.props;
        const {createButton} = button;
        const { createButtonApp } = button;
        const { createTreeTable } = treeTable;
        const { createEditTable } = editTable;
        let { treeTableCol } = treeTableManyCol;
        let {createSyncTree} = syncTree;
        let { createModal } = modal;
        const {createBillHeadInfo} = BillHeadInfo;
        return (
            <div className="nc-bill-tree-table">
                {createModal('warning',{
                     title:this.state.json['10100RSSB-000018'],/* 国际化处理： 关闭提醒*/
                     content:this.state.json['10100RSSB-000019'],/* 国际化处理： 是否确定要关闭？*/
                })}
                {/*体系 编辑模态框*/}
                { this.state.json['10100RSSB-000020']&&createModal(sysModalId,{
                    title:this.state.json['10100RSSB-000020'],/* 国际化处理： 报表组织体系*/
                    content:this.props.form.createForm(formId),
                    userControl:true,//自己控制什么时候关闭窗口
                    closeModalEve:()=>{
                        this.props.form.setFormStatus(formId,'browse');
                    },
                    beSureBtnClick:this.onSaveSys.bind(this),
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        // this.props.modal.show('warning',{
                        //     beSureBtnClick:()=>{
                        //         this.props.modal.close(sysModalId);
                        //         this.props.modal.close('warning');
                        //     }
                        // });
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title:this.state.json['10100RSSB-000021'],/* 国际化处理： 确认取消*/
                            content:this.state.json['10100RSSB-000022'],/* 国际化处理： 是否确认要取消？*/
                            beSureBtnClick:()=>{
                                this.toggleShow();
                                // this.windowCloseListener('browse');
                                this.props.form.setFormStatus(formId,'browse');
                                this.props.modal.close(sysModalId);
                            }
                        })
                    }
                }) }
                 {/*体系 删除模态框*/}
                {this.state.json['10100RSSB-000023']&&createModal(sysModalDelId,{
                     title:this.state.json['10100RSSB-000023'],/* 国际化处理： 删除提醒*/
                     content:this.state.json['10100RSSB-000024'],/* 国际化处理： 确定要删除数据吗？*/
                     userControl:true,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.onDeleteSys.bind(this),
                     cancelBtnClick: ()=>{this.props.modal.close(sysModalDelId)}
                })}
                 {/*体系成员- 编辑模态框*/}
                 { this.state.json['10100RSSB-000025']&&createModal(memberEditModalId,{
                    title:this.state.json['10100RSSB-000025'],/* 国际化处理： 报表组织体系成员管理*/
                    content:function(){
                        return(
                            <div>
                                <div>
                                     {this.props.form.createForm(memberFormId)}
                                     <div>
                                        {/* <hr/>组织信息 */}
                                        {this.state.json['10100RSSB-000046']}：{/* 国际化处理： 组织信息*/}
                                     </div>
                                     {this.props.form.createForm(reportOrgFormId)}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onSaveMember.bind(this),
                    closeModalEve:()=>{
                        this.props.form.setFormStatus(memberFormId,'browse');
                        this.props.form.setFormStatus(reportOrgFormId,'browse');
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
                            title:this.state.json['10100RSSB-000021'],/* 国际化处理： 确认取消*/
                            content:this.state.json['10100RSSB-000022'],/* 国际化处理： 是否确认要取消？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(memberEditModalId);
                                this.windowCloseListener('browse');
                                this.props.form.setFormStatus(memberFormId,'browse');
                                this.props.form.setFormStatus(reportOrgFormId,'browse');
                            }
                        })
                    }
                }) }

                {/*引入操作模态框*/}
                {this.state.json['10100RSSB-000026']&& createModal(importModalId,{
                    title:this.state.json['10100RSSB-000026'],/* 国际化处理： 请选择要引入的组织*/
                    content:this.getImportDialog.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onImportSave.bind(this),
                    cancelBtnClick: ()=>{
                        this.props.modal.close(importModalId);
                        this.windowCloseListener('browse');
                    }
                }) }
                
                {/* 版本化模态框 */}
                { this.state.json['10100RSSB-000027']&&createModal(sysVersionModalId,{
                    title:this.state.json['10100RSSB-000027'],/* 国际化处理： 报表组织体系版本化*/
                    //content:this.props.editTable.createEditTable(sysVersionModalId),
                    content:function(){
                        return (
                            <div>
                                <div className="table-area">
                                    {/* 体系版本按钮区  btn-group */}
                                    <div className="btn-group" style={{marginBottom: 5,marginTop: -10,display:'flex',flexDirection:'row-reverse'}}>
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
                    noFooter : true,//不显示底部的确定、取消按钮
                    beSureBtnClick:this.onVersionSave.bind(this),
                    closeModalEve:()=>{
                        this.onSysVersionStatusChange('browse');
                    },
                    cancelBtnClick: ()=>{
                        if(sysVersionStatus === 'browse'){
                            this.props.modal.close(sysVersionModalId);
                            this.windowCloseListener('browse');
                            this.onSysVersionStatusChange('browse');
                        }else{
                            promptBox({
                                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title:this.state.json['10100RSSB-000021'],/* 国际化处理： 确认取消*/
                                content:this.state.json['10100RSSB-000022'],/* 国际化处理： 是否确认要取消？*/
                                beSureBtnClick:()=>{
                                    this.props.modal.close(sysVersionModalId);
                                    this.windowCloseListener('browse');
                                    this.onSysVersionStatusChange('browse');
                                }
                            })
                        }
                    }
                }) }
                {/*体系版本删除提示框*/}
                { this.state.json['10100RSSB-000012']&&createModal(sysVersionDeleteModalId,{
                    title:this.state.json['10100RSSB-000012'],/* 国际化处理： 删除确认*/
                    content:this.state.json['10100RSSB-000013'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续删除？*/
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onSuerDeleteSysVersion.bind(this),
                    cancelBtnClick: ()=>{this.props.modal.close(sysVersionDeleteModalId)}
                }) }

                {/*资金管理体系成员- 结构调整模态框*/}
                { this.state.json['10100RSSB-000032']&&createModal(memberSortModalId,{
                    title:this.state.json['10100RSSB-000032'],/* 国际化处理： 结构调整*/
                    content:function(){
                        return(
                            <div class="ncc-hr-contain">
                                <div class="ncc-hr-left-tree nc-theme-transfer-wrap-bgc nc-theme-gray-area-bgc">
                                    <div class="ncc-hr-padding nc-theme-transfer-wrap-bgc">
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
                                <div class="ncc-hr-padding nc-theme-transfer-wrap-bgc">
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton  fieldid = 'upTop'  onClick= {this.setOrder.bind(this,'upTop')}>{this.state.json['10100RSSB-000047']}</NCButton>{/* 国际化处理： 置于顶层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton  fieldid = 'upOne' onClick= {this.setOrder.bind(this,'upOne')}>{this.state.json['10100RSSB-000048']}</NCButton>{/* 国际化处理： 向上一层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton  fieldid = 'downOne' onClick= {this.setOrder.bind(this,'downOne')}>{this.state.json['10100RSSB-000049']}</NCButton>{/* 国际化处理： 向下一层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton  fieldid = 'downBottom' onClick= {this.setOrder.bind(this,'downBottom')}>{this.state.json['10100RSSB-000050']}</NCButton>{/* 国际化处理： 置于底层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid = 'upgrade'  onClick= {this.setOrder.bind(this,'upgrade')}>{this.state.json['10100RSSB-000051']}</NCButton>{/* 国际化处理： 升级*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'10px'}}>
                                        <NCButton  fieldid = 'degrade' onClick= {this.setOrder.bind(this,'degrade')}>{this.state.json['10100RSSB-000052']}</NCButton>{/* 国际化处理： 降级*/}
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
                    cancelBtnClick:()=>{
                        this.props.modal.close(memberSortModalId);
                        if(isSort){
                            let pk = this.props.syncTree.getSelectNode(leftTree).id;
                            this.onSelectEve(pk,null,true);
                        }
                        this.windowCloseListener('browse');
                    }
                    // size:'sm'//模态框大小 sm/lg/xlg
                }) }

                {/* 标题 title */}
                <NCDiv  areaCode={NCDiv.config.HEADER}  className="header">
                    {/*页面大图标*/}
                    {/* {createPageIcon()} */}
                    {/* <h2 className="title">{this.props.appCode === '10100RSSB'?this.state.json['10100RSSB-000054']:this.state.json['10100RSSB-000055']}</h2> */}
                    {createBillHeadInfo({
                        title:this.props.appCode === '10100RSSB'?this.state.json['10100RSSB-000054']:this.state.json['10100RSSB-000055']/* 国际化处理： 报表组织体系-全局-集团*/,
                        initShowBackBtn:false
                    })}
                    <span className="showOff">
                        <NCCheckbox
                            onChange = {this.onCheckShowDisable.bind(this)}
                            checked = {isShowDisable}
                        >
                            {this.state.json['10100RSSB-000041']}{/* 国际化处理： 显示停用*/}
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
                <div className="tree-table uapbd-reports-table">
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
                                     onMouseEnterEve:this.onMouseEnterEve.bind(this),//鼠标滑过节点事件
                                     showModal:false
                                })}
                            </div>
                        } 
                        //资金管理体系成员---树状表
                        rightDom = {
                            
                            <div className="treeTableCol">
                                <div className="version-head">
                                    {/* <Row style={{marginBottom:'5px',marginTop:'5px'}}> */}
                                    <div style={{marginBottom: 10,marginTop: 10}}>
										<Row>
											<Col md={1} xs={1} sm={1}>
												<div style={{height: 30,lineHeight: '30px',marginLeft: 15,marginRight: -30,width: 210,color:'#BDBDBD'}}>{this.state.json['10100RSSB-000053']}：</div>{/* 国际化处理： 体系版本*/}
											</Col>
											<Col md={2} xs={2} sm={2}>
												{ReportManaStruMultiVersionGridRef({}=this.createCfg("ReportManaStruMultiVersionGridRef",{
                                                     disabled: !this.state.vRefEnable,
                                                     value:{refpk:sysVRefPk,
														refname:sysRefName
                                                    },
                                                    fieldid : 'ReportManaStruMultiVersionRef',
													 queryCondition: function(){
														return {
															//此处可以添加参数
															// isShowDisabledData: true,
															pk_reportmanastru: this.props.syncTree.getSelectNode(leftTree).id
														};
													}.bind(this)
												}))}
											</Col>
                                            <Col md={2} xs={2} sm={2}>
                                            <NCDiv areaCode={NCDiv.config.SEARCH}> 
                                                <NCFormControl
                                                    placeholder={this.state.json['10100RSSB-000058'] }
                                                    value={this.state.searchValue}
                                                    onChange={this.onSearch.bind(this)}
                                                    fieldid="search"
                                                    type="search"
                                                    // disabled={this.state.searchDisable}
                                                />
                                                </NCDiv>
                                            </Col>
											<Col md={9} xs={9} sm={9}></Col>
										</Row>
									</div>
                                    {/* <Row> */}
                                        { treeTableCol( rightTreeTable,{
                                            expandEve: this.expandEve.bind(this),//异步执行，点击加号展开子节点
                                            collapandEve:this.collapandEve.bind(this),//异步执行，点击加号收起子节点
                                            async:false,    //数据同步加载为false,异步加载为true
                                            defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                            showCheckBox:true,       // 是否显示复选框 ,默认false不显示
                                            checkedType:'radio'      // 勾选方式，单选radio,多选 checkbox； 默认多选
                                       } ) }
                                    {/* </Row> */}
                                 </div>
                            </div>
                        }  
                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百 
                        leftMinWid = '300px'
                    />
                </div>
                <PrintOutput
					ref='printOutput'
					url={ajaxUrl.printUrl}
					data={{
						funcode:this.props.appCode,      //功能节点编码，即模板编码
						nodekey:'reportmanastruprint',     //模板节点标识
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
            },
            {
                moduleId: "10100RSSB",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData;
                    orgTypeName = this.state.json['10100RSSB-000000'];
                }
                if(data){

                    let meta = data.template;
                    templateCode = meta.code;
                    console.log(meta);
                    meta = this.modifierMeta(props, meta)
                    props.meta.setMeta(meta,()=>{
                        // this.initAllDatas(false,false);
                    });
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delline',this.state.json['10100RSSB-000024']) /*'确认要删除该条吗？' 设置操作列上删除按钮的弹窗提示 */
                    }
                }
            }
        );
    }
    tableButtonClick=(props, id, text, record, index)=>{
        let pk = record.values.pk_rmsmember.value;
        let pk_vid = record.values.pk_vid.value;
        switch(id){
            case 'Editline':
                memberSaveType = 'edit';
                ajax({
                    url:ajaxUrl.memberQueryByPkUrl,  
                    data: {pk_member:pk,nodeType:props.nodeType},
                    success: (res) => {
                        if (res.success) {
                            let headData = res.data.memberForm.memberForm.rows[0].values;
                            let pk_svid = headData.pk_svid.value;
                            let meta = props.meta.getMeta();
                            meta[memberFormId].items.map((obj)=>{
                                if(obj.attrcode == 'pk_fathermember'){
                                    obj.queryCondition = function () {
                                        return {
                                            "pk_svid": sysVRefPk
                                        }
                                    }
                                };
                            })
                            props.modal.show(memberEditModalId);
                            props.form.setFormStatus(memberFormId,'edit');
                            props.form.EmptyAllFormValue(memberFormId);
                            props.form.EmptyAllFormValue(reportOrgFormId);
                            console.log(res.data)
                            let cardData = {rows:res.data.memberForm.memberForm.rows};
                            let cardvalue = {'memberForm':cardData}
                            props.form.setAllFormValue(cardvalue);
                            var orgForm = res.data.orgForm;
                            if(orgForm){
                                let orgData = {rows:res.data.orgForm.reportorg_form.rows};
                                let orgvalue = {'reportorg_form':orgData}
                                props.form.setAllFormValue(orgvalue);
                                if(res.data.ismanageorg){
                                    props.form.setFormStatus(reportOrgFormId,'edit');
                                }else{
                                    props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                                    props.form.setFormStatus(reportOrgFormId,'browse');
                                }
                            }else{
                                props.form.setFormStatus(reportOrgFormId,'browse');
                            }
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
                    data: {pk_member:pk,ts:record.values.ts.value,pk_vid:pk_vid},
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', title: this.state.json['10100RSSB-000003'] });/* 国际化处理： 删除成功！*/
                            props.treeTableManyCol.delRowByPk(rightTreeTable,record);
                        }
                    }
                });
                break;
            default:
                break;
    
        }
    }
    modifierMeta=(props, meta) =>{
        // meta[memberFormId].items.map((obj)=>{
        //     if(obj.attrcode == 'pk_fathermember'){
        //         obj.refcode = 'uapbd/refer/orgv/ReportManaStruMemberVersionTreeRef/index.js';
        //         obj.refname = '报表组织体系成员多版本';
        //     };
        // });
        meta[formId].items.map((obj)=>{
            if(obj.attrcode === 'busiattr'){
                obj.queryCondition = function () {
                    return {
                        "pk_defdoclist": pk_defdoclist
                    }
                }
            }
        });
        //树表添加操作列
        meta[rightTreeTable].items.push({
            attrcode: 'opr',
            label: this.state.json['10100RSSB-000040'],/* 国际化处理： 操作*/
            width: 200,
            visible: true,
            itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
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