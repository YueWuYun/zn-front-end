//+/6MmEjE+wtmyervEGWHwbtBSRBcXFK/wMaUYd7wE6KpGqpS6hfbRgluX24IZmk1
import React, {Component} from 'react';
import {ajax, base, toast, cardCache, print, output, getBusinessInfo} from 'nc-lightapp-front';

const {setDefData, getDefData} = cardCache;
import manageModeUtils from '../../../public/utils/ManageModeUtils';
import confirmUtil from '../../../public/pubComponent/confirmUtil/confirmUtil';
import Utils from '../../../public/utils/index';
const {queryToastFunc,convertGridEnablestateToSave,convertGridEnablestateToShow} = Utils;
const {NCCheckbox} = base;
import {tableBeforeEvent} from './events';
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
        }
        this.config = props.config;
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
                        props.button.setPopContent('oprDeleteBrowse', me.state.json['10100JOB-000002'])
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
        props.MultiInit.getMultiLang(Object.assign(langParam, {callback: langCallback}));
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
        let {gridId, searchId} = props.config;
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
                let buttonAry =
                    props.editTable.getStatus(gridId) === "browse"
                        ? props.config.NODE_TYPE === 'GROUP_NODE' && record.values.pk_org.value === 'GLOBLE00000000000000' ? [] : ['oprEdit', 'oprDeleteBrowse']
                        : props.config.NODE_TYPE === 'GROUP_NODE' && record.values.pk_org.value === 'GLOBLE00000000000000' ? [] :
                        ['oprExtend', 'oprDelete'];

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
        this.props.editTable.setTableData(this.config.gridId, {rows: []});
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
        let searchVal = getDefData('searchVal', this.config.datasource);
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
                value: {firstvalue: '2', secondvalue: null}
            });
        }
        return paramdata;
    }
