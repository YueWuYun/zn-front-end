//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS
import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let { NCCol,NCRow, NCDiv  } = base;
import { Table,Record } from '../../../public/excomponents';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef';
var EMPTY_FN = function(){};

class OrgSelect extends Component {
    constructor(props) {
        super(props);
        this.state={
          curOrg:{
            refpk:''
          }
        }
    }
    getData(){
      return this.state.curOrg;//返回选中的业务单元信息
    }
  /*************
    * ajax请求 加载树数据
    *************/
   onOrgChange(value){ //选择行政组织钩子
    this.state.curOrg = value;
    this.setState(this.state);
}

    render() {
        return (
          <div style={{padding:'30px 0 -30px 0'}}>
            <NCRow md={12} xs={12} sm={12}>
              <NCCol md={4} xs={4} sm={4}>
              </NCCol>
              <NCCol md={2} xs={2} sm={2}>
                <div fieldid = 'orgunitheader-area' style={{textAlign:'right',height:'30px',lineHeight:'30px'}}>{this.props.config.json['10100DEPT-000067']/* 国际化处理： 所属业务单元*/}:</div>
              </NCCol>
              <NCCol md={2} xs={2} sm={2} style={{paddingLeft:'0'}}>
                {BusinessUnitTreeRef({
                  fieldid:"businessunitref",
                  onChange:this.onOrgChange.bind(this),
                  value:this.state.curOrg,
                  disabled: status && status == 'edit'
                })}
              </NCCol>
              <NCCol md={4} xs={4} sm={4}>
              </NCCol>
            </NCRow>   
          </div>
        )
    }
}
export default OrgSelect;

//42865VhVnUExoUYPBd7Qf7Ur2ehMc0xIuuw2/cuYvpEVQ6LDaRevUp4JGO2KxFpS