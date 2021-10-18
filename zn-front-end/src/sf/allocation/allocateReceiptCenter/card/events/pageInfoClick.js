/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
export default function (props, pks) {
    // 后台还没更新，暂不可用
     let formId ='form_allocatereceipt_head';
     let pkArr = [];
     if(pks){
        pkArr.push(pks);//主键数组
        let data = { pks: pkArr , pageid: '36320FARF_C01' };
        ajax({
            url: '/nccloud/sf/allocateReceiptCenter/queryPageCard.do',
            data: data,
            success: (res) => {
                //data要看返回的id，而不是后台设置的id
                if (res.data) {
                    this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                    props.setUrlParam(pks)//动态修改地址栏中的id的值
                    this.setState({
                        billno: res.data.head[formId].rows[0].values.vbillno.value
                    });
                } else {
                    this.props.form.setAllFormValue({ [formId]: { rows: [] } });
                }
                this.toggleShow();
            }
        });
     }
     
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/