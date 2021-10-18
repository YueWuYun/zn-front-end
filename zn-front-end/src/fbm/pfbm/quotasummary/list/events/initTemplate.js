/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, base, toast, excelImportconfig } from 'nc-lightapp-front';
import { bodyButtonClick } from './index';
import { CARD, LIST, app_code, button_limit } from '../../cons/constant.js';
import { initList } from '../../../../public/container/page';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
const { FormControl } = base;
export default function (props) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: LIST.page_id,//页面code
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('DeleteInner', this.props.MutiInit.getIntl("36185540") && this.props.MutiInit.getIntl("36185540").get('36185540-000001'));/* 国际化处理： 确认要删除吗?*/
					props.button.setButtonDisabled(LIST.disabled_btn, true);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					//给高级查询区域赋默认业务单元(在setMeta之前使用)
					// setDefOrg2AdvanceSrchArea(props, LIST.search_id, data);
					props.meta.setMeta(meta);
					//给列表查询区域赋默认业务单元(在setMeta之后使用)
					//setDefOrg2ListSrchArea(props, LIST.search_id, data);
					templateCallback.call(this, meta);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[this.tableId].pagination = false;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == this.billNo) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[this.primaryId].value,
								pagecode: LIST.page_id
							});
						}}
					>
						{record[this.billNo] && record[this.billNo].value}
					</a>
				);
			};
		}
		return item;
	});

	//添加操作列
	// meta[this.tableId].items.push({
	// 	itemtype: 'customer',
	// 	attrcode: 'opr',
	// 	label: '',/* 国际化处理： 剩余额度*/
	// 	width: 200,
	// 	//fixed: 'left',
	// 	className: "table-opr",
	// 	visible: true,
	// 	render: (text, record, index) => {

	// 	}
	// });
	return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
	initList.call(this);
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/