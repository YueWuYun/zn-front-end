/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax, cardCache} from 'nc-lightapp-front';

import { app_id, card_page_id,card_from_id,
    card_fromtail_id,card_table_id,
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
            this.props.form.setAllFormValue({[card_from_id]: cardData.head[card_from_id]});
            this.props.cardTable.setTableData(card_table_id, cardData.body[card_table_id]);
            this.setState({
                vbillno: cardData.head[card_from_id].rows[0].values.vbillno.value,
            });
            this.toggleShow();
        }else{
            let dataArr = [];
            //主键数组
            dataArr.push(pks);
            let data = {
                pks: dataArr,
                pageid: card_page_id
            };
            ajax({
                url: '/nccloud/sf/delivery/deliveryquerycardbypks.do',
                data: data,
                success: (res) => {
                    if (res.data) {
                        let vbillno ='';
                        if (res.data.head) {
                            this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                            /*
                            * idname: 数据主键的命名
                            * id：数据主键的值
                            * headAreacode: 卡片表头的区域编码
                            * dataSource: 缓存数据命名空间
                            */
                            updateCache('pk_delivery_h', pks, res.data, card_from_id, dataSource);
                            vbillno = res.data.head[card_from_id].rows[0].values.vbillno.value;
                            this.setState({
                                vbillno: vbillno
                            });
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                        }
                        props.pushTo("/card",{
                            status: 'browse',
                            id: pks,
                            pagecode: card_page_id,
                        });
                        this.toggleShow();
                    } else {
                        this.props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
                        this.props.cardTable.setTableData(card_table_id, { rows: [] });
                    }
                }
            });
        }
    }
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/