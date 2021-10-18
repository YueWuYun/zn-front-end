/*2bbhPzLK7Syr9dMS3jutPMOxh5jHAVukm27Kp5A5qZPEJQGhs01DDfxMx6orsTRF*/
import { ajax, base, high, toast } from 'nc-lightapp-front';
/**
 * [收款结算]-计划预算按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const queryconsumeBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000014') });/* 国际化处理： 无数据，无法进行操作!*/
        return;
    }
    let queryconsume_pk = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    console.log(queryconsume_pk);
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
                    // this.sourceData=res.data;
                }
            }
        }
    });
}

/*2bbhPzLK7Syr9dMS3jutPMOxh5jHAVukm27Kp5A5qZPEJQGhs01DDfxMx6orsTRF*/