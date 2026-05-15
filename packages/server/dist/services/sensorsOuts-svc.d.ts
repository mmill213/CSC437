import { Zones } from "../models";
declare function index(): Promise<Zones[]>;
declare function get(zoneId: string): Promise<Zones | undefined>;
declare const _default: {
    index: typeof index;
    get: typeof get;
};
export default _default;
