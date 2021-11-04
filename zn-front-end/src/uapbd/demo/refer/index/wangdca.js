//s+CqXD6FV4mm5gxjWnT7Pv1P67CzBsWgR1ANdRjyqgU0IvungwF677Ee1U3VAnVH
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*国家地区EX*/
import CountryExDefaultGridRef from '../../../refer/pubinfo/CountryExDefaultGridRef/index'
/*国家地区*/
import CountryDefaultGridRef from '../../../refer/pubinfo/CountryDefaultGridRef/index'
/*会计年度*/
import AccperiodYearTreeGridRef from '../../../refer/pubinfo/AccperiodYearTreeGridRef/index'
/*会计年度列表*/
import PeriodYearItemGridRef from '../../../refer/pubinfo/PeriodYearItemGridRef/index'
/*会计期间方案*/
import AccPeriodSchemeDefaultTreeRef from '../../../refer/pubinfo/AccPeriodSchemeDefaultTreeRef/index'
/*会计期间月份*/
import AccperiodMonthTreeGridRef from '../../../refer/pubinfo/AccperiodMonthTreeGridRef/index'
/*货位*/
import RackDefaultTreeRef from '../../../refer/busiinfo/RackDefaultTreeRef/index'
/*交易代码*/
import TransactioncodeGridRef from '../../../refer/busiinfo/TransactioncodeGridRef/index'
/*结算方式*/
import BalanceTypeGridRef from '../../../refer/sminfo/BalanceTypeGridRef/index'
/*结算中心版本*/
import SettleCenterVersionTreeRef from '../../../refer/sminfo/SettleCenterVersionTreeRef/index'
/*信用控制域*/
import CreditCtlRegionGridRef from '../../../refer/org/CreditCtlRegionGridRef/index'
/*信用控制域（所有）*/
import CreditCtlRegionAllDataGridRef from '../../../refer/org/CreditCtlRegionAllDataGridRef/index'
/*银行账户子户*/
import BankaccSubGridTreeRef from '../../../refer/sminfo/BankaccSubGridTreeRef/index'
/*报表合并体系(多版本)*/ 
import ReportCombineStruVersionGridRef from '../../../refer/orgv/ReportCombineStruVersionGridRef/index'
export default class Wangdca extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configs: {}
        }
    }

    render() {
        return (
            <Col md={12} xs={12} sm={12}>
                <Row>
                    <Col md={12} xs={12} sm={12}>
                        <h2>王德臣</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                国家地区EX：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CountryExDefaultGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                国家地区：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CountryDefaultGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计年度：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccperiodYearTreeGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计年度列表：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PeriodYearItemGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计期间方案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccPeriodSchemeDefaultTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计期间月份：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccperiodMonthTreeGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                货位：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {RackDefaultTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                交易代码：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TransactioncodeGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                结算方式：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BalanceTypeGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                结算中心版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SettleCenterVersionTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                信用控制域：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CreditCtlRegionGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                信用控制域（所有）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CreditCtlRegionAllDataGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                银行账户子户：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BankaccSubGridTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表合并体系(多版本)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportCombineStruVersionGridRef({})}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//s+CqXD6FV4mm5gxjWnT7Pv1P67CzBsWgR1ANdRjyqgU0IvungwF677Ee1U3VAnVH