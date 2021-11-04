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
		refName: 'refer-000372',/* 国际化处理： 人行联行信息*/
        refCode: 'uapbd.sminfo.AssLineNumDefaultGridRef',
        placeholder: 'refer-000372',/* 国际化处理： 人行联行信息*/
		queryGridUrl: '/nccloud/uapbd/ref/AssLineNumDefaultGridRef.do',
		columnConfig: [{
			name: ['refer-000373','refer-000374','refer-000015'],/* 国际化处理： 人行联行行号,人行联行名称,银行类别*/
			code: [ 'refcode', 'refname', 'banktypename'],
			checked:{
				banktypename:false
			}
		}],
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65