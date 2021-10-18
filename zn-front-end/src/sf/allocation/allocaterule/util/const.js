/*k0hzw2jIWRY8M4ClbwcIzImesKlyT8HeFe1hKfgoXxP+ThzSyJ7ulnqbTMc92ByN*/
let jsoncode = {
	//list
	modulecode: '3632',
	tablecode: 'table_allocaterule_01',
	searchcode: 'search_allocaterule_01',
	//oid: '1001Z61000000001M8GA',
	oid: '1001Z610000000005606',
	pagecode: '36320AAC_L01',
	appid: '0001Z6100000000275LH',
	//card
	formcode: 'form_allocaterule_01',
	ctablecode: 'table_allocaterule_C01',
	cpageid: '36320AAC_C01',
	appcode: '36320AAC',
	//缓存命名空间
	dataSource: 'sf.allocation.allocaterule.dataSource'

};

let requesturl = {
	base: '/sf/allocation/allocaterule/',
	query: '/nccloud/sf/allocaterule/allocaterulequery.do',
	querypage: '/nccloud/sf/allocaterule/allocaterulequerypage.do',
	commit: '/nccloud/sf/allocaterule/allocaterulecommit.do',
	batchcommit: '/nccloud/sf/allocaterule/allocaterulebatchcommit.do',
	batchuncommit: '/nccloud/sf/allocaterule/allocaterulebatchuncommit.do',
	delete: '/nccloud/sf/allocaterule/allocateruledelete.do',
	search: '/nccloud/sf/allocaterule/allocaterulequerysearcharea.do',
	querycard: '/nccloud/sf/allocaterule/allocaterulequerycard.do',
	insert: '/nccloud/sf/allocaterule/allocateruleinsert.do',
	update: '/nccloud/sf/allocaterule/allocateruleupdate.do',
	//编辑后事件
	afterevent: '/nccloud/sf/allocaterule/allocateruleafterevent.do',
	//委托办理
	submit: '/nccloud/sf/allocaterule/allocaterulesubmit.do',
	//取消委托办理
	unsubmit: '/nccloud/sf/allocaterule/allocateruleunsubmit.do',
	//保存提交
	savecommit: '/nccloud/sf/allocaterule/allocaterulesavecommit.do',
	//复制
	copy: '/nccloud/sf/allocaterule/allocaterulecopy.do',
	//打印
	print: '/nccloud/sf/allocaterule/allocateruleprint.do',
	//启用
	enable: '/nccloud/sf/allocaterule/allocateruleenable.do',
	batchenable: '/nccloud/sf/allocaterule/allocaterulebatchenable.do',
	//停用
	disbale: '/nccloud/sf/allocaterule/allocateruledisable.do',
	batchdisable: '/nccloud/sf/allocaterule/allocaterulebatchdisable.do'
};

export { jsoncode, requesturl };

/*k0hzw2jIWRY8M4ClbwcIzImesKlyT8HeFe1hKfgoXxP+ThzSyJ7ulnqbTMc92ByN*/