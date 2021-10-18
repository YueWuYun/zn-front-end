/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import {  toast, print,output } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant.js';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { listMultiOperator } from '../../busbutton/listOperation';
import { elecSignListPrint} from "../../../../../tmpub/pub/util";
import { buttonVisible } from '../events/buttonVisible';
let { tableId,base_url,nodekey,app_code,pkname,FixedWithDrawReceiptConst,pageCodeList,printnodekey,listcache} = CONSTANTS;
export default function buttonClick(props, id, text, index) {
    switch (id) {
        //头部 刷新
        case 'Refresh':
            this.refresh();
            break;
        //记账
        case 'Tally':
            tallyHeadConfirm.call(this, props);
            break;
        //取消记账
        case 'UnTally':
            unTallyHeadConfirm.call(this, props);
            break;
        // 联查存单
        case 'LinkDepositBill':
            let linkData = searchdata.call(this, props);
			let depositcode = linkData[0].data.values.pk_memberdeposit.value;
		
				this.props.openTo('/ifac/ifacmemberbusquery/memberdepositreceipt/main/index.html#/card', 
				{
					srcFunCode:'36340NDSR',
					appcode: '36341FDLQ',
					pagecode: '36341FDLQ_C01',
					status: 'browse',
					islinkquery: true,
					id:depositcode,
					scene: "linksce"
				});
		
            break;
        // 审批意见
        case 'ApproveInfo':
            break;
        // 联查凭证
        case 'LinkVoucher':
			let voucherData = searchdata.call(this, props);
            let pk_receipt,billnov,pk_groupv,pk_orgv;
            let billtype='36LK';
			//处理选择数据
			voucherData.forEach((val) => {
				pk_receipt = val.data.values.pk_receipt.value;
				billnov = val.data.values.vbillcode.value;
				pk_groupv = val.data.values.pk_group.value;
                pk_orgv = val.data.values.pk_org.value;
			});
			linkVoucherApp(
				this.props,
				pk_receipt,
				pk_groupv,
				pk_orgv,
				billtype,
				billnov,
			);
            break;
        // 打印
		case 'Print':
            let printData = searchdata.call(this, props);
            let pks = [];
            printData.forEach((vale) => {
                pks.push(vale.data.values.pk_receipt.value);
            });
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                base_url + 'FDWDWRPrintaction.do',
                {
                    appcode: app_code,
                    nodekey: printnodekey.nodekey,//模板节点标识
                    oids: pks
                }
            );
            break;
        //补充打印
        case 'ElecsignPrePrint':
            elecSignPrint(props, false);
            break;
        //正式打印
        case 'ElecsignPrint':
            elecSignPrint(props, true);
            break;
        //打印清单
        case 'BillPrint':
            let printListData = searchdata.call(this, props);
            let listPks = [];
            printListData.forEach((item) => {
                listPks.push(item.data.values.pk_receipt.value);
            });
            print(
                'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                base_url+'FDWDWRPrintaction.do', {
                appcode: app_code, //appcode
                nodekey: printnodekey.list_nodekey, //模板节点标识
                oids: listPks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
            }
            );
            break;
        // 输出
        case 'OutPut':
            let outputData = props.table.getCheckedRows(tableId);
            let outputpks = [];
            outputData.forEach((item) => {
                outputpks.push(item.data.values.pk_receipt.value);
            });
            output({
                url: base_url+'FDWDWRPrintaction.do',
                data: {
                    nodekey: printnodekey.nodekey,
                    appcode: app_code,
                    oids: outputpks,
                    outputType: 'output'
                }
            });
            break;
        }
    }

/**
* 正式打印和补充打印
* @param {*} props 
* @param {*} offical 
*/
/**
 * 电子签章打印
 */
const elecSignPrint = function (props, offical) {
    elecSignListPrint(props, {
        url: base_url + 'FDWDWRElecsignAction.do',
        offical,
        appCode: app_code,
        nodeKey: offical ? printnodekey.official : printnodekey.inofficial,
        tableCode: tableId,
        field_id: FixedWithDrawReceiptConst.pk_filed,
        field_billno: 'vbillcode',
        validateFunc: (selectData) => {
            return null;
        }
    })
}
//记账
const tallyHeadConfirm = function (props) {
    let extParam={btncode:"Tally",pageCode:"36340NDSR_L01"};
    // listMultiOperator(
    //     props, 
    //     pageCodeList, 
    //     tableId, 
    //     pkname, 
    //     base_url+'FDWDWRTallyAction.do',
    //     loadMultiLang(this.props, '36340NDSR-000010'), /* 国际化处理：记账成功*/
    //     FixedWithDrawReceiptConst.dataSource,
    //     false,
    //     extParam,
    //     (props, data) =>{
    //         buttonVisible.call(this,this.props);
    //   });
    //author:fanyzhc begin 
    listMultiOperator(
        props, 
        pageCodeList, 
        tableId,
        pkname, 
        base_url+'FDWDWRTallyAction.do',
        loadMultiLang(this.props, '36340NDSR-000013'), /* 国际化处理：记账*/
        listcache,
        false,
        extParam,
        (props, data) =>{
            buttonVisible.call(this,this.props);
      });/* 国际化处理： 记账*/
    //end
};

//取消记账
const unTallyHeadConfirm = function (props) {
    let extParam={btncode:"UnTally",pageCode:"36340NDSR_L01"};
	// listMultiOperator(
    //     props, 
    //     pageCodeList,
    //     tableId, 
    //     pkname, 
    //     base_url+'FDWDWRUnTallyAction.do', 
    //     loadMultiLang(this.props, '36340NDSR-000011'), /* 国际化处理： 取消记账成功*/
    //     FixedWithDrawReceiptConst.dataSource,
    //     false,
    //     extParam,
    //     (props,data) =>{
    //         buttonVisible.call(this,this.props);
    //     }
    //   );
    //author:fanyzhc begin
    listMultiOperator(
        props, 
        pageCodeList, 
        tableId,
        pkname, 
        base_url+'FDWDWRUnTallyAction.do',
        loadMultiLang(this.props, '36340NDSR-000014'), /* 国际化处理：取消记账*/
        listcache,
        false,
        extParam,
        (props, data) =>{
            buttonVisible.call(this,this.props);
      });/* 国际化处理： 取消记账*/
    //end
      
};
const searchdata = function(props) {
    let selectdata = props.table.getCheckedRows(tableId);
    //数据校验
    if (selectdata.length == 0) {
        toast({
            color: 'warning',
            content: loadMultiLang(this.props, '36340NDSR-000012'),/* 国际化处理： 请选中一行数据！*/
        });
        return;
    }
    return selectdata;
};

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/