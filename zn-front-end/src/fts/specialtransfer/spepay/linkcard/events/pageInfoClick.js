/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/
import { ajax, cardCache } from 'nc-lightapp-front';
import { base_url, card_page_id, card_from_id, card_table_id, dataSource, pkName } from '../../cons/constant.js';
import { versionControl } from "../../util/spepayUtil";

export default function (props, pk) {
    if (pk == null || pk == undefined || pk == '') {
        return;
    }
    props.setUrlParam(pk);
    //从缓存中获取数据
    let cardData = cardCache.getCacheById(pk, dataSource);
    //判断缓存中是否有数据，若有则从缓存中取数
    if (cardData) {
        let { head, body } = cardData;
        if (head) {
            props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            this.setState({
                billID: head[card_from_id].rows[0].values.pk_spepay_h.value,
                billNO: head[card_from_id].rows[0].values.vbillno.value
            });
        }
        if (body) {
            props.cardTable.setTableData(card_table_id, body[card_table_id]);
        }
        props.setUrlParam({
            status: 'browse',
            isCopy: false
          })
          
        this.qryData();
        // this.toggleShow();
    }
    //若缓存中没有数据，则走后台查询然后更新缓存
    else {
        let data = {
            pk: pk,
            pageCode: card_page_id
        };
        ajax({
            url: base_url + 'spepaycardquery.do',
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                        this.setState({
                            billID: res.data.head[card_from_id].rows[0].values.pk_spepay_h.value,
                            billNO: res.data.head[card_from_id].rows[0].values.vbillno.value
                        });
                    }
                    if (res.data.body) {
                        props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                    }
                    //更新缓存中的数据
                    cardCache.updateCache(pkName, pk, res.data, card_from_id, dataSource);
                    //多版本控制
                    versionControl(props);                   
                } else {
                    props.form.setAllFormValue({ [card_form_id]: { rows: [] } });
                    props.cardTable.setTableData(card_table_id, { rows: [] });
                }
                this.toggleShow();
            }
        });
    }   
}

/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/