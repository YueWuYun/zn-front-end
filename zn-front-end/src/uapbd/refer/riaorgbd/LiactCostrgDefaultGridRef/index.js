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
		refName: 'refer-000460',/* 国际化处理： 利润中心成本域*/
		placeholder: 'refer-000460',/* 国际化处理： 利润中心成本域*/
		refCode: 'uapbd.refer.riaorgbd.LiactCostrgDefaultGridRef',
		queryGridUrl: '/nccloud/uapbd/riaorgbd/LiactCostrgDefaultGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000461', 'refer-000462' ],code: [ 'refcode', 'refname' ]}]/* 国际化处理： 利润中心成本域编码,利润中心成本域名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65