/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast,print,cardCache,promptBox } from 'nc-lightapp-front';
import { list_page_id, card_from_id, card_table_id, card_page_id,bill_type,fun_code,node_key,printTemplate_ID,card_page, dataSourceTam,app_code } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import { versionControl } from "../../../../pub/util/util.js";
let {getCurrentLastId,addCache,getNextId, deleteCacheById,updateCache  } = cardCache;
import {processFormulamsg} from '../../util/util.js';
import initTemplate from './initTemplate';

import {printCall} from '../../busbutton/intcalPrint.js';
import beSureBtnClick from '../../list/events/beSureBtnClick.js';
import {amountLink,depositCodeLink,rateLink,linkVoucherApp} from '../../busbutton/intcalLink.js';

export default function (props, id) {
  //let that = this;
  let formId = card_from_id;
  let tableId = card_table_id;
  let pageId = card_page_id;
  let pk_intlist = this.props.form.getFormItemsValue(formId, 'pk_interest').value;
  let pk_intlistv = pk_intlist;
  let pks = [pk_intlist];
  switch (id) {
    //卡片刷新
    case 'refresh':
        refreshCard.call(this,props);
        break;
    //内部活期账户利息清单打印
    case 'print':
        printCall.call(this,app_code,pks,requesturl.print);
        break;
    //内部活期账户利息清单输出
    case 'output':
        printCall.call(this,app_code,pks,requesturl.print,'output');
        break;
    //联查凭证
    case 'voucher':
        if(!pk_intlistv){
            toast({color:"warning",content:this.state.json['36341FNIBS-000025']}) 
            return;
        }
        let pk_intlist = this.props.form.getFormItemsValue(formId, 'pk_interest').value;
        let pk_groupv = this.props.form.getFormItemsValue(formId, 'pk_group').value;
        let pk_orgv = this.props.form.getFormItemsValue(formId, 'pk_org').value;
        let billnov = this.props.form.getFormItemsValue(formId, 'vbillcode').value;
        linkVoucherApp.call(this,props,pk_intlist,pk_groupv,pk_orgv,'3601',billnov);
        break;
     //联查存单
     case 'dereceipt':
        let depositcode = this.props.form.getFormItemsValue(formId, 'depositcode').value;
        if(!depositcode){
            toast({color:"warning",content:this.state.json['36341FNIBS-000023']}) 
            return;
        }
        depositCodeLink.call(this,props,depositcode);
     break;
    //联查定期利率
    case 'fixrate':
        let pk_depositrate = this.props.form.getFormItemsValue(formId, 'pk_depositrate').value;
        if(!pk_depositrate){
            toast({color:"warning",content:this.state.json['36341FNIBS-000021']}) 
            return;
        }
        rateLink.call(this,props,pk_depositrate);
        break;
    //联查活期利率
    case 'currrate':
        let pk_aiacrate = this.props.form.getFormItemsValue(formId, 'pk_aiacrate').value;
        if(!pk_aiacrate){
            toast({color:"warning",content:this.state.json['36341FNIBS-000023']}) 
            return;
        }
        rateLink.call(this,props,pk_aiacrate);
        break;

    //冲补预提
    case 'writewithho':
        promptBox({
            color: "warning",
            content: this.state.json['36341FNIBS-000012']/**国际化处理:确认要冲补预提？ */,
            beSureBtnClick: writewithho.bind(this, props, requesturl.writewithhocard)
        });	
        break;
    //取消冲补预提
    case 'unwritewithho':
        promptBox({
            color: "warning",
            content: this.state.json['36341FNIBS-000013']/**国际化处理:确认要取消冲补预提？ */,
            beSureBtnClick: writewithho.bind(this, props, requesturl.unwritewithhocard)
        });	
        break;
    }  

}

const writewithho = function (props,url) {
    let that = this;
    let pkMapTs = {};
    let pk = props.form.getFormItemsValue(card_from_id, 'pk_interest').value;
    let ts = props.form.getFormItemsValue(card_from_id, 'ts').value;
    pkMapTs[pk] = ts;
    let data = { pkMapTs, pageCode: card_page_id };
    ajax({
      url: url,
      data,
      success: (res) => {
        if (res.data) {
            toast({duration: 3,title: this.state.json['36341FNIBS-000016'],color: 'success'})
            updateCache(card_table_id,pk,card_from_id,dataSourceTam,res.data.head[card_from_id].rows[0].values);
            props.setUrlParam({
                status: 'browse',
                id: pk
            });
            that.toggleShow();
        } 
    }
    });
  };

//卡片刷新
export const refreshCard = function(props){
    //let status = this.props.getUrlParam('status');
    //let pk = this.props.getUrlParam('id');
    //this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);//设置看片翻页的显隐性
    //this.props.form.setFormStatus(card_from_id, status);
    //this.props.cardTable.setStatus(card_table_id, status);
    let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_interest').value;
    let data = { pk: pk, pageCode: this.pageId };
    let that = this;
    if(!pk){
        this.props.form.EmptyAllFormValue(card_from_id);
        this.props.cardTable.setTableData(this.tableId, { rows: [] });
    }else{
        ajax({
            url: requesturl.querycard,
            data: data,
        success: (res) => {
                if (res.data) {
                    //处理公式
                    processFormulamsg(this.props, res);
                    if (res.data[card_from_id]) {
                        this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });                  
                        let vbillno =res.data.head[card_from_id].rows[0].values.vbillcode.value;
                        this.setState({
                            vbillno:vbillno
                        });
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    }
                    updateCache(card_table_id,pk,card_from_id,dataSourceTam,res.data.head[card_from_id].rows[0].values);
                    toast({
                        duration: 3,
                        title: this.state.json['36341FNIBS-000016']/**国际化处理：刷新成功 */,
                        color: 'success'
                    })
                } 
            }
        });
    }
}




 


/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/