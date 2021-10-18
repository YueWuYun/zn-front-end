/*Q0c5MFQyPlsXvVl9dBWSHfXQFCedy7579ykfweMejw3xFsyGAAm3dp1T4VUan/3/*/

import Sign from '../../../../tmpub/pub/util/ca';
export const checkcauser = async function (){

    let signdata = await Sign({
        isSign: false,
        isKey: true,
        data: null,
        encryptVOClassName: null
    });
    return signdata;
}
/*Q0c5MFQyPlsXvVl9dBWSHfXQFCedy7579ykfweMejw3xFsyGAAm3dp1T4VUan/3/*/