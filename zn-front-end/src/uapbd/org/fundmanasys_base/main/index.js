//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,toast ,print ,high,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const {PrintOutput}=high;
const {NCCol:Col, NCRow:Row,NCFormControl, NCButton ,NCPanel,NCCheckbox,NCRadio,NCDiv } = base;
import './index.less';

/**
 * 穿梭框--导入使用
 */
import Transfer from '../../../public/excomponents/Transfer';

//集团参照
import GroupDefaultTreeRef from '../../../../uap/refer/riart/groupTreeRef/index';
import {conf as unitConf} from '../../../../uap/refer/riart/groupTreeRef/index';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import  Utils from '../../../public/utils';

let leftTree = 'systemTree';//体系--左树id
let rightTreeTable = 'memberTreeTable'//成员--右树表id
let formId = 'sysForm';//体系--编辑formid
let sysModalId = 'sysModal';//体系编辑模态窗id
let sysModalDelId = 'sysDelete';//体系删除模态窗id
let deleteTreeNode = '';//左树删除选择
let memberFormId = 'memberForm';//成员--编辑id
let memberEditModalId = 'memberModal';//成员--编辑模态窗id
let sysSaveType = 'add';//add--新增  edit--修改  copy--复制
let sysVersionModalId = 'systemversion';//体系版本化模态框
let importModalId = 'importModalId';//引入对话框id
let pk_orgtypes = 'FINANCEORGTYPE000000';//引入的组织类型,必须是财务组织
let memberSortModalId = 'memberSortModal';//结构调整模态框id
let memberSortTreeId = 'memberSortTree';//结构调整--树id

let pk_importGroup = '';//引入对话框的集团参照的主键
let groupname = '';
let showDisableOrg = false;//引入对话框是否显示停用的组织

let isShowDisable = false;

let l2rBefor = true;//引用对话框选中校验

let isSort = false;//结构不是被调整过，用来判断是不是需要刷新数据

let pk_fms = '';
/**
 * pagecode 配置
 */

 let pageCode = {
    sysFormPageCode:'10100FMS_card',
    memberFomPageCode : '10100FMSB_card',
 }

 let templateCode = '10100FMS_list';


/**
 * ajaxurl 配置
 */
