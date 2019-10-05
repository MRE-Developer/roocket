const userReducer = (state = {
    isAuthenticated :false,
    user: {}
}, action) => {
    switch (action.type) {
        case "SET_IS_AUTHENTICATED" :
            state = {
                ...state ,
                isAuthenticated : action.payload
            };
            break;
        case "SET_USER" :
            state = {
                ...state,
                user: action.payload
            };
            break;
        case "REMOVE_USER" :
            state = {
                ...state,
                user: action.payload
            };
            break;
        default :
            break;
    }
    return state;
};

export default userReducer;