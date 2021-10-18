/*08vazVJFUkwcwKswIK8g+K19qzkRC97UYBOH7hVZ73a8IF+Cam1enUNfLb8rSusx*/
import { cardCache } from 'nc-lightapp-front';
//缓存
let { getDefData } = cardCache;

/**
 * [收款]-回显查询条件
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const renderCompleteEvent = function () {
    let cachesearch = getDefData(this.searchKey, this.dataSource);
    if (cachesearch && cachesearch.conditions) {
        for (let item of cachesearch.conditions) {
            if (item.field == 'bill_date') {
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