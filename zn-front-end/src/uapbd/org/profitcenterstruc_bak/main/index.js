//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,  promptBox } from 'nc-lightapp-front';
import { initTemplate, headerButtonClick, beforeEvent, afterEvent, afterHeadEvent } from '../events';
//集团参照
import GroupDefaultTreeRef from '../GroupDefaultTreeRef/index'
import Transfer from '../Transfer';
//组织类型参照
import   OrgTypeGridRef  from '../OrgTypeGridRef/index';

/**
 * 穿梭框--导入使用
 */
// import Transfer from '../../../public/excomponents/Transfer';

import './index.less';
const {NCCol:Col, NCRow:Row,NCFormControl,NCDatePicker, NCButton ,NCPanel,NCCheckbox,NCPopconfirm,NCRadio,NCDiv } = base;
let leftTree = 'systemTree';//体系--左树id
let rightTreeTable = 'memberTreeTable'//成员--右树表id
let pk_importGroup = '';//引入对话框的集团参照的主键
let groupname = '';
let pk_orgtypes = 'BUSINESSUNIT00000000';//引入的组织类型
let orgTypeName = '';
let sysVersionModalId = 'systemversion';//体系版本化模态框
let formId = 'sysForm';//体系--编辑formid
let templateCode = '10100RCSB_list';//动态加载模板，及显示公式
let showDisableOrg = false;//引入对话框是否显示停用的组织

let sysVersionStatus = 'browse';

let importModalId = 'importModalId';//引入对话框id

let dataSource = [
    {
        "key": "1",
        "title": "华锦集团-业务单元",
        "name": "华锦集团-业务单元",
        "children": [
            {
                "key": "1-1",
                "title": "A区",
                "name": "华锦集团-业务单元",

                "children": [
                    {
                    "key": "1-1-1",
                    "title": "华锦集团-业务单元",
                        "name": "华锦集团-业务单元",
                    
                    }
                ]
            }
        ]
    },
    {
        "key": "2",
        "title": "华锦集团-业务单元",
        "name": "华锦集团-业务单元",

        "children": [
            {
                "key": "2-1",
                "title": "B区",
                "name": "华锦集团-业务单元",
                "children": [
                    {
                        "name": "华锦集团-业务单元",
                        "key": "2-1-1",
                        "title": "华锦集团-业务单元"
                    }
                ]
            }
        ]
    }
]
class Coderule extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            oprType:'0',
            isShowSeal: false,
            json: {},
            nodeType: 'GROUP_NODE',
            options: [],
            loginfo: {},
            refs: {},
            dataSource:[],
            targetKeys: []


        }
    }

    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': '1057-1057bcrg', 'domainName': 'uap', callback });
    }
    componentDidMount() {
        this.getLoginfo();
        this.showTreeData(false);
        this.setbtnstatus();
        this.queryoptions();
        this.props.button.setButtonDisabled({ 'add': false });
    }

    componentDidUpdate() {
        let formstatus = this.props.form.getFormStatus(formId);
        let status = this.props.form.getFormStatus('bcbd_header');
        let sysVersionModalStatus = this.props.editTable.getStatus(sysVersionModalId);
        if (status && status != 'browse') {
            window.onbeforeunload = () => { return '' };
        } else {
            window.onbeforeunload = null;
        }
    }

    getLoginfo() {
        let _this = this;
        ajax({
            url: '/nccloud/bcbd/login/loginfo.do',
            loading: false,
            async: false,
            success: (result) => {
                _this.setState({
                    loginfo: result.data
                })
            }
        });
    }

/**
 * headerBUTTONCLICK
 */

headerButtonClick(props,id){
    let _this = this;
    switch (id) {
        case 'add':
            let sn = _this.props.syncTree.getSelectNode('leftTree');
            if (sn.id == 'genNode') {//如果选择的是根节点，并且点击了新增，则拒绝此操作
                _this.onSelectEve(sn.id, sn, true);
                return;
            }
            let pk_bartype = sn.id;
            let pk_barappobj = sn.nodeData.pk_barappobj
            if (!sn.nodeData.isseal) {//实节点
                pk_bartype = sn.pid;
            }
            _this.pagestatus = 'add';
            this.setPageStatus('add', _this);
            _this.props.syncTree.setNodeDisable('leftTree', true);
            _this.props.form.EmptyAllFormValue('bcbd_header');
            _this.props.cardTable.setTableData('bcbd_body', { rows: [] });
            _this.props.form.setFormItemsValue('bcbd_header',
                {
                    pk_bartype: { value: pk_bartype },
                    pk_barappobj: { value: pk_barappobj },
                    pk_group: _this.state.loginfo.pk_group,
                    creationtime: _this.state.loginfo.createTime,
                    creator: _this.state.loginfo.user
                });
                this.setVerButton('edit', _this);
            break;
        case 'page_save':
            this.pageSave();
            this.onRefresh(this, 'RefreshV');
            this.windowCloseListener('browse');
            this.findFormDataByNode(_this);
        _this.props.syncTree.setNodeDisable('leftTree', false);
        _this.props.form.setFormStatus('bcbd_header', 'browse');
        _this.props.cardTable.setStatus('bcbd_body', 'browse');
            break;
        case 'page_cancel':
            this.pageCancel;
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: "确认取消",/* 国际化处理： 确认取消*/
                content: "是否确认要取消",/* 国际化处理： 是否确认要取消？*/
                beSureBtnClick: () => {
                    this.onRefresh(this, 'RefreshV');
                    this.windowCloseListener('browse');
                    this.findFormDataByNode(_this);
                _this.props.syncTree.setNodeDisable('leftTree', false);
                _this.props.form.setFormStatus('bcbd_header', 'browse');
                _this.props.cardTable.setStatus('bcbd_body', 'browse');
                }

            })
           
            break;
        case 'AddVersion':
            this.onAddVersion();
            break;
        case 'EditVersion':
            this.onEditVersion();
            break;
        case 'DelVersion':
            this.onDelVersion();
            break;
        case 'SaveVersion':
            this.onVersionSave();
            break;
        case 'RefreshV':
            this.onRefreshVersion('RefreshV');
            this.props.button.setButtonDisabled('DelVersion', true);
            break;
        case 'CancelVersion':
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: "确认取消",/* 国际化处理： 确认取消*/
                content: "是否确认要取消",/* 国际化处理： 是否确认要取消？*/
                beSureBtnClick: () => {
                    this.onRefreshVersion();
                    this.windowCloseListener('browse');
                }
            })
            break;
        case 'edit':
            _this.pagestatus = 'edit';
            this.setPageStatus('edit');
            _this.props.syncTree.setNodeDisable('leftTree', true);
            break;
        //版本化
        case 'version':
            _this.onCreatVersion();
            break;
        case 'del':
           this.onDel();
                _this.props.form.getFormItemsValue('bcbd_header', 'pk_barcoderule').value;
            break;
        case 'startUp':
            UpdateCodeRuleStatus(_this, '/nccloud/bcbd/coderule/enable.do', _this.state.json['coderule-000001']/*是否确认要启用?*/, null, 'startUp');
            break;
        case 'blockUp':
            UpdateCodeRuleStatus(_this, '/nccloud/bcbd/coderule/disable.do', _this.state.json['coderule-000002']/*是否确认要停用?*/, null, 'blockUp');
            break;
        case 'setDefault':
            UpdateCodeRuleStatus(_this, '/nccloud/bcbd/coderule/setdefault.do', _this.state.json['coderule-000003']/*要将该规则设为默认规则吗?*/);
            break;
        case 'Import':
            this.onImportClick();
            break;
        case 'Enable':
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: "提示",/* 国际化处理： 提示*/
                content: "确定要启用该数据吗?",/* 国际化处理： 确定要启用该数据吗？*/
                beSureBtnClick: () => {
                    _this.onEnable(this)
                }
            })
            break;
        case 'disable':
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: '提示',/* 国际化处理： 提示*/
                content: '确定要停用该数据吗？',/* 国际化处理： 确定要停用该数据吗？*/
                beSureBtnClick: () => { this.onDisable() }
            })
            break;
        case 'cancel':
            _this.props.ncmodal.show('ncmodal', {
                title: <span className='nc-theme-common-font-c'>{_this.state.json['coderule-000004']/*是否确认要取消?*/}</span>,
                beSureBtnClick: () => {
                    _this.findFormDataByNode(_this);
                    _this.props.syncTree.setNodeDisable('leftTree', false);
                    _this.props.form.setFormStatus('bcbd_header', 'browse');
                    _this.props.cardTable.setStatus('bcbd_body', 'browse');
                }
            });
            break;
        case 'save':
            updateCodeRuleInfo(_this, _this.pagestatus);
            break;
        case 'addrow':
            let head_len = _this.props.form.getFormItemsValue('bcbd_header', 'length').value;
            let bodydata = _this.props.cardTable.getAllRows('bcbd_body');
            let bodylength = 0;
            for (let index = 0; index < bodydata.length; index++) {
                let leng = bodydata[index].values.length.value;
                if (leng && bodydata[index].status != '3') {
                    bodylength = parseInt(bodylength) + parseInt(leng);
                }
            }
            if (bodylength >= parseInt(head_len)) {
                toast({ color: 'warning', content: _this.state.json['coderule-000008'] });/* 条码长度已达到最大长度 */
                return;
            }
            setStartpos(_this, 'add');
            break;
        case 'delrow':
            let checkedRows = _this.props.cardTable.getCheckedRows('bcbd_body');
            if (!checkedRows || checkedRows.length <= 0) {
                toast({ color: 'warning', content: _this.state.json['coderule-000009'] });/* 请选择需要删除的行数据 */
                return;
            }
            let indexArr = [];
            if (checkedRows && checkedRows.length > 0) {
                checkedRows.map((row) => {
                    indexArr.push(row.index);
                    return indexArr;
                });
            }
            _this.props.cardTable.delRowsByIndex('bcbd_body', indexArr);
            setStartpos(_this);
            break;
        default:
            break;
    }

}

