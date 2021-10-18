/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { initTemplate } from './initTemplate';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator } from '../../../../pub/utils/SFButtonUtil';
import { jsoncode } from '../../util/const';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
export const bodyButtonClick = function (props, key, text, record, index, tableId) {
    // let status = props.getUrlParam("status");
    const pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') && props.form.getFormItemsValue(this.formId, 'pk_org').value;
    if (!pk_org) {
        toast({
            'color': 'warning',
            'content': loadMultiLang(props, '36320DA-000008')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
    switch (key) {
        //肩部 增行
        case 'addline':
            //AddLine(props, jsoncode.ctablecode);
            let number = props.cardTable.getNumberOfRows(this.tableId);
            // props.cardTable.addRow(
            //     this.tableId,
            //     number,
            //     { 'recordstatus': { display: '正常', value: '1' } },
            // );
            props.cardTable.addRow(
                this.tableId,
                number,
                { //表体付款单位内部账户，必须是表体财务组织在上收组织开立的内部账户
                    //所以表体需要表头的财务组织进行判断，这是nc的后端逻辑
                    'pk_org': { value: pk_org },
                    'recordstatus': { display: loadMultiLang(props, '36320DA-000007'), value: '1' }/* 国际化处理： 正常*/
                },
                false);
            break;
        //肩部 删行
        case 'deleteline':
            BatchDelLine(props, jsoncode.ctablecode);
            break;
        //肩部 复制行
        case 'copyline':
            let selectRows = props.cardTable.getCheckedRows(jsoncode.ctablecode);
            if (selectRows == null || selectRows.length == 0) {
                toast({
                    'color': 'warning',
                    'content': loadMultiLang(props, '36320DA-000009')/* 国际化处理： 未选中要复制的行*/
                });
                return false;
            }
            this.setState({ copyflag: true }, () => { this.toggleShow() });
            break;
        //粘贴至末行
        case 'copytoendline':
            index = this.props.cardTable.getNumberOfRows(jsoncode.ctablecode);
            BatchCopy(props, jsoncode.ctablecode, index, 'pk_deliveryapply_b');
            this.setState({ copyflag: false }, () => { this.toggleShow() });
            break;
        //粘贴至此
        case 'copythis':
            BatchCopy.call(this, props, jsoncode.ctablecode, index, 'pk_deliveryapply_b');
            this.setState({ copyflag: false }, () => { this.toggleShow() });
            break;
        //取消复制
        case 'cancelcopy':
            this.setState({ copyflag: false }, () => { this.toggleShow() });
            break;
        //行 展开
        case 'open':
            Open(props, jsoncode.ctablecode, index, record, 'edit');
            break;
        //行 复制
        case 'copyrow':
            CopyLine(props, jsoncode.ctablecode, index);
            break;
        case 'insertrow':
            InsertLine(props, jsoncode.ctablecode, index);
            break;
        //行 删除
        case 'deleterow':
            DelLine(props, jsoncode.ctablecode, index);
            break;
        //展开（浏览态）
        case 'opendown':
        //收起
        case 'closedown':
            props.cardTable.toggleRowView(jsoncode.ctablecode, record);
            break;
        default:
            break;
    }
}


/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/