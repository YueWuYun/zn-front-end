/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import * as CONSTANTS from '../../const/constants';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from '../../../../pub/utils/FTSReceiptOrg';
let { tableId, searchId, pageCodeList, appId, oid, appcode, attrCode, pkname } = CONSTANTS;
const { NCMenu, NCDropdown, NCCheckbox, NCButton, NCMessage, NCCol, NCRow } = base;
const { Item } = NCMenu;
import buttonClick from './buttonClick';

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			// pageCodeList,//页面code
			pagecode: pageCodeList,
			//appId//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					let link = that.props.getUrlParam('scene') == 'pk_src' ? true : false;
					meta = modifierMeta(that, props, meta)
					if (!link) {
						setDefOrg2AdvanceSrchArea(props, searchId, data, 'pk_org_p');
					}
					//加载模板数据
					props.meta.setMeta(meta);
					//查询赋默认组织			
					if (!link) {
						setDefOrg2ListSrchArea(props, searchId, data, 'pk_org_p');
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				that.selectedChangeFn(props, tableId);
			}
		}
	)
	//初始化禁用打印等按钮
	props.button.setButtonDisabled(['formalprint', 'supplyprint', 'print', "printout"], true);
}

function modifierMeta(that, props, meta) {

	meta[searchId].items.find((e) => e.attrcode === 'pk_org_p').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_accid').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_currtype').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.map((item) => {
		item.isShowDisabledData = true;
	})
	meta[searchId].items.map((item) => {
		if (item.attrcode == 'pk_org_p') {
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}

		// 收款内部账户
		if (item.attrcode == 'pk_accid') {
			item.queryCondition = () => {
				let pk_currtype = props.search.getSearchValByField(searchId, 'pk_currtype').value.firstvalue;
				return {
					pk_currtype: pk_currtype
				};
			};
		}
	});

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == attrCode) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							let pushToData = {
								status: 'browse',
								formList: true
							}
							if (that.flag) {
								pushToData['scene'] = 'pk_src';
								pushToData['id'] = record[pkname].value;
							} else {
								pushToData['id'] = record[pkname].value;
							}
							props.pushTo('/card', pushToData);
						}}
					>
						{record && record[attrCode] && record[attrCode].value}
					</a>
				);
			};
		}
		return item;
	});
	//lidyu 添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: props.MutiInit.getIntl("36300REC") && props.MutiInit.getIntl("36300REC").get('36300REC-000016'),/* 国际化处理： 操作*/
		width: 160,
		itemtype: 'customer',
		className: "table-opr",
		fixed: 'right',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = ['link'];
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick(props, key, text, record, index)
			});
		}
	})
	return meta;
}




/*pmFWCFu5nhKkBzYmrkBakaVZInJOA2IJRhIwdhfe+QfB4OFkmRCsDBBI8pDiA3+2*/