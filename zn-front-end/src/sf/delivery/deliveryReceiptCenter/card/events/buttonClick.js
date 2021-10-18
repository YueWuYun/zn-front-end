/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { createPage, ajax, base, toast, print, output } from 'nc-lightapp-front';
import { printParameter, app_code } from '../../cons/constant.js';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {elecSignPrint } from "../../util/index";
const { NCMessage } = base;
export default function (props, id) {
  // let CardData = props.createMasterChildData('20521030', this.formId, this.tableId);
  const pk_deliveryreceipt = props.form.getFormItemsValue(this.formId, 'pk_deliveryreceipt').value;
  const billnoe = props.form.getFormItemsValue(this.formId, 'vbillno').value;

  switch (id) {
    //打印
    case 'Print':
      if (!pk_deliveryreceipt) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FCRF-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      print(
        printParameter.prinType,  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        printParameter.actionUrl,
        {
          // billtype: printParameter.billtype,  //单据类型
          funcode: printParameter.funcode, //功能节点编码，即模板编码
          nodekey: printParameter.nodekey,     //模板节点标识
          printTemplateID: printParameter.printTemplateID, //模板id
          oids: [pk_deliveryreceipt]
        }
      );
      break;
    //输出
    case 'Output':
      if (!pk_deliveryreceipt) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FCRF-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      output({
        url: printParameter.actionUrl,
        data: {
            //功能节点编码，即模板编码
            appcode: app_code,
            // 模板节点标识
            nodekey: printParameter.nodekey,
            // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
            oids: [pk_deliveryreceipt],
            outputType: 'output'
        }
      });
      // this.refs.printOutput.open();
      // this.setState(
      //   {
      //     outputData: {
      //       // funcode: printParameter.funcode, //功能节点编码，即模板编码
      //       // nodekey: printParameter.nodekey, //模板节点标识
      //       // printTemplateID: printParameter.printTemplateID, //模板id
      //       oids: [pk_deliveryreceipt],
      //       outputType: 'output'
      //     }//打印输出使
      //   },
      //   () => {
      //     this.refs.printOutput.open();
      //   }
      // );
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
        billId: pk_deliveryreceipt, //单据id
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