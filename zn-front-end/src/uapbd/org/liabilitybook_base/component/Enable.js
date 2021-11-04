//vMRL0feUH0k8XaQnD8N958QKqm1mfakRe9v2Awy6Yy+hA3ZGL1CxMhI7eci+rOT0
import React, {Component} from 'react';
import {createPage, ajax, base, toast, high, print,printer,getBusinessInfo,cacheTools,promptBox} from 'nc-lightapp-front';
const {NCAffix,NCCheckbox, NCStep, NCRadio, NCFormControl,NCBackBtn} = base;
import "../main/index.less" ;

class Enable extends Component{

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
                                checked={enableopr?checkData.liabilityenablestate.value==2:checkData.liabilityenablestate.value==3} onChange={this.props.changeCheck.bind(this,'liabilityenablestate')}>{this.props.multiJson['10100LB-000020']/* 国际化处理： 利润中心会计账簿*/}</NCCheckbox>
                    <NCCheckbox id="materialenablestate" disabled={enableopr?disableData.materialenablestate.value==2:disableData.materialenablestate.value!=2}
                                checked={enableopr?checkData.materialenablestate.value==2:checkData.materialenablestate.value==3} onChange={this.props.changeCheck.bind(this,'materialenablestate')}>{this.props.multiJson['10100LB-000021']/* 国际化处理： 存货账簿*/}</NCCheckbox>
                    <NCCheckbox id="productcostenablestate" disabled={enableopr?disableData.productcostenablestate.value==2:disableData.productcostenablestate.value!=2}
                                checked={enableopr?checkData.productcostenablestate.value==2:checkData.productcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'productcostenablestate')}>{this.props.multiJson['10100LB-000022']/* 国际化处理： 产品成本账簿*/}</NCCheckbox>
                </div>


            </div>
        )
    }


}
export default Enable;

//vMRL0feUH0k8XaQnD8N958QKqm1mfakRe9v2Awy6Yy+hA3ZGL1CxMhI7eci+rOT0