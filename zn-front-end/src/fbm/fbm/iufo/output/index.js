/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { base, createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import { constant } from "../cons/constant.js";
import {
    buttonClick,
    initTemplate1,
    initTemplate2,
    initTemplate3
} from "../events";
const { NCModal } = base;
const { formId } = constant;

class GuidComponents extends Component {
    constructor(props) {
        super(props);
        let {
            beSureBtnClickCallBack,
            beCancelBtnClickCallBack,
            funcType
        } = this.props;
        this.modalId = "FAIUFOModal"; //模态框id
        this.beSureBtnClickCallBack = beSureBtnClickCallBack; //绑定确定回调事件
        this.beCancelBtnClickCallBack = beCancelBtnClickCallBack; //绑定取消回调事件
        this.funcType = funcType; //函数类型

        /**
         * FBMGATHERDONEMONEY（应收票据实际发生额） ，FBMSIGNDONEMONEY （应付票据实际发生额）
         * 格式示例：
         * 应收票据实际发生额：
         * FBMGATHERDONEMONEY("0001O21000000000320J","FBMTZ6E0000000000001","IN","2019-04-29","2019-04-29","1002Z0100000000001K1",)
         * 应付票据实际发生额：
         * FBMSIGNDONEMONEY("0001O21000000000320J","FBMTZ6E0000000000001","IN","2019-04-29","2019-04-29","1002Z0100000000001K1",)
         */
        this.fanctionType1 = ["FBMGATHERDONEMONEY", "FBMSIGNDONEMONEY"];
        /**
         * FBMGATHERMONEY_DAYBEGIN（应收票据期初余额），
         * FBMGATHERMONEY_DAYEND （应收票据期末余额），
         * FBMSIGNMONEY_DAYBEGIN （应付票据期初余额），
         * FBMSIGNMONEY_DAYEND（应付票据期末余额） ，
         * 格式示例：
         * BMSIGNMONEY_DAYEND("0001O21000000000320J","FBMTZ6E0000000000001","2019-04-29","1002Z0100000000001K1",)
         */
        this.fanctionType2 = [
            "FBMGATHERMONEY_DAYBEGIN",
            "FBMGATHERMONEY_DAYEND",
            "FBMSIGNMONEY_DAYBEGIN",
            "FBMSIGNMONEY_DAYEND"
        ];
        /**
         * FBMGATHERENDMONEY （应收票据到期金额）
         * FBMSIGNENDMONEY  （应付票据到期金额）
         * 格式示例：
         * 应收票据到期金额：
         * FBMGATHERENDMONEY("0001O21000000000320J","FBMTZ6E0000000000001","2019-04-22","2019-04-30","1002Z0100000000001K1",)
         * 应付票据到期金额：
         * FBMSIGNENDMONEY("0001O21000000000320J","FBMTZ6E0000000000001","2019-04-29","2019-04-29","1002Z0100000000001K1",)
         */
        this.fanctionType3 = ["FBMGATHERENDMONEY", "FBMSIGNENDMONEY"];
        if (this.fanctionType1.includes(this.funcType)) {
            //流入
            initTemplate1.call(this);
        } else if (this.fanctionType2.includes(this.funcType)) {
            //流出
            initTemplate2.call(this);
        } else if (this.fanctionType3.includes(this.funcType)) {
            //净流入
            initTemplate3.call(this);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.funcType != nextProps.funcType) {
            this.funcType = nextProps.funcType; //更新模态框类型
            if (this.fanctionType1.includes(this.funcType)) {
                //流入
                initTemplate1.call(this);
            } else if (this.fanctionType2.includes(this.funcType)) {
                //流出
                initTemplate2.call(this);
            } else if (this.fanctionType3.includes(this.funcType)) {
                //净流入
                initTemplate3.call(this);
            }
        }
    }
    componentDidUpdate() {
        this.props.form.setFormStatus(formId, "edit");
        this.props.form.EmptyAllFormValue(formId);
    }
    render() {
        const { form, button } = this.props;
        let { createForm } = form;
        let { createButtonApp } = button;
        return (
            <NCModal
                fieldid={this.funcType}
                show={this.props.isShow}
                backdrop={false}
                size="lg"
                zIndex='280'
            >
                <NCModal.Header>
                    <NCModal.Title>{this.funcType}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div
                        className="form-wrap"
                        style={{ padding: "0 45px 0 20px" }}
                    >
                        {createForm(formId, {
                            isNoStandard: true, //取消财务组织参照自动聚焦功能
                            zIndex:'280'
                        })}
                    </div>
                </NCModal.Body>
                <NCModal.Footer>
                    {createButtonApp({
                        area: "modalfooter",
                        onButtonClick: buttonClick.bind(this)
                    })}
                </NCModal.Footer>
            </NCModal>
        );
    }
}
GuidComponents = createPage({})(GuidComponents);
export default { GuidComponents };

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/