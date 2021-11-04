//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export var conf = {
	refType: 'tree',
	refName: '集团(所有)',
	placeholder: '集团(所有)',
	refCode: 'uapbd.org.GroupDefaultTreeRef',
	queryTreeUrl: '/nccloud/uapbd/ref/GroupDefaultTreeRef.do',
	treeConfig: { name: ['编码','名称'], code: ['refcode', 'refname'] },
	rootNode: { refname: '集团(所有)', refpk: 'root' },
	isMultiSelectedEnabled: true
}

export default function (props = {}) {
	return <Refer {...Object.assign(conf, props)} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65