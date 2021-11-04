//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, NCCreateSearch, toast, print, high ,promptBox,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
const { PrintOutput,ExcelImport } = high;
let { NCMessage: Message, NCCol: Col, NCRow: Row, NCDropdown: Dropdown, NCMenu: Menu, NCButton: Button, NCCheckbox: Checkbox, NCTooltip: Tooltip } = base;
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
import DeptVersion from '../../../org/dept/version';
import DeptTreeVersion from '../../../org/dept/treeversion';
import  Utils from '../../../public/utils';
import './index.less'
import Orgmanager from '../../../org/orgmanager/main';
import AssignStepModal from '../deptcopymodal/AssignStepModal';
const { NCMenu, NCDropdown, NCCheckbox, NCPopconfirm,NCDiv } = base;
const { NCMenuGroup } = NCMenu;
const { Item } = Menu;
//设置预算相关信息的初始值
let editLoadData=false;//编辑时数据加载状态（主要为编辑态时用于维护预算表单数据）
let editFormStatus=false;//编辑时表单状态（主要为编辑态时用于维护预算表单数据）
let planbudgetData={
    rows:[
        {
            rowid:null,
            status:0,
            values:{
                pk_planbudget:{
                    value:null,
                    display:null
                },
                enablestate:{
                    value:null,
                    display:null
                },
                datasource:{
                    value:null,
                    display:null
                }
            }
        }
    ]
};
/****************默认参数  开始***********************/
let formId = 'dept';//卡片组件Id
let appcode = '10100DEPT';
let pageCode = "10100DEPT_dept";
let urls = {
    isretailqry:'/nccloud/baseapp/dept/isretailqry.do',
    addvalidator:'/nccloud/baseapp/dept/addvalidator.do',
    checkdatapermission: '/nccloud/baseapp/dept/datapermission.do',
    print: '/nccloud/baseapp/dept/print.do',
    treeversionqry: '/nccloud/baseapp/dept/treeversionqry.do',
    treeversion: '/nccloud/baseapp/dept/treeversion.do',
    version: '/nccloud/baseapp/dept/version.do',
    versionqry: '/nccloud/baseapp/dept/versionqry.do',
    loadTreeDataUrl: "/nccloud/baseapp/dept/treeQuery.do",
    queryCardUrl: "/nccloud/baseapp/dept/cardquery.do",
    saveCard: "/nccloud/baseapp/dept/cardsave.do",
    deleteCard: "/nccloud/baseapp/dept/carddel.do",//删除
    enableCard: "/nccloud/baseapp/dept/cardenable.do",//启用
    disableCard: "/nccloud/baseapp/dept/carddisable.do"//停用
    //enablestateUrl:"/nccloud/org/postseries/PostSeriesIsEnableAction.do",
    //addCardUrl:"/nccloud/org/postseries/PostSeriesAddAction.do",
    //deleteUrl:'/nccloud/org/postseries/PostSeriesDelAction.do',
    //saveUrl:'/nccloud/org/postseries/PostSeriesSaveAction.do'
};
/***************默认参数  结束********************/
/**
 * 集团
 */
class DeptCard extends Component {
    constructor(props) {
        super(props)
        this.config = Object.assign({
            treeId: "deptTree",
            formId: "dept",
            pageCode: "10100DEPT_dept",
            nodeType: 'GROUP_NODE',
            isGlbGrp: '1',
            billType:'dept',
            urls: urls
        }, props.config);

        //主动事件，绑定this指针
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);

        //显示停用复选框的状态标志
        this.state = {
            json:this.props.config.json,//多语资源文件数据
            isShowPlanBudge:'N',//是否显示预算信息
            status: 'browse',//标记页面状态，控制参照查询区 的显隐性
            ids: [],
            versionparam: {},
            treeversionparam: {},
            enablestate: 'N',
            curOrg: { pk_org: '', name: '' },//当前选择的业务单元
            checked: false,//判断 显示停用按钮是否选中
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            cacheRefPk:this.props.cacheRefPk,//卡片跳转列表，再跳转到卡片的情况下，cacheRefPk维护第一次卡片页面左侧树选中节点pk
            pk_dept: this.props.getUrlParam('id')?this.props.getUrlParam('id'):'' //选中树节点
        }

