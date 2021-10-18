/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, toast, print, output ,createPage, base, cardCache, promptBox ,cacheTools} from 'nc-lightapp-front';     
//引入常量定义
import { APP_INFO, URL_INFO, LIST_PAGE_INFO, SHOW_MODE, TEMPLATE_INFO, ITEM_INFO ,CARD_PAGE_INFO,TRAN_LIST_PAGE_INFO} from '../../cons/constant';
//引入公共api
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/CMPButtonUtil';
import { go2card } from "../../util/index";
//影像 
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { setPropCache, getPropCache, loadMultiLang, go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { checkEditRight } from "../../util/checkEditRight.js";
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';//税务参数查询

export default function buttonClick(props, key, text, record, index) {
    switch (key) {
		//头部 刷新
		case 'Refresh':
			this.refresh();
			break;
		//头部 新增
		case 'Add':		 	
			go2card(props, { status: 'add' }, this.getState.bind(this));   
			break;	
		//头部 删除
		case 'Delete':
			promptBox({
				color: "warning",
				content: loadMultiLang(props, '36070APM--000032'),/* 国际化处理： 确认要删除吗?*/
				beSureBtnClick: delHeadConfirm.bind(this, props)
		  	});	
			break;
		//头部 复制
		case 'Copy':			
			copyBill.call(this, props);
			break;
		//头部 提交
		case 'Commit': 
			let CommitDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
			let CommitData = CommitDatas[0];
			//处理的回调，只要当选中一条时会将回调注入单笔操作，故该回调只有选中一条的时候有效，回调逻辑里的pk和ts都是选中的第一条数据的pk和ts
			listMultiOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, ITEM_INFO.PK, URL_INFO.COMMON.COMMIT, loadMultiLang(props, '36070APM--000026')/* 国际化处理： 提交*/, APP_INFO.DATA_SOURCE, true, null, (props, data) => {
				let { workflow } = data;
				//有指派信息，则指派，没有则重绘界面
				if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
					this.setState({
						assignData: data,
						assignShow: data,
						rowIndex: CommitData.index,
						billID: CommitData && CommitData.data && CommitData.data.values && CommitData.data.values[ITEM_INFO.PK] && CommitData.data.values[ITEM_INFO.PK].value,
						ts: CommitData && CommitData.data && CommitData.data.values && CommitData.data.values.ts && CommitData.data.values.ts.value
					});
				}
			});
			break;
		//头部 收回
		case 'Uncommit':
			listMultiOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, ITEM_INFO.PK, URL_INFO.COMMON.UNCOMMIT, loadMultiLang(props, '36070APM--000027'), APP_INFO.DATA_SOURCE);/* 国际化处理： 收回*/
			break;
		//头部 附件
		case 'Filedoc':
			fileMgr.call(this, props);
			break;
		//头部 打印 
		case 'Print':
			Print.call(this,props);
			break;
		//头部 输出
		case 'Output':
			outputAll.call(this, props);
			break;
		//头部 打印清单
		case 'Printlist':
			printAll.call(this, props);
			break;
		//头部 联查工作流
		case 'LinkWorkFlow':
			linkWorkFlow.call(this, props);
			break;
		//头部 联查预算
		case 'Linkplan':
			linkNtb.call(this, props);
			break;
		//表体 编辑行
		case 'edittableBtn':
			go2CardCheck({
				props,url:URL_INFO.LIST.LIST2CARD_CHECK,pk:record.pk_apply.value,ts:record.ts.value,fieldPK:ITEM_INFO.PK,actionCode:null,permissionCode:null,checkSaga:true,checkTS:true,go2CardFunc:()=>{
					checkEditRight.call(this,record.pk_apply.value).then((res) => {
						go2card(props, { status: 'edit', id: record.pk_apply.value, from: 'list' }, this.getState.bind(this));	
					});
				}
			});			
			break;
		//表体 删除行
		case 'deletetableBtn':
			delConfirm(props, record, index);
			break;
		//表体 提交
		case 'committableBtn':
			listSingleOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, URL_INFO.COMMON.COMMIT, record, ITEM_INFO.PK, index, loadMultiLang(props, '36070APM--000026')/* 国际化处理： 提交*/, APP_INFO.DATA_SOURCE, true, null, (props, data) => {
				let { workflow } = data;
				//有指派信息，则指派，没有则重绘界面
				if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
					this.setState({
						assignData: data,
						assignShow: data,
						rowIndex: index,
						ts: record[ITEM_INFO.TS].value,
						billID: record[ITEM_INFO.PK].value
					});
				}
			});
			break;
		//表体 收回
		case 'backtableBtn':
			listSingleOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, URL_INFO.COMMON.UNCOMMIT, record, ITEM_INFO.PK, index, loadMultiLang(props, '36070APM--000010'), APP_INFO.DATA_SOURCE);/* 国际化处理： 收回成功！*/
			break;
		//表体 生成
		case 'generatetableBtn':
			listSingleOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, URL_INFO.COMMON.GENERATE, record, ITEM_INFO.PK, index, loadMultiLang(props, '36070APM--000015'), APP_INFO.DATA_SOURCE);/* 国际化处理： 生成成功！*/
			break;
		//影像查看
		case 'Imageshow':
			imageC.call(this,props);
			break;			
		//影像扫描
		case 'Imagescan':
			imageS.call(this,props);			
			break;
		//联查发票
		case 'LinkInvoice':
			LinkI.call(this,props);
			break;
		 //联查单据
		 case 'Linkbill':
			Linkb.call(this,props);
		    break;				
		case 'AddFrom':
			let { deleteCache } = this.props.transferTable;
			deleteCache(APP_INFO.DATA_SOURCE_TRANS);
			props.pushTo(URL_INFO.TRAN_LIST_PAGE_URL, {			
                pagecode: TRAN_LIST_PAGE_INFO.PAGE_CODE,
                destTradetype: "36OV"
            });
			break; 			
		case 'Generate':
			promptBox({
				color: "warning",
				content: loadMultiLang(props, '36070APM--000013'),/* 国际化处理： 您确定要生成付款单据吗？一旦生成，则不可以取消生成！*/
				beSureBtnClick: gelConfirm.bind(this, props)
		  	});	
			break;
		case 'Linkwhx':
			linkWhx.call(this, props);			
			break;		
		default:
			break;

    }
}


