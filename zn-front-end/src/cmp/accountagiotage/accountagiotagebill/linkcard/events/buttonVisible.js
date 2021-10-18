/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { showErrBtn } from "../../../../../tmpub/pub/util";
import { constant } from '../../config/config';

export const buttonVisible = function (props) {
    //控制重试按钮显示情况
    showErrBtn(props, { headBtnCode: 'card_head', headAreaCode: constant.formcode2,fieldPK:constant.pkname, datasource:constant.cacheDataSource });
    // 默认按钮隐藏
    props.button.setButtonVisible(
        [
            "refreshBtn",
            "enclosureBtn",
            "joinquery",
            "joinquerygroup",
            "printBtn"
        ],
        true
    );
    props.button.setButtonVisible(

        [
            
            "makebillBtn",
           
        ],
        false
     );
}

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/