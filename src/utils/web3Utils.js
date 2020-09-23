import Web3 from "web3"
import config from '../config.json'
import yusdABI from '../abi/yUSD.abi.json'
import syusdABI from '../abi/syUSD.abi.json'

let Decimal = require('decimal.js-light')
Decimal = require('toformat')(Decimal)


const yusdAddress = config.yUSD
const syusdAddress = config.syUSD

export const WadDecimal = Decimal.clone({
  rounding: 1, // round down
  precision: 78,
  toExpNeg: -18,
  toExpPos: 78,
})

WadDecimal.format = {
  groupSeparator: ",",
  groupSize: 3,
}

function toFixed(num, precision) {
    return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
}

export const getPPS = async function() {
  const { store } = this.props
  const syusd = store.get('syusdObject')
  if (!syusd) return
  const ppsRaw = await syusd.methods.getPricePerFullShare().call()
  if (ppsRaw === store.get('ppsRaw')) return
  store.set('ppsRaw', ppsRaw)
  let pps = toFixed(new WadDecimal(ppsRaw).div('1e18'), 5)
  store.set('pps', pps.toString())
}

export const getyUSDAllowance = async function() {
  const { store } = this.props
  const walletAddress = store.get('walletAddress')
  const yusd = store.get('yusdObject')
  if (!yusd || !walletAddress) return
  const yusdAllowance = await yusd.methods.allowance(walletAddress, syusdAddress).call()
  store.set('yusdAllowance', new WadDecimal(yusdAllowance).div('1e18'))
}

export const getyUSDBalance = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const yusd = store.get('yusdObject')
  if (!yusd || !walletAddress) return
  const yusdBalanceRaw = await yusd.methods.balanceOf(walletAddress).call()
  const yusdBalanceDecimal = new WadDecimal(yusdBalanceRaw).div('1e18')
  store.set('yusdBalanceDecimal', yusdBalanceDecimal)
  const yusdBalance = toFixed(parseFloat(web3.utils.fromWei(yusdBalanceRaw)),5)
  store.set('yusdBalance', yusdBalance)
}

export const getsyUSDBalance = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const syusd = store.get('syusdObject')
  const walletAddress = store.get('walletAddress')
  if (!syusd || !walletAddress) return
  const syusdBalanceRaw = await syusd.methods.balanceOf(walletAddress).call()
  const syusdUnderlyingBalanceRaw = await syusd.methods.balanceOfUnderlying(walletAddress).call()

  store.set('syusdBalanceRaw', syusdBalanceRaw)
  const syusdBalanceDecimal = new WadDecimal(syusdBalanceRaw).div('1e18')
  store.set('syusdBalanceDecimal', syusdBalanceDecimal)
  const syusdBalance = toFixed(parseFloat(web3.utils.fromWei(syusdBalanceRaw)),5)
  store.set('syusdBalance', syusdBalance)

  store.set('syusdUnderlyingBalanceRaw', syusdUnderlyingBalanceRaw)
  const syusdUnderlyingBalanceDecimal = new WadDecimal(syusdUnderlyingBalanceRaw).div('1e18')
  store.set('syusdUnderlyingBalanceDecimal', syusdUnderlyingBalanceDecimal)
  const syusdUnderlyingBalance = toFixed(parseFloat(web3.utils.fromWei(syusdUnderlyingBalanceRaw)),5)
  store.set('syusdUnderlyingBalance', syusdUnderlyingBalance)
}

export const getsyUSDTotalSupply = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const syusd = store.get('syusdObject')
  if (!syusd) return
  const syusdTotalSupplyRaw = await syusd.methods.totalSupply().call()
  const syusdTotalSupplyDecimal = new WadDecimal(syusdTotalSupplyRaw)
  store.set('syusdTotalSupply', syusdTotalSupplyDecimal.div('1e18'))
}

export const tosyUSD = function(yusdAmount) {
  const yusdDecimal = yusdAmount ? new WadDecimal(yusdAmount).div('1e18') : new WadDecimal(0)
  const { store } = this.props
  if (!store.get('pps')) return
  const ppsDecimal = new WadDecimal(store.get('pps'))
  return toFixed(yusdDecimal.mul(ppsDecimal),5)
}


export const toyUSD = function(syusdAmount) {
  const syusdDecimal = syusdAmount ? new WadDecimal(syusdAmount).div('1e18') : new WadDecimal(0)
  const { store } = this.props
  if (!store.get('pps')) return
  const ppsDecimal = new WadDecimal(store.get('pps'))
  return toFixed(syusdDecimal.div(ppsDecimal),5)
}


export const setupContracts = function () {
    const { store } = this.props
    const web3 = store.get('web3')
    store.set('yusdObject', new web3.eth.Contract(yusdABI, yusdAddress))
    store.set('syusdObject', new web3.eth.Contract(syusdABI, syusdAddress))
}

export const getData = async function() {
    getPPS.bind(this)()
    getyUSDAllowance.bind(this)()
    getyUSDBalance.bind(this)()
    getsyUSDBalance.bind(this)()
    getsyUSDTotalSupply.bind(this)()
}

const secondsInYear = WadDecimal(60 * 60 * 24 * 365)

export const initBrowserWallet = async function(prompt) {
    const store = this.props.store

    store.set('walletLoading', true)
    if (!localStorage.getItem('walletKnown') && !prompt) return

    let web3Provider

    // Initialize web3 (https://medium.com/coinmonks/web3-js-ethereum-javascript-api-72f7b22e2f0a)
    if (window.ethereum) {
        web3Provider = window.ethereum
        try {
            // Request account access
            await window.ethereum.enable()
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }

        window.ethereum.on('accountsChanged', (accounts) => {
            initBrowserWallet.bind(this)()
        })
    }
    // Legacy dApp browsers...
    else if (window.web3) {
        web3Provider = window.web3.currentProvider
    }
    // If no injected web3 instance is detected, display err
    else {
        console.log("Please install MetaMask!")
        store.set('web3Failure', true)
        return
    }

    const web3 = new Web3(web3Provider)
    const network = await web3.eth.net.getId()
    store.set('network', network)
    store.set('web3Failure', false)
    store.set('web3', web3)
    const walletType = 'browser'
    const accounts = await web3.eth.getAccounts()
    localStorage.setItem('walletKnown', true)
    store.set('walletLoading', false)
    store.set('walletAddress', accounts[0])
    store.set('walletType', walletType)
    setupContracts.bind(this)()
    getData.bind(this)()
}

export default {
    initBrowserWallet,
    tosyUSD,
    toyUSD
}
