//WmVDRbxKZCrzbwEmmMdBUS8tlZ5e3VGcoKW1htyWIbmjkg6LUGehyj1U1sjkRU4x
import Linkman from './Linkman';
import SupBankAcc from './SupplierBankAccount';
import AddressBook from './AddressBook';
import {ajax} from 'nc-lightapp-front';
/**
 * 转换form data 2 grid data
 * @param datas
 * @param targetId
 * @param targetMeta
 * @returns {Object}
 */
export function convertForm2GridData(datas,targetId){
    const getKey = (attrcode)=>{
        if(attrcode.indexOf(".")>-1){
            return attrcode.substr(attrcode.indexOf(".")+1);
        }
        return attrcode;
    };
    let values = new Object();
    this.props.meta.getMeta()[targetId].items.forEach((item)=>{
        let originKey = getKey(item.attrcode);
        for (let [key, val] of Object.entries(datas)) {
            if(originKey == key){
                val.scale=0;
                values[item.attrcode] = val;
                break;
            }
        }
    });
    return values;
};
/**
 * 重置供应商联系人列表数据
 * @param tableId
 * @param record
 */
export const resetTableRows = function (tableId,record){
    this.props.cardTable.getAllRows(tableId).filter(data=>{
        if(data.values['pk_linkman'].value == record['pk_linkman'].value){
            delete data.values;
            data.values = record;
            this.props.cardTable.setTableData(tableId,updateTableData({rows:this.props.cardTable.getAllRows(tableId)},[data]));
        }
    })
}
/**
 * 更新表格数据
 * @param allData
 * @param reDataRows
 * @returns {*}
 */
const updateTableData = function(allData,reDataRows){
    if(!reDataRows) return;
    let updateRecordMap = new Map();
    reDataRows.forEach(record=>{
        updateRecordMap.set(record.rowid,record);
    });
    allData.rows && allData.rows.forEach((item,index) => {
        if(!!updateRecordMap.get(item.rowid)) {
            allData.rows[index] = updateRecordMap.get(item.rowid);
        }
    });
    return allData;
}
/**
 * 点击【银行账户】按钮：弹出银行账户对话框
 * @param pk_supplier
 */
export const showBankAccDialog = function(pk_supplier){
    setBankAccBtnsAndMeta && setBankAccBtnsAndMeta.call(this);
    this.BankAccDialog.showDialog({},this.SupBankAcc.setPk_supplier.bind(this,pk_supplier));
}
/**
 * 弹出银行账户对话框时：
 * 设置供应商银行账户的元数据
 * @param callback
 */
const setBankAccBtnsAndMeta = function(callback){
    this.SupBankAcc.setSupBankAccTableColumn(this.props.meta.getMeta()['custsupbankacc'].items.filter(item=>{return !!item.visible;}));
    callback && callback();
}
/**
 * 点击【地址簿】按钮：弹出地址簿对话框
 * @param pk_supplier
 */
export const showAddressBookDialog = function(pk_supplier){
    this.AddressBookDialog.showDialog({},this.AddressBook.setPk_supplier.bind(this,pk_supplier));
}

/**
 * 核准
 * @param config
 */
export const approveSupplier = function(config){
    ajax({
        url:this.state.urls.approveSupplierUrl,
        data:Object.assign(getApproveConfig.call(this),config),
        success:(res)=>{

        }
    })
}
/**
 * 获得审核参数
 * @returns {{pk_suppliers: any[], pk_tsMap: Map<any, any>}}
 */
const getApproveConfig = function(){
    let pkArr = new Array(),
        tsMap = new Map();
    this.state.batchParam.forEach(row=>{
        pkArr.push(row.data.values['pk_supplier'].value);
        tsMap.set(row.data.values['pk_supplier'].value,row.data.values['ts'].value);
    })
    return {pk_suppliers:pkArr,pk_tsMap:tsMap};
}

/**
 * 初始页面时：获得dialog的参数
 * @param flag
 * @returns {*}
 */
export const getDialogConfig = function(flag){
    switch (flag){
        case 'DeleteDialog':
            return {
                showFooter:true,
                style:{
                    dialogWidth:'400px',
                    dialogHeight:'200px'
                },
                header:{
                    dialogTitle:'确认删除?'
                },
                body:{
                    renderDialogContent:()=>{
                        return <p style={{margin:'20px 20px 20px 20px'}}>删除可能等待很长的时间，可以点击'后台删除'按钮，调用后台任务执行。</p>;
                    }
                },
                footer:{
                    renderSelfDefBtns:true,
                    selfDefBtn:{
                        renderCancel:true,
                        buttonItem:[
                            {name:'删除',action:()=>{this.onMainTableOperateDelClick(false)},style:{ backgroundColor: '#E14C46',color: '#fff'}},
                            {name:'后台删除',action:()=>{this.onMainTableOperateDelClick(true)},style:{ backgroundColor: '#E14C46',color: '#fff'}},
                        ]
                    }
                }
            };
        case 'BankAccDialog':
            return {
                showFooter:false,
                listener:{
                    onAfterSureClick:this.onSupBankaccDialogClose,
                    onAfterHeaderCloseClick:this.onSupBankClickClose,//点击弹出框头部的叉号关闭事件
                },
                style:{
                    dialogWidth:'60%',
                    dialogHeight:'70%'
                },
                header:{
                    dialogTitle:'银行账户'
                },
                body:{
                    renderDialogContent:function(){
                        let config = {
                            ...this.state.card.dialog.supbankacc,
                            ...this.props

                        };
                        return <SupBankAcc {...config} ref={(SupBankAcc)=>{this.SupBankAcc = SupBankAcc;}}/>
                    }.bind(this)
                }
            };
        case 'LinkmanDialog':
            return {
                showFooter:true,
                listener:{
                    onAfterSureClick:this.onLinkmanDialogClose
                },
                style:{
                    dialogWidth:'60%',
                    dialogHeight:'50%'
                },
                header:{
                    dialogTitle:'联系人'
                },
                body:{
                    renderDialogContent:function(){
                        let config = {
                            ...this.state.card.dialog.linkman,
                            form:this.props.form,
                            meta:this.props.meta,
                        };
                        return <Linkman {...config} ref={(Linkman)=>{this.Linkman = Linkman;}}/>
                    }.bind(this)
                }
            };
        case 'AddressBook':
            return {
                showFooter:false,
                style:{
                    dialogWidth:'80%',
                    dialogHeight:'60%'
                },
                header:{
                    dialogTitle:'供应商发货地址'
                },
                body:{
                    renderDialogContent:function(){
                        let config = {
                            ...this.state.card.dialog.supaddress,
                            ...this.props
                        };
                        return <AddressBook {...config} ref={(AddressBook)=>{this.AddressBook = AddressBook;}}/>
                    }.bind(this)
                }
            };
    }
}



//WmVDRbxKZCrzbwEmmMdBUS8tlZ5e3VGcoKW1htyWIbmjkg6LUGehyj1U1sjkRU4x