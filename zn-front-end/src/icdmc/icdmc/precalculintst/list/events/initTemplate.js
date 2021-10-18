/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import * as CONSTANTS from '../../const/constants';
import buttonDisable from './buttonDisable';
let { tableId, searchId, pageCodeList, appcode } = CONSTANTS;
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageCodeList,//页面code
			appcode:props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;

					meta = modifierMeta(that, props, meta);
				    //加载模板数据
				    props.meta.setMeta(meta);
					//获取默认业务单元
    				let { pk_org, org_Name } = data.context;
    				let searchData = { 'display': org_Name, 'value': pk_org };
    				//更新列表查询区域
    				props.search.setSearchValByField(searchId, 'financecorpid', searchData);
				    //遍历查询区域字段，将默认业务单元赋值给组织字段
				    meta[searchId].items.map((item) => {
						if (item.attrcode == 'financecorpid') {
							item.initialvalue = { 'display': org_Name, 'value': pk_org }
						}
					});
					
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
					pk_finorg: (props.search.getSearchValByField(searchId, 'financecorpid') || {}).value.firstvalue, 
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceFundOrgRelationFilter'
				};
			};
		}

		if (item.attrcode == 'financecorpid') {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		if (item.attrcode == 'vbillno') {
			item.queryCondition = () => {
				return {
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