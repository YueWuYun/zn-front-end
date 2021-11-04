//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createPage, base, toast, print, high, promptBox, createPageIcon, excelImportconfig,output} from 'nc-lightapp-front';

const {PrintOutput, ExcelImport} = high;
import {ajax} from 'nc-lightapp-front';
//import Org from '../../../refer/org/AccountBookTreeRef/index';
import Org from '../../../refer/org/AdminOrgDefaultTreeRef';
import Group from '../../../refer/org/GroupDefaultTreeRef';
import Dept from '../../../refer/org/DeptNCTreeRef';
import userGroup from '../../../../uap/refer/riart/userGroupTreeRef/index';
import Psnclass from '../../../../uapbd/refer/psninfo/PsnclTreeRef/index.js';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import Utils from '../../../public/utils/index.js';
import {component} from '../../../public/platwapper/index.js';
//import Org from '../../../../uapbd/refer/fiacc/AccountDefaultReferModelRef/index.js';
/**
 * 引入公共 js 工具，使用了 Array.prototype.arrRemoveAppoint 方法
 */
import '../../../public/uapbdutil/uapbd_js_common.js'

let {NCTable} = component;
let {NCTree,NCFormControl,NCSelect, NCButton,NCDiv, NCTabs, NCCheckbox, NCCol, NCRow, NCOption, NCModal, NCCollapse, NCIcon, NCPopconfirm, NCDatePicker, NCInput, NCBackBtn, NCAffix} = base;

import '../../../public/uapbdstyle/uapbd_style_common.less'
import './index.less';

//1,按要求去掉分页
//2,按要求编辑表单改成侧拉窗口, 需要修改simpleTable为editTable
//3,按要求数据行树小于某值查询按过滤处理，大于某值按查询处理.

var metaUtils = {
    addQueryConditon: function (meta, areacode, itemcode, condition) {
        var items = meta[areacode].items || [];
        items.forEach(item => {
            if (item.attrcode == itemcode) {
                item.queryCondition = condition;
            }
        });
    },
    delQueryConditon: function (meta, areacode, itemcode) {
        var items = meta[areacode].items || [];
        items.forEach(item => {
            if (item.attrcode == itemcode) {
                if (item.querycondition) {
                    delete item['queryCondition']
                }
            }
        });
    }
}

var createUIDomParam = function (pagecode, appcode) {
    var param = {
        pagecode: pagecode
    };
    return window.location.href.startsWith('http://127.0.0.1:3006') ? {...param, appcode: appcode} : param;
};


class Psndoc extends Component {

    componentDidUpdate() {
        if (this.state.card.editMode == 'edit' || this.state.createuser.modal.show || this.state.transfer.modal.show) {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        } else {

            window.onbeforeunload = null;
        }
    }

    constructor(props) {
        super(props);
        // this.config = config{
        //     pagecode: '10140PSN_main',
        // 	appcode: '10140PSN'
        // };

        this.config = createUIDomParam('10140PSN_main', '10140PSN');

        var me = this;
        //props.createUIDom(this.config, (data)=> {
        createUIDom(props)(this.config, {moduleId: "10140PSN", domainName: 'uapbd'}, (data, lang) => {
            this.lang = lang;
            this.state = this.createState(data);
            this.state.buttons = data.button || [];
            this.setState(this.state, () => {
                this.initMeta(data);
                //添加分页
                data.template['psndoc_list'].pagination = true;
                props.meta.setMeta(data && data.template ? data.template : {});
                props.button.setButtons(data && data.button ? data.button : {}, () => {
                    let excelimportconfig = excelImportconfig(props, 'uapbd', 'psndoc', true, '', {
                        'appcode': '10140PSN',
                        'pagecode': '10140PSN_main'
                    }, () => {
                        this.browseListPsndoc();
                    });
                    props.button.setUploadConfig("Import", excelimportconfig);
                    this.props.button.setPopContent('list_rowdelete', this.lang['10140PSN-000036']);
                    /* 国际化处理： 确认要删除该信息吗？,确认要删除该信息吗*/
                    var context = data.context || {};
                    //处理超链接
                    let id = this.props.getUrlParam("id");
                    setTimeout(() => {
                        if (context.pk_org) {
                            this.state.org.value = {
                                refpk: context.pk_org,
                                refname: context.org_Name
                            };
                            this.setState(this.state, () => {
                                if (id)
                                    this.browseFormPsndoc(id);
                                else {
                                    this.updateButtonStatus();
                                    this.loadDept();
                                }
                            });
                            return;
                        }
                        if (id)
                            this.browseFormPsndoc(id);
                        else
                            this.updateButtonStatus();
                    }, 0);
                });
            });
        });

        window.onbeforeunload = () => {
            if (this.state.editMode == 'edit')
                return;
            else
                return;
        };
    }

    createState(template) {
        var me = this;
        var state = {  //添加当前选中组织到State
            showMode: 'list',
            buttons: [],
            pks: [],
            org: {
                value: undefined,
                fieldid: 'psndocorg',
                showGroup: false,
                onChange: (val) => {
                    this.state.org.value = val;
                    this.setState(this.state, () => {
                        this.updateButtonStatus();
                        this.loadDept((datas) => {
                            let selectedKey = datas[0] ? datas[0].key : '-1'
                            let firatLoad = {
                                first: {
                                    selected: selectedKey != -1,
                                    node: {
                                        props: {
                                            nodeData: datas && datas[0] ? datas[0].nodeData : null
                                        }
                                    }
                                }
                            }
                            this.state.treeDept.onSelect([selectedKey], firatLoad)
                        });
                    });
                },
                fieldid: 'org',
                queryCondition: () => {//组织权限
                    return {
                        AppCode: this.config.appcode || '',
                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                }
            },

            showoff: {
                defaultChecked: false,
                checked: false,
                size: 'lg',
                onChange: (val) => {
                    this.state.showoff.checked = val;
                    console.log('check set value =' + val);
                    this.state.org.showGroup = val;
                    this.setState(this.state, () => {
                        this.updateButtonStatus();
                        this.loadDept();
                    });
                }
            },

            showoffpsn: {
                defaultChecked: false,
                checked: false,
                size: 'lg',
                onChange: (val) => {
                    this.state.showoffpsn.checked = val;
                    this.setState(this.state, () => {
                        this.updateButtonStatus();
                        this.browseListPsndoc();
                    });
                }
            },

            subpsn: {
                defaultChecked: false,
                checked: false,
                size: 'lg',
                onChange: (val) => {
                    this.state.subpsn.checked = val;
                    this.setState(this.state, () => {
                        this.updateButtonStatus();
                        this.browseListPsndoc();
                    });
                }
            },

            search: {
                id: 'psndoc_search',
                defaultConditionsNum: 2,
                //oid:'1009Z0100000000021AZ',
                oid: template.template.psndoc_search.oid,
                // oid:this.props.search.getQueryInfo('psndoc_search').oid,
                clickSearchBtn: () => {
                    this.browseListPsndoc((data) => {
                        data && (data.psndoc_list.pageInfo.total > 0 || data.psndoc_list.pageInfo.total == '0') ? toast({
                            content: this.lang['10140PSN-000088'] + (data.psndoc_list.pageInfo.total) + this.lang['10140PSN-000089'],
                            color: 'success'
                        }) : toast({
                            //title: this.lang['10140PSN-001091'],
                            content: this.lang['10140PSN-001092'],
                            color: 'warning'
                        }); //提示 warning  ///* 国际化处理： 查询到,条数据*/
                    }, true);
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
                            debugger;
                            child.needShow = expand ? true : (child.title.indexOf(textValue) != -1 ? true : false);
                            parendExpand = parendExpand ? parendExpand : child.needShow;
                            if (expand) {
                                expandKeys.push(child.key);
                            }
                        });
                        return parendExpand;
                    }
                    var rootExpand = loopsearch(this.state.treeDept.datas);
                    expandKeys.push('root');
                    this.state.treeDept.expandedKeys = expandKeys;
                    this.setState(this.state);
                }
            },

            treeDept: {
                root: {
                    title: this.lang['10140PSN-000039'], /* 国际化处理： 部门*/
                    code: this.lang['10140PSN-000039'], /* 国际化处理： 部门*/
                    key: 'root'
                },
                fieldid:'dept',
                autoExpandParent: false,
                expandedKeys: [],
                defaultExpandAll: true,
                datas: [],
                selectedKeys: [],
                selectedNode: undefined,
                showLine: true,
                expandedKeys: ['root'],
                openIcon: (<i fieldid="opentree-switcher" class="icon iconfont icon-shu_zk tree-swich"></i>),
                closeIcon: (<i fieldid="closetree-switcher" class="icon iconfont icon-shushouqi tree-swich"></i>),
                onSelect: (selectedKeys, e,callback) => {
                    e = e.first || e;
                    if (!e.selected)
                        var td = this.state.treeDept;
                    this.state.treeDept = {
                        ...this.state.treeDept,
                        selectedKeys: e.selected ? selectedKeys : this.state.treeDept.selectedKeys,
                        selectedNode: e.selected ? e.node : this.state.treeDept.selectedNode
                    };

                    this.setState(this.state, () => {
                        this.updateButtonStatus();
                        this.loadListPsndoc((data) => {
                            this.fillListPsndoc(data);
                            callback && callback();
                        }, false, true);
                    });
                },
                onExpand: (expandedKeys) => {
                    this.state.treeDept.expandedKeys = expandedKeys;
                    this.setState(this.state);
                },
                onDoubleClick: (checkedKeys) => {
                    // arrRemoveAppoint 是一个数组删除方法
                    this.state.treeDept.expandedKeys.includes(checkedKeys) ? this.state.treeDept.expandedKeys.arrRemoveAppoint(checkedKeys) : this.state.treeDept.expandedKeys.push(checkedKeys);
                    this.setState(this.state);
                },
                renderNode: () => {
                    var textValue = this.state.treesearch.value;
                    var drawTitleString = (item) => {
                        let isExpand = this.state.treeDept.expandedKeys.includes(item.key);
                        var isLeaf = !item.children.length, title = item.title;

                        let className = isLeaf ? "tree-dian" : isExpand ? "refer-tree-switch iconfont icon-wenjianjiadakai" : "refer-tree-switch iconfont icon-wenjianjia";
                        if (textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1) {
                            var start = title.indexOf(textValue), end = start + textValue.length;
                            return <span><i style={{color: '#f2b224'}} className={className}/><span
                                className='refer-tree-title'>{title.substring(0, start)}</span><span
                                className="uapbd-psndoc-treefilter-highlight">{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                        } else {
                            return <span><i style={{color: '#f2b224'}} className={className}/><span
                                className='refer-tree-title'>{title}</span></span>;
                        }
                    };
                    // const loop = (datas, pdata) => datas.map((item) => {
                    //     var children = item.children || [];
                    //     var isLeaf = !item.children.length && item.key != "root";
                    //     return (<NCTree.NCTreeNode switcherClass={isLeaf ? 'isleaf-style-none-tree-self-define' : 'unleaf-style-none-tree-self-define'}  title={drawTitleString(item)} key={item.key} isLeaf={children.length == 0} nodeData={item}>{loop(children, item)}</NCTree.NCTreeNode>)
                    // });

                    const loop = (datas, pdata) => {
                        return datas.filter(item => {
                            return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
                        }).map((item) => {
                            var children = item.children || [];
                            var isLeaf = !item.children.length && item.key != "root";
                            let switcherName = children.length == 0 ? 'isLeaf_hiden_point_line' : 'isLeaf_show_point_line';
                            return (<NCTree.NCTreeNode
                                liAttr={{fieldid: (item.key != 'root' && item.code && item.code.split(' ')[0]|| item.code || item.name) + "_node"}}
                                switcherClass={switcherName}
                                title={drawTitleString(item, pdata)}
                                key={item.key} isLeaf={children.length == 0}
                                nodeData={item || {}}>{children.length == 0 ? '' : loop(children, item)}
                            </NCTree.NCTreeNode>);
                        });
                    }

                    return loop([{...this.state.treeDept.root, children: this.state.treeDept.datas || []}]);
                }
            },

            card: {
                psndoc: undefined,
                editMode: 'browse'
            },

            transfer: {
                modal: {
                    show: false,
                    modalDropup: true,
                    backdrop: "static",
                    size: 'xlg',
                    fieldid: 'psndoctransfer',
                    onHide: () => {
                        this.state.transfer.onCancel();
                    }
                },
                group: {
                    value: undefined,
                    fieldid: 'psndoctransgroup',
                    onChange: (val) => {
                        var {group, org, dept} = this.state.transfer;
                        group.value = val;
                        org.value = undefined;
                        dept.value = undefined;
                        this.setState(this.state);
                    }
                },
                org: {
                    value: undefined,
                    fieldid: 'psndoctransferorg',
                    queryCondition: () => {
                        return {pk_group: this.state.transfer.group.value ? this.state.transfer.group.value.refpk : '-1'};
                    },
                    onChange: (val) => {
                        var {group, org, dept, code} = this.state.transfer;
                        org.value = val;
                        dept.value = undefined;
                        this.setState(this.state, () => {
                            ajax({
                                url: '/nccloud/uapbd/psndoc/TransferPsndocCodeAction.do',
                                data: {
                                    pk_group: group.value && group.value.refpk ? group.value.refpk : '-1',
                                    pk_org: val.refpk
                                },
                                success: (res) => {
                                    var codeval = res.data.code,
                                        editable = res.data.editable;
                                    var {group, org, dept, code, psncode} = this.state.transfer;
                                    if (codeval) {
                                        psncode.value = codeval;
                                        this.setState(this.state);
                                    }
                                }
                            });

                        });
                    }
                },
                dept: {
                    value: undefined,
                    fieldid: 'psndocdept',
                    queryCondition: () => {
                        return {
                            pk_org: this.state.transfer.org.value && this.state.transfer.org.value.refpk ? this.state.transfer.org.value.refpk : '-1',
                            pk_group: this.state.transfer.group.value && this.state.transfer.group.value.refpk ? this.state.transfer.group.value.refpk : '-1',
                        };
                    },
                    onChange: (val) => {
                        var {group, org, dept} = this.state.transfer;
                        dept.value = val;
                        this.setState(this.state);
                    }
                },
                psndoc: undefined,
                initDefValue: function () {
                    //查找子表是主任职,任职结束时间是空的记录
                    var rows = this.psndoc.body.psnjobs.rows || [],
                        recds = rows.filter(rcd => {
                            return rcd.values.ismainjob.value == true && !rcd.values.enddutydate.value
                        });
                    if (!recds || recds.length != 1) {
                        return;
                    }
                    var {group, org, dept, code, psncode, indutydate, psnclass} = this;
                    group.value = {
                        refpk: recds[0].values.pk_group.value,
                        refname: recds[0].values.pk_group.display
                    };
                    psnclass.value = {
                        refpk: recds[0].values.pk_psncl.value,
                        refname: recds[0].values.pk_psncl.display
                    }
                    code.value = this.psndoc.head.psndoc_card_head.rows[0].values.code.value;
                    psncode.value = recds[0].values.psncode.value;

                    var myDate = new Date();
                    indutydate.value = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();        //获取当前日(1-31)
                },
                rest: function (callback) {
                    var {group, org, dept, code, psncode, indutydate} = this;
                    group.value = undefined;
                    group.value = undefined;
                    group.value = undefined;
                    code.value = '';
                    psncode.value = '';
                    indutydate.value = '';
                    this.aflerSubmit = () => {
                    };
                    me.setState(me.state, () => {
                        callback && callback.call(me)
                    })
                },
                code: {
                    value: '',
                    fieldid: 'psndoctranscode',
                    onChange: (val) => {
                        var {group, org, dept, code, psncode, indutydate} = this.state.transfer;
                        code.value = val;
                        this.setState(this.state);
                    }
                },
                psncode: {
                    value: '',
                    fieldid: 'psndoctranspsncode',
                    onChange: (val) => {
                        var {group, org, dept, code, psncode, indutydate} = this.state.transfer;
                        psncode.value = val;
                        this.setState(this.state);
                    }
                },
                indutydate: {
                    value: '',
                    format: 'YYYY-MM-DD',
                    onChange: (val) => {
                        var {group, org, dept, code, psncode, indutydate} = this.state.transfer;
                        indutydate.value = val;
                        this.setState(this.state);
                    }

                },
                psnclass: {
                    value: undefined,
                    fieldid: 'psndoctranspsnclass',
                    onChange: (val) => {
                        var {group, org, dept, code, psnclass} = this.state.transfer;
                        psnclass.value = val;
                        this.setState(this.state);
                    }
                },
                onCancel: () => {
                    var transfer = this.state.transfer;
                    transfer.modal.show = false;
                    this.setState(this.state);
                },
                onSubmit: () => {
                    var {group, org, dept, indutydate, code, psncode, psnclass} = this.state.transfer,
                        values = {};
                    if (!group.value || !org.value || !dept.value) {
                        toast({content: this.lang['10140PSN-000000'], color: 'warning'}); //提示 warning  ///* 国际化处理： 所有输入项必须填写*/
                        return;
                    }

                    var handler = (dutyend) => {
                        ajax({
                            url: '/nccloud/uapbd/psndoc/AdjustPsndocAction.do',
                            data: {
                                pk_group: group.value.refpk,
                                pk_org: org.value.refpk,
                                pk_dept: dept.value.refpk,
                                code: code.value,
                                psncode: psncode.value,
                                pk_psndoc: [this.state.transfer.psndoc.head.psndoc_card_head.rows[0].values.pk_psndoc.value],
                                indutydate: indutydate.value,
                                isReserveSrcMainJob: dutyend,
                                pk_psncl: psnclass.value.refpk
                            },
                            success: (res) => {
                                toast({content: this.lang['10140PSN-000001'], color: 'success'});
                                /* 国际化处理： 调动成功*/
                                this.state.transfer.modal.show = false;
                                this.setState(this.state, () => {
                                    this.state.transfer.aflerSubmit && this.state.transfer.aflerSubmit();
                                });
                            }
                        })
                    };


                    // me.props.modal.show('modal',{
                    promptBox({
                        title: this.lang['10140PSN-000002'], /* 国际化处理： 确认信息*/
                        content: this.lang['10140PSN-000003'], /* 国际化处理： 是否确认人员调动信息?*/
                        beSureBtnClick: () => {
                            //me.props.modal.show('modal2',{
                            promptBox({
                                title: this.lang['10140PSN-000002'], /* 国际化处理： 确认信息*/
                                content: this.lang['10140PSN-000004'], /* 国际化处理：  该人员在原单位的任职是否结束?*/
                                rightBtnName: this.lang['10140PSN-000027'], //左侧按钮名称,默认关闭/* 国际化处理： 是*/
                                leftBtnName: this.lang['10140PSN-000028'], //右侧按钮名称， 默认确认/* 国际化处理： 否*/
                                beSureBtnClick: () => {
                                    handler(true);
                                },
                                cancelBtnClick: () => {
                                    handler(false);
                                }
                            });
                        }
                    });
                },
                aflerSubmit: () => {
                }
            },

            createuser: {
                modal: {
                    show: false,
                    modalDropup: true,
                    backdrop: "static",
                    size: 'lg',
                    fieldid: 'psndoccreateuser',
                    onHide: () => {
                        this.state.createuser.onCancel();
                    }
                },
                psndocs: [],
                usercode: {
                    value: 'code_psncode',
                    datas: [{
                        key: this.lang['10140PSN-100007'], /* 国际化处理： 用户编码*/
                        value: 'code_psncode'
                    }, {
                        key: this.lang['10140PSN-000042'], /* 国际化处理： 邮箱后缀*/
                        value: 'code_email'
                    }],
                    onChange: (value) => {
                        var {usercode, pwd, userGroup} = this.state.createuser;
                        usercode.value = value;
                        this.setState(this.state);
                    }
                },
                pwd: {
                    value: 'password_default',
                    datas: [{
                        key: this.lang['10140PSN-000043'], /* 国际化处理： 系统默认密码*/
                        value: 'password_default'
                    }, {
                        key: this.lang['10140PSN-000044'], /* 国际化处理： 证件号后8位,证件号后,位*/
                        value: 'password_psnid'
                    }],
                    onChange: (value) => {
                        var {usercode, pwd, userGroup} = this.state.createuser;
                        pwd.value = value;
                        this.setState(this.state);
                    }
                },
                users: {
                    columns: [
                        {title: this.lang['10140PSN-000005'], dataIndex: "psncode", width: 100}, /* 国际化处理： 人员编码*/
                        {title: this.lang['10140PSN-000006'], dataIndex: "psnname", width: 100}, /* 国际化处理： 人员姓名*/
                        {title: this.lang['10140PSN-100007'], dataIndex: "usercode", width: 100}, /* 国际化处理： 用户编码*/
                        {title: this.lang['10140PSN-000008'], dataIndex: "username", width: 100}, /* 国际化处理： 用户名称*/
                        {
                            title: this.lang['10140PSN-000009'], dataIndex: "hasUser", width: 100, render: (value) => {
                                return value ? this.lang['10140PSN-000027'] : this.lang['10140PSN-000028']
                            }
                        }/* 国际化处理： 是否关联,是,否*/
                    ],
                    datas: []
                },
                userGroup: {
                    value: undefined,
                    fieldid: 'psndoccreateusergrp',
                    isMultiSelectedEnabled: false,
                    onChange: (val) => {
                        var {usercode, pwd, userGroup} = this.state.createuser;
                        userGroup.value = val;
                        this.setState(this.state);
                    }
                },
                renderOpt: (datas) => {
                    return datas.map(data => {
                        return (<NCSelect.NCOption value={data.value}>{data.key}</NCSelect.NCOption>)
                    });
                },
                onCancel: () => {
                    var createuser = this.state.createuser;
                    createuser.modal.show = false;
                    this.setState(this.state);
                },
                onSubmit: () => {
                    var {usercode, pwd, userGroup, psndocs, users} = this.state.createuser;
                    let pk_psndocs = psndocs
                    // .filter(psndoc => {
                    //     // var hasuser = false;
                    //     // (users.data || []).forEach(u => {
                    //     //     var v = psndoc.data ? psndoc.data.values.code.value : psndoc.values.code.value;
                    //     //     if (u.psncode == v) {
                    //     //         hasuser = u.hasUser;
                    //     //     }
                    //     // })
                    //     // return !hasuser;
                    // })
                    .map(psndoc => {
                        return psndoc.data ? psndoc.data.values.pk_psndoc.value : psndoc.values.pk_psndoc.value;
                    });
                    var ugvalue = userGroup.value;
                    if (!ugvalue) {
                        toast({color: 'danger', content: this.lang['10140PSN-000046']});
                        /* 国际化处理： 请选择所属的用户组！,错误,请选择所属的用户组*/
                        return;
                    }
                    var ugisarr = Array.isArray(ugvalue);//不知道为啥测试环境ugvalue的值不是数组，在此判断一下
                    var pk_ug = ugisarr ? ugvalue[0].refpk : ugvalue.refpk;
                    ajax({
                        url: '/nccloud/uapbd/psndoc/CreateUserAction.do',
                        data: {
                            pk_psndocs: pk_psndocs,
                            pk_usergroup: pk_ug,
                            pwd: pwd.value,
                            codeway: usercode.value
                        },
                        success: (res) => {
                            toast({content: this.lang['10140PSN-000010'], color: 'success'});
                            /* 国际化处理： 用户创建成功*/
                            this.state.createuser.modal.show = false;
                            this.setState(this.state, () => {
                                this.state.createuser.aflerSubmit && this.state.createuser.aflerSubmit();

                            });
                        }
                    })
                },
                aflerSubmit: undefined
            }
        };
        return state;
    }

    initMeta(data) {
        var {template} = data,
            buttons = this.state.buttons;

        var onLinkClick = (record, index) => {
            return () => {
                this.onPsndocRowClick(record, index);
            }
        };

        template['psndoc_search'].items.forEach((item, key) => {  //添加超链接
            if (item.attrcode === 'psnjobs.pk_dept') {
                item.isShowDisabledData = true;
            }
            if (item.attrcode === 'psnjobs.pk_org') {
                item.isShowDisabledData = true;
            }
        });


        template['psndoc_list'].items.forEach((item, key) => {  //添加超链接
            //item.width = '100px';
            if (item.attrcode === 'code') {
                item.render = (text, record, index) => {
                    return (
                        <span style={{color: '#007ace', cursor: 'pointer'}} onClick={onLinkClick(record, index)}>
                            {record && record['code'] && record['code'].value}
                        </span>
                    );
                };
            }
        });
        template['psnjobs'].items.forEach((item, key) => {  //添加超链接
            if (item.attrcode == 'pk_group') { //任职集团
                // item.refcode = 'uapbd/refer/org/GroupDefaultTreeRef/index.js';
            }
            if (item.attrcode == 'pk_org') { //任职行政组织
                item.refcode = 'uapbd/refer/org/AdminOrgDefaultTreeRef/index.js';
                item.refName = '行政组织';
                item.isShowUnit = true;
                item.isShowDisabledData = false;
            }
            if (item.attrcode == 'pk_psncl') { //人员类别
                //  item.refcode = 'uapbd/refer/psninfo/PsnclTreeRef/index.js';
            }
            if (item.attrcode == 'pk_dept') { //任职部门
                //   item.refcode = 'uapbd/refer/org/DeptNCTreeRef/index.js';
                item.isShowUnit = false;
                item.queryCondition = () => {
                    return {
                        "pk_defdoclist": "1009ZZ100000000030SP"
                    }
                }
            }


            if (item.attrcode == 'worktype') { //工种
                // item.refcode = 'uapbd/refer/userdef/DefdocGridRef/index.js';
                //由于平台不支持子表内自动适配参照自定义档案，此处手动传入
                item.queryCondition = () => {
                    return {
                        "pk_defdoclist": "1009ZZ100000000030SP"
                    }
                }
            }
            if (item.attrcode == 'pk_job') { //职务
                item.refcode = 'uapbd/psninfo/psndoc/RefPsndocJobGrid/index.js';
            }
            if (item.attrcode == 'pk_post') {//岗位
                item.refcode = 'uapbd/psninfo/psndoc/RefPsndocPostGrid/index.js';
            }
        });

        template['psndoc_card_head'].items.forEach((item, key) => {  //添加超链接
            if (item.attrcode == 'idtype') {
                item.refcode = 'uapbd/refer/pub/PsnidDefaultGridRef/index.js';
            }
        });

        template['psndoc_search'].items.forEach((item, key) => {  //添加超链接
            if (item.attrcode == 'psnjobs.pk_dept') {
                item.refcode = 'uapbd/refer/org/DeptTreeRef/index.js';
                item.isShowUnit = true;
            }
        });


        var listRowBtns = buttons.filter(btn => btn.area == 'list_row').map(b => b.key);
        template['psndoc_list'].items.push({
            attrcode: 'opr',
            label: this.lang['10140PSN-000048'], /* 国际化处理： 操作*/
            itemtype: 'customer',
            width: 200,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {

                return this.props.button.createOprationButton(listRowBtns, {
                    area: 'list_row',
                    onButtonClick: (props, btncode) => {
                        this.onBtnOperation(props, btncode, 'list_row', {record, index});
                    }
                });
            }
        });


        var cardRowBtns = buttons.filter(btn => btn.area == 'card_list_row').map(b => b.key);
        template['psnjobs'].items.push({
            attrcode: 'opr',
            label: this.lang['10140PSN-000048'], /* 国际化处理： 操作*/
            itemtype: 'customer',
            width: 200,
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                var buttonAry = this.props.cardTable.getStatus('psnjobs') === 'browse' ? [''] : cardRowBtns;
                return this.props.button.createOprationButton(buttonAry, {
                    area: 'card_list_row',
                    onButtonClick: (props, btncode) => {
                        this.onBtnOperation(props, btncode, 'card_list_row', {record, index});
                    }
                });
            }
        });
    }

    onBtnOperation(prop, btncode, areacode, opt) {
        debugger;
        if (areacode == 'list_row') {
            if (btncode == 'list_rowedit') {
                let that = this;
                //判断当前数据是否在当前组织内
                if (opt.record.pk_org.value != this.state.org.value.refpk) {
                    toast({title: '人员不在当前组织内', color: 'success'});
                    /* 国际化处理： 启用成功！*/
                    return;
                }
                //添加数据权限校验
                ajax({
                    data: {pk_psndoc: opt.record.pk_psndoc.value},
                    url: '/nccloud/uapbd/psndoc/CheckPsnEditPermAction.do',
                    success: function (res) {
                        that.editPsndoc(opt.record.pk_psndoc.value);
                    }
                });
            }
            if (btncode == 'list_rowdelete') {
                //判断当前数据是否在当前组织内
                if (opt.record.pk_org.value != this.state.org.value.refpk) {
                    toast({title: '人员不在当前组织内', color: 'success'});
                    /* 国际化处理： 启用成功！*/
                    return;
                }
                this.doDeletePsndoc([opt.record.pk_psndoc.value], () => {
                    this.browseListPsndoc();
                })
                // this.deletePsndoc();
            }
        }
        if (areacode == 'card_list_bear') {
            if (btncode == 'card_listaddrow') {
                var len = this.props.cardTable.getNumberOfRows('psnjobs'),
                    psndoc = this.props.createMasterChildData(this.config.pagecode, 'psndoc_card_head', 'psnjobs');

                var recds = [];
                var rows = psndoc.body.psnjobs.rows || [],
                    recds = rows.filter(rcd => {
                        return rcd.values.ismainjob.value == true
                    });

                var psncode = {}
                if (!recds || recds.length == 0) {
                    psncode = {
                        value: '',
                        display: ''
                    }
                } else {
                    psncode = {
                        value: recds[0].values.psncode.value,
                        display: recds[0].values.psncode.display
                    }
                }


                this.props.cardTable.addRow('psnjobs', len, {
                    pk_group: psndoc.head.psndoc_card_head.rows[0].values.pk_group,
                    // pk_org:{
                    //     value:this.state.org.value.refpk,
                    //     display:  this.state.org.value.refname
                    // },
                    // pk_dept:{
                    //     value:this.state.treeDept.selectedKeys[0],
                    //     display: this.state.treeDept.selectedNode.props.nodeData.name
                    // },
                    psncode: psncode
                });
            }
        }
        if (areacode == 'card_list_row') {
            if (btncode == 'card_listdeleterow') {
                if (opt.record.values.ismainjob.value) {
                    toast({content: this.lang['10140PSN-000011'], color: "warning"});
                    /* 国际化处理： 主职数据不能删除*/
                    return;
                }
                this.props.cardTable.delRowsByIndex('psnjobs', opt.index);
            }
            // if(btncode == 'card_listinsertrow'){
            //     var insertRow = opt.index;
            //     this.props.cardTable.addRow('psnjobs',insertRow + 1,{});
            //     debugger;
            //     // let number = props.cardTable.getNumberOfRows(this.tableId1, false)
            //     // props.cardTable.addRow(this.tableId1,number,{"fixedflag":{display: null,value: false},
            //     //     "isstorebalance":{display: null,value: true},
            //     //     "ispumeasdoc":{display: null,value: false},
            //     //     "isprodmeasdoc":{display: null,value: false},
            //     //     "isstockmeasdoc":{display: null,value: false},
            //     //     "issalemeasdoc":{display: null,value: false},
            //     //     "isretailmeasdoc":{display: null,value: false},
            //     //     "ispiecemangage":{display: null,value: false},
            //     // });
            // }
        }
        if (areacode == 'card') {
            let data = this.props.createMasterChildData(this.config.pagecode, 'psndoc_card_head', 'psnjobs'),
                psndoc = data.head.psndoc_card_head.rows[0],
                pk_psndoc = psndoc.values.pk_psndoc.value;
                let psn_org= psndoc.values.pk_org.value;
            if (btncode == 'card_add') {
                this.editPsndoc(undefined);
            }
            if (btncode == 'card_edit') {
                let that = this;
                //添加数据权限校验
                ajax({
                    data: {pk_psndoc: pk_psndoc},
                    url: '/nccloud/uapbd/psndoc/CheckPsnEditPermAction.do',
                    success: function (res) {
                        that.editPsndoc(pk_psndoc);
                    }
                });
            }
            if (btncode == 'card_delete') {
                this.deletePsndoc([pk_psndoc], () => {
                    this.browseListPsndoc();
                });
            }
            if (btncode == 'card_save') {
                this.savePsndoc(() => {
                    this.updateButtonStatus();
                })
            }
            if (btncode == 'card_saveadd') {
                this.saveAddPsndoc();
            }
            if (btncode == 'card_back') {
                this.browseListPsndoc();
            }
            if (btncode == 'card_cancel') { //编辑回到card 新增回到
                promptBox({
                    title: this.lang['10140PSN-000012'], /* 国际化处理： 确认取消*/
                    content: this.lang['10140PSN-000013'], /* 国际化处理：  确认是否取消?*/
                    color: 'warning',
                    rightBtnName: this.lang['10140PSN-000028'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
                    leftBtnName: this.lang['10140PSN-000027'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
                    beSureBtnClick: () => {
                        this.props.form.setFormStatus('psndoc_card_head', 'browse');
                        this.props.cardTable.setStatus('psnjobs', 'browse');
                        this.props.cardTable.resetTableData('psnjobs');
                        setTimeout(() => {
                            this.state.showMode = pk_psndoc ? 'card' : 'list';
                            this.setState(this.state, () => {
                                if (this.state.showMode == 'card') {
                                    this.browseFormPsndoc(pk_psndoc);
                                } else {
                                    this.browseListPsndoc();
                                }
                            });
                        }, 0);

                    }
                });
                //回滚编码
                // let pkValue = this.props.form.getFormItemsValue('psndoc_card_head','pk_psndoc').value;
                // if(pkValue){
                //     return;
                // }
                let codeValue = this.props.form.getFormItemsValue('psndoc_card_head', 'code').value;
                if (!codeValue) {
                    return;
                }
                ajax({
                    url: '/nccloud/uapbd/psndoc/RollBackPsnCodAction.do',
                    data: {newBillCode: codeValue, pk_org: this.state.org.value ? this.state.org.value.refpk : ''},
                    success: (result) => {
                        if (result.success) {
                            //this.props.cardTable.resetTableData('psnjobs', callback)
                        } else {
                            alert(result.message);
                        }
                    }
                });
            }
            if (btncode == 'card_transfer') {
                this.state.transfer.rest(() => {
                    this.loadFormPsndoc(pk_psndoc, (data) => {

                        var rows = data.body.psnjobs.rows || [],
                            recds = rows.filter(rcd => {
                                return rcd.values.ismainjob.value == true;
                            });
                        // if(!recds || recds.length != 1 ){
                        //     toast({content : this.lang['10140PSN-000015'],color : 'danger'});/* 国际化处理： 没有主任职不能调动*/
                        //     return;
                        // }
                        var {group, org, dept, code, psncode, indutydate} = this;
                        if (rows[0].values.pk_psncl.value == '1002AD100000000000HU') {
                            toast({content: this.lang['10140PSN-000016'], color: 'danger'});
                            /* 国际化处理： 离职人员不能调动*/
                            return;
                        }

                        this.state.transfer.psndoc = data;
                        this.state.transfer.initDefValue();
                        this.state.transfer.modal.show = true;
                        this.state.transfer.aflerSubmit = () => {
                            this.browseFormPsndoc(pk_psndoc, () => {
                                this.updateButtonStatus();
                            });
                        };
                        this.setState(this.state);
                    });

                });
            }
            if (btncode == 'card_createuser') {
                ajax({
                    url: '/nccloud/uapbd/psndoc/ListCreateUserAction.do',
                    data: {
                        pk_psndoc: [pk_psndoc]
                    },
                    success: (res) => {
                        debugger;
                        this.state.createuser.psndocs = [psndoc];
                        this.state.createuser.users.data = res.data || [];
                        this.state.createuser.modal.show = true;
                        this.state.createuser.aflerSubmit = () => {
                            this.browseFormPsndoc(pk_psndoc, () => {
                                this.updateButtonStatus();
                            });
                        };
                        this.setState(this.state);
                    }
                });
            }
            if (btncode == 'card_enable') {
                let org_ref_pk=this.state.org.value.refpk;
                if(org_ref_pk&&psn_org&&(psn_org!=org_ref_pk)){
                    toast({title: this.lang['10140PSN-100066'], color: 'warning'});
                    return;
                }
                this.enablePsndoc([pk_psndoc], () => {
                    this.browseFormPsndoc(pk_psndoc, () => {
                        this.updateButtonStatus();
                    });
                });
            }
            if (btncode == 'card_disable') {
                let org_ref_pk=this.state.org.value.refpk;
                if(org_ref_pk&&psn_org&&(psn_org!=org_ref_pk)){
                    toast({title: this.lang['10140PSN-100065'], color: 'warning'});
                    return;
                }
                this.disablePsndoc([pk_psndoc], () => {
                    this.browseFormPsndoc(pk_psndoc, () => {
                        this.updateButtonStatus();
                    });
                });
            }
            if (btncode == 'card_print') {
                let param = {
                    funcode: '10140PSN',
                    nodekey: 'psncard',
                    oids: [pk_psndoc]
                };
                print('pdf', '/nccloud/uapbd/psndoc/PsndocPrintAction.do', param);
            }
            if (btncode == 'card_output') {
                this.setState({pks: [pk_psndoc]}, () => {
                    debugger;
                    this.printOutput.open()
                });
            }
            if (btncode == 'card_refresh') {
                let pk_psndoc = this.props.form.getFormItemsValue('psndoc_card_head', 'pk_psndoc').value;
                this.loadFormPsndoc(pk_psndoc, () => {
                    toast({title: this.lang['10140PSN-000014'], color: 'success'});
                    /* 国际化处理： 刷新成功*/
                })
            }
        }

        if (areacode == 'list') {
            var psndocs = this.props.table.getCheckedRows('psndoc_list') || [];
            var pk_psndocs = psndocs.map(psndoc => {
                return psndoc.data.values.pk_psndoc.value;
            });

            debugger;
            if (btncode == 'list_add') {
                this.editPsndoc(undefined);
            }
            if (btncode == 'list_delete') {
                this.deletePsndoc(pk_psndocs, () => {
                    this.browseListPsndoc();
                });
            }
            if (btncode == 'list_refresh') {
                let selectedKey= this.state.treeDept.selectedKeys[0];
                let selectedNode=this.state.treeDept.selectedNode;
                this.loadDept((datas) => {
                    selectedKey = selectedKey? selectedKey:(datas[0] ? datas[0].key : '-1');
                    let loadDept = {
                        first: {
                            selected: selectedKey != -1,
                            node: {
                                props: {
                                    nodeData: selectedNode? selectedNode : ( datas[0] ? datas[0].nodeData : null)
                                }
                            }
                        }
                    }
                    this.state.treeDept.onSelect([selectedKey], loadDept,()=>{
                        toast({title: this.lang['10140PSN-000014'], color: 'success'});
                        /* 国际化处理： 刷新成功*/
                    });
                    
                });
                /*this.browseListPsndoc(() => {  
                });*/
            }
            if (btncode == 'list_enable') {
                this.enablePsndoc(pk_psndocs, () => {
                    this.browseListPsndoc();
                });
            }
            if (btncode == 'list_disable') {
                this.disablePsndoc(pk_psndocs, () => {
                    this.browseListPsndoc();
                });
            }
            if (btncode == 'list_transfer') {
                this.state.transfer.rest(() => {
                    this.loadFormPsndoc(pk_psndocs[0], (data) => {

                        var rows = data.body.psnjobs.rows || [],
                            recds = rows.filter(rcd => {
                                return rcd.values.ismainjob.value == true && !rcd.values.enddutydate.value
                            });
                        // if(!recds || recds.length != 1 ){
                        //     toast({content : this.lang['10140PSN-000015'],color : 'danger'});/* 国际化处理： 主任职已到期的不能调动*/
                        //     return;
                        // }
                        // var  {group, org, dept, code, psncode, indutydate } = this;
                        // if(rows[0].values.pk_psncl.value == '1002AD100000000000HU'){
                        //     toast({content : this.lang['10140PSN-000016'],color : 'danger'});/* 国际化处理： 离职人员不能调动*/
                        //     return;
                        // }

                        this.state.transfer.psndoc = data;
                        this.state.transfer.initDefValue();
                        this.state.transfer.modal.show = true;
                        this.state.createuser.aflerSubmit = () => {
                            this.browseListPsndoc();
                            this.updateButtonStatus();
                        };
                        this.setState(this.state);
                    });

                });
            }
            if (btncode == 'list_createuser') {
                debugger;
                let psndocs = this.props.table.getCheckedRows('psndoc_list');
                var pk_psndocs = psndocs.map(psndoc => {
                    return psndoc.data.values.pk_psndoc.value;
                })
                ajax({
                    url: '/nccloud/uapbd/psndoc/ListCreateUserAction.do',
                    data: {
                        pk_psndoc: pk_psndocs
                    },
                    success: (res) => {
                        debugger;
                        this.state.createuser.psndocs = psndocs;
                        this.state.createuser.users.data = res.data || [];
                        this.state.createuser.modal.show = true;
                        this.state.createuser.aflerSubmit = () => {
                            this.browseListPsndoc();
                            this.updateButtonStatus();
                        };
                        this.setState(this.state);
                    }
                })

            }

            if (btncode == 'list_print') {
                debugger
                let allpsndocs = this.props.table.getAllTableData('psndoc_list');
                if (allpsndocs.rows.length == 0) {
                    toast({content: this.lang['10140PSN-000017'], color: 'danger'});
                    /* 国际化处理： 没有数据可以打印*/
                    return;
                }
                let checkoutdatas =this.props.table.getCheckedRows('psndoc_list');
                let checkpks =[];
                if(checkoutdatas){
                    checkoutdatas.map((item,index)=>{
                        checkpks.push(item.data.values.pk_psndoc.value);
                    })
                }
                if(checkpks.length<=0){
                    checkpks= allpsndocs.allpks; 
                }
                var tableorder = this.props.table.getSortParam("psndoc_list");
                let param = {
                    funcode: '10140PSN',
                    nodekey: 'psnlist',
                    outputType: 'print',
                    userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`,
                    oids: checkpks
                };
                print('pdf', '/nccloud/uapbd/psndoc/PsndocPrintAction.do', param);
            }
            if (btncode == 'list_output') {
                let allpsndocs = this.props.table.getAllTableData('psndoc_list');
                if (allpsndocs.rows.length == 0) {
                    toast({content: this.lang['10140PSN-000018'], color: 'warning'});
                    /* 国际化处理： 没有数据可以输出*/
                    return;
                }
                let checkoutdata_s =this.props.table.getCheckedRows('psndoc_list');
                let checkpk_s =[];
                if(checkoutdata_s){
                    checkoutdata_s.map((item,index)=>{
                        checkpk_s.push(item.data.values.pk_psndoc.value);
                    })
                }
                if(checkpk_s.length<=0){
                    checkpk_s= allpsndocs.allpks; 
                }
                
                // this.setState({
                //     pks: allpsndocs.rows.map(psndoc => {
                //         return psndoc.values.pk_psndoc.value;
                //     })
                // }, () => {
                //     debugger;
                //     this.printOutput.open()
                // });

                //zhangchik start 排序输出
                allpsndocs = this.props.table.getAllTableData('psndoc_list');
                let outorder = this.props.table.getSortParam('psndoc_list');
                output({
                    url: '/nccloud/uapbd/psndoc/PsndocPrintAction.do',
                    data: {
                        funcode: '10140PSN',      //功能节点编码，即模板编码
                        outputType: 'output',
                        nodekey: 'psnlist',
                        oids:  checkpk_s, 
                        userjson:`{order:${outorder  && outorder.sortParam[0].order},field:${outorder  && outorder.sortParam[0].field}}`
                    }
                });
                //zhangchik end
            }
            if (btncode == 'Export') {
                this.setState({}, () => {
                    this.props.modal.show('exportFileModal');
                });
            }
        }
    }

    loadDept(callback) {//加载部门树数据
        if (!this.state.org.value || !this.state.org.value.refpk) {
            //toast({content : this.lang['10140PSN-000019'],color : 'warning'}); //warning //success/* 国际化处理： 请选择行政组织*/
            return;
        }
        ajax({
            loading: true,
            url: '/nccloud/uapbd/psndoc/TreeDeptAction.do',
            data: {pkorg: this.state.org.value.refpk, showoff: this.state.showoff.checked}, //参数带上选中的行政组织
            success: (res) => {
                this.state.treeDept = {
                    ...this.state.treeDept,
                    selectedKeys: [],
                    selectedNode: undefined,
                    datas: res.data,
                    ...this.config
                };
                this.setState(this.state, () => {
                    callback && callback(res.data);
                    // this.browseListPsndoc();
                    this.updateButtonStatus();
                });
            }
        });
    }

    /**
     *
     * @param callback
     * @param isClickSearch
     * @param isSelectedNodeChange  是否选择树节点加载数据，是的话需要清空pageInfo信息
     */
    loadListPsndoc(callback, isClickSearch, isSelectedNodeChange) { //加载人员数据
        let searchVal = this.props.search.getAllSearchData('psndoc_search') || {};
        let pageInfo = this.props.table.getTablePageInfo('psndoc_list');
        if (isSelectedNodeChange)
            pageInfo = {
                pageIndex: 0,
                pageSize: 10
            }
        /*if( !this.state.org.value|| !this.state.org.value.refpk){
            toast({content : this.lang['10140PSN-000020'],color : 'warning'});/!* 国际化处理： 请选择组织*!/
            return;
        }*/
        if (this.state.treeDept.selectedKeys && this.state.treeDept.selectedKeys.length == 1 && this.state.treeDept.selectedKeys[0] == 'root') {
            callback && callback({
                areacode: 'psndoc_list',
                psndoc_list: {
                    rows: []
                }
            });
        }

        var param = {
            querycondition: searchVal,
            pagecode: this.config.pagecode,
            queryAreaCode: this.state.search.id,
            oid: this.state.search.oid,
            pk_org: this.state.org.value ? this.state.org.value.refpk : null,
            pk_dept: this.state.treeDept.selectedKeys ? this.state.treeDept.selectedKeys[0] : '-1',
            subpsn: this.state.subpsn.checked,
            showoffpsn: this.state.showoffpsn.checked,
            querytype: 'tree',
            pageInfo: pageInfo,
            appCode: this.config.appcode,
            isClickSearch: isClickSearch,
            ...this.config
            //oprtype:'and',
            //pageInfo : this.props.table.getTablePageInfo('psndoc'),  //按要求去掉分页
        };

        ajax({
            loading: true,
            data: param,
            url: '/nccloud/uapbd/psndoc/ListPsndocAction.do',
            success: function (res) {
                callback && callback(res.data);
            }
        });
    }

    loadFormPsndoc(pkpsndoc, callback) {
        ajax({
            loading: true,
            data: {
                pk_psndoc: pkpsndoc || '',
                pk_org: this.state.org.value ? this.state.org.value.refpk : '',
                pk_dept: this.state.treeDept.selectedKeys && this.state.treeDept.selectedKeys.length == 1 ? this.state.treeDept.selectedKeys[0] : undefined,
                ...this.config
            },
            url: '/nccloud/uapbd/psndoc/LoadPsndocAction.do',
            success: (res) => {
                this.state.card.psndoc = res;
                this.setState(this.state, () => {
                    callback && callback(res.data.billData, {
                        isCodeEdit: res.data.isCodeEdit,
                        isCodeMust: res.data.isCodeMust,
                        isCodeEdit2: res.data.isCodeEdit2,
                        isCodeMust2: res.data.isCodeMust2,
                        ishr: res.data.ishr,
                        isshoporg: res.data.isshoporg
                    });
                });
            }
        });
    }

    fillListPsndoc(data) {
        // data.rows.map( (e) =>{ //设置启用禁用枚举值为 true or false
        //     e.values.enablestate.value =  e.values.enablestate.value == '2' ? true : false;
        // });
        // me.props.editTable.setTableData('psndoc', data);
        if (data)
            this.props.table.setAllTableData('psndoc_list', data['psndoc_list']);
        else
            this.props.table.setAllTableData('psndoc_list', {
                areacode: 'psndoc_list',
                pageInfo: {
                    pageIndex: 0,
                    pageSize: 10,
                    total: 0,
                    totalPage: 1
                },
                rows: []
            });
    }

    fillFormPsndoc(data, callback) {
        Utils.convertGridEnablestate(data.head['psndoc_card_head'].rows);
        this.props.form.setAllFormValue({'psndoc_card_head': data.head['psndoc_card_head']});
        this.props.cardTable.setTableData('psnjobs', data.body['psnjobs'], false);
        this.props.form.resetItemWidth('psndoc');
        setTimeout(() => {
            callback && callback();
        }, 0);
    }

    onPsndocRowClick(record, index) {
        this.browseFormPsndoc(record.pk_psndoc.value);
    }

    addPsndoc() {
        this.state.showMode = 'card';
        this.state.card.editMode = 'edit';
        this.setState(this.state, () => {
            this.loadFormPsndoc(undefined, (data, codeCfg) => {
                if (codeCfg.ishr) {
                    toast({title: this.lang['10140PSN-001093'], color: 'success'});
                    /* 国际化处理： 启用HR了！*/
                    this.state.showMode = 'list';
                    this.state.card.editMode = 'browse';
                    this.setState(this.state);
                    return;
                }
                var meta = this.props.meta.getMeta();
                Utils.mergeData(data.psndoc_card_head.rows[0].values, meta.psndoc_card_head.items);

                this.fillFormPsndoc(data, () => {
                    this.editHandlerMode = 'add';
                    this.initEditMode(this.editHandlerMode, () => {
                        this.editHandlerMode != 'simpleedit' && this.props.form.setFormItemsDisabled('psndoc_card_head', {code: codeCfg.isCodeEdit});//编码规则控制是否可编辑
                        var meta = this.props.meta.getMeta();
                        meta['psndoc_card_head'].items.map((obj) => {
                            if (obj.attrcode === 'code') {
                                obj.required = codeCfg.isCodeMust ? 'Y' : 'N';
                            }
                        });
                        debugger;
                        this.props.meta.setMeta(meta);
                        setTimeout(() => {
                            this.props.form.setFormStatus('psndoc_card_head', 'edit');
                            this.props.cardTable.setStatus('psnjobs', 'edit');
                            //设置是否是兼职编辑模式
                            this.editHandlerMode = 'add';
                            this.updateButtonStatus()
                        }, 0);
                    });
                });
            });
        });
    }

    editPsndoc(pkpsndoc) {
        if (!pkpsndoc) {
            // let isVirtual = this.state.treeDept.selectedNode && this.state.treeDept.selectedNode.props.nodeData.nodeData.depttype == '1';
            // if(isVirtual){
            //     toast({color:'danger',content:this.lang['10140PSN-001090']});
            //     return;
            // }
        }

        //调整原有先setState后加载数据顺序，先加载数据 校验是否已启用HR
        this.loadFormPsndoc(pkpsndoc, (data, codeCfg) => {
            if (codeCfg.ishr) {
                toast({title: this.lang['10140PSN-001093'], color: 'success'});
                /* 国际化处理： 启用HR了！*/
                return;
            }
            if (codeCfg.moreJobsInOtherOrg) {
                toast({title: '人员的兼职信息不能在兼职的组织中维护', color: 'success'});
                /* 国际化处理： 启用HR了！*/
                return;
            }
            this.state.showMode = 'card';
            this.state.card.editMode = 'edit';
            //设置启用状态为123;//
            this.setState(this.state, () => {
                this.props.form.setFormStatus('psndoc_card_head', pkpsndoc ? 'edit' : 'add');

                //判定是否兼职编辑模式,判断当前人员组织与所在组织是否一致
                this.editHandlerMode = data.head.psndoc_card_head.rows[0].values.pk_org.value == this.state.org.value.refpk ? 'edit' : 'simpleedit';
                this.initEditMode(this.editHandlerMode, () => {
                    setTimeout(() => {
                        this.editHandlerMode != 'simpleedit' && this.props.form.setFormItemsDisabled('psndoc_card_head', {
                            code: !codeCfg.isCodeEdit,
                            isshopassist: !codeCfg.isshoporg
                        });//编码规则控制是否可编辑
                        setTimeout(() => {
                            var meta = this.props.meta.getMeta();
                            meta['psndoc_card_head'].items.map((obj) => {
                                if (obj.attrcode === 'code') {
                                    obj.required = codeCfg.isCodeMust;
                                }
                            });
                            meta['psnjobs'].items.map((obj) => {
                                if (obj.attrcode === 'psncode') {
                                    obj.required = codeCfg.isCodeMust2;
                                }
                            });


                            this.props.meta.setMeta(meta, () => {
                                this.props.cardTable.setStatus('psnjobs', 'edit');
                                Utils.convertGridEnablestate(data.head.psndoc_card_head.rows);
                                if(!pkpsndoc){
                                    var meta = this.props.meta.getMeta();
                                    Utils.mergeData(data.head.psndoc_card_head.rows[0].values, meta.psndoc_card_head.items);
                    
                                }
                            
                                this.fillFormPsndoc(data);
                                this.updateButtonStatus()
                            });
                        }, 0);

                    }, 0);
                });


            });
        });
    }

    initEditMode(mode = 'simpleedit', callback) {
        var meta = this.props.meta.getMeta();
        var disableCfg = {};
        meta['psndoc_card_head'].items.map((obj) => {
            disableCfg[obj.attrcode] = obj.disabled ? obj.disabled : (mode == 'simpleedit' ? true : false);
            if ('enablestate' == obj.attrcode) {
                disableCfg[obj.attrcode] = true;
            }
        });
        this.props.form.setFormItemsDisabled('psndoc_card_head', disableCfg);
        setTimeout(() => {
            callback && callback();
        }, 0);
    }

    browseFormPsndoc(pkpsndoc, callback) {
        this.state.showMode = 'card';
        this.state.card.editMode = 'browse';
        this.setState(this.state, () => {
            this.loadFormPsndoc(pkpsndoc, (data) => {
                this.fillFormPsndoc(data, () => {
                    this.updateButtonStatus()
                    this.setState(this.state, () => {
                        callback && callback();
                    });
                });
            });
        });
    }

    browseListPsndoc(callback, isClickSearch) {
        this.state.showMode = 'list';
        this.state.card.editMode = 'browse';
        this.setState(this.state, () => {
            this.loadListPsndoc(data => {
                this.fillListPsndoc(data);
                this.updateButtonStatus();
                setTimeout(() => {
                    callback && callback(data);
                }, 0);
            }, isClickSearch);
        });
    }

    pageInfoClick(props, config, pks) {
        setTimeout(() => {
            this.browseListPsndoc();
        }, 0);
    }


    enablePsndoc(pk_psndocs, callback) {
        var handler = () => {
            ajax({
                url: '/nccloud/uapbd/psndoc/EnablePsndocAction.do',
                data: {pk_psndocs: pk_psndocs},
                success: (res) => {
                    toast({title: this.lang['10140PSN-000021'], color: 'success'});
                    /* 国际化处理： 启用成功！*/
                    callback && callback();
                }
            });
        }

        // this.props.modal.show('modal',{
        promptBox({
            title: this.lang['10140PSN-000022'], /* 国际化处理： 确认启用*/
            content: this.lang['10140PSN-000023'], /* 国际化处理： 是否确认要启用?*/
            beSureBtnClick: handler
        });
    }

    disablePsndoc(pk_psndocs, callback) {
        var handler2 = (isjudge = false, endduty = false) => {
            ajax({
                url: '/nccloud/uapbd/psndoc/DisablePsndocAction.do',
                data: {pk_psndocs: pk_psndocs, isjudge: isjudge, endduty: endduty},
                success: (res) => {
                    if (res.data) {
                        toast({title: this.lang['10140PSN-000024'], color: 'success'});
                        /* 国际化处理： 停用成功！*/
                        callback && callback();
                    } else {
                        handler();
                    }
                }
            });
        };

        var handerWapper = (bool, bool2) => {
            return () => {
                handler2(bool, bool2);
            }
        };

        var handler = () => {
            promptBox({
                //this.props.modal.show('modal',{
                title: this.lang['10140PSN-100008'], /* 国际化处理： 确认停用*/
                content: this.lang['10140PSN-000026'], /* 国际化处理： 是否结束任职?*/
                beSureBtnName: this.lang['10140PSN-000027'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 是*/
                cancelBtnName: this.lang['10140PSN-000028'],         // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 否*/
                beSureBtnClick: handerWapper(true, true),
                cancelBtnClick: handerWapper(true, false)
            });
        };

        promptBox({
            //this.props.modal.show('modal',{
            title: this.lang['10140PSN-000025'], /* 国际化处理： 确认停用*/
            content: this.lang['10140PSN-000029'], /* 国际化处理： 是否确认要停用?*/
            beSureBtnClick: handler2
        });
    }

    savePsndoc(callback, checked = true) {
        var me = this;
        this.props.cardTable.filterEmptyRows('psnjobs');
        let psndoc = this.props.createMasterChildData(this.config.pagecode, 'psndoc_card_head', 'psnjobs');

        // Utils.convertGridEnablestate(psndoc.head.psndoc_card_head.rows);
        if (!this.props.form.isCheckNow('psndoc_card_head')) return;
        if (!this.props.cardTable.checkTableRequired('psnjobs')) return;

        var atferHandler = (pkpsndoc) => {
            toast({title: this.lang['10140PSN-000030'], color: 'success'});
            /* 国际化处理： 保存成功！*/
            this.props.form.setFormStatus('psndoc_card_head', 'browse');
            this.props.cardTable.setStatus('psnjobs', 'browse');
            this.browseFormPsndoc(pkpsndoc, () => {
                callback && callback();
            });
        };

        var hander = () => {
            this.props.validateToSave(psndoc, () => {
                ajax({
                    url: '/nccloud/uapbd/psndoc/SavePsndocAction.do',
                    data: {
                        ...psndoc,
                        checked: checked
                    },
                    success: (res) => {
                        if (res.data.success) {
                            atferHandler(res.data.psndata.pk_psndoc);
                        } else {
                            //提示+重新提交
                            promptBox({
                                color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: this.lang['10140PSN-100063'] || '提示', /* 国际化处理： 删除提醒*/
                                // content:'确定要删除数据吗？',
                                content: this.lang['10140PSN-100064'] + (res.data.errorinfo || ''), /* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？,删除基础数据要做业务引用检查,非常耗时,建议使用封存功能,是否继续*/
                                beSureBtnClick: () => {
                                    this.savePsndoc(callback, false)
                                }
                            });
                        }

                    }
                });
            }, {
                psndoc_card_head: 'form',
                ['psnjobs']: 'cardTable'
            }, 'card');
        };


        //check cardno
        var idtype = psndoc.head.psndoc_card_head.rows[0].values.idtype;
        var cardno = psndoc.head.psndoc_card_head.rows[0].values.id;

        if (idtype && idtype.value && idtype.value == '1001Z01000000000AI36') {
            var checkCardLength = (callback) => {
                if (cardno && cardno.value && cardno.value.length != 15 && cardno.value.length != 18) {
                    promptBox({
                        title: this.lang['10140PSN-000002'], /* 国际化处理： 确认信息*/
                        content: this.lang['10140PSN-000031'], /* 国际化处理：  输入的身份证号不是15位或18位,是否保存?*/
                        rightBtnName: this.lang['10140PSN-000028'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
                        leftBtnName: this.lang['10140PSN-000027'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
                        beSureBtnClick: () => {
                            callback && callback();
                        }
                    });
                    return;
                } else {
                    callback && callback();
                }
            };

            var checkCardBrithdate = (callback) => {
                if (cardno && cardno.value) {
                    var brithdate = psndoc.head.psndoc_card_head.rows[0].values.birthdate.value || '';
                    var carddate = cardno.value.substring(6, 14);
                    carddate = carddate.substring(0, 4) + '-' + carddate.substring(4, 6) + '-' + carddate.substring(6, 8);
                    if (brithdate !== carddate) {
                        promptBox({
                            title: this.lang['10140PSN-000002'], /* 国际化处理： 确认信息*/
                            content: this.lang['10140PSN-000032'], /* 国际化处理：  输入的身份证号的出生日期和填写的出生日期不一致,是否保存?*/
                            rightBtnName: this.lang['10140PSN-000028'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
                            leftBtnName: this.lang['10140PSN-000027'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
                            beSureBtnClick: () => {
                                callback && callback();
                            }
                        });
                        return;
                    }
                    callback && callback();
                }
                callback && callback();
            }
            checkCardLength(() => {
                checkCardBrithdate(() => {
                    hander();
                });
            });
            return;
        }
        if (idtype && idtype.value && idtype.value == '1001Z01000000000CHUK') {
            if (cardno && cardno.value && cardno.value.length != 10 && cardno.value.length != 11) {
                // me.props.modal.show('modal',{
                promptBox({
                    title: this.lang['10140PSN-000002'], /* 国际化处理： 确认信息*/
                    content: this.lang['10140PSN-000033'], /* 国际化处理：  输入的香港居民身份证号不是10位或11位,是否保存?*/
                    rightBtnName: this.lang['10140PSN-000028'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
                    leftBtnName: this.lang['10140PSN-000027'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
                    beSureBtnClick: hander
                });
                return;
            }
        }
        if (idtype && idtype.value && idtype.value == '1001Z01000000000CHUM') {
            if (cardno && cardno.value && cardno.value.length != 10) {
                // me.props.modal.show('modal',{
                promptBox({
                    title: this.lang['10140PSN-000002'], /* 国际化处理： 确认信息*/
                    content: this.lang['10140PSN-000034'], /* 国际化处理：  输入的台湾居民身份证号不是10位,是否保存?*/
                    rightBtnName: this.lang['10140PSN-000028'], //左侧按钮名称,默认关闭/* 国际化处理： 否*/
                    leftBtnName: this.lang['10140PSN-000027'], //右侧按钮名称， 默认确认/* 国际化处理： 是*/
                    beSureBtnClick: hander
                });
                return;
            }
        }

        hander();
    }

    saveAddPsndoc() {
        this.savePsndoc(() => {
            this.editPsndoc();
        });
    }


    doDeletePsndoc(pkpsndocs, callback) {
        ajax({
            loading: true,
            data: {
                pk_psndoc: pkpsndocs || [],
            },
            url: '/nccloud/uapbd/psndoc/DeletePsndocAction.do',
            success: (res) => {
                toast({title: this.lang['10140PSN-000035'], color: 'success'});
                /* 国际化处理： 删除成功！*/
                callback && callback();
            }
        });
    }

    deletePsndoc(pkpsndocs, callback) {
        // var handler = () =>{
        //     ajax({
        //         loading: true,
        //         data: {
        //             pk_psndoc: pkpsndocs || [],
        //         },
        //         url: '/nccloud/uapbd/psndoc/DeletePsndocAction.do',
        //         success: function (res) {
        //             toast({content : "删除成功",color : 'success'});
        //             callback && callback();
        //         }
        //     });
        // };
        promptBox({
            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.lang['10140PSN-000063'], /* 国际化处理： 删除提醒*/
            // content:'确定要删除数据吗？',
            content: this.lang['10140PSN-000064'], /* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续？,删除基础数据要做业务引用检查,非常耗时,建议使用封存功能,是否继续*/
            beSureBtnClick: () => {
                this.doDeletePsndoc(pkpsndocs, () => {
                    callback && callback();
                })
            }
        });

        // this.props.modal.show('modal',{
        //     title: "确认删除",
        //     content: "是否确认要删除?",
        //     beSureBtnClick: () =>{
        //         doDeletePsndoc(pkpsndocs, () =>{
        //             callback && callback();
        //         })
        //     }
        // });
    }

    //更新按钮状态
    updateButtonStatus() {
        var showMode = this.state.showMode,
            editMode = this.state.card.editMode,
            isorg = this.state.org.value && this.state.org.value.refpk,
            isdept = this.state.treeDept.selectedKeys && this.state.treeDept.selectedKeys.length == 1 && this.state.treeDept.selectedKeys[0] != 'root',
            rows = showMode == 'list' ? this.props.table.getCheckedRows('psndoc_list') : [];

        //为了可有可无的功能，只能加一堆破烂代码
        //破烂开始
        var isOnlyRow = rows.length == 1;
        var curOrg = undefined;
        debugger;
        if (isOnlyRow) {
            curOrg = rows[0].data.values.pk_org.value;
        }

        var haspk_psndoc = undefined;

        if (editMode == 'edit') {
            var psndoc = this.props.createMasterChildData(this.config.pagecode, 'psndoc_card_head', 'psnjobs');
            haspk_psndoc = psndoc.head.psndoc_card_head.rows[0].values.pk_psndoc.value && psndoc.head.psndoc_card_head.rows[0].values.pk_psndoc.value != '';
            haspsndoc_enable = psndoc.head.psndoc_card_head.rows[0].values.enablestate.value;
        }
        var deptuse = false;
        if (isdept) {
            deptuse = this.state.treeDept.selectedNode.props && this.state.treeDept.selectedNode.props.nodeData.use != '3';
        }

        var cardstatePsnInCurOrg = false;
        var haspsndoc_enable = false;
        if (editMode == 'browse') {
            var psndoc = this.props.createMasterChildData(this.config.pagecode, 'psndoc_card_head', 'psnjobs');
            cardstatePsnInCurOrg = this.state.org.value && this.state.org.value.refpk && psndoc.head.psndoc_card_head.rows[0].values.pk_org.value == this.state.org.value.refpk;
            haspsndoc_enable = psndoc.head.psndoc_card_head.rows[0].values.enablestate.value;
        }

        //破烂结束

        this.props.button.setDisabled({
            list_add: !(showMode == 'list' && isorg && isdept && deptuse),
            list_delete: !(showMode == 'list' && isorg && (rows.length > 1 || (rows.length == 1 && curOrg && curOrg == this.state.org.value.refpk))),
            list_refresh: showMode != 'list',
            list_createuser: !(showMode == 'list' && isorg && rows.length >= 1),
            list_transfer: !(showMode == 'list' && isorg && rows.length == 1 && curOrg == this.state.org.value.refpk),
            list_enable: !(showMode == 'list' && isorg && (rows.length > 1 || (rows.length == 1 && rows[0].data.values.enablestate.value != '2' && curOrg == this.state.org.value.refpk))),
            list_disable: !(showMode == 'list' && isorg && (rows.length > 1 || (rows.length == 1 && rows[0].data.values.enablestate.value == '2' && curOrg == this.state.org.value.refpk))),
            // list_print: !(showMode == 'list' && isorg && rows.length > 0),
            // list_output: !(showMode == 'list' && isorg && rows.length > 0),
            card_add: !(showMode == 'card' && isorg && editMode == 'browse'),
            card_edit: !(showMode == 'card' && isorg && editMode == 'browse'),
            card_delete: !(showMode == 'card' && isorg && editMode == 'browse' && cardstatePsnInCurOrg),
            card_back: !(showMode == 'card' && isorg && editMode == 'browse'),
            card_save: !(showMode == 'card' && isorg && editMode == 'edit'),
            card_saveadd: !(showMode == 'card' && isorg && editMode == 'edit'),

            card_transfer: !(showMode == 'card' && isorg && editMode == 'browse' && cardstatePsnInCurOrg),
            card_createuser: !(showMode == 'card' && isorg && editMode == 'browse'),

            card_listaddrow: !(showMode == 'card' && isorg && editMode == 'edit'),
            card_listdeleterow: !(showMode == 'card' && isorg && editMode == 'edit'),
            card_cancel: !(showMode == 'card' && isorg && editMode == 'edit'),
            card_enable: !(showMode == 'card' && isorg && editMode == 'browse' && !haspsndoc_enable),
            card_disable: !(showMode == 'card' && isorg && editMode == 'browse' && haspsndoc_enable)

        });

        this.props.button.setButtonsVisible({
            list_add: showMode == 'list',
            list_delete: showMode == 'list',
            list_refresh: showMode == 'list',
            list_output: showMode == 'list',
            list_print: showMode == 'list' ,
            list_output: showMode == 'list',
            card_add: showMode == 'card' && editMode == 'browse',
            card_edit: showMode == 'card' && editMode == 'browse',
            card_delete: showMode == 'card' && editMode == 'browse',
            card_back: showMode == 'card' && editMode == 'browse',
            card_transfer: showMode == 'card' && editMode == 'browse',
            card_createuser: showMode == 'card' && editMode == 'browse',
            card_more_group: showMode == 'card' && editMode == 'browse',

            card_save: showMode == 'card' && editMode == 'edit',
            card_saveadd: showMode == 'card' && editMode == 'edit' && !haspk_psndoc,
            card_cancel: showMode == 'card' && editMode == 'edit',
            card_listaddrow: showMode == 'card' && editMode == 'edit',
            card_listdeleterow: showMode == 'card' && editMode == 'edit',

        });
    }

    render() {
        if (!this.lang)
            return '';
        let {button, search, DragWidthCom, modal, table, form, cardTable, BillHeadInfo} = this.props;
        let {createButtonApp} = button;
        let {NCCreateSearch} = search;
        let {createSimpleTable} = table;
        let {createModal} = modal;
        let {createForm} = form;
        let {createCardTable} = cardTable;
        let {createBillHeadInfo} = BillHeadInfo;

        //获取列表肩部信息
        var initTableButton = () => {
            return (
                <div className="shoulder-definition-area">
                    <div className="definition-icons">
                        {createButtonApp({
                            area: 'card_list_bear',
                            buttonLimit: 3,
                            onButtonClick: (props, btncode) => {
                                this.onBtnOperation(props, btncode, 'card_list_bear');
                            },
                            popContainer: document.querySelector('.card-childer-button')
                        })}
                        {this.props.cardTable.createBrowseIcons('psnjobs', {
                            iconArr: ['close', 'open', 'max', 'setCol'],
                            maxDestAreaId: 'nc-bill-card'
                        })}
                    </div>
                </div>
            )
        };

        var transferpsndoc = this.state.transfer.psndoc;

        var searchRender = {
            ...this.state.treesearch,
            value: this.state.treesearch.valueTemp
        };
        var renderList = () => {
            if (this.state.showMode != 'list')
                return '';
            return (
                <div className='nc-bill-tree-table' style={{height: '100%'}}>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="header">
                        <div className="header-title-search-area">{createBillHeadInfo({
                            title: this.lang['10140PSN-000068'],
                            initShowBackBtn: false
                        })}</div>
                        <div className="search-box" style={{width: 200, marginRight: 0}}>{Org(this.state.org)}</div>
                        <span
                            className="showOff"><NCCheckbox {...this.state.showoff}>{this.lang['10140PSN-000069']/* 国际化处理： 显示停用部门*/}</NCCheckbox></span>
                        <span
                            className="showOff"><NCCheckbox {...this.state.subpsn}>{this.lang['10140PSN-000070']/* 国际化处理： 包含下级部门人员*/}</NCCheckbox></span>
                        <span
                            className="showOff"><NCCheckbox {...this.state.showoffpsn}>{this.lang['10140PSN-000071']/* 国际化处理： 显示停用人员*/}</NCCheckbox></span>
                        <div className=" btn-group btn-list">
                            {createButtonApp({
                                area: 'list',//按钮注册中的按钮区域
                                buttonLimit: 3,
                                onButtonClick: (props, btncode) => {
                                    this.onBtnOperation(props, btncode, 'list');
                                },
                                popContainer: document.querySelector('.list-base')
                            })}
                        </div>
                    </NCDiv>
                    <div
                        className="search-area search-list">{NCCreateSearch(this.state.search.id, this.state.search)}</div>
                    <div className="tree-table" style={{height: 'calc(100% - 109px)'}}>
                        <DragWidthCom
                            defLeftWid='20%'  // 默认左侧区域宽度，px/百分百
                            leftMinWid='280px'
                            leftDom={
                                <div className="tree-area syncTreeCom">
                                    <NCDiv fieldid='psndocdept' areaCode={NCDiv.config.TREE}
                                           class="syncTreeCom syncTreeComLineStyle" id="accSchemeTree">
                                        <div
                                            className="NC_syncTreeSearch NC_syncTreeSearch_hover NC_syncTreeSearch_self_width">
                                            <NCFormControl {...searchRender}/>
                                        </div>
                                        <NCDiv fieldid= 'dept' areaCode={NCDiv.config.TreeCom} className="synctree-area">
                                            <NCTree {...this.state.treeDept}>{this.state.treeDept.renderNode()}</NCTree>
                                        </NCDiv>
                                    </NCDiv>
                                </div>
                            }
                            rightDom={
                                <div className="nc-singleTable-table-area nc-singleTable-table-area-style">
                                    {createSimpleTable('psndoc_list', {

                                        tableModelConfirm: () => {
                                        },
                                        onAfterEvent: () => {
                                        },
                                        onSelected: () => {
                                            this.updateButtonStatus();
                                        },
                                        onSelectedAll: () => {
                                            this.updateButtonStatus();
                                        },
                                        onRowDoubleClick: (record, index) => {
                                            this.browseFormPsndoc(record.pk_psndoc.value);
                                        },
                                        handlePageInfoChange: this.pageInfoClick.bind(this),
                                        showCheck: true
                                    })}</div>}     //右侧区域dom
                        />
                    </div>
                </div>
            );
        };

        var renderCard = () => {
            if (this.state.showMode != 'card')
                return '';

            let browseStatus =  !(this.state.card.editMode == 'edit');
            return (
                <div className="nc-bill-card">
                    <div className="nc-bill-top-area">
                        <NCAffix>
                            <NCDiv areaCode={NCDiv.config.HEADER}  className='nc-bill-header-area'>
                                {/* <div className='header-title-search-area'> */}
                                <div className="header-title-search-area">
                                    {/* {this.state.card.editMode == 'edit' ? '' :
                                        <NCBackBtn className='title-search-detail' style={{marginRight: 0}}
                                                   onClick={this.onBtnOperation.bind(this, this.props, 'card_back', 'card')}></NCBackBtn>} */}
                                    {createBillHeadInfo({
                                        title: this.lang['10140PSN-000068'],
                                        backBtnClick: this.onBtnOperation.bind(this, this.props, 'card_back', 'card'),
                                        showBackBtn:browseStatus,
                                        initShowBackBtn:browseStatus
                                    })}
                                </div>
                                {/* </div> */}
                                <div className="header-button-area">
                                    {createButtonApp({
                                        area: 'card',//按钮注册中的按钮区域
                                        onButtonClick: (props, btncode) => {
                                            this.onBtnOperation(props, btncode, 'card');
                                        },
                                        popContainer: document.querySelector('.list-base')
                                    })}
                                </div>
                            </NCDiv>
                        </NCAffix>
                        <div className="nc-bill-form-area edit-input-list">
                            {createForm('psndoc_card_head', {
                                onAfterEvent: this.onPsndocAfterEvent.bind(this)
                            })}
                        </div>
                    </div>
                    <div className="nc-bill-bottom-area">
                        <div className="nc-bill-table-area tabs-add">
                            {createCardTable('psnjobs', {
                                tableHead: initTableButton,
                                onAfterEvent: this.onPsnjobAfterEdit.bind(this),
                                onBeforeEvent: this.onPsnjobBeforeEdit.bind(this)
                                // modelSave:this.modelSave.bind(this),
                                // showIndex:true,
                                // showCheck:true
                            })}
                        </div>
                    </div>
                </div>
            );

        };


        return (
            <div>
                {createModal('modal', {noFooter: false})}
                {createModal('modal2', {noFooter: false})}
                <NCModal {...this.state.transfer.modal} fieldid={'psndoctransfer'}>
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{this.lang['10140PSN-000072']/* 国际化处理： 人员调动*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>{this.lang['10140PSN-000073']/* 国际化处理： 原集团:,原集团*/}</div>
                            <div className='modal-input'><NCInput fieldid={'psndocgroupdisplay'}
                                                                  value={transferpsndoc ? transferpsndoc.head.psndoc_card_head.rows[0].values.pk_group.display : ''}/>
                            </div>
                        </div>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>{this.lang['10140PSN-000074']/* 国际化处理： 原业务单元:,原业务单元*/}</div>
                            <div className='modal-input'><NCInput fieldid={'psndocorgdisplay'}
                                                                  value={transferpsndoc ? transferpsndoc.head.psndoc_card_head.rows[0].values.pk_org.display : ''}/>
                            </div>
                        </div>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>{this.lang['10140PSN-000075']/* 国际化处理： 原人员编码:,原人员编码*/}</div>
                            <div className='modal-input'><NCInput fieldid={'psndoccode'}
                                                                  value={transferpsndoc ? transferpsndoc.head.psndoc_card_head.rows[0].values.code.value : ''}/>
                            </div>
                        </div>
                        <div className='br'></div>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>*{this.lang['10140PSN-000076']/* 国际化处理： 调入集团:,调入集团*/}</div>
                            <div className='modal-input'>{Group(this.state.transfer.group)}</div>
                        </div>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>*{this.lang['10140PSN-000077']/* 国际化处理： 调入业务单元:,调入业务单元*/}</div>
                            <div className='modal-input'>{Org(this.state.transfer.org)}</div>
                        </div>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>*{this.lang['10140PSN-000005']/* 国际化处理： 人员编码:,人员编码*/}</div>
                            <div className='modal-input'><NCFormControl {...this.state.transfer.code} /></div>
                        </div>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>*{this.lang['10140PSN-000078']/* 国际化处理： 调入部门:,调入部门*/}</div>
                            <div className='modal-input'>{Dept(this.state.transfer.dept)}</div>
                        </div>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>*{this.lang['10140PSN-000079']/* 国际化处理： 员工编号:,员工编号*/}</div>
                            <div className='modal-input'><NCFormControl {...this.state.transfer.psncode} /></div>
                        </div>
                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>*{this.lang['10140PSN-000080']/* 国际化处理： 人员类别:,人员类别*/}</div>
                            <div className='modal-input'>{Psnclass(this.state.transfer.psnclass)}</div>
                        </div>

                        <div className='modal-item'>
                            <div className='modal-name nc-theme-common-font-c'>*{this.lang['10140PSN-000081']/* 国际化处理： 任职时间:,任职时间*/}</div>
                            <div className='modal-input'><NCDatePicker {...this.state.transfer.indutydate}
                                                                       fieldid={'psndocdatepicker'}
                                                                       disabled={!(this.state.transfer.dept.value && this.state.transfer.dept.value.refpk)}/>
                            </div>
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <span><NCButton fieldid={`transfersure`}
                                        style={{background: '#e14c46', color: '#fff'}}
                                        onClick={this.state.transfer.onSubmit}>{this.lang['10140PSN-000082']/* 国际化处理： 确定*/}</NCButton></span>
                        <span><NCButton fieldid={`transfercancel`}
                                        onClick={this.state.transfer.onCancel}>{this.lang['10140PSN-000083']/* 国际化处理： 取消*/}</NCButton></span>
                    </NCModal.Footer>
                </NCModal>

                <NCModal {...this.state.createuser.modal} className='generating-user-modal' fieldid={'generatepsndoc'}>
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{this.lang['10140PSN-000084']/* 国际化处理： 生成用户*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            marginBottom: 10,
                            borderBottom: '1px solid #ccc',
                            paddingBottom: 10
                        }}>
                            <div>
                                <div style={{
                                    display: 'inline-block',
                                    marginRight: 3
                                }}>{this.lang['10140PSN-000085']/* 国际化处理： 所属用户组:,所属用户组*/}</div>
                                <div className='modal-input' style={{
                                    display: 'inline-block',
                                    width: 200
                                }}>{userGroup(this.state.createuser.userGroup)}</div>
                            </div>
                            <div style={{visibility: 'hidden'}}>
                                <div style={{
                                    display: 'inline-block',
                                    marginRight: 13
                                }}>{this.lang['10140PSN-000007']/* 国际化处理： 用户编码:,用户编码*/}</div>
                                <div style={{display: 'inline-block', width: 200}}>
                                    <NCSelect
                                        fieldid={'psndocusercode'} {...this.state.createuser.usercode}>{this.state.createuser.renderOpt(this.state.createuser.usercode.datas)}</NCSelect>
                                </div>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 10, marginBottom: 10}}>
                            <div>
                                <div style={{
                                    display: 'inline-block',
                                    marginRight: 13
                                }}>{this.lang['10140PSN-000007']/* 国际化处理： 用户编码:,用户编码*/}</div>
                                <div style={{display: 'inline-block', width: 200}}>
                                    <NCSelect
                                        fieldid={'psndocusercode'} {...this.state.createuser.usercode}>{this.state.createuser.renderOpt(this.state.createuser.usercode.datas)}</NCSelect>
                                </div>
                            </div>
                            <div>
                                <div style={{
                                    display: 'inline-block',
                                    marginRight: 3
                                }}>{this.lang['10140PSN-000086']/* 国际化处理： 用户密码:,用户密码*/}</div>
                                <div style={{display: 'inline-block', width: 200}}>
                                    <NCSelect
                                        fieldid={'psndocuserpwd'} {...this.state.createuser.pwd}>{this.state.createuser.renderOpt(this.state.createuser.pwd.datas)}</NCSelect>
                                </div>
                            </div>
                        </div>
                        <NCTable {...this.state.createuser.users}></NCTable>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <span><NCButton fieldid={`createusersure`}
                                        style={{background: '#e14c46', color: '#fff'}}
                                        onClick={this.state.createuser.onSubmit}>{this.lang['10140PSN-000082']/* 国际化处理： 确定*/}</NCButton></span>
                        <span><NCButton fieldid={`createusercancel`}
                                        onClick={this.state.createuser.onCancel}>{this.lang['10140PSN-000083']/* 国际化处理： 取消*/}</NCButton></span>
                    </NCModal.Footer>
                </NCModal>

                {renderCard()}
                {renderList()}


                {createModal('tip')}

                <PrintOutput
                    ref={(item) => {
                        this.printOutput = item
                    }}
                    url={'/nccloud/uapbd/psndoc/PsndocPrintAction.do'}
                    data={{
                        funcode: '10140PSN',
                        nodekey: 'psncard',
                        outputType: "output",
                        oids: this.state.pks,
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
                <ExcelImport
                    {...Object.assign(this.props)}
                    moduleName='uapbd'//模块名
                    billType={'psndoc'}//单据类型
                    selectedPKS={[]}
                    appcode={'10140PSN'}
                    pagecode={'10140PSN_main'}
                />
            </div>
        )
    }

    setPsnjoRefbNull(itemcodes = [], rowid) {
        itemcodes.forEach(itemcode => {
            this.props.cardTable.setValByKeyAndRowId('psnjobs', rowid, itemcode, {value: '', display: ''});
        });
    }

    onPsndocAfterEvent(props, areacode, attrname, value, hisvalues, index, rowRecord) {

    }

    onPsnjobAfterEdit(props, areacode, attrname, value, hisvalues, index, rowRecord) {
        if (hisvalues[0].newvalue.value == hisvalues[0].oldvalue.value) {
            return;
        }

        if (attrname == 'pk_group') {
            this.setPsnjoRefbNull(['pk_org', 'pk_dept', 'pk_job', 'pk_post', 'pk_job.pk_jobtype', 'pk_post.pk_postseries'], hisvalues[0].rowid);
        }

        if (attrname == 'pk_org') { //重置组织
            this.setPsnjoRefbNull(['pk_dept', 'pk_job', 'pk_post', 'pk_job.pk_jobtype', 'pk_post.pk_postseries'], hisvalues[0].rowid);
        }
        if (attrname == 'pk_dept') { //重置部门
            this.setPsnjoRefbNull(['pk_job', 'pk_post', 'pk_job.pk_jobtype', 'pk_post.pk_postseries'], hisvalues[0].rowid);
        }
        if (attrname == 'pk_job') { //职务
            if (value.refpk) {
                this.props.cardTable.setValByKeyAndRowId('psnjobs', hisvalues[0].rowid, 'pk_job.pk_jobtype', {
                    value: value.values.pk_jobtype.value,
                    display: value.values.jobtypename.value
                });
            } else {
                this.setPsnjoRefbNull(['pk_job.pk_jobtype'], hisvalues[0].rowid);
            }
            this.setPsnjoRefbNull(['pk_post', 'pk_post.pk_postseries'], hisvalues[0].rowid);
        }
        if (attrname == 'pk_post') { //岗位
            if (value.refpk) {
                this.props.cardTable.setValByKeyAndRowId('psnjobs', hisvalues[0].rowid, 'pk_post.pk_postseries', {
                    value: value.values.pk_postseries.value,
                    display: value.values.postseriesname.value
                });
            } else {
                this.setPsnjoRefbNull(['pk_post.pk_postseries'], hisvalues[0].rowid);
            }
        }
    }

    onPsnjobBeforeEdit(props, areacode, attrname, value, index, record) {
        // if(record.values.pk_psncl.value == '1002AD100000000000HT'){
        //     let psndoc = this.props.createMasterChildData(this.config.pagecode, 'psndoc_card_head', 'psnjobs');
        //     if()
        //     toast({content : this.lang['10140PSN-000000'],color : 'warning'}); //兼职只能在兼职组织中维护
        //     return false;
        // }
        //有限验证兼职
        debugger;
        // if(areacode == 'psnjobs'){
        //     if( this.editHandlerMode != 'simpleedit'){ //新增, 编辑并且组织pk=当前参照的， (attrname1,attrname2,attrname3,attrname4)可标记
        //         return true;
        //     }
        //     //////
        //     var pkpsnjob = record.values.pk_psnjob.value;
        //     var psndoc   = this.props.createMasterChildData(this.config.pagecode, 'psndoc_card_head', 'psnjobs');
        //     if(!pkpsnjob || record.values.pk_org.value == this.state.org.value.refpk ){
        //         if(attrname == 'pk_group' || attrname == 'pk_org' ||  attrname == 'ismainjob' || attrname == 'psncode'){
        //             return false;
        //         }
        //         return true;
        //     }
        //     return false;
        // }

        if (areacode == 'psnjobs') {

            // 验证一下是否可以编辑
            let canEdit = false
            // 获取当前的业务单元参照值
            let currOrgRefPk = this.state.org.value && this.state.org.value.refpk ? this.state.org.value.refpk : null
            // 当前编辑的业务单元参照值
            let editOrgRefPk = record.values.pk_org.value;
            // 是否已经存在当前组织的未结束的任职记录
            let childTableData = this.props.cardTable.getAllRows('psnjobs')
            childTableData.forEach(row => {
                if(row.values.pk_org.value == currOrgRefPk && !row.values.enddutydate.value) {
                    canEdit = true
                }
            })
            
            if(!canEdit && editOrgRefPk != currOrgRefPk) {
                return false;
            }

            if (attrname == 'pk_dept' || attrname == 'pk_org' || attrname == 'pk_job' || attrname == 'pk_post') {
                var condition = {
                    pk_group: record.values.pk_group.value ? record.values.pk_group.value : -1,
                    pk_org: record.values.pk_org.value ? record.values.pk_org.value : -1,
                    pk_dept: record.values.pk_dept.value ? record.values.pk_dept.value : -1,
                    pk_job: record.values.pk_job.value ? record.values.pk_job.value : -1
                };
                var meta = props.meta.getMeta();
                ;
                metaUtils.addQueryConditon(meta, 'psnjobs', 'pk_org', {
                    ...condition,
                    pk_org: '',
                    AppCode: this.config.appcode || '',
                    TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                });
                metaUtils.addQueryConditon(meta, 'psnjobs', 'pk_dept', condition);
                metaUtils.addQueryConditon(meta, 'psnjobs', 'pk_job', condition);
                metaUtils.addQueryConditon(meta, 'psnjobs', 'pk_post', condition);
                props.meta.setMeta(meta);
            }
        }
        return true;
    }

}

Psndoc = createPage({
    initTemplate: function () {
    },
    billinfo: [{
        billtype: 'card',
        pagecode: '10140PSN_main',
        headcode: 'psndoc_card_head',
        bodycode: 'psnjobs'
    }, {
        billtype: 'grid',
        pagecode: '10140PSN_main',
        bodycode: 'psndoc_list'
    }]
})(Psndoc)
ReactDOM.render(<Psndoc/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65