/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/
import { qryData, getQueryData } from '../../util/index.js';
import { cardCache } from 'nc-lightapp-front';
import { search_key, search_source } from '../../cons/constant.js';

//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if (searchVal) {
        let data = getQueryData.call(this, props);
        if (!data || !data.queryCon) {
            return;
        }
        qryData.call(this, props, data, false, true, () => {
            cardCache.setDefData(search_key, search_source, data);
        });
    }
}
/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/