//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

//import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';

export var conf = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: '10140MMREFER',
	},

	refType: 'gridTree',
	refName: 'shiftrefer-000001',/* 国际化处理： 客户档案*/
	refCode: 'mmpd.shift.ShiftDefaultGridRef',
	placeholder: 'shiftrefer-000001',/* 国际化处理： 客户档案*/
	treeConfig: { name: ['shiftrefer-000002', 'shiftrefer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	rootNode: { refname: 'shiftrefer-000004', refpk: 'root' },/* 国际化处理： 客户基本分类*/
	queryTreeUrl: '/nccloud/mmpd/ref/ShiftTypeDefaultTreeRef.do',
	queryGridUrl: '/nccloud/mmpd/ref/ShiftDefaultGridRef.do',
	columnConfig: [{
		name: ['shiftrefer-000002', 'shiftrefer-000003'],/* 国际化处理： 所属组织,客户编码,客户名称,助记码*/
		code: ['refcode', 'refname']
	}],
	isMultiSelectedEnabled: false,
	isShowDisabledData: false,
	//unitProps: unitConf,
	//isShowUsual: true,
};

export default function (props = {}) {
	return <Refer {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65