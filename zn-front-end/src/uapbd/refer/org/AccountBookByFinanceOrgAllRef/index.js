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
		refName: 'refer-000164',/* 国际化处理： 财务核算账簿-财务组织(所有)*/
		placeholder: 'refer-000164',/* 国际化处理： 财务核算账簿-财务组织(所有)*/
		refCode:'uapbd.ref.AccountBookByFinanceOrgTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/AccountBookByFinanceOrgTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/AccountBookByFinanceOrgGridRef.do',
		rootNode: { refname: 'refer-000165', refpk: 'root' ,isleaf: false},/* 国际化处理： 财务组织*/
		isMultiSelectedEnabled: false,
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65