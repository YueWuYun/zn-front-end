//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools, print, high, getBusinessInfo, promptBox,getMultiLang, createPageIcon,excelImportconfig  } from 'nc-lightapp-front';
const { NCPopconfirm, NCIcon, NCTabs,NCDiv } = base;
const NCTabPane = NCTabs.NCTabPane;
const { PrintOutput,ExcelImport } = high;

const dataSource = 'uapbd.sminfo.payment.data'
const pageId = '10140PAYMG_list';        //pagecode
const searchId = 'searcharea';              //查询区id
const tableId = 'pk_group';                 //表头id
const oId = '1004Z01000000001GIFT';     //查询区oids
const appcode = '10140PAYMG';   //注册按钮id
const linkItem = 'code';        		//列表卡片跳转字段
const pk_item = 'pk_payment';           //列表主键
const queryListUrl = '/nccloud/uapbd/sminfo/PaymentListQuery.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/sminfo/PaymentQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/sminfo/PaymentDelete.do';                 //删除url
const printUrl = '/nccloud/uapbd/sminfo/PaymentPrint.do';                  //列表打印url
const validUrl = '/nccloud/uapbd/sminfo/PaymentValid.do';                   //权限校验
const qryUserInfoUrl = '/nccloud/uapbd/sminfo/PaymentLoginUserInfoQuery.do';//登录用户信息
const tableBtnAry = ["editline", "delline"];		//表格列操作按钮
//const titleName = state.json['10140PAYMG-000000'];			 //节点名称/* 国际化处理： 付款协议-集团*/
const globalId = 'GLOBLE00000000000000';            //全局常量值
//
// let initTemplate =(props) =>{
//
//     let _this = this;
// }




class List extends Component {
    constructor(props) {
        super(props);
        this.searchId = searchId;
        this.tableId = tableId;

        this.state = {
            json:{},
            context: {
                nodeType: props.nodeType,
                pk_org: '',
                pk_org_v: '',
                org_Name: '',
                org_v_Name: '',
                mdid: '',
                title:'',
                PermissionOrgIDs: []
            }
        }

       

    }

