/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax,toast,cardCache,print,promptBox ,output} from 'nc-lightapp-front';
import { base_url,PAYMODEL_COMBINEPAY, billtype,card_page_id, card_from_id, card_table_id, viewmod_deal ,dataSource,funcode,SHOWMODEL_LIULAN,SHOWMODEL_BULU} from '../../cons/constant';
import { linkApp,linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { cardOperator } from '../../../../pub/utils/SFButtonUtil';
// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { showTBBMsg } from '../../../../pub/utils/SFButtonUtil';
import { buttonVisible,pageInfoClick } from "../events";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { list_page_id } from '../../../allocate/cons/constant';
//引入下拨api
const bodyCodeMapBodyPKName = {};
bodyCodeMapBodyPKName[card_table_id] = 'pk_allocate_b';
async function buttonClick(props, key, text, record, index) {
  let status = props.getUrlParam("status");
  let pk_allocate_h = this.props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let ts = this.props.form.getFormItemsValue(card_from_id, 'ts');
  let checkAllCardDate = this.props.cardTable.getAllRows(card_table_id, false);
  let pk_org = this.props.form.getFormItemsValue(card_from_id, 'pk_org').value;
  let billdata = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
  let isNetpay = false
  switch (key) {
    
    //联查 委托付款
    case 'commisionpayment' :
      doEntrustpay.call(this,props);
      break;
    //取消
    case 'cancel':
      promptBox({
        title:loadMultiLang(this.props,'1880000025-000006'),/* 国际化处理： 取消*/
        color: "warning",
        content: loadMultiLang(this.props,'1880000025-000007'),/* 国际化处理： 确定要取消吗？*/
        beSureBtnClick: cancelConfirm.bind(this, props)
      })
      // props.modal.show('saveCancelModel',{
        //点击确定按钮事件
        // beSureBtnClick: this.changeOrgConfirm.bind(this, data),
        // //取消按钮事件回调
        // cancelBtnClick: this.changeOrgCancel.bind(this, cardData),
      // });
      break;
    //打印
    case 'print':
      let oids = [];
      let pk_allocate_h = this.props.form.getFormItemsValue(card_from_id, 'pk_allocate_h').value;
      if(pk_allocate_h) {
        oids.push(pk_allocate_h);
      }
      print(
          'pdf',
          base_url + 'allocateprint.do',
          {
              billtype,
              funcode,
              // nodekey: print_nodekey,
              // printTemplateID: print_templateid,
              oids
          }
      );
      break;
    // 输出
    case 'export':
      pk_allocate_h = this.props.form.getFormItemsValue(card_from_id, 'pk_allocate_h').value;
      let outputpks = [];
      outputpks.push(pk_allocate_h);
      output({
        url: '/nccloud/sf/allocation/allocateprint.do',
        data: {
            oids: outputpks,
            outputType: 'output'
        }
      });
      break;
    //附件管理
    case 'field':
      //单据pk
      let filepk_allocate_h = this.props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
      //单据编号
      let filevbillno = this.props.form.getFormItemsValue(card_from_id, 'vbillno');
      this.billId=filepk_allocate_h && filepk_allocate_h.value;
      this.billno=filevbillno && filevbillno.value;
      this.setState({
        showUploader: !this.state.showUploader
      })
      break;
    
    //联查 下拨核准
    case 'allocateagree':
      let srcbilltype=this.props.form.getFormItemsValue(card_from_id,'srcbusitype');
      let pk_srcbillhead =[];
      //begin 修改合并生成的下拨单 联查时无法获取到srcbillcode的问题
      let tableIndex = props.cardTable.getAllRows(card_table_id).length;
      for(let i=0;i<tableIndex;i++){
        pk_srcbillhead.push(this.props.createMasterChildData(card_page_id, card_from_id, card_table_id).body[card_table_id].
                            rows[i].values.pk_srcbillhead.value)
      }
      //let srcbillcode  = props.form.getFormItemsValue(card_from_id,'srcbillcode').value;  
      //end 2019/1/8 yangjn
      let urlExtParam = {
        status: 'browse',
        srcbillid: pk_srcbillhead,
        linkquerytype: '1',
      };

      if(srcbilltype.value && srcbilltype.value == 6) {
          linkApp(props,'36K7',urlExtParam)
      }else {
        toast({ color: 'warning', content: loadMultiLang(this.props,'36320FA-000013') });/* 国际化处理： 该单据来源非下拨申请！*/
        return;
      }
      break;
    //联查 支付确认单
    case 'payagree':
      let checkrows=this.props.cardTable.getCheckedRows(card_table_id);
      if(checkrows.length>1||checkrows.length<1) {
        toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000009') });/* 国际化处理： 请选择一行表体进行操作！*/
        return;
      }
      let isnetpay=checkrows[0].data.values.isnetpay.value;
      if(!isnetpay) {
        toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000010') });/* 国际化处理： 请选择网银支付的单据进行操作！*/
        return;
      }
      let paystatus=checkrows[0].data.values.paystatus.value;
      if(paystatus.value&&paystatus.value=='1') {
        toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000011') });/* 国际化处理： 请选择已经支付过的单据进行操作！*/
        return;
      }
      let pk_allocate_b=checkrows[0].data.values.pk_allocate_b.value;
      props.openTo('/obm/ebankconfirmpay/confirmpay/main/index.html#/card',
      {
          appcode: '36100CONFM',
          pagecode: '36100CONFM_C01',
          yurrefs: [pk_allocate_b],
          id: [pk_allocate_b],
          type: 'link',
          status: 'browse',
      });
      // linkApp(props,'36100CONFM',{status:'browse',yurrefs:pk_allocate_b});
      break;
    //联查 回单
    case 'receipt':
      let newrows=this.props.cardTable.getCheckedRows(card_table_id);
      if(newrows.length<1) {
        //表头
        let billstatus=this.props.form.getFormItemsValue(card_from_id,'billstatus').value;
        let pk_allocate_h=this.props.form.getFormItemsValue(card_from_id,'pk_allocate_h').value;
        if(billstatus&&billstatus=='5') {
          linkApp(props,'36K8',{status:'browse',linkquerytype:'LinkQuery_SrcBill_H',srcbillid:[pk_allocate_h]})
        }else {
          toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000012') });/* 国际化处理： 请选择下拨成功的单据进行操作！*/
          return;
        }
      }else {
        //表体
        if(newrows.length>1) {
          toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000009') });/* 国际化处理： 请选择一行表体进行操作！*/
          return;
        }else {
          let paystatus=newrows[0].data.values.paystatus.value;
          let pk_allocate_b=newrows[0].data.values.pk_allocate_b.value;
          if(paystatus&&paystatus=='3') {
            linkApp(props,'36K8',{status:'browse',linkquerytype:'LinkQuery_Apply_B',pk_allocate_b:[pk_allocate_b]});
          }else {
            toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000013') });/* 国际化处理： 请选择支付成功的单据进行操作！*/
            return;
          }
        }
      }
      break;

      //联查预算
    case "plannedbudget":
      let queryntbplanData = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
      ajax({
        url: "/nccloud/sf/allocation/allocatelinkplan.do",
        data: queryntbplanData,
        success: (res) => {
          if(res.data && res.data.hint){
            toast({ color: 'warning', content: res.data.hint});
            return;
          }else{
            this.setState({
              showInspection: true,
              sourceData: res.data
            })
          }
        }
      });
      break; 

       //联查 凭证凭证
    case 'evidence':        
      pk_allocate_h=this.props.form.getFormItemsValue(card_from_id,'pk_allocate_h').value;
      let pk_group=this.props.form.getFormItemsValue(card_from_id,'pk_group').value;
      let pk_org=this.props.form.getFormItemsValue(card_from_id,'pk_org').value;
      let billno=this.props.form.getFormItemsValue(card_from_id,'vbillno').value;
      let pk_billtype=this.props.form.getFormItemsValue(card_from_id,'pk_billtype').value;
    
      linkVoucherApp(props, pk_allocate_h,pk_group,pk_org, pk_billtype,billno);
      break;
    //联查 内部户余额
    case "inaccountbalance":
      doInnerAccountBlance.call(this,props);
      break;

    //联查 收款账户
    case "reciveaccount":
      doGetPaymentAccount.call(this,props);
      break;

    //联查 付款账户
    case "payaccount":
      doPaymentAccount.call(this,props);
      break;
    case 'queryapprove':
      doApprove.call(this,props);
      break;

    //网银补录
    case 'e_bank':
      ebankBulu.call(this,props,false);
      break;

    //网银浏览（下拉分割按钮）
    case 'e_bank_browse':
      ebankBrowse.call(this,props);
      break;
    
    // 网银浏览（单独的按钮）
    case 'e_bank_browse_1':
      ebankBrowse.call(this,props);
      break;

    // 支付（校验）
    case 'pay':
      let pk_allocate_pay = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
      let ts_pay = props.form.getFormItemsValue(card_from_id, 'ts');
      let pkMapTs = {}
    
      if (pk_allocate_pay.value && ts_pay.value) {
          pkMapTs[pk_allocate_pay.value] = ts_pay.value;
      }     
    
      let data_pay = {
          "pkMapTs":pkMapTs,
          "pageid": card_page_id,
          'isCardOpt': true,
          "isValidate":true
      };
    
      ajax({
          url: '/nccloud/sf/allocation/allocatepay.do',
          data: data_pay,
          success: (res) => {
              let { success, data } = res;
              if (success) {
                if(data.errorMsg){
                  toast({ color: 'warning', content: data.errorMsg });
                  return;
                }
                else{
                  isNetpay = data.isNetpay
                  pay.call(this,props,isNetpay)
                }                
              }
          }
      });
      break;
    //取消支付
    case "unpay":
      doCancelPay.call(this,props);
      break;

      // 合并支付（网银补录）
    case "pay_merge":
      ebankBulu.call(this,props,true)
      break;
    
    // 合并支付（校验）
    case "pay_merge_check":
      let pk_allocate_mergepay = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
      let ts_mergepay = props.form.getFormItemsValue(card_from_id, 'ts');
      let data_mergepay = {
          "pk": pk_allocate_mergepay && pk_allocate_mergepay.value,
          "ts": ts_mergepay && ts_mergepay.value,
          "pageid": card_page_id,
          'isCardOpt': false,
          "isValidate":true
      };
    
      ajax({
          url: '/nccloud/sf/allocation/allocatemergepay.do',
          data: data_mergepay,
          success: (res) => {
              let { success, data } = res;
              if (success) {
                if(data.errorMsg){
                  toast({ color: 'warning', content: data.errorMsg });
                }
                else{
                  isNetpay = data.isNetpay
                  doPayMerge.call(this,props,isNetpay)
                }                                       
              }
          }
      });
      break;

    //合并支付确认
    case "mergepayconfirm":
      let mergePayBtnConfirmresult = await Sign({
          isSign: false,
          isKey: isNetpay,
          data: null,
          encryptVOClassName: null
      });
      if (mergePayBtnConfirmresult.isStop) {
          return;
      }
      let pk_allocate_mergepayconfirm = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
      let ts_mergepayconfirm = props.form.getFormItemsValue(card_from_id, 'ts');
      let data_mergepayconfirm = {
          "pk": pk_allocate_mergepayconfirm && pk_allocate_mergepayconfirm.value,
          "ts": ts_mergepayconfirm && ts_mergepayconfirm.value,
          "operator":1,
          "pageid": card_page_id,
          "isCardOpt": true,
          "isValidate":false
      };
      ajax({
          url: '/nccloud/sf/allocation/allocatemergepay.do',
          data: data_mergepayconfirm,
          success: (res) => {
              if (res.success) {
                  if(res.data.billCard){
                    toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017')})/* 国际化处理： 支付成功*/
                    if (res.data.billCard.head) {
                      props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                      cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
                    }
                    if (res.data.billCard.body) {
                      props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                    }              
                  }
              }
          }
      });
      break

    // 支付状态
    case "paystatus":
      doPayStatus.call(this,props);      
      break;

    // 支付确认
    case "paybtnconfirm":
      let payBtnConfirmresult = await Sign({
          isSign: false,
          isKey: isNetpay,
          data: null,
          encryptVOClassName: null
      });
      if (payBtnConfirmresult.isStop) {
          return;
      }
      let pk_allocate_paybtnconfirm = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
      let ts_paybtnconfirm = props.form.getFormItemsValue(card_from_id, 'ts');
      let pkMapTs_paybtnconfirm = {}

      if (pk_allocate_paybtnconfirm.value && ts_paybtnconfirm.value) {
        pkMapTs_paybtnconfirm[pk_allocate_paybtnconfirm.value] = ts_paybtnconfirm.value;
      }


      let data_paybtnconfirm = {
          "pkMapTs":pkMapTs_paybtnconfirm,
          "operator":1,
          "pageid": card_page_id,
          "isCardOpt": true,
          "isValidate":false
      };
      ajax({
          url: '/nccloud/sf/allocation/allocatepay.do',
          data: data_paybtnconfirm,
          success: (res) => {
              if (res.success) {
                  if(res.data.billCard){
                    toast({ color: 'success', content:loadMultiLang(this.props,'1880000025-000014')})/* 国际化处理： 支付成功*//* 国际化处理： 支付成功*/
                    if (res.data.billCard.head) {
                      props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                      cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
                    }
                    if (res.data.billCard.body) {
                      props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                    }              
                  }                    
              }
          }
      });
      break;

    // 支付确认（支付确认单）
    case "payconfirm":
      doPayConfirm.call(this,props)
      break;

    // 再次手工支付
    case "againhandworkpay":       
      let handpayselectrows = props.cardTable.getCheckedRows(card_table_id); //获取选中的表体数据 
      if (handpayselectrows && handpayselectrows.length > 0) {
        props.modal.show('commonModel',{
          title:  loadMultiLang(this.props,'1880000025-000015'),/* 国际化处理： 再次手工支付*//* 国际化处理： 再次手工支付,再次手工支付*/
          content: loadMultiLang(this.props,'1880000025-000016'),/* 国际化处理： 对选中的表体行进行再次手工支付?*//* 国际化处理： 对选中的表体行进行再次手工支付?*/
          //点击确定按钮事件
          beSureBtnClick: doAgainHandWorkPayConfirm.bind(this, props ,false)
        });
      }else{
        props.modal.show('commonModel',{
          title: loadMultiLang(this.props,'1880000025-000015'),/* 国际化处理： 再次手工支付*//* 国际化处理： 再次手工支付,再次手工支付*/
          content: loadMultiLang(this.props,'1880000025-000017'),/* 国际化处理： 对整张上收单进行再次手工支付?*//* 国际化处理： 对整张上收单进行再次手工支付?*/
          //点击确定按钮事件
          beSureBtnClick: doAgainHandWorkPayConfirm.bind(this, props ,true)
        });
      }
      break;
   
    // 分录作废
    case "entrycancel":      
      let tablesDatas = props.cardTable.getCheckedRows(card_table_id);
      if(tablesDatas.length > 0){
        let canOpera = false
        //处理选择数据（支付失败且未作废）
        tablesDatas.forEach((val) => {
          let paystatus = val.data.values.paystatus;
          let recordstatus = val.data.values.recordstatus;
          if(paystatus && paystatus.value && paystatus.value == 4 
            && recordstatus && recordstatus.value && recordstatus.value == 1){
              canOpera = true;
          }
          return;
      });
      if(!canOpera){
        toast({ color: 'warning', content:loadMultiLang(this.props,'1880000025-000018')})/* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*//* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*/
        return;
      }else{
        props.modal.show('commonModel',{
          title:loadMultiLang(this.props,'1880000025-000019'),/* 国际化处理： 分录作废*//* 国际化处理： 分录作废*/
          content:loadMultiLang(this.props,'1880000025-000020'),/* 国际化处理： 对选中的表体行进行分录作废?*//* 国际化处理： 对选中的表体行进行分录作废?*/
          //点击确定按钮事件
          beSureBtnClick: doRecorddisuseConfirm.bind(this, props ,false),
        });
      }
      }else{
        let allCardData = props.cardTable.getAllRows(card_table_id)
        let canOperaAll = false;
          //处理选择数据
          allCardData.forEach((val) => {
              let paystatus = val.values.paystatus;
              let recordstatus = val.values.recordstatus;
              if(paystatus && paystatus.value && paystatus.value == 4 
                  && recordstatus && recordstatus.value && recordstatus.value == 1){
                    canOperaAll = true;
              }        
          });
          if(!canOperaAll){
            toast({ color: 'warning', content:loadMultiLang(this.props,'1880000025-000018')})/* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*//* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*/
            return;
          }else{
            props.modal.show('commonModel',{
            title:loadMultiLang(this.props,'1880000025-000019'),/* 国际化处理： 分录作废*//* 国际化处理： 分录作废*/
            content:loadMultiLang(this.props,'1880000025-000021'),/* 国际化处理： 对整张下拨单进行分录作废?*//* 国际化处理： 对整张下拨单进行分录作废?*/
            //点击确定按钮事件
            beSureBtnClick: doRecorddisuseConfirm.bind(this, props ,true),
          });
        }
      }
      break;
    
    //刷新
    case 'refresh':
      doRefresh.call(this,props);
      break;
    default:
      break;
  }
}

  /**
 * 新增
 * @param {*} props  页面内置对象
 */
const add = function (props) {
  let billId=props.getUrlParam('id');
  if(!billId) {
    billId=this.billId;
  }
  // this.setState({
  //   billno:'',
  //   billId:billId
  // });
  this.billno='';
  this.billId=billId;
  props.setUrlParam( {
    status: 'add',
    interfaceJump: 'card'
  });
  this.componentDidMount();
  // this.toggleShow();
  // this.refresh();
  // initTemplate.call(this, props);
  // props.form.EmptyAllFormValue(card_from_id);
  // props.cardTable.setTableData(card_table_id, { rows: [] });
  // this.toggleShow();
}
/**
 * 保存
 * @param {*} props  页面内置对象
 */
const save =async function (props,callback) {
  //缓存
  let { addCache ,updateCache} = cardCache;
  let status = props.getUrlParam('status');
  let formcheck=props.form.isCheckNow(card_from_id);
  let hasTbbMsg=false;
  if(!formcheck) {
    return;
  }
  let tablecheck=props.cardTable.checkTableRequired(card_table_id);
  if(!tablecheck) {
    return;
  }
  
  let saveaddData=null;
  let url = base_url;
  // 暂时不能用
  // let pageCode=props.getSearchParam('p');
  let pageCode=card_page_id;
  let data=null;
  const that = this;
  //新增时保存
  if (status == 'add'||status=='copy') {
    //对主键制空
    this.props.form.setFormItemsValue(card_from_id,{'pk_allocate_h':{'value':null,'display':null}})
    this.props.cardTable.setColValue(card_table_id,'pk_allocate_b',{'value':null,'display':null});
    saveaddData=this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
    //ca签名
    console.log(saveaddData, 'sign before saveaddData');
    let result =await Sign({isSign: true, isKey:true, data: saveaddData, encryptVOClassName: 'nccloud.dto.sf.allocation.allocate.AllocateEncryptVO4NCC'});
    if (result.isStop) {
      return;
    }
    saveaddData= result.data;
    console.log(saveaddData, 'sign after saveaddData');
    data={data: JSON.stringify(saveaddData),pageCode};
    url = url + 'save.do';
    ajax({
      url: url,
      data: data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          if (head) {
            that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            //预算提示
            hasTbbMsg = showTBBMsg(head, card_from_id);
          }
          if (body) {
            that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
          }
          let pk = head[card_from_id].rows[0].values.pk_allocate_h.value;
          let vbillno = head[card_from_id].rows[0].values.vbillno.value;
          this.billId=pk;
          this.billno=vbillno;
          // that.setState({
          //   billId: pk,
          //   billno: vbillno
          // });
          //保存成功放到缓存中
          addCache(pk,res.data,card_from_id,dataSource);
          if(callback) {
            callback(props, data);
          }else {
            props.setUrlParam( {
              status: 'browse',
              id: pk
            });
            // this.setState({
            //   status:'browse'
            // })
            this.status='browse';
            that.toggleShow();
            if(!hasTbbMsg) {
              toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000022') });/* 国际化处理： 新增保存成功！*/
              return;
            }
          }
        }
      }
    });

  }
  //修改时保存
  else if (status == 'edit') {
    saveaddData=this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
    console.log(saveaddData, 'sign before saveaddData');
    let result =await Sign({isSign: true, isKey:true, data: saveaddData, encryptVOClassName: 'nccloud.dto.sf.allocation.allocate.AllocateEncryptVO4NCC'});
    if (result.isStop) {
      return;
    }
    saveaddData= result.data;
    console.log(saveaddData, 'sign after saveaddData');
    data={data: JSON.stringify(saveaddData),pageCode};
    url = url + 'update.do';
    ajax({
      url: url,
      data: data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          if (head) {
            that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            //预算提示
            hasTbbMsg=showTBBMsg(head,card_from_id);
          }
          if (body) {
            that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
          }
          let pk = head[card_from_id].rows[0].values.pk_allocate_h.value;
          let vbillno = head[card_from_id].rows[0].values.vbillno.value;
          // that.setState({
            this.billId= pk,
            this.billno=vbillno
          // });
          //保存成功放到缓存中
          updateCache('pk_allocate_h',pk,res.data,card_from_id,dataSource);
          if(callback) {
            callback(props, data);
          }else {
            props.setUrlParam( {
              status: 'browse',
              id: pk
            });
            // this.setState({
            //   status:'browse'
            // });
            this.status='browse';
            that.toggleShow();
            if(!hasTbbMsg) {
              toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000023') });/* 国际化处理： 修改保存成功！*/
            }
          }
        }
      }
    });
  }
  //经办时保存
  else if (status == 'decide') {
    saveaddData=this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
    console.log(saveaddData, 'sign before saveaddData');
    let result =await Sign({isSign: true, isKey:true, data: saveaddData, encryptVOClassName: 'nccloud.dto.sf.allocation.allocate.AllocateEncryptVO4NCC'});
    if (result.isStop) {
      return;
    }
    saveaddData= result.data;
    console.log(saveaddData, 'sign after saveaddData');
    data={data: JSON.stringify(saveaddData),pageCode};
    url = url + 'update.do';
    ajax({
      url: url,
      data: data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          if (head) {
            that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            //预算提示
            hasTbbMsg=showTBBMsg(head,card_from_id);
          }
          if (body) {
            that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
          }
          let pk = head[card_from_id].rows[0].values.pk_allocate_h.value;
          let vbillno = head[card_from_id].rows[0].values.vbillno.value;
          // that.setState({
            this.billId= pk,
            this.billno=vbillno
          // });
          //保存成功放到缓存中
          updateCache('pk_allocate_h',pk,res.data,card_from_id,dataSource);
          if(callback) {
            callback(props, data);
          }else {
            props.setUrlParam( {
              status: 'browse',
              id: pk
            });
            // this.setState({
            //   status:'browse'
            // })
            this.status='browse';
            that.toggleShow();
            if(!hasTbbMsg) {
              toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000024') });/* 国际化处理： 经办保存成功！*/
            }
          }  
        }
      }
    });
  }
  
}

