//lp+4wY7sTGysdn+EGIcDDn9PYHo0TyJoNvxyooP1TkIyyZrdvo7DCRxpR1KLIxeX
import React,{Component} from 'react';
import {base,ajax,toast} from 'nc-lightapp-front';
const {NCCheckbox,NCScrollElement} = base;
import Table from '../../../public/excomponents/Table';
import {showFormulaSetting} from "../utils/SupplierUtils";
/**
 * liupzhc
 * 供应商 已分配组织查询
 */
export default class QueryHasAssignOrg extends Component{
    constructor(props){
        super(props);
        this.state = {
            url:'/nccloud/uapbd/supplier/enablestateSupAssignedOrg.do',
            buttonConfig:{
                area: 'queryHasAssignOrg',
                buttonLimit: 3,
                onButtonClick: this.onQueryHasAssignOrgButtonClick,
            },
            supplier:{
                id:'queryHasAssignOrg_supplier',
                action:{}
            },
            queryAssignedOrg:{
                id:'queryAssignedOrg',
                data:[],
                columns:this.queryAssignedOrg.items,
            }
        }
    }
    /**
     * 按钮点击事件
     * @param props
     * @param id
     */
    onQueryHasAssignOrgButtonClick = (props,id)=>{
        // if(!multiLevelManage.call(this,this.props.selectedRecords,id)){
        //     return;
        // }
        let checkedRows = this.Table.getSelectRecord();///this.Table.getCheckedRecords();
        !!checkedRows?this.changeRecordsStatus([checkedRows].map(record=>{return record.getData()}),id)
            :toast({content:this.props.Lang['10140SUG-000080'],color:'warning'});/* 国际化处理： 未选中记录！*/
    }
    /**
     * 改变行启用状态
     * @param datas
     * @param id
     */
    changeRecordsStatus = (datas,id)=>{
        debugger
        let minRecord = this.getMatchRecordData(datas,id);
        ajax({
            url:this.state.url,
            data:{
                pk_suporg:minRecord['pk_suporg'],
                pk_supplier:minRecord['pk_supplier'],
                enablestate:id=='QueryHasAssignOrg_Enable'
            },
            success:(res)=>{
                if(res.success && res.data){
                    debugger
                    minRecord['enablestate'] = id=='QueryHasAssignOrg_Enable'?'2':'3';


                    this.state.queryAssignedOrg.data.find(row=>{
                        if(row['pk_suporg'] == minRecord['pk_suporg']){
                            row['enablestate'] = id=='QueryHasAssignOrg_Enable'?'2':'3';
                        }
                    });
                    this.setState(this.state,()=>{
                        this.Table.loadData(this.state.queryAssignedOrg.data);
                    })

                }
            }
        })
    }
    /**
     * 获得需要停用或启用的第一条数据
     * @param datas
     * @param id
     * @returns {number | * | T}
     */
    getMatchRecordData = (datas,id)=>{
        let flag = id=='QueryHasAssignOrg_Enable'?'3':'2';
        return datas.find(data=>{
            return data['enablestate'] == flag;
        })
    }
    setHasAssignOrgTableColumn = (columns,callback)=>{
        this.state.queryAssignedOrg.columns = columns.map(col=>{return Object.assign(col,{
            dataIndex:col.attrcode,
            title:col.label
        })});
        this.setState(this.state,callback);
    }
    /**
     * 设置页面数据
     * @param res
     */
    setData = (res)=>{
        var data = res.data;
        showFormulaSetting.call(this,res,{
            [this.state.supplier.id]:'form'
        })
        this.props.form.setAllFormValue({[this.state.supplier.id]:data.form[this.state.supplier.id]});
        this.state.queryAssignedOrg.data = [];
        this.Table.clearTableData(()=>{
            if(data.grid){
                this.state.queryAssignedOrg.data = data.grid;
                this.Table.loadData(data.grid);
            }
            this.setState(this.state,()=>{
                this.initButtonStatus(true);
            });
        });
    }
    /**
     * 列表模板
     * @type {{code: string, name: string, pageid: string, items: *[]}}
     */
    queryAssignedOrg = {
        code: "queryAssignedOrg",
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
                        <span fieldid="enablestate">
                            { record.getData()['enablestate']=='2'?this.props.Lang['10140SUG-000078']:this.props.Lang['10140SUG-000079']}
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
                            <NCCheckbox  disabled={true} checked={record.getData()['isfinanceorg']}/>   
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
                            <NCCheckbox disabled={true} checked={record.getData()['isstockorg']}/>          
                        </span>
                        
                    )
                }
            }
        ]
    }
    /**
     * 行勾选改变事件
     * @param records
     * @param me
     * @param table
     */
    onRecordCheckedChange = (records, me, table)=>{
        debugger
        if(records && records.length>0){
            let disablestateRow = records.find(record=>{return record.getData()['enablestate'] != '2'});
            //这里必须加！！
            !!disablestateRow ? this.changeButtonStatus(disablestateRow.getData()['enablestate']=='2'):this.changeButtonStatus(true);
        }else{
            this.initButtonStatus(false);
        }
    }

    onSelectedChange = (record, me, table)=>{
        if(record && record.getData()){
            let disablestateRow = [record].find(row=>{return row.getData()['enablestate'] != '2'});
            //这里必须加！！
            !!disablestateRow ? this.changeButtonStatus(disablestateRow.getData()['enablestate']=='2'):this.changeButtonStatus(true);
        }else{
            this.initButtonStatus(false);
        }
    }
    /**
     * 初始按钮状态
     */
    initButtonStatus = (flag)=>{
        this.props.button.setButtonDisabled(['QueryHasAssignOrg_Disable','QueryHasAssignOrg_Enable'],flag);
    }
    /**
     * 改变按钮状态
     * @param flag
     */
    changeButtonStatus = (flag)=>{
        this.props.button.setButtonDisabled(['QueryHasAssignOrg_Disable'],!flag);
        this.props.button.setButtonDisabled(['QueryHasAssignOrg_Enable'],flag);
    }
    render(){
        const {button,form} = this.props;
        const {createButtonApp} = button;
        const {createForm} = form;
        return (
            <div className="nc-bill-card" >
                <div className="nc-bill-top-area">  
                    <div className='nc-bill-header-area'>
                        <div className="header-button-area">
                            {createButtonApp(this.state.buttonConfig)}
                        </div>
                    </div>
                    <div className="nc-bill-form-area">
                        <NCScrollElement name={this.state.supplier.id}>
                            {createForm(this.state.supplier.id, this.state.supplier.action)}
                        </NCScrollElement>
                    </div>
                </div>

                <div className="nc-bill-bottom-area">  
                    <div className="nc-bill-table-area">
                        <NCScrollElement name={this.state.queryAssignedOrg.id} >
                            <Table
                                data={this.state.queryAssignedOrg.data}
                                columns={this.state.queryAssignedOrg.columns}
                                listeners={{selectedchange:this.onSelectedChange}}
                                fieldid ={'queryHasAssignOrg_table'}
                                //checkedModel={{listeners:{checkedchange:this.onRecordCheckedChange}}}
                                scroll={{y:300,x:true}}
                                ref={(Table)=>{this.Table =Table }}
                            />
                        </NCScrollElement>
                    </div>
                </div>
            </div>

        )
    }
}


