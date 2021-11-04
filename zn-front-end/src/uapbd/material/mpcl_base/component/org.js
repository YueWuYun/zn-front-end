//s2DTWjxmhLuXYBeUGolGk17fDqHzOUtPDCL5AOpopJx63x2nB1g9JZtg66EutHrx
import React,{Component,PropTypes} from 'react';
import Org from '../../../refer/org/StockOrgGridRef';
import {BaseUtils} from '../../../public/utils';
/****************************************************
 * 组织选择
 *  @author
 *
 *  param： {
 *            onChange   PropTypes.func
 *            value      PropTypes.string
 *            disabled   PropTypes.bool
 *          }
 *
 ****************************************************/

class OrgSelect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            oldOrg:null,
        }
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

    orgPermCondition(){
        if(this.config.orgPermCondition){
            this.config.orgPermCondition();
        }
    }

    render(){
        this.config = this.props.config || {};
        return (
            <div>
                {Org({
                    onChange:this.onOrgChange.bind(this),
                    value:this.config.curOrg,
                    disabled: this.config.status && this.config.status == 'edit',
                    //queryCondition:this.orgPermCondition.bind(this)(),
                    queryCondition:function(){
                        return{
                            AppCode:'10140MPCLO',
                            GridRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
                        }
                    }
                })}
            </div>
        )
    }
}
export default OrgSelect
//s2DTWjxmhLuXYBeUGolGk17fDqHzOUtPDCL5AOpopJx63x2nB1g9JZtg66EutHrx