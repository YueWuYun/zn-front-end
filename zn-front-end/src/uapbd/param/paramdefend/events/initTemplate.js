//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { ajax, base } from 'nc-lightapp-front';
export default function (props) {
    let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        if (status) {
            props.createUIDom(
                {
                    pagecode: '10120paradef'
                },
                function (data) {
                    if (data) {
                        let template = currtablemeta(json);
                        props.meta.setMeta(template);
                        if (data.button) {
                            let button = data.button;
                            props.button.setButtons(button);
                        }
                    }
                }
            );
        }
    }
    props.MultiInit.getMultiLang({ moduleId: "10120PARA", domainName: 'uapbd', callback });
}

function currtablemeta(json) {
    let templet = {
        'paramdef': {
            'moduletype': 'table',
            'items': [
                {
                    attrcode: 'pk_sysinit',
                    label: json['10120PARA-000002'],/* 国际化处理： 参数主键*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: false,
                    disabled : true
                },
                {
                    attrcode: 'sysinit',
                    label: json['10120PARA-000003'],/* 国际化处理： 所属模板*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: false,
                    disabled : true
                },
                {
                    attrcode: 'moduleName',
                    label: json['10120PARA-000004'],/* 国际化处理： 所属模块*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: true,
                    disabled : true
                },
                {
                    attrcode: 'initcode',
                    label: json['10120PARA-000005'],/* 国际化处理： 参数编码*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: true,
                    disabled : true
                },
                {
                    attrcode: 'initname',
                    label: json['10120PARA-000006'],/* 国际化处理： 参数名称*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: true,
                    disabled : true
                },
                {
                    attrcode: 'isCheck',
                    label: json['10120PARA-000007'],/* 国际化处理： 维护权*/
                    itemtype: 'switch',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: true
                },
                {
                    attrcode: 'modifier',
                    label: json['10120PARA-000008'],/* 国际化处理： 最后修改人*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: false,
                    disabled : true
                },
                {
                    attrcode: 'modifiedtime',
                    label: json['10120PARA-000009'],/* 国际化处理： 最后修改时间*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: false,
                    disabled : true
                },
                {
                    attrcode: 'value',
                    label: json['10120PARA-000010'],/* 国际化处理： 参数值*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: false,
                    disabled : true
                },
                {
                    attrcode: 'editflag',
                    label: json['10120PARA-000011'],/* 国际化处理： 是否可编辑*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: false,
                    disabled : true
                },
                {
                    attrcode: 'controlflag',
                    label: json['10120PARA-000012'],/* 国际化处理： 控制下级*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: false,
                    disabled : true
                },
                {
                    attrcode: 'pub_sysinit.dataoriginflag',
                    label: json['10120PARA-000013'],/* 国际化处理： 分布式*/
                    itemtype: 'input',
                    col: 6,
                    leftspace: 0,
                    rightspace: 0,
                    visible: false,
                    disabled : true
                }
            ]
        }
    }
    return templet;
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX