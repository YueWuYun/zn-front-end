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
            treeRootTitle:'',/* ?????????????????? ????????????*/
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
            stopFlag: false,//?????? ??????????????????????????????
            showCust:false,//????????????
            showOthers:false,//??????????????????
            curSelectedNode: null, //???????????????????????????????????? ????????????selectedNode
            curOrg:this.config.pk_group,//????????????
            businessOrg:'',//????????????
            oldParent:'',//????????????
            data:'',//????????????
            isAdd:false,//????????????  ??????false
            mode:'',//????????????
            sysParam:{},//??????????????????
            disabled:false,//????????????????????????
            disabledSearch:false,//??????????????????
            json:{},
            inlt:{},
            selectedPKS: {}
        };
        let callback = (json,status,inlt)=> {
            this.state.json = json;//????????????
            this.state.inlt = inlt;//?????????????????????
            /* ?????????????????? ??????-??????,??????-??????,??????-????????????*/
            this.config.title = this.props.config.type == 'glb' ? this.state.json['10140BANK-000001'] : this.props.config.type == 'grp' ? this.state.json['10140BANK-000002'] : this.state.json['10140BANK-000004'];
            this.state.title = this.props.config.type == 'glb' ? this.state.json['10140BANK-000001'] : this.props.config.type == 'grp' ? this.state.json['10140BANK-000002'] : this.state.json['10140BANK-000004'];
            /* ?????????????????? ????????????*/
            this.config.treeRootTitle = this.state.json['10140BANK-000000'];
            /* ?????????????????? ???????????????????????????????????????????????????,????????????????????????????????????????????????????????????*/
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
        //??????????????????
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
     * ????????????
     */
    initTemplate = (props,callback)=>{
        let me = this;
        props.createUIDom(
            {
                pagecode: props.config.pageCode//??????id
                //appid: props.config.appid//???????????????id
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
                        //props.button.setPopContent({'DelLine':me.state.json['10140BANK-000014']});/* ?????????????????? ??????????????????????????????*/
                        me.buttonStatus(props,'browse');
                        //props.button.setButtonVisible('Synchronise',false);
                    }
                }
                callback && callback(data.context);
            }
        )
    }

    /**
     * ????????????
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
        //????????????????????????
        // props.form.setFormItemsDisabled(me.config.formId,{'pcombinename':false});
        // meta['bankdoc'].items.forEach((item)=>{
        //     if(item.attrcode == 'pcombinename'){
        //         items.disabled = true;
        //     }
        // });
        meta['netbankinfo'].items.forEach((item)=>{
            if(item.attrcode == 'areacode'){
                item['refName'] = me.state.json['10140BANK-000039'];/* ?????????????????? ????????????*/
                item['placeholder'] = me.state.json['10140BANK-000039'];/* ?????????????????? ????????????*/
                item['onlyLeafCanSelect'] = item.onlyLeafCanSelect;//????????????????????????
                item['rootNode'] = { refname: me.state.json['10140BANK-000039'], refpk: 'root' };/* ?????????????????? ????????????*/
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
            label: me.state.json['10140BANK-000040'],/* ?????????????????? ??????*/
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
     * table???????????????
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

            case "DelLine"://?????????
                props.cardTable.delRowsByIndex(tableId, index,()=>{
                    this.disableBatchDel();
                });
                /*let rows = props.cardTable.getAllRows(tableId);
                props.button.setDisabled({'BatchDel':rows == 0  ? true : false});*/
                break;
            case "EditLine"://??????
                props.cardTable.openModel(tableId,'edit',record,index);
                lineIndex = index;
                linkManRecord.rows[0] = record;
                console.log(linkManRecord)
                break;
            case "PasteLine"://??????
                props.cardTable.pasteRow(tableId,  index,["pk_banklinkman","pk_linkman"]);
                //????????????????????????????????????????????????
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
     * ?????????????????????
     * @param props
     * @param status
     */
    buttonStatus(props,status){
        //?????????????????????
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
     * ??????????????????
     */
    initBDselect(){
        var me = this;
        let BDSelected = new BDselect(me.config.classid);
        BDSelected.getModeByClassid(me.config.classid,(modeData)=>{
            if(!modeData){
                toast({title:me.state.json['10140BANK-000015'],color:'warning'});/* ?????????????????? ????????????????????????*/
            }
            me.state.mode = modeData.managemode;
            me.setState(me.state);
        });
    }

    /**
     * ?????????????????????????????????
     */
    beforeAction(){
        var me = this;
        let glbArr = [BDSelected.SCOPE_GLOBE,BDSelected.SCOPE_GLOBE_GROUP,BDSelected.SCOPE_GLOBE_GROUP_ORG,BDselect.SCOPE_GLOBE_ORG];
        let grpArr = [BDSelected.SCOPE_GROUP,BDSelected.SCOPE_GROUP_ORG];
        if(glbArr.includes(me.state.mode)){
            if('glb' != me.config.type){
                toast({title:me.state.json['10140BANK-000016'],color:'warning'});/* ?????????????????? ??????????????????????????????+???????????????+??????+????????? ??????+???????????????????????????????????????????????????*/
                return;
            }
        }
        if(grpArr.includes(me.state.mode)){
            if('grp' != me.config.type){
                toast({title:me.state.json['10140BANK-000017'],color:'warning'});/* ?????????????????? ?????????????????????+????????? ???????????????????????????????????????????????????*/
                return;
            }
        }
    }
    /**
     * ??????????????????????????????
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
    ?????????linkManRecord
     */
    initLinkManRecord(){
        linkManRecord.areaType = 'form';
        linkManRecord.rows = [{values:{}}];
    }

    componentWillMount(){
        //?????????????????????????????????
        //this.getCurrOrg();
        //document.body.style.overflow = 'hidden';
        /* //???????????????????????????
         this.initBDselect();*/
    }
    componentDidMount(){
        //document.getElementsByClassName('dragWidthCom')[0].style.minHeight = '100%';
    }
    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.config.formId);

        if(!formStatus || formStatus === 'browse'){
            window.onbeforeunload = null;
            //??????????????????
            let pk_bankdoc = this.props.form.getFormItemsValue(this.config.formId,'pk_bankdoc');
            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:pk_bankdoc.value ? false : true});
        }else{
            window.onbeforeunload = () => {//??????????????????????????????????????????
                return '';
            };
            let enablestate = this.props.form.getFormItemsValue(this.config.formId,'enablestate');
            //????????????????????????????????????????????????????????????????????????????????????
            this.props.form.setFormItemsValue(this.config.formId,{enablestate:{value:enablestate.value ? '2' : '3'}});
        }
    }
    /**
     * ????????????????????????BD502
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
     * ????????????????????????
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
     * ????????????????????????????????????
     * @param addUserJson ?????????????????????????????????
     */
    loadNodeData(nodeId,callback,addUserJson){
        var me = this;
        //????????????????????????????????????
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
        //???????????????????????????
        if(addUserJson){
            requestParam.userJson = addUserJson;
        }
        //??????????????????????????????
        ajax({
            url:this.config.urls.queryCardUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //????????????
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
                    //????????????
                    me.props.form.EmptyAllFormValue(me.config.formId);
                    //me.props.form.EmptyAllFormValue(me.config.formId2);
                    //????????????????????????????????????
                    if(result.data){
                        let datas = result.data[0];
                        let formId = me.config.formId;
                        datas[formId].rows = Utils.convertGridEnablestate(datas[formId].rows);
                        Utils.filterEmptyData(datas[formId].rows[0].values);
                        me.props.form.setAllFormValue({[formId]:datas[formId]});
                        me.filterRefer(datas[formId].rows[0].values);
                        //???????????????
                        if(result.data[1]){
                            //??????????????????????????????
                            for(let record of result.data[1].linkmans.rows){
                                record.values.linkman.display = record.values.name.value;
                            }
                            me.props.cardTable.setTableData(me.config.tableId,result.data[1].linkmans);
                        }
                    }
                    me.props.form.setFormItemsDisabled(me.config.formId,{enablestate:false});
                    /**
                     * ??????????????????????????????????????????????????????
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
     * ??????????????????
     * @param item
     */
    clickEditIconEve(item){
        this.state.selectedNode = item;
        this.setState(this.state,()=>{
            this.showTypeForm(item,'edit');
        });
    }

    /**
     * ???????????????????????? ????????????
     */
    onSaveBankType(){
        /**************************************************
         *
         * ?????????
         *     1?????????????????????
         *     2???????????????????????????
         *     3???ajax??????????????????????????????????????????????????????????????????
         *     4?????????????????????????????????????????????
         *
         * ??????????????????
         *      ??????????????????????????????????????????????????????????????????????????????????????????
         *
         **************************************************/

        let formData = this.BankTypeForm.form.getAllFormValue(this.config.modalFormId);//??????????????????;
        let pk;
        if(formData.rows[0].values.hasOwnProperty('pk_banktype')){
            pk = formData.rows[0].values.pk_banktype.value;//???????????????pk:update ????????????????????????pk:save ??????????????????
            formData.areacode = this.config.modalFormId;//???????????????areacode??????
        }
        /***??????????????????***/
        formData.rows['status'] = '2';//????????????
        let businessLogic = ()=>{
            let requestParam = {
                model: formData,
                pageid: this.config.pageCode
            };
            /**????????????????????????????????????????????????
             * ?????????????????????????????????????????????
             * ???????????????????????????????????????????????????
             **/
            let isAdd = false;//false????????? ????????????????????? true????????? ??????????????????
            if(pk == null || pk ==''){
                isAdd = true;
            }
            ajax({
                url: urls['saveTypeUrl'],
                data: requestParam,
                success: (result) => {
                    if(result.success){
                        //?????????????????????
                        this.BankTypeForm.form.setFormStatus(this.config.modalFormId, 'browse');
                        //???????????????
                        //this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        if(isAdd){
                            //?????????????????????
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data);
                        }else{
                            //?????????????????????
                            this.props.syncTree.editNodeSuccess(this.config.treeId,result.data[0]);
                        }
                        //???????????????
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data[0].pid);

                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].refpk);
                        //??????????????????
                        /*this.state.curSelectedNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, result.data[0].refpk);
                        this.setState(this.state);*/
                        this.props.modal.close("type");
                        toast({title:this.state.json['10140BANK-000018'],color:'success'});/* ?????????????????? ???????????????*/
                        if(document.getElementsByClassName('u-tree-treenode-selected'))
                            document.getElementsByClassName('u-tree-treenode-selected')[0] && document.getElementsByClassName('u-tree-treenode-selected')[0].scrollIntoView();
                    }
                }
            });
        }
        this.BankTypeForm.validateToSave({model:formData,pageid:this.config.modalFormPagecode},businessLogic,{[this.config.modalFormId]:'form'},'form');
    }

    /**
     * ??????????????????????????????
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
            title:me.state.json['"10140BANK-000013"'],//?????? ????????????????????????
            type:type || 'add',
            formId:me.config.modalFormId
        };
        me.dataPermission(type,()=>{
            me.props.modal.show('type',{
                noFooter:false,
                userControl:true,
                //content:this.props.form.createForm(this.config.modalFormId,{}),
                content:<BankTypeForm config={formConfig} ref={(BankTypeForm)=>me.BankTypeForm = BankTypeForm}/>,
                title:me.state.json['10140BANK-000013'],/* ?????????????????? ????????????????????????*/
                beSureBtnClick:me.onSaveBankType,
                cancelBtnClick:()=>{
                    promptBox({
                        color:'warning',
                        title:me.state.json['10140BANK-000019'],/* ?????????????????? ????????????*/
                        content:me.state.json['10140BANK-000020'],/* ?????????????????? ???????????????????*/
                        beSureBtnClick:()=>{me.props.modal.close(`type`)}
                    })

                }
            });
        },pk_banktype);
        //<BankTypeForm config={config}/>
    }
    /**
     * ??????????????????
     * @param item
     */
    clickAddIconEve(item){
        this.state.selectedNode = item;
        this.setState(this.state,()=>{
            this.showTypeForm(item,'add');
        });
    }
    /**
     * ??????????????????
     * @param flag delButton ?????????????????????????????????????????????
     */
    clickDelIconEve(selectedTreeNode,flag,BillCode){
        if (!selectedTreeNode || !selectedTreeNode.hasOwnProperty("refpk")) {
            toast({content: this.state.json['10140BANK-000021'], color: 'warning'});/* ?????????????????? ??????????????????????????????*/
            return;
        }
        if(selectedTreeNode.refpk == '~'){
            toast({content: this.state.json['10140BANK-000022'], color: 'warning'});/* ?????????????????? ?????????????????????*/
            return;
        }
        /*this.state.curSelectedNode = selectedTreeNode;
        this.setState(this.state,()=>{*/
        if(!flag){//????????????????????????
            this.dataPermission('delete',()=>{
                promptBox ({
                    color:'warning',
                    title: this.state.json['10140BANK-000023'],/* ?????????????????? ????????????*/
                    content: this.state.json['10140BANK-000024'],/* ?????????????????? ???????????????????????????????????????*/
                    beSureBtnClick: ()=>{
                        promptBox ({
                            color:'warning',
                            title: this.state.json['10140BANK-000023'],/* ?????????????????? ????????????*/
                            content: this.state.json['10140BANK-000025'],/* ?????????????????? ????????????????????????????????????????????????????????????????????????????????????*/
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
                title: this.state.json['10140BANK-000023'],/* ?????????????????? ????????????*/
                content: this.state.json['10140BANK-000024'],/* ?????????????????? ???????????????????????????????????????*/
                beSureBtnClick: ()=>{
                    promptBox ({
                        color:'warning',
                        title: this.state.json['10140BANK-000023'],/* ?????????????????? ????????????*/
                        content: this.state.json['10140BANK-000025'],/* ?????????????????? ????????????????????????????????????????????????????????????????????????????????????*/
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
     * ???????????????
     * @param selectedTreeNode ???????????????
     * @param flag  ??????????????????????????? ?????????????????????????????????
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
                     * ??????????????????
                     **************************************************************/
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.props.cardTable.setTableData(this.config.tableId,{rows:[]});
                    /**************************************************************
                     * ???????????????
                     **************************************************************/
                    this.props.syncTree.delNodeSuceess(this.config.treeId,selectedTreeNode.refpk);
                    /**************************************************************
                     * ??????????????????
                     **************************************************************/
                    toast({title:this.state.json['10140BANK-000026'],color:"success"});/* ?????????????????? ???????????????*/
                    this.buttonStatus(this.props,'browse');
                    this.setState(this.state);
                }
            }
        });
    }

    /**
     * ????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
     * ??????????????????????????????????????????????????????
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
     * ??????????????????
     * @param operator   ??????
     * @param pk_banktype  ???????????????????????????????????????
     * @param ignorePermission   ??????????????????????????????????????????????????????????????????
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
            //???????????????????????????????????????????????????????????????
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
     * ????????????????????????
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
     * ??????checkbox?????????????????????
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
     * ??????form
     * @param type
     */
    showRightForm(type,BillCode, callBack=null){
        var me = this;
        type = type.toLowerCase();
        //  ?????????????????????????????????BankTypeTree???state??????
        // ?????????setNodeSelected??????????????????????????????????????????????????????
        let currNode = me.props.syncTree.getSelectNode(me.config.treeId) || me.BankTypeTree.getSelectedTreeNode();
        //let currNode = me.BankTypeTree.getSelectedTreeNode();
        //??????????????????????????????
        let rows = me.props.cardTable.getAllRows(me.config.tableId);
        let isDisabled = type == 'add' || rows == 0  ? true : false;
        me.props.button.setDisabled({'BatchDel':isDisabled});

        if(type == 'add'){
            me.props.cardTable.setStatus(tableId,'edit');
            me.getSysParam(()=>{
                let addUserJson = {};
                //????????????
                if(currNode.refpk != '~') {
                    if (currNode.pid == '~'){//???????????????
                        pk_banktype = {value:currNode.refpk,display:currNode.refname};
                        addUserJson = {
                            'pk_org':me.config.type == 'glb' ? me.state.curOrg.refpk : (me.state.businessOrg.refpk || me.state.curOrg.refpk),
                            'pk_bankdoc':'',
                            'pk_banktype': currNode.refpk,
                            'pk_country':'0001Z010000000079UJJ',
                            'enablestate':'2'
                        };
                        /*me.props.form.setFormItemsValue(me.config.formId,{
                            'pk_org':me.config.type == 'glb' ? {value:me.state.curOrg.refpk,display:me.state.json['10140BANK-000027']} : {value:me.state.businessOrg.refpk || me.state.curOrg.refpk,display:me.state.businessOrg.refname || me.state.curOrg.refname},/!* ?????????????????? ??????*!/
                            'pk_bankdoc':{value:''},
                            'pk_banktype': {value:currNode.refpk,display:currNode.refname},
                            'pk_country':{value:'0001Z010000000079UJJ',display:me.state.json['10140BANK-000028']},/!* ?????????????????? ??????*!/
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
                            'pk_org':me.config.type == 'glb' ? {value:me.state.curOrg.refpk,display:me.state.json['10140BANK-000027']} : {value:me.state.businessOrg.refpk || me.state.curOrg.refpk,display:me.state.businessOrg.refname || me.state.curOrg.refname},/!* ?????????????????? ??????*!/
                            'pk_bankdoc':{value:''},
                            'pk_banktype': {value:bankNode.id,display:bankNode.refname},
                            'pk_fatherbank':{value:currNode.refpk,display:currNode.refname},
                            'pk_country':{value:'0001Z010000000079UJJ',display:me.state.json['10140BANK-000028']},/!* ?????????????????? ??????*!/
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
                title:me.state.json['10140BANK-000019'],/* ?????????????????? ????????????*/
                content:me.state.json['10140BANK-000020'],/* ?????????????????? ???????????????????*/
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
     * ??????????????????????????????
     */
    saveAction(type,callback){
        //???????????????????????????????????????????????????UE??????????????????????????????????????????????????????????????????
		if(!this.props.form.isCheckNow(this.config.formId)) {
			return
		}
        let formData = this.props.form.getAllFormValue(this.config.formId);//??????????????????;
        this.props.cardTable.getAllRows(this.config);
        let pk;
        if(formData.rows[0].values.hasOwnProperty('pk_bankdoc')){
            pk = formData.rows[0].values.pk_bankdoc.value;//???????????????pk:update ????????????????????????pk:save ??????????????????
            formData.areacode = this.config.formId;//???????????????areacode??????
        }
        this.props.cardTable .filterEmptyRows(this.config.tableId,[]);
        let cardData = this.props.createMasterChildData(this.config.pageCode,this.config.formId,this.config.tableId);
        let enablestate = cardData.head.bankdoc.rows[0].values.enablestate.value;
        cardData.head.bankdoc.rows[0].values.enablestate = {value:enablestate? "2" : "3"};
        //???????????????????????????????????????????????????????????????
        let banktype = cardData.head.bankdoc.rows[0].values.pk_banktype.value;
        if(!banktype)
            cardData.head.bankdoc.rows[0].values.pk_banktype = pk_banktype;
        /***??????????????????***/
        formData.rows['status'] = '2';//????????????
        let requestParam = {
            model: cardData,
            pageid: this.config.pageCode
        };
        /**????????????????????????????????????????????????
         * ?????????????????????????????????????????????
         * ???????????????????????????????????????????????????
         **/
        let isAdd = false;//false????????? ????????????????????? true????????? ??????????????????
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
                        //?????????????????????
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //???????????????
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        if(isAdd){
                            //?????????????????????
                            this.props.form.setFormItemsValue(this.config.formId,{
                                'ts':{value:data.form.ts},
                                'pk_bankdoc':{value:data.form.pk_bankdoc}
                            });
                            this.props.syncTree.addNodeSuccess(this.config.treeId,data.treeNode);
                        }else{
                            //?????????????????????
                            this.props.form.setFormItemsValue(this.config.formId,{
                                'ts':{value:data.form.ts}
                            });
                            //this.props.syncTree.editNodeSuccess(this.config.treeId,data.treeNode[0]);
                        }
                        //???????????????
                        this.props.syncTree.openNodeByPk(this.config.treeId, data.treeNode[0].pid);

                        this.props.syncTree.setNodeSelected(this.config.treeId, data.treeNode[0].refpk);
                        //??????????????????
                        /*this.state.curSelectedNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, data.treeNode[0].refpk);
                        this.setState(this.state,()=>{*/
                        //????????????
                        if(type == 'saveandadd'){
                            this.props.cardTable.setStatus(tableId,'edit');
                            this.props.form.EmptyAllFormValue(this.config.formId);
                            this.showRightForm('add');
                            this.props.form.setFormStatus(this.config.formId, 'edit');
                            this.buttonStatus(this.props,'edit');
                            this.props.button.setDisabled({'BatchDel':true});
                            this.props.syncTree.setNodeDisable(this.config.treeId,true);
                            toast({title : this.state.json['10140BANK-000018'],color : 'success'});/* ?????????????????? ???????????????*/
                            callback && callback();
                        }else{
                            this.props.cardTable.setStatus(tableId,'browse');
                            this.buttonStatus(this.props,'save');
                            this.props.syncTree.setNodeDisable(this.config.treeId,false);
                            //??????????????????
                            this.loadNodeData(data.form.pk_bankdoc,()=>{
                                toast({title : this.state.json['10140BANK-000018'],color : 'success'});/* ?????????????????? ???????????????*/
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
        //UE???????????????????????????????????????
        this.props.button.setDisabled({'BatchDel':flag});
    }
    /**
     * ??????????????????
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
                        // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
            case 'batchdel'://????????????
                let checkedRows = props.cardTable.getCheckedRows(tableId);
                if(checkedRows.length == 0){
                    toast({content: me.state.json['10140BANK-000029'], color: 'warning'});/* ?????????????????? ??????????????????????????????*/
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
                    data = {value:'GLOBLE00000000000000',display:me.state.json['10140BANK-000027']};/* ?????????????????? ??????*/
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
                    let formData = me.props.form.getAllFormValue(me.config.formId);//??????????????????;
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
                                toast({title : me.state.json['10140BANK-000030'],color : 'success'});/* ?????????????????? ???????????????*/
                                me.props.button.setDisabled({'Synchronise':true});
                            }
                        }
                    })
                });
                break;
            case 'printmenu'://??????
                this.printPage.call('print');
                break;
            case 'output'://??????
                let currNode = me.BankTypeTree.getSelectedTreeNode();
                let config = {
                    funcode:'10140BANK',//??????????????????
                    nodekey:'bankdoccard',//??????????????????
                    billtype:'',//????????????
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
                'pdf',//??????????????????????????????html???????????????  pdf--pdf??????
                urls['print'],
                {
                    funcode:funcnode,//??????????????????
                    appcode:funcnode,
                    nodekey:'bankdoccard',//??????????????????
                    billtype:'',//????????????
                    oids:[currNode.refpk],
                    outputType:'output',
                    userjson:`{type:${type}}`
                }
            );
        }else{
            print(
                'pdf',//??????????????????????????????html???????????????  pdf--pdf??????
                urls['print'],
                {
                    funcode:funcnode,//??????????????????
                    appcode:funcnode,
                    nodekey:'bankdoccard',//??????????????????
                    billtype:'',//????????????
                    oids:[currNode.refpk],
                    userjson:`{type:${type}}`
                }
            );
        }
    }
    /**
     * ?????????????????????????????????
     * @param props
     * @param node
     */
    disableButton(node){
        //???????????????????????????????????????
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
            //????????????
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
     * checkbox ????????????
     */
    onCheckBoxClick(){
        //this.setState({stopFlag:!this.state.stopFlag});
    }
    /**
     * ????????????change ??????
     */
    onCheckBoxChange(flag){
        switch (flag){
            case 'cust'://????????????
                this.state.showCust = !this.state.showCust;
                break;
            case 'other'://??????????????????
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
     * ?????????????????????????????????????????????linkManRecord??????????????????????????????form???
     * ??????item??????????????? ??????????????????model???form??????????????????????????????????????????????????????????????????
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
     * ?????????????????????
     * @param props
     */
    modelSave = (props)=>{
        props.cardTable.closeModel(tableId);
        this.saveLinkMan(props);
    }
    /**
     * ?????????????????????
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
     * ???????????????
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
                        //????????????linkmans???
                        props.cardTable.setValByKeyAndIndex(tableId,lineIndex,'linkman',{value:res.data.pk_linkman,display:res.data.name ? res.data.name : linkManRecord.rows[0].name.value});
                        // props.cardTable.setStatus(tableId,'edit');
                        props.cardTable.setStatus(tableId,'browse');
                        this.initLinkManRecord();
                    }
                    //toast({content : "????????????",color : 'success'});
                }
            }
        })
    }
    /**
     * ??????????????????
     * @param value
     */
    onOrgChange(value){ //????????????????????????
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
                            title:me.state.json['10140BANK-000031'],/* ?????????????????? ??????*/
                            content:value.value?me.state.json['10140BANK-000032']:me.state.json['10140BANK-000033'],/* ?????????????????? ????????????????????????,????????????????????????????????????????????????????????????*/
                            beSureBtnClick:()=>{
                                ajax({
                                    url:urls["enablestateUrl"],
                                    data:requestParam,
                                    success:(result)=>{
                                        toast({title:value.value?me.state.json['10140BANK-000034']:me.state.json['10140BANK-000035'],color:"success"});/* ?????????????????? ???????????????,???????????????*/
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
                //??????????????????????????????
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
                        isiban:{value:true,display:me.state.json['10140BANK-000036']}/* ?????????????????? ???*/
                    });
                }else{
                    props.form.setFormItemsValue(me.config.formId,{
                        isiban:{value:false,display:me.state.json['10140BANK-000037']}/* ?????????????????? ???*/
                    });
                }
                break;
            default:
                break;
        }

    }
    /**
     *?????????????????????????????????
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
     * ??????????????????
     */
    returnCardPage(){
        let me = this;
        me.show('card');
        me.hide('list');
        me.show('check','inline');
        me.props.setPageCode({'p':me.config.pageCode});
    }

    /**
     * checkbox??????
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
         *  ??????createPage????????????????????????????????????props???
         *  ?????? asyncTree,syncTree,form,table??????
         *  ????????????????????????props??????????????????
         * */
        const {form,button,modal,DragWidthCom,search,cardTable,BillHeadInfo} = this.props;
        const {createForm} = form;//?????????????????????????????????
        const {createCardTable } = cardTable;
        let { createModal } = modal;  //?????????
        let { createButtonApp } = button;
        const {createBillHeadInfo} = BillHeadInfo;

        let treeConfig = {
            //treeRootTitle:this.config.treeRootTitle,//???????????????
            treeId:this.config.treeId,//?????????ID
            showLine:this.config.showLine, //???????????????
            disabledSearch:this.state.disabledSearch,
            needSearch:this.config.needSearch || true,
            needEdit:this.config.needEdit || true,
            showModal:this.config.showModal || false,
            metaId:this.config.metaId,    //??????????????????????????????id????????????????????????????????????
            searchType:this.config.searchType || 'location',   // ??????????????????????????????/??????  location/filtration???????????????
            clickAddIconEve:this.clickAddIconEve.bind(this),
            clickDelIconEve:this.clickDelIconEve.bind(this),
            clickEditIconEve:this.clickEditIconEve.bind(this),
            type:this.config.type,
            disableButton:this.disableButton.bind(this),
            pk_org:this.state.curOrg ? this.state.curOrg.refpk : '',
            stopFlag:this.state.stopFlag,               //????????????
            showCust:this.state.showCust, //??????????????????
            showOthers:this.state.showOthers,//??????????????????????????????
            urls:urls,
            json:this.state.json,//??????
            loadNodeData:this.loadNodeData.bind(this)   //???????????????????????????
        }
        let formConfig = {
            pk_banktype:'',
            pk_org:this.state.curOrg ? this.state.curOrg.refpk : '',
            pageCode:'10140BANK_banktype',
            formId:this.config.modalFormId
        };
        let listConfig = {
            title:this.state.json['10140BANK-000000'],//???????????? ????????????
            type:this.config.type,
            pk_org:this.state.curOrg ? this.state.curOrg.refpk : '',
            json:this.state.json,//??????
            inlt:this.state.inlt,//?????????????????????
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
                            title: this.state.json && this.state.json['10140BANK-000023'],/* ?????????????????? ????????????*/
                            content: this.state.json && this.state.json['10140BANK-000024']/* ?????????????????? ???????????????????????????????????????*/
                        })}
                        {/*?????????????????????render????????????????????????????????????content???form????????????????????????*/}
                        {createModal('type',{
                            noFooter:false,
                            userControl:true,
                            //content:this.props.form.createForm(this.config.modalFormId,{}),
                            content:<BankTypeForm config={formConfig} ref={(BankTypeForm)=>this.BankTypeForm = BankTypeForm}/>,
                            title:this.state.json && this.state.json['10140BANK-000013'],/* ?????????????????? ????????????????????????*/
                            beSureBtnClick:this.onSaveBankType.bind(this)
                        })}
                        {createModal('modal',{noFooter:false})}
                        {/*{createPageIcon()}*/}
                        {/* ?????? title*/}
                        {
                            this.config.type !== 'org' &&
                            <div className='header-title-search-area'>{createBillHeadInfo({title :this.state.title,initShowBackBtn:false})}</div>
                        }
                        {/*<div className="title" fieldid={this.state.title+"_title"}>
                            {this.config.type !== 'org' && <div>{this.state.title}</div>}
                        </div>*/}
                        {/*???????????????????????????????????????????????????????????????*/}
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
                                    {this.state.json && this.state.json['10140BANK-000012']/* ?????????????????? ????????????*/}
                                </NCCheckbox>
                            <div id={'check'} style={{'display':'inline'}}>
                                <NCCheckbox
                                    defaultChecked={false}
                                    disabled={this.state.disabled}
                                    checked={this.state.showCust}
                                    onChange={this.onCheckBoxChange.bind(this,'cust')}
                                    size="lg"
                                >
                                    {this.state.json && this.state.json['10140BANK-000041']/* ?????????????????? ??????????????????*/}
                                    </NCCheckbox>
                                <NCCheckbox
                                    defaultChecked={false}
                                    disabled={this.state.disabled}
                                    checked={this.state.showOthers}
                                    onChange={this.onCheckBoxChange.bind(this,'other')}
                                    size="lg"
                                >
                                    {this.state.json && this.state.json['10140BANK-000042']/* ?????????????????? ?????????????????????????????????*/}
                                    </NCCheckbox>
                            </div>
                        </span>
                        {/* ????????? btn-group*/}
                        <div className=" btn-group">
                            {createButtonApp({
                                area: 'bankdoc',
                                buttonLimit: 3,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector(' btn-group')
                            })}

                        </div>

                    </NCDiv>
                    {/* ???????????? */}
                    <div className="tree-card">
                        <DragWidthCom
                            // ????????????
                            leftDom = {this.state.curOrg && this.state.curOrg.refpk  && <BankTypeTree fieldid="bankTypeTree_ref-window" treeConfig={treeConfig} syncTree={this.props.syncTree} ref={(BankTypeTree) => this.BankTypeTree = BankTypeTree }/>}
                            // ???????????????
                            rightDom = {
                                <div>
                                    <div className="card-area">{createForm(this.config.formId, {
                                        title:this.state.json && this.state.json['10140BANK-000038'],/* ?????????????????? ????????????*/
                                        cancelPSwitch:true,//????????????????????????
                                        onAfterEvent:this.onAfterFormEvent.bind(this)
                                    })}</div>
                                    <div className="nc-bill-table-area account_org_table_liu" style={{padding:0}}>
                                        {createCardTable(this.config.tableId, {
                                            //onCloseModel:this.onCloseModel.bind(this),//???????????????
                                            isAddRow: false,//??????????????????????????????????????????????????????????????????????????????????????????????????????
                                            showCheck:true,
                                            selectedChange:this.selectedChange.bind(this),
                                            onAfterEvent:this.onTableModelAfterEdit.bind(this),//???????????????
                                            modelSave: this.modelSave.bind(this),//???????????????????????????
                                            showIndex:true,
                                            tableHead:this.getTableHead.bind(this),
                                            hideAdd:true,
                                            hideModelSave:true,
                                            modelClose:this.closeModel.bind(this)//?????????????????????
                                        })}
                                    </div>
                                </div>
                            }
                            // ???????????????????????????px/?????????
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
                    moduleName = "uapbd"//?????????
                    pagecode= {this.props.config.pageCode}
                    appcode={funcnode}
                    selectedPKS = {[]}
                    billType = {billType}//????????????
                />
            </div>
        )
    }
}
/**
 * ????????????
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