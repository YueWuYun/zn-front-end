//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;
import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';
export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'grid',
		refName: 'refer-000470',/* 国际化处理： 收款时点*/
		placeholder: 'refer-000470',/* 国际化处理： 收款时点*/
		refCode: 'uapbd.sminfo.IncomePeriodGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/IncomePeriodGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{ name: ['refer-000047', 'refer-000471', 'refer-000472'], code: ['orgname','pcode','refname'] }],/* 国际化处理： 所属组织,收款时点编码,收款时点名称*/
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65