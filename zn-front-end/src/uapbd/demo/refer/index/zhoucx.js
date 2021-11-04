//YE2Ge95zUXb2dvDdeXn4ji8cphJi3P7tP0YSsW1F20VAaF8bhuVT4JRyroBrz0Cn
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*税种*/
import TaxKindGridRef from '../../../refer/taxinfo/TaxKindGridRef/index';
/*税种-全部*/
import TaxKindAllGridRef from '../../../refer/taxinfo/TaxKindAllGridRef/index';

export default class Zhoucx extends Component {
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
                        <h2>周春星</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                税种：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TaxKindGridRef({} = this.createCfg("TaxKindGridRef", {
                                    queryCondition: function () {
                                        return {
                                            pk_org: 'GLOBLE00000000000000',
                                        }
                                    }
                                }))}
                            </Col>
                        </Row>
                    </Col>

                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                税种-全部：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {TaxKindAllGridRef({} = this.createCfg("TaxKindAllGridRef", {
                                    queryCondition: function () {
                                        return {
                                            pk_org: 'GLOBLE00000000000000',
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
//YE2Ge95zUXb2dvDdeXn4ji8cphJi3P7tP0YSsW1F20VAaF8bhuVT4JRyroBrz0Cn