/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/
/**
 * 按钮控制
 * @param {*} props 
 */
import appBase from "../../base";
const { cons, api } = appBase;
export const buttonVisable = function (props) {
    let status = props.getUrlParam('status');
    if (status == 'browse') {
        this.setState({
            tradebtnflag: true//收款交易类型
        });
    }
    //控制重试按钮显示情况
    api.comm.showErrBtn(props, { 
        headBtnCode: cons.card.btnHeadCode,
        headAreaCode: cons.card.headCode ,
        fieldPK: cons.field.pk,
        datasource: cons.comm.dataSource
    });
    //审批直接显示按钮：
    //联查（单据、计划预算、审批详情）、打印、附件管理
    //1909-支持网新增影像的相关内容
    props.button.setButtonVisible(
        [
            'linkquerybillBtn',
            'queryconsumeBtn',
            'linkquery',
            'printgroup',
            'printBtn',
            'outputBtn',
            'annexgroup',
            'querymsgBtn',
            'annexBtn',
            "imagegroup",
            "imagefather",
            "imageviewBtn",
            "imagescanBtn"
        ], true);

}

/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/