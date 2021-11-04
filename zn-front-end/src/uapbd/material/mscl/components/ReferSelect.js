//LKFUyIz++3rh5YSh9LjuBfxDwL5x98Z2zax7mpZNRQBtTWkilNHu0o/xRRLcbd85
import React,{Component,PropTypes} from 'react';
//import BusinessUnit from '../../../refer/org/BusinessUnitTreeRef/index';
import SaleOrg from '../../../refer/org/SaleOrgTreeRef/index';
import {BaseUtils} from '../../../public/utils';


class ReferSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
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
        if(this.config.onOrgChange && BaseUtils.isFunction(this.config.onOrgChange)){
            if(!this.state.oldOrg || this.state.oldOrg.refcode != value.refcode){
                this.config.onOrgChange(value);
            }
            this.setState({
                oldOrg:value
            })


        }
    }

    render(){
        this.config = this.props.config || {};
        return (
            <div>
                {SaleOrg({
                    onChange:this.onOrgChange.bind(this),
                    value:this.config.curOrg,
                    disabled: this.config.status && this.config.status == 'edit',
                    queryCondition:function(){
                        return{
                            AppCode:'10140MSCLO',
                            TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        }
                    }           					
                })}
            </div>
        )
    }
}
export default ReferSelect
//LKFUyIz++3rh5YSh9LjuBfxDwL5x98Z2zax7mpZNRQBtTWkilNHu0o/xRRLcbd85