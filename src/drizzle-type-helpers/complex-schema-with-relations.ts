/*


type Prettify<T> = { [Key in keyof T]: T[Key] }
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends ((x: infer I) => void) ? I : never

type DB = typeof db
type DbSchemas = NonNullable<DB['_']['schema']>

type SimplifiedDBQueryConfig<TSchema extends TablesRelationalConfig = TablesRelationalConfig, TTableConfig extends TableRelationalConfig = TableRelationalConfig> = {
   columns?: {
      [K in keyof TTableConfig['columns']]?: boolean;
   };
   with?: {
      [K in keyof TTableConfig['relations']]?: true | SimplifiedDBQueryConfig<TSchema, FindTableByDBName<TSchema, TTableConfig['relations'][K]['referencedTableName']>>;
   };
}

type TableRelations<
   TableName extends keyof DbSchemas,
   TExclude extends keyof NonNullable<DbSchemas[TableName]['relations']> = never,
> = Exclude<keyof NonNullable<DbSchemas[TableName]['relations']>, TExclude> | undefined | Omit<SimplifiedDBQueryConfig<DbSchemas, DbSchemas[TableName]>, TExclude>

type Table<
   TableName extends keyof DbSchemas,
   TInclude extends TableRelations<TableName> = never
> = Prettify<UnionToIntersection<TInclude extends Record<string, unknown> ? BuildQueryResult<DbSchemas, DbSchemas[TableName], { with: TInclude['with'] }>
   : BuildQueryResult<DbSchemas, DbSchemas[TableName], TInclude extends string ? { with: { [Key in TInclude]: true } } : {}>>>


*/