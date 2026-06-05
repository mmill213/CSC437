import { Provider, Service, Message } from '@unbndl/service';
import { Context } from '@unbndl/html';
declare const AUTH_CONTEXT_DEFAULT = "context:auth";
interface AuthModel {
    authenticated: boolean;
    username?: string;
    token?: string;
}
interface AuthSuccessful {
    token: string;
    redirect?: string;
}
type AuthMsg = ["auth/signin", AuthSuccessful] | ["auth/signout"] | ["auth/redirect"];
declare class APIUser {
    static TOKEN_KEY: string;
    authenticated: boolean;
    username: string;
    constructor(username?: string);
    static deauthenticate(user: APIUser): APIUser;
}
declare class AuthenticatedUser extends APIUser {
    token: string | undefined;
    constructor(token: string);
    static authenticate(token: string): AuthenticatedUser;
    static authenticateFromLocalStorage(): APIUser;
}
declare class AuthService extends Service<AuthMsg, AuthModel> {
    static EVENT_TYPE: string;
    _redirectForLogin: string | undefined;
    constructor(context: Context<AuthModel>, redirectForLogin: string | undefined);
    update(message: AuthMsg, model: AuthModel): AuthModel | Message.Async<AuthModel, AuthMsg>;
}
declare class AuthProvider extends Provider<AuthModel> {
    get redirect(): string | undefined;
    constructor();
    connectedCallback(): void;
}
declare const dispatch: (target: HTMLElement, ...msg: AuthMsg) => boolean;
declare function authHeaders(auth: AuthModel): {
    Authorization?: string;
};
declare function tokenPayload(user: APIUser | AuthenticatedUser): object;
export { AUTH_CONTEXT_DEFAULT as CONTEXT_DEFAULT, AuthenticatedUser, dispatch, authHeaders as headers, tokenPayload as payload, AuthProvider as Provider, APIUser as User, type AuthSuccessful, type AuthModel as Model, type AuthMsg as Message, type AuthService as Service };