UpdateCodeRuleStatus(_this, url, title, pk_barcoderule, optcode) {
    _this.props.ncmodal.show('ncmodal', {
        title: <span className='nc-theme-common-font-c'>{title}</span>,
        beSureBtnClick: () => {
            ajax({
                url: url,
                data: { bcbd_header: _this.props.form.getAllFormValue('bcbd_header') },
                success: (res) => {
                    if (res && res.data) {
                        if (res.data.status) {
                            if (!pk_barcoderule) {
                                findFormDataByNode(_this, optcode);
                            } else {
                                //删除之后对应的操作
                                _this.props.syncTree.cancelSelectedNode('ruletree');
                                _this.props.syncTree.delNodeSuceess('ruletree', pk_barcoderule);
                                _this.props.form.EmptyAllFormValue('bcbd_header');
                                _this.props.cardTable.setTableData('bcbd_body', { rows: [] });
                                _this.setbtnstatus();
                                _this.props.button.setButtonDisabled(['add'], true);
                            }
                            toast({ color: 'success' });
                        } else {
                            toast({ color: 'danger', content: res.data.message });
                        }
                    }
                }
            });
        }
    });
}


findFormDataByNode(_this, optcode) {
    let sn = _this.props.syncTree.getSelectNode('ruletree');
    if (!_this.state.isShowSeal) {//是否显示停用 true 显示  false 不显示
        //如果不显示停用  对停用之后的规则做对应的操作
        if ('blockUp' == optcode) { //如果是停用操作 并且是未勾选显示停用的情况下
            //删除树节点 然后显示该节点的父级节点
            let currPk = sn.id;
            let pid = sn.pid;
            _this.props.syncTree.cancelSelectedNode('ruletree');
            _this.props.syncTree.delNodeSuceess('ruletree', currPk);
            sn = _this.props.syncTree.getSyncTreeValue('ruletree', pid);
        }
    }
    _this.onSelectEve(sn.id, sn, true);
}

/**
 * add
 */

setPageStatus(status, _this) {
    _this.props.form.setFormStatus('bcbd_header', status);
    _this.props.cardTable.setStatus('bcbd_body', status);
    if (status == 'browse') {
        _this.props.button.setButtonsVisible(['add', 'edit', 'del', 'startUp', 'blockUp', 'setDefault'], true);
        _this.props.button.setButtonsVisible(['page_save', 'page_cancel'], false);
    } else {
        _this.props.button.setButtonVisible(['add', 'edit', 'del', 'startUp', 'blockUp', 'setDefault'], false);
        _this.props.button.setButtonVisible(['page_save', 'page_cancel'], true);
       _this.props.button.setButtonDisabled(['addrow', 'delrow'], false);
    }
}
// page_save
pageSave(){
   
    let data = {
        data: {
            res: [{
                key: "genNode", title: "利润中心结构1", refname: "利润中心结构1", refpk: "genNode", id: "genNode", name: "利润中心结构1",
                pid: "",
                innercode: "",
                code: "",
                nodeData: { isseal: true },
                children: [{
                    key: "1001Z01000000000DBXV",
                    title: "01 利润中心组1",
                    refname: "01 利润中心组1",
                    refpk: "1001Z01000000000DBXV",
                    id: "1001Z01000000000DBXV",
                    name: "01 利润中心组1",
                    pid: "genNode",
                    code: "01",
                    nodeData: { isseal: true, pk_barappobj: "1001Z01000000000J3IL" },
                    children: [{
                        key: "1001ZZ10000000020D2A",
                        title: "0101 利润中心组2 ",
                        refname: "0101 利润中心组2",
                        refpk: "1001ZZ10000000020D2A",
                        id: "1001ZZ10000000020D2A",
                        name: "1 1",
                        pid: "1001Z01000000000DBXV",
                        innercode: "12",
                        code: "12",
                        nodeData: { isseal: false, pk_barappobj: "1001Z01000000000J3IL", pk_org: "0001X010000000000A1O" },
                        children: [{
                            key: "1001Z01000000001R56L",
                            title: "1111 2222",
                            refname: "1111 2222",
                            refpk: "1001Z01000000001R56L",
                            id: "1001Z01000000001R56L",
                            name: "1111 2222",
                            pid: "1001Z01000000000DBXV",
                            innercode: "1111",
                            code: "1111",
                            nodeData: { isseal: false, pk_barappobj: "1001Z01000000000J3IL", pk_org: "0001X010000000000A1O" },
                            children: []
                        }]
                    }]
                },

                  {
                    key: "1001Z01000000000DBXV",
                    title: "02 利润中心组3",
                    refname: "02 利润中心组3",
                    refpk: "1001Z01000000000DBXV",
                    id: "1001Z01000000000DBXV",
                    name: "02 利润中心组1",
                    pid: "genNode",
                    code: "02",
                    nodeData: { isseal: true, pk_barappobj: "1001Z01000000000J3IL" },
                    children: [{
                        key: "1001ZZ10000000020D2A",
                        title: "0202 利润中心组4 ",
                        refname: "0202 利润中心组4",
                        refpk: "1001ZZ10000000020D2A",
                        id: "1001ZZ10000000020D2A",
                        name: "1 1",
                        pid: "1001Z01000000000DBXV",
                        innercode: "12",
                        code: "12",
                        nodeData: { isseal: false, pk_barappobj: "1001Z01000000000J3IL", pk_org: "0001X010000000000A1O" },
                        children: [{
                            key: "1001Z01000000001R56L",
                            title: "0101 利润中心组2",
                            refname: "0101 利润中心组2",
                            refpk: "1001Z01000000001R56L",
                            id: "1001Z01000000001R56L",
                            name: "1111 2222",
                            pid: "1001Z01000000000DBXV",
                            innercode: "1111",
                            code: "1111",
                            nodeData: { isseal: false, pk_barappobj: "1001Z01000000000J3IL", pk_org: "0001X010000000000A1O" },
                            children: [],
                        }]
                    } ],
                    
                },


            ]

            }],

        }
    }
    this.props.syncTree.setSyncTreeData('leftTree', data.data.res);
   
    this.setVerButton('browse',this);
    toast({ color: 'success', title: this.state.json['10100CRSB-000005'] });/* 国际化处理： 保存成功！*/
    // this = null;
}

