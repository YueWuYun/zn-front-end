//FCDPvguvKELon8NwUn9n+c1KzDBuDcIr8oRn1QIieACmDBQkSRJy6UDDrXjnWeWm
import { cardCache, getBusinessInfo, ajax } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
let businessInfo = getBusinessInfo();
const sourceKey = 'default';
const paramKey = 'paramMap';
//打开应用时固定加载上下文变量字段名
export const loginContextKeys = {
	mdid: 'mdid', // 元数据实体id
	org_Name: 'org_Name', // 默认业务单元名称
	org_v_Name: 'org_v_Name', // 默认业务单元版本名称
	pk_org: 'pk_org', // 默认业务单元主键：取值算法：先从个性化中心取（会按照是否有权限筛选过滤一遍）。如果取不到，查询当前登录用户的所属组织
	pk_org_v: 'pk_org_v', // 默认业务单元版本主键
	transtype: 'transtype', //交易类型编码
	pk_transtype: 'pk_transtype', //交易类型
	groupId: 'groupId', //业务集团信息
	groupName: 'groupName', //集团名称
	userId: 'userId', //用户id
	userName: 'userName', //用户名称
	userCode: 'userCode', //用户编码
	businessDate: 'businessDate', //业务日期
	dataSourceCode: 'dataSource', // 数据源编码
	languageIndex: 'currentLangSeq', //多语对应字段的index,
	scaleClazz:"scaleClazz",
	pk_project :'pk_project',
	project_name : 'project_name',
	project_code : 'project_code'
};
//初始化上下文变量，针对单页应用提供的单页应用内缓存
export function loginContext(context, dataSource = sourceKey) {
	if (!context) {
		return;
	}
	let loginContext = {};
	let paramMap = context[paramKey];
	for (let key in loginContextKeys) {
		loginContext[loginContextKeys[key]] = context[loginContextKeys[key]];
		if (businessInfo && businessInfo[loginContextKeys[key]]) {
			loginContext[loginContextKeys[key]] = businessInfo[loginContextKeys[key]];
		}
	}
	if (paramMap) {
		for (let param in paramMap) {
			loginContext[param] = paramMap[param];
		}
	}
	setDefData(dataSource, dataSource, loginContext);
}

//获取上下文变量的值
export function getContext(key, dataSource = sourceKey) {
	businessInfo = getBusinessInfo();
	if (key == loginContextKeys.businessDate && businessInfo) {
		return businessInfo[loginContextKeys.businessDate];
	}
	let loginContext = getDefData(dataSource, dataSource);
	if (loginContext) {
		if (key == loginContextKeys.languageIndex && loginContext[key] == '1') {
			return '';
		}
		return loginContext[key];
	} else {
		return null;
	}
}

//自定义设置上下文变量的值
export function setContext(key, value, dataSource = sourceKey) {
	let context = getDefData(dataSource, dataSource);
	if (context) {
		context[key] = value;
	} else {
		context = { [key]: value };
	}
	setDefData(dataSource, dataSource, context);
}

//FCDPvguvKELon8NwUn9n+c1KzDBuDcIr8oRn1QIieACmDBQkSRJy6UDDrXjnWeWm