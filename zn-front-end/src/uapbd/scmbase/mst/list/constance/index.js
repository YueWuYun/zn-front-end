//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
const UISTATE = {
	edit: 'edit',
	browse: 'browse'
}; //页面状态
const PAGECODE = '400101802_list'; //页面编码
const BUTTONAREA = {
	list_head: 'list_head',
	list_inner: 'list_inner'
}; //按钮区域
const PAGEAREA = {
	list: 'list_head',
	search: 'search'
}; //模板区域
const BUTTONS = {
	Add: 'Add',
	Edit: 'Edit',
	Delete: 'Delete',
	Save: 'Save',
	Cancel: 'Cancel',
	Print: 'Print',
	Output: 'Output',
	Refresh: 'Refresh'
};
const URL = {
	query: '/nccloud/uapbd/mst/query.do',
	save: '/nccloud/uapbd/mst/save.do',
	delete: '/nccloud/uapbd/mst/delete.do',
	seal: '/nccloud/uapbd/mst/seal.do',
	unseal: '/nccloud/uapbd/mst/unseal.do',
	print: '/nccloud/uapbd/mst/print.do'
};
const FIELDS = {
	cmeastoolid: 'cmeastoolid', //主键
	pk_org: 'pk_org', //库存组织
	pk_org_v: 'pk_org_v', //库存组织vid
	pk_group: 'pk_group', //集团
	nquotiety: 'nquotiety', //系数
	enablestate: 'enablestate', //启用状态
	cmeasclassid: 'cmeasclassid', //计量器具级别
	cdeptid: 'cdeptid', //所属部门
	cdeptvid: 'cdeptvid', //所属部门vid
	centerdeptid: 'centerdeptid', //录入部门
	centerdeptvid: 'centerdeptvid', //录入部门vid
	cvendorid: 'cvendorid', //供应商
	vdef: 'vdef', //自定义项前缀
	fcopytype: 'fcopytype', //抄值类型
	fnumunit: 'fnumunit', //数值单位
	vtimeunit: 'vtimeunit', //时间单位
	nmeasrange: 'nmeasrange', //里程
	nmeasrangeup: 'nmeasrangeup', //里程上限
	nmeasrangedown: 'nmeasrangedown', //里程下限
	ts: 'ts'
};

const DATASOURCE = 'scmbd.mst.datasource';
const SEARCHINFO = 'searchinfo'; //缓存查询条件的key

export { UISTATE, PAGECODE, BUTTONAREA, PAGEAREA, BUTTONS, URL, FIELDS, DATASOURCE, SEARCHINFO };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65