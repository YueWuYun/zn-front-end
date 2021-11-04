//WZoecmBfwxHePk5csRPXrzNiL7rq1GzHzub7QymzLC46N8iaRZ575tBcf6or80jZ
export default function (props,pk) {
    //获取当前财务信息主键
    let editStatusBtns = ['subG4ModalSave', 'subG4ModalCancel'];
    let browseStatusBtns = ['subGrid4Edit', 'subGrid4Del', 'subGrid4Ref', 'subGrid4Pri'];
    let formattritem = props.form.getFormItemsValue(props.config.custfinanceForm,'pk_custfinance');
    let index = this.state.allFinancePk.findIndex((value)=>{
        return value === formattritem.value
    });
    if(index == -1){
        return;
    }else{
        if(index+1 == this.state.allFinancePk.length){
            //如果是最后一条
            return;
        }else{
           // 找到下一个的pk
            this.loadSubGridData(
                'modal',
                props.config.subGrid4,
                props.config.custfinanceForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                this.state.allFinancePk[index+1]
            );
        }
    }
}
//WZoecmBfwxHePk5csRPXrzNiL7rq1GzHzub7QymzLC46N8iaRZ575tBcf6or80jZ