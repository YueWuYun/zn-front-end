//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitProps } from '../BusinessUnitTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
    var conf = {
        multiLang: {
            domainName: 'uapbd',
            currentLocale: 'zh-CN',
            moduleId: 'refer_uapbd',
        },

        refType: 'tree',
        refName: 'refer-000215',/* 国际化处理： 部门(所有)*/
        refCode: 'uapbd.org.DeptAllDataTreeRef',
        rootNode: { refname: 'refer-000215', refpk: 'root' },/* 国际化处理： 部门(所有)*/
        placeholder: 'refer-000215',/* 国际化处理： 部门(所有)*/
        queryTreeUrl: '/nccloud/uapbd/org/DeptAllDataTreeRef.do',
        treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
        isMultiSelectedEnabled: false,
        unitProps: unitProps,
        isShowUnit: false,
        isHasDisabledData: false,
        unitValueIsNeeded: true
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65