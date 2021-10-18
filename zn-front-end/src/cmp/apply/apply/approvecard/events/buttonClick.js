/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, print, output, cardCache, promptBox ,cacheTools,viewModel} from 'nc-lightapp-front';      
//引入常量定义
import { APP_INFO, URL_INFO, CARD_PAGE_INFO, LIST_PAGE_INFO, SHOW_MODE, TEMPLATE_INFO, ITEM_INFO, MODULE_H_CMP,TRAN_LIST_PAGE_INFO } from '../../cons/constant.js';
import { initTemplate, pageInfoClick, bodyBtnVisible } from "./index";
import { afterEvent } from "./index"; 
//引入公共api
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator ,showTBBMsg} from '../../../../pub/utils/CMPButtonUtil';
//影像
import { imageScan, imageView } from 'sscrp/rppub/components/image';
//引入内转api
import { qryDataByPK,emptyView, loadNeedDealDataByPK, repaintView, loadData2Card, save ,edit ,addLineAction,delLineAction} from "../../util/index";
// ca
import Sign from '../../../../../tmpub/pub/util/ca'; 
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;

const bodyCodeMapBodyPKName = {};
bodyCodeMapBodyPKName[CARD_PAGE_INFO.BODY_CODE] = ITEM_INFO.BPK;

export const buttonClick = function (props, key, text, record, index) {
  let status = props.getUrlParam("status");
  let vsourcebustype = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'sourcesystypecode').value;
  let pk = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, ITEM_INFO.PK).value;
  let tradeType = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_trantypecode').value;
  let billno = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, ITEM_INFO.VBILLNO).value;
  let ts = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, ITEM_INFO.TS).value;
  let pkMapTs = {};
  pkMapTs[pk] = ts; 
  const _this = this;
  let pk_org = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org');
  let pk_group = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_group');
  let pk_currtype = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_currtype');
  let pk_supplier = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_supplier');
  let pk_acceptorg = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_acceptorg');
  const defaultRow = {
    'pk_org': pk_org,
    'pk_group': pk_group,
    'pk_currtype':pk_currtype,
    'pk_supplier':pk_supplier,
    'pk_acceptorg':pk_acceptorg    
  }
  let billdata = props.createMasterChildData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, CARD_PAGE_INFO.BODY_CODE);
  let selectDatas = props.table.getCheckedRows(CARD_PAGE_INFO.BODY_CODE);
  let saveObj = {};
  saveObj[CARD_PAGE_INFO.BODY_CODE] = 'cardTable';
  switch (key) {
    //头部 刷新
    case 'Refresh':
      qryDataByPK(props, pk);
      break;
    case 'Copy':
      copy(props);
      break;
    //头部编辑
    case 'Edit': 
      edit(props);
      // props.setUrlParam({
      //   status: 'edit',
      //   id: props.getUrlParam('id')
      // });      
      // afterEvent(props, CARD_PAGE_INFO.HEAD_CODE, 'edit');
      // repaintView(props);
      break;
    //头部取消
    case 'Cancel':      
      promptBox({
        color: "warning", 
        content: loadMultiLang(props, '36070APM--000007'),/* 国际化处理： 是否确认取消？*/
        beSureBtnClick: cancelConfirm.bind(this, props)
      })
      break;
    //头部删除
    case 'Delete':
      promptBox({
        color: "warning",
        content: loadMultiLang(props, '36070APM--000008'),/* 国际化处理： 是否确认删除？*/
        beSureBtnClick: delConfirm.bind(this, props)
      });
      break;
    //头部新增
    case 'Add': 
      add.call(this, props);
      break;
    //头部保存
    case 'Save':
      props.validateToSave(billdata, save.bind(this, props), saveObj, '');
      break;
    case 'SaveAdd':
      props.validateToSave(billdata, saveAdd.bind(this, props), saveObj, '');
      break;
    //保存提交
    case 'SaveCommit': 
      saveCommit.call(this, props);
      break;
    //提交
    case 'Commit':
      cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, bodyCodeMapBodyPKName, ITEM_INFO.PK, URL_INFO.COMMON.COMMIT, loadMultiLang(props, '36070APM--000009'),  APP_INFO.DATA_SOURCE, commitAssign.bind(this));      
      break;
    //收回
    case 'Uncommit':
      cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, bodyCodeMapBodyPKName, ITEM_INFO.PK, URL_INFO.COMMON.UNCOMMIT, loadMultiLang(props, '36070APM--000010'), APP_INFO.DATA_SOURCE, repaintView.bind(this, props));
      break;
    //头部 附件
    case 'Filedoc':
      this.setState({
        billID: pk,
        billNO: billno,
        showUploader: !this.state.showUploader
      });
      break;
    //头部 打印
    case 'Print':
      print(
        'pdf',
        URL_INFO.COMMON.PRINT,
        {
          nodekey: TEMPLATE_INFO.PRINT_NOTEKEY_C,
          appcode: APP_INFO.FUNCODE,
          oids: [pk]
        }
      );
      break;
    //输出
    case 'Output':
      output({
        url: URL_INFO.COMMON.PRINT,
        data: {
          nodekey: TEMPLATE_INFO.PRINT_NOTEKEY_C,
          // appcode: APP_INFO.FUNCODE,
          oids: [pk],
          outputType: 'output'
        }
      });
      break;
    //联查工作流
    case 'LinkWorkFlow':
      if(!tradeType){
        tradeType='36D1';
      }
      this.setState({
        showApproveDetail: true,
        billID: pk,
        tradeType:tradeType
      });
      break;
     //头部 联查预算
    case 'Linkplan':
      linkNtb.call(this, props);
      break;
    case 'Linkwhx':
			linkWhx.call(this, props);			
			break;
    //肩部 增行
    case 'AddbodyBtn':
      if (vsourcebustype && vsourcebustype != '3') {
        toast({
          'color': 'warning',
          'content': loadMultiLang(props, '36070APM--000116')/* 国际化处理： 来源于外系统生成的付款申请表体不允许增行*/
        });
        return;
      }
      AddLine(props, CARD_PAGE_INFO.BODY_CODE, defaultRow);
      break;
    //肩部 删行
    case 'DeletebodyBtn':
      delLineAction.call(this, props, key, record,index,() => {});
      // BatchDelLine(props, CARD_PAGE_INFO.BODY_CODE);
      break;
    //肩部 复制   
    case 'CopybodyBtn':
      if (vsourcebustype && vsourcebustype != '3') {
        toast({
          'color': 'warning',
          'content': loadMultiLang(props, '36070APM--000116')/* 国际化处理： 来源于外系统生成的付款申请表体不允许增行*/
        });
        return;
      }      
      //判断是否有选中行
      // if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
      //   toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000025') });/* 国际化处理： 请选中一行数据！*/
      //   return;
      // }
      this.setState({ isRowCopy: true });
      props.setUrlParam({
        isRowCopy: true
      });
      bodyBtnVisible(props, true);
      break;
    //肩部 粘贴至末行
    case 'PastTail':
      if (vsourcebustype && vsourcebustype != '3') {
        toast({
          'color': 'warning',
          'content': loadMultiLang(props, '36070APM--000116')/* 国际化处理： 来源于外系统生成的付款申请表体不允许增行*/
        });
        return;
      }
      addLineAction.call(this, props, key, record,() => {
        //获取行尾行号
        // let lastIndex = props.cardTable.getNumberOfRows(CARD_PAGE_INFO.BODY_CODE);
        // pastRow.call(this,props, lastIndex - 1);
        cancelPastRow.call(this, props);
      });
      break;
    //肩部 取消    
    case 'BodyCancel':
      cancelPastRow.call(this, props);
      break;
    //行 粘贴至此
    case 'PastLine':
      if (vsourcebustype && vsourcebustype != '3') {
        toast({
          'color': 'warning',
          'content': loadMultiLang(props, '36070APM--000116')/* 国际化处理： 来源于外系统生成的付款申请表体不允许增行*/
        });
        return;
      }
      addLineAction.call(this, props, key, record,() => {
        //获取行尾行号
        // let lastIndex = props.cardTable.getNumberOfRows(CARD_PAGE_INFO.BODY_CODE);
        // pastRow.call(this,props, lastIndex - 1);
        cancelPastRow.call(this, props);
      });
      break;
    //行 展开
    case 'Openedit':
      Open(props, CARD_PAGE_INFO.BODY_CODE, index, record, 'edit');
      break;
    //行 复制
    case 'Copybody':  
      if (vsourcebustype && vsourcebustype != '3') {
        toast({
          'color': 'warning',
          'content': loadMultiLang(props, '36070APM--000116')/* 国际化处理： 来源于外系统生成的付款申请表体不允许增行*/
        });
        return;
      }        
      debugger
      addLineAction.call(this, props, key, record,() => {
        //获取行尾行号
        // let lastIndex = props.cardTable.getNumberOfRows(CARD_PAGE_INFO.BODY_CODE);
        // pastRow.call(this,props, lastIndex - 1);
      });
      break;
    case 'Insertline':
      if (vsourcebustype && vsourcebustype != '3') {
        toast({
          'color': 'warning',
          'content': loadMultiLang(props, '36070APM--000116')/* 国际化处理： 来源于外系统生成的付款申请表体不允许增行*/
        });
        return;
      }
      InsertLine(props, CARD_PAGE_INFO.BODY_CODE, index, defaultRow);
      break;
    //行 删除
    case 'Deleteline':
      // DelLine(props, CARD_PAGE_INFO.BODY_CODE, index);
      delLineAction.call(this, props, key, record,index,() => {});
      break;
    	//影像查看
    case 'Imageshow':      
      imageC.call(this,props);
      break;
     //影像扫描
    case 'Imagescan':  
      imageS.call(this,props);		
      break; 
    //联查单据  
    case 'Linkbill': 
      Linkb.call(this,props);      
      break; 
    case 'LinkInvoice':
      LinkI.call(this,props);
      break;
    case 'Generate':
      promptBox({
        color: "warning",
        content: loadMultiLang(props, '36070APM--000013'),/* 国际化处理： 您确定要生成付款单据吗？一旦生成，则不可以取消生成！*/
        beSureBtnClick: generalConfirm.bind(this, props)
      })
      break;
    // 转单 
    case 'CancelTransfer':
      props.pushTo('/ref21',{
        pagecode:trans_list_page_id,
        //status:'add'
      })
      break;
    case 'AddFrom':
      let { deleteCache } = this.props.transferTable;
			deleteCache(APP_INFO.DATA_SOURCE_TRANS);
      props.pushTo(URL_INFO.TRAN_LIST_PAGE_URL, {			
        pagecode: TRAN_LIST_PAGE_INFO.PAGE_CODE,
        destTradetype: "36OV"
      });
			break;       
    case 'Back':
      props.pushTo('/card',{
          pagecode:CARD_PAGE_INFO.PAGE_CODE,
      });
      break;      
    case 'addline':      
      props.cardTable.addRow(this.tableId)     
      break; 
    //展开（浏览态）
    case 'opendown':
    //收起
    case 'closedown':
      props.cardTable.toggleRowView(CARD_PAGE_INFO.BODY_CODE, record);
      break;
    case 'elecinvoice':
      let elecId= props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE,ITEM_INFO.PK).value;
      let billtype= props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE,"pk_billtypecode").value;
      let billCode = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE,ITEM_INFO.VBILLNO).value;
      let pk_org = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE,'pk_org').value;
      let tradetype =props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE,'pk_trantypecode').value; 
      let random = Math.random(); 
       this.setState({sscrpInvoiceData: { 
                 'billId':elecId, 
                    billtype,
                    pk_org, 
                    tradetype,
                    random }})
             break;      
    default:
      break
  }
}


/**
 * 新增
 * @param {*} props  页面内置对象
 */
const add = function (props) {
  let tradeType = JSON.parse(getGlobalStorage('sessionStorage', 'sessionTP'));
  let id = props.getUrlParam('id'); 
  
  if (tradeType && tradeType.refcode) { 
    props.setUrlParam({
      status:'add',
      from: 'card',
      refpk: tradeType && tradeType.refpk,
      refname: tradeType && tradeType.refname,
      refcode:tradeType && tradeType.refcode,
      pagecode: tradeType && tradeType.refcode	
    })
  }else{
    props.setUrlParam({
      status: 'add',
      from: 'card'
    });
  }       
  initTemplate.call(this, props);
  props.form.EmptyAllFormValue(CARD_PAGE_INFO.HEAD_CODE);
  props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, { rows: [] });
  repaintView(props);  
}

const linkNtb = function (props) {
  let pk = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, ITEM_INFO.PK).value;
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
        });
      }
    }
  });
}


/**
 * 保存新增
 * @param {*} props 
 */
const saveAdd = async function (props) {
  let status = props.getUrlParam('status');
  if (status != SHOW_MODE.ADD && status != SHOW_MODE.EDIT && status != SHOW_MODE.COPY) {
    return;
  }
  //开启必输项校验    
  if(!props.form.isCheckNow(CARD_PAGE_INFO.HEAD_CODE) || !props.cardTable.checkTableRequired(CARD_PAGE_INFO.BODY_CODE)){
    return;
  }
  let url = null;
  //新增时保存
  if (status == SHOW_MODE.ADD || status == SHOW_MODE.COPY) {
    url = URL_INFO.CARD.SAVENEW;
  }
  //修改时保存
  else if (status == SHOW_MODE.EDIT) {
    url = URL_INFO.CARD.SAVEUPDATE;
  } 
  let billdata = props.createMasterChildData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, CARD_PAGE_INFO.BODY_CODE);
  console.log(billdata, 'sign before billdata'); 
  let result = await Sign({isSign: true, isKey: false, data: billdata, 
      encryptVOClassName: 'nccloud.dto.cmp.vo.ApplyEncryptVO4NCC'});
  if (result.isStop) {
      return;
  }
  billdata = result.data;
  console.log(billdata, 'sign after billdata');
  let pageCode = CARD_PAGE_INFO.PAGE_CODE;
  let data = { data: JSON.stringify(billdata), pageCode };
  const that = this;
  ajax({
    url: url,
    data,
    success: (res) => {
      let { success, data } = res;
      if (success) {
        let { head, body } = data;
        //预算提示
        showTBBMsg(head, CARD_PAGE_INFO.HEAD_CODE);
        initTemplate.call(this, props);
        props.form.EmptyAllFormValue(CARD_PAGE_INFO.HEAD_CODE);
        props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, { rows: [] });
        let pk = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
        let vbillno = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
        //处理缓存
        if (status == 'add') {
          cardCache.addCache(pk, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
        } else {
          cardCache.updateCache(ITEM_INFO.PK, pk, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
        }
        props.setUrlParam({
          status: 'add',
        });        
        repaintView(props);
      }
    }
  });
}

