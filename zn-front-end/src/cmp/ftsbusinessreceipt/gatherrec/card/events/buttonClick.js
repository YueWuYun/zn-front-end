/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, print, output } from 'nc-lightapp-front';
import * as CONSTANTS from '../../const/constants';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { elecSignCardPrint } from "../../../../../tmpub/pub/util/index";
 let { dataSource, appcode, tableId, searchId, Print_URL, nodekey, formId, linkkbilltype, pkname , Elecsign_Print_URL, formal_nodekey,supply_nodekey, vbillno} = CONSTANTS;
export default function (props, key) {

    switch (key) {
        //刷新
        case 'refresh':
            this.getData();
            this.toggleShow();
            break;
        // 打印
        case 'print':
            let pks = [];
            let pk = this.props.form.getFormItemsValue(formId, pkname).value;
            pks.push(pk);
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                Print_URL,
                {
                    appcode: appcode,
                    nodekey: nodekey,//模板节点标识
                    oids: pks
                }
            );
            break;
        // 输出
        case 'printout':
            let oids = [];
            oids.push(this.props.form.getFormItemsValue(formId, pkname).value);
            output({
                url: Print_URL,
                data: {
                    nodekey: nodekey,
                    appcode: appcode,
                    oids,
                    outputType: 'output'
                }
            });
            break;
        //联查
        case 'link':
            let pk_srcbill = this.props.form.getFormItemsValue(formId, 'pk_srcbill').value;
            let sbExtParam = {
                status: 'browse',
                LinkBillType: linkkbilltype,
                id: pk_srcbill
            };
            linkApp(props, linkkbilltype, sbExtParam);
            break;
        // 正式打印
        case 'formalprint':
            elecSignCardPrint(props, {
                url: Elecsign_Print_URL,
                offical: true,
                appCode: appcode,
                nodeKey: formal_nodekey,
                headCode: formId,
                field_id: pkname,
                field_billno: vbillno,
                getOrgFunc: () => {
                    let pk_fundgetorg = props.form.getFormItemsValue(formId, 'pk_fundgetorg') && props.form.getFormItemsValue(formId, 'pk_fundgetorg').value;
                    if (pk_fundgetorg) {
                        return pk_fundgetorg;
                    }
                    else {
                        return props.form.getFormItemsValue(formId, 'pk_org').value;
                    }
                }
            });
            break;
         // 补充打印
         case 'supplyprint':
            elecSignCardPrint(props, {
                url: Elecsign_Print_URL,
                offical: false,
                appCode: appcode,
                nodeKey: supply_nodekey,
                headCode: formId,
                field_id: pkname,
                field_billno: vbillno,
                getOrgFunc: () => {
                    let pk_fundgetorg = props.form.getFormItemsValue(formId, 'pk_fundgetorg') && props.form.getFormItemsValue(formId, 'pk_fundgetorg').value;
                    if (pk_fundgetorg) {
                        return pk_fundgetorg;
                    }
                    else {
                        return props.form.getFormItemsValue(formId, 'pk_org').value;
                    }
                }
            });
           break;
    }

}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/