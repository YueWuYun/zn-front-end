/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { ajax, base, toast,cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, SEARCH_CODE, LIST_TABLECODE, CARD__PAGECODE } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST

export const buttonVisible = function(props) {
	let ISlINK = getDefData(LINK_KEY, BBR_CACHEKEY);
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