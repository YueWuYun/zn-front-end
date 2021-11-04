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
                    <NCCheckbox id="accountenablestate"  disabled={enableopr?disableData.accountenablestate.value==2:disableData.accountenablestate.value!=2}
                                checked={enableopr?checkData.accountenablestate.value==2:checkData.accountenablestate.value==3} onChange={this.props.changeCheck.bind(this,'accountenablestate')}>{this.props.multiJson['10100ACB-000014']/* 国际化处理： 总账核算账簿*/}</NCCheckbox>
                    <NCCheckbox id="assetenablestate" disabled={enableopr?disableData.assetenablestate.value==2:disableData.assetenablestate.value!=2}
                                checked={enableopr?checkData.assetenablestate.value==2:checkData.assetenablestate.value==3} onChange={this.props.changeCheck.bind(this,'assetenablestate')}>{this.props.multiJson['10100ACB-000015']/* 国际化处理： 资产核算账簿*/}</NCCheckbox>
                </div>
                <div className="demo-checkbox jinHua">
                    <NCCheckbox id="materialenablestate" disabled={enableopr?disableData.materialenablestate.value==2:disableData.materialenablestate.value!=2}
                                checked={enableopr?checkData.materialenablestate.value==2:checkData.materialenablestate.value==3} onChange={this.props.changeCheck.bind(this,'materialenablestate')}>{this.props.multiJson['10100ACB-000016']/* 国际化处理： 存货核算账簿*/}</NCCheckbox>
                    <NCCheckbox id="taxenablestate" disabled={enableopr?disableData.taxenablestate.value==2:disableData.taxenablestate.value!=2}
                                checked={enableopr?checkData.taxenablestate.value==2:checkData.taxenablestate.value==3} onChange={this.props.changeCheck.bind(this,'taxenablestate')}>{this.props.multiJson['10100ACB-000017']/* 国际化处理： 税务核算账簿*/}</NCCheckbox>
                </div>
                <div className="demo-checkbox jinHua jinHHH">
                    <NCCheckbox id="productcostenablestate" disabled={enableopr?disableData.productcostenablestate.value==2:disableData.productcostenablestate.value!=2}
                                checked={enableopr?checkData.productcostenablestate.value==2:checkData.productcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'productcostenablestate')}>{this.props.multiJson['10100ACB-000018']/* 国际化处理： 产品成本核算账簿*/}</NCCheckbox>
                    <NCCheckbox id="itemcostenablestate" disabled={enableopr?disableData.itemcostenablestate.value==2:disableData.itemcostenablestate.value!=2}
                                checked={enableopr?checkData.itemcostenablestate.value==2:checkData.itemcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'itemcostenablestate')}>{this.props.multiJson['10100ACB-000019']/* 国际化处理： 项目成本核算账簿*/}</NCCheckbox>
                </div>
            </div>
        )
    }


}
export default Enable;

//vMRL0feUH0k8XaQnD8N958QKqm1mfakRe9v2Awy6Yy+hA3ZGL1CxMhI7eci+rOT0