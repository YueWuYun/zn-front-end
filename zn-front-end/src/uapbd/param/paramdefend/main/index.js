//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, createPageIcon, toast, high } from 'nc-lightapp-front';
// import { Row, Col } from 'tinper-bee';
import { initTemplate, headerButtonClick } from '../events';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
import RoleRefer from '../../../../uap/refer/riart/roleRefer/index';
import OrgAndOrgTypeCompositeOnlyEnableDataTreeRef from '../../../refer/org/OrgAndOrgTypeCompositeOnlyEnableDataTreeRef/index';
const { NCRow, NCCol } = base;
require("./index.less");
class ParamDefend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foolRole: {},
            foolOrg: {},
            json: {},
            disabled: false
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
        this.props.MultiInit.getMultiLang({ 'moduleId': '10120PARA', 'domainName': 'uapbd', callback });
    }

    componentDidMount() {
        this.loadTree();
        this.initPageStatus(true);
    }

    componentDidUpdate() {
        let status = this.props.editTable.getStatus('paramdef');
        if (status && status != 'browse') {
            window.onbeforeunload = () => { return '' };
        } else {
            window.onbeforeunload = null;
        }
    }

    initPageStatus(status) {
        this.props.editTable.setStatus('paramdef', status ? 'browse' : 'edit');
        this.props.button.setButtonsVisible(['assignment', 'refresh'], status);
        this.props.button.setButtonsVisible(['save', 'cancel', 'sell', 'canll'], !status);
        this.setState({
            disabled: !status
        });
    }

    changeRole(role, foolValue) {
        this.setState({
            foolRole: foolValue
        })
        if (!role || !foolValue || !foolValue.value) {
            this.setState({
                foolOrg: { value: '', display: '' }
            });
            this.loadTableData();
        }

    }

    changeOrg(org, foolValue) {
        this.setState({
            foolOrg: foolValue
        });
        this.loadTableData(this.props.syncTree.getSelectNode('paramdeftree'), foolValue.value, this.state.foolRole.value);
    }

    focus() {
        if (!(this.state.foolRole && this.state.foolRole.value)) {
            toast({ content: this.state.json['10120PARA-000014'], color: 'warning' });/* 国际化处理： 请选择角色*/
            return false;
        }
        return true;
    }

    loadTree(way) {
        let _this = this;
        ajax({
            loading: true,
            url: '/nccloud/uapbd/paramdefend/tree.do',
            success: (res) => {
                if (res && res.data) {
                    _this.props.syncTree.setSyncTreeData('paramdeftree', res.data);
                } else {
                    _this.props.syncTree.setSyncTreeData('paramdeftree', []);
                }
                if (way && way == 'refresh') toast({ color: 'success', content: _this.state.json['10120PARA-000018'] });
            }
        })

    }

    onSelectEve(pk, item, isChange) {
        let _this = this;
        if (_this.state.foolOrg
            && _this.state.foolOrg.value
            && _this.state.foolRole
            && _this.state.foolRole.value) {
            this.loadTableData(item, _this.state.foolOrg.value, _this.state.foolRole.value);
        }
    }

    loadTableData(item, pk_org, pk_role) {
        let _this = this;
        if (pk_org && pk_role) {
            ajax({
                loading: true,
                url: '/nccloud/uapbd/paramdefend/queryByNode.do',
                data: {
                    nodeData: item.nodeData,
                    pk_org: pk_org,
                    pk_role: pk_role
                },
                success: (res) => {
                    if (res && res.data && res.data.paramdef) {
                        _this.props.editTable.setTableData('paramdef', res.data.paramdef);
                    } else {
                        _this.props.editTable.setTableData('paramdef', { rows: [] });
                    }
                }
            })
        } else {
            _this.props.editTable.setTableData('paramdef', { rows: [] });
        }
    }

    render() {
        let { editTable, syncTree, ncmodal, button, DragWidthCom, BillHeadInfo } = this.props;
        let { createSyncTree } = syncTree;
        const { NCDiv } = base;
        const { createBillHeadInfo } = BillHeadInfo;
        let { createButtonApp } = button;
        let { createEditTable } = editTable;
        const {disTreeSearch} = this.state;
        return (
            <div className="nc-bill-tree-card param-defend">
                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className="header">
                        {createBillHeadInfo({
                            title: this.state.json['10120PARA-000015'],/* 国际化处理： 参数维护权*/
                            initShowBackBtn: false
                        })}
                        <NCRow fieldid='pararoledefrow'>
                            <NCCol md={6} fieldid='pararoledefrole'>
                                <i className="required-param">*</i>
                                <RoleRefer
                                    fieldid='pararoledef'
                                    isMultiSelectedEnabled={false}
                                    foolValue={this.state.foolRole}
                                    onChange={this.changeRole.bind(this)}
                                    placeholder={this.state.json['10120PARA-000016']/* 国际化处理： 角色*/}
                                    disabled={this.state.disabled}
                                    queryCondition={{ TreeRefActionExt: 'nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder' }}
                                />
                            </NCCol>
                            <NCCol md={6} fieldid='pararoledeforg'>
                                <i className="required-param">*</i>
                                <OrgAndOrgTypeCompositeOnlyEnableDataTreeRef
                                    fieldid='paradef'
                                    foolValue={this.state.foolOrg}
                                    onChange={this.changeOrg.bind(this)}
                                    placeholder={this.state.json['10120PARA-000017']/* 国际化处理： 组织单元*/}
                                    disabled={this.state.disabled || !(this.state.foolRole && this.state.foolRole.value)}
                                    onFocus={this.focus.bind(this)}
                                    queryCondition={{ TreeRefActionExt: 'nccloud.web.rbac.authres.sqlbuilder.AuthResOrgPermSqlBuilder' }}
                                />
                            </NCCol>
                        </NCRow>
                        <div className="btn-group">
                            {this.props.button.createButtonApp({
                                area: 'page_header',
                                onButtonClick: headerButtonClick.bind(this),
                                popContainer: document.querySelector('.btn-group')
                            })}
                        </div>
                    </div>
                </NCDiv>
                <div className="tree-table">
                    <DragWidthCom
                        leftDom={<div className="tree-area">
                            {createSyncTree({
                                treeId: 'paramdeftree',
                                showLine: true,
                                needSearch: true,
                                needEdit: false,
                                searchType: 'filtration',
                                selectedForInit: true,
                                onSelectEve: this.onSelectEve.bind(this),
                                disabledSearch: disTreeSearch || false
                            })}
                        </div>}
                        rightDom={<div className="table-area">
                            <div className='nc-single-table'>
                                <div className='nc-singleTable-table-area'>
                                    {createEditTable('paramdef', {
                                        showIndex: true,
                                        height: 465
                                    })}
                                </div>
                            </div>
                        </div>}
                        defLeftWid='20%' />
                </div>
            </div >
        )
    }
}
let ParamView = createPage({
    initTemplate: initTemplate
})(ParamDefend);

ReactDOM.render(<ParamView />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65