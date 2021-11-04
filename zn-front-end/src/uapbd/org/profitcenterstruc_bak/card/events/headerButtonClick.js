//q/BnXiNAKNv5ujGVOAfUTkdHWpVXd3hv81rIszrLtz+DUJkWrdpIOcYXlxYCFADd
import { createPage, base, ajax, toast, promptBox } from 'nc-lightapp-front';
import Transfer from '../../../../public/excomponents/Transfer';

let sysVersionModalId = 'systemversion';//体系版本化模态框
let formId = 'sysForm';//体系--编辑formid
let sysVersionStatus = 'browse';
let rightTreeTable = 'memberTreeTable'//成员--右树表id
let importModalId = 'importModalId';//引入对话框id

export default function (props, id) {
    let _this = this;
    let { orgTransfer } = props;
    switch (id) {
        case 'add':
            let sn = _this.props.syncTree.getSelectNode('ruletree');
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
            setPageStatus('add', _this);
            _this.props.syncTree.setNodeDisable('ruletree', true);
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
            break;
        case 'AddVersion':
            onAddVersion(this);
            break;
        case 'EditVersion':
            onEditVersion(this);
            break;
        case 'DelVersion':
            onDelVersion(this);
            break;
        case 'SaveVersion':
            onVersionSave(this);
            break;
        case 'RefreshV':
            onRefreshVersion(this, 'RefreshV');
            this.props.button.setButtonDisabled('DelVersion', true);
            break;
        case 'CancelVersion':
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: "确认取消",/* 国际化处理： 确认取消*/
                content: "是否确认要取消",/* 国际化处理： 是否确认要取消？*/
                beSureBtnClick: () => {
                    onRefreshVersion(this);
                    windowCloseListener('browse');
                }
            })
            break;
        case 'edit':
            _this.pagestatus = 'edit';
            setPageStatus('edit', _this);
            _this.props.syncTree.setNodeDisable('ruletree', true);
            break;
        //版本化
        case 'version':
            onCreatVersion(_this);
            break;
        case 'del':
            UpdateCodeRuleStatus(_this, '/nccloud/bcbd/coderule/delete.do', _this.state.json['coderule-000000']/*您确定要删除所选数据吗?*/,
                _this.props.form.getFormItemsValue('bcbd_header', 'pk_barcoderule').value);
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
            onImportClick(_this,orgTransfer);
            break;
        case 'Enable':
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: "提示",/* 国际化处理： 提示*/
                content: "确定要启用该数据吗?",/* 国际化处理： 确定要启用该数据吗？*/
                beSureBtnClick: () => {
                    onEnable(this)
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
                    findFormDataByNode(_this);
                    _this.props.syncTree.setNodeDisable('ruletree', false);
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
//设置子表的起始位置和长度
function setStartpos(_this, viewstatus) {
    let allrows = _this.props.cardTable.getAllRows('bcbd_body');
    if (!allrows || allrows.length <= 0) {
        if (viewstatus && viewstatus == 'add') {
            _this.props.cardTable.addRow('bcbd_body', _this.props.cardTable.getNumberOfRows('bcbd_body'), {
                'startpos': { value: '1', display: '1' },
                'isparseretrieve': { value: true }
            });
        }
        return;
    }
    let viewrows = [];
    for (var index = 0; index < allrows.length; index++) {
        if (allrows[index].status != '3') {
            viewrows.push(allrows[index]);
        }
    }
    if (!viewrows || viewrows.length <= 0) {
        if (viewstatus && viewstatus == 'add') {
            _this.props.cardTable.addRow('bcbd_body', _this.props.cardTable.getNumberOfRows('bcbd_body'), {
                'startpos': { value: '1', display: '1' },
                'isparseretrieve': { value: true }
            });
        }
        return;
    }
    for (var i = 0; i < viewrows.length; i++) { //根据起始位置进行排序
        for (var j = 0; j < viewrows.length - i - 1; j++) {
            if (viewrows[j + 1].values.startpos.value < viewrows[j].values.startpos.value) {
                var temp;
                temp = viewrows[j];
                viewrows[j] = viewrows[j + 1];
                viewrows[j + 1] = temp;
            }
        }
    }
    viewrows[0].values.startpos = { value: "1", display: "1" };//按照起始位置排序后给第一条可见的数据的起始位置赋值为1
    var currentstartpos = parseInt(viewrows[0].values.startpos.value) + parseInt(viewrows[0].values.length.value);
    if (viewrows.length > 1) {
        for (var index = 1; index < viewrows.length; index++) {
            var startpos;
            if (viewrows[index - 1].values.length.value) {
                startpos = parseInt(viewrows[index - 1].values.startpos.value) + parseInt(viewrows[index - 1].values.length.value);
            } else {
                startpos = parseInt(viewrows[index - 1].values.startpos.value);
            }
            viewrows[index].values.startpos = { value: startpos, display: startpos };
            if (viewstatus && viewstatus == 'add' && index == viewrows.length - 1) {
                if (viewrows[index].values.length.value) {
                    currentstartpos = startpos + parseInt(viewrows[index].values.length.value);
                } else {
                    currentstartpos = startpos;
                }
            }
        }
    }
    if (viewstatus && viewstatus == 'add') {
        _this.props.cardTable.addRow('bcbd_body', _this.props.cardTable.getNumberOfRows('bcbd_body'), {
            'startpos': { value: currentstartpos, display: currentstartpos },
            'isparseretrieve': { value: true }
        });
    }
}

function updateCodeRuleInfo(_this, pageType) {
    if (_this.props.form.isCheckNow('bcbd_header')) {
        // _this.props.cardTable.filterEmptyRows('bcbd_body');
        if (_this.props.cardTable.getNumberOfRows('bcbd_body') <= 0) {
            toast({ color: 'danger', content: _this.state.json['coderule-000005']/*表体长度之和不等于表头总长度!*/ });
            return;
        }
        let tabdata = _this.props.cardTable.getAllRows('bcbd_body');
        if (!_this.props.cardTable.checkTableRequired('bcbd_body')) {
            return;
        }
        let allength = _this.props.form.getFormItemsValue('bcbd_header', 'length').value;
        let tllength = 0;
        for (let index = 0; index < tabdata.length; index++) {
            if (tabdata[index].status != '3') {//删除的行不算入长度检验
                tllength = parseInt(tllength) + parseInt(tabdata[index].values.length.value);
            }
        }
        if (parseInt(allength) != tllength) {
            toast({ color: 'danger', content: _this.state.json['coderule-000005']/*表体长度之和不等于表头总长度!*/ });
            return;
        }
        let isgencode = false;
        if (_this.props.form.getFormItemsValue('bcbd_header', 'isgencode') && _this.props.form.getFormItemsValue('bcbd_header', 'isgencode').value) {
            isgencode = true;
        }
        if (pageType == 'edit' && isgencode) {//编辑生成新版本询问
            _this.props.ncmodal.show('ncmodal', {
                title: <span className='nc-theme-common-font-c'>{_this.state.json['coderule-000010']/*是否保存为新版本,否则将覆盖旧版本?*/}</span>,
                beSureBtnClick: saveCodeRule.bind(_this, _this, pageType, true),
                cancelBtnClick: saveCodeRule.bind(_this, _this, pageType, false)
            });
        } else {
            saveCodeRule(_this, pageType, false);//新增或者不生成新版本的
        }
    }
}

function saveCodeRule(_this, pageType, isnewversion) {
    let data = {
        bcbd_header: { bcbd_header: _this.props.form.getAllFormValue('bcbd_header') },
        bcbd_body: { bcbd_body: _this.props.cardTable.getAllData('bcbd_body') },
        opt: pageType,
        isnewversion: isnewversion
    };
    ajax({
        url: '/nccloud/bcbd/coderule/save.do',
        data: data,
        success: (res) => {
            if (res && res.data) {
                if (res.data.status) {
                    _this.props.syncTree.cancelSelectedNode('ruletree');
                    if (pageType == 'add' || isnewversion) {
                        _this.props.syncTree.addNodeSuccess('ruletree', res.data.node[0]);
                    } else if (pageType == 'edit') {
                        _this.props.syncTree.editNodeSuccess('ruletree', res.data.node[0]);
                    }
                    _this.props.syncTree.setNodeSelected('ruletree', res.data.node[0].id);
                    _this.onSelectEve(res.data.node[0].id, res.data.node[0], true);
                    _this.props.syncTree.setNodeDisable('ruletree', false);
                    setPageStatus('browse', _this);
                    toast({ color: 'success' });
                } else {
                    toast({ color: 'danger', content: res.data.message });
                }
            }
        }
    });
}

//版本化
function onCreatVersion(that, btn) {
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
    that.props.modal.show(sysVersionModalId);
    //   _this.props.editTable.setTableData(sysVersionModalId,{rows:[]});
    _this.props.editTable.setTableData(sysVersionModalId, data[sysVersionModalId]);
    setVerButtonSat('browse', _this);
    if (btn === 'RefreshV') {
        toast({ color: 'success', title: "刷新成功" });/* 国际化处理： 刷新成功！*/
    }
}




function UpdateCodeRuleStatus(_this, url, title, pk_barcoderule, optcode) {
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

function findFormDataByNode(_this, optcode) {
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

function setPageStatus(status, _this) {
    _this.props.form.setFormStatus('bcbd_header', status);
    _this.props.cardTable.setStatus('bcbd_body', status);
    if (status == 'browse') {
        _this.props.button.setButtonsVisible(['add', 'edit', 'del', 'startUp', 'blockUp', 'setDefault'], true);
        _this.props.button.setButtonsVisible(['save', 'cancel'], false);
    } else {
        _this.props.button.setButtonVisible(['add', 'edit', 'del', 'startUp', 'blockUp', 'setDefault'], false);
        _this.props.button.setButtonVisible(['save', 'cancel'], true);
        _this.props.button.setButtonDisabled(['addrow', 'delrow'], false);
    }
}



function onAddVersion(that) {
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

            }

            ],


        }

    }
    that.props.editTable.setTableData(sysVersionModalId, data[sysVersionModalId]);
    _this.props.editTable.addRow(sysVersionModalId);
    // _this.props.editTable.addRow('sysVersionModalId', 2, { creationtime: { value: "2020-02-10 16:51:34" }}, true);
    setVerButtonSat('edit', _this);
    _this = null;
}



