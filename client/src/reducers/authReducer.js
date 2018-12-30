const initialState = {
  isAuthenticated: false,
  user: {},
  test: "test"
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
