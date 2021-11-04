//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';


const { Refer } = high;

import SupplierGradeRefer from './SupplierGradeRefer';

/**
 * liupzhc
 * @type {{refType : string, refName: string, placeholder: string, refCode: string, rootNode: {refname: string, refpk: string}, queryTreeUrl: string, queryGridUrl: string, treeConfig: {name: string[], code: string[]}, columnConfig: *[], isMultiSelectedEnabled: boolean}}
 */

export var conf = {
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
    refName: 'refer-000509',/* 国际化处理： 等级*/
    placeholder: 'refer-000510',/* 国际化处理： 供应商等级*/
    refCode: 'uapbd.supplier.SupplierGradeTreeGridRef',
    rootNode: { refname: 'refer-000508', refpk: 'root' },/* 国际化处理： 等级体系*/
    queryTreeUrl: '/nccloud/uapbd/ref/SupplierGradeTreeRef.do',
    queryGridUrl:'/nccloud/uapbd/ref/SupplierGradeGridRef.do',
    treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
    columnConfig: [{name: ['refer-000036', 'refer-000509', 'refer-000511', 'refer-000512']/* 国际化处理： 是否默认,等级,状态,说明*/
        ,code: ['isdefault', 'suppliergrade', 'supstatus', 'gradeexp']
    }],
    isMultiSelectedEnabled: true,
};
export default function (props = {}) {
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65