        //超链接跳转时获取部门主键，并查询出对应的组织数据，用于数据预加载
        let linkPk_dept=this.props.getUrlParam('id');
        let linkOrgInfo={};
        if(linkPk_dept){
            //部门超链接跳转页面初始化
            ajax({
                url: this.config.urls.queryCardUrl,
                data: { pk_dept: linkPk_dept },
                success: (result) => {
                    if (result.success) {
                        result.data[this.config.formId].rows.forEach((row) => {
                            //取出部门所属组织信息，用于预加载业务单元主组织参照
                            linkOrgInfo=row.values['pk_org'];
                            this.initPage(this,props,linkOrgInfo,linkPk_dept,()=>{
                                this.onSelectTree(linkPk_dept);
                            });
                        })
                    }
                }
            });
        }else{
            this.initPage(this,props);
        }
    }

    initPage(_this,props,linkOrgInfo,pk_dept,loadFormData){
        //加载多语资源
		Utils.initPage(
			props,
			props.config.pageCode,
			'10100DEPT',//多语资源编码
			(data)=>{
                if(data.button){
                    let button = data.button;
                    //props.button.setButtons(button);
                    let excelimportconfig = excelImportconfig(props,'riaorg','dept',true,'',{appcode: '10100DEPT',pagecode: "10100DEPT_dept"},()=>{
                        this.loadDept({ enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org },
                            this.props.syncTree.getSelectNode(this.config.treeId)
                        );//选中后开始加载部门数据
                        if (!this.props.syncTree.getSelectNode(this.config.treeId) || this.props.syncTree.getSelectNode(this.config.treeId).refpk == '~') {
                            this.props.form.EmptyAllFormValue(this.config.formId);
                        } else {
                            this.onSelectTree(this.props.syncTree.getSelectNode(this.config.treeId).refpk);
                    }
                });
                    props.button.setUploadConfig("import",excelimportconfig);
                    props.button.setButtons(data.button);
                }   
                let meta=data.template;
                //负责人参照加上特殊条件
                let principalItem = meta['dept'].items.find(item => item.attrcode === 'principal');
                principalItem.isShowUnit = true;
                principalItem.unitCondition = () => {
                    return {
                        "isMutiGroup": "Y"
                    }
                };
                let chargeleader = meta['dept'].items.find(item => item.attrcode === 'chargeleader');
                chargeleader.isShowUnit = true;
                chargeleader.unitCondition = () => {
                    return {
                        "isMutiGroup": "Y"
                    }
                };

                //如果个性化设置了默认业务单元，则自动带出主组织参照
                if(linkOrgInfo){
                    _this.state.curOrg.pk_org=linkOrgInfo.value;
                    _this.state.curOrg.name=linkOrgInfo.display;
                }else{
                    if(data.context&&data.context.pk_org){
                        _this.state.curOrg.pk_org=data.context.pk_org;
                        _this.state.curOrg.name=data.context.org_Name;
                    };
                }
                props.createUIDom(
                    {
                        pagecode: '10100ORG_planbudget',//,//页面id
                        appcode: '10100ORG'//注册按钮的id
                    }, 
                    function (planData){
                        if(planData){
                            if(planData.template){
                                let planBudgetMeta = planData.template;
                                meta['planbudget']=planBudgetMeta['planbudget'];
                                meta['gridrelation']={
                                    planbudget:{
                                        destBrowseAreaCode:"planbudget",
                                        destEditAreaCode:["planbudget"],
                                        srcAreaCode:"planbudget",
                                        tabRelation:["planbudget"]
                                    }
                                }
                                props.meta.setMeta(meta);
                            }
                        } 
                    }
                );

                //自定义根节点
                _this.root = {
                    "isleaf": false,
                    "key": "~",
                    "title": _this.state.json['10100DEPT-000000'],/* 国际化处理： 部门*/
                    "id": "~",
                    "innercode": "~",
                    "pid": "",
                    "refname": _this.state.json['10100DEPT-000000'],/* 国际化处理： 部门*/
                    "refpk": "~"
                };
                return meta;
			},
			()=>{
				let data = [Object.assign({ ..._this.root }, { children: null })];
                _this.props.syncTree.setSyncTreeData(_this.config.treeId, _this.dealTreeData(data));
                _this.props.button.setButtonsVisible({
                    copy: true,
                    query: true,
                    moreVersion: true,
                    orgmanager: true,
                    print: true,
                    refresh: true,
                    save: false,
                    saveAdd: false,
                    cancel: false,
                    enable: true,
                    disable: true
                });

                _this.setButtonDisable();

                //如果个性化设置了默认业务单元，需要预加载所有数据
                ajax({
                    url: urls['isretailqry'],
                    data: {pk_org:_this.state.curOrg.pk_org},
                    success: (result) => {
                        if(result.success&&result.data){
                            _this.onOrgChange({
                                refpk:_this.state.curOrg.pk_org,
                                refname:_this.state.curOrg.name,
                                values:{
                                    isretail:{
                                        value:(result.data['isretail']==true?'Y':'N')
                                    }
                                }
                            },{refpk:pk_dept});
                            if(loadFormData instanceof Function){
                                loadFormData();
                            }
                        }
                    }
                });
            },
            _this
		);
    }

    componentDidUpdate(){
		if(this.props.form.getFormStatus(this.config.formId) === 'edit'||this.props.form.getFormStatus(this.config.formId) === 'add'){
			window.onbeforeunload=()=>{
				return '';
			}
		}else{
			window.onbeforeunload=null;
		}
	}
    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data) {
        let deleteDataChildrenProp = function (node) {
            node.beforeName=node.code?(node.code+'  '):'';
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
        data.forEach((e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

    setButtonDisable() {
        //if (!this.props.syncTree.getSelectNode(this.config.treeId) || this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk) {
            if (!this.state.pk_dept || this.state.pk_dept == this.root.refpk) {
            //根节点设置按钮不可用 
            this.props.button.setDisabled({
                version: true,
                enable: true,
                disable: true,
                orgmanager: true,
                print: true,
                export: true
            });
        } else {
            this.props.button.setDisabled({
                version: false,
                enable: false,
                disable: false,
                orgmanager: false,
                print: false,
                export: false
            });
        }
        if (!this.state.curOrg.pk_org || this.state.curOrg.pk_org.length == 0) {
            //如果业务单元没有数据，需要停用复制和部门树版本化按钮
            this.props.button.setDisabled({
                copy: true,
                treeversion: true
            });
        } else {
            this.props.button.setDisabled({
                copy: false,
                treeversion: false
            });
        }
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk,prompt) {
        this.setState(
            {pk_dept : refpk},
            () => {
                this.selectTree(refpk,prompt);
            } 
        );
    }

    selectTree(refpk,prompt) {
        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(this.config.formId);
        if (status == 'edit') {
            return;
        }
        this.setButtonDisable();
        if (refpk == this.root.refpk) {
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            //如果刷新成功，需要给出提示
			if(prompt&&(prompt instanceof Function)){
                prompt();
            }
            return;
        }
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        ajax({
            url: this.config.urls.queryCardUrl,
            data: { pk_dept: refpk },
            success: (result) => {

                if (result.success) {
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    if (result.data && result.data[this.config.formId]) {
                        //适配显示公式
                        if(result.formulamsg&&result.formulamsg instanceof Array&&result.formulamsg.length>0){
                            this.props.dealFormulamsg(
                                result.formulamsg,
                                {
                                    "dept":"form",
                                    "versioninfo":"form",
                                    "definfo":"form",
                                    "auditinfo":"form"
                                }
                            );
                        }

                        result.data[this.config.formId].rows.forEach((row) => {
                            //这里加上是否显示预算相关信息的逻辑
                            if(row.values['orgtype17'].value == true){
                                this.state.isShowPlanBudge='Y';
                                //获取预算信息
                                row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].datasource={
                                        value:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].datasource,
                                        display:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].datasource
                                    },
                                row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].enablestate={
                                        value:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].enablestate,
                                        display:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].enablestate==2?this.state.json['10100DEPT-000001']:this.state.json['10100DEPT-000002']/* 国际化处理： 启用,停用*/
                                    }
                                row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_planbudget={
                                    value:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_planbudget,
                                    display:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_planbudget
                                    }
                                row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_vid={
                                    value:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_vid,
                                    display:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_vid
                                    }
                                //维护预算数据
                                planbudgetData={
                                    rows:[
                                        {
                                            rowid:null,
                                            status:0,
                                            values:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000']
                                        }
                                    ]
                                };
                            }else{
                                //查询出来的数据如果不是预算部门，需要清掉预算相关的表单数据信息
                                this.state.isShowPlanBudge='N';
                                planbudgetData={
                                    rows:[
                                        {
                                            rowid:null,
                                            status:0,
                                            values:{
                                                pk_planbudget:{
                                                    value:null,
                                                    display:null
                                                },
                                                enablestate:{
                                                    value:'2',
                                                    display:this.state.json['10100DEPT-000001']/* 国际化处理： 启用*/
                                                },
                                                datasource:{
                                                    value:null,
                                                    display:null
                                                }
                                            }
                                        }
                                    ]
                                };
                            }
                            this.setState(this.state);

                            row.values['displayorder'].value = row.values['displayorder'].value == '999999' ? null : row.values['displayorder'].value;
                            //判断启用状态，设置停启用按钮的可用性
                            if (row.values['enablestate'].value == 2) {
                                this.props.button.setDisabled({
                                    enable: true,
                                    disable: false
                                });
                            } else {
                                this.props.button.setDisabled({
                                    enable: false,
                                    disable: true
                                });
                            }

                            //这里需要处理editLoadData和editFormStatus的数据处理逻辑
                            editLoadData=true;
                            if(editFormStatus){
                                if(row.values['orgtype17'].value == true){
                                    planbudgetData.rows[0].values['status']={
                                        value:'1',//编辑态数据状态全部维护为修改
                                        display:this.state.json['10100DEPT-000003']/* 国际化处理： 修改*/
                                    }
                                }
                                //还原状态数据
                                editLoadData=false;
                                editFormStatus=false;
                            }
                            //维护完数据状态后，即可设置预算表单相关的数据
                            this.props.form.setAllFormValue({ ['planbudget']: planbudgetData });
                        });
                        this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });
                        //如果刷新成功，需要给出提示
                        if(prompt&&(prompt instanceof Function)){
                            prompt();
                        }
                    }
                }
            }
        });
    }

    /**
     * 表单编辑事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index) {
        switch (key) {
            case "enablestate":

                //获得选中节点
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);

                if (!selectedTreeNode) {
                    let content = value.value ? this.state.json['10100DEPT-000004'] : this.state.json['10100DEPT-000005'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    toast({ content: content, color: 'warning' });//默认top
                    return;
                }

                //集团不允许维护全局下的数据
                if (this.config.isGlbGrp == '1' && !selectedTreeNode.nodeData.isModify) {
                    toast({ content: this.state.json['10100DEPT-000006'], color: 'warning' });//默认top/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
                    return;
                }

                let requestParam = { pk_postseries: selectedTreeNode.refpk, enablestate: value.value ? '2' : '1' };

                props.modal.show('modal', {
                    color: "warning",
                    title: this.state.json['10100DEPT-000007'],/* 国际化处理： 提示*/
                    content: value.value ? this.state.json['10100DEPT-000008'] : (selectedTreeNode.isLeaf == false ? this.state.json['10100DEPT-000009'] : this.state.json['10100DEPT-000010']),/* 国际化处理： 确认启用该数据？,您确定要停用所选数据及其所有下级数据吗？,确认停用该数据？*/
                    beSureBtnClick: () => {
                        ajax({
                            url: this.config.urls.enablestateUrl,
                            data: requestParam,
                            success: (result) => {
                                toast({ title: value.value ? this.state.json['10100DEPT-000011'] : this.state.json['10100DEPT-000012'], color: "success" });/* 国际化处理： 启用成功！,停用成功！*/
                            }
                        });
                    },
                    cancelBtnClick: () => {

                        props.form.setFormItemsValue(this.config.formId, { enablestate: true });
                        return;
                    }
                });



                break;
            case 'orgtype17':
                if(value.value){
                    //勾选了预算，需要加载预算相关的模板信息
                    this.state.isShowPlanBudge='Y';
                    if(planbudgetData.rows[0].values['pk_planbudget'].value){
                        planbudgetData.rows[0].values['status']={
                            value:'1',
                            display:this.state.json['10100DEPT-000003']/* 国际化处理： 修改*/
                        }
                    }else{
                        planbudgetData.rows[0].values['status']={
                            value:'2',
                            display:this.state.json['10100DEPT-000013']/* 国际化处理： 新增*/
                        }
                    }
                    this.props.form.setAllFormValue({ ['planbudget']: planbudgetData });
                }else{
                    this.state.isShowPlanBudge='N';
                    //将数据状态维护为删除，方便后台业务逻辑判断
                    planbudgetData.rows[0].values['status']={
                        value:'3',
                        display:this.state.json['10100DEPT-000014']/* 国际化处理： 删除*/
                    }
                    if(planbudgetData.rows[0].values['pk_planbudget'].value){
                        this.props.form.setAllFormValue({ ['planbudget']:  planbudgetData});
                    }else{
                        this.props.form.EmptyAllFormValue('planbudget');
                    }
                    //将数据状态维护为删除，方便后台业务逻辑判断
                    planbudgetData.rows[0].values['status']={
                        value:'3',
                        display:this.state.json['10100DEPT-000014']/* 国际化处理： 删除*/
                    }
                }
                this.setState(this.state);
            default:
                break;
        }
        //some code
    }

    /**
     * 新增
     */
    onAddEps(selectNode) {
		this.props.syncTree.setNodeSelected(this.config.treeId, selectNode.refpk);
        this.onButtonClick(this.props, 'add');
    }

    /**
     * 编辑
     */
    onEditEps(selectedTreeNode) {
        this.props.syncTree.setNodeSelected(this.config.treeId, selectedTreeNode.refpk);
        this.onSelectTree(selectedTreeNode.refpk);
        this.onButtonClick(this.props, 'update');
    }

    /**
     * 删除
     */
    onDeleteEps(selectedTreeNode) {
        this.props.syncTree.setNodeSelected(this.config.treeId, selectedTreeNode.refpk);
        this.onSelectTree(selectedTreeNode.refpk);
        this.onButtonClick(this.props, 'delete');
    }

    /*****button group end*****/

    /**
     * 查询按钮点击事件 貌似没用？？？？？
     * @param props
     * @param val
     */
    onClickSearchBtn(props, val) {
        let url = "/uapbd/eps/main/list/index.html";
        //获得查询区域条件
        let param = {};
        if (val != null) {
            val.map((e) => {

                param[e.field] = e.value.firstvalue;
            });
        }


        props.linkTo(
            url, param
        );
    }

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(selectedTreeNode, id) {
        switch (id) {
            case 'add':
            case 'saveAdd':
                this.props.button.setButtonVisible('save', true);
                this.props.button.setButtonVisible('saveAdd', true);
                this.props.button.setButtonVisible('cancel', true);
                this.props.button.setDisabled({
                    save: false,
                    saveAdd: false,
                    cancel: false
                });
                break;
            case 'edit':
                this.props.button.setButtonVisible('save', true);
                this.props.button.setButtonVisible('saveAdd', false);
                this.props.button.setButtonVisible('cancel', true);
                this.props.button.setDisabled({
                    save: false,
                    cancel: false
                });
                break;
            case 'del':
                this.props.button.setButtonVisible('save', false);
                this.props.button.setButtonVisible('saveAdd', false);
                this.props.button.setButtonVisible('cancel', false);
                break;
            case 'save':
            case 'cancel':
                this.props.button.setButtonVisible('save', false);
                this.props.button.setButtonVisible('saveAdd', false);
                this.props.button.setButtonVisible('cancel', false);
            default:
                break;
        }
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key) {
        //设置
        if (key === this.root.refpk) {
            let obj = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj);
        }

    }

    /**
     * checkbox change 事件
     */
    onCheckBoxChange(checked) {
        this.state.checked = !this.state.checked;
        this.setState(this.state);
        if (!this.state.checked) {
            this.setState({ enablestate: 'N' });
        } else {
            this.setState({ enablestate: 'Y' });//-1标识显示所有，2标识显示启用
        }

        if (!this.state.curOrg.pk_org) {
            return;
        }

        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

        setTimeout(() => {
            let requestParam = { enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org };
            this.loadDept(requestParam, selectNode);

        }, 10);

    }

    /**
     * checkbox 选中事件
     */
    onCheckBoxClick() {

        this.setState({ checked: !this.state.checked });
        this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
    }

    //部门树版本化回调函数取vname信息
    getMemo(vname) {
        this.setState({ treeversionparam: { vname: vname, vbegindate: this.state.treeversionparam.vbegindate, veffectdate: this.state.treeversionparam.veffectdate, pk_org: this.state.curOrg.pk_org } });
    }

    //部门树版本化
    treeVersion() {
        //这里需要校验当前部门数据的版本开始日期,即每天只能版本化一次数据
        let vstartstr = this.state.treeversionparam.vbegindate;//2018/08/22 00:00:00  2018/08/22 00:00:00
        
        if(vstartstr){
            vstartstr = vstartstr.replace(/-/g, '/');
            let vstartdate = new Date(vstartstr);
            let sysdatestr = new Date();
            sysdatestr = sysdatestr.getFullYear() + '/' + ((sysdatestr.getMonth() + 1) < 10 ? ('0' + (sysdatestr.getMonth() + 1)) : (sysdatestr.getMonth() + 1)) + '/' + (sysdatestr.getDate() < 10 ? ('0' + sysdatestr.getDate()) : sysdatestr.getDate()) + ' 00:00:00'
            let sysdate = new Date(sysdatestr);
            if (!(vstartdate.getTime() < sysdate.getTime())) {
                //此时，不允许作部门版本化
                toast({ content: this.state.json['10100DEPT-000015'], title: this.state.json['10100DEPT-000016'], color: "warning" });/* 国际化处理： 一天最多只能生成一个版本!,注意*/
                //this.props.modal.show('modal');
                return;
            }           
        }
        let param = this.state.treeversionparam;//树版本化参数
        if((!this.state.treeversionparam.vname)||this.state.treeversionparam.vname.length==0){
            toast({ content: this.state.json['10100DEPT-000018'], color: 'warning' });//默认top/* 国际化处理： 新版本说明不能为空！*/
            //this.props.modal.show('modal');
            return;
        }
        
        ajax({
            url: urls['treeversion'],
            data: param,
            success: (result) => {
                if (result.success) {
                    toast({ title: this.state.json['10100DEPT-000019'], color: "success" });/* 国际化处理： 版本化成功！*/
                    this.setState({
                        treeversionparam:{}
                    })
                    this.props.modal.close('modal');
                }
            }
        })
    }

    //部门版本化回调函数取vname信息 
    getVname(vname) {
        this.setState({ versionparam: { vno: this.state.versionparam.vno, effectdate: this.state.versionparam.effectdate, vname: vname, pk_dept: this.props.syncTree.getSelectNode(this.config.treeId).refpk } });
    }

    //部门版本化
    version() {
        //部门版本化，如果没有填写版本说明，不允许操作，并给出提示
        if((!this.state.versionparam.vname)||this.state.versionparam.vname.length==0){
            toast({title:this.state.json['10100DEPT-000018'],color:"warning"});/* 国际化处理： 新版本说明不能为空！*/
            return false;
        }
        //这里需要校验当前部门数据的版本开始日期,即每天只能版本化一次数据
        let vstartstr = this.props.form.getFormItemsValue(this.config.formId, 'vstartdate').value;//2018/08/22 00:00:00  2018/08/22 00:00:00
        vstartstr = vstartstr.replace(/-/g, '/');
        let vstartdate = new Date(vstartstr);
        let sysdatestr = new Date();
        sysdatestr = sysdatestr.getFullYear() + '/' + ((sysdatestr.getMonth() + 1) < 10 ? ('0' + (sysdatestr.getMonth() + 1)) : (sysdatestr.getMonth() + 1)) + '/' + (sysdatestr.getDate() < 10 ? ('0' + sysdatestr.getDate()) : sysdatestr.getDate()) + ' 00:00:00'
        let sysdate = new Date(sysdatestr);
        if (!(vstartdate.getTime() < sysdate.getTime())) {
            //此时，不允许作部门版本化
            toast({ content: this.state.json['10100DEPT-000021'], title: this.state.json['10100DEPT-000016'], color: "warning" });/* 国际化处理： 一天最多只能生成一个版本！,注意*/
            return;
        }

        let param = this.state.versionparam;//树版本化参数

        param.vstartdate = sysdatestr;//下个开始日期

        ajax({
            url: urls['version'],
            data: param,
            success: (result) => {
                if (result.success) {
                    //版本化成功需要将form表单中版本生肖事件更新
                    this.props.form.setFormItemsValue(this.config.formId, { 'vstartdate': { 'value': sysdatestr, 'display': sysdatestr } });
                    toast({ title: this.state.json['10100DEPT-000019'], color: "success" });/* 国际化处理： 版本化成功！*/
                    this.setState({
                        versionparam:{}
                    })
                    this.props.modal.close('modal');
                }
            }
        })
    }

    //部门复制
    copyDept() {
        alert(this.state.json['10100DEPT-000022']);/* 国际化处理： 部门复制*/
    }

    //卡片区状态监听，用于调整按钮状态
    updateButtonStatus() {
        if (this.props.form.getFormStatus(formId) && this.props.form.getFormStatus(formId) != 'browse') {//编辑状态
            this.props.button.setButtonsVisible({
                copy: false,
                query: false,
                moreVersion: false,
                orgmanager: false,
                print: false,
                import:false,
                export_card: false,
                refresh: false,
                save: true,
                saveAdd: true,
                cancel: true,
                enable: false,
                disable: false
            });
        } else {//浏览态
            this.props.button.setButtonsVisible({
                copy: true,
                query: true,
                moreVersion: true,
                orgmanager: true,
                print: true,
                refresh: true,
                save: false,
                saveAdd: false,
                cancel: false,
                enable: true,
                import:true,
                export_card: true,
                disable: true
            });
        }
    }

    //按钮点击事件(暂时不注册按钮，按照原始的方式磊功能)
    onButtonClick(props, id) {

        switch (id) {
            case 'saveAdd':
                //form表单必输项校验
				if(!this.props.form.isCheckNow(this.config.formId)){
					toast({color:'danger',content:this.state.json['10100DEPT-000023']});/* 国际化处理： 请输入必输项！*/
					return;
                }

                let formData1 = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
                //适配校验公式
                formData1.areacode=this.config.formId;

                if (formData1.rows[0].values['pk_fatherorg'] != null && formData1.rows[0].values['pk_fatherorg'].value == '~') {
                    formData1.rows[0].values['pk_fatherorg'].value = null;
                }
                //拼接预算表相关信息
                
                let budgetFormData1 = this.props.form.getAllFormValue('planbudget');//获得表单信息
                if((!budgetFormData1.rows[0].values['status'])||(!budgetFormData1.rows[0].values['status'].value)&&(budgetFormData1.rows[0].values['pk_planbudget'])&&(budgetFormData1.rows[0].values['pk_planbudget'].value)){
                    budgetFormData1.rows[0].values.status={value:'1'};//预防空值问题
                }else if((!budgetFormData1.rows[0].values['status'])||(!budgetFormData1.rows[0].values['status'].value)){
                    budgetFormData1.rows[0].values.status={value:'0'};//预防空值问题
                }

                if(!formData1.rows[0].values['businessOrgMap']){
                    formData1.rows[0].values.businessOrgMap={
                        value:{
                            PLANBUDGETTYPE000000:{
                                datasource:budgetFormData1.rows[0].values['datasource'].value,
                                enablestate:budgetFormData1.rows[0].values['enablestate'],
                                status:budgetFormData1.rows[0].values['status'].value,//budgetFormData.rows[0].values['status'].value,
                                pk_planbudget:budgetFormData1.rows[0].values['pk_planbudget'].value,
                                pk_vid:budgetFormData1.rows[0].values['pk_vid'].value
                            }
                        }
                    }
                }else{
                    //formData1.rows[0].values['businessOrgMap'].value['PLANBUDGETTYPE000000']={
                    if(formData1.rows[0].values['businessOrgMap'].value){
                        formData1.rows[0].values['businessOrgMap'].value.PLANBUDGETTYPE000000={
                            datasource:budgetFormData1.rows[0].values['datasource'].value,
                            enablestate:budgetFormData1.rows[0].values['enablestate'],
                            status:budgetFormData1.rows[0].values['status'].value,//budgetFormData.rows[0].values['status'].value,
                            pk_planbudget:budgetFormData1.rows[0].values['pk_planbudget'].value,
                            pk_vid:budgetFormData1.rows[0].values['pk_vid'].value
                        }
                    }else{
                        formData1.rows[0].values['businessOrgMap'].value={
                            PLANBUDGETTYPE000000:{
                                datasource:budgetFormData1.rows[0].values['datasource'].value,
                                enablestate:budgetFormData1.rows[0].values['enablestate'],
                                status:budgetFormData1.rows[0].values['status'].value,//budgetFormData.rows[0].values['status'].value,
                                pk_planbudget:budgetFormData1.rows[0].values['pk_planbudget'].value,
                                pk_vid:budgetFormData1.rows[0].values['pk_vid'].value
                            }
                        }
                    }
                    
                }

                let requestParam1 = {
                    model: formData1,
                    pageid: this.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                };
                //处理树节点数据选中状态及form表单数据
                let selectNode1 = this.props.syncTree.getSelectNode(this.config.treeId);
                //ajax请求
                let saveAddCallBack=()=>ajax({
                    url: urls['saveCard'],
                    data: requestParam1,
                    success: (result) => {
                        if (result.success) {
                            toast({title:this.state.json['10100DEPT-000024'],color:"success"});/* 国际化处理： 保存成功！*/
                            this.props.form.EmptyAllFormValue(this.config.formId);
                            this.props.form.EmptyAllFormValue('planbudget');
                            let requestParam1 = { enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org };
                            this.loadDept(requestParam1, selectNode1);//选中后开始加载部门数据
                            //设置预算相关的form表单状态
                            this.props.form.setFormStatus('planbudget', 'browse');
                            this.updateButtonStatus();
                            this.state.status = 'browse';
                            this.setState(this.state);
                            this.onButtonClick(props,'add');
                        }

                    }
                });
                this.props.validateToSave(requestParam1,saveAddCallBack,{'dept':'form','versioninfo':'form','definfo':'form','auditinfo':'form'},'form');
                break;
            case 'query':
                let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获取左侧树选中节点
                let cacheRefPk = '';//记录左侧树-选中节点的pk
                if(selectNode != null){
                    cacheRefPk = selectNode.refpk;
                }
                //卡片页面点查询时，把业务单元pk和左侧树选中节点的pk传给父组件，在父组件的状态中维护（返回卡片页面时还原数据）
                this.props.config.switchView('Y',{json:this.state.json,cacheOrg:this.state.curOrg,cacheRefPk:cacheRefPk});
                break;
            case 'refresh':
                this.loadDept({ enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org },
                    this.props.syncTree.getSelectNode(this.config.treeId)
                );//选中后开始加载部门数据
                if (!this.props.syncTree.getSelectNode(this.config.treeId) || this.props.syncTree.getSelectNode(this.config.treeId).refpk == '~') {
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    toast({title:this.state.json['10100DEPT-000025'],color:"success"});/* 国际化处理： 刷新成功！*/
                } else {
                    this.onSelectTree(this.props.syncTree.getSelectNode(this.config.treeId).refpk,()=>{
                        toast({title:this.state.json['10100DEPT-000025'],color:"success"});/* 国际化处理： 刷新成功！*/
                    });
                }
                break;
            case 'copy':
                this.item.show();
                break;
            case 'version':
                ajax({
                    url: urls['versionqry'],
                    data: { pk_dept: this.props.syncTree.getSelectNode(this.config.treeId).refpk },
                    success: (result) => {
                        if (result.success) {
                            //日期转换，将时分秒改为00：00：00
                            let  effectdatestr= result.data.effectdate.replace(/-/g, '/');
                            effectdatestr = new Date(effectdatestr);
                            effectdatestr = effectdatestr.getFullYear() + '-' + ((effectdatestr.getMonth() + 1) < 10 ? ('0' + (effectdatestr.getMonth() + 1)) : (effectdatestr.getMonth() + 1)) + '-' + (effectdatestr.getDate() < 10 ? ('0' + effectdatestr.getDate()) : effectdatestr.getDate()) + ' 00:00:00'

                            let vno = (new Date().getFullYear()) + result.data.nextvno;
                            this.setState({ versionparam: { vno: vno, effectdate: result.data.effectdate } })
                            let config = { json:this.state.json,listdata: result.data.listdata, carddata: result.data.carddata, vno: vno, veffectdate: effectdatestr/*result.data.effectdate*/, getMemo: this.getVname.bind(this) };
                            this.props.modal.show('modal', {
                                userControl:true,  
                                title: this.state.json['10100DEPT-000020'],/* 国际化处理： 版本化*/
                                content: <DeptVersion fieldid={"deptversion"} config={config} />,
                                cancelBtnClick:this.cancelBtnClick.bind(this),
                                beSureBtnClick: this.version.bind(this)
                            });
                        }
                    }
                })
                break;
            case 'treeversion':
                ajax({
                    url: urls['treeversionqry'],
                    data: { pk_org: this.state.curOrg.pk_org },
                    success: (result) => {
                        if (result.success) {
                            this.setState({ treeversionparam: { vbegindate: result.data.vbegindate, veffectdate: result.data.veffectdate, pk_org: this.state.curOrg.pk_org } })
                            let config = { json:this.state.json,vno: result.data.vno, vbegindate: result.data.vbegindate, veffectdate: result.data.veffectdate, getMemo: this.getMemo.bind(this) };
                            this.props.modal.show('modal', {
                                userControl:true,  
                                cancelBtnClick:this.cancelBtnClick.bind(this),
                                title: this.state.json['10100DEPT-000017'],/* 国际化处理： 部门树版本化*/
                                content: <DeptTreeVersion  fieldid={"depttreeversion"} config={config} />,
                                beSureBtnClick: this.treeVersion.bind(this)
                            });
                        }
                    }
                })
                break;
            case 'orgmanager':
                if (!this.props.syncTree.getSelectNode(this.config.treeId) || this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk) {
                    toast({ content: this.state.json['10100DEPT-000026'], color: 'warning' });/* 国际化处理： 请先选择数据！*/
                    return;
                }
                this.props.modal.show('orgmanager', {
                    title: this.state.json['10100DEPT-000027'],/* 国际化处理： 组织主管*/
                    content: <Orgmanager json={this.state.json} config={this.props.syncTree.getSelectNode(this.config.treeId)} />
                });
                break;
            case 'enable':
                if (!this.props.syncTree.getSelectNode(this.config.treeId) || this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk) {
                    toast({ content: this.state.json['10100DEPT-000028'], color: 'warning' });/* 国际化处理： 请选择要启用的数据！*/
                    return
                }
                ajax({
                    url: urls['checkdatapermission'],
                    data: { resourceCode: 'dept', mdOperateCode: 'enable', pk_dept: this.props.syncTree.getSelectNode(this.config.treeId).refpk },
                    success: (result) => {
                        if (result.success) {
                            promptBox({
                                color:'warning',
                                title: this.state.json['10100DEPT-000029'],/* 国际化处理： 确认启用*/
                                content: this.state.json['10100DEPT-000030'],/* 国际化处理： 您确认启用所选数据？*/
                                beSureBtnClick: this.onEnableDept.bind(this)
                            });
                        }
                    }
                });

                break;
            case 'disable':
                if (!this.props.syncTree.getSelectNode(this.config.treeId) || this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk) {
                    toast({ content: this.state.json['10100DEPT-000031'], color: 'warning' });/* 国际化处理： 请选择要停用的数据！*/
                    return
                }
                ajax({
                    url: urls['checkdatapermission'],
                    data: { resourceCode: 'dept', mdOperateCode: 'disable', pk_dept: this.props.syncTree.getSelectNode(this.config.treeId).refpk },
                    success: (result) => {
                        if (result.success) {
                            promptBox({
                                color:'warning',
                                title: this.state.json['10100DEPT-000032'],/* 国际化处理： 确认停用*/
                                content: this.state.json['10100DEPT-000033'],/* 国际化处理： 您确认停用所选数据？*/
                                beSureBtnClick: this.onDisableDept.bind(this)
                            });
                        }
                    }
                });

                break;
            case 'add':
                //新增校验编码规则
                this.props.form.setFormStatus(this.config.formId, 'add');
                this.props.form.EmptyAllFormValue(this.config.formId)
                ajax({
                    url: urls['addvalidator'],
                    data: { pk_org: this.state.curOrg.pk_org},
                    success: (result) => {
                        if (result.success) {
                            //填充默认值
                            this.props.syncTree.setNodeDisable(this.config.treeId, true);//设置树不可编辑
                            this.props.form.EmptyAllFormValue(this.config.formId);
                            this.props.form.setFormStatus(this.config.formId, 'edit');
                            //设置预算相关的form表单状态
                            this.props.form.setFormStatus('planbudget', 'add');

                            this.state.isShowPlanBudge='N';
                            this.props.form.setFormStatus('planbudget', 'edit');//预算信息改为编辑态
                            let formVal = this.props.form.getAllFormValue(this.config.formId);
                            //新增时需要填充默认值
                            formVal.rows[0].values['dataoriginflag'].value = 0;
                            formVal.rows[0].values['orgtype13'].value = 'Y';

                            formVal.rows[0].values['pk_org'].value = this.state.curOrg.pk_org;
                            formVal.rows[0].values['depttype'].value = 0;
                            formVal.rows[0].values['depttype'].display = this.state.json['10100DEPT-000034'];/* 国际化处理： 普通部门*/

                            let systemDate=new Date();
                            let createdate = systemDate.getFullYear() + '-' + ((systemDate.getMonth() + 1) < 10 ? ('0' + (systemDate.getMonth() + 1)) : (systemDate.getMonth() + 1)) + '-' + (systemDate.getDate() < 10 ? ('0' + systemDate.getDate()) : systemDate.getDate()) + ' '+systemDate.getHours()+':'+systemDate.getMinutes()+':'+systemDate.getSeconds();
                            formVal.rows[0].values['createdate'].value = createdate;

                            if (this.props.syncTree.getSelectNode(this.config.treeId)&&this.props.syncTree.getSelectNode(this.config.treeId).refpk!=this.root.refpk) {
                                formVal.rows[0].values['pk_fatherorg'].value = this.props.syncTree.getSelectNode(this.config.treeId).refpk;
                                formVal.rows[0].values['pk_fatherorg'].display = this.props.syncTree.getSelectNode(this.config.treeId).refname;
                            }

                            //设置编码值以及编码字段的可编辑性
                            let meta=this.props.meta.getMeta();
                            let code = meta['dept'].items.find(item => item.attrcode === 'code');
                            if(result.data){
                                formVal.rows[0].values['code'].value = result.data['code'];
                                formVal.rows[0].values['code'].display = result.data['code'];
                                this.props.form.setFormItemsDisabled(this.config.formId,{'code':!result.data['canEdit']});
                            }else{
                                this.props.form.setFormItemsDisabled(this.config.formId,{'code':false});
                            }

                            //新增时维护预算form表单相关状态数据
                            this.state.isShowPlanBudge='N';
                            planbudgetData={
                                rows:[
                                    {
                                        rowid:null,
                                        status:0,
                                        values:{
                                            pk_planbudget:{
                                                value:null,
                                                display:null
                                            },
                                            enablestate:{
                                                value:'2',
                                                display:this.state.json['10100DEPT-000035']//新增时，预算字段默认为已启用/* 国际化处理： 已启用*/
                                            },
                                            datasource:{
                                                value:null,
                                                display:null
                                            },
                                            status:{
                                                value:'2',//数据状态为新增态
                                                display:this.state.json['10100DEPT-000013']/* 国际化处理： 新增*/
                                            }
                                        }
                                    }
                                ]
                            };
                            this.props.form.setAllFormValue({ ['planbudget']: planbudgetData });

                            this.props.form.setAllFormValue({ [this.config.formId]: formVal });
                            this.updateButtonStatus();
                            this.state.status = 'add';
                            this.setState(this.state);
                            /*this.props.button.setDisabled({
                                saveAdd:false
                            })*/
                            this.props.button.setButtonVisible({
                                saveAdd:true
                            })
                        }
                    }
                });
                break;
            case 'update':
                //更改按钮状态变量
                ajax({
                    url: urls['checkdatapermission'],
                    data: { resourceCode: 'dept', mdOperateCode: 'edit', pk_dept: this.props.syncTree.getSelectNode(this.config.treeId).refpk },
                    success: (result) => {
                        if (result.success) {
                            this.props.syncTree.setNodeDisable(this.config.treeId, true);//设置树不可编辑
                            this.props.form.setFormStatus(this.config.formId, 'edit');
                            //设置预算相关的form表单状态
                            this.props.form.setFormStatus('planbudget', 'edit');
                            this.updateButtonStatus();
                            this.state.status = 'edit';
                            this.setState(this.state);
                            /*this.props.button.setDisabled({
                                saveAdd:true
                            })*/
                            this.props.button.setButtonVisible({
                                saveAdd:false
                            })

                            //这里需要处理editLoadData和editFormStatus的数据处理逻辑
                            editFormStatus=true;
                            if(editLoadData){
                                let orgtype17=this.props.form.getFormItemsValue('planbudget','orgtype17');
                                if(orgtype17.value == true){
                                    planbudgetData.rows[0].values['status']={
                                        value:'1',//编辑态数据状态全部维护为修改
                                        display:this.state.json['10100DEPT-000003']/* 国际化处理： 修改*/
                                    }
                                }
                                //还原状态数据
                                editLoadData=false;
                                editFormStatus=false;
                                //维护完数据状态后，即可设置预算表单相关的数据
                                this.props.form.setAllFormValue({ ['planbudget']: planbudgetData });
                            }
                        }
                    }
                });

                break;
            case 'cancel':
                promptBox({
                    color:'warning',
                    title : this.state.json['10100DEPT-000036'],/* 国际化处理： 确认取消*/
                    content : this.state.json['10100DEPT-000037'],/* 国际化处理： 是否确认取消？*/
                    beSureBtnClick : (()=>{
                        //取消时处理断码回滚（若有编码规则）
                        let code=this.props.form.getFormItemsValue(this.config.formId,'code');
                        ajax({
                            url: '/nccloud/baseapp/dept/coderollback.do',
                            data: {'code':code.value,'status':this.state.status},
                            success: (result) => {
                                if (result.success) {
                                    //同步树 取消的逻辑
                                    this.props.form.setFormStatus(this.config.formId, 'browse');
                                    if (this.props.syncTree.getSelectNode(this.config.treeId) && this.props.syncTree.getSelectNode(this.config.treeId).refpk != '~') {
                                        //取消时如果左树有选中，需要重新加载数据（查一次还是取旧的，目前待定）
                                        this.onSelectTree(this.props.syncTree.getSelectNode(this.config.treeId).refpk);
                                    } else {
                                        //没有选中项  清空所有数据
                                        this.props.form.EmptyAllFormValue(planbudget);
                                        this.props.form.EmptyAllFormValue(this.config.formId);
                                        this.props.form.setFormItemsDisabled(this.config.formId, { enablestate: true });//设置表单项不可用
                                    }
                                    //设置预算相关的form表单状态
                                    this.props.form.setFormStatus('planbudget', 'browse');
                                    //设置树可用
                                    this.props.syncTree.setNodeDisable(this.config.treeId, false);
                                    this.updateButtonStatus();
                                    this.state.status = 'browse';
                                    this.setState(this.state);
                                }
                            }
                        });
                    })
                });
                break;
            case 'export_card':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break; 
            case 'save':
                //form表单必输项校验
				if(!this.props.form.isCheckNow(this.config.formId)){
					//toast({color:'danger',content:this.state.json['10100DEPT-000023']});/* 国际化处理： 请输入必输项！*/
					return;
                }
                
                let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
                //适配校验公式
                formData.areacode=this.config.formId;

                if (formData.rows[0].values['pk_fatherorg'] != null && formData.rows[0].values['pk_fatherorg'].value == '~') {
                    formData.rows[0].values['pk_fatherorg'].value = null;
                }
                //拼接预算表相关信息
                
                let budgetFormData = this.props.form.getAllFormValue('planbudget');//获得表单信息
                if((!budgetFormData.rows[0].values['status'])||(!budgetFormData.rows[0].values['status'].value)&&(budgetFormData.rows[0].values['pk_planbudget'])&&(budgetFormData.rows[0].values['pk_planbudget'].value)){
                    budgetFormData.rows[0].values.status={value:'1'};//预防空值问题
                }else if((!budgetFormData.rows[0].values['status'])||(!budgetFormData.rows[0].values['status'].value)){
                    budgetFormData.rows[0].values.status={value:'0'};//预防空值问题
                }
                

                if(!formData.rows[0].values['businessOrgMap']){
                    formData.rows[0].values.businessOrgMap={
                        value:{
                            PLANBUDGETTYPE000000:{
                                datasource:budgetFormData.rows[0].values['datasource'].value,
                                enablestate:budgetFormData.rows[0].values['enablestate'],
                                status:budgetFormData.rows[0].values['status'].value,//budgetFormData.rows[0].values['status'].value,
                                pk_planbudget:budgetFormData.rows[0].values['pk_planbudget'].value,
                                pk_vid:budgetFormData.rows[0].values['pk_vid'].value
                            }
                        }
                    }
                }else{
                    //formData.rows[0].values['businessOrgMap'].value['PLANBUDGETTYPE000000']={
                    if(formData.rows[0].values['businessOrgMap'].value){
                        formData.rows[0].values['businessOrgMap'].value.PLANBUDGETTYPE000000={
                            datasource:budgetFormData.rows[0].values['datasource'].value,
                            enablestate:budgetFormData.rows[0].values['enablestate'],
                            status:budgetFormData.rows[0].values['status'].value,//budgetFormData.rows[0].values['status'].value,
                            pk_planbudget:budgetFormData.rows[0].values['pk_planbudget'].value,
                            pk_vid:budgetFormData.rows[0].values['pk_vid'].value
                        }
                    }else{
                        formData.rows[0].values['businessOrgMap'].value={
                            PLANBUDGETTYPE000000:{
                                datasource:budgetFormData.rows[0].values['datasource'].value,
                                enablestate:budgetFormData.rows[0].values['enablestate'],
                                status:budgetFormData.rows[0].values['status'].value,//budgetFormData.rows[0].values['status'].value,
                                pk_planbudget:budgetFormData.rows[0].values['pk_planbudget'].value,
                                pk_vid:budgetFormData.rows[0].values['pk_vid'].value
                            }
                        }
                    }
                }
                

                let requestParam = {
                    model: formData,
                    pageid: this.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                };
                //处理树节点数据选中状态及form表单数据
                //let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);
                //ajax请求
                let saveCallBack=()=>ajax({
                    url: urls['saveCard'],
                    data: requestParam,
                    success: (result) => {
                        if (result.success) {
                            toast({title:this.state.json['10100DEPT-000024'],color:"success"});/* 国际化处理： 保存成功！*/
                            //设置表单浏览态
                            this.props.form.setFormStatus(this.config.formId, 'browse');
                            //设置树可用
                            this.props.syncTree.setNodeDisable(this.config.treeId, false);

                            this.props.form.EmptyAllFormValue(this.config.formId);

                            let selectDept;
                            //新增成功，设置表单默认值
                            result.data[this.config.formId].rows.forEach((row) => {
                                selectDept={
                                    beforeName:row.values['code'].value+' ',
                                    code:row.values['code'].value,
                                    name:row.values['name'].value,
                                    innercode:row.values['innercode'].value,
                                    key:row.values['pk_dept'].value,
                                    id:row.values['pk_dept'].value,
                                    title:row.values['name'].value,

                                    refcode:row.values['code'].value,
                                    pid:row.values['pk_fatherorg'].value,
                                    refpk:row.values['pk_dept'].value,
                                    refname:row.values['name'].value
                                }
                                //这里加上是否显示预算相关信息的逻辑
                                if(row.values['orgtype17'].value == true){
                                    this.state.isShowPlanBudge='Y';
                                    //获取预算信息
                                    row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].datasource={
                                            value:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].datasource,
                                            display:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].datasource
                                        },
                                    row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].enablestate={
                                            value:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].enablestate,
                                            display:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].enablestate==2?this.state.json['10100DEPT-000001']:this.state.json['10100DEPT-000002']/* 国际化处理： 启用,停用*/
                                        }
                                    row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_planbudget={
                                        value:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_planbudget,
                                        display:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_planbudget
                                        }
                                    row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_vid={
                                        value:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_vid,
                                        display:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000'].pk_vid
                                        }
                                    //维护预算数据
                                    planbudgetData={
                                        rows:[
                                            {
                                                rowid:null,
                                                status:0,
                                                values:row.values['businessOrgMap'].value['PLANBUDGETTYPE000000']
                                            }
                                        ]
                                    };
                                }else{
                                    //查询出来的数据如果不是预算部门，需要清掉预算相关的表单数据信息
                                    this.state.isShowPlanBudge='N';
                                    planbudgetData={
                                        rows:[
                                            {
                                                rowid:null,
                                                status:0,
                                                values:{
                                                    pk_planbudget:{
                                                        value:null,
                                                        display:null
                                                    },
                                                    enablestate:{
                                                        value:'2',
                                                        display:this.state.json['10100DEPT-000001']/* 国际化处理： 启用*/
                                                    },
                                                    datasource:{
                                                        value:null,
                                                        display:null
                                                    }
                                                }
                                            }
                                        ]
                                    };
                                }
                                this.props.form.setAllFormValue({ ['planbudget']: planbudgetData });
                            });
                            this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });

                            //树不作真刷新，将返回数据匹配过去即可
                            //处理树节点数据选中状态及form表单数据
                            let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);
                            if(selectNode&&selectNode.refpk==selectDept.refpk){
                                selectNode.beforeName=selectDept.beforeName;
                                selectNode.code=selectDept.code;
                                selectNode.name=selectDept.name;
                                selectNode.innercode=selectDept.innercode;
                                selectNode.title=selectDept.title;

                                selectNode.refcode=selectDept.refcode;
                                selectNode.pid=selectDept.pid;
                                selectNode.refname=selectDept.refname;
                                this.props.syncTree.editNodeSuccess(this.config.treeId,selectNode)
                            }else{
                                this.props.syncTree.addNodeSuccess(this.config.treeId,selectDept);
                                this.props.syncTree.setNodeSelected(this.config.treeId,selectDept.refpk);
                                this.props.syncTree.openNodeByPk(this.config.treeId,selectDept.pid);
                            }
                            /** 
                            //刷新树节点、并选择当前操作数据为选择状态
                            let requestParam = { enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org };
                            this.loadDept(requestParam, selectNode);//选中后开始加载部门数据
                            */
                            //设置预算相关的form表单状态
                            this.props.form.setFormStatus('planbudget', 'browse');
                            this.updateButtonStatus();
                            this.state.status = 'browse';
                            this.setState(this.state);
                        }

                    }
                });
                this.props.validateToSave(requestParam,saveCallBack,{'dept':'form','versioninfo':'form','definfo':'form','auditinfo':'form'},'form');
                break;
            case 'delete':
                if (!this.props.syncTree.getSelectNode(this.config.treeId)) {
                    toast({content: this.state.json['10100DEPT-000038'], color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
                    return;

                }
                if (this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk) {
                    toast({ content: this.state.json['10100DEPT-000039'], color: 'warning' });//默认top/* 国际化处理： 根节点不能删除*/
                    return;

                }
                let message = this.state.json['10100DEPT-000040']/* 国际化处理： 确认要删除所选数据吗？*/
                if (this.props.syncTree.getSelectNode(this.config.treeId).hasOwnProperty('children') && this.props.syncTree.getSelectNode(this.config.treeId).children != null && this.props.syncTree.getSelectNode(this.config.treeId).children.length > 0) {
                    toast({ content: this.state.json['10100DEPT-000041'], color: 'warning' });//默认top/* 国际化处理： 该节点包含子节点，不允许删除！*/
                    return;
                }
                ajax({
                    url: urls['checkdatapermission'],
                    data: { resourceCode: 'dept', mdOperateCode: 'edit', pk_dept: this.props.syncTree.getSelectNode(this.config.treeId).refpk },
                    success: (result) => {
                        if (result.success) {
                            promptBox({
                                color:'warning',
                                title: this.state.json['10100DEPT-000042'],/* 国际化处理： 确认删除*/
                                content: message,
                                beSureBtnClick: () => {
                                    let formData = this.props.form.getAllFormValue(this.config.formId);

                                    formData.rows['status'] = '3';//设置状态
                                    let requestParam = {
                                        model: formData,
                                        pageid: this.pagecode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                                    };

                                    ajax({
                                        url: urls['deleteCard'],
                                        data: requestParam,
                                        success: (result) => {
                                            if (result.success) {
                                                this.props.form.EmptyAllFormValue(this.config.formId);
                                                //调用异步树的接口，删除该树节点
                                                this.props.syncTree.delNodeSuceess(this.config.treeId, this.props.syncTree.getSelectNode(this.config.treeId).refpk);

                                                toast({ title: this.state.json['10100DEPT-000043'], color: "success" });/* 国际化处理： 删除成功！*/

                                                this.props.syncTree.cancelSelectedNode(this.config.treeId);

                                            }

                                        }
                                    })
                                }
                            });
                        }
                    }
                });

                break;
            case 'print':
                let printParam = {
                    funcode: '10100DEPT',
                    nodekey: 'deptPrint'
                };
                this.pintFunction(printParam);
                break;
            case 'export':
                let pks = [];
                pks.push(this.props.syncTree.getSelectNode(this.config.treeId).refpk);
                this.setState({
                    ids: pks
                }, this.refs.printOutput.open());
                break;
        }

    }
    cancelBtnClick(){
        this.props.modal.close('modal');
    }

    //输出和打印功能函数
    pintFunction(param) {
        let pks = [];
        pks.push(this.props.syncTree.getSelectNode(this.config.treeId).refpk);
        param.oids = pks;
        print(
            'pdf',
            urls['print'],
            param
        );
    }

    //启用部门
    onEnableDept() {
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        if (formData.rows[0].values['pk_fatherorg'] != null && formData.rows[0].values['pk_fatherorg'].value == '~') {
            formData.rows[0].values['pk_fatherorg'].value = null;
        }
        let requestParam = {
            model: formData,
            pageid: this.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        //处理树节点数据选中状态及form表单数据
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);
        //ajax请求
        ajax({
            url: urls['enableCard'],
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    toast({title:this.state.json['10100DEPT-000011'],color:"success"});/* 国际化处理： 启用成功！*/
                    //设置表单浏览态
                    this.props.form.setFormStatus(this.config.formId, 'browse');
                    //设置树可用
                    this.props.syncTree.setNodeDisable(this.config.treeId, false);
                    this.props.button.setDisabled({enable: true, disable: false});

                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //新增成功，设置表单默认值
                    this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });

                    let requestParam = { enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org };
                    this.loadDept(requestParam, selectNode);//选中后开始加载部门数据
                }

            }
        });
    }

    //停用部门
    onDisableDept() {
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        if (formData.rows[0].values['pk_fatherorg'] != null && formData.rows[0].values['pk_fatherorg'].value == '~') {
            formData.rows[0].values['pk_fatherorg'].value = null;
        }
        let requestParam = {
            model: formData,
            pageid: this.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };
        //处理树节点数据选中状态及form表单数据
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);
        //ajax请求
        ajax({
            url: urls['disableCard'],
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    toast({title:this.state.json['10100DEPT-000012'],color:"success"});/* 国际化处理： 停用成功！*/
                    //设置表单浏览态
                    this.props.form.setFormStatus(this.config.formId, 'browse');
                    //设置树可用
                    this.props.syncTree.setNodeDisable(this.config.treeId, false);

                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //新增成功，设置表单默认值
                    this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });

                    //刷新树节点、并选择当前操作数据为选择状态
                    let requestParam = { enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org };
                    this.loadDept(requestParam, selectNode);//选中后开始加载部门数据
                }

            }
        });
    }

    /*************
    * ajax请求 加载树数据
    *************/
    onOrgChange(value,selectNode) { //选择行政组织钩子
        //上级部门参照加上特殊条件
        let meta=this.props.meta.getMeta();

        // NCCLOUD-188574-过滤部门参照
        for (var item of meta['dept'].items) {
            if(item.refcode){
                // 部门(所有)
                if(item.refcode === 'uapbd/refer/org/DeptNCAllDataTreeRef/index'){
                    item.queryCondition=()=>{
                        return {
                            pk_org: value.refpk
                        };
                    };
                }
                // 部门版本(所有)
                if(item.refcode === 'uapbd/refer/orgv/DeptVersionAllDataTreeRef/index'){
                    item.queryCondition=()=>{
                        return {
                            pk_org: value.refpk
                        };
                    };
                }
            }
        }

        let fatherDeptItem = meta['dept'].items.find(item => item.attrcode === 'pk_fatherorg');
        fatherDeptItem.isShowUnit = false;
        fatherDeptItem.unitCondition = () => {
            return {
                "isMutiGroup": "N"
            }
        };
        fatherDeptItem.queryCondition = () => {
            return {
                "pk_org": value.refpk
            }
        };
        //部门负责人和分管领导业务单元参照赋默认值
        let principalItem = meta['dept'].items.find(item => item.attrcode === 'principal');
        principalItem.defaultUnitValue={refname:value.refname,refpk:value.refpk};
        let chargeleader = meta['dept'].items.find(item => item.attrcode === 'chargeleader');
        chargeleader.defaultUnitValue={refname:value.refname,refpk:value.refpk};

        let pk_org = value.refpk;
        let treeId = this.config.treeId;
        this.state.curOrg.pk_org = value.refpk;
        this.state.curOrg.name = value.refname;
        let isretail = meta['dept'].items.find(item => item.attrcode === 'isretail');

        if((value.values)&&value.values['isretail'].value=='Y'){
            isretail.disabled=false; 
             //设置是否零售是否可编辑
            this.props.form.setFormItemsDisabled(this.config.formId,{'isretail':false});
        }else{
            isretail.disabled=true; 
             //设置是否零售是否可编辑
            this.props.form.setFormItemsDisabled(this.config.formId,{'isretail':true});
        }
            //
        this.setState(this.state);
        let requestParam = { enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org };

		//卡片页面点查询，再返回卡片页面时：左侧树选中点查询之前选中的节点
        selectNode=this.state.cacheRefPk==''?selectNode:{refpk:this.props.cacheRefPk};
        setTimeout(() => {
            this.setState({cacheRefPk:''});
        }, 10);

        this.loadDept(requestParam,selectNode);//选中后开始加载部门数据
        this.props.form.EmptyAllFormValue(this.config.formId);
        this.props.syncTree.cancelSelectedNode(this.config.treeId);

		//卡片页面点查询，再返回卡片页面时：根据左侧数据选中的节点，加载右侧表单数据
        if(this.props.cacheOrg != ''){       
            this.onSelectTree(this.state.cacheRefPk);
        }
    }

    /*************
    * ajax请求 加载树数据
    *************/
    loadDept(requestParam, selectTreeNode) {
        ajax({

            url: this.config.urls.loadTreeDataUrl,
            data: requestParam,//{pkorg:this.state.curOrg.refpk},
            success: (result) => {
                if (result.success) {

                    let data = [Object.assign({ ...this.root }, { children: result.data })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);

                    //设置选中节点数据(以下处理逻辑为满足启用停用数据切换)
                    if (!selectTreeNode || selectTreeNode.refpk == '~') {
                        this.props.syncTree.setNodeSelected(this.config.treeId, this.root.refpk);
                        this.setButtonDisable();
                        return;
                    } 
					//选中节点不空且refpk为空的情况下，默认选中第一节点
                    else if(selectTreeNode && !selectTreeNode.refpk){
                        if(result.data && result.data[0].key){
                            this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].key);
                            this.onSelectTree(result.data[0].key);//默认选中第一条
                        }
                    }
					else {
                        selectTreeNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, selectTreeNode.refpk);
                        //如果选中的节点数据不显示，则清空form表单，否则设置该节点为选中状态
                        if (selectTreeNode) {
                            this.props.syncTree.openNodeByPk(this.config.treeId, selectTreeNode.refpk);
                            this.props.syncTree.setNodeSelected(this.config.treeId, selectTreeNode.refpk);
                        } else {
                            this.props.syncTree.cancelSelectedNode(this.config.treeId);
                            this.props.form.EmptyAllFormValue(this.config.formId);
                        }
                    }
                }
            }
        });
    }

    refreshPage(){
        //this.onButtonClick(this.props,'refresh');
        this.loadDept({ enablestate: this.state.enablestate, pk_org: this.state.curOrg.pk_org },
            this.props.syncTree.getSelectNode(this.config.treeId)
        );//选中后开始加载部门数据
        if (!this.props.syncTree.getSelectNode(this.config.treeId) || this.props.syncTree.getSelectNode(this.config.treeId).refpk == '~') {
            this.props.form.EmptyAllFormValue(this.config.formId);
            //toast({title:this.state.json['10100DEPT-000025'],color:"success"});/* 国际化处理： 刷新成功！*/
        } else {
            this.onSelectTree(this.props.syncTree.getSelectNode(this.config.treeId).refpk,()=>{
                //toast({title:this.state.json['10100DEPT-000025'],color:"success"});/* 国际化处理： 刷新成功！*/
            });
        }
    }
    /**
     * 渲染
     * @returns {*}
     */
    render() {
        if(!this.state.json)
        return '';
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const { asyncTree, syncTree,cardTable, form, button, modal, search, DragWidthCom,BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const { createAsyncTree } = asyncTree;//创建异步树，需要引入这个
        const { createSyncTree } = syncTree;//创建同步树 需要引入这个
        const { createForm } = form;//创建表单，需要引入这个

        const {createCardTable} = cardTable;
        const { createButton } = button;

        const { createButtonApp } = button;

        let { createModal } = modal;  //模态框

        const { NCCreateSearch } = search;
        let AppCode = this.props.getAppCode();// liyfp NCCLOUD-202645设置复制出来的应用业务单元查不到问题
        let orgPermCondition = function () {
            return {
                AppCode:AppCode,
                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
            }
        }

        let curorg=this.state.curOrg;
        let json=this.state.json;
        let deptCopyParam={
            curorg,
            json:json
        }
		
		//卡片页面点查询，再返回到卡片页面时，设置业务单元为查询前选中的业务单元
        if(this.props.cacheOrg != ''){
            setTimeout(() => {
                this.setState({curOrg:this.props.cacheOrg})
            }, 10);
        }

        return (

            <div className="nc-bill-card dept-bill-card">
                <AssignStepModal commitEvent={this.refreshPage.bind(this)} config={deptCopyParam} ref={(item => this.item = item)} />
                {createModal('orgmanager', { noFooter: true })}
                {createModal('modal', { noFooter: false })}
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area">
                    {/* 标题 title*/}
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:this.state.json['10100DEPT-000000']/* 国际化处理： 部门*/,
                            //backBtnClick: this.onButtonClick.bind(this,null,'return'),
                            showBackBtn:false,
                            initShowBackBtn:false}
                        )}

                    </div>
                    {/*业务单元参照*/}
                    <div className="search-box">
                        {BusinessUnitTreeRef({
                            fieldid:"businessunittreeref",
                            isTreelazyLoad: false,
                            queryCondition: orgPermCondition,
                            onChange: this.onOrgChange.bind(this),
                            value: { refpk: this.state.curOrg.pk_org, refname: this.state.curOrg.name },
                            disabled: this.state.status == 'browse' ? false : true,//是否禁用
                        })}
                    </div>

                    {<span className="showOff" style={{marginLeft:20}}>
                        <NCCheckbox
                            disabled={this.state.status == 'browse' ? false : true}//是否禁用
                            defaultChecked={false}
                            checked={this.state.checked}
                            onChange={this.onCheckBoxChange.bind(this)}
                            //onClick={this.onCheckBoxClick.bind(this)}
                            size="lg"
                        >
                            {this.state.json['10100DEPT-000045']/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
                    </span>}
                    {/* 按钮组 btn-group*/}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'list_btn',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        // 左树区域
                        leftDom={
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId: this.config.treeId,
                                    //needEdit: true, //不启用编辑
                                    needEdit: (this.state.curOrg.pk_org&&this.state.curOrg.pk_org.length>0)?true:false, //根据是否选择了主组织判断是否启用编辑
                                    showLine: false, //显示连线
                                    disabledSearch:this.state.status=='browse'?false:true, //是否禁用搜索框
                                    //needSearch: this.state.status == 'browse' ? true : false, //是否需要搜索框
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve: this.onMouseEnterEve.bind(this),
                                    clickEditIconEve: this.onEditEps.bind(this), //编辑点击 回调
                                    clickAddIconEve: this.onAddEps.bind(this), //新增点击 回调
                                    clickDelIconEve: this.onDeleteEps.bind(this), // 删除点击 回调
                                    showModal: false

                                })}
                            </div>}     //左侧区域dom
                        // 右卡片区域
                        rightDom={
                            <div className="card-area card-right">
                                <div className="nc-bill-form-area">
                                    {createForm(this.config.formId, {
                                        onAfterEvent: this.onAfterFormEvent.bind(this)

                                    })
                                    }
                                </div>
                                    <div className="nc-bill-table-area" style={{display: this.state.isShowPlanBudge == 'Y' ? '': 'none'}}>
                                        {/*this.getTableHead('finance')*/}
                                        {createForm("planbudget", {
                                        })}
                                    </div>
                            </div>}     //右侧区域dom
                        defLeftWid='280px'      // 默认左侧区域宽度，px/百分百
                    />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url={urls['print']}
                    data={{
                        funcode: '10100DEPT',
                        nodekey: 'deptPrint',
                        oids: this.state.ids,
                        outputType: 'output'
                    }}
                />
                <ExcelImport
                {...this.props}
                moduleName ='riaorg'//模块名
                billType = 'dept'//单据类型
                selectedPKS = {[]}
                appcode='10100DEPT'
                pagecode="10100DEPT_dept"
            />
            </div>

        )
    }
}

/**
 * 创建页面
 */
export default DeptCard = createPage({
    billinfo:{
        billtype:'form',
        pagecode:pageCode,
        headcode:formId
    },
    initTemplate: ()=>{},
})(DeptCard)


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65