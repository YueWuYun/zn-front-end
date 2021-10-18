/*WqjHDmcNX8Euv0/vQ72/pyKfQ5IrJIsaj20r9E5WV4sdfB44M/DlitEEbu0PIrwg*/
/**
 * 试算结果弹窗 - 显示主子表卡片界面
 * @author：zhangyangz
 */
import React, { Component } from "react";
import { base, toast ,getMultiLang} from "nc-lightapp-front";
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
            },
            json: {},
            lang: {}
        };
    }
    componentWillMount() {
        getMultiLang({
            moduleId: {
                ['icdmc']: ['36362FCIB']
            },
            //回调
            callback: (lang) => {
                this.setState({ lang });
            }
        });
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
                    <NCModal.Title>{this.state.lang["36362FCIB-000000"]/* 国际化处理： 单位利息清单*/}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body size="sm">
                    <Card modalLink={true} trycalData={this.props.trycalData} />
                </NCModal.Body>
            </NCModal>
        );
    }
}

/*WqjHDmcNX8Euv0/vQ72/pyKfQ5IrJIsaj20r9E5WV4sdfB44M/DlitEEbu0PIrwg*/