/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, print, output } from 'nc-lightapp-front';
import { tableId, searchId, pagecode, formId_01, formId_02 } from '../constants';
let { NCMessage } = base;
export default function buttonClick(props, id) {
    let pks = [];
    let sfbzs = [];
    let ptintpks = [];
    let pk_orgs = [];
    let data;
    let that = this;
    switch (id) {
        /**
         * 【list_head】领用
         */
        case 'claim':
            const claimData = props.table.getCheckedRows(tableId);
            props.form.setFormItemsValue(formId_01, { 'busitype': {} });
            if (claimData.length == 0) {                
                toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000005'), color: 'warning' });
                return;
            } else {
                debugger;
                claimData.forEach((vale) => {
                    let pk;
                    let sfbz;
                    let lyxt;
                    let djbh;
                    let sczt;
                    let pk_org;
                    pk = vale.data.values.pk_informerrelease.value;
                    sfbz = vale.data.values.direction.value;
                    lyxt = vale.data.values.src_flag.value;
                    djbh = vale.data.values.vbillno.value;
                    sczt = vale.data.values.generateflag.value;
                    pk_org = vale.data.values.pk_org.value;
                    if (sczt == 'hasnogenerate' || sczt == 'hasrelease') {
                        pks.push(pk);
                        sfbzs.push(sfbz);
                        pk_orgs.push(pk_org);
                    }

                });
                if ((new Set(sfbzs)).size > 1 && pks.length > 2) {
                    toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000012'), color: 'warning' });
                    return;
                }
            }
            if (pks.length == 0) {
                toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000013'), color: 'warning' });
                return;
            }

            if (pks.length == 2 && (new Set(sfbzs)).size == 2) {
                if (new Set(pk_orgs).size > 1) {                    
                    toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000014'), color: 'warning' });
                    return;
                }
                props.form.setFormItemsValue(formId_01, { 'sfflag': { value: "" } });
            } else {
                props.form.setFormItemsValue(formId_01, { 'sfflag': { value: sfbzs[0] } });
            }
            props.form.setFormItemsValue(formId_01, { 'btnarea': { value: 'list_head' } });
            that.setState({
                showModal_finance_01: true
            });


            let direction = props.form.getFormItemsValue(formId_01, 'sfflag').value;
            ajax({
                url: '/nccloud/cmp/informer/getbusitype.do',
                data: { direction: direction },
                success: function (res) {
                    props.form.setFormItemsValue(formId_01, { 'busitype': { value: res.data.pk, display: res.data.code } });
                    props.form.setFormItemsValue(formId_01, { 'jylx': { value: res.data.code } });

                }
            });
            props.form.setFormStatus(formId_01, "edit");
            break;
        /**
         * 领用领用弹出框-确认
         */
        case 'claim_ok':
            let btnarea = props.form.getFormItemsValue(formId_01, 'btnarea').value;
            let busitype = props.form.getFormItemsValue(formId_01, 'busitype').value;
            let jylx = props.form.getFormItemsValue(formId_01, 'jylx').value;
            let selectedData = props.table.getCheckedRows(tableId);
            if (btnarea == 'list_head') {
                if (selectedData.length == 0) {
                    toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000015'), color: 'warning' });
                    return;
                } else {
                    selectedData.forEach((vale) => {
                        let pk;
                        let sczt;
                        sczt = vale.data.values.generateflag.value;
                        if (sczt == 'hasnogenerate'||sczt == 'hasrelease') {
                            pk = vale.data.values.pk_informerrelease.value;
                            pks.push(pk);
                        }
                    });
                }
            } else if (btnarea == 'list_inner') {
                let pkinner = props.form.getFormItemsValue(formId_01, 'pk').value;
                pks.push(pkinner);
            }
            //调用跳转单据页面
            let billtype = jylx.substr(0, 2);
            if (pks.length == 0) {
                toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000016'), color: 'warning' });
                return;
            }
            if (billtype == 'F4' || billtype == 'D4') {//收款结算单
                props.linkTo('/cmp/billmanagement/recbill/releasecard/index.html', {
                    appcode: '36070RBM',
                    pagecode: '36070RBM_C06',
                    status: 'edit',
                    pks: pks,
                    busitype: busitype,
                    billtype: jylx,
                    src: "36S3"
                })
            } else if (billtype == 'F5' || billtype == 'D5') {//付款结算单
                props.linkTo('/cmp/billmanagement/paybill/releasecard/index.html', {
                    pks: pks,
                    busitype: busitype,
                    src: "36S3",
                    status: 'edit',
                    appcode: '36070PBR',

                    pagecode: '36070PBR_C05',
                    billtype: jylx

                })
            } else if (billtype == 'F2' || billtype == 'D2') {//收款单
                //联系王尚洋，先用jylx查询appcode，pagecode
                props.linkTo('/nccloud/resources/arap/arappub/arap4cmp36S3/card/index.html', {
                    appcode: '20062006',
                    pagecode: '20062006_CARD',
                    status: 'add',
                    pks: pks,
                    busitype: busitype,
                    billtype: jylx,
                    src: "36S3",
                    source: 'claim'
                })
            } else if (billtype == 'F3' || billtype == 'D3') {//付款单
                //联系王尚洋，先用jylx查询appcode，pagecode
                props.linkTo('/nccloud/resources/arap/arappub/arap4cmp36S3/card/index.html', {
                    appcode: '20082006',
                    pagecode: '20082006_CARD',
                    status: 'add',
                    pks: pks,
                    busitype: busitype,
                    billtype: jylx,
                    src: "36S3",
                    source: 'claim'
                })
            } else if (billtype == 'F6' || billtype == 'D6') {//划账结算单
                ajax({
                    url: '/nccloud/cmp/sscrelease/makebill.do',
                    data: {
                        pks: pks,
                        billtype: jylx
                    },
                    success: function (res) {
                        debugger;
                        props.linkTo('/cmp/billmanagement/transformbill/cardinfrom/index.html', {
                            pks: res.data,
                            appcode: '36070TBR',
                            pagecode: '36070TBRINFORM_C01',
                            src: "36S3",
                            status: 'edit'
                        })

                    }
                });
            } else if (jylx == '2647') {//还款单
                let vbillno;//单据编号
                let moneyy;//金额
                let memo;//摘要 
                let transerial;//交易流水号
                let pk_informer;//取得到账通知pk，用于获取未认领金额
                let pk_informerrelease;//主键
                if (selectedData.length > 1) {                    
                    toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000006'), color: 'warning' });
                    return;
                } else if (selectedData.length == 1) {//点击表头“认领”按钮时                
                    vbillno = selectedData[0].data.values.vbillno.value;//单据编号
                    moneyy = selectedData[0].data.values.moneyy.value;//金额
                    memo = selectedData[0].data.values.memo.value;//摘要 
                    transerial = selectedData[0].data.values.transerial.value;//交易流水号
                    pk_informer = selectedData[0].data.values.pk_informer.value;//取得到账通知pk，用于获取未认领金额
                    pk_informerrelease = selectedData[0].data.values.pk_informerrelease.value;//主键
                } else if (selectedData.length == 0) {//点击表体“认领”按钮时（使用表体按钮不需要勾选数据）
                    let record = props.form.getFormItemsValue(formId_01, 'record').value;//record是点击表体“认领”按钮时取得的数据
                    vbillno = record.vbillno.value;
                    moneyy = record.moneyy.value;
                    memo = record.memo.value;
                    transerial = record.transerial.value;
                    pk_informer = record.pk_informer.value;
                    pk_informerrelease = record.pk_informerrelease.value;
                }
                ajax({//用到账通知pk查询对应数据
                    url: '/nccloud/cmp/informer/informerqueryone.do',
                    data: {
                        pk_informer: pk_informer,
                        informerPageCode: '36070AI_L05' //到账通知的pagecode
                    },
                    success: function (res) {
                        let { success, data } = res;
                        if (success) {
                            if (data) {
                                let usemoney = data['table'].rows[0].values.usemoney.value;
                                if (usemoney == null) {
                                    usemoney = 0;
                                }
                                let money = moneyy - usemoney;//未认领金额=总金额-已认领金额('table'是到账通知的tableid)
                                props.openTo('/nccloud/resources/erm/expenseaccount/repaymentForPull/config/index.html#/pull', {
                                    appcode: '201102HKD',
                                    pagecode: '201102HKD_card_001',
                                    status: 'add',
                                    pk: pk_informerrelease,
                                    vbillno: vbillno,
                                    moneyy: money,
                                    memo: memo,
                                    transerial: transerial,
                                    src: "36S3"
                                })
                            }
                        }
                    }
                });

            }
            that.setState({
                showModal_finance_01: false
            });
            break;
        case 'refund_ok':
            btnarea = props.form.getFormItemsValue(formId_02, 'btnarea').value;
            busitype = props.form.getFormItemsValue(formId_02, 'busitype').value;
            jylx = props.form.getFormItemsValue(formId_02, 'jylx').value;
            selectedData = props.table.getCheckedRows(tableId);
            if (btnarea == 'list_inner') {
                let pkinner = props.form.getFormItemsValue(formId_02, 'pk').value;
                pks.push(pkinner);
            }
            //调用跳转单据页面
            billtype = jylx.substr(0, 2);
            if (pks.length == 0) {
                toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000016'), color: 'warning' });
                return;
            }
            if (billtype == 'F2' || billtype == 'D2') {//收款单
                //联系王尚洋，先用jylx查询appcode，pagecode
                props.linkTo('/nccloud/resources/arap/arappub/arap4cmp36S3/card/index.html', {
                    appcode: '20062006',
                    pagecode: '20062006_CARD',
                    status: 'add',
                    pks: pks,
                    busitype: busitype,
                    billtype: jylx,
                    src: "36S3",
                    source: 'refund'
                })
            } else if (billtype == 'F3' || billtype == 'D3') {//付款单
                //联系王尚洋，先用jylx查询appcode，pagecode
                props.linkTo('/nccloud/resources/arap/arappub/arap4cmp36S3/card/index.html', {
                    appcode: '20082006',
                    pagecode: '20082006_CARD',
                    status: 'add',
                    pks: pks,
                    busitype: busitype,
                    billtype: jylx,
                    src: "36S3",
                    source: 'refund'
                })
            }
            that.setState({
                showModal_finance_02: false
            });
            break;
        /**
        * 领用弹出框-取消
        */
        case 'claim_calce':
            that.setState({
                showModal_finance_01: false
            });
            break;
        /**
       * 退款弹出框-取消
       */
        case 'refund_calce':
            that.setState({
                showModal_finance_02: false
            });
            break;
        /**
        * 打印
        */
        case 'print':
            let printdata = props.table.getCheckedRows(tableId);
            if (printdata.length == 0) {
                toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000015'), color: 'warning' });
                return;
            } else {
                printdata.forEach((vale) => {
                    let pk;
                    pk = vale.data.values.pk_informerrelease.value;;
                    ptintpks.push(pk);
                });
            }
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/cmp/pub/print.do',
                {
                    appcode: '36070AIPSSC',
                    oids: ptintpks,
                    userjson: 'nccloud.pub.cmp.informer.print.datasource.ReleasePrintDataSource'
                }
            );
            break;
        case 'printout':
            let printoutdata = props.table.getCheckedRows(tableId);
            if (printoutdata.length == 0) {
                toast({ content: props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000015'), color: 'warning' });
                return;
            } else {
                printoutdata.forEach((vale) => {
                    let pk;
                    pk = vale.data.values.pk_informerrelease.value;;
                    ptintpks.push(pk);
                });
            }
            output({
                url: '/nccloud/cmp/pub/print.do',
                data: {
                    appcode: '36070AIPSSC',
                    oids: ptintpks,
                    outputType: 'output',
                    userjson: 'nccloud.pub.cmp.informer.print.datasource.ReleasePrintDataSource'
                }
            });
            break;
        //刷新
        case 'refresh':
            that.refresh();
            break;
        /**
    * 【list_head】取消认领
    */
        // case 'unclaim':
        //     const unclaimData = props.table.getCheckedRows(tableId);
        //     if (unclaimData.length == 0) {
        //         NCMessage.create({ content: '请选择数据！', color: 'warning' });
        //         return;
        //     } else {
        //         unclaimData.forEach((vale) => {
        //             let pk;
        //             pk = vale.data.values.pk_informerrelease.value;
        //             pks.push(pk);
        //         });
        //     }
        //     ajax({
        //         url: '/nccloud/cmp/release/sscunrelease.do',
        //         data: {
        //             pks: pks,
        //             pageid: null,
        //         },
        //         success: function (res) {
        //             if (res.data) {
        //                 that.refresh();
        //                 NCMessage.create({ content: res.data, color: 'warning' });
        //             } else {
        //                 that.refresh();
        //                 toast({ content: "取消认领成功", color: 'success' });
        //             }
        //         }
        //     });
        //     break;
    }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/