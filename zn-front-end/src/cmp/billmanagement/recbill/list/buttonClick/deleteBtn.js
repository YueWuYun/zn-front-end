/*wRFqegMRbRgYSfr0BpItEzIdyKD7QQ0x/H8Anvce2ZWPOiL+tICS8HKUv7yPsIiz*/
import {toast, promptBox } from 'nc-lightapp-front';

/**
 * [收款]-删除按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const deleteBtn = function () {
    const selectedData = this.props.table.getCheckedRows(this.tableId);
    if (selectedData.length == 0) {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBM") &&
                    this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000005')
            });/* 国际化处理： 请选择数据，进行删除!*/
        return;
    }
    promptBox({
        color: "warning",
        title: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000110'),/* 国际化处理： 删除*/
        content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000101'),/* 国际化处理： 确定要删除单据吗?*/
        beSureBtnClick: this.delConfirm.bind(this) //使用call直接執行了
      });
}

/*wRFqegMRbRgYSfr0BpItEzIdyKD7QQ0x/H8Anvce2ZWPOiL+tICS8HKUv7yPsIiz*/