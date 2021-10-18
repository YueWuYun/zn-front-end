/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { cache } from '../../../../../tmpub/pub/cons/constant';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息


//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换index]-表格双击事件
 * @param {*}  
 */
export const onrowDoubleclick = function (record, index, props, e) {
    let link_scene = props.getUrlParam('scene');//是否联查过来的单据;
    let isvoucherlink = getDefData(this.linkkey, this.dataSource);//是否凭证联查单据

    //begin lidyu 双击进入卡片 异常交互 
    cardCache.setDefData(cache.iserrtoast, Templatedata.dataSource, true);
    //end
    
    if(link_scene || isvoucherlink){
        this.props.pushTo('/card', {
            status: 'browse',
            id: record.pk_cruexchange.value,
            pk: record.busistatus.value,
            scene:link_scene,
            fip: true//是否凭证联查标识
        });
    }else{
        this.props.pushTo('/card', {
            status: 'browse',
            id: record.pk_cruexchange.value,
            pk: record.busistatus.value,
        });
    }
   
}

/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/