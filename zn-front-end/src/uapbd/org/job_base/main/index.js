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
                        /* ?????????????????? ???????????????????????????*/
                        /* ????????????????????????????????????????????? */
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
            display: this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10100JOB-000003'] : getBusinessInfo().groupName/* ?????????????????? ??????*/
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
        //?????????????????????????????????
        meta[searchId]['items'].find((i) => i.attrcode === 'pk_jobtype').queryCondition = () => {
            return {
                pk_org: props.config.NODE_TYPE === 'GLOBE_NODE' ? 'GLOBLE00000000000000' : getBusinessInfo().groupId
            }
        }
        //?????????????????????????????????
        meta[gridId]['items'].find((i) => i.attrcode === 'pk_jobtype').queryCondition = () => {
            return {
                pk_org: props.config.NODE_TYPE === 'GLOBE_NODE' ? 'GLOBLE00000000000000' : getBusinessInfo().groupId
            }
        }
        meta[searchId]['items'].find((i) => i.attrcode === 'pk_jobtype').isShowDisabledData = true;
        //???????????????
        meta[gridId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100JOB-000004'], /* ?????????????????? ??????*/
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
            window.onbeforeunload = () => {//??????????????????????????????????????????
                return '';
            };
        }
    }

    //??????loadGridData?????????
    getLoadParmData = () => {
        let checkedVal = getDefData('checkedVal', this.config.datasource);
        //??????????????????????????????????????????????????????
        //????????????????????????????????????????????????
        let searchVal = getDefData('searchVal', this.config.datasource) || this.props.search.getAllSearchData(this.config.searchId);
        //??????????????????????????????????????????????????????enablestate = '2' ???????????????
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
                display: this.state.json['10100JOB-000005'], /* ?????????????????? ????????????*/
                oprtype: '=',
                value: { firstvalue: '2', secondvalue: null }
            });
        }
        return paramdata;
    }
    //??????????????????
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
                        //???????????????????????? 123 ??????true false
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

    //??????????????????
    onClickButton(props, id) {
        let { gridId } = props.config;
        let _this = this;
        //?????????????????????
        let rowsdata = props.editTable.getCheckedRows(gridId);
        //??????????????????
        let alldata = props.editTable.getAllRows(gridId, true);
        let allTabledata = props.editTable.getAllData(gridId);
        //????????????
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
                    title: this.state.json['10100JOB-000023'], /* ?????????????????? ??????*/
                    content: this.state.json['10100JOB-000007'], /* ?????????????????? ?????????????????????*/
                    beSureBtnClick: () => {
                        let billcodes = [];
                        //??????????????????????????????
                        alldata.map((item) => {
                            !!!item.values.pk_job.value && !!item.values.jobcode.value && billcodes.push(item.values.jobcode.value);
                        });
                        //????????????????????????????????????????????? ????????????
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
                    /* ?????????????????? ???????????????????????????*/
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
                    //???????????????????????????rows?????????
                    let changedRows = props.editTable.getChangedRows(gridId);
                    //???????????????
                    if (!props.editTable.checkRequired(props.config.gridId, props.editTable.getAllData(gridId).rows)) {
                        return;
                    }
                    //???????????????true false ??????
                    changedRows = convertGridEnablestateToSave(changedRows);
                    if (changedRows.length == 0 && this.state.rollbackcode.length == 0) {
                        props.editTable.setStatus(gridId, 'browse');
                        this.gridStatusChange();
                        toast({ title: this.state.json['10100JOB-000009'], color: 'success' });
                        /* ?????????????????? ???????????????*/
                        this.setState({
                            defaultvalue: {},
                            rollbackcode: []
                        }, () => {
                            _this.loadGridData(_this.getLoadParmData());
                        });
                        return;
                    }
                    //??????ajax??????grid????????????
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
                        //?????????????????????????????????????????????????????????
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
                                                /* ?????????????????? ???????????????*/
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
                                                /* ?????????????????? ???????????????,??????*/
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
                    //????????????????????????enablestate?????????????????????????????? true false ?????????????????????????????? ??????123
                    //???????????????????????????enablestate??????????????????123???????????????????????????
                    paramData.gridModel.rows =
                        paramData.gridModel.rows.length > 0 &&
                            (['1', '2', '3'].includes(paramData.gridModel.rows[0].values['enablestate'].value)) ?
                            paramData.gridModel.rows : convertGridEnablestateToSave(paramData.gridModel.rows);

                    if (props.editTable.getStatus(props.config.gridId) != 'browse') {
                        //??????????????????????????????????????????
                        this.setState({
                            rollbackcode: rollbackcodearr
                        }, () => {
                            props.editTable.deleteTableRowsByIndex(gridId, delindexarr, false);
                        })
                    } else {
                        //???????????????????????????????????????
                        //????????????????????????????????????????????????????????????????????????
                        //????????????????????????????????????????????????????????????  ????????????????????????????????????
                        confirmUtil.call(this, {
                            title: this.state.json['10100JOB-000011'], /* ?????????????????? ??????*/
                            content: this.state.json['10100JOB-000002D'], /* ?????????????????? ???????????????????????????*/
                            beSureBtnClick: () => {
                                ajax({
                                    url: ajaxurl.delete,
                                    data: paramData,
                                    success: (res) => {
                                        let { success, data } = res;
                                        if (success) {
                                            this.loadGridData(this.getLoadParmData(), () => {
                                                /* ?????????????????? ????????????*/
                                                toast({ color: 'success', title: this.state.json['10100JOB-000001'] });
                                                this.props.button.setButtonDisabled({
                                                    'btnDel': true
                                                });
                                            });
                                        } else {
                                            toast({ color: 'danger', title: this.state.json['10100JOB-000013'] });
                                            /* ?????????????????? ????????????*/
                                        }
                                    }
                                });
                            }
                        });
                    }
                } else {
                    toast({ color: 'warning', title: this.state.json['10100JOB-000014'] });
                    /* ?????????????????? ?????????????????????*/
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
                    /* ?????????????????? ????????????????????????*/
                    return;
                }

                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_job.value);
                });
                var tableorder = this.props.editTable.getSortParam(gridId);
                print(
                    'pdf',  //????????????: 'html'???????????????, 'pdf'???pdf??????
                    ajaxurl.printUrl,
                    {
                        funcode: '10100JOBB',      //????????????????????????????????????
                        nodekey: 'JobGlbPrint',    //??????????????????
                        oids: pks,
                        appcode: '10100JOBB',
                        userjson: `{order:${tableorder && tableorder.sortParam[0].order},field:${tableorder && tableorder.sortParam[0].field}}`,
                    }
                );
                break;
            case 'output':
                if (alldata.length === 0) {
                    toast({ 'color': 'warning', 'title': this.state.json['10100JOB-000015'] });
                    /* ?????????????????? ????????????????????????*/
                    return;
                }

                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_job.value);
                });
                let outorder = this.props.editTable.getSortParam(gridId);
                output({
                    url: ajaxurl.printUrl,
                    data: {
                        funcode: '10100JOBB',      //????????????????????????????????????
                        outputType: 'output',
                        nodekey: 'JobGlbPrint',
                        oids: pks,    //???['1001A41000000000A9LR','1001A410000000009JDD']  ??????pk  oids????????????????????????????????????,
                        userjson: `{order:${outorder && outorder.sortParam[0].order},field:${outorder && outorder.sortParam[0].field}}`,
                    }
                });
                break;
            default:
                break;
        }
    }

    //???????????????????????????
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

    //?????????????????????????????????
    onModelConfirm(props, data, type) {
    }

    //???????????????????????????
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
                        /* ?????????????????? ????????????*/
                    });
                } else {
                    toast({ color: 'danger', title: this.state.json['10100JOB-000017'] });
                    /* ?????????????????? ????????????*/
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
                        /* ?????????????????? ????????????*/
                    });
                } else {
                    toast({ color: 'danger', title: this.state.json['10100JOB-000019'] });
                    /* ?????????????????? ????????????*/
                    this.loadGridData(this.getLoadParmData());
                }
            }
        });
    }

    //??????????????????????????????
    onCheckShowDisable(checked) {
        setDefData('checkedVal', this.config.datasource, checked);
        this.loadGridData(this.getLoadParmData()
            //     (param) => {
            //     queryToastFunc()(param)
            // }
        );
    }

    //????????????????????????
    onTableModelAfterEdit(props, moduleId, key, value, changedrows, index, record) {
        let { gridId } = props.config;
        //????????????
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
            //????????????????????????
            case 'enablestate':
                let rocordval = record.values;
                let rem = manageModeUtils.call(this, props.config.NODE_TYPE, rocordval.pk_org.value, rocordval.pk_group.value, '', getBusinessInfo().groupId);
                //?????????????????????????????? ????????????record???enablestate????????????????????? ????????????record????????????????????????
                record.values.enablestate.value = !record.values.enablestate.value;
                let Changerows = [record];
                if (value) {//???????????????
                    rem.editFlag && this.enableToogle(Changerows, paramdata);
                    rem.editFlag || toast({ 'color': 'warning', 'title': rem.message });
                } else {//???????????????
                    rem.editFlag && this.disableToogle(Changerows, paramdata);
                    rem.editFlag || toast({ 'color': 'warning', 'title': rem.message });
                }
                break;
        }
    }

    //??????????????????????????????
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
            //????????????????????????
            this.props.editTable.setTableData(this.config.gridId, this.state.queryData);
        } else {
            //????????????????????????
            let copydata = this.state.queryData;
            copydata.rows = convertGridEnablestateToSave(copydata.rows);
            // ?????????????????????????????????????????? by zhangchenm
            //this.props.editTable.setTableData(this.config.gridId, copydata);
        }
        this.props.button.setMainButton({ 'btnAdd': gridStatus != 'edit', 'btnSave': gridStatus == 'edit' });
    }

    //?????????????????????
    gridBeChecked(props, moduleId, record, index, status) {
        let { gridId } = props.config;
        //????????????????????????????????????????????????
        let tableData = props.editTable.getCheckedRows(gridId);
        let length = tableData.length;//????????????????????????????????????
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
        //????????????????????????
        this.props.button.setButtonsVisible({
            'btnAdd': true,
            'btnEdit': false,
            'btnSave': true,
            'btnCancel': true,
            'btnRefrensh': false,
            'btnPrint': false
        });
        //?????????????????????????????????????????????????????????
        this.props.button.setMainButton({ 'btnAdd': false, 'btnSave': true });
        //????????????????????????
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
     * ????????????????????????????????????
     * ??????????????????????????????????????????????????????????????????
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
        const { createBillHeadInfo } = BillHeadInfo; //?????? ?????????????????????
        const { gridId, searchId } = this.props.config;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const { createEditTable } = editTable;
        const status = this.props.editTable.getStatus(gridId);
        return (
            <div className="nc-single-table">
                {/* ?????? header */}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={status === 'browse' ? {} : { borderBottom: 'none' }}>
                    {/* ?????? title */}
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
                        {/* ????????????  showOff*/}
                        <div className="title-search-detail" style={{ display: status === 'browse' ? '' : 'none' }}>
                            <span className='showOff'>
                                <NCCheckbox onChange={this.onCheckShowDisable.bind(this)}
                                    checked={getDefData('checkedVal', this.config.datasource)}>{this.state.json['10100JOB-000020']}</NCCheckbox>{/* ?????????????????? ????????????*/}
                            </span>
                        </div>
                    </div>
                    {/* ?????????  btn-group */}
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
                {/* ????????? */}
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