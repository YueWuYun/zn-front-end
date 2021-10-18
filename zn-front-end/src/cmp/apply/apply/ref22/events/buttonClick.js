/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, print, output, cardCache, promptBox ,cacheTools,viewModel} from 'nc-lightapp-front';    
//引入常量定义
import { APP_INFO, URL_INFO, CARD_PAGE_INFO, LIST_PAGE_INFO, SHOW_MODE, TEMPLATE_INFO, ITEM_INFO, MODULE_H_CMP,TRAN_LIST_PAGE_INFO ,TRAN_CARD_PAGE_INFO} from '../../cons/constant.js';

import { initTemplate, pageInfoClick, bodyBtnVisible } from "./index";
import { afterEvent } from "./index"; 
//引入公共api
import { AddLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy ,showTBBMsg,getPKMapBodyPKMapRowID} from '../../../../pub/utils/CMPButtonUtil';
//影像
import { imageScan, imageView } from 'sscrp/rppub/components/image';
//引入内转api
import { qryDataByPK, loadNeedDealDataByPK, repaintView, loadData2Card ,versionControl,edit ,addLineAction,delLineAction,addNewRow,InsertLine} from "../../util/index";
// ca
import Sign from '../../../../../tmpub/pub/util/ca';
import { saveCommit ,loadMultiLang} from "../../../../../tmpub/pub/util/index";
import { checkEditRight } from "../../util/checkEditRight.js";
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';//税务参数查询

//引入缓存文件
//import { setDefData ,rewriteTransferSrcBids ,addCacheData} from '../../util/cacheDataManager';
let { setDefData, getDefData, addCache, getNextId, deleteCacheById, getCacheById, updateCache, getCurrentLastId } = cardCache;
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
const bodyCodeMapBodyPKName = {};
bodyCodeMapBodyPKName[CARD_PAGE_INFO.BODY_CODE] = ITEM_INFO.BPK;

export const buttonClick = function (props, key, text, record, index) {
  let status = props.getUrlParam("status");
  let vsourcebustype = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'sourcesystypecode').value;
  let pk = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, ITEM_INFO.PK).value;
  let pk_trantypecode = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_trantypecode').value;
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
      qryDataByPK(props, pk,null,null,true); 
      break;
    case 'Copy':
      copy(props);
      break;
    //头部编辑
    case 'Edit':
      checkEditRight.call(this,pk).then((res) => {
        edit(props);     
      });
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
      // save.call(this, props);
      break;
    case 'SaveAdd':
      props.validateToSave(billdata, saveAdd.bind(this, props), saveObj, '');
      // saveAdd.call(this, props);
      break;
    //保存提交
    case 'SaveCommit':       
      savecommit.call(this, props);
      break;
    //提交
    case 'Commit':
      cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, bodyCodeMapBodyPKName, ITEM_INFO.PK, URL_INFO.COMMON.COMMIT, loadMultiLang(props, '36070APM--000009'), APP_INFO.DATA_SOURCE_TRANS, commitAssign.bind(this),true);
      break;
    //收回
    case 'Uncommit':
      cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, bodyCodeMapBodyPKName, ITEM_INFO.PK, URL_INFO.COMMON.UNCOMMIT, loadMultiLang(props, '36070APM--000010'), APP_INFO.DATA_SOURCE_TRANS, repaintView.bind(this, props),true);
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
          // appcode: APP_INFO.FUNCODE,
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
      if(!pk_trantypecode){
        pk_trantypecode='36D1';
      }
      this.setState({
        showApproveDetail: true,
        billID: pk,
        tradeType:pk_trantypecode
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
      addNewRow(props);
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
      addLineAction.call(this, props, key, record,() => {
        //获取行尾行号
        // let lastIndex = props.cardTable.getNumberOfRows(CARD_PAGE_INFO.BODY_CODE);
        // pastRow.call(this,props, lastIndex - 1);
        // cancelPastRow.call(this, props);
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
      InsertLine(props,index);
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
      props.pushTo(URL_INFO.TRAN_LIST_PAGE_URL,{pagecode: TRAN_LIST_PAGE_INFO.PAGE_CODE,});
      break;
    case 'AddFrom':
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
      if(CMPEableSscivm.call(this)){
        return ;
      };    
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
 * 保存
 * @param {*} props  页面内置对象
 */
export const save =async function (props, callback) { 
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
              let hasTbbMsg = showTBBMsg(head, CARD_PAGE_INFO.HEAD_CODE);
              if (head) {
                  props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
              }
              if (body) {
                  //更新表体
                  body = updateBody(props, body);
                  if (body) {
                      data.body = body;
                  }
              }    
              let pk = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.pk_apply.value;
              let vbillno = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values.vbillno.value; 
              let pkvalues = [];
              props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: true,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
                showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
                billCode: vbillno
              });             

              let bodyData = res.data.body[CARD_PAGE_INFO.BODY_CODE].rows;
              bodyData.forEach((val) => {
                if(val.values.pk_payterm_b){
                  pkvalues.push(val.values.pk_srcbillrowid.value+val.values.pk_payterm_b.value);
                }else{
                  pkvalues.push(val.values.pk_srcbillrowid.value);
                }
              });
              // 缓存处理
              props.transferTable.savePk(APP_INFO.DATA_SOURCE_TRANS, pkvalues);
              
              // 转单编辑界面保存
              //addCacheData(props,ITEM_INFO.PK,pk,data,CARD_PAGE_INFO.HEAD_CODE,APP_INFO.DATA_SOURCE); 
              addCache(ITEM_INFO.PK, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE_TRANS); 
              //暂行方案，增加回调,方便保存提交逻辑 
              if (callback && (typeof callback == 'function')) {
                callback(props, data);
              }else{          
                let num = props.transferTable.getTransformFormAmount(TRAN_CARD_PAGE_INFO.HEAD_CODE);
                if(num == 1){
                    props.setUrlParam({
                      status: 'browse',
                      id: pk
                    });  
                }else{
                    props.transferTable.setTransformFormStatus(TRAN_CARD_PAGE_INFO.HEAD_CODE, {
                      status: true,
                      onChange: (current, next, currentIndex) => { 
                          props.transferTable.setTransferListValueByIndex(TRAN_CARD_PAGE_INFO.HEAD_CODE,res.data,currentIndex);
                          toast({ color: 'success', content: '操作成功' });							
                      }
                    });
                }                     
                repaintView(props);    
              } 
                       
          }
      }
  });
}

