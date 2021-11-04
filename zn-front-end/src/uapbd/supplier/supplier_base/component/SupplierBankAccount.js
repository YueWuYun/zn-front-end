//dzeyCQYrXt70gDlzOdlFvC18+Wi6m+LRVv0mtYgRmV4WUAP+3uiQLN0WZDye4vv/PRLJenWOPHyT
//ktsJtBZgvQ==
import React,{Component} from 'react';
import {base,ajax,toast,promptBox,high,excelImportconfig} from 'nc-lightapp-front';
import './Common.less';
const {NCScrollElement,NCCheckbox,NCBackBtn} = base;
import Table from '../../../public/excomponents/Table';
const {ExcelImport}=high;
import {multiLevelManage,resizeForm,showFormulaSetting, validateFormulaSetting,filterEmptyData} from "../utils/SupplierUtils";
/****************************
 * liupzhc
 * 供应商银行账户 弹出页面
 ****************************/
const EMPTY_FUNC = ()=>{};//占位方法
const urls = {
    querySupBankaccUrl:'/nccloud/uapbd/supplier/querySupBankacc.do',
    querySupBankInfoUrl:'/nccloud/uapbd/supplier/querySupBankInfo.do',
    delSupBankAccUrl:'/nccloud/uapbd/supplier/delSupBankAcc.do',
    saveSupBankAccUrl:'/nccloud/uapbd/supplier/saveSupBankAcc.do',
    enableSupBankAccUrl:'/nccloud/uapbd/supplier/enablestateSupBankAcc.do',
    setBankSubDefault:'/nccloud/uapbd/supplier/setBankSubDefault.do',
    beforeSupbankaccEditUrl:'/nccloud/uapbd/supplier/beforeSupbankaccEditUrl.do'
};

