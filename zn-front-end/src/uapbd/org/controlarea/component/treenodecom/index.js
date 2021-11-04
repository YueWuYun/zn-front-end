//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { base,ajax} from 'nc-lightapp-front';
let { NCFormControl,NCForm } = base;
const { NCFormItem } = NCForm
class TreeNodeCom extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
        //初始化树
        this.props.queryRuleData.call(this);
    }
    render(){
        let { table, button, search,DragWidthCom,syncTree,editTable} = this.props;
        let {createSyncTree} = syncTree;
        return (
            <div>
                <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                    <label style={{width: '8%'}}>管控范围</label>
                    <NCFormControl
                    style={{
                        width: '30%',
                        margin: '0 10px',
                    }}
                     disabled value={this.props.controlContent}/>
                </div>
                <div>
                    {createSyncTree({
                        defaultExpandAll: true,
                        treeId: "treeId",
                        needEdit: false,
                        needSearch: false,
                        defaultExpandAll :false
                        // onSelectEve: (data)=>{this.props.queryRuleData.bind(this,data)}
                    })}
                </div>
            </div>
        )
    }
}
export default TreeNodeCom;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65