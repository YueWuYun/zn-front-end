//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;


/**
 * liupzhc 修改  为供应商档案参照和供应商基本分类参照提供过滤条件
 * @type {{refType : string, refName: string, refCode: string, rootNode: {refname: string, refpk: string}, placeholder: string, queryTreeUrl: string, treeConfig: {name: string[], code: string[]}, isMultiSelectedEnabled: boolean}}
 */
export var conf = {
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
    refName: 'refer-000193',/* 国际化处理： 业务单元（所有）*/
    refCode: 'uapbd.org.BusinessUnitAllTreeRef',
    rootNode:{refname:'refer-000193',refpk:'root'},/* 国际化处理： 业务单元（所有）*/
    placeholder:'refer-000194',/* 国际化处理： 业务单元(所有)*/
    queryTreeUrl: '/nccloud/uapbd/ref/BusinessUnitAllTreeRef.do',
    treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
    isMultiSelectedEnabled: false,
    unitProps: unitConf,
    isShowUnit:false,
    isHasDisabledData: false
};
export default function (props = {}) {

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65