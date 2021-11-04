//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitConf} from "../../org/BusinessUnitTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
		refName: 'refer-000465',/* 国际化处理： 银行账户子户*/
		placeholder: 'refer-000465',/* 国际化处理： 银行账户子户*/
		rootNode: { refname: 'refer-000015', refpk: 'root' },/* 国际化处理： 银行类别*/
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		refCode: 'uapbd.refer.sminfo.BankaccSubGridTreeRef',
        queryTreeUrl: '/nccloud/uapbd/sminfo/BankTypeTreeRef.do',
        queryGridUrl: '/nccloud/uapbd/sminfo/BankaccSubGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ 'refer-000002', 'refer-000003' ],code: [ 'refcode', 'refname' ]}],/* 国际化处理： 编码,名称*/
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65