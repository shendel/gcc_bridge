
export const REQUEST_STATUS = {
  PENDING:  0,
  READY:    1,
  REJECT:   2,
  REFUNDED: 3,
}

export const REJECT_ACTIONS = {
  NONE:     0,
  REFUND:   1,
  BURN:     2,
  RESOLVE:  3
}

export const REQUEST_STATUS_LABELS = {
  0: 'Pending',
  1: 'Bridged',
  2: 'Rejected',
  3: 'Refunded'
}

export const REJECT_ACTIONS_LABELS = {
  0: 'None',
  1: 'Refunded to sender',
  2: 'Burned',
  3: 'Sended to oracle'
}

