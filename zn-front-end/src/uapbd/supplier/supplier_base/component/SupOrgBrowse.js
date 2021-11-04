//ePpr4Rg/KeOhadvlC0zNyTInZ3/bBsPu3/oNINzdvcLJIY4/zgyBbLbGQ/NtoA2X
import React,{Component} from 'react';
import {base,ajax,toast,print,high} from 'nc-lightapp-front';
import './Common.less';
import { showFormulaSetting } from '../utils/SupplierUtils';
const {NCTabs} = base;
const {NCTabPane} = NCTabs;
const {PrintOutput}= high;
import SyncLoadComp from '../utils/SyncLoadComp';
let referUrls = {
    FinanceOrg:'uapbd/refer/org/FinanceOrgTreeRef/index',
    PurchaseOrg:'uapbd/refer/org/PurchaseOrgGridRef/index'
}

const urls = {
    queryFinanceUrl:'/nccloud/uapbd/supplier/qrySupFinance.do',
    queryPurchaseUrl:'/nccloud/uapbd/supplier/qrySupStock.do',
    printFinanceUrl:'/nccloud/uapbd/supplier/printFinance.do',
    printStockUrl:'/nccloud/uapbd/supplier/printStock.do'
};
/**
 * liupzhc
 * 供应商 按组织查看
 * 2018年8月9日收拾完该页面
 */
