import * as semver from "semver"

// simply adding fields can be done with this and initial value
export function fillMissingDeeply(userData: any, updatedDefault: any) {
  if (
    userData === null ||
    typeof userData !== "object" ||
    Array.isArray(userData)
  ) {
    // set user data if unappropriate
    userData = {}
  }
  if (
    updatedDefault === null ||
    typeof updatedDefault !== "object" ||
    Array.isArray(updatedDefault)
  ) {
    return userData
  }
  // circular defaults cannot be serialized safely
  const visiting = new WeakSet<object>()
  const merge = (target: any, defaults: any) => {
    if (visiting.has(defaults)) {
      throw new Error(
        "fillMissingDeeply: updatedDefault contains circular references",
      )
    }
    visiting.add(defaults)
    for (const key of Object.keys(defaults)) {
      const defaultVal = defaults[key]
      const targetVal = target[key]

      if (targetVal === undefined) {
        try {
          // clone with json stringify parse
          target[key] = JSON.parse(JSON.stringify(defaultVal))
        } catch {
          throw new Error(
            "fillMissingDeeply: default values must be JSON-serializable (no circular references)",
          )
        }
      } else if (
        typeof targetVal === "object" &&
        targetVal !== null &&
        !Array.isArray(targetVal) &&
        typeof defaultVal === "object" &&
        defaultVal !== null &&
        !Array.isArray(defaultVal)
      ) {
        // if both have fields, go one step in
        merge(targetVal, defaultVal)
      }
    }
    visiting.delete(defaults)
  }
  // run merge
  merge(userData, updatedDefault)
  return userData
}

// write path string like "first.second.third"
export class SchemaEditor {
  constructor(public data: any) {}
  // update
  map(fromStr: string, toStr: string, mapper?: (value: any) => any) {
    const value = this.get(fromStr)
    if (value === undefined) {
      return this
    }
    this.delete(fromStr)
    if (mapper) {
      this.create(toStr, mapper(value))
    } else {
      this.create(toStr, value)
    }
    return this
  }
  updateValue(pathStr: string, mapper: (value: any) => any) {
    const pathArr = pathStr.split(".")
    pathArr.reduce((acc, pathKey, index) => {
      if (acc === undefined || acc === null) return undefined
      if (index === pathArr.length - 1) {
        // update value and return
        acc[pathKey] = mapper(acc[pathKey])
        return
      }
      return acc[pathKey]
    }, this.data)
    return this
  }
  // create
  create(pathStr: string, value: any) {
    const pathArr = pathStr.split(".")
    pathArr.reduce((acc, pathKey, index) => {
      if (index === pathArr.length - 1) {
        // set value and return
        acc[pathKey] = value
        return acc[pathKey]
      }
      // create empty object if not exists
      if (acc[pathKey] === undefined || acc[pathKey] === null) {
        acc[pathKey] = {}
      }
      return acc[pathKey]
    }, this.data)
    return this
  }
  // delete
  delete(pathStr: string) {
    const pathArr = pathStr.split(".")
    pathArr.reduce((acc, pathKey, index) => {
      if (acc === undefined || acc === null) return undefined
      if (index === pathArr.length - 1) {
        delete acc[pathKey]
        return
      }
      return acc[pathKey]
    }, this.data)
    return this
  }
  // read
  private get(pathStr: string) {
    const pathArr = pathStr.split(".")
    return pathArr.reduce((acc, pathKey) => acc?.[pathKey], this.data)
  }
}

export type Migration = (editor: SchemaEditor) => void
export type TargetVersionMigrationRecord = Record<string, Migration>

// use this to run migrations
export class MigrationAggregator {
  constructor(private migrations: TargetVersionMigrationRecord) {}
  migrate(
    startingData: any,
    startingVersion: string,
    targetVersion?: string,
  ): any {
    const migarationVersions = Object.keys(this.migrations)
    const invalidMigrationVersions = migarationVersions.filter(
      (version) => semver.valid(version) === null,
    )
    if (invalidMigrationVersions.length > 0) {
      throw new Error(
        `Invalid migration version(s): ${invalidMigrationVersions.join(", ")}`,
      )
    }
    if (semver.valid(startingVersion) === null) {
      throw new Error(`Invalid starting version: ${startingVersion}`)
    }
    if (targetVersion !== undefined && semver.valid(targetVersion) === null) {
      throw new Error(`Invalid target version: ${targetVersion}`)
    }

    const pendingVersions = migarationVersions
      .filter((v) => semver.gt(v, startingVersion))
      .filter(targetVersion ? (v) => semver.lte(v, targetVersion) : () => true)
      .sort(semver.compare)
    console.log("[pendingVersions]", pendingVersions)

    const editor = new SchemaEditor(startingData)
    for (const version of pendingVersions) {
      const runMigration = this.migrations[version]
      runMigration(editor)
      console.log("[migration result]", version, editor.data)
    }
    console.log("[all migration done]", editor.data)
    return editor.data
  }
}
