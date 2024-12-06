export const fullOrderObject = {
  session: 'NORMAL',
  duration: 'DAY',
  orderType: 'MARKET',
  cancelTime: '',
  complexOrderStrategyType: 'NONE',
  quantity: 0,
  filledQuantity: 0,
  remainingQuantity: 0,
  requestedDestination: 'AUTO',
  destinationLinkName: '',
  releaseTime: '',
  stopPrice: 0,
  stopPriceLinkBasis: 'MANUAL',
  stopPriceLinkType: 'VALUE',
  stopPriceOffset: 0,
  stopType: 'STANDARD',
  priceLinkBasis: 'MANUAL',
  priceLinkType: 'VALUE',
  price: 0,
  taxLotMethod: 'FIFO',
  orderLegCollection: [
    {
      orderLegType: 'EQUITY',
      legId: 0,
      instrument: {
        assetType: 'EQUITY',
        cusip: '',
        symbol: '',
        description: '',
        instrumentId: 0,
        netChange: 0,
        type: 'SWEEP_VEHICLE'
      },
      instruction: 'BUY',
      positionEffect: 'OPENING',
      quantity: 0,
      quantityType: 'ALL_SHARES',
      divCapGains: 'REINVEST',
      toSymbol: ''
    }
  ],
  activationPrice: 0,
  specialInstruction: 'ALL_OR_NONE',
  orderStrategyType: 'SINGLE',
  orderId: 0,
  cancelable: false,
  editable: false,
  status: 'AWAITING_PARENT_ORDER',
  enteredTime: '',
  closeTime: '',
  accountNumber: 0,
  orderActivityCollection: [
    {
      activityType: 'EXECUTION',
      executionType: 'FILL',
      quantity: 0,
      orderRemainingQuantity: 0,
      executionLegs: [
        {
          legId: 0,
          price: 0,
          quantity: 0,
          mismarkedQuantity: 0,
          instrumentId: 0,
          time: ''
        }
      ]
    }
  ],
  replacingOrderCollection: ['string'],
  childOrderStrategies: ['string'],
  statusDescription: ''
}

