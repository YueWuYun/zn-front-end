//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { createPage, ajax, toast, promptBox } from 'nc-lightapp-front';

export default function (props) {
    props.createUIDom(
        {
            pagecode: '10140ACMAP_LIST',//页面id
            appcode: '10140ACMAP'  // 应用编码
        },
        function (data) {
            if (data) {
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                }
                if (data.template) {
                    let meta = data.template;
                    modifierMeta(props, meta);
                    props.meta.setMeta(meta);
                }
            }
        }
    )
}

function modifierMeta(props, meta) {
    //添加操作列
     
    let material_event = {
        label:'操作',
        // itemtype: 'customer',
        attrcode: 'opr',
        width: '150px',
        visible: true,
        fixed: 'right',
        render: (text, record, index) => {
            let buttonAry = ["edit_opr", "del_opr"];
            return props.button.createOprationButton(buttonAry, {
                area: "page_body",
                buttonLimit: 3,
                onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index)
            });
        }
    };
    meta.periodmapping.items.push(material_event);
    meta.periodmapping.items.map((item, key) => {
        if (item.attrcode == 'code') {
            item.renderStatus = 'browse';
            item.render = (text, record, index) => {
                return (
                    <a
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => {
                            props.pushTo('/card', {
                                status: 'browse',
                                pagecode:'10140ACMAP_card',
                                pk: record.pk_peiodmapping.value,
                            });

                        }}
                    >
                        {record.code.value}
                    </a>
                );
            }
        }
    })
    return meta;
}

function tableButtonClick(props, key, text, record, index) {
    switch (key) {
        case 'edit_opr':
            props.pushTo('/card', {
                status: 'edit',
                pagecode:'10140ACMAP_card',
                pk:record.pk_peiodmapping.value,
            });
            break;
        case 'del_opr':
            promptBox({
                color: 'warning',
                title:'删除',
                content:'确定要删除所选数据吗？',
                beSureBtnClick: () => {
                    var that = this;
                    let data = {
                        pks: [record.pk_peiodmapping.value],
                    }
                    ajax({
                        data: data,
                        url:'/nccloud/pubinfo/periodmapping/delete.do',
                        success: function (res) {
                            let { success, data } = res;
                            
                            if (success) {
                                props.table.deleteTableRowsByIndex('periodmapping', index);
                                toast({ color: 'success' });
                            }
                        },
                        error: function (res) {
                            toast({ content: res.message, color: 'danger' });
                        }
                    })
                }
            });

            break;
    }
}
//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX