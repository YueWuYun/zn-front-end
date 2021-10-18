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
        let vbillno = props.form.getFormItemsValue(card_from_id, 'vbillcode').value;
        this.setState({
          showUploader: !this.state.showUploader,
          billID:pk_depositreceipt,
          billNO:vbillno,
          target: null
        });
        break;
    //联查台账
    case 'Account':
        let pk = props.form.getFormItemsValue(card_from_id, 'pk_depositreceipt').value;
        props.openTo("/ifac/facreportquery/bankregularaccountquery/main/index.html#/list", {
          depositcode: pk,
          appcode: "36141FDIBS",
          pagecode: "36141FDIBS_L01",
          scene: "linksce"
        });
        break;
    //联查定期利率
    case 'RegularRate':
        let pk_depostrate = props.form.getFormItemsValue(card_from_id, 'pk_depostrate').value;
        
        
        if(pk_depostrate===null||pk_depostrate==''||pk_depostrate === undefined){
          toast({color:"warning",content:this.state.json['36140FDLB-000008']})/* 国际化处理： 暂无数据*/
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
          toast({color:"warning",content:this.state.json['36140FDLB-000008']})/* 国际化处理： 暂无数据*/
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
    //冻结
    case 'frozen':
      promptBox({
          color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
          title: this.state.json['36140FDLB-000068'],
          content: this.state.json['36140FDLB-000069'],/* 国际化处理： 是否确认删除？*/
          beSureBtnClick: tallyConfirm.bind(this,props)
      })
      break;
    //解冻
    case 'defrozen':
      unTallyConfirm.call(this,props);
      break;
    
    case 'Print':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					
          appcode: app_code,
          
          nodekey:null,
					
					oids: [that.props.form.getFormItemsValue(formId, 'pk_depositreceipt').value]
				}
			);
      break;
    
    //输出
    case 'Output':
      
      that.setState(
        {
            outputData: {
                appcode: app_code,
                
                nodekey: null, //模板节点标识
                
                outputType: 'output',
                oids: [that.props.form.getFormItemsValue(formId, 'pk_depositreceipt').value]
            }
        },
        () => {
          that.refs.printOutput.open();
        }
    );
			break;
    
    default:
      break
  }
}



//冻结
const tallyConfirm = function (props) {
  let that = this;
  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(card_from_id,pk_name).value;
  let ts = props.form.getFormItemsValue(card_from_id,'ts').value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.tally,
		data: {
			pkMapTs,
			pageCode: card_page_id
		},
		success: (res) => {
			let pk_depositreceipt  = null;
      if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        props.dealFormulamsg(
          res.formulamsg,  //参数一：返回的公式对象
          {                //参数二：界面使用的表格类型
            card_table_id:"cardTable"
          }
        );
      }
      if (res.success) {
        toast({ color: 'success', content: that.state.json['36140FDLB-000066']});/* 国际化处理： 保存成功*/
        if (res.data) {
          if (res.data.head && res.data.head[this.formId]) {
            props.form.setAllFormValue({ [that.formId]: res.data.head[that.formId] });
            pk_depositreceipt  = res.data.head[that.formId].rows[0].values.pk_depositreceipt.value;
          }
          if (res.data.body && res.data.body[that.tableId]) {
            props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
          }

          
          updateCache(pk_name,pk_depositreceipt,res.data,that.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          

        }
        // this.props.pushTo('/card', {
        //   status: 'browse',
        //   id: pk_depositreceipt ,
        //   saveres:false,
        //   pagecode: card_page_id
        // });
        versionsControl(that.props,card_from_id);
        buttonVisible(this.props);
        // this.toggleShow();
      }
		}
	});
};


//解冻
const unTallyConfirm = function (props) {
  let that = this;
  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(card_from_id,pk_name).value;
  let ts = props.form.getFormItemsValue(card_from_id,'ts').value;
	pkMapTs[pk] = ts;
	ajax({
		url: requesturl.untally,
		data: {
			pkMapTs,
			pageCode: card_page_id
		},
		success: (res) => {
			let pk_depositreceipt  = null;
      if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        props.dealFormulamsg(
          res.formulamsg,  //参数一：返回的公式对象
          {                //参数二：界面使用的表格类型
            card_table_id:"cardTable"
          }
        );
      }
      if (res.success) {
        toast({ color: 'success', content: this.state.json['36140FDLB-000067']});/* 国际化处理： 保存成功*/
        if (res.data) {
          if (res.data.head && res.data.head[this.formId]) {
            props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
            pk_depositreceipt  = res.data.head[this.formId].rows[0].values.pk_depositreceipt.value;
          }
          if (res.data.body && res.data.body[this.tableId]) {
            props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
          }
          updateCache(pk_name,pk_depositreceipt,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          

        }
        
        versionsControl(this.props,card_from_id);
        buttonVisible(this.props);
        
      }
		}
	});
};







/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/