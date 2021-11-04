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
		refName: 'refer-000011',/* 国际化处理： 银行账户*/
		refCode: 'uapbd.bankacc.BankaccDefaultTreeRef',
		placeholder: 'refer-000011',/* 国际化处理： 银行账户*/
		rootNode: { refname: 'refer-000011', refpk: 'root' },/* 国际化处理： 银行账户*/
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		queryGridUrl: "/nccloud/uapbd/ref/BankaccDefaultGridRef.do",
		queryTreeUrl: '/nccloud/uapbd/ref/BankaccDefaultTreeRef.do',
		columnConfig: [{
			name: ['refer-000012', 'refer-000013', 'refer-000002', 'refer-000003', 'refer-000014', 'refer-000015'],
			code: ['accnum', 'accname', 'refcode', 'refname', 'mnecode', 'tname'],
			search: { 'mnecode': true }
		}],/* 国际化处理： 账号,户名,编码,名称,助记码,银行类别*/

		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: true,
		isHasDisabledData: false,
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65