//snj5JXCt7vbepJwkxoZo6HazdCZX3iVe6CwisuTcqrgDqZXakd9RR0ud3DDzyD16
import React,{Component} from 'react';
import {base,ajax,toast,print,high,output} from 'nc-lightapp-front';
import './Common.less';
import { showFormulaSetting } from '../utils/SupplierUtils';
const { PrintOutput } = high;
import {component} from '../../../public/platwapper/index.js';
const {NCTable} = component;
const {NCCheckbox} = base;
/**
 * liupzhc
 * 供应商 查看组织档案
 */
export default class SupBrowseOrgDoc extends Component{
    constructor(props){
        super(props);
        this.state = {
            buttonConfig:{
                area: 'supbrowseorg',
                buttonLimit: 3,
                onButtonClick: this.onBrowseOrgDocButtonClick,
            },
            printOutput:{
              data:[],
            },
            search:{
                id: 'browse_org_supplierquery',
                clickSearchBtn: () => {
                    this.queryTableData(this.setTableData,this.setPrintAndOutputData,false,true);
                },
                url:'/nccloud/uapbd/supplier/querySupplierBaseInfo.do'
            },
            supplier:{
                id:'browse_org_supplier',
                onRowClickUrl:'/nccloud/uapbd/supplier/qryHasAssignedOrg.do',
                printUrl:'/nccloud/uapbd/supplier/printSupplier.do',
                property:{
                    showIndex:true,
                    onRowClick:this.onOrgSupRecordClick,
                    style:{
                        height:'300px',
                        width:'100%',
                    },
                    handlePageInfoChange:this.onSupplierTablePageInfoChanged,
                }
            },
            assignOrg:{
                id:'assignOrg',
                data:[],
                columns:this.assignedOrg.items
            }
        }
    }
    componentDidMount = ()=>{
        this.setButtonStatus();
    }
    onSupplierTablePageInfoChanged = ()=>{
        this.setState(this.state,()=>{
            this.queryTableData(this.setTableData,this.setPrintAndOutputData);
        })
    }
    /**
     * 按钮点击事件
     * @param props
     * @param id
     */
    onBrowseOrgDocButtonClick = (props,id)=>{
        switch(id){
            case 'SupBrowOrg_Refresh'://刷新按钮
                this.queryTableData(this.setTableData,this.setPrintAndOutputData,true);
                break;
            case 'SupBrowOrg_Print'://打印按钮
                this.printAndOutput();
                break;
            case 'SupBrowOrg_Output'://输出
                let pks = this.state.printOutput.data;
                var data={
                funcode: '10140SUG', //功能节点编码，即模板编码
                nodekey: 'supplierlist', //模板节点标识
                oids: pks, //或['1001A41000000000A9LR','1001A410000000009JDD'] 单据pk oids含有多个元素时为批量打印,
                outputType: "output"
                }
                output({data: data,url:this.state.supplier.printUrl});
                break;
        }
    }
    /**
     * 通过 查询 pub_print_template表 只能查询appcode为10140CCLB的打印模板所以，这里funcode写成定值了
     *  @2018-07-16
     * @param flag
     */
    printAndOutput = ()=>{
        let pks = this.state.printOutput.data;
        if(pks){

            print('pdf',this.state.supplier.printUrl,
                {billtype:'',funcode:'10140SUG',nodekey:'supplierlist',oids:pks,outputType:'print'});
        }
    }

