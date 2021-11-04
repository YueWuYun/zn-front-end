//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, promptBox, pageTo } from 'nc-lightapp-front';
import Utils from '../../../public/utils';

let { NCAffix } = base;

const tableid = 'freecustom';
const pagecode = '10140FCG_freecustom';
const appid = '0001Z010000000003IKI';

const urls = {
    add: '/nccloud/uapbd/freecust/addfreecust.do',
    save: '/nccloud/uapbd/freecust/savefreecust.do',
    query: '/nccloud/uapbd/freecust/queryfreecust.do',
    delete: '/nccloud/uapbd/freecust/deletefreecust.do'
};

const isShowOffEnable = true;			//是否启用“显示停用”功能
const keys = ['pk_group', 'pk_org', 'dataoriginflag', 'pk_customsupplier', 'accountproperty'];  //过来空行时，忽略的字段
let allTableData = {};

function setTableStatus(props, tableid, status) {
    if (status == 'edit') {
        window.onbeforeunload = () => {
            return '';
        };
    } else {
        window.onbeforeunload = null;
    }
    props.editTable.setStatus(tableid, status);
}

class SingleTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            json: {},
            inlt: null
        }
    }

    componentDidMount() {

        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({ json, inlt })       // 保存json和inlt到页面state中并刷新页面
                //this.changeTitle();
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: '10140FCG', domainName: 'uapbd', callback })

        this.props.button.setButtonsVisible({
            Add: true,
            Save: false,
            SaveAdd: false,
            Cancel: false,
            Refresh: true
        });

        this.getData();
    }

    changeTitle() {
        top.document.title = this.state.json['10140FCG-000007']/* 国际化处理： 散户维护*/;
        var contain = top.document.createElement("span");
        var titlespan = top.document.createElement("span");
        titlespan.class = "ant-breadcrumb-link";
        titlespan.innerText = this.state.json['10140FCG-000007']/* 国际化处理： 散户维护*/;
        contain.appendChild(titlespan);

        top.document.getElementsByClassName('ant-breadcrumb')[0].append(contain);
    }

    //获取并初始化模板
    initTemplate(props) {
        props.createUIDom({
            pagecode: pagecode,
            /*appid : appid,
            appcode:'10140FCG'*/
        },
            (data) => {
                let meta = data.template;
                meta = this.modifierMeta(props, meta)
                props.meta.setMeta(meta);
                data.button && props.button.setButtons(data.button);
                if (data.button) {
                    props.button.setButtons(data.button);
                    props.button.setPopContent('oprdelbro', this.state.json['10140FCG-000000'])/* 国际化处理： 确认要删除该条数据吗？*/ /* 设置操作列上删除按钮的弹窗提示 */
                }
            });
    }

    //对表格模板进行加工操作
    modifierMeta(props, meta) {

        //添加表格操作列
        let event = {
            label: this.state.json['10140FCG-000001'],/* 国际化处理： 操作*/
            attrcode: 'opr',
            key: 'opr',
            fixed: 'right',
            className: 'table-opr',
            itemtype: 'customer',
            visible: true,
            render: (text, record, index) => {
                let buttonAry =
                    props.editTable.getStatus(tableid) === "browse"
                        ? ['opredit', 'oprdelbro']
                        : ["oprextend", "oprdel"];

                return props.button.createOprationButton(buttonAry, {
                    area: 'opr-actions',
                    buttonLimit: 2,
                    onButtonClick: this.tableButtonClick.bind(this, record, index)
                });
            }
        };
        meta[tableid].items.push(event);
        return meta;
    }
    tableButtonClick(record, index, props, key) {

        let recordVal = record.values;

        switch (key) {
            // 表格操作按钮
            case 'oprextend':
                setTableStatus(props, tableid, 'edit');
                props.editTable.openModel(tableid, 'edit', record, index);
                break;
            case 'opredit':
                setTableStatus(props, tableid, 'edit');
                props.editTable.openModel(tableid, 'edit', record, index);
                break;
            case 'oprdel':
                props.editTable.deleteTableRowsByIndex(tableid, index);
                break;
            case 'oprdelbro':
                let status = record.status;
                record.status = '3';
                let rows = [record];
                let paramData = {
                    'pageid': pagecode,
                    'gridModel': {
                        'pageinfo': {},
                        'areacode': tableid,
                        'rows': rows
                    }
                }
                ajax({
                    url: urls.save,
                    data: paramData,
                    success: (res) => {
                        if (res.success) {
                            props.editTable.deleteTableRowsByIndex(tableid, index);
                            toast({ color: 'success', title: this.state.json['10140FCG-000002'] });/* 国际化处理： 删除成功！*/
                        } else {
                            record.status = status;
                        }
                    },
                    error: (res) => {
                        record.status = status;
                        toast({ color: 'danger', content: res.message });
                    }
                });
                break;
            default:
                console.log(key, index);
                break;
        }
    }

    //请求列表数据
    getData = (callback) => {

        ajax({
            url: urls['query'],
            data: {
                pagecode: pagecode,
                pk_customsupplier: this.getPk_customsupplier('pk_customsupplier')
            },
            success: (res) => {
                let { success, data } = res;
                if (success && data && data[tableid]) {
                    Utils.showFormular(this.props, res, {
                        [tableid]: "editTable"
                    })
                    allTableData = data[tableid];
                    this.props.editTable.setTableData(tableid, data[tableid]);
                    callback && callback(data[tableid]);
                } else {
                    this.props.editTable.setTableData(tableid, { rows: [] });
                    callback && callback();
                }
            }
        });
    };

    getPk_customsupplier(param) {
        return pageTo.getUrlParam(param);
    }

    //表格编辑后事件
    onAfterEvent(props, moduleId, key, changerows, value, index, data) {
        if (key == 'name') {
            let name = data.values.name.value;
            data.values.simplename = { value: name, display: name };
        }
    }

    //更新按钮状态
    updateButtonStatus() {
        //此处控制按钮的隐藏显示及启用状态
        let tableData = this.props.editTable.getCheckedRows(tableid);
        let length = tableData.length;//获取列表页选择数据的行数

        if (this.props.editTable.getStatus(tableid) === 'edit') {//编辑状态
            this.props.button.setButtonsVisible({
                Add: true,
                Save: true,
                SaveAdd: false,
                Cancel: true,
                Refresh: false
            });
        } else {//浏览态
            this.props.button.setButtonsVisible({
                Add: true,
                Save: false,
                SaveAdd: false,
                Cancel: false,
                Refresh: true
            });
        }
    }

    //按钮点击事件
    onButtonClick(props, id) {
        switch (id) {
            case 'Add':
                let pop = this.getPk_customsupplier('pk_customsupplier');

                ajax({
                    url: urls.add,
                    data: { pk_customsupplier: this.getPk_customsupplier('pk_customsupplier') },
                    success: (res) => {
                        // props.editTable.openModel(tableid, 'add', {}, 0, false);
                        // modified by wangying16 for NCCLOUD-140856
                        props.editTable.addRow(tableid, undefined, true)
                    }
                })
                break;
            case 'Edit':
                setTableStatus(props, tableid, 'edit');
                break;
            case 'Cancel':
                let cancelFree = () => {
                    this.props.editTable.cancelEdit(tableid);
                    setTableStatus(props, tableid, 'browse');
                }
                promptBox({
                    color: 'warning',
                    title: this.state.json['10140FCG-000003'],/* 国际化处理： 取消*/
                    content: this.state.json['10140FCG-000004'],/* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick: cancelFree.bind(this)
                });
                break;
            case 'Refresh':
                this.setState({ searchValue: '' });
                this.getData((data) => {
                    toast({ color: 'success', title: this.state.json['10140FCG-000005'] });/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'Save':
                setTimeout(() => {
                    this.props.editTable.filterEmptyRows(tableid, keys);
                    if (!this.props.editTable.checkRequired(tableid, this.props.editTable.getAllRows(tableid, true))) {
                        return
                    }
                    let data = {
                        pageid: pagecode,
                        model: {
                            areaType: "table",
                            pageinfo: null,
                            rows: [],
                            areacode: tableid
                        }
                    };
                    let allDatas = this.props.editTable.getAllRows(tableid);
                    data.model.rows = allDatas;


                    let saveFunc = () => {
                        let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
                        if (tableData === undefined || tableData.length == 0) {
                            setTableStatus(props, tableid, 'browse');
                            ;//设置表格状态为浏览态
                            toast({ color: 'success', title: this.state.json['10140FCG-000006'] });
                            /* 国际化处理： 保存成功！*/
                            return;
                        }

                        tableData.forEach((row) => {
                            row.values.pk_org = { value: 'GLOBLE00000000000000', display: '' };
                            row.values.pk_customsupplier = {
                                value: this.getPk_customsupplier('pk_customsupplier'),
                                display: ''
                            };
                        })

                        data.model.rows = tableData;
                        ajax({
                            url: urls['save'],
                            data,
                            success: function (res) {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                                let { success, data } = res;
                                if (success) {
                                    setTableStatus(props, tableid, 'browse');
                                    ;//设置表格状态为浏览态
                                    if (data) {
                                        let allD = this.props.editTable.getAllData(tableid);
                                        allD.rows = allD.rows.filter(item => item.status != '3');//过滤清除删除状态的行
                                        Utils.filterResult(allD, data[tableid].rows);//将保存后返回的数据重新放置到页面
                                        this.props.editTable.setTableData(tableid, allD);
                                        toast({ color: 'success', title: this.state.json['10140FCG-000006'] });
                                        /* 国际化处理： 保存成功！*/
                                    }
                                }
                            }.bind(this)
                        });
                    }
                    props.validateToSave(data, saveFunc, { [tableid]: 'table' }, 'grid');
                })
                break;
        }
    }

    render() {
        let { table, button, search, editTable, modal } = this.props;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButton } = button;
        let { createButtonApp } = button;
        let { NCFormControl, NCCheckbox } = base;
        let { createModal } = modal;
        return (

            <div className="nc-single-table">
                <NCAffix>
                    {/* 头部 header */}
                    <div className="nc-bill-header-area">
                        {/* 标题 title */}
                        <div className="header-title-search-area">
                            <h2 className="title-search-detail">{this.state.json['10140FCG-000007']/* 国际化处理： 散户维护*/}</h2>
                        </div>

                        {/* 按钮区  btn-group */}
                        <div className="header-button-area">
                            {createButtonApp({
                                area: 'list-actions',
                                buttonLimit: 6,
                                onButtonClick: this.onButtonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')

                            })}
                        </div>
                    </div>
                </NCAffix>
                <div className='nc-singleTable-table-area'>
                    {createEditTable(tableid, {//列表区
                        onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件
                        useFixedHeader: true,
                        selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
                        statusChange: function () {
                            setTimeout(() => {
                                this.updateButtonStatus();
                            }, 0)
                        }.bind(this),				//表格状态监听
                        showIndex: true,				//显示序号
                        adaptionHeight: true
                    })}

                </div>
            </div>

        );
    }
}

SingleTable = createPage({
    billinfo: {
        billtype: 'grid',
        pagecode: pagecode,
        bodycode: tableid
    },
    initTemplate: () => { }
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65