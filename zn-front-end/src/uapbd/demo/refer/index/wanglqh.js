//CJa0AzxR/yKv05EEtqdfWoT4lWD8+BpzHGgZ07WSRwPmRhIC7vwYVx48wM6gm3NB
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';


const { NCCol: Col, NCRow: Row } = base;


/*科目表*/
import AccChartTreeRef from '../../../refer/fiacc/AccChartTreeRef/index';
/*科目表(跨集团)*/
import AccChartWithGroupTreeRef from '../../../refer/fiacc/AccChartWithGroupTreeRef/index';
/*科目控制规则*/
import AccCtrlRuleGridRef from '../../../refer/fiacc/AccCtrlRuleGridRef/index';
/*科目体系*/
import AccSystemGridRef from '../../../refer/fiacc/AccSystemGridRef/index';
/*科目类型*/
import AccTypeGridRef from '../../../refer/fiacc/AccTypeGridRef/index';
/*科目表独立参照*/
import AccountSelfMDGridRef from '../../../refer/fiacc/AccountSelfMDGridRef/index';
/*库存统计体系*/
import StockStatStruGridRef from '../../../refer/org/StockStatStruGridRef/index';
/*库存统计体系(所有)*/
import StockStatStruAllGridRef from '../../../refer/org/StockStatStruAllGridRef/index';
/*库存统计体系成员*/
import StockStatStruMemberDefaultTreeRef from '../../../refer/org/StockStatStruMemberDefaultTreeRef/index';
/*库存统计体系成员关联信息*/
import StockStatStruMemberRelOrgTreeRef from '../../../refer/org/StockStatStruMemberRelOrgTreeRef/index';
/*开户组织账户参照*/
import BankaccDefaultTreeGridRef from '../../../refer/pubinfo/BankaccDefaultTreeGridRef/index'
/*供应商档案*/
import SupplierRefTreeGridRef from '../../../refer/supplier/SupplierRefTreeGridRef/index'
/*供应商基本分类*/
import SupplierClassTreeRef from '../../../refer/supplier/SupplierClassTreeRef/index'
/*币种档案*/
import CurrtypeGridRef from '../../../refer/pubinfo/CurrtypeGridRef/index'
/*个人银行账户*/
import PsnbankaccGridRef from '../../../refer/pubinfo/PsnbankaccGridRef/index'
/*工厂版本*/
import FactoryVersionGridRef from '../../../refer/orgv/FactoryVersionGridRef/index'
/*工厂版本(所有)*/
import FactoryVersionAllGridRef from '../../../refer/orgv/FactoryVersionAllGridRef/index'
/*客商档案*/
import CustSupplierFlexGridTreeRef from '../../../refer/supplier/CustSupplierFlexGridTreeRef/index'
/*等级体系*/
import SupplierGradeSysGridRef from '../../../refer/supplier/SupplierGradeSysGridRef/index'


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
                        <h2>王立奇</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                科目表：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccChartTreeRef(
                                    {} = this.createCfg("AccChartTreeRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                科目表(跨集团)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccChartWithGroupTreeRef(
                                    {} = this.createCfg("AccChartTreeRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                科目控制规则：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccCtrlRuleGridRef(
                                    {} = this.createCfg("AccCtrlRuleGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                科目体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccSystemGridRef(
                                    {} = this.createCfg("AccSystemGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                科目类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccTypeGridRef(
                                    {} = this.createCfg("AccTypeGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                科目表独立参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountSelfMDGridRef(
                                    {} = this.createCfg("AccountSelfMDGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                库存统计体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StockStatStruGridRef(
                                    {} = this.createCfg("StockStatStruGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                库存统计体系(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StockStatStruAllGridRef(
                                    {} = this.createCfg("StockStatStruAllGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                库存统计体系成员：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StockStatStruMemberDefaultTreeRef(
                                    {} = this.createCfg("StockStatStruMemberDefaultTreeRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                库存统计体系成员关联信息：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StockStatStruMemberRelOrgTreeRef(
                                    {} = this.createCfg("StockStatStruMemberRelOrgTreeRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                开户组织账户参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BankaccDefaultTreeGridRef(
                                    {} = this.createCfg("BankaccDefaultTreeGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                供应商档案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SupplierRefTreeGridRef(
                                    {} = this.createCfg("SupplierRefTreeGridRef", {
                                        isShowUnit: true,
                                        queryCondition: function () {
                                            return {
                                                "pk_org": "0001HR100000000005M3"
                                            }
                                        },
                                        unitPropsExtend: { isShowDisabledData: true, isHasDisabledData: true },
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                供应商基本分类：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SupplierClassTreeRef(
                                    {} = this.createCfg("SupplierClassTreeRef", {
                                        isShowUnit: false
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                币种档案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CurrtypeGridRef(
                                    {} = this.createCfg("CurrtypeGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                个人银行账户：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PsnbankaccGridRef(
                                    {} = this.createCfg("PsnbankaccGridRef", {
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                工厂版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FactoryVersionGridRef(
                                    {} = this.createCfg("FactoryVersionGridRef", {
                                        isShowUnit: true,
                                        isShowDisabledData: true,
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                工厂版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FactoryVersionAllGridRef(
                                    {} = this.createCfg("FactoryVersionAllGridRef", {
                                        isShowUnit: true,
                                        isShowDisabledData: true,
                                    })
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客商档案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustSupplierFlexGridTreeRef({} = this.createCfg("CustSupplierFlexGridTreeRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                等级体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SupplierGradeSysGridRef({} = this.createCfg("SupplierGradeSysGridRef", {
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//CJa0AzxR/yKv05EEtqdfWoT4lWD8+BpzHGgZ07WSRwPmRhIC7vwYVx48wM6gm3NB