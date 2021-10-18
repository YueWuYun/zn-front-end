/*08vazVJFUkwcwKswIK8g+K19qzkRC97UYBOH7hVZ73a8IF+Cam1enUNfLb8rSusx*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
import { restNavData } from "./restNavData";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换index]-查询区回显查询数据
 * @param {*}  
 */
export const renderCompleteEvent = function () {
    let cachesearch = getDefData(this.searchKey, this.dataSource);
    if (cachesearch && cachesearch.conditions) {
        for (let item of cachesearch.conditions) {
            if (item.field == 'billdate') {
                // 时间类型特殊处理
                let time = [];
                time.push(item.value.firstvalue);
                time.push(item.value.secondvalue);
                this.props.search.setSearchValByField(this.searchId, item.field,
                    { display: item.display, value: time });
            } else {
                this.props.search.setSearchValByField(this.searchId, item.field,
                    { display: item.display, value: item.value.firstvalue });
            }
        }
    }
}

/*08vazVJFUkwcwKswIK8g+K19qzkRC97UYBOH7hVZ73a8IF+Cam1enUNfLb8rSusx*/