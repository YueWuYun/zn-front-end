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
		refName: 'refer-000386',/* 国际化处理： 使用权参照*/
		placeholder: 'refer-000386',/* 国际化处理： 使用权参照*/
		rootNode: { refname: 'refer-000015', refpk: 'root' },/* 国际化处理： 银行类别*/
		refCode: 'uapbd.pub.BankaccSubUseTreeGridRef',
		queryTreeUrl: '/nccloud/uapbd/ref/BankaccSubUseTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/BankaccSubUseGridRef.do',
		columnConfig: [
			{
				name: ['refer-000377', 'refer-000378', 'refer-000379', 'refer-000387', 'refer-000388', 'refer-000017', 'refer-000382', 'refer-000383', 'refer-000389', 'refer-000385', 'refer-000014'],/* 国际化处理： 银行账号,银行户名,账户编码,账户名称,开户银行名称,银行类别名称,子户编码,子户名称,币种名称,账户类型,助记码*/
				code: ["bd_bankaccsub.accnum", "bd_bankaccsub.accname", "bd_bankaccbas.code", 'bd_bankaccbas.name', 'bd_bankdoc.name', 'bd_banktype.name', 'bd_bankaccsub.code', 'bd_bankaccsub.name', 'bd_currtype.name'
					, 'bd_bankaccsub.acctype as acctype', 'bd_bankaccbas.mnecode'],
				checked: { 'bd_bankaccbas.mnecode': false },
				search: { 'bd_bankaccbas.mnecode': true }
			}
		],
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65