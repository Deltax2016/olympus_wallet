import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { Ohmie, Transaction } from '../generated/schema'
import { OlympusERC20 } from '../generated/OlympusERC20'
import { sOlympusERC20 } from '../generated/sOlympusERC20'
import { sOlympusERC20V2 } from '../generated/sOlympusERC20V2'

import { loadOrCreateOhmieBalance } from './OhmieBalances'
import { toDecimal } from './utils/Decimals'
import { getOHMUSDRate } from './utils/Price'
import { loadOrCreateContractInfo } from './utils/ContractInfo'
import { getHolderAux } from './utils/getHolderAux'
import {SOHM_ERC20_CONTRACTV2, SOHM_ERC20_CONTRACTV2_BLOCK, SOHM_ERC20_CONTRACT, OHM_ERC20_CONTRACT} from './utils/Constants'

export function loadOrCreateOHMie(addres: Address): Ohmie{
    let ohmie = Ohmie.load(addres.toHex())
    if (ohmie == null) {
        let holders = getHolderAux()
        holders.value = holders.value.plus(BigInt.fromI32(1))
        holders.save()

        ohmie = new Ohmie(addres.toHex())
        ohmie.active = true
        ohmie.save()
    }
    return ohmie as Ohmie
}

export function updateOhmieBalance(ohmie: Ohmie, transaction: Transaction): void{

    let balance = loadOrCreateOhmieBalance(ohmie, transaction.timestamp)

    let ohm_contract = OlympusERC20.bind(Address.fromString(OHM_ERC20_CONTRACT))
    let sohm_contract = sOlympusERC20.bind(Address.fromString(SOHM_ERC20_CONTRACT))
    balance.ohmBalance = toDecimal(ohm_contract.balanceOf(Address.fromString(ohmie.id)), 9)
    let sohmV1Balance = toDecimal(sohm_contract.balanceOf(Address.fromString(ohmie.id)), 9)
    balance.sohmBalance = sohmV1Balance


    //Price
    let usdRate = getOHMUSDRate()
    balance.dollarBalance = balance.ohmBalance.times(usdRate).plus(balance.sohmBalance.times(usdRate)).plus(balance.bondBalance.times(usdRate))
    balance.save()

    ohmie.lastBalance = balance.id;
    ohmie.save()
}