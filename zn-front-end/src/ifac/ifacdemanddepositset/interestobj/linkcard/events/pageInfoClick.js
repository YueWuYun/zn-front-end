/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import {ajax} from 'nc-lightapp-front';
export default function (props, pks) {
    props.setUrlParam(pks)//动态修改地址栏中的id的值
    // 后台还没更新，暂不可用
    let data = {
        "pk": pks,
        "pageCode": this.pageId
    };
    ajax({
        url: '/nccloud/cmp/apply/applyCardQuery.do',
        data: data,
        success: (res) => {
            if (res.data) {
                if (res.data.head) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                }
                if (res.data.bodys) {
                    this.props.cardTable.setTableData(this.tableId, res.data.bodys[this.tableId]);
                }                
            } else {
                this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                this.props.cardTable.setTableData(this.tableId, { rows: [] });
            }
        }
    });
    this.toggleShow();
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/