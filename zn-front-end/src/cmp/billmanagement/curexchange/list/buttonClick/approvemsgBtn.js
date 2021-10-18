/*DZWe5qQOapU4X7p07kL6ECYMH8PVC5NO96u0wlBV7RGMHJ2KUing8qfb2GV3OZ4f*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [外币兑换]-审批意见按钮
 * @param {*} props  
 */
export const approvemsgBtn = function () {

    let approvemsgData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (approvemsgData.length != 1) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000067')   // 提示内容,非必输/* 国际化处理： 请选择单条数据，查看审批意见!*/
        })
        return;
    }
    //处理选择数据
    let billid;
    approvemsgData.forEach((val) => {
        if (val.data.values.pk_cruexchange && val.data.values.pk_cruexchange.value != null) {
            billid = val.data.values.pk_cruexchange.value;
        }
    });
    if (billid) {
        this.setState({
            show: true,
            billtype: Templatedata.approve_billtype,//单据类型
            billid: billid//单据pk
        });
    }
}

/*DZWe5qQOapU4X7p07kL6ECYMH8PVC5NO96u0wlBV7RGMHJ2KUing8qfb2GV3OZ4f*/