//6ZGfP4DGdqI1tLgpJ+rLxV6q9Gg1xxY7X/FPxImmZwJKctabmNglRR40BjqI8UVjdt7cOZ3OMMsg
//5SKVSedGrg==
import React,{Component} from 'react';
import BusinessUnit from '../../../refer/org/BusinessUnitTreeRef/index';
import {BaseUtils} from "../../../public/utils";
class SupplierClassOrgRefer extends Component{
    constructor(props){
        super(props);
        this.state = {
            ...this.props,
            oldOrg:null,
        }
    }
    componentWillReceiveProps(newProps){
        this.state = {
            ...newProps
        }
        this.setState(this.state);
    }
    /**
     * 选择改变事件
     * @param value
     */
    onOrgChange(value){
        if(this.state.onOrgChange && BaseUtils.isFunction(this.state.onOrgChange)){
            if(!this.state.oldOrg || this.state.oldOrg.refpk != value.refpk){
                this.state.curOrg = value;
            }
            this.state.oldOrg = value;
            this.setState(this.state,()=>{
                this.state.onOrgChange(value);
            })
        }
    }
    render(){
        return(
            <BusinessUnit
                onChange = {this.onOrgChange.bind(this)}
                value = {this.state.curOrg}
                disabled = {this.state.status && this.state.status == 'edit'}
                fieldid={this.state.fieldid || 'org'}
                queryCondition={{
                    //orgType:'BUSINESSUNIT00000000',
                    'AppCode':'10140SCLO',
                    //TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }}
            />
        )

    }
}
export default SupplierClassOrgRefer
//6ZGfP4DGdqI1tLgpJ+rLxV6q9Gg1xxY7X/FPxImmZwJKctabmNglRR40BjqI8UVjdt7cOZ3OMMsg
//5SKVSedGrg==