const createStorage = ({prefixKey = "", storage = localStorage} = {}) => {
    const store = class StorageKeep {
        private prefixKey?: string = prefixKey;
        private storage: Storage = storage;

        // 获取关键字
        private getOrCreatKey(key: string) {
            return `${this.prefixKey}${key}`.toUpperCase()
        }

        // 设置存储
        set(key: string, value: any): void {
            this.storage.setItem(this.getOrCreatKey(key), JSON.stringify(value))
        }
        // 根据关键字获取对象
        get(key: string): any {
            const item: string = this.storage.getItem(this.getOrCreatKey(key))!;// 断言为字符串
            return JSON.parse(item)
        }
        // 移除对象
        remove(key: string): void {
            this.storage.removeItem(this.getOrCreatKey(key))
        }
        // 清除所有
        clear(): void{
            this.storage.clear()
        }
    }
    return new store;
}

export {createStorage}