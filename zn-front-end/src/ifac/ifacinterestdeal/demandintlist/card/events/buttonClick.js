/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast,print,cardCache,promptBox } from 'nc-lightapp-front';
import { list_page_id, card_from_id, card_table_id, card_page_id,bill_type,fun_code,node_key,printTemplate_ID,card_page, dataSourceTam,app_code } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import { versionControl } from "../../../../pub/util/util.js";
let {getCurrentLastId,addCache,getNextId, deleteCacheById,updateCache  } = cardCache;
import {processFormulamsg} from '../../util/util.js';
import initTemplate from './initTemplate';

import {printCall} from '../../busbutton/intcalPrint.js';

import {amountLink,intObjLink,rateLink,linkVoucherApp} from '../../busbutton/intcalLink.js';
//import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil.js'

export default function (props, id) {
  let that = this;
  let formId = card_from_id;
  let tableId = card_table_id;
  let pageId = card_page_id;
  let pk_intlist = this.props.form.getFormItemsValue(formId, 'pk_intlist').value;
  let pk_intlistv = pk_intlist;
  let pks = [pk_intlist];
  let pk_intobjv = this.props.form.getFormItemsValue(formId, 'pk_intobj').value;
  
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
    //内部活期账户联查积数
    case 'amount':
        if(!pk_intobjv){
            toast({color:"warning",content:'当前数据已被删除，不能联查'}) 
            return;
        }
        let beg_date = this.props.form.getFormItemsValue(formId, 'begdate').value;
        let end_date = this.props.form.getFormItemsValue(formId, 'enddate').value;
        let intmode = this.props.form.getFormItemsValue(formId, 'intmode').value;
        amountLink.call(this,props,beg_date,end_date,pk_intobjv,intmode);
        break;
    //联查对象
    case 'interestobj':
        if(!pk_intobjv){
            toast({color:"warning",content:'当前数据已被删除，不能联查'}) 
            return;
        }
        intObjLink.call(this,props,pk_intobjv);
        break;
    //联查凭证
    case 'voucher':
        if(!pk_intlistv){
            toast({color:"warning",content:'没有关联的凭证可联查'}) 
            return;
        }
        let pk_intlist = this.props.form.getFormItemsValue(formId, 'pk_intlist').value;
        let pk_groupv = this.props.form.getFormItemsValue(formId, 'pk_group').value;
        let pk_orgv = this.props.form.getFormItemsValue(formId, 'pk_org').value;
        let billnov = this.props.form.getFormItemsValue(formId, 'vbillno').value;
        linkVoucherApp.call(this,props,pk_intlist,pk_groupv,pk_orgv,'36LD',billnov);
        break;
    //联查利率
    case 'rate':
        if(!pk_intobjv){
            toast({color:"warning",content:'当前数据已被删除，不能联查'}) 
            return;
        }
        let currRows = props.cardTable.getCheckedRows(tableId);
        let currSelect = [];

        if(currRows.length!=1){
            toast({color:"warning",content:this.state.json['36340CDIB-000003']/**国际化处理：请选择一行表体 */}) 
            return; 
        }
        let pk_ratecode = currRows[0].data.values.pk_ratecode.value;
        rateLink.call(this,props,pk_ratecode);
        break;
    }  
}

//卡片刷新
export const refreshCard = function(props){
    let status = this.props.getUrlParam('status');
    let pk = this.props.getUrlParam('id');
    this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);//设置看片翻页的显隐性
    this.props.form.setFormStatus(card_from_id, status);
    this.props.cardTable.setStatus(card_table_id, status);
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
                        let vbillno =res.data.head[card_from_id].rows[0].values.vbillno.value;
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
                        title: this.state.json['36340CDIB-000004']/**国际化处理：刷新成功 */,
                        color: 'success'
                    })
                } 
            }
        });
    }
}




 


/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/