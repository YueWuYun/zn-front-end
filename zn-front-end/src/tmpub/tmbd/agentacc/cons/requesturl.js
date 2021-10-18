/*Fjag7yvY9JTORZHxJha4xQdaxN83+09iXE+NCxU6Fm/DpPKcCS8pqj6y73zkPP9U*/
let requesturl = {
	query:'/nccloud/tmpub/tmbd/agentaccqueryscheme.do', //列表查询方法
	querybyids: '/nccloud/tmpub/tmbd/agentaccquerycard.do', //翻页根据pks查询
	delete: '/nccloud/tmpub/tmbd/agentacccondelete.do', //列表表体删除
	save: '/nccloud/tmpub/tmbd/agentaccconupdate.do',  //卡片页保存
	enable: '/nccloud/tmpub/tmbd/agentaccdisable.do',  //停用/启用
	confirm: '/nccloud/tmpub/tmbd/agentaccconfirm.do',  //确认/取消确认
	change: '/nccloud/tmpub/tmbd/agentaccconchange.do',  //变更
	afteredit: '/nccloud/tmpub/tmbd/agentaccconedithander.do',  //卡片编辑后事件
	print:'/nccloud/tmpub/tmbd/printaction.do'	//打印输出

};

export { requesturl };
/*Fjag7yvY9JTORZHxJha4xQdaxN83+09iXE+NCxU6Fm/DpPKcCS8pqj6y73zkPP9U*/