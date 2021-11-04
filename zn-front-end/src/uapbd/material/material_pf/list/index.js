//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base ,toast,print,high,cardCache,promptBox,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
const { PrintOutput,ApproveDetail,ApprovalTrans,ExcelImport } = high;
let {setDefData, getDefData } = cardCache;
const { NCDiv } = base;
import utils from '../../../public/utils';
const {showFormular } = utils;
//import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';
import createUIDom from "../../../public/utils/BDCreateUIDom";


const pageId = '10140MPF_approve';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'material_pf';                 //表头id
const oid = '1008Z010000000002SB5';     //查询区oid
const appcode = '10140MPF';   //注册按钮id
const linkItem = 'billno';        //列表卡片跳转字段
const pk_item = 'pk_material_pf';             //列表主键
const titleName = '10140MPF-000007';			 //节点名称/* 国际化处理： 物料申请单*/
const datasource = 'uapbd.material.material_pf.dataSource';

let urls={
    queryListUrl:'/nccloud/uapbd/materialpf/querymaterialpf.do',
    deleteUrl:'/nccloud/uapbd/materialpf/deleteMaterialpf.do',
    commiturl:'/nccloud/uapbd/materialpf/commitMaterialpf.do',
    recallurl:'/nccloud/uapbd/materialpf/recallMaterialpf.do',
    printurl:'/nccloud/uapbd/materialpf/printMaterialpfInfo.do',
    queryPageUrl:'/nccloud/uapbd/materialpf/queryMaterialpfPage.do',
    validateMaterialpfUrl:'/nccloud/uapbd/materialpf/validateMaterialpf.do',
};