export const orderObjectTypes = {
  session: [ 'NORMAL', 'AM', 'PM', 'SEAMLESS' ],
  duration: [ 'DAY', 'GOOD_TILL_CANCEL', 'FILL_OR_KILL', 'IMMEDIATE_OR_CANCEL', 'END_OF_WEEK', 'END_OF_MONTH', 'NEXT_END_OF_MONTH', 'UNKNOWN' ],
  orderType: [ 'MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT', 'TRAILING_STOP', 'CABINET', 'NON_MARKETABLE', 'MARKET_ON_CLOSE', 'EXERCISE', 'TRAILING_STOP_LIMIT', 'NET_DEBIT', 'NET_CREDIT', 'NET_ZERO', 'LIMIT_ON_CLOSE', 'UNKNOWN' ],
  cancelTime: 'timestamp',
  complexOrderStrategyType: [ 'NONE', 'COVERED', 'VERTICAL', 'BACK_RATIO', 'CALENDAR', 'DIAGONAL', 'STRADDLE', 'STRANGLE', 'COLLAR_SYNTHETIC', 'BUTTERFLY', 'CONDOR', 'IRON_CONDOR', 'VERTICAL_ROLL', 'COLLAR_WITH_STOCK', 'DOUBLE_DIAGONAL', 'UNBALANCED_BUTTERFLY', 'UNBALANCED_CONDOR', 'UNBALANCED_IRON_CONDOR', 'UNBALANCED_VERTICAL_ROLL', 'MUTUAL_FUND_SWAP', 'CUSTOM' ],
  quantity: 'number',
  filledQuantity: 'number',
  remainingQuantity: 'number',
  requestedDestination: [ 'INET', 'ECN_ARCA', 'CBOE', 'AMEX', 'PHLX', 'ISE', 'BOX', 'NYSE', 'NASDAQ', 'BATS', 'C2', 'AUTO' ],
  destinationLinkName: 'string',
  releaseTime: 'timestamp',
  stopPrice: 'number',
  stopPriceLinkBasis: [ 'MANUAL', 'BASE', 'TRIGGER', 'LAST', 'BID', 'ASK', 'ASK_BID', 'MARK', 'AVERAGE' ],
  stopPriceLinkType: [ 'VALUE', 'PERCENT', 'TICK' ],
  stopPriceOffset: 'number',
  stopType: [ 'STANDARD', 'BID', 'ASK', 'LAST', 'MARK' ],
  priceLinkBasis: [ 'MANUAL', 'BASE', 'TRIGGER', 'LAST', 'BID', 'ASK', 'ASK_BID', 'MARK', 'AVERAGE' ],
  priceLinkType: [ 'VALUE', 'PERCENT', 'TICK' ],
  price: 'number',
  taxLotMethod: [ 'FIFO', 'LIFO', 'HIGH_COST', 'LOW_COST', 'AVERAGE_COST', 'SPECIFIC_LOT', 'LOSS_HARVESTER' ],
  orderLegCollection: [
    {
      orderLegType: [ 'EQUITY', 'OPTION', 'INDEX', 'MUTUAL_FUND', 'CASH_EQUIVALENT', 'FIXED_INCOME', 'CURRENCY', 'COLLECTIVE_INVESTMENT' ],
      legId: 'number',
      instrument: {
        assetType: [ 'EQUITY', 'OPTION', 'INDEX', 'MUTUAL_FUND', 'CASH_EQUIVALENT', 'FIXED_INCOME', 'CURRENCY', 'COLLECTIVE_INVESTMENT' ],
        cusip: 'string',
        symbol: 'string',
        description: 'string',
        instrumentId: 'number',
        netChange: 'number',
        type: [ 'SWEEP_VEHICLE', 'SAVINGS', 'MONEY_MARKET_FUND', 'UNKNOWN' ]
      },
      instruction: [ 'BUY', 'SELL', 'BUY_TO_COVER', 'SELL_SHORT', 'BUY_TO_OPEN', 'BUY_TO_CLOSE', 'SELL_TO_OPEN', 'SELL_TO_CLOSE', 'EXCHANGE', 'SELL_SHORT_EXEMPT' ],
      positionEffect: [ 'OPENING', 'CLOSING', 'AUTOMATIC' ],
      quantity: 'number',
      quantityType: [ 'ALL_SHARES', 'DOLLARS', 'SHARES' ],
      divCapGains: [ 'REINVEST', 'PAYOUT' ],
      toSymbol: 'string'
    }
  ],
  activationPrice: 'number',
  specialInstruction: [ 'ALL_OR_NONE', 'DO_NOT_REDUCE', 'ALL_OR_NONE_DO_NOT_REDUCE' ],
  orderStrategyType: [ 'SINGLE', 'CANCEL', 'RECALL', 'PAIR', 'FLATTEN', 'TWO_DAY_SWAP', 'BLAST_ALL', 'OCO', 'TRIGGER' ],
  orderId: 'number',
  cancelable: 'boolean',
  editable: 'boolean',
  status: [ 'AWAITING_PARENT_ORDER', 'AWAITING_CONDITION', 'AWAITING_STOP_CONDITION', 'AWAITING_MANUAL_REVIEW', 'ACCEPTED', 'AWAITING_UR_OUT', 'PENDING_ACTIVATION', 'QUEUED', 'WORKING', 'REJECTED', 'PENDING_CANCEL', 'CANCELED', 'PENDING_REPLACE', 'REPLACED', 'FILLED', 'EXPIRED', 'NEW', 'AWAITING_RELEASE_TIME', 'PENDING_ACKNOWLEDGEMENT', 'PENDING_RECALL', 'UNKNOWN' ],
  enteredTime: 'timestamp',
  closeTime: 'timestamp',
  accountNumber: 'number',
  orderActivityCollection: [
    {
      activityType: [ 'EXECUTION', 'ORDER_ACTION' ],
      executionType: [ 'FILL' ],
      quantity: 'number',
      orderRemainingQuantity: 'number',
      executionLegs: [
        {
          legId: 'number',
          price: 'number',
          quantity: 'number',
          mismarkedQuantity: 'number',
          instrumentId: 'number',
          time: 'timestamp'
        }
      ]
    }
  ],
  replacingOrderCollection: 'keyValueArray',
  childOrderStrategies: 'keyValueArray',
  statusDescription: 'string'
}
