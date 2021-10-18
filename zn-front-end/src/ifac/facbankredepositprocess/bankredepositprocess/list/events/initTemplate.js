/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { createPage, ajax, base, toast, cardCache} from 'nc-lightapp-front';
import { constant, requesturl, buttonDisable }  from '../../config/config';
import buttonVisible from './buttonVisible';
let {setDefData, getDefData } = cardCache;
let searchcode = constant.searchcode;
let ltablecode = constant.ltablecode;
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

					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);

					// 给列表查询区域赋默认业务单元(在setMeta之后使用)
					setDefOrg2ListSrchArea(props, searchcode, data);
					setDefOrg2AdvanceSrchArea(props, searchcode, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(this, props, null);
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

function modifierMeta(props, meta) {

	meta[ltablecode].pagination = true;

	meta[constant.ltablecode].items = meta[constant.ltablecode].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return <span>{record.dbilldate && seperateDate(record.dbilldate.value)}</span>;
			};
		} else if (item.attrcode == 'doperatedate') {// 制单日期
			item.render = (text, record, index) => {
				return <span>{record.doperatedate && seperateDate(record.doperatedate.value)}</span>;
			};
		}
		return item;
	});
	//参展过滤
	meta[searchcode].items.map((item) => {

		item.isShowDisabledData = true;

		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		//定期利率参照过滤
		if (item.attrcode == 'pk_depostrate') {
			//item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"FRATE",
					//pk_org: (props.search.getSearchValByField(ist.searchCode, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.regularvarietyset.filter.RegularsetDepositrateFilter'
				}					   
			}
		}

		// 定期账号过滤
		if (item.attrcode == 'pk_depositacc') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					isSelect:'Y',
                    noConditionOrg:'Y',
					pk_org: (props.search.getSearchValByField(constant.searchcode, 'pk_org') || {}).value.firstvalue, 
					pk_fundorg: (props.search.getSearchValByField(constant.searchcode, 'pk_fundorg') || {}).value.firstvalue, 
					pk_currtype: (props.search.getSearchValByField(constant.searchcode, 'pk_currtype') || {}).value.firstvalue, 
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkDepositaccFilter'
				}					   
			}
		}

	});

	//设置参照可以多选和是否清楚记录
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;	//财务组织:全加载
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/