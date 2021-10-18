/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast,print,cardCache,promptBox } from 'nc-lightapp-front';
import {printnodekey_inoffical,printnodekey_offical,card_version_id,list_page_id, card_from_id, card_table_id, card_page_id,bill_type,fun_code,node_key,printTemplate_ID,card_page, dataSourceTam,app_code, pk_name,aggvo } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import { versionsControl } from "../../../../pub/util/util.js";
import { elecSignListPrint } from "../../../../../tmpub/pub/util";
import { elecSignCardPrint } from '../../../../../tmpub/pub/util';
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
let {getCurrentLastId,addCache,getNextId, deleteCacheById,updateCache  } = cardCache;
import {buttonVisible} from './buttonVisible';
import {processFormulamsg} from '../../util/util.js';
import initTemplate from './initTemplate';

export default function (props, id) {
  let that = this;
  let formId = card_from_id;
  let tableId = card_table_id;
  let pageId = card_page_id;
  let data;
  switch (id) {
    case 'File':
        let pk_depositreceipt = props.form.getFormItemsValue(card_from_id, 'pk_depositreceipt').value;
        let vbillno = props.form.getFormItemsValue(card_from_id, 'depositcode').value;
        this.setState({
          showUploader: !this.state.showUploader,
          billID:pk_depositreceipt,
          billNO:vbillno,
          target: null
        });
        break;
    //联查台账
    case 'Account':
        let pk = props.form.getFormItemsValue(card_from_id, 'pk_srcbill').value;
        let data = {
            "pks": [pk],
            "pageCode": "36341FNIB_L01"
        };
        let that = this;
        ajax({
            url: '/nccloud/ifac/memberjournal/querybydepositcodeaction.do',
            data: data,
            success: function (res) {
                if(res.data != null){
                    props.openTo("/ifac/ifacmemberbusquery/memberjournal/main/index.html#/list", {
                        id: pk,
                        status: 'browse',
                        appcode: "36341FNIB",
                        pagecode: "36341FNIB_L01",
                        scene: "linksce"
                    });
                }else{
                    toast({color:"warning",content:that.state.json['36341FDLQ-000068']})
                }
        }
        });
        
        break;
    //联查定期利率
    case 'RegularRate':
        let pk_depostrate = props.form.getFormItemsValue(card_from_id, 'pk_depostrate').value;
        
        
        if(pk_depostrate===null||pk_depostrate==''||pk_depostrate === undefined){
          toast({color:"warning",content:this.state.json['36341FDLQ-000008']})/* 国际化处理： 暂无数据*/
          break;
        }
        ajax({
          url: requesturl.ratelink, 
          data: {
              pk: pk_depostrate
          },
          success: (res) => {
              let linkpath,appcode,pagecode;
              if(res.data.rateclass=='2'){
                  linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                  appcode = '36010IRC',
                  pagecode = '36010IRC_card'
              }else if(res.data.rateclass=='1'){
                  linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                  appcode = '36010IRCG',
                  pagecode = '36010IRCG_card'
              }else if(res.data.rateclass=='0'){
                  linkpath = '/tmpub/pub/interestrate_org/main/#/card',
                  appcode = '36010IRCO',
                  pagecode = '36010IRCO_card'
              }
              props.openTo(linkpath, {
                  appcode: appcode,
                  pagecode: pagecode,
                  status: 'browse',
                  // islinkquery: true,
                  scene: "linksce",
                  id:pk_depostrate
              });
          }
        });
        break;
    //联查活期利率
    case 'CurrentRate':
        
        let pk_aiacrate = props.form.getFormItemsValue(card_from_id, 'pk_aiacrate').value;
        if(pk_aiacrate===null||pk_aiacrate==''||pk_aiacrate === undefined){
          toast({color:"warning",content:this.state.json['36341FDLQ-000008']})/* 国际化处理： 暂无数据*/
          break;
        }
        ajax({
          url: requesturl.ratelink, 
          data: {
              pk: pk_aiacrate
          },
          success: (res) => {
              let linkpath,appcode,pagecode;
              if(res.data.rateclass=='2'){
                  linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                  appcode = '36010IRC',
                  pagecode = '36010IRC_card'
              }else if(res.data.rateclass=='1'){
                  linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                  appcode = '36010IRCG',
                  pagecode = '36010IRCG_card'
              }else if(res.data.rateclass=='0'){
                  linkpath = '/tmpub/pub/interestrate_org/main/#/card',
                  appcode = '36010IRCO',
                  pagecode = '36010IRCO_card'
              }
              props.openTo(linkpath, {
                  appcode: appcode,
                  pagecode: pagecode,
                  status: 'browse',
                  // islinkquery: true,
                  scene: "linksce",
                  id:pk_aiacrate
              });
          }
        });
        break;

    
    
    
    case 'Refresh':
      this.refreshcard();
      break;
   
    case 'Print':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					
          appcode: app_code,
          
          nodekey:null,
					
					oids: [this.props.form.getFormItemsValue(formId, 'pk_depositreceipt').value]
				}
			);
      break;
    
    //输出
    case 'Output':
      
      this.setState(
        {
            outputData: {
                appcode: app_code,
                
                nodekey: null, //模板节点标识
                
                outputType: 'output',
                oids: [this.props.form.getFormItemsValue(formId, 'pk_depositreceipt').value]
            }
        },
        () => {
          this.refs.printOutput.open();
        }
    );
			break;
    
    default:
      break
  }
}







/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/