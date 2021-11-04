//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,print} from 'nc-lightapp-front';
import DeptList from '../list/index.js';
import DeptCard from '../card/index.js';

class Dept extends Component {
    
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
        return (
            <div>
                {this.state.islist=='N'?
                <DeptCard {...{config:{
                    switchView,
                    appid:'0001Z0100000000047F2',
                    pageCode:'10100DEPT_dept',
                    nodeType:'GLOBE_NODE',
                    formId:'dept',
                    treeId:'deptTree',
                    isGlbGrp:'0',
                    json:this.state.json//如果从列表条卡片，避免页面加载速度造成的多语资源问题
                }}} cacheOrg={this.state.cacheOrg} cacheRefPk={this.state.cacheRefPk}/>
                :
                <DeptList config={switchView} cacheOrg={this.state.cacheOrg} cacheRefPk={this.state.cacheRefPk}/>
                }
            </div>
        )
    }
}




/**
 * 渲染页面
 */
ReactDOM.render(<Dept />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65