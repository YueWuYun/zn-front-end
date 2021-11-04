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

		refType: 'gridTree',
		refName: 'refer-000417',/* 国际化处理： 供应商资质*/
		rootNode: { refname: 'refer-000417', refpk: 'root' },/* 国际化处理： 供应商资质*/
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		refCode:'uapbd.refer.pub.SupplierQualiDocTreeGridRef',
		placeholder: 'refer-000417',/* 国际化处理： 供应商资质*/
		queryTreeUrl: '/nccloud/uapbd/ref/SupplierQualiDocTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/SupplierQualiDocGridRef.do',
		columnConfig: [{name: [ 'refer-000002', 'refer-000003'  ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: true,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65