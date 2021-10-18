/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/
import { ajax, cardCache } from 'nc-lightapp-front';
import { base_url, card_page_id, card_from_id, card_table_id, pkName, dataSource } from '../../cons/constant.js';
import { versionControl } from "../../util/spegatherUtil";


export default function (props, pk) {
    if (pk == null || pk == undefined || pk == '') {
        return;
    }
    //先从缓存中取数据
    let cardData = cardCache.getCacheById(pk, dataSource);
    //若缓存中有数据，则从缓存中取数
    if (cardData) {
        let { head, body } = cardData;
        if (head) {
            props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            this.setState({
                billID: head[card_from_id].rows[0].values.pk_spegather_h.value,
                billNO: head[card_from_id].rows[0].values.vbillno.value
            });
        }
        if (body) {
            props.cardTable.setTableData(card_table_id, body[card_table_id]);
        }
    }
    //若缓存中没有数据，则调用查询方法并把返回的数据放到缓存中
    else {
        let data = {
            pk: pk,
            pageCode: card_page_id
        };
        ajax({
            url: base_url + 'spegathercardquery.do',
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                        this.setState({
                            billID: res.data.head[card_from_id].rows[0].values.pk_spegather_h.value,
                            billNO: res.data.head[card_from_id].rows[0].values.vbillno.value
                        });
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                    }
                    //更新缓存中的数据
                    cardCache.updateCache(pkName, pk, res.data, card_from_id, dataSource);
                    //多版本控制
                    versionControl(this.props);
                    this.toggleShow();
                } else {
                    this.props.form.setAllFormValue({ [card_form_id]: { rows: [] } });
                    this.props.cardTable.setTableData(card_table_id, { rows: [] });
                }
            }
        });
    }
}

/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/