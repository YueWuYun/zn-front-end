/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from "nc-lightapp-front";
import { tabs ,islink,linkdataSource} from "../../cons/constant.js";
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { showErrBtn } from "../../../../../tmpub/pub/util";
/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let buttons = props.button.getButtons();
    //记账flag
    let tallyflag =
        props.form.getFormItemsValue(this.formId, "tallyflag") &&
        props.form.getFormItemsValue(this.formId, "tallyflag").value;
    let btnObj = {};
    let showBtn = [
        // "accreditation",
        // "unAccreditation",
        "Attachment",

        "union",
        "financepay",
        "contract",
        "voucher",
        "rate",
        "settledate",

        "print",
        "printOut",
        "elecsignformalPrint",
        "elecsigninformalPrint",

        "refresh",

        "fold",
        "unfold"
    ];

    if (tallyflag) {
        //已记账
        showBtn = showBtn.concat(["UnBookkeeping"]);
    } else {
        //未记账
        showBtn = showBtn.concat(["Bookkeeping"]);
    }
    // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
    for (let item of buttons) {
        btnObj[item.key] = showBtn.includes(item.key);
    }
    props.button.setButtonVisible(btnObj);
    //设置卡片头部状态
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn:this.props.getUrlParam("scene") !== ("approvesce" && "linksce"), //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: this.billNo //修改单据号---非必传
    });
      //控制重试按钮显示情况
      showErrBtn(props, { 
        headBtnCode: 'head',
        headAreaCode: this.formId ,
        fieldPK: this.primaryId 
     }); 
    //被联查时 只显示附件、联查、打印(有'scencs'标识单条联查)
    if(this.props.getUrlParam("scene") || getDefData(linkdataSource, islink)){
        props.button.setButtonVisible(
			['Bookkeeping','UnBookkeeping','elecsignformalPrint', 'elecsigninformalPrint', 'refresh'],false);
    }

}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/