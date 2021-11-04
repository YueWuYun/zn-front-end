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
		refName: 'refer-000354',/* 国际化处理： 参数代码*/
        placeholder: 'refer-000354',/* 国际化处理： 参数代码*/
		refCode: 'uapbd.refer.param.ParamGridRef',
		queryGridUrl: '/nccloud/uapbd/param/ParamGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000355', 'refer-000354','refer-000356' ],code: [ 'domainflag', 'initcode as initcodeExt', 'initname as initnameExt' ]}],/* 国际化处理： 所属模块,参数代码,参数名称*/
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65