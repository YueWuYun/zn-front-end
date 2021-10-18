/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast, cardCache} from 'nc-lightapp-front';
import { constant, requesturl, buttonDisabled }  from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { buttonVisible } from './buttonVisible';
import BankaccSubUseTreeGridRef from '../../../../../uapbd/refer/pub/BankaccSubUseTreeGridRef';
import CashAccountGridRef  from '../../../../../uapbd/refer/sminfo/CashAccountGridRef';
let {setDefData, getDefData } = cardCache;
let searchcode = constant.searchcode;
let cacheDataSource = constant.cacheDataSource;
import {
    setDefOrg2ListSrchArea,
    setDefOrg2AdvanceSrchArea
} from "src/tmpub/pub/util/index";

export default function(props) {
	props.createUIDom(
		{
			pagecode: constant.lpagecode,
			appcode: props.getUrlParam('c')
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta, data);
					props.meta.setMeta(meta);

					// 给列表查询区域赋默认业务单元(在setMeta之后使用)
                    setDefOrg2ListSrchArea(props, searchcode, data);

					// 点击选择账户按钮，返回列表页面时，需要根据财务组织重新加载页面
					if (data.context && data.context.pk_org) {
						this.searchOnAfterEvent("pkOrg");// 有默认财务组织
					} else {
						this.searchOnAfterEvent();// 没有默认财务组织，如果是卡片返回的，需要从缓存中加载财务组织。
					}
					
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					props.button.setButtonDisabled(buttonDisabled.defaultdisable, true);
				}
			}
		}
	);
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta, data) {

	//有默认业务单元
	if (data.context && data.context.pk_org) {
		let { pk_org, org_Name } = data.context;
		meta[searchcode].items.map((item) => {
			if (item.attrcode == 'pkOrg') {
				item.initialvalue = {
					display: org_Name, value: pk_org
				}
			}
		});
	}

	meta[searchcode].items.map((item) => {

		item.isShowDisabledData = true;

		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pkOrg') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: commondata.financeOrgPermissionFilter // 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});

	meta[constant.ltablecode].items.map((item) => {

		if (item.attrcode === 'cashAccount') {

			item.render = function(text, record, index) {
					return (
						CashAccountGridRef({
							queryCondition: () => {
								let pk_org = props.search.getSearchValByField(searchcode, 'pkOrg').value.firstvalue;
									return {
										pk_org: pk_org, 
										pk_currtype: record.values.bzPk.value,
										refnodename: commondata.refnodename,
										isDisableDataShow:false,//默认只加载启用的账户
					                    noConditionOrg:'N',
										isMultiSelectedEnabled:true,
										GridRefActionExt: commondata.cashaccountref 
									};
							}
						})
					);
			}
		}

		if (item.attrcode === 'bankAccount') {

			item.render = function(text, record, index) {
					return (
						BankaccSubUseTreeGridRef({
							queryCondition: () => {
								let pk_org = props.search.getSearchValByField(searchcode, 'pkOrg').value.firstvalue;
									return {
										pk_org: pk_org, 
										pk_currtype: record.values.bzPk.value,
										refnodename: commondata.refnodename,
										isDisableDataShow:false,//默认只加载启用的账户
					                    noConditionOrg:'N',
										isMultiSelectedEnabled:true,
										GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'
									};
							}
						})
					);
			}
		}
	});

	//设置参照可以多选和是否清楚记录
	meta[constant.ltablecode].items.find((e) => e.attrcode === 'bankAccount').isMultiSelectedEnabled = true;
	meta[constant.ltablecode].items.find((e) => e.attrcode === 'bankAccount').showHistory = true;
	
	//财务组织:全加载
	meta[constant.ltablecode].items.find((e) => e.attrcode === 'bankAccount').isTreelazyLoad = false;

	//设置参照可以多选和是否清楚记录
	meta[constant.ltablecode].items.find((e) => e.attrcode === 'cashAccount').isMultiSelectedEnabled = true;
	meta[constant.ltablecode].items.find((e) => e.attrcode === 'cashAccount').showHistory = true;
	
	//财务组织:全加载
	meta[constant.ltablecode].items.find((e) => e.attrcode === 'cashAccount').isTreelazyLoad = false;
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/