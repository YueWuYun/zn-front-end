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

		refType: 'tree',
		refName: 'refer-000115',/* 国际化处理： 报表项目*/
        placeholder: 'refer-000115',/* 国际化处理： 报表项目*/
		refCode: 'uapbd.fiacc.ReportItemTreeRef',
		rootNode: { refname: 'refer-000115', refpk: 'root' },/* 国际化处理： 报表项目*/
		treeConfig: { name: ['refer-000116', 'refer-000117'], code: ['refcode', 'refname'] },/* 国际化处理： 报表项目编码,报表项目名称*/
		queryTreeUrl: '/nccloud/uapbd/fiacc/ReportItemTreeRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65