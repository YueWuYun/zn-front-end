//X2Qliz9NycFgFozx4JYU+FJNtrJfS9zVjCeLKuV8tF8qFiFtQA1G67elh1iFE1M+
import React, { Component } from 'react';
import { createPage, base, ajax, high, toast, promptBox, createPageIcon } from 'nc-lightapp-front';
import { Table, Record } from '../../../public/excomponents';
//import Org from  '../../../../uapbd/refer/org/TaxOrgDefaultTreeRef'  
import { component } from '../../../public/platwapper/index.js';
const { NCTable, NCButton, NCSelect } = component;
let { NCTree, NCTabs, NCCheckbox, NCCol, NCRow, NCModal, NCCollapse, NCIcon, NCFormControl, NCPopconfirm, NCInput, NCLoading, NCDatePicker, NCDiv } = base;
import './index.less';
import '../../../public/uapbdstyle/uapbd_style_common.less'
import './gly-lstyle.less';
const { Refer } = high;
const { EmptyAreaTip } = base;
import createUIDom from "../../../public/utils/BDCreateUIDom";
import RefParam from './RefParamSelect.js';

Array.prototype.arrRemoveAppoint = function (item) {
    if (!this.includes(item)) {
        return;
    }
    let thatIndex = this.indexOf(item);
    return this.splice(thatIndex, 1);
}

var Org = function (props = {}) {
    var cfg = {
        refName: Org.lang['SYSPARAM-000003'],/* 国际化处理： 组织单元*/
        placeholder: Org.lang['SYSPARAM-000003'],/* 国际化处理： 组织单元*/
        rootNode: { refname: Org.lang['SYSPARAM-000003'], refpk: 'root' },/* 国际化处理： 组织单元*/
        refCode: 'params',
        queryTreeUrl: '/nccloud/uapbd/sysparam/OrgRefAction.do',
        isMultiSelectedEnabled: false,
        treeConfig: { name: [Org.lang['SYSPARAM-000004'], Org.lang['SYSPARAM-000005']], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
        refType: 'tree',
        isShowUnit: false
    };
    return <Refer fieldid="sysparamorg" {...Object.assign(cfg, props)} />
}

var createUIDomParam = function (pagecode, appcode) {
    var param = {
        pagecode: pagecode
    };
    return window.location.href.startsWith('http://127.0.0.1:3006') ? { ...param, appcode: appcode } : param;
};

var EMPTY_FN = function () { };

/* 清空日期 */
function clickDate(currtData, table, target) {
    // 点击叉号时target为undefined
    if (!target) {
        var data = currtData.getData();
        data.value = '';
        currtData.setData(data);
        table.getDirtyOperation().updateRecord(currtData);
    }
}

class SysParam extends Component {

    componentDidUpdate() {
        if (this.table) {
            if (this.table.getMode() == 'browse') {
                window.onbeforeunload = null;
            } else {
                window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                    return '';
                };
            }
        }
    }

    constructor(props) {
        super(props);
        this.config = this.props.config || {};
        createUIDom(props)(this.config, { moduleId: "10140SYSPARAM", domainName: 'uapbd' }, (data, lang) => {
            this.lang = lang;
            Org.lang = this.lang;
            this.config.title = this.lang[this.config.title];
            this.state = this.createState();
            var context = data.context || {};
            if (this.config.nodetype == 'org') {
                this.config.pkorg = context.pk_org;
                if (context.pk_org) {
                    this.state.org.value = {
                        refpk: context.pk_org,
                        refname: context.org_Name
                    };
                }
                // this.setState(this.state, () => {
                // });
            }
            this.setState(this.state, () => {
                //注释掉默认值，默认值可能导致加载不出数据
                this.setState(this.state, () => {
                    this.initPower(this.config.nodetype == 'org' ? this.config.pkorg : undefined, (powerdata) => {
                        this.state.powerdata = powerdata;
                        props.meta.setMeta(data && data.template ? data.template : {});
                        props.button.setButtons(data && data.button ? data.button : {}, () => {
                            this.updateBtnStatus(true);
                            this.loadTableData();
                        });
                        setTimeout(() => {
                            if (this.config.nodetype !== 'org' || (this.config.nodetype == 'org' && this.state.org.value && this.state.org.value.refpk))
                                this.loadTree();
                        }, 0);

                    });

                });

            });

        });
    }

    initPower(pk_org, callback) {
        ajax({
            loading: true,
            data: {
                pk_org: pk_org,
                nodetype: this.config.nodetype
            },
            url: '/nccloud/uapbd/sysparam/SysParamPowerAction.do',
            success: (res) => {
                callback(res.data || {})
            }
        });
    }

    createState() {
        var state = {
            listEmpty: true,
            loadingshow: false,
            isapply: false,
            org: {
                value: undefined,
                onChange: (value) => {

                    if (value && value.busiunit != undefined && value.busiunit == false) {
                        toast({ content: this.lang['SYSPARAM-000017'], color: 'warning' });/* 国际化处理： 选择项不是业务单元*/
                        return;
                    }

                    this.initPower(value.refpk, (data) => {
                        this.state.powerdata = data;
                        this.state.org.value = value;
                        this.setState(this.state, () => {
                            if (this.state.org.value.refpk == undefined) {
                                this.state.tree.datas = [];
                                this.state.listEmpty = true;
                                this.setState(this.state, () => {
                                    this.table.loadData([]);
                                });
                            } else {
                                this.state.listEmpty = false;
                                this.loadTree(() => {
                                    this.loadTableData();
                                });
                            }

                        });
                    });


                },
                disabled: false
            },

            search: {
                placeholder: this.lang['SYSPARAM-000018'],/* 国际化处理： 请输入编码或名称筛选*/
                value: undefined,
                onChange: (value) => {
                    this.intervalmain2 = new Date().getTime();
                    this.state.search.value = value;
                    this.setState(this.state, () => {
                        let s2 = setTimeout(() => {//停止输入0.5s后执行
                            if (new Date().getTime() - this.intervalmain2 >= 500) {
                                this.loadTableData();
                            }
                            clearTimeout(s2);
                        }, 500);
                    });




                },
                type: 'search',
                disabled: false,
                showClose: true,
                onSearch: () => this.loadTableData()
            },

            treesearch: {
                valueTemp: undefined,
                fieldid: 'search',
                value: undefined,
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
                            child.needShow = expand ? true : (child.title.indexOf(textValue) != -1 ? true : false);
                            parendExpand = parendExpand ? parendExpand : child.needShow;
                            if (expand) {
                                expandKeys.push(child.key);
                            }
                        });
                        return parendExpand;
                    }
                    var rootExpand = loopsearch(this.state.tree.datas);
                    expandKeys.push('root');
                    this.state.tree.expandedKeys = expandKeys;
                    this.setState(this.state);
                }
            },
            tree: {
                root: {
                    title: this.lang['SYSPARAM-000019'],/* 国际化处理： 系统选择*/
                    name: this.lang['SYSPARAM-000019'],/* 国际化处理： 系统选择*/
                    key: 'root'
                },
                defaultExpandAll: true,
                fieldid: 'systree',
                datas: [],
                openIcon: (<i className="icon iconfont icon-shu_zk tree-swich" />),
                closeIcon: (<i className="icon iconfont icon-shushouqi tree-swich" />),
                expandedKeys: ['root'],
                selectedKeys: [],
                selectedNode: undefined,
                disabled: false,
                showLine: true,
                autoExpandParent: false,
                onDoubleClick: (checkedKeys) => {
                    // arrRemoveAppoint 是一个数组删除方法
                    this.state.tree.expandedKeys.includes(checkedKeys) ? this.state.tree.expandedKeys.arrRemoveAppoint(checkedKeys) : this.state.tree.expandedKeys.push(checkedKeys);
                    this.setState(this.state);
                },
                onSelect: (selectedKeys, e) => {
                    if (selectedKeys.length == 0) return;
                    var td = this.state.tree;
                    this.state.tree = {
                        ...this.state.tree,
                        selectedKeys: selectedKeys,
                        selectedNode: e.selected ? e.node : undefined
                    };
                    this.setState(this.state, () => {
                        this.loadTableData();
                    });
                },
                onExpand: (expandedKeys, e) => {
                    this.state.tree.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },

                renderNode: () => {

                    var renderTreeTitle = (item, pitem) => {
                        var isInScope = () => {
                            return false;
                        };
                        let isExpand = this.state.tree.expandedKeys.includes(item.key);
                        let editMode = this.state.editMode;
                        var isLeaf = !item.children.length, title = item.title;
                        let className = isLeaf ? "tree-dian" : isExpand ? "icon iconfont  icon-wenjianjiadakai tree-wenjian" : "icon iconfont  icon-wenjianjia tree-wenjian";
                        var textValue = this.state.treesearch.value;
                        var drawTitleString = (title) => {
                            if (textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1) {
                                var start = title.indexOf(textValue), end = start + textValue.length;
                                return <span><span>{title.substring(0, start)}</span><span className="uapbd-inoutbusiclass-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                            } else {
                                return (<span><span className='refer-tree-title'>{title}</span></span>);
                            }
                        };
                        let wenjianicon = <i className={className} />;
                        let titleInfo = <span className={isInScope() ? '' : 'uapbd-inoutbusiclass-bdselected-highlight'}>{drawTitleString(item.title)}</span>
                        return (<div className="title-con">{wenjianicon}{titleInfo}</div>);
                    };

                    // var textValue = this.state.treesearch.value;
                    // var drawTitleString = (item, icon)=>{
                    //     let isExpand = this.state.tree.expandedKeys.includes(item.key);
                    //     var isLeaf = !item.children.length, title = item.title;

                    //     let className = isLeaf?"tree-dian":isExpand?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia";
                    //     if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ) {
                    //         var start = title.indexOf(textValue) , end = start + textValue.length;
                    //         return <span><i style={{color:'#f2b224'}} className={className}/><span className='refer-tree-title'>{title.substring(0, start)}</span><span className="uapbd-psndoc-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                    //     } else {
                    //         return <span><i style={{color:'#f2b224'}} className={className}/><span className='refer-tree-title'>{title}</span></span>;
                    //     }
                    // };

                    const loop = (datas, pdata) => {
                        return datas.filter(item => {
                            return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
                        }).map((item) => {
                            var children = item.children || [];
                            var isLeaf = !item.children.length && item.key != "root";
                            let switcherName = isLeaf ? 'isLeaf_hiden_point_line' : 'isLeaf_show_point_line';
                            return (<NCTree.NCTreeNode
                                liAttr={{ fieldid: (item.name) + "_node" }}
                                switcherClass={switcherName}
                                className={this.table && this.table.getMode() == 'edit' && this.state.tree.selectedKeys && this.state.tree.selectedKeys[0] == item.id ? 'node-item-edit-point-style-self nc-theme-gray-area-bgc' : ''}
                                title={renderTreeTitle(item, pdata)}
                                key={item.key}
                                isLeaf={children.length == 0}
                                disabled={this.table && this.table.getMode() == 'edit'}
                                nodeData={item.nodeData || {}}>
                                {children && children.length != 0 ? loop(children, item) : ''}
                            </NCTree.NCTreeNode>)
                        });
                    }


                    // const loop = (datas, pdata) => datas.map((item) => {
                    //     var children = item.children || [];
                    //     var isLeaf = !item.children.length && item.key != "root";
                    //     return (<NCTree.NCTreeNode switcherClass={isLeaf ? 'isleaf-style-none' : 'unleaf-style-none'}  title={drawTitleString(item, true)} key={item.key} isLeaf={children.length == 0}  disabled={this.disabled} nodeData={item.nodeData|| {}}>{children && children.length != 0 ? loop(children, item) : ''}</NCTree.NCTreeNode>)
                    // });
                    return loop([{ ...this.state.tree.root, children: this.state.tree.datas || [] }]);
                }
            },

            table: {
                columns: [{
                    title: this.lang['SYSPARAM-000000'], /* 国际化处理： 参数代码*/
                    dataIndex: 'initcode',
                    width: 100,
                    key: 'initcode',
                    sorter: (pre, after) => { return pre.getData().initcode.localeCompare(after.getData().initcode)},
                    sorterClick:(data,type)=>{//排序的回调函数
                      //type value is up or down
                  
                    }
                }, {
                    title: this.lang['SYSPARAM-000002'], /* 国际化处理： 参数名称*/
                    dataIndex: 'initname',
                    width: 300,
                    key: 'initname',
                    sorter: (pre, after) => { return pre.getData().initname.localeCompare(after.getData().initname)},
                    sorterClick:(data,type)=>{//排序的回调函数
                      //type value is up or down
                  
                    },
                    render: (value, record, index) => {
                        // debugger
                        var lang_sysinittempvo = record.getData().data.lang_sysinittempvo || {};
                        return lang_sysinittempvo.initName;
                    }
                }, {
                    title: this.lang['SYSPARAM-000020'],   /* 国际化处理： 参数值*/
                    dataIndex: 'value',
                    width: 200,
                    key: 'value',
                    render: (value, record, index) => {
                        var data = record.getData(),
                            isys = data.data.sysinittempvo.sysflag,
                            lang_sysinittempvo = data.data.lang_sysinittempvo || {};
                        if (isys) {
                            var onClick = () => {
                                debugger
                                var refpath = data.data.sysinittempvo.refpath || '',
                                    jsname = refpath.substring(0, refpath.length - 3),
                                    jsClass = window[jsname],
                                    valueChange = (data) => {
                                        this.state.createSetValueModal = undefined;
                                        this.setState(this.state);
                                    };
                                if (jsClass && jsClass.default) {
                                    this.state.createSetValueModal = function () {
                                        return React.createElement(jsClass.default, { data: data.data, valueChange: valueChange, editMode: 'browse', batch: false, initcode: data.initcode, pkorgs: [data.pk_org] });
                                    };
                                    this.setState(this.state);
                                }

                            };
                            return <NCButton className='objbtn' onClick={onClick}>{this.lang['SYSPARAM-000006']}</NCButton>/* 国际化处理： 参数对象,请点击*/
                        }


                        // debugger;
                        var valtype = record.getData().valuetype, //数据的值类型
                            stateflag = record.getData().stateflag;//渲染编辑框类型,
                        if (stateflag == 2)
                            return value == 'Y' ? this.lang['SYSPARAM-000015'] : this.lang['SYSPARAM-000014'];/* 国际化处理： 是,否*/
                        if (stateflag == 3)
                            return value == 'Y' || value == true ? this.lang['SYSPARAM-000015'] : this.lang['SYSPARAM-000014'];/* 国际化处理： 是,否*/
                        if (stateflag == 1) {
                            var langValueList = record.getData().data.langValueList;
                            var showValue = langValueList.filter(vals => {
                                return vals.value == value;
                            });
                            if (showValue && showValue.length == 1)
                                return showValue[0].name;
                        }
                        if (stateflag == 5) {
                            if (valtype != '0') {
                                return record.getData().mappingName;
                            }
                        }
                        return value;
                    },
                    editer: (record, index) => {
                        var data = record.getData(),
                            isys = data.data.sysinittempvo.sysflag,
                            powerdata = this.state.powerdata || {};

                        var isPowerEdit = true;

                        var content = this.lang['SYSPARAM-004018']

                        if (powerdata['pk_sysinit'] && powerdata['userType'] == 1 && powerdata['pk_sysinit'].indexOf(data.pk_sysinit) != -1) {
                            isPowerEdit = false
                        }

                        if (isys) {
                            var onClick = () => {
                                var refpath = data.data.sysinittempvo.refpath || '',
                                    jsname = refpath.substring(0, refpath.length - 3),
                                    jsClass = window[jsname],
                                    valueChange = (data) => {
                                        this.state.createSetValueModal = undefined;
                                        this.setState(this.state, () => {
                                            if (!data) return;
                                            console.log(this.lang['SYSPARAM-000021']);/* 国际化处理： 收到数据值改变消息*/
                                            var olddata = record.getData();
                                            olddata.data = data;
                                            olddata.value = data.sysinitvo ? (data.sysinitvo.value || '') : '';
                                            record.setData(olddata);
                                            this.table.getDirtyOperation().updateRecord(record);
                                        });
                                    };
                                if (jsClass && jsClass.default) {
                                    this.state.createSetValueModal = function () {
                                        return React.createElement(jsClass.default, { data: data.data, valueChange: valueChange, editMode: 'edit', batch: false, initcode: data.initcode, pkorgs: [data.pk_org] });
                                    };
                                    this.setState(this.state);
                                }

                            };
                            return <NCButton className='objbtn' onClick={onClick}>{this.lang['SYSPARAM-000006']}</NCButton>/* 国际化处理： 参数对象,请点击*/
                        }
                        //ParaSetTableModel
                        var valtype = record.getData().valuetype, //数据的值类型
                            stateflag = record.getData().stateflag, //渲染编辑框类型,
                            checkclass = record.getData().checkclass,
                            setSelectValue = (uitype) => {
                                if (!isPowerEdit) return function () {
                                    toast({ content: content, color: 'danger' })//'您没权限修改该参数，请联系管理员！'
                                };
                                return (value, comp) => {
                                    var handlerEditData = () => {
                                        var data = record.getData();
                                        //那位大哥在参数的验证类中调用了获取对话框的方法,这里只能特殊处理,针对BD602/603/604做校验,这三类都是布尔值
                                        //判定TM01的范围，领域不写只能写在这
                                        var setNewValue = () => {

                                            if (data.initcode == 'TM01') {
                                                //判断值是否是数字并在范围
                                                var num = parseInt(value);
                                                if (num > 8 || num < 1) {
                                                    toast({ content: '超出范围', color: 'danger' }); //
                                                    return
                                                }
                                            }
                                            data.value = value;
                                            if (uitype == 'date') { //钉耙format不管用
                                                var year = value.year();
                                                var month = value.month() + 1;
                                                var date = value.date();
                                                month = month < 10 ? '0' + month : month;
                                                date = date < 10 ? '0' + date : date;
                                                data.value = year + '-' + month + '-' + date;
                                            }
                                            record.setData(data);
                                            this.table.getDirtyOperation().updateRecord(record);
                                        };

                                        if (data.initcode == 'BD602' || data.initcode == 'BD603' || data.initcode == 'BD604') {
                                            if (value == 'Y') {
                                                toast({ content: this.lang['SYSPARAM-004007'], color: 'danger' }); //
                                                return;
                                            }
                                            promptBox({
                                                title: this.lang['SYSPARAM-000008'],/* 国际化处理： 确认信息*/
                                                content: this.lang['SYSPARAM-000022'], /* 国际化处理： 参数由是转否存在一定的风险，您确定要修改吗?,参数由是转否存在一定的风险,您确定要修改吗*/
                                                rightBtnName: this.lang['SYSPARAM-000014'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
                                                leftBtnName: this.lang['SYSPARAM-000015'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
                                                beSureBtnClick: () => {
                                                    setNewValue();
                                                },
                                                cancelBtnClick: () => { }
                                            });
                                        } else {
                                            setNewValue();
                                        }
                                    };
                                    handlerEditData();
                                }
                            };
                        switch (stateflag) {
                            case '0':   //文本框
                                var checkedValue = (value) => {
                                    if (valtype == 3) {
                                        var reg = /^\d+(?=\.{0,1}\d+$|$)/
                                        if (value && value.length > 0 && !reg.test(value))
                                            return this.lang['SYSPARAM-000024']/* 国际化处理： 输入值必须是一个整数*/
                                    }
                                    if (valtype == 4) {
                                        var reg = /^(-?\d+)(\.\d+)?$/
                                        if (value && value.length > 0 && !reg.test(value))
                                            return this.lang['SYSPARAM-000025']/* 国际化处理： 输入值必须是一个浮点数*/
                                    }
                                }
                                return (
                                    // <NCFormControl value={record.getData().value} onChange={setSelectValue()}/>
                                    <NCFormControl value={record.getData().value} onChange={setSelectValue(checkedValue)} />
                                );
                                break;

                            case '1':   //选择框
                                var langValueList = record.getData().data.langValueList || [];
                                return (
                                    <NCSelect value={record.getData().value} onSelect={setSelectValue()} showClear={false}>
                                        {langValueList.map(kv => (<Option key={kv.value} title={kv.name}>{kv.name}</Option>))}
                                    </NCSelect>
                                );
                                break;

                            case '2':   //布尔框
                                return (
                                    <NCSelect value={record.getData().value} onSelect={setSelectValue()} showClear={false}>
                                        {[{
                                            key: 'Y',
                                            val: this.lang['SYSPARAM-000015']/* 国际化处理： 是*/
                                        }, {
                                            key: 'N',
                                            val: this.lang['SYSPARAM-000014']/* 国际化处理： 否*/
                                        }].map(kv => (<Option key={kv.key}>{kv.val}</Option>))}
                                    </NCSelect>
                                );
                            case '3':   //checkbox
                                return (
                                    <NCSelect value={record.getData().value} onSelect={setSelectValue()} showClear={false}>
                                        <Option key='Y'>{this.lang['SYSPARAM-000015']/* 国际化处理： 是*/}</Option>
                                        <Option key='N'>{this.lang['SYSPARAM-000014']/* 国际化处理： 否*/}</Option>
                                    </NCSelect>
                                );
                                break;
                            case '5':   //date
                                if (valtype == '0') {
                                    return (
                                        <NCDatePicker onClick={(e) => clickDate(record, this.table, e.target)} format='YYYY-MM-DD' onSelect={setSelectValue('date')} value={record.getData().value} />
                                    );
                                } else {
                                    var refpath = data.data.sysinittempvo.refpath || '',
                                        jsname = refpath.substring(0, refpath.length - 3),
                                        jsClass = window[jsname];
                                    if (jsClass && jsClass.default) {
                                        var queryParam = {
                                            nodetype: this.config.nodetype,
                                            pk_org: this.config.nodetype == 'org' ? this.state.org.value.refpk : ''
                                        };
                                        if (data.data.sysinittempvo.ref_CondClass) {
                                            queryParam.TreeRefActionExt = data.data.sysinittempvo.ref_CondClass;
                                            queryParam.GridRefActionExt = data.data.sysinittempvo.ref_CondClass;
                                        }
                                        return jsClass.default({
                                            value: {
                                                refname: data.mappingName,
                                                refpk: data.value
                                            },
                                            onChange: (value) => {
                                                var data = record.getData();
                                                data.value = value.refpk;
                                                data.mappingName = value.refname;
                                                record.setData(data);
                                                this.table.getDirtyOperation().updateRecord(record);
                                            },
                                            queryCondition: () => {
                                                return queryParam;
                                            }
                                        });
                                    }
                                }
                                break;

                            default:
                                return '';
                                break
                        }

                    }
                }, {
                    title: this.lang['SYSPARAM-000026'], /* 国际化处理： 控制下级*/
                    dataIndex: 'controlflag',
                    key: 'controlflag',
                    width: 100,
                    render: (value, record, index) => {
                        return this.config.nodetype == 'glb' ? '' : (<NCCheckbox checked={record.getData().controlflag} disabled={true} />)
                    },
                    editer: (record, index) => {
                        if (this.config.nodetype == 'glb')
                            return '';
                        var setSelectValue = () => {
                            return (value, comp) => {
                                var data = record.getData();
                                data.controlflag = value;
                                record.setData(data);
                                this.table.getDirtyOperation().updateRecord(record);
                            }
                        };
                        return (<NCCheckbox checked={record.getData().controlflag} onChange={setSelectValue()} />);
                    }
                }, {
                    title: this.lang['SYSPARAM-000027'], /* 国际化处理： 取值范围*/
                    dataIndex: 'valuelist',
                    key: 'valuelist',
                    width: 200,
                    render: (value, record, index) => {
                        var lang_sysinittempvo = record.getData().data.lang_sysinittempvo || {};
                        return lang_sysinittempvo.valueList;
                    }
                }, {
                    title: this.lang['SYSPARAM-000028'],     /* 国际化处理： 注释*/
                    dataIndex: 'remark',
                    key: 'remark',
                    width: 200,
                    render: (value, record, index) => {
                        var lang_sysinittempvo = record.getData().data.lang_sysinittempvo || {};
                        return lang_sysinittempvo.remark;
                    }
                },{
                    title: this.lang['SYSPARAM-004019'], /* 国际化处理："最后修改人"*/
                    dataIndex: 'modifier',
                    width: 100,
                    key: 'modifier'
                },
                {
                    title: this.lang['SYSPARAM-004020'], /* 国际化处理： 最后修改时间*/
                    dataIndex: 'modifiedTime',
                    width: 200,
                    key: 'modifiedTime'
                }],
                listeners: {
                    modechange: (table, oldmode, newmode) => {
                        console.log('modechange');
                        setTimeout(() => {
                            this.updateBtnStatus.bind(this)();
                        }, 0);

                    },
                    selectedchange: () => {
                        console.log('selectchange');
                        setTimeout(() => {
                            this.updateBtnStatus.bind(this)();
                        }, 0);
                    },
                    load: () => {
                        console.log('load');
                        setTimeout(() => {
                            this.updateBtnStatus.bind(this)();
                        }, 0);
                    }
                }
            },

            batEdit: {
                onSumbit: () => {
                    var value = this.state.batEdit.paramValue.value;
                    var initcode = this.state.batEdit.refParam.value && this.state.batEdit.refParam.value.values ? this.state.batEdit.refParam.value.refcode : undefined;
                    var pkorgs = this.state.batEdit.refOrg.refFunParam.value || [];
                    pkorgs = pkorgs.map(m => {
                        return m.refpk;
                    });
                    if (!value || !initcode || pkorgs.length == 0) {
                        toast({ title: this.lang['SYSPARAM-004008'], color: 'danger' });/* 国际化处理： 提交校验！*/
                        return;
                    }

                    ajax({
                        url: '/nccloud/uapbd/sysparam/BatEditAction.do',
                        data: {
                            initcode: initcode,
                            pkorgs: pkorgs,
                            value: value
                        },
                        success: (res) => {
                            toast({ title: this.lang['SYSPARAM-000011'], color: 'success' });/* 国际化处理： 保存成功！*/
                            this.state.batEdit.modal.onHide();
                        }
                    });

                },
                paramValue: {
                    value: undefined,
                    hander: (value) => { //此处会传递数组 {pkorg:{},value }
                        this.state.batEdit.paramValue.value = value;
                        this.setState(this.state);
                    }
                },
                init: (callback) => {
                    this.state.batEdit.refParam.value = undefined;
                    this.state.batEdit.restRefOrg(undefined, () => {
                        this.setState(this.state, () => {
                            callback && callback();
                        });
                    });
                },
                modal: {
                    show: false,
                    backdropClosable: false,
                    size: 'xlg',
                    onHide: () => {
                        this.state.batEdit.modal.show = false;
                        this.setState(this.state, () => {
                            this.loadTableData();
                        });
                    }
                },
                refParam: {
                    value: undefined,
                    onChange: (value) => {
                        this.state.batEdit.refParam.value = value;
                        this.state.batEdit.refOrg.refFunParam.value = undefined;
                        this.state.batEdit.paramValue.value = undefined;

                        this.setState(this.state, () => {
                            if (!value || !value.values || !value.values.orgpath.value) {
                                this.state.batEdit.restRefOrg(undefined, () => { });
                                return;
                                // if(!value.values.orgpath.value || value.values.orgpath.value == ''){
                                //     console.log('缺少对应的组织参照:组织类型为：' + value.values.orgtype.value);
                                // }
                                // return;
                            }
                            this.loadJS([value.values.orgpath.value + '.js'], () => {
                                //   this.loadJS(['uapbd/paramtest/paramtest/main/index.js'], () =>{
                                //var jsname = url.substring(0,url.length-3);
                                var refOrg = window[value.values.orgpath.value];
                                this.state.batEdit.restRefOrg(refOrg);
                            }, () => {
                                console.log('加载参数错误 ' + value.values.orgpath.value);
                            })
                        });
                    },
                    queryCondition: () => {
                        return {
                            GridRefActionExt: 'nccloud.web.uapbd.param.sysparam.action.RefParamCond'
                        }
                    }
                },
                refOrg: {
                    refFun: () => { },
                    onChange: (value) => {
                        this.state.batEdit.refOrg.refFunParam.value = value;
                        this.setState(this.state, () => { });
                    },
                    refFunParam: {

                        value: undefined,
                        isMultiSelectedEnabled: true,
                        queryCondition: () => {
                            return {
                                AppCode: this.config.appcode || '',
                                TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                            }
                        }

                    }
                },
                restRefOrg: (refOrg, callback) => {
                    if (refOrg) {
                        this.state.batEdit.refOrg.refFun = refOrg.default;
                    } else {
                        var param = {
                            value: {},
                            multiLang: {
                                domainName: 'uapbd',
                                currentLocale: 'zh-CN',
                                moduleId: 'refer_uapbd',
                            },
                            placeholder: this.lang['SYSPARAM-000003'],
                            disabled: true
                        };
                        this.state.batEdit.refOrg.refFunParam.value = undefined;
                        this.state.batEdit.refOrg.refFun = () => {
                            return <Refer  {...param} />
                        }
                    }
                    this.setState(this.state, () => {
                        callback && callback();
                    });
                },
                table: {
                    rowKey: 'id',
                    columns: [{
                        title: this.lang['SYSPARAM-004003'],/* 国际化处理： 组织编码*/
                        dataIndex: 'refcode',
                        render: (text, record, index) => {
                            return record.refcode;

                        }
                    }, {
                        title: this.lang['SYSPARAM-004004'],/* 国际化处理： 组织名称*/
                        dataIndex: 'refname',
                        render: (text, record, index) => {
                            return record.refname;
                        }
                    }]
                },
                onClose: () => {
                    this.state.batEdit.modal.onHide();
                }
            },
            editMode: false,
            savetip: false
        };
        return state;
    }

    //处理选择框下拉列表数据
    handerVauelist(valstrings = '') {
        var kvs = [];
        if (valstrings.startsWith('C,')) { //“C,开头的需要按照json解析”
            var strs = valstrings.substr(2, valstrings.length);
            strs.split(',').forEach(valstr => {
                var kvstr = valstr.split('='),
                    kv = {
                        key: kvs[0],
                        val: kvs[1]
                    };
                kvs.push(kv);
            });
            return kvs;
        }
        var valstrs = valstrings.startsWith('I,') ? valstrings.substr(2, valstrings.length) : valstrings;
        valstrs.split(',').forEach(kv => {
            kvs.push({
                key: kv,
                val: kv
            });
        });

        kvs = kvs.filter(kv => {
            return kv.key.length > 0 && kv.val.length > 0
        });
        return kvs;
    }



    onBtnOperation(props, id) {
        switch (id.toLowerCase()) {
            case 'edit':
                this.onEdit();
                break;
            case 'cancel':
                this.onCancel();
                break;
            case 'save':
                this.onSave();
                break;
            case 'defvalue':
                this.onInitDef();
                break;
            case 'batchupdate':
                this.onPreBatEdit();
                break;
        }
    }

    updateBtnStatus() {
        var table = this.table,
            mode = table.getMode(),
            nodetype = this.config.nodetype,
            selRecord = table.getSelectRecord(),
            records = table.getRecords(),
            state = this.state;
        //设置按钮启用禁用状态

        this.state.org.disabled = mode === 'edit';
        this.state.search.disabled = mode === 'edit';
        this.state.treesearch.disabled = mode === 'edit';
        this.state.tree.disabled = mode === 'edit';
        this.setState(this.state, () => {
            this.props.button.setDisabled({
                edit: mode !== 'browse' || records.length == 0,
                save: mode !== 'edit',
                cancel: mode !== 'edit',
                defvalue: mode !== 'edit' || !selRecord,
            });
            //设置可以显示的按钮
            this.props.button.setButtonsVisible({
                edit: mode === 'browse',
                save: mode === 'edit',
                cancel: mode === 'edit',
                defvalue: mode === 'edit',
                group_print: mode === 'browse',
                batchupdate: nodetype === 'org' && mode === 'browse'
            });
            // //最后设置需要永久隐藏的按钮
            // this.props.button.setButtonsVisible({

            // });
        });
    }

    loadTree(callback) {
        ajax({
            loading: true,
            url: '/nccloud/uapbd/sysparam/TreeSystemAction.do',
            data: {
                nodetype: this.config.nodetype,
                pkorg: this.config.nodetype !== 'org' ? '' : this.state.org.value.refpk,
                isSys: this.config.isSys,
                isGlb: this.config.isGlb,
                funcode: this.config.funcode
            },
            success: (res) => {
                this.state.tree.datas = res.data || [];
                this.setState(this.state, () => {
                    callback && callback();
                });
            }
        });
    }

    loadRefer(datas, success = EMPTY_FN, error = EMPTY_FN) {
        var urls = (datas || []).filter(data => {
            return data.data.sysinittempvo.refpath && data.data.sysinittempvo.refpath.length > 0;
        });
        urls = urls.map(d => { return d.data.sysinittempvo.refpath });
        this.loadJS(urls, () => {
            success();
        }, (msg) => {
            // toast(msg);
            error(msg);
        });
    }


    loadJS(urls = [], success = EMPTY_FN, error = EMPTY_FN) {
        var urlCount = urls.length,
            completeCount = 0,
            errorObject = '',
            successObject = {},
            onlyone;
        urls.forEach((url, index) => {
            if (!url || url == '')
                callerror('url is null value , please init inittempvo\'s refpath ');

            var jsname = url.substring(0, url.length - 3),
                jsClass = window[jsname],
                script,
                callback = (fn, argu = []) => {
                    this.state.loadingshow = false;
                    this.setState(this.state, () => {
                        fn(...argu);
                    });
                }
            if (jsClass) {
                completeCount = completeCount + 1;
            } else {
                script = document.createElement('script');
                script.src = '../../../../' + url;
                script.type = 'text/javascript';
                script.onload = () => {
                    let jsClass = window[jsname];
                    completeCount = completeCount + 1;
                    if (!jsClass) {
                        errorObject = this.lang['SYSPARAM-000009'];/* 国际化处理： 领域预置的自定义参数没有设置JS组件*/
                    }
                    if (completeCount == urlCount) {
                        errorObject.length == 0 ? success(jsClass) : error(errorObject);
                    }
                };
                script.onerror = () => {
                    completeCount = completeCount + 1;
                    errorObject = this.lang['SYSPARAM-000009'];//errorObject +  'check file url = [' +script.src + ']';/* 国际化处理： 领域预置的自定义参数没有设置JS组件*/
                    if (completeCount == urlCount) {
                        errorObject.length == 0 ? success() : error(errorObject);
                    }
                };
                document.body.appendChild(script);
            }
        });
        if (completeCount == urlCount) {
            errorObject.length == 0 ? success() : error();
        }
    }


    loadTableData() {
        if (this.config.nodetype == 'org') {
            if (!this.state.org.value || !this.state.org.value.refpk || this.state.org.value.refpk.length == 0) {
                return;
            }
        }
        var me = this;
        // if(!this.state.tree.selectedNode) return;
        var param = {
            ... (this.state.tree.selectedNode && this.state.tree.selectedNode.props.nodeData) || {},
            pkorg: this.config.nodetype === 'org' ? this.state.org.value.refpk : '',
            nodetype: this.config.nodetype,
            codename: this.state.search.value || ''
        };
        ajax({
            loading: true,
            data: param,
            url: '/nccloud/uapbd/sysparam/ListParamAction.do',
            success: (res) => {
                var datas = !res.success ? [] : res.data.datas,
                    isapply = res.data.isapply,
                    state = this.state;
                datas = datas ? datas : [];

                // var langExs = {
                //     'PO06': '供应商价目表,参考成本,计划价,订单最新价,订单最低价,请购单单价',
                //     'PO16': '供应商,物料,币种,单据日期,报价单位,结算财务组织,生产产商,质量等级,收货地区,运输方式',
                //     'PO27': '入库单价,订单价,订单最新价,最新结算价,供应商价目表',
                //     'PO83': '订单最新价,参照成本,供应商价目表,订单价,入库单价'
                // };


                // "SYSPARAM-00PO06":"供应商价目表,参考成本,计划价,订单最新价,订单最低价,请购单单价",
                // "SYSPARAM-00PO16":"供应商,物料,币种,单据日期,报价单位,结算财务组织,生产产商,质量等级,收货地区,运输方式",
                // "SYSPARAM-00PO27":"入库单价,订单价,订单最新价,最新结算价,供应商价目表",
                // "SYSPARAM-00PO83":"订单最新价,参照成本,供应商价目表,订单价,入库单价"

                var langExs = {
                    'PO06': this.lang['SYSPARAM-00PO06'],
                    'PO16': this.lang['SYSPARAM-00PO16'],
                    'PO27': this.lang['SYSPARAM-00PO27'],
                    'PO83': this.lang['SYSPARAM-00PO83']
                };

                datas = datas.map((data) => {
                    return { ...data.sysinitvo, ...data.sysinittempvo, data: data };
                })

                datas.forEach((d) => {
                    if (langExs[d.initcode]) {
                        d.data.valuelistex = langExs[d.initcode];
                    }
                });

                this.state.isapply = isapply;
                this.setState(this.state, () => {
                    //load js Data
                    this.loadRefer(datas, () => {
                        this.table.loadData(datas);
                    }, (error) => {
                        // toast({content:error,color:'danger'});
                        this.table.loadData(datas);
                    });
                });
            }
        });
    }

    onEdit() {
        if (this.state.isapply) {
            toast({ content: this.lang['SYSPARAM-000010'], color: 'warning' });/* 国际化处理： 参数修改需申请,请填写参数申请单*/
            return;
        }
        this.state.savetip = false;
        this.setState(this.state, () => {
            this.table.editMode();
        });

    }

    onSave() {
        var dirtyFns = this.table.getDirtyOperation(),
            dirtyRecords = dirtyFns.getRecords(), //获取脏数据
            editRecords = Record.filterByStatus(dirtyRecords, 'add', 'edit', 'del'), //过滤出实际的脏数据
            allRecords = Record.filterByStatus(dirtyRecords, 'add', 'edit', 'del', 'common'), //过滤出实际的脏数据
            // allRecords = dirtyFns.getRecords(),
            editDatas = [],
            allDatas = [],
            needDatas = [],
            needAllDatas = [];

        editDatas = editRecords.map(er => {
            return er.getData();
        });
        allDatas = allRecords.map(er => {
            return er.getData();
        });

        var sumbitData = () => {
            // var flag = false
            editDatas.forEach(data => {//转换一下数据, 变成对应后台可接收的结构
                //  参数值校验前端改后端
                // if((data.valuetype == '3'||data.valuetype == '4')&&data.valuelist!=null){
                //     var values = data.valuelist.split("-")
                //     if(data.value<values[0]||data.value>values[1]){
                //         toast({content:data.initcode + this.lang['SYSPARAM-004017'],color:'warning'});
                //         flag = true;
                //         return
                //     }
                // }
                var data = data.data;
                // data.sysinitvo.value = record.getData().value;
                needDatas.push(data);
            });
            // if (flag)
            //     return
            allDatas.forEach(data => {//转换一下数据, 变成对应后台可接收的结构
                var data = data.data;
                // data.sysinitvo.value = record.getData().value;
                needAllDatas.push(data);
            });
            ajax({
                loading: true,
                data: {
                    paramVO: needDatas,
                    allparamVO: needAllDatas
                },
                url: '/nccloud/uapbd/sysparam/SaveParamAction.do',
                success: (res) => {
                    if (res.data && res.data.length > 0) {
                        toast({ content: res.data, color: 'warning' });
                        return;
                    }
                    toast({ title: this.lang['SYSPARAM-000011'], color: 'success' });/* 国际化处理： 保存成功！*/
                    this.table.synEditMode(() => {
                        this.loadTableData();
                    });
                }
            });


        };

        var checkedData = (callback) => {
            var needData;
            editDatas.forEach(data => {//转换一下数据, 变成对应后台可接收的结构
                if (data.data.sysinitvo) {
                    data.data.sysinitvo.value = data.value;
                    if (data.data.sysinitvo.controlflag != data.controlflag && !data.datachecked) {
                        needData = data;
                    }
                }
            });
            allDatas.forEach(data => {//转换一下数据, 变成对应后台可接收的结构
                if (data.data.sysinitvo) {
                    data.data.sysinitvo.value = data.value;
                }
            });
            if (needData) {
                //this.props.modal.show('modal',{
                promptBox({
                    title: this.lang['SYSPARAM-000008'],/* 国际化处理： 确认信息*/
                    content: needData.data.lang_sysinittempvo.initName + '---' + (needData.controlflag ? this.lang['SYSPARAM-000012'] : this.lang['SYSPARAM-000013']),/* 国际化处理：  是否同时保存控制下级,是否取消保存控制下级*/
                    rightBtnName: this.lang['SYSPARAM-000014'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
                    leftBtnName: this.lang['SYSPARAM-000015'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
                    beSureBtnClick: () => {
                        needData.data.sysinitvo.controlflag = needData.controlflag;
                        checkedData(callback);
                    },
                    cancelBtnClick: () => {
                        needData.datachecked = true;
                        checkedData(callback);
                    }
                });
            } else {
                callback && callback();
            }
        }



        checkedData(sumbitData);
    }

    onCancel() {
        promptBox({
            color: 'warning',
            title: this.lang['SYSPARAM-004015'],/* 国际化处理： 确认取消*/
            content: this.lang['SYSPARAM-000016'],/* 国际化处理：  确认取消修改?*/
            rightBtnName: this.lang['SYSPARAM-000014'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
            leftBtnName: this.lang['SYSPARAM-000015'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
            beSureBtnClick: () => {
                this.table.cancelEditMode();
            }
        });

    }

    onInitDef() {
        var record = this.table.getSelectRecord(),
            data = record.getData(),
            isys = data.data.sysinittempvo.sysflag;
        debugger;
        if (!isys) {
            data.value = data.defaultvalue;
            record.setData(data);
            this.table.getDirtyOperation().updateRecord(record);
        }

    }
    onPreBatEdit() { //批改等平台
        this.state.batEdit.init(() => {
            this.state.batEdit.modal.show = true;
            this.setState(this.state);
        });

    }

    onSearch() {
        this.loadTableData();
    }


    createBatEditField(temp0, paramCfg) {

        if (!temp0) return '';
        var temp = {};
        for (let [key, value] of Object.entries(temp0)) {
            temp[key] = value.value;
        }
        // var curValue = paramCfg.value; //供应链需求，此处value是对象
        var curValue = paramCfg.value ? paramCfg.value.value : undefined;

        var hander = paramCfg.hander;
        var setSelectValue = (uitype) => {
            return (value, comp) => {

                var handlerEditData = () => {
                    var setNewValue = () => {  //那位大哥在参数的验证类中调用了获取对话框的方法,这里只能特殊处理,针对BD602/603/604做校验,这三类都是布尔值
                        if (uitype == 'date') { //钉耙format不管用
                            var year = value.year();
                            var month = value.month() + 1;
                            var date = value.date();
                            month = month < 10 ? '0' + month : month;
                            date = date < 10 ? '0' + date : date;
                            data.value = year + '-' + month + '-' + date;
                        }
                        if (temp.sysflag == 'Y') { //供应链特殊参数批改处理 value形式为 [pk_org:{},value]
                            value.result = value.forEach(v => {
                                newValues[v.pk_org] = value.value
                            });
                        }
                        hander && hander({
                            sysflag: temp.sysflag,
                            value: value
                        });
                        //hander && hander(value);
                    };

                    if (temp0.initcode == 'BD602' || temp0.initcode == 'BD603' || temp0.initcode == 'BD604') {
                        promptBox({
                            title: this.lang['SYSPARAM-000008'],/* 国际化处理： 确认信息*/
                            content: this.lang['SYSPARAM-000022'], /* 国际化处理： 参数由是转否存在一定的风险，您确定要修改吗?,参数由是转否存在一定的风险,您确定要修改吗*/
                            rightBtnName: this.lang['SYSPARAM-000014'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
                            leftBtnName: this.lang['SYSPARAM-000015'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
                            beSureBtnClick: () => {
                                setNewValue();
                            },
                            cancelBtnClick: () => { }
                        });
                    } else {
                        setNewValue();
                    }
                }
                handlerEditData();
            }
        };
        if (temp.sysflag == 'Y') {
            var onClick = () => {
                var valueChange = (data) => { //此处一定是多选的，data按字符处理
                    this.state.createBatSetValueModal = undefined;
                    this.setState(this.state, () => {
                        if (!data) return;
                        var newdatas = {};
                        data.forEach(v => {
                            newdatas[v.pk_org] = v.value
                        });
                        hander({
                            sysflag: temp.sysflag,
                            value: newdatas
                        });
                    });
                };
                this.loadJS([temp.refpath || 'uapbd/paramtest/paramtest/main/index.js'], () => {
                    var refpath = temp.refpath || 'uapbd/paramtest/paramtest/main/index.js',
                        jsname = refpath.substring(0, refpath.length - 3),
                        jsClass = window[jsname];
                    if (jsClass && jsClass.default) {
                        var initcode = this.state.batEdit.refParam.value && this.state.batEdit.refParam.value.values ? this.state.batEdit.refParam.value.refcode : undefined;
                        var pkorgs = this.state.batEdit.refOrg.refFunParam.value || [];
                        pkorgs = pkorgs.map(org => {
                            return org.refpk;
                        });
                        this.state.createBatSetValueModal = function () {
                            //此处按照批量传递值处理，pkorg[], initcode,
                            return React.createElement(jsClass.default, {
                                data: {
                                    sysinittempvo: {
                                        initcode: initcode
                                    }
                                }, valueChange: valueChange, editMode: 'edit', batch: true, initcode: initcode, pkorgs: pkorgs
                            });
                        };
                        this.setState(this.state);
                    }
                });
            };
            return <NCButton  className='objbtn' onClick={onClick}>{this.lang['SYSPARAM-000006']}</NCButton>/* 国际化处理： 参数对象,请点击*/
        }

        switch (temp.stateflag) {
            case '0':   //文本框
                var checkedValue = (value) => {
                    if (valtype == 3) {
                        var reg = /^\d+(?=\.{0,1}\d+$|$)/
                        if (value && value.length > 0 && !reg.test(value))
                            return this.lang['SYSPARAM-000024']/* 国际化处理： 输入值必须是一个整数*/
                    }
                    if (valtype == 4) {
                        var reg = /^(-?\d+)(\.\d+)?$/
                        if (value && value.length > 0 && !reg.test(value))
                            return this.lang['SYSPARAM-000025']/* 国际化处理： 输入值必须是一个浮点数*/
                    }
                }
                return (
                    // <NCFormControl value={record.getData().value} onChange={setSelectValue()}/>
                    <div>
                        <div className='correction-sys'>
                            {this.lang['SYSPARAM-004014']/* { 批改参数值  } */}
                        </div>
                        <div className='correction-content'>
                            <NCFormControl value={curValue} onChange={setSelectValue(checkedValue)} />
                        </div>
                    </div>
                );
                break;
            case '1':   //选择框
            debugger
                var langValueList = temp.valuelistex || [];
                return (
                    <div>
                        <div className='correction-sys'>
                            {this.lang['SYSPARAM-004014']/* { 批改参数值  } */}
                        </div>
                        <div className='correction-content'>
                            <NCSelect value={curValue} onSelect={setSelectValue()} showClear={false}>
                                {langValueList.map(kv => (<Option key={kv.value} title={kv.name}>{kv.name}</Option>))}
                            </NCSelect>
                        </div>
                    </div>
                );
                break;
            case '2':   //布尔框
                return (
                    <div>
                        <div className='correction-sys'>
                            {this.lang['SYSPARAM-004014']/* { 批改参数值  } */}
                        </div>
                        <div className='correction-content'>
                            <NCSelect value={curValue} onSelect={setSelectValue()} showClear={false}>
                                {[{
                                    key: 'Y',
                                    val: this.lang['SYSPARAM-000015']/* 国际化处理： 是*/
                                }, {
                                    key: 'N',
                                    val: this.lang['SYSPARAM-000014']/* 国际化处理： 否*/
                                }].map(kv => (<Option key={kv.key}>{kv.val}</Option>))}
                            </NCSelect>
                        </div>
                    </div>
                );
            case '3':   //checkbox
                return (
                    <div>
                        <div className='correction-sys'>
                            {this.lang['SYSPARAM-004014']/* { 批改参数值  } */}
                        </div>
                        <div className='correction-content'>
                            <NCSelect value={curValue} onSelect={setSelectValue()} showClear={false}>
                                <Option key='Y'>{this.lang['SYSPARAM-000015']/* 国际化处理： 是*/}</Option>
                                <Option key='N'>{this.lang['SYSPARAM-000014']/* 国际化处理： 否*/}</Option>
                            </NCSelect>
                        </div>
                    </div>
                );
                break;
            case '5':   //date
                if (valtype == '0') {
                    return (
                        <div>
                            <div className='correction-sys'>
                                {this.lang['SYSPARAM-004014']/* { 批改参数值  } */}
                            </div>
                            <div className='correction-content'>
                                <NCDatePicker format='YYYY-MM-DD' onSelect={setSelectValue('date')} value={record.getData().value} />
                            </div>
                        </div>
                    );
                } else {
                    var refpath = temp.refpath || '',
                        jsname = refpath.substring(0, refpath.length - 3),
                        jsClass = window[jsname];
                    if (!jsClass) {
                        jsClass = {
                            __esModule: true,
                            default: function () { }
                        }
                    }
                    if (jsClass && jsClass.default) {
                        var queryParam = {
                            nodetype: this.config.nodetype,
                            pk_org: this.config.nodetype == 'org' ? this.state.org.value.refpk : ''
                        };
                        if (temp.ref_CondClass) {
                            queryParam.TreeRefActionExt = temp.ref_CondClass;
                            queryParam.GridRefActionExt = temp.ref_CondClass;
                        }
                        return jsClass.default({
                            value: curValue,
                            onChange: (value) => {
                                setSelectValue()(value);
                            },
                            queryCondition: () => {
                                return queryParam;
                            }
                        });
                    }
                }
        }
    }


    render() {
        if (!this.lang) return '';
        let { editTable, syncTree, button, search, DragWidthCom, modal, BillHeadInfo } = this.props;
        const { createBillHeadInfo } = BillHeadInfo;
        let { createEditTable } = editTable;
        let { createSyncTree } = syncTree;
        let { createButtonApp } = button;
        let { NCCreateSearch } = search;
        let { createModal } = modal;
        var createValueModal = () => {



        };
        var searchRender = {
            ...this.state.treesearch,
            value: this.state.treesearch.valueTemp
        };

        var stateflag = this.state.batEdit.refParam.value && this.state.batEdit.refParam.value.values && this.state.batEdit.refParam.value.values.stateflag.value;
        var valuetype = this.state.batEdit.refParam.value && this.state.batEdit.refParam.value.values && this.state.batEdit.refParam.value.values.valuetype.value;


        return (
            <div className="nc-bill-tree-table">
                {createModal('modal', { noFooter: false })}
                <NCLoading fullScreen={true} showBackDrop={true} show={this.state.loadingshow} loadingType="line" />
                {this.state.createSetValueModal ? this.state.createSetValueModal() : ''}
                {this.state.createBatSetValueModal ? this.state.createBatSetValueModal() : ''}

                {createModal('tip')}
                <NCDiv areaCode={NCDiv.config.HEADER} className="header">
                    {
                        createBillHeadInfo(
                            {
                                title: this.config.title,             //标题
                                initShowBackBtn: false
                            }
                        )}
                    {this.config.nodetype !== 'org' ? '' : <div className="search-box" style={{ width: 200 }}> {Org({ ...this.state.org })}</div>}
                    <div className="search-box search_box_hidden_close" fieldid="from_serch"><NCFormControl {...this.state.search} /></div>
                    <div className=" btn-group">
                        {createButtonApp({
                            area: 'main',
                            onButtonClick: this.onBtnOperation.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="tree-table uapbd-sysparam-table-contain">
                    <DragWidthCom
                        leftDom={
                            <NCDiv fieldid="sysparam" areaCode={NCDiv.config.TREE} className="tree-area">
                                <div class="syncTreeCom syncTreeComLineStyle" id="accSchemeTree">
                                    <div className="NC_syncTreeSearch NC_syncTreeSearch_self_width" >
                                        <NCFormControl {...searchRender} />
                                        <i class="icon iconfont icon-sousuo syncTreeSearchIcon"></i>
                                        {/* <i class="icon iconfont qingkong syncTreeSearchIcon icon-qingkong"

                                        ></i> */}
                                        {/* <i class="icon iconfont icon-sousuo syncTreeSearchIcon" style={{position: 'absolute',top: 7,right: 5,color: '#878b94'}}></i> */}
                                        {this.state.treesearch.valueTemp && (<i className="icon iconfont qingkong syncTreeSearchIcon icon-qingkong"
                                            onClick={() => {
                                                this.state.treesearch.valueTemp = '';
                                                this.state.treesearch.value = '';

                                                this.setState(this.state.treesearch, () => {
                                                    this.state.treesearch.onSearch();
                                                });
                                            }} />
                                        )}
                                    </div>
                                    <NCDiv fieldid='systree' areaCode={NCDiv.config.TreeCom} className='synctree-area' >
                                        <NCTree {...this.state.tree}>{this.state.tree.renderNode()}</NCTree>
                                    </NCDiv>
                                </div>
                            </NCDiv>
                        }
                        rightDom={
                            this.config.nodetype == 'org' ?
                                <div className="table-area sysparam-table-area">
                                    <EmptyAreaTip
                                        desc={this.lang['SYSPARAM-004016']/* { 请选择组织单元  } */} show={this.state.listEmpty && !this.config.pkorg} />
                                    <div class="table-area sysparam-table-area1" style={{ display: this.state.listEmpty && !this.config.pkorg ? 'none' : 'block' }}>
                                        <Table {...this.state.table} ref={(table) => this.table = table}/>
                                    </div>
                                </div>
                                :
                                <div class="table-area sysparam-table-area">
                                    <Table  {...this.state.table} ref={(table) => this.table = table}/>
                                </div>
                        }
                        defLeftWid='280px'
                    />
                </div>

                <NCModal className='sys-correction-modal' fieldid="sysparam" {...this.state.batEdit.modal}>
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{this.lang['SYSPARAM-004001']/* 批改*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body className="nc-theme-common-font-c">
                        <NCRow md={12} xs={12} sm={12}>
                            <NCCol md={4} xs={4} sm={4}>
                                <div>
                                    <div className='correction-sys'>
                                        {this.lang['SYSPARAM-004011']/* 参数编码*/}
                                    </div>
                                    <div className='correction-content'>
                                        {RefParam(this.state.batEdit.refParam)}
                                    </div>
                                </div>
                            </NCCol>
                            <NCCol md={4} xs={4} sm={4}>
                                <div className='correction-sys'>
                                    {this.lang['SYSPARAM-004012']/* 参数名称*/}
                                </div>
                                <div className='correction-content'>
                                    <NCInput disabled={true} placeholder={this.lang['SYSPARAM-004009']} value={this.state.batEdit.refParam.value && this.state.batEdit.refParam.value.values ? this.state.batEdit.refParam.value.values['initname as initnameExt'].value : ''} />
                                </div>
                            </NCCol>
                            <NCCol md={4} xs={4} sm={4}>
                                <div className='correction-sys'>
                                    {this.lang['SYSPARAM-004010']/* 取值范围*/}
                                </div>
                                <div className='correction-content'>
                                    <NCInput disabled={true} placeholder={this.lang['SYSPARAM-004010']} value={this.state.batEdit.refParam.value && this.state.batEdit.refParam.value.values ? this.state.batEdit.refParam.value.values.valuelist.value : ''} />
                                </div>
                            </NCCol>
                        </NCRow> 

                        <NCRow md={12} xs={12} sm={12} style={{ margin: '10px -15px' }}>
                            <NCCol md={4} xs={4} sm={4}>
                                <div className='correction-sys'>
                                    {this.lang['SYSPARAM-004013']/* 参数所属组织*/}

                                </div>
                                <div className='correction-content'>
                                    {this.state.batEdit.refOrg.refFun({ ...this.state.batEdit.refOrg.refFunParam, onChange: this.state.batEdit.refOrg.onChange })}
                                </div>
                            </NCCol>
                        </NCRow>
                        {/* style={{borderBottom:'1px solid #d0d0d0'}} */}
                        <div>
                            <NCTable {...this.state.batEdit.table} data={this.state.batEdit.refOrg.refFunParam.value || []} {...{ scroll: { y: 360 } }}></NCTable>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            {this.createBatEditField(this.state.batEdit.refParam.value ? this.state.batEdit.refParam.value.values : undefined, this.state.batEdit.paramValue)}
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <span><NCButton fieldid={"batcheditonSumbit"} onClick={this.state.batEdit.onSumbit}>{this.lang['SYSPARAM-004006']/* 国际化处理： 保存*/}</NCButton></span>
                        <span><NCButton fieldid={"batcheditonclose"} onClick={this.state.batEdit.onClose}>{this.lang['SYSPARAM-004002']/* 国际化处理： 关闭*/}</NCButton></span>
                    </NCModal.Footer>
                </NCModal>

            </div>


        )
    }
}
export default SysParam;

//X2Qliz9NycFgFozx4JYU+FJNtrJfS9zVjCeLKuV8tF8qFiFtQA1G67elh1iFE1M+