/*uca7j6dTt7CJHOLNt90hTl5c4RIn0kBsgp/d+HQYQw3NhlOeCzqbGBLn2OqQGgC+*/
import { ajax } from 'nc-lightapp-front';

/**
 * CMP模块是否启用
 *
 */
export function linkCMP(params) {
    let { data, success, error } = params;
    ajax({
        url:`/nccloud/tmpub/pub/linkcmpcheck.do`,
        data,
        success: (res) => {
            success && success(res);
        }
    });
}
/*uca7j6dTt7CJHOLNt90hTl5c4RIn0kBsgp/d+HQYQw3NhlOeCzqbGBLn2OqQGgC+*/