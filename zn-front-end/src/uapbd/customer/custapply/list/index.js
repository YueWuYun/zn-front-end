//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表
// 注意：url里面传pk值时，得写成id:pk，不然翻页会报错

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cardCache, print, high, promptBox, createPageIcon } from 'nc-lightapp-front';
const { NCPopconfirm, NCIcon, NCTabs,NCDiv} = base;
const NCTabPane = NCTabs.NCTabPane;
const { PrintOutput, ApproveDetail, ApprovalTrans } = high;
const { setDefData, getDefData } = cardCache;

// import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';

const pageId = '10140CUSTPF_custpflist';        //pagecode
const searchId = 'searcharea';              //查询区id
const tableId = 'customerpf';                 //表头id
const oId = '1002Z010000000001EXS';     //查询区oid
const appid = '10140CUSTPF';   //注册按钮id
const linkItem = 'billnumber';        		//列表卡片跳转字段
const pk_item = 'pk_customerpf';           //列表主键
const queryListUrl = '/nccloud/uapbd/customer/CustApplyListQuery.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/customer/CustApplyQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/customer/CustApplyDelete.do';                 //删除url
const printUrl = '/nccloud/uapbd/customer/CustApplyPrint.do';                   //打印url
const commitUrl = '/nccloud/uapbd/customer/CustApplyCommit.do' //提交
const callbackUrl = '/nccloud/uapbd/customer/CustApplyCallback.do' //收回
const validUrl = '/nccloud/uapbd/customer/CustApplyValid.do'//权限校验
// const tableBtnAry = ["editline","delline"];		//表格列操作按钮
// const carUrl = '/uapbd/customer/custapply/card/index.html';
const carUrl = '/card';
const pagecode_card = '10140CUSTPF_custpfcard';
const printFunCode = '10140CUSTPF';    //有打印模板的小应用编码
const printNodeKey = 'custpflist';    //模板节点标识
const dataSource = 'uapbd.customer.custapply.cache' //缓存区id

