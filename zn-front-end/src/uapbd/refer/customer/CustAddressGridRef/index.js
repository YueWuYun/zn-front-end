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
		refName: 'refer-000032',/* 国际化处理： 客户收货地址*/
		placeholder: 'refer-000032',/* 国际化处理： 客户收货地址*/
		refCode: 'uapbd.customer.CustAddressGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/CustAddressGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{
			name: ['refer-000032', 'refer-000033', 'refer-000034', 'refer-000035', 'refer-000036'],/* 国际化处理： 客户收货地址,联系人,所属地区,所属地点,是否默认*/
			code: ['refname', 'linkmanname', 'areaclname', 'addressdocname', 'isdefault']
		}],
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65