export default class SupplierBankAccount extends Component{
    constructor(props){
        super(props);
        /**
         * 添加银行账户子户按钮
         * @returns {*}
         */
        const addSupBankSubButton = ()=>{
            let { createButtonApp} = this.props.button;
            return ( <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area:'custsupbankaccsub',
                        buttonLimit: 3,
                        onButtonClick: this.onSupBankAccSubButtonClick.bind(this),
                    })}
                </div>
            </div>);
        }
        //导入导出设置
        let supbaexcelimportconfig = excelImportconfig(props,'uapbd',this.props.supbabillType,true,'',{'appcode':this.props.appcode , 'pagecode':this.props.pagecode},()=>{
            this.setState({selectedRecord:{}},()=>{this.onLoadSupBankAccTableData(false);});
        });
        props.button.setUploadConfig("SupBankAcc_Import",supbaexcelimportconfig);
        /**
         * 设置银行账户子户操作列
         * @param meta
         */
        const setSupBankAccSubOperateField = (meta)=>{
            this.state.card.table.field &&
            meta && meta.hasOwnProperty('items') &&
            !meta.items.find((item)=>item.attrcode=='opr') &&
            meta.items.push(this.state.card.table.field);
        }
        this.state = {
            pk_supplier:this.props.pk_supplier || null,
            ...this.props,
            direct:false,
            showCard:false,
            cardStatus:'browse',
            supprop : '1',  //供应商类型  0=外部单位，1=内部单位  用于控制界面 新增 修改 停启用 按钮的显示
            showoff: {
                checked: undefined,
                disabled: false,
                onChange: (val) => {
                    this.state.showoff.checked = val;
                    this.setState(this.state, () => {
                        this.onLoadSupBankAccTableData();
                    });
                },
                name: this.props.Lang['10140SUG-000114']
            },
            buttonApps:{
                area:'custsupbankacc_table',
                buttonLimit: 3,
                onButtonClick: this.onSupBankAccTableBtnClick.bind(this),
            },
            custbankunions:{},
            custsupbankacc:{
                data:[],
                columns: this.props.meta.getMeta()['custsupbankacc'].items.filter(item=>item.visible) || undefined,//供应商银行账户元数据
                onRowDoubleClick:this.onRowDoubleClick,
                onRowClick:this.onRowClick,
                liAttr:{fieldid:"supbank_table"},
                // rowClassName:this.rowClassName,
                listeners:{
                    onRowDoubleClick:this.onRowDoubleClick,
                    onRowClick:this.onRowClick
                }
            },
            selectedRecord:{},//选中的行
            card:{
                buttonApps:{
                    area:'custsupbankacc_card',
                    buttonLimit: 3,
                    onButtonClick: this.onSupBankAccCardBtnClick.bind(this),
                },
                form:{
                    cardsupbankacc:{
                        formId:'cardsupbankacc',
                        formName:this.props.Lang['10140SUG-000115'],
                        action:{
                            onAfterEvent:this.onAfterEditFormEvent
                        }
                    },
                    accbasinfo:{
                        formId:'accbasinfo',
                        formName:this.props.Lang['10140SUG-000116'],
                        action:{
                            onAfterEvent:this.onAfterEditFormEvent
                        }
                    },
                    netbankinfo:{
                        formId:'netbankinfo',
                        formName:this.props.Lang['10140SUG-000117'],
                        action:{
                            onAfterEvent:this.onAfterEditFormEvent
                        }
                    }
                },
                table:{
                    tableId:'bankaccsub',
                    tableName:this.props.Lang['10140SUG-000118'],
                    action:{
                        tableHead: addSupBankSubButton.bind(this) || EMPTY_FUNC,
                        modelSave:  EMPTY_FUNC,
                        hideSwitch:()=>{return false},
                        showIndex:true,
                        showCheck:true,
                        onSelected:this.onBankaccSubTableSelected,
                        onSelectedAll:this.onBankaccSubTableSelectedAll
                    },
                    field:{
                        attrcode: 'opr',
                        label: this.props.Lang['10140SUG-000035'],
                        visible: true,
                        className:'table-opr',
                        width:200,
                        itemtype:'customer',
                        fixed:'right',
                        render: (text, record, index) => {
                            return (
                                <span fieldid="opr" >
                                    {(this.state.cardStatus=='browse' && !record.values['isdefault'].value) && 
                                            <span
                                                className="row-edit-option"
                                                onClick={()=>{this.setBankSubDefault(text,record,index)}}>
                                                {this.props.Lang['10140SUG-000189']}
                                            </span>
                                    }
                                </span>
                            )
                        }
                    }
                }
            }
            
        };
        setTimeout(()=>{
            setSupBankAccSubOperateField(this.props.meta.getMeta()['bankaccsub']);
        },100);
        
    }
    /**
     * 加载供应商银行账户列表信息
     */
    onLoadSupBankAccTableData = (isRefresh)=>{
        ajax({
            url:urls.querySupBankaccUrl,
            data:{pk_supplier:this.state.pk_supplier,showOff:this.state.showoff.checked},
            success:(res)=>{
                if(res.success ){
                    this.state.custsupbankacc.data=[];

                    //供应商类型    0=外部单位，1=内部单位  用于控制界面新增按钮  xuewenc
                    this.state.supprop = res.data.supprop;
                    res.data = res.data.dat;
                    
                    showFormulaSetting.call(this,{'custsupbankacc':'simpleTable'})
                    this.state.custsupbankacc.data= res.data || [];
                    this.BankAccTable.loadData(res.data ||[]);
                    isRefresh && toast({title:this.props.Lang['10140SUG-000200'],color:'success'});
                    
                    this.setState(this.state,()=>{
                        this.setSupBankAccTableButtonStatus();
                    });
                }
            }
        })
    }
    /**
     * 供应商银行账户卡片子表（银行账户子户）操作列点击事件
     */
    onSupBankAccSubOperatDeleteEvent = (text,record,index)=>{
        let status = this.props.form.getFormStatus('accbasinfo');
        if(status !='browse'){
            this.props.cardTable.delRowsByIndex(this.state.card.table.tableId,index);
        }
    }
    setBankSubDefault = (text,record,index)=>{
        let status = this.props.form.getFormStatus('accbasinfo');
        if(status!='browse'){
            return;
        }
        let formData = this.props.form.getAllFormValue(this.state.card.form.cardsupbankacc.formId);
        if(!formData.rows[0].values['pk_custbank'].value || !formData.rows[0].values['pk_bankaccbas'].value || !record.values['pk_bankaccsub'].value){
            return;
        }
        promptBox({
            title:this.props.Lang['10140SUG-000077'],
            content:this.props.Lang['10140SUG-000190'],
            beSureBtnClick:function(){
                let subTableData = this.props.cardTable.getAllData(this.state.card.table.tableId);
                
                let formData = this.props.form.getAllFormValue(this.state.card.form.cardsupbankacc.formId);
                debugger
                let requestParam = {
                    pk_custbank:formData.rows[0].values['pk_custbank'].value,
                    pk_bankaccbas:formData.rows[0].values['pk_bankaccbas'].value,
                    pk_supplier:formData.rows[0].values['pk_cust'].value,
                    pk_bankaccsub:record.values['pk_bankaccsub'].value,
                    nodeType:this.props.nodeType,
                    pk_curOrg:this.props.envParam.pk_org
                }
                ajax({
                    url:urls.setBankSubDefault,
                    data:requestParam,
                    success:(res)=>{
                        let {success,data} = res;
                        if(success){
                            this.props.cardTable.setTableData('bankaccsub',{rows:data["bankaccsub"].rows});
                        }
                    }
                })
            }.bind(this)
        });

    }

    onBankaccSubTableSelectedAll = (props, moduleId, status, length)=>{
        
        let checkedRows = this.props.cardTable.getCheckedRows(moduleId);
        this.props.button.setButtonDisabled(['Card_SupBankAccSub_DelLine'],checkedRows.length == 0);
    }
    onBankaccSubTableSelected = (props, moduleId, record, index, status)=>{
        let checkedRows = this.props.cardTable.getCheckedRows(moduleId);
        this.props.button.setButtonDisabled(['Card_SupBankAccSub_DelLine'],!checkedRows || checkedRows.length == 0);
    }
    /**
     * 供应商银行账户子户按钮点击事件
     * 新增子户记录
     * @param props
     * @param id
     */
    onSupBankAccSubButtonClick = (props,id)=>{
        switch(id){
            case 'Card_SupBankAccSub_AddLine':
                this.props.cardTable.addRow(this.state.card.table.tableId);
                this.props.cardTable.setStatus(this.state.card.table.tableId,'edit');
                break;
            case 'Card_SupBankAccSub_DelLine':
                this.onDelSupBankAccSub(this.onBankaccSubTableSelected);
                break;


        }
        
    }
    onDelSupBankAccSub = (callback)=>{
        let checkedRows = this.props.cardTable.getCheckedRows(this.state.card.table.tableId);
            setTimeout(()=>{
                checkedRows.forEach(row=>{
                    row.status = 2;
                    this.props.cardTable.delRowByRowId(this.state.card.table.tableId,row.data.rowid);
                })
                callback && callback(this.props,this.state.card.table.tableId);
            },10);
            
    }
    /**
     * 设置供应商银行账户主列表的columns
     *  在初始化供应商主页面时使用
     * @param meta
     * @param callback
     */
    setSupBankAccTableColumn = (meta,callback)=>{
        this.state.custsupbankacc.columns = meta;
        this.setState(this.state,()=>{
            callback && callback();
        })
    }
    /**
     * 设置showCard 在关闭弹出窗时，需要把状态设置为false
     * @param flag
     */
    setCardStatus = (flag)=>{
        debugger
        this.state.custsupbankacc.data = [];
        this.setState({
            showCard:flag,
            pk_supplier:null,
            cardStatus:'browse',
            selectedRecord:{}
        })
    }
    /**
     * 供应商银行账户列表按钮事件
     * @param props
     * @param id
     */
    onSupBankAccTableBtnClick = (props,id)=>{
        if(id!='SupBankAcc_Refresh'){
            if(!multiLevelManage.call(this,this.props.selectedRecords,id)){
                return;
            }
        }
        switch(id){
            case 'SupBankAcc_Add':
                let requestParam = {pk_supplier:this.state.pk_supplier};
                this.onEditSupBankAcc('add',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableAddClickCallBack,requestParam);
                break;
            case 'SupBankAcc_Edit':
                this.beforeEditCheckDataPermission().then((success)=>{
                    this.onEditSupBankAcc('edit',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableEditClickCallBack);
                })
                break;
            case 'SupBankAcc_Delete':
                this.onSupBankAccDelete(this.deleteSupBankAcc)({
                    requestConfig: {
                        pk_custbank: this.state.selectedRecord.getData()['pk_custbank'],
                        pk_bankaccbas: this.state.selectedRecord.getData()['pk_bankaccbas']
                    },
                    event: this.onLoadSupBankAccTableData
                });
                break;
            case 'SupBankAcc_Refresh':
                this.setState({selectedRecord:{}},()=>{this.onLoadSupBankAccTableData(true);});
                break;
            case 'SupBankAcc_Enable':
            case 'SupBankAcc_Disable':
                this.onEnableBankacc(this.enableSupBankAcc)(true,id=='SupBankAcc_Enable')
                break;
            case 'SupBankAcc_Export':
                this.setState({

                },()=>{
                    this.props.modal.show('supplierbankExcel');
                });
                break;
        }
    }


    beforeEditCheckDataPermission = ()=>{
        let pk_custbank,pk_bankaccbas;
        if(this.state.selectedRecord.hasOwnProperty('getData')){
            let record = this.state.selectedRecord.getData();
            pk_custbank = record['pk_custbank'];
            pk_bankaccbas = record['pk_bankaccbas'];
        }else{
            pk_custbank = this.state.selectedRecord['pk_custbank'];
            pk_bankaccbas = this.state.selectedRecord['pk_bankaccbas'];
        }
        return new Promise(resolve=>{
            ajax({
                url:urls.beforeSupbankaccEditUrl,
                data:{
                    pk_supplier:this.state.pk_supplier,
                    pk_custbank:pk_custbank,
                    pk_bankaccbas:pk_bankaccbas,
                    nodeType:this.props.nodeType,
                    pk_curOrg:this.props.envParam.pk_org
                },
                success:(res)=>{
                    resolve(res.success)
                }
            })
        })
    }
    /**
     * 供应商银行账户卡片按钮事件
     * @param props
     * @param id
     */
    onSupBankAccCardBtnClick = (props,id)=>{
        switch(id){
            case 'Card_SupBankAcc_Add':
                let requestParam = {pk_supplier:this.state.pk_supplier};
                this.props.form.EmptyAllFormValue('accbasinfo')
                this.props.form.EmptyAllFormValue('cardsupbankacc');
                this.onQuerySupBankAcc('add',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableAddClickCallBack,requestParam);
                break;
            case 'Card_SupBankAcc_Edit':
            this.beforeEditCheckDataPermission().then((success)=>{
                this.setState({cardStatus:'edit'},()=>{
                    this.setSupBankAccCardStatus('edit');
                    this.setSupBankAccCardButtonStatus('edit');
                })
            });
                break;
            case 'Card_SupBankAcc_Return':
                this.setState({showCard:false,cardStatus:'browse'},()=>{this.onLoadSupBankAccTableData();})
                break;
            case 'Card_SupBankAcc_Save':
                this.onSupBankAccSaveClick();
                break;
            case 'Card_SupBankAcc_Delete':
                let formData = this.props.form.getAllFormValue('accbasinfo');
                this.onSupBankAccDelete(this.deleteSupBankAcc)({
                    requestConfig: {
                        pk_bankaccbas:formData.rows[0].values['pk_bankaccbas'].value
                    },
                    event: ()=>{
                        let records = this.BankAccTable.getRecords();
                        debugger
                        let param = {pk_supplier:this.state.pk_supplier},newRecords = new Array();
                        if(records && records.length>0){
                            records.forEach(record=>{
                                if(record.getData()['pk_bankaccbas']!=formData.rows[0].values['pk_bankaccbas'].value){
                                    newRecords.push(record);
                                }
                            })
                            param.pk_custbank = (newRecords && newRecords.length>0) ? newRecords[0].getData()['pk_custbank']:null;
                            param.pk_bankaccbas = (newRecords && newRecords.length>0) ? newRecords[0].getData()['pk_bankaccbas']:null;
                        }
                        this.setState({selectedRecord:newRecords[0]},()=>{
                            this.onQuerySupBankAcc(
                                'browse',
                                this.setSupBankAccCardStatus,
                                this.setSupBankAccCardButtonStatus,
                                this.onSupBankAccTableAddClickCallBack,
                                param
                            );
                        })
                    }
                });
                break;
            case 'Card_SupBankAcc_SaveAdd':
                let config = {
                    status:'add',
                    setSupBankAccCardStatus:this.setSupBankAccCardStatus,
                    setSupBankAccCardButtonStatus:this.setSupBankAccCardButtonStatus,
                    onSupBankAccTableAddClickCallBack:this.onSupBankAccTableAddClickCallBack,
                    param:{pk_supplier:this.state.pk_supplier}
                }
                this.onSupBankAccSaveClick(config);
                break;
            case 'Card_SupBankAcc_Cancel':
                promptBox({
                    color:'warning',
                    title:this.props.Lang['10140SUG-000067'],
                    content:this.props.Lang['10140SUG-000068'],
                    beSureBtnClick:function(){
                        this.onQuerySupBankAcc('browse',
                            this.setSupBankAccCardStatus,
                            this.setSupBankAccCardButtonStatus,
                            this.onSupBankAccTableAddClickCallBack);
                    }.bind(this)
                });
                break;
            case 'Card_SupBankAcc_Enable':
            case 'Card_SupBankAcc_Disable':
                this.onEnableBankacc(this.enableSupBankAcc)(false,id=='Card_SupBankAcc_Enable')
                break;
            case 'Card_SupBankAcc_Refresh':
                this.loadAndSetSupBankaccCardData(this.state.selectedRecord,true);
                break;
        }
    }
    /**
     * 银行账户 新增后回调事件
     * @param data
     */
    onSupBankAccTableAddClickCallBack = (data)=>{
        this.props.form.setAllFormValue({cardsupbankacc:filterEmptyData(data['cardsupbankacc']['cardsupbankacc'].rows[0].values,this.state.cardStatus)});
        this.props.form.setAllFormValue({accbasinfo:filterEmptyData(data['accbasinfo']['accbasinfo'].rows[0].values,this.state.cardStatus)});
        this.props.cardTable.setTableData('bankaccsub',{rows:data["bankaccsub"]["bankaccsub"].rows});
    }
    /**
     * 银行账户 编辑后回调事件
     * @param data
     */
    onSupBankAccTableEditClickCallBack = (data)=>{
        Object.keys(this.state.card.form).forEach(formId=>{
            if(formId!='netbankinfo'){
                this.props.form.setAllFormValue({[formId]:data[formId][formId]});
            }
        });
        let subTableId = this.state.card.table.tableId;
        this.props.cardTable.setTableData(subTableId,data[subTableId][subTableId]);
    }
    /**
     * 银行账户添加或修改
     * @param isAdd true:新增 false 修改
     * @param setSupBankAccCardStatus 设置银行账户卡片状态回调事件
     * @param callback 设置卡片数据回调事件
     */
    onEditSupBankAcc = (isAdd,setSupBankAccCardStatus,setSupBankAccCardButtonStatus,setCardData,requestParam)=>{
        let record = this.BankAccTable.getSelectRecord();
        if(isAdd=='edit' && !record){
            toast({content:this.props.Lang['10140SUG-000090'],color:'warning'});
            return;
        }
        setSupBankAccCardButtonStatus && setSupBankAccCardButtonStatus(isAdd);
        this.setState({showCard:true,cardStatus:isAdd},()=>{
            resizeForm.call(this,'accbasinfo');
            resizeForm.call(this,'cardsupbankacc');
            this.props.form.EmptyAllFormValue('accbasinfo')
            this.props.form.EmptyAllFormValue('cardsupbankacc');
            this.onQuerySupBankAcc(isAdd,setSupBankAccCardStatus,setSupBankAccCardButtonStatus,setCardData,requestParam);
        });
    }
    /**
     * 查询银行账户卡片数据
     * @param flag
     * @param setSupBankAccCardStatus
     * @param setSupBankAccCardButtonStatus
     * @param callback
     */
    onQuerySupBankAcc = (flag,setSupBankAccCardStatus,setSupBankAccCardButtonStatus,setCardData,requestParam)=>{
        debugger
        let pk_custbank,pk_bankaccbas;
        if(flag!='add'){
            if(this.state.selectedRecord){
                pk_custbank = this.state.selectedRecord.hasOwnProperty("getData")?this.state.selectedRecord.getData()['pk_custbank']:this.state.selectedRecord['pk_custbank'];
                pk_bankaccbas = this.state.selectedRecord.hasOwnProperty("getData")?this.state.selectedRecord.getData()['pk_bankaccbas']:this.state.selectedRecord['pk_bankaccbas'];
            }else if(this.state.custsupbankacc.data && this.state.custsupbankacc.data.length>0){
                let firstRecord = this.state.custsupbankacc.data[0];
                pk_custbank = firstRecord['pk_custbank'];
                pk_bankaccbas = firstRecord['pk_bankaccbas'];
            }
        }
        setSupBankAccCardButtonStatus && setSupBankAccCardButtonStatus(flag);
        ajax({
            url:urls.querySupBankInfoUrl,
            data:requestParam?Object.assign(requestParam,{nodeType:this.props.nodeType,pk_curOrg:this.props.envParam.pk_org}):
                {
                    pk_supplier:this.state.pk_supplier,
                    pk_custbank:pk_custbank,
                    pk_bankaccbas:pk_bankaccbas,
                    nodeType:this.props.nodeType,
                    pk_curOrg:this.props.envParam.pk_org
                },
            success:(res)=>{
                if(res.success){
                    //显示公式设置
                    showFormulaSetting.call(this,res,{
                        [this.state.card.form.cardsupbankacc.formId]:'form',
                        [this.state.card.form.accbasinfo.formId]:'form',
                        [this.state.card.form.netbankinfo.formId]:'form',
                        [this.state.card.table.tableId]:'cardTable'
                    })
                    this.setState({direct:res.data.direct,cardStatus:flag},()=>{
                        this.props.meta.getMeta()['accbasinfo'].items.find(item=>{
                            if(item.attrcode=='pk_bankdoc' || item.attrcode.endsWith('pk_bankdoc')){
                                item.checkStrictly = !res.data.direct;
                            }
                        })
                        //设置卡片数据
                        setCardData && setCardData(res.data);
                        //设置卡片状态
                        setSupBankAccCardStatus && setSupBankAccCardStatus(flag);
                        //设置按钮状态
                        setSupBankAccCardButtonStatus && setSupBankAccCardButtonStatus(flag,requestParam?!requestParam.pk_bankaccbas:!pk_bankaccbas);
                        let enablestate = res.data[this.state.card.form.accbasinfo.formId][this.state.card.form.accbasinfo.formId].rows[0].values['enablestate'].value;
                        // this.setEnableStateStatus(enablestate == '2');
                        flag == 'browse' && this.setEnableStateVisible(enablestate == '2')
                    });
                }
            }
        });

    }
    /**
     * 删除
     * @param callback
     * @returns {Function}
     */
    deleteSupBankAcc = (param)=>{
        promptBox({
            color:'warning',
            title:this.props.Lang['10140SUG-000071'],
            content:this.props.Lang['10140SUG-000072'],
            beSureBtnClick: ()=>{
                ajax({
                    url:urls.delSupBankAccUrl,
                    data:param.requestConfig,
                    success:(res)=>{
                        if(res.success){
                            param.event();
                            toast({title:this.props.Lang['10140SUG-000073'],color:'success'});/* 国际化处理： 删除成功！*/
                        }
                    }
                });
            }
        });
    }
    /**
     * 删除时执行
     * @param callback
     * @returns {Function}
     */
    onSupBankAccDelete = (callback)=>{
        return (param)=>{

            callback(param);
        }
    }


    /**
     * 设置银行账户卡片的状态
     * @param status:browse/edit
     */
    setSupBankAccCardStatus = (status)=>{
        Object.values(this.state.card.form).forEach(item=>{
            // if(item.formId!='netbankinfo'){
                this.props.form.setFormStatus(item.formId,status);
            // }
        });
        this.props.cardTable.setStatus(this.state.card.table.tableId,status);
    }
    /**
     * 保存供应商银行账户卡片数据
     */
    onSupBankAccSaveClick = (addParam)=>{
        if(!this.props.form.isCheckNow('accbasinfo')){
            return;
        }
        //迭代获得表单数据
        let formDataArr = Object.keys(this.state.card.form).map(formId=>{
            let formData = this.props.form.getAllFormValue(formId);
            formData.areacode = formId;
            return formData;
        });
        //去除空行
        this.props.cardTable.filterEmptyRows(this.state.card.table.tableId,['isdefault']);
        //获得卡片子表数据
        let cardTableData = this.props.cardTable.getAllData(this.state.card.table.tableId);
        
        let CardData = this.props.createMasterChildData(this.props.pagecode, 'accbasinfo', this.state.card.table.tableId);
        // CardData.pageid = this.props.pagecode;
        validateFormulaSetting.call(this,CardData,()=>{
            //拼接参数数据格式
            let config = {
                custBankInfo:{
                    pageid:this.state.pagecode,
                    model:formDataArr[0]
                },
                accBasInfo:{
                   pageid:this.state.pagecode,
                   model:formDataArr[1]
                },
                accBasSub:{
                    pageid:this.state.pagecode,
                    model:{
                        pageinfo:{},
                        areacode:this.state.card.table.tableId,
                        rows:cardTableData?cardTableData.rows:[]
                    }
                },
                isDirect:this.state.direct,
            };
            ajax({
                url:urls.saveSupBankAccUrl,
                data:config,
                success:(res)=>{
                    if(res.success){
                        this.setState({selectedRecord:{pk_cust:res.data['pk_supplier'],pk_custbank:res.data['pk_custbank'],pk_bankaccbas:res.data['pk_bankaccbas']}},()=>{
                            //有新增参数就保存后新增，没新增参数就恢复浏览态
                            addParam ?this.onQuerySupBankAcc(addParam.status,this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableEditClickCallBack,addParam.param):
                                this.onQuerySupBankAcc('browse',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableEditClickCallBack);
                            toast({title:this.props.Lang['10140SUG-000069'],color:'success'});
                        })
                    }
                }
            })

        },{'accbasinfo':'form',[this.state.card.table.tableId]:'cardTable'},'card');

    }
    onEnableBankacc = (callback)=>{
        return (inRecord,flag)=>{
            promptBox({
                color:'warning',
                title:flag?this.props.Lang['10140SUG-000121']:this.props.Lang['10140SUG-000122'],/* 国际化处理： 确认启用,确认停用*/
                content:flag?this.props.Lang['10140SUG-000123']:this.props.Lang['10140SUG-000124'],/* 国际化处理： 是否确认要启用?,是否确认要停用?*/
                beSureBtnClick: ()=>{
                    callback && callback(inRecord,flag);
                }
            });
        }
    }
    /***
     * 银行账户停启用
     * @param flag
     * @param param
     */
    enableSupBankAcc = (inRecord,flag)=>{
        let record,data = {};
        if(inRecord){
            record = this.BankAccTable.getSelectRecord();
            if(!record || !record.getData()){
                toast({content:this.props.Lang['10140SUG-000125'],color:'warning'});/* 国际化处理： 请选中一条数据！*/
                return;
            }
            data = record.getData();
        }else{
            let formData = this.props.form.getAllFormValue('cardsupbankacc');
            let formData1 = this.props.form.getAllFormValue('accbasinfo');
            data['pk_custbank'] = formData.rows[0].values['pk_custbank'].value;
            data['pk_bankaccbas'] = formData.rows[0].values['pk_bankaccbas'].value;
            data['enablestate'] = formData1.rows[0].values['enablestate'].value;
        }
        if(flag){
            if(data['enablestate']=='2') {
                toast({content:this.props.Lang['10140SUG-000126'],color:'warning'});/* 国际化处理： 已启用，不能重复启用！*/
                return;
            }
        }else{
            if(data['enablestate']!='2') {
                toast({content:this.props.Lang['10140SUG-000127'],color:'warning'});/* 国际化处理： 已停用，不能重复停用！*/
                return;
            }
        }

        ajax({
            url:urls.enableSupBankAccUrl,
            data:{
                pk_supplier:this.state.pk_supplier,
                pk_custbank:data['pk_custbank'],
                pk_bankaccbas:data['pk_bankaccbas'],
                pk_cust:this.state.pk_supplier,
                enable:flag,
            },
            success:(res)=>{
                this.setState({selectedRecord: inRecord?null:this.state.selectedRecord},()=>{
                    this.setEnableStateStatus(flag);
                    this.setEnableStateVisible(flag);
                    res.success?toast({title:flag?this.props.Lang['10140SUG-000128']:this.props.Lang['10140SUG-000129'],color:'success'}):null;/* 国际化处理： 启用成功！,停用成功！*/
                    if(inRecord){
                        this.onLoadSupBankAccTableData(false);
                    }else{
                        this.loadAndSetSupBankaccCardData(this.state.selectedRecord,false);
                    }
                });
            }
        })
    }
    /**
     * 控制按钮状态
     */
    setSupBankAccTableButtonStatus = ()=>{
        this.props.button.setButtonsVisible(['SupBankAcc_Add','SupBankAcc_Edit','SupBankAcc_Delete','SupBankAcc_Refresh','SupBankAcc_Enable','SupBankAcc_Import'],true);
        this.setButtonDisabledStatus(true,true);
    }

    setButtonDisabledStatus = (status,flag)=>{
        let supprop = this.state.supprop;
        if(supprop=='1'){
            this.props.button.setButtonDisabled(['SupBankAcc_Add','SupBankAcc_Edit','SupBankAcc_Delete','SupBankAcc_Enable','SupBankAcc_Disable',
            'Card_SupBankAccSub_DelLine','Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Enable','SupBankAcc_Disable'],true);
        }else{
            this.props.button.setButtonDisabled(['SupBankAcc_Add','SupBankAcc_Edit','SupBankAcc_Delete'],false);
            flag && this.props.button.setButtonDisabled(['SupBankAcc_Enable','Card_SupBankAcc_Enable','SupBankAcc_Disable','Card_SupBankAcc_Disable'],true);
        }
        this.setState(this.state);
    }
    /**
     * 设置供应商银行账户卡片按钮状态
     *
     * @param status
     */
    setSupBankAccCardButtonStatus = (status,disabled,formData)=>{
        switch(status){
            case 'add':
            this.props.button.setButtonsVisible(['Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Delete','Card_SupBankAcc_Refresh','Card_SupBankAcc_Return','Card_SupBankAcc_Enable'],false);
            this.props.button.setButtonsVisible(['Card_SupBankAcc_Save','Card_SupBankAcc_SaveAdd','Card_SupBankAcc_Cancel'],true);
            break;
            case 'edit':
            this.props.button.setButtonsVisible(['Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Delete','Card_SupBankAcc_Refresh','Card_SupBankAcc_SaveAdd','Card_SupBankAcc_Return','Card_SupBankAcc_Enable'],false);
            this.props.button.setButtonsVisible(['Card_SupBankAcc_Save','Card_SupBankAcc_Cancel'],true);
            break;
            case 'add_browse':
            break;
            default:
            
            this.props.button.setButtonsVisible(['Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Delete','Card_SupBankAcc_Return','Card_SupBankAcc_Refresh','Card_SupBankAcc_Enable'],true);
            this.props.button.setButtonsVisible(['Card_SupBankAcc_Save','Card_SupBankAcc_SaveAdd','Card_SupBankAcc_Cancel'],false);
            //根据卡片浏览态是否有数据决定是否禁用按钮
            this.props.button.setButtonDisabled(['Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Delete'],disabled);
            this.props.button.setButtonDisabled(['Card_SupBankAcc_Enable','Card_SupBankAcc_Disable'],false);
            break;
        }
        this.props.button.setButtonsVisible(['Card_SupBankAccSub_AddLine','Card_SupBankAccSub_DelLine'],status =='add' ||  status =='edit');
        this.props.button.setButtonDisabled(['Card_SupBankAccSub_DelLine'],true);
        // this.props.button.setButtonDisabled(['Card_SupBankAccSub_AddLine','Card_SupBankAccSub_DelLine'],status !='add' &&  status !='edit');
        
        let supprop = this.state.supprop;
        if(supprop=='1'){
            this.props.button.setButtonDisabled(['Card_SupBankAccSub_DelLine','Card_SupBankAcc_Delete','Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Enable','SupBankAcc_Disable'],true);
        }
    }

    
    /**
     * 表单编辑后事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     * @param formId
     */
    onAfterEditFormEvent =(props, moduleId,key,value,oldValue)=>{
        let me = this;
        switch(key){
            case 'pk_bankdoc':
                value.value?
                ajax({
                    url:'/nccloud/uapbd/bankacc/formafteredit.do',
                    data:{
                        value:value.value,
                        key:key,
                        arreacode:moduleId,
                        pagecode:this.props.pagecode
                    },
                    success:(res)=>{
                        let{success,data} =res;
                        if(success&&data){
                                let bankaccref = {
                                    refName: me.props.Lang['10140SUG-000213'],//'IBAN生成'
                                    itemtype: data.UserJson == 'Y' ? 'refer' : 'input',
                                    refcode: 'uapbd/refer/customer/RefBankAccountComp/index',
                                    ibanFormId: 'generateIban',
                                    form: me.props.form,
                                    pagecode: me.props.pagecode,
                                    json: me.props.Lang,
                                    onAfterSave: me.writebackIbanCode,
                                    queryCondition:{
                                        pk_bankdoc:data.form[moduleId].rows[0].values.pk_bankdoc.value,
                                        actionName:'loadBankDoc'
                                    },
                                    reg:data.UserJson != 'Y' ?new RegExp('^[[a-zA-Z0-9\-]*$'):null,
                                    errorMessage:data.UserJson != 'Y' ?me.props.Lang['10140SUG-000181']:null,/* 国际化处理： 只能输入数字和字母-！*/
                                }
                                let accnameitem = me.props.meta.getMeta()[moduleId]['items'].find(item => item.attrcode == 'accnum');
                                Object.assign(accnameitem, bankaccref);
                                me.props.meta.setMeta(me.props.meta.getMeta(), () => {
                                    me.setAccBaseAndNetDefaultValue(moduleId,data.form[moduleId].rows[0].values,true);
                                });
                        }
                    }
                }):me.setAccBaseAndNetDefaultValue(moduleId,{
                    pk_banktype:{display:'',value:''},
                    pk_netbankinftp:{display:'',value:''},
                    combineaccnum:{display:'',value:''},
                    combineaccname:{display:'',value:''},
                    combinenum:{display:'',value:''},
                    orgnumber:{display:'',value:''},
                    bankarea:{display:'',value:''},
                    province:{display:'',value:''},
                    city:{display:'',value:''},
                    customernumber:{display:'',value:''},
                    areacode:{display:'',value:''}
                },false);
                break;

            case 'pk_banktype':
                //账户基本信息选择银行类别时
                let meta = props.meta.getMeta(),
                    item = meta[moduleId]['items'].find(item=>item.attrcode == 'pk_bankdoc');
                item.queryCondition = {
                    pk_banktype:value.value
                }
                props.meta.setMeta(meta,()=>{
                    if(value.value!=oldValue.value){
                        this.props.form.setFormItemsValue(moduleId,{pk_bankdoc:{display:'',value:''}});
                        me.setAccBaseAndNetDefaultValue(moduleId,{
                            pk_banktype:value,
                            pk_netbankinftp:{display:'',value:''},
                            combineaccnum:{display:'',value:''},
                            combineaccname:{display:'',value:''},
                            combinenum:{display:'',value:''},
                            orgnumber:{display:'',value:''},
                            bankarea:{display:'',value:''},
                            province:{display:'',value:''},
                            city:{display:'',value:''},
                            customernumber:{display:'',value:''},
                            areacode:{display:'',value:''},
                            issigned:{dispaly:'',value:''}
                        },false);
                    }
                });
                break;
        }

    }
    setAccBaseAndNetDefaultValue = (moduleId,data,flag)=>{
        this.props.form.setFormItemsValue(
            moduleId,
            {
                'pk_banktype': data.pk_banktype,
                'pk_netbankinftp': data.pk_netbankinftp,
                'combineaccnum': {
                    display: data.combineaccnum.value,
                    value: data.combineaccnum.value
                },//人行联行号
                'combineaccname': {
                    display: data.combineaccname.value,
                    value: data.combineaccname.value
                },//联行名称
                'combinenum': {
                    display: data.combinenum.value,
                    value: data.combinenum.value
                },
                'orgnumber': {
                    display: data.orgnumber.value,
                    value: data.orgnumber.value
                },
                'bankarea': {
                    display: data.bankarea.value,
                    value: data.bankarea.value
                },
                'province': {
                    display: data.province.value,
                    value: data.province.value
                },
                'city': {
                    display: data.city.value,
                    value: data.city.value
                },
                'customernumber': {
                    display: data.customernumber.value,
                    value: data.customernumber.value
                },
                'areacode': {
                    display: data.areacode.display,
                    value: data.areacode.value
                },
                'issigned': { // update by yufwm 2020-0319 非空
                    display: data.issigned && data.issigned.value,
                    value: data.issigned && data.issigned.value
                }
            });
        this.props.form.setFormItemsDisabled(moduleId, {'pk_banktype': flag});
    }
    writebackIbanCode = (value)=>{
        this.props.form.setFormItemsValue('accbasinfo',{'accnum':value});
    }
    /**
     * 设置供应商主键
     * @param pk_supplier
     */
    setPk_supplier =(pk_supplier)=>{
        this.setState({pk_supplier:pk_supplier},()=>{
            this.onLoadSupBankAccTableData();
        })
    }
    /**
     * 单击事件
     * @param record
     * @param index
     * @param event
     */
    onRowClick = (record, index, event)=>{
        this.setState({selectedRecord:record},()=>{
            this.setButtonDisabledStatus(false);
            this.setEnableStateStatus(record.getData()['enablestate'] == '2');
        });
    }
    setEnableStateStatus = (flag)=>{
        let supprop = this.state.supprop;
        if(supprop=='1'){
            this.props.button.setButtonDisabled(['SupBankAcc_Enable','SupBankAcc_Disable'], true);
        }else{
            this.props.button.setButtonDisabled(['SupBankAcc_Enable'],flag);
            this.props.button.setButtonDisabled(['SupBankAcc_Disable'],!flag);
        }
    }
    setEnableStateVisible = (flag)=>{
        this.props.button.setButtonsVisible({'Card_SupBankAcc_Enable':!flag,'Card_SupBankAcc_Disable':flag});
        // this.props.button.setButtonDisabled(['SupBankAcc_Disable','Card_SupBankAcc_Disable'],!flag);
    }
    /**
     * 单击事件之后渲染样式
     * @param record
     * @param index
     * @param indent
     * @returns {string}
     */
    rowClassName = (record,index,indent)=>{
        let data = record && record.getData ? record.getData():null;
        let selectRecord =this.state.selectedRecord && this.state.selectedRecord.getData?this.state.selectedRecord.getData():null;
        return data && selectRecord ?(data['pk_custbank'] == selectRecord['pk_custbank']?'selected':''):'';
    }
    /**
     * 双击事件
     * @param record
     * @param index
     * @param event
     */
    onRowDoubleClick = (record, index, event)=>{
        // this.setSupBankAccCardButtonStatus('browse');
        this.setSupBankAccCardButtonStatus('browse',false);
        this.setSupBankAccCardStatus('browse');
        this.state.showCard = true;
        this.state.selectedRecord = record;
        this.state.cardStatus = 'browse';
        this.setState(this.state,()=>{
            this.setEnableStateStatus(record.getData()['enablestate']=='2');
            resizeForm.call(this,'accbasinfo');
            resizeForm.call(this,'cardsupbankacc');
            this.props.form.EmptyAllFormValue('cardsupbankacc');
            this.loadAndSetSupBankaccCardData(record);
            
        })
    }
    /**
     * 加载并设置卡片数据
     * @param record
     */
    loadAndSetSupBankaccCardData = (record,isRefresh)=>{
        let pk_supplier = record.hasOwnProperty('getData')?record.getData()['pk_cust']:record.pk_cust?record.pk_cust:this.state.supplier;
        let pk_bankaccbas = record.hasOwnProperty('getData')?record.getData()['pk_bankaccbas']:record.pk_bankaccbas?record.pk_bankaccbas:null;
        let pk_custbank = record.hasOwnProperty('getData')?record.getData()['pk_custbank']:record.pk_custbank?record.pk_custbank:null;
        ajax({
            url:urls.querySupBankInfoUrl,
            data:{
                pk_supplier:pk_supplier,
                pk_bankaccbas:pk_bankaccbas,
                pk_custbank:pk_custbank,
                nodeType:this.props.nodeType,
                pk_curOrg:this.props.envParam.pk_org
            },
            success:(res)=>{
                this.state.showCard = true;
                this.state.cardStatus = 'browse';
                this.setState(this.state,()=>{
                    //显示公式设置
                    showFormulaSetting.call(this,res,{
                        [this.state.card.form.cardsupbankacc.formId]:'form',
                        [this.state.card.form.accbasinfo.formId]:'form',
                        [this.state.card.form.netbankinfo.formId]:'form',
                        [this.state.card.table.tableId]:'cardTable'
                    })
                    Object.values(this.state.card.form).forEach((item)=>{
                        if(item.formId!='netbankinfo'){
                            this.props.form.setAllFormValue({[item.formId]:res.data[item.formId][item.formId]});
                        }
                    });
                    let enablestate = res.data[this.state.card.form.accbasinfo.formId][this.state.card.form.accbasinfo.formId].rows[0].values['enablestate'].value;
                    // this.setEnableStateStatus(enablestate == '2');
                    this.setEnableStateVisible(enablestate == '2');
                    this.props.cardTable.setTableData(this.state.card.table.tableId, {rows:res.data[this.state.card.table.tableId][this.state.card.table.tableId].rows});
                    isRefresh && toast({title:this.props.Lang['10140SUG-000200'],color:'success'});

                })
            }
        })
    }
    /**
     * 渲染form
     * @returns {any[]}
     */
    renderForm = ()=>{
        return [
            <NCScrollElement name={this.state.card.form['cardsupbankacc'].formName}>
                {this.props.form.createForm(this.state.card.form['cardsupbankacc'].formId,this.state.card.form['cardsupbankacc'].action)}
            </NCScrollElement>,
            <NCScrollElement name={this.state.card.form['accbasinfo'].formName}>
                {this.props.form.createForm(this.state.card.form['accbasinfo'].formId,this.state.card.form['accbasinfo'].action)}
            </NCScrollElement>
            ]
    }
    render(){
        let {cardTable,button} = this.props;
        const {createCardTable} = cardTable;
        const {createButtonApp} = button;
        return [
            <div className="nc-single-table" style={{display:this.state.showCard?'none':'',backgroundImage:'none'}}>
                <div className="nc-singleTable-header-area" >
                    <div className="title-search-detail" style={{'margin-left':'20px'}}>
                        <span className='showOff'>
                            <NCCheckbox {...this.state.showoff}>{this.state.showoff.name}</NCCheckbox>
                        </span>
                    </div>
                    <div className="header-button-area">
                        {createButtonApp(this.state.buttonApps)}
                    </div>
                </div>
                <div className="nc-singleTable-table-area">
                    {this.state.custsupbankacc.columns && <Table
                        {...this.state.custsupbankacc}
                        ref={(BankAccTable)=>{this.BankAccTable = BankAccTable;}} />}
                </div>
            </div>
            ,
            <div className="nc-bill-card" style={{display:this.state.showCard?'':'none'}}>
                <div className="nc-bill-top-area">  
                    <div className='nc-bill-header-area'>
                        {(this.state.showCard && this.state.cardStatus == 'browse') && 
                        <NCBackBtn
                            onClick={this.onSupBankAccCardBtnClick.bind(this,this.props,'Card_SupBankAcc_Return') }>
                        </NCBackBtn>}
                        <div className="header-button-area">
                            {createButtonApp(this.state.card.buttonApps)}
                        </div>
                    </div>
                    <div className="nc-bill-form-area">
                        {this.renderForm()}
                    </div>
                </div>

                <div className="nc-bill-bottom-area">  
                    <div className="nc-bill-table-area">
                        {this.state.showCard && createCardTable(this.state.card.table.tableId,this.state.card.table.action)}
                    </div>
                </div>
                <ExcelImport
                    {...Object.assign(this.props)}
                    moduleName = 'uapbd'//模块名
                    moduleId = 'supplierbankExcel'
                    billType = {this.props.supbabillType}//单据类型
                    selectedPKS = {[]}
                    appcode={this.props.appcode}
                    pagecode={this.props.pagecode}
                />
            </div>
       ]
    }
}


