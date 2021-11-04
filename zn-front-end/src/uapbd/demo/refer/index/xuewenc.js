//uRH6F6cbMD53mbkVg4xMVh3ahRAF7tH013s00W10qIwttTCZ2d3yoYRamOVYqjJY
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*客户收货地址*/
import CustAddressGridRef from '../../../refer/customer/CustAddressGridRef/index'
/*客户税类*/
import CustaxesGridRef from '../../../refer/customer/CustaxesGridRef/index'
/*客户物料码*/
import CustMaterialGridRef from '../../../refer/customer/CustMaterialGridRef/index'
/*客户销售分类*/
import CustSaleClassTreeRef from '../../../refer/customer/CustSaleClassTreeRef/index'
/*人员类别*/
import PsnclTreeRef from '../../../refer/psninfo/PsnclTreeRef/index';
/*人员*/
import PsndocTreeGridRef from '../../../refer/psninfo/PsndocTreeGridRef/index';
/*使用权参照*/
import BankaccSubUseTreeGridRef from '../../../refer/pub/BankaccSubUseTreeGridRef/index'
/*收款时点*/
import IncomePeriodGridRef from '../../../refer/sminfo/IncomePeriodGridRef/index'
/*收款类型*/
import RectypeGridRef from '../../../refer/sminfo/RectypeGridRef/index'
/*收付款类型*/
import RecPaytypeGridRef from '../../../refer/sminfo/RecPaytypeGridRef/index'
/*收支项目*/
import InoutBusiClassTreeRef from '../../../refer/fiacc/InoutBusiClassTreeRef/index';
/*现金流量项目*/
import CashflowTreeRef from '../../../refer/fiacc/CashflowTreeRef/index';
/*税收地区*/
import TaxregionGridRef from '../../../refer/taxinfo/TaxregionGridRef/index'


export default class Xuewenc extends Component {
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
                        <h2>薛文</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客户收货地址：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustAddressGridRef(
                                    {} = this.createCfg("CustAddressGridRef", {
                                        queryCondition: function () {
                                            return {
                                                "pk_org": "0001HR100000000005M3",
                                                "pk_customer": "1002AD100000000001JO"
                                            }
                                        }
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客户税类：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustaxesGridRef(
                                    {} = this.createCfg("CustaxesGridRef", {})
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客户物料码：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustMaterialGridRef(
                                    {} = this.createCfg("CustMaterialGridRef", {})
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客户销售分类：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustSaleClassTreeRef({} = this.createCfg("CustSaleClassTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            "pk_org": "0001HR100000000005M3"
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                人员类别：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PsnclTreeRef({} = this.createCfg("PsnclTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            "pk_org": "0001HR10000000002MD5"
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                600069人员参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PsndocTreeGridRef({} = this.createCfg("PsndocTreeGridRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "isShowUnit": true,
                                    isShowDisabledData: true,
                                    isShowDimission: true,
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            // "pk_org": "0001HR10000000002MD5"
                                        }
                                    },
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                使用权参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BankaccSubUseTreeGridRef({} = this.createCfg("BankaccSubUseTreeGridRef", {
                                    queryCondition: function () {
                                        return {
                                            "pk_org": "0001HR10000000002MD5",
                                            "refnodename": "使用权参照",
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                收款时点：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {IncomePeriodGridRef(
                                    {} = this.createCfg("IncomePeriodGridRef", {
                                        queryCondition: function () {
                                            return {
                                                "pk_org": "0001HR10000000002MD5"
                                            }
                                        }
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                收款类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {RectypeGridRef(
                                    {} = this.createCfg("RectypeGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                收付款类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {RecPaytypeGridRef(
                                    {} = this.createCfg("RecPaytypeGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                收支项目：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {InoutBusiClassTreeRef({} = this.createCfg("InoutBusiClassTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            "pk_org": "GLOBLE00000000000000"
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                现金流量项目：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CashflowTreeRef({} = this.createCfg("CashflowTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            //"pk_org": "0001HR10000000002MD5"
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                税收地区：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TaxregionGridRef(
                                    {} = this.createCfg("TaxregionGridRef", {
                                        //参数
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//uRH6F6cbMD53mbkVg4xMVh3ahRAF7tH013s00W10qIwttTCZ2d3yoYRamOVYqjJY