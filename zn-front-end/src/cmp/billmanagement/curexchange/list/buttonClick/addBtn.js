/*LsGmnUjuUJhgHTjWE0yOSWxao+3hIMM5BpjgAN++jbeaNaOUfEvOH5V8/BbaP53+*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
/**
 * [外币兑换]-新增按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const addBtn = function () {
    //1,没有查询数据新增---数据id传空
    //2,查询了数据有新增---数据第一条pk直接获取。
    this.props.pushTo('/card', {
        status: 'add',
        pagecode: this.pageCode,
        form_list: 'from_list',
        id: this.state.add_pk,//查询后赋值
        bill_no: this.state.add_status//查询后赋值
    });
}

/*LsGmnUjuUJhgHTjWE0yOSWxao+3hIMM5BpjgAN++jbeaNaOUfEvOH5V8/BbaP53+*/