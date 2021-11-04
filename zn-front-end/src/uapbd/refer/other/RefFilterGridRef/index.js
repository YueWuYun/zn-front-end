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
		refName: 'refer-000351',/* 国际化处理： 条件过滤器*/
		placeholder: 'refer-000351',/* 国际化处理： 条件过滤器*/
		refCode: 'uapbd.other.RefFilterGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/RefFilterGridRef.do',
		columnConfig: [{
			code: ['refcode','FILTERCLASS','REMARK','MODULEID'],
			name: ['refer-000002','refer-000352','refer-000024','refer-000353'],/* 国际化处理： 编码,过滤器类,备注,模块名*/
			checked: {
				MODULEID: false
			}
		}],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65