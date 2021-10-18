/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, base, toast, promptBox } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
import { go2Card, cardOperator } from '../../../../pub/utils/SFButtonUtil';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index.js";
// ca
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { cardCache } from "nc-lightapp-front";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
let { addCache, getCurrentLastId, getNextId, deleteCacheById, getCacheById, updateCache } = cardCache;
export default function (props, id) {
  const pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') && props.form.getFormItemsValue(this.formId, 'pk_org').value;
  const pk_allocaterule_h = props.form.getFormItemsValue(this.formId, 'pk_allocaterule_h') && props.form.getFormItemsValue(this.formId, 'pk_allocaterule_h').value;
  debugger
  const ts = props.form.getFormItemsValue(this.formId, 'ts') && props.form.getFormItemsValue(this.formId, 'ts').value;
  let pkMapTs = {};
  switch (id) {
    case 'Save':
      debugger
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      this.saveBill();
      break;
    //保存新增
    case 'Saveadd':
    this.setState({addAndSave:true})
    //组织多版本
     orgVersionView(props, jsoncode.formcode);
     this.saveBill();
      //组织多版本
      //orgVersionView(props, jsoncode.formcode);
      // let CardData = props.createMasterChildData(jsoncode.cpageid, this.formId, this.tableId);
      // let url = requesturl.insert; //新增保存
      // ajax({
      //   url: url,
      //   data: CardData,
      //   success: (res) => {
      //     let pk_allocaterule_b = null;
      //     if (res.success) {
      //       if (res.data) {
      //         toast({ color: 'success', content: '保存新增成功' });
      //       }
      //     }
      //     // 清空表单form所有数据
      //     props.form.EmptyAllFormValue(this.formId);
      //     //清空table所有数据
      //     props.cardTable.setTableData(this.tableId, { rows: [] });
      //     props.pushTo("/card", {
      //       pagecode: jsoncode.cpageid,
      //       status: 'add'
      //     })
      //     //设置组织可以编辑
      //     props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
      //     //组织多版本
      //     orgVersionView(props, jsoncode.formcode);
      //     this.toggleShow();
      //   }
      // });
      break;
    //保存提交
    case 'Savecommit':
      // ajax({
      //   url: '/nccloud/sf/allocaterule/allocaterulesavecommit.do',
      //   data: props.createMasterChildData('36320AAC_C01', this.formId, this.tableId),
      //   success: (res) => {
      //     if (res.success) {
      //       if (res.data) {
      //         toast({ color: 'success', content: '保存提交成功' });
      //       }
      //     }
      //     //组织多版本
      //     orgVersionView(props, jsoncode.formcode);
      //     this.toggleShow();
      //   }
      // });
      save.call(this, props, () => {
        //复制操作的时候，再点保存提交，需要重新赋值一下
        props.setUrlParam({
          status: 'browse'
        });
        cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_allocaterule_h', requesturl.batchcommit, loadMultiLang(props,'36320AAC-000008'), jsoncode.dataSource, commitAssign.bind(this));/* 国际化处理： 提交*/
      });

      break;
    case 'Edit':
      //设置组织不可以编辑
      this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
      props.pushTo("/card", {
        pagecode: jsoncode.cpageid,
        status: 'edit',
        id: props.getUrlParam('id')
      })
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      this.toggleShow()
      break;
    case 'Copy':
      props.pushTo("/card", {
        pagecode: jsoncode.cpageid,
        status: 'copy',
        id: props.getUrlParam('id')
      })
      //复制时，在新增，点取消，不能有单据号，需要在这处理一下
      this.setState({ billno:'' });
      this.componentDidMount();
      break;

    case 'Delete':
      this.props.modal.show('delmodal');
      break;

    case 'Cancel':
      //考虑复制进入编辑状态后地址栏没有主键信息，故，在复制操作的时候将主键存储在局部变量id中
      promptBox({
        title: loadMultiLang(props,'36320AAC-000009'),/* 国际化处理： 取消*/
        color: "warning",
        content: loadMultiLang(props,'36320AAC-000010'),/* 国际化处理： 确定要取消吗？*/
        beSureBtnClick: cancelConfirm.bind(this, props)
      })
      break;
    // //启用 已弃用
    // case 'Enable':
    //   ajax({
    //     url: requesturl.enable,
    //     data: {
    //       pks: [pk_allocaterule_h]
    //      },
    //     success: (res) => {
    //       let { success, data } = res;
    //       if (success) {
    //         toast({ color: 'success', content: '启用成功' });
    //         this.getCardData();
    //       }
    //     }
    //   });
    //   break;
    // //停用 已弃用
    // case 'Disable':
    //   ajax({
    //     url: requesturl.disbale,
    //     data: {
    //      pks: [pk_allocaterule_h]
    //     },
    //     success: (res) => {
    //       let { success, data } = res;
    //       if (success) {
    //         toast({ color: 'success', content: '停用成功' });
    //         this.getCardData();
    //       }
    //     }
    //   });
    //   break;
    // 启用 
    case 'Enable':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_allocaterule_h', requesturl.batchenable, loadMultiLang(props,'36320AAC-000011'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 启用*/
      break;
    // 停用 
    case 'Disable':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_allocaterule_h', requesturl.batchdisable, loadMultiLang(props,'36320AAC-000012'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 停用*/
      break;
    // 提交 
    case 'Commit':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_allocaterule_h', requesturl.batchcommit, loadMultiLang(props,'36320AAC-000008'), jsoncode.dataSource, commitAssign.bind(this));/* 国际化处理： 提交*/
      break;
    // 收回
    case 'Uncommit':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_allocaterule_h', requesturl.batchuncommit, loadMultiLang(props,'36320AAC-000013'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 收回*/
      break;
    // 补录
    case 'BankAccReWrite':
      debugger
      pkMapTs[pk_allocaterule_h] = ts;
      ajax({
        url: '/nccloud/sf/allocaterule/allocaterulebankrewrite.do',
        data: {
          //主键pk与时间戳ts的映射
          pkMapTs,
          //页面编码
          pageCode: jsoncode.cpageid,
          //是否返回数据
          isRet: true
        },
        success: (res) => {
          if (res && res.data) {
            this.setState(
              {
                onLineData: res.data || [],
                modelType: SHOWMODEL_BULU
              }, () => {
                this.setState({ showBuLu: true });
              });
          }
        }
      });
      //this.toggleShow();
      break;
    //浏览
    case 'BankAccBrowse':
      pkMapTs[pk_allocaterule_h] = ts;
      ajax({
        url: '/nccloud/sf/allocaterule/allocaterulebankbrowse.do',
        data: {
          //主键pk与时间戳ts的映射
          pkMapTs,
          //页面编码
          pageCode: jsoncode.cpageid,
          //是否返回数据
          isRet: true
        },
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
      //浏览时若报错，再刷新页面会导致切换页签按钮不显示，先屏蔽掉
     // this.toggleShow();
      break;
    case 'Add':
      //这是为了让点浏览态后，再点新增，再点取消时，没有单据号
      //新增的时候将单据号制空
      this.setState({
        billno: ''
      });
      props.pushTo("/card", {
        pagecode: jsoncode.cpageid,
        status: 'add'
      })
      // // 清空表单form所有数据
      props.form.EmptyAllFormValue(this.formId);
      //清空table所有数据
      props.cardTable.setTableData(this.tableId, { rows: [] });
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      this.toggleShow()
      //增加除pk_org 设置所有字段都不可编辑相关逻辑（这是为了应对点击浏览后，再点新增，字段编辑性失效）
      props.initMetaByPkorg();
      //this.props.form.setFormItemsDisabled(this.formId,{'billmaker': true});
      break;
    //刷新
    case 'Refresh':
      this.getCardData();
      break;
    // case 'Addbody':
    //   let number = props.cardTable.getNumberOfRows(this.tableId);
    //   if (pk_org) {
    //     props.cardTable.addRow(
    //       this.tableId,
    //       number,
    //       {
    //         'paytype': { display: '普通', value: '0' },
    //         'ruletype': { display: '差额下拨', value: '1' }
    //       },
    //       false);
    //   } else {
    //     toast({
    //       'color': 'warning',
    //       'content': '请先填写财务组织！'
    //     });
    //     return;
    //   }
    //   break;
    // case 'Deletebody':
    //   let currRows = props.cardTable.getCheckedRows("table_allocaterule_C01");
    //   let currSelect = [];
    //   if (currRows && currRows.length > 0) {
    //     for (let item of currRows) {
    //       currSelect.push(item.index);
    //     }
    //   }
    //   props.cardTable.delRowsByIndex("table_allocaterule_C01", currSelect);
    //   break;
    // case 'Copybody':
    //   props.cardTable.pasteRow(this.tableId, val);
    //   break;
  }
}
/**
 * 提交指派
 * @param {*} props 
 * @param {*} data 
 */
const commitAssign = function (props, data) {
  debugger
  let { workflow } = data;
  //有指派信息，则指派，没有则重绘界面
  if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
    this.setState({ assignData: data, assignShow: data });
  } else {
    this.getCardData();
  }
}

/**
 * 保存提交
 * @param {*} props  页面内置对象
 */
const save = async function (props, callback) {
  //缓存
  let { addCache, updateCache } = cardCache;
  let { signal, isCaUser }= this.isCa;
  if (!signal) {
    let isContinue= await this.getIsca();
    //第一次点保存的时候会走这
    if (!isContinue) {
      toast({ color: 'warning', content: loadMultiLang(props,'36320AAC-000014') });/* 国际化处理： 此次进行的操作，要求使用CA签名，请配置第三方认证的签名方式*/
      return;
    }
  } else if (signal && !isCaUser) {//再次点保存的时候会走这，优化性能
    toast({ color: 'warning', content: loadMultiLang(props,'36320AAC-000014') });/* 国际化处理： 此次进行的操作，要求使用CA签名，请配置第三方认证的签名方式*/
    return;
  }
  debugger;
  if (this.props.getUrlParam('copyFlag') === 'copy') {
    this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
    this.props.form.setFormItemsValue(this.formId, { ts: null });
  }
  //过滤表格空行
  this.props.cardTable.filterEmptyRows(this.tableId);
  let flag = this.props.form.isCheckNow(this.formId)
  if (flag) {
    let cardData = this.props.createMasterChildData(jsoncode.cpageid, this.formId, this.tableId);
    let url = requesturl.insert; //新增保存
    if (this.props.getUrlParam('status') === 'edit') {
      url = requesturl.update; //修改保存
    }
    console.log(cardData, 'sign before cardData');
    let result = await Sign({
      isSign: true,
      isKey: true,
      data: cardData,
      isSave: true,
      encryptVOClassName: 'nccloud.web.sf.allocation.allocaterule.vo.AllocateRuleEncryptVO4NCC'
    });
    if (result.isStop) {
      return;
    }
    cardData = result.data;
    console.log(cardData, 'sign after cardData');
    ajax({
      url: url,
      data: cardData,
      success: (res) => {
        let pk_allocaterule_h = null;
        if (res.success) {
          if (res.data) {
            if (res.data.head && res.data.head[this.formId]) {
              this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
              pk_allocaterule_h = res.data.head[this.formId].rows[0].values.pk_allocaterule_h.value;
            }
            if (res.data.body && res.data.body[this.tableId]) {
              this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
            }
          }
          if (pk_allocaterule_h) {
            if (url === requesturl.insert) {
              //在列表点新增或在卡片上点新增按钮后，新增保存时，保存成功后，需要调用addCache方法，将数据存储到缓存中
              addCache(pk_allocaterule_h, res.data, this.formId, jsoncode.dataSource);
              callback(props, res.data);
            }
            if (url === requesturl.update) {
              //卡片修改保存时，保存成功后，需要调用updateCache方法，将数据更新到缓存中
              updateCache('pk_allocaterule_h', pk_allocaterule_h, res.data, this.formId, jsoncode.dataSource);
              callback(props, res.data);
            }
          }

        }
      }
    });
  }
}
/**
 * 取消确认
 * @param {*} props 
 * @param {*} pk
 */
const cancelConfirm = function (props) {
  debugger
  if (props.getUrlParam('status') === 'edit') {
    // 表单返回上一次的值
    props.form.cancel(this.formId)
    // 表格返回上一次的值
    props.pushTo("/card", {
      status: 'browse',
      id: props.getUrlParam('id'),
    });
    this.setState({ showNCbackBtn: true });
    this.getCardData();
  }
  //保存中的取消操作
  else if (props.getUrlParam('status') === 'add') {
    let id=props.getUrlParam('id');
    if(!id) {
    id=this.state.billId;
    }
    props.pushTo("/card", {
      id: id,
      status: 'browse',
    });
    this.setState({ showNCbackBtn: true });
    this.getCardData();
  }
  //复制中的取消操作
  else if (props.getUrlParam('status') === 'copy') {
    let id=props.getUrlParam('id');
    if(!id) {
    id=this.state.billId;
    }
    props.pushTo("/card", {
      id: id,
      status: 'browse',
    });
    this.setState({ showNCbackBtn: true });
    this.getCardData();
  }
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/