// (
//     <div className="ncc-hr-supbankacc-container">
//         <div className="nc-single-table" style={{display:this.state.showCard?'none':'',backgroundImage:'none'}}>
//             <div className="nc-singleTable-header-area" >
//                 <div className="title-search-detail" style={{'margin-left':'20px'}}>
//                     <span className='showOff'>
//                         <NCCheckbox {...this.state.showoff}>{this.state.showoff.name}</NCCheckbox>
//                     </span>
//                 </div>
//                 <div className="header-button-area">
//                     {createButtonApp(this.state.buttonApps)}
//                 </div>
//             </div>
//             <div className="nc-singleTable-table-area" fieldid="supbank_table-area">
//                 {this.state.custsupbankacc.columns && <Table
//                     {...this.state.custsupbankacc}
//                     ref={(BankAccTable)=>{this.BankAccTable = BankAccTable;}} />}
//             </div>
//         </div>
       
//         <div className="ncc-hr-multi-child-card-container" style={{display:this.state.showCard?'':'none'}}>
//             <div className="ncc-hr-multi-child-card-header">
//                 <div className='nc-bill-header-area'>
//                     {(this.state.showCard && this.state.cardStatus == 'browse') && 
//                     <NCBackBtn
//                         onClick={this.onSupBankAccCardBtnClick.bind(this,this.props,'Card_SupBankAcc_Return') }>
//                     </NCBackBtn>}
//                     <div className="header-button-area">
//                         {createButtonApp(this.state.card.buttonApps)}
//                     </div>
//                 </div>
//             </div>
//             <div className="ncc-hr-multi-child-card-body">
//                 <div className="nc-bill-form-area" >
//                     {this.renderForm()}
//                 </div>
//                 <div className="nc-bill-table-area">
//                     {this.state.showCard && createCardTable(this.state.card.table.tableId,this.state.card.table.action)}
//                 </div>
//             </div>
//         </div>
//         <ExcelImport
//             {...Object.assign(this.props)}
//             moduleName = 'uapbd'//模块名
//             moduleId = 'supplierbankExcel'
//             billType = {this.props.supbabillType}//单据类型
//             selectedPKS = {[]}
//             appcode={this.props.appcode}
//             pagecode={this.props.pagecode}
//         />
//     </div>
// )
//dzeyCQYrXt70gDlzOdlFvC18+Wi6m+LRVv0mtYgRmV4WUAP+3uiQLN0WZDye4vv/PRLJenWOPHyT
//ktsJtBZgvQ==