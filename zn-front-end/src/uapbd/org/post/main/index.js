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
        //查询区
        let pk_deptItemSearch = meta[searchId]['items'].find(item => item['attrcode'] === 'pk_dept');
        pk_deptItemSearch.isShowUnit = true;
        //查询区pk_org
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
        //上级岗位使用权
        meta[searchId]['items'].find((i) => i.attrcode === 'suporior').queryCondition = () => {
            return {
                isDataPowerEnable: true
            }
        }

        meta[gridId].items.find(i=> i.attrcode === 'enablestate').offPopconfirmCont = '您确定要停用所选数据及其所有下级数据吗？';
        meta[gridId].items.find(i=> i.attrcode === 'enablestate').onPopconfirmCont = '您确定要启用所选数据吗？';
        //添加操作列
        meta[gridId].items.push({
            attrcode: 'opr',
            label: this.state.json['10100POST-000037'], /* 国际化处理： 操作*/
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
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }
    //获取loadGridData的参数
    getLoadParmData = () => {
        let checkedVal = getDefData('checkedVal', datasource);
        let searchVal = getDefData('searchVal', datasource);
        let pageInfo = this.props.editTable.getTablePageInfo(gridId);
        //如果没有勾选显示停用，查询条件里面的enablestate = '2' 只显示启用
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
                display: this.state.json['10100POST-000038'], /* 国际化处理： 启用状态*/
                oprtype: '=',
                value: {firstvalue: '2', secondvalue: null}
            });
        }
        return paramdata;
    }
    //加载列表数据
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
                        //表格数据启用状态 123 转化true false
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
    //按钮点击事件
    onClickButton(props, id) {
        let _this = this;
        //获取选中行数据
        let rowsdata = props.editTable.getCheckedRows(gridId);
        //获取所有数据
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
                    title: this.state.json['10100POST-000056'], /* 国际化处理： 询问？*/
                    content: this.state.json['10100POST-000040'], /* 国际化处理： 是否确定取消？*/
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
                            //回滚编码
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
                        //取消后过滤新增的空行
                        // props.editTable.filterEmptyRows(gridId,['pk_org','postcode','postname','enablestate','pk_group','pk_dept','pk_job','pk_postseries']);
                        this.loadGridData(this.getLoadParmData());
                    },
                    leftBtnName:this.state.json['10100POST-000057'],
                    rightBtnName:this.state.json['10100POST-000056']
                });
                break;
            case 'btnEdit':
                alldata.length === 0 && toast({color: 'info', title: this.state.json['10100POST-000041']});
                /* 国际化处理： 没有数据可以修改！*/
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
                   //获取新增或修改过的rows的数组
                   let changedRows = props.editTable.getChangedRows(gridId);
                   //停用启用值true false 转换
                   //必输项校验
                   if(!props.editTable.checkRequired(gridId, props.editTable.getAllData(gridId).rows)){
                        return;
                   }
                   changedRows = convertGridEnablestateToSave(changedRows);
                   if (changedRows.length == 0 && this.state.rollbackcodeObj.length == 0) {
                       props.editTable.setStatus(gridId, 'browse');
                       this.gridStatusChange();
                       toast({title: this.state.json['10100POST-000042'], color: 'success'});
                       /* 国际化处理： 保存成功！*/
                       this.setState({
                           defaultAddValue:{},
                           rollbackcodeObj:[]
                       },()=>{
                           this.loadGridData(this.getLoadParmData());
                       })
                       return;
                   }
                   //定义ajax回传grid参数结构
                   let paramdata = {
                       'pageid': pagecode,
                       'gridModel': {
                           'pageinfo': {},
                           'areacode': gridId,
                           'rows': changedRows
                       }
                   }
                   props.validateToSave(paramdata,()=>{
                       //保存前回滚不需要保存但是已经生成的编码
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
                                               /* 国际化处理： 保存成功！*/
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
                    //正常从表格获取到enablestate字段的时候是布尔类型 true false 传到后台前需要转换成 枚举123
                    //如果现在表格的数据enablestate已经是枚举值123了就不需要再转了。
                    paramData.gridModel.rows =
                        paramData.gridModel.rows.length>0 &&
                        (['1','2','3'].includes(paramData.gridModel.rows[0].values['enablestate'].value)) ?
                            paramData.gridModel.rows:convertGridEnablestateToSave(paramData.gridModel.rows);
                    //如果是编辑态点击左上删除按钮是假删除
                    if(props.editTable.getStatus(gridId) != 'browse'){
                        this.setState({
                            rollbackcodeObj: rollbackcodearr
                        },()=>{
                            props.editTable.deleteTableRowsByIndex(gridId,delindexarr,false);
                        })

                    }else{
                        confirmUtil.call(this,{
                            title: this.state.json['10100POST-000043'], /* 国际化处理： 删除*/
                            content: this.state.json['10100POST-000044'], /* 国际化处理： 确定删除所选数据？*/
                            beSureBtnClick: () => {
                                ajax({
                                    url: ajaxurl.delete,
                                    data: paramData,
                                    success: (res) => {

                                        let {success, data} = res;
                                        if (success) {
                                            this.loadGridData(this.getLoadParmData(), () => {
                                                toast({color: 'success', title: this.state.json['10100POST-000034']});
                                                /* 国际化处理： 删除成功*/
                                            });
                                        } else {
                                            toast({color: 'danger', title: this.state.json['10100POST-000045']});
                                            /* 国际化处理： 删除失败*/
                                        }

                                    }
                                });
                            }
                        });
                    }

                } else {
                    toast({color: 'info', title: this.state.json['10100POST-000046']});
                    /* 国际化处理： 请选择数据操作*/
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
                    //复制多个职位，去后台查询这些职位的最新信息
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
                    //将启用状态true/false转化为数字
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
                                    let l = props.editTable.getAllRows(gridId, false).length;//获取当前行号
                                    data[gridId].rows && props.editTable.addRow(gridId, l, true, data[gridId].rows[0].values);
                                    let meta = props.meta.getMeta();
                                    let obj = meta[gridId]['items'].find(item => item.attrcode === 'postcode');
                                    obj.disabled = data['userjson'] || data['userjson'] === 'false' ? true : false;
                                    props.meta.setMeta(meta, () => {
                                        props.editTable.selectAllRows(gridId, false);//取消选择状态
                                    });
                                }

                            }
                        }
                    });

                } else {
                    toast({color: 'info', title: this.state.json['10100POST-000047']});
                    /* 国际化处理： 请选择一条数据操作！*/
                }
                break;
            case'btnPrint':
            case'print':
                if (alldata.length === 0) {
                    toast({'color': 'info', 'title': this.state.json['10100POST-000048']});
                    /* 国际化处理： 请查询打印数据！*/
                    return;
                }
                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_post.value);
                });
                var tableorder = this.props.editTable.getSortParam(gridId);
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    ajaxurl.printUrl,
                    {
                        funcode: appcode,      //功能节点编码，即模板编码
                        nodekey: nodeKey,    //模板节点标识
                        oids: pks,
                        appcode: appcode,
                        userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`,
                    }
                );
                break;
            case'output':
                if (alldata.length === 0) {
                    toast({'color': 'info', 'title': this.state.json['10100POST-000049']});
                    /* 国际化处理： 请查询输出数据！*/
                    return;
                }
                alldata.forEach((item, index) => {
                    pks.push(item.values.pk_post.value);
                });
                var outorder = this.props.editTable.getSortParam(gridId);
                output({
                    url: ajaxurl.printUrl,
                    data: {
                        funcode: appcode,      //功能节点编码，即模板编码
                        outputType: 'output',
                        nodekey: nodeKey,
                        oids: pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
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

    //查询区按钮点击事件
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

    //新增编辑模态框保存事件
    onModelConfirm(props, data, type) {
    }

    //显示停用按钮点击事件
    onCheckShowDisable(checked) {
        setDefData('checkedVal', datasource, checked);
        this.loadGridData(this.getLoadParmData()
            //     (param)=>{
            //     queryToastFunc()(param);
            // }
        );
    }

    //表格编辑前事件，
    //参照过滤条件应该在参照编辑前的时候把当前行的pk_org传进去,而不是当前行所属组织编辑后
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
                //上级岗位参照设置所选数据组织过滤
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

    //表格编辑后事件
    onTableAfterEdit(props, moduleId, key, value, changedrows, index, record) {
        //获取行数
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
                //点击的停用启用的时候 获取到的record的enablestate是点击后的值 所以拿到record的时候要反置一下
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
                                    /* 国际化处理： 启用成功*/
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
                                    /* 国际化处理： 停用成功*/
                                });
                            }
                        }
                    });
                }
                break;
            case'pk_org':
                //组织变化 如果有编码规则 已经生成编码 先清空已经生成的编码
                //如果编码规则设置了回滚 这里也不回滚，同样的操作nc是不回滚的
                //如果以后须回滚，只需写在这里
                this.props.editTable.setValByKeyAndIndex
                (moduleId,index,'postcode',{value:null,display:null});
                //组织变化清空 部门信息
                this.props.editTable.setValByKeyAndIndex
                (moduleId, index, 'pk_dept', {value: null, display: null});
                //岗位是选择组织后如果有编码规则带出编码
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
    //表格状态改变监听事件
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
            //表格切换为浏览态
            this.props.editTable.setTableData(gridId,this.state.queryGridData);
        }else{
            //表格切换为编辑态
            let copydata = this.state.queryGridData;
            copydata.rows = convertGridEnablestateToSave(copydata.rows);
            this.props.editTable.setTableData(gridId,copydata);
        }
    }
    //表格行选中事件
    gridBeChecked=(props, moduleId, record, index, status)=> {
        //此处控制按钮的隐藏显示及启用状态
        let tableData = props.editTable.getCheckedRows(moduleId);
        let length = tableData.length;//获取列表页选择数据的行数
        props.button.setButtonDisabled(['btnDel'], length > 0 ? false : true);
        props.button.setButtonDisabled(['btnCopy'], length == 1 ? false : true);
        this.setState(this.state);
    }
    onSelectedAll=(props, moduleId, status, length)=>{
        props.button.setButtonDisabled(['btnDel'], !status);
        props.button.setButtonDisabled(['btnCopy'], true);
        this.setState(this.state);
    }

    //分页点击处理
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
                {/* 头部 header */}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={status === 'browse' ? {}:{borderBottom: 'none'}}>
                    {/* 标题 title */}
                    <div className="header-title-search-area" >
                        {/* {createPageIcon()} */}

                            {createBillHeadInfo({
                                title:this.state.json['10100POST-000035'],
                                initShowBackBtn:false
                            }	
                            )}


                        {/* <h2 className="title-search-detail">{this.state.json['10100POST-000035']}</h2> */}
                        {/*除了h2标题外，小组件都要外层嵌套一个div且className命名为title-search-detail，如下*/}
                        {/* 显示停用  showOff*/}
                        <div className="title-search-detail" style={{display: status === 'browse' ? '' : 'none'}}>
                            <span className='showOff'>
                                <NCCheckbox onChange={this.onCheckShowDisable.bind(this)}
                                            checked={getDefData('checkedVal', datasource)}>{this.state.json['10100POST-000052']}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                            </span>
                        </div>
                    </div>
                    {/* 按钮区  btn-group */}
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
                {/* 列表区 */}
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