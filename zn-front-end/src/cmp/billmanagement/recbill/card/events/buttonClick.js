/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { toast, promptBox } from 'nc-lightapp-front';
import { annexBtn } from '../buttonClick/annexBtn.js';
import { addbodyBtn } from '../buttonClick/addbodyBtn.js';
import { deletebodyBtn } from '../buttonClick/deletebodyBtn.js';
import { copybodyBtn } from '../buttonClick/copybodyBtn.js';
import { copyLineLastBtn } from '../buttonClick/copyLineLastBtn.js';
import { addBtn } from '../buttonClick/addBtn.js';
import { editBtn } from '../buttonClick/editBtn.js';
import { copyBtn } from '../buttonClick/copyBtn.js';
import { subimtBtn } from '../buttonClick/subimtBtn.js';
import { submittAssginBtn } from '../buttonClick/submittAssginBtn.js';
import { unsubmitBtn } from '../buttonClick/unsubmitBtn.js';
import { redbillBtn } from '../buttonClick/redbillBtn.js';
import { linksettleBtn } from '../buttonClick/linksettleBtn.js';
import { imageviewBtn } from '../buttonClick/imageviewBtn.js';
import { imagescanBtn } from '../buttonClick/imagescanBtn.js';
import { makebillBtn } from '../buttonClick/makebillBtn.js';
import { printBtn } from '../buttonClick/printBtn.js';
import { outputBtn } from '../buttonClick/outputBtn.js';
import { linkquerybillBtn } from '../buttonClick/linkquerybillBtn.js';
import { querymsgBtn } from '../buttonClick/querymsgBtn.js';
import { queryvoucherBtn } from '../buttonClick/queryvoucherBtn.js';
import { queryconsumeBtn } from '../buttonClick/queryconsumeBtn.js';
import { querysynbillBtn } from '../buttonClick/querysynbillBtn.js';
import { cardannexBtn } from '../buttonClick/cardannexBtn.js';
import { unlinksettleBtn } from '../buttonClick/unlinksettleBtn.js';
import { checkSingleSettleDel } from '../buttonClick/checkSingleSettle';
import { checkEditRight, checkCloseTradeType } from '../../util/checkEditRight.js';
import { saveSubBill } from '../indexUtil/saveSubBill.js';
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';
export default function (props, id) {
  //验证公式[一主一子]
  let check_CardData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
  let saveobj = {};
  saveobj[this.tableId] = 'cardTable';
  switch (id) {
    //刷新按钮
    case 'refreshBtn':
      this.refresh();
      break;
    // 取消审批
    case 'cancelApproveBtn':
      this.approve('UNAPPROVE')
      break;
    //取消
    case 'cancelBtn':
      promptBox({
        color: "warning",
        title: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000041'),
        content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000043'),/* 国际化处理： 确定要取消吗?*/
        beSureBtnClick: this.cancelConfirm.bind(this), //使用call直接執行了
      });
      break;
    //保存
    case 'saveBtn':
      //验证公式
      this.props.validateToSave(check_CardData, this.saveBill.bind(this), saveobj, '');
      // this.saveBill();
      break;
    //保存新增
    case 'saveaddBtn':
      //验证公式
      this.props.validateToSave(check_CardData, this.saveAddBill.bind(this), saveobj, '');
      //this.saveAddBill()
      break
    //保存提交
    case 'savesubmitBtn':
      //验证公式
      // this.props.validateToSave(check_CardData, this.saveSubBill(), saveobj, '');
      saveSubBill.call(this);
      break;
    //附件
    case 'annexBtn':
      annexBtn.call(this);
      break;
    //body新增
    case 'addbodyBtn':
      addbodyBtn.call(this);
      break;
    //body删除
    case 'deletebodyBtn':
      deletebodyBtn.call(this);
      // promptBox({
      //   color: "warning",
      //   title: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000110'),/* 国际化处理： 提示*/
      //   content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000039'),/* 国际化处理： 你确定要删除吗?*/
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
    //head新增
    case 'addBtn':
      addBtn.call(this);
      break
    //head修改
    case 'editBtn':
      checkEditRight.call(this, this.props.getUrlParam('id')).then((res) => {
        editBtn.call(this);
      });
      break
    //删除
    case 'deleteBtn':
      //关联结算信息生成的单据不允许删除20190107
      if (!checkSingleSettleDel.call(this)) {
        return;
      }
      promptBox({
        color: "warning",
        title: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000110'),/* 国际化处理： 提示*/
        content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000039'),/* 国际化处理： 你确定要删除吗?*/
        beSureBtnClick: this.delConfirm.bind(this), //使用call直接執行了
      });
      break
    //head复制
    case 'copyBtn':
      checkCloseTradeType.call(this, this.props.getUrlParam('id')).then((res) => {
        copyBtn.call(this);
      });
      break
    //提交
    case 'subimtBtn':
      subimtBtn.call(this);
      break
    //提交指派
    case 'submittAssginBtn':
      submittAssginBtn.call(this);
      break
    //收回
    case 'unsubmitBtn':
      unsubmitBtn.call(this);
      break
    //收款交易类型
    case 'rectradetypeBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break
    //红冲
    case 'redbillBtn':
      redbillBtn.call(this);
      break
    //关联结算信息
    case 'linksettleBtn':
      linksettleBtn.call(this);
      break
    //取消关联结算信息
    case 'unlinksettleBtn':
      unlinksettleBtn.call(this);
      break
    //影像查看
    case 'imageviewBtn':
    case 'linkimageviewBtn':

     if(CMPEableSscivm.call(this)){
              return ;
           };
      imageviewBtn.call(this);
      break;
    //影像扫描
    case 'imagescanBtn':
    case 'linkimagescanBtn':

   if(CMPEableSscivm.call(this)){
        return ; };
      imagescanBtn.call(this);
      break;
    //制单
    case 'makebillBtn':
      makebillBtn.call(this);
      break;
    //打印
    case 'printBtn':
      printBtn.call(this);
      break;
    //联查中的打印按钮
    case 'cardprintBtn':
      printBtn.call(this);
      break
    //预览
    case 'viewBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break
    //输出
    case 'outputBtn':
      outputBtn.call(this);
      break;
    //联查中的输出按钮
    case 'cardoutputBtn':
      outputBtn.call(this);
      break
    //打印清单
    case 'printDetailBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break
    //联查单据  
    case 'linkquerybillBtn':
      linkquerybillBtn.call(this);
      break
    //查看审批意见 
    case 'querymsgBtn':
      querymsgBtn.call(this);
      break
    //联查凭证   
    case 'queryvoucherBtn':
      queryvoucherBtn.call(this);
      break;
    //联查计划预算
    case 'queryconsumeBtn':
      queryconsumeBtn.call(this);
      break;
    //联查协同单据
    case 'querysynbillBtn':
      querysynbillBtn.call(this);
      break;
    //附件
    case 'cardannexBtn':
      cardannexBtn.call(this);
      break
    default:
      break
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/