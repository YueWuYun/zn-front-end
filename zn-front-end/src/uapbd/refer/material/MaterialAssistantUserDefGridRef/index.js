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
		refName: 'refer-000139',/* 国际化处理： 物料辅助属性*/
		placeholder: 'refer-000139',/* 国际化处理： 物料辅助属性*/
		refCode: 'uapbd.refer.material.MaterialAssistantUserDefGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/MaterialAssistantUserDefGridRef.do',
		columnConfig: [{name: ['refer-000134', 'refer-000135'],code: [ 'refcode', 'refname']}],/* 国际化处理： 辅助属性编码,辅助属性名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65