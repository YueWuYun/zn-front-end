/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import {
    ajax,
    toast,
    cardCache,
    print,
    pageTo
} from "nc-lightapp-front";
import {
    tabs,
    baseReqUrl,
    javaUrl,
    printData,
    primaryId,
    QueryLoanContractPK_URL
} from "../../cons/constant.js";
import { elecSignCardPrint} from "../../../../../tmpub/pub/util/index";
import initTemplate from "./initTemplate";
import { buttonVisible } from "./buttonVisible";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import {
    fileMgr,
    getCardData,
    cardBtnOperation,
    cardVoucher
} from "../../../public/cardEvent";
let { getCacheById, updateCache, addCache } = cardCache;
const linkInterestConst = {
    //组织
    "0": {
        url: "/tmpub/pub/interestrate_org/main/index.html#/card",
        appcode: "36010IRCO",
        pagecode: "36010IRCO_card"
    },
    //集团
    "1": {
        url: "/tmpub/pub/interestrate_group/main/index.html#/card",
        appcode: "36010IRCG",
        pagecode: "36010IRCG_card"
    },
    //全局
    "2": {
        url: "/tmpub/pub/interestrate_global/main/index.html#/card",
        appcode: "36010IRC",
        pagecode: "36010IRC_card"
    }
};
/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
    // 当前单据状态
    let status = props.getUrlParam("status");
    let pk = props.getUrlParam("id");
    // 当前单据的全部数据
    let cardData = this.props.createExtCardData(
        this.pageId,
        this.formId,
        this.tabOrder
    );
    switch (id) {
        //头部 制证
        case "accreditation":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.vouchermake}`,
                this.state.json['36630BCIB-000005']/* 国际化处理： 制证成功!*/
            );
            break;
        //头部 取消制证
        case "unAccreditation":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.vouchercancel}`,
                this.state.json['36630BCIB-000006']/* 国际化处理： 取消制证成功!*/
            );
            break;
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
        case "refresh_n":
            getCardData.call(
                this,
                this.cardUrl,
                this.props.getUrlParam("id"),
                true,
                true
            );
            break;
        //头部联查 内借合同
        case "contract":
            let pk_contract = cardData.head.header.rows[0].values.contractid 
                                && cardData.head.header.rows[0].values.contractid.value;
            ajax({
                url: '/nccloud/icdmc/icdmc/queryloanpk.do',
                data: { pk: pk_contract },
                success: res => {
                    let { data } = res;
                    if (data) {
                        props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                            srcFunCode: '36362IDC',
                            id: data,
                            appcode: '36362IDC',
                            pagecode: '36362IDC_C01',
                            status: 'browse',
                            scene:'linksce'
                        });
                    }
                }
            });
           break;               
        //头部 联查放款单
        case "financepay":
            pageTo.openTo("/icdmc/icdmc/financepay/main/index.html#/card", {
                status: "browse",
                id: cardData.head.header.rows[0].values.pk_financepay.value,
                appcode: "36360IP",
                pagecode: "36360IP_LINKC01",
                scene: "linksce"
            });
            break;
        //头部 联查利率
        case "rate":
            let pk_rate =
            cardData.head.header.rows[0].values.pk_rate && cardData.head.header.rows[0].values.pk_rate.value;
            ajax({
                url: "/nccloud/tmpub/tmbd/linkinterest.do",
                data: { pk: pk_rate },
                success: res => {
                    let { data } = res;
                    if (data) {
                        let { url, appcode, pagecode } = linkInterestConst[
                            data.rateclass
                        ];
                        pageTo.openTo(url, {
                            status: "browse",
                            appcode: appcode,
                            pagecode: pagecode,
                            scene: "linksce",
                            id: pk_rate
                        });
                    }
                }
            });
            break;
        //头部 联查结息日
        case "settledate":
            let iadate = cardData.head.header.rows[0].values.iadate && cardData.head.header.rows[0].values.iadate.value;
            pageTo.openTo("/tmpub/pub/settledate/main/index.html#/card", {
                status: "browse",
                appcode: "36010ISDC",
                pagecode: "36010ISDC_CARD_01",
                scene: "linksce",
                id: iadate
            });
            break;
        //头部 联查凭证
        case "voucher":
            cardVoucher.call(this,props,cardData);
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
                let pk_org_r = cardData.head.header.rows[0].values.pk_org_r.value;
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
                let pk_org_r = cardData.head.header.rows[0].values.pk_org_r.value;
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

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/