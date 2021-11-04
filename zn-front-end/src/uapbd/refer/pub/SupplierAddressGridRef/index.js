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
		refName: 'refer-000415',/* 国际化处理： 供应商发货地址*/
		placeholder: 'refer-000415',/* 国际化处理： 供应商发货地址*/
		refCode: 'uapbd.pub.SupplierAddressGridRef',
		queryGridUrl: '/nccloud/uapbd/pub/SupplierAddressGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{ name: ['refer-000416', 'refer-000033', 'refer-000034', 'refer-000035', 'refer-000036'], code: ['refcode', 'linkman_name', 'areacl_name', 'addressdoc_name', 'isdefault'] }],/* 国际化处理： 发货地址,联系人,所属地区,所属地点,是否默认*/
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65