/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
    createPage,
    ajax,
    base,
    high,
    cardCache,
    createPageIcon
} from "nc-lightapp-front";
const { NCDiv } = base;
import { buttonClick, initTemplate } from "./events";
const { PrintOutput } = high;
let pagecode = "36070AILLINK";
let tableId = "table";
class LinkBillList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outputData: {
                oids: [],
                outputType: "output"
            }
        };
    }

    componentDidMount() {
        this.getdata();
    }
    //刷新
    getdata = () => {
        let temppks = this.props.getUrlParam("ids");
        let pks = temppks.split(",");

        ajax({
            url: "/nccloud/cmp/informer/informerpagequery.do",
            data: {
                pks: pks,
                pageid: "36070AI_L01"
            },
            success: res => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(
                            tableId,
                            data[tableId]
                        );
                    } else {
                        this.props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
    };

    render() {
        let { table, button, search, form, BillHeadInfo } = this.props;
        let buttons = this.props.button.getButtons();
        let multiLang = this.props.MutiInit.getIntl(this.moduleId);
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButtonApp } = button;
        let { createForm } = form;
        let { createButton } = button;
        const { createBillHeadInfo } = BillHeadInfo;
        return (
            <div className="nc-bill-list">
                <NCDiv
                    areaCode={NCDiv.config.HEADER}
                    className="nc-bill-header-area"
                >
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:
                                this.props.MutiInit.getIntl("36070AISC") &&
                                this.props.MutiInit.getIntl("36070AISC").get(
                                    "36070AISC-000060"
                                ) /* 国际化处理： 到账通知*/,
                            initShowBackBtn: false
                        })}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: "list_head",
                            buttonLimit: 3,
                            onButtonClick: buttonClick.bind(this)
                        })}
                    </div>
                </NCDiv>
                <div className="nc-bill-table-area">
                    {createSimpleTable(tableId, {
                        // handlePageInfoChange: pageInfoClick,
                        // tableModelConfirm: tableModelConfirm,
                        showCheck: true,
                        showIndex: true
                    })}
                </div>
                <div>
                    <PrintOutput
                        ref="printOutput"
                        url="/nccloud/cmp/pub/print.do"
                        data={this.state.outputData}
                        callback={this.onSubmit}
                    />
                </div>
            </div>
        );
    }
}

LinkBillList = createPage({
    mutiLangCode: "36070AISC",
    initTemplate: initTemplate,
    billinfo: {
        billtype: "grid",
        pagecode: pagecode,
        bodycode: tableId
    }
})(LinkBillList);

ReactDOM.render(<LinkBillList />, document.querySelector("#app"));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/