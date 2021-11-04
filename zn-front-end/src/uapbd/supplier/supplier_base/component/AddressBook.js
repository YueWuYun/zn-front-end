//s0yozH4Vg1iriNgFHVUItTvWLI9pojmZUVDi9kBajpXEFmbTVCfuXrdfE3Rxck6G
import React,{Component} from 'react';
import {ajax,toast,promptBox,getBusinessInfo} from 'nc-lightapp-front';
import {multiLevelManage, showFormulaSetting, validateFormulaSetting} from "../utils/SupplierUtils";
import './Common.less'
/**
 * 供应商地址簿
 * @constructor
 */
const BUTTON_KEYS = ['AddressBook_Add','AddressBook_Edit','AddressBook_Delete','AddressBook_Refresh','AddressBook_Save','AddressBook_Cancel'];
const PK_ADDRESS = 'pk_address';
const PK_LINKMAN = 'pk_linkman';
const PK_SUPPLIER = 'pk_supplier';
const PK_ADDRESSDOC = 'pk_addressdoc';
const ISDEFAULT = 'isdefault';
const TABLE_STATUS = {
    edit:'edit',
    browse:'browse',
    nodata:'nodata'
};
const DATA_STATUS = {
    edit:'1',
    add:'2',
    del:'3',
}
export default class AddressBook extends Component{
    constructor(props){
        super(props);
        var me  = this;
        this.state = {
            ...this.props,
            orgId:null,
            pk_supstock:null,
            baseInfoAddress:true,
            urls:{
                saveSupAddressUrl:'/nccloud/uapbd/supaddress/saveSupAddress.do',
                querySupAddressUrl:'/nccloud/uapbd/supaddress/querySupAddress.do'
            },
            buttonApps:{
                area:'supaddress',
                buttonLimit: 3,
                onButtonClick: this.onAddressBookButtonClick.bind(this),
            },
            table:{
                tableId:'supaddress',
                tableName:this.props.Lang['10140SUG-000065'],/* 国际化处理： 供应商发货地址*/
                action:{
                    onRowClick:this.onRowClick,
                    onSelected:this.onRowSelected,
                    onSelectedAll:this.onRowSelected,
                    onBeforeEvent:this.onBeforeEvent,
                    onAfterEvent:this.onAfterEvent,
                    showIndex:true,
                    showCheck:true,
                    isAddRow:true,
                    
                }
            },
            linkmanRefer:{
                linkmanReferId:'linkmanRefer',
                form:props.form,
                validateToSave:props.validateToSave,
                dealFormulamsg:props.dealFormulamsg,
                pageid:this.props.pagecode,
                onAfterEdit:this.onLinkmanReferEditAfter.bind(this),

            },
            addressRefer:{
                refcode:'uapbd/refer/pubinfo/AddressRef/index.js',
                //refcode:'uapbd/refer/pubinfo/RefAddressComp/index.js',
                form:props.form,
                AddressReferId:'refAddress',
                pagecode:props.pagecode,
                onAfterSave:me.onAddressAfterSave
            },
            selectedRecord:null
        };
    }

    /**
     * 地址簿参照编辑后事件
     * @param data
     * @param addfullname
     */
    onAddressAfterSave = (data,addfullname)=>{
       this.state.selectedRecord.values[PK_ADDRESS] = {value:data[PK_ADDRESS],display:addfullname};
    }

    /**
     * 设置联系人参照参数
     */
    setLinkmanReferParam = (props)=>{
        props.meta.addMeta(props.meta.getMeta()[this.state.linkmanRefer.linkmanReferId]);
        props.meta.getMeta()[this.state.table.tableId].items.find(item=>{
            if(item.attrcode == PK_LINKMAN){
                // item = {...item,...this.state.linkmanRefer};
                Object.assign(item,this.state.linkmanRefer);
            }else if(item.attrcode == PK_ADDRESS){
                // item = {...item,...this.state.addressRefer};
                Object.assign(item,this.state.addressRefer);
            }
        });
    }

