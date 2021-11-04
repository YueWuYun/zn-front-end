//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitProps }  from '../../../../uapbd/refer/org/BusinessUnitTreeRef/index';

const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000467',/* 国际化处理： 收款协议*/
        placeholder: 'refer-000467',/* 国际化处理： 收款协议*/
		refCode: 'uapbd.refer.sminfo.IncomeGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/IncomeGridRef.do',
        columnConfig: [{name: [ 'refer-000468', 'refer-000469'],code: [ 'refcode', 'refname']}],/* 国际化处理： 收款协议编码,收款协议名称*/
		isMultiSelectedEnabled: false,
        isShowUnit:false,
		unitProps: unitProps,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65