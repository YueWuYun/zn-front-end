//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,toast ,print ,high,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
let { NCCol:Col, NCRow:Row,NCFormControl } =base;
const {PrintOutput}=high;
const {NCDatePicker, NCButton ,NCPanel,NCCheckbox,NCPopconfirm,NCRadio } = base;
import './index.less';
import createUIDom from '../../../public/utils/BDCreateUIDom';
const { NCDiv } = base;

/**
 * 穿梭框--导入使用
 */
import Transfer from '../../../public/excomponents/Transfer';

//集团(所有）参照
// import GroupDefaultTreeRef from '../../../refer/org/GroupDefaultTreeRef/index'
//集团参照
import GroupDefaultTreeRef from '../../../../uap/refer/riart/groupTreeRef/index'
import { debug } from 'util';
import Utils from '../../../public/utils';

let leftTree = 'systemTree';//体系--左树id
let rightTreeTable = 'memberTreeTable'//成员--右树表id
let formId = 'sysForm';//体系--编辑formid
let sysModalId = 'sysModal';//体系编辑模态窗id
let sysModalDelId = 'sysDelete';//体系删除模态窗id
let deleteTreeNode = '';//左树删除选择
let memberFormId = 'memberForm';//成员--编辑id
let memberEditModalId = 'memberModal';//成员--编辑模态窗id
let sysSaveType = 'add';//add--新增  edit--修改  copy--复制
let importModalId = 'importModalId';//引入对话框id
let memberSortModalId = 'memberSortModal';//结构调整模态框id
let memberSortTreeId = 'memberSortTree';//结构调整--树id
let orgFormId = 'orgForm';//成员组织信息模板id
let pk_importGroup = '';//引入对话框的集团参照的主键
let groupname = '';
let showDisableOrg = false;//引入对话框是否显示停用的组织
let isShowDisable = false;

let memberSaveType = 'edit';

let l2rBefor = true;//引用对话框选中校验

let isSort = false;//结构不是被调整过，用来判断是不是需要刷新数据

let templateCode = '10100ASST_list';//动态加载模板，及显示公式
/**
 * pagecode 配置
 */

 let pageCode = {
    mainPageCode: "10100ASSET_list",
    sysFormPageCode:'10100ASSET_card_sys',
    memberFomPageCode : '10100FMSB_card',
    orgFormPageCode:'10100RCSB_reportorg'

 }

 
let config = {
    nodeType: 'GROPE_NODE',
    appId:'0001Z010000000001D4L',
    appCode:'10100ASSET'
}

const tableBtnAry = ["Editline","Delline"];		//树表列操作按钮

/**
 * ajaxurl 配置
 */
let ajaxUrl={
    initUrl:'/nccloud/platform/templet/querypage.do',
    sysLoadUrl:"/nccloud/uapbd/org/AssetStatStruQueryAction.do",
    sysDeleteUrl:"/nccloud/uapbd/org/AssetStatStruDeleteAction.do",
    sysEnableUrl:"/nccloud/uapbd/org/AssetStatStruEnableAction.do",
    sysDisableUrl:"/nccloud/uapbd/org/AssetStatStruDisableAction.do",
    sysQueryByPkUrl:"/nccloud/uapbd/org/AssetStatStruQueryByPkAction.do",
    sysSaveUrl:"/nccloud/uapbd/org/AssetStatStruSaveAction.do",
    sysCopySaveUrl:'/nccloud/uapbd/org/AssetStatStruCopySaveAction.do',
    memberLoadUrl:"/nccloud/uapbd/org/AssetStatStruMemberQueryActon.do",
    memberSaveUrl:"/nccloud/uapbd/org/AssetStatStruMemberSaveAction.do",
    memberQueryByPkUrl:"/nccloud/uapbd/org/AssetStatStruMemberQueryByPk.do",
    memberDeleteUrl:"/nccloud/uapbd/org/AssetStatStruMemberDeleteAction.do",
    memberAddUrl:"/nccloud/uapbd/org/AssetStatStruMemberAddAction.do",
    importDataQryUrl:"/nccloud/uapbd/org/AssetStatStruMemberImportQueryAction.do",
    importSaveUrl:"/nccloud/uapbd/org/AssetStatStruMemberImportSaveAction.do",
    memberSortQryUrl:"/nccloud/uapbd/org/AssetStatStruMemberSortQueryAction.do",
    memberSetOrderUrl:"/nccloud/uapbd/org/AssetStatStruMemberSetOrderAction.do",
    printUrl:"/nccloud/uapbd/org/AssetStatStruPrintAction.do"
}

