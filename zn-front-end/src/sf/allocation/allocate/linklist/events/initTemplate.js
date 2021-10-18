/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast, cardCache } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon, NCTooltip } = base;
import bodyButtonClick from './bodyButtonClick';
import { go2card, go2linkcard, loadSearchCache } from "../../util/index";
import { setButtonUsability } from '../events';
import { base_url, button, list_table_id, link_list_page_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode, dataSource, link_card_page_id } from '../../cons/constant.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

let tableId = 'table_allocate_02';
let pageId = '36320FA_LINKL01';
export default function (props) {
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c')
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);					
					let linkScene =  props.getUrlParam('scene');
					cardCache.setDefData("linkScene", dataSource, linkScene);
					setTimeout(() => {
						let data = cardCache.getDefData(list_table_id, dataSource);
						if (data && data.rows && data.rows.length > 0) {
							this.props.table.setAllTableData(list_table_id, data);
						}
					}, 0);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonUsability(props);
					props.button.setPopContent('delete_inner', loadMultiLang(this.props,'36320FA-000060'));/* 国际化处理： 确定要删除吗？*/
				}
			}
		}
	)
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {

							go2linkcard(props, { pagecode: link_card_page_id, status: 'browse', id: record.pk_allocate_h.value }, this.getState.bind(this));
						}}
					>
						{record && record.vbillno && record.vbillno.value}
					</a>

				);
			};
		}
		else if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return (
					<span>
						{record.dbilldate && seperateDate(record.dbilldate.value)}
					</span>
				);
			};
		}

		return item;
	});
	let multiLang = props.MutiInit.getIntl('3632');
	//被联查页面不显示 翻页
	meta[list_table_id].pagination = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/