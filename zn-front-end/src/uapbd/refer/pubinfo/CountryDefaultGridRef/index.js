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
	refName: 'refer-000440',/* 国际化处理： 国家地区*/
	placeholder: 'refer-000440',/* 国际化处理： 国家地区*/
	refCode: 'uapbd.refer.pubinfo.CountryDefaultGridRef',
	queryGridUrl: '/nccloud/uapbd/pub/CountryDefaultGridRef.do',
	isMultiSelectedEnabled: false,
	columnConfig: [{
		name: ['refer-000002', 'refer-000441', 'refer-000003', 'refer-000422', 'refer-000442', 'refer-000443'],/* 国际化处理： 编码,三位代码,名称,描述,时区,格式*/
		code: ['refcode', 'codeth', 'refname', 'description', 'timezonename', 'formatname'],
		checked: {
			description: false,
			timezonename: false,
			formatname: false
		}
	}],
	isHasDisabledData: false
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65