/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { printnodekey_offical,printnodekey_inoffical,aggvo,pk_name,card_page_id, list_page_id, list_search_id, list_table_id,app_code,openaccountapplyCacheKey,searchArea,dataSourceTam,card_from_id } from '../../cons/constant.js';
import { ajax, toast,print,cardCache,promptBox,output } from 'nc-lightapp-front';
let { getDefData } = cardCache;
import { setPropCache, getPropCache, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { elecSignListPrint } from "../../../../../tmpub/pub/util";
import {
	requesturl
} from '../../cons/requesturl.js';
import  buttonUsability  from './buttonUsability';
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
export default function buttonClick(props, id) {
    switch (id) {
        //联查利率
        case 'Linkrate':
            let link_rateData = props.table.getCheckedRows(this.tableId);
            let pk_ratecode;
            if (link_rateData.length != 1) {
                toast({
                    color: 'warning',
                    content: this.state.json['36340CDIR-000039']/* 国际化处理： 请选择1条数据*/
                });
                return;
            }
            link_rateData.forEach((val) => {
                if (val.data.values.pk_ratecode && val.data.values.pk_ratecode.value) {
                    pk_ratecode = val.data.values.pk_ratecode.value;
                }
            });

            if(!pk_ratecode){
                toast({color:"warning",content:this.state.json['36340CDIR-000008']})/* 国际化处理： 暂无数据*/
                break;
            }

            ajax({
                url: requesturl.ratelink, 
                data: {
                    pk: pk_ratecode
                },
                success: (res) => {
                    let linkpath,appcode,pagecode;
                    if(res.data.rateclass=='2'){
                        linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                        appcode = '36010IRC',
                        pagecode = '36010IRC_card'
                    }else if(res.data.rateclass=='1'){
                        linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                        appcode = '36010IRCG',
                        pagecode = '36010IRCG_card'
                    }else if(res.data.rateclass=='0'){
                        linkpath = '/tmpub/pub/interestrate_org/main/#/card',
                        appcode = '36010IRCO',
                        pagecode = '36010IRCO_card'
                    }
                    props.openTo(linkpath, {
                        appcode: appcode,
                        pagecode: pagecode,
                        status: 'browse',
                        // islinkquery: true,
                        scene: "linksce",
                        id:pk_ratecode
                    });
                }
            });
           
            break;
        //联查凭证
        case 'Linkvoucher':
            let link_selectedData = props.table.getCheckedRows(this.tableId)[0];
            let pk_intlist=link_selectedData.data.values.pk_intlist.value;
            let link_bill_no=link_selectedData.data.values.vbillno.value;
            let trade_type=link_selectedData.data.values.pk_billtype.value;
            let isvoucher=link_selectedData.data.values.isvoucher.value;
			if(!isvoucher){
				toast({
					color: 'warning',
					content: this.state.json['36340CDIR-000062']/* 国际化处理： 请选择1条数据*/
				});
				return;
			}
			linkVoucherApp(props, pk_intlist, aggvo, app_code, trade_type, link_bill_no);
            break;
        //记账
        case 'Tally':
            tallyHeadConfirm.call(this, props);
            break;
        //取消记账
        case 'UnTally':
            unTallyHeadConfirm.call(this, props);
            break;
        case 'Print':
            printAll.call(this, props);
            break;
        case 'Printlist':
            printAllList.call(this, props);
            break;
        //输出
        case 'Output':
            outputAll.call(this, props);
            break;
        //补充打印
        case 'ElecsigninPreview':
            elecSignPrint.call(this,props, false);
            break;
        //正式打印
        case 'OfficialPrint':
            elecSignPrint.call(this , props, true);
            break;
        case 'Refresh': 
            refreshHtml.call(this, props);
            break;
        
    }
}

//记账
const tallyHeadConfirm = function (props) { 
    listMultiOperator(props, list_page_id, list_table_id, pk_name, requesturl.tally,this.state.json['36340CDIR-000066'], dataSourceTam);/* 国际化处理：记账成功*/
};

//取消记账
const unTallyHeadConfirm = function (props) {
	listMultiOperator(props, list_page_id, list_table_id, pk_name, requesturl.untally, this.state.json['36340CDIR-000067'], dataSourceTam);/* 国际化处理： 取消记账成功*/
};

//电子签章打印
const elecSignPrint = function (props, offical) {
    let nodekey;
    if(offical){
        nodekey = printnodekey_offical;
    }else{
        nodekey = printnodekey_inoffical;
    }
    elecSignListPrint(props, {
        url: requesturl.elecsignprint,
        offical,
        appCode: app_code,
        nodeKey: nodekey,
        tableCode: list_table_id,
        field_id: pk_name,
        field_billno: 'vbillno',
        validateFunc: (selectData) => {
            // let billstatus = selectData && selectData.data && selectData.data.values && selectData.data.values[cons.field.billstatus] && selectData.data.values[cons.field.billstatus].value;
            // if (cons.state.billstate.payok != billstatus) {
            //     return loadMultiLang(props, '36300DC-000008')/** 单据状态非转账成功！ */;
            // }
            // return null;
        }
    })
}

/**
 * 打印
 * @param {*} props 页面内置对象
 */
const printAll = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(props, '36340CDIR--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let index = 0;
	let oids = [];
	let id;
	while (index < selectDatas.length) {
		id = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pk_name] && selectDatas[index].data.values[pk_name].value;
		if (!id) {
			continue;
		}
		oids.push(id);
		index++;
	}
	if (oids.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(props, '36340CDIR--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	print(
		'pdf',
		requesturl.print,
		{
			nodekey: 'CARD',
			appcode: app_code,
			oids
		}
	);
}


/**
 * 打印
 * @param {*} props 页面内置对象
 */
const printAllList = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(props, '36340CDIR--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	let index = 0;
	let oids = [];
	let id;
	while (index < selectDatas.length) {
		id = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pk_name] && selectDatas[index].data.values[pk_name].value;
		if (!id) {
			continue;
		}
		oids.push(id);
		index++;
	}
	if (oids.length == 0) {
		toast({ color: 'warning', content: loadMultiLang(props, '36340CDIR--000025') });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	print(
		'pdf',
		requesturl.print,
		{
			nodekey: 'LIST',
			appcode: app_code,
			oids
		}
	);
}

/**
 * 输出全部
 * @param {*} props 
 */
const outputAll = function (props) {

    
    let outputData = props.table.getCheckedRows(list_table_id);
    if (outputData.length < 1) {
        toast({ color: 'warning', content: loadMultiLang(props, '36340CDIR--000025') });/* 国际化处理： 请选中一行数据！*/
        return;
    }
    let pkos = [];
    outputData.forEach((item) => {
        pkos.push(item.data.values[pk_name].value);
    });
    this.setState(
        {
            outputData: {
                // funcode: jsondata.funcode, //功能节点编码，即模板编码
                nodekey: 'LIST', //模板节点标识
                appcode: app_code,
                // printTemplateID: jsondata.printTemplateID, //模板id
                oids: pkos,
                outputType: 'output'
            }
        },
        () => {
            this.refs.printOutput.open();
        }
    );
  
	
}



 

//刷新列表信息
const refreshHtml = function (props) {
    let that = this;
    let oid;
    if (props.meta.getMeta()[list_search_id].oid) {
        oid = props.meta.getMeta()[list_search_id].oid;//动态获取oid
    }
    let refreshsearchVal = getDefData(searchArea, openaccountapplyCacheKey);
    //分页
    let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
    
    //查询condition
    if(!refreshsearchVal){
        return ;
        // toast({
        //     duration: 3,
        //     title: that.state.json['36340CDIR-000053'],/* 国际化处理： 刷新成功！*/
        //     color: 'success'
        // })
        // refreshsearchVal = props.search.getAllSearch
        // Data(list_search_id);
    }
    refreshpageInfo.pageIndex = 0;
    // let queryInfo = props.search.getQueryInfo(list_search_id);
    // let oid = queryInfo.oid;
    if (refreshsearchVal) {
        let data = {
            querycondition: refreshsearchVal,
            custcondition: {
                logic: "and",   //逻辑操作符，and、or
                conditions: [
                ],
            },
            pageInfo: refreshpageInfo,
            //pageInfo: null,
            pagecode: list_page_id,
            queryAreaCode: list_search_id,  //查询区编码
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'

        };
        ajax({
            url: requesturl.query,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData(list_table_id, data[list_table_id]);
                    } else {
                        props.table.setAllTableData(list_table_id, { rows: [] });
                    }
                    toast({
                        duration: 3,
                        title: that.state.json['36340CDIR-000053'],/* 国际化处理： 刷新成功！*/
                        color: 'success'
                    })
                }
                buttonUsability.call(that, props, null)
            }
        });
    }    
}



/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/