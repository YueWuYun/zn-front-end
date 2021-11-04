//WmVDRbxKZCrzbwEmmMdBUS8tlZ5e3VGcoKW1htyWIbmjkg6LUGehyj1U1sjkRU4x
import {ajax,toast,promptBox} from 'nc-lightapp-front';
import Linkman from '../component/Linkman';
import SupBankAcc from '../component/SupplierBankAccount';
import AddressBook from '../component/AddressBook';
import SupRename from '../component/SupRename';
import {BaseUtils} from '../../../public/utils/index';
import BatchUpatePage from '../batchedit/BatchUpdatePage';
import {setCardButtonStatus} from "../component/SupCardButtonAction";
import '../main/index.less';
/**
 * 全局主键
 * @type {string}
 */
const PK_GLOBE = 'GLOBLE00000000000000';
/**
 * 重画form
 * @param id
 */
export const resizeForm = function(id,callback = ()=>{}){
    this.props.form.resetItemWidth(id);
    setTimeout(callback,0);
}


/**
 * 编辑或新增供应商基本信息
 * @param param
 */
export const editSupBaseInfo = function(param){
    let me = this;
    me.setState(Object.assign({selectedRecords:[]},param),
        ()=>{
            emptyCardData.call(me);
            /*********************************************************
             * 重画form  相当于 window.resize()
             *********************************************************/
            resizeForm.call(me,'supplier_baseInfo_card');
            /*********************************************************
             * 由于老杨说进卡片时按钮会变化一次，给人感觉不好，先执行一次设置卡片状态
             *********************************************************/
            me.setCardStatus(param.status);
            /*********************************************************
             * 点击新增  先加载模板，如果没有模板就走原来初始卡片的逻辑
             *********************************************************/
            if(param.status == 'add'){
                loadTemplate.call(this,()=>{
                    if(me.SupTemplate.state.defaultExtBillcard && Object.keys(me.SupTemplate.state.defaultExtBillcard).length>0){
                        /*****************************************************
                         * me.SupTemplate.state.defaultExtBillcard ：billCard
                         * 相当于iniPageData ajax成功回调的res.data
                         *****************************************************/
                        me.SupTemplate.setDefaultTemp(me.setCardStatus)(param.status);
                        /*****************************************************
                         * 根据 userjson 决定是否禁用编码项
                         * 已经挪到组件内部维护
                         *****************************************************/
                        // disableCodeItem.call(me,me.SupTemplate.state.defaultExtBillcard.head.userjson=='Y');
                    }else{
                        /*****************************************************
                         * 原来初始卡片的逻辑
                         *****************************************************/
                        me.initPageData(me.setCardValue,me.setCardStatus);
                    }
                })
            }else if(param.status == 'edit'){

                me.initPageData(me.setCardValue,me.setCardStatus);
            }
            

        });
}
/**
 * 加载 模板
 * @param {} callback 
 */
const loadTemplate = function(callback){
    this.SupTemplate.loadTempData(callback);
}
export const beforSupStockEdit = function(record,callback){
    let param = getCurParam.call(this,'pk_supplier');//获得请求参数
    let supstock = getCurParam.call(this,'pk_supstock',record);
    return new Promise((reslove)=>{
        ajax({
            url:this.Urls.beforeSupStockEditUrl,
            data:{
                pk_supplier:param['pk_supplier'][0],pk_supstock:supstock['pk_supstock'][0]
            },
            success:(res)=>{
                if(res.success){
                    resolve(res.success);
                }
            }
        })
    })
}
/**
 * 删除供应商基本信息
 * @param param
 */
export const deleteSupBaseInfo = function(param){
    let curParam = getCurParam.call(this,'pk_supplier',param.selectedRecords);
    ajax({
        url:this.Urls.beforeEditSupValidateUrl,
        data:{pk_suppliers:curParam['pk_supplier'],operate:'delete'},
        success:(res)=>{
            if(res.success && res.data){
                this.setState(param,()=>{
                    this.DeleteDialog.showDialog();
                })
            }
        }
    })
}
export const validateAddOrCopy = function(callback){
    ajax({
        url:this.Urls.addOrCopyValidateUrl,
        data:{},
        success:(res)=>{
            if(res.success && res.data){
                callback && callback(res.data);
            }
        }
    })
}
/**
 * 复制供应商基本信息
 * @param param
 * fix by yufwm 2020-03-13 卡片页点击 复制按钮 查询条件复制问题 fix
 */
export const copySupBaseInfo = function(param){
    let searchInfo = this.props.search.getQueryInfo(this.state.table.search.id,false);
    let {querycondition} = searchInfo;
    setCardButtonStatus.call(this,param.status);
    // fix by yufwm 2020-03-13 卡片页点击 复制按钮 查询条件复制问题 fix
    this.setState(Object.assign({queryInfo:querycondition},param),()=>{
        loadTemplate.call(this,()=>{
            //先清空表单 fixed for NCCLOUD-151209
            this.props.form.EmptyAllFormValue('supplier_baseInfo_card')
            this.initPageData(this.setCardValue,this.setCardStatus,this.Urls.copySupplierUrl);
            resizeForm.call(this,'supplier_baseInfo_card');
            this.setState({param:{status:'add',pk_supplier:null}},()=>{
                this.props.button.setButtonVisible(['Card_Supplier_Template'],true);
            });
        });
    })
}
/**
 * 银行账户
 * @param param
 */
export const openSupBankAcc = function(param){
    this.setState(Object.assign(this.state,param),()=>{
        let arg = getCurParam.call(this,'pk_supplier');
        showBankAccDialog.call(this,arg['pk_supplier'][0]);
    })
}
/**
 * 地址簿
 * @param param
 */
export const openSupAddressBook = function(param){
    this.setState(param,()=>{
        let arg = getCurParam.call(this,'pk_supplier');
        showAddressBookDialog.call(this,arg['pk_supplier'][0]);
    })
}

/**
 * 供应商更名记录
 * @param param
 */
export const openSupRenameBook = function(param){
    this.setState(param,()=>{
        let arg = getCurParam.call(this,'pk_supplier');
        showSupRenameBookDialog.call(this,arg['pk_supplier'][0]);
    })
}

/**
 * 核准
 * @param param  选中行
 * @param config 核准 or 取消核准
 * @param callback 更新按钮状态
 * @param inCard 是否在卡片上核准
 */
export const approveSupBaseInfo = function(param,config,callback,inCard){
    let me = this;
    promptBox({
        color:'warning',
        title:config.approve?this.Lang['10140SUG-000223']:this.Lang['10140SUG-000224'],/* 国际化处理： 核准/取消核准*/
        content:this.Lang['10140SUG-000162'],/* 国际化处理： 是否确认操作？*/
        beSureBtnClick:function(){
            me.setState(param,()=>{
                ajax({
                    url:this.Urls.approveSupplierUrl,
                    data:Object.assign(getCurParam.call(me,'pk_supplier'),config,{nodeType:me.props.nodeType,pk_curOrg:me.state.envParam.pk_org}),
                    success:(res)=>{
                        replaceLatestSupInfo.call(me,res.data['supplier_baseInfo'].rows,inCard);
                        !inCard && this.disabledApproveButtons(config.approve);
                        inCard && this.displayApproveButtons(config.approve);
                        //更新核准按钮状态
                        callback && callback(config.approve);
                        res.success && toast({title:this.Lang['10140SUG-000163'],color:'success'});/* 国际化处理： 操作成功！*/
                    }
                })
            })
        }.bind(this)
    })

}