//删除确认
const delConfirm = function (props, record, index) {
	let pkMapTs = {};
	let pk = record[ITEM_INFO.PK].value;
	let ts = record[ITEM_INFO.TS].value;
	pkMapTs[pk] = ts;
	ajax({
		url: URL_INFO.COMMON.DELETE,
		data: {
			pkMapTs,
			pageCode: LIST_PAGE_INFO.PAGE_CODE
		},
		success: () => {
			//删除表格数据
			props.table.deleteTableRowsByIndex(LIST_PAGE_INFO.TABLE_CODE, index);
			//删除列表缓存
			props.table.deleteCacheId(LIST_PAGE_INFO.TABLE_CODE, pk);
			toast({ color: 'success', content: loadMultiLang(props, '36070APM--000014') });/* 国际化处理： 删除成功*/
		}
	});
};
/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
	let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[ITEM_INFO.PK] && selectDatas[0].data.values[ITEM_INFO.PK].value;
	let billNO = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[ITEM_INFO.VBILLNO] && selectDatas[0].data.values[ITEM_INFO.VBILLNO].value;
	this.setState({
		showUploader: !this.state.showUploader,
		billID,
		billNO
	});
}
/**
 * 单条打印
 */
const Print = function (props) {
	let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}		
	print(
		'pdf',
		URL_INFO.COMMON.PRINT,
		{
		nodekey: TEMPLATE_INFO.PRINT_NOTEKEY_C,
		// appcode: APP_INFO.FUNCODE,
		oids: [selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[ITEM_INFO.PK] && selectDatas[0].data.values[ITEM_INFO.PK].value]
		}
	);
}



/**
 * 打印
 * @param {*} props 页面内置对象
 */
