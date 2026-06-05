import { default as Route } from 'route-parser';
import { Template } from '@unbndl/html';
import { Auth } from '@unbndl/auth';
type RouteParams = {
    [key: string]: string;
};
interface RouteData {
    params: RouteParams;
    query: URLSearchParams;
    user?: Auth.Model;
}
type RouteView = Template<[RouteData]>;
type RouteRedirect = string | ((arg: RouteParams) => string);
interface MatchPath {
    path: string;
    query?: URLSearchParams;
    params?: RouteParams;
}
interface CaseRoute {
    route: Route;
}
interface SwitchPath {
    path: string;
}
interface ViewCase {
    view: RouteView;
    auth?: "public" | "protected";
}
interface RedirectCase {
    redirect: RouteRedirect;
}
type SwitchRoute = SwitchPath & (ViewCase | RedirectCase);
type Case = CaseRoute & (ViewCase | RedirectCase);
type Match = MatchPath & (ViewCase | RedirectCase);
interface SwitchData {
    authenticated: boolean;
    username?: string;
    location?: Location;
}
export declare class Switch extends HTMLElement {
    viewModel: import('@unbndl/view').ViewModel<SwitchData>;
    _cases: Case[];
    _routeView: Template<[RouteData]>;
    _routeViewModel: import('@unbndl/view').ViewModel<RouteData>;
    constructor(routes: SwitchRoute[]);
    routeToView(location: Location, authenticated?: boolean, username?: string): Template<[RouteData]>;
    matchRoute(location: Location): Match | undefined;
    redirect(href: string): void;
}
export { Switch as Element, type RouteData as Args, type SwitchRoute as Route };
