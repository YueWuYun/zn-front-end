/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import * as CONSTANTS from '../../const/constants';
import buttonDisable from './buttonDisable';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
let { tableId, searchId, pageCodeList, appcode } = CONSTANTS;
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageCodeList,//页面code
			appcode:props.getUrlParam('c')
		},
		//function (data) {
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;

					meta = modifierMeta(that, props, meta)
					//setDefOrg2AdvanceSrchArea(props, searchId, data, 'pk_org');
					setDefOrg2AdvanceSrchArea(props, searchId, data);
					//加载模板数据
					props.meta.setMeta(meta);
					//查询赋默认组织					
					//setDefOrg2ListSrchArea(props, searchId, data, 'pk_org');
					setDefOrg2ListSrchArea(props, searchId, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonDisable.call(that, props);
				}
			}
		}
	)
}

function modifierMeta(that, props, meta) {

	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'financecorpid').isMultiSelectedEnabled = true;

	meta[searchId].items.map((item) => {

		item.isShowDisabledData = true;//显示停用
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}

		if (item.attrcode == 'financecorpid') {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					pk_fundpayorg: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue, 
					//TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
					TreeRefActionExt:"nccloud.web.tmpub.filter.FundFinanceOrgRelationFilter"
				};
			};
		}

		if (item.attrcode == 'vbillno') {
			item.queryCondition = () => {
				return {
					isquery: true,
					financecorpid:(props.search.getSearchValByField(searchId, 'financecorpid') || {}).value.firstvalue,
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue
				};
			};
		}

	});

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		//item.width = 150;
		return item;
	});
	
	return meta;
}




/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/