class List extends Component {
    constructor(props) {
        super(props);
        this.searchId = searchId;
        this.tableId = tableId;
        this.oid = oid;
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

        let _this = this;
        createUIDom(props)(
            {
                pagecode: pageId//页面id
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
                        props.button.setPopContent('delline',this.state.json['10140MPF-000037']) /* 设置操作列上删除按钮的弹窗提示 */

                        let excelimportconfig = excelImportconfig(props,'uapbd','material_pf',true,'',{appcode: appcode,pagecode: '10140MPF_approve_card'},()=>{
                            this.refreshAction(this.props);
                        });
                        props.button.setUploadConfig("import",excelimportconfig);
                        props.button.setButtons(button);
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
                                    id: record[pk_item].value//列表卡片传参
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
            if(item.attrcode == 'pk_marbasclass'){
                item.isMultiSelectedEnabled = true;
                item.isShowDisabledData = true;
                item.isShowUnit=true;
                item.unitPropsExtend = {
                    isShowDisabledData : true
                };

            }
            if(item.attrcode == 'pk_targetorg'){
                item.isShowDisabledData = true;
            }
            if(item.attrcode == 'pk_billtypecode'){
                item.isMultiSelectedEnabled = true;
            }
            if(item.attrcode == 'proposer'){
                item.isMultiSelectedEnabled = true;
                item.isShowDisabledData = true;
            }
            if(item.attrcode == 'approver'){
                item.isMultiSelectedEnabled = true;
                item.isShowDisabledData = true;
            }
            if(item.attrcode == 'creator'){
                item.isMultiSelectedEnabled = true;
                item.isShowDisabledData = true;
            }
            if(item.attrcode == 'modifier'){
                item.isMultiSelectedEnabled = true;
                item.isShowDisabledData = true;
            }
        })
        //添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10140MPF-000010'],/* 国际化处理： 操作*/
            width: 200,
            fixed: 'right',
            className : 'table-opr',
            visible: true,
            itemtype: 'customer',
            render: (text, record, index) => {
                let btnArray = record.billstatus.value == -1?['edit','delline']:['RowApprInfo'];
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

    tableButtonClick =(props, id, text, record, index)=>{
        switch(id){
            case 'edit':
                ajax({
                    url: urls.validateMaterialpfUrl,
                    data: {type:'edit',info:[{
                            id: record[pk_item].value,
                            ts: record.ts.value
                        }]},
                    success: (res) => {
                        props.pushTo("/card", {
                            status: 'edit',
                            id: record[pk_item].value
                        })
                    }
                });
                break;
            case 'delline':
                ajax({
                    url: urls.validateMaterialpfUrl,
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
                                    toast({color: 'success', title: this.state.json['10140MPF-000025']});/* 国际化处理： 删除成功！*/
                                    props.table.deleteCacheId(tableId,id);
                                    props.table.deleteTableRowsByIndex(tableId, index);
                                }}
                        });
                    }
                });
                break;
            case 'RowApprInfo':
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

    componentDidMount() {

    }

    buttonClick(props, id) {
        switch (id) {
            case 'add':
                props.pushTo("/card",{
                    status:'add'
                })
                break;
            case 'refresh':
                this.refreshAction(props,()=>{
                    toast({title:this.state.json['10140MPF-000013'],color:'success'})/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'delete':
                ajax({
                    url: urls.validateMaterialpfUrl,
                    data: this.getvalecheckdatapk(id),
                    success: (res) => {
                        promptBox({
                            color:"warning",
                            title: this.state.json['10140MPF-000011'],/* 国际化处理： 确定删除*/
                            content: this.state.json['10140MPF-000012'],/* 国际化处理： 您确定要删除所选数据吗?*/
                            beSureBtnClick: this.deleteAction.bind(this)
                        });
                    }
                });
                break;
            case 'commit':
                ajax({
                    url: urls.validateMaterialpfUrl,
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
                                        toast({ color: 'success', title: this.state.json['10140MPF-000016'] });/* 国际化处理： 提交成功！*/
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
                    url: urls.validateMaterialpfUrl,
                    data: this.getvalecheckdatapk(id),
                    success: (res) => {
                        ajax({
                            url:urls.recallurl,
                            data:this.getcheckdatapk(),
                            success:(res)=>{
                                this.refreshAction(props);
                                toast({ color: 'success', content: this.state.json['10140MPF-000038'] });/* 国际化处理： 单据成功收回*/
                            }
                        })
                    }
                });
                break;
            case "print":
                let printParam={
                    funcode: "10140MPF",
                    nodekey: 'materialpflist',
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
            case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
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
                        toast({ color: 'success', title: this.state.json['10140MPF-000016'] });/* 国际化处理： 提交成功！*/
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
            pks.push(item.values['pk_material_pf'].value)
        })
        param.oids = pks;
        let userjson = `{type:'list'}`
        param.userjson = userjson;
        if(pks.length==0){
            toast({color: 'warning', content: this.state.json['10140MPF-000039']});/* 国际化处理： 没有相应数据*/
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
            id: record[pk_item].value,
            pagecode:"10140MPF_approve_card"
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
                indexArr.push(v.index);
                return {
                    id,ts
                }
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
                    toast({color:"success",title:this.state.json['10140MPF-000025']});/* 国际化处理： 删除成功！*/
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
                    console.log(res);
                    if(res.data){
                        showFormular(this.props,res,{
                            "material_pf" : "SimpleTable",
                        });
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
                showFormular(props,res,{
                    "material_pf" : "SimpleTable",
                });
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
                console.log(res);
                showFormular(this.props,res,{
                    "material_pf" : "SimpleTable",
                });
                if(res.data){
                    props.table.setAllTableData(this.tableId, res.data[tableId]);
                    props.button.setDisabled({
                        print:false,
                        output:false
                    });
                    let count = res.data[this.tableId].allpks.length;
                    toast({content:this.state.inlt&&this.state.inlt.get('10140MPF-000040',{count:count}),color:'success'});/* 国际化处理： 查询成功，共,条。*/
                }else{
                    props.table.setAllTableData(this.tableId, {rows:[]});
                    toast({content:this.state.json['10140MPF-000042'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据！*/
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
        let { table, button, search,modal,BillHeadInfo } = this.props;
        let {createModal} = modal;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp , getButtons } = button;
        const {createBillHeadInfo} = BillHeadInfo;
        return (<div className="nc-bill-list">
                <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                    <div className='header-title-search-area' >
                        {/* {createPageIcon()}
                        <h2 className='title-search-detail'>{this.state.json['10140MPF-000007']}</h2> */}
                        {createBillHeadInfo({
                        title : this.state.json['10140MPF-000007'],
                        initShowBackBtn:false
                    })}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',
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
                            let allDatas = this.props.table.getAllTableData(this.tableId);
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
                <PrintOutput
                    ref='printOutput'
                    url= {urls['printurl']}
                    data={{
                        funcode:'10140MPF',
                        nodekey:'materialpflist',     //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output",
                        userjson :`{type:'list'}`
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
                {this.state.compositedisplay ? <ApprovalTrans
                    title={this.state.json['10140MPF-000033']}/* 国际化处理： 指派*/
                    data={this.state.compositedata}
                    display={this.state.compositedisplay}
                    getResult={this.getAssginUsedr.bind(this)}
                    cancel={this.turnOff.bind(this)}
                /> : ""}
                <ApproveDetail
                    show={this.state.showApprInfo}
                    close={this.closeApprove.bind(this)}
                    billtype='10WL'
                    billid={this.state.billId}
                />
                <ExcelImport
                    {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = 'material_pf'//单据类型
                    selectedPKS = {[]}
                    appcode={appcode}
                    pagecode='10140MPF_approve_card'
                />
            </div>
        );
    }
}

List = createPage({
    billinfo:[{
        billtype: 'grid',
        pagecode: "10140MPF_approve",
        bodycode: 'material_pf'
    }]
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65