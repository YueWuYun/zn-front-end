/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, print } from 'nc-lightapp-front';
let { NCMessage } = base;
import { busiOperate } from './busiOperate';
import { tableId, table_orgs, pagecode, formId_org ,formId} from '../constants';
import { printClick } from './printClick';
export default function (props, id) {
    let pks = [];
    let data;
    let url;
    switch (id) {
        //【card_head】【刷新】
        case 'refresh':
            this.getdata();
            break;
        //【list_head】【更多操作】取消发布
        case 'unpublish':
            url = '/nccloud/cmp/informer/cardunpublish.do';
            busiOperate(this, id, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000001'));/* 国际化处理： 取消发布，成功！*/
            break;
        //【card_head】【发布】
        case 'publish':
            url = '/nccloud/cmp/informer/cardpublish.do';
            let balance = props.form.getFormItemsValue(formId, 'balance'); 
            if(balance && balance.value && parseFloat(balance.value.replace(/[^\d\.-]/g, ""))<=0){
                toast({ content: this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AIPSSC--000023'), color: 'warning' });/* 国际化处理： 余额为0，不可以发布!*/
                break;
            }
            busiOperate(this, id, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000002'));/* 国际化处理： 发布，成功！*/
            break;
        case 'printbtn':
            printClick(this, id);
            break;
        case 'printout':
            printClick(this, id);
            break;
    }
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/