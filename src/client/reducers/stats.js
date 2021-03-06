import {
  Map
} from 'immutable'

export default function stats (state, action) {
  if (!action) return state
  switch (action.type) {
    case 'SET_STATS':
      state = Map(action.stats)
      return state
  }
  return state
}
