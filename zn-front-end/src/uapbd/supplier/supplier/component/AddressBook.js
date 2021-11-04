//s0yozH4Vg1iriNgFHVUItTvWLI9pojmZUVDi9kBajpXEFmbTVCfuXrdfE3Rxck6G
import React,{Component} from 'react';
import {base,ajax,toast} from 'nc-lightapp-front';
const {NCCheckbox,NCIcon,NCPopconfirm,NCTable,NCRow,NCCol,NCButton,NCAffix,NCAnchor,NCScrollElement,NCScrollLink} = base;

/**
 * 供应商地址簿
 * @constructor
 */
export default class AddressBook extends Component{
    constructor(props){
        super(props);
        this.state = {
            ...this.props,
            buttonApps:{
                area:'supaddress',
                buttonLimit: 3,
                onButtonClick: this.onAddressBookButtonClick.bind(this),
            },
            table:{
                tableId:'supaddress',
                tableName:'供应商发货地址',
                action:{
                    onRowClick:this.onRowClick,
                    onBeforeEvent:this.onBeforeEvent,
                    showIndex:true,
                    showCheck:true
                }
            },
            linkmanRefer:{
                linkmanReferId:'linkmanRefer',
                form:props.form,
                onAfterEdit:this.onLinkmanReferEditAfter.bind(this),

            },
            selectedRecord:null,
        };
    }
    /**
     * 设置联系人参照参数
     */
    setLinkmanReferParam = (props)=>{
        props.meta.addMeta(props.meta.getMeta()['linkmanRefer']);
        props.meta.getMeta()['supaddress'].items.find(item=>{
            if(item.attrcode=='pk_linkman'){
                Object.assign(item,this.state.linkmanRefer);
            }
        });
    }
    /**
     * 设置供应商主键 并加载供应商发货地址数据
     * @param pk_supplier
     */
    setPk_supplier = (pk_supplier)=>{
        this.props.editTable.setTableData(this.state.table.tableId,{rows:[]});
        this.setState({pk_supplier:pk_supplier},()=>{
            this.onLoadAddressBookTableData(this.setAddressBookButtonStatus);
        })
    }
    /**
     * 加载发货地址列表信息
     */
    onLoadAddressBookTableData = (callback)=>{
        ajax({
            url:'/nccloud/uapbd/supaddress/querySupAddress.do',
            data:{pk_supplier:this.state.pk_supplier},
            success:(res)=>{
                let{success,data} = res;
                if(success){
                    !!data ?this.props.editTable.setTableData(this.state.table.tableId,data[this.state.table.tableId]):
                    toast({color:'success','content':'没有查询到记录！'});
                    debugger
                    callback && callback(!!data?'browse':'nodata');
                }
            }
        });
    }
    /**
     * 设置供应商发货地址按钮状态
     * @param flag
     */
    setAddressBookButtonStatus = (flag)=>{
        switch(flag){
            case 'edit':
                this.props.button.setButtonsVisible(['AddressBook_Edit','AddressBook_Delete','AddressBook_Refresh'],false);
                this.props.button.setButtonsVisible(['AddressBook_Add','AddressBook_Save','AddressBook_Cancel'],true);
                break;
            case 'nodata'://没有数据
                this.props.button.setButtonsVisible(['AddressBook_Save','AddressBook_Edit','AddressBook_Delete','AddressBook_Cancel'],false);
                this.props.button.setButtonsVisible(['AddressBook_Add','AddressBook_Refresh'],true);
                break;
            default:
                this.props.button.setButtonsVisible(['AddressBook_Save','AddressBook_Cancel'],false);
                this.props.button.setButtonsVisible(['AddressBook_Add','AddressBook_Edit','AddressBook_Delete','AddressBook_Refresh'],true);
                break;
        }
    }
    /**
     * 地址簿按钮点击事件
     */
    onAddressBookButtonClick = (props,id)=>{
        this.setLinkmanReferParam(props);
        switch(id){
            case 'AddressBook_Add':
                this.onAddressBookAdd(this.setAddressBookButtonStatus);
                break;
            case 'AddressBook_Edit':
                let data = this.props.table.getAllTableData(this.state.table.tableId);
                !!data?this.props.editTable.setStatus('supaddress', 'edit', this.setAddressBookButtonStatus.bind(this,'edit')):
                toast({title:'提示',color:'warning',content:'没有记录'});
                break
            case 'AddressBook_Delete':
                let deleteData = this.props.table.getAllTableData(this.state.table.tableId);
                !!deleteData?this.onAddressBookDelete():
                    toast({title:'提示',color:'warning',content:'没有记录'});
                break;
            case 'AddressBook_Save':
                this.onAddressBookSave();
                break;
            case 'AddressBook_Cancel':
                this.props.editTable.setStatus('supaddress', 'browse', this.setAddressBookButtonStatus.bind(this,'browse'));
                break;
            case 'AddressBook_Refresh'://刷新
                this.onLoadAddressBookTableData(this.setAddressBookButtonStatus);
                break;
        }
    }
    /**
     * 新增地址簿
     * @param callback
     */
    onAddressBookAdd = (callback)=>{
        this.props.editTable.addRow(this.state.tableId);
        callback && callback('edit');
    }
    /**
     * 保存
     */
    onAddressBookSave = ()=>{
        let data = this.props.table.getAllTableData(this.state.table.tableId);
        if(!data){return;}
        data.rows.forEach(record=>{
            if(!record.values['pk_supplier'].value){
                record.values['pk_supplier'].value = this.state.pk_supplier;
            }
            //有主键就是2 没主键就是1
            record.status = (!!record.values['pk_supaddress'] &&!!record.values['pk_supaddress'].value)?'1':'2';
        })
        ajax({
            url:'/nccloud/uapbd/supaddress/saveSupAddress.do',
            data:{
                pageid:this.props.pagecode,
                model:{rows:data.rows}
            },
            success:(res)=>{
                let{success,data} =res;
                if(success && data){
                    this.onLoadAddressBookTableData(this.setAddressBookButtonStatus);
                    toast({'color':'success','content':'保存成功！'});
                }
            }
        });
    }
    /**
     * 删除
     */
    onAddressBookDelete = ()=>{
        let checkedRows = this.props.editTable.getCheckedRows(this.state.table.tableId);
        debugger
        if(!checkedRows || checkedRows.length===0){
            toast({'color':'danger','content':'请选择数据操作！'});
            return;
        }
        let deleteIndex = new Array();
        let deleteRows = checkedRows.map((obj)=>{
            deleteIndex.push(obj.index);
            obj.data.status=3;
            return obj.data;
        });
        ajax({
            url:'/nccloud/uapbd/supaddress/saveSupAddress.do',
            data:{
                pageid:this.props.pagecode,
                gridmodel:{
                    rows:deleteRows
                }
            },
            success:(res)=>{
                let{success,data} = res;
                if(success && data){
                    this.props.editTable.deleteTableRowsByIndex(this.state.table.tableId,deleteIndex,true);
                    this.onLoadAddressBookTableData(this.setAddressBookButtonStatus);
                    toast({color:'success',content:'删除成功！'});
                }
            }
        });
    }
    /**
     * 联系人参照点击确定后事件
     * @param data
     */
    onLinkmanReferEditAfter = (data)=>{
        const getKey = (key)=>{
            if(key.startsWith('pk_linkman') && key.indexOf(".")>-1){
                return key.substr(key.indexOf(".")+1);
            }
            return key;
        }
        const setRecordItem = (data,key)=>{
            this.state.selectedRecord.values[key] = data.linkmanRefer.rows[0].values[getKey(key)];
        }
        const setPk_linkmanItem = (data,key )=>{
            this.state.selectedRecord.values[key] = {
                display:data.linkmanRefer.rows[0].values['name'].display ||data.linkmanRefer.rows[0].values['name'].value,
                value:data.linkmanRefer.rows[0].values[getKey(key)].display ||data.linkmanRefer.rows[0].values[getKey(key)].value,
                scale:0
            }
        }
        Object.keys(this.state.selectedRecord.values).forEach(key=>{
            if(key.startsWith('pk_linkman')){
                key == 'pk_linkman'?setPk_linkmanItem(data,key):setRecordItem(data,key);
            }
        })
    }
    /**
     * 单击表格行记录时给联系人参照㩙pk_linkman
     * @param props
     * @param moduleId
     * @param record
     * @param index
     */
    onRowClick=(props, moduleId, record, index)=>{
        this.setState({selectedRecord:record},()=>{
            this.props.meta.getMeta()[this.state.tableId].items.find(item=>{
                if(item.attrcode=='pk_linkman' && record['pk_linkman']){
                    item.queryCondition = {pk_linkman:record['pk_linkman'].value};
                }
            })
        })
    }
    /**
     * 表格编辑前事件
     * @param props
     * @param moduleId
     * @param item
     * @param index
     * @param value
     * @param record
     * @returns {boolean}
     */
    onBeforeEvent=(props,moduleId,item,index,value,record)=>{
        this.setState({
            selectedRecord:record
        },()=>{
            this.props.meta.getMeta()[this.state.tableId].items.find(item=>{
                if(item.attrcode=='pk_linkman' && record['pk_linkman']){
                    item.queryCondition = {pk_linkman:record['pk_linkman'].value};
                }
            })
        })
        return true;
    }
    render(){
        let {editTable,button} = this.props;
        const {createEditTable} = editTable;
        const {createButtonApp} = button;
        return(
            <div>
            <div className="nc-single-table" style={{display:this.state.showCard?'none':''}}>
                <div className="nc-singleTable-header-area" >
                    <div className="header-button-area">
                        {createButtonApp(this.state.buttonApps)}
                    </div>
                </div>
                <div className="nc-singleTable-table-area">
                    {createEditTable(this.state.tableId,this.state.table.action)}
                </div>
            </div>
            </div>
        )
    }
}




//s0yozH4Vg1iriNgFHVUItTvWLI9pojmZUVDi9kBajpXEFmbTVCfuXrdfE3Rxck6G