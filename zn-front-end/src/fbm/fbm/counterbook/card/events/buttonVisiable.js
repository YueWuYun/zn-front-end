/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/

import { BTN_CARD, CARD_FORM_CODE } from "./../../cons/constant";


export function buttonVisiable(props) {
    let allBtn = []
    for (let value in BTN_CARD) {
        allBtn.push(BTN_CARD[value])
    }
    // 先设置所有按钮不可见
    props.button.setButtonVisible(allBtn, false)
    // 获取页面状态
    let status = props.getUrlParam('status');
    let showPagination = status === 'browse' ? false : true
    //设置卡片翻页的显隐性
    props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !showPagination);
    if (status == 'browse') {
        props.button.setButtonVisible(allBtn, true)
    }

}

// 浏览态按钮组
const status_browse = [
    // 联查
    BTN_CARD.LINK_BILL,
    //附件 打印 输出
    BTN_CARD.PRINT,
    BTN_CARD.PRINTGROUP,
    BTN_CARD.OUTPUT,
    BTN_CARD.REFRESH
]

/*LzysTzmTjQ0jCCgzhRaBdj3xGJdC5gFSDVA9ntIfMz5bWQswWuLsKqjsk9JoGybM*/