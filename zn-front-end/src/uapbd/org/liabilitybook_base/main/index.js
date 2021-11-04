//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {createPage, ajax, base, toast ,print,high,cardCache,promptBox,getBusinessInfo,getMultiLang,createPageIcon,cacheTools} from 'nc-lightapp-front';
const { PrintOutput } = high;
let {getCacheById, updateCache ,addCache,getNextId, deleteCacheById ,setDefData, getDefData} = cardCache;
let businessInfo = getBusinessInfo();
import BatchAdd from '../component/BatchAdd';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from "../../../public/utils";
import Enablemodel from '../component/Enable';
const {showFormular } = Utils;
const { NCDiv } = base;

const searchId = 'liabilitybook_search';
const tableId = 'liabilitybook_list';
const formId = 'liabilitybook_card';
const printlist = 'liabilitybooklist';
const printcard = 'liabilitybookcard';
const batchaddtableedit = 'liabilitybook_batchedit';
const batchaddform = 'liabilitybook_batchcard';
let pagecode = '10100LB_liabilitybook';//页面id
const appcode = '10100LB';//注册按钮的id
const isShowOffEnable = true;		//是否启用“显示停用”功能
const pk_item = "pk_liabilitybook"; //页面数据主键
const linkItem = 'code';
const Datasource = 'uapbd.org.liabilitybook_base.dataSource';
let that,onClickBatch;
let batchOrgs = [];

let urls={
    queryListUrl:"/nccloud/uapbd/liabilitybook/querylist.do",
    delliabilitybookUrl:"/nccloud/uapbd/liabilitybook/delliabilitybook.do",
    queryPageUrl:"/nccloud/uapbd/liabilitybook/querypage.do",
    queryCardDataUrl:"/nccloud/uapbd/liabilitybook/querycard.do",
    queryDefaultDataUrl:"/nccloud/uapbd/liabilitybook/querydefaultdata.do",
    enablestateUrl:"/nccloud/uapbd/liabilitybook/enableliabilitybook.do",
    printurl:"/nccloud/uapbd/liabilitybook/printliabilitybook.do",
    validateUrl:"/nccloud/uapbd/liabilitybook/validateliabilitybook.do",
    saveUrl:"/nccloud/uapbd/liabilitybook/saveliabilitybook.do",
    updateUrl:"/nccloud/uapbd/liabilitybook/updateliabilitybook.do",
    afterEventUrl:"/nccloud/uapbd/liabilitybook/afterevent.do",
    loadorgtreeUrl:"/nccloud/uapbd/liabilitybook/loadorgtree.do",

};

class Liabilitybook extends Component {
    constructor(props) {
        super(props);
        this.searchId = searchId;
        this.tableId = tableId;
        this.formId = formId;
        this.state={
            pks:[],
            showApprInfo:false,
            showOffDisable:false,			//显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff:false,
            billId:null,
            json:{},
            inlt:null,
            listShow:props.getUrlParam('pk_org')?false:true,
            isOpenTo: props.getUrlParam('pk_org')?true:false,
            pk:null,
            status:'browse',
            pk_accperiodscheme:'0001Z000000000000001',
            pk_checkelemsystem:'00001',
            enableopr:true,
        }
        if(props.getUrlParam('pk_org')){//liyfp 用于组织结构图跳转
            this.initTemplate(this.props);
            this.loadOpenToFormByPk(props.getUrlParam('pk_org'));
        }else{
            this.initTemplate(this.props, () => {
                this.clickSearchBtn(this.props,{logic:"and",conditions:[]},true);
            });
        }
    }

