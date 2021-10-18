/*sximxXW5TjD6dN4EbxcPam7gggnhqEL21Sc+HpiFzWnKH/BWj8HQ/i5zLv6JUrS1*/
/**
 * 查询后渲染列表前的操作
 * @param {*} grid   data.grid
 */
export default function afterSearch(grid) {
    grid[this.tableId].rows.map(e => {
        if (e.values.repay_prcpl_period.value == "-1") {
            e.values.repay_prcpl_period = {
                value: null
            };
        }
        if (e.values.repay_intst_period.value == "-1") {
            e.values.repay_intst_period = {
                value: null
            };
        }
    });
    return grid;
}

/*sximxXW5TjD6dN4EbxcPam7gggnhqEL21Sc+HpiFzWnKH/BWj8HQ/i5zLv6JUrS1*/