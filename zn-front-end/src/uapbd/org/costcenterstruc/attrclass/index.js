//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, toast, base } from 'nc-lightapp-front';
import { buttonClick, initTemplate } from './events';
const { NCDiv } = base;
class AttrClassModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {}
        }
    }
    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log("未加载到多语资源");   // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源*/
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': '1057-1057baor', 'domainName': 'uap', callback });
    }
    componentDidMount() {
        this.initPageStatus('browse');
        this.getdata();
    }

    initPageStatus(status) {
        this.pagestatus = status;
        switch (status) {
            case 'browse':
                this.props.button.setButtonVisible(['save', 'cancel'], false);
                this.props.button.setButtonVisible(['add', 'edit', 'del'], true);
                break;
            case 'add':
            case 'edit':
                this.props.button.setButtonVisible(['add', 'del', 'save', 'cancel'], true);
                this.props.button.setButtonVisible(['edit'], false);
                break;
        }
    }

    getdata() {
        let _this = this;
        ajax({
            url: '/nccloud/bcbd/barappregister/queryattrclass.do',
            success: (res) => {
                if (res && res.success && res.data) {
                    _this.props.editTable.setTableData('attrclass', res.data.attrclass);
                } else {
                    _this.props.editTable.setTableData('attrclass', { rows: [] });
                }
            }
        })
    }

    render() {
        let { button, ncmodal, editTable } = this.props;
        let { createButtonApp } = button;
        let { createModal } = ncmodal;
        let { createEditTable } = editTable;
        return (
            <div className="nc-single-table">
                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className="nc-singleTable-header-area">
                        <div className="header-button-area">
                            {this.props.button.createButtonApp({
                                area: 'page_header',
                                buttonLimit: 7,
                                onButtonClick: buttonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </div>
                </NCDiv>
                <div className="nc-singleTable-table-area">
                    {createEditTable('attrclass', {
                        showIndex: true,
                        showCheck: true
                    })}
                </div>
                {createModal('modal', {})}
            </div>
        )
    }
}
AttrClassModal = createPage({
    initTemplate: initTemplate,
})(AttrClassModal);
export default AttrClassModal;


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65