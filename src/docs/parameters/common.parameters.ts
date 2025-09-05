export const commonParameters = {
    clientType: {
        name: "client_type",
        in: "query",
        required: true,
        schema: { type: "integer", enum: [1, 2, 3, 4] }, // 1=Android, 2=iOS, 3=Web, 4=Web-Admin
        default: 3,
        description: "Type of client making the request",
    },
    clientVersion: {
        name: "client_version",
        in: "query",
        required: false,
        schema: { type: "string", example: "10000", minimum: 1 },
        description: "Version of the client",
    },
};
