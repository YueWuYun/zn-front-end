//ElD6iWOWKqtK/cQJQzkK7y8ApocVDns6vxMwdFxtAuAjQ3zlqaiLOki7Z5NMUoZq
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*条件过滤器*/

import TrafficOrgGridRef from '../../../refer/org/TrafficOrgGridRef/index';

import TrafficOrgAllGridRef from '../../../refer/org/TrafficOrgAllGridRef/index';

import TrafficOrgVersionAllGridRef from '../../../refer/orgv/TrafficOrgVersionAllGridRef/index';

import TrafficOrgVersionGridRef from '../../../refer/orgv/TrafficOrgVersionGridRef/index';


import LiabilityCenterOrgTreeRef from '../../../refer/org/LiabilityCenterOrgTreeRef/index';

import LiabilityCenterOrgAllTreeRef from '../../../refer/org/LiabilityCenterOrgAllTreeRef/index';

import LiabilityCenterVersionTreeRef from '../../../refer/orgv/LiabilityCenterVersionTreeRef/index';

import LiabilityCenterVersionAllTreeRef from '../../../refer/orgv/LiabilityCenterVersionAllTreeRef/index';


import AccountBookTreeRef from '../../../refer/org/AccountBookTreeRef/index';
import AccountBookAllTreeRef from '../../../refer/org/AccountBookAllTreeRef/index';

import AccountBookByFinanceOrgRef from '../../../refer/org/AccountBookByFinanceOrgRef/index';
import AccountBookByFinanceOrgAllRef from '../../../refer/org/AccountBookByFinanceOrgAllRef/index';

export default class Taxinfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vals: {}
        }
    }

    createMZConfig(name) {
        return {
            onChange: (value) => {
                this.state.vals[name] = value;
                this.setState(this.state);
            },
            value: this.state.vals[name] || ''
        }
    }

    render() {
        return (
            <Col md={12} xs={12} sm={12}>
                <Row>
                    <Col md={12} xs={12} sm={12}>
                        <h2>马征</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务核算账簿
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountBookTreeRef(this.createMZConfig.bind(this)('AccountBookTreeRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务核算账簿(所有)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountBookAllTreeRef(this.createMZConfig.bind(this)('AccountBookAllTreeRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务核算账簿-财务组织
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountBookByFinanceOrgRef(this.createMZConfig.bind(this)('AccountBookByFinanceOrgRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务核算账簿-财务组织(所有)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountBookByFinanceOrgAllRef(this.createMZConfig.bind(this)('AccountBookByFinanceOrgAllRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                物流组织
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TrafficOrgGridRef(this.createMZConfig.bind(this)('TrafficOrgGridRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                物流组织(所有)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TrafficOrgAllGridRef(this.createMZConfig.bind(this)('TrafficOrgAllGridRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                物流版本组织
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TrafficOrgVersionGridRef(this.createMZConfig.bind(this)('TrafficOrgVersionGridRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                物流版本组织(所有)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TrafficOrgVersionAllGridRef(this.createMZConfig.bind(this)('TrafficOrgVersionAllGridRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                利润中心组织
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiabilityCenterOrgTreeRef(this.createMZConfig.bind(this)('LiabilityCenterOrgTreeRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                利润中心组织(所有)
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiabilityCenterOrgAllTreeRef(this.createMZConfig.bind(this)('LiabilityCenterOrgAllTreeRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                利润中心版本组织
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiabilityCenterVersionTreeRef(this.createMZConfig.bind(this)('LiabilityCenterVersionTreeRef'))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                利润中心版本组织(所有)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiabilityCenterVersionAllTreeRef(this.createMZConfig.bind(this)('LiabilityCenterVersionAllTreeRef'))}
                            </Col>
                        </Row>
                    </Col>
                </Row >
            </Col >
        )
    }
};
//ElD6iWOWKqtK/cQJQzkK7y8ApocVDns6vxMwdFxtAuAjQ3zlqaiLOki7Z5NMUoZq