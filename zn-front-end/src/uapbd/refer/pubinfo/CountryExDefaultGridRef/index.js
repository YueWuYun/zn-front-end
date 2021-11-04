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
		refName: 'refer-000444',/* 国际化处理： 国家地区*/
		placeholder: 'refer-000444',/* 国际化处理： 国家地区*/
		refCode: 'uapbd.refer.pubinfo.CountryExDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/pub/CountryExDefaultGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{
			name: ['refer-000002', 'refer-000441', 'refer-000003', 'refer-000422', 'refer-000442', 'refer-000443', 'refer-000445'],/* 国际化处理： 编码,三位代码,名称,描述,时区,格式,欧盟国家*/
			code: ['refcode', 'codeth', 'refname', 'description', 'timezonename', 'formatname', 'iseucountry'],
			checked: {
				description: false,
				timezonename: false,
				formatname: false,
				iseucountry: false,
			}
		}]
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65