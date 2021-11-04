import { cardCache, getBusinessInfo } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;
let businessInfo = getBusinessInfo();
const sourceKey = 'default';
const paramKey = 'paramMap';
/**
 * hanzhhm
 * 打开应用时固定加载上下文变量字段名
 */
export const loginContextKeys = {
	defaultAccbookName: 'defaultAccbookName',// 默认财务核算账簿名称
	defaultAccbookPk: 'defaultAccbookPk',// 默认财务核算账簿主键（会按照是否有权限筛选过滤一遍）
	mdid: 'mdid',// 元数据实体id
	org_Name: 'org_Name',// 默认业务单元名称
	org_v_Name: 'org_v_Name', // 默认业务单元版本名称
	pk_org: 'pk_org',// 默认业务单元主键：取值算法：先从个性化中心取（会按照是否有权限筛选过滤一遍）。如果取不到，查询当前登录用户的所属组织
	pk_org_v: 'pk_org_v',// 默认业务单元版本主键
	transtype: 'transtype',//交易类型编码
	pk_transtype: 'pk_transtype',//交易类型
	groupId: 'groupId', //业务集团信息
	groupName: 'groupName', //集团名称
	userId: 'userId', //用户id
	userName: 'userName', //用户名称
	userCode: 'userCode', //用户编码
	businessDate: 'businessDate'//业务日期
};
//初始化上下文变量，针对单页应用提供的单页应用内缓存
export function loginContext(context, dataSource = sourceKey) {
	let loginContext = {};
	let paramMap = context[paramKey];
	for (let key in loginContextKeys) {
		loginContext[loginContextKeys[key]] = context[loginContextKeys[key]];
		if(businessInfo){
			if (businessInfo[loginContextKeys[key]]) {
				loginContext[loginContextKeys[key]] = businessInfo[loginContextKeys[key]];
			}
		}
		
	}
	for (let param in paramMap) {
		loginContext[param] = paramMap[param];
	}
	setDefData(dataSource, dataSource, loginContext);
}

//获取上下文变量的值
export function getContext(key, dataSource = sourceKey) {
	businessInfo = getBusinessInfo();
	if(key == loginContextKeys.businessDate && businessInfo){
        return businessInfo[loginContextKeys.businessDate];
    }
	let loginContext = getDefData(dataSource, dataSource);
	if (loginContext) {
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
