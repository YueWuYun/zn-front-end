/*15hTNjf2Q30FwImWlZpr2Z1SJCeGuPuYUTun2DGCJLAY+2rQOpHtGmwvhh+0LaRR*/
import { createPage, ajax, base, toast, cacheTools, print,output, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换]-输出按钮
 * @param {*} props  
 */
export const cardoutputBtn = function () {
    let pks = [];
    pks.push(this.props.form.getFormItemsValue(this.formId, 'pk_cruexchange').value);
    output({
        url: '/nccloud/cmp/curexchange/curexchangeprint.do',
        data: {
            nodekey: Templatedata.printcard_nodekey,
            appcode: this.props.getSearchParam('c'),
            oids:pks,
            outputType: 'output'
        }
    });
}

/*15hTNjf2Q30FwImWlZpr2Z1SJCeGuPuYUTun2DGCJLAY+2rQOpHtGmwvhh+0LaRR*/