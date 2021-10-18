/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast, cardCache, cacheTools} from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import * as CONSTANTS from '../constants';
import { buttonVisible } from "./buttonVisible";
let { tableId, searchId, pagecode, appid, formId_01, formId_02, oid ,CACHE_KEY,DATA_SOURCE} = CONSTANTS;
const { NCMenu, NCDropdown, NCCheckbox, NCButton, NCMessage, NCCol, NCRow } = base;
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
const { Item } = NCMenu;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode,//页面id
			appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;

					meta = modifierMeta(that, props, meta)
					//加载模板数据
					props.meta.setMeta(meta);					
					that.initData.call(that);
					//设置默认组织	
					if(props.getUrlParam('scene')=='bz'){
					  SSCLinkDefaultOrg(props);
					  
				    }else{
                       setDefaultOrg(props);
					}
					
				}
				if (data.button) {
					let button = data.button;
					buttonVisible(props);
					props.button.setButtons(button);
				}
			}
		}
	)
}
/**
 * 日期格式化
 * @param {*} date 
 */
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}
function modifierMeta(that, props, meta) {

	//显示查询区域字段
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.visible = true;
		item.col = '4';
		item.isShowDisabledData = true;
		return item;
	})
	//银行账户子户，设置多选
	/**
	 * 查询区域参照过滤
	 */
	meta[searchId].items.map((item) => {
		//财务组织过滤,用户有权限的组织
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: '36070AI',
					isSSCOrg: 'Y',
					TreeRefActionExt: 'nccloud.web.cmp.informer.refbuilder.InformerSSCOrgRefBuilder'
				};
			};
		}
		//银行账户子户过滤，根据组织过滤
		if (item.attrcode == 'pk_acc_sub') {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue;
				return {
					pk_org: pk_org,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccSubDefaultBuilder'
				};
			};
		}

	}
	);
	//start 设置参照属性
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[formId_01].items.find((e) => e.attrcode === 'busitype').showHistory = true;
	//end 设置参照属性
	meta[formId_01].items.map((item) => {
		if (item.attrcode == 'busitype') {
			item.queryCondition = () => {
				let direction = props.form.getFormItemsValue(formId_01, 'sfflag').value;
				return {
					sfbz: direction,
					GridRefActionExt: 'nccloud.web.cmp.informer.refbuilder.ReleaseTranstypeFilter'//自定义参照过滤条件
				};
			};
		}
	});

	meta[formId_02].items.map((item) => {
		if (item.attrcode == 'busitype') {
			item.queryCondition = () => {
				let direction = props.form.getFormItemsValue(formId_02, 'sfflag').value;
				return {
					sfbz: direction,
					GridRefActionExt: 'nccloud.web.cmp.informer.refbuilder.ReleaseRefundTranstypeFilter'//自定义参照过滤条件
				};
			};
		}
	});
	
	meta[tableId].pagination = true;

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// if (item.attrcode == 'infodate') {
		// 	item.width = 180;
		// }

		//item.width = 180;
		// if (item.attrcode == 'infodate') {
		// 	item.render = (text, record, index) => {
		// 		return (
		// 			<span>
		// 				{record.infodate && seperateDate(record.infodate.value)}
		// 			</span>
		// 		);
		// 	};
		// }
		return item;
	});
	let multiLang = props.MutiInit.getIntl('36070AIPSSC');
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		// label: multiLang && multiLang.get('36300TP-0005'),
		label: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000004'),
		fixed: 'right',
		className: "table-opr",
		visible: true,
		itemtype: 'customer',
		render: (text, record, index) => {
			let buttonAry =
				record.generateflag.value == 'hasnogenerate'//未生成
					? ["Lclaim",'Lrefund']//不生单，发布
					: record.generateflag.value == 'hasrelease'//已发布
						? ["Lclaim",'Lrefund']//明细，取消发布
						: record.generateflag.value == 'hasgenerate'//已生成
							? []
							: record.generateflag.value == 'hasclaim'//已认领
								? []//明细
								: [];
			if(buttonAry.length==0){
				return "";
			}else{
				return props.button.createOprationButton(buttonAry, {
					area: "list_inner",
					buttonLimit: 3,
					onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
				});
			}
		}
	});
	return meta;
}


function setDefaultOrg(props) {
	ajax({
		url: '/nccloud/cmp/informer/defaultorg.do',
		data: { ssc: 'true' },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.search.setSearchValByField('search', 'pk_org', { value: data.value, display: data.display });
				} else {
					props.search.setSearchValByField('search', 'pk_org', {});
				}
			}
		}
	});
}


function SSCLinkDefaultOrg(props) {
	ajax({
		url: '/nccloud/cmp/release/sscDefaultOrg.do',	                           
		data: {},
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.search.setSearchValByField('search', 'pk_org', { value: data.Val, display: data.Dis });
					props.search.setSearchValByField('search', 'infodate', {value:data.Date, display: "上月,本月" });
					props.search.setSearchValByField('search', 'generateflag', {value:'hasnogenerate', display: "未生成" });
				} 
			}
		}
	});

	
}




/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/