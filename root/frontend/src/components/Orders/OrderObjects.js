export const defaultGetOrder = {
  maxResults: 3000,
  fromEnteredTime: '',
  toEnteredTime: '',
  status: ''
}

export const defaultGetOrderTypes = {
  maxResults: 'number',
  fromEnteredTime: 'timestamp',
  toEnteredTime: 'timestamp',
  status: [ 'AWAITING_PARENT_ORDER', 'AWAITING_CONDITION', 'AWAITING_STOP_CONDITION', 'AWAITING_MANUAL_REVIEW', 'ACCEPTED', 'AWAITING_UR_OUT', 'PENDING_ACTIVATION', 'QUEUED', 'WORKING', 'REJECTED', 'PENDING_CANCEL', 'CANCELED', 'PENDING_REPLACE', 'REPLACED', 'FILLED', 'EXPIRED', 'NEW', 'AWAITING_RELEASE_TIME', 'PENDING_ACKNOWLEDGEMENT', 'PENDING_RECALL', 'UNKNOWN' ]
}