/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast, print, output} from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant';
import { loadMultiLang} from "../../../../../tmpub/pub/util/index";
let {base_url, app_code, nodekey, formId} = CONSTANTS;
export default function (props, key) {
    switch (key) { 
        case 'File':
            fileMgr.call(this, props);
            break;
        // 联查审批意见
        case 'AppRoveIdea':
            let approveData = this.props.form.getAllFormValue(formId);
            let apprpk =approveData.rows[0].values['pk_fwithdrawapply'].value;
            this.setState({ 
                showApproveDetail: true,
                billID: apprpk
            });
            break;
        // 联查存单
        case 'LinkDepositBill':
            let linkData = this.props.form.getAllFormValue(formId);
            let depositcode = linkData.rows[0].values['pk_depositreceipt'].value;
            if(!depositcode){
                toast({
                    color: 'warning',
                    content: loadMultiLang(this.props, '36340FDWA-000010') //{/* 国际化处理： 未查询出符合条件的数据！*/}
                });
            } else {
                ajax({
                    url: '/nccloud/ifac/memberdeposit/querycardlinkaction.do',
                    data: {
                        pk:depositcode,
                        pageCode: "36341FDLQ_C01"
                    },
                    success: (res) => {
                        if (res.data) {
                            this.props.openTo('/ifac/ifacmemberbusquery/memberdepositreceipt/main/index.html#/card', 
                            {
                                srcFunCode:'36340FDWA',
                                appcode: '36341FDLQ',
                                pagecode: '36341FDLQ_C01',
                                status: 'browse',
                                islinkquery: true,
                                id:res.data,
                                scene: "linksce"
                            });
                        } 
                    }
                })
            }
            break;
        case 'Printbtn':
            let printData = this.props.form.getAllFormValue(formId);
            let pks = [];
            pks.push(printData.rows[0].values['pk_fwithdrawapply'].value);
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                base_url + 'FDWDWAPrintaction.do',
                {
                    appcode: app_code,
                    nodekey: nodekey,//模板节点标识
                    oids: pks
                }
            );
            break;
        // 输出
        case 'Output':
            let outputData = this.props.form.getAllFormValue(formId);
            let outputpks = [];
            outputpks.push(outputData.rows[0].values['pk_fwithdrawapply'].value);
            output({
                url: base_url + 'FDWDWAPrintaction.do',
                data: {
                    nodekey: nodekey,
                    appcode: app_code,
                    oids: outputpks,
                    outputType: 'output'
                }
            });
            break;
    }
}

/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {
    let selectDatas = this.props.form.getAllFormValue(formId);
    let billID = selectDatas.rows[0].values['pk_fwithdrawapply'].value;
    let billNO = selectDatas.rows[0].values['vbillcode'].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billID,
        billNO
    });
}
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/