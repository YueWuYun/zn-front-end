/*E+WClHAj0swg/P9k6x+EKNUreIEGjFEZCcWsC3DMM9mo4R3eOzy/lbzQoKFVvBoa*/
import { ajax, print } from 'nc-lightapp-front';


export const printBtn = function () {

    print(
        'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/paybills/paybillsprint.do',
        {
            //billtype: 'D5', //单据类型
            //funcode: '36070PBM', //功能节点编码，即模板编码
            nodekey: 'NCCLOUD', //模板节点标识
            //printTemplateID: '1001Z610000000004R6L', //模板id
            appcode: '36070PBR',
            oids: [ this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value ]
        }
    );

}
/*E+WClHAj0swg/P9k6x+EKNUreIEGjFEZCcWsC3DMM9mo4R3eOzy/lbzQoKFVvBoa*/