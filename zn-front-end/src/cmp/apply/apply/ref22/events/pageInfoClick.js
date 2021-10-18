/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax, cardCache } from 'nc-lightapp-front';
//引入常量定义
import { URL_INFO, CARD_PAGE_INFO, APP_INFO } from '../../cons/constant';
import { loadData2Card, qryDataByPK } from "../../util/index";
export default function (props, pk) {
    if (!pk) {
        return;
    }
    props.setUrlParam(pk);
    //从缓存中获取数据
    let cardData = cardCache.getCacheById(pk, APP_INFO.DATA_SOURCE_TRANS);
    //缓存存在，则加载缓存数据到界面
    if (cardData) {
        loadData2Card(props, cardData);
    }
    //缓存不存在，则查询数据
    else {
        qryDataByPK(props, pk);
    }

} 

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/