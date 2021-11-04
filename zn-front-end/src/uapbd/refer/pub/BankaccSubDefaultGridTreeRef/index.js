//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
		refName: 'refer-000376',/* 国际化处理： 核算归属权*/
		placeholder: 'refer-000376',/* 国际化处理： 核算归属权*/
		refCode: 'uapbd.ref.pub.BankaccSubDefaultGridTreeRef',
		queryTreeUrl: '/nccloud/uapbd/ref/BankaccSubDefaultTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/BankaccSubDefaultGridRef.do',
		columnConfig: [{
			name: ['refer-000377', 'refer-000378', 'refer-000379', 'refer-000380', 'refer-000381', 'refer-000015', 'refer-000382', 'refer-000383', 'refer-000384', 'refer-000385', 'refer-000014'],/* 国际化处理： 银行账号,银行户名,账户编码,账号名称,开户银行,银行类别,子户编码,子户名称,币种,账户类型,助记码*/
			code: ['accnum', 'accname', 'refcode', 'refname', 'pk_bankdoc', 'pk_banktype', 'scode', 'sname', 'pk_currtype', 'acctype', 'mnecode'],
			checked: { mnecode: false },
			search: { 'mnecode': true }
		}],
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		rootNode: { refname: 'refer-000015', refpk: 'root' },/* 国际化处理： 银行类别*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65