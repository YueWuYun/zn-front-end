//45ZtRO6mb1AJvCQU9qGd23TmKqx6Pkqks/o7UCbiENwKQVeLFEAGCXWRlrNt7edf
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,print} from 'nc-lightapp-front';
import CostcenterCard from '../card/index.js';
import CostcenterList from '../list/index.js';

class Costcenter extends Component {
    
    constructor(props){
        super(props);
        this.state={
            json:{},
            islist:'N',//是否为卡片界面
			cacheOrg:'',//维护卡片页面已选业务单元
            cacheRefPk:''//维护卡片页面左侧树已选节点pk
        };
    }

    //为子组建提供回调函数，更改state进而坐到组建切换效果
    switchView(value,data){
        setTimeout(() => {
            this.setState({islist:value,json:data.json,cacheOrg:data.cacheOrg,cacheRefPk:data.cacheRefPk});
        }, 10);
    }

    //渲染
    render(){
        let switchView=this.switchView.bind(this);
        switchView.json=this.state.json;
        console.log('switchView:', switchView)
        return (
            <div>
                {this.state.islist=='N'?
                <CostcenterCard config={switchView} json={this.state.json} cacheOrg={this.state.cacheOrg} cacheRefPk={this.state.cacheRefPk}/>
                :
                <CostcenterList config={switchView} cacheOrg={this.state.cacheOrg} cacheRefPk={this.state.cacheRefPk}/>
                }
            </div>
        )
    }
}



/**
 * 渲染页面
 */
ReactDOM.render(<Costcenter />, document.querySelector('#app'));

//45ZtRO6mb1AJvCQU9qGd23TmKqx6Pkqks/o7UCbiENwKQVeLFEAGCXWRlrNt7edf