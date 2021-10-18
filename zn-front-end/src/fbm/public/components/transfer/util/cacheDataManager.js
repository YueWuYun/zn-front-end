/*XC08Y6s3vnRymr0zgTGgV+jvjY0/Ni77MiZnrYjs9p58IZySkXFy/sFEuAL9DeXX*/
import { cardCache } from "nc-lightapp-front";

/**
 * 自定义缓存处理
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key
 * @param {自定义缓存数据} data
 */
function setDefData(dataSource, key, data) {
  let { setDefData } = cardCache;
  setDefData(key, dataSource, data);
}

/**
 * 自定义缓存处理
 * @param {缓存标识key} dataSource
 * @param {自定义缓存标识} key
 */
function getDefData(dataSource, key) {
  let { getDefData } = cardCache;
  return getDefData(key, dataSource);
}

/**
 * 下游单据，通过拉单进入编辑态，保存的时候使用
 * 转单界面，通知上游转单界面处理了哪些来源id
 * @param {*} props
 * @param {*} key
 * @param {*} rows
 */
function rewriteTransferSrcBids(props, key, rows) {
  if (rows) {
    let srcbids = [];
   
    rows.forEach(row => {
      srcbids.push(row.values[key].value);
    });
    props.transferTable.setSavedTransferTableDataPk(srcbids);
  }
}

/**
 * 点击拉单按钮使用
 * 清楚转单界面缓存
 * @param {*} props
 * @param {*} key
 * @param {*} rows
 */
function clearTransferCache(props, dataSource) {
  props.transferTable.deleteCache(dataSource);
}

export { setDefData, getDefData, rewriteTransferSrcBids, clearTransferCache };


/*XC08Y6s3vnRymr0zgTGgV+jvjY0/Ni77MiZnrYjs9p58IZySkXFy/sFEuAL9DeXX*/