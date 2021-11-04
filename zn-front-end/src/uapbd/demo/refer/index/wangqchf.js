//H/QAc9R/6YrdLsiKU4WM8OgOsMGOYfRFyCqakpwuZk1gSzkwoo48xLY38n0BlzTJ
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*条件过滤器*/
import RefFilterGridRef from '../../../refer/other/RefFilterGridRef/index'
/*会计期间*/
import AccPeriodDefaultTreeGridRef from '../../../refer/pubinfo/AccPeriodDefaultTreeGridRef/index'
/*会计期间档案2*/
import AccPeriodTreeGridRef from '../../../refer/pubinfo/AccPeriodTreeGridRef/index'
/*计量单位*/
import MeasdocDefaultGridRef from '../../../refer/material/MeasdocDefaultGridRef/index'
/*集团(所有)*/
import GroupDefaultTreeRef from '../../../refer/org/GroupDefaultTreeRef/index'
/*客户联系人*/
import CustomerLinkManGridRef from '../../../refer/customer/CustomerLinkManGridRef/index'
/*客户基本分类*/
import CustClassDefaultTreeRef from '../../../refer/customer/CustClassDefaultTreeRef/index'
/*客户档案*/
import CustomerDefaultTreeGridRef from '../../../refer/customer/CustomerDefaultTreeGridRef/index'
/*行政组织*/
import AdminOrgDefaultTreeRef from '../../../refer/org/AdminOrgDefaultTreeRef/index'
/*所有部门(业务人员来源)*/
import BusiRoleDeptTreeRef from '../../../refer/org/BusiRoleDeptTreeRef/index'
/*维修组织(所有)*/
import MaintainOrgDefaultAllDataGridRef from '../../../refer/org/MaintainOrgDefaultAllDataGridRef/index'
/*维修组织*/
import MaintainOrgDefaultGridRef from '../../../refer/org/MaintainOrgDefaultGridRef/index'
/*维修组织体系*/
import MOrgStruDefaultGridRef from '../../../refer/org/MOrgStruDefaultGridRef/index'
/*税务组织(全局+集团+税务组织)*/
import TaxOrgDefaultGridRef from '../../../refer/org/TaxOrgDefaultTreeRef/index'
/*维修组织版本*/
import MaintainOrgVersionDefaultRefModel from '../../../refer/orgv/MaintainOrgVersionDefaultRefModel/index'
/*维修组织体系版本*/
import MOrgStruVersionDefaultGridRef from '../../../refer/orgv/MOrgStruVersionDefaultGridRef/index'
/*外币汇率方案*/
import ExrateSchemeGridRef from '../../../refer/pubinfo/ExrateSchemeGridRef/index'
/*托收协议*/
import MandateDefaultGridRef from '../../../refer/sminfo/MandateDefaultGridRef/index'
/*网银信息模板设置*/
import NetbankTemplateDefaultGridRef from '../../../refer/sminfo/NetbankTemplateDefaultGridRef/index'
/*行政区划 */
import RegionDefaultTreeRef from '../../../refer/pubinfo/RegionDefaultTreeRef/index'

export default class Wangqchf extends Component {
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
                //this.setState(Object.assign (this.state.configs,temp));
                this.setState(this.state)
            }.bind(this)
        }
        this.state.configs[id] = obj;
        var result_param = Object.assign(obj, param)
        return result_param;
        //
    }

    render() {
        return (
            <Col md={12} xs={12} sm={12}>
                <Row>
                    <Col md={12} xs={12} sm={12}>
                        <h2>王庆春</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                条件过滤器：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {RefFilterGridRef({} = this.createCfg('RefFilterGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计期间档案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccPeriodDefaultTreeGridRef({} = this.createCfg('AccPeriodDefaultTreeGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                会计期间档案2：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AccPeriodTreeGridRef({} = this.createCfg('AccPeriodTreeGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                计量单位：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MeasdocDefaultGridRef({} = this.createCfg('MeasdocDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                集团(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {GroupDefaultTreeRef({} = this.createCfg('GroupDefaultTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客户联系人：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustomerLinkManGridRef({} = this.createCfg('CustomerLinkManGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客户基本分类：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustClassDefaultTreeRef({} = this.createCfg('CustClassDefaultTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                网银信息模板设置：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {NetbankTemplateDefaultGridRef({} = this.createCfg('NetbankTemplateDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客户档案：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustomerDefaultTreeGridRef({} = this.createCfg('CustomerDefaultTreeGridRef', {
                                    isShowDisabledData:true,
                                }))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                行政组织：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {AdminOrgDefaultTreeRef({} = this.createCfg('AdminOrgDefaultTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                所有部门(业务人员来源)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusiRoleDeptTreeRef({} = this.createCfg('BusiRoleDeptTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                维修组织(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MaintainOrgDefaultAllDataGridRef({} = this.createCfg('MaintainOrgDefaultAllDataGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                维修组织：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MaintainOrgDefaultGridRef({} = this.createCfg('MaintainOrgDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                维修组织体系：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MOrgStruDefaultGridRef({} = this.createCfg('MOrgStruDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                税务组织(全局+集团+税务组织)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TaxOrgDefaultGridRef({} = this.createCfg('TaxOrgDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                维修组织版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MaintainOrgVersionDefaultRefModel({} = this.createCfg('MaintainOrgVersionDefaultRefModel', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                维修组织体系版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MOrgStruVersionDefaultGridRef({} = this.createCfg('MOrgStruVersionDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                外币汇率方案参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {ExrateSchemeGridRef({} = this.createCfg('ExrateSchemeGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                托收协议：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MandateDefaultGridRef({} = this.createCfg('MandateDefaultGridRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                行政区划：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {RegionDefaultTreeRef({} = this.createCfg('RegionDefaultTreeRef', {}))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//H/QAc9R/6YrdLsiKU4WM8OgOsMGOYfRFyCqakpwuZk1gSzkwoo48xLY38n0BlzTJ