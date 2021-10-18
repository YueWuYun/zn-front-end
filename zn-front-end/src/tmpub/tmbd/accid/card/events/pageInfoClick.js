/*j07c8riwYnz20MYibuDbtPs8ea8Iw7KaMX7bLf88vnlulX7DY6KPTntVQWkKfmUZ*/
import {ajax, cardCache} from 'nc-lightapp-front';

import { 
	app_id, module_id, base_url, button_limit, oid, appcode,
	list_page_id,list_search_id, list_table_id,
    card_page_id,card_from_id,card_fromtail_id,
    dataSource
} from '../../cons/constant.js';

export default function (props, pks) {
    let { getCacheById, updateCache } = cardCache;
    props.setUrlParam(pks);
    /*
    * id：数据主键的值
    * dataSource: 缓存数据命名空间
    */
   if(pks){
        let cardData = getCacheById(pks, dataSource);
        if(cardData){
            if(cardData.pageid === card_page_id){
                this.props.form.setAllFormValue({[card_from_id]: cardData[card_from_id]});
                this.backAccidcode = cardData[card_from_id].rows[0].values.accidcode.value;
                this.props.setUrlParam({
                    status: 'browse',
                    id: cardData[card_from_id].rows[0].values.pk_accid.value,
                });
                this.toggleShow();
                return;
            }else{
                this.props.form.setAllFormValue({[card_from_id]: cardData[list_table_id]});
                this.backAccidcode = cardData[list_table_id].rows[0].values.accidcode.value;
                this.props.setUrlParam({
                    status: 'browse',
                    id: cardData[list_table_id].rows[0].values.pk_accid.value,
                });
                this.toggleShow();
                return;
            }
        }else{
            let pkArr = [];
            //主键数组
            pkArr.push(pks);
            let data = {
              pks: pkArr,
              pageId: this.pageId
            };
            ajax({
               url: '/nccloud/tmpub/tmbd/accidqueryallpk.do',
               data: data,
               success: (res) => {
                   //data要看返回的id，而不是后台设置的id
                   if (res.data) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data[this.tableId] });
                        if (res.data[this.tableId].rows) {
                            this.backAccidcode = res.data[this.tableId].rows[0].values.accidcode.value;
                            this.props.setUrlParam({
                                status: 'browse',
                                id: res.data[this.tableId].rows[0].values.pk_accid.value,
                            });
                        }
                        //动态修改地址栏中的id的值
                        updateCache('pk_accid', pks, res.data, card_from_id, dataSource, res.data[this.tableId].rows[0].values);
                        this.toggleShow();
                   } else {
                       this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                   }
               }
            });
        }
    }

}

/*j07c8riwYnz20MYibuDbtPs8ea8Iw7KaMX7bLf88vnlulX7DY6KPTntVQWkKfmUZ*/