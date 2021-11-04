//woQIJgI9myJP1yJ3KQGpUTn6qo6/eT8YSQ8Xg0sn9HtvDNzzefm+E5DUUb5k4KLz
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*资金组织版本*/
import FundOrgVersionTreeRef from '../../../refer/orgv/FundOrgVersionTreeRef/index'
/*资金组织版本(所有)*/
import FundOrgVersionAllDataTreeRef from '../../../refer/orgv/FundOrgVersionAllDataTreeRef/index'
/*资金组织所有*/
import FundOrgForOrgUnitTreeRef from '../../../refer/org/FundOrgForOrgUnitTreeRef/index'
/*组织（包含全局）*/
import OrgWithGlobalTreeRef from '../../../refer/org/OrgWithGlobalTreeRef/index'
/*组织（包含全局）(所有)*/
import OrgWithGlobalAllDataTreeRef from '../../../refer/org/OrgWithGlobalAllDataTreeRef/index'
/*组织关系类型归属类型*/
import OrgRelationTypeLeftTypeGridRef from '../../../refer/org/OrgRelationTypeLeftTypeGridRef/index'
/*组织类型*/
import OrgTypeGridRef from '../../../refer/org/OrgTypeGridRef/index'
/*组织类型分类的组织单元*/
import OrgAndOrgTypeCompositeOnlyEnableDataTreeRef from '../../../refer/org/OrgAndOrgTypeCompositeOnlyEnableDataTreeRef/index'
/*组织类型分类的组织单元*/
import OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef from '../../../refer/org/OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef/index'
/*组织类型分类的组织单元(所有)*/
import OrgAndOrgTypeCompositeTreeRef from '../../../refer/org/OrgAndOrgTypeCompositeTreeRef/index'
/*组织主管*/
import OrgManagerGridRef from '../../../refer/org/OrgManagerGridRef/index'

/*客户银行账号*/
import CustBankAccGridRef from '../../../refer/pub/CustBankAccGridRef/index'
/*资产类别*/
import CategoryTreeRef from '../../../refer/am/CategoryTreeRef/index'
/*资产状态*/
import EquipStatusGridRef from '../../../refer/am/EquipStatusGridRef/index'

/*供应商资质分类*/
import SupplierQualiTypeTreeRef from '../../../refer/pub/SupplierQualiTypeTreeRef/index'

// import OrgByParaUsedTreeRef from './OrgByParaUsedTreeRef'

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
                        <h2>童长贵</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金组织版本：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundOrgVersionTreeRef({}=this.createCfg("FundOrgVersionTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金组织版本(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundOrgVersionAllDataTreeRef({}=this.createCfg("FundOrgVersionAllDataTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资金组织所有：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {FundOrgForOrgUnitTreeRef({}=this.createCfg("FundOrgForOrgUnitTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                组织（包含全局）：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgWithGlobalTreeRef({}=this.createCfg("OrgWithGlobalTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                组织（包含全局）(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgWithGlobalAllDataTreeRef({}=this.createCfg("OrgWithGlobalAllDataTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                组织关系类型归属类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgRelationTypeLeftTypeGridRef({}=this.createCfg("OrgRelationTypeLeftTypeGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                组织类型：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgTypeGridRef({}=this.createCfg("OrgTypeGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                组织类型分类的组织单元：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgAndOrgTypeCompositeOnlyEnableDataTreeRef({}=this.createCfg("OrgAndOrgTypeCompositeOnlyEnableDataTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                组织类型分类的组织单元：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef({}=this.createCfg("OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                组织类型分类的组织单元(所有)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgAndOrgTypeCompositeTreeRef({}=this.createCfg("OrgAndOrgTypeCompositeTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                组织主管：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgManagerGridRef({}=this.createCfg("OrgManagerGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客户银行账户：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustBankAccGridRef({}=this.createCfg("CustBankAccGridRef",{
                                    queryCondition: function () {
                                        return {
                                            "accclass": "1",
                                            "pk_cust" : "1002AD1000000000010F"
                                        }
                                    },
                                    title: '客户银行账户'
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                客商银行账户：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustBankAccGridRef({}=this.createCfg("CustBankAccGridRef",{
                                    queryCondition: function () {
                                        return {
                                            "accclass": "2",
                                            "pk_cust" : "1002AD10000000000352"
                                        }
                                    },
                                    title: '客商银行账户'
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                供应商银行账户：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CustBankAccGridRef({}=this.createCfg("CustBankAccGridRef",{
                                    queryCondition: function () {
                                        return {
                                            "accclass": "3",
                                            "pk_cust" : "1002AD1000000000038D"
                                        }
                                    },
                                    title: '供应商银行账户'
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产类别：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {CategoryTreeRef({}=this.createCfg("CategoryTreeRef", {
                                    isMultiSelectedEnabled:true
                                }))}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                资产状态：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {EquipStatusGridRef({}=this.createCfg("EquipStatusGridRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                    {/* <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                            参数修改申请-所引用的组织参照：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {OrgByParaUsedTreeRef({})}
                            </Col>
                        </Row>
                    </Col> */}
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                            供应商资质分类：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SupplierQualiTypeTreeRef({}=this.createCfg("SupplierQualiTypeTreeRef", {}))}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//woQIJgI9myJP1yJ3KQGpUTn6qo6/eT8YSQ8Xg0sn9HtvDNzzefm+E5DUUb5k4KLz