let ajaxUrl={
    initUrl:'/nccloud/platform/templet/querypage.do',
    sysLoadUrl:"/nccloud/uapbd/org/FundManaSysQueryAction.do",
    sysDeleteUrl:"/nccloud/uapbd/org/FMSDeleteByPk.do",
    sysEnableUrl:"/nccloud/uapbd/org/FMSEnableAction.do",
    sysDisableUrl:"/nccloud/uapbd/org/FMSDisableAction.do",
    sysQueryByPkUrl:"/nccloud/uapbd/org/FundManaSysQueryByPkAction.do",
    sysSaveUrl:"/nccloud/uapbd/org/FMSSaveAction.do",
    sysCopySaveUrl:'/nccloud/uapbd/org/FMSCopySaveAction.do',
    sysVersionQueryUrl:"/nccloud/uapbd/org/FMSVersionQueryAction.do",
    sysVersionSaveUrl:"/nccloud/uapbd/org/FMSVersionCreatAction.do",
    checksysBusinessUrl:"/nccloud/uapbd/org/CheckFundManaSysAction.do",
    memberLoadUrl:"/nccloud/uapbd/org/FMSMemberQueryAction.do",
    memberSaveUrl:"/nccloud/uapbd/org/FMSMemberSaveAction.do",
    memberQueryByPkUrl:"/nccloud/uapbd/org/FMSMemberQueryByPk.do",
    memberDeleteUrl:"/nccloud/uapbd/org/FMSMemberDeleteAction.do",
    importDataQryUrl:"/nccloud/uapbd/org/FMSQueryOrgsAction.do",
    importSaveUrl:"/nccloud/uapbd/org/FMSMemberImportAction.do",
    memberSortQryUrl:"/nccloud/uapbd/org/FMSMemberSortTreeQueryAction.do",
    memberSetOrderUrl:"/nccloud/uapbd/org/FMSMemberSetOrderAction.do",
    printUrl:"/nccloud/uapbd/org/FundManaSysPrintAction.do"
}
const tableBtnAry = ["Editline","Delline"];		//树格列操作按钮
/**
 * 资金管理体系
 * 
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
            nextvno:'',
            // newVersionName:'',
            vstartdate:'',
            versionName:'',
            pks:[],
            json:{}	,
            searchValue:''
        }
        this.initTemplate(props);
    }

    componentDidMount () {
        //加载左树 默认不加载停用数据
        // this.loadLeftTreeData.call(this,false);
        this.initAllData(false,false);
       
    }

    /**
     * 一次性加载界面所有的数据，解决打开节点的效率慢的问题
     * @param {*} showDisable 
     * @param {*} isRfreshAction 
     */
    initAllData(showDisable,isRfreshAction){
        let that = this;
        ajax({
            url:ajaxUrl.sysLoadUrl,
            method:"post",
            data:{showDisable:showDisable,nodeType:this.props.nodeType,data:'all'},
            success:(res)=>{
                if(res.data){
                    if(res.data.tree){
                        //转换树的父子关系
                        let treeData = this.dealTreeData(res.data.tree);
                        that.setSyncTreeData(leftTree, treeData);
                        //设置默认中第一行
                        that.props.syncTree.setNodeSelected(leftTree, res.data.tree[0].refpk);
                    }else{
                        that.setSyncTreeData(leftTree, []);
                    }
                     //后台返回的是表格的数据  需要构造成树状表的数据
                    if(res.data.grid&&res.data.grid.memberTreeTable){
                         let datas =  that.props.treeTableManyCol.createNewData(res.data.grid.memberTreeTable.rows);
                         //根据树状表的数据构造树表
                         that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
                    }else{
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    }

                    pk_importGroup = res.data.pk_group;
                    groupname = res.data.groupname;
                }else{
                    that.setSyncTreeData(leftTree, []);
                    that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                }
                if(isRfreshAction){
                    toast({ color: 'success', title: that.state.json['10100FMSB-000000'] });/* 国际化处理： 刷新成功！*/
                }
                that.toggleShow();
            }
        });
    }

    //加载左树数据
    loadLeftTreeData(showDisable,isRfreshAction = false){
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
                    if(isRfreshAction){
                        toast({ color: 'success', title: this.state.json['10100FMSB-000000'] });/* 国际化处理： 刷新成功！*/
                    }
                    this.toggleShow();
                    this.setState({ searchValue:'' });
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
            title:  this.state.json['10100FMSB-000021'],
            content:this.state.json['10100FMSB-000001'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？*/
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
                // let delpk = that.props.syncTree.getSelectNode(leftTree).id;
                that.props.syncTree.delNodeSuceess(leftTree,pk);
                that.initAllData(false,false);
                toast({ color: 'success', title: that.state.json['10100FMSB-000002'] });/* 国际化处理： 删除成功！*/
            }
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
                        if(res.data&&res.data.memberTreeTable){
                            //后台返回的是表格的数据  需要构造成树状表的数据
                            let datas =  that.props.treeTableManyCol.createNewData(res.data.memberTreeTable.rows);
                            //根据树状表的数据构造树表
                            that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
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
        this.toggleShow();
    }
     //切换页面状态--设置按钮显示和业务状态
	toggleShow (){
        this.props.button.setMainButton('Add',true);
        var  allTreeData = this.props.syncTree.getSyncTreeValue(leftTree);
        if(!allTreeData||allTreeData.length === 0){
            this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','SortManage','Print','Output'],true);
            return;
        }else{
            this.props.button.setButtonDisabled(['Print','Output'],false);
        }
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        if(selectNode){//更新停用启用按钮
            if('root' === selectNode.id){
                this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','SortManage'],true);
            }else{
                this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','SortManage'],false);
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
        }else{
            this.props.button.setButtonDisabled(['Copy','Enable','Disable','Version','Import','SortManage'],true);
        }
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

    onMouseEnterEve( key ) {
        if(key === this.state.json['10100FMSB-000003']||key === 'root'){/* 国际化处理： 资金管理体系--全局*/
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
                    toast({ color: 'success', title: that.state.json['10100FMSB-000004'] });/* 国际化处理： 启用成功！*/
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
                    toast({ color: 'success', title: that.state.json['10100FMSB-000005'] });/* 国际化处理： 停用成功！*/
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
                    let value = {'sysForm':cardData}
                    Utils.filterEmptyData(value.sysForm.rows[0].values);
                    that.props.form.setAllFormValue(value);
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
            this.sysSaveFun(formdata)
            }, { 'sysForm': 'form' },'form');
    }


    sysSaveFun(formdata){
        let requestParam = {
            model: formdata,
            // nodeType:this.props.nodeType,//后台解析报错
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
                    let treeData = that.dealTreeData(res.data);
                    if(sysSaveType==='add'||sysSaveType==='copy'){//新增树节点
                        that.props.syncTree.addNodeSuccess(leftTree,treeData);
                    }else{//修改树节点
                        that.props.syncTree.editNodeSuccess(leftTree, treeData);
                    }
                    toast({ color: 'success', title: that.state.json['10100FMSB-000006'] });/* 国际化处理： 保存成功！*/
                    that.props.modal.close(sysModalId);
                    that.windowCloseListener('browse');
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
            deleteDataChildrenProp(e);
            e.iconBox = {
                editIcon: true,
                addIcon: true,
                delIcon: true
            }
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
            data:{pk_system:pk,nodeType:this.props.nodeType},
            success:function(res){
                if(res.success){
                    that.props.editTable.setTableData(sysVersionModalId,res.data.grid[sysVersionModalId]);
                    that.props.editTable.setStatus(sysVersionModalId,'browse');
                    // document.getElementById('nextvno').value=res.data.nextvno;
                    // document.getElementById('vstartdate').value = res.data.vstartdate;
                    that.setState({
                        nextvno :res.data.nextvno,
                        vstartdate:res.data.vstartdate,
                        versionName:''
                    });
                    that.props.modal.show(sysVersionModalId);
                    //弹出版本化窗口
                }
            }
        });
    }
     //版本化保存
    onVersionSave(){
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        let that = this;
        let versionData = {
            nextvno:document.getElementById('nextvno').value,
            vstartdate:document.getElementById('vstartdate').value,
            newVersionName:document.getElementById('newVersionName').value,
            pk_system:pk,
            nodeType:this.props.nodeType
        }
        ajax({
            url:ajaxUrl.sysVersionSaveUrl,
            method:"post",
            data:versionData,
            success:function(res){
                if(res.success){
                    that.props.modal.close(sysVersionModalId);
                }else{
                    toast({ color: 'warning', content: res.message});
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
                    title:this.state.json['10100FMSB-000007'],/* 国际化处理： 提示*/
                    content:this.state.json['10100FMSB-000008'],/* 国际化处理： 确定要启用该数据吗？*/
                    beSureBtnClick:()=>{this.onEnable()}
                })
                break;
            case 'Disable':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title:this.state.json['10100FMSB-000007'],/* 国际化处理： 提示*/
                    content:this.state.json['10100FMSB-000009'],/* 国际化处理： 确定要停用该数据吗？*/
                    beSureBtnClick: ()=>{this.onDisable()}
                })
                break;
            case 'Refresh':
                this.loadLeftTreeData(isShowDisable,true);
                break;
            case 'Import':
                this.onImportClick();
                break;
            case 'Version':
                this.onCreatVersion();
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
                        funcode: props.appCode,      //功能节点编码，即模板编码
                        nodekey:'fundmanasystemprint',     //模板节点标识
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
               /*  print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    ajaxUrl.printUrl, 
                    {
                        //billtype:'',  //单据类型
                        funcode: props.appCode,      //功能节点编码，即模板编码
                        //nodekey:'',     //模板节点标识
                        // nodekey:'assprinttem',  
                        outputType:'output',
                        oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                ); */
                break;
            default:
                break;
        }
    }
    //成员修改保存
    onSaveMember(){
        let flag = this.props.form.isCheckNow(memberFormId);
        if(!flag){
            return;
        }
        let formdata = this.props.form.getAllFormValue(memberFormId);
        let requestParam = {
            model: formdata,
            pageid:pageCode.memberFomPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        let that = this;
        ajax({
            url:ajaxUrl.memberSaveUrl,
            method:"post",
            data:requestParam,
            success:function(res){
                if(res.success){
                     //后台返回的是表格的数据  需要构造成树状表的数据//保存了？？？？
                    //  let datas =  that.props.treeTableManyCol.createNewData(res.data.memberTreeTable.rows);
                     let datas= res.data.memberTreeTable.rows;
                     //根据树状表的数据构造树表
                     that.props.treeTableManyCol.editRowEve(rightTreeTable,datas);
                     toast({ color: 'success', title: that.state.json['10100FMSB-000006'] });/* 国际化处理： 保存成功！*/
                     that.props.modal.close(memberEditModalId);
                     that.windowCloseListener('browse');
                }else{
                    toast({ color: 'warning', content: res.message});
                }
            }
        });
    }
    
    onImportClick(){
        //校验成员只能有一个根节点
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            toast({content : this.state.json['10100FMSB-000010'],color : 'warning'});/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
            // promptBox({
            //     color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            //     title:'引入选择提示',
            //     content:'组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据！'
            // })
            return;
        }
        this.onImportDataLoad.call(this,false);
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
            data:{pk_group:pk_importGroup,showDisable:showDisableOrg,pk_system:pk,nodeType:that.props.nodeType,pk_orgtypes:pk_orgtypes},
            success:function(res){
                if(res.success){
                    //弹出引入窗口
                    that.props.modal.show(importModalId);
                    that.orgTransfer.setRootTitle( groupname+'-' + that.state.json['10100FMSB-000011'])/* 国际化处理： 财务*/
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
            toast({content : this.state.json['10100FMSB-000012'],color : 'warning'});/* 国际化处理： 您没有选择任何数据！*/
            return;
        }
        // let orgs= [];
        // this.convertToTable(selData);

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
            data:{orgs,pk_system:pk,pk_sysvid:pk_sysvid,pk_fmsmember:pk_fmsmember,pk_membeorg:pk_membeorg},
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
                toast({content : item.refname + this.state.json['10100FMSB-000013'],color : 'warning'});
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
                <Row style={{marginBottom: 10}}>
                    <Col md={4} xs={4} sm={4}>
                        {GroupDefaultTreeRef({}=this.createCfg("GroupDefaultTreeRef",{
                                value:{refpk:pk_importGroup,
                                    refname:groupname
                                },
                                fieldid : 'GroupDefaultTreeRef',
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
                            
                            >{this.state.json['10100FMSB-000036']}</NCCheckbox>{/* 国际化处理： 显示停用数据*/}
                    </Col>
                </Row>
                <Transfer 
                    ref={(item)=>{this.orgTransfer = item}} showSearch={true}
                    // TransferId={'org_transferid'} 
                    // // leftTreeData={this.state.importLeftTreeData} 
                    // // rightTreeData={this.state.importRightTreeData}
                    // // value={this.state.importDataValue}
                    // oprType={this.state.oprType}
                    // beforeMove={this.handelBeforeMove.bind(this)}
                />
                <div style={{marginTop: 10,marginBottom: 10,textAlign:'center'}}>
                    <NCRadio.NCRadioGroup
                        name="oprType"
                        selectedValue={this.state.oprType}
                        onChange={this.handleOprTypeChange.bind(this)}>
                        <NCRadio value="0" >{this.state.json['10100FMSB-000037']}</NCRadio>{/* 国际化处理： 包含所有下级*/}
                        <NCRadio value="1" >{this.state.json['10100FMSB-000038']}</NCRadio>{/* 国际化处理： 仅自己*/}
                        <NCRadio value="2" >{this.state.json['10100FMSB-000039']}</NCRadio>{/* 国际化处理： 仅直接下级*/}
                        <NCRadio value="3" >{this.state.json['10100FMSB-000040']}</NCRadio>{/* 国际化处理： 仅末级*/}
                    </NCRadio.NCRadioGroup>
                </div>
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
     * 结构调整弹框关闭后的事件（比如要刷新成员数据）
     */
    closeSortModalEve(){
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        this.onSelectEve(pk,null,true);
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
            toast({content : this.state.json['10100FMSB-000014'],color : 'warning'});
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
                    this.props.syncTree.setNodeSelected(memberSortTreeId,selected.id);
                    this.props.modal.show(memberSortModalId);
                    isSort = true;
                    // //设置默认中第一行
                    // this.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                    // if(res.data[0].refpk!=='root'){
                    //     this.onSelectEve( res.data[0].refpk,null,true);
                    // }
                }
            }
        });
    }

    cancelBtnClick= () => {
        this.props.modal.show('warningcancel');
    }
    beSuerCancel=()=>{
        this.props.modal.close(sysModalId);
        this.props.modal.close('warningcancel');
    }

    beforeEvent(props, moduleId, key, value,data){
        //用于判断是否已经存在勾选了业务管控的资金管理体系
        if(key == 'busicontrflag'){
            ajax({
                url:ajaxUrl.checksysBusinessUrl,
                method:"post",
                data:{pk_member:pk_member,orderType:orderType},
                success:(res)=>{
                    if(res.success){
                        if(res.data){
                            toast({content : this.state.json['10100FMSB-000015'],color : 'warning'});/* 国际化处理： 资金管理体系中只能有一个启用业务管控*/
                            return false;
                        }
                    }
                }
            });
        }
        return true;
    }

    onSearch(value){
        this.setState({ searchValue:value });
        this.props.treeTableManyCol.searchTreeTable({ moduleId: 'memberTreeTable', 
            searchValue: value, filters: ['code','name'], expanded: true, defaultExpandAllRows: false})
    }

    render() {
        const {button, syncTree, modal,DragWidthCom,treeTable,treeTableManyCol,editTable,form ,BillHeadInfo} = this.props;
        const {createButton} = button;
        const { createButtonApp } = button;
        const { createTreeTable } = treeTable;
        const { createEditTable } = editTable;
        let { createForm } = form;
        let { treeTableCol } = treeTableManyCol;
        let {createSyncTree} = syncTree;
        let { createModal } = modal;
        const {createBillHeadInfo} = BillHeadInfo;
        return (
            <div className="nc-bill-tree-table">
                {createModal('warning',{
                     title:this.state.json['10100FMSB-000016'],/* 国际化处理： 关闭提醒*/
                     content:this.state.json['10100FMSB-000017'],/* 国际化处理： 是否确定要关闭？*/
                })}
                {/*资金管理体系 编辑模态框*/}
                { this.state.json['10100FMSB-000018']&&createModal(sysModalId,{
                    title:this.state.json['10100FMSB-000018'],/* 国际化处理： 资金管理体系*/
                    content:function(){
                        return(
                                <div>
                                {createForm(formId, {
                                    onBeforeEvent: this.beforeEvent.bind(this)
                                })}
                                </div>
                        )
                    }.bind(this)(),
                    //this.props.form.createForm(formId),
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
                            title:this.state.json['10100FMSB-000019'],/* 国际化处理： 取消*/
                            content:this.state.json['10100FMSB-000020'],/* 国际化处理：确定要取消吗？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(sysModalId);
                                // this.props.form.setFormStatus(formId,'browse');
                                this.toggleShow();
                                this.windowCloseListener('browse')
                            }
                        })
                    }
                }) }
                 {/*资金管理体系 删除模态框*/}
                {this.state.json['10100FMSB-000021']&&createModal(sysModalDelId,{
                     title:this.state.json['10100FMSB-000021'],/* 国际化处理： 删除*/
                     content:this.state.json['10100FMSB-000022'],/* 国际化处理： 确定要删除吗？*/
                     userControl:true,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.onDeleteSys.bind(this),
                     cancelBtnClick: ()=>{this.props.modal.close(sysModalDelId)}
                })}
                 {/*资金管理体系成员- 编辑模态框*/}
                 { this.state.json['10100FMSB-000023']&&createModal(memberEditModalId,{
                    title:this.state.json['10100FMSB-000023'],/* 国际化处理： 资金管理体系成员*/
                    content:this.props.form.createForm(memberFormId),
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
                            title:this.state.json['10100FMSB-000019'],/* 国际化处理： 取消*/
                            content:this.state.json['10100FMSB-000020'],/* 国际化处理： 确定要取消吗？*/
                            beSureBtnClick:()=>{
                                this.props.modal.close(memberEditModalId);
                                this.windowCloseListener('browse')
                                // this.props.form.setFormStatus(formId,'browse');
                                // this.toggleShow();
                            }
                        })
                    }
                }) }
                 
                {/* 资金管理体系版本化模态框 */}
                { this.state.json['10100FMSB-000024']&&createModal(sysVersionModalId,{
                    title:this.state.json['10100FMSB-000024'],/* 国际化处理： 资金管理体系版本化*/
                    //content:this.props.editTable.createEditTable(sysVersionModalId),
                    content:function(){
                        return (
                            <div>
                                <div style={{display:'flex',justifyContent:'space-around',marginBottom: 10}}>
                                    <div style={{display: 'flex'}}>
                                        <div style={{width:95,marginTop: 3,color:'#BDBDBD'}} >
                                            {this.state.json['10100FMSB-000041']}：
                                        </div>
                                        <NCFormControl fieldid = 'fundmanasys_nextvno_area' type='text'  id = 'nextvno' disabled value ={this.state.nextvno }  style={{width:'160px'}}/>{/* 国际化处理： 新版本号*/}
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <div style={{width:55,marginTop: 2,color:'#BDBDBD'}}>
                                            {this.state.json['10100FMSB-000042']}：
                                        </div>
                                        <NCFormControl fieldid = 'fundmanasys_newVersionName_area' type='text' id='newVersionName' name = 'newVersionName' value={this.state.versionName} required onChange={(value)=>{this.state.versionName = value;this.setState(this.state);}}  style={{width:'160px'}} />   { /* 国际化处理： 说明*/}
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        {/* 生效日期<NCDatePicker  id = 'vstartdate' disabled  value ={this.state.vstartdate} style={{width:'120px'}}/>  */}
                                        <div style={{width:95,marginTop: 3,color:'#BDBDBD'}}>
                                            {this.state.json['10100FMSB-000043']}：
                                        </div>
                                        <NCFormControl type='text' fieldid = 'fundmanasys_vstartdate_area' id = 'vstartdate' disabled  value ={this.state.vstartdate} style={{width:'160px'}}/> {/* 国际化处理： 生效日期*/}
                                    </div>
                                </div>
                                <div>
                                    {this.props.editTable.createEditTable(sysVersionModalId,{
                                        inModal:true
                                    })}
                                </div>
                            </div>
                        )
                     }.bind(this)(),
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onVersionSave.bind(this),
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{
                        this.props.modal.close(sysVersionModalId);
                        this.windowCloseListener('browse')
                    }
                }) }

                 {/*资金管理体系成员- 引入操作模态框*/}
                 { this.state.json['10100FMSB-000025']&&createModal(importModalId,{
                    title:this.state.json['10100FMSB-000025'],/* 国际化处理： 请选择要引入的组织*/
                    content:this.getImportDialog.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onImportSave.bind(this),
                    closeModalEve:()=>{
                        this.windowCloseListener('browse')
                    },
                    cancelBtnClick: ()=>{
                        this.props.modal.close(importModalId);
                        this.windowCloseListener('browse')
                    }
                }) }

                {/*资金管理体系成员- 结构调整模态框*/}
                { this.state.json['10100FMSB-000026']&&createModal(memberSortModalId,{
                    title:this.state.json['10100FMSB-000026'],/* 国际化处理： 结构调整*/
                    content:function(){
                        return(
                            <div class="ncc-hr-contain">
                                <div class="ncc-hr-left-tree nc-theme-transfer-wrap-bgc nc-theme-gray-area-bgc">
                                    <div class="ncc-hr-padding nc-theme-transfer-wrap-bgc nc-theme-gray-area-bgc">
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
                                            <NCButton fieldid = 'upTop'  onClick= {this.setOrder.bind(this,'upTop')}>{this.state.json['10100FMSB-000044']}</NCButton>{/* 国际化处理： 置于顶层*/}
                                        </div>
                                        <div className="opr-botton" style={{marginBottom:'5px'}}>
                                            <NCButton  fieldid = 'upOne'   onClick= {this.setOrder.bind(this,'upOne')}>{this.state.json['10100FMSB-000045']}</NCButton>{/* 国际化处理： 向上一层*/}
                                        </div>
                                        <div className="opr-botton" style={{marginBottom:'5px'}}>
                                            <NCButton fieldid = 'downOne'  onClick= {this.setOrder.bind(this,'downOne')}>{this.state.json['10100FMSB-000046']}</NCButton>{/* 国际化处理： 向下一层*/}
                                        </div>
                                        <div className="opr-botton" style={{marginBottom:'5px'}}>
                                            <NCButton  fieldid = 'downBottom' onClick= {this.setOrder.bind(this,'downBottom')}>{this.state.json['10100FMSB-000047']}</NCButton>{/* 国际化处理： 置于底层*/}
                                        </div>
                                        <div className="opr-botton" style={{marginBottom:'5px'}}>
                                            <NCButton  fieldid = 'upgrade' onClick= {this.setOrder.bind(this,'upgrade')}>{this.state.json['10100FMSB-000048']}</NCButton>{/* 国际化处理： 升级*/}
                                        </div>
                                        <div className="opr-botton" style={{marginBottom:'10px'}}>
                                            <NCButton fieldid = 'degrade'  onClick= {this.setOrder.bind(this,'degrade')}>{this.state.json['10100FMSB-000049']}</NCButton>{/* 国际化处理： 降级*/}
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
                            this.onSelectEve(pk,null,true);
                        }
                        this.windowCloseListener('browse');
                    }
                    // size:'sm'//模态框大小 sm/lg/xlg
                }) }
                
                {/* 标题 title */}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header">
                    {/*页面大图标*/}
                    {/* {createPageIcon()} */}
                    {/* <h2 className="title">{this.props.appCode==='10100FMSB'?this.state.json['10100FMSB-000051']:this.state.json['10100FMSB-000052']}</h2> */}
                    {createBillHeadInfo({
                            title:this.props.appCode==='10100FMSB'?this.state.json['10100FMSB-000051']:this.state.json['10100FMSB-000052']/* 国际化处理： 资金管理体系-全局-集团*/,
                            initShowBackBtn:false
                        })}
                    <span className="showOff">
                        <NCCheckbox 
                            id='sysShowDisable'
                            onChange = {this.onCheckboxChange.bind(this,'sysShowDisable')}
                            checked = {isShowDisable}
                        >
                            {this.state.json['10100FMSB-000050']}{/* 国际化处理： 显示停用*/}
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
                                     showModal:false
                                })}
                            </div>
                        } 
                        //资金管理体系成员---树状表
                        rightDom = {
                            <div className="treeTableCol">
                                 {/* 树表搜索 */}
                                 <Row style={{marginBottom: 10,marginTop: 10,marginLeft:10}}>
                                 <Col md={2} xs={2} sm={2}>
                                 <NCDiv areaCode={NCDiv.config.SEARCH}> 
                                        <NCFormControl
                                            placeholder={this.state.json['10100FMSB-000053'] }
                                            fieldid="search"
                                            value={this.state.searchValue}
                                            onChange={this.onSearch.bind(this)}
                                            type="search"
                                            // disabled={this.state.searchDisable}
                                        />
                                        </NCDiv>
                                    </Col>
                                </Row>
                                { treeTableCol( rightTreeTable,{
                                    async:false,    //数据同步加载为false,异步加载为true
                                    defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                    showCheckBox:true,       // 是否显示复选框 ,默认false不显示
                                    checkedType:'radio'      // 勾选方式，单选radio,多选 checkbox； 默认多选
                                } ) }
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
						nodekey:'fundmanasystemprint',     //模板节点标识
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
                moduleId: "10100FMSB",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    let meta = data.template;
                    templateCode = meta.code;
                    meta = this.modifierMeta(props, meta)
                    props.meta.setMeta(meta,()=>{
                        // this.initAllData(false,false);
                    });
                    if(data.button){
                        props.button.setButtons(data.button);
                        props.button.setPopContent('Delline',this.state.json['10100FMSB-000022']) /* 设置操作列上删除按钮的弹窗提示 '确认要删除吗？'*/
                    }
                }
            }
        );
    }
    
    
    tableButtonClick=(props, id, text, record, index)=>{
        let pk = record.values.pk_fmsmember.value;
        switch(id){
            case 'Editline':
                // memberSaveType = 'edit';
                ajax({
                    url:ajaxUrl.memberQueryByPkUrl,  
                    data: {pk_member:pk},
                    success: (res) => {
                        if (res.success) {
                            let headData = res.data.memberForm.rows[0].values;
                            let meta = props.meta.getMeta();
                            pk_fms = headData.pk_fms.value;
                            meta[memberFormId].items.map((obj)=>{
                                if(obj.attrcode == 'pk_fathermember'){
                                    // props.renderItem('form',memberFormId, 'pk_fathermember', null);
                                    obj.queryCondition = function () {
                                        return {
                                            "pk_fms":pk_fms
                                        }
                                    }
                                }
                            })
                            props.form.setFormStatus(memberFormId,'edit');
                            props.form.EmptyAllFormValue(memberFormId);
                            let cardData = {rows:res.data.memberForm.rows};
                            let value = {'memberForm':cardData}
                            props.form.setAllFormValue(value);
                            props.modal.show(memberEditModalId);
                            // props.modal.show(memberEditModalId,{}, ()=> { props.form.resetItemWidth(memberFormId)  });
                            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                                return '';
                            };
                            // props.form.resetItemWidth(memberFormId);
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
                            toast({ color: 'success', title: this.state.json['10100FMSB-000002'] });/* 国际化处理： 删除成功！*/
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
        meta[memberFormId].items.map((obj)=>{
            if(obj.attrcode == 'pk_fathermember'){
                props.renderItem('form',memberFormId, 'pk_fathermember', null);
                obj.refcode = 'uapbd/refer/org/FundManaSystemMemberTreeRef/index.js';
            };
            if(obj.attrcode == 'pk_org'){
                props.renderItem('form',memberFormId, 'pk_org', null);
                obj.refcode = 'uapbd/refer/org/FinanceOrgAllDataTreeRef/index.js';
                obj.isShowUnit = true;
                unitConf.placeholder = this.state.json['10100FMSB-000034'];/* 国际化处理： 集团*/
                obj.unitProps=unitConf;
            };
        });
        //添加操作列
        meta[rightTreeTable].items.push({
            attrcode: 'opr',
            label: this.state.json['10100FMSB-000035'],/* 国际化处理： 操作*/
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
}

// let OrgSysPage =  createPage({
//     initTemplate:function(){},
//     billinfo:{
//         billtype: 'form', 
//         pagecode: config.nodePageCode, 
//         headcode: 'sysForm',
//     }
// })(OrgSysPanel);

// ReactDOM.render(<OrgSysPage {...config}/>, document.querySelector('#app'));

export default OrgSysPage

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65