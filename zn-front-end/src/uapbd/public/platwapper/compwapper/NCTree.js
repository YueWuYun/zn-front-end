//uS2aoRGqsbcoS3n96SrA7+8xybHMG7pjZcwNdULFGa4aIsLfcC/Lp8eWy7h7EUut
import {base} from 'nc-lightapp-front';
import React, { Component } from 'react';

let { NCTree:BaseNCTree ,NCDiv} = base;
const TreeNode = BaseNCTree.NCTreeNode;
var EMPTY_FN = function(){};
class NCTree  extends Component {
    constructor(props) {
        super(props);
        
    }
    getParentDomFieldId = (ele)=>{
        let curDom = ReactDOM.findDOMNode(ele);
        if(!curDom){
            return null;
        }
        const getParent = (dom)=>{
            while(dom.parentElement){
                if(!dom.parentElement.hasAttribute("fieldid")){
                    return getParent(dom.parentElement);
                }
                return dom.parentElement.getAttribute("fieldid");
            }
            // return fieldid;
        }
        return getParent(curDom);
        
    }
    render(){
        let parentFieldid = this.getParentDomFieldId(this);
        let fieldkey = parentFieldid && parentFieldid.substr(0,parentFieldid.indexOf("_"));
        let field = this.props.fieldid || fieldkey || this.props.treeId || "basetree_comp";
        var newProps = { 
            ...this.props,
            fieldid:field,
            openIcon:(<i fieldid="opentree-switcher"   class="icon iconfont icon-shu_zk tree-swich"></i>),
            closeIcon:(<i fieldid="closetree-switcher"  class="icon iconfont icon-shushouqi tree-swich"></i>)
        };
        
        return (
            <NCDiv fieldid= {field} areaCode={NCDiv.config.TreeCom}><BaseNCTree {...newProps}/></NCDiv>
        )
    }
}


// var noderender =  TreeNode.prototype.render;
// TreeNode.prototype.render = function(){
//     var title  = this.props.title || '';
//     this.props = {
//         ...this.props,
//         liAttr:{fieldid:this.props.liAttr?this.props.liAttr.fieldid:this.props.eventKey+"_node"},
//         title: <span>{title}</span>
//     };

//     return noderender.call(this)
// }

NCTree.NCTreeNode = TreeNode;
export default NCTree;
//uS2aoRGqsbcoS3n96SrA7+8xybHMG7pjZcwNdULFGa4aIsLfcC/Lp8eWy7h7EUut