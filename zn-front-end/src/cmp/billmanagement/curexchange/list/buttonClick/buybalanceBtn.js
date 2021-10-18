/*2hICxqE0uCI+hnHBZhd/QnmoOJkNZ4JdYTp4PQlJxwX6E67ZzTCd8ycuSAjGyp2b*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
/**
 * [外币兑换]-联查买入余额按钮
 * @param {*} props  
 */
export const buybalanceBtn = function () {

    let buybalanceBtnData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (buybalanceBtnData.length != 1) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000059')   // 提示内容,非必输/* 国际化处理： 请选择单条数据，联查买入账户余额!*/
        })
        return;
    }

    let buybalanceBtnArr = [];
    //处理选择数据
    buybalanceBtnData.forEach((val) => {

        if (val.data.values.pk_buyacct && val.data.values.pk_buyacct.value != null) {

            let pk_buyacct = val.data.values.pk_buyacct.value;
            if (!pk_buyacct) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000060')   // 提示内容,非必输/* 国际化处理： 不存在买入账户!*/
                })
                return;
            }
            let pk_buyorg = val.data.values.pk_org.value;
            //修改请求联查方式
            let query_data = {
                pk_org: pk_buyorg, //财务组织id
                pk_account: pk_buyacct, //银行账户id，没有可不写，和现金账户二选一
                pk_cashaccount: null //现金账户id，没有可不写
            }
            buybalanceBtnArr.push(query_data);//买入银行账号
            this.setState({
                showOriginalData: buybalanceBtnArr,
                showOriginal: true,
            });
        } else {
            toast({
                duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                color: 'warning',     // 提示类别，默认是 "success",非必输
                title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000060')   // 提示内容,非必输/* 国际化处理： 不存在买入账户!*/
            })
            return;
        }

    });
}

/*2hICxqE0uCI+hnHBZhd/QnmoOJkNZ4JdYTp4PQlJxwX6E67ZzTCd8ycuSAjGyp2b*/