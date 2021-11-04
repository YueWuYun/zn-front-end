//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools, print, high, getBusinessInfo, promptBox, cardCache,getMultiLang,createPageIcon,excelImportconfig,output} from 'nc-lightapp-front';
const { NCPopconfirm, NCIcon, NCDiv,NCTabs, NCCheckbox } = base;
let { setDefData, getDefData } = cardCache;
let cachKey = '10140PRJG_list';//缓存的标识
const NCTabPane = NCTabs.NCTabPane;
const { PrintOutput, ExcelImport} = high;
import AssignModal from '../assign/AssignModal';
import createUIDom from '../../../public/utils/BDCreateUIDom';

const pageId = '10140PRJG_list';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'head';                 //表头id
const oId = '1001ZP1000000001RCV5';     //查询区oid
const appid = '10140PRJG';   //注册按钮id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_project';           //列表主键
// const titleName = this.state.json['10140PRJB-000034'];			 //节点名称/* 国际化处理： 项目-集团*/
const queryListUrl = '/nccloud/uapbd/pmbase/ProjectListQuery.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/pmbase/ProjectQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/pmbase/ProjectDelete.do';                 //删除url
const enableUrl = '/nccloud/uapbd/pmbase/ProjectEnable.do';         //启用
const disableUrl = '/nccloud/uapbd/pmbase/ProjectDisable.do';       //停用
const addUrl = '/nccloud/uapbd/pmbase/ProjectAdd.do';           //新增
const validUrl = '/nccloud/uapbd/pmbase/ProjectValid.do';              //管控权限校验
const printUrl = '/nccloud/uapbd/pmbase/ProjectPrint.do';       //打印
const tableBtnAry = ["editline", "delline"];		//表格列操作按钮
const globalId = 'GLOBLE00000000000000';            //全局常量值

class List extends Component {
    constructor(props) {
        super(props);
        this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            checked: false,
            json:{}	
        };

