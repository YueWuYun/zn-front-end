//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,cacheTools,cardCache,print ,output,high,toast,promptBox,getBusinessInfo,getMultiLang,createPageIcon } from 'nc-lightapp-front';
let { NCCol:Col, NCRow:Row } = base;
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';
let {setDefData, getDefData } = cardCache;
const { PrintOutput } = high;  
const {NCDatePicker, NCButton ,NCPanel,NCCheckbox,NCPopconfirm ,NCRadio,NCFormControl,NCDiv} = base;
import './index.less';

/**
 * 穿梭框--导入使用
 */
import Transfer from '../../../public/excomponents/Transfer';

//集团参照
import GroupDefaultTreeRef from '../../../refer/org/GroupDefaultTreeRef/index'
//组织类型参照
import OrgTypeGridRef from '../../../refer/org/OrgTypeGridRef/index'

const NCTree = base.NCTree;

let leftTree = 'systemTree';//体系--左树id
let rightTreeTable = 'head'//成员--右树表id
let modelCard = 'list'//成员--修改的弹出框
let formId = 'card';//体系--编辑formid
let sysModalId = 'sysModal';//体系编辑模态窗id
let memberSortModalId = 'memberSortModal';//结构调整模态框id
let memberSortTreeId = 'memberSortTree';//结构调整--树id
let sysModalDelId = 'sysDelete';//体系删除模态窗id
let deleteTreeNode = '';//左树删除选择
let memberFormId = 'memberForm';//成员--编辑id
let reportOrgFormId = 'orgForm';//成员组织信息模板id
let memberEditModalId = 'memberModal';//成员--编辑模态窗id
let sysSaveType = 'add';//add--新增  edit--修改  copy--复制
let memberSaveType = 'edit';
let importModalId = 'importModalId';//引入对话框id
let pk_importGroup = '';//引入对话框的集团参照的主键
let showDisableOrg = 'false';//引入对话框是否显示停用的组织
let pk_orgtypes = 'CORPORGTYPE000000000'//引入的组织类型,默认是法人公司
let groupname = '';

/**
 * AjaxUrl配置
 */
let ajaxUrl={
    initUrl:'/nccloud/platform/templet/querypage.do',
    loadTreeDataUrl:"/nccloud/uapbd/stockstatstru/loadtreedata.do",
    querySSSMemberUrl:"/nccloud/uapbd/stockstatstru/querycard.do",
    deletestockstatstruUrl:'/nccloud/uapbd/stockstatstru/delsss.do',
    stockstatstruqueryUrl:'/nccloud/uapbd/stockstatstru/stockstatstruquery.do',
    savestockstatstruUrl:'/nccloud/uapbd/stockstatstru/savestockstatstru.do',
    sysCopySaveUrl:'/nccloud/uapbd/stockstatstru/stockstatstrucopysaveaction.do',
    sssmembaddUrl:'/nccloud/uapbd/stockstatstru/sssmembadd.do', 
    savestockstatstrumembUrl:'/nccloud/uapbd/stockstatstru/savestockstatstrumemb.do',
    deletestockstatstrumembUrl:'/nccloud/uapbd/stockstatstru/delsssmenb.do',
    sssmemb4adjustUrl:'/nccloud/uapbd/stockstatstru/sssmem4adjustaction.do',
    setordertreenodeUrl:"/nccloud/uapbd/stockstatstru/setordertreenode.do",
    enablestateUrl:'/nccloud/uapbd/stockstatstru/enablestate.do',
    importDataQryUrl:"/nccloud/uapbd/stockstatstru/importtreedata.do",
    printUrl: '/nccloud/uapbd/stockstatstru/print.do',
    importSaveUrl:"/nccloud/uapbd/stockstatstru/sssmemimportsave.do"

}

/**
 * pageCode定义
 */
let pageCode={
    mainPageCode: "10100SSS_stockstatstrumember"
}

/**
 * 库存统计体系
 * wangdca
 */
