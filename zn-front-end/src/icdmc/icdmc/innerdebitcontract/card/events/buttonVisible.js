/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
export const buttonVisible = function (props) {
    // 默认按钮隐藏
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

    // 控制卡片返回按钮的显隐性
    let scene = props.getUrlParam('scene');
    let islisttocard = props.getUrlParam('islisttocard');
    let apply = props.getUrlParam("pageType");
    let showBackBtnbool = true;
    if(scene && (scene == 'linksce' || scene == 'fip' || apply =='apply') && islisttocard != 'islisttocard') {
        showBackBtnbool = false;
    }
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: showBackBtnbool,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: true,  //控制显示单据号：true为显示,false为隐藏 ---非必传
        
    });
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/