const assignSupBaseInfo = function(){

}
/**
 * 编辑前校验
 * @param config
 * @param callback
 */
export const beforeEdit = function(config,callback){
    let param = getCurParam.call(this,'pk_supplier',config.selectedRecords),
        status = this.state.status || 'edit';
        let promise = new Promise((resolve)=>{
            ajax({
                url:this.Urls.beforeEditSupValidateUrl,
                data:{pk_suppliers:param['pk_supplier'],operate:'edit'},
                success:(res)=>{
                    resolve(res.data);
                }
            })
        }).then((canEdit)=>{
            if(canEdit){
                ajax({
                    url:this.Urls.beforeEditUrl,
                    data:{
                        pk_supplier:param ? param['pk_supplier'][0]:null,
                        tsMap:param?param['tsMap']:null,
                        pageCode:this.props.pagecode,
                        nodeType:this.props.nodeType,
                        pk_curOrg:this.state.envParam.pk_org,
                        status:'edit',//！！！新增取消时回滚单据号
                    },
                    success:(res)=>{
                       if(res.success && res.data){
                           callback && callback(config);
                       }
                    }
                })
            }
        })
}
export const getRecordsMap = function(tableId,prmaryKey){
    let selectedRecords = this.props.cardTable.getAllData(tableId);
    let map = new Map();
    selectedRecords.rows.forEach(record=>{
            // return {[record.values[prmaryKey].value]:record};
        map.set(record.values[prmaryKey].value,record);
    });
    return map;
}
/**
 * 调换最新的供应商信息
 * @param data
 * @param inCard
 */
export const replaceLatestSupInfo = function(data,inCard){
    //若在卡片上核准
    if(inCard){
        let formData = this.props.form.getAllFormValue(this.state.card.form.formId);
        formData.rows[0].values = data[0].values;
        //重置form数据
        this.props.form.setAllFormValue({[this.state.card.form.formId]:formData});
    }else{
        //获得表格所有数据
        let tableData = this.props.table.getAllTableData(this.state.table.mainTable.id);
        let dataMap = new Map();
        if(tableData){
            //获得表格的map
            for(var record of tableData.rows){
                dataMap.set(record.values['pk_supplier'].value,record);
            }
            //把核准最新状态的record替换原来的record
            data.forEach(record=>{
                let oldRecord = dataMap.get(record.values['pk_supplier'].value);
                oldRecord.values = record.values;
            })
            //重新设置table数据
            this.props.table.setAllTableData(this.state.table.mainTable.id,{rows:tableData.rows});
        }
    }
}

/**
 * 冻结/解冻
 * @param param
 * @param config
 */
export const freezeSupBaseInfo = function(param,config){
    this.setState(Object.assign(param,{otherParam:config}),()=>{
        promptBox({
            color:'warning',
            title: config.freeze?this.Lang['10140SUG-000221']:this.Lang['10140SUG-000222'],/* 国际化处理： 冻结/解冻*/
            content: config.freeze?this.Lang['10140SUG-000164']:this.Lang['10140SUG-000165'],/* 国际化处理： 您确定要进行冻结操作吗？,您确定要进行解冻操作吗？*/
            beSureBtnClick: ()=>{
                this.props.nodeType == 'ORG_NODE'?this.onFreezeDialogClose():this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'FreezeDialog'),{Lang:this.Lang}));
            }
        })
    })
}
/**
 * 生成客户
 * @param param
 * @param disabledCustCodeItem
 */
export const openSupCreateCust = function(param,disabledCustCodeItem){
    this.setState(param,()=>{
        let arg = getCurParam.call(this,'pk_supplier');
        setPkCustClassReferOrg.call(this);
        ajax({
            url:this.Urls.createCustUrl,
            data:Object.assign(arg,{nodeType:this.props.nodeType,pk_curOrg:this.state.envParam.pk_org}),
            success:(res)=>{
                //根据编码规则禁用客户编码item
                if(res.success){
                    showFormulaSetting.call(this,res,{'createCust':'form'});
                    this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'CreateCustDialog'),{Lang:this.Lang}),()=>{
                        this.props.form.setAllFormValue({'createCust':res.data.createCust});
                        disabledCustCodeItem && disabledCustCodeItem.call(this,res.data.userjson);
                        this.props.form.setFormStatus('createCust','edit');
                    });
                   
                }
            }
        });
    })
}
const setPkCustClassReferOrg = function(){
    this.props.meta.getMeta()['createCust'].items.find(item=>{
        if(item.attrcode == 'pk_custclass'){
            let pk_curOrg = null;
            if(this.state.selectedRecords[0].hasOwnProperty('values')){
                pk_curOrg = this.state.selectedRecords[0].values['pk_org'].value;
            }else{
                pk_curOrg = this.state.selectedRecords[0]['pk_org'].value;
            }
            item.queryCondition = Object.assign(item.queryCondition,{pk_org:pk_curOrg});
            
        }
    })
}
/**
 * 供应商关联客户
 * @param param
 */
export const openSupAssociateCust = function(param){
    this.setState(param,()=>{
        /** 点击关联客户  设置 客户参照的条件 */
        setCorCustomerReferCond.call(this,()=>{
            let arg = getCurParam.call(this,'pk_supplier');
            ajax({
                url:this.Urls.associateCustUrl,
                data:arg,
                success:function(res){
                    //根据编码规则禁用客户编码item
                    if(res.success){
                        showFormulaSetting.call(this,res,{'associcust':'form'});
                        this.state.otherParam = res.data.userjson?res.data.userjson:null;
                        this.setState(this.state,()=>{
                            this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'AssociateCustDialog'),{Lang:this.Lang}),()=>{
                                this.props.form.setAllFormValue({'associcust':res.data.associcust});
                                this.props.form.setFormStatus('associcust','edit');
                            });
                        })
                    }
                }.bind(this)
            });
        })
    })
}
const setCorCustomerReferCond = function(callback){
    /***************************************************************
     *  关联客户时，只加载未关联供应商的客户
     ***************************************************************/
    let record = this.state.selectedRecords[0];
    if(!record || !(record['pk_org'].value)){
        return;
    }
    this.props.meta.getMeta()['associcust'].items.find(item=>{
        if(item.attrcode == 'corcustomer'){
            item.queryCondition = {
                pk_org:record['pk_org'].value,
                GridRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.SupAssociateCustReferSqlBuilder'
            }
        }
    })
    this.props.meta.setMeta(this.props.meta.getMeta(),callback.bind(this));
}
/**
 * 已分配组织查询
 * @param param
 */
