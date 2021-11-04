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
		refName: 'refer-000483',/* 国际化处理： 付款业务类型*/
        placeholder: 'refer-000483',/* 国际化处理： 付款业务类型*/
		refCode: 'uapbd.refer.sminfo.PaytypeGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/PaytypeGridRef.do',
        columnConfig: [{name: [ 'refer-000484', 'refer-000485'],code: [ 'refcode', 'refname']}],/* 国际化处理： 付款业务类型编码,付款业务类型名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65