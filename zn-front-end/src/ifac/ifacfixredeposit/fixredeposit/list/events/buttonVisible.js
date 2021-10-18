/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/
export const buttonVisible = function (props) {
    props.button.setButtonVisible(
        [
            "joinquery",
            "joinquerygroup",
            "cashbalanceBtn",
            "bankaccbalanceBtn",
            "voucherBtn",
            "printBtn",
            "printgroup",
            "outputBtn",
            "refreshBtn",
            "makebillBtn",
            "enclosureBtn"
        ],
        true
    );

    let src = props.getUrlParam('scene');
    if ('linksce' == src || src == 'fip') {
        props.button.setButtonVisible(["refreshBtn"], false);
    }

}
/*2+0Qf+roUlDHXBeA/o9JMEh10V7NgbTbWmCGNIIVyH28JKhQmXlMVFls8ZpNdAfC*/