class OrgSysPanel extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        let { form, button, table, search ,syncTree } = this.props;
        this.state={
            pks:[],
            oprType:'0',
            json: {},
            expandKeys:[],
            checked: false,//判断 显示停用按钮是否选中
            showOffDisable:true,
            showOffChecked: true,//判断 显示停用按钮是否选中
            orgTypeName:props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000000')/* 国际化处理： 法人公司*/,
            showOffImportDisable:true,
            importLeftTreeData:[],
            editstate:'browse',
            importRightTreeData:[],
            searchValue:'',
            refs: {}
        }
        this.initTemplate = this.initTemplate.bind(this);
        this.initTemplate(props);
    }

       //初始化单据模板
       initTemplate = (props,callback) => {
        let that = this;
        createUIDom(props)(
            {
                pagecode:props.config.pageCode//页面id
            // appcode:props.config.appcode//注册按钮的id
            },
            {
                moduleId: '10100SSS',domainName: 'uapbd'
            },
            (data, langData)=>{ 
                if(langData){
                    that.state.json = langData;
                    props.config.title = that.props.MutiInit.getIntl("10100SSS") && that.props.MutiInit.getIntl("10100SSS").get('10100SSS-000035');/* 国际化处理： 库存统计体系*/
                    that.state.orgTypeName = that.props.MutiInit.getIntl("10100SSS") && that.props.MutiInit.getIntl("10100SSS").get('10100SSS-000000');/* 国际化处理： 法人公司*/
                }
                if (data) {
                		//默认业务单元赋值
                    let ccontext = data.context || {};
                    that.state.curOrg = {
                        refpk : ccontext.pk_org,
                        refname : ccontext.org_Name,
                        display : ccontext.org_Name,
                        values : {refpk : ccontext.pk_org, refname : ccontext.org_Name}
                    };
                    if(data.template){
                        let meta = data.template;
                        let buttonAry =[];
                        data.button.map((obj)=>{
                            if(obj.hasOwnProperty('area')&&obj.hasOwnProperty('key')&&obj.area ==='line-button-area'){
                                buttonAry.push(obj.key);
                            }
                        });
                        modifierMeta(props, meta,buttonAry)
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setPopContent('linedel', that.state.json['10100SSS-000024']); /* 设置操作列上删除按钮的弹窗提示，'确认要删除该信息吗？' */
                        props.button.setButtons(button);
                    }
                    callback && callback();
                }
            }
        )
}

    componentDidUpdate(){
        if(this.state.editstate === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
            return '';
            };
        }
    }

    componentDidMount () {
        //加载左树 默认不加载停用数据
        
        this.loadLeftTreeData(this.state.showOffDisable);
    }

    //加载左树数据
    loadLeftTreeData(showDisable){
        let that = this;
        ajax({
            url:ajaxUrl.loadTreeDataUrl,
            method:"post",
            data:{showDisable:showDisable},
            success:(res)=>{
                if(res.success && res.data){
                    //转换树的父子关系
                    let treeData = that.dealTreeData(res.data);
                    that.props.syncTree.setSyncTreeData(leftTree, treeData);
                    let selectnode = that.props.syncTree.getSelectNode(leftTree);
                    let noderefpk = selectnode ? selectnode.refpk:res.data[0].refpk;
                    that.props.syncTree.setNodeSelected(leftTree, noderefpk)
                    let ssspks =[];
                    if(res.data){
                        res.data.map((obj) => {
                            ssspks.push(obj.id);
                        })
                    }
                    cacheTools.set('ssspks',ssspks);
                    if(res.data[0].refpk!=='root'){
                        that.onSelectEve(noderefpk,null,true);
                    }
                    that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    //that.props.treeTableManyCol.initTreeTableData(rightTreeTable, [], 'refpk');
                }
                if(!res.data){
                    that.props.syncTree.setSyncTreeData(leftTree, []);
                }
                if(getDefData('stockstatstru_btnopr',that.props.config.datasource) == 'refresh'){
                    toast({title : that.props.MutiInit.getIntl("10100SSS") && that.props.MutiInit.getIntl("10100SSS").get('10100SSS-000036'),color : 'success'});/* 国际化处理： 刷新成功*/
                }
                this.toggleShow();
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
     
     /**
     * 删除提示
     */
    onDeleteSysEve(selectedTreeNode){
        if (!selectedTreeNode) {
            toast({content: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000001'), color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
            return;
        }

        if(selectedTreeNode.hasOwnProperty('children') && selectedTreeNode.children.length>0){
            toast({content: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000002'), color: 'warning'});//默认top/* 国际化处理： 数据已被引用，不能删除！*/
            return;
        }
        deleteTreeNode = selectedTreeNode;
        promptBox({
            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000039'),/* 国际化处理： 删除提醒*/
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            hasCloseBtn:false,
            content:this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000024'),/* 国际化处理： 确定要删除数据吗？*/
            beSureBtnClick: () =>{
                this.onDeleteSys();
            }   
        })
    }
    //删除操作
    onDeleteSys(){
        debugger;
        let pk = deleteTreeNode.id;
        let that = this;
        ajax({
            url:ajaxUrl.deletestockstatstruUrl,
            method:"post",
            data:{pk_stockstatstru: pk},
            success:function(res){
                that.props.syncTree.delNodeSuceess(leftTree,pk);
                that.loadLeftTreeData(that.state.showOffDisable);
                that.props.modal.close(sysModalDelId);
            }
        });
    }

    onAdjustSave(){
        this.onSelectEve(cacheTools.get('pk_sss'),null,true);
        this.props.modal.close(memberSortModalId);
    }

    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve (data, item, isChange) {
        if(isChange){
            //加载成员树表
            let that = this;
            cacheTools.set('pk_sss',data);
            ajax({
                url:ajaxUrl.querySSSMemberUrl,
                method:"post",
                data:{pk_sss: data},
                success:function(res){
                    if(res.success){

                        if(res.data){
                            //后台返回的是表格的数据  需要构造成树状表的数据
                            let datas =  that.props.treeTableManyCol.createNewData(res.data.head.rows);
                            //that.props.treeTableManyCol.EmptyAllFormValue(rightTreeTable);
                            //根据树状表的数据构造树表

                            that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');

                            // 加载展开的节点
                            that.expandTreeNode();
                        }else{

                            that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                        }
                        that.toggleShow();
                    }
                }
            });
        }
        
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
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        var btns1 = ['enable','disable','copy','import','adjust','print','importstore','export','addvirtual'];
        if(!selectNode){
            this.props.button.setButtonDisabled([...btns1],true);
            this.setState({
                showOffChecked:true
              });
        }else{
            this.props.button.setButtonDisabled([...btns1],false);
            this.setState({
                showOffChecked:false
              });
        }
        if(selectNode){//更新停用启用按钮
            let enablestate = selectNode.nodeData.enablestate;
            if(enablestate ==='2'){//启用状态
                this.props.button.setButtonDisabled(['disable'],false);
                this.props.button.setButtonDisabled(['enable'],true);
            }else{
                this.props.button.setButtonDisabled(['disable'],true);
                this.props.button.setButtonDisabled(['enable'],false);
            }
        }
    }
    onMouseEnterEve( key ) {
        let obj = {
            addIcon:true,
            editIcon:true,
            delIcon:true
        };
        this.props.syncTree.hideIcon( leftTree, key, obj )
    }
    //显示停用
    onCheckShowDisable(checked){
        this.setState(
            {checked:!this.state.checked},
            () => {
                this.state.showOffDisable = !this.state.showOffDisable
                let showDisable = this.state.showOffDisable;
                this.loadLeftTreeData(showDisable)
            }
        );
        
    }

    /**
     * 结构调整
     */
    onSortClick(){
        let pk_sss = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.sssmemb4adjustUrl,
            method:"post",
            data:{pk_sss:pk_sss},
            success:(res)=>{
                if(res.success){
                    //转换树的父子关系
                    if(res.data){
                        let treeData = this.dealTreeData(res.data);
                        this.props.syncTree.setSyncTreeData(memberSortTreeId, treeData);
                    }else{
                        this.props.syncTree.setSyncTreeData(memberSortTreeId, []);
                    }
                    this.props.modal.show(memberSortModalId,{ title:this.state.json['10100SSS-000022']/* 国际化处理： 结构调整*/});
                }
            },

        });
    }

    setOrder(orderType){
        let selected = this.props.syncTree.getSelectNode(memberSortTreeId)
        if(!selected){
            toast({content : this.state.json['10100SSS-000003'],color : 'warning'});/* 国际化处理： 请选择要操作的数据！*/
        }
        let pk_sssmember = selected.id;
        ajax({
            url:ajaxUrl.setordertreenodeUrl,
            method:"post",
            data:{pk_sssmember:pk_sssmember,orderType:orderType},
            success:(res)=>{
                if(res.success){
                    //转换树的父子关系
                    let treeData = this.dealTreeData(res.data);
                    this.props.syncTree.setSyncTreeData(memberSortTreeId, treeData);
                    this.props.modal.show(memberSortModalId,{ title:this.state.json['10100SSS-000022']/* 国际化处理： 结构调整*/});
                    // //设置默认中第一行
                    // this.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                    // if(res.data[0].refpk!=='root'){
                    //     this.onSelectEve( res.data[0].refpk,null,true);
                    // }
                }
            },
        });
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

        promptBox({
            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: that.state.json['10100SSS-000004'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: that.state.json['10100SSS-000005'],/* 国际化处理： 您确定要启用吗？*/
            hasCloseBtn:false,
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            beSureBtnClick: () =>{
                ajax({
                    url:ajaxUrl.enablestateUrl,
                    method:"post",
                    data:{pk_stockstatstru:selectNode.id,nodeType:that.props.nodeType,enablestate:"2"},
                    success:function(res){
                        if(res.success){
                            //更新树节点
                            //let treeData = that.dealTreeData(res.data);
                            that.props.syncTree.editNodeSuccess(leftTree, res.data);
                            //手动刷新界面
                            that.loadLeftTreeData(that.state.showOffDisable);
                            that.props.button.setButtonDisabled(['disable'],true);
                            that.props.button.setButtonDisabled(['enable'],false);
                        }
                    }
                });
            }  
        })
    }
    //停用
    onDisable(){
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        let that = this;

        promptBox({
            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: that.state.json['10100SSS-000004'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            hasCloseBtn:false,
            content: this.state.json['10100SSS-000006'],/* 国际化处理： 您确定要停用吗？*/
            beSureBtnClick: () =>{
                ajax({
                    url:ajaxUrl.enablestateUrl,
                    method:"post",
                    data:{pk_stockstatstru:selectNode.id,nodeType:that.props.nodeType,enablestate:"1"},
                    success:function(res){
                        if(res.success){
                            //更新树节点
                            //let treeData = that.dealTreeData(res.data);
                            that.props.syncTree.editNodeSuccess(leftTree, res.data);
                            //手动刷新界面
                            that.loadLeftTreeData(that.state.showOffDisable);
                            that.props.button.setButtonDisabled(['disable'],false);
                            that.props.button.setButtonDisabled(['enable'],true);
                        }
                    }
                });
            }  
        })
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
        if(sysSaveType == 'add'){
            this.props.form.EmptyAllFormValue(formId);
            this.props.form.setFormStatus(formId,'add');
        }else{
            this.props.form.setFormStatus(formId,'edit');
        }
        
        let that = this;
        ajax({
            url:ajaxUrl.stockstatstruqueryUrl,
            method:"post",
            data:{pk_sss:pk,queryType:sysSaveType},
            success:function(res){
                if(res.success && res.data){
                    Utils.filterEmptyData(res.data['card'].rows[0].values);
                    that.props.form.setAllFormValue({card:res.data['card']});
                    that.props.form.setFormItemsDisabled(formId,{enablestate:true});//设置表单项不可用
                    //查询时执行显示公式前端适配
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                [formId]:"form"
                            }
                        );
                    }
                    //用于控制浏览器关闭提示语言
                    that.setState({
                        editstate:'edit'
                    });
                }
            }
        });
        //弹出体系编辑窗口
        this.props.modal.show(sysModalId,{ title:this.state.json['10100SSS-000015']/* 国际化处理： 库存统计体系*/});
    }
    //体系保存 
    onSaveSys(){
        debugger
        let flag = this.props.form.isCheckNow(formId);
        if(!flag){
            this.props.modal.show(sysModalId,{ title:this.state.json['10100SSS-000015']/* 国际化处理： 库存统计体系*/});
            return;
        }
        let formdata = this.props.form.getAllFormValue(formId);

        formdata.areacode = formId;//添加表单的areacode编码

        let requestParam = {
            model: formdata,
            // nodeType:this.props.nodeType,  //参数报错，？？？
            pageid: this.props.config.pageCode
           // pageid: pageCode.sysFormPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        let that = this;
        let saveurl= ajaxUrl.savestockstatstruUrl;
        if(sysSaveType==='copy'){
            saveurl= ajaxUrl.sysCopySaveUrl; 
        }

        //适配校验公式
        this.props.validateToSave( requestParam , ()=>{
            ajax({
                url:saveurl,
                method:"post",
                data:requestParam,
                success:function(res){
                    if(res.success && res.data){
                        let treeData = that.dealTreeData(res.data);
                        if(sysSaveType==='add'||sysSaveType==='copy'){//新增树节点
                            that.props.syncTree.addNodeSuccess(leftTree,treeData[0]);
                            that.loadLeftTreeData(that.state.showOffDisable);
                        }else{//修改树节点
                            that.props.syncTree.editNodeSuccess(leftTree, treeData[0]);
                        }
                         //展开树节点
                        that.props.syncTree.openNodeByPk(leftTree, res.data[0].pid);
    
                        that.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                        toast({ color: 'success', title: that.state.json['10100SSS-000038'] });/* 国际化处理： 保存成功！*/
                        that.props.modal.close(sysModalId);
                        //用于控制浏览器关闭提示语言
                        that.setState({
                            editstate:'browse'
                        });
                    }
                }
            });
        } ,{[formId]:'form'} , 'form' )
        
    }
    
    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.iconBox = {
                delIcon:true,
                editIcon:true,
                addIcon:false
            }
            if(!node.children || node.children.length == 0) {
                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children && node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data && data.forEach( (e) => {
            e.iconBox = {
                delIcon:true,
                editIcon:true,
                addIcon:false
            }
            deleteDataChildrenProp(e);
        });
        return data;
    }

    
    onClickButton(props,id){

    }
    //体系编辑事件
    onEditMember(text, record, index){
    }
    //成员修改保存
    onSaveMember(){
        let that = this;
        let memberFlag = this.props.form.isCheckNow(modelCard);
        if(!memberFlag){
            that.props.modal.show(memberEditModalId,{title:that.state.json['10100SSS-000020']/* 国际化处理： 库存统计体系成员管理*/});
            return;
        }
        let formdata = this.props.form.getAllFormValue(modelCard);

        formdata.areacode = modelCard;//添加表单的areacode编码
        let requestParam = {
            model: formdata,
            pageid: this.props.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
       
        //校验公式
        this.props.validateToSave( requestParam , ()=>{
            ajax({
                url:ajaxUrl.savestockstatstrumembUrl,
                method:"post",
                data:requestParam,
                // data:requestParam,
                success:function(res){
                    if(res.success){
                         //后台返回的是表格的数据  需要构造成树状表的数据s
                         if(memberSaveType ==='edit'){
                             that.props.treeTableManyCol.editRowEve(rightTreeTable,res.data.head.rows[0]);
                         }else{
                            that.props.treeTableManyCol.addChildRowEve(rightTreeTable,res.data.head.rows[0]);
                         }
                         toast({ color: 'success', title: that.state.json['10100SSS-000038'] });/* 国际化处理： 保存成功！*/
                         that.props.modal.close(memberEditModalId);
                         that.loadLeftTreeData(that.state.showOffDisable);
                        //用于控制浏览器关闭提示语言
                        that.setState({
                            editstate:'browse'
                        });
                         //that.onCloseButton();
                    }
                }
            });
        }  ,{[modelCard]:'form'} , 'form')
        
    }

    //成员新增虚节点
    onAddMember(){
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        let that = this;
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            toast({content :this.state.json['10100SSS-000007'],color : 'warning'});/* 国际化处理： 体系内的成员树只能有一个根节点，请选择一个成员节点后再新增虚节点*/
            return;
        }
        //this.props.openTo('/nccloud/resources/uapbd/org/orgunit_glb/main/#/version/',{appcode:'10100ORG',pagecode:'10100ORG_orgunit'}); 
        memberSaveType = 'add';
        this.props.modal.show(memberEditModalId,{title:this.state.json['10100SSS-000020']/* 国际化处理： 库存统计体系成员管理*/});
        this.props.form.setFormStatus(modelCard,'add');
        this.props.form.EmptyAllFormValue(modelCard);
        let pk_stockstatstru = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.sssmembaddUrl,
            // data: {pk_member,pk_org,pk_rcs,pk_svid},????????????????没有选中行怎么获取pk_member值
            data:{pk_stockstatstru:pk_stockstatstru,isdepot:false},
            success: (res) => {
               if (res.success) {
                let meta = that.props.meta.getMeta()
                meta[modelCard].items.map((obj)=>{
                    if(obj.attrcode == 'pk_fathermember'){
                        that.props.renderItem('form',modelCard, 'pk_fathermember', null);
                        obj.queryCondition = function () {
                            return {
                                "pk_stockstatstru": pk_stockstatstru
                            }
                        }
                    }
                    if(obj.attrcode == 'pk_org'){
                        obj.visible = false;
                    }
                })
                that.props.meta.setMeta(meta)
                Utils.filterEmptyData(res.data.memberForm.list.rows[0].values);
                that.props.form.setAllFormValue({list:res.data.memberForm.list});

                //勾选之后，赋值勾选数据为上级组织
                if(selectMember && selectMember.length > 0){
                    that.props.form.setFormItemsValue(modelCard,{'pk_fathermember':{value:selectMember[0].values.pk_sssmember.value,display:selectMember[0].values.name.value}});
                }
               //用于控制浏览器关闭提示语言
               that.setState({
                    editstate:'edit'
                });
               }
            }
        });
    }

     //成员新增虚节点
     onImportDepotClick(){
        memberSaveType = 'add';
        //校验成员只能有一个根节点
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        let that = this;
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            toast({content : this.state.json['10100SSS-000008'],color : 'warning'});/* 国际化处理： 体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
            return;
        }
        this.props.modal.show(memberEditModalId,{title:this.state.json['10100SSS-000020']/* 国际化处理： 库存统计体系成员管理*/});
        this.props.form.setFormStatus(modelCard,'edit');
        this.props.form.EmptyAllFormValue(modelCard);
        let pk_stockstatstru = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.sssmembaddUrl,
            // data: {pk_member,pk_org,pk_rcs,pk_svid},????????????????没有选中行怎么获取pk_member值
            data:{pk_stockstatstru:pk_stockstatstru,isdepot:true},
            success: (res) => {
               if (res.success) {
                let meta = that.props.meta.getMeta()
                meta[modelCard].items.map((obj)=>{
                    if(obj.attrcode == 'pk_fathermember'){
                        that.props.renderItem('form',modelCard, 'pk_fathermember', null);
                        obj.queryCondition = function () {
                            return {
                                "pk_stockstatstru": pk_stockstatstru
                            }
                        }
                    }
                    if(obj.attrcode == 'pk_org'){
                        obj.refcode = 'uapbd/refer/stordoc/StorDocDefaulteGridRef/index.js';
                        obj.label=this.state.json['10100SSS-000009'];/* 国际化处理： 仓库*/
                        obj.isShowUnit = true;
                        obj.visible = true;
                        obj.isMultiSelectedEnabled = false;
                        obj.required= true;
                    }
                })
                that.props.meta.setMeta(meta)
                
                that.props.form.setAllFormValue({list:res.data.memberForm.list});
                //勾选之后，赋值勾选数据为上级组织
                if(selectMember && selectMember.length > 0){
                    that.props.form.setFormItemsValue(modelCard,{'pk_fathermember':{value:selectMember[0].values.pk_sssmember.value,display:selectMember[0].values.name.value}});
                }
                //用于控制浏览器关闭提示语言
                that.setState({
                    editstate:'edit'
                });
               }
            }
        });

    }


    onCloseButton(){
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        //加载成员树表
        let that = this;
        ajax({
            url:ajaxUrl.querySSSMemberUrl,
            method:"post",
            data:{pk_sss: pk},
            success:function(res){
                if(res.success){
                    if(res.data){
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        let datas =  that.props.treeTableManyCol.createNewData(res.data.head.rows);
                        //that.props.treeTableManyCol.EmptyAllFormValue(rightTreeTable);
                        //根据树状表的数据构造树表

                        that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
                    }else{
                        let datas =  that.props.treeTableManyCol.createNewData({rows: []});
                        that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk')
                    }

                    //用于控制浏览器关闭提示语言
                    that.setState({
                        editstate:'browse'
                    });
                }
            }
        });

        this.toggleShow();

        this.props.form.setFormStatus(rightTreeTable, 'browse');
    }

    //========================= 体系成员引入=========================
    onImportClick(num){
        //校验成员只能有一个根节点
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        let that = this;
        if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
            // alert("体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据");
            toast({content : that.state.json['10100SSS-000010'],color : 'warning'});/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据！*/
            return;
        }
        //引入的时候，默认打开都是法人公司
        if(1 == num){
            pk_orgtypes = 'CORPORGTYPE000000000'
        }
        this.onImportDataLoad.call(this,false);
         //弹出引入窗口
        this.props.modal.show(importModalId,{title:this.state.json['10100SSS-000021'],/* 国际化处理： 请选择要引入的组织*/});
    }

    //引入时是否显示停用的组织
    onShowDisableOrg(checked){
        this.setState(
            {checked:!this.state.checked},
            () => {
                this.state.showOffImportDisable = !this.state.showOffImportDisable
                let showDisableOrg = this.state.showOffImportDisable;
                this.onImportDataLoad.call(this,showDisableOrg);
            }
        );
    }

    onImportDataLoad(showDisableOrg){
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        let businessInfo = getBusinessInfo();
        groupname = businessInfo.groupName+'_'+this.state.orgTypeName;
        ajax({
            url:ajaxUrl.importDataQryUrl,
            method:"post",
            data:{pk_group:pk_importGroup,showDisable:showDisableOrg,pk_stockstatstru:pk,pk_orgtypes:pk_orgtypes},
            success:function(res){
                if(res.success){
                    that.orgTransfer.setRootTitle(groupname);
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
    //体系成员引入保存
    onImportSave(){
        // if(!(this.state.importRightTreeData&&this.state.importRightTreeData.length>0)){
        //     toast({content : '您没有选择任何数据！',color : 'warning'});
        // }
        // let orgs= [];
        var orgs = this.orgTransfer.getData();
        // let countrooot = this.convertToTable(this.state.importRightTreeData,orgs);
        let that = this;

        // //可以一次引入有上下级关系的多条数据，如果没有上下级关系，则只能引入一条根节点
        // let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        // if(allMember.length == 0 &&  countrooot > 1 ){
        //     toast({content : '组织体系内的成员树只能有一个根节点,请在单击"引入"按钮前选中一个组织或者在引入对话框右侧选择一个节点作为新选入数据的上级节点',color : 'warning'});
        //     return;
        // }

        
        if(!(orgs&&orgs.length>0)){
            // alert('您没有选择任何数据！');
            toast({content : this.state.json['10100SSS-000011'],color : 'warning'});/* 国际化处理： 您没有选择任何数据！*/
            return;
        }
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        // if(allMember.length == 0 &&  orgs.length > 1 ){
        //     // alert("体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据");
        //     toast({content : '组织体系内的成员树只能有一个根节点,请在单击"引入"按钮前选中一个组织或者在引入对话框右侧选择一个节点作为新选入数据的上级节点',color : 'warning'});
        //     return;
        // }

        //获取选中的成员作为引入数据的根节点
        let pk_sssmember = '';
        let pk_memborg = '';
        if(selectMember && selectMember[0] != undefined ){
            pk_sssmember = selectMember[0].rowId;
            pk_memborg = selectMember[0].values.pk_org.value;
        }
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url:ajaxUrl.importSaveUrl,
            method:"post",
            data:{orgs,pk_sss:pk,pk_sssmember:pk_sssmember,pk_memborg:pk_memborg,pk_orgtypes:pk_orgtypes},
            success:function(res){
                if(res.success){
                    if(res.data){//返回全新的数据 刷新界面
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        //that.props.treeTableManyCol.addChildRowEve(rightTreeTable,res.data.head.rows);
                        //根据树状表的数据构造树表
                       // that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                       //后台返回的是表格的数据  需要构造成树状表的数据
                       let datas =  that.props.treeTableManyCol.createNewData(res.data.head.rows);
                       //根据树状表的数据构造树表
                       that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                       that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
                    }else{
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    }
                    that.props.modal.close(importModalId);
                    //保存之后，还原为默认值，打开引入默认是法人公司
                    pk_orgtypes = 'CORPORGTYPE000000000';
                    that.state.orgTypeName = that.state.json['10100SSS-000000'];/* 国际化处理： 法人公司*/
                    //用于控制浏览器关闭提示语言
                    that.setState({
                        editstate:'browse'
                    });
                }
            }
        });
    }

     /**
	 * 将树数据转换为表数据，提供给第三步生成表格数据使用
	 */
	convertToTable=(orgTree,data)=>{
        let count = 0;
		orgTree && orgTree.forEach((item,index)=>{
            if(item.pid == '~' || item.pid == undefined){
                count = count+1;
            }
			data.push(item);
			if(item.children&&item.children.length > 0){
				this.convertToTable(item.children,data);
			}
        });
        return count;
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
        if(id==='GroupDefaultTreeRef'){
            obj={
                value:this.state.refs[id]?this.state.refs[id].value:[],
                onChange:function (val) {
                    var temp= Object.assign(this.state.refs[id],{value:val});
                    this.setState(Object.assign (this.state.refs,temp));
                    if(pk_importGroup!==temp.value.refpk){
                        pk_importGroup = temp.value.refpk;
                        this.onImportClick(2);
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
                    if(pk_orgtypes!==temp.value.refpk && Object.keys(val).length  != 0){
                        pk_orgtypes = temp.value.refpk;
                        this.state.orgTypeName = temp.value.refname;
                        this.onImportClick(2);
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
           return this.checkBeforeMove(nodes);
        }
        return true;
    }

    checkBeforeMove(nodes){
        let returnResult = true
        let that = this;
        nodes.forEach((item,index)=>{
            if(item.nodeData.isMember){
                toast({content : item.refname + that.state.json['10100SSS-000012'],color : 'warning'});/* 国际化处理： 在体系中已经存在，请重新选择*/
                returnResult = false;
                return returnResult;
            }
			if(item.children&&item.children.length > 0){
				this.checkBeforeMove(item.children);
			}
        });
        return returnResult;
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
        let businessInfo = getBusinessInfo();
        groupname = businessInfo.groupName+'_'+this.state.orgTypeName;
        return (
			<div id="org_transfer" className="steps-content" style={{height:'450px'}}>
                <Row  style={{marginBottom:'5px'}}>
                    <Col md={4} xs={4} sm={4}>
                        {GroupDefaultTreeRef({}=this.createCfg("GroupDefaultTreeRef",{
                                value:{refpk:businessInfo.groupId,
                                    refname:businessInfo.groupName
                                },
                                disabled:'true',
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    // isShowDisabledData: true,
                                    // pk_reportcombinestru: this.props.syncTree.getSelectNode(leftTree).id
                                };
                            }.bind(this),
                            filedid: 'GroupDefaultTreeRef'
                        }))}
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        {OrgTypeGridRef({}=this.createCfg("OrgTypeGridRef",{
                                value:{refpk:pk_orgtypes,
                                    refname:this.state.orgTypeName
                                },
                                //value:{refpk:'SALEORGTYPE000000000',refname:'法人公司',refcode:'corp'},
                                queryCondition: function(){
                                return {
                                    //此处可以添加参数
                                    GridRefActionExt:'nccloud.web.org.stockstatstru.action.SSSMemberImportOrgtypeSqlBuilder'
                                };
                            }.bind(this),
                            filedid: 'OrgTypeGridRef'
                        }))}
                    </Col>
                    <Col>
                         <NCCheckbox id = 'orgShowDisable' 
                            checked = {this.state.checked}
                            onChange = {this.onCheckboxChange.bind(this,'orgShowDisable')}
                            >{this.state.json['10100SSS-000030']/* 国际化处理： 显示停用*/}</NCCheckbox>
                    </Col>
                </Row>             
			    
                <Transfer 
                    ref={(item)=>{this.orgTransfer = item}} showSearch={true}
                />
                <div style={{marginTop: 10,marginBottom: 10,display: 'flex',justifyContent: 'center'}}>
                    <NCRadio.NCRadioGroup
                        style={{textAlign:'center'}}
                        name="oprType"
                        selectedValue={this.state.oprType}
                        onChange={this.handleOprTypeChange.bind(this)}>
                        <NCRadio value="0" >{this.state.json['10100SSS-000031']/* 国际化处理： 包含所有下级*/}</NCRadio>
                        <NCRadio value="1" >{this.state.json['10100SSS-000032']/* 国际化处理： 仅自己*/}</NCRadio>
                        <NCRadio value="2" >{this.state.json['10100SSS-000033']/* 国际化处理： 仅直接下级*/}</NCRadio>
                        <NCRadio value="3" >{this.state.json['10100SSS-000034']/* 国际化处理： 仅末级*/}</NCRadio>
                    </NCRadio.NCRadioGroup>
                </div>
			</div>
		);
    }


    onButtonClick(props,id){
        switch (id) {
            case 'add':
            //新增
                this.onAdd()
                break;
            case 'copy':
            //复制
                this.onCopy()
                break;
            case 'enable':
            //启用
                this.onEnable()
                break;
            case 'disable':
            //停用
                this.onDisable()
                break;
            case 'import':
            //引入
                this.onImportClick(1)
                break;
            case 'importstore':
            //引入仓库
                this.onImportDepotClick()
                break;
            case 'addvirtual': 
            //新增虚节点
                this.onAddMember()
               break;
            case 'adjust':
            //结构调整
                this.onSortClick()
                break;
            case 'upTop':
            //置于顶层
                this.setOrder('upTop');
                break;
            case 'upOne':
               //向上一层
               this.setOrder('upOne');
                break;
            case 'downOne':
            //向下一层
                this.setOrder('downOne');
                break;
            case 'downBottom':
               //置于底层
               this.setOrder('downBottom');
                break;
            case 'upgrade':
            //升级
                this.setOrder('upgrade');
                break;
            case 'degrade':
               //降级
               this.setOrder('degrade');
                break;
            case 'refresh':
            //刷新
                setDefData('stockstatstru_btnopr',props.config.datasource,'refresh');
                this.loadLeftTreeData(this.state.showOffDisable);
                break;
            case 'print':
                let pks = cacheTools.get('ssspks');
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    ajaxUrl.printUrl, 
                    {
                        //billtype:'',  //单据类型
                        funcode: props.config.appcode,      //功能节点编码，即模板编码
                        nodekey:'stockstastruprint',     //模板节点标识
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                );
                break;
            case 'export':
                let pks1 = cacheTools.get('ssspks');
                var data= {
                    appcode:'10100SSS',      //功能节点编码，即模板编码
                    nodekey:'stockstastruprint',     //模板节点标识
                    oids: pks1,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    outputType: "output"
                 }
                output({data: data,url:ajaxUrl.printUrl});
                
                // this.setState({
                //     pks: pks1
                //  },this.refs.printOutput.open());
                break;
            default:
                break;
        }
    }

    onSearch(value){
        this.setState({ searchValue:value });
        this.props.treeTableManyCol.searchTreeTable({ moduleId: rightTreeTable, 
            searchValue: value, filters: ['code','name'], expanded: true, defaultExpandAllRows: false})
    }

    render() {

        let { cardTable, form, button, modal, cardPagination,treeTable,table,editTable ,search,DragWidthCom,syncTree,treeTableManyCol,BillHeadInfo} = this.props;
        const {createCardPagination} = cardPagination;
        let buttons = this.props.button.getButtons();
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createTreeTable } = treeTable;
        let { createModal } = modal;
        let { createSimpleTable } = table;
        let {createSyncTree} = syncTree;
        let { treeTableCol } = treeTableManyCol;
        let { NCCreateSearch } = search;
        let { createEditTable } = editTable;
        const {createBillHeadInfo} = BillHeadInfo;

        return (
            <div className="bankPage nc-bill-tree-table">
                 {createModal('warning',{
                     title:this.state.json['10100SSS-000013'],/* 国际化处理： 关闭提醒*/
                     content:this.state.json['10100SSS-000014'],/* 国际化处理： 是否确定要关闭？*/
                })}
                {/*体系 编辑模态框*/}
                { createModal(sysModalId,{
                    title:this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000015'),/* 国际化处理： 库存统计体系*/
                    content:this.props.form.createForm(formId),
                    rightBtnName : this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000016'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onSaveSys.bind(this),
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000016'),// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000017'),/* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () =>{
                                this.props.modal.close(sysModalId);
                                //用于控制浏览器关闭提示语言
                                this.setState({
                                    editstate:'browse'
                                });
                            }   // 确定按钮点击调用函数,非必输
                        })
                    }
                }) }
                 {/*体系 删除模态框*/}
                {createModal(sysModalDelId,{
                     title:this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000039'),/* 国际化处理： 删除提醒*/
                     content:this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000024'),/* 国际化处理： 确定要删除数据吗？*/
                     userControl:false,//自己控制什么时候关闭窗口
                     beSureBtnClick:this.onDeleteSys.bind(this)
                })}
                 {/*库存统计体系成员管理- 编辑模态框*/}
                 { createModal(memberEditModalId,{
                    title:this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000020'),/* 国际化处理： 库存统计体系成员管理*/
                    content:function(){
                        return(
                            <div>
                                <div>
                                     {this.props.form.createForm(modelCard)}
                                     {/* <div> */}
                                        {/* <hr/> */}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl:true,//自己控制什么时候关闭窗口
                    beSureBtnClick:this.onSaveMember.bind(this),
                    rightBtnName : this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000016'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000016'),// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000017'),/* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () =>{
                                this.props.modal.close(memberEditModalId);
                                //用于控制浏览器关闭提示语言
                                this.setState({
                                    editstate:'browse'
                                });
                            }   // 确定按钮点击调用函数,非必输
                        })
                    }
                }) }
                 {/*体系成员- 引入操作模态框*/}
                 { createModal(importModalId,{
                    title:this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000021'),/* 国际化处理： 请选择要引入的组织*/
                    content:this.getImportDialog.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    rightBtnName : this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000016'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
                    beSureBtnClick:this.onImportSave.bind(this),
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000016'),// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000017'),/* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () =>{
                                pk_orgtypes = 'CORPORGTYPE000000000';
                                this.state.orgTypeName = this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000000');/* 国际化处理： 法人公司*/
                                this.props.modal.close(importModalId);
                                //用于控制浏览器关闭提示语言
                                this.setState({
                                    editstate:'browse'
                                });
                            }   // 确定按钮点击调用函数,非必输
                        })
                    }
                }) }

                 {/*删除模态框*/}
                 {createModal('delete')}
                
                 {/*库存统计体系成员- 结构调整模态框*/}
                 { createModal(memberSortModalId,{
                    title:this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000022'),/* 国际化处理： 结构调整*/
                    className:'structure',
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
                                        <div className="opr-botton">
                                            {createButtonApp({
                                                area: 'adjustmodel-button-area',
                                                buttonLimit: 5,
                                                onButtonClick: this.onButtonClick.bind(this),
                                                popContainer: document.querySelector('.adjustmodel-button-area')
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }.bind(this)(),	
                    userControl:true,//自己控制什么时候关闭窗口
                    rightBtnName : this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000016'), //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
                    //beSureBtnClick:this.onAdjustSave.bind(this),
                    noFooter:true,
                    cancelBtnClick: ()=>{//无法控制是否关闭模态框
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000016'),// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: this.props.MutiInit.getIntl("10100SSS") && this.props.MutiInit.getIntl("10100SSS").get('10100SSS-000023'),/* 国际化处理： 您确定要关闭吗？*/
                            beSureBtnClick: () =>{
                                this.onAdjustSave();
                                //用于控制浏览器关闭提示语言
                                this.setState({
                                    editstate:'browse'
                                });
                            }   // 确定按钮点击调用函数,非必输
                        })
                    }
                    // size:'sm'//模态框大小 sm/lg/xlg
                }) }

                {/* 标题 title */}
                <div className = 'nc-bill-header-area' style={{height:'auto',padding:'0'}}>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="header" >
                        {/* {createPageIcon()}
                        <h2 className="title">{this.props.config.title}</h2> */}
                        {createBillHeadInfo({
                            title: this.props.config.title,
                            initShowBackBtn:false
                        })}
                        <span className="showOff">
                        <NCCheckbox 
                            checked = {this.state.checked}
                            onChange = {this.onCheckShowDisable.bind(this)}
                            /*disabled = {this.state.showOffChecked}*/
                            >{this.state.json['10100SSS-000030']/* 国际化处理： 显示停用*/}</NCCheckbox>
                        </span>
                        {/* 按钮区  btn-group */}
                        <div className="btn-group">
                            {createButtonApp({
                                area: 'header-button-area',
                                buttonLimit: 5,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </NCDiv>
                </div>
                {/* 标题 主界面区域  左树--右树表*/}
                <div className="tree-table">
                    <DragWidthCom
                         //库存统计体系树
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
                        //库存统计体系成员---树状表
                        rightDom = {
                            <div className="treeTableCol">
                                {/* 树表搜索 */}
                                <Row style={{marginBottom: 10,marginTop: 10,marginLeft:10}}>
                                    <Col md={2} xs={2} sm={2}>
                                    <NCDiv areaCode={NCDiv.config.SEARCH}> 
                                        <NCFormControl
                                            fieldid="search"
                                            placeholder={this.state.json['10100SSS-000035'] }
                                            value={this.state.searchValue}
                                            onChange={this.onSearch.bind(this)}
                                            type="search"
                                            // disabled={this.state.searchDisable}
                                        />
                                        </NCDiv>
                                    </Col>
                                </Row>
                                <div className="version-head">
                                        { treeTableCol( rightTreeTable,{
                                            expandEve: this.expandEve.bind(this),//异步执行，点击加号展开子节点
                                            collapandEve:this.collapandEve.bind(this),//异步执行，点击加号收起子节点
                                            async:false,    //数据同步加载为false,异步加载为true
                                            showCheckBox:true,
                                            searchType:"filtration",
                                            checkedType:'radio',
                                            defaultExpandAll:true,   //初始化展开所有节点  ，默认参数为false,不展开
                                        } ) }
                                 </div>
                            </div>
                        }  
                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百 
                        leftMinWid = '300px'
                    />
                    <PrintOutput
                        ref='printOutput'
                        url={ajaxUrl.printUrl}
                        data={{
                            funcode:'10100SSS',      //功能节点编码，即模板编码
                            nodekey:'stockstastruprint',     //模板节点标识
                            oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                            outputType: "output"
                        }}
                        //callback={this.onSubmit}
                        >
                    </PrintOutput>
                </div>
            </div>
        )
    }
}

