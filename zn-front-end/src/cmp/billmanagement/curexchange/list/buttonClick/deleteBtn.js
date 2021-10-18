/*wRFqegMRbRgYSfr0BpItEzIdyKD7QQ0x/H8Anvce2ZWPOiL+tICS8HKUv7yPsIiz*/
import { createPage, ajax, base, high, toast, cardCache,promptBox } from 'nc-lightapp-front';
import { delConfirm } from "../indexUtil/delConfirm";
/**
 * [外币兑换]-删除按钮
 * @param {*} props 
 */
export const deleteBtn = function () {
    let selectedData = this.props.table.getCheckedRows(this.tableId);
    if (selectedData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000046')   // 提示内容,非必输/* 国际化处理： 请选择数据,进行删除!*/
        })
        return;
    }
    promptBox({
        color: "warning", 
        title:this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000080'),//删除
        content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000030'),       
        beSureBtnClick: delConfirm.bind(this) //使用call直接執行了
      });
}

/*wRFqegMRbRgYSfr0BpItEzIdyKD7QQ0x/H8Anvce2ZWPOiL+tICS8HKUv7yPsIiz*/