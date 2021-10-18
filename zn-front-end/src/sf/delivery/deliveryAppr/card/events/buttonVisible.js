/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
/**
 * 处理按钮的可见性
 * @param {*} props 界面内置对象
 */
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { card_page_id, card_from_id, card_table_id, card_fromtail_id, deliveryPk, dataSource  
} from '../../cons/constant.js';
import { showErrBtn } from "../../../../../tmpub/pub/util/index";
import { cache } from "../../../../../tmpub/pub/cons/constant";

export default function buttonVisible(props) {
    let status = props.getUrlParam('status');
    props.cardTable.setStatus(card_table_id, 'edit');
    let flag = status === 'browse' ? false : true;
    // 表体肩部按钮
    let pasteflag = this.state.pasteflag || false;
    //设置看片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag);
    props.form.setFormStatus(card_from_id, status);
    if (status == 'browse') {
        props.cardTable.setStatus(card_table_id, 'browse');
    } else {
        props.cardTable.setStatus(card_table_id, 'edit');
    }

    //添加异常提示标记
    cardCache.setDefData(cache.iserrtoast, dataSource, true);
    //控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: 'list_head',
        headAreaCode: card_from_id,
        fieldPK: deliveryPk,
        datasource: dataSource
    });

    // props.button.setButtonVisible(
    //     [   
    //         // 联查   上缴单  委托付款  回单  内部账户
    //         'linkquery','linkgroup','linkapply','linkpayment','receipt','accountbalance',
    //         // 付款账户   收款账户  支付确认单  凭证  计划预算  审批详情
    //         'bankaccbalance_p','bankaccbalance_r','linkpayconfirm','linkvoucher','queryntbplan','reviewapprove',
    //         // 附件管理
    //         'file',
    //         // 打印 输出 
    //         'printdrop','printgroup','print','output',
    //         'refresh'
    //     ],
    //     true);

}

/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/