/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { pk_name,card_page_id, list_page_id, list_search_id, list_table_id,app_code,openaccountapplyCacheKey,searchArea,dataSourceTam,gotocardcheck } from '../../cons/constant.js';
import { ajax, toast,print,cardCache,promptBox } from 'nc-lightapp-front';
let { getDefData } = cardCache;
import { setPropCache, go2CardCheck, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {
	requesturl
} from '../../cons/requesturl.js';
import  buttonUsability  from './buttonUsability';
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';

export default function buttonClick(props, id) {
    switch (id) {
        //联查利率
        case 'Linkrate':
            let link_rateData = props.table.getCheckedRows(this.tableId);
            let pk_ratecode = link_rateData[0].data.values.pk_ratecode.value;
            link_rateData.forEach((val) => {
                if (val.data.values.pk_ratecode && val.data.values.pk_ratecode.value) {
                    pk_ratecode = val.data.values.pk_ratecode .value;
                }
            });

            if(!pk_ratecode){
                toast({color:"warning",content:this.state.json['36340AIAC-000008']})/* 国际化处理： 暂无数据*/
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
        
        case 'Print':
            printAll.call(this, props);
            break;
        //输出
        case 'Output':
            outputAll.call(this, props);
            break;
        case 'Refresh': 
            refreshHtml.call(this, props);
            break;
        case 'Add':
            this.addQueryCache();
            props.pushTo('/card',{
                status:'add',
                pagecode: card_page_id
            })
            break;
        //表头删除
        case 'Delete':
            promptBox({
                color: "warning",
                title: loadMultiLang(props, '36340AIAC-000023'),/* 国际化处理： 删除*/
                content: loadMultiLang(props, '36340AIAC-000067'),/* 国际化处理： 确认要删除吗?*/
                beSureBtnClick: delHeadConfirm.bind(this, props)
            });	
            break;
        case 'Copy':			
            let copyData = props.table.getCheckedRows(list_table_id);
            let copyid = 0;
            copyData.forEach((val) => {
                copyid = val.data.values.pk_accintobj.value;
              
            });
            this.addQueryCache();
            go2CardCheck({
                props,
                url: gotocardcheck,
                pk: copyData[0].data.values[pk_name].value,
                ts: copyData[0].data.values["ts"].value,
                checkTS: copyData[0].data.values["ts"].value ? true : false,
                fieldPK: pk_name,
                go2CardFunc: () => {
                    props.pushTo('/card', {
                        status: 'copy',
                        id: copyid,
                        source: 'list',
                        pagecode: card_page_id
                    });
                }
            })
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
		toast({ color: 'warning', content: loadMultiLang(props, '36340AIAC-000039') });/* 国际化处理： 请选中一行数据！*/
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
		toast({ color: 'warning', content: loadMultiLang(props, '36340AIAC-000039') });/* 国际化处理： 请选中一行数据！*/
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
        toast({ color: 'warning', content: loadMultiLang(props, '36340AIAC-000039') });/* 国际化处理： 请选中一行数据！*/
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


//删除确认
const delHeadConfirm = function (props) {
	listMultiOperator(props, list_page_id, list_table_id, pk_name, requesturl.delete, loadMultiLang(props, '36340AIAC-000023'), dataSourceTam);/* 国际化处理： 删除*/
};


//刷新列表信息
const refreshHtml = function (props) {
    let that = this;
    let refreshsearchVal = getDefData(searchArea, openaccountapplyCacheKey);
    //分页
    let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
    refreshpageInfo.pageIndex = 0;
    //查询condition
    if(!refreshsearchVal){
        refreshsearchVal = props.search.getAllSearchData(list_search_id);
    }
    let queryInfo = props.search.getQueryInfo(list_search_id);
    let oid = queryInfo.oid;
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
                        title: that.state.json['36340AIAC-000053'],/* 国际化处理： 刷新成功！*/
                        color: 'success'
                    })
                }
                buttonUsability.call(that, props, null)
            }
        });
    }    
}



/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/