//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
        var conf = {
                multiLang: {
                        domainName: 'uapbd',
                        currentLocale: 'zh-CN',
                        moduleId: 'refer_uapbd',
                },

                refType: 'grid',
                refName: 'refer-000062',/* 国际化处理： 科目控制规则*/
                placeholder: 'refer-000062',/* 国际化处理： 科目控制规则*/
                refCode: 'uapbd.refer.fiacc.AccCtrlRuleGridRef',
                queryGridUrl: '/nccloud/uapbd/fiacc/AccCtrlRuleGridRef.do',
                columnConfig: [{
                        name: ['refer-000063', 'refer-000064', 'refer-000065']/* 国际化处理： 控制规则编码,控制规则名称,所属科目表*/
                        , code: ['refcode', 'refname', 'chartname'],
                        checked: {
                                chartname: false
                        }
                }],
                isMultiSelectedEnabled: false,
                isHasDisabledData: false
        };

        return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65