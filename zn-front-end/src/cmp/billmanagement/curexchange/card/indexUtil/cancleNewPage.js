/*sKlyF5wMgRB9En+aN5LYxmbTetSnN5xtJFUQymKT6x5h2fvmja6SwGEIM7EzEbYT*/
/**
 * [外币兑换index]-取消---跳转浏览态页面
 * 
 * @param status:单据状态
 * @param pk:跳转数据pk
 */
export const cancleNewPage = function (pk, status) {
    this.props.pushTo('/card', {
        status: 'browse',
        id: pk,
        pk: status,
        pagecode: this.pageId
    })
    this.refresh();
}

/*sKlyF5wMgRB9En+aN5LYxmbTetSnN5xtJFUQymKT6x5h2fvmja6SwGEIM7EzEbYT*/