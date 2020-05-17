let user = {};

export const setUserAuthFile = (userItem = {}) => user = userItem;

export const isAllowed = (permission) =>
    user.permissions ? user.permissions.includes(permission) : false;

/*
 {isAllowed("Create-Article") &&  }
* */