/**
 * 保存新增
 * @param {*} props  页面内置对象
 */
const saveAdd =async function (props) {
  //缓存
  let { addCache ,updateCache} = cardCache;
  let status = props.getUrlParam('status');
  let hasTbbMsg=false;
  let formcheck=props.form.isCheckNow(card_from_id);
  if(!formcheck) {
    return;
  }
  let tablecheck=props.cardTable.checkTableRequired(card_table_id);
  if(!tablecheck) {
    return;
  }
  if (status != 'add' && status != 'edit' && status != 'decide'&&status!='copy') {
    return;
  }
  let saveaddData=this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
  let url = base_url;
  // 暂时不能用
  // let pageCode=props.getSearchParam('p');
  let pageCode=card_page_id;
  
  let data={data: JSON.stringify(saveaddData),pageCode};
  const that = this;
  //新增时保存
  if (status == 'add'||status=='copy') {
    //对主键制空
    this.props.form.setFormItemsValue(card_from_id,{'pk_allocate_h':{'value':null,'display':null}})
    let num=this.props.cardTable.getNumberOfRows(card_table_id);
    for(let i=0;i<num;i++) {
      this.props.cardTable.setValByKeyAndIndex(card_table_id,i,'pk_allocate_b',{'value':null,'display':null});
    }
    saveaddData=this.props.createMasterChildData(card_page_id, card_from_id, card_table_id);
    //ca签名
    console.log(saveaddData, 'sign before saveaddData');
    let result =await Sign({isSign: true, isKey:true, data: saveaddData, encryptVOClassName: 'nccloud.dto.sf.allocation.allocate.AllocateEncryptVO4NCC'});
    if (result.isStop) {
      return;
    }
    saveaddData= result.data;
    console.log(saveaddData, 'sign after saveaddData');
    data={data: JSON.stringify(saveaddData),pageCode};
    url = url + 'save.do';
    ajax({
      url: url,
      data: data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          if (head) {
            that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            //预算提示
            hasTbbMsg=showTBBMsg(head, card_from_id);
          }
          if (body) {
            that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
          }
          let pk = head[card_from_id].rows[0].values.pk_allocate_h.value;
          // that.setState({
            this.billId= pk
          // });
          //保存成功放到缓存中
          addCache(pk,res.data,card_from_id,dataSource);
          
          this.billno='';
          props.setUrlParam( {
            status: 'add',
            from: 'card',
            interfaceJump:'card'
          });
          this.componentDidMount();
          if(!hasTbbMsg) {
            toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000025') });/* 国际化处理： 保存新增成功！*/
            return;
          }
        }
      }
    });

  }
  //修改时保存
  else if (status == 'edit') {
    console.log(saveaddData, 'sign before saveaddData');
    let result =await Sign({isSign: true, isKey:true, data: saveaddData, encryptVOClassName: 'nccloud.dto.sf.allocation.allocate.AllocateEncryptVO4NCC'});
    if (result.isStop) {
      return;
    }
    saveaddData= result.data;
    console.log(saveaddData, 'sign after saveaddData');
    data={data: JSON.stringify(saveaddData),pageCode};
    url = url + 'update.do';
    ajax({
      url: url,
      data: data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          if (head) {
            that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            //预算提示
            hasTbbMsg=showTBBMsg(head, card_from_id);
          }
          if (body) {
            that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
          }
          let pk = head[card_from_id].rows[0].values.pk_allocate_h.value;
          // that.setState({
            this.billId= pk
          // });
          //保存成功放到缓存中
          updateCache('pk_allocate_h',pk,res.data,card_from_id,dataSource);
          
          // this.setState({
          //   billno:''
          // });
          this.billno='';
          props.setUrlParam( {
            status: 'add',
            from: 'card',
            interfaceJump:'card'
          });
          this.componentDidMount();
          if(!hasTbbMsg) {
            toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000023') });/* 国际化处理： 修改保存成功！*/
            return;
          }
        }
      }
    });
  }
  //经办时保存
  else if (status == 'decide') {
    console.log(saveaddData, 'sign before saveaddData');
    let result =await Sign({isSign: true, isKey:true, data: saveaddData, encryptVOClassName: 'nccloud.dto.sf.allocation.allocate.AllocateEncryptVO4NCC'});
    if (result.isStop) {
      return;
    }
    saveaddData= result.data;
    console.log(saveaddData, 'sign after saveaddData');
    data={data: JSON.stringify(saveaddData),pageCode};
    url = url + 'update.do';
    ajax({
      url: url,
      data: data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          if (head) {
            that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            //预算提示
            hasTbbMsg=showTBBMsg(head, card_from_id);
          }
          if (body) {
            that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
          }
          let pk = head[card_from_id].rows[0].values.pk_allocate_h.value;
          // that.setState({
            this.billId= pk
          // });
          //保存成功放到缓存中
          updateCache('pk_allocate_h',pk,res.data,card_from_id,dataSource);
          
          // this.setState({
          //   billno:''
          // });
          this.billno='';
          props.setUrlParam( {
            status: 'add',
            from: 'card',
            interfaceJump:'card'
          });
          this.componentDidMount();
          if(!hasTbbMsg) {
            toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000024') });/* 国际化处理： 经办保存成功！*/
            return;
          }
        }
      }
    });
  }
  
}


