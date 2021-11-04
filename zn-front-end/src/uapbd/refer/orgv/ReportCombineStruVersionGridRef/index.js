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
		refName: 'refer-000342',/* 国际化处理： 报表合并体系（多版本）*/
		placeholder: 'refer-000342',/* 国际化处理： 报表合并体系（多版本）*/
		refCode: 'uapbd.ref.ReportCombineStruVersionGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/ReportCombineStruVersionGridRef.do',
		columnConfig: [{
			code: ['refcode','refname','code','name',"vstartdate", "venddate"],
			name: ['refer-000305','refer-000251','refer-000097','refer-000098','refer-000306','refer-000307'],/* 国际化处理： 版本编号,版本名称,体系编码,体系名称,版本生效日期,版本失效日期*/
			checked:{vstartdate:false,venddate:false}
		}],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65