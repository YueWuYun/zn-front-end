//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
const URL = {

	update: '/nccloud/mmbd/bom0202/update.do',
	insert: '/nccloud/mmbd/bom0202/insert.do',
	delete: '/nccloud/mmbd/bom0202/delete.do',
	queryGrand: '/nccloud/mmbd/bom0202/queryGrand.do',
	queryCard: '/nccloud/mmbd/bom0202/queryCard.do',
	commit: '/nccloud/mmbd/bom0202/commit.do',
	uncommit: '/nccloud/mmbd/bom0202/uncommit.do',
	queryOrgVid:'/nccloud/mmbd/pub/queryOrgVid.do',
	matoidevent:'/nccloud/mmbd/bom0202/matoidevent.do',
	matvidevent:'/nccloud/mmbd/bom0202/matvidevent.do',
	hnnum:'/nccloud/mmbd/bom0202/hnumevent.do',
	hnassnum:'/nccloud/mmbd/bom0202/hassnumevent.do',
	copyAdd:'/nccloud/mmbd/bom0202/copyAdd.do',
	enable:'/nccloud/mmbd/bom0202/enable.do',
	disable:'/nccloud/mmbd/bom0202/disable.do',
	default:'/nccloud/mmbd/bom0202/default.do',
	suredefault:'/nccloud/mmbd/bom0202/suredefault.do',
	canceldefault:'/nccloud/mmbd/bom0202/canceldefault.do',
	checkbefore:'/nccloud/mmbd/bom0202/beforedetect.do',
	print:'/nccloud/mmbd/bom0202/print.do',
	checkdefaultversion:'/nccloud/mmbd/bom0202/checkdefaultversion.do',
	card: '/card',
	list: '/list',
	beforeEditHead: '/nccloud/mmbd/bom0202/bodyBeforeEvent.do', //表头编辑前
	afterBodyEdit: '/nccloud/mmbd/bom0202/bodyEvent.do', //表头编辑后
	afterOutputsEdit: '/nccloud/mmbd/bom0202/bodyOutEvent.do', //表头编辑后
	beforeBodyEdit: '/nccloud/mmbd/bom0202/bodyBeforeEvent.do', //表头编辑后
	lossscale:'/nccloud/mmbd/bom0202/lossscale.do',
	checkpermission:'/nccloud/mmbd/pub/checkpermission.do',
	replscale:'/nccloud/mmbd/bom0202/replscale.do'
};

const AREA ={
	bomlist:'bomwh_head',
	bomcardh:'bomcard_h',
	bomcarditem:'bomcard_b',
	bomcarditem2:'bomcard_b2',
	bomcardoutputs:'bomcard_outputs',
	bomcarduseorg:'bomcard_useorg',
	bomwips:'bomwips',
	bomrepls:'bomrepls',
	bomloss:'bomloss',
	bompos:'bompos',
	bomquery:'bomwh_query'
};

const PAGECODE = {
	bom_list:'10140BOMM_list',
	bom_card:'10140BOMM_card',
	bom_grand:'10140BOMM_grand'
}


export {URL,AREA,PAGECODE};
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65