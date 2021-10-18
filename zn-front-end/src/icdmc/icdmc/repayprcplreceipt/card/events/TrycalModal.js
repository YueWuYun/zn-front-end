/*WqjHDmcNX8Euv0/vQ72/pyKfQ5IrJIsaj20r9E5WV4sdfB44M/DlitEEbu0PIrwg*/
/**
 * 试算结果弹窗 - 显示主子表卡片界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import { base, toast } from "nc-lightapp-front";
import moment from "moment";
import {
    moduleId,
    card,
    list,
    tabs,
    baseReqUrl,
    javaUrl,
    printData
} from "../../cons/constant.js";
import Card from "../index";
const { NCModal, NCButton, NCAffix } = base;

export default class TrycalModal extends Component {
    constructor(props) {
        super(props);
        this.formId = card.headCode; //主表区域
        this.moduleId = moduleId; //多语使用
        this.pageId = card.pageCode; //card页面code
        this.primaryId = card.primaryId; //主键ID
        this.cache = card.cardCache; //缓存key
        this.dataSource = list.listCache; //调用列表界面缓存pks
        this.tabCode = tabs.tabCode; //tab区域code
        this.tabOrder = tabs.tabOrder; //tab区域code排序
        this.tabShow = tabs.tabShow; //默认显示tab
        this.disabled_TabBtn = tabs.disabled_btn; //tab禁用按钮
        this.cardUrl = `${baseReqUrl}${javaUrl.card}`; //获取卡片详情url
        this.state = {
            billNo: "", //单据编号
            showUploader: false, //附件上传show
            billInfo: {}, //附件上传信息
            printOut: {
                //打印输出使用
                ...printData,
                outputType: "output"
            }
        };
    }
    //关闭弹窗
    handleClose = () => {
        this.props.onClose();
    };

    render() {
        return (
            <NCModal
                show={this.props.showModal}
                size="xlg"
                onHide={this.handleClose}
            >
                <NCModal.Header closeButton={"true"}>
                    <NCModal.Title>{`this.state.json['36630BCIB-000100']:${/* 国际化处理： 贷款利息清单*/
                        this.state.billNo
                    }`}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body size="sm">
                    <Card modalLink={true} trycalData={this.props.trycalData} />
                </NCModal.Body>
            </NCModal>
        );
    }
}

/*WqjHDmcNX8Euv0/vQ72/pyKfQ5IrJIsaj20r9E5WV4sdfB44M/DlitEEbu0PIrwg*/