//CeetJal9mrjGuBNZ9OkQG4dwiHlD3ZN/+I1Qkfhjf58bZtUVof6+PdFa/IieV8so
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*会计半年*/
import AccperiodHalfYearGridTreeRef from '../../../refer/fiacc/AccperiodHalfYearGridTreeRef/index';
/*会计季度*/
import AccperiodQuarterGridTreeRef from '../../../refer/fiacc/AccperiodQuarterGridTreeRef/index';
/*会计辅助核算项目*/
import AccAssItemGridRef from '../../../refer/fiacc/AccAssItemGridRef/index';
/*核算要素(财务组织)*/
import Factor4FinancialTreeRef from '../../../refer/fiacc/Factor4FinancialTreeRef/index';
/*核算要素组*/
import FactorGroupGridRef from '../../../refer/fiacc/FactorGroupGridRef/index';
/*物料基本分类*/
import MaterialBasClassTreeRef from '../../../refer/material/MaterialBasClassTreeRef/index'
/*物料采购分类*/
import MaterialPuClassTreeRef from '../../../refer/material/MaterialPuClassTreeRef/index'
/*物料销售分类*/
import MaterialSaleClassTreeRef from '../../../refer/material/MaterialSaleClassTreeRef/index'
/*物料版本*/
import MaterialVersionGridRef from '../../../refer/material/MaterialVersionGridRef/index'
/*海关商品编码*/
import GoodscodeGridRef from '../../../refer/material/GoodscodeGridRef/index'
/*部门*/
import DeptTreeRef from '../../../refer/org/DeptTreeRef/index'
/*核算账簿(所有)*/
import AccountBookAllGridRef from '../../../refer/org/AccountBookAllGridRef/index'
/*核算账簿*/
import AccountBookGridRef from '../../../refer/org/AccountBookGridRef/index'
/*行政组织(所有)*/
import AdminOrgTreeRef from '../../../refer/org/AdminOrgTreeRef/index'
/*行政组织结构(包含集团)*/
import AOSOrgGroupTreeRef from '../../../refer/org/AOSOrgGroupTreeRef/index'
/*行政组织结构(组织)*/
import AOSOrgTreeRef from '../../../refer/org/AOSOrgTreeRef/index'
/*行政组织结构*/
import AOSTreeRef from '../../../refer/org/AOSTreeRef/index'
/*行政组织版本*/
import AdminOrgVersionTreeRef from '../../../refer/orgv/AdminOrgVersionTreeRef/index'
/*行政组织版本(所有)*/
import AdminOrgVersionAllTreeRefv from '../../../refer/orgv/AdminOrgVersionAllTreeRef/index'
/*核算归属权*/
import BankaccSubDefaultGridTreeRef from '../../../refer/pub/BankaccSubDefaultGridTreeRef/index'

export default class Xuehaoc extends Component {
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
                        <h2>薛豪</h2>
                    </Col>
                </Row>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            会计辅助核算项目：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AccAssItemGridRef({} = this.createCfg("AccAssItemGridRef", {}))}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            会计半年：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AccperiodHalfYearGridTreeRef({} = this.createCfg("AccperiodHalfYearGridTreeRef", {
                                "pid": "",
                                "keyword": "",
                                "pageInfo": {
                                    "pageIndex": 0,
                                    "pageSize": 10,
                                    "totalPage": "0"
                                },
                                queryCondition: function () {
                                    return {
                                        "pk_accperiodscheme": "0001Z000000000000001",
                                    }
                                }
                            }))}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            会计季度：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AccperiodQuarterGridTreeRef({} = this.createCfg("AccperiodQuarterGridTreeRef", {
                                "pid": "",
                                "keyword": "",
                                "pageInfo": {
                                    "pageIndex": 0,
                                    "pageSize": 10,
                                    "totalPage": "0"
                                },
                                queryCondition: function () {
                                    return {
                                        "pk_accperiodscheme": "0001Z000000000000001",
                                    }
                                }
                            }))}
                        </Col>

                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            核算要素(财务组织)：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {Factor4FinancialTreeRef({} = this.createCfg("Factor4FinancialTreeRef", {
                                queryCondition: function () {
                                    return {
                                        "pk_factorchart": "1002Z310000000000120",
                                    }
                                }
                            }))}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            核算要素组：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {FactorGroupGridRef({} = this.createCfg("FactorGroupGridRef", {
                                queryCondition: function () {
                                    return {
                                        "pk_factorchart": "1002Z310000000000120",
                                    }
                                }
                            }))}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            物料基本分类：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {MaterialBasClassTreeRef(
                                {} = this.createCfg("MaterialBasClassTreeRef", {
                                    //参数
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "0001HR100000000005M3"
                                        };
                                    }
                                })
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            物料采购分类：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {MaterialPuClassTreeRef(
                                {} = this.createCfg("MaterialPuClassTreeRef", {
                                    //参数
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "0001HR100000000005M3"
                                        };
                                    }
                                })
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            物料销售分类：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {MaterialSaleClassTreeRef(
                                {} = this.createCfg("MaterialSaleClassTreeRef", {
                                    //参数
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "0001HR100000000005M3"
                                        };
                                    }
                                })
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            物料版本：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {MaterialVersionGridRef(
                                {} = this.createCfg("MaterialVersionGridRef", {
                                    //参数
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "0001HR100000000005M3"
                                        };
                                    }
                                })
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            海关商品编码：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {GoodscodeGridRef({} = this.createCfg("GoodscodeGridRef", {}))}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            部门：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {DeptTreeRef({
                                queryCondition: function () {
                                    return {
                                        //此处可以添加参数
                                        isShowDisabledData: true,
                                        pk_org: "0001HR10000000002MD5"
                                    };
                                }
                            })}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            核算账簿(所有)：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AccountBookAllGridRef({})}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            核算账簿：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AccountBookGridRef({})}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            行政组织(所有)：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AdminOrgTreeRef({})}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            行政组织结构(包含集团)：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AOSOrgGroupTreeRef({})}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            行政组织结构(组织)：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AOSOrgTreeRef({})}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            行政组织结构：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AOSTreeRef(
                                {} = this.createCfg("AOSTreeRef", {
                                    //参数
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,

                                        };
                                    }
                                })
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            行政组织版本：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AdminOrgVersionTreeRef(
                                {} = this.createCfg("AdminOrgVersionTreeRef", {
                                    //参数
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                        };
                                    }
                                })
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            行政组织版本(所有)：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {AdminOrgVersionAllTreeRefv(
                                {} = this.createCfg("AdminOrgVersionAllTreeRefv", {
                                    //参数
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                        };
                                    }
                                })
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col md={4} xs={4} sm={4}>
                    <Row>
                        <Col md={4} xs={4} sm={4}>
                            核算归属权：
                        </Col>
                        <Col md={8} xs={8} sm={8}>
                            {BankaccSubDefaultGridTreeRef(
                                {} = this.createCfg("BankaccSubDefaultGridTreeRef", {
                                    //参数
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            isShowDisabledData: true,
                                            pk_org: "0001HR100000000005M3",
                                            orgType: "orgtype4"
                                        };
                                    }
                                })
                            )}
                        </Col>
                    </Row>
                </Col>
            </Col>
        )
    }
};
//CeetJal9mrjGuBNZ9OkQG4dwiHlD3ZN/+I1Qkfhjf58bZtUVof6+PdFa/IieV8so