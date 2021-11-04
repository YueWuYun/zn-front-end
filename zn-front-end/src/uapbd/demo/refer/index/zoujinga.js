//mLcsuvuzQH6WbQq4O0BqnlM2uPXfYhxSVx6K7BicKrbt0Lzap0lPVjMvrDaPUruD
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*利润中心成本域*/
import LiactCostrgDefaultGridRef from '../../../refer/riaorgbd/LiactCostrgDefaultGridRef';
/*利润中心体系版本*/
import LiabilityCenterStruVersionGridRef from '../../../refer/orgv/LiabilityCenterStruVersionGridRef/index'
/*利润中心体系版本(所有)*/
import LiabilityCenterStruVersionAllGridRef from '../../../refer/orgv/LiabilityCenterStruVersionAllGridRef/index'
/*维修组织体系成员*/
import MOrgStruMemberTreeRef from '../../../refer/org/MOrgStruMemberTreeRef/index'
/*维修组织体系成员版本*/
import MOrgStruMemberVersionTreeRef from '../../../refer/orgv/MOrgStruMemberVersionTreeRef/index'
/*物料税类*/
import MattaxesGridRef from '../../../refer/material/MattaxesGridRef/index'
/*现金账户*/
import CashAccountGridRef from '../../../refer/sminfo/CashAccountGridRef/index'
/*现金折扣方案*/
import RateSchemaDefaultGridRef from '../../../refer/sminfo/RateSchemaDefaultGridRef/index'
/*税码税率*/
import TaxcodeDefaultGridRef from '../../../refer/pub/TaxcodeDefaultGridRef/index'
/*要素表*/
import FactorChartTreeRef from '../../../refer/fiacc/FactorChartTreeRef/index';
/*要素表(集团)*/
import FactorChartWithGroupTreeRef from '../../../refer/fiacc/FactorChartWithGroupTreeRef/index';
/*要素类型*/
import ElementTypeGridRef from '../../../refer/fiacc/ElementTypeGridRef/index';
/*要素体系*/
import ElementSystemGridRef from '../../../refer/fiacc/ElementSystemGridRef/index';

export default class Zoujinga extends Component {
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
                        <h2>邹静</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                利润中心成本域:
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiactCostrgDefaultGridRef({} = this.createCfg("LiactCostrgDefaultGridRef", {
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
                                利润中心体系版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiabilityCenterStruVersionGridRef({} = this.createCfg("LiabilityCenterStruVersionGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                利润中心体系版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {LiabilityCenterStruVersionAllGridRef({} = this.createCfg("LiabilityCenterStruVersionAllGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                维修组织体系成员：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MOrgStruMemberTreeRef({} = this.createCfg("MOrgStruMemberTreeRef", {
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
                                            pk_morgstru: "1002AD1000000000029Z"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                维修组织体系成员版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MOrgStruMemberVersionTreeRef({} = this.createCfg("MOrgStruMemberVersionTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            pk_svid: "0001AD10000000000D5P"
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                物料税类：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MattaxesGridRef({} = this.createCfg("MattaxesGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                现金账户：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CashAccountGridRef({} = this.createCfg("CashAccountGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                现金折扣方案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {RateSchemaDefaultGridRef({} = this.createCfg("RateSchemaDefaultGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                税码税率：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TaxcodeDefaultGridRef({} = this.createCfg("TaxcodeDefaultGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                要素表：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FactorChartTreeRef({} = this.createCfg("FactorChartTreeRef", {
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
                                            pk_factorsystem: '1002Z31000000000011U',
                                            pk_org: ''
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                要素表(集团)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FactorChartWithGroupTreeRef({} = this.createCfg("FactorChartWithGroupTreeRef", {
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
                                            // pk_elementsystem :'1002Z31000000000011U',
                                            pk_org: ''
                                        };
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                要素类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ElementTypeGridRef({} = this.createCfg("ElementTypeGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                要素体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ElementSystemGridRef({} = this.createCfg("ElementSystemGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
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
//mLcsuvuzQH6WbQq4O0BqnlM2uPXfYhxSVx6K7BicKrbt0Lzap0lPVjMvrDaPUruD