//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 访问路径:
 * querytree 查询树结构
 */
const URL = {
	querytree: '/nccloud/uapbd/rejecttype/querytree.do',
	querynode: '/nccloud/uapbd/rejecttype/querynode.do',
	edit: '/nccloud/uapbd/rejecttype/edit.do',
	save: '/nccloud/uapbd/rejecttype/save.do',
	delete: '/nccloud/uapbd/rejecttype/delete.do',
	print: '/nccloud/uapbd/rejecttype/print.do',
	relation: '/nccloud/uapbd/rejecttype/relation.do'
};

/**
 * 按钮ID:
 * Relation 关联
 * Print 打印
 * Refresh 刷新
 * Save 保存
 * Cancel 取消
 */
const BUTTONID = { Relation: 'Relation', Print: 'Print', Refresh: 'Refresh', Save: 'Save', Cancel: 'Cancel' };

/**
 * 区域ID:
 * head : 表单区
 * tree : 树区
 * list_head : 肩头按钮区
 */
const AREA = { head: 'head', tree: 'tree', list_head: 'list_head' };

/**
 * 页面编码:
 */
const PAGECODE = { list: 'C01000010_list', appcode: 'C01000010' };

/**
 * 页面状态常量:
 * add:新增态
 * edit:编辑态
 * browse:浏览态
 */
const UISTATE = {
	add: 'add', // 新增态
	edit: 'edit', // 编辑态
	browse: 'browse' // 浏览态
};

/**
 * 字段常量:
 * pk_rejecttype 不合格类型主键
 * parentrejtype 上级质量不合格类型
 * vrejecttypecode 质量不合格类型编码
 * vrejecttypename 质量不合格类型名称
 * ts 时间戳
 */
const FIELD = {
	id: 'pk_rejecttype',
	pid: 'parentrejtype',
	code: 'vrejecttypecode',
	name: 'vrejecttypename',
	pk_group: 'pk_group',
	pk_org: 'pk_org',
	ts: 'ts'
};

/**
 * 自定义补充的常量:
 * id:查询树节点向后台传的字段信息
 * pid:上机检验项目id
 * refpk:节点pk标识
 * children:树子节点
 * rootId:初始根节点
 * pagecode:页面编码
 * templetid:模板主键
 * allToRight:树形穿梭框使用，全部右移标志
 * allToLeft:树形穿梭框使用，全部左移标志
 * add:关联，新增元素动作
 * del:关联，删除元素动作
 * rightOrigins:关联，初始的关联项目
 * addIDs:关联，新增的关联项目
 * delIDs:关联，删除的关联项目
 * nextid:需要展示的下一条数据的id
 */
const OTHER = {
	id: 'id',
	pid: 'pid',
	refpk: 'refpk',
	children: 'children',
	rootId: '-1',
	pagecode: 'pagecode',
	templetid: 'templetid',
	relationModel: 'relationModel',
	allToRight: 'allToRight',
	allToLeft: 'allToLeft',
	add: 'add',
	del: 'del',
	rightOrigins: 'rightOrigins',
	addIDs: 'addIDs',
	delIDs: 'delIDs',
	type: 'type',
	nextid: 'nextid'
};

export { URL, BUTTONID, AREA, PAGECODE, UISTATE, FIELD, OTHER };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65