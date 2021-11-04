//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = {
        		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: '10140MMREFER',
		},

		refType: 'grid',
        refName: 'bomrefer-000001',/* 国际化处理： 物料版本*/
        placeholder:'bomrefer-000001',/* 国际化处理： 物料版本*/
        refCode: 'uapbd.refer.bom.BomVersionGridRef',
        queryGridUrl: '/nccloud/mmbd/ref/BomVersionGridRef.do',
        columnConfig: [{name: [ 'bomrefer-000002', 'bomrefer-000003' ,'bomrefer-000004','bomrefer-000005','bomrefer-000006', 'bomrefer-000007' ,'bomrefer-000008'],
        code: [ 'bd_bom.pk_org','bd_material.code', 'bd_material.name' ,'bd_material.version','bd_bom.hversion','bd_bom.hbdefault','bd_bom.fbomtype']}],
        /* 国际化处理： 所属组织,物料编码,物料名称,物料版本,规格,型号,物料简称,助记码,图号*/
        isMultiSelectedEnabled: false,
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65