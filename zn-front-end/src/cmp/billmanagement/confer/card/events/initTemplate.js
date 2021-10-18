/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
const formId = 'form';
const pageId = '360701BCS_C01';
export default function (props) {
	props.createUIDom(
		{
			pagecode: pageId,
			appcode: props.getUrlParam('c')
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
					props.button.setButtons(button, () => {
						let status = props.getUrlParam('status');
						let flag = status === 'browse' ? false : true;
						props.button.setButtonVisible(['save', 'cancel'], flag);
						props.button.setButtonVisible(['edit', 'add'], !flag);
					});
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;


	meta[formId].items.map((item) => {
		//财务组织:全加载
		meta['form'].items.find((e) => e.attrcode === 'sourceorg').isTreelazyLoad = false;
		meta['form'].items.find((e) => e.attrcode === 'targetorg').isTreelazyLoad = false;

		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'sourceorg' || item.attrcode == 'targetorg') {
			item.queryCondition = () => {
				return {
					funcode: '360701BCS',
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}

		if (item.attrcode == 'sourcebill' || item.attrcode == 'targetbill') {
			item.queryCondition = () => {
				return {
					funcode: '360701BCS',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBilltypeRefSqlBuilder'
				};
			};
		}

	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/