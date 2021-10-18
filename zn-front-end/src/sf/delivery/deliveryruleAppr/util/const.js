/*k0hzw2jIWRY8M4ClbwcIzImesKlyT8HeFe1hKfgoXxP+ThzSyJ7ulnqbTMc92ByN*/
let jsoncode = {
	//list
	modulecode: '3632',
	tablecode: 'table_deliveryrule_01',
	searchcode: 'search_deliveryrule_01',
	//oid: '1001Z61000000001M8H4',
	oid: '1001Z6100000000055YP',
	pagecode: '36320ACC_L01',
	appid: '0001Z6100000000275L0',
	//card
	formcode: 'form_deliveryrule_01',
	ctablecode: 'table_deliveryrule_C01',
	cpageid: '36320ACC_C01',
	appcode: '36320ACCA',
	//缓存命名空间
	dataSource: 'sf.delivery.deliveryrule.dataSource'

};

let requesturl = {
	base: '/sf/delivery/deliveryrule/',
	querypage:'/nccloud/sf/deliveryrule/deliveryrulequerypage.do',
	query: '/nccloud/sf/deliveryrule/deliveryrulequery.do',
	batchcommit: '/nccloud/sf/deliveryrule/deliveryrulebatchcommit.do',
	batchuncommit: '/nccloud/sf/deliveryrule/deliveryrulebatchuncommit.do',
	delete: '/nccloud/sf/deliveryrule/deliveryruledelete.do',
	search: '/nccloud/sf/deliveryrule/deliveryrulequerysearcharea.do',
	querycard: '/nccloud/sf/deliveryrule/deliveryrulequerycard.do',
	insert: '/nccloud/sf/deliveryrule/deliveryruleinsert.do',
	update: '/nccloud/sf/deliveryrule/deliveryruleupdate.do',
	//编辑后事件
	afterevent: '/nccloud/sf/deliveryrule/deliveryruleafterevent.do',
	//委托办理
	submit: '/nccloud/sf/deliveryrule/deliveryrulesubmit.do',
	//取消委托办理
	unsubmit: '/nccloud/sf/deliveryrule/deliveryruleunsubmit.do',
	//保存提交
	savecommit: '/nccloud/sf/deliveryrule/deliveryrulesavecommit.do',
	//复制
	copy: '/nccloud/sf/deliveryrule/deliveryrulecopy.do',
	//打印
	print: '/nccloud/sf/deliveryrule/deliveryruleprint.do',
	//启用
	enable:'/nccloud/sf/deliveryrule/deliveryruleenable.do',
	batchenable:'/nccloud/sf/deliveryrule/deliveryrulebatchenable.do',
	//停用
	disable:'/nccloud/sf/deliveryrule/deliveryruledisable.do',
	batchdisable:'/nccloud/sf/deliveryrule/deliveryrulebatchdisable.do',
};

export { jsoncode, requesturl };
/*k0hzw2jIWRY8M4ClbwcIzImesKlyT8HeFe1hKfgoXxP+ThzSyJ7ulnqbTMc92ByN*/