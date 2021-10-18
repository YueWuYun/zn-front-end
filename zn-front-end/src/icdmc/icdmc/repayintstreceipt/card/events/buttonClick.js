/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
    ajax,
    toast,
    cardCache,
    print,
    pageTo,
    cacheTools,
    promptBox
} from "nc-lightapp-front";
import { tabs, baseReqUrl, javaUrl, printData } from "../../cons/constant.js";
import initTemplate from "./initTemplate";
import { buttonVisible } from "./buttonVisible";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { elecSignCardPrint} from "../../../../../tmpub/pub/util/index";
import {
    fileMgr,
    setEditStatus,
    getCardData,
    cardBtnOperation,
    clearAll,
    cancel,
    add,
    edit,
    cardVoucher
} from "../../../public/cardEvent";
import { linkNtb } from "../../../public/listEvent";
let { getCacheById, updateCache, addCache } = cardCache;

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
    // 当前单据状态
    let status = props.getUrlParam("status");
    // 当前单据的全部数据
    let cardData = this.props.createExtCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    let pk = props.getUrlParam("id");
    switch (id) {
        //头部 附件
        case "Attachment":
            fileMgr.call(this);
            break;
        //头部 打印
        case "print":
            printData.oids = [pk];
            print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
                ...printData,
                userjson: JSON.stringify(cardData)
            });
            break;
        //头部 输出
        case "printOut":
            let { printOut } = this.state;
            printOut.userjson = JSON.stringify(cardData);
            printOut.oids = [pk];
            this.setState({ printOut }, () => {
                this.refs.printOutput.open();
            });
            break;
        //头部 刷新
        case "refresh":
            getCardData.call(
                this,
                this.cardUrl,
                this.props.getUrlParam("id"),
                true,
                true
            );
            break;
        //头部 联查合同
        case "contract":
            let pk_contract = cardData.head.head.rows[0].values.pk_contract_icdmc 
                                && cardData.head.head.rows[0].values.pk_contract_icdmc.value;
            props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                        srcFunCode: '36362IDC',
                        id: pk_contract,
                        appcode: '36362IDC',
                        pagecode: '36362IDC_C01',
                        status: 'browse',
						scene: "linksce"
            });
            break;
        //头部 付息单
        case "repayintst":
            let pk_srcbill =cardData.head.head.rows[0].values.pk_srcbill.value;
            pageTo.openTo("/icdmc/icdmc/repayintst/main/index.html#/card", {
                status: "browse",
                id: pk_srcbill,
                appcode: "36360IPI",
                pagecode: "36360IPIL_C01",
                scene: "linksce"
            });
            break;
        //头部 联查凭证
        case "voucher":
            cardVoucher.call(this, props, cardData,true);
            break;
        //头部 记账
        case "Bookkeeping":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.tally}`,
                this.state.json['36362IPIR-000020']/* 国际化处理： 记账成功!*/
            );
            break;
        //头部 取消记账
        case "unBookkeeping":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.untally}`,
                this.state.json['36360IPIR-000021']/* 国际化处理： 取消记账成功!*/
            );
            break;
        //正式打印
        case 'elecsignformalPrint':
            elecSignCardPrint(props, {
            url: `${baseReqUrl}elecprint.do`,
            offical:true,
            appCode: this.appCode,
            nodeKey: 'OFFICAL',
            headCode: this.formId,
            field_id: this.primaryId,
            field_billno: 'vbillno',
            getOrgFunc: () => {
                let pk_org_r = cardData.head.head.rows[0].values.pk_org_r.value;
                if (pk_org_r) {
                    return pk_org_r
                }else
                    return null;
            }
            });    
            break;    
        //补充打印
         case 'elecsigninformalPrint':
            elecSignCardPrint(props, {
            url: `${baseReqUrl}elecprint.do`,
            offical:false,
            appCode: this.appCode,
            nodeKey: 'INOFFICAL',
            headCode: this.formId,
            field_id: this.primaryId,
            field_billno: 'vbillno',
            getOrgFunc: () => {
                let pk_org_r = cardData.head.head.rows[0].values.pk_org_r.value;
                if (pk_org_r) {
                    return pk_org_r
                }else
                    return null;
            }
            });
            break;             
        default:
            break;
    }
}
/**
 * 联查 收款账户
 * @param  props
 */
const doPaymentAccount = function(props) {
    let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org").value;
    let loanunitid = this.props.form.getFormItemsValue(
        this.formId,
        "loanunitid"
    ).value;
    let bankaccbalance_rarr = [];
    let querydata = {
        // 财务组织
        pk_org: pk_org,
        // 银行账户id
        pk_account: loanunitid
    };
    bankaccbalance_rarr.push(querydata);
    this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true
    });
};



/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/