//版本化
onAddVersion(that) {
    let _this = that;
    // let pk = this.props.syncTree.getSelectNode(leftTree).id;

    let data = {
        pageid: "10100RCSG_list",
        systemversion: {
            rows: [{
                status: "0",
                isOptimized: false,
                values: {
                    code: { value: "111" },
                    creationtime: { value: "2020-02-10 16:51:34" },
                    creator: { display: "dingbtc", value: "0001X010000000000LYT" },
                    dataoriginflag: { display: "本级产生", value: "0" },
                    dr: { value: "0" },
                    enablestate: { display: "已启用", value: "2" },
                    islastversion: { value: true },
                    memo: {},
                    mnecode: {},
                    modifiedtime: { value: "2020-02-10 16:51:53" },
                    modifier: { display: "dingbtc", value: "0001X010000000000LYT" },
                    name: { value: "111" },
                    name2: {},
                    name3: {},
                    name4: {},
                    name5: {},
                    name6: {},
                    pk_group: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_org: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_reportcombinestru: { display: "111", value: "1001Z01000000000ABXO" },
                    pk_vid: { value: "0001Z010000000008Q2A" },
                    shortname: {},
                    shortname2: {},
                    shortname3: {},
                    shortname4: {},
                    shortname5: {},
                    shortname6: {},
                    status: { value: "0" },
                    ts: { value: "2020-04-21 19:28:41" },
                    venddate: { value: "9999-12-31 16:23:13" },
                    vname: { value: "初始版本" },
                    vname2: {},
                    vname3: {},
                    vname4: {},
                    vname5: {},
                    vname6: {},
                    vno: { value: "202001" },
                    vstartdate: { value: "2020-02-10 16:51:38" },
                }

            },

            {
                status: "0",
                isOptimized: false,
                values: {
                    code: { value: "111" },
                    creationtime: { value: "2020-02-10 16:51:34" },
                    creator: { display: "dingbtc", value: "0001X010000000000LYT" },
                    dataoriginflag: { display: "本级产生", value: "0" },
                    dr: { value: "0" },
                    enablestate: { display: "已启用", value: "2" },
                    islastversion: { value: true },
                    memo: {},
                    mnecode: {},
                    modifiedtime: { value: "2020-02-10 16:51:53" },
                    modifier: { display: "dingbtc", value: "0001X010000000000LYT" },
                    name: { value: "111" },
                    name2: {},
                    name3: {},
                    name4: {},
                    name5: {},
                    name6: {},
                    pk_group: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_org: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_reportcombinestru: { display: "111", value: "1001Z01000000000ABXO" },
                    pk_vid: { value: "0001Z010000000008Q2A" },
                    shortname: {},
                    shortname2: {},
                    shortname3: {},
                    shortname4: {},
                    shortname5: {},
                    shortname6: {},
                    status: { value: "0" },
                    ts: { value: "2020-04-21 19:28:41" },
                    venddate: { value: "9999-12-31 16:23:13" },
                    vname: { value: "初始版本" },
                    vname2: {},
                    vname3: {},
                    vname4: {},
                    vname5: {},
                    vname6: {},
                    vno: { value: "202002" },
                    vstartdate: { value: "2020-04-18 16:51:38" },
                }

            }]}

    }
    this.props.editTable.setTableData(sysVersionModalId, data[sysVersionModalId]);
    this.props.editTable.addRow(sysVersionModalId);
    // _this.props.editTable.addRow('sysVersionModalId', 2, { creationtime: { value: "2020-02-10 16:51:34" }}, true);
    this.setVerButtonSat('edit', _this);
    _this = null;
}

setVerButton(state,tthis){
    let _this = tthis;
    sysVersionStatus = status;
    _this.props.editTable.setStatus(sysVersionModalId, status);
    if (status === 'edit') {
        _this.props.button.setButtonVisible(['add', 'version', 'Enable', 'print'], false);
        _this.props.button.setButtonVisible(['page_save', 'page_cancel'], true);
    } else {
        _this.props.button.setButtonVisible(['add', 'version', 'Enable', 'print'], false);
         _this.props.button.setButtonVisible(['page_save', 'page_cancel'], true);
    }
    this.windowCloseListener(status);
}

setVerButtonSat(status, tthis) {
    let _this = tthis;
    sysVersionStatus = status;
    _this.props.editTable.setStatus(sysVersionModalId, status);
    if (status === 'edit') {
        _this.props.button.setButtonVisible(['AddVersion', 'EditVersion', 'RefreshV', 'DelVersion'], false);
        _this.props.button.setButtonVisible(['SaveVersion', 'CancelVersion'], true);
    } else {
        _this.props.button.setButtonVisible(['AddVersion', 'EditVersion', 'RefreshV', 'DelVersion'], true);
        _this.props.button.setButtonVisible(['SaveVersion', 'CancelVersion'], false);
    }
    windowCloseListener(status);

}

windowCloseListener(uiStatus) {
    if (uiStatus === 'browse') {
        window.onbeforeunload = null;
    } else {
        window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
            return '';
        };
    }
}

onEditVersion(bian) {
    // this.onSysVersionStatusChange('edit');
   this.setVerButtonSat('edit', bian);
}

onDelVersion(dev) {
    let _this = dev;
    let rowNum = this.props.editTable.getNumberOfRows(sysVersionModalId);
    if (rowNum === 1) {
        toast({ color: 'warning', content: "请选择数据" });
        return;
    }
    let ind = this.props.editTable.getClickRowIndex(sysVersionModalId);
    let pk_vid = ind.record.values.pk_vid.values;
    let ts = ind.record.values.ts.value;
    promptBox({
        color: 'warning',
        title: "确认删除",
        content: "是否确认删除",
        beSureBtnClick: () => {
            onSuerDeleteSysVersion(pk_vid, ts, _this);
        }

    })
}

onSuerDeleteSysVersion(pk_vid, ts, _this) {
    let that = _this;
    //   let pk = that.props.syncTree.getSelectNode(leftTree).id;

    let data = { pk_vid: pk_vid, ts: ts }
    let data1 = {
        pageid: "10100RCSG_list",
        systemversion: {
            rows: [{
                status: "0",
                isOptimized: false,
                values: {
                    code: { value: "111" },
                    creationtime: { value: "2020-02-10 16:51:34" },
                    creator: { display: "dingbtc", value: "0001X010000000000LYT" },
                    dataoriginflag: { display: "本级产生", value: "0" },
                    dr: { value: "0" },
                    enablestate: { display: "已启用", value: "2" },
                    islastversion: { value: true },
                    memo: {},
                    mnecode: {},
                    modifiedtime: { value: "2020-02-10 16:51:53" },
                    modifier: { display: "dingbtc", value: "0001X010000000000LYT" },
                    name: { value: "111" },
                    name2: {},
                    name3: {},
                    name4: {},
                    name5: {},
                    name6: {},
                    pk_group: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_org: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_reportcombinestru: { display: "111", value: "1001Z01000000000ABXO" },
                    pk_vid: { value: "0001Z010000000008Q2A" },
                    shortname: {},
                    shortname2: {},
                    shortname3: {},
                    shortname4: {},
                    shortname5: {},
                    shortname6: {},
                    status: { value: "0" },
                    ts: { value: "2020-04-21 19:28:41" },
                    venddate: { value: "9999-12-31 16:23:13" },
                    vname: { value: "初始版本" },
                    vname2: {},
                    vname3: {},
                    vname4: {},
                    vname5: {},
                    vname6: {},
                    vno: { value: "202001" },
                    vstartdate: { value: "2020-02-10 16:51:38" },
                }

            }],


        }

    }

    that.props.editTable.setTableData(sysVersionModalId, data1[sysVersionModalId]);
    that.props.button.setButtonDisabled('DelVersion', true)
    toast({ color: 'success', title: "删除成功！" });/* 国际化处理： 删除成功！*/
}

