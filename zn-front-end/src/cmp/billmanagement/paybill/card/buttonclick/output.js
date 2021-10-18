/*9XGrMw8uWoFuBJ4qGVHOrtModn4pZmAz7TLWMZop4oAjYMh/s+QX4J3ZpsUIGbP1*/



export const output = function () {
let pkos = [];
pkos.push(this.props.form.getFormItemsValue(this.formId, 'pk_paybill').value);
this.setState(
    {
        outputData: {
            appcode: '36070PBR', //功能节点编码，即模板编码
            nodekey: 'NCCLOUD', //模板节点标识
            //printTemplateID: '1001Z610000000004R6L', //模板id
            outputType: 'output',
            oids: pkos
        }
    },
    () => {
        this.refs.printOutput.open();
    }
);
}
/*9XGrMw8uWoFuBJ4qGVHOrtModn4pZmAz7TLWMZop4oAjYMh/s+QX4J3ZpsUIGbP1*/