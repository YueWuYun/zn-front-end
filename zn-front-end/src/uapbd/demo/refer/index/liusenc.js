//3ubf0K/RCq6kv4PVL5gW6id33dMjqWmfR+ag3jP5huv60fRvtzLSSCUq7zo4AcpD
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*成本中心组*/
import CostCenterGroupGridRef from '../../../refer/fiacc/CostCenterGroupGridRef/index'
/*带有体系的核算要素*/
import FactorRefModelWithSystemGridRef from '../../../refer/fiacc/FactorRefModelWithSystemGridRef/index'
/* 对应总账户参照 */
import BankaccDefaultTreeGridRef from '../../../refer/pub/BankaccDefaultTreeGridRef/index'
/*付款时点 */
import PayPeriodDefaultGridRef from '../../../refer/pub/PayPeriodDefaultGridRef'
/*付款协议 */
import PaymentDefaultGridRef from '../../../refer/pub/PaymentDefaultGridRef'
/*工作日历 */
//import WorkCalendarDefaultGridRef from '../../../refer/pub/WorkCalendarDefaultGridRef'
/*工作日历规则 */
//import WorkCalendarRuleDefaultGridRef from '../../../refer/pub/WorkCalendarRuleDefaultGridRef'
/*供应商税类 */
import SuptaxesGridRef from '../../../refer/pub/SuptaxesGridRef'
/*公司（所有） */
import CorpDefaultAllTreeRef from '../../../refer/org/CorpDefaultAllTreeRef'
/*公司版本*/
import CorpVersionTreeRef from '../../../refer/orgv/CorpVersionTreeRef/index'
/*公司所有 */
import CorpDefaultForOrgUnitAllTreeRef from '../../../refer/org/CorpDefaultForOrgUnitAllTreeRef'
/*岗位(所有)*/
import PostDefaultAllGridRef from '../../../refer/org/PostDefaultAllGridRef'
/*岗位 */
import PostDefaultGridRef from '../../../refer/org/PostDefaultGridRef'
/*岗位序列（所有） */
import PostSeriesDefaultAllTreeRef from '../../../refer/org/PostSeriesDefaultAllTreeRef'
/*业务单元(所有)*/
import BusinessUnitAllTreeRef from '../../../refer/org/BusinessUnitAllTreeRef'
/*项类型参照*/
import ProjectTypeGridRef from "../../../refer/pm/ProjectTypeGridRef/index"
/*项类组织版本参照*/
import ItemOrgVersionDefaultTreeRef from "../../../refer/pm/ItemOrgVersionDefaultTreeRef/index"
/*项目参照*/
import ProjectDefaultTreeGridRef from '../../../refer/pm/ProjectDefaultTreeGridRef/index'

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
                        <h2>刘森</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                项目：
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ProjectDefaultTreeGridRef({} = this.createCfg("ProjectDefaultTreeGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    /*
                                    queryCondition: function(){
                                        return {
                                            isDisabledDataShow:'true',

                                        }
                                    }*/
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                项目组织版本：
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ItemOrgVersionDefaultTreeRef({} = this.createCfg("ItemOrgVersionDefaultTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            isDisabledDataShow: 'true',
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                项目类型参照：
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ProjectTypeGridRef({} = this.createCfg("ProjectTypeGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            isDisabledDataShow: 'true',
                                            pk_org: '0001HR100000000005M3',

                                        }
                                    }
                                }))}
                            </Col>
                        </Row>

                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                成本中心组：
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CostCenterGroupGridRef({} = this.createCfg("CostCenterGroupGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            isDisabledDataShow: 'true',
                                            pk_group: '0001HR1000000000033B',
                                            pk_org: '0001HR10000000002MD5',
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                带有体系的核算要素：
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FactorRefModelWithSystemGridRef({} = this.createCfg("FactorRefModelWithSystemGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            pk_factorsystem: '1002Z31000000000011U'
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>

                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                对应总账户参照:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BankaccDefaultTreeGridRef({} = this.createCfg("BankaccDefaultTreeGridRef", {
                                    queryCondition: function () {
                                        return {
                                            pk_org: '0001HR100000000005M3',
                                            isDisabledDataShow: 'true',
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                付款时点:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PayPeriodDefaultGridRef({} = this.createCfg("PayPeriodDefaultGridRef", {
                                    queryCondition: function () {
                                        return {
                                            isDisabledDataShow: 'true',

                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                付款协议:
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PaymentDefaultGridRef({} = this.createCfg("PaymentDefaultGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                供应商税类:
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SuptaxesGridRef({} = this.createCfg("SuptaxesGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>


                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                岗位(所有):
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PostDefaultAllGridRef({} = this.createCfg("PostDefaultAllGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                岗位:
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PostDefaultGridRef({} = this.createCfg("PostDefaultGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                岗位序列(所有):
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PostSeriesDefaultAllTreeRef({} = this.createCfg("PostSeriesDefaultAllTreeRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                公司(所有):
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CorpDefaultAllTreeRef({} = this.createCfg("CorpDefaultAllTreeRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                公司版本:
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CorpVersionTreeRef({} = this.createCfg("CorpVersionTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            isDisabledDataShow: 'true',

                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                公司所有:
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CorpDefaultForOrgUnitAllTreeRef({} = this.createCfg("CorpDefaultForOrgUnitAllTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            isDisabledDataShow: 'true',

                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元(所有):
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitAllTreeRef({} = this.createCfg("BusinessUnitAllTreeRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//3ubf0K/RCq6kv4PVL5gW6id33dMjqWmfR+ag3jP5huv60fRvtzLSSCUq7zo4AcpD