/**
 * 保存提交
 * @param {*} props 
 */
const saveCommit = async function (props) {
  save.call(this, props, () => {
    cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [], ITEM_INFO.PK, URL_INFO.COMMON.COMMIT, loadMultiLang(props, '36070APM--000009'), APP_INFO.DATA_SOURCE, commitAssign.bind(this));
  })
}

// /**
//  * 保存提交
//  * @param {*} props 
//  */
// const saveCommit = async function (props) {
//   let billdata = props.createMasterChildData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, CARD_PAGE_INFO.BODY_CODE);
//   //开启必输项校验    
//   if(!props.form.isCheckNow(CARD_PAGE_INFO.HEAD_CODE) || !props.cardTable.checkTableRequired()){
//     return;
//   }
//   console.log(billdata, 'sign before billdata'); 
//   let result = await Sign({isSign: true, isKey: false, data: billdata, 
//       encryptVOClassName: 'nccloud.dto.cmp.vo.ApplyEncryptVO4NCC'});
//   if (result.isStop) {
//       return;
//   }
//   billdata = result.data;
//   console.log(billdata, 'sign after billdata');
//   let data = { data: JSON.stringify(billdata), pageCode: CARD_PAGE_INFO.PAGE_CODE };
//   ajax({
//     url: URL_INFO.CARD.SAVECOMMIT,
//     data,
//     success: (res) => {
//       let { data } = res;
//       //加载到卡片
//       loadData2Card(props, data, () => {
//         let billID = data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
//         let billNO = data.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
//         //切换地址栏
//         props.setUrlParam({
//           status: 'browse',
//           id: billID
//         });
//         //更新缓存
//         cardCache.updateCache(ITEM_INFO.PK, billID, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE);
//         //预算提示
//         showTBBMsg(data.head, CARD_PAGE_INFO.HEAD_CODE);
//         //界面重绘
//         repaintView(props);
//       })
//     }
//   });
// }


