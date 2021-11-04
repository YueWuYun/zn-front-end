//XQmNbn9c98AujUwNcYlRcSlNHnT1Kz9FPRzy1vBhJ6Dz1X+c6l0DmI6S8ZGR8omA
﻿import React, { Component } from 'react';
import { createPage, base, ajax, toast, print, high, promptBox, createPageIcon } from 'nc-lightapp-front';
let { NCSelect, NCTabs, NCButton, NCCheckbox, NCCol, NCRow, NCOption, NCModal, NCCollapse, NCTree, NCIcon, NCFormControl, NCTimepicker, NCPopconfirm, NCDatePicker, NCInput, NCBackBtn, NCAffix, NCDiv,EmptyAreaTip } = base;
import {component} from '../../../public/platwapper/index.js';
const { NCTable} = component;

import CalendarYear from "./CalendarYear.js";
import createUIDom from "../../../public/utils/BDCreateUIDom";
import Utils from '../../../public/utils/index.js';
import RefCalendarRule from '../../../refer/pub/WorkCalendarRuleDefaultGridRef/index.js';
import RefHolidayType from '../../../refer/userdef/DefdocTreeRef/index.js';
let { BDselect } = Utils;
const { PrintOutput } = high;
import './index.less';
import '../../../public/uapbdstyle/uapbd_style_common.less'

//import Org from '../../../refer/org/FinanceOrgTreeRef/index.js';

//财务核算账簿 参照
// import Org from '../../../refer/org/AccountBookTreeRef/index';

//业务单元 参照
import Org from '../../../refer/org/BusinessUnitTreeRef/index';

//gitgitgit
// 数组拓展删除 数组中 指定的项
Array.prototype.arrRemoveAppoint = function (item) {
    if (!this.includes(item)) {
        return;
    }
    let thatIndex = this.indexOf(item);
    return this.splice(thatIndex, 1);
}

var EMPTY_FN = function () { };

var createUIDomParam = function (pagecode, appcode) {
    var param = {
        pagecode: pagecode
    };
    return window.location.href.startsWith('http://127.0.0.1:3006') ? { ...param, appcode: appcode } : param;
};


class WorkCalendar extends Component {
    componentDidUpdate() {
        if (!this.state.editMode) {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }


    constructor(props) {
        super(props);
        this.config = props.config;
        this.modeclassid = '08d4138b-a7b5-42fd-94bc-bb6eb7ac0fdc';
        //init template button
        createUIDom(props)({ ...createUIDomParam(this.props.config.pagecode, this.props.config.appcode) }, { moduleId: "10140WORKCALENDAR", domainName: 'uapbd' }, (data, lang) => {
            this.lang = lang;
            this.config.title = this.lang[this.config.title];
            this.state = this.createState();
            this.state.cardEmpty = true;
            this.state.lang = lang;
            this.state.tree.buttons = (data && data.button ? data.button : []).map(b => b.key);
            this.setState(this.state, () => {
                data.template.workcalendar.items.forEach(item => {
                    if (item.attrcode == 'pk_workcalendrule') {
                        item.queryCondition = () => {
                            return {
                                GridRefActionExt: 'nccloud.web.uapbd.workcalendar.action.RefCondWorkcalendarRule',
                                nodetype: this.config.nodetype
                            }
                        };
                    }
                });

                props.meta.setMeta(data && data.template ? data.template : {});
                props.button.setButtons(data && data.button ? data.button : {}, () => this.updateBtnStatus());
                setTimeout(() => {
                    debugger;
                    var context = data.context || {};
                    if (context.pk_org && this.config.nodetype == 'org') {
                        var value = {
                            refpk: context.pk_org,
                            refname: context.org_Name
                        };
                        this.state.org.onChange(value);
                    } else {
                        this.loadTreeData((data) => {
                            //查询第一个子节点并设置为选中
                            if (data && data.length > 0) {
                                this.state.cardEmpty = false;
                                this.state.tree.onSelect([data[0].refpk], data[0].refpk);
                            } else {
                                this.state.cardEmpty = true;
                            }

                        });
                    }
                }, 0);
            });
        });
    }

    // componentDidMount(){
    //     this.loadTreeData((data) =>{
    //         //查询第一个子节点并设置为选中
    //         var selectkey = [];
    //         if(selectkey && selectkey == 1){
    //             this.state.tree.onSelect(selectkey);
    //         }
    //     });
    // }


    initCalendarState(workcalendardates, workcalendaryears, callback) {
        //定义样式类
        var dateTypeClassNameMap = {
            0: 'workcalendar-date-workdate',
            1: 'workcalendar-date-freedate',
            2: 'workcalendar-date-holidate'
        };
        if (workcalendaryears.length == 0 || this.state.editMode == 'edit') {
            this.state.workCalendarInfo = undefined;
            this.setState(this.state, () => callback && callback());
            return;
        }
        //数据正确开始设置界面
        //设置日数据
        var dateMap = {};
        workcalendardates.forEach(date => dateMap[date.calendardate] = date);
        //设置年数据
        var yearComboData = workcalendaryears.map(year => {
            return {
                key: year.workyear,
                value: year.workyear
            };
        });
        //创建workCalendarInfo对象
        this.state.workCalendarInfo = {
            comboYear: {
                value: workcalendaryears[0].workyear,
                datas: yearComboData,
                onChange: (value) => {
                    var { comboYear } = this.state.workCalendarInfo;
                    comboYear.value = value;
                    this.setState(this.state);
                },
                renderOpt: (datas) => {
                    return datas.map(data => {
                        return (<NCSelect.NCOption value={data.value}>{data.key}</NCSelect.NCOption>)
                    });
                }
            },
            button: {
                disabled: true,
                handlerWapper: (handlertype) => {
                    return (e) => this.handerCalendarDate(e, handlertype, dateMap, this.state.workCalendarInfo.calendar.selected || []);
                }
            },
            calendar: {
                renderDate: (datecfg) => {
                    var date = dateMap[datecfg.dateString];

                    if (!date)
                        return <div className='workcalendar-date-notworkdate'>{datecfg.dayNumber}</div> //不在工作日历中

                    // 鼠标移入显示
                    let pointHoverShow = {
                        0: '工作日：' + (date.ondutytime || '') + '-' + (date.offdutytime || ''),
                        1: '公休日',
                        2: '节假日:' + (date.memo || '')
                    }
                    return <div title={pointHoverShow[date.datetype]} className={dateTypeClassNameMap[date.datetype]}>{datecfg.dayNumber}</div>//datetype 0工作日 1公休日 2节假日
                },
                selectchange: (isselect, selectArray, doDates, e) => {
                    var { calendar, button } = this.state.workCalendarInfo;
                    var isok = true;
                    if (isselect) { //只要是选中,并且操作日期不在规定范围内的就不添加到选中中
                        (doDates || []).forEach(d => {
                            if (!dateMap[d.dateString])
                                isok = false;
                        });
                    }
                    if (isok) {
                        calendar.selected = selectArray;
                        button.disabled = selectArray.length == 0;
                        this.setState(this.state);
                    }
                }
            }
        };
        //设置年度开始日期列表的数据
        this.state.markworkyear.yearinfo.srcData = workcalendaryears;
        this.state.markworkyear.init();
        this.setState(this.state, () => callback && callback());
    }

    createState() {
        var state = {
            editMode: false,
            fiirstLoad: null,
            org: {
                value: undefined,
                queryCondition: () => {//组织权限
                    return {
                        // AppCode: this.config.appcode || '',
                        // TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                },
                onChange: (val) => {
                    if (val && val.refpk){
                        this.state.cardEmpty = false
                    } else {
                        this.state.cardEmpty = true
                    }
                    this.state.org.value = val;
                    this.setState(this.state, () => {
                        var meta = this.props.meta.getMeta();
                        meta.workcalendar.items.forEach(item => {
                            if (item.attrcode == 'pk_workcalendrule') {
                                item.queryCondition = () => {
                                    return {
                                        GridRefActionExt: 'nccloud.web.uapbd.workcalendar.action.RefCondWorkcalendarRule',
                                        nodetype: this.config.nodetype,
                                        pk_org: val.refpk || '-1'
                                    }
                                };
                            }
                        });
                        this.props.meta.setMeta(meta);
                        setTimeout(() => {
                            this.loadTreeData(() => {
                                this.state.tree = {
                                    ...this.state.tree,
                                    selectedKeys: []
                                };
                                this.setState(this.state, () => {
                                    this.props.form.EmptyAllFormValue('workcalendar');
                                });
                            });
                        });



                    });
                }
            },
            showOff: {
                defaultChecked: false,
                checked: false,
                size: 'lg',
                onChange: (value) => {
                    this.state.showOff.checked = value;
                    this.setState(this.state, () => {
                        this.loadTreeData((data) => {
                            if (this.config.nodetype != 'org'){
                                if (data && data.length > 0){
                                    this.state.cardEmpty = false;
                                } else {
                                    this.state.cardEmpty = true;
                                }
                            }                            
                            this.state.tree = {
                                ...this.state.tree,
                                selectedKeys: [],
                            };
                            this.setState(this.state, () => {
                                this.props.form.EmptyAllFormValue('workcalendar');
                            });
                        });
                    });
                }
            },
            treesearch: {
                valueTemp: undefined,
                value: undefined,
                type: 'search',
                onChange: (value) => {
                    this.intervalmain = new Date().getTime();
                    let s = setTimeout(() => {//停止输入0.5s后执行
                        if (new Date().getTime() - this.intervalmain >= 500) {
                            this.state.treesearch.value = this.state.treesearch.valueTemp;
                            this.setState(this.state, () => {
                                this.state.treesearch.onSearch();
                            });
                        }
                        clearTimeout(s);
                    }, 500);
                    this.state.treesearch.valueTemp = value;
                    this.setState(this.state);
                },
                onSearch: () => {
                    var expandKeys = [],
                        textValue = this.state.treesearch.value || '';

                    const loopsearch = (nodes = []) => {
                        var parendExpand = false;
                        (nodes || []).forEach(child => {
                            var expand = loopsearch(child.children || []);
                            child.needExpand = expand;
                            child.needShow = expand ? true : (child.nodeData.code.indexOf(textValue) != -1 || child.title.indexOf(textValue) != -1 ? true : false);
                            parendExpand = parendExpand ? parendExpand : child.needShow;
                            if (expand) {
                                expandKeys.push(child.key);
                            }
                        });
                        return parendExpand;
                    }
                    var rootExpand = loopsearch(this.state.tree.datas);
                    debugger;
                    expandKeys.push('root');
                    this.state.tree.expandedKeys = expandKeys;
                    this.setState(this.state);
                }
            },
            tree: {
                root: {
                    title: this.lang['10140WORKCALENDAR-000068'] || '工作日历',/* 国际化处理： 工作日期*/
                    key: 'root',
                    id: 'root',
                    code:this.lang['10140WORKCALENDAR-000068'] || '工作日历',/* 国际化处理： 工作日期*/
                    nodeData: { ismain: false }
                },
                defaultExpandAll: true,
                datas: [],
                showLine: true,
                selectedKeys: [],
                buttons: [], //按钮权限
                autoExpandParent: false,
                expandedKeys: ['root'],
                disabled: false,
                openIcon: (<i  class="icon iconfont icon-shu_zk tree-swich"></i>),/* 国际化处理： 树开关*/
                closeIcon: (<i  class="icon iconfont icon-shushouqi tree-swich"></i>),/* 国际化处理： 树开关*/
                onDoubleClick: (checkedKeys) => {
                    // arrRemoveAppoint 是一个数组删除方法
                    this.state.tree.expandedKeys.includes(checkedKeys) ? this.state.tree.expandedKeys.arrRemoveAppoint(checkedKeys) : this.state.tree.expandedKeys.push(checkedKeys);
                    this.setState(this.state);
                },
                onExpand: (expandedKeys, e) => {
                    this.state.tree.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },
                onSelect: (selectedKeys, e) => {
                    var id = e.node ? e.node.props.nodeData.id : e;
                    //  console.log(selectedKeys, e.node.props.nodeData.id);
                    if (selectedKeys.length == 0) return;
                    this.state.tree.selectedKeys = selectedKeys;

                    this.setState(this.state, () => {
                        if (selectedKeys[0] == 'root') {
                            this.props.form.EmptyAllFormValue('workcalendar');
                            setTimeout(() => {
                                this.initCalendarState([], [], () => {
                                    this.updateBtnStatus();
                                });
                            });
                            return;
                        }
                        this.loadFormData({
                            id: id, callback: (data) => {
                                var workcalendardates = data.workcalendar.rows[0].values.calendardates.value || [];
                                var workcalendaryears = data.workcalendar.rows[0].values.calendaryears.value || [];

                                this.initCalendarState(workcalendardates, workcalendaryears, () => {
                                    this.updateBtnStatus();
                                });
                            }
                        });

                    });
                },
                renderNode: this.renderNode.bind(this)
            },
            workCalendarInfo: undefined,
            moreinfo: {
                modal: {
                    show: false,
                    modalDropup: true,
                    backdrop: 'static',
                    size: 'xlg',
                    onHide: () => {
                        this.onCancelMoreInfo();
                    }
                },
                calendarrule: {
                    value: undefined,
                    fieldid:'calendarrule',
                    onChange: (val) => {
                        var { startdate, enddate, holidatetype, calendarrule } = this.state.moreinfo;
                        calendarrule.value = val;
                        this.setState(this.state);
                    }
                },
                holidatetype: {
                    value: undefined,
                    fieldid:'holidatetype',
                    placeholder: this.lang['10140WORKCALENDAR-000019'],
                    refName: this.lang['10140WORKCALENDAR-000019'],
                    rootNode: { refname: this.lang['10140WORKCALENDAR-000019'], refpk: 'root' },
                    onChange: (val) => {
                        var { startdate, enddate, holidatetype, calendarrule } = this.state.moreinfo;
                        holidatetype.value = val;
                        this.setState(this.state);
                    },
                    queryCondition: () => {
                        return {
                            pk_defdoclist: '1001Z7100000000040AL'
                        };
                    }
                },
                startdate: {
                    value: undefined,
                    fieldid:'startdate',
                    format: 'YYYY-MM-DD',
                    onChange: (value) => {
                        var { startdate, enddate, holidatetype, calendarrule } = this.state.moreinfo;
                        startdate.value = value;
                        this.setState(this.state);
                    }
                },
                enddate: {
                    value: undefined,
                    fieldid:'enddate',
                    format: 'YYYY-MM-DD',
                    onChange: (val) => {
                        var { startdate, enddate, holidatetype, calendarrule } = this.state.moreinfo;
                        enddate.value = val;
                        this.setState(this.state);
                    }
                }
            },
            markworkyear: {
                init: () => {
                    var markworkyear = this.state.markworkyear;
                    var { modal, yearinfo, editMode } = markworkyear;
                    yearinfo.editData = [];
                    yearinfo.selectindex = 0;
                },
                editMode: false,
                modal: {
                    show: false,
                    backdropClosable: false,
                    modalDropup: false,
                    size: 'xlg',
                    onHide: () => {
                        var markworkyear = this.state.markworkyear;
                        var { modal } = markworkyear;
                        modal.show = false;
                        markworkyear.editMode = false;
                        this.setState(this.state);

                    }
                },
                btnEdit: {
                    onClick: () => {
                        var markworkyear = this.state.markworkyear;
                        var { modal, yearinfo } = markworkyear;
                        markworkyear.editMode = true;
                        yearinfo.editData = Utils.clone(yearinfo.srcData || []);
                        this.setState(this.state);
                    }
                },
                btnCancel: {
                    onClick: () => {
                        var markworkyear = this.state.markworkyear;
                        var { modal, yearinfo } = markworkyear;
                        markworkyear.editMode = false;
                        markworkyear.editData = [];
                        this.setState(this.state);
                    }
                },
                btnSave: {
                    onClick: this.onSubmitMarkYear.bind(this)
                },
                yearinfo: {
                    srcData: [],
                    editData: [],
                    fieldid:'yearinfo',
                    selectindex: undefined,
                    columns: [{
                        title: this.lang['10140WORKCALENDAR-005007'],
                        dataIndex: 'year',
                        key: "year",
                        render: (value, record, index) => {
                            return record.workyear || '';
                        }
                    }, {
                        title: this.lang['10140WORKCALENDAR-005008'],
                        dataIndex: 'workyearstartdate',
                        render: (value, record, index) => {
                            var markworkyear = this.state.markworkyear;
                            var { modal, yearinfo } = markworkyear;
                            if (markworkyear.editMode && yearinfo.selectindex == index) {
                                var datepicker = {
                                    value: record.workyearstartdate,
                                    format: 'YYYY-MM-DD',
                                    onChange: (value) => {
                                        var data = yearinfo.editData[index];
                                        data.workyearstartdate = value;
                                        this.setState(this.state);
                                    }
                                };
                                return <NCDatePicker fieldid={`${index}_datepicker`} {...datepicker} />
                            } else {
                                return record.workyearstartdate;
                            }
                        }
                    }],
                    onRowClick: (record, index, event) => {
                        var markworkyear = this.state.markworkyear;
                        var { modal, yearinfo } = markworkyear;
                        if (!markworkyear.editMode) {
                            yearinfo.selectindex = index;
                            this.setState(this.state);
                        }
                    },
                    rowClassName: (record, index, indent) => {
                        var markworkyear = this.state.markworkyear;
                        var { modal, yearinfo } = markworkyear;
                        return yearinfo.selectindex == index ? 'select-year-data' : '';
                    }
                }

            },
            editDateModal: {
                modal: {
                    show: false,
                    modalDropup: true,
                    size: 'SM',
                    onHide: () => {
                        this.state.editDateModal.modal.show = false;
                        this.setState(this.state);
                    }
                },
                init: () => {
                    var editDateModal = this.state.editDateModal;
                    var { txtHolidate, timepickerStart, timepickerend } = editDateModal;
                    txtHolidate.value = undefined;
                    timepickerStart.value = '08:30:00';
                    timepickerend.value = '17:30:00';
                },
                txtHolidate: {
                    value: undefined,
                    placeholder: '节假日说明',
                    onChange: (value) => {
                        var editDateModal = this.state.editDateModal;
                        var { txtHolidate, timepickerStart, timepickerend } = editDateModal;
                        txtHolidate.value = value;
                        this.setState(this.state);
                    }
                },
                timepickerStart: {
                    value: undefined,
                    placeholder: '上班时间',
                    onChange: (value) => {
                        var editDateModal = this.state.editDateModal;
                        var { timepickerStart, timepickerend } = editDateModal;
                        timepickerStart.value = value;
                        this.setState(this.state);
                    }
                },
                timepickerend: {
                    value: undefined,
                    placeholder: '上班时间',
                    onChange: (value) => {
                        var editDateModal = this.state.editDateModal;
                        var { timepickerStart, timepickerend } = editDateModal;
                        timepickerend.value = value;
                        this.setState(this.state);
                    }
                },
                btnSubmit: {
                    callback: () => { },
                    onClick: () => {
                        var editDateModal = this.state.editDateModal;
                        var { btnSubmit, btnCancel } = editDateModal;
                        btnSubmit.callback && btnSubmit.callback();
                    }
                },
                btnCancel: {
                    onClick: () => {
                        var editDateModal = this.state.editDateModal;
                        var { btnSubmit, btnCancel, modal } = editDateModal;
                        modal.show = false;
                        this.setState(this.state);
                    }
                },
                datas: [],
                handlertype: undefined
            }
        };
        return state;
    }

    renderNode(cfg) {
        var me = this;
        var operation = function (operation, item, pitem) {
            me.curOptNode = {
                item: item,
                pitem: pitem
            };
            return function (event) {
                event.stopPropagation();
                return cfg[operation](item, pitem);
            };
        };
        var renderTreeTitle = (item, pitem) => {
            var isInScope = () => {
                return item.nodeData.votype == this.config.nodetype || item.id == 'root';
            };
            let isExpand = this.state.tree.expandedKeys.includes(item.key);
            var isLeaf = !item.children.length, title = item.title;
            let className = isLeaf ? "tree-dian" : isExpand ? "icon iconfont  icon-wenjianjiadakai tree-wenjian" : "icon iconfont  icon-wenjianjia tree-wenjian";

            var textValue = this.state.treesearch.value;
            var drawTitleString = (title) => {
                if (textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1) {
                    var start = title.indexOf(textValue), end = start + textValue.length;
                    return <span><span className='refer-tree-title'>{title.substring(0, start)}</span><span className="uapbd-workcalendar-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                } else {
                    return (<span><span className='refer-tree-title'>{title}</span></span>);
                }
            };
            let wenjianicon = <i className={className} />;
            let titleInfo = <span className={isInScope() ? '' : 'uapbd-workcalendar-bdselected-highlight'}>{drawTitleString(item.nodeData.code)}&nbsp;&nbsp;{drawTitleString(item.title)}</span>
            let titleAdd = cfg.buttons.indexOf('add') == -1 ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-zengjia add-icon" onClick={operation('onAdd', item, pitem)}></i>;/* 国际化处理： 新增*/
            let titleEdit = cfg.buttons.indexOf('edit') == -1 || !pitem || !isInScope() ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-bianji edit-icon" onClick={operation('onEdit', item, pitem)}></i>;/* 国际化处理： 编辑*/
            let titleRemove = cfg.buttons.indexOf('delete') == -1 || !pitem || item.children.length != 0 || !isInScope() ? '' : <i style={{ marginLeft: 10, fontSize: 14 }} class="icon iconfont icon-shanchu delete-icon" onClick={operation('onRemove', item, pitem)}></i>;/* 国际化处理： 删除*/
            return (<div className="title-con">{wenjianicon}{titleInfo}{titleEdit}{titleAdd}{titleRemove}</div>);
        };
        const loop = (datas, pdata) => {
            return datas.filter(item => {
                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }).map((item) => {
                var children = item.children || [];
                var isLeaf = !item.children.length && item.key != "root";
                let switcherName = !children.length ? 'isLeaf_hiden_point_line' : 'isLeaf_show_point_line';
                return (<NCTree.NCTreeNode
                    liAttr={{fieldid:(item.code||item.name)+"_node"}}
                    switcherClass={switcherName}
                    title={renderTreeTitle(item, pdata)}
                    key={item.key}
                    isLeaf={children.length == 0}
                    className={cfg && cfg.editMode && this.state.tree.selectedKeys && this.state.tree.selectedKeys[0] == item.key ? 'node-item-edit-point-style-self' : ''}
                    disabled={cfg.editMode} nodeData={item.nodeData || {}} >{children.length == 0 ? '' : loop(children, item)}</NCTree.NCTreeNode>);
            });
        }
        return loop(cfg.datas);
    }


    updateBtnStatus() {
        var editMode = this.state.editMode;
        var isSelect = this.state.tree.selectedKeys.length == 1 && this.state.tree.selectedKeys[0] != 'root';
        var formData = this.props.form.getAllFormValue('workcalendar');
        var pk_workcalendar = formData.rows[0].values.pk_workcalendar && formData.rows[0].values.pk_workcalendar.value ? formData.rows[0].values.pk_workcalendar.value : undefined;

        //设置可以显示的按钮
        this.props.button.setDisabled({
            save: !editMode,
            saveadd: !(editMode && !pk_workcalendar),
            cancel: !editMode,
            group_print: editMode,
            refresh: editMode,
            bindmoreinfo: editMode || !isSelect,
            bindstartdate: editMode || !isSelect,
            binddef: editMode || !isSelect
        });

        this.props.button.setButtonsVisible({
            save: editMode,
            saveadd: editMode && !pk_workcalendar,
            cancel: editMode,
            refresh: !editMode,
            bindmoreinfo: !editMode,
            bindstartdate: !editMode,
            binddef: !editMode
        });
    }

    onBtnOperation(props, id) {

        switch (id.toLowerCase()) {
            case 'cancel':
                this.onCancel();
                break;
            case 'save':
                this.onSave(() => {
                });
                break;
            case 'saveadd':
                this.onSaveAdd();
                break;
            case 'refresh':
                this.onFlush();
                break;
            case 'binddef':
                this.onBinddef();
                break;
            case 'bindmoreinfo':
                this.onBindmoreinfo();
                break;
            case 'bindstartdate':
                this.onBindstartdate();
                break;
        }
    }


    loadTreeData(callback) {
        if (this.config.nodetype == 'org' && !this.state.org.value) {
            return;
        }
        ajax({
            url: '/nccloud/uapbd/workcalendar/WorkCalendarTreeAction.do',
            data: {
                showoff: this.state.showOff.checked,
                nodetype: this.config.nodetype,
                pkorg: this.state.org.value ? this.state.org.value.refpk : '',
            },
            success: (result) => {
                this.state.tree.datas = result.data;
                this.setState(this.state, () => {
                    callback && callback(result.data);
                });
            }
        });
    }

    loadFormData({ id = undefined, callback = EMPTY_FN }) {
        this.props.form.EmptyAllFormValue('workcalendar');
        ajax({
            url: '/nccloud/uapbd/workcalendar/WorkCalendarLoadAction.do',
            data: {
                ...this.props.config,
                id: id,
                area: 'workcalendar',
                nodetype: this.config.nodetype,
                pkorg: this.state.org.value ? this.state.org.value.refpk : '',
                pagecode: this.props.config.pagecode,
                appcode: this.props.config.appcode
            },
            success: (result) => {
                if (!result.data) {
                    return;
                }
                var data = {
                    workcalendar: result.data.formData.workcalendar
                };
                Utils.convertGridEnablestate(data.workcalendar.rows);
                this.props.form.setAllFormValue(data);
                this.props.form.setFormItemsDisabled('workcalendar', { enablestate: false });
                setTimeout(() => {
                    callback && callback(data);
                }, 0);
            }
        });
    }

    onAdd = (node) => {
        if (this.config.nodetype == 'org' && (!this.state.org.value || !this.state.org.value.refpk)) {
            toast({ content: this.lang['10140WORKCALENDAR-000002'], color: 'warning' });/* 国际化处理： 请选择组织*/
            return;
        }
        this.state.editMode = true;
        this.state.cardEmpty = false;
        this.setState(this.state, () => {
            this.loadFormData({ id: undefined, callback: preadd });
        })
        var preadd = () => {
            this.initCalendarState([], [], () => {
                this.props.form.setFormItemsDisabled('workcalendar', {
                    enablestate: true,
                    isdefaultcalendar: true,
                    pk_holidayrule: false,
                    enddate: false,
                    begindate: false,
                    pk_workcalendrule: false,
                    yearstartdate: true,
                    ffirstweekday: true,
                    code: false,
                    name: false
                });  //冗余代码 以后调整
                this.props.form.setFormStatus('workcalendar', 'edit');
                this.updateBtnStatus();
            });

        };
    }

    onEdit = (node) => {
        // if(node.nodeData.votype !== this.config.nodetype){
        //     toast({content : this.config.nodetypename + this.lang['10140CASHFLOW-000035']+ this.config.nodetypename+ this.lang['10140CASHFLOW-000036'],color : 'warning'});/* 国际化处理： 节点只能修改,数据*/
        //     return;
        // }
        this.state.editMode = true;
        this.setState(this.state, () => {
            this.props.form.setFormItemsDisabled('workcalendar', {
                enablestate: true,
                isdefaultcalendar: true,
                pk_holidayrule: true,
                enddate: true,
                begindate: true,
                pk_workcalendrule: true,
                yearstartdate: true,
                ffirstweekday: true,
                code: false,
                name: false
            });  //冗余代码 以后调整
            this.loadFormData({ id: node.id, callback: preedit });
        });




        var preedit = (data) => {
            this.initCalendarState([], [], () => {
                this.props.form.setFormItemsDisabled('workcalendar', {
                    enablestate: true,
                    isdefaultcalendar: true,
                    pk_holidayrule: true,
                    enddate: true,
                    begindate: true,
                    pk_workcalendrule: true,
                    yearstartdate: true,
                    ffirstweekday: true,
                    code: false,
                    name: false
                });  //冗余代码 以后调整
                this.props.form.setFormStatus('workcalendar', 'edit');
                this.updateBtnStatus();
            });
        };
    }

    save(callback) {
        var formData = this.props.form.getAllFormValue('workcalendar');
        if (!this.props.form.isCheckNow('workcalendar')) {
            return;
        }
        var cloneObj = Utils.clone(formData);
        Utils.convertGridEnablestateToSave([{ values: cloneObj.rows[0].values }]);

        delete cloneObj.rows[0].values.calendardates;
        delete cloneObj.rows[0].values.calendaryears;

        ajax({
            url: '/nccloud/uapbd/workcalendar/WorkCalendarEditAction.do',
            data: {
                model: {
                    rows: [{
                        values: cloneObj.rows[0].values,
                        rowid: 0
                    }]
                },
                pageid: this.config.pagecode
            },
            success: (result) => {
                callback && callback(result.data);
            }
        });
    }
    onSave(callback) {
        this.save(data => {
            toast({ title: this.lang['10140WORKCALENDAR-000003'], color: 'success' });/* 国际化处理： 保存成功*/
            this.loadTreeData(() => {
                this.state.tree.selectedKeys = [data.pk_workcalendar];
                this.setState(this.state, () => {
                    this.loadFormData({
                        id: data.pk_workcalendar, callback: (newData) => {
                            this.props.form.setFormStatus('workcalendar', 'browse');
                            this.props.form.setFormItemsDisabled('workcalendar', { enablestate: false });  //冗余代码 以后调整
                            this.state.editMode = false;
                            this.setState(this.state, () => {
                                var workcalendardates = newData.workcalendar.rows[0].values.calendardates.value || [];
                                var workcalendaryears = newData.workcalendar.rows[0].values.calendaryears.value || [];
                                this.initCalendarState(workcalendardates, workcalendaryears, () => {
                                    this.updateBtnStatus();
                                });
                            });
                        }
                    });
                });
            });
        });
    }

    onSaveAdd() {
        this.save((data) => {
            toast({ title: this.lang['10140WORKCALENDAR-000003'], color: 'success' });/* 国际化处理： 保存成功*/
            this.loadTreeData(() => {
                debugger;
                this.onAdd({
                    pid: 'pid'
                });
            });
        });
    }

    onDelete(node) {
        // if(node.nodeData.votype !== this.config.nodetype){
        //     toast({content : this.config.nodetypename + this.lang['10140CASHFLOW-000035']+ this.config.nodetypename+ this.lang['10140CASHFLOW-000036'],color : 'warning'});/* 国际化处理： 节点只能修改,数据*/
        //     return;
        // }
        // if(node.nodeData.votype !== this.config.nodetype){
        //     toast({content : this.config.nodetypename + this.lang['10140CASHFLOW-000038'],color : 'warning'});/* 国际化处理： 只能删除末级*/
        //     return;
        // }

        var delHandler = () => {
            ajax({
                url: '/nccloud/uapbd/workcalendar/WorkCalendarDelAction.do',
                data: {
                    id: node.key
                },
                success: (result) => {
                    if (result.success) {
                        this.props.form.EmptyAllFormValue('workcalendar');
                        this.loadTreeData((data) => {                            
                            this.initCalendarState([], [], () => {
                                if (this.config.nodetype != 'org'){
                                    if (!data || !data.length || data.length === 0){
                                        this.setState({cardEmpty:true})
                                    }
                                }                                
                                toast({ title: this.lang['10140WORKCALENDAR-000004'], color: 'success' });/* 国际化处理： 删除成功！*/
                                this.props.form.setFormStatus('workcalendar', 'browse');
                                this.updateBtnStatus();
                            });
                        });

                    }
                }
            });
        };

        promptBox({
            title: this.lang['10140WORKCALENDAR-000005'],/* 国际化处理： 确认删除*/
            content: this.lang['10140WORKCALENDAR-000006'],/* 国际化处理： 是否确认要删除?*/
            beSureBtnClick: () => {
                promptBox({
                    title: this.lang['10140WORKCALENDAR-000005'],/* 国际化处理： 确认删除*/
                    content: this.lang['10140WORKCALENDAR-001001'],/* 国际化处理： 是否确认要删除?*/
                    beSureBtnClick: delHandler
                });
            }
        });


    }



    onFlush() {
        // var formData = this.props.form.getAllFormValue('workcalendar');
        // var pk_workcalendar = formData.rows[0].values.pk_workcalendar.value;

        // this.loadFormData({id:pk_workcalendar, callback: (newData) => {
        //     //提示语
        //     toast({title : this.lang['10140WORKCALENDAR-100040'],color : 'success'});/* 国际化处理： 刷新成功！*/ 
        //     this.props.form.setFormStatus('workcalendar', 'browse');
        //     this.props.form.setFormItemsDisabled('workcalendar',{enablestate:true});  //冗余代码 以后调整
        //     this.state.editMode = false;
        //     this.setState(this.state, () => {
        //         var workcalendardates = newData.workcalendar.rows[0].values.calendardates.value || [];
        //         var workcalendaryears = newData.workcalendar.rows[0].values.calendaryears.value || [];
        //         this.initCalendarState(workcalendardates,workcalendaryears, () =>{
        //             this.updateBtnStatus();
        //         });
        //     });
        // }});
        this.loadTreeData((data) => {
            //提示语
            toast({ title: this.lang['10140WORKCALENDAR-100040'], color: 'success' });/* 国际化处理： 刷新成功！*/
            //查询第一个子节点并设置为选中
            if (data && data.length > 0) {
                this.state.tree.onSelect([data[0].refpk], data[0].refpk);
            }

        });
    }

    onCancel() {
        var handler = () => {
            if (this.config.nodetype != 'org' && (!this.state.tree.datas || this.state.tree.datas.length === 0)) {
                this.state.cardEmpty = true;
            }
            this.state.editMode = false;
            this.setState(this.state, () => {
                this.loadFormData({
                    id: this.state.tree.selectedKeys.length == 1 && this.state.tree.selectedKeys[0] != 'root' ? this.state.tree.selectedKeys[0] : undefined, callback: (newData) => {
                        this.setState(this.state, () => {
                            var workcalendardates = newData.workcalendar.rows[0].values.calendardates.value || [];
                            var workcalendaryears = newData.workcalendar.rows[0].values.calendaryears.value || [];
                            this.initCalendarState(workcalendardates, workcalendaryears, () => {
                                this.props.form.setFormStatus('workcalendar', 'browse');
                                this.updateBtnStatus();
                            });
                        });

                    }
                });
            });
        };
        promptBox({
            color: "warning",
            title: this.lang['10140WORKCALENDAR-000008'],/* 国际化处理： 确认取消*/
            content: this.lang['10140WORKCALENDAR-000009'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick: handler
        });

    }

    getFormDataNodeType() {
        var formData = this.props.form.getAllFormValue('workcalendar');
        var pkorg = formData && formData.rows[0].values.pk_org && formData.rows[0].values.pk_org.value;
        var pkgroup = formData && formData.rows[0].values.pk_group && formData.rows[0].values.pk_group.value;
        if (pkorg == 'GLOBLE00000000000000') {
            return 'glb';
        }
        if (pkorg && pkorg.length > 0 && pkgroup && pkgroup.length > 0 && pkorg != pkgroup) {
            return 'org'
        }
        return '';
    }

    onBindmoreinfo() {

        var formData = this.props.form.getAllFormValue('workcalendar');
        var pk_workcalendrule = formData.rows[0].values.pk_workcalendrule;
        var enddate = formData.rows[0].values.enddate.value;


        if (this.config.nodetype != this.getFormDataNodeType()) {
            toast({ title: this.lang['10140WORKCALENDAR-100039'], color: 'warning' });/* 国际化处理： 保存成功！*/
            return;
        }

        this.state.moreinfo.calendarrule.value = {
            refpk: pk_workcalendrule.value,
            refname: pk_workcalendrule.display
        };

        var handlerDate = new Date(enddate.substring(0, 4), enddate.substring(5, 7), enddate.substring(8, 10));
        handlerDate.setDate(handlerDate.getDate() + 1);
        enddate = handlerDate.getFullYear() + '-' + handlerDate.getMonth() + '-' + handlerDate.getDate();        //获取当前日(1-31)
        this.state.moreinfo.startdate.value = enddate;
        this.state.moreinfo.enddate.value = undefined;
        this.state.moreinfo.holidatetype.value = undefined;

        this.state.moreinfo.modal.show = true;
        this.setState(this.state);
    }

    onBinddef() {
        var formData = this.props.form.getAllFormValue('workcalendar');
        var pk_workcalendar = formData.rows[0].values.pk_workcalendar.value;
        var dataenablestate = formData && formData.rows[0].values.enablestate && formData.rows[0].values.enablestate.value;
        var isdefault = formData.rows[0].values.isdefaultcalendar.value
        if (isdefault) {
            toast({ title: this.lang['10140WORKCALENDAR-005006'], color: 'warning' });
            return;
        }
        if (!dataenablestate) {
            toast({ title: this.lang['10140WORKCALENDAR-100041'], color: 'warning' });
            return;
        }

        ajax({
            url: '/nccloud/uapbd/workcalendar/WorkCalendarDefaultAction.do',
            data: {
                id: pk_workcalendar
            },
            success: (result) => {
                if (result.success) {
                    this.loadTreeData(() => {
                        this.loadFormData({ id: pk_workcalendar });
                        toast({ title: this.lang['10140WORKCALENDAR-000013'], color: 'success' });/* 国际化处理： 保存成功！*/
                    });

                }
            }
        });
    }
    onBindstartdate() {
        this.state.markworkyear.modal.show = true;
        this.setState(this.state);
    }
    onSubmitMoreInfo() {
        var formData = this.props.form.getAllFormValue('workcalendar');
        var pkworkcalendar = formData.rows[0].values.pk_workcalendar.value;

        var doSaveMoreInfo = (callback) => {
            var { modal, calendarrule, holidatetype, startdate, enddate } = this.state.moreinfo;
            if (!enddate.value || !startdate.value || !calendarrule.value || !calendarrule.value.refpk) {
                toast({ title: this.lang['10140WORKCALENDAR-001000'] || '工作日历规则,起始日期,结束日期, 不能为空', color: 'warning' });
                return;
            }

            var data = {
                startdate: startdate.value || undefined,
                enddate: enddate.value || undefined,
                pk_workcalendar: pkworkcalendar,
                pk_workcalendarrule: calendarrule.value && calendarrule.value.refpk ? calendarrule.value.refpk : undefined,
                pk_holidaterule: holidatetype.value && holidatetype.value.refpk ? holidatetype.value.refpk : undefined,
                pagecode: this.config.pagecode
            };

            //校验参数
            ajax({
                url: '/nccloud/uapbd/workcalendar/WorkCalendarSaveMoreAction.do',
                data: data,
                success: (result) => {
                    callback && callback(result.data);
                }
            });
        };
        doSaveMoreInfo(data => {
            toast({ title: this.lang['10140WORKCALENDAR-000003'], color: 'success' });/* 国际化处理： 保存成功*/
            this.loadFormData({
                id: pkworkcalendar, callback: (data) => {
                    var workcalendardates = data.workcalendar.rows[0].values.calendardates.value || [];
                    var workcalendaryears = data.workcalendar.rows[0].values.calendaryears.value || [];
                    this.initCalendarState(workcalendardates, workcalendaryears, () => {
                        this.state.moreinfo.modal.show = false;
                        this.setState(this.state, () => {
                            this.updateBtnStatus();
                        });

                    });
                }
            });
        });
    }

    onCancelMoreInfo() {
        this.state.moreinfo.modal.show = false;
        this.setState(this.state);
    }

    onSubmitMarkYear() {
        var { yearinfo } = this.state.markworkyear;
        var { editData, selectindex } = yearinfo;

        var newdata = editData[selectindex];
        var formData = this.props.form.getAllFormValue('workcalendar');
        var pkworkcalendar = formData.rows[0].values.pk_workcalendar.value;

        var doSaveMarkYear = (callback) => {
            //校验参数
            ajax({
                url: '/nccloud/uapbd/workcalendar/WorkCalendarSaveStartDateAction.do',
                data: newdata,
                success: (result) => {
                    callback && callback(result.data);
                }
            });
        };
        doSaveMarkYear(data => {
            toast({ title: this.lang['10140WORKCALENDAR-000003'], color: 'success' });/* 国际化处理： 保存成功*/
            this.loadFormData({
                id: pkworkcalendar, callback: (data) => {
                    var workcalendardates = data.workcalendar.rows[0].values.calendardates.value || [];
                    var workcalendaryears = data.workcalendar.rows[0].values.calendaryears.value || [];
                    this.initCalendarState(workcalendardates, workcalendaryears, () => {
                        this.state.markworkyear.editMode = false;
                        this.setState(this.state, () => {
                            this.updateBtnStatus();
                        });
                    });
                }
            });
        });
    }


    onEnableState(id, enable = true) {
        ajax({
            url: enable ? '/nccloud/uapbd/workcalendar/WorkCalendarEnableAction.do' : '/nccloud/uapbd/workcalendar/WorkCalendarDisableAction.do',// : '/nccloud/uapbd/cashflow/EditMainitemAction.do',
            data: {
                id: id
            },
            success: (result) => {
                if (result.success) {
                    this.loadFormData({ id: id });//需要修改
                    debugger;
                    let ctips = (enable) ? this.lang["10140WORKCALENDAR-100033"] : this.lang["10140WORKCALENDAR-100034"];
                    toast({ title: ctips, color: 'success' });/* 国际化处理： 保存成功！*/
                }
            }
        });
    }

    addClickCall = () => {
        // this.setState({cardEmpty:false});
        this.onAdd(this.state.tree.root)
    }

    render() {
        if (!this.lang) return '';
        const { syncTree, form, button, ncmodal, DragWidthCom, BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const { createForm } = form;//创建表单，需要引入这个
        const { createButtonApp } = button;
        let { createModal } = ncmodal;  //模态框

        let { workCalendarInfo,lang,cardEmpty } = this.state;

        var viewCalendar = () => {

            if (!workCalendarInfo)
                return '';
            return (
                <div style={{ position: 'absolute', top: 235, bottom: 0, overflow: 'auto' }}>
                    {/* <div id="but-fixed-container">
                        <div style={{display:'inline-block',float:'right',marginRight: 20,marginBottom: 15}}>
                            <NCSelect style={{width: 200}} {...workCalendarInfo.comboYear}>{workCalendarInfo.comboYear.renderOpt(workCalendarInfo.comboYear.datas)}</NCSelect>
                            <NCButton {...workCalendarInfo.button} onClick={workCalendarInfo.button.handlerWapper('workdate') }>设置工作日</NCButton>
                            <NCButton {...workCalendarInfo.button} onClick={workCalendarInfo.button.handlerWapper('freedate') }>设置休息日</NCButton>
                            <NCButton {...workCalendarInfo.button} onClick={workCalendarInfo.button.handlerWapper('holidate') }>设置节假日</NCButton>
                            <NCButton {...workCalendarInfo.button} onClick={workCalendarInfo.button.handlerWapper('worktime') }>设置工作时间</NCButton>
                        </div>
                    </div> */}
                    <CalendarYear {...workCalendarInfo.calendar} year={workCalendarInfo.comboYear.value} lang={lang} />
                </div>
            );
        };
        var viewCalendarBtn = () => {
            if (!workCalendarInfo)
                return '';
            //判断表单是否是禁用
            var formData = this.props.form.getAllFormValue('workcalendar');
            var dataenablestate = formData && formData.rows[0].values.enablestate && formData.rows[0].values.enablestate.value;

            var btndisabled = !(this.config.nodetype == this.getFormDataNodeType() && !workCalendarInfo.button.disabled && dataenablestate);
            return (
                <div>
                    <div id="but-fixed-container">
                        <div style={{ display: 'inline-block', float: 'right', marginRight: 20, marginBottom: 15 }}>
                            <NCSelect fieldid="viewcalendar_select" style={{ width: 200 }} {...workCalendarInfo.comboYear}>{workCalendarInfo.comboYear.renderOpt(workCalendarInfo.comboYear.datas)}</NCSelect>
                            <NCButton fieldid={'setworkdate'} {...workCalendarInfo.button} disabled={btndisabled} onClick={workCalendarInfo.button.handlerWapper('workdate')}>{this.lang['10140WORKCALENDAR-000064']/* 设置工作日*/}</NCButton>
                            <NCButton fieldid={'setholiday'} {...workCalendarInfo.button} disabled={btndisabled} onClick={workCalendarInfo.button.handlerWapper('freedate')}>{this.lang['10140WORKCALENDAR-000065']/* 设置休息日*/}</NCButton>
                            <NCButton fieldid={'setjiejiari'}  {...workCalendarInfo.button} disabled={btndisabled} onClick={workCalendarInfo.button.handlerWapper('holidate')}>{this.lang['10140WORKCALENDAR-000066']/* 设置节假日*/}</NCButton>
                            <NCButton fieldid={'setworktime'} {...workCalendarInfo.button} disabled={btndisabled} onClick={workCalendarInfo.button.handlerWapper('worktime')}>{this.lang['10140WORKCALENDAR-000067']/* 设置工作时间*/}</NCButton>
                        </div>
                    </div>
                </div>
            );
        }
        var viewCard = () => {
            return (
                <div style={{ display: cardEmpty ? 'none' : 'block' }}>
                    <div>
                        {createForm('workcalendar', {
                            cancelPSwitch: true,
                            onAfterEvent: this.onFormAfterHander.bind(this),
                            onBeforeEvent: this.onFormBeforeHander.bind(this)
                        })}
                        {viewCalendarBtn()}
                    </div>
                    {viewCalendar()}
                </div>
            )
            return
        };

        var viewMoreInfo = () => {
            var { modal, calendarrule, holidatetype, startdate, enddate } = this.state.moreinfo;
            if (!modal.show)
                return '';
            return (
                <NCModal {...this.state.moreinfo.modal} fieldid="viewmore">
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{this.lang['10140WORKCALENDAR-000021']/* 生成工作日历明细*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ marginRight: 10 }}>{this.lang['10140WORKCALENDAR-000016']/* 工作日历规则*/}:</span><div style={{ width: 200 }}>{RefCalendarRule(calendarrule)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ marginRight: 10 }}>{this.lang['10140WORKCALENDAR-000017']/* 日历开始日期*/}:</span><NCDatePicker {...startdate} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ marginRight: 10 }}>{this.lang['10140WORKCALENDAR-000018']/* 日历结束日期*/}:</span><NCDatePicker {...enddate} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ marginRight: 10 }}>{this.lang['10140WORKCALENDAR-000019']/* 假期类型*/}:</span><div style={{ width: 200 }}>{RefHolidayType(holidatetype)}</div>
                        </div>
                        {this.lang['10140WORKCALENDAR-000020']/* 说明*/}
                    </NCModal.Body>
                    <NCModal.Footer>
                        <span><NCButton fieldid='vmoresurebtn' className="button-primary" onClick={this.onSubmitMoreInfo.bind(this)}>{this.lang['10140WORKCALENDAR-000014']/* 国际化处理： 确定*/}</NCButton></span>
                        <span><NCButton fieldid='vmorecancelbtn' onClick={this.onCancelMoreInfo.bind(this)}>{this.lang['10140WORKCALENDAR-000015']/* 国际化处理： 取消*/}</NCButton></span>
                    </NCModal.Footer>
                </NCModal>
            )
        };

        var viewWorkYear = () => {
            var { modal, btnEdit, btnCancel, btnSave, yearinfo, editMode } = this.state.markworkyear;
            let changeStyle = { display: 'flex', flexDirection: 'row-reverse', marginBottom: 10 }
            if (!modal.show)
                return '';
            return (
                <NCModal {...this.state.markworkyear.modal} fieldid="viewworkyear">
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{this.lang['10140WORKCALENDAR-000022']/* 设置工作日历年度起始日期*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        {!editMode ? <div style={changeStyle}><NCButton className="button-primary" {...btnEdit}>{this.lang['10140WORKCALENDAR-000023']/* 国际化处理： 修改*/}</NCButton></div> : ''}
                        <div style={changeStyle}>
                            {editMode ? <span><NCButton fieldid='vworkyearsave' {...btnSave}>{this.lang['10140WORKCALENDAR-000024']/* 国际化处理： 保存*/}</NCButton></span> : ''}
                            {editMode ? <span><NCButton fieldid='vworkyearcancel' {...btnCancel}>{this.lang['10140WORKCALENDAR-000025']/* 国际化处理： 取消*/}</NCButton></span> : ''}
                        </div>
                        <NCTable {...{fieldid:'worktable'}} {...yearinfo} data={this.state.markworkyear.editMode ? yearinfo.editData : yearinfo.srcData} />
                    </NCModal.Body>
                    <NCModal.Footer>
                    </NCModal.Footer>
                </NCModal>
            );
        };

        var viewEditDate = () => {
            var { modal, datas, handlertype, txtHolidate, timepickerStart, timepickerend, btnSubmit, btnCancel } = this.state.editDateModal;
            if (!modal.show)
                return '';

            var viewSettingHolidate = () => {
                return <div className="set-holiday"><NCFormControl fieldid="viewsetting" componentClass='textarea' {...txtHolidate} /></div>
            };
            var viewSettingWorktime = () => {
                return (
                    <div className="time-end-start">
                        <div><span style={{ display: 'inline-block', marginRight: 10 }}>{this.lang['10140WORKCALENDAR-100031'] }</span><span style={{ display: 'inline-block' }}><NCTimepicker fieldid ='begindate' {...timepickerStart} /></span></div>
                        <div><span style={{ display: 'inline-block', marginRight: 10 }}>{this.lang['10140WORKCALENDAR-100032'] }</span><span style={{ display: 'inline-block' }}><NCTimepicker fieldid = 'enddate' {...timepickerend} /></span></div>
                    </div>
                );
            };
            return (
                <NCModal {...this.state.editDateModal.modal} id="calendar-use-texteare" fieldid = 'calendar'>
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{handlertype == 'holidate' ? this.lang['10140WORKCALENDAR-000026'] : this.lang['10140WORKCALENDAR-000027']/* 设置工作日历年度起始日期*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        {handlertype == 'holidate' ? viewSettingHolidate() : viewSettingWorktime()}
                    </NCModal.Body>
                    <NCModal.Footer>
                        <span><NCButton fieldid = 'sure' className="button-primary" {...btnSubmit}>{this.lang['10140WORKCALENDAR-000014']/* 国际化处理： 确定*/}</NCButton></span>
                        <span><NCButton fieldid = 'cancel' {...btnCancel}>{this.lang['10140WORKCALENDAR-000015']/* 国际化处理： 取消*/}</NCButton></span>
                    </NCModal.Footer>
                </NCModal>
            );

        };

