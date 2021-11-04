//VLU7hJ5wMGG0eDnpz67THjjQxUda0tjr1XJ9BJVh1sU99gbn2mWK7X0wLkTw4JMR
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast ,high,promptBox} from 'nc-lightapp-front';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import Utils from "../../../public/utils";
const {showFormular } = Utils;
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix  } = base;
const { NCTabs,NCCol } = base;
const NCTabPane = NCTabs.NCTabPane;
const { Refer } = high;
const { NCDiv } = base;

const pageId = '10140MPF_tabs_card';//页面id
const appid = '0001Z010000000002X08';//注册按钮的id
let urls={
    queryCardDataUrl:'/nccloud/uapbd/materialpf/queryMaterialpfTabsData.do',
    saveTabsDataUrl:'/nccloud/uapbd/materialpf/saveMaterialpfTabsData.do'
};


class Materialpftabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableId:this.props.config.tableId || null,
            json:{},
            inlt:null
        }
        this.moduleId = '3630';
        this.pageId = pageId;
        this.appid = appid;
        this.config =Object.assign({
            pk:null,
            moduleId:null,
            formId:null,
            tableId:null,
            state:"browse",
            billstatus:-1,
            pk_org:null,
            pk_measdocarr:[],
            nomatpf:false
        },props.config);
        this.initTemplate(this.props, () => {
            this.getData(()=>{
                if(this.config.formId=='stock'){
                    let flag = this.props.form.getFormItemsValue(this.config.formId,'serialmanaflag').value
                    this.props.form.setFormItemsDisabled(this.config.formId,{'issinglcheck':!flag})
                }else if(this.config.formId=='prod'){
                    let flag = this.props.form.getFormItemsValue(this.config.formId,'conversemethod').value
                    this.props.form.setFormItemsDisabled(this.config.formId,{'converstime':flag==1})
                    let sfcbdx = this.props.form.getFormItemsValue(this.config.formId,'sfcbdx').value
                    this.props.form.setFormItemsDisabled(this.config.formId,{'sfcbdxtype':!sfcbdx})
                    let isuseroad = this.props.form.getFormItemsValue(this.config.formId,'isuseroad').value
                    this.props.form.setFormItemsDisabled(this.config.formId,{'azcbzxtjcl':!isuseroad})
                }else if(this.config.formId=='plan'){
                    let combineflag = this.props.form.getFormItemsValue(this.config.formId,'combineflag').value
                    this.props.form.setFormItemsDisabled(this.config.formId,{'materialreqcombintype':!combineflag})
                    this.props.form.setFormItemsDisabled(this.config.formId,{'reqcombmoment':!combineflag})
                    this.props.form.setFormItemsDisabled(this.config.formId,{'fixcombinreqday':!combineflag})
                    let reqcombmoment = this.props.form.getFormItemsValue(this.config.formId,'reqcombmoment').value
                    this.props.form.setFormItemsDisabled(this.config.formId,{'numofcombindays':!reqcombmoment})
                }
            });
        });
    }

    initTemplate = (props, callback) =>{
        createUIDom(props)(
            {
                pagecode: pageId,appcode: "10140MPF"
            },
            {
                moduleId: "10140MPF",domainName: 'uapbd'
            },
            (data, langData,inlt)=>{
                if(langData){
                    this.state.json = langData
                    if(inlt){
                        this.state.inlt = inlt
                    }
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        if(meta.formrelation){
                            meta.formrelation['prod'] = ["producecost","prod-audit"]
                        }
                        this.modifierMeta(props, meta);
                        props.meta.setMeta(meta);
                    }
                    if(data){
                        if(!this.config.nomatpf){
                            let button = data.button;
                            props.button.setButtons(button);
                        }
                    }
                    callback&&callback()
                }
            }
        )
    }
    componentWillMount(){

    }
    componentDidMount() {

    }

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

    modifierMeta=(props, meta)=> {
        if(this.config.tableId!=null){
            let porCol = {
                attrcode: 'opr',
                // label: multiLang && multiLang.get('36300TP-0005'),
                label: this.state.json['10140MPF-000010'],/* 国际化处理： 操作*/
                fixed: 'right',
                itemtype: 'customer',
                visible: true,
                width:'200px',
                render:(text, record, index) => {
                    let status = props.cardTable.getStatus(props.config.tableId);
                    const btnArray = status === 'browse' ?[]:["delline"];
                    return props.button.createOprationButton(
                        btnArray,
                        {
                            area: "table-opr-button",
                            buttonLimit: 3,
                            onButtonClick: (props, id ) => this.tableButtonClick(props, id, text, record, index)
                        }
                    );
                }
            };
            meta[this.config.tableId].items.push(porCol);
        }
        //采购
        meta['pu']&&meta['pu'].items.map((item)=>{
            if(item.attrcode == 'pk_cumandoc'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
        })
        //销售
        meta['sale']&&meta['sale'].items.map((item)=>{
            if(item.attrcode == 'pk_marsaleclass'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
        })
        //销售子表捆绑件
        meta['materialbindle']&&meta['materialbindle'].items.map((item)=>{
            if(item.attrcode == 'pk_bindle'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
        })
        //库存
        meta['stock']&&meta['stock'].items.map((item)=>{
            if(item.attrcode == 'sernumunit'){
                item.queryCondition=()=>{
                    return {
                        pk_measdoc : JSON.stringify(this.config.pk_measdocarr),
                        GridRefActionExt:'nccloud.web.uapbd.material.action.MeasdocDefaultGridRefExt'
                    }
                }
            }
            if(item.attrcode === 'pk_stordoc'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
            if(item.attrcode === 'pk_marpuclass'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
        })
        //库存子表仓库
        meta['materialwarh']&&meta['materialwarh'].items.map((item)=>{
            if(item.attrcode === 'pk_stordoc'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
        })
        //生产信息
        meta['prod']&&meta['prod'].items.map((item)=>{
            if(item.attrcode === 'pk_prodeptdoc'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
            if(item.attrcode === 'pk_propsndoc'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
        })
        //生产成本
        meta['producecost']&&meta['producecost'].items.map((item)=>{
            if(item.attrcode === 'pk_marcostclass'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
            if(item.attrcode === 'disbearfactory'){
                item.queryCondition=()=>{
                    return {
                        pk_org:this.config.pk_org,
                        GridRefActionExt: 'nccloud.web.uapbd.material.materialpf.action.MaterialpffactoryTreeGridRefExt'
                    }
                }
            }
            if(item.attrcode === 'disbrcostctr'){
                item.refName = this.state.json['10140MPF-000041']/* 国际化处理： 成本中心*/
            }
        })
        //计划信息
        meta['plan']&&meta['plan'].items.map((item)=>{
            if(item.attrcode === 'pk_prodfactory'){
                item.queryCondition=()=>{
                    return {
                        AppCode:'10140MPF',
                        orgType:'STOCKPLANTYPE0000000',
                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                }
            }
            if(item.attrcode === 'planstrategygroup'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
        })
        //替换件
        meta['materialrepl']&&meta['materialrepl'].items.map((item)=>{
            if(item.attrcode === 'pk_replace'){
                item.queryCondition=()=>{
                    return {pk_org:this.config.pk_org}
                }
            }
        })

        return meta;
    }

    tableButtonClick(props, id, text, record, index){
        switch(id){
            case "delline"://删除行
                props.cardTable.delRowsByIndex(this.config.tableId, index);
                break;
            default:
                break;
        }
    }

    //按钮点击事件
    buttonClick=(props, id)=>{
        switch(id){
            case "edit":
                this.toggleShow("edit");
                break;
            case "refresh":
                this.getData(()=>{
                    toast({title:this.state.json['10140MPF-000013'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case "save":
                this.saveBill();
                break;
            case "cancel":
                promptBox({
                    color:"warning",
                    title:this.state.json['10140MPF-000014'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10140MPF-000015'],/* 国际化处理： 是否确认要取消?*/
                    beSureBtnClick:()=>{
                        this.props.form.cancel(this.config.formId);
                        this.config.tableId&&this.props.cardTable.resetTableData(this.config.tableId);
                        this.config.state = "browse",
                            this.toggleShow("browse");
                    },
                    cancelBtnClick:()=>{
                        return;
                    },
                    closeBtnClick:()=>{
                        return;
                    }
                })
                break;
            case "addline":
                if(this.config.tableId == 'materialbindle'){
                    let len = props.cardTable.getNumberOfRows(this.config.tableId);
                    props.cardTable.addRow(this.config.tableId,len, {'pricetype': {display:this.state.json['10140MPF-000043']/* 国际化处理： 使用捆绑价*/,  value:"0"}});
                }else if(this.config.tableId == 'materialrepl'){
                    let len = props.cardTable.getNumberOfRows(this.config.tableId);
                    props.cardTable.addRow(this.config.tableId,len, {'substituterate':{value: '1/1',display:'1/1'}});
                }
                else{
                    let len = props.cardTable.getNumberOfRows(this.config.tableId);
                    props.cardTable.addRow(this.config.tableId,len);
                }
                break;
            default :
                break;
        }
    }

    //保存单据
    saveBill = () => {
        //过滤表格空行
        this.props.cardTable.filterEmptyRows(this.config.tableId);
        let flag = this.props.form.isCheckNow(this.config.formId);
        if(!flag)return
        let formData = this.props.form.getAllFormValue(this.config.formId);
        formData["areacode"] = this.config.formId;
        let CardData = this.props.createExtCardData(this.pageId, this.config.formId, [this.config.tableId]);
        this.props.validateToSave( {
            model : formData,
            pageid : pageId,
        } , ()=>{
            this.props.validateToSave( CardData , ()=>{
                ajax({
                    url: urls.saveTabsDataUrl,
                    data: {
                        pk:this.config.pk,
                        moudleId:this.config.moduleId,
                        formData:{pageid :pageId,
                            model:formData},
                        CardData:CardData,
                    },
                    success: (res) => {
                        if (res.data) {
                            if(res.data[this.config.moduleId]){
                                if(res.data[this.config.moduleId].head){
                                    this.props.form.setAllFormValue({ [this.config.formId]: res.data[this.config.moduleId].head[this.config.formId]});
                                }
                                if(res.data[this.config.moduleId].bodys){
                                    this.props.cardTable.setTableData(this.config.tableId, res.data[this.config.moduleId].bodys[this.config.tableId]);
                                }
                                if(res.data[this.config.moduleId][this.config.formId]){
                                    this.props.form.setAllFormValue({ [this.config.formId]: res.data[this.config.moduleId][this.config.formId]});
                                }
                            }
                        } else {

                        }
                        toast({ color: 'success', title: this.state.json['10140MPF-000024'] });/* 国际化处理： 保存成功！*/
                        this.config.state = "browse"
                        this.toggleShow("browse");
                    }
                });
            } , {[this.config.formId]:'form',[this.config.tableId]:'cardTable'} , 'extcard' )
        } , {[this.config.formId]:'form'} , 'form' )

    };

    //切换页面状态
    toggleShow = (status) => {
        let flag = status === 'browse' ? true : false;
        this.props.button.setButtonVisible(['edit', 'refresh',], flag);
        this.props.button.setButtonVisible(['save','cancel','addline'], !flag);
        this.props.button.setButtonDisabled('edit',this.config.billstatus!=-1);
        this.props.form.setFormStatus(this.config.formId, status );
        this.props.cardTable.setStatus(this.config.tableId, status==='browse'?"browse" :"edit");
    };

    //查询数据
    getData =(callback) =>{
        if(this.config.pk != null){
            let data = { pk: this.config.pk, moduleId: this.config.moduleId };
            let that = this;
            ajax({
                url: urls.queryCardDataUrl,
                data: data,
                success: (res) => {
                    showFormular(this.props,res,{
                        [this.config.formId] : "form",
                        [this.config.tableId] : 'cardTable',
                    });
                    if (res.data) {
                        if(res.data[this.config.moduleId]){
                            if(res.data[this.config.moduleId].head){
                                this.props.form.setAllFormValue({ [this.config.formId]: res.data[this.config.moduleId].head[this.config.formId]});
                            }
                            if(res.data[this.config.moduleId].bodys){
                                this.props.cardTable.setTableData(this.config.tableId, res.data[this.config.moduleId].bodys[this.config.tableId]);
                            }
                            if(res.data[this.config.moduleId][this.config.formId]){

                                this.props.form.setAllFormValue({ [this.config.formId]: res.data[this.config.moduleId][this.config.formId]});
                            }
                        }
                    } else {
                        this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    }
                    callback&&callback();
                    this.toggleShow(this.config.state);
                }
            });
        }
    }

    /*  获取列表肩部信息*/
    getTableHead = (buttons, tableId) => {
        let { createButtonApp } = this.props.button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'table-button-area',
                        buttonLimit: 5,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.table-header-button')

                    })}
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-form-area'
                    })}
                </div>
            </div>
        );
    };

    //表单编辑后事件
    afterEvent = (props, moduleId, key, value,oldValue,ref) =>{
        switch(moduleId){
            case 'stock':
                switch(key){
                    case 'serialmanaflag':
                        if(!value.value){
                            this.props.form.setFormItemsValue([this.config.formId],{'issinglcheck':{value:value.value,display:null}});
                        }
                        this.props.form.setFormItemsDisabled(this.config.formId,{'issinglcheck':!value.value})
                        break;
                }
                break;
            case 'prod':
                switch(key){
                    case 'conversemethod':
                        if(value.value==1){
                            this.props.form.setFormItemsValue([this.config.formId],{'converstime':{value:null,display:null}});
                        }
                        this.props.form.setFormItemsDisabled(this.config.formId,{'converstime':value.value==1})
                        break;
                    case 'sfcbdx':
                        if(!value.value){
                            this.props.form.setFormItemsValue([this.config.formId],{'sfcbdxtype':{value:null,display:null}});
                        }
                        this.props.form.setFormItemsDisabled(this.config.formId,{'sfcbdxtype':!value.value})
                        break;
                    case 'sfcbdxtype':
                        if(value.value!="Sys004"){
                            this.props.form.setFormItemsValue([this.config.formId],{'classfeature':{value:false,display:null}});
                        }
                        this.props.form.setFormItemsDisabled(this.config.formId,{'classfeature':value.value!="Sys004"})
                        break;
                    case 'isuseroad':
                        if(!value.value){
                            this.props.form.setFormItemsValue([this.config.formId],{'azcbzxtjcl':{value:true,display:null}});
                        }
                        this.props.form.setFormItemsDisabled(this.config.formId,{'azcbzxtjcl':!value.value})
                        break;
                    case 'sffzfw':
                        this.props.form.setFormItemsValue([this.config.formId],{'sfcbdxtype':{value:"Sys002",display:null}});
                        this.props.form.setFormItemsDisabled(this.config.formId,{'sfcbdxtype':value.value})
                        break;
                }
                break;
            case 'plan':
                switch(key){
                    case 'combineflag':
                        if(!value.value){
                            this.props.form.setFormItemsValue([this.config.formId],{'materialreqcombintype':{value:null,display:null}});
                            this.props.form.setFormItemsValue([this.config.formId],{'reqcombmoment':{value:null,display:null}});
                            this.props.form.setFormItemsValue([this.config.formId],{'fixcombinreqday':{value:null,display:null}});
                            this.props.form.setFormItemsValue([this.config.formId],{'numofcombindays':{value:null,display:null}});
                        }
                        this.props.form.setFormItemsDisabled(this.config.formId,{'materialreqcombintype':!value.value})
                        this.props.form.setFormItemsDisabled(this.config.formId,{'reqcombmoment':!value.value})
                        this.props.form.setFormItemsDisabled(this.config.formId,{'fixcombinreqday':!value.value})
                        this.props.form.setFormItemsDisabled(this.config.formId,{'numofcombindays':!value.value})
                        break;
                    case 'reqcombmoment':
                        this.props.form.setFormItemsDisabled(this.config.formId,{'numofcombindays':!value.value})
                        break;
                }
                break;
        }
    }

    //表格编辑后事件
    tableAfterEvent =(props, moduleId, key, value,changedrows,index,record)=>{
        switch(moduleId){
            case 'materialbindle':
                if(key === 'pk_bindle'){
                    if(value.refname && value.values){
                        props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_bindle.name' :{value: value.refname,display: value.refname},
                            'pk_bindle.materialspec':{value:value.values.materialspec.value,display:value.values.materialspec.value},
                            'pk_bindle.materialtype':{value:value.values.materialtype.value,display:value.values.materialtype.value},
                            'pk_bindle.pk_measdoc':{value:value.values.pk_measdoc.value,display:value.values.measdoc_name.value}
                        });
                    }else{
                        props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_bindle.name' :{value: null,display: null},
                            'pk_bindle.materialspec':{value: null,display: null},
                            'pk_bindle.materialtype':{value: null,display: null},
                            'pk_bindle.pk_measdoc':{value: null,display: null}
                        });
                    }

                }
                break;
            case 'materialrepl':
                if(key === 'pk_replace'){
                    if(value.values){
                        props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_replace.version' :{value:value.values.version.value,display:value.values.version.value}
                        });
                    }else{
                        props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_replace.version' :{value: null,display: null},
                        });
                    }
                }else if(key=='substituterate'){
                    if(!value || value === ''){
                        return;
                    }
                    var reg = new RegExp('^([1-9]+\\d*)/([1-9]+\\d*)$');
                    if(!reg.test(value)){
                        toast({content:this.state.json['10140MPF-000044']/* 国际化处理： 请录入分数，例如‘1/2’，/两侧为大于0的数值！*/,color:'warning'});
                        props.cardTable.setValByKeyAndRowId(moduleId, record.rowid, 'substituterate', {value: '',display:''});
                    }
                }
                break;
            case 'materialpfcsub':
                if(key === 'pk_liabilitybook'){
                    if(value.refname){
                        props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_liabilitybook.name' :{value: value.refname,display: value.refname}
                        });
                    }else{
                        props.cardTable.setValByKeysAndIndex(moduleId,index,{
                            'pk_liabilitybook.name' :{value: null,display: null}
                        });
                    }
                }
                break;
        }
    }

    render() {
        let { cardTable, form, button, modal, cardPagination,search ,table,BillHeadInfo} = this.props;
        let buttons = this.props.button.getButtons();
        let multiLang = this.props.MutiInit.getIntl(this.moduleId);
        let { createButton, createButtonApp } = button;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        const {createBillHeadInfo} = BillHeadInfo;

        return (
            <div className="nc-bill-extCard">
                <NCAffix>
                    <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                        <div className="header-button-area">
                            {createButtonApp({
                                area: 'header-button-area',
                                buttonLimit: 3,
                                onButtonClick: this.buttonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')

                            })}
                        </div>
                    </NCDiv>
                </NCAffix>
                <div className="nc-bill-form-area">
                    {createForm(this.config.formId, {
                        onAfterEvent: this.afterEvent.bind(this)
                    })}
                </div>
                <div className="nc-bill-table-area">
                    {createCardTable(this.config.tableId, {
                        tableHead: this.getTableHead.bind(this, buttons, this.config.tableId),
                        modelSave: this.saveBill,
                        onAfterEvent:this.tableAfterEvent.bind(this),
                        showIndex: true
                    })}
                </div>
            </div>
        );
    }
}

