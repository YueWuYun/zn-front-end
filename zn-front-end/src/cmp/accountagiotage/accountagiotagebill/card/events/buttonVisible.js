/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { constant } from '../../config/config';
import { showErrBtn } from "../../../../../tmpub/pub/util";
import {

	cardCache,

} from 'nc-lightapp-front';
let { getDefData } = cardCache;

export const buttonVisible = function (props) {
    //控制重试按钮显示情况
    showErrBtn(props, { headBtnCode: 'card_head', headAreaCode: constant.formcode1,fieldPK:constant.pkname, datasource:constant.cacheDataSource });
    // 默认按钮隐藏
    props.button.setButtonVisible(
        [
            "joinquery",
            "joinquerygroup",
            "cashbalanceBtn",
            "bankaccbalanceBtn",
            "voucherBtn",
           
            "printBtn",
            "printgroup",
            "outputBtn",
            
            "refreshBtn",
            "makebillBtn",
            "enclosureBtn"
        ],
        true
    );
    let isfiplink = getDefData(constant.fipscene_key, constant.cacheDataSource);
    if (isfiplink) {
        props.button.setButtonVisible(
            [
                "makebillBtn",
            ],
            false
        );
    }

}

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/