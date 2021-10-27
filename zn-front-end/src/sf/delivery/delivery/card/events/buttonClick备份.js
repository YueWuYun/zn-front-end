/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, base, toast, output, print, cardCache, promptBox } from 'nc-lightapp-front';

import {
  app_id, appcode, printnodekey,
  card_page_id, card_from_id, card_table_id,
  dataSource, printnodekey_inoffical, printnodekey_offical, url, field, state
} from '../../cons/constant.js';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { afterEvent } from '../events';
import { showTBBMsg } from '../../../../pub/utils/SFButtonUtil';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator } from '../../../../pub/utils/SFButtonUtil.js';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { createSimpleBillData, elecSignCardPrint, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { payBeforeValidate, clsRowno } from "../../util/index";

let { getNextId, getCurrentLastId, deleteCacheById, getCacheById, updateCache, addCache } = cardCache;

async function buttonClick(props, id) {


 // 当前单据的pk zth
 let pk = props.form.getFormItemsValue(this.formId, this.primaryId) && props.form.getFormItemsValue(this.formId, this.primaryId).value;


  let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
  let srcbusitype = this.props.form.getFormItemsValue(this.formId, 'srcbusitype').value;
  let status = props.getUrlParam('status');
  let org_val, org_display;
  if (pk_org && pk_org.value) {
    org_val = pk_org.value;
    org_display = pk_org.display;
  }

  if ((org_val && org_display)) {

  } else {
    if (id === 'cancel' || id === 'add') {

    } else {
      toast({
        'color': 'warning',
        'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
      });
      return;
    }
  }

  let pk_delivery_h = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h');
  let ts = this.props.form.getFormItemsValue(this.formId, 'ts');
  let checkAllCardDate = this.props.cardTable.getAllRows(card_table_id, false);;
  let pk_delivery_b = [];
  let nocheckBodyData = ['add', 'cancel', 'addline', 'delline',
    'copyline', 'save', 'saveadd', 'savecommit'];
  let checkBodyData;
  if (nocheckBodyData.indexOf(id) >= 0) {

  } else {
    checkBodyData = this.props.cardTable.getCheckedRows(card_table_id);
    if (checkBodyData.length > 0) {
      //处理选择数据
      checkBodyData.forEach((val) => {
        //主键数组
        pk_delivery_b.push(val.data.values.pk_delivery_b.value);
      });
    }
  }
  let data = {
    pk: pk_delivery_h && pk_delivery_h.value,
    ts: ts && ts.value,
    pageid: card_page_id,
    isCardOpt: true,
    pkbs: pk_delivery_b,
  }
  debugger;
  let batchdata = {
    pks: [pk_delivery_h && pk_delivery_h.value],
    tss: [ts && ts.value],
    pageid: card_page_id,
    isCardOpt: true,
    pkbs: pk_delivery_b,
  }
  let that = this;
  //begin 适配验证公式添加
  let saveDataForValidate = createSimpleBillData(props, card_page_id, card_from_id, card_table_id, false);
  let saveaddobjForValidate = {};
  //end
  switch (id) {
    // 保存
    case 'save':
      saveaddobjForValidate[card_table_id] = 'cardTable';
      props.validateToSave(saveDataForValidate, this.saveBill.bind(this), saveaddobjForValidate, '');
      // this.saveBill();
      break;
    //保存新增
    case 'saveadd':
      // 采用轻量级的api获取页面数据，去除scale,display
      // let saveaddData = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
      let saveaddData = createSimpleBillData(props, card_page_id, card_from_id, card_table_id, false);
      let saveaddobj = {};
      saveaddobj[card_table_id] = 'cardTable';
      // 验证公式
      props.validateToSave(saveaddData, saveAdd.bind(this, that, props), saveaddobj, '');
      break;
    //保存提交
    case 'savecommit':
      // 采用轻量级的api获取页面数据，去除scale,display
      // let savecommitData = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
      let savecommitData = createSimpleBillData(props, card_page_id, card_from_id, card_table_id, false);
      let savecommitobj = {};
      savecommitobj[card_table_id] = 'cardTable';
      // 验证公式
      props.validateToSave(savecommitData, saveCommit.bind(this, that, props), savecommitobj, '');
      break;
    // 取消
    case 'cancel':
      promptBox({
        /* 国际化处理：取消*/
        title: this.props.MutiInit.getIntl("36320FDA")
          && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000095'),
        color: "warning",
        /* 国际化处理： 是否确任要取消?*/
        content: this.props.MutiInit.getIntl("36320FDA")
          && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000089'),
        beSureBtnClick: this.saveCancelConfirm.bind(this, props)
      });
      break;
    //新增
    case 'add':
      props.pushTo("/card", {
        status: 'add',
        interfaceJump: 'card',
        id: props.getUrlParam('id'),
        pagecode: card_page_id,
      });
      //begin tm tangleic 20190226 卡片肩部按钮的状态恢复初始值
      this.setState({ pasteflag: false });
      //end tanlgeic
      this.componentDidMount();
      this.props.cardTable.addRow(card_table_id);
      clsRowno(this.props, card_table_id);
      break;
    // 修改
    case 'edit':
      let editData = {
        pk: pk_delivery_h && pk_delivery_h.value,
        ts: ts && ts.value,
        pageid: card_page_id,
        status: 'edit',
      }
      ajax({
        url: '/nccloud/sf/delivery/deliveryquerycard.do',
        data: editData,
        success: (res) => {
          if (res.data.head[this.formId].rows[0].values.billstatus.value === '6') {
            if (res.data) {
              props.pushTo("/card", {
                status: 'edit',
                id: props.getUrlParam('id'),
                pagecode: card_page_id,
              });
              if (res.data.head) {
                this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                //页签赋值
                let vbillno = res.data.head[card_from_id].rows[0].values.vbillno;
                this.backvbillno = vbillno && vbillno.value;
                updateCache('pk_delivery_h', res.data.head[card_from_id].rows[0].values.pk_delivery_h.value, res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
              }
              if (res.data.body) {
                this.props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
                for (let index = 0; index < res.data.body[card_table_id].rows.length; index++) {
                  // this.props.cardTable.setEditableByIndex(card_table_id, index, 'isnetpay', res.data.body[card_table_id].rows[index].values.isnetpay.value);
                }
              }
              //begin tm tangleic 20190226 避免标题肩部按钮的问题
              this.setState({
                pasteflag: false
              });
              //end tangleic
              this.toggleShow();
            }
            //设置组织不可以编辑
            this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true });
            // 1=手工录入，2=上收申请生成，3=自动上收生成，4=到账通知生成，5=委托付款取消回拨生成
            let srcbusitype = this.props.form.getFormItemsValue(card_from_id, 'srcbusitype');
            let rowCount = this.props.cardTable.getNumberOfRows(card_table_id);
            if (rowCount > 0) {
              for (var i = 0; i < rowCount; i++) {
                if (srcbusitype == 3) {
                  this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_r', false);
                }
                else if (srcbusitype == 4) {
                  this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_r', false);
                }
                else if (srcbusitype == 5) {
                  this.props.cardTable.setEditableByIndex(card_table_id, i, 'pk_bankacc_r', false);
                }
              }
            }
          }else{
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") 
                    && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--0000124') });/* 国际化处理： 该单据已经被他人修改，请刷新界面，重做业务。*/
          }
        }
      });
      break;
    // 复制
    case 'copy':
      //begin tm tangleic 20190226 避免标题肩部按钮的问题
      this.setState({
        pasteflag: false
      });
      //end tangleic
      props.pushTo("/card", {
        id: props.getUrlParam('id'),
        status: 'copy',
        pagecode: card_page_id,
      });
      this.toggleShow();
      this.refresh();
      break;
    // 删除
    case 'delete':
      promptBox({
        /* 国际化处理：删除*/
        title: this.props.MutiInit.getIntl("36320FDA")
          && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000096'),
        color: "warning",
        content: this.props.MutiInit.getIntl("36320FDA")
          && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000056'),/* 国际化处理： 你确定要删除吗?*/
        beSureBtnClick: this.delConfirm.bind(this, props),
      });
      break;
    // 经办
    case 'decide':
      let decideData = {
        pk: pk_delivery_h && pk_delivery_h.value,
        pageid: card_page_id,
        status: 'decide'
      }
      ajax({
        url: '/nccloud/sf/delivery/deliverydecide.do',
        data: decideData,
        success: (res) => {
          if (res.data) {
            //begin tm tangleic 20190226 避免标题肩部按钮的问题
            this.setState({
              pasteflag: false
            });
            //end tangleic
            props.pushTo("/card", {
              status: 'decide',
              id: pk_delivery_h && pk_delivery_h.value,
              pagecode: card_page_id,
            });
            this.toggleShow();
            this.refresh();
          }
        }
      });
      break;
    // 退回
    case 'back':
      this.setState({
        showBackModal: true
      });
      this.ts = ts && ts.value;
      break;
    // 退回确认
    case 'backconfirm':
      let backdataArr = [];
      backdataArr.push(props.getUrlParam('id'));
      let backData = {
        pks: backdataArr,
        tss: [ts && ts.value],
        pageid: card_page_id,
        isCardOpt: true,
        returnnote: this.state.returnnote,
      };
      ajax({
        url: '/nccloud/sf/delivery/deliveryback.do',
        data: backData,
        success: (res) => {
          if (res.success) {
            if (res.data) {
              this.backvbillno = '';
              toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000006') });/* 国际化处理： 退回成功*/
              let backid = this.props.getUrlParam("id");
              //根据当前id,获取下个id
              /*
              * id：数据主键的值
              * dataSource: 缓存数据命名空间
              */
              let backnextId = getNextId(backid, dataSource);
              //调用删除缓存数据方法
              /*
              * idname: 数据主键的命名
              * id：数据主键的值
              * dataSource: 缓存数据命名空间
              */
              deleteCacheById('pk_delivery_h', backid, dataSource);
              //根据nextId查询下条数据
              //注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
              props.setUrlParam({
                status: 'browse',
                id: backnextId ? backnextId : '',
              });
              this.refresh();
            }
          }
        }
      });
      break;
    // 提交
    case 'commit':
      this.commit();
      break;
    // 收回
    case 'uncommit':
      let uncommitdataArr = [];
      uncommitdataArr.push(props.getUrlParam('id'));
      let uncommitData = {
        pks: uncommitdataArr,
        tss: [ts && ts.value],
        pageid: card_page_id,
        isCardOpt: true,
        pagecode : card_page_id,
        btncode : "uncommit"
      };
      ajax({
        url: '/nccloud/sf/delivery/deliveryuncommit.do',
        data: uncommitData,
        success: (res) => {
          if (res.success) {
            if (res.data && res.data.errorMsg) {
              toast({ color: 'warning', content: res.data.errorMsg });
            } else {
              toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000008') });/* 国际化处理： 收回成功*/
              if (res.data.billCard.head) {
                props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
              }
              if (res.data.billCard.body) {
                props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
              }
              props.setUrlParam({
                status: 'browse',
                id: pk_delivery_h && pk_delivery_h.value,
                pagecode: card_page_id,
              })
              this.toggleShow();
            }
          }
        }
      });
      break;
    // 制证
    case 'voucher':
      let voucherdataArr = [];
      voucherdataArr.push(props.getUrlParam('id'));
      let voucherData = {
        pks: voucherdataArr,
        tss: [ts && ts.value],
        pageid: card_page_id,
        isCardOpt: true,
        pagecode : card_page_id,
        btncode : "voucher"
      };
      ajax({
        url: '/nccloud/sf/delivery/deliverymakevoucher.do',
        data: voucherData,
        success: (res) => {
          let { success, data } = res;
          if (success) {
            if (data.errorMsg) {
              toast({ color: 'warning', content: data.errorMsg });
            }
            else if (data.warningMsg) {
              toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000009') });/* 国际化处理： 制证成功*/
              if (res.data.billCard.head) {
                props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
              }
              if (res.data.billCard.body) {
                props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
              }
              props.setUrlParam({
                status: 'browse',
                id: pk_delivery_h && pk_delivery_h.value,
                pagecode: card_page_id,
              })
              this.toggleShow();
            }
            else if (data.successMsg) {
              toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000009') });/* 国际化处理： 制证成功*/
              if (res.data.billCard.head) {
                props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
              }
              if (res.data.billCard.body) {
                props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
              }
              props.setUrlParam({
                status: 'browse',
                id: pk_delivery_h && pk_delivery_h.value,
                pagecode: card_page_id,
              })
              this.toggleShow();
            }
          }
        }
      });
      break;
    // 取消制证
    case 'cancelvoucher':
      let cancelvoucherdataArr = [];
      cancelvoucherdataArr.push(props.getUrlParam('id'));
      let cancelvoucherData = {
        pks: cancelvoucherdataArr,
        tss: [ts && ts.value],
        pageid: card_page_id,
        isCardOpt: true,
        pagecode : card_page_id,
        btncode : "cancelvoucher"
      };
      ajax({
        url: '/nccloud/sf/delivery/deliverycancelvoucher.do',
        data: cancelvoucherData,
        success: (res) => {
          let { success, data } = res;
          if (success) {
            if (data.errorMsg) {
              toast({ color: 'warning', content: data.errorMsg });
            }
            else if (data.warningMsg) {
              toast({ color: 'warning', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000010') });/* 国际化处理： 取消制证成功*/
              if (res.data.billCard.head) {
                props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
              }
              if (res.data.billCard.body) {
                props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
              }
              props.setUrlParam({
                status: 'browse',
                id: pk_delivery_h && pk_delivery_h.value,
                pagecode: card_page_id,
              })
              this.toggleShow();
            }
            else if (data.successMsg) {
              toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000010') });/* 国际化处理： 取消制证成功*/
              if (res.data.billCard.head) {
                props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
              }
              if (res.data.billCard.body) {
                props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
              }
              props.setUrlParam({
                status: 'browse',
                id: pk_delivery_h && pk_delivery_h.value,
                pagecode: card_page_id,
              })
              this.toggleShow();
            }
          }
        }
      });
      break;
    // 网银浏览
    case 'netbankbrowse':
      ajax({
        url: '/nccloud/sf/delivery/deliverynetbankbrowse.do',
        data: data,
        success: (res) => {
          if (res && res.data) {
            this.setState(
              {
                onLineData: res.data || [],
                modelType: SHOWMODEL_LIULAN,
              }, () => {
                this.setState({ showBuLu: true });
              });
          }
        }
      });
      break;
    // 网银补录
    case 'netbankbulu':
      ajax({
        url: '/nccloud/sf/delivery/deliverynetbankrewrite.do',
        data: data,
        success: (res) => {
          if (res && res.data) {
            if (res.data && res.data.errormsg) {
              toast({ color: 'warning', content: res.data.errormsg });
              return;
            } else {
              if (res.data[0] && res.data[0].yurref) {
                this.setState(
                  {
                    onLineData: res.data || [],
                    modelType: SHOWMODEL_BULU,
                  }, () => {
                    this.setState({ showBuLu: true });
                  });
              } else {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000084') });/* 国际化处理： 请选择已经网银补录过的单据进行操作！*/
              }
            }
          }
        }
      });
      break;
    // 支付
    case 'pay':
      let ismendinfofull_pay = this.props.form.getFormItemsValue(this.formId, 'ismendinfofull');
      let isKey_pay = false;
      if (ismendinfofull_pay && ismendinfofull_pay.value) {
        isKey_pay = true;
      }
      // let payBeforeData = await payBeforeValidate(this.props, batchdata);
      // if (payBeforeData) {
      //   if (payBeforeData.errorMsg) {
      //     toast({ color: 'warning', content: payBeforeData.errorMsg });
      //     return;
      //   }
      //   else if (payBeforeData.interactMsg) {
      //     promptBox({
      //       color: "warning",
      //       content: payBeforeData.interactMsg,
      //       beSureBtnClick: buttonClick.bind(this, props, 'payBtnConfirm'),
      //     });
      //   }
      //   else if (payBeforeData.successMsg) {
        // var date = new Date();
        // var now = date.getTime();               
        // var endDate = new Date(time);//设置截止时间
        // var end = endDate.getTime();
        // var leftTime = end - now; //时间差  
          console.log("-----签名开始");
          let beginSign = new Date().getMilliseconds();
          console.log(beginSign);
          let payresult = await Sign({
            isSign: true,
            isKey: isKey_pay,
            data: null,
            encryptVOClassName: null,
            primaryId: [pk_delivery_h && pk_delivery_h.value],
          });
          let endSign = new Date().getMilliseconds();
          console.log(endSign);
          console.log("-----签名结束");
          console.log(endSign - beginSign);
          console.log("-----签名处理开始");
          let begin = new Date().getMilliseconds();
          console.log(begin);
          if (payresult.isStop) {
            return;
          }
            batchdata.sign_strSrc = payresult.data.text,
            batchdata.signature = payresult.data.signText,
            batchdata.sing_sn = payresult.data.userjson,
            batchdata.pagecode = card_page_id,
            batchdata.btncode = "pay",
            console.log();
            let end = new Date().getMilliseconds();
            console.log(end);
            console.log("-----签名处理结束");
            console.log(end - begin);
            console.log("-----支付开始");
            let paybegin = new Date().getMilliseconds();
            console.log(paybegin);
            ajax({
              url: '/nccloud/sf/delivery/deliverypay.do',
              data: batchdata,
              success: (res) => {
                let { success, data } = res;
                if (success) {
                  if (data.errorMsg) {
                    toast({ color: 'warning', content: data.errorMsg });
                  }
                  else if (data.interactMsg) {
                    promptBox({
                      color: "warning",
                      content: data.interactMsg,
                      beSureBtnClick: buttonClick.bind(this, props, 'payBtnConfirm'),
                    });
                  }
                  else if (data.warningMsg) {
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011') + data.warningMsg });/* 国际化处理： 支付成功*/
                  }
                  else if (data.successMsg) {
                    if (data.billCard) {
                      toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011') });/* 国际化处理： 支付成功*/
                      if (data.billCard.head) {
                        props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
                        updateCache('pk_delivery_h', props.getUrlParam('id'), data.billCard, card_from_id, dataSource);
                      }
                      if (data.billCard.body) {
                        props.cardTable.setTableData(card_table_id, data.billCard.body[card_table_id]);
                      }
                      // if (res.data.body) {
                      //   props.cardTable.updateDataByRowId(card_table_id, data.billCard.body[card_table_id]);
                      // }
                      props.setUrlParam({
                        status: 'browse',
                        id: pk_delivery_h && pk_delivery_h.value,
                      })
                      this.toggleShow();
                    }
                  }
                }

                let payend = new Date().getMilliseconds();
                console.log(payend);
                console.log("-----支付结束");
                console.log( payend - paybegin);              }
            });
           
      //   }
      // }
      break;
    // 支付按钮点确认
    case 'payBtnConfirm':
      let ismendinfofull_payBtnConfirm = this.props.form.getFormItemsValue(this.formId, 'ismendinfofull');
      let isKey_payBtnConfirm = false;
      if (ismendinfofull_payBtnConfirm && ismendinfofull_payBtnConfirm.value) {
        isKey_payBtnConfirm = true;
      }
      let payBtnConfirmresult = await Sign({
        isSign: true,
        isKey: isKey_payBtnConfirm,
        data: null,
        encryptVOClassName: null,
        primaryId: [this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h').value],
      });
      if (payBtnConfirmresult.isStop) {
        return;
      }
      let payBtnConfirmData = {
        pks: [this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h').value],
        tss: [this.props.form.getFormItemsValue(this.formId, 'ts').value],
        pageid: card_page_id,
        isCardOpt: true,
        operator: 1,
        pkbs: pk_delivery_b,
        sign_strSrc: payBtnConfirmresult.data.text,
        signature: payBtnConfirmresult.data.signText,
        sing_sn: payBtnConfirmresult.data.userjson,
        pagecode : card_page_id,
        btncode : "pay",
      };
      ajax({
        url: '/nccloud/sf/delivery/deliverypay.do',
        data: payBtnConfirmData,
        success: (res) => {
          if (res.success) {
            if (res.data.billCard) {
              toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000011') });/* 国际化处理： 支付成功*/
              if (res.data.billCard.head) {
                props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
              }
              if (res.data.billCard.body) {
                props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
              }
            }
            props.setUrlParam({
              status: 'browse',
              id: pk_delivery_h && pk_delivery_h.value,
              pagecode: card_page_id,
            })
            this.toggleShow();
            // this.refresh();
          }
        }
      });
      break;
    // 取消支付
    case 'unpay':
      ajax({
        url: '/nccloud/sf/delivery/deliveryunpay.do',
        data:{pks: [pk_delivery_h && pk_delivery_h.value],
              tss: [ts && ts.value],
              pageid: card_page_id,
              isCardOpt: true,
              pkbs: pk_delivery_b,
              pagecode : card_page_id,
              btncode : "unpay",
            },
        success: (res) => {
          if (res.success) {
            if (res.data) {
              if (res.data.errorMsg) {
                toast({ color: 'warning', content: res.data.errorMsg });
              }
              else if (res.data.warningMsg) {
                toast({
                  color: 'warning', content: that.props.MutiInit.getIntl("36320FDA")
                    && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013') + res.data.warningMsg
                });/* 国际化处理： 取消支付成功*/
              }
              else if (res.data.successMsg) {
                /* 国际化处理： 取消支付成功*/
                toast({
                  color: 'success', content: that.props.MutiInit.getIntl("36320FDA")
                    && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000013')
                });
                if (res.data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                  updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
                }
                if (res.data.billCard.body) {
                  props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                }
                props.setUrlParam({
                  status: 'browse',
                  id: pk_delivery_h && pk_delivery_h.value,
                  pagecode: card_page_id,
                })
                this.toggleShow();
              }
            }
          }
        }
      });
      break;
    // 分录作废
    case 'recorddisuse':
      if (checkBodyData.length > 0) {
        let canOpera = false;
        //处理选择数据
        checkBodyData.forEach((val) => {
          let paystatus = val.data.values.paystatus;
          let recordstatus = val.data.values.recordstatus;
          //begin tm tangleic 20190905 自动上收支付失败的单据允许作废
          let billstatus = val.data.values.billstatus && val.data.values.billstatus.value;
          // if (paystatus && paystatus.value && paystatus.value == 4
          //   && recordstatus && recordstatus.value && recordstatus.value == 1) {
          if ((paystatus && paystatus.value && paystatus.value == 4
            && recordstatus && recordstatus.value && recordstatus.value == 1) ||
            (recordstatus && recordstatus.value && recordstatus.value == 1 && billstatus == 2 && srcbusitype == 3)) {
            //end tangleic
            canOpera = true;
          }
          return;
        });
        if (!canOpera) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000014') });/* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*/
          return;
        } else {
          promptBox({
            color: "warning",
            /* 国际化处理： 对选中的表体行进行分录作废?*/
            content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000016'),
            //点击确定按钮事件
            beSureBtnClick: buttonClick.bind(this, props, 'recorddisuseConfirm'),
          });
        }
      } else {
        let canOperaAll = false;
        //处理选择数据
        checkAllCardDate.forEach((val) => {
          let paystatus = val.values.paystatus;
          let recordstatus = val.values.recordstatus;
          //begin tm tangleic 20190905 自动上收支付失败的单据允许作废
          let billstatus = val.values.billstatus && val.values.billstatus.value;
          // if (paystatus && paystatus.value && paystatus.value == 4
          //   && recordstatus && recordstatus.value && recordstatus.value == 1) {
          if ((paystatus && paystatus.value && paystatus.value == 4
            && recordstatus && recordstatus.value && recordstatus.value == 1) ||
            (recordstatus && recordstatus.value && recordstatus.value == 1 && billstatus == 2 && srcbusitype == 3)) {
            //end tangleic
            canOperaAll = true;
          }
          return;
        });
        if (!canOperaAll) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000014') });/* 国际化处理： 选择的单据中无可以分录作废的，请选择支付失败且未作废过的!*/
          return;
        } else {
          promptBox({
            color: "warning",
            /* 国际化处理： 对整张上收单进行分录作废?*/
            content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000017'),
            //点击确定按钮事件
            beSureBtnClick: buttonClick.bind(this, props, 'recorddisuseConfirm'),
          });
        }
      }
      break;
    // 分录作废确认
    case 'recorddisuseConfirm':
      ajax({
        url: '/nccloud/sf/delivery/deliveryrecorddisuse.do',
        data: data,
        success: (res) => {
          if (res.success) {
            if (res.data) {
              if (res.data.errorMsg) {
                toast({ color: 'warning', content: res.data.errorMsg });
              }
              else if (res.data.successMsg) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000018') });/* 国际化处理： 分录作废成功*/
                if (res.data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                  updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
                }
                if (res.data.billCard.body) {
                  props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                }
                props.setUrlParam({
                  status: 'browse',
                  id: pk_delivery_h && pk_delivery_h.value,
                  pagecode: card_page_id,
                })
                this.toggleShow();
              }
            }
          }
        }
      });
      break;
    // 再次网银支付
    case 'netpayagain':
      if (checkBodyData.length > 0) {
        props.modal.show('commonModel', {
          title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000019'),/* 国际化处理： 再次网银支付*/
          content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000020'),/* 国际化处理： 对选中的表体行进行再次网银支付?*/
          //点击确定按钮事件
          beSureBtnClick: buttonClick.bind(this, props, 'netpayagainConfirm'),
        });
      } else {
        // props.modal.show('commonModel',{
        //   title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000019'),/* 国际化处理： 再次网银支付*/
        //   content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000021'),/* 国际化处理： 对整张上收单进行再次网银支付?*/
        //   //点击确定按钮事件
        //   beSureBtnClick: buttonClick.bind(this, props ,'netpayagainConfirm'),
        // });
        promptBox({
          color: "warning",
          /* 国际化处理： 对整张上收单进行再次网银支付?*/
          content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000021'),
          //点击确定按钮事件
          beSureBtnClick: buttonClick.bind(this, props, 'netpayagainConfirm'),
        });
      }
      break;
    // 再次网银支付确认
    case 'netpayagainConfirm':
      ajax({
        url: '/nccloud/sf/delivery/deliverynetpayagain.do',
        data: data,
        success: (res) => {
          if (res.success) {
            if (res.data) {
              if (res.data.errorMsg) {
                toast({ color: 'warning', content: res.data.errorMsg });
              }
              else if (res.data.successMsg) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000022') });/* 国际化处理： 再次网银支付成功*/
                if (res.data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                  updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
                }
                if (res.data.billCard.body) {
                  props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                }
                props.setUrlParam({
                  status: 'browse',
                  id: pk_delivery_h && pk_delivery_h.value,
                  pagecode: card_page_id,
                })
                this.toggleShow();
              }
            }
            // this.refresh();
          }
        }
      });
      break;
    // 再次手工支付
    case 'payagain':
      if (checkBodyData.length > 0) {
        props.modal.show('commonModel', {
          title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000023'),/* 国际化处理： 再次手工支付*/
          content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000024'),/* 国际化处理： 对选中的表体行进行再次手工支付?*/
          //点击确定按钮事件
          beSureBtnClick: buttonClick.bind(this, props, 'payagainConfirm'),
        });
      } else {
        // props.modal.show('commonModel',{
        //   title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000023'),/* 国际化处理： 再次手工支付*/
        //   content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000025'),/* 国际化处理： 对整张上收单进行再次手工支付?*/
        //   //点击确定按钮事件
        //   beSureBtnClick: buttonClick.bind(this, props ,'payagainConfirm'),
        // });
        promptBox({
          color: "warning",
          /* 国际化处理： 对整张上收单进行再次手工支付?*/
          content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000025'),
          //点击确定按钮事件
          beSureBtnClick: buttonClick.bind(this, props, 'payagainConfirm'),
        });
      }
      break;
    // 再次手工支付确认
    case 'payagainConfirm':
      ajax({
        url: '/nccloud/sf/delivery/deliverypayagain.do',
        data: data,
        success: (res) => {
          if (res.success) {
            if (res.data) {
              if (res.data.errorMsg) {
                toast({ color: 'warning', content: res.data.errorMsg });
              }
              else if (res.data.successMsg) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000026') });/* 国际化处理： 再次手工支付成功*/
                if (res.data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                  updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
                }
                if (res.data.billCard.body) {
                  props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                }
                props.setUrlParam({
                  status: 'browse',
                  id: pk_delivery_h && pk_delivery_h.value,
                  pagecode: card_page_id,
                })
                this.toggleShow();
              }
            }
            // this.refresh();
          }
        }
      });
      break;
    // 支付状态
    case 'paystatus':
      ajax({
        url: '/nccloud/sf/delivery/deliveryquerypaystatus.do',
        data: data,
        success: (res) => {
          if (res.success) {
            if (res.data) {
              if (res.data.errorMsg) {
                toast({ color: 'warning', content: res.data.errorMsg });
              }
              else if (res.data.successMsg) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000027') });/* 国际化处理： 支付状态成功*/
                if (res.data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                  updateCache('pk_delivery_h', props.getUrlParam('id'), res.data.billCard, card_from_id, dataSource);
                }
                if (res.data.billCard.body) {
                  props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                }
              }
              props.setUrlParam({
                status: 'browse',
                id: pk_delivery_h && pk_delivery_h.value,
              })
              this.toggleShow();
            }
            // this.refresh();
          }
        }
      });
      break;
    // 支付确认单
    case 'payconfirm':
      if (checkBodyData.length != 1) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028') });/* 国际化处理： 请选择一条表体数据操作！*/
        return;
      } else {
        //处理选择数据
        let paystatus = checkBodyData[0].data.values.paystatus;
        let netpayinfo = checkBodyData[0].data.values.netpayinfo;
        if (paystatus && paystatus.value != 2) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000029') });/* 国际化处理： 请选择支付状态为支付中的表体进行操作!*/
          return;
        } else if (!netpayinfo.value) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000030') });/* 国际化处理： 请先下载支付指令状态!*/
          return;
        }
        let pk_delivery_bArr = [];
        pk_delivery_bArr.push(checkBodyData[0].data.values.pk_delivery_b);
        let payconfirmdata = {
          pk: pk_delivery_h && pk_delivery_h.value,
          ts: ts && ts.value,
          pageid: card_page_id,
          pkbs: pk_delivery_bArr,
        }

        let payconfirmpk_h = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h');
        let payconfirmpk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
        let payconfirmpk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group');
        let payconfirmvbillno = this.props.form.getFormItemsValue(this.formId, 'vbillno');
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
          srcbilltype: '36K4',
          /** 来源单据节点号 */
          srcnodecode: '36320FDA',
          /** 来源单据主表PK */
          srcpkid: payconfirmpk_h && payconfirmpk_h.value,
          /** 来源系统 */
          srcsystem: 'SF',
          /** 指令参考号 */
          yurref: checkBodyData[0].data.values.pk_delivery_b.value,
        });
        this.toggleShow();
        this.refresh();
      }
      break;

    // 联查按钮组
    // 上收申请
    case 'linkapply':
      let linkapply_pk_srcbill = this.props.form.getFormItemsValue(this.formId, 'pk_srcbill');
      let linkapply_srcbusitype = this.props.form.getFormItemsValue(this.formId, 'srcbusitype');
      if (linkapply_srcbusitype && linkapply_srcbusitype.value && linkapply_srcbusitype.value != 2) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000031') });/* 国际化处理： 单据不是上收申请生成的，无法联查上收申请!*/
        return;
      }
      let linkapplyArr = [];
      //数据校验
      if (linkapply_pk_srcbill && linkapply_pk_srcbill.value) {
        linkapplyArr.push(linkapply_pk_srcbill.value);
      } else {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000032') });/* 国际化处理： 该单据无来源单据！*/
        return;
      }
      let linkapplywfExtParam = {
        status: 'browse',
        id: linkapply_pk_srcbill && linkapply_pk_srcbill.value,
      };
      linkApp(props, "36K3", linkapplywfExtParam);
      break;
    // 委托付款
    case 'linkpayment':
      let linkpayment_pk_srcbill = this.props.form.getFormItemsValue(this.formId, 'pk_srcbill');
      let linkpayment_srcbusitype = this.props.form.getFormItemsValue(this.formId, 'srcbusitype');
      if (linkpayment_srcbusitype && linkpayment_srcbusitype.value && linkpayment_srcbusitype.value != 5) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000033') });/* 国际化处理： 单据不是上收回拨生成的，无法联查委托付款书!*/
        return;
      }

      let linkpaymentArr = [];
      //数据校验
      if (linkpayment_pk_srcbill && linkpayment_pk_srcbill.value) {
        linkpaymentArr.push(linkpayment_pk_srcbill.value);
      } else {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000032') });/* 国际化处理： 该单据无来源单据！*/
        return;
      }
      let linkpaymentwfExtParam = {
        status: 'browse',
        id: linkpayment_pk_srcbill.value
      };
      linkApp(props, "36J1", linkpaymentwfExtParam);
      break;
    // 内部户余额
    case 'accountbalance':
      let accountbalance_busitype = this.props.form.getFormItemsValue(this.formId, 'busitype');
      if (accountbalance_busitype && accountbalance_busitype.value && accountbalance_busitype.value != 2) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000034') });/* 国际化处理： 非中心上收的单据不能联查内部账户余额!*/
        return;
      }
      let pkaccidArr;
      if (checkAllCardDate.length > 1) {
        if (checkBodyData.length != 1) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028') });/* 国际化处理： 请选择一条表体数据操作！*/
          return;
        } else {
          if (checkBodyData.length > 0) {
            //处理选择数据
            checkBodyData.forEach((val) => {
              pkaccidArr = val.data.values.pk_accid.value;
            });
          }
        }
      } else {
        pkaccidArr = checkAllCardDate[0].values.pk_accid.value;
      }
      if (pkaccidArr) {
        this.setState({ showInnerAccInfo: true, pk_inneracc: pkaccidArr })
      } else {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000035') });/* 国际化处理： 选中表体内部账户为空！*/
      }
      break;
    // 付款账户
    case 'bankaccbalance_p':
      let bankaccbalance_parr = [];
      let bankacc_prestkey;
      if (checkAllCardDate.length > 1) {
        if (checkBodyData.length != 1) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028') });/* 国际化处理： 请选择一条表体数据操作！*/
          return;
        } else {
          //处理选择数据
          checkBodyData.forEach((val) => {
            bankacc_prestkey = val.data.values.pk_delivery_b.value;
            //处理选择数据
            let restpk_org_p, pk_bankacc_p;
            if (val.data.values.pk_org_p
              && val.data.values.pk_org_p.value) {
              restpk_org_p = val.data.values.pk_org_p.value;
            }
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
      } else {
        bankacc_prestkey = checkAllCardDate[0].values.pk_delivery_b.value;
        //处理选择数据
        let restpk_org_p, pk_bankacc_p;
        if (checkAllCardDate[0].values.pk_org_p
          && checkAllCardDate[0].values.pk_org_p.value) {
          restpk_org_p = checkAllCardDate[0].values.pk_org_p.value;
        }
        if (checkAllCardDate[0].values.pk_bankacc_p
          && checkAllCardDate[0].values.pk_bankacc_p.value) {
          pk_bankacc_p = checkAllCardDate[0].values.pk_bankacc_p.value;
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
      break;
    // 收款账户
    case 'bankaccbalance_r':
      let bankaccbalance_rarr = [];
      let restpk_org_r, pk_bankacc_r, bankacc_rrestkey;
      if (this.props.form.getFormItemsValue(this.formId, 'pk_org')
        && this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
        restpk_org_r = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
      }

      if (checkAllCardDate.length > 1) {
        if (checkBodyData.length != 1) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028') });/* 国际化处理： 请选择一条表体数据操作！*/
          return;
        } else {
          //处理选择数据
          checkBodyData.forEach((val) => {
            bankacc_rrestkey = val.data.values.pk_delivery_b.value;
            if (val.data.values.pk_bankacc_r
              && val.data.values.pk_bankacc_r.value) {
              pk_bankacc_r = val.data.values.pk_bankacc_r.value;
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
      } else {
        bankacc_rrestkey = checkAllCardDate[0].values.pk_delivery_b.value;
        if (checkAllCardDate[0].values.pk_bankacc_r
          && checkAllCardDate[0].values.pk_bankacc_r.value) {
          pk_bankacc_r = checkAllCardDate[0].values.pk_bankacc_r.value;
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
      break;
    // 支付确认单
    case 'linkpayconfirm':
      let linkpayconfirm_bpk = [];
      if (checkAllCardDate.length > 0) {
        if (checkBodyData.length != 1) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028') });/* 国际化处理： 请选择一条表体数据操作！*/
          return;
        } else {
          //处理选择数据
          let isnetpay = checkBodyData[0].data.values.isnetpay;
          if (!isnetpay || (isnetpay && !isnetpay.value)) {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000085') });/* 国际化处理： 请选择网银支付的单据进行操作!*/
            return;
          }
          let paystatus = checkBodyData[0].data.values.paystatus;
          if (paystatus && paystatus.value == 1) {
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000086') });/* 国际化处理： 请选择已经支付过的单据进行操作!*/
            return;
          }
          //处理选择数据
          checkBodyData.forEach((val) => {
            linkpayconfirm_bpk.push(val.data.values.pk_delivery_b.value);
          });
          props.openTo('/obm/ebankconfirmpay/confirmpay/main/index.html#/list',
            {
              appcode: '36100CONFM',
              pagecode: '36100CONFM_L01',
              yurrefs: linkpayconfirm_bpk,
              id: linkpayconfirm_bpk,
              type: 'link',
              status: 'browse',
            });
        }
      }
      break;
    // 回单
    case 'receipt':
      let receiptrestkey = [];
      let linkquerytype = 'LinkQuery_SrcBill_B';
      if (checkAllCardDate.length > 1 && checkBodyData.length > 0) {
        if (checkBodyData.length != 1) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028') });/* 国际化处理： 请选择一条表体数据操作！*/
          return;
        } else {
          if (checkBodyData.length > 0) {
            let paystatus = checkBodyData[0].data.values.paystatus;
            if (paystatus && paystatus.value != 3) {
              toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000036') });/* 国际化处理： 请选择支付成功的单据进行操作!*/
              return;
            }
            //处理选择数据
            checkBodyData.forEach((val) => {
              receiptrestkey.push(val.data.values.pk_delivery_b.value);
            });
          }
        }
      } else {
        let billstatus = this.props.form.getFormItemsValue(this.formId, 'billstatus');
        if (billstatus && billstatus.value != 4) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000037') });/* 国际化处理： 请选择上收成功的单据进行操作!*/
          return;
        }
        receiptrestkey.push(pk_delivery_h && pk_delivery_h.value);
        linkquerytype = ' LinkQuery_SrcBill_H';
      }
      let receiptExtParam = {
        status: 'browse',
        srcbillid: receiptrestkey,
        linkquerytype: linkquerytype,
      };
      linkApp(props, "36K9", receiptExtParam);
      break;
    // 凭证
    case 'linkvoucher':
      let voucher_pk_h = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h').value;
      let voucher_pk_group = this.props.form.getFormItemsValue(this.formId, 'pk_group').value;
      let voucher_pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
      let voucher_pk_billtype = this.props.form.getFormItemsValue(this.formId, 'pk_billtype').value;
      let voucher_vbillno = this.props.form.getFormItemsValue(this.formId, 'vbillno').value;
      linkVoucherApp(props, voucher_pk_h, voucher_pk_group, voucher_pk_org, voucher_pk_billtype, voucher_vbillno);
      break;
    // 计划预算
    case 'queryntbplan':
      let queryntbplanData = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
      ajax({
        url: '/nccloud/sf/delivery/deliverylinkplan.do',
        data: queryntbplanData,
        success: (res) => {
          if (res.success) {
            if (res.data && res.data.hint) {
              toast({ color: 'warning', content: res.data.hint });
              return;
            } else {
              this.setState({
                showNtbDetail: true,
                ntbdata: res.data
              })
            }
          }
        }
      });
      break;
    // 审批详情
    case 'reviewapprove':
      let pk_delivery_hreviewapprove = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h');
      this.setState({
        //单据id
        billId: pk_delivery_hreviewapprove && pk_delivery_hreviewapprove.value,
        approveshow: !this.state.approveshow
      })
      break;
    // 附件管理
    case 'file':
      //单据pk
      let filepk_delivery_h = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h');
      //单据编号
      let filevbillno = this.props.form.getFormItemsValue(this.formId, 'vbillno');

      this.setState({
        //单据pk
        billId: filepk_delivery_h && filepk_delivery_h.value,
        //附件管理使用单据编号
        billno: filevbillno && filevbillno.value,
        showUploader: !this.state.showUploader,
      })
      break;
    // 打印按钮组 
    // 打印
    case 'print':
      let pk_delivery_hprint = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h');
      print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/sf/delivery/deliveryprint.do',
        {
          // printTemplateID: '1001Z61000000002AIOM',
          //功能节点编码，即模板编码
          // appcode: appcode,
          // 模板节点标识
          nodekey: printnodekey,
          // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
          oids: [pk_delivery_hprint && pk_delivery_hprint.value]
        }
      );
      break;
    // 输出
    case 'output':
      let pk_delivery_houtput = this.props.form.getFormItemsValue(this.formId, 'pk_delivery_h');
      output({
        url: '/nccloud/sf/delivery/deliveryprint.do',
        data: {
          //功能节点编码，即模板编码
          appcode: appcode,
          // 模板节点标识
          nodekey: printnodekey,
          // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
          oids: [pk_delivery_houtput && pk_delivery_houtput.value],
          outputType: 'output'
        }
      });
      break;
    //正式打印
    case 'officprint':
      elecSignPrint(props, true);
      break;
    //补充打印
    case 'supplyprint':
      elecSignPrint(props, false);
      break;
    //刷新按钮
    case 'refresh':
      this.refreshPage();
      break;

      //头部生成内贷还本单
      case 'toNDHB':
        let sourceid2 = pk;//来源主键
        if(!sourceid2){
        toast({
            color: 'warning',
            content:loadMultiLang(this.props, '36340FDW-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
        });
        return;
        }
        this.props.openTo('icdmc/icdmc/repayprcpl/main/index.html#/card', 
            {
                srcFunCode:'36360IRP',
                appcode: '36360IRP',
                pagecode: '36360IRP_CARD',                   
                status: 'add',
                sourceid:sourceid2
            });
    break;

      //头部生成内贷付息单
      case 'toNDFX':
        debugger;
       console.log("----------------------------");
        let sourceid3 = data.pk;//来源主键
        if(!sourceid3){
        toast({
            color: 'warning',
            content:loadMultiLang(this.props, '36340FDW-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
        });
        return;
        } 
        this.props.openTo('icdmc/icdmc/repayintst/main/index.html#/card', 
            {
                srcFunCode:'36360IPI',
                appcode: '36360IPI',
                pagecode: '36360IPI_CARD',                   
                status: 'add',
                sourceid:sourceid3
            });
    break;

    // 表体操作按钮 
    //body新增
    case 'addline':
      if (org_val && org_display) {
        props.cardTable.addRow(this.tableId);
        clsRowno(this.props, card_table_id);
        props.cardTable.setStatus("edit");
        let isreversebusitype_addline = props.form.getFormItemsValue(this.formId, 'isreversebusitype');
        //表格行数
        let rownum_addline = props.cardTable.getNumberOfRows(this.tableId);
        for (let i = 0; i < rownum_addline; i++) {
          if (isreversebusitype_addline && isreversebusitype_addline.value) {
            // 不可以编辑
            props.cardTable.setEditableByIndex(card_table_id, i, 'isnetpay', false);
            props.cardTable.setEditableByIndex(card_table_id, i, 'pay_type', false);
            props.cardTable.setEditableByIndex(card_table_id, i, 'issamebank', false);
            props.cardTable.setEditableByIndex(card_table_id, i, 'issamecity', false);
          }
        }
      } else {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
      }
      break;
    //body删除
    case 'delline':
      if (org_val && org_display) {
        let currRows = props.cardTable.getCheckedRows(this.tableId);
        let currSelect = [];
        if (currRows && currRows.length > 0) {
          for (let item of currRows) {
            currSelect.push(item.index);
          }
        }
        if (currSelect.length == 0) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000038') });/* 国际化处理： 未选择数据!*/
          return;
        }
        props.cardTable.delRowsByIndex(this.tableId, currSelect);
      } else {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
      }
      break;
    //body复制
    case 'copyline':
      if (org_val && org_display) {

        let currRows3 = props.cardTable.getCheckedRows(this.tableId);
        let currSelect3 = [];
        if (currRows3 && currRows3.length > 0) {
          this.setState({ pasteflag: true }, () => {
            this.toggleShow();
          });
        } else {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000038') });/* 国际化处理： 未选择数据!*/
          return;
        }
      } else {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000005')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
      }
      break;
    //取消粘贴
    case 'cancelLine':
      this.setState({ pasteflag: false }, () => { this.toggleShow() });
      break;
    //粘贴末行
    case 'copyLineLast':
      let selectRows = props.cardTable.getCheckedRows(this.tableId);
      if (selectRows == null || selectRows.length == 0) {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000039')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
      }
      // 粘贴末行位置index
      let copyindex = props.cardTable.getNumberOfRows(this.tableId, false);
      BatchCopy(props, this.tableId, copyindex, 'pk_delivery_b');//调用组件使用粘贴
      //处理复制张贴数据
      let isreversebusitype_copyline = props.form.getFormItemsValue(this.formId, 'isreversebusitype');
      //表格行数
      let rownum_copyline = props.cardTable.getNumberOfRows(this.tableId);
      for (let i = 0; i < rownum_copyline; i++) {
        if (isreversebusitype_copyline && isreversebusitype_copyline.value) {
          // 不可以编辑
          props.cardTable.setEditableByIndex(card_table_id, i, 'isnetpay', false);
          props.cardTable.setEditableByIndex(card_table_id, i, 'pay_type', false);
          props.cardTable.setEditableByIndex(card_table_id, i, 'issamebank', false);
          props.cardTable.setEditableByIndex(card_table_id, i, 'issamecity', false);
        }
      }
      clsRowno(props, card_table_id);
      this.setState({ pasteflag: false }, () => { this.toggleShow() });
      break;
    default:
      break
  }
}

/**
 * 保存新增
 * @param {*} props 
 */
const saveAdd = async function (that, props) {
  if (props.getUrlParam('status') === 'copy') {
    props.form.setFormItemsValue(card_from_id, { pk_delivery_h: null });
    props.form.setFormItemsValue(card_from_id, { ts: null });
  }
  let saveaddflag = this.saveBillBeforeCheck();
  if (saveaddflag) {
    let saveaddBeforePk = props.form.getFormItemsValue(card_from_id, 'pk_delivery_h');
    // 采用轻量级的api获取页面数据，去除scale,display
    // let saveaddData = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
    let saveaddData = createSimpleBillData(this.props, card_page_id, card_from_id, card_table_id, false);
    console.log(saveaddData, 'sign before saveaddData');
    let result = await Sign({
      isSign: true,
      isKey: true,
      data: saveaddData,
      isSave: true,
      encryptVOClassName: 'nccloud.pubitf.sf.delivery.delivery.DeliveryEncryptVO4NCC'
    });
    if (result.isStop) {
      return;
    }
    saveaddData = result.data;
    console.log(saveaddData, 'sign after saveaddData');
    ajax({
      url: '/nccloud/sf/delivery/deliverysave.do',
      data: saveaddData,
      success: (res) => {
        if (res.success) {
          toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000040') });/* 国际化处理： 保存成功*/
          let pk;
          if (res.data) {
            if (res.data.head) {
              that.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
              //页签赋值
              let vbillno = res.data.head[card_from_id].rows[0].values.vbillno;
              this.backvbillno = vbillno && vbillno.value;
              pk = res.data.head[card_from_id].rows[0].values.pk_delivery_h.value;
              if (saveaddBeforePk && saveaddBeforePk.value) {
                updateCache('pk_delivery_h', res.data.head[card_from_id].rows[0].values.pk_delivery_h.value,
                  res.data, card_from_id, dataSource, res.data.head[this.formId].rows[0].values);
              } else {
                addCache(res.data.head[card_from_id].rows[0].values.pk_delivery_h.value, res.data,
                  card_from_id, dataSource, res.data.head[card_from_id].rows[0].values);
              }
            }
            if (res.data.body) {
              that.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
            }
            // 清空表单form所有数据
            that.props.form.EmptyAllFormValue(card_from_id);
            that.backvbillno = '';
            //清空table所有数据
            that.props.cardTable.setTableData(card_table_id, { rows: [] });
            //单据有主组织，新增时,将其他字段设置为不可编辑.
            that.props.initMetaByPkorg();
            //把所有table中字段不可以编辑，直到选择org之后
            that.props.cardTable.setStatus(card_table_id, 'browse');
            //设置组织可以编辑
            that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
            this.props.setUrlParam({
              status: 'add',
              id: pk,
            });
            if (this.state.curr_pk_org) {
              let pk_org = {
                value: this.state.curr_pk_org,
                display: this.state.curr_orgname
              };
              afterEvent.call(this, this.props, card_from_id, "pk_org", pk_org, null, null, null, null, true);
              this.props.resMetaAfterPkorgEdit();
              this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
              this.props.cardTable.addRow(card_table_id);
              clsRowno(this.props, card_table_id);
            }
            //begin tm tangleic 20190229 肩部复制操作恢复
            this.setState({ pasteflag: false });
            //end tangleic
            this.toggleShow();
          }
        }
      }
    });
  }
}

/**
 * 保存提交
 * @param {*} props 
 */
const saveCommit = async function (that, props) {
  if (props.getUrlParam('status') === 'copy') {
    props.form.setFormItemsValue(card_from_id, { pk_delivery_h: null });
    props.form.setFormItemsValue(card_from_id, { ts: null });
  }
  let savecommitBeforePk = props.form.getFormItemsValue(card_from_id, 'pk_delivery_h');
  let savesubmitflag = this.saveBillBeforeCheck();
  let hasTbbMsg=false;
  if (savesubmitflag) {
    // 采用轻量级的api获取页面数据，去除scale,display
    // let savesubmitData = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
    let savesubmitData = createSimpleBillData(this.props, card_page_id, card_from_id, card_table_id, false);
    console.log(savesubmitData, 'sign before savesubmitData');
    let result = await Sign({
      isSign: true,
      isKey: true,
      data: savesubmitData,
      isSave: true,
      encryptVOClassName: 'nccloud.pubitf.sf.delivery.delivery.DeliveryEncryptVO4NCC'
    });
    if (result.isStop) {
      return;
    }
    savesubmitData = result.data;
    console.log(savesubmitData, 'sign after savesubmitData');
    ajax({
      url: '/nccloud/sf/delivery/deliverysavecommit.do',
      data: savesubmitData,
      success: (res) => {
        let { data } = res;
        if (res.success) {
          if (res.data) {
            if (data.returnMsg && data.returnMsg.workflow &&
              (data.returnMsg.workflow == 'approveflow' || data.returnMsg.workflow == 'workflow')) {
              if (savecommitBeforePk && savecommitBeforePk.value) {
                if (data.billCard && data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
                  updateCache('pk_delivery_h', res.data.billCard.head[card_from_id].rows[0].values.pk_delivery_h.value,
                    res.data.billCard, card_from_id, dataSource, res.data.billCard.head[card_from_id].rows[0].values);
                  props.setUrlParam({
                    status: 'browse',
                    id: savecommitBeforePk && savecommitBeforePk.value,
                  })
                  if (res.data.billCard.body) {
                    props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                  }
                  this.toggleShow();
                  this.setState({
                    compositedata: data.returnMsg,
                    compositedisplay: true,
                  });
                }
              } else {
                if (data.billCard && data.billCard.head) {
                  props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
                  let vbillno = res.data.billCard.head[card_from_id].rows[0].values.vbillno;
                  this.backvbillno = vbillno && vbillno.value;
                  addCache(data.billCard.head[card_from_id].rows[0].values.pk_delivery_h.value, data.billCard,
                    card_from_id, dataSource, data.billCard.head[card_from_id].rows[0].values);
                  if (res.data.billCard.body) {
                    props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
                  }
                  props.setUrlParam({
                    status: 'browse',
                    id: data.billCard.head[card_from_id].rows[0].values.pk_delivery_h.value,
                  })
                  this.toggleShow();
                  this.setState({
                    compositedata: data.returnMsg,
                    compositedisplay: true,
                  });
                }
              }
            } else {
              if (res.data.warningMsg) {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000041') + res.data.warningMsg });/* 国际化处理： 保存提交成功*/
              } else {
                //处理预算提示信息
                hasTbbMsg = showTBBMsg(res.data.billCard.head, card_from_id);
                if(!hasTbbMsg){
                  toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000041') });/* 国际化处理： 保存提交成功*/
                }
              }
              if (res.data.billCard.head) {
                props.form.setAllFormValue({ [card_from_id]: res.data.billCard.head[card_from_id] });
                //页签赋值
                let vbillno = res.data.billCard.head[card_from_id].rows[0].values.vbillno;
                this.backvbillno = vbillno && vbillno.value;
                if (savecommitBeforePk && savecommitBeforePk.value) {
                  updateCache('pk_delivery_h', res.data.billCard.head[card_from_id].rows[0].values.pk_delivery_h.value,
                    res.data.billCard, card_from_id, dataSource, res.data.billCard.head[card_from_id].rows[0].values);
                } else {
                  addCache(res.data.billCard.head[card_from_id].rows[0].values.pk_delivery_h.value, res.data.billCard,
                    card_from_id, dataSource, res.data.billCard.head[card_from_id].rows[0].values);
                }
              }
              if (res.data.billCard.body) {
                props.cardTable.setTableData(card_table_id, res.data.billCard.body[card_table_id]);
              }
              let pk_delivery_h = res.data.billCard.head[card_from_id].rows[0].values.pk_delivery_h.value;
              props.setUrlParam({
                status: 'browse',
                id: pk_delivery_h,
              })
              that.toggleShow();
            }
          }
        }
      }
    });
  }
}

//电子签章打印
const elecSignPrint = function (props, offical) {
  elecSignCardPrint(props, {
    url: url.common.elecsignprint,
    offical,
    appCode: appcode,
    nodeKey: offical ? printnodekey_offical : printnodekey_inoffical,
    headCode: card_from_id,
    field_id: field.pk,
    validateFunc: () => {
      let billstatus = props.form.getFormItemsValue(card_from_id, field.billstate).value;
      if (state.billstate.payok != billstatus) {
        return loadMultiLang(props, '36320FDA--000123')/** 单据状态非转账成功！ */;
      }
      return null;
    }
  });
}

export default buttonClick;

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/