//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 Created By liqiankun on 2019/2/27
 **/

import React, { Component } from 'react';
import {
    base,ajax,deepClone,createPage,
    promptBox, toast, getMultiLang,
    initMultiLangByModule, getMultiLangByID,
    createPageIcon
} from 'nc-lightapp-front';
const {
    NCMenu: Menu,
    NCDiv,
} = base;
const { Item } = Menu;

// import ReferLoader from "../../components/ReferLoader";
import './index.less';

class  TitleBar extends Component{
    constructor(props){
        super(props);
        this.state={
            open:false,
            modalType: ''
        }

    }


    renderMenuItem = (children) => {
        const {handleButtonClick} = this.props;
        return <Menu
            onSelect={(param) => handleButtonClick(param.key)}>
            {
                children.map((item, indx) => <Item key={item.key}>{item.title}</Item>)
            }
        </Menu>
    }

    onVisibleChange = (visible) => {
    }
    render(){
        let {ttile, status, handleButtonClick, Fprops, area, showBack, back, referLoader,initShowBackBtn} = this.props;
        let {createBillHeadInfo} = Fprops.BillHeadInfo;
        return(
            <NCDiv areaCode={NCDiv.config.HEADER}>
                <div className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title: ttile,//国际化处理： 期初在产共用材料
                            initShowBackBtn: initShowBackBtn,
                            backBtnClick: () => {
                               back({}, 'back');
                            }
                        })}
                    </div>
                    {
                        status && status.title &&
                            <div className={status.color}>{status.title}</div>
                    }
                    {//是否渲染参照
                        referLoader &&
                            <div style={{marginLeft: '8px', display: 'flex'}}>
                                {
                                    referLoader.showStar && 
                                    <span style={{
                                        color: 'red',
                                        position: 'relative',
                                        top: '10px',
                                        zIndex: 200,
                                        left: '8px'
                                        }}>*</span>
                                }
                                {
                                    this.props.referCom(referLoader)
                                }
                                {/* <ReferLoader
                                    tag='test'
                                    refcode={referLoader.refcode}
                                    value={referLoader.pk_org}
                                    fieldid={referLoader.fieldid}
                                    showStar={true}
                                    onChange={(value) => {
                                        referLoader.handleLoader(value)
                                    }}
                                    disabled={referLoader.disabled}
                                    isMultiSelectedEnabled={false}
                                    queryCondition={{
                                        "isDataPowerEnable": 'Y',
                                        "DataPowerOperationCode" : '',
                                        ...referLoader.queryCondition,
                                    }}
                                /> */}
                            </div>
                    }
                    {
                        this.props.children
                    }
                    <div className="header-button-area">
                        {//按钮集合 ---> 后期是注册按钮
                            Fprops.button.createButtonApp({
                                area: this.props.area,
                                buttonLimit: 3,
                                onButtonClick: (obj, tbnName) => handleButtonClick(obj, tbnName),
                                // popContainer: document.querySelector('.header-button-area')
                            })
                        }
                    </div>
                    <div className="header-cardPagination-area">
                        { showBack && Fprops.cardPagination.createCardPagination({
                            dataSource: this.props.dataSource,
                            handlePageInfoChange: this.props.pageInfoClick
                        })}
                    </div>
                   
                </div>
            </NCDiv>
        )
    }
}
let initTemplate = (props) => {
}
TitleBar = createPage({
    initTemplate: initTemplate
})(TitleBar);
export default TitleBar;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65