/**
 * 资产统计体系
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
            oprType:'0',
            // importDataValue:{},
            importLeftTreeData:[],
            importRightTreeData:[],
            refs: {},
            pks:[],
            json:{}	,
            expandKeys:[],
            searchValue:''
        }
        this.initTemplate(props);
    }

    componentDidMount () {
        //加载左树 默认不加载停用数据
        this.loadLeftTreeData.call(this,isShowDisable);
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

    //加载左树数据
    loadLeftTreeData(showDisable,isRefreshAction=false){
        ajax({
            url:ajaxUrl.sysLoadUrl,
            method:"post",
            data:{showDisable:isShowDisable,nodeType:this.props.nodeType},
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
                        toast({ color: 'success', title: this.state.json['10100ASSET-000001'] });/* 国际化处理： 刷新成功！*/
                    }
                    this.setState({ searchValue:'' });
                    this.toggleShow();
                }
            }
        });
        // this.toggleShow();
    }
     
     /**
     * 删除提示
     */
    onDeleteSysEve(selectedTreeNode){
        deleteTreeNode = selectedTreeNode;
        // this.props.modal.show(sysModalDelId);
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title:  this.state.json['10100ASSET-000018'],
            content:this.state.json['10100ASSET-000002'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
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
                toast({ color: 'success', title: that.state.json['10100ASSET-000003'] });/* 国际化处理： 删除成功！*/
				//删除后刷新按钮
                //that.loadLeftTreeData.call(that,isShowDisable);
                that.toggleShow();            }
        });
    }
    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve (data, item, isChange) {
        // if(isChange){
            //加载成员树表
            let that = this;
            ajax({
                url:ajaxUrl.memberLoadUrl,
                method:"post",
                data:{pk_system: data},
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
                            // let datas =  that.props.treeTableManyCol.createNewData({rows: []});
                            // that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk')
                            that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                        }
                        that.setState({ searchValue:'' });
                    }
                }
            });
            
        // }
        pk_importGroup = this.props.syncTree.getSelectNode(leftTree).nodeData.pk_group;
        groupname = this.props.syncTree.getSelectNode(leftTree).nodeData.groupname;
        this.toggleShow();
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
        //设置左树可操作
        this.props.syncTree.setTreeEdit(leftTree,true);
        this.props.button.setMainButton('Add',true);
        
        let allData = this.props.syncTree.getSyncTreeValue(leftTree);
        if(!allData||allData.length === 0){//左树无数据时只有新增和刷新可用
            this.props.button.setButtonDisabled(['Copy','Enable','Disable','Import','AddVirtual','SortManage','Print','Output'],true);
            return;
        }else{
            this.props.button.setButtonDisabled(['Print','Output'],false);
        }
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        if(selectNode){//更新停用启用按钮
            if('root' === selectNode.id){
                this.props.button.setButtonDisabled(['Copy','Enable','Disable','Import','AddVirtual','SortManage'],true);
            }else{
                this.props.button.setButtonDisabled(['Copy','Enable','Disable','Import','AddVirtual','SortManage'],false);
            }
            let enablestate = selectNode.nodeData.enablestate;
            if(enablestate ==='2'){//启用状态
                // this.props.button.setButtonsVisible({
                //     btnDisable:true,
                //     btnEnable:false,
                // });
                this.props.button.setButtonDisabled(['Enable'],true);
                this.props.button.setButtonDisabled(['Disable'],false);
            }else{
                // this.props.button.setButtonsVisible({
                //     btnDisable:false,
                //     btnEnable:true,
                // });
                this.props.button.setButtonDisabled(['Enable'],false);
                this.props.button.setButtonDisabled(['Disable'],true);
            }
        }else{//左树没有数据，则只有新增按钮可用
            this.props.button.setButtonDisabled(['Copy','Enable','Disable','Import','AddVirtual','SortManage','Print','Output'],true);
        }
    }
    onMouseEnterEve( key ) {
        if(key === this.state.json['10100ASSET-000004']){/* 国际化处理： 体系--全局*/
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
        isShowDisable = !isShowDisable
        this.loadLeftTreeData.call(this,isShowDisable);
    }
    //新增 -- 体系
    onAdd(){
        sysSaveType = 'add';
        this.openSysModal('');
    }
    //复制
    onCopy(){
        sysSaveType = 'copy';
        if(!this.props.syncTree.getSelectNode(leftTree)) return;
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
                    that.props.button.setButtonDisabled(['Enable'],true);
                    that.props.button.setButtonDisabled(['Disable'],false);
                    toast({ color: 'success', title: that.state.json['10100ASSET-000044'] });/* 国际化处理： 启用成功！*/
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
                    debugger
                    //更新树节点
                    let treeData = that.dealTreeData(res.data);
                    that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    // that.toggleShow();
                    that.props.button.setButtonDisabled(['Enable'],false);
                    that.props.button.setButtonDisabled(['Disable'],true);
                    toast({ color: 'success', title: that.state.json['10100ASSET-000045'] });/* 国际化处理： 停用成功！*/
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
                    // that.props.form.setAllFormValue(res.data);
                    let cardData = {rows:res.data.sysForm.rows};
                    let cardvalue = {'sysForm':cardData}
                    Utils.filterEmptyData(cardvalue.sysForm.rows[0].values);
                    that.props.form.setAllFormValue(cardvalue);
                    //弹出体系编辑窗口
                     that.props.modal.show(sysModalId);
                     that.windowCloseListener('add');
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
        let validateData = {"model" :formdata,"pageid" :pageCode.mainPageCode};
        this.props.validateToSave( validateData ,()=>{
            this.systemSave(formdata)
            }, { 'sysForm': 'form' },'form');
    }

    systemSave(formdata){
        let requestParam = {
            model: formdata,
            pageid: pageCode.sysFormPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
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
                    // let treeData = that.dealTreeData(res.data);
                    // if(sysSaveType==='add'||sysSaveType==='copy'){//新增树节点
                    //     that.props.syncTree.addNodeSuccess(leftTree,treeData);
                    // }else{//修改树节点
                    //     that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    // }
                    that.loadLeftTreeData(isShowDisable);
                    toast({ color: 'success', title: that.state.json['10100ASSET-000005'] });/* 国际化处理： 保存成功！*/
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
    //体系编辑事件
    onEditMember(id,text, record, index){
        memberSaveType = 'edit';
        ajax({
            url:ajaxUrl.memberQueryByPkUrl,  
            data: {pk_member:record.key},
            success: (res) => {
                if (res.success) {
                    this.props.modal.show(memberEditModalId);
                    this.props.form.setFormStatus(memberFormId,'edit');

                    this.props.form.EmptyAllFormValue(memberFormId);
                    this.props.form.EmptyAllFormValue(orgFormId);
                    // this.props.form.setAllFormValue(res.data.memberForm);
                    // this.props.form.setAllFormValue(res.data.orgForm);
                    let cardData = {rows:res.data.memberForm.memberForm.rows};
                    let cardvalue = {'memberForm':cardData}
                    this.props.form.setAllFormValue(cardvalue);

                    let orgData = {rows:res.data.orgForm.orgForm.rows};
                    let orgvalue = {'orgForm':orgData}
                    this.props.form.setAllFormValue(orgvalue);
                    if(res.data.ismanageorg){
                        this.props.form.setFormStatus(orgFormId,'edit');
                    }else{
                        // this.props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                        this.props.form.setFormStatus(orgFormId,'browse');
                    }
                    this.windowCloseListener('add');
                }
            }
        });
    }
     //成员新增虚节点
     onAddMember(){
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            toast({ color: 'warning', content: this.state.json['10100ASSET-000006'] });/* 国际化处理： 保存成功！*/
            return;
        }

         //获取选中的成员作为引入数据的根节点
         let pk_fmsmember = '';
         let pk_membeorg = '';
        if(selectMember&&selectMember.length>0){
             pk_fmsmember = selectMember[0].rowId;
             pk_membeorg = selectMember[0].values.pk_org.value;
         }

        memberSaveType = 'add';
        let pk_system = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.memberAddUrl,
            data:{pk_system:pk_system,pk_member:pk_fmsmember,pk_membeorg:pk_membeorg},
            success: (res) => {
                if (res.success) {
                    let headData = res.data.memberForm.memberForm.rows[0].values;
                    let pk_ass = headData.pk_ass.value;
                    let meta = this.props.meta.getMeta();
                    meta[memberFormId].items.map((obj)=>{
                        if(obj.attrcode == 'pk_fathermember'){
                            this.props.renderItem('form',memberFormId, 'pk_fathermember', null);
                            obj.queryCondition = function () {
                                return {
                                    "pk_ass":pk_ass 
                                }
                            }
                        }
                    })
                    
                    this.props.form.EmptyAllFormValue(memberFormId);
                    this.props.form.EmptyAllFormValue(orgFormId);
                    this.props.form.setFormStatus(memberFormId,'add');
                    this.props.form.setFormStatus(orgFormId,'add');

                    let cardData = {rows:res.data.memberForm.memberForm.rows};
                    let cardvalue = {'memberForm':cardData}
                    Utils.filterEmptyData(cardvalue.memberForm.rows[0].values);
                    this.props.form.setAllFormValue(cardvalue);

                    let orgData = {rows:res.data.orgForm.orgForm.rows};
                    let orgvalue = {'orgForm':orgData}
                    Utils.filterEmptyData(orgvalue.orgForm.rows[0].values);
                    this.props.form.setAllFormValue(orgvalue);
                    //新增的对应组织不可编辑
                    this.props.form.setFormItemsDisabled(memberFormId,{'pk_org':true})
                    this.props.modal.show(memberEditModalId);
                    this.windowCloseListener('add');

                    // if(res.data.ismanageorg){
                    //     props.form.setFormStatus(reportOrgFormId,'edit');
                    // }else{
                    //     props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                    //     props.form.setFormStatus(reportOrgFormId,'browse');
                    // }
               }
            }
        });

    }
    //成员修改保存
    onSaveMember(){
        let memberFlag = this.props.form.isCheckNow(memberFormId);
        let orgFlae = this.props.form.isCheckNow(orgFormId);
        if(!memberFlag||!orgFlae){
            return;
        }
        let orgdata = this.props.form.getAllFormValue(orgFormId);
         //下面的代码用来验证公式
        orgdata.areacode = orgFormId;
        let validateData = {"model" :orgdata,"pageid" :pageCode.mainPageCode};
        this.props.validateToSave( validateData ,()=>{
            this.memberSaveFun(orgdata)
            }, { orgForm: 'form'} ,'form');
       
    }

    memberSaveFun(orgdata,){
        let formdata = this.props.form.getAllFormValue(memberFormId);
        let requestParam = {
            model: formdata,
            pageid: pageCode.memberFomPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        let orgRequest = {
            model:orgdata,
            pageid:pageCode.orgFormPageCode
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
                     let datas = res.data.memberTreeTable.rows[0];
                    //  //根据树状表的数据构造树表
                    //  if(memberSaveType ==='edit'){
                    //      that.props.treeTableManyCol.editRowEve(rightTreeTable,datas);
                    //  }else{//???????????????????????????
                    //     that.props.treeTableManyCol.addChildRowEve(rightTreeTable,datas,selectMember);
                    //  }
                      //  that.loadLeftTreeData(isShowDisable);//不要刷新所有数据，只刷新右表数据即可
                    let selectNode = that.props.syncTree.getSelectNode(leftTree);
                    that.onSelectEve(selectNode.id,null,true);
                     that.props.modal.close(memberEditModalId);
                     toast({ color: 'success', title: that.state.json['10100ASSET-000005'] });/* 国际化处理： 保存成功！*/
                     that.windowCloseListener('browse')
                }
            }
        });
    }

    onImportClick(){
        //校验成员只能有一个根节点
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            toast({content : this.state.json['10100ASSET-000006'],color : 'warning'});/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
            return;
        }
        this.onImportDataLoad.call(this,false);
         //弹出引入窗口
        // this.props.modal.show(importModalId);
    }

    //引入时是否显示停用的组织
    onShowDisableOrg(checked){
        showDisableOrg = !showDisableOrg;
        this.onImportDataLoad.call(this,showDisableOrg);
    }

    onImportDataLoad(showDisableOrg){
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.importDataQryUrl,
            method:"post",
            data:{pk_group:pk_importGroup,showDisable:showDisableOrg,pk_system:pk,nodeType:that.props.nodeType},
            success:function(res){
                if(res.success){
                    //弹出引入窗口
                    that.props.modal.show(importModalId);
                    that.orgTransfer.setRootTitle( groupname+'-' + that.state.json['10100ASSET-000007'])/* 国际化处理： 资产*/
                    if(res.data){
                        that.orgTransfer.reset(res.data);
                    }else{
                        that.orgTransfer.reset([]);
                    }
                    // that.orgTransfer.setMoveType('0');
                    that.orgTransfer.setMoveType(that.state.oprType);
                }
            }
        });
    }
    //体系成员引入保存
    onImportSave(){
        var orgs = this.orgTransfer.getData();
        if(!(orgs&&orgs.length>0)){
            toast({content : this.state.json['10100ASSET-000008'],color : 'warning'});/* 国际化处理： 您没有选择任何数据！*/
            return;
        }

        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        // let pk_sysvid =this.props.syncTree.getSelectNode(leftTree).nodeData.pk_vid;
        let that = this;

        //获取选中的成员作为引入数据的根节点
        let pk_member = '';
        let pk_membeorg = '';
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if(selectMember&&selectMember.length>0){
            pk_member = selectMember[0].rowId;
            pk_membeorg = selectMember[0].values.pk_org.value;
        }

        ajax({
            url:ajaxUrl.importSaveUrl,
            method:"post",
            data:{orgs,pk_system:pk,pk_member:pk_member,pk_membeorg:pk_membeorg},
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
        var obj={
            value:this.state.refs[id]?this.state.refs[id].value:[],
            onChange:function (val) {
                var temp= Object.assign(this.state.refs[id],{value:val});
                this.setState(Object.assign (this.state.refs,temp));
                if(pk_importGroup!==temp.value.refpk){
                    pk_importGroup = temp.value.refpk;
                    this.onImportClick();
                }
            }.bind(this)
        }
        this.state.refs[id]=obj;
        var result_param= Object.assign(obj, param)
        return result_param;
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

    checkBeforeMove(nodes){
        // let returnResult = true
        nodes.forEach((item,index)=>{
            if(item.nodeData.isMember){
                /* 国际化处理： 在体系中已经存在，请重新选择*/
                toast({content : item.refname + this.state.json['10100ASSET-000009'],color : 'warning'});
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
        return (
			<div id="org_transfer" className="steps-content" style={{height:'450px'}}>
                <Row  style={{marginBottom:'5px'}}>
                    <Col md={4} xs={4} sm={4}>
                        {GroupDefaultTreeRef({}=this.createCfg("GroupDefaultTreeRef",{
                                value:{
                                    fieldid:"groupdefaulttreeref",
                                    refpk:pk_importGroup,
                                    refname:groupname
                                },
                                disabled:true,
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    // isShowDisabledData: true,
                                    // pk_reportcombinestru: this.props.syncTree.getSelectNode(leftTree).id
                                };
                            }.bind(this)
                        }))}
                    </Col>
                    <Col>
                         <NCCheckbox id = 'orgShowDisable' 
                            onChange = {this.onCheckboxChange.bind(this,'orgShowDisable')}
                            checked = {showDisableOrg}
                            >{this.state.json['10100ASSET-000031']}</NCCheckbox>{/* 国际化处理： 显示停用数据*/}
                    </Col>
                </Row>             
                <Transfer 
                     ref={(item)=>{this.orgTransfer = item}} showSearch={true}
                />
                <NCRadio.NCRadioGroup 
                    style={{textAlign:'center',width: '100%'}}
                    name="oprType"
                    selectedValue={this.state.oprType}
                    onChange={this.handleOprTypeChange.bind(this)}>
                    <NCRadio value="0" >{this.state.json['10100ASSET-000032']}</NCRadio>{/* 国际化处理： 包含所有下级*/}
                    <NCRadio value="1" >{this.state.json['10100ASSET-000033']}</NCRadio>{/* 国际化处理： 仅自己*/}
                    <NCRadio value="2" >{this.state.json['10100ASSET-000034']}</NCRadio>{/* 国际化处理： 仅直接下级*/}
                    <NCRadio value="3" >{this.state.json['10100ASSET-000035']}</NCRadio>{/* 国际化处理： 仅末级*/}
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
            data:{pk_system:pk_system},
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
        let selected = this.props.syncTree.getSelectNode(memberSortTreeId)
        if(!selected){
            /* 国际化处理： 请选择要操作的数据！*/
            toast({content : this.state.json['10100ASSET-000010'],color : 'warning'});
            return;
        }
        let pk_member = selected.id;
        ajax({
            url:ajaxUrl.memberSetOrderUrl,
            method:"post",
            data:{pk_member:pk_member,orderType:orderType},
            success:(res)=>{
                if(res.success){
                    //转换树的父子关系
                    let treeData = this.dealTreeData(res.data);
                    this.setSyncTreeData(memberSortTreeId, treeData);
                    this.props.modal.show(memberSortModalId);
                    // //设置默认中第一行
                    this.props.syncTree.setNodeSelected(memberSortTreeId,selected.id);
                    // if(res.data[0].refpk!=='root'){
                    //     this.onSelectEve( res.data[0].refpk,null,true);
                    // }
                    isSort = true;
                }
            }
        });
    }

    onClickButton(props, id){
        switch (id) {
            case 'Add':
                this.onAdd();
                break;
            case 'Copy':
                this.onCopy();
                break;	
            case 'Enable':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100ASSET-000011'],/* 国际化处理： 提示*/
                    content:this.state.json['10100ASSET-000012'],/* 国际化处理： 确定要启用该数据吗？*/
                    beSureBtnClick:()=>{this.onEnable()}
                })
                // this.onEnable();
                break;
            case 'Disable':
                // this.onDisable();
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100ASSET-000011'],/* 国际化处理： 提示*/
                    content:this.state.json['10100ASSET-000013'],/* 国际化处理： 确定要停用该数据吗？*/
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
                        funcode: config.appCode,      //功能节点编码，即模板编码
                        nodekey:'assprinttem',     //模板节点标识(NC段默认模板配置)
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
                 },this.printOutput.open());	
                // print(
                //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                //     ajaxUrl.printUrl, 
                //     {
                //         //billtype:'',  //单据类型
                //         funcode: config.appCode,      //功能节点编码，即模板编码
                //         //nodekey:'',     //模板节点标识
                //         // nodekey:'assprinttem',     //模板节点标识(NC段默认模板配置)
                //         outputType:'output',
                //         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                //     }
                // );
                break;
            case 'Refresh':
                 this.loadLeftTreeData.call(this,isShowDisable,true);
                 break;
            default:
                break;
        }
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
                {createModal('warning',{
                     title:this.state.json['10100ASSET-000014'],/* 国际化处理： 关闭提醒*/
                     content:this.state.json['10100ASSET-000015'],/* 国际化处理： 是否确定要关闭？*/
                })}
                {/*体系 编辑模态框   this.state.json['10100ASSET-000000'] 放到 createModal 前面是因为创建模态框的时候多语还没有加载，导致模态框没有标题，放到前面作用是没有多语则不加载模态框*/}
                { this.state.json['10100ASSET-000000']&&createModal(sysModalId,{
                    title:this.state.json['10100ASSET-000000'],/* 国际化处理： 资产统计体系*/
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
                            title:this.state.json['10100ASSET-000016'],/* 国际化处理： 确认取消*/
                            content:this.state.json['10100ASSET-000017'],/* 国际化处理： 是否确认要取消？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(sysModalId);
                                this.toggleShow();
                                this.windowCloseListener('browse')
                            }
                        })
                    }
                }) }
                 {/*体系 删除模态框*/}
                {this.state.json['10100ASSET-000018']&&createModal(sysModalDelId,{
                     title:this.state.json['10100ASSET-000018'],/* 国际化处理： 删除提醒*/
                     content:this.state.json['10100ASSET-000019'],/* 国际化处理： 确定要删除数据吗？*/
                     userControl:true,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.onDeleteSys.bind(this),
                     cancelBtnClick: ()=>{this.props.modal.close(sysModalDelId)}
                })}
                 {/*体系成员- 编辑模态框*/}
                 { this.state.json['10100ASSET-000020']&&createModal(memberEditModalId,{
                    title:this.state.json['10100ASSET-000020'],/* 国际化处理： 资产统计体系成员*/
                    content:function(){
                        return(
                            <div>
                                <div>
                                     {this.props.form.createForm(memberFormId)}
                                     {/* <div> */}
                                        {/* <hr/> */}
                                        {this.state.json['10100ASSET-000036']}:{/* 国际化处理： 组织信息*/}
                                     {/* </div> */}
                                     {this.props.form.createForm(orgFormId)}
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
                            title:this.state.json['10100ASSET-000016'],/* 国际化处理： 确认取消*/
                            content:this.state.json['10100ASSET-000017'],/* 国际化处理： 是否确认要取消？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(memberEditModalId);
                                this.windowCloseListener('browse')
                            }
                        })
                    }
                }) }

                 {/*体系成员- 引入操作模态框*/}
                 { this.state.json['10100ASSET-000021']&&createModal(importModalId,{
                    title:this.state.json['10100ASSET-000021'],/* 国际化处理： 请选择要引入的组织*/
                    content:this.getImportDialog.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onImportSave.bind(this),
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{
                        this.props.modal.close(importModalId);
                        this.windowCloseListener('browse');
                    }
                }) }

                {/*体系成员- 结构调整模态框*/}
                { this.state.json['10100ASSET-000022']&&createModal(memberSortModalId,{
                    title:this.state.json['10100ASSET-000022'],/* 国际化处理： 结构调整*/
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
                                        <NCButton  fieldid={"assetuptop"}  onClick= {this.setOrder.bind(this,'upTop')}>{this.state.json['10100ASSET-000037']}</NCButton>{/* 国际化处理： 置于顶层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid={"assetupone"} onClick= {this.setOrder.bind(this,'upOne')}>{this.state.json['10100ASSET-000038']}</NCButton>{/* 国际化处理： 向上一层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid={"assetdownone"} onClick= {this.setOrder.bind(this,'downOne')}>{this.state.json['10100ASSET-000039']}</NCButton>{/* 国际化处理： 向下一层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid={"assetdownbottom"} onClick= {this.setOrder.bind(this,'downBottom')}>{this.state.json['10100ASSET-000040']}</NCButton>{/* 国际化处理： 置于底层*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'5px'}}>
                                        <NCButton fieldid={"assetupgrade"} onClick= {this.setOrder.bind(this,'upgrade')}>{this.state.json['10100ASSET-000041']}</NCButton>{/* 国际化处理： 升级*/}
                                    </div>
                                    <div className="opr-botton" style={{marginBottom:'10px'}}>
                                        <NCButton fieldid={"assetdegrade"} onClick= {this.setOrder.bind(this,'degrade')}>{this.state.json['10100ASSET-000042']}</NCButton>{/* 国际化处理： 降级*/}
                                    </div>
                                                                    
                                    </div>
                                </div>
                            </div>
                        )
                    }.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    // beSureBtnClick:this.onImportSave.bind(this)
                    hasCloseBtn:true,
                    noFooter:true,
                    cancelBtnClick: ()=>{
                        this.props.modal.close(memberSortModalId);
                        if(isSort){//关闭模态框时要刷新界面数据
                            let pk = this.props.syncTree.getSelectNode(leftTree).id;
                            this.onSelectEve(pk,null,true);
                        }
                    }
                    // size:'sm'//模态框大小 sm/lg/xlg
                }) }

                {/* 标题 title */}
                <NCDiv  areaCode={NCDiv.config.HEADER}  className="header" >
                    {/*页面大图标*/}
                    {/* {createPageIcon()} */}
                    {/* <h2 className="title"> */}
                    {createBillHeadInfo({
                                title:this.state.json['10100ASSET-000000'],
                                initShowBackBtn:false
                            }	
                            )}                    
                    {/* </h2>国际化处理： 资产统计体系 */}
                    <span className="showOff">
                        <NCCheckbox
                            id='sysShowDisable'
                            onChange = {this.onCheckboxChange.bind(this,'sysShowDisable')}
                            checked = {isShowDisable}
                        >
                            {this.state.json['10100ASSET-000043']}{/* 国际化处理： 显示停用*/}
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
                         //体系树
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                     treeId:leftTree,
                                     showLine:true, 
                                     searchType:"filtration",
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
                        //体系成员---树状表
                        rightDom = {
                            <div className="treeTableCol">
                                {/* 树表搜索 */}
                                <Row style={{marginBottom: 10,marginTop: 10,marginLeft:10}}>
                                    <Col md={2} xs={2} sm={2}>
                                    <NCDiv areaCode={NCDiv.config.SEARCH}>
                                        <NCFormControl
                                            fieldid={"search"}
                                            placeholder={this.state.json['10100ASSET-000046'] }
                                            value={this.state.searchValue}
                                            onChange={this.onSearch.bind(this)}
                                            type="search"
                                            // disabled={this.state.searchDisable}
                                        />
                                        </NCDiv>
                                    </Col>
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
                        }  
                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百 
                    />
                </div>
                <PrintOutput
					ref={(item)=>{this.printOutput = item}}
					url={ajaxUrl.printUrl}
					data={{
						funcode:config.appCode,      //功能节点编码，即模板编码
                        nodekey:'assprinttem',     //模板节点标识(NC段默认模板配置)
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
                pagecode : pageCode.mainPageCode,
                // appid : config.appId
                // appcode:'10100ASSET'
            },
            {
                moduleId: "10100ASSET",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    let meta = data.template;
                    templateCode = meta.code;
                    meta = this.modifierMeta(props, meta);
                    props.meta.setMeta(meta);
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delline',this.state.json['10100ASSET-000029']) /* 10100ASSET-000029-'确认要删除该条吗？ 设置操作列上删除按钮的弹窗提示 */
                    }
                    // callback && callback();
                }
        });
    }

    modifierMeta=(props, meta)=> {
        meta[memberFormId].items.map((obj)=>{
            if(obj.attrcode == 'pk_fathermember'){
                //props.renderItem('form',memberFormId, 'pk_fathermember', null);
                obj.refcode = 'uapbd/refer/org/AssetStatStruMemberTreeRef/index.js';
            }
        });
        //添加操作列
        meta[rightTreeTable].items.push({
            attrcode: 'opr',
            label: this.state.json['10100ASSET-000030'],/* 国际化处理： 操作*/
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

    tableButtonClick=(props, id, text, record, index)=>{
        let pk = record.values.pk_assmember.value;
        switch(id){
            case 'Editline':
            memberSaveType = 'edit';
            ajax({
                url:ajaxUrl.memberQueryByPkUrl,  
                data: {pk_member:pk},
                success: (res) => {
                    if (res.success) {
                        let headData = res.data.memberForm.memberForm.rows[0].values;
                        let pk_ass =  headData.pk_ass.value;
                        let meta = props.meta.getMeta();
                        meta[memberFormId].items.map((obj)=>{
                            if(obj.attrcode == 'pk_fathermember'){
                                props.renderItem('form',memberFormId, 'pk_fathermember', null);
                                obj.queryCondition = function () {
                                    return {
                                        "pk_ass":pk_ass
                                    }
                                }
                            }
                        })
    
                        props.form.setFormStatus(memberFormId,'edit');
                        props.form.EmptyAllFormValue(memberFormId);
                        props.form.EmptyAllFormValue(orgFormId);
                        // props.form.setAllFormValue(res.data.memberForm);
                        // props.form.setAllFormValue(res.data.orgForm);
                        let cardData = {rows:res.data.memberForm.memberForm.rows};
                        let cardvalue = {'memberForm':cardData}
                        props.form.setAllFormValue(cardvalue);
    
                        let orgData = {rows:res.data.orgForm.orgForm.rows};
                        let orgvalue = {'orgForm':orgData}
                        props.form.setAllFormValue(orgvalue);
                        if(res.data.ismanageorg){
                            props.form.setFormStatus(orgFormId,'edit');
                        }else{
                            props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
                            props.form.setFormStatus(orgFormId,'browse');
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
                    data: {pk_member:pk,ts:record.values.ts.value},
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', title: this.state.json['10100ASSET-000003'] });/* 国际化处理： 删除成功！*/
                            props.treeTableManyCol.delRowByPk(rightTreeTable,record);
                        }
                    }
                });
                break;
            default:
                break;
    
        }
    }

}
// //初始化单据模板
// var initTemplate = function(props) {
//     props.createUIDom({
//         pagecode : pageCode.mainPageCode,
//         // appid : config.appId
//         // appcode:'10100ASSET'
//     },
//     (data)=>{
//         let meta = data.template;
//         meta = modifierMeta(props, meta)
//         props.meta.setMeta(meta);
//       if(data.button){
//           props.button.setButtons(data.button);
//           props.button.setPopContent('Delline','确认要删除该条吗？') /* 设置操作列上删除按钮的弹窗提示 */
//       }
//     });
// }

// function tableButtonClick(props, id, text, record, index){
//     let pk = record.values.pk_assmember.value;
// 	switch(id){
//         case 'Editline':
//         memberSaveType = 'edit';
//         ajax({
//             url:ajaxUrl.memberQueryByPkUrl,  
//             data: {pk_member:pk},
//             success: (res) => {
//                 if (res.success) {
//                     let headData = res.data.memberForm.memberForm.rows[0].values;
//                     let pk_ass =  headData.pk_ass.value;
//                     let meta = props.meta.getMeta();
//                     meta[memberFormId].items.map((obj)=>{
//                         if(obj.attrcode == 'pk_fathermember'){
//                             props.renderItem('form',memberFormId, 'pk_fathermember', null);
//                             obj.queryCondition = function () {
//                                 return {
//                                     "pk_ass":pk_ass
//                                 }
//                             }
//                         }
//                     })

//                     props.form.setFormStatus(memberFormId,'edit');
//                     props.form.EmptyAllFormValue(memberFormId);
//                     props.form.EmptyAllFormValue(orgFormId);
//                     // props.form.setAllFormValue(res.data.memberForm);
//                     // props.form.setAllFormValue(res.data.orgForm);
//                     let cardData = {rows:res.data.memberForm.memberForm.rows};
//                     let cardvalue = {'memberForm':cardData}
//                     props.form.setAllFormValue(cardvalue);

//                     let orgData = {rows:res.data.orgForm.orgForm.rows};
//                     let orgvalue = {'orgForm':orgData}
//                     props.form.setAllFormValue(orgvalue);
//                     if(res.data.ismanageorg){
//                         props.form.setFormStatus(orgFormId,'edit');
//                     }else{
//                         props.form.setFormItemsDisabled(memberFormId,{'pk_entityorg':true})
//                         props.form.setFormStatus(orgFormId,'browse');
//                     }
//                     props.modal.show(memberEditModalId);
//                     window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
//                         return '';
//                     };
//                 }
//             }
//         });
// 			break;
// 		case 'Delline':
// 			ajax({
//                 url:ajaxUrl.memberDeleteUrl,  
//                 data: {pk_member:pk,ts:record.values.ts.value},
//                 success: (res) => {
//                     if (res.success) {
//                         toast({ color: 'success', title: '删除成功！' });
//                         props.treeTableManyCol.delRowByPk(rightTreeTable,record);
//                     }
//                 }
// 			});
// 			break;
// 		default:
//             break;

// 	}
// }
// function modifierMeta(props, meta) {
//     meta[memberFormId].items.map((obj)=>{
//         if(obj.attrcode == 'pk_fathermember'){
//             //props.renderItem('form',memberFormId, 'pk_fathermember', null);
//             obj.refcode = 'uapbd/refer/org/AssetStatStruMemberTreeRef/index.js';
//         }
//     });
//     //添加操作列
//     meta[rightTreeTable].items.push({
//         attrcode: 'opr',
//         label: '操作',
//         itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
//         className: 'table-opr' ,
//         width: 200,
//         fixed:'right',
//         visible: true,
//         render: (text, record, index) => {
//             return (
//                 props.button.createOprationButton(
//                     tableBtnAry,
//                     {
//                         area: "list_inner",
//                         buttonLimit: 3,
//                         onButtonClick: (props, id) => tableButtonClick.call(this,props, id, text, record, index)
//                     }
//                 )
//             )
//         }
//     });
//     return meta;
// }


let OrgSysPage =  createPage({
    initTemplate:function(){},
    billinfo:[{
        billtype: 'form', 
        pagecode: '10100ASSET_list', 
        headcode: 'sysForm',
    },{
        billtype: 'form', 
        pagecode: '10100ASSET_list', 
        headcode: 'orgForm'
    }]
})(OrgSysPanel);

ReactDOM.render(<OrgSysPage {...config}/>, document.querySelector('#app'));

// export default OrgSysPage

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65