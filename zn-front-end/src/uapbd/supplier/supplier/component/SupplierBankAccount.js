//dzeyCQYrXt70gDlzOdlFvC18+Wi6m+LRVv0mtYgRmV4WUAP+3uiQLN0WZDye4vv/PRLJenWOPHyT
//ktsJtBZgvQ==
import React,{Component} from 'react';
import {base,ajax,toast} from 'nc-lightapp-front';
import './SupplierBankAccount.less';
const {NCTable,NCScrollElement,NCCheckbox} = base;
/**
 * liupzhc
 * 供应商银行账户 弹出页面
 */
const EMPTY_FUNC = ()=>{};//占位方法

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
            pk_supplier:null,
            ...this.props,
            showCard:false,
            showoff: {
                checked: undefined,
                disabled: false,
                onChange: (val) => {
                    this.state.showoff.checked = val;
                    this.setState(this.state, () => {
                        this.onLoadSupBankAccTableData();
                    });
                },
                name: '显示停用'
            },
            buttonApps:{
                area:'custsupbankacc_table',
                buttonLimit: 3,
                onButtonClick: this.onSupBankAccTableBtnClick.bind(this),
            },
            custbankunions:{},
            custsupbankacc:{
                data:[],
                columns: this.props.meta.getMeta()['custsupbankacc'] || undefined,//供应商银行账户元数据
                onRowDoubleClick:this.onRowDoubleClick,
                onRowClick:this.onRowClick,
                rowClassName:this.rowClassName,
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
                        formName:'供应商',
                        action:{
                            onAfterEvent:this.onAfterEditFormEvent.bind(this,'cardsupbankacc')
                        }
                    },
                    accbasinfo:{
                        formId:'accbasinfo',
                        formName:'账户基本信息',
                        action:{
                            onAfterEvent:this.onAfterEditFormEvent.bind(this,'accbasinfo')
                        }
                    },
                    netbankinfo:{
                        formId:'netbankinfo',
                        formName:'网银信息',
                        action:{
                            onAfterEvent:this.onAfterEditFormEvent.bind(this,'netbankinfo')
                        }
                    }
                },
                table:{
                    tableId:'bankaccsub',
                    tableName:'供应商银行账户子户',
                    action:{
                        tableHead: addSupBankSubButton.bind(this) || EMPTY_FUNC,
                        modelSave:  EMPTY_FUNC,
                        showIndex:true
                    },
                    field:{
                        attrcode: 'opr',
                        label: '操作',
                        visible: true,
                        className:'table-opr',
                        width:200,
                        itemtype:'customer',
                        fixed:'right',
                        render: (text, record, index) => {
                            return (
                                <span>
                                        <span
                                            className="row-edit-option"
                                            onClick={()=>{this.onSupBankAccSubOperatDeleteEvent(text,record,index)}}>
                                            删行
                                        </span>
                                    </span>
                            )
                        }
                    }
                }
            },
            urls:{
                querySupBankaccUrl:'/nccloud/uapbd/supplier/querySupBankacc.do',
                querySupBankInfoUrl:'/nccloud/uapbd/supplier/querySupBankInfo.do',
                delSupBankAccUrl:'/nccloud/uapbd/supplier/delSupBankAcc.do',
                saveSupBankAccUrl:'/nccloud/uapbd/supplier/saveSupBankAcc.do'
            }
        };
        setSupBankAccSubOperateField(this.props.meta.getMeta()['bankaccsub']);
    }
    /**
     * 加载供应商银行账户列表信息
     */
    onLoadSupBankAccTableData = ()=>{
        ajax({
            url:this.state.urls.querySupBankaccUrl,
            data:{pk_supplier:this.state.pk_supplier,showOff:this.state.showoff.checked},
            success:(res)=>{
                this.state.custsupbankacc.data=[];
                if(res.success && res.data){
                    this.state.custsupbankacc.data= res.data;
                }
                this.setState(this.state,()=>{
                    this.setSupBankAccTableButtonStatus(!!res.data);
                });

            }
        })
    }
    /**
     * 供应商银行账户卡片子表（银行账户子户）操作列点击事件
     */
    onSupBankAccSubOperatDeleteEvent = ()=>{

    }
    /**
     * 供应商银行账户子户按钮点击事件
     * 新增子户记录
     * @param props
     * @param id
     */
    onSupBankAccSubButtonClick = (props,id)=>{
        this.props.cardTable.addRow(this.state.card.table.tableId);
        this.props.cardTable.setStatus(this.state.card.table.tableId,'edit');
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
        this.state.custsupbankacc.data = [];
        this.setState({
            showCard:flag,
            pk_supplier:null,
            selectedRecord:{}
        })
    }
    /**
     * 供应商银行账户列表按钮事件
     * @param props
     * @param id
     */
    onSupBankAccTableBtnClick = (props,id)=>{
        switch(id){
            case 'SupBankAcc_Add':
                let requestParam = {pk_supplier:this.state.pk_supplier};
                this.onEditSupBankAcc('add',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableAddClickCallBack,requestParam);
                break;
            case 'SupBankAcc_Edit':

                this.onEditSupBankAcc('edit',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableEditClickCallBack);
                break;
            case 'SupBankAcc_Delete':
                ajax({
                    url:this.state.urls.delSupBankAccUrl,
                    data:{pk_custbank:this.state.selectedRecord['pk_custbank'],pk_bankaccbas:this.state.selectedRecord['pk_bankaccbas']},
                    success:(res)=>{res.success && this.onLoadSupBankAccTableData();}
                });
                break;
            case 'SupBankAcc_Refresh':
                this.setState({selectedRecord:{}},()=>{this.onLoadSupBankAccTableData();});
                break;
            case 'SupBankAcc_Enable':
                this.enableSupBankAcc(true);
                break;
            case 'SupBankAcc_Disable':
                this.enableSupBankAcc(false);
                break;


        }
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
                this.onQuerySupBankAcc('add',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableAddClickCallBack,requestParam);
                break;
            case 'Card_SupBankAcc_Edit':
                debugger
                this.setSupBankAccCardStatus('edit');
                this.setSupBankAccCardButtonStatus('edit');
                break;
            case 'Card_SupBankAcc_Return':
                this.setState({showCard:!this.state.showCard},()=>{this.onLoadSupBankAccTableData();})
                break;
            case 'Card_SupBankAcc_Save':
                this.onSupBankAccSaveClick();
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
                this.onQuerySupBankAcc('browse',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableAddClickCallBack);
                break;
        }
    }
    /**
     * 银行账户 新增后回调事件
     * @param data
     */
    onSupBankAccTableAddClickCallBack = (data)=>{
        this.props.form.setAllFormValue({cardsupbankacc:data['cardsupbankacc']['cardsupbankacc']});
        this.props.form.setAllFormValue({accbasinfo:data['accbasinfo']['accbasinfo']});
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
        (isAdd == 'edit' && !this.state.selectedRecord['pk_custbank'])? toast({title:'提示',content:'请选中一张单据'}):
        this.setState({showCard:!this.state.showCard},()=>{
            debugger
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
        ajax({
            url:this.state.urls.querySupBankInfoUrl,
            data:requestParam?requestParam:{pk_supplier:this.state.pk_supplier,pk_custbank:this.state.selectedRecord['pk_custbank'],pk_bankaccbas:this.state.selectedRecord['pk_bankaccbas']},
            success:(res)=>{
                if(res.success){
                    //设置卡片状态
                    setSupBankAccCardStatus && setSupBankAccCardStatus((flag == 'add' || flag == 'edit')?'edit':'browse');
                    //设置按钮状态
                    setSupBankAccCardButtonStatus && setSupBankAccCardButtonStatus(flag);
                    //设置卡片数据
                    setCardData && setCardData(res.data);
                }
            }
        })
    }
    /**
     * 设置银行账户卡片的状态
     * @param status:browse/edit
     */
    setSupBankAccCardStatus = (status)=>{
        Object.values(this.state.card.form).forEach(item=>{
            if(item.formId!='netbankinfo'){this.props.form.setFormStatus(item.formId,status);}
        });
        this.props.cardTable.setStatus(this.state.card.table.tableId,status);
    }
    /**
     * 保存供应商银行账户卡片数据
     */
    onSupBankAccSaveClick = (addParam)=>{
        //迭代获得表单数据
        let formDataArr = Object.keys(this.state.card.form).map(formId=>{
            let formData = this.props.form.getAllFormValue(formId);
            formData.areacode = formId;
            return formData;
        });
        //获得卡片子表数据
        let cardTableData = this.props.cardTable.getAllData(this.state.card.table.tableId);
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
            }
        };
        ajax({
            url:this.state.urls.saveSupBankAccUrl,
            data:config,
            success:(res)=>{
                if(res.success){
                    this.setState({selectedRecord:{pk_cust:res.data['pk_supplier'],pk_custbank:res.data['pk_custbank'],pk_bankaccbas:res.data['pk_bankaccbas']}},()=>{
                        //有新增参数就保存后新增，没新增参数就恢复浏览态
                        addParam ?this.onQuerySupBankAcc(addParam.status,this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableEditClickCallBack,addParam.param):
                            this.onQuerySupBankAcc('browse',this.setSupBankAccCardStatus,this.setSupBankAccCardButtonStatus,this.onSupBankAccTableEditClickCallBack);
                    })
                }
            }
        })

    }
    /***
     * 银行账户停启用
     * @param flag
     * @param param
     */
    enableSupBankAcc = (flag)=>{
        ajax({
            url:'',
            data:{
                pk_supplier:this.state.pk_supplier,
                pk_custbank:this.state.selectedRecord['pk_custbank'],
                pk_bankaccbas:this.state.selectedRecord['pk_bankaccbas'],
                enable:flag,
            },
            success:(res)=>{
                res.success?toast({title:'提示',content:flag?'启用成功':'停用成功'}):null;
            }
        })
    }
    setSupBankAccTableButtonStatus = (status)=>{
        switch(status){
            case true:
                this.props.button.setButtonsVisible(['SupBankAcc_Add','SupBankAcc_Edit','SupBankAcc_Delete','SupBankAcc_Refresh'],true);
                break;
            case false:
                this.props.button.setButtonsVisible(['SupBankAcc_Add','SupBankAcc_Refresh'],true);
                this.props.button.setButtonsVisible(['SupBankAcc_Edit','SupBankAcc_Delete'],false);
                break;
        }
    }
    /**
     * 设置供应商银行账户卡片按钮状态
     *
     * @param status
     */
    setSupBankAccCardButtonStatus = (status)=>{
        switch(status){
            case 'add':
                this.props.button.setButtonsVisible(['Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Delete','Card_SupBankAcc_Refresh','Card_SupBankAcc_Return'],false);
                this.props.button.setButtonsVisible(['Card_SupBankAcc_Save','Card_SupBankAcc_SaveAdd','Card_SupBankAcc_Cancel'],true);
                break;
            case 'edit':
                this.props.button.setButtonsVisible(['Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Delete','Card_SupBankAcc_Refresh','Card_SupBankAcc_SaveAdd','Card_SupBankAcc_Return'],false);
                this.props.button.setButtonsVisible(['Card_SupBankAcc_Save','Card_SupBankAcc_Cancel'],true);
                break;
            default:
                this.props.button.setButtonsVisible(['Card_SupBankAcc_Add','Card_SupBankAcc_Edit','Card_SupBankAcc_Delete','Card_SupBankAcc_Return'],true);
                this.props.button.setButtonsVisible(['Card_SupBankAcc_Save','Card_SupBankAcc_SaveAdd','Card_SupBankAcc_Cancel','Card_SupBankAcc_Refresh'],false);
                break;
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
    onAfterEditFormEvent(props, key, value, index,formId){
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
        this.setState({selectedRecord:record});
    }
    /**
     * 单击事件之后渲染样式
     * @param record
     * @param index
     * @param indent
     * @returns {string}
     */
    rowClassName = (record,index,indent)=>{
        return record['pk_custbank'] == this.state.selectedRecord['pk_custbank']?'selected':'';
    }
    /**
     * 双击事件
     * @param record
     * @param index
     * @param event
     */
    onRowDoubleClick = (record, index, event)=>{
        this.setState({ showCard:true},()=>{
            ajax({
                url:this.state.urls.querySupBankInfoUrl,
                data:{pk_supplier:record['pk_cust'],pk_bankaccbas:record['pk_bankaccbas'],pk_custbank:record['pk_custbank']},
                success:(res)=>{
                    Object.values(this.state.card.form).forEach((item)=>{
                         if(item.formId!='netbankinfo'){
                             this.props.form.setAllFormValue({[item.formId]:res.data[item.formId][item.formId]});
                         }
                    });
                    this.props.cardTable.setTableData(this.state.card.table.tableId, {rows:res.data[this.state.card.table.tableId][this.state.card.table.tableId].rows});
                    this.setSupBankAccCardButtonStatus('browse');
                }
            })
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
        return (
            <div>
                <div className="nc-single-table" style={{display:this.state.showCard?'none':''}}>
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
                        {this.state.custsupbankacc.columns && <NCTable {...this.state.custsupbankacc} />}
                    </div>
                </div>
                <div className="ncc-hr-multi-child-card-container" style={{display:this.state.showCard?'':'none'}}>
                    <div className="ncc-hr-multi-child-card-header">
                        <div className='nc-bill-header-area'>
                            <div className="header-button-area">
                                {createButtonApp(this.state.card.buttonApps)}
                            </div>
                        </div>
                    </div>
                    <div className="ncc-hr-multi-child-card-body">
                        <div className="nc-bill-form-area" >
                            {this.renderForm()}
                        </div>
                        <div className="nc-bill-table-area nc-bill-table-area-add-new">
                            {createCardTable(this.state.card.table.tableId,this.state.card.table.action)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//dzeyCQYrXt70gDlzOdlFvC18+Wi6m+LRVv0mtYgRmV4WUAP+3uiQLN0WZDye4vv/PRLJenWOPHyT
//ktsJtBZgvQ==