export const queryHasAssignOrg = function(param){
    this.setState(param,()=>{
        let arg = getCurParam.call(this,'pk_supplier');
        this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'QueryHasAssignOrg'),{Lang:this.Lang}),()=>{
                ajax({
                    url:this.Urls.queryHasAssignOrgUrl,
                    data:{pk_supplier:arg.pk_supplier[0],isQueryAssignOrg:true},
                    success:(res)=>{
                            this.HasAssignOrg.setData(res);
                        }
                    })
                })
        })
}
export const beforeBatchUpdateValidate = function(records,openBatchEditModal){
    let pk_suppliers = new Array(),pk_orgs = new Set(),tsMap = new Map(),hasOrgData = false;
    records && records.forEach(record=>{
        pk_suppliers.push(record.data.values['pk_supplier'].value);
        pk_orgs.add(record.data.values['pk_org'].value);
        tsMap.set(record.data.values['pk_supplier'].value,record.data.values['ts'].value);
        if(!hasOrgData){
            hasOrgData = !(record.data.values['pk_org'].value == record.data.values['pk_group'].value || PK_GLOBE == record.data.values['pk_org'].value);
        }
    })
    ajax({
        url:this.Urls.beforeEditSupValidateUrl,
        data:{pk_suppliers:pk_suppliers,operate:'batchupdate'},
        success:(res)=>{
            if(res.success && res.data){
                openBatchEditModal && openBatchEditModal.call(this,{pk_suppliers:pk_suppliers,pk_orgs:pk_orgs,tsMap:tsMap,hasOrgData:hasOrgData});
            }
        }
    })
}
export const openBatchEditModal = function(param){
    this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'BatchUpdateDialog'),{envParam:this.state.envParam,Lang:this.Lang}),()=>{
        this.Dialog.setButtonName(this.Lang['10140SUG-000049'],this.Lang['10140SUG-000004']);/* 国际化处理： 快速批改,取消*/
        this.BatchUpdateComp.setBatchUpdateCondition(param.pk_suppliers,param.pk_orgs,param.tsMap,param.hasOrgData);
        addOrgAssignField.call(this);
    });
}
export const addOrgAssignField = function(callback){
    if(this.props.nodeType == 'ORG_NODE'){
        let assignSearchItems = this.props.meta.getMeta()['assignsupplierquery'].items;
        if(assignSearchItems[0].attrcode =='pk_org'){
            assignSearchItems[0].required = false;
            this.props.meta.getMeta()['assignsupplierquery'].items = [this.state.orgAssignCacheField].concat(assignSearchItems);
        }
    }
    this.props.meta.getMeta()['assignsupplierquery'].items.forEach(item=>{
        return this.props.nodeType == 'ORG_NODE' && (item.attrcode == 'pk_org' || item.attrcode == 'pk_org_assign') && Object.assign(item,getOrgRefParam(this,'ORG_NODE',this.state.envParam.pk_org));
    })
    this.props.meta.setMeta(this.props.meta.getMeta(),callback);
}
export const removeOrgAssignField = function(callback){
    if(this.props.nodeType == 'ORG_NODE'){
        let assignSearchItems = this.props.meta.getMeta()['assignsupplierquery'].items;
        if(assignSearchItems[0].attrcode =='pk_org_assign'){
            assignSearchItems = assignSearchItems.splice(0,1);
        }
        assignSearchItems.find(item=>{
            if(item.attrcode == 'pk_org'){
                item.required = true;
            }
        })
    }
    this.props.meta.getMeta()['assignsupplierquery'].items.find(item=>{
        return (item.attrcode == 'pk_org' || item.attrcode == 'pk_org_assign') && Object.assign(item,{queryCondition:{}});
    })
    this.props.meta.setMeta(this.props.meta.getMeta(),callback);
}
/**
 * 供应商分配
 * @param param
 */
export const supplierAssign = function(param,isAssign){
    this.setState(param,()=>{
        this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'AssignDialog'),{dialogTitle:isAssign?this.Lang['10140SUG-000001']:this.Lang['10140SUG-000002'],listener:{/* 国际化处理： 快速分配,快速取消分配*/
            onBeforeSureClick:isAssign?this.onSupFastAssignBeforeSureClick:this.onSupFastCancelAssignBeforeSureClick,
            renderContentArea:this.assignContent,
            onAfterCancelClick:this.onAfterDialogClose,
            onAfterSureClick:this.onAfterDialogClose
        }},{Lang:this.Lang}),()=>{
                this.Dialog.setButtonName(isAssign?this.Lang['10140SUG-000203']:this.Lang['10140SUG-000002'],this.Lang['10140SUG-000004']);/* 国际化处理： 分配,取消*/
            });
    })
}

export const openBrowseOrgDocDialog = function(){
    this.setState({openDialog:true},()=>{
        this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'BrowseOrgDocDialog'),{Lang:this.Lang,inlt:this.inlt}),()=>{
            //查看组织档案查询区
            this.props.meta.getMeta()['browse_org_supplierquery'].items.filter(item=>{
                let defaultValue = {value:this.state.indivOrg.pk_org,display:this.state.indivOrg.org_Name};
                if(item.attrcode == 'csupplierid.pk_org' || item.attrcode.endsWith('pk_org')){
                    this.props.search.setSearchValByField('browse_org_supplierquery',item.attrcode, defaultValue);
                }
            })
            this.props.meta.setMeta(this.props.meta.getMeta());
        });
    })
}
export const openOrgBrowseDialog = function(){
    this.setState({openDialog:true},()=>{
        this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'OrgBrowseDialog'),{Lang:this.Lang}));
    })
}
/**
 * 设置单据启用状态
 * @param {*} param 
 * @param {*} enable 
 * @param {*} inCard 
 */
export const setBillEnableState = function(param,enable,inCard){
    let curParam = getCurParam.call(this,'pk_supplier');
    promptBox({
        color:'warning',
        title:inCard?(enable.enable?this.Lang['10140SUG-000121']:this.Lang['10140SUG-000122']):this.Lang['10140SUG-000077'],/* 国际化处理： 确认启用,确认停用,询问*/
        content:inCard?(enable.enable?this.Lang['10140SUG-000166']:this.Lang['10140SUG-000167']):(enable.enable?this.Lang['10140SUG-000168']:this.Lang['10140SUG-000169']),/* 国际化处理： 是否确认要启用？,是否确认要停用？,您确定要启用所选数据吗？,您确定要停用所选数据吗？*/
        beSureBtnClick:function(){
            this.setState(param,()=>{
                ajax({
                    url:this.Urls.enableSupplierUrl,
                    data:Object.assign(curParam,enable,{inCard:inCard,nodeType:this.props.nodeType,pk_curOrg:this.state.envParam.pk_org}),
                    success:(res)=>{
                        let records = res.data[inCard?'supplier_baseInfo_card':'supplier_baseInfo'].rows;
                        this.setState({selectedRecords:records},()=>{
                            replaceLatestSupInfo.call(this,res.data[inCard?'supplier_baseInfo_card':'supplier_baseInfo'].rows,inCard);
                            !inCard && this.disabledEnableButtons(enable.enable);
                            inCard && this.displayEnablestate(enable.enable);
                            toast({title:enable.enable?this.Lang['10140SUG-000128']:this.Lang['10140SUG-000129'],color:'success'});
                        })
                    }
                })
            })
        }.bind(this)
    })
}
/**
 * 申请单查询
 * @param pk_supplier_pf
 */
