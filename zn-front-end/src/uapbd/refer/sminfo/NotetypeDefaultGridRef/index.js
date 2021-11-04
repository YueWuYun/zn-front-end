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
		refName: 'refer-000479',/* 国际化处理： 票据类型*/
        refCode: 'uapbd.sminfo.NotetypeDefaultGridRef',
        placeholder: 'refer-000479',/* 国际化处理： 票据类型*/
		queryGridUrl: '/nccloud/uapbd/ref/NotetypeDefaultGridRef.do',
		columnConfig: [{
			name: ['refer-000480', 'refer-000481','refer-000482'],/* 国际化处理： 票据类型编码,票据类型名称,票据大类*/
			code: [ 'refcode', 'refname','noteclass_name'],
			checked:{
				noteclass_name:false
			}
		}],
		isMultiSelectedEnabled: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65