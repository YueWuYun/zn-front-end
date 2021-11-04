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
        refName: 'refer-000045',/* 国际化处理： 物料版本*/
        placeholder: 'refer-000045',/* 国际化处理： 物料版本*/
        refCode: 'uapbd.refer.material.MaterialVersionGridRef',
        queryGridUrl: '/nccloud/uapbd/ref/MaterialVersionGridRef.do',
        columnConfig: [{
            name: ['refer-000047', 'refer-000043', 'refer-000044', 'refer-000045', 'refer-000146', 'refer-000147', 'refer-000148', 'refer-000014', 'refer-000149'],
            code: ['pk_org_name', 'refcode', 'refname', 'version', 'materialspec', 'materialtype', 'materialshortname', 'materialmnecode', 'graphid'],
            fullTxtCode: { 'refcode': true, 'refname': true, 'materialspec': false, 'materialtype': false, 'materialshortname': false, 'materialmnecode': false, 'graphid': false },
            search: { 'materialmnecode': true }
        }],/* 国际化处理： 所属组织,物料编码,物料名称,物料版本,规格,型号,物料简称,助记码,图号*/

        isMultiSelectedEnabled: false,
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65