/**
 * 保存新增
 * @param {*} props 
 */
const saveAdd =async function (props) {
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
          cardCache.addCache(pk, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE_TRANS);
        } else {
          cardCache.updateCache(ITEM_INFO.PK, pk, data, CARD_PAGE_INFO.HEAD_CODE, APP_INFO.DATA_SOURCE_TRANS);
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
 * 卡片操作
 * 
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode  表头区域编码
 * @param {*} bodyCodeMapbodyPKName 表体区域编码映射表体主键字段
 * @param {*} pkName 主键字段名
 * @param {*} url  请求地址
 * @param {*} actionname 操作名称
 * @param {*} datasource 区域缓存标识
 * @param {*} callback 回调 
 * @param {*} showTBB 是否显示预算提示信息
 * @param {*} extParam 拓展参数
 * @param {*} flag 是否更新左侧列表
 */
export const cardOperator = function (props, pageCode, headCode, bodyCodeMapbodyPKName, pkName, url, actionname, datasource, callback, showTBB, extParam,flag) {
  let bodyCodeArr = (typeof bodyCodeMapbodyPKName == 'array') ? bodyCodeMapbodyPKName : Object.keys(bodyCodeMapbodyPKName);
  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(headCode, pkName).value;
  let ts = props.form.getFormItemsValue(headCode, 'ts').value;
  pkMapTs[pk] = ts;
  //获取表头主键映射
  let pkMapbodyPKMaprowID = getPKMapBodyPKMapRowID(props, pk, bodyCodeMapbodyPKName);
  if (!extParam) {
      extParam = {};
  }
  ajax({
      url,
      data: {
          //主键pk与时间戳ts的映射
          pkMapTs,
          //页面编码
          pageCode,
          //是否返回数据
          isRet: true,
          extParam,
          pkMapbodyPKMaprowID
      },
      success: (res) => {
          let { data } = res;
          let hasTbbMsg = false;
          if (data) {
              let status = props.getUrlParam('status');
              let { head, body, bodys } = data;
              if (head || body || bodys) {
                  //是否提示预算信息
                  if (showTBB) {
                      hasTbbMsg = showTBBMsg(head, headCode);
                  }
                  //更新表头
                  if (head) {
                      props.form.setAllFormValue({ [headCode]: head[headCode] });
                  }
                  //更新表体
                  if (body && bodyCodeArr && bodyCodeArr.length > 0) {
                      for (let bodyCode of bodyCodeArr) {
                          let bodyData = body[bodyCode];
                          if (!bodyData) {
                              continue;
                          }
                          bodyData = updateBody(props, bodyCode, bodyData);
                          if (bodyData) {
                              data.body[bodyCode] = bodyData
                          }
                      }
                  }                 
                  if (head && head[headCode] && head[headCode].rows && head[headCode].rows[0]) {
                      let row = head[headCode].rows[0];
                      let pk = row && row.values && row.values[pkName] && row.values[pkName].value;
                      cardCache.updateCache(pkName, pk, data, headCode, datasource);
                  }
                  if (!hasTbbMsg) {
                      toast({ color: 'success', content: actionname + loadMultiLang(props, '36070APM--000121')/*'成功'*/  });
                  }
                  props.transferTable.setTransformFormStatus(TRAN_CARD_PAGE_INFO.HEAD_CODE, {
                    status: true,
                    onChange: (current, next, currentIndex) => {                                                  
                        props.transferTable.setTransferListValueByIndex(TRAN_CARD_PAGE_INFO.HEAD_CODE,res.data,currentIndex);						                        
                    }
                  });           
              }
          }
          //没有返回数据，则删除缓存
          else {
              cardCache.deleteCacheById(pkName, pk, datasource);
              toast({ color: 'success', content: actionname +loadMultiLang(props, '36070APM--000121')/*'成功'*/  });
          }
          //回调
          if (callback && (typeof callback == 'function')) {
              callback(props, data);
          }
      }
  });
}



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
      //删除缓存
      deleteCacheById(ITEM_INFO.PK, pk, APP_INFO.DATA_SOURCE_TRANS); 
      if (props.transferTable.getTransformFormAmount(TRAN_CARD_PAGE_INFO.HEAD_CODE) == 1) {
        props.pushTo(URL_INFO.TRAN_LIST_PAGE_URL,{pagecode: TRAN_LIST_PAGE_INFO.PAGE_CODE});
      }else{
        props.transferTable.setTransformFormStatus(TRAN_CARD_PAGE_INFO.HEAD_CODE, {
          status: false,
          onChange: (current, next,currentIndex) => {	
            // this.props.form.setAllFormValue({
            //   [CARD_PAGE_INFO.HEAD_CODE]: next.head[CARD_PAGE_INFO.HEAD_CODE]
            // });
            // this.props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, next.body[CARD_PAGE_INFO.BODY_CODE]);          
            toast({ color: 'success', content: loadMultiLang(props, '36070APM--000014') });/* 国际化处理： 删除成功*/
          }
        })
      }
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
    // props.form.EmptyAllFormValue(CARD_PAGE_INFO.HEAD_CODE);
    // props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, { rows: [] });
    if (props.transferTable.getTransformFormAmount(TRAN_CARD_PAGE_INFO.HEAD_CODE) == 1) {
      props.pushTo(URL_INFO.TRAN_LIST_PAGE_URL,{pagecode: TRAN_LIST_PAGE_INFO.PAGE_CODE});
    }else{
      props.transferTable.setTransformFormStatus(TRAN_CARD_PAGE_INFO.HEAD_CODE, {
        status: false,
        onChange: (current, next,currentIndex) => {	
          
        }
      });
    }
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
  let vsourcebustype = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'vsourcebustype');
  if (vsourcebustype && vsourcebustype.value != '3') {
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
  props.form.setFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, { 'vbillno': { value: null, display: null } });
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
    toast({ color: 'warning', content: '未选中行！' });
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
  if(CMPEableSscivm.call(this)){
    return ;
  };
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
  if(CMPEableSscivm.call(this)){
    return ;
  };
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
  let pk_reciptPaybill = props.form.getFormItemsValue(CARD_PAGE_INFO.HEAD_CODE, 'pk_apply').value; //单据pk
      this.setState(
        {
          billID: pk_reciptPaybill //单据pk
        },
        () => {
          this.setState({
            billCodeModalShow: true 
          });
        }
      );
}


