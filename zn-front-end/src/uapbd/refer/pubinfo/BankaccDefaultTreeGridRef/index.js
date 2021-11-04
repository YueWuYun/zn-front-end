//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from "../../org/FinanceOrgTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
		refName: 'refer-000439',/* 国际化处理： 开户组织账户参照*/
		placeholder: 'refer-000439',/* 国际化处理： 开户组织账户参照*/
		rootNode: { refname: 'refer-000439', refpk: 'root' },/* 国际化处理： 开户组织账户参照*/
		refCode: 'uapbd.pubinfo.BankaccDefaultTreeGridRef',
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		columnConfig: [{
			name: ['refer-000012', 'refer-000013', 'refer-000379', 'refer-000387', 'refer-000014', 'refer-000015'],/* 国际化处理： 账号,户名,账户编码,账户名称,助记码,银行类别*/
			code: ['accnum', 'accname', 'refcode', 'refname', 'mnecode', 'banktypename'],
			search: { 'mnecode': true }
		}],
		queryTreeUrl: '/nccloud/uapbd/ref/BankDocDefaultTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/BankaccGridRef.do',
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65