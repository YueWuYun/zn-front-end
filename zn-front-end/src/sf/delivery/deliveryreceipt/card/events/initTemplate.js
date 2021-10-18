/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { base, ajax } from 'nc-lightapp-front';
import refer from './refer';//refer参照
import { buttonVisible } from './index';
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { card_page_id, dataSource, pk_deliveryreceipt,islink } from '../../cons/constant.js';
let { NCPopconfirm } = base;
const { NCMessage } = base;

const formId = 'form_deliveryreceipt_head';
const pageId = '36320FCR_C01';

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c'),
			appid: '0001Z61000000002DA9E'//注册按钮的id
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
					if (getDefData(dataSource, islink)) {
						props.button.setButtonVisible(['Bookkeeping', 'UnBookkeeping', 'Certification', 'UnCertification', 'Refresh'], false);
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