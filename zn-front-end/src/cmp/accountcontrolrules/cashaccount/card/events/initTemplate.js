/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { appcode, card_form_id, card_page_id, URL_INFO, PAGE_STATUS, FIELD } from '../../cons/constant.js';
import { versionControl, qryDataByPK, repaintView } from "../../util/index";
import { afterEvent, buttonVisible } from "./index";
import { hasDefaultOrg, setDefOrg2Form } from "../../../../../tmpub/pub/util/index";
export default function (props) {
	let that = this;
	let id = props.getUrlParam(URL_INFO.PARAM.ID);
	let status = props.getUrlParam(URL_INFO.PARAM.STATUS);
	let pagecode = props.getUrlParam(URL_INFO.PARAM.PAGECODE);
	if (!pagecode) {
		pagecode = card_page_id;
	}
	props.createUIDom(
		{ pagecode: pagecode },
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//个性化处理模板
					meta = modifierMeta(that, props, meta);
					//更新模板
					props.meta.setMeta(meta, () => {
					});
					//初始化界面数据
					initData.call(that, props, data, status, id);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					//按钮显隐性
					buttonVisible.call(that, props);
				}
			}
		}
	)
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam(URL_INFO.PARAM.STATUS);
	meta[card_form_id].status = status;
	//参照过滤
	meta[card_form_id].items.map((item) => {
		//资金组织
		if (item.attrcode == FIELD.PKORG) {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		//现金账户
		if (item.attrcode == FIELD.PKCASHACCOUNT) {
			item.queryCondition = () => {
				return {
					pk_org: props.form.getFormItemsValue(card_form_id, FIELD.PKORG).value
				};
			};
		}
	});

	return meta;
}


/**
 * 初始化数据
 * @param {*} props 
 */
const initData = function (props, data, status, id) {
	if (status == PAGE_STATUS.ADD) {
		props.form.EmptyAllFormValue(card_form_id);
		//没有默认组织时，控制字段不可编辑
		if (!hasDefaultOrg(data)) {
			//组织可编辑其余字段不可编辑
			props.initMetaByPkorg();
		} if (hasDefaultOrg(data)) {
			//加载默认业务单元到表头
			setDefOrg2Form(props, card_form_id, data);
			//触发新增默认值事件
			let { pk_org, org_Name } = data.context;
			afterEvent(props, card_form_id, 'default', { value: pk_org, display: org_Name });
		}
		repaintView(props);
	}
	else if (status == PAGE_STATUS.EDIT || status == PAGE_STATUS.BROWSER) {
		//查询页面数据
		qryDataByPK(props, id, this.updateState.bind(this));
	}
	//版本控制
	versionControl(props);
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/