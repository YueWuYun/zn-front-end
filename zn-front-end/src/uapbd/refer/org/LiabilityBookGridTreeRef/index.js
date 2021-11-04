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
		refName: 'refer-000244',/* 国际化处理： 责任核算账簿参照*/
		placeholder: 'refer-000244',/* 国际化处理： 责任核算账簿参照*/
		rootNode: { refname: 'refer-000244', refpk: 'root' },/* 国际化处理： 责任核算账簿*/
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		refCode:'uapbd.org.LiabilityBookGridTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/LiabilityBookTreeRef.do',
		isMultiSelectedEnabled: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65