const tableId2 = 'fi';//财务
const tableId3 = 'pfc';//利润中心npm ru
const tableId4 = 'pu';//采购
const tableId5 = 'sale';//销售
const tableId6 = 'stock';//库存
const tableId7 = 'plan';//计划
const tableId8 = 'prod';//生产信息

export default Materialpftabs = createPage({
    billinfo:[{
        billtype: 'form',
        pagecode: "10140MPF_tabs_card",
        headcode: 'fi'
    },{
        billtype: 'card',
        pagecode: "10140MPF_tabs_card",
        headcode: 'pfc',
        bodycode: 'materialpfcsub',
    },{
        billtype: 'form',
        pagecode: "10140MPF_tabs_card",
        headcode: 'pu'
    },{
        billtype: 'card',
        pagecode: "10140MPF_tabs_card",
        headcode: 'sale',
        bodycode: 'materialbindle',
    },{
        billtype: 'card',
        pagecode: "10140MPF_tabs_card",
        headcode: 'stock',
        bodycode: 'materialwarh',
    },{
        billtype: 'card',
        pagecode: "10140MPF_tabs_card",
        headcode: 'plan',
        bodycode: 'materialrepl',
    },{
        billtype: 'form',
        pagecode: "10140MPF_tabs_card",
        headcode: 'prod'
    }]
})(Materialpftabs);



//VLU7hJ5wMGG0eDnpz67THjjQxUda0tjr1XJ9BJVh1sU99gbn2mWK7X0wLkTw4JMR