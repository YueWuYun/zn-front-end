//zp9l20MHRyAxTopihu9DqqE3RD9Hgz8+MED2fPX8bn8aktsKmNNbZlr2BIznVRu/
import React, {Component} from 'react';
import {base} from 'nc-lightapp-front'
const {NCCol:Col,NCRow:Row} = base;
const appcode = '10100POST';


import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef/index';

class BusinessSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json:props.json,
            context:props.context
        }
    }
    render() {
        return (
            <div style={{marginTop: 10}}>
                <Row ms={12} md={12}>
                    <Col ms={3} md={3}></Col>
                    <Col ms={2} md={2}>
                        <div style={{textAlign:'right',height: '30px',lineHeight:'30px'}}>{this.state.json['10100POST-000000']}</div>{/* 国际化处理： 所属业务单元*/}
                    </Col>
                    <Col ms={3} md={3} style={{paddingLeft:'0'}}>
                        {BusinessUnitTreeRef(
                            {
                                value:this.props.checkedOrg,
                                queryCondition: function () {
                                    return {
                                        AppCode:appcode,
                                        TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                                    }
                                }.bind(this),
                                onChange:this.props.businessOnChange
                            }
                        )}
                    </Col>
                    <Col ms={4} md={4}></Col>
                </Row>
            </div>
        )
    }
}

export default BusinessSelect;

//zp9l20MHRyAxTopihu9DqqE3RD9Hgz8+MED2fPX8bn8aktsKmNNbZlr2BIznVRu/