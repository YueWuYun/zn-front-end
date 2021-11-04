//hrMuyooTvB46e0UT49DewOS85QErb1Eze64LCpYl8BJPzUkc+5zPpTnnfZ6v5VzZTB9BE6jYlBtd
//8Quzvwi1WQ==
import {ajax,toast,promptBox} from 'nc-lightapp-front';
import {
    editSupBaseInfo,
    showAddressBookDialog,
    showBankAccDialog,
    deleteSupBaseInfo,
    copySupBaseInfo,
    getCurParam,
    approveSupBaseInfo,
    freezeSupBaseInfo,
    disabledCustCodeItem,
    openSupAssociateCust,
    openSupCreateCust,
    openSupAddressBook,
    openSupBankAcc,
    queryHasAssignOrg,
    supplierAssign,
    getRecordsMap,
    openBatchEditModal, setBillEnableState, resizeForm,
    querySupplierApply,multiLevelManage,
    getDialogConfig,hasOperateAuth,
    openBrowseOrgDocDialog,
    openOrgBrowseDialog,
    beforSupStockEdit,
    beforeEdit,validateAddOrCopy,
    addOrgAssignField,
    removeOrgAssignField,
    hideButtonsWhenNoFiAndPuData,
    showFormulaSetting,
    validateFormulaSetting,beforeBatchUpdateValidate,openBusiPortrait
} from "../utils/SupplierUtils";
import {BaseUtils} from "../../../public/utils";
/******************************************************
 *  供应商卡片界面按钮action
 *  @author liupzhc
 ******************************************************/
let isSuccess =  false;

/**
 * 卡片按钮点击事件
 * @param props
 * @param id
 */
