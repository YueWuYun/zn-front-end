/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print,output, cardCache,promptBox } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import { setDefData,deleteCacheDataForList, getDefData } from '../../../../../tmpub/pub/util/cache';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import {  loadMultiLang,go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { listMultiOperator } from '../../busbutton/listOperation';
import { buttonVisible } from './buttonVisible';
let { pageCodeCard, tableId,base_url,nodekey, searchId,app_code, gotocardcheck, moudleId, formId,pageCodeList ,dataSource,search_key,pkname} = CONSTANTS;
export default function buttonClick(props, id) {
    switch (id) {
        //头部新增
        case 'Add':
            props.pushTo('/card', {
                pagecode: pageCodeCard,
                status: 'add',
            });
            break;
        //修改
        case 'Edit':
            let editData = searchdata.call(this, props);
            editBill.call(this,props,editData); 
            break;
        //头部删除
        case 'Delete':
            let delData = searchdata.call(this, props);
            promptBox({
                color: "warning",
                title: loadMultiLang(props, '36140NDSR-000015'),/* 国际化处理： 删除*/
                content: loadMultiLang(props, '36140NDSR-000013'),/* 国际化处理： 确认要删除吗?*/
                beSureBtnClick:  delBill.bind(this,props,delData)
            });
            break;
        //头部 复制
        case 'Copy':
            let copyData = searchdata.call(this, props);
            copyBill.call(this,props,copyData);
            break;
        case 'Tally':// 记账
			tallyHeadConfirm.call(this, props);
            break;
        case 'UnTally':// 取消记账
            UntallyHeadConfirm.call(this, props);
			break;
        //头部 刷新
        case 'Refresh':
            refreshHtml.call(this, props);
        break;
       
        //附件管理
        case 'File':
            fileMgr.call(this, props);
            break;
        // 联查存单
        case 'Depositreceipt':
            let linkData = searchdata.call(this, props);
			let depositcode = linkData[0].data.values.pk_depositreceipt.value;
			if(!depositcode){
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
				this.props.openTo('/ifac/factimedepositmanage/depositreceipt/main/index.html#/card/index.html', 
				{
					srcFunCode:'36140RFD',
					appcode: '36140FDLB',
					pagecode: '36140FDLB_C01',
					status: 'browse',
					islinkquery: true,
					id:depositcode,
					scene: "linksce"
				});
			}
            break;
        // 审批意见
        case 'ApproveInfo':
            break;
        // 联查凭证
        case 'Linkingupvoucher':
			let voucherData = searchdata.call(this, props);
			if (voucherData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000018') //{/* 国际化处理： 未查询出符合条件的数据！*/} /* 国际化处理： 请选择一行进行操作！*/
				});
				return;
			}
            let pk_fixeddatewithdraw,billnov,pk_groupv,pk_orgv;
            let billtype='36E2';
			//处理选择数据
			voucherData.forEach((val) => {
				pk_fixeddatewithdraw = val.data.values.pk_fixeddatewithdraw.value;
				billnov = val.data.values.vbillcode.value;
				pk_groupv = val.data.values.pk_group.value;
                pk_orgv = val.data.values.pk_org.value;
			});
			linkVoucherApp(
				this.props,
				pk_fixeddatewithdraw,
				pk_groupv,
				pk_orgv,
				billtype,
				billnov,
			);
            break;
        case 'Interestlist':// 联查单位内部利息清单,待利息清单完成之后，做适配
            let link_Data = searchdata.call(this, props);
            let pk_depositreceipt;
            link_Data.forEach((val) => {
                pk_depositreceipt = val.data.values.pk_depositreceipt.value;
            });
            interlistLink.call(this,props,pk_depositreceipt);
			break;
        // 打印
		case 'PrintBtn':
            let printData = searchdata.call(this, props);
            let pks = [];
            printData.forEach((vale) => {
                pks.push(vale.data.values.pk_fixeddatewithdraw.value);
            });
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                base_url + 'FDWDWPrintaction.do',
                {
                    appcode: app_code,
                    nodekey: nodekey,//模板节点标识
                    oids: pks
                }
            );
            break;
        // 输出
        case 'Output':
            let outputData = props.table.getCheckedRows(tableId);
            let outputpks = [];
            outputData.forEach((item) => {
                outputpks.push(item.data.values.pk_fixeddatewithdraw.value);
            });
            output({
                url: base_url+'FDWDWPrintaction.do',
                data: {
                    nodekey: nodekey,
                    appcode: app_code,
                    oids: outputpks,
                    outputType: 'output'
                }
            });
            break;
        }
    }
