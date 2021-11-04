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
		refName: 'refer-000505',/* 国际化处理： 内部客商*/
		refCode:'uapbd.refer.supplier.InnerCustSupplierForCustGridTreeRef',
		placeholder: 'refer-000505',/* 国际化处理： 内部客商*/
		queryTreeUrl: '/nccloud/uapbd/ref/InnerCustSupplierDefaultTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/InnerCustSupplierDefaultGridRef.do',
		rootNode: { refname: 'refer-000505', refpk: 'root' },/* 国际化处理： 内部客商*/
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		columnConfig: [{
			name: [ 'refer-000047', 'refer-000501', 'refer-000502', 'refer-000503', 'refer-000504' ],
			code: ['pk_org', 'refcode', 'refname', 'pk_financeorg', 'taxpayerid' ]}],/* 国际化处理： 所属组织,客商编码,客商名称,对应业务单元,纳税人登记号*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65