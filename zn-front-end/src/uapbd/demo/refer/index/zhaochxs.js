//cXJca0Rl+AeexzGEKi6t8iEqLXTpKRZ2gqtc7VtCDa7aW/aw/f5S4lCV1zHt8iHU
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


//fiacc
/*资金计划项目*/
import FundPlanTreeRef from '../../../refer/fiacc/FundPlanTreeRef/index';
/*资金计划指标*/
import FundPlanIndexTreeRef from '../../../refer/fiacc/FundPlanIndexTreeRef/index';

//material
/*品牌档案*/
import BrandDocGridRef from '../../../refer/material/BrandDocGridRef/index';

//org
/*资金管理体系*/
import FundManaSystemGridRef from '../../../refer/org/FundManaSystemGridRef/index';
/*资金管理体系(所有)*/
import FundManaSystemAllDataGridRef from '../../../refer/org/FundManaSystemAllDataGridRef/index';
/*资金管理体系成员*/
import FundManaSystemMemberTreeRef from '../../../refer/org/FundManaSystemMemberTreeRef/index';
/*资金组织*/
import FundOrgTreeRef from '../../../refer/org/FundOrgTreeRef/index';
/*资金组织(所有)*/
import FundOrgAllDataTreeRef from '../../../refer/org/FundOrgAllDataTreeRef/index';
/*报表合并体系*/
import ReportCombineStruGridRef from '../../../refer/org/ReportCombineStruGridRef/index';
/*报表合并体系成员*/
import ReportCombineStruMemberTreeRef from '../../../refer/org/ReportCombineStruMemberTreeRef/index';
/*报表组织体系*/
import ReportManaStruGridRef from '../../../refer/org/ReportManaStruGridRef/index';
/*报表组织体系成员*/
import ReportManaStruMemberTreeRef from '../../../refer/org/ReportManaStruMemberTreeRef/index';
/*报表组织体系(所有)*/
import ReportManaStruAllDataGridRef from '../../../refer/org/ReportManaStruAllDataGridRef/index';

//orgv
/*资产组织版本(包括集团)*/
import AssetOrgWithGroupVersionGridRef from '../../../refer/orgv/AssetOrgWithGroupVersionGridRef/index';
/*资产组织版本(所有)*/
import AssetOrgVersionAllDataGridRef from '../../../refer/orgv/AssetOrgVersionAllDataGridRef/index';
/*资金管理体系版本*/
import FundManaSystemVersionGridRef from '../../../refer/orgv/FundManaSystemVersionGridRef/index';
/*资金管理体系版本(所有)*/
import FundManaSystemVersionAllDataGridRef from '../../../refer/orgv/FundManaSystemVersionAllDataGridRef/index';
/*报表合并体系成员多版本*/
import ReportCombineStruMemberVersionTreeRef from '../../../refer/orgv/ReportCombineStruMemberVersionTreeRef/index';
/*报表组织体系成员多版本*/
import ReportManaStruMemberVersionTreeRef from '../../../refer/orgv/ReportManaStruMemberVersionTreeRef/index';

//sminfo
/*收款协议*/
import IncomeGridRef from '../../../refer/sminfo/IncomeGridRef/index'
/*付款类型*/
import PaytypeGridRef from '../../../refer/sminfo/PaytypeGridRef/index'

//cust
/*渠道类型*/
import ChannelTypeGridRef from '../../../refer/customer/ChannelTypeGridRef/index'
/*散户*/
import FreeCustGridRef from '../../../refer/customer/FreeCustGridRef/index'

//psninfo
/*人员*/
import PsndocRiartTreeGridRef from '../../../refer/psninfo/PsndocRiartTreeGridRef/index';

export default class Zhaochxs extends Component {
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
                        <h2>赵成晓</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金计划项目：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundPlanTreeRef({} = this.createCfg('FundPlanTreeRef', {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            "isDisabledDataShow": 'true',
                                            "pk_org": "GLOBLE00000000000000",
                                            "pk_group": "0001HR1000000000033B"
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金计划指标：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundPlanIndexTreeRef({} = this.createCfg('FundPlanIndexTreeRef', {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            "isDisabledDataShow": 'true',
                                            "pk_org": "GLOBLE00000000000000",
                                            "pk_group": "0001HR1000000000033B"
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                品牌档案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BrandDocGridRef({} = this.createCfg('BrandDocGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金管理体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundManaSystemGridRef({} = this.createCfg('FundManaSystemGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金管理体系(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundManaSystemAllDataGridRef({} = this.createCfg('FundManaSystemAllDataGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金管理体系成员：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundManaSystemMemberTreeRef({} = this.createCfg('FundManaSystemMemberTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金组织：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundOrgTreeRef({} = this.createCfg('FundOrgTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金组织(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundOrgAllDataTreeRef({} = this.createCfg('FundOrgAllDataTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产组织版本(包括集团)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetOrgWithGroupVersionGridRef({} = this.createCfg('AssetOrgWithGroupVersionGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产组织版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssetOrgVersionAllDataGridRef({} = this.createCfg('AssetOrgVersionAllDataGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金管理体系版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundManaSystemVersionGridRef({} = this.createCfg('FundManaSystemVersionGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金管理体系版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundManaSystemVersionAllDataGridRef({} = this.createCfg('FundManaSystemVersionAllDataGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表合并体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportCombineStruGridRef({} = this.createCfg('ReportCombineStruGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表合并体系成员多版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportCombineStruMemberVersionTreeRef({} = this.createCfg('ReportCombineStruMemberVersionTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表合并体系成员：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportCombineStruMemberTreeRef({} = this.createCfg('ReportCombineStruMemberTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表组织体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportManaStruGridRef({} = this.createCfg('ReportManaStruGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表组织体系成员多版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportManaStruMemberVersionTreeRef({} = this.createCfg('ReportManaStruMemberVersionTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表组织体系成员：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportManaStruMemberTreeRef({} = this.createCfg('ReportManaStruMemberTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                报表组织体系(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ReportManaStruAllDataGridRef({} = this.createCfg('ReportManaStruAllDataGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                收款协议：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {IncomeGridRef({} = this.createCfg('IncomeGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                付款类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PaytypeGridRef({} = this.createCfg('PaytypeGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                渠道类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ChannelTypeGridRef({} = this.createCfg('ChannelTypeGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                散户：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FreeCustGridRef({} = this.createCfg('FreeCustGridRef', {queryCondition:{customSupplier:'1002Z01000000000099V'}}))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                人员参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {PsndocRiartTreeGridRef({} = this.createCfg('PsndocRiartTreeGridRef', {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    isShowUnit:true,
                                    isShowDisabledData:true,
                                    queryCondition: function () {
                                        return {
                                            //使用时需加入pk_org参数
                                            "pk_org":"0001HR1000000000033B",
                                            "pk_group": "0001HR1000000000033B",
                                            "isleave": true,
                                            "isleavepower": true
                                        }
                                    }
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
//cXJca0Rl+AeexzGEKi6t8iEqLXTpKRZ2gqtc7VtCDa7aW/aw/f5S4lCV1zHt8iHU