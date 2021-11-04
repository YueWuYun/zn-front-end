//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitProps } from '../../org/BusinessUnitTreeRef/index';
unitProps["fieldid"] = "busiUnit"

const { Refer } = high;

export var conf = {
    multiLang: {
        domainName: 'uapbd',
        currentLocale: 'zh-CN',
        moduleId: 'refer_uapbd',
    },

    refType: 'tree',
    refName: 'refer-000216',/* 国际化处理： 部门*/
    placeholder: 'refer-000216',/* 国际化处理： 部门*/
    refCode: 'uapbd.refer.org.DeptTreeRef',
    queryTreeUrl: '/nccloud/uapbd/ref/DeptTreeRef.do',
    treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
    rootNode: { refname: 'refer-000216', refpk: 'root' },/* 国际化处理： 部门*/
    isMultiSelectedEnabled: false,
    isShowUnit: false,
    unitProps: unitProps,
    unitValueIsNeeded: true
};

export default function (props = {}) {
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65