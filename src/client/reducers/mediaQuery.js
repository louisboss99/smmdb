export const ScreenSize = {
  SUPER_SMALL: 0, // width < 700px
  SMALL: 1, // 700px <= width < 1000px
  MEDIUM: 2, // 1000px <= width < 1360px
  LARGE: 3 // 1360px <= width
}

export default function mediaQuery (state, action) {
  if (!action) return state
  switch (action.type) {
    case 'MEDIA_QUERY':
      state = state.set('screenSize', action.screenSize)
      return state
  }
  return state
}
