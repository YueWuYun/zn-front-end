//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: 'refer-000202',/* 国际化处理： 全局+集团+业务单元*/
		rootNode: { refname: 'refer-000202', refpk: 'root' },/* 国际化处理： 全局+集团+业务单元*/
        refCode: 'uapbd.org.BusinessUnitWithGlobleAndCurrGropTreeRef',
        placeholder: 'refer-000202',/* 国际化处理： 全局+集团+业务单元*/
		queryTreeUrl: '/nccloud/uapbd/ref/BusinessUnitWithGlobleAndCurrGropTreeRef.do',
		treeConfig:{name:['refer-000002', 'refer-000003'],code: ['refcode', 'refname']},/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
        isShowUnit:false
	};

	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65