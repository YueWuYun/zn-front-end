//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base ,toast,print,high,cardCache,promptBox,createPageIcon} from 'nc-lightapp-front';
const { PrintOutput,ApproveDetail, ApprovalTrans } = high;
let {setDefData, getDefData } = cardCache;
// import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import utils from '../../../public/utils';
const {showFormular } = utils;
const {NCDiv} = base;


const pageId = '10140SBAPF_list';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'supplierbankpflist';                 //表头id
const appcode = '10140SBAPF';   //注册按钮id
const linkItem = 'billno';        //列表卡片跳转字段
const pk_item = 'pk_supplierbankpf';             //列表主键
const datasource = 'uapbd.supplier.supplierbankpf.dataSource';

let urls={
    queryListUrl:'/nccloud/uapbd/supplierbankpf/querypfListData.do',
    deleteUrl:'/nccloud/uapbd/supplierbankpf/supbkpfDeleteData.do',
    commiturl:'/nccloud/uapbd/supplierbankpf/supbkpfCommitData.do',
    recallurl:'/nccloud/uapbd/supplierbankpf/supbkpfRecallData.do',
    printurl:'/nccloud/uapbd/supplierbankpf/supbkpfPrintData.do',
    queryPageUrl:'/nccloud/uapbd/supplierbankpf/querypfpageData.do',
    validateSupplierBankpfurl:'/nccloud/uapbd/supplierbankpf/supbkpfValiData.do',
};


class List extends Component {
    constructor(props) {
        super(props);
        this.searchId = searchId;
        this.tableId = tableId;
        this.state={
            pks:[],
            compositedata: null,
            compositedisplay: false,
            showApprInfo:false,
            billId:null,
            json:{},
            inlt:null
        }
        this.initTemplate(this.props, () => {
            let searchVal =getDefData("searchParams",datasource);
            if(searchVal && searchVal != false){
                this.props.search.setSearchValue(searchId,searchVal.conditions);
            }
        });
    }

