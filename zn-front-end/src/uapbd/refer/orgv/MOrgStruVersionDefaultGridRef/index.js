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
		refName: 'refer-000336',/* 国际化处理： 维修组织体系版本*/
		placeholder: 'refer-000336',/* 国际化处理： 维修组织体系版本*/
		refCode: 'uapbd.org.MOrgStruVersionDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/MOrgStruVersionDefaultGridRef.do',
		columnConfig: [{
			code: ['refcode', 'refname', "shortname", "mnecode", "memo", "vname", "vno"],
			name: ['refer-000002', 'refer-000003', 'refer-000250', 'refer-000014', 'refer-000024', 'refer-000251', 'refer-000252'],/* 国际化处理： 编码,名称,简称,助记码,备注,版本名称,版本号*/
			search: { 'mnecode': true }
		}],
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65