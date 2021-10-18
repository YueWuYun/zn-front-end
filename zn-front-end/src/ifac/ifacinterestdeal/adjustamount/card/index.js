/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//主子表卡片
import React, { Component } from 'react';
import { createPage, base, cardCache, high, getMultiLang } from 'nc-lightapp-front';
//引入组件
const { NCScrollElement, NCAffix,NCDiv } = base;
const { PrintOutput } = high;
import { buttonClick, initTemplate, afterEvent, searchBtnClick, SearchAfterEvent } from './events';
import { getLang, createTabs, loadData2Card } from '../util/index';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
//引入常量定义
import { module_id, appcode, card_page_id, card_form_id, card_table_id, card_search_id, tab_key, tab_source, URL_INFO, BTN } from '../cons/constant.js';
class Card extends Component {
    constructor(props) {
        super(props);
        this.formId = card_form_id;
        this.moduleId = module_id;
        this.tableId = card_table_id;
        this.pageId = card_page_id;
        this.state = {
            //页签名称和key的数组
            tablist: null,
            defaultGroup: null,
            //当前选中的分组
            selectedGroup: null,
            //多语
            json: {},
            //输出用   
            outputData: {
                funcode: '', //功能节点编码，即模板编码
                nodekey: '', //模板节点标识
                printTemplateID: '', //模板id
                oids: [],
                outputType: 'output'
            },
            showSearchArea: true,
            isBrowse: true
        };
    }

    componentWillMount() {
        window.onbeforeunload = () => {
			if (this.props.getUrlParam('status') !== 'browse') {
				return '当前单据未保存，您确认离开此页面？';
			}
		};
        let callback = (json, status) => {
            if (status) {
                this.setState({ json });
                initTemplate.call(this, this.props);
            }
        };
        getMultiLang({ moduleId: appcode, domainName: 'ifac', callback });
    }

    componentDidMount() {

       
    }

    //获取列表肩部信息,肩部按钮
    getTableHead = (buttons, tableId) => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max'],
                        maxDestAreaId: 'finance-fts-commissionpayment-card'
                    })}
                </div>
            </div>
        );
    };

    //改变页签
    navChangeFun = (tabKey, className, e) => {
        this.setState({
            selectedGroup: tabKey
        });
        let data = cardCache.getDefData(tab_key, tab_source).get(tabKey);
        loadData2Card.call(this, this.props, data);
    };

    render() {
        let { cardTable, form, button, search } = this.props;
        let buttons = this.props.button.getButtons();
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { NCCreateSearch } = search;
        let { showSearchArea, selectedGroup, defaultGroup, tablist } = this.state;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        this.props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: false,  //控制显示返回按钮: true为显示,false为隐藏 ---非必传
            showBillCode: false  //控制显示单据号：true为显示,false为隐藏 ---非必传
        });
        return (
            // 不显示查询区的时候，设置class为"nc-bill-card"和"nc-bill-top-area"，让表头和表体有间隔
            <div className={showSearchArea ? "nc-bill-list" : "nc-bill-card"}>
                <div className={!showSearchArea && "nc-bill-top-area"}>
                    <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
                            <div>
                                {createBillHeadInfo({
                                    title: getLang(this.state.json, '000000')
                                })}
                            </div>
                            <div className="header-button-area" >
                                {/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
                                {createButtonApp({ area: 'card_head', onButtonClick: buttonClick.bind(this) })}
                            </div>
                    </NCDiv>
                    {/* 查询区 */}
                    {showSearchArea && <div className="nc-bill-search-area">
                        {NCCreateSearch(card_search_id, {
                            clickSearchBtn: searchBtnClick.bind(this),	//查询点击事件
                            onAfterEvent: SearchAfterEvent.bind(this),  //编辑后事件
                            defaultConditionsNum: 2
                        })}
                    </div>}
                    {/** 页签 **/}
                    {tablist && tablist.length > 0 && <div className='tab-definInfo-area'>
                        <NCTabs activeKey={selectedGroup} defaultActiveKey={defaultGroup} onChange={(tabKey) => {
                            this.navChangeFun.call(this, tabKey);
                        }}>
                            {createTabs.call(this, tablist)}
                        </NCTabs>
                    </div>}
                    {/* <NCScrollElement name="forminfo" style={{marginBottom: '4px',background:'#f3f3f3'}}> */}
                    <NCScrollElement name="forminfo" style={window.top.nccColor==='black' ? {marginBottom: '4px',background: '#27272a'}:{marginBottom: '4px',background:'#f3f3f3'} } >
                        <div className="nc-bill-form-area">
						
                            {createForm(this.formId, {
                                onAfterEvent: afterEvent.bind(this)
                            })}
                        </div>
                    </NCScrollElement>
                </div>
                <div className="nc-bill-card">
                <div className="nc-bill-bottom-area">
                    <NCScrollElement name='businfo' >
                        <div className="nc-bill-table-area">
                            {createCardTable(this.tableId, {
                                adaptionHeight: true,//表格固定10行的大小
                                tableHead: this.getTableHead.bind(this, buttons, this.tableId),
                                modelSave: () => {
                                    //保存动作
                                    buttonClick.call(this, this.props, BTN.SAVE);
                                    //关闭侧拉弹框
                                    this.props.cardTable.closeModel(this.tableId);
                                },
                                onAfterEvent: afterEvent.bind(this),
                                showCheck: true,
                                showIndex: true
                            })}
                        </div>
                    </NCScrollElement>
                </div>
                </div>
                <div>
                    <PrintOutput
                        ref="printOutput"
                        url={URL_INFO.PRINT}
                        data={this.state.outputData}
                        callback={this.onSubmit}
                    />
                </div>
            </div>
        );
    }
}

Card = createPage({
    billinfo: {
        billtype: 'card',
        pagecode: card_page_id,
        headcode: card_form_id,
        bodycode: card_table_id
    },
    orderOfHotKey: [card_form_id, card_table_id]
})(Card);

export default Card;

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/