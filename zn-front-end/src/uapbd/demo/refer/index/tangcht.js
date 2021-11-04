//lWgBft9kmJlHXoAjmYHa0vpV7Khm65Uwiu3lCzrTRzM9KkCtrqbRcKKSEkHSID8u
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*条件过滤器*/
import RefFilterGridRef from '../../../refer/other/RefFilterGridRef/index'
/*成本域（所有）*/
import CostRegionAllDataDefaultGridRef from '../../../refer/org/CostRegionAllDataDefaultGridRef/index'
/*成本域*/
import CostRegionDefaultGridRef from '../../../refer/org/CostRegionDefaultGridRef/index'
/*地点档案*/
import AddrDocGridTreeRef from '../../../refer/address/AddrDocGridTreeRef/index'
/*地区分类*/
import AreaclTreeRef from '../../../refer/address/AreaclTreeRef/index'
/*辅助属性*/
import MarAssistantGridRef from '../../../refer/material/MarAssistantGridRef/index'
/*管会成本中心*/
import CostCenterTreeRef from '../../../refer/fiacc/CostCenterTreeRef/index';
/*核算要素(利润中心)*/
import FactorRefModel4LiacenterTreeRef from '../../../refer/fiacc/FactorRefModel4LiacenterTreeRef/index';
/*批改页签*/
import BatchUpdateTabDefaultGridRef from '../../../refer/pub/BatchUpdateTabDefaultGridRef/index'
/*人行联行信息*/
import AssLineNumDefaultGridRef from '../../../refer/pub/AssLineNumDefaultGridRef/index'
/*票据类型*/
import NotetypeDefaultGridRef from '../../../refer/sminfo/NotetypeDefaultGridRef/index'
/*凭证类别*/
import VoucherTypeDefaultGridRef from '../../../refer/fiacc/VoucherTypeDefaultGridRef/index';
/*全局+集团+业务单元(所有)*/
import BusinessUnitWithGlobleAndCurrGroupTreeRef from '../../../refer/org/BusinessUnitWithGlobleAndCurrGroupTreeRef/index'
/*全局+集团+业务单元*/
import BusinessUnitWithGlobleAndCurrGropTreeRef from '../../../refer/org/BusinessUnitWithGlobleAndCurrGropTreeRef/index'
/*全局+当前集团+当前集团下的所有组织(所有)*/
import OrgVOsWithGlobalAndCurrGroupTreeRef from '../../../refer/org/OrgVOsWithGlobalAndCurrGroupTreeRef/index'
/*全局+当前集团+当前集团下的所有组织*/
import OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData from '../../../refer/org/OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData/index'
/*全局+当前集团*/
import GlobalAndCurrGroupGridRef from '../../../refer/org/GlobalAndCurrGroupGridRef/index'
/*全局或集团下科目参照*/
import AccountGridTreeRefInGroupOrGlobal from '../../../refer/fiacc/AccountGridTreeRefInGroupOrGlobal/index'
/*地址簿*/
import AddressRef from '../../../refer/pubinfo/AddressRef/index'
/*辅助属性结构*/
import MarAsstFrameGridRef from '../../../refer/material/MarAsstFrameGridRef/index'


export default class Tangcht extends Component {
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
                        <h2>唐程通</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                辅助属性结构：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MarAsstFrameGridRef({} = this.createCfg("MarAsstFrameGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                地址簿：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AddressRef({} = this.createCfg("AddressRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                全局或集团下科目参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccountGridTreeRefInGroupOrGlobal({} = this.createCfg("AccountGridTreeRefInGroupOrGlobal",

                                    {
                                        queryCondition:{
                                            'pk_setofbook':'0001Z01000000000019Y',
                                            'datestr':'2018-07-01',
                                            'pk_org':''
                                        },
                                    }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                全局+当前集团+当前集团下的所有组织(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgVOsWithGlobalAndCurrGroupTreeRef({} = this.createCfg("OrgVOsWithGlobalAndCurrGroupTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                全局+集团+业务单元：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitWithGlobleAndCurrGropTreeRef({} = this.createCfg("BusinessUnitWithGlobleAndCurrGropTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                全局+集团+业务单元(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitWithGlobleAndCurrGroupTreeRef({} = this.createCfg("BusinessUnitWithGlobleAndCurrGroupTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                全局+当前集团：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {GlobalAndCurrGroupGridRef({} = this.createCfg("GlobalAndCurrGroupGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                全局+当前集团+当前集团下的所有组织：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData({} = this.createCfg("OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                凭证类别：
                                </Col>
                            <Col md={8} xs={8} sm={8}>
                                {VoucherTypeDefaultGridRef({} = this.createCfg("VoucherTypeDefaultGridRef", {isShowUnit:true}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                票据类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {NotetypeDefaultGridRef({} = this.createCfg("NotetypeDefaultGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                人行联行信息：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AssLineNumDefaultGridRef({} = this.createCfg("AssLineNumDefaultGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                批改页签：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BatchUpdateTabDefaultGridRef({} = this.createCfg("BatchUpdateTabDefaultGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                成本域（所有）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CostRegionAllDataDefaultGridRef({} = this.createCfg("CostRegionAllDataDefaultGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                成本域：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CostRegionDefaultGridRef({} = this.createCfg("CostRegionDefaultGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                地点档案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AddrDocGridTreeRef({} = this.createCfg("AddrDocGridTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                地区分类：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AreaclTreeRef({} = this.createCfg("AreaclTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                辅助属性：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MarAssistantGridRef({} = this.createCfg("MarAssistantGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                管会成本中心：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CostCenterTreeRef({} = this.createCfg("CostCenterTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                核算要素(利润中心)：
                            </Col>
                            {/* <Col md={8} xs={8} sm={8}>
                                {FactorRefModel4LiacenterTreeRef({
                                    queryCondition: function () {
                                        return {
                                            //此处可以添加参数
                                            // "pk_org":"0001451000000000BGOT"
                                        };
                                    }
                                })}
                            </Col> */}
                            <Col md={8} xs={8} sm={8}>
                                {FactorRefModel4LiacenterTreeRef({} = this.createCfg("FactorRefModel4LiacenterTreeRef", {
                                    "pid": "",
                                    "keyword": "",
                                    "pageInfo": {
                                        "pageIndex": 0,
                                        "pageSize": 10,
                                        "totalPage": "0"
                                    },
                                    queryCondition: function () {
                                        return {
                                            // "pk_org":"0001451000000000BGOT"
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
//lWgBft9kmJlHXoAjmYHa0vpV7Khm65Uwiu3lCzrTRzM9KkCtrqbRcKKSEkHSID8u