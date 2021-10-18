/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { card_form_id, data_source } from '../../cons/constant.js';
import { cardCache } from 'nc-lightapp-front';
import { processFormulamsg, qryDataByPK, repaintView, loadData2Card } from '../../util/index';
export default function (props, pk) {
    if (!pk) {
        return;
    }
    props.setUrlParam({
        id:pk
    });
    let cardData = cardCache.getCacheById(pk, data_source);
    //有缓存则从缓存取，无缓存则查询
    if (cardData) {
        loadData2Card(props, cardData);
    }
    else {
        //查询页面数据
        qryDataByPK(props, pk, this.updateState.bind(this));
    }
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/