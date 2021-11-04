//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
// import {conf as unitProps} from '../../org/StockOrgGridRef/index';
const { Refer } = high;

export default function (props = {}) {
    var conf = {
        multiLang: {
            domainName: 'uapbd',
            currentLocale: 'zh-CN',
            moduleId: 'refer_uapbd',
        },

        refType: 'grid',
        refName: 'refer-000008',/* 国际化处理： 资产状态*/
        placeholder: 'refer-000008',/* 国际化处理： 资产状态*/
        refCode: 'uapbd.refer.am.EquipStatusGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/EquipStatusGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [
            {
                name: ['refer-000009', 'refer-000010'],/* 国际化处理： 状态编码,状态名称*/
                code: ["refcode", "refname"]
            }],

        // NCCLOUD-107046
        // isShowUnit:false,
        // unitProps: unitProps, 
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65