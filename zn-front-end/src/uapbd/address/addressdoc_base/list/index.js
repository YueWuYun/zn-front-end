//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import {createPage, ajax, base, toast ,print,high,cardCache,promptBox,getBusinessInfo,getMultiLang,createPageIcon, excelImportconfig} from 'nc-lightapp-front';
const { PrintOutput } = high;
let {setDefData, getDefData } = cardCache;
let businessInfo = getBusinessInfo();
import createUIDom from '../../../public/utils/BDCreateUIDom';

const {ExcelImport}=high;
const searchId = 'AddrDocQryTmp';
const tableId = 'addressdoc';
let pagecode = '10140ADRB_list';//页面id
const appcode = '10140ADRB';//注册按钮的id
const isShowOffEnable = true;		//是否启用“显示停用”功能
const pk_value = "pk_addressdoc"; //页面数据主键
const nodeType = "GLOBE_NODE";
const AddDatasource = 'uapbd.address.addressdoc_grp.dataSource';
let urls={
    queryListUrl:"/nccloud/uapbd/address/queryaddress.do",
    deladdressUrl:"/nccloud/uapbd/address/deladdress.do",
    queryPageUrl:"/nccloud/uapbd/address/queryAddressPageGridByPks.do",
    enablestateUrl:"/nccloud/uapbd/address/enableAddressDocInfo.do",
    print:"/nccloud/uapbd/address/printAddressDocInfo.do",
    validateUrl:"/nccloud/uapbd/address/validateAddressDoc.do",

};

class List extends Component {
    constructor(props) {
        super(props);

        this.config =Object.assign({
            title: '10140ADRB-000000',/* 国际化处理： 地点-全局*/
            tableId:"addressdoc",
            searchId:"AddrDocQryTmp",
            pageCode:"10140ADRB_list",
            appcode:'10140ADRB',
            nodeType:'GLOBE_NODE',
            primaryKey:'pk_addressdoc',
            urls:urls
        },props.config);
        pagecode = this.config.pageCode;
        this.moduleId = '2052';
        this.state={
            SelectedData:null,
            showOffDisable:false,			//显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff:getDefData("addressisShowOff",AddDatasource)||false,				//列表是否显示停用数据
            pks:[],
            json: {},
            inlt:null
        }
        this.initTemplate(this.props,()=>{
            let searchVal =getDefData("searchParams",AddDatasource);
            if(searchVal && searchVal != false){
                this.props.search.setSearchValue(searchId,searchVal.conditions);
            }
            let datas = this.props.table.getAllTableData(this.config.tableId)
            if(datas.rows.length>0){
                this.props.button.setDisabled({print:false,output:false,copy:true});
            }
        })
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    initTemplate = (props,callback) => {
        createUIDom(props)(
            {
                pagecode:props.config.pageCode?props.config.pageCode:pagecode
            },
            {
                moduleId: "10140ADRB",domainName: 'uapbd'
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
                        setDefData("OID",AddDatasource,meta[searchId].oid);
                        meta = this.modifierMeta(props, meta);
                        props.meta.setMeta(meta,()=>{
                            //问题单号 NCCLOUD-159438
                            //  if(businessInfo != null){
                            //      let pkGroup = businessInfo.groupId?businessInfo.groupId:null;
                            //      let groupName = businessInfo.groupName?businessInfo.groupName:null;
                            //      if(props.config.billType == 'addressdoc_grp'){
                            //          props.search.setSearchValByField(searchId, 'pk_org',{value: pkGroup,display:groupName});
                            //      }
                            //  }
                            //bug fix for NCCLOUD-157449
                            if(props.config.nodeType==="GROPE_NODE"){
                                props.search.setSearchValByField(searchId,"pk_org", {value:businessInfo?businessInfo.groupId:null,display:businessInfo?businessInfo.groupName:null});
                            }  
                        });
                    }
                    if (data.button) {
                        let button = data.button;
                        let excelimportconfig = excelImportconfig(props,'uapbd',this.props.config.billType,true,'',{'appcode':this.props.config.appcode , 'pagecode':this.props.config.importTemplate},()=>{this.getData(this.props)});
					    props.button.setUploadConfig("import",excelimportconfig);
                        props.button.setButtons(button);
                        props.button.setDisabled({
                            copy:true,
                            print:true,
                            output:true
                        });
                        props.button.setPopContent({'delete':this.state.json['10140ADRB-000016']});/* 国际化处理： 确认要删除该信息吗？*/
                    }
                    callback && callback();
                }
            }
        )
    }

    buttongroups=(props,record)=>{
        if(props.config.nodeType==="GROPE_NODE"&&record['pk_group'].value!=record['pk_org'].value){
            return [];
        }else{
            return record['enablestate'].value==true?['edit','delete','disable']:['edit','delete','enable'];
        }
    }

    modifierMeta=(props, meta)=>{
        if(!props){
            props = this.props;
        }
        if(!meta){
            meta = this.props.meta.getMeta();
        }
        meta[searchId].items.map((item)=>{
            if(item.attrcode == 'pk_org'){
                item.isMultiSelectedEnabled = true;
                item.queryCondition=()=>{
                    return {
                        AppCode:props.config.appcode,
                        TreeRefActionExt:props.config.nodeType=='GROPE_NODE'?'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder':'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
            }
            if(item.attrcode == 'pk_areacl'){
                item.isMultiSelectedEnabled = true;
            }
        })

        meta[tableId].items = meta[tableId].items.map((item, key) => {
            //item.width = 150;
            if (item.attrcode == 'code') {
                item.render = (text, record, index) => {
                    return (
                        <a
                            style={{color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                props.pushTo("/card", {
                                    pagecode:props.config.pageCardCode,
                                    status: 'browse',
                                    id: record[pk_value].value
                                });
                            }}
                        >
                            {record?(record.code && record.code.value):null}
                        </a>
                    );
                };
            }
            return item;
        });
        //添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            itemtype:'customer',
            label: this.state.json['10140ADRB-000001'],/* 国际化处理： 操作*/
            width: 200,
            className : 'table-opr',
            fixed: 'right',
            visible: true,
            render: (text, record, index) => {
                let btnArray = this.buttongroups(props,record)
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

    tableButtonClick=(props, id, text, record, index)=>{
        switch(id){
            case 'edit':
                ajax({
                    url: urls.validateUrl,
                    data: {
                        pk: record[pk_value].value,
                        nodeType: props.config.nodeType,
                        type:'edit'
                    },
                    success: (res) => {
                        props.pushTo("/card", {
                            status: 'edit',
                            pagecode:props.config.pageCardCode,
                            id: record[pk_value].value
                        });
                    }
                });
                break;
            case 'delete':
                ajax({
                    url: urls.validateUrl,
                    data: {
                        pk: record[pk_value].value,
                        nodeType: props.config.nodeType,
                        type:'delete'
                    },
                    success: (res) => {
                        let id = record[pk_value].value;
                        ajax({
                            url: urls.deladdressUrl,
                            data: {
                                id: record[pk_value].value,
                                ts: record.ts.value
                            },
                            success: (res) => {
                                if (res.success) {
                                    toast({title:this.state.json['10140ADRB-000008'],color:'success'})/* 国际化处理： 删除成功！*/
                                    props.table.deleteCacheId(tableId,id);
                                    props.table.deleteTableRowsByIndex(tableId, index);
                                    props.button.setDisabled({
                                        copy:true
                                    });
                                }
                            }
                        });
                    }
                })
                break;
            case 'enable':
            case 'disable':
                ajax({
                    url: urls.validateUrl,
                    data: {
                        pk: record[pk_value].value,
                        nodeType: props.config.nodeType,
                        type:id
                    },
                    success: (res) => {
                        let requestParam = {
                            pk:record[pk_value].value,
                            enablestate:record['enablestate'].value?'2':'3',
                            ts:record['ts'].value,
                            moduleid:tableId,
                            pagecode:props.config.nodeType=="GLOBE_NODE"?"10140ADRB_card":"10140ADRG_card",
                        };

                        promptBox({
                            color:"info",
                            title:record['enablestate'].value?this.state.json['10140ADRB-000017']:this.state.json['10140ADRB-000018'],/* 国际化处理： 确认停用？,确认启用？*/
                            content:record['enablestate'].value?this.state.json['10140ADRB-000019']:this.state.json['10140ADRB-000020'],/* 国际化处理： 确认停用该数据？,确认启用该数据？*/
                            beSureBtnClick:()=>{
                                ajax({
                                    url:urls.enablestateUrl,
                                    data:requestParam,
                                    success:(result)=>{
                                        props.table.setValByKeyAndIndex(tableId, index, 'enablestate', { value:!record['enablestate'].value})
                                        props.table.setValByKeyAndIndex(tableId, index, 'ts', result.data.head.head.rows[0].values.ts)
                                        toast({title:record['enablestate'].value?this.state.json['10140ADRB-000009']:this.state.json['10140ADRB-000010']});/* 国际化处理： 停用成功！,启用成功！*/
                                    }
                                });
                            },
                            cancelBtnClick:()=>{
                                return;
                            }
                        });
                    }
                })
                break;
            default:
                break;
        }
    }

    //按钮事件
    buttonClick(props, id) {
        switch (id) {
            case 'add':
                props.pushTo("/card", {
                    status:'add',
                    pagecode:props.config.pageCardCode,
                    id:null
                })
                break;
            case 'refresh':
                this.getData(props,()=>{
                    toast({title:this.state.json['10140ADRB-000006'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'copy':
                props.pushTo("/card", {
                    status:'add',
                    pagecode:props.config.pageCardCode,
                    id:this.state.selectData
                })
                break;
            case "print":
                let printParam={
                    funcode: this.props.config.appcode,
                    nodekey: 'addresslist',
                    outputType:'print'
                };
                this.pintFunction(printParam);
                break;
            case 'output':
                let allDatas = this.props.table.getAllTableData(this.config.tableId);
                let pks = [];
                allDatas.rows.forEach((item,index)=>{
                    pks.push(item.values[pk_value].value)
                })
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            case 'export':
               this.setState({

                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            default:
                break;
        }
    }

    //打印功能函数
    pintFunction(param){
        let allDatas = this.props.table.getAllTableData(this.config.tableId);
        let pks = [];
        allDatas.rows.forEach((item,index)=>{
            pks.push(item.values[pk_value].value)
        })
        param.oids = pks;
        if(pks.length==0){
            toast({color: 'success', content: this.state.json['10140ADRB-000021']});/* 国际化处理： 没有相应数据*/
            return
        }
        print(
            'pdf',
            urls['print'],
            {...param}
        );
    }

    //列表双击事件
    doubleClick(record, index, e) {
        this.props.pushTo("/card", {
            status: 'browse',
            pagecode:this.props.config.pageCardCode,
            id: record[pk_value].value
        });
    }

    //行点击事件
    onClick(props,moduleId,record,index){
        this.state.selectData = record[pk_value].value
        this.setState(this.state);
        this.props.button.setDisabled({
            copy:false
        });
    }


    //显示停用数据
    showOffChange =()=>{
        this.setState({
            isShowOff : !this.state.isShowOff
        },() => {
            setDefData("addressisShowOff",AddDatasource,this.state.isShowOff);
            this.getData(this.props);
        });
    }

    //分页
    pageInfoClick = (props, config, pks)=>{

        let data = {
            "allpks": pks,
            "pageid": this.config.pageCode?this.config.pageCode:pagecode,
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: urls.queryPageUrl,
            data: data,
            success: function(res) {
                let { success, data } = res;
                that.formu(res.formulamsg);
                if (success) {
                    if (data) {
                        data[tableId].rows.forEach(function(item, index, array){
                            //是否其中转换成开关
                            if (item.values['enablestate'].value === '2') {
                                item.values['enablestate'].value = true;
                            } else {
                                item.values['enablestate'].value = false;
                            }
                        });
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
    }


    //查询区按钮点击事件
    clickSearchBtn(props,searchVal) {
        setDefData("searchParams",AddDatasource,searchVal);
        this.getData(this.props,(data)=>{
            if(data){
                let count = data[this.config.tableId].allpks.length
                if(count==0) {
                    toast({content:this.state.json['10140ADRB-000022'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据！*/
                }else{
                    let msg = this.state.inlt&&this.state.inlt.get('10140ADRB-000023', { count: count});
                    console.log("this.state.inlt : ")
                    console.log(this.state.inlt)
                    toast({content:this.state.inlt&&this.state.inlt.get('10140ADRB-000023', { count: count}),color:'success'})/* 国际化处理： 查询成功，共,条。*/
                }
            }else {
                toast({content:this.state.json['10140ADRB-000022'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据！*/
            }
        });
    };

    //查询列表数据
    getData = (props,callback) => {
        let searchVal =getDefData("searchParams",AddDatasource);
        let showOff = this.state.isShowOff;
        let pageInfo = props.table.getTablePageInfo(this.config.tableId);
        let queryInfo = this.props.search.getQueryInfo(searchId);
        if(!searchVal){
            searchVal = queryInfo.querycondition
        }
        let data = {
            showOfff:showOff,
            nodeType:this.config.nodeType,
            querycondition: searchVal==null?null:searchVal,
            //conditions: searchVal==null?null:searchVal.conditions,
            pagecode: this.config.pageCode?this.config.pageCode:pagecode,
            pageInfo: pageInfo,
            queryAreaCode: searchId,
            oid:queryInfo.oid,
            querytype:'tree'
        };

        ajax({
            url: urls.queryListUrl,
            data: data,
            success: (res) => {
                let { success, data ,formulamsg } = res;
                this.formu(formulamsg);

                if (success) {
                    if (data) {
                        this.props.button.setDisabled({print:false,output:false,copy:true});
                        data[tableId].rows.forEach(function(item, index, array){
                            //是否其中转换成开关
                            if (item.values['enablestate'].value === '2') {
                                item.values['enablestate'].value = true;
                            } else {
                                item.values['enablestate'].value = false;
                            }
                        });
                        this.props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        this.props.table.setAllTableData(tableId, { rows: [] });
                    }
                    callback&&callback(data);
                }
            }
        });
    };

    formu=(formulamsg) => {
        if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
            this.props.dealFormulamsg(
                formulamsg,  //参数一：返回的公式对象
                {                //参数二：界面使用的表格类型
                    tableId:'SimpleTable'
                }
            );
        }
    }

    render() {
        let { table, button, search,editTable,modal, BillHeadInfo } = this.props;
        let { createEditTable } = editTable;
        const {createBillHeadInfo} = BillHeadInfo;
        let buttons = this.props.button.getButtons();
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let {NCCheckbox, NCDiv} = base;
        let { createModal } = modal;
        let { createButtonApp, getButtons } = button;

        return (
            <div className="nc-bill-list">
                <NCDiv className="nc-bill-header-area" areaCode={NCDiv.config.HEADER}>
                    <div className="header-title-search-area" style={{alignItems: 'center'}}>
                        {createBillHeadInfo(
                            {
                                //title-search-detail
                                title: this.state.json[this.config.title],
                                backBtnClick: () => {},
                                initShowBackBtn: false
                            }
                        )}
                        {isShowOffEnable?(
                                <span className="showOff">
                                    <NCCheckbox
                                        checked={this.state.isShowOff}
                                        onChange={this.showOffChange.bind(this)}
                                        disabled={this.state.showOffDisable}
                                    >{this.state.json['10140ADRB-000025']/* 国际化处理： 显示停用*/}</NCCheckbox>
                                </span>
                        ):('')}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'list-header-button',
                            buttonLimit: 3,
                            onButtonClick: this.buttonClick.bind(this),
                            popContainer: document.querySelector('.list-header-button')
                        })}
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area">
                    {NCCreateSearch(this.config.searchId, {
                        clickSearchBtn: this.clickSearchBtn.bind(this),
                        oid:getDefData("OID",AddDatasource),
                        defaultConditionsNum:5
                    })}
                </div>

                <div className="nc-bill-table-area">
                    {createSimpleTable(this.config.tableId, {
                        handlePageInfoChange: this.pageInfoClick.bind(this),
                        dataSource: AddDatasource,
                        pkname:pk_value,
                        componentInitFinished:()=>{
                            let datas = this.props.table.getAllTableData(this.config.tableId)
                            if(datas.rows.length>0){
                                this.props.button.setDisabled({print:false,output:false,copy:true});
                            }
                        },
                        //tableModelConfirm: tableModelConfirm,
                        onRowClick:this.onClick.bind(this),
                        showIndex: true,
                        onRowDoubleClick: this.doubleClick.bind(this)
                    })}
                </div>
                {createModal('modal',{noFooter:false})}
                <PrintOutput
                    ref='printOutput'
                    url= {urls['print']}
                    data={{
                        funcode:this.props.config.appcode,
                        nodekey:'addresslist',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
                <ExcelImport
                    {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = {this.props.config.billType}//单据类型
                    selectedPKS = {[]}
					appcode={this.props.config.appcode}
					pagecode={this.props.config.importTemplate}
				/>
            </div>
        );
    }
}

List = createPage({
})(List);
export default List
// ReactDOM.render(<List />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65