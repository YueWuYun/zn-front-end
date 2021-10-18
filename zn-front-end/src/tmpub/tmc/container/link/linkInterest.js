/*YPdaQjoCGoSzbu0W7J+Mx+6Z7B499VHo9YAcAZC4d6ozSSDntvhZDRvd8Sr71Q3U*/
/* 
 联查利率
 created by: liyaoh 2018-12-06

 基准利率分为三个节点：全局利率、集团利率、组织利率，
 联查之前先根据传过来的利率pk发送请求判断是那种利率类型，再跳转至相应节点
 */
import { ajax } from 'nc-lightapp-front';
import { linkApp } from './index';

//根据利率类型联查利率
const linkInterestConst = {
    //组织
    '0': {
        url: '/tmpub/pub/interestrate_org/main/index.html#/card',
        appcode: '36010IRCO',
        pagecode: '36010IRCO_card',
    },
    //集团
    '1': {
        url: '/tmpub/pub/interestrate_group/main/index.html#/card',
        appcode: '36010IRCG',
        pagecode: '36010IRCG_card',
    },
    //全局
    '2': {
        url: '/tmpub/pub/interestrate_global/main/index.html#/card',
        appcode: '36010IRC',
        pagecode: '36010IRC_card',
    }
}

/**
 * 联查利率
 *
 * @param {*} pk - 主键数
 */
export default function(pk) {
    ajax({
        url: '/nccloud/tmpub/tmbd/linkinterest.do',
        data: { pk },
        success: (res) => {
            let { data } = res;
            if (data) {
                let { url, appcode, pagecode } = linkInterestConst[data.rateclass];
                linkApp(this.props, {
                    url,
                    appcode,
                    pagecode,
                    id: pk
                });
            }
        }
    });
    
}
/*YPdaQjoCGoSzbu0W7J+Mx+6Z7B499VHo9YAcAZC4d6ozSSDntvhZDRvd8Sr71Q3U*/