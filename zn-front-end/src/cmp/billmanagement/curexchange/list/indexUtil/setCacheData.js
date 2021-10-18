/*ZJ1RpdG5WVx2Yt0Q+MJL5QhOQ/8wPjItWg3/aqI/BYzOUhgseJmc3j5fteLSMBfn*/
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
 * [外币兑换index]-加载缓存数据
 * @param {*}  
 */
export const setCacheData = function () {

    let { hasCacheData } = this.props.table;
    restNavData.call(this);//获得缓存中state值
    if (!hasCacheData(this.dataSource)) {
        //自己查询数据
    } else {
        //加载缓存数据-自动加载数据
    }
}

/*ZJ1RpdG5WVx2Yt0Q+MJL5QhOQ/8wPjItWg3/aqI/BYzOUhgseJmc3j5fteLSMBfn*/