/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/
let requesturl = {
	query:'/nccloud/ifac/interestobj/pagequeryaction.do', //列表查询方法
	// querybyids: '/nccloud/ifac/interestobj/querycardaction.do', //翻页根据pks查询
	delete: '/nccloud/ifac/interestobj/deleteaction.do', //列表表体删除
	deleteversion:'/nccloud/ifac/interestobj/deleteversionaction.do', //列表表体删除
	querycard: '/nccloud/ifac/interestobj/querycardaction.do',
	queryversion: '/nccloud/ifac/interestobj/queryversionaction.do', //查询版本信息
	copy: '/nccloud/ifac/interestobj/innerdestroycopy.do',
	save: '/nccloud/ifac/interestobj/saveaction.do',  //卡片页保存
	disable: '/nccloud/ifac/interestobj/disableaction.do',  //卡片页停用
	enable: '/nccloud/ifac/interestobj/enableaction.do',  //卡片页启用
	edit: '/nccloud/ifac/interestobj/editaction.do',  //卡片页修改
	edithander: '/nccloud/ifac/interestobj/edithander.do',  //卡片销户账号编辑后事件
	print:'/nccloud/ifac/interestobj/printaction.do',
	ratelink:'/nccloud/tmpub/tmbd/linkinterest.do'//利率联查
};
 
export { requesturl };

/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/