/**
 * 界面重绘
 * @param {*} props 
 */
export const repaintView = function (props) {
  //从地址栏获取状态
  let status = props.getUrlParam("status");
  //判断是否是浏览态
  let viewmode = status === 'browse' ? 'browse' : 'edit';
  //设置页面组件的显示状态
  props.form.setFormStatus(card_from_id, viewmode);
  props.cardTable.setStatus(card_table_id, viewmode);
  let iscopy = props.getUrlParam('isCopy');
  let orgedit = (status == 'add' && !iscopy);
  //非新增状态，组织不可编辑
  props.form.setFormItemsDisabled(card_from_id, { 'pk_org': !orgedit });
  //处理按钮
  buttonVisible(props);
}

/**
 * 退回界面重绘
 * @param {*} props 
 */
const returnRepaintView = function (props) {
  let currID = { id: props.getUrlParam('id'), status: 3 };
  let nextID = props.cardPagination.getNextCardPaginationId(currID);
  cardCache.deleteCacheById('pk_allocate_h',currID,dataSource);
  //如果有下一条数据则加载下一条数据，否则返回列表界面
  if (nextID) {
    props.cardPagination.setCardPaginationId(currID);
    // this.billId=nextID;
    // this.componentDidMount();
    pageInfoClick.call(this, props, nextID);
  } else {
    props.pushTo("/list", {
      pagecode:list_page_id
		});
  }
}

