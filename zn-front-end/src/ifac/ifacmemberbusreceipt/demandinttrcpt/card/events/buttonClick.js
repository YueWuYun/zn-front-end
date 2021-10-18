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
    
    //联查利率
    case 'Linkrate':
      let carddata = props.cardTable.getCheckedRows(tableId); 
      if(!carddata[0]){
        toast({color:"warning",content:this.state.json['36340CDIR-000068']})/* 国际化处理： 暂无数据*/
        break;
      }
      let pk_ratecode = carddata[0].data.values.pk_ratecode.value;
      if(pk_ratecode===null||pk_ratecode==''||pk_ratecode === undefined){
        toast({color:"warning",content:this.state.json['36340CDIR-000008']})/* 国际化处理： 暂无数据*/
        break;
      }
      ajax({
        url: requesturl.ratelink, 
        data: {
            pk: pk_ratecode
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
                id:pk_ratecode
            });
        }
      });
      break;
    //联查凭证
    case 'Linkvoucher':
     
      let pk_intlist, link_bill_no,trade_type,isvoucher;
      pk_intlist = props.form.getFormItemsValue(card_from_id, 'pk_intlist').value;
      link_bill_no = props.form.getFormItemsValue(card_from_id, 'vbillno').value;
      trade_type = props.form.getFormItemsValue(card_from_id, 'pk_billtype').value;
      isvoucher = props.form.getFormItemsValue(card_from_id, 'isvoucher').value;
      if(!isvoucher){
        toast({
          color: 'warning',
          content: this.state.json['36340CDIR-000062']/* 国际化处理： 没有关联的单据*/
        });
        return;
      }
      linkVoucherApp(props, pk_intlist, aggvo, app_code, trade_type, link_bill_no);
      break;
    case 'Save':
      let saveflag = props.form.isCheckNow(formId);
      let CardData = this.props.createMasterChildData(this.pageId, card_from_id, this.tableId);
      // if(CardData.){
      let length = CardData.body[card_table_id].rows.length;
      let savebodyflag = false;
      for(let i=0;i<length;i++){
          if(CardData.body[card_table_id].rows[i].status != 3){
            savebodyflag = true;
          }
          else{
            this.props.cardTable.delRowByRowId(card_table_id, CardData.body[card_table_id].rows[i].rowid);
          }
      }
      if(!savebodyflag){
          toast({ color: 'warning', content: this.state.json['36340CDIR-000054'] });/* 国际化处理： 账户必须有一个子户！*/
          break;
      }
      if(saveflag){
        let saveobj = {};
        saveobj[card_table_id] = 'cardTable';
        this.props.validateToSave( CardData , save.bind(this,props,CardData) , saveobj , '' );
      }
      break;
    case 'Edit':
      props.pushTo('/card', {
        status: 'edit',
        id: props.getUrlParam('id'),
        pagecode: card_page_id
        //pk_banktype:that.props.form.getFormItemsValue(formId, 'pk_banktype').value
      })
      versionsControl(props,card_from_id);
      that.toggleShow()
      break;
    case 'Cancel':
      promptBox({
          color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
          title: this.state.json['36340CDIR-000029'],
          content: this.state.json['36340CDIR-000014'],/* 国际化处理： 是否确认要取消？*/
          //点击确定按钮事件
				  beSureBtnClick: () => {
					  if ((props.getUrlParam('status') === 'edit')) {
						  // 表单返回上一次的值
						  props.form.cancel(formId);
						  props.setUrlParam({
							  status: 'browse',
							  id: props.getUrlParam('id')
              });
              versionsControl(props,card_from_id);
						  that.toggleShow();
					  }
					  //保存中的取消操作
					  if (props.getUrlParam('status') === 'add') {
              props.form.cancel(formId);  
              props.cardTable.resetTableData(this.tableId);
              let id = props.getUrlParam('id');
              let nextId = getCurrentLastId(dataSourceTam); 
						  if(id == null){
							   
							  props.setUrlParam({
								  status: 'browse',
								  id: nextId
							  });
						  }else{
							  props.setUrlParam({
								  status: 'browse',
								  id: id
							  });
              }
              this.setState({ billno: props.form.getFormItemsValue(card_from_id, 'vbillno').value,vbillno: props.form.getFormItemsValue(card_from_id, 'vbillno').value });
					  	versionsControl(props,card_from_id);
						  that.toggleShow();
						
					  }
					  
				  }
			  });	

      break;
    case 'Refresh':
      this.refreshcard();
      break;
    //记账
    case 'Tally':
      tallyConfirm.call(this,props);
      break;
    //取消记账
    case 'UnTally':
      unTallyConfirm.call(this,props);
      break;
    //补充打印
    case 'ElecsigninPreview':
      elecSignPrint.call(this,props, false);
      break;
    //正式打印
    case 'OfficialPrint':
      elecSignPrint.call(this , props, true);
      break;
    case 'Print':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					//billtype: bill_type, //单据类型
          //funcode: fun_code, //功能节点编码，即模板编码
          appcode: app_code,
          //nodekey: node_key, //模板节点标识
          nodekey:'CARD',
					//printTemplateID: printTemplate_ID,
					oids: [that.props.form.getFormItemsValue(formId, 'pk_intlist').value]
				}
			);
      break;
    case 'PrintList':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					//billtype: bill_type, //单据类型
          //funcode: fun_code, //功能节点编码，即模板编码
          appcode: app_code,
          //nodekey: node_key, //模板节点标识
          nodekey:'CARD',
					//printTemplateID: printTemplate_ID,
					oids: [that.props.form.getFormItemsValue(formId, 'pk_intlist').value]
				}
			);
      break;
    //输出
    case 'Output':
      
      that.setState(
        {
            outputData: {
                appcode: app_code,
                //funcode: fun_code, //功能节点编码，即模板编码
                nodekey: 'CARD', //模板节点标识
                //printTemplateID: printTemplate_ID, //模板id
                outputType: 'output',
                oids: [that.props.form.getFormItemsValue(formId, 'pk_intlist').value]
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

//电子签章打印
const elecSignPrint = function (props, offical) {
  let nodekey;
		if(offical){
			nodekey = printnodekey_offical;
		}else{
			nodekey = printnodekey_inoffical;
		}
  elecSignCardPrint(props, {
    url: requesturl.elecsignprint,
    offical,
    appCode: app_code,
    nodeKey: nodekey,
    headCode: card_from_id,
    field_id: pk_name,
    field_billno: 'vbillno',
    validateFunc: (selectData) => {
        return null;
    }
})
}


//记账
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
			let pk_intlist  = null;
      if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        props.dealFormulamsg(
          res.formulamsg,  //参数一：返回的公式对象
          {                //参数二：界面使用的表格类型
            card_table_id:"cardTable"
          }
        );
      }
      if (res.success) {
        toast({ color: 'success', content: that.state.json['36340CDIR-000064']});/* 国际化处理： 保存成功*/
        if (res.data) {
          if (res.data.head && res.data.head[this.formId]) {
            props.form.setAllFormValue({ [that.formId]: res.data.head[that.formId] });
            pk_intlist  = res.data.head[that.formId].rows[0].values.pk_intlist.value;
          }
          if (res.data.body && res.data.body[that.tableId]) {
            props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
          }

          if ((props.getUrlParam('status') === 'add') || (props.getUrlParam('status') === 'copy')) {
            addCache(pk_intlist,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }else{
            updateCache(pk_name,pk_intlist,res.data,that.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }

        }
        // this.props.pushTo('/card', {
        //   status: 'browse',
        //   id: pk_intlist ,
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


//取消记账
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
			let pk_intlist  = null;
      if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        props.dealFormulamsg(
          res.formulamsg,  //参数一：返回的公式对象
          {                //参数二：界面使用的表格类型
            card_table_id:"cardTable"
          }
        );
      }
      if (res.success) {
        toast({ color: 'success', content: this.state.json['36340CDIR-000065']});/* 国际化处理： 保存成功*/
        if (res.data) {
          if (res.data.head && res.data.head[this.formId]) {
            props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
            pk_intlist  = res.data.head[this.formId].rows[0].values.pk_intlist.value;
          }
          if (res.data.body && res.data.body[this.tableId]) {
            props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
          }

          if ((props.getUrlParam('status') === 'add') || (props.getUrlParam('status') === 'copy')) {
            addCache(pk_intlist,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }else{
            updateCache(pk_name,pk_intlist,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }

        }
        // this.props.pushTo('/card', {
        //   status: 'browse',
        //   id: pk_intlist ,
        //   saveres:false,
        //   pagecode: card_page_id
        // });
        versionsControl(this.props,card_from_id);
        buttonVisible(this.props);
        // this.toggleShow();
      }
		}
	});
};





function save(props,CardData) {
  ajax({
    url: requesturl.save,
    data: CardData,
    success: (res) => {
      // let {addCacheId} = this.props.table;
      let pk_intlist  = null;
      if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        props.dealFormulamsg(
          res.formulamsg,  //参数一：返回的公式对象
          {                //参数二：界面使用的表格类型
            card_table_id:"cardTable"
          }
        );
      }
      if (res.success) {
        // toast({ color: 'success', content: this.state.json['36340CDIR-000009']});/* 国际化处理： 保存成功*/
        if (res.data) {
          if (res.data.head && res.data.head[this.formId]) {
            props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
            pk_intlist  = res.data.head[this.formId].rows[0].values.pk_intlist.value;
          }
          if (res.data.body && res.data.body[this.tableId]) {
            props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
          }

          if ((props.getUrlParam('status') === 'add') || (props.getUrlParam('status') === 'copy')) {
            addCache(pk_intlist,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }else{
            updateCache(pk_name,pk_intlist,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }

        }
        this.props.pushTo('/card', {
          status: 'browse',
          id: pk_intlist ,
          saveres:true,
          pagecode: card_page_id
        });
        versionsControl(this.props,card_from_id);
        this.toggleShow();
      }
    }
  });
}





/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/