export const onCardButtonClick = function(props,id){
    let formData = this.props.form.getAllFormValue(this.state.card.form.formId);
    //多级管控检验
    if(id!='Card_Return' && id!='Card_OrgBrowse' && id!='Card_BrowseOrgDoc' && id!='Card_QueryHasAssignOrg'
        && id!='Card_Print' && id!='Card_Output' && id!='Card_Refresh' && id!='Card_BusiPortrait'){
            if(!multiLevelManage.call(this,[formData.rows[0].values],id)){
                return;
            }
    }
    switch(id){
        case 'Card_Add':
            this.props.form.setFormItemsRequired('suplinkman',{'pk_linkman.cell':false});
            this.props.form.setFormItemsRequired('linkman',{'cell':false});
            validateAddOrCopy.call(this,()=>{
                editSupBaseInfo.call(this,{
                    status:'add',
                    selectedRecords:[],
                    dirtyRecords:this.state.dirtyRecords || [formData.rows[0].values]
                });
            })
            break;
        case 'Card_Edit'://卡片修改，只改变卡片状态即可
        let ismobilecoopertive = this.props.form.getAllFormValue('supplier_baseInfo_card').rows[0].values['ismobilecoopertive'].value;
            if (ismobilecoopertive) {
                this.props.form.setFormItemsRequired('suplinkman', { 'pk_linkman.cell': true });
                this.props.form.setFormItemsRequired('linkman', { 'cell': true });
            } else {
                this.props.form.setFormItemsRequired('suplinkman', { 'pk_linkman.cell': false });
                this.props.form.setFormItemsRequired('linkman', { 'cell': false });
            }
            beforeEdit.call(this,{
                status:'edit',
                selectedRecords:[formData.rows[0].values],
                dirtyRecords:[formData.rows[0].values]
            },editSupBaseInfo.bind(this));
            break;
        case 'Card_Save':
        case 'Card_SaveAdd':
            beforSaveValidate.call(this,formData,checkForm.bind(this),saveCardInfo.bind(this),id=='Card_SaveAdd'?editSupBaseInfo.bind(this):null);
            break;
        case 'Card_Delete'://卡片删除按钮
            deleteSupBaseInfo.call(this,{selectedRecords:[formData.rows[0].values],dirtyRecords:[formData.rows[0].values],openDeleteDialog:true})
            setCardButtonStatus.call(this);
            break;
        case 'Card_Copy'://卡片复制按钮
            validateAddOrCopy.call(this,()=>{
                copySupBaseInfo.call(this,{
                    selectedRecords:[formData.rows[0].values],
                    dirtyRecords:[formData.rows[0].values],
                    status:'add',
                    openCard:true});
            })
           
            break;
        case 'Card_Cancel'://卡片取消按钮

            promptBox({
                color:'warning',
                title:this.Lang['10140SUG-000067'],/* 国际化处理： 确认取消*/
                content:this.Lang['10140SUG-000068'],/* 国际化处理： 是否确认要取消？*/
                beSureBtnClick:()=>{
                    let requestParam = {};
                    if(this.state.relateQueryId){
                        requestParam.selectedRecords = [formData.rows[0].values];
                        requestParam.dirtyRecords = [formData.rows[0].values];
                        requestParam.status = 'edit_cancel';
                    }else{
                        this.state.status!='edit' && clearCardValue.call(this);//清空表单和列表数据
                        let param = getCurParam.call(this,'pk_supplier',this.state.dirtyRecords);
                        let pk = !!(param && param.pk_supplier && param.pk_supplier[0])?param.pk_supplier[0]:null; 
                        let mainTableData = {rows:this.state.queryRecords}
                        let tableData = mainTableData||this.props.table.getAllTableData(this.state.table.mainTable.id);
                        requestParam = {
                            //是编辑取消 或者 列表有数据时的新增取消 状态为edit_cancel 否则为add_cancel
                            status:(!!pk || tableData.rows && tableData.rows.length>0)?'edit_cancel':'add_cancel'
                        };
                        requestParam.selectedRecords = !pk?((tableData.rows && tableData.rows.length>0)?[tableData.rows[0]]:[]):this.state.dirtyRecords;
                        requestParam.dirtyRecords = !pk?((tableData.rows && tableData.rows.length>0)?[tableData.rows[0]]:[]):this.state.dirtyRecords;
                    }
                    ajax({
                        url:this.Urls.rollbackCodeUrl,
                        data:{
                            nodeType:this.props.nodeType,
                            pk_curOrg:this.state.envParam.pk_org,
                        },
                        success:(res)=>{
                            res.data && this.setState(requestParam,()=>{
                                let param = getCurParam.call(this,'pk_supplier');
                                this.props.cardPagination.setCardPaginationId({id:param.pk_supplier[0],status:1});
                                // true: 是否取消
                                this.initPageData(this.setCardValue,this.setCardStatus,null,true);
                            });
                        }
                    });
                }
            });
            break;
        case 'Card_Return'://卡片返回按钮
            clearCardValue.call(this);//清空卡片的值
            //返回列表界面 并触发一次查询
            //返回列表界面 设置联查id为空
            this.setState({openCard:false,relateQueryId:null},()=>{
                ajax({
                    url:this.Urls.rollbackCodeUrl,
                    data:{
                        nodeType:this.props.nodeType,
                        pk_curOrg:this.state.envParam.pk_org,
                    },
                    success:(res)=>{
                        if(res.data && this.state.queryInfo){
                            this.onSearch({isClickSearch:false, isCardReturn:true},this.setTableData);
                        }
                    }
                })

            });
            break;
        case 'Card_BankAccount'://卡片银行账户按钮
            this.setState({openDialog:true},()=>{
                showBankAccDialog.call(this,formData.rows[0].values['pk_supplier'].value);
            });
            break;
        case 'Card_AddressBook':
        this.setState({openDialog:true},()=>{

            showAddressBookDialog.call(this,formData.rows[0].values['pk_supplier'].value);
        })
            break;
        case 'Card_Approve':
        case 'Card_Menu_Approve':
        case 'Card_UnApprove':
            approveSupBaseInfo.call(this,
                {
                    selectedRecords:[formData.rows[0].values],
                    dirtyRecords:[formData.rows[0].values]
                },//选中项
                {approve:(id=='Card_Approve' || id=='Card_Menu_Approve')},//是否是核准
                this.disabledApproveButtons,//禁用核准按钮
                true);//是否在卡片上
            break;
        case 'Card_Freeze':
        case 'Card_UnFreeze':
            freezeSupBaseInfo.call(this,
                {selectedRecords:[formData.rows[0].values],dirtyRecords:[formData.rows[0].values],openDialog:this.props.nodeType !='ORG_NODE'},
                {freeze:(id=='Card_Freeze')});
            break;
        case 'Card_BankAccount'://银行账户
            openSupBankAcc.call(this,{selectedRecords:[formData.rows[0].values],dirtyRecords:[formData.rows[0].values],openDialog:true});
            break;
        case 'Card_AddressBook'://操作列发货地址
            openSupAddressBook.call(this,{selectedRecords:[formData.rows[0].values],dirtyRecords:[formData.rows[0].values],openDialog:true});
            break;
        case 'Card_CreateCust'://操作列生成客户
            openSupCreateCust.call(this,{selectedRecords:[formData.rows[0].values],dirtyRecords:[formData.rows[0].values],openDialog:true},
                disabledCustCodeItem.bind(this))
            break;
        case 'Card_AssociateCust'://操作列关联客户
            if(formData.rows[0].values['supprop'].value == '1'){
                //内部单位不能进行关联客户操作
                toast({content:this.Lang['10140SUG-000089'],color:'warning'});/* 国际化处理： 内部客商不能进行关联操作。*/
                return;
            }
            openSupAssociateCust.call(this,{selectedRecords:[formData.rows[0].values],dirtyRecords:[formData.rows[0].values],openDialog:true},
                disabledCustCodeItem.bind(this))
            break;
        case 'Card_OrgBrowse'://供应商按组织查看
            openOrgBrowseDialog.call(this);
            // this.OrgBrowseDialog.showDialog();
            break;
        case 'Card_BrowseOrgDoc'://查看组织级供应商
            openBrowseOrgDocDialog.call(this);
            // this.BrowseOrgDocDialog.showDialog();
            break;
        case 'Card_QueryHasAssignOrg'://已分配组织查询
            queryHasAssignOrg.call(this,{selectedRecords:[formData.rows[0].values],dirtyRecords:[formData.rows[0].values],openDialog:true});
            break;
        case 'Card_Assign':
        case 'Card_Menu_Assign':
        case 'Card_CancelAssign':

            supplierAssign.call(this,
                {selectedRecords:[formData.rows[0].values],
                    dirtyRecords:[formData.rows[0].values],
                    openDialog:true},
                (id=='Card_Assign' || id=='Card_Menu_Assign'))
            break;
        case 'Card_AssignWizard':
            this.setState({assignStepClick: true},()=>{
                removeOrgAssignField.call(this,()=>{
                    this.AssignStepDialog.show();
                });
            });
            break;
        case 'Card_Accessory':
            //this.Attachment.showAttachMng({mdid:this.state.envParam.mdid,pk_supplier:formData.rows[0].values['pk_supplier'].value})
            this.Attachment.showAttachMng({mdid: '720dcc7c-ff19-48f4-b9c5-b90906682f45',pk_supplier:formData.rows[0].values['pk_supplier'].value})
            break;
        case 'Card_Print':
        case 'Card_Output':
            this.executePrint(
                {
                    isPrint:id=='Card_Print',
                    url:this.Urls.printSupBaseUrl,
                    nodeKey:'suppliercard',
                    pks:[formData.rows[0].values['pk_supplier'].value],
                    isMainPrint:false
                })
            break;
        case 'Card_BatchUpdate':
            this.setState({openDialog:true},()=>{beforeBatchUpdateValidate.call(this,[{data:formData.rows[0]}],openBatchEditModal)});
            break;
        case 'Card_BatchUpdateWizard':
            this.setState({batchUpdateStepClick:true},()=>{
                addOrgAssignField.call(this,()=>{
                    this.BatchUpdateWarzid.show();
                });
            })
            //this.setState({batchUpdateStepClick: true},()=>{this.BatchStepEdit.show()});
            break;
        case 'Card_Enable':
        case 'Card_Disable':
            setBillEnableState.call(this,{selectedRecords:[formData.rows[0].values],dirtyRecords:[formData.rows[0].values]},{enable:id=='Card_Enable'},true);
            break;
        case 'Card_Refresh':
            resizeForm.call(this,'supplier_baseInfo_card');
            //参数  1、设置卡片值 2、设置卡片状态 3、自定义url 4、是否取消 5、是否刷新
            this.initPageData(this.setCardValue,this.setCardStatus,null,false,true);
            break;
        case 'Card_ApplyQuery':
            let pk_supplier_pf = formData.rows[0].values['pk_supplier_pf'].value
            pk_supplier_pf ? 
                querySupplierApply.call(this,formData.rows[0].values['pk_supplier_pf'].value):
                toast("");
            break;
        case 'Card_Supplier_Template'://模板
            this.SupTemplate.show({
                title:'saveTemp'
            });
            break;
        case 'Card_BusiPortrait':
            openBusiPortrait.call(this,{name:formData.rows[0].values['name'].value,taxpayerid:formData.rows[0].values['taxpayerid'].value});
            break;
    }
}


