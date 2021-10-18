/*dVcbd6ClyAyox83SGUDvnJVDitIRllk69pDNsT2MsAc97J4+yE1Knv0jbzI/KM9E*/
import { ajax } from 'nc-lightapp-front';
/**
 * [收款]-联查计划预算
 * [改造：单条跳卡片，多条留列表]
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const getLinkplanData = function (serval) {
    ajax({
        url: '/nccloud/cmp/recbill/linkplanquery.do',
        data: { pk: this.props.getUrlParam('pk_ntbparadimvo'), pageid: this.pageId },
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    let values = data[this.tableId].rows;
                    console.log("预算反联查:" + values);
                    //1条数据跳转到卡片页面
                    if (values.length == 1) {
                        let record = values[0];
                        this.props.pushTo('/card', {
                            status: 'browse',
                            id: record.values.pk_recbill.value,
                            scene: 'linksce',
                            pagecode: this.cardPageId
                        });
                    } else {
                        //2多条数据跳转到列表页面
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                    }
                } else {
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        }
    });
}

/*dVcbd6ClyAyox83SGUDvnJVDitIRllk69pDNsT2MsAc97J4+yE1Knv0jbzI/KM9E*/