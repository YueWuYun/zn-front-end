//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';

export default function (props={}) {
    var conf = {
        		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
        refName: 'refer-000310',/* 国际化处理： 业务单元版本（所有）*/
        refCode: 'uapbd.orgv.BusinessUnitVersionAllTreeRef',
        rootNode:{refname:'refer-000310',refpk:'root'},/* 国际化处理： 业务单元版本（所有）*/
        placeholder:'refer-000311',/* 国际化处理： 业务单元版本(所有)*/
        queryTreeUrl: '/nccloud/uapbd/ref/BusinessUnitVersionAllTreeRef.do',
        treeConfig:{name:['refer-000002', 'refer-000003' , ],code: ['refcode', 'refname']},//使用的时候请从返回值取pk_vid作为参照主键/* 国际化处理： 编码,名称*/
        //treeConfig:{name:['编码', '名称' , 'pk_vid'],code: ['refcode', 'refname','pk_vid']},
        isMultiSelectedEnabled: false,
        unitProps: unitConf,
        isShowUnit:false,
        isHasDisabledData: false
    };
    return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65