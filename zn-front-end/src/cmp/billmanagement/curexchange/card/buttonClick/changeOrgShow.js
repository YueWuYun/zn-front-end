/*9KFtDin8/taitRCNBwjg633kSZRmfY9epGrQnOnFU1oKdBW+Bqt/jZMcTeSmWiKj*/
import { promptBox } from 'nc-lightapp-front';
import { changeOrgConfirm } from "../indexUtil/changeOrgConfirm.js";
import { cancelBtnClick } from "../indexUtil/cancelBtnClick.js";

/**
 * [外币兑换]-切换组织--确定时间
 * @param {*} props  
 */
export const changeOrgShow = function () {
  promptBox({
    color: "warning",
    content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000031'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
    beSureBtnClick: changeOrgConfirm.bind(this), //使用call直接執行了
    cancelBtnClick: cancelBtnClick.bind(this) //取消按钮事件回调
  });
}

/*9KFtDin8/taitRCNBwjg633kSZRmfY9epGrQnOnFU1oKdBW+Bqt/jZMcTeSmWiKj*/