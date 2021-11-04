//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: 刘奇 
 * @PageInfo: 常量类
 * @Date: 2018-05-22 19:25:02 
 * @Last Modified by: huoyzh
 * @Last Modified time: 2019-12-04 11:13:30
 */

// 区域ID
const AREA = {
	//列表界面区域
	pageArea: '10140QL_list',
	headTableArea: 'head',
	bodyTableArea: 'body',
	printArea: '10140QL',
	oid: '1002Z81000000000OPNU'
};
//页面状态
const STATUS = {
	browse: 'browse',
	edit: 'edit'
};
//按钮名称以及区域
const BUTTON = {
	list_head: 'list_head', //列表表头区域
	list_head_inner: 'list_head_inner', //列表表头行操作区域
	list_body: 'list_body', //列表表体肩区域
	list_body_inner: 'list_body_inner', //卡片表体行操作区域
	add: 'Add', //新增
	delete: 'Delete', //删除
	edit: 'Edit', //修改
	save: 'Save', //保存
	show: 'Show', //查看
	cancel: 'Cancel', //取消
	copy: 'Copy', //复制
	commit: 'Commit', //提交
	unCommit: 'UnCommit', //取消提交
	deleteLine: 'DeleteLine', //删行
	addLine: 'AddLine', //增行
	refresh: 'Refresh', //刷新
	print: 'Print' //打印
};
//请求URL地址
const URL = {
	search: '/nccloud/uapbd/qualitylevel/search.do',
	query: '/nccloud/uapbd/qualitylevel/query.do',
	queryBody: '/nccloud/uapbd/qualitylevel/querybody.do',
	save: '/nccloud/uapbd/qualitylevel/save.do',
	delete: '/nccloud/uapbd/qualitylevel/delete.do',
	print: '/nccloud/uapbd/qualitylevel/print.do' //打印
};

export { AREA, STATUS, URL, BUTTON };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65