export const querySupplierApply = function(pk_supplier_pf){
    this.props.openTo('/uapbd/supplier/supplierapply/main/index.html#/card/',{appcode:'10140SPF',pagecode: '10140SPF_card',id:pk_supplier_pf,status:'browse',hideButton:true});
}
/**
 * 禁用生成客户表单中的编码项
 * @param flag
 */
export const disabledCustCodeItem = function(flag){
    
    this.props.form.setFormItemsDisabled('createCust',{code:flag == 'true'});
   
    this.props.meta.setMeta(this.props.meta.getMeta());
}
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

export const emptyCardData = function(){
    this.props.form.EmptyAllFormValue(this.state.card.form.formId);
    this.state.card.table.tableIds.forEach(tableId=>{
        this.props.cardTable.setTableData(tableId,{rows:[]});
    })
}
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
 * 获得当前参数
 */
export const getCurParam = function(primaryKey,record){
    let pkArr = new Array(),tsMap = new Object(),index =  new Array();
    let records = record?(BaseUtils.isArray(record)?record:[record]):this.state.selectedRecords;
    records && records.forEach(record=>{
        if(record.hasOwnProperty('data')){
            pkArr.push(record.data.values[primaryKey].value);
            tsMap[record.data.values[primaryKey].value]=record.data.values['ts'].value;
        }else if(record.hasOwnProperty('values')){
            pkArr.push(record.values[primaryKey].value);
            tsMap[record.values[primaryKey].value]=record.values['ts'].value;
        }else{
            pkArr.push(record[primaryKey].value);
            tsMap[record[primaryKey].value]=record['ts'].value;
        }
        index.push(record.index);

    })
    index && index.reverse();//反转
    return {[primaryKey]:pkArr,tsMap:tsMap,indexs:index};
}

/**
 * 点击【银行账户】按钮：弹出银行账户对话框
 * @param pk_supplier
 */
export const showBankAccDialog = function(pk_supplier){
    this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'BankAccDialog'),{Lang:this.Lang}),()=>{
        setBankAccBtnsAndMeta && setBankAccBtnsAndMeta.call(this);
        this.SupBankAcc.setPk_supplier.call( this ,pk_supplier);
    });
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
export const showAddressBookDialog = function(pk_supplier,param){
    // if(!param.orgId){
    //     param.orgId = this.state.selectedRecords[0]['pk_org'].value;
    // }
    let config = {
        dialogWidth: '80%',
        dialogHeight: '70%',
        dialogZIndex: 'dialogZIndex',
        fieldid:'AddressBook',
        dialogTitle: this.Lang['10140SUG-000065'],/* 国际化处理： 供应商发货地址*/
        showFooter: false,
        showDefaultBtn: false,
        listener: {
            renderContentArea: function () {
                let config = {
                    ...this.state.dialog.supaddress,
                    ...this.props,
                    ...this.state.envParam,
                    Lang:this.Lang,
                    inlt:this.inlt
                };
                return <AddressBook {...Object.assign(config,{Lang:this.Lang,inlt:this.inlt})} ref={(AddressBook) => {this.AddressBook = AddressBook;}}/>
            }.bind(this),
            // onAfterShow: this.AddressBook.setPk_supplier.call(this, pk_supplier,param),
            onAfterSureClick:this.onAfterAddressBookClose,
            onAfterCancelClick:this.onAfterAddressBookClose
        },
        Lang:this.Lang
    }
    let me = this;
    this.Dialog.showDialog(config,()=>{
        this.AddressBook.setPk_supplier.call(me, pk_supplier,param);
    });
}
/**
 * 点击【供应商更名记录】按钮：弹出对话框
 * @param pk_supplier
 */
