//BJMTlbNrEuu+EkDma0DIWcXIcY7BgwUKRpIPFzyKgtB4jnpWHWU22aTdcq+C0Xi0

/**
 * 查询区编辑前事件-将自己不需要的部分删除
 * 
 */
import {ajax } from 'nc-lightapp-front';
export default function (that, props, searchId, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		let attrcode = item.attrcode;
		item.isShowUnit = false;
		item.isShowDisabledData = true;
		switch (attrcode) {
			case 'pk_org': //工厂
			case 'itemid.pk_org'://工厂
				item.queryCondition = () => {
					item.isShowUnit = false;
					return {
						AppCode: props.getSearchParam('c'),
						isDataPowerEnable: 'Y',
						GridRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
					};
				};
				break;
			case 'cperiod': // 会计期间
			case 'itemid.cperiod'://会计期间
				item.queryCondition = () => {
					let pkOrgValue = getFirstOrgValue(
						(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue
					);
					let pk_accperiodscheme = null;
					ajax({
						url: '/nccloud/mapub/pub/cMGetAccperiodschemeByOrg.do',
						async: false,//同步
						data: {
							pk_org: pkOrgValue
						},
						success: (res) => {
							pk_accperiodscheme = res.data;
						}
					})
					return {
						pk_accperiodscheme: pk_accperiodscheme,
						isDataPowerEnable: 'Y',
					};
				};
				break;
			case 'itemid.celementid': //核算要素
				
				item.queryCondition = () => {
					let pkOrgValue = getFirstOrgValue(
						(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue
					);
					let financeorgid = null;//获取财务组织ID
					ajax({
						url: '/nccloud/mapub/pub/cMGetFinanceorgByOrg.do',
						async: false,//同步
						data: {
							pk_org: pkOrgValue
						},
						success: (res) => {
							if (res.success) {
								financeorgid = res.data;
							}
						}
					})
					return {
						isDataPowerEnable: 'Y',
						pk_org: financeorgid
					};
				};
				break;
			
			case 'ccostcenterid': //成本中心
			case 'cctcgroupid': //成本中心组
				item.isShowDisabledData=true;
				item.isHasDisabledData=true;
				isShowUnitControl(item, props, searchId);
				item.queryCondition = () => {
					let pkOrgValue = getFirstOrgValue(
						(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue
					);
					return {
						isDataPowerEnable: 'Y',
						pk_org: pkOrgValue
					};
				};
				break;
			case 'itemid.cmaterialid'://材料
			case 'itemid.cmaterialid.pk_marbasclass'://材料基本分类
			case 'itemid.cmaterialvid.materialprod.pk_marcostclass'://材料成本分类
			case 'itempks.ccustomerid'://客户
			case 'itempks.cvendorid'://供应商
			case 'itempks.cproductorid'://生产厂商
			case 'itempks.cprojectid'://项目
				isShowUnitControl(item, props, searchId);
				item.queryCondition = () => {
					let pkOrgValue = getFirstOrgValue(
						(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue
					);
					return {
						isDataPowerEnable: 'Y',
						pk_org: pkOrgValue
					};
				};
				break;

			default:
				isShowUnitControl(item, props, searchId);
				item.queryCondition = () => {
					let pkOrgValue = getFirstOrgValue(
						(props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue
					);
					return {
						isDataPowerEnable: 'Y',
						pk_org: pkOrgValue
					};
				};
		}
		return item;
	});
	return meta;
}

//获取选中的业务组织的第一个
function getFirstOrgValue(orgValues) {
	let pkOrgValue = '';
	if (orgValues != null) {
		let orgArray = orgValues.split(',');
		if (orgArray != null && orgArray.length > 0) {
			pkOrgValue = orgArray[0];
		}
	}
	return pkOrgValue;
}

//控制显示多级管控（业务单元切换）
function isShowUnitControl(item, props, searchId) {
	item.isShowUnit = true;
	item.unitCondition = () => {
		return {
			pkOrgs: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
			TreeRefActionExt: 'nccloud.web.cm.cmpub.ref.before.OrgSqlBuilder'
		};
	};
}



//BJMTlbNrEuu+EkDma0DIWcXIcY7BgwUKRpIPFzyKgtB4jnpWHWU22aTdcq+C0Xi0