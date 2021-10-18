/*
 * @Description: 页面标题栏组件
 * @Author: llixxm
 * @Date: 2019-06-20 11:31:48
 */
import React, { Component } from 'react';
import { base, createPage } from 'nc-lightapp-front';
import './index.less'
const { NCDiv } = base;

class HeaderArea extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    static defaultProps = {
        title: '', //标题,默认小应用名称
        searchContent: '', //标题区过滤组件
        btnContent: '', //按钮
        backBtnClick: '', //返回按点击事件
        pageBtnContent: '',  //翻页按钮
        initShowBackBtn: false //是否显示返回按钮，true:显示,false:不显示,默认false
    };
    //标题点击事件
    titleClick = () => {
        let { titleClick } = this.props
        titleClick && titleClick()
    }
    
    // 返回
    backBtnClick = () => {
        let { backBtnClick } = this.props
        typeof backBtnClick === "function" && backBtnClick() 
    }
    render() {
        let { initShowBackBtn, title, searchContent, btnContent, pageBtnContent, children } = this.props
        const { createBillHeadInfo } = this.props.BillHeadInfo
        let titleTxt = title ? title : this.props.getSearchParam('n')
        return(
            <NCDiv areaCode={NCDiv.config.HEADER}>
                <div className='header'>
                    {
                        createBillHeadInfo(
                            {
                                title: titleTxt,             //标题
                                // billCode:'12324353ASDWR242',     //单据号
                                titleClick: this.titleClick,
                                initShowBackBtn: initShowBackBtn,
                                backBtnClick: this.backBtnClick
                            }
                    )}    
                    {searchContent==='' ? '' : 
                        <div className='header-search-area'>
                            {searchContent}
                        </div>
                    }      
                    {children} 
                    <div className='header-button-area'>
                        {btnContent}
                    </div>
                    {pageBtnContent==='' ? '' :
                        <div className='header-pagination-area'>
                            {pageBtnContent}
                        </div>
                    }
                </div>
            </NCDiv>
        );
    }
}
HeaderArea = createPage({})(HeaderArea)
export default HeaderArea