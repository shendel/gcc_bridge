
export const REQUEST_STATUS = {
  PENDING:  0,
  READY:    1,
  REJECT:   2,
  REFUNDED: 3,
}

export const REJECT_ACTIONS = {
  REFUND:   0,
  BURN:     1,
  RESOLVE:  2
}

export const REQUEST_STATUS_LABELS = {
  0: 'Pending',
  1: 'Bridged',
  2: 'Rejected',
  3: 'Refunded'
}

export const REJECT_ACTIONS_LABELS = {
  0: 'Refunded to sender',
  1: 'Burned',
  2: 'Sended to oracle'
}

