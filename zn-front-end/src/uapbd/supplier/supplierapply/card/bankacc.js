//bAToTAXCChxRpbhVl6Z1B6pme6z0Z+2vIglJ9G9fJmxgkrcymoGe1GHpcVDBeTkL
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import List from './bankacc/list'
import Form from './bankacc/form'
const { NCAffix,NCPopconfirm,NCFormControl,NCAnchor,NCScrollElement,NCScrollLink } = base;

const {createModal} = base

/**
 * config对象结构：
 * config : {
 *  isList          //判定当前弹出层处于列表态
 *  bankaccModalChange    //弹出层导致卡片和列表切换的钩子函数
 *  tableId         //弹出层的列表界面的区域编码
 *  formId          //弹出层的卡片界面的区域编码
 *  cardTableId     //弹出层卡片机界面的子表的区域编码
 * }
 */
export function createBankaccList(props,config) {
    let { cardTable, form, button, modal, cardPagination, table } = props;
    let { createForm } = form;
    let { createCardTable } = cardTable;
    let { createButtonApp } = button;
    let { createSimpleTable } = table
    let { createModal } = modal
    let listPage = (<div><List {...props} {...config} /></div>)
    return createModal('bankaccList',{
        title: props.json['10140SPF-000020'],
        content: listPage,
        noFooter: true,
        closeModalEve: config.bankaccModalClose
    })
}

export function createBankaccForm(props,config) {
    let { cardTable, form, button, modal, cardPagination, table } = props;
    let { createModal } = modal
    let formPage = (<div><Form {...props} {...config} /></div>)
    return createModal('bankaccForm',{
        title: props.json['10140SPF-000020'],
        content: formPage,
        size: 'xlg',
        noFooter: true,
        closeModalEve: config.bankaccModalClose
    })
}

//bAToTAXCChxRpbhVl6Z1B6pme6z0Z+2vIglJ9G9fJmxgkrcymoGe1GHpcVDBeTkL