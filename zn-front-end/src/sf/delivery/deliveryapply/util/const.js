/*k0hzw2jIWRY8M4ClbwcIzImesKlyT8HeFe1hKfgoXxP+ThzSyJ7ulnqbTMc92ByN*/
let jsoncode = {
	//list
	modulecode: '3632',
	tablecode: 'table_deliveryapply_01',
	searchcode: 'search_deliveryapply_01',
	oid: '1001Z610000000004S2V',
	pagecode: '36320DA_L01',
	appid: '0001Z61000000002C0QR',
	//card
	formcode: 'form_deliveryapply_01',
	ctablecode: 'table_deliveryapply_C01',
	cpageid: '36320DA_C01',
	appcode: '36320DA',
	//缓存命名空间
	dataSource: 'sf.delivery.deliveryapply.dataSource',
	//linkcard
	linkcpageid: '36320DA_LINK_C01',
	//linklist
	linkpageid: '36320DA_LINK_L01',
	grid_code: 'deliveryapply_h',
	//联查页面缓存命名空间
	dataSourceLink: 'sf.delivery.deliveryapply.dataSourceLink'

};

let requesturl = {

	base: '/sf/delivery/deliveryapply/',
	querypage: '/nccloud/sf/deliveryapply/deliveryapplyquerypage.do',
	query: '/nccloud/sf/deliveryapply/deliveryapplyquery.do',
	commit: '/nccloud/sf/deliveryapply/deliveryapplycommit.do',
	uncommit: '/nccloud/sf/deliveryapply/deliveryapplyuncommit.do',
	batchcommit: '/nccloud/sf/deliveryapply/deliveryapplybatchcommit.do',
	batchuncommit: '/nccloud/sf/deliveryapply/deliveryapplybatchuncommit.do',
	delete: '/nccloud/sf/deliveryapply/deliveryapplydelete.do',
	batchdelete: '/nccloud/sf/deliveryapply/deliveryapplybatchdelete.do',
	search: '/nccloud/sf/deliveryapply/deliveryapplyquerysearcharea.do',
	querycard: '/nccloud/sf/deliveryapply/deliveryapplyquerycard.do',
	insert: '/nccloud/sf/deliveryapply/deliveryapplyinsert.do',
	update: '/nccloud/sf/deliveryapply/deliveryapplyupdate.do',
	//编辑后事件
	afterevent: '/nccloud/sf/deliveryapply/deliveryapplyafterevent.do',
	//委托办理
	submit: '/nccloud/sf/deliveryapply/deliveryapplysubmit.do',
	batchsubmit: '/nccloud/sf/deliveryapply/deliveryapplybatchsubmit.do',
	//取消委托办理
	unsubmit: '/nccloud/sf/deliveryapply/deliveryapplyunsubmit.do',
	batchunsubmit: '/nccloud/sf/deliveryapply/deliveryapplybatchunsubmit.do',
	//保存提交
	savecommit: '/nccloud/sf/deliveryapply/deliveryapplysavecommit.do',
	//复制
	copy: '/nccloud/sf/deliveryapply/deliveryapplycopy.do',
	//打印
	print: '/nccloud/sf/deliveryapply/deliveryapplyprint.do',
	//联查：计划预算
	linkplan: '/nccloud/sf/deliveryapply/deliveryapplylinkplan.do',
	//联查：计划预算
	linkplanforcard: '/nccloud/sf/deliveryapply/deliveryapplylinkplanforcard.do'
};

export { jsoncode, requesturl };

/*k0hzw2jIWRY8M4ClbwcIzImesKlyT8HeFe1hKfgoXxP+ThzSyJ7ulnqbTMc92ByN*/