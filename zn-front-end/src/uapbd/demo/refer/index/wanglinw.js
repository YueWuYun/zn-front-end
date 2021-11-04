//cnHJkFYJt+QTH9oFYd7dNEgODSOTMLIWtdhORrXOv9xC172Jt9kB9kAT6DHUlftL
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*财务核算账簿(财务组织)*/
//import AccountingBookByFinanceOrgGridTreeRef from '../../../refer/org/AccountingBookByFinanceOrgGridTreeRef'
/*采购组织*/
import PurchaseOrgDefaultGridRef from '../../../refer/org/PurchaseOrgGridRef'
/*采购组织(所有)*/
import PurchaseOrgDefaultAllGridRef from '../../../refer/org/PurchaseOrgAllGridRef'
/*采购组织版本*/
import PurchaseOrgVersionDefaultGridRef from '../../../refer/orgv/PurchaseOrgVersionGridRef'
/*采购组织版本(所有)*/
import PurchaseOrgVersionDefaultAllGridRef from '../../../refer/orgv/PurchaseOrgVersionAllGridRef'
/*业务场景*/
import OrgFuncListGridRef from '../../../refer/org/OrgFuncListGridRef'
/*业务单元+集团*/
import BusinessUnitAndGroupTreeRef from '../../../refer/org/BusinessUnitAndGroupTreeRef'
/*业务单元+集团(所有)*/
import BusinessUnitAndGroupTreeRef1 from '../../../refer/org/BusinessUnitAndGroupAllTreeRef'
/*业务单元+集团(所有)*/
import BusinessUnitAndGroupNCTreeRef from '../../../refer/org/BusinessUnitAndGroupNCTreeRef'
/*业务单元及部门*/
import BusinessUnitAndDeptTreeRef from '../../../refer/org/BusinessUnitAndDeptTreeRef'
/*业务单元及部门(所有)*/
import BusinessUnitAndDeptAllTreeRef from '../../../refer/org/BusinessUnitAndDeptAllTreeRef'
/*银行档案*/
import BankDocDefaultGridTreeRef from '../../../refer/bankacc/BankDocDefaultGridTreeRef'
/*银行类别*/
import BanktypeDefaultGridRef from '../../../refer/bankacc/BanktypeDefaultGridRef'
/*银行账户*/
import BankaccDefaultGridTreeRef from '../../../refer/bankacc/BankaccDefaultGridTreeRef'
/*预算统计体系成员*/
import BudgetStatStruMemberDefaultTreeRef from '../../../refer/org/BudgetStatStruMemberDefaultTreeRef'
/*预算组织*/
import PlanBudgetDefaultGridRef from '../../../refer/org/PlanBudgetDefaultGridRef'
/*运输方式*/
import TransportTypeGridRef from '../../../refer/transporttype/TransportTypeGridRef'
/*责任核算账簿*/
import LiabilityBookGridTreeRef from '../../../refer/org/LiabilityBookGridTreeRef'
/*账簿类型	*/
import SetOfBookGridRef from '../../../refer/org/SetOfBookGridRef'
/*资产组织	*/
import AssetOrgGridRef from '../../../refer/org/AssetOrgGridRef'
/*资产组织版本	*/
import AssetOrgVersionGridRef from '../../../refer/orgv/AssetOrgVersionGridRef'
/*业务单元版本（所有）	*/
import BusinessUnitVersionDefaultAllTreeRef from '../../../refer/orgv/BusinessUnitVersionDefaultAllTreeRef'

export default class Taxinfo extends Component {
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
                        <h2>王林</h2>
                    </Col>
                </Row>

                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                采购组织：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PurchaseOrgDefaultGridRef({} = this.createCfg('PurchaseOrgDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                采购组织(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PurchaseOrgDefaultAllGridRef({} = this.createCfg('PurchaseOrgDefaultAllGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                采购组织版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PurchaseOrgVersionDefaultGridRef({} = this.createCfg('PurchaseOrgVersionDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                采购组织版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PurchaseOrgVersionDefaultAllGridRef({} = this.createCfg('PurchaseOrgVersionDefaultAllGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务场景：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgFuncListGridRef({} = this.createCfg('OrgFuncListGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元+集团：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitAndGroupTreeRef({} = this.createCfg("BusinessUnitAndGroupTreeRef", {
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
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元+集团(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitAndGroupTreeRef1({} = this.createCfg("BusinessUnitAndGroupTreeRef1", {
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
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元+集团(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitAndGroupNCTreeRef({} = this.createCfg("BusinessUnitAndGroupNCTreeRef", {
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
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元及部门：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitAndDeptTreeRef({} = this.createCfg("BusinessUnitAndDeptTreeRef", {
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
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元及部门(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitAndDeptAllTreeRef({} = this.createCfg("BusinessUnitAndDeptAllTreeRef", {
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
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                银行档案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BankDocDefaultGridTreeRef({} = this.createCfg('BankDocDefaultGridTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                银行类别:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BanktypeDefaultGridRef({} = this.createCfg('BanktypeDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                银行账户:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BankaccDefaultGridTreeRef({} = this.createCfg('BankaccDefaultGridTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算统计体系成员:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BudgetStatStruMemberDefaultTreeRef({} = this.createCfg('BudgetStatStruMemberDefaultTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                预算组织:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PlanBudgetDefaultGridRef({} = this.createCfg('PlanBudgetDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                运输方式:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TransportTypeGridRef({} = this.createCfg('TransportTypeGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                责任核算账簿:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiabilityBookGridTreeRef({} = this.createCfg('LiabilityBookGridTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                账簿类型:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SetOfBookGridRef({} = this.createCfg('SetOfBookGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产组织:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetOrgGridRef({} = this.createCfg('AssetOrgGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产组织版本:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetOrgVersionGridRef({} = this.createCfg('AssetOrgVersionGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元版本（所有）:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitVersionDefaultAllTreeRef({} = this.createCfg('BusinessUnitVersionDefaultAllTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//cnHJkFYJt+QTH9oFYd7dNEgODSOTMLIWtdhORrXOv9xC172Jt9kB9kAT6DHUlftL