/**
 * 删除确认
 * @param {*} props 
 */
const delConfirm = function (props) {
  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_apply').value;
  let ts = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'ts').value;
  pkMapTs[pk] = ts;
  let data = { pkMapTs, pageCode: CARD_PAGE_INFO.PAGE_CODE };
  ajax({
    url: URL_INFO.COMMON.DELETE,
    data,
    success: () => {
      emptyView.call(this, props, pk);
      toast({ color: 'success', content: loadMultiLang(props, '36070APM--000014') });/* 国际化处理： 删除成功*/
    }
  });
};






/**
 * 取消确认
 * @param {*} props 
 * @param {*} pk
 */
const cancelConfirm = function (props) {
  let id = props.getUrlParam(URL_INFO.PARAM.ID);
  if (!id) {
    props.setUrlParam({
      status: 'browse'
    });
    props.form.EmptyAllFormValue(CARD_PAGE_INFO.HEAD_CODE);
    props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, { rows: [] });
  } else {
    props.setUrlParam({
      status: 'browse',
      id,
    });
    qryDataByPK(props, id);
  }
  repaintView(props);
}



/**
 * 复制
 * @param {*} props 
 */
const copy = function (props) {  
  let vsourcebustype = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'sourcesystypecode').value;
  if (vsourcebustype && vsourcebustype != '3') {
    toast({
      'color': 'warning',
      'content': loadMultiLang(props, '36070APM--000006')/* 国际化处理： 外系统生成的单据不允许进行复制*/
    });
    return;
  }
  let id = props.getUrlParam('id');
  props.setUrlParam({
    status: SHOW_MODE.COPY,
    id
  });
  let pk_org = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org');
  //清空字段
  props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { 'vbillno': { value: null, display: null } ,'pk_bankacc_r.pk_bankaccbas.pk_bankdoc':{value:null,display:null}});
  //触发复制编辑后事件
  afterEvent(props, CARD_PAGE_INFO.HEAD_CODE, 'copy', pk_org);
  //重绘界面
  repaintView(props);
}




/**
 * 粘贴行
 * @param {*} props 
 * @param {*} offset 
 */
const pastRow = function (props, offset) {
  let selectDatas = props.cardTable.getCheckedRows(CARD_PAGE_INFO.BODY_CODE);
  //判断是否有选中行
  if (selectDatas == null || selectDatas.length == 0) {
    toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000117') /*'未选中行！' */});
    return;
  }
  let recordArr = [];
  let recored = {};
  let rowIndex = offset + 1;
  for (let selectData of selectDatas) {
    recored = JSON.parse(JSON.stringify(selectData));
    //数据新增状态
    recored.status = '2';    
    //去除表体主键
    recored.data.values[ITEM_INFO.BPK] = {
      value: null,
      display: null,
      scale: -1
    }
    //去除ts
    recored.data.values[ITEM_INFO.TS] = {
      value: null,
      display: null,
      scale: -1
    }
    recordArr.push(recored.data);
    rowIndex++;
  }
  props.cardTable.insertRowsAfterIndex(CARD_PAGE_INFO.BODY_CODE, recordArr, offset);
}

