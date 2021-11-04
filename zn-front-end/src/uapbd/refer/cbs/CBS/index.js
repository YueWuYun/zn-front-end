//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function CBSRefer(props = {}) {
	let conf = {
		refType: 'tree',
		refName: 'CBS' /*国际化处理：关键程度*/,
		refCode: 'uapbd.refer.cbs',
		placeholder: '选择父级'/* 国际化处理：价目表*/,
		queryTreeUrl: '/nccloud/co/ref/CBSTreeRef.do',
		isMultiSelectedEnabled: false,
		value: [], // 如果需要多选则必须有这个属性
		treeConfig: {
			name: [ 'REFER-000013', 'REFER-000014' ],
			code: [ 'refcode', 'refname' ]
		} /* 国际化处理：价目表编码,价目表名称*/,
		rootNode: { refname: 'CBS', refpk: 'root' } /* 国际化处理：销售组织*/,
	};
	return <Refer {...Object.assign(conf, props)} />;
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65