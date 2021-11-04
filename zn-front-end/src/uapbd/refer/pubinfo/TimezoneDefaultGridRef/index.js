//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000442',/* 国际化处理： 时区*/
		placeholder: 'refer-000442',/* 国际化处理： 时区*/
		refCode: 'uapbd.refer.pubinfo.TimezoneDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/TimezoneDefaultGridRef.do',
		columnConfig: [
			{
				name: [ 'refer-000002','refer-000003','refer-000459'],/* 国际化处理： 编码,名称,偏移量*/
				code: [ "code","name","offsetvar"]
			}
		],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65