/*j7poyo7HxQnbt42cQsbQparkFQ96Lwmuxz/8Q867ptEz21Vzd6sbWBOSLJObJIzj*/
import { ajax, toast } from 'nc-lightapp-front';
/**
 * [收款]-红冲按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const redbillBtn = function () {
    let redbillBtnData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (redbillBtnData.length != 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000097') });/* 国际化处理： 请选择单条数据，进行红冲!*/
        return;
    }
    let redlistTsmap = [];//ts的list类型
    let redbill_pk = null;
    let index = 0;
    redbillBtnData.forEach((val) => {
        redbill_pk = val.data.values.pk_recbill.value;
        index = val.index;
        let redtsmap = {
            'pk': val.data.values.pk_recbill.value,
            'ts': val.data.values.ts.value,
            'index': val.index
        }
        redlistTsmap.push(redtsmap);
    });

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