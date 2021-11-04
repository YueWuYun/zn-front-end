//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { ajax, base, toast, cardCache, print, output, getBusinessInfo, createPageIcon } from 'nc-lightapp-front';

const { setDefData, getDefData } = cardCache;
import manageModeUtils from '../../../public/utils/ManageModeUtils';
import confirmUtil from '../../../public/pubComponent/confirmUtil/confirmUtil';
import Utils from '../../../public/utils/index';

const { queryToastFunc, convertGridEnablestateToSave, convertGridEnablestateToShow } = Utils;
const { NCCheckbox, NCDiv } = base;
import { tableBeforeEvent } from './events';
import tableButtonClick from "./events/tableButtonClick";
let ajaxurl = {
    queryPage: '/nccloud/uapbd/jobglb/queryjob.do',
    add: '/nccloud/uapbd/jobglb/add.do',
    edit: '/nccloud/uapbd/jobglb/edit.do',
    saveAdd: '/nccloud/uapbd/jobglb/addsave.do',
    delete: '/nccloud/uapbd/jobglb/delete.do',
    enable: '/nccloud/uapbd/jobglb/enable.do',
    disable: '/nccloud/uapbd/jobglb/disable.do',
    printUrl: '/nccloud/uapbd/jobglb/print.do',
    cacelUrl: '/nccloud/uapbd/jobglb/cancel.do'
}

/**
 * author zhenmx
 *
 */
class JobEditTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadLang: false,
            searchValue: '',
            checkValue: null,
            queryData: [],
            oid: '',
            context: {},
            json: {},
            x: '',
            defaultvalue: {},
            userJson: '',
            rollbackcode: []
        }
        this.config = props.config;
        this.config.appcode = props.getSearchParam('c');
        this.config.pagecode = props.getSearchParam('p');
        let tempParam = {
            pagecode: props.config.pagecode
        }, langParam = {
            moduleId: "10100JOB_NCC", domainName: 'uapbd'
        }
        this.loadTempAndLang(props, tempParam, langParam, (tempdata, mutiJson, inlt) => {
            this.resetStateAfterLoadLang(mutiJson, inlt, tempdata, (data) => {
                let me = this;
                if (data) {
                    let meta = data.template;
                    meta = me.modifierMeta(props, meta);
                    props.meta.setMeta(meta, () => {
                        me.initQueryTemplate();
                    });
                    if (data.button) {
                        props.button.setButtons(data.button);
                        props.button.setPopContent('oprDeleteBrowse', me.state.json['10100JOB-000002D'])
                        /* 国际化处理： 确认要删除该条吗？*/
                        /* 设置操作列上删除按钮的弹窗提示 */
                    }
                    me.gridStatusChange(props);
                }

            })
        })
    }

    loadTempAndLang = (props, tempParam, langParam, callback) => {
        let temp, lang, inlt;
        props.createUIDom(tempParam, (data) => {
            temp = data;
            if (!!lang) {
                callback && callback(temp, lang, inlt);
            }
        });
        let langCallback = (multiJson, json, inlt) => {
            lang = multiJson;
            inlt = inlt;
            if (!!temp) {
                callback && callback(temp, lang, inlt);
            }
        }
        props.MultiInit.getMultiLang(Object.assign(langParam, { callback: langCallback }));
    }
    resetStateAfterLoadLang = (mutiJson, inlt, tempdata, callback) => {
        this.state.oid = tempdata['template'][this.config.searchId].oid;
        this.state.context = tempdata.context;
        this.state.json = mutiJson;
        this.state.x = inlt;
        this.state.loadLang = true;
        this.setState(this.state, callback.call(this, tempdata))
    }

    initQueryTemplate = () => {
        let searchVal = {
            conditions: [],
            logic: 'and'
        }
        searchVal.conditions.push({
            field: 'pk_org',
            value: {
                firstvalue: this.config.NODE_TYPE === 'GLOBE_NODE' ? 'GLOBLE00000000000000' : getBusinessInfo().groupId,
                secondvalue: ''
            },
            oprtype: '=',
            display: this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10100JOB-000003'] : getBusinessInfo().groupName/* 国际化处理： 全局*/
        }, {
                field: 'pk_group',
                value: {
                    firstvalue: getBusinessInfo().groupId,
                    secondvalue: ''
                },
                oprtype: '=',
                display: getBusinessInfo().groupName
            });

        this.props.search.setSearchValue(this.config.searchId, searchVal);
    }
    modifierMeta = (props, meta) => {
        let { gridId, searchId } = props.config;
        meta[gridId].showindex = true;
        meta[gridId].status = 'browse';
        //查询区职务类别参照过滤
        meta[searchId]['items'].find((i) => i.attrcode === 'pk_jobtype').queryCondition = () => {
            return {
                pk_org: props.config.NODE_TYPE === 'GLOBE_NODE' ? 'GLOBLE00000000000000' : getBusinessInfo().groupId
            }
        }
        //表格区职务类别参照过滤
        meta[gridId]['items'].find((i) => i.attrcode === 'pk_jobtype').queryCondition = () => {
            return {
                pk_org: props.config.NODE_TYPE === 'GLOBE_NODE' ? 'GLOBLE00000000000000' : getBusinessInfo().groupId
            }
        }
        meta[searchId]['items'].find((i) => i.attrcode === 'pk_jobtype').isShowDisabledData = true;
        //添加操作列
        meta[gridId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100JOB-000004'], /* 国际化处理： 操作*/
            itemtype: 'customer',
            width: 168,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                let buttonAry;
                if (props.editTable.getStatus(gridId) === "browse") {
                    if (props.config.NODE_TYPE === 'GROUP_NODE' && record.values.pk_org.value === 'GLOBLE00000000000000') {
                        buttonAry = [];
                    } else {
                        buttonAry = ['oprEdit', 'oprDeleteBrowse'];
                    }
                } else {
                    if (props.config.NODE_TYPE === 'GROUP_NODE' && record.values.pk_org.value === 'GLOBLE00000000000000') {
                        buttonAry = [];
                    } else {
                        buttonAry = ['oprExtend', 'oprDelete'];

                    }

                }
                return props.button.createOprationButton(buttonAry, {
                    area: 'currency-opr-col',
                    buttonLimit: 2,
                    onButtonClick: tableButtonClick.bind(this, record, index)
                });
            }
        });
        return meta;
    }

    componentDidMount() {
        this.props.editTable.setTableData(this.config.gridId, { rows: [] });
        this.props.button.setButtonsVisible({
            'btnSave': false,
            'btnCancel': false
        });
        this.props.button.setButtonDisabled({
            'btnDel': true,
            'btnPrint': true,
            'output': true,
            'btnEdit': true
        });
    }

    componentWillMount() {
    }

    componentDidUpdate() {
        let gridStatus = this.props.editTable.getStatus(this.props.config.gridId);
        if (gridStatus === 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    //获取loadGridData的参数
    getLoadParmData = () => {
        let checkedVal = getDefData('checkedVal', this.config.datasource);
        //如果缓存中没有查询条件就从查询区去拿
        //解决第一次进入节点就点刷新的场景
        let searchVal = getDefData('searchVal', this.config.datasource) || this.props.search.getAllSearchData(this.config.searchId);
        //如果没有勾选显示停用，查询条件里面的enablestate = '2' 只显示启用
        let paramdata = {
            custcondition: {
                conditions: [{
                    field: 'NODE_TYPE',
                    value: {
                        firstvalue: this.config.NODE_TYPE
                    },
                    oprtyp: ''
                }]
            },
            queryAreaCode: this.config.searchId,
            querycondition: searchVal,
            oid: this.state.oid,
            querytype: 'tree',
            appcode: this.config.appcode,
            pagecode: this.config.pagecode,
            userdefObj: {
                gridId: this.config.gridId
            }
        };
        if (!checkedVal) {
            paramdata.custcondition.conditions.push({
                field: 'enablestate',
                display: this.state.json['10100JOB-000005'], /* 国际化处理： 启用状态*/
                oprtype: '=',
                value: { firstvalue: '2', secondvalue: null }
            });
        }
        return paramdata;
    }
    //加载列表数据
    loadGridData = (paramdata, callback) => {
        let _this = this;
        let { gridId } = this.props.config;
        ajax({
            url: ajaxurl.queryPage,
            data: paramdata,
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    if (data && data[gridId]['rows']) {
                        _this.state.queryData = data[gridId];
                        //表格数据启用状态 123 转化true false
                        data[gridId].rows = convertGridEnablestateToShow(data[gridId].rows);
                        _this.props.editTable.setTableData(gridId, data[gridId]);
                        _this.props.editTable.getAllData(gridId).rows.map((row) => {
                            if (row.values.pk_org.value === 'GLOBLE00000000000000' && _this.props.config.NODE_TYPE === 'GROUP_NODE') {
                                _this.props.editTable.setEditableRowKeyByRowId(gridId, row.rowid, 'enablestate', false);
                            }
                        });
                        _this.props.button.setButtonDisabled({
                            'btnPrint': false,
                            'output': false,
                            'btnEdit': false,
                            'btnDel': true
                        });
                        callback && callback.call(this, data[gridId]['allpks']);
                    } else {
                        _this.props.button.setButtonDisabled({
                            'btnPrint': true,
                            'output': true,
                            'btnDel': true,
                            'btnEdit': true
                        });
                        let nulldata = {
                            rows: []
                        }
                        _this.props.editTable.setTableData(gridId, nulldata);
                        callback && callback.call(this, []);
                    }
                }
            }
        })
    }

    //按钮点击事件
    onClickButton(props, id) {
        let { gridId } = props.config;
        let _this = this;
        //获取选中行数据
        let rowsdata = props.editTable.getCheckedRows(gridId);
        //获取所有数据
        let alldata = props.editTable.getAllRows(gridId, true);
        let allTabledata = props.editTable.getAllData(gridId);
        //获取行数
        let allrows = props.editTable.getNumberOfRows(gridId);
        let gridStatus = props.editTable.getStatus(gridId);
        let pks = [];
        let newData = [];
        let manageModeBtns = ['btnDel'];
        if (manageModeBtns.includes(id)) {
            let rem = manageModeUtils.call(this, props.config.NODE_TYPE, rowsdata[0].data.values.pk_org.value, rowsdata[0].data.values.pk_group.value, [], getBusinessInfo().groupId);
            if (!rem.editFlag) {
                toast({ color: 'warning', content: rem.message });
                return;
            }
        }
        switch (id) {
            case 'btnAdd':
                this.addJobFunc.call(this);
                break;
            case 'btnCancel':
                confirmUtil.call(this, {
                    title: this.state.json['10100JOB-000023'], /* 国际化处理： 取消*/
                    content: this.state.json['10100JOB-000007'], /* 国际化处理： 是否确定取消？*/
                    beSureBtnClick: () => {
                        let billcodes = [];
                        //取消是回滚新增的编码
                        alldata.map((item) => {
                            !!!item.values.pk_job.value && !!item.values.jobcode.value && billcodes.push(item.values.jobcode.value);
                        });
                        //取消时如果做了删除了新增的数据 回滚编码
                        this.state.rollbackcode.length > 0 && this.state.rollbackcode.map((item) => {
                            billcodes.push(item);
                        });
                        this.state.defaultvalue.hasOwnProperty('values') &&
                            this.state.defaultvalue.hasOwnProperty('jobcode') &&
                            billcodes.push(this.state.defaultvalue.values.jobcode.value);
                        if (billcodes.length != 0) {
                            ajax({
                                url: ajaxurl.cacelUrl,
                                data: { billcodes: billcodes, nodeType: this.config.NODE_TYPE },
                                success: (res) => {
                                    let { success, data } = res;
                                    if (success) {
                                        this.setState({
                                            defaultvalue: {},
                                            rollbackcode: []
                                        }, () => {
                                            props.editTable.setStatus(gridId, 'browse');
                                            props.editTable.cancelEdit(gridId);
                                            this.gridStatusChange();
                                            this.loadGridData(this.getLoadParmData(), () => {
                                            });
                                        })
                                    }
                                }
                            });
                        } else {
                            this.setState({
                                defaultvalue: {},
                                rollbackcode: []
                            }, () => {
                                props.editTable.setStatus(gridId, 'browse');
                                props.editTable.cancelEdit(gridId);
                                this.gridStatusChange();
                                this.loadGridData(this.getLoadParmData(), () => {
                                });
                            });
                        }
                    }
                });
                break;
            case 'btnEdit':
                if (alldata.length == 0) {
                    toast({ color: 'warning', title: this.state.json['10100JOB-000008'] });
                    /* 国际化处理： 没有数据可以修改！*/
                    return;
                }
                alldata.length !== 0 && ajax({
                    url: ajaxurl.edit,
                    data: {
                        model: {
                            rows: convertGridEnablestateToSave(allTabledata.rows),
                        },
                        pageid: props.config.pagecode
                    },
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            props.editTable.setStatus(gridId, 'edit');
                            this.gridStatusChange();
                        }
                    }
                });
                break;
            case 'btnSave':
                setTimeout(() => {
                    props.editTable.filterEmptyRows(gridId, ['name', 'jobcode', 'jobname', 'pk_jobtype', 'jobdesc'], 'include');
                    //获取新增或修改过的rows的数组
                    let changedRows = props.editTable.getChangedRows(gridId);
                    //必输项校验
                    if (!props.editTable.checkRequired(props.config.gridId, props.editTable.getAllData(gridId).rows)) {
                        return;
                    }
                    //停用启用值true false 转换
                    changedRows = convertGridEnablestateToSave(changedRows);
                    if (changedRows.length == 0 && this.state.rollbackcode.length == 0) {
                        props.editTable.setStatus(gridId, 'browse');
                        this.gridStatusChange();
                        toast({ title: this.state.json['10100JOB-000009'], color: 'success' });
                        /* 国际化处理： 保存成功！*/
                        this.setState({
                            defaultvalue: {},
                            rollbackcode: []
                        }, () => {
                            _this.loadGridData(_this.getLoadParmData());
                        });
                        return;
                    }
                    //定义ajax回传grid参数结构
                    let paramdata = {
                        'userjson': this.config.NODE_TYPE,
                        'pageid': props.config.pagecode,
                        'gridModel': {
                            'pageinfo': {},
                            'areacode': gridId,
                            'rows': changedRows
                        }
                    }
                    props.validateToSave(paramdata, () => {
                        //保存前回滚不需要保存但是已经生成的编码
                        let billcodes = [];
                        !!this.state.defaultvalue && Object.keys(this.state.defaultvalue).length > 0 &&
                            billcodes.push(this.state.defaultvalue.jobcode.value);
                        this.state.rollbackcode.length > 0 && this.state.rollbackcode.map((item) => {
                            billcodes.push(item);
                        });
                        ajax({
                            url: ajaxurl.cacelUrl,
                            data: {
                                billcodes: billcodes,
                                nodeType: this.config.NODE_TYPE
                            },
                            success: (res) => {
                                let { success, data } = res;
                                if (success) {
                                    ajax({
                                        url: ajaxurl.saveAdd,
                                        data: paramdata,
                                        success: (res) => {
                                            let { success, data } = res;
                                            if (success) {
                                                props.editTable.setStatus(gridId, 'browse');
                                                this.gridStatusChange();
                                                toast({ title: this.state.json['10100JOB-000009'], color: 'success' });
                                                /* 国际化处理： 保存成功！*/
                                                this.setState({
                                                    defaultvalue: {},
                                                    rollbackcode: []
                                                }, () => {
                                                    _this.loadGridData(_this.getLoadParmData());
                                                })
                                            } else {
                                                toast({
                                                    content: this.state.json['10100JOB-000010'],
                                                    title: this.state.json['10100JOB-000011'],
                                                    color: 'danger'
                                                });
                                                /* 国际化处理： 保存失败！,提示*/
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }, { [gridId]: 'grid' }, 'grid')
                }, 0);
                break;
            case 'btnDel':
                let delindexarr = [];
                let rollbackcodearr = [];
                if (rowsdata.length != 0) {
                    rowsdata.map((ele) => {
                        newData.push(ele.data);
                        delindexarr.push(ele.index);
                        if (!!!ele.data.values.pk_job.value && !!ele.data.values.jobcode.value) {
                            rollbackcodearr.push(ele.data.values.jobcode.value);
                        }
                    });
                    let paramData = {
                        'pageid': props.config.pagecode,
                        'gridModel': {
                            'pageinfo': {},
                            'areacode': gridId,
                            'rows': newData
                        }
                    }
                    //正常从表格获取到enablestate字段的时候是布尔类型 true false 传到后台前需要转换成 枚举123
                    //如果现在表格的数据enablestate已经是枚举值123了就不需要再转了。
                    paramData.gridModel.rows =
                        paramData.gridModel.rows.length > 0 &&
                            (['1', '2', '3'].includes(paramData.gridModel.rows[0].values['enablestate'].value)) ?
                            paramData.gridModel.rows : convertGridEnablestateToSave(paramData.gridModel.rows);

                    if (props.editTable.getStatus(props.config.gridId) != 'browse') {
                        //编辑态假删除，点取消数据还在
                        this.setState({
                            rollbackcode: rollbackcodearr
                        }, () => {
                            props.editTable.deleteTableRowsByIndex(gridId, delindexarr, false);
                        })
                    } else {
                        //浏览态真删除，删除前有提示
                        //现在的做法是删除请求成功的回调里面去请求新的数据
                        //当然也可以省一个请求（操作列删除的做法）  直接调用表格的真删除方法
                        confirmUtil.call(this, {
                            title: this.state.json['10100JOB-000011'], /* 国际化处理： 删除*/
                            content: this.state.json['10100JOB-000002D'], /* 国际化处理： 确定删除所选数据？*/
                            beSureBtnClick: () => {
                                ajax({
                                    url: ajaxurl.delete,
                                    data: paramData,
                                    success: (res) => {
                                        let { success, data } = res;
                                        if (success) {
                                            this.loadGridData(this.getLoadParmData(), () => {
                                                /* 国际化处理： 删除成功*/
                                                toast({ color: 'success', title: this.state.json['10100JOB-000001'] });
                                                this.props.button.setButtonDisabled({
                                                    'btnDel': true
                                                });
                                            });
                                        } else {
                                            toast({ color: 'danger', title: this.state.json['10100JOB-000013'] });
                                            /* 国际化处理： 删除失败*/
                                        }
                                    }
                                });
                            }
                        });
                    }
                } else {
                    toast({ color: 'warning', title: this.state.json['10100JOB-000014'] });
                    /* 国际化处理： 请选择数据操作*/
                }
                break;
            case 'btnRefrensh':
                this.loadGridData(this.getLoadParmData(), () => {
                    this.props.button.setButtonDisabled({
                        'btnDel': true
                    });
                    queryToastFunc.call(this)();
                });
                break;
            case 'btnPrint':
            case 'print':
                if (alldata.length === 0) {
                    toast({ 'color': 'warning', 'title': this.state.json['10100JOB-000015'] });
                    /* 国际化处理： 请查询打印数据！*/
                    return;
                }

                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_job.value);
                });
                var tableorder = this.props.editTable.getSortParam(gridId);
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    ajaxurl.printUrl,
                    {
                        funcode: '10100JOBB',      //功能节点编码，即模板编码
                        nodekey: 'JobGlbPrint',    //模板节点标识
                        oids: pks,
                        appcode: '10100JOBB',
                        userjson: `{order:${tableorder && tableorder.sortParam[0].order},field:${tableorder && tableorder.sortParam[0].field}}`,
                    }
                );
                break;
            case 'output':
                if (alldata.length === 0) {
                    toast({ 'color': 'warning', 'title': this.state.json['10100JOB-000015'] });
                    /* 国际化处理： 请查询打印数据！*/
                    return;
                }

                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_job.value);
                });
                let outorder = this.props.editTable.getSortParam(gridId);
                output({
                    url: ajaxurl.printUrl,
                    data: {
                        funcode: '10100JOBB',      //功能节点编码，即模板编码
                        outputType: 'output',
                        nodekey: 'JobGlbPrint',
                        oids: pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        userjson: `{order:${outorder && outorder.sortParam[0].order},field:${outorder && outorder.sortParam[0].field}}`,
                    }
                });
                break;
            default:
                break;
        }
    }

    //查询区按钮点击事件
    onClickSearchBtn(props, data) {
        let { searchId, datasource } = this.config;
        const _this = this;
        let searchData = _this.props.search.getAllSearchData(searchId);
        setDefData('searchVal', datasource, searchData);
        if (typeof (searchData) !== 'undefined' && searchData && searchData.conditions) {
            _this.loadGridData(_this.getLoadParmData(), (param) => {
                queryToastFunc.call(this)(param);
            })
        } else {
            return;
        }
    }

    //新增编辑模态框保存事件
    onModelConfirm(props, data, type) {
    }

    //模态框取消按钮事件
    onCloseTableModel(props) {

    }

    enableToogle = (Changerows, paramdata) => {
        Changerows = convertGridEnablestateToSave(Changerows);
        paramdata.gridmodel.rows.push(Changerows[0]);
        ajax({
            url: ajaxurl.enable,
            data: paramdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    this.loadGridData(this.getLoadParmData(), () => {
                        toast({ color: 'success', title: this.state.json['10100JOB-000016'] });
                        /* 国际化处理： 启用成功*/
                    });
                } else {
                    toast({ color: 'danger', title: this.state.json['10100JOB-000017'] });
                    /* 国际化处理： 启用失败*/
                    this.loadGridData(this.getLoadParmData());
                }
            }
        });
    }
    disableToogle = (Changerows, paramdata) => {
        Changerows = convertGridEnablestateToSave(Changerows);
        paramdata.gridmodel.rows.push(Changerows[0]);
        ajax({
            url: ajaxurl.disable,
            data: paramdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    this.loadGridData(this.getLoadParmData(), () => {
                        toast({ color: 'success', title: this.state.json['10100JOB-000018'] });
                        /* 国际化处理： 停用成功*/
                    });
                } else {
                    toast({ color: 'danger', title: this.state.json['10100JOB-000019'] });
                    /* 国际化处理： 停用失败*/
                    this.loadGridData(this.getLoadParmData());
                }
            }
        });
    }

    //显示停用按钮点击事件
    onCheckShowDisable(checked) {
        setDefData('checkedVal', this.config.datasource, checked);
        this.loadGridData(this.getLoadParmData()
            //     (param) => {
            //     queryToastFunc()(param)
            // }
        );
    }

    //模态框编辑后事件
    onTableModelAfterEdit(props, moduleId, key, value, changedrows, index, record) {
        let { gridId } = props.config;
        //获取行数
        let allrows = this.props.editTable.getNumberOfRows(moduleId);
        let paramdata = {
            pageid: '10100JOBB_job',
            gridmodel: {
                areacode: gridId,
                pageinfo: {},
                rows: []
            }
        }
        switch (key) {
            //如果启用状态修改
            case 'enablestate':
                let rocordval = record.values;
                let rem = manageModeUtils.call(this, props.config.NODE_TYPE, rocordval.pk_org.value, rocordval.pk_group.value, '', getBusinessInfo().groupId);
                //点击的停用启用的时候 获取到的record的enablestate是和点击后的值 所以拿到record的时候要反置一下
                record.values.enablestate.value = !record.values.enablestate.value;
                let Changerows = [record];
                if (value) {//如果是启用
                    rem.editFlag && this.enableToogle(Changerows, paramdata);
                    rem.editFlag || toast({ 'color': 'warning', 'title': rem.message });
                } else {//如果是停用
                    rem.editFlag && this.disableToogle(Changerows, paramdata);
                    rem.editFlag || toast({ 'color': 'warning', 'title': rem.message });
                }
                break;
        }
    }

    //表格状态改变监听事件
    gridStatusChange() {
        let { gridId } = this.props.config;
        let gridStatus = this.props.editTable.getStatus(gridId);
        gridStatus === 'browse' ? this.props.button.setButtonsVisible({
            'btnSave': false,
            'btnCancel': false,
            'btnAdd': true,
            'btnEdit': true,
            'btnRefrensh': true,
            'btnPrint': true
        }) : this.props.button.setButtonsVisible({
            'btnAdd': true,
            'btnEdit': false,
            'btnSave': true,
            'btnCancel': true,
            'btnRefrensh': false,
            'btnPrint': false
        });

        if (gridStatus === 'browse') {
            //表格切换为浏览态
            this.props.editTable.setTableData(this.config.gridId, this.state.queryData);
        } else {
            //表格切换为编辑态
            let copydata = this.state.queryData;
            copydata.rows = convertGridEnablestateToSave(copydata.rows);
            // 注释掉后，解决的展开报错问题 by zhangchenm
            //this.props.editTable.setTableData(this.config.gridId, copydata);
        }
        this.props.button.setMainButton({ 'btnAdd': gridStatus != 'edit', 'btnSave': gridStatus == 'edit' });
    }

    //表格行选中事件
    gridBeChecked(props, moduleId, record, index, status) {
        let { gridId } = props.config;
        //此处控制按钮的隐藏显示及启用状态
        let tableData = props.editTable.getCheckedRows(gridId);
        let length = tableData.length;//获取列表页选择数据的行数
        let gridstatus = props.editTable.getStatus(moduleId);

        props.button.setDisabled({
            'btnDel': length === 0 ? true : false
        });
        this.setState(this.state);
    }

    onSelectedAll = (props, moduleId, status, length) => {
        props.button.setDisabled({
            'btnDel': !status
        });
        this.setState(this.state);
    }

    addJobFunc = () => {
        let { gridId } = this.config;
        this.props.editTable.setStatus(gridId, 'edit');
        //设置按钮显示隐藏
        this.props.button.setButtonsVisible({
            'btnAdd': true,
            'btnEdit': false,
            'btnSave': true,
            'btnCancel': true,
            'btnRefrensh': false,
            'btnPrint': false
        });
        //设置新增按钮为非主按钮（主按钮为红色）
        this.props.button.setMainButton({ 'btnAdd': false, 'btnSave': true });
        //表格切换为编辑态
        let copydata = Utils.clone(this.props.editTable.getAllData(gridId));
        copydata.rows = convertGridEnablestateToSave(copydata.rows);
        this.props.editTable.setTableData(this.config.gridId, copydata);
        ajax({
            url: ajaxurl.add,
            data: {
                'NODE_TYPE': this.config.NODE_TYPE,
                'pagecode': this.config.pagecode,
                'areacode': this.config.gridId,
                'pk_org': this.state.context.pk_org
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    this.setState({
                        userJson: data['userjson'] || data['userjson'] === 'false' ? true : false
                    }, () => {
                        let meta = this.props.meta.getMeta();
                        let obj = meta[gridId]['items'].find(item => item.attrcode === 'jobcode');
                        obj.disabled = data['userjson'] || data['userjson'] === 'false' ? true : false;
                        this.props.meta.setMeta(meta, () => {
                            // this.props.editTable.getNumberOfRows(gridId)?:this.props.editTable.getNumberOfRows(gridId)
                            this.props.editTable.addRow(gridId,
                                undefined,
                                false,
                                data[gridId]['rows'][0].values);
                        });
                    });
                }
            }
        });
    }
    /**
     * 自动增行的回调。沙雕设计
     * 本来节点不支持全表编辑，非要做成支持全表编辑
     * */
    addRowCallback = () => {
        let { gridId } = this.config;
        ajax({
            url: ajaxurl.add,
            data: {
                'NODE_TYPE': this.config.NODE_TYPE,
                'pagecode': this.config.pagecode,
                'areacode': this.config.gridId,
                'pk_org': this.state.context.pk_org
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    this.setState({
                        userJson: data['userjson'] || data['userjson'] === 'false' ? true : false
                    }, () => {
                        let meta = this.props.meta.getMeta();
                        let obj = meta[gridId]['items'].find(item => item.attrcode === 'jobcode');
                        obj.disabled = data['userjson'] || data['userjson'] === 'false' ? true : false;
                        this.props.meta.setMeta(meta, () => {
                            this.props.editTable.updateDataByIndexs(gridId, [
                                {
                                    index: this.props.editTable.getNumberOfRows(gridId) - 1,
                                    data: data[gridId]['rows'][0]
                                }
                            ]);
                        });
                    });
                }
            }
        });
    }
    renderPage = () => {
        const { editTable, button, search, BillHeadInfo } = this.props;
        const { createBillHeadInfo } = BillHeadInfo; //新加 返回图标和按钮
        const { gridId, searchId } = this.props.config;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const { createEditTable } = editTable;
        const status = this.props.editTable.getStatus(gridId);
        return (
            <div className="nc-single-table">
                {/* 头部 header */}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={status === 'browse' ? {} : { borderBottom: 'none' }}>
                    {/* 标题 title */}
                    <div className="header-title-search-area">
                        {/*
                         {createPageIcon()}
                        <h2 className="title-search-detail" fieldid = {this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10100JOB-000021'] : this.state.json['10100JOB-000022']+"_title"}>{this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10100JOB-000021'] : this.state.json['10100JOB-000022']}</h2>
                    */}
                        {createBillHeadInfo({
                            title: this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10100JOB-000021'] : this.state.json['10100JOB-000022'],
                            //backBtnClick: onCardButtonClick.bind(this,this.props,'Card_Return'),
                            showBackBtn: false,
                            initShowBackBtn: false
                        }
                        )}
                        {/* 显示停用  showOff*/}
                        <div className="title-search-detail" style={{ display: status === 'browse' ? '' : 'none' }}>
                            <span className='showOff'>
                                <NCCheckbox onChange={this.onCheckShowDisable.bind(this)}
                                    checked={getDefData('checkedVal', this.config.datasource)}>{this.state.json['10100JOB-000020']}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                            </span>
                        </div>
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',
                            buttonLimit: 3,
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}
                    </div>
                </NCDiv>
                <div className="nc-singleTable-search-area" style={{ display: status === 'browse' ? '' : 'none' }}>
                    {NCCreateSearch(searchId, {
                        clickSearchBtn: this.onClickSearchBtn.bind(this)
                    })}
                </div>
                {/* 列表区 */}
                <div className="nc-singleTable-table-area">
                    {createEditTable(gridId, {
                        fieldid: 'positionlist',
                        onCloseModel: this.onCloseTableModel.bind(this),
                        tableModelConfirm: this.onModelConfirm.bind(this),
                        onAfterEvent: this.onTableModelAfterEdit.bind(this),
                        onSelected: this.gridBeChecked.bind(this),
                        onSelectedAll: this.onSelectedAll.bind(this),
                        onBeforeEvent: tableBeforeEvent.bind(this),
                        isAddRow: true,
                        addRowCallback: this.addRowCallback.bind(this),
                        showCheck: true,
                        showIndex: true,
                        adaptionHeight: true
                    })}
                </div>
            </div>
        )

    }

    render() {
        return (<div>{this.state.loadLang ? this.renderPage() : <div />}</div>)
    }
}

export default JobEditTable

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65