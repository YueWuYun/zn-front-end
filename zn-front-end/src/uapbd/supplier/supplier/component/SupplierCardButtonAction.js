//QFiABzmOYu/sdr0gmRRimxifNlLlrtAOR8kTHoQu2zZFF/oc0pUtUSnk09ZXpvfpbxzdCj6DBfFX
//sE2NVZhYCw==
import {ajax,toast} from 'nc-lightapp-front';
import {showAddressBookDialog, showBankAccDialog,approveSupplier} from "./SupplierUtils";

/**
 * liupzhc
 *  供应商卡片界面按钮action
 */

/**
 * 卡片按钮点击事件
 * @param props
 * @param id
 */
export const onCardButtonClick = function(props,id){
    switch(id){
        case 'Card_Add':
            addCardInfo.call(this);
            break;
        case 'Card_Edit':
            editCardInfo.call(this,setCardButtonStatus.bind(this));
            break;
        case 'Card_Save':
            this.props.form.isCheckNow(this.state.card.form.formId);
            saveCardInfo.call(this);
            break;
        case 'Card_SaveAdd':
            saveCardInfo.call(this,addCardInfo.bind(this));
            break;
        case 'Card_Delete'://卡片删除按钮
            let info = getFormPkAndTsInfo.call(this);
            this.setState({delParam:{
                    delPks:[info.pk_supplier],
                    ts:{[info.pk_supplier]:info.ts},
                    indexs:[this.state.param.index]
                }},()=>{
                this.DeleteDialog.showDialog();
            });
            setCardButtonStatus.call(this);
            break;
        case 'Card_Copy'://卡片复制按钮
            let pkInfo = getFormPkAndTsInfo.call(this);
            this.setState({
                param:{status:'add',pk_supplier:pkInfo.pk_supplier},
                oldParam:{status:'add',pk_supplier:pkInfo.pk_supplier}
                },()=>{
                this.initPageData(this.setCardValue,this.setCardStatus,this.state.urls.copySupplierUrl);
                this.setState({param:{status:'add',pk_supplier:null}});
            });
        case 'Card_Cancel'://卡片取消按钮
            this.state.oldParam.status!='edit' && clearCardValue.call(this);//清空表单和列表数据
            let pk = !!this.state.param.pk_supplier ?this.state.param.pk_supplier:this.state.oldParam.pk_supplier;
            this.setState({//有pk就是修改取消  没pk就是新增取消
                param:{status:!!pk?'edit_cancel':'add_cancel',pk_supplier:pk}
            },()=>{
                this.initPageData(this.setCardValue,this.setCardStatus);
            });
            break;
        case 'Card_Return'://卡片返回按钮
            clearCardValue.call(this);//清空卡片的值
            props.button.setButtonDisabled('Card_Return',true);
            //返回列表界面 并触发一次查询
            this.setState({openCard:!this.state.openCard,param:{},oldParam:{}},()=>{
                if(this.props.search.getAllSearchData(this.state.search.id)){
                    this.onSearch(this.setTableData);
                }
                props.button.setButtonDisabled('Card_Return',false);
            });
            break;
        case 'Card_BankAccount'://卡片银行账户按钮
            showBankAccDialog.call(this,this.state.param.pk_supplier?this.state.param.pk_supplier:this.state.oldParam.pk_supplier);
            break;
        case 'Card_AddressBook':
            showAddressBookDialog.call(this,this.state.param.pk_supplier?this.state.param.pk_supplier:this.state.oldParam.pk_supplier);
            break;
        case 'Card_Approve':
        case 'Card_Menu_Approve':
            approveSupplier.call(this,{approve:true});
            break;
        case 'Card_UnApprove':
            approveSupplier.call(this,{approve:false});
            break;
    }
}

/**
 * 新增卡片信息
 */
const addCardInfo = function(param,setStateParam){
    //清空表单和列表数据
    clearCardValue.call(this);
    this.setState({
        param:{status:'add',pk_supplier:null}
    },()=>{
        this.initPageData(this.setCardValue,this.setCardStatus);
        //新增完成后 设置参数为刚才保存住的数据主键
        param && setStateParam && setStateParam(param);
    });
}
/**
 * 编辑卡片信息
 * @param callback
 */
const editCardInfo = function(callback){
    this.setState({param:{status:'edit'}},()=>{
        this.props.form.setFormStatus(this.state.card.form.formId,'edit');
        this.state.card.table.tableIds.forEach(id=>{
            this.props.cardTable.setStatus(id,'edit');
        })
        callback && callback()
    });
}
/**
 * 保存卡片数据
 */
const saveCardInfo = function(addCardInfo){
    let tableIds = this.state.card.table.tableIds.filter(key=>{
        return this.state.card.table[key].relate == 'agg'
    });
    //卡片所有数据
    let data = this.props.createExtCardData('10140SUB_base_card', this.state.card.form.formId,tableIds );
    ajax({
        url:this.state.urls.saveUrl,
        data:data,
        success:(res)=>{
            res.success &&
            this.setState({param:{status:'browse'}},()=>{
                //设置卡片的值
                setCardValue.call(this,this.state.param.status,res.data,setCardButtonStatus.bind(this));
                //成功提示
                !addCardInfo && toast({ color: 'success', content: '保存成功' });

                let param = {
                    pk_supplier:res.data.head['supplier_baseInfo_card'].rows[0].values['pk_supplier'].value,
                    status:'add'
                }
                addCardInfo && addCardInfo(param,setStateParam.bind(this));
            })
        }
    })
}
/**
 * 保存新增后设置state的 param参数
 * @param param
 */
