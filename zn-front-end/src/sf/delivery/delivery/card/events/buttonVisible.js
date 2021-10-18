/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
/**
 * 处理按钮的可见性
 * @param {*} props 界面内置对象
 */
import {
    card_page_id, card_from_id, card_table_id, card_fromtail_id, state, deliveryPk, dataSource
} from '../../cons/constant.js';
import { recorddisuseEnbale } from '../../util'
import { loadMultiLang, showErrBtn } from "../../../../../tmpub/pub/util/index";

export default function buttonVisible(props) {
    let status = props.getUrlParam('status');
    props.cardTable.setStatus(card_table_id, 'edit');
    let flag = status === 'browse' ? false : true;
    // 表体肩部按钮
    let pasteflag = this.state.pasteflag || false;
    //勾选数据
    let selectDatas = props.cardTable.getCheckedRows(card_table_id);
    let isSelect = selectDatas && selectDatas.length > 0;
    //设置看片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
    props.form.setFormStatus(card_from_id, status);
    if (status == 'browse') {
        props.cardTable.setStatus(card_table_id, 'browse');
    } else {
        props.cardTable.setStatus(card_table_id, 'edit');
    }
    if (!status) {
        props.button.setButtonVisible(
            [
                // 增行 删行 复制行
                'addline', 'delline', 'copyline',
                // 保存  保存新增  保存提交   取消
                'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                // 新增  修改  删除 复制
                'edit', 'delete', 'copy',
                // 	退回 经办
                'decidegroup', 'back', 'decide',
                // 提交 收回  
                'commit', 'uncommit',
                // 网银补录  网银浏览 
                'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                // 支付   取消支付   支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                // 'netbankgroup', 'pay', 'unpay', 'paystatus', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                'netbankgroup', 'pay', 'unpay', 'paystatus', 'payconfirm', 'payagain', 'netpayagain',
                // 凭证 取消制证
                'voucher', 'cancelvoucher',
                // 附件管理
                'file',
                // 联查  内部账户
                'linkquery', 'linkgroup', 'accountbalance',
                // 联查   上缴单  委托付款  回单  内部账户
                'linkapply', 'linkpayment', 'receipt',
                // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                'linkpayconfirm', 'linkvoucher', 'reviewapprove',
                // 付款账户   收款账户 计划预算
                'bankaccbalance_p', 'bankaccbalance_r', 'queryntbplan',
                // 打印 输出 
                'printdrop', 'printgroup', 'print', 'output', 'officprint', 'supplyprint',
                'refresh',
                //生成上收单
                'toDelivery'
            ],
            false);
        props.button.setButtonVisible(
            [
                // 新增
                'common', 'add',
            ],
            true);
    } else {
        if (status != 'browse') {
            props.button.setButtonVisible(
                [   // 新增  修改  删除 复制
                    'common', 'add', 'edit', 'delete', 'copy',
                    // 	退回 经办
                    'decidegroup', 'back', 'decide',
                    // 提交 收回  
                    'commit', 'uncommit',
                    // 网银补录  网银浏览 
                    'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                    // 支付   取消支付   支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                    // 'netbankgroup', 'pay', 'unpay', 'paystatus', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                    'netbankgroup', 'pay', 'unpay', 'paystatus', 'payconfirm', 'payagain', 'netpayagain',
                    // 凭证 取消制证
                    'voucher', 'cancelvoucher',
                    // 附件管理
                    'file',
                    // 联查   上缴单  委托付款  回单  内部账户
                    'linkapply', 'linkpayment', 'receipt',
                    // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                    'linkpayconfirm', 'linkvoucher', 'reviewapprove',
                    // 打印 输出 
                    'printdrop', 'printgroup', 'print', 'output', 'officprint', 'supplyprint',
                    'refresh',
                    //生成上收单
                    'toDelivery'
                ],
                false);
            // 保存，保存新增，保存提交，取消，联查
            props.button.setButtonVisible(
                [
                    // 增行 删行 复制行
                    'addline', 'delline', 'copyline',
                    // 保存  保存新增  保存提交   取消
                    'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                    // 联查  内部账户
                    'linkquery', 'linkgroup', 'accountbalance',
                    // 付款账户   收款账户 计划预算
                    'bankaccbalance_p', 'bankaccbalance_r', 'queryntbplan',
                ],
                true);

            //body 按钮的显隐性控制
            props.button.setButtonVisible(
                [   // 新增行   删除行 复制行
                    'addline', 'delline', 'copyline',
                ],
                !pasteflag
            );
            props.button.setButtonVisible(
                ['cancelLine', 'copyLineLast'],
                pasteflag);

            // 经办 表体不能新增删除数据
            let status = props.getUrlParam('status');
            if (status === 'decide') {
                // 卡片列表上按钮
                props.button.setButtonVisible(
                    [   // 新增行   删除行 复制行
                        'addline', 'delline', 'copyline', 'cancelLine', 'copyLineLast'
                    ],
                    false);
            }
            //begin tm tangleic 20190716 修改表格头部按钮的可用性逻辑
            let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
            props.button.setButtonDisabled(['addline'], !(pk_org && pk_org.value));
            props.button.setButtonDisabled(['delline', 'copyline'], !isSelect);
            // else if (status === 'add') {
            //     let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
            //     if (pk_org && pk_org.value) {
            //         props.button.setButtonDisabled([
            //             // 新增行
            //             'addline',
            //         ], false);
            //     } else {
            //         props.button.setButtonDisabled([
            //             // 新增行   删除行 复制行
            //             'addline', 'delline', 'copyline',
            //         ], true);
            //     }
            // } else if (status === 'copy') {
            //     props.button.setButtonDisabled([
            //         // 删除行 复制行
            //         'delline', 'copyline',
            //     ], true);
            //     props.button.setButtonDisabled([
            //         // 新增行   删除行 复制行
            //         'addline',
            //     ], false);
            // } else if (status === 'edit') {
            //     props.button.setButtonDisabled([
            //         // 删除行 复制行
            //         'delline', 'copyline',
            //     ], true);
            //     props.button.setButtonDisabled([
            //         // 新增行   删除行 复制行
            //         'addline',
            //     ], false);
            // }
            //end tangleic 20190716
        } else {
            // billstatus 1=待审批，2=待支付，3=支付中，4=转账成功，5=已作废，6=待提交，  
            let billstatus = props.form.getFormItemsValue(card_from_id, 'billstatus');
            // 是否已制证
            let ismakevoucher = props.form.getFormItemsValue(card_from_id, 'ismakevoucher');
            // 来源业务类型 1=手工录入，2=上收申请生成，3=自动上收生成，4=到账通知生成，5=委托付款取消回拨生成，
            let srcBusiType = props.form.getFormItemsValue(card_from_id, 'srcbusitype');
            // 审批状态 0=审批未通过，1=审批通过，2=审批进行中，3=提交，-1=自由，
            let vbillstatus = props.form.getFormItemsValue(card_from_id, 'vbillstatus');

            // 卡片列表上按钮
            props.button.setButtonVisible(
                [   // 新增行   删除行 复制行
                    'addline', 'delline', 'copyline', , 'cancelLine', 'copyLineLast'
                ],
                false);

            if (props.getUrlParam('id')) {
                //若单据冻结 则不显示任何按钮
                // let sagafrozen = props.form.getFormItemsValue(card_from_id, sagaField.frozen);
                // if (sagafrozen && sagafrozen.value == sagaFrozenEnum.frozen) {
                //     hideAllBtn(props);
                //     return;
                // }  
                if (ismakevoucher && ismakevoucher.value && ismakevoucher.value) {
                    props.button.setButtonVisible(
                        [   // 修改  删除
                            'edit', 'delete',
                            // 保存  保存新增  保存提交   取消
                            'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                            // 	退回 经办
                            'decidegroup', 'back', 'decide',
                            // 提交 收回  
                            'commit', 'uncommit',
                            // 网银补录  网银浏览 
                            'buludrop', 'bulugroup', 'netbankbulu',
                            // 支付   取消支付   
                            'netbankgroup', 'pay', 'unpay',
                            // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                            // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                            'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                            // 制证 
                            'voucher'
                        ],
                        false);
                    props.button.setButtonVisible(
                        [
                            // 新增  复制
                            'common', 'add', 'copy',
                            // 网银浏览 
                            'netbankbrowse',
                            // 制证
                            'cancelvoucher',
                            // 联查   上缴单  委托付款  回单  内部账户
                            'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                            // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                            'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                            // 附件管理
                            'file',
                            // 打印 输出 
                            'printdrop', 'printgroup', 'print', 'output',
                            'refresh',
                            //生成上收单
                            'toDelivery'
                        ],
                        true);
                } else {
                    if (billstatus && billstatus.value) {
                        // 待提交
                        if (billstatus.value == 6) {
                            if (srcBusiType && srcBusiType.value &&
                                (srcBusiType.value == 2 || srcBusiType.value == 4)) {
                                props.button.setButtonVisible(
                                    [
                                        // 修改  删除
                                        'edit', 'delete',
                                        // 保存  保存新增  保存提交   取消
                                        'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                        // 收回  
                                        'uncommit',
                                        // 网银补录  网银浏览 
                                        'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                                        // 支付   取消支付   
                                        'netbankgroup', 'pay', 'unpay',
                                        // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                                        // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                                        'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                                        // 凭证 取消制证
                                        'voucher', 'cancelvoucher'
                                    ],
                                    false);
                                props.button.setButtonVisible(
                                    [   // 新增  修改  删除 复制
                                        'common', 'add', 'copy',
                                        // 	退回 经办
                                        'decidegroup', 'back', 'decide',
                                        // 提交
                                        'commit',
                                        // 联查   上缴单  委托付款  回单  内部账户
                                        'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                                        // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                                        'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                                        // 附件管理
                                        'file',
                                        // 打印 输出 
                                        'printdrop', 'printgroup', 'print', 'output',
                                        'refresh',
                                        //生成上收单
                                        'toDelivery'
                                    ],
                                    true);
                            } else {
                                props.button.setButtonVisible(
                                    [
                                        // 保存  保存新增  保存提交   取消
                                        'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                        // 	退回 经办
                                        'decidegroup', 'back', 'decide',
                                        // 收回  
                                        'uncommit',
                                        // 网银补录  网银浏览 
                                        'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                                        // 支付   取消支付   
                                        'netbankgroup', 'pay', 'unpay',
                                        // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                                        // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                                        'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                                        // 回单 支付确认单  凭证 
                                        'receipt', 'linkpayconfirm', 'linkvoucher', 'reviewapprove',
                                        // 凭证 取消制证
                                        'voucher', 'cancelvoucher'
                                    ],
                                    false);
                                props.button.setButtonVisible(
                                    [   // 新增  修改  删除 复制
                                        'common', 'add', 'edit', 'delete', 'copy',
                                        // 提交
                                        'commit',
                                        // 联查   上缴单  委托付款   内部账户
                                        'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'accountbalance',
                                        // 付款账户   收款账户  计划预算  审批详情
                                        'bankaccbalance_p', 'bankaccbalance_r', 'queryntbplan',
                                        // 附件管理
                                        'file',
                                        // 打印 输出 
                                        'printdrop', 'printgroup', 'print', 'output',
                                        'refresh',
                                        //生成上收单
                                        'toDelivery'
                                    ],
                                    true);
                            }
                            props.button.setMainButton(['add'], false);
                        }
                        // 待审批
                        else if (billstatus.value == 1) {
                            props.button.setButtonVisible(
                                [   // 修改  删除 
                                    'common', 'delete', 'edit',
                                    // 保存  保存新增  保存提交   取消
                                    'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                    // 	退回 经办
                                    'decidegroup', 'back', 'decide',
                                    // 提交 
                                    'commit',
                                    // 支付   取消支付  
                                    'netbankgroup', 'pay', 'unpay',
                                    // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                                    // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                                    'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                                    // 回单 支付确认单  凭证
                                    'receipt', 'linkpayconfirm', 'linkvoucher',
                                    // 凭证 取消制证
                                    'voucher', 'cancelvoucher'
                                ],
                                false);
                            props.button.setButtonVisible(
                                [   // 新增  复制
                                    'common', 'add', 'copy',
                                    // 收回  
                                    'uncommit',
                                    // 网银补录  网银浏览 
                                    'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                                    // 联查   上缴单  委托付款  回单  内部账户
                                    'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'accountbalance',
                                    // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                                    'bankaccbalance_p', 'bankaccbalance_r', 'queryntbplan', 'reviewapprove',
                                    // 附件管理
                                    'file',
                                    // 打印 输出 
                                    'printdrop', 'printgroup', 'print', 'output',
                                    'refresh',
                                    //生成上收单
                                    'toDelivery'
                                ],
                                true);
                        }
                        // 待支付
                        else if (billstatus.value == 2) {
                            if (vbillstatus && vbillstatus.value &&
                                (vbillstatus.value == 0 || vbillstatus.value == 1
                                    || vbillstatus.value == 2)) {
                                props.button.setButtonVisible(
                                    [   // 修改  删除
                                        'edit', 'delete',
                                        // 保存  保存新增  保存提交   取消
                                        'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                        // 	退回 经办
                                        'decidegroup', 'back', 'decide',
                                        // 提交 收回  
                                        'commit',
                                        // 取消支付 
                                        'unpay',
                                        // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                                        // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                                        'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                                        // 凭证 取消制证
                                        'voucher', 'cancelvoucher',
                                        //生成上收单
                                        'toDelivery'
                                    ],
                                    false);
                                props.button.setButtonVisible(
                                    [
                                        // 新增  复制
                                        'common', 'add', 'copy',
                                        // 网银补录  网银浏览 
                                        'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                                        // 收回
                                        'uncommit',
                                        // 支付
                                        'netbankgroup', 'pay',
                                        // 联查   上缴单  委托付款  回单  内部账户
                                        'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                                        // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                                        'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                                        // 附件管理
                                        'file',
                                        // 打印 输出 
                                        'printdrop', 'printgroup', 'print', 'output',
                                        'refresh'
                                    ],
                                    true);
                            } else {
                                if (srcBusiType && srcBusiType.value && srcBusiType.value != 5) {
                                    props.button.setButtonVisible(
                                        [   //  修改  删除
                                            'edit', 'delete',
                                            // 保存  保存新增  保存提交   取消
                                            'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                            // 	退回 经办
                                            'decidegroup', 'back', 'decide',
                                            // 提交 收回  
                                            'commit',
                                            // 取消支付 
                                            'unpay',
                                            // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                                            // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                                            'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                                            // 凭证 取消制证
                                            'voucher', 'cancelvoucher',
                                        ],
                                        false);
                                    props.button.setButtonVisible(
                                        [
                                            // 新增  复制
                                            'common', 'add', 'copy',
                                            // 收回
                                            'uncommit',
                                            // 网银补录  网银浏览 
                                            'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                                            // 支付 支付状态  
                                            'netbankgroup', 'pay',
                                            // 联查   上缴单  委托付款  回单  内部账户
                                            'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                                            // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                                            'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                                            // 附件管理
                                            'file',
                                            // 打印 输出 
                                            'printdrop', 'printgroup', 'print', 'output',
                                            'refresh'
                                        ],
                                        true);
                                } else {
                                    props.button.setButtonVisible(
                                        [   //  修改  删除
                                            'edit', 'delete',
                                            // 保存  保存新增  保存提交   取消
                                            'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                            // 	退回 经办
                                            'decidegroup', 'back', 'decide',
                                            // 提交 收回  
                                            'commit', 'uncommit',
                                            // 网银补录  网银浏览 
                                            'buludrop', 'bulugroup', 'netbankbulu',
                                            // 支付 取消支付 
                                            'netbankgroup', 'pay', 'unpay',
                                            // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                                            // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                                            'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                                            // 支付确认单
                                            'linkpayconfirm',
                                            // 凭证 取消制证
                                            'voucher', 'cancelvoucher',
                                            //生成上收单
                                            'toDelivery'
                                        ],
                                        false);
                                    props.button.setButtonVisible(
                                        [
                                            // 新增  复制
                                            'common', 'add', 'copy',
                                            // 网银浏览 
                                            'buludrop', 'bulugroup', 'netbankbrowse',
                                            // 联查   上缴单  委托付款  回单  内部账户
                                            'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                                            // 付款账户   收款账户   凭证  计划预算  审批详情
                                            'bankaccbalance_p', 'bankaccbalance_r', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                                            // 附件管理
                                            'file',
                                            // 打印 输出 
                                            'printdrop', 'printgroup', 'print', 'output',
                                            'refresh'
                                        ],
                                        true);
                                }
                            }
                            props.button.setMainButton(['pay'], true);
                            props.button.setMainButton(['add'], false);
                        }
                        // 3=支付中
                        else if (billstatus.value == 3) {
                            if (srcBusiType && srcBusiType.value && srcBusiType.value != 5) {
                                props.button.setButtonVisible(
                                    [   // 修改  删除
                                        'edit', 'delete',
                                        // 保存  保存新增  保存提交   取消
                                        'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                        // 	退回 经办
                                        'decidegroup', 'back', 'decide',
                                        // 提交 收回  
                                        'commit', 'uncommit',
                                        // 取消支付  再次网银支付
                                        'unpay', 'netpayagain',
                                        // 凭证 取消制证
                                        'voucher', 'cancelvoucher',
                                    ],
                                    false);
                                props.button.setButtonVisible(
                                    [
                                        // 新增  复制
                                        'common', 'add', 'copy',
                                        // 网银补录  网银浏览 
                                        'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                                        // 支付 
                                        'pay', 'netbankgroup',
                                        // 支付状态   支付确认   再次手工支付  分录作废
                                        // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'recorddisuse',
                                        'paystatus', 'paystatusdrop', 'payconfirm', 'payagain',
                                        // 联查   上缴单  委托付款  回单  内部账户
                                        'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                                        // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                                        'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                                        // 附件管理
                                        'file',
                                        // 打印 输出 
                                        'printdrop', 'printgroup', 'print', 'output',
                                        'refresh'
                                    ],
                                    true);
                                props.button.setMainButton(['add'], false);
                            } else {
                                props.button.setButtonVisible(
                                    [   //修改  删除
                                        'edit', 'delete',
                                        // 保存  保存新增  保存提交   取消
                                        'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                        // 	退回 经办
                                        'decidegroup', 'back', 'decide',
                                        // 提交 收回  
                                        'commit', 'uncommit',
                                        // 网银补录  网银浏览 
                                        'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                                        // 支付 取消支付  再次网银支付
                                        'pay', 'unpay', 'netpayagain',
                                        // 支付状态   支付确认   再次手工支付   分录作废
                                        // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'recorddisuse',
                                        'paystatus', 'paystatusdrop', 'payconfirm', 'payagain',
                                        // 凭证 取消制证
                                        'voucher', 'cancelvoucher',
                                    ],
                                    false);
                                props.button.setButtonVisible(
                                    [
                                        // 新增  复制
                                        'common', 'add', 'copy',

                                        // 联查   上缴单  委托付款  回单  内部账户
                                        'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                                        // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                                        'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                                        // 附件管理
                                        'file',
                                        // 打印 输出 
                                        'printdrop', 'printgroup', 'print', 'output',
                                        'refresh'
                                    ],
                                    true);
                                props.button.setMainButton(['add',], false);
                            }
                        }
                        // 4=转账成功
                        else if (billstatus.value == 4) {
                            props.button.setButtonVisible(
                                [   // 修改  删除 
                                    'edit', 'delete',
                                    // 保存  保存新增  保存提交   取消
                                    'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                    // 	退回 经办
                                    'decidegroup', 'back', 'decide',
                                    // 提交 收回  
                                    'commit', 'uncommit',
                                    // 网银补录  网银浏览 
                                    'buludrop', 'bulugroup', 'netbankbulu',
                                    // 支付   取消支付
                                    'netbankgroup', 'pay',
                                    // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                                    // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                                    'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                                    // 凭证 取消制证
                                    'cancelvoucher'
                                ],
                                false);
                            props.button.setButtonVisible(
                                [
                                    // 新增  复制
                                    'common', 'add', 'copy',
                                    // 网银浏览 
                                    'netbankbrowse',
                                    // 取消支付
                                    'netbankgroup', 'unpay',
                                    // 凭证
                                    'voucher',
                                    // 联查   上缴单  委托付款  回单  内部账户
                                    'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                                    // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                                    'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                                    // 附件管理
                                    'file',
                                    // 打印 输出 
                                    'printdrop', 'printgroup', 'print', 'output',
                                    'refresh'
                                ],
                                true);
                            props.button.setMainButton(['add',], false);
                        }
                        // 5=已作废
                        else if (billstatus.value == 5) {
                            props.button.setButtonVisible(
                                [   // 修改  删除
                                    'edit', 'delete',
                                    // 保存  保存新增  保存提交   取消
                                    'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                                    // 	退回 经办
                                    'decidegroup', 'back', 'decide',
                                    // 提交 收回  
                                    'commit', 'uncommit',
                                    // 网银补录  网银浏览 
                                    'buludrop', 'bulugroup', 'netbankbulu',
                                    // 支付   取消支付  
                                    'netbankgroup', 'pay', 'unpay',
                                    // 支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                                    // 'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                                    'paystatus', 'paystatusdrop', 'payconfirm', 'payagain', 'netpayagain',
                                    // 凭证 取消制证
                                    'voucher', 'cancelvoucher'
                                ],
                                false);
                            props.button.setButtonVisible(
                                [
                                    // 新增  复制
                                    'common', 'add', 'copy',
                                    // 网银浏览 
                                    'buludrop', 'bulugroup', 'netbankbrowse',
                                    // 联查   上缴单  委托付款  回单  内部账户
                                    'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                                    // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                                    'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                                    // 附件管理
                                    'file',
                                    // 打印 输出 
                                    'printdrop', 'printgroup', 'print', 'output',
                                    'refresh',
                                    //生成上收单
                                    'toDelivery'
                                ],
                                true);
                            props.button.setMainButton(['add'], true);
                        }
                    }
                }
                elecSignEnable(props, billstatus);
                recorddisuseEnbale(props);
            } else {
                props.button.setButtonVisible(
                    [
                        // 增行 删行 复制行
                        'addline', 'delline', 'copyline',
                        // 保存  保存新增  保存提交   取消
                        'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
                        // 新增  修改  删除 复制
                        'common', 'add', 'edit', 'delete', 'copy',
                        // 	退回 经办
                        'decidegroup', 'back', 'decide',
                        // 提交 收回  
                        'commit', 'uncommit',
                        // 网银补录  网银浏览 
                        'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
                        // 支付   取消支付   支付状态   支付确认   再次手工支付   再次网银支付  分录作废
                        // 'netbankgroup', 'pay', 'unpay', 'paystatus', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
                        'netbankgroup', 'pay', 'unpay', 'paystatus', 'payconfirm', 'payagain', 'netpayagain',
                        // 凭证 取消制证
                        'voucher', 'cancelvoucher',
                        // 附件管理
                        'file',
                        // 联查   上缴单  委托付款  回单  内部账户
                        'linkquery', 'linkgroup', 'linkapply', 'linkpayment', 'receipt', 'accountbalance',
                        // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
                        'bankaccbalance_p', 'bankaccbalance_r', 'linkpayconfirm', 'linkvoucher', 'queryntbplan', 'reviewapprove',
                        // 打印 输出 
                        'printdrop', 'printgroup', 'print', 'output', 'officprint', 'supplyprint',
                        'refresh',
                        //生成上收单
                        'toDelivery'
                    ],
                    false);
                props.button.setButtonVisible(
                    [
                        // 新增
                        'common', 'add',
                    ],
                    true);
                props.button.setMainButton(['add'], true);
            }
        }
    }

    //控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: 'card_head',
        headAreaCode: card_from_id,
        fieldPK: deliveryPk,
        datasource: dataSource
    });	
}


