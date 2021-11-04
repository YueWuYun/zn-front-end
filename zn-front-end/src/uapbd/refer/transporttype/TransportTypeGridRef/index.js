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
		refName: 'refer-000525',/* 国际化处理： 运输方式*/
		placeholder: 'refer-000525',/* 国际化处理： 运输方式*/
		//treeConfig:{name:['编码', '名称'],code: ['refcode', 'refname']},
		columnConfig: [{name: [ 'refer-000526', 'refer-000527'  ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 运输方式编码,运输方式名称*/
		refCode:'uapbd.ref.TransportTypeGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/TransportTypeGridRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65