//vwSpOSFcnMvYcJPut7Q096PgEM3TaePykAa13DM6b3LlpnKI59/H8MO7shL4U09Z
import React, {Component} from 'react';
import {createPage, ajax, base, toast, high, print,printer,getBusinessInfo,cacheTools,promptBox} from 'nc-lightapp-front';
const {NCAffix,NCCheckbox, NCStep, NCRadio, NCFormControl,NCBackBtn} = base;
import "../../list/index.less" ;

class LiaEnable extends Component{

    constructor(props) {
        super(props);
        this.state = {
            curDataValues:{},
            enableopr:true,
            checkData:{},
            disableData:{}
        }
    }

    initField(enableopr,checkData,disableData){
        this.setState({enableopr:enableopr,checkData:checkData,disableData:disableData});

    }

    changeCheck(field,val){
        let enableopr = this.state.enableopr;
        //启用操作：勾选设置为启用，取消勾选设置为原来的未启用或是已停用
        if(enableopr){
            this.state.checkData[field]['value'] = val?2:this.state.curDataValues[field]['value'];
        }else {
            //停用操作：勾选设置为停用，取消勾选设置为原来的启用
            this.state.checkData[field]['value'] = val?3:2;
        }
        this.setState({checkData:this.state.checkData});
    }

    render(){

        //checkbox可用标识
        let disableData = this.props.disableData ;
        //存放改变后的数据
        let checkData = this.props.checkData ;
        //enable 为true 表示点击了启用
        let enableopr = this.props.enableopr;

        return JSON.stringify(checkData)=='{}'||JSON.stringify(disableData)=='{}'?'':(
            <div>
                <div className="demo-checkbox jinHua" >
                    <NCCheckbox id="liabilityenablestate"  disabled={enableopr?disableData.liabilityenablestate.value==2:disableData.liabilityenablestate.value!=2}
                                checked={enableopr?checkData.liabilityenablestate.value==2:checkData.liabilityenablestate.value==3} onChange={this.props.changeCheck.bind(this,'liabilityenablestate')}>{'责任会计账簿'}</NCCheckbox>
                    <NCCheckbox id="materialenablestate" disabled={enableopr?disableData.materialenablestate.value==2:disableData.materialenablestate.value!=2}
                                checked={enableopr?checkData.materialenablestate.value==2:checkData.materialenablestate.value==3} onChange={this.props.changeCheck.bind(this,'materialenablestate')}>{'存货账簿'}</NCCheckbox>
                    <NCCheckbox id="productcostenablestate" disabled={enableopr?disableData.productcostenablestate.value==2:disableData.productcostenablestate.value!=2}
                                checked={enableopr?checkData.productcostenablestate.value==2:checkData.productcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'productcostenablestate')}>{'标准成本账簿'}</NCCheckbox>
                </div>
                <div className="demo-checkbox jinHua" >
                    <NCCheckbox id="standardcostenablestate"  disabled={enableopr?disableData.standardcostenablestate.value==2:disableData.standardcostenablestate.value!=2}
                                checked={enableopr?checkData.standardcostenablestate.value==2:checkData.standardcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'standardcostenablestate')}>{'标准成本账簿'}</NCCheckbox>
                    <NCCheckbox id="costestimationenablestate" disabled={enableopr?disableData.costestimationenablestate.value==2:disableData.costestimationenablestate.value!=2}
                                checked={enableopr?checkData.costestimationenablestate.value==2:checkData.costestimationenablestate.value==3} onChange={this.props.changeCheck.bind(this,'costestimationenablestate')}>{'成本估算'}</NCCheckbox>
                    <NCCheckbox id="costcenaccenablestate" disabled={enableopr?disableData.costcenaccenablestate.value==2:disableData.costcenaccenablestate.value!=2}
                                checked={enableopr?checkData.costcenaccenablestate.value==2:checkData.costcenaccenablestate.value==3} onChange={this.props.changeCheck.bind(this,'costcenaccenablestate')}>{'成本中心会计'}</NCCheckbox>
                </div>


            </div>
        )
    }


}
export default LiaEnable;
//vwSpOSFcnMvYcJPut7Q096PgEM3TaePykAa13DM6b3LlpnKI59/H8MO7shL4U09Z