        var searchRender = {
            ...this.state.treesearch,
            value: this.state.treesearch.valueTemp,
            disabled: this.state.editMode
        };

        return (
            <div className="nc-bill-tree-card">
                {viewMoreInfo()}
                {viewWorkYear()}
                {viewEditDate()}
                {createModal('modal', { noFooter: false })}
                <NCDiv className="header" areaCode={NCDiv.config.HEADER}>
                    <div className='title'>
                        {createBillHeadInfo(
                            {
                                title:this.config.title,
                                backBtnClick:()=>{},
                                initShowBackBtn: false
                            }
                        )}
                    </div>
                    {this.config.nodetype !== 'org' ? '' : <div className="search-box"> {Org({ ...this.state.org, fieldid: `orgref`, disabled: this.state.editMode })}</div>}
                    <span className="showOff">
                        <NCCheckbox {...this.state.showOff} disabled={this.state.editMode}>{this.lang['10140WORKCALENDAR-000010']/* 国际化处理： 显示停用*/}</NCCheckbox>
                    </span>
                    <div className=" btn-group">
                        {createButtonApp({
                            area: 'main',
                            onButtonClick: this.onBtnOperation.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="tree-card">
                    <DragWidthCom
                        defLeftWid='280px'
                        leftDom={
                            <div fieldid="maincomp" className="tree-area" areaCode={NCDiv.config.TreeCom}>
                                <NCDiv fieldid= 'synctree' areaCode={NCDiv.config.Tree} class="syncTreeCom syncTreeComLineStyle syncTreeComMR20" id="accSchemeTree">
                                    <div className="NC_syncTreeSearch NC_syncTreeSearch_self_width">
                                        <NCFormControl fieldid="search" {...searchRender} disabled={this.state.editMode} />
                                    </div>
                                    <NCDiv  fieldid="maintree" className="synctree-area" areaCode={NCDiv.config.TreeCom}>
                                        <NCTree
                                            {...this.state.tree}>{
                                                this.renderNode({
                                                    datas: [{ ...this.state.tree.root, children: this.state.tree.datas }],
                                                    search: this.state.treesearch,
                                                    onAdd: this.onAdd.bind(this),
                                                    onEdit: this.onEdit.bind(this),
                                                    onRemove: this.onDelete.bind(this),
                                                    buttons: this.state.tree.buttons,
                                                    editMode: this.state.editMode
                                                })}
                                        </NCTree>
                                    </NCDiv >
                                </NCDiv>
                            </div>
                        }
                        rightDom={<div style={{ height: '100%' }}>
                        {this.config.nodetype != 'org' ? <EmptyAreaTip
                            type="btn"
                            desc={this.lang['10140WORKCALENDAR-005018']/* 国际化处理： 请先新增左侧树*/}
                            onClick={this.addClickCall}
                            show={cardEmpty} /> : <EmptyAreaTip
                                desc={this.lang['10140WORKCALENDAR-005019']/* 国际化处理： 请选择业务单元*/}
                                show={cardEmpty} />}{viewCard()}</div>}                        
                    />
                </div>
            </div>
        )
    }

    onFormBeforeHander(props, formid, itemname, value, data) {
        if (itemname == 'enablestate') {
            var formData = this.props.form.getAllFormValue('workcalendar');
            var isdefaultcalendar = formData.rows[0].values.isdefaultcalendar.value;
            if (isdefaultcalendar) {
                return false;
            }
            if (this.state.editMode)
                return false;
            var pk_org = data.pk_org.value;
            var pk_group = data.pk_group.value;
            var nodetype = this.config.nodetype;
            if ((nodetype == 'glb' && pk_org != 'GLOBLE00000000000000') || (nodetype == 'grp' && pk_org != pk_group)) {
                //toast({ content: this.lang['10140CASHFLOW-000060'], color: "warning" });/* 国际化处理： 不能修改不再管控范围内的数据*/
                return false;
            }
        }
        return true;
    }


    onFormAfterHander(props, formid, itemname, newValue, oldValue, data) {
        if (itemname == 'enablestate') {
            var formData = this.props.form.getAllFormValue('workcalendar');
            var pk_workcalendar = formData.rows[0].values.pk_workcalendar.value;
            promptBox({
                color: "warning",
                title: newValue.value ? this.lang['10140WORKCALENDAR-100035'] : this.lang['10140WORKCALENDAR-100037'],
                beSureBtnClick: () => {
                    this.onEnableState(pk_workcalendar, newValue.value)
                },
                cancelBtnClick: () => {
                    props.form.setFormItemsValue('workcalendar', { 'enablestate': { value: oldValue.value, display: null } });
                }
            });
        }
        return true;
    }

    handerCalendarDate(e, handlertype, dateMap, selected) {
        var formData = this.props.form.getAllFormValue('workcalendar');
        var updatepks = selected;
        var requestHandler = (callback) => {
            var { txtHolidate, timepickerStart, timepickerend } = this.state.editDateModal;
            ajax({
                url: '/nccloud/uapbd/workcalendar/WorkCalendarUpdateDateAction.do',
                data: {
                    pkworkcalendar: formData.rows[0].values.pk_workcalendar.value,
                    pkworkcalendardate: updatepks,
                    handlertype: handlertype,
                    ondutytime: timepickerStart.value,
                    offdutytime: timepickerend.value,
                    memo: txtHolidate.value
                },
                success: (result) => {
                    callback && callback(result.data);
                }
            });
        };
        var createSettingModal = (callback) => {
            var editDateModal = this.state.editDateModal;
            var { modal, datas, btnSubmit } = editDateModal;
            editDateModal.handlertype = handlertype;
            editDateModal.datas = updatepks;
            if (handlertype == 'holidate' || handlertype == 'worktime') {
                editDateModal.modal.show = true;
                editDateModal.init();
                btnSubmit.callback = callback;
                this.setState(this.state)
                return;
            } else {
                this.setState(this.state, () => callback && callback());
            }

        };

        //定义完毕开始执行
        var currectyear = this.state.workCalendarInfo.comboYear.value;
        createSettingModal(() => {
            requestHandler((data) => {
                var workcalendardates = data.calendardates || [];
                var workcalendaryears = data.calendaryears || [];
                this.initCalendarState(workcalendardates, workcalendaryears, () => {
                    var { modal, datas, handlertype } = this.state.editDateModal;
                    this.state.workCalendarInfo.comboYear.value = currectyear;
                    modal.show = false;
                    this.setState(this.state);
                })

            });
        });
    }
}

export default WorkCalendar;

//XQmNbn9c98AujUwNcYlRcSlNHnT1Kz9FPRzy1vBhJ6Dz1X+c6l0DmI6S8ZGR8omA