/**
 * 分录作废
 */
const doEntryCancel = function(props){
  let tablesDatas = props.cardTable.getCheckedRows(card_table_id);

  if(tablesDatas.length > 0){
    let canOpera = false
    //处理选择数据（支付失败且未作废）
    tablesDatas.forEach((val) => {
      let paystatus = val.data.values.paystatus;
      let recordstatus = val.data.values.recordstatus;
      if(paystatus && paystatus.value && paystatus.value == 4 
        && recordstatus && recordstatus.value && recordstatus.value == 1){
          canOpera = true;
      }
      return;
  });
  if(!canOpera){
    toast({ color: 'warning', content:loadMultiLang(this.props,'1880000025-000018')})/* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*//* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*/
    return;
  }else{
    props.modal.show('commonModel',{
      title:loadMultiLang(this.props,'1880000025-000019'),/* 国际化处理： 分录作废*//* 国际化处理： 分录作废*/
      content:loadMultiLang(this.props,'1880000025-000020'),/* 国际化处理： 对选中的表体行进行分录作废?*//* 国际化处理： 对选中的表体行进行分录作废?*/
      //点击确定按钮事件
      beSureBtnClick: this.buttonClick.bind(this, props ,'recorddisuseConfirm'),
    });
  }
}else{
  let allCardData = props.cardTable.getAllRows(card_table_id)
  let canOperaAll = false;
    //处理选择数据
    allCardData.forEach((val) => {
        let paystatus = val.values.paystatus;
        let recordstatus = val.values.recordstatus;
        if(paystatus && paystatus.value && paystatus.value == 4 
            && recordstatus && recordstatus.value && recordstatus.value == 1){
              canOperaAll = true;
        }        
    });
    if(!canOperaAll){
      toast({ color: 'warning', content:loadMultiLang(this.props,'1880000025-000018')})/* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*//* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*/
      return;
    }else{
      props.modal.show('commonModel',{
      title:loadMultiLang(this.props,'1880000025-000019'),/* 国际化处理： 分录作废*//* 国际化处理： 分录作废*/
      content:loadMultiLang(this.props,'1880000025-000021'),/* 国际化处理： 对整张下拨单进行分录作废?*//* 国际化处理： 对整张下拨单进行分录作废?*/
      //点击确定按钮事件
      beSureBtnClick: this.buttonClick.bind(this, props ,'recorddisuseConfirm'),
    });
  }
}
}

/**
 * 分录作废确认
 * @param  props 
 */
const doRecorddisuseConfirm = function(props,entrycancelBill){
  debugger
  let recordunuse_pk = props.form.getFormItemsValue(card_from_id,"pk_allocate_h")
  let recordunuse_ts = props.form.getFormItemsValue(card_from_id,"ts")
  let recordunuse_selectRows
  let recordunuse_pkbs = []
  
  //如果是对整张单据作废
  if(entrycancelBill){
    recordunuse_selectRows = props.cardTable.getAllRows(card_table_id)
    recordunuse_selectRows.forEach((val) => {
      let paystatus = val.values.paystatus;
      let recordstatus = val.values.recordstatus;
      if(paystatus && paystatus.value && paystatus.value == 4 
              && recordstatus && recordstatus.value && recordstatus.value == 1){
        //子表主键数组
        recordunuse_pkbs.push(val.values.pk_allocate_b.value);
      }   
    });
  }
  //如果是对选择的表体行进行作废
  else{
    recordunuse_selectRows = props.cardTable.getCheckedRows(card_table_id)
    recordunuse_selectRows.forEach((val) => {
      let paystatus = val.data.values.paystatus;
      let recordstatus = val.data.values.recordstatus;
      if(paystatus && paystatus.value && paystatus.value == 4 
              && recordstatus && recordstatus.value && recordstatus.value == 1){
        //子表主键数组
        recordunuse_pkbs.push(val.data.values.pk_allocate_b.value);
      }   
    });
  }  

  let recordunuse_data = {
    pk:recordunuse_pk && recordunuse_pk.value,
    ts:recordunuse_ts && recordunuse_ts.value,
    pageid:card_page_id,
    isCardOpt: true,
    pkbs:recordunuse_pkbs
  }

  ajax({
    url: '/nccloud/sf/allocation/allocaterecorddisuse.do',
    data: recordunuse_data,
    success: (res) => {
      if (res.success) {
        if(res.data){
          toast({ color: 'success', content:loadMultiLang(this.props,'1880000025-000026')})/* 国际化处理： 分录作废成功*//* 国际化处理： 分录作废成功*/
          if (res.data.head) {
            props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
            cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
          }
          if (res.data.body) {
            props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
          }
        }
      //  doRefresh.call(this,props);
      }
    }
  });
}


/**
 * 再次手工支付确认
 * @param  props 
 */
