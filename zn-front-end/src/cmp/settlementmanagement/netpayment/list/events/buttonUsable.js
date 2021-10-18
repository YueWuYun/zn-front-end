/*cdIC5sEN8kUbd7loJ4DoBtasCAXOFBCwOdYbZ2TjbPIR3AlLNTXYs8QNem07f77h*/
import {Templatedata} from "../../config/Templatedata";


/**
 * 控制按钮是否可点js
 * @param {} that this
 * @param {*} props 
 * @param {*} key 是标识哪种状态0-5,5:全部选择
 */
export default function buttonUsable(props, key) {
    let buttons = [];
    let selectedData = props.table.getCheckedRows(this.tableId);
    // 有选择数据打印按钮
    if (selectedData && selectedData.length > 0) {
        this.props.button.setButtonDisabled(Templatedata.payBtn,false);
        this.props.button.setButtonDisabled('updatePayStatus',false);
        this.props.button.setButtonDisabled(Templatedata.linkNetBankBtn,false);
        this.props.button.setButtonDisabled(Templatedata.linkPayAffirmBtn,false);
        props.button.setButtonDisabled(Templatedata.otherGruop, false);
    } else {
        this.props.button.setButtonDisabled(Templatedata.payBtn,true);
        this.props.button.setButtonDisabled('updatePayStatus',true);
        this.props.button.setButtonDisabled(Templatedata.linkNetBankBtn,true);
        this.props.button.setButtonDisabled(Templatedata.linkPayAffirmBtn,true);
        this.props.button.setButtonDisabled(Templatedata.otherGruop,true);
    }
    // 需要单个操作的按钮
    /**1.补录preparenetBtn
     * 2.红冲redHandleBtn
     * 
     */
    if(!key || key=='5'){
        let singalbutton = ['preparenetBtn','redHandleBtn'];
        if (selectedData && selectedData.length > 1) {
            // 选择大于1条
            props.button.setButtonDisabled(singalbutton, true); 
            return;
        }else if(selectedData && selectedData.length==1){
            // 选择1条
            props.button.setButtonDisabled(singalbutton, false); 
            return;
        }else{
            return;
        }

    }
    switch(key){
        case '0':
        // 全部页签
        // 不处理
        break;
        case '1':
        // 未结算
            props.button.setButtonDisabled(Templatedata.combinpayBtn, true);
            props.button.setButtonDisabled(Templatedata.redHandleBtn, true);
            props.button.setButtonDisabled(Templatedata.updatePayStatus, true);
            break;
        case '2':
            // 支付中,可以更新支付状态
            props.button.setButtonDisabled(Templatedata.updatePayStatus, false);
            props.button.setButtonDisabled(Templatedata.combinpayBtn, true);
            props.button.setButtonDisabled(Templatedata.redHandleBtn, true);
            props.button.setButtonDisabled(Templatedata.netpayBtn, true);
            props.button.setButtonDisabled(Templatedata.preparenetBtn, true);
            break;
        case '3':
            // 部分成功，可以结算红冲
            props.button.setButtonDisabled(Templatedata.updatePayStatus, true);
            props.button.setButtonDisabled(Templatedata.combinpayBtn, true);
            props.button.setButtonDisabled(Templatedata.redHandleBtn, false);
            props.button.setButtonDisabled(Templatedata.netpayBtn, false);
            props.button.setButtonDisabled(Templatedata.preparenetBtn, true);
            break;
        default:
        break;
    }

}



/*cdIC5sEN8kUbd7loJ4DoBtasCAXOFBCwOdYbZ2TjbPIR3AlLNTXYs8QNem07f77h*/