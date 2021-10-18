/*TCwXtjgv7qKt4HHnR6nIJL0w4SULwQ/lTrDUOYRs+tG9Gyh88/KDz77EqQi4uFkB*/
/**
 * [收款]-被联查卡片表体按钮是否可用
 * @param {*} props 
 * @param {*} hasOrg 是否有组织true/false
 */
export const linkButtonVisable = function () {
    this.setState({ isTradeshow: false });//按钮控制显示交易类型
    this.props.button.setButtonVisible(
        [
            'saveBtn',
            'savesubmitBtn',
            'saveaddBtn',
            'cancelBtn',
            'annexBtn',
            'annexgroup',
            'addbodyBtn',
            'deletebodyBtn',
            'copybodyBtn',
            'unsubmitBtn',
            'redbillBtn',
            'makebillBtn',
            'queryvoucherBtn',
            'rectradetypeBtn',
            'linkquery',
            'printgroup',
            'addBtn',
            'editBtn',
            'deleteBtn',
            'copyBtn',
            'subimtBtn',
            'imagegroup',
            'moreoperateBtn',
            'querysynbillBtn',
            'addBtn',
            'copyBtn',
            'querymsgBtn',
            'linksettleBtn',
            'unlinksettleBtn',
            'linkimagescanBtn',
            'linkimageviewBtn',
            'linkimageBtn',
            'linkimageBtn_s',
            'refreshBtn'
        ], false);
    this.props.button.setButtonVisible(
        [
            'annexBtn',//附件
            'linkquery',//联查
            'linkquery1',
            'linkquerybillBtn',//联查单据
            'querymsgBtn',//审批详情
            'querysynbillBtn',//协同单据
            'queryvoucherBtn',//凭证
            // 'printgroup',//原单据打印按钮在更多里面显示不对
            'cardprintBtn',//新增联查打印按钮20181228
            'cardprintBtn_2',//新增联查打印按钮
            'cardoutputBtn'//新增联查输出按钮
        ], true);
    //1909新增被联查影像按钮，适用于我的作业
    if (this.props.getUrlParam('scene') && (this.props.getUrlParam('scene') == 'zycl' || this.props.getUrlParam('scene') == 'approvesce')) {
        this.props.button.setButtonVisible(
            [
                'linkimagescanBtn',
                'linkimageviewBtn',
                'linkimageBtn',
                'linkimageBtn_s',
                'refreshBtn'
            ], true);
    }
    //body 按钮的显隐性控制
    this.props.button.setButtonVisible(
        ['addbodyBtn', 'deletebodyBtn', 'copybodyBtn', 'cancelLineBtn', 'copyLineLastBtn'],
        false);
}

/*TCwXtjgv7qKt4HHnR6nIJL0w4SULwQ/lTrDUOYRs+tG9Gyh88/KDz77EqQi4uFkB*/