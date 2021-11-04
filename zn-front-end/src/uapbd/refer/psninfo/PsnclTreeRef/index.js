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
		refName: 'refer-000368',/* 国际化处理： 人员类别*/
		placeholder: 'refer-000368',/* 国际化处理： 人员类别*/
		rootNode: { refname: 'refer-000368', refpk: 'root' },/* 国际化处理： 人员类别*/
		refCode: 'uapbd.psninfo.PsnclTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/PsnclTreeRef.do',
		isMultiSelectedEnabled: false,
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']}/* 国际化处理： 编码,名称*/
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65