//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export var conf = {
    multiLang: {
        domainName: 'uapbd',
        currentLocale: 'zh-CN',
        moduleId: 'refer_uapbd',
    },

    refType: 'grid',
    refName: 'refer-003568', /* 国际化处理：费用类型 */
    placeholder: 'refer-003568', /* 国际化处理：费用类型 */
    refCode: 'uapbd.fiacc.CostTypeGridRef',
    queryGridUrl: '/nccloud/uapbd/fiacc/CostTypeGridRef.do',
    columnConfig: [{ name: ['refer-003569', 'refer-003570'], code: ['code', 'name'] }], /* 国际化处理：编码、名称 */
    isMultiSelectedEnabled: false,
    isHasDisabledData: false
};

/**
 * 费用类型-参照
 * @date 2020-03-10
 * @param {*} props 
 */
export default function (props = {}) {
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65