/*CA6HHPCstSLce6wciVhFe2Li9rlyYPbjEykXhtNCwHh+kIBNM/lqyU2ponLzGijs*/
import { ajax, base, toast } from 'nc-lightapp-front';
let tableId = 'table';
let pagecode = '36070AILLINK';
let formId = 'form';
let { NCMessage } = base;
/**
 * 联查单据
 * @param {*} props 
 */
export function queryBills(props) {

    let pk = props.form.getFormItemsValue(formId, ['pk_lower'])[0].value;
    let type = props.form.getFormItemsValue(formId, ['lowerbilltype'])[0].value;
    
    //根据单据类型，获取联查单据小应用
    let data = {
        pk: pk,
        billtype: type
    }
    ajax({
        url: '/nccloud/cmp/informer/linkbill.do',
        data,
        success: (res) => {
            if (res.data) {
                props.openTo(res.data.url, {
                    appcode: res.data.appCode,
                    pagecode: res.data.linkPageCode,
                    status: 'browse',
                    src: 'informer',
                    id: pk,
                    scene: 'linksce'
                });
            }
        }
    });

}

/*CA6HHPCstSLce6wciVhFe2Li9rlyYPbjEykXhtNCwHh+kIBNM/lqyU2ponLzGijs*/