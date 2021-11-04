//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { Component } from 'react';
import { createPage, ajax, base, toast, high, print, promptBox, cardCache, deepClone } from 'nc-lightapp-front';

import {
    AREA, UISTATE, PAGECODE, URL
} from '../../constance';

const { NCModal, NCButton } = base;
import { btnClicks } from "./btn/index.js";
import { RownoUtils } from "../../../utils/cardTools/RownoUtil"
import { rowCopyPasteUtils } from "../../../utils/cardTools/rowCopyPasteUtils"
import './index.less'

class PowerTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            show: false
        }
        // if(props.meta){
        //     this.props.meta.setMeta(meta);
        // }
        //initLang(this, ['50060006'], 'mmpps', initTemplate.bind(this, this.props));
    }

    initTemplate = props => {
        let reqData = [
            {
                rqUrl: "/platform/templet/querypage.do",
                rqJson: `{\n  \"pagecode\": \"10140BOMM_grand\",\n  \"appcode\": \"10140BOMM\"\n}`,
                rqCode: "template"
            },
            {
                rqUrl: "/platform/appregister/queryallbtns.do",
                rqJson: `{\n  \"pagecode\": \"10140BOMM_grand\",\n  \"appcode\": \"10140BOMM\"\n}`,
                rqCode: "button"
            },
            {
                rqUrl: "/platform/appregister/queryappcontext.do",
                rqJson: `{\n  \"appcode\": \"10140BOMM\"}`,
                rqCode: "context"
            }
        ];

        ajax({
            url: "/nccloud/platform/pub/mergerequest.do",
            data: reqData,
            success: res => {
                if (res && res.data) {
                    let data = res.data;

                    if (data.template) {
                        let meta = data.template;
                        this.modifierMeta(props, meta);
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        //toggleShow(props);
                    }
                    this.toggleStatus(this.props.grandStatus);
                }
            }
        });

    };

    modifierMeta = (props, meta) => {
        //添加行操作
        let porCol1 = {
            itemtype: "customer",
            attrcode: "opr",
            label: this.state.pubjson ? this.state.pubjson["10140PUBMESSAGE-000034"] : "10140PUBMESSAGE-000034",                       //"操作"
            visible: true,
            className: "table-opr",
            width: 200,
            fixed: "right",
            render: (text, record, index) => {
                let btnArray = ['WipsMore', 'WipsDelLineOpr', 'WipsInsertLine', 'WipsPasteLine'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "wips-opr",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.lineButtonClick(props, id, text, record, index)
                    }
                )

            }
        };

        let porCol2 = {
            itemtype: "customer",
            attrcode: "opr",
            label: this.state.pubjson ? this.state.pubjson["10140PUBMESSAGE-000034"] : "10140PUBMESSAGE-000034",                       //"操作"
            visible: true,
            className: "table-opr",
            width: 200,
            fixed: "right",
            render: (text, record, index) => {
                let btnArray = ['ReplsMore', 'ReplsDelLineOpr', 'ReplsInsertLine', 'ReplsPasteLine'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "repls-opr",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.lineButtonClick(props, id, text, record, index)
                    }
                )

            }
        };

        let porCol3 = {
            itemtype: "customer",
            attrcode: "opr",
            label: this.state.pubjson ? this.state.pubjson["10140PUBMESSAGE-000034"] : "10140PUBMESSAGE-000034",                       //"操作"
            visible: true,
            className: "table-opr",
            width: 200,
            fixed: "right",
            render: (text, record, index) => {
                let btnArray = ['PosMore', 'PosDelLineOpr', 'PosInsertLine', 'PosPasteLine'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "pos-opr",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.lineButtonClick(props, id, text, record, index)
                    }
                )

            }
        };

        let porCol4 = {
            itemtype: "customer",
            attrcode: "opr",
            label: this.state.pubjson ? this.state.pubjson["10140PUBMESSAGE-000034"] : "10140PUBMESSAGE-000034",                       //"操作"
            visible: true,
            className: "table-opr",
            width: 200,
            fixed: "right",
            render: (text, record, index) => {
                let btnArray = ['LossMore', 'LossDelLineOpr', 'LossInsertLine', 'LossPasteLine'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "loss-opr",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.lineButtonClick(props, id, text, record, index)
                    }
                )

            }
        };

        meta[AREA.bomwips].items.push(porCol1);
        meta[AREA.bomrepls].items.push(porCol2);
        meta[AREA.bompos].items.push(porCol3);
        meta[AREA.bomloss].items.push(porCol4);
        //处理孙表精度
        ajax({
            url: URL.replscale,
            data: {
                pk_group: window.parent.GETBUSINESSINFO().groupId
            },
            async: false,
            success: (res) => {
                if (res.data) {
                    meta[AREA.bomrepls].items.find(item => item.attrcode == 'vreplaceindex').scale = res.data.scale;
                }
            }
        })

    }


    componentDidMount() {
        let callback = json => {
            this.setState({
                json
            }, () => {
                this.initTemplate(this.props);
            });
        };
        this.props.MultiInit.getMultiLang({
            moduleId: "10140BOMM",
            domainName: "uapbd",
            callback
        });
        //    this.props.cardTable.setTableData(AREA.bomcarditem,this.state.rows);
        let callbacknoinit = (json, status, inlt) => {
            if (status) {
                this.setState({ pubjson: { ...json } })
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: '10140MMPUBMSG', domainName: 'uapbd', callback: callbacknoinit })
        this.props.button.setButtonVisible(['WipsAddLine', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow'], false)
        this.props.button.setButtonVisible(['ReplsAddLine', 'ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow', 'ReplsDelLine', 'ReplsCopyLine'], false)

    }

    componentDidUpdate() {


        if (this.props.show && !this.props.cardTable.getClickRowIndex(AREA.bomcarditem)) {
            console.log(this.props.cardTable.getClickRowIndex(AREA.bomcarditem))
            this.props.button.setButtonVisible(['WipsAddLine', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow'], false)
            this.props.button.setButtonVisible(['ReplsAddLine', 'ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow', 'ReplsDelLine', 'ReplsCopyLine'], false)
            this.props.button.setButtonVisible(['LossAddLine', 'LossDelLine', 'LossCopyLine', 'LossResetRow', 'LossDelLine', 'LossCopyLine', 'LossResetRow'], false)
            this.props.button.setButtonVisible(['PosAddLine', 'PosDelLine', 'PosCopyLine', 'PosResetRow', 'PosDelLine', 'PosCopyLine', 'PosResetRow'], false)

            ajax({
                url: URL.lossscale,
                data: { pk_org: this.props.rows[0].values.pk_org.value },
                success: (res) => {
                    if (res.data) {
                        this.props.meta.getMeta()[AREA.bomcarditem].items.find(item => item.attrcode == 'ndissipationum').scale = res.data.lossscale;
                        this.props.meta.getMeta()[AREA.bomloss].items.find(item => item.attrcode == 'nldissipationnum').scale = res.data.lossscale;
                    }
                }
            })
        }

        // this.toggleStatus(this.props.grandStatus);
        // if(this.props.show){
        //     document.getElementById('js_lightTabs_header_'+AREA.bomcarditem).style.display='none' 

        // }

    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.rows !== this.props.cardTable.getAllRows(AREA.bomcarditem)) {
            this.props.cardTable.setTableData(AREA.bomcarditem, { rows: nextprops.rows }, null, false)

        }
        this.props.cardTable.setStatus(AREA.bomwips, nextprops.grandStatus);
        this.props.cardTable.setStatus(AREA.bomrepls, nextprops.grandStatus);
        this.props.cardTable.setStatus(AREA.bompos, nextprops.grandStatus);
        this.props.cardTable.setStatus(AREA.bomloss, nextprops.grandStatus);

    }


    toggleStatus(status = 'browse') {
        let WipsBtnGroup = ['WipsAddLine', 'WipsInsertLine', 'WipsDelLine', 'WipsMore', 'WipsDelLineOpr', 'WipsCopyLine', 'WipsPasteLine', 'WipsPasteLineEnd', 'WipsPasteLineCancel', 'WipsResetRow']
        let PosBtnGroup = ['PosAddLine', 'PosInsertLine', 'PosDelLine', 'PosMore', 'PosDelLineOpr', 'PosCopyLine', 'PosPasteLine', 'PosPasteLineEnd', 'PosPasteLineCancel', 'PosResetRow']
        let ReplsBtnGroup = ['ReplsAddLine', 'ReplsInsertLine', 'ReplsDelLine', 'ReplsMore', 'ReplsDelLineOpr', 'ReplsCopyLine', 'ReplsPasteLine', 'ReplsPasteLineEnd', 'ReplsPasteLineCancel', 'ReplsResetRow']
        let LossBtnGroup = ['LossAddLine', 'LossInsertLine', 'LossDelLine', 'LossMore', 'LossDelLineOpr', 'LossCopyLine', 'LossPasteLine', 'LossPasteLineEnd', 'LossPasteLineCancel', 'LossResetRow']

        let WipsEditBtnGroup = ['WipsAddLine', 'WipsInsertLine', 'WipsDelLine', 'WipsMore', 'WipsDelLineOpr', 'WipsCopyLine', 'WipsResetRow']
        let PosEditBtnGroup = ['PosAddLine', 'PosInsertLine', 'PosDelLine', 'PosMore', 'PosDelLineOpr', 'PosCopyLine', 'PosResetRow']
        let ReplsEditBtnGroup = ['ReplsAddLine', 'ReplsInsertLine', 'ReplsDelLine', 'ReplsMore', 'ReplsDelLineOpr', 'ReplsCopyLine', 'ReplsResetRow']
        let LossEditBtnGroup = ['LossAddLine', 'LossInsertLine', 'LossDelLine', 'LosMore', 'LossDelLineOpr', 'LossCopyLine', 'LossResetRow']

        if (status == 'browse') {
            //this.props.button.setButtonVisible(['WipsAddLine','WipsDelLine','WipsCopyLine','WipsResetRow','ReplsAddLine','ReplsDelLine','ReplsResetRow'], false);
            this.props.button.setButtonVisible(WipsBtnGroup, false)
            this.props.button.setButtonVisible(PosBtnGroup, false)
            this.props.button.setButtonVisible(ReplsBtnGroup, false)
            this.props.button.setButtonVisible(LossBtnGroup, false)
        } else {
            // this.props.button.setButtonVisible(['WipsAddLine','WipsDelLine','WipsCopyLine','WipsResetRow','ReplsAddLine','ReplsDelLine','ReplsResetRow'], true);
            this.props.button.setButtonVisible(WipsBtnGroup, false)
            this.props.button.setButtonVisible(PosBtnGroup, false)
            this.props.button.setButtonVisible(ReplsBtnGroup, false)
            this.props.button.setButtonVisible(LossBtnGroup, false)
            this.props.button.setButtonVisible(WipsEditBtnGroup, true)
            this.props.button.setButtonVisible(PosEditBtnGroup, true)
            this.props.button.setButtonVisible(ReplsEditBtnGroup, true)
            this.props.button.setButtonVisible(LossEditBtnGroup, true)
        }
        this.props.cardTable.setStatus(AREA.bomloss, status);
        this.props.cardTable.setStatus(AREA.bomwips, status);
        this.props.cardTable.setStatus(AREA.bomrepls, status);
        this.props.cardTable.setStatus(AREA.bompos, status);
    }

    onRowClick(props, moduleId, record, index) {
        // this.state.selectedChild = record
        // this.state.selectedChildIndex = index

        let scale = record.values.nassitemnum.scale;
        props.meta.getMeta()[AREA.bomwips].items.find(item => item.attrcode == 'nnum').scale = scale;
        props.meta.getMeta()[AREA.bompos].items.find(item => item.attrcode == 'nnum').scale = scale;

        record.bomwips ? props.cardTable.setTableData(AREA.bomwips, record.bomwips) : props.cardTable.setTableData(AREA.bomwips, { rows: [] });
        record.bomrepls ? props.cardTable.setTableData(AREA.bomrepls, record.bomrepls) : props.cardTable.setTableData(AREA.bomrepls, { rows: [] });
        record.bompos ? props.cardTable.setTableData(AREA.bompos, record.bompos) : props.cardTable.setTableData(AREA.bompos, { rows: [] });
        record.bomloss ? props.cardTable.setTableData(AREA.bomloss, record.bomloss) : props.cardTable.setTableData(AREA.bomloss, { rows: [] });


        //props.cardTable.setTableData(AREA.bomloss,record.bomloss):props.cardTable.setTableData(AREA.bomwips,{rows:[]});
        //record.loss = props.cardTable.getAllRows(AREA.bomwips);

        this.toggleChildRow(props, moduleId, record, index)
    }

    toggleChildRow = (props, moduleId, record, index) => {
        if (props.grandStatus == 'edit') {
            props.button.setButtonVisible(['WipsAddLine', 'WipsDelLine', 'WipsMore', 'WipsCopyLine', 'WipsResetRow'], true)
            props.button.setButtonVisible(['WipsPasteLineEnd', 'WipsPasteLineCancel', 'WipsPasteLine'], false)
            props.button.setButtonDisabled(['WipsAddLine'], false)
            props.button.setButtonDisabled(['WipsDelLine', 'WipsCopyLine'], true)
            if (!props.wipsmaintain) {


                props.button.setButtonVisible(['ReplsAddLine', 'ReplsDelLine', 'ReplsMore', 'ReplsCopyLine', 'ReplsResetRow'], true)
                props.button.setButtonVisible(['ReplsPasteLineEnd', 'ReplsPasteLineCancel', 'ReplsPasteLine'], false)
                props.button.setButtonDisabled(['ReplsAddLine'], false)
                props.button.setButtonDisabled(['ReplsDelLine', 'ReplsCopyLine'], true)

                props.button.setButtonVisible(['PosAddLine', 'PosDelLine', 'PosMore', 'PosCopyLine', 'PosResetRow'], true)
                props.button.setButtonVisible(['PosPasteLineEnd', 'PosPasteLineCancel', 'PosPasteLine'], false)
                props.button.setButtonDisabled(['PosAddLine'], false)
                props.button.setButtonDisabled(['PosDelLine', 'PosCopyLine'], true)

                props.button.setButtonVisible(['LossAddLine', 'LossDelLine', 'LossMore', 'LossCopyLine', 'LossResetRow'], true)
                props.button.setButtonVisible(['LossPasteLineEnd', 'LossPasteLineCancel', 'LossPasteLine'], false)
                props.button.setButtonDisabled(['LossAddLine'], false)
                props.button.setButtonDisabled(['LossDelLine', 'LossCopyLine'], true)
            }
            if (props.cardTable.getNumberOfRows(AREA.bomwips) <= 0) {
                props.button.setButtonVisible(['WipsDelLineOpr', 'WipsInsertLine'], false)
                props.button.setButtonDisabled(['WipsResetRow'], true)
            } else {
                props.button.setButtonVisible(['WipsDelLineOpr', 'WipsInsertLine'], true)
                if (props.cardTable.getNumberOfRows(AREA.bomwips) >= 1) {
                    props.button.setButtonDisabled(['WipsResetRow'], false)
                } else {
                    props.button.setButtonDisabled(['WipsResetRow'], true)
                }
            }
            if (!props.wipsmaintain) {

                if (props.cardTable.getNumberOfRows(AREA.bomrepls) <= 0) {
                    props.button.setButtonVisible(['ReplsDelLineOpr', 'ReplsInsertLine'], false)
                    props.button.setButtonDisabled(['ReplsResetRow'], true)
                } else {
                    props.button.setButtonVisible(['ReplsDelLineOpr', 'ReplsInsertLine'], true)
                    if (props.cardTable.getNumberOfRows(AREA.bomrepls) >= 1) {
                        props.button.setButtonDisabled(['ReplsResetRow'], false)
                    } else {
                        props.button.setButtonDisabled(['ReplsResetRow'], true)
                    }
                }

                if (props.cardTable.getNumberOfRows(AREA.bompos) <= 0) {
                    props.button.setButtonVisible(['PosDelLineOpr', 'PosInsertLine'], false)
                    props.button.setButtonDisabled(['PosResetRow'], true)
                } else {
                    props.button.setButtonVisible(['PosDelLineOpr', 'PosInsertLine'], true)
                    if (props.cardTable.getNumberOfRows(AREA.bompos) >= 1) {
                        props.button.setButtonDisabled(['PosResetRow'], false)
                    } else {
                        props.button.setButtonDisabled(['PosResetRow'], true)
                    }
                }

                if (props.cardTable.getNumberOfRows(AREA.bomloss) <= 0) {
                    props.button.setButtonVisible(['LossDelLineOpr', 'LossInsertLine'], false)
                    props.button.setButtonDisabled(['LossResetRow'], true)
                } else {
                    props.button.setButtonVisible(['LossDelLineOpr', 'LossInsertLine'], true)
                    if (props.cardTable.getNumberOfRows(AREA.bomloss) >= 1) {
                        props.button.setButtonDisabled(['LossResetRow'], false)
                    } else {
                        props.button.setButtonDisabled(['LossResetRow'], true)
                    }
                }
            }
        } else {
            props.button.setButtonVisible(['WipsAddLine', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow'], false)
            props.button.setButtonVisible(['WipsMore', 'WipsDelLineOpr', 'WipsInsertLine'], false)
            props.button.setButtonVisible(['WipsPasteLineEnd', 'WipsPasteLineCancel', 'WipsPasteLine'], false)

            props.button.setButtonVisible(['ReplsAddLine', 'ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow'], false)
            props.button.setButtonVisible(['ReplsMore', 'ReplsDelLineOpr', 'ReplsInsertLine'], false)
            props.button.setButtonVisible(['ReplsPasteLineEnd', 'ReplsPasteLineCancel', 'ReplsPasteLine'], false)

            props.button.setButtonVisible(['PosAddLine', 'PosDelLine', 'PosCopyLine', 'PosResetRow'], false)
            props.button.setButtonVisible(['PosMore', 'PosDelLineOpr', 'PosInsertLine'], false)
            props.button.setButtonVisible(['PosPasteLineEnd', 'PosPasteLineCancel', 'PosPasteLine'], false)

            props.button.setButtonVisible(['LossAddLine', 'LossDelLine', 'LossCopyLine', 'LossResetRow'], false)
            props.button.setButtonVisible(['LossMore', 'LossDelLineOpr', 'LossInsertLine'], false)
            props.button.setButtonVisible(['LossPasteLineEnd', 'LossPasteLineCancel', 'LossPasteLine'], false)
        }

        // if(props.grandStatus == 'edit'){
        //      if(props.cardTable.getNumberOfRows(AREA.bomwips) <= 0){
        //         props.button.setButtonVisible(['WipsAddLine','WipsDelLine','WipsCopyLine','WipsResetRow'], true)
        //          props.button.setButtonVisible(['WipsDelLineOpr','WipsInsertLine','WipsPasteLine'], false)
        //         props.button.setButtonDisabled(['WipsAddLine'], false)
        //         props.button.setButtonDisabled(['WipsDelLine','WipsCopyLine','WipsResetRow'], true)
        //     }else{
        //          props.button.setButtonVisible(['WipsAddLine','WipsDelLine','WipsCopyLine','WipsResetRow','WipsDelLineOpr','WipsInsertLine'], true)
        //         //props.button.setButtonVisible(['WipsPasteLine'], false)
        //         props.button.setButtonDisabled(['WipsAddLine','WipsDelLine','WipsCopyLine','WipsResetRow'], false)
        //         if(props.cardTable.getNumberOfRows(AREA.bomwips) <= 1){
        //             props.button.setButtonDisabled(['WipsResetRow'],true)
        //         }

        //     }
        // }else{
        //     props.button.setButtonVisible(['WipsAddLine','WipsDelLine','WipsCopyLine','WipsResetRow','WipsDelLine','WipsCopyLine','WipsResetRow'], false)

        // }

        // if(props.grandStatus == 'edit'){
        //     if(props.cardTable.getNumberOfRows(AREA.bomrepls) <= 0){
        //         props.button.setButtonVisible(['ReplsAddLine','ReplsDelLine','ReplsCopyLine','ReplsResetRow'], true)
        //         // props.button.setButtonVisible(['ReplsDelLineOpr','ReplsInsertLine','ReplsPasteLine'], false)
        //         props.button.setButtonDisabled(['ReplsAddLine'], false)
        //         props.button.setButtonDisabled(['ReplsDelLine','ReplsCopyLine','ReplsResetRow'], true)
        //     }else{
        //         // props.button.setButtonVisible(['ReplsAddLine','ReplsDelLine','ReplsCopyLine','ReplsResetRow','ReplsDelLineOpr','ReplsInsertLine'], true)
        //         props.button.setButtonVisible(['ReplsPasteLine'], false)
        //         props.button.setButtonDisabled(['ReplsAddLine','ReplsDelLine','ReplsCopyLine','ReplsResetRow'], false)
        //         if(props.cardTable.getNumberOfRows(AREA.bomrepls) <= 1){
        //             props.button.setButtonDisabled(['ReplsResetRow'],true)
        //         }
        //     }
        // }else{
        //     props.button.setButtonVisible(['ReplsAddLine','ReplsDelLine','ReplsCopyLine','ReplsResetRow','ReplsDelLine','ReplsCopyLine'], false)

        // }

        // if(props.grandStatus == 'edit'){
        //     if(props.cardTable.getNumberOfRows(AREA.bompos) <= 0){
        //         props.button.setButtonVisible(['PosAddLine','PosDelLine','PosCopyLine','PosResetRow'], true)
        //         // props.button.setButtonVisible(['PosDelLineOpr','PosInsertLine','PosPasteLine'], false)
        //         props.button.setButtonDisabled(['PosAddLine'], false)
        //         props.button.setButtonDisabled(['PosDelLine','PosCopyLine','PosResetRow'], true)
        //     }else{
        //         // props.button.setButtonVisible(['PosAddLine','PosDelLine','PosCopyLine','PosResetRow','PosDelLineOpr','PosInsertLine'], true)
        //         //props.button.setButtonVisible(['PosPasteLine'], false)
        //         props.button.setButtonDisabled(['PosAddLine','PosDelLine','PosCopyLine','PosResetRow'], false)
        //         if(props.cardTable.getNumberOfRows(AREA.bompos) <= 1){
        //             props.button.setButtonDisabled(['PosResetRow'],true)
        //         }
        //     }
        // }else{
        //     props.button.setButtonVisible(['PosAddLine','PosDelLine','PosCopyLine','PosResetRow','PosDelLine','PosCopyLine','PosResetRow'], false)

        // }

        // if(props.grandStatus == 'edit'){
        //     if(props.cardTable.getNumberOfRows(AREA.bomloss) <= 0){
        //         props.button.setButtonVisible(['LossAddLine','LossDelLine','LossCopyLine','LossResetRow'], true)
        //         // props.button.setButtonVisible(['LossDelLineOpr','LossInsertLine','LossPasteLine'], false)
        //         props.button.setButtonDisabled(['LossAddLine'], false)
        //         props.button.setButtonDisabled(['LossDelLine','LossCopyLine','LossResetRow'], true)
        //     }else{
        //         // props.button.setButtonVisible(['LossAddLine','LossDelLine','LossCopyLine','LossResetRow','LossDelLineOpr','LossInsertLine'], true)
        //         props.button.setButtonVisible(['LossPasteLine'], false)
        //         props.button.setButtonDisabled(['LossAddLine','LossDelLine','LossCopyLine','LossResetRow'], false)
        //         if(props.cardTable.getNumberOfRows(AREA.bomloss) <= 1){
        //             props.button.setButtonDisabled(['LossResetRow'],true)
        //         }
        //     }
        // }else{
        //     props.button.setButtonVisible(['LossAddLine','LossDelLine','LossCopyLine','LossResetRow','LossDelLine','LossCopyLine','LossResetRow'], false)

        // }

    }


    buttonClick = (props, id) => {
        let index = props.cardTable.getClickRowIndex(AREA.bomcarditem) ? props.cardTable.getClickRowIndex(AREA.bomcarditem).index : -1;
        if (index < 0) {
            toast({
                color: "warning",
                content: this.state.json["110140BOMM3028"]  //请先选择子项！
            })
            return
        }

        switch (id) {
            case 'WipsAddLine':
                this.doAfterAddWip(props, index)
                break
            case 'ReplsAddLine':
                this.doAfterAddRepl(props, index)
                break
            case 'PosAddLine':
                this.doAfterAddPos(props, index)
                break
            case 'LossAddLine':
                this.doAfterAddLoss(props, index)
                break;
            case 'WipsDelLine':
                this.doDeleteWips(props, index)
                break
            case 'ReplsDelLine':
                this.doDeleteRepls(props, index)
                break
            case 'PosDelLine':
                this.doDeletePos(props, index)
                break
            case 'LossDelLine':
                this.doDeleteLoss(props, index)
                break
            case 'WipsCopyLine':
                this.doCopyWips(props, index)
                break
            case 'ReplsCopyLine':
                this.doCopyRepls(props, index)
                break
            case 'PosCopyLine':
                this.doCopyPos(props, index)
                break
            case 'LossCopyLine':
                this.doCopyLoss(props, index)
                break
            case 'WipsPasteLineCancel':
                this.cancelCopyWips(props, index)
                break
            case 'ReplsPasteLineCancel':
                this.cancelCopyRepls(props, index)
                break
            case 'PosPasteLineCancel':
                this.cancelCopyPos(props, index)
                break
            case 'LossPasteLineCancel':
                this.cancelCopyLoss(props, index)
                break
            case 'WipsPasteLineEnd':
                this.pasteToTailWips(props, index)
                break
            case 'ReplsPasteLineEnd':
                this.pasteToTailRepls(props, index)
                break
            case 'PosPasteLineEnd':
                this.pasteToTailPos(props, index)
                break
            case 'LossPasteLineEnd':
                this.pasteToTailLoss(props, index)
                break
            case 'WipsResetRow':
                this.wipsResetRow(props, index)
                break
            case 'ReplsResetRow':
                break
            case 'PosResetRow':
                break
            case 'LossResetRow':
                break
            default:
                break;
        }
    }

    lineButtonClick = (props, id, text, record, index) => {
        let childindex = props.cardTable.getClickRowIndex(AREA.bomcarditem) ? props.cardTable.getClickRowIndex(AREA.bomcarditem).index : -1;
        if (childindex < 0) {
            toast({
                color: "warning",
                content: this.state.json["110140BOMM3028"]  //请先选择子项！
            })
            return
        }

        switch (id) {
            case 'WipsPasteLine':
                this.pasteToHereWips(props, index)
                break;
            case 'ReplsPasteLine':
                this.pasteToHereRepls(props, index)
                break;
            case 'PosPasteLine':
                this.pasteToHerePos(props, index)
                break;
            case 'LossPasteLine':
                this.pasteToHereLoss(props, index)
                break;
            case 'WipsDelLineOpr':
                this.doDeleteHereWips(props, index)
                break;
            case 'ReplsDelLineOpr':
                this.doDeleteHereRepls(props, index)
                break;
            case 'PosDelLineOpr':
                this.doDeleteHerePos(props, index)
                break;
            case 'LossDelLineOpr':
                this.doDeleteHereLoss(props, index)
                break;
            case 'WipsInsertLine':
                this.doInsertWips(props, childindex, index)
                break;
            case 'ReplsInsertLine':
                this.doInsertRepls(props, childindex, index)
                break;
            case 'PosInsertLine':
                this.doInsertPos(props, childindex, index)
                break;
            case 'LossInsertLine':
                this.doInsertLoss(props, childindex, index)
                break;
            case 'WipsMore':
                this.wipsMore(props, record, index)
                break;
            case 'ReplsMore':
                this.replsMore(props, record, index)
                break;
            case 'PosMore':
                this.posMore(props, record, index)
                break;
            case 'LossMore':
                this.lossMore(props, record, index)
                break;
            default:
                break;
        }
    }

    doAfterAddWip = (props, index, insertpos) => {
        let currows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
        console.log({ 'index': index, 'selectedChild': currows })
        console.log({ 'props.parent': this.props.parent })

        if (insertpos != null) {
            props.cardTable.addRow(AREA.bomwips, insertpos);
        } else {
            props.cardTable.addRow(AREA.bomwips);
        }
        let data = {
            pageid: PAGECODE.bom_grand,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: [],
                areacode: AREA.bomwips//添加表单的areacode编码
            }
        };
        //行号
        let idx = -1
        if (insertpos != null) {
            idx = insertpos
        } else {
            idx = props.cardTable.getNumberOfRows(AREA.bomwips) - 1
        }
        RownoUtils.setRowNo(props, AREA.bomwips, 'g_irowno')
        //集团、子项编码和名称带过来
        //props.cardTable.setValByKeyAndIndex(AREA.bomwips, idx, 'pk_group', currows[0].values['pk_group'] )
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, idx, 'pk_group', props.parent.rows[0].values['pk_group'])
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, idx, 'g_cmaterialvid', currows[0].values['cmaterialvid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, idx, 'g_cmaterialvid.name', currows[0].values['cmaterialvid.name'])
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, idx, 'g_cmaterialid', currows[0].values['cmaterialid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, idx, 'cassmeasureid', currows[0].values['cassmeasureid'])
        // data.model.rows = props.cardTable.getAllRows(AREA.bomwips);
        currows[0].bomwips = { rows: props.cardTable.getAllRows(AREA.bomwips) };

        props.button.setButtonVisible(['WipsAddLine', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow', 'WipsMore', 'WipsDelLineOpr', 'WipsInsertLine'], true)
        props.button.setButtonVisible(['WipsPasteLine', 'WipsPasteLineEnd', 'WipsPasteLineCancel'], false)
        props.button.setButtonDisabled(['WipsDelLine', 'WipsCopyLine', 'WipsResetRow'], true)
        props.button.setButtonDisabled(['WipsAddLine'], false)
        if (props.cardTable.getNumberOfRows(AREA.bomwips) >= 1) {
            props.button.setButtonDisabled(['WipsResetRow'], false)
        }
    }



    doAfterAddPos = (props, index, insertpos) => {
        let currows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
        console.log({ 'index': index, 'selectedChild': currows })
        console.log({ 'props.parent': this.props.parent })

        if (insertpos != null) {
            props.cardTable.addRow(AREA.bompos, insertpos);
        } else {
            props.cardTable.addRow(AREA.bompos);
        }
        let data = {
            pageid: PAGECODE.bom_grand,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: [],
                areacode: AREA.bompos//添加表单的areacode编码
            }
        };
        //行号
        let idx = -1
        if (insertpos != null) {
            idx = insertpos
        } else {
            idx = props.cardTable.getNumberOfRows(AREA.bompos) - 1
        }
        // props.cardTable.setValByKeyAndIndex(AREA.bompos, count-1, 'g_irowno', {value: count * 10, display: count * 10})
        RownoUtils.setRowNo(props, AREA.bompos, 'g_irowno')
        //子项编码和名称带过来
        props.cardTable.setValByKeyAndIndex(AREA.bompos, idx, 'pk_group', props.parent.rows[0].values['pk_group'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, idx, 'pk_org', props.parent.rows[0].values['pk_org'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, idx, 'pk_org_v', props.parent.rows[0].values['pk_org_v'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, idx, 'g_cmaterialvid', currows[0].values['cmaterialvid'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, idx, 'g_cmaterialvid.name', currows[0].values['cmaterialvid.name'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, idx, 'g_cmaterialid', currows[0].values['cmaterialid'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, idx, 'cassmeasureid', currows[0].values['cassmeasureid'])

        // data.model.rows = props.cardTable.getAllRows(AREA.bompos);
        currows[0].bompos = { rows: props.cardTable.getAllRows(AREA.bompos) };


        props.button.setButtonVisible(['PosAddLine', 'PosDelLine', 'PosCopyLine', 'PosResetRow', 'PosMore', 'PosDelLineOpr', 'PosInsertLine'], true)
        props.button.setButtonVisible(['PosPasteLine', 'PosPasteLineEnd', 'PosPasteLineCancel'], false)
        props.button.setButtonDisabled(['PosDelLine', 'PosCopyLine', 'PosResetRow'], true)
        props.button.setButtonDisabled(['PosAddLine'], false)
        if (props.cardTable.getNumberOfRows(AREA.bompos) >= 1) {
            props.button.setButtonDisabled(['PosResetRow'], false)
        }
    }



    doAfterAddRepl = (props, index, insertpos) => {
        let currows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
        console.log({ 'index': index, 'selectedChild': currows })
        console.log({ 'props.parent': this.props.parent })

        if (insertpos != null) {
            props.cardTable.addRow(AREA.bomrepls, insertpos);
        } else {
            props.cardTable.addRow(AREA.bomrepls);
        }
        let data = {
            pageid: PAGECODE.bom_grand,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: [],
                areacode: AREA.bomrepls//添加表单的areacode编码
            }
        };
        //行号
        let idx = -1
        if (insertpos != null) {
            idx = insertpos
        } else {
            idx = props.cardTable.getNumberOfRows(AREA.bomrepls) - 1
        }
        //props.cardTable.setValByKeyAndIndex(AREA.bomrepls, count-1, 'vrowno', {value: count * 10, display: count * 10})
        RownoUtils.setRowNo(props, AREA.bomrepls, 'vrowno')
        //从表头取pk_group,pk_org,pk_org_v
        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, idx, 'pk_group', props.parent.rows[0].values['pk_group'])
        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, idx, 'pk_org', props.parent.rows[0].values['pk_org'])
        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, idx, 'pk_org_v', props.parent.rows[0].values['pk_org_v'])
        //替代系数  vreplaceindex
        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, idx, 'vreplaceindex', { value: '1/1', display: '1/1' })
        props.cardTable.setEditableByIndex(AREA.bomrepls, idx, ['vprodversion', 'vpackversion'], true)
        props.cardTable.setEditableByIndex(AREA.bomrepls, idx, ['ccustomerid', 'cvendorid', 'cproductorid', 'cprojectid'], false)
        // data.model.rows = props.cardTable.getAllRows(AREA.bomrepls);
        currows[0].bomrepls = { rows: props.cardTable.getAllRows(AREA.bomrepls) };

        props.button.setButtonVisible(['ReplsAddLine', 'ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow', 'ReplsMore', 'ReplsDelLineOpr', 'ReplsInsertLine'], true)
        props.button.setButtonVisible(['ReplsPasteLine', 'ReplsPasteLineEnd', 'ReplsPasteLineCancel'], false)
        props.button.setButtonDisabled(['ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow'], true)
        props.button.setButtonDisabled(['ReplsAddLine'], false)
        if (props.cardTable.getNumberOfRows(AREA.bomrepls) >= 1) {
            props.button.setButtonDisabled(['ReplsResetRow'], false)
        }
    }

    doAfterAddLoss = (props, index, insertpos) => {
        let currows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, index);
        console.log({ 'index': index, 'selectedChild': currows })
        console.log({ 'props.parent': this.props.parent })

        if (insertpos != null) {
            props.cardTable.addRow(AREA.bomloss, insertpos);
        } else {
            props.cardTable.addRow(AREA.bomloss);
        }
        let data = {
            pageid: PAGECODE.bom_grand,
            model: {
                areaType: "table",
                pageinfo: null,
                rows: [],
                areacode: AREA.bomloss//添加表单的areacode编码
            }
        };
        //行号
        let idx = -1
        if (insertpos != null) {
            idx = insertpos
        } else {
            idx = props.cardTable.getNumberOfRows(AREA.bomloss) - 1
        }
        // props.cardTable.setValByKeyAndIndex(AREA.bomloss, count-1, 'vlrowno', {value: count * 10, display: count * 10})
        RownoUtils.setRowNo(props, AREA.bomloss, 'vlrowno')
        //从表头取pk_group,pk_org,pk_org_v
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'pk_group', props.parent.rows[0].values['pk_group'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'pk_org', props.parent.rows[0].values['pk_org'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'pk_org_v', props.parent.rows[0].values['pk_org_v'])
        //从表头取父项物料、物料版本、主单位、辅单位、换算率
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'clmaterialid', props.parent.rows[0].values['hcmaterialid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'clmaterialvid', props.parent.rows[0].values['hcmaterialvid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'clunitid', props.parent.rows[0].values['hcmeasureid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'clunitastid', props.parent.rows[0].values['hcassmeasureid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'vlchangerate', props.parent.rows[0].values['hvchangerate'])

        //产品数量下限(nlfromastnum)、产品主数量下限(nlfromnum)
        if (idx == 0) {
            //第一行默认以0开头
            props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'nlfromastnum', { value: 0, display: 0 })
            props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'nlfromnum', { value: 0, display: 0 })
        } else {
            let prerowidx = idx - 1
            let prenltoastnum = props.cardTable.getValByKeyAndIndex(AREA.bomloss, prerowidx, 'nltoastnum')
            let prenltonum = props.cardTable.getValByKeyAndIndex(AREA.bomloss, prerowidx, 'nltonum')
            props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'nlfromastnum', prenltoastnum)
            props.cardTable.setValByKeyAndIndex(AREA.bomloss, idx, 'nlfromnum', prenltonum)
        }

        // data.model.rows = props.cardTable.getAllRows(AREA.bomloss);
        currows[0].bomloss = { rows: props.cardTable.getAllRows(AREA.bomloss) };

        props.button.setButtonVisible(['LossAddLine', 'LossDelLine', 'LossCopyLine', 'LossResetRow', 'LossMore', 'LossDelLineOpr', 'LossInsertLine'], true)
        props.button.setButtonVisible(['LossPasteLine', 'LossPasteLineEnd', 'LossPasteLineCancel'], false)
        props.button.setButtonDisabled(['LossDelLine', 'LossCopyLine', 'LossResetRow'], true)
        props.button.setButtonDisabled(['LossAddLine'], false)
        if (props.cardTable.getNumberOfRows(AREA.bomloss) >= 1) {
            props.button.setButtonDisabled(['LossResetRow'], false)
        }
    }

    wipsModalAddRow = (props) => {
        let currows = props.cardTable.getClickRowIndex(AREA.bomcarditem).record;
        //行号

        RownoUtils.setRowNo(props, AREA.bomwips, 'g_irowno')

        let num = this.props.cardTable.getNumberOfRows(AREA.bomwips)
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, num - 1, 'pk_group', props.parent.rows[0].values['pk_group'])
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, num - 1, 'g_cmaterialvid', currows.values['cmaterialvid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, num - 1, 'g_cmaterialvid.name', currows.values['cmaterialvid.name'])
        props.cardTable.setValByKeyAndIndex(AREA.bomwips, num - 1, 'g_cmaterialid', currows.values['cmaterialid'])
        // data.model.rows = props.cardTable.getAllRows(AREA.bomwips);
        currows.bomwips = { rows: props.cardTable.getAllRows(AREA.bomwips) };

        props.button.setButtonVisible(['WipsAddLine', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow', 'WipsMore', 'WipsDelLineOpr', 'WipsInsertLine'], true)
        props.button.setButtonVisible(['WipsPasteLine', 'WipsPasteLineEnd', 'WipsPasteLineCancel'], false)
        props.button.setButtonDisabled(['WipsDelLine', 'WipsCopyLine', 'WipsResetRow'], true)
        props.button.setButtonDisabled(['WipsAddLine'], false)
        if (props.cardTable.getNumberOfRows(AREA.bomwips) >= 1) {
            props.button.setButtonDisabled(['WipsResetRow'], false)
        }
    }

    replsModalAddRow = (props) => {
        let currows = props.cardTable.getClickRowIndex(AREA.bomcarditem).record;
        //行号

        RownoUtils.setRowNo(props, AREA.bomrepls, 'vrowno')

        let num = this.props.cardTable.getNumberOfRows(AREA.bomrepls)

        //从表头取pk_group,pk_org,pk_org_v
        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, num - 1, 'pk_group', props.parent.rows[0].values['pk_group'])
        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, num - 1, 'pk_org', props.parent.rows[0].values['pk_org'])
        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, num - 1, 'pk_org_v', props.parent.rows[0].values['pk_org_v'])
        //替代系数  vreplaceindex
        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, num - 1, 'vreplaceindex', { value: '1/1', display: '1/1' })
        props.cardTable.setEditableByIndex(AREA.bomrepls, num - 1, ['vprodversion', 'vpackversion'], true)
        props.cardTable.setEditableByIndex(AREA.bomrepls, num - 1, ['ccustomerid', 'cvendorid', 'cproductorid', 'cprojectid'], false)
        // data.model.rows = props.cardTable.getAllRows(AREA.bomrepls);
        currows.bomrepls = { rows: props.cardTable.getAllRows(AREA.bomrepls) };

        props.button.setButtonVisible(['ReplsAddLine', 'ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow', 'ReplsMore', 'ReplsDelLineOpr', 'ReplsInsertLine'], true)
        props.button.setButtonVisible(['ReplsPasteLine', 'ReplsPasteLineEnd', 'ReplsPasteLineCancel'], false)
        props.button.setButtonDisabled(['ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow'], true)
        props.button.setButtonDisabled(['ReplsAddLine'], false)
        if (props.cardTable.getNumberOfRows(AREA.bomrepls) >= 1) {
            props.button.setButtonDisabled(['ReplsResetRow'], false)
        }

    }

    posModalAddRow = (props) => {
        let currows = props.cardTable.getClickRowIndex(AREA.bomcarditem).record;
        //行号

        RownoUtils.setRowNo(props, AREA.bompos, 'g_irowno')

        let num = this.props.cardTable.getNumberOfRows(AREA.bompos)

        //子项编码和名称带过来
        props.cardTable.setValByKeyAndIndex(AREA.bompos, num - 1, 'pk_group', props.parent.rows[0].values['pk_group'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, num - 1, 'pk_org', props.parent.rows[0].values['pk_org'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, num - 1, 'pk_org_v', props.parent.rows[0].values['pk_org_v'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, num - 1, 'g_cmaterialvid', currows.values['cmaterialvid'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, num - 1, 'g_cmaterialvid.name', currows.values['cmaterialvid.name'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, num - 1, 'g_cmaterialid', currows.values['cmaterialid'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, num - 1, 'cassmeasureid', currows.values['cassmeasureid'])
        props.cardTable.setValByKeyAndIndex(AREA.bompos, num - 1, 'cmeasureid', currows.values['cmeasureid'])

        // data.model.rows = props.cardTable.getAllRows(AREA.bompos);
        currows.bompos = { rows: props.cardTable.getAllRows(AREA.bompos) };


        props.button.setButtonVisible(['PosAddLine', 'PosDelLine', 'PosCopyLine', 'PosResetRow', 'PosMore', 'PosDelLineOpr', 'PosInsertLine'], true)
        props.button.setButtonVisible(['PosPasteLine', 'PosPasteLineEnd', 'PosPasteLineCancel'], false)
        props.button.setButtonDisabled(['PosDelLine', 'PosCopyLine', 'PosResetRow'], true)
        props.button.setButtonDisabled(['PosAddLine'], false)
        if (props.cardTable.getNumberOfRows(AREA.bompos) >= 1) {
            props.button.setButtonDisabled(['PosResetRow'], false)
        }
    }

    lossModalAddRow = (props) => {
        let currows = props.cardTable.getClickRowIndex(AREA.bomcarditem).record;
        //行号

        RownoUtils.setRowNo(props, AREA.bomloss, 'vlrowno')

        let num = this.props.cardTable.getNumberOfRows(AREA.bomloss)

        //从表头取pk_group,pk_org,pk_org_v
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'pk_group', props.parent.rows[0].values['pk_group'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'pk_org', props.parent.rows[0].values['pk_org'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'pk_org_v', props.parent.rows[0].values['pk_org_v'])
        //从表头取父项物料、物料版本、主单位、辅单位、换算率
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'clmaterialid', props.parent.rows[0].values['hcmaterialid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'clmaterialvid', props.parent.rows[0].values['hcmaterialvid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'clunitid', props.parent.rows[0].values['hcmeasureid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'clunitastid', props.parent.rows[0].values['hcassmeasureid'])
        props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'vlchangerate', props.parent.rows[0].values['hvchangerate'])

        //产品数量下限(nlfromastnum)、产品主数量下限(nlfromnum)
        if (num == 1) {
            //第一行默认以0开头
            props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'nlfromastnum', { value: 0, display: 0 })
            props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'nlfromnum', { value: 0, display: 0 })
        } else {
            let prerowidx = num - 2
            let prenltoastnum = props.cardTable.getValByKeyAndIndex(AREA.bomloss, prerowidx, 'nltoastnum')
            let prenltonum = props.cardTable.getValByKeyAndIndex(AREA.bomloss, prerowidx, 'nltonum')
            props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'nlfromastnum', prenltoastnum)
            props.cardTable.setValByKeyAndIndex(AREA.bomloss, num - 1, 'nlfromnum', prenltonum)
        }

        // data.model.rows = props.cardTable.getAllRows(AREA.bomloss);
        currows.bomloss = { rows: props.cardTable.getAllRows(AREA.bomloss) };

        props.button.setButtonVisible(['LossAddLine', 'LossDelLine', 'LossCopyLine', 'LossResetRow', 'LossMore', 'LossDelLineOpr', 'LossInsertLine'], true)
        props.button.setButtonVisible(['LossPasteLine', 'LossPasteLineEnd', 'LossPasteLineCancel'], false)
        props.button.setButtonDisabled(['LossDelLine', 'LossCopyLine', 'LossResetRow'], true)
        props.button.setButtonDisabled(['LossAddLine'], false)
        if (props.cardTable.getNumberOfRows(AREA.bomloss) >= 1) {
            props.button.setButtonDisabled(['LossResetRow'], false)
        }
    }

    doAfterSelectWips = () => {
        let checkedRows = this.props.cardTable.getCheckedRows(AREA.bomwips)

        if (checkedRows.length > 0) {
            this.props.button.setButtonDisabled(['WipsDelLine', 'WipsCopyLine'], false);
        }
        else {
            this.props.button.setButtonDisabled(['WipsDelLine', 'WipsCopyLine'], true);
        }
    }

    doAfterSelectRepls = () => {
        let checkedRows = this.props.cardTable.getCheckedRows(AREA.bomrepls)

        if (checkedRows.length > 0) {
            this.props.button.setButtonDisabled(['ReplsDelLine', 'ReplsCopyLine'], false);
        }
        else {
            this.props.button.setButtonDisabled(['ReplsDelLine', 'ReplsCopyLine'], true);
        }
    }

    doAfterSelectPos = () => {
        let checkedRows = this.props.cardTable.getCheckedRows(AREA.bompos)

        if (checkedRows.length > 0) {
            this.props.button.setButtonDisabled(['PosDelLine', 'PosCopyLine'], false);
        }
        else {
            this.props.button.setButtonDisabled(['PosDelLine', 'PosCopyLine'], true);
        }
    }

    doAfterSelectLoss = () => {
        let checkedRows = this.props.cardTable.getCheckedRows(AREA.bomloss)

        if (checkedRows.length > 0) {
            this.props.button.setButtonDisabled(['LossDelLine', 'LossCopyLine'], false);
        }
        else {
            this.props.button.setButtonDisabled(['LossDelLine', 'LossCopyLine'], true);
        }
    }


    doDeleteWips = (props, index) => {
        let selectedRows = props.cardTable.getCheckedRows(AREA.bomwips);
        let selectedIndex = [];
        selectedRows.forEach(item => {
            selectedIndex.push(item.index);
        });
        props.cardTable.delRowsByIndex(AREA.bomwips, selectedIndex);

        this.props.cardTable.selectAllRows(AREA.bomwips, false)
        props.button.setButtonDisabled(['WipsDelLine', 'WipsCopyLine'], true)
        let count = props.cardTable.getNumberOfRows(AREA.bomwips)
        if (count >= 1) {
            props.button.setButtonDisabled(['WipsResetRow'], false)
        } else {
            props.button.setButtonDisabled(['WipsResetRow'], true)
        }
    }

    doDeleteRepls = (props, index) => {
        let selectedRows = props.cardTable.getCheckedRows(AREA.bomrepls);
        let selectedIndex = [];
        selectedRows.forEach(item => {
            selectedIndex.push(item.index);
        });
        props.cardTable.delRowsByIndex(AREA.bomrepls, selectedIndex);

        this.props.cardTable.selectAllRows(AREA.bomrepls, false)
        props.button.setButtonDisabled(['ReplsDelLine', 'ReplsCopyLine'], true)
        let count = props.cardTable.getNumberOfRows(AREA.bomrepls)
        if (count >= 1) {
            props.button.setButtonDisabled(['ReplsResetRow'], false)
        } else {
            props.button.setButtonDisabled(['ReplsResetRow'], true)
        }
    }

    doDeletePos = (props, index) => {
        let selectedRows = props.cardTable.getCheckedRows(AREA.bompos);
        let selectedIndex = [];
        selectedRows.forEach(item => {
            selectedIndex.push(item.index);
        });
        props.cardTable.delRowsByIndex(AREA.bompos, selectedIndex);

        this.props.cardTable.selectAllRows(AREA.bompos, false)
        props.button.setButtonDisabled(['PosDelLine', 'PosCopyLine'], true)
        let count = props.cardTable.getNumberOfRows(AREA.bompos)
        if (count >= 1) {
            props.button.setButtonDisabled(['PosResetRow'], false)
        } else {
            props.button.setButtonDisabled(['PosResetRow'], true)
        }
    }

    doDeleteLoss = (props, index) => {
        let selectedRows = props.cardTable.getCheckedRows(AREA.bomloss);
        let selectedIndex = [];
        selectedRows.forEach(item => {
            selectedIndex.push(item.index);
        });
        props.cardTable.delRowsByIndex(AREA.bomloss, selectedIndex);

        this.props.cardTable.selectAllRows(AREA.bomloss, false)
        props.button.setButtonDisabled(['LossDelLine', 'LossCopyLine'], true)
        let count = props.cardTable.getNumberOfRows(AREA.bomloss)
        if (count >= 1) {
            props.button.setButtonDisabled(['LossResetRow'], false)
        } else {
            props.button.setButtonDisabled(['LossResetRow'], true)
        }
    }

    doDeleteHereWips = (props, index) => {
        props.cardTable.delRowsByIndex(AREA.bomwips, index);

        this.props.cardTable.selectAllRows(AREA.bomwips, false)
        props.button.setButtonDisabled(['WipsDelLine', 'WipsCopyLine'], true)
        let count = props.cardTable.getNumberOfRows(AREA.bomwips)
        if (count >= 1) {
            props.button.setButtonDisabled(['WipsResetRow'], false)
        } else {
            props.button.setButtonDisabled(['WipsResetRow'], true)
        }
    }

    doDeleteHereRepls = (props, index) => {
        props.cardTable.delRowsByIndex(AREA.bomrepls, index);

        this.props.cardTable.selectAllRows(AREA.bomrepls, false)
        props.button.setButtonDisabled(['ReplsDelLine', 'ReplsCopyLine'], true)
        let count = props.cardTable.getNumberOfRows(AREA.bomrepls)
        if (count >= 1) {
            props.button.setButtonDisabled(['ReplsResetRow'], false)
        } else {
            props.button.setButtonDisabled(['ReplsResetRow'], true)
        }
    }

    doDeleteHerePos = (props, index) => {
        props.cardTable.delRowsByIndex(AREA.bompos, index);

        this.props.cardTable.selectAllRows(AREA.bompos, false)
        props.button.setButtonDisabled(['PosDelLine', 'PosCopyLine'], true)
        let count = props.cardTable.getNumberOfRows(AREA.bompos)
        if (count >= 1) {
            props.button.setButtonDisabled(['PosResetRow'], false)
        } else {
            props.button.setButtonDisabled(['PosResetRow'], true)
        }
    }

    doDeleteHereLoss = (props, index) => {
        props.cardTable.delRowsByIndex(AREA.bomloss, index);

        this.props.cardTable.selectAllRows(AREA.bomloss, false)
        props.button.setButtonDisabled(['LossDelLine', 'LossCopyLine'], true)
        let count = props.cardTable.getNumberOfRows(AREA.bomloss)
        if (count >= 1) {
            props.button.setButtonDisabled(['LossResetRow'], false)
        } else {
            props.button.setButtonDisabled(['LossResetRow'], true)
        }
    }

    wipsMore = (props, record, index) => {
        if (props.cardTable.getStatus(AREA.bomwips) == 'browse') {
            props.cardTable.toggleRowView(AREA.bomwips, record)
        } else {
            props.cardTable.openModel(AREA.bomwips, "edit", record, index);
        }
    }

    replsMore = (props, record, index) => {
        if (props.cardTable.getStatus(AREA.bomrepls) == 'browse') {
            props.cardTable.toggleRowView(AREA.bomrepls, record)
        } else {
            props.cardTable.openModel(AREA.bomrepls, "edit", record, index);
        }
    }

    posMore = (props, record, index) => {
        if (props.cardTable.getStatus(AREA.bompos) == 'browse') {
            props.cardTable.toggleRowView(AREA.bompos, record)
        } else {
            props.cardTable.openModel(AREA.bompos, "edit", record, index);
        }
    }

    lossMore = (props, record, index) => {
        if (props.cardTable.getStatus(AREA.bomloss) == 'browse') {
            props.cardTable.toggleRowView(AREA.bomloss, record)
        } else {
            props.cardTable.openModel(AREA.bomloss, "edit", record, index);
        }
    }

    doInsertWips = (props, childindex, index) => {
        this.doAfterAddWip(props, childindex, index)
    }

    doInsertRepls = (props, childindex, index) => {
        this.doAfterAddRepl(props, childindex, index)
    }

    doInsertPos = (props, childindex, index) => {
        this.doAfterAddPos(props, childindex, index)
    }

    doInsertLoss = (props, childindex, index) => {
        this.doAfterAddLoss(childindex, index)
    }

    doCopyWips = (props, index) => {
        let selectedRow = props.cardTable.getCheckedRows(AREA.bomwips);
        if (selectedRow == null || selectedRow.length == 0) {
            toast({
                color: "warning",
                content: this.state.json["110140BOMM3010"]  //请选择数据！
            })
            return;
        }


        this.props.button.setButtonVisible(['WipsAddLine', 'WipsInsertLine', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow', 'WipsDelLineOpr', 'WipsMore'], false)
        this.props.button.setButtonVisible(['WipsPasteLine', 'WipsPasteLineEnd', 'WipsPasteLineCancel'], true)
        this.props.cardTable.setAllCheckboxAble(AREA.bomwips, false)
    }

    doCopyRepls = (props, index) => {
        let selectedRow = props.cardTable.getCheckedRows(AREA.bomrepls);
        if (selectedRow == null || selectedRow.length == 0) {
            toast({
                color: "warning",
                content: this.state.json["110140BOMM3010"]  //请选择数据！
            })
            return;
        }

        this.props.button.setButtonVisible(['ReplsAddLine', 'ReplsInsertLine', 'ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow', 'ReplsDelLineOpr', 'ReplsMore'], false)
        this.props.button.setButtonVisible(['ReplsPasteLine', 'ReplsPasteLineEnd', 'ReplsPasteLineCancel'], true)
        this.props.cardTable.setAllCheckboxAble(AREA.bomrepls, false)
    }

    doCopyPos = (props, index) => {
        let selectedRow = props.cardTable.getCheckedRows(AREA.bompos);
        if (selectedRow == null || selectedRow.length == 0) {
            toast({
                color: "warning",
                content: this.state.json["110140BOMM3010"]  //请选择数据！
            })
            return;
        }

        this.props.button.setButtonVisible(['PosAddLine', 'PosInsertLine', 'PosDelLine', 'PosCopyLine', 'PosResetRow', 'PosDelLineOpr', 'PosMore'], false)
        this.props.button.setButtonVisible(['PosPasteLine', 'PosPasteLineEnd', 'PosPasteLineCancel'], true)
        this.props.cardTable.setAllCheckboxAble(AREA.bompos, false)
    }

    doCopyLoss = (props, index) => {
        let selectedRow = props.cardTable.getCheckedRows(AREA.bomloss);
        if (selectedRow == null || selectedRow.length == 0) {
            toast({
                color: "warning",
                content: this.state.json["110140BOMM3010"]  //请选择数据！
            })
            return;
        }

        this.props.button.setButtonVisible(['LossAddLine', 'LossInsertLine', 'LossDelLine', 'LossCopyLine', 'LossResetRow', 'LossDelLineOpr', 'LossMore'], false)
        this.props.button.setButtonVisible(['LossPasteLine', 'LossPasteLineEnd', 'LossPasteLineCancel'], true)
        this.props.cardTable.setAllCheckboxAble(AREA.bomloss, false)
    }

    cancelCopyWips = (props, index) => {
        this.props.button.setButtonVisible(['WipsAddLine', 'WipsInsertLine', 'WipsDelLine', 'WipsCopyLine', 'WipsResetRow', 'WipsDelLineOpr', 'WipsMore'], true)
        this.props.button.setButtonVisible(['WipsPasteLine', 'WipsPasteLineEnd', 'WipsPasteLineCancel'], false)
        this.props.cardTable.setAllCheckboxAble(AREA.bomwips, true)
        this.props.cardTable.selectAllRows(AREA.bomwips, false)
        this.props.button.setButtonDisabled(['WipsDelLine', 'WipsCopyLine'], true)
    }

    cancelCopyRepls = (props, index) => {
        this.props.button.setButtonVisible(['ReplsAddLine', 'ReplsInsertLine', 'ReplsDelLine', 'ReplsCopyLine', 'ReplsResetRow', 'ReplsDelLineOpr', 'ReplsMore'], true)
        this.props.button.setButtonVisible(['ReplsPasteLine', 'ReplsPasteLineEnd', 'ReplsPasteLineCancel'], false)
        this.props.cardTable.setAllCheckboxAble(AREA.bomrepls, true)
        this.props.cardTable.selectAllRows(AREA.bomrepls, false)
        this.props.button.setButtonDisabled(['ReplsDelLine', 'ReplsCopyLine'], true)
    }

    cancelCopyPos = (props, index) => {
        this.props.button.setButtonVisible(['PosAddLine', 'PosInsertLine', 'PosDelLine', 'PosCopyLine', 'PosResetRow', 'PosDelLineOpr', 'PosMore'], true)
        this.props.button.setButtonVisible(['PosPasteLine', 'PosPasteLineEnd', 'PosPasteLineCancel'], false)
        this.props.cardTable.setAllCheckboxAble(AREA.bompos, true)
        this.props.cardTable.selectAllRows(AREA.bompos, false)
        this.props.button.setButtonDisabled(['PosDelLine', 'PosCopyLine'], true)
    }

    cancelCopyLoss = (props, index) => {
        this.props.button.setButtonVisible(['LossAddLine', 'LossInsertLine', 'LossDelLine', 'LossCopyLine', 'LossResetRow', 'LossDelLineOpr', 'LossMore'], true)
        this.props.button.setButtonVisible(['LossPasteLine', 'LossPasteLineEnd', 'LossPasteLineCancel'], false)
        this.props.cardTable.setAllCheckboxAble(AREA.bomloss, true)
        this.props.cardTable.selectAllRows(AREA.bomloss, false)
        this.props.button.setButtonDisabled(['LossDelLine', 'LossCopyLine'], true)
    }

    pasteToTailWips = (props, index) => {
        this.setState({
            copyRowDatas: props.cardTable.getCheckedRows(AREA.bomwips)
        }, () => {
            rowCopyPasteUtils.pasteRowsToTail.call(
                this,
                props,
                AREA.bomwips,
                [], [], ['g_irowno', 'cbom_wipid', 'ts']
            );


            RownoUtils.setRowNo(props, AREA.bomwips, "g_irowno");

            this.cancelCopyWips(props, index)
            if (props.cardTable.getNumberOfRows(AREA.bomwips) >= 1) {
                props.button.setButtonDisabled(['WipsResetRow'], false)
            } else {
                props.button.setButtonDisabled(['WipsResetRow'], true)
            }
        })

    }

    pasteToTailRepls = (props, index) => {
        this.setState({
            copyRowDatas: props.cardTable.getCheckedRows(AREA.bomrepls)
        }, () => {
            rowCopyPasteUtils.pasteRowsToTail.call(
                this,
                props,
                AREA.bomrepls,
                [], [], ['vrowno', 'cbom_replaceid', 'ts']
            );


            RownoUtils.setRowNo(props, AREA.bomrepls, "vrowno");

            this.cancelCopyRepls(props, index)
            if (props.cardTable.getNumberOfRows(AREA.bomrepls) >= 1) {
                props.button.setButtonDisabled(['ReplsResetRow'], false)
            } else {
                props.button.setButtonDisabled(['ReplsResetRow'], true)
            }
        })

    }

    pasteToTailPos = (props, index) => {
        this.setState({
            copyRowDatas: props.cardTable.getCheckedRows(AREA.bompos)
        }, () => {
            rowCopyPasteUtils.pasteRowsToTail.call(
                this,
                props,
                AREA.bompos,
                [], [], ['g_irowno', 'cbom_positionid', 'ts']
            );


            RownoUtils.setRowNo(props, AREA.bompos, "g_irowno");

            this.cancelCopyPos(props, index)
            if (props.cardTable.getNumberOfRows(AREA.bompos) >= 1) {
                props.button.setButtonDisabled(['PosResetRow'], false)
            } else {
                props.button.setButtonDisabled(['PosResetRow'], true)
            }
        })

    }

    pasteToTailLoss = (props, index) => {
        this.setState({
            copyRowDatas: props.cardTable.getCheckedRows(AREA.bomloss)
        }, () => {
            rowCopyPasteUtils.pasteRowsToTail.call(
                this,
                props,
                AREA.bomloss,
                [], [], ['vlrowno', 'cbom_lossid', 'ts']
            );


            RownoUtils.setRowNo(props, AREA.bomloss, "vlrowno");

            this.cancelCopyLoss(props, index)
            if (props.cardTable.getNumberOfRows(AREA.bomloss) >= 1) {
                props.button.setButtonDisabled(['LossResetRow'], false)
            } else {
                props.button.setButtonDisabled(['LossResetRow'], true)
            }
        })

    }

    pasteToHereWips = (props, index) => {
        this.setState({
            copyRowDatas: props.cardTable.getCheckedRows(AREA.bomwips)
        }, () => {
            rowCopyPasteUtils.pasteRowsToIndex.call(
                this,
                props,
                AREA.bomwips,
                index,
                [], [], ['g_irowno', 'cbom_wipid', 'ts']
            );


            RownoUtils.setRowNo(props, AREA.bomwips, "g_irowno");

            this.cancelCopyWips(props, index)
            if (props.cardTable.getNumberOfRows(AREA.bomwips) >= 1) {
                props.button.setButtonDisabled(['WipsResetRow'], false)
            } else {
                props.button.setButtonDisabled(['WipsResetRow'], true)
            }
        })

    }

    pasteToHereRepls = (props, index) => {
        this.setState({
            copyRowDatas: props.cardTable.getCheckedRows(AREA.bomrepls)
        }, () => {
            rowCopyPasteUtils.pasteRowsToIndex.call(
                this,
                props,
                AREA.bomrepls,
                index,
                [], [], ['vrowno', 'cbom_replaceid', 'ts']
            );


            RownoUtils.setRowNo(props, AREA.bomrepls, "vrowno");

            this.cancelCopyRepls(props, index)
            if (props.cardTable.getNumberOfRows(AREA.bomrepls) >= 1) {
                props.button.setButtonDisabled(['ReplsResetRow'], false)
            } else {
                props.button.setButtonDisabled(['ReplsResetRow'], true)
            }
        })

    }

    pasteToHerePos = (props, index) => {
        this.setState({
            copyRowDatas: props.cardTable.getCheckedRows(AREA.bompos)
        }, () => {
            rowCopyPasteUtils.pasteRowsToIndex.call(
                this,
                props,
                AREA.bompos,
                index,
                [], [], ['g_irowno', 'cbom_positionid', 'ts']
            );


            RownoUtils.setRowNo(props, AREA.bompos, "g_irowno");

            this.cancelCopyPos(props, index)
            if (props.cardTable.getNumberOfRows(AREA.bompos) >= 1) {
                props.button.setButtonDisabled(['PosResetRow'], false)
            } else {
                props.button.setButtonDisabled(['PosResetRow'], true)
            }
        })

    }

    pasteToHereLoss = (props, index) => {
        this.setState({
            copyRowDatas: props.cardTable.getCheckedRows(AREA.bomloss)
        }, () => {
            rowCopyPasteUtils.pasteRowsToIndex.call(
                this,
                props,
                AREA.bomloss,
                index,
                [], [], ['vlrowno', 'cbom_lossid', 'ts']
            );


            RownoUtils.setRowNo(props, AREA.bomloss, "vlrowno");

            this.cancelCopyLoss(props, index)
            if (props.cardTable.getNumberOfRows(AREA.bomloss) >= 1) {
                props.button.setButtonDisabled(['LossResetRow'], false)
            } else {
                props.button.setButtonDisabled(['LossResetRow'], true)
            }
        })

    }

    wipsResetRow = (props, index) => {
        RownoUtils.resetRowNo(this.props, AREA.bomwips, "g_irowno");
        props.selectAllRows(AREA.bomwips, false)
    }

    replsResetRow = (props, index) => {
        RownoUtils.resetRowNo(this.props, AREA.bomrepls, "vrowno");
        props.selectAllRows(AREA.bomwips, false)
    }

    posResetRow = (props, index) => {
        RownoUtils.resetRowNo(this.props, AREA.bomwips, "g_irowno");
        props.selectAllRows(AREA.bomwips, false)
    }

    lossResetRow = (props, index) => {
        RownoUtils.resetRowNo(this.props, AREA.bomwips, "vlrowno");
        props.selectAllRows(AREA.bomwips, false)
    }


    onWipCardTableBeforeEvent = (props, moduleId, key, value, index, record, status) => {
        if (key == 'pk_org') {
            props.meta.getMeta()[AREA.bomwips].items.map((item) => {
                if (item.attrcode == 'pk_org') {
                    item.isMultiSelectedEnabled = false
                    let cbomid = ''
                    if (props.parent.rows[0].values['cbomid'] && props.parent.rows[0].values['cbomid'].value) {
                        cbomid = props.parent.rows[0].values['cbomid'].value
                    }
                    props.cardTable.setQueryCondition(AREA.bomwips, {
                        pk_org: () => {

                            return {
                                'pk_org': props.parent.rows[0].values['pk_org'].value,
                                'cbomid': cbomid,
                                GridRefActionExt: 'nccloud.web.mmbd.refer.bom.StockorgQueryFilter'
                            }
                        }
                    })
                    // item.queryCondition = () => {
                    //     return {
                    //         'pk_org': props.parent.rows[0].values['pk_org'].value,
                    //         'cbomid': cbomid,
                    //         GridRefActionExt: 'nccloud.web.mmbd.refer.bom.StockorgQueryFilter'
                    //     }
                    // }
                }
            })
        }

        if (key == 'cwipid') {
            props.meta.getMeta()[AREA.bomwips].items.map((item) => {
                if (item.attrcode == 'cwipid') {
                    item.isMultiSelectedEnabled = false
                    let wip_pkorg = ''
                    if (record.values['pk_org'] && record.values['pk_org'].value) {
                        wip_pkorg = record.values['pk_org'].value
                    }
                    props.cardTable.setQueryCondition(AREA.bomwips, {
                        cwipid: () => {
                            return {
                                'pk_group': props.parent.rows[0].values['pk_group'].value,
                                'pk_org': wip_pkorg,
                                GridRefActionExt: 'nccloud.web.mmbd.refer.bom.StordocQueryFilter'
                            }
                        }
                    })
                    // item.queryCondition = () => {
                    //     return {
                    //         'pk_group': props.parent.rows[0].values['pk_group'].value,
                    //        'pk_org':   wip_pkorg,
                    //        GridRefActionExt: 'nccloud.web.mmbd.refer.bom.StordocQueryFilter'
                    //     }
                    // }
                }
            })

        }
        return true;
    }

    onWipCardTableAfterEvent = (props, moduleId, key, value, changedrows, index, record) => {
        if (key == 'pk_org') {
            changedrows.map((item) => {
                if (item.newvalue.value != item.oldvalue.value) {
                    props.cardTable.setValByKeyAndIndex(AREA.bomwips, index, 'cwipid', { value: null, display: null })
                    props.cardTable.setValByKeyAndIndex(AREA.bomwips, index, 'cwipid.name', { value: null, display: null })
                    props.cardTable.setValByKeyAndIndex(AREA.bomwips, index, 'nnum', { value: null, display: null })
                }
            })
        }
        if (key == 'cwipid') {
            changedrows.map((item) => {
                if (item.newvalue.value == null || item.newvalue.value == '') {
                    props.cardTable.setValByKeyAndIndex(AREA.bomwips, index, 'cwipid.name', { value: null, display: null })
                } else {
                    props.cardTable.setValByKeyAndIndex(AREA.bomwips, index, 'cwipid.name', { value: value.refname, display: value.refname })
                }
            })

        }
        let pindex = props.cardTable.getClickRowIndex(AREA.bomcarditem) ? props.cardTable.getClickRowIndex(AREA.bomcarditem).index : -1;
        let currows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, pindex);
        currows[0].bomwips = { rows: props.cardTable.getAllRows(AREA.bomwips) }
    }


    onPosCardTableBeforeEvent = (props, moduleId, key, value, index, record, status) => {
        return true
    }

    onPosCardTableAfterEvent = (props, moduleId, key, value, changedrows, index, record) => {
        let pindex = props.cardTable.getClickRowIndex(AREA.bomcarditem) ? props.cardTable.getClickRowIndex(AREA.bomcarditem).index : -1;
        let currows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, pindex);
        currows[0].bompos = { rows: props.cardTable.getAllRows(AREA.bompos) }
    }

    onReplsCardTableBeforeEvent = (props, moduleId, key, value, index, record, status) => {
        if (key == 'creplmaterialvid') {
            props.meta.getMeta()[AREA.bomrepls].items.map((item) => {
                if (item.attrcode == 'creplmaterialvid') {
                    item.isDataPowerEnable = false
                    item.isMultiSelectedEnabled = true
                    props.cardTable.setQueryCondition(AREA.bomrepls, {
                        creplmaterialvid: () => {
                            return {
                                'pk_org': props.parent.rows[0].values['pk_org'].value,
                                'hbcustomized': props.parent.rows[0].values['hbcustomized'].value,
                                'fbomtype': props.parent.rows[0].values['fbomtype'].value,
                                GridRefActionExt: 'nccloud.web.mmbd.refer.query.ReplsMaterialQueryFilter'
                            }
                        }
                    })
                    // item.queryCondition = () => {
                    //     return {
                    //         'pk_org': props.parent.rows[0].values['pk_org'].value,
                    //         'hbcustomized': props.parent.rows[0].values['hbcustomized'].value,
                    //         'fbomtype':  props.parent.rows[0].values['fbomtype'].value,
                    //         GridRefActionExt: 'nccloud.web.mmbd.refer.query.ReplsMaterialQueryFilter'
                    //     }
                    // }
                }
            })
        }

        if (key == 'vprodversion') {
            props.meta.getMeta()[AREA.bomrepls].items.map((item) => {
                if (item.attrcode == 'vprodversion') {
                    item.isDataPowerEnable = false
                    item.isMultiSelectedEnabled = false
                    props.cardTable.setQueryCondition(AREA.bomrepls, {
                        vprodversion: () => {
                            return {
                                'pk_group': props.parent.rows[0].values['pk_group'].value,
                                'pk_org': props.parent.rows[0].values['pk_org'].value,
                                'hcmaterialid': props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'creplmaterialoid').value,
                                'hcmaterialvid': props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'creplmaterialvid').value,
                                'fbomtype': '1'
                            }
                        }
                    })
                    // item.queryCondition = () => {
                    //     return {
                    //         'pk_group': props.parent.rows[0].values['pk_group'].value,
                    //         'pk_org': props.parent.rows[0].values['pk_org'].value,
                    //         'hcmaterialid': props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'creplmaterialoid').value,
                    //         'hcmaterialvid': props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'creplmaterialvid').value,
                    //         'fbomtype': '1'
                    //     }
                    // }
                }
            })
        }

        if (key == 'vpackversion') {
            props.meta.getMeta()[AREA.bomrepls].items.map((item) => {
                if (item.attrcode == 'vpackversion') {
                    item.isDataPowerEnable = false
                    item.isMultiSelectedEnabled = false
                    props.cardTable.setQueryCondition(AREA.bomrepls, {
                        vpackversion: () => {
                            return {
                                'pk_group': props.parent.rows[0].values['pk_group'].value,
                                'pk_org': props.parent.rows[0].values['pk_org'].value,
                                'hcmaterialid': props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'creplmaterialoid').value,
                                'hcmaterialvid': props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'creplmaterialvid').value,
                                'fbomtype': '2'
                            }
                        }
                    })
                    // item.queryCondition = () => {
                    //     return {
                    //         'pk_group': props.parent.rows[0].values['pk_group'].value,
                    //         'pk_org': props.parent.rows[0].values['pk_org'].value,
                    //         'hcmaterialid': props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'creplmaterialoid').value,
                    //         'hcmaterialvid': props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'creplmaterialvid').value,
                    //         'fbomtype': '2'
                    //     }
                    // }
                }
            })
        }

        return true
    }

    onReplsCardTableAfterEvent = (props, moduleId, key, value, changedrows, index, record) => {
        if (key == 'creplmaterialvid') {
            let k = 0
            let creplmaterialvids = []
            changedrows.map((item) => {
                if (item.newvalue.value == null || item.newvalue.value == '') {
                    props.cardTable.setValByKeyAndIndex(AREA.bomrepls, index + k, 'creplmaterialoid', { value: null, display: null })
                    props.cardTable.setValByKeyAndIndex(AREA.bomrepls, index + k, 'creplmaterialvid.name', { value: null, display: null })
                    props.cardTable.setValByKeyAndIndex(AREA.bomrepls, index + k, 'creplmaterialvid.version', { value: null, display: null })
                    props.cardTable.setValByKeyAndIndex(AREA.bomrepls, index + k, 'creplmaterialvid.materialspec', { value: null, display: null })
                    props.cardTable.setValByKeyAndIndex(AREA.bomrepls, index + k, 'creplmaterialvid.materialtype', { value: null, display: null })
                    props.cardTable.setValByKeyAndIndex(AREA.bomrepls, index + k, 'vprodversion', { value: null, display: null })
                    props.cardTable.setValByKeyAndIndex(AREA.bomrepls, index + k, 'vpackversion', { value: null, display: null })
                    props.cardTable.setEditableByIndex(AREA.bomrepls, index + k, ['vprodversion', 'vpackversion'], true)
                    props.cardTable.setEditableByIndex(AREA.bomrepls, index + k, ['ccustomerid', 'cvendorid', 'cproductorid', 'cprojectid'], false)
                    k++
                } else {
                    creplmaterialvids.push(item.newvalue.value)
                }
            })
            // let startrowno = props.cardTable.getValByKeyAndIndex(AREA.bomrepls, index, 'vrowno').value

            if (creplmaterialvids.length > 0) {
                if (creplmaterialvids.length >= 1) {
                    for (let i = 1; i < creplmaterialvids.length; i++) {
                        props.cardTable.setValByKeyAndIndex(AREA.bomrepls, index, 'vrowno', { value: null, display: null })
                        let newrepldata = (props.cardTable.getRowsByIndexs(AREA.bomrepls, index))[0].values

                        props.cardTable.addRow(AREA.bomrepls, index, newrepldata)
                    }
                }
                RownoUtils.setRowNo(props, AREA.bomrepls, 'vrowno')
                let data = { 'creplmaterialvid': creplmaterialvids }
                ajax({
                    url: '/nccloud/mmbd/bom0202/bomReplsAfterEvent.do',
                    data,
                    success: res => {
                        if (res.data) {
                            console.log(res.data)
                            for (let i = 0; i < creplmaterialvids.length; i++) {
                                let materialinfo = JSON.parse(res.data[i])
                                let newrowdata = {}
                                for (let key in materialinfo) {
                                    if (key == 'creplmaterialvid') {
                                        newrowdata[key] = { value: materialinfo[key], display: materialinfo['creplmaterialvid.code'] }
                                    } else {
                                        newrowdata[key] = { value: materialinfo[key], display: materialinfo[key] }
                                    }
                                }

                                this.props.cardTable.setValByKeysAndIndex(AREA.bomrepls, index + i, newrowdata)
                                this.props.cardTable.setEditableByIndex(AREA.bomrepls, index + k, ['vprodversion', 'vpackversion', 'ccustomerid', 'cvendorid', 'cproductorid', 'cprojectid'], true)
                            }
                        }
                    }
                })
            }
        }
        let pindex = props.cardTable.getClickRowIndex(AREA.bomcarditem) ? props.cardTable.getClickRowIndex(AREA.bomcarditem).index : -1;
        let currows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, pindex);
        currows[0].bomrepls = { rows: props.cardTable.getAllRows(AREA.bomrepls) }
    }

    onLossCardTableBeforeEvent = (props, moduleId, key, value, index, record, status) => {

        return true
    }

    onLossCardTableAfterEvent = (props, moduleId, key, value, changedrows, index, record) => {
        if (key == 'nlfromnum'
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitid').value
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitastid').value
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'vlchangerate').value) {   //产品主数量下限
            if (value) {
                ajax({
                    url: '/nccloud/mmbd/bom0202/nlfromnumevent.do',
                    data: {
                        nlfromnum: Number(value),
                        clunitid: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitid').value,
                        clunitastid: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitastid').value,
                        vlchangerate: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'vlchangerate').value
                    },
                    success: res => {
                        if (res.success) {
                            if (res.data) {
                                console.log(res.data);
                                this.props.cardTable.setValByKeyAndIndex(AREA.bomloss, index, 'nlfromastnum', { value: Number(res.data.nlfromastnum) });
                            }
                        }
                    }
                });
            }
        }

        if (key == 'nlfromastnum' && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitid').value
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitastid').value
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'vlchangerate').value) {    //产品数量下限
            if (value) {
                ajax({
                    url: '/nccloud/mmbd/bom0202/nlfromastnumevent.do',
                    data: {
                        nlfromastnum: Number(value),
                        clunitid: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitid').value,
                        clunitastid: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitastid').value,
                        vlchangerate: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'vlchangerate').value
                    },
                    success: res => {
                        if (res.success) {
                            if (res.data) {
                                console.log(res.data);
                                this.props.cardTable.setValByKeyAndIndex(AREA.bomloss, index, 'nlfromnum', { value: Number(res.data.nlfromnum) });
                            }
                        }
                    }
                });
            }
        }

        if (key == 'nltonum' && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitid').value
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitastid').value
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'vlchangerate').value) {     //产品主数量上限
            if (value) {
                ajax({
                    url: '/nccloud/mmbd/bom0202/nltonumevent.do',
                    data: {
                        nltonum: Number(value),
                        clunitid: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitid').value,
                        clunitastid: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitastid').value,
                        vlchangerate: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'vlchangerate').value
                    },
                    success: res => {
                        if (res.success) {
                            if (res.data) {
                                console.log(res.data);
                                this.props.cardTable.setValByKeyAndIndex(AREA.bomloss, index, 'nltoastnum', { value: Number(res.data.nltoastnum) });
                            }
                        }
                    }
                });
            }
        }

        if (key == 'nltoastnum' && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitid').value
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitastid').value
            && props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'vlchangerate').value) {      //产品数量上限
            if (value) {
                ajax({
                    url: '/nccloud/mmbd/bom0202/nltoastnumevent.do',
                    data: {
                        nltoastnum: Number(value),
                        clunitid: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitid').value,
                        clunitastid: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'clunitastid').value,
                        vlchangerate: props.cardTable.getValByKeyAndIndex(AREA.bomloss, index, 'vlchangerate').value
                    },
                    success: res => {
                        if (res.success) {
                            if (res.data) {
                                console.log(res.data);
                                this.props.cardTable.setValByKeyAndIndex(AREA.bomloss, index, 'nltonum', { value: Number(res.data.nltonum) });
                            }
                        }
                    }
                });
            }
        }
        let pindex = props.cardTable.getClickRowIndex(AREA.bomcarditem) ? props.cardTable.getClickRowIndex(AREA.bomcarditem).index : -1;
        let currows = props.cardTable.getRowsByIndexs(AREA.bomcarditem, pindex);
        currows[0].bomloss = { rows: props.cardTable.getAllRows(AREA.bomloss) }
    }

    //获取列表肩部信息
    getWipsTableHead = () => {
        let {
            button
        } = this.props;
        let {
            createButtonApp
        } = button;
        let buttons = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (<div className="shoulder-definition-area" >
            <div className="definition-icons"
                style={
                    {
                        padding: "0px"
                    }
                } > {
                    createButtonApp({
                        area: "wips-action", //按钮注册中的按钮区域
                        onButtonClick: this.buttonClick.bind(this)
                    })
                } {
                    this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ["close", "open", "max", "setCol"],
                        maxDestAREAId: "nc-bill-card"
                    })
                } </div> </div>
        );
    };

    //获取列表肩部信息
    getReplsTableHead = () => {
        let {
            button
        } = this.props;
        let {
            createButtonApp
        } = button;
        let buttons = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (<div className="shoulder-definition-area" >
            <div className="definition-icons"
                style={
                    {
                        padding: "0px"
                    }
                } > {
                    createButtonApp({
                        area: "repls-action", //按钮注册中的按钮区域
                        onButtonClick: this.buttonClick.bind(this)
                    })
                } {
                    this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ["close", "open", "max", "setCol"],
                        maxDestAREAId: "nc-bill-card"
                    })
                } </div> </div>
        );
    };

    //获取列表肩部信息
    getPosTableHead = () => {
        let {
            button
        } = this.props;
        let {
            createButtonApp
        } = button;
        let buttons = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (<div className="shoulder-definition-area" >
            <div className="definition-icons"
                style={
                    {
                        padding: "0px"
                    }
                } > {
                    createButtonApp({
                        area: "pos-action", //按钮注册中的按钮区域
                        onButtonClick: this.buttonClick.bind(this)
                    })
                } {
                    this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ["close", "open", "max", "setCol"],
                        maxDestAREAId: "nc-bill-card"
                    })
                } </div> </div>
        );
    };

    //获取列表肩部信息
    getLossTableHead = () => {
        let {
            button
        } = this.props;
        let {
            createButtonApp
        } = button;
        let buttons = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (<div className="shoulder-definition-area" >
            <div className="definition-icons"
                style={
                    {
                        padding: "0px"
                    }
                } > {
                    createButtonApp({
                        area: "loss-action", //按钮注册中的按钮区域
                        onButtonClick: this.buttonClick.bind(this)
                    })
                } {
                    this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ["close", "open", "max", "setCol"],
                        maxDestAREAId: "nc-bill-card"
                    })
                } </div> </div>
        );
    };

    render() {
        let { cardTable, button } = this.props;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        if (this.props.rows)
            this.props.cardTable.setTableData(AREA.bomcarditem, this.props.rows);
        if (this.props.parent) {
            console.log({ 'render-parent': this.props.parent })
        }
        return (
            <NCModal id="ChanNeng" size="xlg"
                show={this.props.show}
                onHide={this.props.onHide}
                zIndex={211}>
                <NCModal.Header closeButton>
                    <NCModal.Title>{this.state.json ? this.state.json['110140BOMM4004'] : '110140BOMM4004'}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div>

                        <div className="nc-bill-table-area noMax">
                            {createCardTable(AREA.bomcarditem, {
                                //tableHead: this.getTableHead.bind(this),
                                //onTabChange: this.onTabChange.bind(this),
                                // modelSave: this.modelSave.bind(this),
                                // onBeforeEvent: this.onCardTableBeforeEvent.bind(this),
                                // onAfterEvent: this.onCardTableAfterEvent.bind(this),
                                //showIndex: true,
                                showCheck: false,
                                onRowClick: this.onRowClick.bind(this),
                                // openMaxTable:this.openMaxTable.bind(this),
                                showMax: false,
                                hideSwitch: () => { return false },
                                showMore: false
                                //sisAddRow: true,
                            })}
                        </div>
                        <div className="nc-bill-table-area noMax">
                            {createCardTable(AREA.bomwips, {
                                tableHead: this.getWipsTableHead.bind(this),
                                //onTabChange: this.onTabChange.bind(this),
                                hideModelSave: true,
                                modelAddRow: this.wipsModalAddRow.bind(this),
                                onBeforeEvent: this.onWipCardTableBeforeEvent.bind(this),
                                onAfterEvent: this.onWipCardTableAfterEvent.bind(this),
                                //showIndex: true,
                                showMax: false,
                                showCheck: true,
                                showMore: false,
                                hideSwitch: () => { return false },
                                onSelected: this.doAfterSelectWips.bind(this),
                                onSelectedAll: this.doAfterSelectWips.bind(this)
                                //sisAddRow: true,
                            })}
                        </div>
                        <div className="nc-bill-table-area noMax">
                            {createCardTable(AREA.bompos, {
                                tableHead: this.getPosTableHead.bind(this),
                                //onTabChange: this.onTabChange.bind(this),
                                hideModelSave: true,
                                showMax: false,
                                modelAddRow: this.posModalAddRow.bind(this),
                                onBeforeEvent: this.onPosCardTableBeforeEvent.bind(this),
                                onAfterEvent: this.onPosCardTableAfterEvent.bind(this),
                                //showIndex: true,
                                showCheck: true,
                                showMore: false,
                                hideSwitch: () => { return false },
                                onSelected: this.doAfterSelectPos.bind(this),
                                onSelectedAll: this.doAfterSelectPos.bind(this)
                                //sisAddRow: true,
                            })}
                        </div>
                        <div className="nc-bill-table-area noMax">
                            {createCardTable(AREA.bomrepls, {
                                tableHead: this.getReplsTableHead.bind(this),
                                //onTabChange: this.onTabChange.bind(this),
                                hideModelSave: true,
                                modelAddRow: this.replsModalAddRow.bind(this),
                                onBeforeEvent: this.onReplsCardTableBeforeEvent.bind(this),
                                onAfterEvent: this.onReplsCardTableAfterEvent.bind(this),
                                //showIndex: true,
                                showCheck: true,
                                showMax: false,
                                showMore: false,
                                hideSwitch: () => { return false },
                                onSelected: this.doAfterSelectRepls.bind(this),
                                onSelectedAll: this.doAfterSelectRepls.bind(this)
                                //sisAddRow: true,
                            })}
                        </div>
                        <div className="nc-bill-table-area noMax">
                            {createCardTable(AREA.bomloss, {
                                tableHead: this.getLossTableHead.bind(this),
                                //onTabChange: this.onTabChange.bind(this),
                                hideModelSave: true,
                                modelAddRow: this.lossModalAddRow.bind(this),
                                onBeforeEvent: this.onLossCardTableBeforeEvent.bind(this),
                                onAfterEvent: this.onLossCardTableAfterEvent.bind(this),
                                //showIndex: true,
                                showCheck: true,
                                showMax: false,
                                showMore: false,
                                hideSwitch: () => { return false },
                                onSelected: this.doAfterSelectLoss.bind(this),
                                onSelectedAll: this.doAfterSelectLoss.bind(this)
                                //sisAddRow: true,
                            })}
                        </div>
                    </div>
                </NCModal.Body>
                <NCModal.Footer>
                    <NCButton shape="border" colors="primary" onClick={this.props.onConfirm}>{this.state.pubjson ? this.state.pubjson['10140PUBMESSAGE-000029'] : '10140PUBMESSAGE-000029'}</NCButton>
                    <NCButton shape="border" colors="primary" onClick={this.props.onHide} >{this.state.pubjson ? this.state.pubjson['10140PUBMESSAGE-000007'] : '10140PUBMESSAGE-000007'}</NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }
}

PowerTable = createPage({
    billinfo: {
        billtype: 'extcard',
        pagecode: '10140BOMM_grand',
        headcode: 'temp',
        bodycode: [AREA.bomloss, AREA.bomwips, AREA.bomrepls, AREA.bompos]
    }
})(PowerTable);
export default PowerTable

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65