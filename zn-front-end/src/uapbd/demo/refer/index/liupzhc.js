//MlxdJ6njtLf00JVMfaLpNYDJ28rxXObtrEFGy9p5pnjNi2HDEPVMJisQHNQcG+4Z
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row, NCButton } = base;

import { conf as unitProps } from '../../../refer/org/StockOrgGridRef/index';

/*会计科目*/
import AccountDefaultGridTreeRef from '../../../refer/fiacc/AccountDefaultGridTreeRef/index';
/*带有体系的会计科目*/
import AccountModelWithSystemGridRef from '../../../refer/fiacc/AccountModelWithSystemGridRef/index';
/*带有科目表过滤的会计科目*/
import AccountDefaultModelWithModelInOrgTreeRef from '../../../refer/fiacc/AccountDefaultModelWithModelInOrgTreeRef/index';

import StorDocDefaulteGridRef from '../../../refer/stordoc/StorDocDefaulteGridRef/index';

import ProdLineDefaultGridRef from '../../../refer/prodline/ProdLineDefaultGridRef/index';

import SupplierGradeTreeGridRefer from '../../../refer/supplier/SupplierGradeTreeGridRef/index';
export default class Taxinfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configs: {},
            multi: null,
            single: null,

        }
    }

    createCfg(id, param) {
        var obj = {
            value: this.state.configs[id] ? this.state.configs[id].value : [],
            onChange: function (val) {
                var temp = Object.assign(this.state.configs[id], { value: val });
                this.setState(Object.assign(this.state.configs, temp));
            }.bind(this)
        }
        this.state.configs[id] = obj;
        var result_param = Object.assign(obj, param)
        return result_param;
    }
    render() {
        return (
            <Col md={12} xs={12} sm={12}>
                <Row>
                    <Col md={12} xs={12} sm={12}>
                        <h2>刘平章</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} xs={12} sm={12}>
                        <h4>会计科目参照注意：需要在queryCondition对象中传递两个参数 pk_accountingbook和dateStr 其中pk_accountingbook必须设置</h4>
                        <h4>仓库参照注意：需要在queryCondition对象中传递一个参数 pk_org  必须设置</h4>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计科目:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountDefaultGridTreeRef({} = this.createCfg("AccountDefaultGridTreeRef", {

                                    "pid": "root",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": -1,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            isAddEnableStateWherePart: true,

                                            "pk_accountingbook": "1002AD1000000000006O",
                                            //"pk_accountingbook":"10064510000000003I3X"
                                            // "pk_accountingbook":"1001LL10000000005J3Z",
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>

                            <Col md={4} xs={4} sm={4}>
                                带科目表过滤的会计科目:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountDefaultModelWithModelInOrgTreeRef({} = this.createCfg(" AccountDefaultModelWithModelInOrgTreeRef", {

                                    "pid": "root",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": -1,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            isAddEnableStateWherePart: true,
                                            "pk_accountingbook": "1002AD1000000000006O"
                                            // "pk_accountingbook":"10064510000000003I3X"
                                            //"pk_accountingbook":"1001A3100000000000PQ",
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                带有体系的会计科目:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountModelWithSystemGridRef({} = this.createCfg("AccountModelWithSystemGridRef", {
                                    queryCondition: function () {
                                        return {
                                            isAddEnableStateWherePart: true,
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                产品线参照:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ProdLineDefaultGridRef({} = this.createCfg("ProdLineDefaultGridRef", {
                                    queryCondition: function () {
                                        return {
                                            isAddEnableStateWherePart: true,
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                仓库参照:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StorDocDefaulteGridRef({} = this.createCfg("StorDocDefaulteGridRef", {
                                    isShowUnit: false,// true 显示组织切换  false 不显示组织切换
                                    queryCondition: function () {
                                        return {
                                            // "pk_org": "0001HR10000000002MD5", //6001 通信总部
                                            //
                                            // GridRefActionExt:'nccloud.web.uapbd.ref.stordoc.StorDocExtSqlBuilder'

                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计科目参照(单选):
                            </Col>

                            <Col md={8} xs={8} sm={8}>
                                {AccountDefaultGridTreeRef({} = this.createCfg("AccountDefaultGridTreeRef", {
                                    isMultiSelectedEnabled: false,
                                    queryCondition: {
                                        "pk_accountingbook": "1002AD1000000000006O", //6001 通信总部
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计科目参照(单选):
                            </Col>

                            <Col md={8} xs={8} sm={8}>
                                <AccountDefaultGridTreeRef
                                    placeholder={'会计科目'}
                                    refName={'会计科目'}
                                    refCode={'code'}
                                    rootNode={{ refname: '会计科目', refpk: 'root' }}
                                    queryTreeUrl={'/nccloud/uapbd/ref/AccountDefaultReferModelRef.do'}
                                    queryCondition={{ pk_accountingbook: "1002AD1000000000006O" }}
                                    refType={'gridTree'}
                                    value={this.state.single}
                                    onChange={(val) => {
                                        console.log(val);
                                        this.setState({
                                            single: val
                                        });
                                    }}
                                    columnConfig={[
                                        {
                                            name: ['编码', '名称'],
                                            code: ['refcode', 'refname']
                                        }
                                    ]}
                                    isMultiSelectedEnabled={false}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计科目参照(多选):

                            </Col>

                            <Col md={8} xs={8} sm={8}>
                                <AccountDefaultGridTreeRef
                                    placeholder={'会计科目'}
                                    refName={'会计科目'}
                                    refCode={'code'}
                                    rootNode={{ refname: '会计科目', refpk: 'root' }}
                                    queryTreeUrl={'/nccloud/uapbd/ref/AccountDefaultReferModelRef.do'}
                                    queryCondition={{ pk_accountingbook: "1002AD1000000000006O" }}
                                    refType={'gridTree'}
                                    value={this.state.multi}
                                    onChange={(val) => {
                                        console.log(val);
                                        this.setState({
                                            multi: val
                                        });
                                    }}
                                    columnConfig={[
                                        {
                                            name: ['编码', '名称'],
                                            code: ['refcode', 'refname']
                                        }
                                    ]}
                                    isMultiSelectedEnabled={true}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                供应商等级参照:
                            </Col>
                            <Col md={8} xs={8} sm={8}>

                                {SupplierGradeTreeGridRefer({} = this.createCfg("SupplierGradeTreeGridRefer", {
                                    queryCondition: function () {
                                        return {
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//MlxdJ6njtLf00JVMfaLpNYDJ28rxXObtrEFGy9p5pnjNi2HDEPVMJisQHNQcG+4Z