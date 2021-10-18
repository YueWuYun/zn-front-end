/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/
//联查页面
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { LIST, app_code, link_app_code, button_limit } from '../../cons/constant.js';
import { initList } from '../../../../public/container/page';
export default function (props) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: LIST.page_id_link,	//页面code
			appcode: appcode 				//link_app_code
		},
		(data) => {
			if (data) {
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setButtonDisabled(LIST.disabled_btn, true);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					templateCallback.call(this, meta);
				}
			}
		}
	)
}
function modifierMeta(props, meta) {
	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		if (item.attrcode == this.billNo) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[LIST.primary_id].value,
								pagecode: LIST.page_id,
								scene: 'linksce'
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
	return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
	initList.call(this);
}

/*sQld1OaD34tZblwSuoZXp/UgyNG96kaHdpooRuwzU5AIaEl2vYHJTZkTpsyzmx4B*/