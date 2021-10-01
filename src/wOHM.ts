import { loadOrCreateTransaction } from "./utils/Transactions"
import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { loadOrCreateOHMie, updateOhmieBalance } from "./OHM"
import { OHM_ERC20_CONTRACT } from './utils/Constants'
import { toDecimal } from './utils/Decimals'
import { getOHMUSDRate } from './utils/Price';
import {
  wOHM,
  Transfer
} from "../generated/wOHM/wOHM"

export function handleTransfer(event: Transfer): void {
    let transaction = loadOrCreateTransaction(event.transaction, event.block)
    let ohmie_from = loadOrCreateOHMie(event.params.from)
    //let ohmie_to = loadOrCreateOHMie(event.transaction.to)
    log.debug("Transfer event on TX {} with amount {}", [event.params.from.toString(), event.params.value.toString()])
    updateOhmieBalance(ohmie_from, transaction)
    //updateOhmieBalance(ohmie_to, transaction)
}