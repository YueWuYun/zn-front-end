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
		refName: 'refer-000127',/* 国际化处理： 特征码档案*/
		placeholder: 'refer-000127',/* 国际化处理： 特征码档案*/
		refCode: 'uapbd.refer.material.FFileSkuCodeGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/FFileSkuCodeGridRef.do',
		columnConfig: [{name: ['refer-000128', 'refer-000129'],code: [ 'refcode', 'refname']}],/* 国际化处理： 特征码,定制描述*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65