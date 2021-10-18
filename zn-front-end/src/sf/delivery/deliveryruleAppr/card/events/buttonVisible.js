/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';

export const buttonVisible = function (props) {
    let status = props.getUrlParam('status');
    let visible = true;
    let flag = status === 'browse' ? false : true;
    let copyflag = this.state.copyflag || false;
    //设置分页按钮均不可见
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    // 设置所有按钮不可见
    props.button.setButtonVisible(
        ['Save', 'Saveadd', 'Savecommit', 'Cancel', 'Add',
            'Edit', 'Copy', 'Delete', 'Commit', 'Uncommit', 'Enable', 'Disable',
            'Enablefirst', 'BankAccReWrite', 'BankAccBrowse', 'Refresh'
        ],
        !visible
    );
    //复制
    if (status === 'copy') {
        //编辑状态：显示按钮：保存，保存新增，取消
        props.button.setButtonVisible(
            ['Save', 'Saveadd', 'Cancel'],
            visible
        );
    }
    // 编辑状态
    if (status === 'edit' || status === 'add') {
        // 编辑状态：显示按钮：保存，保存提交，取消
        props.button.setButtonVisible(
            ['Save', 'Saveadd', 'Savecommit', 'Cancel'],
            visible
        );

    }
    if (status === 'browse') {
        // 按照状态区分
        let billstatus = props.form.getFormItemsValue(jsoncode.formcode, 'billstatus');
        billstatus = billstatus && billstatus.value;
        // 单据号，保存了才有，用来区分有没有保存
        let vbillno = props.form.getFormItemsValue(jsoncode.formcode, 'vbillno');
        vbillno = vbillno && vbillno.value;
        // 单据浏览-待提交：新增、修改、删除、复制、提交、 网银补录、网银浏览、刷新
        if (billstatus == '3' && vbillno) {
            props.button.setButtonVisible(
                ['Add', 'Edit', 'Delete', 'Copy', 'Commit', 'BankAccReWrite', 'BankAccBrowse', 'Refresh'],
                visible
            );
            //设置翻页按钮可见 
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            //设置新增按钮为灰，提交为红色
            props.button.setMainButton(['Commit'], true);
            props.button.setMainButton(['Add'], false);
        }
        // 单据浏览-待审批：新增、复制、收回、刷新
        if (billstatus == '1') {
            props.button.setButtonVisible(
                ['Add', 'Copy', 'Uncommit', 'BankAccReWrite', 'BankAccBrowse', 'Refresh'],
                visible
            );
            //设置翻页按钮可见 
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
        // 单据状态-已审批
        if (billstatus == '2') {
            // 启用、停用（字段为  封存：false、true）
            let isenable = props.form.getFormItemsValue(jsoncode.formcode, 'isenable');
            isenable = isenable && isenable.value;
            // 启用
            if (isenable) {
                // 单据浏览-停用：收回，新增、复制、启用、联查、网银补录；
                props.button.setButtonVisible(
                    ['Uncommit', 'Add', 'Copy', 'BankAccReWrite', 'BankAccBrowse', 'Enable', 'Refresh'],
                    visible
                );
                //设置翻页按钮可见 
                props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
            } else {
                // 单据浏览-启用：收回，新增、复制、停用、联查、网银补录；
                props.button.setButtonVisible(
                    ['Uncommit', 'Add', 'Copy', 'BankAccReWrite', 'BankAccBrowse', 'Disable', 'Refresh'],
                    visible
                );
            }
            //设置翻页按钮可见 
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
        //此状态为 新增时，选过组织后。点取消
        if (billstatus == '3' && !vbillno) {
            props.button.setButtonVisible(
                ['Add'],
                visible
            );
            //设置新增为红色（主要是给复制后，点取消，这时新增按钮需要处理一下）
            props.button.setMainButton(['Add'], true);
            // 清空表单form所有数据
            props.form.EmptyAllFormValue(this.formId);
            //清空table所有数据
            props.cardTable.setTableData(this.tableId, { rows: [] });
        }
        //此状态为 新增时，未选组织，直接点取消
        if (!billstatus && !vbillno) {
            props.button.setButtonVisible(
                ['Add'],
                visible
            );

        }
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