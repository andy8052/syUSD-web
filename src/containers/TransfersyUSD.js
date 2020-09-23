import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { WadDecimal, getData, toyUSD } from '../utils/web3Utils'
import { transfer } from '../actions/main'

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = () => ({
   input: {
        width: '100%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    actionButton: {
        marginTop: theme.spacing(2),
        margin: '0px auto'
    },
    actionButtonContainer: {
        width: '100%',
        textAlign: 'center'
    },
    accountBalance: {
        float: 'right',
    },
})

class TransfersyUSDContainer extends React.Component {
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

    transfer() {
        transfer.bind(this)()
    }

    handleInput(event) {
      const {store} = this.props
      try {
        store.set('transferAmount', new WadDecimal(event.target.value))
      } catch {
        if (event.target.value.length === 0) {
          store.set('transferAmount', new WadDecimal(0))
        } else {
          return
        }
      }
    }

    setMax() {
      const {store} = this.props
      const syusdBalanceDecimal = store.get('syusdBalanceDecimal')
      store.set('transferAmount', syusdBalanceDecimal)
    }


    render() {
        const {classes, store} = this.props

        const walletAddress = store.get('walletAddress')
        const syusdBalance = store.get('syusdBalance')
        const transferAmount = store.get('transferAmount')
        const transferAddress = store.get('transferAddress')
        const syusdBalanceDecimal = store.get('syusdBalanceDecimal')
        const web3 = store.get('web3');
        const isSignedIn = walletAddress && walletAddress.length

        const canTransfer = transferAmount && transferAddress && (transferAmount <= syusdBalanceDecimal)

        return <Grid container spacing={3}>
               <Grid item xs={12}><Card><CardContent>
        <Typography variant='h4'>Transfer syUSD</Typography>
        <Typography variant='subtitle2'>Send syUSD to any address</Typography>
        <Button variant='subtitle2' className={classes.accountBalance}
            style={{textTransform: 'none'}}
      onClick={this.setMax.bind(this)}
        >{syusdBalance ? `Balance: ${syusdBalance} syUSD` : '-'}</Button>
                <Grid container alignItems="start" spacing={3}>
                  <Grid item xs={12} md={6}>
        <TextField label='Receiving address' placeholder='0x' className={classes.input} margin="normal" variant="outlined" onChange={(event) => {
                            store.set('transferAddress', event.target.value)
                        }} />
        </Grid>
                          <Grid item xs={12} md={6} spacing={3}>
        <TextField label="syUSD Value"
            placeholder='0'
            className={classes.input}
            margin="normal"
            value={transferAmount.toString() !== "0" ? transferAmount : ''}
            variant="outlined"
            type="number"
            onChange={this.handleInput.bind(this)}
            InputProps={{inputProps: { min: 0 },
                        endAdornment: <InputAdornment className={classes.endAdornment} position="end">syUSD</InputAdornment>
                                       }}
            helperText={(isSignedIn && transferAmount) ? "Worth: ~" + toyUSD.bind(this)(transferAmount.mul(10**18)) + " yUSD": " "}
        />
                  </Grid>

               </Grid>
               <Box className={classes.actionButtonContainer}>
                  <Button color='primary'
                    size='large'
                    onClick={() => {
                        this.transfer()
                    }} variant="contained" disabled={!isSignedIn || !canTransfer} className={classes.actionButton}>
                    Transfer
                </Button>
              </Box>
            </CardContent></Card></Grid>
        </Grid>
    }
}

export default withStyles(styles)(withStore(TransfersyUSDContainer))