//??????????????????
    loadGridData = (paramdata, callback) => {
        let _this = this;
        let {gridId} = this.props.config;
        ajax({
            url: ajaxurl.queryPage,
            data: paramdata,
            success: function (res) {
                let {success, data} = res;
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
        let {gridId} = props.config;
        let _this = this;
        //?????????????????????
        let rowsdata = props.editTable.getCheckedRows(gridId);
        //??????????????????
        let alldata = props.editTable.getAllRows(gridId, true);
        let allTabledata = props.editTable.getAllData(gridId);
        //????????????
        let allrows = props.editTable.getNumberOfRows(gridId);
        //
        let gridStatus = props.editTable.getStatus(gridId);
        let pks = [];
        let newData = [];
        let manageModeBtns = ['btnDel'];
        if (manageModeBtns.includes(id)) {
            let rem = ManageModeUtils.call(this,props.config.NODE_TYPE, rowsdata[0].data.values.pk_org.value, rowsdata[0].data.values.pk_group.value, [], getBusinessInfo().groupId);
            if (!rem.editFlag) {
                toast({color: 'warning', content: rem.message});
                return;
            }
        }
        switch (id) {
            case 'btnAdd':
                this.addJobFunc.call(this);
                break;
            case 'btnCancel':
                confirmUtil.call(this,{
                    title: this.state.json['10100JOB-000023'], /* ?????????????????? ??????*/
                    content: this.state.json['10100JOB-000007'], /* ?????????????????? ?????????????????????*/
                    beSureBtnClick: () => {
                        let billcodes = [];
                        alldata.map((item) => {
                            item.status === '2' && !!item.values.jobcode.value && billcodes.push(item.values.jobcode.value);
                        });
                        this.state.defaultvalue.hasOwnProperty('values') &&
                        this.state.defaultvalue.hasOwnProperty('jobcode') &&
                        billcodes.push(this.state.defaultvalue.values.jobcode.value);
                         if(billcodes.length!= 0){
                             ajax({
                                 url: ajaxurl.cacelUrl,
                                 data: {billcodes: billcodes, nodeType: this.config.NODE_TYPE},
                                 success: (res) => {
                                     let {success, data} = res;
                                     if (success) {
                                        this.setState({
                                            defaultvalue:{}
                                        },()=>{
                                            props.editTable.setStatus(gridId, 'browse');
                                            props.editTable.cancelEdit(gridId);
                                            this.gridStatusChange();
                                            this.loadGridData(this.getLoadParmData(), () => {
                                            });
                                        })
                                     }
                                 }
                             });
                         }else{
                             props.editTable.setStatus(gridId, 'browse');
                             props.editTable.cancelEdit(gridId);
                             this.gridStatusChange();
                             this.loadGridData(this.getLoadParmData(), () => {
                             });
                         }
                    }
                });
                break;
            case 'btnEdit':
                if (alldata.length == 0) {
                    toast({color: 'warning', title: this.state.json['10100JOB-000008']});
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
                        let {success, data} = res;
                        if (success) {
                            props.editTable.setStatus(gridId, 'edit');
                            this.gridStatusChange();
                        }
                    }
                });
                break;
            case 'btnSave':
                setTimeout(() => {
                    props.editTable.filterEmptyRows(gridId, ['pk_org'],'include');
                    //???????????????????????????rows?????????
                    let changedRows = props.editTable.getChangedRows(gridId);
                    //???????????????
                    if(!props.editTable.checkRequired(props.config.gridId, changedRows)){
                        return;
                    }
                    //???????????????true false ??????
                    changedRows = convertGridEnablestateToSave(changedRows);
                    if (changedRows.length == 0) {
                        props.editTable.setStatus(gridId, 'browse');
                        this.gridStatusChange();
                        toast({title: this.state.json['10100JOB-000009'], color: 'success'});
                        /* ?????????????????? ???????????????*/
                        this.setState({
                            defaultvalue:{}
                        },()=>{
                            _this.loadGridData(_this.getLoadParmData());
                        });
                        return;
                    }
                    //??????ajax??????grid????????????
                    let paramdata = {
                        'NODE_TYPE': this.config.NODE_TYPE,
                        'pageid': props.config.pagecode,
                        'gridModel': {
                            'pageinfo': {},
                            'areacode': gridId,
                            'rows': changedRows
                        }
                    }
                   props.validateToSave(paramdata,()=>{
                       ajax({
                           url: ajaxurl.cacelUrl,
                           data: {
                               billcodes: !!this.state.defaultvalue && Object.keys(this.state.defaultvalue).length > 0 ? [this.state.defaultvalue.jobcode.value] : [],
                               nodeType: this.config.NODE_TYPE
                           },
                           success: (res) => {
                               let {success, data} = res;
                               if (success) {
                                   ajax({
                                       url: ajaxurl.saveAdd,
                                       data: paramdata,
                                       success: (res) => {
                                           let {success, data} = res;
                                           if (success) {
                                               props.editTable.setStatus(gridId, 'browse');
                                               this.gridStatusChange();
                                               toast({title: this.state.json['10100JOB-000009'], color: 'success'});
                                               /* ?????????????????? ???????????????*/
                                               this.setState({
                                                   defaultvalue:{}
                                               },()=>{
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
                   },{[gridId]:'grid'} , 'grid')
                }, 0);
                break;
            case 'btnDel':
                let delindexarr = [];
                if (rowsdata.length != 0) {
                    rowsdata.map((ele) => {
                        newData.push(ele.data);
                        delindexarr.push(ele.index);
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
                        (['1','2','3'].includes(paramData.gridModel.rows[0].values['enablestate'].value)) ?
                            paramData.gridModel.rows: convertGridEnablestateToSave(paramData.gridModel.rows);

                    if(props.editTable.getStatus(props.config.gridId) != 'browse'){
                        props.editTable.deleteTableRowsByIndex(gridId,delindexarr,false);
                    }else{
                        confirmUtil.call(this,{
                            title: this.state.json['10100JOB-000011'], /* ?????????????????? ??????*/
                            content: this.state.json['10100JOB-000002D'], /* ?????????????????? ???????????????????????????*/
                            beSureBtnClick: () => {
                                ajax({
                                    url: ajaxurl.delete,
                                    data: paramData,
                                    success: (res) => {

                                        let {success, data} = res;
                                        if (success) {
                                            this.loadGridData(this.getLoadParmData(), () => {
                                                toast({color: 'success', title: this.state.json['10100JOB-000001']});
                                                /* ?????????????????? ????????????*/
                                            });
                                            this.props.button.setButtonDisabled({
                                                'btnDel': true
                                            });
                                        } else {
                                            toast({color: 'danger', title: this.state.json['10100JOB-000013']});
                                            /* ?????????????????? ????????????*/
                                        }

                                    }
                                });
                            }
                        });
                    }
                } else {
                    toast({color: 'warning', title: this.state.json['10100JOB-000014']});
                    /* ?????????????????? ?????????????????????*/
                }
                break;
            case'btnRefrensh':
                this.loadGridData(this.getLoadParmData(), () => {
                    this.props.button.setButtonDisabled({
                        'btnDel': true
                    });
                    queryToastFunc.call(this)();
                });
                break;
            case'btnPrint':
            case'print':
                if (alldata.length === 0) {
                    toast({'color': 'warning', 'title': this.state.json['10100JOB-000015']});
                    /* ?????????????????? ????????????????????????*/
                    return;
                }

                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_job.value);
                });
                print(
                    'pdf',  //????????????: 'html'???????????????, 'pdf'???pdf??????
                    ajaxurl.printUrl,
                    {
                        funcode: '10100JOBB',      //????????????????????????????????????
                        nodekey: props.config.nodeKey,    //??????????????????
                        oids: pks,
                        appcode: '10100JOBB'
                    }
                );
                break;
            case'output':
                if (alldata.length === 0) {
                    toast({'color': 'warning', 'title': this.state.json['10100JOB-000015']});
                    /* ?????????????????? ????????????????????????*/
                    return;
                }

                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_job.value);
                });
                output({
                    url: ajaxurl.printUrl,
                    data: {
                        funcode: props.config.appcode,      //????????????????????????????????????
                        outputType: 'output',
                        nodekey: props.config.nodeKey,
                        oids: pks    //???['1001A41000000000A9LR','1001A410000000009JDD']  ??????pk  oids????????????????????????????????????,
                    }
                });
                break;
            default:
                break;
        }
    }

//???????????????????????????
    onClickSearchBtn(props, data) {
        let {searchId, datasource} = this.config;
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
                let {success, data} = res;
                if (success) {
                    this.loadGridData(this.getLoadParmData(), () => {
                        toast({color: 'success', title: this.state.json['10100JOB-000016']});
                        /* ?????????????????? ????????????*/
                    });
                } else {
                    toast({color: 'danger', title: this.state.json['10100JOB-000017']});
                    /* ?????????????????? ????????????*/
                    this.loadGridData(this.getLoadParmData());
                }
            }
        });
    }
    disableToogle = (Changerows, paramdata) => {
        Changerows =convertGridEnablestateToSave(Changerows);
        paramdata.gridmodel.rows.push(Changerows[0]);
        ajax({
            url: ajaxurl.disable,
            data: paramdata,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    this.loadGridData(this.getLoadParmData(), () => {
                        toast({color: 'success', title: this.state.json['10100JOB-000018']});
                        /* ?????????????????? ????????????*/
                    });
                } else {
                    toast({color: 'danger', title: this.state.json['10100JOB-000019']});
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
        let {gridId} = props.config;
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
                let rem = manageModeUtils.call(this,props.config.NODE_TYPE, rocordval.pk_org.value, rocordval.pk_group.value, '', getBusinessInfo().groupId);
                //?????????????????????????????? ????????????record???enablestate????????????????????? ????????????record????????????????????????
                record.values.enablestate.value = !record.values.enablestate.value;
                let Changerows = [record];
                if (value) {//???????????????
                    rem.editFlag && this.enableToogle(Changerows, paramdata);
                    rem.editFlag || toast({'color': 'warning', 'title': rem.message});
                } else {//???????????????
                    rem.editFlag && this.disableToogle(Changerows, paramdata);
                    rem.editFlag || toast({'color': 'warning', 'title': rem.message});
                }
                break;
        }
        // if (Object.keys(this.state.defaultvalue).length !== 0 && index == allrows - 1 && (record.values.jobcode.value && !this.state.userJson || !record.values.jobcode.value && this.state.userJson)) {
        //     this.props.editTable.setValByKeyAndIndex(moduleId, allrows - 1, 'pk_group', this.state.defaultvalue.values['pk_group'].value ? this.state.defaultvalue.values['pk_group'] : record.values.pk_group);
        //     this.props.editTable.setValByKeyAndIndex(moduleId, allrows - 1, 'pk_org', this.state.defaultvalue.values['pk_org'].value ? this.state.defaultvalue.values['pk_org'] : record.values.pk_org);
        //     this.props.editTable.setValByKeyAndIndex(moduleId, allrows - 1, 'enablestate', this.state.defaultvalue.values['enablestate']);
        //     this.props.editTable.setValByKeyAndIndex(moduleId, allrows - 1, 'jobcode', this.state.defaultvalue.values['jobcode'].value ? this.state.defaultvalue.values['jobcode'] : record.values.jobcode);
        //     this.props.editTable.setValByKeyAndIndex(moduleId, allrows - 1, 'pvtjobgrade', this.state.defaultvalue.values['pvtjobgrade'].value ? this.state.defaultvalue.values['pvtjobgrade'] : record.values.pvtjobgrade);
        //     this.props.editTable.setValByKeyAndIndex(moduleId, allrows - 1, 'pk_jobtype', this.state.defaultvalue.values['pk_jobtype'].value ? this.state.defaultvalue.values['pk_jobtype'] : record.values.pk_jobtype);
        //     this.setState({
        //         defaultvalue: {}
        //     });
        // }

    }

//??????????????????????????????
    gridStatusChange() {
        let {gridId} = this.props.config;
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

        if(gridStatus === 'browse'){
            //????????????????????????
            this.props.editTable.setTableData(this.config.gridId,this.state.queryData);
        }else{
            //????????????????????????
            let copydata = Utils.clone(this.state.queryData);
            copydata.rows = convertGridEnablestateToSave(copydata.rows);
            this.props.editTable.setTableData(this.config.gridId,copydata);
        }
        this.props.button.setMainButton('btnAdd', gridStatus === 'browse');
    }

//?????????????????????
    gridBeChecked(props, moduleId, record, index, status) {
        let {gridId} =  props.config;
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
        let {gridId} = this.config;

        ajax({
            url: ajaxurl.add,
            data: {
                'NODE_TYPE': this.config.NODE_TYPE,
                'pagecode': this.config.pagecode,
                'areacode': this.config.gridId,
                'pk_org': this.state.context.pk_org
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    this.setState({
                        userJson: data['userjson'] || data['userjson'] === 'false' ? true : false
                    }, () => {
                        let meta = this.props.meta.getMeta();
                        let obj = meta[gridId]['items'].find(item => item.attrcode === 'jobcode');
                        obj.disabled = data['userjson'] || data['userjson'] === 'false' ? true : false;
                        this.props.meta.setMeta(meta,()=>{
                            if( this.props.editTable.getStatus(gridId) == 'browse'){
                                this.props.editTable.setStatus(gridId,'edit');
                                this.gridStatusChange();
                            }
                            this.props.editTable.filterEmptyRows(gridId, ['enablestate'],'except');
                            this.props.editTable.addRow(gridId,
                                this.props.editTable.getNumberOfRows(gridId),
                                true,
                                data[gridId]['rows'][0].values);
                        });
                    });
                }
            }
        });
    }
    addRowCallback = () => {
        // const {gridId} = this.props.config;
        // ajax({
        //     url: ajaxurl.add,
        //     data: {
        //         'NODE_TYPE': this.config.NODE_TYPE,
        //         'pagecode': this.config.pagecode,
        //         'areacode': this.config.gridId,
        //         'pk_org': this.state.context.pk_org
        //     },
        //     success: (res) => {
        //         let {success, data} = res;
        //         if (success) {
        //             this.setState({
        //                 defaultvalue: data[gridId]['rows'][0],
        //                 userJson: data['userjson'] || data['userjson'] === 'false' ? true : false
        //
        //             })
        //         }
        //     }
        // });
    }
    renderPage = () => {
        const {editTable, button, search} = this.props;
        const {gridId,searchId} = this.props.config;
        const {createButtonApp} = button;
        const {NCCreateSearch} = search;
        const {createEditTable} = editTable;
        const status = this.props.editTable.getStatus(gridId);
        return (
            <div className="nc-single-table">
                {/* ?????? header */}
                <div className="nc-singleTable-header-area">
                    {/* ?????? title */}
                    <div className="header-title-search-area">
                        <h2 className="title-search-detail">{this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10100JOB-000021'] : this.state.json['10100JOB-000022']}</h2>
                        {/* ????????????  showOff*/}
                        <div className="title-search-detail" style={{display: status === 'browse' ? '' : 'none'}}>
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
                </div>
                <div className="nc-singleTable-search-area" style={{display: status === 'browse' ? '' : 'none'}}>
                    {NCCreateSearch(searchId, {
                        clickSearchBtn: this.onClickSearchBtn.bind(this)
                    })}
                </div>
                {/* ????????? */}
                <div className="nc-singleTable-table-area">
                    {createEditTable(gridId, {
                        onCloseModel: this.onCloseTableModel.bind(this),
                        tableModelConfirm: this.onModelConfirm.bind(this),
                        onAfterEvent: this.onTableModelAfterEdit.bind(this),
                        onSelected: this.gridBeChecked.bind(this),
                        onSelectedAll: this.onSelectedAll.bind(this),
                        onBeforeEvent: tableBeforeEvent.bind(this),
                        isAddRow: true,
                        addRowCallback: this.addRowCallback.bind(this),
                        showCheck: true,
                        showIndex: true
                    })}
                </div>
            </div>
        )

    }

    render() {
        return (<div>{this.state.loadLang ? this.renderPage() : <div/>}</div>)
    }
}
export default JobEditTable

//+/6MmEjE+wtmyervEGWHwbtBSRBcXFK/wMaUYd7wE6KpGqpS6hfbRgluX24IZmk1