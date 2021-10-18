/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import {
    cardCache
} from 'nc-lightapp-front';
let {
    getDefData
} = cardCache;
import {
    constant,
} from '../../config/config';

export const buttonVisible = function (props) {
    let isfiplink = getDefData(constant.fipscene_key, this.cacheDataSource);
    if (isfiplink) {
        props.button.setButtonVisible(
            [
                "btngroup",
                "addBtn",
                "deleteBtn",
                "copyBtn",
                "submitBtn",
                "submitgroup",
                "unsubmitBtn",
                "settleBtn",
                "settlegroup",
                "unsettleBtn",
            ],
            false
        );
    }

}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/