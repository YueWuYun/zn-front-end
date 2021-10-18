/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { createPage, ajax, base, toast, print, output } from 'nc-lightapp-front';
import { card_page_id, printParameter } from '../../cons/constant.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {elecSignPrint } from "../../util/index";
const { NCMessage } = base;
export default function (props, id) {
  const pk_allocatereceipt = props.form.getFormItemsValue(this.formId, 'pk_allocatereceipt').value;
  const billnoe = props.form.getFormItemsValue(this.formId, 'vbillno').value;

  switch (id) {
    //打印
    case 'Print':
      if (!pk_allocatereceipt) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FARF-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      print(
        printParameter.prinType,  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        printParameter.actionUrl,
        {
          // billtype: printParameter.billtype,  //单据类型
          funcode: printParameter.funcode, //功能节点编码，即模板编码
          nodekey: printParameter.nodekey,     //模板节点标识
          // printTemplateID: printParameter.printTemplateID, //模板id
          oids: [pk_allocatereceipt]
        }
      );
      break;
    //输出
    case 'Output':
      if (!pk_allocatereceipt) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FARF-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      output({
        url: printParameter.actionUrl,
        data: {
          funcode: printParameter.funcode, //功能节点编码，即模板编码
          nodekey: printParameter.nodekey,     //模板节点标识
          // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
          oids: [pk_allocatereceipt],
          outputType: 'output'
        }
      });
      break;
     //正式打印
     case 'Official':
        elecSignPrint(props,true,true);
      break;
     //补充打印
     case 'Inofficial':
        elecSignPrint(props,false,true);
       break;  
    //附件管理
    case 'File':
      this.setState({
        billId: pk_allocatereceipt, //单据id
        billno: billnoe, // 单据编号
        showUploader: !this.state.showUploader,
        target: null
      })
      break;
    //刷新
    case 'Refresh':
      this.refresh();
      break;
  }
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/