class List extends Component {
    constructor(props) {
        super(props);
        this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            compositedata: null,
            compositedisplay: false,
            approveDetailShow: false,
            billid: null,
            json: {}
        };

    }

    initTemplate(props) {
        props.createUIDom(
            {
                pagecode: pageId//,//页面id
                // appcode: appid//注册按钮的id
            },
            (data) => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta, () => {
                            if (data.context) {
                                if (data.context.pk_org && data.context.org_Name) {
                                    props.search.setSearchValByField(searchId, "pk_org", { value: data.context.pk_org ? data.context.pk_org : null, display: data.context.org_Name ? data.context.org_Name : null });
                                }
                            }
                        });
                        let hasSearched = getDefData("hasSearched", dataSource);
                        let searchVal = getDefData("searchParams", dataSource);
                        console.log(this.state.json['10140CUSTPF-000035'])/* 国际化处理： 缓存查询条件*/
                        console.log(searchVal);
                        if (hasSearched && hasSearched === 1) {//hasSearched 为1表示有过查询，从缓存获取查询模板条件
                            // searchVal.map((v)=>{
                            // 	props.search.setSearchValByField('searchArea',v.field,v.display);
                            // 	return v;
                            // })
                            if (searchVal && searchVal != false) {
                                props.search.setSearchValue(searchId, searchVal.querycondition.conditions);
                            }

                            //获取查询模板信息
                            let queryInfo = props.search.getQueryInfo(searchId);
                            let OID = queryInfo.oid;

                            let data = {
                                querycondition: { conditions: searchVal == null ? null : searchVal.querycondition.conditions },
                                // ...searchVal,
                                pageInfo: getDefData('pageInfo', dataSource) ? getDefData('pageInfo', dataSource) : props.table.getTablePageInfo(tableId),
                                // {
                                // 	pageIndex: 0,
                                // 	pageSize: 10,
                                // 	total: 0,
                                // 	totalPage: 0
                                // },
                                pagecode: pageId,
                                queryAreaCode: searchId,  //查询区编码
                                oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                                querytype: 'tree'
                            };

                            ajax({
                                url: queryListUrl,
                                data,
                                success: (res) => {
                                    if (res.data) {
                                        props.table.setAllTableData(tableId, res.data[tableId]);
                                    } else {
                                        toast({ content: this.state.json['10140CUSTPF-000036'], color: "warning" });/* 国际化处理： 无数据*/
                                    }
                                },
                                error: (res) => {
                                    console.log(res.message);
                                }
                            });
                        }
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setButtonVisible(['Commit', 'Print'], false);//下拉不在重复出现提交打印按钮
                        props.button.setButtonDisabled(['delete', 'CommitGrp', 'Callback', 'PrintGrp', 'Output'], true);
                        props.button.setPopContent('delline', this.state.json['10140CUSTPF-000052']) /* 设置操作列上删除按钮的弹窗提示 */
                    }
                }
            }
        )
    }

    componentDidMount() {
        let callback = (json, status, inlt) => {
            if (status) {
                this.setState({ json, inlt }, () => {
                    this.initTemplate(this.props)
                })       // 保存json和inlt到页面state中并刷新页面
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: '10140CUSTPF', domainName: 'uapbd', callback })
    }


    modifierMeta = (props, meta) => {
        meta[searchId].items = meta[searchId].items.map((item, key) => {
            if (item.attrcode == 'pk_org') {
                // item.queryCondition = {
                //     "AppCode": appid,
                //     TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                // };
                item.isShowDisabledData = true;
            } else if (item.attrcode == 'customerorg') {
                item.isShowDisabledData = true;
                item.isMultiSelectedEnabled = true;
            } else if (item.attrcode == 'pk_custclass') {
                item.isShowDisabledData = true;
                item.isMultiSelectedEnabled = true;
                item.isShowUnit = true;
            }
            item.col = '3';
            return item;
        })
        meta[tableId].pagination = true;
        meta[tableId].items = meta[tableId].items.map((item, key) => {
            //item.width = 150;
            if (item.attrcode == linkItem) {
                item.render = (text, record, index) => {
                    return (
                        <span
                            style={{ color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                let searchVal = props.search.getQueryInfo(searchId);
                                setDefData('searchParams', dataSource, searchVal);
                                setDefData('preid', dataSource, record[pk_item].value);
                                setDefData('pageInfo', dataSource, props.table.getTablePageInfo(tableId));
                                props.pushTo(carUrl, {
                                    pagecode: pagecode_card,
                                    appcode: appid,
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
            itemtype: 'customer',
            attrcode: 'opr',
            label: this.state.json['10140CUSTPF-000019'],/* 国际化处理： 操作*/
            width: 200,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                //自由态单据修改删除，非自由态为审批详情
                let tableBtnAry = record.approvestate.value == '-1' ? ['editline', 'delline'] : ['approveinfo']

                return props.button.createOprationButton(
                    tableBtnAry,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )

                // return (
                //     <span>
                // 		{/* <NCIcon
                // 			type="uf-pencil-s"
                // 			onClick={() => {
                // 				props.linkTo('../card/index.html', {
                // 					status: 'edit',
                // 					id: record.crevecontid.value
                // 				});
                // 			}}
                // 		/> */}
                //         <span
                //             style={{cursor: 'pointer' }}
                //             onClick={() => {
                //                 props.pushTo(carUrl, {
                //                     pagecode: pagecode_card,
                //                     appcode: appid,
                //                     status: 'edit',
                //                     [pk_item]: record[pk_item].value
                //                 });
                //             }}
                //         >
                // 			修改
                // 		</span><span>&nbsp; &nbsp;</span>
                // 		<NCPopconfirm
                //             trigger="click"
                //             placement="top"
                //             content='确定删除？'
                //             onClose={() => {
                //                 ajax({
                //                     url: deleteUrl,
                //                     data: {
                //                         pk_org:getDefData('pk_org',dataSource),
                //                         deleteinfo:[{
                //                             pk_org:record.pk_org.value,
                //                             id: record[pk_item].value,
                //                             ts: record.ts.value
                //                         }]},
                //                     success: (res) => {
                //                         if (res.success) {
                //                             toast({ color: 'success', content: '删除成功' });
                //                             props.table.deleteTableRowsByIndex(tableId, index);
                //                         }
                //                     }
                //                 });
                //             }}
                //         >
                // 			<span style={{cursor: 'pointer' }}>删除</span>
                // 		</NCPopconfirm>
                // 	</span>
                // );
            }
        });
        return meta;
    }

    tableButtonClick = (props, id, text, record, index) => {
        switch (id) {
            case 'editline':
                this.valid(props, record, 'edit', (codeedit, vbillnumedit) => {
                    props.pushTo(carUrl, {
                        pagecode: pagecode_card,
                        appcode: appid,
                        status: 'edit',
                        codeedit: codeedit,
                        vbillnumedit: vbillnumedit,
                        id: record[pk_item].value
                    })
                })

                break;
            case 'delline':
                ajax({
                    url: deleteUrl,
                    data:
                    {
                        pk_org: getDefData('pk_org', dataSource),
                        deleteinfo: [
                            {
                                pk_org: record.pk_org.value,
                                id: record[pk_item].value,
                                ts: record.ts.value
                            }
                        ]
                    },
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', content: this.state.json['10140CUSTPF-000038'] });/* 国际化处理： 删除成功*/
                            props.table.deleteTableRowsByIndex(tableId, index);
                        }
                    }
                });
                break;
            case 'approveinfo':
                // this.openApprove(record[pk_item].value);
                this.setState({
                    approveDetailShow: true,
                    billid: record[pk_item].value
                });
                break;
            default:
                console.log(id, index);
                break;

        }
    }

    //权限校验
    valid = (props, record, action, callback) => {

        let pk = record[pk_item].value;

        let data = {
            pk,
            action
        }
        ajax({
            url: validUrl,
            data,
            success: (res) => {
                let codeedit = res && res.data ? res.data.codeedit : true
                let vbillnumedit = res && res.data ? res.data.vbillnumedit : true
                callback && callback(codeedit, vbillnumedit);
            }
        })
    }

    // getButtonNames = (codeId) => {
    //     if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
    //         return 'main-button'
    //     }else {
    //         return 'secondary - button'
    //     }
    // };

    buttonClick(props, id) {
        let allData = props.table.getAllTableData(tableId);
        let checkedData = props.table.getCheckedRows(tableId);
        switch (id) {
            case 'add':
                props.pushTo(carUrl, {
                    pagecode: pagecode_card,
                    appcode: appid,
                    status: 'add'
                })
                // cacheTools.remove('preid');
                let preid = '';
                if (checkedData && checkedData[0]) {
                    preid = checkedData[0].data.values[pk_item].value
                }
                else if (allData && allData.rows[0]) {
                    preid = allData.rows[0].values[pk_item].value
                }
                setDefData('preid', dataSource, preid);
                debugger;
                break;
            case 'refresh':
                this.refreshAction(props);
                break;
            case 'delete':
                // this.props.modal.show('delete');
                promptBox({
                    color: "warning",
                    title: this.state.json['10140CUSTPF-000022'],/* 国际化处理： 确认删除*/
                    content: this.state.json['10140CUSTPF-000039'],/* 国际化处理： 您确定要删除所选数据吗?*/
                    beSureBtnClick: this.deleteAction.bind(this)
                })
                break;
            case 'CommitGrp':
                this.pfProcess(commitUrl);
                break;
            case 'Commit':
                this.pfProcess(commitUrl);
                break;
            case 'Callback':
                this.pfProcess(callbackUrl);
                break;
            case 'PrintGrp':
                this.onPrint();
                break;
            case 'Print':
                this.onPrint();
                break;
            case 'Output':
                this.onOutput();
                break;
            default:
                break;
        }
    }

    //提交、收回 操作
    pfProcess(url, content) {

        let billstate = ['-1'];

        if (url == commitUrl) {

            billstate = ['-1'];
        } else if (url == callbackUrl) {

            billstate = ['1', '3'];
        }

        let curSels = this.props.table.getCheckedRows(tableId);

        let pks = [];

        curSels.map(row => {

            if (billstate.indexOf(row.data.values.approvestate.value) >= 0) {

                pks.push(row.data.values[pk_item].value);
            }
        })

        if (pks.length == 0) {
            toast({ content: this.state.json['10140CUSTPF-000040'], color: 'warning' });/* 国际化处理： 没有可操作数据*/
            return;
        }

        let finalData = {
            pks,
            content
        }
        ajax({
            url,
            data: finalData,
            success: res => {
                if (url == commitUrl) {
                    if (res.data.workflow && (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
                        this.setState({
                            compositedata: res.data,
                            compositedisplay: true
                        });
                    } else {
                        toast({ color: 'success', content: this.state.json['10140CUSTPF-000041'] });/* 国际化处理： 提交成功！*/
                        this.setState({
                            compositedata: null,
                            compositedisplay: false
                        });
                        this.refreshAction(this.props, false);
                    }
                    // toast({content:'提交成功',color:'success'});
                }
                else if (url == callbackUrl) {
                    toast({ content: this.state.json['10140CUSTPF-000021'], color: 'success' });/* 国际化处理： 单据已成功收回*/
                    this.refreshAction(this.props, false);
                }
            }
        })
    }

    getAssginUsedr = (value) => {
        this.pfProcess(commitUrl, value);
    }

    turnOff = () => {
        this.setState({
            compositedata: null,
            compositedisplay: false
        });
    }

    //打印
    onPrint = () => {

        let allData = this.props.table.getAllTableData(tableId);

        if (!allData || allData.length === 0 || allData.rows.length === 0) {
            toast({ content: this.state.json['10140CUSTPF-000029'], color: 'warning' });/* 国际化处理： 无可打印数据*/
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
                funcode: printFunCode,//功能节点编码
                nodekey: printNodeKey,//模板节点编码
                oids: pks
            }
        )
    }
    //输出
    onOutput = () => {

        let allData = this.props.table.getAllTableData(tableId);
        if (!allData || allData.length === 0 || allData.rows.length === 0) {
            toast({ content: this.state.json['10140CUSTPF-000042'], color: 'warning' });/* 国际化处理： 无可输出的数据*/
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
        debugger

        console.log(this.state.json['10140CUSTPF-000043']);/* 国际化处理： 双击*/
        console.log(this)
        let searchVal = this.props.search.getQueryInfo(searchId);//this.props.search.getAllSearchData(searchId);
        setDefData("searchParams", dataSource, searchVal);
        setDefData('preid', dataSource, record[pk_item].value);
        this.props.pushTo(carUrl, {
            pagecode: pagecode_card,
            appcode: appid,
            status: 'browse',
            id: record[pk_item].value
        });
    }

    deleteAction = () => {
        let data = this.props.table.getCheckedRows(tableId);
        console.log(data)
        let params = {
            pk_org: getDefData('pk_org', dataSource),
            deleteinfo: data.map((v) => {
                let pk_org = v.data.values.pk_org.value;
                let id = v.data.values[pk_item].value;
                let ts = v.data.values.ts.value;
                return {
                    pk_org, id, ts
                }
            })
        }
        console.log(params)
        ajax({
            url: deleteUrl,
            data: params,
            success: (res) => {
                toast({ color: "success", content: this.state.json['10140CUSTPF-000038'] });/* 国际化处理： 删除成功*/
                this.refreshAction(this.props, false);
            }
        });
    }

    refreshAction = (props, showInfo = true) => {
        let searchVal = props.search.getAllSearchData(searchId);
        console.log(searchVal);
        if (searchVal != false) {

            //获取查询模板信息
            let queryInfo = props.search.getQueryInfo(searchId);
            let OID = queryInfo.oid;

            let data = {
                ...queryInfo,
                pageInfo: props.table.getTablePageInfo(tableId),
                // {
                //     pageIndex: 0,
                //     pageSize: 10,
                //     total: 0,
                //     totalPage: 0
                // },
                pagecode: pageId,
                queryAreaCode: searchId,  //查询区编码
                oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype: 'tree'
            };

            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);
                    if (res.data) {
                        props.table.setAllTableData(tableId, res.data[tableId]);
                        if (showInfo) {
                            toast({ color: 'success', title: this.state.json['10140CUSTPF-000026'] })/* 国际化处理： 刷新成功！*/
                        }
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                        if (showInfo) {
                            toast({ content: this.state.json['10140CUSTPF-000036'], color: "warning" });/* 国际化处理： 无数据*/
                        }
                    }
                    this.props.button.setButtonDisabled(['delete', 'CommitGrp', 'Callback', 'PrintGrp', 'Output'], true);
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

        setDefData('pageInfo', dataSource, props.table.getTablePageInfo(tableId));

        let data = {
            'pk_org': getDefData('pk_org', dataSource),
            'allpks': pks,
            'pageid': pageId
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
        // debugger;
        // searchVal.conditions.map((cond)=>{
        //     if(cond.field == 'pk_org'){
        //         cacheTools.set('pk_org',cond.value.firstvalue);
        //     }
        // })
        setDefData("hasSearched", dataSource, 1);
        setDefData('pageInfo', dataSource, props.table.getTablePageInfo(tableId));
        let metaData = props.meta.getMeta();

        //获取查询模板信息
        let queryInfo = props.search.getQueryInfo(searchId);
        let OID = queryInfo.oid;
        let finalSearchVal = { ...queryInfo }
        finalSearchVal.querycondition.conditions = searchVal.conditions

        setDefData("searchParams", dataSource, queryInfo);

        let data = {
            ...queryInfo,
            pageInfo: props.table.getTablePageInfo(tableId),
            // {
            //     pageIndex: 0,
            //     pageSize: 10,
            //     total: 0,
            //     totalPage: 0
            // },
            pagecode: pageId,
            queryAreaCode: searchId,  //查询区编码
            oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if (res.data) {
                    props.table.setAllTableData(this.tableId, res.data[tableId]);
                    let count = res.data[this.tableId].allpks.length;
                    toast({ content: this.state.json['10140CUSTPF-000045'] + count + this.state.json['10140CUSTPF-000046'], color: 'success' })/* 国际化处理： 已成功！,查询成功，共,条。*/
                } else {
                    props.table.setAllTableData(this.tableId, { rows: [] });
                    toast({ content: this.state.json['10140CUSTPF-000047'], color: "warning" });/* 国际化处理： 未查询出符合条件的数据。*/
                }
            },
            error: (res) => {
                console.log(res.message);
            }
        });
    }

    // 列表勾选事件
    onSelected = () => {
        let rows = this.props.table.getCheckedRows(tableId);
        let canCommit = true;
        let canCallBack = true;
        if (rows && rows.length > 0) {

            this.props.button.setButtonDisabled(['delete', 'PrintGrp', 'Output'], false);

            rows.forEach((row, key) => {
                if (row.data.values.approvestate.value == -1) {//自由
                    canCommit = false;
                }
                if (row.data.values.approvestate.value == 3) {//已提交
                    canCallBack = false;
                }
            })

            //特殊处理一下审批通过的收回操作
            if (rows[0].data.values.approvestate.value == 1) {
                canCallBack = false;
            }

            this.props.button.setButtonDisabled(['CommitGrp'], canCommit);
            this.props.button.setButtonDisabled(['Callback'], canCallBack);
        }
        else {
            this.props.button.setButtonDisabled(['delete', 'CommitGrp', 'Callback', 'PrintGrp', 'Output'], true);
        }
        //重新渲染页面
        this.setState(this.state);
    }

    closeApprove = () => {
        this.setState({
            approveDetailShow: false
        })
    }

    render() {
        let { table, button, search, modal, BillHeadInfo } = this.props;
        const { createBillHeadInfo } = BillHeadInfo;
        let { createModal } = modal;
        // let buttons  = this.props.button.getButtons();
        // buttons = [{btncode:'add',btnname:'新增'},{btncode:'delete',btnname:'删除'},{btncode:'refresh',btnname:'刷新'}];
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp, getButtons, createButton } = button;
        return (<div className="nc-bill-list">
            <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                <div className='header-title-search-area'>
                    {createBillHeadInfo({
                        title: this.state.json['10140CUSTPF-000001'],
                        initShowBackBtn: false
                    })}
                </div>
                <div className="header-button-area">
                    {createButtonApp({
                        area: 'header-button-area',
                        buttonLimit: 3,
                        onButtonClick: this.buttonClick.bind(this),
                        popContainer: document.querySelector('.header-button-area')

                    })}
                    {/*{buttons.map( (v) =>{*/}
                    {/*return (createButton(v.btncode, {*/}
                    {/*name: v.btnname,*/}
                    {/*onButtonClick: this.buttonClick.bind(this),*/}
                    {/*buttonColor: this.getButtonNames(v.btncode)*/}
                    {/*}))*/}
                    {/*})}*/}
                </div>
            </NCDiv>
            <div className="nc-bill-search-area">
                {NCCreateSearch(this.searchId, {
                    clickSearchBtn: this.clickSearchBtn.bind(this)
                })}
            </div>
            {/* <div style={{height:'10px'}}></div> */}
            <div className="nc-bill-table-area">
                {createSimpleTable(this.tableId, {
                    handlePageInfoChange: this.pageInfoClick.bind(this),
                    // tableModelConfirm: this.tableModelConfirm.bind(this),
                    showIndex: true,
                    showCheck: true,
                    onRowDoubleClick: this.doubleClick.bind(this),
                    dataSource: dataSource,
                    pkname: pk_item,
                    onSelected: this.onSelected.bind(this),
                    onSelectedAll: this.onSelected.bind(this)
                })}
            </div>
            {createModal('delete', {
                title: this.state.json['10140CUSTPF-000016'],/* 国际化处理： 注意*/
                content: this.state.json['10140CUSTPF-000017'],/* 国际化处理： 确认删除？*/
                beSureBtnClick: this.deleteAction.bind(this)
            })}
            <PrintOutput
                ref='printOutput'
                url={printUrl}
                data={{
                    funcode: printFunCode,//功能节点编码
                    nodekey: printNodeKey,//模板节点编码
                    oids: this.state.ids,
                    outputType: 'output'
                }}
            />
            {this.state.compositedisplay ? <ApprovalTrans
                title={this.state.json['10140CUSTPF-000034']}/* 国际化处理： 指派*/
                data={this.state.compositedata}
                display={this.state.compositedisplay}
                getResult={this.getAssginUsedr.bind(this)}
                cancel={this.turnOff.bind(this)}
            /> : ""}
            <ApproveDetail
                show={this.state.approveDetailShow}
                close={this.closeApprove.bind(this)}
                billtype='10KH'
                billid={this.state.billid}
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