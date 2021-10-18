/*aWRG0i0ATYEW3MKsBUEiUyS7Ed+tSZDHmgRsuJB2pe8EL2snNCHdox8WEFJh/2xZ*/
/* 
 联查结息日
 created by: liyaoh 2018-12-06
 */
import { ajax } from 'nc-lightapp-front';
import { linkApp } from './index';

const settledateConst = {
    url: '/tmpub/pub/settledate/main/index.html#/card',
    appcode: '36010ISDC',
    pagecodeList: '36010ISDC_LIST_01',
    pagecodeCard: '36010ISDC_CARD_01'
}

/**
 * 联查结息日
 *
 * @param {*} pk - 主键
 */
export default function (pk) {
    let { url, appcode, pagecodeCard } = settledateConst;
    linkApp(this.props, {
        url,
        appcode,
        pagecode: pagecodeCard,
        id: pk
    });
}
/*aWRG0i0ATYEW3MKsBUEiUyS7Ed+tSZDHmgRsuJB2pe8EL2snNCHdox8WEFJh/2xZ*/