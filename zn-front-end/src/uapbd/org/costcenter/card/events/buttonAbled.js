//FDj+EsPNpSmpNC5N8m6hV/ZwOxRITwM3bQoA7NDSgn7v678mF5ImHl8z4OP8LtoR
import {headButton, bodyButton, innerButton} from '../../common/btnName';

export default function(){
    if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
        //根节点设置按钮不可用 
        this.props.button.setDisabled({
            query:false,
            costcentergrp:true,
            more:true,
            import:false,
            export:true
        });
    }else{
        this.props.button.setDisabled({
            query:false,
            costcentergrp:false,
            more:false,
            import:false,
            export:false
        });
    }
    if(!this.state.curOrg.pk_org||this.state.curOrg.pk_org.length==0){
        //如果业务单元没有数据，需要停用复制和部门树版本化按钮
        this.props.button.setDisabled({
            costcentergrp:true
        });
    }else{
        this.props.button.setDisabled({
            costcentergrp:false
        });
    }
}
//FDj+EsPNpSmpNC5N8m6hV/ZwOxRITwM3bQoA7NDSgn7v678mF5ImHl8z4OP8LtoR