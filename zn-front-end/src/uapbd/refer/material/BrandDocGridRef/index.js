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
		refName: 'refer-000124',/* 国际化处理： 品牌档案*/
        placeholder: 'refer-000124',/* 国际化处理： 品牌档案*/
		refCode: 'uapbd.refer.material.BrandDocGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/BrandDocGridRef.do',
        columnConfig: [{name: [ 'refer-000125', 'refer-000126'],code: [ 'refcode', 'refname']}],/* 国际化处理： 品牌编码,品牌名称*/
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65