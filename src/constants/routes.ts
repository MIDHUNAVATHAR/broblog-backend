export const ROUTE_PATHS = {
    AUTH: {
        ROOT: "/",
        SIGNUP: "/auth/signup",
        LOGIN: "/auth/login",
        REFRESH_TOKEN: "/auth/refresh-token",
        LOGOUT: "/auth/logout"
    },
    BLOGS: {
        ROOT: "/",
        CREATE: "/blogs",
        GET_ALL: "/blogs",
        GET_MY: "/blogs/my-blogs",
        GET_BY_ID: "/blogs/:id",
        UPDATE: "/blogs/:id",
        DELETE: "/blogs/:id",
        LIKE: "/blogs/:id/like"
    },
    UPLOAD: "/upload"
} as const;
