/*bYV6TlMcDiWSL4i88RGWFb3TYHxMOAb3W63H9DDeVMHYhaXb9xtgTUfNpmG0h4ly*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
/**
 * [外币兑换]-联查卖出账户余额按钮
 * @param {*} props  
 */
export const sellbalanceBtn = function () {
    let sellbalanceBtnData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (sellbalanceBtnData.length != 1) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000061')   // 提示内容,非必输/* 国际化处理： 请选择单条数据，联查卖出账户余额！*/
        })
        return;
    }

    let sellbalanceBtnArr = [];
    //处理选择数据
    sellbalanceBtnData.forEach((val) => {

        if (val.data.values.pk_sellacct && val.data.values.pk_sellacct.value != null) {
            let pk_sellacct = val.data.values.pk_sellacct.value;
            if (!pk_sellacct) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000062')   // 提示内容,非必输/* 国际化处理： 不存在卖出账户！*/
                })
                return;
            }
            let pk_sellorg = val.data.values.pk_org.value;
            //修改请求联查方式
            let query_sell_data = {
                pk_org: pk_sellorg, //财务组织id
                pk_account: pk_sellacct, //银行账户id，没有可不写，和现金账户二选一
                pk_cashaccount: null //现金账户id，没有可不写
            }

            sellbalanceBtnArr.push(query_sell_data);//卖出银行账号
            this.setState({
                showOriginalData: sellbalanceBtnArr,
                showOriginal: true,
            });
        } else {
            toast({
                duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                color: 'warning',     // 提示类别，默认是 "success",非必输
                title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000062')   // 提示内容,非必输/* 国际化处理： 不存在卖出账户！*/
            })
            return;
        }

    });
}

/*bYV6TlMcDiWSL4i88RGWFb3TYHxMOAb3W63H9DDeVMHYhaXb9xtgTUfNpmG0h4ly*/