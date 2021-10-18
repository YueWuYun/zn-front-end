/*9KFtDin8/taitRCNBwjg633kSZRmfY9epGrQnOnFU1oKdBW+Bqt/jZMcTeSmWiKj*/
import { promptBox } from 'nc-lightapp-front';

/**
 * [收款]-切换组织
 * @param {*} props  
 */
export const changeOrgShow = function () {
    promptBox({
        color: "warning",
        content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000040'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
        beSureBtnClick: this.changeOrgConfirm.bind(this),
        cancelBtnClick: this.cancelBtnClick.bind(this), //取消按钮事件回调
      });
}

/*9KFtDin8/taitRCNBwjg633kSZRmfY9epGrQnOnFU1oKdBW+Bqt/jZMcTeSmWiKj*/