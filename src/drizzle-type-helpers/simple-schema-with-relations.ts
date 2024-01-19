/*


type DB = typeof db
type DbSchemas = NonNullable<DB['_']['schema']>

export type SchemaRelations<
   TTableName extends keyof DbSchemas,
   TExcludeRelations extends keyof NonNullable<DbSchemas[TTableName]['relations']> = never,
> = Exclude<keyof NonNullable<DbSchemas[TTableName]['relations']>, TExcludeRelations>

export type SchemaWithRelations<
   TTableName extends keyof DbSchemas,
   TInclude extends SchemaRelations<TTableName> = never
> = BuildQueryResult<DbSchemas, DbSchemas[TTableName], { with: { [Key in TInclude]: true } }>

*/