        createUIDom(props)(
            {pagecode: props.pagecode_list},
            {moduleId: "10140PRJB",domainName: 'uapbd'},
            (data,langData) => {
                if(langData){
                    this.state.json = langData;
                }
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta, () => {
                            if (data.button) {
                                let button = data.button;
                                props.button.setButtons(button);
                                //全局时没有分配
                                props.nodeType == 'global' && props.button.setButtonVisible('assig',false);
                                props.button.setButtonDisabled(['delete', 'enable', 'disable', 'assig', 'unassig'], true);
                                props.button.setButtonDisabled(['delete', 'printGrp', 'print','output'], true);
                                props.button.setPopContent('delline', this.state.json['10140PRJB-000035']); /* '确认要删除该信息吗？' 设置操作列上删除按钮的弹窗提示 */
                                props.button.setPopContent('enableLine', this.state.json['10140PRJB-000015']);/* 国际化处理： 确认启用？*/
                                props.button.setPopContent('disableLine', this.state.json['10140PRJB-000016']);/* 国际化处理： 确认停用？*/

                                let excelimportconfig = excelImportconfig(props,'uapbd',props.billType,true,'',{appcode: props.appcode,pagecode: props.pagecode_card},()=>{
                                    if(this.props.billType==='project_org'){
                                        let queryInfo = this.props.search.getQueryInfo(this.searchId);
                                        if(!queryInfo['querycondition']) return;
                                        let flag = true;
                                        queryInfo['querycondition']['conditions'].map((obj)=>{
                                            if(obj['field']=='pk_org'){
                                                flag = false;
                                            }
                                        });
                                        if(flag) return;
                                    }
                                    this.loadData();
                                });
                                props.button.setUploadConfig("import",excelimportconfig);
                                props.button.setButtons(button);
                            }

                            let searchVal = getDefData("searchParams", cachKey);
                            if(searchVal && searchVal != false){
                                this.props.search.setSearchValue(searchId,searchVal.conditions);
                            }
                            if (searchVal && searchVal != false) {
                                this.loadData();
                            }
                        });
                    }
                }
            }
        )
    }

    componentDidMount() {
        // this.props.search.setDisabledByField(searchId,'pk_org',false);
    }

    modifierMeta = (props, meta) => {
        meta[searchId].items = meta[searchId].items.map((item, key) => {
            if (item.attrcode == 'pk_org') {
                // item.visible = 'true';
                item.queryCondition = {
                    // 'AppCode': props.appcode,
                    // GridRefActionExt: 'nccloud.web.uapbd.rateschema.action.PrimaryOrgSQLBuilderData',
                    'orgType': 'orgtype16'
                };
            }
            if(item.attrcode == 'pk_duty_org'){
                item.isMultiSelectedEnabled = true;
            }
            item.col = '3';
            if(item.attrcode === 'pk_projectclass'||item.attrcode === 'pk_eps'){
                item.isMultiSelectedEnabled = true;
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
                            // style={{ textDecoration: 'underline', cursor: 'pointer' }}
                            style={{color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                let searchVal = props.search.getAllSearchData(searchId);
                                cacheTools.set("searchParams", searchVal);
                                cacheTools.set('preid', record[pk_item].value);
                                cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));
                                props.pushTo(props.cardUrl, {
                                    // appcode: props.appcode,
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
            label: this.state.json['10140PRJB-000009'],/* 国际化处理： 操作*/
            itemtype:'customer',
            width: 200,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {

                // let btnArray = record['enablestate'].value==2?['editline','delline','disableLine']:['editline','delline','enableLine'];
                // 需求变更，卡片有停启用开关，列表行停启用先隐藏
                // 只能修改本级数据
                let btnArray = [];
                if (record['pk_org'].value == globalId && this.props.nodeType == 'global') {
                    btnArray = ['editline', 'delline'];
                }
                else if (record['pk_org'].value == record['pk_group'].value && this.props.nodeType == 'group') {
                    btnArray = ['editline', 'delline'];
                }
                else if (record['pk_org'].value != record['pk_group'].value && record['pk_org'].value!=globalId  && this.props.nodeType == 'org') {
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

    tableButtonClick = (props, id, text, record, index) => {
        switch (id) {

            case 'editline':
                props.pushTo(props.cardUrl, {
                    // appcode: props.appcode,
                    pagecode: props.pagecode_card,
                    status: 'edit',
                    id: record[pk_item].value
                })
                break;
            case 'delline':
                ajax({
                    url: validUrl,
                    data: {
                        pks: [record[pk_item].value],
                        nodeType: props.nodeType
                    },
                    success: (res) => {
                        ajax({
                            url: deleteUrl,
                            data: {
                                appCode: props.appcode,
                                nodeType: props.nodeType,
                                deleteinfo: [{
                                    id: record[pk_item].value,
                                    ts: record.ts.value
                                }]
                            },
                            success: (res) => {
                                if (res.success) {
                                    toast({ color: 'success', content: this.state.json['10140PRJB-000036'] });/* 国际化处理： 删除成功*/
                                    props.table.deleteTableRowsByIndex(tableId, index);
                                    let tableData = props.table.getAllTableData(tableId).rows;
                                    // if (tableData && tableData.length > 0) {
                                    //     props.button.setButtonDisabled(['printGrp', 'output'], false);
                                    // } else {
                                    //     props.button.setButtonDisabled(['printGrp', 'output'], true);
                                    // }
                                }
                            }
                        });
                    }
                })
                break;
            case 'enableLine':
                ajax({
                    url: validUrl,
                    data: {
                        pks: [record[pk_item].value],
                        nodeType: props.nodeType
                    },
                    success: (res) => {
                        promptBox({
                            color: "warning",
                            title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                            content: this.state.json['10140PRJB-000015'],/* 国际化处理： 确认启用？*/
                            beSureBtnClick: () => {

                                let rows = [];

                                if (record.enablestate.value == '3') {
                                    let row = {
                                        values: record
                                    }
                                    delete row.values.numberindex;
                                    delete row.values.key;
                                    rows.push(row);
                                }

                                let data = {
                                    model: { rows: rows }
                                }

                                ajax({
                                    url: enableUrl,
                                    data: data,
                                    success: (res) => {
                                        toast({ content: this.state.json['10140PRJB-000019'], title: this.state.json['10140PRJB-000037'] });/* 国际化处理： 启用成功,提示*/
                                        this.loadData();
                                    }
                                })
                            },
                            cancelBtnClick: () => {
                                return;
                            }
                        });
                    }
                })

                break;
            case 'disableLine':

                ajax({
                    url: validUrl,
                    data: {
                        pks: [record[pk_item].value],
                        nodeType: props.nodeType
                    },
                    success: (res) => {

                        promptBox({
                            color: "warning",
                            title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                            content: this.state.json['10140PRJB-000016'],/* 国际化处理： 确认停用？*/
                            beSureBtnClick: () => {

                                let rows = [];

                                if (record.enablestate.value == '2') {
                                    let row = {
                                        values: record
                                    }
                                    delete row.values.numberindex;
                                    delete row.values.key;
                                    rows.push(row);
                                }

                                let data = {
                                    model: { rows: rows }
                                }

                                ajax({
                                    url: disableUrl,
                                    data: data,
                                    success: (res) => {
                                        toast({ content: this.state.json['10140PRJB-000020'], title: this.state.json['10140PRJB-000037'] });/* 国际化处理： 停用成功,提示*/
                                        this.loadData(props);
                                    }
                                })
                            },
                            cancelBtnClick: () => {
                                return;
                            }
                        });
                    }
                })

                break;
            default:
                console.log(id, index);
                break;

        }
    }

    buttonClick(props, id) {
        let checkedRows = props.table.getCheckedRows(this.tableId);
        switch (id) {
            case 'add':
                ajax({
                    url: addUrl,
                    data: {
                        nodeType: this.props.nodeType
                    },
                    success: (res) => {
                        setDefData('listAddData',cachKey,res);
                        cacheTools.remove('preid');
                        props.pushTo(props.cardUrl, {
                            // appcode: props.appcode,
                            pagecode: props.pagecode_card,
                            status: 'add'
                        })
                    }
                })
                break;
            case 'editline':
                props.pushTo(props.cardUrl, {
                    // appcode: props.appcode,
                    pagecode: props.pagecode_card,
                    status: 'edit',
                    id: props.record[pk_item].value
                })
                break;
            case 'refresh':
                // this.refreshAction(props,true);
                this.loadData('refresh')
                break;
            case 'delete':
                promptBox({
                    color: "warning",
                    title: this.state.json['10140PRJB-000010'],/* 国际化处理： 删除*/
                    content: this.state.json['10140PRJB-000046'],/* 国际化处理： 确定要删除所选数据吗？*/
                    beSureBtnClick: this.deleteAction.bind(this)
                });
                break;
            case 'enable':
                promptBox({
                    color: "warning",
                    title: this.state.json['10140PRJB-000050'],/* 国际化处理： 注意*/
                    content: this.state.json['10140PRJB-000015'],/* 国际化处理： 确认启用？*/
                    beSureBtnClick: this.enableAction.bind(this)
                });
                break;
            case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            case 'disable':
                promptBox({
                    color: "warning",
                    title: this.state.json['10140PRJB-000051'],/* 国际化处理： 注意*/
                    content: this.state.json['10140PRJB-000016'],/* 国际化处理： 确认停用？*/
                    beSureBtnClick: this.disableAction.bind(this)
                });
                break;
            case 'assig':

                if (checkedRows == undefined || checkedRows.length == 0) {
                    toast({ 'color': 'danger', 'content': this.state.json['10140PRJB-000000'] })/* 国际化处理： 请勾选分配项目！*/
                } else {
                    this.assignAction('assign');
                }

                break;
            // case 'assig1':
            //     if(checkedRows == undefined || checkedRows.length == 0){
            //         toast({ 'color':'danger','content':'请勾选分配项目！'})
            //     }else{
            //         this.assignModal.show('assign');

            //     }
            //     break;
            case 'unassig':
                if (checkedRows == undefined || checkedRows.length == 0) {
                    toast({ 'color': 'danger', 'content': this.state.json['10140PRJB-000038'] })/* 国际化处理： 请勾选取消分配项目！*/
                } else {
                    this.assignAction('unassig');
                    // this.assignModal.show('unassig');
                }
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
            default:
                break;
        }
    }


    //打印
    onPrint = () => {

        let allData = this.props.table.getCheckedRows(tableId);
        let pks = [];

        if (allData.length === 0) {
            // toast({ content: this.state.json['10140PRJB-000017'], color: 'warning' });/* 国际化处理： 无可打印数据*/
            // allData = this.props.table.getAllTableData(tableId);
            pks = this.props.table.getAllTableData(tableId).allpks//如果没有勾选则默认打印查询出来的全部数据 NCCLOUD-204666
            // return;
        } else {
            var tableorder = this.props.table.getSortParam(tableId);
        
            allData.forEach((item, key) => {
                pks.push(item.data.values[pk_item].value);
            });
        }
        
        print(
            'pdf',
            printUrl,
            {
                funcode: this.props.printFunCode,//功能节点编码
                nodekey: this.props.printNodeKey,//模板节点编码
                userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`,
                oids: pks
            }
        )
    }
    //输出
    onOutput = () => {

        let allData = this.props.table.getAllTableData(tableId);
        if (allData.length === 0) {
            toast({ content: this.state.json['10140PRJB-000018'], color: 'warning' });/* 国际化处理： 无可输出的数据*/
            return;
        }
        var outorder = this.props.table.getSortParam(tableId);
        let pks = [];

        allData.rows.forEach((item, key) => {
            pks.push(item.values[pk_item].value);
        });
        let data = {
            funcode:this.props.printFunCode,//功能节点编码,  
            appcode:this.props.appcode,      //小应用编码
            nodekey:this.props.printNodeKey,     //模板节点标识
            userjson:`{order:${outorder  && outorder.sortParam[0].order},field:${outorder  && outorder.sortParam[0].field}}`,
            oids:pks,    // 功能节点的数据主键  oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
            outputType: 'output'
        }
        // this.setState({ids: pks}, () => {
        //     this.refs.printOutput.open()
        // })
        this.setState(this.state,() => {
            output({data: data,url:'/nccloud/uapbd/pmbase/ProjectPrint.do'})
        });
        
    }

    //分配、取消分配
    assignAction = (action) => {

        let data = this.props.table.getCheckedRows(tableId);

        if (data) {

            ajax({
                url: validUrl,
                data: {
                    pks: data.map((v) => {
                        return v.data.values[pk_item].value
                    }),
                    nodeType: this.props.nodeType
                },
                success: (res) => {
                    this.assignModal.show(action);
                }
            })
        }
    }
    //启用
    enableAction = () => {

        let curSels = this.props.table.getCheckedRows(tableId);

        let rows = [];

        let pks = [];

        curSels.map(row => {

            if (row.data.values.enablestate.value == '3') {

                rows.push(row.data);
                pks.push(row.data.values[pk_item].value);
            }
        })

        if (pks[0] && pks[0] != undefined) {

            ajax({
                url: validUrl,
                data: {
                    pks,
                    nodeType: this.props.nodeType
                },
                success: (res) => {

                    let data = {
                        model: { rows: rows }
                    }

                    ajax({
                        url: enableUrl,
                        data: data,
                        success: (res) => {
                            toast({ color: "success", title: this.state.json['10140PRJB-000019'] });/* 国际化处理： 启用成功*/
                            this.loadData();
                        }
                    })
                }
            })
        } else {
            toast({ color: "warning", content: this.state.json['10140PRJB-000039'] });/* 国际化处理： 没有可启用数据*/
        }
    }
    //停用
    disableAction = () => {
        let curSels = this.props.table.getCheckedRows(tableId);

        let rows = [];

        let pks = [];

        curSels.map(row => {

            if (row.data.values.enablestate.value == '2') {

                rows.push(row.data);
                pks.push(row.data.values[pk_item].value);
            }
        })

        if (pks[0] && pks[0] != undefined) {

            ajax({
                url: validUrl,
                data: {
                    pks,
                    nodeType: this.props.nodeType
                },
                success: (res) => {

                    let data = {
                        model: { rows: rows }
                    }

                    ajax({
                        url: disableUrl,
                        data: data,
                        success: (res) => {
                            toast({ color: "success", title: this.state.json['10140PRJB-000020'] });/* 国际化处理： 停用成功*/
                            this.loadData();
                        }
                    })
                }
            })
        } else {
            toast({ color: "warning", content: this.state.json['10140PRJB-000040'] });/* 国际化处理： 没有可停用数据*/
        }
    }

    doubleClick = (record, index, e) => {


        console.log(this.state.json['10140PRJB-000041']);/* 国际化处理： 双击*/
        console.log(this)
        let searchVal = this.props.search.getAllSearchData("search");
        cacheTools.set("searchParams", searchVal);
        cacheTools.get("searchParams");
        cacheTools.set('preid', this.props.getUrlParam('id'));
        this.props.pushTo(this.props.cardUrl, {
            // appcode: this.props.appcode,
            pagecode: this.props.pagecode_card,
            status: 'browse',
            id: record[pk_item].value
        });
    }

    deleteAction = () => {
        let data = this.props.table.getCheckedRows(tableId);

        ajax({
            url: validUrl,
            data: {
                pks: data.map((v) => {
                    return v.data.values[pk_item].value
                }),
                nodeType: this.props.nodeType
            },
            success: (res) => {

                let params = {
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
                        toast({ color: "success", content: this.state.json['10140PRJB-000036'] });/* 国际化处理： 删除成功*/
                        this.refreshAction(this.props);
                    }
                });
            }
        })
    }

    refreshAction = (props) => {

        this.loadData();
    }
    //查询区编辑后事件
    onSearchAfterEvent(field, val){
        //选择完责任组织后需要将其pk值给责任部门和责任人作为过滤条件
        if(field==='pk_org'){//pk_duty_org
            debugger
            let meta = this.props.meta.getMeta();
            let deptItem = meta[searchId].items.find((item)=>item.attrcode==='pk_duty_dept');
            deptItem.queryCondition=()=>{
                return {
                    pk_org:Array.isArray(val) ? val[0].refpk : val.refpk
                }
            }
            let psnItem = meta[searchId].items.find(item=>item.attrcode==='pk_dutier');
            psnItem.queryCondition=()=>{
                return {
                    pk_org:Array.isArray(val) ? val[0].refpk : val.refpk
                }
            }
            this.props.meta.setMeta(meta);
        }

    }
    pageInfoClick = (props, config, pks) => {

        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchVal = props.search.getAllSearchData(searchId);

        cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));

        let data = {
            "allpks": pks,
            "pageid": props.pagecode_list
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

        // console.log(searchVal);
        // cacheTools.set("hasSearched", 1);
        // cacheTools.set("searchParams", searchVal);
        // cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));

        setDefData("searchParams", cachKey, searchVal);

        this.loadData('search');
    }

    onCheckShowDisable() {

        // cacheTools.set('isChecked',!isChecked);
        this.setState(
            { checked: !this.state.checked },
            () => {
                this.loadData()
            }
        )

    }

    loadData(actionType) {

        let enablestate = {

            field: 'enablestate',
            oprtype: '\u003d',
            value: {
                firstvalue: '2',
                secondvalue: null
            }
        }

        let conditions = [];

        let searchVal = getDefData("searchParams", cachKey);

        // let searchVal = this.props.search.getAllSearchData(searchId);
        let isChecked = this.state.checked;
        if (isChecked == false) {

            // conditions = searchVal==null?[]:searchVal.conditions;
            conditions.push(enablestate);
        }



        //获取查询模板信息
        let queryInfo = this.props.search.getQueryInfo(this.searchId);
        if(!queryInfo['oid']) return;
        let OID = queryInfo.oid;
        let data = {
            // conditions: searchVal == null ? null : searchVal.conditions,
            querycondition: searchVal == null ? {} : searchVal,
            // custcondition: conditions,
            pageInfo: this.props.table.getTablePageInfo(tableId),
            pagecode: this.props.pagecode_list,
            queryAreaCode: searchId,  //查询区编码
            oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree',
            nodeType: this.props.nodeType,
            appCode: this.props.appcode,
            enablestate:isChecked
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if (res.data) {

                    this.props.table.setAllTableData(this.tableId, res.data[tableId]);
                    // this.props.button.setButtonDisabled(['printGrp', 'output'], false);
                    if(actionType === 'refresh'){
                        toast({ title: this.state.json['10140PRJB-000025'], color: "success" });/* 国际化处理： 刷新成功*/
                    }
                    if(actionType === 'search'){
                        var msg = this.state.json['10140PRJB-000047'] + res.data[tableId].rows.length + this.state.json['10140PRJB-000048']/* 国际化处理： 查询成功,共 , 条。*/
                        toast({content:msg,color:"success"});
                    }
                } else {
                    this.props.table.setAllTableData(this.tableId, { rows: [] });
                    // this.props.button.setButtonDisabled(['printGrp', 'output'], true);//勾选数据后才可用
                    toast({ content: this.state.json['10140PRJB-000042'], color: "warning" });/* 国际化处理： 无数据*/
                }
                this.props.button.setButtonDisabled(['delete', 'enable', 'disable', 'assig', 'unassig'], true);
                this.props.button.setButtonDisabled(['printGrp', 'print','output'], false)
                this.setState(this.state);
            }
        });
    }

    onRowClick = () => {
        this.props.button.setButtonDisabled(['delete', 'enable', 'disable', 'assig', 'unassig'], false);
        this.setState(this.state);
    }

    // selectedChange=()=>{
    //     let rows = this.props.table.getCheckedRows(tableId);
    //     if(rows && rows.length >0){
    //         this.props.button.setButtonDisabled(['delete'],false);
    //     }else{
    //         this.props.button.setButtonDisabled(['delete'],true);
    //     }
    // }

    onSelected = () => {
        let rows = this.props.table.getCheckedRows(tableId);
        if (rows && rows.length > 0) {
            // this.props.button.setButtonDisabled(['delete', 'enable', 'disable', 'assig', 'unassig'], false);

            let isEnable = rows.some((item, index, arr) => {
                return item.data.values['enablestate'].value == '2';
            });

            let isDisable = rows.some((item, index, arr) => {
                return item.data.values['enablestate'].value == '3';
            });

            this.props.button.setButtonDisabled({
                delete: false,
                assig: false,
                unassig: false,
                enable: isEnable,
                disable: isDisable
            });
            // this.props.button.setButtonDisabled(['printGrp','output'],false);
        } else {
            this.props.button.setButtonDisabled(['delete', 'enable', 'disable', 'assig', 'unassig'], true);
            // this.props.button.setButtonDisabled(['printGrp','output'],true);
        }
        this.setState(this.state);
    }
    // onSelectedAll=()=>{
    //     let rows = this.props.table.getCheckedRows(tableId);
    //     if(rows && rows.length >0){
    //         this.props.button.setButtonDisabled(['delete'],false);
    //     }else{
    //         this.props.button.setButtonDisabled(['delete'],true);
    //     }
    //     this.setState(this.state);
    // }
    render() {
        let { table, button, search, modal,BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let { createModal } = modal;
        let buttons = this.props.button.getButtons();
        // buttons = buttons.sort((a,b)=>{
        // 	return b.btnorder - a.btnorder;
        // });
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp, getButtons } = button;
        let nodeName = this.state.json['10140PRJB-000044'];/* 国际化处理： 项目-全局*/
        debugger
        if(this.props.appcode === '10140PRJG'){
            nodeName = this.state.json['10140PRJB-000034'];
        }
        if(this.props.appcode === '10140PRJO'){
            nodeName = this.state.json['10140PRJB-000045'];
        }
        return (<div className="nc-bill-list">
            <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                <div className='header-title-search-area'>
                    {/*createPageIcon ()*/}
                    {/*<h2 className='title-search-detail'>{nodeName}</h2>*/}
                    {createBillHeadInfo({
                                        title:nodeName,
                                        initShowBackBtn:false
                                    })}
                                    </div>
                <NCCheckbox onChange={this.onCheckShowDisable.bind(this)} checked={this.state.checked}>{this.state.json['10140PRJB-000043']}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                <div className="header-button-area">
                    {createButtonApp({
                        area: 'header-button-area',
                        buttonLimit: 3,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.header-button-area')

                    })}
                    {/* {buttons.map( (v) =>{
							return (createButton(v.btncode, {
								name: v.btnname,
								onButtonClick: this.buttonClick.bind(this),
								buttonColor: this.getButtonNames(v.btncode)
							}))
						})}  */}
                </div>
            </NCDiv>
            <div className="nc-bill-search-area">
                {NCCreateSearch(this.searchId, {
                    onAfterEvent:this.onSearchAfterEvent.bind(this),
                    clickSearchBtn: this.clickSearchBtn.bind(this)
                })}
            </div>
            {/* <div style={{ height: '10px' }}></div> */}
            <div className="nc-bill-table-area">
                {createSimpleTable(this.tableId, {
                    handlePageInfoChange: this.pageInfoClick.bind(this),
                    // tableModelConfirm: this.tableModelConfirm.bind(this),
                    showIndex: true,
                    showCheck: true,
                    onRowDoubleClick: this.doubleClick.bind(this),
                    onRowClick: this.onRowClick.bind(this),
                    // selectedChange:this.selectedChange.bind(this),
                    onSelected: this.onSelected.bind(this),
                    onSelectedAll: this.onSelected.bind(this),
                    dataSource: cachKey,//缓存的标识
                    pkname: 'pk_project',
                    componentInitFinished:()=>{
                        //缓存数据赋值成功的钩子函数
                        //若初始化数据后需要对数据做修改，可以在这里处理
                    }
                })}
            </div>
            {createModal('delete', {
                title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                content: this.state.json['10140PRJB-000013'],/* 国际化处理： 确认删除？*/
                beSureBtnClick: this.deleteAction.bind(this)
            })}
            <AssignModal ref={(item => this.assignModal = item)} {...{ 'gridId': this.tableId,json:this.state.json }} {...this.props} />
            <PrintOutput
                ref='printOutput'
                url={printUrl}
                data={{
                    funcode: this.props.printFunCode,//功能节点编码
                    nodekey: this.props.printNodeKey,//模板节点编码
                    oids: this.state.ids,
                    outputType: 'output'
                }}
            />
            <ExcelImport
                {...this.props}
                moduleName ='uapbd'//模块名
                billType = {this.props.billType}//单据类型
                selectedPKS = {[]}
                appcode={this.props.appcode}
                pagecode={this.props.pagecode_card}
            />
        </div>
        );
    }
}

List = createPage({
    initTemplate: []
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65