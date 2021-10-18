/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, base, toast, promptBox } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { go2Card, cardOperator } from '../../../../pub/utils/SFButtonUtil';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index.js";
import { cardCache } from "nc-lightapp-front";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import initTemplate from './initTemplate.js';
import { resetBodysRowno } from '../../util/index';
let { addCache, getCurrentLastId, getNextId, deleteCacheById, getCacheById, updateCache } = cardCache;
export default function (props, id) {
  const pk_deliveryrule_h = props.form.getFormItemsValue(this.formId, 'pk_deliveryrule_h') && props.form.getFormItemsValue(this.formId, 'pk_deliveryrule_h').value;
  const pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') && props.form.getFormItemsValue(this.formId, 'pk_org').value;
  const ts = props.form.getFormItemsValue(this.formId, 'ts') && props.form.getFormItemsValue(this.formId, 'ts').value;
  let pkMapTs = {};
  switch (id) {
    case 'Save':
      //防止保存新增若有必输项校验没成功，而下次不保存新增了，点了保存，这里需要重置一下状态
      this.setState({ addAndSave: false, copyflag: false });
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      //每次保存时，将网银补录完整 字段制空，因为当网银补录过后，如果再修改保存，网银补录信息会自动清空，这里需要一致。每次修改时需要重新网银补录
      props.cardTable.setColsValue(jsoncode.ctablecode, [{ key: 'isnetbankfull', data: { display: null, value: null } }]);
      this.saveBill();
      break;
    //保存新增
    case 'Saveadd':
      this.setState({ addAndSave: true, copyflag: false })
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      //每次保存时，将网银补录完整 字段制空，因为当网银补录过后，如果再修改保存，网银补录信息会自动清空，这里需要一致。每次修改时需要重新网银补录
      props.cardTable.setColsValue(jsoncode.ctablecode, [{ key: 'isnetbankfull', data: { display: null, value: null } }]);
      this.saveBill();
      break;
    //保存提交
    case 'Savecommit':
      save.call(this, props, () => {
        //复制操作的时候，再点保存提交，需要重新赋值一下
        props.setUrlParam({
          status: 'browse'
        });
        cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryrule_h', requesturl.batchcommit, loadMultiLang(props, '36320ACC-000007'), jsoncode.dataSource, commitAssign.bind(this));/* 国际化处理： 提交*/
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
      this.setState({ status: 'edit' });
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
      this.setState({ billno: '' });
      this.componentDidMount();
      break;

    case 'Delete':
      promptBox({
        /* 国际化处理：删除*/
        title: loadMultiLang(props, '36320ACC-000023'), // 弹框表头信息/* 国际化处理： 删除*/
        color: "warning",
        content: loadMultiLang(props, '36320ACC-000024'),
        beSureBtnClick: this.delConfirm.bind(this, props),
      });
      break;

    case 'Cancel':
      //考虑复制进入编辑状态后地址栏没有主键信息，故，在复制操作的时候将主键存储在局部变量id中
      promptBox({
        title: loadMultiLang(props, '36320ACC-000008'),/* 国际化处理： 取消*/
        color: "warning",
        content: loadMultiLang(props, '36320ACC-000009'),/* 国际化处理： 确定要取消吗？*/
        beSureBtnClick: cancelConfirm.bind(this, props)
      })
      break;
    // 启用 
    case 'Enable':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryrule_h', requesturl.batchenable, loadMultiLang(props, '36320ACC-000010'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 启用*/
      break;
    // 停用 
    case 'Disable':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryrule_h', requesturl.batchdisable, loadMultiLang(props, '36320ACC-000011'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 停用*/
      break;
    // 提交 
    case 'Commit':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryrule_h', requesturl.batchcommit, loadMultiLang(props, '36320ACC-000007'), jsoncode.dataSource, commitAssign.bind(this));/* 国际化处理： 提交*/
      break;
    // 停用 
    case 'Uncommit':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryrule_h', requesturl.batchuncommit, loadMultiLang(props, '36320ACC-000012'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 收回*/
      break;
    // 补录
    case 'BankAccReWrite':
      pkMapTs[pk_deliveryrule_h] = ts;
      ajax({
        url: '/nccloud/sf/deliveryrule/deliveryrulebankrewrite.do',
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
      pkMapTs[pk_deliveryrule_h] = ts;
      ajax({
        url: '/nccloud/sf/deliveryrule/deliveryrulebankbrowse.do',
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
      //this.toggleShow();
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
      });
      // 清空表单form所有数据
      props.form.EmptyAllFormValue(this.formId);
      //清空table所有数据
      props.cardTable.setTableData(this.tableId, { rows: [] });
      //解决卡片态新增，无法带出默认业务单元，这里重新调一下init
      initTemplate.call(this, props);
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      this.toggleShow()
      //增加除pk_org 设置所有字段都不可编辑相关逻辑（这是为了应对点击浏览后，再点新增，字段编辑性失效）
      props.initMetaByPkorg();
      break;
    //刷新
    case 'Refresh':
      this.getCardData(true);
      break;
  }
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
  if (this.props.getUrlParam('copyFlag') === 'copy') {
    this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
    this.props.form.setFormItemsValue(this.formId, { ts: null });
  }
  //过滤表格空行
  this.props.cardTable.filterEmptyRows(this.tableId);
  let flag = this.props.form.isCheckNow(this.formId)
  if (flag) {
    //19/02/26 majfd 因为签名验签根据rowno排序的，所以重新按照当前签名顺序设置rowno
		resetBodysRowno.call(this, this.props);
    let CardData = this.props.createMasterChildData(jsoncode.cpageid, this.formId, this.tableId);
    let url = requesturl.insert; //新增保存
    if (this.props.getUrlParam('status') === 'edit') {
      url = requesturl.update; //修改保存
    }
    ajax({
      url: url,
      data: CardData,
      success: (res) => {
        let pk_deliveryrule_h = null;
        if (res.success) {
          if (res.data) {
            if (res.data.head && res.data.head[this.formId]) {
              this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
              pk_deliveryrule_h = res.data.head[this.formId].rows[0].values.pk_deliveryrule_h.value;
            }
            if (res.data.body && res.data.body[this.tableId]) {
              this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
            }
          }
          if (pk_deliveryrule_h) {
            if (url === requesturl.insert) {
              //在列表点新增或在卡片上点新增按钮后，新增保存时，保存成功后，需要调用addCache方法，将数据存储到缓存中
              addCache(pk_deliveryrule_h, res.data, this.formId, jsoncode.dataSource);
              callback(props, res.data);
            }
            if (url === requesturl.update) {
              //卡片修改保存时，保存成功后，需要调用updateCache方法，将数据更新到缓存中
              updateCache('pk_deliveryrule_h', pk_deliveryrule_h, res.data, this.formId, jsoncode.dataSource);
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
  if (props.getUrlParam('status') === 'edit') {
    // 表单返回上一次的值
    props.form.cancel(this.formId)
    // 表格返回上一次的值
    props.pushTo("/card", {
      status: 'browse',
      id: props.getUrlParam('id'),
      pagecode: jsoncode.cpageid
    });
    this.setState({ showNCbackBtn: true });
    this.getCardData();
  }
  //保存中的取消操作
  else if (props.getUrlParam('status') === 'add') {
    let id = props.getUrlParam('id');
    if (!id) {
      id = this.state.billId;
    }
    props.pushTo("/card", {
      id: id,
      status: 'browse',
      pagecode: jsoncode.cpageid
    });
    this.setState({ showNCbackBtn: true });
    this.getCardData();
  }
  //复制中的取消操作
  else if (props.getUrlParam('status') === 'copy') {
    let id = props.getUrlParam('id');
    if (!id) {
      id = this.state.billId;
    }
    props.pushTo("/card", {
      id: id,
      status: 'browse',
      pagecode: jsoncode.cpageid
    });
    this.setState({ showNCbackBtn: true });
    this.getCardData();
  }
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/