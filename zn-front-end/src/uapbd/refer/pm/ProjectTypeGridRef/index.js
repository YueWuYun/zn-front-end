//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;
export var conf = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: 'refer_uapbd',
	},

	refType: 'grid',
	refName: 'refer-000364',/* 国际化处理： 项目类型*/
	placeholder: 'refer-000364',/* 国际化处理： 项目类型*/
	refCode: 'uapbd.pm.ProjectTypeGridRef',
	queryGridUrl: '/nccloud/uapbd/ref/ProjectTypeGridRef.do',
	columnConfig: [{ name: ['refer-000002', 'refer-000003'], code: ['type_code', 'type_name'] }],/* 国际化处理： 编码,名称*/
	isMultiSelectedEnabled: false,
	isHasDisabledData: false
};
export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65