//初始化单据模板
var initTemplate = function(props) {
    props.createUIDom(
        {
            pagecode:props.config.pageCode//页面id
           // appcode:props.config.appcode//注册按钮的id
        },
        function (data){
            debugger
            if(data){
                if(data.template){
                    let meta = data.template;
                    let buttonAry =[];
                    data.button.map((obj)=>{
                        if(obj.hasOwnProperty('area')&&obj.hasOwnProperty('key')&&obj.area ==='line-button-area'){
                            buttonAry.push(obj.key);
                        }
                    });
                    debugger
                    modifierMeta(props, meta,buttonAry)
                    props.meta.setMeta(meta);
                }

                if(data.button){
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setPopContent('linedel', '确认要删除吗？'); /* 设置操作列上删除按钮的弹窗提示 */
                    props.button.setButtons(button);
                    //toggleShow(props);
                }

            }
        }
    )
}

let tableLineAry =(props)=>{
	return  [ 'lineedit','linedel' ];
} 

function modifierMeta(props, meta) {

    //列表界面添加操作列
    meta[rightTreeTable].items.push({
        attrcode: 'opr',
        label: props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000025'),/* 国际化处理： 操作*/
        itemtype:'customer',
        width: '200px',
        fixed: 'right',
        className: 'table-opr',
        visible: true,
        render: (text, record, index) => {

			let btnArray = tableLineAry(props);

			return props.button.createOprationButton(
				btnArray,
				{
					area: "line-button-area",
					buttonLimit: 3,
					onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
				}
			)
        }
    });

    return meta;
}