/* 联查利息清单
* @param {*} props 
* @param {*} pk 
* @param {*} pk_org 
*/
const interlistLink = function(props,pk){
    let linkpath;
    ajax({
        url: requesturl.checklist, 
        data: {
            "pks": [pk]
        },
        success: (res) => {
            if(res.data=='0'){
                toast({
                    color: 'warning',
                    content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000012'), //{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            }else if(res.data=='1'){
                linkpath = '/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/card'
                props.openTo(linkpath, {
                    appcode: '36140FDIB',
                    pagecode: '36140FDIB_C01',
                    islinkquery: true,
                    pks:pk,
                    type:'intercard',
                });
            }else{
                linkpath = '/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/list'
                props.openTo(linkpath, { 
                    appcode: '36140FDIB',
                    pagecode: '36140FDIB_L01',
                    islinkquery: true,
                    pks:pk,
                    type:'interlist'
                });
            }
            //    else{
            //        linkpath = 'ifac/facinterestdeal/bankregularinterestbill/main/index.html#/list'
            //        props.openTo(linkpath, { 
            //            appcode: '36140FDIB',
            //            pagecode: '36140FDIB_L01',
            //            islinkquery: true,
            //            pks:pk,
            //            type:'interlist',
            //            org:pk_org
            //        });
            //    }
        }
    })  
}


const searchdata = function(props) {
    let selectdata = props.table.getCheckedRows(tableId);
    //数据校验
    if (selectdata.length == 0) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36140NDSR-000045") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000045'),/* 国际化处理： 请选中一行数据！*/
        });
        return;
    }
    return selectdata;
};
/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
    let selectDatas = props.table.getCheckedRows(tableId);
    //判断是否有选中行
    let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkname] && selectDatas[0].data.values['pk_fixeddatewithdraw'].value;
    let billNO = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillcode'] && selectDatas[0].data.values['vbillcode'].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billID,
        billNO
    });
}
//刷新列表信息
const refreshHtml = function (props) {
    let that = this;
    let searchVal = getDefData(dataSource, search_key);
    // 分页
    let pageInfo = props.table.getTablePageInfo(tableId);
    pageInfo.pageIndex = 0;
    //查询condition
    if(!searchVal){
        searchVal = props.search.getAllSearchData(searchId);
    }
    let queryInfo = props.search.getQueryInfo(searchId);
    let oid = queryInfo.oid;
    if (searchVal) {
        let data = {
            querycondition: searchVal,
            conditions: searchVal,
            pageInfo: pageInfo,
            pageCode: pageCodeList,
            queryAreaCode: searchId,
            oid: oid,
            querytype: 'tree'
        };
        ajax({
            url: requesturl.query,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                    toast({
                        duration: 3,
                        title:this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000037'),/* 国际化处理： 刷新成功！*/
                        color: 'success'
                    })
                }
                // buttonUsability.call(that, props, null)
            }
        });
    }    
}
// 修改
const editBill = function (props,record) {
    let pkMapTs = {};
    let pk = record.rows[0].values['pk_fixeddatewithdraw'].value;
    let ts = record.rows[0].values['ts'].value;
    pkMapTs[pk] = ts;
    ajax({
        url: base_url + 'FDWDWEditAction.do',
        data: {
            pk,
            pkMapTs,
            pageCode: pageCodeCard
        },
        success: (res) => {
            if (res) {
              this.props.setUrlParam({
                              status: 'edit'
              });
              this.toggleShow();
            }
        }
    })
    //this.setState({pageinfo:false});
  }
  /**
 * 删除数据
 */
 
