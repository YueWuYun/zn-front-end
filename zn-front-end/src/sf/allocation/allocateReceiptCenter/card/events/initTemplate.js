/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax } from 'nc-lightapp-front';
import refer from './refer';//refer参照
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { base_url, list_table_id, list_page_id, list_search_id, dataSource, card_page_id, list_search_code,islink} from '../../cons/constant.js';
let { NCPopconfirm } = base;
const { NCMessage } = base;

const formId = 'form_allocatereceipt_head';
const pageId = '36320FARF_C01';

export default function (props) {
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appid: '0001Z61000000002MI32'//注册按钮的id
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
					//被联查时 没有刷新
					if (getDefData(dataSource, islink)) {
						props.button.setButtonVisible(['Refresh'], false);
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