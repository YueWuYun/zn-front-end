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
        refName: 'rtrefer-000001',/* 国际化处理： 物料版本*/
        placeholder:'rtrefer-000001',/* 国际化处理： 物料版本*/
        refCode: 'uapbd.refer.rt.RtVersionGridRef',
        queryGridUrl: '/nccloud/mmbd/ref/RtVersionGridRef.do',
        columnConfig: [{name: [ 'rtrefer-000002', 'rtrefer-000003' ,'rtrefer-000004','rtrefer-000005','rtrefer-000006', 'rtrefer-000007'],
        code: [ 'pd_rt.pk_org','bd_material.code', 'bd_material.name' ,'bd_material.version','pd_rt.version','pd_rt.bdefault']}],
        /* 国际化处理： 所属组织,物料编码,物料名称,物料版本,规格,型号,物料简称,助记码,图号*/
        isMultiSelectedEnabled: false,
    };

    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65