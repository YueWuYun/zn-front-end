/*6SRC7fOapOom32oyVogDIQKeX1WX0eKbH9tNjaCYTQIf0qQMaSkyfHQXHbnVxxUR*/
/**
 * 子表 还本计划 -> 还款编号 字段规则
 * 通过是否提前还款字段控制 还款编号 参照的多选还是单选
 * @param {Boolean} params
 */
export const pk_repayplanRule = function(isMulti) {
    // 设置 还款编号 参照多选还是单选
    let meta = this.props.meta.getMeta();
    meta["repayPrcplPlan"].items = meta["repayPrcplPlan"].items.map(item => {
        if (item.attrcode == "pk_repayplan") {
            // true 为多选 false 为单选
            item.isMultiSelectedEnabled = isMulti;
        }
        return item;
    });
    this.props.meta.setMeta(meta);
};

/*6SRC7fOapOom32oyVogDIQKeX1WX0eKbH9tNjaCYTQIf0qQMaSkyfHQXHbnVxxUR*/