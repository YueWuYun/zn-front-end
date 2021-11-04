//LW+/uo3QEPUf2a8F/uLlzdYcf5Rpj8RDZ8K0iUvcufLlQ5+XWRuia9YkQ9T83FC2
export default function (props,pk) {

    let editStatusBtns = ['subG5ModalSave', 'subG5ModalCancel'];
    let browseStatusBtns = ['subGrid5Edit', 'subGrid5Del', 'subGrid5Addr', 'subGrid5Ref', 'subGrid5Print'];

    let formattritem = props.form.getFormItemsValue(props.config.custsaleForm,'pk_custsale');
    let index = this.state.allSaleInfoPk.findIndex((value)=>{
        return value === formattritem.value
    });
    if(index == -1){
        return;
    }else{
        if(index+1 == this.state.allSaleInfoPk.length){
            //如果是最后一条
            return;
        }else{
            // 找到下一个的pk
            this.loadSubGridData(
                'modal',
                props.config.subGrid5,
                props.config.custsaleForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                this.state.allSaleInfoPk[index+1]
            );
        }
    }
}
//LW+/uo3QEPUf2a8F/uLlzdYcf5Rpj8RDZ8K0iUvcufLlQ5+XWRuia9YkQ9T83FC2