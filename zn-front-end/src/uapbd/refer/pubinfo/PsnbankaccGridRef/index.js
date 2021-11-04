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
		refName: 'refer-000452',/* 国际化处理： 个人银行账户*/
		placeholder: 'refer-000452',/* 国际化处理： 个人银行账户*/
		refCode:'uapbd.pubinfo.PsnbankaccGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/PsnbankaccGridRef.do',
		columnConfig: [{name: ['refer-000012', 'refer-000013', 'refer-000381', 'refer-000015', 'refer-000384', 'refer-000453', 'refer-000454']/* 国际化处理： 账号,户名,开户银行,银行类别,币种,工资卡,默认报销卡*/
        ,code: ['accnum', 'accname', 'bankdocname', 'banktypename', 'currtypename', 'payacc', 'isexpenseacc']}],
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65