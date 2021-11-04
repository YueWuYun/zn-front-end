//wzcVstBK6/y6V63ingjLS+upSFl12U4hWZ4IWIz5RV49CrrC7R/fkS93Ir6ulzdY
import { cacheTools } from 'nc-lightapp-front';
import { formId, tableId,pagecode} from '../constants';
import {buttonVisible,initCardBodyEditControl} from '../../../../public/excomponents/pubUtils/buttonVisible';

/**
 * 页面状态属性设置方法
 */

export default (that,props,saveflag) => {
    let status = props.getUrlParam('status');
    let status1 = null;//控制页面状态
    if (!status) {
        status = 'browse';
    }
    let head = that.props.createMasterChildData(pagecode, formId, tableId).head[formId];
    if(head == null){
        return;
    }
    let cardhead = that.props.createMasterChildData(pagecode, formId, tableId).head[formId].rows[0].values;
    let pk_org = cardhead ? cardhead.pk_org : null;
    if (status != 'browse' ) {
        that.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        that.props.BillHeadInfo.setBillHeadInfoVisible({ showBackBtn: false });
        status1= 'edit';
    }else{
        if(!pk_org || !pk_org.value){
            that.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            that.props.BillHeadInfo.setBillHeadInfoVisible({ showBackBtn: false });
        }
        that.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        that.props.BillHeadInfo.setBillHeadInfoVisible({ showBackBtn: true });
        status1= 'browse';
    }
    if(!saveflag)
    {//flag传入true 不更新页面状态
        props.form.setFormStatus(formId, status1);
        props.cardTable.setStatus(tableId, status1);
    }
	let trueBtn = []; //可见的按钮
    let falseBtn = []; //不可见的按钮
    for (let i = 0; i < that.Info.allButtonsKey.length; i++) {
        let flag = buttonVisible(that,cardhead,that.Info.allButtonsKey[i],'card');
        if (flag) {
            trueBtn.push(that.Info.allButtonsKey[i]);
        } else {
            falseBtn.push(that.Info.allButtonsKey[i]);
        }
    }
    //初始化肩部按钮信息增行等按钮的控制
    if (status != 'browse') {
        initCardBodyEditControl(that.props, cardhead.pk_org ? cardhead.pk_org.value : null);
        that.props.button.setButtonDisabled(['AddLine'], false);
    } 
    that.props.button.setButtonVisible(trueBtn, true);
    that.props.button.setButtonVisible(falseBtn, false);
}
//wzcVstBK6/y6V63ingjLS+upSFl12U4hWZ4IWIz5RV49CrrC7R/fkS93Ir6ulzdY