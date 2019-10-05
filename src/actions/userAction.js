export function setIsAuthenticated(boolean) {
    return {
        type: "SET_IS_AUTHENTICATED",
        payload: boolean
    };
}

export function setUser(user) {
    return {
        type: "SET_USER",
        payload: user
    };
}

export function removeUser() {
    return {
        type: "REMOVE_USER",
        payload: {}
    };
}