    initTemplate =(props, callback) =>{

        createUIDom(props)(
            {
                pagecode: pageId//页面id
            },
            {
                moduleId: "10140SBAPF",domainName: 'uapbd'
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
                        setDefData("OID",datasource,meta[searchId].oid);
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setDisabled({
                            print:true,
                            output:true,
                            commit:true,
                            recall:true,
                            delete:true
                        });
                        props.button.setPopContent('delline',this.state.json['10140SBAPF-000001']) /* 设置操作列上删除按钮的弹窗提示 */
                    }
                    callback && callback();
                }
            }
        )
    }

    modifierMeta = (props, meta) => {
        meta[tableId].pagination = true;
        meta[tableId].items = meta[tableId].items.map((item, key) => {
            //item.width = 150;
            if (item.attrcode == linkItem) {
                item.render = (text, record, index) => {
                    return (
                        <span
                            style={{color: '#007ace',cursor: 'pointer' }}
                            onClick={() => {
                                props.pushTo("/card", {
                                    status: 'browse',
                                    pagecode:'10140SBAPF_card',
                                    id: record[pk_item].value,//列表卡片传参,
                                    errParam: JSON.stringify(record)
                                });
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
            if(item.attrcode == 'pk_org'||item.attrcode == 'pk_targetorg'){
                item.isMultiSelectedEnabled = true;
                item.isShowDisabledData = true;
                item.queryCondition=()=>{
                    return {'AppCode':appcode,
                        TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                }
            }
        })
        //添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10140SBAPF-000002'],/* 国际化处理： 操作*/
            width: 200,
            fixed: 'right',
            className : 'table-opr',
            visible: true,
            itemtype: 'customer',
            render: (text, record, index) => {
                let btnArray = record.billstatus.value == -1?['edit','delline']:['rowApprInfo'];
                return props.button.createErrorButton({
					record,
                    sucessCallBack: () => {
                        return props.button.createOprationButton(
                            btnArray,
                            {
                                area: "table_opr_area",
                                buttonLimit: 3,
                                onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                            }
                        )
                    }
                })
            }
        });
        return meta;
    }

    tableButtonClick =(props, id, text, record, index)=>{
        switch(id){
            case 'edit':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: {type:'edit',info:[{
                            id: record[pk_item].value,
                            ts: record.ts.value
                        }]},
                    success: (res) => {
                        props.pushTo("/card", {
                            status: 'edit',
                            pagecode:'10140SBAPF_card',
                            id: record[pk_item].value,
                            errParam: JSON.stringify(record)
                        })
                    }
                });
                break;
            case 'delline':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: {type:'delete',info:[{
                            id: record[pk_item].value,
                            ts: record.ts.value
                        }]},
                    success: (res) => {
                        let id = record[pk_item].value;
                        ajax({
                            url: urls.deleteUrl,
                            data: {deleteinfo:[{
                                    id: record[pk_item].value,
                                    ts: record.ts.value
                                }]},
                            success: (res) => {
                                if (res.success&&res.data) {
                                    toast({color: 'success', title: this.state.json['10140SBAPF-000003']});/* 国际化处理： 删除成功！*/
                                    props.table.deleteCacheId(tableId,id);
                                    props.table.deleteTableRowsByIndex(tableId, index);
                                }}
                        });
                    }
                });
                break;
            case 'rowApprInfo':
                //打开审批详情页
                this.setState({
                    billId: record[pk_item].value,
                    showApprInfo: true
                })
                break;
            default:
                console.log(id, index);
                break;

        }
    }

    buttonClick(props, id) {
        switch (id) {
            case 'add':
                props.pushTo("/card",{
                    pagecode:'10140SBAPF_card',
                    status:'add'
                })
                break;
            case 'refresh':
                this.refreshAction(props,()=>{
                    toast({title:this.state.json['10140SBAPF-000004'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'delete':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: this.getvalecheckdatapk(id),
                    success: (res) => {
                        promptBox({
                            color:"warning",
                            title: this.state.json['10140SBAPF-000005'],/* 国际化处理： 确定删除*/
                            content: this.state.json['10140SBAPF-000001'],/* 国际化处理： 您确定要删除所选数据吗?*/
                            beSureBtnClick: this.deleteAction.bind(this)
                        });
                    }
                });
                break;
            case 'commit':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: this.getvalecheckdatapk(id),
                    success: (res) => {
                        ajax({
                            url:urls.commiturl,
                            data:this.getcheckdatapk(),
                            success:(res)=>{
                                if(res.data.workflow && (res.data.workflow == 'approveflow'|| res.data.workflow == 'workflow')) {
                                    this.setState({
                                        compositedata: res.data,
                                        compositedisplay: true
                                    });
                                }else{
                                    if(res.data instanceof Array){
                                        toast({ color: 'success', title: this.state.json['10140SBAPF-000006'] });/* 国际化处理： 提交成功！*/
                                        this.refreshAction(props);
                                    }else {
                                        toast({ color: 'warning', content: res.data });
                                    }
                                }
                            }
                        })
                    }
                });
                break;
            case 'recall':
                ajax({
                    url: urls.validateSupplierBankpfurl,
                    data: this.getvalecheckdatapk(id),
                    success: (res) => {
                        ajax({
                            url:urls.recallurl,
                            data:this.getcheckdatapk(),
                            success:(res)=>{
                                this.refreshAction(props);
                                toast({ color: 'success', content: this.state.json['10140SBAPF-000007'] });/* 国际化处理： 单据成功收回*/
                            }
                        })
                    }
                });
                break;
            case "print":
                let printParam={
                    funcode: "10140SBAPF",
                    nodekey: 'supplierbankpflist_ncc',
                    outputType:'print'
                };
                this.pintFunction(printParam);
                break;
            case 'output':
                let allDatas = this.props.table.getAllTableData(this.tableId);
                let pks = [];
                allDatas.rows.forEach((item,index)=>{
                    pks.push(item.values['pk_material_pf'].value)
                })
                this.setState({
                    pks:pks
                },this.refs.printOutput.open())
                break;
            default:
                break;
        }
    }

    getAssginUsedr = (value) => {
        ajax({
            url: urls.commiturl,
            data: this.getcheckdatapk(value),
            success: (res) => {
                if(res.data.workflow && (res.data.workflow == 'approveflow'|| res.data.workflow == 'workflow')) {
                    this.setState({
                        compositedata: res.data,
                        compositedisplay: true
                    });
                }else{
                    if(res.data instanceof Array){
                        this.refreshAction(this.props);
                        this.setState({
                            compositedata: null,
                            compositedisplay: false
                        });
                        toast({ color: 'success', title: this.state.json['10140SBAPF-000009'] });/* 国际化处理： 提交成功！*/
                    }else {
                        toast({ color: 'warning', content: res.data });
                    }
                }
            }
        })
    }

    turnOff=()=>{
        this.setState({
            compositedata:null,
            compositedisplay: false
        });
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
        let allDatas = this.props.table.getAllTableData(this.tableId);
        let pks = [];
        allDatas.rows.forEach((item,index)=>{
            pks.push(item.values['pk_supplierbankpf'].value)
        })
        param.oids = pks;
        let userjson = `{type:'list'}`
        param.userjson = userjson;
        if(pks.length==0){
            toast({color: 'warning', content: this.state.json['10140SBAPF-000010']});/* 国际化处理： 没有相应数据*/
            return
        }
        print(
            'pdf',
            urls.printurl,
            {...param}
        );
    }

    doubleClick = (record, index, e)=>{
        this.props.pushTo("/card", {
            status: 'browse',
            pagecode:'10140SBAPF_card',
            id: record[pk_item].value,
            errParam: JSON.stringify(record)
        });
    }

    //批量删除
    deleteAction = () =>{
        let data = this.props.table.getCheckedRows(tableId);
        let indexArr=[];
        console.log(data)
        let params = {deleteinfo:data.map((v)=>{
                let id = v.data.values[pk_item].value;
                let ts = v.data.values.ts.value;
                return {
                    id,ts
                }
                indexArr.push(v.index);
            })}
        console.log(params)
        ajax({
            url: urls.deleteUrl,
            data: params,
            success: (res) => {
                if(res.success&&res.data){
                    res.data.forEach((e)=>{
                        this.props.table.deleteCacheId(tableId,e);
                    })
                    this.props.table.deleteTableRowsByIndex(tableId, indexArr);
                    toast({color:"success",title:this.state.json['10140SBAPF-000003']});/* 国际化处理： 删除成功！*/
                }
            }
        });
    }

    refreshAction =(props,callback)=>{
        let searchVal = props.search.getAllSearchData(searchId);
        let queryInfo = this.props.search.getQueryInfo(searchId);
        if(searchVal != false){
            let data = {
                querycondition: searchVal==null?null:searchVal,
                //conditions: searchVal==null?null:searchVal.conditions,
                pageInfo:props.table.getTablePageInfo(tableId)?props.table.getTablePageInfo(tableId):
                {
                    pageIndex: 0,
                    pageSize: 10,
                    total: 0,
                    totalPage: 0
                },
                pagecode: pageId,
                queryAreaCode:searchId,  //查询区编码
                oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype:'tree'
            };

            ajax({
                url: urls.queryListUrl,
                data:data,
                success: (res) => {
                    showFormular(this.props,res,{
                        [tableId] : "SimpleTable",
                    });
                    if(res.data){
                        props.table.setAllTableData(tableId, res.data[tableId]);
                        props.button.setDisabled({
                            print:false,
                            output:false
                        });
                    }
                    this.selectedChange();
                    callback&&callback(data);
                },
                error : (res)=>{
                    console.log(res.message);
                }
            });
        }
    }

    pageInfoClick = (props, config, pks)=>{
        let data = {
            "allpks": pks,
            "pageid": pageId
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: urls.queryPageUrl,
            data: data,
            success: function(res) {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
    }

    clickSearchBtn = (props,searchVal)=>{
        setDefData("searchParams",datasource,searchVal);
        let queryInfo = this.props.search.getQueryInfo(searchId);
        this.props.search.getAllSearchData(searchId);
        let data = {
            querycondition: searchVal==null?null:searchVal,
            //conditions: searchVal==null?null:searchVal.conditions,
            pageInfo: props.table.getTablePageInfo(tableId)?props.table.getTablePageInfo(tableId):
            {
                pageIndex: 0,
                pageSize: 10,
                total: 0,
                totalPage: 0
            },
            pagecode: pageId,
            queryAreaCode:searchId,  //查询区编码
            oid:queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree'
        };

        ajax({
            url: urls.queryListUrl,
            data:data,
            success: (res) => {
                showFormular(this.props,res,{
                    [tableId] : "SimpleTable",
                });
                if(res.data){
                    props.table.setAllTableData(this.tableId, res.data[tableId]);
                    props.button.setDisabled({
                        print:false,
                        output:false
                    });
                    let count = res.data[this.tableId].allpks.length;
                    toast({content:this.state.inlt&&this.state.inlt.get('10140SBAPF-000011',{count:count}),color:'success'});/* 国际化处理： 查询成功，共,条。*/
                }else{
                    props.table.setAllTableData(this.tableId, {rows:[]});
                    toast({content:this.state.json['10140SBAPF-000012'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据！*/
                }
                this.selectedChange();
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }

    selectedChange(){
        let tableData = this.props.table.getCheckedRows(this.tableId);
        let length = tableData.length;//获取列表页选择数据的行数
        if(length === 0){//未选择数据
            this.props.button.setDisabled({
                delete: true,
                recall: true,
                commit: true
            });
        }else if(length != 0){//选择一行数据
            if(tableData[0].data.values.billstatus.value==-1){
                this.props.button.setDisabled({
                    commit: false,
                    recall: true,
                    delete:false
                });
            }else if(tableData[0].data.values.billstatus.value==1||tableData[0].data.values.billstatus.value==3){
                this.props.button.setDisabled({
                    commit: true,
                    recall: false,
                    delete:true,
                });
            }else{
                this.props.button.setDisabled({
                    delete:true,
                    commit: true,
                    recall: true,});
            }
        }
        this.setState(this.state);
    }

    closeApprove = () =>{
        this.setState({
            showApprInfo: false
        })
    }

    render() {
        let { table, button, search,modal,BillHeadInfo, socket } = this.props;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        const {createBillHeadInfo} = BillHeadInfo;

        return (<div className="nc-bill-list">
                <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                    {socket.connectMesg({
                        tableAreaCode: this.tableId,//'表格区域编码', 
                        billpkname: pk_item,//'表格行主键名',
                        // tableType: 'table', // 表格类型 默认 simpleTable  可选 editTable insertTable transferTable cardTable
                        billtypeFromList: 'billtypecode', //列表每条数据单据类型不相同时，可传billtypeFromList 从列表行数据中获取单据类型，值为单据类型字段名
                        // billtype: '单据类型',   //用于查询追溯
                        isShowView: true, // 显示立即查看按钮

                        // 本地前端调试，请传ip和端口
                        // 打包到测试环境之前 去掉
                        serverLocation: "http://10.11.115.10:80"
                    })}
                    <div className='header-title-search-area'>
                        {/* {createPageIcon()} */}
                        {/* <h2 className='title-search-detail'>{this.state.json['10140SBAPF-000008']}</h2> */}
                    {createBillHeadInfo({
                        title : this.state.json['10140SBAPF-000008'],
                        initShowBackBtn:false
                    })}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header_button_area',
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
                        oid:getDefData("OID",datasource)
                    })}
                </div>
                <div className="nc-bill-table-area">
                    {createSimpleTable(this.tableId, {
                        handlePageInfoChange: this.pageInfoClick,
                        dataSource: datasource,
                        pkname:pk_item,
                        componentInitFinished:()=>{
                            //缓存数据赋值成功的钩子函数
                            //若初始化数据后需要对数据做修改，可以在这里处理
                        },
                        tableModelConfirm: this.tableModelConfirm,
                        onSelected:this.selectedChange.bind(this),
                        onSelectedAll: this.selectedChange.bind(this),
                        showIndex:true,
                        showCheck:true,
                        onRowDoubleClick: this.doubleClick.bind(this)
                    })}
                </div>
                <PrintOutput
                    ref='printOutput'
                    url= {urls['printurl']}
                    data={{
                        funcode:'10140SBAPF',
                        nodekey:'supplierbankpf_ncc',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output",
                        userjson :`{type:'list'}`
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
                {this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['10140SBAPF-000017']}/* 国际化处理： 指派*/
                    data={this.state.compositedata}
                    display={this.state.compositedisplay}
                    getResult={this.getAssginUsedr.bind(this)}
                    cancel={this.turnOff.bind(this)}
                /> : ""}
                <ApproveDetail
                    show={this.state.showApprInfo}
                    close={this.closeApprove.bind(this)}
                    billtype='10GZ'
                    billid={this.state.billId}
                />
            </div>
        );
    }
}

List = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode: pageId,
        bodycode: tableId
    }
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65