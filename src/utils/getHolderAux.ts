import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { Aux } from '../../generated/schema'

 
export function getHolderAux(): Aux{
    let holders = Aux.load('0')
    if (holders == null) {
        holders = new Aux('0')
        holders.value = new BigInt(0)
    }
    return holders as Aux
}