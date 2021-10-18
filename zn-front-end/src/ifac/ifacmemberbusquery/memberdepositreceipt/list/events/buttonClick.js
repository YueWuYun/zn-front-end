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
        case 'File':
            fileMgr.call(this, props);
            break;

        //联查台账
        case 'Account':
            let link_accountData_regular = props.table.getCheckedRows(this.tableId);
            let pk_depositreceipt = link_accountData_regular[0].data.values.pk_srcbill ? link_accountData_regular[0].data.values.pk_srcbill.value : null;
            if (link_accountData_regular.length != 1) {
                // toast({
                //     color: 'warning',
                //     content: this.state.json['36341FDLQ-000039']/* 国际化处理： 请选择1条数据*/
                // });
                // return;
            }
            // link_accountData_regular.forEach((val) => {
            //     if (val.data.values.pk_srcbill && val.data.values.pk_srcbill.value) {
            //         pk_depositreceipt = val.data.values.pk_srcbill.value;
            //     }
            // });
            let data = {
                "pks": [pk_depositreceipt],
                "pageCode": "36341FNIB_L01"
            };
            let that = this;
            ajax({
                url: '/nccloud/ifac/memberjournal/querybydepositcodeaction.do',
                data: data,
                success: function (res) {
                    if(res.data != null){
                        props.openTo("/ifac/ifacmemberbusquery/memberjournal/main/index.html#/list", {
                            id: pk_depositreceipt,
                            status: 'browse',
                            appcode: "36341FNIB",
                            pagecode: "36341FNIB_L01",
                            scene: "linksce"
                        });
                    }else{
                        toast({
                            color: 'warning',
                            content: that.state.json['36341FDLQ-000068']
                        });
                        
                    }
            }
            });
            
            break;
        //联查活期利率
        case 'CurrentRate':
            let link_rateData_regular = props.table.getCheckedRows(this.tableId);
            let pk_aiacrate = link_rateData_regular[0].data.values.pk_aiacrate ? link_rateData_regular[0].data.values.pk_aiacrate.value : null;
            if (link_rateData_regular.length != 1) {
                // toast({
                //     color: 'warning',
                //     content: this.state.json['36341FDLQ-000039']/* 国际化处理： 请选择1条数据*/
                // });
                // return;
            }
            // link_rateData_regular.forEach((val) => {
            //     if (val.data.values.pk_aiacrate && val.data.values.pk_aiacrate.value) {
            //         pk_aiacrate = val.data.values.pk_aiacrate.value;
            //     }
            // });

            if(!pk_aiacrate){
                toast({color:"warning",content:this.state.json['36341FDLQ-000008']})/* 国际化处理： 暂无数据*/
                break;
            }

            ajax({
                url: requesturl.ratelink, 
                data: {
                    pk: pk_aiacrate
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
                        id:pk_aiacrate
                    });
                }
            });
            break;
        //联查定期利率
        case 'RegularRate':
            let link_rateData = props.table.getCheckedRows(this.tableId);
            let pk_depostrate = link_rateData[0].data.values.pk_depostrate ? link_rateData[0].data.values.pk_depostrate.value : null;
            if (link_rateData.length != 1) {
                // toast({
                //     color: 'warning',
                //     content: this.state.json['36341FDLQ-000039']/* 国际化处理： 请选择1条数据*/
                // });
                // return;
            }
            // link_rateData.forEach((val) => {
            //     if (val.data.values.pk_depostrate && val.data.values.pk_depostrate.value) {
            //         pk_depostrate = val.data.values.pk_depostrate.value;
            //     }
            // });

            if(!pk_depostrate){
                toast({color:"warning",content:this.state.json['36341FDLQ-000008']})/* 国际化处理： 暂无数据*/
                break;
            }

            ajax({
                url: requesturl.ratelink, 
                data: {
                    pk: pk_depostrate
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
                        id:pk_depostrate
                    });
                }
            });
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
        
        case 'Refresh': 
            refreshHtml.call(this, props);
            break;
        
    }
}




/**
 * 打印
 * @param {*} props 页面内置对象
 */
const printAll = function (props) {
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	if (selectDatas == null || selectDatas.length == 0) {
		toast({ color: 'warning', content: this.state.json['36341FDLQ-000039'] });/* 国际化处理： 请选中一行数据！*/
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
		toast({ color: 'warning', content: this.state.json['36341FDLQ-000039'] });/* 国际化处理： 请选中一行数据！*/
		return;
	}
	print(
		'pdf',
		requesturl.print,
		{
			
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
		toast({ color: 'warning', content: this.state.json['36341FDLQ-000039'] });/* 国际化处理： 请选中一行数据！*/
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
		toast({ color: 'warning', content: this.state.json['36341FDLQ-000039'] });/* 国际化处理： 请选中一行数据！*/
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
        toast({ color: 'warning', content: this.state.json['36341FDLQ-000039'] });/* 国际化处理： 请选中一行数据！*/
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
                // nodekey: 'LIST', //模板节点标识
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
    let refreshsearchVal = getDefData(searchArea, openaccountapplyCacheKey);
    //分页
    let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
    
    //查询condition
    if(!refreshsearchVal){
        // toast({
        //     duration: 3,
        //     title: that.state.json['36341FDLQ-000053'],/* 国际化处理： 刷新成功！*/
        //     color: 'success'
        // })
        // refreshsearchVal = props.search.getAllSearchData(list_search_id);
    }
    refreshpageInfo.pageIndex = 0;
    let queryInfo = props.search.getQueryInfo(list_search_id);
    let oid = queryInfo.oid;
    if (refreshsearchVal && oid != null) {
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
                        title: that.state.json['36341FDLQ-000053'],/* 国际化处理： 刷新成功！*/
                        color: 'success'
                    })
                }
                buttonUsability.call(that, props, null)
            }
        });
    }    
}

/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
    let that = this;
	let selectDatas = props.table.getCheckedRows(list_table_id);
	//判断是否有选中行
	// if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
	// 	toast({ color: 'warning', content: that.state.json['36341FDLQ-000039']});/* 国际化处理： 请选中一行数据！,请选中一行数据*/
	// 	return;
	// }
	let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_depositreceipt'] && selectDatas[0].data.values['pk_depositreceipt'].value;
	let billNO = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillcode'] && selectDatas[0].data.values['vbillcode'].value;
	that.setState({
		showUploader: !that.state.showUploader,
		billID,
        billNO,
        target:null,
	});
}



/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/