const setStateParam = function(param){
    this.setState({param:param,oldParam:param});
}
/**
 * 获得供应商卡片表单pk和ts信息
 * @returns {{pk_supplier: undefined, ts: undefined}}
 */
const getFormPkAndTsInfo = function(){
    let formData = this.props.form.getAllFormValue(this.state.card.form.formId);
    let pk_supplier = undefined,ts = undefined;
    Object.keys(formData.rows[0].values).forEach(key=>{
        if(key == 'pk_supplier'){pk_supplier = formData.rows[0].values[key].value}
        if(key == 'ts'){ts = formData.rows[0].values[key].value}
    });
    return {pk_supplier:pk_supplier,ts:ts};
}
/**
 * 设置卡片的值  仅限卡片保存后使用
 * @param cardStatus
 * @param data
 * @param callback
 */
const setCardValue = function (cardStatus,data,callback){
    //设置表单数据
    this.props.form.setAllFormValue({[this.state.card.form.formId]:data.head[this.state.card.form.formId]});
    //设置表格数据
    !!data.table && Object.keys(this.state.card.table.tableIds).forEach((key)=>{
        this.props.cardTable.setTableData(this.state.card.table[key].tableId, data.body[this.state.card.table[key].tableId]);
        this.props.cardTable.setStatus(this.state.card.table[key].tableId,cardStatus);
    });
    //设置表单状态
    this.props.form.setFormStatus(this.state.card.form.formId,cardStatus);
    //设置卡片按钮状态回调
    callback && callback();
}

/**
 * 清空卡片数据
 */
const clearCardValue = function (){
    //清空表单和列表数据
    this.props.form.EmptyAllFormValue(this.state.card.form.formId);
    this.state.card.table.tableIds.forEach(id=>{
        this.props.cardTable.setTableData(this.state.card.table[id].tableId,{rows:[]});
    });
}
/**
 * 设置按钮状态
 */
export const setCardButtonStatus = function(){
    let status = this.state.param.status;
    switch (status){
        case 'add':
            this.props.button.setButtonVisible(
                ['Card_Add','Card_Edit','Card_Refresh','Card_Delete','Card_Copy',
                    'Card_BatchUpdate',',Card_Refresh','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print'],false);
            this.props.button.setButtonVisible(['Card_Save','Card_SaveAdd','Card_Cancel'],true);
            this.props.button.setButtonDisabled({AddLine:false,EditLine:false,DeleteLine:false});
            break;
        case 'edit':
            this.props.button.setButtonVisible(
                ['Card_Add','Card_Edit','Card_Refresh','Card_Delete','Card_Copy',
                    'Card_BatchUpdate',',Card_Refresh','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print','Card_SaveAdd'],false);
            this.props.button.setButtonVisible(['Card_Save','Card_Cancel'],true);
            this.props.button.setButtonDisabled({AddLine:false,EditLine:false,DeleteLine:false});
            break;
        case 'add_cancel':
            this.props.button.setButtonVisible(
                ['Card_Save','Card_Cancel','Card_Refresh','Card_Edit','Card_Delete','Card_Copy',
                    'Card_BatchUpdate',',Card_Refresh','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print','Card_SaveAdd'],false);
            this.props.button.setButtonVisible(['Card_Add'],true);
            this.props.button.setButtonDisabled({AddLine:true,EditLine:true,DeleteLine:true});
            break;
        case 'edit_cancel':
            this.props.button.setButtonVisible(
                ['Card_Add','Card_Edit','Card_Refresh','Card_Delete','Card_Copy',
                    'Card_BatchUpdate',',Card_Refresh','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print'],true);
            this.props.button.setButtonVisible(['Card_Save','Card_Cancel','Card_SaveAdd'],false);
            this.props.button.setButtonDisabled({AddLine:true,EditLine:true,DeleteLine:true});
            break;
        default:
            this.props.button.setButtonVisible(
                ['Card_Add','Card_Edit','Card_Delete','Card_Copy',
                    'Card_BatchUpdate',',Card_Refresh','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print'],true);
            this.props.button.setButtonVisible(['Card_Save','Card_SaveAdd','Card_Cancel'],false);

            this.props.button.setButtonDisabled({AddLine:true,EditLine:true,DeleteLine:true});
            break;
    }

}

/**
 * 设置卡片form 禁用item
 * @param items
 */
export const disabledFormItems = function(items){
    let formItemMap = new Map();
    this.props.meta.getMeta()['supplier_baseInfo_card'].items.forEach(item=>{
        formItemMap.set(item.attrcode,item);
    })
    for(let [key,value] of Object.entries(items)){
        formItemMap.get(key).disabled = value;
    }

}

export const getCurCardStatus = function(status){
    switch(status){
        case 'add':
        case 'edit':
            return status;
        case 'browse':
        case 'add_cancel':
        case 'edit_cancel':
            return 'browse';
        default:
            return 'browse';
    }
}
//QFiABzmOYu/sdr0gmRRimxifNlLlrtAOR8kTHoQu2zZFF/oc0pUtUSnk09ZXpvfpbxzdCj6DBfFX
//sE2NVZhYCw==