/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { toast, promptBox } from 'nc-lightapp-front';
import { annexBtn } from '../buttonClick/annexBtn.js';
import { addbodyBtn } from '../buttonClick/addbodyBtn.js';
import { deletebodyBtn } from '../buttonClick/deletebodyBtn.js';
import { copybodyBtn } from '../buttonClick/copybodyBtn.js';
import { copyLineLastBtn } from '../buttonClick/copyLineLastBtn.js';
import { linkquerybillBtn } from '../buttonClick/linkquerybillBtn.js';
import { querymsgBtn } from '../buttonClick/querymsgBtn.js';
import { queryvoucherBtn } from '../buttonClick/queryvoucherBtn.js';
import { querysynbillBtn } from '../buttonClick/querysynbillBtn.js';
import { confirmBtn } from '../buttonClick/confirmBtn.js';
import { unconfirmBtn } from '../buttonClick/unconfirmBtn.js';
import { checkSingleSettleDel } from '../buttonClick/checkSingleSettle';
export default function (props, id) {
  //验证公式
  let check_CardData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
  let saveobj = {};
  saveobj[this.tableId] = 'cardTable';
  switch (id) {
    //取消操作
    case 'cancelBtn':
      promptBox({
        color: "warning",
        title: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000065'),/* 国际化处理： 取消*/
        content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000036'),/* 国际化处理： 确定要取消吗?*/
        beSureBtnClick: this.cancelConfirm.bind(this) //使用call直接執行了
      });
      break;
    case 'addline':
      props.cardTable.addRow(this.tableId)
      break;
    //协同确认保存
    case 'saveBtn':
      //验证公式
      this.props.validateToSave(check_CardData, this.saveBill.bind(this), saveobj, '');
      break;
    //保存新增
    case 'saveaddBtn':
      //验证公式
      this.props.validateToSave(check_CardData, this.saveAddBill.bind(this), saveobj, '');
      break
    //协同确认保存提交
    case 'savesubmitBtn':
      //验证公式
      this.props.validateToSave(check_CardData, this.saveSubBill.bind(this), saveobj, '');
      break
    //附件
    case 'annexBtn':
      annexBtn.call(this);
      break
    //body新增
    case 'addbodyBtn':
      addbodyBtn.call(this);
      break
    //body删除
    case 'deletebodyBtn':
      deletebodyBtn.call(this);
      // promptBox({
      //   color: "warning",
      //   title: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000064'),/* 国际化处理： 删除*/
      //   content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000062'),/* 国际化处理： 确定要删除单据吗?*/
      //   beSureBtnClick: deletebodyBtn.bind(this) //使用call直接執行了
      // });
      break
    //body复制
    case 'copybodyBtn':
      copybodyBtn.call(this);
      break;
    //取消粘贴
    case 'cancelLineBtn':
      this.setState({ pasteflag: false }, () => { this.toggleShow() });
      break;
    //粘贴末行
    case 'copyLineLastBtn':
      copyLineLastBtn.call(this);
      break;
    //head修改
    case 'editBtn':
      props.pushTo('/card', {
        status: 'edit',
        id: props.getUrlParam('id'),
      })
      this.refresh();
      break
    case 'deleteBtn':
      //关联结算信息生成的单据不允许删除20190107
      if (!checkSingleSettleDel.call(this)) {
        return;
      }
      promptBox({
        color: "warning",
        title: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000064'),/* 国际化处理： 删除*/
        content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000062'),/* 国际化处理： 确定要删除单据吗?*/
        beSureBtnClick: this.delConfirm.bind(this) //使用call直接執行了
      });
      break
    case 'copyBtn':
      props.pushTo('/card', {
        status: 'copy',
        id: props.getUrlParam('id'),
      })
      this.refresh();
      break
    //提交
    case 'subimtBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //收回
    case 'unsubmitBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    case 'rectradetypeBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //红冲
    case 'redbillBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    case 'linksettleBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //影像查看
    case 'imageviewBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //影像扫描
    case 'imagescanBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //制单
    case 'makebillBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //打印
    case 'printBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //预览
    case 'viewBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //输出
    case 'outputBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //打印清单
    case 'printDetailBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //联查单据  
    case 'linkquerybillBtn':
      linkquerybillBtn.call(this);
      break
    //查看审批意见 
    case 'querymsgBtn':
      querymsgBtn.call(this);
      break;
    //联查凭证   
    case 'queryvoucherBtn':
      queryvoucherBtn.call(this);
      break
    //联查计划预算 
    case 'queryconsumeBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000010') });/* 国际化处理： 功能待开发*/
      break
    //联查协同单据--->付款结算单 
    case 'querysynbillBtn':
      querysynbillBtn.call(this);
      break;
    //协同确定---->跳转到编辑页面
    case 'confirmBtn':
      confirmBtn.call(this);
      break
    //确定取消
    case 'unconfirmBtn':
      unconfirmBtn.call(this);
      break
    //刷新按钮
    case 'refreshBtn':
      this.refresh();
      break
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/