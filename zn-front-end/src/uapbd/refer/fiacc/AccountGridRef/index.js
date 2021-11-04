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
		refName: 'refer-000066',/* 国际化处理： 会计科目*/
		placeholder: 'refer-000070',/* 国际化处理： 插入中间级-会计科目*/
		refCode: 'uapbd.refer.fiacc.AccountGridRef',
		queryGridUrl: '/nccloud/uapbd/fiacc/AccountGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{ name: ['refer-000067', 'refer-000068'], code: ['refcode', 'refname'] }],/* 国际化处理： 科目编码,科目名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65