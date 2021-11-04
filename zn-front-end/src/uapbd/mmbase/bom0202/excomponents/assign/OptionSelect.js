//jFiN88Y+FZN1wAm/QDwCLn5HoCRwRM6ONG4T0n+FwysQx0tRxPMRMTn/Er/4uw0H
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let {NCCol,NCRow,NCTree,NCRadio} = base;

var EMPTY_FN = function(){};
class OptionSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue:'assign'
        };
    }
    setChangeValue = (value) => {
        this.setState({
            selectedValue : value
        });
    }
    onCheckFreeze = (value) => {
        this.setState({
            selectedValue:value
        });
       this.props.setOpr(value);
    }
    render() {
        return (
            <NCRow md={12} xs={12} sm={12}>
                <NCCol md={12} xs={12} sm={12}>
                    <div style={{height:'400px', overflow:'scroll'}}>
                        <NCRadio.NCRadioGroup
                            name="freeSum"
                            selectedValue={this.state.selectedValue}
                            onChange={this.onCheckFreeze.bind(this)}>
                            <NCRadio value="assign">{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000131')/* 国际化处理： 分配*/}</NCRadio>
                            <NCRadio value="cancelAssign">{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000132')/* 国际化处理： 取消分配*/}</NCRadio>
                        </NCRadio.NCRadioGroup>
                    </div>
                </NCCol>
            </NCRow>
        )
    }
}
export default OptionSelect;
//jFiN88Y+FZN1wAm/QDwCLn5HoCRwRM6ONG4T0n+FwysQx0tRxPMRMTn/Er/4uw0H