//版本化保存
onVersionSave(save) {
    let that = save;
    let checkData = this.props.editTable.getAllRows(sysVersionModalId);

    let newData = [];
    checkData.map((ele) => {
        newData.push(ele.data);
    });
    let data = {
        // pageid:'10100RCSVersion_list',
        pageid: this.props.nodePageCode,
        model: {
            areaType: "table",
            pageinfo: null,
            rows: checkData
        },
        systemversion: {
            rows: [{
                status: "0",
                isOptimized: false,
                values: {
                    code: { value: "111" },
                    creationtime: { value: "2020-02-10 16:51:34" },
                    creator: { display: "dingbtc", value: "0001X010000000000LYT" },
                    dataoriginflag: { display: "本级产生", value: "0" },
                    dr: { value: "0" },
                    enablestate: { display: "已启用", value: "2" },
                    islastversion: { value: true },
                    memo: {},
                    mnecode: {},
                    modifiedtime: { value: "2020-02-10 16:51:53" },
                    modifier: { display: "dingbtc", value: "0001X010000000000LYT" },
                    name: { value: "111" },
                    name2: {},
                    name3: {},
                    name4: {},
                    name5: {},
                    name6: {},
                    pk_group: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_org: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_reportcombinestru: { display: "111", value: "1001Z01000000000ABXO" },
                    pk_vid: { value: "0001Z010000000008Q2A" },
                    shortname: {},
                    shortname2: {},
                    shortname3: {},
                    shortname4: {},
                    shortname5: {},
                    shortname6: {},
                    status: { value: "0" },
                    ts: { value: "2020-04-21 19:28:41" },
                    venddate: { value: "9999-12-31 16:23:13" },
                    vname: { value: "初始版本" },
                    vname2: {},
                    vname3: {},
                    vname4: {},
                    vname5: {},
                    vname6: {},
                    vno: { value: "202001" },
                    vstartdate: { value: "2020-02-10 16:51:38" },
                }

            },

            {
                status: "0",
                isOptimized: false,
                values: {
                    code: { value: "111" },
                    creationtime: { value: "2020-02-10 16:51:34" },
                    creator: { display: "dingbtc", value: "0001X010000000000LYT" },
                    dataoriginflag: { display: "本级产生", value: "0" },
                    dr: { value: "0" },
                    enablestate: { display: "已启用", value: "2" },
                    islastversion: { value: true },
                    memo: {},
                    mnecode: {},
                    modifiedtime: { value: "2020-02-10 16:51:53" },
                    modifier: { display: "dingbtc", value: "0001X010000000000LYT" },
                    name: { value: "111" },
                    name2: {},
                    name3: {},
                    name4: {},
                    name5: {},
                    name6: {},
                    pk_group: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_org: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_reportcombinestru: { display: "111", value: "1001Z01000000000ABXO" },
                    pk_vid: { value: "0001Z010000000008Q2A" },
                    shortname: {},
                    shortname2: {},
                    shortname3: {},
                    shortname4: {},
                    shortname5: {},
                    shortname6: {},
                    status: { value: "0" },
                    ts: { value: "2020-04-21 19:28:41" },
                    venddate: { value: "9999-12-31 16:23:13" },
                    vname: { value: "初始版本" },
                    vname2: {},
                    vname3: {},
                    vname4: {},
                    vname5: {},
                    vname6: {},
                    vno: { value: "202002" },
                    vstartdate: { value: "2020-04-18 16:51:38" },
                }

            },

            {
                status: "0",
                isOptimized: false,
                values: {
                    code: { value: "111" },
                    creationtime: { value: "2020-02-10 16:51:34" },
                    creator: { display: "dingbtc", value: "0001X010000000000LYT" },
                    dataoriginflag: { display: "本级产生", value: "0" },
                    dr: { value: "0" },
                    enablestate: { display: "已启用", value: "2" },
                    islastversion: { value: true },
                    memo: {},
                    mnecode: {},
                    modifiedtime: { value: "2020-02-10 16:51:53" },
                    modifier: { display: "dingbtc", value: "0001X010000000000LYT" },
                    name: { value: "111" },
                    name2: {},
                    name3: {},
                    name4: {},
                    name5: {},
                    name6: {},
                    pk_group: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_org: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    pk_reportcombinestru: { display: "111", value: "1001Z01000000000ABXO" },
                    pk_vid: { value: "0001Z010000000008Q2A" },
                    shortname: {},
                    shortname2: {},
                    shortname3: {},
                    shortname4: {},
                    shortname5: {},
                    shortname6: {},
                    status: { value: "0" },
                    ts: { value: "2020-04-21 19:28:41" },
                    venddate: { value: "9999-12-31 16:23:13" },
                    vname: { value: "修改版本" },
                    vname2: {},
                    vname3: {},
                    vname4: {},
                    vname5: {},
                    vname6: {},
                    vno: { value: "202002" },
                    vstartdate: { value: "2020-04-18 16:51:38" },
                }

            }

            ],


        }

    }
    this.props.editTable.setTableData(sysVersionModalId, data[sysVersionModalId]);
    this.setVerButtonSat('browse', save);
    toast({ color: 'success', title: this.state.json['10100CRSB-000005'] });/* 国际化处理： 保存成功！*/
    that = null;

}
//保存刷新
onRefresh(tant, btn) {
    this.bcbd_header(tant, btn);
}
//版本化刷新
onRefreshVersion(tant, btn) {
    this.onCreatVersion(tant, btn);
}

//版本化
onCreatVersion(that, btn) {
    let _this = that;

    let data = {
        pageid: "systemversion",

        systemversion: {
            rows: [{
                status: "0", isOptimized: false,

                values: {
                    pk_group: { display: "ncc2004集团", value: "0001X010000000000A1O" },

                    enablestate: { display: "已启用", value: "2" },

                    vname6: {},
                    code: { value: "111" },
                    vname5: {},
                    vname4: {},
                    vname3: {},
                    vname2: {},
                    modifier: { display: "dingbtc", value: "0001X010000000000LYT" },
                    memo: {},
                    pk_reportcombinestru: { display: "111", value: "1001Z01000000000ABXO" },
                    islastversion: { value: true },
                    dr: { value: "0" },
                    pk_org: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    modifiedtime: { value: "2020-02-10 16:51:53" },
                    dataoriginflag: { display: "本级产生", value: "0" },
                    venddate: { value: "9999-12-31 16:23:13" },
                    creator: { display: "dingbtc", value: "0001X010000000000LYT" },
                    pk_vid: { value: "0001Z010000000008Q2A" },
                    shortname2: {},
                    mnecode: {},
                    shortname4: {},
                    vstartdate: { value: "2020-02-10 16:51:38" },
                    shortname: {},
                    shortname3: {},
                    shortname6: {},
                    shortname5: {},
                    name6: {},
                    name5: {},
                    name4: {},
                    name3: {},
                    vname: { value: "初始版本" },
                    vno: { value: "202001" },
                    name: { value: "111" },
                    creationtime: { value: "2020-02-10 16:51:34" },
                    name2: {},
                    status: { value: "0" },
                    ts: { value: "2020-04-21 15:01:56" },
                    numberindex: { value: "1" },
                },

                rowid: "305180.b23143791887b84", isLeaf: undefined
            },

            {
                status: "0", isOptimized: false,

                values: {
                    pk_group: { display: "ncc2004集团", value: "0001X010000000000A1O" },

                    enablestate: { display: "已启用", value: "2" },

                    vname6: {},
                    code: { value: "111" },
                    vname5: {},
                    vname4: {},
                    vname3: {},
                    vname2: {},
                    modifier: { display: "dingbtc", value: "0001X010000000000LYT" },
                    memo: {},
                    pk_reportcombinestru: { display: "111", value: "1001Z01000000000ABXO" },
                    islastversion: { value: true },
                    dr: { value: "0" },
                    pk_org: { display: "ncc2004集团", value: "0001X010000000000A1O" },
                    modifiedtime: { value: "2020-02-10 16:51:53" },
                    dataoriginflag: { display: "本级产生", value: "0" },
                    venddate: { value: "9999-12-31 16:23:13" },
                    creator: { display: "dingbtc", value: "0001X010000000000LYT" },
                    pk_vid: { value: "0001Z010000000008Q2A" },
                    shortname2: {},
                    mnecode: {},
                    shortname4: {},
                    vstartdate: { value: "2020-02-10 16:51:38" },
                    shortname: {},
                    shortname3: {},
                    shortname6: {},
                    shortname5: {},
                    name6: {},
                    name5: {},
                    name4: {},
                    name3: {},
                    vname: { value: "初始版本" },
                    vno: { value: "202001" },
                    name: { value: "111" },
                    creationtime: { value: "2020-02-10 16:51:34" },
                    name2: {},
                    status: { value: "0" },
                    ts: { value: "2020-04-21 15:01:56" },
                    numberindex: { value: "1" },
                },

                rowid: "305180.b23143791887b84", isLeaf: undefined
            },

            ],

            areacode: "systemversion", pageInfo: { pageSize: "10", pageIndex: "1" }, allpks: []
        }
    }
    this.props.modal.show(sysVersionModalId);
    //   _this.props.editTable.setTableData(sysVersionModalId,{rows:[]});
    this.props.editTable.setTableData(sysVersionModalId, data[sysVersionModalId]);
    this.setVerButtonSat('browse', _this);
    if (btn === 'RefreshV') {
        toast({ color: 'success', title: "刷新成功" });/* 国际化处理： 刷新成功！*/
    }
}

