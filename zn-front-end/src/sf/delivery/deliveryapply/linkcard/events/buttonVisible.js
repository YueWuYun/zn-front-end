/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';

export const buttonVisible = function (props) {
    let status = props.getUrlParam('status');
    let visible = true;
    //按照状态区分
    let billstatus = props.form.getFormItemsValue(jsoncode.formcode, 'billstatus');
    billstatus = billstatus && billstatus.value;
    // 单据号，保存了才有，用来区分有没有保存
    let vbillno = props.form.getFormItemsValue(jsoncode.formcode, 'vbillno');
    vbillno = vbillno && vbillno.value;
    let flag = status === 'browse' ? false : true;
    let copyflag = this.state.copyflag || false;

    // let vbillstatus = props.form.getFormItemsValue(jsoncode.formcode, 'vbillstatus');
    // vbillstatus = vbillstatus && vbillstatus.value;
    //设置分页按钮均不可见
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    //设置表头所有按钮不可见
    props.button.setButtonVisible(
        [
            'saveBtn', 'saveaddBtn', 'savecommitBtn', 'cancelBtn', 'Linkedquery', 'Print',
            'commitBtn', 'copyBtn', 'deleteBtn', 'editBtn', 'addBtn', 'Enclosure', 'Uncommit',
            'Entrust', 'Unentrust', 'Refresh', 'Add', 'ReturnBill', 'Spxq'//回单跟审批详情，需要根据特定状态显隐，在这先全不显示

        ],
        !visible
    );

    //浏览态
    if (status === 'browse') {
            //被联查页面不显示刷新
            props.button.setButtonVisible(
                [ 'Enclosure', 'Linkedquery', 'Print', ''],
                visible
            );
    }
    if (flag && !copyflag) {
        props.button.setButtonVisible(['addline', 'deleteline', 'copyline'], true);
        props.button.setButtonVisible(['copytoendline', 'cancelcopy'], false);
    } else {
        if (flag) {
            props.button.setButtonVisible(['copytoendline', 'cancelcopy'], true);
            props.button.setButtonVisible(['addline', 'deleteline', 'copyline'], false);
        } else {
            props.button.setButtonVisible(['copytoendline', 'cancelcopy'], false);
            props.button.setButtonVisible(['addline', 'deleteline', 'copyline'], false);
        }
    }



    // 只要不是浏览态，就将主表、子表赋予可编辑（目前主要是给copy用）
    status = status == 'browse' ? 'browse' : 'edit';
    props.form.setFormStatus(jsoncode.formcode, status);
    props.cardTable.setStatus(jsoncode.ctablecode, status);
}

/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/