/**generalConfirm
 * 生成确认
 * @param {*} props 
 */
const generalConfirm = function (props) {
  cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, bodyCodeMapBodyPKName, ITEM_INFO.PK, URL_INFO.COMMON.GENERATE  , loadMultiLang(props, '36070APM--000015'), APP_INFO.DATA_SOURCE_TRANS, repaintView.bind(this, props), true);
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
  let { workflow } = data;
  //有指派信息，则指派，没有则重绘界面
  if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
    this.setState({ assignData: data, assignShow: data });
  } else {
    repaintView(props);
  }
}

/**
 * 更新表体，兼容差异化处理
 * @param {*} props 
 * @param {*} body 
 */
export const updateBody = function (props, body) {
  //rowid存在则按照差异化处理
  if (body[CARD_PAGE_INFO.BODY_CODE] && body[CARD_PAGE_INFO.BODY_CODE].rows && body[CARD_PAGE_INFO.BODY_CODE].rows[0] && body[CARD_PAGE_INFO.BODY_CODE].rows[0].rowid) {
      body[CARD_PAGE_INFO.BODY_CODE] = props.cardTable.updateDataByRowId(CARD_PAGE_INFO.BODY_CODE, body[CARD_PAGE_INFO.BODY_CODE]);
  }
  //否则直接更新表体
  else {
      props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, body[CARD_PAGE_INFO.BODY_CODE]);
  }
  return body;
}





