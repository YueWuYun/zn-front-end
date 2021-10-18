/*Fnw/+7RrVHUifmTwZcmqxbD1angPkdq2yttz99Fya50=*/
/**wangtaos添加，为投融资使用API */

/**
 * 添加rowid,
 * @param {*} data     bodys的数据，结构为{key1: {rows: [...]}, key2: {rows: [...]}, ...}
 */
export function addRowId (data) {
    for (let key in data) {
        if (Array.isArray(data[key].rows)) {
            data[key].rows.forEach(item => item.rowid = item.rowid || String(new Date().getTime()).slice(-5) + Math.random().toString(12));
        }
    }
    return data;
}
/*Fnw/+7RrVHUifmTwZcmqxbD1angPkdq2yttz99Fya50=*/