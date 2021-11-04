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
		refName: 'refer-000242',/* 国际化处理： 责任核算账簿(所有)*/
		rootNode: { refname: 'refer-000242', refpk: 'root' },/* 国际化处理： 责任核算账簿(所有)*/
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		refCode:'uapbd.refer.org.LiabilityBookAllGridTreeRef',
		placeholder: 'refer-000242',/* 国际化处理： 责任核算账簿(所有)*/
		queryTreeUrl: '/nccloud/uapbd/ref/LiabilityBookAllTreeRef.do',
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65