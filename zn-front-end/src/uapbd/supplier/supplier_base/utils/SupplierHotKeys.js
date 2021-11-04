//2MDmN2DWulIPEUFXK28h0z3ymZY5juHa2yzooC7gJ3UV/6XbkHE6q7Ny+w5uAs+4
import React,{Component} from 'react';
import {base} from 'nc-lightapp-front';
const {NCHotKeys} = base;
/**
 * 快捷键 工具类
 * 供应商弹窗快捷键都走该类
 * liupzhc
 * 2020-02-20 本组件职责单一
 */
class SupHotKeys extends Component{
    constructor(props){
        super(props);
        this.state = {
            ...this.props
        }
    }
    componentWillReceiveProps(newProps){
        Object.assign(this.state,newProps);
        this.setState(this.state);
    }
    render(){
        let {hotKeysCfg,btnComps} = this.state;
        return(
            <NCHotKeys {...hotKeysCfg}>
                {btnComps}
            </NCHotKeys>)}
}
export default SupHotKeys
//2MDmN2DWulIPEUFXK28h0z3ymZY5juHa2yzooC7gJ3UV/6XbkHE6q7Ny+w5uAs+4