/**
 * 复制行操作
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
const copyRow = function (props, record, index) {
  let newRecord = JSON.parse(JSON.stringify(record));
  //数据新增状态
  newRecord.status = '2';
  //去除主键
  newRecord.values[ITEM_INFO.BPK] = {
    value: null,
    display: null,
    scale: -1
  }
  //去除ts
  newRecord.values[ITEM_INFO.TS] = {
    value: null,
    display: null,
    scale: -1
  }
  props.cardTable.insertRowsAfterIndex(CARD_PAGE_INFO.BODY_CODE, [newRecord], index + 1);
}
const cancelPastRow = function (props) {
  this.setState({ isRowCopy: false });
  props.setUrlParam({
    isRowCopy: false
  });
  bodyBtnVisible(props);
}




/////////////////////////////////////////////////////////////////////////////////


/**
 * 影响扫描
 * @param {*} props 页面内置对象
 */
const imageS = function (props) {
	let ScanData = props.createMasterChildData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, CARD_PAGE_INFO.BODY_CODE);
  // let openbillid = props.getUrlParam('id'); //单据pk(billid)
  let openbillid = ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
  let billInfoMap = {};
  billInfoMap['pk_billid']= openbillid;

  billInfoMap['pk_billtype']= ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_billtypecode.value;
  billInfoMap['pk_tradetype']=ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_trantypecode.value;;
  billInfoMap['pk_org']= ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_org.value;;
  billInfoMap['BillType']=ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_trantypecode.value;
  billInfoMap['BillDate']=ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.creationtime.value;
  billInfoMap['Busi_Serial_No']=ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
  billInfoMap['OrgNo']=ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_org.value;
  billInfoMap['BillCode']=ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value;
  billInfoMap['OrgName']=ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_org.value;
  billInfoMap['Cash']=ScanData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.applysum.value;

  imageScan(billInfoMap, 'iweb');
}
/**
 * 影响查看
 * @param {*} props 页面内置对象
 */
const imageC = function (props) {
	let showData = props.createMasterChildData(CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, CARD_PAGE_INFO.BODY_CODE);      

  // let openShowbillid = props.getUrlParam('id'); //单据pk(billid)
  let openShowbillid = showData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
  let billShowInfoMap={};
  billShowInfoMap['pk_billid']= openShowbillid;
  billShowInfoMap['pk_billtype']= showData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_billtypecode.value;
  billShowInfoMap['pk_tradetype']=showData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_trantypecode.value;
  billShowInfoMap['pk_org']= showData.head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_org.value;
  imageView(billShowInfoMap,  'iweb');	
}
/**
 *联查单据
 */
const Linkb = function (props) {
  if (!props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_apply').value) {
    toast({ color: 'warning', content: loadMultiLang(props, '36070APM--000012') });/* 国际化处理： 操作失败，无数据!*/
    return;
  }
  let showbilltrackpk = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_apply').value;
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

const LinkI = function (props) {
  this.setState({sscrpLinkInvoiceData:{ 
    'billId':props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_apply').value, 
    'billtype':props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE,"pk_billtypecode").value,
    'pk_org': props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_org').value, 
    'tradetype':props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_trantypecode').value,
    'viewRandom': Math.random()}})
}


/**generalConfirm
 * 生成确认
 * @param {*} props 
 */
const generalConfirm = function (props) {
  cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, bodyCodeMapBodyPKName, ITEM_INFO.PK, URL_INFO.COMMON.GENERATE  , loadMultiLang(props, '36070APM--000015'), APP_INFO.DATA_SOURCE, repaintView.bind(this, props), true);
};


const linkWhx = function (props) {
  let pk = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, ITEM_INFO.PK).value;
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

/**
 * 提交指派
 * @param {*} props 
 * @param {*} data 
 */
const commitAssign = function (props, data) {
  if (!data) {
    return;
  }
  if (Array.isArray(data)) {
    data = data[0];
  }
  let { workflow } = data;
  //有指派信息，则指派，没有则重绘界面
  if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
    this.setState({ assignData: data, assignShow: data });
  } else {
    repaintView(props);
  }
}




/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/