//WMGlEX+i5qxk8GFUis1FhIIEZYa5PoEk+XuDTZ6yGrY+C39+VM3yrDQ8weEnSPDW
import React, {Component} from 'react';
import {createPage, ajax, base, toast, high, print,printer,getBusinessInfo,cacheTools,promptBox} from 'nc-lightapp-front';
const {NCAffix,NCCheckbox, NCStep, NCRadio, NCFormControl,NCBackBtn} = base;
import "../../list/index.less" ;

class AccEnable extends Component{

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
                            checked={enableopr?checkData.accountenablestate.value==2:checkData.accountenablestate.value==3} onChange={this.props.changeCheck.bind(this,'accountenablestate')}>{'总账核算账簿'}</NCCheckbox>
                <NCCheckbox id="assetenablestate" disabled={enableopr?disableData.assetenablestate.value==2:disableData.assetenablestate.value!=2}
                            checked={enableopr?checkData.assetenablestate.value==2:checkData.assetenablestate.value==3} onChange={this.props.changeCheck.bind(this,'assetenablestate')}>{'资产核算账簿'}</NCCheckbox>
                <NCCheckbox id="materialenablestate" disabled={enableopr?disableData.materialenablestate.value==2:disableData.materialenablestate.value!=2}
                            checked={enableopr?checkData.materialenablestate.value==2:checkData.materialenablestate.value==3} onChange={this.props.changeCheck.bind(this,'materialenablestate')}>{'存货核算账簿'}</NCCheckbox>
            </div>
            <div className="demo-checkbox jinHua">
                
                <NCCheckbox id="productcostenablestate" disabled={enableopr?disableData.productcostenablestate.value==2:disableData.productcostenablestate.value!=2}
                            checked={enableopr?checkData.productcostenablestate.value==2:checkData.productcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'productcostenablestate')}>{'产品成本核算账簿'}</NCCheckbox>			
                <NCCheckbox id="itemcostenablestate" disabled={enableopr?disableData.itemcostenablestate.value==2:disableData.itemcostenablestate.value!=2}
                            checked={enableopr?checkData.itemcostenablestate.value==2:checkData.itemcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'itemcostenablestate')}>{'项目成本核算账簿'}</NCCheckbox>			
                <NCCheckbox id="standardcostenablestate" disabled={enableopr?disableData.standardcostenablestate.value==2:disableData.standardcostenablestate.value!=2}
                            checked={enableopr?checkData.standardcostenablestate.value==2:checkData.standardcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'standardcostenablestate')}>{'税务核算账簿'}</NCCheckbox>			         
            </div>
            <div className="demo-checkbox jinHua jinHHH">
                <NCCheckbox id="specialcostenablestate" disabled={enableopr?disableData.specialcostenablestate.value==2:disableData.specialcostenablestate.value!=2}
                            checked={enableopr?checkData.specialcostenablestate.value==2:checkData.specialcostenablestate.value==3} onChange={this.props.changeCheck.bind(this,'specialcostenablestate')}>{'专项成本账簿'}</NCCheckbox>
                <NCCheckbox id="costestimationenablestate" disabled={enableopr?disableData.costestimationenablestate.value==2:disableData.costestimationenablestate.value!=2}
                            checked={enableopr?checkData.costestimationenablestate.value==2:checkData.costestimationenablestate.value==3} onChange={this.props.changeCheck.bind(this,'costestimationenablestate')}>{'成本估算账簿'}</NCCheckbox>			
                <NCCheckbox id="costcenaccenablestate" disabled={enableopr?disableData.costcenaccenablestate.value==2:disableData.costcenaccenablestate.value!=2}
                            checked={enableopr?checkData.costcenaccenablestate.value==2:checkData.costcenaccenablestate.value==3} onChange={this.props.changeCheck.bind(this,'costcenaccenablestate')}>{'成本中心会计账簿'}</NCCheckbox>			
                            
                
            </div>
        </div>
        )
    }


}
export default AccEnable;

//WMGlEX+i5qxk8GFUis1FhIIEZYa5PoEk+XuDTZ6yGrY+C39+VM3yrDQ8weEnSPDW