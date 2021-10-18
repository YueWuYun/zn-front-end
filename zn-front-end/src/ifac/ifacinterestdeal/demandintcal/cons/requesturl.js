/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/
let requesturl = {
	query:'/nccloud/ifac/demandintcal/pagequeryaction.do', //列表查询
	calculate:'/nccloud/ifac/demandintcal/calculateintaction.do',//计息
	uncalculate:'/nccloud/ifac/demandintcal/uncalculateintaction.do',//取消计息
	preaccrued:'/nccloud/ifac/demandintcal/preaccruedaction.do',//预提
	unpreaccrued:'/nccloud/ifac/demandintcal/unpreaccruedaction.do',//取消预提
	print:'/nccloud/ifac/demandintcal/printaction.do',//打印
	ratelink:'/nccloud/tmpub/tmbd/linkinterest.do',//利率联查
	checklist:'/nccloud/ifac/demandintcal/checkdemandintlistaction.do',//检查是否存在利息清单
	gotocardcheck:'/nccloud/ifac/demandintcal/demlgotocardcheck.do',
	checktrylist:'/nccloud/ifac/demandintcal/judgetryinter.do',//检查试算的利息清单条数demlgotocardcheck
};

export { requesturl };

/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/