    initTemplate(props){
        props.createUIDom(
            {
                pagecode: props.pagecode_list//,//页面id
                // appid: props.appid//注册按钮的id
            },
            (data) => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        let context = data.context;
                        this.state.context = Object.assign(this.state.context, context);
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta, () => {

                            if (data.button) {
                                let button = data.button;
                                props.button.setButtonDisabled(['delete', 'printGrp', 'output'], true);
                                props.button.setButtons(button, () => {
                                    props.button.setPopContent('delline', this.state.json['10140PAYMG-000002']) /*国际化：确认要删除该信息吗？ 设置操作列上删除按钮的弹窗提示 */
                                });
                                let excelimportconfig = excelImportconfig(props,'uapbd',props.billType,true,'',{appcode: props.appcode,pagecode: props.pagecode_card},()=>{
                                    this.refreshAction(props);
                                });
                                props.button.setUploadConfig("import",excelimportconfig);
                            }

                            let hasSearched = cacheTools.get("hasSearched");
                            let searchVal = cacheTools.get("searchParams");
                            if (searchVal !== 'undefined' && searchVal && searchVal.conditions) {
                            } else {
                                searchVal = {
                                    conditions: [],
                                    logic: 'and'
                                }
                                this.state.context.nodeType === 'org' && searchVal.conditions.push({
                                    field: 'pk_org',
                                    value: {
                                        firstvalue: this.state.context.pk_org,
                                        secondvalue: ''
                                    },
                                    oprtype: '=',
                                    display: this.state.context.org_Name
                                });
                                this.props.search.setSearchValue(searchId, searchVal);
                            }
                            if (hasSearched && hasSearched === 1) {//hasSearched 为1表示有过查询，从缓存获取查询模板条件
                                if (searchVal && searchVal != false) {
                                    props.search.setSearchValue(searchId, searchVal.conditions);
                                }

                                //获取查询模板信息
                                let queryInfo = this.props.search.getQueryInfo(this.searchId);
                                let OID = queryInfo.oid;

                                let data = {
                                    querycondition: searchVal == null ? null : searchVal,
                                    pageInfo: cacheTools.get('pageInfo') ? cacheTools.get('pageInfo') : props.table.getTablePageInfo(tableId),
                                    pagecode: props.pagecode_list,
                                    queryAreaCode: searchId,  //查询区编码
                                    oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                                    querytype: 'tree',//simple改为tree
                                    nodeType: props.nodeType
                                };

                                ajax({
                                    url: queryListUrl,
                                    data,
                                    success: (res) => {
                                        if (res.data) {
                                            props.table.setAllTableData(tableId, res.data[tableId]);
                                            setTimeout(() => {
                                                props.button.setButtonDisabled(['printGrp', 'output'], false);
                                            }, 0)
                                        } else {
                                            props.button.setButtonDisabled(['printGrp', 'output'], true);
                                            toast({color: 'warning', content: this.state.json['10140PAYMG-000026']});/* 国际化处理： 未查询出符合条件的数据*/
                                        }
                                        
                                         //查询时执行显示公式前端适配
                                        if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                           props.dealFormulamsg(
                                                res.formulamsg,  //参数一：返回的公式对象
                                                {                //参数二：界面使用的表格类型
                                                    [tableId]:"table"
                                                }
                                            );
                                        }


                                        this.setState(this.state)
                                    },
                                    error: (res) => {
                                        console.log(res.message);
                                    }
                                });
                            }
                            else {
                                if (props.nodeType == 'group') {
                                    let businessInfo = getBusinessInfo();
                                    let pkGroup = businessInfo == null ? 'pkGroup' : businessInfo.groupId;
                                    props.search.setSearchValByField(searchId, 'pk_org', { value: pkGroup, display: this.state.json['10140PAYMG-000019'] })/* 国际化处理： 当前集团*/
                                }
                                props.table.setAllTableData(tableId, { rows: [] });
                            }

                            // setTimeout(() =>{
                            //     if (data.button) {
                            //         let button = data.button;
                            //         props.button.setButtonDisabled(['delete', 'printGrp', 'output'], true);
                            //         props.button.setButtons(button,()=>{
                            //             props.button.setPopContent('delline','确认要删除该信息吗？') /* 设置操作列上删除按钮的弹窗提示 */
                            //         });
                            //     }
                            // },0);
                        });

                    }

                }
            }
        )
    }
    //moved by wh 20181020 为了多语json对象能够饮用得到，由外部引入至类内部
    modifierMeta(props, meta) {

        // let businessInfo = getBusinessInfo();
        // let pkGroup = businessInfo.groupId;
    
        meta[searchId].items = meta[searchId].items.map((item, key) => {
    
            item.col = '3';
    
            if ((item.attrcode == 'pk_org')) {
    
                item.isMultiSelectedEnabled = true;
                if (props.nodeType == 'org') {
                    item.queryCondition = function () {
                        return {
                            AppCode: '10140PAYMO',
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder'
                        }
                    }
                }
                else {
                    item.queryCondition = function () {
                        return {
                            AppCode: '10140PAYMG',
                            TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder'
                        }
                    }
                }
            }
    
            return item;
        })
    
        meta[tableId].pagination = true;
        meta[tableId].items = meta[tableId].items.map((item, key) => {
            //item.width = 150;
            if (item.attrcode == linkItem) {
                item.render = (text, record, index) => {
                    return (
                        <span
                            style={{color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                let searchVal = props.search.getAllSearchData(searchId);
                                cacheTools.set("searchParams", searchVal);
                                cacheTools.set('preid', record[pk_item].value);
                                cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));
                                props.pushTo(props.cardUrl, {
                                    appcode: props.appcode,
                                    pagecode: props.pagecode_card,
                                    status: 'browse',
                                    id: record[pk_item].value//列表卡片传参
                                });
                            }}
                        >
                            {record && record[linkItem] && record[linkItem].value}
                        </span>
                    );
                };
            }
            return item;
        });
        //添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10140PAYMG-000001'],/* 国际化处理： 操作*/
            width: 200,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            itemtype: 'customer',
            render: (text, record, index) => {
    
                // 只能修改本级数据
                let btnArray = [];
                if (record['pk_org'].value == globalId && props.nodeType == 'global') {
                    btnArray = ['editline', 'delline'];
                }
                else if (record['pk_org'].value == record['pk_group'].value && props.nodeType == 'group') {
                    btnArray = ['editline', 'delline'];
                }
                else if (record['pk_org'].value != record['pk_group'].value && props.nodeType == 'org') {
                    btnArray = ['editline', 'delline'];
                }
    
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        });
        return meta;
    }

    //moved by wh 20181020 为了多语json对象能够饮用得到，由外部引入至类内部
    tableButtonClick(props, id, text, record, index) {
        switch (id) {
            case 'editline':
                this.valid(props,'edit', record, () => {
                    props.pushTo(props.cardUrl, {
                        appcode: props.appcode,
                        pagecode: props.pagecode_card,
                        status: 'edit',
                        id: record[pk_item].value
                    });
                })
                break;
            case 'delline':
                this.valid(props,'delete', record, () => {
                    ajax({
                        url: deleteUrl,
                        data:
                        {
                            pk_org: cacheTools.get('pk_org'),
                            deleteinfo: [
                                {
                                    id: record[pk_item].value,
                                    ts: record.ts.value
                                }
                            ]
                        },
                        success: (res) => {
                            if (res.success) {
                                toast({ color: 'success', title: this.state.json['10140PAYMG-000020'] });/* 国际化处理： 删除成功*/
                                props.table.deleteTableRowsByIndex(tableId, index);
                                let tableData = props.table.getAllTableData(tableId).rows;
                                if (tableData && tableData.length > 0) {
                                    props.button.setButtonDisabled(['printGrp', 'output'], false);
                                } else {
                                    props.button.setButtonDisabled(['printGrp', 'output'], true);
                                }
                            }
                        }
                    });
                })
                break;
            default:
                console.log(id, index);
                break;
    
        }
    }
    
    //moved by wh 20181020 为了多语json对象能够饮用得到，由外部引入至类内部
    //权限校验
    valid(props, operateCode='',record, callback) {
    
        let pks = [];
    
        if (record) {
    
            pks.push(record[pk_item].value);
        }
        else {
    
            let rows = props.table.getCheckedRows(tableId);
    
            if (rows.length === 0) {
                toast({ content: this.state.json['10140PAYMG-000021'], color: 'warning' });/* 国际化处理： 勾选操作数据*/
                return;
            }
    
            rows.forEach((item, key) => {
                pks.push(item.data.values[pk_item].value);
            });
        }
    
        let data = {
            pks,
            nodeType: props.nodeType,
            mdOperateCode:operateCode
        }
        ajax({
            url: validUrl,
            data,
            success: (res) => {
                callback && callback();
            }
        })
    }

    componentDidMount() {
        //add wh 20181020 多语引用的json文件
        let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
                    this.initTemplate(this.props)
                    if(this.props.nodeType == 'group'){
                        this.state.context.title = this.state.json['10140PAYMG-000000']
                    }else{
                        this.state.context.title = this.state.json['10140PAYMG-000014']
                    }
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
        this.props.MultiInit.getMultiLang({moduleId: '10140PAYMG', domainName: 'uapbd',callback})
        // UE 要求打印下拉只有输出，确认规范后按钮注册再改。！！！
        this.props.button.setButtonsVisible({
            'print': false
        });
    }

    buttonClick(props, id) {
        switch (id) {
            case 'add':
                props.pushTo(props.cardUrl, {
                    appcode: props.appcode,
                    pagecode: props.pagecode_card,
                    status: 'add'
                })
                cacheTools.remove('preid');

                break;
            // case 'editline':
            //     debugger;
            //     this.valid(props,()=>{props.linkTo(props.cardUrl,{
            //         appcode:props.appcode,
            //         pagecode:props.pagecode_card,
            //         status:'edit',
            //         id: props.record[pk_item].value
            //     });
            //     })
            //     break;
            case 'refresh':
                this.refreshAction(props);
                break;
            case 'delete':
                this.valid(props, 'delete',null, () => { 
                    // props.modal.show('delete'); 
                    promptBox({
                        color:'warning',
                        title: this.state.json['10140PAYMG-000015'],/* 国际化处理： 注意*/
                        content: this.state.json['10140PAYMG-000016'],/* 国际化处理： 确认删除？*/
                        beSureBtnClick: this.deleteAction.bind(this)
                    })
                })
                break;
            case 'printGrp':
                this.onPrint();
                break;
            case 'print':
                this.onPrint();
                break;
            case 'output':
                this.onOutput();
                break;
            case 'export':
			console.log('export');
			this.props.modal.show('exportFileModal');
			break;
            default:
                break;
        }
    }

    // 行选中事件
    onSelected = () => {
        let rows = this.props.table.getCheckedRows(tableId);
        if (rows && rows.length > 0) {
            this.props.button.setButtonDisabled(['delete'], false);
        } else {
            this.props.button.setButtonDisabled(['delete'], true);
        }
        this.setState(this.state);
    }

    //打印
    onPrint = () => {

        let allData = this.props.table.getAllTableData(tableId);

        if (allData.length === 0) {
            toast({ content: this.state.json['10140PAYMG-000007'], color: 'warning' });/* 国际化处理： 无可打印数据*/
            return;
        }

        let pks = [];

        allData.rows.forEach((item, key) => {
            pks.push(item.values[pk_item].value);
        });
        print(
            'pdf',
            printUrl,
            {
                appcode: this.props.printFunCode,
                funcode: this.props.printFunCode,//功能节点编码
                nodekey: this.props.printNodeKey,//模板节点编码
                oids: pks
            }
        )
    }
    //输出
    onOutput = () => {

        let allData = this.props.table.getAllTableData(tableId);
        if (allData.length === 0) {
            toast({ content: this.state.json['10140PAYMG-000008'], color: 'warning' });/* 国际化处理： 无可输出的数据*/
            return;
        }
        let pks = [];

        allData.rows.forEach((item, key) => {
            pks.push(item.values[pk_item].value);
        });
        this.setState({
            ids: pks
        }, this.refs.printOutput.open());
    }

    doubleClick = (record, index, e) => {


        console.log(this.state.json['10140PAYMG-000022']);/* 国际化处理： 双击*/
        console.log(this)
        let searchVal = this.props.search.getAllSearchData(searchId);
        cacheTools.set("searchParams", searchVal);
        cacheTools.get("searchParams");
        cacheTools.set('preid', this.props.getUrlParam('id'));
        this.props.pushTo(this.props.cardUrl, {
            appcode: this.props.appcode,
            pagecode: this.props.pagecode_card,
            status: 'browse',
            id: record[pk_item].value
        });
    }

    deleteAction = () => {
        let data = this.props.table.getCheckedRows(tableId);
        let params = {
            pk_org: cacheTools.get('pk_org'),
            deleteinfo: data.map((v) => {
                let id = v.data.values[pk_item].value;
                let ts = v.data.values.ts.value;
                return {
                    id, ts
                }
            })
        }
        ajax({
            url: deleteUrl,
            data: params,
            success: (res) => {
                this.props.button.setButtonDisabled('delete', true);
                toast({ color: "success", content: this.state.json['10140PAYMG-000020'] });/* 国际化处理： 删除成功*/
                this.refreshAction(this.props, true);
            }
        });
    }

    refreshAction = (props, isRefresh=false) => {
        let searchVal = props.search.getAllSearchData(searchId);
        if (searchVal != false) {
            //获取查询模板信息
            let queryInfo = this.props.search.getQueryInfo(this.searchId);
            let OID = queryInfo.oid;

            let data = {
                querycondition: searchVal == null ? null : searchVal,
                pageInfo: props.table.getTablePageInfo(tableId),
                pagecode: props.pagecode_list,
                queryAreaCode: searchId,  //查询区编码
                oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype: 'tree',//simple改为tree
                nodeType: props.nodeType
            };

            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);
                    if (res.data) {
                        props.table.setAllTableData(tableId, res.data[tableId]);
                        props.button.setButtonDisabled(['printGrp', 'output'], false);
                       
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                        props.button.setButtonDisabled(['printGrp', 'output'], true);
                        
                    }

                    //查询时执行显示公式前端适配
                 if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            [tableId]:"table"
                        }
                    );
                 }

                    //刷新后删除按钮要置灰
                    props.button.setButtonDisabled('delete', true);
                    if(isRefresh) return;
                    toast({ color: 'success', title: this.state.json['10140PAYMG-000023'] });/* 国际化处理： 刷新成功*/
                },
                error: (res) => {
                    console.log(res.message);
                }
            });
        }
    }

    pageInfoClick = (props, config, pks) => {

        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchVal = props.search.getAllSearchData(searchId);

        cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));

        let data = {
            pk_org: cacheTools.get('pk_org'),
            allpks: pks,
            pageid: props.pagecode_list,
            nodeType: props.nodeType
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: queryPageUrl,
            data: data,
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
    }

    clickSearchBtn = (props, searchVal) => {

        console.log(searchVal);

        searchVal.conditions.map((cond) => {
            if (cond.field == 'pk_org') {
                //集团节点初始化时会在查询区默认为当前集团，但是没初始化好时，getBusinessInfo 获取不到，所以pk_org赋值为‘pkGroup’，此处再取一次
                if (props.nodeType == 'group' && cond.value.firstvalue == 'pkGroup') {
                    let businessInfo = getBusinessInfo();
                    let pkGroup = businessInfo == null ? null : businessInfo.groupId;
                    cond.value.firstvalue = pkGroup;
                }
                cacheTools.set('pk_org', cond.value.firstvalue);
            }
        })
        cacheTools.set("hasSearched", 1);
        cacheTools.set("searchParams", searchVal);
        cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));
        let metaData = props.meta.getMeta();

        //获取查询模板信息
        let queryInfo = this.props.search.getQueryInfo(this.searchId);
        let OID = queryInfo.oid;

        let data = {
            querycondition: searchVal == null ? null : searchVal,
            pageInfo: props.table.getTablePageInfo(tableId),
            pagecode: props.pagecode_list,
            queryAreaCode: searchId,  //查询区编码
            oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree',//simple改为tree
            nodeType: props.nodeType
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if (res.data) {
                    props.table.setAllTableData(this.tableId, res.data[tableId]);
                    props.button.setButtonDisabled(['printGrp', 'output'], false);
                    toast({color: 'success', content: this.state.json['10140PAYMG-000024']+res.data[tableId].allpks.length+this.state.json['10140PAYMG-000025']});/* 国际化处理： 查询成功，共,条。*/
                } else {
                    props.table.setAllTableData(this.tableId, { rows: [] });
                    props.button.setButtonDisabled(['printGrp', 'output'], true);
                    toast({color: 'warning', content: this.state.json['10140PAYMG-000026']});/* 国际化处理： 未查询出符合条件的数据*/
                }
                 //查询时执行显示公式前端适配
                 if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            [tableId]:"table"
                        }
                    );
                }
                this.setState(this.state);
            },
            error: (res) => {
                console.log(res.message);
            }
        });
    }

    render() {
        let { table, button, search, modal,BillHeadInfo } = this.props;
        let { createModal } = modal;
        let buttons = this.props.button.getButtons();
        // buttons = buttons.sort((a,b)=>{
        //     return b.btnorder - a.btnorder;
        // });
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp, getButtons } = button;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        return (<div className="nc-bill-list">
            <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                <div className='header-title-search-area'>
                    {createBillHeadInfo({ 
                        title:this.state.context.title,
                        initShowBackBtn:false
                    })}
                </div>
                <div className="header-button-area">
                    {createButtonApp({
                        area: 'header-button-area',
                        buttonLimit: 3,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.header-button-area')

                    })}
                </div>
            </NCDiv>
            <div className="nc-bill-search-area" fieldid='nc-bill_searchId'>
                {NCCreateSearch(this.searchId, {
                    clickSearchBtn: this.clickSearchBtn.bind(this)
                })}
            </div>
            {/* <div style={{height:'10px'}}></div> */}
            <div className="nc-bill-table-area" fieldid='nc-bill_tableId'>
                {createSimpleTable(this.tableId, {
                    handlePageInfoChange: this.pageInfoClick,
                    tableModelConfirm: this.tableModelConfirm,
                    dataSource: dataSource,
                    pkname: pk_item,
                    showIndex: true,
                    showCheck: true,
                    onRowDoubleClick: this.doubleClick.bind(this),
                    onSelected: this.onSelected.bind(this),
                    onSelectedAll: this.onSelected.bind(this)
                })}
            </div>
            {/* 样式不对已经废弃 */}
            {createModal('delete', {
                title: this.state.json['10140PAYMG-000015'],/* 国际化处理： 注意*/
                content: this.state.json['10140PAYMG-000016'],/* 国际化处理： 确认删除？*/
                beSureBtnClick: this.deleteAction.bind(this)
            })}

            <PrintOutput
                ref='printOutput'
                url={printUrl}
                data={{
                    appcode: this.props.appcode,
                    funcode: this.props.printFunCode,//功能节点编码
                    nodekey: this.props.printNodeKey,//模板节点编码
                    oids: this.state.ids,
                    outputType: 'output'
                }}
            />
            <ExcelImport
                {...Object.assign(this.props)}
                moduleName ='uapbd'//模块名,
                billType = {this.props.billType} //单据类型
                selectedPKS = {[]}
                appcode={this.props.appcode} 
                pagecode = {this.props.pagecode_card}
            />
        </div>
        );
    }
}

List = createPage({
    billinfo:[{
        billtype: 'grid',
        pagecode: pageId,
        bodycode: tableId //headcode: tableId
    }],
	initTemplate: [],
	mutiLangCode: '10140PAYMG'
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65