/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { createPage, ajax, base, toast, print, cardCache, output, promptBox } from 'nc-lightapp-front';
import initButton from './initButton';
import initTemplate from './initTemplate'

const { NCMessage } = base;
let { getNextId, getCurrentLastId, deleteCacheById, getCacheById, updateCache, addCache } = cardCache;

import {
  app_id, module_id, base_url, button_limit,
  oid, appcode, printnodekey,
  list_page_id, list_search_id, list_table_id,
  card_page_id, card_from_id, card_fromtail_id,
  dataSource
} from '../../cons/constant.js';

export default function buttonClick(props, id) {
  let formId = card_from_id;
  let pageId = card_page_id;
  let tableId = list_table_id;
  let that = this;
  switch (id) {
    // 保存
    case 'save':
      if (props.form.isCheckNow(card_from_id)) {
        // let savedatazs = props.createFormAfterEventData(card_page_id, card_from_id);

        // let saveAllData = props.form.getAllFormValue(card_from_id);
        // let savedata = {
        //   pageid: card_page_id,
        //   model: {
        //     areacode: card_from_id,
        //     rows: saveAllData.rows,
        //     areaType: 'form'
        //   }
        // }

        // 验证公式
        // props.validateToSave(savedata, save.bind(this, that, props), '', '');
        props.validateToSave(buildValidateSaveData(props), save.bind(this, that, props), '', '');
        // save.call(this, that, props);
      }
      break;
    // 保存新增
    case 'saveandadd':
      //begin tm tangleic 20200219 保存新增逻辑重构
      // if(props.form.isCheckNow(card_from_id)){
      //   let saveadddata = props.createFormAfterEventData(card_page_id, card_from_id);
      //   // 验证公式
      //   props.validateToSave(saveadddata, saveAdd.bind(this, that, props), '', '');
      //   // saveAdd.call(this, that, props);
      // }
      //获取组织值
      let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
      let pk_org_v = props.form.getFormItemsValue(card_from_id, 'pk_org_v');
      // 验证公式
      props.validateToSave(buildValidateSaveData(props), save.bind(this, that, props, () => {
        props.form.EmptyAllFormValue(this.formId);
        props.setUrlParam({
          status: 'add'
        });
        initTemplate.call(this, props, { pk_org, pk_org_v });
        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000014') });/* 国际化处理： 保存成功*/
      }), '', '');
      //end tm  tangleic
      break;
    // 取消
    case 'cancel':
      promptBox({
        /* 国际化处理： 取消*/
        title: this.props.MutiInit.getIntl("36010IACC")
          && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000051'),
        color: "warning",
        /* 国际化处理：是否确任要取消?*/
        content: this.props.MutiInit.getIntl("36010IACC")
          && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000047'),
        beSureBtnClick: this.saveCancelConfirm.bind(this, props)
      });
      break;
    // 启用
    case 'enable':
      let enabledata = {
        pk: this.props.form.getFormItemsValue(this.formId, 'pk_accid').value,
        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/accidenable.do',
        data: enabledata,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            if (data) {
              toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000002') });/* 国际化处理： 启用成功*/
              props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
              props.setUrlParam({
                status: 'browse',
                id: props.form.getFormItemsValue(formId, 'pk_accid').value,
                pagecode: card_page_id,
              });
              updateCache('pk_accid', props.form.getFormItemsValue(formId, 'pk_accid').value, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
              // that.refresh();
              that.toggleShow();
            }
          }
        }
      });
      break;
    // 停用
    case 'disable':
      let disabledata = {
        pk: this.props.form.getFormItemsValue(this.formId, 'pk_accid').value,
        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/acciddisable.do',
        data: disabledata,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            if (data) {
              toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000003') });/* 国际化处理： 停用成功*/
              props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
              props.setUrlParam({
                status: 'browse',
                id: props.form.getFormItemsValue(formId, 'pk_accid').value,
                pagecode: card_page_id,
              });
              updateCache('pk_accid', props.form.getFormItemsValue(formId, 'pk_accid').value, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
              that.toggleShow();
            }
          }
        }
      });
      break;
    // 确认
    case 'confirm':
      let confirmdata = {
        pk: this.props.form.getFormItemsValue(this.formId, 'pk_accid').value,
        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/accidconfirm.do',
        data: confirmdata,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            if (data[tableId] && data[tableId].rows[0]
              && data[tableId].rows[0].values
              && data[tableId].rows[0].values.pk_accid) {
              if (res.data) {
                let pk_srcbill = res.data[tableId].rows[0].values.pk_srcbill;
                if (pk_srcbill && pk_srcbill.value === data[tableId].rows[0].values.pk_accid) {
                  toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000004') });   /* 国际化处理： 结算未安装或未启用，该账户没有登内部账户明细账,期初余额被清空*/
                }
                props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
                toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000005') });/* 国际化处理： 确认成功*/
                props.setUrlParam({
                  status: 'browse',
                  id: props.form.getFormItemsValue(formId, 'pk_accid').value
                });
                updateCache('pk_accid', props.form.getFormItemsValue(formId, 'pk_accid').value, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
                that.toggleShow();
                // initButton(props);
                // that.refresh();
              }
            } else {
              // props.modal.show('confirmmodel',{
              //     content: data,
              //     //点击确定按钮事件
              //     beSureBtnClick: buttonClick.bind(this, props, 'confiryes'),
              //     //取消按钮事件回调
              //     cancelBtnClick: buttonClick.bind(this, props, 'confirno'),
              // });
              that.setState({
                showModal_confirm: true,
                content: data,
              });
            }
          }
        }
      });
      break;
    // 确认弹出框 是按钮
    case 'confiryes':
      //自定义请求数据
      let datayes = {
        pk: props.form.getFormItemsValue(formId, 'pk_accid').value,
        ts: props.form.getFormItemsValue(formId, 'ts').value,
        operator: 4
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/accidconfirm.do',
        data: datayes,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000005') });/* 国际化处理： 确认成功*/
            if (data) {
              if (data.pk_srcbill && data.pk_accid &&
                data.pk_accid.value === data.pk_srcbill.value) {
                toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000004') });   /* 国际化处理： 结算未安装或未启用，该账户没有登内部账户明细账,期初余额被清空*/
              }
              that.setState({
                showModal_confirm: false,
              });
              props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
              props.setUrlParam({
                status: 'browse',
                id: props.form.getFormItemsValue(formId, 'pk_accid').value
              });
              updateCache('pk_accid', props.form.getFormItemsValue(formId, 'pk_accid').value, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
              that.toggleShow();
            }
          }
        }
      });
      break;
    // 确认弹出框 否按钮
    case 'confirno':
      //自定义请求数据
      let datano = {
        pk: props.form.getFormItemsValue(formId, 'pk_accid').value,
        ts: props.form.getFormItemsValue(formId, 'ts').value,
        operator: 8
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/accidconfirm.do',
        data: datano,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000005') });/* 国际化处理： 确认成功*/
            if (data) {
              if (data.pk_srcbill && data.pk_accid &&
                data.pk_accid.value === data.pk_srcbill.value) {
                toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000004') });   /* 国际化处理： 结算未安装或未启用，该账户没有登内部账户明细账,期初余额被清空*/
              }
              that.setState({
                showModal_confirm: false,
              });
              props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
              props.setUrlParam({
                status: 'browse',
                id: props.form.getFormItemsValue(formId, 'pk_accid').value
              });
              updateCache('pk_accid', props.form.getFormItemsValue(formId, 'pk_accid').value, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
              that.toggleShow();
            }
            // that.refresh();
          }
        }
      });
      break;
    // 确认弹出框 取消按钮
    case 'confircancel':
      this.setState({
        showModal_confirm: false,
      });
      break;
    // 取消确认
    case 'cancelconfirm':
      let cancelconfirmdata = {
        pk: this.props.form.getFormItemsValue(this.formId, 'pk_accid').value,
        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/accidcancelconfirm.do',
        data: cancelconfirmdata,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000006') });/* 国际化处理： 取消确认成功*/
            if (res.data) {
              props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
              props.setUrlParam({
                status: 'browse',
                id: props.form.getFormItemsValue(formId, 'pk_accid').value
              });
              updateCache('pk_accid', props.form.getFormItemsValue(formId, 'pk_accid').value, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
              that.toggleShow();
            }
          }
        }
      });
      break;
    // 变更
    case 'change':
      let frozenflag = this.props.form.getFormItemsValue(this.formId, 'frozenflag');
      let pk_accid = this.props.form.getFormItemsValue(this.formId, 'pk_accid');
      if (frozenflag && frozenflag.value != 0) {
        toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000007') });/* 国际化处理： 账户状态为正常的才可以进行变更！*/
      } else {
        props.pushTo("/card", {
          status: 'change',
          id: pk_accid && pk_accid.value,
          pagecode: card_page_id,
        })
        this.refresh();
      }
      break;
    // 冻结
    case 'frozen':
      props.modal.show('frozenModel', {
        title: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000023'),/* 国际化处理： 冻结*/
        // content: this.frozenModelContent(),
        //点击确定按钮事件
        beSureBtnClick: buttonClick.bind(this, props, 'frozenConfirm')
      });
      break;
    // 冻结确认
    case 'frozenConfirm':
      // record.frozendate = this.state.frozendate;
      //自定义请求数据
      let data6 = {
        pk: this.props.form.getFormItemsValue(this.formId, 'pk_accid').value,
        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
        frozendate: this.state.frozendate,
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/accidfrozen.do',
        data: data6,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000008') });/* 国际化处理： 冻结成功*/
            if (res.data) {
              if (res.data[tableId] && res.data[tableId].rows[0]) {
                pk_accid = res.data[tableId].rows[0].values.pk_accid.value;
              }
              props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
              props.setUrlParam({
                status: 'browse',
                id: pk_accid,
                pagecode: card_page_id,
              });
              updateCache('pk_accid', pk_accid, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
              that.toggleShow();
            }
          }
        }
      });
      break;
    // 解冻
    case 'defrozen':
      props.modal.show('defrozenModel', {
        title: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000024'),/* 国际化处理： 解冻*/
        // content: this.defrozenModelContent(),
        //点击确定按钮事件
        // beSureBtnClick: (props, key) => buttonClick.call(this, props, 'defrozenConfirm')
        beSureBtnClick: buttonClick.bind(this, props, 'defrozenConfirm')
      });
      break;
    // 解冻确认
    case 'defrozenConfirm':
      //自定义请求数据
      let data7 = {
        pk: this.props.form.getFormItemsValue(this.formId, 'pk_accid').value,
        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
        defrozendate: this.state.defrozendate,
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/acciddefrozen.do',
        data: data7,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000009') });/* 国际化处理： 解冻成功*/
            if (res.data) {
              if (res.data[tableId] && res.data[tableId].rows[0]) {
                pk_accid = res.data[tableId].rows[0].values.pk_accid.value;
              }
              props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
              props.setUrlParam({
                status: 'browse',
                id: pk_accid,
                pagecode: card_page_id,
              });
              updateCache('pk_accid', pk_accid, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
              that.toggleShow();
            }
          }
        }
      });
      break;
    // 销户
    case 'destroy':
      promptBox({
        color: "warning",
        content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000011'),/* 国际化处理： 此操作不可逆！您确认销户吗？*/
        //点击确定按钮事件
        beSureBtnClick: buttonClick.bind(this, props, 'destroyConfirm')
      });
      break;
    // 销户确认
    case 'destroyConfirm':
      //自定义请求数据
      let destroydata = {
        pk: this.props.form.getFormItemsValue(this.formId, 'pk_accid').value,
        ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
      };
      ajax({
        url: '/nccloud/tmpub/tmbd/acciddestroy.do',
        data: destroydata,
        success: function (res) {
          let { success, data } = res;
          if (success) {
            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000012') });/* 国际化处理： 销户成功*/
            if (res.data) {
              if (res.data[tableId] && res.data[tableId].rows[0]) {
                pk_accid = res.data[tableId].rows[0].values.pk_accid.value;
              }
              props.form.setAllFormValue({ [card_from_id]: data[list_table_id] });
              props.setUrlParam({
                status: 'browse',
                id: pk_accid,
                pagecode: card_page_id,
              });
              updateCache('pk_accid', pk_accid, data, card_from_id, dataSource, data[list_table_id].rows[0].values);
              that.toggleShow();
            }
          }
        }
      });
      break;
    // 新增
    case 'add':
      //begin tm tangleic 20200217 卡片新增逻辑复用列表新增到卡片之后的处理逻辑 
      // props.pushTo("/card", {
      //   status: 'add',
      //   interfaceJump: 'card',
      //   id: '',
      //   pagecode: card_page_id,
      // })
      // props.form.EmptyAllFormValue(this.formId);
      // this.backAccidcode = null;
      // this.refresh();
      props.form.EmptyAllFormValue(this.formId);
      props.setUrlParam({
        status: 'add'
      });
      initTemplate.call(this, props);
      //end tm tangleic
      break;
    // 修改
    case 'edit':
      props.pushTo("/card", {
        status: 'edit',
        id: props.getUrlParam('id'),
        pagecode: card_page_id,
      })
      // this.toggleShow();
      this.refresh();
      break;
    // 删除
    case 'delete':
      promptBox({
        /* 国际化处理：删除*/
        title: this.props.MutiInit.getIntl("36010IACC")
          && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000021'),
        color: "warning",
        /* 国际化处理： 确认是否删除？*/
        content: this.props.MutiInit.getIntl("36010IACC")
          && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000022'),
        //点击确定按钮事件
        beSureBtnClick: buttonClick.bind(this, props, 'deleteConfirm')
      });
      break;
    case 'deleteConfirm':
      let deleteid = props.getUrlParam('id');
      ajax({
        url: '/nccloud/tmpub/tmbd/acciddel.do',
        data: {
          pks: [deleteid],
          tss: [props.form.getFormItemsValue(this.formId, 'ts').value],
        },
        success: (res) => {
          if (res) {
            if (res.success) {
              if (res.data && res.data.errormsg) {
                toast({ color: 'warning', content: res.data.errormsg });
              } else {
                toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000013') });/* 国际化处理： 删除成功*/
                //根据当前id,获取下个id
                let nextId = getNextId(deleteid, dataSource);
                //调用删除缓存数据方法
                deleteCacheById('pk_accid', deleteid, dataSource);
                //根据nextId查询下条数据
                //注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
                if (nextId) {
                  this.props.setUrlParam({
                    status: 'browse',
                    id: nextId,
                  });
                  /*
                  * id：数据主键的值
                  * dataSource: 缓存数据命名空间
                  */
                  let cardData = getCacheById(nextId, dataSource);
                  if (cardData) {
                    if (cardData.pageid === card_page_id) {
                      this.props.form.setAllFormValue({ [card_from_id]: cardData[card_from_id] });
                      this.backAccidcode = cardData[card_from_id].rows[0].values.accidcode.value;
                    } else {
                      this.props.form.setAllFormValue({ [card_from_id]: cardData[list_table_id] });
                      this.backAccidcode = cardData[list_table_id].rows[0].values.accidcode.value;
                    }
                    this.toggleShow();
                  } else {
                    //发起ajax请求查询数据
                    //给界面组件赋值
                    //后台grid只接受pageid。
                    let nextIddata = {
                      pk: nextId,
                      pageid: card_page_id
                    };
                    ajax({
                      url: '/nccloud/tmpub/tmbd/accidquerycard.do',
                      data: nextIddata,
                      success: (res) => {
                        //data要看返回的id，而不是后台设置的id
                        //获取后台返回data				
                        if (res && res.data) {
                          props.form.setAllFormValue({ [card_from_id]: res.data[card_from_id] });
                          this.backAccidcode = res.data[card_from_id].rows[0].values.accidcode.value;
                          initButton(props);
                          /*
                          * idname: 数据主键的命名
                          * id：数据主键的值
                          * headAreacode: 卡片表头的区域编码
                          * dataSource: 缓存数据命名空间
                          */
                          updateCache('pk_accid', nextId, card_from_id, dataSource, res.data[card_from_id].rows[0].values);
                          this.refresh();
                        } else {
                          props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
                        }
                      }
                    });
                  }
                } else {
                  this.props.setUrlParam({
                    status: 'browse',
                    id: null,
                  });
                  this.backAccidcode = null;
                  this.props.form.EmptyAllFormValue(card_from_id);
                  this.refresh();
                }
              }
            }
          }
        }
      });
      break;
    // 复制
    case 'copy':
      props.pushTo("/card", {
        status: 'copy',
        id: props.getUrlParam('id'),
        pagecode: card_page_id,
      })
      this.refresh();
      break;
    // 附件管理
    case 'file':
      let pk_accid_file = props.form.getFormItemsValue(this.formId, 'pk_accid').value;
      let accidcode_file = props.form.getFormItemsValue(this.formId, 'accidcode').value;
      this.setState({
        showUploader: !this.state.showUploader,
        billID: pk_accid_file,
        billNO: accidcode_file,
      });
      break;
    // 打印
    case 'print':
      let pk_accidprint = this.props.form.getFormItemsValue(this.formId, 'pk_accid');
      print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/tmpub/tmbd/acciddprint.do',
        {
          // printTemplateID: '1001Z61000000002JHZT',
          //功能节点编码，即模板编码
          appcode: appcode,
          // 模板节点标识
          nodekey: printnodekey,
          // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
          oids: [pk_accidprint && pk_accidprint.value]
        }
      );
      break;
    // 输出
    case 'output':
      let pk_accidoutput = this.props.form.getFormItemsValue(this.formId, 'pk_accid');
      output({
        url: '/nccloud/tmpub/tmbd/acciddprint.do',
        data: {
          //功能节点编码，即模板编码
          appcode: appcode,
          // 模板节点标识
          nodekey: printnodekey,
          // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
          oids: [pk_accidoutput && pk_accidoutput.value],
          outputType: 'output'
        }
      });
      break;
    // 刷新
    case 'refresh':
      this.refreshHtml();
      break;
    default:
      break;
  }
}

