/*8IHtlFCY0UAQa97X0oAjz8NnDGfywUmxjSOpvOwGalGNmoZrDMvIpXqUB9i+cnY/*/

/**
 * 卡片态表头字段过滤 以及 代码控制可编辑性[单据规则控制]
 * @param {*} moduleId 区域id
 * @param {*} props 当前props
 * @param {*} key 操作的键
 * @param {*} data 当前表单所有值
 */
function formBeforeEvent(props, moduleId, key, data) {
    let falg = true; //用来控制单元格是否可操作
    let meta = props.meta.getMeta();
    meta[moduleId].items.map((item) => {
        item.isShowUnit = false;
        let attrcode = item.attrcode;
        let tradeType = props.form.getFormItemsValue(this.formId, this.tradeType) ? props.form.getFormItemsValue(this.formId, this.tradeType).value : null;//交易类型/单据类型
        let VOClassName = this.headVOClassName;//vo名称
        if (attrcode == key) {
            switch (attrcode) {
                case 'pk_pcorg'://利润中心
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'pk_pcorg_v'://利润中心版本
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            TreeRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//自定义增加的过滤条件-现金账户
                        };
                    };
                    break;
                case 'def1'://自定义项1
                case 'def2'://自定义项2
                case 'def3'://自定义项3
                case 'def4'://自定义项4
                case 'def5'://自定义项5
                case 'def6'://自定义项6
                case 'def7'://自定义项7
                case 'def8'://自定义项8
                case 'def9'://自定义项9
                case 'def10'://自定义项10
                case 'def11'://自定义项11
                case 'def12'://自定义项12
                case 'def13'://自定义项13
                case 'def14'://自定义项14
                case 'def15'://自定义项15
                case 'def16'://自定义项16
                case 'def17'://自定义项17
                case 'def18'://自定义项18
                case 'def19'://自定义项19
                case 'def20'://自定义项20
                case 'def21'://自定义项21
                case 'def22'://自定义项22
                case 'def23'://自定义项23
                case 'def24'://自定义项24
                case 'def25'://自定义项25
                case 'def26'://自定义项26
                case 'def27'://自定义项27
                case 'def28'://自定义项28
                case 'def29'://自定义项29
                case 'def30'://自定义项30
                    item.queryCondition = () => {
                        let dataObject = {
                            model: props.form.getAllFormValue(this.formId),
                            pageid: this.pageId
                        }
                        let data = JSON.stringify(dataObject);
                        return {
                            pk_org: props.form.getFormItemsValue(this.formId, 'pk_org') ? props.form.getFormItemsValue(this.formId, 'pk_org').value : null,
                            crossRuleConditionsVO: data,
                            VOClassName: VOClassName,
                            tradeType: tradeType,
                            itemKey: key,
                            GridRefActionExt: 'nccloud.web.cmp.ref.CrossRuleDepSqlBuilder'//默认单据控制规则
                        };
                    };
                    break;
            }
        }

    });
    props.meta.setMeta(meta);
    return falg; //默认单元格都可操作
}


export { formBeforeEvent }
/*8IHtlFCY0UAQa97X0oAjz8NnDGfywUmxjSOpvOwGalGNmoZrDMvIpXqUB9i+cnY/*/