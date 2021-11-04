//7yRuDa0NGKNRcGvolYLakwxVbzgz0y6JpobkxBQ2/++OGMJQZQ/QOvJKBtkc2Yqo
const pageId='10100CC_costcenter';//json文件的pagecode
const appId='0001Z0100000000047FO';//这里先借用自定义档案维护定义的appid
const delConfirm='';
const appcode='10100CC';
const formId="pk_group";
const tableIds=['ccdepts','ccworkcenters','ccfeetype'];
const head = 'head';
const HeadBtn = {
	edit:'uapbd_Edit',
    version:'uapbd_Version',
	import:'uapbd_Import',
	export:'uapbd_Export',
	refresh:'Refresh',
	cancel:'uapbd_Cancel',
	save:'uapbd_Save',
	saveAdd:'uapbd_SaveAdd',
	
}
const TableBtn = {
	addccdept:'add_ccdepts',
	delccdept:'del_ccdepts',
	addccwork:'add_ccwork',
	delccwork:'del_ccwork',
	addfeetype:'add_feetype',
	delfeetype:'del_feetype'
}
const urls={
	orgtypeqry:"/nccloud/uapbd/costcenter/orgtypeqry.do",
	loadtreeurl:"/nccloud/uapbd/costcenter/loadtreedata.do",
	saveCostUrl:"/nccloud/uapbd/costcenter/savecostcenter.do",
	delCostUrl:"/nccloud/uapbd/costcenter/delcostcenter.do",
	enableCostUrl:"/nccloud/uapbd/costcenter/enablecostcenter.do",
	disableCostUrl:"/nccloud/uapbd/costcenter/disablecostcenter.do",
	queryCardUrl:'/nccloud/uapbd/costcenter/loadcarddata.do'
};
export {pageId,appId, appcode, formId, tableIds, head, urls,HeadBtn ,TableBtn}
//7yRuDa0NGKNRcGvolYLakwxVbzgz0y6JpobkxBQ2/++OGMJQZQ/QOvJKBtkc2Yqo