const printAll = function (props) {
	let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let index = 0;
	let oids = [];
	let id;
	while (index < selectDatas.length) {
		id = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[ITEM_INFO.PK] && selectDatas[index].data.values[ITEM_INFO.PK].value;
		if (!id) {
			continue;
		}
		oids.push(id);
		index++;
	}
	if (oids.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	print(
		'pdf',
		URL_INFO.COMMON.PRINT,
		{
			nodekey: TEMPLATE_INFO.PRINT_NOTEKEY_L,
			// appcode: APP_INFO.FUNCODE,
			oids
		}
	);
}

/**
 * 输出全部
 * @param {*} props 
 */
const outputAll = function (props) {
	let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let index = 0;
	let oids = [];
	let id;
	while (index < selectDatas.length) {
		id = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[ITEM_INFO.PK] && selectDatas[index].data.values[ITEM_INFO.PK].value;
		if (!id) {
			continue;
		}
		oids.push(id);
		index++;
	}
	if (oids.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	output({
		url: URL_INFO.COMMON.PRINT,
		data: {
			nodekey: TEMPLATE_INFO.PRINT_NOTEKEY_L,
			// appcode: APP_INFO.FUNCODE,
			// appcode: props.getSearchParam('c'),
			oids,
			outputType: 'output'
		}
	});
}
const linkWorkFlow = function (props) { 
	let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length != 1) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let pk = selectDatas[0].data.values[ITEM_INFO.PK].value;	
	let tradeType = selectDatas[0].data.values['pk_trantypecode'].value;
	if (!pk) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000031') });/* 国际化处理： 选中数据主键为空！*/
	}
	if(!tradeType)	{
		tradeType = '36D1';
	}
	this.setState({ 
		showApproveDetail: true,
		billID: pk,
		tradeType:tradeType
	})
}
const linkVoucher = function (props) {
	let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length != 1) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let pk = selectDatas[0].data.values[ITEM_INFO.PK].value;
	if (!pk) {
		return;
	}
	linkVoucherApp(props, pk, APP_INFO.CLASS_AGGVO);
}

const linkNtb = function (props) {
	let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length != 1) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let pk = selectDatas[0].data.values[ITEM_INFO.PK].value;
	if (!pk) {
		return;
	}
	ajax({
		url: URL_INFO.COMMON.LINKNTB,
		data: { pk },
		success: (res) => {
			let { data } = res;
			if (data.hint) {
				toast({ color: 'warning', content: res.data.hint });
			}else{
				this.setState({
					showNtbDetail: true,
					ntbdata: data
				})
			}
		}
	});
}



/////////////////////////////////////////////////////////////////////////

//生成确认
const gelConfirm = function (props) {
	listMultiOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, ITEM_INFO.PK, URL_INFO.COMMON.GENERATE, loadMultiLang(props, '36070APM--000030'), APP_INFO.DATA_SOURCE);/* 国际化处理： 生成*/
};

//删除确认
const delHeadConfirm = function (props) {
	listMultiOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, ITEM_INFO.PK, URL_INFO.COMMON.DELETE, loadMultiLang(props, '36070APM--000024'), APP_INFO.DATA_SOURCE);/* 国际化处理： 删除*/
			
};

/**
 * 联查单据
 */
const Linkb = function (props) {
	let linkquerybillData = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//数据校验
	if (linkquerybillData.length != 1) {
		toast({
			color: 'warning',
			content: loadMultiLang(props, '36070APM--000029')/* 国际化处理： 请选择单条数据，联查单据!*/
		});
		return;
	}
	//处理选择数据
	let showbilltrackpk;
	linkquerybillData.forEach((val) => {
		if (val.data.values.pk_apply && val.data.values.pk_apply.value) {
			showbilltrackpk = val.data.values.pk_apply.value;
		}
	});
	console.log(showbilltrackpk, 'billtrack_showbilltrackpk');			
	if (showbilltrackpk) {
		this.setState({
			showbilltrack: true,//显示联查单据
			showbilltracktype: '36D1',//单据类型
			showbilltrackpk: showbilltrackpk//单据pk
		});
	}
}
/**
 * 联查发票
 */
const LinkI =function (props) {
	if(CMPEableSscivm.call(this)){
		return ;
	};
	let reciptData = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	if (reciptData.length != 1) {
		toast({color: 'warning',content: loadMultiLang(props, '36070APM--000111')/* 国际化处理： 请选择单条数据，进行单据联查!*/});
		return;
	}
	this.setState({sscrpLinkInvoiceData:{ 
		'billId':reciptData[0].data.values.pk_apply.value, 
		'billCode':reciptData[0].data.values.vbillno.value, 
		'pk_org': reciptData[0].data.values.pk_org.value, 
		'tradetype':reciptData[0].data.values.pk_trantypecode.value, 
		'viewRandom': Math.random()}}) 
}

/**
 * 影响扫描
 * @param {*} props 页面内置对象
 */