    initTemplate =(props, callback) =>{

        createUIDom(props)(
            {
                pagecode: pagecode//页面id
            },
            {
                moduleId: appcode,domainName: 'uapbd'
            },
            (data, langData,inlt)=>{
                if(langData){
                    this.state.json = langData
                    if(inlt){
                        this.state.inlt = inlt
                    }
                }
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta,()=>{
                            if(!this.state.isOpenTo){//liyfp设配组织结构图
                                props.search.setSearchValByField(searchId,"pk_org", {value:businessInfo?businessInfo.groupId:null,display:businessInfo?businessInfo.groupName:null});    
                            }
                        });
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setDisabled({
                            print:true,
                            output:true,
                            delete:true
                        });
                        props.button.setPopContent('list_delete',this.state.json['10100LB-000000']) /* 设置操作列上删除按钮的弹窗提示 */
                    }
                    if(data.context){
                        if(data.context.pk_org&&data.context.org_Name){
                            setDefData("pk_org",Datasource,data.context.pk_org);
                        }
                    }
                    callback && callback();
                }
            }
        )
    }

    modifierMeta = (props, meta) => {
        meta[tableId]&&(meta[tableId].pagination = true);
        meta[tableId].items = meta[tableId].items.map((item, key) => {
            //item.width = 150;
            if (item.attrcode == linkItem) {
                item.render = (text, record, index) => {
                    return (
                        <span
                            style={{color: '#007ace',cursor: 'pointer' }}
                            onClick={() => {
                                this.changetocard('browse',record[pk_item].value)
                            }}
                        >
						{record && record[linkItem] && record[linkItem].value}
					</span>
                    );
                };
            }
            return item;
        });

        meta[searchId].items.map((item)=>{
            if (item.attrcode == "pk_setofbook") {
                item.queryCondition=()=>{
                    return {
                        GridRefActionExt: 'nccloud.web.org.liabilitybook.action.SetOfBookGridRefExt'
                    }
                }
            }
            if (item.attrcode == "pk_liabilityperiod") {
                item.queryCondition=()=>{
                    return {
                        pk_accperiodscheme:this.state.pk_accperiodscheme,
                    }
                }
            }
            if (item.attrcode == "pk_relorg") {
                item.queryCondition=()=>{
                    return {
                        pk_group: businessInfo.groupId
                    }
                }
            }
        })
        meta[formId].items.map((item)=>{
            if (item.attrcode == "pk_relorg") {
                item.queryCondition=()=>{
                    return {
                        pk_group: businessInfo.groupId
                    }
                }
            }
            if (item.attrcode == "pk_setofbook") {
                item.queryCondition=()=>{
                    return {
                        GridRefActionExt: 'nccloud.web.org.liabilitybook.action.SetOfBookGridRefExt'
                    }
                }
            }
            if (item.attrcode == "pk_factorchart") {
                item.queryCondition=()=>{
                    return {
                        pk_factorsystem :this.state.pk_checkelemsystem,
                        isliability:'true'
                    }
                }
            }
        })
        meta['liabilitybook_materialperiod'].items.map((item)=>{
            if (item.attrcode == "pk_materialperiod") {
                item.queryCondition=()=>{
                    return {
                        pk_accperiodscheme:this.state.pk_accperiodscheme,
                    }
                }
            }
        })
        meta['liabilitybook_liability'].items.map((item)=>{
            if (item.attrcode == "pk_liabilityperiod") {
                item.queryCondition=()=>{
                    return {
                        pk_accperiodscheme:this.state.pk_accperiodscheme,
                    }
                }
            }
        })
        meta['liabilitybook_product'].items.map((item)=>{
            if (item.attrcode == "pk_productcostperiod") {
                item.queryCondition=()=>{
                    return {
                        pk_accperiodscheme:this.state.pk_accperiodscheme,
                    }
                }
            }
        })
        meta['liabilitybook_batchcard'].items.map((item)=>{
            if (item.attrcode == "pk_factorchart") {
                item.queryCondition=()=>{
                    return {
                        pk_factorsystem :this.state.pk_checkelemsystem,
                        isliability:'true'
                    }
                }
            }
        })
        meta['liabilitybook_batchedit'].items.map((item)=>{
            if (item.attrcode == "pk_factorchart") {
                item.queryCondition=()=>{
                    return {
                        pk_factorsystem :this.state.pk_checkelemsystem,
                        isliability:'true'
                    }
                }
            }
            if (item.attrcode == "pk_liabilityperiod") {
                item.queryCondition=()=>{
                    return {
                        pk_accperiodscheme:this.state.pk_accperiodscheme,
                    }
                }
            }
        })




        //添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100LB-000025'],/* 国际化处理： 操作*/
            width: 200,
            fixed: 'right',
            className : 'table-opr',
            visible: true,
            itemtype: 'customer',
            render: (text, record, index) => {
                let btnArray = ['list_edit','list_delete'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "tableopr_button",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        });
        return meta;
    }

    tableButtonClick =(props, id, text, record, index)=>{
        switch(id){
            case 'list_edit':
                ajax({
                    url: urls.validateUrl,
                    data: {type:'edit',info:[{
                            id: record[pk_item].value,
                            ts: record.ts.value
                        }]},
                    success: (res) => {
                        this.changetocard('edit',record[pk_item].value)
                    }
                });
                break;
            case 'list_delete':
                ajax({
                    url: urls.validateUrl,
                    data: {type:'delete',info:[{
                            id: record[pk_item].value,
                            ts: record.ts.value
                        }]},
                    success: (res) => {
                        let id = record[pk_item].value;
                        ajax({
                            url: urls.delliabilitybookUrl,
                            data: {deleteinfo:[{
                                    id: record[pk_item].value,
                                    ts: record.ts.value
                                }]},
                            success: (res) => {
                                if (res.success&&res.data) {
                                    toast({color: 'success', title: this.state.json['10100LB-000004']});/* 国际化处理： 删除成功！*/
                                    props.table.deleteCacheId(tableId,id);
                                    let allpks = cacheTools.get('allpks');
                                    let newAllPks = allpks.filter((pk)=>{
                                        let flag = true;
                                        if(pk==id){
                                            flag = false;
                                        }
                                        return flag;
                                    })
                                    cacheTools.set('allpks',newAllPks);
                                    props.table.deleteTableRowsByIndex(tableId, index);
                                }}
                        });
                    }
                });
                break;
            default:
                console.log(id, index);
                break;

        }
    }



    changetocard(status,id){
        this.state.status = status;
        this.state.listShow = false;
        this.props.button.setDisabled({
            Delete:false,
            Print:false,
            Output:false,
            Enable:false,
            Disable:false
        });
        this.setState(this.state,()=>{
            this.getData(status,id,false)
        })

    }

    changetolist(){
        this.state.pk = null;
        this.state.status = 'browse'
        this.state.listShow = true;
        this.setState(this.state,()=>{
            this.clickSearchBtn(this.props,null,true);
        });
    }


    buttonClick(props, id) {
        let rowsdata = {};
        let formdata = {};

        //得到选中的行或卡片态的数据  所有的处理都用此数据        格式：rows
        let selectedRows = [];
        if(this.state.listShow){
            rowsdata = props.table.getCheckedRows(tableId);
            rowsdata.map((ele) => {
                selectedRows.push(ele.data);
                ele.data.index = ele.index;
            });
        }else{
            formdata = props.form.getAllFormValue(formId);
            selectedRows.push(formdata.rows[0])
        }
        let paramData = {
            'pageid': pagecode,
            'gridModel': {
                'pageinfo': {},
                'areacode': tableId,
                'rows': selectedRows
            }
        }
        //记录不进行改变的原始数据
        let oriData = selectedRows.length>0?Utils.clone(selectedRows[0].values):[];

        switch (id) {
            case 'Add':
                this.state.listShow = false;
                this.state.status = "add";
                this.props.button.setDisabled({
                    Delete:false,
                    Print:false,
                    Output:false,
                    Enable:false,
                    Disable:false
                });
                this.setState(this.state,()=>{
                    this.setDefaultValue("add");
                })
                break;
            case 'Edit':
                ajax({
                    url: urls.validateUrl,
                    data: {type:'edit',info:[{
                            id: this.props.form.getFormItemsValue(this.formId,pk_item).value,
                            ts: this.props.form.getFormItemsValue(this.formId,'ts').value
                        }]},
                    success: (res) => {
                        this.changetocard('edit',this.props.form.getFormItemsValue(this.formId,pk_item).value)
                    }
                });
                break;
            case 'Cancel':
                promptBox({
                    color:"warning",
                    title:this.state.json['10100LB-000010'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10100LB-000011'],/* 国际化处理： 是否确认要取消?*/
                    beSureBtnClick:()=>{
                        let lastpk = null;
                        let cachePk = cacheTools.get('allpks');
                        if(cachePk&&cachePk.length>0){
                            lastpk = cachePk[cachePk.length-1]
                        }
                        let id = this.state.pk!=null?this.state.pk:lastpk
                        if(!id){
                            props.form.cancel(this.formId);
                            this.props.button.setButtonVisible(['Add','Batchadd','back',], true);
                            this.props.button.setButtonVisible(['Save','Saveadd','Cancel','Edit','Delete','Enable','Disable','Openca','Print','Output','Refresh'], false);
                            this.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:true});
                            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
							this.props.form.EmptyAllFormValue(formId);
                            this.props.form.setFormStatus(formId, status);
                        }else{
                            this.changetocard("browse",id)
                        }
                    },
                    cancelBtnClick:()=>{
                        return;
                    },
                    closeBtnClick:()=>{
                        return;
                    }
                })
                break;
            case 'Save':
                this.savebill()
                break;
            case 'Saveadd':
                this.savebilladd()
                break;
            case 'Refresh':
                this.state.listShow?
                this.refreshAction(props,()=>{
                    toast({title:this.state.json['10100LB-000006'],color:'success'})/* 国际化处理： 刷新成功！*/
                }):this.getData("browse",this.state.pk,true,()=>{
                        toast({title:this.state.json['10100LB-000006'],color:'success'})/* 国际化处理： 刷新成功！*/
                    });
                break;
            case 'Delete':
                ajax({
                    url: urls.validateUrl,
                    data: this.state.listShow?this.getvalecheckdatapk(id):{type:'delete',info:[{
                            id: this.props.form.getFormItemsValue(this.formId,pk_item).value,
                            ts: this.props.form.getFormItemsValue(this.formId,'ts').value
                        }]},
                    success: (res) => {
                        promptBox({
                            color:"warning",
                            title: this.state.json['10100LB-000007'],/* 国际化处理： 确定删除*/
                            content: this.state.json['10100LB-000008'],/* 国际化处理： 您确定要删除所选数据吗?*/
                            beSureBtnClick: this.deleteAction.bind(this)
                        });
                    }
                });
                break;
            case 'Enable':
                this.enableFun(props,selectedRows,oriData,'0');
                break;
            case 'Disable':
                this.enableFun(props,selectedRows,oriData,'1');
                break;
            case "Print":
                let printParam={
                    funcode: "10100LB",
                    nodekey: this.state.listShow?printlist:printcard,
                    outputType:'print'
                };
                this.pintFunction(printParam);
                break;
            case 'Output':
                let pks = [];
                let userjson;
                if(this.state.listShow){
                    let allDatas = this.props.table.getAllTableData(this.tableId);
                    allDatas.rows.forEach((item,index)=>{
                        pks.push(item.values[pk_item].value)
                    })
                }else{
                    pks.push(this.state.pk)
                }
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            case 'back':
                this.changetolist()
                break;
            case "Batchadd":
                ajax({
                    url: urls.loadorgtreeUrl,
                    data:{},
                    success: (res) => {
                        let {success, data} = res;
                        batchOrgs = JSON.parse(JSON.stringify(data && data.financeOrgVOs ? data.financeOrgVOs : []));
                        this.setState({
                            currentStep: 0,
                            oprType: '1'
                        });

                        props.modal.show('stepModal',{title: this.state.json['10100LB-000023'],})	/* 国际化处理： 批量新增财务核算账簿*/;
                        this.sss.setBatchOrgs(batchOrgs);

                    }
                });

                break;
            default:
                break;
        }
    }



    getvalecheckdatapk(type){
        let data = this.props.table.getCheckedRows(tableId);
        let params = {type:type,info:data.map((v)=>{
                let id = v.data.values[pk_item].value;
                let ts = v.data.values.ts.value;
                return {
                    id,ts
                }
            })};
        return params;
    }

    getcheckdatapk(value){
        let data = this.props.table.getCheckedRows(tableId);
        let indexArr=[];
        console.log(data)
        let params = {content:value,info:data.map((v)=>{
                let id = v.data.values[pk_item].value;
                let ts = v.data.values.ts.value;
                return {
                    id,ts
                }
                indexArr.push(v.index);
            })};
        return params;
    }

    //输出和打印功能函数
    pintFunction(param){
        let pks = [];
        let userjson;
        if(this.state.listShow){
            let allDatas = this.props.table.getAllTableData(this.tableId);
            allDatas.rows.forEach((item,index)=>{
                pks.push(item.values[pk_item].value)
            })
            userjson = `{type:'list'}`
        }else{
            pks.push(this.state.pk)
            userjson = `{type:'card'}`
        }
        param.oids = pks;
        param.userjson = userjson;
        if(pks.length==0){
            toast({color: 'warning', content: this.state.json['10100LB-000024']});/* 国际化处理： 没有相应数据*/
            return
        }
        print(
            'pdf',
            urls.printurl,
            {...param}
        );
    }

    doubleClick = (record, index, e)=>{
        this.changetocard('browse',record[pk_item].value,false)
    }

    //批量删除
    deleteAction = () =>{
        let params;
        let indexArr=[];
        if(this.state.listShow){
            let data = this.props.table.getCheckedRows(tableId);
            console.log(data)
            params = {deleteinfo:data.map((v)=>{
                    let id = v.data.values[pk_item].value;
                    let ts = v.data.values.ts.value;
                    indexArr.push(v.index);
                    return {
                        id,ts
                    }
                })}
        }else{
            params = {deleteinfo:[{
                id: this.props.form.getFormItemsValue(this.formId,pk_item).value,
                ts: this.props.form.getFormItemsValue(this.formId,'ts').value
            }]}
        }
        ajax({
            url: urls.delliabilitybookUrl,
            data: params,
            success: (res) => {
                if(res.success&&res.data){
                    let nextPk;
                    let allpks = cacheTools.get('allpks');
                    let newAllPks = allpks.filter((pk)=>{
                        let flag = true;
                        for(let ii = 0;ii<res.data.length;ii++){
                            if(res.data[ii]==pk){
                                nextPk = this.props.cardPagination.getNextCardPaginationId({id:pk,status:1});
                                this.props.cardPagination.setCardPaginationId({id:pk,status:3});
                                flag = false;
                                break;
                            }
                        }
                        return flag;
                    })

                    this.props.cardPagination.setCardPaginationId({id:nextPk,status:1});
                    cacheTools.set('allpks',newAllPks);
                    if(this.state.listShow){
                        res.data.forEach((e)=>{
                            this.props.table.deleteCacheId(tableId,e);
                        })
                        this.props.table.deleteTableRowsByIndex(tableId, indexArr);
                    }else{
                        deleteCacheById(pk_item,res.data[0],Datasource);
                        if(nextPk){
                            this.getData('browse',nextPk);
                        }else{
                            this.changetolist();
                        }
                    }
                    toast({color:"success",title:this.state.json['10100LB-000004']});/* 国际化处理： 删除成功！*/
                }
            }
        });
    }

    //刷新
    refreshAction =(props,callback)=>{
        let searchVal = props.search.getAllSearchData(searchId);
        let queryInfo = this.props.search.getQueryInfo(searchId);
        if(searchVal != false){
            let data = {
                ShowOff:this.state.isShowOff,
                querycondition: searchVal==null?null:searchVal,
                pageInfo:props.table.getTablePageInfo(tableId)?props.table.getTablePageInfo(tableId):
                    {
                        pageIndex: 0,
                        pageSize: 10,
                        total: 0,
                        totalPage: 0
                    },
                pagecode: pagecode,
                queryAreaCode:searchId,  //查询区编码
                oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype:'tree'
            };

            ajax({
                url: urls.queryListUrl,
                data:data,
                success: (res) => {
                    console.log(res);
                    if(res.data){
                        showFormular(this.props,res,{
                            "liabilitybook_list" : "SimpleTable",
                        });
                        cacheTools.set('allpks',res.data[tableId].allpks);
                        props.table.setAllTableData(tableId, res.data[tableId]);
                        props.button.setDisabled({
                            print:false,
                            output:false
                        });
                    }
                    this.toggleShow('browse');
                    this.selectedChange();
                    callback&&callback(data);
                },
                error : (res)=>{
                    console.log(res.message);
                    cacheTools.set('allpks',[]);
                }
            });
        }
    }

    //分页
    pageInfoClick = (props, config, pks)=>{
        let data = {
            "allpks": pks,
            "pageid": pagecode
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: urls.queryPageUrl,
            data: data,
            success: function(res) {
                let { success, data } = res;
                showFormular(props,res,{
                    "liabilitybook_list" : "SimpleTable",
                });
                if (success) {
                    if (data) {
                        cacheTools.set('allpks',data[tableId].allpks);
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        cacheTools.set('allpks',[]);
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                    that.toggleShow('browse')
                }
            }
        });
    }

    //查询
    clickSearchBtn = (props,searchVal,flag)=>{
        let queryInfo = this.props.search.getQueryInfo(searchId);
        if(!searchVal){
            searchVal = queryInfo.querycondition
        }
        this.props.search.getAllSearchData(searchId);
        let data = {
            ShowOff:this.state.isShowOff,
            querycondition: searchVal==null?null:searchVal,
            pageInfo: props.table.getTablePageInfo(tableId)?props.table.getTablePageInfo(tableId):
                {
                    pageIndex: 0,
                    pageSize: 10,
                    total: 0,
                    totalPage: 0
                },
            pagecode: pagecode,
            queryAreaCode:searchId,  //查询区编码
            oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree'
        };

        ajax({
            url: urls.queryListUrl,
            data:data,
            success: (res) => {
                console.log(res);
                showFormular(this.props,res,{
                    "liabilitybook_list" : "SimpleTable",
                });
                if(res.data){
                    cacheTools.set('allpks',res.data[tableId].allpks);
                    props.table.setAllTableData(tableId, res.data[tableId]);
                    props.button.setDisabled({
                        print:false,
                        output:false
                    });
                    if(flag == true ){

                    }else{
                        let count = res.data[this.tableId].allpks.length;
                        toast({content:this.state.inlt&&this.state.inlt.get('10100LB-000001',{count:count}),color:'success'});/* 国际化处理： 查询成功，共,条。*/
                    }
                }else{
                    if(flag == true){

                    }else{
                        cacheTools.set('allpks',[]);
                        props.table.setAllTableData(this.tableId, {rows:[]});
                        toast({content:this.state.json['10100LB-000002'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据！*/
                    }
                }
                this.toggleShow('browse')
                this.selectedChange();
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }

    selectedChange(){
        let tableData = this.props.table.getCheckedRows(tableId);
        let length = tableData.length;//获取列表页选择数据的行数
        if(length === 0){//未选择数据
            this.props.button.setDisabled({
                Delete: true,
                Enable:true,
                Disable:true
            });
        }else if(length != 0){//选择一行数据
            this.props.button.setDisabled({
                Delete:false,
                Enable:false,
                Disable:false
            });
        }
        this.setState(this.state);
    }


    //显示停用数据
    showOffChange =()=>{
        this.setState({
            isShowOff : !this.state.isShowOff
        },() => {
            this.clickSearchBtn(this.props,null,true);
        });
    }

    //设置表单默认值
    setDefaultValue = (status) =>{
        this.props.form.setFormStatus(formId, status);
        this.props.form.EmptyAllFormValue(this.formId);
        ajax({
            url: urls.queryDefaultDataUrl,
            data:{pk_org:getDefData("pk_org",Datasource),pagecode:pagecode},
            success: (res) =>{
                if (res.data) {
                    showFormular(this.props,res,{
                        "liabilitybook_card" : "form",
                        'liabilitybook_liability' : "form",
                        'liabilitybook_materialperiod' : "form",
                        'liabilitybook_product' : "form"
                    });
                    if(res.data[this.formId]){
                        Utils.filterEmptyData(res.data[this.formId].rows[0].values);
                        this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId]});
                        this.props.form.setFormItemsDisabled(this.formId,{'pk_exratescheme':false,'liabilitytype':false,'pk_setofbook':false,'pk_relorg':false})
                    }
                } else {
                    this.props.form.EmptyAllFormValue(this.formId);
                }
            }
        },this.toggleShow(status))
    }
    //liyfp 用于组织结构图跳转页面
    loadOpenToFormByPk(spk) {
        let data = { pk: spk, pageid: pagecode };
        ajax({
            url: urls.queryCardDataUrl,
            data: data,
            success: (res) => {
                if (res.data) {
                    if(res.data.form[this.formId]){
                        this.props.form.setAllFormValue({ [this.formId]: res.data.form[this.formId]});
                        this.props.button.setButtonVisible(['Add','Batchadd','Delete','Enable','Disable','Openca','Print','Output','Refresh','back','Edit','Save','Saveadd','Cancel'], false);
                    }
                } else {
                    this.props.form.EmptyAllFormValue(this.formId);
                }
            }
        })
    }
    //查询数据
    getData =(status,id,flag,callback) =>{
        //查询单据详情
        this.props.cardPagination.setCardPaginationId({id:id,status:1});
        this.props.setUrlParam(id);
        let cardData = getCacheById(id, Datasource);
        let that = this;
        if(cardData&&!flag){
            this.state.pk = id;
            if(cardData[this.formId]){
                this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId]});
                let enable = cardData[this.formId].rows[0].values.enablestate.value;
                if(status == 'edit'){
                    this.props.form.setFormItemsDisabled(this.formId,{'pk_relorg':true})
                    this.props.form.setFormItemsDisabled(this.formId,{'pk_exratescheme':enable==2,'liabilitytype':enable==2,'pk_setofbook':enable==2})
                }
            }
            callback&&callback();
            this.toggleShow(status);
        }else{
            let data = { pk: id, pageid: pagecode };
            ajax({
                url: urls.queryCardDataUrl,
                data: data,
                success: (res) => {
                    this.state.pk = id;
                    if (res.data) {
                        showFormular(this.props,res,{
                            "liabilitybook_card" : "form",
                            'liabilitybook_liability' : "form",
                            'liabilitybook_materialperiod' : "form",
                            'liabilitybook_product' : "form"
                        });
                        if(res.data.form[this.formId]){
                            this.props.form.setAllFormValue({ [this.formId]: res.data.form[this.formId]});
                            let enable = res.data.form[this.formId].rows[0].values.enablestate.value;
                            if(status == 'edit'){
                                this.props.form.setFormItemsDisabled(this.formId,{'pk_relorg':true})
                                this.props.form.setFormItemsDisabled(this.formId,{'pk_exratescheme':enable==2,'liabilitytype':enable==2,'pk_setofbook':enable==2})
                            }
                            this.state.pk_checkelemsystem = res.data['pk_checkelemsystem'];
                        }
                        updateCache(pk_item,id,res.data.form,this.formId,Datasource);
                    } else {
                        this.props.form.EmptyAllFormValue(this.formId);
                    }
                    callback&&callback();
                    this.toggleShow(status);
                }
            });
        }
    }

    //保存数据
    savebill(){
        let formData = this.props.form.getAllFormValue(this.formId);
        formData.areacode=formId;
        let url = urls.saveUrl//新增保存
        if (this.state.status === 'edit') {
            url = urls.updateUrl//修改保存
           if(!this.validate(formData.rows[0].values)){
                return false;
           }
        }
        this.props.validateToSave( {
            model : formData,
            pageid : pagecode,
        } , ()=>{
            ajax({
                url: url,
                data: {
                    pageid :pagecode,
                    model:formData
                },
                success: (res) => {
                    showFormular(this.props,res,{
                        "liabilitybook_card" : "form"
                    });
                    if (res.data) {
                        if(res.data[this.formId]){
                            this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId]});
                        }
                        let idvalue = res.data[this.formId].rows[0].values[pk_item].value;
                        if (this.state.status === 'add'){
                            this.state.pk = idvalue;
                            this.props.cardPagination.setCardPaginationId({id:idvalue,status:2});
                            this.props.setUrlParam(idvalue);
                            addCache(idvalue,res.data,this.formId,Datasource);
                            // let rows = this.props.table.getPks(tableId);
                            // if(rows&&rows.length==0){
                            //     rows[0] = idvalue
                            // }
                            let cachePk = cacheTools.get('allpks');
                            if(cachePk){
                                cachePk.push(idvalue);
                                cacheTools.set('allpks',cachePk);
                            }else{
                                cacheTools.set('allpks',[idvalue]);
                            }
                        }{
                            updateCache(pk_item,idvalue,res.data,this.formId,Datasource);
                        }
                        this.state.status = 'browse';
                        toast({ color: 'success', title: this.state.json['10100LB-000009'] });/* 国际化处理： 保存成功！*/
                        this.toggleShow("browse");
                    } else {
                        this.props.form.EmptyAllFormValue(this.formId);
                    }
                }
            });
        },{[formId]:'form'} , 'form')
    }

    savebilladd(){
        let formData = this.props.form.getAllFormValue(this.formId);
        formData.areacode=formId;
        let url = urls.saveUrl//新增保存
        if (this.state.status === 'edit') {
            url = urls.updateUrl//修改保存
            if(!this.validate(formData.rows[0].values)){
                return false;
            }
        }
        this.props.validateToSave( {
            model : formData,
            pageid : pagecode,
        } , ()=>{
            ajax({
                url: url,
                data: {
                    pageid :pagecode,
                    model:formData
                },
                success: (res) => {
                    showFormular(this.props,res,{
                        "liabilitybook_card" : "form",
                        'liabilitybook_liability' : "form",
                        'liabilitybook_materialperiod' : "form",
                        'liabilitybook_product' : "form"
                    });
                    if (res.data) {
                        if(res.data[this.formId]){
                            this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId]});
                        }
                        let idvalue = res.data[this.formId].rows[0].values[pk_item].value;
                        if (this.state.status === 'add'){
                            this.state.pk = idvalue;
                            addCache(idvalue,res.data,this.formId,Datasource);
                            this.props.cardPagination.setCardPaginationId({id:idvalue,status:2});
                            this.props.setUrlParam(idvalue);
                            // let rows = this.props.table.getPks(tableId);
                            // if(rows&&rows.length==0){
                            //     rows[0] = idvalue
                            // }
                            let cachePk = cacheTools.get('allpks');
                            if(cachePk){
                                cachePk.push(idvalue);
                                cacheTools.set('allpks',cachePk);
                            }else{
                                cacheTools.set('allpks',[idvalue]);
                            }
                        }{
                            updateCache(pk_item,idvalue,res.data,this.formId,Datasource);
                        }

                        toast({ color: 'success', title: this.state.json['10100LB-000009'] });/* 国际化处理： 保存成功！*/
                        this.setDefaultValue("add");
                    } else {
                        this.props.form.EmptyAllFormValue(this.formId);
                    }
                }
            });
        },{[formId]:'form'} , 'form')
    }

    validate(data){
        if(data['liabilityenablestate'].value!=1&&(data['pk_liabilityperiod'].value==null||data['pk_liabilityperiod'].value=='')){
            toast({ color: 'warning', title: this.state.json['10100LB-000012'] });
            return false;
        }
        if(data['materialenablestate'].value!=1&&(data['pk_materialperiod'].value==null||data['pk_materialperiod'].value=='')){
            toast({ color: 'warning', title: this.state.json['10100LB-000013'] });
            return false;
        }
        if(data['productcostenablestate'].value!=1&&(data['pk_productcostperiod'].value==null||data['pk_productcostperiod'].value=='')){
            toast({ color: 'warning', title: this.state.json['10100LB-000014'] });
            return false;
        }
            return true

    }

    enableFun(props,selectedRows,oriData,type){

        if (selectedRows.length !== 1) {
            toast({color: 'danger', content: this.state.json['10100LB-000015']});/* 国际化处理： 请选择1条数据操作！*/
            return;
        };
        this.state.disableData = Utils.clone(oriData);
        this.state.checkData = Utils.clone(oriData);
        this.state.curDataValues = selectedRows[0].values;
        this.state.enableopr=type=='0'?true:false;
        this.setState(this.state,()=>{

            let msg = type=='0'?this.state.json['10100LB-000016']:this.state.json['10100LB-000017'];/* 国际化处理： 启用成功！,停用成功！*/

            let enabledata = {
                pageid: pagecode,
                model: {
                    areacode: tableId,
                    pageinfo: {},
                    rows: []
                },
                userjson:JSON.stringify({
                    'enable' :type,
                    'listShow':this.state.listShow?"0":"1"
                })
            };
            //添加原来修改前的数据
            enabledata.model.rows.push(selectedRows[0]);
            this.enabledeletepre(urls.validateUrl,this.state.listShow?this.getvalecheckdatapk('Enable'):{type:'enable',info:[{
                    id: this.props.form.getFormItemsValue(this.formId,pk_item).value,
                    ts: this.props.form.getFormItemsValue(this.formId,'ts').value
                }]},).then(()=>{

                props.modal.show('enableModal', {
                    title : this.state.enableopr?this.state.json['10100LB-000018']:this.state.json['10100LB-000019'],//标题/* 国际化处理： 财务核算账簿启用,财务核算账簿停用*/
                    beSureBtnClick: () => {
                        //添加停启用面板操作后的数据
                        if(selectedRows[0].values['liabilityenablestate'].value != this.state.checkData['liabilityenablestate'].value &&  (selectedRows[0].values.pk_factorchart==null||selectedRows[0].values.pk_factorchart.value==null||selectedRows[0].values.pk_factorchart.value=="")){
                            toast({content:this.state.json['10100LB-000040'],color:'warning'})/* 国际化处理： 要素表为空，不允许启用利润中心会计账簿*/
                        }else if(selectedRows[0].values['liabilityenablestate'].value != this.state.checkData['liabilityenablestate'].value&&(selectedRows[0].values['pk_liabilityperiod']==null||selectedRows[0].values['pk_liabilityperiod'].value==null||selectedRows[0].values['pk_liabilityperiod'].value=="")){
                            toast({content:this.state.json['10100LB-000041'],color:'warning'})/* 国际化处理： 选中启用的账簿对应的期间或科目表不能为空*/
                        }
                        else if(selectedRows[0].values['materialenablestate'].value != this.state.checkData['materialenablestate'].value&&(selectedRows[0].values['pk_materialperiod']==null||selectedRows[0].values['pk_materialperiod'].value==null||selectedRows[0].values['pk_materialperiod'].value=="")){
                            toast({content:this.state.json['10100LB-000042'],color:'warning'})/* 国际化处理： 选中启用的账簿对应的期间不能为空*/
                        }
                        else if(selectedRows[0].values['productcostenablestate'].value != this.state.checkData['productcostenablestate'].value&&(selectedRows[0].values['pk_productcostperiod']==null||selectedRows[0].values['pk_productcostperiod'].value==null||selectedRows[0].values['pk_productcostperiod'].value=="")){
                            toast({content:this.state.json['10100LB-000042'],color:'warning'})/* 国际化处理： 选中启用的账簿对应的期间不能为空*/
                        }else if(selectedRows[0].values['liabilityenablestate'].value == this.state.checkData['liabilityenablestate'].value&&selectedRows[0].values['materialenablestate'].value == this.state.checkData['materialenablestate'].value&&selectedRows[0].values['productcostenablestate'].value == this.state.checkData['productcostenablestate'].value){
                            toast({content:this.state.enableopr?this.state.json['10100LB-000043']:this.state.json['10100LB-000044'],color:'warning'})/* 国际化处理： 请选择需要启用的核算账簿！,请选择需要停用的核算账簿！*/
                        }
                        else{
                            enabledata.model.rows.push({values:this.state.checkData});
                            this.enableAjax(enabledata,msg);
                        }
                    },
                    cancelBtnClick:()=>{
                        props.modal.close('enableModal');
                    }
                });
            })
        });
    }

    enabledeletepre(url,enabledata){
        var p = new Promise(function(resolve, reject){
            ajax({
                url: url,
                data: enabledata,
                success: (res) => {
                    resolve(res);
                }
            });
        });
        return p;
    }

    enableAjax(enabledata,msg){
        ajax({
            url: urls.enablestateUrl,
            data: enabledata,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if(res.data){
                        if(this.state.listShow){
                            let oriRows = this.props.table.getAllTableData(tableId).rows;
                            oriRows[enabledata.model.rows[0].index] = res.data.grid[tableId].rows[0];
                            this.props.table.setAllTableData(tableId,{rows:oriRows});
                        }else{
                            this.props.form.setAllFormValue({[formId]:{rows:res.data.form[formId].rows}});
                        }
                        let id = res.data.form[formId].rows[0].values[pk_item].value;
                        let cardData = getCacheById(id, Datasource);
                        if(cardData){
                            updateCache(pk_item,id,res.data.form,this.formId,Datasource);
                        }
                        this.toggleShow('browse');

                        this.props.modal.close('enableModal');
                        toast({color: 'success', title: msg});
                    }
                }
            }
        });
    }

    changeCheck(field,val){
        let enableopr = this.state.enableopr;
        //启用操作：勾选设置为启用，取消勾选设置为原来的未启用或是已停用
        if(enableopr){
            this.state.checkData[field]['value'] = val?2:this.state.curDataValues[field]['value'];
        }else {
            //停用操作：勾选设置为停用，取消勾选设置为原来的启用
            this.state.checkData[field]['value'] = val?3:2;
        }
        this.setState({checkData:this.state.checkData});
    }


    cardpageInfoClick=(props, pk)=> {
        if(pk&&pk!=null) {
            this.getData("browse", pk);
        }
    }

    //编辑后事件
    afterEvent=(props, moduleId, key, value,oldValue,ref)=>{
        switch(key){
            case 'pk_relorg':
                let formData = this.props.form.getAllFormValue(this.formId);

                ajax({
                    url: urls.afterEventUrl,
                    data:{
                        pageid :pagecode,
                        model:formData
                    },
                    success: (res) =>{
                        showFormular(this.props,res,{
                            "liabilitybook_card" : "form",
                            'liabilitybook_liability' : "form",
                            'liabilitybook_materialperiod' : "form",
                            'liabilitybook_product' : "form"
                        });
                        if (res.data) {
                            if(res.data.form[this.formId]){
                                this.props.form.setAllFormValue({ [this.formId]: res.data.form[this.formId]});
                            }
                            this.props.form.setFormItemsDisabled(this.formId,{'pk_setofbook':true})
                            this.state.pk_accperiodscheme = res.data['pk_accperiodscheme'];
                            this.state.pk_checkelemsystem = res.data['pk_checkelemsystem'];
                        } else {
                            this.props.form.EmptyAllFormValue(this.formId);
                        }
                    }
                })
                break;
            case 'pk_setofbook':

                break;
            default:
                break
        }

    }

    toggleShow = (status) =>{
        let flag = status != 'browse' ? false : true;
        this.props.button.setButtonVisible(['Add','Batchadd','Delete','Enable','Disable','Openca','Print','Output','Refresh','back',], flag);

        if(status == 'edit'){
            this.props.button.setButtonVisible('Saveadd', flag);
        } else{
            this.props.button.setButtonVisible('Saveadd', !flag);
        }
        this.props.button.setButtonVisible(['Save','Cancel',], !flag);
        this.props.button.setButtonVisible(['Edit'], flag&&!this.state.listShow);
        this.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn:flag&&!this.state.listShow});
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag&&!this.state.listShow);

        this.props.form.setFormStatus(formId, status);
        this.state.listShow&&this.selectedChange();
        this.setState(this.state);
    }

    getModal() {
        return (<div>
            <Enablemodel
                disableData={this.state.disableData}
                checkData={this.state.checkData}
                enableopr={this.state.enableopr}
                changeCheck={this.changeCheck.bind(this)}
                multiJson={this.state.json}
                inlt={this.state.inlt}>
            </Enablemodel>
        </div>)
    }

    openModal(modalName){
        if('stepModal'==modalName) {
            window.onbeforeunload = () => {
                return '';
            }
        }
        this.props.modal.show(modalName);
    }

    closeModal(modalName){
        if('stepModal'==modalName){
            window.onbeforeunload = null;
        }

        this.props.modal.close(modalName);
    }

    /**
     * 获取子组件的点击事件
     * @param {子组件传递过来的点击事件} a
     * @param {子组件的this} th
     */
    fn(a,th){
        onClickBatch = a;       //保存为全局变量
        that = th;              //保存为全局变量
    }
    /**
     * 父组件点击事件触发
     * @param {createButtonApp传递过来的东西，props} a
     * @param {同上，id} b
     */
    fn2(a,b){
        onClickBatch.call(that,a,b); //执行子组件的函数，顺便绑定this
    }
    getSteps() {
        return (<BatchAdd {...this.props} fn={this.fn} closeModal={this.closeModal.bind(this)} multiJson={this.state.json} inlt={this.state.inlt}  ref={(item)=>{
            this.sss = item;
        }}></BatchAdd>)

    }

    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(formId);
        if(formStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    render() {
        let { table, button, search,modal,form ,cardPagination,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let {createModal} = modal;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp , getButtons } = button;
        let { createCardPagination } = cardPagination;
        let {createForm} = form;
        let {NCCheckbox} = base;
        let fromstatus = this.props.form.getFormStatus(formId);
        var renderCard = ()=>{
            return (
                <div style = {{height:'100%'}}>
                    <div  className="nc-bill-top-area nc-bill-top-area-self">
                        <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                            {!this.state.isOpenTo ?//liyfp 组织结构图 跳转时用于控制页面按钮
                                <div className="header-title-search-area">
                                {createBillHeadInfo(
                                        {
                                            title :this.state.json['10100LB-000005']/* 国际化处理： 责任核算账簿*/,             //标题
                                            backBtnClick:this.buttonClick.bind(this,this.props,'back')
                                        }
                                    )}  
                                </div>:
                                <div className="header-title-search-area">
                                    {createBillHeadInfo(
                                            {
                                                title :this.state.json['10100LB-000005']/* 国际化处理： 责任核算账簿*/,             //标题
                                                showBackBtn:false,
                                                initShowBackBtn:false
                                            }
                                    )}
                                </div>
                            }
                            <div className="header-button-area">
                                {!this.state.listShow && createButtonApp({
                                    area: 'header_button',
                                    buttonLimit: 5,
                                    onButtonClick: this.buttonClick.bind(this),
                                    popContainer: document.querySelector('.header-button-area')

                                })}
                            </div>
                            <div className='header-cardPagination-area' style={{float:'right'}}>
                                {!this.state.listShow&&fromstatus=='browse'&&createCardPagination({
                                    handlePageInfoChange: this.cardpageInfoClick.bind(this)
                                })}
                            </div>
                        </NCDiv>
					<div className="nc-bill-form-area">
						{createForm(formId, {
							onAfterEvent: this.afterEvent.bind(this),
							expandArr:['liabilitybook_liability','liabilitybook_materialperiod','liabilitybook_product']
						})}
					</div>
				</div>
            </div>
            )
        }
        var renderList = ()=>{
            return (
                <div style = {{height:'100%'}}>
                    <NCDiv  areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area">
                        <div className="header-title-search-area" >
                            {
                                createBillHeadInfo(
                                    {
                                        title :this.state.json['10100LB-000005']/* 国际化处理： 责任核算账簿*/,             //标题
                                        backBtnClick:this.buttonClick.bind(this,this.props,'back'),
                                        showBackBtn:false,
                                        initShowBackBtn:false
                                    }
                                )
                            }
                        </div>
                        {this.state.listShow?(
                        <div className="title-search-detail showDisableStyle">
                            <span className="showOff">
                                    <NCCheckbox
                                        checked={this.state.isShowOff}
                                        onChange={this.showOffChange.bind(this)}
                                        disabled={this.state.showOffDisable}
                                    >{this.state.json['10100LB-000003']/* 国际化处理： 显示停用*/}</NCCheckbox>
                                </span>
                        </div>
                        ):('')}

                        <div className="header-button-area">
                            {this.state.listShow && createButtonApp({
                                area: 'header_button',
                                buttonLimit: 5,
                                onButtonClick: this.buttonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')

                            })}
                        </div>
                    </NCDiv>
            
                    <div className="nc-bill-search-area">
                        {NCCreateSearch(searchId, {
                            clickSearchBtn: this.clickSearchBtn.bind(this),
                            defaultConditionsNum:5,
                            oid:getDefData("OID",Datasource)
                        })}
                    </div>
                
                    <div className="nc-bill-table-area">
                        {createSimpleTable(tableId, {
                            handlePageInfoChange: this.pageInfoClick,
                            dataSource: Datasource,
                            pkname:pk_item,
                            componentInitFinished:()=>{
                                //缓存数据赋值成功的钩子函数
                                //若初始化数据后需要对数据做修改，可以在这里处理
                                let allDatas = this.props.table.getAllTableData(tableId);
                                if(allDatas.rows.length>0){
                                    this.props.button.setDisabled({
                                        print:false,
                                        output:false
                                    });
                                    this.selectedChange();
                                }
                            },
                            tableModelConfirm: this.tableModelConfirm,
                            onSelected:this.selectedChange.bind(this),
                            onSelectedAll: this.selectedChange.bind(this),
                            showIndex:true,
                            showCheck:true,
                            onRowDoubleClick: this.doubleClick.bind(this)
                        })}
                    </div>
                </div>
            )
        }
        return (
            <div className = {this.state.listShow ? "nc-bill-list" : "nc-bill-card nc-bill-extCard"}>
                {this.state.listShow ?renderList():renderCard()}
                {createModal('enableModal',{
                    userControl:true,
                    size:'300px',
                    content : this.getModal()						//内容
                })}
                {createModal('stepModal', {
                    content: this.getSteps.bind(this)(),							//内容
                    noFooter: false,
                    className:'batch-add',
                    closeModalEve:()=>{
                        this.closeModal('stepModal');
                    },
                    showCustomBtns:true,
                    customBtns:<div className="steps-action"  >
                        {createButtonApp({
                            area: 'stepmodel_button',
                            buttonLimit: 4,
                            onButtonClick: this.fn2.bind(this),
                            popContainer: document.querySelector('.steps-action')
                        })}

                    </div>
                })}
                <PrintOutput
                    ref='printOutput'
                    url= {urls['printurl']}
                    data={{
                        funcode:appcode,
                        nodekey:this.state.listShow?printlist:printcard,     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output",
                        userjson :this.state.listShow?`{type:'list'}`:`{type:'card'}`
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
            </div>
        );
    }
}

Liabilitybook = createPage({
    billinfo:[
        {
            billtype: 'form',
            pagecode: pagecode,
            headcode: formId

        },
        {
            billtype: "form",
            pagecode: pagecode,
            headcode: batchaddform
        },{
            billtype: "grid",
            pagecode: pagecode,
            bodycode: batchaddtableedit
        }
    ],
})(Liabilitybook);
//export default List
 ReactDOM.render(<Liabilitybook />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65