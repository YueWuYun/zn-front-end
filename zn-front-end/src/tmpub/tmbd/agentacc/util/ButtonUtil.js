/*inpa13LQlIoZKNMmElEazb3Un50CwW4O+rq1yQ5BxK2+9tqoz9J7GLyN9SwdT29G*/
import { toast, ajax, cacheTools } from 'nc-lightapp-front';
import deepClone from './deepClone.js';
/**
 * 按钮操作api

 * @version 1.0
 */

/**
* 新增行
* @param {*} props 页面内置对象
* @param {*} areacode 区域编码
* @param {*} afterFunc 增行处理逻辑
*/
export const AddLine = function (props, areacode, afterFunc) {
    props.cardTable.addRow(areacode)
    if (afterFunc != null) {
        afterFunc(props, areacode);
    }
}

/**
 * 插入行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码
 * @param {*} index  行索引
 */
export const InsertLine = function (props, areacode, index) {
    props.cardTable.addRow(areacode, index + 1)
}
/**
 * 批量删除行
 * @param {*} props 平台页面内置对象
 * @param {*} areacode 区域编码
 * @returns 执行结果
 */
export const BatchDelLine = function (props, areacode) {
    let selectRows = props.cardTable.getCheckedRows(areacode);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': '未选中要删除的行'
        });
        return false;
    }
    let selectIndexs = [];
    for (let item of selectRows) {
        selectIndexs.push(item.index);
    }
    props.cardTable.delRowsByIndex(areacode, selectIndexs);
    return true;
}

/**
 * 删除行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码 
 * @param {*} index 行索引
 */
export const DelLine = function (props, areacode, index) {
    props.cardTable.delRowsByIndex(areacode, index);
}

/**
 * 展开行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码 
 * @param {*} index  行索引
 * @param {*} record  行数据
 * @param {*} status 显示模式
 */
export const Open = function (props, areacode, index, record, status) {
    props.cardTable.openModel(areacode, status, record, index);
}

/**
 * 批量复制
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码
 * @param {*} index 粘贴至此行的index,末行不需要传
 */
export const BatchCopy = function (props, areacode, index) {
    let selectRows = props.cardTable.getCheckedRows(areacode);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': '未选中要复制的行'
        });
        return false;
    }
    let selectIndexs = [];
    let selectRowCopy = deepClone(selectRows);
    for (let item of selectRowCopy) {
        item.data.values.enablestate.display = null;
        item.data.values.enablestate.value = '';
        item.data.values.linestatus.display = null;
        item.data.values.linestatus.value = '';
        item.data.values.ts.display = null;
        item.data.values.ts.value = '';
        item.data.values.pk_agentacccfg_b.display = null;
        item.data.values.pk_agentacccfg_b.value = '';
        item.data.values.pk_bankaccbas.display = null;
        item.data.values.pk_bankaccbas.value = '';
        selectIndexs.push(item.data);
    }
    let indexNum=props.cardTable.getNumberOfRows(areacode, false);
    if(index || index==0){
        indexNum = index;
    }
    //TODO 等待平台批量复制的API
    props.cardTable.insertRowsAfterIndex(areacode, selectIndexs, indexNum)
    return true;
}

/**
 * 复制行
 * @param {*} props 页面内置对象
 * @param {*} areacode 区域编码
 * @param {*} index  行索引
 */
export const CopyLine = function (props, areacode, index) {
    props.cardTable.pasteRow(areacode, index);
}

/**
 * 列表批量操作
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格编码
 * @param {*} pkName 主键字段名
 * @param {*} url 请求地址
 * @param {*} successMess 成功提示语
 * @param {*} refreshFunc 刷新动作
 */
export const listMultiOperator = function (props, pageCode, tableCode, pkName, url, successMess, refreshFunc) {
    let selectDatas = props.table.getCheckedRows(tableCode);
    //判断是否有选中行
    if (selectDatas == null || selectDatas.length == 0) {
        toast({ color: 'warning', content: '未选中行！' });
        return;
    }
    let pkMapTs = {};
    let index = 0;
    let pk = null;
    let ts = null;
    while (index < selectDatas.length) {
        //获取行主键值
        pk = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values[pkName] && selectDatas[index].data.values[pkName].value;
        //获取行ts时间戳
        ts = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.ts && selectDatas[index].data.values.ts.value;
        //判空
        if (pk && ts) {
            pkMapTs[pk] = ts;
        }
        index++;
    }
    if (Object.keys(pkMapTs).length > 0) {
        ajax({
            url,
            data: {
                //主键pk与时间戳ts的映射
                pkMapTs,
                //页面编码
                pageCode
            },
            success: () => {
                //批量操作直接刷新列表数据，不做数据单条更新操作
                if (refreshFunc && (typeof refreshFunc == 'function')) {
                    refreshFunc();
                }
                toast({ color: 'success', content: successMess });
            },
        });
    }
}

/**
 * 列表单笔操作
 * @param {*} pageCode 页面编码
 * @param {*} url 请求地址
 * @param {*} record 行数据
 * @param {*} pkName 主键字段名
 * @param {*} successMess 成功提示信息
 * @param {*} refreshFunc 刷新动作
 */
