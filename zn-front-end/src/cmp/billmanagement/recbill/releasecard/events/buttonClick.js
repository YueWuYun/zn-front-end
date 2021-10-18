/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { promptBox } from 'nc-lightapp-front';
import { saveReleaseBtn } from '../buttonClick/saveReleaseBtn.js';
export default function (props, id) {
  //验证公式
  let check_CardData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
  let saveobj = {};
  saveobj[this.tableId] = 'cardTable';
  switch (id) {
    //认领保存
    case 'saveReleaseBtn':
      saveReleaseBtn.call(this);
      break;
    //认领取消
    case 'cancelReleaseBtn':
      this.releasetoggleShow('browse');
      break;
    //认领退出
    case 'quitReleaseBtn':
      promptBox({
        color: "warning",
        content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000103'),/* 国际化处理： 确定要退出认领吗?*/
        beSureBtnClick: this.cancelReleaseConfirm.bind(this), //使用call直接執行了
      });
      break;
    //认领修改：修改不能修改金额
    case 'editReleaseBtn':
        this.props.setUrlParam({
          status: 'edit'
        });
      this.releasetoggleShow('edit');
      break;
    //删行
    case 'deletebodyBtn':
      promptBox({
        color: "warning",
        title: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000110'),/* 国际化处理： 提示*/
        content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000039'),/* 国际化处理： 你确定要删除吗?*/
        beSureBtnClick: this.delBodyConfirm.bind(this) //使用call直接執行了
      });
      break
    default:
      break;
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/