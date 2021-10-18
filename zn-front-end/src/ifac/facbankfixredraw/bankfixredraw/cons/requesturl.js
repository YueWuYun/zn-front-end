/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/
let requesturl = {
	query:'/nccloud/ifac/bankfixeddatewithdraw/pagequeryaction.do', //列表查询
	print:'/nccloud/ifac/bankfixeddatewithdraw/printaction.do',//打印
	restlist:'/nccloud/ifac/demandintcal/datewithdrawintlistaction.do',//联查利息清单
	checklist:'/nccloud/ifac/bankcenterinterestmanage/checkdemandintlistaction.do',//检查是否存在利息清单
	tally:'/nccloud/ifac/bankfixeddatewithdraw/FDWDWTallyAction.do',
	untally:'/nccloud/ifac/bankfixeddatewithdraw/FDWDWUnTallyAction.do',
	gotocardcheck:'/nccloud/ifac/bankfixeddatewithdraw/FDWDWGoToCheckAction.do',
	belinkaction:'/nccloud/ifac/bankfixeddatewithdraw/FDWDWVoucherLinkAction.do'//凭证反联查
};

export { requesturl };

/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/