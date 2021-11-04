//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, createPageIcon, base, ajax ,NCCreateSearch,toast, promptBox,high,excelImportconfig} from 'nc-lightapp-front';
import AccFiledTable from "../component/accfieldtable";
import List from "../component/structuralcard";
import AccountUseage from "../component/accountUseage";
import Utils from '../../../public/utils/index';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import HeaderArea from '../../../public/pubComponent/HeaderArea';
import './index.less';


const {NCCheckbox} = base;
const {ExcelImport} = high;
/****************默认参数  开始***********************/
let config = {};
let urls={
    loadTreeDataUrl:"/nccloud/uapbd/accsystem/AccsystemQueryAction.do",
    accsystemCardQryAction:"/nccloud/uapbd/accsystem/AccsystemCardQryAction.do",
    queryCardUrl:"/nccloud/uapbd/accsystem/queryaccsysclasscard.do",
    queryAccFieldUrl:"/nccloud/uapbd/accsystem/queryAccFieldCtrl.do",
    SaveAccFiledUrl:"/nccloud/uapbd/accsystem/AccFieldCtrlSaveAction.do",
    deleteUrl:'/nccloud/uapbd/accsystem/AccsystemDelAction.do',
    saveUrl:'/nccloud/uapbd/accsystem/AccsystemSaveAction.do',
    editUrl:'/nccloud/uapbd/accsystem/editaccsysclass.do',
    cancelUrl:'/nccloud/uapbd/accsystem/cancel.do',
    addUrl:'/nccloud/uapbd/accsystem/AccsystemAddAction.do'  
};

let formId = 'accsystem';
const gridId='accfieldcode';
let tableId='accfieldcode';
// let strustId='10140ACCO_account_list';//结构体系查询
let strustId='consysquery';//结构体系查询
let accountUseage='accountUseage';
/***************默认参数  结束********************/

/**
 * 科目体系
 */
class Accsystem extends Component {

    constructor(props){
        super(props)
        
        props.config['title'] = '科目体系';
        props.config['treeId'] = 'accsysClassTree';
        props.config['headformId'] = 'accsystem';
        props.config['tableId'] = 'acctypes';
        props.config['cardTable'] = 'accfieldcode';
        props.config['pageCode'] = '10140ACCSB_accsys';
        props.config['pk'] = '';
        props.config['json'] = {};
        props.config['inlt'] = null;
       
        //默认集团
        this.config =Object.assign({}, props.config);

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key":"~",
            "title":this.config.title,
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": this.config.title,
            "refpk": "~"
        };

        //显示停用复选框的状态标志
        this.state = {
            selectNode: {},     //选中树节点
            curTablestatus: '', //表格当前状态
            isSaveAdd: 'N',     //保存新增标志
            cardtableindex: -1, //子表当前选中行
            treeDisabledSearch: false, //树搜索框是否可用
            json: {},
            inlt: null
        }

