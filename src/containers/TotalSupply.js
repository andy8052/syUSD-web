import React from 'react';

import {withStore} from '@spyna/react-store'

class TotalSupplyContainer extends React.Component {
    render() {
      const {store} = this.props
      let syUSDTotalSupply = store.get('syusdTotalSupply')
      if (syUSDTotalSupply) {
        syUSDTotalSupply = syUSDTotalSupply.toFormat(2, {groupSeparator: ',', groupSize: 3})
        return (<p>syUSD generated from yUSD: {syUSDTotalSupply} syUSD</p>)
      } else {
        return ""
      }
    }
}

export default withStore(TotalSupplyContainer)
