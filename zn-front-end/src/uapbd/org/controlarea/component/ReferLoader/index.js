//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import {Component} from "react"
import createScript from './uapRefer'
import './index.less'
import { base } from 'nc-lightapp-front';
const { NCTooltip } = base;

/**
 * 参照加载组件
 */
export default class ReferLoader extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps){
    }
    
    render(){
        let props = {
            isMultiSelectedEnable:false,
        };
        Object.assign(props, this.props);
        let state = this.state;
        let refer = null;
        let tip = (<div>{props.tip}</div>)
        if(!state[props.tag]){
            createScript.call(this, props.refcode, props.tag);
        }else{
            refer = state[props.tag]?(state[props.tag])(props):<div/>
        }
        return (
            <div>
                {props.tip ? <NCTooltip trigger="hover" placement="top" inverse={true} overlay={tip}>
                    <div className="refer-wrapper">
                        {props.showStar ? <span className="required-star">*</span> : null}
                        {refer}
                    </div>
                </ NCTooltip> : <div className="refer-wrapper">
                        {props.showStar ? <span className="required-star">*</span> : null}
                        {refer}
                    </div>}
            </div>
        )
    }
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65