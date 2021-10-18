/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print,output,promptBox } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import { linkVoucherApp,linkApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import {  loadMultiLang,go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { buttonVisible } from './buttonVisible';
import { listMultiOperator } from '../../busbutton/listOperation';
let { pageCodeCard, tableId,base_url,nodekey,app_code,pageCodeList ,FixedWithDrawConst,pkname} = CONSTANTS;
export default function buttonClick(props, id, text, record,index) {
    let extParam;
    switch (id) {
        
        //头部新增
        case 'Add':
            props.pushTo('/card', {
                pagecode: pageCodeCard,
                status: 'add'
            });
            break;
        //头部删除
        case 'Delete':
            promptBox({
                color: "warning",
                title: loadMultiLang(props, '36340FDW-000015'),/* 国际化处理： 删除*/
                content: loadMultiLang(props, '36340FDW-000013'),/* 国际化处理： 确认要删除吗?*/
                beSureBtnClick: delBill.bind(this, props)
            });
            break;
        //头部 复制
        case 'Copy':
            let copyData = searchdata.call(this, props)[0];
            go2CardCheck({
                props,
                url: base_url + 'FDWgotocardcheck.do',
                pk: copyData.data.values['pk_fixeddatewithdraw'].value,
                ts: copyData.data.values['ts'].value,
                fieldPK: pkname,
                actionCode:null,
                permissionCode:null,
                checkSaga : false,
                checkTS: copyData.data.values['ts'].value ? true : false,
                go2CardFunc: () => {
                    copyBill.call(this,props,copyData);
                }
            });
            break;
        //头部 刷新
        case 'Refresh':
            this.refresh();
            break;
        //头部 退回
        case 'Back':
            this.setState({ showModal: true });
            break;
        //表体 提交
        case 'Commit': 
            let CommitData = searchdata.call(this, props);
            extParam={btncode:"Commit",pagecode:"36340FDW_L01"};
            listMultiOperator(props, pageCodeList,tableId,pkname,base_url + 'FDWDWCommitAction.do', loadMultiLang(this.props, '36340FDW-000011'),FixedWithDrawConst.dataSource,true,extParam, (props, data) => {
                    if (!data) {
                        return;
                    }    
                    if (Array.isArray(data)) {
                        data = data[0];
                    }
                    let { workflow } = data;
                    //有指派信息，则指派，没有则重绘界面
                    if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                        this.setState({
                            assignData: data,
                            assignShow: data,
                            index: CommitData[0].index,
                            ts:  CommitData[0].data.values['ts'],
                            billID:  CommitData[0].data.values['pk_fixeddatewithdraw'],
                            extParam:extParam
                        });
                    }else{
                        buttonVisible.call(this,this.props);
                    }
                });/* 国际化处理： 删除*/
            break;
        //收回
        case 'UnCommit':
            extParam={btncode:"UnCommit",pagecode:"36340FDW_L01"};
            listMultiOperator(props, pageCodeList,tableId,pkname,base_url + 'FDWDWUnCommitAction.do', loadMultiLang(this.props, '36340FDW-000017'),FixedWithDrawConst.dataSource,null,extParam);/* 国际化处理： 收回*/
            buttonVisible.call(this,this.props);
            break;
        //附件管理
        case 'File':
            fileMgr.call(this, props);
            break;
        // 联查存单
        case 'LinkDespositBill':
            let linkData = searchdata.call(this, props);
			let depositcode = linkData[0].data.values.pk_depositreceipt.value;
			if(!depositcode){
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36340FDW-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
			} else {
				this.props.openTo('/ifac/ifactimedepositmange/depositreceipt/main/index.html#/card', 
				{
					srcFunCode:'36340RFD',
					appcode: '36340FDLB',
					pagecode: '36340FDLB_C01',
					status: 'browse',
					islinkquery: true,
					id:depositcode,
					scene: "linksce"
				}); 
			}
            break;
        // 联查审批意见
        case 'AppRoveIdea':
            let approveData = searchdata.call(this, props);
            let pk = approveData[0].data.values.pk_fixeddatewithdraw.value;
            if (!pk) {
                toast({ color: 'warning', content: loadMultiLang(this.props, '36340FDW-000035') });/* 国际化处理： 选中数据主键为空！*/
            }
			this.setState({ 
                showApproveDetail: true,
                billID: pk
            })
            break;
        // 联查凭证
        case 'queryVoucher':
            let voucherData = searchdata.call(this, props);
			// if (voucherData.length != 1) {
			// 	toast({
			// 		color: 'warning',
			// 		content:loadMultiLang(this.props, '36340FDW-000018') //{/* 国际化处理： 未查询出符合条件的数据！*/} /* 国际化处理： 请选择一行进行操作！*/
			// 	});
			// 	return;
            // }
            let pk_fixeddatewithdraw = voucherData[0].data.values.pk_fixeddatewithdraw.value;
            let billnov = voucherData[0].data.values.vbillcode.value;
            let pk_groupv = voucherData[0].data.values.pk_group.value;
            let pk_orgv = voucherData[0].data.values.pk_org.value;
            let voucherflag = voucherData[0].data.values.voucherflag.value;
            let billtype='36L2';
            if(!voucherflag){
                toast({color:"warning",content:loadMultiLang(this.props, '36340FDW-000039')}) 
                return;
            }
            linkVoucherApp.call(this,this.props,pk_fixeddatewithdraw,pk_groupv,pk_orgv,billtype,billnov);
            break;
        // 联查支取申请
        case 'linkapplybill':
            let linkapply_Data = searchdata.call(this, props);
            let pk_srcbill =linkapply_Data[0].data.values['pk_srcbill'].value;
            if(!pk_srcbill){
                toast({
                    color: 'warning',
                    content: loadMultiLang(this.props, '36340FDW-000034')
                });
                return;
            }else {
                this.props.openTo('/ifac/ifacmemberbusdeal/fixeddatewithdrawapply/main/index.html#/card', 
                {
                  srcFunCode:'36340FDWA',
                  appcode: '36340FDWA',
                  pagecode: '36340FDWA_C01',
                  status: 'browse',
                  islinkquery: true,
                  id:pk_srcbill,
                  scene: "linksce"
                });
              }
            break;
        case 'queryIntList':// 联查单位内部利息清单,待利息清单完成之后，做适配
            let link_Data = searchdata.call(this, props);
            // if (link_Data.length != 1) {
            //     toast({
            //         color: 'warning',
            //         content: loadMultiLang(this.props, '36340FDW-000018')
            //     });
            //     return;
            // }
        
            let pk_fixeddatewithdraw_1=link_Data[0].data.values[pkname].value;;
            interlistLink.call(this,this.props,pk_fixeddatewithdraw_1);
            break;
        // 打印
		case 'Printbtn':
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
        case 'output':
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
        //头部 生成下拨单
        case 'toAllocate':

            let formdata = searchdata.call(this, props);
			let sourceid = formdata[0].data.values.pk_fixeddatewithdraw.value;//来源主键          
			if(!sourceid){
				toast({
					color: 'warning',
					content:loadMultiLang(this.props, '36340FDW-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
				});
                return;
			} 
            ajax({
                url: `/nccloud/ifac/fixeddatewithdraw/FDWToAllocateCheck.do`,
                data: {
                    "pks": [sourceid],
                 },
                success: (res) => {
                    if (res.success) {
                    this.props.openTo('/sf/allocation/allocate/main/index.html#/card', 
                        {
                            srcFunCode:'36320FA',
                            appcode: '36320FA',
                            pagecode: '36320FA_C01',                   
                            status: 'add',
                            sourceid:sourceid
                        });
                    }
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
           "pks": [pk],
        },
        success: (res) => {
            if(res.data){
                linkpath = '/ifac/ifacinterestdeal/centerinterestbill/main/#/card'
                props.openTo(linkpath, {
                    appcode: '36340FDIB',
                    pagecode: '36340FDIB_C01',
                    islinkquery: true,
                    status:'browse',
                    id:res.data,
                });
            }else{
                toast({
                    color: 'warning',
                    content: loadMultiLang(this.props, '36340FDW-000012'), //{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            }
        }
    })  
}
const searchdata = function(props) {
    let selectdata = props.table.getCheckedRows(tableId);
    //数据校验
    if (selectdata.length == 0) {
        toast({
            color: 'warning',
            content:loadMultiLang(this.props, '36340FDW-000029'),/* 国际化处理： 请选中一行数据！*/
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
    let billID = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[pkname] && selectDatas[0].data.values['pk_fixeddatewithdraw'].value;
    let billNO = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['vbillcode'] && selectDatas[0].data.values['vbillcode'].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billID,
        billNO
    });
}
/**
 * 删除数据
 */
const delBill = function (props,record) {
    listMultiOperator(
        props, 
        pageCodeList, 
        tableId,
        pkname, 
        base_url+'FDWDWDeleteaction.do', 
        loadMultiLang(props, '36340FDW-000015'),
        FixedWithDrawConst.dataSource,);/* 国际化处理： 删除*/
    buttonVisible.call(this,this.props);
}
/**
 * 修改加载数据
 */
const copyBill = function (props,record) {
    let pk =record.data.values['pk_fixeddatewithdraw'].value;
    props.pushTo('/card', {
        pagecode: pageCodeCard,
        status: 'copy',
        id:pk,
        isCopy: 'copy'
    });
}

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/