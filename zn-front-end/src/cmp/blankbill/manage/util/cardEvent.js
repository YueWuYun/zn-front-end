/*QB6Cta54YZYj18ukkNSw6gs7VRISnv9QdaiLWFNc+l5MkTzoPNUyvzods+qh9P8e*/
/**
 * 贷款管理卡片公共事件函数
 * @author：zhangyangz
 */
import {
    ajax,
    toast,
    cacheTools,
    cardCache,
    deepClone
} from "nc-lightapp-front";
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
let {
    setDefData,
    getDefData,
    getCacheById,
    updateCache,
    addCache,
    getNextId,
    deleteCacheById
} = cardCache;

/**
 * 卡片获取单据详情
 * @param {*} url        请求路径
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData(url, id, pageCode, fromid) {
    ajax({
        url: `${url}`,
        data: {
            pk: id,
            pageCode: this.pageId
        },
        success: res => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    this.props.form.setAllFormValue({
                        [this.formId]: data[this.formId]
                    });
                    // this.setState({
                    //     billNo: this.props.form.getFormItemsValue(
                    //         this.formId,
                    //         "applycode"
                    //     ).value,
                    //     ts: data[this.formId].rows[0].values.ts.value
                    // });
                }
                this.buttonVisible(this.props);
                // 更新缓存
                updateCache(this.primaryId, id, data, this.formId, this.cache);
            }
        }
    });
}

/*QB6Cta54YZYj18ukkNSw6gs7VRISnv9QdaiLWFNc+l5MkTzoPNUyvzods+qh9P8e*/