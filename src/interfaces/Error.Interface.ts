import MessageResponse from "./MessageResponse";

export default interface IErrorMessage extends MessageResponse {
    stack?: string
}

