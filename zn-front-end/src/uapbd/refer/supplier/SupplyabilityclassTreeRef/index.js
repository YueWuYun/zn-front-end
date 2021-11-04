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

		refType: 'tree',
		refName: 'refer-000517',/* 国际化处理： 供应商供货能力分类*/
		placeholder: 'refer-000517',/* 国际化处理： 供应商供货能力分类*/
		rootNode: { refname: 'refer-000517', refpk: 'root' },/* 国际化处理： 供应商供货能力分类*/
		refCode: 'uapbd.supplier.SupplyabilityclassTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/SupplyabilityclassTreeRef.do',
        treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false
	};

	return <Refer {...conf} {...props} />
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65