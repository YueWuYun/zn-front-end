//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitProps } from '../../org/StockOrgGridRef/index';
unitProps["fieldid"] = "busiUnit"

const { Refer } = high;


export var conf = {
    multiLang: {
        domainName: 'uapbd',
        currentLocale: 'zh-CN',
        moduleId: 'refer_uapbd',
    },

    refType: 'grid',
    refName: 'refer-000496',/* 国际化处理： 仓库*/
    placeholder: 'refer-000496',/* 国际化处理： 仓库*/
    refCode: 'uapbd.stordoc.StorDocDefaulteGridRef',
    queryGridUrl: '/nccloud/uapbd/ref/StorDocDefaulteGridRef.do',
    isMultiSelectedEnabled: false,
    columnConfig: [
        {
            name: ['refer-000497', 'refer-000498', 'refer-000499'],/* 国际化处理： 仓库编码,仓库名称,仓库地址*/
            code: ['refcode', 'refname', 'storaddr'],
            checked: {
                storaddr: false,

            }
        }
    ],
    isShowDisabledData: false,
    isShowUnit: false,
    unitProps: unitProps,
};
export default function (props = {}) {
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65