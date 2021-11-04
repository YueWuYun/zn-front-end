//k5GFZAsPLYUL6fO5RcbANN8P0muiTj+Ga9Dma2pTZLMiNoXO830g5o0aEldXWpLk
import React, { Component } from 'react';

import CurrtypeGridRef from '../../../../mobile_uapbd/refer/pubinfo/CurrtypeGridRef/index';  //币种 
import DeptTreeRef from '../../../../mobile_uapbd/refer/org/DeptTreeRef/index'; //部门 
import FinanceOrgTreeRef from '../../../../mobile_uapbd/refer/org/FinanceOrgTreeRef/index'; //财务组织
import PurchaseOrgGridRef from '../../../../mobile_uapbd/refer/org/PurchaseOrgGridRef/index';//采购组织
import StorDocDefaulteGridRef from '../../../../mobile_uapbd/refer/stordoc/StorDocDefaulteGridRef/index'; //仓库 
import CostCenterGroupGridRef from '../../../../mobile_uapbd/refer/fiacc/CostCenterGroupGridRef/index';//成本中心组 
import FactoryGridRef from '../../../../mobile_uapbd/refer/org/FactoryGridRef/index'; //工厂 
import SupplierRefTreeGridRef from '../../../../mobile_uapbd/refer/supplier/SupplierRefTreeGridRef/index';//供应商档案 
import CostCenterTreeRef from '../../../../mobile_uapbd/refer/fiacc/CostCenterTreeRef/index';  //管会成本中心  
import Factor4FinancialTreeRef from '../../../../mobile_uapbd/refer/fiacc/Factor4FinancialTreeRef/index';  //核算要素(财务组织)  
import FactorRefModel4LiacenterTreeRef from '../../../../mobile_uapbd/refer/fiacc/FactorRefModel4LiacenterTreeRef/index';//核算要素(利润中心)  
import AccPeriodTreeGridRef from '../../../../mobile_uapbd/refer/pubinfo/AccPeriodTreeGridRef/index';//会计期间档案2 
import RackDefaultTreeRef from '../../../../mobile_uapbd/refer/busiinfo/RackDefaultTreeRef/index'; //货位 
import MeasdocDefaultGridRef from '../../../../mobile_uapbd/refer/material/MeasdocDefaultGridRef/index'; //计量单位
import StockOrgGridRef from '../../../../mobile_uapbd/refer/org/StockOrgGridRef/index';//库存组织
import StockOrgVersionGridRef from '../../../../mobile_uapbd/refer/orgv/StockOrgVersionGridRef/index'; //库存组织版本  
import PsndocTreeGridRef from '../../../../mobile_uapbd/refer/psninfo/PsndocTreeGridRef/index';//人员 
import DefdocGridRef from '../../../../mobile_uapbd/refer/userdef/DefdocGridRef/index'; //生产厂商(自定义档案)
import MaterialGridRef from '../../../../mobile_uapbd/refer/pub/MaterialGridRef/index';//物料 
import MaterialMultiVersionGridRef from '../../../../mobile_uapbd/refer/pub/MaterialMultiVersionGridRef/index';//物料（多版本）
import MaterialCostClassTreeRef from '../../../../mobile_uapbd/refer/material/MaterialCostClassTreeRef/index'; //物料成本分类  
import MaterialBasClassTreeRef from '../../../../mobile_uapbd/refer/material/MaterialBasClassTreeRef/index';  //物料基本分类  
import ProjectDefaultTreeGridRef from '../../../../mobile_uapbd/refer/pm/ProjectDefaultTreeGridRef/index';//项目 
import BusinessUnitTreeRef from '../../../../mobile_uapbd/refer/org/BusinessUnitTreeRef/index';  //业务单元
import AssetOrgGridRef from '../../../../mobile_uapbd/refer/org/AssetOrgGridRef/index';//资产组织

const pk_org = "0001HR10000000002MD5";

// 示例 Demo 页面
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
            <div>

                {CurrtypeGridRef({} = this.createCfg("CurrtypeGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "币种"
                }))}

                {DeptTreeRef({} = this.createCfg("DeptTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "部门"
                }))}

                {FinanceOrgTreeRef({} = this.createCfg("FinanceOrgTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "财务组织"
                }))}

                {PurchaseOrgGridRef({} = this.createCfg("PurchaseOrgGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "采购组织"
                }))}

                {StorDocDefaulteGridRef({} = this.createCfg("StorDocDefaulteGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "仓库"
                }))}

                {CostCenterGroupGridRef({} = this.createCfg("CostCenterGroupGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "成本中心组"
                }))}

                {FactoryGridRef({} = this.createCfg("FactoryGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "工厂"
                }))}


                {SupplierRefTreeGridRef({} = this.createCfg("SupplierRefTreeGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "供应商档案"
                }))}

                {CostCenterTreeRef({} = this.createCfg("CostCenterTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "管会成本中心"
                }))}

                {Factor4FinancialTreeRef({} = this.createCfg("Factor4FinancialTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "核算要素(财务组织)"
                }))}

                {FactorRefModel4LiacenterTreeRef({} = this.createCfg("FactorRefModel4LiacenterTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "核算要素(利润中心)"
                }))}

                {AccPeriodTreeGridRef({} = this.createCfg("AccPeriodTreeGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "会计期间档案2"
                }))}

                {RackDefaultTreeRef({} = this.createCfg("RackDefaultTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "货位"
                }))}

                {MeasdocDefaultGridRef({} = this.createCfg("MeasdocDefaultGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "计量单位"
                }))}

                {StockOrgGridRef({} = this.createCfg("StockOrgGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "库存组织"
                }))}

                {StockOrgVersionGridRef({} = this.createCfg("StockOrgVersionGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "库存组织版本"
                }))}

                {PsndocTreeGridRef({} = this.createCfg("PsndocTreeGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "人员"
                }))}

                {MaterialGridRef({} = this.createCfg("MaterialGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "物料"
                }))}

                {MaterialMultiVersionGridRef({} = this.createCfg("MaterialMultiVersionGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "物料（多版本）"
                }))}

                {MaterialCostClassTreeRef({} = this.createCfg("MaterialCostClassTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "物料成本分类"
                }))}

                {MaterialBasClassTreeRef({} = this.createCfg("MaterialBasClassTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "物料基本分类"
                }))}

                {ProjectDefaultTreeGridRef({} = this.createCfg("ProjectDefaultTreeGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "项目"
                }))}

                {BusinessUnitTreeRef({} = this.createCfg("BusinessUnitTreeRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "业务单元"
                }))}

                {AssetOrgGridRef({} = this.createCfg("AssetOrgGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            isShowDisabledData: true,
                        };
                    },
                    label: "资产组织"
                }))}

                {DefdocGridRef({} = this.createCfg("DefdocGridRef", {
                    keyword: "",
                    queryCondition: function () {
                        return {
                            pk_org: pk_org,
                            pk_defdoclist: '1002ZZ1000000000066Q',
                        };
                    },
                    label: "自定义档案"
                }))}

            </div>
        );
    }
}
//k5GFZAsPLYUL6fO5RcbANN8P0muiTj+Ga9Dma2pTZLMiNoXO830g5o0aEldXWpLk