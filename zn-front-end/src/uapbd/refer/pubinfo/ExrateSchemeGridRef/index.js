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
		refName: 'refer-000450',/* 国际化处理： 外币汇率方案*/
        refCode: 'uapbd.pubinfo.ExrateSchemeGridRef',
        placeholder: 'refer-000450',/* 国际化处理： 外币汇率方案*/
		queryGridUrl: '/nccloud/uapbd/ref/ExrateSchemeGridRef.do',
		columnConfig: [{
            name: [ 'refer-000002','refer-000003' ],/* 国际化处理： 编码,名称*/
            code: [ 'refcode','refname' ]
        }],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65