export const showSupRenameBookDialog = function(pk_supplier,param){
    // if(!param.orgId){
    //     param.orgId = this.state.selectedRecords[0]['pk_org'].value;
    // }
    let config = {
        dialogWidth: '80%',
        dialogHeight: '70%',
        dialogZIndex: 'dialogZIndex',
        fieldid:'SupRename',
        dialogTitle:this.Lang['10140SUG-000234'],/* 国际化处理： 供应商更名记录*/
        showFooter: false,
        showDefaultBtn: false,
        listener: {
            renderContentArea: function () {
                let config = {
                    ...this.state.dialog.suprename,
                    ...this.props,
                    ...this.state.envParam,
                    Lang:this.Lang,
                    inlt:this.inlt
                };
                return <SupRename {...Object.assign(config,{Lang:this.Lang,inlt:this.inlt})} ref={(SupRename) => {this.SupRename = SupRename;}}/>
            }.bind(this),
            // onAfterShow: this.AddressBook.setPk_supplier.call(this, pk_supplier,param),
            onAfterSureClick:this.onAfterAddressBookClose,
            onAfterCancelClick:this.onAfterAddressBookClose
        },
        Lang:this.Lang
    }
    let me = this;
    this.Dialog.showDialog(config,()=>{
        this.SupRename.setPk_supplier.call(me, pk_supplier,param);
    });
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
export const getDialogConfig = function(flag, params={}){
    switch (flag){
        case 'DeleteDialog':
            return {
                showFooter:true,
                style:{
                    dialogWidth:'400px',
                    dialogHeight:'200px',
                    dialogZIndex:'100',
                },
                header:{
                    dialogTitle:this.Lang['10140SUG-000227']||'提示信息'/* 国际化处理： 提示信息*/
                },
                body:{
                    renderContentTitle:()=>{
                        return this.Lang['10140SUG-000039']
                    },
                    renderDialogContent:()=>{

                        return this.Lang['10140SUG-000183']
                    } 
                },
                footer:{
                    renderSelfDefBtns:true,
                    selfDefBtn:{
                        renderCancel:true,
                        buttonItem:[
                            {key:'delete',id:'delete',name:this.Lang['10140SUG-000225'],onClick:()=>{this.onMainTableOperateDelClick(false)},className:'second-button'/*style:{ backgroundColor: '#eee',color: '#666'}*/},/* 国际化处理： 删除*/
                            {key:'asyncDelete',id:'asyncDelete',name:this.Lang['10140SUG-000226'],onClick:()=>{this.onMainTableOperateDelClick(true)},className:'button-primary'/*style:{ backgroundColor: '#E14C46',color: '#fff'}*/},/* 国际化处理： 后台删除*/
                        ]
                    }
                },
                listener:{
                    onAfterCancelClick:()=>{this.setState({openDeleteDialog:false})},
                    doDelete:this.onMainTableOperateDelClick
                }
            };
        case 'BankAccDialog':
            return {
                dialogWidth:'60%',
                dialogHeight:'70%',
                dialogZIndex:'100',
                fieldid:'BankAccDialog',
                dialogTitle:this.Lang['10140SUG-000138'],/* 国际化处理： 银行账户*/
                showFooter:false,
                showDefaultBtn:false,
                listener:{
                    renderContentArea:function(){
                        let config = {
                            ...this.state.dialog.supbankacc,
                            ...this.props,
                            selectedRecords:this.state.selectedRecords,
                            envParam:this.state.envParam,
                            Lang:this.Lang
                        };
                        return <SupBankAcc {...Object.assign(config,{Lang:this.Lang,inlt:this.inlt})} ref={(SupBankAcc)=>{this.SupBankAcc = SupBankAcc;}}/>
                    }.bind(this),
                    onBeforeSureClick:this.onAfterDialogClose,//this.onSupBankaccDialogClose,
                    onBeforeCancelClick:this.onSupBankClickClose,
                    onAfterCancelClick:()=>{this.onAfterDialogClose(()=>{
                        this.state.openCard  && 
                        this.initPageData(this.setCardValue,this.setCardStatus,null,false,true);
                    })},
                    onAfterSureClick:this.onAfterDialogClose
                }
            };
        case 'LinkmanDialog':
            let tempFormStatus = params && params.formStatus ? params.formStatus : 'edit'
            return {
                dialogWidth:'50%',
                dialogHeight:'50%',
                dialogZIndex:'100',
                fieldid:'LinkmanDialog',
                dialogTitle:this.Lang['10140SUG-000136'],/* 国际化处理： 联系人*/
                showFooter:true,
                showDefaultBtn:true,
                listener:{
                    renderContentArea:function(){
                        let config = {
                            ...this.state.dialog.linkman,
                            form:this.props.form,
                            meta:this.props.meta,

                        };
                        return <Linkman formStatus={tempFormStatus} {...Object.assign(config,{Lang:this.Lang,inlt:this.inlt})} ref={(Linkman)=>{this.Linkman = Linkman;}}/>
                    }.bind(this),
                    onBeforeSureClick:this.onLinkmanDialogClose,
                    onAfterCancelClick:this.onAfterDialogClose
                }
            };
        case 'AddressBook':
            return {
                dialogWidth:'80%',
                dialogHeight:'70%',
                dialogZIndex:'dialogZIndex',
                fieldid:'AddressBook',
                dialogTitle:this.Lang['10140SUG-000065'],/* 国际化处理： 供应商发货地址*/
                showFooter:false,
                showDefaultBtn:false,
                listener:{
                    renderContentArea:function(){
                        let config = {
                            ...this.state.dialog.supaddress,
                            ...this.props,
                            selectedRecords:this.state.selectedRecords,
                            envParam:this.state.envParam
                        };
                        return <AddressBook {...Object.assign(config,{Lang:this.Lang,inlt:this.inlt})} ref={(AddressBook)=>{this.AddressBook = AddressBook;}}/>
                    }.bind(this),
                    onAfterSureClick:this.onAfterDialogClose,
                    onAfterCancelClick:this.onAfterDialogClose
                }
            };
        case 'FreezeDialog':
            return {
                dialogWidth:'30%',
                dialogHeight:'30%',
                dialogZIndex:'100',
                fieldid:'FreezeDialog',
                dialogTitle:this.Lang['10140SUG-000172'],/* 国际化处理： 组织范围选择*/
                showFooter:true,
                showDefaultBtn:true,
                listener:{
                    renderContentArea:this.freezeOrgSelect.bind(this),
                    onBeforeSureClick:this.onFreezeDialogClose,
                    onAfterCancelClick:()=>{this.state.freezeOrgParam.value = {};this.onAfterDialogClose();},
                    onAfterSureClick:()=>{this.state.freezeOrgParam.value = {};this.onAfterDialogClose()}
                    //onAfterCancelClick:this.onAfterAddressBookClose
                }



                // showFooter:true,
                // listener:{
                //     onAfterSureClick:this.onFreezeDialogClose
                // },
                // style:{
                //     dialogWidth:'30%',
                //     dialogHeight:'30%',
                //     dialogZIndex:'100',
                // },
                // header:{
                //     dialogTitle:this.Lang['10140SUG-000172'],/* 国际化处理： 组织范围选择*/
                // },
                // body:{
                //     renderDialogContent:this.freezeOrgSelect,
                // }
            }
            break;
        case 'CreateCustDialog':
            return {
                dialogWidth:'50%',
                dialogHeight:'60%',
                dialogZIndex:'100',
                fieldid:'CreateCustDialog',
                dialogTitle:this.Lang['10140SUG-000173'],/* 国际化处理： 生成客户*/
                showFooter:true,
                showDefaultBtn:true,
                listener:{
                    renderContentArea:this.createCustContent,
                    onBeforeSureClick:this.onCreateCustSureBtnClick,
                    onBeforeCancelClick:this.onCreateCustCancelBtnClick,
                    onAfterCancelClick:this.onAfterDialogClose,
                    onAfterSureClick:this.onAfterDialogClose
                }
            }
            break;
        
        case 'AssociateCustDialog':
            return {
                dialogWidth:'40%',
                dialogHeight:'40%',
                dialogZIndex:'100',
                fieldid:'AssociateCustDialog',
                dialogTitle:this.Lang['10140SUG-000174'],/* 国际化处理： 关联客户*/
                showFooter:true,
                showDefaultBtn:true,
                listener:{
                    renderContentArea:this.associateCustContent,
                    onBeforeSureClick:this.onAssociateCustSureClick,
                    onBeforeCancelClick:this.onAssociateCustCancelBtnClick,
                    onAfterCancelClick:this.onAfterDialogClose,
                    onAfterSureClick:this.onAfterDialogClose
                    
                }
            }
            break;
        
        case 'OrgBrowseDialog':
            return {
                dialogWidth:'55%',
                dialogHeight:'80%',
                dialogZIndex:'100',
                fieldid:'OrgBrowseDialog',
                dialogTitle:this.Lang['10140SUG-000175'],/* 国际化处理： 供应商按组织查看*/
                showFooter:false,
                showDefaultBtn:false,
                listener:{
                    renderContentArea:this.orgBrowseContent,
                    onBeforeCancelClick:this.clearOrgBrowseData,
                    onAfterCancelClick:this.onAfterDialogClose
                }
            }
            break;
        case 'BrowseOrgDocDialog':
            return{
                dialogWidth:'90%',
                dialogHeight:'90%',
                dialogZIndex:'dialogZIndex1',
                fieldid:'BrowseOrgDocDialog',
                dialogSize:'max',
                dialogTitle:this.Lang['10140SUG-000176'],
                showFooter:false,
                showDefaultBtn:false,
                listener:{
                    renderContentArea:this.browseOrgDocContent,
                    onBeforeCancelClick:this.onBeforeBrowseOrgDocDialogClose,
                    onAfterCancelClick:this.onAfterDialogClose
                }
            }
            break;
        case 'QueryHasAssignOrg':
            return {
                dialogWidth:'60%',
                dialogHeight:'60%',
                dialogZIndex:'100',
                fieldid:'QueryHasAssignOrg',
                dialogTitle:this.Lang['10140SUG-000177'],
                showFooter:false,
                showDefaultBtn:false,
                listener:{
                    renderContentArea:this.queryHasAssignOrgContent,
                    onAfterCancelClick:this.onAfterDialogClose
                }
            }
        case 'AssignDialog':
            return {
                dialogWidth:'70%',
                dialogHeight:'80%',
                dialogZIndex:'100',
                fieldid:'AssignDialog',
                dialogTitle:this.Lang['10140SUG-000001'],
                showFooter:true,
                showDefaultBtn:true,
                listener:{
                    renderContentArea:this.assignContent,
                    onBeforeSureClick:this.onSupFastAssignBeforeSureClick,
                }
            }
            break;
        case 'BatchUpdateDialog'://批改
            return{
                dialogWidth:'60%',
                dialogHeight:'80%',
                dialogZIndex:'100',
                fieldid:'BatchUpdateDialog',
                dialogTitle:this.Lang['10140SUG-000049'],/* 国际化处理： 快速批改*/
                showFooter:true,
                showDefaultBtn:true,
                listener:{
                    renderContentArea:function(){
                        return <BatchUpatePage {...Object.assign(this.props,{quickBatchUpdate:true,envParam:this.state.envParam},{Lang:this.Lang,inlt:this.inlt})}  ref={(BatchUpdateComp)=>{this.BatchUpdateComp = BatchUpdateComp;}}/>
                    }.bind(this),
                    onBeforeSureClick:function(callback){
                        this.onBatchUpdateFinish(callback);
                    }.bind(this),
                    onBeforeCancelClick:function(callback){
                        this.onBatchUpdateCancelClick(callback);
                    }.bind(this),
                    onAfterCancelClick:this.onAfterDialogClose,
                    onAfterSureClick:this.onAfterDialogClose
                }
            }
            break;

    }
}
/**
 * 查询区 所属组织 参照 条件
 * @param nodeType
 * @param pk_org
 * @returns {*}
 */
export const getOrgRefParam = function (_this,nodeType,pk_org){
    let AppCode = _this.props.getAppCode();
    switch(nodeType){
        case 'GLOBE_NODE':
        case 'GROUP_NODE':
            return {
                refcode:'uapbd/refer/org/BusinessUnitWithGlobleAndCurrGropTreeRef/index.js',
                isMultiSelectedEnabled:true,
                isShowDisabledData:true,
                isRunWithChildren:true,
                queryCondition:{
                    strOrgKey:pk_org,
                    // pk_group:getBusinessInfo().pk_group,
                    isGlobe:nodeType=='GLOBE_NODE',
                    TreeRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.GlobeGroupBusinessRefSqlBuilder'
                }
            }
            break;
        case 'ORG_NODE':
            return {
                refcode:'uapbd/refer/org/BusinessUnitTreeRef/index.js',
                isMultiSelectedEnabled:true,
                isShowDisabledData:true,
                isRunWithChildren:true,
                //增加组织过滤条件
                queryCondition:{
                    AppCode :AppCode,
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
                
            };
    }
}
/**
 * 不需要多级管控校验的按钮
 * @param id
 */
export const besidesCheckButtons = function(id){

    var besidesBtns = ['Add','Card_Add','Card_Refresh','Card_AddressBook','Card_BankAccount','Card_BatchUpdateWizard',
                        'Card_BatchUpdate','BatchUpdateWizard','BatchUpdate','AssignWizard','Card_AssignWizard','QueryHasAssignOrg',
                        'Card_ApplyQuery','ApplyQuery','BankAccount','AddressBook','AddressBook_Refresh','SupBankAcc_Refresh','Card_Return',
                        'Card_Print','Card_Menu_Output','Card_Output','Card_OrgBrowse'];

    return !besidesBtns.includes(id);
    // return id != 'Add' &&
    //     id != 'Card_Add' &&
    //     id != 'Card_Refresh' &&
    //     id != 'Card_AddressBook' && 
    //     id != 'Card_BankAccount' &&
    //     id != 'Card_BatchUpdateWizard' && //卡片向导批改
    //     id !='Card_BatchUpdate' && //卡片批改
    //     id != 'BatchUpdateWizard' &&//向导批改
    //     id !='BatchUpdate' && //批改
    //     id != 'AssignWizard' && //向导分配
    //     id !='Card_AssignWizard' && //卡片向导分配
    //     id !='QueryHasAssignOrg' && 
    //     id != 'Card_ApplyQuery' &&
    //     id != 'ApplyQuery'&&
    //     id != 'BankAccount'&&
    //     id != 'AddressBook' &&
    //     id != 'AddressBook_Refresh'&&
    //     id != 'SupBankAcc_Refresh'&&
    //     id != 'Card_Return'&&
    //     id != 'Card_Print' &&
    //     id != 'Card_Menu_Output' &&
    //     id != 'Card_Output' &&
    //     id != 'Card_OrgBrowse'

}

export const multiLevelManage = function(records,id){
    if(besidesCheckButtons(id) && records){
        let hasAuth = hasOperateAuth.call(this,records);
        if(this.props.nodeType == 'GLOBE_NODE' && !hasAuth){
            toast({content:this.Lang?this.Lang['10140SUG-000178']:this.props.Lang['10140SUG-000178'],color:'warning'});/* 国际化处理： 全局节点只能维护当前节点有权限的数据！*/
            return false;
        }else if(this.props.nodeType == 'GROUP_NODE' && !hasAuth){
            toast({content:this.Lang?this.Lang['10140SUG-000179']:this.props.Lang['10140SUG-000179'],color:'warning'});/* 国际化处理： 集团节点只能维护当前节点有权限的数据！*/
            return false;
        }else if(this.props.nodeType == 'ORG_NODE' && !hasAuth) {
            toast({content: this.Lang?this.Lang['10140SUG-000180']:this.props.Lang['10140SUG-000180'],color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
            return false;
        }else {
            return true;
        }
    }
    return true;
}
/**
 * 判断有无操作权限
 * @param pk_org
 * @param pk_group
 * @returns {boolean}
 */
export const hasOperateAuth = function(records){
    let auth = true;
        let a = records.find(record=>{
        let pk_org = null,pk_group = null;
        if(record.hasOwnProperty('data')){
            pk_org =record.data.values['pk_org'].value;
            pk_group = record.data.values['pk_group'].value;
        }else if(record.hasOwnProperty('values')){
            pk_org =record.values['pk_org'].value;
            pk_group = record.values['pk_group'].value;
        }else{
            pk_org =record['pk_org'].value;
            pk_group = record['pk_group'].value;
        }
        let nodeType = this.props.nodeType;
        if(nodeType == 'GLOBE_NODE' && pk_org!=PK_GLOBE){
            auth = false;
            return record;
        }else if(nodeType == 'GROUP_NODE' && (pk_org != pk_group || pk_org == PK_GLOBE)){
            auth = false;
            return record;
        }else if(nodeType == 'ORG_NODE' && (pk_org == pk_group || pk_org == PK_GLOBE)){
            auth = false;
            return record;
        }
        auth = true;
    });
    return !a;
}
/**
 * 需要处理的模板查询区areacode
 * @type {string[]}
 */
const SEARCH_AREAS = ['supplierquery','browse_org_supplierquery','assignsupplierquery'];
/**
 * 处理模板参照项
 * @param template
 */
export const dealRefTemplateItems = function(template){
    let AppCode = this.props.getAppCode();
    if(!template){return;}
    SEARCH_AREAS.forEach(area=>{
        if(template.hasOwnProperty(area) && template[area].items){
            /***************************************************************
             * 处理查询区参照
             ***************************************************************/
            template[area].items.forEach(item=>{
                switch(item.attrcode){
                    case 'csupplierid.pk_org'://全局+集团+业务单元
                    case 'pk_org':
                    case 'pk_org_assign'://全局+集团+业务单元
                    case 'csupplierid.pk_org_assign':
                        if(area=='supplierquery' ){
                            item = Object.assign(item,getOrgRefParam(this,this.props.nodeType,this.state.envParam.pk_org));
                        }else if(area == 'assignsupplierquery'){
                            item.isMultiSelectedEnabled = true;
                            item.isShowDisabledData = true;
                            item.includeChildren = true;
                        }else{
                            item.isShowDisabledData = true;
                            item = Object.assign(item,getOrgRefParam(this,"ORG_NODE"));
                        }
                        break;
                    case 'csupplierid.pk_supplierclass'://供应商基本分类
                        item.refcode = 'uapbd/refer/supplier/SupplierClassTreeRef/index.js';
                        item.queryCondition = {
                            pk_org:this.state.envParam.pk_org
                        }
                        item.isShowUnit = this.props.nodeType == 'ORG_NODE' || area=='browse_org_supplierquery';
                        item.isMultiSelectedEnabled = true;
                        break;
                    case 'csupplierid.pk_areacl'://地区分类
                        item.refcode = 'uapbd/refer/address/AreaclTreeRef/index.js';
                        break;
                    case 'csupgradesysid'://供应商等级体系
                        item.refcode = 'uapbd/refer/supplier/SupplierGradeSysGridRef/index.js';
                        break;
                    case 'csupgrade'://供应商等级
                        item.refcode = 'uapbd/refer/supplier/SupplierGradeTreeGridRef/index.js';
                        break;
                    case 'pk_supplierext_p.cmarbasclassid':
                        item.refcode = 'uapbd/refer/material/MaterialBasClassTreeRef/index.js';
                        break;
                    case 'pk_suptaxes'://供应商税类
                        item.refcode = 'uapbd/refer/pub/SuptaxesGridRef/index.js';
                        break;
                }
            })
        }
    })
    template['supaddress'].items.forEach(item=>{
        if(item.attrcode=='pk_linkman' || item.attrcode == 'pk_linkman.name' ){
            item.refcode="uapbd/refer/linkman/LinkmanFormRefer/index.js";
        }
    })
    /***************************************************************
     * 由于王伟那边应用注册-模板设置时 读取参照有问题，所以在这里处理国家地区EX参照
     ***************************************************************/
    template['supcountrytaxes'].items.find(item=>{
        if(item.attrcode == 'pk_country'){
            item.refcode = 'uapbd/refer/pubinfo/CountryExDefaultGridRef/index.js';
        }
    });
    /***************************************************************
     *  银行账号 正则校验
     ***************************************************************/
    template['accbasinfo'].items.find(item=>{
        if(item.attrcode == 'accnum'){
            item.reg = new RegExp('^[a-zA-Z0-9\-]*$');//^[a-zA-Z0-9\-]*$
            item.errorMessage = this.Lang['10140SUG-000181'];/* 国际化处理： 只能输入数字！*/
        }
    })
    /***************************************************************
     *  关联客户时，只加载未关联供应商的客户
     ***************************************************************/
    // template['associcust'].items.find(item=>{
    //     if(item.attrcode == 'corcustomer'){
    //         item.queryCondition = {
    //             pk_org:this.state.envParam.pk_org,
    //             GridRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.SupAssociateCustReferSqlBuilder'
    //         }
    //     }
       
    // })
    /***************************************************************
     *  生成客户 客户基本分类参照加过滤条件
     ***************************************************************/
    template['createCust'].items.find(item=>{
        if(item.attrcode == 'pk_custclass'){
            item.queryCondition = {
                pk_org:this.state.envParam.pk_org
                // TreeRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.CreateCustRefSqlBuilder',
                // nodeType:this.props.nodeType
            }
        }
    })
    template['supplier_baseInfo_card'].items.forEach(item=>{
        if(item.attrcode == 'corpaddress'){
            item.refcode='uapbd/refer/pubinfo/AddressRef/index.js';
            // item.refcode='uapbd/refer/pubinfo/RefAddressComp/index.js';
            item.form = this.props.form;
            item.AddressReferId = 'refAddress';
            item.pagecode = this.props.pagecode;
            item.value = {};
            item.onAfterSave = this.onCompanyAddressAfterSave;
        }
        //所属组织参照增加组织权限过滤
        if(item.attrcode == 'pk_org'){
            item.refName= this.Lang['10140SUG-000230'] || '组织'
            item.queryCondition=()=>{
                return {
                    AppCode:AppCode,
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
            }
        }
        //上级供应商添加过滤 & 供应商基本分类过滤条件
        if(item.attrcode == 'pk_supplier_main' ||  item.attrcode == 'pk_supplierclass' ){
            item.queryCondition=()=>{
                return {
                    pk_org:this.props.nodeType == 'GLOBE_NODE' ? PK_GLOBE : this.state.envParam.pk_org,
                }
            }
            if(item.attrcode == 'pk_supplierclass'){
                item.isShowDisabledData = false;
            }
            if(item.attrcode == 'pk_supplier_main'){
                item.onChange = (value)=>{
                    console.debug('value->',value);
                    value && value.value && ajax({
                        url:'/nccloud/uapbd/supplier/supplierMainChange.do',
                        data:{pk_supplier:value.value,refcode:value.refcode || value.code,refname:value.refname||value.display}})
                }
            }
        }
        //地区分类过滤条件
        if(item.attrcode == 'pk_areacl'){
            item.queryCondition=()=>{
                return {
                    pk_org:this.props.nodeType == 'GLOBE_NODE' ? PK_GLOBE : this.state.envParam.pk_org,
                    // nodeType:this.props.nodeType,
                    // TreeRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.SupAreaclTreeRefBuilder'
                }
            }
        }
        //对应业务单元增加组织权限过滤
        if(item.attrcode == 'pk_financeorg'){
            // item.isShowUnit = true;
            // item.unitProps = unitConf;
            item.queryCondition = {
                TreeRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.BusinessUnitRefSqlBuilder'
            }
        }
    })
    template['custsupbankacc'].items.find(item=>{
        if(item.attrcode == 'index'){
            item.width = 50;
        }
    })
    //财务信息 卡片模板
   template['supfinance_card'].items.find(item=>{
       //付款优先级  只能输入1-99之间的数
    //    if(item.attrcode == 'paypriority'){
    //         item.reg = new RegExp('^(?:[1-9]|[1-9]\\d)$');
    //         item.errorMessage = this.Lang['10140SUG-000182'];/* 国际化处理： 输入值介于[1,99]*/
    //    }
   }) 
}
/**
 * 设置编码和删除状态链接
 * @param meta
 */
export const setCodeAndDeleteStatusFieldLink = function(meta){
    meta['supplier_baseInfo'].items.forEach(item => {
        //item.width = 150;
        switch(item.attrcode){
            case 'code'://编码
            case 'deletestate'://删除状态
                item.render = (text, record,index) => {
                    return (
                        <a
                            style={{ textDecoration: 'none', cursor: 'pointer' }}
                            onClick={() => {
                               item.attrcode == 'code'?this.onMainTableDoubleClick(record):
                                   this.showDeleteStateCause(record);
                            }}
                        >
                            {record?(record[item.attrcode] && (record[item.attrcode].display || record[item.attrcode].value) ):null}
                        </a>
                    );
                };
                break;
        }
    });
}
export const indexOf = function(arr,item){
    if(Array.prototype.indexOf){
        return arr.indexOf(item);
    }else{
        for( var i=0;i<arr.length;i++){
            if(arr[i]===item)
                return i;
            else return -1;
        }
    }
}
/**
 * 卡片上 财务信息和采购信息没有数据时，按钮隐藏
 *      刘伟定的
 * @param finance
 * @param purchase
 */
export const hideButtonsWhenNoFiAndPuData = function(finance,purchase){
    this.props.button.setButtonVisible(['Finance_Table_Edit',
        'Finance_Table_Delete',
        'Finance_Table_PayFreeze',
        'Finance_Table_PayUnFreeze',
        'Finance_Table_TicketFreeze',
        'Finance_Table_TicketUnFreeze',
        'Finance_Table_Refresh',
        'Finance_Table_Print',
        'Finance_Table_Output'],!!finance);
    this.props.button.setButtonVisible(['Stock_Table_Edit',
        'Stock_Table_Delete',
        'Stock_Table_AddressBook',
        'Stock_Table_OrderFreeze',
        'Stock_Table_OrderUnFreeze',
        'Stock_Table_Refresh',
        'Stock_Table_Print',
        'Stock_Table_Output'],!!purchase)
}

export const updateFormItemDisable = function({areaId,data = {}}={},callback=()=>{}){
    this.props.form.setFormItemsDisabled(areaId,data);
    setTimeout(callback,0);
}
export const updateFormItemRequire = function({areaId,data = {}}={},callback=()=>{}){
    this.props.form.setFormItemsRequired(areaId,data);
    setTimeout(callback,0);
}
/**
 * 新增时供应商编码 根据编码规则，判断禁用编码项
 * @param flag
 */
export const disableCodeItem = function(flag,callback = ()=>{}){
    this.props.form.setFormItemsDisabled(this.state.card.form.formId,{'code':flag});
    setTimeout(callback,0);
}

/**
 * 设置 财务信息 和 采购信息 专管部门 专管业务员 等参照条件
 *  打开财务信息和采购信息卡片时候就需要设置
 */
export const setFinanceAndStockReferCondition = function(areaid,record){

    this.props.meta.getMeta()[areaid].items.find(item=>{
        /*********************************
         * pk_respdept:财务信息的专管部门
         * respdept:采购信息的专管部门
         *********************************/
        if(item.attrcode == 'pk_respdept' || item.attrcode == 'respdept'){
            item.queryCondition = {
                pk_org:record['pk_org'].value,
                pk_group:record['pk_group'].value,
                TreeRefActionExt:'nccloud.web.uapbd.supplier.suprefcondition.action.RespDeptNCTreeRefSqlBuilder ',
            }
        }
         /*********************************
         * pk_resppsn:财务信息的专管业务员
         * respperson:采购信息的专管业务员
         *********************************/
        if(item.attrcode == 'pk_resppsn' || item.attrcode == 'respperson'){
            item.queryCondition = {
                pk_org:record['pk_org'].value
                
            }
        }
    });
    
}
/**
 * 批量生成客户校验
 * @param {*} records 
 */
export const onBatchCreateCustomer = function(records){
    /**
     * 请求参数
     */
    let param = {
        grid:{
            pageid:this.props.pagecode,
            model:{rows:records.map(record=>{return {values:record.data.values,status:record.data.status,rowid:record.data.rowid}})}
        },
        validate:'validate'
    };
    ajax({
        url:this.Urls.batchCreateCustUrl,
        data:param,
        success:(res)=>{
            let {success,data}=res;
            if(success){
                if(data.validate && data.validate == 'validate'){
                    //校验
                    promptBox({
                        color:'warning',
                        title:data.msgTitle,/* 国际化处理： 批量生成客户提示信息*/
                        content:data.message,
                        beSureBtnClick:()=>{
                            batchCreateCustomer.call(this,Object.assign(param,{validate:''}));
                        }
                    })
                }else{
                    if(data.errorLogResult && data.errorLogResult.errorMsgs && data.errorLogResult.errorMsgs.length>0){
                        toast({title:this.Lang['10140SUG-000218'],content:data.errorLogResult.errorMsgs[0].errormsg,color:'warning'});
                    }else{
                        toast({title:this.Lang['10140SUG-000045'],content:this.Lang['10140SUG-000217'],color:'success'});
                    }
                }
            }
        }
    })
}
/**
 * 执行批量生成客户
 * @param {*} param 
 */
const batchCreateCustomer = function(param){
    ajax({
        url:this.Urls.batchCreateCustUrl,
        data:param,
        success:(res)=>{
            let {success,data}=res;
            if(success){
                if(data.errorLogResult && data.errorLogResult.errorMsgs && data.errorLogResult.errorMsgs.length>0){
                    toast({title:this.Lang['10140SUG-000218'],content:data.errorLogResult.errorMsgs[0].errormsg,color:'warning'});
                }else{
                    toast({title:this.Lang['10140SUG-000045'],content:this.Lang['10140SUG-000217'],color:'success'});
                }
            }
        }
    })
}

export const showFormulaSetting = function(ajaxResult,param){
    //显示公式
    if (ajaxResult.formulamsg && ajaxResult.formulamsg instanceof Array && ajaxResult.formulamsg.length > 0) {
        this.props.dealFormulamsg(
            ajaxResult.formulamsg,param
        );
    }
}

export const validateFormulaSetting = function(data,callback,param,billtype){
    this.props.validateToSave(data,callback,param,billtype);
}
//打开企业画像浏览器页签
export const openBusiPortrait = function(obj){
    let name = obj.name;let pk = obj.pk_supplier;let taxpayerid = obj.taxpayerid;
    //window.open(this.state.busiPortraitUrl+name);
    //下面调用diwork的接口
    window.open("https://cmdm.diwork.com/csmdm/iuapmdm_fr/enterprise.html?serviceCode=CSMDM_Enterprise#/"+name)
    // this.props.openOut(this.state.busiPortraitUrl+name+"/"+taxpayerid);
    // if(!this.state.busiPortraitUrl){
    //     toast({title:'提示',content:'请维护业务参数：云服务平台地址（BDCLOUD01）！'});
    //     return;
    // }
    // let url = this.state.busiPortraitUrl;
    // if(!url.startsWith("http")){
    //     url = "https://"+url;
    // }
    // if(!url.endsWith("#/")){
    //     url+="#/";
    // }
    // window.open("http://"+url+name);
}

export const filterEmptyData = function(data,status){
    const isObject =function (param){
        return Object.prototype.toString.call(param).slice(8, -1) === 'Object';
    }
    if(!isObject(data) || status != 'add'){
        return {rows:[{values:data}]};
    }
    let filterData = new Object();
    Object.keys(data).forEach(key=>{
        data[key] && (data[key].value || data[key].display) && Object.assign(filterData,{[key]:data[key]});
    })
    return {rows:[{values:filterData}]};
}
//WmVDRbxKZCrzbwEmmMdBUS8tlZ5e3VGcoKW1htyWIbmjkg6LUGehyj1U1sjkRU4x