//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000264',/* 国际化处理： 组织（包含全局）*/
        placeholder: 'refer-000264',/* 国际化处理： 组织（包含全局）*/
		refCode: 'uapbd.refer.org.OrgWithGlobalTreeRef',
        queryTreeUrl: '/nccloud/uapbd/org/OrgWithGlobalTreeRef.do',
        rootNode: { refname: 'refer-000264', refpk: 'root' },/* 国际化处理： 组织（包含全局）*/
        treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
        isShowUnit:false,
        unitProps: unitConf,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65