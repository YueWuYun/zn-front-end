/*W8YNa24IDSX5oNRyYONnS7hNfcB0TuPc/k2GR9iFunkIncn65th7yeWWDAADHHDU*/
import { ajax, toast } from 'nc-lightapp-front';
/**
 * [收款协同]-取消确认
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const unconfirmBtn = function (record, index) {
    let unconfirmBtnArr = [];
    unconfirmBtnArr.push(record.pk_recbill.value);
    let unconfirmBtnData = {
        'pks': unconfirmBtnArr,
        'pageid': this.pageId,
        'ts': record.ts.value
    };

    ajax({
        url: '/nccloud/cmp/recbill/recbillunsynconfirm.do',
        data: unconfirmBtnData,
        success: (res) => {
            toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000059') });/* 国际化处理： 取消确认成功*/
            let updateDataArr = [{
                index: index,
                data: { values: res.data.head[this.tableId].rows[0].values }
            }];
            this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
        }
    });
}

/*W8YNa24IDSX5oNRyYONnS7hNfcB0TuPc/k2GR9iFunkIncn65th7yeWWDAADHHDU*/