// {/* <div className="ncc-hr-multi-child-container" >
//                 <div className="ncc-hr-multi-child-header">
//                     <div className='nc-bill-header-area'>
//                         <div className="header-button-area" style={{zIndex:'1'}}>
//                             {createButtonApp(this.state.buttonConfig)}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="queryHasAssignOrg-ncc-hr-multi-child-body">
//                     <div className="nc-bill-form-area">
//                         <NCScrollElement name={this.state.supplier.id}>
//                             {createForm(this.state.supplier.id, this.state.supplier.action)}
//                         </NCScrollElement>
//                     </div>
//                     <div className="nc-bill-table-area" fieldid="queryHasAssignOrg_table-area">
//                         <NCScrollElement name={this.state.queryAssignedOrg.id} >
//                             <Table
//                                 data={this.state.queryAssignedOrg.data}
//                                 columns={this.state.queryAssignedOrg.columns}
//                                 listeners={{selectedchange:this.onSelectedChange}}
//                                 liAttr={{fieldid:'queryHasAssignOrg_table'}}
//                                 //checkedModel={{listeners:{checkedchange:this.onRecordCheckedChange}}}
//                                 scroll={{y:300,x:true}}
//                                 ref={(Table)=>{this.Table =Table }}
//                             />
//                         </NCScrollElement>
//                     </div>
//                 </div>
//             </div> */}
//lp+4wY7sTGysdn+EGIcDDn9PYHo0TyJoNvxyooP1TkIyyZrdvo7DCRxpR1KLIxeX