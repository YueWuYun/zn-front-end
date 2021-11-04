//2UiKn/WFLhrZRGmUEXJbK/RqoMD0KKbzABVf0Cp95I5jCQ2Frqhn9iDnr0fM9b/9
import React, { Component } from 'react';

import { base } from 'nc-lightapp-front';

const { NCCol: Col, NCRow: Row } = base;


/*条件过滤器*/
import MaterialGridRef from '../../../refer/pub/MaterialGridRef/index'

import MaterialMultiVersionGridRef from '../../../refer/pub/MaterialMultiVersionGridRef/index'

export default class Taxinfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configs: {}
        }
    }

    onChangeMaterialGridRef(value) {
        this.setState({
            MaterialGridRefValue: value
        });
    }

    onChangeMaterialMultiVersionGridRef(value) {
        this.setState({
            MaterialMultiVersionGridRefValue: value
        });
    }

    render() {
        return (
            <Col md={12} xs={12} sm={12}>
                <Row>
                    <Col md={12} xs={12} sm={12}>
                        <h2>殷双斌</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                物料：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MaterialGridRef({
                                    onChange: this.onChangeMaterialGridRef.bind(this),
                                    value: this.state.MaterialGridRefValue,
                                    isShowAssginDataChk:true,
                                    isShowDisabledData:true,
                                    isShowUnit:true,
                                })}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={4} sm={4}>
                        <Row>
                            <Col md={4} xs={4} sm={4}>
                                物料(多版本)：
                            </Col>
                            <Col md={8} xs={8} sm={8}>
                                {MaterialMultiVersionGridRef({
                                    onChange: this.onChangeMaterialMultiVersionGridRef.bind(this),
                                    value: this.state.MaterialMultiVersionGridRefValue,
                                    isShowAssginDataChk:true,
                                })}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        )
    }
};
//2UiKn/WFLhrZRGmUEXJbK/RqoMD0KKbzABVf0Cp95I5jCQ2Frqhn9iDnr0fM9b/9