/*joKbNgt1sNmKeEAhWirJkGJVKwmlQGY0N/kgS66M+xYmpCXMbT6reQ01fBQMUsQC*/
/**
 * 背书办理卡片界面 事件方法
 * @author：gaokung
 */
import { CARD } from '../../cons/constant.js'; //配置的id和area信息
/**
 * 卡片设置编辑性
 * @param {*} status  编辑状态
 */
export function setEditStatus(status) {
    this.props.form.setFormStatus(CARD.formHeadCode, status);
    // this.props.cardTable.setStatus(this.tableId, status);
}

/*joKbNgt1sNmKeEAhWirJkGJVKwmlQGY0N/kgS66M+xYmpCXMbT6reQ01fBQMUsQC*/