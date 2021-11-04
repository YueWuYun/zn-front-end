//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
import { initTemplate, headerButtonClick, beforeEvent, afterEvent, afterHeadEvent } from '../card/events';
import './index.less';
const { NCCol: Col, NCRow: Row, NCFormControl, NCDatePicker, NCButton, NCPanel, NCCheckbox, NCPopconfirm, NCRadio, NCDiv } = base;
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

class ProfitcenterstrucCard extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            oprType: '0',
            isShowSeal: false,
            json: {},
            nodeType: 'GROUP_NODE',
            options: [],
            loginfo: {},
            refs: {},
            dataSource: [],
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
        // this.getLoginfo();
        this.showTreeData(false);
        // this.setbtnstatus();
        // this.queryoptions();
        this.props.button.setButtonDisabled({ 'add': false });
    }

    showTreeData(isShowSeal) {
        debugger
        let _this = this;
        let pk_pfconstruct = this.props.getUrlParam('pk_pfconstruct');
        ajax({
            loading: true,
            url: '/nccloud/uapbd/profitcenterstruc/TreeQuery.do',
            data: {
                pk_pfconstruct: pk_pfconstruct,
                isShowSeal: isShowSeal
            },
            success: function (res) {
                debugger
                if (res.success) {
                    _this.props.syncTree.setSyncTreeData('leftTree', res.data);

                } else {
                    toast({ content: res.message, color: "danger" });
                }
            },
            error: function (res) {

            }
        });
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


    render() {
        let { form, syncTree, cardTable, modal, button, DragWidthCom, table, editTable } = this.props;
        let { createSyncTree } = syncTree;
        let { createForm } = form;
        let { createButtonApp } = button;
        let { createCardTable } = cardTable;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        const { creatrEditTable } = editTable;
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
                                        onButtonClick: headerButtonClick.bind(this),
                                        popContainer: document.querySelector('.vers_head'),

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
                                {this.props.editTable.createEditTable(sysVersionModalId, {
                                    showCheck: false,
                                    showIndex: true,
                                    // onAfterEvent: this.afterTableEvent.bind(this),
                                    // onSelected:this.onSelected.bind(this),
                                    // onSelectedAll:this.onSelectedAll.bind(this),
                                    // onRowClick:this.onClickVersion.bind(this)
                                })}
                            </div>
                        </div>
                        //  </div>

                    ),
                    hasCloseBtn: true,
                    noFooter: true,//不显示底部的确定、取消按钮
                    userControl: true,//自己控制什么时候关闭窗口

                }

                )}




                {createModal('importModalId', {
                    title: "请选择要引入的组织",/* 国际化处理： 请选择要引入的组织*/
                    // content: this.getImportDialog.bind(this)(transferProps),
                    userControl: true,//自己控制什么时候关闭窗口
                    // beSureBtnClick: this.onImportSave.bind(this),
                    cancelBtnClick: () => {
                        this.props.modal.close(importModalId);
                        this.windowCloseListener('browse');
                    }
                })}


                {/*体系版本删除提示框*/}
                {this.state.json['10100CRSB-000013'] && createModal(sysVersionDeleteModalId, {
                    title: this.state.json['10100CRSB-000013'],/* 国际化处理： 删除确认*/
                    content: this.state.json['10100CRSB-000014'],/* 国际化处理： 删除基础数据要做业务引用检查，非常耗时，建议使用封存功能，是否继续删除？*/
                    userControl: true,//自己控制什么时候关闭窗口
                    // beSureBtnClick: this.onSuerDeleteSysVersion.bind(this),
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
                                onButtonClick: headerButtonClick.bind(this),
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
                                    treeId: 'leftTree',
                                    needSearch: true,
                                    needEdit: true,
                                    showLine: true,
                                    searchType: 'filtration',
                                    selectedForInit: true,
                                    // onSelectEve: this.onSelectEve.bind(this),
                                    disabledSearch: false,
                                    hiddenDefaultIcon: false, //隐藏默认的文件夹图标
                                })
                            }
                        </div>}
                        rightDom=
                        {
                            <div className="card-area card-right">
                                <div className="nc-bill-form-area">
                                    {createForm('pfcgroup', {
                                        onAfterEvent: afterHeadEvent.bind(this)
                                    })}
                                </div>
                                <div className="nc-bill-table-area">
                                    {createCardTable('pfcg_pfc', {
                                        showIndex: true,
                                        showCheck: false,
                                        hideSwitch: () => { return false },
                                        tableHead: () => {
                                            return createButtonApp({
                                                area: 'tab_header',
                                                onButtonClick: headerButtonClick.bind(this),
                                                popContainer: document.querySelector('.light-tabs')
                                            })
                                        },
                                        onBeforeEvent: beforeEvent.bind(this),
                                        onAfterEvent: afterEvent.bind(this)
                                    })}
                                </div>
                            </div>
                        }
                        defLeftWid='20%' />
                </div>
            </div>
        )
    }
}

ProfitcenterstrucCard = createPage({
    initTemplate: initTemplate,
})(ProfitcenterstrucCard);

ReactDOM.render(<ProfitcenterstrucCard />, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65