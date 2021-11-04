//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * Created by liuchaol on 2018/5/21.
 */
import {high} from 'nc-lightapp-front';

const {Refer} = high;

export default function (props = {}) {
    var conf = {
        rootNode:{refname: 'refer-000009',refpk:'root'},
        multiLang: {domainName: 'uapbd/hrbase', currentLocale: 'zh-CN', moduleId: 'hr-refer'},
        refType: 'gridTree',
        refName: 'refer-000004',/* 国际化处理：班次(业务单元)*/
        placeholder: 'refer-000004',/* 国际化处理：班次(业务单元)*/
        refCode: 'uapbd.refer.ShiftRefModelGrid',
        queryTreeUrl:'/nccloud/uapbd/refer/ShiftTypeRefModelTree.do',
        queryGridUrl: '/nccloud/uapbd/refer/ShiftRefModelGrid.do',
        columnConfig: [{
            name: ['refer-000000', 'refer-000001'],
            code: ['refcode', 'refname']
        }],/* 国际化处理： 班次编码,班次名称*/
        isMultiSelectedEnabled: false
    };

    return <Refer {...Object.assign(conf, props)} />
}


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65