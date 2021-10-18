/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant.js';
import { linkApp} from '../../../../../tmpub/pub/util/LinkUtil'; 
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { calculatePrint } from '../../busbutton/intcalPrint';
let { tableId,base_url,app_code,printnodekey,} = CONSTANTS;
export default function buttonClick(props, id, text, index) {
    switch (id) {
        //头部 刷新
        case 'Refresh':
            this.refresh();
            break;
        // 联查单据（银行存款定期转存单、银行存款定期存入回单、银行存款期初定期存入单）
        case 'LinkBill':
            let linkData = searchdata.call(this, props);
            let bill_type = linkData[0].data.values.bill_type.value;
            let pk_sourcebill = linkData[0].data.values.pk_sourcebill.value;
            if(!pk_sourcebill){
                toast({
                    color: 'warning',
                    content: loadMultiLang(this.props, '36141FDIBS-000003') //{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            }
            linkbill.call(this,props,bill_type,pk_sourcebill);
            // let sbExtParam = {
            //     status: 'browse',
            //     LinkBillType: bill_type,
            //     id: pk_sourcebill
            // };
            // linkApp(props, bill_type, sbExtParam);
            break;
        // 联查存单
        case 'LinkDespositBill':
            let link_Data = searchdata.call(this, props);
            let depositcode;
            link_Data.forEach((val) => {
                depositcode = val.data.values.depositcode.value;
            });
            if(!depositcode){
                toast({
                    color: 'warning',
                    content: loadMultiLang(this.props, '36141FDIBS-000003') //{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            } else {
                this.props.openTo('/ifac/factimedepositmanage/depositreceipt/main/index.html#/card', 
                {
                    srcFunCode:'36340RFDR',
                    appcode: '36140FDLB',
                    pagecode: '36140FDLB_C01',
                    status: 'browse',
                    islinkquery: true,
                    id:depositcode,
                    scene: "linksce"
                });
            }
            break;
        // 打印
		// case 'Print':
        //     let printData = searchdata.call(this, props);
        //     let pks = [];
        //     printData.forEach((vale) => {
        //         pks.push(vale.data.values.pk_centerjournal.value);
        //     });
        //     print(
        //         'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        //         base_url + 'BankregaccPrintaction.do',
        //         {
        //             appcode: app_code,
        //             nodekey: printnodekey.nodekey,//模板节点标识
        //             oids: pks
        //         }
        //     );
        //     break;
        //打印清单
        case 'BillPrint':
            calculatePrint.call(this,props, tableId,base_url+'BankregaccPrintaction.do',app_code,'LIST');
            break;
        }
    }
const searchdata = function(props) {
    let selectdata = props.table.getCheckedRows(tableId);
    //数据校验
    if (selectdata.length == 0) {
        toast({
            color: 'warning',
            content: loadMultiLang(this.props, '36141FDIBS-000007'),/* 国际化处理： 请选中一行数据！*/
        });
        return;
    }
    return selectdata;
};
const linkbill = function(props,bill_type,pk_sourcebill){
    switch(bill_type){
        //银行存款定期存入回单
        case '36E1':            
            this.props.openTo('/ifac/facbankfixredepositreceipt/fixdepositprocess/main/index.html#/card', 
            {
                srcFunCode:'36340RFDR',
                appcode: '36140FDSR',
                pagecode: '36140FDSR_C01',
                status: 'browse',
                islinkquery: true,
                id:pk_sourcebill,
                scene: "linksce"
            });
            break
        //银行存款定期支取回单
        case '36E2':            
            this.props.openTo('/ifac/facbankfixredraw/bankfixredraw/main/index.html#/card', 
            {
                srcFunCode:'36340RFDR',
                appcode: '36140NDSR',
                pagecode: '36140NDSR_C01',
                status: 'browse',
                islinkquery: true,
                id:pk_sourcebill,
                scene: "linksce"
            });
            break
        //银行存款通知存入回单
        case '36E4':
            break
        //银行存款通知支取回单
        case '36E5':
            break
        //银行存款期初定期存入单
        case '36E8':
            this.props.openTo('/ifac/facbankfixdeposit/bankfixdepositopening/main/index.html#/card', 
            {
                srcFunCode:'36340RFDR',
                appcode: '36140FDLI',
                pagecode: '36140FDLI_C01',
                status: 'browse',
                islinkquery: true,
                id:pk_sourcebill,
                scene: "linksce"
            });
            break
        //银行存款定期转存单
        case '36E9':
            this.props.openTo('/ifac/facbankfixredeposit/bankfixredeposit/main/index.html#/card', 
            {
                srcFunCode:'36340RFDR',
                appcode: '36140RFD',
                pagecode: '36140RFD_C01',
                status: 'browse',
                islinkquery: true,
                id:pk_sourcebill,
                scene: "linksce"
            });
            break
        //银行存款期初通知存入单
        case '36EA':
            break
        //银行存款通知转存单
        case '36EB':
            break
        default:
            break;
    }
}

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/