    /**
     * 设置打印数据
     * @param data
     * @param callback
     */
    setPrintAndOutputData = (data,callback,isRefresh)=>{
        if(data && data['supplier_baseInfo']){
            this.state.printOutput.data = data['supplier_baseInfo'].rows.map(row=>{
                return row.values['pk_supplier'].value;
            });
            this.setState(this.state,()=>{
                callback && callback(data,isRefresh);
            })
        }
    }
    /**
     * 设置表格数据
     * @param data
     */
    setTableData = (data,isRefresh) => {
        this.props.table.setAllTableData(this.state.supplier.id,data?data["supplier_baseInfo"]:{rows:[]});
        this.setButtonStatus(data["supplier_baseInfo"].rows);
        isRefresh ? toast({title:this.props.Lang['10140SUG-000200'],color:'success'}/* 国际化处理： 刷新成功！*/)
        :(data?toast({content:this.props.inlt && this.props.inlt.get('10140SUG-000086',{count:data["supplier_baseInfo"].allpks.length}),color:'success'}):/* 国际化处理： 查询成功，共 , 条。*/
        toast({content:this.props.Lang['10140SUG-000088'],color:'warning'})/* 国际化处理： 未查询出符合条件的数据！*/);
    }
    /**
     * 查询表格数据
     * @param callback
     * @param setPrintOutputData
     */
    queryTableData = (callback,setPrintOutputData,isRefresh,isClickSearch)=>{
        var search = this.props.search.getAllSearchData(this.state.search.id);
        let queryInfo = this.props.search.getQueryInfo(this.state.search.id,false);
        if(search){

            var param  = {
                formatInfo:{
                    pageInfo:this.props.table.getTablePageInfo(this.state.supplier.id),
                    querycondition: this.props.search.getAllSearchData(this.state.search.id),
                    oid: queryInfo.oid,
                    queryAreaCode:this.state.search.id,
                    querytype:'tree'
                },
                showOff:false,
                nodeType:this.props.nodeType,
                pk_curOrg:this.props.envParam.pk_org,
                queryOrgData:true,
                operate:'browse_org_doc'
            };
            ajax({
                url:this.state.search.url,
                data:param,
                success:(res)=>{
                    showFormulaSetting.call(this,res,{[this.state.supplier.id]:'simpleTable'});
                    res.success && setPrintOutputData && setPrintOutputData(res.data,callback,isRefresh);
                }
            })
        }
    }


