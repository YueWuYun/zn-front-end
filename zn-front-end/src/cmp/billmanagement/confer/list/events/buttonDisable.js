/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/
export default function buttonDisable(props) {
    let selectedData = props.table.getCheckedRows('table');
    if (selectedData.length == 0) {
        props.button.setButtonDisabled([
            'delete', 'print'
        ], true);
    } else {
        props.button.setButtonDisabled([
            'delete', 'print'
        ], false);
    }
}
/*QCRu/PDcDggPUTbrjwK8iPZOi/7i6YS71mZvJU5CvFVA2Q6tTLYX0joSL5YHXfNY*/