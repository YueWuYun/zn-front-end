/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/**引入平台API */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {getMultiLang} from 'nc-lightapp-front';

/**引入领域内API */
import { appendMultiLangRes, loadMultiLang } from "../index";
import { MODULE_INFO } from "../../cons/constant";

/**
 * 创建展开/收起按钮（卡片表体浏览态,临时方案，后续为了快捷键还是应该走按钮注册）
 * @param {*} props 页面内置对象
 * @param {*} bodyCode 表体区域编码
 * @param {*} record 行数据
 * @param {*} expandBtnName 展开按钮名称
 * @param {*} collapseBtnName 收起按钮名称
 */
export const buildExpandCollapseBtn = function (props, bodyCode, record, expandBtnName, collapseBtnName) {
    return <div class="currency-opr-col">
        <span class="opration-wrapper">
            <a class="row-edit-option"
                onClick={() => {
                    props.cardTable.toggleRowView(bodyCode, record)
                }}>
                {record.expandRowStatus ? collapseBtnName : expandBtnName}
            </a>
        </span>
    </div>;
}
/**
 * 行详情按钮
 * @author tangleic
 */
export class RowDetailButton extends Component {
    constructor(props) {
        super(props);
        //行数据
        this.record = props.record;
        //表体区域编码
        this.bodyAreaCode = props.bodyAreaCode;
        //父组件的页面属性(不知道为什么子组件的props中缺少viemodule等平台相关的属性，导致多语操作会有问题，故先借用父组件的props)
        this.parentProps = props.props;
        this.state = {
            showDetail: false
        };
    }

    componentWillMount() {
        getMultiLang({
            //领域编码
            domainName: MODULE_INFO.TMPUB,
            //模块编码
            moduleId: [MODULE_INFO.TMPUB_NUM],
            //回调
            callback: (lang) => {
                //将多语资源数据存储到页面级缓存中
                appendMultiLangRes(this.parentProps, lang);
                //触发重新渲染避免因为加载多语回调导致的多语信息为空
                this.setState({ showDetail: false });
            }
        });
    }

    render() {
        return buildExpandCollapseBtn(this.parentProps, this.bodyAreaCode, this.record, loadMultiLang(this.parentProps, '3601-000000')/* 国际化处理： 展开*/, loadMultiLang(this.parentProps, '3601-000001')/* 国际化处理： 收起*/);
    }
}
/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/