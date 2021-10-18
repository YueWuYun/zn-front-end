/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
export default function (props, pks) {
    // 后台还没更新，暂不可用
     let pkArr = [];
     if(pks){
        pkArr.push(pks);//主键数组
        let data = {
           "pks": pkArr,
           "pageid": "36320FCRF_C01"
       };
        ajax({
            url: '/nccloud/sf/deliveryReceiptCenter/queryCard.do',
            data: data,
            success: (res) => {
                //data要看返回的id，而不是后台设置的id
                if (res.data) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    // this.toggleShow();
                    props.setUrlParam(pks)//动态修改地址栏中的id的值
                    this.setState({
                        billno: res.data.head[this.formId].rows[0].values.vbillno.value
                    });
                } else {
                    this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                }
                this.toggleShow();
            }
        });
     }
     
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/