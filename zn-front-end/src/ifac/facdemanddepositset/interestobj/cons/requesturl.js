/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/
let requesturl = {
	query:'/nccloud/ifac/bankinterestobj/pagequeryaction.do', //列表查询方法
	// querybyids: '/nccloud/fac/interestobj/querycardaction.do', //翻页根据pks查询
	delete: '/nccloud/ifac/bankinterestobj/deleteaction.do', //列表表体删除
	deleteversion:'/nccloud/ifac/bankinterestobj/deleteversionaction.do', //列表表体删除
	querycard: '/nccloud/ifac/bankinterestobj/querycardaction.do',
	copyoraddcard: '/nccloud/ifac/bankinterestobj/copyoraddcardaction.do',
	queryversion: '/nccloud/ifac/bankinterestobj/queryversionaction.do', //查询版本信息
	copy: '/nccloud/ifac/bankinterestobj/innerdestroycopy.do',
	save: '/nccloud/ifac/bankinterestobj/saveaction.do',  //卡片页保存
	disable: '/nccloud/ifac/bankinterestobj/disableaction.do',  //卡片页停用
	enable: '/nccloud/ifac/bankinterestobj/enableaction.do',  //卡片页启用
	edit: '/nccloud/ifac/bankinterestobj/editaction.do',  //卡片页修改
	edithander: '/nccloud/ifac/bankinterestobj/edithander.do',  //卡片销户账号编辑后事件
	print:'/nccloud/ifac/bankinterestobj/printaction.do',
	ratelink:'/nccloud/tmpub/tmbd/linkinterest.do',//利率联查
	check2card:'/nccloud/ifac/bankinterestobj/listtocardcheck.do'
};
 
export { requesturl };

/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/