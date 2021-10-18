/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { constant }  from '../../config/config';
import {

	cardCache,

} from 'nc-lightapp-front';
let { getDefData } = cardCache;
export const buttonVisible = function (props) {

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
            "enclosureBtn",
            "makebillBtn",
        ],
        true
        
    );
     props.button.setButtonVisible(

        [
            
            "refreshBtn"
           
        ],
        false
     );
    let isfiplink = getDefData(constant.fipscene_key, constant.cacheDataSource);
    if (isfiplink) {
        props.button.setButtonVisible(
            [
                "joinquery",
                "joinquerygroup",
                "cashbalanceBtn",
                "bankaccbalanceBtn",
                "printBtn",
                "printgroup",
                "outputBtn",
                "enclosureBtn"
            ],
            true
        );
        props.button.setButtonVisible(

            [
                "makebillBtn",
                "refreshBtn"
               
            ],
            false
         );
    }
     

}
/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/