//启用
onEnable(able) {
    let that = able;
    // let selectNode = that.props.syncTree.getSelectNode(leftTree);

    let data = { nodeType: this.props.nodeType };
    this.props.button.setButtonDisabled(['Enable'], true);
    this.props.button.setButtonDisabled(['Disable'], false);
    //更新树节点
    let treeData = dealTreeData(this);
    // that.props.syncTree.editNodeSuccess(leftTree, treeData);
    toast({ color: 'success', title: "启用成功" });/* 国际化处理： 启用成功！*/
    that = null;
}

dealTreeData(data) {
    let deleteDataChildrenProp = function (node) {
        node.iconBox = {
            editIcon: true,
            addIcon: true,
            delIcon: true
        }
        if (!node.children || node.children.length == 0) {
            delete node.children;
        }
        else {
            node.isLeaf = false;
            node.children.forEach((e) => {
                deleteDataChildrenProp(e);
            });
        }
    };
    // data.forEach( (e) => {
    //     e.iconBox = {
    //         editIcon: true,
    //         addIcon: true,
    //         delIcon: true
    //     }
    //     deleteDataChildrenProp(e);
    // });
    return data;
}

//引入
onImportClick() {
   
    // 校验成员只能有一个根节点
    // let allMember = _this.props.treeTableManyCol.getAllValue(rightTreeTable);
    // let selectMember = _this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
    // if((allMember&&allMember.length>0)&&((!selectMember)||selectMember.length<1)){
    //     toast({content : _this.state.json['10100RSSB-000014'],color : 'warning'});/* 国际化处理： 组织体系内的成员树只能有一个根节点，请选择一个成员节点后再引入组织数据*/
    //     return;
    // }
    //onImportDataLoad.call(_this);
    //  //弹出引入窗口
    // _this.props.modal.show(importModalId);
    
    


    
    this.props.modal.show(importModalId);
    // this.orgTransfer.setRootTitle( "华锦集团"+'-' + "业务单元")
    // this.orgTransfer.setMoveType(this.state.oprType);
    // this.dataSource.setRootTitle( "华锦集团"+'-' + "业务单元")
    // this.dataSource.setMoveType(this.state.oprType);
}

findFormDataByNode(_this, optcode) {
    let sn = _this.props.syncTree.getSelectNode('leftTree');
    if (!_this.state.isShowSeal) {//是否显示停用 true 显示  false 不显示
        //如果不显示停用  对停用之后的规则做对应的操作
        if ('blockUp' == optcode) { //如果是停用操作 并且是未勾选显示停用的情况下
            //删除树节点 然后显示该节点的父级节点
            let currPk = sn.id;
            let pid = sn.pid;
            _this.props.syncTree.cancelSelectedNode('leftTree');
            _this.props.syncTree.delNodeSuceess('leftTree', currPk);
            sn = _this.props.syncTree.getSyncTreeValue('leftTree', pid);
        }
    }
    _this.onSelectEve(sn.id, sn, true);
}