export const listSingleOperator = function (pageCode, url, record, pkName, successMess, refreshFunc) {
    let pkMapTs = {};
    let pk = record[pkName].value;
    let ts = record['ts'].value;
    pkMapTs[pk] = ts;
    ajax({
        url,
        data: {
            //主键pk与时间戳ts的映射
            pkMapTs, pageCode
        },
        success: () => {
            if (refreshFunc && (typeof refreshFunc == 'function')) {
                refreshFunc();
            }
            toast({ color: 'success', content: successMess });
        }
    });
}

/**
 * 卡片操作
 * <p>
 * 执行成功后，会根据后端返回的数据对界面进行更新，表头整个form更新，表体根据后端返回的字段进行更新
 * 
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} headCode  表头区域编码
 * @param {*} pkName 主键字段名
 * @param {*} url  请求地址
 * @param {*} successMess 成功提示信息
 * @param {*} refreshFunc 刷新逻辑
 */
export const cardOperator = function (props, pageCode, headCode, pkName, url, successMess, refreshFunc) {
    let pkMapTs = {};
    let pk = props.form.getFormItemsValue(headCode, pkName).value;
    let ts = props.form.getFormItemsValue(headCode, 'ts').value;
    pkMapTs[pk] = ts;
    ajax({
        url,
        data: {
            //主键pk与时间戳ts的映射
            pkMapTs,
            //页面编码
            pageCode,
            //是否返回数据
            isRet: true
        },
        success: (res) => {
            let { success, data } = res;
            if (success) {
                let { head, body } = data;
                if (head) {
                    props.form.setAllFormValue({ [headCode]: head[headCode] });
                }
                if (body) {
                    //遍历响应数据中的body区域，将body中的数据更新到界面
                    for (let bodyCode in body) {
                        //获取指定表格区域的数据
                        let bodyData = body[bodyCode];
                        if (!bodyData) {
                            continue;
                        }
                        let { rows } = bodyData;
                        if (!rows || rows.length == 0) {
                            continue;
                        }
                        //遍历表格中的所有行数据
                        let rowIndex;
                        for (rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                            let row = rows[rowIndex];
                            if (!row || !row.values) {
                                continue;
                            }
                            let { values } = row;
                            //遍历单行数据中的列数据
                            for (let key in values) {
                                let valueObj = values[key];
                                if (!valueObj) {
                                    continue;
                                }
                                //将列数据更新到界面
                                props.cardTable.setValByKeyAndIndex(bodyCode, rowIndex, key, valueObj);
                                break;
                            }
                        }
                    }
                }
                if (refreshFunc && (typeof refreshFunc == 'function')) {
                    refreshFunc();
                }
                toast({ color: 'success', content: successMess });
            }
        }
    });
}

/**
 * 进入卡片
 * <p>
 * 进入卡片前将列表查询区域的查询条件存储到缓存中
 * @param {*} props 列表页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} searchCode 查询区域编码
 * @param {*} items 查询字段数组
 * @param {*} url 卡片地址
 * @param {*} param 路由参数
 * @param {*} extFunc 额外方法
 */
export const go2Card = function (props, pageCode, searchCode, items, url, param, extFunc) {
    if (items && items.length > 0) {
        for (let item of items) {
            let value = props.search.getSearchValByField(searchCode, item);
            if (!value) {
                continue;
            }
            //将查询字段的数据存储到缓存 整个缓存是会话级的，为了防止页面之间的缓存数据相互影响故缓存的key中增加了页面编码来避免影响
            cacheTools.set(pageCode + '_searchcodition_' + item, value);
            if (extFunc && typeof extFunc == 'function') {
                extFunc();
            }
        }
    }
    //跳转
    props.linkTo(url, param);
}

/**
 * 加载查询条件
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码 
 * @param {*} searchCode  查询区域编码
 * @param {*} items  查询区域字段
 * @return 是否需要查询
 */
export const loadSearchCondition = function (props, pageCode, searchCode, items) {
    let searchCondition = {
        logic: "and",
        conditions: [
        ],
    }
    if (items && items.length > 0) {
        for (let item of items) {
            let value = cacheTools.get(pageCode + '_searchcodition_' + item);
            if (!value || !value.value) {
                continue;
            }
            let values = [];
            if (value.value.firstvalue) {
                values.push(value.value.firstvalue);
            }
            if (value.value.secondvalue) {
                values.push(value.value.secondvalue);
            }
            let dataValue;
            if (values.length == 0) {
                dataValue = null;
            } else if (values.length == 1) {
                dataValue = values[0];
            } else {
                dataValue = values;
            }
            let data = {
                value: dataValue,
                display: value.display
            }
            delete value.display;
            searchCondition.conditions.push(value);
            props.search.setSearchValByField(searchCode, item, data);
        }
    }
    return searchCondition;
}

/**
 * 联查请求参数成功后跳转
 * @param {*} props 
 * @param {*} res 
 * @param {*} urlExtParam 默认传输的额外参数
 */
export const linkSucessPro = function (props, res, urlExtParam) {
    let { data } = res;
    if (!data) {
      return;
    }
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let { url, pks, appCode, linkPageCode } = element;
        if (!urlExtParam || Object.keys(urlExtParam).length == 0) {
          urlExtParam = {
            status: 'browse'  //默认设置浏览态
          };
        }
        urlExtParam['appcode'] = appCode;
        urlExtParam['pagecode'] = linkPageCode;
        urlExtParam['pks'] = pks;
        props.openTo(url, urlExtParam);
      }
    }
  }
/*inpa13LQlIoZKNMmElEazb3Un50CwW4O+rq1yQ5BxK2+9tqoz9J7GLyN9SwdT29G*/