function tableButtonClick(props, id, text, record, index){

	switch(id){

        case 'lineedit':
            memberSaveType = 'edit';
            props.modal.show(memberEditModalId,{title:props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000020'),/* 国际化处理： 库存统计体系成员管理*/});
            props.form.setFormStatus(modelCard,'edit');
            // props.form.setFormStatus(reportOrgFormId,'edit');
            ajax({
                url:ajaxUrl.sssmembaddUrl,  
                data: {pk_sssmember:record.key,isdepot:false},
                success: (res) => {
                    if (res.success) {
                    let headData = res.data.memberForm.list.rows[0].values;
                    let meta = props.meta.getMeta()
                    meta[modelCard].items.map((obj)=>{
                        if(obj.attrcode == 'pk_fathermember'){
                            props.renderItem('form',modelCard, 'pk_fathermember', null);
                            obj.queryCondition = function () {
                                return {
                                    "pk_stockstatstru": headData.pk_sss.value
                                }
                            }
                        }
                        if(obj.attrcode == 'pk_org'){
                            //更改组建下面一行代码是必须的 props.renderItem(moduleType, moduleId, attrcode, null)
                            props.renderItem('form',modelCard, 'pk_org', null);
                            if(headData.reltype.value == 1){     
                                obj.refcode = 'uapbd/refer/org/CorpDefaultAllTreeRef/index.js';
                                obj.label=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000026');/* 国际化处理： 公司*/
                                obj.placeholder=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000027');/* 国际化处理： 公司所有*/
                                obj.refName=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000027');/* 国际化处理： 公司所有*/
                                obj.visible = true;
                            }
                            if(headData.reltype.value == 2){
                                obj.refcode = 'uapbd/refer/org/StockOrgAllGridRef/index.js';
                                obj.label=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000028');/* 国际化处理： 库存组织*/
                                obj.refName=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000028');/* 国际化处理： 库存组织*/
                                obj.placeholder=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000029');/* 国际化处理： 库存组织(所有)*/
                                obj.visible = true;
                            }
                            if(headData.reltype.value == 3){
                                obj.refcode = 'uapbd/refer/stordoc/StorDocDefaulteGridRef/index.js';
                                obj.label=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000009');/* 国际化处理： 仓库*/
                                obj.isShowUnit = true;
                                obj.refName=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000009');/* 国际化处理： 仓库*/
                                obj.placeholder=props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000009');/* 国际化处理： 仓库*/
                                obj.visible = true;
                            }
                            if(headData.reltype.value == 0){
                                obj.visible = false;
                            }
                        }
                    })
                    props.meta.setMeta(meta)
                    props.form.EmptyAllFormValue(modelCard);      
                    props.form.setAllFormValue({list:res.data.memberForm.list});        
                    }
                }
            });
            break
        case 'linedel':

            ajax({
                url:ajaxUrl.deletestockstatstrumembUrl,  
                data: {pk_sssmember:record.key},
                success: (res) => {
                    if (res.success) {
                        props.treeTableManyCol.delRowByPk(rightTreeTable,record);
                        toast({ color: 'success', content: props.MutiInit.getIntl("10100SSS") && props.MutiInit.getIntl("10100SSS").get('10100SSS-000037') });/* 国际化处理： 删除成功！*/
                    }
                }
            });
            break
		default:
			console.log(id,index);
			break;
	}
}


let OrgSysPage =  createPage({
    billinfo:[{
        billtype: 'form',
        pagecode: '10100SSS_stockstatstrumember',
        headcode: formId
    }],
    initTemplate: initTemplate,
    mutiLangCode: '10100SSS',
})(OrgSysPanel);
export default OrgSysPage

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65