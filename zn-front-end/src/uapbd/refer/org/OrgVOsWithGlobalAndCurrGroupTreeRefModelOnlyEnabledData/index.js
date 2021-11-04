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
		refName: 'refer-000262',/* 国际化处理： 全局+当前集团+当前集团下的所有组织*/
		rootNode: { refname: 'refer-000262', refpk: 'root' },/* 国际化处理： 全局+当前集团+当前集团下的所有组织*/
        refCode: 'uapbd.org.OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData',
        placeholder: 'refer-000262',/* 国际化处理： 全局+当前集团+当前集团下的所有组织*/
		queryTreeUrl: '/nccloud/uapbd/ref/OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData.do',
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit:false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65