/*BgcgXYgmcLXh0EJNW+m5LDyj1zpWPY2vyCGOHGxXtTdVsnowjUv0JwIIIHYLRECv*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-复制按钮
 * @param {*} props  
 */
export const cardCopyBtn = function () {
    this.props.pushTo('/card', {
        status: 'copy',
        id: this.props.getUrlParam('id'),
        pagecode: this.pageId,
        bill_no: this.props.form.getFormItemsValue(this.formId, 'busistatus').value
    })
    this.refresh();
}

/*BgcgXYgmcLXh0EJNW+m5LDyj1zpWPY2vyCGOHGxXtTdVsnowjUv0JwIIIHYLRECv*/