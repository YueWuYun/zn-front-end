//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1
import {ajax} from 'nc-lightapp-front';
export default function (props, config, pks) {
    let that = this;
    if(!pks || pks.length == 0){
        return ;
    }
    let data = {
        pk_bills: pks,
        pageId: this.pageId
    };
    ajax({
        url: '/nccloud/cm/inprocomstuff/querygridbyids.do',
        data: data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                if (data) {
                    props.table.setAllTableData(that.tableId, data[that.tableId]);
                } else {
                    props.table.setAllTableData(that.tableId, { rows: [] });
                }
            }
            that.onSelected();
        }
    });
}

//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1