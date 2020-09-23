import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { getData } from '../utils/web3Utils'

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

import { toyUSD } from '../utils/web3Utils';

import yUSDLogo from '../assets/yUSD.png'

const styles = () => ({
    container: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        minHeight: 52
    },
})

class BalanceContainer extends React.Component {

    async componentDidMount() {
        // update data periodically
        this.watchData()
    }

    async watchData() {
        await getData.bind(this)();
        setInterval(() => {
            getData.bind(this)();
        }, 10 * 1000);
    }

    render() {
        const {store} = this.props
        const pps = store.get('pps')
        const syUSDBalance = store.get('syusdBalance')
        const syUSDBalanceRaw = store.get('syusdBalanceRaw')
        const yUSDEquiv = syUSDBalanceRaw ? toyUSD.bind(this)(syUSDBalanceRaw) : undefined
      return <Card ><CardContent>
        <h2>You have {syUSDBalance ? `${syUSDBalance}` : '0'} syUSD</h2>
                 <CardMedia
         component="img"
                  style={{resizeMode: 'contain',     width: 100, float: 'right', paddingRight: 52
}}
        src={yUSDLogo}
         />

        <p>yUSD underlying balance: {syUSDBalance ? yUSDEquiv : '0'}</p>
        <p>1 yUSD = {pps ? `${pps}` : '?'} syUSD</p>
        {/* <p>Dai Savings Rate: {dsrPercent ? `${dsrPercent}% per year` : '-'}</p> */}
        <a target="_blank" href="/about.html" rel="noopener noreferrer">Learn more</a>
        </CardContent></Card>
    }
}

export default withStyles(styles)(withStore(BalanceContainer))
