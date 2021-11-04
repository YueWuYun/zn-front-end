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
		refName: 'refer-000050',/* 国际化处理： 客户联系人*/
		refCode: 'uapbd.customer.CustomerLinkManGridRef',
		placeholder: 'refer-000050',/* 国际化处理： 客户联系人*/
        queryGridUrl: '/nccloud/uapbd/ref/CustomerLinkManGridRef.do',
        columnConfig: [{
            name: [ 'refer-000003','refer-000051','refer-000052','refer-000053','email','refer-000054','refer-000055' ],/* 国际化处理： 名称,电话,手机,传真,住址,邮编*/
            code: [ 'refname', 'phone','cell','fax','email','address','postcode' ]
        }],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65