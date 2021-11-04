//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,cardTable,print,high,promptBox,createPageIcon, getBusinessInfo,excelImportconfig  } from 'nc-lightapp-front';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef/index';
import BankTypeTree from "../component/bankTypeTree";
import BankTypeForm from "../component/bankTypeForm";
import Utils from "../../../public/utils/index.js";
import BankDocGrid from '../component/bankDocGrid';
import './index.less';

const { PrintOutput, ExcelImport } = high;
const {BDselect,BillCodeUtil} = Utils;
const {NCCheckbox} = base;
const {NCMessage:Message,NCDiv} = base;
var currRow;
var urls = {
    loadTreeDataUrl:"/nccloud/uapbd/bankacc/loadtree.do",
    queryTemplateUrl:"/nccloud/platform/templet/querypage.do",
    loadDocTreeUrl:"/nccloud/uapbd/bankacc/loaddoctree.do",
    queryCardUrl:"/nccloud/uapbd/bankacc/loaddocdata.do",
    saveTypeUrl:"/nccloud/uapbd/bankacc/savetypedata.do",
    queryTypeUrl:"/nccloud/uapbd/bankacc/querybanktype.do",
    deleteTypeUrl:"/nccloud/uapbd/bankacc/delbanktype.do",
    saveUrl:'/nccloud/uapbd/bankacc/savebankdoc.do',
    deleteUrl:'/nccloud/uapbd/bankacc/delbankdoc.do',
    savelinkman:'/nccloud/uapbd/bankacc/savelinkman.do',
    delLinkman:'/nccloud/uapbd/bankacc/dellinkman.do',
    queryCurrOrg : "/nccloud/uapbd/bankacc/querycurrorg.do",
    validateaccess : "/nccloud/uapbd/bankacc/validateaccess.do",
    enablestateUrl:"/nccloud/uapbd/bankacc/enablestate.do",
    synclinenum:"/nccloud/uapbd/bankacc/synclinenum.do",
    print:"/nccloud/uapbd/bankacc/print.do",
    querysysparam:"/nccloud/uapbd/bankacc/querysysparam.do",
    psnaccsave:"/nccloud/uapbd/bankacc/psnaccsave.do",
    dataPermission:"/nccloud/uapbd/bankacc/datapermission.do"
};
let tableId,linkManRecord={},lineIndex,pk_banktype,pageCode;
class BankPageView extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            title:'',
            treeRootTitle:'',/* 国际化处理： 银行档案*/
            accessMessage:'',
            treeId:"bankTypeTree",
            formId:"bankdoc",
            formId2:'linkmansform2',
            pageCode:"",
            modalFormId:'banktype',
            modalFormPagecode:'10140BANK_banktype',
            type:'glb',
            primaryKey:'',
            urls:urls,
            metaId:'bf5aeed4-6b35-4a2e-b750-b9aabce59e21',
            classid:'8558d779-58ff-4c34-9528-33646cb84185'
        },this.props.config);
        tableId = this.config.tableId;
        pageCode = this.config.pageCode;
        this.state = {
            stopFlag: false,//判断 显示停用按钮是否选中
            showCust:false,//显示客商
            showOthers:false,//显示其他组织
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            curOrg:this.config.pk_group,//当前组织
            businessOrg:'',//业务单元
            oldParent:'',//原父节点
            data:'',//导出配置
            isAdd:false,//新增标志  默认false
            mode:'',//管控模式
            sysParam:{},//业务参数设置
            disabled:false,//显示停用状态控制
            disabledSearch:false,//控制树搜索框
            json:{},
            inlt:{},
            selectedPKS: {}
        };
        let callback = (json,status,inlt)=> {
            this.state.json = json;//多语对象
            this.state.inlt = inlt;//用来处理占位符
            /* 国际化处理： 银行-全局,银行-集团,银行-业务单元*/
            this.config.title = this.props.config.type == 'glb' ? this.state.json['10140BANK-000001'] : this.props.config.type == 'grp' ? this.state.json['10140BANK-000002'] : this.state.json['10140BANK-000004'];
            this.state.title = this.props.config.type == 'glb' ? this.state.json['10140BANK-000001'] : this.props.config.type == 'grp' ? this.state.json['10140BANK-000002'] : this.state.json['10140BANK-000004'];
            /* 国际化处理： 银行档案*/
            this.config.treeRootTitle = this.state.json['10140BANK-000000'];
            /* 国际化处理： 集团节点只能维护当前登录集团的数据,组织节点只能维护当前节点有权限组织的数据*/
            this.config.accessMessage = this.props.config.type == 'glb' ? '' : this.props.config.type == 'grp' ? this.state.json['10140BANK-000003'] : this.state.json['10140BANK-000005'];


            this.initTemplate.call(this, this.props, (context) => {
                this.state.context = context;
                this.state.businessOrg = {
                    refpk: context.pk_org,
                    refname: context.org_Name
                };
                this.getCurrOrg(()=>{
                    this.onOrgChange.call(this, this.state.businessOrg);
                });
            });
        }
        //加载多语文件
        this.props.MultiInit.getMultiLang({moduleId: '10140BANK',domainName: 'uapbd',callback});


        this.initLinkManRecord = this.initLinkManRecord.bind(this);
        this.initLinkManRecord();
        this.onSaveBankType = this.onSaveBankType.bind(this);
        this.showTypeForm = this.showTypeForm.bind(this);
        this.showRightForm = this.showRightForm.bind(this);
        this.getBankTypeNode = this.getBankTypeNode.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.getCurrOrg = this.getCurrOrg.bind(this);
        this.isAccessOfCurrNode = this.isAccessOfCurrNode.bind(this);
        this.filterRefer = this.filterRefer.bind(this);
        this.printPage = this.printPage.bind(this);
        this.initBDselect = this.initBDselect.bind(this);
        this.beforeAction = this.beforeAction.bind(this);
        this.getSysParam = this.getSysParam.bind(this);
        this.savePsnAcc = this.savePsnAcc.bind(this);
        this.disableElems =this.disableElems.bind(this);
        this.modifierMeta = this.modifierMeta.bind(this);
        this.dataPermission = this.dataPermission.bind(this);
        this.disableBatchDel = this.disableBatchDel.bind(this);
        this.tableButtonClick = this.tableButtonClick.bind(this);
    }

    /**
     * 加载模板
     */
    initTemplate = (props,callback)=>{
        let me = this;
        props.createUIDom(
            {
                pagecode: props.config.pageCode//页面id
                //appid: props.config.appid//注册按钮的id
            },
            function (data){
                if(data){
                    if(data.template){
                        let meta = data.template;
                        me.modifierMeta.call(this,props,meta);
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        let billType = 'bankdocinfo_' + me.props.config.type

                        let funcnode = '';

                        switch(me.config.type){
                            case 'glb':
                                funcnode = '10140BANK';
                                break;
                            case 'grp':
                                funcnode = '10140BANKG';
                                break;
                            case 'org':
                                funcnode = '10140BANKO';
                                break;
                        }
                        props.button.setButtons(button, () => {
                            props.button.setUploadConfig("Import",excelImportconfig(props,"uapbd",billType,true,"",{appcode: funcnode, pagecode: pageCode},()=>{me.onButtonClick(me.props, 'refresh')}));
                        });
                        //props.button.setPopContent({'DelLine':me.state.json['10140BANK-000014']});/* 国际化处理： 确认要删除该信息吗？*/
                        me.buttonStatus(props,'browse');
                        //props.button.setButtonVisible('Synchronise',false);
                    }
                }
                callback && callback(data.context);
            }
        )
    }

    /**
     * 修改模板
     * @param props
     * @param meta
     * @returns {*}
     */
    modifierMeta(props, meta) {
        let me = this;
        let status ;
        try{
            status = props.getUrlParam('status');
        }catch(e){
            status = 'browse';
        }
        meta[props.config.formId].status = status;
        meta[tableId].status = 'browse';
        //设置地区代码参照
        // props.form.setFormItemsDisabled(me.config.formId,{'pcombinename':false});
        // meta['bankdoc'].items.forEach((item)=>{
        //     if(item.attrcode == 'pcombinename'){
        //         items.disabled = true;
        //     }
        // });
        meta['netbankinfo'].items.forEach((item)=>{
            if(item.attrcode == 'areacode'){
                item['refName'] = me.state.json['10140BANK-000039'];/* 国际化处理： 地区代码*/
                item['placeholder'] = me.state.json['10140BANK-000039'];/* 国际化处理： 地区代码*/
                item['onlyLeafCanSelect'] = item.onlyLeafCanSelect;//设置只可选择末级
                item['rootNode'] = { refname: me.state.json['10140BANK-000039'], refpk: 'root' };/* 国际化处理： 地区代码*/
                item['refcode'] = 'uapbd/refer/userdef/DefdocTreeRef/index.js';
                item['queryCondition'] = () => {
                    return {
                        pk_defdoclist: '1001ZZ10000000009031'
                    };
                };
            }
        });

        let porCol = {
            attrcode: 'opr',
            label: me.state.json['10140BANK-000040'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            //fixed:'right',
            render(text, record, index) {
                let btnArray = me.tableBtnAry(props);
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "link_opr",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => me.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        };
        meta[tableId].items.push(porCol);

        return meta;
    }

    /**
     * table操作列点击
     * @param props
     * @param id
     * @param text
     * @param record
     * @param index
     * @returns {boolean}
     */
    tableButtonClick(props, id, text, record, index){
        let status = props.form.getFormStatus(props.config.formId);
        if(status != 'add' && status != 'edit')
            return false;
        switch(id){

            case "DelLine"://删除行
                props.cardTable.delRowsByIndex(tableId, index,()=>{
                    this.disableBatchDel();
                });
                /*let rows = props.cardTable.getAllRows(tableId);
                props.button.setDisabled({'BatchDel':rows == 0  ? true : false});*/
                break;
            case "EditLine"://编辑
                props.cardTable.openModel(tableId,'edit',record,index);
                lineIndex = index;
                linkManRecord.rows[0] = record;
                console.log(linkManRecord)
                break;
            case "PasteLine"://粘贴
                props.cardTable.pasteRow(tableId,  index,["pk_banklinkman","pk_linkman"]);
                //暂时手动处理，等平台更新后可取消
                props.cardTable.setValByKeyAndIndex(tableId,index+1,'pk_banklinkman',{value:""});
                props.cardTable.setValByKeyAndIndex(tableId,index+1,'pk_linkman',{value:""});
                break;
            default:
                console.log(id,index);
                break;
        }
    }
    tableBtnAry =(props)=>{
        let status = props.form.getFormStatus('bankdoc');
        return 'add,edit'.includes(status)
            ?  ['DelLine','EditLine','PasteLine'] : [ '' ];
    }

    /**
     * 按钮和表单状态
     * @param props
     * @param status
     */
    buttonStatus(props,status){
        //按钮的显示状态
        if(status == 'edit' || status == 'add' || status=='cancel'){
            if(status=='cancel'){
                props.form.setFormItemsDisabled(`bankdoc`,{'enablestate':false});
                props.button.setButtonVisible(['Save','Cancel','SaveAndAdd','AddLine','BatchDel'],false);
                props.button.setButtonVisible(['Edit','Add','Copy','Delete','Refresh','Query','PrintMenu','Synchronise', 'Import', 'Export'],true);
                //props.button.setButtonVisible(['Edit','Add','Copy','Delete','Refresh','Query','PrintMenu'],true);
                //props.cardTable.setColEditableByKey(tableId,'opr',false);
            }else{
                props.form.setFormItemsDisabled(`bankdoc`,{'enablestate':true});
                props.button.setButtonVisible(['Edit','Add','Copy','Delete','Refresh','Query','PrintMenu','Synchronise', 'Import', 'Export'],false);
                props.button.setButtonVisible(['Save','Cancel','SaveAndAdd','AddLine','BatchDel'],true);
                //props.cardTable.setColEditableByKey(tableId,'opr',true);
            }
            props.button.setDisabled({
                'Save':false,
                'Cancel':false,
                'SaveAndAdd':status == 'edit' ? true : false,
                //'AddLine':status == 'cancel' ? true : false,
                //'BatchDel':status == 'cancel' ? true : false,
                'DelLine':false,
                'EditLine':false,
                'PasteLine':false
            });
        }else{
            props.form.setFormItemsDisabled(`bankdoc`,{'enablestate':false});
            props.button.setButtonVisible(['Save','Cancel','SaveAndAdd','AddLine','BatchDel'],false);
            props.button.setButtonVisible(['Edit','Add','Copy','Delete','Refresh','Query','PrintMenu','Synchronise', 'Import', 'Export'],true);
            //props.button.setButtonVisible(['Edit','Add','Copy','Delete','Refresh','Query','PrintMenu'],true);
            if(status == 'browse'){
                props.button.setDisabled({
                    'Edit':true,
                    'Add':true,
                    'Copy':true,
                    'Delete':true,
                    'PrintMenu':true,
                    'output':true,
                    'Refresh':false,
                    'Query':false,
                    //'AddLine':true,
                    //'BatchDel':true,
                    'Synchronise':true
                });
            }else{
                props.button.setDisabled({
                    'Edit':false,
                    'Add':false,
                    'Copy':false,
                    'Delete':false,
                    'PrintMenu':false,
                    'output':false,
                    'Refresh':false,
                    'Query':false,
                    //'AddLine':true,
                    //'BatchDel':true,
                    'Synchronise':false
                });
            }

            //props.cardTable.setColEditableByKey(tableId,'opr',false);
        }
    }
    /**
     * 获取管控模式
     */
    initBDselect(){
        var me = this;
        let BDSelected = new BDselect(me.config.classid);
        BDSelected.getModeByClassid(me.config.classid,(modeData)=>{
            if(!modeData){
                toast({title:me.state.json['10140BANK-000015'],color:'warning'});/* 国际化处理： 未设置管控模式！*/
            }
            me.state.mode = modeData.managemode;
            me.setState(me.state);
        });
    }

    /**
     * 操作数据前校验管控模式
     */
    beforeAction(){
        var me = this;
        let glbArr = [BDSelected.SCOPE_GLOBE,BDSelected.SCOPE_GLOBE_GROUP,BDSelected.SCOPE_GLOBE_GROUP_ORG,BDselect.SCOPE_GLOBE_ORG];
        let grpArr = [BDSelected.SCOPE_GROUP,BDSelected.SCOPE_GROUP_ORG];
        if(glbArr.includes(me.state.mode)){
            if('glb' != me.config.type){
                toast({title:me.state.json['10140BANK-000016'],color:'warning'});/* 国际化处理： 管控模式为全局、全局+集团、全局+集团+组织或 全局+组织时，只能在全局节点设置调整项！*/
                return;
            }
        }
        if(grpArr.includes(me.state.mode)){
            if('grp' != me.config.type){
                toast({title:me.state.json['10140BANK-000017'],color:'warning'});/* 国际化处理： 管控模式为集团+组织或 集团时，只能在集团节点设置调整项！*/
                return;
            }
        }
    }
    /**
     * 获取当前登录用户组织
     */
    getCurrOrg(callback){
        var me = this;
        let requestparam = {
            type:me.config.type
        }
        ajax({
            url: urls['queryCurrOrg'],
            //async:false,
            data:requestparam,
            success: function (res) {
                if(res.success){
                    me.state.curOrg = {
                        refpk:res.data.pk_org,
                        refcode:res.data.code,
                        refname:res.data.name
                    };
                    me.setState(me.state,()=>{
                        callback && callback();
                    });
                }
            }
        })
        console.log(this.state);
    }
    /*
    初始化linkManRecord
     */
    initLinkManRecord(){
        linkManRecord.areaType = 'form';
        linkManRecord.rows = [{values:{}}];
    }

    componentWillMount(){
        //设置当前登录人组织信息
        //this.getCurrOrg();
        //document.body.style.overflow = 'hidden';
        /* //初始化获取管控模式
         this.initBDselect();*/
    }
    componentDidMount(){
        //document.getElementsByClassName('dragWidthCom')[0].style.minHeight = '100%';
    }
    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.config.formId);

        if(!formStatus || formStatus === 'browse'){
            window.onbeforeunload = null;
            //控制开关状态
            let pk_bankdoc = this.props.form.getFormItemsValue(this.config.formId,'pk_bankdoc');
            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:pk_bankdoc.value ? false : true});
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
            let enablestate = this.props.form.getFormItemsValue(this.config.formId,'enablestate');
            //解决编辑公式时调用平台方法会报异常（开关需要转为对应值）
            this.props.form.setFormItemsValue(this.config.formId,{enablestate:{value:enablestate.value ? '2' : '3'}});
        }
    }
    /**
     * 查询业务参数设置BD502
     */
    getSysParam(callback){
        let me = this;
        ajax({
            url: urls['querysysparam'],
            //async:false,
            data:{},
            success:(result)=>{
                let {data,success} = result;
                if(success){
                    if(data){
                        me.setState({
                            sysParam:data
                        },()=>{
                            // me.props.form.setFormItemsDisabled(me.config.formId,{
                            //     'pcombinename':data.value && data.value == 'Y' ? true : false
                            // });
                            let meta = me.props.meta.getMeta();
                            if(me.state.sysParam.value == 'N'){
                                meta[me.config.formId].items.find((item)=>item.attrcode=='pk_combine').checkStrictly=false;
                                me.props.meta.setMeta(meta);
                            }
                            if(callback)
                                callback();
                        });
                    }
                }
            }
        })
    }
    /**
     * 保存人行联行信息
     */
    savePsnAcc(val,flag){
        let me = this;
        let requestParam = {
            flag:flag,
            value:val
        }
        ajax({
            url: urls['querysysparam'],
            //async:false,
            data:{},
            success:(result)=>{
                let {data,success} = result;
                if(success){
                    if(data){
                        if(flag === 'add')
                            me.props.form.setFormItemsValue(me.config.formId,{
                                'pk_combine':{value:data.pk_asslinenum,display:val}
                            });
                    }
                }
            }
        })
    }
    /**
     * 加载右边卡片对应节点数据
     * @param addUserJson 新增时传入的默认值对象
     */
    loadNodeData(nodeId,callback,addUserJson){
        var me = this;
        //选中根节点时清空擦片数据
        if((!nodeId || nodeId == '~') && !addUserJson){
            me.props.form.EmptyAllFormValue(me.config.formId);
            me.props.form.setFormItemsDisabled(me.config.formId,{enablestate:true});
            me.props.cardTable.setTableData(me.config.tableId,{rows:[]});
            return;
        }
        let refpk = nodeId instanceof Array ? nodeId[0] : nodeId;
        let requestParam = {
            refpk:refpk,
            pageCode:this.config.pageCode,
            pk_org:this.state.curOrg.refpk,
            formId:this.config.formId,
            formId2:this.config.formId2,
            stopFlag:this.state.stopFlag,
            showCust:this.state.showCust || false,
            showOthers:this.state.showOthers || false
        }
        //处理新增时传入参数
        if(addUserJson){
            requestParam.userJson = addUserJson;
        }
        //后台查询对应节点数据
        ajax({
            url:this.config.urls.queryCardUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //显示公式
                    if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
                        me.props.dealFormulamsg(
                            result.formulamsg,
                            {
                                [me.config.formId]:'form',
                                [me.config.tableId]:'cardTable',
                                [`${me.config.tableId}form1`]:'form',
                                [`${me.config.tableId}form2`]:'form'
                            }
                        );
                    }
                    me.props.cardTable.setTableData(me.config.tableId,{rows:[]});
                    //清空表单
                    me.props.form.EmptyAllFormValue(me.config.formId);
                    //me.props.form.EmptyAllFormValue(me.config.formId2);
                    //设置表单为所选树节点数据
                    if(result.data){
                        let datas = result.data[0];
                        let formId = me.config.formId;
                        datas[formId].rows = Utils.convertGridEnablestate(datas[formId].rows);
                        Utils.filterEmptyData(datas[formId].rows[0].values);
                        me.props.form.setAllFormValue({[formId]:datas[formId]});
                        me.filterRefer(datas[formId].rows[0].values);
                        //设置联系人
                        if(result.data[1]){
                            //手动设置联系人显示值
                            for(let record of result.data[1].linkmans.rows){
                                record.values.linkman.display = record.values.name.value;
                            }
                            me.props.cardTable.setTableData(me.config.tableId,result.data[1].linkmans);
                        }
                    }
                    me.props.form.setFormItemsDisabled(me.config.formId,{enablestate:false});
                    /**
                     * 加载数据后判断是否有权限操作当前记录
                     * @type {boolean}
                     */
                    me.isAccessOfCurrNode('before',(isAccess)=>{
                        if(!isAccess){
                            me.props.button.setButtonVisible(['Edit','Delete'],false);
                        }else
                            me.props.button.setButtonVisible(['Edit','Delete'],true);
                        //me.setState(me.state,()=>{
                            callback && callback();
                       // });
                    });

                }
            }
        });
    }

    /**
     * 点击编辑事件
     * @param item
     */
    clickEditIconEve(item){
        this.state.selectedNode = item;
        this.setState(this.state,()=>{
            this.showTypeForm(item,'edit');
        });
    }

    /**
     * 树节点新增、修改 保存操作
     */
    onSaveBankType(){
        /**************************************************
         *
         * 保存：
         *     1、获取表单对象
         *     2、构造请求参数模型
         *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
         *     4、回调，刷新当前树节点的父节点
         *
         * 保存状态下：
         *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
         *
         **************************************************/

        let formData = this.BankTypeForm.form.getAllFormValue(this.config.modalFormId);//获得表单信息;
        let pk;
        if(formData.rows[0].values.hasOwnProperty('pk_banktype')){
            pk = formData.rows[0].values.pk_banktype.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
            formData.areacode = this.config.modalFormId;//添加表单的areacode编码
        }
        /***设置请求参数***/
        formData.rows['status'] = '2';//设置状态
        let businessLogic = ()=>{
            let requestParam = {
                model: formData,
                pageid: this.config.pageCode
            };
            /**判断刷新父节点，还是刷新选中节点
             * 如果是新增，就刷新当前选中节点
             * 如果是编辑，就刷新当前节点的父节点
             **/
            let isAdd = false;//false时新增 即刷新当前节点 true为编辑 即刷新父节点
            if(pk == null || pk ==''){
                isAdd = true;
            }
            ajax({
                url: urls['saveTypeUrl'],
                data: requestParam,
                success: (result) => {
                    if(result.success){
                        //设置表单浏览态
                        this.BankTypeForm.form.setFormStatus(this.config.modalFormId, 'browse');
                        //设置树可用
                        //this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        if(isAdd){
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data);
                        }else{
                            //修改回调后修改
                            this.props.syncTree.editNodeSuccess(this.config.treeId,result.data[0]);
                        }
                        //展开树节点
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data[0].pid);

                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].refpk);
                        //设置选中节点
                        /*this.state.curSelectedNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, result.data[0].refpk);
                        this.setState(this.state);*/
                        this.props.modal.close("type");
                        toast({title:this.state.json['10140BANK-000018'],color:'success'});/* 国际化处理： 保存成功！*/
                        if(document.getElementsByClassName('u-tree-treenode-selected'))
                            document.getElementsByClassName('u-tree-treenode-selected')[0] && document.getElementsByClassName('u-tree-treenode-selected')[0].scrollIntoView();
                    }
                }
            });
        }
        this.BankTypeForm.validateToSave({model:formData,pageid:this.config.modalFormPagecode},businessLogic,{[this.config.modalFormId]:'form'},'form');
    }

    /**
     * 显示银行档案类型表单
     * @param item
     * @param type
     */
    showTypeForm(item,type){
        let me = this;
        let pk_banktype='';
        if(item.refpk != '~' && item.pid == '~')
            pk_banktype = item.refpk;
        else
            pk_banktype = '';

        let formConfig = {
            pk_banktype:pk_banktype,
            pk_org:me.state.curOrg.refpk,
            pageCode:'10140BANK_banktype',
            title:me.state.json['"10140BANK-000013"'],//多语 银行类别维护界面
            type:type || 'add',
            formId:me.config.modalFormId
        };
        me.dataPermission(type,()=>{
            me.props.modal.show('type',{
                noFooter:false,
                userControl:true,
                //content:this.props.form.createForm(this.config.modalFormId,{}),
                content:<BankTypeForm config={formConfig} ref={(BankTypeForm)=>me.BankTypeForm = BankTypeForm}/>,
                title:me.state.json['10140BANK-000013'],/* 国际化处理： 银行类别维护界面*/
                beSureBtnClick:me.onSaveBankType,
                cancelBtnClick:()=>{
                    promptBox({
                        color:'warning',
                        title:me.state.json['10140BANK-000019'],/* 国际化处理： 确认取消*/
                        content:me.state.json['10140BANK-000020'],/* 国际化处理： 是否确认取消?*/
                        beSureBtnClick:()=>{me.props.modal.close(`type`)}
                    })

                }
            });
        },pk_banktype);
        //<BankTypeForm config={config}/>
    }
    /**
     * 点击新增图标
     * @param item
     */
    clickAddIconEve(item){
        this.state.selectedNode = item;
        this.setState(this.state,()=>{
            this.showTypeForm(item,'add');
        });
    }
    /**
     * 点击删除图标
     * @param flag delButton 表示点击删除按钮，删除银行档案
     */
    clickDelIconEve(selectedTreeNode,flag,BillCode){
        if (!selectedTreeNode || !selectedTreeNode.hasOwnProperty("refpk")) {
            toast({content: this.state.json['10140BANK-000021'], color: 'warning'});/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        if(selectedTreeNode.refpk == '~'){
            toast({content: this.state.json['10140BANK-000022'], color: 'warning'});/* 国际化处理： 根节点不能删除*/
            return;
        }
        /*this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state,()=>{*/
        if(!flag){//点击左树删除图标
            this.dataPermission('delete',()=>{
                promptBox ({
                    color:'warning',
                    title: this.state.json['10140BANK-000023'],/* 国际化处理： 确认删除*/
                    content: this.state.json['10140BANK-000024'],/* 国际化处理： 您确定要删除选中的数据吗？*/
                    beSureBtnClick: ()=>{
                        promptBox ({
                            color:'warning',
                            title: this.state.json['10140BANK-000023'],/* 国际化处理： 确认删除*/
                            content: this.state.json['10140BANK-000025'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
                            beSureBtnClick: ()=>{
                                this.delNodeEve(selectedTreeNode);
                            },
                            backdrop: 'static'
                        })
                    },
                    cancelBtnClick:()=>{
                        this.props.modal.close(`delNode`);
                    },
                    backdrop: 'static'
                })
            },selectedTreeNode.refpk);
        }else{
            promptBox ({
                color:'warning',
                title: this.state.json['10140BANK-000023'],/* 国际化处理： 确认删除*/
                content: this.state.json['10140BANK-000024'],/* 国际化处理： 您确定要删除选中的数据吗？*/
                beSureBtnClick: ()=>{
                    promptBox ({
                        color:'warning',
                        title: this.state.json['10140BANK-000023'],/* 国际化处理： 确认删除*/
                        content: this.state.json['10140BANK-000025'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
                        beSureBtnClick: ()=>{
                            let data = this.props.form.getAllFormValue(this.config.formId);
                            this.delNodeEve(selectedTreeNode,flag);
                            BillCode.setType('delete');
                            BillCode.getBillCode(data);
                        },
                        backdrop: 'static'
                    })
                },
                cancelBtnClick:()=>{
                    this.props.modal.close(`delNode`);
                },
                backdrop: 'static'
            })
        }
        // });

    }
    /**
     * 删除树节点
     * @param selectedTreeNode 树选中节点
     * @param flag  标志是点击按钮删除 还是点击树节点删除图标
     */
    delNodeEve(selectedTreeNode,flag){
        let requestParam ;
        if(!flag)
            requestParam = {
                pk_banktype:selectedTreeNode.refpk,
                pk_org:this.state.curOrg.refpk,
                type:this.config.type
            };
        else{
            let formdata = this.props.form.getAllFormValue(this.config.formId);
            let enablestate = formdata.rows[0].values.enablestate.value;
            formdata.rows[0].values.enablestate = {value:enablestate? "2" : "3"};
            requestParam = {
                model: formdata,
                pageid: this.config.pageCode
            };
        }
        ajax({
            url: flag ? this.config.urls.deleteUrl : this.config.urls.deleteTypeUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    /**************************************************************
                     * 清空表单数据
                     **************************************************************/
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.props.cardTable.setTableData(this.config.tableId,{rows:[]});
                    /**************************************************************
                     * 删除树节点
                     **************************************************************/
                    this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                    /**************************************************************
                     * 删除成功提示
                     **************************************************************/
                    toast({title:this.state.json['10140BANK-000026'],color:"success"});/* 国际化处理： 删除成功！*/
                    this.buttonStatus(this.props,'browse');
                    this.setState(this.state);
                }
            }
        });
    }

    /**
     * 当选中节点为银行档案，即不是第一层节点时，获取操作银行档案对应的银行类型
     * @param currNode
     * @returns {*}
     */
    getBankTypeNode(currNode){
        var me = this;
        let parentNode = me.props.syncTree.getSyncTreeValue(me.config.treeId,currNode.pid);
        if(parentNode.refpk != '~' && parentNode.pid=='~') {
            console.log(parentNode)
            return parentNode;
        }else{
            let node = me.getBankTypeNode(parentNode);
            if(node.refpk != '~' && node.pid=='~') {
                return node;
            }
        }
    }

    /**
     * 获取当前用户是否具有操作该节点的权限
     * @returns {boolean}
     */
    isAccessOfCurrNode(flag,callback){
        var me = this;
        /*if(me.config.type == 'glb'){
            if(callback)
                callback(true);
            return true;
        }*/

        let currNode = me.BankTypeTree.getSelectedTreeNode();

        let requestParam = {
            type:me.config.type,
            refpk:currNode.refpk,
            curOrg:me.state.businessOrg.refpk || me.state.curOrg.refpk
        }
        if(flag)
            requestParam = {
                type:me.config.type,
                refpk:currNode.refpk,
                curOrg:me.state.businessOrg.refpk || me.state.curOrg.refpk,
                before:flag
            }
        let res = false;
        ajax({
            url: urls['validateaccess'],
            //async:false,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    let {errMsg,isAccess} = result.data;
                    errMsg && toast({content:errMsg,color:'danger'});
                    callback && callback(isAccess);
                }
            }
        })
        return res;
    }

    /**
     * 数据权限校验
     * @param operator   操作
     * @param pk_banktype  区分是银行类型还是银行档案
     * @param ignorePermission   忽略数据权限，即提示无权限后是否继续后续回调
     * @param callback
     */
    dataPermission(operator,callback,pk_banktype,ignorePermission){
        let me = this;
        let requestParam = {
            operate:operator || 'edit',
            type:'banktype',
            pk_banktype:pk_banktype || 'a'
        }
        if((pk_banktype || pk_banktype == '') && operator == 'add'){
            callback && callback();
            return;
        }
        if(!pk_banktype){
            let cardData = me.props.createMasterChildData(me.config.pageCode,me.config.formId,me.config.tableId);
            let enablestate = cardData.head.bankdoc.rows[0].values.enablestate.value;
            cardData.head.bankdoc.rows[0].values.enablestate = {value:enablestate? "2" : "3"};
            //手动处理银行类型未获取到情况。具体原因不明
            let banktype = cardData.head.bankdoc.rows[0].values.pk_banktype.value;
            if(!banktype)
                cardData.head.bankdoc.rows[0].values.pk_banktype = pk_banktype;
            requestParam = {
                operate:operator || 'edit',
                type:'bankdoc',
                ...cardData
            }
        }

        ajax({
            url:urls['dataPermission'],
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    callback && callback(true);
                }
            },
            error:(res)=>{
                toast({ color: 'danger', content: JSON.stringify(res.message)});
                ignorePermission && callback && callback(false);
            }
        });
    }
    /**
     * 设置参照过滤条件
     * @param bankDoc
     */
    filterRefer(bankDoc){
        let me = this;
        me.props.meta.getMeta()[me.config.formId].items.forEach((item)=>{
            if(item.attrcode=='pk_fatherbank'){
                item.queryCondition={
                    pk_banktype:bankDoc.pk_banktype.value
                }
            }
            if(item.attrcode == 'pk_combine'){
                item.queryCondition={
                    flag:'pk_combine',
                    GridRefActionExt:'nccloud.web.uapbd.bankacc.action.BankdocListFilterOrg',
                    pk_banktype:bankDoc.pk_banktype.value
                }
            }
        });
        /*meta[me.config.formId].items.find((item) => item.attrcode == 'pk_fatherbank').queryCondition = () => {
            return {
                pk_banktype: bankDoc.pk_banktype.value
            };
        };
        me.props.meta.setMeta(meta);*/
    }

    /**
     * 设置checkbox和树搜索框状态
     * @param flag
     * @param callback
     */
    disableElems(flag,callback){
        let me = this;
        me.setState({
            disabled:flag,
            disabledSearch:flag
        },()=>{
            if(callback)
                callback();
        });
    }
    /**
     * 展示form
     * @param type
     */
    showRightForm(type,BillCode, callBack=null){
        var me = this;
        type = type.toLowerCase();
        //  为何要把选中的节点放到BankTypeTree的state当中
        // 当调用setNodeSelected的时候，貌似不会调用树选中的回调事件
        let currNode = me.props.syncTree.getSelectNode(me.config.treeId) || me.BankTypeTree.getSelectedTreeNode();
        //let currNode = me.BankTypeTree.getSelectedTreeNode();
        //控制批量删除按钮状态
        let rows = me.props.cardTable.getAllRows(me.config.tableId);
        let isDisabled = type == 'add' || rows == 0  ? true : false;
        me.props.button.setDisabled({'BatchDel':isDisabled});

        if(type == 'add'){
            me.props.cardTable.setStatus(tableId,'edit');
            me.getSysParam(()=>{
                let addUserJson = {};
                //非根节点
                if(currNode.refpk != '~') {
                    if (currNode.pid == '~'){//第一层节点
                        pk_banktype = {value:currNode.refpk,display:currNode.refname};
                        addUserJson = {
                            'pk_org':me.config.type == 'glb' ? me.state.curOrg.refpk : (me.state.businessOrg.refpk || me.state.curOrg.refpk),
                            'pk_bankdoc':'',
                            'pk_banktype': currNode.refpk,
                            'pk_country':'0001Z010000000079UJJ',
                            'enablestate':'2'
                        };
                        /*me.props.form.setFormItemsValue(me.config.formId,{
                            'pk_org':me.config.type == 'glb' ? {value:me.state.curOrg.refpk,display:me.state.json['10140BANK-000027']} : {value:me.state.businessOrg.refpk || me.state.curOrg.refpk,display:me.state.businessOrg.refname || me.state.curOrg.refname},/!* 国际化处理： 全局*!/
                            'pk_bankdoc':{value:''},
                            'pk_banktype': {value:currNode.refpk,display:currNode.refname},
                            'pk_country':{value:'0001Z010000000079UJJ',display:me.state.json['10140BANK-000028']},/!* 国际化处理： 中国*!/
                            'enablestate':{value:'2'}
                        });*/
                    }else{
                        let bankNode = me.getBankTypeNode(currNode);
                        pk_banktype = {value:bankNode.id,display:bankNode.refname};
                        addUserJson = {
                            'pk_org':me.config.type == 'glb' ? me.state.curOrg.refpk : (me.state.businessOrg.refpk || me.state.curOrg.refpk),
                            'pk_bankdoc':'',
                            'pk_banktype': bankNode.id,
                            'pk_fatherbank':currNode.refpk,
                            'pk_country':'0001Z010000000079UJJ',
                            'enablestate':'2'
                        };
                        /*me.props.form.setFormItemsValue(me.config.formId,{
                            'pk_org':me.config.type == 'glb' ? {value:me.state.curOrg.refpk,display:me.state.json['10140BANK-000027']} : {value:me.state.businessOrg.refpk || me.state.curOrg.refpk,display:me.state.businessOrg.refname || me.state.curOrg.refname},/!* 国际化处理： 全局*!/
                            'pk_bankdoc':{value:''},
                            'pk_banktype': {value:bankNode.id,display:bankNode.refname},
                            'pk_fatherbank':{value:currNode.refpk,display:currNode.refname},
                            'pk_country':{value:'0001Z010000000079UJJ',display:me.state.json['10140BANK-000028']},/!* 国际化处理： 中国*!/
                            'enablestate':{value:'2'}
                        });*/
                    }
                    me.props.form.setFormStatus(me.config.formId,'add');
                    me.loadNodeData('',()=>{
                        me.props.form.setFormItemsDisabled(me.config.formId,{'enablestate':true});
                        me.buttonStatus(me.props,'add');
                        me.props.syncTree.setNodeDisable(me.config.treeId,true);

                        if(callBack && typeof callBack == 'function') {
                            callBack()
                        }
                    },addUserJson);
                }
            });

        }else if(type == 'edit'){
            //me.props.cardTable.setStatus(tableId,'edit');
            me.props.cardTable.setStatus(tableId,'browse');
            me.getSysParam(()=>{
                //let canOpr = me.isAccessOfCurrNode();
                me.isAccessOfCurrNode(null,(canOpr)=>{
                    if(!canOpr){
                        return;
                    }
                    me.loadNodeData(me.props.form.getFormItemsValue(me.config.formId,'pk_bankdoc').value,()=>{
                        me.props.form.setFormStatus(me.config.formId,'edit');
                        me.props.form.setFormItemsDisabled(me.config.formId,{'enablestate':true});
                        me.buttonStatus(me.props,'edit');
                        me.props.syncTree.setNodeDisable(me.config.treeId,true);
                    });
                });
            });
        }else if(type == 'cancel'){
            promptBox ({
                color:'warning',
                noFooter:false,
                userControl:true,
                title:me.state.json['10140BANK-000019'],/* 国际化处理： 确认取消*/
                content:me.state.json['10140BANK-000020'],/* 国际化处理： 是否确认取消?*/
                beSureBtnClick:()=>{
                    me.buttonStatus(me.props,'cancel');
                    me.loadNodeData((me.BankTypeTree.getSelectedTreeNode()).refpk,()=>{
                        me.props.cardTable.setStatus(tableId,'browse');
                        me.props.form.cancel(me.config.formId);
                        me.props.cardTable.resetTableData(tableId);
                        me.props.syncTree.setNodeDisable(me.config.treeId,false);
                        BillCode.setType('cancel');
                        BillCode.getBillCode();
                        me.isAccessOfCurrNode('before');
                    });
                },
                cancelBtnClick:()=>{
                    me.props.modal.close(`modal`);
                }
            });

        }else if(type == 'copy'){
            if(this.config.type == 'org'){
                if(this.state.businessOrg.refpk != undefined){
                    me.props.form.setFormItemsValue(me.config.formId,{
                        'pk_org':{value:this.state.businessOrg.refpk,display:this.state.businessOrg.refname}
                    });
                }else{
                    toast({ color: 'warning', content: this.state.json['10140BANK-000045']});
                    return;
                }
            }else{
                me.props.form.setFormItemsValue(me.config.formId,{
                    'pk_org':{display: this.state.curOrg.refname, value: this.state.curOrg.refpk}
                });
            }

            me.props.form.setFormStatus(me.config.formId,'edit');
            me.props.cardTable.setStatus(tableId,'edit');
            me.props.form.setFormItemsValue(me.config.formId,{
                'pk_bankdoc':{value:''}
            });

            me.props.meta.getMeta()[me.config.formId].items.forEach((item)=>{
                if(item.attrcode=='pk_fatherbank'){
                    item.queryCondition={
                        pk_banktype:me.props.form.getFormItemsValue(me.config.formId,'pk_banktype').value
                    }
                }
                if(item.attrcode == 'pk_combine'){
                    item.queryCondition={
                        flag:'pk_combine',
                        GridRefActionExt:'nccloud.web.uapbd.bankacc.action.BankdocListFilterOrg',
                        pk_banktype:me.props.form.getFormItemsValue(me.config.formId,'pk_banktype').value
                    }
                }
            });
            let tableData = me.props.cardTable.getAllData(tableId);
            tableData.rows.forEach(item=>{
                item.values.pk_bankdoc.value = null;
                if(item.values.ts)
                    item.values.ts.value = null;
                item.values.pk_banklinkman.value = null;
                item.status = '2';
            });
            me.props.cardTable.updateTableData(tableId,tableData);
            me.buttonStatus(me.props,'edit');
            me.props.syncTree.setNodeDisable(me.config.treeId,true);
        }

    }

    /**
     * 保存、保存新增、修改
     */
    saveAction(type,callback){
        //加个判定，校验一下信息，主要是为了UE要求，能够走平台的方式将没有填写的必输项标红
		if(!this.props.form.isCheckNow(this.config.formId)) {
			return
		}
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息;
        this.props.cardTable.getAllRows(this.config);
        let pk;
        if(formData.rows[0].values.hasOwnProperty('pk_bankdoc')){
            pk = formData.rows[0].values.pk_bankdoc.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
            formData.areacode = this.config.formId;//添加表单的areacode编码
        }
        this.props.cardTable .filterEmptyRows(this.config.tableId,[]);
        let cardData = this.props.createMasterChildData(this.config.pageCode,this.config.formId,this.config.tableId);
        let enablestate = cardData.head.bankdoc.rows[0].values.enablestate.value;
        cardData.head.bankdoc.rows[0].values.enablestate = {value:enablestate? "2" : "3"};
        //手动处理银行类型未获取到情况。具体原因不明
        let banktype = cardData.head.bankdoc.rows[0].values.pk_banktype.value;
        if(!banktype)
            cardData.head.bankdoc.rows[0].values.pk_banktype = pk_banktype;
        /***设置请求参数***/
        formData.rows['status'] = '2';//设置状态
        let requestParam = {
            model: cardData,
            pageid: this.config.pageCode
        };
        /**判断刷新父节点，还是刷新选中节点
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         **/
        let isAdd = false;//false时新增 即刷新当前节点 true为编辑 即刷新父节点
        if(pk == null || pk ==''){
            isAdd = true;
        }
        let businessLogic = ()=>{
            ajax({
                url: urls['saveUrl'],
                data: cardData,
                //async:false,
                success: (result) => {
                    let {data} = result;
                    if(result.success){
                        //设置表单浏览态
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        if(isAdd){
                            //新增回调后添加
                            this.props.form.setFormItemsValue(this.config.formId,{
                                'ts':{value:data.form.ts},
                                'pk_bankdoc':{value:data.form.pk_bankdoc}
                            });
                            this.props.syncTree.addNodeSuccess(this.config.treeId,data.treeNode);
                        }else{
                            //修改回调后修改
                            this.props.form.setFormItemsValue(this.config.formId,{
                                'ts':{value:data.form.ts}
                            });
                            //this.props.syncTree.editNodeSuccess(this.config.treeId,data.treeNode[0]);
                        }
                        //展开树节点
                        this.props.syncTree.openNodeByPk(this.config.treeId, data.treeNode[0].pid);

                        this.props.syncTree.setNodeSelected(this.config.treeId, data.treeNode[0].refpk);
                        //设置选中节点
                        /*this.state.curSelectedNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, data.treeNode[0].refpk);
                        this.setState(this.state,()=>{*/
                        //保存新增
                        if(type == 'saveandadd'){
                            this.props.cardTable.setStatus(tableId,'edit');
                            this.props.form.EmptyAllFormValue(this.config.formId);
                            this.showRightForm('add');
                            this.props.form.setFormStatus(this.config.formId, 'edit');
                            this.buttonStatus(this.props,'edit');
                            this.props.button.setDisabled({'BatchDel':true});
                            this.props.syncTree.setNodeDisable(this.config.treeId,true);
                            toast({title : this.state.json['10140BANK-000018'],color : 'success'});/* 国际化处理： 保存成功！*/
                            callback && callback();
                        }else{
                            this.props.cardTable.setStatus(tableId,'browse');
                            this.buttonStatus(this.props,'save');
                            this.props.syncTree.setNodeDisable(this.config.treeId,false);
                            //重新加载数据
                            this.loadNodeData(data.form.pk_bankdoc,()=>{
                                toast({title : this.state.json['10140BANK-000018'],color : 'success'});/* 国际化处理： 保存成功！*/
                                callback && callback();
                            });
                        }

                        // });

                    }
                }
            });
        }
        this.props.validateToSave(cardData,businessLogic,{[this.config.formId]:'form',[tableId]:'cardTable'},'card');

    }
    show=(id,val)=>{
        let dom = document.getElementById(id);
        if(dom)
            dom.style.display=val || 'block';
    }
    hide=(id)=>{
        let dom = document.getElementById(id);
        if(dom)
            dom.style.display='none';
    }
    disableBatchDel(flag){
        //UE要求删除后或无选中记录置灰
        this.props.button.setDisabled({'BatchDel':flag});
    }
    /**
     * 按钮点击事件
     * @param id
     */
    onButtonClick(props,id) {
        var me = this;
        let BillCode = new BillCodeUtil(
            me.config.type,
            'bankdoc','add',
            me.props,me.config.formId,
            'code','nc.vo.bd.bankdoc.BankdocVO');
        switch (id.toLowerCase()) {
            case 'add':
                me.disableElems(true,()=>{
                    me.showRightForm('add', null ,() => {
                        // 部分时候获取单据编码的调用会先返回，导致先设置单据编码，然后重新设置界面数据冲掉了单据编码
                        BillCode.setType('add');
                        BillCode.getBillCode();
                    });
                });
                break;
            case 'edit':
                me.dataPermission('edit',()=>{
                    me.disableElems(true,()=>{
                        me.showRightForm('edit');
                        BillCode.setType('edit');
                        BillCode.getBillCode();
                    });
                });
                break;
            case 'cancel':
                me.disableElems(false,()=> {
                    me.showRightForm('cancel', BillCode);
                });
                break;
            case 'copy':
                if(me.config.type == 'org' && me.state.businessOrg.refpk == undefined){
                    toast({ color: 'warning', content: this.state.json['10140BANK-000045']});
                    return;
                }
                me.disableElems(true,()=>{
                    me.showRightForm('copy');
                    BillCode.setType('add');
                    BillCode.getBillCode();
                });
                break;
            case 'save':
                me.disableElems(false,()=> {
                    let data = me.props.form.getAllFormValue(this.config.formId);
                    BillCode.setType('edit');
                    BillCode.getBillCode(data,()=>{
                        me.saveAction('save');
                    });
                });
                break;
            case 'saveandadd':
                let formdata = me.props.form.getAllFormValue(me.config.formId);
                let code = me.props.form.getFormItemsValue(me.config.formId,'code').value;
                if(!code){
                    BillCode.setType('add');
                    BillCode.getBillCode(formdata,()=>{
                        me.saveAction('saveandadd',()=>{
                            BillCode.setType('add');
                            BillCode.getBillCode();
                        });
                    });
                }else{
                    BillCode.setType('edit');
                    me.saveAction('saveandadd',()=>{
                        BillCode.setType('add');
                        BillCode.getBillCode();
                    });
                }
                break;
            case "delete":
                me.isAccessOfCurrNode(null,(canOpr)=>{
                    if(!canOpr){
                        //Message.create({content: me.config.accessMessage, color: 'warning'});
                        return;
                    }
                    me.dataPermission('delete',()=>{
                        let selectedNode = this.props.syncTree.getSelectNode(me.config.treeId)
                        me.clickDelIconEve(selectedNode || me.BankTypeTree.getSelectedTreeNode(),'delButton',BillCode);
                    });
                });

                break;
            case "refresh":
                this.BankTypeTree.loadTreeData('refresh');
                props.form.EmptyAllFormValue(this.config.formId);
                break;
            case "addline":
                let allRows = props.cardTable.getNumberOfRows(tableId);
                currRow = allRows + 1;
                //props.cardTable.addRow(tableId);
                //props.button.setDisabled({'BatchDel':false});
                props.cardTable.openModel(tableId,'add');
                break;
            case 'batchdel'://批量删除
                let checkedRows = props.cardTable.getCheckedRows(tableId);
                if(checkedRows.length == 0){
                    toast({content: me.state.json['10140BANK-000029'], color: 'warning'});/* 国际化处理： 请选中需要删除的记录*/
                    return;
                }
                let indexs = checkedRows.map((item,index)=>{
                    return item.index;
                });
                props.cardTable.delRowsByIndex(tableId,indexs,()=>{
                    me.disableBatchDel(true);
                });
                break;
            case "query":
                /*props.linkTo("/uapbd/bankacc/banktype/grid/index.html",{
                    type:this.config.type,
                    pk_org:this.state.curOrg.refpk
                });*/
                me.show('list');
                me.hide('card');
                me.hide('check');
                me.props.setPageCode({'p':'10140BANK_bankdoc_querylist'});
                let data={};
                if(me.config.type == 'glb')
                    data = {value:'GLOBLE00000000000000',display:me.state.json['10140BANK-000027']};/* 国际化处理： 全局*/
                else
                    data = {value:me.state.curOrg.refpk,display:me.state.curOrg.refname};
                me.BankDocGrid.search.setSearchValByField(this.config.searchId,'pk_org', data);
                break;
            case "synchronise":
                //let isAccess = this.isAccessOfCurrNode();
                me.isAccessOfCurrNode(null,(isAccess)=>{
                    if(!isAccess){
                        //Message.create({content: me.config.accessMessage, color: 'warning'});
                        return;
                    }
                    let formData = me.props.form.getAllFormValue(me.config.formId);//获得表单信息;
                    let enablestate = formData.rows[0].values.enablestate.value;
                    formData.rows[0].values.enablestate = {value:enablestate? "2" : "3"};
                    let requestParam = {
                        model: formData,
                        pageid: me.config.pageCode
                    }
                    ajax({
                        url: urls['synclinenum'],
                        data: requestParam,
                        success: (res) => {
                            let {success,data} = res;
                            if (success) {
                                if(data){
                                    me.props.form.setFormItemsValue(me.config.formId,{
                                        'pcombinenum':{value:data.pcombinenum},
                                        'pcombinename':{value:data.pcombinename},
                                        'pk_combine':{value:data.pk_combine,display:data.pcombinenum},
                                        'province':{value:data.province},
                                        'city':{value:data.city},
                                        'ts':{value:data.ts}
                                    });
                                }
                                toast({title : me.state.json['10140BANK-000030'],color : 'success'});/* 国际化处理： 同步成功！*/
                                me.props.button.setDisabled({'Synchronise':true});
                            }
                        }
                    })
                });
                break;
            case 'printmenu'://打印
                this.printPage.call('print');
                break;
            case 'output'://输出
                let currNode = me.BankTypeTree.getSelectedTreeNode();
                let config = {
                    funcode:'10140BANK',//功能节点编码
                    nodekey:'bankdoccard',//模板节点表示
                    billtype:'',//单据类型
                    oids:[currNode.refpk],
                    outputType:'output',
                    userjson:`{type:${currNode.pid == '~' ? 'banktype' : 'bankdoc'}}`
                }
                me.setState({
                    data:config
                },()=>{me.refs.printOutput.open()});
                //this.printPage.call('output');
                break;
            case 'export':
                this.setState({
                    selectedPKS:''
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break
        }
    }
    printPage(flag){
        var me = this;
        let funcnode;

        switch(me.config.type){
            case 'glb':
                funcnode = '10140BANK';
                break;
            case 'grp':
                funcnode = '10140BANK';
                break;
            case 'org':
                funcnode = '10140BANK';
                break;
        }
        let currNode = me.BankTypeTree.getSelectedTreeNode();
        let type;
        if(currNode.pid == '~')
            type = 'banktype';
        else
            type = 'bankdoc';
        if(flag){
            print(
                'pdf',//支持两种类型打印，‘html’模板打印  pdf--pdf打印
                urls['print'],
                {
                    funcode:funcnode,//功能节点编码
                    appcode:funcnode,
                    nodekey:'bankdoccard',//模板节点表示
                    billtype:'',//单据类型
                    oids:[currNode.refpk],
                    outputType:'output',
                    userjson:`{type:${type}}`
                }
            );
        }else{
            print(
                'pdf',//支持两种类型打印，‘html’模板打印  pdf--pdf打印
                urls['print'],
                {
                    funcode:funcnode,//功能节点编码
                    appcode:funcnode,
                    nodekey:'bankdoccard',//模板节点表示
                    billtype:'',//单据类型
                    oids:[currNode.refpk],
                    userjson:`{type:${type}}`
                }
            );
        }
    }
    /**
     * 点击树节点控制按钮状态
     * @param props
     * @param node
     */
    disableButton(node){
        //页面初始化或选中的是根节点
        if(!node || node.refpk == '~'){
            this.props.button.setDisabled({
                'Edit':true,
                'Add':true,
                'Copy':true,
                'Delete':true,
                'PrintMenu':true,
                'output':true,
                'Refresh':false,
                'Query':false,
                //'AddLine':true,
                'DelLine':true,
                'EditLine':true,
                'PasteLine':true,
                'Synchronise':true
            });
        }else if(node.pid == '~'){
            this.props.button.setDisabled({
                'Edit':true,
                'Add':!node.nodeData.isAddEnable,
                'Copy':true,
                'Delete':true,
                'PrintMenu':false,
                'output':false,
                'Refresh':false,
                'Query':false,
                //'AddLine':true,
                'DelLine':true,
                'EditLine':true,
                'PasteLine':true,
                'Synchronise':true
            });
            this.props.cardTable.setTableData(this.config.tableId,{rows:[]});
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
        }else{
            let status = this.props.form.getFormStatus(this.config.formId);
            if(status == 'add' || status == 'edit'){
                this.props.button.setDisabled({
                    'Edit':false,
                    'Add':false,
                    'Copy':false,
                    'Delete':false,
                    'PrintMenu':false,
                    'output':false,
                    'Refresh':false,
                    'Query':false,
                    //'AddLine':false,
                    'DelLine':false,
                    'EditLine':false,
                    'PasteLine':false,
                    'Synchronise':true
                });
            }else{
                this.props.button.setDisabled({
                    'Edit':!node.nodeData.isAddEnable,
                    'Add':!node.nodeData.isAddEnable,
                    'Copy':!node.nodeData.isAddEnable,
                    'Delete':!node.nodeData.isAddEnable,
                    'PrintMenu':false,
                    'output':false,
                    'Refresh':false,
                    'Query':false,
                    //'AddLine':true,
                    'DelLine':true,
                    'EditLine':true,
                    'PasteLine':true,
                    'Synchronise':!node.nodeData.isSynchronize
                });
            }
            this.props.cardTable.setColEditableByKey(tableId,'opr',false);
        }
    }
    /**
     * checkbox 选中事件
     */
    onCheckBoxClick(){
        //this.setState({stopFlag:!this.state.stopFlag});
    }
    /**
     * 启用停用change 事件
     */
    onCheckBoxChange(flag){
        switch (flag){
            case 'cust'://客商银行
                this.state.showCust = !this.state.showCust;
                break;
            case 'other'://其他组织银行
                this.state.showOthers = !this.state.showOthers;
                break;
            default:
                this.state.stopFlag = !this.state.stopFlag;
                break;
        }
        this.setState(this.state,()=>{
            this.BankTypeTree.loadTreeData('','',this.state.stopFlag,this.state.showCust,this.state.showOthers);
        });
    }
    /**
     * 侧拉框编辑后事件，用来手动处理linkManRecord，解决无法获取侧拉框form值
     * 表单item编辑后事件 暂时先手动将model中form值拼接，后续待平台提供接口后可修改为平台调用
     */
    onTableModelAfterEdit(props,moduleId,key,value,changedRows,index,record){
        //this.props.modal.show('type');
        linkManRecord.rows[0].values[key] = {display:value,value:value};
        lineIndex = index;
        if(key == 'name'){
            props.cardTable.setValByKeyAndIndex(tableId,index,'linkman',{value:value,display:value});
            console.log(props.cardTable.getAllData(tableId))
        }
    }

    /**
     * 侧拉框整单保存
     * @param props
     */
    modelSave = (props)=>{
        props.cardTable.closeModel(tableId);
        this.saveLinkMan(props);
    }
    /**
     * 侧拉框关闭事件
     * @param props
     */
    closeModel = (props)=>{
        props.cardTable.closeModel(tableId);
        props.cardTable.setStatus(tableId,'browse');
        let record = props.cardTable.getModalDataByIndex(tableId,lineIndex);
        if(Object.keys(record).length > 0 && record.hasOwnProperty("name") && record.name.value){
            linkManRecord.rows[0] = {
                status : '1',
                rowid : '0',
                values : record
            };
            this.saveLinkMan(props);
        }
    }
    /**
     * 保存联系人
     */
    saveLinkMan = (props) =>{
        let requestParam = {
            model: linkManRecord,
            pageid: this.config.pageCode
        };
        ajax({
            url: urls['savelinkman'],
            data: requestParam,
            success: (res) => {
                let record = {};
                if (res.success) {
                    if(res.data){
                        //设置列表linkmans值
                        props.cardTable.setValByKeyAndIndex(tableId,lineIndex,'linkman',{value:res.data.pk_linkman,display:res.data.name ? res.data.name : linkManRecord.rows[0].name.value});
                        // props.cardTable.setStatus(tableId,'edit');
                        props.cardTable.setStatus(tableId,'browse');
                        this.initLinkManRecord();
                    }
                    //toast({content : "保存成功",color : 'success'});
                }
            }
        })
    }
    /**
     * 切换组织事件
     * @param value
     */
    onOrgChange(value){ //选择行政组织钩子
        if(value && value.hasOwnProperty('refpk')){
            this.state.businessOrg = value;
            this.setState(this.state,()=>{
                this.BankTypeTree.setPkOrg(value.refpk);
            });
            //this.loadTreeData();
            //this.setTreeStatus();
        }
    }
    onAfterFormEvent(props, moduleId, key, value, oldvalue,val){
        var me = this;
        switch(key){
            case "enablestate":
                me.isAccessOfCurrNode(null,(canOpr)=>{
                    if(!canOpr){
                        //props.form.cancel(moduleId);
                        props.form.setFormItemsValue(moduleId,{
                            enablestate:{value:!value.value,display:null}
                        });
                        return;
                    }
                    me.dataPermission(value.value ? 'enable' : 'disable',(res)=>{
                        if(!res){
                            props.form.setFormItemsValue(moduleId,{
                                enablestate:{value:!value.value,display:null}
                            });
                            return;
                        }
                        let pk_bankdoc = props.form.getFormItemsValue(moduleId,"pk_bankdoc");
                        if(!pk_bankdoc)
                            return;
                        let requestParam = {
                            pk_bankdoc:pk_bankdoc.value,
                            enablestate:value.value?'2':'3'
                        };

                        promptBox ({
                            color:"warning",
                            title:me.state.json['10140BANK-000031'],/* 国际化处理： 提示*/
                            content:value.value?me.state.json['10140BANK-000032']:me.state.json['10140BANK-000033'],/* 国际化处理： 确认启用该数据？,您确定要停用所选数据及其所有下级数据吗？*/
                            beSureBtnClick:()=>{
                                ajax({
                                    url:urls["enablestateUrl"],
                                    data:requestParam,
                                    success:(result)=>{
                                        toast({title:value.value?me.state.json['10140BANK-000034']:me.state.json['10140BANK-000035'],color:"success"});/* 国际化处理： 启用成功！,停用成功！*/
                                        props.form.setFormStatus(moduleId, 'browse');
                                        props.syncTree.setNodeDisable(this.config.treeId,false);
                                        me.buttonStatus(props,'cancel');
                                    },
                                    error: function(res){
                                        props.form.cancel(moduleId);
                                        //props.form.setFormItemsValue(moduleId,{enablestate:{value:value.value?'3':'2'}});
                                        toast({ color: 'danger', content: res.message });
                                    }
                                });
                            },
                            cancelBtnClick:()=>{
                                // props.form.cancel(moduleId);
                                props.form.setFormItemsValue(moduleId,{
                                    enablestate:{value:!value.value, display:null}
                                });
                                return;
                            }
                        });
                    },null,true);
                });
                break;
            case "pk_combine":
                if(val.refpk && val.refname && val.refcode){
                    props.form.setFormItemsDisabled(me.config.formId,{'pcombinename':true});
                }else{
                    props.form.setFormItemsDisabled(me.config.formId,{'pcombinename':false});
                }
                if(val.refpk && val.refname && val.refcode){
                    props.form.setFormItemsValue(me.config.formId,{
                        pcombinename:{value:val.refname},
                        pcombinenum:{value:val.refcode}
                    });
                }
                //参数设置为不集中管理
                else if(me.state.sysParam.value == 'N'){
                    //me.savePsnAcc(value,'add');
                    if(value.value)
                        props.form.setFormItemsValue(me.config.formId,{
                            pk_combine:{value:'a',display:value.display},
                            pcombinenum:{value:value.display}
                        });
                }
                if(!value.value)
                    props.form.setFormItemsValue(me.config.formId,{
                        'pcombinenum':{value:''},
                        'pcombinename':{value:''},
                        'province':{value:''},
                        'city':{value:''}
                    });
                val.refpk && val.refname && val.refcode && ajax({
                    url: urls.queryCardUrl,
                    data: {
                        operation: "asslinenum",
                        pk: value.value
                    },
                    success: resp => {
                        if(resp.data) {
                            props.form.setFormItemsValue(me.config.formId,{
                                'province':{value:resp.data.province, display: resp.data.province},
                                'city':{value:resp.data.city, display: resp.data.city}
                            });
                        }
                    }
                })
                break;
            case "pk_country":
                if(val.values && val.values.iseucountry && val.values.iseucountry.value == 'Y'){
                    props.form.setFormItemsValue(me.config.formId,{
                        isiban:{value:true,display:me.state.json['10140BANK-000036']}/* 国际化处理： 是*/
                    });
                }else{
                    props.form.setFormItemsValue(me.config.formId,{
                        isiban:{value:false,display:me.state.json['10140BANK-000037']}/* 国际化处理： 否*/
                    });
                }
                break;
            default:
                break;
        }

    }
    /**
     *获取联系人列表肩部信息
     */
    getTableHead = () => {
        let {button} = this.props;
        let { createButtonApp } = button;
        return (
            <div className="shoulder-definition-area">
                <div className="btn-group" style={{paddingTop:5}}>
                    {createButtonApp({
                        area: 'linkmans',
                        buttonLimit: 3,
                        onButtonClick: this.onButtonClick.bind(this)
                    })}
                </div>
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>
            </div>
        )
    }

    /**
     * 返回卡片页面
     */
    returnCardPage(){
        let me = this;
        me.show('card');
        me.hide('list');
        me.show('check','inline');
        me.props.setPageCode({'p':me.config.pageCode});
    }

    /**
     * checkbox改变
     * @param props
     * @param moudleId
     * @param values
     * @param length
     */
    selectedChange(props,moudleId,values,length){
        let checkedRows = props.cardTable.getCheckedRows(moudleId);
        if(!checkedRows || (checkedRows && checkedRows.length == 0))
            this.disableBatchDel(true);
        else
            this.disableBatchDel(false);
    }

    render(){
        if(!this.state.curOrg || !this.state.curOrg.refpk)
            return '';
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const {form,button,modal,DragWidthCom,search,cardTable,BillHeadInfo} = this.props;
        const {createForm} = form;//创建表单，需要引入这个
        const {createCardTable } = cardTable;
        let { createModal } = modal;  //模态框
        let { createButtonApp } = button;
        const {createBillHeadInfo} = BillHeadInfo;

        let treeConfig = {
            //treeRootTitle:this.config.treeRootTitle,//根节点名称
            treeId:this.config.treeId,//树组件ID
            showLine:this.config.showLine, //显示连接线
            disabledSearch:this.state.disabledSearch,
            needSearch:this.config.needSearch || true,
            needEdit:this.config.needEdit || true,
            showModal:this.config.showModal || false,
            metaId:this.config.metaId,    //弹出框中内容，树模板id（需要弹出编辑框才使用）
            searchType:this.config.searchType || 'location',   // 搜索框查询方式，定位/过滤  location/filtration，默认定位
            clickAddIconEve:this.clickAddIconEve.bind(this),
            clickDelIconEve:this.clickDelIconEve.bind(this),
            clickEditIconEve:this.clickEditIconEve.bind(this),
            type:this.config.type,
            disableButton:this.disableButton.bind(this),
            pk_org:this.state.curOrg ? this.state.curOrg.refpk : '',
            stopFlag:this.state.stopFlag,               //是否停用
            showCust:this.state.showCust, //是否显示客商
            showOthers:this.state.showOthers,//是否显示其他组织银行
            urls:urls,
            json:this.state.json,//多语
            loadNodeData:this.loadNodeData.bind(this)   //展开节点，加载叶子
        }
        let formConfig = {
            pk_banktype:'',
            pk_org:this.state.curOrg ? this.state.curOrg.refpk : '',
            pageCode:'10140BANK_banktype',
            formId:this.config.modalFormId
        };
        let listConfig = {
            title:this.state.json['10140BANK-000000'],//国际多语 银行档案
            type:this.config.type,
            pk_org:this.state.curOrg ? this.state.curOrg.refpk : '',
            json:this.state.json,//多语
            inlt:this.state.inlt,//获取占位符多语
            returnCardPage:this.returnCardPage.bind(this)
        };

        let funcnode = null;

        switch(this.config.type){
            case 'glb':
                funcnode = '10140BANK';
                break;
            case 'grp':
                funcnode = '10140BANKG';
                break;
            case 'org':
                funcnode = '10140BANKO';
                break;
        }

        let billType = 'bankdocinfo_' + this.props.config.type

        return (
            <div>
                <div id={'card'} style={{height:'100%'}} className="nc-bill-tree-card">
                    <NCDiv areaCode={NCDiv.config.HEADER} className="header" >
                        {createModal('delNode',{
                            noFooter:false,
                            userControl:true,
                            title: this.state.json && this.state.json['10140BANK-000023'],/* 国际化处理： 确认删除*/
                            content: this.state.json && this.state.json['10140BANK-000024']/* 国际化处理： 您确定要删除选中的数据吗？*/
                        })}
                        {/*模态窗口必须在render里进行创建，否则弹出后若content是form，会导致无法输入*/}
                        {createModal('type',{
                            noFooter:false,
                            userControl:true,
                            //content:this.props.form.createForm(this.config.modalFormId,{}),
                            content:<BankTypeForm config={formConfig} ref={(BankTypeForm)=>this.BankTypeForm = BankTypeForm}/>,
                            title:this.state.json && this.state.json['10140BANK-000013'],/* 国际化处理： 银行类别维护界面*/
                            beSureBtnClick:this.onSaveBankType.bind(this)
                        })}
                        {createModal('modal',{noFooter:false})}
                        {/*{createPageIcon()}*/}
                        {/* 标题 title*/}
                        {
                            this.config.type !== 'org' &&
                            <div className='header-title-search-area'>{createBillHeadInfo({title :this.state.title,initShowBackBtn:false})}</div>
                        }
                        {/*<div className="title" fieldid={this.state.title+"_title"}>
                            {this.config.type !== 'org' && <div>{this.state.title}</div>}
                        </div>*/}
                        {/*头部组织选择，根据是否是业务单元节点来渲染*/}
                        {this.config.type == 'org' && this.state.context &&
                        <div className="search-box" style={this.config.type == 'org' ?{marginLeft:0}:{}}>
                            <div style={{position: 'relative', height: "100%"}}>
                                <span style={{position: "absolute",left: "2%",top: "35%","z-index": "10",color: "red",font: "inherit"}}>*</span>
                                {BusinessUnitTreeRef({
                                    onChange:this.onOrgChange.bind(this),
                                    fieldid:'businessunittreeref',
                                    disabled:this.state.disabled,
                                    value:{refpk:this.state.businessOrg.refpk || this.state.context.pk_org,refname:this.state.businessOrg.refname || this.state.context.org_Name},
                                    queryCondition: function(){
                                        return {
                                            'AppCode':'10140BANKO',
                                            TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                                        }
                                    }
                                })}
                            </div>
                        </div>
                        }
                        <span className="title-search-detail">
                                <NCCheckbox
                                    defaultChecked={false}
                                    disabled={this.state.disabled}
                                    checked={this.state.stopFlag}
                                    onChange={this.onCheckBoxChange.bind(this)}
                                    onClick={this.onCheckBoxClick.bind(this)}
                                    size="lg"

                                >
                                    {this.state.json && this.state.json['10140BANK-000012']/* 国际化处理： 显示停用*/}
                                </NCCheckbox>
                            <div id={'check'} style={{'display':'inline'}}>
                                <NCCheckbox
                                    defaultChecked={false}
                                    disabled={this.state.disabled}
                                    checked={this.state.showCust}
                                    onChange={this.onCheckBoxChange.bind(this,'cust')}
                                    size="lg"
                                >
                                    {this.state.json && this.state.json['10140BANK-000041']/* 国际化处理： 显示客商银行*/}
                                    </NCCheckbox>
                                <NCCheckbox
                                    defaultChecked={false}
                                    disabled={this.state.disabled}
                                    checked={this.state.showOthers}
                                    onChange={this.onCheckBoxChange.bind(this,'other')}
                                    size="lg"
                                >
                                    {this.state.json && this.state.json['10140BANK-000042']/* 国际化处理： 显示其他组织创建的银行*/}
                                    </NCCheckbox>
                            </div>
                        </span>
                        {/* 按钮组 btn-group*/}
                        <div className=" btn-group">
                            {createButtonApp({
                                area: 'bankdoc',
                                buttonLimit: 3,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector(' btn-group')
                            })}

                        </div>

                    </NCDiv>
                    {/* 树卡区域 */}
                    <div className="tree-card">
                        <DragWidthCom
                            // 左树区域
                            leftDom = {this.state.curOrg && this.state.curOrg.refpk  && <BankTypeTree fieldid="bankTypeTree_ref-window" treeConfig={treeConfig} syncTree={this.props.syncTree} ref={(BankTypeTree) => this.BankTypeTree = BankTypeTree }/>}
                            // 右卡片区域
                            rightDom = {
                                <div>
                                    <div className="card-area">{createForm(this.config.formId, {
                                        title:this.state.json && this.state.json['10140BANK-000038'],/* 国际化处理： 基本信息*/
                                        cancelPSwitch:true,//取消自带开关提示
                                        onAfterEvent:this.onAfterFormEvent.bind(this)
                                    })}</div>
                                    <div className="nc-bill-table-area account_org_table_liu" style={{padding:0}}>
                                        {createCardTable(this.config.tableId, {
                                            //onCloseModel:this.onCloseModel.bind(this),//关闭侧拉框
                                            isAddRow: false,//避免展开后输入联系人后未保存，直接翻页新增一行导致前面的联系人未保存
                                            showCheck:true,
                                            selectedChange:this.selectedChange.bind(this),
                                            onAfterEvent:this.onTableModelAfterEdit.bind(this),//编辑后事件
                                            modelSave: this.modelSave.bind(this),//关闭编辑侧拉框事件
                                            showIndex:true,
                                            tableHead:this.getTableHead.bind(this),
                                            hideAdd:true,
                                            hideModelSave:true,
                                            modelClose:this.closeModel.bind(this)//关闭侧拉框事件
                                        })}
                                    </div>
                                </div>
                            }
                            // 默认左侧区域宽度，px/百分百
                            defLeftWid = '20%'
                            leftMinWid='280px'
                        />
                    </div>
                    <PrintOutput
                        ref='printOutput'
                        url= {urls['print']}
                        data={this.state.data}
                        //callback={this.onSubmit}
                    >
                    </PrintOutput>
                </div>
                <div id={'list'} style={{'display':'none'}}>
                    {this.state.curOrg &&
                    <BankDocGrid fieldid="bankDocGrid_ref-window" config={listConfig} ref={(BankDocGrid)=>{this.BankDocGrid = BankDocGrid}}/>}
                </div>
                <ExcelImport
                    {...this.props}
                    moduleName = "uapbd"//模块名
                    pagecode= {this.props.config.pageCode}
                    appcode={funcnode}
                    selectedPKS = {[]}
                    billType = {billType}//单据类型
                />
            </div>
        )
    }
}
/**
 * 创建页面
 */
export default BankPageView = createPage({
    //initTemplate:initTemplate
    billinfo:{
        billtype: 'card',
        pagecode: pageCode,
        headcode: 'bankdoc',
        bodycode: 'linkmans'
    }
})(BankPageView);

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65