/*p0LZsK0dApV/SIQ0FAXluHHkN1vJS/saxzHYFov0d3K9EpQnm1WwfouEoeNhg0oV*/
import { createPage, ajax, base, high, toast, cacheTools, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import { MakeBillApp } from '../../../../public/utils/Makebill';//制单
import { linkApp, linkVoucherApp } from '../../../../public/utils/LinkUtil';//凭证
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款协同]-确认
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const confirmBtn = function () {
    this.props.pushTo('/card', {
        status: 'edit',
        id: this.props.getUrlParam('id'),
        pagecode: this.pageId
    })
    this.refresh();
}

/*p0LZsK0dApV/SIQ0FAXluHHkN1vJS/saxzHYFov0d3K9EpQnm1WwfouEoeNhg0oV*/