//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitProps } from '../../org/BusinessUnitTreeRef/index';
const { Refer } = high;

export var conf = {
    		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
    refName: 'refer-000145',/* 国际化处理： 物料销售分类*/
    placeholder: 'refer-000145',/* 国际化处理： 物料销售分类*/
    refCode: 'uapbd.refer.material.MaterialSaleClassTreeRef',
    queryTreeUrl: '/nccloud/uapbd/ref/MaterialSaleClassTreeRef.do',
    treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
    rootNode: { refname: 'refer-000145', refpk: 'root' },/* 国际化处理： 物料销售分类*/
    isMultiSelectedEnabled: false,
    isShowUnit:false,
    unitProps: unitProps,
};

export default function (props = {}) {
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65