        this.initTemplate(props);
    }

    /**
     * 单据模板
     * @param props
     */
    initTemplate = (props)=>{
        createUIDom(props)(
            {pagecode : '10140ACCSB_accsys'},
            {moduleId: '10140ACCSB',domainName: 'uapbd'},
			(data, langData, inlt)=>{
				//多语
				if(langData){
                    this.state.json = langData;
                    props.config.json = langData;
					if(inlt){
                        props.config.inlt = inlt;
						this.state.inlt = inlt;
                    }
                    this.config.title = this.state.json['10140ACCSB-000012'];/* 国际化处理： 科目体系*/
                    this.root.title = this.state.json['10140ACCSB-000012'];/* 国际化处理： 科目体系*/
                    this.root.refname = this.state.json['10140ACCSB-000012'];/* 国际化处理： 科目体系*/
				}
                if(data.template){
                    let meta = data.template;

                    if(!meta.formrelation)meta['formrelation']=Object;
                    meta.formrelation['formAccount'] = ['account_vouchertype'];
                    meta.acctypes['items'] && meta.acctypes['items'].map((item)=>{
                        if(item.itemtype === 'select'){
                            item.showClear = false; //去掉下拉框的清空图标
                            item.options && item.options.forEach((option, index)=>{
                                if(option.value === ''){
                                    item.options.splice(index, 1) //下拉选项去掉空值
                                }
                            })
                        }
                    })
                    props.meta.setMeta(meta);
                }

                if (data.button) {
                    props.button.setButtons(data.button);
                }
                this.initButtonStatus();
                this.initData();
                let excelimportconfig = excelImportconfig(props,'uapbd','accsystem',true,'',{appcode:"10140ACCSB",pagecode:"10140ACCSB_accsys"})               
				props.button.setUploadConfig("import",excelimportconfig);
            }
        );
    }

    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){
        // this.initButtonStatus();
        // this.initData();
    }

    componentDidUpdate(){
        let l_formstatus = this.props.form.getFormStatus(this.config.headformId);
        let l_formstatus1 = this.props.editTable.getStatus(gridId);
        
        if(l_formstatus === 'add' || l_formstatus === "edit" || (l_formstatus1 && l_formstatus1 === "edit")){
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }else{
            window.onbeforeunload = null;
        }
    }

    //按钮点击事件-科目体系
    onButtonClick =(props, id)=> {
        debugger;
        switch (id) {
            case 'Add'://新增
                this.onAddAccsysClass({});
                break;
            case 'Refresh'://刷新
                this.onRefreshAccsysClass(() => {
                    toast({ color: 'success', title: this.state.json['10140ACCSB-000004'] });/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'Cancel'://取消
                this.onCancel();
                break;
            case 'SaveAdd':
                this.onSaveAccsysClass({isSaveAdd: 'Y'});
                break;
            case 'Save':
                this.onSaveAccsysClass();
                break;
            case 'addLine':
                this.addLine();
                break;
            case 'delLine':
                this.delLine();
                break;
            case 'attributeControl'://科目属性控制策略
                this.onAttributeControl();
                break;
            case 'structuralQuery'://科目体系结构查询
                this.onStructuralQuery();
                break;
            case 'usage'://科目表使用情况查询
                this.onUsage();
                break;
            case 'export':
                this.props.modal.show('exportFileModal');
            default:
                break;
        }
    }

    /**
     * 初始设置button状态
     * @param props
     */
    initButtonStatus = ()=> {
        //设置保存按钮不显示
        this.props.button.setButtonVisible(['Save','SaveAdd','Cancel'],false);
        this.props.button.setDisabled({'attributeControl' : true});
    }

    initData(){
        this.loadTreeData();
    }

    /**
     * 加载树节点数据
     */
    loadTreeData(){
        ajax({
            url: urls['loadTreeDataUrl'],
            data:{},
            success:(result)=>{
                if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {//显示公式
                    this.props.dealFormulamsg(
                        result.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            "acctypes": "form",
                            "accsystem":"cardTable"
                        }
                    );
                }
                if(result.success){
                    let data = [Object.assign( {...this.root} , {children : result.data} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    this.props.syncTree.setNodeDisable(this.config.treeId,false);

                    if(this.state.selectNode && this.state.selectNode['refpk']){
                        let refpk = this.state.selectNode['refpk'];
                        let accsystem = this.props.syncTree.getSyncTreeValue(this.config.treeId, refpk);
                        if(accsystem && accsystem['refpk']){
                            this.props.syncTree.openNodeByPk(this.config.treeId, accsystem.pid);
                            this.props.syncTree.setNodeSelected(this.config.treeId, accsystem.refpk);
                            this.onSelectTree(accsystem.refpk);
                            //新增保存时用到
                            if(this.state.isSaveAdd === 'Y'){
                                this.setState({
                                    isSaveAdd : 'N'
                                },() => {
                                    this.onAddAccsysClass({});
                                });
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            //node.beforeName = <span>{node['code']?(node['code']+' '):''}</span>
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
        });
        return data;
    }
    
    /**
     * 鼠标进入科目体系树节点事件
     * @param key
     */
    onMouseEnterEve(key){
        //设置
        let obj = {};
        if(key === this.root.refpk){
            obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
        }else{
            obj = {
                delIcon:true, //false:隐藏； true:显示; 默认都为true显示
                editIcon:true,
                addIcon:false
            };
        }
        this.props.syncTree.hideIcon(this.config.treeId, key, obj );
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk){
        let accsystem=this.props.syncTree.getSyncTreeValue(this.config.treeId,refpk);
        this.setState({selectNode : accsystem});

        ajax({
            url: urls['accsystemCardQryAction'],
            data : {pk_accsystem : accsystem['refpk']},
            success: (res) => {
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            "accsystem": "from",
                            "acctypes": "cardTable"
                        }
                    );
                }

                    let { success,data} = res;
                if (success) {
                    if(data && data['accsystem']){
                        let accsysdata = data['accsystem'];
                        this.props.form.setAllFormValue({[this.config.headformId]:accsysdata.head.accsystem});
            
                        if(accsysdata && accsysdata['body'] && accsysdata['body'][this.config.tableId]){
                            this.props.cardTable.setTableData(this.config.tableId,accsysdata.body.acctypes);
                        }else{
                            this.props.cardTable.setTableData(this.config.tableId, {rows: []});
                        }
            
                        this.props.button.setDisabled({'attributeControl' : false});
                    }else{
                        this.props.button.setDisabled({'attributeControl' : true});
                    }
                }
            },
            error : (res) => {
                toast({ color: 'danger', content: res.message });
            }
        })
    }

    /**
     * 新增-科目体系
     * @param selectNode
     */
    onAddAccsysClass(selectNode){
        this.setState(
            {
                curTablestatus: 'add'
            },
            () => {//addUrl
                ajax({
                    url: urls['addUrl'],
                    data: {},
                    success: (result) => {
                        if(result.success) {
                            if(result.data.billcard.head){
                                //先清空
                                this.props.form.EmptyAllFormValue(this.config.headformId);
                                this.props.cardTable.setTableData(this.config.tableId,{rows:[]});
                                //后赋值
                                this.props.form.setAllFormValue({[this.config.headformId]: result.data.billcard.head.accsystem})
                                if(result.data.billcard.body){
                                    this.props.cardTable.setTableData(this.config.tableId, result.data.billcard.body.acctypes);
                                }
                                this.changeButtonStatus('add');
                            }
                        }
                    }
                });
            }
        );
    }

    /**
     * 编辑：
     *      1、构造请求参数
     *      2、ajax请求，后台查询需要编辑的对象
     *      3、回调，设置表单数据为编辑的对象
     *
     * 编辑状态下：
     *      只有 保存  取消 按钮 显示
     * @param selectedTreeNode
     */
    onEditAccsysClass(selectedTreeNode){
        this.setState(
            {
                selectNode: selectedTreeNode,
                curTablestatus: 'edit',
                cardtableindex: -1
            },
            () => {
                this.onSelectTree(this.state.selectNode.refpk);
                this.changeButtonStatus('edit');
            }
        );
    }

    /**
     * 保存-科目体系
     * @param {*} param0 
     */
    onSaveAccsysClass({isSaveAdd='N'}={}){
        if(!this.props.form.isCheckNow(this.config.headformId)) return;
        //if(!this.props.cardTable.checkTableRequired(this.config.tableId))return;

        let allData=this.props.createMasterChildData('10140ACCSB_accsys',this.config.headformId,this.config.tableId);
        //去掉主表中子表信息，否则翻译报错
        allData['head']['accsystem']['rows'][0]['values']['acctypes'] = null;
        this.props.validateToSave( allData , ()=>{
            ajax({
                url: urls['saveUrl'],
                data: allData,
                success: (result) => {
                    if(result.success) {
                        toast({title : this.state.json['10140ACCSB-000015'],color : 'success'});/* 国际化处理： 保存成功！*/
                        this.setState({
                            selectNode : {refpk : result.data['pk_accsystem']},
                            isSaveAdd : isSaveAdd,
                            curTablestatus: 'browse'
                        },() => {
                            this.changeButtonStatus('save');
                            this.onRefreshAccsysClass();
                        });
                    }
                }
            });
        } , {"accsystem":"form","acctypes":"cardTable"} , 'card' )

    }

    //选中行事件-科目体系  props, moduleId(区域id), record（行数据）, index（当前index）
    onRowClick(props, moduleId, record, index){
        this.setState({cardtableindex : index});
    }

    //增加行-科目体系类型
    addLine(){
        //根据id获取表格中所有(可见)的行的数量
        let count = this.props.cardTable.getNumberOfRows(this.config.tableId);
        this.props.cardTable.addRow(this.config.tableId, count, {
            'code':{value: count+1+''},
            'ccode':{value: count+1+''},
            'balanorient': {value : '0', display: this.state.json['10140ACCSB-000016']},/* 国际化处理： 借*/
            'balanposition': {value: '0', display: this.state.json['10140ACCSB-000017']},/* 国际化处理： 左*/
            'type' : {value: '0', display: this.state.json['10140ACCSB-000018']},/* 国际化处理： 普通*/
            'dr':{value: 0}
        }, false)
        this.setState({cardtableindex: count});
        this.props.cardTable.focusRowByIndex(this.config.tableId, count);
    }

    //删除行-科目体系类型
    delLine(){
        let cardtableindex = this.state.cardtableindex;
        if(cardtableindex != -1){
            this.props.cardTable.delRowsByIndex(this.config.tableId, cardtableindex);
            let count = this.props.cardTable.getNumberOfRows(this.config.tableId);
            if(count>cardtableindex){
                this.props.cardTable.focusRowByIndex(this.config.tableId, cardtableindex);
            }else{
                this.setState({cardtableindex: cardtableindex-1});
                if(count!=0){
                    this.props.cardTable.focusRowByIndex(this.config.tableId, cardtableindex-1);
                }
            }
        }
    }

    //取消-科目体系
    onCancel(){
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140ACCSB-000019'],               // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
            content: this.state.json['10140ACCSB-000020'],             // 提示内容,非必输/* 国际化处理： 是否确定要取消？*/
            beSureBtnClick: () => {
                this.setState(
                    {pagesate: 'browse'},
                    () => {
                        this.setState(
                            {
                                curTablestatus: 'cancel'
                            },
                            () => {
                                let selTreerefpk = this.props.syncTree.getSelectNode(this.config.treeId);//获得树节点选中项
                                if(selTreerefpk && selTreerefpk['refpk']){
                                    this.onSelectTree(selTreerefpk.refpk);
                                }else{
                                    this.props.form.EmptyAllFormValue(this.config.headformId);
                                    this.props.cardTable.setTableData(this.config.tableId, {rows: []});
                                }
                                this.changeButtonStatus('cancel');
                            }
                        );
                    }
                );
            }
        });
    }

    /**
     * 删除-科目体系树
     * @param {*} treeNode 
     */
    onDeleteAccsysClass(treeNode){
        if(!treeNode || !treeNode['refpk']){
            toast({ color: 'danger', content: this.state.json['10140ACCSB-000021'] });/* 国际化处理： 请选择删除数据*/
            return;
        }

        promptBox({
            color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140ACCSB-000022'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
            content: this.state.json['10140ACCSB-000023'],             // 提示内容,非必输/* 国际化处理： 您确定要删除所选数据吗?*/
            beSureBtnClick: () => {
                let pk_accsystem = treeNode.nodeData['pk_accsystem'];
                let paramData = {
                    pk_accsystem : pk_accsystem,
                    ts : treeNode.nodeData['ts']
                };
                ajax({
                    url: urls['deleteUrl'],
                    data: paramData,
                    success:(result)=>{
                        toast({title:this.state.json['10140ACCSB-000024'],color:'success'});/* 国际化处理： 删除成功！*/
                        let selectNode = this.state.selectNode;
                        if(pk_accsystem===this.state.selectNode['refpk']){
                            this.props.button.setDisabled({'attributeControl' : true});
                            selectNode = {};
                        }
                        this.setState(
                            {selectNode : selectNode},
                            () => {
                                if(result.success){
                                    this.onRefreshAccsysClass();
                                }
                            }
                        );
                    }
                });
            }
        });
    }

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(id){
        let pageStutus = (id==='add' || id==='edit') ? 'edit' : 'browse';
        this.props.form.setFormStatus(this.config.headformId, pageStutus);
        this.props.cardTable.setStatus(this.config.tableId, pageStutus);
        switch(id){
            case 'add':
                this.props.button.setButtonVisible(['Add','attributeControl','structuralQuery','usage','Refresh', 'excel_opr'],false);
                this.props.button.setButtonVisible(['Save','SaveAdd','Cancel'],true);
                this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                this.setState({
                    treeDisabledSearch : true
                });
                break;
            case 'edit':
                this.props.button.setButtonVisible(['Add','attributeControl','structuralQuery','usage','Refresh','SaveAdd', 'excel_opr'],false);
                this.props.button.setButtonVisible(['Save','Cancel'],true);
                this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                this.setState({
                    treeDisabledSearch : true
                });
                break;
            case 'save':
                this.props.button.setButtonVisible(['Add','attributeControl','structuralQuery','usage','Refresh', 'excel_opr'],true);
                this.props.button.setButtonVisible(['Save','SaveAdd','Cancel'],false);
                this.props.syncTree.setNodeDisable(this.config.treeId,false);//设置整棵树可用
                this.setState({
                    treeDisabledSearch : false
                });
            case 'cancel':
                this.props.button.setButtonVisible(['Add','attributeControl','structuralQuery','usage','Refresh', 'excel_opr'],true);
                this.props.button.setButtonVisible(['Save','SaveAdd','Cancel'],false);
                this.props.syncTree.setNodeDisable(this.config.treeId,false);//设置整棵树可用
                this.setState({
                    treeDisabledSearch : false
                });
            default :
                break;
        }
    }

    /**
     * 表单编辑事件-科目体系
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index){
        switch(key){
            case "aaaaaa":
                break;
            default:
                break;
        }
    }

    /**
     * 刷新-科目体系
     */
    onRefreshAccsysClass(callback){
        this.props.form.EmptyAllFormValue(this.config.headformId);
        this.props.cardTable.setTableData(this.config.tableId, {rows: []});
        this.initData();//刷新树
        this.changeButtonStatus('refresh');
        
        callback && callback();
    }

    /**
     * 科目属性控制策略
     */
    onAttributeControl(){
        const selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
        if(selectedTreeNode==null){
            toast({ color: 'warning', content: this.state.json['10140ACCSB-000025'] });/* 国际化处理： 请选择科目体系*/
            return;
        }

        this.props.config['pk'] = selectedTreeNode.refpk;
        this.props.modal.show(tableId,{
            closeModalEve:() => {
                this.props.editTable.setStatus(gridId,'browse');
                this.props.modal.close(tableId);
                },
            title: this.state.json['10140ACCSB-000026'],/* 国际化处理： 科目属性控制策略*/
            noFooter:false,
            userControl:true,
            beSureBtnClick: this.saveAccFiled.bind(this), //点击确定按钮事件
            cancelBtnClick: () => {
                promptBox({
                    color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140ACCSB-000019'],/* 国际化处理： 确认取消*/
                    content: this.state.json['10140ACCSB-000027'],/* 国际化处理： 是否确认要取消*/
                    beSureBtnClick: () => {
                        this.props.editTable.setStatus(gridId,'browse');
                        this.props.modal.close(tableId);
                    }
                });
            },
            content: <AccFiledTable config={{}} {...this.props} ref={(AccFiledTable)=>this.AccFiledTable = AccFiledTable}   />
        });

    }

    /**
     * 保存-科目属性控制策略
     */
    saveAccFiled (){
        let changeRows= this.props.editTable.getChangedRows(tableId);
        let changedata={
            pageid:'10140ACCSB_accsys',
            model : {
                areaType: "table",
                pageinfo: null,
                rows: changeRows
            }};
        this.props.validateToSave( changedata , ()=>{
            ajax({
                url: urls['SaveAccFiledUrl'],
                data : changedata,
                async: false,
                success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let { success,data} = res;
                    if (success && data) {
                        if(data['flag']==='ctrlstrategyUpdateAccValuesCheck'){
                            promptBox({
                                color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: data['title'],
                                content: data['erroInfo'],
                                beSureBtnClick: () => {
                                    changedata['exdata'] = {
                                        "twoSubmit" : 'Y',   //代表是否为第二次提交数据
                                    }
                                    ajax({
                                        url: urls['SaveAccFiledUrl'],
                                        data : changedata,
                                        async: false,
                                        success: (twores) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                            let { success,data} = twores;
                                            if (success && data) {
                                                toast({title:this.state.json['10140ACCSB-000015'],color:'success'});/* 国际化处理： 保存成功！*/
                                                this.props.modal.close(tableId);
                                            }
                                        }
                                    })
                                }
                            });
                        }else{
                            toast({title:this.state.json['10140ACCSB-000015'],color:'success'});/* 国际化处理： 保存成功！*/
                            this.props.editTable.setStatus(gridId,'browse');
                            this.props.modal.close(tableId);
                        }
                    }
                },
                error : (res) => {
                    toast({ color: 'danger', content: res.message });
                }
            })
        } , {"accfieldcode":"editTale"} , 'grid' )

    }

    //科目体系结构查询
    onStructuralQuery(){
        const selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
        this.props.config['pk_accsystem'] = selectedTreeNode?selectedTreeNode['refpk']:'';
        this.props.config['name_accsystem'] = selectedTreeNode?selectedTreeNode['refname']:'';
        this.props.modal.show(strustId);
    }

    //科目表使用情况查询
    onUsage(){
        this.props.modal.show(accountUseage);
    }

    //获取列表肩部信息
	getTableHead = () => {
		let {button} = this.props;
		let { createButtonApp } = button;
		let buttons  = this.props.button.getButtons();
        let status = this.state.curTablestatus;
        if(status && (status==='add' || status==='edit')){
            return (
                <div className="shoulder-definition-area">
                    <div className="definition-icons">
                        {createButtonApp({
                            area: 'pageCard',//按钮注册中的按钮区域
                            onButtonClick: this.onButtonClick.bind(this)
                        })}
                        {this.props.cardTable.createBrowseIcons(this.tableId, {
                            iconArr: ['close', 'open', 'max','setCol'],
                            maxDestAreaId: 'nc-bill-card'
                        })}
                    </div>	
                </div>
            )
        }else{
            return '';
        }
	}

    /**
     * 渲染
     * @returns {*}
     */
    render(){
        
        const {syncTree,form,button,modal,cardTable,DragWidthCom} = this.props;
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个
        const {createCardTable} = cardTable;
        const {createButtonApp}=button;
        let { createModal } = modal;  //模态框

        let model = 
                <div>
                    <div>{/* <div className="xueWen"> */}

                        {/**科目属性控制策略**/}
                        {createModal(tableId)}

                        {/**科目体系结构查询**/}
                        {createModal(strustId,{
                            noFooter: true,
                            title: this.state.json['10140ACCSB-000028'],/* 国际化处理： 科目体系结构查询*/
                            size:'xlg', //  模态框大小 sm/lg/xlg
                            content:<List  config={{}}{...this.props}  ref={(List)=>this.List = List}/>,
                            closeModalEve: () => {
                                this.props.modal.close(strustId);
                                this.List.emptyTree();
                            } //取消按钮事件回调
                        })}
                        
                        {/*科目使用情况查询*/}
                        {createModal(accountUseage,{
                            noFooter: true,
                            title: this.state.json['10140ACCSB-000029'],/* 国际化处理： 科目使用情况查询*/
                            content:<AccountUseage  config={{}} {...this.props} ref={(accountUseage)=>this.accountUseage = accountUseage}/>,
                            cancelBtnClick: () => {
                                this.props.modal.close(accountUseage);
                            }
                        })}
                    </div>
                </div>;
        return(
            <div className="nc-bill-tree-card">
                {/* 头部 header*/}
                <HeaderArea
                    title = {this.config.title}
					btnContent = {createButtonApp({
                        area: 'btn-group',
                        onButtonClick: this.onButtonClick.bind(this),
                        popContainer: document.querySelector('.btn-group')
                    })}
				/>
                {model}
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        //左树区域
                        leftDom  =  {
                            <div className="tree-area">    
                                {createSyncTree({
                                    treeId : this.config.treeId,
                                    needEdit: true, //不启用编辑
                                    showLine: true, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                    clickAddIconEve: this.onAddAccsysClass.bind(this), //新增点击 回调
                                    clickEditIconEve: this.onEditAccsysClass.bind(this), //编辑点击 回调
                                    clickDelIconEve: this.onDeleteAccsysClass.bind(this), // 删除点击 回调
                                    showModal: false,
                                    searchType:'filtration',//树节点过滤方式修改
                                    disabledSearch: this.state.treeDisabledSearch
                                })}
                            </div>}
                        // 右卡片区域
                        rightDom = {
                            <div>
                                <div className="card-area">
                                    {createForm(this.config.headformId, {onAfterEvent: this.onAfterFormEvent.bind(this)})}
                                </div>
                                <div className="nc-bill-table-area">
                                    {createCardTable(this.config.tableId, {
                                        tableHead: this.getTableHead.bind(this),
                                        onRowClick : this.onRowClick.bind(this),
                                        showIndex: true,
                                        showCheck: false
                                    })}
                                </div>
                            </div>}
                        // 默认左侧区域宽度，px/百分百
                        defLeftWid = '280px'
                    />
                </div>
                <ExcelImport 
                    {...Object.assign(this.props)}
                    moduleName = 'uapbd'//模块名
                    billType = 'accsystem'//单据类型
                    selectedPKS = {this.state.selectedPKS}
                    //exportTreeUrl = {""}//自定义导出action接口(可不传)
                    appcode="10140ACCSB"          
                    pagecode="10140ACCSB_accsystem"

                />
            </div>
        )
        
    }
}

Accsystem = createPage({
    billinfo: [
        {
            billtype: 'form',
            pagecode: '10140ACCSB_accsys',
            headcode: formId,
            bodycode: ['acctypes','accfieldcode']
        },
        // {
        //     billtype: 'grid',
        //     pagecode: '10140ACCSB_accsys',
        //     bodycode: 'accfieldcode'
        // },
        // {
        //     billtype: 'grid',
        //     pagecode: '10140ACCSB_accsys',
        //     bodycode: 'acctypes'
        // }
        // ,
        // {
        //     billtype: 'form',
        //     pagecode: '10140ACCSB_accsys',
        //     bodycode: 'formAccount'
        // },
        // {
        //     billtype: 'grid',
        //     pagecode: '10140ACCSB_accsys',
        //     bodycode: 'account_accass'
        // },
        // {
        //     billtype: 'grid',
        //     pagecode: '10140ACCSB_accsys',
        //     bodycode: 'account_crlmd'
        // },
        // {
        //     billtype: 'grid',
        //     pagecode: '10140ACCSB_accsys',
        //     bodycode: 'listAccount'
        // }
    ]

})(Accsystem);
ReactDOM.render(<Accsystem  {...{config:config}} />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65