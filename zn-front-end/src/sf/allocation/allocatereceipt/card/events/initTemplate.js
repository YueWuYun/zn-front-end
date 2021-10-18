/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
const { NCMessage } = base;
import { buttonVisible }  from './index';
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { base_url, list_table_id, list_page_id, list_search_id, dataSource, card_page_id, list_search_code,islink} from '../../cons/constant.js';
const formId = 'form_allocatereceipt_head';
const pageId = '36320FAR_C01';

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			//appcode:'36320FAR',
			appid: '0001Z61000000002JTLM'//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(that, props);
					//被联查时 没有记账 取消记账 制证 取消制证 刷新
					if(getDefData(dataSource, islink)){
						props.button.setButtonVisible(['Bookkeeping','UnBookkeeping','Certification','UnCertification','Refresh'], false);
					}
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/