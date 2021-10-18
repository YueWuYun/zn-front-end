/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/
let requesturl = {
	query:'/nccloud/ifac/demandinttrcpt/pagequeryaction.do', //列表查询方法
	// querybyids: '/nccloud/ifac/demandinttrcpt/querycardaction.do', //翻页根据pks查询
	querycard: '/nccloud/ifac/demandinttrcpt/querycardaction.do',
	save: '/nccloud/ifac/demandinttrcpt/saveaction.do',  //卡片页保存
	edithander: '/nccloud/ifac/demandinttrcpt/edithander.do',  //卡片销户账号编辑后事件
	print:'/nccloud/ifac/demandinttrcpt/printaction.do',
	ratelink:'/nccloud/tmpub/tmbd/linkinterest.do',//利率联查
	tally:'/nccloud/ifac/demandinttrcpt/tallyaction.do',//记账
	untally:'/nccloud/ifac/demandinttrcpt/untallyaction.do',//取消记账
	elecsignprint:'/nccloud/ifac/demandinttrcpt/elecsignprint.do',//正式打印或补充打印
	belinkaction:'/nccloud/ifac/demandinttrcpt/Ifacvoucherlinkaction.do',//凭证反联查
	list2cardcheckaction:'/nccloud/ifac/demandinttrcpt/gotocardcheck.do'//列表跳转卡片检查
};
 
export { requesturl };

/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/