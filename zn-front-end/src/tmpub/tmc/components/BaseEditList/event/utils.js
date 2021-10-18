/*VXFvg6Mvwf6woNAz5hi+V0GwVQlkH6xhkoRXuiWEhfHQZNvJ9JIzjoEUx1iu+oQ+*/
/**
 * 工具函数
 * @author dongyue7
 */

// 去前后空格
export function trimStr(str){
    if(str === null) {
        return ''
    }
    return str.replace(/(^\s*)|(\s*$)/g,"");
}

// 去除数组中重复元素
export function dedupe(array) {
    return Array.from(new Set(array));
}


/*VXFvg6Mvwf6woNAz5hi+V0GwVQlkH6xhkoRXuiWEhfHQZNvJ9JIzjoEUx1iu+oQ+*/