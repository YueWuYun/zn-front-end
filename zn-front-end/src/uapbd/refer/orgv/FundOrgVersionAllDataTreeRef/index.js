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
		refName: 'refer-000327',/* 国际化处理： 资金组织版本(所有)树形参照*/
        placeholder: 'refer-000327',/* 国际化处理： 资金组织版本(所有)树形参照*/
		refCode: 'uapbd.refer.org.FundOrgVersionAllDataTreeRef',
        queryTreeUrl: '/nccloud/uapbd/org/FundOrgVersionAllDataTreeRef.do',
        rootNode: { refname: 'refer-000328', refpk: 'root' },/* 国际化处理： 资金组织版本（所有）*/
        treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
        isShowUnit:false,
        unitProps: unitConf,
        isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65