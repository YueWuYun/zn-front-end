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
		refName: 'refer-000099',/* 国际化处理： 要素类型*/
		placeholder: 'refer-000099',/* 国际化处理： 要素类型*/
		refCode: 'uapbd.refer.fiacc.ElementTypeGridRef',
		queryGridUrl: '/nccloud/uapbd/fiacc/ElementTypeGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: ['refer-000100',  'refer-000101', 'refer-000102'],code: ['elesysname', 'refcode', 'refname']}],/* 国际化处理： 所属要素体系,要素类型编码,要素类型名称*/
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65