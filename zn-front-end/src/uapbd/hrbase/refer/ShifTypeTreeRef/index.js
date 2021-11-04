//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * Created by liuchaol on 2019/08/06.
 */
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: {  domainName: 'uapbd/hrbase', currentLocale: 'zh-CN',  moduleId: 'hr-refer'},
        refType: 'tree',
        refName: 'refer-000002',/* 国际化处理：班次类别*/
        placeholder: 'refer-000002',/* 国际化处理：班次类别*/
        refCode: 'uapbd.refer.ShiftTypeRefModelTree',
        queryTreeUrl: '/nccloud/uapbd/refer/ShiftTypeRefModelTree.do',
        rootNode: { refname: 'refer-000002', refpk: 'root' ,isleaf: false},/* 国际化处理： 班次类别*/
        columnConfig: [{
            name: [ 'refer-000007', 'refer-000008' ],/* 国际化处理：班次类别编码,班次类别名称*/
            code: [ 'refcode', 'refname' ]
        }],
        isMultiSelectedEnabled: false,
    };

    return <Refer {...Object.assign(conf, props)} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65