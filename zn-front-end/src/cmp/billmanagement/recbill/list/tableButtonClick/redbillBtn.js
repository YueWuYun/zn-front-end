/*j7poyo7HxQnbt42cQsbQparkFQ96Lwmuxz/8Q867ptEz21Vzd6sbWBOSLJObJIzj*/
import { ajax, toast } from 'nc-lightapp-front';
/**
 * [收款结算]-红冲按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const redbillBtn = function (record, index) {
    if (record.effect_flag.value != '10') {
        toast(
            {
                color: 'warning',
                content: '红冲单据必须为生效状态!'
            }
        );/* 国际化处理： 操作失败，无数据!*/
    }
    let redlistTsmap = [];//ts的list类型
    let redbill_pk = record.pk_recbill.value;
    let redtsmap = {
        'pk': record.pk_recbill.value,
        'ts': record.ts.value,
        'index': index
    }
    redlistTsmap.push(redtsmap);
    let reddata =
    {
        'pk': redbill_pk,
        'pageid': this.pageId,
        'listTsmap': redlistTsmap
    };

    ajax({
        url: '/nccloud/cmp/recbill/recbillredhandle.do',
        data: reddata,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000075') });/* 国际化处理： 红冲成功*/
                let reddataArr = res.data[this.tableId];
                this.props.table.addRow(this.tableId, reddataArr);//新增数据
            }
        }
    });

}

/*j7poyo7HxQnbt42cQsbQparkFQ96Lwmuxz/8Q867ptEz21Vzd6sbWBOSLJObJIzj*/