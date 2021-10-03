export interface TreeGridNode<T> {
    data: T;
    children?: TreeGridNode<T>[];
    expanded?: boolean;
    // uid: number;
    // editedProperty?: string;
    // tabIndex: number;
}
