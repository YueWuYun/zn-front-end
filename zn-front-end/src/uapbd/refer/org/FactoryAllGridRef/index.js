//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;
export var conf = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: 'refer_uapbd',
	},

	refType: 'grid',
	refName: 'refer-003555',/* 国际化处理： 工厂(所有)*/
	placeholder: 'refer-003555',/* 国际化处理： 工厂(所有)*/
	refCode: 'uapbd.refer.org.FactoryAllGridRef',
	queryGridUrl: '/nccloud/uapbd/org/FactoryAllGridRef.do',
	isMultiSelectedEnabled: false,
	columnConfig: [{ name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] }],/* 国际化处理： 编码,名称*/
	unitProps: unitConf,
	isShowUnit: false
};
export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65