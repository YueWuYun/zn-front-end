//ohWRGUbquWXpNsPtL9CcVi+kk0wr2Kypb3worZfSeT6LT07JdM22Qf0Wg46WmCwY
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*条件过滤器*/
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef/index'
import BusinessUnitVersionTreeRef from '../../../refer/orgv/BusinessUnitVersionTreeRef/index'
import SaleOrgAllTreeRef from '../../../refer/org/SaleOrgAllTreeRef/index'
import SaleOrgTreeRef from '../../../refer/org/SaleOrgTreeRef/index'
import SaleOrgVersionAllTreeRef from '../../../refer/orgv/SaleOrgVersionAllTreeRef/index'
import SaleOrgVersionTreeRef from '../../../refer/orgv/SaleOrgVersionTreeRef/index'

export default class zhenmx extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configs: {}
        }
    }

    render() {
        return (
            <Col md={12} xs={12} sm={12}>
                <Row>
                    <Col md={12} xs={12} sm={12}>
                        <h2>甄明星</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                业务单元版本
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {BusinessUnitVersionTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                销售组织所有
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SaleOrgAllTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                销售组织
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SaleOrgTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                销售组织版本所有
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SaleOrgVersionAllTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                销售组织版本
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {SaleOrgVersionTreeRef({})}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col >
        )
    }
};
//ohWRGUbquWXpNsPtL9CcVi+kk0wr2Kypb3worZfSeT6LT07JdM22Qf0Wg46WmCwY