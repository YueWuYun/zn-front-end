/*2bbhPzLK7Syr9dMS3jutPMOxh5jHAVukm27Kp5A5qZPEJQGhs01DDfxMx6orsTRF*/
import { ajax, toast } from 'nc-lightapp-front';

/**
 * [收款]-联查计划预算按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const queryconsumeBtn = function () {
    let queryconsumeData = this.props.table.getCheckedRows(this.tableId);

    if (queryconsumeData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000077') });/* 国际化处理： 请选择数据，进行联查预算!*/
        return;
    }
    let queryconsume_pk = null;
    queryconsumeData.forEach((val) => {
        queryconsume_pk = val.data.values.pk_recbill.value;
    });
    let queryconsume_data = { pk: queryconsume_pk, pageid: this.pageId };
    ajax({
        url: '/nccloud/cmp/recbill/linkplan.do',
        data: queryconsume_data,
        success: (res) => {
            let { success, data } = res;
            if (res.data) {
                if (res.data.hint && res.data.hint.length > 0) {
                    toast({ color: 'warning', content: res.data.hint });
                    return;
                } else {
                    this.setState({
                        showInspection: true,
                        sourceData: res.data
                    });
                }
            }
        }
    });
}

/*2bbhPzLK7Syr9dMS3jutPMOxh5jHAVukm27Kp5A5qZPEJQGhs01DDfxMx6orsTRF*/