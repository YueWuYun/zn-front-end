/*rtDPZQg7E2607vXcvO2Z/5EyVvlrM7k+Yz8HKlxWjZ7CgbAx1Lv5rlFoUNhmf+xn*/
import {viewModel } from 'nc-lightapp-front';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
/**
 * [收款]-从缓存中获取pagecode(tradecode)，不用交易类型得到不同pagecode,适用于新增和复制
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const cachepagecode = function () {
    let tradecode = getGlobalStorage('sessionStorage', 'sessionTP');
    if (tradecode && tradecode.length > 0) {
        let pagecode = this.state.tradeCode;
        console.log(pagecode, 'add_pageid');
            this.setState({
                tradeCode: tradecode
            });
    }

}

/*rtDPZQg7E2607vXcvO2Z/5EyVvlrM7k+Yz8HKlxWjZ7CgbAx1Lv5rlFoUNhmf+xn*/