const doAgainHandWorkPayConfirm = function(props,isBill){
  debugger
  let paybillpk = props.form.getFormItemsValue(card_from_id,"pk_allocate_h");
  let billts = props.form.getFormItemsValue(card_from_id,"ts");
  let pkbs=[]; 
  let handpayrows
  //是否对整张单据进行再次手工支付
  if(isBill){
    handpayrows = props.cardTable.getAllRows(card_table_id); //获取所有的表体数据 
    if(handpayrows  &&  handpayrows.length > 0){
      handpayrows.forEach((val) => {      
        pkbs.push(val && val.values && val.values.pk_allocate_b && val.values.pk_allocate_b.value);
      });
    }
  }
  else{
    handpayrows = props.cardTable.getCheckedRows(card_table_id); //获取选中的表体数据 
    if(handpayrows  &&  handpayrows.length > 0){
      handpayrows.forEach((val) => {      
        pkbs.push(val && val.data && val.data.values && val.data.values.pk_allocate_b && val.data.values.pk_allocate_b.value);
      });
    }
  }
   
  
  ajax({
    url: "/nccloud/sf/allocation/allocatepayagain.do",
    data: { 
      pk:paybillpk && paybillpk.value,
      pkbs:pkbs,
      ts:billts && billts.value,
      isCardOpt:true,
      pageid: card_page_id
    },
    success: (res) => {      
      if (res.success) {
        if(res.data){
          toast({ color: 'success', content:loadMultiLang(this.props,'1880000025-000027')})/* 国际化处理： 再次手工支付成功*//* 国际化处理： 再次手工支付成功*/
          if (res.data.head) {
            props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
            cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
          }
          if (res.data.body) {
            props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
          }
        }
        // doRefresh.call(this,props);    
    }
  }
  });

}



/**
 * 支付状态
 * @param  props 
 */
const doPayStatus = function(props){
  let paystatus_pk = props.form.getFormItemsValue(card_from_id,"pk_allocate_h")
  let paystatus_selectrows = props.cardTable.getAllRows(card_table_id)
  let paystaus_ts = props.form.getFormItemsValue(card_from_id,'ts')
  let paystatus_pkbs = []
  
  paystatus_selectrows.forEach((val) => {
    //子表主键数组
    paystatus_pkbs.push(val.values.pk_allocate_b.value);
  });
  let paystatus_data = {
    pk:paystatus_pk && paystatus_pk.value,
    ts:paystaus_ts && paystaus_ts.value,
    pageid:card_page_id,
    isCardOpt:true,
    pkbs:paystatus_pkbs
  }
  ajax({
    url: '/nccloud/sf/allocation/allocatequerypaystatus.do',
    data: paystatus_data,
    success: (res) => {
      if (res.success) {
        if(res.data){
          toast({ color: 'success', content:loadMultiLang(this.props,'1880000025-000028')})/* 国际化处理： 获取支付状态成功*/
            if (res.data.head) {
              props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
              cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), res.data, card_from_id, dataSource);
            }
            if (res.data.body) {
              props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
            }
        }

      }
    }
  });
}


/**
 * 联查 委托付款
 * @param  props 
 */
const doEntrustpay =function(props){
  let entrustpay_pk_srcbill = props.form.getFormItemsValue(card_from_id,"pk_srcbill");
  let entrustpay_srcbusitype = props.form.getFormItemsValue(card_from_id, 'srcbusitype');
  if(entrustpay_srcbusitype && entrustpay_srcbusitype.value && entrustpay_srcbusitype.value != 3){
    toast({ color: 'warning', content:loadMultiLang(this.props,'36320FA-000034')})/* 国际化处理： 单据不是回拨生成的，无法联查委托付款书*/
    return;
  }
  
  let entrustpayArr = [];
  //数据校验
  if (entrustpay_pk_srcbill && entrustpay_pk_srcbill.value) {
    entrustpayArr.push(entrustpay_pk_srcbill.value);
  }else{
    toast({ color: 'warning', content:loadMultiLang(this.props,'36320FA-000035')})/* 国际化处理： 该单据无来源单据*/
    return;
  }
  let entrustpaywfExtParam = {
    status: 'browse',
    id: entrustpay_pk_srcbill.value
  };
  linkApp(props, "36J1",entrustpaywfExtParam);
}

/**
 * 刷新
 * @param  props 
 */
const doRefresh = function(props){
  this.qryData();
}

/**
 * 网银浏览
 */
const ebankBrowse = function (props){
  let pk_allocate_e_bank_browse = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let ts_e_bank_browse = props.form.getFormItemsValue(card_from_id, 'ts');
  let data_e_bank_browse = {
      "pk": pk_allocate_e_bank_browse && pk_allocate_e_bank_browse.value,
      "ts": ts_e_bank_browse && ts_e_bank_browse.value,
      "pageid": card_page_id
  };
  ajax({
      url: '/nccloud/sf/allocation/allocatenetbankbrowse.do',
      data: data_e_bank_browse,
      success: (res) => {
          if (res && res.data) {
          this.setState(
              {
              onLineData: res.data || [],
              modelType: SHOWMODEL_LIULAN
              }, () => {
              this.setState({ showBuLu: true });
              });
          }
      }
  });
}

/**
 * 网银补录
 */
const ebankBulu = function(props,isMergepay){
  let pk_allocate_e_bank = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let ts_e_bank = props.form.getFormItemsValue(card_from_id, 'ts');
  let data_e_bank = {
      "pk": pk_allocate_e_bank && pk_allocate_e_bank.value,
      "ts": ts_e_bank && ts_e_bank.value,
      "pageid": card_page_id
  };

  if(isMergepay){
    this.setState({
      modelType: PAYMODEL_COMBINEPAY,
    })
  }else{
    this.setState({
      modelType: SHOWMODEL_BULU,
    })
  }


  ajax({
      url: '/nccloud/sf/allocation/allocatenetbankrewrite.do',
      data: data_e_bank,
      success: (res) => {
          if (res && res.data) {
          this.setState(
              {
              isMergepay:isMergepay,
              onLineData: res.data || [],
              }, () => {
              this.setState({ showBuLu: true });
              });
          }
      }
  });
}

/**
 * 支付(校验后)
 */
const pay = async function(props,isNetpay) {
  let payresult = await Sign({
    isSign: false,
    isKey: isNetpay,
    data: null,
    encryptVOClassName: null
  });
  if (payresult.isStop) {
    return;
  }

  let pk_allocate_pay = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let ts_pay = props.form.getFormItemsValue(card_from_id, 'ts');
  let pkMapTs = {}

  if (pk_allocate_pay.value && ts_pay.value) {
      pkMapTs[pk_allocate_pay.value] = ts_pay.value;
  }


  let data_pay = {
      "pkMapTs":pkMapTs,
      "pageid": card_page_id,
      'isCardOpt': true,
      "isValidate":false
  };

  ajax({
      url: '/nccloud/sf/allocation/allocatepay.do',
      data: data_pay,
      success: (res) => {
          let { success, data } = res;
          if (success) {
            if(data.errorMsg){
              toast({ color: 'warning', content: data.errorMsg });
              return;
            }
            else if(data.interactMsg){
              props.modal.show('payModel',{
                title: loadMultiLang(this.props,'1880000025-000029'),/* 国际化处理： 支付*//* 国际化处理： 支付*/
                content: data.interactMsg,
                //点击确定按钮事件
                beSureBtnClick: buttonClick.bind(this, props ,'paybtnconfirm'),
              });
            }
            else if(data.successMsg){
              if(data.billCard){
                toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000014')});/* 国际化处理： 支付成功*//* 国际化处理： 支付成功*/
                this.componentDidMount();
                if (data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
                  cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), data.billCard, card_from_id, dataSource);
                }
                if (data.billCard.body) {
                  props.cardTable.setTableData(card_table_id, data.billCard.body[card_table_id]);
                }              
              }
            }
           }
      }
  });
}


