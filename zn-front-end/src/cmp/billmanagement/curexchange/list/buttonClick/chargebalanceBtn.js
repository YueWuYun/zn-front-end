/*RT6zd6FdyRSnmMJcql+8uEoCtiG3vUGdFdR4Zrwx5O8gp3Sg6t9QmhXrtT97O+Zg*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
/**
 * [外币兑换]-手续余额联查按钮
 * @param {*} props  
 */
export const chargebalanceBtn = function () {

    let chargebalanceBtnData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (chargebalanceBtnData.length != 1) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000063')   // 提示内容,非必输/* 国际化处理： 请选择单条数据，联查手续费账户！*/
        })
        return;
    }

    let chargebalanceBtnArr = [];
    //处理选择数据
    chargebalanceBtnData.forEach((val) => {

        if (val.data.values.pk_paychargeacct && val.data.values.pk_paychargeacct.value != null) {
            let pk_paychargeacct = val.data.values.pk_paychargeacct.value;
            if (!pk_paychargeacct) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000064')   // 提示内容,非必输/* 国际化处理： 不存在手续费账户！！*/
                })
                return;
            }
            let pk_charge_org = val.data.values.pk_org.value;
            //修改请求联查方式
            let query_charge_data = {
                pk_org: pk_charge_org, //财务组织id
                pk_account: pk_paychargeacct, //银行账户id，没有可不写，和现金账户二选一
                pk_cashaccount: null //现金账户id，没有可不写
            }
            chargebalanceBtnArr.push(query_charge_data);//卖出银行账号
            this.setState({
                showOriginalData: chargebalanceBtnArr,
                showOriginal: true,
            });
        } else {
            toast({
                duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                color: 'warning',     // 提示类别，默认是 "success",非必输
                title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000064')   // 提示内容,非必输/* 国际化处理： 不存在手续费账户！！*/
            })
            return;
        }

    });
}

/*RT6zd6FdyRSnmMJcql+8uEoCtiG3vUGdFdR4Zrwx5O8gp3Sg6t9QmhXrtT97O+Zg*/