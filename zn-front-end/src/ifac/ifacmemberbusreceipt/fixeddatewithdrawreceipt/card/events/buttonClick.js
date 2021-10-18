/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant';
import { elecSignCardPrint,loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { requesturl } from '../../cons/requesturl.js';
import { buttonVisible } from '../events/buttonVisible';
import {updateCacheData} from '../../../../../tmpub/pub/util/cache';
let { FixedWithDrawReceiptConst, app_code,printnodekey,pageCodeCard,base_url,formId} = CONSTANTS;
export default function (props, key) {
    switch (key) {
        case 'Refresh':
          this.qryData(true);
          break;
        //记账
        case 'Tally':
            tallyConfirm.call(this, props);
            break;
        //取消记账
        case 'UnTally':
            unTallyConfirm.call(this, props);
            break;
        // 联查存单
        case 'LinkDepositBill':
            let linkData = this.props.form.getAllFormValue(formId);
            let depositcode =linkData.rows[0].values['pk_memberdeposit'].value;
            if(!depositcode){
                toast({
                color: 'warning',
                content: loadMultiLang(this.props, '36340NDSR-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            } else {
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
            }
            break;
        case 'LinkVoucher':// 联查凭证
            let voucherData = this.props.form.getAllFormValue(formId);
            let pk_receipt=voucherData.rows[0].values['pk_receipt'].value;
            let billnov=voucherData.rows[0].values['vbillcode'].value;
            let pk_groupv=voucherData.rows[0].values['pk_group'].value;
            let pk_orgv=voucherData.rows[0].values['pk_org'].value;
            let billtype='36LK';
            linkVoucherApp(
              this.props,
              pk_receipt,
              pk_groupv,
              pk_orgv,
              billtype,
              billnov,
            );
            break;
        case 'queryIntList':// 联查单位内部利息清单,待利息清单完成之后，做适配
            let link_Data = this.props.form.getAllFormValue(formId);
            let  pk_fixeddatewithdraw1=link_Data.rows[0].values['pk_receipt'].value;
            let  pk_org=link_Data.rows[0].values['pk_org'].value;
            interlistLink.call(this.props,pk_fixeddatewithdraw1,pk_org);
            break;
        case 'Print':
            let printData = this.props.form.getAllFormValue(formId);
            let pks = [];
            pks.push(printData.rows[0].values['pk_receipt'].value);
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
        // 输出
        case 'OutPut':
            let outputData = this.props.form.getAllFormValue(formId);
            let outputpks = [];
            outputpks.push(outputData.rows[0].values['pk_receipt'].value);
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
        case 'ElecsignPrint':// 正式打印
            elecSignPrint.call(this, props, true);
            break;

        case 'ElecsignPrePrint':// 补充打印
            elecSignPrint.call(this, props, false);
            break;
    }       
}
/* 联查利息清单
* @param {*} props 
* @param {*} pk 
* @param {*} pk_org 
*/
const interlistLink = function(props,pk,pk_org){
    let linkpath;
    ajax({
        url: requesturl.checklist, 
        data: {
            "pks": [pk],
            "extParam":{
                'org':pk_org
            }
        },
        success: (res) => {
            if(res.data=='0'){
                toast({
                    color: 'warning',
                    content: loadMultiLang(this.props, '36340NDSR-000012'), //{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            }else{
                linkpath = '/ifac/ifacinterestdeal/centerinterestbill/main/index.html#/list'
                props.openTo(linkpath, {
                    appcode: '36340FDIB',
                    pagecode: '36340FDIB_L01',
                    islinkquery: true,
                    pks:pk,
                    type:'interlist',
                    org:pk_org
                });
            }
        }
    })  
}
/**
* 正式打印和补充打印
* @param {*} props 
* @param {*} offical 
*/
const elecSignPrint = function (props, offical) {
    elecSignCardPrint(props, {
        url: base_url + 'FDWDWRElecsignAction.do',
        offical,
        appCode: app_code,
        nodeKey: offical ? printnodekey.official : printnodekey.inofficial,
        headCode: formId,
        field_id: FixedWithDrawReceiptConst.pk_filed,
        field_billno: 'vbillcode',
        validateFunc: (selectData) => {
            return null;
        }
    })
}
//记账
const tallyConfirm = function (props) {
    let that = this;
    let pkMapTs = {};
    let pk = props.form.getFormItemsValue(formId, FixedWithDrawReceiptConst.pk_filed).value;
    let ts = props.form.getFormItemsValue(formId, 'ts').value;
    let extParam={btncode:"Tally",pageCode:"36340NDSR_C01"};
    pkMapTs[pk] = ts;
    ajax({
        url: base_url+'FDWDWRTallyAction.do',
        data: {
            pkMapTs,
            pageCode: pageCodeCard,
            extParam
        },
        success: (res) => {
            let pk_receipt = null;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(
                    res.formulamsg,  //参数一：返回的公式对象
                    {                //参数二：界面使用的表格类型
                        card_table_id: "form"
                    }
                );
            }
            if (res.success) {
                toast({ color: 'success', content: loadMultiLang(this.props, '36340NDSR-000010') });/* 国际化处理：记账成功*/
                if (res.data) {
                    if (res.data.head && res.data.head[formId]) {
                        props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                        pk_receipt = res.data.head[formId].rows[0].values.pk_receipt.value;
                    }
                    updateCacheData(
                        this.props,
                        FixedWithDrawReceiptConst.pk_filed,
                        pk_receipt,
                        res.data,
                        formId,
                        FixedWithDrawReceiptConst.dataSource,
                        res.data.head[formId].rows[0].values
                    );
                    
                }
                buttonVisible.call(this, this.props);
            }
        }
    });
};


//取消记账
const unTallyConfirm = function (props) {
    let that = this;
    let pkMapTs = {};
    let pk = props.form.getFormItemsValue(formId, FixedWithDrawReceiptConst.pk_filed).value;
    let ts = props.form.getFormItemsValue(formId, 'ts').value;
    let extParam={btncode:"UnTally",pageCode:"36340NDSR_C01"};
    pkMapTs[pk] = ts;
    ajax({
        url: base_url+'FDWDWRUnTallyAction.do',
        data: {
            pkMapTs,
            pageCode: pageCodeCard,
            extParam
        },
        success: (res) => {
            let pk_receipt = null;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(
                    res.formulamsg,  //参数一：返回的公式对象
                    {                //参数二：界面使用的表格类型
                        card_table_id: "form"
                    }
                );
            }
            if (res.success) {
                toast({ color: 'success', content: loadMultiLang(this.props, '36340NDSR-000011') });/* 国际化处理： 取消记账成功*/
                if (res.data) {
                    if (res.data.head && res.data.head[formId]) {
                        props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                        pk_receipt = res.data.head[formId].rows[0].values.pk_receipt.value;
                    }
                    updateCacheData(
                        this.props,
                        FixedWithDrawReceiptConst.pk_filed,
                        pk_receipt,
                        res.data,
                        formId,
                        FixedWithDrawReceiptConst.dataSource,
                        res.data.head[formId].rows[0].values
                    );
                }
                buttonVisible.call(this, this.props);
            }
        }
    });
};
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/