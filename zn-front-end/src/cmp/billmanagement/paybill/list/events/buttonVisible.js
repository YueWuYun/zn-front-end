/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { ajax, base, toast,cardCache } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
import {PAYBILL_CONST} from '../../cons/constant.js';

export const buttonVisible = function(props) {
	let ISlINK = getDefData(PAYBILL_CONST.link_key, PAYBILL_CONST.paybillCacheKey);
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
				'Refresh',
				'exportFile',
				'ImportData',
				'excelOp',
				'excel'
			],
			false
		);
	}		
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/