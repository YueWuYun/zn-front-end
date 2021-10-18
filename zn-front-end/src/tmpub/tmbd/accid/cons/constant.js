/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
/**
 * 公共配置
 */
//应用编码
export const app_id = '0001Z61000000001VO02';
//模块编码
export const module_id = '3601';
//实体id
export const oid = '1001Z61000000002JHZG';
//请求后端基础地址
export const base_url = '/nccloud/tmpub/accid/';
//按钮平铺显示数量
export const button_limit = 7;
/**
 * 列表
 */
export const appcode = '36010IACC';
//页面编码
export const list_page_id = '36010IACC_L01';
//查询区域编码
export const list_search_id = '36010IACC_L01_search';
//表格区域编码
export const list_table_id = '36010IACC_L01_table';

/**
 * 卡片
 */
//页面编码
export const card_page_id = '36010IACC_C01';
//表头表单编码
export const card_from_id = '36010IACC_C01_form';

export const card_fromtail_id = '';
export const dataSource = 'tm.tmpub.accid.acciddataSource';
export const cachesearchKey = '36010IACC_L01_search';

export const printnodekey = 'NCC';
export const confirmModal = 'confirmModal';

const btn = {
    commonbtn    :'commonbtn',
    copy         :'copy',
    add          :'add',
    delete       :'delete',
    printdropdown:'printdropdown',
    printgroup   :'printgroup',
    output       :'output',
    print        :'print',
    file         :'file',
    refresh      :'refresh',
  };

export const button = {
    listdisable: [
        btn.commonbtn,
        btn.add,
        btn.copy,
        btn.delete,
        btn.printdropdown,
        btn.printgroup,
        btn.print,
        btn.output,
        btn.file,
        btn.refresh,
    ],
  
    refreshdisable: [
        btn.commonbtn,
        // btn.add,
        btn.copy,
        btn.delete,
        btn.printdropdown,
        btn.printgroup,
        btn.print,
        btn.output,
        btn.file,
        // btn.refresh,
    ],
  
    savedisable: [
        btn.commonbtn,
        btn.add,
        btn.copy,
        btn.delete,
        btn.printdropdown,
        btn.printgroup,
        btn.print,
        btn.output,
        btn.file,
        btn.refresh,
    ],

    otherdisable: [
        btn.commonbtn,
        btn.add,
        btn.copy,
        // btn.delete,
        btn.printdropdown,
        btn.printgroup,
        btn.print,
        btn.output,
        btn.file,
        btn.refresh,
    ],

  };

/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/