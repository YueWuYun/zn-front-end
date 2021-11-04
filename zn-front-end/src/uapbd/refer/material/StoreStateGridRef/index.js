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
		refName: 'refer-000158',/* 国际化处理： 库存状态*/
		placeholder: 'refer-000158',/* 国际化处理： 库存状态*/
		refCode: 'uapbd.refer.material.StoreStateGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/StoreStateGridRef.do',
		columnConfig: [{name: ['refer-000159', 'refer-000160'],code: [ 'refcode', 'refname']}],/* 国际化处理： 库存状态编码,库存状态名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65