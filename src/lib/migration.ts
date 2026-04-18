export class SchemaEditor {
  constructor(public data: any) {}
  move(from: string, to: string, mapper?: (value: any) => any) {
    const value = this.get(from)
    this.remove(from)
    this.set(to, value)
    return this
  }
  updateValue(path: string, mapper: (value: any) => any) {}
  remove(path: string) {
    /* ... split('.') logic ... */ return this
  }

  set(path: string, value: any) {
    /* ... */ return this
  }
  get(path: string) {
    /* ... */
  }
  // commit(nextVersion: string, versionText: string = "extVersion") {
  //   this.result.version = nextVersion
  //   return this.result
  // }
}

// class SchemaEditor {
//   constructor(data) {
//     this.result = { ...data };
//   }

//   rename(oldKey, newKey) {
//     if (oldKey in this.result) {
//       this.result[newKey] = this.result[oldKey];
//       delete this.result[oldKey];
//     }
//     return this;
//   }

//   remove(key) {
//     delete this.result[key];
//     return this;
//   }

//   add(key, defaultValue) {
//     this.result[key] = defaultValue;
//     return this;
//   }

//   map(key, fn) {
//     if (key in this.result) {
//       this.result[key] = fn(this.result[key]);
//     }
//     return this;
//   }

//   commit(nextVersion) {
//     this.result.version = nextVersion;
//     return this.result;
//   }
// }

export type Migration = (editor: SchemaEditor) => void
export type TargetVersionMigrationRecord = Record<string, Migration>

// use this to run migrations
export class MigrationAggregator {
  constructor(private migrations: TargetVersionMigrationRecord) {}

  migrate(data: any, targetVersion: number): any {}
}