onTargetKeysChange = (targetKeys) => {
    this.setState({
        targetKeys
    });
};



    queryoptions() {
        let _this = this;
        ajax({
            url: '/nccloud/bcbd/coderule/queryoptions.do',
            success: (res) => {
                let options = [];
                if (res && res.success && res.data) {
                    if (Array.isArray(res.data)) {
                        res.data.map((option) => {
                            options.push({
                                value: option.value,
                                display: option.name
                            });
                            return options;
                        });
                        _this.setState({
                            options: options
                        });
                    } else {
                        toast({ color: 'danger', content: res.data });
                    }
                }
            }
        })
    }

    setDefaultOptions() {
        let _this = this;
        let meta = _this.props.meta.getMeta();
        _this.props.renderItem('table', 'bcbd_body', 'accessstrategy', null);
        meta['bcbd_body'].items.find((item) => item.attrcode == 'accessstrategy').options = _this.state.options;
        _this.props.meta.setMeta(meta);
    }

    setbtnstatus() {
        this.props.button.setButtonDisabled({ 'page_save': false, cancel: false });
        this.props.button.setButtonDisabled({ 'add': false });
        this.props.button.setButtonDisabled(['edit', 'del', 'addrow', 'delrow', 'startUp', 'blockUp', 'setDefault'], true);
    }

    onCheckShowDisable(checked) {
        this.setState({
            isShowSeal: checked
        });
        this.showTreeData(checked);
    }

   bcbd_header(that, btn) {
        let _this = that;
    
        let data = {
            pageid: "bcbd_header",
    
            bcbd_header: {
                pageid: "bcbd_header", bcbd_header: {
                    rows: [{
                        status: "0", isOptimized: false,
                        values: {
                            pk_group: { value: "0001X010000000000A1O" },
                            preview: {},
                            enablestate: { display: "已启用", value: "2" },
                            code: { display: "001", value: "001" },
                            modifier: { display: "dingxf11", value: "1001Z010000000022HDA" },
                            memo: {},
                            name: { diaplay: "利润中心组1", value: "利润中心组1" },
                            delivretail: {},
                            dr: { value: "0" },
                            pk_org: { value: "0001X010000000000A1O" },
                            pk_source: { value: "1001ZZ10000000020D2A" },
                            islatest: { value: true },
                            modifiedtime: { value: "2020-04-08 12:44:35" },
                            pk_barcoderule: { value: "1001ZZ10000000020D2A" },
                            isdefault: { value: false },
                            complement: { display: "张三", value: "2" },
                            barcoderuleitems: {},
                            creator: { display: "chendch", value: "0001X0100000000036IW" },
                            fillcode: { value: "@" },
                            isgencode: {},
                            length: { value: "1" },
                            version: { value: "1.00000000" },
                            name6: {},
                            name5: {},
                            name4: {},
                            name3: {},
                            pk_bartype: { display: "物料码", value: "1001Z01000000000DBXV" },

                            isretail: { value: false },
                            pk_barappobj: { display: "物料", value: "1001Z01000000000J3IL" },
                            creationtime: { value: "2020-03-16 13:50:33" },
                            name2: {},
                            status: { value: "0" },
                            ts: { value: "2020-04-08 12:41:11" },
                        }
                    }], areacode: "bcbd_header"
                }
            }
        }
        // that.props.createForm(bcbd_header);
        //   _this.props.createForm.setAllFormValue(bcbd_header,{rows:[]});
        //   _this.props.createForm.setAllFormValue(bcbd_header, data[bcbd_header]);
         let result = { "data": data };
         _this.setAllData(result, _this);
         this.setVerButton('browse', _this);
         if (btn === 'RefreshV') {
            toast({ color: 'success', title: "刷新成功" });/* 国际化处理： 刷新成功！*/
        }
    }



    showTreeData(isShowSeal) {
        let _this = this;
        // ajax({
        //     url: '/nccloud/bcbd/tree/list.do',
        //     data: {
        //         nodeType: 'GROUP_NODE',
        //         isShowSeal: isShowSeal
        //     },
        //     success: (data) => {
        //         if (data && data.data && data.data.status && data.data.res && data.data.res.length > 0) {
        //             _this.props.syncTree.setSyncTreeData('leftTree', data.data.res);
        //         } else {
        //             _this.props.syncTree.setSyncTreeData('leftTree', []);
        //         }
        //     }
        // });

        let data = {
            data: {
                res: [{
                    key: "genNode", title: "利润中心结构1", refname: "利润中心结构1", refpk: "genNode", id: "genNode", name: "利润中心结构1",
                    pid: "",
                    innercode: "",
                    code: "",
                    nodeData: { isseal: true },
                    children: [{
                        key: "1001Z01000000000DBXV",
                        title: "01 利润中心组1",
                        refname: "01 利润中心组1",
                        refpk: "1001Z01000000000DBXV",
                        id: "1001Z01000000000DBXV",
                        name: "01 利润中心组1",
                        pid: "genNode",
                        code: "01",
                        nodeData: { isseal: true, pk_barappobj: "1001Z01000000000J3IL" },
                        children: [{
                            key: "1001ZZ10000000020D2A",
                            title: "0101 利润中心组2 ",
                            refname: "0101 利润中心组2",
                            refpk: "1001ZZ10000000020D2A",
                            id: "1001ZZ10000000020D2A",
                            name: "1 1",
                            pid: "1001Z01000000000DBXV",
                            innercode: "12",
                            code: "12",
                            nodeData: { isseal: false, pk_barappobj: "1001Z01000000000J3IL", pk_org: "0001X010000000000A1O" },
                            // children: [{
                            //     key: "1001Z01000000001R56L",
                            //     title: "1111 2222",
                            //     refname: "1111 2222",
                            //     refpk: "1001Z01000000001R56L",
                            //     id: "1001Z01000000001R56L",
                            //     name: "1111 2222",
                            //     pid: "1001Z01000000000DBXV",
                            //     innercode: "1111",
                            //     code: "1111",
                            //     nodeData: { isseal: false, pk_barappobj: "1001Z01000000000J3IL", pk_org: "0001X010000000000A1O" },
                            //     children: []
                            // }]
                        },
                    
                    ]
                    },

                      {
                        key: "1001Z01000000000DBXV",
                        title: "02 利润中心组3",
                        refname: "02 利润中心组3",
                        refpk: "1001Z01000000000DBXV",
                        id: "1001Z01000000000DBXV",
                        name: "02 利润中心组1",
                        pid: "genNode",
                        code: "02",
                        nodeData: { isseal: true, pk_barappobj: "1001Z01000000000J3IL" },
                        children: [{
                            key: "1001ZZ10000000020D2A",
                            title: "0202 利润中心组4 ",
                            refname: "0202 利润中心组4",
                            refpk: "1001ZZ10000000020D2A",
                            id: "1001ZZ10000000020D2A",
                            name: "1 1",
                            pid: "1001Z01000000000DBXV",
                            innercode: "12",
                            code: "12",
                            nodeData: { isseal: false, pk_barappobj: "1001Z01000000000J3IL", pk_org: "0001X010000000000A1O" },
                            children: [{
                                key: "1001Z01000000001R56L",
                                title: "0101 利润中心组2",
                                refname: "0101 利润中心组2",
                                refpk: "1001Z01000000001R56L",
                                id: "1001Z01000000001R56L",
                                name: "1111 2222",
                                pid: "1001Z01000000000DBXV",
                                innercode: "1111",
                                code: "1111",
                                nodeData: { isseal: false, pk_barappobj: "1001Z01000000000J3IL", pk_org: "0001X010000000000A1O" },
                                children: [],
                            }]
                        } ],
                        
                    },


                ]

                }],

            }
        }
        _this.props.syncTree.setSyncTreeData('leftTree', data.data.res);
    }
    onSelectEve(pk, item, isChange) {
        if (item.nodeData.isseal) { // 虚节点
            this.props.form.EmptyAllFormValue('bcbd_header');
            this.props.cardTable.setTableData('bcbd_body', { rows: [] });
            if (pk == 'genNode') {
                this.props.button.setButtonDisabled(['add', 'edit', 'del', 'addrow', 'delrow', 'startUp', 'blockUp', 'setDefault'], true);
            } else {
                this.setbtnstatus();
            }
            this.props.syncTree.setNodeSelected('leftTree', pk);
        } else {//实节点 走ajax请求数据
            let _this = this;
            // ajax({
            //     url: '/nccloud/bcbd/coderule/findrule.do',
            //     data: {
            //         pk_barcoderule: pk,
            //         isShowSeal: this.state.isShowSeal,
            //         nodeType: 'GROUP_NODE'
            //     },
            //     async: false,
            //     success: (result) => {
            //         _this.props.button.setButtonDisabled(['add', 'edit', 'del', 'startUp', 'blockUp', 'setDefault'], false);
            //         _this.props.button.setButtonDisabled(['addrow', 'delrow'], true);
            //         _this.setAllData(result, _this);
            //     }

            // })

            let data = {
                bcbd_body: {
                    pageid: "bcbd_body",
                    bcbd_body: {
                        rows: [{
                            status: "0",
                            isOptimized: false,
                            values: {
                                pk_appobjattr: { display: "标志位", value: "1001Z01000000000P9QT" },
                                pk_barruleitem: { value: "001" },
                                length: { value: "利润中心1" },
                                memo: { value: "利润中心组1" },
                                pk_bardict: {},
                                startpos: { value: "1" },
                                dr: { value: "0" },
                                formate: {},
                                profitcenter: { display: "2020-1-1", value: "12" },
                                profitname: { displa: "利润中心名称", value: "利润中心1" },
                                enable: { display: "已启用", value: "已启用" },
                                startdata: { display: "2020-1-1", value: "2020-1-1" },
                                disabledata: { display: "9999-12-12", value: "9999-12-12" },
                                isparseretrieve: { value: true },
                                accessstrategy: { display: "条码标识", value: "6" },
                                pk_barcoderule: { value: "1001ZZ10000000020D2A1" },
                                status: { value: "0" },
                                ts: { value: "2020-03-16 13:50:34" },
                            }
                        }], areacode: "bcbd_body",
                    }
                },


                bcbd_header: {
                    pageid: "bcbd_header", bcbd_header: {
                        rows: [{
                            status: "0", isOptimized: false,
                            values: {
                                pk_group: { value: "0001X010000000000A1O" },
                                preview: {},
                                enablestate: { display: "已启用", value: "2" },
                                code: { display: "001", value: "001" },
                                modifier: { display: "dingxf11", value: "1001Z010000000022HDA" },
                                memo: {},
                                name: { diaplay: "利润中心组1", value: "利润中心组1" },
                                delivretail: {},
                                dr: { value: "0" },
                                pk_org: { value: "0001X010000000000A1O" },
                                pk_source: { value: "1001ZZ10000000020D2A" },
                                islatest: { value: true },
                                modifiedtime: { value: "2020-04-08 12:44:35" },
                                pk_barcoderule: { value: "1001ZZ10000000020D2A" },
                                isdefault: { value: false },
                                complement: { display: "张三", value: "2" },
                                barcoderuleitems: {},
                                creator: { display: "chendch", value: "0001X0100000000036IW" },
                                fillcode: { value: "@" },
                                isgencode: {},
                                length: { value: "1" },
                                version: { value: "1.00000000" },
                                name6: {},
                                name5: {},
                                name4: {},
                                name3: {},
                                pk_bartype: { display: "物料码", value: "1001Z01000000000DBXV" },

                                isretail: { value: false },
                                pk_barappobj: { display: "物料", value: "1001Z01000000000J3IL" },
                                creationtime: { value: "2020-03-16 13:50:33" },
                                name2: {},
                                status: { value: "0" },
                                ts: { value: "2020-04-08 12:41:11" },
                            }
                        }], areacode: "bcbd_header"
                    }
                }



            }
            let result = { "data": data };
            _this.setAllData(result, _this);
        }
        this.props.button.setButtonsVisible(['add', 'edit', 'del', 'startUp', 'blockUp', 'setDefault'], true);
        this.props.button.setButtonsVisible(['save', 'cancel'], false);
    }
    setAllData(result, _this) {
        let meta = _this.props.meta.getMeta();
        _this.props.renderItem('table', 'bcbd_body', 'appobjattrvalue', null);
        //meta['bcbd_body'].items.find((item) => item.attrcode == 'profitcenter').itemtype = 'refer';
        // meta['bcbd_body'].items.find((item) => item.attrcode == 'profitcenter').refcode = 'uap/refer/riart/barcodeDictTableRef/index';
        _this.props.meta.setMeta(meta);
        //if (result.success && result.data && result.data.status) {
        if (result.data['bcbd_header']) {
            _this.props.form.setAllFormValue({ bcbd_header: result.data.bcbd_header['bcbd_header'] });
        } else {
            _this.props.form.EmptyAllFormValue('bcbd_header');
        }
        // }
        if (result.data['bcbd_body']) {
            _this.props.cardTable.setTableData('bcbd_body', result.data.bcbd_body['bcbd_body']);
        } else {
            _this.props.cardTable.setTableData('bcbd_body', { rows: [] });
        }
        _this.props.button.setButtonDisabled({ 'setDefault': result.data.bcbd_header['bcbd_header'].rows[0].values.isdefault.value });
        let enablestate = result.data.bcbd_header['bcbd_header'].rows[0].values.enablestate.value;
        if (enablestate == '2') {
            _this.props.button.setButtonDisabled({ 'startUp': true });
            _this.props.button.setButtonDisabled({ 'blockUp': false });
        } else {
            _this.props.button.setButtonDisabled({ 'startUp': false });
            _this.props.button.setButtonDisabled({ 'blockUp': true });
        }

    }


    setVerButtonSat(status){
        this.sysVersionStatus = status;
        this.props.editTable.setStatus(sysVersionModalId,status);
        if(status === 'edit'){
            this.props.button.setButtonVisible(['AddVersion','EditVersion','RefreshV','DelVersion'],false);
            this.props.button.setButtonVisible(['SaveVersion','CancelVersion'],true);
        }else{
            this.props.button.setButtonVisible(['AddVersion','EditVersion','RefreshV','DelVersion'],true);
            this.props.button.setButtonVisible(['SaveVersion','CancelVersion'],false);
        }
        this.windowCloseListener(status);
    }
    

    onSearch(value){
        this.setState({ searchValue:value });
        this.props.treeTableManyCol.searchTreeTable({ moduleId: 'memberTreeTable', 
            searchValue: value, filters: ['code','name'], expanded: true, defaultExpandAllRows: false})
    } 



    /**
     * 编辑
     */
    onEditSys(selectedTreeNode){
        sysSaveType = 'edit';
        this.openSysModal(selectedTreeNode.id);
    }
    //体系编辑窗口
    openSysModal(pk){
        let that = this;
        ajax({
            url:ajaxUrl.sysQueryByPkUrl,
            method:"post",
            data:{pk_system:pk,nodeType:that.props.nodeType,queryType:sysSaveType,templateCode:templateCode},
            success:function(res){
                if(res.success){
                    that.props.form.EmptyAllFormValue(formId);
                    if(sysSaveType == 'add'){
                        that.props.form.setFormStatus(formId,'add');
                    }else{
                        that.props.form.setFormStatus(formId,'edit');
                    }
                    let cardData = {rows:res.data.sysForm.rows};
                    let cardvalue = {'sysForm':cardData}
                    Utils.filterEmptyData(cardvalue.sysForm.rows[0].values);
                    that.props.form.setAllFormValue(cardvalue);
                    // that.props.form.setAllFormValue(res.data);
                    that.windowCloseListener('edit');
                    that = null;
                }
                that = null;
            }
        });
        //弹出体系编辑窗口
        this.props.modal.show(sysModalId);
    }