    /**
     * 设置供应商主键 并加载供应商发货地址数据
     * @param pk_supplier
     */
    setPk_supplier = (pk_supplier,param={baseInfoAddress:true})=>{

        this.props.editTable.setTableData(this.state.table.tableId,{rows:[]});
        this.setState({pk_supplier:pk_supplier,baseInfoAddress:param.baseInfoAddress,pk_supstock:param.pk_supstock,orgId:param.orgId},()=>{
            this.initAddressBookButtons();
            this.onLoadAddressBookTableData(this.setAddressBookButtonStatus);
        })
    }
    /**
     * 初始地址簿按钮状态
     */
    initAddressBookButtons = ()=>{
        this.props.button.setButtonsVisible(BUTTON_KEYS,false);
    }
    /**
     * 加载发货地址列表信息
     * @param callback  设置按钮状态
     * @param isRefresh 是否刷新
     * @param cb 设置表格状态
     */
    onLoadAddressBookTableData = (callback,isRefresh,cb)=>{
        ajax({
            url:this.state.urls.querySupAddressUrl,
            data:{pk_supplier:this.state.pk_supplier,baseInfoAddress:this.state.baseInfoAddress,pk_supstock:this.state.pk_supstock,pk_org:this.state.orgId},
            success:(res)=>{
                let{success,data} = res;
                if(success){
                    showFormulaSetting.call(this,res,{[this.state.table.tableId]:'editTable'});
                    this.props.editTable.setTableData(this.state.table.tableId,!!data?data[this.state.table.tableId]:{rows:[]});
                    callback && callback(!!data?TABLE_STATUS.browse:TABLE_STATUS.nodata);
                    isRefresh && toast({title:this.props.Lang['10140SUG-000200'],color:'success'})/* 国际化处理： 刷新成功！*/
                    this.setDeleteButtonStatus();
                    cb && cb();
                }
            }
        });
    }

    setDeleteButtonStatus = ()=>{
        let checkedRows = this.props.editTable.getCheckedRows(this.state.table.tableId);
        this.props.button.setButtonDisabled(['AddressBook_Delete'],!(checkedRows && checkedRows.length>0));
    }
    /**
     * 设置供应商发货地址按钮状态
     * @param flag
     */
    setAddressBookButtonStatus = (flag)=>{
        switch(flag){
            case TABLE_STATUS.edit:
                this.props.button.setButtonsVisible(['AddressBook_Edit','AddressBook_Refresh'],false);
                this.props.button.setButtonsVisible(['AddressBook_Add','AddressBook_Delete','AddressBook_Save','AddressBook_Cancel'],true);
                break;
            case TABLE_STATUS.nodata://没有数据
                this.props.button.setButtonsVisible(['AddressBook_Save','AddressBook_Cancel'],false);
                this.props.button.setButtonsVisible(['AddressBook_Add','AddressBook_Edit','AddressBook_Delete','AddressBook_Refresh'],true);
                break;
            default:
                this.props.button.setButtonsVisible(['AddressBook_Save','AddressBook_Cancel'],false);
                this.props.button.setButtonsVisible(['AddressBook_Add','AddressBook_Edit','AddressBook_Delete','AddressBook_Refresh'],true);
                break;
        }
        this.props.button.setButtonDisabled(['AddressBook_Edit'],flag == 'nodata');
       
    }
    setAddressBookButtonDisableStatus = (flag)=>{
        this.props.button.setButtonDisabled(['AddressBook_Edit','AddressBook_Delete'],flag);
    }
    /**
     * 地址簿按钮点击事件
     */
    onAddressBookButtonClick = (props,id)=>{
        if(id!='AddressBook_Refresh'){
            if(!multiLevelManage.call(this,this.props.selectedRecords,id)){
                return;
            }
        }
        this.setLinkmanReferParam(props);
        switch(id){
            case 'AddressBook_Add':
            case 'AddressBook_Edit':
                this.onAddressBookEdit(this.setAddressBookButtonStatus)(id);
                break
            case 'AddressBook_Delete':
                let tableStatus = this.props.editTable.getStatus(this.state.table.tableId);
                this.onDeleteAddressBook()(tableStatus,this.setButtonStatus)
                break;
            case 'AddressBook_Save':
                this.removeEmptyRows(this.onAddressBookSave);
                break;
            case 'AddressBook_Cancel':
                promptBox({
                    color:'warning',
                    title:this.props.Lang['10140SUG-000067'],/* 国际化处理： 确认取消*/
                    content:this.props.Lang['10140SUG-000068'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick: ()=>{
                        //设置状态
                        this.setEditTableStatus(TABLE_STATUS.browse);
                        this.changeMainButton(true);
                        this.onRefreshAddressTable();
                    }
                })
                break;
            case 'AddressBook_Refresh'://刷新
                this.onRefreshAddressTable(true);
                break;
        }
    }
    /**
     * 刷新地址簿
     */
    onRefreshAddressTable = (isRefresh)=>{
        this.onLoadAddressBookTableData(this.setAddressBookButtonStatus,isRefresh);
    }
    /**
     * 移除空行
     * @param callback
     */
    removeEmptyRows = (callback)=>{
        let me = this;
        const clearEmptyData = (cb)=>{
            //获得全部数据
            let data = me.props.editTable.getAllData(me.state.table.tableId);
            let removeRecords =new Array();
            //迭代需要删除的数据
            data.rows.forEach((record,index)=>{
                if(!record.values[PK_ADDRESS].display){
                    removeRecords.push(index);
                }
            })
            setTimeout(()=>{
                //执行删除
                me.props.editTable.delRow(this.state.table.tableId,removeRecords,true);
            },0);
            cb && cb();
        }
        clearEmptyData(callback);
    }
    /**
     * 新增编辑
     * @param callback
     * @returns {Function}
     */
    onAddressBookEdit = (callback)=>{
        let me = this;
        return (id)=>{
            id== 'AddressBook_Add'?
                me.props.editTable.addRow(me.state.table.tableId,undefined,undefined,undefined,()=>{
                    let allRows = me.props.editTable.getAllRows(me.state.table.tableId);
                    me.props.editTable.setValByKeyAndIndex(me.state.table.tableId,allRows.length-1,'pk_org',{value: me.state.baseInfoAddress?getBusinessInfo().groupId : me.state.orgId, display:'', scale:0});
                    me.props.editTable.setValByKeyAndIndex(me.state.table.tableId,allRows.length-1,'pk_group',{value: getBusinessInfo().groupId, display:'', scale:0});
                }):me.setEditTableStatus(TABLE_STATUS.edit);
                me.changeMainButton(false);
            callback && callback('edit');
        }
    }
    /**
     * 改变主按钮
     */
    changeMainButton = (bool)=>{
        setTimeout(()=>{
            this.props.button.setMainButton('AddressBook_Add', bool);
            this.props.button.setMainButton('AddressBook_Save', !bool);
        },0);
    }
    /**
     * 设置表格状态
     */
    setEditTableStatus = (status,callback)=>{
        this.props.editTable.setStatus(this.state.table.tableId, status);
        callback && callback();
    }
    /**
     * 保存
     */
    onAddressBookSave = ()=>{
        let me = this;
        //获得表格全部数据
        let data = this.props.editTable.getAllData(this.state.table.tableId);
        let dealData = data.rows.filter((item)=>item.values && item.values.pk_address.value);

        if(!dealData || dealData.length==0){
            this.props.editTable.setTableData(this.state.table.tableId,{rows:[]});
            this.setAddressBookButtonStatus();
            return;
        }

        dealData.forEach(record=>{
            if(!record.values[PK_ADDRESS].display){
                this.props.editTable.deleteTableRowsByRowId(this.state.table.tableId,record.rowid,true);
            }
            //设置数据状态
            record.status = record.status!=DATA_STATUS.del?((record.values[PK_ADDRESS].value && record.values[PK_SUPPLIER].value)?DATA_STATUS.edit:DATA_STATUS.add):DATA_STATUS.del;
            //record.values['pk_org'].value = me.props.pk_org;
            //设置关联外键
            if(!record.values[PK_SUPPLIER].value){
                record.values[PK_SUPPLIER].value = this.state.pk_supplier;
            }
        })
        let gridData = {
            pageid:this.props.pagecode,
            model:{
                rows:dealData,
                areacode:this.state.table.tableId
            }
        };
        validateFormulaSetting.call(this,gridData,()=>{
            ajax({
                url:this.state.urls.saveSupAddressUrl,
                data:{
                    ...gridData,
                    userjson:this.state.pk_supstock,
                },  
                success:(res)=>{
                    let{success,data} =res;
                    if(success && data){
                        this.onLoadAddressBookTableData(this.setAddressBookButtonStatus,false,()=>{
                            //设置状态
                           this.setEditTableStatus(TABLE_STATUS.browse,()=>{
                               this.changeMainButton(true);
                           });
                           // this.props.editTable.setStatus(this.state.table.tableId,TABLE_STATUS.browse);
                           // this.setAddressBookButtonStatus();
                           toast({'color':'success','title':this.props.Lang['10140SUG-000069']});/* 国际化处理： 保存成功！*/
                        });
                    }
                }
            });
        },{[this.state.table.tableId]:'editTable'},'grid');
        
    }
    /**
     * 设置可见性和可用性
     * @param flag
     * @param needDisable
     */
    setButtonStatus = (flag,needDisable)=>{
        this.setAddressBookButtonStatus(flag);
        this.setAddressBookButtonDisableStatus(needDisable);
    }
    /**
     * 准备删除
     * @param callback
     * @returns {*}
     */
    onDeleteAddressBook = ()=>{
        let me = this;
        return (tableStatus,callback)=>{
            let checkedRows = this.props.editTable.getCheckedRows(this.state.table.tableId);
            if(!checkedRows || checkedRows.length===0){
                toast({'color':'warning','content':this.props.Lang['10140SUG-000070']});/* 国际化处理： 请选择数据操作！*/
                return;
            }
            let baseAddressIndexs = new Array();
            if(!this.state.baseInfoAddress){
                checkedRows.forEach(obj=>{
                    if(obj.data.values['pk_org'].value == obj.data.values['pk_group'].value ||obj.data.values['pk_org'].value == getBusinessInfo().groupId){
                        baseAddressIndexs.push(obj.index+1);
                    }
                })
            }
            if(baseAddressIndexs.length>0){
                var numbers = baseAddressIndexs.join(',');
                toast({content:this.props.Lang['10140SUG-000215']+numbers+this.props.Lang['10140SUG-000216'],color:'warning'});
                return;
            }else{
                let deleteRowIds = new Array();
                let deleteRows = checkedRows.map((obj)=>{
                    deleteRowIds.push(obj.data.rowid);
                    //obj.data.status=DATA_STATUS.del;
                    return obj.data;
                });
                tableStatus == 'browse'?
                promptBox({
                    color:'warning',
                    title: this.props.Lang['10140SUG-000071'],/* 国际化处理： 确认删除*/
                    content: this.props.Lang['10140SUG-000072'],/* 国际化处理： 您确定要删除所选数据吗?*/
                    beSureBtnClick:  ()=> {
                        deleteRows.forEach((row)=>{
                            row.status = DATA_STATUS.del;
                        });
                        me.deleteAddressBook({deleteRows: deleteRows, deleteRowIds: deleteRowIds,status:tableStatus,realDel:true},callback)         
    
                    }
                }):me.deleteAddressBookInBrowser({deleteRows: deleteRows, deleteRowIds: deleteRowIds,status:tableStatus,realDel:false},callback);
            }
           
        }
    }

    /*******************************
     * ajax删除
     * @param param
     * @param callback
     *******************************/
    deleteAddressBook = (param,callback)=>{
        ajax({
            url:this.state.urls.saveSupAddressUrl,
            data:{
                pageid:this.props.pagecode,
                gridmodel:{
                    rows:param.deleteRows
                }
            },
            success:(res)=>{
                let{success,data} = res;
                if(success && data){
                    this.deleteAddressBookInBrowser(param,callback);
                }
            }
        });
    }
    /*******************************
     * 前端删除
     * @param param
     * @param callback
     *******************************/
    deleteAddressBookInBrowser = (param,callback)=>{
         /***************************************************************
         * 前端删除需要删除的行
         ***************************************************************/
        param.deleteRows.forEach((row)=>{
            row.status = DATA_STATUS.del;
        });
        setTimeout(()=>{
            param.deleteRowIds && param.deleteRowIds.forEach(rowid=>{
                this.props.editTable.deleteTableRowsByRowId(this.state.table.tableId,rowid,true);
            });
            let visibleRows = this.props.editTable.getVisibleRows(this.state.table.tableId);
            /***************************************************************
             * 设置按钮状态
             ***************************************************************/
            callback && callback(param.status,!visibleRows || visibleRows.length == 0);
        },10);

        /***************************************************************
         * 成功提示
         ***************************************************************/
        param.status !='edit' && toast({color:'success',title:this.props.Lang['10140SUG-000073']});/* 国际化处理： 删除成功！*/
       
    }
    /**
     * 联系人参照点击确定后事件
     * @param data
     */
    onLinkmanReferEditAfter = (data)=>{
        const getKey = (key)=>{
            if(key.startsWith(PK_LINKMAN) && key.indexOf(".")>-1){
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
            if(key.startsWith(PK_LINKMAN)){
                key == PK_LINKMAN?setPk_linkmanItem(data,key):setRecordItem(data,key);
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
                if(item.attrcode == PK_LINKMAN && record[PK_LINKMAN]){
                    item.queryCondition = {pk_linkman:record[PK_LINKMAN].value};
                }
            })
            this.props.meta.setMeta(this.props.meta.getMeta());
        })
    }
    onRowSelected = (props, moduleId, record, index, status)=>{
        this.setDeleteButtonStatus();
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
        return this.hasEditPower(record,()=>{
            this.setState({
                selectedRecord:record
            },()=>{
                this.props.meta.getMeta()[this.state.tableId].items.find(item=>{
                    if(item.attrcode == PK_LINKMAN && record.values[PK_LINKMAN]){
                        item.queryCondition = {pk_linkman:record.values[PK_LINKMAN].value};
                    }
                })
            })
            return true;
        })
    }
    hasEditPower = (record,callback)=>{
        if(!this.state.baseInfoAddress && record && record.values['pk_org'].value == record.values['pk_group'].value){
            toast({content:this.props.Lang['10140SUG-000214'],color:'warning'});
            return false;
        }else{
            return callback && callback();
        }
    }
    /**
     * 表格编辑后事件
     * @param props
     * @param moduleId
     * @param item
     * @param index
     * @param value
     * @param record
     */
    onAfterEvent = (props, moduleId, key, curValue, value, record, index)=>{

        /*****
         * 这value 还是个数组
         *  数组就数组吧，每个对象还有oldvalue 和newvalue 还有rowid ！！！
         */

        if(key =='pk_areacl' && value[0].newvalue.value){
            this.props.meta.getMeta()[this.state.table.tableId].items.find(item=>{
                debugger
                if(item.attrcode == PK_ADDRESSDOC){
                    //根据地区参照 过滤地点档案参照左树
                    item.queryCondition = {
                        TreeRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.SupAddressAreaDocRefSqlBuilder',
                        pk_areacl:value[0].newvalue.value
                    }
                }
            })
        }else if(key == 'isdefault' && !!curValue){
            //修改默认值 只允许有一个默认收货地址
            debugger
            let data = this.props.editTable.getAllData(moduleId);
            // data.rows.forEach(record=>{
            //     if(!record.rowid == value[0].rowid && !!record.values[ISDEFAULT].value){
            //         record.values[ISDEFAULT].value = false;
            //         record.values[ISDEFAULT].display = false;
            //     }
            // })
            // if (value) {
                // let alltabledata = props.editTable.getAllData(moduleId);
                value && data.rows.forEach((r, i) => {
                    index.rowid !== r.rowid && props.editTable.setValByKeyAndIndex(moduleId, i, 'isdefault', {value: false});
                    // if (index.rowid !== r.rowid) {
                    //     props.editTable.setValByKeyAndIndex(moduleId, i, 'isdefault', {value: false});
                    // } else {
                    //     return;
                    // }
                });
            // }
        }
        
    }
    render(){
        let {editTable,button} = this.props;
        const {createEditTable} = editTable;
        const {createButtonApp} = button;
        return(

            <div className="nc-single-table">
                 <div className="nc-singleTable-header-area">
                    <div className="header-button-area">
                        {createButtonApp(this.state.buttonApps)}
                    </div>
                 </div>
                <div className="nc-singleTable-table-area"> 
                    {createEditTable(this.state.tableId,this.state.table.action)}
                </div>
            </div>
        )
    }
}


/* <div className="ncc-hr-multi-child-card-container" >
                <div className="ncc-hr-multi-child-card-header">
                    <div className='nc-bill-header-area'>
                        <div className="header-button-area">
                            {createButtonApp(this.state.buttonApps)}
                        </div>
                    </div>
                </div>
                <div className="ncc-hr-multi-child-card-body">
                    <div className="nc-bill-table-area">
                        {createEditTable(this.state.tableId,this.state.table.action)}
                    </div>
                </div>
            </div> */


//s0yozH4Vg1iriNgFHVUItTvWLI9pojmZUVDi9kBajpXEFmbTVCfuXrdfE3Rxck6G