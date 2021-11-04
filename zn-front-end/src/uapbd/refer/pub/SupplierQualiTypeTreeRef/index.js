//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import {conf as unitProps} from '../../org/StockOrgGridRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000418',/* 国际化处理： 供应商资质分类*/
		placeholder: 'refer-000418',/* 国际化处理： 供应商资质分类*/
		refCode: 'uapbd.ref.SupplierQualiTypeTreeRef',
		rootNode: { refname: 'refer-000418', refpk: 'root' },/* 国际化处理： 供应商资质分类*/
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},	/* 国际化处理： 编码,名称*/
        queryTreeUrl: '/nccloud/uapbd/ref/SupplierQualiTypeTreeRef.do',
        columnConfig: [{name: [ 'refer-000002','refer-000003' ],code: [ 'refcode', 'refname']}],/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
        isShowUnit:false,
		unitProps: unitProps, 
		isHasDisabledData: false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65