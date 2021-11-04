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
		refName: 'refer-003564',/* 国际化处理： 成本组件结构*/
		placeholder: 'refer-003564',/* 国际化处理： 成本组件结构*/
		refCode: 'uapbd.refer.prodcostinfo.CostCompStrucRef',
		queryGridUrl: '/nccloud/uapbd/ref/CostCompStrucRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData:false,
		columnConfig: [{
			code: ['refcode', 'refname'],
			name: ['refer-003571','refer-003572']/* 国际化处理： 编码,名称*/
		}],
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65