/**
 * 卡片子表按钮事件
 * @param tableId
 * @param props
 * @param id
 */
export const onCardTableButtonClick = function(tableId,props,id){
    //多级管控检验
    if(!multiLevelManage.call(this,this.state.selectedRecords,id)){
        return;
    }
    switch(tableId){
        case 'suplinkman':
            this.setState({openDialog:true},()=>{
                this.props.form.EmptyAllFormValue('linkman');
                this.props.form.setFormStatus('linkman', 'add'); //设置表单编辑态
                this.Dialog.showDialog(Object.assign(getDialogConfig.call(this,'LinkmanDialog', {formStatus: 'add'}),{Lang:this.Lang}));
            });
            break;
        case 'supcountrytaxes':
            this.props.cardTable.addRow(tableId);
            this.props.cardTable.setStatus(tableId,'edit');
            break;
    }
}
/**
 * 表单校验
 * @returns {*}
 */
const checkForm = function(){
    return this.props.form.isCheckNow(this.state.card.form.formId);
}
/**
 * 保存卡片
 * @param checkForm 表单校验
 * @param addCardInfo 新增卡片信息
 */
const saveCardInfo = function(checkForm,editSupBaseInfo,customerVO,IsRelate){
    let formChecked = (checkForm && typeof checkForm ==='function') ?checkForm.call(this):false;//保存时，表单校验
    if(formChecked){
        let tableIds = this.state.card.table.tableIds.filter(key=>{//获得聚合的tableId
            return this.state.card.table[key].relate == 'agg'
        });
        let data = this.props.createExtCardData('10140SUB_base_card', this.state.card.form.formId,tableIds );//卡片所有数据
        ajax({
            url:this.Urls.saveUrl,
            data:{
                extspecilAggBill:data,
                pagecode:this.props.pagecode,
                step:'1',
                customerVO:customerVO,
                checkflag:IsRelate,
                supplierMainCode:this.state.supplierMain.code,
                supplierMainName:this.state.supplierMain.name
            },
            success:(res)=>{
                res.success &&
                this.setState({
                    status:'browse',
                    selectedRecords:[res.data.head['supplier_baseInfo_card'].rows[0].values],
                    dirtyRecords:[res.data.head['supplier_baseInfo_card'].rows[0].values],
                    allpks:this.state.allpks && this.state.allpks.length>0 && this.state.allpks.concat([res.data.head['supplier_baseInfo_card'].rows[0].values['pk_supplier'].value])
                },()=>{
                    this.props.cardPagination.setCardPaginationId({id:res.data.head['supplier_baseInfo_card'].rows[0].values['pk_supplier'].value,status:2});
                    //设置卡片的值
                    setCardValue.call(this,res.data,setFormStatus,setCardButtonStatus);
                    //成功提示
                    editSupBaseInfo ? editSupBaseInfo.call(this,{
                        status:'add',
                        selectedRecords:[],
                        dirtyRecords:[res.data.head['supplier_baseInfo_card'].rows[0].values]
                    }):toast({ color: 'success', title: this.Lang['10140SUG-000069'] });/* 国际化处理： 保存成功！*/;
                    
                })
            }
        })
    }
}
/**
 * 删除供应商国家税类的空行
 */
const deleteSupCountryTaxEmptyRecord = function(){
    this.props.cardTable.filterEmptyRows('supcountrytaxes',['pk_country','pk_taxes'],'include');
}

