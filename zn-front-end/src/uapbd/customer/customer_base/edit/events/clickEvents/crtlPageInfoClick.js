//kyusg3yG0XrSYTRSrk7075RoC+dMojnOvUD4JiHzcFthRXg8JkcNNgJsdQjHs0yY
export default function (props,pk) {
    let editStatusBtns = ['subG6ModalSave', 'subG6ModalCancel'];
    let browseStatusBtns = ['subG6Edit', 'subG6Del', 'subG6Ref', 'subG6Pri'];
    let formattritem = props.form.getFormItemsValue(props.config.creditctlForm,'pk_custcreditctl');
    let index = this.state.allCrtlPk.findIndex((value)=>{
        return value === formattritem.value
    });
    if(index == -1){
        return;
    }else{
        if(index+1 == this.state.allCrtlPk.length){
            //如果是最后一条
            return;
        }else{
            // 找到下一个的pk
            this.loadSubGridData(
                'modal',
                props.config.subGrid6,
                props.config.creditctlForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                this.state.allCrtlPk[index+1]
            );
        }
    }
}
//kyusg3yG0XrSYTRSrk7075RoC+dMojnOvUD4JiHzcFthRXg8JkcNNgJsdQjHs0yY