const imageS = function (props) {
	if(CMPEableSscivm.call(this)){
		return ;
	};
	let ScanData = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	let openbillid = '';
	//数据校验
	if (ScanData.length != 1) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000028') });/* 国际化处理： 请选择1条数据*/
		return;
	}
	let billInfoMap = {};
	ScanData.forEach((val) => {
		openbillid = val.data.values.pk_apply.value;
		billInfoMap['pk_billid']= openbillid;
		billInfoMap['pk_billtype']= val.data.values.pk_billtypecode.value;				
		billInfoMap['pk_tradetype']=val.data.values.pk_trantypecode.value;
		billInfoMap['pk_org']= val.data.values.pk_org.value;
		billInfoMap['BillType']=val.data.values.pk_trantypecode.value;
		billInfoMap['BillDate']=val.data.values.creationtime.value;
		billInfoMap['Busi_Serial_No']=val.data.values.pk_apply.value;
		billInfoMap['OrgNo']=val.data.values.pk_org.value;
		billInfoMap['BillCode']=val.data.values.vbillno.value;
		billInfoMap['OrgName']=val.data.values.pk_org.value;
		billInfoMap['Cash']=val.data.values.applysum.value;
	});
	imageScan(billInfoMap, 'iweb');
}

/**
 * 影响查看
 * @param {*} props 页面内置对象
 */
const imageC = function (props) {
	if(CMPEableSscivm.call(this)){
		return ;
	};
	let showData = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//数据校验
	if (showData.length != 1) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000028') });/* 国际化处理： 请选择1条数据*/
		return;
	}
	let billShowInfoMap = {};
	let openShowbillid;
	showData.forEach((val) => {
		openShowbillid = val.data.values.pk_apply.value;  
		billShowInfoMap['pk_billid']= openShowbillid;
		billShowInfoMap['pk_billtype']= val.data.values.pk_billtypecode.value;
		billShowInfoMap['pk_tradetype']=val.data.values.pk_trantypecode.value;;
		billShowInfoMap['pk_org']= val.data.values.pk_org.value;;
	});
	imageView(billShowInfoMap,  'iweb');
}

const copyBill = function (props) {		
	let selectData = getSelectOneData(props);
    if (!selectData) {
        return;
    }
    let id = selectData && selectData.data && selectData.data.values && selectData.data.values[ITEM_INFO.PK] && selectData.data.values[ITEM_INFO.PK].value;
	let ts = selectData && selectData.data && selectData.data.values && selectData.data.values[ITEM_INFO.TS] && selectData.data.values[ITEM_INFO.TS].value;		
	let vsourcebustype = selectData[0] && selectData[0].data && selectData[0].data.values && selectData[0].data.values.sourcesystypecode && selectData[0].data.values.sourcesystypecode.value;
	if (vsourcebustype && vsourcebustype != 3) {
		toast({
			'color': 'warning',
			'content': loadMultiLang(props, '36070APM--000006')/* 国际化处理： 外系统生成的单据不允许进行复制*/
		});
		return;
	}
	go2CardCheck({
		props,url:URL_INFO.LIST.LIST2CARD_CHECK,pk:id,ts:ts,fieldPK:ITEM_INFO.PK,actionCode:null,permissionCode:null,checkSaga:false,checkTS:true,go2CardFunc:()=>{
			go2card(props, { status: SHOW_MODE.COPY, id,ts, from: 'list' }, this.getState.bind(this));
		}
	});	
}

const linkWhx = function (props) {
	let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length != 1) {
		toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let pk = selectDatas[0].data.values[ITEM_INFO.PK].value;
	if (!pk) {
		return;
	}
	ajax({
		url: URL_INFO.COMMON.LINKWH,
		data: { pk },
		success: (res) => {
			let { data } = res.data;
			cacheTools.set('36D1linkF1', res.data[0]);
			props.openTo(URL_INFO.LINK_PAGE, {
				appcode: res.data[1],
				pagecode: '20080PBM_LIST'
			});
		}
	});
}


//获取选中的一条数据（没有选中或者不止一条会返回空）
const getSelectOneData = function (props) {
    let selectDatas = props.table.getCheckedRows(LIST_PAGE_INFO.TABLE_CODE);
    if (!selectDatas || selectDatas.length != 1) {
        toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025')/* 国际化处理： 请选中一行数据！*/ });
        return false;
    }
    return selectDatas[0];
}

function aa(obj) {
	let o = {};
	for (let item of Object.keys(obj)) {
		if (obj[item] && typeof obj[item] === 'object') {
			o[item] = aa(obj[item]);
		} else if (obj[item] || obj[item] === 0) {
			o[item] = obj[item];
		}
	}
	return o;
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/