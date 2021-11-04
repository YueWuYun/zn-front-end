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
		refName: 'refer-000029',/* 国际化处理： 渠道类型*/
        placeholder: 'refer-000029',/* 国际化处理： 渠道类型*/
		refCode: 'uapbd.refer.customer.ChannelTypeGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/ChannelTypeGridRef.do',
        columnConfig: [{name: [ 'refer-000030', 'refer-000031'],code: [ 'refcode', 'refname']}],/* 国际化处理： 渠道类型编码,渠道类型名称*/
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65