/**
 * 保存
 * @param {*} props 
 */
//begin tm tangleic 20200219 保存增加回调钩子 便于保存新增功能
// const save = function (that, props) {
const save = function (that, props, callback) {
  //end tm tangleic
  let savedata = props.createFormAfterEventData(card_page_id, card_from_id);
  //begin tm tangleic 20200219 根据当前语种获取对应的字段名
  let accidnamefield = props.form.getResidtxtLang(card_from_id,'accidname');
  //将多语语种字段的值同步到默认字段，后台都是基于默认字段做的逻辑处理
  savedata.form[card_from_id].rows[0].values[accidnamefield] = savedata.form[card_from_id].rows[0].values['accidname']; 
  let saveBeforePk = props.form.getFormItemsValue(card_from_id, 'pk_accid');
  ajax({
    url: '/nccloud/tmpub/tmbd/accidsave.do',
    data: savedata,
    success: (res) => {
      if (res.success) {
        if (res.data) {
          // toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000014') });/* 国际化处理： 保存成功*/
          if (res.data[card_from_id] && res.data[card_from_id].rows[0]) {
            this.backAccidcode = res.data[card_from_id].rows[0].values.accidcode.value;
          }
          props.form.setAllFormValue({ [card_from_id]: res.data[card_from_id] });
          if (saveBeforePk && saveBeforePk.value) {
            updateCache('pk_accid', res.data[card_from_id].rows[0].values.pk_accid.value,
              res.data, card_from_id, dataSource, res.data[card_from_id].rows[0].values);
          } else {
            addCache(res.data[card_from_id].rows[0].values.pk_accid.value,
              res.data, card_from_id, dataSource, res.data[card_from_id].rows[0].values);
          }
        }
      }
      props.setUrlParam({
        status: 'browse',
        id: res.data[card_from_id].rows[0].values.pk_accid.value
      });
      this.toggleShow();
      //begin tm tangleic 20200219 保存增加回调钩子 便于保存新增功能
      //执行回调
      if (callback && (typeof callback == 'function')) {
        callback();
      } else {
        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000014') });/* 国际化处理： 保存成功*/
      }
      //end tm tangleic
    }
  })
}