    setButtonStatus = (datas)=>{
        this.props.button.setButtonDisabled(['SupBrowOrg_Refresh'],false);
        let data = datas || this.props.table.getAllTableData(this.state.supplier.id).rows;
        this.props.button.setButtonDisabled(['SupBrowOrg_Print','SupBrowOrg_Output'],!(data && data.length>0));
    }
    /**
     * 查询已分配的组织
     * @param pk_supplier
     */
    queryHasAssignedOrg = (pk_supplier)=>{
        debugger
        ajax({
            url:this.state.supplier.onRowClickUrl,
            data:{pk_supplier:pk_supplier},
            success:(res)=>{
                if(res.success){
                    this.state.assignOrg.data = !!res.data?res.data:[];
                    this.setState(this.state);
                }
            }
        })
    }
    clearHasAssignTableData = (callback)=>{
        this.state.assignOrg.data = [];
        this.setState(this.state,callback);
    }
    /**
     * 组织级供应商行点击事件
     * @param props
     * @param moduleId
     * @param record
     * @param index
     */
    onOrgSupRecordClick = (props,moduleId,record,index)=>{
        this.queryHasAssignedOrg(record['pk_supplier'].value);
    }
    assignedOrg = {
        code: "assignedOrg",
        name: this.props.Lang['10140SUG-000081'],/* 国际化处理： 已分配组织*/
        pageid: "10140SUB_base",
        items: [
            {
                itemtype: "refer",
                col: "4",
                label: this.props.Lang['10140SUG-000082'],/* 国际化处理： 序号*/
                maxlength: "10",
                title:this.props.Lang['10140SUG-000082'],/* 国际化处理： 序号*/
                dataIndex: 'id',
                width:"10%",
                visible: true,
                disabled: true,
                attrcode: "id",
                fixed:'left',
                key:'1'
            },
            {
                itemtype: "input",
                col:"4",
                visible: true,
                label: "",
                title:this.props.Lang['10140SUG-000081'],/* 国际化处理： 已分配组织*/
                dataIndex: 'name',
                width:"25%",
                maxlength: "40",
                attrcode: "name",
                key:'2'
            },
            {
                itemtype: "label",
                col: "4",
                visible: true,
                label: this.props.Lang['10140SUG-000083'],/* 国际化处理： 启用状态*/
                title:this.props.Lang['10140SUG-000083'],/* 国际化处理： 启用状态*/
                dataIndex: 'enablestate',
                width:"25%",
                maxlength: "100",
                disabled: false,
                attrcode: "enablestate",
                key:'3',
                render:(text,record)=>{
                    return (
                        <span fieldid='enablestate'>
                           {record['enablestate'] == '2'?this.props.Lang['10140SUG-000078']:this.props.Lang['10140SUG-000079']} 
                        </span>
                    )
                }
            },

            {
                itemtype: "checkbox",
                col: "4",
                visible: true,
                label: this.props.Lang['10140SUG-000084'],/* 国际化处理： 财务*/
                title:this.props.Lang['10140SUG-000084'],/* 国际化处理： 财务*/
                dataIndex: 'isfinanceorg',
                width:"20%",
                maxlength: "100",
                attrcode: "isfinanceorg",
                key:'4',
                render:(text,record)=>{
                    return (
                        <span fieldid="isfinanceorg">
                            <NCCheckbox disabled={true} checked={record['isfinanceorg']}/>
                        </span>
                    )
                }
            },
            {
                itemtype: "checkbox",
                col: "4",
                visible: true,
                label: this.props.Lang['10140SUG-000085'],/* 国际化处理： 采购*/
                title:this.props.Lang['10140SUG-000085'],/* 国际化处理： 采购*/
                dataIndex: 'isstockorg',
                width:"20%",
                maxlength: "100",
                attrcode: "isstockorg",
                key:'4',
                render:(text,record)=>{
                    return (
                        <span fieldid="isstockorg">
                            <NCCheckbox disabled={true} checked={record['isstockorg']} />
                        </span>
                    )
                }
            }
        ]
    }
    render(){
        const {button,table,search} = this.props;
        const {createButtonApp} = button;
        const {createSimpleTable} = table;
        const {NCCreateSearch}=search;
        return (

            <div className="nc-single-table">  
                <div className="nc-singleTable-header-area" >
                    <div className="header-button-area">
                     {createButtonApp(this.state.buttonConfig)}
                    </div>
                </div>
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch(this.state.search.id,this.state.search)}    
                </div>
                <div className="nc-singleTable-table-area">
                    {createSimpleTable(this.state.supplier.id, this.state.supplier.property)}
                    <NCTable
                            fieldid ={'assignorg'}
                            className='bottom-table'
                            data={this.state.assignOrg.data}
                            columns={this.state.assignOrg.columns}
                        />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url= {this.state.supplier.printUrl}
                    data={this.state.printOutput.data}
                >
                </PrintOutput>
            </div>
        )
    }
}





// {/* <div className="ncc-hr-multi-child-card-container" >
// <div className="ncc-hr-multi-child-card-header">
//     <div className='nc-bill-header-area'>
//         <div className="header-button-area">
//             {createButtonApp(this.state.buttonConfig)}
//         </div>
//     </div>
// </div>
// <div className="ncc-hr-multi-child-card-body" >
//     <div className="nc-singleTable-search-area ncc-hr-search-margin" >
//         {NCCreateSearch(this.state.search.id,this.state.search)}
//     </div>
//     <div className="nc-bill-table-area">
//         <div className='top-table'>
//             {createSimpleTable(this.state.supplier.id, this.state.supplier.property)}
//         </div>
//         <NCTable
//             liAttr={{fieldid:'assignorg_table'}}
//             className='bottom-table'
//             data={this.state.assignOrg.data}
//             columns={this.state.assignOrg.columns}
//         />
//     </div>
// </div>
// <PrintOutput
//     ref='printOutput'
//     url= {this.state.supplier.printUrl}
//     data={this.state.printOutput.data}
//     //callback={this.onSubmit}
// >
// </PrintOutput>
// </div> */}

//snj5JXCt7vbepJwkxoZo6HazdCZX3iVe6CwisuTcqrgDqZXakd9RR0ud3DDzyD16