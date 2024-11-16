import Item from '@/models/ItemModel';

class TreeStore {
  private items: Item[];
  private idMap: Map<number | string, Item>;
  private parentMap: Map<number | string | null, Set<Item>>;

  constructor(items: Item[]) {
    this.items = items;
    this.idMap = new Map();
    this.parentMap = new Map();

    for (const item of items) {
      this.idMap.set(item.id, item);

      if (!this.parentMap.has(item.parent)) {
        this.parentMap.set(item.parent, new Set());
      }
      this.parentMap.get(item.parent)?.add(item);
    }

    console.log(this.idMap);
    console.log(this.parentMap);
  }

  getAll(): Item[] {
    return this.items;
  }

  getItem(id: number | string): Item | undefined {
    return this.idMap.get(id);
  }

  getChildren(id: number | string): Item[] {
    return Array.from(this.parentMap.get(id) || []);
  }

  getAllChildren(id: number | string): Item[] {
    const result: Item[] = [];
    const stack = [...(this.parentMap.get(id) || [])];

    while (stack.length > 0) {
      const current = stack.pop()!;
      result.push(current);

      stack.push(...(this.parentMap.get(current.id) || []));
    }

    return result;
  }

  getAllParents(id: number | string): Item[] {
    const result: Item[] = [];
    let current = this.getItem(id);

    if (current) result.push(current);

    while (current && current.parent !== null) {
      current = this.getItem(current.parent);
      if (current) result.push(current);
    }

    return result.reverse();
  }
}

export default TreeStore;
