/*j07c8riwYnz20MYibuDbtPs8ea8Iw7KaMX7bLf88vnlulX7DY6KPTntVQWkKfmUZ*/
import { module_id, base_url, card_page_id, card_from_id, card_table_id, dataSourceName, agentacc_pk } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl';
import {ajax, cardCache} from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';
import {processFormulamsg} from '../../util/util.js';
export default function (props, pks) {
    // 后台还没更新，暂不可用
    let data = {
        "pk": pks,
        "pageCode": this.pageId
    };

    if(pks==null){
        return;
    }
    
    let { getCacheById, updateCache } = cardCache;
    let cardData = getCacheById(pks, dataSourceName);
    //有缓存则从缓存取，无缓存则查询
    if(cardData){
        if (cardData.head) {
            props.form.setAllFormValue({ [card_from_id]: cardData.head[card_from_id] });
        }
        else {
            props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
        }
        if (cardData.body) {
            props.cardTable.setTableData(card_table_id, cardData.body[card_table_id]);
        }
        else {
            props.cardTable.setTableData(card_table_id, { rows: [] });
        }
        buttonVisible.call(this, this.props);//按钮显隐性
    }
    else {
        ajax({
            url: requesturl.querybyids,
            data: data,
            success: (res) => {
                if (res.data) {
                    //处理公式
					processFormulamsg(this.props, res);
                    if (res.data.head) {
                        props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                    }
                    if (res.data.body) {
                        props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                    }
                    else {
                        props.cardTable.setTableData(card_table_id, { rows: [] });
                    }
                    //更新缓存
                    updateCache(agentacc_pk, pks, res.data, card_from_id, dataSourceName, res.data.head[card_from_id].rows[0].values);
                    props.setUrlParam(pks)//动态修改地址栏中的id的值
                }
                else {
                    props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
                    props.cardTable.setTableData(card_table_id, { rows: [] });
                }
                buttonVisible.call(this, this.props);//按钮显隐性
            },
            error: (res) => {
                this.cancleNewPage('', '', this.pageId);
            }
        });
    }
}

/*j07c8riwYnz20MYibuDbtPs8ea8Iw7KaMX7bLf88vnlulX7DY6KPTntVQWkKfmUZ*/