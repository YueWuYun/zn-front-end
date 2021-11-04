//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
const { PrintOutput } = high;
import { createPage, ajax, base, toast,print,high,cardCache,promptBox,getMultiLang ,createPageIcon} from 'nc-lightapp-front';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import utils from '../../../public/utils';
const {showFormular } = utils;
const { NCAffix,NCBackBtn, NCDiv } = base;
let { getCacheById, updateCache ,addCache,getCurrentLastId ,getNextId, deleteCacheById } = cardCache;

import './index.less';
let formId = 'head';
let tableId = 'linkmanvos';
let pageId = '10140ADRB_card';
const appcode = '10140ADRB';//注册按钮的id
const pk_value = "code";
const linkman='10140LM';
const pk_item = 'pk_addressdoc';
const AddDatasource = 'uapbd.address.addressdoc_grp.dataSource';
let urls={
    queryaddresscardUrl:"/nccloud/uapbd/address/queryaddresscard.do",
    SaveaddressUrl:"/nccloud/uapbd/address/saveaddress.do",
    updateaddressUrl:"/nccloud/uapbd/address/updateaddress.do",
    deladdressUrl:"/nccloud/uapbd/address/deladdress.do",
    copyaddressUrl:"/nccloud/uapbd/address/copyAddressCard.do",
    saveLinkman:"/nccloud/uapbd/address/saveLinkman.do",
    queryLinkman:"/nccloud/uapbd/address/queryLinkman.do",
    queryDefaultDataUrl:"/nccloud/uapbd/address/queryDefaultData.do",
    enablestateUrl:"/nccloud/uapbd/address/enableAddressDocInfo.do",
    print:"/nccloud/uapbd/address/printAddressDocInfo.do",
    cancel:"/nccloud/uapbd/address/cancelAddressDoc.do",
    validateUrl:"/nccloud/uapbd/address/validateAddressDoc.do",
};

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.config =Object.assign({
            title:'10140ADRB-000000',/* 国际化处理： 地点-全局*/
            tableId:"linkmanvos",
            formId : 'head',
            linkman:'10140LM',
            pageCode:"10140ADRB_card",
            appcode:'10140ADRB',
            oid:'1004Z01000000000YWY3',
            nodeType:'GLOBE_NODE',
            primaryKey:'pk_addressdoc',
            urls:urls
        },props.config);
        formId = this.config.formId;
        tableId = this.config.tableId;
        pageId = this.config.pageCode;
        this.state = {
            project_code:'',
            bill_code : '',
            isedit:true,
            pks:[],
            stated:'browse',
            json:null,
            isPrecode:true,
        };
        this.initTemplate(this.props,()=>{
            let status = this.props.getUrlParam('status');
            if(status != "add"){
                let	pk = this.props.getUrlParam('id');
                if(pk && pk != 'undefined'){
                    this.getdata(pk);
                }
            }
            else{
                let	pk = this.props.getUrlParam('id');
                if(pk && pk != 'undefined'){
                    this.copydate(pk);
                }else{
                    this.setDefaultValue();
                }
            }
        });
    }

    initTemplate = (props,callback) => {
        createUIDom(props)(
            {
                pagecode: this.config.pageCode?this.config.pageCode:pageId,//页面id
            },
            {
                moduleId: "10140ADRB",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    if(data.template){
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    callback && callback();
                }
            }
        )
    }

    tableBtnAry =(props)=>{
        return props.cardTable.getStatus(tableId)==='browse'?[]:['insertline','delline','editline'];;
    }

    modifierMeta = (props, meta) => {
        let status = props.getUrlParam('status');
        meta[formId].status = status;
        meta[tableId].status = status;
        meta[formId].items.map((item)=>{
            if(item.attrcode == 'pk_areacl'){
                item.queryCondition=()=>{
                   if(this.config.nodeType =='GLOBE_NODE'){
                   return {pk_org:'GLOBLE00000000000000'}
                   }
                }
            }
            if(item.attrcode == 'province'){

                item['disabled']=true;
                item.queryCondition=()=>{
                    let country = props.form.getFormItemsValue(formId,'country').value;
                    return {pk_country:country,pk_father:'~'}
                }
            }
            if(item.attrcode == 'city'){
                item['disabled']=true;
                item.queryCondition=()=>{
                    let province = props.form.getFormItemsValue(formId,'province').value
                    return {pk_father:province}
                }
            }
            if(item.attrcode == 'region'){
                item['disabled']=true;
                item.queryCondition=()=>{
                    let city = props.form.getFormItemsValue(formId,'city').value
                    return {pk_father:city}
                }
            }
        })
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10140ADRB-000001'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:200,
            itemtype: 'customer',
            //fixed:'right',
            render:(text, record, index) => {
                let btnArray = this.tableBtnAry(props);

                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-button",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        });

        return meta;
    }

    tablemodalshow = (props,index) => {
        props.modal.show('linkmanModal',{
            userControl:true,
            beSureBtnClick:()=>{
                let flag = this.props.form.isCheckNow(linkman);
                if(!flag)return
                let lmdata = props.form.getAllFormValue(linkman);
                lmdata["areacode"] = linkman;
                this.props.validateToSave( {"model" : lmdata,"pageid" : this.config.pageCode} , ()=>{
                    ajax({
                        url:urls.saveLinkman,
                        data:{
                            'pageid':this.config.pageCode,
                            'gridModel':lmdata
                        },
                        success:(res)=>{
                            let{success,data} =res;
                            if(success){
                                props.modal.close('linkmanModal')
                                if(data){
                                    //联系人新增成功，回显子表数据
                                    props.cardTable.setValByKeyAndIndex(tableId,index,'pk_linkman',{value:data,display:data});
                                    props.cardTable.setValByKeyAndIndex(tableId,index,'pk_linkman.name',lmdata.rows[0].values.name);
                                    props.cardTable.setValByKeyAndIndex(tableId,index,'pk_linkman.sex',lmdata.rows[0].values.sex);
                                    props.cardTable.setValByKeyAndIndex(tableId,index,'pk_linkman.vjob',lmdata.rows[0].values.vjob);
                                    props.cardTable.setValByKeyAndIndex(tableId,index,'pk_linkman.phone',lmdata.rows[0].values.phone);
                                    props.cardTable.setValByKeyAndIndex(tableId,index,'pk_linkman.cell',lmdata.rows[0].values.cell);// props.cardTable.setValByKeyAndRowId(tableId,index,{
                                }
                            }
                        }
                    });
                } , {"10140LM":'form'} , 'form' )
            },
            cancelBtnClick:()=>{
                props.form.EmptyAllFormValue(linkman);
                props.modal.close('linkmanModal')
                return;
            },
            closeModalEve:()=>{
                props.form.EmptyAllFormValue(linkman);
                props.modal.close('linkmanModal')
                return;
            },
        })
    }

    tableButtonClick = (props, id, text, record, index) => {

        switch(id){
            case 'spread':
                props.cardTable.toggleRowView(tableId, record);
                break;
            case "delline"://删除行
                props.cardTable.delRowsByIndex(tableId, index);
                break;
            case "insertline"://更多
                props.form.setFormStatus(linkman,'edit');
                props.modal.show('linkmanModal',{
                    userControl:true,
                    beSureBtnClick:()=>{
                        let flag = this.props.form.isCheckNow(linkman);
                        if(!flag)return
                        let lmdata = props.form.getAllFormValue(linkman);
                        lmdata["areacode"] = linkman;
                        this.props.validateToSave( {"model" : lmdata,"pageid" :  this.config.pageCode} , ()=>{
                            ajax({
                                url:urls.saveLinkman,
                                data:{
                                    'pageid':this.config.pageCode,
                                    'gridModel':lmdata
                                },
                                success:(res)=>{
                                    let{success,data} =res;
                                    if(success){
                                        if(data){
                                            //联系人新增成功，回显子表数据
                                            props.modal.close('linkmanModal')
                                            props.cardTable.addRow(tableId,index+1,{

                                                'pk_linkman':{
                                                    value:data
                                                },
                                                'pk_linkman.name':lmdata.rows[0].values.name,
                                                'pk_linkman.sex':lmdata.rows[0].values.sex,
                                                'pk_linkman.vjob':lmdata.rows[0].values.vjob,
                                                'pk_linkman.phone':lmdata.rows[0].values.phone,
                                                'pk_linkman.cell':lmdata.rows[0].values.cell,
                                            });
                                        }
                                    }
                                }
                            });
                        } , {"10140LM":'form'} , 'form' )
                    },
                    cancelBtnClick:()=>{
                        props.form.EmptyAllFormValue(linkman);
                        props.modal.close('linkmanModal')
                        return;
                    },
                    closeModalEve:()=>{
                        props.form.EmptyAllFormValue(linkman);
                        props.modal.close('linkmanModal')
                        return;
                    },
                })

                break;
            case "editline"://展开
                ajax({
                    url:urls.queryLinkman,
                    data:{
                        pageid:this.config.pageCode,
                        moudleid:linkman,
                        pk:record.values["pk_linkman"].value
                    },
                    success:(res)=>{
                        showFormular(this.props,res,{
                            "10140LM" : "form",
                        });
                        let{success,data} =res;
                        if(success){
                            if(data){
                                props.form.setFormStatus(linkman,'edit');
                                props.form.setAllFormValue({[linkman]:res.data[linkman]})
                                this.tablemodalshow(props,index);
                            }
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    componentWillMount() {}

    componentDidMount() {}

    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.config.formId);
        if(formStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    setDefaultValue = () =>{
        this.props.form.setFormStatus(this.config.formId, 'add');
        this.props.form.EmptyAllFormValue(this.config.formId)
        ajax({
            url: urls.queryDefaultDataUrl,
            data:{nodeType:this.config.nodeType},
            success: (res) => {
                showFormular(this.props,res,{
                    "head" : "form",
                    "linkmanvos":"cardTable",
                });
                if (res.data['carddate'].head) {
                    let datas = res.data['carddate'].head[this.config.formId]
                    let project_code = datas.rows[0].values[pk_value].value;
                    datas.rows.forEach(function(item, index, array){
                        //是否其中转换成开关
                        if (item.values['enablestate'].value === '2') {
                            item.values['enablestate'].value = true;
                        } else if (item.values['enablestate'].value === '3'){
                            item.values['enablestate'].value = false;
                        }
                    });
                    utils.filterEmptyData(datas.rows[0].values);
                    this.props.form.setAllFormValue({ [this.config.formId]: datas});
                    console.log(this.config.formId,{'code':true})
                    this.props.form.setFormItemsDisabled(this.config.formId,{'code':!res.data['isCodeEdit']});
                    this.state.isPrecode = res.data['isPrecode'];
                    this.setState({project_code:project_code});
                }
                if (res.data['carddate'].body) {
                    this.props.cardTable.setTableData(this.config.tableId, res.data['carddate'].body[this.config.tableId]);
                }
                if(res.data['message']){
                    toast({content:res.data['message'],color:'warning'});
                }
                    this.toggleShow();
            },
            error:(res)=>{

        }
        });
    }

    //切换页面状态
    toggleShow = () => {
        let status = this.props.getUrlParam('status');
        let flag = status === 'browse' ? false : true;
        //按钮的显示状态
        this.props.button.setButtonVisible(['add','edit','delete','copy','refresh','back','print'],!flag);
        this.props.button.setButtonVisible(['save','saveadd','cancel','addline'],flag);
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
        let pk_group = this.props.form.getFormItemsValue(this.config.formId, 'pk_group').value;
        let pk_org = this.props.form.getFormItemsValue(this.config.formId, 'pk_org').value;
        let aflag = this.config.nodeType==='GROPE_NODE'&&(pk_group!=pk_org)
        this.props.button.setDisabled({
            edit:aflag,
            delete:aflag,
            saveadd:status == 'edit'?true:false,
        });
        this.props.form.setFormStatus(this.config.formId, status);
        this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':flag})
        this.props.cardTable.setStatus(this.config.tableId, status==='browse'?"browse" :"edit");
        //适配编辑公式转化开关组件的数据类型
        let enabvalue = this.props.form.getFormItemsValue(this.config.formId,'enablestate')
        let value =  enabvalue.value;
        if(status === 'browse'){

            if (enabvalue.value === '2') {
                value = true;
            } else if (enabvalue.value === '3'){
                value = false;
            }
            this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:value}});
        }else{
            if (enabvalue.value) {
                value = '2';
            } else if (!enabvalue.value){
                value = '3';
            }
            this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:value}});
        }
        this.setState({
            stated:status
        })
    };

    //按钮点击事件
    buttonClick(props, id) {
        switch (id) {
            case 'add':
                props.form.EmptyAllFormValue(this.config.formId)
                props.cardTable.setTableData(this.config.tableId, { rows: [] })
                props.setUrlParam({status:'add'})
                this.setDefaultValue();
                break
            case 'edit':
                ajax({
                    url: urls.validateUrl,
                    data: {
                        pk: props.getUrlParam('id'),
                        nodeType: this.config.nodeType,
                        type:id
                    },
                    success: (res) => {
                        props.setUrlParam({status:'edit',id: props.getUrlParam('id')});
                        this.toggleShow();
                    }
                })
                break;
            case 'delete':
                ajax({
                    url: urls.validateUrl,
                    data: {
                        pk: props.getUrlParam('id'),
                        nodeType: this.config.nodeType,
                        type:id
                    },
                    success: (res) => {
                        promptBox({
                            color:"info",
                            title: this.state.json['10140ADRB-000002'],/* 国际化处理： 确定删除*/
                            content: this.state.json['10140ADRB-000003'],/* 国际化处理： 您确定要删除所选数据吗?*/
                            beSureBtnClick: this.delConfirm.bind(this)
                        });
                    }
                })
                break
            case 'back':
                props.pushTo("list",{
                    pagecode:this.props.config.pageListCode,
                })
                break;
            case 'save':
                this.saveClick();
                break;
            case 'saveadd':
                this.saveaddClick();
                break;
            case 'copy':
                props.setUrlParam({status:'add',id: props.getUrlParam('id')});
                this.copydate(props.getUrlParam('id'));
                break
            case 'cancel':
                promptBox({
                    color:"info",
                    title:this.state.json['10140ADRB-000004'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10140ADRB-000005'],/* 国际化处理： 是否确认要取消?*/
                    beSureBtnClick:()=>{
                        if (props.getUrlParam('status') === 'add') {
                            let code = this.props.form.getFormItemsValue(this.config.formId,'code')
                            ajax({
                                url: urls.cancel,
                                data:{code:code.value},
                                success: (res) => {
                                    props.form.cancel(this.config.formId);
                                    props.cardTable.resetTableData(this.config.tableId);
                                    let id = props.getUrlParam('id')?props.getUrlParam('id'):getCurrentLastId(AddDatasource);
                                    props.setUrlParam({status:'browse',id: id});
                                    if(id==null){
                                        this.props.button.setButtonVisible(['add','back'],true);
                                        this.props.button.setButtonVisible(['save','saveadd','cancel','addline','edit','delete','copy','refresh','print'],false);
                                        this.props.button.setDisabled(['edit','delete','copy','refresh','back','print'],true);
                                        this.props.form.cancel(this.config.formId);
                                        this.props.cardTable.resetTableData(this.config.tableId);
                                        this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':true})
                                        return;
                                    }
                                    let	pk = this.props.getUrlParam('id');
                                    if(pk && pk != 'undefined'){
                                        this.getdata(pk);
                                    }
                                }
                            })
                        }
                        if ((props.getUrlParam('status') === 'edit')) {
                            props.form.cancel(this.config.formId);
                            props.cardTable.resetTableData(this.config.tableId);
                            props.setUrlParam({status:'browse',id:props.getUrlParam('id')});
                        }
                        props.setUrlParam({status:'browse'});
                        this.toggleShow();
                    },
                    cancelBtnClick:()=>{
                        return;
                    },
                    closeBtnClick:()=>{
                        return;
                    }
                })
                break
            case 'addline':
                this.linkadd(props);
                break
            case 'refresh':
                let	pk = this.props.getUrlParam('id');
                if(pk && pk != 'undefined'){
                    this.getdata(pk,true,()=>{toast({title:this.state.json['10140ADRB-000006'],color:'success'});});/* 国际化处理： 刷新成功！*/
                }
                break;
            case "print":
                let printParam={
                    funcode: this.props.config.appcode,
                    nodekey: 'addresscard',
                    outputType:'print'
                };
                this.pintFunction(printParam);
                break;
            case 'output':
                let pkid = this.props.getUrlParam('id');
                if(pkid==null){
                    return
                }
                let pks = [];
                pks.push(pkid);
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            default:
                break
        }
    }

    //打印功能函数
    pintFunction(param){
        let pk = this.props.getUrlParam('id');
        if(pk==null){
            return
        }
        let pks = [];
        pks.push(pk);
        param.oids = pks;
        print(
            'pdf',
            urls['print'],
            param
        );
    }

    //通过单据id查询单据信息
    getdata = (pk,flag,callback) =>{
        let cardData = getCacheById(pk, AddDatasource);
        if(cardData&&!flag){
            if (cardData['carddate'].head) {
                this.props.form.setAllFormValue({ [this.config.formId]: cardData['carddate'].head[this.config.formId] });
                let values = cardData['carddate'].head[this.config.formId].rows[0].values;
                let project_code = values[pk_value].value;
                this.setState({project_code});
                this.props.form.setFormItemsDisabled(this.config.formId,{'code':!cardData['isCodeEdit']})
                this.state.isPrecode = cardData['isPrecode'];
                let isenab = this.config.nodeType==="GROPE_NODE"&&(values['pk_group'].value!=values['pk_org'].value)
                this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':isenab})
            }
            if (cardData['carddate'].body) {
                this.props.cardTable.setTableData(this.config.tableId, cardData['carddate'].body[this.config.tableId]);
            }
            this.toggleShow();
        }else{
            let data = {pk:pk,pagecode:this.config.pageCode};
            ajax({
                url: urls.queryaddresscardUrl,
                data,
                success: (res) => {
                    showFormular(this.props,res,{
                        "head" : "form",
                        "linkmanvos":"cardTable",
                    });
                    if (res.data['carddate'].head) {
                        this.props.form.setAllFormValue({ [this.config.formId]: res.data['carddate'].head[this.config.formId] });
                        let values = res.data['carddate'].head[this.config.formId].rows[0].values;
                        let project_code = values[pk_value].value;
                        this.setState({project_code});
                        this.props.form.setFormItemsDisabled(this.config.formId,{'code':!res.data['isCodeEdit']})
                        this.state.isPrecode = res.data['isPrecode'];
                        let isenab = this.config.nodeType==="GROPE_NODE"&&(values['pk_group'].value!=values['pk_org'].value)
                        this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':isenab})
                        res.data['carddate'].head[this.config.formId].rows.forEach(function(item, index, array){
                            //是否其中转换成开关
                            if (item.values['enablestate'].value === '2') {
                                item.values['enablestate'].value = true;
                            } else {
                                item.values['enablestate'].value = false;
                            }
                        });
                    }
                    if (res.data['carddate'].body) {
                        this.props.cardTable.setTableData(this.config.tableId, res.data['carddate'].body[this.config.tableId]);
                    }
                    res.data['head']=res.data['carddate'].head;
                    updateCache(pk_item,pk,res.data,this.config.formId,AddDatasource);
                    callback&&callback();
                    this.toggleShow();
                }
            });
        }
    }

    //复制数据
    copydate = (pk)=>{
        let data = {pk:pk,pagecode:this.config.pageCode};
        ajax({
            url: urls.copyaddressUrl,
            data,
            success: (res) => {
                showFormular(this.props,res,{
                    "head" : "form",
                    "linkmanvos":"cardTable",
                });
                if (res.data['carddate'].head) {
                    res.data['carddate'].head[this.config.formId].rows.forEach(function(item, index, array){
                        //是否其中转换成开关
                        if (item.values['enablestate'].value === '2') {
                            item.values['enablestate'].value = true;
                        } else if(item.values['enablestate'].value === '3'){
                            item.values['enablestate'].value = false;
                        }
                    });
                    this.props.form.setAllFormValue({ [this.config.formId]: res.data['carddate'].head[this.config.formId] });
                    let project_code = res.data['carddate'].head[this.config.formId].rows[0].values[pk_value].value;
                    this.setState({project_code});
                    this.props.form.setFormItemsDisabled(this.config.formId,{'code':!res.data['isCodeEdit']})
                    this.state.isPrecode = res.data['isPrecode'];
                }
                if (res.data['carddate'].body) {
                    this.props.cardTable.setTableData(this.config.tableId, res.data['carddate'].body[this.config.tableId]);
                }
                this.toggleShow();
            }
        });
    }

    pageInfoClick=(props, pk)=>{
        console.log(pk)
        if(pk&&pk!=null) {
            props.setUrlParam({id: pk});
            this.getdata(pk);
        }
    }

    //保存单据
    saveClick = () =>{
        this.props.cardTable.filterEmptyRows(tableId);
        if(this.state.isPrecode ==false &&this.props.form.getFormItemsValue(this.config.formId,'code').value == null){
            this.props.form.setFormItemsValue(this.config.formId,{'code':{value:'.',display:null}});
        }
        let flag = this.props.form.isCheckNow(this.config.formId);
        if(!flag)return
        let CardData = this.props.createMasterChildData(this.config.pageCode, this.config.formId, this.config.tableId);
        //CardData.head[this.config.formId].rows[0].values.enablestate.value=CardData.head[this.config.formId].rows[0].values.enablestate.value==true?2:3;
        // CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
        let url = urls.SaveaddressUrl//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = urls.updateaddressUrl//修改保存
        }
        this.props.validateToSave( CardData , ()=>{ajax({
            url: url,
            data: CardData,
            success: (res) => {
                let pk_project = null
                if (res.success) {
                    showFormular(this.props,res,{
                        "head" : "form",
                        "linkmanvos":"cardTable",
                    });
                    let pk =null;
                    if (res.data) {
                        if (res.data['carddate'].head) {
                            this.props.form.setAllFormValue({ [this.config.formId]: res.data['carddate'].head[this.config.formId] });
                            let values = res.data['carddate'].head[this.config.formId].rows[0].values;
                            let project_code = values[pk_value].value;
                            pk = values[pk_item].value;
                            this.setState({project_code});
                            this.props.form.setFormItemsDisabled(this.config.formId,{'code':!res.data['isCodeEdit']})
                            let isenab = this.config.nodeType==="GROPE_NODE"&&(values['pk_group'].value!=values['pk_org'].value)
                            this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':isenab})
                            res.data['carddate'].head[this.config.formId].rows.forEach(function(item, index, array){
                                //是否其中转换成开关
                                if (item.values['enablestate'].value === '2') {
                                    item.values['enablestate'].value = true;
                                } else if (item.values['enablestate'].value === '3'){
                                    item.values['enablestate'].value = false;
                                }
                            });
                        }
                        if (res.data['carddate'].body) {
                            this.props.cardTable.setTableData(this.config.tableId, res.data['carddate'].body[this.config.tableId]);
                        }
                        res.data['head']=res.data['carddate'].head;
                        if (this.props.getUrlParam('status') === 'add'){
                            addCache(pk,res.data,this.config.formId,AddDatasource);
                        }{
                            updateCache(pk_item,pk,res.data,this.config.formId,AddDatasource);
                        }
                        this.props.setUrlParam({status:'browse',id: pk});
                        toast({title : this.state.json['10140ADRB-000007'],color : 'success'});/* 国际化处理： 保存成功！*/
                        this.toggleShow();
                    }
                }
            }
        })} , {[formId]:'form',[tableId]:'cardTable'} , 'card' )

    }

    //保存新增单据
    saveaddClick = () =>{
        this.props.cardTable.filterEmptyRows(tableId);
        if(this.state.isPrecode ==false&&this.props.form.getFormItemsValue(this.config.formId,'code').value == null){
            this.props.form.setFormItemsValue(this.config.formId,{'code':{value:'.',display:null}});
        }
        let flag = this.props.form.isCheckNow(this.config.formId);
        if(!flag)return
        let CardData = this.props.createMasterChildData(this.config.pageCode, this.config.formId, this.config.tableId);
        //CardData.head[this.config.formId].rows[0].values.enablestate.value=CardData.head[this.config.formId].rows[0].values.enablestate.value==true?2:3;
        // CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
        let url = urls.SaveaddressUrl//新增保存
        if (this.props.getUrlParam('status') === 'edit') {
            url = urls.updateaddressUrl//修改保存
        }
        this.props.validateToSave( CardData , ()=>{ajax({
            url: url,
            data: CardData,
            success: (res) => {
                let pk_project = null
                if (res.success) {
                    let pk =null;
                    showFormular(this.props,res,{
                        "head" : "form",
                        "linkmanvos":"cardTable",
                    });
                    if (res.data) {
                        if (res.data['carddate'].head) {
                            this.props.form.setAllFormValue({ [this.config.formId]: res.data['carddate'].head[this.config.formId] });
                            let values = res.data['carddate'].head[this.config.formId].rows[0].values;
                            let project_code = values[pk_value].value;
                            pk = values[pk_item].value;
                            this.setState({project_code});
                            this.props.form.setFormItemsDisabled(this.config.formId,{'code':!res.data['isCodeEdit']})
                            let isenab = this.config.nodeType==="GROPE_NODE"&&(values['pk_group'].value!=values['pk_org'].value)
                            this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':isenab})
                            res.data['carddate'].head[this.config.formId].rows.forEach(function(item, index, array){
                                //是否其中转换成开关
                                if (item.values['enablestate'].value === '2') {
                                    item.values['enablestate'].value = true;
                                } else if (item.values['enablestate'].value === '3'){
                                    item.values['enablestate'].value = false;
                                }
                            });
                        }
                        if (res.data['carddate'].body) {
                            this.props.cardTable.setTableData(this.config.tableId, res.data['carddate'].body[this.config.tableId]);
                        }
                        res.data['head']=res.data['carddate'].head;
                        if (this.props.getUrlParam('status') === 'add'){
                            addCache(pk,res.data,this.config.formId,AddDatasource);
                        }{
                            updateCache(pk_item,pk,res.data,this.config.formId,AddDatasource);
                        }
                        this.props.setUrlParam({status:'add',id:null});
                        toast({title : this.state.json['10140ADRB-000007'],color : 'success'});/* 国际化处理： 保存成功！*/
                        this.props.form.EmptyAllFormValue(this.config.formId)
                        this.props.cardTable.setTableData(this.config.tableId, { rows: [] })
                        this.setDefaultValue();
                    }
                }
            }
        })} , {[formId]:'form',[tableId]:'cardTable'} , 'card' )
    }

    //删除单据
    delConfirm = () => {
        ajax({
            url: urls.deladdressUrl,
            data: {
                id: this.props.getUrlParam('id'),
                ts: this.props.form.getFormItemsValue(this.config.formId, 'ts').value
            },
            success: (res) => {
                if (res) {
                    let id =this.props.getUrlParam('id');
                    let nextId = getNextId(id, AddDatasource);
                    deleteCacheById(pk_item,id,AddDatasource);
                    toast({ color: 'success', title: this.state.json['10140ADRB-000008'] });/* 国际化处理： 删除成功！*/
                    if(nextId){
                        this.props.setUrlParam({status:'browse',id: nextId});
                        this.getdata(nextId);
                    }else{
                        this.props.pushTo("/list",{
                            pagecode:this.props.config.pageListCode,
                        });
                    }
                }
            }
        });
    };

    modelSave = (props)=>{
        props.cardTable.closeModel(this.config.tableId);
        this.saveClick();
    }

    afterEvent=(props, moduleId , key,  value, oldValue, data)=>{
        switch(key){
            case 'country':
                props.form.setFormItemsDisabled(moduleId,{'province':value.value==null?true:false})
                if(value.value==null){
                    props.form.setFormItemsDisabled(moduleId,{'city':true,'region':true})
                }
                props.form.setFormItemsValue(this.config.formId,{'province':{value:null,display:null},'city':{display:null,value:null},'region':{display:null,value:null}});
                break;
            case 'province':
                props.form.setFormItemsDisabled(moduleId,{'city':value.value==null?true:false})
                if(value.value==null){
                    props.form.setFormItemsDisabled(moduleId,{'region':true})
                }
                props.form.setFormItemsValue(this.config.formId,{'city':{display:null,value:null},'region':{display:null,value:null}});
                break;
            case 'city':
                props.form.setFormItemsDisabled(moduleId,{'region':value.value==null?true:false})
                props.form.setFormItemsValue(this.config.formId,{'region':{display:null,value:null}});
                break;
            case 'enablestate':
                let requestParam = {
                    pk:props.form.getAllFormValue(moduleId).rows[0].values['pk_addressdoc'].value,
                    enablestate:value.value?'2':'3',
                    ts:props.form.getAllFormValue(moduleId).rows[0].values['ts'].value,
                    nodeType:this.config.nodeType,
                    moduleid:this.config.formId,
                    pagecode:this.config.pageCode
                };
                ajax({
                    url: urls.validateUrl,
                    data: {
                        pk: props.getUrlParam('id'),
                        nodeType: this.config.nodeType,
                        type:value.value?"enable":"disable"
                    },
                    success: (res) => {
                        ajax({
                            url:urls.enablestateUrl,
                            data:requestParam,
                            success:(result)=>{
                                showFormular(this.props,res,{
                                    "head" : "form",
                                    "linkmanvos":"cardTable",
                                });
                                if (result.data.head) {
                                    result.data.head[this.config.formId].rows.forEach(function(item, index, array){
                                        //是否其中转换成开关
                                        if (item.values['enablestate'].value === '2') {
                                            item.values['enablestate'].value = true;
                                        } else if (item.values['enablestate'].value === '3'){
                                            item.values['enablestate'].value = false;
                                        }
                                    });
                                    this.props.form.setAllFormValue({ [this.config.formId]: result.data.head[this.config.formId] });
                                    let project_code = result.data.head[this.config.formId].rows[0].values[pk_value].value;
                                    this.setState({project_code});
                                }
                                updateCache(pk_item,requestParam.pk,{head:result.data.head,carddate:result.data},this.config.formId,AddDatasource);
                                if (result.data.body) {
                                    this.props.cardTable.setTableData(this.config.tableId, result.data.body[this.config.tableId]);
                                }
                                this.toggleShow();
                                toast({title:value.value?this.state.json['10140ADRB-000009']:this.state.json['10140ADRB-000010']});/* 国际化处理： 启用成功！,停用成功！*/
                            }
                        });
                    },
                    error:(res)=>{
                        toast({content:res.message,color:"warning"});
                        props.form.setFormItemsValue(this.config.formId, {'enablestate': {value: !value.value}});
                    }
                })

                break;
        }
        this.state.isedit =!this.state.isedit;
        this.setState(this.state)
    }

    //获取列表肩部信息
    getTableHead = () => {
        let {button} = this.props;
        let { createButtonApp } = button;
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'table-header-button',
                        buttonLimit: 5,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.table-header-button')

                    })}
                    {this.props.cardTable.createBrowseIcons(this.config.tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                    {/* {createButton("deleteline", {
						name: '删行',
						onButtonClick: buttonClick.bind(this)
					})} */}
                </div>
            </div>
        )
    }

    //联系人模态框
    createLinkmanForm = ()=>{
        const{form} = this.props;
        const{createForm} = form;
        return (
            <div>
                <div className="nc-bill-form-area">
                    {createForm(linkman, {
                        onAfterEvent: this.modalAfterEvent.bind(this)
                    })}
                </div>

            </div>
        )
    }

    modalAfterEvent=()=>{

    }

    linkadd=(props)=>{
        props.form.setFormStatus(linkman,'edit');
        props.modal.show('linkmanModal',{
            userControl:true,
            beSureBtnClick:()=>{
                let flag = this.props.form.isCheckNow(linkman);
                if(!flag)return
                let lmdata = props.form.getAllFormValue(linkman);
                lmdata["areacode"] = linkman;
                this.props.validateToSave( {"model" : lmdata,"pageid":this.config.pageCode} , ()=>{
                    ajax({
                        url:urls.saveLinkman,
                        data:{
                            'pageid':this.config.pageCode,
                            'gridModel':lmdata
                        },
                        success:(res)=>{
                            let{success,data} =res;
                            if(success){
                                if(data){
                                    props.modal.close('linkmanModal')
                                    let len = props.cardTable.getNumberOfRows(tableId);
                                    //联系人新增成功，回显子表数据
                                    props.cardTable.addRow(tableId,len,{

                                        'pk_linkman':{
                                            value:data
                                        },
                                        'pk_linkman.name':lmdata.rows[0].values.name,
                                        'pk_linkman.sex':lmdata.rows[0].values.sex,
                                        'pk_linkman.vjob':lmdata.rows[0].values.vjob,
                                        'pk_linkman.phone':lmdata.rows[0].values.phone,
                                        'pk_linkman.cell':lmdata.rows[0].values.cell,
                                    });
                                }
                            }
                        }
                    });
                } , {"10140LM":'form'} , 'form' )
            },
            cancelBtnClick:()=>{
                props.form.EmptyAllFormValue(linkman);
                props.modal.close('linkmanModal')
                return;
            },
            closeModalEve:()=>{
                props.form.EmptyAllFormValue(linkman);
                props.modal.close('linkmanModal')
                return;
            },
        })
    }

    formu=(res) => {
        if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
            this.props.dealFormulamsg(
                res.formulamsg,  //参数一：返回的公式对象
                {                //参数二：界面使用的表格类型
                    tableId:'cardTable'
                }
            );
        }
    }

    render() {
        if(!this.state.json)
            return '';
        let { cardTable, form, button, modal, cardPagination, BillHeadInfo } = this.props;
        const {createCardPagination} = cardPagination;
        const {createBillHeadInfo} = BillHeadInfo;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createModal } = modal;
        let {project_code,stated} = this.state;
        return (
            <div  className='nc-bill-card'>
                <div className="nc-bill-top-area">
                    <NCAffix>
                    <NCDiv className='nc-bill-header-area' areaCode={NCDiv.config.HEADER}>
                        <div className='header-title-search-area' style={this.state.stated === 'browse' ? {} : {marginLeft: 8}}>
                            {createBillHeadInfo(
                                {
                                    //title-search-detail
                                    title: this.state.json[this.config.title],
                                    backBtnClick: this.buttonClick.bind(this,this.props,'back'),
                                    initShowBackBtn: this.state.stated === 'browse'
                                }
                            )}
                        </div>
                        <span className="bill-info-code" style={{fontSize: '16px',
                            marginLeft: '8px',
                            lineHeight: '32px',
                            verticalAlign: 'baseline'}}>{(stated=='browse' && project_code) ?`: ${project_code}`:""}</span>
                        <div className="header-button-area header-button-area-print-btn">
                            {createButtonApp({
                                area: 'card-header-button',
                                buttonLimit: 3,
                                onButtonClick: this.buttonClick.bind(this),
                                popContainer: document.querySelector('.card-header-button')

                            })}
                        </div>
                        <div className='header-cardPagination-area' style={{float:'right'}}>
                            {this.props.getUrlParam('id')&&createCardPagination({
                                handlePageInfoChange: this.pageInfoClick.bind(this),
                                dataSource: AddDatasource
                            })}
                        </div>
                    </NCDiv>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.config.formId, {
                            onAfterEvent: this.afterEvent.bind(this)
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createCardTable(this.config.tableId, {
                            tableHead: this.getTableHead.bind(this),
                            modelSave: this.modelSave.bind(this),
                            tableModelConfirm: this.tableModelConfirm,
                            showIndex:true,
                        })}
                    </div>
                </div>
                {createModal('delete', {
                    title: this.state.json['10140ADRB-000012'],/* 国际化处理： 注意*/
                    content: this.state.json['10140ADRB-000013'],/* 国际化处理： 确认删除？*/
                    beSureBtnClick: this.delConfirm.bind(this)
                })}
                {createModal('linkmanModal',{
                    title:this.state.json['10140ADRB-000014'],/* 国际化处理： 联系人*/
                    size:'lg',
                    content:this.createLinkmanForm()

                })}
                {createModal('modal',{noFooter:false})}
                <PrintOutput
                    ref='printOutput'
                    url= {urls['print']}
                    data={{
                        funcode:this.props.config.appcode,
                        nodekey:'addresscard',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
            </div>

        );
    }
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65