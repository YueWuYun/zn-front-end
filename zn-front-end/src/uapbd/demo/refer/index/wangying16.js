//Vc4Bs/0mGBB7Hr6We8TzV3l2c+ukRK56FaaZK7sLCIRub1DBnhqP/1VK0Oo9Xcrk
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*报表组织*/
import ReportOrgDefaultGridRef from '../../../refer/org/ReportOrgDefaultGridRef/index';
/*报表组织所有 */
import ReportOrgDefaultAllGridRef from '../../../refer/org/ReportOrgDefaultAllGridRef/index';
/*部门结构体系版本 */
import DeptStruVersionGridRef from '../../../refer/orgv/DeptStruVersionGridRef/index';
/*部门结构体系版本(所有) */
import DeptStruVersionAllGridRef from '../../../refer/orgv/DeptStruVersionAllGridRef/index';
/*财务组织(所有集团) */
import FinanceOrgByAllGroupTreeRef from '../../../refer/org/FinanceOrgByAllGroupTreeRef/index';
/*税务组织*/
import TaxOrgTreeRef from '../../../refer/org/TaxOrgTreeRef/index';
/*特征类 */
import FClassGridRef from '../../../refer/mm/FClassGridRef/index';
/*计划策略组*/
import PlanStrategyGroupGridRef from '../../../refer/mm/PlanStrategyGroupGridRef/index';
/* 部门(所有)*/
import DeptNCAllDataTreeRef from '../../../refer/org/DeptNCAllDataTreeRef/index';
/*月结检查项类别 */
import CheckTypeGridRef from '../../../refer/org/CheckTypeGridRef/index';
export default class Wangying16 extends Component {
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
                        <h2>汪颖</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表组织：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportOrgDefaultGridRef({} = this.createCfg("ReportOrgDefaultGridRef", {
                                    isShowUnit: true,
                                    queryCondition: function () {
                                        return {
                                            isAddEnableStateWherePart: true
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                特征类：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FClassGridRef({} = this.createCfg("FClassGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表组织(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportOrgDefaultAllGridRef({} = this.createCfg("ReportOrgDefaultAllGridRef", {
                                    isShowUnit: true,
                                    queryCondition: function () {
                                        return {
                                            isAddEnableStateWherePart: false
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                计划策略组：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PlanStrategyGroupGridRef({} = this.createCfg("PlanStrategyGroupGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                部门结构体系版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DeptStruVersionGridRef({} = this.createCfg("DeptStruVersionGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                部门(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DeptNCAllDataTreeRef({} = this.createCfg("DeptNCAllDataTreeRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                部门结构体系版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DeptStruVersionAllGridRef({} = this.createCfg("DeptStruVersionAllGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                月结检查项类别：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CheckTypeGridRef({} = this.createCfg("CheckTypeGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织(所有集团)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgByAllGroupTreeRef({} = this.createCfg("FinanceOrgByAllGroupTreeRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                税务组织
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TaxOrgTreeRef({} = this.createCfg("TaxOrgTreeRef", {
                                    isShowUnit: true,
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//Vc4Bs/0mGBB7Hr6We8TzV3l2c+ukRK56FaaZK7sLCIRub1DBnhqP/1VK0Oo9Xcrk