const elecSignEnable = function (props, billstatus) {
    props.button.setButtonVisible(['officprint', 'supplyprint'], billstatus && billstatus.value && (billstatus.value == state.billstate.payok));
}

//隐藏所有按钮
export const hideAllBtn = function (props) {
    const { setButtonVisible,setButtonDisabled } = props.button;
    setButtonDisabled([                // 增行 删行 复制行
        'addline', 'delline', 'copyline',
        // 保存  保存新增  保存提交   取消
        'savegroup', 'save', 'saveadd', 'savecommit', 'cancel',
        // 新增  修改  删除 复制
        '', 'delete', '',
        // 	退回 经办
        'decidegroup', 'back', 'decide',
        // 提交 收回  
        'commit', 'uncommit',
        // 网银补录  网银浏览 
        'buludrop', 'bulugroup', 'netbankbulu', 'netbankbrowse',
        // 支付   取消支付   支付状态   支付确认   再次手工支付   再次网银支付  分录作废
        // 'netbankgroup', 'pay', 'unpay', 'paystatus', 'payconfirm', 'payagain', 'netpayagain', 'recorddisuse',
        'netbankgroup', 'pay', 'unpay', 'paystatus', 'payconfirm', 'payagain', 'netpayagain',
        // 凭证 取消制证
        'voucher', 'cancelvoucher',
        //正式打印 补充打印
         'officprint', 'supplyprint',
         //生成上收单
         'toDelivery'], true);
         if(props.form.getFormItemsValue(card_from_id, 'billstatus').value == '4'){
            setButtonDisabled(['officprint', 'supplyprint'],false);
         }
}

/**判断是否冻结 */
// const isSagaFrozen = function (props) {
//     console.log(props.form.getFormItemsValue(card_from_id, sagaField.frozen));
//     let sagafrozen = props.form.getFormItemsValue(card_from_id, sagaField.frozen).value;
//     return sagaFrozenEnum.frozen == sagafrozen;
// }
/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/