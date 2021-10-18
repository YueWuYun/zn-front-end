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
    //设置表头所有按钮不可见
    props.button.setButtonVisible(
        [
            'saveBtn', 'saveaddBtn', 'savecommitBtn', 'cancelBtn', 'Linkedquery', 'Print',
            'commitBtn', 'copyBtn', 'deleteBtn', 'editBtn', 'addBtn', 'Enclosure', 'Uncommit',
            'Entrust', 'Unentrust', 'Refresh', 'Add', 'ReturnBill', 'Spxq'//回单跟审批详情，需要根据特定状态显隐，在这先全不显示

        ],
        !visible
    );
    //编辑状态(编辑、新增)
    if (status === 'edit' || status === 'add') {
        //编辑状态：显示按钮：保存，保存新增，保存提交，取消,联查
        props.button.setButtonVisible(
            ['saveBtn', 'saveaddBtn', 'savecommitBtn', 'cancelBtn', 'Linkedquery'],
            visible
        );
    }
    //复制
    if (status === 'copy') {
        //编辑状态：显示按钮：保存，保存新增，保存提交，取消,联查
        props.button.setButtonVisible(
            ['saveBtn', 'saveaddBtn', 'savecommitBtn', 'cancelBtn', 'Linkedquery'],
            visible
        );
    }
    //浏览态
    if (status === 'browse') {
        //待提交
        if (billstatus == '5' && vbillno) {
            props.button.setButtonVisible(
                ['addBtn', 'editBtn', 'deleteBtn', 'copyBtn', 'commitBtn', 'Enclosure', 'Linkedquery', 'Print', 'Refresh'],
                visible
            );

            //设置新增按钮为灰，提交为红色
            props.button.setMainButton(['commitBtn'], true);
            props.button.setMainButton(['addBtn'], false);
        }
        //待审批
        if (billstatus == '1') {
            props.button.setButtonVisible(
                ['addBtn', 'copyBtn', 'Uncommit', 'Enclosure', 'Linkedquery', 'Spxq', 'Print', 'Refresh'],
                visible
            );

        }
        //待委托
        if (billstatus == '2') {
            props.button.setButtonVisible(
                ['addBtn', 'copyBtn', 'Uncommit', 'Entrust', 'Enclosure', 'Linkedquery', 'Spxq', 'Print', 'Refresh'],
                visible
            );
            //取消委托办理的时候，委托人与委托时间需要制空，而后台动作脚本中并没有清空，我这里前台处理一下
            props.form.setFormItemsValue(this.formId,{'submitdate':{display:'',value:null},'submituser':{display:'',value:null}});
            props.button.setMainButton(['addBtn'], false);
        }
        //处理中
        if (billstatus == '3') {
            props.button.setButtonVisible(
                ['addBtn', 'copyBtn', 'Unentrust', 'Enclosure', 'Linkedquery', 'Spxq', 'Print', 'Refresh'],
                visible
            );
            props.button.setMainButton(['addBtn'], true);
            props.button.setMainButton(['Unentrust'], false);
        }
        //处理完成
        if (billstatus == '4') {
            //只有处理完成的，联查中才有回单
            props.button.setButtonVisible(
                ['addBtn', 'copyBtn', 'Enclosure', 'Linkedquery', 'ReturnBill', 'Spxq', 'Print', 'Refresh'],
                visible
            );

        }
        //此状态为 新增时，选过组织后。点取消
        if (billstatus == '5' && !vbillno) {
            props.button.setButtonVisible(
                ['addBtn'],
                visible
            );
            //设置新增为红色（主要是给复制后，点取消，这时新增按钮需要处理一下）
            props.button.setMainButton(['addBtn'], true);
            // 清空表单form所有数据
            props.form.EmptyAllFormValue(this.formId);
            //清空table所有数据
            props.cardTable.setTableData(this.tableId, { rows: [] });
        }
        //此状态为 新增时，未选组织，直接点取消
        if (!billstatus && !vbillno) {
            props.button.setButtonVisible(
                ['addBtn'],
                visible
            );
            //设置新增为红色
            props.button.setMainButton(['addBtn'], true);
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
    //浏览态可见，其余状态不可见
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
    // 只要不是浏览态，就将主表、子表赋予可编辑（目前主要是给copy用）
    status = status == 'browse' ? 'browse' : 'edit';
    props.form.setFormStatus(jsoncode.formcode, status);
    props.cardTable.setStatus(jsoncode.ctablecode, status);
}

/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/