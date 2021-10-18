/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import { ajax, cardCache } from 'nc-lightapp-front';
//引入常量定义
import { module_id, base_url, button_limit, card_page_id, card_from_id, card_table_id, viewmod_deal, dataSource } from '../../cons/constant.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

export default function (props, pk) {
    debugger;
    if (pk) {
        console.log(pk);
        // 后台还没更新，暂不可用
        let data = {
            "pk": pk,
            "pageid": card_page_id,
            'pageCode': card_page_id
        };
        let { getCacheById, updateCache } = cardCache;
        props.setUrlParam(pk);
        /*
        * id：数据主键的值
        * dataSource: 缓存数据命名空间
        */
        let cardData = getCacheById(pk, dataSource);
        debugger;
        if (cardData) {
            this.billno=cardData.head[card_from_id].rows[0].values.vbillno.value;
            this.props.form.setAllFormValue({ [card_from_id]: cardData.head[card_from_id] });
            this.props.cardTable.setTableData(card_table_id, cardData.body[card_table_id]);
            props.setUrlParam({
                status: 'browse',
                id: pk
            });
            this.toggleShow();
        } else {
            ajax({
                url: '/nccloud/sf/allocation/querycard.do',
                data: data,
                success: (res) => {
                    if (res.data) {
                        let vbillno = '';
                        if (res.data.head) {
                            props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                            /*
                            * idname: 数据主键的命名
                            * id：数据主键的值
                            * headAreacode: 卡片表头的区域编码
                            * dataSource: 缓存数据命名空间
                            */
                            updateCache('pk_allocate_h', pk, res.data, card_from_id, dataSource);
                            vbillno = res.data.head[card_from_id].rows[0].values.vbillno.value;

                        }
                        if (res.data.body) {
                            props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                        }
                        this.billno = vbillno;
                        props.setUrlParam({
                            status: 'browse',
                            id: pk
                        });
                        this.toggleShow();
                    } else {
                        props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
                        props.cardTable.setTableData(card_table_id, { rows: [] });
                    }
                }
            });
        }
        // }else {

    }
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/