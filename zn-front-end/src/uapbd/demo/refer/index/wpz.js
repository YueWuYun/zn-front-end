//k5GFZAsPLYUL6fO5RcbANN8P0muiTj+Ga9Dma2pTZLMiNoXO830g5o0aEldXWpLk
﻿import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;

/*财务组织*/
import FinanceOrgTreeRef from '../../../refer/org/FinanceOrgTreeRef/index'

/*财务组织(所有)*/
import FinanceOrgAllDataTreeRef from '../../../refer/org/FinanceOrgAllDataTreeRef/index'

// 财务组织(所有集团)(所有)
import FinanceOrgAllGroupAllDataTreeRef from '../../../refer/org/FinanceOrgAllGroupAllDataTreeRef/index'

// 财务组织版本
import FinanceOrgVersionTreeRef from '../../../refer/orgv/FinanceOrgVersionTreeRef/index'

// 财务组织版本(所有)
import FinanceOrgVersionAllTreeRef from '../../../refer/orgv/FinanceOrgVersionAllTreeRef/index'

// 财务组织(所有,项目成本启用)
import FinanceOrgProductCostAllTreeRef from '../../../refer/org/FinanceOrgProductCostAllTreeRef/index'

// 财务组织版本(所有,项目成本启用)
import FinanceOrgVersionProductCostAllTreeRef from '../../../refer/orgv/FinanceOrgVersionProductCostAllTreeRef/index'

// 财务组织体系版本
import FinanceOrgStructVersionGridRef from '../../../refer/orgv/FinanceOrgStructVersionGridRef/index'

// 财务组织体系版本(所有)
import FinanceOrgStructVersionAllDataGridRef from '../../../refer/orgv/FinanceOrgStructVersionAllDataGridRef/index'

// 财务组织-资金管控
import FundManaSystemMemberByFinancePKTreeRef from '../../../refer/org/FundManaSystemMemberByFinancePKTreeRef/index'

// 采购计划体系
import PurPlanStruGridRef from '../../../refer/org/PurPlanStruGridRef/index'

// 采购计划体系(所有)
import PurPlanStruAllGridRef from '../../../refer/org/PurPlanStruAllGridRef/index'

// 采购计划体系成员
import PurPlanStruMemberTreeRef from '../../../refer/org/PurPlanStruMemberTreeRef/index'

// 参数代码
import ParamGridRef from '../../../refer/param/ParamGridRef/index'

// 库存组织
import StockOrgGridRef from '../../../refer/org/StockOrgGridRef/index'

// 库存组织(所有)
import StockOrgAllGridRef from '../../../refer/org/StockOrgAllGridRef/index'

// 库存组织版本
import StockOrgVersionGridRef from '../../../refer/orgv/StockOrgVersionGridRef/index'

// 库存组织版本(所有)
import StockOrgVersionAllGridRef from '../../../refer/orgv/StockOrgVersionAllGridRef/index'

// 工厂组织
import FactoryGridRef from '../../../refer/org/FactoryGridRef/index'

// 工厂组织
import FactoryAllGridRef from '../../../refer/org/FactoryAllGridRef/index'

// 插入中间级-会计科目
import AccountGridRef from '../../../refer/fiacc/AccountGridRef/index'

// 自定义档案定义(表)
import DefdocListGridRef from '../../../refer/userdef/DefdocListGridRef/index'

// 自定义档案(表)
import DefdocGridRef from '../../../refer/userdef/DefdocGridRef/index'

// 自定义档案(树)
import DefdocTreeRef from '../../../refer/userdef/DefdocTreeRef/index'

/*部门*/
import DeptNCTreeRef from '../../../refer/org/DeptNCTreeRef/index'

// 部门版本
import DeptNCVersionTreeRef from '../../../refer/orgv/DeptNCVersionTreeRef/index'

//工作中心
import WorkCenterGridRef from '../../../refer/workcenter/WorkCenterGridRef/index'

//合同费用
import ExpsetGridRef from '../../../refer/ctbasedoc/ExpsetGridRef/index'

//合同条款-组织
import TermTypeOrgGridRef from '../../../refer/ctbasedoc/TermTypeOrgGridRef/index'

//物料成本分类
import MaterialCostClassTreeRef from '../../../refer/material/MaterialCostClassTreeRef/index'

//DI报表项目
import ReportItemTreeRef from '../../../refer/fiacc/ReportItemTreeRef/index'

//报表项目体系
import ReportSystemGridRef from '../../../refer/fiacc/ReportSystemGridRef/index'

//项目结构
import EpsTreeRef from '../../../refer/pm/EpsTreeRef/index'

//人力资源组织
import HROrgTreeRef from '../../../refer/org/HROrgTreeRef/index'

//供应商发货地址
import SupplierAddressGridRef from '../../../refer/pub/SupplierAddressGridRef/index'