function setVerButtonSat(status, tthis) {
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

function windowCloseListener(uiStatus) {
    if (uiStatus === 'browse') {
        window.onbeforeunload = null;
    } else {
        window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
            return '';
        };
    }
}

function onEditVersion(bian) {
    // this.onSysVersionStatusChange('edit');
    setVerButtonSat('edit', bian);
}


function onRefreshVersion(tant, btn) {
    onCreatVersion(tant, btn);
}


function onDelVersion(dev) {
    let _this = dev;
    let rowNum = _this.props.editTable.getNumberOfRows(sysVersionModalId);
    if (rowNum === 1) {
        toast({ color: 'warning', content: "请选择数据" });
        return;
    }
    let ind = _this.props.editTable.getClickRowIndex(sysVersionModalId);
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


function onSuerDeleteSysVersion(pk_vid, ts, _this) {
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

function onRefreshVersion(btn) {
    onCreatVersion(btn);
}


function onVersionSave(save) {
    let that = save;
    let checkData = that.props.editTable.getAllRows(sysVersionModalId);

    let newData = [];
    checkData.map((ele) => {
        newData.push(ele.data);
    });
    let data = {
        // pageid:'10100RCSVersion_list',
        pageid: that.props.nodePageCode,
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
    that.props.editTable.setTableData(sysVersionModalId, data[sysVersionModalId]);
    setVerButtonSat('browse', save);
    toast({ color: 'success', title: that.state.json['10100CRSB-000005'] });/* 国际化处理： 保存成功！*/
    that = null;

}
//启用
function onEnable(able) {
    let that = able;
    // let selectNode = that.props.syncTree.getSelectNode(leftTree);

    let data = { nodeType: that.props.nodeType };
    that.props.button.setButtonDisabled(['Enable'], true);
    that.props.button.setButtonDisabled(['Disable'], false);
    //更新树节点
    let treeData = dealTreeData();
    // that.props.syncTree.editNodeSuccess(leftTree, treeData);
    toast({ color: 'success', title: "启用成功" });/* 国际化处理： 启用成功！*/
    that = null;
}

function dealTreeData() {
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


function onImportClick(por,orgTransfer) {
    let _this = por;
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

    let that = _this;
    that.props.modal.show(importModalId);
    orgTransfer.setRootTitle( "华锦集团"+'-' + "业务单元")
    orgTransfer.setMoveType(that.state.oprType);
}

function onImportDataLoad(_this) {
    let that = _this;
    that.props.modal.show(importModalId);
    orgTransfer.setRootTitle( "华锦集团"+'-' + "业务单元")
    orgTransfer.setMoveType(that.state.oprType);

}

//q/BnXiNAKNv5ujGVOAfUTkdHWpVXd3hv81rIszrLtz+DUJkWrdpIOcYXlxYCFADd