//     // 新增节点弹出框内容
//    modalContent (createButtonApp,createForm) {
//     return (
//         <div className="addModal">
//             {/* <div className="table-area">
//                 {/* 体系版本按钮区  btn-group */}
//                 {/* <div className="btn-group" style={{ padding: '5px', textAlign: 'right' }}>
//                     {createButtonApp({
//                         area: 'vers_head',
//                         buttonLimit: 5,
//                         onButtonClick: headerButtonClick.bind(this),
//                         popContainer: document.querySelector('.vers_head')
//                     })}
//                 </div>
//             </div> */} 

           
//         </div>
//     )
// };



createCfg(id,param){
    var obj;
    if(id==='ReportCombineStruVersionGridRef'){
        obj={
            value:this.state.refs[id]?this.state.refs[id].value:[],
            onChange:function (val) {
                var temp= Object.assign(this.state.refs[id],{value:val});
                this.setState(Object.assign (this.state.refs,temp));
                if(sysVRefPk!==temp.value.refpk){
                    sysVRefPk = temp.value.refpk;
                    sysRefName = temp.value.refname;
                    isRefChange = true;
                    this.onSelectEve(this.props.syncTree.getSelectNode(leftTree).id,null,true);
                }
            }.bind(this)
        }
    }
    if(id==='GroupDefaultTreeRef'){
        obj={
            value:this.state.refs[id]?this.state.refs[id].value:[],
            onChange:function (val) {
                var temp= Object.assign(this.state.refs[id],{value:val});
                this.setState(Object.assign (this.state.refs,temp));
                if(pk_importGroup!==temp.value.refpk){
                    pk_importGroup = temp.value.refpk;
                    this.onImportClick();
                }
            }.bind(this)
        }
    }
    if(id==='OrgTypeGridRef'){
        obj={
            value:this.state.refs[id]?this.state.refs[id].value:[],
            onChange:function (val) {
                var temp= Object.assign(this.state.refs[id],{value:val});
                this.setState(Object.assign (this.state.refs,temp));
                if(pk_orgtypes!==temp.value.refpk){
                    pk_orgtypes = temp.value.refpk;
                    orgTypeName = temp.value.refname;
                    this.onImportClick();
                }
            }.bind(this)
        }
    }
    this.state.refs[id]=obj;
    var result_param= Object.assign(obj, param)
    return result_param;
}

onCheckboxChange(id,check){
    switch(id){
        case 'orgShowDisable':
            this.onShowDisableOrg.call(this,check);
            break;
        case 'sysShowDisable':
            this.onCheckShowDisable.call(this,check);
            break;
    }
}


   /**
     * 引入时是否可以选择到右边
     * @param {*} node 
     */
    beforeMoveHandler(type,datas1,datas2,pks){
        return true;
     }

  /**
	 * 切换树节点移动方式
	 */
	handleOprTypeChange(value){
		this.setState({
			oprType : value
        });
        this.orgTransfer.setMoveType(value);
    }


//体系成员引入保存
onImportSave(){
    var orgs = this.orgTransfer.getData();
    if(!(orgs&&orgs.length>0)){
        toast({content : this.state.json['10100CRSB-000016'],color : 'warning'});/* 国际化处理： 您没有选择任何数据！*/
        return;
    }

    let pk = this.props.syncTree.getSelectNode(leftTree).id;
    // let pk_sysvid =this.props.syncTree.getSelectNode(leftTree).nodeData.pk_vid;
    let that = this;
    //获取选中的成员作为引入数据的根节点
    let pk_fmsmember = '';
    let pk_membeorg = '';
    let allMember = this.props.treeTableManyCol.getAllValue(rightTreeTable);
    if(allMember){
        let selectMember = this.props.treeTableManyCol.getSelectedRow(rightTreeTable);
        if(selectMember&&selectMember.length>0){
            pk_fmsmember = selectMember[0].rowId;
            pk_membeorg = selectMember[0].values.pk_org.value;
        }
    }
    ajax({
        url:"/nccloud/uapbd/org/ReportCSMemberImportSaveAction.do",
        method:"post",
        data:{orgs
            ,pk_system:pk,pk_sysvid:sysVRefPk,pk_fmsmember:pk_fmsmember,pk_membeorg:pk_membeorg,nodeType:this.props.nodeType},
        success:function(res){
            if(res.success){
                if(res.data){//返回全新的数据 刷新界面
                    //后台返回的是表格的数据  需要构造成树状表的数据
                    let datas =  that.props.treeTableManyCol.createNewData(res.data.memberTreeTable.rows);
                    //根据树状表的数据构造树表
                    that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                    that.props.treeTableManyCol.initTreeTableData(rightTreeTable,datas,'refpk');
                }else{
                    that.props.treeTableManyCol.emptyAllData(rightTreeTable);
                }
                that.props.modal.close(importModalId);
                that = null;
            }
        }
    });
}