/**保存提交 */
const savecommit = function (props, assign) {
  saveCommit(props, {
      //页面编码
      pageCode: CARD_PAGE_INFO.PAGE_CODE,
      //表头区域编码
      headCode: CARD_PAGE_INFO.HEAD_CODE,
      //表体区域编码（多表体传数组，没有表体不传）
      bodyCode: CARD_PAGE_INFO.BODY_CODE,
      //请求url
      url: URL_INFO.CARD.SAVECOMMIT,
      //指派信息
      assign,
      //展示指派框的逻辑
      showAssignFunc: (res) => {
          let { data } = res;
          let { workflow } = data;
          if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
              this.setState({ assignData: data, assignShow: true, assignType: URL_INFO.ASSIGNTYPE.SAVECOMMIT });
          }
      },
      //更新界面数据的逻辑
      updateViewFunc: (res) => {
          saveUpdateView(props, res, () => {
              toast({ color: 'success', content: loadMultiLang(props, '36070APM--000137')/* 国际化处理： 保存提交成功！*/ });
          });
      },
      //保存的校验（无需考虑验证公式，本身包含）
      saveValidate: () => {
          //判断表体是否为空
          let size = props.cardTable.getNumberOfRows(CARD_PAGE_INFO.BODY_CODE);
          if (size <= 0) {
              toast({ color: 'danger', content: loadMultiLang(props, '36070APM--000136')/* 国际化处理： 请录入表体！*/ });
              return false;
          }
          return true;
      }
  })
}



/**保存动作更新界面数据 */
const saveUpdateView = function (props, res, callback) {
  //界面状态
  let status = props.getUrlParam('status');
  let hasTbbMsg = false;
  let { data } = res;
  let { head, body } = data;
  if (!head) {
      return;
  }
  //预算信息
  hasTbbMsg = showTBBMsg(head, CARD_PAGE_INFO.HEAD_CODE);
  //更新表头数据
  props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
  //更新表体(兼顾差异化和非差异化)
  if (body) {
      body = updateBody(props, body);
      if (body) {
          data.body = body;
      }
  }
  let pk = head[CARD_PAGE_INFO.HEAD_CODE].rows[0].values[ITEM_INFO.PK].value;
  //新增时，向缓存中追加数据
  if ('add' == status) {
      cardCache.addCache(pk, data, CARD_PAGE_INFO.HEAD_CODE,  APP_INFO.DATA_SOURCE_TRANS);
  }
  //其余更新缓存中的数据
  else {
      cardCache.updateCache(ITEM_INFO.PK, pk, data, CARD_PAGE_INFO.HEAD_CODE,  APP_INFO.DATA_SOURCE_TRANS);
  }
  props.setUrlParam({ status: 'browse',id: pk}); 
  props.transferTable.setTransformFormStatus(TRAN_CARD_PAGE_INFO.HEAD_CODE, {
    status: true,
    onChange: (current, next, currentIndex) => {                                                  
        props.transferTable.setTransferListValueByIndex(TRAN_CARD_PAGE_INFO.HEAD_CODE,res.data,currentIndex);						                        
    }
  }); 
  //刷新界面
  repaintView(props)
  //执行回调
  if (callback && (typeof callback == 'function')) {
      callback();
  } else {
    if (!hasTbbMsg) {
      toast({ color: 'success', content: loadMultiLang(props, '36300-000033')/* 国际化处理： 保存成功！*/ });
    }
  }
}




/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/