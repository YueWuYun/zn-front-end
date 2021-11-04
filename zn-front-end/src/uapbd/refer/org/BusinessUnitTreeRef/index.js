//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;
import { conf as unitConf } from '../../../../uap/refer/riart/groupTreeRef/index';
unitConf['fieldid'] = 'group';
export var conf = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: 'refer_uapbd'
	},

	refType: 'tree',
	refName: 'refer-000201' /* 国际化处理： 业务单元*/,
	refCode: 'uapbd.refer.org.BusinessUnitTreeRef',
	rootNode: { refname: 'refer-000201', refpk: 'root' } /* 国际化处理： 业务单元*/,
	placeholder: 'refer-000201' /* 国际化处理： 业务单元*/,
	queryTreeUrl: '/nccloud/uapbd/org/BusinessUnitTreeRef.do',
	treeConfig: { name: [ 'refer-000002', 'refer-000003' ], code: [ 'refcode', 'refname' ] } /* 国际化处理： 编码,名称*/,
	isMultiSelectedEnabled: false,
	unitProps: unitConf,
	isShowUnit: false
};

export default function(props = {}) {
	return <Refer {...conf} {...props} />;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65