//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, cacheTools,output, high, promptBox, getBusinessInfo, cardCache,createPageIcon } from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';
let { setDefData, getDefData } = cardCache;
let { NCCol: Col, NCRow: Row } = base;
const { PrintOutput } = high;
const { NCDatePicker, NCButton, NCPanel, NCCheckbox, NCPopconfirm, NCRadio,NCFormControl,NCDiv } = base;
import './index.less';

/**
 * 穿梭框--导入使用
 */
import Transfer from '../../../public/excomponents/Transfer';

//import TransferForMulti from '../../../public/excomponents/TransferForMulti';

//集团参照
import GroupDefaultTreeRef from '../../../refer/org/GroupDefaultTreeRef/index'


const NCTree = base.NCTree;

let leftTree = 'systemTree';//体系--左树id
let rightTreeTable = 'head'//成员--右树表id
let modelCard = 'list'//成员--修改的弹出框
let formId = 'card';//体系--编辑formid
let prodlines = 'prodlines';//分销库存体系增加子表table

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
let pk_orgtypes = ''//引入的组织类型
let pageId = '10100SAS_saleappendstrumember';            //pagecode
let appId = '0001Z010000000001KI5';

/**
 * AjaxUrl配置
 */
let ajaxUrl = {
    initUrl: '/nccloud/platform/templet/querypage.do',
    loadTreeDataUrl: "/nccloud/uapbd/saleappendstru/loadtreedata.do",
    querysasMemberUrl: "/nccloud/uapbd/saleappendstru/querycard.do",
    deletestockstatstruUrl: '/nccloud/uapbd/saleappendstru/delsas.do',
    saleappendstruqueryUrl: '/nccloud/uapbd/saleappendstru/saleappendstruquery.do',
    savestockstatstruUrl: '/nccloud/uapbd/saleappendstru/savesaleappendstru.do',
    sysCopySaveUrl: '/nccloud/uapbd/saleappendstru/saleappendstrucopysaveaction.do',
    sasmembaddUrl: '/nccloud/uapbd/saleappendstru/sasmembadd.do',
    savesasmembUrl: '/nccloud/uapbd/saleappendstru/savesasmemb.do',
    deletesasmemUrl: '/nccloud/uapbd/saleappendstru/delsasmenb.do',
    sasmemb4adjustUrl: '/nccloud/uapbd/saleappendstru/sasmem4adjustaction.do',
    setordertreenodeUrl: "/nccloud/uapbd/saleappendstru/setordertreenode.do",
    enablestateUrl: '/nccloud/uapbd/saleappendstru/enablestate.do',
    importDataQryUrl: "/nccloud/uapbd/saleappendstru/importtreedata.do",
    printUrl: '/nccloud/uapbd/saleappendstru/print.do',
    importSaveUrl: "/nccloud/uapbd/saleappendstru/sasmemimportsave.do"

}

/**
 * pageCode定义
 */
let pageCode = {
    mainPageCode: "10100SAS_saleappendstrumember"
}

/**
 * 分销补货体系
 * wangdca
 */
class OrgSysPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pks: [],
            oprType: '0',
            json: {},
            checked: false,//判断 显示停用按钮是否选中
            showOffDisable: true,
            showOffChecked: true,//判断 显示停用按钮是否选中
            showOffImportDisable: true,
            importLeftTreeData: [],
            importRightTreeData: [],
            editstate: 'browse',
            searchValue:'',
            expandKeys:[],
            refs: {}
        }
        this.initTemplate(props);
    }


    //初始化单据模板
    initTemplate = (props, callback) => {
        let that = this;
        createUIDom(props)(
            {
                pagecode: props.config.pageCode///页面id
                // appcode:props.config.appcode//注册按钮的id
            },
            {
                moduleId: '10100SAS', domainName: 'uapbd'
            },
            (data, langData) => { //(data, langData)
                if (langData) {
                    that.state.json = langData
                }
                if (data) {

                    if (data.template) {
                        let meta = data.template;
                        modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setPopContent('tabledel', props.MutiInit.getIntl("10100SAS") && props.MutiInit.getIntl("10100SAS").get('10100SAS-000022'));/* 设置操作列上删除按钮的弹窗提示 */
                        props.button.setButtons(button);
                        //toggleShow(props);
                    }
                    callback && callback();
                }
            }
        )
    }

    componentDidUpdate() {
        if (this.state.editstate === 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    componentDidMount() {
        //加载左树 默认不加载停用数据
        this.loadLeftTreeData(true);
    }

    //加载左树数据
    loadLeftTreeData(showDisable) {
        let that = this;
        ajax({
            url: ajaxUrl.loadTreeDataUrl,
            method: "post",
            data: { showDisable: showDisable, nodeType: this.props.nodeType },
            success: (res) => {
                if (res.success && res.data) {
                    //转换树的父子关系
                    let treeData = this.dealTreeData(res.data);
                    that.props.syncTree.setSyncTreeData(leftTree, treeData);
                    let saspks = [];
                    if (res.data) {
                        res.data.map((obj) => {
                            saspks.push(obj.id);
                        })
                    }
                    cacheTools.set('saspks', saspks);
                    //设置默认中第一行
                    let selectnode = that.props.syncTree.getSelectNode(leftTree);
                    selectnode ? that.props.syncTree.setNodeSelected(leftTree, selectnode.refpk):that.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk); 
                    that.props.syncTree.setNodeSelected(leftTree, res.data[0].refpk);
                    if (res.data[0].refpk !== 'root' && (res.data[0].nodeData.enablestate == '2' || (res.data[0].nodeData.enablestate !== '2'&& !showDisable))) {
                        that.onSelectEve(that.props.syncTree.getSelectNode(leftTree).refpk, null, true);
                    }
                    ;
                    that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                }
                if (!res.data) {
                    that.props.syncTree.setSyncTreeData(leftTree, []);
                    that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                }
                if (getDefData('saleappendstru_btnopr', that.props.config.datasource) == 'refresh') {
                    toast({ title: that.props.MutiInit.getIntl("10100SAS") && that.props.MutiInit.getIntl("10100SAS").get('10100SAS-000033'), color: 'success' });/* 国际化处理： 刷新成功*/
                }

            }
        });
        this.toggleShow();
    }

    /**
    * 删除提示
    */
    onDeleteSysEve(selectedTreeNode) {
        if (!selectedTreeNode) {
            toast({content: this.props.MutiInit.getIntl("10100SAS") && this.props.MutiInit.getIntl("10100SAS").get('10100SAS-000034'), color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
            return;
        }

        if(selectedTreeNode.hasOwnProperty('children') && selectedTreeNode.children.length>0){
            toast({content: this.props.MutiInit.getIntl("10100SAS") && this.props.MutiInit.getIntl("10100SAS").get('10100SAS-000035'), color: 'warning'});//默认top/* 国际化处理： 数据已被引用，不能删除！*/
            return;
        }
        deleteTreeNode = selectedTreeNode;
        promptBox({
            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.props.MutiInit.getIntl("10100SAS") && this.props.MutiInit.getIntl("10100SAS").get('10100SAS-000015'),/* 国际化处理： 删除提醒*/
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            hasCloseBtn:false,
            content:this.props.MutiInit.getIntl("10100SAS") && this.props.MutiInit.getIntl("10100SAS").get('10100SAS-000016'),/* 国际化处理： 确定要删除数据吗？*/
            beSureBtnClick: () =>{
                this.onDeleteSys();
            }   
        })
       /* deleteTreeNode = selectedTreeNode;
        this.props.modal.show(sysModalDelId);*/
    }
    //删除操作
    onDeleteSys() {
        let pk = deleteTreeNode.id;
        let that = this;
        ajax({
            url: ajaxUrl.deletestockstatstruUrl,
            method: "post",
            data: { pk_saleappendstru: pk },
            success: function (res) {
                that.props.syncTree.delNodeSuceess(leftTree, pk);
                that.props.modal.close(sysModalDelId);
                that.loadLeftTreeData(that.state.showOffDisable);
                toast({ color: 'success', content: that.props.MutiInit.getIntl("10100SAS") && that.props.MutiInit.getIntl("10100SAS").get('10100SAS-000023') });/* 国际化处理： 删除成功！*/
            }
        });
    }
    //选择左树加载右表数据 控制启用停用按钮
    onSelectEve(data, item, isChange) {
        cacheTools.set('pk_sas', data);
        if (isChange) {
            //加载成员树表
            let that = this;
            ajax({
                url: ajaxUrl.querysasMemberUrl,
                method: "post",
                data: { pk_sas: data },
                success: function (res) {
                    if (res.success) {
                        if (res.data) {
                            //后台返回的是表格的数据  需要构造成树状表的数据
                            let datas = that.props.treeTableManyCol.createNewData(res.data.head.rows);
                            //根据树状表的数据构造树表
                            that.props.treeTableManyCol.initTreeTableData(rightTreeTable, datas, 'refpk');

                            // 加载展开的节点
                            that.expandTreeNode();
                        } else {
                            that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                        }

                    }
                }
            });
        }
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
    toggleShow() {

        let selectNode = this.props.syncTree.getSelectNode(leftTree);

        var btns1 = ['enable', 'disable', 'copy', 'import', 'adjust', 'print', 'export'];
        if (!selectNode) {
            this.props.button.setButtonDisabled([...btns1], true);
            this.setState({
                showOffChecked: true
            });
            // this.props.button.setButtonDisabled(['orgmoduleperiod','createinnercustsupp','logomanage','editVAT','orgmanager','attachconfig'],true);
            // this.props.button.setButtonDisabled(['print','export','version','financeorgversion','liabilitycenterversion','hrorgversion','adminorgversion'],true);
        } else {
            this.props.button.setButtonDisabled([...btns1], false);
            this.setState({
                showOffChecked: false
            });
            // this.props.button.setButtonDisabled(['enable','disable','version','auxiliary','printpage','setroot','setadminorgroot','setcorproot','back','delete','more'],false);
            // this.props.button.setButtonDisabled(['orgmoduleperiod','createinnercustsupp','logomanage','editVAT','orgmanager','attachconfig'],false);
            // this.props.button.setButtonDisabled(['print','export','version','financeorgversion','liabilitycenterversion','hrorgversion','adminorgversion'],false);
        }


        if (selectNode) {//更新停用启用按钮
            let enablestate = selectNode.nodeData.enablestate;
            if (enablestate === '2') {//启用状态
                this.props.button.setButtonDisabled(['disable'], false);
                this.props.button.setButtonDisabled(['enable'], true);
                // this.props.button.setButtonsVisible({
                //     disable:true,
                //     enable:false,
                // });
            } else {
                this.props.button.setButtonDisabled(['disable'], true);
                this.props.button.setButtonDisabled(['enable'], false);
                // this.props.button.setButtonsVisible({
                //     disable:false,
                //     enable:true,
                // });
            }
        }
    }
    onMouseEnterEve(key) {
        // if(key === "资金管理体系--全局"){
        //     let obj = {
        //         delIcon:false,
        //         editIcon:false,
        //         addIcon:true
        //     };
        //     this.props.syncTree.hideIcon( leftTree, key, obj )
        // }else{
        //     let obj = {
        //         delIcon:true,
        //         editIcon:true,
        //         addIcon:false
        //     };
        //     this.props.syncTree.hideIcon( leftTree, key, obj )
        // }
    }
    //显示停用
    onCheckShowDisable(checked) {
        this.setState(
            { checked: !this.state.checked },
            () => {
                this.state.showOffDisable = !this.state.showOffDisable
                let showDisable = this.state.showOffDisable;
                this.loadLeftTreeData(showDisable)
            }
        );
    }
    //新增 -- 体系
    onAdd() {
        sysSaveType = 'add';
        setDefData('saleappendstru_btnopr', this.props.config.datasource, 'addIcon');
        this.openSysModal('');
    }
    //复制
    onCopy() {
        sysSaveType = 'copy';
        this.openSysModal(this.props.syncTree.getSelectNode(leftTree).id);
    }
    //启用
    onEnable() {
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        let that = this;

        promptBox({
            color: 'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: that.state.json['10100SAS-000000'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            hasCloseBtn: false,
            content: that.state.json['10100SAS-000001'],/* 国际化处理： 您确定要启用吗？*/
            beSureBtnClick: () => {
                ajax({
                    url: ajaxUrl.enablestateUrl,
                    method: "post",
                    data: { pk_saleappendstru: selectNode.id, enablestate: "2" },
                    success: function (res) {
                        if (res.success) {
                            toast({ color: 'success', title: that.state.json['10100SAS-000002'] });/* 国际化处理： 启用成功！*/
                            //更新树节点
                            //let treeData = that.dealTreeData(res.data);
                            that.props.syncTree.editNodeSuccess(leftTree, res.data);
                            //手动刷新界面
                            that.loadLeftTreeData(that.state.showOffDisable);
                            that.toggleShow();
                        }
                    }
                });
            }
        })
        // this.props.modal.show('delete',{
        //     title:'提示',
        //     content: "您确定要启用吗？",
        //     noFooter : false, //是否需要底部按钮,默认true
        //     userControl:false,//自己控制什么时候关闭窗口
        //     beSureBtnClick:() =>{
        //         ajax({
        //             url:ajaxUrl.enablestateUrl,
        //             method:"post",
        //             data:{pk_saleappendstru:selectNode.id,enablestate:"2"},
        //             success:function(res){
        //                 if(res.success){
        //                     //更新树节点
        //                     //let treeData = that.dealTreeData(res.data);
        //                     that.props.syncTree.editNodeSuccess(leftTree, res.data);
        //                     //手动刷新界面
        //                     that.loadLeftTreeData(that.state.showOffDisable);
        //                     that.toggleShow();
        //                 }
        //             }
        //         });
        //     }
        // }); 
    }
    //停用
    onDisable() {
        let selectNode = this.props.syncTree.getSelectNode(leftTree);
        let that = this;

        promptBox({
            color: 'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: that.state.json['10100SAS-000000'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
            hasCloseBtn: false,
            content: that.state.json['10100SAS-000003'],/* 国际化处理： 您确定要停用吗？*/
            beSureBtnClick: () => {
                ajax({
                    url: ajaxUrl.enablestateUrl,
                    method: "post",
                    data: { pk_saleappendstru: selectNode.id, enablestate: "1" },
                    success: function (res) {
                        if (res.success) {
                            toast({ color: 'success', title: that.state.json['10100SAS-000031'] });/* 国际化处理： 启用成功！*/
                            //更新树节点
                            //let treeData = that.dealTreeData(res.data);
                            that.props.syncTree.editNodeSuccess(leftTree, res.data);
                            //手动刷新界面
                            that.loadLeftTreeData(that.state.showOffDisable);
                            that.toggleShow();
                        }
                    }
                });
            }   // 确定按钮点击调用函数,非必输
        })
    }
    /**
     * 编辑
     */
    onEditSys(selectedTreeNode) {
        sysSaveType = 'edit';
        setDefData('saleappendstru_btnopr', this.props.config.datasource, 'editIcon');
        this.openSysModal(selectedTreeNode.id);
    }
    //体系编辑窗口
    openSysModal(pk) {
        if(sysSaveType == 'add'){
            this.props.form.EmptyAllFormValue(formId);
            this.props.form.setFormStatus(formId,'add');
        }else{
            this.props.form.setFormStatus(formId,'edit');
        }
        this.props.cardTable.setStatus(prodlines, 'edit');
        //this.props.form.setFormStatus(prodlines, 'edit');
        this.props.form.EmptyAllFormValue(formId);
        let that = this;

        ajax({
            url: ajaxUrl.saleappendstruqueryUrl,
            method: "post",
            data: { pk_sas: pk, nodeType: that.props.nodeType, queryType: sysSaveType },
            success: function (res) {
                if (res.success) {
                    //弹出体系编辑窗口
                    that.props.modal.show(sysModalId, { title: that.state.json['10100SAS-000010'] });
                    if (res.data.head) {
                        Utils.filterEmptyData(res.data.head.card.rows[0].values);
                        that.props.form.setAllFormValue({ card: res.data.head.card });
                        that.props.form.setFormItemsDisabled(formId, { enablestate: true });//设置表单项不可用
                        // let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
                        //this.setState({title_code});
                    }

                    if (res.data.body && pk != null && pk != undefined & pk != '') {
                        that.props.cardTable.setTableData(prodlines, res.data.body[prodlines]);
                    } else {
                        that.props.cardTable.setTableData(prodlines, { rows: [] });
                    }

                    //查询时执行显示公式前端适配
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                [formId]:"form",
                                [prodlines]:"cardTable"
                            }
                        );
                    }
                    // that.props.form.setAllFormValue(res.data);
                }
            }
        });

        //用于控制浏览器关闭提示语言
        this.setState({
            editstate: 'edit'
        });
    }

    onCloseSys() {
        this.props.modal.close(sysModalId);
        //用于控制浏览器关闭提示语言
        this.setState({
            editstate: 'browse'
        });
    }

    onAfterEvent(props, moduleId, key, value, changedrows, index, record, type, method) {
        debugger
        props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_prodline',
            { value: value.refpk, display: value.refname })
    }
    //体系保存 
    onSaveSys() {
        let flag = this.props.form.isCheckNow(formId);
        if (!flag) {
            return;
        }
        let meta = this.props.meta.getMeta();
        // let formdata = this.props.form.getAllFormValue(formId);
        let formdata = this.props.createMasterChildData(pageId, formId, prodlines);

        //formdata.areacode = formId;//添加表单的areacode编码

        // let requestParam = {
        //     model: formdata,
        //     // nodeType:this.props.nodeType,  //参数报错，？？？
        //     pageid: pageId//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        // };
        let that = this;
        let saveurl = ajaxUrl.savestockstatstruUrl;
        if (sysSaveType === 'copy') {
            saveurl = ajaxUrl.sysCopySaveUrl;
        }

        //校验公式
        this.props.validateToSave( formdata , ()=>{
            ajax({
                url: saveurl,
                method: "post",
                data: formdata,
                success: (res) => {
                    if (res.success) {
                        let treeData = that.dealTreeData(res.data);
                        if (sysSaveType === 'add' || sysSaveType === 'copy') {//新增树节点
                            that.props.syncTree.addNodeSuccess(leftTree, treeData);
                        } else {//修改树节点
                            that.props.syncTree.editNodeSuccess(leftTree, treeData);
                        }
                        toast({ color: 'success', title: that.state.json['10100SAS-000004'] });/* 国际化处理： 保存成功！*/
                        //没有刷新树节点，所以手动刷新一次
                        that.loadLeftTreeData(that.state.showOffDisable);
                        that.props.modal.close(sysModalId);
                        //用于控制浏览器关闭提示语言
                        that.setState({
                            editstate: 'browse'
                        });
                    }
                }
            });
        } ,{[formId]:'form',[prodlines]:'cardTable'} , 'card' )

        
    }

    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data) {
        let deleteDataChildrenProp = function (node) {
            node.iconBox = {
                delIcon: true,
                editIcon: true,
                addIcon: true
            }
            if (!node.children || node.children.length == 0) {
                delete node.children;
            }
            else {
                node.isLeaf = false;
                node.children.forEach((e) => {
                    deleteDataChildrenProp(e);
                });
            }
        };
        data && data.forEach((e) => {
            e.iconBox = {
                delIcon: true,
                editIcon: true,
                addIcon: true
            }
            deleteDataChildrenProp(e);
        });
        return data;
    }


    //成员修改保存
    onSaveMember() {
        let that = this;
        let memberFlag = this.props.form.isCheckNow(modelCard);
        if (!memberFlag) {
            return;
        }
        let formdata = this.props.form.getAllFormValue(modelCard);

        formdata.areacode = modelCard;//添加表单的areacode编码

        let requestParam = {
            model: formdata,
            pageid: pageCode.mainPageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };

        //适配校验公式
        this.props.validateToSave( requestParam , ()=>{
            ajax({
                url: ajaxUrl.savesasmembUrl,
                method: "post",
                data: requestParam,
                // data:requestParam,
                success: function (res) {
                    if (res.success) {
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        //根据树状表的数据构造树表
                        //后台返回的是表格的数据  需要构造成树状表的数据s
                        // if (memberSaveType === 'edit') {
                        //     that.props.treeTableManyCol.editRowEve(rightTreeTable, res.data.head.rows[0]);
                        // } else {
                        //     that.props.treeTableManyCol.addChildRowEve(rightTreeTable, res.data.head.rows[0]);
                        // }
                        that.loadLeftTreeData(that.state.showOffDisable)
                        toast({ color: 'success', title: that.state.json['10100SAS-000004'] });/* 国际化处理： 保存成功！*/
                        that.props.modal.close(memberEditModalId);
                        //用于控制浏览器关闭提示语言
                        that.setState({
                            editstate: 'browse'
                        });
                    }
                }
            });
        }  ,{[modelCard]:'form'} , 'form' )      
    }

    //========================= 体系成员引入=========================
    onImportClick() {
        //校验成员只能有一个根节点
        let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if ((allMember && allMember.length > 0) && ((!selectMember) || selectMember.length < 1)) {
            toast({ content: this.state.json['10100SAS-000005'], color: 'warning' });/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
            return;
        }
        this.setState();
        this.onImportDataLoad.call(this, false);
        //弹出引入窗口
        this.props.modal.show(importModalId, { title: this.state.json['10100SAS-000019'] });
    }

    //引入时是否显示停用的组织
    onShowDisableOrg(checked) {
        this.setState(
            { checked: !this.state.checked },
            () => {
                this.state.showOffImportDisable = !this.state.showOffImportDisable
                let showDisableOrg = this.state.showOffImportDisable;
                this.onImportDataLoad.call(this, showDisableOrg);
            }
        );
    }

    onImportDataLoad(showDisableOrg) {
        let that = this;
        let pk = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url: ajaxUrl.importDataQryUrl,
            method: "post",
            data: { showDisable: showDisableOrg, pk_sas: pk },
            success: function (res) {
                if (res.success) {
                    //弹出引入窗口
                    that.orgTransfer.setRootTitle(getBusinessInfo().groupName + '-' + that.state.json['10100SAS-000006'])/* 国际化处理： 库存*/
                    if (res.data) {
                        that.orgTransfer.reset(res.data);
                    } else {
                        that.orgTransfer.reset([]);
                    }
                    // that.orgTransfer.setMoveType('0');
                    that.orgTransfer.setMoveType(that.state.oprType);

                    // //importLeftTreeData使用的是对象，不能直接赋值（会更新对象的地址导致界面不会刷新），只能更新对象中的值
                    // that.state.importLeftTreeData.splice(0,that.state.importLeftTreeData.length);
                    // that.state.importRightTreeData.splice(0,that.state.importRightTreeData.length);
                    // if(res.data && res.data.length > 0){
                    //     res.data.forEach((item,index) =>  {
                    //         that.state.importLeftTreeData.push(item);
                    //     });
                    // }

                    // that.setState({
                    //     // importDataValue:{
                    //     //     importLeftTreeData : res.data?res.data:[],
                    //     // },
                    //     importLeftTreeData:that.state.importLeftTreeData,
                    //     importRightTreeData : that.state.importRightTreeData
                    // });
                }
            }
        });
    }
    //体系成员引入保存
    onImportSave() {
        var orgs = this.orgTransfer.getData();
        if (!(orgs && orgs.length > 0)) {
            // alert('您没有选择任何数据！');
            toast({ content: this.state.json['10100SAS-000007'], color: 'warning' });/* 国际化处理： 您没有选择任何数据！*/
            return;
        }

        // if(!(this.state.importRightTreeData&&this.state.importRightTreeData.length>0)){
        //     toast({content : '您没有选择任何数据！',color : 'warning'});
        //     return;
        // }
        //let orgs= [];
        // let count = this.convertToTable(this.state.importRightTreeData,orgs);

        // //可以一次引入有上下级关系的多条数据，如果没有上下级关系，则只能引入一条根节点
        // let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        // if(allMember.length == 0 &&  count > 1 ){
        //     toast({content : '组织体系内的成员树只能有一个根节点,请在单击"引入"按钮前选中一个组织或者在引入对话框右侧选择一个节点作为新选入数据的上级节点',color : 'warning'});
        //     return;
        // }

        let pk_sas = this.props.syncTree.getSelectNode(leftTree).id;
        let that = this;
        //获取选中的成员作为引入数据的根节点
        let pk_sasmember = '';
        let pk_membeorg = '';
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if (selectMember && selectMember.length > 0) {
            pk_sasmember = selectMember[0].rowId;
            pk_membeorg = selectMember[0].values.pk_org.value;
        }
        ajax({
            url: ajaxUrl.importSaveUrl,
            method: "post",
            data: { orgs, pk_sas: pk_sas, pk_sasmember: pk_sasmember, pk_membeorg: pk_membeorg },
            success: function (res) {
                if (res.success) {
                    if (res.data) {//返回全新的数据 刷新界面
                        //后台返回的是表格的数据  需要构造成树状表的数据
                        let datas = that.props.treeTableManyCol.createNewData(res.data.head.rows);
                        //根据树状表的数据构造树表
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                        that.props.treeTableManyCol.initTreeTableData(rightTreeTable, datas, 'refpk');
                    } else {
                        that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    }
                    that.props.modal.close(importModalId);
                    //用于控制浏览器关闭提示语言
                    that.setState({
                        editstate: 'browse'
                    });
                }
            }
        });
    }

    /**
    * 将树数据转换为表数据，提供给第三步生成表格数据使用
    */
    convertToTable = (orgTree, data) => {
        let count = 0;
        orgTree.forEach((item, index) => {
            if (item.pid == '~' || item.pid == undefined) {
                count = count + 1;
            }
            data.push(item);
            if (item.children && item.children.length > 0) {
                this.convertToTable(item.children, data);
            }
        });
        return count;
    }

    /**
	 * 切换树节点移动方式
	 */
    handleOprTypeChange(value) {
        this.setState({
            oprType: value
        });
    }

    createCfg(id, param) {
        var obj;
        if (id === 'GroupDefaultTreeRef') {
            obj = {
                value: this.state.refs[id] ? this.state.refs[id].value : [],
                onChange: function (val) {
                    var temp = Object.assign(this.state.refs[id], { value: val });
                    this.setState(Object.assign(this.state.refs, temp));
                    if (pk_importGroup !== temp.value.refpk) {
                        pk_importGroup = temp.value.refpk;
                        this.onImportClick();
                    }
                }.bind(this)
            }
        }
        this.state.refs[id] = obj;
        var result_param = Object.assign(obj, param)
        return result_param;
    }

    //数据选择监听事件
    handelBeforeMove(type, leftdata, rightdata, selectKeys) {
        // let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
        // let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        // if('bl2r' == type && ((!selectMember)||selectMember.length<1)&&(value.rightTreeData.length == 1)){
        //     alert("组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据");
        //     return false;
        // }
        if (type === 'l2r') {
            return this.checkBeforeMove(selectKeys);
        }
        return true;
    }

    checkBeforeMove(nodes) {
        let returnResult = true
        nodes.forEach((item, index) => {
            if (item.nodeData.isMember) {
                toast({ content: item.refname + this.state.json['10100SAS-000008'], color: 'warning' });/* 国际化处理： 在体系中已经存在，请重新选择*/
                //alert(item.refname + '在体系中已经存在，请重新选择');
                returnResult = false;
                return returnResult
            }
            if (item.children && item.children.length > 0) {
                this.checkBeforeMove(item.children);
            }
        });
        return returnResult;
    }
    // checkBeforeMove(nodes){
    //     // let returnResult = true
    //     nodes.forEach((item,index)=>{
    //         if(item.nodeData.isMember){
    //             toast({content : item.refname + '在体系中已经存在，请重新选择',color : 'warning'});
    //             return false;
    //             // returnResult = false;
    //             // return false;
    //         }
    // 		if(item.children&&item.children.length > 0){
    // 			this.checkBeforeMove(item.children);
    // 		}
    //     });
    //     // return returnResult;
    // }

    getImportDialog() {
        let businessInfo = getBusinessInfo();
        return (
            <div id="org_transfer" className="steps-content" style={{height:'450px'}}>
                <Row  style={{marginBottom:'5px'}}>
                    <Col md={4} xs={4} sm={4}>
                        {GroupDefaultTreeRef({} = this.createCfg("GroupDefaultTreeRef", {
                            value: {
                                refpk: businessInfo.groupId,
                                refname: businessInfo.groupName
                            },
                            disabled: 'browse',
                            queryCondition: function () {
                                return {
                                    //此处可以添加参数
                                    // isShowDisabledData: true,
                                    // pk_reportcombinestru: this.props.syncTree.getSelectNode(leftTree).id
                                };
                            }.bind(this),
                            filedid: 'GroupDefaultTreeRef'
                        }))}
                    </Col>
                    <Col>
                        <NCCheckbox id='orgShowDisable'
                            checked={this.state.checked}
                            onChange={this.onShowDisableOrg.bind(this)}
                            disabled={this.state.showOffChecked}
                        >{this.state.json['10100SAS-000025']/* 国际化处理： 显示停用*/}</NCCheckbox>
                    </Col>
                </Row >
                <div className='tree-modal'>
                    <Transfer
                        ref={(item) => { this.orgTransfer = item }} showSearch={true}
                    // TransferId={'org_transferid'} 
                    // // leftTreeData={this.state.importLeftTreeData} 
                    // // rightTreeData={this.state.importRightTreeData}
                    // // value={this.state.importDataValue}
                    // oprType={this.state.oprType}
                    //onBeforeEvent={this.handelBeforeMove.bind(this)}
                    />
                    {/*
                    <TransferForMulti 
                        TransferId={'org_transferid'} 
                        leftTreeData={this.state.importLeftTreeData} 
                        rightTreeData={this.state.importRightTreeData}
                        // value={this.state.importDataValue} 
                        oprType={this.state.oprType}
                        hiddenAllMoveBtns={false}
                        beforeMove={this.handelBeforeMove.bind(this)}
                    />
                    */}
                </div>
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <NCRadio.NCRadioGroup
                        style={{ textAlign: 'center',width: '100%'}}
                        name="oprType"
                        selectedValue={this.state.oprType}
                        onChange={this.handleOprTypeChange.bind(this)}>
                        <NCRadio value="0" >{this.state.json['10100SAS-000026']/* 国际化处理： 包含所有下级*/}</NCRadio>
                        <NCRadio value="1" >{this.state.json['10100SAS-000027']/* 国际化处理： 仅自己*/}</NCRadio>
                        <NCRadio value="2" >{this.state.json['10100SAS-000028']/* 国际化处理： 仅直接下级*/}</NCRadio>
                        <NCRadio value="3" >{this.state.json['10100SAS-000029']/* 国际化处理： 仅末级*/}</NCRadio>
                    </NCRadio.NCRadioGroup>
                </div>
            </div>
        );
    }

    onSortClick() {
        let pk_saleappendstru = this.props.syncTree.getSelectNode(leftTree).id;
        ajax({
            url: ajaxUrl.sasmemb4adjustUrl,
            method: "post",
            data: { pk_saleappendstru: pk_saleappendstru },
            success: (res) => {
                if (res.success) {
                    //转换树的父子关系
                    if (res.data) {
                        let treeData = this.dealTreeData(res.data);
                        this.props.syncTree.setSyncTreeData(memberSortTreeId, treeData);
                    } else {
                        this.props.syncTree.setSyncTreeData(memberSortTreeId, []);
                    }
                    this.props.modal.show(memberSortModalId, { title: this.state.json['10100SAS-000020'] });
                }
            }
        });
    }

    onMouseEnterSortTreeEve(key) {
        let obj = {
            delIcon: false,
            editIcon: false,
            addIcon: false
        };
        this.props.syncTree.hideIcon(memberSortTreeId, key, obj)
    }

    setOrder(orderType) {
        let selected = this.props.syncTree.getSelectNode(memberSortTreeId)
        if (!selected) {
            toast({ content: this.state.json['10100SAS-000009'], color: 'warning' });/* 国际化处理： 请选择要操作的数据！*/
        }
        let pk_sasmember = selected.id;
        ajax({
            url: ajaxUrl.setordertreenodeUrl,
            method: "post",
            data: { pk_sasmember: pk_sasmember, orderType: orderType },
            success: (res) => {
                if (res.success) {
                    //转换树的父子关系
                    let treeData = this.dealTreeData(res.data);
                    this.props.syncTree.setSyncTreeData(memberSortTreeId, treeData);
                    this.props.modal.show(memberSortModalId, { title: this.state.json['10100SAS-000020'] });
                }
            }
        });
    }

    buttonClick(props, id) {
        let _this = this;
        switch (id) {
            case 'add':
                props.form.EmptyAllFormValue(formId)
                _this.onAdd();
                _this.toggleShow(this.props);
                break;
            case 'copy':
                _this.onCopy(); break;
            case 'enable':
                _this.onEnable();
                break
            case 'disable':
                _this.onDisable();
                break
            case 'import':
                _this.onImportClick();
                break
            case 'adjust':
                _this.onSortClick();
                break
            case 'addline':
                _this.props.cardTable.addRow(prodlines);
                break
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
                //
                setDefData('saleappendstru_btnopr', props.config.datasource, 'refresh');
                this.loadLeftTreeData(true);
                break;
            case 'print':
                let pks = cacheTools.get('saspks');
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    ajaxUrl.printUrl,
                    {
                        //billtype:'',  //单据类型
                        funcode: props.config.appcode,      //功能节点编码，即模板编码
                        nodekey: 'saleappendstruCardPrint',     //模板节点标识
                        oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    }
                );
                break;
            case 'export':
                let pks1 = cacheTools.get('saspks');
                
                var data={
                    funcode: '10100SAS',      //功能节点编码，即模板编码
                    nodekey: 'saleappendstruCardPrint',     //模板节点标识
                    oids: pks1,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                    outputType: "output"
                }
                output({data: data,url:ajaxUrl.printUrl});
                break;
            default:
                break
        }
    }

    //获取列表肩部信息
    getTableHead() {
        let { button } = this.props;
        let { createButtonApp } = button;
        let buttons = this.props.button.getButtons();
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'table-opr-area',//按钮注册中的按钮区域
                        onButtonClick: this.buttonClick.bind(this),

                    })}
                    {this.props.cardTable.createBrowseIcons(prodlines, {
                        iconArr: ['close', 'open', 'max', 'setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>
            </div>
        )
    }


    onAdjustSave() {
        this.onSelectEve(cacheTools.get('pk_sas'), null, true);
        this.props.modal.close(memberSortModalId);
    }

    onSearch(value){
        this.setState({ searchValue:value });
        this.props.treeTableManyCol.searchTreeTable({ moduleId: rightTreeTable, 
            searchValue: value, filters: ['code','name'], expanded: true, defaultExpandAllRows: false})
    }

    render() {
        const { button, syncTree, modal, DragWidthCom, cardTable, treeTable, form, treeTableManyCol, editTable,BillHeadInfo } = this.props;
        const { createTreeTable } = treeTable;
        const { createEditTable } = editTable;
        let { createButtonApp } = button;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { treeTableCol } = treeTableManyCol;
        let { createSyncTree } = syncTree;
        let { createModal } = modal;
        const {createBillHeadInfo} = BillHeadInfo;
        return (
            <div className="bankPage nc-bill-tree-table">
                {/*体系 编辑模态框*/}
                {createModal(sysModalId, {
                    title: this.state.json['10100SAS-000010'],/* 国际化处理： 分销补货体系*/
                    content: function () {
                        return (
                            <div>
                                <div>
                                    {createForm(formId)}
                                    {createCardTable(prodlines, {
                                        tableHead: this.getTableHead.bind(this),
                                        modelSave: this.onSaveSys.bind(this),
                                        onAfterEvent: this.onAfterEvent.bind(this),
                                        showIndex: true
                                    })}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true,//自己控制什么时候关闭窗口
                    rightBtnName: this.state.json['10100SAS-000011'], //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
                    closeModalEve: this.onCloseSys.bind(this),
                    beSureBtnClick: this.onSaveSys.bind(this),
                    cancelBtnClick: () => {//无法控制是否关闭模态框
                        promptBox({
                            color: 'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100SAS-000000'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn: false,
                            content: this.state.json['10100SAS-000012'],/* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this.props.modal.close(sysModalId);
                                //用于控制浏览器关闭提示语言
                                this.setState({
                                    editstate: 'browse'
                                });
                            }   // 确定按钮点击调用函数,非必输
                        })
                        // this.props.modal.show('warning',{
                        //     beSureBtnClick:()=>{
                        //         this.props.modal.close(sysModalId);
                        //         this.props.modal.close('warning');
                        //     }
                        // });
                    }
                })}
                {createModal('warning', {
                    title: this.state.json['10100SAS-000013'],/* 国际化处理： 关闭提醒*/
                    content: this.state.json['10100SAS-000014'],/* 国际化处理： 是否确定要关闭？*/
                })}
                {/*体系 删除模态框*/}
                {createModal(sysModalDelId, {
                    title: this.state.json['10100SAS-000015'],/* 国际化处理： 删除提醒*/
                    content: this.state.json['10100SAS-000016'],/* 国际化处理： 确定要删除数据吗？*/
                    userControl: false,//自己控制什么时候关闭窗口
                    beSureBtnClick: this.onDeleteSys.bind(this)
                })}
                {/*预算组织体系成员- 编辑模态框*/}
                {createModal(memberEditModalId, {
                    title: this.state.json['10100SAS-000017'],/* 国际化处理： 分销补货体系成员管理*/
                    leftBtnName: this.state.json['10100SAS-000018'],/* 国际化处理： 保存*/
                    content: function () {
                        return (
                            <div>
                                <div>
                                    {this.props.form.createForm(modelCard)}
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true,//自己控制什么时候关闭窗口
                    cancelBtnClick: () => {//无法控制是否关闭模态框
                        promptBox({
                            color: 'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100SAS-000000'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn: false,
                            content: this.state.json['10100SAS-000012'],/* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this.props.modal.close(memberEditModalId);
                                //用于控制浏览器关闭提示语言
                                this.setState({
                                    editstate: 'browse'
                                });
                            }   // 确定按钮点击调用函数,非必输
                        })
                    },
                    beSureBtnClick: this.onSaveMember.bind(this)
                })}
                {/*体系成员- 引入操作模态框*/}
                {createModal(importModalId, {
                    title: this.state.json['10100SAS-000019'],/* 国际化处理： 请选择要引入的组织*/
                    content: this.getImportDialog.bind(this)(),
                    userControl: true,//自己控制什么时候关闭窗口
                    rightBtnName: this.state.json['10100SAS-000011'], //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
                    beSureBtnClick: this.onImportSave.bind(this),
                    cancelBtnClick: () => {//无法控制是否关闭模态框
                        promptBox({
                            color: 'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100SAS-000000'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn: false,
                            content: this.state.json['10100SAS-000012'],/* 国际化处理： 您确定要取消吗？*/
                            beSureBtnClick: () => {
                                this.props.modal.close(importModalId);
                                //用于控制浏览器关闭提示语言
                                this.setState({
                                    editstate: 'browse'
                                });
                            }   // 确定按钮点击调用函数,非必输
                        })
                    }
                })}

                {/*删除模态框*/}
                {createModal('delete')}

                {/*体系成员- 结构调整模态框*/}
                {createModal(memberSortModalId, {
                    title: this.state.json['10100SAS-000020'],/* 国际化处理： 结构调整*/
                    className: 'struct',
                    content: function () {
                        return (
                            <div class="ncc-hr-contain">
                                <div class="ncc-hr-left-tree nc-theme-gray-area-bgc">
                                    <div class="ncc-hr-padding">
                                        {createSyncTree({
                                            treeId: memberSortTreeId,
                                            showLine: true,
                                            needSearch: false,
                                            defaultExpandAll: true,   //初始化展开所有节点  ，默认参数为false,不展开
                                            onMouseEnterEve: this.onMouseEnterSortTreeEve.bind(this),//鼠标滑过节点事件
                                            showModal: false
                                        })}
                                    </div>
                                </div>
                                <div class="ncc-hr-right-operate nc-theme-gray-area-bgc">
                                    <div class="ncc-hr-padding">
                                        <div className="opr-botton">
                                            {createButtonApp({
                                                area: 'adjustmodel-button-area',
                                                buttonLimit: 5,
                                                onButtonClick: this.buttonClick.bind(this),
                                                popContainer: document.querySelector('.adjustmodel-button-area')
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }.bind(this)(),
                    userControl: true,//自己控制什么时候关闭窗口
                    rightBtnName: this.state.json['10100SAS-000011'], //左侧按钮名称,默认关闭/* 国际化处理： 取消*/
                    //beSureBtnClick:this.onAdjustSave.bind(this),
                    noFooter: true,
                    cancelBtnClick: () => {//无法控制是否关闭模态框
                        promptBox({
                            color: 'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: this.state.json['10100SAS-000000'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn: false,
                            content: this.state.json['10100SAS-000021'],/* 国际化处理： 您确定要关闭吗？*/
                            beSureBtnClick: () => {
                                this.onAdjustSave();
                                //用于控制浏览器关闭提示语言
                                this.setState({
                                    editstate: 'browse'
                                });
                            }   // 确定按钮点击调用函数,非必输
                        })
                        // this.props.modal.show('warning',{
                        //     beSureBtnClick:()=>{
                        //         pk_orgtypes = 'CORPORGTYPE000000000';
                        //         orgTypeName = '法人公司';
                        //         this.props.modal.close(importModalId);
                        //         this.props.modal.close('warning');
                        //     }
                        // });
                    }
                    // size:'sm'//模态框大小 sm/lg/xlg
                })}

                {/* 标题 title */}
                <div className = 'nc-bill-header-area' style={{height:'auto',padding:'0'}}>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="header" >
                        {/* {createPageIcon()}
                        <h2 className="title" >{this.state.json['10100SAS-000032']}</h2> */}
                        {createBillHeadInfo({
                            title: this.state.json['10100SAS-000032'] /* 国际化处理： 分销补货体系 */,
                            initShowBackBtn:false
                        })}
                        <span className="showOff">
                            <NCCheckbox
                                checked={this.state.checked}
                                onChange={this.onCheckShowDisable.bind(this)}
                            >{this.state.json['10100SAS-000025']/* 国际化处理： 显示停用*/}</NCCheckbox>
                        </span>
                        {/* 按钮区  btn-group */}
                        <div className="btn-group">
                            {createButtonApp({
                                area: 'header-button-area',//按钮注册中的按钮区域
                                //buttonLimit: 5, 
                                onButtonClick: this.buttonClick.bind(this)
                                //popContainer: document.querySelector('.header-button-area')
                            })}

                        </div>
                    </NCDiv>
                </div>
                {/* 标题 主界面区域  左树--右树表*/}
                <div className="tree-table">
                    <DragWidthCom
                        //资金管理体系树
                        leftDom={
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId: leftTree,
                                    showLine: true,
                                    clickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调
                                    clickDelIconEve: this.onDeleteSysEve.bind(this), // 删除点击 回调
                                    clickAddIconEve: this.onAdd.bind(this), //新增点击 回调
                                    onSelectEve: this.onSelectEve.bind(this),   //选择节点回调方法
                                    defaultExpandAll: true,   //初始化展开所有节点  ，默认参数为false,不展开
                                    searchType:'filtration',//树节点过滤方式修改
                                    onMouseEnterEve: this.onMouseEnterEve.bind(this),//鼠标滑过节点事件
                                    showModal: false
                                })}
                            </div>
                        }
                        //资金管理体系成员---树状表
                        rightDom={
                            <div className="treeTableCol">
                                {/* 树表搜索 */}
                                <Row style={{marginBottom: 10,marginTop: 10,marginLeft:10}}>
                                    <Col md={2} xs={2} sm={2}>
                                    <NCDiv areaCode={NCDiv.config.SEARCH}> 
                                        <NCFormControl
                                            fieldid="search"
                                            placeholder={this.state.json['10100SAS-000032'] }
                                            value={this.state.searchValue}
                                            onChange={this.onSearch.bind(this)}
                                            type="search"
                                            // disabled={this.state.searchDisable}
                                        />
                                        </NCDiv>
                                    </Col>
                                </Row>
                                <div className="version-head">
                                    {treeTableCol(rightTreeTable, {
                                        expandEve: this.expandEve.bind(this),//异步执行，点击加号展开子节点
                                        collapandEve:this.collapandEve.bind(this),//异步执行，点击加号收起子节点
                                        async: false,    //数据同步加载为false,异步加载为true
                                        defaultExpandAll: true,   //初始化展开所有节点  ，默认参数为false,不展开
                                        showCheckBox: true,       // 是否显示复选框 ,默认false不显示
                                        checkedType: 'radio'      // 勾选方式，单选radio,多选 checkbox； 默认多选
                                    })}
                                </div>
                            </div>
                        }
                        defLeftWid='280px'      // 默认左侧区域宽度，px/百分百 
                        leftMinWid = '300px'
                    />
                    <PrintOutput
                        ref='printOutput'
                        url={ajaxUrl.printUrl}
                        data={{
                            funcode: '10100SAS',      //功能节点编码，即模板编码
                            nodekey: 'saleappendstruCardPrint',     //模板节点标识
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


function tableButtonClick(props, id, text, record, index) {

    switch (id) {

        case 'tableedit':
            memberSaveType = 'edit';
            props.modal.show(memberEditModalId, { title: props.MutiInit.getIntl("10100SAS") && props.MutiInit.getIntl("10100SAS").get('10100SAS-000017') });
            props.form.setFormStatus(rightTreeTable, 'edit');
            // props.form.setFormStatus(reportOrgFormId,'edit');
            ajax({
                url: ajaxUrl.sasmembaddUrl,
                data: { pk_sasmember: record.key },
                success: (res) => {
                    if (res.success) {
                        let headData = res.data.memberForm.head.rows[0].values;
                        let meta = props.meta.getMeta()
                        meta[modelCard].items.map((obj) => {
                            if (obj.attrcode == 'pk_fathermember') {
                                props.renderItem('form', modelCard, 'pk_fathermember', null);
                                obj.queryCondition = function () {
                                    return {
                                        "pk_sas": headData.pk_sas.value
                                    }
                                }
                            }
                        })
                        props.meta.setMeta(meta)
                        props.form.setFormStatus(modelCard, "edit");
                        props.form.EmptyAllFormValue(modelCard);

                        props.form.setAllFormValue({ list: res.data.memberForm.head });
                    }
                }
            });
            break
        case 'tabledel':
            ajax({
                url: ajaxUrl.deletesasmemUrl,
                data: { pk_sasmember: record.key },
                success: (res) => {
                    if (res.success) {
                        props.treeTableManyCol.delRowByPk(rightTreeTable, record);
                        toast({ color: 'success', content: props.MutiInit.getIntl("10100SAS") && props.MutiInit.getIntl("10100SAS").get('10100SAS-000023') });/* 国际化处理： 删除成功！*/
                    }
                }
            });
            // props.modal.show('delete',{
            //     title:'提示',
            //     content: "您确定要删除吗？",
            //     noFooter : false, //是否需要底部按钮,默认true
            //     userControl:false,//自己控制什么时候关闭窗口
            //     beSureBtnClick:() =>{
            //         ajax({
            //             url:ajaxUrl.deletesasmemUrl,  
            //             data: {pk_sasmember:record.key},
            //             success: (res) => {
            //                 if (res.success) {
            //                     props.treeTableManyCol.delRowByPk(rightTreeTable,record);
            //                     toast({ color: 'success', content: '删除成功！' });
            //                 }
            //             }
            //         });
            //     }
            // });            
            break
        case "delline"://删除行
            props.cardTable.delRowsByIndex(prodlines, index);
            break;
        default:
            console.log(id, index);
            break;
    }
}


let tableBtnAry = (props) => {
    return ['delline'];
}

let tableLineAry = (props) => {
    return ['tableedit', 'tabledel'];
}

function modifierMeta(props, meta) {

    let porCol = {
        attrcode: 'opr',
        label: props.MutiInit.getIntl("10100SAS") && props.MutiInit.getIntl("10100SAS").get('10100SAS-000024'),// this.state.json['10100SAS-000024'],/* 国际化处理： 操作*/
        visible: true,
        className: 'table-opr',
        width: '200px',
        itemtype: 'customer',
        fixed: 'right',
        render(text, record, index) {

            let btnArray = tableBtnAry(props);

            return props.button.createOprationButton(
                btnArray,
                {
                    area: "tableline-opr-area",
                    buttonLimit: 3,
                    onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                }
            )
        }
    };
    //新增库存体系时候，行操作按钮
    meta[prodlines].items.push(porCol);

    //列表界面添加操作列
    meta[rightTreeTable].items.push({
        attrcode: 'opr',
        label: props.MutiInit.getIntl("10100SAS") && props.MutiInit.getIntl("10100SAS").get('10100SAS-000024'),   //  this.state.json['10100SAS-000024'],/* 国际化处理： 操作*/
        itemtype: 'customer',
        width: '200px',
        fixed: 'right',
        className: 'table-opr',
        dataIndex: 'btnCol',
        visible: true,
        render: (text, record, index) => {

            let btnArray = tableLineAry(props);

            return props.button.createOprationButton(
                btnArray,
                {
                    area: "tableline-button-area",
                    buttonLimit: 3,
                    onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                }
            )


        }
    });

    return meta;
}

let OrgSysPage = createPage({
    billinfo:[{
        billtype: 'card',
        pagecode: '10100SAS_saleappendstrumember',
        headcode: formId,
        bodycode: prodlines
    }],
    //initTemplate: initTemplate,
    mutiLangCode: '10100SAS'
})(OrgSysPanel);
export default OrgSysPage

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65