export default class Wpz extends Component {
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
                        <h2>王朋展</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgTreeRef({} = this.createCfg("FinanceOrgTreeRef", {
                                    "keyword": "",
                                    isShowUnit: true,
                                    isShowDisabledData: true,
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织(所有)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgAllDataTreeRef({} = this.createCfg("FinanceOrgAllDataTreeRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织(所有集团)(所有)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgAllGroupAllDataTreeRef({} = this.createCfg("FinanceOrgAllGroupAllDataTreeRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织版本
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgVersionTreeRef({} = this.createCfg("FinanceOrgVersionTreeRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织版本(所有)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgVersionAllTreeRef({} = this.createCfg("FinanceOrgVersionAllTreeRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织版本(所有,项目成本启用)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgVersionProductCostAllTreeRef({} = this.createCfg("FinanceOrgVersionProductCostAllTreeRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织(所有,项目成本启用)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgProductCostAllTreeRef({} = this.createCfg("FinanceOrgProductCostAllTreeRef", {
                                    "keyword": "",
                                    isShowUnit: true,
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织体系版本(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgStructVersionGridRef({} = this.createCfg("FinanceOrgStructVersionGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织体系版本(所有)(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FinanceOrgStructVersionAllDataGridRef({} = this.createCfg("FinanceOrgStructVersionAllDataGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                财务组织-资金管控
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundManaSystemMemberByFinancePKTreeRef({} = this.createCfg("FundManaSystemMemberByFinancePKTreeRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                采购计划体系(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PurPlanStruGridRef({} = this.createCfg("PurPlanStruGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                采购计划体系(所有)(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PurPlanStruAllGridRef({} = this.createCfg("PurPlanStruAllGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                采购计划体系成员
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PurPlanStruMemberTreeRef({} = this.createCfg("PurPlanStruMemberTreeRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                参数代码(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ParamGridRef({} = this.createCfg("ParamGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                库存组织(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StockOrgGridRef({} = this.createCfg("StockOrgGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                库存组织(所有)(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StockOrgAllGridRef({} = this.createCfg("StockOrgAllGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                库存组织版本(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StockOrgVersionGridRef({} = this.createCfg("StockOrgVersionGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                库存组织版本(所有)(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {StockOrgVersionAllGridRef({} = this.createCfg("StockOrgVersionAllGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                工厂(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FactoryGridRef({} = this.createCfg("FactoryGridRef", {
                                    "keyword": "",
                                    isShowDisabledData: true,
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                工厂(所有)(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FactoryAllGridRef({} = this.createCfg("FactoryAllGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                插入中间级-会计科目(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountGridRef({} = this.createCfg("AccountGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                自定义档案定义(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DefdocListGridRef({} = this.createCfg("DefdocListGridRef", {
                                    "keyword": ""
                                }
                                ))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                自定义档案(树)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DefdocTreeRef({} = this.createCfg("DefdocTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            pk_defdoclist: '1001ZZ10000000009031',
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                自定义档案(表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DefdocGridRef({} = this.createCfg("DefdocGridRef", {
                                    queryCondition: function () {
                                        return {
                                            pk_defdoclist: '1001ZZ10000000009031',
                                            GridRefActionExt: 'nccloud.web.uapbd.ref.userdef.DefdocGridRef, nccloud.web.uapbd.ref.userdef.DefdocGridRef',
                                            DataPowerEnable: 'true',
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                自定义档案(默认表)
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DefdocGridRef({} = this.createCfg("DefdocGridRef", {
                                    queryCondition: function () {
                                        return {
                                            pk_defdoclist: '1002ZZ1000000000066Q',
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                部门
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DeptNCTreeRef({} = this.createCfg("DeptNCTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            "busifuncode": "all"
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                部门版本
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {DeptNCVersionTreeRef({} = this.createCfg("DeptNCVersionTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            "busifuncode": "all",
                                            "isShowUnit": true,
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                工作中心
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {WorkCenterGridRef({} = this.createCfg("WorkCenterGridRef", {
                                    queryCondition: function () {
                                        return {
                                            "keyword": ""
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                合同费用
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ExpsetGridRef({} = this.createCfg("ExpsetGridRef", {
                                    queryCondition: function () {
                                        return {
                                            "keyword": ""
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>合同条款-组织</Col>
                            <Col md={8} xs={8} sm={8}>
                                {TermTypeOrgGridRef({} = this.createCfg("TermTypeOrgGridRef", {
                                    queryCondition: function () {
                                        return {
                                            "keyword": ""
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>物料成本分类</Col>
                            <Col md={8} xs={8} sm={8}>
                                {MaterialCostClassTreeRef({} = this.createCfg("MaterialCostClassTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            "keyword": ""
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>DI报表项目</Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportItemTreeRef({} = this.createCfg("ReportItemTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            "keyword": ""
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>报表项目体系</Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportSystemGridRef({} = this.createCfg("ReportSystemGridRef", {
                                    queryCondition: function () {
                                        return {
                                            "keyword": ""
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>项目结构</Col>
                            <Col md={8} xs={8} sm={8}>
                                {EpsTreeRef({} = this.createCfg("EpsTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            "keyword": ""
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>人力资源组织</Col>
                            <Col md={8} xs={8} sm={8}>
                                {HROrgTreeRef({} = this.createCfg("HROrgTreeRef", {
                                    queryCondition: function () {
                                        return {
                                            "keyword": "",
                                            isShowUnit: true,
                                            isShowDisabledData: true,
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>供应商发货地址</Col>
                            <Col md={8} xs={8} sm={8}>
                                {SupplierAddressGridRef({} = this.createCfg("SupplierAddressGridRef", {
                                    queryCondition: function () {
                                        return {
                                            "pk_supplier": "1002421000000000DF1X",
                                        }
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

//k5GFZAsPLYUL6fO5RcbANN8P0muiTj+Ga9Dma2pTZLMiNoXO830g5o0aEldXWpLk