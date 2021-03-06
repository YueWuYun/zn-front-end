//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createPage, ajax, base, toast, cardCache, print, output, getBusinessInfo,createPageIcon} from 'nc-lightapp-front';

const {setDefData, getDefData} = cardCache;
import {initTemplate} from './events/lifeCycle';
import Utils from '../../../public/utils/index';
const {queryToastFunc, convertGridEnablestateToShow,convertGridEnablestateToSave} = Utils;
import confirmUtil from '../../../public/pubComponent/confirmUtil/confirmUtil';
import PostBatchAddModal from '../batchAdd/PostBatchAddModal';
import tableButtonClick from "./events/lifeCycle/tableButtonClick";
import './index.less'
const { NCDiv } = base;
const {NCCheckbox} = base;
let gridId = 'GRID10100POST';
let searchId = '10100POST_search';
let pagecode = '10100POST_post';
let appcode = '10100POST';
let nodeKey = 'PostPrint';
let batchGridId = '10100POSTGRID4BatchAdd';
let datasource = 'uapbd_post_mainlist';
let ajaxurl = {
    queryPage: '/nccloud/uapbd/post/querypost.do',
    queryPagination: '/nccloud/uapbd/post/querypostbypage.do',
    add: '/nccloud/uapbd/post/add.do',
    edit: '/nccloud/uapbd/post/edit.do',
    copy: '/nccloud/uapbd/post/copypost.do',
    saveAdd: '/nccloud/uapbd/post/addsave.do',
    delete: '/nccloud/uapbd/post/deletepost.do',
    enable: '/nccloud/uapbd/post/enablepost.do',
    disable: '/nccloud/uapbd/post/disablepost.do',
    printUrl: '/nccloud/uapbd/post/print.do',
    cancelURl: '/nccloud/uapbd/post/cancelAdd.do',
    afterEdit:'/nccloud/uapbd/post/afterEdit.do'
}

/**
 * author zhenmx
 *
 */
class PostEditTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadLang:false,
            searchValue: '',
            checkValue: null,
            queryGridData: [],
            defaultAddValue:{},
            context: {},
            oid: '',
            json: {},
            x: '',
            userJson:'',
            rollbackcodeObj:[]
        }
        this.config = {
            NODE_TYPE: '',
        };
        let tempParam = {
            pagecode: pagecode
        }, langParam = {
            moduleId: "10100POST_NCC", domainName: 'uapbd'
        }
        this.loadTempAndLang(props,tempParam,langParam,(tempdata, mutiJson, inlt)=>{
            this.resetStateAfterLoadLang(mutiJson,inlt,tempdata,(data)=>{
                let me = this;
                if (data) {
                    let meta = data.template;
                    let context = data.context;
                    if (data.button) {
                        me.props.button.setButtons(data.button);
                        me.props.button.setPopContent('oprDeleteBrowse', me.state.json['10100POST-000036'])
                    }
                    meta = me.modifierMeta(me.props, meta, context);
                    me.props.meta.setMeta(meta,()=>{
                        me.gridStatusChange(props);
                    });

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
        props.MultiInit.getMultiLang(Object.assign(langParam,{callback:langCallback}));
    }

    resetStateAfterLoadLang = (mutiJson,inlt,tempdata,callback) => {
        this.state.oid = tempdata['template'][searchId].oid;
        this.state.context = tempdata.context;
        this.state.json = mutiJson;
        this.state.x = inlt;
        this.state.loadLang = true;
        this.setState(this.state, callback.call(this,tempdata))
    }

    modifierMeta = (props, meta, context) => {
        meta[gridId].showindex = true;
        meta[gridId].status = 'browse';
        //?????????
        let pk_deptItemSearch = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_dept');
        pk_deptItemSearch.isShowUnit = true;
        //?????????pk_org
        let pk_orgitem = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_org');
        let pk_orgdata = {value: context.pk_org, display: context.org_Name};
        pk_orgitem.initialvalue = pk_orgdata;
        let grid_pk_org_item = meta[gridId]['items'].find(item => item['attrcode'] === 'pk_org');
        grid_pk_org_item.queryCondition = () => {
            return {
                AppCode: appcode,
                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
            }
        }
        //?????????????????????
        meta[searchId]['items'].find((i) => i.attrcode === 'suporior').queryCondition = () => {
            return {
                isDataPowerEnable: true
            }
        }

        meta[gridId].items.find(i=> i.attrcode === 'enablestate').offPopconfirmCont = '????????????????????????????????????????????????????????????';
        meta[gridId].items.find(i=> i.attrcode === 'enablestate').onPopconfirmCont = '????????????????????????????????????';
        //???????????????
        meta[gridId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100POST-000037'], /* ?????????????????? ??????*/
            itemtype: 'customer',
            width: 150,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                let buttonAry =
                    props.editTable.getStatus(gridId) === "browse"
                        ? ['oprEdit', 'oprDeleteBrowse']
                        : ['oprExtend', 'oprDelete'];

                return this.props.button.createOprationButton(buttonAry, {
                    area: 'currency-opr-col',
                    buttonLimit: 2,
                    onButtonClick: tableButtonClick.bind(this, record, index)
                });
            }
        });
        return meta;
    }

    componentDidMount() {
        // this.props.editTable.setTableData(gridId, {rows: []});
        this.props.button.setMainButton('btnAdd',true);
        this.props.button.setButtonsVisible({
            'btnSave': false,
            'btnCancel': false,
            'btnGrpAdd':false,
        });
        this.props.button.setButtonDisabled({
            'btnEdit':true,
            'btnDel': true,
            'btnCopy': true,
            'btnPrint': true,
            'output': true
        });

    }

    componentWillMount() {
    }
    componentDidUpdate() {
        let gridStatus = this.props.editTable.getStatus(gridId);
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
        let checkedVal = getDefData('checkedVal', datasource);
        let searchVal = getDefData('searchVal', datasource);
        let pageInfo = this.props.editTable.getTablePageInfo(gridId);
        //??????????????????????????????????????????????????????enablestate = '2' ???????????????
        let paramdata = {
            custcondition: {
                conditions: []
            },
            queryAreaCode: searchId,
            querycondition: searchVal,
            oid: this.state.oid,
            querytype: 'tree',
            appcode: appcode,
            pageInfo: pageInfo,
            pageCode: pagecode,
            userdefObj: {
                gridId: gridId
            }
        };
        if (!checkedVal) {
            paramdata.custcondition.conditions.push({
                field: 'enablestate',
                display: this.state.json['10100POST-000038'], /* ?????????????????? ????????????*/
                oprtype: '=',
                value: {firstvalue: '2', secondvalue: null}
            });
        }
        return paramdata;
    }
    //??????????????????
    loadGridData = (paramData, callback) => {
        let _this = this;
        let requestUrl, requestParam;
        if (paramData instanceof Array) {
            if (paramData.length === 0) {
                return;
            }
            requestUrl = ajaxurl.queryPagination;
            requestParam = {
                pks: paramData,
                pagecode: pagecode,
                areacode: gridId,
                appcode: appcode
            }
        } else {
            requestUrl = ajaxurl.queryPage;
            requestParam = paramData;
        }
        ajax({
            url: requestUrl,
            data: requestParam,
            success: function (res) {
                let {success, data} = res;
                if (success) {
                    if (data && data[gridId]['rows']) {
                        //???????????????????????? 123 ??????true false
                        _this.setState({queryGridData:data[gridId]},()=>{
                            data[gridId].rows = convertGridEnablestateToShow(data[gridId].rows);
                            _this.props.editTable.setTableData(gridId, data[gridId]);
                            _this.props.button.setButtonDisabled({
                                'btnPrint': false,
                                'output': false,
                                'btnEdit':false
                            });
                            _this.props.button.setButtonDisabled({
                                'btnDel': true,
                                'btnCopy': true,
                            });
                        });
                        callback && callback.call(this, data[gridId]['allpks'])
                    } else {
                        _this.props.button.setButtonDisabled({
                            'btnPrint': true,
                            'output': true,
                            'btnDel': true,
                            'btnCopy': true,
                            'btnEdit':true
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
    addRowCallback = () => {
        // this.props.editTable.updateDataByIndexs(gridId,[{
        //     index:this.props.editTable.getNumberOfRows(gridId)-1,
        //     data:this.state.defaultAddValue}
        //     ]);
    }
    addpost = () => {
        if( this.props.editTable.getStatus(gridId) == 'browse'){
            this.props.editTable.setStatus(gridId,'edit');
            this.gridStatusChange();
        }
        Object.keys(this.state.defaultAddValue).length  > 0 ||  ajax({
            url: ajaxurl.add,
            data: {
                'NODE_TYPE': this.config.NODE_TYPE,
                'pk_org': this.state.context.pk_org
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    this.setState({
                        userJson:data['userjson'] || data['userjson'] === 'false' ? true : false,
                        defaultAddValue:data[gridId]['rows'][0]
                    },()=>{
                        this.props.editTable.addRow(
                            gridId,
                            this.props.editTable.getNumberOfRows(gridId),
                            true,
                            data[gridId]['rows'][0].values
                        );
                    });
                }
            }
        });
        Object.keys(this.state.defaultAddValue).length  > 0 && this.props.editTable.addRow(gridId, this.props.editTable.getNumberOfRows(gridId), true, this.state.defaultAddValue.values);
        this.props.editTable.setValByKeyAndIndex(gridId, this.props.editTable.getNumberOfRows(gridId), 'enablestate', {value: '2'})
    }
    //??????????????????
    onClickButton(props, id) {
        let _this = this;
        //?????????????????????
        let rowsdata = props.editTable.getCheckedRows(gridId);
        //??????????????????
        let alldata = props.editTable.getAllRows(gridId, true);
        let allTabledata = props.editTable.getAllData(gridId);
        let status = this.props.editTable.getStatus(gridId)
        let pks = [];
        let newData = [];
        switch (id) {
            case'btnGrpAdd':
            case 'btnAdd':
                this.addpost.call(this);
                break;
            case 'btnCancel':
                confirmUtil.call(this,{
                    title: this.state.json['10100POST-000056'], /* ?????????????????? ?????????*/
                    content: this.state.json['10100POST-000040'], /* ?????????????????? ?????????????????????*/
                    beSureBtnClick: () => {
                        let billcodes = [];
                        alldata.map((item) => {
                            !!!item.values.pk_post.value && item.values.postcode.value && billcodes.push(
                                {pk_org:item.values.pk_org.value,
                                postcode:item.values.postcode.value});
                        });
                        //
                        this.state.rollbackcodeObj.length >0 && this.state.rollbackcodeObj.map((item)=>{
                            billcodes.push(item);
                        })
                        if(billcodes.length != 0){
                            //????????????
                            ajax({
                                url: ajaxurl.cancelURl,
                                data: {
                                    billcodeobj:billcodes
                                },
                                success: (res) => {
                                    let {success, data} = res;
                                    if (success) {
                                        this.setState({
                                            rollbackcodeObj:[],
                                            defaultAddValue:{}
                                        },()=>{
                                            props.editTable.setStatus(gridId, 'browse');
                                            props.editTable.cancelEdit(gridId);
                                            this.gridStatusChange();
                                        });

                                    }
                                }
                            });
                        }else{
                            this.setState({
                                rollbackcodeObj:[],
                                defaultAddValue:{}
                            },()=>{
                                props.editTable.setStatus(gridId, 'browse');
                                props.editTable.cancelEdit(gridId);
                                this.gridStatusChange();
                            });

                        }
                        //??????????????????????????????
                        // props.editTable.filterEmptyRows(gridId,['pk_org','postcode','postname','enablestate','pk_group','pk_dept','pk_job','pk_postseries']);
                        this.loadGridData(this.getLoadParmData());
                    },
                    leftBtnName:this.state.json['10100POST-000057'],
                    rightBtnName:this.state.json['10100POST-000056']
                });
                break;
            case 'btnEdit':
                alldata.length === 0 && toast({color: 'info', title: this.state.json['10100POST-000041']});
                /* ?????????????????? ???????????????????????????*/
                alldata.length !== 0 && ajax({
                    url: ajaxurl.edit,
                    data: {
                        model: {
                            rows: convertGridEnablestateToSave(allTabledata.rows),
                        },
                        pageid: pagecode
                    },
                    success: (res) => {
                        let {success, data} = res;
                        success && props.editTable.setStatus(gridId, 'edit');
                        this.gridStatusChange();
                    }
                });

                break;
            case 'btnSave':
               setTimeout(()=>{
                   props.editTable.filterEmptyRows(gridId,['pk_org'],'include');
                   //???????????????????????????rows?????????
                   let changedRows = props.editTable.getChangedRows(gridId);
                   //???????????????true false ??????
                   //???????????????
                   if(!props.editTable.checkRequired(gridId, props.editTable.getAllData(gridId).rows)){
                        return;
                   }
                   changedRows = convertGridEnablestateToSave(changedRows);
                   if (changedRows.length == 0 && this.state.rollbackcodeObj.length == 0) {
                       props.editTable.setStatus(gridId, 'browse');
                       this.gridStatusChange();
                       toast({title: this.state.json['10100POST-000042'], color: 'success'});
                       /* ?????????????????? ???????????????*/
                       this.setState({
                           defaultAddValue:{},
                           rollbackcodeObj:[]
                       },()=>{
                           this.loadGridData(this.getLoadParmData());
                       })
                       return;
                   }
                   //??????ajax??????grid????????????
                   let paramdata = {
                       'pageid': pagecode,
                       'gridModel': {
                           'pageinfo': {},
                           'areacode': gridId,
                           'rows': changedRows
                       }
                   }
                   props.validateToSave(paramdata,()=>{
                       //?????????????????????????????????????????????????????????
                       let billcodeobj = [];
                       this.state.rollbackcodeObj.length >0 &&this.state.rollbackcodeObj.map((item)=>{
                           billcodeobj.push(item);
                       });
                       ajax({
                           url: ajaxurl.cancelURl,
                           data: {
                               billcodeobj: billcodeobj
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
                                               toast({title: this.state.json['10100POST-000042'], color: 'success'});
                                               /* ?????????????????? ???????????????*/
                                               this.setState({
                                                   defaultAddValue:{},
                                                   rollbackcodeObj:[]
                                               },()=>{
                                                   this.loadGridData(this.getLoadParmData());
                                               })

                                           }
                                       }
                                   });
                               }
                           }
                       });
                   },{[gridId]:'grid'} , 'grid' );
               },0);
                break;
            case 'btnDel':
                let delindexarr = [];
                let rollbackcodearr =[];
                if (rowsdata.length != 0) {
                    rowsdata.map((ele) => {
                        newData.push(ele.data);
                        delindexarr.push(ele.index);
                        if(!!!ele.data.values.pk_post.value
                            && !!ele.data.values.pk_org.value
                            && !!ele.data.values.postcode.value ){
                            rollbackcodearr.push({
                                pk_org:ele.data.values.pk_org.value,
                                postcode:ele.data.values.postcode.value
                            })
                        }
                    });
                    let paramData = {
                        'pageid': pagecode,
                        'gridModel': {
                            'pageinfo': {},
                            'areacode': gridId,
                            'rows': newData
                        }
                    }
                    //????????????????????????enablestate?????????????????????????????? true false ?????????????????????????????? ??????123
                    //???????????????????????????enablestate??????????????????123???????????????????????????
                    paramData.gridModel.rows =
                        paramData.gridModel.rows.length>0 &&
                        (['1','2','3'].includes(paramData.gridModel.rows[0].values['enablestate'].value)) ?
                            paramData.gridModel.rows:convertGridEnablestateToSave(paramData.gridModel.rows);
                    //??????????????????????????????????????????????????????
                    if(props.editTable.getStatus(gridId) != 'browse'){
                        this.setState({
                            rollbackcodeObj: rollbackcodearr
                        },()=>{
                            props.editTable.deleteTableRowsByIndex(gridId,delindexarr,false);
                        })

                    }else{
                        confirmUtil.call(this,{
                            title: this.state.json['10100POST-000043'], /* ?????????????????? ??????*/
                            content: this.state.json['10100POST-000044'], /* ?????????????????? ???????????????????????????*/
                            beSureBtnClick: () => {
                                ajax({
                                    url: ajaxurl.delete,
                                    data: paramData,
                                    success: (res) => {

                                        let {success, data} = res;
                                        if (success) {
                                            this.loadGridData(this.getLoadParmData(), () => {
                                                toast({color: 'success', title: this.state.json['10100POST-000034']});
                                                /* ?????????????????? ????????????*/
                                            });
                                        } else {
                                            toast({color: 'danger', title: this.state.json['10100POST-000045']});
                                            /* ?????????????????? ????????????*/
                                        }

                                    }
                                });
                            }
                        });
                    }

                } else {
                    toast({color: 'info', title: this.state.json['10100POST-000046']});
                    /* ?????????????????? ?????????????????????*/
                }
                break;
            case 'btnRefrensh':
                this.loadGridData(this.getLoadParmData(), () => {
                    this.props.button.setButtonDisabled({
                        'btnDel': true,
                        'btnCopy': true
                    });
                    queryToastFunc.call(this)();
                });
                break;
            case 'btnCopy':
                if (rowsdata.length === 1) {
                    //???????????????????????????????????????????????????????????????
                    rowsdata.map((ele) => {
                        newData.push(ele.data);
                    })
                    let paramData = {
                        'pageid': pagecode,
                        'gridModel': {
                            'pageinfo': {},
                            'areacode': gridId,
                            'rows': newData
                        },
                        'userjson': this.state.context.pk_org
                    }
                    //???????????????true/false???????????????
                    paramData.gridModel.rows = convertGridEnablestateToSave(paramData.gridModel.rows);
                    ajax({
                        url: ajaxurl.copy,
                        data: paramData,
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                if(data){
                                    this.props.editTable.setStatus(gridId,'edit');
                                    this.gridStatusChange();
                                    let l = props.editTable.getAllRows(gridId, false).length;//??????????????????
                                    data[gridId].rows && props.editTable.addRow(gridId, l, true, data[gridId].rows[0].values);
                                    let meta = props.meta.getMeta();
                                    let obj = meta[gridId]['items'].find(item => item.attrcode === 'postcode');
                                    obj.disabled = data['userjson'] || data['userjson'] === 'false' ? true : false;
                                    props.meta.setMeta(meta, () => {
                                        props.editTable.selectAllRows(gridId, false);//??????????????????
                                    });
                                }

                            }
                        }
                    });

                } else {
                    toast({color: 'info', title: this.state.json['10100POST-000047']});
                    /* ?????????????????? ??????????????????????????????*/
                }
                break;
            case'btnPrint':
            case'print':
                if (alldata.length === 0) {
                    toast({'color': 'info', 'title': this.state.json['10100POST-000048']});
                    /* ?????????????????? ????????????????????????*/
                    return;
                }
                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_post.value);
                });
                var tableorder = this.props.editTable.getSortParam(gridId);
                print(
                    'pdf',  //????????????: 'html'???????????????, 'pdf'???pdf??????
                    ajaxurl.printUrl,
                    {
                        funcode: appcode,      //????????????????????????????????????
                        nodekey: nodeKey,    //??????????????????
                        oids: pks,
                        appcode: appcode,
                        userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`,
                    }
                );
                break;
            case'output':
                if (alldata.length === 0) {
                    toast({'color': 'info', 'title': this.state.json['10100POST-000049']});
                    /* ?????????????????? ????????????????????????*/
                    return;
                }
                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_post.value);
                });
                var outorder = this.props.editTable.getSortParam(gridId);
                output({
                    url: ajaxurl.printUrl,
                    data: {
                        funcode: appcode,      //????????????????????????????????????
                        outputType: 'output',
                        nodekey: nodeKey,
                        oids: pks,    //???['1001A41000000000A9LR','1001A410000000009JDD']  ??????pk  oids????????????????????????????????????,
                        userjson:`{order:${outorder  && outorder.sortParam[0].order},field:${outorder  && outorder.sortParam[0].field}}`,
                    }
                });
                break;
            case'btnAddBatch':
                this.postBatchAddModal.show();
                break;
            default:
                break;
        }
    }

    //???????????????????????????
    onClickSearchBtn(props, data) {
        const _this = this;
        let searchData = _this.props.search.getAllSearchData(searchId);
        setDefData('searchVal', datasource, searchData);
        if (typeof (searchData) !== 'undefined' && searchData && searchData.conditions) {
            _this.loadGridData(_this.getLoadParmData(), (param) => {
                queryToastFunc.call(this)(param)
            })
        } else {
            return;
        }
    }

    //?????????????????????????????????
    onModelConfirm(props, data, type) {
    }

    //??????????????????????????????
    onCheckShowDisable(checked) {
        setDefData('checkedVal', datasource, checked);
        this.loadGridData(this.getLoadParmData()
            //     (param)=>{
            //     queryToastFunc()(param);
            // }
        );
    }

    //????????????????????????
    //??????????????????????????????????????????????????????????????????pk_org?????????,???????????????????????????????????????
    onTableBeforeEdit = (props, moduleId, item, index, value, record) => {
        let meta = props.meta.getMeta();
        switch (item.attrcode) {
            case 'pk_dept':
                let deptItem = meta[gridId]['items'].find(i => i.attrcode === 'pk_dept');
                deptItem.isShowUnit = false;
                deptItem.queryCondition = () => {
                    return {
                        pk_org: record.values.pk_org.value
                    }
                }
            case'suporior':
                //????????????????????????????????????????????????
                let postItem = meta[gridId]['items'].find(i => i.attrcode === 'suporior');
                postItem.queryCondition = () => {
                    return {
                        pk_org: record.values.pk_org.value,
                        GridRefActionExt: 'nccloud.web.uapbd.org.post.extendRef.SuporiorExtendRef'
                    }
                }
                return true;
            default:
                return true;
        }
        props.meta.setMeta(meta);
    }

    //?????????????????????
    onTableAfterEdit(props, moduleId, key, value, changedrows, index, record) {
        //????????????
        let paramdata = {
            pageid: '10100POST_post',
            gridmodel: {
                areacode: gridId,
                pageinfo: {},
                rows: []
            }
        }
        switch (key) {
            case 'enablestate':
                //?????????????????????????????? ????????????record???enablestate?????????????????? ????????????record????????????????????????
                record.values.enablestate.value = !record.values.enablestate.value;
                let Changerows = [record];
                if (value) {
                    Changerows = convertGridEnablestateToSave(Changerows);
                    paramdata.gridmodel.rows.push(Changerows[0]);
                    ajax({
                        url: ajaxurl.enable,
                        data: paramdata,
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                this.loadGridData(this.getLoadParmData(), () => {
                                    toast({color: 'success', title: this.state.json['10100POST-000050']});
                                    /* ?????????????????? ????????????*/
                                });
                            }
                        }
                    });
                } else {
                    Changerows = convertGridEnablestateToSave(Changerows);
                    paramdata.gridmodel.rows.push(Changerows[0]);
                    ajax({
                        url: ajaxurl.disable,
                        data: paramdata,
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                this.loadGridData(this.getLoadParmData(), () => {
                                    toast({color: 'success', title: this.state.json['10100POST-000051']});
                                    /* ?????????????????? ????????????*/
                                });
                            }
                        }
                    });
                }
                break;
            case'pk_org':
                //???????????? ????????????????????? ?????????????????? ??????????????????????????????
                //????????????????????????????????? ????????????????????????????????????nc???????????????
                //??????????????????????????????????????????
                this.props.editTable.setValByKeyAndIndex
                (moduleId,index,'postcode',{value:null,display:null});
                //?????????????????? ????????????
                this.props.editTable.setValByKeyAndIndex
                (moduleId, index, 'pk_dept', {value: null, display: null});
                //?????????????????????????????????????????????????????????
                Object.keys(value).length != 0 &&  ajax({
                    url:ajaxurl.afterEdit,
                    data:{
                        pk_org:value.key || value.refpk,
                        actionName:key
                    },
                    success:(res)=>{
                        let {success,data} = res;
                        if(success){
                            if(data){
                                this.props.editTable.setEditableRowKeyByIndex
                                (moduleId,index,'postcode',data.canEdit=='false'?false:true);
                                this.props.editTable.setValByKeyAndIndex
                                (moduleId,index,'postcode',{value:data.billcode,display:data.billcode});

                            }
                        }
                    }
                });
                break;
        }
    }
    //??????????????????????????????
    gridStatusChange() {
        let gridStatus = this.props.editTable.getStatus(gridId);
        gridStatus === 'browse' ? this.props.button.setButtonsVisible({
            'btnSave': false,
            'btnCancel': false,
            'btnAdd': true,
            'btnAdd_1': true,
            'btnAddBatch': true,
            'btnGrpAdd': false,
            'btnEdit': true,
            'btnRefrensh': true,
            'btnPrint': true,
            'btnCopy': true
        }) : this.props.button.setButtonsVisible({
            'btnAdd': false,
            'btnAddBatch': false,
            'btnAdd_1': false,
            'btnGrpAdd': true,
            'btnEdit': false,
            'btnSave': true,
            'btnCancel': true,
            'btnRefrensh': false,
            'btnPrint': false,
            'btnCopy': false
        });
        if(gridStatus === 'browse'){
            //????????????????????????
            this.props.editTable.setTableData(gridId,this.state.queryGridData);
        }else{
            //????????????????????????
            let copydata = this.state.queryGridData;
            copydata.rows = convertGridEnablestateToSave(copydata.rows);
            this.props.editTable.setTableData(gridId,copydata);
        }
    }
    //?????????????????????
    gridBeChecked=(props, moduleId, record, index, status)=> {
        //????????????????????????????????????????????????
        let tableData = props.editTable.getCheckedRows(moduleId);
        let length = tableData.length;//????????????????????????????????????
        props.button.setButtonDisabled(['btnDel'], length > 0 ? false : true);
        props.button.setButtonDisabled(['btnCopy'], length == 1 ? false : true);
        this.setState(this.state);
    }
    onSelectedAll=(props, moduleId, status, length)=>{
        props.button.setButtonDisabled(['btnDel'], !status);
        props.button.setButtonDisabled(['btnCopy'], true);
        this.setState(this.state);
    }

    //??????????????????
    onHandlePageInfoChange = (props, config, pks) => {
        this.loadGridData(pks);
    }

    renderPage() {
        const {BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {editTable, button, search} = this.props;
        const {createButtonApp} = button;
        const {NCCreateSearch} = search;
        const {createEditTable} = editTable;
        const status = this.props.editTable.getStatus(gridId);
        let context = this.state.context, json = this.state.json;
        return (
            <div className="nc-single-table">
                <PostBatchAddModal ref={(item) => this.postBatchAddModal = item}
                                   {...this.props}
                                   {...{context: context, batchGridId: batchGridId, pagecode: pagecode, json: json}}/>
                {/* ?????? header */}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={status === 'browse' ? {}:{borderBottom: 'none'}}>
                    {/* ?????? title */}
                    <div className="header-title-search-area" >
                        {/* {createPageIcon()} */}

                            {createBillHeadInfo({
                                title:this.state.json['10100POST-000035'],
                                initShowBackBtn:false
                            }	
                            )}


                        {/* <h2 className="title-search-detail">{this.state.json['10100POST-000035']}</h2> */}
                        {/*??????h2?????????????????????????????????????????????div???className?????????title-search-detail?????????*/}
                        {/* ????????????  showOff*/}
                        <div className="title-search-detail" style={{display: status === 'browse' ? '' : 'none'}}>
                            <span className='showOff'>
                                <NCCheckbox onChange={this.onCheckShowDisable.bind(this)}
                                            checked={getDefData('checkedVal', datasource)}>{this.state.json['10100POST-000052']}</NCCheckbox>{/* ?????????????????? ????????????*/}
                            </span>
                        </div>
                    </div>
                    {/* ?????????  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',
                            buttonLimit: 4,
                            onButtonClick: this.onClickButton.bind(this),
                            //popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </NCDiv>

                <div className="nc-singleTable-search-area" style={{display: status === 'browse' ? '' : 'none'}}>
                    {NCCreateSearch(searchId, {
                        clickSearchBtn: this.onClickSearchBtn.bind(this)
                    })}
                </div>
                {/* ????????? */}
              <div className="nc-singleTable-table-area">
                    {createEditTable(gridId, {
                        fieldid:'postinfo',
                        handlePageInfoChange: this.onHandlePageInfoChange.bind(this),
                        tableModelConfirm: this.onModelConfirm.bind(this),
                        onAfterEvent: this.onTableAfterEdit.bind(this),
                        onBeforeEvent: this.onTableBeforeEdit.bind(this),
                        onSelected: this.gridBeChecked.bind(this),
                        onSelectedAll: this.onSelectedAll.bind(this),
                        // isAddRow: true,
                        addRowCallback: this.addRowCallback.bind(this),
                        showCheck: true,
                        showIndex: true,
                        showPagination: true,
						adaptionHeight:true
                    })}
                </div>

            </div>
        )

    }
    render(){
        return (<div>{this.state.loadLang ? this.renderPage() : <div/>}</div>)
    }
}

PostEditTable = createPage({
    billinfo:{
        billtype:'grid',
        pagecode:pagecode,
        headcode:gridId
    },
    initTemplate: initTemplate
})(PostEditTable);
ReactDOM.render(<PostEditTable/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65