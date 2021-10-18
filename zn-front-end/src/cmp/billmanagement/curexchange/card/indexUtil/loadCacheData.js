/*3tp55/tWOecflPnfrNqQPzlOsk0lKD+YSmLT3BAdL0GPtLwHCE/8G5YnGEOq3rt1*/
import { cardCache } from 'nc-lightapp-front';
//缓存
let { 
    getCurrentLastId, getCacheById
     } = cardCache;

/**
 * [外币兑换index]-加载缓存数据[卡片新增取消使用]
 * @param {*}  
 */
export const loadCacheData = function () {
    let data_id = getCurrentLastId(this.dataSource);
    let cardData;
    if (data_id) {
        cardData = getCacheById(data_id, this.dataSource);
    }
    if (cardData) {
        //加载缓存
        this.props.form.setAllFormValue({ [this.formId]: cardData[this.formId] });
        let vbillno = cardData[this.formId].rows[0].values.vbillno.value;
        let busistatus = cardData[this.formId].rows[0].values.busistatus.value;
        this.billno = vbillno;
        this.props.setUrlParam({
            status: 'browse',
            id: pks,
            pk: busistatus
        });
        this.toggleShow();//切换页面状态
    } else {
        this.cancleSkyPage();
    }
}

/*3tp55/tWOecflPnfrNqQPzlOsk0lKD+YSmLT3BAdL0GPtLwHCE/8G5YnGEOq3rt1*/