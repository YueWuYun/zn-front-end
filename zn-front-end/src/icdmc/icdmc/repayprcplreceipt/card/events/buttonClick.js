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
    primaryId
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
        //头部 记账
        case "Bookkeeping":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.tally}`,
                this.state.json['36362IRPR-000008']/* 国际化处理： 记账成功!*/
            );
            break;
        //头部 取消记账
        case "unBookkeeping":
            cardBtnOperation.call(
                this,
                `${baseReqUrl}${javaUrl.untally}`,
                this.state.json['36362IRPR-000009']/* 国际化处理： 取消记账成功!*/
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
        //头部 联查还本
        case "repay":
            pageTo.openTo("/icdmc/icdmc/repayprcpl/main/index.html#/card", {
                status: "browse",
                id: cardData.head.header.rows[0].values.pk_srcbill.value,
                appcode: "36360IRP",
                pagecode: "36360IRP_CARD",
                scene: "linksce"
            });
            break;
        //头部 联查合同
        case "contract":
            let pk_contract = cardData.head.header.rows[0].values.pk_contract 
                                && cardData.head.header.rows[0].values.pk_contract.value;
            props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                    srcFunCode: '36362IDC',
                    id: pk_contract,
                    appcode: '36362IDC',
                    pagecode: '36362IDC_C01',
                    status: 'browse',
            });        
            break;
        //头部 联查凭证
        case "voucher":
            cardVoucher.call(this,props,cardData);
            break;
        default:
            break;
    }
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/