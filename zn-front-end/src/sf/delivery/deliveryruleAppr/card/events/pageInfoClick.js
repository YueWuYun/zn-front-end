/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import { jsoncode,requesturl } from '../../util/const.js';
export default function (props, pks) {
	console.log(pks);
    // 后台还没更新，暂不可用
    let data = {
        "pk": pks,
        "pageid": jsoncode.cpageid
    };
    ajax({
        url: requesturl.querycard,
        data: data,
        success: (res) => {
            if (res.data) {
                if (res.data.head) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                     //切换页面需要重新设置一下单据号，才能实现单据号动态变动
                     this.setState({ billno: this.props.form.getFormItemsValue(jsoncode.formcode, 'vbillno') && this.props.form.getFormItemsValue(jsoncode.formcode, 'vbillno').value });
                }
                if (res.data.body) {
                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                }
                props.setUrlParam(pks)//动态修改地址栏中的id的值
            } else {
                this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                this.props.cardTable.setTableData(this.tableId, { rows: [] });
            }
            this.toggleShow();
        }
    });
}


/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/