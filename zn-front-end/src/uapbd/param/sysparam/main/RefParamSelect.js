//W4KlKJMq1mcrsa/m9AzTk4NR2t+oDCwiOywgwglFdkWBGT2jRa9QvqOEMctUkCjK
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
		refCode: 'uapbd.refer.sysparam.ParamGridRef',
		queryGridUrl: '/nccloud/uapbd/sysparam/ParamGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000354','refer-000356' ],code: [ 'initcode as initcodeExt', 'initname as initnameExt','refpath','name' ]}]
	};

	return <Refer {...Object.assign(conf, props)} />
}

//W4KlKJMq1mcrsa/m9AzTk4NR2t+oDCwiOywgwglFdkWBGT2jRa9QvqOEMctUkCjK