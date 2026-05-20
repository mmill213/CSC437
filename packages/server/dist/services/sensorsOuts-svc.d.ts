import { Zones } from "../models";
declare function index(): Promise<Zones[]>;
declare function get(zoneId: string): Promise<Zones | undefined>;
declare function create(json: Zones): Promise<Zones>;
declare function update(id: string, zones: Zones): Promise<Zones | undefined>;
declare function remove(userid: string): Promise<void>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