const delBill = function (props,record) {
    let extParam={btncode:"Delete",pageCode:"36140NDSR_L01"};
    let requrl = base_url + 'FDWDWDeleteaction.do';
    // let multiLang = this.props.MutiInit.getIntl(app_code);
    // listMultiOperator(props, pageCodeList, tableId, pkname, requrl, multiLang.get('36140NDSR-000063'),dataSource,extParam);/* 国际化处理： 删除*/
    //author:fanyzhc begin
    let multiLang = this.props.MutiInit.getIntl(app_code);
    listMultiOperator(
        props, 
        pageCodeList, 
        tableId,
        pkname, 
        requrl, 
        multiLang.get('36140NDSR-000015'),
        dataSource,
        null,
        extParam);/* 国际化处理： 删除*/
    buttonVisible.call(this,this.props);
    //end
}
/**
 * 修改加载数据
 */
const copyBill = function (props,record) {
    let pk1 =record[0].data.values['pk_fixeddatewithdraw'].value;
    let pkorg=record[0].data.values['pk_org'].value;
    let orgname=record[0].data.values['pk_org'].display;
    let billstate=record[0].data.values['billstate'].value
    go2CardCheck({
        props,
        url: gotocardcheck,
        pk: record[0].data.values['pk_fixeddatewithdraw'].value,
        ts: record[0].data.values['ts'].value,
        checkTS:  record[0].data.values['ts'].value ? true : false,
        fieldPK: pkname,
        go2CardFunc: () => {
            props.pushTo('/card', {
                pagecode: pageCodeCard,
                status: 'add',
                id:pk1,
                pkorg,
                orgname,
                billstate,
                isCopy: 'copy'
            });
        }
    })
    //this.setState({pageinfo:false});
}

/**
 * 记账
 * @param {*} props 
 */
const tallyHeadConfirm = function (props) {
    let extParam={btncode:"Tally",pageCode:"36140NDSR_L01"};
    let requrl = base_url + 'FDWDWTallyAction.do';
    // let multiLang = this.props.MutiInit.getIntl(app_code);
    // listMultiOperator(props, pageCodeList, tableId, pkname, requrl, multiLang.get('36140NDSR-000049'),dataSource,null,extParam);/* 国际化处理：记账成功*/
    //this.props.MutiInit.getIntl(app_code).get('36140NDSR-000049'),dataSource)
    //author:fanyzhc begin
    let multiLang = this.props.MutiInit.getIntl(app_code);
    listMultiOperator(
        props, 
        pageCodeList, 
        tableId,
        pkname, 
        requrl, 
        multiLang.get('36140NDSR-000067'),
        dataSource,
        null,
        extParam);/* 国际化处理： 记账*/
    buttonVisible.call(this,this.props);
    //end
};

/**
 * 取消记账
 * @param {*} props 
 */
const UntallyHeadConfirm = function (props) {
    let extParam={btncode:"UnTally",pageCode:"36140NDSR_L01"};
    let requrl = base_url +'FDWDWUnTallyAction.do';
    let multiLang = this.props.MutiInit.getIntl(app_code);
    // listMultiOperator(props, pageCodeList, tableId, pkname, requrl, multiLang.get('36140NDSR-000064'),dataSource,null,extParam);/* 国际化处理：取消记账成功*/
    //author:fanyzhc begin
    // let multiLang = this.props.MutiInit.getIntl(app_code);
    listMultiOperator(
        props, 
        pageCodeList, 
        tableId,
        pkname, 
        requrl, 
        multiLang.get('36140NDSR-000068'),
        dataSource,
        null,
        extParam);/* 国际化处理： 取消记账*/
    buttonVisible.call(this,this.props);
    //end 
};
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/