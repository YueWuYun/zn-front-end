//kSGzbruJQMk3V8gwRTp+32yCk4otPLxcueJqCUzz+r4ASSl9iwmOM+75xmCSY9Q6
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;

/*管控范围*/
import ControlAreaGridRef from '../../../refer/fiacc/ControlAreaGridRef/index';
/*贸易术语*/
import IncotermGridRef from '../../../refer/pub/IncotermGridRef/index'
/*预算组织(所有)*/
import PlanBudgetAllDefaultGridRef from '../../../refer/org/PlanBudgetAllDefaultGridRef/index'
/*预算组织体系*/
import BudgetOrgStruGridRef from '../../../refer/org/BudgetOrgStruGridRef/index'
/*预算组织体系(所有)*/
import BudgetOrgStruAllGridRef from '../../../refer/org/BudgetOrgStruAllGridRef/index'
/*预算组织体系成员*/
import BudgetOrgStruMemberTreeRef from '../../../refer/org/BudgetOrgStruMemberTreeRef/index'
/*账簿合并体系*/
import BookCombineStruGridRef from '../../../refer/org/BookCombineStruGridRef/index'
/*账簿合并体系(多版本)*/
import BookCombineStruMultiVersionGridRef from '../../../refer/orgv/BookCombineStruMultiVersionGridRef/index'
/*责任核算账簿(所有)*/
import LiabilityBookAllGridTreeRef from '../../../refer/org/LiabilityBookAllGridTreeRef/index'
/*预算组织版本*/
import PlanBudgetVersionDefaultGridRef from '../../../refer/orgv/PlanBudgetVersionDefaultGridRef/index'
/*预算组织版本(所有)*/
import PlanBudgetVersionDefaultAllGridRef from '../../../refer/orgv/PlanBudgetVersionDefaultAllGridRef/index'
/*预算组织体系版本*/
import BudgetOrgStruVersionGridRef from '../../../refer/orgv/BudgetOrgStruVersionGridRef/index'
/*预算组织体系版本(所有)*/
import BudgetOrgStruVersionAllGridRef from '../../../refer/orgv/BudgetOrgStruVersionAllGridRef/index'
/*内部客商*/
import InnerCustSupplierGridTreeRef from '../../../refer/supplier/InnerCustSupplierGridTreeRef/index'
/*证件类型*/
import PsnidDefaultGridRef from '../../../refer/pub/PsnidDefaultGridRef/index'

// 质检中心
import QcCenterDefaultGridRef from '../../../refer/org/QcCenterDefaultGridRef/index'

// 质检中心版本
import QcCenterVersionGridRef from '../../../refer/orgv/QcCenterVersionGridRef/index'

export default class Zhangwxf extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configs: {}
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
                        <h2>张炜雪</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                管控范围：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ControlAreaGridRef({} = this.createCfg("ControlAreaGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                贸易术语：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {IncotermGridRef({} = this.createCfg("IncotermGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PlanBudgetAllDefaultGridRef({} = this.createCfg("PlanBudgetAllDefaultGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BudgetOrgStruGridRef({} = this.createCfg("BudgetOrgStruGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "GLOBLE00000000000000"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织体系(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BudgetOrgStruAllGridRef({} = this.createCfg("BudgetOrgStruAllGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "GLOBLE00000000000000"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织体系成员：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BudgetOrgStruMemberTreeRef({} = this.createCfg("BudgetOrgStruMemberTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            //pk_bos :"100745100000000001SZ"
                                            pk_bos: "1002AD100000000001JR"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                账簿合并体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BookCombineStruGridRef({} = this.createCfg("BookCombineStruGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                账簿合并体系（多版本）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BookCombineStruMultiVersionGridRef({} = this.createCfg("BookCombineStruMultiVersionGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            //pk_bookcombinestru :"1001LL10000000007LEA"
                                            pk_bookcombinestru: "1002AD1000000000029W"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                责任核算账簿(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiabilityBookAllGridTreeRef({} = this.createCfg("LiabilityBookAllGridTreeRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PlanBudgetVersionDefaultGridRef({} = this.createCfg("PlanBudgetVersionDefaultGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PlanBudgetVersionDefaultAllGridRef({} = this.createCfg("PlanBudgetVersionDefaultAllGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织体系版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BudgetOrgStruVersionGridRef({} = this.createCfg("BudgetOrgStruVersionGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织体系版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BudgetOrgStruVersionAllGridRef({} = this.createCfg("BudgetOrgStruVersionAllGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                内部客商：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {InnerCustSupplierGridTreeRef({} = this.createCfg("InnerCustSupplierGridTreeRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                证件类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PsnidDefaultGridRef({} = this.createCfg("PsnidDefaultGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                质检中心：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {QcCenterDefaultGridRef({} = this.createCfg("QcCenterDefaultGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                质检中心版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {QcCenterVersionGridRef({} = this.createCfg("QcCenterVersionGridRef", {
                                    isShowUnit: true,
                                    isShowDisabledData: true,
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//kSGzbruJQMk3V8gwRTp+32yCk4otPLxcueJqCUzz+r4ASSl9iwmOM+75xmCSY9Q6