getImportDialog(transferProps){
    return (
        <div id="org_transfer" className="steps-content" style={{height:'450px'}}>
            <Row  style={{marginBottom:'5px'}}>
                <Col md={4} xs={4} sm={4}>
                    {GroupDefaultTreeRef({}=this.createCfg("GroupDefaultTreeRef",{
                            value:{refpk:pk_importGroup,
                                refname:groupname
                            },
                            fieldid : 'GroupDefaultTreeRef',
                            queryCondition: function(){
                            return {
                                //此处可以添加参数
                                // isShowDisabledData: true,
                                // pk_reportcombinestru: this.props.syncTree.getSelectNode(leftTree).id
                            };
                        }.bind(this)
                    }))}
                </Col>
                <Col md={4} xs={4} sm={4}>
                    {OrgTypeGridRef({}=this.createCfg("OrgTypeGridRef",{
                            value:{refpk:pk_orgtypes,
                                refname:orgTypeName
                            },
                            fieldid : 'OrgTypeGridRef',
                            queryCondition: function(){
                            return {
                                //此处可以添加参数
                                GridRefActionExt:'nccloud.web.org.reportcombinestru.action.RCBSImportSqlBuilder'
                            };
                        }.bind(this)
                    }))}
                </Col>
                <Col>
                     <NCCheckbox id = 'orgShowDisable' 
                        onChange = {this.onCheckboxChange.bind(this,'orgShowDisable')}
                        checked = {showDisableOrg}
                        >{"显示停用"}</NCCheckbox>{/* 国际化处理： 显示停用*/}
                </Col>
            </Row>             
            {/* <Transfer  ref={(item)=>{this.orgTransfer = item}} showSearch={true} onBeforeEvent={this.beforeMoveHandler.bind(this)} /> */}
            <Transfer 

                TransferId={'importModalId'}  //id,必填
                leftTreeData={dataSource} 
                rightTreeData={[]}
                // value={this.state.firstStepOrgValue} 
                // oprType={this.state.oprType}
                />
             {/* <Transfer {...transferProps} /> */}
            <NCRadio.NCRadioGroup
                style={{textAlign:'center',width:'100%'}}
                name="oprType"
                selectedValue={this.state.oprType}
                onChange={this.handleOprTypeChange.bind(this)}>
                <NCRadio value="0" >{"包含所有下级"}</NCRadio>{/* 国际化处理： 包含所有下级*/}
                <NCRadio value="1" >{"仅自己"}</NCRadio>{/* 国际化处理： 仅自己*/}
                <NCRadio value="2" >{"仅直接下级"}</NCRadio>{/* 国际化处理： 仅直接下级*/}
                <NCRadio value="3" >{"仅末级"}</NCRadio>{/* 国际化处理： 仅末级*/}
            </NCRadio.NCRadioGroup>
        </div>
        
    );
}



    render() {
        let { form, syncTree, cardTable, modal, button, DragWidthCom,table,editTable } = this.props;
        let { createSyncTree } = syncTree;
        let { createForm } = form;
        let { createButtonApp } = button;
        let { createCardTable} = cardTable;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        const {creatrEditTable} = editTable;
        const { NCDiv } = base;
        let { createModal } = modal;
        
        const { dataSource, targetKeys } = this.state;
        const transferProps = {
            dataSource,
            targetKeys,
            rowKey: 'key', // 和默认值相同时可以不指定
            rowTitle: 'title',
            rowChildren: 'children',
            treeType: true,
            onTargetKeysChange: this.onTargetKeysChange,
            checkable: true,
            className: 'my-transfer-demo',
            showMoveBtn: true,
            listRender: ({ key, title }) => key + ' ' + title
        };


        this.props.orgTransfer = this.orgTransfer;
        return (


                <div className="nc-bill-tree-table">
                    {createModal('warning', {
                        title: this.state.json['10100CRSB-000019'],/* 国际化处理： 关闭提醒*/
                        content: this.state.json['10100CRSB-000020'],/* 国际化处理： 是否确定要关闭？*/
                    })}
                     {createModal('systemversion', {
                         title: '利润中心组版本化',// 弹框表头信息
                         content: ( 
                              <div> 
                                  <div className="table-area">
                                     {/* 体系版本按钮区  btn-group */}
                                     <div className="btn-group" style={{ padding: '5px', textAlign: 'right' }}>
                                         {createButtonApp({
                                             area: 'vers_head',
                                              buttonLimit: 3, 
                                              onButtonClick: this.headerButtonClick.bind(this), 
                                             popContainer: document.querySelector('.vers_head') ,
                                             
                                          })} 
                                      </div> 
                                    </div>
                                 {/* <div className="nc-singleTable-table-area">  */}
                                     {/* {createSimpleTable('systemversion', {
                                         showIndex: true, 
                                          showCheck: false, 
                                          hideSwitch: false, 
                                         adaptionHeight: true, 
                                        
                                          pkname: "code", 
                                    
                                       })}     */}
                                        <div>
                                    {this.props.editTable.createEditTable(sysVersionModalId,{
                                        showCheck:false,
                                        showIndex:true,
                                        // onAfterEvent: this.afterTableEvent.bind(this),
                                        // onSelected:this.onSelected.bind(this),
                                        // onSelectedAll:this.onSelectedAll.bind(this),
                                        // onRowClick:this.onClickVersion.bind(this)
                                        })}
                                </div>                             
                                  </div> 
                                //  </div>
                                
                               ) ,
                               hasCloseBtn : true,
                            noFooter : true,//不显示底部的确定、取消按钮
                                userControl:true,//自己控制什么时候关闭窗口
                            
                            }
            
                            )} 
                    



                {createModal('importModalId', {
                    title: "请选择要引入的组织",/* 国际化处理： 请选择要引入的组织*/
                    content: this.getImportDialog.bind(this)(transferProps),
                    userControl: true,//自己控制什么时候关闭窗口
                    beSureBtnClick: this.onImportSave.bind(this),
                    cancelBtnClick: () => {
                        this.props.modal.close(importModalId);
                        this.windowCloseListener('browse');
                    }
                }) }


                    {/*体系版本删除提示框*/}
                    {this.state.json['10100CRSB-000013'] && createModal(sysVersionDeleteModalId, {
                        title: this.state.json['10100CRSB-000013'],/* 国际化处理： 删除确认*/
                        content: this.state.json['10100CRSB-000014'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续删除？*/
                        userControl: true,//自己控制什么时候关闭窗口
                        beSureBtnClick: this.onSuerDeleteSysVersion.bind(this),
                        cancelBtnClick: () => { this.props.modal.close(sysVersionDeleteModalId) }
                    })}








                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className="header">
                        <span>
                            {createBillHeadInfo({
                                title: "利润中心结构",
                                initShowBackBtn: false
                            })}
                        </span>
                        <div className="demo-checkbox" style={{ marginTop: "-2px" }}>
                            <NCCheckbox colors="dark">显示停用</NCCheckbox>
                        </div>
                        <div className="btn-group">
                            {createButtonApp({
                                area: 'page_header',
                                onButtonClick: this.headerButtonClick.bind(this),
                                popContainer: document.querySelector('.btn-group')
                            })}
                        </div>
                    </div>
                </NCDiv>
                <div className="tree-card">
                    <DragWidthCom
                        leftDom={<div className="tree-area">
                            {
                                createSyncTree({
                                    clickEditIconEve: this.onEditSys.bind(this), //编辑点击 回调
                                    // treeId: 'leftTree',
                                    treeId:'leftTree',
                                    needSearch: true,
                                    needEdit: false,
                                    showLine: true,
                                    searchType: 'filtration',
                                    selectedForInit: true,
                                    onSelectEve: this.onSelectEve.bind(this),
                                    disabledSearch: false,
                                    hiddenDefaultIcon: false, //隐藏默认的文件夹图标
                                })
                            }
                        </div>}
                        rightDom={<div className="card-area">
                            {createForm('bcbd_header', {
                                onAfterEvent: afterHeadEvent.bind(this)
                            })}
                            {createCardTable('bcbd_body', {
                                showIndex: true,
                                showCheck: false,
                                hideSwitch: () => { return false },
                                tableHead: () => {
                                    return createButtonApp({
                                        area: 'tab_header',
                                        onButtonClick: this.headerButtonClick.bind(this),
                                        popContainer: document.querySelector('.light-tabs')
                                    })
                                },
                                onBeforeEvent: beforeEvent.bind(this),
                                onAfterEvent: afterEvent.bind(this)
                            })}
                        </div>}
                        defLeftWid='20%' />
                </div>
            </div>
        )
    }
}

Coderule = createPage({
    initTemplate: initTemplate,
})(Coderule);

ReactDOM.render(<Coderule />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65