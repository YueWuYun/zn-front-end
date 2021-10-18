/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
import { pkname,formId, FixedWithDrawApplyConst, card_head_hidden_buttons} from "../../cons/constant";
import { getCurrentLastId } from '../../../../../tmpub/pub/util/cache';
export const buttonVisible = function (props) {
    if (props.button.getButtons().length == 0) {
        return;
    }
    let Linkflag = props.getUrlParam('scene')==='linksce';
    let status = props.getUrlParam('status');
    let billstate = props.form.getFormItemsValue(formId, 'billstate');
    let nextId = getCurrentLastId(FixedWithDrawApplyConst.dataSource);
    if (status === 'add' || status === 'edit'||status === 'copy') {
        props.button.setButtonVisible(card_head_hidden_buttons, false);
        props.button.setButtonVisible(['Save','SaveAdd','SaveCommit', 'Cancel'], true);
        props.button.setMainButton(['Save'],true);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);//设置看片翻页的显隐性
    } else {
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);//设置看片翻页的显隐性
        if(!nextId){
            props.button.setButtonVisible(card_head_hidden_buttons, false);
            props.button.setButtonVisible(['Add'], true);
            props.button.setButtonDisabled(['Add'], false);
            props.button.setMainButton(['Add'],true);
            return;
        }
        //让所有按钮显示
        props.button.setButtonVisible(card_head_hidden_buttons, true);
        //让所有按钮可编辑
        props.button.setButtonDisabled(card_head_hidden_buttons, false);
        //下游单据联查过来的
        if(Linkflag){
            linkSuccButtonCtrl(props);
        }else{
            props.button.setMainButton(['Add'],false);
            // 待提交
            if (billstate.value == '1') {
                waitCommitButtonCtrl(props);
            }//待审批
            else if (billstate.value == '2') {
                waitApproveButtonCtrl(props);
            }//待办理
            else if (billstate.value == '3') {
                approveSuccButtonCtrl(props);
            }//办理中
            else if (billstate.value == '4') {
                workingButtonCtrl(props);
            }
            //已办理
            else if (billstate.value == '5'){
                workedButtonCtrl(props);
            }
        }
    }
}


/**
 * 待提交
 * @param {*} props 
 */
const waitCommitButtonCtrl = function (props) {
    props.button.setMainButton(['Commit'],true);
    props.button.setButtonVisible(['Save','SaveAdd','SaveCommit','Cancel','Consign','UnConsign','UnCommit'], false);
    
}

/**
 * 待审批
 * @param {*} props 
 * @param {*} record 
 */
const waitApproveButtonCtrl = function (props, record) {
    props.button.setMainButton(['Add'],true);
    props.button.setButtonVisible(['Save','SaveAdd','SaveCommit','Edit','Delete','Cancel','Consign','UnConsign','Commit'], false);
}

/**
 * 待办理
 * @param {*} props 
 */
const approveSuccButtonCtrl = function (props) {
    props.button.setMainButton(['Consign'],true);
    props.button.setButtonVisible(['Save','SaveAdd','SaveCommit','Edit','Delete','Cancel','UnConsign','Commit'], false);
}
/**
 * 办理中
 * @param {*} props 
 */
const workingButtonCtrl = function (props) {
    props.button.setMainButton(['Add'],true);
    props.button.setButtonVisible(['Save','SaveAdd','SaveCommit','Edit','Delete','Cancel','Commit','UnCommit','Consign'], false);
}
/**
 * 已办理
 * @param {*} props 
 */
const workedButtonCtrl = function (props) {
    props.button.setMainButton(['Add'],true);
    props.button.setButtonVisible(['Save','SaveAdd','SaveCommit','Edit','Delete','Cancel','Commit','UnCommit','Consign','UnConsign'], false);
}
/**
 * 联查场景
 * @param {*} props 
 */
const linkSuccButtonCtrl = function (props) {
    props.button.setButtonVisible(['Save','Add','Copy','UnCommit','Consign','UnConsign','SaveAdd','SaveCommit','Edit','Delete','Cancel','Commit'], false);
}

/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/