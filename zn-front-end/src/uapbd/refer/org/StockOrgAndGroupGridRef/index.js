//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

/**
 * liupzhc  修改 为仓库参照提供库存组织过滤条件
 */
export var conf = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: 'refer_uapbd',
	},

	refType: 'grid',
	refName: 'refer-000288',/* 国际化处理： 库存组织*/
	placeholder: 'refer-000288',/* 国际化处理： 库存组织*/
	refCode: 'uapbd.refer.org.StockOrgAndGroupGridRef',
	queryGridUrl: '/nccloud/uapbd/org/StockOrgAndGroupGridRef.do',
	isMultiSelectedEnabled: false,
	columnConfig: [{ name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] }],/* 国际化处理： 编码,名称*/
	unitProps: unitConf,
	isShowUnit: false
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65