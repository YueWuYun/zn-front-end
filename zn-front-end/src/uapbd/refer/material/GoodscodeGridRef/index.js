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
		refName: 'refer-000130',/* 国际化处理： 海关商品编码*/
        placeholder: 'refer-000130',/* 国际化处理： 海关商品编码*/
		refCode: 'uapbd.ref.material.GoodscodeGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/GoodscodeGridRef.do',
        columnConfig: [{name: [ 'refer-000131', 'refer-000132' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 商品编码,商品名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65