/**
 * 保存新增
 * @param {*} props 
 */
const saveAdd = function (that, props) {
  let saveadddata = props.createFormAfterEventData(card_page_id, card_from_id);
  let saveaddBeforePk = props.form.getFormItemsValue(card_from_id, 'pk_accid');
  ajax({
    url: '/nccloud/tmpub/tmbd/accidsave.do',
    data: saveadddata,
    success: (res) => {
      if (res.success) {
        if (res.data) {
          toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000014') });/* 国际化处理： 保存成功*/
          props.form.setAllFormValue({ [card_from_id]: res.data[card_from_id] });
          if (saveaddBeforePk && saveaddBeforePk.value) {
            updateCache('pk_accid', res.data[card_from_id].rows[0].values.pk_accid.value,
              res.data, card_from_id, dataSource, res.data[card_from_id].rows[0].values);
          } else {
            addCache(res.data[card_from_id].rows[0].values.pk_accid.value,
              res.data, card_from_id, dataSource, res.data[card_from_id].rows[0].values);
          }
        }
      }
      props.form.EmptyAllFormValue(card_from_id);
      this.backAccidcode = null;
      //单据有主组织，新增时,将其他字段设置为不可编辑.
      this.props.initMetaByPkorg();
      //设置组织可以编辑
      this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
    }
  })
}

const buildValidateSaveData = function (props) {
  let saveAllData = props.form.getAllFormValue(card_from_id);
  return {
    pageid: card_page_id,
    model: {
      areacode: card_from_id,
      rows: saveAllData.rows,
      areaType: 'form'
    }
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/