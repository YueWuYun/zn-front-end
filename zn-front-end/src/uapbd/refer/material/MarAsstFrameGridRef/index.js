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
		refName: 'refer-000136',/* 国际化处理： 辅助属性结构*/
		placeholder: 'refer-000136',/* 国际化处理： 辅助属性结构*/
		refCode: 'uapbd.material.MarAssistantGridRef',
		queryGridUrl: '/nccloud/uapbd/ref/MarAsstFrameGridRef.do',
		columnConfig: [{name: ['refer-000137', 'refer-000138'],code: [ 'refcode', 'refname']}],/* 国际化处理： 辅助属性结构编码,辅助属性结构名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65