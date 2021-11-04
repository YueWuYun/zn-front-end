//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { LIST, APPCODE, LIST_BUTTON, PRIMARTKEY, CARD, REQUESTURL } from '../../constant';
import { bodyButtonClick } from '../events/bodyButtonClick';
import { buttonVisibilityControl } from './buttonVisibilityControl';
import {searchBtnClick} from "./searchBtnClick";

//列表模板渲染
export function initTemplate(that,props, json) {
        let listPagecode = props.getSearchParam('p');
        let appcode = props.getSearchParam('c');
        let pagecode = appcode + '_LIST';
        props.createUIDom(
                {
                        pagecode: pagecode,       //页面code
                        appcode: appcode
                },
                function (data) {
                        if (data) {
                                if (data.button) {
                                        //将请求回来的按钮组数据设置到页面的 buttons 属性上
                                        let button = data.button;
                                        props.button.setButtons(button);
                                        props.button.setPopContent(LIST_BUTTON.bodyDelete, json['10100CCS-000008']);/* 国际化处理： 确认要删除吗?*/
                                }
                                if (data.template) {
                                        let meta = data.template;
                                        meta = modifierMeta(props, meta, json);
                                        props.meta.setMeta(meta);
                                }
                                that.buttonVisibilityControl(props);
                            props.search.setSearchValByField( LIST.search_id,"vname", {value:"初始版本",display:''});
                            that.searchBtnClick(props);
                            props.search.clearSearchArea(LIST.search_id);
                        }
                }
        );

}

function modifierMeta(props, meta, json) {

        //查询区参照过滤
        meta[LIST.search_id].items.map((item) => {
                if (item.attrcode === 'pk_org') { //财务组织过滤
                        item.isMultiSelectedEnabled = true; //财务组织多选
                        item.queryCondition = () => {
                                return {
                                        funcode: props.getSearchParam('c')//appcode获取
                                };
                        };
                }
        });

        //开启分页
        meta[LIST.table_id].pagination = true;

        meta[LIST.table_id].items = meta[LIST.table_id].items.map((item, key) => {
                if (item.attrcode == PRIMARTKEY.bill_no) {
                        item.render = (text, record, index) => {
                                return (
                                        <a
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                        props.pushTo(REQUESTURL.toCard, {
                                                                status: 'browse',
                                                                id: record[PRIMARTKEY.head_id].value,
                                                                pagecode: CARD.page_code
                                                        });
                                                }}
                                        >
                                                {record[PRIMARTKEY.bill_no] && record[PRIMARTKEY.bill_no].value}
                                        </a>
                                );
                        };
                }
                return item;
        });

        //添加操作列
        meta[LIST.table_id].items.push({
                itemtype: 'customer',
                attrcode: 'opr',
                label: '操作',/* 国际化处理： 操作json['10100CCS-000006']*/
                width: '260px',
                fixed: 'right',
                className: "table-opr",
                visible: true,
                render: (text, record, index) => {
                        let buttonAry = [];
                        buttonAry = ['edit', 'delete','centergroup','factorgroup'];
                        return props.button.createOprationButton(buttonAry, {
                                area: LIST.body_btn_code,
                                buttonLimit: 3,
                                onButtonClick: (props, key) => bodyButtonClick({ ...props, json }, key, text, record, index)
                        });
                }
        });

        return meta;
}


//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX