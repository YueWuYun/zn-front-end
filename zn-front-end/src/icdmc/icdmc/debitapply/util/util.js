/*K4vLfwncf4lJzeNUje0AUz9ygIsbwoAeLlwExIXxMOE=*/
import { ajax } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl } from '../cons/constant.js';

export function interestBill(pk) {
    ajax({
        url: `${baseReqUrl}${javaUrl.queryinterest}.do`,
        data: { pk },
        success: (res) => {
            if (res.data && res.success) {
                this.props.openTo('/cdmc/cdm/interest/main/index.html#/card', {
                    appcode: '36630BCIB',
                    pagecode:'336630BCIB_CARD',
                    scene: 'linksce',
                    id: res.data,
                });
            } 
        }
    }); 
}

/*K4vLfwncf4lJzeNUje0AUz9ygIsbwoAeLlwExIXxMOE=*/