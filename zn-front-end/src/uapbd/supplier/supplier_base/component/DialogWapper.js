//77g/1g8bjCig1tWhTb3MAJCr/17ZAYt0bjl5GmcvRtL2tp7/CrtGjV8S8FLyN6jX
import {base} from 'nc-lightapp-front';
import Dialog from './Dialog';
let { NCModal} = base;
import './Common.less'
var EMPTY_FN = function(){};
class DialogWapper  extends Dialog {
    constructor(props) {
        super(props);
        this.state = {
           ...this.state,
           modelcfg:{
             onHide : this.close,
             backdrop:'static'
           }
        }
        

    }
    render(){
        let {buttons,hotKeysCfg,modelcfg,showDialog,dialogSize,fieldid,dialogZIndex} = this.state;
        let maxModalCls = dialogSize === "max" ? "nc-modal-max" : "";
        let modelconfig = {
            ...modelcfg,
            show:showDialog,
            size:dialogSize,
            className:`${maxModalCls} ${dialogZIndex}`,
            fieldid:this.props.fieldid || fieldid|| this.state.dialogTitle
        };
        return (
                <NCModal {...modelconfig} zIndex="211">
                        <NCModal.Header closeButton>
                            <NCModal.Title>{this.state.dialogTitle || ''}</NCModal.Title>
                        </NCModal.Header>
                        <NCModal.Body>
                            {this.state.listener.renderContentArea ? this.state.listener.renderContentArea():this.props.Lang['10140SUG-000075']/* 国际化处理： 无数据!*/}
                        </NCModal.Body>
                        {this.state.showFooter && 
                        <NCModal.Footer>
                        {this.state.showDefaultBtn?this.renderDefaultButtons():this.state.listener.renderButtons?this.listener.renderButtons():null}
                        </NCModal.Footer>}
                </NCModal>
        )
    }
}
export default DialogWapper;
//77g/1g8bjCig1tWhTb3MAJCr/17ZAYt0bjl5GmcvRtL2tp7/CrtGjV8S8FLyN6jX