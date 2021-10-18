/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, getMultiLang } from 'nc-lightapp-front';
//引入组件
import { buttonClick, initTemplate, afterEvent, pageInfoClick } from './events';
import { getLang } from '../util/index';
//引入常量定义
import { module_id, appcode, card_page_id, card_form_id, list_page_id, btn_card_head, URL_INFO, data_source, PAGE_STATUS } from '../cons/constant.js';
class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = card_form_id;
        this.moduleId = module_id;
        this.pageId = card_page_id;
        this.state = {
            //多语
            // json: {},
            showNCbackBtn: false,	//返回箭头
            content: '',
            action: '',
        };
    }

    closeEnableModal() {
        this.setState({ showModal_enable: false });
    }

    componentWillMount() {
        let callback = (json) => {
            // this.setState({ json });
            initTemplate.call(this, this.props);
        };
        getMultiLang({ moduleId: appcode, domainName: 'cmp', callback });
        // 关闭浏览器
        window.onbeforeunload = () => {
            if (this.props.getUrlParam('status') !== 'browse') {
                return '当前单据未保存，您确认离开此页面？';
            }
        };
    }

    componentDidMount() {
    }

    //切换页面状态
    toggleShow = () => {
    };

    render() {
        let { form, button, cardPagination } = this.props;
        let { createForm } = form;
        let { createCardPagination } = cardPagination;
        let { createButtonApp } = button;
		let { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        <h2 className='title-search-detail'>
                            {createBillHeadInfo({
                                // 国际化处理： 内部账户档案
                                title: getLang(this.props, '000000'), /* 国际化处理： 现金账户控制规则*/
                                //返回按钮的点击事件     
                                backBtnClick: () => {
                                    this.handleClick();
                                }
                            })}
                        </h2>
                    </div>
                    <div className="header-button-area">
                        {/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
                        {createButtonApp({ area: btn_card_head, onButtonClick: buttonClick.bind(this) })}
                    </div>
                    <div className='header-cardPagination-area' style={{ float: 'right' }}>
                        {createCardPagination({
                            handlePageInfoChange: pageInfoClick.bind(this),
                            dataSource: data_source
                        })}
                    </div>
                </div>
                <div className="nc-bill-form-area">
                    {createForm(this.formId, {
                        onAfterEvent: afterEvent.bind(this)
                    })}
                </div>
            </div>

        );
    }

    /**
	 * 更新状态机
	 * @param {*} obj 
	 */
	updateState(obj) {
		if (obj && Object.keys(obj).length > 0) {
			this.setState(obj);
		}
	}	

    //卡片返回按钮
    handleClick = () => {
        //先跳转列表
        this.props.pushTo(URL_INFO.LIST_PAGE_URL, {
            pagecode: list_page_id
        });
    }

}

Card = createPage({
    billinfo: {
        billtype: 'form',
        pagecode: card_page_id,
        headcode: card_form_id,
    },
    mutiLangCode: appcode
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/