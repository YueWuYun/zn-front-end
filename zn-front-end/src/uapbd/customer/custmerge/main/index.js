//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ajax, base, createPage, toast,createPageIcon} from 'nc-lightapp-front';
import {filterResult} from '../../../public/utils'
import XTable from "../mergecompon/xh_table.js"
import Sourcecust from "../mergecompon/sourcecust.js"
import AssignStepModal from '../mergecompon/AssignStepModal.js';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import utils from '../../../public/utils';
import './index.less';
const {showFormular } = utils;

const { NCCol,NCMessage } = base;

const searchid = 'custmergeQryTmp';
const tableid = 'custmerge';
const formid = 'custmergequery';
const pagecode = '1317CUME_list';
const appcode = '1317CUME';
const oid = '1002Z01000000000DJOL';
let sysModalId = 'sysModal';//体系编辑模态窗id
const urls = {
    query : '/nccloud/uapbd/custmerge/querymergecustomer.do',
    compare:'/nccloud/uapbd/custmerge/comparecustomer.do',
    merge:'/nccloud/uapbd/custmerge/mergecustomer.do'
};


class SingleTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state={
            searchValue:'',
            curOrg:null,
            sourcecustomer:null,
            targetcustomer:null,
            formConfig:null,
            formConfig2:null,
            StepConfig:null,
            json:{},
            inlt:null
        }
        this.initTemplate(this.props);
    }


    componentWillMount() {}

    componentDidMount() {}

    componentDidUpdate(){}

    //获取并初始化模板
    initTemplate = (props,callback) => {
        createUIDom(props)(
            {
                pagecode: pagecode
            },
            {
                moduleId: "1317CUME",domainName: 'uapbd'
            },
            (data,langData,inlt)=>{
                if(langData){
                    this.state.json = langData
                    if(inlt){
                        this.state.inlt = inlt
                    }
                }
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        this.modifierMeta(props, meta);
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    callback && callback();
                }
            }
        )
    }

    //对表格模板进行加工操作
    modifierMeta = (props,meta)=> {
        meta[formid].status = "edit";
        meta[formid].items.map((item, key) => {
            if (item.attrcode == "pk_org") {
                item['disabled']=false;
                item.queryCondition=()=>{
                    return {
                        TreeRefActionExt: 'nccloud.web.uapbd.customer.custmerge.action.BusinessUnitTreeExt'
                    }
                }
            }
            if (item.attrcode == "pk_source") {
                item['refcode']='uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
                item['disabled']=true;
                item.queryCondition=()=>{
                    return {
                        pk_org:props.form.getFormItemsValue(formid,'pk_org').value,
                        GridRefActionExt: 'nccloud.web.uapbd.customer.custmerge.action.CustomerDefaultTreeGridExt'
                    }
                }
            }
            if (item.attrcode == "pk_target") {
                item['refcode']='uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
                item['disabled']=true;
                item.queryCondition=()=>{
                    return {
                        pk_org:props.form.getFormItemsValue(formid,'pk_org').value,
                        GridRefActionExt: 'nccloud.web.uapbd.customer.custmerge.action.CustomerDefaultTreeGridExt'
                    }
                }
            }
        });
        meta[searchid].items.map((item, key) =>{
            if (item.attrcode == "pk_target") {
                item.isMultiSelectedEnabled = true;
            }
            if (item.attrcode == "source_org") {
                item.isMultiSelectedEnabled = true;
                item.queryCondition=()=>{
                    return {
                        TreeRefActionExt: 'nccloud.web.uapbd.customer.custmerge.action.BusinessUnitTreeExt'
                    }
                }
            }
            if (item.attrcode == "pk_target.code") {
                item['refcode']='uapbd/refer/customer/CustomerDefaultTreeGridRef/index.js';
                item.isMultiSelectedEnabled = true;
            }
            if (item.attrcode == "operator") {
                item.isMultiSelectedEnabled = true;
            }
            if (item.attrcode == "pk_target.pk_org") {
                item.isMultiSelectedEnabled = true;
                item.queryCondition=()=>{
                    return {
                        TreeRefActionExt: 'nccloud.web.uapbd.customer.custmerge.action.BusinessUnitTreeExt'
                    }
                }
            }
        })
        return meta;
    }

    //列表双击事件
    onRowDoubleClick(record,index){
        let pk_custmerge = record.pk_custmerge.value;
        let formConfig ={
            pk_custmerge :pk_custmerge,
        }
        this.props.modal.show("source",{
            title:this.state.json['1317CUME-000000'],/* 国际化处理： 源客户基本信息*/
            content:<Sourcecust config={formConfig} />,
            noFooter : true, //是否需要底部按钮,默认true
            beSureBtnClick:()=>{
                this.props.modal.close("source");
            },
            cancelBtnClick:()=>{
                return;
            },
        });

    }

    //按钮点击事件
    buttonClick(props,id) {
        switch (id) {
            case "merge":
                if(!(this.state.sourcecustomer&&this.state.sourcecustomer.hasOwnProperty('value'))||!(this.state.targetcustomer&&this.state.targetcustomer.hasOwnProperty('value'))){
                    //NCMessage.create({content: '源客户或目的客户不能为空.', color: 'warning', position: 'bottom'});
                    toast({content: this.state.json['1317CUME-000001'],color: 'warning'});/* 国际化处理： 源客户或目的客户不能为空.*/
                    return;
                }
                if(this.state.sourcecustomer.value == this.state.targetcustomer.value){
                    //NCMessage.create({content: '源客户与目的客户不能相同.', color: 'warning', position: 'bottom'});
                    toast({content: this.state.json['1317CUME-000002'],color: 'warning'});/* 国际化处理： 源客户与目的客户不能相同.*/
                    return;
                }
                let data={
                    pk_source:this.state.sourcecustomer.value,  //源客户
                    pk_target:this.state.targetcustomer.value  //目的客户
                }
                ajax({
                    url: urls.compare,
                    data: data,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if(data){
                                let jbsource = data["jbsource"];
                                let jbtarget = data["jbtarget"];
                                let i = 0;
                                let num = 1;
                                let data2 = [];
                                if(data["cwsource"]&&data["cwtarget"]){
                                    let cwsource = data["cwsource"];
                                    let cwtarget = data["cwtarget"];
                                    let length = cwsource.length>cwtarget.length?cwsource.length:cwtarget.length;
                                    for(i;i<length;i++){
                                        if(cwsource.length<=i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000003'], c: '', d: cwtarget[i].finaname, key: num })/* 国际化处理： 客户财务信息*/
                                            num += 1;
                                        }
                                        if(cwtarget.length<=i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000003'], c: cwsource[i].finaname, d: '', key: num })/* 国际化处理： 客户财务信息*/
                                            num += 1;
                                        }
                                        if(cwtarget.length>i&&cwsource.length>i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000003'], c: cwsource[i].finaname, d: cwtarget[i].finaname, key: num })/* 国际化处理： 客户财务信息*/
                                            num += 1;
                                        }
                                    }
                                }
                                if(data["xssource"]&&data["xstarget"]){
                                    let xssource = data["xssource"];
                                    let xstarget = data["xstarget"];
                                    i = 0;
                                    length = xssource.length>xstarget.length?xssource.length:xstarget.length;
                                    for(i;i<length;i++){
                                        if(xssource.length<=i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000004'], c: '', d: xstarget[i].salename, key: num })/* 国际化处理： 客户销售信息*/
                                            num += 1;
                                        }
                                        if(xstarget.length<=i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000004'], c: xssource[i].salename, d: '', key: num })/* 国际化处理： 客户销售信息*/
                                            num += 1;
                                        }
                                        if(xstarget.length>i&&xssource.length>i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000004'], c: xssource[i].salename, d: xstarget[i].salename, key: num })/* 国际化处理： 客户销售信息*/
                                            num += 1;
                                        }
                                    }
                                }
                                
                                if(data["xykzsource"]&&data["xykztarget"]){
                                    let xykzsource = data["xykzsource"];
                                    let xykztarget = data["xykztarget"];
                                    i = 0;
                                    length = xykzsource.length>xykztarget.length?xykzsource.length:xykztarget.length;
                                    for(i;i<length;i++){
                                        if(xykzsource.length<=i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000005'], c: '', d: xykztarget[i].crectname, key: num })/* 国际化处理： 客户信用控制域*/
                                            num += 1;
                                        }
                                        if(xykztarget.length<=i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000005'], c: xykzsource[i].crectname, d: '', key: num })/* 国际化处理： 客户信用控制域*/
                                            num += 1;
                                        }
                                        if(xykztarget.length>i&&xykzsource.length>i){
                                            data2.push({ a: num,  b: this.state.json['1317CUME-000005'], c: xykzsource[i].crectname, d: xykztarget[i].crectname, key: num })/* 国际化处理： 客户信用控制域*/
                                            num += 1;
                                        }
                                    }
                                }
                                
                                let formConfig = {
                                    columns1 : [
                                        { title: ' ', dataIndex: 'a', key: 'a', width: 100},
                                        { title: this.state.json['1317CUME-000040'],  dataIndex: 'b', key: 'b', width: 100  },/* 国际化处理： 源客户*/
                                        { title: this.state.json['1317CUME-000041'], dataIndex: 'c', key: 'c', width: 200  },/* 国际化处理： 目的客户*/
                                    ],
                                    columns2 : [
                                        { title: ' ', dataIndex: 'a', key: 'a', width: 100 },
                                        { title: this.state.json['1317CUME-000018'],  dataIndex: 'b', key: 'b', width: 100 },/* 国际化处理： 组织页签*/
                                        { title: this.state.json['1317CUME-000042'], dataIndex: 'c', key: 'c', width: 200  },/* 国际化处理： 源客户组织*/
                                        { title: this.state.json['1317CUME-000043'], dataIndex: 'd', key: 'd', width: 200  },/* 国际化处理： 目的客户组织*/
                                    ],
                                    data1 : [
                                        { a: this.state.json['1317CUME-000006'],     b: jbsource[0].code, c: jbtarget[0].code, key: '1' },/* 国际化处理： 客户编码*/
                                        { a: this.state.json['1317CUME-000007'],     b: jbsource[0].customername, c: jbtarget[0].customername, key: '2' },/* 国际化处理： 客户名称*/
                                        { a: this.state.json['1317CUME-000008'], b: jbsource[0].custclassname, c: jbtarget[0].custclassname, key: '3' },/* 国际化处理： 客户基本分类*/
                                        { a: this.state.json['1317CUME-000009'],     b: jbsource[0].areaclname, c: jbtarget[0].areaclname, key: '4' },/* 国际化处理： 地区分类*/
                                    ],
                                    data2 : data2,
                                }
                                if(!data["issupplier"]){
                                    this.props.modal.show(sysModalId,{
                                        title:this.state.json['1317CUME-000010'],/* 国际化处理： 客户合并比较*/
                                        content:<XTable config={formConfig} />,
                                        beSureBtnClick:this.onSaveSys.bind(this),
                                        cancelBtnClick:()=>{

                                        }
                                    });
                                }else{
                                    if(data["jbsoursesupplier"]&&data["jbtargetsupplier"]) {
                                        let jbsoursesupplier = data["jbsoursesupplier"];
                                        let jbtargetsupplier = data["jbtargetsupplier"];
                                        let cwsoursesupplier = data["cwsoursesupplier"];
                                        let cwtargetsupplier = data["cwtargetsupplier"];
                                        let cgsoursesupplier = data["cgsoursesupplier"];
                                        let cgtargetsupplier = data["cgtargetsupplier"];
                                        let j = 1;
                                        let data4 = [];
                                        if(data["cwsoursesupplier"]||data["cwtargetsupplier"]) {
                                            i=0;
                                            let len = cwsoursesupplier.length>cwtargetsupplier.length?cwsoursesupplier.length:cwtargetsupplier.length;
                                            for(i;i<len;i++){
                                                if(cwsoursesupplier.length<=i){
                                                    data4.push({ a: j,  b: this.state.json['1317CUME-000011'], c: '', d: cwtargetsupplier[i].finaname, key: '1' })/* 国际化处理： 供应商财务信息*/
                                                    j += 1;
                                                }
                                                if(cwtargetsupplier.length<=i){
                                                    data4.push({ a: j,  b: this.state.json['1317CUME-000011'], c: cwsoursesupplier[i].finaname, d: '', key: '1' })/* 国际化处理： 供应商财务信息*/
                                                    j += 1;
                                                }
                                                if(cwsoursesupplier.length>i&&cwtargetsupplier.length>i){
                                                    data4.push({ a: j,  b: this.state.json['1317CUME-000011'], c: cwsoursesupplier[i].finaname, d: cwtargetsupplier[i].finaname, key: '1' })/* 国际化处理： 供应商财务信息*/
                                                    j += 1;
                                                }
                                            }
                                        }
                                        if(data["cgsoursesupplier"]||data["cgtargetsupplier"]) {
                                            i=0;
                                            let len = cgsoursesupplier.length>cgtargetsupplier.length?cgsoursesupplier.length:cgtargetsupplier.length;
                                            for(i;i<len;i++){
                                                if(cgsoursesupplier.length<=i){
                                                    data4.push({ a: j,  b: this.state.json['1317CUME-000012'], c: '', d: cgtargetsupplier[i].purname, key: '1' })/* 国际化处理： 供应商采购信息*/
                                                    j += 1;
                                                }
                                                if(cgtargetsupplier.length<=i){
                                                    data4.push({ a: j,  b: this.state.json['1317CUME-000012'], c: cgsoursesupplier[i].purname, d: '', key: '1' })/* 国际化处理： 供应商采购信息*/
                                                    j += 1;
                                                }
                                                if(cgsoursesupplier.length>i&&cgtargetsupplier.length>i){
                                                    data4.push({ a: j,  b: this.state.json['1317CUME-000012'], c: cgsoursesupplier[i].purname, d: cgtargetsupplier[i].purname, key: '1' })/* 国际化处理： 供应商采购信息*/
                                                    j += 1;
                                                }
                                            }
                                        }
                                        let sformConfig = {
                                            data1 : [
                                                { a: this.state.json['1317CUME-000013'],     b: jbsoursesupplier[0].suppliercode, c: jbtargetsupplier[0].suppliercode, key: '1' },/* 国际化处理： 供应商编码*/
                                                { a: this.state.json['1317CUME-000014'],     b: jbsoursesupplier[0].suppliername, c: jbtargetsupplier[0].suppliername, key: '2' },/* 国际化处理： 供应商名称*/
                                                { a: this.state.json['1317CUME-000015'],     b: jbsoursesupplier[0].supplierclassname, c: jbtargetsupplier[0].supplierclassname, key: '3' },/* 国际化处理： 供应商基本分类*/
                                                { a: this.state.json['1317CUME-000009'],     b: jbsoursesupplier[0].areaclname, c: jbtargetsupplier[0].areaclname, key: '4' },/* 国际化处理： 地区分类*/
                                            ],
                                            columns1 : [
                                                { title: (<div fieldid='kong'>{' '}</div>), dataIndex: 'a', key: 'a', width: 100},
                                                { title: (<div fieldid='source'>{this.state.json['1317CUME-000016']}</div>),  dataIndex: 'b', key: 'b', width: 100  },/* 国际化处理： 源供应商*/
                                                { title: (<div fieldid='target'>{this.state.json['1317CUME-000017']}</div>), dataIndex: 'c', key: 'c', width: 200  },/* 国际化处理： 目的供应商*/
                                            ],
                                            data2 : data4,
                                            columns2 : [
                                                { title: (<div fieldid='kong1'>{' '}</div>), dataIndex: 'a', key: 'a', width: 100 },
                                                { title: (<div fieldid='org'>{this.state.json['1317CUME-000018']}</div>),  dataIndex: 'b', key: 'b', width: 100 },/* 国际化处理： 组织页签*/
                                                { title: (<div fieldid='sourceorg'>{this.state.json['1317CUME-000019']}</div>), dataIndex: 'c', key: 'c', width: 200  },/* 国际化处理： 源供应商组织*/
                                                { title: (<div fieldid='targetorg'>{this.state.json['1317CUME-000020']}</div>), dataIndex: 'd', key: 'd', width: 200  },/* 国际化处理： 目的供应商组织*/
                                            ]
                                        }
                                        let json = this.state.json;
                                        this.setState({
                                            StepConfig:{formConfig,sformConfig,json}
                                        },()=>{this.assign.show();});
                                    }
                                }
                            }else{

                            }

                        }
                    }
                });

                break;
        }

    }

    //查询区按钮点击事件
    clickSearchBtn(props,searchVal) {
        let pageInfo = props.table.getTablePageInfo(tableid);
        let queryInfo = this.props.search.getQueryInfo(searchid);

        let data={
            querycondition:this.props.search.getAllSearchData(searchid,true),
            pageInfo:pageInfo,
            pagecode: pagecode,
            queryAreaCode:searchid,  //查询区编码
            oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree'
        };
        ajax({
            url: urls.query,
            data: data,
            success: (res) => {
                showFormular(this.props,res,{
                    [tableid] : "SimpleTable",
                });
                let { success, data } = res;
                if (success) {
                    if(data){
                        this.props.table.setAllTableData(tableid, data[tableid]);
                        let count = data[tableid].rows.length;
                        toast({content:this.state.inlt&&this.state.inlt.get('1317CUME-000021',{count:count}),color:'success'})/* 国际化处理： 查询成功，共,条。*/
                    }else{
                        this.props.table.setAllTableData(tableid, {rows:[]});
                        toast({content:this.state.json['1317CUME-000023'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据！*/
                    }
                }
            }
        });
    };

    afterEvent=(props, moduleId , key,  value, oldValue, data)=>{
        switch(key){
            case 'pk_org':
                if(value&&value.value!=null){
                    props.form.setFormItemsDisabled(moduleId,{'pk_source':false,'pk_target':false});
                }
                props.form.setFormItemsValue(moduleId,{'pk_source':{value:null,display:null},'pk_target':{display:null,value:null}});
                this.setState({
                    curOrg:value
                })
                break;
            case 'pk_source':
                this.setState({
                    sourcecustomer:value
                });
                break;
            case 'pk_target':
                this.setState({
                    targetcustomer:value
                });
                break;
        }
    }


    //确认客户合并事件
    onSaveSys(){
        let len = this.props.table.getAllTableData(tableid).rows.length;
        let data={
            pk_source:this.state.sourcecustomer.value,  //源客户
            pk_target:this.state.targetcustomer.value,  //目的客户
            pagecode: pagecode,
        }
        ajax({
            url: urls.merge,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success&&data) {
                    this.assign.cancel();
                    let len = this.props.table.getAllTableData(tableid).rows.length;
                    this.props.form.setFormItemsValue('custmergequery',{'pk_source':{value:null,display:null},'pk_target':{display:null,value:null}});
                    this.state.sourcecustomer = null;
                    this.state.targetcustomer = null;
                    this.props.table.addRow(tableid, data[tableid], len);
                    toast({content:this.state.json['1317CUME-000024']});/* 国际化处理： 客户合并成功！*/
                }
            }
        });
    }


    render() {
        let { table,form, button, search,editTable,modal,SimpleTable } = this.props;
        let { createForm } = form;
        let { createSimpleTable } = table;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let {NCFormControl,NCCheckbox} = base;
        let {createModal} = modal;
        const{ BillHeadInfo}=this.props;
        const{ createBillHeadInfo}=BillHeadInfo
        const{ NCDiv} =base;
        return (
            <div className="nc-bill-list">
                <NCDiv areaCode={NCDiv.config.HEADER} >
                <div className="nc-bill-header-area">
                    <div className="header-title-search-area">
                    {createBillHeadInfo({
                                title: this.state.json['1317CUME-000025'],/* 国际化处理： 客户合并 */
                                initShowBackBtn: false
                                })}
                        {/* {createPageIcon()}
                        <h2 className="title-search-detail">{this.state.json['1317CUME-000025'] 国际化处理： 客户合并}</h2> */}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'list-header-button',
                            buttonLimit: 3,
                            onButtonClick: this.buttonClick.bind(this),
                            popContainer: document.querySelector('.list-header-button')

                        })}
                    </div>
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area uapbd-margin-b-0">
                    {NCCreateSearch(searchid, {
                        clickSearchBtn: this.clickSearchBtn.bind(this),
                    })}
                </div>

                <div className="nc-bill-form-area nc-theme-gray-area-bgc" style={{backgroundColor:"#f6f6f6"}}>
                    {createForm(formid, {
                        onAfterEvent: this.afterEvent.bind(this)
                    })}
                </div>
                <div className="nc-bill-table-area">
                    {createSimpleTable(tableid, {//列表区
                        //onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件
                        onRowDoubleClick: this.onRowDoubleClick.bind(this),                      // 控件的编辑后事件
                        showIndex: true,
                    })}
                </div>
                {/* 模态框 */}
                { createModal(sysModalId,{
                    title:this.state.json['1317CUME-000010'],/* 国际化处理： 客户合并比较*/
                    content:<XTable config={this.state.formConfig} />,
                    beSureBtnClick:this.onSaveSys.bind(this)
                }) }
                { createModal("source",{
                    title:this.state.json['1317CUME-000000'],/* 国际化处理： 源客户基本信息*/
                    content:<Sourcecust config={this.state.formConfig2} />,
                    noFooter : true, //是否需要底部按钮,默认true

                }) }
                <AssignStepModal onFinish={this.onSaveSys.bind(this)} config={this.state.StepConfig} ref={(assign) => this.assign = assign}/>
            </div>
        );
    }
}

SingleTable = createPage({
    billinfo:[{
        billtype: 'grid',
        pagecode: pagecode,
        bodycode: tableid
    },{
        billtype: 'form',
        pagecode: pagecode,
        headcode: formid
    }],
    //initTemplate: initTemplate
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65