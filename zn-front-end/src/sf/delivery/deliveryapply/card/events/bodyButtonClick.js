/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { initTemplate } from './initTemplate';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator } from '../../../../pub/utils/SFButtonUtil';
import { jsoncode } from '../../util/const';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
let { setDefData, getDefData } = cardCache;
export const bodyButtonClick = function (props, key, text, record, index, tableId) {
    const pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') && props.form.getFormItemsValue(this.formId, 'pk_org').value;
    if (!pk_org) {
        toast({
            'color': 'warning',
            'content': loadMultiLang(props, '36320DA-000008')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
    let status = props.getUrlParam('status');
    switch (key) {
        //肩部 增行
        case 'addline':
            let number = props.cardTable.getNumberOfRows(this.tableId);
            props.cardTable.addRow(
                this.tableId,
                number,
                { //表体付款单位内部账户，必须是表体财务组织在上收组织开立的内部账户
                    //所以表体需要表头的财务组织进行判断，这是nc的后端逻辑
                    'pk_org': { value: pk_org },
                    'recordstatus': { display: loadMultiLang(props, '36320DA-000007'), value: '1' }/* 国际化处理： 正常*/
                },
                false);
            if (props.form.getFormItemsValue(jsoncode.formcode, 'busitype').value === '2') {//中心上收 给内部账户赋值
                //先从缓存中取值
                let accidData = getDefData('accidData', jsoncode.dataSource);
                if (accidData != null) {
                    props.cardTable.setValByKeyAndIndex(jsoncode.ctablecode, number, 'pk_accid',
                        { value: accidData.split(',')[0], display: accidData.split(',')[1] });
                }
            }
            break;
        //肩部 删行
        case 'deleteline':
            //bein tm tangleic 20190229 肩部删除考虑闪光表体后对肩部按钮的可用性控制
            // BatchDelLine(props, jsoncode.ctablecode);
            batchDeleteLine(props);
            //end tangleic
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
            if (status == 'browse') {
                props.cardTable.toggleRowView(jsoncode.ctablecode, record);
            } else {
                Open(props, jsoncode.ctablecode, index, record, 'edit');
            }
            break;
        default:
            break;
    }
}

/**
 * 批量删除表体
 * @param {*} props 
 */
const batchDeleteLine = function (props) {
    //获取选中的行
    let selectRows = props.cardTable.getCheckedRows(jsoncode.ctablecode);
    //获取表体行总数
    let count = props.cardTable.getNumberOfRows(jsoncode.ctablecode);
    if (selectRows && selectRows.length > 0) {
        //当前表体行总数<=要删除的行数 控制肩部按钮可用性
        if (count <= selectRows.length) {
            props.button.setButtonDisabled(['deleteline', 'copyline'], true);
            props.button.setButtonDisabled(['addline'], false);
        }
    }
    BatchDelLine(props, jsoncode.ctablecode);
}
/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/