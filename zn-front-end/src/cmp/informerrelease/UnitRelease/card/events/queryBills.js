/*CA6HHPCstSLce6wciVhFe2Li9rlyYPbjEykXhtNCwHh+kIBNM/lqyU2ponLzGijs*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, table_orgs, pagecode, formId_org, formId_01, formId_02 } from '../constants';
let { NCMessage } = base;
/**
 * 联查单据
 * @param {*} props 
 */
export function queryBills(props) {
    let queryData = props.table.getCheckedRows(tableId);
    if (queryData.length == 0) {
        toast({ color: 'warning', title: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000009')/*'请选择数据！'*/ });
        return;
    } else {
        let pk;
        let type;        
        let pk_lower;
        queryData.forEach((val) => {
            pk = val.data.values.pk_informerrelease.value;
            type = val.data.values.lowerbilltype.value;
            pk_lower = val.data.values.pk_lower.value;
        });
        if (!pk || !type) { 
            toast({ color: 'warning', title: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000021')});
            return;
        }
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
                        scene: 'linksce',
                        appcode: res.data.appCode,
                        pagecode: res.data.linkPageCode,
                        status: 'browse',
                        src: 'informer',
                        id: pk_lower
                    });
                }
            }
        });
    }
}



// let queryData = props.table.getCheckedRows(tableId);
// if (queryData.length == 0) {
//     NCMessage.create({ content: '请选择数据！', color: 'warning' });
//     return;
// } else {
//     let pks = [];
//     let lowerbilltype = [];
//     queryData.forEach((val) => {
//         let pk;
//         let type;
//         pk = val.data.values.pk_informerrelease.value;
//         type = val.data.values.lowerbilltype.value;
//         pks.push(pk);
//         lowerbilltype.push(type);
//     });
//     if (pks.length > 1) {
//         NCMessage.create({ content: '联查时，请选择一条数据！', color: 'warning' });
//         return;
//     }
//     cacheTools.set('informers', pks);
//     if (lowerbilltype[0] == '36J5') {//委托付款书
//         window.parent.openNew({
//             code: '36300TP',
//             name: '委托付款书',
//             pk_appregister: '0001Z61000000001TS3P'
//         },
//             'current',
//             'status=browse&src=informer'
//         );
//     } else if (lowerbilltype[0] == '36J7') {//委托收款书
//         window.parent.openNew({
//             code: '36300TG',
//             name: '委托收款书',
//             pk_appregister: '0001Z610000000029LJM'
//         },
//             'current',
//             'status=browse&src=informer'
//         );
//     } else if (lowerbilltype[0] == '36K2') {//下拨单
//         window.parent.openNew({
//             code: '36320FA',
//             name: '资金下拨',
//             pk_appregister: '0001Z61000000002IQ8X'
//         },
//             'current',
//             'status=browse&src=informer'
//         );
//     } else if (lowerbilltype[0] == '36K4') {//上收单
//         window.parent.openNew({
//             code: '3632030',
//             name: '资金上收',
//             pk_appregister: '0001Z61000000002HF6H'
//         },
//             'current',
//             'status=browse&src=informer'
//         );
//     } else if (lowerbilltype[0] == '36S4') {//划账结算单
//         window.parent.openNew({
//             code: '36070TBR',
//             name: '划账结算单',
//             pk_appregister: '0001Z61000000001NY82'
//         },
//             'current',
//             'status=browse&src=informer'
//         );
//     } else if (lowerbilltype[0] == 'F2') {//收款单
//         window.parent.openNew();
//     } else if (lowerbilltype[0] == 'F3') {//付款单
//         window.parent.openNew();
//     } else if (lowerbilltype[0] == 'F4') {//收款结算单
//         window.parent.openNew({
//             code: '36070RBM',
//             name: '收款结算单',
//             pk_appregister: '0001Z6100000000264K0'
//         },
//             'current',
//             'status=browse&src=informer'
//         );
//     } else if (lowerbilltype[0] == 'F5') {//付款结算单
//         window.parent.openNew({
//             code: '36070PBR',
//             name: '付款结算单',
//             pk_appregister: '0001Z61000000001PJBL'
//         },
//             'current',
//             'status=browse&src=informer'
//         );
//     }

// }

/*CA6HHPCstSLce6wciVhFe2Li9rlyYPbjEykXhtNCwHh+kIBNM/lqyU2ponLzGijs*/