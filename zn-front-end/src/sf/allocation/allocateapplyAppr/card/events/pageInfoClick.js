/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
export default function (props, pks) {
	let pkArr = [];
    // 后台还没更新，暂不可用
    if(pks){
        pkArr.push(pks);
    }
    let data = {
        pks: pkArr,
        pageid: "36320AA_C01"
    };
    ajax({
        url: '/nccloud/sf/allocateapply/queryPageCard.do',
        data: data,
        success: (res) => {
            if (res.data) {
                if (res.data.head) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                }
                if (res.data.body) {
                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                }
                props.setUrlParam(pks)//动态修改地址栏中的id的值
            } else {
                this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                this.props.cardTable.setTableData(this.tableId, { rows: [] });
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/