/**
 * 取消支付
 * @param  props 
 */ 
const doCancelPay = function(props){
  let payCancelpk = props.form.getFormItemsValue(card_from_id,"pk_allocate_h").value;
  let billCancelts = props.form.getFormItemsValue(card_from_id,"ts").value;
  let pkMapTs_paycancel = {};
  pkMapTs_paycancel[payCancelpk] = billCancelts
  
  ajax({
    url: "/nccloud/sf/allocation/allocateunpay.do",
    data: { 
      pkMapTs:pkMapTs_paycancel,
      pageid: card_page_id,
      isCardOpt: true,
    },
    success: (res) => {      
      let { success, data } = res;
      if(success){
        if(data.successMsg){
          toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000030')});/* 国际化处理： 取消支付成功*//* 国际化处理： 取消支付成功*/
          this.componentDidMount();
        }else if(data.errorMsg){
          toast({ color: 'warning', content: data.errorMsg });
      }
    }     
  }
  });

}


/**
 * 合并支付(校验后)
 * @param  props 
 */
const doPayMerge = async function(props,isNetpay){
  let payresult = await Sign({
    isSign: false,
    isKey: isNetpay,
    data: null,
    encryptVOClassName: null
  });
  if (payresult.isStop) {
    return;
  }
  let pk_allocate_pay = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
  let ts_pay = props.form.getFormItemsValue(card_from_id, 'ts');
  let data_pay = {
      "pk": pk_allocate_pay && pk_allocate_pay.value,
      "ts": ts_pay && ts_pay.value,
      "pageid": card_page_id,
      'isCardOpt': true,
      'isValidate':false
  };

  ajax({
      url: '/nccloud/sf/allocation/allocatemergepay.do',
      data: data_pay,
      success: (res) => {
          let { success, data } = res;
          if (success) {
            if(data.errorMsg){
              toast({ color: 'warning', content: data.errorMsg });
            }
            else if(data.interactMsg){
                props.modal.show('payModel',{
                    title: loadMultiLang(this.props,'1880000025-000029'),/* 国际化处理： 支付*//* 国际化处理： 支付*/
                    content: data.interactMsg,
                    //点击确定按钮事件
                    beSureBtnClick: buttonClick.bind(this, props ,'mergepayconfirm'),
                });
            }           
            else if(data.successMsg){
              toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000021')})/* 国际化处理： 合并支付成功*/
                if(data.billCard.head){
                  props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
                  cardCache.updateCache('pk_allocate_h', props.getUrlParam('id'), data.billCard, card_from_id, dataSource);
                }
                if(data.billCard.body){
                  props.cardTable.setTableData(card_table_id, data.billCard.body[card_table_id]);
                }            
            }                       
          }
      }
  });
}

const doPayConfirm = function(props){
  let payconfirmcheckrows = props.cardTable.getCheckedRows(card_table_id)

  if (payconfirmcheckrows.length != 1) {
    toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000031')})/* 国际化处理： 请选择一条表体数据操作!*//* 国际化处理： 请选择一条表体数据操作!*/
    return;
  }else{
    //处理选择数据
    let paystatus = payconfirmcheckrows[0].data.values.paystatus.value;
    let netpayinfo = payconfirmcheckrows[0].data.values.netpayinfo.value;
    if(!paystatus || paystatus != 2){
      toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000032')})/* 国际化处理： 请选择支付状态为支付中的表体进行操作!*//* 国际化处理： 请选择支付状态为支付中的表体进行操作!*/
      return;
    }else if(!netpayinfo){
      toast({ color: 'warning', content:loadMultiLang(this.props,'1880000025-000033')})/* 国际化处理： 请先下载支付指令状态!*//* 国际化处理： 请先下载支付指令状态!*/
      return;
    }
    let pk_allocate_bArr = [];
    pk_allocate_bArr.push(payconfirmcheckrows[0].data.values.pk_allocate_b);

    let payconfirmpk_h = props.form.getFormItemsValue(card_from_id, 'pk_allocate_h');
    let payconfirmpk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
    let payconfirmpk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
    let payconfirmvbillno = props.form.getFormItemsValue(card_from_id, 'srcbillcode');
    // 支付确认
    props.openTo('/obm/ebankconfirmpay/confirmpay/main/index.html#/card', {
      billtype: '36CC',
      pagecode: '36100CONFM_C01',
      appcode: '36100CONFM',
      status: 'add',
      /** 组织 */
      pk_org: payconfirmpk_org && payconfirmpk_org.value, 
      /** 集团 */
      pk_group: payconfirmpk_group && payconfirmpk_group.value, 
      /** 来源单据编号 */
      srcbillcode: payconfirmvbillno && payconfirmvbillno.value, 
      /** 来源单据类型 */
      srcbilltype:'36K2', 
      /** 来源单据节点号 */
      srcnodecode:'36320FA', 
      /** 来源单据主表PK */
      srcpkid: payconfirmpk_h && payconfirmpk_h.value, 
      /** 来源系统 */
      srcsystem: 'SF', 
      /** 指令参考号 */
      yurref: payconfirmcheckrows[0].data.values.pk_allocate_b.value, 
    });
    doRefresh.call(this,props)
  }
}

/**
 * 联查 内部户余额
 * @param  props 
 */
const doInnerAccountBlance = function(props){
  let InnerAccountBlance_busitype = props.form.getFormItemsValue(card_from_id, 'busitype');
  if(InnerAccountBlance_busitype && InnerAccountBlance_busitype.value && InnerAccountBlance_busitype.value != 2){
    toast({ color: 'warning', content:loadMultiLang(this.props,'1880000025-000034')});/* 国际化处理： 非中心下拨的单据不能联查内部账户余额*/
    return;
  }

  const selectDatas = props.cardTable.getCheckedRows(card_table_id); //获取当前选中行数据
  //判断是否有选中行
  if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
    toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000035')});/* 国际化处理： 请选中表体的一行数据*/
    return;
  }
  let pkInnerAccount = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_accid_r'] && selectDatas[0].data.values['pk_accid_r'].value;
  if(pkInnerAccount){
    this.setState({
      showAccModal: !this.state.showAccModal,
      pkInnAccount: pkInnerAccount
    });
  }else{
    toast({ color: 'warning', content:loadMultiLang(this.props,'1880000025-000036')});/* 国际化处理： 选中的表体内部账户为空*/
  }
  
}

