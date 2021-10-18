/*oDhifesZkRy3s4A8j4W0DuP0Lrv69BV3xQBpC+tAts9nIMuljC752PzeRB3ekfxr*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换index]-加载页签缓存数据
 * @param {*}  
 */
export const restNavData = function () {
    //获取页签数据
    let cachestate = getDefData(this.key, this.dataSource);
    if (cachestate) {
        let keys = Object.keys(cachestate);
        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i];
            this.state[key] = cachestate[key];
        }
    }
}

/*oDhifesZkRy3s4A8j4W0DuP0Lrv69BV3xQBpC+tAts9nIMuljC752PzeRB3ekfxr*/