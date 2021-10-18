/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { promptBox, ajax, toast } from 'nc-lightapp-front';
import appBase from '../../../base'
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

export default function tableButtonClick(props, key, text, record, index) {
    //console.log(key);
    let _this = this;
    let pk = record.pk_settlement.value;
    let ts = record.ts.value;
    let pks = [];
    let tss = [];
    let pktsmap = {};
    let indexs = [];
    pks.push(pk);
    tss.push(ts);
    pktsmap[pk] = ts;
    indexs.push(index);
    let data = {
        pks: pks,
        tss: tss,
        pktsmap: pktsmap,
    };
    // 结算状态
    let settlestatus = record.settlestatus.value;
    let error = [];
    //list总操作列中动作
    switch (key) {
        case 'innerNetpayBtn':
            appBase.api.listSingleDuplicatePayCheck(this.props,
                {
                    record,
                    confirm: innerNetPay.bind(this, { record, index, data, error })
                });
            break;

        case 'innerUpdatePayStatusBtn':
            // 更新支付状态
            if (!settlestatus || settlestatus != '1') {
                // 1为支付中单据,只有支付中单据才可以进行更新支付状态
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000049') });/* 国际化处理： 支付中单据才可进行更新支付状态操作*/
                return;
            }
            ajax({
                url: Templatedata.netpayupdatestatus,
                data: data,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        // 刷新当前页
                        // self.refreshPks();
                        _this.refreshByData(indexs, data);
                    }
                }
            });
            break;
        case 'innerRedHandleBtn':
            //结算红冲
            // 结算状态为支付失败的单据才可以进行红冲操作
            // 2为支付失败单据,6为部分成功的单据
            if (settlestatus == '2' || settlestatus == '6') {
                promptBox({
                    color: "warning",
                    title: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000016'),/* 国际化处理： 结算红冲*/
                    content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000017'),/* 国际化处理： 结算红冲操作不可逆,确定是否继续?*/
                    beSureBtnClick: this.redHandleProcess.bind(this), //使用call直接執行了
                });
            } else {
                toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000050') });/* 国际化处理： 支付失败的单据才可进行红冲操作！*/
            }

            break;
    }
}

/**网上转账 */
const innerNetPay = function ({ record, index, error, data }) {
    //设置ca弹框--使用工资清单单据结算支付使用
    let trade_code = record.tradertypecode.value;
    this.setState({
        tradecode: trade_code,
    });
    //设置表格的选中状态:防止在补录保存的时候校验失败
    this.props.table.selectAllRows(this.tableId, false);
    this.props.table.selectTableRows(this.tableId, [index], true);
    // 网上转账
    // 对数据状态进行校验，非签字态不可进行网上转账
    // 结算状态
    let settlestatus = record.settlestatus.value;
    // 签字人
    let pk_signer = record.pk_signer.value;
    if (pk_signer && (settlestatus == '0' || settlestatus == '2')) {
        // 结算状态为未结算'0'为未结算，是未结算且签字人不为空，可以进行网上支付

    } else {
        let billcode = record.billcode.value;
        error.push(billcode);
    }
    if (error && error.length > 0) {
        let content = (props.MutiInit.getIntl("36070OP") && props.MutiInit.getIntl("36070OP").get('36070OP-000023'))
            + error.join(', ')
            + (props.MutiInit.getIntl("36070OP") && props.MutiInit.getIntl("36070OP").get('36070OP-000062'));/* 国际化处理： 单据编号 , 不可进行网上转账操作！*/
        toast({ color: 'warning', content: content });
        return;
    } else {
        // 此处需要先校验是否可以网银支付，然后再弹框
        ajax({
            url: Templatedata.netpayValidate,
            data: data,
            success: (res) => {
                let { success } = res;
                if (success) {
                    // 成功即代表校验通过，否则就会抛出异常数据、
                    this.setState({
                        paydata: data
                    }, () => {
                        promptBox({
                            color: "warning",
                            title: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000020'),/* 国际化处理： 网上支付*/
                            content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000061'),/* 国际化处理： 确定进行网上支付?*/
                            beSureBtnClick: this.netPayProcess.bind(this), //使用call直接執行了
                        });
                    })
                }
            }
        });
    }
}



/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/