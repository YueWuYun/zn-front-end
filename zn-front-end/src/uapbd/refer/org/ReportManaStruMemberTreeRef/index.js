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
		refName: 'refer-000280',/* 国际化处理： 报表组织体系成员*/
        placeholder: 'refer-000280',/* 国际化处理： 报表组织体系成员*/
        rootNode: { refname: 'refer-000280', refpk: 'root' },/* 国际化处理： 报表组织体系成员*/
		refCode:'uapbd.refer.org.ReportManaStruMemberTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/ReportManaStruMemberTreeRef.do',
        treeConfig: {name: [ 'refer-000002', 'refer-000003'],code: [ 'refcode', 'refname']},/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65