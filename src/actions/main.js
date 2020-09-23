import { } from '../utils/web3Utils';

export const exit = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const syusd = store.get('syusdObject')
    const exitAmount = store.get('exitAmount').mul(10**18)

    if (!store.get('pps')) return
    const ppsRaw = store.get('ppsRaw')
    const yusdDecimal = exitAmount.div(ppsRaw).mul(10**18)

    const walletAddress = store.get('walletAddress')
    return syusd.methods.burn(yusdDecimal.toFixed()).send({from: walletAddress})
}

export const join = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const syusd = store.get('syusdObject')
    const yusd = store.get('yusdObject')
    const joinAmount = store.get('joinAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    const allowance = store.get('yusdAllowance')
    if (joinAmount.cmp(allowance)>0) {
      return yusd.methods.approve(syusd.options.address, web3.utils.toBN("115792089237316195423570985008687907853269984665640564039457584007913129639935"))
        .send({from: walletAddress})
        .then(function () {
          return syusd.methods.mint(joinAmount.toFixed()).send({from: walletAddress})
        });
    }
    return syusd.methods.mint(joinAmount.toFixed()).send({from: walletAddress})
}

export const transfer = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const syusd = store.get('syusdObject')
    const transferAmount = store.get('transferAmount').mul(10**18)
    const transferAddress = store.get('transferAddress')
    const walletAddress = store.get('walletAddress')
    return syusd.methods.transfer(transferAddress, transferAmount.toFixed()).send({from: walletAddress})
}

export default {
    join,
    exit,
    transfer,
}
