/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/
let requesturl = {
	query:'/nccloud/ifac/demandintlist/pagequeryaction.do', //列表查询
	print:'/nccloud/ifac/demandintlist/printaction.do',//打印
	//ratelink:'/nccloud/ifac/demandintlist/linkinterest.do',//利率联查

	ratelink:'/nccloud/tmpub/tmbd/linkinterest.do',//利率联查

	querycard:'/nccloud/ifac/demandintlist/querycardaction.do',//通过id查询卡片
	linkquery:'/nccloud/ifac/demandintlist/linkqueryaction.do',//联查利息清单

	linkcard:'/nccloud/ifac/demandintlist/linkcardaction.do',//联查利息清单卡片

	tryinter:'/nccloud/ifac/demandintlist/tryinteraction.do',//试算

	queryintobj:'/nccloud/ifac/demandintlist/queryintobjaction.do',//查询对象主键
	gotocardcheck:'/nccloud/ifac/demandintlist/demlgotocardcheck.do',
	belinkaction:'/nccloud/ifac/demandintlist/Ifacvoucherlinkaction.do'//凭证反联查
};

export { requesturl };

/*Fjag7yvY9JTORZHxJha4xWYSX2JqQs1QmJd39pTVllPEV0ju9mJo5R1yWbIPW486*/