const beforSaveValidate = function(formData,checkForm,saveCardInfo,editSupBaseInfo){
    let formChecked = (checkForm && typeof checkForm ==='function') ?checkForm.call(this):false;//保存时，表单校验
    if(formChecked){
        let tableIds = this.state.card.table.tableIds.filter(key=>{//获得聚合的tableId
            return this.state.card.table[key].relate == 'agg'
        });
        deleteSupCountryTaxEmptyRecord.call(this);
        var tables = new Object();
        this.state.card.table.tableIds.forEach(tableId=>{
            tables[tableId] = 'cardTable';
        });
        let data = this.props.createExtCardData(this.props.pagecode, this.state.card.form.formId,tableIds );//卡片所有数据
        let ismobilecoopertive = data.head.supplier_baseInfo_card.rows[0].values.ismobilecoopertive
        if(ismobilecoopertive && ismobilecoopertive.value){
            let suplinkmans = data.bodys.suplinkman.rows;
            let index = true;
            if(suplinkmans && suplinkmans.length > 0){
                for(let suplinkman of suplinkmans){
                    if(suplinkman.status != 3){
						index = false;
					}
                    let cell = suplinkman.values['pk_linkman.cell'];
                    if(!cell.value){
                       toast({title:this.Lang['10140SUG-000229'],color:'warning'})
                        return; 
                    }
                }
                if(index){
					toast({title:this.Lang['10140SUG-000228'],color:'warning'})
                        return; 
				}
            } else{
                toast({title:this.Lang['10140SUG-000228'],color:'warning'})
                return;
            }
        }
        //验证公式
        validateFormulaSetting.call(this,data,()=>{
            ajax({
                url:this.Urls.saveUrl,
                data:{
                    extspecilAggBill:data,
                    pagecode:this.props.pagecode,
                    step:'0',
                    customerVO:null,
                    checkflag:true,
                    supplierMainCode:this.state.supplierMain.code,
                    supplierMainName:this.state.supplierMain.name
                },
                success:function(res){
                    if(res.success){
                        if(!!res.data && !!res.data.msg){
                            let {msg,customer} =res.data;
                            //存在客商关系
                            promptBox({
                                color:'warning',
                                title:this.Lang['10140SUG-000045'],/* 国际化处理： 提示*/
                                content: msg,
                                beSureBtnClick:function(){
                                    saveCardInfo.call(this,checkForm,editSupBaseInfo,customer,true);
                                }.bind(this),
                                cancelBtnClick:()=>{
                                    saveCardInfo.call(this,checkForm,editSupBaseInfo,customer,false);
                                }
                            })
                        }else{
                            this.setState({
                                status:'browse',
                                selectedRecords:[res.data.head['supplier_baseInfo_card'].rows[0].values],
                                dirtyRecords:[res.data.head['supplier_baseInfo_card'].rows[0].values],
                                allpks:this.state.allpks && this.state.allpks.length>0 && this.state.allpks.push(res.data.head['supplier_baseInfo_card'].rows[0].values['pk_supplier'].value)
                            },()=>{
                                this.props.cardPagination.setCardPaginationId({id:res.data.head['supplier_baseInfo_card'].rows[0].values['pk_supplier'].value,status:2});
                                //设置卡片的值
                                setCardValue.call(this,res.data,setFormStatus,setCardButtonStatus);
                                //成功提示
                                editSupBaseInfo ? editSupBaseInfo.call(this,{
                                    status:'add',
                                    selectedRecords:[],
                                    dirtyRecords:[res.data.head['supplier_baseInfo_card'].rows[0].values]
                                }):toast({ color: 'success', title: this.Lang['10140SUG-000069'] });/* 国际化处理： 保存成功！*/
                                
                            })
                        }
                    }
                }.bind(this)
            })
        },{
            [this.state.card.form.formId]:'form',
            ...tables
        },'extcard')
    }
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
const setCardValue = function (data,setFormStatus,setButtonStatus){
    //设置表单数据
    this.props.form.setAllFormValue({[this.state.card.form.formId]:data.head[this.state.card.form.formId]});
    //设置表格数据
    !!data.table && Object.keys(this.state.card.table.tableIds).forEach((key)=>{
        this.props.cardTable.setTableData(this.state.card.table[key].tableId, data.body[this.state.card.table[key].tableId]);
    });
    setFormStatus && setFormStatus.call(this);//设置卡片状态
    setButtonStatus && setButtonStatus.call(this);//设置卡片按钮状态
}
/**
 * 设置卡片状态
 */
const setFormStatus = function(){
    this.props.form.setFormStatus(this.state.card.form.formId,this.state.status);//设置form状态
    this.state.card.table.tableIds.forEach((key)=>{//设置table状态
        this.props.cardTable.setStatus(this.state.card.table[key].tableId,this.state.status);
    });
}
/**
 * 清空卡片数据
 */
const clearCardValue = function (){
    this.props.form.EmptyAllFormValue(this.state.card.form.formId);//清空表单和列表数据
    this.state.card.table.tableIds.forEach(id=>{
        this.props.cardTable.setTableData(this.state.card.table[id].tableId,{rows:[]});
    });
}
/**********************************财务信息和采购信息按钮处理事件 以下*****************************************/

/**
 * 财务信息或采购信息卡片按钮点击事件
 * @param tableId
 * @param props
 * @param id
 */
export const onFinanceOrPurchaseCardButtonClick = function (tableId,props,id){
    
    switch(id){
        case 'Finance_Edit':
            setFinanceOrPurchaseEdit.call(this,tableId);
            // tableId == 'finance'? setFinanceOrPurchaseEdit.call(this,tableId):
            // beforSupStockEdit.call(this,this.state.dblClkRecord).then((flag)=>{
            //     if(flag){
            //         setFinanceOrPurchaseEdit.call(this,tableId);
            //     }
            // })

            // beforSupStockEdit.call(this,setFinanceOrPurchaseEdit.bind(this))(tableId);
            // props.form.setFormStatus(tableId=='finance'?'supfinance_card':'supstock_card','edit');
            // setFinanceCardBtnStatus.call(this,'edit');
            break;
        case 'Finance_Delete':
            onFinanceOrStockDelete.call(this,true,tableId);
            break;
        case 'Finance_Refresh'://刷新和取消
        case 'Finance_Cancel':
            reloadSupFinanceOrStockCardInfo.call(this,tableId,setCardStatus,id=='Finance_Refresh');
            break;
        case 'Finance_Save':
            onFinanceOrStockSave.call(this,tableId=='finance'?'supfinance_card':'supstock_card');
           
            
            break;
        case 'Finance_Print':
        case 'Finance_Output':
            let formData = this.props.form.getAllFormValue(tableId=='finance'?'supfinance_card':'supstock_card')
            this.executePrint({
                isPrint:id=='Finance_Print',
                url:tableId=='finance'?this.Urls.printSupFinanceUrl:this.Urls.printSupStockUrl,
                nodeKey:tableId=='finance'?'supfinancecard':'supstockcard',
                pks:[tableId=='finance'?formData.rows[0].values['pk_supfinance'].value:formData.rows[0].values['pk_supstock'].value],
                isMainPrint:false
            });
            break;
    }
}
/**
 * 财务组织 列表按钮 单独处理
 * @param props
 * @param id
 */
export const onFinanceTableButtonClick = function (props,id){
    let selectedRecord = props.cardTable.getCheckedRows('finance');
    if(id!='Finance_Table_Print' && id!='Finance_Table_Output' && id!='Finance_Table_Refresh'){
        //多级管控检验
        if(!multiLevelManage.call(this,this.state.selectedRecords,id)){
            return;
        }
    }
    switch(id){
        case 'Finance_Table_Edit'://修改
            !selectedRecord || selectedRecord==0?toast({content:this.Lang['10140SUG-000090'],color:'warning'}):/* 国际化处理： 请选中一张单据！*/
            // this.setState({
            //     dblClkRecord:selectedRecord[0]
            // },()=>{
                this.onRowDoubleClick('finance','edit',this.props,selectedRecord[0],null);
            // })
            break;
        case 'Finance_Table_Delete'://删除
            !selectedRecord || selectedRecord.length==0?toast({content:this.Lang['10140SUG-000090'],color:'warning'}):/* 国际化处理： 请选中一张单据！*/
            this.setState({
                dblClkRecord:selectedRecord
            },()=>{
                onFinanceOrStockDelete.call(this,false,'finance');
            });
            break;
        case 'Finance_Table_PayFreeze'://支付冻结解冻
        case 'Finance_Table_PayUnFreeze':
            !selectedRecord || selectedRecord.length == 0?toast({content:this.Lang['10140SUG-000091'],color:'warning'}):/* 国际化处理： 请选择待付款冻结的数据！*/
                this.setState({
                    dblClkRecord:selectedRecord
                },()=>{
                    onFinanceFreeze.call(this,id=='Finance_Table_PayFreeze','isPay',checkHasFreezeData)
                })
            break;
        case 'Finance_Table_TicketFreeze'://开票冻结解冻
        case 'Finance_Table_TicketUnFreeze':
            !selectedRecord || selectedRecord.length == 0?toast({content:this.Lang['10140SUG-000092'],color:'warning'}):/* 国际化处理： 请选择待开票冻结的数据！*/
                this.setState({
                    dblClkRecord:selectedRecord
                },()=>{
                    onFinanceFreeze.call(this,id=='Finance_Table_TicketFreeze','isTicket',checkHasFreezeData);
                })

            break;
        case 'Finance_Table_Refresh'://列表刷新
            querySupFinanceOrStockTableData.call(this,'finance');
            break;
        case 'Finance_Table_Print'://打印输出
        case 'Finance_Table_Output':
            let pk_supfinances = this.props.table.getAllTableData('finance').rows.map(record=>{
                return record.values['pk_supfinance'].value;
            });
            this.executePrint(
                {
                    isPrint:id=='Finance_Table_Print',
                    url:this.Urls.printSupFinanceUrl,
                    nodeKey:'supfinancelist',
                    pks:pk_supfinances,
                    isMainPrint:false
                });
            break;

    }
}
/**
 * 采购组织 列表按钮 单独处理
 * @param props
 * @param id
 */
export const onStockTableButtonClick = function (props,id){
    let selectedRecord = props.cardTable.getCheckedRows('purchase');
    if(id!='Stock_Table_Refresh' && id!='Stock_Table_Print' && id!='Stock_Table_Output'){
        if(!multiLevelManage.call(this,this.state.selectedRecords,id)){
            return;
        }
    }
    switch(id){
        case 'Stock_Table_Edit'://修改
            !selectedRecord || selectedRecord==0?toast({content:this.Lang['10140SUG-000090'],color:'warning'}):/* 国际化处理： 请选中一张单据！*/
                // this.setState({
                //     dblClkRecord:selectedRecord
                // },()=>{
                    // beforSupStockEdit.call(this).then((flag)=>{
                    //     if(flag){
                    //         this.onRowDoubleClick('purchase','edit',this.props,selectedRecord[0],null);
                    //     }
                    // })
                    this.onRowDoubleClick('purchase','edit',this.props,selectedRecord[0],null);
                    // beforSupStockEdit.call(this,this.onRowDoubleClick.bind(this,'purchase','edit',this.props,selectedRecord[0],null))
                // })
            break;
        case 'Stock_Table_Delete'://删除
            !selectedRecord || selectedRecord==0?toast({content:this.Lang['10140SUG-000090'],color:'warning'}):/* 国际化处理： 请选中一张单据！*/
                this.setState({
                    dblClkRecord:selectedRecord
                },()=>{
                    onFinanceOrStockDelete.call(this,false,'purchase');
                });
            break;
        // case 'Stock_Table_AddressBook'://采购信息地址簿
        //     this.setState({openAddress:true},()=>{
        //         showAddressBookDialog.call(this,
        //             selectedRecord[0].data.values['pk_supplier'].value,
        //             {
        //                 pk_supstock:selectedRecord[0].data.values['pk_supstock'].value,
        //                 baseInfoAddress:false,
        //                 orgId:selectedRecord[0].data.values['pk_org'].value
        //             });
        //     });
        //     break;
        case 'Stock_Table_OrderFreeze'://订单冻结解冻
        case 'Stock_Table_OrderUnFreeze':
            !selectedRecord || selectedRecord == '0'?toast({content:this.Lang['10140SUG-000093'],color:'warning'}):/* 国际化处理： 请选择待订单冻结的数据！*/
                this.setState({
                    dblClkRecord:selectedRecord
                },()=>{
                    onStockOrderFreeze.call(this,id=='Stock_Table_OrderFreeze',checkHasFreezeData)
                })
            break;
        case 'Stock_Table_Refresh'://列表刷新
            querySupFinanceOrStockTableData.call(this,'purchase');
            break;
        case 'Stock_Table_Print'://打印输出
        case 'Stock_Table_Output':
            let pk_supstocks = this.props.table.getAllTableData('purchase').rows.map(record=>{
                return record.values['pk_supstock'].value;
            });
            this.executePrint(
                {
                    isPrint:id=='Stock_Table_Print',
                    url:this.Urls.printSupStockUrl,
                    nodeKey:'supstocklist',
                    pks:pk_supstocks,
                    isMainPrint:false
                });
            break;

    }
}



// const beforSupStockEdit = function(callback){
//     let param = getCurParam.call(this,'pk_supplier');//获得请求参数
//     let supstock = getCurParam.call(this,'pk_supstock',this.state.dblClkRecord);
//     return new Promise((reslove)=>{
//         ajax({
//             url:this.Urls.beforeSupStockEditUrl,
//             data:{
//                 pk_supplier:param['pk_supplier'][0],pk_supstock:supstock['pk_supstock'][0]
//             },
//             success:(res)=>{
//                 if(res.success){
//                     resolve(res.success);
//                 }
//             }
//         })
//     })
// }

const setFinanceOrPurchaseEdit = function(tableId){
    this.props.form.setFormStatus(tableId=='finance'?'supfinance_card':'supstock_card','edit');
    setFinanceCardBtnStatus.call(this,'edit');
}
/**
 * 刷新时 查询财务信息列表信息
 */
const querySupFinanceTableData = function(callback){
    let param = getCurParam.call(this,'pk_supplier');
    param.nodeType = this.props.nodeType;
    ajax({
        url:this.Urls.querySupFinanceTableUrl,
        data:param,
        success:(res)=>{
            if(res.success){
                this.props.cardTable.setTableData('finance',res.data?{rows:res.data['finance'].rows}:{rows:[]});
                callback && callback(res.data);
            }
        }
    })
}
/**
 * 刷新时 查询
 * @param tableId
 */
export const querySupFinanceOrStockTableData = function(tableId,isClose){
    let param = getCurParam.call(this,'pk_supplier');
    param.nodeType = this.props.nodeType;
    ajax({
        url:tableId=='finance'?this.Urls.querySupFinanceTableUrl:this.Urls.querySupStockTableUrl,
        data:param,
        success:(res)=>{
            if(res.success){
                this.props.cardTable.setTableData(tableId,res.data?{rows:res.data[tableId].rows}:{rows:[]})
                !isClose && toast({title:this.Lang['10140SUG-000200'],color:'success'})/* 国际化处理： 刷新成功！*/
            }
        }
    })
}

/**
 * 刷新时 查询采购信息列表信息
 */
const querySupStockTableData = function(callback){
   
    let param = getCurParam.call(this,'pk_supplier');
    param.nodeType = this.props.nodeType;
    ajax({
        url:this.Urls.querySupStockTableUrl,
        data:param,
        success:(res)=>{
            if(res.success){
                //设置表格数据
                this.props.cardTable.setTableData('purchase',res.data?{rows:res.data['purchase'].rows}:{rows:[]})
               
                callback && callback(res.data);
            }
        }
    })
    
}
/**
 * 财务信息付款和开票的冻结解冻
 * @param flag
 * @param freezeFlag
 * @param callback
 */
const onFinanceFreeze = function(flag,freezeFlag,callback){
    /********************************************
     * 检查是否有需要冻结或解冻的数据
     ********************************************/
    if(!(callback && callback.call(this,flag,'finance',freezeFlag=='isPay'?'payfreezeflag':'makeoutfreezeflag'))){
        return;
    }
    let message = freezeFlag=='isPay'?this.Lang['10140SUG-000094']:this.Lang['10140SUG-000095'];/* 国际化处理： 是否确认付款,是否确认开票*/
    message += flag?this.Lang['10140SUG-000096']:this.Lang['10140SUG-000097']/* 国际化处理： 冻结？,解冻？*/
    promptBox({
        color:'warning',
        title: this.Lang['10140SUG-000045'],/* 国际化处理： 提示*/
        content: message,
        beSureBtnClick: function(){
            let param = getCurParam.call(this,'pk_supplier',this.state.dblClkRecord);
            ajax({
                url:this.Urls[freezeFlag=='isPay'?'onFinancPayFreezeUrl':'onFinanceTicketFreezeUrl'],
                data:Object.assign(getCurParam.call(this,'pk_supfinance',this.state.dblClkRecord),{freeze:flag,nodeType:this.props.nodeType},{pk_supplier:param['pk_supplier'][0]}),
                success:function(res){
                    if(res.success){
                        let tableDataObj = getRecordsMap.call(this,'finance','pk_supfinance');//列表所有数据Map
                        // querySupFinanceOrStockTableData.call(this,'finance');
                        /**************************************
                         * 重置列表数据
                         *  @param 列表数据组成的map
                         *  @param 冻结或解冻成功后的返回数据
                         *  @param 供应商财务组织主键key
                         *  @param 需要修改的itemKey
                         *  @param tableId
                         **************************************/
                        resetTableData.call(this,tableDataObj,res.data['finance'].rows,'pk_supfinance',freezeFlag=='isPay'?'payfreezeflag':'makeoutfreezeflag','finance');
                        //成功提示
                        freezeFlag=='isPay' ? toast({content:flag?this.Lang['10140SUG-000098']:this.Lang['10140SUG-000099'],color:'success'}):/* 国际化处理： 付款冻结成功！,付款解冻成功！*/
                            toast({content:flag?this.Lang['10140SUG-000100']:this.Lang['10140SUG-000101'],color:'success'});/* 国际化处理： 开票冻结成功！,开票解冻成功！*/
                    }
                }.bind(this)
            })
        }.bind(this)});
}
/**
 * 采购信息订单冻结/解冻
 * @param flag
 * @param callback
 */
const onStockOrderFreeze = function(flag,callback){
    /********************************************
     * 检查是否有需要冻结或解冻的数据
     ********************************************/
    if(!(callback && callback.call(this,flag,'purchase','orderfreezeflag'))){
        return;
    }
    let message = !!flag?this.Lang['10140SUG-000102']:this.Lang['10140SUG-000103'];/* 国际化处理： 是否确认订单冻结？,是否确认订单解冻？*/
    promptBox({
        color:'warning',
        title: this.Lang['10140SUG-000045'],/* 国际化处理： 提示*/
        content: message,
        beSureBtnClick: function(){
            let param = getCurParam.call(this,'pk_supplier',this.state.dblClkRecord);
            ajax({
                url:this.Urls.supStockFreezeUrl,
                data:Object.assign(getCurParam.call(this,'pk_supstock',this.state.dblClkRecord),{freeze:flag,nodeType:this.props.nodeType},{pk_supplier:param['pk_supplier'][0]}),
                success:function(res){
                    if(res.success){
                        let tableDataObj = getRecordsMap.call(this,'purchase','pk_supstock');//列表所有数据Map
                        // querySupFinanceOrStockTableData.call(this,'purchase');
                        /**************************************
                         * 重置列表数据
                         *  @param 列表数据组成的map
                         *  @param 冻结或解冻成功后的返回数据
                         *  @param 供应商财务组织主键key
                         *  @param 需要修改的itemKey
                         *  @param tableId
                         **************************************/
                        resetTableData.call(this,tableDataObj,res.data['purchase'].rows,'pk_supstock','orderfreezeflag','purchase');
                        //成功提示
                        toast({content:flag?this.Lang['10140SUG-000104']:this.Lang['10140SUG-000105'],color:'success'});/* 国际化处理： 订单冻结成功！,订单解冻成功！*/
                    }
                }.bind(this)
            })
        }.bind(this)});
}
/**
 * 冻结解冻后重置表格数据
 * @param tableDataObj
 * @param newData
 * @param primaryKey
 * @param compareItemKey
 * @param tableId
 */
const resetTableData = function(tableDataObj,newData,primaryKey,compareItemKey,tableId){
    let oldValueArr = this.props.cardTable.getAllData(tableId);
    let newDataMap = new Map();
    //最新数据的集合
    newData.forEach(row=>{
        newDataMap.set(row.values[primaryKey].value,row);
    })
    oldValueArr && oldValueArr.rows.forEach(row=>{
        let newRow = newDataMap.get(row.values[primaryKey].value);
        if(newRow && newRow.hasOwnProperty('values')){
            //冻结或解冻后 需要设置修改人、修改时间、ts、以及冻结/解冻的字段
            row.values[compareItemKey].value = newRow.values[compareItemKey].value;
            row.values['ts'].value = newRow.values['ts'].value;
            row.values['modifiedtime'].value = newRow.values['modifiedtime'].value;
            row.values['modifier'] = newRow.values['modifier'];
        }
    })
    //设置表格数据
    this.props.cardTable.setTableData(tableId,{rows:oldValueArr.rows});
}
/**
 * 财务组织和采购组织保存方法
 * @param tableId
 */
const onFinanceOrStockSave = function(formId,tableId){
    
    if(!this.props.form.isCheckNow(formId)){
        return;
    }
    let formData = this.props.form.getAllFormValue(formId);
    formData.areacode = formId;
    let data = {
        model:formData,
        pageid:this.props.pagecode
    };
    //验证公式
    validateFormulaSetting.call(this,data,()=>{
        let _this = this;
        ajax({
            url:formId=='supfinance_card'?this.Urls.saveFinanceInfoUrl:this.Urls.saveStockInfoUrl,
            data:{
                model:formData,
                pageid:this.props.pagecode
            },
            success:(res)=>{
                if(res.success){
                    /*********************************
                     * 显示公式适配
                     *********************************/
                    showFormulaSetting.call(this,res,{[formId]:'form'});
                    /*********************************
                     * 设置财务/采购信息卡片按钮状态
                     *********************************/
                    setFinanceCardBtnStatus.call(this,'browse');
                    /*********************************
                     * 设置财务/采购信息卡片状态
                     *********************************/
                    setCardStatus.call(this,formId,'browse');
                    /*********************************
                     * 卡片赋值
                     *********************************/
                    this.props.form.setAllFormValue({[formId]:res.data[formId]});//设置表单数据
                    _this.state.dblClkRecord.values=res.data[formId].rows[0].values;
                    toast({title:'保存成功！',color:'success'});
                    isSuccess=true;
                    resizeForm.call(this,'supplier_baseInfo_card');
                }
            }
        })
    },{[formId]:'form'},'form');
    
}
/**
 * 财务信息或采购信息删除操作
 * @param inCard
 * @param tableId
 */
export const onFinanceOrStockDelete = function(inCard,tableId){
    promptBox({
        color:'warning',
        title: this.Lang['10140SUG-000071'],/* 国际化处理： 确认删除*/
        content: this.Lang['10140SUG-000072'],/* 国际化处理： 您确定要删除所选数据吗?*/
        beSureBtnClick: function(){
            deleteFinanceOrStock.call(this,inCard,tableId);
        }.bind(this)
    })
}
export const deleteFinanceOrStock = function(inCard,tableId){
    let param = getCurParam.call(this,tableId=='finance'?'pk_supfinance':'pk_supstock',this.state.dblClkRecord);
    let pk_supplierParam = getCurParam.call(this,'pk_supplier',this.state.dblClkRecord);
    ajax({
        url:this.Urls[tableId=='finance'?'delFinanceInfoUrl':'delStockInfoUrl'],
        data:Object.assign(param,{pk_supplier:pk_supplierParam['pk_supplier'][0]}),
        success:function(res){
            debugger
            if(res.success){
                /*********************************
                 * 删除表格上的行
                 *********************************/
                tableId=='finance'?querySupFinanceTableData.call(this,(data)=>{
                /*********************************
                 * 卡片上删除数据后 加载下一条数据
                 *********************************/
                
                loadNextInCardWhenDel.call(this,tableId,inCard,data);

                // let finance = this.props.cardTable.getAllData('finance'),purchase = this.props.cardTable.getAllData('purchase');
                let purchase = this.props.cardTable.getAllRows('purchase');
                // setFinanceOrStockTableButtonStatus.call(this);
                hideButtonsWhenNoFiAndPuData.call(this,data,purchase.length>0);

                }):querySupStockTableData.call(this,(data)=>{
                /*********************************
                 * 卡片上删除数据后 加载下一条数据
                 *********************************/
                loadNextInCardWhenDel.call(this,tableId,inCard,data);

                    // let finance = this.props.cardTable.getAllData('finance'),purchase = this.props.cardTable.getAllData('purchase');
                    let finance = this.props.cardTable.getAllRows('finance');
                    hideButtonsWhenNoFiAndPuData.call(this,finance.length>0,data);
                });
                // delCurTableDataByRowId.call(this,tableId);
                
                
            }
        }.bind(this)
    })
}
/**
 * 删除列表数据
 * @param tableId
 */
const delCurTableDataByRowId = function(tableId){
    setTimeout(()=>{
        let records = BaseUtils.isArray(this.state.dblClkRecord)?this.state.dblClkRecord:[this.state.dblClkRecord]
        records.forEach(record=>{
            this.props.cardTable.delRowByRowId(tableId,record.data?record.data.rowid:record.rowid);
        })
        toast({title:this.Lang['10140SUG-000073'],color:'success'});
    },1);
    setTimeout(()=>{
        this.setState(this.state,()=>{
            let finance = this.props.cardTable.getAllRows('finance'),purchase = this.props.cardTable.getAllRows('purchase');
            hideButtonsWhenNoFiAndPuData.call(this,finance.length>0,purchase.length>0);
        })
    },2);
    
}
/**
 * 卡片上删除时加载下一行
 * @param tableId
 * @param inCard
 */
const loadNextInCardWhenDel = function(tableId,inCard,data){
    if(inCard){
        if(!data){
            this.props.form.EmptyAllFormValue(tableId=='finance'?'supfinance_card':'supstock_card');
            this.props.button.setButtonDisabled(['Finance_Edit','Finance_Delete','Finance_Refresh','Finance_Print','Finance_Output'],!data);
        }else{
            let records = this.props.cardTable.getAllData(tableId);//获得表格数据
        
            this.setState({dblClkRecord:records.rows[0]},()=>{
                //重载卡片信息
                reloadSupFinanceOrStockCardInfo.call(this,tableId,setCardStatus);
            });
        }
    }
   
}
/**
 * 重新加载财务信息卡片信息
 * @param tableId
 * @param callback
 */
const reloadSupFinanceOrStockCardInfo = function(tableId,callback,isRefresh){
    //根据tableId 判断加载财务信息卡片信息还是采购信息卡片信息
    (tableId && tableId == 'finance')?
        this.onFinanceDialogAfterShow(setFinanceCardBtnStatus.bind(this,'browse'),callback,'browse',isRefresh):
        this.onStockDialogAfterShow(setFinanceCardBtnStatus.bind(this,'browse'),callback,'browse',isRefresh);
}
/**
 * 设置财务信息和采购信息卡片状态
 * @param formId
 * @param status
 */
export const setCardStatus = function(formId,status){
    this.props.form.setFormStatus(formId,status);
}
/**
 * 设置财务信息卡片上按钮状态
 * @param status
 */
export const setFinanceCardBtnStatus = function(status){
    this.props.button.setButtonVisible(['Finance_Edit','Finance_Delete','Finance_Refresh','Finance_Print'],status=='browse');
    this.props.button.setButtonVisible(['Finance_Save','Finance_Cancel'],status!='browse');
}
/**
 * 检查是否有需要冻结或者解冻的数据
 * @param flag
 * @param tableId
 * @param key
 */
const checkHasFreezeData = function(flag,tableId,key,callback){
    let has = this.props.cardTable.getCheckedRows(tableId).find(row=>{
        if(flag && !row.data.values[key].value){
            return row;
        }else if(!flag && row.data.values[key].value){
            return row;
        }
    });
    if(!has){
        toast({content:flag?this.Lang['10140SUG-000106']:this.Lang['10140SUG-000107'],color:'warning'});/* 国际化处理： 无需要冻结的数据！,无需要解冻的数据！*/
        return false;
    }
    return true;
}
/**********************************财务信息和采购信息按钮处理事件 以上*****************************************/
/**
 * 设置按钮状态
 */
export const setCardButtonStatus = function(flag,isDelete){
    let status = !!flag?flag:this.state.status;
    switch (status){
        case 'add':
            this.props.button.setButtonVisible(
                ['Card_Add','Card_Edit','Card_Refresh','Card_Delete','Card_Copy',
                    'Card_BatchUpdate','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve','Card_UnApprove',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print','Card_Enable','Card_Disable','Card_ApplyQuery','More'],false);
            this.props.button.setButtonVisible(['Card_Save','Card_SaveAdd','Card_Cancel','Card_Supplier_Template'],true);
            break;
        case 'edit':
            this.props.button.setButtonVisible(
                ['Card_Add','Card_Edit','Card_Refresh','Card_Delete','Card_Copy',
                    'Card_BatchUpdate','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve','Card_UnApprove',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print','Card_SaveAdd','Card_Enable','Card_Disable','Card_ApplyQuery','More','Card_Supplier_Template'],false);
            this.props.button.setButtonVisible(['Card_Save','Card_Cancel'],true);
            break;
        case 'add_cancel':
            this.props.button.setButtonVisible(
                ['Card_Save','Card_Cancel','Card_Refresh','Card_Edit','Card_Delete','Card_Copy',
                    'Card_BatchUpdate','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print','Card_SaveAdd','Card_Enable','Card_ApplyQuery','More','Card_Supplier_Template'],false);
            // let formData = this.props.form.getAllFormValue(this.state.card.form.formId);
            // this.props.button.setButtonVisible(['Card_Disable','Card_UnApprove'],!!formData.rows[0].values['pk_supplier'].value);
            this.props.button.setButtonVisible(['Card_Add'],true);
            break;
        case 'edit_cancel':
            this.props.button.setButtonVisible(
                ['Card_Add','Card_Edit','Card_Refresh','Card_Delete','Card_Copy',
                    'Card_BatchUpdate','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve','Card_UnApprove',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Print','Card_Enable','Card_Disable','Card_ApplyQuery','More'],true);
            this.props.button.setButtonVisible(['Card_Save','Card_Cancel','Card_SaveAdd','Card_Supplier_Template'],false);
            break;
        default:
            this.props.button.setButtonVisible(
                ['Card_Add','Card_Edit','Card_Delete','Card_Copy',
                    'Card_BatchUpdate','Card_Refresh','Card_Assign',
                    'Card_BankAccount','Card_AddressBook','Card_Approve','Card_UnApprove',
                    'Card_Freeze','Card_AssistFun','Card_Associate',
                    'Card_OrgBrowse','Card_BrowseOrgDoc','Card_Enable','Card_Disable','Card_Print','Card_ApplyQuery','More'],true);
            this.props.button.setButtonVisible(['Card_Save','Card_SaveAdd','Card_Cancel','Card_Supplier_Template'],false);
            break;
    }
    this.props.button.setButtonVisible(['AddLine'],(status == 'add' || status == 'edit'));
    setFinanceOrStockTableButtonStatus.call(this,(status == 'add' || status == 'edit')?'edit':'browse');
    debugger
    /**
     * 设置卡片核准 停启用按钮的状态
     */
    if(this.state.status!='add' && this.state.status != 'edit' && !isDelete && this.state.selectedRecords && this.state.selectedRecords[0]){
        let record = this.state.selectedRecords[0];
        if(this.state.selectedRecords[0].hasOwnProperty('data')){
            record = this.state.selectedRecords[0].data.values;
        }else if(this.state.selectedRecords[0].hasOwnProperty('values')){
            record = this.state.selectedRecords[0].values;
        }
        let supstate = record['supstate'].value;
        let enablestate =record['enablestate'].value;
        let pk_supplier_pf = record['pk_supplier_pf'].value;
        let iscustomer = record['iscustomer'].value;
        this.displayApproveButtons(supstate == '1');
        this.displayEnablestate(enablestate =='2');
        let hasAuth = hasOperateAuth.call(this,this.state.selectedRecords);
        this.props.button.setButtonVisible({
            Card_ApplyQuery:!!pk_supplier_pf
        })
        this.props.button.setButtonDisabled({
            Card_ApplyQuery:!pk_supplier_pf,
            Card_CreateCust:(iscustomer || iscustomer == 'Y' || iscustomer=='true'),
            Card_BankAccount:!hasAuth,
            Card_AddressBook:!hasAuth
        });
    }
}

const setFinanceOrStockTableButtonStatus = function(status){
    let financeRows = this.props.cardTable.getAllRows('finance');
    let purchaseRows = this.props.cardTable.getAllRows('purchase');
    debugger
    this.props.button.setButtonVisible([
        'Finance_Table_Edit',
        'Finance_Table_Delete',
        'Finance_Table_PayFreeze',
        'Finance_Table_PayUnFreeze',
        'Finance_Table_TicketFreeze',
        'Finance_Table_TicketUnFreeze',
        'Finance_Table_Refresh',
        'Finance_Table_Print',
        'Finance_Table_Output',
        'Stock_Table_Edit',
        'Stock_Table_Delete',
        'Stock_Table_Delete',
        'Stock_Table_OrderFreeze',
        'Stock_Table_OrderUnFreeze',
        'Stock_Table_Refresh',
        'Stock_Table_Print',
        'Stock_Table_Output'],status == 'browse');
    this.props.button.setButtonDisabled({
        Finance_Table_Delete:status == 'browse',
        Finance_Table_PayFreeze:status == 'browse',
        Finance_Table_PayUnFreeze:status == 'browse',
        Finance_Table_TicketFreeze:status == 'browse',
        Finance_Table_TicketUnFreeze:status == 'browse',
        Finance_Table_Refresh:false,
        Finance_Table_Print:!(financeRows && financeRows.length>0),
        Finance_Table_Output:!(financeRows && financeRows.length>0),
        
        Stock_Table_Delete:status == 'browse',
        Stock_Table_OrderFreeze:status == 'browse',
        Stock_Table_OrderUnFreeze:status == 'browse',
        Stock_Table_Refresh:false,
        Stock_Table_Print:!(purchaseRows && purchaseRows.length>0),
        Stock_Table_Output:!(purchaseRows && purchaseRows.length>0)
    })
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
    if(!!items){
        for(let [key,value] of Object.entries(items)){
            formItemMap.get(key).disabled = value;
        }
    }
}
/**
 * 获得卡片真是的状态值
 * @param status
 * @returns {*}
 */
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

//hrMuyooTvB46e0UT49DewOS85QErb1Eze64LCpYl8BJPzUkc+5zPpTnnfZ6v5VzZTB9BE6jYlBtd
//8Quzvwi1WQ==