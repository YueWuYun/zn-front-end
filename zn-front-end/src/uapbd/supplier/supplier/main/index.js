//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax ,toast} from 'nc-lightapp-front';
import Dialog from '../component/Dialog1';
import './index.less';
import {onCardButtonClick, setCardButtonStatus,disabledFormItems,getCurCardStatus} from '../component/SupplierCardButtonAction';
import {onMainTableButtonClick,setMainTableButtonStatus,onSupMainTableOprBtnClick} from '../component/SupplierMainTableButtonAction';
import {convertForm2GridData, getDialogConfig,resetTableRows,convertGridRecord2FormData} from '../component/SupplierUtils';
const {NCCheckbox,NCIcon,NCPopconfirm,NCTable,NCRow,NCCol,NCButton,NCScrollLink,NCScrollElement,NCAffix,NCAnchor } = base;

const EMPTY_FUNC = ()=>{};
export default class Main extends Component{
    constructor(props){
        super(props);

        var dealMetaItems = (meta) => {
            const addSearchAreaItemReferCode = (template) => {
                var items = template && template['supplierquery'] && template['supplierquery'].items ? template['supplierquery'].items : [];
                items.forEach(item => {
                    let itemType = item.itemtype;
                    if(itemType == 'refer'){
                        switch(item.attrcode) {
                            case 'csupplierid.pk_org'://全局+集团+业务单元
                            case 'csupplierid.pk_org_assign'://全局+集团+业务单元

                               item.refcode = 'uapbd/refer/org/BusinessUnitWithGlobleAndCurrGropTreeRef/index.js';
                                break;
                            case 'csupplierid.pk_supplierclass'://供应商基本分类
                                item.refcode = 'uapbd/refer/supplier/SupplierClassTreeRef/index.js';
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
                    }
                });


            };
            const addCodeFieldLink= (meta) => {
                meta['supplier_baseInfo'].items.forEach(item => {
                    //item.width = 150;
                    if (item.attrcode == 'code') {
                        item.render = (text, record,index) => {
                            return (
                                <a
                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => {

                                        this.setState({
                                            batchParam:[{data:{values:record}}],
                                            param:{
                                                pk_supplier:record['pk_supplier'].value,
                                                status:'browse',
                                                index:index
                                            },
                                            oldParam:{
                                                pk_supplier:record['pk_supplier'].value,
                                                status:'browse',
                                                index:index
                                            },
                                            openCard:!this.state.openCard
                                        },()=>{
                                            this.initPageData(this.setCardValue,this.setCardStatus);
                                        })
                                    }}
                                >
                                    {record?(record.code && record.code.value):null}
                                </a>
                            );
                        };
                    }
                });
            };
            const addOperateField = (meta) =>{
                meta['supplier_baseInfo'].items.push(this.state.table.operator); //添加操作列
            };
            //设置供应商银行账户 基本信息和网银信息的formrelation关系
            meta.formrelation = new Object();
            meta.formrelation['accbasinfo'] = ['netbankinfo'];
            addSearchAreaItemReferCode(meta);//添加查询区元数据item的参照路径
            addCodeFieldLink(meta);          //添加编码链接
            addOperateField(meta);           //添加操作列
        };
        var  initEnvParam = (callback) => {    //init
            ajax({
                url:'/nccloud/uapbd/supplier/envParamUrl.do',
                data: {
                    nodeType:this.props.nodeType || 'GLOBE_NODE',
                    pk_curOrg:'',
                },
                success:(res)=>{
                    callback &&  callback(res.data || {});
                }
            });
        }
        this.state = {
            envParam: {},
            showoff: {
                checked: undefined,
                disabled: false,
                onChange: (val) => {
                    this.state.showoff.checked = val;
                    this.setState(this.state, () => {
                        this.onSearch(this.setTableData);
                    });
                },
                name: '显示停用'
            },
            buttonApps: {
                area: 'supplier_baseInfo',
                buttonLimit: 3,
                onButtonClick: onMainTableButtonClick.bind(this),
            },
            search: {
                id: 'supplierquery',
                clickSearchBtn: () => {
                    this.onSearch(this.setTableData);
                },
                url:'/nccloud/uapbd/supplier/querySupplierBaseInfo.do',
                oid: this.props.oid || '0001Z81000000000CWIB'
            },
            table: {
                id: 'supplier_baseInfo',
                showCheck:true,
                showIndex:true,
                onSelected:this.onSupplierMainTableChecked.bind(this,this.disabledApproveButtons),
                operator:{
                    attrcode: 'opr',
                    itemtype:'customer',
                    label: "操作",
                    width: 200,
                    className : 'table-opr',
                    fixed: 'right',
                    visible: true,
                    render: (text, record, index) => {
                        let btnKeyArr = new Array();
                        this.props.button.getButtons().forEach(button=>{
                            if(button.area == 'supplier_baseInfo_opr'){
                                btnKeyArr.push(button.key);
                            }
                        });
                        return this.props.button.createOprationButton(btnKeyArr, {
                            area: 'supplier_baseInfo_opr',
                            buttonLimit: 3,
                            onButtonClick:onSupMainTableOprBtnClick.bind(this,record,index)
                        });
                    }
                }
            },
            batchParm:[],
            //param 和oldParam在修改/复制等动作的时候会使用
            param:{status:'add'},
            oldParam:{},
            //删除参数对象
            delParam:{},
            openCard:false,
            urls:{
                addUrl:'/nccloud/uapbd/supplier/addSupplier.do',
                editUrl:'/nccloud/uapbd/supplier/editSupplier.do',
                saveUrl:'/nccloud/uapbd/supplier/saveSupplier.do',
                saveAddUrl:'/nccloud/uapbd/supplier/saveAddSupplier.do',
                cancelUrl:'/nccloud/uapbd/supplier/cancelSupplier.do',
                delLineUrl:'/nccloud/uapbd/supplier/delLineUrl.do',
                saveLinkmanUrl:'/nccloud/uapbd/supplier/saveLinkman.do',
                queryLinkmanUrl:'/nccloud/uapbd/supplier/queryLinkman.do',
                queryCardUrl:'/nccloud/uapbd/supplier/querycard.do',
                delSupplier:'/nccloud/uapbd/supplier/deleteSupplier.do',
                copySupplierUrl:'/nccloud/uapbd/supplier/copySupplier.do',
                approveSupplierUrl:'nccloud/uapbd/supplier/approveSupplier.do',
            },
            card:{
                form:{
                    formName:'基本信息',
                    formId:'supplier_baseInfo_card',
                    primaryKey:'pk_supplier',
                    action:{
                        onAfterEvent: this.onAfterCardFormEditEvent.bind(this)
                    }
                },
                table:{
                    tableIds:['suplinkman','supcountrytaxes','supbankacc','finance','purchase'],
                    suplinkman:{
                        tableName:'联系人',
                        tableId:'suplinkman',
                        relate:'agg',
                        btnApp:{
                            area: 'card_table',
                            buttonLimit: 3,
                            onButtonClick: this.onCardTableButtonClick.bind(this,'suplinkman'),
                            popContainer: document.querySelector('.card_table')
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
                                    <span >
                                        <span
                                            className="row-edit-option"
                                            onClick={()=>{(this.state.param.status=='add' || this.state.param.status=='edit') && this.onCardTableOperatEditEvent('suplinkman',text,record,index)}}>
                                            修改
                                            <span className="split-line">|</span>
                                        </span>
                                        <span
                                            className="row-edit-option"
                                            onClick={()=>{(this.state.param.status=='add' || this.state.param.status=='edit') && this.onCardTableOperatDeleteEvent('suplinkman',text,record,index)}}>
                                            删行
                                        </span>
                                    </span>
                                )
                            }
                        }
                    },
                    supcountrytaxes:{
                        tableName:'国家税类',
                        tableId:'supcountrytaxes',
                        relate:'agg',
                        btnApp:{
                            area: 'card_table',
                            buttonLimit: 3,
                            onButtonClick: this.onCardTableButtonClick.bind(this,'supcountrytaxes'),
                            popContainer: document.querySelector('.card_table')
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
                                    <span >
                                        <span
                                            className="row-edit-option"
                                            onClick={()=>{(this.state.param.status=='add' || this.state.param.status=='edit') && this.onCardTableOperatDeleteEvent('supcountrytaxes',text,record,index)}}>
                                            删行
                                        </span>
                                    </span>
                                )
                            }
                        }
                    },
                    supbankacc:{
                        tableName:'银行账户',
                        tableId:'supbankacc',
                        relate:'inci',
                    },
                    finance:{
                        tableName:'财务信息',
                        tableId:'finance',
                        relate:'inci',
                    },
                    purchase:{
                        tableName:'采购信息',
                        tableId:'purchase',
                        relate:'inci',
                    }
                },
                buttonApps: {
                    area: 'supplier_baseInfo_card',
                    buttonLimit: 3,
                    onButtonClick: onCardButtonClick.bind(this),
                    popContainer: document.querySelector('.supplier_baseInfo_card')
                },
                pagination:{
                    handlePageInfoChange:this.onPageInfoClick.bind(this)
                },
                dialog:{
                    linkman:{
                        formName:'联系人',
                        formId:'linkman',
                        targetId:'suplinkman'
                    },
                    supbankacc:{
                        tableId:'custsupbankacc',
                        tableName:'供应商银行账户',
                        targetId:'supbankacc',
                        pk_supplier:null,
                    },
                    supaddress:{
                        tableId:'supaddress',
                        tableName:'供应商发货地址',
                        pk_supplier:null,
                    }
                }

            }
        };
        //init template
        this.props.createUIDom({
                pagecode:  this.props.pagecode || '10140SUB_base',//props.config.pagecode,
                appcode: this.props.appcode || '10140SUB',
                appid:     this.props.appid || '0001Z010000000002G42'},//props.config.appid},
            (data)=>{
                initEnvParam((param) => {
                    debugger
                    this.state.envParam = param;
                    dealMetaItems(data.template);
                    this.props.meta.setMeta(data.template,()=>{
                        this.setSearchAreaOrgDefaultValue();
                        this.meta2TableFieldAdapter('custsupbankacc');
                    });
                    debugger
                    this.props.button.setButtons(data.button || [],()=>{
                        setMainTableButtonStatus.call(this);
                    });
                });
            }
        );
    }

    onSupMainTableOprBtnClick = (record,index)=>{

    }
    setSearchAreaOrgDefaultValue = ()=>{
        let envParam = this.state.envParam;
        //过滤查询区，给查询区组织赋默认值
        this.props.meta.getMeta()['supplierquery'].items.filter(item=>{
            if(item.attrcode.endsWith("pk_org_assign") || item.attrcode.endsWith("pk_org")){
                let data = {value:envParam.pk_org,display:envParam.name};
                this.props.search.setSearchValByField('supplierquery',item.attrcode, data);
            }
        })
    }
    meta2TableFieldAdapter = (metaId)=>{
        this.props.meta.getMeta()[metaId].items.forEach(item=>{
            item.title = item.label;
            item.dataIndex = item.attrcode;
            item.key = item.attrcode;
            item.width = 100;
        })
    }
    //主列表删除按钮点击事件
    onDeleteMainTableSupplier = (selectedRecords)=>{

        let ts = new Object();
        for(let i = 0;i<selectedRecords.length;i++){
            let record = selectedRecords[0];
            ts[record.data.values['pk_supplier'].value]=record.data.values['ts'].value;
        }
        this.setState({
            delParam:{
                delPks:selectedRecords.map(record=>{return record.data.values['pk_supplier'].value}),
                ts:ts,
                indexs:selectedRecords.map(record=>{return record.index}),
            }
        },()=>{
            this.DeleteDialog.showDialog();
        })
    }

    //查询主列表数据
    onSearch(callback){
        var param  = {
            pageInfo:this.props.table.getTablePageInfo(this.state.table.id),
            querycondition: this.props.search.getAllSearchData(this.state.search.id),
            oid: this.state.search.oid,
            queryAreaCode:this.state.search.id,
            querytype:'tree'
        };
        ajax({
            url:this.state.search.url,
            data:param,
            success:(res)=>{
                res.success && callback && callback(res.data,setMainTableButtonStatus.bind(this));
                this.disabledApproveButtons(true);//默认核准
            }
        });
    }

    /**
     * 设置主列表数据
     * @param data
     * @param callback
     */
    setTableData =(data,callback)=>{
        this.props.table.setAllTableData(this.state.table.id,data?data[this.state.table.id]:{rows:[]});
        let message = callback ? '查询成功，已查到'+callback()+'张单据。':null;
        !!data?toast({title:"提示",content:message,color:'success'}):
            toast({title:"提示",content:'未查到符合条件的数据，请确认查询条件后再查询。',color:'info'});

    }
    /**
     * 供应商主列表 复选框checked事件
     *     确定 核准按钮可用与否
     * @param props
     * @param moduleId
     * @param record
     * @param index
     * @param status
     */
    onSupplierMainTableChecked = (callback,props, moduleId, record)=>{
        let checkedRows = props.table.getCheckedRows(moduleId);//获得选中行集合
        debugger
        this.setState({batchParam:checkedRows},()=>{
            //禁用核准按钮
            callback && callback(!!checkedRows.find(row=>{
                return row.data && row.data.values && row.data.values['supstate'].value == '1'
            }) ? true:false);
        })

    }
    /**
     * 是否禁用核准按钮
     * @param flag
     */
    disabledApproveButtons = (flag)=>{
        this.props.button.setButtonDisabled(['Approve','Menu_Approve'],flag?true:false);
        this.props.button.setButtonDisabled(['UnApprove'],flag?false:true);
    }
    /******************************************************卡片*******************************************************/
    //设置卡片数据
    setCardValue = (data,callback)=>{
        let cardData = data && data.hasOwnProperty("card")?data.card:data;
        let disabledItems = data && data.hasOwnProperty("disabledItems")? data.disabledItems:false;
        cardData && this.props.form.setAllFormValue({[this.state.card.form.formId]:cardData.head['supplier_baseInfo']});
        //设置表格数据
        cardData.bodys && this.state.card.table.tableIds.forEach((key)=>{
            cardData.bodys[key] && this.props.cardTable.setTableData(this.state.card.table[key].tableId, {rows:cardData.bodys[key].rows});
        });
        disabledItems && callback && callback(data.disabledItems);
    }
    //设置卡片状态
    setCardStatus =(status,callback)=>{
        let curStatus = getCurCardStatus(status);
        //设置表单编辑态
        this.props.form.setFormStatus(this.state.card.form.formId, curStatus);
        //聚合关系的表格编辑态
        this.state.card.table.tableIds.forEach((key)=>{
            this.state.card.table[key].relate == 'agg' && this.props.cardTable.setStatus(this.state.card.table[key].tableId,curStatus);
        })
        callback && callback();//设置卡片按钮状态
    }
    //初始页面数据
    initPageData =(a,b,url)=>{

        let pk_supplier = this.state.param?this.state.param["pk_supplier"]:null,
            status = this.state.param?this.state.param['status']:'edit';
        if(!url){
           url = !!pk_supplier?this.state.urls.queryCardUrl:this.state.urls.addUrl
        }
        ajax({
            url:url,
            data:{pk_supplier:pk_supplier,pageCode:this.props.pagecode},
            success:(res)=>{
                res.success && a && a(res.data,disabledFormItems.bind(this)); //回调 表单表格赋值
                res.success && b && b(status,setCardButtonStatus.bind(this));   //回调 表单表格设置状态
            }
        })
    }
    //卡片 上一页 下一页点击事件
    onPageInfoClick = ()=>{}
    //卡片form编辑后事件
    onAfterCardFormEditEvent =()=>{}
    /**
     * 卡片 子表 操作列修改事件
     * 只有供应商联系人能点击修改
     * @param key
     * @param text
     * @param record
     * @param index
     */
    onCardTableOperatEditEvent = (key,text,record,index)=>{
        ajax({
            url:this.state.urls.queryLinkmanUrl,
            data:{pk_linkman:record.values['pk_linkman'].value},
            success:(res)=>{
                if(res.success){
                    this.props.form.setAllFormValue({linkman:res.data['linkman']});
                    this.props.form.setFormStatus('linkman', 'edit'); //设置表单编辑态
                    this.LinkmanDialog.showDialog();
                }
            }
        });
    }
    /**
     * 卡片 子表 操作列删除事件
     * @param key
     * @param text
     * @param record
     * @param index
     */
    onCardTableOperatDeleteEvent = (key,text,record,index)=>{
        this.props.cardTable.delRowsByIndex(key,index);
    }

    //卡片子表按钮点击事件
    onCardTableButtonClick = (tableId,props,id)=>{
        switch(tableId){
            case 'suplinkman':
                this.props.form.setFormStatus('linkman', 'edit'); //设置表单编辑态
                this.LinkmanDialog.showDialog();
                break;
            case 'supcountrytaxes':
                this.props.cardTable.addRow(tableId);
                this.props.cardTable.setStatus(tableId,'edit');
                break;
        }
    }
    //渲染卡片楼层
    renderAnchor =()=>{
        //渲染楼层
        const renderAnchorItems = (items)=> {
            return items.map((item)=>{
                return (<NCScrollLink
                    to={item.formId || item.tableId}
                    spy={true}
                    smooth={true}
                    duration={300}
                    offset={-100}>
                    <p>{item.formName || item.tableName}</p>
                </NCScrollLink>)
            })
        };
        //获得楼层项
        const getAnchorItems = ()=>{
            let anchorItems = new Array();
            anchorItems.push(this.state.card.form);
            for(let anchorItemId of this.state.card.table.tableIds){
                anchorItems.push(this.state.card.table[anchorItemId]);
            }
            return anchorItems;
        };
        return (renderAnchorItems(getAnchorItems()));
    }
    /**
     * 渲染卡片子表
     * @returns {any[]}
     */
    renderSubTables(addCardTableButton,modelSave,addCardTableOperateField){
        addCardTableOperateField && addCardTableOperateField();
        const {createCardTable} = this.props.cardTable;
        return Object.keys(this.state.card.table).map((key)=>{
            return(
                <div className="nc-bill-table-area">
                    <NCScrollElement name={this.state.card.table[key].tableId}>
                        {createCardTable(key,{
                                tableHead: addCardTableButton.bind(this,key) || EMPTY_FUNC,
                                modelSave: modelSave.bind(this,key) || EMPTY_FUNC,
                                showIndex:true
                            })}
                    </NCScrollElement>
                </div>
            );
        })
    }

    modelSave = ()=>{}
    /**
     * 添加卡片子表肩部按钮
     * @param key
     * @returns {*}
     */
    addCardTableButton = (key)=>{
        let { createButtonApp} = this.props.button;
        return ( <div className="shoulder-definition-area">
            <div className="definition-icons">
                {this.state.card.table[key].btnApp && createButtonApp(this.state.card.table[key].btnApp)}
            </div>
        </div>);
    }
    /**
     * 添加卡片子表操作列
     */
    addCardTableOperateField =()=>{
        let meta = this.props.meta.getMeta();//获得元数据
        //迭代为元数据添加操作列
        Object.keys(this.state.card.table).forEach((key)=>{
            this.state.card.table[key].field &&
            meta[key] && meta[key].hasOwnProperty('items') &&
            !meta[key].items.find((item)=>item.attrcode=='opr') && meta[key].items.push(this.state.card.table[key].field);
        });
    }
    /*************************************************dialog************************************************************/
    /**
     * 主列表 操作列删除 弹窗回调事件
     * @param isAsyncDel
     */
    onMainTableOperateDelClick=(isAsyncDel)=>{
        ajax({
            url:this.state.urls.delSupplier,
            data:Object.assign(this.state.delParam,{isAsyncDel:isAsyncDel}),
            success:(res)=>{
                res.success &&
                this.state.param.indexs.forEach(index=>{//迭代按index删除record
                    this.props.table.deleteTableRowsByIndex(this.state.table.id,index);
                })
                this.setState({delParam:{}},()=>{//清空param
                    res.success && toast({ color: 'success', content: '删除成功！' });//成功提示
                })
            }
        })
    }
    /**
     * 联系人dialog关闭后事件
     */
    onLinkmanDialogClose = ()=>{
        debugger
        let {formId,targetId} = this.state.card.dialog.linkman;
        let formData = this.props.form.getAllFormValue(formId);
        formData.areacode = formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        ajax({
            url:this.state.urls.saveLinkmanUrl,
            data: {
                model: formData,
                pageid: this.props.pagecode,
            },
            success:(res)=>{
                let rowNumber = this.props.cardTable.getNumberOfRows(targetId);
                //1 更新 2 新增
                res.data[formId].rows[0].values.status.value == 1?
                    resetTableRows.call(this,targetId,convertForm2GridData.call(this,res.data[formId].rows[0].values,targetId)):
                    this.props.cardTable.addRow(targetId, rowNumber, convertForm2GridData.call(this,res.data[formId].rows[0].values,targetId));
                this.props.cardTable.setStatus(targetId,'browse');
            }
        })
    }
    /**
     * 供应商联系人弹出维护后关闭事件
     */
    onSupBankaccDialogClose = ()=>{

    }
    onSupBankClickClose = (callback)=>{
        debugger
        this.SupBankAcc.setCardStatus(false);
        callback && callback();
    }
    render(){
        const {table,button ,search,cardPagination,form} = this.props;
        const { NCCreateSearch } = search;
        const { createSimpleTable } = table;
        const {createCardPagination} = cardPagination;
        const {createForm} = form;
        let { createButtonApp,createButton } = button;
        var me = this;
        return (
            <div style={{width:'100%',height:'100%'}}>
                <div className="ncc-hr-multi-child-container" style={{display:this.state.openCard?'block':'none'}}>
                    {/*渲染楼层*/}
                    <NCAnchor>
                        {this.renderAnchor()}
                    </NCAnchor>
                    <div className="ncc-hr-multi-child-header">
                        <div className='nc-bill-header-area'>
                            <div className='header-title-search-area'>
                                <h2 className='title-search-detail'>供应商</h2>
                            </div>
                            <div className="header-button-area" style={{zIndex:'1'}}>
                                {createButtonApp(this.state.card.buttonApps)}
                            </div>
                        </div>
                    </div>
                    <div className="ncc-hr-multi-child-body">
                        {/*渲染表单区域*/}
                        <div className="nc-bill-form-area">
                            <NCScrollElement name={this.state.card.form.formId}>
                                {createForm(this.state.card.form.formId, this.state.card.form.action)}
                            </NCScrollElement>
                        </div>
                        {/*渲染子表区域*/}
                        {this.renderSubTables(this.addCardTableButton,this.modelSave,this.addCardTableOperateField)}
                    </div>
                </div>
                {/*<div className="nc-bill-card" style={{display:this.state.openCard?'block':'none'}}>*/}
                    {/*/!*渲染楼层*!/*/}
                    {/*<NCAnchor>*/}
                        {/*{this.renderAnchor()}*/}
                    {/*</NCAnchor>*/}
                    {/*<NCAffix>*/}
                        {/*<div className='nc-bill-header-area'>*/}
                            {/*<div className='header-title-search-area'>*/}
                                {/*<h2 className='title-search-detail'>供应商</h2>*/}
                            {/*</div>*/}
                            {/*<div className="header-button-area">*/}
                                {/*{createButtonApp(this.state.card.buttonApps)}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</NCAffix>*/}
                    {/*/!*渲染表单区域*!/*/}
                    {/*<div className="nc-bill-form-area">*/}
                        {/*<NCScrollElement name={this.state.card.form.formName}>*/}
                            {/*{createForm(this.state.card.form.formId, this.state.card.form.action)}*/}
                        {/*</NCScrollElement>*/}
                    {/*</div>*/}
                    {/*/!*渲染子表区域*!/*/}
                    {/*{this.renderSubTables(this.addCardTableButton,this.modelSave,this.addCardTableOperateField)}*/}
                {/*</div>*/}

                <div className="nc-single-table" style={{display:this.state.openCard?'none':'block'}}>
                    <div className="nc-singleTable-header-area" >
                        <div className="header-title-search-area">
                            <h2 className="title-search-detail">供应商</h2>
                            <div className="title-search-detail">
                                {!this.state.openCard &&
                                <span className='showOff'>
                                    <NCCheckbox {...this.state.showoff}>{this.state.showoff.name}</NCCheckbox>
                                </span>
                                }
                            </div>
                        </div>
                        <div className="header-button-area">
                            {createButtonApp(this.state.buttonApps)}
                        </div>
                    </div>
                    <div className="nc-singleTable-search-area">
                        {NCCreateSearch(me.state.search.id, me.state.search)}
                    </div>
                    <div className="nc-singleTable-table-area">
                        {createSimpleTable(me.state.table.id, me.state.table)}
                    </div>
                </div>
                {ReactDOM.createPortal(<Dialog  {...getDialogConfig.call(this,'DeleteDialog')} ref={(DeleteDialog)=>{this.DeleteDialog=DeleteDialog;}}/>,document.body)}
                {ReactDOM.createPortal(<Dialog  {...getDialogConfig.call(this,'LinkmanDialog')} ref={(LinkmanDialog)=>{this.LinkmanDialog = LinkmanDialog}}/>,document.body)}
                {ReactDOM.createPortal(<Dialog  {...getDialogConfig.call(this,'BankAccDialog')} ref={(BankAccDialog)=>{this.BankAccDialog=BankAccDialog;}}/>,document.body)}
                {ReactDOM.createPortal(<Dialog  {...getDialogConfig.call(this,'AddressBook')} ref={(AddressBookDialog)=>{this.AddressBookDialog=AddressBookDialog;}}/>,document.body)}
            </div>
        )
    }
}

Main = createPage({
    initTemplate:{},
})(Main)
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65