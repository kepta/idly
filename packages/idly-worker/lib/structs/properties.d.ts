export interface Properties {
    readonly visible?: boolean;
    readonly version?: number;
    readonly timestamp?: string;
    readonly changeset?: string;
    readonly uid?: string;
    readonly user?: string;
}
export declare function propertiesGen({visible, version, timestamp, changeset, uid, user}: {
    visible?: boolean;
    version?: number;
    timestamp?: string;
    changeset?: string;
    uid?: string;
    user?: string;
}): Properties;
