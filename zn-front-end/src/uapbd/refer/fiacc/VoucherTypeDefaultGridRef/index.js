//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitConf} from "../../org/AccountBookByFinanceOrgRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000121',/* 国际化处理： 凭证类别*/
        refCode: 'uapbd.fiacc.VoucherTypeDefaultGridRef',
        placeholder: 'refer-000121',/* 国际化处理： 凭证类别*/
		queryGridUrl: '/nccloud/uapbd/ref/VoucherTypeDefaultGridRef.do',
		columnConfig: [{name: ['refer-000122', 'refer-000123'],code: [ 'refcode', 'refname']}],/* 国际化处理： 凭证类别编码,凭证类别名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65