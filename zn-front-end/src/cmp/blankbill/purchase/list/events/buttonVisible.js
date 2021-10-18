/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { ajax, base, toast,cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { LINK_KEY, BBP_CACHEKEY  } = BBP_CONST;
export const buttonVisible = function(props) {
	let ISlINK = getDefData(LINK_KEY, BBP_CACHEKEY);
    if(ISlINK){
		props.button.setButtonVisible(
			[
				'save',
				'delete',
				'copy',
				'delete',
				'commit',
				'uncommit',
				'BaseImageShow',
				'BaseImageScan',
				'Associate',
				'unassociate',
				'Refresh'
			],
			false
		);
	}		
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/