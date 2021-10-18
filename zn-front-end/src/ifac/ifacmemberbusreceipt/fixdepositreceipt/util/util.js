/*Fnw/+7RrVHUifmTwZcmqxVe6inNc/GCKq1l2GB8JY3E=*/
import { ajax } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl } from '../cons/constant.js';

export function interestBill(pk) {
    ajax({
        url: `${baseReqUrl}${javaUrl.queryinterest}.do`,
        data: { pk },
        success: (res) => {
            if (res.data && res.success) {
                this.props.openTo('/ifac/ifactimedepositmange/initialdepositreceipt/main/index.html#/card', {
                    appcode: '36340FDSR',
                    pagecode:'36340FDSR_C01',
                    scene: 'linksce',
                    id: res.data,
                });
            } 
        }
    }); 
}

/*Fnw/+7RrVHUifmTwZcmqxVe6inNc/GCKq1l2GB8JY3E=*/