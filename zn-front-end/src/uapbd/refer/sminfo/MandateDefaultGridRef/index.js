//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitConf} from "../../org/BusinessUnitTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000473',/* 国际化处理： 托收协议*/
		placeholder: 'refer-000473',/* 国际化处理： 托收协议*/
		refCode: 'uapbd.sminfo.MandateDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/MandateDefaultGridRef.do',
		columnConfig: [
			{name: [ 'refer-000474', 'refer-000475','refer-000377','refer-000476','refer-000477' ],/* 国际化处理： 托收协议ID,客户,银行账号,银行代码,版本*/
			code: [ 'refcode', 'customername','accnum','name','version' ]}
		],
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65