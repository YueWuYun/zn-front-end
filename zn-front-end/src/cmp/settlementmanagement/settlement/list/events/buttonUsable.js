/*cdIC5sEN8kUbd7loJ4DoBtasCAXOFBCwOdYbZ2TjbPIR3AlLNTXYs8QNem07f77h*/
import { Templatedata } from "../../config/Templatedata";


/**
 * 控制按钮是否可点js
 * @param {} that this
 * @param {*} props 
 * @param {*} key 是标识哪种状态0-5,5:全部选择
 */
export default function buttonUsable(props, key) {
    // 需要单个操作的按钮
    /**1.补录preparenetBtn
     * 2.红冲redHandleBtn
     * 3.联查单据linkQueryBillBtn
     * 4.联查余额linkRestMoneyBtn
     * 5.附件additionBtn
     * 6.制单makebillBtn
     * 
     */
    if (!key || key == '5') {
        let singalbutton = [
            'preparenetBtn',
            'redHandleBtn',
            'linkQueryBillBtn',
            'linkRestMoneyBtn',
            'additionBtn',
            'makebillBtn',
            'imageReview'
        ];//列表默认显示的按钮
        let selectedData = props.table.getCheckedRows(this.tableId);
        // 判断方向：收款、付款
        let direc = false;
        // 结算状态
        let setstatus = false;
        // （网银）审批状态
        let appstatus = false;
        if (selectedData && selectedData.length > 1) {
            let signBtnflag = true;//用做判断多选时是否可以点击签字；true可以，false不可以
            let busistatus = "";//业务单据状态；1为待签字
            selectedData.forEach((val) => {
                if (val.data.values.direction.value == '0') {
                    direc = true;  // 收
                }

                busistatus = val.data.values.busistatus == null ? null : val.data.values.busistatus.value == null ? null : val.data.values.busistatus.value;
                if (busistatus && busistatus != 1) {
                    signBtnflag = false;
                }

                // 结算状态
                let settlestatus = val.data.values.settlestatus == null ? null : val.data.values.settlestatus.value == null ? null : val.data.values.settlestatus.value;
                if (settlestatus && settlestatus == 1) {
                    // 支付中
                    setstatus = true;
                }

                // （网银）审批状态
                let approvestatus = val.data.values.vbillstatus == null ? null : val.data.values.vbillstatus.value == null ? null : val.data.values.vbillstatus.value;
                if (approvestatus && approvestatus != 1) {
                    // 未审核通过
                    appstatus = true;
                }


            })

            // props.button.setButtonDisabled('signBtn', !signBtnflag);//多选时控制签字是否可以编辑
            props.button.setButtonDisabled(['signBtn', 'antiSignBtn'], false);//多选时控制签字/取消是否可以编辑
            props.button.setButtonDisabled(['settleBtn', 'antiSettleBtn'], false);//多选时控制结算/取消结算可以显示 2020/02/29
            // 选择大于1条
            props.button.setButtonDisabled(singalbutton, true);
            // 收款||支付组||未网银审批 关闭支付组按钮
            if (direc || setstatus || appstatus) {
                props.button.setButtonDisabled(Templatedata.payBtn, true);
            } else {
                props.button.setButtonDisabled(Templatedata.payBtn, false);
            }

            // 显示联查凭证、打印组按钮
            props.button.setButtonDisabled(['linkVoucherBtn', 'printBtn', 'outputBtn'], false);
            // 禁用联查审批详情按钮
            props.button.setButtonDisabled('linkApproveBtn', true);

            return;
        } else if (selectedData && selectedData.length == 1) {
            //单条记录
            props.button.setButtonDisabled(singalbutton, false);
            props.button.setButtonDisabled(Templatedata.commitGroup, true);
            props.button.setButtonDisabled(Templatedata.cancelCommit, true);

            // 显示联查凭证、打印组按钮、审批详情
            props.button.setButtonDisabled(['linkVoucherBtn', 'printBtn', 'outputBtn', 'linkApproveBtn'], false);

            // 选择等于1条:根据状态判断
            if (selectedData[0].data && selectedData[0].data.values) {

                //业务单据状态
                let busis_tatus = selectedData[0].data.values.busistatus!=null?selectedData[0].data.values.busistatus.value:null;
                //结算状态
                let settlestatus = selectedData[0].data.values.settlestatus == null ? null : selectedData[0].data.values.settlestatus.value == null ? null : selectedData[0].data.values.settlestatus.value;
                //交易类型
                let tradetype = selectedData[0].data.values.pk_tradetype == null ? null : selectedData[0].data.values.pk_tradetype.value == null ? null : selectedData[0].data.values.pk_tradetype.value;
                // 方向
                let direc = selectedData[0].data.values.direction == null ? null : selectedData[0].data.values.direction.value == null ? null : selectedData[0].data.values.direction.value;
                // 审批状态
                let approvestatus = selectedData[0].data.values.vbillstatus == null ? null : selectedData[0].data.values.vbillstatus.value == null ? null : selectedData[0].data.values.vbillstatus.value;
                //是否需要承付
                let iscommpay = selectedData[0].data.values.iscommpay == null ? null : selectedData[0].data.values.iscommpay.value == null ? null : selectedData[0].data.values.iscommpay.value;
                //来源业务系统
                let systemcode = selectedData[0].data.values.systemcode!=null?selectedData[0].data.values.systemcode.value:null;
                //新增------>显示网银补录和联查支付确认单
                // if(settlestatus && settlestatus == 0){//未结算
                //     props.button.setButtonDisabled(Templatedata.linkNetBankBtn, true);
                //     props.button.setButtonDisabled(Templatedata.linkPayAffirmBtn, true);
                // }else{
                //     props.button.setButtonDisabled(Templatedata.linkNetBankBtn, false);
                //     props.button.setButtonDisabled(Templatedata.linkPayAffirmBtn, false);
                // }
                //1026修改成永久显示网银补录和联查支付确认单
                props.button.setButtonDisabled(Templatedata.linkNetBankBtn, false);
                props.button.setButtonDisabled(Templatedata.linkPayAffirmBtn, false);
                if (busis_tatus && busis_tatus == 1) {// 待签字
                    props.button.setButtonDisabled(Templatedata.settleGroup, true);
                    props.button.setButtonDisabled(Templatedata.commitGroup, true);
                    props.button.setButtonDisabled(Templatedata.payBtn, true);
                    props.button.setButtonDisabled('signBtn', false);
                    props.button.setButtonDisabled('antiSignBtn', true);
                    props.button.setButtonDisabled('commitToFTSBtn', false);
                    return;
                }
                if (busis_tatus && busis_tatus == 8 && settlestatus && settlestatus == 0) {// 待结算
                    // 待结算
                    props.button.setButtonDisabled('settleBtn', false);
                    props.button.setButtonDisabled('antiSettleBtn', false);
                    // 网银审批通过，不展示取消签字
                    if (approvestatus && (approvestatus == 1 || approvestatus == 2)) {
                        props.button.setButtonDisabled('antiSignBtn', true);
                    } else {
                        props.button.setButtonDisabled('antiSignBtn', false);
                    }
                    props.button.setButtonDisabled(Templatedata.signGroup, true);
                    //控制委托办理按钮显隐性--新加逻辑
                    //单据状态是：签字的显示委托办理
                    props.button.setButtonDisabled(Templatedata.commitGroup, false);
                    // 收款||未网银审批 关闭支付组按钮
                    if (direc == '0' || (approvestatus && approvestatus != '1')) {
                        props.button.setButtonDisabled(Templatedata.payBtn, true);
                    } else {
                        props.button.setButtonDisabled(Templatedata.payBtn, false);
                    }
                    //begin_zhanghjr:承付的结算单未结算状态不允许进行委托办理add on 2019/08/20
                    if(iscommpay){
                        props.button.setButtonDisabled(Templatedata.commitGroup, true);
                        props.button.setButtonDisabled(Templatedata.cancelCommit, true);
                    }
                    //end_zhagnhjr
                    return;
                }
                if (settlestatus && (settlestatus == 1)) {// 支付中
                    // 支付中
                    props.button.setButtonDisabled(Templatedata.signGroup, true);
                    props.button.setButtonDisabled(Templatedata.settleGroup, true);
                    props.button.setButtonDisabled(Templatedata.commitGroup, true);
                    props.button.setButtonDisabled(Templatedata.payBtn, true);
                    props.button.setButtonDisabled('commitToFTSBtn', false);
                    return;
                }

                //2019-03-12新增按钮显隐性控制
                if (busis_tatus && busis_tatus == 8 && settlestatus && settlestatus == 2) {
                    //<支付失败>签字单据可以显示:网上转账，支付变更，网银补录
                    props.button.setButtonDisabled(Templatedata.payBtn, true);
                    props.button.setButtonDisabled(Templatedata.netpayBtn, false);
                    props.button.setButtonDisabled(Templatedata.preparenetBtn, false);
                    props.button.setButtonDisabled(Templatedata.combinpayBtn, false);
                    props.button.setButtonDisabled(Templatedata.redHandleBtn, false);
                    //1903 or 1909支持网：可以使用取消签字：单据状态：签字，结算状态：支付失败
                    props.button.setButtonDisabled(Templatedata.antiSignBtn, false);
                }
                //2020-02-27 签字, 收款中可以取消委托
                if (busis_tatus && busis_tatus == 8 && settlestatus && settlestatus == 3) {
                    props.button.setButtonDisabled(Templatedata.cancelCommit, false);
                }
                //2019-03-12新增按钮显隐性控制
                if (busis_tatus && busis_tatus == 8 && settlestatus && settlestatus == 6) {
                   //<部分成功>的签字单据可以显示:网上转账，合并支付，结算红冲
                    props.button.setButtonDisabled(Templatedata.payBtn, true);
                    props.button.setButtonDisabled(Templatedata.netpayBtn, false);
                    props.button.setButtonDisabled(Templatedata.preparenetBtn, false);
                    props.button.setButtonDisabled(Templatedata.combinpayBtn, false);
                    props.button.setButtonDisabled(Templatedata.redHandleBtn, false);
                }
                //结算成功-->可以取消结算
                if (settlestatus && settlestatus == 5) {
                    props.button.setButtonDisabled(Templatedata.antiSettleBtn, false);
                    // begin 2020-02-27 关联资金结算单据结算信息生成的结算单据，到账通知认领生成 可以取消签字
                    if ((systemcode == 5 || systemcode == 2) && busis_tatus == 8) {
                        props.button.setButtonDisabled(Templatedata.antiSignBtn, false);
                    } else if ((systemcode == 5 || systemcode == 2) && busis_tatus == 1) {
                        props.button.setButtonDisabled(Templatedata.signGroup, false);
                    }
                    // end
                }
            }
            // 去掉工资单控制不展示委托按钮，具体可不可以委托在操作里判断 - 2018-10-15同娟姐确认
            // if (tradetype && tradetype == 'DS') {//网银工资清单在结算应控制不可用委托办理
            //     props.button.setButtonDisabled('commitToFTSBtn', true);
            // } else {
            //     props.button.setButtonDisabled('commitToFTSBtn', false);
            // }

            return;
        } else {
            props.button.setButtonDisabled(Templatedata.allBtnName, true);//没有数据时按钮不可用
            return;
        }
    }
    switch (key) {
        case '0':
            // 全部页签
            // 不处理
            break;
        case '1':
            // 待签字,将结算支付置为不可用
            // button = ['antiSignBtn','settleBtn','antiSettleBtn',
            //     'commitToFTSBtn','cancelCommitToFTSBtn','netpayBtn','combinpayBtn',
            //     'preparenetBtn','redHandleBtn','',''];
            props.button.setButtonDisabled(Templatedata.settleGroup, true);
            props.button.setButtonDisabled(Templatedata.commitGroup, true);
            props.button.setButtonDisabled(Templatedata.payBtn, true);
            props.button.setButtonDisabled('antiSignBtn', true);
            break;
        case '2':
            // 待结算
            props.button.setButtonDisabled(Templatedata.signGroup, true);
            break;
        case '3':
            // 待支付
            props.button.setButtonDisabled(Templatedata.signGroup, true);
            break;
        case '4':
            // 支付中
            props.button.setButtonDisabled(Templatedata.signGroup, true);
            props.button.setButtonDisabled(Templatedata.settleGroup, true);
            props.button.setButtonDisabled(Templatedata.commitGroup, true);
            props.button.setButtonDisabled(Templatedata.payBtn, true);

            break;
        default:
            break;
    }

}



/*cdIC5sEN8kUbd7loJ4DoBtasCAXOFBCwOdYbZ2TjbPIR3AlLNTXYs8QNem07f77h*/