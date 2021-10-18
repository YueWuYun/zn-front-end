/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { card } from '../../../../public/container/index';
import { linkCMP } from "src/tmpub/pub/util/linkCMP";

export function bodyButtonClick(props, key, text, record, index) {
    let currTableId = this.tabCode;
    let curTabKey = this.props.cardTable.getCurTabKey();
    switch (key) {
        //行 新增
        case 'addRow':
            //校验moduleId对应模块是否开启
            linkCMP.call(this, {
                data: {
                    moduleId:"3662",
                    pk_group:this.props.form.getFormItemsValue(this.formId, "pk_group").value
                },
                success: res => {
                    // 校验成功返回之后的逻辑
                    card.addRow.call(this);
                }
            });
            break;
        //行 删除
        case 'deleteRow':
            card.deleteRow.call(this);
            break;
        //展开（编辑态）
        case 'expand':
            card.openTabModal.call(this, record, index);
            break;
        //展开（浏览态）
        case 'unfold':
        //收起
        case 'fold':
            card.toggleRowView.call(this, record);
            break;
        //插行
        case 'insertRow':
            //校验moduleId对应模块是否开启
            linkCMP.call(this, {
                data: {
                    moduleId:"3662",
                    pk_group:this.props.form.getFormItemsValue(this.formId, "pk_group").value
                },
                success: res => {
                    // 校验成功返回之后的逻辑
                    card.insertRow.call(this, index);
                }
            });
            break;
        //删行
        case 'delRow':
            card.delRow.call(this, index);
            break;
    }
}


/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/