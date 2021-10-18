/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { ajax, base, toast } from "nc-lightapp-front";
import { tabs ,linkdataSource, islink} from "../../cons/constant.js";
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData ,} from '../../../../../tmpub/pub/util/cache';
import { showErrBtn } from "../../../../../tmpub/pub/util";
/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
    let buttons = props.button.getButtons();
    //制证flag
    let voucherflag =
        props.form.getFormItemsValue(this.formId, "voucherflag") &&
        props.form.getFormItemsValue(this.formId, "voucherflag").value;
    //console.log(voucherflag);
    let btnObj = {};
    let showBtn = [
                
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

        "refresh_n",

        "fold",
        "unfold"
    ];
    if (voucherflag) {
        //已制证
        showBtn = showBtn.concat(["unAccreditation"]);
    } else {
        //未制证
        showBtn = showBtn.concat(["accreditation"]);
    }
    // for循环的目的是拼接成{a: true, b: false, ...}, 来控制按钮的显隐性
    for (let item of buttons) {
        btnObj[item.key] = showBtn.includes(item.key);
    }
    props.button.setButtonVisible(btnObj);
    //设置卡片头部状态
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: this.billNo //修改单据号---非必传
    });

    if (getDefData(linkdataSource, islink)) {
        //没有刷新按钮
        props.button.setButtonVisible(['accreditation','unAccreditation','refresh',
        'elecsignformalPrint','elecsigninformalPrint'], false);
        //单条时 会有此参数
        if(props.getUrlParam("scene") == "linksce"){
            props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            });
        }
    }
    //控制重试按钮显示情况
    showErrBtn(props, { 
        headBtnCode: 'head',
        headAreaCode: this.formId ,
       fieldPK: this.primaryId
     });
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/