/*ZzGaYsQlfBkgpXqqY+TPGQ+yiO0MOAsp36REekBHp2kNJjbcRStxTHTzne9Tudgf*/
import { ajax } from 'nc-lightapp-front';

/**
 * 
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 */
export default function changeOrgEditHandler(props, moduleId, key, value, changedrows, i, url) {
    if(value){
        let data = props.createHeadAfterEventData('36300IT', this.formId, this.tableId, this.moduleId, key, value);
        ajax({
            url: url,
            data: data,
            success: (res) => {
                if (res.success) {
                    //切换组织，带出默认值
                    props.form.setAllFormValue(res.data[this.formId]);
                    //组织有值时，金额可输入
                    // props.form.setFormItemsDisabled(moduleId, 'money');
                    //组织有值时，金额必须输入
                    // props.form.setFormItemsRequired(moduleId, 'money');
                }
            },
            error: ()=>{
                //新增时出错，清空主组织
                //修改时出错,设置为原值,
            }
        });
    }else{
        //弹框提示，是否清空组织，清楚所有数据？
        //重新设置编辑性，模板值，copy模板
    }
}
/*ZzGaYsQlfBkgpXqqY+TPGQ+yiO0MOAsp36REekBHp2kNJjbcRStxTHTzne9Tudgf*/