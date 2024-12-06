export const defaultGetTransaction = {
  startDate: '',
  endDate: '',
  symbol: '',
  types: ''
}

export const defaultGetTransactionTypes = {
  startDate: 'timestamp',
  endDate: 'timestamp',
  symbol: 'string',
  types: ['TRADE', 'RECEIVE_AND_DELIVER', 'DIVIDEND_OR_INTEREST', 'ACH_RECEIPT', 'ACH_DISBURSEMENT', 'CASH_RECEIPT', 'CASH_DISBURSEMENT', 'ELECTRONIC_FUND', 'WIRE_OUT', 'WIRE_IN', 'JOURNAL', 'MEMORANDUM', 'MARGIN_CALL', 'MONEY_MARKET', 'SMA_ADJUSTMENT' ]
}