//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
const UISTATE = {
	edit: 'edit',
	browse: 'browse'
}; //页面状态
const PAGECODE = '400101800_list'; //页面编码
const BUTTONAREA = {
	list_head: 'list_head',
	list_inner: 'list_inner'
}; //按钮区域
const PAGEAREA = {
	list: 'list_head'
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
	query: '/nccloud/uapbd/mscl/query.do',
	save: '/nccloud/uapbd/mscl/save.do',
	seal: '/nccloud/uapbd/mscl/seal.do',
	unseal: '/nccloud/uapbd/mscl/unseal.do',
	print: '/nccloud/uapbd/mscl/print.do'
};
const FIELDS = {
	cmeainstruclid: 'cmeainstruclid', //主键
	pk_org: 'pk_org', //库存组织
	pk_group: 'pk_group', //集团
	enablestate: 'enablestate', //启用状态
	classcode: 'classcode', //级别编码
	classname: 'classname', //级别名称
	ts: 'ts'
};

export { UISTATE, PAGECODE, BUTTONAREA, PAGEAREA, BUTTONS, URL, FIELDS };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65