class SupOrgBrowse extends Component{
    constructor(props){
        super(props);
        this.state={
            afterLoad:false,
            buttonConfig:{
                area: 'suporgbrowse',
                buttonLimit: 3,
                onButtonClick: this.onOrgBrowseButtonClick,
            },
            curTabPane:'orgBrowseFinance',//当前页签
            finanaceOrg:{
                onChange:this.onFinanceOrgChanged,
                value:undefined,
                popWindowClassName:'ncc-hr-popover-zindex',
                isShowUnit:false,
                fieldid:'financeorg',
                isMultiSelectedEnabled:false,
                queryCondition:{
                    AppCode:this.props.appcode,
                    orgType:'FINANCEORGTYPE000000',
                    TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                }
            },
            purchaseOrg:{
                onChange:this.onPurchaseOrgChanged,
                value:undefined,
                fieldid:'purchaseorg',
                popWindowClassName:'ncc-hr-popover-zindex',
                isShowUnit:false,
                queryCondition:{
                    AppCode:this.props.appcode,
                    orgType:'PURCHASEORGTYPE00000',
                    GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    
                    //TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
            },
            finance:{
                id:'orgBrowseFinance',
                property: {
                    showIndex: true,
                    handlePageInfoChange:this.handleTablePageInfo.bind(this,'orgBrowseFinance'),
                }
            },
            purchase:{
                id:'orgBrowsePurchase',
                property:{
                    showIndex:true,
                    handlePageInfoChange:this.handleTablePageInfo.bind(this,'orgBrowsePurchase'),
                    onRowClick:this.onPurchaseRrecordClick.bind(this,this.querySupAddressTableData)
                }
            },
            supaddress:{
                id:'orgBrowseSupAddress',
                property:{
                    showIndex:true,
                   // handlePageInfoChange:this.handleTablePageInfo.bind(this,'orgBrowsePurchase'),
                }
            },
            pk_supstock:null,
            printPks:undefined,
        }
    }
    componentWillMount(){
        SyncLoadComp.call(this,{
            props:this.props,
            urlsArr:Object.values(referUrls),
            success:this.afterInitLoad,
            fail:this.afterInitLoad
        });
    }
    /**
     * 加载参照功能之后
     */
    afterInitLoad = ()=>{
        this.setState({afterLoad:true},this.changeButtonStatus);
    }
    componentDidMount(){
        
    }
    
    /**
     * 按组织查询回复初始界面
     */
    initOrgBrowsePage = (callback)=>{
        this.state.purchaseOrg.value = null;
        this.state.finanaceOrg.value = null;
        this.setState({curTabPane:null},()=>{
            setTimeout(() => {
                // 2018-08-31 测试这种方式清空数据不好使，所以采用上面的方式清空数据
                this.props.table.setAllTableData(this.state.finance.id,{rows:[]});
                this.props.table.setAllTableData(this.state.purchase.id,{rows:[]});
                this.props.table.setAllTableData(this.state.supaddress.id,{rows:[]});
                callback && callback();
            }, 0)

        })
    }
    handleTablePageInfo = (key,props,config,pks)=>{
        this.setState(this.state,()=>{
            this.queryTableData(key,this.setTableData);
        })
    }
    /**
     * 设置表格数据
     */
    setTableData = (tableId,data,isRefresh)=>{
        if(tableId == this.state.finance.id){
            /**********************************
             * 财务信息table赋值
             **********************************/
            this.props.table.setAllTableData(tableId,data?data[tableId]:{rows:[]});
            
        }else if(tableId == this.state.purchase.id){
            /**********************************
             * 采购信息table赋值
             **********************************/
            this.props.table.setAllTableData(tableId,data?data[tableId][tableId]:{rows:[]});
            /**********************************
             * 采购信息子表table赋值
             **********************************/
            this.props.table.setAllTableData(this.state.supaddress.id,
                (data && data[this.state.supaddress.id])?data[this.state.supaddress.id][this.state.supaddress.id]:{rows:[]});

        }else{
            /**********************************
             * 点击采购信息时 给采购信息子表赋值
             **********************************/
            this.props.table.setAllTableData(this.state.supaddress.id,
                (data && data[this.state.supaddress.id])?data[this.state.supaddress.id][this.state.supaddress.id]:{rows:[]});
        }
        this.changeButtonStatus();
        isRefresh && toast({title:this.props.Lang['10140SUG-000200'],color:'success'})/* 国际化处理： 刷新成功！*/ 
    }
    /**
     * 查询表格数据
     * @param key
     * @param callback
     */
    queryTableData = (key,callback,isRefresh)=>{
        // if((key==this.state.finance.id && !this.state.finanaceOrg.value.refpk) || (key==this.state.purchase.id && !this.state.purchaseOrg.value.refpk) ){
        //     return;
        // } 
        /******************************************************
         * 根据key判断 查询的是财务信息表格数据 还是采购信息表格数据
         ******************************************************/
        ajax({
            url:key==this.state.finance.id?urls.queryFinanceUrl:urls.queryPurchaseUrl,
            data:{
                pk_org:key==this.state.finance.id?this.state.finanaceOrg.value.refpk:this.state.purchaseOrg.value.refpk,
                pageInfo:this.props.table.getTablePageInfo(key),
                nodeType:this.props.nodeType
            },
            success:(res)=>{
                showFormulaSetting.call(this,res,{[key]:'simpleTable'})
                /***********************************************
                 * 回调执行表格赋值
                 ***********************************************/
                res.success && callback && callback(key,res.data,isRefresh);
            },
            error:(e)=>{
                callback && callback(key,null,isRefresh);
            }
        })
    }
    /**
     * 查询发货地址列表数据
     * @param pk_supplier
     * @param setTableData
     */
    querySupAddressTableData = (setTableData)=>{
        ajax({
            url:urls.queryPurchaseUrl,
            data:{
                pk_supstock:this.state.pk_supstock,
                pageInfo:this.props.table.getTablePageInfo(this.state.purchase.id),
                nodeType:this.props.nodeType
            },
            success:(res)=>{
                //显示公式
                showFormulaSetting.call(this,res,{[this.state.supaddress.id]:'simpleTable'})
                setTableData && setTableData(this.state.supaddress.id,res.data);
            }
        })
    }
    /**
     * 按组织查看弹出框  按钮事件
     * @param props
     * @param id
     */
    onOrgBrowseButtonClick = (props,id)=>{
        switch(id){
            case 'OrgBrowse_Refresh'://刷新按钮
                this.queryTableData(this.state.curTabPane,this.setTableData,true);
                break;
            case 'OrgBrowse_Print'://打印按钮
                this.printTableData(this.state.curTabPane);
                break;
            case 'OrgBrowse_Output'://输出
                this.setState({printPks:this.getAllTableDataPks(this.state.curTabPane)},()=>{
                    this.refs.printOutput.open();
                })
                break;
        }
    }

    /**
     * 根据tableId 打印不同的表格数据
     * @param tableId
     */
    printTableData = (tableId)=>{
        let pks = this.getAllTableDataPks(tableId);
        if(pks && pks.length>0){
            print('pdf',
                urls[tableId=='orgBrowseFinance'?'printFinanceUrl':'printStockUrl'],
                {billtype:'',funcode:this.props.appcode,nodekey:tableId=='orgBrowseFinance'?'financeorgbrowse':'stockorgbrowse',oids:pks,outputType:'print'});
        }
    }
    /**
     * 获得表格所有数据的主键数组
     * @param tableId
     * @returns {*}
     */
    getAllTableDataPks = (tableId)=>{
        let tableData = this.props.table.getAllTableData(tableId);
        if(tableData){
            return tableData.rows.map(record=>{
                return record.values[tableId=='orgBrowseFinance'?'pk_supfinance':'pk_supstock'].value;
            })
        }
        return [];
    }
    /**
     * 财务组织参照选择改变事件
     * @param value
     */
    onFinanceOrgChanged = (value)=>{
        this.state.finanaceOrg.value = value;
        this.setState(this.state,()=>{
            this.queryTableData(this.state.curTabPane,this.setTableData);
        });
    }
    /**
     * 采购组织参照选择改变事件
     * @param value
     */
    onPurchaseOrgChanged = (value)=>{
        this.state.purchaseOrg.value = value;
        this.setState(this.state,()=>{
            this.queryTableData(this.state.curTabPane,this.setTableData);
        });
    }
    /**
     * 点击采购信息行事件
     * @param querySupAddressTableData
     * @param props
     * @param moduleId
     * @param record
     */
    onPurchaseRrecordClick = (querySupAddressTableData,props, moduleId, record)=>{
        this.setState({pk_supstock:record['pk_supstock'].value},()=>{
            querySupAddressTableData &&querySupAddressTableData(this.setTableData);
        })

    }
    /**
     * TabPane 切换事件
     * @param key
     */
    onTabPaneChanged = (key)=>{
        this.setState({curTabPane:key},()=>{
            this.changeButtonStatus();
        });
    }

    changeButtonStatus = ()=>{
        let tableData = this.props.table.getAllTableData(this.state.curTabPane);
        let refreshDisabled = this.state.curTabPane == 'orgBrowseFinance'?(!(this.state.finanaceOrg.value && this.state.finanaceOrg.value.refpk)):(!(this.state.purchaseOrg.value && this.state.purchaseOrg.value.refpk));
        //设置刷新可用性
        this.props.button.setButtonDisabled({OrgBrowse_Refresh:refreshDisabled});
        setTimeout(()=>{
            let printDisabled = !(tableData && tableData.rows && tableData.rows.length>0);
            //设置打印输出可用性
            this.props.button.setButtonDisabled(['OrgBrowse_Print','OrgBrowse_Output'],printDisabled);
            // this.props.button.setButtonDisabled({OrgBrowse_Print:printDisabled,OrgBrowse_Output:printDisabled});
        },0);
        

        
    }

    render(){
        const {table,button} = this.props;
        let {createSimpleTable} = table;
        let { createButtonApp } = button;
        let me = this;
        let {purchaseOrg,finanaceOrg,afterLoad} = this.state;
        let {FinanceOrg,PurchaseOrg} = referUrls;
        if(!afterLoad){
            return '';
        }
        return (
            <div className="nc-bill-list">
                <div className="nc-bill-header-area">
                    <div className="header-button-area">
                    {createButtonApp(this.state.buttonConfig)}
                    </div>
                </div>
                <div className="tab-definInfo-area">
                <NCTabs
                            tabBarPosition={"top"}
                            defaultActiveKey={this.state.curTabPane || this.state.finance.id}
                            activeKey={this.state.curTabPane || this.state.finance.id}
                            onChange={this.onTabPaneChanged}
                        >
                            <NCTabPane
                                key={this.state.finance.id}
                                tab={this.props.Lang['10140SUG-000112']}
                            >
                                <div className="nc-single-table" >
                                    <div className="nc-singleTable-header-area" >
                                        <div className="header-title-search-area" >
                                            {window[FinanceOrg].default(finanaceOrg)}
                                            {/* {FinanceOrg(this.state.finanaceOrg)} */}
                                        </div>
                                    </div>
                                    <div className="nc-singleTable-table-area">
                                        {createSimpleTable(this.state.finance.id,this.state.finance.property)}
                                    </div>
                                </div>
                            </NCTabPane>

                            <NCTabPane
                                key={this.state.purchase.id}
                                tab={this.props.Lang['10140SUG-000113']}
                            >
                                <div className="nc-single-table" >
                                    <div className="nc-singleTable-header-area" >
                                        <div className="header-title-search-area" >
                                            {window[PurchaseOrg].default(purchaseOrg)}
                                            {/* {PurchaseOrg(this.state.purchaseOrg)} */}
                                        </div>
                                    </div>
                                    <div className="nc-singleTable-table-area">
                                        {createSimpleTable(me.state.purchase.id,me.state.purchase.property)}
                                        {createSimpleTable(me.state.supaddress.id,me.state.supaddress.property)}
                                    </div>
                                </div>
                            </NCTabPane>
                        </NCTabs>
                </div>
                <PrintOutput
                    ref='printOutput'
                    url= {this.state.curTabPane=='orgBrowseFinance'?urls.printFinanceUrl:urls.printStockUrl}
                    data={{
                        funcode:this.props.appcode,
                        nodekey:this.state.curTabPane=='orgBrowseFinance'?'financeorgbrowse':'stockorgbrowse',     //模板节点标识
                        oids: this.state.printPks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                >
                </PrintOutput>
            </div>

            )
    }
}
export default SupOrgBrowse





// /* <div className="ncc-hr-multi-child-card-container suporgbrowse" >
// <div className="ncc-hr-multi-child-card-header">
//     <div className='nc-bill-header-area'>
//         <div className="header-button-area">
//             {createButtonApp(this.state.buttonConfig)}
//         </div>
//     </div>
// </div>
// <div className="ncc-hr-multi-child-card-body">
//     <div className="nc-bill-table-area">
//         <NCTabs
//             tabBarPosition={"top"}
//             defaultActiveKey={this.state.curTabPane || this.state.finance.id}
//             activeKey={this.state.curTabPane || this.state.finance.id}
//             onChange={this.onTabPaneChanged}
//         >
//             <NCTabPane
//                 key={this.state.finance.id}
//                 tab={this.props.Lang['10140SUG-000112']}
//             >
//                 <div className="nc-single-table" >
//                     <div className="nc-singleTable-header-area" >
//                         <div className="header-title-search-area" >
//                             {FinanceOrg(this.state.finanaceOrg)}
//                         </div>
//                     </div>
//                     <div className="nc-singleTable-table-area">
//                         {createSimpleTable(this.state.finance.id,this.state.finance.property)}
//                     </div>
//                 </div>
//             </NCTabPane>

//             <NCTabPane
//                 key={this.state.purchase.id}
//                 tab={this.props.Lang['10140SUG-000113']}
//             >
//                 <div className="nc-single-table" >
//                     <div className="nc-singleTable-header-area" >
//                         <div className="header-title-search-area" >
//                             {PurchaseOrg(this.state.purchaseOrg)}
//                         </div>
//                     </div>
//                     <div className="nc-singleTable-table-area">
//                         {createSimpleTable(me.state.purchase.id,me.state.purchase.property)}
//                         {createSimpleTable(me.state.supaddress.id,me.state.supaddress.property)}
//                     </div>
//                 </div>
//             </NCTabPane>
//         </NCTabs>
//     </div>
// </div>
// <PrintOutput
//     ref='printOutput'
//     url= {this.state.curTabPane=='orgBrowseFinance'?urls.printFinanceUrl:urls.printStockUrl}
//     data={{
//         funcode:this.props.appcode,
//         nodekey:this.state.curTabPane=='orgBrowseFinance'?'financeorgbrowse':'stockorgbrowse',     //模板节点标识
//         oids: this.state.printPks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
//         outputType: "output"
//     }}
// >
// </PrintOutput>
// </div> */
//ePpr4Rg/KeOhadvlC0zNyTInZ3/bBsPu3/oNINzdvcLJIY4/zgyBbLbGQ/NtoA2X