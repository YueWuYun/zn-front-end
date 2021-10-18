/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/
/**
 * 背书办理卡片界面 编辑前事件
 * @author：gaokung
 */
import { URI } from "./../../cons/constant";
export default function beforeEvent(params) {
    const currType = ['olcrate', 'onlinebankflag'];
	if (currType.includes(key)) {
		let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value; //财务组织
		let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_curr').value; //源币
		//主键，判断是否是新增还是修改
		let pk_endore = props.form.getFormItemsValue(this.formId, this.primaryId).value; 
		if (!pk_endore) {
			// 新增，能进来的即可修改
			return true;
		}
		const CurrtypeData = { 
			pk_org: pk_org,
			pk_currtype: pk_currtype,
			field: key,
			pk:pk_endore
		};
		let flag = false;
		ajax({
            url: this.URI.headbefore, 
            async: false,
            data:CurrtypeData,
            success: (res) => {
                if (res.data && res.data=='true') {
					flag = true;
				} else {
					flag = false;
				}
            },
            error: (res) => {
                toast({ color: 'danger', content: res.message });
			}
		})
		return flag;
	} else {
		return true;
	}
}

/*mgBVjmwkvoNAq04L4PpN6WDkBpc5Cb+fBrnTboDV4bHkyBfePqzKLrUts+/FRsG3*/