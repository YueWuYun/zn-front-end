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
		refName: 'refer-000405',/* 国际化处理： 付款时点*/
		placeholder: 'refer-000405',/* 国际化处理： 付款时点*/
		refCode: 'uapbd.pub.PayPeriodDefaultGridRef',	
        queryGridUrl: '/nccloud/uapbd/ref/PayPeriodDefaultGridRef.do',
        columnConfig: [{name: [ 'refer-000047', 'refer-000002','refer-000003' ],code: [ 'oname', 'refcode','refname' ]}],/* 国际化处理： 所属组织,编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65