/**
 * 联查 收款账户
 * @param  props 
 */
const doGetPaymentAccount = function(props){
  let bankaccbalance_rarr = [];
  let paymentAccountAllrows = props.cardTable.getAllRows(card_table_id)
  let paymentAccountSelectrow = props.cardTable.getCheckedRows(card_table_id)
  
      let restpk_org_r, pk_bankacc_r, bankacc_rrestkey;

      if(paymentAccountAllrows.length > 1){
        if (paymentAccountSelectrow.length != 1) {
          toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000037')});     /* 国际化处理： 请选择一条表体数据操作*/
          return;
        }else{
          //处理选择数据
          paymentAccountSelectrow.forEach((val) => {
            bankacc_rrestkey = val.data.values.pk_allocate_b.value;
            if (val.data.values.pk_bankacc_r 
              && val.data.values.pk_bankacc_r.value) {
                pk_bankacc_r = val.data.values.pk_bankacc_r.value;
                restpk_org_r = val.data.values.pk_org_r.value;
                
            }

            let bankaccbalance_rdata = {
              // 财务组织
              pk_org: restpk_org_r,
              // 银行账户id
              pk_account: pk_bankacc_r,
            };
            bankaccbalance_rarr.push(bankaccbalance_rdata);
          });
        }
      }else{
        bankacc_rrestkey = paymentAccountAllrows[0].values.pk_allocate_b.value;
        if (paymentAccountAllrows[0].values.pk_bankacc_r 
          && paymentAccountAllrows[0].values.pk_bankacc_r.value) {
            pk_bankacc_r = paymentAccountAllrows[0].values.pk_bankacc_r.value;
        }
        if (paymentAccountAllrows[0].values.pk_org_r 
          && paymentAccountAllrows[0].values.pk_org_r.value) {
            restpk_org_r = paymentAccountAllrows[0].values.pk_org_r.value;
        }

        let bankaccbalance_rdata = {
          // 财务组织
          pk_org: restpk_org_r,
          // 银行账户id
          pk_account: pk_bankacc_r,
        };
        bankaccbalance_rarr.push(bankaccbalance_rdata);
      }
      this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true,
      });
}


/**
 * 联查 付款账户
 * @param  props 
 */
const doPaymentAccount = function(props){
  let bankaccbalance_parr = [];
  let paymentAccountAllrows = props.cardTable.getAllRows(card_table_id)
  let paymentAccountSelectrow = props.cardTable.getCheckedRows(card_table_id)
  let restpk_org_p, pk_bankacc_p;
  let bankacc_prestkey;
  if (props.form.getFormItemsValue(card_from_id, 'pk_org') 
        && props.form.getFormItemsValue(card_from_id, 'pk_org').value) {
          restpk_org_p = props.form.getFormItemsValue(card_from_id, 'pk_org').value;
      }
  if(paymentAccountAllrows.length > 1){
    if (paymentAccountSelectrow.length != 1) {
      toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000037')});/* 国际化处理： 请选择一条表体数据操作*/
      return;
    }else{
      //处理选择数据
      paymentAccountSelectrow.forEach((val) => {
        bankacc_prestkey = val.data.values.pk_allocate_b.value;
        //处理选择数据
        if (val.data.values.pk_bankacc_p 
          && val.data.values.pk_bankacc_p.value) {
            pk_bankacc_p = val.data.values.pk_bankacc_p.value;
        }

        let bankaccbalance_pdata = {
          // 财务组织
          pk_org: restpk_org_p,
          // 银行账户id
          pk_account: pk_bankacc_p,
        };
        bankaccbalance_parr.push(bankaccbalance_pdata);
      });
    }
  }else{
    bankacc_prestkey = paymentAccountAllrows[0].values.pk_allocate_b.value;
    //处理选择数据
    if (paymentAccountAllrows[0].values.pk_bankacc_p 
      && paymentAccountAllrows[0].values.pk_bankacc_p.value) {
        pk_bankacc_p = paymentAccountAllrows[0].values.pk_bankacc_p.value;
    }

    let bankaccbalance_pdata = {
      // 财务组织
      pk_org: restpk_org_p,
      // 银行账户id
      pk_account: pk_bankacc_p,
    };
    bankaccbalance_parr.push(bankaccbalance_pdata);
  }

  this.setState({
    showOriginalData: bankaccbalance_parr,
    showOriginal: true,
  });
}

/**
 * 联查 审批详情
 * @param  props 
 */
const doApprove =function(props){
  let billid = props.form.getFormItemsValue(card_from_id,"pk_allocate_h");
  let billtype = props.form.getFormItemsValue(card_from_id,"pk_billtype");
  this.billId=billid && billid.value;
  // this.billno=billtype && billtype.value;
  this.setState({
        approveshow: !this.state.show
      // billId:billid && billid.value,
      // billtype:billtype && billtype.value
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
    this.status='browse';
    
    this.toggleShow();
    // doRefresh.call(this,props)
  }
}

// 编辑保存是取消按钮确认框
const cancelConfirm = function(props) {
		
  if (props.getUrlParam('status') == 'edit') {
    // 表单返回上一次的值
    props.form.cancel(card_from_id);
    // 表格返回上一次的值
    props.setUrlParam({
      status: 'browse',
      id: props.getUrlParam('id'),
      interfaceJump:'card'
    });
    this.componentDidMount();
  }
  //保存中的取消操作
  else if (props.getUrlParam('status') == 'add') {
    let id=props.getUrlParam('id');
    if(!id) {
    id=this.billId;
    }
    props.setUrlParam({
    id: id,
    status: 'browse',
    interfaceJump:'card'
    });
    this.componentDidMount();
  }
  //复制中的取消操作
  else if (props.getUrlParam('status') == 'copy') {
    let id=props.getUrlParam('id');
    if(!id) {
      id=this.billId;
    }
    props.setUrlParam({
      id: id,
      status: 'browse',
      interfaceJump:'card'
    });
    this.componentDidMount();
  }
  // 经办
  else if (props.getUrlParam('status') == 'decide') {
    props.setUrlParam({
      status: 'browse',
      id: props.getUrlParam('id'),
      interfaceJump:'card'
    });
    
    this.componentDidMount();
  }
  //浏览查询详情
  else if (!props.getUrlParam('status')||this.props.getUrlParam('status') == 'browse') {
    props.setUrlParam({
      status: 'browse',
      id: ''
    });
    this.componentDidMount();
  }
};

//退回确认
export const backConfirm =function (props,value){
  if(!value) {
      toast({ color: 'warning', content: loadMultiLang(this.props,'1880000025-000038') });/* 国际化处理： 退回原因必输！*/
      return;
  }
  cardOperator(props, card_page_id, card_from_id,bodyCodeMapBodyPKName,'pk_allocate_h', base_url + 'allocateback.do', loadMultiLang(this.props,'1880000025-000039'), dataSource ,() => {/* 国际化处理： 退回成功！*/
    returnRepaintView.call(this, props);
    this.setState({ showReBack: false});
  });
}

export default buttonClick;



/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/